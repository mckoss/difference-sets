---
title: "Is every planar difference set a Singer set?"
order: 17
part: 6
summary: "The completeness conjecture: Singer's construction may find every planar difference set there is."
status: ready
---

**You'll learn:** the open question at the edge of this subject: whether Singer's construction finds *every* planar difference set. You'll see what the question says precisely, how much computers have checked, which orders are ruled out by theorems and why, and the main ideas people use to attack it, including a way to turn a difference set into a polynomial identity that you can check by hand.

## Two ways to find a set

There are two ways to get a planar difference set, a $(v, k, 1)$ difference set with $v = n^2 + n + 1$ points and $k = n + 1$ members. (Here $n$ is the order of the plane, as in Lesson 4, and λ, the Greek letter lambda, is 1: every nonzero difference occurs exactly once.)

1. **Search.** Try sets until one works. Lesson 1 showed how quickly blind search becomes hopeless, though a smarter search that backs up as soon as a difference repeats gets much further.
2. **Construct.** When the order is a prime power $q$ (a prime, or a prime multiplied by itself some number of times, like $8 = 2^3$), Singer's construction writes a set down directly: build the field with $q^3$ elements, take a generator α (the Greek letter alpha), and keep the exponents $i$ for which the trace of $\alpha^i$ is zero. That takes $v$ steps and no search.

The question of this lesson is whether the two ways ever disagree. Does a search ever turn up a planar difference set that Singer's construction misses?

Run a search and see. The widget below looks for every planar difference set of order $n$ that contains 0 and 1. (That loses nothing: the difference 1 occurs exactly once, say as $a - b = 1$, and sliding the set back by $b$ gives a copy containing 0 and 1.) Each set it finds is compared with the Singer sets.

<div data-widget="planar-search" data-n="5"></div>

Every set the search finds has a "Singer type" badge. Try every order from 2 to 9: each finds exactly the sets Singer's construction predicts, and orders 6 and 10 find nothing at all.

## Sliding and multiplying

To say "Singer type" precisely we need to know when two sets count as the same. There are two moves that turn one difference set into another.

- **Sliding** (a translate, Lesson 2): add the same number $j$ to every member, $D + j$. Differences don't change.
- **Multiplying**: multiply every member by a number $t$ that shares no common factor with $v$, written $t \cdot D$. The differences all get multiplied by $t$ too, and multiplying by such a $t$ just shuffles the nonzero residues, so each one still occurs once. Such a $t$ is called a **multiplier** of $D$ when $t \cdot D$ turns out to be a slide of $D$ itself.

For example, take $D = \{0, 1, 3\}$ mod 7 and $t = 2$. Then $2 \cdot D = \{0, 2, 6\}$, which is $D + 6 = \{6, 7, 9\} = \{6, 0, 2\}$ mod 7. So 2 is a multiplier of $\{0, 1, 3\}$. Multiplying by $t = -1$ gives the mirror image $-D = \{0, 6, 4\}$, which is not a slide of $D$.

Two difference sets are **equivalent** when one can be turned into the other by multiplying and then sliding. A set is **of Singer type** when it is equivalent to a Singer set. Equivalent sets give the same plane with its points renamed, so equivalence is the right notion of "the same".

<aside class="notation">
<span class="notation-title">Notation</span>

- $q = p^e$: the order, when it is a prime power. $p$ is a prime and $e$ is the exponent, so $8 = 2^3$ has $p = 2$, $e = 3$, and a prime $q$ has $e = 1$.
- $\varphi(v)$, read "phi of v" (φ is the Greek letter phi), is **Euler's totient**: how many of $1, 2, \dots, v$ share no common factor with $v$. For example $\varphi(7) = 6$ and $\varphi(21) = 12$ (leave out the multiples of 3 and of 7).
- $a \equiv b \pmod m$ means $a$ and $b$ leave the same remainder when divided by $m$ (Lesson 1). So $21 \equiv 1 \pmod 4$.

</aside>

## The completeness conjecture

> **Conjecture.** Every planar difference set is equivalent to a Singer set.

In the language of geometry: every cyclic projective plane comes from a finite field, exactly as in Part IV. Planes built from a field that way are called **Desarguesian**, so the conjecture says *every cyclic projective plane is Desarguesian*. Huang and Schmidt (2009) state it in exactly these words as their Conjecture 1, and they prove that the two forms match: a planar difference set of prime-power order that is not of Singer type would give a plane that does not come from a field.

The conjecture really makes two claims at once.

