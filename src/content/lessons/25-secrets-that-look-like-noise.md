---
title: "Secrets that look like noise"
order: 25
part: 7
summary: "Bent functions: the rules a cipher can use that no straight-line guess can imitate, and why they are difference sets."
status: ready
---

**You'll learn:** why a cipher must avoid anything that a simple XOR rule can predict, what a bent function is, why bent functions are exactly difference sets in a group where "adding" means XOR, and why the shift registers from Lesson 20 are no good as secrets on their own.

## Keys that always meet

[Lesson 22](../22-always-meet/) already showed one use of difference sets in security. Give sensor $i$ the numbered secret keys $D + i$. When $D$ is a planar difference set, any two sensors share exactly one key, so every pair can talk privately while each sensor stores only about $\sqrt{v}$ keys. That idea uses the *overlap* property of difference sets directly. This lesson is about a less obvious one: difference sets as the hardest things to imitate.

## Bits and XOR

Computers store everything as **bits**, 0s and 1s, and ciphers spend most of their time mixing bits. The most important way to mix two bits is **XOR**, written $\oplus$ ("exclusive or"): $a \oplus b$ is 1 when exactly one of $a$ and $b$ is 1.

$$
0 \oplus 0 = 0, \qquad 0 \oplus 1 = 1, \qquad 1 \oplus 0 = 1, \qquad 1 \oplus 1 = 0.
$$

This is addition mod 2, the clock with two hours from [Lesson 1](../01-differences-on-a-circle/). To XOR two strings of bits, XOR them place by place: $0110 \oplus 0011 = 0101$. Notice that every string XORed with itself gives $0000$, so XOR undoes itself: $(x \oplus a) \oplus a = x$.

<aside class="notation">
<span class="notation-title">Notation</span>

- An **input** $x = x_1 x_2 x_3 x_4$ is a string of 4 bits, such as $0110$. There are $2^4 = 16$ of them.
- A **Boolean function** $f$ gives one output bit, $f(x)$, for each input. For example $f(x) = x_1 x_2 \oplus x_3 x_4$, where $x_1 x_2$ means "$x_1$ times $x_2$", which is 1 only when both are 1.
- A **linear rule** XORs some of the input bits together: $x_1 \oplus x_3$, or $x_2$, or $x_1 \oplus x_2 \oplus x_3 \oplus x_4$. There are 16 of them, one for each choice of which bits to use (including none, the rule that always says 0). Write $a \cdot x$ for the rule that uses the bits where $a$ has a 1: for $a = 1010$, $a \cdot x = x_1 \oplus x_3$.
- An **affine rule** is a linear rule, or a linear rule with its answer flipped: $a \cdot x \oplus 1$.

</aside>

## How a cipher can leak

A cipher scrambles a message using a secret **key**. Inside, it is built from small pieces, each a function of a few bits. If one of those pieces is close to a linear rule, say its output equals $x_1 \oplus x_3$ for 14 of its 16 inputs, then an attacker can pretend that piece *is* $x_1 \oplus x_3$ and be right most of the time. Linear rules are easy to chain together, so the attacker can write down a XOR of a few message bits, cipher bits, and key bits that holds noticeably more often than half the time. Collect enough messages and their scrambled versions, count how often the XOR comes out 0, and the bias gives away a bit of the key.

This is **linear cryptanalysis**, published by Mitsuru Matsui in 1993 against DES, then the U.S. standard cipher. His attack on the full cipher needed about $2^{47}$ (some 140 trillion) known message pairs: far too many for most attackers, but far fewer than trying every key. A designer's defense is to use pieces that are *far* from every linear rule. How far can a function on 4 bits get?

## Far from every rule

Below are the 16 inputs. Click an input to switch $f$ on or off there; the inputs where $f = 1$ form a set $D$. The list under the grid shows, for each of the 16 linear rules, how many of the 16 inputs it gets right. A rule that is right on 8 is no better than a coin toss; one right on 14 (or wrong on 14, since then its flip $a \cdot x \oplus 1$ is right on 14) is a gift to the attacker.

