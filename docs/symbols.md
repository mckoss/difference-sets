# Symbol images

The 155 sticker images in `public/symbols/` (used by the deck maker and
Lesson 18) were generated locally with the Z-Image Turbo model via
ComfyUI, one image per name with a fixed seed, then shrunk to 256 px WebP.

Every image used the prompt template

> a single cute cartoon NAME, flat vector sticker icon, bold black outline,
> bright saturated colors, centered, isolated on a plain pure white
> background, no text, no shadow

A few images were regenerated after review with an adjusted prompt or seed.
The exact slug, name, seed, and prompt for every image are in
[`symbols-manifest.tsv`](symbols-manifest.tsv). The site reads
`public/symbols/manifest.json` (slug, name, file, theme); the 32 images marked
`vehicle` make up the deck maker's Vehicles theme, enough for a 31-card deck
with 6 pictures per card (q = 5) using vehicles only.

[`scripts/generate-symbols.sh`](../scripts/generate-symbols.sh) generates more
images with the same prompt template and seed scheme.

## Portraits

The deck maker's people themes use 134 cartoon portraits: 45 US presidents
(Donald Trump's is kept in the collection but marked `"deck": false`, so no
deck uses it), 47 classic Hollywood stars, and 42 scientists. In the manifest
their themes are `president`, `star`, and `scientist`, and each has a
`caption` drawn in small grey text under the picture; presidents are numbered
("16. Abraham Lincoln", "22 & 24. Grover Cleveland").

Portraits were made in one of two ways, and `symbols-manifest.tsv` records
which for each one:

- **From a text prompt** with Z-Image Turbo
  ([`scripts/portraits/from-text.sh`](../scripts/portraits/from-text.sh)),
  where the model knows the face well (Washington, Lincoln, Obama, Biden in
  aviator sunglasses, Chaplin, Monroe, Einstein, …). The template is

  > a cute cartoon caricature portrait of NAME, TITLE, head and shoulders,
  > HINT, recognizable likeness, flat vector sticker icon, bold black outline,
  > bright saturated colors, centered, isolated on a plain pure white
  > background, no text, no shadow

- **From a freely licensed photo** for less familiar faces
  ([`scripts/portraits/from-photo.sh`](../scripts/portraits/from-photo.sh)):
  the person's Wikipedia lead image, or a named Wikimedia Commons file, is
  used only if Commons marks it public domain or CC; SAM 3.1 crops it to the
  head, and Qwen-Image-Edit 2509 (20 steps) restyles it with the instruction

  > Turn this photo into a polished cartoon caricature sticker of the same
  > person, in the style of a detailed vector illustration: bold black
  > outlines, bright saturated colors with soft cel shading, a detailed
  > expressive face with shaded eyes and irises, eyebrows, nose, lips and
  > cheeks. Keep the face, hairstyle and clothing exactly as in the photo.
  > HINT. Head-and-shoulders bust only, centered, the bust ending in a smooth
  > rounded bottom edge like a die-cut sticker, fitting entirely inside the
  > frame with a white margin. Plain pure white background, no text.

  Hints such as "He is clean-shaven" fix details the model gets wrong.
  Telling it *not* to add a mustache made it add one, so hints say what is
  there instead.

Every portrait is then trimmed to its outline and centered on a white square
with a 4% margin, so all faces fill their slots alike.

### Photo sources and licenses

A portrait drawn from a photo is a derivative of it. Those from CC BY or
"Attribution" photos credit the source below; those from CC BY-SA photos are
shared under the same license as their source.

