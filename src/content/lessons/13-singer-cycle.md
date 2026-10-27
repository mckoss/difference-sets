---
title: "The Singer cycle"
order: 13
part: 4
summary: "Multiplying by α turns the whole plane one notch, so PG(2, q) is cyclic and each of its lines is a difference set."
status: ready
---

## You'll learn

- That multiplying every element of $\mathrm{GF}(q^3)$ by $\alpha$ respects adding and scaling, so it carries lines of $\mathrm{PG}(2, q)$ to lines.
- That it moves point $i$ to point $i + 1$, carrying every point around a single cycle of length $v$: the **Singer cycle**.
- That this makes $\mathrm{PG}(2, q)$ a cyclic projective plane, so by Lesson 4 the numbers of the points on any one line form a $(q^2 + q + 1,\ q + 1,\ 1)$ difference set.

## The question from Lesson 4

[Lesson 4](../04-projective-planes/) showed that a cyclic projective plane, one with a symmetry that carries every point around a single cycle, is the same thing as a planar difference set. It ended by asking where planes with such a symmetry come from. We now have a plane of every prime power order, $\mathrm{PG}(2, q)$ ([Lesson 11](../11-coordinates/)), and a numbering of its points by powers of $\alpha$ ([Lesson 12](../12-field-inside-the-plane/)). The symmetry has been hiding in that numbering all along.

## Multiplying by α

Consider the map that multiplies every element of $\mathrm{GF}(q^3)$ by $\alpha$:

$$
x \mapsto \alpha x.
$$

It respects the two vector operations of Lesson 10, because multiplication in a field distributes over addition and can be done in any order:

$$
\alpha (u + w) = \alpha u + \alpha w, \qquad \alpha (s \cdot u) = s \cdot (\alpha u) \quad \text{for } s \text{ in } \mathrm{GF}(q).
$$

A map with these two properties is called **linear**. It is also one-to-one, since $\alpha$ has an inverse: $\alpha u = \alpha w$ means $u = w$.

In coordinates, $\alpha$ shifts each power up by one and uses the cubic to fold $\alpha^3$ back down. For $q = 3$, with $\alpha^3 = \alpha + 2$,

$$
\alpha \cdot (c_0 + c_1 \alpha + c_2 \alpha^2) = c_0 \alpha + c_1 \alpha^2 + c_2 (\alpha + 2) = 2c_2 + (c_0 + c_2)\alpha + c_1 \alpha^2,
$$

so as vectors, $(x, y, z) \mapsto (2z,\ x + z,\ y)$. Every linear map of $\mathrm{GF}(q)^3$ looks like this: each new coordinate is a fixed combination of the old ones.

## It sends lines to lines

**Points go to points.** The point through $u$ is the set of multiples $s \cdot u$. Their images $\alpha(s \cdot u) = s \cdot (\alpha u)$ are the multiples of $\alpha u$: the point through $\alpha u$.

**Lines go to lines.** A line of $\mathrm{PG}(2, q)$ is a plane through the origin, a set of $q^2$ vectors closed under adding and scaling. Its image is closed under adding and scaling too, since $\alpha u + \alpha w = \alpha(u + w)$ and $s \cdot \alpha u = \alpha (s \cdot u)$. It still has $q^2$ different vectors, since the map is one-to-one. Every subspace with $q^2$ vectors is a plane through the origin (it contains two vectors $u$, $w$ that are not multiples of each other, and their $q^2$ combinations from Lesson 11 fill it). So the image of a line is a line.

A rearrangement of the points that carries every line onto a line is what Lesson 3 called a **symmetry** of the geometry. Multiplication by $\alpha$ is one.

## It moves point i to point i + 1

Point $i$ is the point through $\alpha^i$, and

$$
\alpha \cdot \alpha^i = \alpha^{i + 1}.
$$

So multiplying by $\alpha$ sends point $i$ to point $i + 1$. Starting from point 0, it visits $1, 2, \dots, v - 1$, and then point $v$, which is point 0 again, because the numbers are taken mod $v$. One symmetry carries every point around a single cycle of length $v = q^2 + q + 1$. It is called the **Singer cycle**, after James Singer, who found it in 1938.

**So $\mathrm{PG}(2, q)$ is a cyclic projective plane**, and the numbering by powers of $\alpha$ is already the one Lesson 4 asked for, in which the symmetry is "add 1".

## The lines are translates

Now Lesson 4's theorem does the rest. Pick any line, and let $D$ be the set of numbers of its points. For example, take the line $z = 0$, the elements with no $\alpha^2$ term. It has $k = q + 1$ points.

