/* Shared behaviour for every page: mode toggle, menu, custom cursor,
   page-wipe navigation, the project illustration generator, helpers. */
window.SITE = (function () {
  "use strict";
  const CFG = window.SITE_CONFIG || {};
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const el = html => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };

  document.documentElement.classList.remove("no-js");

  /* type: ?font=garamond|playfair|caslon|fraunces|sans picks the page typeface (remembered) */
  (function typeface() {
    const root = document.documentElement, ok = ["garamond", "playfair", "caslon", "fraunces", "sans"];
    let saved = null; try { saved = localStorage.getItem("font"); } catch (_) {}
    const forced = new URLSearchParams(location.search).get("font");
    const pick = ok.includes(forced) ? forced : (ok.includes(saved) ? saved : "garamond");
    if (pick === "garamond") root.removeAttribute("data-font"); else root.setAttribute("data-font", pick);
    const extra = { playfair: "family=Playfair+Display:wght@500;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600",
                    caslon: "family=Libre+Caslon+Display&family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400",
                    fraunces: "family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600" }[pick];
    if (extra) { const l = document.createElement("link"); l.rel = "stylesheet"; l.href = "https://fonts.googleapis.com/css2?" + extra + "&display=swap"; document.head.appendChild(l); }
    if (forced && ok.includes(forced)) { try { localStorage.setItem("font", forced); } catch (_) {} }
  })();

  /* mode: dark (default) / light */
  (function mode() {
    const root = document.documentElement, toggle = $("#mode-toggle"), label = $("#mode-label"), theme = $('meta[name="theme-color"]');
    function apply(m, save) {
      if (m === "light") root.setAttribute("data-mode", "light"); else root.removeAttribute("data-mode");
      if (toggle) toggle.setAttribute("aria-pressed", String(m === "light"));
      if (label) label.textContent = m === "light" ? "Dark mode" : "Light mode";
      if (theme) theme.content = m === "light" ? "#f5f6f8" : "#121417";
      if (save) { try { localStorage.setItem("mode", m); } catch (_) {} }
    }
    let saved = null; try { saved = localStorage.getItem("mode"); } catch (_) {}
    const forced = new URLSearchParams(location.search).get("mode");          // ?mode=light|dark for previews
    apply((forced || saved) === "light" ? "light" : "dark", false);
    if (toggle) toggle.addEventListener("click", () => apply(root.getAttribute("data-mode") === "light" ? "dark" : "light", true));
  })();

  /* menu */
  (function menu() {
    const mt = $("#menu-toggle"), menu = $("#menu");
    if (!mt || !menu) return;
    const close = () => { menu.hidden = true; mt.setAttribute("aria-expanded", "false"); };
    mt.addEventListener("click", e => { e.stopPropagation(); menu.hidden = !menu.hidden; mt.setAttribute("aria-expanded", String(!menu.hidden)); });
    document.addEventListener("click", e => { if (!menu.hidden && !menu.contains(e.target)) close(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
    $$("a", menu).forEach(a => a.addEventListener("click", close));
  })();

  /* custom cursor: dot + ring; grows into a "Drag" badge over draggable areas */
  (function cursor() {
    const c = $("#cursor");
    if (!c || !matchMedia("(pointer: fine)").matches || reduceMotion) { if (c) c.remove(); return; }
    let x = -100, y = -100, rx = -100, ry = -100, raf = null;
    const dot = $(".cursor__dot", c), ring = $(".cursor__ring", c), label = $("#cursor-label");
    addEventListener("pointermove", e => { x = e.clientX; y = e.clientY; dot.style.transform = `translate(${x}px, ${y}px)`; if (!raf) raf = requestAnimationFrame(loop); }, { passive: true });
    function loop() { rx += (x - rx) * 0.2; ry += (y - ry) * 0.2; ring.style.transform = `translate(${rx}px, ${ry}px)`; raf = (Math.abs(x - rx) + Math.abs(y - ry) > 0.2) ? requestAnimationFrame(loop) : null; }
    document.addEventListener("pointerover", e => {
      const drag = e.target.closest("[data-drag]");
      c.classList.toggle("is-drag", !!drag);
      if (drag && label) label.textContent = drag.getAttribute("data-drag") || "Drag";
      c.classList.toggle("is-link", !drag && !!e.target.closest("a, button, [role=tab], .quiz__q"));
    });
    addEventListener("pointerdown", () => c.classList.add("is-down")); addEventListener("pointerup", () => c.classList.remove("is-down"));
    document.addEventListener("mouseleave", () => { c.style.opacity = "0"; }); document.addEventListener("mouseenter", () => { c.style.opacity = "1"; });
  })();

  /* page wipe: links with data-wipe get a sheet across the page before navigating */
  function wipeTo(href) {
    if (reduceMotion) { location.href = href; return; }
    let w = $("#wipe");
    if (!w) { w = el('<div class="wipe wipe--home" aria-hidden="true"></div>'); document.body.appendChild(w); }
    w.classList.remove("is-out"); void w.offsetWidth; w.classList.add("is-in");
    setTimeout(() => { location.href = href; }, 480);
  }
  document.addEventListener("click", e => {
    const a = e.target.closest("a[data-wipe]");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 || e.defaultPrevented) return;
    e.preventDefault(); wipeTo(a.getAttribute("href"));
  });
  addEventListener("pageshow", e => { if (e.persisted) $$(".wipe").forEach(w => w.classList.remove("is-in")); });

  /* ───────── illustration generator ─────────
     Line-art on cream, in the style of a product diagram. Deterministic per
     project id, labelled with the project's own pipeline steps. Returns SVG. */
  function art(p) {
    const W = 520, H = 300, steps = p.pipeline || [], id = p.id || "x";
    let seed = 0; for (const ch of id) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
    const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    const S = { ink: "var(--art-ink)", line: "var(--art-line)", soft: "var(--art-soft)", dark: "var(--art-dark)", bg: "var(--art-bg)" };
    const t = (x, y, s, size, anchor, weight) => `<text x="${x}" y="${y}" font-family="Space Grotesk, Inter, sans-serif" font-size="${size || 12}" font-weight="${weight || 600}" fill="${S.dark}" text-anchor="${anchor || "start"}">${esc(s)}</text>`;
    const win = (x, y, w, h, lines, title) => {
      let o = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${S.bg}" stroke="${S.ink}" stroke-width="1.5"/>`;
      o += `<line x1="${x}" y1="${y + 22}" x2="${x + w}" y2="${y + 22}" stroke="${S.ink}" stroke-width="1"/>`;
      for (let i = 0; i < 3; i++) o += `<circle cx="${x + 12 + i * 10}" cy="${y + 11}" r="3" fill="${S.line}"/>`;
      let yy = y + 38;
      for (let i = 0; i < lines; i++) {
        const n = 1 + Math.floor(rnd() * 2), ind = Math.floor(rnd() * 3) * 14; let xx = x + 14 + ind;
        for (let k = 0; k < n; k++) { const lw = 24 + rnd() * (w / 2 - 30); o += `<rect x="${xx}" y="${yy}" width="${lw}" height="5" rx="2.5" fill="${i === 2 ? S.dark : S.line}" opacity="${0.55 + rnd() * 0.45}"/>`; xx += lw + 8; }
        yy += 15; if (yy > y + h - 12) break;
      }
      if (title) o += t(x + w / 2, y - 10, title, 12, "middle", 700);
      return o;
    };
    const doc = (x, y) => `<path d="M${x} ${y}h22l10 10v30H${x}z" fill="${S.bg}" stroke="${S.ink}" stroke-width="1.5"/><path d="M${x + 22} ${y}v10h10" fill="none" stroke="${S.ink}" stroke-width="1.5"/>` +
      [0, 1, 2].map(i => `<rect x="${x + 6}" y="${y + 16 + i * 7}" width="${14 + i * 3}" height="3" rx="1.5" fill="${S.line}"/>`).join("");
    const dash = (x1, y1, x2, y2) => `<path d="M${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}" fill="none" stroke="${S.ink}" stroke-width="1.2" stroke-dasharray="4 4"/>`;
    const dot = (x, y) => `<circle cx="${x}" cy="${y}" r="3.5" fill="${S.dark}"/>`;
    const pill = (x, y, s) => `<rect x="${x}" y="${y}" width="${Math.max(70, s.length * 8 + 28)}" height="34" rx="17" fill="${S.soft}" stroke="${S.ink}" stroke-width="1.5"/>${t(x + 14, y + 22, s, 12, "start", 600)}<rect x="${x + Math.max(70, s.length * 8 + 28) - 20}" y="${y + 9}" width="1.5" height="16" fill="${S.dark}"/>`;
    let g = `<rect width="${W}" height="${H}" fill="${S.bg}"/><g opacity=".35">` + Array.from({ length: 14 }, (_, i) => Array.from({ length: 8 }, (_, j) => `<circle cx="${20 + i * 36}" cy="${20 + j * 36}" r="1" fill="${S.ink}"/>`).join("")).join("") + `</g>`;
    const first = steps[0] || "Input", last = steps[steps.length - 1] || "Output", mid = steps[Math.floor(steps.length / 2)] || "";

    switch (p.art) {
      case "graph": {
        const cx = 290, cy = 150;
        for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) { const x = 220 + i * 60 + (j % 2) * 30, y = 70 + j * 70; g += `<circle cx="${x}" cy="${y}" r="9" fill="${S.bg}" stroke="${S.line}" stroke-width="1.5"/>`; if (i < 3) g += `<line x1="${x}" y1="${y}" x2="${x + 60}" y2="${y}" stroke="${S.line}" stroke-width="1" opacity=".6"/>`; if (j < 2) g += `<line x1="${x}" y1="${y}" x2="${x + 30}" y2="${y + 70}" stroke="${S.line}" stroke-width="1" opacity=".6"/>`; }
        g += `<circle cx="${cx}" cy="${cy}" r="34" fill="none" stroke="${S.line}" stroke-width="1" opacity=".5"/><circle cx="${cx}" cy="${cy}" r="46" fill="none" stroke="${S.line}" stroke-width="1" opacity=".3"/>`;
        [[370, 85], [395, 155], [340, 225]].forEach(([x, y]) => { g += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="${S.ink}" stroke-width="2.5"/><circle cx="${x}" cy="${y}" r="10" fill="${S.bg}" stroke="${S.dark}" stroke-width="2.5"/><circle cx="${x}" cy="${y}" r="4" fill="${S.dark}"/>`; });
        g += `<circle cx="${cx}" cy="${cy}" r="20" fill="${S.ink}" stroke="${S.dark}" stroke-width="2"/>`;
        g += pill(60, cy - 17, first);
        g += win(430, 70, 110, 160, 4, last);
        g += t(cx, 260, mid, 12, "middle", 600);
        break;
      }
      case "camera": {
        g += `<rect x="40" y="40" width="300" height="200" rx="10" fill="${S.bg}" stroke="${S.ink}" stroke-width="1.5"/>`;
        [[40, 40, 1, 1], [340, 40, -1, 1], [40, 240, 1, -1], [340, 240, -1, -1]].forEach(([x, y, sx, sy]) => { g += `<path d="M${x} ${y + sy * 24} V${y} H${x + sx * 24}" fill="none" stroke="${S.dark}" stroke-width="3"/>`; });
        const boxes = [[80, 90, 120, 70], [215, 120, 95, 85], [95, 170, 70, 45]];
        boxes.forEach(([x, y, w, h], i) => { const lbl = steps[Math.min(i + 1, steps.length - 1)] || "object"; g += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="none" stroke="${i === 0 ? S.dark : S.ink}" stroke-width="2"/><rect x="${x}" y="${y - 16}" width="${lbl.length * 7 + 16}" height="16" rx="3" fill="${i === 0 ? S.dark : S.ink}"/><text x="${x + 8}" y="${y - 4}" font-family="Space Mono, monospace" font-size="9" fill="${S.bg}">${esc(lbl)} ${(0.82 + rnd() * 0.17).toFixed(2)}</text>`; });
        g += t(40, 268, first, 12, "start", 700);
        g += win(370, 60, 120, 180, 5, last);
        [0, 1, 2].forEach(i => g += `<rect x="382" y="${190 + i * 12}" width="${30 + rnd() * 60}" height="6" rx="3" fill="${S.dark}" opacity="${.9 - i * .25}"/>`);
        break;
      }
      case "chip": {
        g += `<rect x="150" y="60" width="220" height="180" rx="10" fill="${S.soft}" stroke="${S.ink}" stroke-width="1.5"/>`;
        g += `<rect x="215" y="110" width="90" height="80" rx="6" fill="${S.dark}"/><rect x="230" y="125" width="60" height="50" rx="3" fill="none" stroke="${S.bg}" stroke-width="1" opacity=".6"/>`;
        for (let i = 0; i < 6; i++) { const y = 118 + i * 12; g += `<rect x="203" y="${y}" width="12" height="4" fill="${S.ink}"/><rect x="305" y="${y}" width="12" height="4" fill="${S.ink}"/>`; }
        for (let i = 0; i < 7; i++) { const x = 223 + i * 12; g += `<rect x="${x}" y="98" width="4" height="12" fill="${S.ink}"/><rect x="${x}" y="190" width="4" height="12" fill="${S.ink}"/>`; }
        [[80, 90, 203, 130], [80, 180, 203, 166], [317, 130, 440, 100], [317, 166, 440, 200]].forEach(([x1, y1, x2, y2]) => { g += `<path d="M${x1} ${y1} H${(x1 + x2) / 2} V${y2} H${x2}" fill="none" stroke="${S.ink}" stroke-width="2"/>${dot(x1, y1)}${dot(x2, y2)}`; });
        g += t(80, 76, first, 12, "start", 700); g += t(80, 206, steps[1] || "", 11, "start", 600);
        g += t(440, 86, steps[steps.length - 2] || "", 11, "end", 600); g += t(440, 226, last, 12, "end", 700);
        g += `<circle cx="170" cy="80" r="4" fill="none" stroke="${S.ink}"/><circle cx="350" cy="80" r="4" fill="none" stroke="${S.ink}"/><circle cx="170" cy="220" r="4" fill="none" stroke="${S.ink}"/><circle cx="350" cy="220" r="4" fill="none" stroke="${S.ink}"/>`;
        break;
      }
      case "pipeline": {
        const n = Math.min(steps.length, 5), bw = 84, gap = (W - 40 - n * bw) / (n - 1 || 1);
        for (let i = 0; i < n; i++) {
          const x = 20 + i * (bw + gap), y = 90 + (i % 2) * 40;
          g += `<rect x="${x}" y="${y}" width="${bw}" height="56" rx="8" fill="${i === n - 1 ? S.dark : S.bg}" stroke="${S.ink}" stroke-width="1.5"/>`;
          g += `<text x="${x + bw / 2}" y="${y + 33}" font-family="Space Grotesk, sans-serif" font-size="11" font-weight="700" fill="${i === n - 1 ? S.bg : S.dark}" text-anchor="middle">${esc(steps[i].length > 13 ? steps[i].slice(0, 12) + "…" : steps[i])}</text>`;
          if (i < n - 1) g += dash(x + bw, y + 28, x + bw + gap, 90 + ((i + 1) % 2) * 40 + 28);
        }
        g += win(60, 200, 400, 80, 3, "");
        [0, 1, 2, 3, 4].forEach(i => g += `<circle cx="${100 + i * 70}" cy="${262}" r="14" fill="none" stroke="${S.ink}" stroke-width="1.2"/>`);
        break;
      }
      default: { // window
        g += win(50, 60, 150, 190, 9, first);
        g += win(320, 60, 150, 190, 8, last);
        [[225, 90], [265, 130], [225, 170], [265, 210]].forEach(([x, y], i) => { g += doc(x, y); });
        g += dash(200, 150, 225, 110) + dash(257, 150, 320, 150) + dash(200, 200, 225, 190) + dash(257, 230, 320, 200);
        g += dot(214, 150) + dot(300, 150) + dot(214, 200);
        g += t(260, 48, mid, 11, "middle", 600);
      }
    }
    return `<svg viewBox="0 0 ${W} ${H}" class="art" role="img" aria-label="${esc(p.title)} diagram">${g}</svg>`;
  }

  const y = $("#year"); if (y) y.textContent = new Date().getFullYear();
  const by = $("#bar-year"); if (by) by.textContent = new Date().getFullYear();

  return { CFG, reduceMotion, $, $$, esc, el, wipeTo, art };
})();
