/**
 * Reproduce "clicking the back card activates the front card".
 *
 * Distinguishes two rectangles per window, which the earlier hittest script
 * conflated:
 *
 *   • shell rect  — the anchored wrapper (keeps handlers + z-index)
 *   • inner rect  — the painted card (carries the drag transform)
 *
 * After a drag the inner box moves but the shell stays at its anchor, so the
 * shell can be a hit zone where no part of that card is visible. Any point
 * where card B paints topmost but elementFromPoint returns card A is exactly
 * the reported bug. We also perform a real mouse click there and record which
 * window actually received the pointerdown.
 *
 *   node scripts/verify-click.mjs [width] [--drag]
 *
 * Exits 0 only when the metrics are clean AND a real click on a ghost point
 * lands on the card that visibly paints there.
 */
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const WIDTH = Number(process.argv[2] ?? 1440);
const DO_DRAG = process.argv.includes("--drag");
const PORT = 9334;
const urlIdx = process.argv.indexOf("--url");
const URL =
  urlIdx !== -1
    ? process.argv[urlIdx + 1]
    : "http://localhost:3000/preview-home-2";
const CHROME =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--user-data-dir=/tmp/cdp-click-profile",
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
const ev = async (expression) => {
  const { result, exceptionDetails } = await send("Runtime.evaluate", {
    returnByValue: true,
    expression,
  });
  if (exceptionDetails)
    throw new Error(
      exceptionDetails.exception?.description ?? exceptionDetails.text,
    );
  return result.value;
};

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
await ev(`(() => {
  [...document.querySelectorAll("button[aria-pressed]")].forEach((b) => {
    if (b.getAttribute("aria-pressed") === "false") b.click();
  });
  return 1;
})()`);
await sleep(1500);

// Instrument: record every pointerdown's owning window.
await ev(`(() => {
  window.__downs = [];
  const shells = () => [...document.querySelectorAll(".ph2-stage-scale .ph2-anim.absolute")];
  document.addEventListener("pointerdown", (e) => {
    const sh = e.target && e.target.closest
      ? e.target.closest(".ph2-anim.absolute") : null;
    const all = shells();
    window.__downs.push({
      shell: sh ? all.indexOf(sh) : -1,
      target: e.target ? (e.target.tagName + "." + String(e.target.className).slice(0, 40)) : null,
      at: [Math.round(e.clientX), Math.round(e.clientY)],
    });
  }, true);
  return 1;
})()`);

if (DO_DRAG) {
  // Drag window 0 (Balas Chat) 260px right + 40px down, drop it there.
  const info = await ev(`(() => {
    const sh = document.querySelectorAll(".ph2-stage-scale .ph2-anim.absolute")[0];
    const r = sh.getBoundingClientRect();
    return JSON.stringify({ x: r.x + r.width / 2, y: r.y + 40 });
  })()`);
  const { x, y } = JSON.parse(info);
  await send("Input.dispatchMouseEvent", {
    type: "mousePressed", x, y, button: "left", buttons: 1, clickCount: 1,
  });
  for (let i = 1; i <= 12; i += 1) {
    await send("Input.dispatchMouseEvent", {
      type: "mouseMoved",
      x: x + i * 22, y: y + i * 3,
      button: "left", buttons: 1,
    });
    await sleep(25);
  }
  await send("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    x: x + 264, y: y + 36, button: "left", buttons: 0, clickCount: 1,
  });
  await sleep(600);
}

// Freeze the bob before measuring: the report snapshots rects once and then
// hit-tests thousands of points over the following seconds, so a card still
// drifting ±8px would make edge points go stale and report misses that do not
// exist. (Placed after the drag — a release unpauses the dragged card — so
// every shell is frozen again by the time the first rect is read.)
await ev(`(() => {
  document.querySelectorAll(".ph2-anim.absolute").forEach((el) => {
    el.style.animationPlayState = "paused";
  });
  return 1;
})()`);

