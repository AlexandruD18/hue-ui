# O2: cognitive walkthrough e valutazione euristica (v1.0)

Data: 14/11/2026
Obiettivo verificato: O2, "Un principiante crea una palette utilizzabile senza aiuto" (`docs/00 - Charter.md`).
Criteri di successo: 0 problemi gravi; compito "genera, blocca il primario, verifica i contrasti" in al massimo 3 clic.
Valutatore: agente separato, che non ha costruito il prodotto.
Build provata: `http://localhost:4173/hue-ui/` (anteprima della build di produzione, branch `feat/sprint3-rifinitura`).

## Metodo e limiti

Ho usato due metodi, come prevede il charter.

1. **Cognitive walkthrough** del compito, passo per passo, rispondendo per ogni passo alle quattro domande classiche:
    - l'utente cercherà di ottenere l'effetto giusto?
    - si accorgerà che l'azione giusta è disponibile?
    - collegherà l'azione all'effetto che vuole?
    - vedrà che sta andando avanti, dopo l'azione?
2. **Valutazione euristica** con le 10 euristiche di Nielsen, con gravità da 0 a 4:
    - 0: non è un problema di usabilità;
    - 1: solo estetico, da sistemare se avanza tempo;
    - 2: minore, bassa priorità;
    - 3: grave, alta priorità (quello che il criterio di O2 chiama "problema grave");
    - 4: catastrofico, da sistemare prima del rilascio.

Il compito è stato eseguito davvero nel browser (Chrome tramite DevTools), non letto sul codice:

- desktop 1440×900, in inglese, con mouse;
- mobile 390×844 con tocco, in inglese;
- di nuovo in italiano (`?lang=it`), sia a 1440 sia a 390 px, più in breve.

Ho provato anche due situazioni fuori dal percorso ideale: una palette con contrasti insufficienti (caricata da link) e l'uso della barra spaziatrice dopo aver bloccato un colore.

**Limiti.** Non ci sono state persone vere. Il walkthrough simula il ragionamento di una persona, ma lo fa un valutatore che conosce già il gergo (WCAG, AA, token "on primary"), quindi tende a sottostimare la confusione sui termini. Le gravità sono un giudizio di un solo valutatore: Nielsen consiglia da 3 a 5 valutatori, perché uno solo trova in media circa un terzo dei problemi. Non ho misurato tempi né errori reali. Questo rapporto dice se il prodotto è ragionevolmente pronto per un principiante, non lo dimostra.

## Persona

**Giulia, 21 anni, studentessa di design della comunicazione.** Sa cos'è una palette, ha usato Coolors e i campioni di Figma. Non sa cosa sia un rapporto di contrasto né cosa vogliano dire AA e AAA; ha sentito parlare di accessibilità ma non l'ha mai misurata. Deve preparare una landing page per un esame e vuole un primario che le piaccia e la certezza che i testi si leggano. Usa il portatile in aula e il telefono sul treno. Legge l'inglese senza problemi, ma preferisce l'italiano.

## Compito

> Genera una palette nuova, blocca il colore primario che ti piace, poi verifica che i contrasti vadano bene.

Esito atteso: palette generata, primario bloccato (resta fermo alle generazioni successive), Giulia sa dire se le coppie di colori si leggono.

## Walkthrough passo per passo

### Desktop 1440×900 (inglese)

