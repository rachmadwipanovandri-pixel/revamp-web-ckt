/**
 * One-off: prove (or disprove) "what you see is what you click" on
 * /preview-home-2's hero stage at a real desktop viewport.
 *
 * For every visible card we sample a grid of points inside its rectangle and
 * ask two questions per point:
 *
 *   1. Is the point EXPOSED? i.e. no other visible card's rectangle covers it.
 *   2. If exposed, does document.elementFromPoint() land inside that card's
 *      own shell?
 *
 * A point that is exposed but resolves to a different card (or to some overlay)
 * is exactly the bug being reported: a card the visitor can plainly see that
 * cannot be pressed. Covered points are expected to resolve to the card in
 * front — that is normal stacking, not a bug.
 *
 *   node scripts/verify-hittest.mjs [width]
 */
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const WIDTH = Number(process.argv[2] ?? 1440);
const PORT = 9335;
const URL = process.argv[3] ?? "http://localhost:3000/preview-home-2";
const CHROME =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--user-data-dir=/tmp/cdp-hittest-profile",
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

await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: WIDTH,
  height: 900,
  deviceScaleFactor: 1,
  mobile: false,
});
await send("Page.navigate", { url: URL });
await sleep(4000);

// Open every product so all six windows share the canvas.
await send("Runtime.evaluate", {
  returnByValue: true,
  expression: `(() => {
    [...document.querySelectorAll("button[aria-pressed]")].forEach((b) => {
      if (b.getAttribute("aria-pressed") === "false") b.click();
    });
    return 1;
  })()`,
});
await sleep(1500);

const { result, exceptionDetails } = await send("Runtime.evaluate", {
  returnByValue: true,
  expression: `(() => {
    const shells = [...document.querySelectorAll(".ph2-stage-scale .ph2-anim.absolute")];
    const label = (el) =>
      (el.textContent || "").replace(/^\\s*×\\s*/, "").trim().slice(0, 22);
    const rects = shells.map((sh, i) => {
      const r = sh.getBoundingClientRect();
      return { i, label: label(sh), x: r.x, y: r.y, w: r.width, h: r.height,
               z: sh.style.zIndex };
    });
    const cardOf = (el) => {
      const sh = el && el.closest ? el.closest(".ph2-anim.absolute") : null;
      return sh ? shells.indexOf(sh) : -1;
    };
    const STEP = 24;
    const exposed = [];
    const covered = [];
    const misses = [];
    for (const C of rects) {
      for (let px = C.x + STEP / 2; px < C.x + C.w; px += STEP) {
        for (let py = C.y + STEP / 2; py < C.y + C.h; py += STEP) {
          if (px < 0 || py < 0 || px >= innerWidth || py >= innerHeight) continue;
          const blockers = rects.filter(
            (O) =>
              O.i !== C.i &&
              px >= O.x && px < O.x + O.w &&
              py >= O.y && py < O.y + O.h,
          );
          const hit = document.elementFromPoint(px, py);
          const hitIdx = cardOf(hit);
          if (blockers.length === 0) {
            exposed.push({ card: C.label, hit: hitIdx, x: Math.round(px), y: Math.round(py) });
            if (hitIdx !== C.i) {
              misses.push({
                card: C.label,
                hit: hitIdx === -1 ? "NOT-A-CARD" : rects[hitIdx].label,
                at: [Math.round(px), Math.round(py)],
                hitTag: hit ? hit.tagName + "." + String(hit.className).slice(0, 50) : null,
              });
            }
          } else {
            // expected: the frontmost covering card should win
            const front = blockers.sort((a, b) => Number(b.z) - Number(a.z))[0];
            covered.push({ card: C.label, expect: front.label, hit: hitIdx });
          }
        }
      }
    }
    const wrongCovered = covered.filter(
      (c) => c.hit === -1 || rects[c.hit].label !== c.expect,
    );
    return JSON.stringify({
      viewport: { w: innerWidth, h: innerHeight },
      cards: rects,
      sampledExposed: exposed.length,
      sampledCovered: covered.length,
      exposedMisses: misses,
      coveredWrongFront: wrongCovered.slice(0, 20),
    }, null, 1);
  })()`,
});
if (exceptionDetails) {
  console.error("EVAL FAILED:", exceptionDetails.exception?.description ?? exceptionDetails.text);
  teardown();
  process.exit(1);
}
console.log(result.value);

// A screenshot alongside, to compare against the reporter's image.
const shot = await send("Page.captureScreenshot", { format: "png" });
const { writeFileSync } = await import("node:fs");
writeFileSync(`/tmp/hittest-${WIDTH}.png`, Buffer.from(shot.data, "base64"));
console.log(`screenshot: /tmp/hittest-${WIDTH}.png`);

ws.close();
teardown();
process.exit(0);
