---
title: "Is every planar difference set a Singer set?"
order: 18
part: 6
summary: "The completeness conjecture: Singer's construction may find every planar difference set there is."
status: ready
---

**You'll learn:** the open question at the edge of this subject: whether Singer's construction finds *every* planar difference set. You'll see what the question says precisely, which orders are ruled out by theorems and why, and how much computers have checked.

## Two ways to find a set

There are two ways to get a planar difference set, a $(v, k, 1)$ difference set with $v = n^2 + n + 1$ points and $k = n + 1$ members.

1. **Search.** Try sets until one works. Lesson 1 showed how quickly blind search becomes hopeless, though a smarter search that backs up as soon as a difference repeats gets much further.
2. **Construct.** When the order is a prime power $q$, Singer's construction writes a set down directly: take a primitive element $\alpha$ of $\mathrm{GF}(q^3)$ and keep the exponents $i$ mod $v$ for which $\mathrm{Tr}(\alpha^i) = 0$ ([Lesson 15](../15-writing-down-a-difference-set/)). That takes $v$ steps and no search.

The question of this lesson is whether the two ways ever disagree. Does a search ever turn up a planar difference set that Singer's construction misses?

Run a search and see. The widget below looks for every planar difference set of order $n$ that contains 0 and 1. (That loses nothing: the difference 1 occurs exactly once, say as $a - b = 1$, and the translate $D - b$ contains 0 and 1.) Each set it finds is compared with the Singer sets.

<div data-widget="planar-search" data-n="5"></div>

Every set the search finds has a "Singer type" badge. Try every order from 2 to 9: each finds exactly the sets Singer's construction predicts, and orders 6 and 10 find nothing at all.

## When two sets count as the same

To say "Singer type" precisely we need to say when two difference sets count as the same. [Lesson 16](../16-many-sets-few-shapes/) gave the two moves that turn one difference set into another: **translation**, $D + j$, and **multiplication**, $t \cdot D$ for a $t$ coprime to $v$. (A $t$ for which $t \cdot D$ is a translate of $D$ itself is a multiplier of $D$, and $t = -1$ gives the mirror image $-D$.)

Two difference sets are **equivalent** when one is a translate of a multiple of the other. A set is **of Singer type** when it is equivalent to a Singer set. Equivalent sets give the same plane with its points renumbered: send point $i$ to point $t \cdot i + j$, and every line $D + s$ goes to $t \cdot D + (ts + j)$, a line of the other set's plane. The renumbering is a permutation of the points because $t$ has an inverse mod $v$. So equivalence is the right notion of "the same".

## The completeness conjecture

> **Conjecture.** Every planar difference set is equivalent to a Singer set.

