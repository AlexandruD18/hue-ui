# 01 - Analisi

**Data:** 12 novembre 2026
**Fonti consultate:** ricerche web del 12/11/2026, elencate in fondo. Molte descrizioni dei concorrenti vengono da recensioni di terzi: dove non ho potuto verificare sul sito ufficiale lo segno con ⟦da verificare⟧.

Hue UI non esiste ancora, quindi non c'è un sito da analizzare. L'analisi guarda il mercato, il pubblico e le regole di accessibilità che il prodotto deve rispettare, e da lì ricava i requisiti.

## 1. Pubblico e bisogni

Due gruppi, una sola interfaccia (decisione del charter).

**Principiante**: studente di design o di sviluppo web, sviluppatore junior, chi fa il primo sito personale.

- Sa riconoscere colori che gli piacciono, non sa assegnarli a un'interfaccia.
- Non conosce i rapporti di contrasto o li conosce solo di nome.
- Bisogno: "dimmi dove metto ogni colore e se va bene".
- Situazione tipica: all'inizio di un progetto, con poco tempo, spesso dal portatile.

**Designer o sviluppatore esperto**

- Sa cosa cerca, vuole provare molte combinazioni in fretta.
- Bisogno: vedere subito la palette su un'interfaccia e avere i valori pronti da copiare.
- Situazione tipica: esplorazione iniziale di un progetto, con Figma o l'editor aperti accanto.

**Compito principale di entrambi:** arrivare a una palette che si possa usare in un'interfaccia, con testi leggibili, e portarsi via i codici dei colori.

## 2. Concorrenti

| Strumento | Cosa fa | Ruoli UI | Contrasti | Anteprima su UI | Costo |
|-----------|---------|----------|-----------|-----------------|-------|
| **Coolors** | Generatore con barra spaziatrice, blocco dei colori, estrazione da immagine | No, solo colori in fila | Controllo contrasti presente; se sia gratuito o Pro le fonti non concordano ⟦da verificare⟧ | Palette Visualizer su mockup, forse solo Pro ⟦da verificare⟧ | Gratis + Pro (prezzo discordante tra le fonti ⟦da verificare⟧) |
| **Adobe Color** | Ruota cromatica con armonie, temi salvati | No | Contrast Checker WCAG AA/AAA con suggerimenti; controllo dei conflitti per daltonismo | No | Gratis con account Adobe |
| **Realtime Colors** | Applica 5 colori a un sito d'esempio, anche con font | Sì: sfondo, testo, primario, secondario, accento | ⟦da verificare⟧ se segnala i contrasti nell'interfaccia | Sì, un solo layout | Gratis |
| **Huemint** | Genera palette con apprendimento automatico per brand, sito, illustrazione | Parziale, legati al modello scelto | Non citati dalle fonti | Sì, su modelli (sito, logo, illustrazione) | Gratis |
| **Leonardo (Adobe)** | Genera scale di colore partendo dai rapporti di contrasto desiderati | No, scale per design system | È il suo punto di forza | No | Gratis, open source |
| **Radix Colors** | Scale da 12 passi pensate per l'uso nelle UI, strumento per palette personalizzate | Sì, ogni passo ha un uso (sfondi, bordi, testi) | Garantiti se lo sfondo è ragionevole, dice la documentazione | No | Gratis, open source |

### Cosa fanno meglio di noi

- **Coolors**: il gesto "spazio per rigenerare" è diventato uno standard. Chi arriva da Coolors se lo aspetta, e noi lo adottiamo.
- **Adobe Color**: quando un contrasto non passa propone un'alternativa invece di limitarsi a segnalarlo.
- **Realtime Colors**: è il concorrente più vicino. Ruoli e anteprima ce li ha già, ed è gratuito.
- **Leonardo**: rovescia il problema, prima fissa il contrasto e poi trova il colore. È lo stesso principio che useremo nella correzione automatica.
- **Radix**: dimostra che i ruoli si possono codificare in modo rigoroso.

### Dove resta spazio
Nessuno degli strumenti esaminati fa tutte e tre queste cose insieme:

1. **genera a caso** come Coolors,
2. **assegna i ruoli** e mostra l'anteprima come Realtime Colors,
3. **non produce mai una coppia illeggibile**, perché corregge la luminosità prima di mostrare la palette, e spiega il perché in parole semplici.

Il terzo punto è la vera differenza di Hue UI. Gli altri strumenti segnalano i contrasti dopo, o lasciano che sia l'utente a controllarli. Hue UI li garantisce prima.

> 🟠 **Rischio da tenere presente.** Realtime Colors copre già due delle tre cose. Se in Hue UI la garanzia sui contrasti non si vede al primo sguardo, il prodotto sembra una copia. Ogni schermata deve mostrare il contrasto accanto al colore, non nasconderlo in un pannello.

## 3. Regole di accessibilità che il prodotto applica

Il generatore deve rispettare queste regole sulle palette che produce. Sono anche le regole che l'interfaccia di Hue UI deve rispettare.

