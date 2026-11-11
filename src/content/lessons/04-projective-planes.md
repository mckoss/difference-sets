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

Call that number $n + 1$. The number $n$ is the **order** of the plane. The Fano plane has 3 points on each line, so its order is $n = 2$.

**Every point lies on $n + 1$ lines.** Take a point $P$ and a line $L$ that does not pass through it. (One exists: among the four points of axiom 3, pick three different from $P$, say $A$, $B$, $C$; the lines $AB$ and $BC$ meet only at $B$, so at least one of them misses $P$.) Each line through $P$ meets $L$ in exactly one point, and two different lines through $P$ cannot meet $L$ at the same point, since they would then share two points. Every point $X$ of $L$ is reached, by the line through $P$ and $X$. So the lines through $P$ pair off with the $n + 1$ points of $L$.

**There are $n^2 + n + 1$ points.** Stand at one point $P$. It lies on $n + 1$ lines, and each of those lines holds $n$ more points besides $P$. Every other point of the plane is on exactly one of these lines, by axiom 1. So the number of points is

$$
1 + (n + 1) \cdot n = n^2 + n + 1.
$$

By duality there are $n^2 + n + 1$ lines as well. For the Fano plane that is $1 + 3 \cdot 2 = 7$. From here on we write $v = n^2 + n + 1$ for the number of points of a plane, just as $v$ was the number of hours on the clock in Lesson 1.

This is the mathematics behind the card game Spot It, in which every two cards share exactly one picture: the cards are lines and the pictures are points (see [Lesson 18](../18-a-card-game-from-a-plane/)).

These are exactly the numbers from Lesson 1: a planar difference set has $v = n^2 + n + 1$ and $k = n + 1$. The next plane up has order 3: 13 points, with 4 on each line. Its lines are the 13 translates of $\{0, 1, 3, 9\}$ mod 13:

<div data-widget="translates" data-v="13" data-set="0,1,3,9" data-j="1"></div>

Projective planes are known for every order $n$ that is a prime or a power of a prime: 2, 3, 4, 5, 7, 8, 9, 11, … No plane of order 6 exists (this follows from the Bruck–Ryser theorem of 1949), and none of order 10 (shown by a long computer search completed by Lam, Thiel, and Swiercz in 1989). Whether one of order 12 exists is still unknown.

## Cyclic planes are difference sets

In the Fano plane, the symmetry $i \mapsto i + 1$ carried every point around a single cycle. Call a projective plane **cyclic** if it has a symmetry like that: a rearrangement of the points that carries every line onto a line, and that moves some point through all $v$ points before returning to it.

In a cyclic plane we can number the points so that the symmetry is just "add 1". Start at the point the symmetry carries around the whole cycle and call it 0; call the point it moves to 1, the next 2, and so on up to $v - 1$. The cycle visits every point, so every point gets exactly one number, and the symmetry sends point $i$ to point $i + 1 \pmod v$.

> **Theorem.** A cyclic projective plane of order $n$ is the same thing as an $(n^2 + n + 1,\ n + 1,\ 1)$ difference set: the lines of the plane are the translates of the set.

Here is why, in two directions.

**From a difference set to a plane.** Let $D$ be a planar difference set mod $v$, and let the points be $0, 1, \dots, v - 1$ and the lines be the translates $D + j$. Lesson 2 showed that any two points lie together in exactly one translate (axiom 1) and any two different translates share exactly one point (axiom 2). Axiom 3 holds once $n \ge 2$: take two translates $L$ and $M$, meeting at a point $O$. Since $k = n + 1 \ge 3$, each has at least two more points, say $A, B$ on $L$ and $C, D$ on $M$. Any three of $A, B, C, D$ include two from the same translate, say $L$, and the only line through those two is $L$ (axiom 1); the third point is not on $L$, since it would then be a second point shared by $L$ and $M$. So no three of the four lie on one line. (For $n = 1$ this fails: $\{0, 1\}$ mod 3 has only three points, a triangle.) Adding 1 sends each translate $D + j$ to $D + (j + 1)$, so it is a symmetry, and it cycles through all the points. So the plane is cyclic.

**From a plane to a difference set.** Now start with a cyclic plane, numbered so that the symmetry is "add 1". Pick any line and call its set of points $D$. It has $k = n + 1$ points.

1. *The translates of $D$ are lines.* Applying the symmetry $j$ times turns the line $D$ into $D + j$, and a symmetry carries lines to lines.
2. *They are all different.* Suppose some turn by $s$ steps, with $s$ not a multiple of $v$, gave $D + s = D$. Then $D$ would be made up of whole cycles of such a turn, all of the same length, and that length would divide both $v$ and $k = n + 1$ (see below). But $v = n(n + 1) + 1$, so a number dividing both $v$ and $n + 1$ must divide 1. So the cycles have length 1, which forces $s$ to be a multiple of $v$ after all. So $D, D + 1, \dots, D + (v - 1)$ are $v$ different lines.
3. *They are all the lines.* The plane has exactly $v = n^2 + n + 1$ lines, and we've found $v$ different ones.
4. *Every difference occurs once.* Take any nonzero difference $d$. The points 0 and $d$ lie on exactly one line, which is some translate $D + j$. As in Lesson 2, each pair $a, b$ in $D$ with $a - b \equiv d$ gives a translate containing 0 and $d$ (namely $j = -b$), and different pairs give different translates. Since there is exactly one such translate, there is exactly one such pair.

