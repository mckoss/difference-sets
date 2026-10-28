<!-- Research notes gathered 2026-10-27 for the Applications lessons (Part VII); tags [V]/[S]/[U]/[I] mark how each claim was checked. -->

# Applications of Cyclic Difference Sets: Research Notes

Research for the Applications section of a cyclic difference set site, focused on Singer sets.

**Status legend**
- **[V]**: verified in this session against a primary source (publisher or DOI record, standard text, or Google Patents page).
- **[S]**: supported only by secondary sources (surveys, citing papers, course notes).
- **[U]**: unverified. Believed true but not confirmed here. Check before publishing.
- **[I]**: my own inference or calculation. Shown so it can be checked.

DOIs marked [V] were resolved through the Crossref API on 2026-10-27. Patent details marked [V] were read from the Google Patents pages linked.

---

## 0. The one idea behind every application

Take a cyclic (v, k, λ) difference set D ⊂ ℤ_v. Every nonzero difference d ≡ a − b (mod v) occurs exactly λ times. An equivalent statement is the **translate-overlap property**:

> For every shift t ≠ 0 (mod v): |D ∩ (D + t)| = λ.

Each application below is this sentence in a different setting:

| Setting | "D" is… | "shift t" is… | "overlap = λ" means… |
|---|---|---|---|
| Signals | the time slots where a code is −1 (or "on") | a time delay | the code looks the same, and flat, at every wrong alignment |
| Imaging | the open holes in a mask | the direction a star is in | every star casts an equally confusing shadow, so the confusion can be subtracted out |
| Codes | the positions that one parity check covers | a cyclic rotation of the check | every bit is checked with every other bit exactly λ times, so a majority vote works |
| Scheduling | the awake slots in a cycle | the unknown clock offset between two radios | two devices always share λ awake slots |
| Quorums and keys | a node's quorum or key ring | the difference between node IDs | any two nodes share exactly λ members or keys |
| Rulers and antennas | the positions of sensors | a baseline length | each spacing is measured exactly λ times (λ = 1: no wasted duplicates) |

### 0.1 The autocorrelation formula (item 1 in the brief) [I], checked numerically

Define the ±1 characteristic sequence s_i = −1 if i ∈ D, and s_i = +1 otherwise, for i = 0 … v−1. Its periodic autocorrelation is

  C(t) = Σ_{i=0}^{v−1} s_i · s_{i+t mod v}.

The sequences s and its shift by t disagree exactly at positions in D Δ (D + t), the symmetric difference. That set has size 2(k − λ). Each agreement contributes +1 and each disagreement −1, so

  **C(0) = v, and C(t) = v − 4(k − λ) for every t ≠ 0.**

The 0/1 version is simpler still. With a_i = 1 if i ∈ D and 0 otherwise, A(t) = Σ a_i a_{i+t} = k at t = 0, and **A(t) = λ for every t ≠ 0**. This is the form coded-aperture imaging uses.

Examples, checked by script:

| Difference set | v − 4(k − λ) | Comment |
|---|---|---|
| Singer (7,3,1), D = {0,1,3} | −1 | the length-7 m-sequence |
| Singer (13,4,1), D = {0,1,3,9} | +1 | |
| Singer (21,5,1), D = {0,1,4,14,16} | +5 | |
| Singer (31,6,1) | +11 | planar sets with large q have high off-peak values; poor for ±1 signalling |
| Singer-type (15,7,3), m-sequence of length 15 | −1 | |

**Key takeaway.** The ±1 sequence is ideal for signalling only when v ≈ 4(k − λ). That happens for the **Hadamard/Singer parameters with q = 2 in higher dimension**: (2^n − 1, 2^{n−1} − 1, 2^{n−2} − 1) or the complement (2^n − 1, 2^{n−1}, 2^{n−2}). These give C(t) = −1, which is the m-sequence. Planar Singer sets (q² + q + 1, q + 1, 1) have the best 0/1 correlation, A(t) = 1, but are sparse. They fit sparse-mask, ruler, code and scheduling uses better than ±1 radio codes.

