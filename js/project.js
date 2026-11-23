/* Project detail page: reads ?id=… and renders from js/data.js */
(function () {
  "use strict";
  const S = window.SITE, { reduceMotion, $, $$, esc, el, art } = S;
  const DATA = window.SITE_DATA || {};
  const P = DATA.projects || [];
  const id = new URLSearchParams(location.search).get("id");
  let i = P.findIndex(p => p.id === id);
  if (i < 0) i = 0;
  const p = P[i];

  const wipe = $("#wipe");
  if (wipe) { if (reduceMotion) wipe.remove(); else requestAnimationFrame(() => requestAnimationFrame(() => wipe.classList.add("is-out"))); }

  if (!p) { $("#p-title").textContent = "No project found"; return; }
  document.title = `${p.title} · Abdul Fatir`;
  document.documentElement.style.setProperty("--dc", `var(--c-${p.domain})`);
  $("#p-crumb").textContent = `project ${String(i + 1).padStart(2, "0")} / ${String(P.length).padStart(2, "0")}`;
  $("#p-dom").textContent = DATA.domains[p.domain] || p.domain;
  $("#p-title").textContent = p.title;
  $("#p-meta").textContent = [p.org, p.period].filter(Boolean).join(" · ");
  $("#p-summary").textContent = p.summary || "";
  $("#p-problem").textContent = p.problem || "";
  $("#p-approach").textContent = p.approach || "";
  $("#p-outcome").textContent = p.outcome || "";

  $("#p-hero").innerHTML = art(p) + `<figcaption class="muted">How ${esc(p.title)} fits together.</figcaption>`;

  const pipe = $("#p-pipeline");
  pipe.innerHTML = `<p class="pipeline__label mono eyebrow">how it works</p><div class="pipeline__row">${(p.pipeline || []).map((s, j) => `${j ? `<span class="pipeline__arrow" style="--i:${j}">→</span>` : ""}<span class="pipeline__step" style="--i:${j}"><span class="mono">${String(j + 1).padStart(2, "0")}</span>${esc(s)}</span>`).join("")}</div>`;

  const grid = $("#p-screens");
  if ((p.images || []).length) {
    p.images.forEach((src, k) => grid.appendChild(el(`<figure class="screen"><img src="${esc(src)}" alt="${esc(p.title)} screen ${k + 1}" loading="lazy"><figcaption>${esc(p.title)} · screen ${k + 1}</figcaption></figure>`)));
  } else {
    const steps = p.pipeline || [];
    const log = steps.map((s, j) => `<span class="dim">[${String(j + 1).padStart(2, "0")}]</span> ${esc(s).toUpperCase().padEnd(26, ".")} <span class="ok">OK</span>`).join("\n");
    grid.appendChild(el(`<figure class="screen"><div class="mock"><div class="mock__bar"><i></i><i></i><i></i><span>${esc(p.id)} · run</span></div><div class="mock__body">$ <span class="acc">run</span> ${esc(p.id)}\n${log}\n<span class="ok">done</span> · ${esc((p.stack || []).slice(0, 3).join(" · "))}\n$ <span class="acc">_</span></div></div><figcaption>Pipeline run, rendered from the project data. Real screens go in assets/projects/${esc(p.id)}/</figcaption></figure>`));
    grid.appendChild(el(`<figure class="screen"><div class="mock"><div class="mock__bar"><i></i><i></i><i></i><span>${esc(p.id)} · stack</span></div><div class="mock__body"><span class="dim"># ${esc(p.org)} · ${esc(p.period)}</span>\n${(p.stack || []).map(s => `<span class="acc">+</span> ${esc(s)}`).join("\n")}\n\n<span class="dim"># domain</span>\n${esc(DATA.domains[p.domain] || "")}</div></div><figcaption>Skill set and setting for this project.</figcaption></figure>`));
  }

  const bl = $("#p-bullets");
  (p.bullets || []).forEach(b => bl.appendChild(el(`<li>${esc(b)}</li>`)));
  if (!(p.bullets || []).length) bl.appendChild(el(`<li>${esc(p.approach || p.summary)}</li>`));
  $("#p-nda").hidden = !p.confidential;
  const st = $("#p-stack"); (p.stack || []).forEach(s => st.appendChild(el(`<li>${esc(s)}</li>`)));

  const prev = P[(i - 1 + P.length) % P.length], next = P[(i + 1) % P.length];
  const a = $("#p-prev"), b = $("#p-next");
  a.href = `project.html?id=${prev.id}`; a.setAttribute("data-wipe", ""); $("strong", a).textContent = prev.title;
  b.href = `project.html?id=${next.id}`; b.setAttribute("data-wipe", ""); $("strong", b).textContent = next.title;
  $("#back-link").setAttribute("data-wipe", "");
})();
