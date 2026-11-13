# Design di Hue UI

**Direzione scelta:** B, Prova (12/11/2026). Le tre direzioni proposte sono in [direzioni/](direzioni/README.md).

## File

| File | Cosa contiene |
|------|---------------|
| [brief.md](brief.md) | Obiettivi, pubblico, compiti, schermate richieste, stile da evitare |
| [design-system.html](design-system.html) | Tavola Fondamenti (colore, tipografia, spaziatura, griglia, icone, focus) e tavola Componenti con tutti gli stati |
| [schermate/home.html](schermate/home.html) | Prototipo della pagina: funziona nel browser (Space, lucchetti, Why?, campo HEX, Undo, scorciatoie) |
| [schermate/png/](schermate/png/) | Catture a 1440 e 390 px di tutti gli stati del brief |
| [critica.md](critica.md) | Critica di un agente separato (36 punti) e correzioni applicate |
| `assets/hue.css` | Token e componenti: unica fonte per design system e schermate |
| `assets/icons.js` | Famiglia di icone SVG |
| `assets/proto.js` | Logica del prototipo (contrasti calcolati con la formula WCAG 2.1) |
| `assets/mockups.css` | Mockup Plotline, costruiti solo con le variabili dei ruoli |

## Stati del prototipo

Si aprono aggiungendo `?state=` all'URL di `schermate/home.html`:

| Stato | URL | Cattura |
|-------|-----|---------|
| Home, palette chiara | — | `desktop-01`, `mobile-01` |
| Home, palette scura, anteprima app | `?state=dark&view=mobile` | `desktop-02`, `mobile-02` |
| Campo HEX con errore | `?state=edit-error` | `desktop-03`, `mobile-03` |
| Why?, coppia che passa AAA | `?state=why-pass` | `desktop-04` |
| Why?, coppia che passa solo AA | `?state=why-aa` | `desktop-12` |
| Why?, colore corretto dal generatore | `?state=why-adjusted` | `desktop-05`, `mobile-04` |
| Why?, coppia che non passa, Apply fix | `?state=why-fail` | `desktop-06` |
| Dialog scorciatoie | `?state=shortcuts` | `desktop-07` |
| Toast copiato / errore di copia | `?state=toast-copied`, `?state=toast-error` | `desktop-08`, `desktop-09`, `mobile-05` |
| Tutti i colori bloccati | `?state=all-locked` | `desktop-10` |
| Undo inattivo con suggerimento | `?state=undo-tip` | `desktop-11` |

## Dati d'esempio da sostituire

Tutto ciò che segue è inventato e serve solo al prototipo:

- **Plotline**, l'app per pianificare la settimana dei mockup, con i suoi testi, le attività ("Send invoice to Studio Arco", "Renew domain"…) e la citazione, segnata come cliente fittizio.
- **Le tre palette** del prototipo (verde su grigio chiaro, blu su scuro, viola su chiaro) e la palette in conflitto dello stato "non passa". Nel prodotto arriveranno dal generatore.
- **La correzione "#4A8F7B → #2C6A58"** dello stato "colore corretto": illustrativa. I rapporti mostrati, le correzioni di "Apply fix" e gli adattamenti dopo Generate invece sono calcolati sui colori veri.
- **Il link "Code on GitHub"** del footer, ancora vuoto ⟦URL del repository da inserire⟧.

## Figma

File: [Hue UI su Figma](https://www.figma.com/design/Vt2oN8Vcv3jzyvPY1PCWNj) (creato il 13/11/2026 con il connettore ufficiale).

| Pagina | Contenuto |
|--------|-----------|
| Cover | Copertina con le 5 fasce vere (da impostare a mano come miniatura del file: tasto destro, "Set as thumbnail") |
| Design system | Fondamenti: colori Shell con contrasto sul bianco, Palette nei 4 modi, stili di testo, spaziature, raggi, effetti, icone |
| Componenti | 7 sezioni: icone, azioni e controlli, prova e fasce, contrasti, feedback e campi, barre, mockup Plotline |
| Schermate | 7 desktop 1440×900 e 5 mobile 390×844 (tra cui la home in italiano), con prototipo cliccabile e 3 percorsi |

**Variabili.** 4 collezioni: Primitives, Shell, Palette, Size. Palette ha 4 modi (Green light, Blue dark, Purple light, Conflict): colori, codici HEX, rapporti, giudizi a parole, sintesi e posizioni dei punti del righello cambiano col modo. Le schermate non sono ridisegnate per ogni palette: cambia solo il modo.

**Prototipo.** Generate fa ruotare le palette; Why? su Primary apre e chiude il pannello; Shortcuts apre il dialog; stessi percorsi su mobile. "Apply fix" non è collegato: nel prodotto correggerebbe un solo colore, e nessuna schermata lo rappresenta in modo fedele.

**Italiano.** `Desktop / 07` e `Mobile / 05` mostrano la home in italiano: testi da `docs/02` § 14, rapporti con la virgola, selettore EN · IT nei crediti. I mockup Plotline restano in inglese.

**Solo come componenti, non come schermate:** campo HEX con errore, toast, Undo inattivo, tutti i colori bloccati. I loro stati sono nella pagina Componenti e nel prototipo HTML.
