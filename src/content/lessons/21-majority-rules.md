---
title: "Majority rules"
order: 21
part: 7
summary: "An error-correcting code that fixes bits by a simple vote, broadcast to car radios."
status: ready
---

**You'll learn:** how the lines of a projective plane become checks on a message, why the checks through one bit can hold a fair vote on it, and where this code has run for decades: in the traffic data sent to car navigation radios in Japan.

## A word on a circle

Digital messages are strings of **bits**: each bit is a 0 or a 1. Radio static can flip a bit, turning a 0 into a 1 or back. An **error-correcting code** adds extra bits so the receiver can find and undo a few flips.

Here is a word of 21 bits, one at each point of the plane of order 4 from [Lesson 4](../04-projective-planes/). Blue bits are 1s. The orange ring marks a bit, and the shapes drawn through it are the 5 lines of the plane that pass through it. Click any bit to flip it, as static would.

<div data-widget="majority-decoder" data-q="4"></div>

Flip one bit and watch: all 5 shapes through it turn red and dashed. Flip it back and they all turn green again. The rest of this lesson explains what the shapes are checking and why that is enough to repair the word.

## Checks that count to two

<aside class="notation">
<span class="notation-title">Notation: parity</span>

The **parity** of some bits is their sum mod 2 (the clock with $v = 2$ from [Lesson 1](../01-differences-on-a-circle/)): it is 0 when the bits hold an even number of 1s and 1 when they hold an odd number. Adding mod 2 is also called **XOR**, "exclusive or". Flipping any one of the bits changes the parity.

A **parity check** is a set of positions. A word **passes** the check when the bits at those positions have parity 0, and **fails** it otherwise.

</aside>

The checks of this code are the lines of the plane. The positions are the residues $0, 1, \dots, 20$ mod 21, and as in Lessons 2 and 4 the lines are the 21 translates $D + t$ of the planar difference set

$$
D = \{0, 1, 4, 14, 16\} \pmod{21}.
$$

A **codeword** is a word that passes all 21 checks: every line holds an even number of 1s. The sender only ever sends codewords. So if the receiver sees a check fail, it knows some bit inside that line was flipped on the way.

How many codewords are there? Solving the 21 parity equations, which a computer does in an instant, shows that only 10 of them are independent: the other 11 follow from those 10. That leaves 11 bits free. The sender chooses those 11 bits to carry the message, and the equations fix the other 10. So this code carries 11 message bits in every 21 it sends. (Coding books call the message size $k$, but on this site $k$ always means the size of $D$, so we just say "message bits".) For comparison, the simplest code of all, sending each bit three times and taking the majority, carries only 7 message bits in 21 and can fix only one flip in each group of three.

## A fair vote

Pick a bit, say bit $j$. By Lesson 4, every point of a plane of order $n$ lies on $n + 1$ lines, so bit $j$ sits in $n + 1 = 5$ checks. These five checks have a special property: **besides bit $j$, they share no bits at all**. Two different lines meet in exactly one point (axiom 2), and these five already meet at $j$. In the widget you can see it: the five shapes touch only at the ringed bit.

Now suppose a few bits were flipped, and count how many of bit $j$'s checks fail.

- **If bit $j$ was flipped,** each of its 5 checks would fail, unless one of the other flipped bits is in the same check and cancels it. Any other bit shares exactly one line with $j$ (two points lie on exactly one line: axiom 1), so each other flipped bit can rescue at most one of $j$'s checks.
- **If bit $j$ is fine,** a check through $j$ can fail only if it contains some flipped bit, and again each flipped bit lies in just one of $j$'s checks.

With two flipped bits in total: if $j$ is one of them, at least $5 - 1 = 4$ of its checks fail; if $j$ is not, at most 2 fail. So the rule

> **Majority vote:** flip bit $j$ when more than half of its checks fail

always makes the right call, for every bit at once. In general, a plane of order $n$ gives $n + 1$ checks per bit, and the vote fixes any pattern of up to half of $n + 1$ flips, rounded down. For order 4 that is 2.

Try it above: flip two bits anywhere, press **Vote and fix**, and the word comes back. Use the slider to look at any bit and see its five checks vote.

## When the vote fails

Three flips is one too many. Below, bits 1, 3, and 17 have been flipped. Each lies on a different line through bit 0, so three of bit 0's five checks fail even though bit 0 is fine. Press **Vote and fix** and see what goes wrong.

