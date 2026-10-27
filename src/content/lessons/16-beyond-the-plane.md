---
title: "Beyond the plane"
order: 16
part: 6
summary: "Singer sets in every dimension, and the q = 2 case that becomes the shift-register sequence engineers call an m-sequence."
status: ready
---

**You'll learn:** that Singer's construction works in any number of dimensions, what the parameters $v$, $k$, and $\lambda$ become, and why the smallest field, with $q = 2$, turns the difference set into a stream of bits that looks random but lines up with itself in only one place. Part VII leans on that last fact.

## From a plane to a space

Part IV builds the projective plane of order $q$ from vectors with three coordinates over the finite field with $q$ elements. ([Lessons 10](../10-vectors-over-a-finite-field/) and [11](../11-coordinates/) do this in detail; here is the picture you need.) A *point* is a direction: a vector together with all its nonzero multiples. A *line* is a flat sheet through the origin, which contains many directions.

Nothing stops us from using more coordinates. With $m + 1$ coordinates we get a projective space of dimension $m$. The role of the lines is now played by **hyperplanes**: the flat pieces that are one dimension smaller than the whole space, the way a plane is one dimension smaller than 3-dimensional space.

<aside class="notation">
<span class="notation-title">Notation</span>

$\mathrm{PG}(m, q)$ is the projective space of dimension $m$ over the field with $q$ elements, where $q$ is a prime or a power of a prime. "PG" stands for projective geometry. The plane of Lessons 3 and 4 is $\mathrm{PG}(2, q)$, of order $n = q$. The power $q^m$ means $q$ multiplied by itself $m$ times, so $2^4 = 16$.

</aside>

## Counting points

There are $q^{m+1}$ vectors with $m + 1$ coordinates, since each coordinate has $q$ choices. Leave out the zero vector, which points nowhere. Each direction contains $q - 1$ nonzero vectors (its nonzero multiples), so the number of points is

$$
v = \frac{q^{m+1} - 1}{q - 1}.
$$

A hyperplane is a copy of a space with one coordinate fewer, so by the same count it holds $k = (q^m - 1)/(q - 1)$ points. Two different hyperplanes meet in a piece with two coordinates fewer, which holds

$$
\lambda = \frac{q^{m-1} - 1}{q - 1}
$$

points. (λ is the Greek letter lambda, as in Lesson 1.) For $m = 2$ these are the plane's numbers: $v = q^2 + q + 1$, $k = q + 1$, and $\lambda = 1$, because two lines meet in one point.

## Singer's theorem in every dimension

Singer's 1938 paper already covers every dimension. The finite field with $q^{m+1}$ elements has a single element $\alpha$ (the Greek letter alpha) whose powers run through every nonzero element. Number the points so that point $i$ is the direction of $\alpha^i$. Multiplying by $\alpha$ carries flat pieces to flat pieces and moves point $i$ to point $i + 1$, all the way around a cycle of $v$ points. So, exactly as in Lesson 4:

> **Theorem (Singer).** Pick any hyperplane of $\mathrm{PG}(m, q)$ and let $D$ be the numbers of its points. Then $D$ is a $(v, k, \lambda)$ difference set with the parameters above, and the other hyperplanes are its translates $D + j$.

The reason is the same one as Lesson 2: two translates are two different hyperplanes, so they share exactly $\lambda$ points, and a set whose translates all overlap in $\lambda$ points has every nonzero difference exactly $\lambda$ times.

Choose $q$ and $m$ below. The strip shows the points $0, 1, \dots, v - 1$ with the hyperplane $D$ filled in, and the tally shows every difference occurring exactly $\lambda$ times.

<div data-widget="higher-singer" data-q="2" data-m="3"></div>

Some small cases:

| $q$ | $m$ | $(v, k, \lambda)$ |
|---|---|---|
| 2 | 2 | (7, 3, 1) |
| 2 | 3 | (15, 7, 3) |
| 2 | 4 | (31, 15, 7) |
| 2 | 5 | (63, 31, 15) |
| 3 | 3 | (40, 13, 4) |
| 4 | 3 | (85, 21, 5) |

