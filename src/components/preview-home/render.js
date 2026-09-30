import { DATA as DATA_ID } from "./data";
import { DATA_EN } from "./data-en";
import { BRAND_WORDMARK_PATH } from "./brand-path";

/** Dipilih per locale saat buildPage dipanggil (id = default tanpa prefix). */
let DATA = DATA_ID;
let LOCALE = "id";

/* ===================== helpers ===================== */
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
/* "{accent:teks}" → italic accent, "{em:teks}" → italic light, "{b:teks}" → bold */
const fmt = (s) => esc(s).replace(/\{accent:(.+?)\}/g, '<span class="accent">$1</span>')
                         .replace(/\{em:(.+?)\}/g, "<em>$1</em>")
                         .replace(/\{b:(.+?)\}/g, "<b>$1</b>");

const ICON = {
  star: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7AA5F5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 7.7l5.4-.8z"/></svg>',
  shield: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7AA5F5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  clock: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7AA5F5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  phone: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1352BF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z"/></svg>',
  home: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1352BF" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-6h6v6"/></svg>',
  chat: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1352BF" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  send: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1352BF" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l18-8-8 18-2-8-8-2z"/></svg>',
  chart: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1352BF" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></svg>',
  grid: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1352BF" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 4v16"/></svg>'
};

function avatar(a, cls) {
  cls = cls || "ava";
  if (a.img) return `<span class="${cls}" style="background:${a.color}"><img src="${a.img}" alt="" onerror="this.parentNode.textContent='${esc(a.initials)}'"></span>`;
  return `<span class="${cls}" style="background:${a.color}">${esc(a.initials)}</span>`;
}