<div data-widget="majority-decoder" data-q="4" data-errors="1,3,17"></div>

The vote flips bit 0 and many others, and makes the word worse. A code can only promise to fix up to a certain number of errors; beyond that, the receiver needs to resend or give up. A bigger plane gives every bit more checks, so it can outvote more errors.

## On the radio

These **difference-set cyclic codes** were described by E. J. Weldon Jr. at Bell Labs in 1966. His paper reports them to be about as powerful as the BCH codes, a leading family of codes at the time, and much simpler to build. *Cyclic* means that turning a codeword around the circle gives another codeword, because turning carries each line $D + t$ to the line $D + (t + 1)$. So a receiver can check every bit with the same small circuit, as the bits slide past it, and the vote needs no algebra at all: just counting.

The order used in practice is $n = 16$. Then the circle has $16^2 + 16 + 1 = 273$ bits, every bit has 17 checks, and the vote fixes up to 8 flips. For orders $n = 2^s$ the standard count of independent checks is $3^s + 1$, here $3^4 + 1 = 82$, which leaves 191 message bits. (The unit tests for this site recompute the 82, along with the 10 for order 4.) This is the **(273, 191) code**.

- **Japanese teletext.** NHK patents from 1983 and 1984 describe the (273, 191) code shortened by one bit to fit 272-bit packets, 190 data bits and 82 check bits, decoded by a majority circuit over 17 check sums.
- **FM data radio and car navigation.** The ITU standard for the DARC system, which hides a 16 kilobit per second data channel inside ordinary FM broadcasts, specifies the same shortened (272, 190) code and calls it "a shortened majority logic decodable difference set cyclic code". Japan's VICS service began sending road traffic information to car navigation units this way in 1996, starting in the Tokyo area, and covered the whole country by 2003.

<section class="try-it">

## Try it

Use the smallest plane: 7 bits, with the lines being the translates of $\{0, 1, 3\}$ mod 7 (switch the widget's menu to **Order 2** to check). The codeword sent was all 0s, and bit 2 was flipped on the way.

1. Which three checks pass through bit 2, and how many of them fail?
2. Which checks pass through bit 0, and how many of them fail? What does the vote do with bit 0?

<details>
<summary>Show the answer</summary>

1. Bit 2 is on $D + t$ when $2 - t$ is in $D$, so $t = 2, 1, 6$: the lines $\{2, 3, 5\}$, $\{1, 2, 4\}$, and $\{6, 0, 2\}$. Each holds a single 1 (bit 2), so all three fail, and the vote flips bit 2.
2. Bit 0 is on $D + 0 = \{0, 1, 3\}$, $D + 6 = \{6, 0, 2\}$, and $D + 4 = \{4, 5, 0\}$. Only $\{6, 0, 2\}$ contains the flipped bit, so 1 of 3 fails. That is not more than half, so bit 0 stays 0. Every other bit is in the same position, so the vote repairs exactly bit 2.

</details>

</section>

The checks are just the translates of a difference set, so you can draw them yourself: open the [difference set workbench with $\{0, 1, 4, 14, 16\}$ mod 21](../../playgrounds/difference-workbench/?v=21&set=0,1,4,14,16) and turn the translates to see the lines through any point.

## Sources

- E. J. Weldon Jr., "Difference-set cyclic codes," *Bell System Technical Journal* 45 (1966), 1045–1055. [doi:10.1002/j.1538-7305.1966.tb01686.x](https://doi.org/10.1002/j.1538-7305.1966.tb01686.x)
- ITU-R Recommendation BS.1194-2 (1998), System A (DARC), §2.5: the (272, 190) code. [PDF](https://www.itu.int/dms_pubrec/itu-r/rec/bs/R-REC-BS.1194-2-199812-I!!PDF-E.pdf)
- O. Yamada (NHK), US patent 4,630,271, "Error correction method and apparatus for data broadcasting system." [Google Patents](https://patents.google.com/patent/US4630271A/en)
- H. Shishikura et al. (NHK and Oki Electric), US patent 4,675,868, "Error correction system for difference set cyclic code in a teletext system." [Google Patents](https://patents.google.com/patent/US4675868A/en)
- VICS Center, [history of the service](https://www.vics.or.jp/en/center/history/).
- Error Correction Zoo, [difference-set cyclic code](https://errorcorrectionzoo.org/c/difference_set).
