---
title: "Projective planes in general"
order: 4
part: 2
summary: "The axioms, the counts, and why a cyclic projective plane is exactly a planar difference set."
status: ready
---

**You'll learn:** the rules that define a projective plane, why every one has $n^2 + n + 1$ points, and why the planes with a single turning symmetry are exactly the planar difference sets.

## The axioms

The Fano plane is the smallest example of a whole family of geometries. As in Lesson 3, a geometry here is a set of points and a collection of lines, each line a set of points.

> A **projective plane** is a geometry with these three properties, called its **axioms**:
>
> 1. Any two different points lie on exactly one line.
> 2. Any two different lines meet in exactly one point.
> 3. There are four points with no three of them on one line.

The first two are the rules from Lesson 3. The third only rules out trivial cases, such as a single line holding every point. (In the Fano plane, the points 3, 5, 6, and 0 work: the three corners and the center.)

## Duality

Swap the words "point" and "line" in axiom 1, and swap "lie on" with "meet in", and you get axiom 2. Swap them in axiom 2 and you get axiom 1. Axiom 3 swaps into "there are four lines with no three through one point", and that can be proved from the axioms too. So the axioms don't care which objects we call points and which we call lines. This is **duality**: whenever something is true about points and lines in every projective plane, the swapped statement is true as well. We'll use it twice below.

## Counting points and lines

**All lines have the same size.** Take two lines, $L$ and $M$, and a point $P$ that lies on neither of them (axiom 3 makes sure one exists). For each point $X$ of $L$, the line through $P$ and $X$ meets $M$ in exactly one point. This pairs off the points of $L$ with the points of $M$ one for one, like shining a light from $P$ and watching $L$ cast its shadow on $M$. So $L$ and $M$ have the same number of points.

Call that number $n + 1$. The number $n$ is the **order** of the plane. The Fano plane has 3 points on each line, so its order is $n = 2$. By duality, every point lies on $n + 1$ lines too.

**There are $n^2 + n + 1$ points.** Stand at one point $P$. It lies on $n + 1$ lines, and each of those lines holds $n$ more points besides $P$. Every other point of the plane is on exactly one of these lines, by axiom 1. So the number of points is

$$
1 + (n + 1) \cdot n = n^2 + n + 1.
$$

By duality there are $n^2 + n + 1$ lines as well. For the Fano plane that is $1 + 3 \cdot 2 = 7$.

This is the mathematics behind the card game Spot It, in which every two cards share exactly one picture: the cards are lines and the pictures are points (see [Lesson 18](../18-a-card-game-from-a-plane/)).

These are exactly the numbers from Lesson 1: a planar difference set has $v = n^2 + n + 1$ and $k = n + 1$. The next plane up has order 3: 13 points, with 4 on each line. Its lines are the 13 translates of $\{0, 1, 3, 9\}$ mod 13:

<div data-widget="translates" data-v="13" data-set="0,1,3,9" data-j="1"></div>

Projective planes are known for every order $n$ that is a prime or a power of a prime: 2, 3, 4, 5, 7, 8, 9, 11, … No plane of order 6 exists (this follows from the Bruck–Ryser theorem of 1949), and none of order 10 (shown by a long computer search completed by Lam, Thiel, and Swiercz in 1989). Whether one of order 12 exists is still unknown.

## Cyclic planes are difference sets

In the Fano plane, the symmetry $i \mapsto i + 1$ carried every point around a single cycle. Call a projective plane **cyclic** if it has a symmetry like that: a rearrangement of the points that carries every line onto a line, and that moves some point through all $v$ points before returning to it.

In a cyclic plane we can number the points so that the symmetry is just "add 1". Start anywhere and call that point 0, call the point it moves to 1, the next 2, and so on up to $v - 1$. Then the symmetry sends point $i$ to point $i + 1 \pmod v$.

