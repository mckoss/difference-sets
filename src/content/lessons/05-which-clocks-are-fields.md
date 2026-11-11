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

[Lesson 1](../01-differences-on-a-circle/) did arithmetic in $\mathbb{Z}/v\mathbb{Z}$[^quotient], the integers mod $v$: add or multiply as usual, then keep the remainder after dividing by $v$.

For example, on a clock with 7 hours, $5 + 4 = 9 \equiv 2$ and $3 \times 5 = 15 \equiv 1 \pmod 7$.

## Why a plane needs division

[Lesson 4](../04-projective-planes/) ended with a plan: build a finite plane the way coordinate geometry builds the ordinary one. There, a point is a pair of numbers $(x, y)$, and a line is the set of points that solve an equation such as $y = 2x$. Try that with coordinates taken from a clock.

On the 7-hour clock, the lines $y = 0$ and $y = 2x$ meet where $2x \equiv 0 \pmod 7$. The only such hour is $x = 0$, so the lines cross once, at $(0, 0)$, as lines should. On the 6-hour clock, $2x \equiv 0 \pmod 6$ has *two* solutions, $x = 0$ and $x = 3$, because $2 \times 3 = 6 \equiv 0$. Now the two lines cross twice, at $(0, 0)$ and at $(3, 0)$, and the rule that two points lie on only one line is broken.

What went wrong is that on the 6-hour clock you cannot divide by 2. In ordinary algebra, $2x = 0$ is solved by dividing both sides by 2, which leaves $x = 0$ and nothing else. So coordinates will only give a geometry if they come from a number system in which every calculation of ordinary algebra still works, including division. This lesson asks which clocks give one.

## What a field is

