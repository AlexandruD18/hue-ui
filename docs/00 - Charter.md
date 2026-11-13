# 00 - Charter

**Progetto:** Hue UI
**Autore:** Alexandru Mihai Dimofte
**Data:** 12 novembre 2026
**Stato:** bozza da approvare

**Principio guida: semplicità.** Hue UI è un sito piccolo che fa bene una cosa sola. Ogni funzione in più va giustificata, e nel dubbio resta fuori.

## Il problema

Chi genera una palette oggi ottiene cinque quadrati colorati. Coolors, Adobe Color e simili rispondono bene alla domanda "quali colori stanno bene insieme?", ma lasciano aperta quella che conta in un'interfaccia: quale colore va sullo sfondo, quale sul testo, quale sul pulsante, e se il testo si legge.

Il principiante sceglie colori belli e poi scopre che il testo grigio su beige non passa i controlli di accessibilità. Il designer esperto sa cosa cerca, ma perde tempo a provare ogni combinazione su un mockup e a misurare i contrasti a mano.

## L'idea

Un generatore di palette che pensa per **ruoli UI**: sfondo, superficie, testo, testo secondario, primario, accento, stati (successo, avviso, errore). Ogni palette esce con contrasti WCAG già verificati per calcolo e si vede subito applicata a un'interfaccia vera.

Una sola interfaccia per principianti ed esperti, che rivela i dettagli quando servono:

- **Sempre visibile**: il colore, il suo ruolo, il codice HEX da copiare con un clic, un'etichetta di contrasto ("AA ✓ 4,8:1").
- **Su richiesta**: un pulsante "Why?" accanto a ogni contrasto apre la spiegazione in parole semplici e la correzione proposta.
- **Per chi va veloce**: scorciatoie da tastiera (spazio per rigenerare, L per bloccare), che non aggiungono nulla sullo schermo.

Perché non due modalità Beginner/Pro: chiedere "che livello sei?" prima di vedere una palette è una scelta in più (legge di Hick); le persone si autovalutano male; ogni schermata andrebbe progettata e testata due volte; una sola interfaccia che serve tutti è una scelta UX più solida da difendere.

## Obiettivi misurabili

| # | Obiettivo | Come si misura |
|---|-----------|----------------|
| O1 | Ogni palette generata rispetta WCAG 2.1 AA sulle coppie testo/sfondo dei ruoli | Test automatici sul generatore: 10.000 palette casuali, 0 coppie sotto 4,5:1 (testo) e 3:1 (componenti UI) |
| O2 | Un principiante crea una palette utilizzabile senza aiuto | Non ci sono persone disponibili per un test. Un agente separato fa un cognitive walkthrough del compito "genera, blocca il primario, verifica i contrasti" e una valutazione euristica (Nielsen): 0 problemi gravi, al massimo 3 clic per completare il compito |
| O3 | L'app è accessibile e veloce | Lighthouse mobile: Accessibility 100, Performance ≥ 95; axe senza violazioni |
| O4 | L'anteprima risponde subito | Nuova palette applicata al mockup in meno di 100 ms (misura con Performance API) |
| O5 | Il progetto regge un colloquio | Caso di studio pubblicato nel portfolio con processo, decisioni e risultati di O1–O4 |

## Perimetro

**Dentro (MVP)**

- Generazione casuale con blocco dei singoli colori e rigenerazione.
- Assegnazione dei colori ai ruoli UI con verifica e correzione automatica dei contrasti.
- Palette di 5 colori scelti a caso (sfondo, superficie, testo, primario, accento); gli altri ruoli si ricavano. Lo sfondo può uscire chiaro o scuro.
- Anteprima della palette su due mockup UI (landing page, app mobile) in tempo reale.
- Interfaccia unica con spiegazioni su richiesta ("Why?") e scorciatoie da tastiera.
- Inserimento di un proprio colore (codice HEX), che resta bloccato mentre gli altri si adattano.
- Undo delle ultime 20 palette.
- Palette condivisibile tramite URL; nessun account.
- Interfaccia in inglese e in italiano: lingua scelta dal browser, selettore EN / IT nei crediti, lingua anche nell'URL (`?lang=it`). Documenti di progetto in italiano.
- File Figma completo: design system, schermate, prototipo.

