# Critica del design: Hue UI (direzione B, Prova)

**Data:** 12 novembre 2026
**Revisore:** agente separato, senza contatto con il lavoro precedente
**Materiale valutato:** `design/design-system.html`, `design/schermate/home.html` (tutti gli stati `?state=`), le 16 catture in `design/schermate/png/`, `design/assets/*.css|js`
**Metodo:** Chrome DevTools a 1440×900, 1280×720 e 390×844 (mobile, touch). Contrasti calcolati con la formula WCAG 2.1 sul colore renderizzato, compresi opacità e sfondi composti, per tutti gli elementi di testo dell'involucro e dei mockup, su quattro palette: chiara verde, scura, chiara viola e quella in conflitto (`why-fail`). Tastiera provata con eventi reali (Tab, Invio, Space, L, ?, Esc). Albero di accessibilità letto dallo snapshot. Console senza errori su entrambe le pagine.

## Sintesi

1. La direzione funziona: le fasce a tutta larghezza con la tessera "Aa + rapporto" mostrano il contrasto accanto al colore, e il vantaggio su Coolors si capisce in pochi secondi. L'involucro grigio resta davvero neutro.
2. Ci sono però errori nei numeri. Il Why? di una coppia che non passa propone sempre `#F2F4F3 (14.3:1)`, qualunque sia la riga, e parla di "locked Text" anche per i colori di stato. Nella palette in conflitto i colori di stato falliscono anche se non sono bloccati, contro quanto dice la specifica.
3. L'accessibilità ha buone basi (doppio anello di focus, dialog nativo, tablist, `aria-pressed`, `aria-expanded`), ma restano buchi seri. Il codice HEX non arriva mai al lettore di schermo. Il nero `#111` delle etichette può scendere a 4,35:1. Le etichette della tessera usano i colori della coppia e su una coppia che fallisce scendono a 2,5:1. Tre gruppi di controlli sono sotto i 44 px.
4. Su mobile la palette è una colonna lunga circa 1600 px: non si vedono mai i 5 colori insieme, quindi il compito n. 1 del brief ("guardare una palette e capire se funziona") non riesce. Su desktop l'elenco dei contrasti resta sotto la piega e il Why? dell'ultima fascia esce dallo schermo.
5. Verdetto: buona base da portfolio, ma non ancora pronta. Vanno corretti prima i 🔴, poi la vista mobile.

## Problemi

Gravità: 🔴 alta (blocca la consegna o viola WCAG AA o un requisito del brief), 🟠 media, 🟢 bassa.

### Contrasti e dati

