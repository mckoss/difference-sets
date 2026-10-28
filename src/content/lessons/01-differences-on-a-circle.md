---
title: "Differences on a circle"
order: 1
part: 1
summary: "What a difference set is, and why searching for one by hand quickly becomes hopeless."
status: ready
---

**You'll learn:** how to do arithmetic on a clock, what a difference set is, and why finding one by trial and error stops working almost at once.

## A clock with seven hours

Picture a clock with only seven hours, numbered 0 to 6. Mark three of them: 0, 1, and 3. Now measure the distance between two marks by counting steps *forward* (clockwise) from one to the other. From 0 forward to 1 is 1 step; from 1 forward to 3 is 2 steps; from 3 forward to 0 is 4 steps, because you pass 4, 5, 6 and arrive at 0.

Click any two of the points below to count the steps both ways.

<div data-widget="clock-difference" data-v="7" data-a="3" data-b="0"></div>

Going from one mark to another and back again is a full trip around the clock, so the two distances always add up to 7.

## Arithmetic that wraps around

Counting around a clock is ordinary arithmetic with one twist: after 6 comes 0 again. Walk 10 steps forward from 0 and you go once around (7 steps) and then 3 more, landing on 3. Walk one step *backward* from 0 and you land on 6. Try any whole number, positive or negative, and watch where it lands:

<div data-widget="clock-mod" data-v="7" data-n="10"></div>

The pattern is the division you learned in school: divide n by 7 and keep the remainder. For 10 that is $10 = 1 \cdot 7 + 3$, so 10 lands on 3. For $-1$ it is $-1 = (-1) \cdot 7 + 6$, so $-1$ lands on 6. The remainder is always one of 0, 1, …, 6, which is why every number lands on one of the seven points.

<aside class="notation">
<span class="notation-title">Notation: clock arithmetic</span>

These symbols appear throughout the site. This is where they are defined.

- $\mathbb{Z}$ (a double-struck Z, from the German *Zahlen*, "numbers") stands for the **integers**, the whole numbers $\dots, -2, -1, 0, 1, 2, \dots$
- $v\mathbb{Z}$ stands for the **multiples of** $v$: $\dots, -2v, -v, 0, v, 2v, \dots$ For example, $7\mathbb{Z}$ is $\dots, -14, -7, 0, 7, 14, \dots$
- $a \equiv b \pmod v$, read "$a$ is congruent to $b$ mod $v$", means $a$ and $b$ differ by a multiple of $v$, so they land on the same point of a $v$-hour clock. For example, $10 \equiv 3 \pmod 7$ and $-1 \equiv 6 \pmod 7$.
- $\mathbb{Z}/v\mathbb{Z}$, read "Z mod v Z", stands for the **integers mod** $v$: the integers, but with two numbers counted as the same whenever they differ by a multiple of $v$. There are exactly $v$ of them, $0, 1, \dots, v - 1$, called **residues**: they are the $v$ points on the clock face.
- "$x \bmod v$" means the residue of $x$: its remainder after dividing by $v$. So $10 \bmod 7 = 3$.

</aside>

## The differences of a set

The **difference** $a - b$ of two marks is exactly the forward step count from $b$ to $a$, worked out mod $v$. With marks 0, 1, and 3 on the seven-hour clock there are six ways to pick an ordered pair of different marks, and here are their six differences:

$$
\begin{aligned}
1 - 0 &= 1, & 3 - 1 &= 2, & 3 - 0 &= 3, \\
0 - 3 &\equiv 4, & 1 - 3 &\equiv 5, & 0 - 1 &\equiv 6 \pmod 7.
\end{aligned}
$$

Every distance from 1 to 6 shows up, and each one shows up exactly once. That is unusual. Most sets of three marks miss some distances and repeat others.

Here is a workbench for trying sets yourself. Click points to add or remove them. The bar chart counts how often each difference appears; the dashed line shows how often each one *should* appear for the counts to come out even. Hover over a bar to see which chords make that difference.

<div data-widget="difference-workbench" data-v="7" data-set="0,1,3"></div>

Try clicking 3 to remove it and 2 to add it. The set 0, 1, 2 has the difference 1 twice ($1 - 0$ and $2 - 1$), and never makes 3 or 4.

## Difference sets

Now some names, so we can talk about this in general. Curly braces list the members of a set: $\{0, 1, 3\}$ is the set whose members are 0, 1, and 3. We write $D$ for the set of marks.

> A **$(v, k, \lambda)$ difference set** is a set $D$ of $k$ points on a $v$-hour clock such that every nonzero residue $1, 2, \dots, v - 1$ occurs as a difference $a - b$ of two members of $D$ exactly $\lambda$ times.

