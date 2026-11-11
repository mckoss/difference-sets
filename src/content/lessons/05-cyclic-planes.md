---
title: "Cyclic planes are difference sets"
order: 5
part: 2
summary: "A projective plane with one symmetry that carries every point around a single cycle is exactly a planar difference set."
status: ready
---

**You'll learn:** what a cyclic projective plane is, why it is the same thing as a planar difference set, and what question that leaves for the rest of the path.

## One symmetry, one cycle

[Lesson 4](../04-projective-planes/) counted the points and lines of a projective plane but gave no way to build one. The planes we have seen so far share a feature that the axioms never mention. In the Fano plane, the symmetry $i \mapsto i + 1$ of [Lesson 3](../03-fano-plane/) carried every point around a single cycle. Call a projective plane **cyclic** if it has a symmetry like that: a rearrangement of the points that carries every line onto a line, and that moves some point through all $v$ points before returning to it.

In a cyclic plane we can number the points so that the symmetry is just "add 1". Start at the point the symmetry carries around the whole cycle and call it 0; call the point it moves to 1, the next 2, and so on up to $v - 1$. The cycle visits every point, so every point gets exactly one number, and the symmetry sends point $i$ to point $i + 1 \pmod v$.

> **Theorem.** A cyclic projective plane of order $n$ is the same thing as an $(n^2 + n + 1,\ n + 1,\ 1)$ difference set: the lines of the plane are the translates of the set.

Here is why, in two directions.

**From a difference set to a plane.** Let $D$ be a planar difference set mod $v$, and let the points be $0, 1, \dots, v - 1$ and the lines be the translates $D + j$. Lesson 2 showed that any two points lie together in exactly one translate (axiom 1 of Lesson 4) and any two different translates share exactly one point (axiom 2). Axiom 3 holds once $n \ge 2$: take two translates $L$ and $M$, meeting at a point $O$. Since $k = n + 1 \ge 3$, each has at least two more points, say $A, B$ on $L$ and $C, D$ on $M$. Any three of $A, B, C, D$ include two from the same translate, say $L$, and the only line through those two is $L$ (axiom 1); the third point is not on $L$, since it would then be a second point shared by $L$ and $M$. So no three of the four lie on one line. (For $n = 1$ this fails: $\{0, 1\}$ mod 3 has only three points, a triangle.) Adding 1 sends each translate $D + j$ to $D + (j + 1)$, so it is a symmetry, and it cycles through all the points. So the plane is cyclic.

**From a plane to a difference set.** Now start with a cyclic plane, numbered so that the symmetry is "add 1". Pick any line and call its set of points $D$. It has $k = n + 1$ points.

1. *The translates of $D$ are lines.* Applying the symmetry $j$ times turns the line $D$ into $D + j$, and a symmetry carries lines to lines.
2. *They are all different.* Suppose some translation by $s$, with $s$ not a multiple of $v$, gave $D + s = D$. Then $D$ would be made up of whole cycles of that translation, all of the same length, and that length would divide both $v$ and $k = n + 1$ (see below). But $v = n(n + 1) + 1$, so a number dividing both $v$ and $n + 1$ also divides $v - n(n + 1) = 1$. So the cycles have length 1, which forces $s$ to be a multiple of $v$ after all. So $D, D + 1, \dots, D + (v - 1)$ are $v$ different lines.
3. *They are all the lines.* The plane has exactly $v = n^2 + n + 1$ lines, and we've found $v$ different ones.
4. *Every difference occurs once.* Take any nonzero difference $d$. The points 0 and $d$ lie on exactly one line, which is some translate $D + j$. As in Lesson 2, each pair $a, b$ in $D$ with $a - b \equiv d$ gives a translate containing 0 and $d$ (namely $j = -b$), and different pairs give different translates. Since there is exactly one such translate, there is exactly one such pair.

<details>
<summary>Why the cycles in step 2 have the same length, dividing both v and n + 1</summary>

Call a translation by $t$ *harmless* if $D + t = D$. Translating by $v$ is harmless, and so is translating by $s$. If $t$ and $t'$ are harmless, so are $t + t'$ (translate by one, then the other) and $t - t'$ (translate by one, then back by the other). Let $g$ be the smallest positive harmless translation. Every harmless $t$ is a multiple of $g$: divide, as in Lesson 1, to write $t = mg + r$ with $0 \le r < g$; then $r = t - mg$ is harmless, and since $r < g$ it must be 0. In particular $g$ divides $v$, and $s$ is a multiple of $g$.

