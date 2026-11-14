# Hue UI

[![CI](https://github.com/AlexandruD18/hue-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/AlexandruD18/hue-ui/actions/workflows/ci.yml)
[![Deploy](https://github.com/AlexandruD18/hue-ui/actions/workflows/deploy.yml/badge.svg)](https://github.com/AlexandruD18/hue-ui/actions/workflows/deploy.yml)

Generatore di palette colori pensato per le interfacce. Ogni colore ha un ruolo (sfondo, superficie, testo, primario, accento) e accanto a ogni colore c'è la prova del suo contrasto: "Aa" scritto con i colori veri della coppia più debole, con il rapporto e un giudizio a parole. La palette si vede subito applicata a una landing page e a un'app mobile. Interfaccia in inglese e in italiano.

Progetto UI/UX e front-end per portfolio, volutamente semplice.

- **Design:** [file Figma](https://www.figma.com/design/Vt2oN8Vcv3jzyvPY1PCWNj) · [prototipo HTML](design/schermate/home.html) · [design system](design/design-system.html)
- **Sito:** https://alexandrud18.github.io/hue-ui/
- **Caso di studio:** [docs/05 - Caso di studio.md](docs/05%20-%20Caso%20di%20studio.md), impaginato in `consegna/`

## Stato

- **Versione 1.0:** tutte le 27 storie del PRD sono nel sito, in tre sprint. Issue e milestone su GitHub.
- **Revisioni:** controllo visivo e cognitive walkthrough di un valutatore separato in [docs/revisioni/](docs/revisioni/). Non ci sono stati test con persone vere.
- **PDF dei documenti:** in `consegna/`, con la data nel nome.

## Cosa si può fare

- Generare una palette con il pulsante o con Spazio, bloccare i colori da tenere, tornare indietro fino a 20 passi.
- Scrivere un codice HEX: gli altri colori si adattano perché il testo resti leggibile.
- Leggere gli 8 controlli di contrasto in parole ("Si legge bene") e aprire "Perché?" per la spiegazione e la correzione in un clic.
- Vedere la palette su una landing page e su un'app mobile.
- Condividere la palette con un link; usare le scorciatoie (L, C, ?) o spegnerle.

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

- **Codice:** lint, formattazione, tipi, test unitari con copertura minima del 90%, build, `npm audit`;
- **Accessibilità:** test end-to-end con axe (WCAG 2.1 AA) su desktop e mobile;
- **Prestazioni:** Lighthouse CI, con Accessibility 100, Performance ≥ 95, JavaScript ≤ 100 KB e pagina ≤ 250 KB (gzip);
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