1. **Every planar difference set has prime-power order.** This is the *prime power conjecture* for cyclic planes. It follows from the full conjecture, since Singer sets only exist for prime powers.
2. **For each prime power, there is only one set up to equivalence.** Singer himself wrote in 1938 that this "seems to be true", and Halberstam and Laxton (1964) recorded it as Singer's Conjecture I.

The combined statement is sometimes credited to Singer, but Huang and Schmidt point out that Singer did not conjecture the first part: he never claimed the order must be a prime power. Both parts are open.

## Which orders are possible?

Here is what is known for every order up to 100. Click an order to see the reason. Switch between "Cyclic planes", which is the question of this lesson, and "Any plane", where the plane need not have a turning symmetry at all.

<div data-widget="plane-orders" data-view="cyclic" data-n="12"></div>

The two views tell very different stories. For cyclic planes every order up to 100 is settled: a prime power gives a Singer set, and every other order is ruled out, by a theorem or by a computer search. For planes in general, most orders that are not prime powers are still open. Nobody knows a plane of order 12, and nobody has ruled one out.

### Bruck–Ryser: a test with squares

The oldest test applies to *every* projective plane, cyclic or not.

> **Theorem (Bruck and Ryser, 1949).** If $n \equiv 1$ or $2 \pmod 4$ and a projective plane of order $n$ exists, then $n$ is a sum of two whole-number squares: $n = a^2 + b^2$.

Order 6 is the first one it rules out: $6 \equiv 2 \pmod 4$, and $6 - 0^2 = 6$ and $6 - 1^2 = 5$ are not squares. Order 10 passes, since $10 = 1^2 + 3^2$, so Bruck–Ryser says nothing about it. Below 80, the orders it rules out are 6, 14, 21, 22, 30, 33, 38, 42, 46, 54, 57, 62, 66, 69, 70, 77, and 78.

There is a quick way to tell whether a number is a sum of two squares: it is exactly when every prime that leaves remainder 3 on division by 4 (3, 7, 11, 19, …) divides it an even number of times. So $21 = 3 \cdot 7$ fails and $45 = 3^2 \cdot 5 = 3^2 + 6^2$ passes. Try any order:

<div data-widget="bruck-ryser" data-n="21"></div>

For order 10, which slips past this test, Lam, Thiel, and Swiercz (1989) showed by an enormous computer search that no plane of any kind exists. A *cyclic* plane is far more constrained: the search widget above rules out order 10 in about a second.

### Theorems about difference sets

A difference set has much more structure than a general plane, and several theorems use it to rule out whole families of orders. Each holds for the planar difference sets of this lesson.

- **Wilbrink (1985):** if 2 or 3 divides $n$ exactly once, then $n$ is 2 or 3. So orders like 6, 10, 12, 15, and 21 are impossible.
- **Jungnickel and Vedder (1984):** if $n$ is even and bigger than 4, then $n$ is a multiple of 8.
- **Excluded divisors (Gordon 1994, collecting earlier work):** $n$ cannot be a multiple of 6, 10, 14, 15, 21, 22, 26, 33, 34, 35, 38, 39, 46, 51, 55, 57, 58, 62, or 65.

### Computer searches

What no theorem rules out, computers have checked. Evans and Mann (1951) checked cyclic planes up to order 1600. Gordon (1994) reached 2,000,000, Baumert and Gordon (2004) showed that no cyclic plane has an order up to $2 \cdot 10^9$ (two billion) that is not a prime power, and Gordon (2022) raised the bound to $2 \cdot 10^{10}$. These searches don't try sets one at a time like the widget above. Instead they check each order against necessary conditions built from multiplier theorems, which the next section describes.

There is also a result about *all* orders at once. Peluse (2021) proved that the number of orders up to $N$ that have a planar difference set is, for large $N$, about $N / \ln N$ (with $\ln$ the natural logarithm), the same as the number of primes up to $N$. Every prime works, so the orders that are not prime powers, if there are any, are vanishingly rare.

## The evidence for uniqueness

The second half of the conjecture has been checked for many prime-power orders. Marshall Hall (1956) checked the orders 2, 3, 4, 5, 7, 8, 9, 11, 13, 16, 25, 27, and 32; Bruck (1960) added 49, 64, and 81. Huang and Schmidt (2009) checked every order below 41 and the orders 121, 125, 128, 169, 256, and 1024. The last of these says that the Singer set for $q = 1024$, with 1,025 members on a clock of 1,049,601 points, is the only one there is up to equivalence. You can draw it in the [large-q explorer](../../playgrounds/explorer/?q=1024).

The counts tell the same story. Up to sliding, there are exactly

