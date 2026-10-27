---
title: "Is every planar difference set a Singer set?"
order: 16
part: 6
summary: "The completeness conjecture: Singer's construction may find every planar difference set there is."
status: planned
---

> This lesson is planned. Here is what it will cover.

## You'll learn

- **The completeness conjecture.** Every $(n^2 + n + 1, n + 1, 1)$ difference set is equivalent to a Singer set. Put geometrically: every cyclic projective plane is Desarguesian, coming from a field as in Part IV.
- **The prime power conjecture**, a consequence: a planar difference set of order $n$ exists only when $n$ is a prime power.
- **The evidence.** Exhaustive computer searches over *all* planar difference sets of small orders find exactly the Singer classes; the counts appear in OEIS [A058241](https://oeis.org/A058241). Non-Desarguesian planes do exist (the smallest have order 9), but none known is cyclic.
- **How a proof might go.** Hints at the tools that settle special cases:
  - *Multiplier theorems*: every prime divisor of $n$ (under conditions) acts as a multiplier, which pins down a lot of structure.
  - *Group rings and characters*: turning $D$ into an element of $\mathbb{Z}[\mathbb{Z}/v\mathbb{Z}]$ and the equation $D D^{(-1)} = n + (\text{everything})$ into statements about cyclotomic integers.
  - *Non-existence tests* in the spirit of Bruck–Ryser–Chowla that rule out whole families of orders.
  - *Symmetry forces a field*: theorems showing that a plane with a large enough symmetry group must be Desarguesian. The open question is whether one cycle is enough.
- **A contrast.** In higher dimensions the analogue is *false*: Gordon–Mills–Welch sets share Singer's parameters without being equivalent to Singer sets.