| Image | Person | Source photo | License |
|---|---|---|---|
| `202-john-adams.webp` | John Adams | [Gilbert Stuart, John Adams, c. 1800-1815, NGA 42933.jpg](https://commons.wikimedia.org/wiki/File:Gilbert_Stuart,_John_Adams,_c._1800-1815,_NGA_42933.jpg) | CC0 |
| `204-james-madison.webp` | James Madison | [James Madison.jpg](https://commons.wikimedia.org/wiki/File:James_Madison.jpg) | Public domain |
| `205-james-monroe.webp` | James Monroe | [James Monroe White House portrait 1819 (cropped)(2).jpg](https://commons.wikimedia.org/wiki/File:James_Monroe_White_House_portrait_1819_(cropped)(2).jpg) | Public domain |
| `206-john-quincy-adams.webp` | John Quincy Adams | [JQA Photo Crop (cropped).jpg](https://commons.wikimedia.org/wiki/File:JQA_Photo_Crop_(cropped).jpg) | Public domain |
| `209-william-henry-harrison.webp` | William Henry Harrison | [William Henry Harrison crop.jpg](https://commons.wikimedia.org/wiki/File:William_Henry_Harrison_crop.jpg) | Public domain |
| `210-john-tyler.webp` | John Tyler | [Tyler, John, by Healy (1842, NPG 2019 13) (cropped).jpg](https://commons.wikimedia.org/wiki/File:Tyler,_John,_by_Healy_(1842,_NPG_2019_13)_(cropped).jpg) | Public domain |
| `211-james-k-polk.webp` | James K. Polk | [James K. Polk restored (3x4 cropped).jpg](https://commons.wikimedia.org/wiki/File:James_K._Polk_restored_(3x4_cropped).jpg) | Public domain |
| `212-zachary-taylor.webp` | Zachary Taylor | [Zachary Taylor restored and cropped (3.5x4.5 cropped) (2).jpg](https://commons.wikimedia.org/wiki/File:Zachary_Taylor_restored_and_cropped_(3.5x4.5_cropped)_(2).jpg) | Public domain |
| `213-millard-fillmore.webp` | Millard Fillmore | [Millard Fillmore Better Crop (cropped).jpg](https://commons.wikimedia.org/wiki/File:Millard_Fillmore_Better_Crop_(cropped).jpg) | Public domain |
| `214-franklin-pierce.webp` | Franklin Pierce | [Mathew Brady - Franklin Pierce - alternate crop (cropped)(2).jpg](https://commons.wikimedia.org/wiki/File:Mathew_Brady_-_Franklin_Pierce_-_alternate_crop_(cropped)(2).jpg) | Public domain |
| `215-james-buchanan.webp` | James Buchanan | [James Buchanan (cropped).jpg](https://commons.wikimedia.org/wiki/File:James_Buchanan_(cropped).jpg) | Public domain |
| `217-andrew-johnson.webp` | Andrew Johnson | [Andrew Johnson photo portrait head and shoulders, c1870-1880-Edit1.jpg](https://commons.wikimedia.org/wiki/File:Andrew_Johnson_photo_portrait_head_and_shoulders,_c1870-1880-Edit1.jpg) | Public domain |
| `220-james-a-garfield.webp` | James A. Garfield | [James Abram Garfield, photo portrait seated.jpg](https://commons.wikimedia.org/wiki/File:James_Abram_Garfield,_photo_portrait_seated.jpg) | Public domain |
| `221-chester-a-arthur.webp` | Chester A. Arthur | [Chester A. Arthur by Abraham Bogardus (cropped) (2).jpg](https://commons.wikimedia.org/wiki/File:Chester_A._Arthur_by_Abraham_Bogardus_(cropped)_(2).jpg) | Public domain |
| `222-grover-cleveland.webp` | Grover Cleveland | [StephenGroverCleveland.jpg](https://commons.wikimedia.org/wiki/File:StephenGroverCleveland.jpg) | Public domain |
| `223-benjamin-harrison.webp` | Benjamin Harrison | [Pach Brothers - Benjamin Harrison (cropped) (cropped).jpg](https://commons.wikimedia.org/wiki/File:Pach_Brothers_-_Benjamin_Harrison_(cropped)_(cropped).jpg) | Public domain |
| `224-william-mckinley.webp` | William McKinley | [McKinley (cropped).jpg](https://commons.wikimedia.org/wiki/File:McKinley_(cropped).jpg) | Public domain |
| `227-woodrow-wilson.webp` | Woodrow Wilson | [Woodrow Wilson-H%26E.jpg](https://commons.wikimedia.org/wiki/File:Woodrow_Wilson-H%26E.jpg) | Public domain |
| `228-warren-g-harding.webp` | Warren G. Harding | [Warren G. Harding 1920s portrait (3x4 cropped).jpg](https://commons.wikimedia.org/wiki/File:Warren_G._Harding_1920s_portrait_(3x4_cropped).jpg) | Public domain |
| `229-calvin-coolidge.webp` | Calvin Coolidge | [President Calvin Coolidge, 1924 portrait photograph (3x4 cropped 2).jpeg](https://commons.wikimedia.org/wiki/File:President_Calvin_Coolidge,_1924_portrait_photograph_(3x4_cropped_2).jpeg) | Public domain |
| `230-herbert-hoover.webp` | Herbert Hoover | [President Hoover portrait.jpg](https://commons.wikimedia.org/wiki/File:President_Hoover_portrait.jpg) | Public domain |
| `235-lyndon-b-johnson.webp` | Lyndon B. Johnson | [Lyndon B. Johnson, photo portrait, color (3x4 cropped)(2).jpg](https://commons.wikimedia.org/wiki/File:Lyndon_B._Johnson,_photo_portrait,_color_(3x4_cropped)(2).jpg) | Public domain |
| `236-richard-nixon.webp` | Richard Nixon | [Richard Nixon presidential portrait (2).jpg](https://commons.wikimedia.org/wiki/File:Richard_Nixon_presidential_portrait_(2).jpg) | Public domain |
| `237-gerald-ford.webp` | Gerald Ford | [Gerald Ford presidential portrait (cropped).jpg](https://commons.wikimedia.org/wiki/File:Gerald_Ford_presidential_portrait_(cropped).jpg) | Public domain |
| `240-george-h-w-bush.webp` | George H. W. Bush | [George H. W. Bush presidential portrait (cropped) (2).jpg](https://commons.wikimedia.org/wiki/File:George_H._W._Bush_presidential_portrait_(cropped)_(2).jpg) | Public domain |
| `241-bill-clinton.webp` | Bill Clinton | [Bill Clinton.jpg](https://commons.wikimedia.org/wiki/File:Bill_Clinton.jpg) | Public domain |
| `252-buster-keaton.webp` | Buster Keaton | [Busterkeaton edit.jpg](https://commons.wikimedia.org/wiki/File:Busterkeaton_edit.jpg) | Public domain |
| `256-jean-harlow.webp` | Jean Harlow | [Harlow-publicity.jpg](https://commons.wikimedia.org/wiki/File:Harlow-publicity.jpg) | Public domain |
| `259-fred-astaire.webp` | Fred Astaire | [Astaire, Fred - Never Get Rich.jpg](https://commons.wikimedia.org/wiki/File:Astaire,_Fred_-_Never_Get_Rich.jpg) | Public domain |
| `261-shirley-temple.webp` | Shirley Temple | [Shirleytemple.jpg](https://commons.wikimedia.org/wiki/File:Shirleytemple.jpg) | Public domain |
| `265-katharine-hepburn.webp` | Katharine Hepburn | [Katharine Hepburn publicity photograph.jpg](https://commons.wikimedia.org/wiki/File:Katharine_Hepburn_publicity_photograph.jpg) | Public domain |
| `269-jimmy-stewart.webp` | Jimmy Stewart | [Annex - Stewart, James (Call Northside 777) 01.jpg](https://commons.wikimedia.org/wiki/File:Annex_-_Stewart,_James_(Call_Northside_777)_01.jpg) | Public domain |
| `270-gene-kelly.webp` | Gene Kelly | [Committee for Free Spain. Portrait of M. Woolf and Jack (possibly Captain Jack White) Taken for the Committee. (Includes photo of film star Gene Kelly). Sep 1946 Slide 2 Trim Edit.png](https://commons.wikimedia.org/wiki/File:Committee_for_Free_Spain._Portrait_of_M._Woolf_and_Jack_(possibly_Captain_Jack_White)_Taken_for_the_Committee._(Includes_photo_of_film_star_Gene_Kelly)._Sep_1946_Slide_2_Trim_Edit.png) | Public domain |
| `272-gregory-peck.webp` | Gregory Peck | [Gregory Peck 1948.jpg](https://commons.wikimedia.org/wiki/File:Gregory_Peck_1948.jpg) | Public domain |
| `276-grace-kelly.webp` | Grace Kelly | [Grace Kelly 1956 (cropped).jpg](https://commons.wikimedia.org/wiki/File:Grace_Kelly_1956_(cropped).jpg) | CC BY 4.0 |
| `279-doris-day.webp` | Doris Day | [DorisDay-midnightlace-full.jpg](https://commons.wikimedia.org/wiki/File:DorisDay-midnightlace-full.jpg) | Public domain |
| `280-natalie-wood.webp` | Natalie Wood | [Natalie Wood Allan Warren.jpg](https://commons.wikimedia.org/wiki/File:Natalie_Wood_Allan_Warren.jpg) | CC BY-SA 3.0 |
| `281-rock-hudson.webp` | Rock Hudson | [Rock Hudson in 1954.jpg](https://commons.wikimedia.org/wiki/File:Rock_Hudson_in_1954.jpg) | Public domain |
| `282-marlon-brando.webp` | Marlon Brando | [Marlon Brando publicity for One-Eyed Jacks.png](https://commons.wikimedia.org/wiki/File:Marlon_Brando_publicity_for_One-Eyed_Jacks.png) | Public domain |
| `287-lena-horne.webp` | Lena Horne | [Lena Horne, 1946.jpg](https://commons.wikimedia.org/wiki/File:Lena_Horne,_1946.jpg) | Public domain |
| `288-steve-mcqueen.webp` | Steve McQueen | [Steve-McQueen-1968 (cropped).jpg](https://commons.wikimedia.org/wiki/File:Steve-McQueen-1968_(cropped).jpg) | Public domain |
| `291-charlton-heston.webp` | Charlton Heston | [CharltonHestonCivilRightsMarch1963Retouched.jpg](https://commons.wikimedia.org/wiki/File:CharltonHestonCivilRightsMarch1963Retouched.jpg) | Public domain |
| `296-bruce-lee.webp` | Bruce Lee | [Bruce Lee as Chen Zhen (4x5 cropped).jpg](https://commons.wikimedia.org/wiki/File:Bruce_Lee_as_Chen_Zhen_(4x5_cropped).jpg) | Public domain |
| `301-richard-feynman.webp` | Richard Feynman | [RichardFeynman-PaineMansionWoods1984 copyrightTamikoThiel bw.jpg](https://commons.wikimedia.org/wiki/File:RichardFeynman-PaineMansionWoods1984_copyrightTamikoThiel_bw.jpg) | CC BY-SA 3.0 |
| `303-j-robert-oppenheimer.webp` | J. Robert Oppenheimer | [Oppenheimer (cropped).jpg](https://commons.wikimedia.org/wiki/File:Oppenheimer_(cropped).jpg) | Public domain |
| `304-enrico-fermi.webp` | Enrico Fermi | [Enrico Fermi 1943-49.jpg](https://commons.wikimedia.org/wiki/File:Enrico_Fermi_1943-49.jpg) | Public domain |
| `305-niels-bohr.webp` | Niels Bohr | [Niels Bohr.jpg](https://commons.wikimedia.org/wiki/File:Niels_Bohr.jpg) | Public domain |
| `306-edward-teller.webp` | Edward Teller | [EdwardTeller1958 fewer smudges.jpg](https://commons.wikimedia.org/wiki/File:EdwardTeller1958_fewer_smudges.jpg) | CC BY-SA 3.0 |
| `307-leo-szilard.webp` | Leo Szilard | [Leo Szilard-cropped.png](https://commons.wikimedia.org/wiki/File:Leo_Szilard-cropped.png) | Public domain |
| `308-hans-bethe.webp` | Hans Bethe | [Hans Bethe.jpg](https://commons.wikimedia.org/wiki/File:Hans_Bethe.jpg) | Attribution |
| `309-john-von-neumann.webp` | John von Neumann | [JohnvonNeumann-LosAlamos.gif](https://commons.wikimedia.org/wiki/File:JohnvonNeumann-LosAlamos.gif) | Attribution |
| `310-ernest-lawrence.webp` | Ernest Lawrence | [Ernest Lawrence.jpg](https://commons.wikimedia.org/wiki/File:Ernest_Lawrence.jpg) | Public domain |
| `311-glenn-seaborg.webp` | Glenn Seaborg | [Glenn Seaborg - 1964.jpg](https://commons.wikimedia.org/wiki/File:Glenn_Seaborg_-_1964.jpg) | Public domain |
| `312-lise-meitner.webp` | Lise Meitner | [Lise Meitner NatGeo.jpg](https://commons.wikimedia.org/wiki/File:Lise_Meitner_NatGeo.jpg) | Public domain |
| `313-stanislaw-ulam.webp` | Stanislaw Ulam | [Stanislaw Ulam.tif](https://commons.wikimedia.org/wiki/File:Stanislaw_Ulam.tif) | Attribution |
| `314-chien-shiung-wu.webp` | Chien-Shiung Wu | [Chien-shiung Wu (1912-1997) C.jpg](https://commons.wikimedia.org/wiki/File:Chien-shiung_Wu_(1912-1997)_C.jpg) | No restrictions |
| `315-marie-curie.webp` | Marie Curie | [Marie Curie c. 1920s.jpg](https://commons.wikimedia.org/wiki/File:Marie_Curie_c._1920s.jpg) | Public domain |
| `321-stephen-hawking.webp` | Stephen Hawking | [Stephen Hawking.StarChild.jpg](https://commons.wikimedia.org/wiki/File:Stephen_Hawking.StarChild.jpg) | Public domain |
| `322-carl-sagan.webp` | Carl Sagan | [Carl Sagan Planetary Society.JPG](https://commons.wikimedia.org/wiki/File:Carl_Sagan_Planetary_Society.JPG) | Public domain |
| `323-alan-turing.webp` | Alan Turing | [Alan turing header.jpg](https://commons.wikimedia.org/wiki/File:Alan_turing_header.jpg) | Public domain |
| `324-ada-lovelace.webp` | Ada Lovelace | [Ada Lovelace daguerreotype by Antoine Claudet 1843 - cropped.png](https://commons.wikimedia.org/wiki/File:Ada_Lovelace_daguerreotype_by_Antoine_Claudet_1843_-_cropped.png) | Public domain |
| `325-grace-hopper.webp` | Grace Hopper | [Commodore Grace M. Hopper, USN (covered) head and shoulders crop.jpg](https://commons.wikimedia.org/wiki/File:Commodore_Grace_M._Hopper,_USN_(covered)_head_and_shoulders_crop.jpg) | Public domain |
| `326-rosalind-franklin.webp` | Rosalind Franklin | [Rosalind Franklin (retouched).jpg](https://commons.wikimedia.org/wiki/File:Rosalind_Franklin_(retouched).jpg) | CC BY-SA 4.0 |
| `327-louis-pasteur.webp` | Louis Pasteur | [Louis Pasteur, foto av Paul Nadar, Crisco edit.jpg](https://commons.wikimedia.org/wiki/File:Louis_Pasteur,_foto_av_Paul_Nadar,_Crisco_edit.jpg) | Public domain |
| `330-nicolaus-copernicus.webp` | Nicolaus Copernicus | [Nikolaus Kopernikus MOT.jpg](https://commons.wikimedia.org/wiki/File:Nikolaus_Kopernikus_MOT.jpg) | Public domain |
| `331-michael-faraday.webp` | Michael Faraday | [Michael Faraday sitting crop.jpg](https://commons.wikimedia.org/wiki/File:Michael_Faraday_sitting_crop.jpg) | Public domain |
| `332-james-clerk-maxwell.webp` | James Clerk Maxwell | [James-Clerk-Maxwell-1831-1879.jpg](https://commons.wikimedia.org/wiki/File:James-Clerk-Maxwell-1831-1879.jpg) | Public domain |
| `333-max-planck.webp` | Max Planck | [Max Planck by Hugo Erfurth 1938cr - restoration1.jpg](https://commons.wikimedia.org/wiki/File:Max_Planck_by_Hugo_Erfurth_1938cr_-_restoration1.jpg) | Public domain |
| `334-werner-heisenberg.webp` | Werner Heisenberg | [Werner Heisenberg Portrait (3x4 cropped).jpg](https://commons.wikimedia.org/wiki/File:Werner_Heisenberg_Portrait_(3x4_cropped).jpg) | CC BY-SA 3.0 de |
| `336-paul-dirac.webp` | Paul Dirac | [Paul Dirac, 1933.jpg](https://commons.wikimedia.org/wiki/File:Paul_Dirac,_1933.jpg) | Public domain |
| `337-carl-friedrich-gauss.webp` | Carl Friedrich Gauss | [Carl Friedrich Gauss 1840 by Jensen.jpg](https://commons.wikimedia.org/wiki/File:Carl_Friedrich_Gauss_1840_by_Jensen.jpg) | Public domain |
| `338-leonhard-euler.webp` | Leonhard Euler | [Leonhard Euler - Jakob Emanuel Handmann (Kunstmuseum Basel).jpg](https://commons.wikimedia.org/wiki/File:Leonhard_Euler_-_Jakob_Emanuel_Handmann_(Kunstmuseum_Basel).jpg) | Public domain |
| `339-emmy-noether.webp` | Emmy Noether | [Emmy Noether (3x4 cropped).jpg](https://commons.wikimedia.org/wiki/File:Emmy_Noether_(3x4_cropped).jpg) | Public domain |
| `340-srinivasa-ramanujan.webp` | Srinivasa Ramanujan | [Srinivasa Ramanujan-Add. MS a94 version2 (cropped).jpg](https://commons.wikimedia.org/wiki/File:Srinivasa_Ramanujan-Add._MS_a94_version2_(cropped).jpg) | CC BY 4.0 |
| `342-katherine-johnson.webp` | Katherine Johnson | [Katherine Johnson 1983.jpg](https://commons.wikimedia.org/wiki/File:Katherine_Johnson_1983.jpg) | Public domain |
