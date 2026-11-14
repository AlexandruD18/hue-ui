import { Icon } from "../components/Icon";

// Mockup "Plotline": dati d'esempio inventati (design/README.md). Restano in inglese in ogni lingua:
// rappresentano il sito di qualcun altro. Usano solo le variabili --p-* dei ruoli (mockups.css).

export function LandingMockup() {
    return (
        <div className="mk-landing">
            <div className="mk-nav">
                <strong className="mk-logo">Plotline</strong>
                <span className="mk-links">
                    <span>Product</span>
                    <span>Pricing</span>
                    <span>Log in</span>
                </span>
                <span className="mk-btn mk-btn-sm">Start free</span>
            </div>
            <div className="mk-hero">
                <span className="mk-badge">New: shared weeks</span>
                <p className="mk-h">Plan your week in ten minutes.</p>
                <p>
                    Plotline turns a messy list into a week you can actually finish. Drag tasks into days, and
                    it warns you before a day gets too full.
                </p>
                <div className="mk-cta">
                    <span className="mk-btn">Start free</span>
                    <span className="mk-link">See how it works</span>
                </div>
            </div>
            <div className="mk-cards">
                <div className="mk-card">
                    <b>Sunday review</b>
                    <p>Ten guided minutes to close last week and set up the next.</p>
                </div>
                <div className="mk-card">
                    <b>Day limits</b>
                    <p>Set how many hours a day can hold. Plotline does the math.</p>
                </div>
                <div className="mk-card">
                    <b>Shared weeks</b>
                    <p>Plan with a partner or a team without another group chat.</p>
                </div>
            </div>
            <div className="mk-quote">
                <p>“I stopped carrying Friday’s tasks into Monday.”</p>
                <span>Sample quote from a fictional customer</span>
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