| # | Gravità | Dove | Evidenza misurata | Proposta |
|---|---------|------|-------------------|----------|
| 1 | 🔴 | `proto.js` `whyText()`, stato `why-fail`, Why? delle righe "Muted text" e "Status colors" | Il Fix è sempre `lighten Background to #F2F4F3 (14.3:1)`, dove 14.3:1 è il rapporto Text/Background. Sulla riga Status colors il Why? dice "Background and your locked Text are too close. Controls need 3:1", ma Text non c'entra con quella coppia. "Apply fix" cambia sempre e solo Background. | Calcolare la correzione per la coppia aperta: stessa tinta, luminosità cercata finché la coppia passa. Mostrare il rapporto di quella coppia e la frase "locked" solo se il colore bloccato fa parte della coppia. |
| 2 | 🔴 | `proto.js` `derive()`, palette `CONFLICT` | Background `#56625E` è "scuro" (luminanza < 0,2), quindi si prendono i colori di stato per sfondo scuro. Risultato: "Status colors on Background" vale 2.5:1 Fails, e nel mockup i chip sulla superficie bianca valgono Done 2,16:1, Due today 1,84:1, Overdue 2,49:1. La specifica (02 § 12) dice che i colori non bloccati si adattano sempre. | Ricavare i colori di stato dal contrasto reale (3:1 su Background **e** su Surface), non da una soglia chiaro/scuro. Nello stato `why-fail` devono fallire solo le coppie con due colori bloccati. |
| 3 | 🔴 | `hue.css` `.proof__meta`, tessere su tutte le fasce | L'etichetta di 13 px ("AA (UI) · Accent on Background") ha i colori della coppia misurata. Su una coppia che fallisce vale 2,5:1 (misurato in `why-fail`). Per le coppie (UI) il generatore garantisce solo 3:1, quindi del testo di 13 px può scendere a 3:1 (serve 4,5:1, WCAG 1.4.3). | Lasciare nei colori della coppia solo "Aa" e il rapporto (testo grande, ≥ 24 px). Spostare livello e nome della coppia fuori dalla tessera, nel colore `--on` della fascia, oppure in un'etichetta bianca come "Fails". |
| 4 | 🔴 | `proto.js` riga 104, `--on` delle fasce. Anche `design-system.html` (testo della Fascia) | Si sceglie tra `#FFFFFF` e `#111111`. Il caso peggiore (luminanza ≈ 0,19) dà 4,35:1, per esempio 4,48:1 e 4,22:1 su `#777777`: sotto 4,5 per il codice HEX (15 px) e per la nota (13 px). In più `.band__note` ha `opacity: 0.9`. | Usare `#000000` (caso peggiore 4,58:1) e togliere l'opacità dalla nota e dall'icona del codice. Correggere la frase del design system "restano leggibili". |
| 5 | 🟠 | Promessa del prodotto e mockup (`mockups.css`) | Il mockup usa coppie che l'elenco non verifica: badge Accent di 12 px, link Primary di 14 px, chip di stato di 11 px su **Surface** (non su Background), tab attiva Primary su Surface (1,13:1 nella palette in conflitto). Nella palette viola il chip "Done" vale 4,44:1 su Surface. Il generatore garantisce 3:1, ma questi sono testi piccoli. | Due strade: verificare anche le coppie usate come testo piccolo (Accent, Primary, stati su Surface a 4,5:1), oppure rendere questi elementi non testuali o grandi. In ogni caso aggiungere all'elenco "Status colors on Surface". La riga "every pair is readable" deve essere vera anche nell'anteprima. |
| 6 | 🟠 | `.why[aria-expanded=true]`, `.ib:hover` | Lo stato "Why? aperto" è segnalato solo dallo sfondo `#F3F3F4` sulla pillola bianca, a 1,11:1. WCAG 1.4.11 chiede 3:1 per gli indicatori di stato. | Pallino o sottolineatura di 2 px in `--text`, oppure il riempimento scuro usato per Lock premuto. |
| 7 | 🟢 | `proto.js` `mixUntil()` | Muted text e Border sono mescolati in sRGB, mentre 02 § 3 parla di OKLCH. Nel prototipo i valori sono corretti (Muted 4,6:1), ma la regola non è quella documentata. | Allineare nell'implementazione o correggere il documento. |

### Accessibilità (tastiera, nomi, ARIA, target)

