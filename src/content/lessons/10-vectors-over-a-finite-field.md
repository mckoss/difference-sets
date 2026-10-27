---
title: "Vectors over a finite field"
order: 10
part: 4
summary: "GF(q)³ as a finite grid of vectors, and counting the lines and planes through the origin."
status: ready
---

## You'll learn

- What a vector $(x, y, z)$ with entries in $\mathrm{GF}(q)$ is, and why there are exactly $q^3$ of them: a finite 3D grid.
- What lines and planes *through the origin* look like when the coordinates wrap around like a clock.
- Why every line through the origin holds $q - 1$ nonzero vectors, so there are $\frac{q^3 - 1}{q - 1} = q^2 + q + 1$ lines through the origin, and the same number of planes.

## Why we need this

Part II ended with a question: where do projective planes with a turning symmetry come from? Part III built the finite fields $\mathrm{GF}(q)$, one for every prime power $q = p^e$. This part turns a field into a plane. The recipe is old and short: take ordinary 3D space, but give its points coordinates in $\mathrm{GF}(q)$ instead of in the real numbers. Then call each *line through the origin* a "point" and each *plane through the origin* a "line". This lesson builds the space and counts its lines and planes. [Lesson 11](../11-coordinates/) checks that the result is a projective plane, and Lessons 12 and 13 find its turning symmetry inside $\mathrm{GF}(q^3)$.

## A finite space

A **vector** over $\mathrm{GF}(q)$ is a list of three elements of the field, written $(x, y, z)$. Each coordinate has $q$ choices, so there are $q \times q \times q = q^3$ vectors in all. The set of all of them is called $\mathrm{GF}(q)^3$. For $q = 3$ the coordinates are the numbers 0, 1, 2 mod 3, and there are 27 vectors, from $(0, 0, 0)$ to $(2, 2, 2)$.

Vectors can be added and scaled, one coordinate at a time, using the field's arithmetic. In $\mathrm{GF}(3)^3$:

$$
(1, 2, 0) + (2, 2, 1) = (0, 1, 1), \qquad 2 \cdot (1, 2, 0) = (2, 1, 0),
$$

since $1 + 2 = 3 \equiv 0$, $2 + 2 = 4 \equiv 1$, and $2 \cdot 2 = 4 \equiv 1$. A field element used to scale a vector is called a **scalar**. The vector $(0, 0, 0)$ is written $0$ and called the **origin**.

This is the picture from [Lesson 6](../06-fields-of-prime-order/), one level up: there, a field with $p^e$ elements was a list of $e$ coordinates over $\mathrm{GF}(p)$. Here we take three coordinates over $\mathrm{GF}(q)$.

Here is $\mathrm{GF}(q)^3$, drawn as a grid of $q^3$ dots. Drag it to turn it.

<div data-widget="vector-grid" data-q="3"></div>

The positions 0, 1, 2 along each axis are labels, not distances. Arithmetic wraps around, as on the clock of [Lesson 1](../01-differences-on-a-circle/): one step past 2 is 0 again. For $q = 4$ the labels are the elements $0, 1, \omega, \omega^2$ of $\mathrm{GF}(4)$, where $\omega$ (the Greek letter *omega*) is a primitive element, the $x$ of Lesson 7, with $\omega^2 = \omega + 1$.

## Lines through the origin

Pick a nonzero vector $u$. The **line through 0 and $u$** is the set of all its multiples $s \cdot u$, one for each scalar $s$ in $\mathrm{GF}(q)$. In the widget, the line through 0 and $(1, 0, 1)$ for $q = 3$ is

$$
0 \cdot (1, 0, 1) = (0, 0, 0), \quad 1 \cdot (1, 0, 1) = (1, 0, 1), \quad 2 \cdot (1, 0, 1) = (2, 0, 2).
$$

Try $(1, 1, 2)$ instead: its multiples are $(0, 0, 0)$, $(1, 1, 2)$, $(2, 2, 1)$. In the grid these three dots don't look like they lie on a straight line, because the third coordinate wrapped from 4 back around to 1. They are still a line in every sense that the arithmetic can see.

Two facts make lines through the origin easy to count.

**Each one holds $q - 1$ nonzero vectors.** The $q$ scalars give $q$ multiples. They are all different: if $s \cdot u = t \cdot u$, then $(s - t) \cdot u = 0$, and since $u$ has a nonzero coordinate and a field has no zero divisors (Lesson 5), $s - t = 0$. One multiple, $0 \cdot u$, is the origin. That leaves $q - 1$ nonzero ones.

**Two different lines through the origin share only the origin.** If a nonzero vector $w$ lies on the line through $u$, then $w = s \cdot u$ with $s \neq 0$, so $u = s^{-1} \cdot w$, and every multiple of $u$ is a multiple of $w$. The two lines are the same line. So each nonzero vector lies on exactly one line through the origin.

Together these say that the lines through the origin split the $q^3 - 1$ nonzero vectors into groups of exactly $q - 1$. Press **Every line** in the widget to color each group its own color. The number of groups is

$$
\frac{q^3 - 1}{q - 1} = q^2 + q + 1,
$$

