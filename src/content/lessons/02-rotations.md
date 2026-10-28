---
title: "Rotations that never overlap too much"
order: 2
part: 1
summary: "Translates of a difference set meet in exactly λ points, which is the clue that leads to geometry."
status: ready
---

**You'll learn:** what happens when you turn a difference set around the clock, and why two turned copies always overlap in the same number of points.

## Turning the clock

Take the set $D = \{0, 1, 3\}$ on the seven-hour clock and add 1 to every member. You get $\{1, 2, 4\}$: the same shape, turned one step clockwise. Add 2 instead and you get $\{2, 3, 5\}$. Add 5 and you get $\{5, 6, 8\}$, and since $8 \equiv 1 \pmod 7$ (see the [notation box in Lesson 1](../01-differences-on-a-circle/)), that is $\{1, 5, 6\}$.

> The **translate** $D + j$ is the set you get by adding $j$ to every member of $D$, working mod $v$. It is $D$ turned $j$ steps clockwise.

A turned copy has the same differences as the original, because $(a + j) - (b + j) = a - b$. So every translate of a difference set is again a difference set with the same $v$, $k$, and $\lambda$.

## How much do two copies overlap?

Below, $D + i$ is drawn in red and $D + j$ in green; a point in both is red with a green ring. Drag the sliders, or press **j + 1** to keep turning the green copy.

<div data-widget="translates" data-v="7" data-set="0,1,3" data-j="1"></div>

However you turn them, two different translates of $\{0, 1, 3\}$ share exactly one point. The table on the right shows this for every pair at once: the entry in row $i$, column $j$ is the number of points that $D + i$ and $D + j$ have in common. On the diagonal, where $i = j$, a copy is compared with itself and shares all $k = 3$ points. Everywhere else the entry is 1.

Now switch the menu to **{0, 1, 2} mod 7: not a difference set**. The table fills with 0s, 1s, and 2s. Set the sliders to $i = 0$ and $j = 1$: the copies $\{0, 1, 2\}$ and $\{1, 2, 3\}$ share two points. Set $j = 3$ and they share none.

## Why the overlap is always λ

The points that two sets have in common form their **intersection**, written with the symbol $\cap$. So $D \cap (D + j)$ means "the points in both $D$ and $D + j$". Let's count them.

A point $x$ is in $D + j$ exactly when $x - j$ is in $D$ (turn it back $j$ steps and you land in $D$). So $x$ is in both sets exactly when

$$
x \text{ is in } D \quad\text{and}\quad x - j \text{ is in } D.
$$

That makes $x$ and $x - j$ a pair of members of $D$ whose difference is $x - (x - j) = j$. It works the other way too: any pair $a, b$ in $D$ with $a - b \equiv j$ gives the shared point $x = a$. So shared points and pairs with difference $j$ match up one for one:

> The number of points shared by $D$ and $D + j$ equals the number of times $j$ occurs as a difference of $D$.

In a $(v, k, \lambda)$ difference set every nonzero $j$ occurs exactly $\lambda$ times, so $D$ and $D + j$ share exactly $\lambda$ points. The same holds for any two different translates $D + i$ and $D + j$: turn both back $i$ steps and you are comparing $D$ with $D + (j - i)$.

You can watch this in the widget. With $D = \{0, 1, 2\}$ and $j = 1$ the copies share two points, and the difference 1 occurs twice in $D$ ($1 - 0$ and $2 - 1$).

## The same fact, seen from the points

Turn the question around. Pick two different points $x$ and $y$ on the clock. How many translates contain both of them?

The translate $D + j$ contains $x$ and $y$ exactly when $x - j$ and $y - j$ are both in $D$. Those two members of $D$ have difference $(x - j) - (y - j) = x - y$. Each pair in $D$ with difference $x - y$ gives one such $j$, and different pairs give different $j$. So:

> Any two different points lie together in exactly $\lambda$ translates of $D$.

## The clue: when λ = 1, translates behave like lines

Put the two facts side by side for a planar difference set, where $\lambda = 1$:

- any two different points lie together in **exactly one** translate;
- any two different translates share **exactly one** point.

These two facts should sound familiar. In ordinary geometry, through any two points there is exactly one line, and two lines cross in at most one point. The hours on the clock and the translates of $D$ are related in just the way that points and lines are. So, by analogy, we borrow the words of geometry and give them new meanings here:

> **Definition.** For a planar difference set $D$ mod $v$:
>
> - a **point** is one of the $v$ hours $0, 1, \dots, v - 1$ on the clock;
> - a **line** is one of the translates $D + j$ of $D$;
> - a point is **on** a line when it is a member of that translate.

We have been calling the hours "points" all along; now the word has a partner. These are new terms, not claims about anything drawn with a ruler: a line here is just a set of $k$ hours. What the names buy us is that the two facts above now read like the rules of geometry:

- through any two different points there is exactly one line;
- any two different lines meet in exactly one point.

These lines even behave better than ordinary ones: no two are parallel, since every two of them meet.

There are $v$ of these lines, all different: two different translates share only one point, but a translate shares all $k$ of its points with itself. For $\{0, 1, 3\}$ that is 7 points and 7 lines, each line with 3 points. The next lesson draws this little geometry, and finds that it is a famous one.

<section class="try-it">

## Try it

Let $D = \{0, 1, 3, 9\}$ on the 13-hour clock. Write down $D + 5$. Which point does it share with $D$, and which pair of members of $D$ has difference 5?

<details>
<summary>Show the answer</summary>

$D + 5 = \{5, 6, 8, 14\}$, and $14 \equiv 1 \pmod{13}$, so $D + 5 = \{1, 5, 6, 8\}$. It shares exactly one point with $D$: the point 1. The matching pair is $1$ and $1 - 5 = -4 \equiv 9$: indeed $1 - 9 = -8 \equiv 5 \pmod{13}$. You can check this in the widget above by choosing $\{0, 1, 3, 9\}$ mod 13 and setting $i = 0$, $j = 5$.

</details>

</section>

The [difference set workbench](../../playgrounds/difference-workbench/?v=13&set=0,1,3,9) shows the translates of any set you build.