| # | Gravità | Dove | Evidenza misurata | Proposta |
|---|---------|------|-------------------|----------|
| 8 | 🔴 | `.band__hex`, `[data-copy]`, `.band__swatch-btn` | Lo snapshot accessibile dà "Copy Background color" ed "Edit Background color": l'`aria-label` copre il testo, quindi **il codice HEX non è mai annunciato**. Chi usa un lettore di schermo non conosce i colori. Il testo approvato (02 § 8, § 12) è "Copy Primary color, #3E5BD0" e "Edit Primary color, #3E5BD0". | Aggiornare le etichette con il codice a ogni render, oppure togliere l'`aria-label` da `.band__hex` e lasciare il testo visibile più un testo nascosto "Copy". |
| 9 | 🔴 | Target sotto i 44 px (requisito del brief) | `.band__hex` 105×32, tab del selettore 122×40 e 107×40, `.checks .why` 50×36, link "Code on GitHub" 103×21. | `min-height: 44px` su tutti, o un'area di clic estesa con `::before`. Nelle righe dei contrasti si può rendere cliccabile tutta la riga. |
| 10 | 🟠 | `[data-lock]` | L'etichetta cambia ("Unlock Primary") **e** intanto `aria-pressed="true"`: il lettore dice "Unlock Primary, interruttore, premuto", due informazioni in contrasto. Dopo L con il focus sul pulsante Copy non c'è nessun annuncio (`#live` resta "New palette generated."). | Etichetta fissa "Lock Primary" con `aria-pressed`, e in 02 § 8 sostituire "Lock/Unlock". Annunciare "Primary locked." o "Primary unlocked." nella regione live. |
| 11 | 🟠 | Why? sulle fasce | Cinque pulsanti hanno lo stesso nome, "Why?". Le righe dei contrasti invece hanno nomi descrittivi ("Why? Text on Background"). | `aria-label="Why? Primary, On primary on Primary"` o simile. |
| 12 | 🟠 | Undo inattivo | Il suggerimento "Nothing to undo yet." esiste solo con `?state=undo-tip` (classe forzata). In uso reale non compare né al passaggio del mouse né al focus, e un clic apre un toast. 02 § 5 chiede che compaia al passaggio o al focus. | Tooltip vero su `:hover` e `:focus-visible`, collegato con `aria-describedby`. Tenere il toast solo per il clic. |
| 13 | 🟠 | Campo HEX (`openEditor`) | L'errore è collegato bene (`aria-invalid` e `aria-describedby`), ma cambia testo dentro un elemento già descritto: non viene annunciato. Il clic fuori non applica e non chiude (misurato: il campo resta aperto). 02 § 12 dice "Invio o clic fuori". | `role="alert"` o una regione live per l'errore. Applicare al `blur` o al clic esterno se il valore è valido. |
| 14 | 🟠 | Scorciatoia `?` | È una scorciatoia di un solo carattere, attiva in tutta la pagina e non disattivabile: viola WCAG 2.1.4 (livello A). L e C vanno bene perché funzionano solo con il focus sulla fascia. | Interruttore "Single-key shortcuts" nel dialog, oppure `?` attivo solo con il focus sulla palette. Valutare anche Space. |
| 15 | 🟠 | Why? della fascia Accent, desktop | A 1440×900 il pannello va da 847 a 986 px: 86 px restano fuori schermo. La colonna delle fasce è `sticky`, quindi anche scorrendo di 300 px il fondo resta tagliato (bordo inferiore a 910 px). A 1280×720 va peggio. | Aprire il pannello verso l'alto quando non c'è spazio sotto, oppure ancorarlo a sinistra della pillola. |
| 16 | 🟠 | Toast di errore copia | Il messaggio sparisce dopo 4 s ma contiene un'istruzione da seguire ("Select the code and press Ctrl+C"). 02 dice anche che il codice resta selezionato, cosa non fatta. | Il toast di errore resta finché non lo si chiude, o almeno 10 s. Selezionare davvero il codice. |
| 17 | 🟠 | Mobile, barra in basso | Gli elementi con il focus vicino al fondo finiscono sotto la barra fissa (cattura `mobile-03`: il campo è a filo della barra e la tessera sotto è coperta). | `scroll-padding-bottom` pari all'altezza della barra (circa 96 px) su `html`. |
| 18 | 🟢 | `[data-generate]` | Nome accessibile "Generate Space": il `<kbd>` entra nel nome. | `aria-hidden` sul `kbd` e `aria-keyshortcuts="Space"`. |
| 19 | 🟢 | `#toasts` e `.toast[role=status]` | Due regioni live annidate, con il rischio di annunci doppi. | Tenere solo `aria-live` sul contenitore. |
| 20 | 🟢 | Focus del campione (`.band__swatch-btn`) | L'anello sta fuori dalla fascia: il lato sinistro esce dallo schermo (x < 0) e quello inferiore tocca la fascia successiva. | `outline-offset: -6px` sul campione, così l'anello sta dentro la fascia. |
| 21 | 🟢 | Tablist | Mancano Home e End, e il `tabpanel` non è raggiungibile con il focus. | Aggiungere i due tasti e `tabindex="0"` sul pannello. |

