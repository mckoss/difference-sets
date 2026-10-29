---
title: "A fair race"
order: 24
part: 7
summary: "A Pinewood Derby chart in which every car races in every lane and meets every other car."
status: ready
---

**You'll learn:** how turning one starting lineup around the clock gives a race schedule in which every car runs once in each lane and meets every other car equally often, and why that works only for a few numbers of cars.

## A race with lanes

In a Cub Scout *Pinewood Derby*, each scout builds a small wooden car, and the cars roll side by side down a sloped track with several lanes. Tracks with 2 to 6 lanes are typical, and some have 8. One run down the track, with a car in each lane, is a **heat**.

The lanes are never quite identical, so a car that always got the fast lane would win more than it should. A car that kept meeting the fastest cars would look worse than it is. So a fair schedule, or *race chart*, asks for three things:

1. every car races the same number of heats,
2. every car races once in each lane, and
3. every two cars race each other the same number of times.

A Caltech student I once interviewed told me about organizing a race like this with difference sets. Here is how it works.

## Turn one lineup around the clock

Say there are 13 cars, numbered 0 to 12, and a track with 4 lanes. Choose the lineup for the first heat, heat 0: cars 0, 1, 3, and 9, in lanes 1 to 4. For every later heat, add 1 to each car number, counting mod 13 as on the clock of [Lesson 1](../01-differences-on-a-circle/), so that car 12 is followed by car 0:

| Heat | Lane 1 | Lane 2 | Lane 3 | Lane 4 |
|---:|---:|---:|---:|---:|
| 0 | 0 | 1 | 3 | 9 |
| 1 | 1 | 2 | 4 | 10 |
| 2 | 2 | 3 | 5 | 11 |
| 3 | 3 | 4 | 6 | 12 |
| 4 | 4 | 5 | 7 | 0 |
| … | | | | |
| 12 | 12 | 0 | 2 | 8 |

That makes 13 heats. Heat $j$ is the translate $D + j$ from [Lesson 2](../02-rotations/), with $D = \{0, 1, 3, 9\}$ and each car kept in the lane of the member of $D$ it came from.

The whole chart is below. Click any car to follow it: its heats light up, and the strip underneath counts how often it meets each other car.

<div data-widget="race-chart" data-lanes="4" data-cars="13"></div>

## Why the chart is fair

**Lanes and heats.** Lane 1 holds cars $0, 1, 2, \dots, 12$ in turn, one per heat, and so does every other lane, starting from a different car. So each car races exactly once in each lane, which also means it races in exactly 4 heats. In lane $i$, car $c$ races in heat $c - d_i$, where $d_i$ is the member of $D$ in that lane. This works for *any* heat-0 lineup of 4 different cars. Rotating the lineup takes care of the first two goals by itself.

**Opponents.** Cars $a$ and $b$ race in the same heat $j$ when $a - j$ and $b - j$ are both in $D$. Call those two members $d$ and $d'$. Then $b - a = d' - d$, so each heat that $a$ and $b$ share comes from one way of writing $b - a$ as a difference of two members of $D$. This is the overlap count of Lesson 2 again. The set $\{0, 1, 3, 9\}$ is a $(13, 4, 1)$ difference set, which means every nonzero difference occurs exactly $\lambda = 1$ time (λ is the Greek letter lambda). So every two cars race each other exactly once.

Nothing is wasted. The 13 heats each hold $4 \times 3 / 2 = 6$ pairs of cars, which makes 78 meetings, and there are exactly $13 \times 12 / 2 = 78$ pairs of cars to meet.

Now type a different heat-0 lineup into the widget, say `0, 1, 2, 3`. Every car still races once in each lane, but cars 1 apart now meet three times, and cars 4 apart never meet: 4 is not a difference of $\{0, 1, 2, 3\}$. Press **Fairest** to go back.

## Every two heats share a car

Turn the picture around, as with duality in [Lesson 4](../04-projective-planes/). Lesson 2 showed that two translates $D + i$ and $D + j$ share exactly $\lambda$ points, so in this chart **every two heats have exactly one car in common**. Look at the last column of the widget: every heat shares one car with the heat after it.

