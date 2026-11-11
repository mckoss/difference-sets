---
title: "A race for any number of cars"
order: 27
part: 7
summary: "When the pack is not one of the few perfect sizes: the search for the fairest chart, why empty lanes are a poor trade, and how close to fair a full chart can be."
status: ready
---

**You'll learn:** what to do when the number of cars is not one of the few perfect sizes: how a search finds the fairest cyclic chart, why filling a bigger perfect chart with empty lanes is usually a poor trade, and how close to fair a chart with every lane full can get.

## Ten cars, four lanes

[Lesson 26](../26-a-fair-race/) built a race chart from the translates of one lineup, and found that it is perfectly fair only for a few numbers of cars: on $k$ lanes, $N$ cars can all meet equally often only when $N - 1$ divides $k(k - 1)$. Four lanes allow 5, 7, or 13 cars. A pack with 10 has no perfect chart.

It can still have a good one. Here is the chart the widget loads for 10 cars on 4 lanes, from the lineup $\{0, 1, 2, 5\}$ mod 10. Every car still races once in each lane. Click a car: it meets every other car once or twice.

<div data-widget="race-chart" data-lanes="4" data-cars="10"></div>

The rest of this lesson is about where that lineup came from, and why it beats the more obvious fix.

## How the search works

The search behind Lesson 26's table, and behind the widget's menus, uses no clever construction. It is the brute-force search of [Lesson 1](../01-differences-on-a-circle/): it tries heat-0 lineups one after another. Three facts keep it small enough to finish.