| Passo | Azione | Cercherà l'effetto giusto? | Vede l'azione? | Collega azione ed effetto? | Vede il progresso? | Clic |
|---|---|---|---|---|---|---|
| 0 | Arriva sulla pagina | Sì. Il sottotitolo "Random palettes for interfaces. Every color has a job, every pair is readable." dice subito cosa fa lo strumento. | Una palette è già pronta: niente schermata vuota. | n/a | n/a | 0 |
| 1 | Genera | Sì, è il motivo per cui è lì. | Sì. "Generate" è l'unico pulsante pieno, in basso a sinistra, con l'icona di aggiornamento e il suggerimento "or press Space". | Sì: verbo esplicito. | Sì. Tutte e cinque le fasce cambiano colore, l'anteprima si aggiorna, "Undo" si attiva, un messaggio per lettori di schermo dice "New palette generated." | 1 |
| 2 | Blocca il primario | Sì, il compito lo chiede. Senza il compito, l'idea di bloccare arriverebbe solo da chi conosce Coolors. | Abbastanza. Ogni fascia ha un gruppo di tre comandi: matita, lucchetto aperto, "Why?". Il lucchetto non ha etichetta visibile; al passaggio del mouse compare il tooltip nativo "Lock color (L)" dopo circa un secondo. | Sì: il lucchetto aperto è un'icona molto riconosciuta. | Sì, chiaramente. Il pulsante diventa scuro, il lucchetto si chiude, sotto il codice esadecimale appare "Locked" con l'icona. Generando di nuovo, il primario resta uguale e gli altri colori cambiano. | 1 |
| 3 | Verifica i contrasti | Sì. | Sì, senza clic. Il pannello "Contrast checks" è sempre visibile a destra, con l'esito in alto ("All 8 pairs pass"), una frase che spiega cosa è un rapporto, una scala da 1:1 a 21:1 e otto righe con coppia, valore ed esito. Ogni fascia mostra anche il suo valore con "Easy to read" o "Easy to spot". | Sì. L'esito è scritto in parole ("All 8 pairs pass", "Easy to read") e non solo in numeri. | Sì. L'esito si ricalcola a ogni generazione. | 0 |
| 3b | (facoltativo) Chiede "Why?" sul primario | Probabile: Giulia vuole capire cosa vuol dire 4.7:1. | Sì, "Why?" è scritto per esteso. | Sì. | Sì. Si apre un pannello: "Body text needs at least 4.5:1 to pass WCAG AA, and 7:1 for AAA. This pair passes both, so it stays readable on bright screens and for people with low vision." | (1) |

**Totale: 2 clic** per il compito, 3 se Giulia apre una spiegazione.

### Mobile 390×844 (inglese, tocco)

| Passo | Azione | Cercherà l'effetto giusto? | Vede l'azione? | Collega azione ed effetto? | Vede il progresso? | Tocchi |
|---|---|---|---|---|---|---|
| 1 | Genera | Sì. | Sì. "Generate" sta nella barra fissa in basso, al centro, sotto il pollice, tra "Undo" e "Share" (solo icone). | Sì. | Sì, le fasce cambiano. | 1 |
| 2 | Blocca il primario | Sì. | Sì, ma il lucchetto è solo un'icona e sul touch non c'è tooltip. Si affida del tutto al riconoscimento del simbolo. | Sì, il lucchetto è un simbolo diffuso. | Sì: pulsante scuro e "Locked" sotto il codice. | 1 |
| 3 | Verifica i contrasti | Sì. | In parte. Ogni fascia mostra un chip "4.6:1 Easy to read", ma senza dire rispetto a quale colore. Il pannello "Contrast checks" con l'esito complessivo si vede solo scorrendo: nel primo schermo se ne intravede il titolo. | Sì, una volta raggiunto il pannello. | Sì: "All 8 pairs pass". | 0 (uno scorrimento) |

**Totale: 2 tocchi** più uno scorrimento.

### Italiano (desktop e mobile)

Stesso percorso, stessi conteggi: "Genera", lucchetto "Blocca il colore (L)", "Bloccato", "Perché?", "Tutte le 8 coppie passano". I testi sono italiani veri, non tradotti parola per parola ("Si legge bene", "Si vede bene", "Il testo chiede 4,5:1; pulsanti e icone 3:1"), e i numeri usano la virgola decimale. Due stonature: l'etichetta "Testo sul primario su Primario" e i testi dell'anteprima (landing "Plotline") che restano in inglese.

### Situazioni fuori dal percorso