<div data-widget="bent-function" data-preset="x1x2+x3x4"></div>

The starting function, $x_1 x_2 \oplus x_3 x_4$, matches every linear rule on either 6 or 10 inputs. So every affine rule is wrong on at least 6 of the 16 inputs. Try to beat that: change any one input, and some affine rule is suddenly right on 11. Pick **x1 ⊕ x3** to see the opposite extreme, a function that *is* a linear rule. Press **Random** a few times: a random function usually has an affine rule that is right on 11, 12, or 13 inputs. (Of all 65,536 functions on 4 bits, about three in four have one right on 12 or more.)

Why can't any function do better than 6? Score $f$ against the rule $a \cdot x$ the way [Lesson 20](../20-finding-an-echo/) scored a code against a template: $+1$ for each input where they agree, $-1$ where they disagree. Call the score $W(a)$, so

$$
W(a) = (\text{agreements}) - (\text{disagreements}) = 2 \cdot (\text{agreements}) - 16.
$$

A fact called *Parseval's identity* says that, whatever $f$ is, the 16 squared scores always add up to the same total:

$$
W(0)^2 + W(1)^2 + \dots + W(15)^2 = 256.
$$

If any one score is small, some other score must be big. The biggest score is as small as it can be when all 16 scores have the same size: $16 \times 4^2 = 256$, so every $W(a) = \pm 4$, every rule is right on $(16 \pm 4)/2 = 10$ or $6$ inputs, and the closest affine rule is wrong 6 times. A function whose scores all have the same size is called **bent**, a name O. S. Rothaus gave them in a 1976 paper. For $n$ input bits the scores of a bent function are all $\pm 2^{n/2}$, which is a whole number only when $n$ is even, so bent functions exist only for an even number of bits.

## Bent functions are difference sets

Now look at the bar chart in the widget. For each nonzero string $a$ it shows how many members of $D$ are also in the shifted set

$$
D \oplus a = \{\, x \oplus a : x \text{ in } D \,\}.
$$

This is [Lesson 2](../02-rotations/)'s translate $D + t$, with clock addition replaced by XOR. For $x_1 x_2 \oplus x_3 x_4$, the set $D = \{0011, 0111, 1011, 1100, 1101, 1110\}$ has 6 members and every bar is exactly 2. Equivalently, every nonzero string occurs exactly twice as $x \oplus y$ for two members $x, y$ of $D$. So $D$ is a **difference set** with $v = 16$, $k = 6$, $\lambda = 2$, in the group of 4-bit strings under XOR. Since $x \oplus a = y$ exactly when $x \oplus y = a$, "difference" and "sum" are the same thing here: there is no minus sign to worry about.

This is no accident. J. F. Dillon showed in his 1974 thesis that

> $f$ is bent exactly when the set $D$ of inputs where $f = 1$ is a difference set in the group of $n$-bit strings under XOR.

The parameters are always

$$
v = 2^n, \qquad k = 2^{n-1} \pm 2^{n/2 - 1}, \qquad \lambda = 2^{n-2} \pm 2^{n/2 - 1},
$$

(with the same sign in both places), which are called **Hadamard** or **Menon** parameters. For $n = 4$ they are $(16, 6, 2)$ and $(16, 10, 6)$; the preset **x1x4 ⊕ x2x3 ⊕ 1** is a $(16, 10, 6)$ example. Of the $2^{16} = 65{,}536$ functions on 4 bits, exactly 896 are bent, and exactly those 896 have a flat bar chart (leaving out sets with 0, 1, 15, or 16 members, whose charts are flat for trivial reasons).

Here is why the two ideas match. Turn $f$ into a code of $\pm 1$s, $-1$ where $f = 1$, as in Lesson 20, and compare it with itself shifted by $a$ (XOR instead of a clock shift). Lesson 20's count works word for word and gives

$$
16 - 4(k - \lambda_a),
$$

