---
title: "One element to generate them all"
order: 8
part: 3
summary: "Primitive elements, whose powers visit every nonzero element; log tables; and a fast test for primitive polynomials."
status: ready
---

## You'll learn

- In every finite field, some element's powers run through *all* the nonzero elements. Such an element is called *primitive*.
- With a primitive element, multiplying becomes adding exponents, using a log table.
- How to test whether an element is primitive without listing all its powers.

## Powers of x

Take $\mathrm{GF}(8)$ from [Lesson 7](../07-prime-power-fields/): remainders mod $x^3 + x + 1$ over $\mathrm{GF}(2)$, where $x^3 \equiv x + 1$. Keep multiplying by $x$:

| power | $x^0$ | $x^1$ | $x^2$ | $x^3$ | $x^4$ | $x^5$ | $x^6$ | $x^7$ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| value | $1$ | $x$ | $x^2$ | $x + 1$ | $x^2 + x$ | $x^2 + x + 1$ | $x^2 + 1$ | $1$ |

(For example, $x^4 = x \cdot x^3 \equiv x(x + 1) = x^2 + x$.) The seven powers $x^0, \dots, x^6$ are all seven nonzero elements, and then $x^7 = 1$ starts the cycle again. Below, the nonzero elements sit around a circle in this order. Click *Multiply by g* to walk the powers of the chosen element $g$, and try other choices of $g$ and other fields.

<div data-widget="powers" data-p="2" data-e="3" data-poly="1,1,0,1" data-g="0,1"></div>

## Order and primitive elements

A few words for what the widget shows:

- For a field $F$, write $F^*$ (read "$F$ star") for its nonzero elements. A field with $q$ elements has $q - 1$ of them. Multiplying two nonzero elements always gives a nonzero element (Lesson 6), so multiplication never leaves $F^*$.
- The **order** of a nonzero element $g$ is the smallest exponent $d \ge 1$ with $g^d = 1$. Its powers $1, g, g^2, \dots, g^{d-1}$ are then $d$ different elements, and after that they repeat. We write $\langle g \rangle$ (read "the powers of $g$") for this set.
- $g$ is **primitive** when its order is $q - 1$, that is, when $\langle g \rangle = F^*$.

Primitive elements are usually called $\alpha$, the Greek letter *alpha*.

<aside class="notation">
<span class="notation-title">Notation: powers</span>

- $F^*$, read "$F$ star": the nonzero elements of a field $F$.
- $\langle g \rangle$, read "the powers of $g$": the set $\{1, g, g^2, \dots\}$.
- $\alpha$ (alpha): a primitive element, so $\langle \alpha \rangle = F^*$.
- $d \mid N$, read "$d$ divides $N$": $N$ is a whole-number multiple of $d$. For example, $3 \mid 15$.
- $\log a = i$ means $\alpha^i = a$.

</aside> A monic irreducible polynomial $f$ for which $x$ itself is primitive mod $f$ is called a **primitive polynomial**. So $x^3 + x + 1$ is a primitive polynomial over $\mathrm{GF}(2)$, and $\alpha = x$ is a primitive element of $\mathrm{GF}(8)$.

Not every irreducible polynomial is primitive. Switch the widget to $p = 2$, $e = 4$ and the modulus $x^4 + x^3 + x^2 + x + 1$: there $x^5 = 1$, so $x$ has order 5 and visits only 5 of the 15 nonzero elements. Other elements of that same field, like $x + 1$, are primitive, and the modulus $x^4 + x + 1$ is a primitive polynomial.

## Log tables: multiplying by adding

If $\alpha$ is primitive, every nonzero element is $\alpha^i$ for exactly one exponent $i$ between 0 and $q - 2$. Call that exponent the **log** of the element. Then

$$
\alpha^i \times \alpha^j = \alpha^{i + j},
$$

and since $\alpha^{q-1} = 1$, exponents can be reduced mod $q - 1$. So multiplying nonzero elements of $\mathrm{GF}(q)$ is the same as adding their logs on a clock with $q - 1$ hours. In $\mathrm{GF}(8)$, $(x^2 + x) \times (x^2 + 1) = \alpha^4 \times \alpha^6 = \alpha^{10} = \alpha^3 = x + 1$. The widget's log table and "multiply with logs" line do this for any pair. (This is how logarithm tables once sped up multiplication of ordinary numbers.)

## Every order divides q − 1