- **Palette con contrasti insufficienti** (caricata da link): l'esito diventa rosso, "5 of 8 pairs fail", le righe che non passano hanno una barra rossa e "Fails", le fasce dicono "Hard to read" o "Hard to spot". Aprendo "Why?" sul primario: "Background and Primary are too close: 1.2:1. Buttons and other controls need 3:1. Fix: darken Primary to #A19600 (3.0:1)." con il pulsante "Apply fix". Per una principiante è il punto più forte del prodotto: dice cosa non va, perché, e lo sistema con un tocco.
- **Barra spaziatrice dopo il blocco**: vedi problema P1.

## Conteggio dei clic

| Contesto | Genera | Blocca | Verifica | Totale | Criterio (≤ 3) |
|---|---|---|---|---|---|
| Desktop EN | 1 | 1 | 0 | **2** | rispettato |
| Mobile EN | 1 | 1 | 0 (scorrimento) | **2** | rispettato |
| Desktop e mobile IT | 1 | 1 | 0 | **2** | rispettato |

Con la spiegazione facoltativa ("Why?") si arriva a 3, sempre entro il limite.

## La spiegazione dei rapporti è comprensibile?

Per la persona, sì, con due riserve.

Cosa funziona:

- la frase sopra la scala dà due ancore concrete: "1:1 is the same color, 21:1 is black on white". Con quelle Giulia capisce che più alto è meglio e dove sta un valore come 4.6:1;
- la stessa frase dà le due soglie che le servono davvero: 4.5:1 per il testo, 3:1 per pulsanti e icone;
- ogni numero è accompagnato da un giudizio in parole ("Easy to read", "Very easy to read", "Hard to spot"), quindi Giulia non deve interpretare il numero per sapere se va bene;
- il pannello "Why?" spiega con parole normali e cita persone reali ("people with low vision", "so people can find them").

Riserve:

- le sigle **AA**, **AAA** e soprattutto **UI** compaiono come etichette senza spiegazione: AA e AAA vengono chiarite solo nel pannello "Why?", e "UI" vuol dire "soglia per componenti grafici" solo per chi lo sa già (P5);
- "Easy to read" su 4.6:1 e "Very easy to read" su 8:1 vanno bene, ma Giulia non capisce che 4.6:1 è appena sopra la soglia e che un colore poco più chiaro farebbe fallire la coppia. È una sfumatura, non un errore.

## Valutazione euristica (Nielsen)

| # | Euristica | Cosa ho visto | Gravità peggiore |
|---|---|---|---|
| 1 | Visibilità dello stato del sistema | Ogni azione ha un riscontro immediato: fasce che cambiano, "Locked", "Undo" che si attiva, esito che si ricalcola, messaggi nella regione live. Il tooltip del lucchetto resta "Lock color" anche quando il colore è già bloccato (P8). | 1 |
| 2 | Corrispondenza con il mondo reale | Testi in parole semplici e soglie spiegate. Ma "On primary on Primary" / "Testo sul primario su Primario" è gergo da design token e si legge come un errore di battitura (P3); AA, AAA e UI non sono spiegate (P5); in italiano l'anteprima resta in inglese (P9). | 2 |
| 3 | Controllo e libertà | Annulla con `Ctrl+Z` e pulsante, sblocco con un clic, "Apply fix" reversibile. La barra spaziatrice suggerita come scorciatoia però agisce sul pulsante che ha il focus (P1). | 2 |
| 4 | Coerenza e standard | Lucchetto, matita e copia sono simboli standard e coerenti tra le fasce. Il valore mostrato su ogni fascia è la coppia "più debole" di quel colore, quindi cambia coppia da una palette all'altra e lo stesso colore ha due numeri diversi tra fascia e pannello (P6). | 1 |
| 5 | Prevenzione degli errori | Il generatore produce solo palette che passano e lo dichiara ("Adjusted for contrast" quando corregge). L'unico errore facile è quello della barra spaziatrice (P1). | 2 |
| 6 | Riconoscere invece di ricordare | Le azioni principali sono visibili, ma il lucchetto non ha etichetta visibile (P2) e su mobile il chip della fascia non dice a quale coppia si riferisce il numero (P4). | 2 |
| 7 | Flessibilità ed efficienza | Scorciatoie (`Space`, `L`, `Ctrl+Z`, `?`), link condivisibile, modifica del colore a mano. Bene per chi cresce con lo strumento senza pesare sul principiante. | 0 |
| 8 | Estetica e design minimalista | Gerarchia chiara: palette a sinistra, verifica a destra, una sola azione principale. La scala da 1:1 a 21:1 mostra pallini colorati senza dire quale pallino è quale coppia; su mobile alcuni si sovrappongono (P7). | 1 |
| 9 | Aiutare a riconoscere e correggere gli errori | Ottimo. Coppia che non passa: cosa non va, di quanto, quale soglia serve, il colore corretto e "Apply fix". | 0 |
| 10 | Aiuto e documentazione | Aiuto contestuale dove serve ("Why?" su ogni fascia e su ogni coppia, frase introduttiva, finestra delle scorciatoie). Il nome accessibile di "Undo" contiene anche "Nothing to undo yet." quando c'è qualcosa da annullare (P10, riguarda chi usa un lettore di schermo). | 1 |

