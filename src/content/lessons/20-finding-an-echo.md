---
title: "Finding an echo"
order: 20
part: 7
summary: "Codes that look like noise but line up with themselves in only one place."
status: ready
---

**You'll learn:** how a receiver finds a known signal buried in noise, why a difference set makes every wrong guess look the same, and why the best such codes are the Singer sets with $q = 2$.

## Listening for an echo

A radar sends out a pattern of pulses and listens for the echo. The echo comes back late, and the delay tells how far away the target is. But the echo is weak and arrives buried in noise. A sonar, a GPS receiver, and a sound engineer measuring a concert hall all face the same problem: *where, in all this noise, is my pattern, and how late is it?*

The receiver keeps a copy of the pattern, the **template**. It slides the template along what it received, and at each shift it measures how well the two match. The shift with the best match is its guess for the delay.

## Codes of +1 and −1

Our pattern is a **code**: a list of $v$ numbers, each $+1$ or $-1$, sent over and over. Write $s_0, s_1, \dots, s_{v-1}$ for its entries, and $r_0, r_1, \dots, r_{v-1}$ for what arrives.

<aside class="notation">
<span class="notation-title">Notation</span>

- $s_i$ (read "s sub i") is entry number $i$ of the code. The code repeats, so the index is taken mod $v$: $s_{v} = s_0$, and $s_{-1} = s_{v-1}$.
- $\sum$ (the capital Greek letter sigma) means "add up". $\sum_{i=0}^{v-1} x_i$ is $x_0 + x_1 + \dots + x_{v-1}$.
- The **match score** at shift $t$ multiplies each received value by the template shifted $t$ steps, and adds:

$$
C(t) = \sum_{i=0}^{v-1} r_i \, s_{i-t}.
$$

Where the two agree in sign, the product is positive; where they disagree, it is negative.

</aside>

Below, the code is hidden in the received signal at a delay you don't know. Drag the **template shift** slider and watch the score: at most shifts it hovers near zero, and at one shift it jumps. Press **Find the echo** to let the receiver pick the best shift, then try more noise, a longer code, or a **random** code.

<div data-widget="echo-finder" data-n="5" data-noise="1"></div>

The two charts at the bottom compare each code with an exact copy of itself, with no noise. The m-sequence code of length $v$ scores $v$ when lined up and exactly $-1$ at *every* other shift. The random code scores $v$ when lined up too, but its other scores wander up and down. Those bumps are false echoes waiting to happen: add noise, and one of them can beat the real peak.

## Why the floor is flat

The m-sequence code is built from a difference set $D$, a set of $k$ points on a clock with $v$ hours in which every nonzero difference occurs $\lambda$ times (λ is the Greek letter lambda; see [Lesson 1](../01-differences-on-a-circle/)). Put $s_i = -1$ when $i$ is in $D$, and $s_i = +1$ otherwise.

Compare the code with itself shifted by $t$, a shift that is not $0 \pmod v$. Entry by entry, the product is $+1$ where the two agree and $-1$ where they disagree. They disagree exactly at the points that are in one of $D$ and $D + t$ but not in the other. By [Lesson 2](../02-rotations/), $D$ and $D + t$ share exactly $\lambda$ points, so each has $k - \lambda$ points the other lacks: $2(k - \lambda)$ disagreements in all, and $v - 2(k - \lambda)$ agreements. So

$$
C(0) = v, \qquad C(t) = v - 2(k - \lambda) - 2(k - \lambda) = v - 4(k - \lambda) \quad \text{for every other } t.
$$

The score at every wrong shift is the same number. (For the codes of 0s and 1s in [Lesson 19](../19-pictures-without-a-lens/), the same counting gives $k$ at shift 0 and $\lambda$ everywhere else.)

## Which difference sets make good codes?

We want the wrong shifts to score as little as possible compared with the peak $v$. Here is $v - 4(k - \lambda)$ for a few Singer sets:

| Set | $v$ | $k$ | $\lambda$ | every wrong shift scores |
|---|---|---|---|---|
| plane, $q = 2$: $\{0, 1, 3\}$ | 7 | 3 | 1 | $-1$ |
| plane, $q = 3$: $\{0, 1, 3, 9\}$ | 13 | 4 | 1 | $1$ |
| plane, $q = 4$ | 21 | 5 | 1 | $5$ |
| plane, $q = 5$ | 31 | 6 | 1 | $11$ |
| $\mathrm{PG}(3, 2)$ | 15 | 7 | 3 | $-1$ |
| $\mathrm{PG}(m, 2)$ | $2^{m+1} - 1$ | $2^m - 1$ | $2^{m-1} - 1$ | $-1$ |

