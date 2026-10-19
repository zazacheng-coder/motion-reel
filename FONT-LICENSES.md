# Font licences

This project bundles Latin WOFF2 subsets of three typefaces, all under the SIL Open Font License 1.1. The full licence text is in [`OFL.txt`](./OFL.txt).

| Font | Used for | Copyright / source |
|---|---|---|
| **Space Grotesk** | Display, ticker, terrain | Copyright 2018 The Space Grotesk Project Authors — https://github.com/floriankarsten/space-grotesk |
| **Instrument Serif** (regular + italic) | "motion is a language.", "ready when you are.", "brief received." | Copyright 2022 The Instrument Serif Project Authors — https://github.com/Instrument/instrument-serif |
| **JetBrains Mono** | Spec rails, labels, numbers | Copyright 2020 The JetBrains Mono Project Authors — https://github.com/JetBrains/JetBrainsMono |

The WOFF2 files are Google Fonts' Latin subsets, used unmodified. They are loaded locally from `public/fonts/` through the `FontFace` API; no font is fetched from the network at render time.

If you redistribute the project or the film's project files, keep this notice and `OFL.txt` with the fonts.
