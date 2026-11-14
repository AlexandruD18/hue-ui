import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/bricolage-grotesque/opsz.css";
import "./styles/hue.css";
import "./styles/mockups.css";
import "./styles/app.css";
import { App } from "./App";
import { ToastProvider } from "./components/Toasts";
import { I18nProvider } from "./i18n";

const root = document.getElementById("root");
if (root) {
    createRoot(root).render(
        <StrictMode>
            <I18nProvider>
                <ToastProvider>
                    <App />
                </ToastProvider>
            </I18nProvider>
        </StrictMode>,
    );
}
