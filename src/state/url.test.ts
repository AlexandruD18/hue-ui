import { decodePalette, encodePalette, readPalette } from "./url";
import { initialState } from "./reducer";

describe("URL della palette (T15)", () => {
    it("andata e ritorno", () => {
        const p = initialState(1).palette;
        expect(decodePalette(encodePalette(p))).toEqual(p);
    });

    it("valido, con 4 codici, con un codice rotto", () => {
        expect(readPalette("?p=f7f4ee-ece6dc-1c1b1a-3e5bd0-c2410c").status).toBe("ok");
        expect(readPalette("?p=f7f4ee-ece6dc-1c1b1a-3e5bd0").status).toBe("invalid");
        expect(readPalette("?p=f7f4ee-ece6dc-1c1b1a-3e5bd0-zz410c").status).toBe("invalid");
        expect(readPalette("?p=<script>").status).toBe("invalid");
        expect(readPalette("").status).toBe("none");
    });

    it("accetta le maiuscole", () => {
        expect(decodePalette("F7F4EE-ECE6DC-1C1B1A-3E5BD0-C2410C")?.background).toBe("#f7f4ee");
    });
});
