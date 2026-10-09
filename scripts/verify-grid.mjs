/**
 * One-off: verify a candidate anchor grid for /preview-home-2's hero stage
 * against real layout numbers, without touching the component.
 *
 * Reads the true card heights and the stage/container size from a headless
 * Chrome (the harness browser is pinned to a phone viewport where the desktop
 * slots do not exist), then places six cards on a proposed 3×2 grid using the
 * same anchor formulas the component uses (`left-0`, `mx-auto`, `bottom-16`,
 * …) and reports any pair whose rectangles intersect — at several viewport
 * widths, because the grid has to hold from `lg` (1024) up to wide desktop.
 *
 *   node scripts/verify-grid.mjs
 */
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const PORT = 9334;
const URL = "http://localhost:3000/preview-home-2";
const CHROME =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

/** Top row: chat (left), crm (centre), order (right). */
/** Bottom row: marketing (left), mini (centre), consulting (right). */
const GRID = [
  { name: "chat", row: "top", col: "left" },
  { name: "crm", row: "top", col: "center" },
  { name: "order", row: "top", col: "right" },
  { name: "marketing", row: "bottom", col: "left" },
  { name: "mini", row: "bottom", col: "center" },
  { name: "consulting", row: "bottom", col: "right" },
];

const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--user-data-dir=/tmp/cdp-verify-profile",
    "about:blank",
  ],
  { stdio: "ignore" },
);
const teardown = () => {
  try {
    chrome.kill("SIGKILL");
  } catch {
    /* already gone */
  }
};
process.on("exit", teardown);

async function targets() {
  for (let i = 0; i < 60; i += 1) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const list = await res.json();
      const page = list.find((t) => t.type === "page");
      if (page) return page;
    } catch {
      /* not up yet */
    }
    await sleep(200);
  }
  throw new Error("CDP never came up");
}

const page = await targets();
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  ws.addEventListener("open", resolve, { once: true });
  ws.addEventListener("error", reject, { once: true });
});
let seq = 0;
const pending = new Map();
ws.addEventListener("message", (event) => {
  const msg = JSON.parse(event.data);
  const entry = pending.get(msg.id);
  if (!entry) return;
  pending.delete(msg.id);
  if (msg.error) entry.reject(new Error(msg.error.message));
  else entry.resolve(msg.result);
});
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const id = (seq += 1);
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
const evaluate = async (expression) => {
  const { result, exceptionDetails } = await send("Runtime.evaluate", {
    returnByValue: true,
    expression,
  });
  if (exceptionDetails)
    throw new Error(exceptionDetails.exception?.description ?? exceptionDetails.text);
  return result.value;
};

await send("Page.enable");

/**
 * Returns the resting geometry of the stage: container height, scale, and each
 * card's true (unscaled) height, in DOM order — slot 0 is chat, 1 order,
 * 2 crm, 3 mini, 4 consulting, 5 marketing.
 */
const measure = async (width) => {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await send("Page.navigate", { url: URL });
  await sleep(4000);
  await evaluate(`(() => {
    [...document.querySelectorAll("button[aria-pressed]")].forEach((b) => {
      if (b.getAttribute("aria-pressed") === "false") b.click();
    });
    return 1;
  })()`);
  await sleep(1200);
  const raw = await evaluate(`(() => {
    const holder = document.querySelector(".ph2-stage-scale .ph2-gate > div.relative");
    const hr = holder.getBoundingClientRect();
    const scale = hr.width ? hr.width / hr.width : 1;
    // The stage's own transform tells us the scale the rects are painted at.
    const stageEl = document.querySelector(".ph2-stage-scale");
    const st = new DOMMatrixReadOnly(getComputedStyle(stageEl).transform);
    const cards = [...document.querySelectorAll(".ph2-stage-scale .ph2-anim.absolute")]
      .map((sh) => {
        const r = sh.getBoundingClientRect();
        return { label: (sh.textContent || "").replace(/^\\s*×\\s*/, "").trim().slice(0, 22),
                 x: r.x, y: r.y, w: r.width, h: r.height };
      });
    // Anchor top-left of the container in the same (transformed) space.
    const c = { x: hr.x, y: hr.y, w: hr.width, h: hr.height };
    return JSON.stringify({ scale: st.a, cards, c, vw: innerWidth });
  })()`);
  return JSON.parse(raw);
};

/**
 * Place one card the way the component does, in unscaled container space.
 * `row` picks the vertical anchor, `col` the horizontal one.
 */
const place = ({ row, col }, cardW, cardH, W, H) => {
  const TOP = 128; // lg:top-32
  const BOTTOM = 16; // lg:bottom-4
  const y = row === "top" ? TOP : H - BOTTOM - cardH;
  let x;
  if (col === "left") x = 0;
  else if (col === "right") x = W - cardW;
  else x = (W - cardW) / 2; // mx-auto
  return { x, y, w: cardW, h: cardH };
};

const report = [];
for (const width of [1024, 1100, 1280, 1440, 1728]) {
  const m = await measure(width);
  const S = m.scale;
  // Container in unscaled units, and card heights likewise.
  const W = m.c.w / S;
  const H = m.c.h / S;
  const cardW = m.cards[0].w / S;
  // slot order → heights: chat 0, order 1, crm 2, mini 3, consulting 4, marketing 5
  const heights = {
    chat: m.cards[0].h / S,
    order: m.cards[1].h / S,
    crm: m.cards[2].h / S,
    mini: m.cards[3].h / S,
    consulting: m.cards[4].h / S,
    marketing: m.cards[5].h / S,
  };
  const placed = GRID.map((slot) => ({
    ...slot,
    ...place(slot, cardW, heights[slot.name], W, H),
  }));
  const overlaps = [];
  for (let a = 0; a < placed.length; a++) {
    for (let b = a + 1; b < placed.length; b++) {
      const A = placed[a];
      const B = placed[b];
      const ox =
        Math.min(A.x + A.w, B.x + B.w) - Math.max(A.x, B.x);
      const oy =
        Math.min(A.y + A.h, B.y + B.h) - Math.max(A.y, B.y);
      if (ox > 0 && oy > 0)
        overlaps.push(`${A.name}×${B.name} ${Math.round(ox)}x${Math.round(oy)}`);
    }
  }
  report.push({
    width,
    container: `${Math.round(W)}x${Math.round(H)}`,
    cardW: Math.round(cardW),
    heights: Object.fromEntries(
      Object.entries(heights).map(([k, v]) => [k, Math.round(v)]),
    ),
    overlaps,
    placed: placed.map(
      (p) =>
        `${p.name}(${p.row[0]}${p.col[0]}) x${Math.round(p.x)}..${Math.round(p.x + p.w)} y${Math.round(p.y)}..${Math.round(p.y + p.h)}`,
    ),
  });
}
console.log(JSON.stringify(report, null, 1));
ws.close();
teardown();
process.exit(0);
