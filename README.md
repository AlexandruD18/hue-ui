# Hue UI

[![CI](https://github.com/AlexandruD18/hue-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/AlexandruD18/hue-ui/actions/workflows/ci.yml)
[![Deploy](https://github.com/AlexandruD18/hue-ui/actions/workflows/deploy.yml/badge.svg)](https://github.com/AlexandruD18/hue-ui/actions/workflows/deploy.yml)

Generatore di palette colori pensato per le interfacce. Ogni colore ha un ruolo (sfondo, superficie, testo, primario, accento) e accanto a ogni colore c'è la prova del suo contrasto: "Aa" scritto con i colori veri della coppia più debole, con il rapporto e un giudizio a parole. La palette si vede subito applicata a una landing page e a un'app mobile. Interfaccia in inglese e in italiano.

Progetto UI/UX e front-end per portfolio, volutamente semplice.

- **Design:** [file Figma](https://www.figma.com/design/Vt2oN8Vcv3jzyvPY1PCWNj) · [prototipo HTML](design/schermate/home.html) · [design system](design/design-system.html)
- **Sito:** https://alexandrud18.github.io/hue-ui/ ⟦attivo dal primo deploy⟧

## Stato

- **Fatto:** pre-progetto ([docs/](docs/)), design e critica ([design/](design/README.md)), file Figma, repository con CI.
- **Step attuale:** 8, sviluppo in sprint di una settimana. Milestone e issue su GitHub.
- **Prossima azione:** Sprint 1, motore del colore e palette.
- **PDF dei documenti:** in `consegna/`, con la data nel nome.

## Requisiti

- Node.js 22 e npm 11
- Per i test end-to-end: `npx playwright install chromium`

## Comandi

| Comando                           | Cosa fa                                                  |
| --------------------------------- | -------------------------------------------------------- |
| `npm install`                     | Installa le dipendenze                                   |
| `npm run dev`                     | Server di sviluppo su http://localhost:5173/hue-ui/      |
| `npm run build`                   | Controllo dei tipi e build in `dist/`                    |
| `npm run preview`                 | Serve la build su http://localhost:4173/hue-ui/          |
| `npm run lint`                    | ESLint (TypeScript strict, jsx-a11y strict, React hooks) |
| `npm run format` / `format:check` | Prettier, indentazione a 4 spazi                         |
| `npm run typecheck`               | TypeScript senza emissione                               |
| `npm test`                        | Test unitari e di componente (Vitest, Testing Library)   |
| `npm run test:e2e`                | Test end-to-end con axe a 1440 e 390 px (Playwright)     |
| `npm run lhci`                    | Lighthouse CI con il budget delle prestazioni            |

## Architettura

Una pagina React senza server: lo stato vive nell'URL (`?p=` per la palette, `?lang=` per la lingua) e nella memoria della pagina.

```
src/
├── color/        conversioni OKLCH, contrasto WCAG, generatore, ruoli ricavati, correzioni
├── state/        reducer, contesto, lettura e scrittura dell'URL
├── i18n/         dizionari en/it e formato dei rapporti
├── components/   fasce, tessera di prova, contrasti, Why?, dialog, toast
├── previews/     mockup Plotline (solo variabili dei ruoli)
└── styles/       token e stili globali
tests/e2e/        flussi completi con axe
```

Le scelte e le alternative scartate sono in [docs/04 - Specifiche tecniche.md](docs/04%20-%20Specifiche%20tecniche.md).

## Qualità

La CI gira su ogni pull request e blocca il merge se fallisce:

- **Codice:** lint, formattazione, tipi, test unitari, build, `npm audit`;
- **Accessibilità:** test end-to-end con axe (WCAG 2.1 AA) su desktop e mobile;
- **Prestazioni:** Lighthouse CI, con Accessibility 100, Performance ≥ 95, JavaScript ≤ 80 KB e pagina ≤ 200 KB;
- **Link:** controllo dei link di README e CHANGELOG.

Dependabot aggiorna le dipendenze ogni settimana.

## Deploy

Ogni merge su `main` pubblica `dist/` su GitHub Pages con il workflow [deploy.yml](.github/workflows/deploy.yml). Non servono segreti.

## Struttura del repository

- `docs/` documenti di progetto numerati (charter, analisi, struttura e testi, PRD, specifiche)
- `design/` brief, direzioni, design system, prototipo, critica
- `consegna/` documenti impaginati in PDF
- `src/`, `tests/` codice e test

## Licenza

[MIT](LICENSE)
