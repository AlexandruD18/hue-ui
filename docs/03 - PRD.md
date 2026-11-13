# 03 - PRD

**Data:** 12 novembre 2026
**Stato:** bozza da approvare
**Documenti collegati:** `00 - Charter.md`, `01 - Analisi.md`, `02 - Struttura e testi.md`

Il riferimento alla schermata di ogni user story si aggiunge dopo il design (Step 8).

## 1. Problema

I generatori di palette danno colori che stanno bene insieme, ma non dicono dove metterli in un'interfaccia né se il testo si leggerà. Il principiante lo scopre tardi, l'esperto perde tempo a controllare i contrasti a mano.

## 2. Obiettivi

Dal charter, invariati:

| # | Obiettivo | Soglia |
|---|-----------|--------|
| O1 | Ogni palette generata rispetta WCAG 2.1 AA | 10.000 palette casuali nei test, 0 coppie sotto soglia |
| O2 | Un principiante crea una palette utilizzabile senza aiuto | Cognitive walkthrough e valutazione euristica da agente separato: 0 problemi gravi, compito in al massimo 3 clic |
| O3 | App accessibile e veloce | Lighthouse mobile: Accessibility 100, Performance ≥ 95; axe: 0 violazioni |
| O4 | Anteprima immediata | Nuova palette applicata in ≤ 100 ms |
| O5 | Caso di studio pubblicato | Pagina nel portfolio con processo e risultati |

## 3. Utenti

- **Principiante**: sa riconoscere colori che gli piacciono, non sa assegnarli né verificarli.
- **Esperto**: vuole provare molte combinazioni in fretta e copiare i valori.

Compito principale comune: arrivare a una palette usabile in un'interfaccia, con testi leggibili, e portarsi via i codici.

## 4. Ambito

**Dentro:** generazione con blocco, Undo, inserimento di un colore HEX, sfondo chiaro o scuro a caso, ruoli ricavati, contrasti verificati e corretti, Why?, anteprima su landing e app mobile, copia dei codici, condivisione via URL, scorciatoie da tastiera, pubblicazione su GitHub Pages.

**Fuori:** export dei token, daltonismo, tema scuro automatico, account e salvataggio sul server, palette da immagine o da intelligenza artificiale, dashboard nell'anteprima.

## 5. Epiche e user story

Priorità MoSCoW: **M** must, **S** should, **C** could, **W** won't.

### E1. Generazione

| ID | Story | P | Criteri di accettazione |
|----|-------|---|-------------------------|
| US1 | Come utente, voglio una palette pronta appena apro la pagina, per iniziare senza configurare nulla | M | Al primo caricamento senza `?p=` compaiono 5 colori; nessuno stato vuoto |
| US2 | Come utente, voglio generare una nuova palette con un clic o con Space, per esplorare in fretta | M | Generate e Space (con focus fuori da pulsanti, link, campi) cambiano tutti i colori non bloccati; l'anteprima si aggiorna in ≤ 100 ms |
| US3 | Come utente, voglio bloccare i colori che mi piacciono, per non perderli alla prossima generazione | M | Il pulsante Lock ha `aria-pressed`; un colore bloccato resta identico al carattere dopo 100 generazioni |
| US4 | Come utente, voglio tornare alla palette precedente, per recuperare una palette cancellata per sbaglio | M | Undo e Ctrl+Z ripristinano fino a 20 palette; senza cronologia Undo è `aria-disabled` con il testo "Nothing to undo yet." |
| US5 | Come utente con un colore di brand, voglio scriverne il codice HEX, per costruire la palette intorno a lui | M | Accetta `#RRGGBB`, `RRGGBB`, `#RGB` senza distinzione di maiuscole; codice non valido: messaggio "Use a hex code like #3E5BD0." e campo aperto; Esc annulla; il colore scritto viene bloccato e gli altri si adattano |
| US6 | Come utente, voglio palette con sfondo sia chiaro sia scuro, per avere più varietà | M | Su 1.000 generazioni senza blocchi, tra il 35% e il 65% hanno sfondo scuro |
| US7 | Come utente, voglio un messaggio chiaro quando tutti i colori sono bloccati, per capire perché Generate non cambia nulla | S | Toast "All colors are locked. Unlock one to generate." |

### E2. Contrasti

