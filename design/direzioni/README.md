# Direzioni di design

**Data:** 12 novembre 2026

Tre direzioni per la stessa pagina, con gli stessi contenuti, le stesse funzioni e gli stessi testi (`docs/02 - Struttura e testi.md`). Cambiano l'idea, la gerarchia e il carattere.

Ogni file si apre nel browser e funziona: **Space** o **Generate** alternano tre palette d'esempio (chiara verde, scura blu, chiara viola), i lucchetti e il selettore dell'anteprima rispondono. Contrasti e ruoli ricavati sono **calcolati dal vivo** con la formula WCAG 2.1 (`shared/shared.js`), quindi i numeri mostrati sono veri. Con `?p=1` o `?p=2` nell'URL si apre direttamente un'altra palette.

Le tre palette e Plotline sono dati d'esempio inventati.

## A. Chip

`a-chip.html` · anteprime: `anteprime/a-chip-desktop.png`, `anteprime/a-chip-mobile.png`

**Concetto.** La palette come una mazzetta di campioni di vernice: cinque cartoncini in fila su un tavolo grigio, il colore in alto e l'etichetta stampata sotto con ruolo, codice ed esito del contrasto.

**Riferimenti.** I campioni Pantone e le mazzette dei colorifici; l'etichetta tecnica stampata sotto il colore.

**Carattere.** Archivo, una sola famiglia variabile: larghezza espansa per il marchio, condensata per i nomi dei ruoli e le etichette, normale per il resto.

**Perché funziona.** È la forma più familiare: chi arriva da Coolors capisce subito. Il contrasto sta sull'etichetta di ogni colore, come le specifiche sul retro di un campione.

**Limiti.** È la più vicina ai concorrenti, il rischio "un altro Coolors" del charter. A 1440 px l'anteprima finisce sotto la piega. Su mobile cinque cartoncini occupano molto spazio prima di arrivare ai contrasti.

## B. Prova

`b-prova.html` · anteprime: `anteprime/b-prova-desktop.png`, `anteprime/b-prova-mobile.png`

**Concetto.** Il contrasto non si dichiara, si dimostra. Ogni ruolo è una fascia piena a tutta larghezza; dentro, una tessera scrive "Aa" e il rapporto **con i colori della coppia più debole di quel ruolo**. Se il numero si legge, la coppia funziona: lo vedi prima ancora di leggere "AA".

**Riferimenti.** Le tavole di prova dei caratteri tipografici, le scale ottotipiche dell'oculista, i fogli di prova colore della stampa.

**Carattere.** Bricolage Grotesque, con dimensioni ottiche: "Aa" e i rapporti grandi hanno il disegno da titolo, il resto quello da testo.

**Perché funziona.** Rende visibile la differenza di Hue UI rispetto ai concorrenti, che l'analisi indica come il punto da difendere. Le fasce stanno tutte nella prima schermata e l'anteprima resta accanto; le spiegazioni (Why?) si attaccano a una prova concreta. Per un principiante "si legge o non si legge" è più chiaro di qualunque sigla.

**Limiti.** È la più audace: le fasce enormi dominano la pagina e su palette molto sature diventa intensa. I controlli stanno in una pillola bianca sopra colori qualunque, quindi va curato il bordo della pillola su sfondi chiarissimi.

## C. Studio

`c-studio.html` · anteprime: `anteprime/c-studio-desktop.png`, `anteprime/c-studio-mobile.png`

**Concetto.** L'anteprima è la protagonista. La pagina è uno studio fotografico con fondale grigio neutro: al centro l'interfaccia ricolorata, a destra i contrasti, in basso una barra con i cinque colori e Generate.

**Riferimenti.** Le cabine di valutazione del colore e il cartoncino grigio 18% dei fotografi: un grigio medio neutro non altera la percezione dei colori. Le barre degli strumenti di Figma e dei software di montaggio.

**Carattere.** Schibsted Grotesk, solida e da interfaccia, con le cifre tabellari solo nelle colonne di numeri.

**Perché funziona.** Risponde subito a "come viene davvero?", la domanda che i generatori classici lasciano aperta. È la più vicina a uno strumento professionale.

**Limiti.** I colori diventano piccoli e passano in secondo piano, e il contrasto rischia di sembrare un dettaglio della barra in basso. Su mobile la barra fissa è alta e i cinque colori scorrono in orizzontale, quindi non si vedono tutti insieme. È anche la più vicina a Realtime Colors.

## Confronto

| | A. Chip | B. Prova | C. Studio |
|---|---------|----------|-----------|
| Si distingue dai concorrenti | Poco | Molto | Poco (simile a Realtime Colors) |
| Il contrasto si vede al primo sguardo | Sì, piccolo | Sì, è il soggetto | Parziale |
| Anteprima nella prima schermata (1440) | No | Sì | Sì |
| Mobile | Lungo | Buono | Barra fissa alta |
| Forza nel portfolio | Pulita, prevedibile | Idea riconoscibile e difendibile | Professionale, poco personale |

## Scelta

**12/11/2026: l'autore ha scelto B. Prova.** Solo questa direzione si sviluppa fino in fondo; A e C restano qui come documentazione del processo.

## Raccomandazione

**B. Prova.** È l'unica in cui il design stesso spiega la differenza di Hue UI: il contrasto non è un'etichetta accanto al colore, è la prima cosa che vedi. È anche quella che a un colloquio si racconta in una frase. Da A conviene prendere l'etichetta tecnica ordinata dei codici; da C il fondale neutro per l'anteprima.

## Cosa resta uguale in tutte

L'interfaccia di Hue UI ha colori propri e fissi: i colori generati toccano solo campioni, fasce e mockup, mai i controlli. Focus a doppio anello, target da 44 px, esiti con testo e icona, `prefers-reduced-motion` rispettato.
