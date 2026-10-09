/**
 * "Cek tiap card": click every window where it visibly paints on top and prove
 *
 *   1. the right window receives the press;
 *   2. NO other window reacts (z-index, held shadow, transform) — in
 *      particular a card sitting on top of a stack must stay untouched when a
 *      buried card underneath is clicked;
 *   3. a plain press does not restart the float animation (the bob keeps its
 *      Animation object, so its phase continues — no leap on click);
 *
 * then builds a real stack (drag one window over two others) and clicks the
 * bottom card's exposed pixels — including pixels covered by the dragger's
 * vacated shell — asserting the buried card gets the click and the top of the
 * stack does not flinch.
 *
 *   node scripts/verify-stack.mjs [width]
 */
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const WIDTH = Number(process.argv[2] ?? 1440);
const PORT = 9335;
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
    "--user-data-dir=/tmp/cdp-stack-profile",
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

const SH = ".ph2-stage-scale .ph2-anim.absolute";
const results = [];
const record = (name, pass, detail) => {
  results.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
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

// Page-side helpers: snapshot, point picker, bob handle.
await ev(`(() => {
  window.__shells = () => [...document.querySelectorAll(${JSON.stringify(SH)})];
  window.__label = (el) =>
    (el.textContent || "").replace(/^\\s*×\\s*/, "").trim().slice(0, 20);
  window.__snap = () => window.__shells().map((sh, i) => {
    const box = sh.querySelector(".ph2-pop-in > div");
    const b = box.getBoundingClientRect();
    const s = sh.getBoundingClientRect();
    return {
      i,
      label: window.__label(sh),
      z: Number(sh.style.zIndex || 0),
      held: sh.className.includes("cursor-grabbing"),
      itf: (box && box.style.transform) || "",
      shell: [s.x, s.y, s.width, s.height].map(Math.round),
      card: [b.x, b.y, b.width, b.height].map(Math.round),
    };
  });
  window.__downs = [];
  document.addEventListener("pointerdown", (e) => {
    const sh = e.target && e.target.closest ? e.target.closest(".ph2-anim.absolute") : null;
    const all = window.__shells();
    window.__downs.push({
      shell: sh ? all.indexOf(sh) : -1,
      at: [Math.round(e.clientX), Math.round(e.clientY)],
    });
  }, true);
  // A point inside card i where card i paints topmost, the hit resolves to
  // card i itself, and no control (button/link) sits under the cursor.
  window.__pick = (i) => {
    const info = window.__snap();
    const R = info[i].card;
    const inR = (r, x, y) =>
      x >= r[0] && y >= r[1] && x < r[0] + r[2] && y < r[1] + r[3];
    const step = 10;
    for (let x = Math.ceil(R[0]) + 6; x < R[0] + R[2] - 6; x += step) {
      for (let y = Math.ceil(R[1]) + 6; y < R[1] + R[3] - 6; y += step) {
        if (x < 4 || y < 4 || x >= innerWidth - 4 || y >= innerHeight - 4) continue;
        if (!inR(R, x, y)) continue;
        const painters = info.filter((o) => inR(o.card, x, y)).sort((a, b) => b.z - a.z);
        if (!painters.length || painters[0].i !== i) continue;
        const hit = document.elementFromPoint(x, y);
        if (!hit) continue;
        const sh = hit.closest(".ph2-anim.absolute");
        if (!sh || window.__shells().indexOf(sh) !== i) continue;
        if (hit.closest("button, a, [role=button]")) continue;
        return [Math.round(x), Math.round(y)];
      }
    }
    return null;
  };
  // Record the shell's current Animation object so a later compare can tell
  // "continued" from "restarted at another phase".
  window.__armBob = (i) => {
    const sh = window.__shells()[i];
    window.__anim0 = sh ? (sh.getAnimations()[0] || null) : null;
    window.__before = window.__snap();
    window.__downs.length = 0;
    return true;
  };
  window.__report = (i) => {
    const after = window.__snap();
    const before = window.__before;
    const sh = window.__shells()[i];
    const a1 = sh ? (sh.getAnimations()[0] || null) : null;
    const collateral = [];
    for (const b of before) {
      const a = after[b.i];
      const fields = [];
      if (a.z !== b.z) fields.push("z " + b.z + "→" + a.z);
      if (a.held !== b.held) fields.push("held " + b.held + "→" + a.held);
      if (a.itf !== b.itf) fields.push("transform " + JSON.stringify(b.itf) + "→" + JSON.stringify(a.itf));
      if (fields.length && b.i !== i) collateral.push({ i: b.i, label: b.label, fields });
    }
    const b = before[i];
    const a = after[i];
    return JSON.stringify({
      receiver: window.__downs.length ? window.__downs[0].shell : null,
      receiverAt: window.__downs.length ? window.__downs[0].at : null,
      collateral,
      ownMoved: b.itf !== a.itf,
      bobRestarted: window.__anim0 ? a1 !== window.__anim0 : null,
      jumpPx: Math.hypot(a.card[0] - b.card[0], a.card[1] - b.card[1]),
    });
  };
  return 1;
})()`);

const click = async (x, y) => {
  await send("Input.dispatchMouseEvent", {
    type: "mousePressed", x, y, button: "left", buttons: 1, clickCount: 1,
  });
  await send("Input.dispatchMouseEvent", {
    type: "mouseReleased", x, y, button: "left", buttons: 0, clickCount: 1,
  });
  await sleep(300);
};

const drag = async (x0, y0, dx, dy) => {
  await send("Input.dispatchMouseEvent", {
    type: "mousePressed", x: x0, y: y0, button: "left", buttons: 1, clickCount: 1,
  });
  const steps = 14;
  for (let i = 1; i <= steps; i += 1) {
    await send("Input.dispatchMouseEvent", {
      type: "mouseMoved",
      x: x0 + (dx * i) / steps,
      y: y0 + (dy * i) / steps,
      button: "left", buttons: 1,
    });
    await sleep(25);
  }
  await send("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    x: x0 + dx, y: y0 + dy, button: "left", buttons: 0, clickCount: 1,
  });
  await sleep(600);
};

