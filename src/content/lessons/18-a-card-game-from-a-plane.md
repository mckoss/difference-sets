---
title: "A card game from a plane"
order: 18
part: 7
summary: "Why every two cards of Spot It share exactly one symbol, and how a difference set deals the deck."
status: ready
---

**You'll learn:** that the card game Spot It (sold in the UK as Dobble) is a projective plane in disguise, and how a difference set deals a whole deck with no searching at all.

## The game

Spot It is played with round cards, each printed with eight small pictures. Turn over any two cards and they have exactly one picture in common: not zero, not two, always one. The first player to spot it and call it out wins the round.

That is a strange promise to keep across a whole deck. Here is a small deck that keeps it, with three pictures per card instead of eight. Click any two cards to see what they share.

<div data-widget="match-cards" data-v="7" data-set="0,1,3" data-seed="18"></div>

Every pair you try shares exactly one picture. Now tick **Show point numbers**. Each picture carries a number from 0 to 6, and card $j$ holds the pictures numbered by the translate $D + j$ of $D = \{0, 1, 3\}$ mod 7. These are the seven lines of the Fano plane from Lesson 3.

## Pictures are points, cards are lines

Lesson 4 gave the two main rules of a projective plane. Read them with "picture" for point and "card" for line:

> 1. Any two different points lie on exactly one line: *any two pictures appear together on exactly one card.*
> 2. Any two different lines meet in exactly one point: *any two cards share exactly one picture.*

Rule 2 is the promise the game makes. Rule 1 is a bonus that a deck built from a plane also keeps. (Rule 2 alone is easy to cheat: put the same picture on every card and make all the others different. Then any two cards share exactly one picture, but the game is dull.) A deck that keeps both rules, with enough variety for the third rule of Lesson 4, is exactly a projective plane.

If each card has $n + 1$ pictures, Lesson 4's counting argument applies word for word: there are $n^2 + n + 1$ cards, the same number of different pictures, and each picture appears on $n + 1$ cards. Here $n$ is the order of the plane.

| Pictures per card | Order $n$ | Cards (and pictures) |
|---|---|---|
| 3 | 2 | 7 |
| 4 | 3 | 13 |
| 6 | 5 | 31 |
| 8 | 7 | 57 |
| 12 | 11 | 133 |

Eight pictures per card means order 7, which allows 57 cards. The retail deck is commonly reported to have 55 cards, two fewer than the plane allows; the video below counts them. Leaving cards out never breaks the promise, because any two of the remaining cards still share exactly one picture.

The table skips 7 pictures per card for a reason. A full deck with 7 pictures per card would be a projective plane of order 6, and Lesson 4 said there is none.

## Dealing the deck with a difference set

Designing a deck by hand is hard. Put pictures on cards one at a time and you soon paint yourself into a corner, with two cards that already share a picture and a third that can't be fitted. Even for eight pictures per card, a computer search through all possible decks would take far too long (Lesson 1 showed how fast such searches blow up).

A difference set removes the search. Take a planar difference set $D$ mod $v$, the $(v, n + 1, 1)$ sets of Lessons 1 and 4, and number the pictures $0, 1, \dots, v - 1$. Then:

> Card $j$ holds the pictures numbered by the translate $D + j$, for $j = 0, 1, \dots, v - 1$.

Lesson 2 showed that two different translates of a difference set share exactly $\lambda$ points (λ is the Greek letter lambda), and here $\lambda = 1$. That is the whole proof. Singer's construction (Part V) writes down such a $D$ for every prime power $n$, so the deck comes straight out of a formula.

Here is the deck for $D = \{0, 1, 3, 9\}$ mod 13, with four pictures per card:

<div data-widget="match-cards" data-v="13" data-set="0,1,3,9" data-seed="4"></div>

Pick two cards and look at their point numbers: the shared point is the one where the two translates overlap, just as in the translates widget of Lesson 2.

## Watch it explained

Matt Parker of Stand-up Maths takes a real deck apart and shows the geometry inside it.

<div data-widget="video-facade" data-video="VTDKqW_GLkw" data-title="How does Dobble (Spot It) work?" data-by="Stand-up Maths (Matt Parker), YouTube"><a href="https://www.youtube.com/watch?v=VTDKqW_GLkw">Watch “How does Dobble (Spot It) work?” on YouTube</a></div>

<section class="try-it">

## Try it

In the 13-card deck dealt from $D = \{0, 1, 3, 9\}$ mod 13, which card shows both picture 5 and picture 6? Use Lesson 4's trick: find the pair in $D$ whose difference is $6 - 5 = 1$.

<details>
<summary>Show the answer</summary>

The pair is $1$ and $0$. Turning $D$ so that 0 lands on 5 means adding $j = 5$, which also moves 1 to 6. So the card is $D + 5 = \{5, 6, 8, 14\} = \{1, 5, 6, 8\}$ mod 13 (since $14 \equiv 1$). It is the only card with both pictures, by rule 1.

</details>

</section>

Make your own deck in the [match-one deck maker](../../playgrounds/deck-maker/?q=7&theme=all&seed=57): choose 3 to 12 pictures per card, play the matching game, check every pair of cards, and print the deck to cut out.

The cards on this site are square, and every picture is the same size and stands upright in a fixed slot. Slot $i$ on card $j$ holds the point $d_i + j$, where $d_i$ is the $i$-th number of $D$. Follow one picture, say point $p$, through the deck: it is on card $p - d_i$ (mod $v$) in slot $i$, for each $i$. So every picture visits every slot exactly once, and no position on the card gives anything away.

## Sources

- Matt Parker, [“How does Dobble (Spot It) work?”](https://www.youtube.com/watch?v=VTDKqW_GLkw), Stand-up Maths, YouTube.
- J. Singer, “A theorem in finite projective geometry and some applications to number theory,” *Trans. Amer. Math. Soc.* 43 (1938), 377–385. [DOI 10.1090/S0002-9947-1938-1501951-4](https://doi.org/10.1090/S0002-9947-1938-1501951-4).
- The non-existence of a plane of order 6 is the Bruck–Ryser theorem (1949); see Lesson 4.

Spot It and Dobble are trademarks of their owners; this site is not affiliated with them.
