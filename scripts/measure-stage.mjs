/**
 * One-off: measure the real desktop geometry of /preview-home-2's hero stage
 * against a headless Chrome over CDP (no dependencies — Node's own WebSocket).
 *
 * The harness browser tool is pinned to a phone-width viewport, where every
 * desktop slot is `display:none` and measures 0×0, so it cannot answer "which
 * cards overlap?". This script opens the same URL at a real desktop size and
 * reports, for every pair of windows, exactly how much their rectangles
 * intersect — the number that decides whether a click on a visible pixel can
 * reach the card it lands on.
 *
 *   node scripts/measure-stage.mjs [width]
 */
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const WIDTH = Number(process.argv[2] ?? 1440);
const HEIGHT = 900;
const PORT = 9333;
const URL = process.argv[3] ?? "http://localhost:3000/preview-home-2";
const CHROME =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    `--window-size=${WIDTH},${HEIGHT}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--user-data-dir=/tmp/cdp-measure-profile",
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
      /* debugger not up yet */
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

await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: WIDTH,
  height: HEIGHT,
  deviceScaleFactor: 1,
  mobile: false,
});
await send("Page.navigate", { url: URL });
await sleep(4500);

const opened = await send("Runtime.evaluate", {
  returnByValue: true,
  expression: `(() => {
    // Open every product via the dashboard switchboard, so all six windows
    // are on the canvas at once — the state where they can collide.
    [...document.querySelectorAll("button[aria-pressed]")].forEach((b) => {
      if (b.getAttribute("aria-pressed") === "false") b.click();
    });
    return "opened";
  })()`,
});
if (opened.exceptionDetails) {
  console.error("EVAL FAILED:", opened.exceptionDetails.text);
  teardown();
  process.exit(1);
}
// Let the entrance (480ms) and the bob settle, so the measured rects are the
// resting ones rather than mid-animation.
await sleep(1500);
const probe = await send("Runtime.evaluate", {
  returnByValue: true,
  expression: `(() => {
    const rects = [...document.querySelectorAll(".ph2-stage-scale .ph2-anim.absolute")]
      .map((sh, i) => {
        const r = sh.getBoundingClientRect();
        const label = (sh.textContent || "").replace(/^\\s*×\\s*/, "").slice(0, 24).trim();
        return { i, label, x: Math.round(r.x), y: Math.round(r.y),
                 w: Math.round(r.width), h: Math.round(r.height),
                 z: sh.style.zIndex };
      });
    const overlap = [];
    for (let a = 0; a < rects.length; a++) {
      for (let b = a + 1; b < rects.length; b++) {
        const A = rects[a], B = rects[b];
        const ox = Math.min(A.x + A.w, B.x + B.w) - Math.max(A.x, B.x);
        const oy = Math.min(A.y + A.h, B.y + B.h) - Math.max(A.y, B.y);
        if (ox > 0 && oy > 0) overlap.push({ a: A.label, b: B.label, ox, oy, px: ox * oy });
      }
    }
    const stage = document.querySelector(".ph2-stage-scale").getBoundingClientRect();
    // The switchboard: every pill's rect, and which windows paint over it.
    // Design invariant: no window may bury the row that opens/closes all six.
    const pills = [...document.querySelectorAll("button[aria-pressed]")].map((p) => {
      const r = p.getBoundingClientRect();
      return { label: p.textContent.trim().slice(0, 14),
               x: Math.round(r.x), y: Math.round(r.y),
               w: Math.round(r.width), h: Math.round(r.height) };
    });
    const buried = [];
    for (const p of pills) {
      for (const C of rects) {
        const ox = Math.min(p.x + p.w, C.x + C.w) - Math.max(p.x, C.x);
        const oy = Math.min(p.y + p.h, C.y + C.h) - Math.max(p.y, C.y);
        if (ox > 0 && oy > 0) buried.push({ pill: p.label, by: C.label, ox, oy });
      }
    }
    return JSON.stringify({
      viewport: { w: innerWidth, h: innerHeight },
      stage: { x: Math.round(stage.x), y: Math.round(stage.y), w: Math.round(stage.width), h: Math.round(stage.height) },
      pills, buried,
      cards: rects, overlap,
    }, null, 1);
  })()`,
});
if (probe.exceptionDetails) {
  console.error("EVAL FAILED:", probe.exceptionDetails.text);
  teardown();
  process.exit(1);
}
console.log(probe.result.value);
ws.close();
teardown();
process.exit(0);
