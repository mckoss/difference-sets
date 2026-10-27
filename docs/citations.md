<!-- Verified citation notes for Lessons 15–16, gathered 2026-10-27 from primary and secondary sources. -->

# Planar (cyclic) difference sets: fact-check and citations

Checked 2026-10-27 against primary sources, or against zbMATH, Crossref, OEIS and survey papers where the primary text was not reachable. Each claim is tagged **[primary]** when I read the original paper (full text or scanned pages), **[review]** when I checked it against a zbMATH review or a published abstract, and **[secondary]** when I only found it cited in a later paper.

Notation: order n, v = n² + n + 1, k = n + 1, λ = 1. For a prime power, q = p^e.

---

## Summary of verdicts

| # | Claim | Verdict |
|---|-------|---------|
| 1 | Singer 1938 | Correct |
| 2 | Hall 1947 multiplier theorem | Partly correct. The general p > λ form is Hall–Ryser 1951, not Hall 1947. |
| 3 | PPC computer bounds | Needs correction. The venue is Fields Inst. Commun. **41** (2004) 61–68. Gordon 1994 covers *all abelian* groups up to n ≤ 2·10⁶. The bound has since been raised to 2·10¹⁰ (Gordon 2022). |
| 4 | Partial results | Needs correction. The n ≡ 2 (mod 4) result is Wilbrink 1985, not Jungnickel–Vedder. The "exponent bounds" paper is by Arasu, Davis, Jedwab, **Ma**, McFarland and is not about planar sets. |
| 5 | "Every cyclic plane is Desarguesian"; Singer counts; OEIS A058241 | Needs correction and clarification (details below) |
| 6 | Order 9 has four planes; no non-Desarguesian cyclic plane known | Correct |
| 7 | Bruck–Ryser; BRC | Correct |
| 8 | Order 10, Lam–Thiel–Swiercz 1989 | Correct |
| 9 | Ostrom–Wagner 1959, plus related results | Correct. Related results added. |
| 10 | GMW smallest example v = 127, m = 7 | **Wrong.** The smallest is v = 63 (q = 2, N = 6). GMW sets never have planar parameters. |
| 11 | Turyn, field descent, multiplier conjecture | Correct. Citations below. |

---

## 1. Singer (1938) — **Correct**

**Statement.** Singer proved that PG(s−1, q) has a collineation of order (q^s − 1)/(q − 1) that permutes the points cyclically. For the plane (s = 3), this gives a (q²+q+1, q+1, 1) cyclic ("perfect") difference set for every prime power q. The paper also gives the general version with v = (q^{s}−1)/(q−1), i.e. q^{s−1} + … + q + 1. It also discusses how many perfect difference sets exist for a given modulus. **[review]**

Singer did **not** conjecture that the order must be a prime power. He wrote that it "seems to be true" that any two cyclic planar difference sets of the same order are equivalent (see §5).

**Citation.** J. Singer, "A theorem in finite projective geometry and some applications to number theory," *Trans. Amer. Math. Soc.* **43** (1938), no. 3, 377–385. DOI: 10.1090/S0002-9947-1938-1501951-4. MR1501951; Zbl 0019.00502; JFM 64.0972.04. https://www.ams.org/tran/1938-043-03/S0002-9947-1938-1501951-4/

---

## 2. Hall's multiplier theorem — **Partly correct; attribution needs correcting**

**Corrected statements.**
- **Hall 1947** (cyclic, λ = 1): if D is a cyclic planar difference set of order n, every prime divisor p of n is a multiplier. Since v = n²+n+1, gcd(p, v) = 1 holds automatically. In the form used later for planar abelian sets, every divisor t of n is a numerical multiplier (Gordon 1994, Thm 2). Gordon & Schmidt (2016) state: "Hall [5] proved that every prime divisor of the order of a difference set with λ = 1 is a multiplier." **[secondary: Gordon–Schmidt survey; Gordon 1994]**
- **First Multiplier Theorem** (general λ). Let D be a (v,k,λ) difference set of order n in an abelian group, and let p be a prime with p | n, p ∤ v and p > λ. Then p is a multiplier. Gordon & Schmidt credit this to **Hall and Ryser (1951)**, who generalized Hall 1947. That paper is cyclic in its title and setting. The abelian form is the textbook statement. **[secondary]**
- The **Second Multiplier Theorem** comes from Hall's 1956 survey as slightly generalized by **Menon (1960)**.
- In GMW 1962 (p. 625), "Hall's theorem" is used in the form: p | k−λ and p ∤ v imply that every power of p is a multiplier, under the p > λ hypothesis. **[primary]**