In the language of geometry: every cyclic projective plane comes from a finite field, exactly as in Part IV. Planes built from a field that way are called **Desarguesian** (after Desargues's theorem of classical geometry, which holds in a finite projective plane exactly when the plane comes from a field), so the conjecture says *every cyclic projective plane is Desarguesian*. Huang and Schmidt (2009) state it in exactly these words as their Conjecture 1, and they prove that the two forms match: a planar difference set of prime-power order that is not of Singer type would give a plane that does not come from a field.

The conjecture really makes two claims at once.

1. **Every planar difference set has prime-power order.** This is the *prime power conjecture* for cyclic planes. It follows from the full conjecture, since Singer sets only exist for prime powers.
2. **For each prime power, there is only one set up to equivalence.** Singer himself wrote in 1938 that this "seems to be true", and Halberstam and Laxton (1964) recorded it as Singer's Conjecture I.

The combined statement is sometimes credited to Singer, but Huang and Schmidt point out that Singer did not conjecture the first part: he never claimed the order must be a prime power. Both parts are open.

## Which orders are possible?

Here is what is known for every order up to 100. Click an order to see the reason. Switch between "Cyclic planes", which is the question of this lesson, and "Any plane", where the plane need not be cyclic at all.

<div data-widget="plane-orders" data-view="cyclic" data-n="12"></div>

The two views tell very different stories. For cyclic planes every order up to 100 is settled: a prime power gives a Singer set, and every other order is ruled out, by a theorem or by a computer search. For planes in general, most orders that are not prime powers are still open. Nobody knows a plane of order 12, and nobody has ruled one out.

### Bruck–Ryser: a test with squares

The oldest test applies to *every* projective plane, cyclic or not.

> **Theorem (Bruck and Ryser, 1949).** If $n \equiv 1$ or $2 \pmod 4$ and a projective plane of order $n$ exists, then $n$ is a sum of two whole-number squares: $n = a^2 + b^2$.

Order 6 is the first one it rules out: $6 \equiv 2 \pmod 4$, and $6 - 0^2 = 6$ and $6 - 1^2 = 5$ are not squares. Order 10 passes, since $10 = 1^2 + 3^2$, so Bruck–Ryser says nothing about it. Below 80, the orders it rules out are 6, 14, 21, 22, 30, 33, 38, 42, 46, 54, 57, 62, 66, 69, 70, 77, and 78.

There is a quick way to tell whether a number is a sum of two squares, a classical theorem that goes back to Fermat and Euler, which we state without proof: it is exactly when every prime that leaves remainder 3 on division by 4 (3, 7, 11, 19, …) divides it an even number of times. So $21 = 3 \cdot 7$ fails and $45 = 3^2 \cdot 5 = 3^2 + 6^2$ passes. Try any order:

<div data-widget="bruck-ryser" data-n="21"></div>

For order 10, which slips past this test, Lam, Thiel, and Swiercz (1989) showed by an enormous computer search that no plane of any kind exists. A *cyclic* plane is far more constrained: the search widget above rules out order 10 in about a second.

### Theorems about difference sets

A difference set has much more structure than a general plane, and several theorems use it to rule out whole families of orders. Each holds for the planar difference sets of this lesson.

- **Wilbrink (1985):** if 2 or 3 divides $n$ exactly once, then $n$ is 2 or 3. So orders like 6, 10, 12, 15, and 21 are impossible.
- **Jungnickel and Vedder (1984):** if $n$ is even and bigger than 4, then $n$ is a multiple of 8.
- **Excluded divisors (Gordon 1994, collecting earlier work):** $n$ cannot be a multiple of 6, 10, 14, 15, 21, 22, 26, 33, 34, 35, 38, 39, 46, 51, 55, 57, 58, 62, or 65.

### Computer searches

What no theorem rules out, computers have checked. Evans and Mann (1951) checked cyclic planes up to order 1600. Gordon (1994) reached 2,000,000, Baumert and Gordon (2004) showed that no cyclic plane has an order up to $2 \cdot 10^9$ that is not a prime power, and Gordon (2022) raised the bound to $2 \cdot 10^{10}$. These searches don't try sets one at a time like the widget above. Instead they check each order against necessary conditions built from multiplier theorems, which the [next lesson](../19-how-a-proof-might-go/) describes.

There is also a result about *all* orders at once. Peluse (2021) proved that the number of orders up to $N$ that have a planar difference set is, for large $N$, about $N / \ln N$ (with $\ln$ the natural logarithm), the same as the number of primes up to $N$. Every prime works, so the orders that are not prime powers, if there are any, are vanishingly rare.

## The evidence for uniqueness

The second half of the conjecture has been checked for many prime-power orders. Marshall Hall (1956) checked the orders 2, 3, 4, 5, 7, 8, 9, 11, 13, 16, 25, 27, and 32; Bruck (1960) added 49, 64, and 81. Huang and Schmidt (2009) checked every order below 41 and the orders 121, 125, 128, 169, 256, and 1024. The last of these says that the Singer set for $q = 1024$, with 1,025 members on a clock of 1,049,601 points, is the only one there is up to equivalence. You can draw it in the [large-q explorer](../../playgrounds/explorer/?q=1024).

The counts tell the same story. Up to translation, there are exactly

$$
\frac{\varphi(q^2 + q + 1)}{3e}
$$

different Singer sets mod $q^2 + q + 1$, where $q = p^e$ and $\varphi$ is Euler's totient function (Lesson 16). Singer conjectured this count, and Berman (1953) and Halberstam and Laxton (1964) proved it. For $q = 2$ that is $\varphi(7)/3 = 2$: the set $\{0, 1, 3\}$ and its mirror image $\{0, 1, 5\}$. These counts are OEIS [A335866](https://oeis.org/A335866): 2, 4, 2, 10, 12, 8, 12, 36, … for $q = 2, 3, 4, 5, 7, 8, 9, 11, \dots$ The search widget above finds exactly these numbers.

A separate OEIS entry, [A058241](https://oeis.org/A058241), counts *every* planar difference set, Singer or not, as computed by its contributors, treating a set and its mirror image as the same. (The entry lists only a conjectured formula, since a formula would need the completeness conjecture.) Its terms run 1, 2, 1, 5, 0, 6, 4, 6, 0, 18, … for orders 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, …, and they reach order 22. Every term is exactly half the Singer count. Half, because $-1$ is never a multiplier (Gordon, Mills, and Welch 1962; Johnsen 1964): a planar difference set and its mirror image are never translates of each other, so they pair off. A searched count matching a constructed count at every order is the main evidence for the conjecture. The [Singer classes gallery](../../playgrounds/singer-classes/) draws every one of these sets.

Non-Desarguesian planes do exist. Order 9 has exactly four projective planes (Lam, Kolesova, and Thiel 1991): the one from the field with 9 elements and three others, and 9 is the smallest order with planes that don't come from a field. But none of the known planes that don't come from a field is cyclic. Huang and Schmidt still call the evidence "quite flimsy": a few dozen orders is a small sample of an infinite family.

## A contrast: higher dimensions

In higher dimensions the analogous question has been answered, and the answer is no. The smallest case is $\mathrm{PG}(4, 2)$, with parameters $(31, 15, 7)$: the nonzero squares mod 31 form a difference set with those parameters (Paley's construction, [Lesson 17](../17-beyond-the-plane/)) that is not equivalent to the Singer set, as a check of all 30 values of $t$ and 31 translations confirms. Gordon, Mills, and Welch (1962) then built an infinite family of difference sets with Singer's parameters that are not equivalent to Singer sets, starting at $(63, 31, 15)$. Their construction needs the dimension plus one to be a product of two whole numbers, one at least 3 and the other at least 2, and for planes that number is 3, a prime. So it never produces planar parameters, and the planar question remains open.

## Is there a way to prove it?

The evidence is all on one side, and still nobody has a proof. The [next lesson](../19-how-a-proof-might-go/) looks at the tools that have settled special cases: multipliers, a polynomial identity that holds exactly when a set is a difference set, and theorems that force a plane with enough symmetry to come from a field.

<section class="try-it">

## Try it

Is a projective plane of order 21 possible? What about a *cyclic* plane of order 12? Use the tests above, then check your answers in the widgets.

<details>
<summary>Show the answer</summary>

**Order 21: no plane at all.** $21 = 5 \cdot 4 + 1$, so $21 \equiv 1 \pmod 4$ and Bruck–Ryser applies. The squares up to half of 21 are 0, 1, 4, 9, and $21 - 0 = 21$, $21 - 1 = 20$, $21 - 4 = 17$, $21 - 9 = 12$ are not squares. So 21 is not a sum of two squares. (Or: $21 = 3 \cdot 7$, and 3 leaves remainder 3 on division by 4 and divides 21 once.)

**Cyclic order 12: no.** $12 \equiv 0 \pmod 4$, so Bruck–Ryser says nothing, and a general plane of order 12 is an open question. But $12 = 3 \cdot 4$ has 3 dividing it exactly once, so Wilbrink's theorem rules out a planar difference set. (Jungnickel and Vedder's does too: 12 is even and bigger than 4 but not a multiple of 8.) The search widget can confirm it directly, in a few minutes.

</details>

</section>

Go further in the [search versus construction](../../playgrounds/search-vs-construction/?n=9) playground, which sets the search's time beside Singer's, and in the [large-q explorer](../../playgrounds/explorer/?q=1024), which builds Singer sets far beyond the reach of any search.

## Sources

- J. Singer, “A theorem in finite projective geometry and some applications to number theory,” *Trans. Amer. Math. Soc.* 43 (1938), 377–385. [DOI 10.1090/S0002-9947-1938-1501951-4](https://doi.org/10.1090/S0002-9947-1938-1501951-4).
- R. H. Bruck and H. J. Ryser, “The nonexistence of certain finite projective planes,” *Canad. J. Math.* 1 (1949), 88–93. [DOI 10.4153/CJM-1949-009-2](https://doi.org/10.4153/CJM-1949-009-2).
- T. A. Evans and H. B. Mann, “On simple difference sets,” *Sankhyā* 11 (1951), 357–364.
- G. Berman, “Finite projective plane geometries and difference sets,” *Trans. Amer. Math. Soc.* 74 (1953), 492–499. [DOI 10.1090/S0002-9947-1953-0054978-4](https://doi.org/10.1090/S0002-9947-1953-0054978-4).
- M. Hall, Jr., “A survey of difference sets,” *Proc. Amer. Math. Soc.* 7 (1956), 975–986. [DOI 10.1090/S0002-9939-1956-0082502-7](https://doi.org/10.1090/S0002-9939-1956-0082502-7).
- R. H. Bruck, “Quadratic extensions of cyclic planes,” *Proc. Sympos. Appl. Math.* 10, Amer. Math. Soc., 1960, 15–44.
- B. Gordon, W. H. Mills, and L. R. Welch, “Some new difference sets,” *Canad. J. Math.* 14 (1962), 614–625. [DOI 10.4153/CJM-1962-052-2](https://doi.org/10.4153/CJM-1962-052-2).
- H. Halberstam and R. R. Laxton, “Perfect difference sets,” *Proc. Glasgow Math. Assoc.* 6 (1964), 177–184. [DOI 10.1017/S2040618500034985](https://doi.org/10.1017/S2040618500034985).
- E. C. Johnsen, “The inverse multiplier for abelian group difference sets,” *Canad. J. Math.* 16 (1964), 787–796. [DOI 10.4153/CJM-1964-076-5](https://doi.org/10.4153/CJM-1964-076-5).
- D. Jungnickel and K. Vedder, “On the geometry of planar difference sets,” *European J. Combin.* 5 (1984), 143–148. [DOI 10.1016/S0195-6698(84)80028-1](https://doi.org/10.1016/S0195-6698(84)80028-1).
- H. A. Wilbrink, “A note on planar difference sets,” *J. Combin. Theory Ser. A* 38 (1985), 94–95. [DOI 10.1016/0097-3165(85)90028-7](https://doi.org/10.1016/0097-3165(85)90028-7).
- C. W. H. Lam, L. Thiel, and S. Swiercz, “The non-existence of finite projective planes of order 10,” *Canad. J. Math.* 41 (1989), 1117–1123. [DOI 10.4153/CJM-1989-049-4](https://doi.org/10.4153/CJM-1989-049-4).
- C. W. H. Lam, G. Kolesova, and L. Thiel, “A computer search for finite projective planes of order 9,” *Discrete Math.* 92 (1991), 187–195. [DOI 10.1016/0012-365X(91)90280-F](https://doi.org/10.1016/0012-365X(91)90280-F).
- D. M. Gordon, “The prime power conjecture is true for n < 2,000,000,” *Electron. J. Combin.* 1 (1994), #R6. [DOI 10.37236/1186](https://doi.org/10.37236/1186).
- L. D. Baumert and D. M. Gordon, “On the existence of cyclic difference sets with small parameters,” *Fields Inst. Commun.* 41 (2004), 61–68. [DOI 10.1090/fic/041/05](https://doi.org/10.1090/fic/041/05); [arXiv math/0304502](https://arxiv.org/abs/math/0304502).
- Y. Huang and B. Schmidt, “Uniqueness of some cyclic projective planes,” *Des. Codes Cryptogr.* 50 (2009), 253–266. [DOI 10.1007/s10623-008-9229-z](https://doi.org/10.1007/s10623-008-9229-z); [preprint](https://personal.ntu.edu.sg/bernhard/Publications/pub/Singer.pdf).
- S. Peluse, “An asymptotic version of the prime power conjecture for perfect difference sets,” *Math. Ann.* 380 (2021), 1387–1425. [DOI 10.1007/s00208-021-02188-5](https://doi.org/10.1007/s00208-021-02188-5); [arXiv 2003.04929](https://arxiv.org/abs/2003.04929).
- D. M. Gordon, “On difference sets with small λ,” *J. Algebraic Combin.* 55 (2022), 109–115. [DOI 10.1007/s10801-020-00992-x](https://doi.org/10.1007/s10801-020-00992-x); [arXiv 2007.07292](https://arxiv.org/abs/2007.07292).
- OEIS Foundation, [A058241](https://oeis.org/A058241) (planar difference sets, counted by search) and [A335866](https://oeis.org/A335866) (Singer sets up to translation).
