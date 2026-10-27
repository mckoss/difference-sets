---
title: "A geometry with seven points"
order: 3
part: 2
summary: "The Fano plane, whose seven lines are the seven rotations of {0, 1, 3}."
status: ready
---

**You'll learn:** what a finite geometry is, how the smallest interesting one looks, and that its lines are exactly the translates of $\{0, 1, 3\}$ from Lesson 2.

## Points and lines, and nothing else

In school geometry a line is a straight, infinitely long thing. Here we keep only what matters for *incidence*, that is, which points lie on which lines. A **geometry** in this sense is a set of points together with a collection of lines, where each line is simply a set of points. A point **lies on** a line when it is one of that line's points.

Here is the most famous small example, the **Fano plane**, named after the Italian geometer Gino Fano. It has 7 points and 7 lines. Six of the lines are drawn straight: the three sides of the triangle and the three lines from each corner through the center. The seventh line is the circle through the midpoints of the sides. It counts as a line just as much as the others; it is only drawn curved because no drawing of the Fano plane on paper can make all seven lines straight.

<div data-widget="fano-plane"></div>

Click two points to find the line through them. Click two lines (in the picture, or in the list of buttons) to find the point where they meet. Whatever two you pick, the answer is always exactly one.

## The two rules

The Fano plane obeys two rules:

1. **Any two different points lie on exactly one line.**
2. **Any two different lines meet in exactly one point.**

The first rule is familiar from ordinary geometry. The second is not: in the ordinary plane, parallel lines never meet. In the Fano plane there are no parallels at all.

A few counts fall out of the picture. Every line has 3 points, and every point lies on 3 lines. There are 7 points and 7 lines. Click any single point in the widget to check that it lies on 3 lines.

## The lines are rotations of {0, 1, 3}

Look at the labels. The list of lines under the picture shows that every line is a translate of $D = \{0, 1, 3\}$ mod 7:

$$
\{0, 1, 3\},\ \{1, 2, 4\},\ \{2, 3, 5\},\ \{3, 4, 6\},\ \{0, 4, 5\},\ \{1, 5, 6\},\ \{0, 2, 6\}.
$$

This is no accident. Lesson 2 showed that for a planar difference set, any two points lie together in exactly one translate, and any two translates share exactly one point. Those are the two rules above. So the seven translates of $\{0, 1, 3\}$ *are* the lines of a geometry with the two rules, and with the points numbered well, that geometry is the Fano plane.

## A symmetry that turns the whole plane

Press **Rotate: i ↦ i + 1** in the widget. The arrow $\mapsto$ is read "goes to": every point $i$ moves to the point $i + 1$, with 6 going to 0. The widget picks one line, shows where its three points go, and highlights the line they land on. Press **Next line** to step through all seven.

Every line lands exactly on another line, because adding 1 to every point of $D + j$ gives $D + (j + 1)$. A rearrangement of the points that carries every line onto a line is called a **symmetry** of the geometry. This one is special: repeating it moves point 0 to 1, to 2, and so on through all seven points before returning to 0. One symmetry carries every point around a single cycle.

In the drawing this symmetry is invisible. The picture has the symmetries of a triangle, but $i \mapsto i + 1$ jumbles the picture completely while keeping every line a line. The numbering, not the drawing, is what reveals it. The next lesson asks which other geometries have such a symmetry.

<section class="try-it">

## Try it

1. Which line passes through the points 2 and 6? Which translate $\{0, 1, 3\} + j$ is it?
2. Where do the lines $\{1, 2, 4\}$ and $\{3, 4, 6\}$ meet?

Work them out from the list of lines, then check with the widget.

<details>
<summary>Show the answers</summary>

1. The line $\{0, 2, 6\}$. It is $\{0, 1, 3\} + 6 = \{6, 7, 9\} \equiv \{6, 0, 2\} \pmod 7$.
2. At the point 4, the only number in both lists. (The first is the circle, the second is the right side of the triangle.)

</details>

</section>

The translates of $\{0, 1, 3\}$ are also drawn in the [difference set workbench](../../playgrounds/difference-workbench/?v=7&set=0,1,3), below the workbench itself.