where $\lambda_a$ is the height of bar $a$. When $D$ is a $(16, 6, 2)$ difference set, that is $16 - 4 \cdot 4 = 0$ for every nonzero shift: a perfectly flat floor at 0. A flat floor in the self-comparison and a flat set of scores against the linear rules turn out to be the same fact seen from two sides. (The scores $W(a)$ are the *Fourier* or *Walsh transform* of $f$, and a transform is flat exactly when the self-comparison is a single spike.) Bent functions are the XOR world's version of the m-sequences, whose floor was flat at $-1$.

## A second attack: following differences

Another attack, **differential cryptanalysis**, published by Eli Biham and Adi Shamir in 1991, flips some input bits and watches how the output changes. If changing the input by $a$ changes $f$'s output much more (or much less) often than half the time, the attacker has a handle.

For a Boolean function, the output changes, $f(x) \ne f(x \oplus a)$, exactly when $x$ is in one of $D$ and $D \oplus a$ but not the other. Lesson 20 counted those: there are $2(k - \lambda_a)$ such inputs. For a $(16, 6, 2)$ difference set that is $2 \cdot 4 = 8$, exactly half of the 16, for every $a$. Kaisa Nyberg called functions with this property **perfect nonlinear** in 1991, and for single-bit outputs they are exactly the bent functions. The difference-set property defends against both attacks at once.

Real ciphers need *S-boxes* (substitution boxes), pieces with several output bits. Nyberg showed that a perfect nonlinear S-box needs at least twice as many input bits as output bits, so it can never be undone, and most ciphers need pieces that can. So designers use bent functions as raw material and accept a little less than perfect. Carlisle Adams and Stafford Tavares's design procedure for the CAST ciphers chooses bent functions as the columns of each S-box's table; the cipher CAST-128, published as an internet standard in 1997, came out of that procedure.

## Patterns that only look random

The m-sequences from [Lesson 20](../20-finding-an-echo/) look random: equal numbers of 0s and 1s (almost), a flat correlation floor, no visible pattern. So why not use a shift register as a stream cipher, XORing its bits onto the message?

Because a shift register is linear, and linear things are easy to undo. Each new bit is a XOR of earlier bits, so a stretch of known output gives a set of XOR equations for the unknown register. The **Berlekamp–Massey algorithm** (J. L. Massey, 1969) solves them quickly: if the register has $n$ stages, $2n$ consecutive output bits are enough to find the register and its starting state, and from then on every future bit. The 10-stage register behind a GPS code makes 1023 bits before repeating, but 20 of them give the whole thing away.

So real stream ciphers mix several shift registers *nonlinearly*. The A5/1 cipher in GSM mobile phones runs three registers of 19, 22, and 23 bits and moves them irregularly by a majority vote; the E0 cipher in Bluetooth combines four registers through a small nonlinear machine with memory. Both have since been broken, which shows how hard it is to get the nonlinear part right.

<section class="try-it">

## Try it

1. For $f = x_1 x_2 \oplus x_3 x_4$, with $D = \{0011, 0111, 1011, 1100, 1101, 1110\}$, work out $D \oplus 0001$ and its overlap with $D$. Check with bar $0001$ in the widget.
2. On how many of the 16 inputs does the rule $x_1$ agree with $x_1 x_2 \oplus x_3 x_4$?
3. Use Lesson 20's count to explain why a $(16, 10, 6)$ difference set also gives a floor flat at 0.

<details>
<summary>Show the answer</summary>

