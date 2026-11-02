---
title: "Rebuilding a disk"
order: 25
part: 7
summary: "Spread a disk array's stripes along the lines of the Fano plane, and every survivor shares the work of rebuilding a dead disk."
status: ready
---

**You'll learn:** how a disk array rebuilds a dead disk from parity, why the old way leaves a few disks doing all the work, and how laying the data out along the lines of the Fano plane makes every surviving disk do exactly the same small share.

## Parity: a spare copy that costs one chunk

Big storage systems keep data on many disks at once, and disks fail. A common way to survive a failure is **parity**. Cut the data into equal pieces called **chunks**, and group the chunks into **stripes**. Each stripe keeps its chunks on different disks, plus one extra chunk, the parity chunk, on yet another disk.

The parity chunk is built with **XOR** ("exclusive or"). Think of each chunk as a row of bits. In each bit position, the parity bit is 1 if an odd number of the data chunks have a 1 there, and 0 if an even number do:

$$
\begin{array}{lr}
\text{data chunk } A: & 1011\,0010 \\
\text{data chunk } B: & 0110\,0111 \\
\hline
\text{parity } P = A \oplus B: & 1101\,0101
\end{array}
$$

(The symbol $\oplus$ means XOR.) Now any one chunk of the stripe can be lost and rebuilt: XOR the chunks that are left. If $A$ is lost, $B \oplus P = 1011\,0010$, which is $A$ again. That works because XOR-ing the same bit in twice cancels it out, whichever chunk went missing.

A stripe made of data chunks plus one XOR parity chunk is the idea behind **RAID-5**, one of the "redundant arrays of inexpensive disks" named in a 1988 paper by David Patterson, Garth Gibson, and Randy Katz.

## The rebuild bottleneck

When a disk dies, every stripe that had a chunk on it has lost that chunk. To rebuild one lost chunk, the array reads every other chunk of its stripe, one from each of the stripe's other disks, and XORs them.

Disks work in parallel, and each disk can read only one chunk at a time. Call the time it takes to read one chunk a **read-time**. Then

> the rebuild takes as many read-times as the busiest surviving disk has chunks to read.

So it matters *which* disks the reads land on.

In a classic layout, the disks are split into separate groups as wide as a stripe, and each group keeps all of its stripes to itself. Take 7 disks and stripes of 3 chunks (2 data, 1 parity): disks 0, 1, 2 form one group, disks 3, 4, 5 another, and disk 6 is a spare. Each group holds 3 stripes, so each disk holds 3 chunks. If disk 0 dies, all 3 of its stripes live on disks 1 and 2, so disks 1 and 2 each read 3 chunks, while disks 3, 4, 5, and 6 read nothing. The rebuild takes 3 read-times, and the two disks that do the work are tied up for all of it, at the same time as they keep answering the users' own requests.

## Stripes along the lines of the Fano plane

Here is another way to lay out the same amount of data. Number the 7 disks 0 to 6 and use the difference set $D = \{0, 1, 3\}$ mod 7 from [Lesson 1](../01-differences-on-a-circle/). Stripe $j$ goes on the disks

$$
D + j = \{j,\ j + 1,\ j + 3\} \pmod 7,
$$

the translate from [Lesson 2](../02-rotations/), for $j = 0, 1, \dots, 6$. These seven stripes are the seven lines of the Fano plane ([Lesson 3](../03-fano-plane/)), with the disks as its points. Stripe 0 sits on disks 0, 1, 3; stripe 1 on disks 1, 2, 4; and so on round. Each disk is on 3 stripes, so it still holds 3 chunks, and each stripe still has 2 data chunks and 1 parity chunk.

Now let disk 0 die. Lesson 2 showed that any two translates of a planar difference set share exactly one member. Turned around, that says any two *points* lie together on exactly one translate: any two disks share exactly $\lambda = 1$ stripe (the Greek letter lambda, as in Lesson 2). This is the "always meet" property of [Lesson 22](../22-always-meet/), with disks in place of radios. So each of the 6 surviving disks shares exactly one stripe with disk 0, and reads exactly one chunk. The rebuild takes 1 read-time instead of 3.

The total work hasn't changed. Disk 0 lost 3 chunks, and each needs 2 reads, so there are $3 \times 2 = 6$ reads either way. The difference is that the Fano layout spreads them perfectly evenly over all 6 survivors, instead of piling them onto 2.

Click a disk below to fail it, or Tab to a disk and press Enter. The chunks are colored by stripe: S3 is a data chunk of stripe 3 and P3 is its parity. Chunks outlined in bold are the ones the rebuild has to read, and the bars count each survivor's reads. Then switch to **Classic RAID-5** and **Random**, which deals the same number of chunks onto the disks at random. In both of those, some survivors read nothing while others read 2 or more.

<div data-widget="raid-rebuild" data-v="7"></div>

## Larger arrays

Nothing here depended on 7. Any planar difference set from Singer's construction works the same way. For a prime power $q$ there are $v = q^2 + q + 1$ disks and stripes of $k = q + 1$ chunks; each disk is on $k$ stripes, and any two disks share exactly one stripe. When a disk fails, its $k$ lost chunks need $k - 1$ reads each, $k(k - 1) = q^2 + q = v - 1$ reads in all, and each of the $v - 1$ survivors does one of them.

| $q$ | Disks $v$ | Stripe width $k$ | Classic: busiest disk reads | Difference set: every disk reads |
|---:|---:|---:|---:|---:|
| 2 | 7 | 3 | 3 | 1 |
| 3 | 13 | 4 | 4 | 1 |
| 4 | 21 | 5 | 5 | 1 |

