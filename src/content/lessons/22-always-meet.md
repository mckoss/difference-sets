---
title: "Always meet"
order: 22
part: 7
summary: "Radios that wake on a few slots and still always hear each other, whatever their clocks say."
status: ready
---

**You'll learn:** how a difference set lets battery-powered radios sleep most of the time and still be sure to hear each other, and how the same picture shares secret keys and settles who goes next in a network.

## Radios that sleep

A small radio sensor, say one counting cars at a road or measuring soil moisture in a field, runs for years on a battery only if its radio is switched off most of the time. But two radios can talk only when both are awake at once. If their clocks agreed, they could simply wake together. Cheap clocks drift, though, and a radio that has just been switched on has no idea what time its neighbors think it is.

So divide time into short **slots**, grouped into a cycle of $v$ slots that repeats forever. Each radio is awake in the same few slots of every cycle and asleep in the rest. A radio whose clock runs $i$ slots ahead of ours is awake at the same slots, shifted by $i$.

We want a schedule with the property:

> Whatever the two clock offsets are, two radios are both awake in at least one slot of every cycle.

Here are three radios on the 7-slot schedule $D = \{0, 1, 3\}$: each is awake in 3 slots out of 7 and asleep in the other 4. Drag the sliders to move each radio's clock, or press **Shuffle clocks**. A slot where two radios are awake at once gets a bold outline.

<div data-widget="wake-up" data-v="7"></div>

However you set the clocks, every two radios with different offsets share exactly one awake slot. Press **Random** to try a different set of 3 slots out of 7 instead. Now some clock offsets leave two radios that are never awake together: they could sit side by side for a year and never hear each other. (**Show a pair that never meets** finds one.)

## Why they always meet

A radio whose clock is $i$ slots ahead is awake in the slots $D + i$: the translate from [Lesson 2](../02-rotations/), with every member of $D$ moved $i$ steps around the 7-slot clock (counting mod 7, as in [Lesson 1](../01-differences-on-a-circle/)). Two radios with offsets $i$ and $j$ are both awake in the slots in both $D + i$ and $D + j$, the *intersection* $(D + i) \cap (D + j)$.

Lesson 2 counted that intersection: two translates share as many points as there are ways to write $j - i$ as a difference of two members of $D$. In a difference set, every nonzero difference occurs exactly $\lambda$ (the Greek letter lambda) times, and for $\{0, 1, 3\}$ mod 7 that is once. So any two radios with different clocks share exactly $\lambda = 1$ awake slot, whatever the offsets are. The radios don't need to know the offset. The schedule works for all of them at once.

## How few slots can a radio be awake?

Being awake costs battery, so we want each radio awake in as few slots as possible. Suppose a radio is awake in $k$ slots of a $v$-slot cycle. To meet a neighbor whose clock is ahead by $d$ slots, the schedule needs two of its awake slots that are $d$ apart, and that has to work for each of the $v - 1$ possible offsets $d = 1, 2, \dots, v - 1$. The $k$ awake slots make $k(k - 1)$ ordered pairs, so

$$
k(k - 1) \ge v - 1.
$$

(The sign $\ge$ means "is greater than or equal to".)

A planar difference set meets this with nothing to spare: each of the $k(k - 1)$ pairs covers a different offset. With $v = q^2 + q + 1$ slots and $k = q + 1$ awake, as Singer's construction gives for every prime power $q$, a radio is awake for about $1/q$ of the time:

| Cycle $v$ | Awake slots $k$ | Fraction awake |
|---:|---:|---:|
| 7 | 3 | 43% |
| 13 | 4 | 31% |
| 21 | 5 | 24% |
| 133 | 12 | 9% |
| 1057 | 33 | 3% |

The fraction falls roughly like one over the square root of $v$, the best any schedule can do by the inequality above. Try the 13- and 21-slot cycles in the menu above.

This idea is in real designs. A 2006 patent application by Zi-Tsan Chou of Taiwan's Institute for Information Industry describes radios whose awake beacon intervals "form a cyclic difference set", and its worked example is a cycle of 7 intervals with the radio awake in intervals 0, 1, and 3: exactly the schedule above. Earlier, Rong Zheng, Jennifer Hou, and Lui Sha framed the best wake-up schedule for radios with unsynchronized clocks as a problem about designs like these, and reported energy savings of up to 70%.

