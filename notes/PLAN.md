# BUILD PLAN — design reconstruction inside `Raja Sahoo.dc.html`

## User's answers (m0153)
- **Structure:** expand the existing portfolio — one continuous document, each chapter grows into its full process narrative.
- **Screens:** MIX — rebuild the hero screens per project from each PRD's own design system; labelled `image-slot` placeholders for secondary screens.
- **Depth:** ten stages for the flagships, six for the rest. Flagships (freeform answer, the considered one): **Vidwan · CureCall · Gharbar · Mira**. Six for **Servora**. Six brand-specific stages for **Jai Mata Di** (prompt forbids forcing an app-UX process on it).
- **Sketch style:** option 1 — *graphite on warm paper*: soft double-stroked boxes (a 1.6px line with a 0.7px ghost offset 1.5px), hand-curved arrows, an elliptical circled note. No fake handwriting of the user's hand.
- **Interaction:** scroll-driven — diagrams draw themselves, screens assemble as you read.
- **Glow / Nearby Salon OS:** left out.
- **Audience:** product design hiring managers in India · global product companies · founders & startup teams.
- Nothing added in the freeform beyond restating the picks → **invent no role claims, no outcomes, no metrics, no research.**

## Existing file anatomy (2681 lines)
`<helmet>` (fonts + full CSS system) → `<header data-screen-label="Nav">` → hero → point of view → `#work` opener → six `<article>` chapters → `#thinking` → `#about` → `#playground` → `#contact` → logic class.

**Line anchors (pre-edit):** helmet 1–147 · nav 149 · hero 165 · POV 204 · work 218 · JMD 273 · Vidwan 454 · Servora 1097 · CureCall 1325 · Gharbar 1584 · Mira 1902 · thinking 2103 · about 2117 · playground 2147 · contact 2162 · logic 2180+.

### Palette
Canvas `#F2F0EB` · ink `#171714` · rule `#D3CFC4` · link/accent `#A63A1B` · muted `#948E84` · dark ground `#171714` on `#F2F0EB` text.
Chapter accents & grounds:
| # | Project | accent | cover ground | deep ground(s) |
|---|---|---|---|---|
| 01 | Jai Mata Di | `#B4C400` (chip ink `#101010`) | `#101010` / cream `#F0EFE9` | — |
| 02 | Vidwan | `#CE9A3F`, ink `#7A4E0E` / `#8A5A12` | `#F6EFDF`, card `#FBF6EA` | `#14201E`+`#E9E5DA`, `#F3F0E7` |
| 03 | Servora | `#7A5A0A`, alt `#5E6A12` | `#EDEEE1` | `#131512`+`#E4E2D6` |
| 04 | CureCall | `#1B5A70`, ink `#0F4757` / `#0E3341` | light `#F6F4EF` | `#E3EAEC`+`#10333F` |
| 05 | Gharbar | `#C0391F`, glow `#E4553C` | `#12101A`+`#EDEAE4` | `#0C0B10` |
| 06 | Mira | `#7A5A42` | `#F7F2EC` | `#EFEAE4`+`#2A2521` |

### Type
`Archivo` variable (`font-variation-settings:'wdth' 84–116`, weights 400–700) for display + UI · `Newsreader` serif (`'opsz' 48–72`, weight 200–300) for reflective pull-quotes · `IBM Plex Mono` 9–11px, `letter-spacing .14–.2em`, uppercase for eyebrows/labels · `Caveat` 20–21px, rotated ≈−1deg, in the chapter accent, used **sparingly** as a margin note.