// --- Layout sanity: are resting cards inside the hero band (drag bounds)? ---
const layout = JSON.parse(await ev(`(() => {
  const stage = document.querySelector(".ph2-stage-scale");
  const band = stage && stage.closest("section");
  const b = band ? band.getBoundingClientRect() : null;
  const s = stage.getBoundingClientRect();
  const cards = window.__snap().map((c) => ({
    label: c.label, top: c.card[1], bottom: c.card[1] + c.card[3],
  }));
  return JSON.stringify({
    band: b ? [b.top, b.bottom].map(Math.round) : null,
    stage: [s.top, s.bottom].map(Math.round),
    cards,
    outside: cards.filter((c) => b && (c.top < b.top - 1 || c.bottom > b.bottom + 1)),
  });
})()`));
console.log(
  `layout @${WIDTH}: band=[${layout.band}] stage=[${layout.stage}] ` +
    `cards outside band: ${layout.outside.length ? layout.outside.map((c) => c.label).join(", ") : "none"}`,
);

// --- 1. Every card, one click each: right receiver, nobody else reacts. ---
const labels = JSON.parse(await ev(`JSON.stringify(window.__snap().map((c) => c.label))`));
for (let i = 0; i < labels.length; i += 1) {
  const pt = JSON.parse(await ev(`JSON.stringify(window.__pick(${i}))`));
  if (!pt) {
    record(`click #${i} "${labels[i]}" (visible point)`, false, "no correctly-routed visible point found");
    continue;
  }
  await ev(`window.__armBob(${i})`);
  await click(pt[0], pt[1]);
  const r = JSON.parse(await ev(`window.__report(${i})`));
  const ok =
    r.receiver === i &&
    r.collateral.length === 0 &&
    !r.ownMoved &&
    r.bobRestarted !== true;
  record(
    `click #${i} "${labels[i]}" at [${pt}]`,
    ok,
    `receiver=${r.receiver}, collateral=${JSON.stringify(r.collateral)}, ` +
      `ownMoved=${r.ownMoved}, bobRestarted=${r.bobRestarted}, jump=${r.jumpPx.toFixed(1)}px`,
  );
}

