---
title: "Pictures without a lens"
order: 19
part: 7
summary: "Coded-aperture telescopes: a mask of holes whose shadows can be unscrambled."
status: ready
---

**You'll learn:** how a metal plate full of holes can photograph the sky where no lens works, and why the holes should sit on the points of a difference set.

## Shadows instead of a lens

X-rays and gamma rays go straight through glass, so a lens cannot bend them into a picture. A **pinhole camera** still works: light from each star passes through one small hole and lands in its own spot. But a pinhole lets in very little light, and in X-ray astronomy every bit of light counts.

So open many holes. Now each star shines through all of them and casts a whole **shadow of the plate** onto the detector below, shifted according to the star's direction. The detector records all the shadows added together. That jumble looks like noise, but it isn't: we know the pattern of holes exactly, so we can try to unscramble it. A plate like this is a **coded aperture**, or **mask**.

Below, the left panel is the sky. The mask has 127 open holes (white) out of 255 cells, and the detector shows what it records. Click the sky to add stars (up to three), drag them around, and then press **Decode**.

<div data-widget="coded-aperture"></div>

The decoded picture shows each star as one sharp spot, at the right brightness, and every other pixel is exactly zero. Now press **Random mask**: a plate with the same number of holes, placed at random. The detector picture looks just as noisy, but the decoded picture is speckled with **ghosts**, faint spots where there is no star.

What makes the first mask special is that its holes are a difference set.

## A difference set folded into a grid

The mask comes from the Singer set of the 7-dimensional geometry $\mathrm{PG}(7, 2)$ from [Lesson 16](../16-beyond-the-plane/). It is a set $D$ of $k = 127$ points on a clock with $v = 255$ hours, and every nonzero difference occurs exactly $\lambda = 63$ times (λ is the Greek letter lambda, as in [Lesson 1](../01-differences-on-a-circle/)).

To make a rectangle, write $255 = 15 \times 17$ and send hour $i$ of the clock to the cell in row $i \bmod 15$ and column $i \bmod 17$. Because 15 and 17 have no common factor, every one of the 255 cells gets exactly one hour. (This is the *Chinese remainder theorem*: a number from 0 to 254 is pinned down by its remainders mod 15 and mod 17.) The cell is open when its hour is in $D$.

Folding keeps what matters. Sliding the grid down $a$ rows and right $b$ columns, wrapping around the edges, is the same as turning the clock by the one $t$ with $t \equiv a \pmod{15}$ and $t \equiv b \pmod{17}$. And by [Lesson 2](../02-rotations/), a turned copy $D + t$ shares exactly $\lambda$ points with $D$ whenever $t$ is not $0 \pmod{255}$. So:

> However you slide the mask (except not at all), the slid copy and the original have exactly $\lambda = 63$ open holes in common.

## Why the decoding is perfect

To decode, guess a position $z$ for a star. Slide the mask to where a star at $z$ would cast it, and add up the detector counts in the cells under its holes. Call that the **score** at $z$. Each star of brightness $b$ puts $b$ into each of the 127 cells its shadow lights up.

- A star sitting exactly at $z$ lines up with all $k = 127$ holes, so it adds $127b$ to the score.
- A star anywhere else lines up with exactly $\lambda = 63$ of them, so it adds $63b$, *wherever it is*.

So if the stars have total brightness $B$, and $s$ is the brightness of the star at $z$ (or 0 if there is none),

$$
\text{score} = 63B + (127 - 63)\,s.
$$

The detector tells us $B$ (its total count is $127B$), so we can solve for $s$:

$$
s = \frac{\text{score} - 63B}{64}.
$$

That is exactly what the widget computes at every cell. The wrong positions all get the same contribution, $\lambda B$, and subtracting it leaves a perfectly flat floor at 0. With a random mask the overlaps vary from shift to shift, so there is no single number to subtract, and what is left over shows up as ghosts.

The same works for any difference set, with $k$ and $\lambda$ in place of 127 and 63. It is the 2-D version of a fact we'll meet again in [Lesson 20](../20-finding-an-echo/): a difference set compared with a shifted copy of itself scores $k$ at no shift and $\lambda$ at every other shift.

## In orbit