The symbol $\lambda$ is the Greek letter **lambda**. We use the same three letters everywhere on this site:

- $v$ is the number of points on the clock (the modulus),
- $k$ is the number of points in $D$,
- $\lambda$ is how many times each nonzero difference occurs.

So $\{0, 1, 3\}$ is a $(7, 3, 1)$ difference set. The workbench has more examples: $\{0, 1, 3, 9\}$ is a $(13, 4, 1)$ difference set, and $\{1, 3, 4, 5, 9\}$ is an $(11, 5, 2)$ difference set, where every difference turns up exactly twice.

### A quick count

A set of $k$ points has $k(k - 1)$ ordered pairs of different points: $k$ choices for the first and $k - 1$ for the second. Each pair gives one difference. In a difference set those differences are shared out evenly, $\lambda$ apiece, among the $v - 1$ nonzero residues, so

$$
k(k - 1) = \lambda (v - 1).
$$

Check it: for $\{0, 1, 3\}$, $3 \cdot 2 = 1 \cdot 6$. For the $(11, 5, 2)$ set, $5 \cdot 4 = 2 \cdot 10$.

The sets with $\lambda = 1$, where every difference occurs exactly once, are the ones this site is about. They are called **planar** difference sets, a name that Lessons 3 and 4 explain. With $\lambda = 1$ the count says $v = k(k - 1) + 1$. For reasons that will become clear in [Lesson 4](../04-projective-planes/), we introduce one more letter, $n = k - 1$, which we call the **order** of the difference set. In terms of the order,

$$
v = n^2 + n + 1, \qquad k = n + 1.
$$

For $n = 2, 3, 4, 5$ this gives clocks with $v = 7, 13, 21, 31$ points and sets of $k = 3, 4, 5, 6$ points.

## Why not just search?

For $v = 7$ you can find $\{0, 1, 3\}$ by fiddling. A computer could fiddle systematically: list every way to choose $k$ of the $v$ points, and check each one. How many are there?

The number of ways to choose $k$ things from $v$ is written $C(v, k)$ and read "$v$ choose $k$". To count them, pick the points one at a time: $v$ choices for the first, $v - 1$ for the second, and so on down to $v - k + 1$ for the last. Each set has been counted once for every order its $k$ points could have been picked in, and there are $k \cdot (k - 1) \cdots 2 \cdot 1$ such orders. So

$$
C(v, k) = \frac{v (v - 1) \cdots (v - k + 1)}{k (k - 1) \cdots 1}, \qquad C(7, 3) = \frac{7 \cdot 6 \cdot 5}{3 \cdot 2 \cdot 1} = 35.
$$

Thirty-five candidates is nothing. But watch the table below as $n$ grows. The last column assumes a computer that checks a billion sets every second.

<div data-widget="brute-force-count"></div>

Run the search for $v = 7$: it checks all 35 subsets and finds 14 difference sets, starting with $\{0, 1, 3\}$. For $v = 31$ it has to check 736,281 subsets, which still takes only a moment. But by $n = 10$, with $v = 111$, the count is in the hundreds of trillions, and by $n = 32$ no computer that could ever be built would finish. (Smarter searches prune most of these candidates, but they still grow far too fast.)

Yet in 1938 James Singer pulled off a bit of mathematical magic. Rather than search through millions of possible combinations, he found a way to calculate the members of a planar difference set directly, with no brute-force search at all, for every order $n$ that is a prime or a power of a prime. The rest of this site explains how. The first clue comes from turning the clock: that's the next lesson.

<section class="try-it">

## Try it

Find every way to fill in the blank so that $\{0, 1, \_\}$ is a $(7, 3, 1)$ difference set. Use the workbench, or reason it out: which differences do 0 and 1 already use?

<details>
<summary>Show the answer</summary>

The pair 0, 1 already uses the differences $1 - 0 = 1$ and $0 - 1 \equiv 6$. A third point $x$ adds four more: $x$, $-x$, $x - 1$, and $1 - x$, and these must be exactly 2, 3, 4, 5 in some order. Trying each $x$ from 2 to 6, only $x = 3$ (adding 3, 4, 2, 5) and $x = 5$ (adding 5, 2, 4, 3) work. So the answers are $\{0, 1, 3\}$ and $\{0, 1, 5\}$.

</details>

</section>

Explore further in the [difference set workbench](../../playgrounds/difference-workbench/?v=13&set=0,1,3,9), which handles clocks with up to 64 points.