// --- 2. A real stack: drag chat (idx 0) over crm + marketing. ---
const dp = JSON.parse(await ev(`JSON.stringify(window.__pick(0))`));
if (!dp) {
  record("drag chat over the pile", false, "no press point for chat");
} else {
  await drag(dp[0], dp[1], 360, 0);
  const stack = JSON.parse(await ev(`(() => {
    const info = window.__snap();
    const overlap = (a, b) => {
      const x = Math.max(a[0], b[0]);
      const y = Math.max(a[1], b[1]);
      const x2 = Math.min(a[0] + a[2], b[0] + b[2]);
      const y2 = Math.min(a[1] + a[3], b[1] + b[3]);
      return x2 > x && y2 > y ? [x, y, x2 - x, y2 - y] : null;
    };
    const chat = info[0], crm = info[2], marketing = info[5];
    const pair = overlap(chat.card, crm.card);
    const all = pair ? overlap(pair, marketing.card) : null;
    return JSON.stringify({
      triple: all ? all.map(Math.round) : null,
      chatShellIsGhost: chat.shell[0] !== chat.card[0] || chat.shell[1] !== chat.card[1],
      rects: { chat: chat.card, crm: crm.card, marketing: marketing.card },
      labels: info.map((c) => c.label),
    });
  })()`));
  record(
    "drag chat +360px onto crm/marketing",
    Boolean(stack.triple) && stack.chatShellIsGhost,
    `triple-overlap region=${JSON.stringify(stack.triple)}, chat shell detached=${stack.chatShellIsGhost}, ` +
      `rects=${JSON.stringify(stack.rects)}`,
  );

  // --- 3. Click the BOTTOM of the 3-stack: the top must not flinch. ---
  const bottomPt = JSON.parse(await ev(`JSON.stringify(window.__pick(2))`));
  if (!bottomPt) {
    record("click bottom of 3-stack (crm)", false, "no correctly-routed visible point for crm");
  } else {
    await ev(`window.__armBob(2)`);
    await click(bottomPt[0], bottomPt[1]);
    const r = JSON.parse(await ev(`window.__report(2)`));
    const top = r.collateral.find((c) => c.i === 0);
    const ok = r.receiver === 2 && !top && r.collateral.length === 0;
    record(
      `click crm (bottom) at [${bottomPt}] — stack top is chat`,
      ok,
      `receiver=${r.receiver}, chat reaction=${top ? JSON.stringify(top.fields) : "none"}, ` +
        `collateral=${JSON.stringify(r.collateral)}`,
    );
  }

  // --- 4. Click mini where chat's vacated shell covers it (ghost zone). ---
  const ghostPt = JSON.parse(await ev(`(() => {
    const info = window.__snap();
    const chat = info[0], mini = info[3];
    const inR = (r, x, y) =>
      x >= r[0] && y >= r[1] && x < r[0] + r[2] && y < r[1] + r[3];
    for (let x = Math.ceil(chat.shell[0]) + 6; x < chat.shell[0] + chat.shell[2] - 6; x += 10) {
      for (let y = Math.ceil(chat.shell[1]) + 6; y < chat.shell[1] + chat.shell[3] - 6; y += 10) {
        if (x < 4 || y < 4 || x >= innerWidth - 4 || y >= innerHeight - 4) continue;
        if (!inR(mini.card, x, y)) continue;
        if (inR(chat.card, x, y)) continue;
        const painters = info.filter((o) => inR(o.card, x, y)).sort((a, b) => b.z - a.z);
        if (!painters.length || painters[0].i !== 3) continue;
        const hit = document.elementFromPoint(x, y);
        const sh = hit && hit.closest ? hit.closest(".ph2-anim.absolute") : null;
        const idx = sh ? window.__shells().indexOf(sh) : -1;
        if (idx !== 3) continue;
        if (hit.closest("button, a, [role=button]")) continue;
        return JSON.stringify([Math.round(x), Math.round(y)]);
      }
    }
    return "null";
  })()`));
  if (!ghostPt) {
    record(
      "click mini under chat's vacated shell (ghost zone)",
      false,
      "no point where the hit resolves to mini",
    );
  } else {
    await ev(`window.__armBob(3)`);
    await click(ghostPt[0], ghostPt[1]);
    const r = JSON.parse(await ev(`window.__report(3)`));
    const ok = r.receiver === 3 && r.collateral.length === 0;
    record(
      `click mini (under chat's ghost shell) at [${ghostPt}]`,
      ok,
      `receiver=${r.receiver}, collateral=${JSON.stringify(r.collateral)}`,
    );
  }
  // --- 5. Tall card first move: upward drag must track, not clamp-jump. ---
  // The designed anchor of the 521px consulting card sits ABOVE the stage's
  // top edge; stage-only bounds used to clamp its very first move and jump it
  // ~79px in a single frame. Bounds are the hero band now, which contains
  // every resting card, so the first move tracks the hand exactly.
  const tallPt = JSON.parse(await ev(`JSON.stringify(window.__pick(4))`));
  if (!tallPt) {
    record("tall card first move (consulting ↑120px)", false, "no press point");
  } else {
    const beforeTop = JSON.parse(
      await ev(`JSON.stringify(window.__snap()[4].card[1])`),
    );
    await drag(tallPt[0], tallPt[1], 0, -120);
    const afterTop = JSON.parse(
      await ev(`JSON.stringify(window.__snap()[4].card[1])`),
    );
    const dy = afterTop - beforeTop;
    record(
      "tall card first move (consulting ↑120px)",
      Math.abs(dy + 120) <= 6,
      `dy=${dy.toFixed(1)}px (expected ≈ −120, never a clamp-jump)`,
    );
  }
}

const shot = await send("Page.captureScreenshot", { format: "png" });
const { writeFileSync } = await import("node:fs");
writeFileSync(`/tmp/stack-${WIDTH}.png`, Buffer.from(shot.data, "base64"));
console.log(`screenshot: /tmp/stack-${WIDTH}.png`);

const failed = results.filter((r) => !r.pass);
console.log(
  `\n${results.length - failed.length}/${results.length} checks passed` +
    `${failed.length ? ` — ${failed.map((f) => f.name).join("; ")}` : ""}`,
);

ws.close();
teardown();
process.exit(failed.length ? 1 : 0);
