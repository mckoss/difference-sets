---
title: "How a proof might go"
order: 19
part: 6
summary: "Three ways to attack the completeness conjecture: multipliers, a polynomial identity you can check by hand, and symmetry that forces a field."
status: ready
---

**You'll learn:** the main ideas people use to attack the completeness conjecture: Hall's multiplier theorem, a way to turn a difference set into a polynomial identity that you can check by hand, and theorems that say enough symmetry forces a plane to come from a field. The lesson ends with ways to go further.

## Three lines of attack

[Lesson 18](../18-every-planar-set-singer/) stated the completeness conjecture: every planar difference set is equivalent to a Singer set. Nobody knows how to prove it, but several tools settle special cases, and each starts from a different way of looking at a difference set: as a set with multipliers, as a polynomial, and as a plane with symmetries.

## Multipliers pin down structure

Marshall Hall (1947) proved that **every prime $p$ that divides the order $n$ is a multiplier**: $p \cdot D$ is always a translate of $D$. That is a strong constraint on a set nobody has found yet. For example, with $D = \{0, 1, 3, 9\}$ mod 13 (order 3) and $p = 3$: $3 \cdot D = \{0, 3, 9, 27\} = \{0, 3, 9, 1\}$ mod 13, which is $D$ itself.

For a Singer set of order $q = p^e$, the multipliers are exactly the powers of $p$ (Gordon, Mills, and Welch 1962), and there are $3e$ of them. Many non-existence proofs start from Hall's theorem: the multipliers have to fit together in ways that some orders can't support. That is how the excluded divisors of Lesson 18 are found. Hall and Ryser (1951) extended the theorem beyond planar sets, and Ho (1992) bounded how many multipliers a planar difference set can have.

## A set as a polynomial

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

This turns a counting puzzle into algebra. Putting $x = 1$ gives $(n + 1)^2 = n + v$, the counting rule from Lesson 1. The bottom of the widget makes a stronger substitution: replace $x$ by a complex number of absolute value 1, the one that sits $j/v$ of the way around the unit circle, for some $j \ne 0$. Its $v$-th power is 1 (it is a $v$-th *root of unity*), which is exactly what working mod $x^v - 1$ requires. The widget draws each complex number as an arrow from the origin, and two facts about them are needed. Complex numbers multiply by multiplying lengths and adding angles, so $x^d$ is an arrow of length 1 turned $d$ times as far, and $x^{-d}$ is its complex conjugate, the mirror image across the horizontal axis. And a complex number times its conjugate is the square of its length (the angles cancel). Adding terms now means laying arrows head to tail. The $v$ arrows of $1 + x + \dots + x^{v-1}$ point evenly in all directions and cancel to nothing, and $D(x^{-1})$ becomes the mirror image of the total arrow of $D(x)$, so the left side is the squared length of that total. So the identity says that the arrows of $D$ add up to a total of length exactly $\sqrt n$, for every turn except the zero turn (where every arrow points right and the total is $n + 1$). Mathematicians call these substitutions *characters*, and the totals are numbers called *cyclotomic integers*.

<details>
<summary>Why the v evenly spaced arrows cancel</summary>

Call their total $S$. Multiplying every arrow by $x$ sends $x^d$ to $x^{d+1}$, and $x^v = 1$ brings the last one back to the first, so the $v$ arrows are only reordered: $x \cdot S = S$. But multiplying by $x$ turns an arrow by $j/v$ of a circle, which moves every arrow except the zero arrow. So $S$ is the zero arrow.

</details>

Many non-existence proofs ask which cyclotomic integers of size $\sqrt n$ can exist, and show that for some orders none fits.

Two refinements of this idea are worth a sentence each. Turyn (1965) showed that when $n$ is *self-conjugate*, a condition on how $n$ factors among these numbers, the possible totals can be listed completely. Schmidt's *field descent* (1999; with Leung, 2005) shows that such a total must lie in a much smaller number system than it seems to, which removes Turyn's condition and gives general limits.

## Symmetry forces a field

A third approach is geometric. A plane built from a field has a huge number of symmetries, and some theorems turn this around: enough symmetry forces the plane to come from a field.

- **Ostrom and Wagner (1959):** if a plane has symmetries that can carry any two points to any other two points, it is Desarguesian.
- **Kantor (1987)** reached a similar conclusion for planes whose symmetries carry any point and line through it to any other such pair, apart from one narrow exception he could not rule out.
- **Ho (1998):** if a plane has two different abelian "Singer groups", families of symmetries that carry one point to every other in exactly one way, then it is Desarguesian. (*Abelian* means commutative: applying two of the symmetries in either order gives the same result, as translations do.)

A cyclic plane comes with one such group, its translations. The open question, in this language, is whether **a single cycle is enough** to force a field.

<section class="try-it">

## Try it

1. Hall's theorem says that 2 is a multiplier of every planar difference set of order 4. Check it for $D = \{0, 1, 4, 14, 16\}$ mod 21: which translate of $D$ is $2 \cdot D$?
2. Let $D = \{0, 1, 3, 9\}$ mod 13 and replace $x$ in $D(x)$ by a 13th root of unity other than 1. How long is the total arrow? What does the identity say when $x = 1$?

<details>
<summary>Show the answers</summary>

1. $2 \cdot D = \{0, 2, 8, 28, 32\} \equiv \{0, 2, 8, 7, 11\} \pmod{21}$. That is $D + 7 = \{7, 8, 11, 21, 23\} \equiv \{7, 8, 11, 0, 2\}$. So $2 \cdot D = D + 7$.
2. The order is $n = 3$, so the total has length $\sqrt 3$, about 1.73, for every one of the 12 roots of unity other than 1. At $x = 1$ every term is 1, and the identity reads $(n + 1)^2 = n + v$: $16 = 3 + 13$. Set the widget above to $\{0, 1, 3, 9\}$ mod 13 to see the arrows.

