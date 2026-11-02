<!-- Verified citation notes for Lesson 25 (declustered RAID), gathered 2026-11-02. -->

# Lesson 25, "Rebuilding a disk": fact-check and citations

Checked 2026-11-02. Each claim is tagged **[primary]** when I read the original text (full paper, patent, or official documentation), **[review]** when I checked it only against a bibliographic record (Crossref, DBLP) or a published abstract, and **[secondary]** when I only found it reported in a later work. **[inference]** marks a statement I derived myself and did not find stated in a source.

---

## Summary of verdicts

| # | Claim in the lesson | Verdict |
|---|---------------------|---------|
| 1 | RAID-5 (data plus XOR parity, parity spread over all disks) comes from Patterson, Gibson, and Katz 1988 | Correct **[primary]** |
| 2 | Muntz and Lui (VLDB 1990) introduced declustering and suggested BIBDs for even rebuild load | Correct, but the content is **[secondary]** (via Holland and Gibson); bibliographic data **[review]** |
| 3 | Holland and Gibson (ASPLOS 1992) built layouts from block designs; declustered parity hurts users less during repair than RAID-5; declustering ratio α = (G − 1)/(C − 1), α = 1 for RAID-5; any two failures lose data | Correct **[primary]** |
| 4 | OpenZFS dRAID shipped in 2.1 (2021); permutation maps, not block designs; rebuild I/O spread evenly; speed scales with disks / stripe width; parity 1–3 | Correct **[primary]** |
| 5 | Western Digital patent US9841908B1 uses a BIBD so that rebuild work is evenly distributed; no difference set | Correct **[primary]** |
| 6 | No product known to use a difference-set or projective-plane layout | Not found in any source checked (absence claim; worded as "I have not found") |
| 7 | Fano layout: every survivor reads exactly 1 chunk; (v, k, λ) layout: every survivor reads λ | **[inference]**, also checked by unit tests (`tests/unit/raid.test.ts`) |

---

## 1. Patterson, Gibson, and Katz (1988) — **Correct**

**Claims checked.** The abstract says the paper "introduces five levels of RAIDs". Section 11, "Fifth Level RAID: No Single Check Disk": "The final level RAID distributes the data and check information across all the disks--including the check disks." Section 10 (level 4): "each parity bit is just a single exclusive OR of all the corresponding data bits in a group" (the OCR text reads "data birs i:i a group"; corrected here). Section 9 describes rebuilding a failed disk from the parity of the remaining disks. **[primary]** (text extracted from the MIT 6.033 course copy of the SIGMOD paper.)

**Citation.** D. A. Patterson, G. Gibson, R. H. Katz, "A case for redundant arrays of inexpensive disks (RAID)," *Proc. ACM SIGMOD* 1988, pp. 109–116. DOI 10.1145/50202.50214 (Crossref: title, authors, pages confirmed). Also UC Berkeley tech report UCB/CSD-87-391, Dec. 1987. Copy read: https://web.mit.edu/6.033/2015/wwwdocs/papers/Patterson88.pdf

---

## 2. Muntz and Lui (1990) — **Correct (secondary for content)**

**Bibliographic data.** R. R. Muntz and J. C. S. Lui, "Performance analysis of disk arrays under failure," 16th International Conference on Very Large Data Bases (VLDB), Brisbane, 1990, pp. 162–173. Confirmed on the VLDB-hosted DBLP record https://vldb.org/dblp/db/conf/vldb/MuntzL90.html **[review]**. PDF: https://www.vldb.org/conf/1990/P162.PDF (a scanned image; I could not extract its text, so I did not read it).

**Content, via Holland and Gibson 1992 [secondary].** Holland and Gibson describe "the introduction of declustering by Muntz and Lui", note that Muntz and Lui use the word *clustered* for what is now called *declustered*, credit them with the ratio α = (G − 1)/(C − 1), and say: "Muntz and Lui recognized and suggested that such layouts might be found in the literature for balanced incomplete block designs." They also say the parity mapping itself "was left as an open problem by Muntz and Lui." The lesson's wording ("suggested that the layouts ... could be found among the balanced incomplete block designs") follows this.

---

## 3. Holland and Gibson (1992) — **Correct**