This has a practical cost. That car has to be carried back from the finish line to the starting gate in time for the next heat, and no reordering of the heats can avoid it, because *every* pair of heats shares a car. Race software tries to keep cars from running in two heats in a row (DerbyNet, a free, open-source race manager, reorders heats with that goal), but on a perfect chart with $\lambda = 1$ it can't succeed.

## How many cars can race?

Here is the limit. On a track with $k$ lanes, each car races $k$ heats, and in each heat it meets $k - 1$ other cars, so it has $k(k - 1)$ meetings in all. If it is to meet each of the other $N - 1$ cars the same number of times $\lambda$, then

$$
\lambda (N - 1) = k (k - 1).
$$

So $N - 1$ has to divide $k(k - 1)$ exactly. With $\lambda = 1$, every two cars meeting once, there must be exactly $N = k^2 - k + 1$ cars. That is also the most cars for which everyone can meet everyone in one pass through the chart: with more cars than that, $k(k - 1)$ meetings are not enough to reach all $N - 1$ opponents, and some pairs never meet.

The counting rule leaves only a few car counts for each track. A computer search over every heat-0 lineup decides which of those have a perfect rotation chart:

| Lanes $k$ | $k(k - 1)$ | Car counts the counting allows | Perfect rotation chart |
|---:|---:|:---|:---|
| 2 | 2 | 3 | 3 |
| 3 | 6 | 4, 7 | 4, 7 |
| 4 | 12 | 5, 7, 13 | 5, 7, 13 |
| 5 | 20 | 6, 11, 21 | 6, 11, 21 |
| 6 | 30 | 7, 11, 16, 31 | 7, 11, 31 |
| 7 | 42 | 8, 15, 22, 43 | 8, 15 |
| 8 | 56 | 9, 15, 29, 57 | 9, 15, 57 |

(With exactly $k$ cars every car is in every heat, so the table starts at $k + 1$.)

- **$k + 1$ cars** is the easy case: each heat leaves out one car, and every two cars meet $k - 1$ times.
- **$k^2 - k + 1$ cars** is a planar difference set, so by Lessons 4 and 14 it exists when $k - 1$ is a prime power: Singer's construction gives the 3, 7, 13, 21, 31, and 57 in the last column. For 7 lanes, 43 cars would need a projective plane of order 6, and there is none. That rules out every perfect chart for 7 lanes and 43 cars, not just rotations, because a perfect chart *is* a projective plane: its heats are the lines and its cars the points.
- **The cases in between** are difference sets with $\lambda > 1$, like the ones in [Lesson 16](../16-beyond-the-plane/). Seven lanes and 15 cars is the Singer set of $\mathrm{PG}(3, 2)$, with every two cars meeting 3 times. Eleven cars on 5 lanes is the biplane $\{0, 1, 2, 4, 7\}$ mod 11, where every two cars meet twice.
- **Twenty-two cars on 7 lanes and 29 cars on 8** pass the counting test, but no perfect chart of any kind exists for them. The Bruck–Ryser–Chowla theorem, the general form of the test with squares in [Lesson 17](../17-every-planar-set-singer/), rules them out.
- **Sixteen cars on 6 lanes** is the odd one out. A perfect chart exists, with every two cars meeting twice. It is even a rotation if the cars are named by pairs $(x, y)$ of numbers mod 4 and both coordinates are rotated: start from $\{(0, 1), (0, 2), (0, 3), (1, 0), (2, 0), (3, 0)\}$. But no lineup works on a 16-hour clock.

## The obvious fix: phantom cars

Most packs don't have exactly 13 cars. The obvious fix is to pretend they do. Take the perfect chart for the next size up and fill the missing places with **byes**: phantom cars that don't exist, whose lanes simply run empty. Ten scouts on a 4-lane track can race the 13-car chart, with cars 10, 11, and 12 as byes. Deleting cars takes away no meetings between the cars that are left, so every real car still races once in each lane and still meets every other real car exactly once.

Better still, it seems, pick the perfect chart to fit the pack. For $N$ racers, take the smallest planar difference set with at least $N$ points, and race on as many lanes as it has members:

| Racers | Chart | Lanes | Heats |
|:---|:---|---:|---:|
| up to 7 | $\{0, 1, 3\}$ mod 7 | 3 | 7 |
| 8 to 13 | $\{0, 1, 3, 9\}$ mod 13 | 4 | 13 |
| 14 to 21 | $\{0, 1, 4, 14, 16\}$ mod 21 | 5 | 21 |
| 22 to 31 | a $(31, 6, 1)$ set | 6 | 31 |
| 32 to 57 | a $(57, 8, 1)$ set | 8 | 57 |

