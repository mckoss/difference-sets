---
title: "Differences on a circle"
order: 1
part: 1
summary: "What a difference set is, and why searching for one by hand quickly becomes hopeless."
status: planned
---

> This lesson is planned. Here is what it will cover.

## You'll learn

- Points on a clock face: a subset $D \subseteq \mathbb{Z}/v\mathbb{Z}$ and the differences $d_1 - d_2 \pmod v$ between its members.
- The definition of a $(v, k, \lambda)$ difference set: every nonzero residue occurs exactly $\lambda$ times.
- Brute force finds $\{0, 1, 3\} \bmod 7$ instantly, but there are $\binom{v}{k}$ candidates, and that count explodes.

Every nonzero residue mod 7 is a difference of two elements of $\{0, 1, 3\}$ exactly once:

$$
1 - 0 = 1,\quad 3 - 1 = 2,\quad 3 - 0 = 3,\quad 0 - 3 \equiv 4,\quad 1 - 3 \equiv 5,\quad 0 - 1 \equiv 6.
$$

<div data-widget="chord-diagram" data-set="0,1,3"></div>