**Claims checked [primary]** (text of the ASPLOS paper from the CMU copy):
- Abstract: the parity layout problem is solved "basing our solution on balanced incomplete and complete block designs", and "declustered parity penalizes user response time while a disk is being repaired (before and during its recovery) less than comparable non-declustered (RAID5) organizations".
- §4: even reconstruction "will be achieved if the number of times that a pair of disks contain stripe units from the same parity stripe is constant across all pairs of disks."
- §4: layouts use designs from Hall's *Combinatorial Theory* list: "Whenever possible, our parity declustering implementation uses one of Hall's designs."
- §2: α "indicates the fraction of each surviving disk that must be read during the reconstruction of a failed disk. Note that α = 1 for the RAID5 organization."
- §2: "any two failures in the C disks constituting the array will cause data loss." (Supports the lesson's caveat about a second failure.)
- Parity is the cumulative exclusive-or; a lost unit is rebuilt by XOR of the rest of its parity stripe.
- Figure 2-2 happens to show a stripe of size 4 declustered over 7 disks; the paper does not use the Fano plane or a difference set.

**Citation.** M. Holland and G. A. Gibson, "Parity declustering for continuous operation in redundant disk arrays," *ASPLOS-V*, 1992, pp. 23–35. DOI 10.1145/143365.143383 (Crossref confirmed: title, authors, pages, 1992); also *ACM SIGPLAN Notices* 27(9), DOI 10.1145/143371.143383. Copy read: https://www.cs.cmu.edu/~riedel/ftp/Declustering/ASPLOS.pdf. Tech report CMU-CS-92-130 (DTIC ADA254052; the DTIC server returned 403, not read).

---

## 4. OpenZFS dRAID — **Correct**

**Claims checked [primary].**
- Release notes for OpenZFS 2.1.0 (GitHub release `zfs-2.1.0`, published 2021-07-02) list "Distributed Spare RAID (dRAID)" as a major new feature, "which enables dramatically faster resilver times using integrated hot spares."
- dRAID Howto (https://openzfs.github.io/openzfs-docs/Basic%20Concepts/Pool%20Structure/dRAID%20Howto.html): layouts use "carefully chosen precomputed permutation maps"; rebuild I/O "will distribute evenly among all surviving drives"; for a sequential resilver to a distributed hot spare, "the performance scales with the number of disks divided by the stripe width (D+P)"; parity level "(1-3). Defaults to one."
- The Howto does not mention block designs or difference sets.

The lesson's gloss "spare space on the other disks instead of one empty replacement disk" for *distributed hot spare* is my paraphrase of the term **[inference]**.

---

## 5. Western Digital patent US9841908B1 — **Correct**

**Claims checked [primary]** (Google Patents full text, read in two parts):
- Title: "Declustered array of storage devices with chunk groups and support for multiple erasure schemes." Inventors Zhengyi Zhao and Jun Xu; assignee Western Digital Technologies, Inc.; filed 2016-06-30; granted 2017-12-12.
- "One method of achieving these criteria is to provide a parity declustered layout based on a balanced incomplete block design."
- If the chunk group mapping "is based on a BIBD, then the reconstruction workload may be evenly distributed among all of the other storage devices." (Quoted in the lesson.)
- Construction: when K is a prime ≥ 3 and N = K², it fills a K × K matrix with a random permutation of the devices, adds rotated copies and the transpose, and takes rows as chunk groups, so that each pair of devices shares exactly one chunk group. Falls back to partial BIBDs otherwise.
- The full text does not contain "difference set", "projective plane", "Fano", "finite field", or "cyclic".

(That N = K², groups of K, pairs meeting once, is the shape of an affine plane of order K **[inference]**; the lesson only says "a square grid of devices".)

---

## 6. No difference-set product — **Absence claim**

No source checked (the three papers above, the dRAID docs, US9841908B1, and the prior notes in `docs/applications.md` §2.3, which also searched patents) describes a shipping product whose layout is a cyclic difference set or a projective plane. The lesson says "I have not found a product that uses a difference-set or projective-plane layout itself," and does not claim none exists.

---

## Not used in the lesson

- US8677063B2 and US7346831B1 (other declustering patents) were not reopened and are not cited.
- IBM Spectrum Scale RAID declustering was not checked and is not mentioned.