| ID | Story | P | Criteri di accettazione |
|----|-------|---|-------------------------|
| US8 | Come utente, voglio palette in cui ogni testo si legge, per non dover controllare a mano | M | Test su 10.000 palette casuali (anche con colori bloccati a caso): tutte le coppie dell'analisi § 3 sopra soglia |
| US9 | Come utente, voglio vedere su ogni colore l'esito del contrasto, per capire a colpo d'occhio se va bene | M | Ogni fascia mostra la coppia più debole del suo colore in una tessera "Aa 4.7:1" con un giudizio a parole ("Easy to read") e la sigla (AA); esito con testo e icona, mai solo colore |
| US10 | Come utente, voglio l'elenco di tutte le coppie verificate, per sapere cosa è stato controllato | M | Sintesi, righello del contrasto con la spiegazione dei numeri e 8 righe, come in `02 - Struttura e testi.md` § 4; sigla UI sulle coppie con soglia 3:1 |
| US11 | Come principiante, voglio una spiegazione semplice di ogni contrasto, per imparare senza teoria | M | Why? su ogni scheda e riga; si apre con clic o Invio, si chiude con Esc o clic fuori; il focus torna al pulsante; testi come § 7 |
| US12 | Come utente, voglio sapere quando il generatore ha corretto un colore, per fidarmi del risultato | S | Il Why? del colore corretto mostra HEX prima e dopo |
| US13 | Come utente con un colore che non passa, voglio una correzione pronta, per sistemarlo con un clic | S | Su un esito `Fails`, il Why? propone un HEX con la stessa tinta e luminosità diversa che passa, e il pulsante "Apply fix" |

### E3. Anteprima

| ID | Story | P | Criteri di accettazione |
|----|-------|---|-------------------------|
| US14 | Come utente, voglio vedere la palette su una landing page, per giudicarla su un sito vero | M | Il mockup usa solo variabili CSS dei ruoli; nessun colore scritto a mano (verificato da un test sul CSS) |
| US15 | Come utente, voglio vederla su un'app mobile, per giudicare anche stati e componenti | M | Il mockup mostra Success, Warning, Error, un campo con bordo, pulsante primario, barra su superficie |
| US16 | Come utente, voglio passare da un mockup all'altro, per confrontarli | M | Selettore con ruolo `tablist`, frecce sinistra/destra per cambiare scheda |

### E4. Copia e condivisione

| ID | Story | P | Criteri di accettazione |
|----|-------|---|-------------------------|
| US17 | Come utente, voglio copiare un codice con un clic, per usarlo in Figma o nel codice | M | Clic sul codice o C: codice negli appunti, toast "Copied #3E5BD0"; se gli appunti sono bloccati, toast di errore e codice selezionato |
| US18 | Come utente, voglio condividere la palette con un link, per mandarla a qualcuno | M | Share copia l'URL; l'URL contiene `?p=` con 5 codici; aprendolo si vede la stessa palette |
| US19 | Come utente che apre un link rovinato, voglio comunque una palette, per non trovarmi davanti a un errore | M | `?p=` non valido: palette casuale e toast "That link didn't contain a valid palette, so here's a fresh one." |

### E5. Tastiera e accessibilità

| ID | Story | P | Criteri di accettazione |
|----|-------|---|-------------------------|
| US20 | Come esperto, voglio scorciatoie da tastiera, per andare più veloce | S | Space, Ctrl+Z, L, C, ?, Esc come in § 6 di `02`; nessuna scorciatoia attiva mentre si scrive in un campo |
| US21 | Come utente, voglio l'elenco delle scorciatoie, per scoprirle | S | Pulsante Shortcuts e tasto ? aprono un `dialog` con focus intrappolato e chiusura con Esc |
| US22 | Come utente di lettore di schermo, voglio sapere cosa cambia, per usare l'app senza vederla | M | Regione `aria-live="polite"` annuncia generazione, undo, copia; ogni controllo ha un'etichetta descrittiva |
| US23 | Come utente sensibile al movimento, voglio un'interfaccia ferma, per non stare male | M | Con `prefers-reduced-motion: reduce` nessuna transizione |
| US24 | Come utente da tastiera, voglio vedere sempre dove sono, per non perdermi | M | Anello di focus visibile su ogni controllo, contrasto ≥ 3:1 su qualunque palette dell'anteprima e dell'interfaccia |

### E6. Pubblicazione

| ID | Story | P | Criteri di accettazione |
|----|-------|---|-------------------------|
| US25 | Come autore, voglio il sito online su GitHub Pages, per mostrarlo nel portfolio | M | Deploy automatico da `main`; `title`, `meta description`, Open Graph 1200×630, `robots.txt`, `sitemap.xml`, canonico sulla home |
| US27 | Come utente italiano, voglio l'interfaccia nella mia lingua, per capire i giudizi e le spiegazioni senza tradurre | S | Lingua dal browser (`it*` → italiano, altrimenti inglese); `?lang=it` o `?lang=en` vince sul browser; selettore EN / IT nei crediti con `aria-current` sulla lingua attiva; `<html lang>` aggiornato; rapporti con la virgola in italiano (`4,6:1`); tutti i testi di `02 - Struttura e testi.md` § 14; test che ogni chiave esista in entrambe le lingue |
| US26 | Come autore, voglio un'animazione morbida tra una palette e l'altra, per rendere il cambio leggibile | C | Transizione di colore ≤ 200 ms, disattivata con movimento ridotto |

