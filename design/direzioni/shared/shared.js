/*
 * Codice condiviso dalle anteprime delle direzioni di design.
 * Non è il generatore vero: alterna 3 palette d'esempio e calcola contrasti e ruoli ricavati
 * con la formula WCAG 2.1, così i numeri mostrati sono sempre reali.
 */
(function () {
    const SAMPLES = [
        { background: "#f2f4f3", surface: "#ffffff", text: "#1b2421", primary: "#2c6a58", accent: "#b0532c" },
        { background: "#14161b", surface: "#1e222a", text: "#eceef1", primary: "#93b6ff", accent: "#f0b467" },
        { background: "#faf6f3", surface: "#f0e9e3", text: "#2a2320", primary: "#6f3a92", accent: "#b8215a" },
    ];
    const ROLES = ["background", "surface", "text", "primary", "accent"];
    const ROLE_NAMES = { background: "Background", surface: "Surface", text: "Text", primary: "Primary", accent: "Accent" };

    const hexToRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
    const rgbToHex = (c) => "#" + c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
    const lin = (v) => {
        v /= 255;
        return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    const lum = (h) => {
        const [r, g, b] = hexToRgb(h).map(lin);
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const contrast = (a, b) => {
        const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
        return (x + 0.05) / (y + 0.05);
    };
    const mix = (a, b, t) => {
        const A = hexToRgb(a), B = hexToRgb(b);
        return rgbToHex(A.map((v, i) => v + (B[i] - v) * t));
    };
    // il punto più vicino a "to" che resta sopra la soglia contro tutti gli sfondi indicati
    const mixUntil = (from, to, against, min) => {
        let best = from;
        for (let t = 0; t <= 1.0001; t += 0.01) {
            const c = mix(from, to, t);
            if (against.every((bg) => contrast(c, bg) >= min + 0.05)) best = c;
            else break;
        }
        return best;
    };

    function derive(p) {
        const dark = lum(p.background) < 0.2;
        const muted = mixUntil(p.text, p.background, [p.background, p.surface], 4.5);
        const border = mixUntil(p.text, p.background, [p.background], 3);
        const onPrimary = [p.background, p.text, "#ffffff", "#111111"].reduce((a, b) =>
            contrast(b, p.primary) > contrast(a, p.primary) ? b : a
        );
        const states = dark
            ? { success: "#5cc48a", warning: "#f0b54a", error: "#ff7d70" }
            : { success: "#1f7a47", warning: "#9a5800", error: "#c0362c" };
        return { mutedText: muted, border, onPrimary, ...states, dark };
    }

    const level = (r, min) => (min === 4.5 && r >= 7 ? "AAA" : r >= min ? "AA" : "Fails");
    const fmt = (r) => (Math.floor(r * 10) / 10).toFixed(1) + ":1";

    function checks(p, d) {
        return [
            { id: "text-bg", fg: "Text", bg: "Background", r: contrast(p.text, p.background), min: 4.5 },
            { id: "text-surface", fg: "Text", bg: "Surface", r: contrast(p.text, p.surface), min: 4.5 },
            { id: "muted-bg", fg: "Muted text", bg: "Background", r: contrast(d.mutedText, p.background), min: 4.5 },
            { id: "on-primary", fg: "On primary", bg: "Primary", r: contrast(d.onPrimary, p.primary), min: 4.5 },
            { id: "primary-bg", fg: "Primary", bg: "Background", r: contrast(p.primary, p.background), min: 3 },
            { id: "accent-bg", fg: "Accent", bg: "Background", r: contrast(p.accent, p.background), min: 3 },
            (() => {
                const s = [["success", d.success], ["warning", d.warning], ["error", d.error]]
                    .map(([n, c]) => [n, contrast(c, p.background)])
                    .sort((a, b) => a[1] - b[1])[0];
                return { id: "status-bg", fg: "Status colors", bg: "Background", min: 3, r: s[1], fgVar: "--p-" + s[0] };
            })(),
        ].map((c) => ({ ...c, level: level(c.r, c.min), label: fmt(c.r) }));
    }

    const VAR = {
        Background: "--p-background", Surface: "--p-surface", Text: "--p-text", Primary: "--p-primary",
        Accent: "--p-accent", "Muted text": "--p-muted-text", "On primary": "--p-on-primary", "Status colors": "--p-warning",
    };
    function proof(el, w) {
        el.style.setProperty("--pf", `var(${w.fgVar || VAR[w.fg]})`);
        el.style.setProperty("--pb", `var(${VAR[w.bg]})`);
        el.dataset.level = w.level;
        el.innerHTML =
            `<span class="aa" aria-hidden="true">Aa</span><span class="r">${w.label}</span>` +
            `<span class="pf-meta"><span class="pf-lv">${w.level === "Fails" ? icon("x") : icon("check")}${w.level}${w.min === 3 ? " (UI)" : ""}</span><span class="pf-pair">${w.fg} on ${w.bg}</span></span>`;
    }

    // coppia più debole per ogni ruolo (regola di 02 - Struttura e testi § 2)
    function weakest(role, list) {
        const name = ROLE_NAMES[role];
        const mine = list.filter((c) => c.fg === name || c.bg === name || (role === "text" && c.fg === "Muted text"));
        return mine.reduce((a, b) => (b.r / b.min < a.r / a.min ? b : a));
    }

    const ICONS = {
        lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
        unlock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.8-1.3"/>',
        copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
        undo: '<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-15-6.7L3 13"/>',
        link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
        check: '<path d="M20 6 9 17l-5-5"/>',
        x: '<path d="M18 6 6 18M6 6l12 12"/>',
        keyboard: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>',
        refresh: '<path d="M21 12a9 9 0 1 1-2.6-6.4L21 8"/><path d="M21 3v5h-5"/>',
        help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 4.9.8c0 1.7-2.4 2.2-2.4 3.7"/><path d="M12 17h.01"/>',
        plus: '<path d="M12 5v14M5 12h14"/>',
        home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
        calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
        user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
        alert: '<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>',
        circle: '<circle cx="12" cy="12" r="9"/>',
    };
    const icon = (name) =>
        `<svg class="i" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;

    const LANDING = `
<div class="mk-landing">
    <nav class="mk-nav"><strong class="mk-logo">Plotline</strong><span class="mk-links"><span>Product</span><span>Pricing</span><span>Log in</span></span><span class="mk-btn mk-btn-sm">Start free</span></nav>
    <section class="mk-hero">
        <span class="mk-badge">New: shared weeks</span>
        <h3>Plan your week in ten minutes.</h3>
        <p>Plotline turns a messy list into a week you can actually finish. Drag tasks into days, and it warns you before a day gets too full.</p>
        <div class="mk-cta"><span class="mk-btn">Start free</span><span class="mk-link">See how it works</span></div>
    </section>
    <section class="mk-cards">
        <div class="mk-card"><b>Sunday review</b><p>Ten guided minutes to close last week and set up the next.</p></div>
        <div class="mk-card"><b>Day limits</b><p>Set how many hours a day can hold. Plotline does the math.</p></div>
        <div class="mk-card"><b>Shared weeks</b><p>Plan with a partner or a team without another group chat.</p></div>
    </section>
    <section class="mk-quote"><p>“I stopped carrying Friday’s tasks into Monday.”</p><span>Sample quote from a fictional customer</span></section>
</div>`;
    const MOBILE = `
<div class="mk-phone"><div class="mk-app">
    <header class="mk-app-head"><span>Mon 16 – Sun 22</span><h3>This week</h3></header>
    <label class="mk-field"><span class="mk-plus">${icon("plus")}</span><span>Add a task</span></label>
    <ul class="mk-tasks">
        <li><span class="mk-dot ok">${icon("check")}</span><span>Send invoice to Studio Arco</span><em class="mk-chip ok">Done</em></li>
        <li><span class="mk-dot warn">${icon("circle")}</span><span>Draft Thursday workshop</span><em class="mk-chip warn">Due today</em></li>
        <li><span class="mk-dot err">${icon("alert")}</span><span>Renew domain</span><em class="mk-chip err">Overdue</em></li>
        <li><span class="mk-dot">${icon("circle")}</span><span>Call the plumber</span><em class="mk-chip">Fri</em></li>
    </ul>
    <span class="mk-fab">${icon("plus")}</span>
    <nav class="mk-tab"><span class="on">${icon("home")}Week</span><span>${icon("calendar")}Month</span><span>${icon("user")}Me</span></nav>
</div></div>`;

    let current = 0;
    const locks = {};

    function apply(index) {
        const p = SAMPLES[index];
        const d = derive(p);
        const list = checks(p, d);
        const root = document.documentElement;
        const vars = { ...p, ...d };
        Object.entries(vars).forEach(([k, v]) => {
            if (typeof v === "string") root.style.setProperty("--p-" + k.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase()), v);
        });
        document.querySelectorAll("[data-hex]").forEach((el) => (el.textContent = p[el.dataset.hex].toUpperCase()));
        document.querySelectorAll("[data-weak]").forEach((el) => {
            const w = weakest(el.dataset.weak, list);
            el.dataset.level = w.level;
            el.innerHTML =
                (w.level === "Fails" ? icon("x") : icon("check")) +
                `<span>${w.level} ${w.label}</span><span class="grade-of">${w.fg} on ${w.bg}</span>`;
        });
        document.querySelectorAll("[data-proof]").forEach((el) => proof(el, weakest(el.dataset.proof, list)));
        document.querySelectorAll("[data-check]").forEach((el) => {
            const c = list.find((x) => x.id === el.dataset.check);
            el.textContent = c.label;
        });
        document.querySelectorAll("[data-check-level]").forEach((el) => {
            const c = list.find((x) => x.id === el.dataset.checkLevel);
            el.dataset.level = c.level;
            el.innerHTML = (c.level === "Fails" ? icon("x") : icon("check")) + `<span>${c.level}${c.min === 3 ? " (UI)" : ""}</span>`;
        });
        document.querySelectorAll("[data-ratio]").forEach((el) => {
            const c = list.find((x) => x.id === el.dataset.ratio);
            el.textContent = c.label;
        });
        document.body.dataset.mode = d.dark ? "dark" : "light";
        const live = document.getElementById("live");
        if (live && document.readyState === "complete") live.textContent = "New palette generated.";
    }

    function init() {
        document.querySelectorAll("[data-icon]").forEach((el) => (el.innerHTML = icon(el.dataset.icon)));
        document.querySelectorAll('[data-mockup="landing"]').forEach((el) => (el.innerHTML = LANDING));
        document.querySelectorAll('[data-mockup="mobile"]').forEach((el) => (el.innerHTML = MOBILE));
        const start = Number(new URLSearchParams(location.search).get("p") || 0);
        current = start % SAMPLES.length;
        apply(current);
        const next = () => apply((current = (current + 1) % SAMPLES.length));
        document.querySelectorAll("[data-generate]").forEach((b) => b.addEventListener("click", next));
        document.addEventListener("keydown", (e) => {
            const t = e.target;
            if (e.code === "Space" && !t.closest("button, a, input, [role=tab]")) {
                e.preventDefault();
                next();
            }
        });
        document.querySelectorAll("[data-lock]").forEach((b) =>
            b.addEventListener("click", () => {
                const on = b.getAttribute("aria-pressed") !== "true";
                b.setAttribute("aria-pressed", on);
                b.innerHTML = icon(on ? "lock" : "unlock");
                locks[b.dataset.lock] = on;
            })
        );
        document.querySelectorAll("[role=tablist]").forEach((list) => {
            const tabs = [...list.querySelectorAll("[role=tab]")];
            const select = (tab) => {
                tabs.forEach((t) => {
                    const on = t === tab;
                    t.setAttribute("aria-selected", on);
                    t.tabIndex = on ? 0 : -1;
                    document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
                });
            };
            tabs.forEach((t, i) => {
                t.addEventListener("click", () => select(t));
                t.addEventListener("keydown", (e) => {
                    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                        const n = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
                        select(n);
                        n.focus();
                    }
                });
            });
            const want = new URLSearchParams(location.search).get("view");
            if (want) {
                const t = tabs.find((x) => x.dataset.view === want);
                if (t) select(t);
            }
        });
    }

    window.HueShared = { contrast, derive, checks, icon };
    document.addEventListener("DOMContentLoaded", init);
})();