### Aderenza al brief e ai testi approvati (02 - Struttura e testi)

| # | Gravità | Dove | Differenza | Proposta |
|---|---------|------|------------|----------|
| 22 | 🟠 | Struttura (02 § 1) | Generate e Undo stanno nell'header e non "subito sotto la palette". Il suggerimento "or press Space" manca (c'è un `kbd` dentro il pulsante). L'elenco dei contrasti viene **dopo** l'anteprima, mentre la mappa lo mette prima. | Scelta difendibile per la direzione B, ma va riportata in 02 § 1 e § 8. Valutare l'elenco prima dell'anteprima (vedi #25). |
| 23 | 🟠 | Why? "colore corretto" | Approvato: "We darkened it a little, from #6C8CFF to #4F6FE6. White text on your buttons now reaches 4.7:1. The hue is the same; only the lightness changed." Prototipo: "…so white text on your buttons stays readable…" più la riga `#4A8F7B to #2C6A58 (6.3:1)`, dove il rapporto sembra riferito al codice. | Usare la frase approvata con i valori veri: "…now reaches 6.3:1." |
| 24 | 🟠 | Why? "non passa" | Approvato: "Background and your locked Text are too close: 2.3:1. Fix: lighten Background to #F4F1EA (11.2:1)." Il prototipo dice "…too close. Text needs 4.5:1; at 2.5:1 some people will…", e il design system ha un terzo testo ancora diverso ("Body text needs 4.5:1. At this ratio… Your Text color is locked, so we change Background."). | Un solo testo, quello approvato, uguale in design system e prototipo. |
| 25 | 🟢 | Testi nuovi non presenti in 02 | "Enter to apply, Esc to cancel" (e nel DS "Preview. Enter to apply…"), "Locked", "Adjusted for contrast", "Fix applied. Background is now #F2F4F3.", "{Role} set to #… and locked.", "Text needs 4.5:1. Buttons and other controls, marked (UI), need 3:1.", titolo del dialog "Keyboard shortcuts" e le sue descrizioni. | Sono testi buoni: aggiungerli a 02 § 5 e § 8, così restano la fonte unica. |
| 26 | 🟢 | Why? di una coppia AA ma non AAA | Testo: "Body text needs at least 4.5:1 … and 7:1 for AAA. This pair passes." Non dice che non arriva ad AAA. | "This pair passes AA. It would need 7:1 for AAA." |
| 27 | 🟢 | Font | Google Fonts caricato da remoto. PRD § 7: nessuna chiamata esterna, font in locale. | Va bene nel prototipo. Nello sviluppo servire Bricolage in locale (1 file variabile). |

### Gerarchia, coerenza, euristiche

| # | Gravità | Dove | Evidenza | Proposta |
|---|---------|------|----------|----------|
| 28 | 🔴 | Mobile 390, palette | Ogni fascia è alta circa 320 px, quindi la palette occupa circa 1600 px. Nel primo schermo si vedono 1,5 colori. Il compito n. 1 del brief non riesce su mobile: è il desktop rimpicciolito, non un mobile progettato. | In cima, una striscia compatta con i 5 campioni (nome, HEX, esito in una riga, circa 72 px ciascuno), con la tessera grande solo per la fascia aperta. Oppure fasce di 96 px con la tessera ridotta a chip "AA ✓ 4.6:1". |
| 29 | 🟠 | Desktop, "Contrast checks" | A 1440×900 si vedono 3 righe su 7. A 1280×720 l'elenco parte a 862 px, cioè fuori schermo. Il brief dice "sempre visibile, non in un pannello nascosto". | Elenco prima dell'anteprima, oppure anteprima più bassa, oppure una sintesi "7 of 7 pairs pass" in cima alla colonna. |
| 30 | 🟠 | Tessere di Background e Text | Mostrano la stessa coppia ("Muted text on Background 4.6:1"). La fascia Text non mostra mai il colore Text: il principiante vede un "Aa" grigio sotto "Text" e non capisce. | Su Text mostrare la coppia peggiore che contiene Text (Text on Surface o Text on Background). Muted resta su Background. |
| 31 | 🟠 | Inserire un colore (riconoscere invece di ricordare) | Tutta la fascia è un pulsante, ma niente lo dice: nessuna matita, nessun hover visibile. L'icona `pencil` sta nel design system ma non viene usata. | Al passaggio del mouse e al focus: matita e "Click to edit" accanto al codice, oppure un pulsante matita nella pillola. |
| 32 | 🟢 | Due "Copy" per fascia | Il codice è un pulsante di copia e c'è un altro pulsante Copy nella pillola, con la stessa etichetta. Il doppione si sente con la tastiera (7 fermate per fascia). | Tenere solo il codice cliccabile (con l'icona) e togliere Copy dalla pillola. Restano Lock e Why?. |
| 33 | 🟢 | Lock con sola icona | Lucchetto aperto o chiuso senza testo né tooltip. Il principiante può confondere "aperto = sbloccato" con "cliccabile". | Tooltip "Lock color (L)". La nota "Locked" c'è già: bene. |
| 34 | 🟢 | Etichette "AA (UI)" e "AAA" | Primary on Background a 7,2:1 dice "AA (UI)", mentre On primary a 7,7:1 dice "AAA": a colpo d'occhio sembra che il primo sia peggiore. | Per le coppie UI mostrare "UI ✓ 7.2:1" senza livello, oppure spiegarlo nel Why?. |
| 35 | 🟢 | Design system e schermate | Nel design system mancano la barra mobile (dock), l'header, il toast "All colors are locked" e il Fails sulla fascia intera. Il testo del Why? fail e il suggerimento del campo HEX sono diversi tra le due pagine. | Aggiungere i componenti mancanti e generare i testi da un'unica fonte. |
| 36 | 🟢 | Footer | `href="#"` (segnalato come ⟦da inserire⟧ nel README: corretto). | Inserire l'URL prima della pubblicazione. |

