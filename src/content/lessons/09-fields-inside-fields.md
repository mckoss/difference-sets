---
title: "Fields inside fields"
order: 9
part: 3
summary: "The freshman's dream, the Frobenius map x ↦ x^q, and how GF(q) sits inside GF(q³)."
status: ready
---

## You'll learn

- In a field of characteristic $p$, $(a + b)^p = a^p + b^p$. This "freshman's dream" is actually true there.
- The *Frobenius map* $x \mapsto x^q$ rearranges a field while respecting its arithmetic, and the elements it leaves alone form a smaller field.
- Inside $\mathrm{GF}(q^3)$ with primitive element $\alpha$, the field $\mathrm{GF}(q)$ is $\{0\} \cup \langle \alpha^{q^2 + q + 1} \rangle$, and $\mathrm{GF}(q^3)$ itself can be built as polynomials of degree below $3e$ over $\mathrm{GF}(p)$.

## Why we need this

Singer's construction lives in a big field, $\mathrm{GF}(q^3)$, but its projective plane has coordinates from the small field $\mathrm{GF}(q)$. Part IV needs to see the small field *inside* the big one, and Part V needs a map, the trace, that carries big-field elements down to small-field ones. Both come from one simple map.

## The freshman's dream

Beginning algebra students sometimes write $(a + b)^2 = a^2 + b^2$, which is wrong for ordinary numbers because it drops the $2ab$. But in a field of characteristic 2, $2ab = ab + ab = 0$, so there it is right. The same thing happens for every prime $p$. By the binomial theorem,

$$
(a + b)^p = a^p + \binom{p}{1} a^{p-1} b + \binom{p}{2} a^{p-2} b^2 + \dots + \binom{p}{p-1} a b^{p-1} + b^p.
$$

Here $\binom{p}{i}$, read "$p$ choose $i$", is the binomial coefficient: the number of ways to choose $i$ things out of $p$. Each middle coefficient $\binom{p}{i} = \frac{p!}{i!\,(p - i)!}$, with $0 < i < p$, is a whole number divisible by $p$: the factor $p$ appears on top, and nothing on the bottom can cancel it, because every factor there is smaller than the prime $p$. For $p = 3$ the coefficients are $1, 3, 3, 1$; for $p = 5$ they are $1, 5, 10, 10, 5, 1$. In characteristic $p$, a multiple of $p$ is 0 (Lesson 6), so all the middle terms vanish:

$$
(a + b)^p = a^p + b^p.
$$

Multiplication was never a problem: $(ab)^p = a^p b^p$ in any field. Applying the dream again and again, the same two rules hold for $x \mapsto x^{p^j}$, for any $j$.

## The Frobenius map

In a field $F$ of characteristic $p$, the **Frobenius map** (after the mathematician Georg Frobenius) sends each element $x$ to $x^p$. More generally, for $q = p^j$ we look at $x \mapsto x^q$. By the freshman's dream, it respects both operations:

$$
(a + b)^q = a^q + b^q, \qquad (ab)^q = a^q b^q.
$$

It is also one-to-one: if $a^q = b^q$, then $(a - b)^q = 0$, so $a - b = 0$. In a finite field, one-to-one means it is a permutation of the elements. So the Frobenius map is a *renaming of the field onto itself*, an isomorphism from $F$ to $F$.

Here it is on $\mathrm{GF}(8)$. Each nonzero element is written $\alpha^i$ for a primitive $\alpha$ (Lesson 8) and drawn at position $i$ on the circle. Since $(\alpha^i)^2 = \alpha^{2i}$, the map $x \mapsto x^2$ sends position $i$ to position $2i$, counted on a clock with 7 hours (exponents wrap around at 7, because $\alpha^7 = 1$).

<div data-widget="frobenius" data-field="8" data-q="2"></div>

In $\mathrm{GF}(8)$, $x \mapsto x^2$ moves every element except 0 and 1, in two cycles of length 3. Applying it three times returns everything home, since $x^8 = x$ for every $x$ (Lesson 8 showed $x^7 = 1$ for $x \ne 0$). Below the picture you can check the freshman's dream on any pair of elements.

## What the Frobenius map leaves alone

Call $x$ a **fixed point** of $x \mapsto x^q$ when $x^q = x$.

**The fixed points form a subfield.** If $a^q = a$ and $b^q = b$, then $(a + b)^q = a^q + b^q = a + b$ and $(ab)^q = ab$, and likewise $-a$ and $a^{-1}$ are fixed. So the fixed points are closed under all four operations: a field inside $F$.

**There are at most $q$ of them.** Fixed points are roots of the polynomial $y^q - y$, which has degree $q$. A polynomial of degree $q$ has at most $q$ roots in a field: each root $c$ splits off a factor $y - c$, and with no zero divisors, a product is 0 only when one of its factors is.

For $q = p$, the prime subfield gives $p$ fixed points: each $c = 1 + \dots + 1$ has $c^p = 1^p + \dots + 1^p = c$ by the dream. So $x \mapsto x^p$ fixes exactly $\mathrm{GF}(p)$, as the $\mathrm{GF}(8)$ picture shows.

## GF(q) inside GF(q³)

Now the case Singer needs. Let $F = \mathrm{GF}(q^3)$ and let $\alpha$ be a primitive element, so $\alpha$ has order $q^3 - 1$. The key number is

$$
v = q^2 + q + 1,
$$

the number of points of a projective plane of order $q$ ([Lesson 4](../04-projective-planes/)). It enters because $q^3 - 1$ factors as

$$
q^3 - 1 = (q - 1)(q^2 + q + 1) = (q - 1)\,v.
$$