/* ===================== header ===================== */
export function megaItems(items, single) {
  return `<div class="mega-items${single ? " single" : ""}">` + items.map(i =>
    `<a class="mega-item" href="${i.href}"><span class="t">${esc(i.t)}</span>${i.d ? `<span class="d" style="display:block">${esc(i.d)}</span>` : ""}</a>`
  ).join("") + "</div>";
}
function renderMega(link) {
  if (link.kind === "cats") {
    const cats = link.categories.map((c, i) =>
      `<button class="mega-cat${i === 0 ? " on" : ""}" data-cat="${c.id}" type="button">
         <span><span class="t">${esc(c.title)}</span><span class="d" style="display:block">${esc(c.desc)}</span></span>
         <span class="ch"></span></button>`).join("");
    const f = link.featured;
    return `<div class="mega" id="mega-${link.id}" data-kind="cats">
      <div class="mega-cols k-cats">
        <div class="mega-side">${cats}</div>
        <div class="mega-main">
          <div class="mega-panel-title">${esc(link.categories[0].title)}</div>
          <div id="mega-items-${link.id}">${megaItems(link.categories[0].items)}</div>
        </div>
      </div>
      <div class="mega-foot">
        <span class="fi">${ICON.phone}</span>
        <span><span class="ft">${esc(f.t)}</span><span class="fd" style="display:block">${esc(f.d)}</span></span>
        <a class="fl" href="${f.href}">${esc(f.cta)} →</a>
      </div></div>`;
  }
  if (link.kind === "cols") {
    return `<div class="mega" id="mega-${link.id}" data-kind="cols">
      <div class="mega-cols k-cols">` + link.columns.map(col =>
        `<div class="mega-side"><div class="mega-panel-title">${esc(col.title)}</div>${megaItems(col.items, true)}</div>`
      ).join("") + `</div></div>`;
  }
  return `<div class="mega" id="mega-${link.id}" data-kind="grid">
    <div class="mega-cols k-grid">
      <div class="mega-side">
        <div class="mega-panel-title">${esc(link.label)}</div>
        <p style="font-size:13.5px;color:var(--muted-2);padding:0 13px 12px;max-width:560px">${esc(link.intro)}</p>
        <div class="mega-grid-items">${link.items.map(i =>
          `<a class="mega-item" href="${i.href}"><span class="t">${esc(i.t)}</span></a>`).join("")}
          <a class="mega-item" href="${link.more.href}"><span class="t" style="color:var(--primary)">${esc(link.more.t)} →</span></a>
        </div>
      </div>
    </div></div>`;
}
const GLOBE_SVG = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3z"/></svg>';
function currentLocale() {
  return LOCALE;
}
function langSwitcher() {
  const cur = currentLocale();
  const label = cur === "en" ? "English" : "Indonesian";
  return `<div class="lang" id="langSwitch">
    <button class="lang-btn" id="langBtn" type="button" aria-haspopup="true" aria-expanded="false" aria-label="${cur === "en" ? "Switch language" : "Ganti bahasa"}">
      ${GLOBE_SVG}<span>${label}</span><i class="lang-caret"></i>
    </button>
    <div class="lang-menu" id="langMenu">
      <a href="/preview-home" data-loc="id" class="${cur === "id" ? "on" : ""}">Indonesian</a>
      <a href="/en/preview-home" data-loc="en" class="${cur === "en" ? "on" : ""}">English</a>
    </div>
  </div>`;
}
function mobileLangRow() {
  const cur = currentLocale();
  return `<div class="lang-mobile">
    <a href="/preview-home" class="${cur === "id" ? "on" : ""}">Indonesian</a>
    <a href="/en/preview-home" class="${cur === "en" ? "on" : ""}">English</a>
  </div>`;
}
function renderNav() {
  const n = DATA.nav;
  const menuLinks = n.links.filter(l => l.kind);
  const directLinks = n.links.filter(l => !l.kind);
  const triggers = menuLinks.map(l =>
    `<button class="nav-link" type="button" data-mega="${l.id}" aria-haspopup="true" aria-expanded="false">${esc(l.label)} <i class="caret"></i></button>`
  ).join("");
  const directs = directLinks.map(l => `<a class="nav-link" href="${l.href}">${esc(l.label)}</a>`).join("");
  const megas = menuLinks.map(renderMega).join("");

  const mGroup = (link) => {
    let body = "";
    if (link.kind === "cats") {
      body = link.categories.map(c =>
        `<div class="m-sub">${esc(c.title)}</div>` +
        c.items.map(i => `<a href="${i.href}">${esc(i.t)}</a>`).join("")).join("");
    } else if (link.kind === "cols") {
      body = link.columns.map(col =>
        `<div class="m-sub">${esc(col.title)}</div>` +
        col.items.map(i => `<a href="${i.href}">${esc(i.t)}</a>`).join("")).join("");
    } else {
      body = link.items.map(i => `<a href="${i.href}">${esc(i.t)}</a>`).join("") +
             `<a href="${link.more.href}"><strong>${esc(link.more.t)} →</strong></a>`;
    }
    return `<div class="m-group"><button type="button">${esc(link.label)} <i class="mc"></i></button>
      <div class="m-body"><div>${body}</div></div></div>`;
  };

  return `
  <div class="nav t-dark" id="navRoot">
    <div class="nav-inner" id="navInner">
      <a class="brand" href="${n.brand.href}">${brandSvg("nav", "brand-logo")}</a>
      <nav class="nav-links" aria-label="Menu utama">${triggers}${directs}</nav>
      <div class="nav-cta">
        ${langSwitcher()}
        <a class="login" href="${n.login.href}">${esc(n.login.label)}</a>
        <a class="btn btn-primary" href="${n.cta.href}">${esc(n.cta.label)}</a>
        <button class="nav-burger" id="burger" type="button" aria-label="Buka menu" aria-expanded="false" aria-controls="navPanel"><span></span></button>
      </div>
      ${megas}
    </div>
    <div class="nav-panel" id="navPanel">
      ${menuLinks.map(mGroup).join("")}
      ${directLinks.map(l => `<a class="m-link" href="${l.href}">${esc(l.label)}</a>`).join("")}
      ${mobileLangRow()}
      <div class="p-cta">
        <a class="btn btn-outline" href="${n.login.href}">${esc(n.login.label)}</a>
        <a class="btn btn-primary" href="${n.cta.href}">${esc(n.cta.label)}</a>
      </div>
    </div>
  </div>`;
}