### Attribute vocabulary already implemented in the helmet CSS + logic
**Reveal (driven by a scroll sweep that strips `.pre`; collection = `[data-in],[data-draw],[data-mark]`):** `data-in="up|far|calm|rise|clip|soft"`, `data-in-delay="ms"`, `data-stagger="ms"` on a container, `data-draw` (scaleX rule), `data-mark` (highlighter sweep, gets `.on`).
**Process artifacts:** `data-sketch` + `data-sketch-note` · `data-wire` + `data-wire-label` · `data-note` (sticky, tweakable off) · `data-why` + `data-why-line` + `data-why-target` · `data-compare` + `data-compare-before` + `data-compare-handle` (+`data-compare-init`) · `data-steps` + `data-step-go` + `data-step-panel` (+`data-on-bg`) · `data-drag` (kinetic scroller) · `data-evidence` (label, tweakable off).
**Vector motion:** `data-dash` (`--len`, redraws on hover / `svg:hover`) · `data-grow` / `data-growx` · `data-flow` (marching dashes) · `data-node` (hover isolate) · `data-orbit` / `data-spin` / `data-pulse` / `data-drift`.
**Micro:** `data-say` (rising text, needs `<i>`) · `data-swap` (two `<u>`) · `data-lift` · `data-bloom` · `data-hov` (+`data-hov-title`, `data-hov-line`, `data-tag`, `data-frame`) · `data-arrow` · `data-magnet` · `data-cursor="LABEL"` · `data-tilt` · `data-copy` · `data-hold` (collapsible chapter body) · `image-slot` for user drops.
**Logic:** `toggleProject(key)` per chapter (`tapGym|tapVidwan|tapServora|tapCurecall|tapGharbar|tapMira`, `isX`, `ctaX`, `rowsX`); `_holdReveal` re-runs reveals inside a chapter when it opens; attendance demo state (`students`, `absent`, `taps`, `close`, `reset`).
**Props:** `evidenceLabels`, `stickyNotes` (booleans, applied to the DOM in `_applyProps`).

## NEW hook needed for scroll-driven drawing
`data-ink` used **together with** `data-in` (so the existing sweep manages it): `.pre` → `stroke-dashoffset: var(--len)`, released → `0`, transition ≈1.5s. Same trick for `data-rise` (scaleY from bottom) and `data-wipe` (clip-path inset). Add to the helmet CSS only — no logic change required, because the sweep already collects every `[data-in]`.

## The ten stations (flagships)
01 Problem framing · 02 User model · 03 Journey · 04 Information architecture · 05 Flow · 06 Rough exploration (graphite) · 07 Low-fidelity structure (grayscale) · 08 High-fidelity direction · 09 Interaction prototype · 10 Final interface.
**Six (Servora):** problem framing · user model · flow · graphite · lo-fi · final.
**Six (Jai Mata Di, brand):** the brief · identity system · typographic voice · photography direction · scroll storyboard · conversion path.

## Honesty rules (from the brief, non-negotiable)
- Section label: **"RECONSTRUCTED DESIGN EXPLORATION"** with a standing line: *reconstructed from the product requirements document, not recovered from an archive.*
- Any user model carries **"DESIGN MODEL — RECONSTRUCTED FROM PRODUCT REQUIREMENTS"**.
- Never label anything an interview, a research finding, a usability test, a client comment or a metric that isn't in the source.
- Every artifact must be traceable to a named section of the supplied PRD → carry a `data-evidence` chip citing it (e.g. "Vidwan PRD §09 · default-present").
- Incomplete source → a clearly labelled placeholder (`image-slot` with a real instruction).

## Per-project load-bearing constraint (the spine of each narrative)
- **Vidwan** — the parent never installs anything. (Also: default-present attendance; reports generated, never authored; two money flows that never share a ledger.)
- **Servora** — tap how full, never weigh. (Traffic light = days left, not amount.)
- **CureCall** — AI assists, the doctor decides. (The safety gate is computed once and travels with the patient.)
- **Gharbar** — the address is a separate gated table. (Bone paper only for the invitation and the pass.)
- **Mira** — never grade. (Confidence is default, critique is opt-in; the face never leaves the phone.)
- **Jai Mata Di** — strength is devotion. (Bilingual naming; one job: book a trial.)
