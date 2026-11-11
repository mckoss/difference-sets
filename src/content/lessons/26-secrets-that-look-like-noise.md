---
title: "Secrets that look like noise"
order: 26
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

<details>
<summary>Why the total is always 256</summary>

Write $F(x) = +1$ where $f(x) = 0$ and $F(x) = -1$ where $f(x) = 1$, and write $L_a(x) = \pm 1$ in the same way for the rule $a \cdot x$. Then $W(a)$ is the sum of $F(x) L_a(x)$ over the 16 inputs. A linear rule turns XOR of inputs into XOR of answers, so $L_a(x) L_a(y) = L_a(x \oplus y)$, and $W(a)^2$ is the sum of $F(x) F(y) L_a(x \oplus y)$ over all $16 \times 16$ pairs $x, y$.

Now add that over all 16 rules $a$. A pair with $x = y$ contributes $F(x)^2 L_a(0) = 1$ for every rule: 16 in all. A pair with $x \ne y$ has $z = x \oplus y$ nonzero, and exactly 8 of the 16 linear rules answer 1 on $z$. (Pick a bit where $z$ is 1; switching that bit of $a$ flips the answer $a \cdot z$, so the rules pair off, one saying 0 and one saying 1.) Eight $+1$s and eight $-1$s cancel, so the pair contributes nothing. That leaves the 16 pairs with $x = y$, and $16 \times 16 = 256$.

</details>

If any one score is small, some other score must be big. The 16 squares add up to 256, so they average $256 / 16 = 16$, and the largest is at least 16: some score has size at least 4. The biggest score is as small as it can be when all 16 scores have the same size: $16 \times 4^2 = 256$, so every $W(a) = \pm 4$, every rule is right on $(16 \pm 4)/2 = 10$ or $6$ inputs, and the closest affine rule is wrong 6 times. A function whose scores all have the same size is called **bent**, a name O. S. Rothaus gave them in a 1976 paper. For $n$ input bits the scores of a bent function are all $\pm 2^{n/2}$, which is a whole number only when $n$ is even, so bent functions exist only for an even number of bits.

## Bent functions are difference sets

Now look at the bar chart in the widget. For each nonzero string $a$ it shows how many members of $D$ are also in the shifted set

$$
D \oplus a = \{\, x \oplus a : x \text{ in } D \,\}.
$$

This is [Lesson 2](../02-rotations/)'s translate $D + t$, with clock addition replaced by XOR. For $x_1 x_2 \oplus x_3 x_4$, the set $D = \{0011, 0111, 1011, 1100, 1101, 1110\}$ has 6 members and every bar is exactly 2. Equivalently, every nonzero string occurs exactly twice as $x \oplus y$ for two members $x, y$ of $D$. So $D$ is a **difference set** with $v = 16$, $k = 6$, $\lambda = 2$, in the group of 4-bit strings under XOR. (A *group* here just means a set of things with an "addition" that can be undone: the hours of a clock with $+$, or the 4-bit strings with $\oplus$. The definition in [Lesson 1](../01-differences-on-a-circle/) carries over with $\oplus$ in place of $-$.) Since $x \oplus a = y$ exactly when $x \oplus y = a$, "difference" and "sum" are the same thing here: there is no minus sign to worry about.

This is no accident. J. F. Dillon showed in his 1974 thesis that

> $f$ is bent exactly when the set $D$ of inputs where $f = 1$ is a difference set in the group of $n$-bit strings under XOR.

The parameters are always

$$
v = 2^n, \qquad k = 2^{n-1} \pm 2^{n/2 - 1}, \qquad \lambda = 2^{n-2} \pm 2^{n/2 - 1},
$$

(with the same sign in both places), which are called **Hadamard** or **Menon** parameters. For $n = 4$ they are $(16, 6, 2)$ and $(16, 10, 6)$; the preset **x1x4 ⊕ x2x3 ⊕ 1** is a $(16, 10, 6)$ example. Of the $2^{16} = 65{,}536$ functions on 4 bits, exactly 896 are bent, and exactly those 896 have a flat bar chart (leaving out sets with 0, 1, 15, or 16 members, whose charts are flat for trivial reasons).

Here is why the two ideas match. Turn $f$ into a code of $\pm 1$s, $-1$ where $f = 1$, and compare it with itself shifted by $a$ (XOR instead of a clock shift): $+1$ for each input where the two copies agree, $-1$ where they disagree. The copies disagree exactly at the inputs that are in one of $D$ and $D \oplus a$ but not both. If bar $a$ has height $\lambda_a$, then $D$ has $k - \lambda_a$ members outside $D \oplus a$, and $D \oplus a$ has $k - \lambda_a$ members outside $D$: $2(k - \lambda_a)$ disagreements, $16 - 2(k - \lambda_a)$ agreements, and a score of

$$
16 - 2(k - \lambda_a) - 2(k - \lambda_a) = 16 - 4(k - \lambda_a).
$$

([Lesson 20](../20-finding-an-echo/) makes the same count for codes on a clock.) When $D$ is a $(16, 6, 2)$ difference set, that is $16 - 4 \cdot 4 = 0$ for every nonzero shift: a perfectly flat floor at 0.

