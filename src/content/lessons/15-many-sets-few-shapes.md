---
title: "Many sets, few shapes"
order: 15
part: 5
summary: "Multiplying a difference set by t gives another one; multiplying a Singer set by p gives it back, which is why there are exactly φ(v)/3e Singer sets up to translation."
status: ready
---

## You'll learn

- That multiplying every member of a difference set by a number $t$ with no factor in common with $v$ gives another difference set, $t \cdot D$.
- That for a Singer set of order $q = p^e$, multiplying by $p$ just turns the set to a translate of itself, because of the Frobenius map. Such a $t$ is called a **multiplier**.
- How that sorts the $\varphi(v)$ multiples of $D$ into groups of $3e$: there are $\varphi(v)/3e$ different Singer sets up to translation, and $\varphi(v)/6e$ when mirror images count as the same.

## Multiplying a difference set

[Lesson 2](../02-rotations/) moved a difference set around the clock by adding: $D + j$. Here is another move: multiply every member by the same number $t$, mod $v$. Write the result $t \cdot D$ ("$t$ times $D$"). For $D = \{0, 1, 3\}$ mod 7,

$$
2 \cdot D = \{0, 2, 6\}, \qquad 3 \cdot D = \{0, 3, 9\} \equiv \{0, 2, 3\} \pmod 7.
$$

Both are difference sets again. The reason is short. Every difference of $t \cdot D$ is $t d_1 - t d_2 = t (d_1 - d_2)$, a difference of $D$ multiplied by $t$. When $t$ shares no factor with $v$, it has an inverse mod $v$ ([Lesson 5](../05-which-clocks-are-fields/) found inverses with Euclid's algorithm), so multiplying by $t$ just shuffles the nonzero residues: different residues go to different residues, and none goes to 0. Each nonzero residue occurred once as a difference of $D$, so each one still occurs once as a difference of $t \cdot D$.

When $t$ does share a factor with $v$, the shuffle breaks. With $v = 21$ and $t = 3$, $3 \cdot \{0, 1, 4, 14, 16\} = \{0, 3, 12, 42, 48\} \equiv \{0, 3, 12, 0, 6\}$: two members collide, and only four are left.

How many useful values of $t$ are there? Exactly $\varphi(v)$ of them, where $\varphi$ is Euler's phi of [Lesson 8](../08-primitive-elements/): the count of numbers from 1 to $v$ that share no factor with $v$. For $v = 7$ that is all six of $1, \dots, 6$; for $v = 21$ it is twelve.

## Three ways to move a set

Two difference sets can be related by any of three moves:

1. **Translation**: $D + j$, a turn of the clock.
2. **Negation**: $-D$, the multiple with $t = -1$, which is the mirror image: $-\{0, 1, 3\} = \{0, 6, 4\}$.
3. **Multiplication**: $t \cdot D$ for any $t$ that shares no factor with $v$.

Sometimes a multiple is nothing new. $2 \cdot \{0, 1, 3\} = \{0, 2, 6\}$, and that is $\{0, 1, 3\} + 6 = \{6, 7, 9\} \equiv \{6, 0, 2\}$: the same set, turned. When $t \cdot D$ is a translate of $D$, $t$ is called a **multiplier** of $D$. And $3 \cdot \{0, 1, 3\} = \{0, 2, 3\}$ is $\{0, 6, 4\} + 3$, a turn of the mirror image.

<aside class="notation">
<span class="notation-title">Notation: multiples</span>

- $t \cdot D = \{\, t d \bmod v : d \in D \,\}$, read "$t$ times $D$". Here $\in$ means "is an element of".
- $-D$: the mirror image of $D$, the multiple with $t = -1$.
- A **multiplier** of $D$ is a $t$ for which $t \cdot D$ is a translate $D + j$ of $D$.
- $\varphi(v)$ (phi of $v$): how many of $1, \dots, v$ share no factor with $v$. These are the values of $t$ for which $t \cdot D$ is again a difference set.

</aside>

## Multiplying by p is a symmetry

Now take the Singer set of [Lesson 14](../14-writing-down-a-difference-set/), $D = \{\, i : \mathrm{Tr}(\alpha^i) = 0 \,\}$, with $q = p^e$. The Frobenius map $x \mapsto x^p$ of [Lesson 9](../09-fields-inside-fields/) sends $\alpha^i$ to $\alpha^{pi}$, and by the freshman's dream it passes straight through the trace:

$$
\mathrm{Tr}(x)^p = \left(x + x^q + x^{q^2}\right)^p = x^p + (x^p)^q + (x^p)^{q^2} = \mathrm{Tr}(x^p).
$$

So $\mathrm{Tr}(\alpha^{pi}) = \mathrm{Tr}(\alpha^i)^p$, and that is 0 exactly when $\mathrm{Tr}(\alpha^i)$ is. In other words, $i$ is in $D$ exactly when $p i$ is:

$$
p \cdot D = D.
$$

For $q = 3$, $3 \cdot \{0, 1, 3, 9\} = \{0, 3, 9, 27\} \equiv \{0, 3, 9, 1\}$, the same set. For $q = 2$, $2 \cdot \{1, 2, 4\} = \{2, 4, 8\} \equiv \{2, 4, 1\}$. Multiplying by $p$ again and again, every power $p^m$ is a multiplier too. The powers come back to 1 after $3e$ steps, because $p^{3e} = q^3$, and $q^3 - 1 = (q - 1) v$ is a multiple of $v$. So a Singer set has (at least) the $3e$ multipliers

$$
1,\ p,\ p^2,\ \dots,\ p^{3e - 1} \pmod v.
$$

For $q = 3$ they are $1, 3, 9$ mod 13. For $q = 4 = 2^2$ there are six: $1, 2, 4, 8, 16, 11$ mod 21.

Geometrically, $x \mapsto x^p$ respects adding, $(u + w)^p = u^p + w^p$, and turns scaling by $s$ into scaling by $s^p$, which is still in $\mathrm{GF}(q)$. So it carries points to points and lines to lines: it is another symmetry of $\mathrm{PG}(2, q)$, one that sends point $i$ to point $p i$ and keeps point 0 where it is. The trace-zero line is one of the lines it leaves in place. Any other line $D + j$ goes to $p \cdot (D + j) = D + pj$, again a translate.

Two theorems say how far this goes. Marshall Hall (1947) proved that for *every* planar difference set of order $n$, Singer or not, every prime dividing $n$ is a multiplier; [Lesson 17](../17-every-planar-set-singer/) shows how that theorem constrains sets nobody has found. And Gordon, Mills, and Welch (1962) showed that a Singer set has no multipliers other than the powers of $p$. In particular, $-1$ is not a multiplier; in fact it is never a multiplier of any nontrivial difference set (Gordon, Mills, and Welch 1962; Johnsen 1964). So a Singer set is never a turn of its own mirror image.

## Counting the shapes

Multiplying all of $D$ by the $\varphi(v)$ choices of $t$ gives $\varphi(v)$ difference sets. Which of them are just turns of each other?

Multiplication spreads over a translate: $t \cdot (D + j) = t \cdot D + t j$. So if $t' \cdot D = t \cdot D + j$, multiplying both sides by the inverse $u$ of $t$ mod $v$ gives $(u t') \cdot D = D + u j$. That makes $u t'$ a multiplier, a power of $p$. So:

> $t \cdot D$ and $t' \cdot D$ are translates of each other exactly when $t' \equiv t \cdot p^m \pmod v$ for some $m$.

The $\varphi(v)$ values of $t$ therefore fall into groups $\{t, tp, tp^2, \dots\}$ of $3e$ each, one group per translation class:

$$
\text{Singer sets mod } v \text{ up to translation} = \frac{\varphi(q^2 + q + 1)}{3e}.
$$

Singer conjectured this count in 1938. Gerald Berman (1953) and Heini Halberstam and R. R. Laxton (1964) proved it. Since $-1$ is never a multiplier, the mirror image of each class is a different class, and the classes pair off:

$$
\text{up to translation and mirror images} = \frac{\varphi(q^2 + q + 1)}{6e}.
$$

For $q = 3$: $v = 13$, $\varphi(13) = 12$, and $3e = 3$. The twelve values of $t$ group as $\{1, 3, 9\}$, $\{4, 10, 12\}$, $\{2, 5, 6\}$, and $\{7, 8, 11\}$: four classes. The group holding $12 \equiv -1$ is the mirror image of $D$ itself, and $\{7, 8, 11\}$ mirrors $\{2, 5, 6\}$. So up to mirror images there are two shapes: $\{0, 1, 3, 9\}$ and $2 \cdot D = \{0, 2, 5, 6\}$, which turned and flipped is $\{0, 1, 4, 6\}$. These are the two diagrams in the gallery for $q = 3$.

