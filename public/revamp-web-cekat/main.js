(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // Hero rotating word (Notion pattern): erase, switch colour, type the next word; the pill width follows
  const rot = $(".rot");
  if (rot && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const word = $(".rot__word", rot);
    const measure = $(".rot__measure", rot);
    const locale = $(".reference-home")?.dataset.locale || "en";
    const WORDS_BY_LOCALE = {
      en: ["revenue", "leads", "traffic"],
      id: ["pendapatan", "prospek", "lalu lintas"],
      cn: ["收入", "线索", "流量"],
      jp: ["収益", "リード", "トラフィック"],
      kr: ["매출", "리드", "트래픽"],
    };
    const WORDS = WORDS_BY_LOCALE[locale] || WORDS_BY_LOCALE.en;
    const fit = () => {
      measure.textContent = word.textContent || " ";
      word.style.width = `${measure.getBoundingClientRect().width}px`;
    };
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    let n = 0;
    fit();
    const cycle = async () => {
      for (;;) {
        await wait(2600);
        if (document.hidden) continue;
        rot.classList.add("is-typing");
        while (word.textContent.length) {
          word.textContent = word.textContent.slice(0, -1);
          fit();
          await wait(45);
        }
        n = (n + 1) % WORDS.length;
        rot.className = `rot rot--${WORDS[n]} is-typing`;
        for (const ch of WORDS[n]) {
          word.textContent += ch;
          fit();
          await wait(75);
        }
        rot.classList.remove("is-typing");
      }
    };
    document.fonts?.ready.then(fit);
    cycle();
  }

  // Nav: border once the page scrolls, mobile menu toggle
  const nav = $(".nav");
  const onScroll = () =>
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const toggle = $(".nav__toggle");
  const links = $("#nav-links");
  const pageLocale = $(".reference-home")?.dataset.locale || "en";
  const MENU_LABELS = {
    en: { open: "Open menu", close: "Close menu" },
    id: { open: "Buka menu", close: "Tutup menu" },
    cn: { open: "打开菜单", close: "关闭菜单" },
    jp: { open: "メニューを開く", close: "メニューを閉じる" },
    kr: { open: "메뉴 열기", close: "메뉴 닫기" },
  };
  const menuLabels = MENU_LABELS[pageLocale] || MENU_LABELS.en;
  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute(
      "aria-label",
      open ? menuLabels.close : menuLabels.open,
    );
    links.classList.toggle("is-open", open);
  };
  toggle.addEventListener("click", () =>
    setMenu(toggle.getAttribute("aria-expanded") !== "true"),
  );
  links.addEventListener("click", (e) => {
    if (e.target.closest("a, [data-demo]")) setMenu(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && links.classList.contains("is-open")) {
      setMenu(false);
      toggle.focus();
    }
  });

  // Mega menu (x.ai pattern): one shared white box (.mpop-bg) slides and resizes to fit whichever menu is
  // open, and the menus crossfade sideways in the direction the pointer moved. Hover opens it on desktop
  // (with a short delay so passing over doesn't flicker); click, Enter and arrow keys work everywhere.
  const row = $(".nav__row");
  const popBg = $(".mpop-bg");
  const mTriggers = $$(".mnav__trigger");
  const wide = window.matchMedia("(min-width: 1101px)");
  let openIdx = -1;
  let openT;
  let closeT;
  const menuOf = (t) =>
    document.getElementById(t.getAttribute("aria-controls"));
  const placeMenu = (menu, trig) => {
    const r = row.getBoundingClientRect();
    const left = Math.max(
      0,
      Math.min(
        trig.getBoundingClientRect().left - r.left - 10,
        r.width - menu.offsetWidth,
      ),
    );
    menu.style.left = `${left}px`;
    return { left, w: menu.offsetWidth, h: menu.offsetHeight };
  };
  const openMenu = (i, focusFirst) => {
    clearTimeout(closeT);
    if (i === openIdx) {
      if (focusFirst) $("a", menuOf(mTriggers[i]))?.focus();
      return;
    }
    const prev = openIdx;
    const dir = prev < 0 ? 0 : i > prev ? 1 : -1;
    const menu = menuOf(mTriggers[i]);
    mTriggers.forEach((t, n) =>
      t.setAttribute("aria-expanded", String(n === i)),
    );
    if (prev >= 0) {
      const old = menuOf(mTriggers[prev]);
      old.style.setProperty("--from", `${-dir * 28}px`);
      old.classList.remove("is-open");
    }
    if (wide.matches) {
      const box = placeMenu(menu, mTriggers[i]);
      menu.style.setProperty("--from", `${dir * 28}px`);
      void menu.offsetWidth;
      if (prev < 0) popBg.classList.add("no-size-anim");
      Object.assign(popBg.style, {
        left: `${box.left}px`,
        width: `${box.w}px`,
        height: `${box.h}px`,
      });
      void popBg.offsetWidth;
      popBg.classList.remove("no-size-anim");
      popBg.classList.add("is-open");
    }
    menu.classList.add("is-open");
    openIdx = i;
    if (focusFirst) $("a", menu)?.focus();
  };
  const closeMenu = (focusTrigger) => {
    clearTimeout(openT);
    if (openIdx < 0) return;
    const t = mTriggers[openIdx];
    const menu = menuOf(t);
    menu.style.setProperty("--from", "0px");
    menu.classList.remove("is-open");
    t.setAttribute("aria-expanded", "false");
    popBg.classList.remove("is-open");
    openIdx = -1;
    if (focusTrigger) t.focus();
  };
  mTriggers.forEach((t, i) => {
    t.addEventListener("click", () =>
      openIdx === i ? closeMenu() : openMenu(i),
    );
    t.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        openMenu(i, true);
      }
    });
    t.addEventListener("mouseenter", () => {
      if (!wide.matches) return;
      clearTimeout(openT);
      clearTimeout(closeT);
      if (openIdx >= 0) openMenu(i);
      else openT = setTimeout(() => openMenu(i), 90);
    });
  });
  // Moving onto Pricing, the logo or the buttons closes the menu, as on x.ai
  $$(".mnav__link, .nav__logo, .nav__actions").forEach((el) =>
    el.addEventListener("mouseenter", () => {
      if (wide.matches) {
        clearTimeout(openT);
        closeT = setTimeout(closeMenu, 120);
      }
    }),
  );
  row.addEventListener("mouseleave", () => {
    if (wide.matches) {
      clearTimeout(openT);
      closeT = setTimeout(closeMenu, 220);
    }
  });
  row.addEventListener("mouseenter", () => clearTimeout(closeT));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && openIdx >= 0) closeMenu(true);
  });
  document.addEventListener("click", (e) => {
    if (openIdx >= 0 && !row.contains(e.target)) closeMenu();
  });
  row.addEventListener("focusout", (e) => {
    if (wide.matches && openIdx >= 0 && !row.contains(e.relatedTarget))
      closeMenu();
  });
  $$(".mmenu a").forEach((a) => a.addEventListener("click", () => closeMenu()));
  window.addEventListener("resize", () => closeMenu());

  // Language picker: a click can intentionally open the native <details>, but
  // it must not remain visible after the pointer leaves the control. Focused
  // keyboard users retain it until focus moves away.
  const languagePicker = $(".nav__languages");
  if (languagePicker) {
    const openLanguagePicker = () => languagePicker.setAttribute("open", "");
    languagePicker.addEventListener("mouseenter", openLanguagePicker);
    languagePicker.addEventListener("mouseleave", () => {
      if (!languagePicker.matches(":focus-within"))
        languagePicker.removeAttribute("open");
    });
    languagePicker.addEventListener("focusout", (e) => {
      if (!languagePicker.contains(e.relatedTarget))
        languagePicker.removeAttribute("open");
    });
    document.addEventListener("click", (e) => {
      if (!languagePicker.contains(e.target))
        languagePicker.removeAttribute("open");
    });
  }
  // Products: the preview follows the hovered or focused product; links open that product's journey stage
  const mItems = $$(".mitem");
  const showPrev = (key) => {
    mItems.forEach((it) =>
      it.classList.toggle("is-on", it.dataset.prev === key),
    );
    $$(".mp").forEach((p) =>
      p.classList.toggle("is-on", p.dataset.prev === key),
    );
  };
  mItems.forEach((it) => {
    it.addEventListener("mouseenter", () => showPrev(it.dataset.prev));
    it.addEventListener("focus", () => showPrev(it.dataset.prev));
    it.addEventListener("click", () =>
      setTimeout(
        () => document.getElementById(`tab-${it.dataset.stage}`)?.click(),
        0,
      ),
    );
  });
  showPrev("marketing");

  // Trust marquee (Salesforce pattern): copy the logo list until the row overflows twice,
  // then slide by one copy at a steady ~40px/s. Copies are hidden from screen readers.
  const trust = $(".trust");
  const track = $(".marquee__track", trust);
  const firstList = $(".wordmarks", track);
  const fillMarquee = () => {
    $$(".wordmarks[aria-hidden]", track).forEach((l) => l.remove());
    const one = firstList.getBoundingClientRect().width;
    const copies = Math.max(
      1,
      Math.ceil((track.parentElement.clientWidth * 2) / one),
    );
    for (let i = 0; i < copies; i++) {
      const copy = firstList.cloneNode(true);
      copy.removeAttribute("aria-label");
      copy.setAttribute("aria-hidden", "true");
      track.append(copy);
    }
    track.style.setProperty("--shift", `${one}px`);
    track.style.setProperty("--dur", `${Math.round(one / 40)}s`);
  };
  fillMarquee();
  document.fonts?.ready.then(fillMarquee); // widths change once Google Sans Flex loads
  window.addEventListener("load", fillMarquee); // and once the logo images have their real widths
  let marqueeT;
  window.addEventListener("resize", () => {
    clearTimeout(marqueeT);
    marqueeT = setTimeout(fillMarquee, 200);
  });

  // Pain cards (Calendly pattern): hover, focus or click widens a card; stacked on small screens
  const gaps = $$(".gap");
  const stacked = window.matchMedia("(max-width: 1080px)");
  const canHover = window.matchMedia("(hover: hover)");
  const open = (card) => {
    if (stacked.matches || card.classList.contains("is-active")) return;
    gaps.forEach((g) => {
      const on = g === card;
      g.classList.toggle("is-active", on);
      $(".gap__btn", g).setAttribute("aria-expanded", String(on));
    });
  };
  let hoverT;
  gaps.forEach((g) => {
    $(".gap__btn", g).addEventListener("click", () => open(g));
    $(".gap__btn", g).addEventListener("focus", () => open(g));
    g.addEventListener("mouseenter", () => {
      if (canHover.matches) hoverT = setTimeout(() => open(g), 120);
    });
    g.addEventListener("mouseleave", () => clearTimeout(hoverT));
  });
  // Stacked: all cards are open; each one's rows build as it scrolls into view
  const gapIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) en.target.classList.add("is-active");
      });
    },
    { threshold: 0.35 },
  );
  const syncStacked = () => {
    if (stacked.matches) {
      gaps.forEach((g) => {
        $(".gap__btn", g).setAttribute("aria-expanded", "true");
        gapIO.observe(g);
      });
    } else {
      gapIO.disconnect();
      gaps.forEach((g, i) => {
        g.classList.toggle("is-active", i === 0);
        $(".gap__btn", g).setAttribute("aria-expanded", String(i === 0));
      });
    }
  };
  syncStacked();
  stacked.addEventListener("change", syncStacked);

  // Continuous card art: line each card's slice up with the row, so the shapes run across cards.
  // A ResizeObserver keeps it aligned while cards widen and narrow.
  const gapsRow = $(".gaps");
  const placeArt = () => {
    if (stacked.matches) return;
    const row = gapsRow.getBoundingClientRect();
    gaps.forEach((g) => {
      const art = $(".gap__art", g);
      const svg = $("svg", art);
      svg.style.left = `${row.left - art.getBoundingClientRect().left}px`;
      svg.style.width = `${row.width}px`;
    });
  };
  const artRO = new ResizeObserver(placeArt);
  gaps.forEach((g) => artRO.observe(g));
  artRO.observe(gapsRow);

  // App glimpses inside the pain cards: one small tab set per card
  $$(".app").forEach((app) => {
    const appTabs = $$(".app__tab", app);
    const pick = (tab, focus) => {
      appTabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
      });
      if (focus) tab.focus();
    };
    appTabs.forEach((tab, i) => {
      tab.addEventListener("click", () => pick(tab));
      tab.addEventListener("keydown", (e) => {
        const map = {
          ArrowRight: i + 1,
          ArrowLeft: i - 1,
          Home: 0,
          End: appTabs.length - 1,
        };
        if (!(e.key in map)) return;
        e.preventDefault();
        pick(appTabs[(map[e.key] + appTabs.length) % appTabs.length], true);
      });
    });
  });

  // Journey tabs (WAI-ARIA tabs pattern, manual activation by click, arrows move focus and select)
  const tabs = $$(".rail__tab");
  const railEl = $(".rail");
  const railNarrow = window.matchMedia("(max-width: 900px)");
  const select = (tab, focus) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute("aria-controls"));
      panel.hidden = !on;
    });
    // Lift the products this stage uses in the lineup above
    const stageKey = tab.getAttribute("aria-controls").replace("panel-", "");
    $$(".product").forEach((p) =>
      p.classList.toggle(
        "is-on",
        p.dataset.stages.split(" ").includes(stageKey),
      ),
    );
    if (focus) tab.focus();
    // Switching stage from deep in a long list starts the new stage at its top
    const bodyTop = $(".journey__body").getBoundingClientRect().top;
    if (bodyTop < 0)
      window.scrollTo({
        top: window.scrollY + bodyTop - (railNarrow.matches ? 72 : 96),
      });
  };
  // The rail is vertical beside the panels and horizontal on small screens
  const syncRail = () =>
    railEl.setAttribute(
      "aria-orientation",
      railNarrow.matches ? "horizontal" : "vertical",
    );
  syncRail();
  railNarrow.addEventListener("change", syncRail);
  $$(".product").forEach((p) =>
    p.classList.toggle(
      "is-on",
      p.dataset.stages.split(" ").includes("acquire"),
    ),
  );
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(tab));
    tab.addEventListener("keydown", (e) => {
      const map = {
        ArrowRight: i + 1,
        ArrowDown: i + 1,
        ArrowLeft: i - 1,
        ArrowUp: i - 1,
        Home: 0,
        End: tabs.length - 1,
      };
      if (!(e.key in map)) return;
      e.preventDefault();
      select(tabs[(map[e.key] + tabs.length) % tabs.length], true);
    });
  });

  // Journey feature lists (Calendly pattern): the capability crossing the middle of the screen, or the one
  // clicked, becomes active and its illustrative window builds itself. On small screens the window opens
  // right under the tapped capability instead.
  const narrow = window.matchMedia("(max-width: 900px)");
  $$(".feat").forEach((feat) => {
    const items = $$(".feat__item", feat);
    const stage = $(".feat__stage", feat);
    const views = $$(".vis", feat);
    let current = 0;
    const place = () => {
      if (narrow.matches) items[current].append(stage);
      else if (stage.parentElement !== feat) feat.append(stage);
    };
    const activate = (i) => {
      if (i === current && views[i].classList.contains("is-on")) {
        place();
        return;
      }
      current = i;
      items.forEach((it, n) => {
        it.classList.toggle("is-active", n === i);
        const btn = $(".feat__btn", it);
        if (n === i) btn.setAttribute("aria-current", "true");
        else btn.removeAttribute("aria-current");
      });
      views.forEach((v) => v.classList.remove("is-on"));
      void views[i].offsetWidth; // restart the build animation
      views[i].classList.add("is-on");
      place();
    };
    items.forEach((it, n) =>
      $(".feat__btn", it).addEventListener("click", () => activate(n)),
    );
    const featIO = new IntersectionObserver(
      (entries) => {
        if (narrow.matches) return;
        entries.forEach((en) => {
          if (en.isIntersecting) activate(items.indexOf(en.target));
        });
      },
      { rootMargin: "-48% 0px -52% 0px" },
    );
    items.forEach((it) => featIO.observe(it));
    narrow.addEventListener("change", place);
    place();
  });

  // Clara: hide the setup sequence until the section is in view, then play it once
  const clara = $(".clara");
  clara.classList.add("is-ready");
  const claraIO = new IntersectionObserver(
    ([en]) => {
      if (en.isIntersecting) {
        clara.classList.add("is-playing");
        claraIO.disconnect();
      }
    },
    { threshold: 0.35 },
  );
  claraIO.observe(clara);

  // Cekat MCP connection graphic: same pattern, plays once
  const mcp = $(".mcp");
  mcp.classList.add("is-ready");
  const mcpIO = new IntersectionObserver(
    ([en]) => {
      if (en.isIntersecting) {
        mcp.classList.add("is-playing");
        mcpIO.disconnect();
      }
    },
    { threshold: 0.4 },
  );
  mcpIO.observe(mcp);

  // Customer stories carousel: the open story sits in the middle, two neighbours on each side as slivers
  const reel = $(".reel");
  const tales = $$(".tale", reel);
  const dots = $$(".reel__dot", reel);
  const live = $("[data-reel-live]", reel);
  let openTale = 0;
  const showTale = (i) => {
    openTale = (i + tales.length) % tales.length;
    tales.forEach((t, n) => {
      let d = n - openTale;
      if (d > tales.length / 2) d -= tales.length;
      if (d < -tales.length / 2) d += tales.length;
      t.style.order = String(d + 3);
      t.classList.toggle("is-active", d === 0);
      t.classList.toggle("is-near", Math.abs(d) === 1);
      t.classList.toggle("is-far", Math.abs(d) === 2);
      t.setAttribute("aria-hidden", String(Math.abs(d) > 2));
    });
    dots.forEach((dot, n) => {
      dot.classList.toggle("is-on", n === openTale);
      dot.setAttribute("aria-current", String(n === openTale));
    });
    live.textContent = `${$(".tale__brand", tales[openTale]).textContent}: ${$(".tale__head", tales[openTale]).textContent}`;
  };
  tales.forEach((t, n) =>
    $(".tale__pick", t).addEventListener("click", () => showTale(n)),
  );
  dots.forEach((dot, n) => dot.addEventListener("click", () => showTale(n)));
  $$(".reel__arrow", reel).forEach((b) =>
    b.addEventListener("click", () =>
      showTale(openTale + Number(b.dataset.step)),
    ),
  );
  reel.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      showTale(openTale + 1);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      showTale(openTale - 1);
    }
  });
  showTale(0);
  live.textContent = "";

  // Integrations wall: tiles rise in once when it scrolls into view
  const iwall = $(".iwall");
  iwall.classList.add("is-ready");
  const iwallIO = new IntersectionObserver(
    ([en]) => {
      if (en.isIntersecting) {
        iwall.classList.add("is-in");
        iwallIO.disconnect();
      }
    },
    { threshold: 0.25 },
  );
  iwallIO.observe(iwall);

  // Final CTA: start the sparkles and product tiles when the band comes into view
  const finalPanel = $(".final__panel");
  const finalIO = new IntersectionObserver(
    ([en]) => {
      finalPanel.classList.toggle("is-in", en.isIntersecting);
    },
    { threshold: 0.1 },
  );
  finalIO.observe(finalPanel);

  // Mobile sticky trial bar: only while the hero buttons are off screen and the final CTA isn't showing,
  // so two trial buttons are never visible together
  const sticky = $(".sticky-cta");
  const stickyLink = $("a", sticky);
  const seen = { hero: true, final: false };
  const syncSticky = () => {
    const show = !seen.hero && !seen.final;
    sticky.classList.toggle("is-shown", show);
    document.body.classList.toggle("sticky-on", show);
    sticky.setAttribute("aria-hidden", String(!show));
    stickyLink.tabIndex = show ? 0 : -1;
  };
  const stickyIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      seen[en.target === finalPanel ? "final" : "hero"] = en.isIntersecting;
    });
    syncSticky();
  });
  stickyIO.observe($("#hero-ctas"));
  stickyIO.observe(finalPanel);

  // Demo dialog
  const dlg = $("#demo");
  const form = $(".demo__form", dlg);
  const done = $(".demo__done", dlg);
  const err = $(".demo__err", dlg);
  let opener = null;

  const openDemo = (btn) => {
    opener = btn;
    form.hidden = false;
    done.hidden = true;
    err.hidden = true;
    const interest = btn.dataset.interest;
    const industry = btn.dataset.industry;
    if (interest) form.interest.value = interest;
    if (industry) form.industry.value = industry;
    dlg.showModal();
    form.name.focus();
  };
  $$("[data-demo]").forEach((b) =>
    b.addEventListener("click", () => openDemo(b)),
  );
  $$("[data-close]", dlg).forEach((b) =>
    b.addEventListener("click", () => dlg.close()),
  );
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg) dlg.close();
  });
  dlg.addEventListener("close", () => {
    if (opener) opener.focus();
  });

  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fields = [
      [form.name, form.name.value.trim().length > 1, "your name"],
      [form.email, emailOk(form.email.value.trim()), "a valid work email"],
      [form.company, form.company.value.trim().length > 1, "your company"],
    ];
    const bad = fields.filter(([el, ok]) => {
      el.setAttribute("aria-invalid", String(!ok));
      return !ok;
    });
    if (bad.length) {
      err.textContent = `Please add ${bad.map((b) => b[2]).join(", ")}.`;
      err.hidden = false;
      bad[0][0].focus();
      return;
    }
    err.hidden = true;
    const send = $(".demo__send", form);
    send.disabled = true;
    send.textContent = "Sending…";
    // TODO: POST to the sales CRM endpoint. Until then, confirm locally after a short delay.
    setTimeout(() => {
      send.disabled = false;
      send.textContent = "Send to sales";
      $('[data-out="name"]', done).textContent = form.name.value
        .trim()
        .split(" ")[0];
      $('[data-out="interest"]', done).textContent = form.interest.value;
      form.hidden = true;
      done.hidden = false;
      $("button", done).focus();
      form.reset();
      $$("[aria-invalid]", form).forEach((el) =>
        el.removeAttribute("aria-invalid"),
      );
    }, 600);
  });
})();
