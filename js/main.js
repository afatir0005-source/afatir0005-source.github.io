/* Home page behaviour: preloader, name rise, word swap, flip clock,
   console gadget, marquee, About word reveal, questionnaire, odometer,
   experience tabs with a ring of cards, internships, shelves, reveals,
   the zig-zag road and car, selected-work slider, thank-you, contact. */
(function () {
  "use strict";
  const S = window.SITE, { CFG, reduceMotion, $, $$, esc, el, art, wipeTo } = S;
  const DATA = window.SITE_DATA || {};
  const byId = Object.fromEntries((DATA.projects || []).map(p => [p.id, p]));

  /* ───────── preloader ───────── */
  (function loader() {
    const box = $("#loader"), num = $("#loader-count"), hero = $("#hero"), name = $("#name");
    const fontsReady = new Promise(res => { let done = false; const ok = () => { if (!done) { done = true; res(); } }; (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(ok); setTimeout(ok, 3500); });
    const stage = delay => setTimeout(() => { name.classList.add("in"); hero && hero.classList.add("in"); }, delay);
    if (!box) { fontsReady.then(() => stage(0)); return; }
    let seen = new URLSearchParams(location.search).has("nl"); try { seen = seen || sessionStorage.getItem("seen") === "1"; } catch (_) {}
    if (reduceMotion || seen) { box.remove(); document.body.classList.remove("is-loading"); fontsReady.then(() => stage(60)); return; }
    document.body.classList.add("is-loading");
    const t0 = performance.now(), dur = 1600;
    const counted = new Promise(res => (function step(now) {
      const p = Math.max(0, Math.min(1, (now - t0) / dur)), e = 1 - Math.pow(1 - p, 3);
      num.textContent = Math.round(e * 100);
      if (p < 1) requestAnimationFrame(step); else res();
    })(t0));
    Promise.all([counted, fontsReady]).then(() => setTimeout(() => {
      box.classList.add("is-done"); document.body.classList.remove("is-loading");
      stage(420);                                        // hero pieces follow the curtain
      setTimeout(() => box.remove(), 1000);
      try { sessionStorage.setItem("seen", "1"); } catch (_) {}
    }, 200));
  })();

  /* ───────── hero ───────── */
  (function hero() {
    const today = $("#today");
    try { today.textContent = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Karachi" }).format(new Date()); }
    catch (_) { today.textContent = new Date().toDateString(); }
    $$("[data-split]").forEach(w => { w.innerHTML = Array.from(w.dataset.split).map((ch, i) => `<span class="name__ch" style="transition-delay:${i * 45}ms">${ch === " " ? "&nbsp;" : esc(ch)}</span>`).join(""); });
    // one element, text swapped between an "out" and an "in" slide; skipped while the tab is hidden
    const swap = $("#swap"), words = DATA.builds || [], item = swap && $(".swap__item", swap);
    if (!swap || words.length < 2 || reduceMotion) return;
    let i = 0, busy = false;
    setInterval(() => {
      if (document.hidden || busy) return; busy = true;
      item.classList.add("is-out");
      setTimeout(() => {
        i = (i + 1) % words.length; item.textContent = words[i];
        item.classList.remove("is-out"); item.classList.add("is-in"); void item.offsetWidth; item.classList.remove("is-in");
        busy = false;
      }, 460);
    }, 2800);
  })();

  /* ───────── split-flap rows ───────── */
  function makeFlaps(container, length) {
    const tiles = [];
    for (let i = 0; i < length; i++) {
      const t = el(`<span class="flap"><span class="flap__half flap__top"><span> </span></span><span class="flap__half flap__bottom"><span> </span></span></span>`);
      container.appendChild(t); tiles.push({ el: t, ch: " " });
    }
    return function set(text) {
      const s = String(text).padEnd(length).slice(0, length);
      tiles.forEach((t, i) => {
        const ch = s[i]; if (ch === t.ch) return;
        const prev = t.ch; t.ch = ch;
        const top = $(".flap__top span", t.el), bottom = $(".flap__bottom span", t.el);
        if (reduceMotion) { top.textContent = ch; bottom.textContent = ch; return; }
        $$(".flap__leaf", t.el).forEach(l => l.remove());
        const front = el(`<span class="flap__leaf flap__leaf--front"><span>${esc(prev)}</span></span>`);
        const back = el(`<span class="flap__leaf flap__leaf--back"><span>${esc(ch)}</span></span>`);
        top.textContent = ch;
        front.style.animationDelay = back.style.animationDelay = (i * 28) + "ms";
        t.el.appendChild(front); t.el.appendChild(back);
        back.addEventListener("animationend", () => { bottom.textContent = ch; front.remove(); back.remove(); }, { once: true });
      });
    };
  }

  (function flipclock() {
    const box = $("#flipclock-tiles"); if (!box) return;
    const hh = el('<span class="flaps"></span>'), mm = el('<span class="flaps"></span>'), ss = el('<span class="flaps flaps--sec"></span>');
    const colon = () => el('<span class="flipclock__colon" aria-hidden="true"><i></i><i></i></span>');
    box.appendChild(hh); box.appendChild(colon()); box.appendChild(mm); box.appendChild(colon()); box.appendChild(ss);
    const setH = makeFlaps(hh, 2), setM = makeFlaps(mm, 2), setS = makeFlaps(ss, 2);
    function tick() {
      let t;
      try { t = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Karachi", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date()); }
      catch (_) { const d = new Date(); t = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`; }
      const [h, m, s] = t.split(":"); setH(h); setM(m); setS(s);
    }
    tick(); setInterval(tick, 1000);
  })();

  (function gadget() {
    const count = $("#lcd-count"), caseBox = $("#lcd-case"), state = $("#lcd-state"), build = $("#lcd-build"), fill = $("#lcd-fill");
    if (!count) return;
    const TOTAL = 512, cases = ["BOOT_TIME_UNDER_30S", "TOUCH_LATENCY_20PT", "HDMI_HOTPLUG_RECOVERY", "WRITE_APP_MULTI_PEN", "OPS_POWER_CYCLE", "WIFI_RECONNECT_x50", "ANNOTATION_UNDO_REDO", "SCREENSHARE_4K_60", "OTA_ROLLBACK", "USB_C_PD_NEGOTIATE", "AUDIO_LOOPBACK", "SLEEP_WAKE_x100", "TOUCH_PALM_REJECT"];
    const setCase = makeFlaps(caseBox, 20);
    let ci = 0; setCase(cases[0]);
    let running = false;
    setInterval(() => { ci = (ci + 1 + Math.floor(Math.random() * 3)) % cases.length; setCase(cases[ci]); if (running) state.textContent = Math.random() < 0.12 ? "RETRY" : "RUN"; }, 2500);
    const finish = () => { running = false; count.textContent = `${TOTAL}/${TOTAL}`; state.textContent = "PASS"; build.textContent = "BUILD OK"; fill.style.width = "100%"; };
    if (reduceMotion) return finish();
    function run() {
      running = true; build.textContent = "RUNNING"; state.textContent = "RUN";
      const t0 = performance.now(), dur = 12000;
      (function step(now) {
        const p = Math.max(0, Math.min(1, (now - t0) / dur));
        count.textContent = `${String(Math.round(TOTAL * p)).padStart(3, "0")}/${TOTAL}`;
        fill.style.width = (p * 100) + "%";
        if (p < 1) requestAnimationFrame(step); else { finish(); setTimeout(run, 25000); }
      })(t0);
    }
    setTimeout(run, 2200);
  })();

  (function marquee() { const t = $("#marquee"); if (!t) return; const items = (DATA.marquee || []).map(w => `<span>${esc(w)}</span>`).join(""); t.innerHTML = items + items; })();

  /* ───────── about ───────── */
  (function about() {
    const lead = $("#about-lead"), a = DATA.about || {};
    lead.innerHTML = (a.lead || "").split(" ").map(w => `<span class="w">${esc(w)}</span>`).join(" ");
    const words = $$(".w", lead);
    function paint() {
      const r = lead.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35)));
      const n = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle("on", i < n));
    }
    if (reduceMotion) words.forEach(w => w.classList.add("on")); else { addEventListener("scroll", paint, { passive: true }); addEventListener("resize", paint); paint(); }
    const paras = $("#about-paras"); (a.paras || []).forEach(p => paras.appendChild(el(`<p class="reveal">${esc(p)}</p>`)));

    const g = DATA.gym || {};
    const pages = g.pages && g.pages.length ? g.pages : [{ title: g.title || "Ask me", sub: g.sub || "", items: g.items || [] }];
    const viewport = $("#quiz-viewport"), track = $("#quiz-track"), dots = $("#quiz-dots");
    let page = Math.min(pages.length - 1, Math.max(0, (parseInt(new URLSearchParams(location.search).get("quiz"), 10) || 1) - 1));
    pages.forEach((pg, pi) => {
      const items = (pg.items || []).map((it, i) => `<li class="quiz__item"><button class="quiz__q" type="button" aria-expanded="false" aria-controls="qa-${pi}-${i}">${esc(it.q)}</button><p class="quiz__a" id="qa-${pi}-${i}" hidden>${esc(it.a)}</p></li>`).join("");
      track.appendChild(el(`<section class="quiz__page" aria-label="${esc(pg.title || "")}">
        <div class="quiz__head"><span class="mono eyebrow">${esc(pg.eyebrow || g.eyebrow || "questionnaire")}</span><h3>${esc(pg.title || "Ask me")}</h3><p class="muted">${esc(pg.sub || "")}</p></div>
        <ol class="quiz__list">${items}</ol></section>`));
      const d = el(`<button class="quiz__dot" type="button" role="tab" aria-selected="false" title="${esc(pg.title || "")}"><span class="sr-only">${esc(pg.title || "Page " + (pi + 1))}</span></button>`);
      d.addEventListener("click", () => goQuiz(pi));
      dots.appendChild(d);
    });
    const pageEls = $$(".quiz__page", track);
    const fitQuiz = () => { viewport.style.height = pageEls[page].offsetHeight + "px"; };
    const showQuiz = () => {
      track.style.transform = `translateX(${-page * 100}%)`;
      pageEls.forEach((p, i) => { p.classList.toggle("is-on", i === page); p.setAttribute("aria-hidden", i === page ? "false" : "true"); p.inert = i !== page; });
      $$(".quiz__dot", dots).forEach((d, i) => { d.classList.toggle("is-on", i === page); d.setAttribute("aria-selected", i === page ? "true" : "false"); });
      fitQuiz();
    };
    const goQuiz = next => { if (next === page || next < 0 || next >= pages.length) return; page = next; showQuiz(); };
    track.addEventListener("click", e => {
      const q = e.target.closest(".quiz__q"); if (!q) return;
      const list = q.closest(".quiz__list"), a = document.getElementById(q.getAttribute("aria-controls")), open = a.hidden;
      $$(".quiz__q", list).forEach(b => { b.setAttribute("aria-expanded", "false"); document.getElementById(b.getAttribute("aria-controls")).hidden = true; });
      if (open) { a.hidden = false; q.setAttribute("aria-expanded", "true"); }
      fitQuiz();
    });
    $("#quiz").addEventListener("keydown", e => { if (e.key === "ArrowRight") goQuiz(page + 1); if (e.key === "ArrowLeft") goQuiz(page - 1); });
    /* swipe between pages on touch */
    let sx = null;
    track.addEventListener("pointerdown", e => { if (e.pointerType === "touch") sx = e.clientX; });
    track.addEventListener("pointerup", e => { if (sx == null) return; const dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 40) goQuiz(page + (dx < 0 ? 1 : -1)); });
    if (pages.length < 2) $("#quiz-nav").hidden = true;
    addEventListener("resize", fitQuiz);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitQuiz);
    showQuiz();

    const list = $("#stats");
    (DATA.stats || []).forEach(s => list.appendChild(el(`<li class="reveal"><b data-count="${s.value}">0<small>${esc(s.suffix || "")}</small></b><span>${esc(s.label)}</span></li>`)));
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (!en.isIntersecting) return; io.unobserve(en.target);
      const b = en.target, target = +b.dataset.count, small = b.querySelector("small");
      if (reduceMotion) { b.firstChild.textContent = target.toLocaleString(); return; }
      const t0 = performance.now();
      (function step(now) { const p = Math.max(0, Math.min(1, (now - t0) / 1400)), e = 1 - Math.pow(1 - p, 3); b.firstChild.textContent = Math.round(target * e).toLocaleString(); if (p < 1) requestAnimationFrame(step); })(t0);
      b.appendChild(small);
    }), { threshold: .5 });
    $$("[data-count]", list).forEach(b => io.observe(b));
  })();

  /* ───────── card slider ─────────
     A horizontal loop of portrait cards. The wheel or a press-and-drag moves
     it continuously, momentum carries on after release, and it settles with
     one card in focus (white). Only that card's "Open project" is a link. */
  function makeSlider(container, cards, org) {
    const n = cards.length;
    const stage = el('<div class="slider__stage"></div>'); container.appendChild(stage);
    const els = cards.map((c, i) => {
      const p = c.project && byId[c.project], link = p && !p.noLink;
      const e = el(`<div class="slider__card" data-domain="${esc(p ? p.domain : "")}"></div>`);
      e.innerHTML = `<div class="ring__top"><span class="ring__org">${esc(org)}</span><span class="ring__num mono">${String(i + 1).padStart(2, "0")}/${String(n).padStart(2, "0")}</span></div>
        <div><span class="ring__kind mono">${esc(p ? (DATA.domains[p.domain] || "project") : (c.kind || "activity"))}</span><h5 class="ring__title">${esc(c.title)}</h5><p class="ring__sub">${esc(c.sub || "")}</p>${link ? `<a class="ring__open" href="project.html?id=${esc(p.id)}" data-open draggable="false">Open project →</a>` : ""}</div>`;
      stage.appendChild(e); return e;
    });
    let cur = 0, target = 0, vel = 0, raf = null, snapT = null, down = false, sx = 0, startTarget = 0, lastX = 0, lastT = 0, moved = false, downEl = null;
    const wrap = d => { if (n < 2) return 0; d = d % n; if (d > n / 2) d -= n; if (d < -n / 2) d += n; return d; };
    const per = () => (container.clientWidth < 600 ? 232 : 262) + 22;
    function layout() {
      const limit = container.clientWidth / per() / 2 + 1;
      els.forEach((e, i) => {
        const d = wrap(i - cur), ad = Math.abs(d);
        if (ad > limit) { e.style.opacity = "0"; e.style.pointerEvents = "none"; e.style.transform = "translate(-50%,-50%)"; return; }
        e.style.transform = `translate(-50%, -50%) translateX(${Math.round(d * per())}px) translateY(${(-Math.max(0, 1 - ad) * 12).toFixed(1)}px)`;
        e.style.opacity = "1";
        e.style.zIndex = String(Math.round(30 - ad * 4));
        e.style.pointerEvents = "";
        e.classList.toggle("is-center", ad < 0.5);
      });
    }
    function tick() {
      if (!down && vel !== 0) { target += vel; vel *= 0.93; if (Math.abs(vel) < 0.004) { vel = 0; target = Math.round(target); } }
      const diff = target - cur; cur += diff * 0.14; layout();
      if (down || vel !== 0 || Math.abs(diff) > 0.001) raf = requestAnimationFrame(tick); else { cur = target; layout(); raf = null; }
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const snapSoon = () => { clearTimeout(snapT); snapT = setTimeout(() => { if (!down && vel === 0) { target = Math.round(target); kick(); } }, 170); };
    container.addEventListener("wheel", e => {
      e.preventDefault();
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (reduceMotion) { target = Math.round(target) + Math.sign(delta); kick(); return; }
      vel = 0; target += delta / 320; kick(); snapSoon();
    }, { passive: false });
    container.addEventListener("pointerdown", e => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      down = true; moved = false; sx = lastX = e.clientX; startTarget = target = cur; vel = 0; lastT = performance.now();
      downEl = e.target.closest("[data-open]");
      container.classList.add("is-dragging"); container.setPointerCapture(e.pointerId); kick();
    });
    container.addEventListener("pointermove", e => {
      if (!down) return;
      const dx = e.clientX - sx; if (Math.abs(dx) > 6) moved = true;
      target = startTarget - dx / per();
      const now = performance.now(), dt = Math.max(1, now - lastT);
      vel = vel * 0.5 + (-(e.clientX - lastX) / per()) * (16 / dt) * 0.5;
      lastX = e.clientX; lastT = now;
    });
    const release = () => {
      if (!down) return; down = false; container.classList.remove("is-dragging");
      if (!moved) { vel = 0; target = Math.round(target); if (downEl && downEl.closest(".is-center")) wipeTo(downEl.getAttribute("href")); }
      else if (Math.abs(vel) < 0.01) { vel = 0; target = Math.round(target); }
      downEl = null; kick();
    };
    container.addEventListener("pointerup", release); container.addEventListener("pointercancel", release);
    container.addEventListener("click", e => { if (e.target.closest("a")) e.preventDefault(); }, true);
    container.addEventListener("keydown", e => { if (e.key === "ArrowRight") { target = Math.round(target) + 1; kick(); } if (e.key === "ArrowLeft") { target = Math.round(target) - 1; kick(); } });
    addEventListener("resize", layout);
    layout();
  }

  /* ───────── experience tabs ───────── */
  (function tabs() {
    const tabs = $("#tabs"), ink = $("#tabs-ink"), panel = $("#tabpanel");
    const EXP = DATA.experience || [];
    EXP.forEach((x, i) => tabs.appendChild(el(`<button class="tab" role="tab" id="tab-${esc(x.id)}" aria-selected="${i === 0}" aria-controls="tabpanel" data-i="${i}">${esc(x.tab)}${x.current ? '<span class="tag">Present</span>' : ""}</button>`)));
    let cur = -1;
    function render(x) {
      panel.innerHTML = `
        <div class="exp">
          <header class="exp__head">
            <div class="exp__id">
              <p class="exp__kind"><span class="tag ${x.current ? "" : "tag--muted"}">${esc(x.current ? "Present" : x.kind)}</span></p>
              <h3 class="exp__org">${esc(x.org)}</h3>
              <p class="exp__role">${esc(x.role)}</p>
              <p class="exp__meta"><span class="pin">${esc(x.place)}</span><span>${esc(x.period)}</span></p>
            </div>
            <div class="exp__cols">
              <div><span class="tag tag--muted">What I do</span><p>${esc(x.what)}</p></div>
              <div><span class="tag tag--muted">What I solve</span><p>${esc(x.solves)}</p></div>
            </div>
          </header>
          <div class="exp__skills"><span class="tag tag--muted">Skills I used here</span><ul class="skillset">${(x.skills || []).map(s => `<li>${esc(s)}</li>`).join("")}</ul></div>
          ${(x.groups || []).map((g, gi) => `
            <div class="ringwrap">
              <div class="ringwrap__head"><span class="tag">${esc(g.title)}</span></div>
              <div class="slider" data-drag="Drag" tabindex="0" aria-label="${esc(g.title)}" data-g="${gi}"></div>
            </div>`).join("")}
          ${x.confidential ? `<p class="exp__nda mono">✎ company and client code stays with them · described, not linked</p>` : ""}
        </div>`;
      $$(".slider", panel).forEach(r => makeSlider(r, x.groups[+r.dataset.g].cards, x.tab));
      if (window.SITE_ROAD) window.SITE_ROAD.rebuild();
    }
    function moveInk(btn) { ink.style.left = btn.offsetLeft + "px"; ink.style.width = btn.offsetWidth + "px"; }
    let switchT = null;
    function select(i, instant) {
      if (i === cur) return;
      const prev = cur; cur = i;
      $$(".tab", tabs).forEach((b, j) => b.setAttribute("aria-selected", String(j === i)));
      const btn = $$(".tab", tabs)[i]; moveInk(btn);
      if (!instant) tabs.scrollTo({ left: Math.max(0, btn.offsetLeft - 24), behavior: reduceMotion ? "auto" : "smooth" });
      if (instant || reduceMotion) { render(EXP[i]); return; }
      const dir = i > prev ? 1 : -1;                     // forward: content leaves left, arrives from the right
      panel.style.minHeight = panel.offsetHeight + "px";
      panel.classList.remove("is-out-left", "is-out-right", "is-in-left", "is-in-right");
      panel.classList.add(dir > 0 ? "is-out-left" : "is-out-right");
      clearTimeout(switchT);
      switchT = setTimeout(() => {
        render(EXP[i]);
        panel.classList.remove("is-out-left", "is-out-right");
        panel.classList.add(dir > 0 ? "is-in-right" : "is-in-left");
        void panel.offsetWidth;
        panel.classList.remove("is-in-right", "is-in-left");
        setTimeout(() => { panel.style.minHeight = ""; }, 500);
      }, 240);
    }
    tabs.addEventListener("click", e => { const b = e.target.closest(".tab"); if (b) select(+b.dataset.i); });
    tabs.addEventListener("keydown", e => { if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return; const n = (cur + (e.key === "ArrowRight" ? 1 : -1) + EXP.length) % EXP.length; select(n); $$(".tab", tabs)[n].focus(); });
    select(0, true);
    addEventListener("resize", () => moveInk($$(".tab", tabs)[cur]));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => moveInk($$(".tab", tabs)[cur]));
  })();

  /* ───────── internships ───────── */
  (function internships() {
    const box = $("#interns"); if (!box) return;
    (DATA.internships || []).forEach(x => box.appendChild(el(`
      <article class="intern reveal">
        <div class="intern__head"><span class="tag tag--muted">Internship</span><span class="mono muted">${esc(x.period)}</span></div>
        <h3>${esc(x.org)}</h3>
        <p class="intern__role">${esc(x.role)} · <span class="muted">${esc(x.place)}</span></p>
        <p class="intern__what">${esc(x.what)}</p>
        <ul class="skillset">${(x.skills || []).map(s => `<li>${esc(s)}</li>`).join("")}</ul>
        <div class="intern__photos">${(x.images && x.images.length ? x.images : [null, null, null]).slice(0, 3).map((src, k) => src
          ? `<figure class="has-img"><button type="button" class="intern__zoom" data-zoom="${esc(x.id)}" data-k="${k}" aria-label="Enlarge ${esc(x.org)} photo ${k + 1}"><img src="${esc(src)}" alt="${esc(x.org)} photo ${k + 1}" loading="lazy"></button></figure>`
          : `<figure>photo ${k + 1}<br>coming soon</figure>`).join("")}</div>
      </article>`)));

    /* lightbox: click a photo to enlarge it; arrows and keys move within that card's photos */
    const lb = $("#lightbox"), lbImg = $("#lightbox-img"), lbCap = $("#lightbox-cap"); if (!lb) return;
    let set = [], k = 0, who = "", lastFocus = null;
    const show = () => { lbImg.src = set[k]; lbImg.alt = `${who} photo ${k + 1}`; lbCap.textContent = `${who} · ${k + 1} / ${set.length}`; $("#lightbox-prev").hidden = $("#lightbox-next").hidden = set.length < 2; };
    const open = (x, i) => { set = x.images.slice(0, 3); k = i; who = x.org; lastFocus = document.activeElement; show(); lb.hidden = false; document.body.classList.add("has-lightbox"); requestAnimationFrame(() => lb.classList.add("is-open")); $("#lightbox-close").focus(); };
    const close = () => { lb.classList.remove("is-open"); document.body.classList.remove("has-lightbox"); setTimeout(() => { lb.hidden = true; lbImg.src = ""; }, 260); if (lastFocus) lastFocus.focus(); };
    const step = d => { if (set.length < 2) return; k = (k + d + set.length) % set.length; show(); };
    box.addEventListener("click", e => { const b = e.target.closest(".intern__zoom"); if (!b) return; const x = (DATA.internships || []).find(i => i.id === b.dataset.zoom); if (x) open(x, +b.dataset.k); });
    $("#lightbox-close").addEventListener("click", close);
    $("#lightbox-prev").addEventListener("click", () => step(-1));
    $("#lightbox-next").addEventListener("click", () => step(1));
    lb.addEventListener("click", e => { if (e.target === lb || e.target.classList.contains("lightbox__fig")) close(); });
    addEventListener("keydown", e => { if (lb.hidden) return; if (e.key === "Escape") close(); if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); });
  })();

  /* ───────── all projects: a deck in a box ─────────
     Every project is one big card. The deck is a fixed-height box, so the
     page scrolls past it like any other section. A wheel over a card flips
     to the next or previous card; the one leaving drops back and fades. */
  (function work() {
    const stack = $("#stack"), pos = $("#work-pos");
    if (!stack) return;
    const ALL = DATA.projects || [], n = ALL.length;
    const cards = ALL.map((p, i) => stack.appendChild(el(`
      <div class="stackcard" data-domain="${esc(p.domain)}">
        <div class="stackcard__art">${art(p)}</div>
        <div class="stackcard__body">
          <span class="tag">${String(i + 1).padStart(2, "0")} / ${String(n).padStart(2, "0")} · ${esc(DATA.domains[p.domain] || "")}</span>
          <h3>${esc(p.title)}</h3>
          <p class="stackcard__meta">${esc(p.org)} · ${esc(p.period)}</p>
          <p class="stackcard__summary">${esc(p.summary)}</p>
          <ul class="skillset">${(p.stack || []).slice(0, 5).map(s => `<li>${esc(s)}</li>`).join("")}</ul>
          ${p.noLink ? "" : `<a class="stackcard__open" href="project.html?id=${esc(p.id)}" data-open draggable="false">Open project →</a>`}
        </div>
      </div>`)));

    /* continuous loop: `cur` is a fractional index. The wheel nudges the
       target, a drag follows the pointer, and momentum carries on after
       release at the speed you let go. It settles on the nearest card. */
    let cur = 0, target = 0, vel = 0, raf = null, snapT = null;
    let down = false, sy = 0, startTarget = 0, lastY = 0, lastT = 0, moved = false, downCard = null, downLink = null;
    const wrap = d => { d = d % n; if (d > n / 2) d -= n; if (d < -n / 2) d += n; return d; };
    const H = () => stack.clientHeight;
    function layout() {
      const h = H() * 0.82;
      cards.forEach((c, i) => {
        const d = wrap(i - cur), ad = Math.abs(d);
        if (ad > 2.2) { c.style.opacity = "0"; c.style.pointerEvents = "none"; c.style.transform = "translateY(0) scale(.8)"; c.setAttribute("aria-hidden", "true"); return; }
        c.style.transform = `translateY(${(d * h * 0.92).toFixed(1)}px) translateZ(${(-ad * 160).toFixed(0)}px) rotateX(${(-d * 14).toFixed(2)}deg) scale(${(1 - ad * 0.07).toFixed(3)})`;
        c.style.opacity = String(Math.max(0, 1 - ad * 0.42));
        c.style.zIndex = String(Math.round(30 - ad * 6));
        c.style.pointerEvents = ad < 0.5 ? "" : "none";
        c.setAttribute("aria-hidden", String(ad >= 0.5));
        c.tabIndex = ad < 0.5 ? 0 : -1;
      });
    }
    function tick() {
      if (!down) {
        if (vel !== 0) { target += vel; vel *= 0.93; if (Math.abs(vel) < 0.004) { vel = 0; target = Math.round(target); } }
      }
      const diff = target - cur; cur += diff * 0.14;
      layout();
      if (down || vel !== 0 || Math.abs(diff) > 0.001) raf = requestAnimationFrame(tick); else { cur = target; layout(); raf = null; }
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const snapSoon = () => { clearTimeout(snapT); snapT = setTimeout(() => { if (!down && vel === 0) { target = Math.round(target); kick(); } }, 170); };

    // wheel: continuous, in either direction, looping
    stack.addEventListener("wheel", e => {
      e.preventDefault();
      if (reduceMotion) { target = Math.round(target) + Math.sign(e.deltaY); kick(); return; }
      vel = 0; target += e.deltaY / 420; kick(); snapSoon();
    }, { passive: false });

    // press and drag up or down; let go and it keeps rolling at that speed, then settles
    stack.addEventListener("pointerdown", e => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      down = true; moved = false; sy = lastY = e.clientY; startTarget = target = cur; vel = 0; lastT = performance.now();
      downCard = e.target.closest(".stackcard"); downLink = e.target.closest("[data-open]");
      stack.classList.add("is-dragging"); stack.setPointerCapture(e.pointerId); kick();
    });
    stack.addEventListener("pointermove", e => {
      if (!down) return;
      const dy = e.clientY - sy; if (Math.abs(dy) > 6) moved = true;
      const per = H() * 0.75;
      target = startTarget - dy / per;
      const now = performance.now(), dt = Math.max(1, now - lastT);
      vel = vel * 0.5 + (-(e.clientY - lastY) / per) * (16 / dt) * 0.5;      // smoothed per-frame speed
      lastY = e.clientY; lastT = now;
    });
    const release = () => {
      if (!down) return; down = false; stack.classList.remove("is-dragging");
      if (!moved) {
        vel = 0; target = Math.round(target);
        if (downLink && downCard && Math.abs(wrap(cards.indexOf(downCard) - cur)) < 0.5) wipeTo(downLink.getAttribute("href"));
      } else if (Math.abs(vel) < 0.01) { vel = 0; target = Math.round(target); }
      downCard = null; downLink = null; kick();
    };
    stack.addEventListener("pointerup", release); stack.addEventListener("pointercancel", release);
    stack.addEventListener("click", e => { if (e.target.closest("a")) e.preventDefault(); }, true);   // taps are handled on release
    stack.addEventListener("keydown", e => { if (e.key === "ArrowDown") { e.preventDefault(); target = Math.round(target) + 1; kick(); } if (e.key === "ArrowUp") { e.preventDefault(); target = Math.round(target) - 1; kick(); } });
    addEventListener("resize", layout);
    layout();
  })();

  /* ───────── education ───────── */
  (function education() {
    const box = $("#edu"); if (!box) return;
    (DATA.education || []).forEach(e => box.appendChild(el(`
      <article class="educard reveal">
        <p class="educard__meta"><span>${esc(e.period)}</span><i aria-hidden="true"></i><span>${esc(e.place)}</span></p>
        <div class="educard__body">
          <h3 class="educard__school">${esc(e.school)}</h3>
          <p class="educard__degree">${esc(e.degree)}</p>
          <p class="educard__note">${esc(e.note)}</p>
          ${e.detail ? `<p class="educard__detail">${esc(e.detail)}</p>` : ""}
        </div>
      </article>`)));
  })();

  /* ───────── shelves, certs, hobbies ───────── */
  (function rest() {
    const grid = $("#shelves");
    (DATA.toolbelt || []).forEach(g => grid.appendChild(el(`<section class="shelf reveal" data-domain="${esc(g.domain)}"><h3>${esc(g.group)}</h3><ul>${g.items.map(i => `<li>${esc(i)}</li>`).join("")}</ul></section>`)));
    const certs = $("#certs");
    (DATA.certifications || []).forEach(c => certs.appendChild(el(`<article class="cert reveal"><div class="cert__seal" aria-hidden="true">CERT<br>IFIED</div><div><h3>${esc(c.title)}</h3><p>${esc(c.issuer || "")}${c.year ? " · " + esc(c.year) : ""}</p>${c.link ? `<a href="${esc(c.link)}" target="_blank" rel="noopener">view credential ↗</a>` : ""}</div></article>`)));
    const ICONS = {
      camera: `<svg viewBox="0 0 24 24"><path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/></svg>`,
      barbell: `<svg viewBox="0 0 24 24"><path d="M3 10v4M6 8v8M18 8v8M21 10v4M6 12h12"/></svg>`,
      compass: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/></svg>`,
      snooker: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/><path d="M12 8.5v-2M9.5 12h-2"/></svg>`
    };
    const hob = $("#hobbies");
    (DATA.hobbies || []).forEach(h => hob.appendChild(el(`<article class="hobby reveal"><div class="hobby__icon">${ICONS[h.icon] || ICONS.compass}</div><h3>${esc(h.name)}</h3><p>${esc(h.note || "")}</p></article>`)));
  })();

  /* ───────── reveals ───────── */
  (function reveal() {
    const targets = $$(".reveal, .reveal-up, .section-title, .thanks__title");
    if (reduceMotion || !("IntersectionObserver" in window)) return targets.forEach(t => t.classList.add("in"));
    const io = new IntersectionObserver(entries => entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { threshold: .15 });
    targets.forEach(t => io.observe(t));
  })();

  /* ───────── zig-zag road + car ─────────
     The road runs straight down one margin beside each section, then takes
     a long, gentle S across the page to the other margin for the next one.
     The car eases toward the viewport's middle, so it never jumps. */
  (function road() {
    const page = $("#top"), svg = $("#road"), ghost = $("#road-ghost"), driven = $("#road-driven"), car = $("#car");
    if (!page || !svg) return;
    const AT = new URLSearchParams(location.search).get("at");
    let pts = [], total = 0, first = 0, last = 0, pageTop = 0, idx = 0, curY = null, targetY = 0, raf = null, moveTimer = null;
    let sig = "", queued = false;
    /* one rebuild per frame at most; skipped when nothing moved */
    function schedule() { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; build(); }); }
    function build() {
      const pr = page.getBoundingClientRect();
      pageTop = pr.top + scrollY;
      const W = page.offsetWidth, H = page.offsetHeight;
      const anchorsNow = $$(".hero, .section, .cta, .thanks", page);
      const s = W + "x" + H + ":" + anchorsNow.map(a => Math.round(a.offsetTop) + "/" + Math.round(a.offsetHeight)).join(",");
      if (s === sig) { update(false); return; }
      sig = s;
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`); svg.setAttribute("width", W); svg.setAttribute("height", H);
      const slack = Math.max(0, (innerWidth - W) / 2 - 40);
      const lx = slack > 24 ? -Math.min(slack, 70) : 4, rx = slack > 24 ? W + Math.min(slack, 70) : W - 4;
      const anchors = anchorsNow;
      const points = [];
      anchors.forEach((a, i) => {
        const r = a.getBoundingClientRect(), x = i % 2 ? rx : lx;
        const top = r.top - pr.top, h = r.height;
        const isHero = a.classList.contains("hero");
        points.push({ x, y: isHero ? top + h * 0.45 : top + 40 });
        points.push({ x, y: isHero ? top + h * 0.75 : top + h * 0.55 });   // the crossing starts here
      });
      points.push({ x: W / 2, y: H - 10 });
      let d = `M${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;
      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1], b = points[i];
        if (Math.abs(a.x - b.x) < 1) d += ` L${b.x.toFixed(1)},${b.y.toFixed(1)}`;
        else { const k = (b.y - a.y) * 0.55; d += ` C${a.x.toFixed(1)},${(a.y + k).toFixed(1)} ${b.x.toFixed(1)},${(b.y - k).toFixed(1)} ${b.x.toFixed(1)},${b.y.toFixed(1)}`; }
      }
      ghost.setAttribute("d", d); driven.setAttribute("d", d);
      /* sample the path ourselves (straight runs: 2 points, S crossings: 32 points on the cubic) instead of
         thousands of getPointAtLength calls, which froze the page on load and on every tab switch */
      pts = [{ x: points[0].x, y: points[0].y, l: 0 }];
      let len = 0;
      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1], b = points[i];
        if (Math.abs(a.x - b.x) < 1) { len += Math.hypot(b.x - a.x, b.y - a.y); pts.push({ x: b.x, y: b.y, l: len }); continue; }
        const k = (b.y - a.y) * 0.55, c1y = a.y + k, c2y = b.y - k, N = 32;
        let px = a.x, py = a.y;
        for (let j = 1; j <= N; j++) {
          const t = j / N, mt = 1 - t, mt2 = mt * mt, t2 = t * t;
          const x = mt2 * mt * a.x + 3 * mt2 * t * a.x + 3 * mt * t2 * b.x + t2 * t * b.x;
          const y = mt2 * mt * a.y + 3 * mt2 * t * c1y + 3 * mt * t2 * c2y + t2 * t * b.y;
          len += Math.hypot(x - px, y - py); px = x; py = y;
          pts.push({ x, y, l: len });
        }
      }
      total = driven.getTotalLength();                                       // one call, to keep the dash length exact
      if (len > 0 && total > 0) { const f = total / len; pts.forEach(p => { p.l *= f; }); }
      first = points[0].y; last = points[points.length - 1].y;
      idx = Math.min(idx, pts.length - 1);
      if (curY === null) curY = first;
      update(true);
    }
    function pointAtY(y) {
      while (idx < pts.length - 1 && pts[idx + 1].y < y) idx++;
      while (idx > 0 && pts[idx].y > y) idx--;
      const a = pts[idx], b = pts[Math.min(idx + 1, pts.length - 1)];
      const t = b.y === a.y ? 0 : Math.max(0, Math.min(1, (y - a.y) / (b.y - a.y)));
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, l: a.l + (b.l - a.l) * t, ang: Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI };
    }
    let lastAng = 90;
    function place(y) {
      if (!pts.length) return;
      const p = pointAtY(y);
      let ang = p.ang; while (ang - lastAng > 180) ang -= 360; while (ang - lastAng < -180) ang += 360;
      lastAng += (ang - lastAng) * 0.25;                                    // the nose turns gradually
      car.style.transform = `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px) rotate(${(lastAng - 90).toFixed(1)}deg)`;
      driven.style.strokeDasharray = `${p.l.toFixed(1)} ${total + 10}`;
    }
    function frame() {
      const diff = targetY - curY;
      if (Math.abs(diff) < 0.3 || reduceMotion) { curY = targetY; place(curY); raf = null; car.classList.remove("is-moving"); return; }
      curY += Math.sign(diff) * Math.min(Math.abs(diff) * 0.06, 14);         // eased and capped per frame
      place(curY); raf = requestAnimationFrame(frame);
    }
    function update(immediate) {
      const want = AT !== null ? first + (last - first) * (+AT / 100) : scrollY + innerHeight * 0.5 - pageTop;
      targetY = Math.max(first, Math.min(last, want));
      if (targetY !== curY) car.classList.add("is-moving");
      if (immediate) { curY = targetY; place(curY); car.classList.remove("is-moving"); return; }
      if (!raf) raf = requestAnimationFrame(frame);
    }
    addEventListener("scroll", () => update(false), { passive: true });
    addEventListener("resize", schedule, { passive: true });
    if ("ResizeObserver" in window) new ResizeObserver(schedule).observe(page);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
    window.SITE_ROAD = { rebuild: schedule };
    build();
  })();

  /* ───────── contact ───────── */
  (function contact() {
    const email = CFG.email || "";
    const emailEl = $("#contact-email"); if (email) emailEl.textContent = email;
    const li = $("#contact-linkedin"); if (CFG.linkedin) { li.href = CFG.linkedin; li.textContent = CFG.linkedin.replace(/^https?:\/\//, ""); }
    if (CFG.location) $("#contact-location").textContent = CFG.location;
    $("#copy-email").addEventListener("click", async function () {
      try { await navigator.clipboard.writeText(email); } catch (_) { const r = document.createRange(); r.selectNodeContents(emailEl); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
      this.textContent = "copied"; this.classList.add("is-done"); setTimeout(() => { this.textContent = "copy"; this.classList.remove("is-done"); }, 1800);
    });
    const form = $("#contact-form"), status = $("#form-status"), submit = $("#f-submit");
    const f = { name: $("#f-name"), email: $("#f-email"), message: $("#f-message") };
    const setStatus = (m, c) => { status.textContent = m; status.className = "status " + (c || ""); };
    const validate = () => Object.values(f).reduce((ok, x) => { const bad = !x.value.trim() || (x.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x.value)); x.classList.toggle("is-invalid", bad); return ok && !bad; }, true);
    Object.values(f).forEach(x => x.addEventListener("input", () => x.classList.remove("is-invalid")));
    form.addEventListener("submit", async e => {
      e.preventDefault();
      if ($("#f-gotcha").value) return;
      if (!validate()) return setStatus("All three fields, please, with a real email.", "err");
      const p = { name: f.name.value.trim(), email: f.email.value.trim(), message: f.message.value.trim() };
      if (CFG.formEndpoint) {
        submit.classList.add("is-busy"); setStatus("Sending…");
        try {
          const r = await fetch(CFG.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ ...p, _subject: `Portfolio message from ${p.name}` }) });
          if (!r.ok) throw new Error(r.status);
          form.reset(); setStatus("Sent. I'll write back soon.", "ok");
        } catch (_) { setStatus("Could not send right now. Email me at " + email, "err"); }
        finally { submit.classList.remove("is-busy"); }
        return;
      }
      location.href = `mailto:${email}?subject=${encodeURIComponent("Portfolio message from " + p.name)}&body=${encodeURIComponent(p.message + "\n\n— " + p.name + "\n" + p.email)}`;
      setStatus("Opening your mail app with the message filled in.", "ok");
    });
  })();

  (function assets() {
    const resume = $("#resume-link");
    if (CFG.resumePath && location.protocol !== "file:") fetch(CFG.resumePath, { method: "HEAD" }).then(r => { if (r.ok) { resume.href = CFG.resumePath; resume.hidden = false; } }).catch(() => {});
    const img = $("#avatar-img"), mono = $("#avatar-mono");
    if (CFG.photoPath) { const probe = new Image(); probe.onload = () => { img.src = CFG.photoPath; img.hidden = false; mono.hidden = true; }; probe.src = CFG.photoPath; }
  })();

  console.log("%c Abdul Fatir %c QA Automation · Python · Computer Vision ", "background:#a9d6ea;color:#0f2230;padding:4px 6px;border-radius:3px 0 0 3px", "background:#1c2026;color:#eef1f4;padding:4px 6px;border-radius:0 3px 3px 0");
})();
