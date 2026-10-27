---
title: "Fields with pᵉ elements, built from polynomials"
order: 7
part: 3
summary: "Polynomials with coefficients mod p, divided by an irreducible polynomial: irreducible polynomials play the role of primes."
status: ready
---

## You'll learn

- How to do arithmetic with polynomials whose coefficients are numbers mod $p$, and how to divide one by another with a remainder.
- Why remainders modulo an *irreducible* polynomial $f$ of degree $e$ form a field with $p^e$ elements.
- How to build $\mathrm{GF}(4)$, $\mathrm{GF}(8)$, and $\mathrm{GF}(9)$, and why two different choices of $f$ give the same field.

## The plan: copy Lesson 5

[Lesson 6](../06-fields-of-prime-order/) showed that a finite field has $q = p^e$ elements, and that for $e > 1$ it cannot be a clock. We need a new raw material, and polynomials work, because they behave remarkably like whole numbers:

| Whole numbers | Polynomials over $\mathrm{GF}(p)$ |
| --- | --- |
| divide with a remainder smaller than the divisor | divide with a remainder of smaller *degree* |
| primes: no factors except 1 and themselves | **irreducible** polynomials: no factors of smaller degree |
| remainders mod $v$: $\mathbb{Z}/v\mathbb{Z}$ | remainders mod $f(x)$ |
| a field exactly when $v$ is prime | a field exactly when $f$ is irreducible |

## Polynomials with clock coefficients

A **polynomial over $\mathrm{GF}(p)$** is an expression like $x^3 + 2x + 1$ whose coefficients are numbers mod $p$. Here $x$ is just a symbol; we never plug in a value for it unless we say so. Add and multiply as in high-school algebra, then reduce each coefficient mod $p$. Over $\mathrm{GF}(2)$, where $1 + 1 = 0$:

$$
(x^2 + x) + (x + 1) = x^2 + 2x + 1 = x^2 + 1, \qquad (x + 1)^2 = x^2 + 2x + 1 = x^2 + 1.
$$

Notice that over $\mathrm{GF}(2)$ subtracting is the same as adding, since $-1 = 1$.

The **degree** of a polynomial is its highest power of $x$. To divide $a(x)$ by $f(x)$, do long division: divide the leading terms, subtract that multiple of $f$, and repeat until what is left has smaller degree than $f$. What is left is the **remainder**, written $a(x) \bmod f(x)$.

<aside class="notation">
<span class="notation-title">Notation: polynomials</span>

- $f(x)$, $a(x)$, … name polynomials in the symbol $x$. Writing $f(c)$ means "replace $x$ by the number $c$ and calculate".
- The **degree** of a polynomial is its highest power of $x$: $x^3 + x + 1$ has degree 3.
- $a(x) \bmod f(x)$ is the remainder of $a(x)$ after long division by $f(x)$, and $a(x) \equiv b(x) \pmod{f(x)}$ means they leave the same remainder.
- $q = p^e$ is the size of a finite field: $p$ is the prime from Lesson 6, and the exponent $e$ is the degree of the polynomial $f$ used to build it.

</aside>

<div data-widget="poly-division" data-p="2" data-a="x^5 + x^2 + 1" data-b="x^3 + x + 1"></div>

You can type your own polynomials (use `^` for powers) and change $p$.

## Remainders form a number system

Fix a polynomial $f(x)$ of degree $e$ whose leading coefficient is 1 (such an $f$ is called *monic*). The possible remainders mod $f$ are the polynomials of degree less than $e$,

$$
a_0 + a_1 x + \dots + a_{e-1} x^{e-1},
$$

with each coefficient $a_i$ one of the $p$ numbers mod $p$. That makes $p^e$ remainders. Each one is a list of $e$ coefficients, which is exactly the "$e$ coordinates over $\mathrm{GF}(p)$" picture from Lesson 6. The widgets also write a remainder as its string of coefficient digits, highest power first, so over $\mathrm{GF}(2)$ the remainder $x^2 + 1$ is written $101$.

To add two remainders, add them as polynomials. To multiply, multiply as polynomials, then take the remainder mod $f$. This is clock arithmetic, with $f(x)$ playing the role of the number of hours.