A flat floor in the self-comparison and a flat set of scores against the linear rules are the same fact seen from two sides. Here is the mechanism. Take the 16 numbers $W(b)^2$ as a list indexed by $b$, and score that list against the linear rule $a \cdot b$ in the usual way: add $W(b)^2$ where $a \cdot b = 0$ and subtract it where $a \cdot b = 1$. That total, divided by 16, is exactly the self-comparison score at shift $a$. A list of 16 equal numbers scores 0 against every nonzero rule (8 added, 8 subtracted), so flat scores give a flat floor; and the same step run the other way turns a flat floor back into flat scores. Dillon's thesis has the full proof. (The scores $W(a)$ are the *Fourier* or *Walsh transform* of $f$, and a transform is flat exactly when the self-comparison is a single spike.) Bent functions are the XOR world's version of the m-sequences, the shift-register codes of Lesson 20, whose floor was flat at $-1$.

## A second attack: following differences

Another attack, **differential cryptanalysis**, published by Eli Biham and Adi Shamir in 1991, flips some input bits and watches how the output changes. If changing the input by $a$ changes $f$'s output much more (or much less) often than half the time, the attacker has a handle.

For a Boolean function, the output changes, $f(x) \ne f(x \oplus a)$, exactly when $x$ is in one of $D$ and $D \oplus a$ but not the other. We counted those above: there are $2(k - \lambda_a)$ such inputs. For a $(16, 6, 2)$ difference set that is $2 \cdot 4 = 8$, exactly half of the 16, for every $a$. Kaisa Nyberg called functions with this property **perfect nonlinear** in 1991, and for single-bit outputs they are exactly the bent functions. The difference-set property defends against both attacks at once.

Real ciphers need *S-boxes* (substitution boxes), pieces with several output bits. Nyberg showed that a perfect nonlinear S-box needs at least twice as many input bits as output bits, so it can never be undone, and most ciphers need pieces that can. So designers use bent functions as raw material and accept a little less than perfect. Carlisle Adams and Stafford Tavares's design procedure for the CAST ciphers chooses bent functions as the columns of each S-box's table; the cipher CAST-128, published as an internet standard in 1997, came out of that procedure.

## Patterns that only look random

The m-sequences from [Lesson 20](../20-finding-an-echo/) look random: equal numbers of 0s and 1s (almost), a flat correlation floor, no visible pattern. So why not use a shift register as a stream cipher, XORing its bits onto the message?

Because a shift register is linear, and linear things are easy to undo. Each new bit is a XOR of earlier bits, so a stretch of known output gives a set of XOR equations for the unknown register. The **Berlekamp–Massey algorithm** (J. L. Massey, 1969) solves them quickly: if the register has $n$ stages, $2n$ consecutive output bits are enough to find the register and its starting state, and from then on every future bit. The 10-stage register behind a GPS code makes 1023 bits before repeating, but 20 of them give the whole thing away.

So real stream ciphers mix several shift registers *nonlinearly*. The A5/1 cipher in GSM mobile phones runs three registers of 19, 22, and 23 bits and moves them irregularly by a majority vote; the E0 cipher in Bluetooth combines four registers through a small nonlinear machine with memory. Both have since been broken, which shows how hard it is to get the nonlinear part right.

<section class="try-it">

## Try it

1. For $f = x_1 x_2 \oplus x_3 x_4$, with $D = \{0011, 0111, 1011, 1100, 1101, 1110\}$, work out $D \oplus 0001$ and its overlap with $D$. Check with bar $0001$ in the widget.
2. On how many of the 16 inputs does the rule $x_1$ agree with $x_1 x_2 \oplus x_3 x_4$?
3. Use the count of agreements and disagreements above to explain why a $(16, 10, 6)$ difference set also gives a floor flat at 0.

<details>
<summary>Show the answer</summary>

1. XORing the last bit of each member gives $D \oplus 0001 = \{0010, 0110, 1010, 1101, 1100, 1111\}$. It shares $1100$ and $1101$ with $D$: an overlap of 2, as for every nonzero shift.
2. When $x_1 = 0$, $f = x_3 x_4$, which is 0 (agreeing with $x_1$) on 3 of the 4 choices of $x_3 x_4$, for each of the 2 choices of $x_2$: 6 agreements. When $x_1 = 1$, $f = x_2 \oplus x_3 x_4$, which is 1 on exactly 4 of the 8 inputs: 4 agreements. That is $6 + 4 = 10$ of 16, so the rule $x_1$ is wrong 6 times, and its flip $x_1 \oplus 1$ is right only 6 times.
3. $16 - 4(k - \lambda) = 16 - 4(10 - 6) = 0$. Its function is the flip of a bent function with 6 ones, and flipping $f$ just changes the sign of every $\pm 1$ entry, which leaves the self-comparison unchanged.

</details>

</section>

## The end of the path

This is the last lesson, so look back at how far one small fact has gone. [Lesson 2](../02-rotations/) showed that two turned copies of a difference set always overlap in the same number of points. That fact turned a counting puzzle into geometry, the geometry into arithmetic in a finite field, and the arithmetic into a recipe that writes the sets down at any size. Then the same fact dealt cards, unscrambled a telescope's shadows, found echoes, corrected errors, woke radios, scheduled races, rebuilt disks, and here measured how well a cipher's parts hide what they do.

If you came to the applications first, the path to Singer's recipe starts at [Lesson 1](../01-differences-on-a-circle/), and [Lesson 14](../14-writing-down-a-difference-set/) has the whole argument on one page. If you have read it all, [Lesson 17](../17-every-planar-set-singer/) lists experiments and books for going further.

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