**Fuori (non previsto)**

- Export dei token (CSS, Tailwind, JSON, variabili Figma). Basta copiare il codice HEX di un colore con un clic.
- Simulazione del daltonismo e tema scuro automatico.
- Backend, account, palette salvate sul server.
- Generazione da immagine o con intelligenza artificiale.

## Parti interessate

| Chi | Interesse |
|-----|-----------|
| Alexandru (autore) | Progetto da portfolio e CV, completo dal pre-progetto al rilascio |
| Recruiter e aziende | Valutano processo UX, qualità del codice, accessibilità |
| Principianti (studenti, sviluppatori junior) | Una palette che funziona davvero in un'interfaccia |
| Designer UI | Velocità e controllo sui valori |

## Vincoli

- Solo front-end: nessun server, stato nell'URL e nel `localStorage`.
- Stack: React, Vite, TypeScript; test con Vitest.
- Hosting gratuito su GitHub Pages, pubblicato da GitHub Actions.
- Una persona sola, con revisioni affidate ad agenti separati.
- Stile visivo diverso dai progetti precedenti dell'autore (gadda-web, ttf-web, portfolio).

## Rischi

| Rischio | Probabilità | Impatto | Mitigazione |
|---------|-------------|---------|-------------|
| Sembra "l'ennesimo Coolors" | Alta | Alto | Il valore sta nei ruoli e nei contrasti: ogni schermata deve mostrarlo prima dei quadrati colorati |
| Palette casuali brutte una volta forzati i contrasti | Media | Alto | Generazione in OKLCH, correzione solo sulla luminosità, test visivi su campioni |
| Le spiegazioni appesantiscono l'interfaccia | Media | Medio | Nascoste dietro "Why?", mai aperte di default |
| Mockup troppo complessi da mantenere | Media | Medio | Mockup costruiti solo con variabili CSS dei ruoli |
| Il progetto si allunga e non arriva online | Media | Alto | Perimetro stretto e dichiarato; nessuna funzione oltre l'MVP |
| Nessun test con utenti reali | Certa | Medio | Cognitive walkthrough e valutazione euristica da agente separato; il limite si dichiara nel caso di studio |

## Calendario indicativo

| Settimana | Fase |
|-----------|------|
| 1 | Charter, analisi dei concorrenti, struttura, PRD, specifiche tecniche, brief |
| 2 | Direzioni di design, scelta, design system HTML, critica |
| 3 | File Figma: design system, schermate, prototipo |
| 4–6 | Sviluppo in sprint di una settimana |
| 7 | Controlli finali, rilascio 1.0, caso di studio per il portfolio |

## Metodo

Agile leggero: sprint di una settimana, una issue per user story, pull request piccole, CI con lint, test, build, axe e Lighthouse. Ogni fase si chiude con l'approvazione dell'autore.

## Decisioni prese

| Data | Decisione |
|------|-----------|
| 12/11/2026 | Pubblico: principianti e pro, serviti da un'interfaccia unica (niente modalità Beginner/Pro) |
| 12/11/2026 | MVP: ruoli UI con contrasti WCAG e anteprima su mockup |
| 12/11/2026 | Export, daltonismo e tema scuro esclusi: il sito resta semplice |
| 12/11/2026 | Stack React, Vite, TypeScript; hosting GitHub Pages |
| 12/11/2026 | Nome "Hue UI": nessun prodotto omonimo trovato in una ricerca web del 12/11/2026 |
| 12/11/2026 | Interfaccia in inglese, documenti in italiano |
| 12/11/2026 | Nessun test con utenti: O2 si verifica con un agente separato |
| 12/11/2026 | 5 colori per palette, ruoli restanti ricavati; 2 mockup (landing, app mobile); sfondo chiaro o scuro a caso |
| 12/11/2026 | Aggiunti inserimento di un colore HEX e Undo |
| 13/11/2026 | Interfaccia bilingue inglese/italiano, in versione leggera: niente librerie, un dizionario per lingua, story "Should" dopo l'MVP |