## Problemi e correzioni proposte

Nessun problema di gravità 3 o 4.

| ID | Problema | Dove | Gravità | Correzione proposta |
|---|---|---|---|---|
| P1 | Dopo aver cliccato il lucchetto, il focus resta sul lucchetto. Se Giulia preme Spazio, come suggerisce "or press Space" accanto a "Generate", il primario si **sblocca** e non viene generato niente; premendo di nuovo si riblocca. Lo stesso succede con il focus su "Why?" o su una riga dei contrasti: si apre il pannello invece di generare. Se poi clicca "Generate", il primario che voleva tenere cambia (si recupera con "Undo"). È verificato: focus sul lucchetto, Spazio, messaggio "Primario sbloccato.", URL invariato. | Desktop, EN e IT | 2 (al limite del 3: tocca proprio il passo "blocca" del compito) | Due strade, anche insieme: (a) dopo un clic con il mouse sul lucchetto riportare il focus su "Generate", oppure togliere il focus con il mouse (`:focus-visible` resta per la tastiera); (b) cambiare il suggerimento in "or press Space anywhere outside a button", oppure usare una scorciatoia che non entri in conflitto con l'attivazione dei pulsanti. Non intercettare lo Spazio sui pulsanti: rompe l'accessibilità da tastiera. |
| P2 | Il lucchetto è solo un'icona. Su desktop c'è un tooltip nativo lento; sul touch niente. Chi non usa Coolors può non capire che "bloccare" significa "tenere fermo alla prossima generazione". | Desktop e mobile | 2 | Su desktop, etichetta testuale accanto all'icona ("Lock" / "Blocca") almeno sul primo uso, o un tooltip proprio, rapido, che dica "Keep this color when you generate". Su mobile, un suggerimento la prima volta, sotto la prima fascia: "Tap the lock to keep a color." |
| P3 | "On primary on Primary" e "Testo sul primario su Primario" sembrano errori. Giulia non conosce la convenzione "on-primary". | Fascia Primary, pannello contrasti, Why | 2 | "Text on Primary" / "Testo sul Primario", oppure "Button text on Primary" / "Testo dei pulsanti sul Primario". |
| P4 | Su mobile il chip della fascia mostra "4.6:1 Easy to read" senza dire rispetto a quale colore. Su desktop la coppia è scritta sotto. | Mobile | 2 | Aggiungere la coppia in piccolo sotto il chip, come su desktop, oppure riscrivere il chip come "4.6:1 with Text". |
| P5 | Le etichette AA, AAA e UI non sono spiegate dove compaiono. "UI" in particolare non dice niente a chi non conosce le regole WCAG per i componenti grafici. | Fasce e pannello contrasti | 1 | Una riga di legenda sotto la frase introduttiva: "AA and AAA are the WCAG levels for text; UI is the level for buttons and icons." Oppure tooltip sulle sigle. |
| P6 | Il numero sulla fascia è la coppia più debole di quel colore, quindi cambia coppia tra una palette e l'altra (sul primario a volte "On primary on Primary", a volte "Primary on Background"). Lo stesso colore mostra un numero sulla fascia e un altro nel pannello. | Fasce | 1 | Tenere la regola ma dirla: un titoletto "Weakest pair" sopra il chip, oppure fissare una coppia per ruolo. |
| P7 | La scala 1:1–21:1 ha pallini colorati senza legenda; con valori vicini si sovrappongono. Giulia vede che i pallini stanno a destra delle soglie, ma non quale è quale. | Pannello contrasti, soprattutto mobile | 1 | Al passaggio del mouse o al tocco su un pallino, evidenziare la riga corrispondente; oppure nascondere la scala su mobile, dove le righe bastano. |
| P8 | Il tooltip del lucchetto dice "Lock color (L)" anche quando il colore è bloccato e il clic lo sbloccherebbe. | Desktop | 1 | Tooltip dinamico: "Unlock color (L)" / "Sblocca il colore (L)". |
| P9 | In italiano i testi dell'anteprima (landing "Plotline", "Start free", "Plan your week in ten minutes") restano in inglese. | Anteprima, IT | 1 | Tradurre i testi di esempio dell'anteprima, o dichiarare che è un contenuto di esempio in inglese. |
| P10 | Il nome accessibile di "Undo" è "Undo Nothing to undo yet." anche quando il pulsante è attivo, perché il testo del tooltip sta dentro il pulsante. Non tocca Giulia, ma un lettore di schermo legge un'informazione falsa. | Desktop, EN e IT | 1 | Mostrare e collegare il tooltip ("aria-describedby") solo quando il pulsante è disattivato, e tenerlo fuori dal nome. |

