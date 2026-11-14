# Controllo visivo: Hue UI 1.0

**Data:** 14/11/2026
**Revisore:** agente separato, senza contatto con lo sviluppo
**Esito:** non pronto, per un solo problema bloccante (#1). Il resto si chiude con correzioni piccole.

## Ambito

Controllo prima della release della build di produzione: layout, flussi, stati, testi in inglese e in italiano, focus e console. Documenti di riferimento: `design/brief.md`, `docs/02 - Struttura e testi.md`, `design/critica.md`.

Non sono stati controllati: prestazioni, Lighthouse, lettori di schermo reali (l'albero di accessibilità sì, la voce no), browser diversi da Chrome.

## Ambiente

- Build servita da `vite preview` su `http://localhost:4173/hue-ui/`, branch `feat/sprint3-rifinitura` (commit `f70dce0`).
- Chrome con Chrome DevTools MCP, contesto isolato pulito (nessun `localStorage` precedente).
- Viewport: 1440×900 (desktop, mouse) e 390×844 a 3x (mobile, touch).
- Lingue: `?lang=en` e `?lang=it`, più il selettore nell'header.
- Palette usate: il link condiviso `f7f4ee-ece6dc-1c1b1a-3e5bd0-c2410c`, un link con 5 coppie che non passano (`f7f4ee-ece6dc-8a8680-e0d8c8-f0c0a0`), una palette blu con Background bloccato a mano e 14 palette generate a caso, misurate con uno script.
- Catture in `C:\Users\alexa\AppData\Local\Temp\claude\c9eb9726c6978536\bc042916-8156-442c-9d5f-3c4e2fb00726\scratchpad\qa\` (fuori dal progetto, temporanee).

## Problemi

Gravità: **bloccante** = da correggere prima della release; **grave** = rompe un flusso o un requisito, ma si può aggirare; **minore** = attrito o testo sbagliato; **cosmetico** = solo aspetto.

| # | Gravità | Dove | Come riprodurlo | Correzione proposta |
|---|---------|------|-----------------|---------------------|
| 1 | bloccante | Inserire un proprio colore: adattamento dei colori non bloccati | Aprire `?p=f7f4ee-ece6dc-1c1b1a-3e5bd0-c2410c&lang=en`, matita su Accent, scrivere `F0C0A0`, Invio. Background passa da `#F7F4EE` a `#726F6A` e Surface a `#7E7B76`, entrambi segnati "Adjusted for contrast". Text resta `#1C1B1A`: Text on Background 3.4:1, Text on Surface 4.0:1, Muted 3.4:1. Risultato: "3 of 8 pairs fail". Nessuno di questi colori era bloccato. Stesso esito su mobile e in italiano (cattura `37-edit-accent-breaks-desk.png`). Dal link con 5 coppie che falliscono basta aprire la matita su Accento e premere Invio senza cambiare nulla: Sfondo, Superficie e Testo diventano tre grigi vicini (1,1:1) | L'adattamento dopo la modifica a mano deve passare dallo stesso controllo del generatore: dopo aver spostato Background per far passare Accent, ricalcolare Text, Muted e On primary (bianco o quasi nero) e verificare tutte le 8 coppie prima di mostrare la palette. Con Generate, a parità di colore bloccato, le palette passano tutte (provato 8 volte): il problema sta solo in questo percorso. La nota "Adjusted for contrast" non deve comparire su un colore che lascia coppie fallite. Aggiungere un test con Accent chiaro su sfondo chiaro |
| 2 | grave | Apply fix, focus | Link `?p=f7f4ee-ece6dc-8a8680-e0d8c8-f0c0a0&lang=en`, Tab fino a "Why?" di Primary, Invio, Tab su "Apply fix", Invio. Il pannello si chiude e il focus finisce sul `body`: chi usa la tastiera riparte dall'inizio della pagina | Dopo Apply fix rimettere il focus sul pulsante Why? che ha aperto il pannello, come già succede con Esc |
| 3 | minore | Apply fix, colori non bloccati | Stesso link del #2: Apply fix su Primary cambia anche Text (`#8A8680` diventa `#6B6762`) e Accent (`#F0C0A0` diventa `#B08365`), ma il toast dice solo "Fix applied. Primary is now #948D7E." | Annunciare anche gli altri cambi ("Text and Accent adapted too"), oppure applicare la correzione senza toccare gli altri colori |
| 4 | minore | Sintesi dei contrasti, inglese | Qualunque palette con una sola coppia che fallisce (per esempio Background bloccato a `#3355DD`): compare "1 of 8 pair fails". Il testo approvato in 02 § 8 è "1 of 8 pairs fail". L'italiano è giusto ("1 coppia su 8 non passa") | Correggere la stringa singolare inglese |
| 5 | minore | Nome della coppia di stato, inglese | Sulla tessera di Surface e nel titolo del Why? si legge "Status colors on Surface" (o "on Background"); nell'elenco la stessa riga si chiama "Status on Surface". In italiano è sempre "Stati" | Un solo nome. 02 § 4 usa "Status on Surface" |
| 6 | minore | Righello del contrasto, desktop e mobile | Con 3-4 coppie vicine i punti si impilano verso l'alto e coprono la frase sopra. Link condiviso a 1440: il punto più alto copre "3:1". In italiano copre "icone". A 390 la pila copre "3:1" | Riservare l'altezza massima della pila sopra il righello, oppure allargare i punti di lato invece di impilarli |
| 7 | minore | Suggerimento "or press Space" | Spegnere "Single-key shortcuts" nel dialog: Space non genera più (giusto), ma accanto a Generate resta "or press Space" | Nascondere il suggerimento quando le scorciatoie a un tasto sono spente |
| 8 | minore | Undo, nome accessibile | Il tooltip `#tip-undo` sta dentro il pulsante: il nome accessibile è sempre "Undo Nothing to undo yet.", anche quando Undo è attivo | Portare il tooltip fuori dal `<button>` e collegarlo con `aria-describedby` solo quando `aria-disabled="true"` |
| 9 | minore | Why? su mobile | A 390×844, "Why?" sulla fascia Accent apre il pannello in linea: il fondo (da 763 a 814 px) resta sotto la barra fissa. Con una coppia che fallisce, "Apply fix" non si vede finché non si scorre | Dopo l'apertura, `scrollIntoView({block: "nearest"})` sul pannello. `scroll-padding-bottom` c'è già e lo terrebbe sopra la barra |
| 10 | minore | Toast di errore | Con gli appunti bloccati: un clic sul codice HEX mostra "Couldn't copy. Select the code and press Ctrl+C.", che deve restare finché non lo si chiude. Un clic su Share subito dopo lo sostituisce con "Couldn't copy the link…" e l'istruzione sparisce | Impilare i toast di errore, oppure non sostituire un errore aperto con un altro messaggio |
| 11 | minore | Selettore della lingua | Il punto separatore entra nel nome del secondo pulsante: "· Italiano" | `aria-hidden="true"` sul separatore, o separatore in CSS |
| 12 | cosmetico | Anteprima App mobile, desktop | A 1440×900 il telefono è largo circa 160 px e i testi dell'app sono di 5-6 px, illeggibili. È il prezzo della pagina senza scroll, ma il brief chiede di "vederla su un'interfaccia vera" | Valutare un pulsante per ingrandire l'anteprima, oppure una scala minima sotto la quale la colonna scorre |
| 13 | cosmetico | Modifica HEX, anteprima dal vivo | Mentre si scrive, la fascia cambia colore ma la tessera "Aa" e l'elenco restano sulla palette di prima: per un attimo si vedono due stati diversi | Aggiornare anche la tessera durante l'anteprima, oppure attenuarla finché il valore non viene applicato |
| 14 | cosmetico | Fascia con nota | Con "Locked" o "Adjusted for contrast" nome e codice salgono di 9-10 px rispetto alle fasce senza nota: le righe delle 5 fasce non sono più allineate | Riservare sempre lo spazio della nota, o allineare il blocco in alto |
| 15 | cosmetico | Focus sul codice HEX, desktop | L'anello di focus del codice copre la parte bassa del nome del ruolo ("Background") | Aumentare di 4 px lo spazio tra nome e codice, o ridurre `outline-offset` |
| 16 | cosmetico | Toast, desktop | Il toast è centrato sulla pagina e passa sopra il confine delle due colonne, coprendo in parte i crediti ("…imofte") | Centrarlo sotto la colonna delle fasce, o alzarlo sopra i crediti |
| 17 | cosmetico | Crediti su mobile | A 390 px le due righe dei crediti hanno circa 30 px di spazio vuoto tra loro: sembra un errore di margine più che una scelta | Ridurre il `gap` della riga che va a capo |
| 18 | cosmetico | Barra in basso su mobile | Undo e Share sono solo icone. Il link come icona di "condividi" non è ovvio per un principiante | Etichetta corta sotto le icone, o almeno un `title`. I nomi accessibili ci sono già |

## Cosa funziona

- **Layout desktop**: a 1440×900 la pagina misura esattamente 900 px, senza scroll verticale né orizzontale, in inglese e in italiano, anche con le note "Locked" su tutte le fasce e con il Why? aperto. Il Why? delle ultime fasce si apre verso l'alto e resta nello schermo.
- **Layout mobile**: a 390×844 nessuno scroll orizzontale (`scrollWidth` 390). Le 5 fasce vanno da 107 a 581 px, tutte nel primo schermo. La barra in basso (da 763 px) non copre i crediti a fine pagina (finiscono a 732 px). Il pulsante Shortcuts e "or press Space" non compaiono su touch, come chiede 02 § 6.
- **Generate**: con il pulsante e con Space a focus libero. L'URL si aggiorna con `replaceState`, quindi la cronologia del browser non si riempie (`history.length` resta 2). Annuncio "New palette generated."
- **Undo**: Ctrl+Z e il pulsante tornano indietro di un passo, con l'annuncio "Previous palette restored.". Da inattivo mostra il tooltip "Nothing to undo yet." al passaggio del mouse.
- **Lock**: clic, tasto L con il focus sul pulsante, nota "Locked", annuncio "Text locked.". Il colore resta fermo alla generazione successiva. Cambiare lingua non perde blocchi né cronologia.
- **Tutti bloccati**: Generate mostra "All colors are locked. Unlock one to generate." e non cambia nulla.
- **Campo HEX**: un valore non valido mostra "Use a hex code like #3E5BD0." collegato con `aria-describedby`, e il campo resta aperto. `#35d` viene accettato, espanso a `#3355DD`, bloccato e annunciato. Il focus torna sulla matita.
- **Copia e Share**: "Copied #151416" (anche con il tasto C) e "Link copied. Anyone with it sees this palette.". Con gli appunti bloccati compaiono i toast di errore con "Dismiss", e il codice viene selezionato come previsto.
- **Why? e Apply fix**: testi conformi a 02 § 7 in entrambe le lingue, con valori calcolati. La correzione proposta ha la stessa tinta, cambia solo la luminosità e porta la coppia a 3.0:1. "Your locked" compare solo quando i colori sono bloccati davvero. Esc chiude e rimette il focus sul pulsante.
- **Dialog Shortcuts**: si apre con `?`, chiude con Esc. L'interruttore spegne davvero Space e `?` ed è salvato in `localStorage` (`hue-single-keys`).
- **Link**: `?p=nope` apre una palette nuova con "That link didn't contain a valid palette, so here's a fresh one.". Il link condiviso apre esattamente quei 5 colori. Un link con coppie che falliscono le mostra così come sono, con "Fails" e Apply fix.
- **Lingua**: `lang`, `title` e `meta description` cambiano con la lingua. Il pulsante attivo ha `aria-current`, ogni voce ha il suo `lang`. Testi italiani controllati su fasce, giudizi, sintesi (singolare e plurale), dialog, Why?, toast e annunci: corrispondono a 02 § 14. Nessun testo italiano tagliato: le righe lunghe ("Testo secondario su Sfondo", "Testo sul primario su Primario") vanno a capo dentro i 44 px della riga.
- **Leggibilità delle palette casuali**: su 14 generazioni misurate con uno script nessuna etichetta delle fasce scende sotto 4,5:1 (nero o bianco), nessuna tessera sotto 3:1, nessuna sovrapposizione tra nome, tessera e pulsanti, nessun testo che esce dal suo contenitore.
- **Target e focus**: tutti i controlli visibili misurano almeno 44 px di altezza. Il focus a doppio anello si vede su fasce chiare e scure.
- **Console**: nessun errore e nessun avviso in tutta la sessione.

## Verdetto

**Non pronto.** Il motivo è uno solo, ma tocca la promessa del prodotto: quando qualcuno inserisce il proprio colore, Hue UI può produrre da solo coppie illeggibili e segnarle come "Adjusted for contrast" (#1). È il compito n. 6 del brief e succede con un colore comunissimo, un pesca chiaro come accento. Corretto il #1, la release è pronta con correzioni: il #2 (focus perso dopo Apply fix) va chiuso nello stesso giro, i minori #3-#11 sono piccoli e si possono fare insieme. I cosmetici possono aspettare la 1.0.1.

## Correzioni (14/11/2026, branch `fix/rifinitura-1.0`)

| # | Esito | Cosa è cambiato |
| --- | --- | --- |
| 1 | corretto | `solve()` sposta sfondo e superficie solo verso luminosità che lasciano posto a un testo leggibile su entrambi. Quando un colore deve cambiare lato va su un fondo vero (scuro o quasi bianco) e il testo diventa quasi bianco o quasi nero, invece di fermarsi su un grigio al limite. Nuovo test a proprietà: 3000 palette casuali con un ruolo fissato, tutti i vincoli passano. Il caso del rapporto ora dà `#1C1A16`, `#1E1A13`, `#EFEEED`, testo a 14,9:1, 8 coppie su 8 |
| 2 | corretto | Dopo Apply fix il focus torna al pulsante Why? che ha aperto il pannello. Test di componente |
| 3 | corretto | Se la correzione sposta altri colori, il toast lo dice: "Other colors moved too, so every pair stays readable." |
| 4 | corretto | "1 of 8 pairs fails" |
| 5 | corretto | Un solo nome, "Status colors", nella tessera, nel Why? e nell'elenco |
| 6 | corretto | Quando la pila dei punti supera due righe, il righello scende e fa posto |
| 7 | corretto | "or press Space" sparisce con le scorciatoie a un tasto spente |
| 8 | corretto | Il tooltip esce dal nome accessibile (`aria-hidden`) e c'è solo quando Undo non è disponibile |
| 9 | corretto | Il pannello Why? si porta in vista all'apertura |
| 10 | rimandato a 1.0.1 | Coda dei toast di errore |
| 11 | corretto | Il separatore è un elemento `aria-hidden` fuori dal pulsante |
| 12-18 | rimandati a 1.0.1 | Cosmetici |
