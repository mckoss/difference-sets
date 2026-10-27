---
title: "The field hiding inside the plane"
order: 12
part: 4
summary: "GF(q³) is GF(q)³, so every point of PG(2, q) is a power of α, and the points get numbers mod v."
status: ready
---

## You'll learn

- That the big field $\mathrm{GF}(q^3)$ *is* the space $\mathrm{GF}(q)^3$ of Lesson 10, with one extra ability: its vectors can be multiplied.
- That the nonzero elements, taken up to scaling by $\mathrm{GF}(q)$, are exactly the points of $\mathrm{PG}(2, q)$.
- That because $\mathrm{GF}(q)^* = \langle \alpha^v \rangle$ with $v = q^2 + q + 1$, each point is $\alpha^i$ for exactly one $i \bmod v$. That gives every point a number on a clock with $v$ hours.

## Two descriptions of the same thing

[Lesson 11](../11-coordinates/) built the plane $\mathrm{PG}(2, q)$ out of vectors with three coordinates. [Lesson 9](../09-fields-inside-fields/) built the field $\mathrm{GF}(q^3)$, with $q^3$ elements, and found $\mathrm{GF}(q)$ sitting inside it. This lesson notices that these are the same object, seen two ways.

## GF(q³) as vectors over GF(q)

[Lesson 7](../07-prime-power-fields/) built a field from remainders: choose an irreducible polynomial of degree 3, and work with the remainders of degree below 3. Lesson 7 took its coefficients mod a prime $p$, but long division only ever adds, multiplies, and divides coefficients, so the same recipe works with coefficients in any field, including $\mathrm{GF}(q)$. Choose a primitive polynomial of degree 3 over $\mathrm{GF}(q)$ ([Lesson 8](../08-primitive-elements/)), and call the remainder $x$ by the name $\alpha$. Every element of $\mathrm{GF}(q^3)$ is then

$$
c_0 + c_1 \alpha + c_2 \alpha^2
$$

for exactly one choice of $c_0, c_1, c_2$ in $\mathrm{GF}(q)$, and $\alpha$ is primitive: its powers visit every nonzero element.

For $q = 3$, the site uses $x^3 + 2x + 1$, so $\alpha^3 + 2\alpha + 1 = 0$, which means $\alpha^3 = \alpha + 2$ (since $-2 \equiv 1$ and $-1 \equiv 2$ mod 3). For $q = 2$ it uses $x^3 + x + 1$ from Lesson 7, so $\alpha^3 = \alpha + 1$. For $q = 4$ the coefficients come from $\mathrm{GF}(4) = \{0, 1, \omega, \omega^2\}$, and $\alpha^3 = \alpha^2 + \alpha + \omega$. (Lesson 9 built $\mathrm{GF}(64)$ differently, from a polynomial of degree 6 over $\mathrm{GF}(2)$. The two are the same field with different labels, since all fields of one size are, as the isomorphism finder of Lesson 7 shows.)

Now read the three coefficients as a vector:

$$
c_0 + c_1 \alpha + c_2 \alpha^2 \quad \longleftrightarrow \quad (c_0, c_1, c_2).
$$

Adding two elements adds their coefficients, which is adding vectors. Multiplying by a constant $s$ from $\mathrm{GF}(q)$ multiplies each coefficient by $s$, which is scaling a vector. So **$\mathrm{GF}(q^3)$ is $\mathrm{GF}(q)^3$**, with the bonus that any two elements can also be multiplied together. The constants $c_0$, the elements with $c_1 = c_2 = 0$, are the copy of $\mathrm{GF}(q)$ inside the big field.

## Every point is a power of α

Each point of $\mathrm{PG}(2, q)$ is a line through the origin: a nonzero vector $u$ together with its multiples $s \cdot u$ for the $q - 1$ nonzero scalars $s$. Read in the big field, $u$ is a nonzero element, so by Lesson 8 it is a power $\alpha^i$, with $0 \le i < q^3 - 1$.

Which other powers name the same point? Lesson 9 found that the nonzero elements of $\mathrm{GF}(q)$ are exactly the powers of $\alpha^v$, where $v = q^2 + q + 1$:

$$
\mathrm{GF}(q)^* = \{1, \alpha^v, \alpha^{2v}, \dots, \alpha^{(q-2)v}\} = \langle \alpha^v \rangle.
$$

(The star in $\mathrm{GF}(q)^*$ means "the nonzero elements".) So the $q - 1$ multiples of $\alpha^i$ by nonzero scalars are

$$
\alpha^i, \quad \alpha^{i + v}, \quad \alpha^{i + 2v}, \quad \dots, \quad \alpha^{i + (q-2)v}.
$$

Two powers $\alpha^i$ and $\alpha^j$ name the same point exactly when $j - i$ is a multiple of $v$, that is, when $i \equiv j \pmod v$. The $q^3 - 1 = (q - 1) \cdot v$ nonzero elements fall into $v$ groups of $q - 1$, one group per point, and each group is one residue class mod $v$.