## When q = 2: a shift register

With $q = 2$ the field has just the two elements 0 and 1, and $1 + 1 = 0$. Arithmetic with them is the arithmetic of bits. Set the widget to $q = 2$ and look at the row of bits under the strip.

Those bits come from a **shift register**, one of the simplest circuits there is: it remembers the last few bits and makes the next bit by adding some of them, mod 2. For $m = 3$ the rule is

$$
b_{i+4} = b_i + b_{i+1} \pmod 2,
$$

starting from $0, 0, 0, 1$. That gives $0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1$, and then it repeats with period 15. The 0s sit at positions $\{0, 1, 2, 4, 5, 8, 10\}$, which is exactly the Singer set $D$ of $\mathrm{PG}(3, 2)$, a $(15, 7, 3)$ difference set.

This is no accident. The rule comes from the polynomial $x^4 + x + 1$ used to build the field with 16 elements, and the bit $b_i$ is the "trace" of $\alpha^i$ that Part V uses to pick out the hyperplane. Engineers call such a sequence a **maximal-length sequence**, or **m-sequence**: with $m + 1$ bits of memory it runs through the longest possible period, $2^{m+1} - 1$, before repeating. The zeros of a binary m-sequence always form a Singer set with $q = 2$; Golomb and Gong's book on signal design covers this in detail.

## Lining up with itself

Turn the bits into signs: write $-1$ at the positions in $D$ and $+1$ everywhere else. Now slide a copy of the sequence along by $t$ steps, multiply it position by position with the original, and add up. This total is the **autocorrelation** at shift $t$. At $t = 0$ every product is $(\pm 1)^2 = 1$, so the total is $v$.

At any other shift, the two copies disagree exactly where one has a $-1$ and the other doesn't. The original has $k$ positions of $D$, and the shifted copy shares $\lambda$ of them (Lesson 2 again), so each copy has $k - \lambda$ positions the other lacks. That makes $2(k - \lambda)$ disagreements, each contributing $-1$ instead of $+1$:

$$
\text{autocorrelation at } t \ne 0 \;=\; v - 4(k - \lambda).
$$

($\ne$ means "is not equal to".) For $q = 2$ this is $(2^{m+1} - 1) - 4 \cdot 2^{m-1} = -1$, whatever $m$ is. The bottom chart in the widget shows it: one tall spike of height $v$ and a perfectly flat $-1$ everywhere else. A sequence like this looks like noise, yet it matches itself at exactly one alignment. That is what lets a receiver find an echo ([Lesson 20](../20-finding-an-echo/)) and a telescope unscramble a shadow ([Lesson 19](../19-pictures-without-a-lens/)).

Try $q = 3$ in the widget: the off-peak value is no longer $-1$. Planar sets with larger $q$ have a flat but tall floor, so engineers use them where only the on/off pattern matters (Lessons 21–23), and use $q = 2$ for signs.

## What about λ = 2?

The Singer sets have $\lambda = 1$ in a plane, $\lambda = q + 1$ in three dimensions, and larger $\lambda$ after that. Could a Singer set have $\lambda = 2$, so that every difference turns up exactly twice? That would need $(q^{m-1} - 1)/(q - 1) = 2$, which simplifies to $q^{m-1} = 2q - 1$. No prime power $q \geq 2$ solves it, so Singer's construction never gives $\lambda = 2$ directly.

There is one way in. The numbers *not* in a difference set also form one: if $D$ is a $(v, k, \lambda)$ set, its complement is a $(v, v - k, v - 2k + \lambda)$ set. The complement of the Fano set $\{1, 2, 4\}$ is $\{0, 3, 5, 6\}$, a $(7, 4, 2)$ set.