**Citations.**
- M. Hall, Jr., "Cyclic projective planes," *Duke Math. J.* **14** (1947), no. 4, 1079–1090. DOI: 10.1215/S0012-7094-47-01482-8. Zbl 0029.22502.
- M. Hall, Jr. and H. J. Ryser, "Cyclic incidence matrices," *Canad. J. Math.* **3** (1951), 495–502. DOI: 10.4153/CJM-1951-050-8. Zbl 0044.00501.
- M. Hall, Jr., "A survey of difference sets," *Proc. Amer. Math. Soc.* **7** (1956), no. 6, 975–986. DOI: 10.1090/S0002-9939-1956-0082502-7. (Some papers give 1957; Crossref gives 1956.)
- P. Kesava Menon, "Difference sets in Abelian groups," *Proc. Amer. Math. Soc.* **11** (1960), 368–376. DOI: 10.1090/S0002-9939-1960-0117169-3.
- D. M. Gordon and B. Schmidt, "A survey of the multiplier conjecture," *Des. Codes Cryptogr.* **78** (2016), no. 1, 221–236. DOI: 10.1007/s10623-015-0153-8. Zbl 1336.05020. Preprint: https://personal.ntu.edu.sg/bernhard/Publications/pub/Multiplier_Survey.pdf

---

## 3. Computer verification of the PPC — **Needs correction (venue, scope, newer bound)**

**Corrected statements.**
- **Evans & Mann (1951)** verified the cyclic case for n ≤ 1600.
- **Gordon (1994)** verified the PPC for n ≤ 2,000,000 for *abelian* groups, i.e. "for all groups" in Gordon 2022's wording, not only cyclic ones. The title says n < 2,000,000 and the abstract says n ≤ 2,000,000. **[primary]**
- **Baumert & Gordon (2004)**, abstract: "no cyclic projective planes exist with non-prime power orders ≤ 2·10⁹." This bound is for **cyclic groups only**. **[primary: arXiv text; review: Zbl 1065.05022]**
- **Newer bound: Gordon (2022)**: "the Prime Power Conjecture is true up to order 2·10¹⁰." The method handles all abelian groups at once. **[primary: arXiv text]**
- **Asymptotic result: Peluse (2021)** proved that the number of n ≤ N for which ℤ/(n²+n+1) contains a perfect difference set is (1+o(1)) N/log N. **[review]**

**Citations.**
- T. A. Evans and H. B. Mann, "On simple difference sets," *Sankhyā* **11** (1951), 357–364. (As cited by Gordon 1994. I found no DOI.)
- D. M. Gordon, "The prime power conjecture is true for n < 2,000,000," *Electron. J. Combin.* **1** (1994), #R6. DOI: 10.37236/1186. https://www.combinatorics.org/ojs/index.php/eljc/article/view/v1i1r6
- L. D. Baumert and D. M. Gordon, "On the existence of cyclic difference sets with small parameters," in A. van der Poorten and A. Stein (eds.), *High Primes and Misdemeanours: Lectures in Honour of the 60th Birthday of Hugh Cowie Williams*, Fields Institute Communications **41**, Amer. Math. Soc., 2004, pp. 61–68. DOI: 10.1090/fic/041/05. Zbl 1065.05022. arXiv: math/0304502.
- D. M. Gordon, "On difference sets with small λ," *J. Algebraic Combin.* **55** (2022), no. 1, 109–115. DOI: 10.1007/s10801-020-00992-x. Published online November 2020. Zbl 1484.05028. arXiv: 2007.07292.
- S. Peluse, "An asymptotic version of the prime power conjecture for perfect difference sets," *Math. Ann.* **380** (2021), no. 3–4, 1387–1425. DOI: 10.1007/s00208-021-02188-5. Zbl 1511.11006. arXiv: 2003.04929.

---

## 4. Proven partial results on the PPC (planar abelian D of order n) — **Needs correction**

The five most useful results, all for abelian groups, so they also hold for cyclic groups:

1. **Wilbrink (1985).** If p = 2 or p = 3 divides n exactly once, then n = p. In particular, n ≡ 2 (mod 4) forces n = 2, and 3 ∥ n forces n = 3 (so 3 | n implies n = 3 or 9 | n). **[review: Zbl 0554.05012]**
   H. A. Wilbrink, "A note on planar difference sets," *J. Combin. Theory Ser. A* **38** (1985), no. 1, 94–95. DOI: 10.1016/0097-3165(85)90028-7.
2. **Jungnickel & Vedder (1984).** If n is even and n > 4, then 8 | n. If n = m² is a square, there is a planar difference set of order m in a subgroup, corresponding to a Baer subplane. **[review: Zbl 0543.05010]**
   D. Jungnickel and K. Vedder, "On the geometry of planar difference sets," *European J. Combin.* **5** (1984), no. 2, 143–148. DOI: 10.1016/S0195-6698(84)80028-1.
   *Correction:* the "n ≡ 2 (mod 4) ⇒ n = 2" result is Wilbrink's. It also follows from Jungnickel–Vedder's even-order result.
3. **Ho (1992), bounds on the multiplier group M.**
   - If M is abelian, then |M| ≤ n+1 or n is a square.
   - If M is abelian and the group is cyclic, then |M| ≤ n+1 or n = 4.
   - If M contains an involution, then n is a square.

   **[review: Zbl 0777.05026]**
   C. Y. Ho, "On bounds for groups of multipliers of planar difference sets," *J. Algebra* **148** (1992), no. 2, 325–336. DOI: 10.1016/0021-8693(92)90197-T.