Here is the smallest example that is not a clock: $p = 2$ and $f(x) = x^2 + x + 1$. The four remainders are $0, 1, x, x + 1$. The only new rule is how to reduce $x^2$: since $x^2 + x + 1 \equiv 0$, we have $x^2 \equiv x + 1$ (over $\mathrm{GF}(2)$, moving terms across the equals sign doesn't change their sign). So, for instance, $x \times (x + 1) = x^2 + x \equiv (x + 1) + x = 1$.

<div data-widget="gf-tables" data-p="2" data-e="2" data-poly="1,1,1"></div>

Every nonzero row of the multiplication table contains a 1, so this is a field with 4 elements, $\mathrm{GF}(4)$. It is not $\mathbb{Z}/4\mathbb{Z}$: in $\mathrm{GF}(4)$, $1 + 1 = 0$, while on the 4-hour clock $1 + 1 = 2$.

## Irreducible polynomials are the primes

A polynomial is **irreducible** over $\mathrm{GF}(p)$ if it cannot be written as a product of two polynomials of smaller degree (each of degree at least 1). Otherwise it is **reducible**.

**Reducible moduli give zero divisors.** If $f = g \times h$ with $g$ and $h$ of smaller degree, then $g$ and $h$ are nonzero remainders, but $g \times h = f \equiv 0$. The argument from Lesson 5 then shows $g$ has no inverse. Try it in the widget above: choose the modulus $x^2 + 1$, which over $\mathrm{GF}(2)$ equals $(x + 1)^2$, and watch $x + 1$ turn red.

**Irreducible moduli give fields.** If $f$ is irreducible and $a(x)$ is a nonzero remainder, then $a$ and $f$ have no common factor of degree 1 or more (the only factors of $f$ are constants and constant multiples of $f$ itself, which has larger degree than $a$). The extended Euclidean algorithm from Lesson 5 works for polynomials too, using long division in place of whole-number division. It produces polynomials $s(x)$ and $t(x)$ with

$$
s(x)\,a(x) + t(x)\,f(x) = 1.
$$

Modulo $f$, the second term is 0, so $s(x)\,a(x) \equiv 1$: the remainder of $s(x)$ is the inverse of $a(x)$. Click any row label in the table to see its inverse and the $s$ and $t$ that produce it.

> The remainders modulo an irreducible polynomial of degree $e$ over $\mathrm{GF}(p)$ form a field with $p^e$ elements.

**A quick test for degree 2 or 3.** If such an $f$ factors, one factor has degree 1, so it looks like $x - c$, and then $f(c) = 0$. So $f$ of degree 2 or 3 is irreducible exactly when no number $c$ mod $p$ is a root. For example, $x^3 + x + 1$ over $\mathrm{GF}(2)$ has $f(0) = 1$ and $f(1) = 3 \equiv 1$, so it is irreducible and gives $\mathrm{GF}(8)$. And $x^2 + 1$ over $\mathrm{GF}(3)$ has values $1, 2, 2$ at $0, 1, 2$, so it gives $\mathrm{GF}(9)$. (For degree 4 and up, this test is not enough: over $\mathrm{GF}(2)$, $(x^2 + x + 1)^2$ has no roots but is reducible.)

Use the selectors above to build $\mathrm{GF}(8)$ ($p = 2$, $e = 3$) and $\mathrm{GF}(9)$ ($p = 3$, $e = 2$). The modulus menu groups every monic polynomial of the chosen degree into irreducible and reducible ones.

**Do irreducible polynomials always exist?** Yes: for every prime $p$ and every degree $e$ there is at least one, so a field with $p^e$ elements always exists. We state this without proof. Over $\mathrm{GF}(2)$ there are 2, 1, 2, 3, 6, and 9 irreducible polynomials of degrees 1 through 6, and a formula due to Gauss counts them in general.

## Different moduli, same field

Over $\mathrm{GF}(2)$, both $x^3 + x + 1$ and $y^3 + y^2 + 1$ are irreducible, so each gives a field with 8 elements. Their multiplication tables look different. Are they different fields?

No. In the second field, look for an element $r$ with $r^3 + r + 1 = 0$: a root of the first modulus. Since $x$ satisfies that same equation in the first field, renaming every $a(x)$ as $a(r)$ carries every calculation in the first field to a valid calculation in the second. The widget finds $r$ and checks every sum and product.

<div data-widget="field-isomorphism" data-p="2" data-e="3" data-a="1,1,0,1" data-b="1,0,1,1"></div>

This always works: for every prime power $q$, any two fields with $q$ elements are isomorphic. The proof needs more machinery than we develop here, so we take it as a fact, which the widget lets you test for any pair of moduli. That is why it makes sense to speak of *the* field with $q$ elements, written $\mathrm{GF}(q)$. The choice of $f$ only chooses the labels.

<section class="try-it">

## Try it

1. In $\mathrm{GF}(4)$, built mod $x^2 + x + 1$ over $\mathrm{GF}(2)$, what is the inverse of $x$?
2. Is $x^2 + x + 1$ irreducible over $\mathrm{GF}(3)$?

<details>
<summary>Show the answers</summary>

1. $x \times (x + 1) = x^2 + x \equiv (x + 1) + x = 1$, so $x^{-1} = x + 1$.
2. No. $f(1) = 3 \equiv 0$, so $x - 1$ is a factor. Indeed $(x + 2)^2 = x^2 + 4x + 4 \equiv x^2 + x + 1$ over $\mathrm{GF}(3)$, and $x + 2 = x - 1$ there.

</details>

</section>

Build any field up to 64 elements, with its tables, in the [finite field calculator](../../playgrounds/field-calculator/?p=3&e=2&poly=1,0,1).