## Same picture, new labels

Nothing in the argument used time. It only used "item $i$ gets the set $D + i$, and any two of those sets overlap in exactly one member". Switch the menu in the widget from **Radios and time slots** to the other two readings.

**Shared keys.** Before sensors are scattered in a field, give sensor $i$ the numbered secret keys $D + i$ (its *key ring*). Any two sensors then hold exactly one key in common and can use it to talk privately, while each sensor stores only about $\sqrt{v}$ keys (the square root of $v$) instead of one per neighbor. Seyit Çamtepe and Bülent Yener proposed key rings of exactly this shape, the lines of a projective plane, in 2004; any two lines of a projective plane meet in exactly one point ([Lesson 4](../04-projective-planes/)).

**Quorums.** A group of $v$ servers shares one resource, say a file that only one server may change at a time. Before changing it, server $i$ asks permission from the servers in its *quorum* $D + i$, and each server grants permission to only one asker at a time. Since any two quorums overlap, two servers can never both collect full permission: some server in both quorums has said yes to only one of them. Mamoru Maekawa's 1985 algorithm uses quorums that are the lines of a finite projective plane, so each request takes a small multiple of $\sqrt{v}$ messages instead of the $2(v - 1)$ needed to ask everyone. This is a classic of distributed computing courses; the systems in wide use today mostly use simpler majority quorums instead.

The research behind the key rings and the quorums is well cited, but I have not found either in a shipping product. The wake-up schedule is the one with a patent.

<section class="try-it">

## Try it

1. With the schedule $D = \{0, 1, 3\}$ mod 7, radio A has offset 0 and radio B has offset 4. Which slot are both awake in? Find it from a difference of $D$, then check with the widget.
2. Explain why no schedule with only 2 awake slots out of 7 can always meet.

<details>
<summary>Show the answer</summary>

1. A is awake in $\{0, 1, 3\}$ and B in $\{4, 5, 7\} = \{0, 4, 5\}$, so they share slot 0. From differences: we need two members $a$ and $b$ of $D$ with $a - b \equiv 4 \pmod 7$. That is $a = 0$, $b = 3$, since $0 - 3 = -3 \equiv 4$. The shared slot is $a = 0$: it is in $D$, and $0 - 4 \equiv 3$ is in $D$ too, so it is in $D + 4$.
2. Two awake slots give only $2 \times 1 = 2$ ordered pairs, so they cover at most 2 of the 6 possible offsets $1, \dots, 6$. For the other offsets, the two radios never share a slot. (Three slots give $3 \times 2 = 6$ pairs, just enough, and $\{0, 1, 3\}$ uses each one.)

</details>

</section>

In the [difference set workbench](../../playgrounds/difference-workbench/?v=13&set=0,1,3,9), the translates table at the bottom shows every pair of schedules at once: each entry off the diagonal is the number of awake slots two radios share.

## Sources

- Z.-T. Chou, "Asynchronous power management methods and systems for wireless networks," US patent [US7747273B2](https://patents.google.com/patent/US7747273B2/en), Institute for Information Industry, filed 2006, granted 2010.
- R. Zheng, J. C. Hou, and L. Sha, "Asynchronous wakeup for ad hoc networks," *ACM MobiHoc* 2003, pp. 35–45, [doi:10.1145/778415.778420](https://doi.org/10.1145/778415.778420); journal version "Optimal block design for asynchronous wake-up schedules and its applications in multihop wireless networks," *IEEE Trans. Mobile Computing* 5(9), 2006, [doi:10.1109/TMC.2006.134](https://doi.org/10.1109/TMC.2006.134).
- S. A. Çamtepe and B. Yener, "Combinatorial design of key distribution mechanisms for wireless sensor networks," ESORICS 2004; journal version *IEEE/ACM Trans. Networking* 15(2), 2007, [doi:10.1109/TNET.2007.892879](https://doi.org/10.1109/TNET.2007.892879).
- M. Maekawa, "A √N algorithm for mutual exclusion in decentralized systems," *ACM Trans. Computer Systems* 3(2), 1985, [doi:10.1145/214438.214445](https://doi.org/10.1145/214438.214445).