Now take any point $x$ of $D$. Since $g$ is harmless, $x + g$ is in $D$, and so is $x + 2g$, and so on. This list first returns to $x$ after exactly $v / g$ steps: $x + (v / g) g = x + v \equiv x$, and an earlier return $x + ag \equiv x$ would mean $ag$ is a multiple of $v$, so $a$ is a multiple of $v / g$. So $D$ splits into cycles of $v / g$ points each, with every point of $D$ in exactly one cycle, and $v / g$ divides $k = n + 1$. It also divides $v$. If $v / g = 1$ then $g = v$, and $s$, a multiple of $g$, is a multiple of $v$.

</details>

So $D$ is a $(v, n + 1, 1)$ difference set, and every line is a translate of it.

Here is a plane of order 4 seen this way: 21 points, and for lines the 21 translates of $\{0, 1, 4, 14, 16\}$ mod 21. Choose any two translates and they share exactly one point; the table shows every pair at once.

<div data-widget="translates" data-v="21" data-set="0,1,4,14,16" data-j="1"></div>
 The order $n$ of the plane is the order $n = k - 1$ of the difference set from [Lesson 1](../01-differences-on-a-circle/), which is why we gave that number a name.

## Where do these planes come from?

The puzzle from Lesson 1 has turned into a question about geometry. Finding a planar difference set means finding a projective plane with a symmetry that carries all its points around one cycle. The Fano plane has one. Does the plane of order 3 have one? (Yes: its lines are the translates of $\{0, 1, 3, 9\}$ mod 13.) Of order 4? Of order 1024?

So: **where do planes with that symmetry come from?**

Singer's answer is that they come from arithmetic, in number systems where you can add, subtract, multiply, and divide just as with ordinary fractions, but with only finitely many numbers. Those are the *finite fields*, and Part III builds them from scratch.

<aside class="roadmap">
<span class="notation-title">The road ahead</span>

The answer takes three steps, and the next three parts take them one at a time.

1. **Build the finite fields (Part III, Lessons 6 to 10).** A finite field with $q$ elements exists exactly when $q$ is a prime or a power of a prime. That is where the "prime power" in Singer's result comes from.
2. **Use a field as coordinates (Part IV, Lessons 11 to 14).** Coordinate geometry describes a line by an equation. Do the same with coordinates from a field with $q$ elements, and the result is a projective plane of order $q$. Then the key step: the coordinate triples themselves form a larger field, so they can be multiplied, and multiplying by one well-chosen element carries the whole plane around a single cycle.
3. **Turn it into an algorithm (Part V, Lessons 15 and 16).** One formula picks out a line of that plane, and the numbers of its points are the difference set.

The question above gets its answer in [Lesson 14](../14-singer-cycle/), and the finished algorithm is in [Lesson 15](../15-writing-down-a-difference-set/).

</aside>

Part VII, on what difference sets are used for, can be read from here. Its lessons on a [card game](../20-a-card-game-from-a-plane/), [error-correcting codes](../23-majority-rules/), [radios that always meet](../24-always-meet/), [rulers with no repeated distance](../25-a-ruler-with-no-repeats/), [race charts](../26-a-fair-race/), and [disk arrays](../28-rebuilding-a-disk/) rest only on Lessons 1 to 5.

<section class="try-it">

## Try it

In the plane of order 3 whose lines are the translates of $D = \{0, 1, 3, 9\}$ mod 13, find the line through the points 2 and 5. Use the method from step 4: which pair in $D$ has difference $5 - 2 = 3$?

<details>
<summary>Show the answer</summary>

The pair is $3$ and $0$, since $3 - 0 = 3$. Translating $D$ so that 0 lands on 2 means adding $j = 2$, which also moves 3 to 5. So the line is $D + 2 = \{2, 3, 5, 11\}$. It contains both 2 and 5, and it is the only translate that does.

</details>

</section>

Build planes from your own sets in the [difference set workbench](../../playgrounds/difference-workbench/?v=13&set=0,1,3,9): a set is a cyclic projective plane exactly when the workbench reports a $(v, k, 1)$ difference set with $k \ge 3$.