const report = await ev(`(() => {
  const shells = [...document.querySelectorAll(".ph2-stage-scale .ph2-anim.absolute")];
  const label = (el) =>
    (el.textContent || "").replace(/^\\s*×\\s*/, "").trim().slice(0, 22);
  // The painted card: the div the drag transform lives on.
  const inners = shells.map((sh) => sh.querySelector(".ph2-pop-in > div"));
  const rects = shells.map((sh, i) => {
    const s = sh.getBoundingClientRect();
    const c = (inners[i] || sh).getBoundingClientRect();
    return {
      i, label: label(sh),
      shell: [Math.round(s.x), Math.round(s.y), Math.round(s.width), Math.round(s.height)],
      card:  [Math.round(c.x), Math.round(c.y), Math.round(c.width), Math.round(c.height)],
      z: Number(sh.style.zIndex || 0),
    };
  });
  const inRect = (r, x, y) =>
    x >= r[0] && y >= r[1] && x < r[0] + r[2] && y < r[1] + r[3];
  // Sub-pixel tolerance: Chrome hit-tests whole pixels, getBoundingClientRect
  // reports fractional edges, and rounded rects in this report add a third
  // opinion. A point within 2px of another card's edge sits in that
  // disagreement zone — where the higher-z card legitimately owns the pixel —
  // so it proves nothing and is skipped rather than reported as a miss.
  const nearEdge = (x, y, r, pad) =>
    Math.abs(x - r[0]) < pad ||
    Math.abs(x - (r[0] + r[2])) < pad ||
    Math.abs(y - r[1]) < pad ||
    Math.abs(y - (r[1] + r[3])) < pad;
  const cardAt = (el) => {
    const sh = el && el.closest ? el.closest(".ph2-anim.absolute") : null;
    return sh ? shells.indexOf(sh) : -1;
  };

  // Phantom zone = shell area where this window paints nothing. Collected
  // geometrically (the rect pair already tells us it is a ghost), then split
  // by what elementFromPoint actually reports: "phantoms" are the ghosts that
  // still *receive* the hit (the bug), "ghosts" are all of them (each with
  // the card that visibly paints there — the expected receiver of a click).
  const phantoms = [];
  const ghosts = [];
  for (const C of rects) {
    const [sx, sy, sw, shh] = C.shell;
    const STEP = 16;
    for (let x = sx + STEP / 2; x < sx + sw; x += STEP) {
      for (let y = sy + STEP / 2; y < sy + shh; y += STEP) {
        if (inRect(C.card, x, y)) continue; // card actually paints here
        // Some OTHER window paints here → its pixels are behind C's shell.
        const painter = rects.find(
          (O) => O.i !== C.i && inRect(O.card, x, y),
        );
        if (!painter) continue;
        if (x < 0 || y < 0 || x >= innerWidth || y >= innerHeight) continue;
        // Same sub-pixel tolerance as the wrong loop: a point hugging either
        // card's edge lives where fractional rects and Chrome's pixel
        // hit-test disagree about who owns the pixel — skip it.
        if (nearEdge(x, y, C.card, 2) || nearEdge(x, y, painter.card, 2)) continue;
        const hit = document.elementFromPoint(x, y);
        const hitIdx = cardAt(hit);
        ghosts.push({
          ghostIdx: C.i,
          ghost: C.label,
          painterIdx: painter.i,
          visibleCard: painter.label,
          at: [Math.round(x), Math.round(y)],
        });
        if (hitIdx === C.i) {
          phantoms.push({
            ghost: C.label,
            visibleCard: painter.label,
            at: [Math.round(x), Math.round(y)],
          });
        }
      }
    }
  }

  // Visual topmost (by painted card rects + z) vs actual hit, sampled on
  // every window's painted area.
  const wrong = [];
  const STEP = 20;
  for (const C of rects) {
    const [cx, cy, cw, ch] = C.card;
    for (let x = cx + STEP / 2; x < cx + cw; x += STEP) {
      for (let y = cy + STEP / 2; y < cy + ch; y += STEP) {
        if (x < 0 || y < 0 || x >= innerWidth || y >= innerHeight) continue;
        const painters = rects.filter((O) => inRect(O.card, x, y)).sort(
          (a, b) => b.z - a.z,
        );
        if (!painters.length || painters[0].i !== C.i) continue; // not topmost
        // Ambiguous edge zone (see nearEdge): skip, it proves nothing.
        if (
          rects.some((O) => O.i !== C.i && nearEdge(x, y, O.card, 2))
        ) continue;
        const hitEl = document.elementFromPoint(x, y);
        const hit = cardAt(hitEl);
        if (hit !== C.i) {
          const path = [];
          let n = hitEl;
          for (let k = 0; n && k < 6; k += 1, n = n.parentElement) {
            path.push(
              n.tagName.toLowerCase() +
                (typeof n.className === "string" && n.className
                  ? "." + n.className.trim().split(/\\s+/).slice(0, 3).join(".")
                  : ""),
            );
          }
          wrong.push({
            looksLike: C.label,
            actually: hitEl === null ? "NULL" : hit === -1 ? "NOT-A-CARD" : rects[hit].label,
            at: [Math.round(x), Math.round(y)],
            // Distance from the sampled point to C's card rect border: a
            // small value means an edge pixel, a large one a real hole.
            edge: Math.round(
              Math.min(
                x - C.card[0], C.card[0] + C.card[2] - x,
                y - C.card[1], C.card[1] + C.card[3] - y,
              ),
            ),
            zOfC: C.z,
            path,
          });
        }
      }
    }
  }
  return JSON.stringify(
    { rects, phantoms, wrong, ghostCount: ghosts.length, ghosts: ghosts.slice(0, 40) },
    null,
    1,
  );
})()`);
console.log(report);