1. **The translates of $D$ are lines.** Multiplying by $\alpha$ adds 1 to the number of every point, so it carries the line $D$ onto a line whose numbers are $D + 1$. Doing it $j$ times gives the line $D + j$.
2. **They are all the lines.** Lesson 4 showed that the $v$ translates $D, D + 1, \dots, D + (v - 1)$ are all different, and the plane has exactly $v$ lines.
3. **Every difference occurs once.** Any two points $a$ and $a + d$, with $d \not\equiv 0$, lie on exactly one line (Lesson 11). Each way of writing $d$ as a difference of two elements of $D$ gives a translate $D + j$ through both points, so there is exactly one such way.

So $D$ is a $(q^2 + q + 1,\ q + 1,\ 1)$ difference set. Here is the line $z = 0$ turning:

<div data-widget="singer-cycle" data-q="3"></div>

Press **Multiply by α** to multiply every point of the line by $\alpha$. The polygon turns one notch around the clock, and the table shows the coordinates doing the arithmetic. Press **Play** to watch all $v$ lines go by, each exactly once.

For the first few prime powers, the line $z = 0$ gives:

| $q$ | $\alpha^3 =$ | $v$ | $D$ (the line $z = 0$) |
| --- | --- | --- | --- |
| 2 | $\alpha + 1$ | 7 | $\{0, 1, 3\}$ |
| 3 | $\alpha + 2$ | 13 | $\{0, 1, 3, 9\}$ |
| 4 | $\alpha^2 + \alpha + \omega$ | 21 | $\{0, 1, 4, 14, 16\}$ |
| 5 | $2\alpha + 3$ | 31 | $\{0, 1, 3, 10, 14, 26\}$ |

The first is the Fano plane of [Lesson 3](../03-fano-plane/): its rotation $i \mapsto i + 1$ was multiplication by $\alpha$ in $\mathrm{GF}(8)$ all along. The second is the plane of order 3 from Lesson 4.

> **Singer's theorem (1938).** For every prime power $q$, there is a $(q^2 + q + 1,\ q + 1,\ 1)$ difference set: the numbers $i \bmod v$ for which $\alpha^i$ lies on one fixed line of $\mathrm{PG}(2, q)$.

This answers the question Part I started with. A planar difference set looked as though it had to be found by search, and Lesson 1 showed how hopeless searching becomes. Singer's construction writes one down from the arithmetic of $\mathrm{GF}(q^3)$.

<aside class="notation">
<span class="notation-title">Notation: the Singer cycle</span>

- $x \mapsto \alpha x$: multiplication by $\alpha$ on $\mathrm{GF}(q^3)$. It is **linear**: it respects adding vectors and scaling by $\mathrm{GF}(q)$.
- The **Singer cycle**: the symmetry of $\mathrm{PG}(2, q)$ it induces, point $i \mapsto$ point $i + 1$.
- $D$: the numbers of the points on one line; the lines are its translates $D + j$.

</aside>

<section class="try-it">

## Try it

1. For $q = 3$, the line $z = 0$ holds points 0, 1, 3, and 9: the vectors $(1, 0, 0)$, $(0, 1, 0)$, $(1, 2, 0)$, and $(1, 1, 0)$ after normalizing. Apply $(x, y, z) \mapsto (2z,\ x + z,\ y)$ to each. Which line do the images lie on, and what are their numbers?
2. For $q = 4$, $D = \{0, 1, 4, 14, 16\}$ mod 21. Which power of $\alpha$ carries the line $D$ onto the line through points 0 and 2? (Use the method of Lesson 4: which pair in $D$ has difference 2?)

<details>
<summary>Show the answers</summary>

1. The images are $(0, 1, 0)$, $(0, 0, 1)$, $(0, 1, 2)$, and $(0, 1, 1)$. All have first coordinate 0, so they lie on the line $x = 0$, which is $[1 : 0 : 0]$. They are points 1, 2, 4, and 10 (the widget's table for Lesson 12 lists them), and indeed $\{1, 2, 4, 10\} = \{0, 1, 3, 9\} + 1$.
2. $16 - 14 = 2$. Adding $j = -14 \equiv 7$ sends 14 to 0 and 16 to 2, so $\alpha^7$ carries $D$ onto $D + 7 = \{7, 8, 11, 0, 2\}$, the line through 0 and 2. Check it with the widget set to $q = 4$: press **Multiply by α** seven times.

</details>

</section>

Every line of every plane, in both numberings, is in the [PG(2, q) explorer](../../playgrounds/pg2-explorer/?q=4&lines=0). Part V turns the construction into an algorithm: [Lesson 14](../14-writing-down-a-difference-set/) chooses a line that the field's own arithmetic picks out, with no coordinates at all, and runs through it step by step.