$$
\frac{\varphi(q^2 + q + 1)}{3e}
$$

different Singer sets mod $q^2 + q + 1$. Singer conjectured this count, and Berman (1953) and Halberstam and Laxton (1964) proved it. For $q = 2$ that is $\varphi(7)/3 = 2$: the set $\{0, 1, 3\}$ and its mirror image $\{0, 1, 5\}$. These counts are OEIS [A335866](https://oeis.org/A335866): 2, 4, 2, 10, 12, 8, 12, 36, … for $q = 2, 3, 4, 5, 7, 8, 9, 11, \dots$ The search widget above finds exactly these numbers.

A separate OEIS entry, [A058241](https://oeis.org/A058241), counts *every* planar difference set, Singer or not, as computed by its contributors, treating a set and its mirror image as the same. (The entry lists only a conjectured formula, since a formula would need the completeness conjecture.) Its terms run 1, 2, 1, 5, 0, 6, 4, 6, 0, 18, … for orders 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, …, and they reach order 22. Every term is exactly half the Singer count. Half, because $-1$ is never a multiplier (Gordon, Mills, and Welch 1962; Johnsen 1964): a planar difference set and its mirror image are never slides of each other, so they pair off. A searched count matching a constructed count at every order is the main evidence for the conjecture. The [Singer classes gallery](../../playgrounds/singer-classes/) draws every one of these sets.

Non-Desarguesian planes do exist. Order 9 has exactly four projective planes (Lam, Kolesova, and Thiel 1991): the one from the field with 9 elements and three others, and 9 is the smallest order with planes that don't come from a field. But none of the known planes that don't come from a field is cyclic. Huang and Schmidt still call the evidence "quite flimsy": a few dozen orders is a small sample of an infinite family.

## How a proof might go

Nobody knows how to prove the conjecture, but several tools settle special cases. Here are the main ideas.

### Multipliers pin down structure

Marshall Hall (1947) proved that **every prime $p$ that divides the order $n$ is a multiplier**: $p \cdot D$ is always a slide of $D$. That is a strong constraint on a set nobody has found yet. For example, with $D = \{0, 1, 3, 9\}$ mod 13 (order 3) and $p = 3$: $3 \cdot D = \{0, 3, 9, 27\} = \{0, 3, 9, 1\}$ mod 13, which is $D$ itself.

For a Singer set of order $q = p^e$, the multipliers are exactly the powers of $p$ (Gordon, Mills, and Welch 1962), and there are $3e$ of them. Many non-existence proofs start from Hall's theorem: the multipliers have to fit together in ways that some orders can't support. That is how the excluded divisors above are found. Hall and Ryser (1951) extended the theorem beyond planar sets, and Ho (1992) bounded how many multipliers a planar difference set can have.

### A set as a polynomial

Write the set $D$ as a polynomial with a term $x^d$ for each member $d$. For $D = \{0, 1, 3\}$:

$$
D(x) = 1 + x + x^3.
$$

Work "mod $x^7 - 1$", which means $x^7$ counts as 1, just as 7 counts as 0 on the clock. Exponents then wrap around mod 7, and $x^{-1}$ (meaning $1/x$) is the same as $x^6$, because $x \cdot x^6 = x^7 = 1$. The mirror-image polynomial is $D(x^{-1}) = 1 + x^{-1} + x^{-3} = 1 + x^6 + x^4$.

Now multiply $D(x)$ by $D(x^{-1})$. Each term $x^a$ times each term $x^{-b}$ gives $x^{a - b}$: one term for every difference $a - b$. The $k$ pairs with $a = b$ give $x^0 = 1$, and every nonzero difference gives one power of $x$. In a planar difference set every nonzero difference occurs once, so

$$
D(x) \cdot D(x^{-1}) \equiv n + (1 + x + x^2 + \dots + x^{v-1}) \pmod{x^v - 1}.
$$

The $k = n + 1$ ones split as $n$ plus the 1 that begins the long sum. For $\{0, 1, 3\}$ the right side is $2 + (1 + x + \dots + x^6)$. Check it below, term by term, then click points to break the set and watch the identity fail.

<div data-widget="polynomial-identity" data-v="7" data-set="0,1,3"></div>

This turns a counting puzzle into algebra. Putting $x = 1$ gives $(n + 1)^2 = n + v$, the counting rule from Lesson 1. The bottom of the widget makes the stronger substitution: replace $x$ by a turn of $j/v$ of the way around a circle, so that each term $x^d$ becomes an arrow of length 1, and add the arrows head to tail. The $v$ arrows of $1 + x + \dots + x^{v-1}$ point evenly in all directions and cancel to nothing, and $D(x^{-1})$ becomes the mirror image of $D(x)$. So the identity says that the arrows of $D$ always add up to a total of length exactly $\sqrt n$, whichever turn you use. Mathematicians call these substitutions *characters*, and the totals are numbers called *cyclotomic integers*. Many non-existence proofs ask which cyclotomic integers of size $\sqrt n$ can exist, and show that for some orders none fits.

Two refinements of this idea are worth a sentence each. Turyn (1965) showed that when $n$ is *self-conjugate*, a condition on how $n$ factors among these numbers, the possible totals can be listed completely. Schmidt's *field descent* (1999; with Leung, 2005) shows that such a total must lie in a much smaller number system than it seems to, which removes Turyn's condition and gives general limits.

### Symmetry forces a field

A third approach is geometric. A plane built from a field has a huge number of symmetries, and some theorems turn this around: enough symmetry forces the plane to come from a field.

- **Ostrom and Wagner (1959):** if a plane has symmetries that can carry any two points to any other two points, it is Desarguesian.
- **Kantor (1987)** reached a similar conclusion for planes whose symmetries carry any point and line through it to any other such pair, apart from one narrow exception he could not rule out.
- **Ho (1998):** if a plane has two different abelian "Singer groups", symmetries that carry one point to every other in exactly one way, then it is Desarguesian.

A cyclic plane has just one such cycle. The open question, in this language, is whether **a single cycle is enough** to force a field.

## A contrast: higher dimensions

In higher dimensions the analogous question has been answered, and the answer is no. Gordon, Mills, and Welch (1962) built difference sets with exactly the parameters of Singer's higher-dimensional sets that are not equivalent to them; the smallest are $(63, 31, 15)$ sets ([Lesson 16](../16-beyond-the-plane/)). Their construction needs the dimension plus one to be a product of two whole numbers, and for planes that number is 3, a prime. So it never produces planar parameters, and the planar question remains open.

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
- M. Hall, Jr., “Cyclic projective planes,” *Duke Math. J.* 14 (1947), 1079–1090. [DOI 10.1215/S0012-7094-47-01482-8](https://doi.org/10.1215/S0012-7094-47-01482-8).
- R. H. Bruck and H. J. Ryser, “The nonexistence of certain finite projective planes,” *Canad. J. Math.* 1 (1949), 88–93. [DOI 10.4153/CJM-1949-009-2](https://doi.org/10.4153/CJM-1949-009-2).
- M. Hall, Jr. and H. J. Ryser, “Cyclic incidence matrices,” *Canad. J. Math.* 3 (1951), 495–502. [DOI 10.4153/CJM-1951-050-8](https://doi.org/10.4153/CJM-1951-050-8).
- T. A. Evans and H. B. Mann, “On simple difference sets,” *Sankhyā* 11 (1951), 357–364.
- G. Berman, “Finite projective plane geometries and difference sets,” *Trans. Amer. Math. Soc.* 74 (1953), 492–499. [DOI 10.1090/S0002-9947-1953-0054978-4](https://doi.org/10.1090/S0002-9947-1953-0054978-4).
- M. Hall, Jr., “A survey of difference sets,” *Proc. Amer. Math. Soc.* 7 (1956), 975–986. [DOI 10.1090/S0002-9939-1956-0082502-7](https://doi.org/10.1090/S0002-9939-1956-0082502-7).
- T. G. Ostrom and A. Wagner, “On projective and affine planes with transitive collineation groups,” *Math. Z.* 71 (1959), 186–199. [DOI 10.1007/BF01181398](https://doi.org/10.1007/BF01181398).
- R. H. Bruck, “Quadratic extensions of cyclic planes,” *Proc. Sympos. Appl. Math.* 10, Amer. Math. Soc., 1960, 15–44.
- B. Gordon, W. H. Mills, and L. R. Welch, “Some new difference sets,” *Canad. J. Math.* 14 (1962), 614–625. [DOI 10.4153/CJM-1962-052-2](https://doi.org/10.4153/CJM-1962-052-2).
- H. Halberstam and R. R. Laxton, “Perfect difference sets,” *Proc. Glasgow Math. Assoc.* 6 (1964), 177–184. [DOI 10.1017/S2040618500034985](https://doi.org/10.1017/S2040618500034985).
- E. C. Johnsen, “The inverse multiplier for abelian group difference sets,” *Canad. J. Math.* 16 (1964), 787–796. [DOI 10.4153/CJM-1964-076-5](https://doi.org/10.4153/CJM-1964-076-5).
- R. J. Turyn, “Character sums and difference sets,” *Pacific J. Math.* 15 (1965), 319–346. [DOI 10.2140/pjm.1965.15.319](https://doi.org/10.2140/pjm.1965.15.319).
- D. Jungnickel and K. Vedder, “On the geometry of planar difference sets,” *European J. Combin.* 5 (1984), 143–148. [DOI 10.1016/S0195-6698(84)80028-1](https://doi.org/10.1016/S0195-6698(84)80028-1).
- H. A. Wilbrink, “A note on planar difference sets,” *J. Combin. Theory Ser. A* 38 (1985), 94–95. [DOI 10.1016/0097-3165(85)90028-7](https://doi.org/10.1016/0097-3165(85)90028-7).
- W. M. Kantor, “Primitive permutation groups of odd degree, and an application to finite projective planes,” *J. Algebra* 106 (1987), 15–45. [DOI 10.1016/0021-8693(87)90019-6](https://doi.org/10.1016/0021-8693(87)90019-6).
- C. W. H. Lam, L. Thiel, and S. Swiercz, “The non-existence of finite projective planes of order 10,” *Canad. J. Math.* 41 (1989), 1117–1123. [DOI 10.4153/CJM-1989-049-4](https://doi.org/10.4153/CJM-1989-049-4).
- C. W. H. Lam, G. Kolesova, and L. Thiel, “A computer search for finite projective planes of order 9,” *Discrete Math.* 92 (1991), 187–195. [DOI 10.1016/0012-365X(91)90280-F](https://doi.org/10.1016/0012-365X(91)90280-F).
- C. Y. Ho, “On bounds for groups of multipliers of planar difference sets,” *J. Algebra* 148 (1992), 325–336. [DOI 10.1016/0021-8693(92)90197-T](https://doi.org/10.1016/0021-8693(92)90197-T).
- D. M. Gordon, “The prime power conjecture is true for n < 2,000,000,” *Electron. J. Combin.* 1 (1994), #R6. [DOI 10.37236/1186](https://doi.org/10.37236/1186).
- C. Y. Ho, “Finite projective planes with abelian transitive collineation groups,” *J. Algebra* 208 (1998), 533–550. [DOI 10.1006/jabr.1998.7514](https://doi.org/10.1006/jabr.1998.7514).
- B. Schmidt, “Cyclotomic integers and finite geometry,” *J. Amer. Math. Soc.* 12 (1999), 929–952. [DOI 10.1090/S0894-0347-99-00298-2](https://doi.org/10.1090/S0894-0347-99-00298-2).
- L. D. Baumert and D. M. Gordon, “On the existence of cyclic difference sets with small parameters,” *Fields Inst. Commun.* 41 (2004), 61–68. [DOI 10.1090/fic/041/05](https://doi.org/10.1090/fic/041/05); [arXiv math/0304502](https://arxiv.org/abs/math/0304502).
- K. H. Leung and B. Schmidt, “The field descent method,” *Des. Codes Cryptogr.* 36 (2005), 171–188. [DOI 10.1007/s10623-004-1703-7](https://doi.org/10.1007/s10623-004-1703-7).
- Y. Huang and B. Schmidt, “Uniqueness of some cyclic projective planes,” *Des. Codes Cryptogr.* 50 (2009), 253–266. [DOI 10.1007/s10623-008-9229-z](https://doi.org/10.1007/s10623-008-9229-z); [preprint](https://personal.ntu.edu.sg/bernhard/Publications/pub/Singer.pdf).
- S. Peluse, “An asymptotic version of the prime power conjecture for perfect difference sets,” *Math. Ann.* 380 (2021), 1387–1425. [DOI 10.1007/s00208-021-02188-5](https://doi.org/10.1007/s00208-021-02188-5); [arXiv 2003.04929](https://arxiv.org/abs/2003.04929).
- D. M. Gordon, “On difference sets with small λ,” *J. Algebraic Combin.* 55 (2022), 109–115. [DOI 10.1007/s10801-020-00992-x](https://doi.org/10.1007/s10801-020-00992-x); [arXiv 2007.07292](https://arxiv.org/abs/2007.07292).
- D. M. Gordon and B. Schmidt, “A survey of the multiplier conjecture,” *Des. Codes Cryptogr.* 78 (2016), 221–236. [DOI 10.1007/s10623-015-0153-8](https://doi.org/10.1007/s10623-015-0153-8).
- OEIS Foundation, [A058241](https://oeis.org/A058241) (planar difference sets, counted by search) and [A335866](https://oeis.org/A335866) (Singer sets up to translation).