(There is no 7-lane row, because the 43-car chart would be a plane of order 6.) Every pack of up to 57 scouts gets a perfect race: everyone in every lane once, everyone against everyone once. Stan Pope agreed that byes help. His chart generator advises that "more accurate results will be accomplished by running byes in a PPN chart constructed for a slightly larger number of cars."

So why isn't this how every derby is run? Because fairness is not the only thing a race chart has to deliver.

**The track decides the lanes.** A chart with $k$ lanes needs a track with $k$ lanes, and a pack usually has one track. It can't build a fifth lane because 20 scouts signed up this year. On a 4-lane track the largest perfect one-round chart has 13 cars, so for a pack of 20 there is no perfect chart at all. Each car gets only $4 \times 3 = 12$ meetings, and phantom cars add none. A track wider than the chart is no help either. Ten scouts on a 6-lane track could race the 13-car, 4-lane chart, but then two lanes stand empty in every heat and each scout races 4 times instead of 6.

**Byes cost heats.** A chart with byes still has about as many heats as the perfect chart, however few real cars there are. A heat takes about as long to stage and run with an empty lane as with a full one. Here is the price on a 4-lane track, with the byes placed as well as possible:

| Real cars | Heats with byes | Lanes left empty | Rotation chart heats | Rotation: each pair meets |
|---:|---:|---:|---:|:---|
| 12 | 13 | 8% | 12 | once or twice |
| 11 | 13 | 15% | 11 | once or twice |
| 10 | 13 | 23% | 10 | once or twice |
| 9 | 12 | 25% | 9 | once or twice |
| 8 | 12 | 33% | 8 | once or twice |
| 6 | 11 | 45% | 6 | twice or 3 times |

