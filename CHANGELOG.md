# Changelog

Tutte le modifiche rilevanti di Hue UI. Formato [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), versioni [SemVer](https://semver.org/lang/it/).

## [Unreleased]

## [1.0.0] - 2026-11-14

Prima versione pubblica, su https://alexandrud18.github.io/hue-ui/.

### Aggiunto

- Progetto React + Vite + TypeScript con lint, formattazione, test unitari, test end-to-end con axe, Lighthouse CI e pubblicazione su GitHub Pages.
- Documenti di progetto (`docs/`), design system, prototipo e critica (`design/`).
- Motore del colore in OKLCH: 5 colori con un ruolo, ruoli derivati, contrasti WCAG garantiti e correzione della sola luminosità.
- Interfaccia principale: 5 fasce con prova di lettura, blocco, modifica del codice HEX, copia, pannello "Perché?" con correzione in un clic.
- Controllo degli 8 contrasti con righello da 1:1 a 21:1 e anteprima su una landing page e su un'app mobile.
- Annulla fino a 20 passi, con Ctrl+Z.
- Link condivisibile: la palette e la lingua stanno nell'URL (`?p=…&lang=…`), con il pulsante Condividi.
- Dialog delle scorciatoie (Spazio, Ctrl+Z, L, C, ?, Esc) con l'interruttore per spegnere i tasti singoli.
- Interfaccia in inglese e in italiano, con scelta ricordata nel browser.
- Favicon, immagine per i social, `robots.txt`, `sitemap.xml`, canonical e hreflang.

### Verificato

- Controllo visivo e cognitive walkthrough di un valutatore separato, con le correzioni ([docs/revisioni/](docs/revisioni/)). Il bloccante trovato, contrasti rotti dopo un colore scritto a mano, è corretto e coperto da un test su 3000 palette casuali.
