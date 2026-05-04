# RYGO — Logo Asset Pack

Final identity files for **RYGO** — a minimalist daily logic-constraints puzzle at **playRYGO.com**.

## Specifications

| Element        | Value                                          |
|----------------|------------------------------------------------|
| Wordmark font  | **JetBrains Mono**, weight 600 (SemiBold)      |
| Tracking       | −0.02em                                         |
| Case           | RYGO (all caps)                                 |
| Mark           | Square stoplight, 2.5px stroke, 6px corner radius |
| Mark ratio     | 48 × 132 (width × height)                       |

The webfont is embedded directly into every SVG (as base64 woff2), so the SVGs render in JetBrains Mono in any browser, design tool, or print pipeline — no external font dependency. The PNGs were rasterized from those same self-contained SVGs.

### Color palette

| Token   | Hex       | Usage                          |
|---------|-----------|--------------------------------|
| Ink     | `#14110E` | Primary foreground / on-light  |
| Paper   | `#F5F3EE` | Primary background / on-dark   |
| Red     | `#D8463A` | Top signal dot                 |
| Yellow  | `#E6B73B` | Middle signal dot              |
| Green   | `#2E9D5C` | Bottom signal dot              |

---

## Files

### `svg/` — vector, scale-anywhere

- `rygo-lockup-light.svg` — primary lockup on Paper background
- `rygo-lockup-dark.svg` — primary lockup on Ink background
- `rygo-mark.svg` — stoplight mark only, ink stroke
- `rygo-mark-white.svg` — stoplight mark only, paper stroke (for dark)
- `rygo-wordmark.svg` — RYGO wordmark only, ink (font embedded)
- `rygo-wordmark-white.svg` — RYGO wordmark only, paper (font embedded)
- `rygo-app-icon.svg` — 1024 app icon, light
- `rygo-app-icon-dark.svg` — 1024 app icon, dark
- `rygo-share-card-dark.svg` / `rygo-share-card-light.svg` — 1200×630 OG card

### `png/` — rasterized for direct use

- `rygo-app-icon-1024.png` — App Store / Play Store
- `rygo-app-icon-1024-dark.png` — dark variant
- `rygo-app-icon-512.png` — generic
- `rygo-favicon-180.png` — `apple-touch-icon`
- `rygo-favicon-32.png` — standard favicon
- `rygo-favicon-16.png` — small favicon
- `rygo-share-card-dark.png` / `rygo-share-card-light.png` — `og:image` (1200×630)
- `rygo-lockup-light.png` / `rygo-lockup-dark.png` — embeddable lockup (1200×480)

---

## Web integration

```html
<link rel="icon"            type="image/png" sizes="32x32"   href="/rygo-favicon-32.png">
<link rel="icon"            type="image/png" sizes="16x16"   href="/rygo-favicon-16.png">
<link rel="apple-touch-icon"                  sizes="180x180" href="/rygo-favicon-180.png">

<meta property="og:title"   content="RYGO — Daily logic constraints">
<meta property="og:image"   content="https://playRYGO.com/rygo-share-card-dark.png">
<meta property="og:url"     content="https://playRYGO.com">
<meta name="twitter:card"   content="summary_large_image">
```

To use the wordmark on your own site, include JetBrains Mono in your CSS:

```css
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;600;700&display=swap');

.rygo-wordmark {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-weight: 600;
  letter-spacing: -0.02em;
}
```

---

## Usage rules

- **Clear space:** keep at least one mark-width of empty space around the lockup.
- **Minimum size:** lockup at 120px wide; mark alone at 24px.
- **Don't:** recolor the signal dots, stretch the mark, swap the typeface, or set the wordmark below weight 500.
- **On photography:** prefer the on-dark lockup over a darkened image, with a 60%+ opacity scrim if needed.

---

The interactive design canvas (`RYGO Logo.html` in the project root) remains as a working file — open it to revisit decisions or generate further variants via the Tweaks panel.