</details>

</section>

## Where to go from here

This is the end of the theory on this site, and about where the textbooks begin. You can now read the statement of an open research problem, the completeness conjecture, and understand every word of it. Here are some ways to go further.

**Experiment.**

- Write the algorithm as a program. For a prime $q$, [Lesson 15](../15-writing-down-a-difference-set/)'s algorithm needs only arithmetic mod $q$ and a cubic from the table in [Lesson 14](../14-singer-cycle/). For $q = 7$, find a primitive cubic yourself with the test of [Lesson 9](../09-primitive-elements/), build the set of 8 marks on the 57-hour clock, and deal a deck of cards from it as in [Lesson 20](../20-a-card-game-from-a-plane/).
- Before opening the [Singer classes gallery](../../playgrounds/singer-classes/) for a new $q$, predict how many shapes it will show from the formula $\varphi(q^2 + q + 1)/6e$ of [Lesson 16](../16-many-sets-few-shapes/).
- Run the [search](../../playgrounds/search-vs-construction/?n=6) for orders 6 and 10 and watch it come back empty. Then check each order against the theorems of [Lesson 18](../18-every-planar-set-singer/): which one rules it out?

**Read.**

- Emily Moore and Harriet Pollatsek, *Difference Sets: Connecting Algebra, Combinatorics, and Geometry* (American Mathematical Society, 2013), is written for undergraduates. It has chapters on multipliers and on the Bruck–Ryser theorem in its general form (called Bruck–Ryser–Chowla), two results this site only quotes, and it treats difference sets in settings other than $\mathbb{Z}/v\mathbb{Z}$; [Lesson 29](../29-secrets-that-look-like-noise/) meets one.
- Rudolf Lidl and Harald Niederreiter, *Introduction to Finite Fields and Their Applications* (Cambridge University Press, revised edition 1994), proves the facts about finite fields that Lessons 8 and 9 took on trust.
- Albrecht Beutelspacher and Ute Rosenbaum, *Projective Geometry: From Foundations to Applications* (Cambridge University Press, 1998), starts from axioms like those of [Lesson 4](../04-projective-planes/) and ends with codes and cryptography.

**See what it is for.** Part VII comes next. Each of its lessons is one real use of the fact from Lesson 2, that two translates of a difference set share exactly $\lambda$ points, starting with a [card game](../20-a-card-game-from-a-plane/).

## Sources

- M. Hall, Jr., “Cyclic projective planes,” *Duke Math. J.* 14 (1947), 1079–1090. [DOI 10.1215/S0012-7094-47-01482-8](https://doi.org/10.1215/S0012-7094-47-01482-8).
- M. Hall, Jr. and H. J. Ryser, “Cyclic incidence matrices,” *Canad. J. Math.* 3 (1951), 495–502. [DOI 10.4153/CJM-1951-050-8](https://doi.org/10.4153/CJM-1951-050-8).
- T. G. Ostrom and A. Wagner, “On projective and affine planes with transitive collineation groups,” *Math. Z.* 71 (1959), 186–199. [DOI 10.1007/BF01181398](https://doi.org/10.1007/BF01181398).
- B. Gordon, W. H. Mills, and L. R. Welch, “Some new difference sets,” *Canad. J. Math.* 14 (1962), 614–625. [DOI 10.4153/CJM-1962-052-2](https://doi.org/10.4153/CJM-1962-052-2).
- R. J. Turyn, “Character sums and difference sets,” *Pacific J. Math.* 15 (1965), 319–346. [DOI 10.2140/pjm.1965.15.319](https://doi.org/10.2140/pjm.1965.15.319).
- W. M. Kantor, “Primitive permutation groups of odd degree, and an application to finite projective planes,” *J. Algebra* 106 (1987), 15–45. [DOI 10.1016/0021-8693(87)90019-6](https://doi.org/10.1016/0021-8693(87)90019-6).
- C. Y. Ho, “On bounds for groups of multipliers of planar difference sets,” *J. Algebra* 148 (1992), 325–336. [DOI 10.1016/0021-8693(92)90197-T](https://doi.org/10.1016/0021-8693(92)90197-T).
- D. M. Gordon, “The prime power conjecture is true for n < 2,000,000,” *Electron. J. Combin.* 1 (1994), #R6. [DOI 10.37236/1186](https://doi.org/10.37236/1186).
- C. Y. Ho, “Finite projective planes with abelian transitive collineation groups,” *J. Algebra* 208 (1998), 533–550. [DOI 10.1006/jabr.1998.7514](https://doi.org/10.1006/jabr.1998.7514).
- B. Schmidt, “Cyclotomic integers and finite geometry,” *J. Amer. Math. Soc.* 12 (1999), 929–952. [DOI 10.1090/S0894-0347-99-00298-2](https://doi.org/10.1090/S0894-0347-99-00298-2).
- K. H. Leung and B. Schmidt, “The field descent method,” *Des. Codes Cryptogr.* 36 (2005), 171–188. [DOI 10.1007/s10623-004-1703-7](https://doi.org/10.1007/s10623-004-1703-7).
- D. M. Gordon and B. Schmidt, “A survey of the multiplier conjecture,” *Des. Codes Cryptogr.* 78 (2016), 221–236. [DOI 10.1007/s10623-015-0153-8](https://doi.org/10.1007/s10623-015-0153-8).
