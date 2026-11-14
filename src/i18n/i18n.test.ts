import { en } from "./en";
import { it as itDict } from "./it";
import { detectLang, formatRatio } from ".";

// confronta le chiavi in profondità: nessun testo può mancare in una lingua
const keys = (o: object, prefix = ""): string[] =>
    Object.entries(o).flatMap(([k, v]) =>
        v && typeof v === "object" && !Array.isArray(v) ? keys(v, prefix + k + ".") : [prefix + k],
    );

describe("lingue", () => {
    it("italiano e inglese hanno le stesse chiavi", () => {
        expect(keys(itDict).sort()).toEqual(keys(en).sort());
    });

    it("formatta i rapporti con il separatore della lingua e tronca", () => {
        expect(formatRatio(4.58, "en")).toBe("4.5:1");
        expect(formatRatio(4.58, "it")).toBe("4,5:1");
        expect(formatRatio(21, "it")).toBe("21,0:1");
    });

    it("sceglie la lingua: URL, poi scelta salvata, poi browser", () => {
        expect(detectLang("?lang=it", ["en-US"], null)).toBe("it");
        expect(detectLang("?lang=en", ["it-IT"], "it")).toBe("en");
        expect(detectLang("", ["en-US"], "it")).toBe("it");
        expect(detectLang("", ["it-IT", "en"], null)).toBe("it");
        expect(detectLang("", ["de-DE"], null)).toBe("en");
        expect(detectLang("?lang=fr", ["en"], null)).toBe("en");
    });
});
