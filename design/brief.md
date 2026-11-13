# Brief di design

**Data:** 12 novembre 2026
**Da leggere prima:** `docs/00 - Charter.md`, `docs/02 - Struttura e testi.md`, `docs/03 - PRD.md`, `docs/04 - Specifiche tecniche.md` § 8

## Obiettivo

Progettare l'unica pagina di Hue UI: un generatore di palette che assegna ruoli ai colori e garantisce i contrasti WCAG. Il design deve far capire in 5 secondi la differenza rispetto a Coolors e Realtime Colors: **accanto a ogni colore c'è il suo contrasto**.

## Pubblico e situazione

- Principianti (studenti, sviluppatori junior) ed esperti (designer UI), nella stessa interfaccia.
- Usano Hue UI all'inizio di un progetto, spesso con Figma o l'editor aperti accanto: il desktop è il caso principale, ma il mobile deve funzionare davvero (consultazione, condivisione di un link ricevuto).

## Compiti degli utenti, in ordine di importanza

1. Guardare una palette e capire se funziona.
2. Generarne un'altra, bloccando i colori buoni.
3. Capire un contrasto (Why?).
4. Vederla su un'interfaccia vera.
5. Copiare i codici o condividere il link.
6. Partire da un proprio colore.

## Il vincolo di design più importante

**L'interfaccia non deve competere con la palette.** I colori generati cambiano a ogni clic e possono essere qualunque cosa: l'involucro di Hue UI deve restare neutro e fisso, così la palette è sempre il soggetto. I controlli di Hue UI non prendono mai i colori generati (specifiche § 8).

Ne segue che il carattere del prodotto deve venire da **tipografia, griglia, dettagli e microinterazioni**, non da un colore di brand forte.

## Schermate da produrre

| Schermata | Desktop 1440 | Mobile 390 |
|-----------|--------------|------------|
| Home con palette chiara, anteprima Landing | ✓ | ✓ |
| Home con palette scura, anteprima Mobile app | ✓ | ✓ |
| Scheda in modifica HEX, con errore | ✓ | ✓ |
| Why? aperto: coppia che passa, colore corretto, coppia che non passa con Apply fix | ✓ | ✓ (uno) |
| Dialog Shortcuts | ✓ | — (le scorciatoie non servono su touch: il pulsante si nasconde) |
| Toast (copiato, link condiviso, errore) | ✓ | ✓ |
| Stati: Undo inattivo, tutti bloccati | ✓ | — |

Più i due mockup di anteprima (Landing page di Plotline e App mobile di Plotline), costruiti solo con i ruoli.

## Requisiti

- WCAG 2.1 AA sull'interfaccia; target ≥ 44 px; focus visibile su qualunque colore (doppio anello).
- Esito del contrasto sempre con testo e icona, mai solo colore.
- Una sola azione principale per schermata: **Generate**.
- Font: massimo 2 file in locale.
- Icone: una sola famiglia SVG.
- Testi veri da `02 - Struttura e testi.md`, nessun segnaposto.

## Stile da evitare

Progetti precedenti dell'autore, da cui Hue UI deve distinguersi:

| Progetto | Caratteri | Colori | Tono |
|----------|-----------|--------|------|
| gadda-web | Lora + Titillium Web | Blu istituzionale #325097 con rosso, giallo, verde | Scuola, editoriale |
| ttf-web | Space Grotesk + Inter | Blu #2563EB, azzurro | Tecnico, WordPress |
| portfolio | Geist + Geist Mono | Zinco quasi nero, accento lime con gradienti | Dark, sviluppatore |

Quindi niente Inter, Space Grotesk, Geist; niente blu come colore dell'interfaccia; niente dark mode con accento lime.

Da evitare anche, in generale: gradienti viola, griglie di card tutte uguali, hero centrato con tre icone, emoji al posto delle icone, ombre e angoli arrotondati ovunque, l'estetica "arcobaleno" tipica dei generatori di colore.

## Direzioni da esplorare

2-3 direzioni davvero diverse, con home desktop e mobile ciascuna, e poche righe su concetto, riferimenti e perché funziona per questo pubblico. L'autore ne sceglie una.