| Criterio WCAG 2.1 | Regola | Dove si applica in Hue UI |
|-------------------|--------|---------------------------|
| 1.4.3 Contrasto minimo (AA) | Testo normale almeno 4,5:1; testo grande (da 18 pt, o 14 pt in grassetto) almeno 3:1 | Testo e testo secondario su sfondo e superficie; testo dentro il pulsante primario |
| 1.4.11 Contrasto non testuale (AA) | Componenti dell'interfaccia e grafici almeno 3:1 con ciò che li circonda | Pulsante primario sullo sfondo, bordi dei campi, anello di focus |
| 1.4.1 Uso del colore | Il colore non deve essere l'unico modo per trasmettere un'informazione | Gli stati (successo, avviso, errore) hanno anche icona e testo; l'esito del contrasto è scritto ("AA ✓"), non solo colorato |
| 1.4.6 Contrasto migliorato (AAA) | 7:1 per il testo normale | Non obbligatorio; lo mostriamo come informazione in più |

Il contrasto si calcola con la formula della luminanza relativa definita da WCAG 2.1. La generazione invece lavora in OKLCH, perché lì cambiare la luminosità non sposta la tinta percepita: si corregge il contrasto senza snaturare il colore.

### Coppie da verificare per ogni palette
| Primo piano | Sfondo | Minimo |
|-------------|--------|--------|
| Testo | Sfondo | 4,5:1 |
| Testo | Superficie | 4,5:1 |
| Testo secondario | Sfondo | 4,5:1 |
| Testo su primario | Primario | 4,5:1 |
| Primario | Sfondo | 3:1 |
| Accento | Sfondo | 3:1 |
| Successo, avviso, errore | Sfondo | 3:1 (con icona e testo accanto) |

## 4. Visibilità sul web

Sito nuovo su GitHub Pages, senza storico. Requisiti minimi dal primo rilascio:

- `title` e `meta description` in inglese, chiari ("Hue UI: random color palettes for interfaces, with WCAG contrast built in" ⟦testo definitivo nello Step 3⟧).
- Immagine Open Graph 1200×630 con una palette d'esempio, per le anteprime su LinkedIn, dove il progetto verrà condiviso.
- `robots.txt`, `sitemap.xml` con l'unica pagina, URL canonico.
- Le palette condivise via URL non devono essere indicizzate come pagine diverse: canonico sempre sulla home.

## 5. Prestazioni

Nessun sito da misurare. Fissiamo un budget di partenza, coerente con l'obiettivo O3 del charter:

| Voce | Budget |
|------|--------|
| JavaScript compresso | ≤ 80 KB |
| Peso totale della prima visita | ≤ 200 KB |
| LCP mobile (Lighthouse, 4G simulata) | ≤ 1,8 s |
| Nuova palette applicata all'anteprima | ≤ 100 ms |
| Font | massimo 2 file, `font-display: swap`, caricati in locale |

Niente librerie pesanti per i colori: le conversioni OKLCH e il calcolo del contrasto si scrivono come funzioni pure e si testano. È anche un punto forte da mostrare nel portfolio.

## 6. Cosa funziona già

Il progetto parte da zero, ma con tre punti solidi:

- un'idea con una differenza chiara rispetto ai concorrenti (contrasti garantiti prima, non controllati dopo);
- un perimetro stretto e dichiarato, che rende realistico arrivare online;
- regole di accessibilità precise e misurabili, che diventano test automatici.

## 7. Decisioni prese dopo l'analisi

Decise dall'autore il 12/11/2026.

1. **Cinque colori per palette**: sfondo, superficie, testo, primario, accento. Testo secondario, testo sul primario e colori di stato li ricava il generatore. L'interfaccia resta semplice come Coolors, ma i ruoli sono completi.
2. **Due mockup per l'anteprima**: landing page e app mobile. La dashboard prevista nel charter esce dal perimetro.
3. **Sfondo chiaro o scuro a caso**: il generatore sceglie ogni volta; bloccando lo sfondo si fissa la scelta. Non è un tema scuro automatico, che resta escluso.

## Fonti

- Realtime Colors: [About Realtime Colors](https://www.realtimecolors.com/docs/about-realtime-colors), [How it works](https://www.realtimecolors.com/docs/how-it-works), [recensione su tech2geek](https://www.tech2geek.net/how-to-visualize-your-colors-and-fonts-in-real-time-on-a-real-website-with-realtime-colors/)
- Coolors: [Digidop](https://www.digidop.com/tools/coolors), [confronto Pixeliro](https://pixeliro.com/compare/coolors), [Atmos](https://atmos.style/alternatives/coolors)
- Huemint: [Gigazine](https://gigazine.net/gsc_news/en/20220304-ai-color-palette-huemint), [Tools for Humans](https://www.toolsforhumans.ai/ai-tools/huemint)
- Leonardo: [leonardocolor.io](https://leonardocolor.io/), [articolo di Nate Baldwin](https://medium.com/@NateBaldwin/leonardo-an-open-source-contrast-based-color-generator-92d61b6521d2)
- Radix Colors: [Custom palettes](https://www.radix-ui.com/colors/docs/overview/custom-palettes), [Composing a palette](https://www.radix-ui.com/colors/docs/palette-composition/composing-a-palette)
- Adobe Color: [Accessibility tools, Adobe Help](https://helpx.adobe.com/creative-cloud/adobe-color-accessibility-tools.html)
- WCAG 2.1: [W3C Recommendation](https://www.w3.org/TR/WCAG21/)
