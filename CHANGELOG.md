# Changelog

Tutte le modifiche rilevanti di Hue UI. Formato [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), versioni [SemVer](https://semver.org/lang/it/).

## [Unreleased]

## [1.1.0] - 2026-11-17

### Cambiato

- Nuova anteprima "Landing page". È una finestra del browser che riempie tutto il riquadro, senza la cornice grigia e i bordi vuoti di prima. Il titolo sta a sinistra. A destra c'è la settimana dell'app: un giorno per riga, i compiti come etichette con il pallino del loro colore e le ore usate su una barra, che diventa rossa quando un giorno è troppo pieno. Primario, accento e stati si vedono al lavoro insieme.
- Nel mockup i testi usano solo i colori controllati (testo, testo secondario, testo sui pulsanti). Accento e stati colorano solo forme, bordi e sottolineature.

## [1.0.2] - 2026-11-17

### Corretto

- Riaprire e richiudere "Perché?" mandava la pagina in bianco nelle versioni recenti di Chrome. Lì `scrollIntoView` restituisce una Promise, e l'effetto che porta in vista il pannello la restituiva a React come funzione di pulizia. Gli effetti ora non restituiscono niente. Ci sono due test nuovi: uno di componente, che simula il comportamento di Chrome, e uno end-to-end in Chromium.

## [1.0.1] - 2026-11-17

Rifiniture dalle revisioni della 1.0 (#41).

### Aggiunto

- Pulsante "Ingrandisci" sull'anteprima: il mockup a grandezza naturale in un dialog. Su desktop il telefono aveva testi di 5-6 px.
- Su mobile il chip di ogni fascia dice con quale colore è misurato ("con Testo secondario").
- La spiegazione sopra il righello dice cosa vogliono dire AA, AAA e UI.
- Etichette visibili sotto Annulla e Condividi nella barra mobile.

### Corretto

- Un toast informativo non cancella più un errore ancora aperto: hanno due posti separati.
- I toast su desktop stanno sopra la colonna delle fasce e non coprono i crediti.
- Con o senza la nota "Bloccato", nome e codice stanno alla stessa altezza in tutte le fasce.
- L'anello di focus del codice non copre più il nome del ruolo.
- Mentre si scrive un codice HEX la tessera "Aa", ancora sulla palette di prima, si attenua.
- Meno spazio tra le righe dei crediti su mobile.

### Dipendenze

- jsdom 31 per i test di componente (#36).

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
