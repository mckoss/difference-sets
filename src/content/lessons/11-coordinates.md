---
title: "Coordinates for a projective plane"
order: 11
part: 4
summary: "PG(2, q): points and lines as subspaces of GF(q)³, named by homogeneous coordinates, with incidence by dot product."
status: ready
---

## You'll learn

- How the lines and planes through the origin of $\mathrm{GF}(q)^3$ become the points and lines of a geometry called $\mathrm{PG}(2, q)$.
- How to name a point by *homogeneous coordinates* $[x : y : z]$, and how to scale them to one standard name.
- That a point lies on a line exactly when a *dot product* is zero, that the *cross product* finds the line through two points, and that $\mathrm{PG}(2, q)$ is a projective plane of order $q$, for every prime power $q$.

## Points are lines, lines are planes

[Lesson 10](../10-vectors-over-a-finite-field/) found $q^2 + q + 1$ lines through the origin of $\mathrm{GF}(q)^3$ and as many planes through the origin. Now rename them:

- a **point** is a line through the origin;
- a **line** is a plane through the origin;
- a point **lies on** a line when the line through the origin sits inside the plane.

The geometry this makes is called $\mathrm{PG}(2, q)$, the *projective geometry* of dimension 2 over $\mathrm{GF}(q)$. (The 2 counts the dimension of the plane, one less than the three coordinates.) It is an old idea from perspective drawing: a point in a painting is a ray of light through the painter's eye, and a line in the painting is a flat fan of rays.

## Homogeneous coordinates

A point is a whole line through the origin, but any one of its nonzero vectors pins it down. So we name the point of the nonzero vector $(x, y, z)$ by

$$
[x : y : z],
$$

with square brackets and colons, called **homogeneous coordinates**. Scaling gives the same point: $[x : y : z] = [s x : s y : s z]$ for every nonzero scalar $s$, since $(s x, s y, s z)$ is on the same line through the origin. Only the *ratios* of the coordinates matter, as with the colon in a ratio $2 : 3 = 4 : 6$.

**Normalizing.** To give each point one standard name, divide by its first nonzero coordinate, so that coordinate becomes 1. Over $\mathrm{GF}(3)$, the inverse of 2 is 2 (since $2 \cdot 2 = 4 \equiv 1$), so

$$
[2 : 1 : 0] = 2 \cdot [2 : 1 : 0] = [4 : 2 : 0] = [1 : 2 : 0].
$$

Every point has exactly one normalized name, of one of three shapes:

| shape | how many | why |
| --- | --- | --- |
| $[1 : y : z]$ | $q^2$ | $y$ and $z$ are free |
| $[0 : 1 : z]$ | $q$ | $z$ is free |
| $[0 : 0 : 1]$ | $1$ | |

That is $q^2 + q + 1$ points, matching the count from Lesson 10.

**Lines get coordinates too.** The line (plane through the origin) $a x + b y + c z = 0$ doesn't change when the equation is scaled, so we name it $[a : b : c]$ and normalize the same way. A point $[x : y : z]$ lies on the line $[a : b : c]$ exactly when

$$
a x + b y + c z = 0.
$$

The left side is the **dot product** of $(a, b, c)$ and $(x, y, z)$, written $(a, b, c) \cdot (x, y, z)$: multiply matching coordinates and add. Scaling either vector by a nonzero $s$ multiplies the dot product by $s$, and zero stays zero, so it doesn't matter which names we use.

<div data-widget="pg2-explorer" data-q="3" data-qs="2,3,4,5,7"></div>

The explorer lays out the $q^2$ points $[1 : y : z]$ as a square, row $y$ and column $z$, with the other $q + 1$ points below. Click a point to see the $q + 1$ lines through it. Click a second point to see the line through both, with the dot products that prove it. Click two lines in the list to see where they meet.

## The plane axioms

[Lesson 4](../04-projective-planes/) asked three things of a projective plane. Here is why $\mathrm{PG}(2, q)$ has all three.

