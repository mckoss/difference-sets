<!-- Verified citation notes for Lesson 25 (difference sets in cryptography), gathered 2026-11-02. -->

# Difference sets in cryptography: fact-check and citations

Checked 2026-11-02 for Lesson 25, "Secrets that look like noise". Tags follow `docs/citations.md`: **[primary]** means I read the original text, its official abstract, or the standard itself; **[review]** means I checked it against publisher or Crossref metadata, zbMATH, or a published abstract; **[secondary]** means I only found it in a later source. Springer, ScienceDirect, DBLP and World Scientific blocked automated fetching, so most bibliographic data was confirmed through Crossref (`api.crossref.org/works/<DOI>`).

Mathematical claims about n = 4 (the (16, 6, 2) support of x1x2 ⊕ x3x4, Walsh values ±4, nonlinearity 6, 896 bent functions, bent ⇔ nontrivial XOR difference set, and the spread of best affine matches over all 65,536 functions) are also checked by brute force in `tests/unit/bent.test.ts`. The spread (best affine rule right on 10/11/12/13/14/15/16 inputs for 896/14336/28000/17920/3840/512/32 functions) was computed once with `src/math/bent.ts`.

---

## Summary of verdicts

| # | Claim | Verdict |
|---|-------|---------|
| 1 | Dillon 1974 thesis: bent ⇔ support is a difference set in (F₂ⁿ, ⊕) | Correct. Cite Dillon (and Carlet), not Rothaus. |
| 2 | Rothaus 1976 named bent functions | Correct. He is not shown to mention difference sets. |
| 3 | Matsui 1993, linear cryptanalysis of DES, 2^47 known plaintexts | Correct |
| 4 | Biham–Shamir differential cryptanalysis | Correct. The journal version is 1991. |
| 5 | Nyberg 1991, perfect nonlinear, needs n ≥ 2m | Correct. "PN Boolean = bent" is [secondary]. |
| 6 | CAST S-boxes built from bent functions | Correct for the CAST design procedure (patent, DCC 1997). **RFC 2144 never says "bent".** The claim "CAST-128 is in PGP" was dropped as not checked. |
| 7 | Çamtepe–Yener key rings | Correct |
| 8 | Berlekamp–Massey, 2L bits | Standard result. Checked only against a lecture note. |
| 9 | A5/1: three LFSRs of 19, 22, 23 bits, majority clocking | Correct |
| 10 | E0: four LFSRs plus a nonlinear combiner with memory | Correct. The individual lengths 25/31/33/39 are [secondary] and are not used in the lesson. |
| 11 | Ding 2015 covers authentication codes | **Wrong.** The book covers linear codes only. Dropped from the lesson. |
| 12 | 896 bent functions on 4 variables | Correct |

---

## 1. Dillon: bent functions are difference sets — **Correct**

- J. F. Dillon, *Elementary Hadamard Difference Sets*, PhD thesis, University of Maryland, 1974. Advisor J. C. Owings Jr.; ProQuest 7501799. doi:10.13016/M2MS3K194 (hdl.handle.net/1903/19629). The official abstract describes it as "primarily a study of difference sets in elementary abelian 2-groups", together with Fourier analysis of Boolean functions. It does not use the word "bent". **[primary: abstract]**
- The theorem "f is bent iff f⁻¹(1) is an elementary Hadamard difference set" is attributed to the thesis in arXiv:1406.1087 (Thm 6.2.10, p. 78). I did not check the page number. **[secondary]**
- J. F. Dillon, "Elementary Hadamard difference sets," *Proc. 6th Southeastern Conf. on Combinatorics, Graph Theory and Computing*, Congressus Numerantium XIV, Utilitas Math., 1975, 237–249. Listed in Carlet's bibliography and in OEIS A004491. **[review]**
- C. Carlet, "Boolean functions for cryptography and error correcting codes," in Crama & Hammer (eds.), *Boolean Models and Methods in Mathematics, Computer Science, and Engineering*, CUP 2010, 257–397, doi:10.1017/CBO9780511780448.011. **[review]** The 2006 preprint says: "f is bent if and only if the support of f is a difference set of the elementary Abelian 2-group F₂ⁿ", crediting Dillon. **[primary: preprint]** Carlet does not write out the parameters (2ⁿ, 2ⁿ⁻¹ ± 2^{n/2−1}, 2ⁿ⁻² ± 2^{n/2−1}). The lesson derives them from the support weight, and the arithmetic is checked by the unit test for n = 4.

## 2. Rothaus — **Correct as used**

- O. S. Rothaus, "On 'bent' functions," *J. Combin. Theory Ser. A* 20(3) (1976), 300–305, doi:10.1016/0097-3165(76)90024-8. **[review]** I could not fetch the full text.
- He introduced the name, showed that n must be even, and showed that all Walsh values are ±2^{n/2}. **[secondary, via Carlet]**
- The paper was written at IDA around 1966 and published in 1976 (IDA CRD Working Paper No. 169). **[secondary]** This is not used in the lesson.
- Wikipedia credits Rothaus with the difference-set equivalence. Carlet credits Dillon, and the lesson follows Carlet.

## 3. Matsui — **Correct**