// Precision dump for the first wrong point, run before anything else can
// re-front a card: unrounded box/card edges, every descendant covering the
// point, and the hit chain — enough to tell a real routing bug from a child
// painting outside its box (a false positive of the rect-based metric).
const data = JSON.parse(report);
if (data.wrong.length) {
  const p = data.wrong[0];
  const dbg = await ev(`(() => {
    const x = ${p.at[0]}, y = ${p.at[1]};
    const shells = [...document.querySelectorAll(".ph2-stage-scale .ph2-anim.absolute")];
    const info = shells.map((sh, i) => {
      const box = sh.querySelector(".ph2-pop-in > div");
      const br = box.getBoundingClientRect();
      const covers = [];
      if (br.x <= x && br.right >= x && br.y <= y && br.bottom >= y) {
        sh.querySelectorAll("*").forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.x <= x && r.right >= x && r.y <= y && r.bottom >= y && covers.length < 4) {
            covers.push(
              el.tagName + "." + String(el.className || "").slice(0, 30) +
                " [" + [r.x, r.right].map((v) => v.toFixed(2)).join(",") + "]" +
                " pe=" + getComputedStyle(el).pointerEvents,
            );
          }
        });
      }
      return { i, z: sh.style.zIndex, boxX: [br.x.toFixed(2), br.right.toFixed(2)], covers };
    });
    const hit = document.elementFromPoint(x, y);
    const chain = [];
    let n = hit;
    while (n && chain.length < 5) {
      const r = n.getBoundingClientRect();
      chain.push(
        n.tagName + "." + String(n.className || "").slice(0, 30) +
          " [" + [r.x, r.right].map((v) => v.toFixed(2)).join(",") + "]",
      );
      n = n.parentElement;
    }
    return JSON.stringify({ x, y, info, chain }, null, 1);
  })()`);
  console.log(`\nDEBUG wrong point [${p.at}]:\n${dbg}`);
}

// Real click on a geometric ghost point: the visible card must receive it,
// never the card whose vacated shell happens to cover the spot.
const target = data.ghosts.length ? data.ghosts[0] : null;
let clickPass = true;
if (target) {
  await ev("window.__downs.length = 0");
  await send("Input.dispatchMouseEvent", {
    type: "mousePressed", x: target.at[0], y: target.at[1], button: "left", buttons: 1, clickCount: 1,
  });
  await send("Input.dispatchMouseEvent", {
    type: "mouseReleased", x: target.at[0], y: target.at[1], button: "left", buttons: 0, clickCount: 1,
  });
  await sleep(300);
  const downs = JSON.parse(await ev("JSON.stringify(window.__downs)"));
  const receiver = downs.length ? downs[0].shell : null;
  clickPass = receiver === target.painterIdx;
  console.log(
    `\nReal click at [${target.at}] — visible card is "${target.visibleCard}" (idx ${target.painterIdx}), ` +
      `covered by the vacated shell of "${target.ghost}" (idx ${target.ghostIdx}).`,
  );
  console.log(`pointerdown receivers: ${JSON.stringify(downs)}`);
  console.log(
    clickPass
      ? "PASS — the visible card received the click."
      : `FAIL — expected idx ${target.painterIdx}, got ${receiver}.`,
  );
} else {
  console.log("\nNo ghost zones to click (every shell sits on its painted card).");
}
const fail = data.phantoms.length > 0 || data.wrong.length > 0 || !clickPass;

console.log(
  `\nphantoms: ${data.phantoms.length} | wrong: ${data.wrong.length} | ghosts: ${data.ghostCount} → ${fail ? "FAIL" : "PASS"}`,
);

const shot = await send("Page.captureScreenshot", { format: "png" });
const { writeFileSync } = await import("node:fs");
writeFileSync(
  `/tmp/click-${WIDTH}${DO_DRAG ? "-drag" : ""}.png`,
  Buffer.from(shot.data, "base64"),
);
console.log(`screenshot: /tmp/click-${WIDTH}${DO_DRAG ? "-drag" : ""}.png`);

ws.close();
teardown();
process.exit(fail ? 1 : 0);