Two more $\lambda = 2$ sets come from multiplication rather than geometry. The nonzero squares mod 11 are $\{1, 3, 4, 5, 9\}$, an $(11, 5, 2)$ set (Lesson 1 met it). The nonzero fourth powers mod 37 are $\{1, 7, 9, 10, 12, 16, 26, 33, 34\}$, a $(37, 9, 2)$ set. These *residue* difference sets go back to Raymond Paley (squares, 1933) and Sarvadaman Chowla (fourth powers, 1944).

Designs with $\lambda = 2$, where any two blocks meet in exactly two points, are called **biplanes**. They are rare: only a handful are known, these three are the only ones built on a clock, and nobody knows whether there are infinitely many. That rarity is part of what makes the planes, with a Singer set for every prime power $q$, special.

Any difference set makes a card game: card $j$ holds the pictures at the points $D + j$, and any two cards share exactly $\lambda$ pictures. The [deck maker](../../playgrounds/deck-maker/?deck=s2&theme=all) offers *match 2* decks from the three biplanes, and *match 3* and *match 4* decks from the Singer sets of $\mathrm{PG}(3, 2)$ and $\mathrm{PG}(3, 3)$: 15 cards of 7 pictures, and 40 cards of 13.

## A warning from higher dimensions

In the plane, every known difference set with Singer's parameters is equivalent to a Singer set, and Lesson 17 asks whether that is always so. In higher dimensions the answer is known, and it is no. In 1962 Basil Gordon, William Mills, and Lloyd Welch built difference sets with exactly Singer's parameters $v = (q^{N} - 1)/(q - 1)$ (here $N = m + 1$) that are not equivalent to any Singer set, whenever $N$ is a product of two whole numbers, one of them at least 3 and the other at least 2. The smallest case is $q = 2$, $N = 6$: two inequivalent $(63, 31, 15)$ sets, the pair Marshall Hall had found. Their construction never produces planar parameters, since that needs $N = 3$, a prime. So it says nothing about the question of Lesson 17.

<section class="try-it">

## Try it

Find $(v, k, \lambda)$ for $\mathrm{PG}(3, 3)$, and check Lesson 1's counting rule $k(k - 1) = \lambda(v - 1)$.

<details>
<summary>Show the answer</summary>

$v = (3^4 - 1)/2 = 80/2 = 40$, $k = (3^3 - 1)/2 = 13$, and $\lambda = (3^2 - 1)/2 = 4$. Then $k(k - 1) = 13 \cdot 12 = 156$ and $\lambda(v - 1) = 4 \cdot 39 = 156$. They match. Set the widget to $q = 3$, $m = 3$ to see the set.

</details>

</section>

Check the $(15, 7, 3)$ set yourself in the [difference set workbench](../../playgrounds/difference-workbench/?v=15&set=0,1,2,4,5,8,10), and look at its translates: any two share exactly 3 points.

## Sources

- J. Singer, “A theorem in finite projective geometry and some applications to number theory,” *Trans. Amer. Math. Soc.* 43 (1938), 377–385. [DOI 10.1090/S0002-9947-1938-1501951-4](https://doi.org/10.1090/S0002-9947-1938-1501951-4).
- B. Gordon, W. H. Mills, and L. R. Welch, “Some new difference sets,” *Canad. J. Math.* 14 (1962), 614–625. [DOI 10.4153/CJM-1962-052-2](https://doi.org/10.4153/CJM-1962-052-2).
- S. W. Golomb and G. Gong, [*Signal Design for Good Correlation*](https://www.cambridge.org/core/books/abs/signal-design-for-good-correlation/cyclic-hadamard-sequences-part-1/715987DF48889D1FBE62C5AD5CF6DE0D), Cambridge University Press, 2005.
- Q. Xiang, [a survey of sequences with two-level autocorrelation](https://sites.udel.edu/qxiang/files/2017/08/SETAsurvey-2dbi869.pdf), which shows they are the same thing as cyclic difference sets.