4. **Excluded divisors (Lander's exponent test plus Jungnickel–Pott).** n cannot be divisible by 6, 10, 14, 15, 21, 22, 26, 33, 34, 35, 38, 39, 46, 51, 55, 57, 58, 62 or 65. This is Corollary 1 of Gordon 1994, citing Jungnickel's survey. The underlying test is Lander's: if t₁−t₂ ≡ t₃−t₄ (mod exp G) for multipliers tᵢ, then exp G divides lcm(t₁−t₂, t₁−t₃). Hall proved the cyclic case. **[primary: Gordon 1994]**
   E. S. Lander, *Symmetric Designs: An Algebraic Approach*, LMS Lecture Note Ser. 74, Cambridge Univ. Press, 1983.
   D. Jungnickel, "Difference sets," in J. H. Dinitz and D. R. Stinson (eds.), *Contemporary Design Theory: A Collection of Surveys*, Wiley, 1992, pp. 241–324. Zbl 0768.05013.
5. **Peluse (2021).** The PPC holds asymptotically (§3).

**About "Arasu, Davis, Jedwab, Ling, McFarland, *Exponent bounds*":** the fourth author is **Siu Lun Ma**, not Ling. The paper concerns McFarland-type parameters (q³+2q², q²+q, q) and rules out (96,20,4) in two groups. It is **not** a PPC result, so leave it out of a planar-sets lesson. **[review: Zbl 0847.05015]**
K. T. Arasu, J. A. Davis, J. Jedwab, S. L. Ma, R. L. McFarland, "Exponent bounds for a family of abelian difference sets," in *Groups, Difference Sets, and the Monster* (Columbus, 1993), Ohio State Univ. Math. Res. Inst. Publ. 4, de Gruyter, 1996, pp. 129–143. DOI: 10.1515/9783110893106.129.

Also relevant: C. Y. Ho, "Some remarks on orders of projective planes, planar difference sets and multipliers," *Des. Codes Cryptogr.* **1** (1991), 69–75. DOI: 10.1007/BF00123960. It gives necessary conditions for cyclic planes of order n = p(p+2).

---

## 5. "Every cyclic projective plane is Desarguesian"; Singer counts; OEIS A058241 — **Needs correction and clarification**

### 5a. The conjecture

**Corrected statement.** Huang & Schmidt (2009) state it as *Conjecture 1: Every finite cyclic projective plane is desarguesian.* It is the conjunction of two statements:
- (i) every cyclic plane has prime-power order (the PPC, cyclic case);
- (ii) for each prime-power order, all cyclic planar difference sets are equivalent to the Singer set.

**[primary]**

**Who posed it.** Singer (1938) wrote that it "seems to be true" that any two cyclic planar difference sets of the same order are equivalent. Halberstam & Laxton (1964) record this as Singer's Conjecture I: "All p.d. sets mod p^{2n}+p^n+1 are of Singer type." **[primary]**

Huang & Schmidt note that Conjecture 1 "is sometimes attributed to Singer, though, as a matter of fact, Singer did not conjecture that the order of a cyclic projective plane must be a prime power." So for the lesson, say "Singer's conjecture" for (ii) and give the combined statement with the Huang–Schmidt caveat.

Proposition 5 of Huang & Schmidt: a cyclic planar difference set of prime-power order q that is not equivalent to a Singer set generates a non-Desarguesian plane. So (ii) really is equivalent to "every cyclic plane of order q is PG(2,q)". **[primary]**

**Status: open.**
- (i) is verified to n ≤ 2·10⁹ (cyclic) and 2·10¹⁰ (abelian); see §3.
- (ii) was verified by Hall (1956 survey) for orders 2, 3, 4, 5, 7, 8, 9, 11, 13, 16, 25, 27, 32.
- Bruck (1960) verified (ii) for orders 49, 64, 81.
- Huang & Schmidt verified (ii) for all n < 41 and for n ∈ {121, 125, 128, 169, 256, 1024}. In particular, ℤ_{1,049,601} contains a unique nontrivial difference set up to equivalence.
- Huang & Schmidt call the evidence for Conjecture 1 "quite flimsy". **[primary]**

**Citations.**
- Y. Huang and B. Schmidt, "Uniqueness of some cyclic projective planes," *Des. Codes Cryptogr.* **50** (2009), no. 2, 253–266. DOI: 10.1007/s10623-008-9229-z. Preprint: https://personal.ntu.edu.sg/bernhard/Publications/pub/Singer.pdf
- R. H. Bruck, "Quadratic extensions of cyclic planes," *Proc. Sympos. Appl. Math.* **10**, Amer. Math. Soc., 1960, pp. 15–44. Zbl 0096.15001.

### 5b. Counting Singer difference sets

**Facts with sources.**
- **Multiplier group.** GMW 1962, Theorem 5: for a nontrivial difference set coming from a finite geometry over GF(q), q = p^e, the multipliers are *precisely the powers of p mod v*. **[primary]** In ℤ_{q²+q+1}, p has order 3e because p^{3e} = q³ ≡ 1, so |M| = 3e.
- **Count up to translation.** Halberstam & Laxton call a set *reduced* if it contains 0 and 1. Every translation class contains exactly one reduced set, because the difference 1 occurs exactly once. Their Theorem 2 proves Singer's Conjecture II: "There exist exactly φ(q)/(3n) reduced Singer p.d. sets," where their q = p^{2n}+p^n+1 and their n is the exponent. In the lesson's notation (order q = p^e): **there are exactly φ(q²+q+1)/(3e) Singer difference sets in ℤ_{q²+q+1} up to translation.** Berman (1953) is also credited with this count. **[primary: scanned pages 177–178]**
- **Up to translation and negation: φ(q²+q+1)/(6e).** This is a derivation, not a quoted theorem. It rests on the fact that −1 is never a multiplier of a nontrivial difference set (GMW 1962 §10, "It is known that −1 is not a multiplier of a non-trivial difference set"; Johnsen 1964 for abelian groups). Therefore D and −D are never translates of each other, and each class under {translation, negation} has exactly two translation classes. The OEIS data in §5c match this formula exactly.
- **Terminology warning.** Under the *standard* equivalence (any group automorphism x ↦ tx plus translation), all Singer sets of a given order form **one** class. The numbers φ/(3e) and φ/(6e) count *distinct sets* up to translation, or up to translation and negation, not inequivalent sets. Write "distinct (reduced) Singer sets", not "inequivalent Singer sets".

**Citations.**
- H. Halberstam and R. R. Laxton, "Perfect difference sets," *Proc. Glasgow Math. Assoc.* (now *Glasgow Math. J.*) **6** (1964), no. 4, 177–184. DOI: 10.1017/S2040618500034985. Zbl 0144.00403.
- G. Berman, "Finite projective plane geometries and difference sets," *Trans. Amer. Math. Soc.* **74** (1953), 492–499. DOI: 10.1090/S0002-9947-1953-0054978-4.
- E. C. Johnsen, "The inverse multiplier for abelian group difference sets," *Canad. J. Math.* **16** (1964), 787–796. DOI: 10.4153/CJM-1964-076-5.
- B. Gordon, W. H. Mills, L. R. Welch: see §10.

### 5c. OEIS A058241

- **Exact name:** "Number of sets of n positive integers that can be placed along a circle such that the set of sums of adjacent integers forms { 1, 2, ..., n^2-n+1 }." Here "sums of adjacent integers" means sums of runs of consecutive entries; see the n = 3 example (1,4,2). These are Singer's "perfect partitions" (circular Golomb-ruler form).
- **Indexing:** the index is the set size k = n, so the order is n − 1 and v = n² − n + 1. Offset 1.
- **Data, n = 1..23:** 1, 1, 1, 2, 1, 5, 0, 6, 4, 6, 0, 18, 0, 20, 0, 0, 6, 51, 0, 42, 0, 0, 0. The sequence carries the keyword "more".
- **Formula:** only as a conjecture (Zhao Hui Du, Mar 18 2019): for n−1 = p^e, a(n) = φ(n²−n+1)/(6e), and a(n) = 0 otherwise. It is a conjecture because it assumes Singer's Conjecture I and the PPC. I checked that every listed term agrees with this formula. The 6e (rather than 3e) is consistent with arrangements counted up to rotation and reflection of the circle, i.e. difference sets up to translation and negation.
- **How it was computed:**
  - Original entry by Naohiro Nomoto (Jan 16 2001).
  - More terms by Rustem Aidagulov (Sep 2005, Jan 2006). The method is not documented.
  - a(21)–a(23) by Zhao Hui Du (Mar 2019). a(21) = 0 (order 20) by "brute-force enumeration". a(22) = a(23) = 0 (orders 21 and 22) from Bruck–Ryser.
  - Edited by Max Alekseyev (Jul 2019).
  - **The search reaches order 22 (v = 463).** The entry lists no program.
- URL: https://oeis.org/A058241

---

## 6. Order 9 and cyclic non-Desarguesian planes — **Correct**

**Statement.**
- Lam, Kolesova & Thiel (1991) showed by computer search that there are exactly **four** projective planes of order 9: the Desarguesian plane, the Hall plane, its dual, and the Hughes plane. **[secondary]** The zbMATH review text is withheld. The count and attribution are confirmed by later literature, including a 2024 SAT-based re-verification by Chittle & Bright (https://cs.uwaterloo.ca/~cbright/group/ben-report.pdf).
- Order 9 is the smallest order with a non-Desarguesian plane. I did not separately source the uniqueness of planes of orders ≤ 8; order 8 is usually credited to Hall, Swift & Walker, 1956.
- No non-Desarguesian cyclic plane is known. The zbMATH review of Ho 1998 says: "The only known cases are still those corresponding to the classical Singer groups." **[review]**

**Citation.** C. W. H. Lam, G. Kolesova and L. Thiel, "A computer search for finite projective planes of order 9," *Discrete Math.* **92** (1991), no. 1–3, 187–195. DOI: 10.1016/0012-365X(91)90280-F. Zbl 0749.05002.

---

## 7. Bruck–Ryser and Bruck–Ryser–Chowla — **Correct**

**Statements.**
- **Bruck–Ryser (1949).** If a projective plane of order n exists and n ≡ 1 or 2 (mod 4), then n is a sum of two integer squares. An equivalent form: no prime p ≡ 3 (mod 4) divides the squarefree part of n.
- Orders ruled out below 80: **6, 14, 21, 22, 30, 33, 38, 42, 46, 54, 57, 62, 66, 69, 70, 77, 78** (I computed this list). The theorem does **not** rule out 10, 12, 15, 18 or 20. Order 10 needed the Lam et al. computation; orders 12, 15, 18, 20 are open for general planes.
- **Bruck–Ryser–Chowla (Chowla–Ryser 1950)** for a symmetric (v,k,λ) design:
  - if v is even, then k − λ is a square;
  - if v is odd, then x² = (k−λ)y² + (−1)^{(v−1)/2} λ z² has a nontrivial integer solution.

  The case λ = 1 is Bruck–Ryser.
- Gordon 1994 (Thm 1) states the planar-difference-set form. **[primary]**

**Citations.**
- R. H. Bruck and H. J. Ryser, "The nonexistence of certain finite projective planes," *Canad. J. Math.* **1** (1949), 88–93. DOI: 10.4153/CJM-1949-009-2.
- S. Chowla and H. J. Ryser, "Combinatorial problems," *Canad. J. Math.* **2** (1950), 93–99. DOI: 10.4153/CJM-1950-009-8. Zbl 0037.00603.

---

## 8. Order 10 — **Correct**

**Citation.** C. W. H. Lam, L. Thiel and S. Swiercz, "The non-existence of finite projective planes of order 10," *Canad. J. Math.* **41** (1989), no. 6, 1117–1123. DOI: 10.4153/CJM-1989-049-4. Zbl 0691.51003.

The zbMATH review notes that the result rests on a computer search ("almost certainly such a plane does not exist") and that the paper discusses hardware and software error checks. The search is described in Lam, Thiel & Swiercz, "A computer search for a projective plane of order 10," LMS Lecture Note Ser. 131 (1988), 155–165, DOI 10.1017/CBO9780511758881.010, and in Lam's expository "The search for a finite projective plane of order 10," *Amer. Math. Monthly* **98** (1991), 305–318 (citation not separately verified).

---

## 9. Ostrom–Wagner and related "transitive ⇒ Desarguesian" results — **Correct; related results added**

- **Ostrom–Wagner (1959).** A finite projective plane admitting a collineation group that is doubly transitive on points is Desarguesian, and the group contains all elations. **[secondary: Kantor's flag-transitive-planes papers]**
  T. G. Ostrom and A. Wagner, "On projective and affine planes with transitive collineation groups," *Math. Z.* **71** (1959), 186–199. DOI: 10.1007/BF01181398. Zbl 0085.14302.
- **Ho (1998).** If a finite projective plane admits *more than one* abelian Singer group (an abelian group acting sharply transitively on points), the plane is Desarguesian. **[review: Zbl 0918.51012]**
  C. Y. Ho, "Finite projective planes with abelian transitive collineation groups," *J. Algebra* **208** (1998), no. 2, 533–550. DOI: 10.1006/jabr.1998.7514.
- **Ho & Pott (1990).** For a cyclic plane, the multiplier group equals the odd part of |Aut(S)| if and only if the order is 2, 3 or 8; this is the wording of the abstract. The zbMATH review says "2, 3, 4 or 8", so check the paper before quoting. The paper gives a new proof of a result of Feit, following Kantor.
  C. Y. Ho and A. Pott, "Multiplier groups of planar difference sets and a theorem of Kantor," *Proc. Amer. Math. Soc.* **109** (1990), no. 3, 803–808. DOI: 10.1090/S0002-9939-1990-1017847-7.
- **Kantor (1987).** Let G be a collineation group acting primitively on the points of a plane of order n. Then one of the following holds:
  - P is Desarguesian and G ⊇ PSL(3,n);
  - G is regular;
  - G is a Frobenius group of order dividing (n²+n+1)(n+1) or (n²+n+1)n, with n²+n+1 prime.

  Consequently, a flag-transitive plane is Desarguesian unless G is a Frobenius group of odd order (n²+n+1)(n+1) with n²+n+1 prime. **[review: Zbl 0606.20003]**
  W. M. Kantor, "Primitive permutation groups of odd degree, and an application to finite projective planes," *J. Algebra* **106** (1987), no. 1, 15–45. DOI: 10.1016/0021-8693(87)90019-6.

---

## 10. Gordon–Mills–Welch (1962) — **Needs correction (smallest example)**

**Corrected statement.** GMW Theorem 1: let q = p^e, n ≥ 3, and N = nm with m a product of r primes. Then there are **at least 2^r inequivalent** difference sets with
v = (q^N − 1)/(q − 1), k = (q^{N−1} − 1)/(q − 1), λ = (q^{N−2} − 1)/(q − 1).
These are the point–hyperplane (Singer) parameters of PG(N−1, q). **[primary]**

- **Smallest case: q = 2, N = 6, v = 63**, giving (63, 31, 15). GMW's introduction says Hall had found "two such sets with v = 63, k = 31, λ = 15", and that GMW "found a close connection between the two inequivalent (63, 31, 15) difference sets" and generalized it. **[primary]**
- **v = 127 (m = 7) is wrong.** 7 is prime, so N = 7 has no factorization N = nm with n ≥ 3 and m ≥ 2, and GMW gives nothing beyond Singer there. Other inequivalent (127,63,31) sets exist from other constructions, but they are not GMW sets.
- **Planar case:** planar parameters need N = 3, which is prime. **GMW sets never have planar parameters** and cannot give non-Desarguesian cyclic planes. Say this explicitly in the lesson.
- GMW Theorem 5 also determines multipliers: for Singer (geometry) sets and GMW sets, the multipliers are exactly the powers of p mod v (used in §5b).
- GMW Section 10 gives a larger example: q = 2, N = 10 yields at least 8 inequivalent (1023, 512, 256)-type sets. GMW state these parameters in complementary form.
- Kantor (2001) proved that inequivalent GMW difference sets give non-isomorphic designs.

**Citations.**
- B. Gordon, W. H. Mills and L. R. Welch, "Some new difference sets," *Canad. J. Math.* **14** (1962), 614–625. DOI: 10.4153/CJM-1962-052-2. Zbl 0111.24201.
- W. M. Kantor, "Note on GMW designs," *European J. Combin.* **22** (2001), 63–69. DOI: 10.1006/eujc.2000.0426.

---

## 11. Approaches to the PPC — **Correct; one-sentence descriptions**

- **Group-ring / character method.** A planar D in G corresponds to the group-ring identity D·D^{(−1)} = n + G in ℤ[G], equivalently |χ(D)|² = n for every nontrivial character χ. Nonexistence proofs study which cyclotomic integers of absolute value √n can occur (stated as Result 2 in Huang–Schmidt 2009).
- **Turyn's self-conjugacy.** If n is *self-conjugate* mod exp(G), meaning every prime ideal above n in ℚ(ζ_m) is fixed by complex conjugation, the cyclotomic integers of absolute value n^{t/2} can be determined completely. The character method then gives strong exponent and nonexistence bounds. **[review: zbMATH review of Schmidt 1999]**
  R. J. Turyn, "Character sums and difference sets," *Pacific J. Math.* **15** (1965), no. 1, 319–346. DOI: 10.2140/pjm.1965.15.319. Zbl 0135.05403.
- **Field descent (Schmidt).** Schmidt uses decomposition groups of prime ideals to show that a cyclotomic integer of prescribed absolute value lies, up to a root of unity, in a much smaller subfield. This removes the self-conjugacy hypothesis and gives general exponent bounds. **[review]**
  B. Schmidt, "Cyclotomic integers and finite geometry," *J. Amer. Math. Soc.* **12** (1999), no. 4, 929–952. DOI: 10.1090/S0894-0347-99-00298-2. Zbl 0939.05016.
  K. H. Leung and B. Schmidt, "The field descent method," *Des. Codes Cryptogr.* **36** (2005), no. 2, 171–188. DOI: 10.1007/s10623-004-1703-7.
- **Multiplier conjecture.** The conjecture is that every prime p | n with p ∤ v is a multiplier, without the hypothesis p > λ. It originated with Hall & Ryser (1951). For planar sets it is already a theorem (Hall 1947), so most planar nonexistence proofs instead exploit the multiplier group: McFarland–Rice fixed translates, Ho's bounds, Lander's exponent test, and Gordon 2022's extension of Arasu's argument. Leung, Ma & Schmidt (2014) gave the first major progress since McFarland (1970).
  Survey: Gordon & Schmidt 2016 (§2). K. H. Leung, S. L. Ma, B. Schmidt, "A multiplier theorem," *J. Combin. Theory Ser. A* **124** (2014), 228–243. DOI: 10.1016/j.jcta.2014.02.001. R. L. McFarland and B. F. Rice, "Translates and multipliers of abelian difference sets," *Proc. Amer. Math. Soc.* **68** (1978), 375–379.

---

## Items I could not verify directly
- The exact wording of Hall 1947's theorem. I found no full text; the attribution rests on Gordon–Schmidt 2016, Gordon 1994 and Huang–Schmidt 2009.
- The Lam–Kolesova–Thiel abstract. The zbMATH text is withheld; the result is confirmed by secondary sources.
- The Ostrom–Wagner theorem wording. I could not reach the Springer full text; the result is confirmed by Kantor's papers.
- Uniqueness of planes of order ≤ 8, and therefore "order 9 is the smallest non-Desarguesian order". This is standard, but I did not source it here.
- How the OEIS A058241 terms up to a(20) were computed. The entry does not say.
