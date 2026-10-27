---
title: "A ruler with no repeats"
order: 23
part: 7
summary: "Marks whose distances are all different, for antennas and radio channels."
status: ready
---

**You'll learn:** what a Golomb ruler is, why a planar difference set is the most efficient ruler that can be wrapped around a circle, and how cutting the circle open gives a row of antennas that measures every spacing once.

## A ruler with only a few marks

An ordinary ruler has a mark at every unit. Here is a ruler of length 6 with only four marks, at 0, 1, 4, and 6:

$$
1 - 0 = 1,\quad 6 - 4 = 2,\quad 4 - 1 = 3,\quad 4 - 0 = 4,\quad 6 - 1 = 5,\quad 6 - 0 = 6.
$$

Every length from 1 to 6 can still be measured between two of its marks, and each one in exactly one way. A set of marks in which no two pairs are the same distance apart is called a **Golomb ruler**, after the mathematician Solomon Golomb. (A Golomb ruler doesn't have to measure *every* length; it only must never measure one twice.)

Why would anyone want that? Because in some machines each distance between two marks is a measurement, and measuring the same thing twice wastes hardware.

- **Antennas.** A radio telescope made of many dishes (an *interferometer*) combines the signals of every pair of dishes, and each pair measures the sky at a scale set by the distance between them, called the *baseline*. Two pairs with the same baseline measure the same thing. With dishes on a Golomb ruler, every pair measures something new.
- **Radio channels.** When several radio channels pass through the same amplifier, the amplifier mixes them, and pairs of channels create interference at new frequencies. In 1953 W. C. Babcock of Bell Labs showed that choosing channels whose spacings are all different avoids what engineers call third-order intermodulation interference.

## A ruler bent into a circle

Now bend a ruler of length $v$ into a circle, so that the mark at $v$ lands back on 0. On the circle there are two ways to go from one mark to another. Going clockwise from $a$ to $b$ takes $b - a$ steps, counted mod $v$ as in [Lesson 1](../01-differences-on-a-circle/); the other way round takes the rest of the circle, $v$ minus that.

A set of marks is a **modular Golomb ruler** if no two ordered pairs of marks are the same number of steps apart clockwise. A planar difference set is exactly this, with nothing missing: by definition, every number of steps $1, 2, \dots, v - 1$ occurs exactly once as a difference.

Below are the marks $\{0, 1, 3, 9\}$ on a circle of 13 steps. Click two marks to see the distance each way round, and watch the tally: each of the 12 distances shows the one pair of marks that measures it.

<div data-widget="golomb-ruler" data-v="13"></div>

## The smallest possible circle

How small can the circle be for $k$ marks? The $k$ marks form $k(k - 1)$ ordered pairs, one for each choice of a first mark and a different second mark. On a modular Golomb ruler these pairs are all different distances, and there are only $v - 1$ distances available, so $k(k - 1) \le v - 1$ (the sign $\le$ means "is less than or equal to", and $\ge$ means "is greater than or equal to"), or

$$
v \ge k^2 - k + 1.
$$

The circle is as small as it can be, $v = k^2 - k + 1$, exactly when every distance is used once, which means the marks form a planar difference set. With $k = q + 1$ marks this smallest circle has $(q + 1)^2 - (q + 1) + 1 = q^2 + q + 1$ steps, so Singer's construction gives a perfect circular ruler whenever $q$ is a prime power. Pick the other rulers in the menu: 3 marks on 7 steps, 5 on 21, and 6 on 31.

## Unwinding the circle

To lay antennas in a straight line, cut the circle open at one of the gaps between neighboring marks and straighten it. Press **Unwind**.

The straight ruler is still a Golomb ruler. Each distance along the straight line is one of the two distances round the circle between the same marks, and all of those were different. The ruler is $v$ minus the cut gap long, so cutting at the *longest* gap gives the shortest ruler: the menu marks that choice. For $\{0, 1, 3, 9\}$ mod 13 it gives four antennas at $\{0, 4, 5, 7\}$, a ruler of length 7 that measures every spacing from 1 to 7 except 6. The bars under the antennas count how many pairs measure each spacing: each bar is at most 1 high, and a red × marks a spacing that is missing.

These cut-open Singer sets are very nearly the shortest Golomb rulers known. The best ruler with 4 marks, $\{0, 1, 4, 6\}$ from the start of this lesson, has length 6, just 1 less. In a 2002 study of the problem, A. Dimitromanolakis describes how cutting Singer sets (and related sets from a construction of R. C. Bose) produces near-optimal rulers with many marks, and reports computations by Lam and Sarwate along these lines showing that for every number of marks below 150 there is a Golomb ruler shorter than the square of the number of marks.

## Where these rulers are used

Engineers have long laid out thinned antenna arrays this way. A 1978 Bell Labs patent by David Leeper places the elements of an antenna array at the positions of a cyclic difference set, taking the sets from L. D. Baumert's 1971 tables, and builds flat arrays from cyclic shifts of one row. In a 1999 follow-up, Leeper explains how the difference-set property keeps the array's unwanted side signals (its *side-lobes*) at an even, well-controlled level, the same "flat floor" idea that coded-aperture telescopes use in [Lesson 19](../19-pictures-without-a-lens/).

The motivating problem is older: in 1968 A. T. Moffet studied linear antenna arrays with as few repeated baselines as possible, which he found by searching rather than by construction. Difference-set layouts also appear in books on designing interferometers, such as Kopilovich and Sodin's. I have not, though, confirmed any operating radio telescope whose dishes sit on a Singer ruler, so think of this as a design method rather than a famous installation.

<section class="try-it">

## Try it

Unwind $D = \{0, 1, 4, 14, 16\}$ mod 21 by hand, cutting at its longest gap. Where do the five antennas go, and which spacing is missing? Check your answer with the widget.

<details>
<summary>Show the answer</summary>

Going clockwise, the gaps are $0 \to 1$ (1 step), $1 \to 4$ (3), $4 \to 14$ (10), $14 \to 16$ (2), and $16 \to 0$ (5 steps, since $21 - 16 = 5$). The longest is from 4 to 14. Cutting there and starting at 14 puts the marks at $14 \mapsto 0$, $16 \mapsto 2$, $0 \mapsto 7$, $1 \mapsto 8$, and $4 \mapsto 11$ (the arrow $\mapsto$ reads "goes to"). So the antennas are at $\{0, 2, 7, 8, 11\}$, a ruler of length $21 - 10 = 11$.

Its ten spacings are $2, 7, 8, 11, 5, 6, 9, 1, 4, 3$: every length from 1 to 11 except 10. No five marks can do better, because the shortest Golomb ruler with five marks has length 11.

</details>

</section>

Make and test your own circular rulers in the [difference set workbench](../../playgrounds/difference-workbench/?v=13&set=0,1,3,9): a set is a perfect circular ruler exactly when the workbench reports a $(v, k, 1)$ difference set.

## Sources

- W. C. Babcock, "Intermodulation interference in radio systems: frequency of occurrence and control by channel selection," *Bell System Technical Journal* 32(1), 1953, 63–73, [Bell Labs archive](https://www.nokia.com/bell-labs/publications-and-media/publications/intermodulation-interference-in-radio-systems-frequency-of-occurrence-and-control-by-channel-selection).
- A. T. Moffet, "Minimum-redundancy linear arrays," *IEEE Trans. Antennas and Propagation* 16(2), 1968, 172–175, [doi:10.1109/TAP.1968.1139138](https://doi.org/10.1109/TAP.1968.1139138).
- D. G. Leeper, "Thinned aperiodic antenna arrays with improved peak sidelobe level control," US patent [US4071848A](https://patents.google.com/patent/US4071848A/en), Bell Telephone Laboratories, 1978; and "Isophoric arrays—massively thinned phased arrays with well-controlled sidelobes," *IEEE Trans. Antennas and Propagation* 47(12), 1999, [doi:10.1109/8.817659](https://doi.org/10.1109/8.817659).
- A. Dimitromanolakis, *Analysis of the Golomb Ruler and the Sidon Set Problems, and Determination of Large, Near-Optimal Golomb Rulers*, Technical University of Crete, 2002, [PDF](https://www.cs.toronto.edu/~apostol/golomb/main.pdf), §5.5.
- L. E. Kopilovich and L. G. Sodin, [*Multielement System Design in Astronomy and Radio Science*](https://link.springer.com/978-1-4020-0069-0), Kluwer, 2001.
- L. D. Baumert, *Cyclic Difference Sets*, Lecture Notes in Mathematics 182, Springer, 1971.