- E. E. Fenimore and T. M. Cannon called masks like this **uniformly redundant arrays** (1978): masks built from cyclic difference sets, so that the decoded floor is flat. J. Gunson and B. Polychronopulos had based an X-ray mask design on cyclic difference sets two years earlier.
- The X-ray telescope on **Spacelab 2**, flown on the Space Shuttle *Challenger* in 1985, used two "Hadamard" masks of 31 × 33 and 127 × 129 cells. Since 31 × 33 = 1023 = 2¹⁰ − 1 and 127 × 129 = 16383 = 2¹⁴ − 1, these sizes suggest folded Singer sets with $q = 2$, as in our widget. (That reading is ours, from the dimensions.) The TTM telescope on the **Mir** space station used a 255 × 257 mask of the same kind.
- India's **ASTROSAT** observatory (in orbit since 2015) carries a coded-mask camera, CZTI. Its mask is built from 16 × 16 units, each holding a 255-element pseudo-noise pattern made from primitive polynomials of degree 8 plus one closed cell. A pseudo-noise pattern of length 255 = 2⁸ − 1 is exactly the kind of $q = 2$ Singer set the widget uses.
- Not every telescope uses Singer sets. ESA's **INTEGRAL** uses patterns built from the perfect squares mod a prime (a different family, close cousins of difference sets), and NASA's **Swift** uses a random mask. A random mask copes better with a very large detector with gaps, and it has no repeating pattern to confuse, at the price of ghosts like the ones you saw.

Real instruments lay out a 2 × 2 mosaic of the basic pattern, so that every star in view casts a complete, wrapped-around copy of it, just as the widget's wrapping grid assumes.

<section class="try-it">

## Try it

The Singer set of $\mathrm{PG}(5, 2)$ has $v = 63$, $k = 31$, and $\lambda = 15$, and folds into a 7 × 9 mask. One star of brightness 2 is in view. What score does decoding give at the star's own position, and at every other position? How do you turn those scores into the brightnesses 2 and 0?

<details>
<summary>Show the answer</summary>

At the star, all 31 holes line up, so the score is $31 \times 2 = 62$. Everywhere else exactly 15 holes line up, so the score is $15 \times 2 = 30$. The total brightness is $B = 2$, so subtract $\lambda B = 30$ and divide by $k - \lambda = 16$: the star's position gives $(62 - 30)/16 = 2$, and every other position gives $(30 - 30)/16 = 0$.

</details>

</section>

The smallest mask of this kind folds the 15-hour set $\{0, 1, 2, 4, 5, 8, 10\}$ (with $k = 7$, $\lambda = 3$) into a 3 × 5 grid. Check in the [difference set workbench](../../playgrounds/difference-workbench/?v=15&set=0,1,2,4,5,8,10) that every difference occurs exactly 3 times, and in its translates table that every two different turns share exactly 3 points.

## Sources

- E. E. Fenimore and T. M. Cannon, "Coded aperture imaging with uniformly redundant arrays," *Applied Optics* 17 (1978), 337–347. [doi:10.1364/AO.17.000337](https://doi.org/10.1364/AO.17.000337)
- J. Gunson and B. Polychronopulos, "Optimum design of a coded mask X-ray telescope for rocket applications," *Monthly Notices of the Royal Astronomical Society* 177 (1976), 485–497. [doi:10.1093/mnras/177.3.485](https://doi.org/10.1093/mnras/177.3.485)
- F. J. MacWilliams and N. J. A. Sloane, "Pseudo-random sequences and arrays," *Proceedings of the IEEE* 64 (1976), 1715–1729, on folding sequences into arrays. [doi:10.1109/PROC.1976.10411](https://doi.org/10.1109/PROC.1976.10411)
- A. Goldwurm and A. Gros, "Coded mask instruments for gamma-ray astronomy" (2023), the source for the instrument list. [arXiv:2305.10130](https://arxiv.org/abs/2305.10130)
- IUCAA, [ASTROSAT CZTI coded mask design](https://web.iucaa.in/~astrosat/CodedMask/MaskDesign.html).
- E. E. Fenimore and T. M. Cannon, "Mosaic of coded aperture arrays," US patent 4,228,420 (1980). [Google Patents](https://patents.google.com/patent/US4228420A/en)