1. XORing the last bit of each member gives $D \oplus 0001 = \{0010, 0110, 1010, 1101, 1100, 1111\}$. It shares $1100$ and $1101$ with $D$: an overlap of 2, as for every nonzero shift.
2. When $x_1 = 0$, $f = x_3 x_4$, which is 0 (agreeing with $x_1$) on 3 of the 4 choices of $x_3 x_4$, for each of the 2 choices of $x_2$: 6 agreements. When $x_1 = 1$, $f = x_2 \oplus x_3 x_4$, which is 1 on exactly 4 of the 8 inputs: 4 agreements. That is $6 + 4 = 10$ of 16, so the rule $x_1$ is wrong 6 times, and its flip $x_1 \oplus 1$ is right only 6 times.
3. $16 - 4(k - \lambda) = 16 - 4(10 - 6) = 0$. Its function is the flip of a bent function with 6 ones, and flipping $f$ just changes the sign of every $\pm 1$ entry, which leaves the self-comparison unchanged.

</details>

</section>

## Sources

- J. F. Dillon, *Elementary Hadamard Difference Sets*, PhD thesis, University of Maryland, 1974, [doi:10.13016/M2MS3K194](https://doi.org/10.13016/M2MS3K194); also "Elementary Hadamard difference sets," *Proc. 6th Southeastern Conference on Combinatorics, Graph Theory and Computing* (Congressus Numerantium XIV), 1975, 237–249.
- O. S. Rothaus, "On 'bent' functions," *Journal of Combinatorial Theory, Series A* 20 (1976), 300–305, [doi:10.1016/0097-3165(76)90024-8](https://doi.org/10.1016/0097-3165(76)90024-8).
- C. Carlet, "Boolean functions for cryptography and error correcting codes," in *Boolean Models and Methods in Mathematics, Computer Science, and Engineering*, Cambridge University Press, 2010, 257–397, [doi:10.1017/CBO9780511780448.011](https://doi.org/10.1017/CBO9780511780448.011): bent functions, their Walsh values, and the difference-set equivalence.
- The number of bent functions: OEIS [A004491](https://oeis.org/A004491) (896 on 4 bits).
- M. Matsui, "Linear cryptanalysis method for DES cipher," EUROCRYPT '93, LNCS 765 (1994), 386–397, [doi:10.1007/3-540-48285-7_33](https://doi.org/10.1007/3-540-48285-7_33).
- E. Biham and A. Shamir, "Differential cryptanalysis of DES-like cryptosystems," *Journal of Cryptology* 4 (1991), 3–72, [doi:10.1007/BF00630563](https://doi.org/10.1007/BF00630563).
- K. Nyberg, "Perfect nonlinear S-boxes," EUROCRYPT '91, LNCS 547 (1991), 378–386, [doi:10.1007/3-540-46416-6_32](https://doi.org/10.1007/3-540-46416-6_32).
- C. Adams, "Constructing symmetric ciphers using the CAST design procedure," *Designs, Codes and Cryptography* 12 (1997), 283–316, [doi:10.1023/A:1008229029587](https://doi.org/10.1023/A:1008229029587); the same procedure, with bent S-box columns, is in US patent [5,825,886](https://patents.google.com/patent/US5825886). CAST-128 is [RFC 2144](https://www.rfc-editor.org/rfc/rfc2144) (1997).
- J. L. Massey, "Shift-register synthesis and BCH decoding," *IEEE Transactions on Information Theory* 15 (1969), 122–127, [doi:10.1109/TIT.1969.1054260](https://doi.org/10.1109/TIT.1969.1054260).
- A. Biryukov, A. Shamir, and D. Wagner, "Real time cryptanalysis of A5/1 on a PC," FSE 2000, [doi:10.1007/3-540-44706-7_1](https://doi.org/10.1007/3-540-44706-7_1): A5/1's three registers of 19, 22, and 23 bits.
- Y. Lu, W. Meier, and S. Vaudenay, "The conditional correlation attack: a practical attack on Bluetooth encryption," CRYPTO 2005, [doi:10.1007/11535218_7](https://doi.org/10.1007/11535218_7): E0's four registers and 4-bit state machine.
- S. A. Çamtepe and B. Yener, "Combinatorial design of key distribution mechanisms for wireless sensor networks," *IEEE/ACM Transactions on Networking* 15(2), 2007, [doi:10.1109/TNET.2007.892879](https://doi.org/10.1109/TNET.2007.892879).
