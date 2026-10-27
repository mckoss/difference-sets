---
title: "Writing down a difference set"
order: 14
part: 5
summary: "The trace picks out one line of PG(2, q) using only field arithmetic, so D = {i : Tr(αⁱ) = 0} is a Singer set, written down with no search."
status: ready
---

## You'll learn

- What the **trace** $\mathrm{Tr}(x) = x + x^q + x^{q^2}$ does: it carries each element of $\mathrm{GF}(q^3)$ down to $\mathrm{GF}(q)$, and it is linear, so the elements with trace 0 form a plane through the origin, which is a line of $\mathrm{PG}(2, q)$.
- Singer's recipe: $D = \{\, i \bmod v : \mathrm{Tr}(\alpha^i) = 0 \,\}$, computed one power of $\alpha$ at a time.
- Why the code behind this site gets $\{1, 2, 4\}$ mod 7 rather than $\{0, 1, 3\}$: the two are translates, two lines of the same plane.
- What it costs: about $3v$ field multiplications, against the astronomically many sets a brute-force search would try.

## Any line will do, so which one?

[Lesson 13](../13-singer-cycle/) proved Singer's theorem: number the points of $\mathrm{PG}(2, q)$ by powers of $\alpha$, and the numbers of the points on *any* line form a $(q^2 + q + 1,\ q + 1,\ 1)$ difference set. It used the line $z = 0$, the elements $c_0 + c_1\alpha + c_2\alpha^2$ with no $\alpha^2$ term.

That line depends on coordinates, and coordinates depend on choices. To have $c_0, c_1, c_2$ at all, we had to build $\mathrm{GF}(q^3)$ out of $\mathrm{GF}(q)$ with a cubic. But [Lesson 9](../09-fields-inside-fields/) built the same field another way, as polynomials of degree below $3e$ over $\mathrm{GF}(p)$, where $q = p^e$, and that is what the code behind this site does. In that version $\mathrm{GF}(q)$ is hidden inside the big field as $\{0\} \cup \langle \alpha^v \rangle$, and there are no $\mathrm{GF}(q)$ coordinates to set to zero.

Singer used a line that can be described with nothing but multiplication and addition in the big field, however it was built. It comes from the map that Lesson 9 previewed.

## The trace

For an element $x$ of $\mathrm{GF}(q^3)$, its **trace** is

$$
\mathrm{Tr}(x) = x + x^q + x^{q^2}.
$$

The three terms are the **conjugates** of $x$: what the Frobenius map $x \mapsto x^q$ of Lesson 9 does to $x$ once, twice, and three times ($x^{q^3} = x$ brings it home). Lesson 9 showed that applying $x \mapsto x^q$ to $\mathrm{Tr}(x)$ just shuffles the three terms, so $\mathrm{Tr}(x)$ is a fixed point of the Frobenius map. The fixed points are exactly $\mathrm{GF}(q)$, so **the trace of every element of the big field lands in the small field**.

<aside class="notation">
<span class="notation-title">Notation: the trace</span>

- $\mathrm{Tr}(x) = x + x^q + x^{q^2}$: the **trace** of $x$, an element of $\mathrm{GF}(q)$ for every $x$ in $\mathrm{GF}(q^3)$.
- $x$, $x^q$, $x^{q^2}$: the three **conjugates** of $x$. For $x = \alpha^i$ they are $\alpha^i$, $\alpha^{iq}$, and $\alpha^{iq^2}$, with exponents taken mod $q^3 - 1$, since $\alpha^{q^3 - 1} = 1$.
- $D = \{\, i \bmod v : \mathrm{Tr}(\alpha^i) = 0 \,\}$: the numbers of the points whose trace is 0.

</aside>

## The trace is linear

Lesson 13 called a map **linear** when it respects adding vectors and scaling by $\mathrm{GF}(q)$. The trace does both.

**Adding.** The freshman's dream of Lesson 9 says $(u + w)^q = u^q + w^q$, and so also $(u + w)^{q^2} = u^{q^2} + w^{q^2}$. Adding up,

$$
\mathrm{Tr}(u + w) = \mathrm{Tr}(u) + \mathrm{Tr}(w).
$$

**Scaling.** For $s$ in $\mathrm{GF}(q)$, $s^q = s$, because $\mathrm{GF}(q)$ is exactly what $x \mapsto x^q$ leaves alone. So $(s u)^q = s^q u^q = s u^q$, and likewise for $q^2$:

$$
\mathrm{Tr}(s \cdot u) = s \cdot \mathrm{Tr}(u).
$$

Now write an element in coordinates, $u = c_0 + c_1 \alpha + c_2 \alpha^2$. Linearity gives

$$
\mathrm{Tr}(u) = \mathrm{Tr}(1) \cdot c_0 + \mathrm{Tr}(\alpha) \cdot c_1 + \mathrm{Tr}(\alpha^2) \cdot c_2.
$$