## Verdetto su O2

**Raggiunto con riserve.**

I due criteri del charter sono rispettati: il compito si completa in **2 clic** (3 con una spiegazione facoltativa) su desktop e su mobile, in inglese e in italiano, e non ho trovato **problemi gravi** (gravità 3 o 4). Il percorso è corto perché la verifica dei contrasti non richiede azioni: è sempre visibile e scritta in parole. Il caso di errore è gestito meglio di quanto serve a una principiante, con la correzione proposta e applicabile con un tocco.

Le riserve sono due. La prima è di metodo: un solo valutatore e nessuna persona vera, quindi il risultato è un'indicazione forte, non una prova. La seconda è P1: il conflitto tra la barra spaziatrice e il focus sul lucchetto colpisce proprio il passo "blocca il primario" e per chi usa la tastiera è al limite del problema grave. Consiglio di correggere P1, P2, P3 e P4 prima del rilascio 1.0; sono modifiche piccole. Con quelle corrette e un test anche informale con due o tre studenti, O2 si può dichiarare raggiunto senza riserve.

## Correzioni (14/11/2026, branch `fix/rifinitura-1.0`)

| Problema | Esito | Cosa è cambiato |
| --- | --- | --- |
| P1 | corretto | Se al pulsante si è arrivati con un clic o un tocco, Spazio genera, come dice il suggerimento, e il rilascio del tasto non preme più il pulsante. Se ci si è arrivati con Tab o con le frecce, Spazio preme il pulsante come in ogni pagina. Test di componente ed end-to-end |
| P2 | rimandato a 1.0.1 | Il lucchetto ha nome accessibile e tooltip; manca un'etichetta visibile su mobile |
| P3 | corretto | Il ruolo si chiama "Button text" / "Testo dei pulsanti": "Button text on Primary" |
| P4 | rimandato a 1.0.1 | Su mobile il chip non dice ancora rispetto a quale colore |
| P8 | corretto | Il tooltip dice "Unlock color (L)" quando il colore è bloccato |
| P9 | corretto in parte | L'anteprima resta in inglese, perché è il sito di un prodotto immaginario, ma ora porta `lang="en"` |
| P10 | corretto | Il nome di Undo non contiene più il tooltip |