A **field** is a collection of objects over which two operations, addition and multiplication, are defined with the following properties. (We call the objects *numbers*, even though in later lessons they won't look like ordinary numbers.)

| Axiom | What it says |
| --- | --- |
| Both operations are **commutative** | $a + b = b + a$ and $a \times b = b \times a$ |
| Both operations are **associative** | $(a + b) + c = a + (b + c)$, and the same for $\times$ |
| Multiplication is **distributive** over addition | $a \times (b + c) = a \times b + a \times c$ |
| There are **identities** 0 and 1, different from each other | $a + 0 = a$ and $a \times 1 = a$ |
| Every number has an **additive inverse** | some $-a$ has $a + (-a) = 0$, so subtraction works |
| Every number except 0 has a **multiplicative inverse** | some $a^{-1}$ (read "$a$ inverse") has $a \times a^{-1} = 1$, so division works |

From here on, "inverse" on its own always means the multiplicative inverse, the one that makes division work.

The fractions (rational numbers) form a field, and so do the real numbers. The whole numbers $\dots, -1, 0, 1, 2, \dots$ do not: 2 has no multiplicative inverse among them, because $\tfrac12$ is not a whole number.

These are the **field axioms**. Clock arithmetic inherits the first five from ordinary whole-number arithmetic, because taking remainders at the end gives the same answer as taking them along the way (the footnote on $\mathbb{Z}/v\mathbb{Z}$ checks this). The negative of $a$ on a $v$-hour clock is $v - a$. So the only question is the last axiom: **does every nonzero residue have a multiplicative inverse?**

## Look at the multiplication tables

Here is multiplication on a clock with 7 hours. Green cells are where a product equals 1, so they pair each number with its inverse. A ✓ marks a row that is a **permutation**: it contains every hour exactly once, in some shuffled order.

<div data-widget="zn-tables" data-v="7"></div>

Every nonzero row of the 7-hour table is a permutation, so every row contains a 1, and every nonzero number has an inverse: $3^{-1} = 5$ because $3 \times 5 = 15 \equiv 1$. Now switch the widget to $v = 6$. Row 2 reads $0, 2, 4, 0, 2, 4$: it repeats, never reaches 1, and hits 0 at $2 \times 3$. The red cells mark these products.

Two nonzero numbers whose product is 0 are called **zero divisors**. Ordinary numbers never do this, but clocks can.

## Multiplying is jumping

Multiplying $a \times b$ on a clock is the same as starting at 0 and jumping $a$ hours, $b$ times. On the 7-hour clock, jumps of 3 visit every hour before coming home. On a 6-hour clock, jumps of 2 come back to 0 after only three jumps and never touch the odd hours.

<div data-widget="zn-clock" data-v="7" data-a="3"></div>

Try $v = 6$ with jumps of 2, 3, 4, and 5, and then $v = 12$. The jumps that visit every hour are exactly the ones whose only common factor with $v$ is 1. Two whole numbers like that are called **coprime**.

## Why composite clocks fail

Suppose $v$ is not prime, so $v = a \times b$ with $a$ and $b$ both between 1 and $v$. Then $a \times b \equiv 0 \pmod v$, so $a$ is a zero divisor. A zero divisor can never have an inverse. If $a \times c \equiv 1$, then

$$
b \equiv b \times (a \times c) \equiv (b \times a) \times c \equiv 0 \times c \equiv 0,
$$

which contradicts $b$ being between 1 and $v$. So $\mathbb{Z}/6\mathbb{Z}$, $\mathbb{Z}/4\mathbb{Z}$, and every other composite clock fail the last axiom.

## Why prime clocks succeed

Now let $v = p$ be prime and $a$ a nonzero hour. Could row $a$ of the table repeat a value, $a \times b \equiv a \times c$ with $b \ne c$? Then $p$ divides $a \times (b - c)$. A prime that divides a product divides one of the factors (this is *Euclid's lemma*; it is the reason prime factorizations are unique, and the next section proves it in two lines), and $p$ does not divide $a$ or $b - c$, which are both smaller than $p$ and not 0. So the row never repeats. It has $p$ entries, all different, so it is a permutation and contains a 1 somewhere. That entry is the inverse of $a$.

## Finding an inverse quickly

For a large prime, reading across a row is slow. The **extended Euclidean algorithm** finds the inverse directly. Divide $v$ by $a$ and keep the remainder; then divide $a$ by that remainder, then the first remainder by the second, and so on, each time dividing the last divisor by the last remainder, until a division comes out even. Along the way, keep track of how each remainder is built from $v$ and $a$. When $v$ is prime the last nonzero remainder is always 1 (the reason is below the widget), so you end with $1 = x \times v + y \times a$, and since $x \times v \equiv 0$, this says $y \times a \equiv 1$: $y$ is the inverse.

<div data-widget="euclid" data-a="5" data-v="13"></div>

Step through it for $a = 5$, $v = 13$: the remainders are 13, 5, 3, 2, 1, and the last line says $1 = 2 \times 13 + (-5) \times 5$. So $5^{-1} \equiv -5 \equiv 8$, and indeed $5 \times 8 = 40 = 3 \times 13 + 1$. If $a$ and $v$ are not coprime, the remainders stop at their largest common factor instead of 1, and there is no inverse.

**Why the chain ends at the greatest common divisor.** Each remainder is built from the two numbers before it, so every remainder is some multiple of $v$ plus some multiple of $a$; a factor shared by $v$ and $a$ therefore divides every remainder, including the last nonzero one. In the other direction, the last nonzero remainder divides the one before it (that division came out even), hence the one before that, and so on back up the chain to $a$ and $v$. So the last nonzero remainder is a common factor of $v$ and $a$ that every common factor divides: their **greatest common divisor**. Coprime numbers are the ones whose greatest common divisor is 1, so the chain ends at 1, and produces an inverse of $a$ mod $v$, exactly when $a$ and $v$ are coprime. (Otherwise there is no inverse at all: if $y \times a \equiv 1 \pmod v$, then $y \times a - 1$ is a multiple of $v$, so any common factor of $a$ and $v$ divides 1.) When $v = p$ is prime and $a$ is a nonzero hour, the only common factor is 1, so the chain ends at 1 and every nonzero $a$ has an inverse. That is a second proof of the last section's result, and this one carries over to polynomials in [Lesson 7](../07-prime-power-fields/).

The same equation proves Euclid's lemma. If a prime $p$ does not divide $a$, then $1 = x \times p + y \times a$ for some integers $x$ and $y$; multiplying by $b$ gives $b = x \times p \times b + y \times (a \times b)$. If $p$ divides $a \times b$, it divides both terms on the right, so $p$ divides $b$.

## The conclusion

> $\mathbb{Z}/v\mathbb{Z}$ is a field exactly when $v$ is prime.

For a prime $p$, this field is called $\mathrm{GF}(p)$. So $\mathrm{GF}(7)$ is the 7-hour clock, and $\mathrm{GF}(2)$ is the two-element field where $1 + 1 = 0$.

<aside class="notation">
<span class="notation-title">Notation: fields</span>

- $a^{-1}$, read "$a$ inverse", is the multiplicative inverse of $a$: the number with $a \times a^{-1} = 1$. Dividing by $a$ means multiplying by $a^{-1}$.
- $p$ always stands for a **prime**: a whole number above 1 whose only factors are 1 and itself (2, 3, 5, 7, 11, …).
- $\mathrm{GF}(p)$ is the field $\mathbb{Z}/p\mathbb{Z}$ of integers mod a prime $p$. The letters stand for "Galois field" (see below).

</aside>

## Why "GF"?

The letters stand for **Galois field**, after Évariste Galois (1811–1832), a young French mathematician who laid much of the foundation of modern algebra before he was killed in a duel at the age of 20. In a short paper of 1830, "Sur la théorie des nombres" ("On the theory of numbers"), he showed how to build number systems with $p^2$, $p^3$, … elements. He started from the integers mod $p$ and added a new number that solves an equation with no solution among them, much as $i$ is added to the real numbers to solve $x^2 = -1$. Those are the fields that [Lesson 7](../07-prime-power-fields/) builds, and Singer's construction needs them.

The complete picture came later. In 1893 the American mathematician E. H. Moore proved that a finite field always has a prime or a power of a prime as its number of elements, and that for each such number there is essentially only one field. Any two finite fields with the same number of elements are **isomorphic**: they are the same field with the elements renamed, so that one's addition and multiplication tables turn into the other's. That is why it makes sense to speak of *the* field with 7 elements and give it one name, $\mathrm{GF}(7)$.

You won't have to take this on trust for the prime sizes: the [next lesson](../06-fields-of-prime-order/) proves that every field with a prime number $p$ of elements is isomorphic to $\mathrm{GF}(p)$. For the larger fields of Lesson 7, the proof needs more algebra than this site develops, so Lesson 7 states it as a fact and gives you a widget that tests it on examples. A full proof is in any textbook on finite fields, for example chapter 2 of Lidl and Niederreiter's *Finite Fields*.

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

[^quotient]: **Why the slash in $\mathbb{Z}/v\mathbb{Z}$?** The notation looks like a division, and in a sense it is one, called a **quotient**.

    $\mathbb{Z}$ is the set of all integers, $\dots, -2, -1, 0, 1, 2, \dots$, and $v\mathbb{Z}$ is the set of all multiples of $v$. For $v = 7$ that is $7\mathbb{Z} = \{\dots, -14, -7, 0, 7, 14, \dots\}$. Writing $\mathbb{Z}/7\mathbb{Z}$ means "the integers, with every multiple of 7 treated as zero."

    To see what that leaves, take any integer $a$ and add every multiple of 7 to it. The result,
    $$
    a + 7\mathbb{Z} = \{\dots, a - 7, a, a + 7, \dots\},
    $$
    is a **class**: all the integers that land on the same hour as $a$. For example, $3 + 7\mathbb{Z} = \{\dots, -11, -4, 3, 10, 17, \dots\}$. There are exactly seven classes, $0 + 7\mathbb{Z}$ through $6 + 7\mathbb{Z}$, and every integer is in exactly one of them. The *elements* of $\mathbb{Z}/7\mathbb{Z}$ are these seven classes. The hours $0, 1, \dots, 6$ are just short names for them, each class named by its smallest member that isn't negative. The slash is apt: the integers are cut into $v$ shifted copies of $v\mathbb{Z}$, just as $21/7 = 3$ counts the copies of 7 that make 21.

    To add or multiply two classes, pick any member of each, compute as usual, and take the class of the answer. It doesn't matter which members you pick. If $a' = a + sv$ and $b' = b + tv$, then
    $$
    a' + b' = (a + b) + (s + t)v,
    $$
    $$
    a'b' = ab + (at + bs + stv)v,
    $$
    which are in the classes of $a + b$ and $ab$. This works because the multiples of $v$ *absorb*: a multiple of $v$ plus a multiple of $v$, or times any integer, is again a multiple of $v$. A collection with that absorbing property is called an **ideal**, and you can always take the quotient of a number system by an ideal.

    Here is how the quotient view describes this lesson's result. When $v = ab$ is composite, the multiples of $a$ form a larger ideal $a\mathbb{Z}$ that sits strictly between $v\mathbb{Z}$ and $\mathbb{Z}$. The classes of $a$ and $b$ are then not zero, but their product $ab = v$ is: a zero divisor, which rules out division. When $p$ is prime, no ideal fits between $p\mathbb{Z}$ and $\mathbb{Z}$ (algebraists call $p\mathbb{Z}$ a **maximal ideal**), and a standard theorem of algebra says that the quotient by a maximal ideal is always a field. So $\mathbb{Z}/p\mathbb{Z}$ is a field, which this lesson showed directly above. The maximal-ideal theorem is mentioned only so that the word *quotient* makes sense; nothing later depends on it.

    [Lesson 7](../07-prime-power-fields/) makes the same move with polynomials. It treats every multiple of an irreducible polynomial $f(x)$ as zero, and $f$ plays the role of the prime $p$.