- M. Matsui, "Linear cryptanalysis method for DES cipher," EUROCRYPT '93, LNCS 765 (1994), 386–397, doi:10.1007/3-540-48285-7_33. **[review]**
- The abstract gives 2^21 known plaintexts for 8-round DES and 2^47 for 16-round DES. **[primary: abstract]**
- The 1994 experiment that used 2^43 known plaintexts is Matsui, CRYPTO '94, LNCS 839, 1–11, doi:10.1007/3-540-48658-5_1. **[review]** It is not cited in the lesson.

## 4. Biham–Shamir — **Correct**

- E. Biham and A. Shamir, "Differential cryptanalysis of DES-like cryptosystems," *J. Cryptology* 4(1) (1991), 3–72, doi:10.1007/BF00630563. **[review]**
- The lesson says 1991, to match this journal version. A CRYPTO '90 version also exists.

## 5. Nyberg — **Correct**

- K. Nyberg, "Perfect nonlinear S-boxes," EUROCRYPT '91, LNCS 547, 378–386, doi:10.1007/3-540-46416-6_32. **[review]**
- The abstract defines perfect nonlinear as "derivatives evenly distributed". It says such S-boxes resist differential cryptanalysis and exist only when n ≥ 2m. **[primary: abstract]**
- "A perfect nonlinear Boolean function is the same as a bent function" is from Carlet. **[secondary]** The lesson also proves it directly from the count 2(k − λ_a).

## 6. CAST and bent functions — **Correct for the design procedure; softened**

- RFC 2144 (C. Adams, May 1997), https://www.rfc-editor.org/rfc/rfc2144. **The word "bent" does not appear.** It says only that the S-boxes have "a minimum nonlinearity of 74" and "a maximum entry of 2 in the difference distribution table". **[primary]**
- C. Adams, "Constructing symmetric ciphers using the CAST design procedure," *Des. Codes Cryptogr.* 12(3) (1997), 283–316, doi:10.1023/A:1008229029587. **[review]** I did not read the full text.
- US patent 5,825,886 (Adams): "Choose n distinct binary bent vectors φi of length 2m … Set the n vectors φi to be the columns of the matrix M representing the s-box." **[primary]**
- C. Adams and S. Tavares, "Designing S-boxes for ciphers resistant to differential cryptanalysis," Proc. 3rd Symposium on State and Progress of Research in Cryptography, Rome, 1993, 181–190. **[secondary, via US patent 5,511,123]**
- The lesson says the CAST *procedure* uses bent functions as S-box columns and that CAST-128 came out of that procedure. It does not say that the published CAST-128 tables are bent. I did not check "CAST-128 is used in PGP", so the lesson leaves it out.

## 7. Çamtepe & Yener — **Correct**

- ESORICS 2004, LNCS 3193, 293–308, doi:10.1007/978-3-540-30108-0_18. Journal version: *IEEE/ACM Trans. Networking* 15(2) (2007), 346–358, doi:10.1109/TNET.2007.892879. **[review]**
- Already cited in Lesson 22 and in `docs/applications.md`.

## 8. Berlekamp–Massey — **Standard; checked only against a secondary source**

- J. L. Massey, "Shift-register synthesis and BCH decoding," *IEEE Trans. Inf. Theory* 15(1) (1969), 122–127, doi:10.1109/TIT.1969.1054260. **[review]**
- "2L consecutive bits determine the shortest LFSR" is stated in a Mainz lecture note (Pommerening). **[secondary]** The Stanford scan of Massey's paper could not be read. The lesson says "2n consecutive output bits are enough".

## 9. A5/1 — **Correct**

- A. Biryukov, A. Shamir, D. Wagner, "Real time cryptanalysis of A5/1 on a PC," FSE 2000, doi:10.1007/3-540-44706-7_1. **[review]**
- The 1999 preprint says "three short linear feedback shift registers (LFSR) of lengths 19, 22, and 23 bits". It describes majority clocking: only the registers that agree with the majority of the clock bits step. **[primary: preprint]**

## 10. E0 — **Correct**

- Y. Lu, W. Meier, S. Vaudenay, "The conditional correlation attack: a practical attack on Bluetooth encryption," CRYPTO 2005, LNCS 3621, 97–117, doi:10.1007/11535218_7. The open PDF is EPFL Infoscience record 99425. It says: "four regularly-clocked LFSRs of a total 128 bits and a Finite State Machine (FSM) of 4 bits". **[primary]**
- The register lengths 25/31/33/39 come only from Wikipedia. **[secondary]** They are not used in the lesson.

## 11. Ding, *Codes from Difference Sets* — **Does not support authentication codes; dropped**

- C. Ding, *Codes from Difference Sets*, World Scientific, 2015 (Crossref gives 2014), xi + 341 pp., doi:10.1142/9283. **[review]**
- The table of contents covers linear codes, designs, difference sets and almost difference sets, and codebooks. It has nothing on authentication codes.
- A possible source for authentication codes from combinatorial designs is Ogata, Kurosawa, Stinson, Saido, *Discrete Math.* 279 (2004), 383–405, doi:10.1016/S0012-365X(03)00283-8. **[review]** I have not checked that it uses difference sets, so it is not cited.

## 12. Number of bent functions — **Correct**

- OEIS A004491, "Number of bent functions of 2n variables": 2, 8, 896, 5425430528, …. https://oeis.org/A004491 **[primary]**
- Also confirmed by exhaustive search in `tests/unit/bent.test.ts`.
