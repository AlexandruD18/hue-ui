/*
 * Prototipo delle schermate di Hue UI (direzione B). Non è il generatore vero: alterna palette
 * d'esempio. Contrasti, ruoli ricavati e correzioni sono però calcolati con la formula WCAG 2.1.
 * Nota: il prototipo mescola i colori in sRGB; il generatore vero lavora in OKLCH (04 - Specifiche § 5).
 * Stati richiamabili dall'URL: ?state=dark|edit-error|why-pass|why-aa|why-adjusted|why-fail|shortcuts|
 * toast-copied|toast-error|all-locked|undo-tip   e   ?view=mobile
 */
(function () {
    const { icon } = window.HueIcons;
    const PALETTES = [
        { background: "#f2f4f3", surface: "#ffffff", text: "#1b2421", primary: "#2c6a58", accent: "#b0532c",
            adjusted: { primary: { from: "#4a8f7b", to: "#2c6a58" } } },
        { background: "#14161b", surface: "#1e222a", text: "#eceef1", primary: "#93b6ff", accent: "#f0b467", adjusted: {} },
        { background: "#faf6f3", surface: "#f0e9e3", text: "#2a2320", primary: "#6f3a92", accent: "#b8215a", adjusted: {} },
    ];
    // conflitto tra due colori bloccati: Background scritto a mano (#FFFFFF) e Primary bloccato troppo chiaro
    const CONFLICT = { background: "#ffffff", surface: "#f1f3f7", text: "#1b2421", primary: "#8fa8ff", accent: "#b0532c", adjusted: {} };
    const ROLES = ["background", "surface", "text", "primary", "accent"];
    const NAME = { background: "Background", surface: "Surface", text: "Text", primary: "Primary", accent: "Accent" };
    const ROLE_OF = { Background: "background", Surface: "surface", Text: "text", Primary: "primary", Accent: "accent" };

    // ---------- colore ----------
    const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
    const hex = (c) => "#" + c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
    const lin = (v) => ((v /= 255) <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
    const lum = (h) => { const [r, g, b] = rgb(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
    const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
    const mix = (a, b, t) => { const A = rgb(a), B = rgb(b); return hex(A.map((v, i) => v + (B[i] - v) * t)); };
    const passes = (c, backs, min) => backs.every((b) => contrast(c, b) >= min + 0.05);
    // il colore più vicino a "from" verso "to" che resta sopra la soglia
    const mixUntil = (from, to, backs, min) => {
        let best = from;
        for (let t = 0; t <= 1.0001; t += 0.01) {
            const c = mix(from, to, t);
            if (passes(c, backs, min)) best = c; else break;
        }
        return best;
    };
    // la correzione più piccola (verso il nero o verso il bianco) che fa passare il colore
    const nudge = (c, backs, min) => {
        if (passes(c, backs, min)) return c;
        for (let t = 0.01; t <= 1.0001; t += 0.01) {
            for (const end of ["#000000", "#ffffff"]) {
                const m = mix(c, end, t);
                if (passes(m, backs, min)) return m;
            }
        }
        return [mix(c, "#000000", 1), mix(c, "#ffffff", 1)].sort((a, b) =>
            Math.min(...backs.map((x) => contrast(b, x))) - Math.min(...backs.map((x) => contrast(a, x))))[0];
    };
    const fmt = (r) => (Math.floor(r * 10) / 10).toFixed(1) + ":1";
    const level = (r, min) => (r < min ? "Fails" : min === 4.5 ? (r >= 7 ? "AAA" : "AA") : "UI");

    function derive(p) {
        const dark = lum(p.background) < 0.2;
        const base = dark ? { success: "#5cc48a", warning: "#f0b54a", error: "#ff7d70" } : { success: "#1f7a47", warning: "#9a5800", error: "#c0362c" };
        const status = {};
        // stati: 3:1 sia su Background sia su Surface (i chip dell'app stanno sulla superficie)
        Object.entries(base).forEach(([k, v]) => (status[k] = nudge(v, [p.background, p.surface], 3)));
        return {
            "muted-text": mixUntil(p.text, p.background, [p.background, p.surface], 4.5),
            border: mixUntil(p.text, p.background, [p.background], 3),
            "on-primary": [p.background, p.text, "#ffffff", "#000000"].reduce((a, b) => (contrast(b, p.primary) > contrast(a, p.primary) ? b : a)),
            ...status,
        };
    }

    function checks(p, d) {
        const worstStatus = (bg) => ["success", "warning", "error"].map((n) => [n, contrast(d[n], p[bg])]).sort((a, b) => a[1] - b[1])[0];
        const sb = worstStatus("background");
        const ss = worstStatus("surface");
        return [
            { id: "text-bg", fg: "Text", bg: "Background", fv: "text", bv: "background", r: contrast(p.text, p.background), min: 4.5 },
            { id: "text-surface", fg: "Text", bg: "Surface", fv: "text", bv: "surface", r: contrast(p.text, p.surface), min: 4.5 },
            { id: "muted-bg", fg: "Muted text", bg: "Background", fv: "muted-text", bv: "background", r: contrast(d["muted-text"], p.background), min: 4.5 },
            { id: "on-primary", fg: "On primary", bg: "Primary", fv: "on-primary", bv: "primary", r: contrast(d["on-primary"], p.primary), min: 4.5 },
            { id: "primary-bg", fg: "Primary", bg: "Background", fv: "primary", bv: "background", r: contrast(p.primary, p.background), min: 3 },
            { id: "accent-bg", fg: "Accent", bg: "Background", fv: "accent", bv: "background", r: contrast(p.accent, p.background), min: 3 },
            { id: "status-bg", fg: "Status colors", bg: "Background", fv: sb[0], bv: "background", r: sb[1], min: 3 },
            { id: "status-surface", fg: "Status colors", bg: "Surface", fv: ss[0], bv: "surface", r: ss[1], min: 3 },
        ].map((c) => ({ ...c, level: level(c.r, c.min), label: fmt(c.r) }));
    }
    // coppia più debole che contiene il ruolo (per Text: solo coppie in cui Text è il primo piano)
    const PAIRS_OF = {
        background: (c) => c.bg === "Background",
        surface: (c) => c.bg === "Surface",
        text: (c) => c.fg === "Text",
        primary: (c) => c.fg === "Primary" || c.bg === "Primary",
        accent: (c) => c.fg === "Accent",
    };
    const weakest = (role, list) => list.filter(PAIRS_OF[role]).reduce((a, b) => (b.r / b.min < a.r / a.min ? b : a));

    // giudizio in parole semplici (risponde a "cosa vuol dire 4.6:1?")
    function verdict(c) {
        if (c.level === "Fails") return { word: c.min === 4.5 ? "Hard to read" : "Hard to spot", code: "Fails" };
        if (c.level === "UI") return { word: "Easy to spot", code: "UI" };
        return { word: c.level === "AAA" ? "Very easy to read" : "Easy to read", code: c.level };
    }

    // correzione per una coppia che non passa: stessa tinta, luminosità diversa
    function suggestFix(c, p, d) {
        const vars = { ...p, ...d };
        const target = ROLES.includes(c.fv) && c.fv !== "background" ? c.fv : c.bv;
        const other = target === c.fv ? vars[c.bv] : vars[c.fv];
        const fixed = nudge(p[target], [other], c.min);
        return { role: target, hex: fixed, ratio: fmt(contrast(fixed, other)), dir: lum(fixed) < lum(p[target]) ? "darken" : "lighten" };
    }

    // ---------- stato ----------
    const q = new URLSearchParams(location.search);
    const st = q.get("state") || "";
    const S = {
        palette: st === "why-fail" ? { ...CONFLICT } : { ...PALETTES[st === "dark" ? 1 : 0] },
        index: st === "dark" ? 1 : 0,
        locks: { background: false, surface: false, text: false, primary: false, accent: false },
        history: [],
        openWhy: null,
        singleKeys: true,
    };
    if (st === "why-fail") { S.locks.background = true; S.locks.primary = true; }
    if (st === "all-locked") ROLES.forEach((r) => (S.locks[r] = true));
    try { S.singleKeys = localStorage.getItem("hue-single-keys") !== "off"; } catch (e) { /* storage non disponibile */ }

    const $ = (s, el = document) => el.querySelector(s);
    const $$ = (s, el = document) => [...el.querySelectorAll(s)];
    const live = (msg) => { const l = $("#live"); l.textContent = ""; setTimeout(() => (l.textContent = msg), 30); };

    function toast(html, kind) {
        const box = $("#toasts");
        clearTimeout(toast.t);
        if (kind === "error") {
            box.innerHTML = `<div class="toast toast--error">${html}<button class="toast__close" type="button" aria-label="Dismiss">${icon("x", 18)}</button></div>`;
            $(".toast__close", box).addEventListener("click", () => (box.innerHTML = ""));
            return; // l'errore contiene un'istruzione: resta finché non si chiude
        }
        box.innerHTML = `<div class="toast">${html}</div>`;
        if (!st.startsWith("toast") && st !== "all-locked") toast.t = setTimeout(() => (box.innerHTML = ""), 4000);
    }

    // ---------- rendering ----------
    function render() {
        const p = S.palette;
        const d = derive(p);
        const list = checks(p, d);
        const vars = { ...p, ...d };
        const root = document.documentElement.style;
        Object.entries(vars).forEach(([k, v]) => typeof v === "string" && root.setProperty("--p-" + k, v));

        $$(".band").forEach((band) => {
            const role = band.dataset.role;
            const name = NAME[role];
            const H = p[role].toUpperCase();
            const w = weakest(role, list);
            const v = verdict(w);
            band.dataset.weak = w.id;
            // etichette sempre leggibili: nero o bianco, quello con più contrasto (minimo 4,58:1)
            band.style.setProperty("--on", contrast("#ffffff", p[role]) >= contrast("#000000", p[role]) ? "#ffffff" : "#000000");
            $(".band__hex span", band).textContent = H;
            $(".band__hex", band).setAttribute("aria-label", `Copy ${name} color, ${H}`);
            $("[data-edit]", band).setAttribute("aria-label", `Edit ${name} color, ${H}`);
            const pr = $(".proof", band);
            pr.style.setProperty("--pb", vars[w.bv]);
            pr.style.setProperty("--pf", vars[w.fv]);
            pr.dataset.level = w.level;
            $(".proof__ratio", pr).textContent = w.label;
            $(".proof__verdict", pr).innerHTML = icon(w.level === "Fails" ? "x" : "check", 14) + `${v.word}<small>${v.code}</small>`;
            $(".proof__pair", pr).textContent = `${w.fg} on ${w.bg}`;
            const g = $(".band__grade", band);
            g.dataset.level = w.level;
            g.innerHTML = icon(w.level === "Fails" ? "x" : "check", 14) + `<b>${w.label}</b> ${v.word}`;
            const lock = $("[data-lock]", band);
            lock.setAttribute("aria-label", `Lock ${name}`);
            lock.setAttribute("aria-pressed", String(S.locks[role]));
            lock.innerHTML = icon(S.locks[role] ? "lock" : "unlock");
            $("[data-why]", band).setAttribute("aria-label", `Why? ${name}: ${w.fg} on ${w.bg}, ${w.label}`);
            const note = $(".band__note", band);
            const adj = p.adjusted && p.adjusted[role];
            note.innerHTML = S.locks[role] ? icon("lock", 14) + "Locked" : adj ? icon("adjust", 14) + "Adjusted for contrast" : "";
            note.hidden = !note.innerHTML;
        });

        $$("[data-check-row]").forEach((li) => {
            const c = list.find((x) => x.id === li.dataset.checkRow);
            li.dataset.level = c.level;
            $(".check__ratio", li).textContent = c.label;
            const lv = $(".lv", li);
            lv.dataset.level = c.level;
            lv.innerHTML = icon(c.level === "Fails" ? "x" : "check", 14) + c.level;
            $(".check", li).setAttribute("aria-label", `${c.fg} on ${c.bg}: ${c.label}, ${verdict(c).word}. Why?`);
        });

        // righello
        const bar = $(".ruler__bar");
        $$(".ruler__dot", bar).forEach((x) => x.remove());
        // punti vicini impilati su più file, così non si coprono
        const placed = [];
        [...list].sort((a, b) => a.r - b.r).forEach((c) => {
            const x = Math.min(Math.log(c.r) / Math.log(21), 1) * 100;
            let row = 0;
            while (placed.some((pp) => pp.row === row && Math.abs(pp.x - x) < 2.6)) row++;
            placed.push({ x, row });
            const dot = document.createElement("span");
            dot.className = "ruler__dot";
            dot.dataset.level = c.level;
            dot.style.left = x.toFixed(2) + "%";
            dot.style.top = 28 - row * 14 + "px";
            dot.style.setProperty("--db", vars[c.bv]);
            dot.style.setProperty("--df", vars[c.fv]);
            dot.title = `${c.fg} on ${c.bg}: ${c.label}`;
            bar.appendChild(dot);
        });
        const fails = list.filter((c) => c.level === "Fails").length;
        const sum = $(".ruler__sum");
        sum.dataset.level = fails ? "Fails" : "ok";
        sum.innerHTML = fails ? icon("x", 16) + `${fails} of ${list.length} pairs fail` : icon("check", 16) + `All ${list.length} pairs pass`;

        $$("[data-undo]").forEach((b) => {
            const off = !S.history.length;
            b.setAttribute("aria-disabled", String(off));
            if (off) b.setAttribute("aria-describedby", b.querySelector(".tip").id); else b.removeAttribute("aria-describedby");
        });
        renderWhy(list, p, d);
    }

    function whyContent(c, p, d, role) {
        const adj = role && p.adjusted && p.adjusted[role];
        if (adj && c.level !== "Fails" && st !== "why-pass") {
            const dir = lum(adj.to) < lum(adj.from) ? "darkened" : "lightened";
            const reach = role === "primary" && c.id === "on-primary"
                ? `${d["on-primary"] === "#ffffff" ? "White text" : "Text"} on your buttons now reaches ${c.label}.`
                : `${c.fg} on ${c.bg} now reaches ${c.label}.`;
            return { cls: "", title: `${NAME[role]} was adjusted`, ratio: "",
                body: `<p>We ${dir} it a little, from ${adj.from.toUpperCase()} to ${adj.to.toUpperCase()}. ${reach} The hue is the same; only the lightness changed.</p>` +
                    `<div class="whypanel__pair"><span class="whypanel__sw" style="background:${adj.from}"></span><span class="num">${adj.from.toUpperCase()}</span><span>to</span><span class="whypanel__sw" style="background:${adj.to}"></span><span class="num">${adj.to.toUpperCase()}</span></div>`, fix: "" };
        }
        if (c.level === "Fails") {
            const fx = suggestFix(c, p, d);
            const named = (n) => (ROLE_OF[n] && S.locks[ROLE_OF[n]] ? "your locked " + n : n);
            const need = c.min === 4.5 ? "Text needs 4.5:1." : "Buttons and other controls need 3:1.";
            const first = named(c.bg);
            return { cls: " whypanel--fail", title: `${c.fg} on ${c.bg}`, ratio: c.label,
                body: `<p>${first.charAt(0).toUpperCase() + first.slice(1)} and ${named(c.fg)} are too close: ${c.label}. ${need}</p>`,
                fix: `<div class="whypanel__fix"><span><b>Fix:</b> ${fx.dir} ${NAME[fx.role]} to <b class="num">${fx.hex.toUpperCase()}</b> (${fx.ratio}).</span><button class="btn btn--danger" type="button" data-apply="${fx.role}" data-hex="${fx.hex}">Apply fix</button></div>` };
        }
        if (c.min === 3) return { cls: "", title: `${c.fg} on ${c.bg}`, ratio: c.label, body: "<p>Buttons and other controls need 3:1 against what surrounds them, so people can find them. This one passes.</p>", fix: "" };
        if (c.level === "AAA") return { cls: "", title: `${c.fg} on ${c.bg}`, ratio: c.label, body: "<p>Body text needs at least 4.5:1 to pass WCAG AA, and 7:1 for AAA. This pair passes both, so it stays readable on bright screens and for people with low vision.</p>", fix: "" };
        return { cls: "", title: `${c.fg} on ${c.bg}`, ratio: c.label, body: "<p>Body text needs at least 4.5:1 to pass WCAG AA. This pair passes AA. It would need 7:1 for AAA.</p>", fix: "" };
    }

    function renderWhy(list, p, d) {
        $$(".whypanel").forEach((el) => el.remove());
        $$(".band.is-open").forEach((b) => b.classList.remove("is-open"));
        $$("[data-why], .check").forEach((b) => b.setAttribute("aria-expanded", "false"));
        if (!S.openWhy) return;
        const btn = $(`[data-why="${S.openWhy}"]`) || $(`[data-check-row="${S.openWhy}"] .check`);
        if (!btn) return;
        btn.setAttribute("aria-expanded", "true");
        const band = btn.closest(".band");
        const c = band ? list.find((x) => x.id === band.dataset.weak) : list.find((x) => x.id === S.openWhy);
        const t = whyContent(c, p, d, band && band.dataset.role);
        const panel = document.createElement("div");
        panel.className = "whypanel" + t.cls;
        panel.id = "whypanel";
        panel.setAttribute("role", "region");
        panel.setAttribute("aria-label", "Why? " + t.title);
        panel.innerHTML = `<p class="whypanel__title"><span>${t.title}</span><span class="num">${t.ratio}</span></p>${t.body}${t.fix}`;
        btn.setAttribute("aria-controls", "whypanel");
        if (band) {
            band.classList.add("is-open");
            if (ROLES.indexOf(band.dataset.role) >= 3) panel.classList.add("whypanel--up");
            band.appendChild(panel);
        } else {
            const li = btn.closest("li");
            if ([...li.parentNode.children].indexOf(li) % 2) panel.classList.add("whypanel--right");
            li.appendChild(panel);
        }
        const apply = $("[data-apply]", panel);
        if (apply) apply.addEventListener("click", () => {
            const role = apply.dataset.apply;
            push();
            S.palette = { ...S.palette, [role]: apply.dataset.hex, adjusted: {} };
            S.openWhy = null;
            render();
            toast(icon("check", 18) + `<span>Fix applied. ${NAME[role]} is now ${apply.dataset.hex.toUpperCase()}.</span>`);
            $(`.band[data-role="${role}"] [data-edit]`).focus();
        });
    }

    function push() { S.history.push({ ...S.palette }); if (S.history.length > 20) S.history.shift(); }

    // come il generatore vero (04 § 5, passo 7): i colori non bloccati si adattano ai bloccati.
    // Si cambia solo la luminosità del colore libero della coppia; resta Fails solo tra due colori bloccati.
    function adapt(p) {
        const adjusted = { ...(p.adjusted || {}) };
        for (let round = 0; round < 4; round++) {
            const d = derive(p);
            const vars = { ...p, ...d };
            const bad = checks(p, d).filter((c) => c.level === "Fails");
            if (!bad.length) break;
            bad.forEach((c) => {
                const free = [c.fv, c.bv].filter((r) => ROLES.includes(r) && !S.locks[r]);
                if (!free.length) return;
                const role = free.includes(c.fv) ? c.fv : free[0];
                const other = role === c.fv ? vars[c.bv] : vars[c.fv];
                const from = p[role];
                p[role] = nudge(p[role], [other], c.min);
                if (p[role] !== from) adjusted[role] = { from: adjusted[role] ? adjusted[role].from : from, to: p[role] };
            });
        }
        p.adjusted = adjusted;
        return p;
    }

    function generate() {
        if (ROLES.every((r) => S.locks[r])) { toast(icon("lock", 18) + "<span>All colors are locked. Unlock one to generate.</span>"); return; }
        push();
        S.index = (S.index + 1) % PALETTES.length;
        const next = PALETTES[S.index];
        const p = { adjusted: { ...next.adjusted } };
        ROLES.forEach((r) => (p[r] = S.locks[r] ? S.palette[r] : next[r]));
        ROLES.forEach((r) => S.locks[r] && delete p.adjusted[r]);
        S.palette = adapt(p);
        S.openWhy = null;
        render();
        live("New palette generated.");
    }
    function undo() {
        if (!S.history.length) return;
        S.palette = S.history.pop();
        S.openWhy = null;
        render();
        live("Previous palette restored.");
    }
    function toggleLock(role) {
        S.locks[role] = !S.locks[role];
        render();
        live(`${NAME[role]} ${S.locks[role] ? "locked" : "unlocked"}.`);
    }

    function parseHex(v) {
        v = v.trim().replace(/^#/, "");
        if (/^[0-9a-f]{3}$/i.test(v)) v = v.split("").map((c) => c + c).join("");
        return /^[0-9a-f]{6}$/i.test(v) ? "#" + v.toLowerCase() : null;
    }

    function openEditor(band, value, invalid) {
        const role = band.dataset.role;
        const who = $(".band__who", band);
        if ($(".hexedit", band)) return;
        who.hidden = true;
        const ed = document.createElement("div");
        ed.className = "hexedit";
        ed.innerHTML = `<label class="hexedit__label" for="hx-${role}">${NAME[role]} color, hex code</label><input id="hx-${role}" value="${value || S.palette[role].toUpperCase()}" spellcheck="false" autocomplete="off" aria-describedby="hxm-${role}"><span class="hexedit__msg" id="hxm-${role}">Enter to apply, Esc to cancel</span>`;
        band.insertBefore(ed, who);
        const input = $("input", ed);
        const msg = $(".hexedit__msg", ed);
        let done = false;
        const close = (focusEdit) => {
            done = true;
            band.style.removeProperty("--c");
            ed.remove();
            who.hidden = false;
            render();
            if (focusEdit) $("[data-edit]", band).focus();
        };
        const apply = () => {
            const h = parseHex(input.value);
            if (!h) return false;
            push();
            S.locks[role] = true;
            S.palette = adapt({ ...S.palette, [role]: h, adjusted: {} });
            close(true);
            live(`${NAME[role]} set to ${h.toUpperCase()} and locked.`);
            return true;
        };
        const showError = () => {
            input.setAttribute("aria-invalid", "true");
            msg.className = "hexedit__msg hexedit__msg--error";
            msg.setAttribute("role", "alert");
            msg.innerHTML = icon("x", 15) + "Use a hex code like #3E5BD0.";
        };
        input.addEventListener("input", () => {
            const h = parseHex(input.value);
            input.removeAttribute("aria-invalid");
            msg.className = "hexedit__msg";
            msg.removeAttribute("role");
            msg.textContent = "Enter to apply, Esc to cancel";
            if (h) band.style.setProperty("--c", h); else band.style.removeProperty("--c");
        });
        input.addEventListener("keydown", (e) => {
            if (e.key === "Escape") { e.stopPropagation(); close(true); }
            if (e.key === "Enter" && !apply()) showError();
        });
        // clic fuori: un codice valido si applica, uno non valido non si salva mai (04 § 4)
        input.addEventListener("blur", () => { if (!done && !st.startsWith("edit")) { if (!apply()) close(false); } });
        input.focus();
        if (invalid) { input.value = value; input.setSelectionRange(value.length, value.length); showError(); } else input.select();
    }

    async function copy(role) {
        const text = S.palette[role].toUpperCase();
        try {
            if (st === "toast-error") throw new Error("blocked");
            await navigator.clipboard.writeText(text);
            toast(`<span class="toast__swatch" style="background:${text}"></span><span>Copied ${text}</span>`);
        } catch (e) {
            // seleziona il codice, così si copia a mano con Ctrl+C
            const span = $(`.band[data-role="${role}"] .band__hex span`);
            const range = document.createRange();
            range.selectNodeContents(span);
            const sel = getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            toast(icon("alert", 18) + "<span>Couldn't copy. Select the code and press Ctrl+C.</span>", "error");
        }
    }

    // anteprima che entra nello spazio disponibile (desktop, niente scroll)
    function fitPreview() {
        const stage = $(".stage");
        $$(".fit", stage).forEach((fit) => {
            const inner = fit.firstElementChild;
            if (fit.closest("[hidden]")) return;
            inner.style.transform = "none";
            const natW = Number(fit.dataset.w);
            inner.style.width = natW + "px";
            const natH = inner.offsetHeight;
            const pad = 24; // padding del pannello (2 × --s3)
            const avW = stage.clientWidth - pad;
            const avH = matchMedia("(max-width: 760px)").matches ? Infinity : stage.clientHeight - pad;
            const s = Math.min(1, avW / natW, avH / natH);
            inner.style.transform = `scale(${s})`;
            fit.style.width = natW * s + "px";
            fit.style.height = natH * s + "px";
        });
    }

    // ---------- eventi ----------
    function init() {
        // righello: zone e tacche calcolate sulla stessa scala logaritmica dei punti
        const x = (r) => (Math.log(r) / Math.log(21)) * 100;
        const track = $(".ruler__track");
        [["fail", 1, 3], ["ui", 3, 4.5], ["aa", 4.5, 7], ["aaa", 7, 21]].forEach(([k, a, b]) => {
            const z = document.createElement("span");
            z.className = "ruler__zone ruler__zone--" + k;
            z.style.width = (x(b) - x(a)).toFixed(2) + "%";
            track.appendChild(z);
        });
        $$(".ruler__tick").forEach((t) => (t.style.left = x(Number(t.dataset.r)).toFixed(2) + "%"));

        $$(".band").forEach((band) => {
            const role = band.dataset.role;
            $(".band__hex", band).addEventListener("click", () => copy(role));
            $("[data-edit]", band).addEventListener("click", () => openEditor(band));
            $("[data-lock]", band).addEventListener("click", () => toggleLock(role));
        });
        document.addEventListener("click", (e) => {
            const w = e.target.closest("[data-why]");
            const row = e.target.closest(".check");
            if (w || row) {
                const id = w ? w.dataset.why : row.closest("li").dataset.checkRow;
                S.openWhy = S.openWhy === id ? null : id;
                render();
                return;
            }
            if (S.openWhy && !e.target.closest(".whypanel")) { S.openWhy = null; render(); }
        });
        $$("[data-generate]").forEach((b) => b.addEventListener("click", generate));
        $$("[data-undo]").forEach((b) => b.addEventListener("click", () => {
            if (b.getAttribute("aria-disabled") === "true") return;
            undo();
        }));
        $$("[data-share]").forEach((b) => b.addEventListener("click", () => toast(icon("link", 18) + "<span>Link copied. Anyone with it sees this palette.</span>")));
        const dlg = $("#shortcuts");
        const sw = $("#single-keys");
        sw.checked = S.singleKeys;
        sw.addEventListener("change", () => {
            S.singleKeys = sw.checked;
            try { localStorage.setItem("hue-single-keys", sw.checked ? "on" : "off"); } catch (e) { /* storage non disponibile */ }
            $$(".hint--space").forEach((h) => (h.hidden = !sw.checked));
        });
        $$(".hint--space").forEach((h) => (h.hidden = !S.singleKeys));
        $$("[data-shortcuts]").forEach((b) => b.addEventListener("click", () => dlg.showModal()));

        document.addEventListener("keydown", (e) => {
            const t = e.target;
            if (e.key === "Escape" && S.openWhy) {
                const id = S.openWhy;
                S.openWhy = null;
                render();
                ($(`[data-why="${id}"]`) || $(`[data-check-row="${id}"] .check`)).focus();
                return;
            }
            if (t.closest("input, textarea") || dlg.open) return;
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") { e.preventDefault(); undo(); return; }
            if (e.ctrlKey || e.metaKey || e.altKey || !S.singleKeys) return;
            if (e.code === "Space" && !t.closest("button, a, [role=tab]")) { e.preventDefault(); generate(); }
            if (e.key === "?") dlg.showModal();
            const band = t.closest(".band");
            if (band && e.key.toLowerCase() === "l") toggleLock(band.dataset.role);
            if (band && e.key.toLowerCase() === "c") copy(band.dataset.role);
        });

        // tablist con frecce, Home e End
        const tabs = $$("[role=tab]");
        const select = (tab) => {
            tabs.forEach((x) => {
                const on = x === tab;
                x.setAttribute("aria-selected", String(on));
                x.tabIndex = on ? 0 : -1;
                $("#" + x.getAttribute("aria-controls")).hidden = !on;
            });
            fitPreview();
        };
        tabs.forEach((x, i) => {
            x.addEventListener("click", () => select(x));
            x.addEventListener("keydown", (e) => {
                const keys = { ArrowRight: (i + 1) % tabs.length, ArrowLeft: (i + tabs.length - 1) % tabs.length, Home: 0, End: tabs.length - 1 };
                if (!(e.key in keys)) return;
                e.preventDefault();
                select(tabs[keys[e.key]]);
                tabs[keys[e.key]].focus();
            });
        });
        if (q.get("view") === "mobile") select(tabs[1]);

        render();
        fitPreview();
        new ResizeObserver(fitPreview).observe($(".stage"));
        if (document.fonts) document.fonts.ready.then(fitPreview);

        // stati forzati per le schermate
        const bandOf = (r) => $(`.band[data-role="${r}"]`);
        if (st === "edit-error") openEditor(bandOf("primary"), "#3e5bd", true);
        if (st === "why-pass") { S.openWhy = "background"; render(); }
        if (st === "why-aa") { S.openWhy = "muted-bg"; render(); }
        if (st === "why-adjusted") { S.openWhy = "primary"; render(); }
        if (st === "why-fail") { S.openWhy = "primary"; render(); }
        if (st === "shortcuts") dlg.showModal();
        if (st === "toast-copied") toast(`<span class="toast__swatch" style="background:${S.palette.primary}"></span><span>Copied ${S.palette.primary.toUpperCase()}</span>`);
        if (st === "toast-error") copy("primary");
        if (st === "all-locked") generate();
        if (st === "undo-tip") $$("[data-undo]").forEach((b) => b.classList.add("show-tip"));
    }
    document.addEventListener("DOMContentLoaded", init);
})();
