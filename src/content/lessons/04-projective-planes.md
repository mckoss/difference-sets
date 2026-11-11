---
title: "Projective planes in general"
order: 4
part: 2
summary: "The axioms, duality, and the counts: a plane of order n has n² + n + 1 points, as many lines, and n + 1 points on each line."
status: ready
---

**You'll learn:** the rules that define a projective plane, what duality is, and why every plane of order $n$ has $n^2 + n + 1$ points, $n^2 + n + 1$ lines, and $n + 1$ points on each line.

## The axioms

The Fano plane is the smallest example of a whole family of geometries. As in Lesson 3, a geometry here is a set of points and a collection of lines, each line a set of points.

> A **projective plane** is a geometry with these three properties, called its **axioms**:
>
> 1. Any two different points lie on exactly one line.
> 2. Any two different lines meet in exactly one point.
> 3. There are four points with no three of them on one line.

The first two are the rules from Lesson 3. The third only rules out trivial cases, such as a single line holding every point. (In the Fano plane, the points 3, 5, 6, and 0 work: the three corners and the center.)

## Duality

Swap the words "point" and "line" in axiom 1, and swap "lie on" with "meet in", and you get axiom 2. Swap them in axiom 2 and you get axiom 1. Axiom 3 swaps into "there are four lines with no three through one point", and that follows from the axioms too (see below). So the axioms don't care which objects we call points and which we call lines. This is **duality**: whenever something is true about points and lines in every projective plane, the swapped statement is true as well. We'll use it below.

<details>
<summary>Why there are four lines with no three through one point</summary>

Take the four points $A, B, C, D$ of axiom 3 and the four lines $AB$, $BC$, $CD$, $DA$ (where $AB$ means the line through $A$ and $B$). These are four different lines: if two of them were the same line, it would hold three of the four points. Now suppose three of them passed through one point. Any three of the four share a "middle" line with its two neighbors, say $AB$, $BC$, $CD$. The lines $AB$ and $BC$ are different and both contain $B$, so by axiom 2 they meet only at $B$; the common point of all three must be $B$. But then $B$ lies on $CD$, putting $B, C, D$ on one line, which axiom 3 forbids. The other choice of three, $BC$, $CD$, $DA$, fails the same way at $C$.

</details>

## Counting points and lines

**All lines have the same size.** Take two different lines, $L$ and $M$, and a point $P$ that lies on neither of them (axiom 3 makes sure one exists; see below). For each point $X$ of $L$, the line through $P$ and $X$ meets $M$ in exactly one point. This pairs off the points of $L$ with the points of $M$ one for one, like shining a light from $P$ and watching $L$ cast its shadow on $M$. So $L$ and $M$ have the same number of points.

<details>
<summary>Why the point P exists, and why the pairing is one for one</summary>

Axiom 3 gives four points with no three on a line. $L$ holds at most two of them, and so does $M$. If one of the four is on neither line, take it as $P$. Otherwise $L$ holds two of them, say $A$ and $B$, and $M$ holds the other two, $C$ and $D$. Let $P$ be the point where the lines $AC$ and $BD$ meet (axiom 2). If $P$ were on $L$, then $L$ and $AC$ would share the two points $A$ and $P$ (and $P \ne A$, since $A$ is not on $BD$), so by axiom 1 they would be the same line, putting $C$ on $L$ with $A$ and $B$. That is three of the four on one line, which axiom 3 forbids. The same argument shows $P$ is not on $M$.

For the pairing: the line $PX$ is not $M$, because $P$ is not on $M$, so it meets $M$ in exactly one point. Two different points $X, X'$ of $L$ give two different lines, since a line holding both $X$ and $X'$ would be $L$ itself, which misses $P$; so different points of $L$ land on different points of $M$. And every point $Y$ of $M$ is landed on: the line $PY$ meets $L$ in some point $X$, and the line $PX$ is then $PY$.

</details>

Call that number $n + 1$. The number $n$ is the **order** of the plane. (Counting one less than the size of a line keeps the formulas below simple, and it matches Lesson 1, where a planar difference set has $k = n + 1$ members.) The Fano plane has 3 points on each line, so its order is $n = 2$.

**Every point lies on $n + 1$ lines.** Take a point $P$ and a line $L$ that does not pass through it. (One exists: among the four points of axiom 3, pick three different from $P$, say $A$, $B$, $C$; the lines $AB$ and $BC$ meet only at $B$, so at least one of them misses $P$.) Each line through $P$ meets $L$ in exactly one point, and two different lines through $P$ cannot meet $L$ at the same point, since they would then share two points. Every point $X$ of $L$ is reached, by the line through $P$ and $X$. So the lines through $P$ pair off with the $n + 1$ points of $L$.

**There are $n^2 + n + 1$ points.** Stand at one point $P$. It lies on $n + 1$ lines, and each of those lines holds $n$ more points besides $P$. Every other point of the plane is on exactly one of these lines, by axiom 1. So the number of points is

$$
1 + (n + 1) \cdot n = n^2 + n + 1.
$$

By duality there are $n^2 + n + 1$ lines as well. For the Fano plane that is $1 + 3 \cdot 2 = 7$. From here on we write $v = n^2 + n + 1$ for the number of points of a plane, just as $v$ was the number of hours on the clock in Lesson 1.

This is the mathematics behind the card game Spot It, in which every two cards share exactly one picture: the cards are lines and the pictures are points (see [Lesson 20](../20-a-card-game-from-a-plane/)).

These are exactly the numbers from Lesson 1: a planar difference set has $v = n^2 + n + 1$ and $k = n + 1$. The next plane up has order 3: 13 points, with 4 on each line. Its lines are the 13 translates of $\{0, 1, 3, 9\}$ mod 13:

<div data-widget="translates" data-v="13" data-set="0,1,3,9" data-j="1"></div>

Projective planes are known for every order $n$ that is a prime or a power of a prime: 2, 3, 4, 5, 7, 8, 9, 11, … No plane of order 6 exists (this follows from the Bruck–Ryser theorem of 1949), and none of order 10 (shown by a long computer search completed by Lam, Thiel, and Swiercz in 1989). Whether one of order 12 exists is still unknown.

## What the counts leave open

The axioms say how many points and lines a plane of order $n$ must have. They do not say how to build one. So far we have two planes, of orders 2 and 3, and both came from a difference set: their lines are its translates, and adding 1 to every point carries each line onto the next. The next lesson shows that this is not a coincidence. A plane with a symmetry like that and a planar difference set are the same thing.

<section class="try-it">

## Try it

1. A projective plane has 6 points on each line. How many points does it have, how many lines, and how many lines pass through each point?
2. Can a projective plane have exactly 10 points?

<details>
<summary>Show the answers</summary>

1. Six points on a line means order $n = 5$. So there are $n^2 + n + 1 = 31$ points and 31 lines, and each point lies on $n + 1 = 6$ lines.
2. No. The number of points is $n^2 + n + 1$ for a whole number $n \ge 2$: that gives 7, 13, 21, 31, … and never 10.

</details>

</section>

Check the counts for a plane of your own in the [difference set workbench](../../playgrounds/difference-workbench/?v=13&set=0,1,3,9): any $(v, k, 1)$ difference set with $k \ge 3$ gives one, as the next lesson explains.