**Won't (dichiarati):** export dei token, daltonismo, tema scuro automatico, account, palette da immagine, dashboard.

## 6. MVP

Tutte le story **M** (20). Le **S** entrano nella 1.0 se il calendario regge; la **C** solo se avanza tempo. La 1.0 è "fatta" quando gli obiettivi O1–O4 sono misurati e superati.

## 7. Requisiti non funzionali

| Area | Requisito |
|------|-----------|
| Accessibilità | WCAG 2.1 AA sull'interfaccia di Hue UI; target ≥ 44×44 px; navigazione completa da tastiera |
| Prestazioni | Budget dell'analisi § 5: JS ≤ 80 KB compresso, prima visita ≤ 200 KB, LCP mobile ≤ 1,8 s |
| Compatibilità | Ultime 2 versioni di Chrome, Edge, Firefox, Safari; Safari iOS 16+ |
| Responsive | Da 320 a 1920 px senza scroll orizzontale; progettato a 390 e 1440 |
| Privacy | Nessun cookie, nessun tracciamento, nessuna chiamata esterna; font serviti in locale |
| Qualità del codice | TypeScript `strict`; logica colore in funzioni pure con copertura ≥ 90% |
| Lingua | Interfaccia in inglese e italiano; `lang` della pagina uguale alla lingua mostrata; nessun testo dell'interfaccia scritto fuori dai dizionari |

## 8. Dipendenze

- GitHub (repository, Actions, Pages).
- Nessun servizio esterno a runtime.
- Figma per il design (connettore ufficiale).

## 9. Copione della demo (2 minuti)

1. Apro hueui ⟦URL definitivo⟧: c'è già una palette, con i contrasti accanto a ogni colore.
2. Premo Space tre volte: cambia tutto, anche lo sfondo da chiaro a scuro. L'anteprima segue subito.
3. Blocco il Primary che mi piace e rigenero: resta fermo, il resto cambia.
4. Blocco il Text, poi clicco sul campione dello sfondo e scrivo un colore troppo vicino al testo: la scheda segna `Fails`, apro Why?, leggo perché e premo "Apply fix".
5. Premo Ctrl+Z: torno alla palette di prima.
6. Passo all'anteprima Mobile app: vedo gli stati Done, Due today, Overdue con i colori ricavati.
7. Copio il codice del Primary e condivido il link.

## 10. Definition of Done (per ogni story)

- Criteri di accettazione verificati nell'app in esecuzione, non solo nei test.
- Test automatici per la logica; test del componente per l'interazione.
- axe senza violazioni sulla schermata toccata; prova da tastiera.
- Lint, formattazione, typecheck, test e build verdi in CI.
- Pull request piccola collegata all'issue, revisionata e unita.
- Documenti aggiornati se una decisione è cambiata.

## 11. Schermate di riferimento

Aggiunto il 13/11/2026, dopo il design. **Figma** = pagina Schermate del [file Hue UI](https://www.figma.com/design/Vt2oN8Vcv3jzyvPY1PCWNj); **HTML** = `design/schermate/home.html` con lo stato indicato.

| Story | Figma | HTML |
|-------|-------|------|
| US1, US2, US6, US9, US14 | Desktop / 01, 02, 03 · Mobile / 01, 02 | home · `?state=dark` |
| US3, US20 | Desktop / 05 (Lock attivo) · Componenti › IconButton | home (lucchetti) |
| US4 | Componenti › Button (Disabled) · ActionBar | `?state=undo-tip` |
| US5 | Componenti › HexField | `?state=edit-error` |
| US7 | Componenti › Toast | `?state=all-locked` |
| US8, US10 | Desktop / 01 (Contrast checks, righello) | home |
| US11, US12 | Desktop / 04 · Mobile / 03 | `?state=why-pass`, `?state=why-aa`, `?state=why-adjusted` |
| US13 | Desktop / 05 | `?state=why-fail` |
| US15, US16 | Desktop / 02 | `?view=mobile` |
| US17, US18, US19 | Componenti › Toast | `?state=toast-copied`, `?state=toast-error` |
| US21 | Desktop / 06 | `?state=shortcuts` |
| US22, US23, US24 | Componenti › Focus/Ring, tutte le schermate | tutte |
| US25 | — | — |
| US26 | — | — |
| US27 | Desktop / 07 · Mobile / 05 | ⟦da aggiungere nel codice⟧ |