> **Theorem.** A cyclic projective plane of order $n$ is the same thing as an $(n^2 + n + 1,\ n + 1,\ 1)$ difference set: the lines of the plane are the translates of the set.

Here is why, in two directions.

**From a difference set to a plane.** Let $D$ be a planar difference set mod $v$, and let the points be $0, 1, \dots, v - 1$ and the lines be the translates $D + j$. Lesson 2 showed that any two points lie together in exactly one translate (axiom 1) and any two different translates share exactly one point (axiom 2). Axiom 3 holds once $n \ge 2$. Adding 1 sends each translate $D + j$ to $D + (j + 1)$, so it is a symmetry, and it cycles through all the points. So the plane is cyclic.

**From a plane to a difference set.** Now start with a cyclic plane, numbered so that the symmetry is "add 1". Pick any line and call its set of points $D$. It has $k = n + 1$ points.

1. *The translates of $D$ are lines.* Applying the symmetry $j$ times turns the line $D$ into $D + j$, and a symmetry carries lines to lines.
2. *They are all different.* Suppose some turn by $s$ steps, with $s$ not a multiple of $v$, gave $D + s = D$. The turns that leave $D$ unchanged can be added and subtracted, so they are exactly the multiples of the smallest one, $g$; and since turning by $v$ steps changes nothing, $g$ divides $v$. Then $D$ breaks into separate cycles $x, x + g, x + 2g, \dots$, each of $v / g$ points, so $v / g$ divides $k = n + 1$. But $v = n(n + 1) + 1$, so a number dividing both $v$ and $n + 1$ must divide 1. Hence $v / g = 1$, so $g = v$, contradicting that $s$ was not a multiple of $v$. So $D, D + 1, \dots, D + (v - 1)$ are $v$ different lines.
3. *They are all the lines.* The plane has exactly $v = n^2 + n + 1$ lines, and we've found $v$ different ones.
4. *Every difference occurs once.* Take any nonzero difference $d$. The points 0 and $d$ lie on exactly one line, which is some translate $D + j$. As in Lesson 2, each pair $a, b$ in $D$ with $a - b \equiv d$ gives a translate containing 0 and $d$ (namely $j = -b$), and different pairs give different translates. Since there is exactly one such translate, there is exactly one such pair.

So $D$ is a $(v, n + 1, 1)$ difference set, and every line is a translate of it. The order $n$ of the plane is the order $n = k - 1$ of the difference set from [Lesson 1](../01-differences-on-a-circle/), which is why we gave that number a name.

## Where do these planes come from?

The puzzle from Lesson 1 has turned into a question about geometry. Finding a planar difference set means finding a projective plane with a symmetry that turns all of it around one cycle. The Fano plane has one. Does the plane of order 3 have one? (Yes: the widget above shows it.) Of order 4? Of order 1000?

So: **where do planes with that symmetry come from?**

Singer's answer is that they come from arithmetic, in number systems where you can add, subtract, multiply, and divide just as with ordinary fractions, but with only finitely many numbers. Those are the *finite fields*, and Part III builds them from scratch.

<section class="try-it">

## Try it

In the plane of order 3 whose lines are the translates of $D = \{0, 1, 3, 9\}$ mod 13, find the line through the points 2 and 5. Use the method from step 4: which pair in $D$ has difference $5 - 2 = 3$?

<details>
<summary>Show the answer</summary>

The pair is $3$ and $0$, since $3 - 0 = 3$. Turning $D$ so that 0 lands on 2 means adding $j = 2$, which also moves 3 to 5. So the line is $D + 2 = \{2, 3, 5, 11\}$. It contains both 2 and 5, and it is the only translate that does.

</details>

</section>

Build planes from your own sets in the [difference set workbench](../../playgrounds/difference-workbench/?v=13&set=0,1,3,9): a set is a cyclic projective plane exactly when the workbench reports a $(v, k, 1)$ difference set with $k \ge 3$.