**Claim:** for every nonzero $g$ in a field with $q$ elements, $g^{q-1} = 1$.

Multiply all $q - 1$ nonzero elements together, and call the product $P$. Now multiply each of them by $g$ first. As in Lesson 5, multiplying by $g$ only shuffles the nonzero elements (row $g$ of the multiplication table is a permutation), so the product is still $P$. But it is also $g^{q-1} P$. So $g^{q-1} P = P$, and dividing by $P$ (which is nonzero) gives $g^{q-1} = 1$.

So the order $d$ of $g$ **divides** $q - 1$, written $d \mid q - 1$. Indeed, divide $q - 1$ by $d$: $q - 1 = s d + t$ with remainder $0 \le t < d$. Then $g^t = g^{q-1} / (g^d)^s = 1$, and since $d$ is the smallest positive exponent giving 1, $t = 0$.

## A fast test for primitive elements

If $g$ is *not* primitive, its order $d$ is a divisor of $q - 1$ smaller than $q - 1$. Some prime $r$ appears fewer times in the factorization of $d$ than in that of $q - 1$, and then $d$ divides $(q - 1)/r$, so $g^{(q-1)/r} = 1$. That gives a test which needs only one power per prime factor:

> $g$ is primitive exactly when $g^{(q-1)/r} \ne 1$ for every prime $r$ dividing $q - 1$.

In $\mathrm{GF}(16)$, $q - 1 = 15 = 3 \times 5$, so it is enough to check $g^5 \ne 1$ and $g^3 \ne 1$. The widget runs this test for every $g$ you pick. For a field with millions of elements, this is the difference between a handful of multiplications and millions of them, and it is how the code behind this site finds primitive polynomials for Singer's construction.

## Do primitive elements always exist?

Yes: every finite field has a primitive element, and every $\mathrm{GF}(p)$ has a primitive polynomial of every degree $e$. Here is a sketch of the first fact for readers who want it.

<details>
<summary>Why a primitive element always exists (sketch)</summary>

Write $\varphi(d)$ (the Greek letter *phi*) for the number of whole numbers from 1 to $d$ that share no factor with $d$; for example $\varphi(6) = 2$, counting 1 and 5.

Fix a divisor $d$ of $q - 1$. If some $g$ has order $d$, its $d$ powers are $d$ different solutions of $y^d = 1$. A polynomial of degree $d$ has at most $d$ roots in a field (each root $c$ splits off a factor $y - c$, and with no zero divisors a product is 0 only when a factor is), so these powers are *all* the solutions. Among them, $g^j$ has order exactly $d$ when $j$ shares no factor with $d$. So for each $d$, either no element has order $d$, or exactly $\varphi(d)$ do.

Every nonzero element has some order dividing $q - 1$, so adding up over all divisors $d$ of $q - 1$ must give $q - 1$ elements. A classical identity says that for any whole number, adding up $\varphi(d)$ over all its divisors $d$ gives back the number itself (for 6: $\varphi(1) + \varphi(2) + \varphi(3) + \varphi(6) = 1 + 1 + 2 + 2 = 6$). So no divisor can be skipped, and in particular there are $\varphi(q - 1) \ge 1$ elements of order $q - 1$.

</details>

That existence is what Singer's construction runs on: Part IV takes a primitive element $\alpha$ of $\mathrm{GF}(q^3)$, whose powers number every point of a projective plane.

<section class="try-it">

## Try it

Work in $\mathrm{GF}(9)$, built mod $x^2 + 1$ over $\mathrm{GF}(3)$, so $x^2 \equiv -1 \equiv 2$.

1. What is the order of $x$? Is $x$ primitive?
2. Is $x + 1$ primitive? Use the fast test.

<details>
<summary>Show the answers</summary>

1. $x^2 = 2$ and $x^4 = 2^2 = 4 \equiv 1$, so $x$ has order 4, not $9 - 1 = 8$. Not primitive.
2. $8 = 2^3$ has the single prime factor 2, so we only need $(x + 1)^{8/2} = (x + 1)^4 \ne 1$. Now $(x + 1)^2 = x^2 + 2x + 1 = 2 + 2x + 1 = 2x$, so $(x + 1)^4 = (2x)^2 = 4x^2 = x^2 = 2 \ne 1$. Primitive.

</details>

</section>

Walk the powers of every element in a larger field in the [finite field calculator](../../playgrounds/field-calculator/?p=2&e=4&poly=1,1,1,1,1).
