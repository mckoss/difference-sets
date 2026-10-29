---
title: "Which clocks are fields"
order: 5
part: 3
summary: "The field axioms, and why clock arithmetic ℤ/vℤ is a field exactly when v is prime."
status: ready
---

## You'll learn

- What a *field* is: a number system where you can add, subtract, multiply, and divide by anything except 0.
- Why a clock with 6 hours fails, and a clock with 7 hours succeeds.
- How to find a multiplicative inverse ("one divided by a") on a clock without trying every number.

## Clocks, again

[Lesson 1](../01-differences-on-a-circle/) did arithmetic on a clock: with $v$ hours, you add or multiply as usual and then keep only the remainder after dividing by $v$. The set of hours $\{0, 1, \dots, v - 1\}$ with that arithmetic is written $\mathbb{Z}/v\mathbb{Z}$, read "the integers mod $v$", and $a \equiv b \pmod v$ means $a$ and $b$ land on the same hour.

For example, on a clock with 7 hours, $5 + 4 = 9 \equiv 2$ and $3 \times 5 = 15 \equiv 1 \pmod 7$.

Singer's construction needs more than clock arithmetic: it needs a number system in which every calculation of ordinary algebra still works, including division. This lesson asks which clocks give one.

## What a field is

A **field** is a collection of objects over which two operations, addition and multiplication, are defined with the following properties. (We call the objects *numbers*, even though in later lessons they won't look like ordinary numbers.)

| Rule | In words |
| --- | --- |
| Order doesn't matter | $a + b = b + a$ and $a \times b = b \times a$ |
| Grouping doesn't matter | $(a + b) + c = a + (b + c)$, and the same for $\times$ |
| Multiplying spreads over adding | $a \times (b + c) = a \times b + a \times c$ |
| There are a 0 and a 1 (different from each other) | $a + 0 = a$ and $a \times 1 = a$ |
| Every number has a negative (its **additive inverse**) | some $-a$ has $a + (-a) = 0$, so subtraction works |
| Every number except 0 has a **multiplicative inverse** | some $a^{-1}$ (read "$a$ inverse") has $a \times a^{-1} = 1$, so division works |

From here on, "inverse" on its own always means the multiplicative inverse, the one that makes division work.

The fractions (rational numbers) form a field, and so do the real numbers. The whole numbers $\dots, -1, 0, 1, 2, \dots$ do not: 2 has no multiplicative inverse among them, because $\tfrac12$ is not a whole number.

Clock arithmetic inherits the first five rules from ordinary whole-number arithmetic, because taking remainders at the end gives the same answer as taking them along the way. The negative of $a$ on a $v$-hour clock is $v - a$. So the only question is the last rule: **does every nonzero hour have a multiplicative inverse?**

## Look at the multiplication tables

Here is multiplication on a clock with 7 hours. Green cells are where a product equals 1, so they pair each number with its inverse. A ✓ marks a row that is a **permutation**: it contains every hour exactly once, in some shuffled order.

<div data-widget="zn-tables" data-v="7"></div>

Every nonzero row of the 7-hour table is a permutation, so every row contains a 1, and every nonzero number has an inverse: $3^{-1} = 5$ because $3 \times 5 = 15 \equiv 1$. Now switch the widget to $v = 6$. Row 2 reads $0, 2, 4, 0, 2, 4$: it repeats, never reaches 1, and hits 0 at $2 \times 3$. The red cells mark these products.

Two nonzero numbers whose product is 0 are called **zero divisors**. Ordinary numbers never do this, but clocks can.

## Multiplying is jumping

Multiplying $a \times b$ on a clock is the same as starting at 0 and jumping $a$ hours, $b$ times. On the 7-hour clock, jumps of 3 visit every hour before coming home. On a 6-hour clock, jumps of 2 come back to 0 after only three jumps and never touch the odd hours.

<div data-widget="zn-clock" data-v="7" data-a="3"></div>

Try $v = 6$ with jumps of 2, 3, 4, and 5, and then $v = 12$. The jumps that visit every hour are exactly the ones that share no factor with $v$.

## Why composite clocks fail

Suppose $v$ is not prime, so $v = a \times b$ with $a$ and $b$ both between 1 and $v$. Then $a \times b \equiv 0 \pmod v$, so $a$ is a zero divisor. A zero divisor can never have an inverse. If $a \times c \equiv 1$, then

$$
b \equiv b \times (a \times c) \equiv (b \times a) \times c \equiv 0 \times c \equiv 0,
$$

which contradicts $b$ being between 1 and $v$. So $\mathbb{Z}/6\mathbb{Z}$, $\mathbb{Z}/4\mathbb{Z}$, and every other composite clock break the last rule.

## Why prime clocks succeed

Now let $v = p$ be prime and $a$ a nonzero hour. Could row $a$ of the table repeat a value, $a \times b \equiv a \times c$ with $b \ne c$? Then $p$ divides $a \times (b - c)$. A prime that divides a product divides one of the factors (this is *Euclid's lemma*), and $p$ does not divide $a$ or $b - c$, which are both smaller than $p$ and not 0. So the row never repeats. It has $p$ entries, all different, so it is a permutation and contains a 1 somewhere. That entry is the inverse of $a$.

## Finding an inverse quickly

For a large prime, reading across a row is slow. The **extended Euclidean algorithm** finds the inverse directly. Divide $v$ by $a$ and keep the remainder, then divide the previous divisor by that remainder, and so on, the way you would to find a greatest common divisor. Along the way, keep track of how each remainder is built from $v$ and $a$. When the remainder reaches 1, you have $1 = x \times v + y \times a$, and since $x \times v \equiv 0$, this says $y \times a \equiv 1$: $y$ is the inverse.

<div data-widget="euclid" data-a="5" data-v="13"></div>

Step through it for $a = 5$, $v = 13$: the remainders are 13, 5, 3, 2, 1, and the last line says $1 = 2 \times 13 + (-5) \times 5$. So $5^{-1} \equiv -5 \equiv 8$, and indeed $5 \times 8 = 40 = 3 \times 13 + 1$. If $a$ and $v$ share a factor, the remainders stop at that factor instead of 1, and there is no inverse.

## The conclusion

> $\mathbb{Z}/v\mathbb{Z}$ is a field exactly when $v$ is prime.

For a prime $p$, this field is called $\mathrm{GF}(p)$. So $\mathrm{GF}(7)$ is the 7-hour clock, and $\mathrm{GF}(2)$ is the two-element field where $1 + 1 = 0$.

<aside class="notation">
<span class="notation-title">Notation: fields</span>

- $a^{-1}$, read "$a$ inverse", is the multiplicative inverse of $a$: the number with $a \times a^{-1} = 1$. Dividing by $a$ means multiplying by $a^{-1}$.
- $p$ always stands for a **prime**: a whole number above 1 whose only factors are 1 and itself (2, 3, 5, 7, 11, …).
- $\mathrm{GF}(p)$ is the field $\mathbb{Z}/p\mathbb{Z}$ of integers mod a prime $p$. The letters stand for "Galois field", after Évariste Galois, who studied finite fields in the 1830s.

</aside>

These are not the only finite fields. The next lesson shows that every field with a prime number $p$ of elements is just $\mathrm{GF}(p)$ in disguise, and Lesson 7 builds fields with 4, 8, 9, and more elements, which Singer's construction needs.

<section class="try-it">

## Try it

1. What is the inverse of 4 on a clock with 11 hours?
2. Is $\mathbb{Z}/9\mathbb{Z}$ a field? Use the tables to find out.

<details>
<summary>Show the answers</summary>

1. $4 \times 3 = 12 \equiv 1 \pmod{11}$, so $4^{-1} = 3$.
2. No: $3 \times 3 = 9 \equiv 0$, so 3 is a zero divisor and has no inverse. That matches the rule, since $9 = 3 \times 3$ is not prime.

</details>

</section>

Explore any clock up to 24 hours in the [finite field calculator](../../playgrounds/field-calculator/?v=6), which shows the tables and Euclid's algorithm side by side.
