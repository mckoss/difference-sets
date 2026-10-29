---
title: "Every field with p elements is ℤ/pℤ"
order: 6
part: 3
summary: "Counting 1, 1 + 1, 1 + 1 + 1, … inside any finite field: the characteristic, the prime subfield, and why there is only one field of each prime size."
status: ready
---

## You'll learn

- Inside any finite field, adding 1 to itself returns to 0 after a prime number of steps, called the *characteristic*.
- Those sums of 1 form a copy of the clock $\mathrm{GF}(p)$, the *prime subfield*.
- So a field with exactly $p$ elements is $\mathbb{Z}/p\mathbb{Z}$ with its elements renamed, and every finite field has a prime power number of elements.

## A field you have never seen

[Lesson 5](../05-which-clocks-are-fields/) found fields among the clocks. But a field is anything that obeys the rules, and its elements do not have to be numbers. Here is a field with 5 elements, called A, B, C, D, and E, given only by its addition and multiplication tables. The names were handed out in a random order, so the tables look like noise.

<div data-widget="scrambled-field" data-p="5" data-seed="7"></div>

Click through the steps. First find the element that acts like 0 (adding it changes nothing, so its row of the addition table copies the header), then the one that acts like 1 (its row of the multiplication table copies the header). Then keep adding 1. Each new sum names another element: the one equal to $1 + 1$ gets the label 2, the one equal to $1 + 1 + 1$ gets 3, and so on. After $p$ additions you are back at 0, every element has a number, and when the tables are sorted by those numbers they become ordinary clock arithmetic mod 5.

Try $p = 7$ or 11, and press *Scramble again*: it always works. The rest of this lesson explains why.

## Counting with 1

Let $F$ be any finite field. For a whole number $s$, write $s \cdot 1$ for $1 + 1 + \dots + 1$ with $s$ ones. (This is repeated addition, not multiplication by an element of $F$; $F$ might not contain anything called "$s$".)

There are only finitely many elements, so the list $1 \cdot 1, 2 \cdot 1, 3 \cdot 1, \dots$ must repeat: $s \cdot 1 = s' \cdot 1$ for some $s > s'$. Subtracting, $(s - s') \cdot 1 = 0$. So some number of ones adds up to 0. The smallest such number is called the **characteristic** of $F$, and we call it $p$.

**The characteristic is prime.** Suppose instead $p = a \times b$ with $a$ and $b$ both smaller than $p$. Multiplying out a sum of $a$ ones by a sum of $b$ ones gives $a \times b$ ones, so

$$
(a \cdot 1) \times (b \cdot 1) = p \cdot 1 = 0.
$$

But in a field, two nonzero elements never multiply to 0: if $x \ne 0$ and $x y = 0$, then $y = x^{-1}(x y) = x^{-1} \cdot 0 = 0$. So $a \cdot 1 = 0$ or $b \cdot 1 = 0$, and either one contradicts $p$ being the *smallest* count of ones that gives 0.

## A copy of the clock inside every field

The $p$ elements $0, 1 \cdot 1, 2 \cdot 1, \dots, (p - 1) \cdot 1$ are all different: if two were equal, subtracting would give a smaller count of ones adding to 0. And they calculate exactly like the clock with $p$ hours:

$$
(a \cdot 1) + (b \cdot 1) = (a + b) \cdot 1, \qquad (a \cdot 1) \times (b \cdot 1) = (a b) \cdot 1,
$$

where $a + b$ and $a b$ may be reduced mod $p$, because $p \cdot 1 = 0$.

Two words make this precise.

- A **subfield** of $F$ is a subset that is a field by itself, using the same addition and multiplication. The sums of 1 are a subfield, called the **prime subfield** of $F$.
- An **isomorphism** between two fields is a renaming: a one-to-one matching of the elements of one with the elements of the other that turns its addition and multiplication tables into the other's. Isomorphic fields are the same field with different labels.

<aside class="notation">
<span class="notation-title">Notation: counting with 1, and renaming</span>

- $s \cdot 1$ means $1 + 1 + \dots + 1$ with $s$ ones: repeated addition inside the field.
- The **characteristic** of a finite field is the smallest number of ones that add up to 0. It is always a prime, written $p$.
- $x \mapsto y$, read "$x$ goes to $y$", describes a rule that turns each $x$ into $y$. For example, $s \mapsto s \cdot 1$ turns each whole number $s$ into the sum of $s$ ones.
- $F \cong G$, read "$F$ is isomorphic to $G$", means $F$ and $G$ are the same field with different labels.

</aside>

The matching $s \mapsto s \cdot 1$ is an isomorphism from $\mathbb{Z}/p\mathbb{Z}$ onto the prime subfield. That is what the widget did when it named each letter by its count of ones.

## Only one field of each prime size

If $F$ has exactly $p$ elements and its characteristic is $p$, the prime subfield already uses all of them. So $F$ *is* $\mathbb{Z}/p\mathbb{Z}$, renamed. What if $F$ has $p$ elements but a different characteristic $r$? Its prime subfield would have $r$ elements, and the next section shows that the size of $F$ is then a power of $r$; since $p$ is prime, $r = p$.

> Up to renaming, there is exactly one field with $p$ elements, for each prime $p$: $\mathrm{GF}(p) = \mathbb{Z}/p\mathbb{Z}$.

## Every finite field has $p^e$ elements

Inside a finite field $F$ of characteristic $p$, the prime subfield $\mathrm{GF}(p)$ acts like a set of "scalars". Pick elements of $F$ one at a time:

1. Start with $b_1 = 1$. Its multiples $c_1 b_1$, for $c_1$ in $\mathrm{GF}(p)$, are $p$ different elements.
2. If they are not all of $F$, pick some $b_2$ that is not among them. The combinations $c_1 b_1 + c_2 b_2$ are $p^2$ different elements. (If two were equal, subtracting would write $b_2$ as a multiple of $b_1$, which we ruled out.)
3. Keep going. Each new pick multiplies the count by $p$, and since $F$ is finite, this stops after some number $e$ of picks, with every element of $F$ written in exactly one way as $c_1 b_1 + \dots + c_e b_e$.

So $F$ has exactly $p^e$ elements. In the language of [Lesson 10](../10-vectors-over-a-finite-field/), $F$ is a vector space over $\mathrm{GF}(p)$, and each element is a list of $e$ coordinates $(c_1, \dots, c_e)$.

Throughout the site, $q = p^e$ stands for the size of a finite field, with $p$ its characteristic and $e$ the exponent. There is no field with 6, 10, or 12 elements, because those are not prime powers. Fields with 4, 8, 9, 16, … elements do exist, but they are *not* clocks, since $\mathbb{Z}/4\mathbb{Z}$ has the zero divisor $2 \times 2 = 0$. The next lesson builds them from polynomials.

<section class="try-it">

## Try it

1. In a field with 8 elements, what is $1 + 1$?
2. Can a field have 15 elements?

<details>
<summary>Show the answers</summary>

1. The size is a power of the characteristic, and $8 = 2^3$, so the characteristic is 2 and $1 + 1 = 0$.
2. No. $15 = 3 \times 5$ is not a power of a single prime.

</details>

</section>

Compare the clocks with 5 and 6 hours in the [finite field calculator](../../playgrounds/field-calculator/?v=5).