because $q^3 - 1 = (q - 1)(q^2 + q + 1)$, the same factorization as in [Lesson 9](../09-fields-inside-fields/). For $q = 3$ that is $26 / 2 = 13$ lines; for $q = 2$, each line has a single nonzero vector, so the $7$ nonzero vectors are the $7$ lines. These are exactly the numbers of points in the projective planes of orders 3 and 2. That is no coincidence, as the next lesson shows.

## Planes through the origin

Pick three scalars $a$, $b$, $c$, not all zero. The vectors $(x, y, z)$ that solve

$$
a x + b y + c z = 0
$$

form a **plane through the origin**. Choose a plane in the widget, such as $x + y + z = 0$, and the dots that solve its equation turn blue.

**Each one holds $q^2$ vectors.** Say $c \neq 0$ (the other cases work the same way). Then $x$ and $y$ can be anything, $q^2$ choices, and each choice fixes $z = -(a x + b y)/c$. For $x + y + z = 0$ over $\mathrm{GF}(3)$ that gives 9 vectors.

**It is closed under adding and scaling.** If $u$ and $w$ solve the equation, so do $u + w$ and $s \cdot u$, because the left side of the equation respects both operations. A set of vectors that contains 0 and is closed under adding and scaling is called a **subspace**. The lines and planes through the origin are subspaces, and so are $\{0\}$ and the whole space.

**It is made of $q + 1$ lines through the origin.** If $u$ is in the plane, so is every multiple of $u$, so the plane is a union of whole lines through the origin. Its $q^2 - 1$ nonzero vectors come in groups of $q - 1$, so it holds

$$
\frac{q^2 - 1}{q - 1} = q + 1
$$

lines. With the widget on **Line and plane**, pick a line inside the plane and the dots turn orange; pick one outside it and the line meets the plane only at the origin. There is no third possibility: if a line and a plane through 0 share one nonzero vector, they share all its multiples.

**There are $q^2 + q + 1$ of them.** Scaling an equation by a nonzero scalar doesn't change its solutions, so the plane only depends on the coefficient vector $(a, b, c)$ up to a nonzero multiple, that is, on the line through 0 and $(a, b, c)$. Different lines give different planes ([Lesson 11](../11-coordinates/) shows why: two equations that are not multiples of each other share only a line's worth of solutions, not a plane's). So planes through the origin match up one for one with lines through the origin, and there are $q^2 + q + 1$ of each.

<aside class="notation">
<span class="notation-title">Notation: vectors</span>

- $\mathrm{GF}(q)^3$: all vectors $(x, y, z)$ with coordinates in $\mathrm{GF}(q)$. There are $q^3$ of them.
- $0 = (0, 0, 0)$, the origin.
- $u + w$ and $s \cdot u$: add coordinate by coordinate, and multiply each coordinate by the scalar $s$.
- The **line through 0 and $u$**: all multiples $s \cdot u$; it has $q$ vectors.
- The **plane** $a x + b y + c z = 0$: all solutions of one equation with $(a, b, c) \neq 0$; it has $q^2$ vectors.
- A **subspace**: a set of vectors containing 0 and closed under adding and scaling.
- $\omega$ (omega): a primitive element of $\mathrm{GF}(4)$, so $\mathrm{GF}(4) = \{0, 1, \omega, \omega^2\}$.

</aside>

## More coordinates

Nothing here depends on having three coordinates. With four, $\mathrm{GF}(q)^4$ has $q^4$ vectors, and its lines through the origin number $(q^4 - 1)/(q - 1) = q^3 + q^2 + q + 1$. They are the points of a projective *space* of dimension 3, called $\mathrm{PG}(3, q)$, and [Lesson 16](../16-beyond-the-plane/) builds Singer difference sets from it. This part stays with three coordinates, which give planes.

<section class="try-it">

## Try it

Work in $\mathrm{GF}(3)^3$.

1. List the vectors on the line through 0 and $(2, 1, 1)$. Which canonical vector, with first nonzero coordinate 1, lies on it?
2. List the 9 vectors of the plane $x + y + z = 0$, and sort its 8 nonzero vectors into its 4 lines through the origin.

<details>
<summary>Show the answers</summary>

1. The multiples are $(0, 0, 0)$, $(2, 1, 1)$, and $2 \cdot (2, 1, 1) = (4, 2, 2) \equiv (1, 2, 2)$. The one starting with 1 is $(1, 2, 2)$.
2. Choose $x$ and $y$, then $z = -(x + y)$. The nonzero solutions are $(0, 1, 2)$, $(0, 2, 1)$, $(1, 0, 2)$, $(2, 0, 1)$, $(1, 1, 1)$, $(2, 2, 2)$, $(1, 2, 0)$, $(2, 1, 0)$. The lines pair each with its double: $\{(0, 1, 2), (0, 2, 1)\}$, $\{(1, 0, 2), (2, 0, 1)\}$, $\{(1, 1, 1), (2, 2, 2)\}$, $\{(1, 2, 0), (2, 1, 0)\}$. That is $q + 1 = 4$ lines.

Check both in the widget: choose the line through $(1, 2, 2)$ and the plane $x + y + z = 0$.

</details>

</section>

The lines and planes through the origin become the points and lines of a projective plane in the [PG(2, q) explorer](../../playgrounds/pg2-explorer/?q=3), the subject of the next lesson.
