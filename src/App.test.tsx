import { render, screen } from "@testing-library/react";
import { App } from "./App";

describe("App", () => {
    it("mostra il nome del prodotto", () => {
        render(<App />);
        expect(screen.getByRole("heading", { level: 1, name: "Hue UI" })).toBeInTheDocument();
    });
});