(For 7 cars and for 5 there are perfect 4-lane charts with every lane full, so byes aren't needed.) Where the byes go matters. A heat whose cars are all phantoms is empty and can be skipped. With 9 cars, make the 4 byes the cars of one heat. That heat drops out, and since every two heats share exactly one car, each of the other 12 heats has exactly one empty lane. The chart is still perfect. (Mathematicians call it the *affine plane* of order 3.)

**Empty lanes change the race.** When places earn points, second place out of 3 cars is not the same as second out of 4. A heat with byes also compares fewer cars, and with too many byes a car can end up alone in a heat, racing nobody.

## Charts that fill every lane

The alternative is the chart the earlier sections built: a rotation with exactly $N$ cars on the track's own $k$ lanes. It works for any number of cars on any track. It takes exactly $N$ heats with every lane full in every heat, and every car still races once in each lane. Only the opponent counts give a little.

That trade is usually a good one. When an electronic timer scores each car by its own times, which opponents it raced matters much less than which lanes it raced in, and the rotation gets the lanes exactly right. Byes pay off when the pack is just short of a perfect size. With 29 or 30 cars on a 6-lane track, the 31-car chart with byes costs only one or two extra heats. No rotation of 29 or 30 cars on 6 lanes even comes close: some pairs meet twice while others never meet. Further below a perfect size, the empty lanes cost more than the fairness is worth.

Change the numbers in the widget's menus: for every track up to 8 lanes and every field up to 60 cars, it loads the fairest rotation found by an exhaustive search over heat-0 lineups. Two things can happen.

**Fewer cars than $k^2 - k + 1$.** Meetings can't all be equal, but usually they can be nearly equal. With 4 lanes and 10 cars, each car has 12 meetings to share among 9 opponents, and the lineup $\{0, 1, 2, 5\}$ makes every two cars meet once or twice. Stan Pope and Cory Young call a chart like this, where every car races once in each lane and no two matchup counts differ by more than 1, a *Partial Perfect-N* chart. Pope reported that none was known for 5 lanes with 20 or 22 cars, or for 6 lanes with 16, 17, 29, 30, 32, 33, or 34 cars. The search here finds exactly the same gaps among rotations, so for those cases no rotation does better than meetings that differ by 2.

**More cars than $k^2 - k + 1$.** Some cars can't meet, and the fairest rotation is one in which no two cars meet twice. That is a modular Golomb ruler from [Lesson 23](../23-a-ruler-with-no-repeats/): a lineup whose differences are all different. With 4 lanes and 20 cars, $\{0, 1, 3, 7\}$ does it, and each car meets 12 of its 19 opponents once each. To meet more of them, race a second round from a different lineup.

## This is how real charts are made

Stan Pope, whose web pages on running Pinewood Derbies go back to the 1990s, described his *Perfect-N* charts in 1997 as charts in which "each car races in each lane the same number of times" and "each car races each opponent the same number of times". He built them exactly as above. He started from a list of numbers he called a *generator*, the steps between the cars in neighboring lanes, and moved every car up by 1 from each heat to the next. A generator is just the gaps of the heat-0 lineup: $\{0, 1, 3, 9\}$ has generator $(1, 2, 6)$.

Pope soon found the theory behind it. Marshall Hall's 1967 book *Combinatorial Theory* has the theorem that the translates of a difference set form a block design, and Pope wrote that "every symmetric Perfect-N chart which I had previously created can be replaced by an equivalent cyclic $(v, k, l)$ block design", with $l$ for λ. He thanks "Douglas J. Zare with a 'Cal Tech' E-Mail address" for pointing him to Hall's book, so Caltech was in this story from the start.

The idea still runs races today. DerbyNet's scheduler builds each round from a generator in the same way. Its 4-lane chart for 13 cars uses the generator $(2, 4, 12)$, which gives the heat-0 lineup $\{0, 2, 6, 18\} = \{0, 2, 6, 5\}$ mod 13. That is $2 \cdot \{0, 1, 3, 9\}$: the same difference set multiplied by 2, as in [Lesson 15](../15-many-sets-few-shapes/).

<section class="try-it">

## Try it

1. In the 13-car chart from $D = \{0, 1, 3, 9\}$, in which heat do cars 2 and 7 race each other, and in which lanes? Work it out from a difference of $D$, then check by clicking car 2 in the widget.
2. A pack has 6 lanes and 40 cars. Can every two cars race each other in one pass through a chart in which every car races once in each lane?

<details>
<summary>Show the answer</summary>

1. We need members $d$ and $d'$ of $D$ with $d' - d \equiv 7 - 2 = 5 \pmod{13}$. Running through the differences of $\{0, 1, 3, 9\}$, the one that works is $1 - 9 = -8 \equiv 5$. So car 7 sits where $d' = 1$ (lane 2) and car 2 where $d = 9$ (lane 4), in heat $j = 7 - 1 = 6$. Check: heat 6 is $\{6, 7, 9, 15\} = \{6, 7, 9, 2\}$, with car 7 in lane 2 and car 2 in lane 4.
2. No. Each car races 6 heats and meets $6 \times 5 = 30$ opponents, counting repeats, but it has 39 other cars to meet. At least 9 of them it never races. A 6-lane track can let every car meet every other only with at most $6^2 - 6 + 1 = 31$ cars.

</details>

</section>

Try other lineups in the [difference set workbench](../../playgrounds/difference-workbench/?v=13&set=0,1,3,9): its translates table at the bottom counts, for every two heats, how many cars they share.

## Sources

- S. Pope, "Mathematics of Perfect-N" and "Combinatorial Theory" (1997), and S. Pope and C. Young, "Young and Pope" Pinewood Racing Charts, the Partial Perfect-N chart generator (1998–2004), originally at stanpope.net; read here in the [archived copy of Pope's pages](https://github.com/josephgeis/stan-pope-ppn).
- M. Hall Jr., *Combinatorial Theory*, Blaisdell, 1967: block designs and difference sets.
- J. Piazza, [DerbyNet](https://github.com/jeffpiazza/derbynet), race management software: the generator tables in `website/inc/generators/` and the heat reordering in `website/inc/schedule_ordered.inc`.
- S. Chowla and H. J. Ryser, "Combinatorial problems," *Canad. J. Math.* 2 (1950), 93–99: the Bruck–Ryser–Chowla theorem for symmetric designs.
- B. Showalter, "Pinewood Derby Chart," [Ruby Quiz #56](https://github.com/Sophrinix/rubyquiz-mirror/blob/master/rubyquiz/quiz56.html): the fairness rules for race charts and typical track sizes.