That is one fixed combination of the coordinates, the kind of equation [Lesson 11](../11-coordinates/) used for lines: $ax + by + cz = 0$ with $[a : b : c] = [\mathrm{Tr}(1) : \mathrm{Tr}(\alpha) : \mathrm{Tr}(\alpha^2)]$. The three numbers can't all be 0, because then every element would have trace 0, and $y + y^q + y^{q^2} = 0$ is a polynomial equation of degree $q^2$, which has at most $q^2$ solutions, not all $q^3$ elements. So:

> **The elements with trace 0 form a plane through the origin, so they make up one line of $\mathrm{PG}(2, q)$: the trace-zero line.**

Point $i$ is on it exactly when $\mathrm{Tr}(\alpha^i) = 0$. That doesn't depend on which name of the point we use: the other names are $s \cdot \alpha^i$ for nonzero $s$ in $\mathrm{GF}(q)$ (Lesson 12), and $\mathrm{Tr}(s \cdot \alpha^i) = s \cdot \mathrm{Tr}(\alpha^i)$ is 0 exactly when $\mathrm{Tr}(\alpha^i)$ is. By Lesson 13, the numbers of the points on this line form a planar difference set:

$$
D = \{\, i \bmod v : \mathrm{Tr}(\alpha^i) = 0 \,\}.
$$

## By hand: q = 2

For $q = 2$, $v = 7$, and $\alpha^3 = \alpha + 1$ as in Lesson 12. The conjugates of $\alpha^i$ are $\alpha^i$, $\alpha^{2i}$, and $\alpha^{4i}$, with exponents mod 7. Read each power off Lesson 12's table and add, remembering that $1 + 1 = 0$:

| $i$ | $\alpha^i$ | $\alpha^{2i}$ | $\alpha^{4i}$ | $\mathrm{Tr}(\alpha^i)$ |
| --- | --- | --- | --- | --- |
| 0 | $1$ | $1$ | $1$ | $1$ |
| 1 | $\alpha$ | $\alpha^2$ | $\alpha^2 + \alpha$ | $0$ |
| 2 | $\alpha^2$ | $\alpha^2 + \alpha$ | $\alpha$ | $0$ |
| 3 | $\alpha + 1$ | $\alpha^2 + 1$ | $\alpha^2 + \alpha + 1$ | $1$ |
| 4 | $\alpha^2 + \alpha$ | $\alpha$ | $\alpha^2$ | $0$ |
| 5 | $\alpha^2 + \alpha + 1$ | $\alpha + 1$ | $\alpha^2 + 1$ | $1$ |
| 6 | $\alpha^2 + 1$ | $\alpha^2 + \alpha + 1$ | $\alpha + 1$ | $1$ |

Every sum is 0 or 1: the $\alpha$ and $\alpha^2$ terms always cancel, just as Lesson 9 promised. The trace is 0 for $i = 1, 2, 4$, so

$$
D = \{1, 2, 4\} \bmod 7.
$$

That is not the $\{0, 1, 3\}$ of Lesson 1, but it is a translate: $\{1, 2, 4\} = \{0, 1, 3\} + 1$. In coordinates, $\mathrm{Tr}(1) = 1$ and $\mathrm{Tr}(\alpha) = \mathrm{Tr}(\alpha^2) = 0$, so the trace-zero line is $c_0 = 0$, the line $x = 0$ that Lesson 12 already found holding points 1, 2, and 4. The line $z = 0$ and the trace-zero line are two different lines of the same plane, and in the Singer numbering every line is a translate of every other. This is why the site's `singerSet(2)` returns $\{1, 2, 4\}$: it computes the trace-zero line, and Lessons 1 to 13 drew the line $z = 0$.

## Step through it

The stepper runs the construction for any $q$ up to 13. Each press of **Next i** computes the three conjugates of $\alpha^i$, adds them, and keeps $i$ when the sum is 0. The chord diagram grows as members join; notice that no difference label ever repeats. At the end, the widget checks every difference and names the line it found.

<div data-widget="singer-stepper" data-q="2"></div>

Switch to $q = 3$. Now $\mathrm{Tr}(1) = 1 + 1 + 1 = 3 = 0$, because 3 is 0 in characteristic 3, so 0 joins $D$ at the very first step. With $\alpha^3 = \alpha + 2$, the trace works out to $2c_2$, so here the trace-zero line *is* the line $z = 0$, and $D = \{0, 1, 3, 9\}$ exactly as in Lesson 13. For other $q$ the two lines differ by a turn:

| $q$ | trace-zero line | $D = \{i : \mathrm{Tr}(\alpha^i) = 0\}$ | the line $z = 0$ | turn |
| --- | --- | --- | --- | --- |
| 2 | $x = 0$ | $\{1, 2, 4\}$ | $\{0, 1, 3\}$ | $+1$ |
| 3 | $z = 0$ | $\{0, 1, 3, 9\}$ | $\{0, 1, 3, 9\}$ | $+0$ |
| 4 | $x + y + z = 0$ | $\{7, 9, 14, 15, 18\}$ | $\{0, 1, 4, 14, 16\}$ | $+14$ |
| 5 | $x + 3z = 0$ | $\{1, 5, 17, 22, 23, 25\}$ | $\{0, 1, 3, 10, 14, 26\}$ | $+22$ |

## How the code does it

The function `singerSet` behind this site follows the recipe directly, in the field of Lesson 9: polynomials of degree below $3e$ over $\mathrm{GF}(p)$, modulo a primitive polynomial. It keeps three running values, $\alpha^i$, $\alpha^{iq}$, and $\alpha^{iq^2}$, all starting at 1. At each step it adds them and checks for 0, then multiplies them by $\alpha$, $\alpha^q$, and $\alpha^{q^2}$ (worked out once at the start) to move on to $i + 1$. There is no guessing anywhere: one pass through $i = 0, 1, \dots, v - 1$ and the set is done. The only search is at the very start, for a primitive polynomial, using the test of [Lesson 8](../08-primitive-elements/). That is a search over polynomials, not over sets of points, and a far smaller job; it could even be replaced by looking a polynomial up in a table.

For a prime $q$ the code uses the same cubic as the stepper, so it finds exactly the same $D$. For $q = 4$, $8$, or $9$ it builds the field from a different polynomial, so its $\alpha$ is a different primitive element, and its set is not a translate of the stepper's. For $q = 4$ it gets $\{3, 6, 7, 12, 14\}$, the mirror image of $\{7, 9, 14, 15, 18\}$. [Lesson 15](../15-many-sets-few-shapes/) shows how all of these sets are related.

## No search needed

Each step costs three multiplications in $\mathrm{GF}(q^3)$, and there are $v$ steps, so the whole construction takes about $3v$ multiplications. Compare that with the brute-force search of [Lesson 1](../01-differences-on-a-circle/), which tries every set of $q + 1$ points out of $v$:

| $q$ | $v$ | multiplications, about $3v$ | sets a brute-force search might try, $C(v, q + 1)$ |
| --- | --- | --- | --- |
| 2 | 7 | 21 | 35 |
| 3 | 13 | 39 | 715 |
| 4 | 21 | 63 | 20,349 |
| 7 | 57 | 171 | about 1.7 billion |
| 13 | 183 | 549 | about $3.3 \times 10^{20}$ |

The multiplications grow like $q^2$; the search grows far faster than that. A smarter search that backs up as soon as a difference repeats does much better than blind search, but it still slows to minutes by order 12 (the [search versus construction](../../playgrounds/search-vs-construction/?n=9) playground runs one, and [Lesson 17](../17-every-planar-set-singer/) uses it). The construction, with a few table lookups in place of polynomial arithmetic, builds a Singer set for $q = 1024$, with more than a million points, in a fraction of a second in the [large-q explorer](../../playgrounds/explorer/?q=1024).

<section class="try-it">

## Try it

Use $q = 3$, where $\alpha^3 = \alpha + 2$ and the exponents wrap around at 26.

1. The conjugates of $\alpha^4 = \alpha^2 + 2\alpha$ are $\alpha^{12} = \alpha^2 + 2$ and $\alpha^{36} = \alpha^{10} = \alpha^2 + \alpha$. What is $\mathrm{Tr}(\alpha^4)$? Is 4 in $D$?
2. For which primes $p$ is point 0 in the trace set $D$?
3. For $q = 4$ the trace set is $D = \{7, 9, 14, 15, 18\}$ mod 21. Which number $j$ makes $\{0, 1, 4, 14, 16\} + j = D$?

<details>
<summary>Show the answers</summary>

1. $(\alpha^2 + 2\alpha) + (\alpha^2 + 2) + (\alpha^2 + \alpha) = 3\alpha^2 + 3\alpha + 2 = 2$, since 3 is 0 mod 3. The trace is $2 \ne 0$, so 4 is not in $D$. The stepper shows the same three lines at $i = 4$.
2. Point 0 is $\alpha^0 = 1$, and $\mathrm{Tr}(1) = 1 + 1 + 1 = 3$. That is 0 exactly in characteristic 3, so 0 is in $D$ exactly when $p = 3$: for $q = 3$ and $q = 9$, for example.
3. Try sending 0 to each member of $D$ in turn. Sending it to 14 works: $\{0, 1, 4, 14, 16\} + 14 = \{14, 15, 18, 28, 30\} \equiv \{14, 15, 18, 7, 9\}$ mod 21, which is $D$. So $j = 14$, the turn in the table above.

</details>

</section>

The [Singer construction stepper](../../playgrounds/singer-stepper/?q=4) playground runs the same steps full-size, with $q$ and the step kept in the address bar.
