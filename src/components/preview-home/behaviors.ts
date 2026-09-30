/*
 * Interaksi preview homepage: nav morphing + mega menu, mobile menu,
 * reveal / count-up, hero parallax, pillars deck, persona tabs, video cards.
 *
 * Dipanggil sekali dari useEffect; semua listener window/document memakai
 * AbortSignal supaya aman di React StrictMode (mount → cleanup → mount).
 */
import { DATA as DATA_ID } from "./data";
import { DATA_EN } from "./data-en";
import { megaItems } from "./render";
import { appendAdParams } from "@/lib/ad-params";
import { REGISTER_URL } from "@/lib/links";
import { readStoredAdParams } from "@/hooks/use-app-url";

export function initPreviewHome(root: HTMLElement): () => void {
  const ac = new AbortController();
  const signal = ac.signal;
  const cleanups: Array<() => void> = [];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const q = <T extends Element = HTMLElement>(sel: string) =>
    root.querySelector(sel) as T | null;
  const qa = (sel: string) => Array.from(root.querySelectorAll(sel));

  const progress = q<HTMLElement>("#progress");
  const nav = q<HTMLElement>("#navRoot") as HTMLElement | null;
  const inner = q<HTMLElement>("#navInner") as HTMLElement | null;
  const backdrop = q<HTMLElement>("#backdrop");
  backdrop?.removeAttribute("hidden");
  if (!nav || !inner) return () => ac.abort();
  const navBar: HTMLElement = nav;
  const innerBar: HTMLElement = inner;

  /* ---------- scroll: progress + pill morph + theme + hero parallax ---------- */
  const heroSec = q<HTMLElement>("#heroSec");
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = scrollY;
      const h = document.documentElement.scrollHeight - innerHeight;
      if (progress) progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
      navBar.classList.toggle("pill", y > 40);
      const probeY = Math.round(innerBar.getBoundingClientRect().bottom + 4);
      let theme = navBar.classList.contains("t-dark") ? "dark" : "light";
      const hit = document.elementFromPoint(Math.round(innerWidth / 2), probeY);
      const sec = hit && hit.closest ? hit.closest("[data-nav]") : null;
      if (sec) {
        theme = (sec as HTMLElement).dataset.nav === "dark" ? "dark" : "light";
      } else {
        const below = Array.from(root.querySelectorAll<HTMLElement>("[data-nav]"))
          .find((s) => s.getBoundingClientRect().bottom > probeY);
        if (below) theme = below.dataset.nav === "dark" ? "dark" : "light";
      }
      navBar.classList.toggle("t-dark", theme === "dark");
      navBar.classList.toggle("t-light", theme !== "dark");
      if (!reduce && heroSec) {
        const hh = heroSec.offsetHeight;
        const p = Math.min(y, hh);
        const c = heroSec.querySelector<HTMLElement>(".container");
        const st = heroSec.querySelector<HTMLElement>(".hero-stage");
        if (c) {
          c.style.setProperty("--co", -p * 0.08 + "px");
          c.style.setProperty("--po", String(Math.max(0, 1 - p / 720)));
        }
        if (st) {
          /* Amplemarket-style: dashboard membesar saat masuk viewport —
             popup ikut membesar karena berada di dalam stage yang sama. */
          if (matchMedia("(min-width: 961px)").matches) {
            const sr = st.getBoundingClientRect();
            const enter = Math.min(1, Math.max(0, (innerHeight - sr.top) / (innerHeight * 0.55)));
            st.style.setProperty("--ps", (0.86 + 0.14 * enter).toFixed(3));
          } else {
            st.style.setProperty("--ps", "1");
          }
        }
      }
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true, signal });
  window.addEventListener("resize", onScroll, { signal });
  onScroll();

  /* ---------- mega menu (desktop) ---------- */
  let openMega: string | null = null;
  let leaveTimer: ReturnType<typeof setTimeout> | undefined;
  const triggers = qa(".nav-link[data-mega]") as HTMLButtonElement[];
  function closeMega() {
    if (openMega) document.getElementById("mega-" + openMega)?.classList.remove("open");
    triggers.forEach((t) => {
      t.classList.remove("on");
      t.setAttribute("aria-expanded", "false");
    });
    navBar.classList.remove("mega-open");
    openMega = null;
  }
  function setMega(id: string, trigger: HTMLButtonElement | null) {
    if (openMega && openMega !== id) {
      document.getElementById("mega-" + openMega)?.classList.remove("open");
    }
    const panel = document.getElementById("mega-" + id);
    if (!panel) return;
    panel.classList.add("open");
    navBar.classList.add("mega-open");
    triggers.forEach((t) => {
      const on = t === trigger;
      t.classList.toggle("on", on);
      t.setAttribute("aria-expanded", on ? "true" : "false");
    });
    openMega = id;
  }
  triggers.forEach((t) => {
    t.addEventListener("mouseenter", () => {
      if (!matchMedia("(min-width: 961px)").matches) return;
      clearTimeout(leaveTimer);
      setMega(t.dataset.mega || "", t);
    });
    t.addEventListener("click", (e) => {
      e.preventDefault();
      if (!matchMedia("(min-width: 961px)").matches) return;
      if (openMega === t.dataset.mega) closeMega();
      else setMega(t.dataset.mega || "", t);
    });
    t.addEventListener("focus", () => {
      if (matchMedia("(min-width: 961px)").matches) setMega(t.dataset.mega || "", t);
    });
  });
  navBar.addEventListener("mouseleave", () => {
    if (!matchMedia("(min-width: 961px)").matches) return;
    leaveTimer = setTimeout(closeMega, 180);
  }, { signal });
  navBar.addEventListener("mouseenter", () => clearTimeout(leaveTimer), { signal });

  const closeMenu = () => {
    const panel = q<HTMLElement>("#navPanel");
    const burger = q<HTMLElement>("#burger");
    panel?.classList.remove("open");
    navBar.classList.remove("menu-open");
    burger?.setAttribute("aria-expanded", "false");
    burger?.setAttribute("aria-label", "Buka menu");
    backdrop?.classList.remove("on");
  };
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMega();
      closeMenu();
    }
  }, { signal });
  document.addEventListener("click", (e) => {
    if (openMega && !navBar.contains(e.target as Node)) closeMega();
  }, { signal });

  /* kategori pada mega Fitur */
  type FiturLink = {
    id: string;
    categories?: Array<{
      id: string;
      title: string;
      items: Array<{ t: string; href: string; d?: string }>;
    }>;
  };
  const previewData =
    typeof location !== "undefined" && location.pathname.startsWith("/en")
      ? DATA_EN
      : DATA_ID;
  const fiturData = (previewData.nav.links as readonly FiturLink[]).find(
    (l) => l.id === "fitur",
  );
  qa(".mega-cat").forEach((btn) => {
    const switchTo = () => {
      const cat = fiturData?.categories?.find(
        (c) => c.id === (btn as HTMLElement).dataset.cat,
      );
      if (!cat) return;
      qa(".mega-cat").forEach((b) => b.classList.toggle("on", b === btn));
      const mega = btn.closest(".mega");
      const title = mega?.querySelector(".mega-panel-title");
      const box = document.getElementById("mega-items-fitur");
      if (title) title.textContent = cat.title;
      if (box) box.innerHTML = megaItems(cat.items);
    };
    btn.addEventListener("mouseenter", () => {
      if (matchMedia("(min-width: 961px)").matches) switchTo();
    });
    btn.addEventListener("click", switchTo);
  });

  /* ---------- mobile menu ---------- */
  const burger = q<HTMLElement>("#burger");
  const panel = q<HTMLElement>("#navPanel");
  burger?.addEventListener("click", () => {
    const open = !panel?.classList.contains("open");
    panel?.classList.toggle("open", open);
    navBar.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
    backdrop?.classList.toggle("on", open);
  });
  backdrop?.addEventListener("click", closeMenu);
  qa(".m-group > button").forEach((b) =>
    b.addEventListener("click", () => b.parentElement?.classList.toggle("open")),
  );

  /* ---------- hero popup loop: skala kanvas 1514×720 + pause saat tak terlihat ---------- */
  const loopFrame = q<HTMLElement>("#loopFrame");
  const loopStage = q<HTMLElement>("#loopStage");
  if (loopFrame && loopStage) {
    const CW = 1514, CH = 720;
    const fitLoop = () => {
      if (matchMedia("(max-width: 960px)").matches) return;
      const W = loopFrame.clientWidth, H = loopFrame.clientHeight;
      if (!W || !H) return;
      /* popup lebih besar dari pas-lebar agar jelas (canvas boleh meluber dikit) */
      const s = Math.min(Math.max(W / CW, 0.72), 0.78);
      loopStage.style.setProperty("--s", s.toFixed(4));
      loopStage.style.setProperty("--tx", Math.round((W - CW * s) / 2) + "px");
      loopStage.style.setProperty("--ty", Math.round((H - CH * s) / 2) + "px");
    };
    fitLoop();
    const loopRO = new ResizeObserver(() => fitLoop());
    loopRO.observe(loopFrame);
    cleanups.push(() => loopRO.disconnect());
    window.addEventListener("resize", fitLoop, { signal });
    /* Tanpa pause-IO: siklus34s diizinkan jalan terus agar selalu loop dari awal. */
  }

  /* ---------- language switcher (hover di desktop, klik tetap jalan) ---------- */
  const langRoot = q<HTMLElement>("#langSwitch");
  const langBtn = q<HTMLElement>("#langBtn");
  const langMenu = q<HTMLElement>("#langMenu");
  const hoverable = matchMedia("(hover: hover) and (pointer: fine)");
  function setLang(open: boolean) {
    langMenu?.classList.toggle("open", open);
    langBtn?.setAttribute("aria-expanded", String(open));
  }
  langBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    setLang(!langMenu?.classList.contains("open"));
  });
  langRoot?.addEventListener("mouseenter", () => {
    if (hoverable.matches) setLang(true);
  });
  langRoot?.addEventListener("mouseleave", () => {
    if (hoverable.matches) setLang(false);
  });
  document.addEventListener("click", () => setLang(false), { signal });

  /* ---------- capture form (hero + mid-CTA) → halaman register ---------- */
  qa("form.capture").forEach((form) =>
    form.addEventListener(
      "submit",
      (e) => {
        e.preventDefault();
        const go = document.createElement("a");
        go.href = appendAdParams(REGISTER_URL, readStoredAdParams());
        go.click();
      },
      { signal },
    ),
  );

  /* ---------- footer: tab kantor (Indonesia / Singapura / Malaysia) ---------- */
  qa(".f-tab").forEach((tab) =>
    tab.addEventListener("click", () => {
      const k = (tab as HTMLElement).dataset.fc;
      qa(".f-tab").forEach((t) => t.classList.toggle("on", t === tab));
      qa(".f-panel").forEach((pn) =>
        pn.classList.toggle("on", (pn as HTMLElement).dataset.fc === k),
      );
    }),
  );

  /* ---------- reveal ---------- */
  const revealEls = qa(".reveal, .reveal-media");
  if (reduce || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    revealEls.forEach((el) => io.observe(el));
    cleanups.push(() => io.disconnect());
  }

  /* ---------- proof count-up ---------- */
  function animateCount(el: Element) {
    const target = Number(el.getAttribute("data-count"));
    const sfx = el.getAttribute("data-suffix") || "";
    let t0: number | null = null;
    const tick = (t: number) => {
      if (t0 === null) t0 = t;
      const p = Math.min(1, (t - t0) / 1500);
      el.textContent =
        Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString("id-ID") + sfx;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  const counts = qa(".count");
  if (reduce || !("IntersectionObserver" in window)) {
    counts.forEach((el) => {
      el.textContent =
        Number(el.getAttribute("data-count")).toLocaleString("id-ID") +
        (el.getAttribute("data-suffix") || "");
    });
  } else {
    const cio = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animateCount(e.target);
            cio.unobserve(e.target);
          }
        }),
      { threshold: 0.5 },
    );
    counts.forEach((el) => cio.observe(el));
    cleanups.push(() => cio.disconnect());
  }

  /* ---------- pillars deck (ala Amplemarket) ---------- */
  const stack = q<HTMLElement>("#stack") as HTMLElement;
  if (stack) {
    const setPos = () =>
      Array.from(stack.children).forEach((c, i) => {
        (c as HTMLElement).dataset.pos = String(i);
      });
    setPos();
    const openOnly = (card: Element) =>
      Array.from(stack.children).forEach((c) =>
        c.classList.toggle("open", c === card),
      );
    const desk = () => matchMedia("(min-width: 961px)").matches;

    function syncH() {
      if (!desk()) {
        stack.style.height = "";
        return;
      }
      const front = stack.lastElementChild as HTMLElement | null;
      if (front) stack.style.height = front.offsetTop + front.offsetHeight + "px";
    }
    function trackH() {
      syncH();
      if (reduce) return;
      const t0 = performance.now();
      const loop = (t: number) => {
        syncH();
        if (t - t0 < 700) requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }
    const hObs = new ResizeObserver(() => syncH());
    Array.from(stack.children).forEach((c) => hObs.observe(c));
    cleanups.push(() => hObs.disconnect());
    window.addEventListener("resize", syncH, { signal });
    syncH();

    stack.addEventListener("click", (e) => {
      const head = (e.target as HTMLElement).closest(".acc-head");
      if (!head) return;
      const card = head.closest(".acc-card");
      if (!card) return;
      if (desk()) {
        if (card !== stack.lastElementChild) stack.appendChild(card);
        setPos();
        openOnly(card);
        trackH();
      } else {
        card.scrollIntoView({
          behavior: reduce ? "auto" : "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    });
  }

  /* ---------- persona tabs ---------- */
  const tabs = qa(".p-tab") as HTMLButtonElement[];
  const panels = qa(".persona-panel");
  tabs.forEach((tab) =>
    tab.addEventListener("click", () => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.classList.toggle("on", on);
        t.setAttribute("aria-selected", String(on));
      });
      panels.forEach((p) =>
        p.classList.toggle("on", (p as HTMLElement).dataset.panel === tab.dataset.p),
      );
    }),
  );

  /* ---------- video cards (YouTube embeds, same videos as the homepage) ---------- */
  qa("[data-vid]").forEach((card) => {
    const yt = card.getAttribute("data-yt");
    if (!yt) return;
    card.addEventListener("click", () => {
      if (card.classList.contains("playing")) return;
      qa("[data-vid]").forEach((other) => {
        if (other === card) return;
        other.classList.remove("playing");
        other.querySelector("iframe")?.remove();
      });
      const frame = document.createElement("iframe");
      frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(yt)}?autoplay=1`;
      const co = card.querySelector(".vid-co")?.textContent?.trim();
      frame.title = co ? `${co} video testimonial` : "Customer video testimonial";
      frame.allow = "accelerate-compute; autoplay; encrypted-media";
      frame.allowFullscreen = true;
      frame.className = "vid-frame";
      card.append(frame);
      card.classList.add("playing");
    });
  });

  return () => {
    ac.abort();
    cleanups.forEach((fn) => fn());
  };
}