/* ===================== sections ===================== */
function secHero() {
  const h = DATA.hero, w = h.window, L = DATA.loop;
  return `<section class="hero" data-nav="dark" id="heroSec">
    <div class="container">
      <a class="hero-pill hero-anim d1" href="${h.pill.href}"><span class="badge">${esc(h.pill.badge)}</span>${esc(h.pill.text)} <span class="arrow">→</span></a>
      <h1 class="hero-anim d2">${fmt(h.title)}</h1>
      <p class="hero-sub hero-anim d3">${esc(h.sub)}</p>
      <form class="capture hero-anim d4">
        <input type="text" inputmode="email" placeholder="${esc(h.form.placeholder)}" aria-label="${esc(h.form.placeholder)}">
        <button class="btn btn-primary" type="submit">${esc(h.form.cta)}</button>
      </form>
      <p class="capture-note hero-anim d4">${esc(h.note)}</p>
      <div class="trust-row hero-anim d5">${h.trust.map(t => `<span class="item">${ICON[t.icon] || ""}${esc(t.t)}</span>`).join("")}</div>
    </div>
    <div class="hero-stage hero-anim d6">
      <div class="hero-window">
        <div class="win-bar"><i></i><i></i><i></i><span class="url">${esc(w.url)}</span></div>
        <div class="hero-window-body">
          <aside class="hw-side">${w.side.map((s, i) => `<div class="s-item${i === 0 ? " on" : ""}"><i></i> ${esc(s)}</div>`).join("")}</aside>
          <div class="hw-main">
            <div class="hw-title">${esc(w.title)}</div>
            ${w.chats.map(c => `<div class="chat-row">
              <span class="ava" style="background:${c.color}">${esc(c.ava)}</span>
              <div><div class="who">${esc(c.who)}</div><div class="msg">${esc(c.msg)}</div>
              <span class="chip-ai">${esc(c.chip)}</span></div></div>`).join("")}
          </div>
          <aside class="hw-rail">${w.stats.map(s => `<div class="stat-mini">
            <div class="v">${esc(s.v)}</div><div class="l">${esc(s.l)}</div>
            ${s.spark ? `<div class="spark">${[40,55,48,70,66,84,96].map(p => `<i style="height:${p}%"></i>`).join("")}</div>` : ""}
          </div>`).join("")}</aside>
        </div>
      </div>
    <div class="loop-frame popups" id="loopFrame" aria-hidden="true">
      <div class="stage" id="loopStage">
      <!-- ===== 1 · CHAT (AI Agent) ===== -->
      <div class="card c-chat">
      <div class="inner">
      <div class="chat-head">
      <span class="ava">SW</span>
      <div>
      <div class="who">Sari Wijaya</div>
      <div class="sub">WhatsApp · online</div>
      </div>
      <span class="ai-badge">AI Agent</span>
      </div>
      <div class="bubbles">
      <div class="bub bub-in">${fmt(L.chat.q)}<span class="meta">09:41</span></div>
      <div class="reply-slot">
      <div class="bub bub-typing"><span class="dots"><i></i><i></i><i></i></span></div>
      <div class="bub bub-out">${fmt(L.chat.a)}<span class="meta">09:41 <span class="ticks">✓✓</span></span></div>
      </div>
      </div>
      <div class="quick">
      <span class="qbtn solid">${esc(L.chat.cta1)}</span>
      <span class="qbtn ghost">${esc(L.chat.cta2)}</span>
      </div>
      </div>
      </div>
      <!-- ===== 2 · OMS ===== -->
      <div class="card c-order float-b">
      <div class="inner">
      <div class="lbl">OMS · Order Management</div>
      <div class="ord-head">
      <span class="t">Order #CK-2417</span>
      <span class="s">${esc(L.oms.status)}</span>
      </div>
      <div class="ord-item">
      <span class="thumb"></span>
      <div>
      <div class="nm">${esc(L.oms.nm)}</div>
      <div class="vr">Navy · Size L · Qty 1</div>
      </div>
      <span class="pr">${esc(L.oms.pr)}</span>
      </div>
      <div class="ord-rows">
      ${L.oms.rows.map((r, i) => `<div class="r${i === L.oms.rows.length - 1 ? " total" : ""}"><span>${esc(r[0])}</span><span>${esc(r[1])}</span></div>`).join("\n      ")}
      </div>
      <div class="pay-pill">
      <span class="ck"><svg width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M1.5 5.2 L4 7.7 L8.5 2.6" stroke="#FFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
      ${esc(L.oms.paid)}
      </div>
      <div class="ord-sync">
      <span class="sync-chip">WhatsApp</span>
      <span class="sync-chip">Instagram</span>
      <span class="sync-chip">Tokopedia</span>
      </div>
      <div class="ord-rail">
      <span class="rail-step done s1">${esc(L.oms.rail[0])}</span>
      <span class="rail-ar a1">→</span>
      <span class="rail-step done s2">${esc(L.oms.rail[1])}</span>
      <span class="rail-ar a2">→</span>
      <span class="rail-step live s3">${esc(L.oms.rail[2])}</span>
      </div>
      </div>
      </div>
      <!-- ===== 3 · CRM ===== -->
      <div class="card c-crm float-c">
      <div class="inner">
      <div class="lbl">CRM Omnichannel</div>
      <div class="crm-head">
      <span class="ava">SW</span>
      <div>
      <div class="nm">Sari Wijaya</div>
      <div class="rl">${esc(L.crm.rl)}</div>
      </div>
      </div>
      <div class="crm-chips">
      <span class="chip blue g1">VIP</span>
      <span class="chip out g2">${esc(L.crm.ads)}</span>
      <span class="chip out g3">WhatsApp</span>
      </div>
      <div class="crm-stats">
      ${L.crm.stats.map((s) => `<div class="stat"><div class="v">${esc(s[0])}</div><div class="k">${esc(s[1])}</div></div>`).join("\n      ")}
      </div>
      <div class="crm-flow">
      <span class="step">Lead</span>
      <span class="flow-ar">→</span>
      <span class="step">Order</span>
      <span class="flow-ar">→</span>
      <span class="step on">Loyal</span>
      </div>
      </div>
      </div>
      <!-- ===== 4 · MINI AGENT ===== -->
      <div class="card c-mini">
      <div class="inner">
      <div class="lbl">${esc(L.mini.lbl)}</div>
      <div class="mini-head">
      <span class="mini-ico"></span>
      <div>
      <div class="t">Cekat Mini Agent</div>
      <div class="s">${esc(L.mini.s)}</div>
      </div>
      <span class="mini-live">Live</span>
      </div>
      <div class="mini-thread">
      <div class="mb visitor">${esc(L.mini.q)}</div>
      <div class="reply-slot">
      <div class="mb typing"><span class="dots"><i></i><i></i><i></i></span></div>
      <div class="mb agent">${fmt(L.mini.a)}</div>
      </div>
      <div class="mprod">
      <div class="pcard p1">
      <span class="pchip sage"></span>
      <div><div class="nm">${esc(L.mini.p1)}</div><div class="pr">${esc(L.mini.pr)}</div></div>
      </div>
      <div class="pcard p2">
      <span class="pchip sand"></span>
      <div><div class="nm">${esc(L.mini.p2)}</div><div class="pr">${esc(L.mini.pr)}</div></div>
      </div>
      </div>
      <div class="mini-cta">${esc(L.mini.cta)}</div>
      </div>
      </div>
      </div>
      <!-- ===== 5 · CONSULTING AGENT ===== -->
      <div class="card c-cons float-b">
      <div class="inner">
      <div class="cons-head">
      <span class="cons-ico"></span>
      <div>
      <div class="t">Consulting Agent</div>
      <div class="s">${esc(L.cons.s)}</div>
      </div>
      <span class="cons-badge">${esc(L.cons.badge)}</span>
      </div>
      <div class="cons-callout">${fmt(L.cons.callout)}</div>
      <div class="cons-list">
      ${L.cons.items.map((it, i) => `<div class="cons-item i${i + 1}"><span class="ci">✓</span><span>${fmt(it)}</span></div>`).join("\n      ")}
      </div>
      <div class="chart">
      <div class="ct"><span>${esc(L.cons.chart)}</span><span class="up">+24%</span></div>
      <div class="bars">
      <span class="bar b1"></span><span class="bar b2"></span><span class="bar b3"></span>
      <span class="bar b4"></span><span class="bar b5"></span><span class="bar b6"></span><span class="bar b7"></span>
      </div>
      <div class="bl">${L.cons.days.map((d) => `<span>${esc(d)}</span>`).join("")}</div>
      </div>
      <div class="cons-btn">${esc(L.cons.cta)}</div>
      </div>
      </div>
      <!-- ===== 6 · CEKAT MARKETING ===== -->
      <div class="card c-mkt float-c">
      <div class="inner">
      <div class="mkt-head">
      <span class="mkt-ico"></span>
      <div>
      <div class="t">Cekat Marketing</div>
      <div class="s">${esc(L.mkt.s)}</div>
      </div>
      <span class="mkt-run">${esc(L.mkt.run)}</span>
      </div>
      <div class="mkt-cp">
      <div>
      <div class="nm">Promo Linen Weekend</div>
      <div class="sub">${esc(L.mkt.sub)}</div>
      </div>
      <span class="ch">WhatsApp</span>
      </div>
      <div class="mkt-stats">
      ${L.mkt.stats.map((s) => `<div class="stat"><div class="v">${esc(s[0])}</div><div class="k">${esc(s[1])}</div></div>`).join("\n      ")}
      </div>
      <div class="attr-big">
      <span class="num">${esc(L.mkt.num)}</span>
      <span class="delta">+32%</span>
      <span class="cap">${esc(L.mkt.roas)}</span>
      </div>
      <svg class="spark" viewBox="0 0 308 50" fill="none">
      <defs>
      <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1352BF" stop-opacity=".22"/>
      <stop offset="1" stop-color="#1352BF" stop-opacity="0"/>
      </linearGradient>
      </defs>
      <path class="area" d="M4 42 L44 38 L84 40 L124 30 L164 32 L204 20 L244 16 L284 8 L304 6 L304 50 L4 50 Z"/>
      <path class="line" d="M4 42 L44 38 L84 40 L124 30 L164 32 L204 20 L244 16 L284 8 L304 6"/>
      <circle class="pt" cx="304" cy="6" r="4.5"/>
      </svg>
      <div class="mkt-foot">
      <span class="l">${esc(L.mkt.foot[0])}</span>
      <span class="r">${esc(L.mkt.foot[1])}</span>
      </div>
      </div>
      </div>
      </div>
    </div>
  
    </div>
  </section>`;
}
function secLogos() {
  const l = DATA.logos;
  return `<section class="logos" data-nav="light">
    <div class="container">
      <div class="head reveal">
        <span class="eyebrow"><span class="dot"></span>${esc(l.eyebrow)}</span>
        <h2 class="h2">${esc(l.heading)}</h2>
        <p class="lead" style="text-align:center">${esc(l.lead)}</p>
      </div>
      <div class="logo-grid">${l.items.map((it, i) => `
        <div class="logo-card reveal" style="--d:${(i % 4) * 70}ms">
          <div class="brandbox"><img src="${it.src}" alt="${esc(it.alt)}" loading="lazy"></div>
          <div class="caption">${esc(it.caption)}</div>
          <a class="go" href="${currentLocale() === "en" ? "/en/blog" : "/blog"}">${esc(DATA.readMore)} →</a>
        </div>`).join("")}
      </div>
      <span class="more reveal">${esc(l.more)}</span>
    </div>
  </section>`;
}
function secProof() {
  return `<section class="proof" data-nav="light"><div class="container"><div class="row">${DATA.proof.items.map(p => `
    <div class="cell"><div class="v count" data-count="${p.count}" data-suffix="${p.suffix}">${esc(p.v)}</div>
    <div class="l">${esc(p.l)}</div></div>`).join("")}</div></div></section>`;
}
function secSignals() {
  const s = DATA.signals;
  const rowHtml = s.rows.map((row, ri) => {
    const chips = row.map(c => `<span class="sig"><i style="background:${c.c}"></i>${esc(c.t)}</span>`).join("");
    return `<div class="mq-track ${["mq-a","mq-b","mq-c"][ri]}">${chips}${chips}</div>`;
  }).join("");
  return `<section class="signals" data-nav="dark">
    <div class="container"><div class="head reveal">
      <span class="eyebrow" style="color:#9EC1FF"><span class="dot"></span>${esc(s.eyebrow)}</span>
      <h2 class="h2">${fmt(s.title)}</h2>
      <p class="lead">${esc(s.lead)}</p>
    </div></div>
    <div class="marquee" aria-hidden="true">${rowHtml}</div>
    <div class="foot reveal"><a class="btn btn-ghost" href="${s.cta.href}">${esc(s.cta.label)}</a></div>
  </section>`;
}
/* logo resmi Cekat.AI — path diambil dari src/components/layout/logo.tsx */
function brandSvg(uid, cls) {
  return `<svg class="${cls}" viewBox="0 0 300 67" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cekat.AI">
    <mask id="bm-${uid}" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="300" height="67">
      <path d="${BRAND_WORDMARK_PATH}" fill="#1352BF"/>
    </mask>
    <g mask="url(#bm-${uid})"><path d="M299.998 0H0.000488281V66.3318H299.998V0Z" fill="currentColor"/></g>
  </svg>`;
}
function secProducts() {
  const p = DATA.products;
  /* deck ala Amplemarket: kartu pertama (default terbuka) berada paling bawah */
  const rev = [...p.items].reverse();
  return `<section class="products" data-nav="light">
    <div class="container">
      <div class="head reveal">
        <span class="eyebrow"><span class="dot"></span>${esc(p.eyebrow)}</span>
        <h2 class="h2">${esc(p.heading)}</h2>
        <p class="lead" style="text-align:center">${esc(p.lead)}</p>
      </div>
      <div class="doodle-hint" aria-hidden="true">${esc(p.doodle)}
        <svg width="46" height="38" viewBox="0 0 46 38" fill="none">
          <path d="M4 4c14 2 26 10 32 26" stroke="#98A2B3" stroke-width="2" stroke-linecap="round" stroke-dasharray="1 6"/>
          <path d="M28 26l8 6 2-10" stroke="#98A2B3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg></div>
      <div class="stack" id="stack">
        ${rev.map(it => `
        <article class="acc-card${it === p.items[0] ? " open" : ""}">
          <button class="acc-head" type="button">
            <span class="acc-dot" style="--c:${it.dot}"></span>
            <span class="acc-label">${esc(it.title)}</span>
          </button>
          <div class="acc-body"><div class="acc-inner">
            <div>
              <h4 class="pillar-h">${esc(it.headline)}</h4>
              <p>${esc(it.body)}</p>
              <div class="acc-pills">${it.pills.map(x => `<span>${esc(x)}</span>`).join("")}</div>
              <a class="textlink acc-cta" href="${it.cta.href}">${esc(it.cta.label)}</a>
            </div>
            <div class="pillar-media"><img src="${it.img}" alt="${esc(it.alt)}" loading="lazy"></div>
          </div></div>
        </article>`).join("")}
      </div>
    </div>
  </section>`;
}
function secPersonas() {
  const p = DATA.personas;
  const tabs = p.tabs.map((t, i) => `<button class="p-tab${i === 0 ? " on" : ""}" data-p="${t.id}" role="tab" aria-selected="${i === 0}">
    <span class="ico">${ICON[t.icon]}</span><span class="nm">${esc(t.name)}</span></button>`).join("");
  const panels = p.tabs.map((t, i) => {
    const c = p.panels[t.id];
    return `<div class="persona-panel${i === 0 ? " on" : ""}" data-panel="${t.id}">
      <div><h3>${esc(c.h)}</h3><p class="p-sub">${esc(c.sub)}</p>
        <a class="btn btn-outline" href="${c.cta.href}">${esc(c.cta.label)}</a></div>
      <div class="kpis">${c.kpis.map(k => `<div class="kpi"><span class="n">${esc(k.n)}</span>
        <div><h4>${esc(k.h)}</h4><p>${esc(k.p)}</p></div></div>`).join("")}</div>
    </div>`;
  }).join("");
  return `<section class="personas" data-nav="light">
    <div class="container">
      <div class="head reveal">
        <span class="eyebrow"><span class="dot"></span>${esc(p.eyebrow)}</span>
        <h2 class="h2">${esc(p.heading)}</h2>
        <p class="lead" style="text-align:center">${esc(p.lead)}</p>
      </div>
      <div class="persona-shell reveal">
        <div class="persona-tabs" role="tablist">${tabs}</div>
        ${panels}
      </div>
    </div>
  </section>`;
}
function secResults() {
  const r = DATA.results;
  const card = (c, i) => {
    const d = `--d:${(i % 3) * 80}ms`;
    if (c.type === "metric") return `<div class="b-card b-metric ${c.bg} reveal" style="${d}">
      <div class="big">${esc(c.big)}</div><div class="what">${esc(c.what)}</div>
      <div class="co">${esc(c.co)}</div><a class="go" href="${currentLocale() === "en" ? "/en/blog" : "/blog"}">${esc(DATA.readMore)} →</a></div>`;
    if (c.type === "quote") return `<div class="b-card b-quote reveal" style="${d}">
      <div class="q">${esc(c.q)}</div>
      <div class="who">${avatar(c.ava)}<span><span class="nm" style="display:block">${esc(c.nm)}</span>
      <span class="rl">${esc(c.rl)}</span></span><span class="clogo">${esc(c.logo)}</span></div></div>`;
    return `<div class="b-card b-full reveal"><div class="q">${esc(c.q)}</div>
      <div class="who">${avatar(c.ava)}<span><span class="nm" style="display:block">${esc(c.nm)}</span>
      <span class="rl">${esc(c.rl)}</span></span></div></div>`;
  };
  return `<section class="results" data-nav="light">
    <div class="container">
      <div class="head reveal">
        <span class="eyebrow"><span class="dot"></span>${esc(r.eyebrow)}</span>
        <h2 class="h2">${esc(r.heading)}</h2>
        <p class="lead">${esc(r.lead)}</p>
      </div>
      <div class="bento">${r.cards.map(card).join("")}</div>
    </div>
  </section>`;
}
function secVideos() {
  const v = DATA.videos;
  return `<section class="videos" data-nav="light">
    <div class="container">
      <div class="head reveal">
        <span class="eyebrow"><span class="dot"></span>${esc(v.eyebrow)}</span>
        <h2 class="h2">${esc(v.heading)}</h2>
        <p class="lead" style="text-align:center">${esc(v.lead)}</p>
      </div>
      <div class="vid-grid">${v.items.map((it, i) => `
        <div class="vid-card reveal-media" style="--d:${i * 90}ms" data-vid data-yt="${esc(it.yt)}">
          <img class="vid-poster" src="https://i.ytimg.com/vi/${esc(it.yt)}/hqdefault.jpg" alt="" loading="lazy">
          <div class="vid-play" aria-hidden="true"></div>
          <div class="vid-veil"><div class="vid-co">${esc(it.co)}</div><div class="vid-who">${esc(it.who)}</div></div>
        </div>`).join("")}
      </div>
      <p class="note reveal">${esc(v.note)}</p>
    </div>
  </section>`;
}
function secIndustries() {
  const s = DATA.industries;
  return `<section class="industries" data-nav="light">
    <div class="container">
      <div class="head reveal">
        <span class="eyebrow"><span class="dot"></span>${esc(s.eyebrow)}</span>
        <h2 class="h2">${esc(s.heading)}</h2>
        <p class="lead">${esc(s.lead)}</p>
      </div>
      <div class="ind-grid">${s.items.map((it, i) => `
        <a class="ind-card reveal-media" style="--d:${(i % 4) * 70}ms" href="${esc(it.href)}">
          <div class="ind-media"><img src="${esc(it.img)}" alt="${esc(it.name)}" loading="lazy"></div>
          <div class="ind-body">
            <h3>${esc(it.name)}</h3>
            <p class="ind-tag">${esc(it.tag)}</p>
            <div class="ind-chips">${it.chips.map((c) => `<span>${esc(c)}</span>`).join("")}</div>
            <span class="ind-go">${esc(s.cta)} →</span>
          </div>
        </a>`).join("")}
      </div>
      <div class="ind-more reveal"><a class="textlink" href="${esc(s.more.href)}">${esc(s.more.label)} →</a></div>
    </div>
  </section>`;
}
function secPricing() {
  const p = DATA.pricing;
  const plan = (pl, i) => `
    <article class="plan reveal${pl.popular ? " popular" : ""}" style="--d:${i * 70}ms">
      ${pl.popular ? `<span class="plan-badge">${esc(p.popular)}</span>` : ""}
      <div class="plan-top"><h3>${esc(pl.name)}</h3><span class="plan-idx">${String(i + 1).padStart(2, "0")}</span></div>
      <p class="plan-tag">${esc(pl.tag)}</p>
      <a class="btn ${pl.custom ? "btn-outline" : "btn-primary"} plan-cta" href="${esc(pl.href)}">${esc(pl.cta)}</a>
      <ul class="plan-specs">${pl.specs.map((v, j) => `
        <li><span class="tick" aria-hidden="true"></span><span><b>${esc(p.rows[j])}:</b> ${esc(v)}</span></li>`).join("")}
      </ul>
    </article>`;
  return `<section class="pricing" data-nav="light">
    <div class="container">
      <div class="head reveal">
        <span class="eyebrow"><span class="dot"></span>${esc(p.eyebrow)}</span>
        <h2 class="h2">${esc(p.heading)}</h2>
        <p class="lead">${esc(p.lead)}</p>
      </div>
      <p class="price-note reveal">${esc(p.note)}</p>
      <div class="plan-grid">${p.plans.map(plan).join("")}</div>
      <div class="plan-foot reveal">
        <a class="textlink" href="${esc(p.compare.href)}">${esc(p.compare.label)} →</a>
      </div>
    </div>
  </section>`;
}
function secLove() {
  const l = DATA.love;
  const col = (c) => {
    const cards = c.cards.map(x => `<div class="love-card">
      <div class="q">${esc(x.q)}</div>
      <div class="who">${avatar(x.ava)}<span><span class="nm" style="display:block">${esc(x.nm)}</span>
      <span class="rl">${esc(x.rl)}</span></span></div></div>`).join("");
    return `<div class="love-col ${c.dir}" style="--spd:${c.spd}">${cards}${cards}</div>`;
  };
  return `<section class="love" data-nav="dark">
    <div class="container"><div class="head reveal">
      <svg class="love-spark" width="46" height="46" viewBox="0 0 46 46" fill="none" aria-hidden="true">
        <path d="M23 4v10M23 32v10M4 23h10M32 23h10M9 9l7 7M30 30l7 7M37 9l-7 7M16 30l-7 7" stroke="#9EC1FF" stroke-width="2.4" stroke-linecap="round"/>
      </svg>
      <span class="eyebrow" style="color:#9EC1FF"><span class="dot"></span>${esc(l.eyebrow)}</span>
      <h2>${fmt(l.title)}</h2>
      <p class="lead">${esc(l.lead)}</p>
    </div></div>
    <div class="love-cols">${l.columns.map(col).join("")}</div>
  </section>`;
}
function secMidcta() {
  const m = DATA.midcta;
  return `<section class="midcta" data-nav="dark"><div class="container">
    <span class="eyebrow reveal" style="color:#BFD4FF"><span class="dot"></span>${esc(m.eyebrow)}</span>
    <h2 class="reveal" style="--d:60ms">${fmt(m.title)}</h2>
    <p class="reveal" style="--d:120ms">${esc(m.sub)}</p>
    <form class="capture reveal" style="--d:180ms">
      <input type="text" inputmode="email" placeholder="${esc(m.form.placeholder)}" aria-label="${esc(m.form.placeholder)}">
      <button class="btn btn-light" type="submit">${esc(m.form.cta)}</button>
    </form>
    <div class="trust-row reveal" style="--d:240ms">${m.trust.map((t, i) =>
      `${i ? '<span class="item">·</span>' : ""}<span class="item">${esc(t)}</span>`).join("")}</div>
  </div></section>`;
}
function secBlog(latest) {
  const b = DATA.blog;
  const list = latest && latest.length ? latest.slice(0, 3) : b.posts;
  const thumb = (p) => p.img
    ? `<div class="thumb has-img"><img src="${p.img}" alt="" loading="lazy" onerror="this.style.display='none'"></div>`
    : `<div class="thumb ${p.cls || "t1"}"><span class="tt">${p.tt || ""}</span></div>`;
  return `<section class="blog" data-nav="light">
    <div class="container">
      <div class="head reveal">
        <div><span class="eyebrow"><span class="dot"></span>${esc(b.eyebrow)}</span>
        <h2 class="h2" style="margin-top:10px">${esc(b.heading)}</h2></div>
        <a class="btn btn-outline" href="${b.cta.href}">${esc(b.cta.label)}</a>
      </div>
      <div class="blog-grid">${list.map((p, i) => `
        <a class="post reveal" style="--d:${i * 90}ms" href="${p.href}">
          ${thumb(p)}
          <div class="meta">${esc(p.meta)}</div>
          <div class="pt">${esc(p.title)}</div>
        </a>`).join("")}
      </div>
    </div>
  </section>`;
}
function renderFooter() {
  const f = DATA.footer;
  return `<div class="footer" data-nav="dark"><div class="container">
    <div class="f-grid reveal">
      <div class="f-brand">
        <div class="brand">${brandSvg("ftr", "brand-logo")}</div>
        <p>${esc(f.about)}</p>
        <span class="f-partner">${ICON.shield}${esc(f.partner)}</span>
        ${(f.apps && f.apps.length) ? `<div class="f-apps-wrap"><h5>${esc(f.appsTitle)}</h5><div class="f-apps">${f.apps.map(a =>
          `<a href="${a.href}" target="_blank" rel="noopener noreferrer">${esc(a.t)}</a>`).join("")}</div></div>` : ""}
        ${(f.countries && f.countries.length) ? `<div class="f-country">
          <h5>${esc(f.officeTitle)}</h5>
          <div class="f-tabs">${f.countries.map((c, i) =>
            `<button class="f-tab${i === 0 ? " on" : ""}" type="button" data-fc="${c.key}">${esc(c.label)}</button>`).join("")}</div>
          <div class="f-panels">${f.countries.map((c, i) =>
            `<div class="f-panel${i === 0 ? " on" : ""}" data-fc="${c.key}">${c.offices.map(o =>
              `<div class="f-office"><span class="city">${esc(o.city)}</span><span class="addr">${esc(o.addr)}</span></div>`).join("")}</div>`).join("")}</div>
        </div>` : ""}
      </div>
      ${f.cols.map(c => `<div class="f-col"><h5>${esc(c.h)}</h5>
        ${c.links.map(a => `<a href="${a.href}">${esc(a.t)}</a>`).join("")}</div>`).join("")}
    </div>
    <div class="f-bottom"><span>${esc(f.copyright)}</span>
      <span class="lg">${f.socials.map(s => `<a href="#">${esc(s)}</a>`).join("")}</span></div>
  </div></div>`;
}

/* ===================== mount ===================== */
const SECTIONS = { hero: secHero, logos: secLogos, proof: secProof, signals: secSignals,
  products: secProducts, personas: secPersonas, results: secResults, videos: secVideos,
  industries: secIndustries, love: secLove, pricing: secPricing, midcta: secMidcta, blog: secBlog };

/** Susun seluruh halaman preview (progress + backdrop + header + main + footer). */
export function buildPage(latestPosts, locale) {
  LOCALE = locale === "en" ? "en" : "id";
  DATA = LOCALE === "en" ? DATA_EN : DATA_ID;
  const header = renderNav();
  const main = DATA.order.map((k) => (k === "blog" ? secBlog(latestPosts) : SECTIONS[k]())).join("");
  const footer = renderFooter();
  return [
    '<div class="progress" id="progress" aria-hidden="true"></div>',
    '<div class="backdrop" id="backdrop" hidden></div>',
    `<header id="siteHeader">${header}</header>`,
    `<main id="main">${main}</main>`,
    `<footer id="siteFooter">${footer}</footer>`,
  ].join("");
}