For the planes, the wrong-shift score is $q^2 - 3q + 1$, which grows quickly: planar Singer sets with large $q$ are poor $\pm 1$ codes. (They do better in the on/off settings of Lessons 19 and 21–23.) But for the Singer sets of $\mathrm{PG}(m, 2)$ from [Lesson 16](../16-beyond-the-plane/), $k - \lambda = 2^{m-1}$, so $4(k - \lambda) = 2^{m+1} = v + 1$, and every wrong shift scores exactly $-1$ against a peak of $v$.

Those are the codes in the widget. They are called **maximal-length sequences**, or **m-sequences**, and a **shift register** makes them: a row of bits that moves along one place per tick, with a few of the bits added (mod 2) to make the next one. As Lesson 16 explains, the positions of the 0s in one period form the Singer set. For length 7 the bits are 1, 0, 0, 1, 0, 1, 1: the 0s sit at $\{1, 2, 4\} = \{0, 1, 3\} + 1$.

## Where these codes work

- **Radar.** Sending a long coded pulse and correlating the echo against it is called *pulse compression*. A 1986 Raytheon patent uses maximal-length shift-register codes for this, and a 1979 ITT patent uses a maximal-length code precisely because its periodic correlation sidelobes are constant at $-1$.
- **Measuring sound.** Play an m-sequence (it sounds like hiss) through a loudspeaker, record it with a microphone, and correlate. Because the code's own correlation is a single spike, the result is the room's echo pattern itself. D. D. Rife and J. Vanderkooy described this in 1989, and it became the basis of a commercial analyser used to measure loudspeakers and rooms.
- **GPS, with a twist.** Each GPS satellite's C/A code adds together, bit by bit, two m-sequences of length 1023 made by 10-bit shift registers. Each of the two is a Singer-type sequence, but their sum is a *Gold code*, which is **not** a difference set: its correlation takes three values instead of two. That trade buys something a single m-sequence can't give: the codes of different satellites look unlike each other, so a receiver can pick out each one.
- **Scrambling data.** The DARC data channel for FM radio (Lesson 21) mixes its bits with an m-sequence of period 511 from the shift register with polynomial $x^9 + x^4 + 1$, a step called *scrambling*.

<section class="try-it">

## Try it

1. A code is built from $D = \{0, 1, 3, 9\}$ mod 13, with $s_i = -1$ on $D$. What does it score at every wrong shift?
2. The 15-hour set $\{0, 1, 2, 4, 5, 8, 10\}$ is a $(15, 7, 3)$ difference set. What does its code score at every wrong shift?

<details>
<summary>Show the answer</summary>

1. $v = 13$, $k = 4$, $\lambda = 1$, so $v - 4(k - \lambda) = 13 - 12 = 1$. The peak is 13.
2. $v = 15$, $k = 7$, $\lambda = 3$, so $15 - 4 \cdot 4 = -1$: the m-sequence pattern, with a peak of 15. Choose **length 15** in the widget to see it.

</details>

</section>

Look at the $(15, 7, 3)$ set in the [difference set workbench](../../playgrounds/difference-workbench/?v=15&set=0,1,2,4,5,8,10): every difference occurs exactly 3 times, which is what makes the floor flat.

## Sources

- S. W. Golomb and G. Gong, [*Signal Design for Good Correlation*](https://www.cambridge.org/core/books/abs/signal-design-for-good-correlation/cyclic-hadamard-sequences-part-1/715987DF48889D1FBE62C5AD5CF6DE0D), Cambridge University Press, 2005: m-sequences and cyclic difference sets.
- Q. Xiang, [a survey of two-level autocorrelation sequences](https://sites.udel.edu/qxiang/files/2017/08/SETAsurvey-2dbi869.pdf), on their equivalence with cyclic difference sets.
- J. D. Collins (Raytheon), "Processing arrangement for pulse compression radar," US patent 4,566,010 (1986). [Google Patents](https://patents.google.com/patent/US4566010A/en)
- J.-C. A. Debuisser (ITT), "Autocorrelation sidelobe suppression device for a continuous periodic phase-coded signal," US patent 4,156,876 (1979). [Google Patents](https://patents.google.com/patent/US4156876A/en)
- D. D. Rife and J. Vanderkooy, "Transfer-function measurement with maximum-length sequences," *Journal of the Audio Engineering Society* 37 (1989), 419. [AES library](https://aes2.org/publications/elibrary-page/?id=6086)
- GPS interface specification change notice IRN-IS-200N-003 (2023), describing the C/A code as the sum of two 1023-chip sequences. [gps.gov PDF](https://gps.gov/technical/icwg/meetings/2023/IRN-IS-200N-003_RFC502_20230927.pdf)
- ITU-R Recommendation BS.1194-2 (1998), the DARC system. [ITU PDF](https://www.itu.int/dms_pubrec/itu-r/rec/bs/R-REC-BS.1194-2-199812-I!!PDF-E.pdf)