- **It only has to try lineups that contain car 0.** A cyclic chart is fixed by its heat-0 lineup, the $k$ cars that start in heat 0, and only *which* cars matter for fairness, not which lane each one starts in. Adding the same number $s$ to every car in the lineup gives the same heats in a different order: heat $j$ of the new chart is heat $j + s$ of the old one. So every lineup is a shifted copy of one that contains car 0, and the search needs only those. There are $C(N - 1, k - 1)$ of them ("$N - 1$ choose $k - 1$", as in Lesson 1): 220 for 13 cars on 4 lanes, and 231,917,400 for 57 cars on 8 lanes.
- **It scores a lineup without building the chart.** By [Lesson 26](../26-a-fair-race/#why-the-chart-is-fair), two cars $d$ apart meet once for each way of writing $d$ as a difference of two members of the lineup. So the search tallies the differences of the lineup, as the [difference set workbench](../../playgrounds/difference-workbench/) does, and reads off how often the least-met and the most-met pairs meet. A lineup is perfect exactly when every difference has the same count, which means it is a difference set.
- **It gives up early.** It builds each lineup one car at a time, and it abandons a partial lineup as soon as some difference already occurs too often. It also abandons one when the pairs still to come are too few to fill in the differences that occur too rarely. Most lineups are never finished.

The search looks first for a lineup in which every pair meets equally often. If there is none, it looks for one in which the counts differ by at most 1, then by at most 2, and so on. Among equally even lineups it prefers the one whose most-met pair meets fewest times. Running it for all 385 tracks with 2 to 8 lanes and up to 60 cars takes about half a minute, and the results are stored in a table that the widget reads.

Because the search tries every lineup, its "none" answers are proofs. For example, no 6 cars on a 16-hour clock form a difference set. They are proofs only about cyclic charts on a clock, though, and a chart of another kind can do better, as the 16-car chart on a 4 × 4 grid shows. For the perfect sizes the search finds nothing new: Singer's construction writes down the same difference sets with no search at all. The search earns its keep at the other sizes, where Singer's construction has nothing to offer and the best that can be done is "nearly fair".

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

| Real cars | Heats with byes | Lanes left empty | Cyclic chart heats | Cyclic chart: each pair meets |
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

The alternative is the chart [Lesson 26](../26-a-fair-race/) built: a cyclic chart with exactly $N$ cars on the track's own $k$ lanes. It works for any number of cars on any track. It takes exactly $N$ heats with every lane full in every heat, and every car still races once in each lane. Only the opponent counts give a little.

That trade is usually a good one. When an electronic timer scores each car by its own times, which opponents it raced matters much less than which lanes it raced in, and the cyclic chart gets the lanes exactly right. Byes pay off when the pack is just short of a perfect size. With 29 or 30 cars on a 6-lane track, the 31-car chart with byes costs only one or two extra heats. No cyclic chart of 29 or 30 cars on 6 lanes even comes close: some pairs meet twice while others never meet. Further below a perfect size, the empty lanes cost more than the fairness is worth.

Change the numbers in the menus of the widget at the top of this lesson: for every track up to 8 lanes and every <span class="no-gloss">field</span> up to 60 cars, it loads the fairest cyclic chart found by the search [described above](#how-the-search-works). Two things can happen.

**Fewer cars than $k^2 - k + 1$.** Meetings can't all be equal, but usually they can be nearly equal. With 4 lanes and 10 cars, each car has 12 meetings to share among 9 opponents, and the lineup $\{0, 1, 2, 5\}$ makes every two cars meet once or twice. Stan Pope and Cory Young call a chart like this, where every car races once in each lane and no two matchup counts differ by more than 1, a *Partial Perfect-N* chart. Pope reported that none was known for 5 lanes with 20 or 22 cars, or for 6 lanes with 16, 17, 29, 30, 32, 33, or 34 cars. The search here finds exactly the same gaps among cyclic charts, so for those cases no cyclic chart does better than meetings that differ by 2.

**More cars than $k^2 - k + 1$.** Some cars can't meet, and the fairest cyclic chart is one in which no two cars meet twice. That is a modular Golomb ruler from [Lesson 25](../25-a-ruler-with-no-repeats/): a lineup whose differences are all different. With 4 lanes and 20 cars, $\{0, 1, 3, 7\}$ does it, and each car meets 12 of its 19 opponents once each. To meet more of them, race a second round from a different lineup.

<section class="try-it">

## Try it

1. Eleven scouts race the 13-car, 4-lane chart of Lesson 26, with cars 11 and 12 as byes. How many heats are run, and what fraction of the lane places stand empty?
2. In the 10-car chart from the lineup $\{0, 1, 2, 5\}$ mod 10, how many times do cars 0 and 1 meet? Cars 0 and 3? Work it out from the differences of the lineup, then check by clicking car 0 in the widget.

<details>
<summary>Show the answer</summary>

1. No heat consists of byes alone (a heat has 4 cars and there are only 2 byes), so all 13 heats are run. Each bye sits in 4 heats, which makes 8 empty places out of $13 \times 4 = 52$: about 15%, the figure in the table. (The two byes share exactly one heat, so one heat has two empty lanes and six heats have one.)
2. Two cars $d$ apart meet once for each way of writing $d$ as a difference of two members of the lineup. The difference 1 occurs twice ($1 - 0$ and $2 - 1$), so cars 0 and 1 meet twice. The difference 3 occurs once ($5 - 2$), so cars 0 and 3 meet once.

</details>

</section>

Tally the differences of any lineup in the [difference set workbench](../../playgrounds/difference-workbench/?v=10&set=0,1,2,5): each bar is the number of times two cars that far apart meet.

## Sources

- S. Pope, "Mathematics of Perfect-N" and "Combinatorial Theory" (1997), and S. Pope and C. Young, "Young and Pope" Pinewood Racing Charts, the Partial Perfect-N chart generator (1998–2004), originally at stanpope.net; read here in the [archived copy of Pope's pages](https://github.com/josephgeis/stan-pope-ppn).
- J. Piazza, [DerbyNet](https://github.com/jeffpiazza/derbynet), race management software: the generator tables in `website/inc/generators/` and the heat reordering in `website/inc/schedule_ordered.inc`.