<details>
<summary>Why the cycles in step 2 have the same length, dividing both v and n + 1</summary>

Call a turn $t$ *harmless* if $D + t = D$. Turning by $v$ steps is harmless, and so is $s$. If $t$ and $t'$ are harmless, so are $t + t'$ (turn by one, then the other) and $t - t'$ (turn by one, then back by the other). Let $g$ be the smallest positive harmless turn. Every harmless turn $t$ is a multiple of $g$: divide, as in Lesson 1, to write $t = mg + r$ with $0 \le r < g$; then $r = t - mg$ is harmless, and since $r < g$ it must be 0. In particular $g$ divides $v$, and $s$ is a multiple of $g$.

Now take any point $x$ of $D$. Since $g$ is harmless, $x + g$ is in $D$, and so is $x + 2g$, and so on. This list first returns to $x$ after exactly $v / g$ steps: $x + (v / g) g = x + v \equiv x$, and an earlier return $x + ag \equiv x$ would mean $ag$ is a multiple of $v$, so $a$ is a multiple of $v / g$. So $D$ splits into cycles of $v / g$ points each, with every point of $D$ in exactly one cycle, and $v / g$ divides $k = n + 1$. It also divides $v$. If $v / g = 1$ then $g = v$, and $s$, a multiple of $g$, is a multiple of $v$.

</details>

So $D$ is a $(v, n + 1, 1)$ difference set, and every line is a translate of it. The order $n$ of the plane is the order $n = k - 1$ of the difference set from [Lesson 1](../01-differences-on-a-circle/), which is why we gave that number a name.

## Where do these planes come from?

The puzzle from Lesson 1 has turned into a question about geometry. Finding a planar difference set means finding a projective plane with a symmetry that turns all of it around one cycle. The Fano plane has one. Does the plane of order 3 have one? (Yes: the widget above shows it.) Of order 4? Of order 1024?

So: **where do planes with that symmetry come from?**

Singer's answer is that they come from arithmetic, in number systems where you can add, subtract, multiply, and divide just as with ordinary fractions, but with only finitely many numbers. Those are the *finite fields*, and Part III builds them from scratch.

<aside class="roadmap">
<span class="notation-title">The road ahead</span>

The answer takes three steps, and the next three parts take them one at a time.

1. **Build the finite fields (Part III, Lessons 5 to 9).** A finite field with $q$ elements exists exactly when $q$ is a prime or a power of a prime. That is where the "prime power" in Singer's result comes from.
2. **Use a field as coordinates (Part IV, Lessons 10 to 13).** Coordinate geometry describes a line by an equation. Do the same with coordinates from a field with $q$ elements, and the result is a projective plane of order $q$. Then the key step: the coordinate triples themselves form a larger field, so they can be multiplied, and multiplying by one well-chosen element carries the whole plane around a single cycle.
3. **Turn it into an algorithm (Part V, Lessons 14 and 15).** One formula picks out a line of that plane, and the numbers of its points are the difference set.

The question above gets its answer in [Lesson 13](../13-singer-cycle/), and the finished algorithm is in [Lesson 14](../14-writing-down-a-difference-set/).

</aside>

Part VII, on what difference sets are used for, can be read from here. Its lessons on a [card game](../18-a-card-game-from-a-plane/), [error-correcting codes](../21-majority-rules/), [radios that always meet](../22-always-meet/), [rulers with no repeated distance](../23-a-ruler-with-no-repeats/), [race charts](../24-a-fair-race/), and [disk arrays](../25-rebuilding-a-disk/) rest only on Lessons 1 to 4.

<section class="try-it">

## Try it

In the plane of order 3 whose lines are the translates of $D = \{0, 1, 3, 9\}$ mod 13, find the line through the points 2 and 5. Use the method from step 4: which pair in $D$ has difference $5 - 2 = 3$?

<details>
<summary>Show the answer</summary>

The pair is $3$ and $0$, since $3 - 0 = 3$. Turning $D$ so that 0 lands on 2 means adding $j = 2$, which also moves 3 to 5. So the line is $D + 2 = \{2, 3, 5, 11\}$. It contains both 2 and 5, and it is the only translate that does.

</details>

</section>

Build planes from your own sets in the [difference set workbench](../../playgrounds/difference-workbench/?v=13&set=0,1,3,9): a set is a cyclic projective plane exactly when the workbench reports a $(v, k, 1)$ difference set with $k \ge 3$.
