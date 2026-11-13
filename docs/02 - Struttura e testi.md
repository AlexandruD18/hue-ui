# 02 - Struttura e testi

**Data:** 12 novembre 2026
**Stato:** bozza da approvare

Hue UI è una pagina sola. Questo documento descrive cosa c'è sulla pagina, in che ordine, come si comporta in ogni situazione e con quali parole. I testi dell'interfaccia sono in inglese, come deciso nel charter; le spiegazioni intorno sono in italiano.

## 1. Mappa della pagina

L'ordine segue il compito principale: guardo la palette, controllo che funzioni, me la porto via.

| # | Blocco | Cosa contiene | Perché sta lì |
|---|--------|---------------|---------------|
| 1 | Header | Logo "Hue UI", frase introduttiva, pulsanti Shortcuts e Share | Strumenti secondari, sempre raggiungibili ma fuori dal percorso principale |
| 2 | Palette | 5 fasce, una per ruolo: a tutta altezza su desktop, righe compatte su mobile | È il prodotto: arriva per prima, senza introduzioni |
| 3 | Azioni | Pulsante **Generate** (unica azione principale), Undo, suggerimento "or press Space" | Subito sotto la palette, dove l'occhio arriva dopo averla guardata |
| 4 | Contrasti | Sintesi ("All 8 pairs pass"), righello del contrasto con la spiegazione dei numeri, elenco delle 8 coppie | La differenza di Hue UI: sempre visibile, in cima alla colonna destra |
| 5 | Anteprima | Selettore Landing page / Mobile app e il mockup ricolorato, ridimensionato per entrare nello spazio libero | Risponde alla domanda "come viene davvero?" |
| 6 | Crediti | Autore, link al codice su GitHub, nota sul calcolo WCAG, in una riga in fondo alla colonna | Credibilità e contatti, senza disturbare |