So $\beta = \alpha^v$ (the Greek letter *beta*) has order exactly $q - 1$. Its powers $1, \beta, \dots, \beta^{q-2}$ are $q - 1$ different nonzero elements, and each satisfies $y^{q-1} = 1$, so $y^q = y$: all are fixed by $x \mapsto x^q$. Together with 0, that is $q$ fixed points, the most there can be. So the fixed points are exactly the set below, where $\cup$ ("union") combines two sets into one:

$$
\{0\} \cup \langle \alpha^v \rangle = \{0, 1, \alpha^v, \alpha^{2v}, \dots, \alpha^{(q-2)v}\},
$$

and they form a field with $q$ elements. That is $\mathrm{GF}(q)$, sitting inside $\mathrm{GF}(q^3)$. Its nonzero elements are the powers of $\alpha$ whose exponents are multiples of $v$.

Try $\mathrm{GF}(27)$ with $q = 3$: here $v = 13$ and the fixed points are $0$, $1 = \alpha^0$, and $2 = \alpha^{13}$. Then try $\mathrm{GF}(64)$ with $q = 4$:

<div data-widget="frobenius" data-field="64" data-q="4"></div>

Here $v = 21$, and $x \mapsto x^4$ fixes $0, 1, \alpha^{21}, \alpha^{42}$: a copy of $\mathrm{GF}(4)$. Every other element lies in a cycle of length 3, because applying the map three times gives $x^{q^3} = x$. Switch to $q = 2$ in the same field to see $\mathrm{GF}(2)$, and to $q = 8$ to see a copy of $\mathrm{GF}(8)$ (fixed points $\{0\} \cup \langle \alpha^9 \rangle$). In general, a copy of $\mathrm{GF}(p^a)$ sits inside $\mathrm{GF}(p^b)$ exactly when $a$ divides $b$; we need only the case above.

## Building GF(q³) directly

For $q = p^e$, the big field has $q^3 = p^{3e}$ elements. Lesson 7 builds it in one step: take a primitive polynomial $f$ of degree $3e$ over $\mathrm{GF}(p)$, and work with remainders mod $f$, which are polynomials of degree below $3e$ with coefficients mod $p$. Then $\alpha = x$ is primitive, $\mathrm{GF}(q)$ is found inside as $\{0\} \cup \langle \alpha^v \rangle$, and there is never any need to construct $\mathrm{GF}(q)$ separately. This is exactly what the code behind this site does.

For $q = 4$ (so $p = 2$, $e = 2$), $\mathrm{GF}(64)$ is the remainders mod $x^6 + x + 1$ over $\mathrm{GF}(2)$, and the copy of $\mathrm{GF}(4)$ inside it is

$$
\{\,0,\ 1,\ x^5 + x^4 + x^3 + x + 1,\ x^5 + x^4 + x^3 + x\,\},
$$

as listed under the widget above. Notice that the last two add up to 1, just as $x$ and $x + 1$ do in the $\mathrm{GF}(4)$ of Lesson 7.

<aside class="notation">
<span class="notation-title">Notation: maps on a field</span>

- $x \mapsto x^q$: the Frobenius map, raising every element to the power $q$.
- A **fixed point** of a map is an element it sends to itself.
- $\beta$ (beta) $= \alpha^v$, an element of order $q - 1$, with $v = q^2 + q + 1$.
- $\{0\} \cup \langle \alpha^v \rangle$: the element 0 together with all powers of $\alpha^v$. This is $\mathrm{GF}(q)$ inside $\mathrm{GF}(q^3)$.
- $\mathrm{Tr}(x) = x + x^q + x^{q^2}$: the trace, defined below.

</aside>

## A preview of the trace

Applying the map $x \mapsto x^q$ to a sum of all three of its "positions",

$$
\mathrm{Tr}(x) = x + x^q + x^{q^2},
$$

gives $x^q + x^{q^2} + x^{q^3} = x^q + x^{q^2} + x$, the same three terms in a new order. So $\mathrm{Tr}(x)$ is always a fixed point: the **trace** carries every element of $\mathrm{GF}(q^3)$ down to $\mathrm{GF}(q)$, and by the freshman's dream it respects addition. [Lesson 14](../14-writing-down-a-difference-set/) uses exactly this map to write down a Singer difference set.

<section class="try-it">

## Try it

Work in $\mathrm{GF}(16) = \mathrm{GF}(2^4)$ with a primitive element $\alpha$.

1. Which elements does $x \mapsto x^4$ fix?
2. Which elements does $x \mapsto x^8$ fix?

<details>
<summary>Show the answers</summary>

1. The fixed points are roots of $y^4 = y$: $0$ and the nonzero $y$ with $y^3 = 1$. Since $16 - 1 = 15 = 3 \times 5$, $\alpha^5$ has order 3, so the fixed points are $\{0, 1, \alpha^5, \alpha^{10}\}$, a copy of $\mathrm{GF}(4)$.
2. $(\alpha^i)^8 = \alpha^i$ means $8i \equiv i \pmod{15}$, so $15$ divides $7i$, so $15$ divides $i$. Only $0$ and $1$ are fixed: $\mathrm{GF}(8)$ does not fit inside $\mathrm{GF}(16)$, since 3 does not divide 4.

Check both with the widget: choose GF(16) and $q = 4$, then $q = 8$.

</details>

</section>

See the Frobenius map, powers, and tables of $\mathrm{GF}(64)$ together in the [finite field calculator](../../playgrounds/field-calculator/?p=2&e=6&poly=1,1,0,0,0,0,1).