> **Point $i$** is the point of $\alpha^i$. Its number $i$ is defined mod $v$, and every point gets exactly one number in $\mathbb{Z}/v\mathbb{Z}$.

The clock with $v = q^2 + q + 1$ hours from Part I has come back, this time as the points of a projective plane.

Step through the powers of $\alpha$ below. Each power is a vector; its normalized name is a point; and the powers $i, i + v, i + 2v, \dots$ all land on the same point, because they differ by the scalars $\alpha^v, \alpha^{2v}, \dots$, which are constants.

<div data-widget="field-points" data-q="3"></div>

For $q = 3$, $v = 13$ and $\alpha^{13} = 2$, the constant that Lesson 9 found fixed by $x \mapsto x^3$. So $\alpha^{4} = \alpha^2 + 2\alpha$, the vector $(0, 2, 1)$, and $\alpha^{17} = 2\alpha^4 = 2\alpha^2 + \alpha$, the vector $(0, 1, 2)$, are two names for the point $[0 : 1 : 2]$, which is point 4.

## The smallest case: q = 2

For $q = 2$ there is only one nonzero scalar, so each point is a single element of $\mathrm{GF}(8)$, and $v = 7 = q^3 - 1$. With $\alpha^3 = \alpha + 1$:

| $i$ | $\alpha^i$ | point |
| --- | --- | --- |
| 0 | $1$ | $[1 : 0 : 0]$ |
| 1 | $\alpha$ | $[0 : 1 : 0]$ |
| 2 | $\alpha^2$ | $[0 : 0 : 1]$ |
| 3 | $\alpha + 1$ | $[1 : 1 : 0]$ |
| 4 | $\alpha^2 + \alpha$ | $[0 : 1 : 1]$ |
| 5 | $\alpha^2 + \alpha + 1$ | $[1 : 1 : 1]$ |
| 6 | $\alpha^2 + 1$ | $[1 : 0 : 1]$ |

Now look at the line $z = 0$, the elements with no $\alpha^2$ term. Its points are numbers 0, 1, and 3: the set $\{0, 1, 3\}$ from Lesson 1. The line $x = 0$, the elements with no constant term, holds points 1, 2, and 4: the set $\{1, 2, 4\} = \{0, 1, 3\} + 1$. Numbered by powers of $\alpha$, the lines of $\mathrm{PG}(2, 2)$ are starting to look like the translates of a difference set. [Lesson 13](../13-singer-cycle/) shows why every one of them is.

## Both numberings at once

The explorer now shows both views. On the left, points have coordinates; on the right, they sit around a clock by their number $i$. Click two points, or a line in the list, and watch the same line appear in both. Every line's set of numbers is listed beside its coordinates.

<div data-widget="pg2-explorer" data-q="3" data-views="grid,circle" data-qs="2,3,4,5"></div>

<aside class="notation">
<span class="notation-title">Notation: numbering the points</span>

- $c_0 + c_1 \alpha + c_2 \alpha^2 \longleftrightarrow (c_0, c_1, c_2)$: an element of $\mathrm{GF}(q^3)$ read as a vector in $\mathrm{GF}(q)^3$.
- $\mathrm{GF}(q)^*$: the nonzero elements of $\mathrm{GF}(q)$, which are $\langle \alpha^v \rangle = \{1, \alpha^v, \dots, \alpha^{(q-2)v}\}$.
- **Point $i$**: the point of $\mathrm{PG}(2, q)$ through $\alpha^i$, for $i$ in $\mathbb{Z}/v\mathbb{Z}$ with $v = q^2 + q + 1$.

</aside>

<section class="try-it">

## Try it

Use $q = 3$ and $\alpha^3 = \alpha + 2$.

1. Which point is $\alpha^3$? Write it as a vector, then normalize. Which other power of $\alpha$ names the same point?
2. Point 9 is $\alpha^9 = \alpha + 1$. Which points of $\mathrm{PG}(2, 3)$ lie on the line $z = 0$, the elements with no $\alpha^2$ term? Use the table in the widget.

<details>
<summary>Show the answers</summary>

1. $\alpha^3 = 2 + \alpha$ is the vector $(2, 1, 0)$. Multiplying by $2^{-1} = 2$ gives $(4, 2, 0) \equiv (1, 2, 0)$, so it is the point $[1 : 2 : 0]$, point 3. The other name is $\alpha^{3 + 13} = \alpha^{16} = \alpha^{13} \cdot \alpha^3 = 2\alpha^3 = 1 + 2\alpha$, the vector $(1, 2, 0)$ itself.
2. The table's vectors with last coordinate 0 are at $i = 0$, $1$, $3$, and $9$, so the line $z = 0$ is the set of points $\{0, 1, 3, 9\}$. That is the planar difference set mod 13 from Lesson 4.

</details>

</section>

The [PG(2, q) explorer](../../playgrounds/pg2-explorer/?q=4) shows both numberings for $q$ up to 9.