**Una schermata sola su desktop** (decisione dell'autore, 12/11/2026): da 760 px di altezza in su la pagina non scorre. Fasce e azioni stanno a sinistra, contrasti e anteprima a destra. Sotto i 760 px di altezza torna lo scroll, perché l'anteprima diventerebbe illeggibile. Su mobile lo scroll resta, ma le righe compatte fanno stare i 5 colori nel primo schermo e Generate è fisso in basso.

Livelli sopra la pagina:
- **Why?**: pannello che si apre accanto alla scheda colore o alla coppia di contrasto.
- **Shortcuts**: finestra di dialogo con le scorciatoie.
- **Toast**: messaggi brevi in basso (copiato, link condiviso, errori).

## 2. Scheda colore

Ogni scheda rappresenta un ruolo. Contiene, dall'alto:

| Elemento | Esempio | Comportamento |
|----------|---------|---------------|
| Fascia di colore | area piena | Il colore è il protagonista. Nome e codice sono scritti in nero o bianco, quello con più contrasto, così restano leggibili anche quando una coppia fallisce |
| Nome del ruolo | `Primary` | Sempre visibile; spiega a cosa serve il colore senza bisogno di teoria |
| Codice HEX | `#3E5BD0` | Clic o C: copia negli appunti |
| Tessera di prova | `Aa 4.7:1` | "Aa" e il rapporto scritti con i colori della coppia più debole del ruolo; sotto, in un'etichetta bianca, il giudizio a parole e il nome della coppia |
| Pulsante Edit | matita | Apre il campo per scrivere un proprio colore (§ 12) |
| Pulsante Lock | lucchetto, tooltip "Lock color (L)" | Clic o L: il colore resta fisso alla prossima generazione |
| Pulsante Why? | `Why?` | Apre la spiegazione del contrasto per quel colore |

Regola dell'esito: ogni scheda mostra la coppia più debole tra quelle che coinvolgono il suo colore. Così basta uno sguardo per capire se qualcosa è al limite, e non serve leggere tutto l'elenco.

L'esito usa sempre testo e icona insieme, mai il solo colore (WCAG 1.4.1):

Per spiegare i numeri a chi non conosce le sigle, ogni esito ha un giudizio in parole semplici; la sigla resta piccola accanto.

| Giudizio | Sigla | Quando |
|----------|-------|--------|
| ✓ Very easy to read | AAA | Testo ≥ 7:1 |
| ✓ Easy to read | AA | Testo ≥ 4,5:1 |
| ✓ Easy to spot | UI | Pulsanti, icone, bordi e stati ≥ 3:1 |
| ✕ Hard to read / ✕ Hard to spot | Fails | Sotto la soglia. Solo con colori scritti dall'utente o arrivati da un link: il generatore non le produce mai |

Coppie per ruolo: Background mostra la più debole tra quelle su Background; Surface quella su Surface; Text la più debole in cui Text è il primo piano; Primary la più debole tra On primary e Primary on Background; Accent la sua su Background.

## 3. I ruoli

### Scelti dal generatore (visibili come schede)

| Ruolo | Nome nell'interfaccia | Uso nei mockup |
|-------|----------------------|----------------|
| Sfondo | Background | Fondo della pagina e dell'app |
| Superficie | Surface | Card, pannelli, barra di navigazione dell'app |
| Testo | Text | Titoli e testo principale |
| Primario | Primary | Pulsanti principali, link, elemento attivo |
| Accento | Accent | Evidenziazioni, badge, illustrazioni |

### Ricavati automaticamente (visibili nell'elenco dei contrasti, non come schede)

| Ruolo | Nome | Come si ricava |
|-------|------|----------------|
| Testo secondario | Muted text | Testo mescolato verso lo sfondo in OKLCH, fermandosi a 4,5:1 su sfondo e superficie |
| Testo sul primario | On primary | Il colore tra Background e Text che contrasta di più con Primary; se nessuno arriva a 4,5:1, bianco o quasi nero |
| Bordo | Border | Da Text verso Background, fermandosi a 3:1 sullo sfondo (bordi dei campi, WCAG 1.4.11) |
| Successo, avviso, errore | Success, Warning, Error | Tinte fisse (verde, ambra, rosso) con luminosità regolata a 3:1 sullo sfondo |

Perché i ruoli ricavati non sono schede: l'utente sceglie 5 colori, come in Coolors. Gli altri dipendono da quei 5 e, se fossero modificabili, ogni rigenerazione potrebbe romperli. Si vedono comunque nell'elenco dei contrasti e nei mockup.

## 4. Elenco dei contrasti

In cima alla colonna destra, in quest'ordine:

1. **Sintesi**: "All 8 pairs pass" oppure "1 of 8 pairs fail".
2. **Spiegazione dei numeri**: "A contrast ratio says how far apart two colors are: 1:1 is the same color, 21:1 is black on white. Text needs 4.5:1; buttons and icons need 3:1."
3. **Righello del contrasto**: barra da 1:1 a 21:1 in scala logaritmica, con le zone Fails, UI (3), AA (4.5) e AAA (7). Ogni coppia è un punto disegnato con i suoi due colori, così si vede dove cade.
4. **Elenco delle 8 coppie**: le 7 dell'analisi (§ 3 di `01 - Analisi.md`) più "Status on Surface", perché i chip di stato dell'app stanno sulla superficie. Ogni riga è un pulsante da 44 px che apre il suo Why?.

| Riga | Esempio |
|------|---------|
| Text on Background | `14.3:1 ✓ AAA` |
| Text on Surface | `15.8:1 ✓ AAA` |
| Muted text on Background | `4.6:1 ✓ AA` |
| On primary on Primary | `6.3:1 ✓ AA` |
| Primary on Background | `5.7:1 ✓ UI` |
| Accent on Background | `4.6:1 ✓ UI` |
| Status on Background | `4.8:1 ✓ UI` |
| Status on Surface | `5.3:1 ✓ UI` |

Nei mockup Accent, Primary e i colori di stato non colorano mai testo piccolo: diventano bordi, punti, barre e sottolineature, dove bastano 3:1. Il testo piccolo usa sempre Text o Muted text, verificati a 4,5:1.

## 5. Comportamenti e stati

| Situazione | Cosa succede | Testo |
|------------|--------------|-------|
| Prima visita | Una palette casuale è già pronta: nessuno schermo vuoto | Sotto il logo, una riga: "Random palettes for interfaces. Every color has a job, every pair is readable." |
| Generate | Cambiano i colori non bloccati; anteprima aggiornata entro 100 ms | Annuncio per lettori di schermo: "New palette generated." |
| Undo | Torna alla palette precedente (fino a 20 passi) | Annuncio: "Previous palette restored." |
| Nessuna palette precedente | Undo resta visibile ma inattivo (`aria-disabled`) | Al passaggio o al focus: "Nothing to undo yet." |
| Tutti e 5 i colori bloccati | Generate resta cliccabile ma non cambia nulla | Toast: "All colors are locked. Unlock one to generate." |
| Un colore corretto per il contrasto | Il generatore ha cambiato la luminosità prima di mostrare la palette | Nel Why?: "We darkened Primary a little, from #6C8CFF to #4F6FE6, so text on buttons stays readable." |
| Copia del codice | Codice negli appunti | Toast: "Copied #3E5BD0" |
| Copia non riuscita | Il browser blocca gli appunti | Toast di errore che resta finché non lo si chiude: "Couldn't copy. Select the code and press Ctrl+C." Il codice viene selezionato |
| Lock / unlock | Il colore resta fisso o torna libero | Nota sulla fascia: "Locked". Annuncio: "Primary locked." / "Primary unlocked." |
| Colore corretto | Nota sulla fascia | "Adjusted for contrast" |
| Apply fix | Il colore della coppia cambia con la correzione proposta | Toast: "Fix applied. Primary is now #7B90DB." |
| Colore scritto a mano | Il colore viene applicato e bloccato | Annuncio: "Primary set to #3E5BD0 and locked." |
| Share | Copia l'URL con la palette | Toast: "Link copied. Anyone with it sees this palette." |
| Link con palette valida | Apre quella palette | Nessun messaggio |
| Link non valido | Palette casuale al suo posto | Toast: "That link didn't contain a valid palette, so here's a fresh one." |
| Link con coppie che non passano | Mostra la palette così com'è, con l'esito `Fails` | Nel Why?: spiegazione e pulsante "Apply fix" |
| JavaScript disattivato | Messaggio statico | "Hue UI needs JavaScript to generate palettes." |
| Movimento ridotto (`prefers-reduced-motion`) | Nessuna transizione tra palette | — |

## 6. Scorciatoie da tastiera

| Tasto | Azione | Nota |
|-------|--------|------|
| Space | Generate | Solo se il focus non è su un pulsante, un link o un campo: lì Space mantiene il suo comportamento normale |
| Ctrl + Z | Undo | |
| L | Blocca o sblocca il colore con il focus | |
| C | Copia il codice del colore con il focus | |
| ? | Apre l'elenco delle scorciatoie | |
| Esc | Chiude Why? o Shortcuts | Il focus torna dove era prima |

Space, L, C e ? sono scorciatoie da un tasto solo: nel dialog Shortcuts un interruttore "Single-key shortcuts (Space, L, C, ?)" le spegne (WCAG 2.1.4). La scelta si ricorda nel browser. Su schermi touch il pulsante Shortcuts e il suggerimento "or press Space" non compaiono.

## 7. Pannello Why?

Tre forme, sempre brevi: cosa misura, se va bene, cosa fare.

I codici e i rapporti nei testi d'esempio di questo documento servono a mostrare la forma delle frasi. Nell'app e nei mockup di design saranno calcolati sui colori veri.

**Coppia che passa AAA**
> **Text on Background: 12.4:1**
> Body text needs at least 4.5:1 to pass WCAG AA, and 7:1 for AAA. This pair passes both, so it stays readable on bright screens and for people with low vision.

**Coppia che passa solo AA**
> **Muted text on Background: 4.6:1**
> Body text needs at least 4.5:1 to pass WCAG AA. This pair passes AA. It would need 7:1 for AAA.

**Colore corretto dal generatore**
> **Primary was adjusted**
> We darkened it a little, from #6C8CFF to #4F6FE6. White text on your buttons now reaches 4.7:1. The hue is the same; only the lightness changed.

**Coppia che non passa** (solo con colori scritti dall'utente o da un link)
> **Primary on Background: 2.2:1**
> Your locked Background and your locked Primary are too close: 2.2:1. Buttons and other controls need 3:1.
> **Fix:** darken Primary to #7B90DB (3.0:1). [Apply fix]

La correzione si calcola per la coppia aperta: stessa tinta, luminosità diversa, il passo più piccolo che la fa passare. Cambia il colore in primo piano, oppure lo sfondo se il primo piano è un ruolo ricavato. "Your locked" compare solo per i colori della coppia che sono davvero bloccati. Per il testo la seconda frase è "Text needs 4.5:1.".

**Soglia dei componenti**
> **Primary on Background: 4.1:1**
> Buttons and other controls need 3:1 against what surrounds them, so people can find them. This one passes.

## 8. Testi fissi dell'interfaccia

| Posizione | Testo |
|-----------|-------|
| `title` della pagina | Hue UI: random color palettes for interfaces |
| `meta description` | Generate color palettes where every color has a role and every text pair passes WCAG contrast. Preview them on a real landing page and mobile app. |
| Riga sotto il logo | Random palettes for interfaces. Every color has a job, every pair is readable. |
| Pulsante principale | Generate |
| Suggerimento accanto | or press Space |
| Titolo elenco contrasti | Contrast checks |
| Sintesi | All 8 pairs pass / 1 of 8 pairs fail |
| Spiegazione dei numeri | A contrast ratio says how far apart two colors are: 1:1 is the same color, 21:1 is black on white. Text needs 4.5:1; buttons and icons need 3:1. |
| Titolo anteprima | Preview |
| Selettore anteprima | Landing page · Mobile app |
| Lock (etichetta accessibile, fissa, con `aria-pressed`) | Lock Primary |
| Lock (tooltip) | Lock color (L) |
| Edit (etichetta accessibile) | Edit Primary color, #3E5BD0 |
| Copia (etichetta accessibile) | Copy Primary color, #3E5BD0 |
| Why? della fascia (etichetta accessibile) | Why? Primary: On primary on Primary, 6.3:1 |
| Campo HEX, suggerimento | Enter to apply, Esc to cancel |
| Note sulla fascia | Locked · Adjusted for contrast |
| Dialog | Keyboard shortcuts; Generate a new palette; Undo; Lock or unlock the focused color; Copy the focused color; Show this list; Close a panel; Single-key shortcuts (Space, L, C, ?) |
| Toast di errore, pulsante di chiusura | Dismiss |
| Crediti | Made by Alexandru Dimofte · Code on GitHub · Contrast follows the WCAG 2.1 formula. |

## 9. Linee guida di scrittura (inglese dell'interfaccia)

- **Breve e diretto**: frasi da massimo 20 parole; l'azione prima della spiegazione.
- **Parole semplici**: "readable" e non "compliant"; "darker" e non "lower luminance". I termini tecnici (WCAG, AA, ratio) compaiono solo accanto a una spiegazione semplice.
- **Seconda persona, tono amichevole e asciutto**: "your buttons", mai "the user's buttons". Niente punti esclamativi, niente battute.
- **Numeri sempre con un decimale e due punti**: `4.7:1`, mai `4.71:1` o `4,7`.
- **Errori**: cosa è successo e cosa fare, senza colpe. "Couldn't copy. Select the code and press Ctrl+C." e non "Error: clipboard access denied".

| Prima (da evitare) | Dopo |
|--------------------|------|
| Contrast ratio insufficient for WCAG 2.1 SC 1.4.3 | Button text needs 4.5:1. This one is 3.1:1. |
| Palette successfully generated! | New palette generated. (solo per lettori di schermo) |
| Invalid URL parameter | That link didn't contain a valid palette, so here's a fresh one. |

## 10. Glossario

| Termine | Significato in Hue UI |
|---------|----------------------|
| Role / ruolo | Il compito di un colore nell'interfaccia (Background, Text, Primary…) |
| Contrast ratio / rapporto di contrasto | Quanto due colori si distinguono, da 1:1 (identici) a 21:1 (nero su bianco), formula WCAG 2.1 |
| AA / AAA | Livelli WCAG: AA è il minimo richiesto, AAA il livello migliorato |
| Lock / blocco | Il colore resta fisso quando si genera una nuova palette |
| Adjusted / corretto | Il generatore ha cambiato la sola luminosità di un colore per far passare un contrasto |
| Derived role / ruolo ricavato | Colore calcolato a partire dai 5 scelti (Muted text, On primary, Border, stati) |

## 11. Contenuti dei mockup

Dati d'esempio inventati, da elencare anche in `design/README.md`. Un solo prodotto fittizio, **Plotline** (un'app per pianificare la settimana), così landing e app raccontano la stessa storia.

**Landing page**: barra di navigazione (Product, Pricing, Log in, pulsante "Start free"), titolo "Plan your week in ten minutes.", sottotitolo, pulsante primario e link secondario, tre card su superficie con funzioni, una citazione con badge in accento, footer. Usa Background, Surface, Text, Muted text, Primary, On primary, Accent, Border.

**App mobile (390 px)**: titolo "This week", elenco di attività con etichette di stato "Done" (Success), "Due today" (Warning), "Overdue" (Error), un campo "Add a task" con bordo, pulsante flottante primario, barra di navigazione in basso su superficie. Usa tutti i ruoli, stati compresi.

I mockup sono costruiti solo con le variabili CSS dei ruoli: nessun colore scritto a mano.

## 12. Inserire un proprio colore

Deciso dall'autore il 12/11/2026. Molti partono da un colore del brand già scelto: senza questa funzione Hue UI resterebbe un gioco.

| Passo | Cosa succede | Testo |
|-------|--------------|-------|
| 1 | Clic sul pulsante Edit (matita) della fascia | Al posto di nome e codice si apre un campo con il valore attuale selezionato |
| 2 | L'utente scrive un codice (`#3e5bd0`, `3E5BD0` o `#35d`) | Anteprima dal vivo sul campione mentre scrive |
| 3 | Invio o clic fuori con un codice valido | Il colore viene bloccato e gli altri colori non bloccati si adattano per rispettare i contrasti. Clic fuori con un codice non valido: come Esc |
| 4 | Esc | Annulla e torna al colore di prima |
| Errore | Il codice non è valido | Sotto il campo: "Use a hex code like #3E5BD0." Il campo resta aperto |
| Conflitto con un colore bloccato | Il colore scritto non passa con un altro colore bloccato (per esempio uno sfondo troppo vicino al Text bloccato). I colori non bloccati si adattano sempre: ogni colore raggiunge 4,5:1 con il nero o con il bianco | Si accetta comunque, con esito `Fails` e Why?: "Background and your locked Text are too close: 2.3:1. Fix: lighten Background to #F4F1EA (11.2:1)." [Apply fix] |

Etichetta accessibile del campo: "Primary color, hex code". Il campione ha come etichetta "Edit Primary color, #3E5BD0".

## 13. Undo

Aggiunto su proposta di Claude e approvato il 12/11/2026. Chi preme Generate per sbaglio non deve perdere una palette che gli piaceva (euristica di Nielsen: controllo e libertà dell'utente). La cronologia tiene 20 palette e si azzera ricaricando la pagina.

## 14. Versione italiana

Decisa dall'autore il 13/11/2026. L'interfaccia esiste in inglese e in italiano; i testi italiani non sono una traduzione parola per parola, ma la stessa cosa detta come la direbbe una persona italiana.

**Come si sceglie la lingua.** Prima il parametro `?lang=` del link, poi la lingua del browser (italiano se inizia con `it`), altrimenti inglese. Nei crediti, in basso, un selettore `EN · IT`: la lingua attiva ha `aria-current="true"`, ogni voce ha il suo `lang` ("English", "Italiano") e un'etichetta accessibile "Language" / "Lingua".

**Regole.**
- I rapporti usano la virgola in italiano: `4,6:1`. I codici HEX e le sigle AA, AAA, UI non cambiano.
- I nomi dei ruoli si traducono, perché sono la prima cosa che un principiante legge: Background → Sfondo, Surface → Superficie, Text → Testo, Primary → Primario, Accent → Accento, Muted text → Testo secondario, On primary → Testo sul primario, Status → Stati.
- Le scorciatoie restano L e C anche in italiano: cambiarle romperebbe l'abitudine di chi passa da una lingua all'altra.
- I mockup Plotline restano in inglese: sono il sito di qualcun altro, non l'interfaccia di Hue UI.
- Tono: seconda persona singolare, frasi brevi, niente punti esclamativi. Come in inglese.

| Posizione | English | Italiano |
|-----------|---------|----------|
| `title` | Hue UI: random color palettes for interfaces | Hue UI: palette di colori casuali per interfacce |
| `meta description` | Generate color palettes where every color has a role and every text pair passes WCAG contrast. Preview them on a real landing page and mobile app. | Genera palette in cui ogni colore ha un ruolo e ogni coppia di testo supera il contrasto WCAG. Guardale subito su una landing page e su un'app mobile. |
| Frase sotto il logo | Random palettes for interfaces. Every color has a job, every pair is readable. | Palette casuali per interfacce. Ogni colore ha un compito, ogni coppia si legge. |
| Pulsante principale | Generate | Genera |
| Suggerimento | or press Space | oppure premi Spazio |
| Undo / Share / Shortcuts | Undo · Share · Shortcuts | Annulla · Condividi · Scorciatoie |
| Undo inattivo | Nothing to undo yet. | Ancora niente da annullare. |
| Lock (etichetta, tooltip) | Lock Primary · Lock color (L) | Blocca Primario · Blocca il colore (L) |
| Edit / Copia | Edit Primary color, #3E5BD0 · Copy Primary color, #3E5BD0 | Modifica il colore Primario, #3E5BD0 · Copia il colore Primario, #3E5BD0 |
| Why? | Why? | Perché? |
| Note sulla fascia | Locked · Adjusted for contrast | Bloccato · Corretto per il contrasto |
| Giudizi | Very easy to read · Easy to read · Easy to spot · Hard to read · Hard to spot | Si legge benissimo · Si legge bene · Si vede bene · Si legge male · Si vede male |
| Sigla per "non passa" | Fails | Non passa |
| Titolo contrasti | Contrast checks | Controllo dei contrasti |
| Sintesi | All 8 pairs pass · 1 of 8 pairs fail · 2 of 8 pairs fail | Tutte le 8 coppie passano · 1 coppia su 8 non passa · 2 coppie su 8 non passano |
| Spiegazione dei numeri | A contrast ratio says how far apart two colors are: 1:1 is the same color, 21:1 is black on white. Text needs 4.5:1; buttons and icons need 3:1. | Il rapporto di contrasto dice quanto due colori sono lontani: 1:1 è lo stesso colore, 21:1 è nero su bianco. Il testo chiede 4,5:1; pulsanti e icone 3:1. |
| Coppie | Text on Background · Muted text on Background · On primary on Primary… | Testo su Sfondo · Testo secondario su Sfondo · Testo sul primario su Primario… |
| Anteprima | Preview · Landing page · Mobile app | Anteprima · Landing page · App mobile |
| Campo HEX | Primary color, hex code · Enter to apply, Esc to cancel · Use a hex code like #3E5BD0. | Colore Primario, codice esadecimale · Invio per applicare, Esc per annullare · Usa un codice esadecimale come #3E5BD0. |
| Toast | Copied #3E5BD0 · Link copied. Anyone with it sees this palette. · All colors are locked. Unlock one to generate. · Fix applied. Primary is now #7B90DB. | Copiato #3E5BD0 · Link copiato. Chi lo apre vede questa palette. · Tutti i colori sono bloccati. Sbloccane uno per generare. · Correzione applicata. Ora Primario è #7B90DB. |
| Toast di errore | Couldn't copy. Select the code and press Ctrl+C. · Dismiss | Copia non riuscita. Seleziona il codice e premi Ctrl+C. · Chiudi |
| Link non valido | That link didn't contain a valid palette, so here's a fresh one. | Il link non conteneva una palette valida: eccone una nuova. |
| Annunci (lettori di schermo) | New palette generated. · Previous palette restored. · Primary locked. / unlocked. · Primary set to #3E5BD0 and locked. | Nuova palette generata. · Palette precedente ripristinata. · Primario bloccato. / sbloccato. · Primario impostato a #3E5BD0 e bloccato. |
| Dialog | Keyboard shortcuts · Generate a new palette · Undo · Lock or unlock the focused color · Copy the focused color · Show this list · Close a panel · Single-key shortcuts (Space, L, C, ?) | Scorciatoie da tastiera · Genera una nuova palette · Annulla · Blocca o sblocca il colore selezionato · Copia il colore selezionato · Mostra questo elenco · Chiudi un pannello · Scorciatoie a un tasto (Spazio, L, C, ?) |
| JavaScript disattivato | Hue UI needs JavaScript to generate palettes. | Hue UI ha bisogno di JavaScript per generare le palette. |
| Crediti | Made by Alexandru Dimofte · Code on GitHub · Contrast follows the WCAG 2.1 formula. | Fatto da Alexandru Dimofte · Codice su GitHub · Il contrasto segue la formula WCAG 2.1. |

**Pannello Perché?**

| Forma | Italiano |
|-------|----------|
| Passa AAA | Il testo normale chiede almeno 4,5:1 per il livello AA delle WCAG e 7:1 per l'AAA. Questa coppia li supera entrambi: si legge anche al sole e da chi vede poco. |
| Passa solo AA | Il testo normale chiede almeno 4,5:1 per il livello AA delle WCAG. Questa coppia lo supera. Per l'AAA servirebbe 7:1. |
| Componenti | Pulsanti e altri controlli chiedono 3:1 rispetto a ciò che li circonda, così si trovano a colpo d'occhio. Questo lo supera. |
| Colore corretto | **Primario corretto.** L'abbiamo scurito un po', da #4A8F7B a #2C6A58. Ora il testo bianco sui pulsanti arriva a 6,3:1. La tinta è la stessa; cambia solo la luminosità. |
| Non passa | Il tuo Sfondo bloccato e il tuo Primario bloccato sono troppo vicini: 2,2:1. Pulsanti e altri controlli chiedono 3:1. **Correzione:** scurisci Primario fino a #7B90DB (3,0:1). [Applica correzione] |