In the classic layout, the dead disk's group partners each read all $k$ of their chunks, so the rebuild takes $k$ read-times; the difference-set layout always takes 1. Try 13 and 21 disks in the menu above.

The same argument works for any $(v, k, \lambda)$ difference set, not just planar ones. Two translates of $D$ share exactly $\lambda$ members, so every survivor shares $\lambda$ stripes with the dead disk and reads $\lambda$ chunks. Whatever disk fails, the load is perfectly even.

## Who uses this

Spreading stripes over more disks than a stripe is wide is called **parity declustering**. Richard Muntz and John Lui analyzed it in 1990, and suggested that the layouts needed for even rebuild work, where every pair of disks shares the same number of stripes, could be found among the *balanced incomplete block designs* of combinatorics. (A projective plane is one of these, with each pair of points on exactly one line.) In 1992 Mark Holland and Garth Gibson built declustered layouts from block designs taken from published tables and showed by simulation that a declustered array slows down less for its users while it rebuilds than a classic RAID-5 array. They measured how much of each survivor is read with the *declustering ratio* $\alpha = (k - 1)/(v - 1)$: it is 1 for classic RAID-5, and $2/6 = 1/3$ for the Fano layout.

There is a price. In a classic array, a second failure in a *different* group loses nothing. In the Fano layout, any two disks share a stripe, so any second failure before the rebuild finishes loses that stripe's data. Rebuilding faster shortens that risky window, and real systems can add a second or third parity chunk to each stripe for more safety.

Declustering is now in shipping products. OpenZFS added **dRAID** in version 2.1 (2021). Its documentation says that when a disk is rebuilt onto a *distributed hot spare*, spare space on the other disks instead of one empty replacement disk, the rebuild's reads and writes "distribute evenly among all surviving drives", and the rebuild speed grows with the number of disks divided by the stripe width. dRAID allows up to 3 parity chunks per stripe, and it arranges its stripes with precomputed shuffles ("permutation maps"), not with a block design. A 2017 Western Digital patent describes layouts based on balanced incomplete block designs, so that "the reconstruction workload may be evenly distributed among all of the other storage devices"; its construction works on a square grid of devices, not on a difference set. I have not found a product that uses a difference-set or projective-plane layout itself. The Fano layout is the cleanest small example of the property these systems aim for.

<section class="try-it">

## Try it

1. Take 13 disks with stripes $D + j$ for $D = \{0, 1, 3, 9\}$ mod 13. Disk 5 fails. Which stripes lost a chunk? How many chunks does disk 6 read? Check with the widget.
2. The complement $\{2, 4, 5, 6\}$ of $\{0, 1, 3\}$ in the 7 numbers mod 7 is a $(7, 4, 2)$ difference set. With stripes $\{2, 4, 5, 6\} + j$ (3 data chunks and 1 parity chunk each), how many chunks does each survivor read when a disk fails? What do you gain and lose compared with the Fano layout?

<details>
<summary>Show the answer</summary>

1. Disk 5 is on stripe $j$ when $5 - j$ is in $D$, so $j = 5 - 0, 5 - 1, 5 - 3, 5 - 9 \equiv 5, 4, 2, 9 \pmod{13}$: stripes 2, 4, 5, and 9. Disk 6 shares exactly one of them, stripe 5 ($\{5, 6, 8, 1\}$), so it reads 1 chunk, like every other survivor. The rebuild reads $4 \times 3 = 12$ chunks in all, one from each of the 12 survivors.
2. Any two disks now share $\lambda = 2$ stripes, so each of the 6 survivors reads 2 chunks: the dead disk's 4 stripes need $4 \times 3 = 12$ reads, and $12 / 6 = 2$. The rebuild takes 2 read-times instead of 1, but only 1 chunk in 4 is parity instead of 1 in 3, so the same disks store more data.

</details>

</section>

In the [difference set workbench](../../playgrounds/difference-workbench/?v=13&set=0,1,3,9), the translates table shows every pair of stripes at once; read its rows as disks, and each entry off the diagonal is the number of chunks that disk reads when the other one fails.

## Sources

- D. A. Patterson, G. Gibson, and R. H. Katz, "A case for redundant arrays of inexpensive disks (RAID)," *ACM SIGMOD* 1988, pp. 109–116, [doi:10.1145/50202.50214](https://doi.org/10.1145/50202.50214).
- R. R. Muntz and J. C. S. Lui, "Performance analysis of disk arrays under failure," *16th International Conference on Very Large Data Bases (VLDB)*, 1990, pp. 162–173, [PDF](https://www.vldb.org/conf/1990/P162.PDF).
- M. Holland and G. A. Gibson, "Parity declustering for continuous operation in redundant disk arrays," *ASPLOS-V*, 1992, pp. 23–35, [doi:10.1145/143365.143383](https://doi.org/10.1145/143365.143383); [author PDF](https://www.cs.cmu.edu/~riedel/ftp/Declustering/ASPLOS.pdf).
- OpenZFS documentation, ["dRAID Howto"](https://openzfs.github.io/openzfs-docs/Basic%20Concepts/Pool%20Structure/dRAID%20Howto.html), and the [OpenZFS 2.1.0 release notes](https://github.com/openzfs/zfs/releases/tag/zfs-2.1.0) (July 2021).
- Z. Zhao and J. Xu, "Declustered array of storage devices with chunk groups and support for multiple erasure schemes," US patent [US9841908B1](https://patents.google.com/patent/US9841908B1/en), Western Digital Technologies, filed 2016, granted 2017.