Choose $q$ and $t$ below. The widget multiplies the trace set by $t$, says whether the result is a turn of $D$ or of its mirror image, and lists every $t$ by class. Each class is shown by its one translate that contains both 0 and 1 (there is exactly one, because the difference 1 occurs exactly once).

<div data-widget="multiplier-explorer" data-q="3" data-t="2"></div>

| $q$ | $v$ | $\varphi(v)$ | $3e$ | sets up to translation, $\varphi(v)/3e$ | up to mirror images too, $\varphi(v)/6e$ |
| --- | --- | --- | --- | --- | --- |
| 2 | 7 | 6 | 3 | 2 | 1 |
| 3 | 13 | 12 | 3 | 4 | 2 |
| 4 | 21 | 12 | 6 | 2 | 1 |
| 5 | 31 | 30 | 3 | 10 | 5 |
| 7 | 57 | 36 | 3 | 12 | 6 |
| 8 | 73 | 72 | 9 | 8 | 4 |
| 9 | 91 | 72 | 6 | 12 | 6 |
| 11 | 133 | 108 | 3 | 36 | 18 |
| 13 | 183 | 120 | 3 | 40 | 20 |

The middle column is OEIS [A335866](https://oeis.org/A335866). The last column, $1, 2, 1, 5, 6, 4, 6, 18, 20, \dots$ for $q = 2, 3, 4, 5, 7, 8, 9, 11, 13, \dots$, is OEIS [A058241](https://oeis.org/A058241), which its contributors computed by *searching* for every planar difference set, not just Singer's. That the two agree is the evidence behind the open question of Lesson 17.

## Where the other sets come from

Every one of these sets is a Singer set in its own right: it comes from choosing a different primitive element. If $\beta = \alpha^s$ (beta) is another primitive element of $\mathrm{GF}(q^3)$, then the trace construction with $\beta$ keeps the $i$ with $\mathrm{Tr}(\alpha^{si}) = 0$, that is, the $i$ with $s i$ in $D$. That is the multiple $u \cdot D$, where $u$ is the inverse of $s$ mod $v$. Choosing a different primitive polynomial is choosing a different $\alpha$, so it multiplies the set.

That explains the last loose end of Lesson 14. For $q = 4$ the site's `singerSet` builds the field from a degree-6 polynomial over $\mathrm{GF}(2)$, so its $\alpha$ is a different element, and it finds $\{3, 6, 7, 12, 14\}$. That is $5 \cdot D$ for the stepper's $D = \{7, 9, 14, 15, 18\}$, in the same class as $-D$, the mirror image.

So the many sets are one family: all the Singer sets of order $q$ are the multiples $t \cdot D$ and their translates, the lines of one plane read with different choices of $\alpha$. The words matter here. Under translation and multiplication together, there is exactly **one** Singer set per $q$. The numbers above count *different sets*, up to translation alone or up to translation and mirror images, not essentially different ones.

<section class="try-it">

## Try it

1. For $q = 2$, multiply $D = \{1, 2, 4\}$ mod 7 by each $t$ from 1 to 6. Which $t$ give $D$ back, and what do the others give?
2. How many different Singer sets are there mod 31 ($q = 5$), up to translation? Up to translation and mirror images?
3. For $q = 8 = 2^3$, which numbers mod 73 are the multipliers?

<details>
<summary>Show the answers</summary>

1. $t = 1, 2, 4$ give $\{1, 2, 4\}$ itself: these are the powers of $p = 2$. $t = 3, 5, 6$ all give $\{3, 5, 6\} = -D$, the mirror image. So there are $\varphi(7)/3 = 2$ sets up to translation, and $6/6 = 1$ shape.
2. $\varphi(31) = 30$ since 31 is prime, and $3e = 3$, so there are $30/3 = 10$ sets up to translation and $30/6 = 5$ up to mirror images. The widget with $q = 5$ lists all ten classes.
3. The powers of 2 mod 73, and there are $3e = 9$ of them: $1, 2, 4, 8, 16, 32, 64, 128 \equiv 55, 110 \equiv 37$, and then $74 \equiv 1$ again. So $\varphi(73)/9 = 72/9 = 8$ sets up to translation, and 4 shapes.

</details>

</section>

See one diagram per shape, for every $q$ up to 32, in the [Singer classes gallery](../../playgrounds/singer-classes/?q=5).
