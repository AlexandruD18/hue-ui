import { Icon } from "../components/Icon";

// Mockup "Plotline": dati d'esempio inventati (design/README.md). Restano in inglese in ogni lingua:
// rappresentano il sito di qualcun altro. Usano solo le variabili --p-* dei ruoli (mockups.css).

type Tone = "" | "primary" | "accent" | "ok" | "warn" | "err" | "fill";

const WEEK: {
    day: string;
    date: number;
    today?: boolean;
    tasks: [string, Tone][];
    more?: number;
    hours: number;
}[] = [
    {
        day: "Mon",
        date: 16,
        tasks: [
            ["Sunday review", "fill"],
            ["Invoice Arco", "ok"],
        ],
        hours: 4,
    },
    {
        day: "Tue",
        date: 17,
        today: true,
        tasks: [
            ["Design crit", "primary"],
            ["Call plumber", "accent"],
        ],
        hours: 6,
    },
    { day: "Wed", date: 18, tasks: [["Workshop draft", "warn"]], hours: 3 },
    {
        day: "Thu",
        date: 19,
        tasks: [
            ["Sprint plan", "primary"],
            ["Renew domain", "err"],
        ],
        more: 1,
        hours: 9,
    },
    { day: "Fri", date: 20, tasks: [["Ship 1.2", "accent"]], hours: 2 },
];
const DAY_HOURS = 8;

/** Landing di un prodotto inventato in una finestra del browser: titolo a sinistra, la settimana dell'app a destra. */
export function LandingMockup() {
    return (
        <div className="mk-landing">
            <div className="mk-chrome">
                <span className="mk-dots">
                    <i />
                    <i />
                    <i />
                </span>
                <span className="mk-url">plotline.app</span>
            </div>
            <div className="mk-nav">
                <strong className="mk-logo">
                    <i />
                    Plotline
                </strong>
                <span className="mk-links">
                    <span>Product</span>
                    <span>Pricing</span>
                    <span>Log in</span>
                </span>
                <span className="mk-btn mk-btn-sm">Start free</span>
            </div>
            <div className="mk-hero">
                <div className="mk-copy">
                    <span className="mk-eyebrow">New · Shared weeks</span>
                    <p className="mk-h">Plan your week in ten minutes.</p>
                    <p className="mk-lead">
                        Drag tasks into days. Plotline warns you before a day gets too full.
                    </p>
                    <div className="mk-cta">
                        <span className="mk-btn">Start free</span>
                        <span className="mk-link">See how it works</span>
                    </div>
                    <div className="mk-proof">
                        <span className="mk-faces">
                            <i />
                            <i />
                            <i />
                            <i />
                        </span>
                        2,400 teams plan on Plotline
                    </div>
                </div>
                <div className="mk-week">
                    <div className="mk-week-head">
                        <b>This week</b>
                        <span>31 of 38 hours planned</span>
                    </div>
                    {WEEK.map((d) => (
                        <div key={d.day} className={"mk-day" + (d.today ? " today" : "")}>
                            <span className="mk-date">
                                {d.day}
                                <b>{d.date}</b>
                            </span>
                            <span className="mk-pills">
                                {d.tasks.map(([label, tone]) => (
                                    <span key={label} className={`mk-pill ${tone}`}>
                                        <i />
                                        {label}
                                    </span>
                                ))}
                                {d.more && <span className="mk-more">+{d.more}</span>}
                            </span>
                            <span className={"mk-hours" + (d.hours > DAY_HOURS ? " over" : "")}>
                                <span className="mk-bar">
                                    <i style={{ width: `${Math.min(100, (d.hours / DAY_HOURS) * 100)}%` }} />
                                </span>
                                {d.hours} of {DAY_HOURS} h
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const TASKS = [
    { label: "Send invoice to Studio Arco", chip: "Done", kind: "ok", icon: "check" },
    { label: "Draft Thursday workshop", chip: "Due today", kind: "warn", icon: "circle" },
    { label: "Renew domain", chip: "Overdue", kind: "err", icon: "alert" },
    { label: "Call the plumber", chip: "Fri", kind: "", icon: "circle" },
] as const;

export function MobileAppMockup() {
    return (
        <div className="mk-phone">
            <div className="mk-app">
                <div className="mk-app-head">
                    <span>Mon 16 – Sun 22</span>
                    <p className="mk-h">This week</p>
                </div>
                <div className="mk-field">
                    <span className="mk-plus">
                        <Icon name="plus" size={16} />
                    </span>
                    <span>Add a task</span>
                </div>
                <ul className="mk-tasks">
                    {TASKS.map((task) => (
                        <li key={task.label}>
                            <span className={`mk-dot ${task.kind}`}>
                                <Icon name={task.icon} size={18} />
                            </span>
                            <span>{task.label}</span>
                            <em className={`mk-chip ${task.kind}`}>{task.chip}</em>
                        </li>
                    ))}
                </ul>
                <span className="mk-fab">
                    <Icon name="plus" />
                </span>
                <div className="mk-tab">
                    <span className="on">
                        <Icon name="home" />
                        Week
                    </span>
                    <span>
                        <Icon name="calendar" />
                        Month
                    </span>
                    <span>
                        <Icon name="user" />
                        Me
                    </span>
                </div>
            </div>
        </div>
    );
}