**Different names, different lines.** If the normalized names $[a : b : c]$ and $[a' : b' : c']$ differ, the two equations have different solutions. Say $c \neq 0$. The vectors $(1, 0, -a/c)$ and $(0, 1, -b/c)$ solve the first equation. If both solved the second too, then $a' = c' a / c$ and $b' = c' b / c$, so $(a', b', c')$ would be the multiple $(c'/c) \cdot (a, b, c)$, the same line. (The cases $c = 0$ work the same way with another coordinate.)

**Any two points lie on exactly one line.** Take two different points named by vectors $u = (u_1, u_2, u_3)$ and $w = (w_1, w_2, w_3)$. Their **cross product**

$$
u \times w = (u_2 w_3 - u_3 w_2,\ \ u_3 w_1 - u_1 w_3,\ \ u_1 w_2 - u_2 w_1)
$$

has dot product zero with both. For $u$, multiply out $u_1(u_2 w_3 - u_3 w_2) + u_2(u_3 w_1 - u_1 w_3) + u_3(u_1 w_2 - u_2 w_1)$: every term cancels against another, in any field. It is not the zero vector, because $u$ and $w$ are not multiples of each other. (If, say, $u_1 \neq 0$ and the cross product were 0, its last two coordinates would give $w_2 = (w_1/u_1) u_2$ and $w_3 = (w_1/u_1) u_3$, so $w$ would be a multiple of $u$.) So the line $[u \times w]$ goes through both points.

It is the only one. Any plane through the origin containing $u$ and $w$ contains every combination $s \cdot u + t \cdot w$. Those are $q^2$ different vectors: if $s u + t w = s' u + t' w$ with $s \neq s'$, then $u$ would be a multiple of $w$. A plane has only $q^2$ vectors, so the plane *is* the set of combinations, fixed by $u$ and $w$ alone.

**Any two lines meet in exactly one point.** This is the same argument with points and lines swapped, the duality of Lesson 4 made concrete: the dot product doesn't care which vector names a point and which names a line. The point where the lines named by vectors $g$ and $h$ meet is $[g \times h]$.

**Four points, no three on a line.** Take $[1 : 0 : 0]$, $[0 : 1 : 0]$, $[0 : 0 : 1]$, and $[1 : 1 : 1]$. The line through the first two is $z = 0$, which misses the other two, and the other pairs work out the same way.

So $\mathrm{PG}(2, q)$ is a projective plane. Each line holds $q + 1$ points, the $q + 1$ lines through the origin inside a plane, so its order is $n = q$. **There is a projective plane of every prime power order:** 2, 3, 4, 5, 7, 8, 9, 11, …, as Lesson 4 promised. The explorer's green check confirms both axioms by brute force for every pair.

## Where the parallels went

The square of points $[1 : y : z]$ in the explorer behaves like an ordinary grid. A line $[a : b : c]$ with $c \neq 0$ meets each row once: for each $y$ there is one $z$ with $a + b y + c z = 0$, like the graph of a straight line that wraps around at the edges.

Lines with the same $b$ and $c$ but different $a$ never meet inside the square. They are *parallel*, as in school geometry. But they all pass through the same extra point $[0 : c : -b]$ below the square, because $0 \cdot a + c \cdot b + (-b) \cdot c = 0$ for every $a$. The $q + 1$ points with $x = 0$ make up one more line, $[1 : 0 : 0]$, the **line at infinity**, where each family of parallel lines meets. That is how a projective plane gets rid of parallels: it adds a point at infinity for each direction, as railway tracks meet at the horizon in a painting.

## The two smallest planes

**$\mathrm{PG}(2, 2)$ is the Fano plane.** Over $\mathrm{GF}(2)$ the only nonzero scalar is 1, so every point has a single name, and the 7 points are the 7 nonzero vectors of $\mathrm{GF}(2)^3$. The 7 lines are the equations: $[0 : 0 : 1]$ is $z = 0$, holding $[1 : 0 : 0]$, $[0 : 1 : 0]$, and $[1 : 1 : 0]$. Set $q = 2$ in the explorer and compare with the drawing in [Lesson 3](../03-fano-plane/). The two pictures have the same incidences but different labels; [Lesson 12](../12-field-inside-the-plane/) finds the numbering that turns these lines into the translates of $\{0, 1, 3\}$.

**$\mathrm{PG}(2, 3)$** has 13 points and 13 lines, with 4 points on each line, the plane of order 3 from Lesson 4.

<aside class="notation">
<span class="notation-title">Notation: the projective plane</span>

- $\mathrm{PG}(2, q)$: the projective plane over $\mathrm{GF}(q)$. Its points are the lines through the origin of $\mathrm{GF}(q)^3$; its lines are the planes through the origin.
- $[x : y : z]$: the point through the nonzero vector $(x, y, z)$; $[x : y : z] = [s x : s y : s z]$ for $s \neq 0$. Normalized: first nonzero coordinate 1.
- $[a : b : c]$: the line $a x + b y + c z = 0$.
- $u \cdot w = u_1 w_1 + u_2 w_2 + u_3 w_3$, the **dot product**. A point lies on a line exactly when the dot product of their coordinates is 0.
- $u \times w$, the **cross product**: the line through two points, or the point on two lines.

</aside>

<section class="try-it">

## Try it

Work in $\mathrm{PG}(2, 3)$.

1. Normalize $[2 : 2 : 1]$ and $[0 : 2 : 2]$.
2. Find the line through $[1 : 0 : 1]$ and $[0 : 1 : 1]$ with the cross product, and list its 4 points.

<details>
<summary>Show the answers</summary>

1. Multiply by $2^{-1} = 2$: $[2 : 2 : 1] = [4 : 4 : 2] = [1 : 1 : 2]$ and $[0 : 2 : 2] = [0 : 1 : 1]$.
2. $(1, 0, 1) \times (0, 1, 1) = (0 \cdot 1 - 1 \cdot 1,\ 1 \cdot 0 - 1 \cdot 1,\ 1 \cdot 1 - 0 \cdot 0) = (-1, -1, 1) \equiv (2, 2, 1)$, which normalizes to $[1 : 1 : 2]$: the line $x + y + 2z = 0$. Its points are $[1 : 0 : 1]$, $[1 : 1 : 2]$, $[1 : 2 : 0]$, and $[0 : 1 : 1]$. For example, $1 + 1 + 2 \cdot 2 = 6 \equiv 0$.

Click the two points in the explorer to check.

</details>

</section>

The [PG(2, q) explorer](../../playgrounds/pg2-explorer/?q=3&points=1,10) shows the same plane for $q$ up to 9, side by side with the numbering of the next lesson.