**Singer and m-sequences.** For q = 2, the hyperplanes of PG(n−1, 2) form a Singer difference set with parameters (2^n − 1, 2^{n−1} − 1, 2^{n−2} − 1). The positions of the zeros of a binary m-sequence of period 2^n − 1 form a Singer difference set, and the ones form its complement. [S] Golomb & Gong, *Signal Design for Good Correlation*, Cambridge UP, 2005, chapters on cyclic difference sets and cyclic Hadamard sequences (https://www.cambridge.org/core/books/abs/signal-design-for-good-correlation/cyclic-hadamard-sequences-part-1/715987DF48889D1FBE62C5AD5CF6DE0D). Also Q. Xiang's survey of two-level autocorrelation (https://sites.udel.edu/qxiang/files/2017/08/SETAsurvey-2dbi869.pdf), which states that binary two-level-autocorrelation sequences are equivalent to cyclic difference sets.

**Foundational citations**
- J. Singer, "A theorem in finite projective geometry and some applications to number theory," *Trans. AMS* 43 (1938) 377–385. DOI 10.1090/S0002-9947-1938-1501951-4 [V]. https://www.ams.org/tran/1938-043-03/S0002-9947-1938-1501951-4/
- L. D. Baumert, *Cyclic Difference Sets*, Lecture Notes in Mathematics 182, Springer, 1971 [V, catalogue]. Engineers cited it as the table of sets, for example in Leeper's antenna patent and the ASTROSAT mask design.

---

## 1. Ranking for a general audience

Ranked by (a) how well the real deployment is documented, (b) how directly the difference-set property explains it, and (c) how visual and graspable it is.

| Rank | Application | Deployed for real? | Singer specifically? | Evidence |
|---|---|---|---|---|
| 1 | **Coded-aperture X-ray/gamma imaging** | Yes: many space telescopes, plus radiation-finding cameras | Yes. Singer q = 2 masks ("Hadamard"/m-sequence) flew on Spacelab 2, Mir-Kvant TTM and ASTROSAT CZTI. Other missions used related sets (twin-prime, quadratic residue). | Strong |
| 2 | **Pseudo-noise sequences: GPS, radar, audio measurement, scrambling** | Yes, everywhere | Yes. m-sequences are Singer sets with q = 2. | Strong |
| 3 | **Difference-set error-correcting codes: FM data radio (DARC/VICS), Japanese teletext, ISDB-T** | Yes: Japanese car navigation traffic data since 1996, NHK teletext since 1985 | Yes. The (273,191) code comes from the Singer plane of order 16. | Strong (ITU standard text plus patents) |
| 4 | **"Always overlap" schedules: radio wake-up, quorums, key sharing** | Wake-up: patented. Quorums and keys: mostly academic. | Yes. The patent example is {0,1,3} mod 7. | Medium |
| 5 | **Golomb rulers, sparse antenna arrays, interference-free channel plans** | Thinned arrays: Bell Labs patent. Channel spacing: Bell Labs 1953. | Yes. Singer sets are optimal modular Golomb rulers. | Medium |
| 6 | **Declustered RAID storage** | Yes in products (declustered RAID), but layouts use general block designs | Not specifically | Medium |
| 7 | **Network topology (PolarFly)** | Research prototype (Intel, ETH) | Projective-plane polarity graph, which can be built from a Singer set [I] | Medium |
| 8 | Finite-geometry LDPC codes; memory ECC | NASA/CCSDS LDPC uses Euclidean geometry, not Singer | Partly | Medium |
| 9 | Compressed sensing / Welch-bound codebooks | Research | Any difference set | Medium (paper) |
| 10 | Optical CDMA codes, frequency hopping, Costas arrays | Research and military radar | Related, not identical | Mixed |
| 11 | Experimental design and scheduling | Agriculture and statistics | Any difference set | Strong historically, less "engineering" |
| 12 | Hadamard-multiplexed spectroscopy and ion mobility | Lab instruments | m-sequence (Singer q = 2) | Medium |

### Recommended lessons with interactive demos (choose 4–6)

1. **"Pictures without a lens": coded-aperture imaging.** Demo: a 2-D mask built by folding a length-63 or length-255 m-sequence, or a planar Singer mask. The reader drags 1–3 "stars" around a sky. The page draws the overlapping shadows on the detector, which looks like noise. A "Decode" button correlates the detector image with the mask, and the stars appear as sharp peaks on a flat floor. A toggle swaps in a random mask so the reader can see the uneven side-lobe junk return. The point: a flat floor happens only because every shift overlaps in exactly λ holes.
2. **"Finding an echo": two-level autocorrelation (GPS, radar, sonar).** Demo: pick a Singer set (7, 15, 31, 63 or 127 long). The page builds the ±1 sequence, hides it inside noise at an unknown delay, and lets the reader slide a "template" along it. A live bar chart shows C(t) with a spike of v and −1 everywhere else. Side by side, a random ±1 sequence shows bumpy side-lobes. Include a real-world bonus: the GPS C/A G1 register (x^10 + x^3 + 1) and the DARC scrambler (x^9 + x^4 + 1).
3. **"Majority rules": a difference-set code that fixes errors.** Demo: the (7,3,1) or (21,5,1) plane. The (21,11) code corrects 2 errors, and the real-world (273,191) code corrects 8. The reader flips bits in a 21-bit word arranged around a circle. The demo shows the 5 check sums that touch a chosen bit, which share no other bit because λ = 1. A majority vote decides each bit, with animation. Connect to VICS traffic data in Japanese car navigation radios.
4. **"Always meet": wake-up schedules, quorums and shared keys.** Demo: 7 (or 13, 21) devices on a ring. Each is awake on slots D + offset, with offsets chosen by the reader using sliders that act as unsynchronised clocks. Highlight that any two devices share exactly one awake slot, whatever the offsets. Then relabel the same picture: "awake slots" become "keys" (Camtepe–Yener) and then "quorum members" (Maekawa). Compare against a random schedule where some pairs never meet.
5. **"A ruler with no repeats": Golomb rulers, antennas and radio channels.** Demo: a circular ruler with marks at a Singer set, for example {0,1,3,9} mod 13. Clicking a pair shows its arc distance, and a tally shows every distance 1–12 appearing exactly once. "Unwind" the circle to a straight sparse antenna array and show the baseline coverage, the co-array. Optional: radio channels with no third-order intermodulation collisions.
6. *(Optional)* **"Rebuilding a disk without overloading anyone": declustered storage.** Demo: 7 disks, with stripes = lines of the Fano plane (translates of {0,1,3}). Fail a disk and watch every survivor carry the same rebuild load. Contrast with RAID-5 on 3 disks plus 4 idle disks.

---

## 2. Application details

### 2.1 Signal encoding, synchronisation and ranging (m-sequences / PN codes)

**How the property makes it work.** A receiver finds a known code inside a noisy signal by multiplying the incoming signal by shifted copies of the code and adding. That is the correlation C(t). The code's own "fingerprint" must give a big value at the true alignment and a small, constant value everywhere else, so no false alarm can be mistaken for a lock. Because every shift of a difference set overlaps the original in exactly λ positions, every wrong alignment gives the same value, v − 4(k − λ). For the q = 2 Singer parameters that value is −1 against a peak of v.

**Singer specifically?** Yes. Binary m-sequences ("maximal-length shift-register sequences") are the q = 2 higher-dimensional Singer difference sets [S].

**Real deployments**
- **GPS C/A code.** Each satellite's code is the XOR of two 10-stage maximal-length shift-register sequences, G1 (1 + x³ + x¹⁰) and G2 (1 + x² + x³ + x⁶ + x⁸ + x⁹ + x¹⁰), with period 1023 chips (1 ms at 1.023 Mchip/s). [S] for the polynomials (multiple secondary sources agree). [S/V] the gps.gov ICWG redline IRN-IS-200N-003 describes the C/A code as the modulo-2 sum of two 1023-chip sequences G1 and G2i: https://gps.gov/technical/icwg/meetings/2023/IRN-IS-200N-003_RFC502_20230927.pdf. **Caveat for the lesson:** the transmitted GPS code is a *Gold code* (a sum of two m-sequences). G1 and G2 are each Singer-type, but the Gold code itself is *not* a difference set. Its autocorrelation is three-valued, which trades a little autocorrelation quality for low cross-correlation between satellites.
- **Pulse-compression radar.** Raytheon patent **US4566010A**, "Processing arrangement for pulse compression radar," inventor J. D. Collins, priority 1982-04-28, granted 1986-01-21. It uses LFSR maximal-length codes whose length equals the time-bandwidth product. https://patents.google.com/patent/US4566010A/en [V]. ITT patent **US4156876A**, "Autocorrelation sidelobe suppression device for a continuous periodic phase-coded signal," J.-C. A. Debuisser, International Standard Electric Corp., priority 1976-12-16, granted 1979-05-29. It explicitly uses a "maximum length sequence code" whose periodic autocorrelation sidelobes are constant at −1. https://patents.google.com/patent/US4156876A/en [V]. MathWorks Phased Array Toolbox `mlseq` documents the −1 periodic side-lobe, citing Levanon & Mozeson, *Radar Signals*, Wiley 2004: https://www.mathworks.com/help/phased/ref/mlseq.html [S].
- **Acoustic and audio measurement (MLS).** D. D. Rife & J. Vanderkooy, "Transfer-function measurement with maximum-length sequences," *J. Audio Eng. Soc.* 37(6), 419, June 1989 [S/V: AES e-library record https://aes2.org/publications/elibrary-page/?id=6086]. It became the commercial MLSSA analyser from DRA Laboratories, used for loudspeaker and room acoustics (Stereophile, "Measuring with MLSSA": https://www.stereophile.com/reference/290mlssa) [S]. This is very relatable for a general audience: play a hiss-like m-sequence through a speaker, correlate, and recover the room's echo pattern.
- **Data scrambling.** DARC (ITU-R BS.1194) scrambles data with the PN sequence g(x) = x⁹ + x⁴ + 1, an m-sequence of period 511 [V, ITU text, see §2.2]. Wi-Fi, DVB and similar standards also use m-sequence scramblers [U, not checked here].
- **CDMA (IS-95/cdmaOne).** The short PN codes (period 2¹⁵) and the long code (period 2⁴² − 1) are m-sequence based [U, not verified from the TIA standard in this session].
- **Frame synchronisation.** Classic frame-sync words (Barker codes) are designed for *aperiodic* correlation and are **not** difference sets. Periodic sync and ranging (for example spacecraft PN ranging) use m-sequences [U].

**Citations**
- S. W. Golomb, *Shift Register Sequences*, Holden-Day 1967; rev. ed. Aegean Park Press 1982 [U, standard reference].
- S. W. Golomb & G. Gong, *Signal Design for Good Correlation*, Cambridge UP, 2005. ISBN 9780521821049 [V, publisher page].

---

### 2.2 Error-correcting codes: difference-set cyclic codes and majority-logic decoding

**How the property makes it work.** Use the difference set as a parity check: "the bits at positions D + i must XOR to 0." Rotating it gives v checks. Fix one bit position j. The checks that contain j contain no other bit in common, because two positions appear together in exactly λ = 1 translate (the planar Singer case). If one bit is wrong, many independent checks "vote" that j is bad. So each bit can be repaired by a simple majority vote over its k = q + 1 checks. That is cheap hardware with no algebra. A planar code corrects ⌊(q+1)/2⌋ errors per block [I, standard result: d = q + 2 for q = 2^s].

**Singer specifically?** Yes. Weldon's codes use perfect (λ = 1) difference sets, which for these parameters come from Singer's construction. For q = 2^s: n = 2^{2s} + 2^s + 1, n − k = 3^s + 1 [I, standard formula]. With s = 4 (q = 16): n = 273, n − k = 82, k = 191. That is exactly the **(273,191)** code, and it corrects up to 8 errors. [S] One teletext source says "maximum of 8 bits," consistent with this. (Note: patent US8122318 states the parity formula as "3s + 1." That appears to be a typo for 3^s + 1.)

**Primary paper**
- E. J. Weldon Jr., "Difference-set cyclic codes," *Bell System Technical Journal* 45(7), 1045–1055, Sept 1966. DOI 10.1002/j.1538-7305.1966.tb01686.x [V]. Abstract: "approximately as powerful" as BCH codes but "much more simply" implemented (Nokia Bell Labs archive: https://www.nokia.com/bell-labs/publications-and-media/publications/difference-set-cyclic-codes) [V]. Companion paper (authors believed to be R. L. Graham & F. J. MacWilliams [U]): "On the number of information symbols in difference-set cyclic codes," BSTJ 45, 1057–1070, 1966, DOI 10.1002/j.1538-7305.1966.tb01687.x [V].
- Error Correction Zoo entry, "Difference-set cyclic code": https://errorcorrectionzoo.org/c/difference_set [S].

**Real deployments**
1. **FM multiplex data broadcasting, DARC (Data Radio Channel)** [V]. ITU-R Recommendation **BS.1194-2 (1998)**, "Systems for multiplexing FM sound broadcasting with a sub-carrier data channel having a relatively large transmission capacity for stationary and mobile reception." DARC is *System A, Annex 1*. Its §2.5 says, verbatim: *"A product code (272,190) × (272,190) is used for the frame in methods A and B … A block code (272,190) is used for method C. The (272,190) code is a shortened majority logic decodable difference set cyclic code."* The generator polynomial is g(x) = x⁸² + x⁷⁷ + x⁷⁶ + x⁷¹ + x⁶⁷ + x⁶⁶ + x⁵⁶ + x⁵² + x⁴⁸ + x⁴⁰ + x³⁶ + x³⁴ + x²⁴ + x²² + x¹⁸ + x¹⁰ + x⁴ + 1. Subcarrier 76 kHz, 16 kbit/s. The recommendation also notes "The DARC FM sub-carrier specifications are a matter of ETSI Standard ETS 300 751." PDF: https://www.itu.int/dms_pubrec/itu-r/rec/bs/R-REC-BS.1194-2-199812-I!!PDF-E.pdf
   - **(272,190) vs (273,191).** The standard uses the code shortened by one bit, (272,190), so that blocks fit byte-friendly 272-bit packets. The parent code is the Singer-based (273,191) code. Both labels are correct, and the user's "(273,191)" is the parent code.
   - **Where it ran:** Japan's **VICS** (Vehicle Information and Communication System) sends road-traffic data to car navigation units over FM multiplex (DARC). It began in April 1996 in the Tokyo area, ran 24 hours via FM multiplex from April 1999, and covered the whole country by Feb 2003 (VICS Center history: https://www.vics.or.jp/en/center/history/) [S/V]. DARC demodulator chips with (272,190) decoding were sold, for example onsemi LC72711LW (https://www.onsemi.com/products/custom-assp/audio-video-assp/audio-assp/lc72711lw) [S]. DARC was also used in Europe (SWIFT) [U].
2. **Japanese analogue TV teletext (character multiplex broadcasting)** [V via patents]. NHK regular service began 29 Nov 1985 [S, Wikipedia "JTES"]. Patents:
   - **US4630271A**, "Error correction method and apparatus for data broadcasting system," inventor Osamu Yamada, assignee Nippon Hoso Kyokai (NHK), priority 1983-01-20, granted 1986-12-16. It states that the (273,191) majority-logic decodable code derives from the difference-set cyclic code and is shortened to (272,190) per packet. https://patents.google.com/patent/US4630271A/en [V]
   - **US4675868A**, "Error correction system for difference set cyclic code in a teletext system," inventors H. Shishikura, I. Sase, A. Yanagimachi, O. Yamada, assignees NHK and Oki Electric, priority 1984-03-30, granted 1987-06-23. It describes a 272-bit packet (190 data + 82 parity) and a majority circuit over 17 check sums. Note that 17 = q + 1 for q = 16, the Singer line size. https://patents.google.com/patent/US4675868A/en [V]
3. **ISDB-T / ISDB-Tsb digital TV and radio (Japan, Brazil, much of Latin America): TMCC control channel** [S]. A shortened (184,102) difference-set cyclic code, derived from the (273,191) code, protects TMCC transmission-parameter signalling. Sources: DiBEG ISDB-T seminar slides (https://www.dibeg.org/wp/wp-content/uploads/news/0709Argentina_ISDB-T_seminar/070916ISDB-T_for_Argentina.pdf) and Samsung patent **US8122318B2**, "Decoding apparatus and method for a perfect difference-set cyclic code and a difference-set cyclic code," inventor V. Pribylov, Samsung Electronics, priority 2007-03-30, granted 2012-02-21 (https://patents.google.com/patent/US8122318B2/en) [V for the patent's statements]. The normative text is ARIB STD-B31 / ITU-R BT.1306 [U, not opened].
4. **Memory reliability (research)** [V, DOI]. S.-F. Liu, P. Reviriego, J. A. Maestro, "Efficient majority logic fault detection with difference-set codes for memory applications," *IEEE Trans. VLSI Systems* 20(1), 148–156, 2012, DOI 10.1109/TVLSI.2010.2091432. Related: Reviriego et al., "Multiple cell upset correction in memories using difference set codes," *IEEE TCAS-I* 59(11), 2012, DOI 10.1109/TCSI.2012.2190632 [S]. Majority-logic decoding is attractive for radiation-hardened SRAM.

**Finite-geometry LDPC codes**
- Y. Kou, S. Lin, M. P. C. Fossorier, "Low-density parity-check codes based on finite geometries: a rediscovery and new results," *IEEE Trans. Inf. Theory* 47(7), 2711–2736, Nov 2001. DOI 10.1109/18.959255 [V]. It shows that projective-geometry (PG) and Euclidean-geometry (EG) codes, including Weldon-type difference-set codes, are LDPC codes with girth-6 Tanner graphs. They can be cyclic or quasi-cyclic, so encoding is a shift register. Under belief-propagation decoding they perform well with low error floors.
- **Deployment:** NASA/CCSDS near-Earth LDPC "C2" (8176,7156) and the related (4095,3367) code come from the **EG** (Euclidean geometry) construction [S: NASA-hosted document via corpora.tika.apache.org; Landsat Data Continuity use per arXiv 2405.20524]. The CCSDS 131.1/131.0 Blue Book is the normative source [U, not opened]. **This is not the Singer projective plane**, so present it as "the same family of finite-geometry ideas."
- Error Correction Zoo, "Finite-geometry LDPC code": https://errorcorrectionzoo.org/c/pg_ldpc [S].

---

### 2.3 Storage redundancy: parity declustering and fractional repetition codes

**How the property makes it work.** In a disk array, each "stripe" of data plus parity sits on a group of disks. When one disk fails, every stripe that touched it must be rebuilt by reading its *other* disks. If the stripes are the blocks of a balanced design, every pair of disks shares exactly λ stripes. So after any failure, every surviving disk does the same, smaller amount of rebuild work. No disk becomes a hotspot. The translates of a cyclic difference set are one easy way to get such a design: stripe i uses disks D + i (mod v).

**Singer specifically?** Not in the products found. The literature uses general BIBDs, and cyclic difference sets are one way to build them. For a demo, 7 disks with the stripes {0,1,3} + i is a clean Singer example [I].

**Primary sources**
- M. Holland & G. A. Gibson, "Parity declustering for continuous operation in redundant disk arrays," *ASPLOS-V*, 1992, pp. 23–35. DOI 10.1145/143365.143383 [V]. Tech report CMU-CS-92-130 (DTIC AD-A254 052): https://apps.dtic.mil/sti/pdfs/ADA254052.pdf. Uses balanced incomplete and complete block designs for layout.
- R. R. Muntz & J. C. S. Lui (1990) first framed declustering as a block-design problem. Ng & Mattson (1994) also used BIBDs [S: arXiv 2401.03235 RAID tutorial].
- S. El Rouayheb & K. Ramchandran, "Fractional repetition codes for repair in distributed storage systems," Allerton 2010, arXiv:1010.2551 [S/V arXiv]. Uses Steiner systems and regular graphs. Koo & Gill's scalable FR codes are "related to projective geometries" (arXiv:1102.3493) [S].

**Patents**
- **US9841908B1**, "Declustered array of storage devices with chunk groups and support for multiple erasure schemes," inventors Zhengyi Zhao and Jun Xu, Western Digital Technologies, priority 2016-06-30, granted 2017-12-12. It defines and uses a BIBD for chunk-group layout so that rebuild load spreads evenly. https://patents.google.com/patent/US9841908B1/en [V]. Continuation: US10346056 [S].
- **US8677063B2**, "Parity declustered storage device array with partition groups." It compares against a prior-art complete-block-design layout. https://patents.google.com/patent/US8677063 [S, not opened].
- **US7346831B1**, "Parity assignment technique for parity declustering in a parity array of a storage system," P. F. Corbett, Network Appliance, priority 2001-11-13, granted 2008-03-18. https://patents.google.com/patent/US7346831B1/en [V]. **Not** a block-design construction; it uses combinatorial enumeration. Cite only as context.
- **No patent found that explicitly claims a difference-set or projective-plane disk layout** [searched; none found].

**Deployments:** declustered RAID ships in OpenZFS **dRAID** (OpenZFS 2.1, 2021). dRAID uses precomputed *permutation maps*, not block designs (OpenZFS docs: https://openzfs.readthedocs.io/en/latest/Basic%20Concepts/dRAID%20Howto.html) [S]. IBM Spectrum Scale RAID and others also decluster [U]. For the lesson, say that the even-rebuild-load goal is what the design guarantees exactly.

---

### 2.4 Coded-aperture imaging (X-ray and gamma-ray astronomy, radiation finding, nuclear medicine)

**How the property makes it work.** Lenses and mirrors don't work for hard X-rays and gamma rays. So the instrument puts a plate with a pattern of holes (the mask) in front of a position-sensitive detector. Each star casts a shifted shadow of the mask, and the detector records the sum of all the shadows. To decode, correlate the detector image with the mask pattern. A star at shift s gives a peak of k (all holes line up), and every other shift gives exactly λ, the overlap of D with D + t. So each star leaves a sharp peak on a **perfectly flat floor** that can be subtracted. Random masks leave lumpy "ghost" side-lobes. This is the 0/1 autocorrelation A(t) = λ from §0.1, in 2-D, using the mask as a cyclic array (a 2×2 mosaic of the basic pattern).

**Singer specifically?** Yes, in the q = 2, higher-dimensional form. Masks called "Hadamard" or "pseudo-noise" in the astronomy literature are m-sequences of length 2^n − 1, folded into an r × s rectangle where r · s = 2^n − 1. Goldwurm & Gros call m-sequences "Hadamard-Singer sets," "the most interesting CDS for 2-d astronomical imaging." Other flown masks use twin-prime URAs (Fenimore–Cannon) and quadratic-residue sets (MURA, HURA), which are different difference-set families.

**Primary papers**
- R. H. Dicke (1968) and J. G. Ables (1968) proposed multi-hole masks [U, standard history].
- J. Gunson & B. Polychronopulos, "Optimum design of a coded mask X-ray telescope for rocket applications," *MNRAS* 177(3), 485–497, 1976. DOI 10.1093/mnras/177.3.485 [V]. First to base masks on cyclic difference sets [S].
- E. E. Fenimore & T. M. Cannon, "Coded aperture imaging with uniformly redundant arrays," *Applied Optics* 17(3), 337–347, 1 Feb 1978. DOI 10.1364/AO.17.000337 [V]. URA = cyclic difference set mask with flat side-lobes.
- S. R. Gottesman & E. E. Fenimore, "New family of binary arrays for coded aperture imaging" (MURA), *Applied Optics* 28, 4344, 1989. DOI 10.1364/AO.28.004344 [V].
- F. J. MacWilliams & N. J. A. Sloane, "Pseudo-random sequences and arrays," *Proc. IEEE* 64, 1715–1729, 1976. DOI 10.1109/PROC.1976.10411 [V]. The method of folding m-sequences into 2-D arrays.
- E. Caroli et al., "Coded aperture imaging in X- and gamma-ray astronomy," *Space Sci. Rev.* 45, 349, 1987 [S].
- A. Goldwurm & A. Gros, "Coded mask instruments for gamma-ray astronomy," in *Handbook of X-ray and Gamma-ray Astrophysics*, Springer 2022/23; arXiv:2305.10130 (https://arxiv.org/html/2305.10130) [V, read]. Source for the instrument table below.

**Flown instruments and mask types** (from Goldwurm & Gros unless noted) [V]

| Instrument | Mission / year | Mask stated | Difference-set family |
|---|---|---|---|
| SL1501 | UK sounding rocket | "rectangular 93×11 Hadamard mask" | 93 × 11 = 1023 = 2¹⁰ − 1, an m-sequence, so **Singer q = 2** [I] |
| XRT | **Spacelab 2**, Space Shuttle *Challenger* STS-51F, 1985 | "two Hadamard masks of different basic pattern." Per NASA archive: 31×33 (coarse) and 127×129 (fine) | 1023 = 2¹⁰ − 1 and 16383 = 2¹⁴ − 1, so **Singer q = 2** [I, from dimensions; 33 is not prime, so not twin-prime]. Willmore et al., NIM 221, 284 (1984) [S] |
| TTM / COMIS | **Mir** space station, Kvant module (1987–) | "used again a Hadamard mask." The text says 255×257 from an m-sequence CDS | 255 × 257 = 65535 = 2¹⁶ − 1, **Singer q = 2** [I] |
| SIGMA | GRANAT (1989) | "a replicated 31×29 URA" | twin-prime (29, 31) URA |
| ART-P | GRANAT | "replicated URA" | URA |
| SPI, JEM-X | **INTEGRAL** (ESA, 2002–) | HURA of order 127 | hexagonal quadratic-residue / skew-Hadamard |
| IBIS | INTEGRAL | replicated MURA, 53×53 basic in 95×95 | quadratic residue mod 53 (almost a difference set) |
| CZTI | **ASTROSAT** (India, 2015–) | "Hadamard pattern." The IUCAA design page says each 16×16 unit is a 255-element pseudo-noise Hadamard URA from 8th-order primitive polynomials, plus one closed element | **Singer q = 2** (2⁸ − 1) [V, https://web.iucaa.in/~astrosat/CodedMask/MaskDesign.html] |
| BeppoSAX WFC | 1996 | "triadic residues" pseudo-random | cubic-residue type |
| Swift BAT | 2004– | random "D-shaped" mask | not a difference set (contrast case) |
| ECLAIRs | SVOM (2024–) | optimised quasi-random | not a difference set |

**Lesson angle:** two long-running observatories, ESA's INTEGRAL and India's ASTROSAT, and a Space Shuttle telescope used difference-set masks. ASTROSAT and Spacelab 2 used the Singer/m-sequence kind. Swift chose random masks, a nice "why not always use difference sets?" discussion. Random masks handle very large detectors with gaps, and a random mask has no repeated pattern to confuse.

**Patents**
- **US4228420A**, "Mosaic of coded aperture arrays," inventors E. E. Fenimore & T. M. Cannon, assignee U.S. Department of Energy, filed 1978-09-14, granted 1980-10-14. Claims a 2r × 2s mosaic of a basic r × s uniformly redundant array. https://patents.google.com/patent/US4228420A/en [V]. (The text says "uniformly redundant array," not "difference set.")
- Later coded-aperture patents (QinetiQ **US7923677B2**, **US8035085B2**, **US8073268B2**) cite Fenimore & Cannon, but no difference-set language was found [S].

**Ground use**
- **Radiation-finding gamma cameras** for nuclear sites. CANBERRA (now Mirion) **iPIX** uses a tungsten coded mask on a Timepix CdTe detector. Korean nuclear-society tests used an iPIX with a MURA mask on UO₂ samples (https://kns.org/files/pre_paper/49/23S-129-김예원.pdf) [S]. The mask type in the commercial product is not confirmed from a vendor source [U].
- **Nuclear medicine**: still research. MURA rank-19 masks for intra-operative sentinel-node and thyroid-remnant imaging (arXiv:1706.01327) [S]. MURA rank-31 hand-held camera (Meißner et al., EJNMMI Physics 2024) [S]. No routine clinical coded-aperture scintigraphy was found.

---

### 2.5 Sensor and antenna placement: Golomb rulers, sparse arrays, channel plans

**How the property makes it work.** An interferometer (radio telescope array, sonar, radar) measures the signal at each *difference* of positions, called a baseline. Each baseline gives one sample of the sky's spatial-frequency picture. If two antenna pairs have the same spacing, one of them is wasted. In a set where every difference appears at most once (a Golomb ruler), no measurement is duplicated. A **planar Singer set mod q² + q + 1** is a *modular* Golomb ruler: every residue 1 … v−1 appears as a difference exactly once. So q + 1 marks give the most baselines possible on that cycle, with no duplicates and no gaps.

**Singer specifically?** Yes. A modular ruler with k marks needs modulus v ≥ k² − k + 1, and equality is exactly a planar difference set (q² + q + 1, q + 1, 1) [S: arXiv 2408.16721 / Buratti & Stinson arXiv:2007.01908; I for the arithmetic]. Cutting Singer sets open ("unwinding") and taking pieces gives near-optimal ordinary Golomb rulers. Computations with Singer and Bose constructions showed G(n) < n² for all n < 150 (Lam & Sarwate), as reported in A. Dimitromanolakis, *Analysis of the Golomb Ruler and the Sidon Set Problems, and Determination of Large, Near-Optimal Golomb Rulers*, Technical University of Crete, 2002 (https://www.cs.toronto.edu/~apostol/golomb/main.pdf) [V, read §5.5 "Singer Perfect Difference sets"].

**Primary sources and deployments**
- **Interference-free radio channel plans.** W. C. Babcock, "Intermodulation interference in radio systems: frequency of occurrence and control by channel selection," *BSTJ* 32(1), 63–73, 1953 [S/V Bell Labs archive https://www.nokia.com/bell-labs/publications-and-media/publications/intermodulation-interference-in-radio-systems-frequency-of-occurrence-and-control-by-channel-selection]. Choosing channels with all distinct spacings avoids third-order intermodulation products. M. D. Atkinson, N. Santoro, J. Urrutia, "Integer sets with distinct sums and differences and carrier frequency assignments for nonlinear repeaters," *IEEE Trans. Commun.* 34(6), 614–617, 1986. DOI 10.1109/TCOM.1986.1096587 [V]. (Satellite transponder carrier assignment. This paper is about ordinary, not modular, rulers.)
- **Minimum-redundancy linear arrays.** A. T. Moffet, "Minimum-redundancy linear arrays," *IEEE Trans. Antennas Propag.* 16(2), 172–175, 1968. DOI 10.1109/TAP.1968.1139138 [V]. (Moffet's arrays are found by search, not from difference sets. They are the motivating problem.)
- **Difference-set antenna arrays (patent).** **US4071848A**, "Thinned aperiodic antenna arrays with improved peak sidelobe level control," inventor David G. Leeper, Bell Telephone Laboratories, filed 1976-11-26, granted 1978-01-31. Element positions come from cyclic difference sets ("difference set arrays"), with planar arrays built from cyclic shifts. It cites Baumert's tables. https://patents.google.com/patent/US4071848A/en [V]. Follow-up: D. G. Leeper, "Isophoric arrays—massively thinned phased arrays with well-controlled sidelobes," *IEEE Trans. Antennas Propag.* 47(12), 1825–1835, 1999. DOI 10.1109/8.817659 [V]. The difference-set property makes the far-field side-lobe power exactly flat, the same flat-floor idea as coded apertures.
- **Radio interferometers.** L. E. Kopilovich & L. G. Sodin, *Multielement System Design in Astronomy and Radio Science*, Springer (Kluwer), 2001 (https://link.springer.com/978-1-4020-0069-0) [S]. Also Sodin & Kopilovich, A&A 2002, hexagonal arrays from cyclic difference sets (https://www.aanda.org/10.1051/0004-6361:20020971) [S]. G. Oliveri et al., DS-based planar isophoric thinned arrays, *IEEE TAP* 68(4), 2895–2910, 2020 (arXiv:2103.11902) [S]. **No specific operating radio telescope was confirmed to use a Singer layout** [U]. Present this as a design method.
- Other Golomb-ruler uses: self-orthogonal convolutional codes (Robinson & Bernstein) and the distributed.net OGR search [S].

---

### 2.6 Distributed systems: quorums, key predistribution, wake-up schedules

**How the property makes it work.** Give node i the set D + i (mod v): its quorum, its key ring, or its awake slots. For any two nodes i ≠ j, |(D + i) ∩ (D + j)| = |D ∩ (D + (j − i))| = λ. So **any two nodes always share exactly λ elements**, with only k ≈ √v elements each. For planar Singer sets, λ = 1 and k = q + 1 ≈ √v, the smallest size possible for "always intersect" [I]. In terms of the projective plane: any two lines meet in exactly one point.

**(a) Mutual exclusion and quorums**
- M. Maekawa, "A √N algorithm for mutual exclusion in decentralized systems," *ACM TOCS* 3(2), 145–159, May 1985. DOI 10.1145/214438.214445 [V]. Quorums are lines of a finite projective plane, so messages per entry are about c√N (3 ≤ c ≤ 5) instead of 2(N − 1). PDF: https://courses.grainger.illinois.edu/CS425/fa2023/p145-maekawa.pdf [S].
- Later: "boosted finite projective planes" as Byzantine quorum systems (arXiv cs/9908011; authors believed Malkhi, Reiter, Wool [U]).
- **Deployment:** taught widely, but production systems (Dynamo, Cassandra, ZooKeeper, Paxos/Raft) use majority quorums, not projective planes [U, general knowledge]. **No patent found.**

**(b) Key predistribution in wireless sensor networks**
- S. A. Çamtepe & B. Yener, "Combinatorial design of key distribution mechanisms for wireless sensor networks," ESORICS 2004, LNCS 3193, 293–308 [S]. Journal version *IEEE/ACM Trans. Networking* 15(2), 346–358, Apr 2007, DOI 10.1109/TNET.2007.892879 [V]. Uses a symmetric design (n² + n + 1, n + 1, 1), a projective plane, and generalized quadrangles. Any two nodes share exactly one key.
- Survey: Paterson & Stinson, "A unified approach to combinatorial key predistribution schemes for sensor networks" (arXiv 0902.0458 is related) [S].
- **Deployment:** academic. **No patent using projective planes or difference sets found.** Sensor-key patents found (US7873167B2, US7702905B2, US7486795B2) do not show difference-set language [S].

**(c) Asynchronous wake-up / neighbour discovery (best-documented of the three)**
- R. Zheng, J. C. Hou, L. Sha, "Asynchronous wakeup for ad hoc networks," *ACM MobiHoc 2003*, pp. 35–45. DOI 10.1145/778415.778420 [V]. Journal: "Optimal block design for asynchronous wake-up schedules and its applications in multihop wireless networks," *IEEE Trans. Mobile Computing* 5(9), 1228–1241, 2006. DOI 10.1109/TMC.2006.134 [V]. Frames the optimal wake-up schedule as a block-design problem and reports up to 70% energy savings [S abstract].
- **Patent US7747273B2**, "Asynchronous power management methods and systems for wireless networks," inventor Zi-Tsan Chou, assignee Institute for Information Industry (Taiwan), priority 2006-06-05, granted 2010-06-29. Awake beacon intervals "form a cyclic difference set." The worked example is n = 7 with awake slots **{0, 1, 3}**, which is exactly the Singer (7,3,1) set. https://patents.google.com/patent/US7747273B2/en [V]. **Best single example for the lesson.**
- Related: cyclic quorum systems for wake-up (IEEE Trans. Computers 2010, https://www.ssrg.ece.vt.edu/papers/tc-cqs10.pdf; authors not checked [U]).

---

### 2.7 Other applications

**Optical orthogonal codes (optical CDMA).**
*How:* in fibre CDMA, each user sends light pulses at the positions of a 0/1 codeword. A receiver correlates without negative values, so the code needs low 0/1 auto- and cross-correlation. A codeword whose positions form a Golomb ruler mod v has off-peak autocorrelation ≤ 1. A planar Singer set achieves = 1, the best possible, for a single user.
*Sources:* F. R. K. Chung, J. A. Salehi, V. K. Wei, "Optical orthogonal codes: design, analysis and applications," *IEEE Trans. Inf. Theory* 35(3), 595–604, May 1989. DOI 10.1109/18.30982 [V]. Whether that paper uses projective geometry was not confirmed [U]. "Optical orthogonal codes from Singer groups" (Alderson & Mellinger) [S]. Buratti & Stinson, arXiv:2007.01908 [V, abstract]. *Deployment:* research and lab demonstrations [U].

**Frequency hopping.**
*How:* hopping patterns should rarely collide with their own delayed copies (Hamming autocorrelation). Optimal patterns correspond to partitioned cyclic difference packings, and m-sequence-based patterns are classic.
*Sources:* Lempel & Greenberger (1974) m-sequence-based optimal FH sequences [S]. Fuji-Hara et al. introduced partitioned cyclic difference packings equivalent to optimal FH sequences [S] (paper: Fuji-Hara, Miao, Mishima, IEEE Trans. Inf. Theory 2004 [U, title/authors from memory]). Ding, Fuji-Hara, Fujiwara, Jimbo, Mishima, "Sets of frequency hopping sequences: bounds and optimal constructions," *IEEE Trans. Inf. Theory* 2009 (https://cse.hkust.edu.hk/faculty/cding/JOURNALS/it092.pdf) [S]. Bluetooth's hop selection is not difference-set based [U].

**Costas arrays (radar and sonar frequency-hop waveforms).**
*Relation:* a Costas array is an n × n permutation in which all displacement vectors between dots are distinct, a 2-D "Golomb ruler" condition (λ ≤ 1 for vector differences). It is *not* a cyclic difference set. The Welch construction (dot at (i, g^i mod p), g a primitive root) and the Lempel–Golomb construction (α^i + β^j = 1 in GF(q)) use the same finite-field cyclic structure as Singer's theorem.
*Sources:* S. W. Golomb & H. Taylor, "Constructions and properties of Costas arrays," *Proc. IEEE* 72(9), 1143–1163, 1984. DOI 10.1109/PROC.1984.12994 [V]. J. P. Costas, *Proc. IEEE* 72(8), 996–1009, 1984 [U].

**Deterministic compressed sensing and Welch-bound codebooks.**
*How:* take the v × v DFT matrix and keep only the k rows indexed by a difference set. The inner product between two columns depends only on Σ_{d∈D} ω^{d t}, and the difference-set property makes |that|² = k − λ for every t ≠ 0. So *all* pairs of columns are equally, and minimally, correlated: the matrix meets the Welch bound with equality. Low, uniform coherence is what compressed-sensing recovery needs.
*Sources:* P. Xia, S. Zhou, G. B. Giannakis, "Achieving the Welch bound with difference sets," *IEEE Trans. Inf. Theory* 51(5), 1900–1907, 2005. DOI 10.1109/TIT.2005.846411; erratum 52, 3359, 2006 [S, DOI from UMN record]. Also "High resolution compressed sensing radar using difference set codes," arXiv:1605.05379 [S]. *Deployment:* research. Codebooks are used in MIMO beamforming feedback research [U].

**Interconnection networks (supercomputer topologies).**
*How:* the Erdős–Rényi (Brown) polarity graph of the projective plane PG(2, q) has q² + q + 1 routers, each of degree q + 1. Any two routers are at most 2 hops apart because any two lines share a point. That nearly meets the Moore bound. With a Singer set D, one standard model is: vertices ℤ_v, with x ~ y when x + y ∈ D [I, check against PolarFly §3]. The difference-set property gives "exactly one common neighbour."
*Source:* K. Lakhotia, M. Besta, L. Monroe, K. Isham, P. Iff, T. Hoefler, F. Petrini, "PolarFly: a cost-effective and flexible low-diameter topology," SC22, Nov 2022; arXiv:2208.01695 [S/V arXiv]. It claims more than 96% of the Moore bound at moderate radix. Code released via Intel/Zenodo [S]. Follow-up: PolarStar (arXiv:2302.07217) [S].

**Experimental design and round-robin scheduling.**
*How:* the v translates D + i are the "blocks" of a symmetric BIBD. With 7 treatments in blocks of 3 (translates of {0,1,3}), every pair of treatments is compared together exactly once. For people instead of treatments: 7 people meet in 7 groups of 3, and every pair meets exactly once. The same idea works for tasting panels and crop trials.
*Source:* R. C. Bose, "On the construction of balanced incomplete block designs," *Annals of Eugenics* 9, 353–399, 1939. DOI 10.1111/j.1469-1809.1939.tb02219.x [S]. It gives the "method of differences." Tournament and round-robin schedules more often use 1-factorizations or whist designs, so the link there is weaker [U].

**Hadamard-multiplexed measurement (spectroscopy, ion mobility).**
*How:* instead of opening a gate once per measurement, open it in an m-sequence pattern (about half the time). That collects about 50% of the signal instead of a few percent. The m-sequence's circulant "S-matrix" is easy to invert because of the two-level correlation.
*Sources:* M. Harwit & N. J. A. Sloane, *Hadamard Transform Optics*, Academic Press, 1979 [U]. B. H. Clowers, M. E. Belov et al., "Pseudorandom sequence modifications for ion mobility orthogonal time-of-flight mass spectrometry," *Anal. Chem.* 80(7), 2464–2473, 2008. DOI 10.1021/ac7022712 [V]. Lab instruments (PNNL), plus patent US10037873 (Agilent? "Automatic determination of demultiplexing matrix for IMS-MS") [U assignee].

---

## 3. Corrections and caveats for the brief

1. **"(273,191) code in DARC":** the standard (ITU-R BS.1194-2, Annex 1, §2.5) specifies the **shortened (272,190)** code. (273,191) is the parent Singer/Weldon code. NHK patents state both. Japanese teletext uses the same code, and ISDB-T TMCC uses a further-shortened (184,102) version.
2. **GPS codes are Gold codes**, sums of two Singer-type m-sequences. They are not difference sets themselves.
3. **Planar Singer sets are poor ±1 radio codes** for q ≥ 4. The off-peak value q² − 3q + 1 grows. Use them for 0/1 (on/off) applications, and use the q = 2 higher-dimensional Singer sets for ±1 signalling.
4. **Finite-geometry LDPC in CCSDS is Euclidean-geometry based**, not the Singer projective plane.
5. **RAID declustering** uses general block designs or permutations in products. No difference-set or projective-plane patent was found.
6. **Maekawa quorums and Camtepe–Yener keys** are well cited but not known to be deployed commercially. The wake-up schedule patent (US7747273B2) is the stronger "real" anchor for the "always overlap" lesson.
7. Barker codes and Costas arrays are related, aperiodic or 2-D cousins, **not** cyclic difference sets.

## 4. Items not verified in this session (check before publishing)
- IS-95 PN code periods. Wi-Fi/DVB scrambler polynomials.
- ARIB STD-B31 / ITU-R BT.1306 normative TMCC code text.
- CCSDS 131.0-B LDPC Blue Book details.
- Whether Chung–Salehi–Wei 1989 uses a projective-geometry construction.
- The commercial iPIX mask type. Any radio telescope actually laid out on a Singer ruler.
- The PolarFly paper's exact Singer-based description (§2.7 model is my statement of a standard fact).
- The Spacelab 2 mask is m-sequence based: inferred from 31×33 and 127×129 dimensions plus Goldwurm & Gros calling them "Hadamard," not read from Willmore et al. 1984.

## 5. Race charts (Lesson 24), added 2026-10-28

Pinewood Derby charts: heat j is D + j mod N, lane i gets car d_i + j. Each car runs once per lane for any D; cars a and b meet once per representation of b − a as a difference of D.

- **[V]** Stan Pope, "Mathematics of Perfect-N" (last changed 5/26/97) and "Combinatorial Theory" (6/3/97), originally at members.aol.com/standcmr and later stanpope.net (not reachable from the session; read in the mirror https://github.com/josephgeis/stan-pope-ppn). Perfect-N criteria: "Each car races in each lane the same number of times" and "Each car races each opponent the same number of times". Charts come from a "generator", the differences between car numbers in adjacent lanes, with each heat's lane-1 car one more than the last. Pope cites Hall's *Combinatorial Theory* (1967) and writes "Every symmetric Perfect-N chart which I had previously created can be replaced by an equivalent cyclic (v,k,l) block design". He thanks "Douglas J. Zare with a 'Cal Tech' E-Mail address" for pointing him to Hall.
- **[V]** Pope and Young, "Young and Pope" Pinewood Racing Charts (Partial Perfect-N generator, copyright 1998–2004). PPN: each car races the same number of times in each lane, and "no head-to-head matchup count exceeds another by more than 1". The concept came from Cory Young as "Enhanced Lane Rotation". Quote: "There are no known PPN (or better) charts for the following cases: 5 lanes: 20 and 22 cars; 6 lanes: 16, 17, 29, 30, 32, 33, and 34 cars."
- **[I]** The exhaustive search in `src/math/raceSearch.ts` finds no PPN rotation for exactly those cases, and the gaps for 7 lanes (14, 22, 23, 38, 40–47 cars) and 8 lanes (20, 28–30, 52–56, 58–60), up to 60 cars. A C version of the search agreed on all 385 windows.
- **[V]** DerbyNet (https://github.com/jeffpiazza/derbynet) builds rounds from generators in `website/inc/schedule_rough.inc` and `website/inc/generators/N-lanes.inc` (2, 3, 4, 5, 6, 8 lanes). The 4-lane, 13-car generator (2, 4, 12) gives {0, 2, 6, 5} = 2·{0, 1, 3, 9} mod 13; the second, (11, 9, 1), gives −2·{0, 1, 3, 9}. `schedule_ordered.inc` reorders heats to avoid "consecutive races for the same racer". DerbyNet's code does not name Pope or Perfect-N.
- **[V]** Ruby Quiz #56, "Pinewood Derby Chart" by Bob Showalter (mirror https://github.com/Sophrinix/rubyquiz-mirror/blob/master/rubyquiz/quiz56.html): "a sloping, multi-lane track (2-6 lanes is typical)".
- **[I]** A perfect one-pass chart (every lane full, each car once per lane, each pair λ times) has N heats and is a symmetric (N, k, λ) design; conversely any symmetric design gets lanes by König's edge-colouring theorem on the k-regular car–heat graph. So 43 cars on 7 lanes (order-6 plane), 22 on 7 lanes (BRC: N even, k − λ = 5 not a square) and 29 on 8 lanes (BRC: z² = 6x² + 2y² has only the zero solution) are impossible for any chart. 16 cars on 6 lanes is a biplane; {(0,1),(0,2),(0,3),(1,0),(2,0),(3,0)} is a (16, 6, 2) difference set in ℤ/4 × ℤ/4, checked by script, while no cyclic one exists.
- **[U]** Scouting Magazine (2015) and GrandPrix Race Manager pages describing Perfect-N and PPN; Wikipedia's "2 to 8 lanes". Not reachable from the session.