### Cognitive walkthrough: "genera, blocca il Primary, verifica i contrasti" (principiante, desktop)

| Passo | Clic | Lo capisce? | Note |
|-------|------|-------------|------|
| Genera | 1 | Sì | Generate è l'unico pulsante pieno e sta in alto a destra. Feedback: cambiano i colori. |
| Blocca Primary | 2 | In parte | Il lucchetto è un'icona senza testo. Dopo il clic compaiono "Locked" e il riempimento scuro: buon feedback. |
| Rigenera per verificare | 3 | Sì | Primary resta fermo. |
| Verifica i contrasti | 0 (scroll) | In parte | Le tessere rispondono subito. Ma "AA", "AAA" e "(UI)" sono spiegati solo nella nota sotto l'elenco, che è fuori dalla piega. La tessera di Text mostra Muted (#30). |

Totale: **3 clic**, dentro la soglia O2. Nessun blocco, due attriti (lucchetto senza testo, legenda fuori vista). Su mobile i clic sono gli stessi, ma servono circa 3 schermate di scroll per arrivare al lucchetto di Primary e tornare alla barra.

Euristiche di Nielsen in breve: lo stato del sistema è visibile (Locked, Adjusted, esiti); controllo e libertà ci sono (Undo, Esc); prevenzione degli errori buona (Fails mai affidato al solo colore). Punti deboli: riconoscere invece di ricordare (#31, #33) e coerenza (#24, #32, #35).

### Aspetto da template o da AI

Non sembra un template. Bricolage Grotesque non compare tra i caratteri da evitare e dà carattere senza un colore di brand. L'involucro grigio è rigoroso. La tessera "Aa" grande è un'idea riconoscibile. Non ci sono gradienti viola, griglie di card uguali o emoji. Due rischi: le pillole a raggio 999 sono ovunque (pulsanti, pillola dei controlli, selettore, chip Fails) e le fasce a tutta larghezza richiamano Coolors. Il mockup della landing ha le tre card uguali, ma lì è voluto (è una landing tipica da ricolorare). L'unico gradiente (`.checks li[data-level=Fails]`) è funzionale e discreto.

## Cosa funziona bene

- **Concetto chiaro:** "Aa" scritto nei colori veri della coppia più debole, accanto a ogni colore. È la promessa del brief resa visibile.
- **Involucro davvero neutro:** nessun controllo prende i colori generati. La pillola bianca con bordo da 3,96:1 resta leggibile su tutte e quattro le palette misurate.
- **Focus a doppio anello** (scuro 2 px e bianco): 16:1 su qualunque fascia, provato su palette chiara, scura, viola e in conflitto.
- **Esiti mai affidati al solo colore:** icona, testo e chip bianco per Fails.
- **Rapporti calcolati e non scritti a mano.** Ho controllato a campione: 14.3, 4.6, 6.3, 15.8, 5.6, 4.8 e 2.5 sono corretti e troncati a un decimale come chiede 02 § 9. La correzione `#4A8F7B → #2C6A58` ha davvero la stessa tinta (162,6°) e il bianco passa da 3,81:1 a 6,3:1.
- **Dialog nativo con focus gestito:** il focus va sul pulsante di chiusura e torna al pulsante Shortcuts con Esc. Il tablist si usa con le frecce, il Why? rimette il focus sul pulsante con Esc, e Undo inattivo usa `aria-disabled` con bordo tratteggiato.
- **Movimento ridotto rispettato** sia nell'involucro sia nei mockup. Nessuno scroll orizzontale a 390 px. Console pulita.
- **Dati d'esempio dichiarati:** citazione fittizia segnata nel mockup, elenco nel README.

## Verdetto

**Oggi no, ma ci è vicino.** Un designer senior metterebbe nel portfolio l'idea e la cura dell'involucro: tessera di prova, focus, rigore dei grigi. Non pubblicherebbe un generatore di contrasti che sbaglia proprio i contrasti: Why? con numeri presi da un'altra coppia (#1), stati che falliscono contro la specifica (#2), testo dell'involucro a 2,5:1 (#3) e un caso peggiore a 4,35:1 (#4). Lo stesso vale per i codici HEX muti al lettore di schermo (#8), in un progetto che si presenta come accessibile. Su mobile manca un vero progetto (#28). Corretti i 🔴 e #29-#30, il lavoro regge il confronto con una commissione.

## Correzioni applicate

**Data:** 12 novembre 2026. Le ha fatte Claude Code dopo questo rapporto, insieme a due richieste dell'autore: spiegare a parole cosa significano i rapporti ("4.6:1") e non far scorrere la pagina su desktop.

| # | Esito | Cosa è cambiato |
|---|-------|-----------------|
| 1 | Corretto | La correzione si calcola per la coppia aperta (stessa tinta, passo di luminosità più piccolo), con il suo rapporto. "Your locked" compare solo per i colori bloccati della coppia. Apply fix cambia il colore giusto |
| 2 | Corretto | I colori di stato si ricavano a 3:1 sia su Background sia su Surface. La palette in conflitto ora ha due soli colori bloccati in conflitto (Background e Primary): fallisce solo la loro coppia |
| 3 | Corretto | Nei colori della coppia restano solo "Aa" e il rapporto (≥ 24 px). Giudizio e coppia stanno in un'etichetta bianca a 16:1 |
| 4 | Corretto | Etichette delle fasce in #000 o #FFF (caso peggiore 4,58:1), senza opacità |
| 5 | Corretto | Nei mockup Accent, Primary e stati non colorano più testo piccolo: diventano bordi, punti, barre e sottolineature. Aggiunta la coppia "Status on Surface" (8 coppie) |
| 6 | Corretto | Why? aperto e riga aperta: riempimento scuro, 16:1 |
| 7 | Documentato | Il prototipo mescola in sRGB (nota in testa a `proto.js`); il generatore vero lavora in OKLCH, come dicono 02 e 04 |
| 8 | Corretto | Etichette con il codice: "Copy Primary color, #2C6A58", "Edit Primary color, #2C6A58" |
| 9 | Corretto | Codice HEX, tab, righe dei contrasti e link a 44 px: misurato, nessun controllo sotto 44 px a 1440 |
| 10 | Corretto | Etichetta fissa "Lock Primary" con `aria-pressed`; annuncio "Primary locked." / "Primary unlocked." |
| 11 | Corretto | "Why? Primary: On primary on Primary, 6.3:1" |
| 12 | Corretto | Tooltip vero su hover e focus, collegato con `aria-describedby` |
| 13 | Corretto | Errore con `role="alert"`; clic fuori applica un codice valido, annulla uno non valido |
| 14 | Corretto | Interruttore "Single-key shortcuts (Space, L, C, ?)" nel dialog, ricordato nel browser |
| 15 | Corretto | Le ultime due fasce aprono il Why? verso l'alto |
| 16 | Corretto | Il toast di errore resta finché non si chiude ("Dismiss") e il codice viene selezionato |
| 17 | Corretto | `scroll-padding-bottom: 96px` su mobile |
| 18 | Corretto | Il suggerimento Space è fuori dal pulsante; `aria-keyshortcuts` su Generate e Undo |
| 19 | Corretto | Una sola regione live per i toast |
| 20 | Superato | Il campione cliccabile non esiste più: si modifica con la matita nella pillola |
| 21 | Corretto | Tablist con Home ed End; pannelli con `tabindex="0"` |
| 22 | Corretto | Ordine approvato ripristinato: Generate, Undo e "or press Space" sotto la palette; contrasti prima dell'anteprima. 02 § 1 aggiornato |
| 23–26 | Corretti | Testi unificati tra prototipo, design system e 02, con valori calcolati; Why? per AA senza AAA |
| 27 | Rimandato allo sviluppo | Font in locale, come chiede il PRD |
| 28 | Corretto | Mobile: righe compatte da circa 92 px con esito in un'etichetta; i 5 colori stanno nel primo schermo (misurato a 390×844) |
| 29 | Corretto | Contrasti in cima alla colonna destra, con sintesi e righello; a 1440×900 tutta la pagina sta in una schermata (altezza misurata: 900 px) |
| 30 | Corretto | Text mostra la coppia più debole in cui Text è il primo piano |
| 31 | Corretto | Pulsante Edit (matita) nella pillola |
| 32 | Corretto | Tolto Copy dalla pillola: si copia dal codice |
| 33 | Corretto | Tooltip "Lock color (L)" |
| 34 | Corretto | Coppie dei componenti con la sigla UI ("Easy to spot"), senza AA/AAA |
| 35 | Corretto | Design system con fascia mobile, barre, toast "all locked" e "fix applied", righello e interruttore |
| 36 | Aperto | URL del repository da inserire prima della pubblicazione |
| Aspetto | Corretto | La pillola resta solo per le etichette di esito; pulsanti e controlli hanno raggio 10 px |

In più, su richiesta dell'autore:
- **Spiegazione dei numeri:** ogni tessera dice a parole cosa significa il rapporto ("Very easy to read", "Easy to read", "Easy to spot", "Hard to read"), e in cima ai contrasti un righello da 1:1 a 21:1 mostra dove cade ogni coppia, con una frase che spiega la scala.
- **Una schermata sola su desktop:** l'anteprima si ridimensiona per entrare nello spazio libero. Sotto i 760 px di altezza torna lo scroll.
- **Adattamento dei colori liberi nel prototipo:** dopo Generate con un colore bloccato, i colori non bloccati si adattano come farà il generatore. Così il prototipo non mostra coppie fallite che il prodotto non produrrebbe.
