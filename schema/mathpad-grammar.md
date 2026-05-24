# Mathpad Grammar — v1.0.0-draft (Sarmate.net)

**Status:** Draft for the new mathpad engine on sarmate.net.
**Locked perimeter:** 2026-05-12.
**Formal freeze date target:** 2027-03-31 (no breaking changes after).

This document is the single source of truth for the set of `mp-*` tags supported by mathpad on sarmate.net. It serves two audiences:

- **Human editors** writing courses via `mathpad_php_edit.php` (menus, shortcuts). They write a *flat* document; the runtime auto-completes the missing structure.
- **LLM converters** (DOCX/ODT/TeX → mathpad HTML). They produce the *full* structure with `id` attributes and references.

---

## 1. Conventions

- All custom tags are prefixed `mp-*`.
- All tag names and attribute values are **English, long form** (`mp-theorem`, not `mp-theo`).
- Localized labels (e.g. "Théorème 3" vs "Theorem 3") are computed at render time from the `lang` attribute of the root, or from `navigator.language` as a fallback.
- Attribute booleans use the HTML5 convention: presence = true, absence = false (e.g. `<mp-theorem roc>`).
- IDs are optional in source. Missing IDs are auto-generated at runtime as `mp-{tag}-{n}`, where `n` is the position-based number.

---

## 2. Document model overview

A mathpad document is a tree of nested sectioning elements containing block elements containing inline elements. All sectioning levels are *optional* — the runtime injects implicit wrappers where missing.

```
mp-course               (root, optional — auto-injected around <body> if absent)
├── mp-meta             (optional, but recommended)
└── mp-chapter*         (optional — single implicit chapter if absent)
    └── mp-section*     (optional — single implicit section per chapter)
        └── mp-subsection*
            └── [block content]
                └── [inline content]
```

For LLM-generated content: **always emit the full structure with IDs**.
For human-written content: **emit only what's relevant** — runtime fills the rest.

---

## 3. Tag categories

### 3.1 Sectioning

| Tag | Numbered | Auto-injectable | Notes |
|---|---|---|---|
| `mp-course` | — | yes | Root. Holds metadata. |
| `mp-meta` | — | — | Metadata block, child of `mp-course` only. |
| `mp-chapter` | yes (I, II, …) | yes | Top-level division. |
| `mp-section` | yes (1, 2, …) | yes | Maps to "paragraphe" in the old grammar. |
| `mp-subsection` | yes (1.1, 1.2, …) | — | Maps to "subparagraphe". |
| `mp-title` | — | — | Title of the *enclosing* sectioning element. First child. |

#### Attributes (sectioning)

All sectioning tags accept:

| Attr | Type | Required | Notes |
|---|---|---|---|
| `id` | string | optional | Stable anchor for cross-references. Auto-generated if absent. |
| `lang` | BCP-47 string | optional on `mp-course` only | E.g. `fr`, `en`, `de`. Defaults to navigator language. |

#### Example

```html
<mp-course lang="en">
  <mp-meta>
    <mp-doc-title>Sequences — Limits and Convergence</mp-doc-title>
    <mp-author>F. Frattini</mp-author>
    <mp-level>terminale-spe</mp-level>
    <mp-subject>mathematics</mp-subject>
    <mp-tag>sequences</mp-tag>
    <mp-tag>limits</mp-tag>
  </mp-meta>

  <mp-chapter id="ch-convergence">
    <mp-title>Convergence of a Sequence</mp-title>

    <mp-section id="sec-definition">
      <mp-title>Definition</mp-title>
      <!-- block content -->
    </mp-section>
  </mp-chapter>
</mp-course>
```

> Note: `mp-doc-title` (used inside `mp-meta`) is distinct from `mp-title` (used as first child of sectioning elements) to avoid ambiguity.

### 3.2 Metadata children (inside `mp-meta` only)

| Tag | Cardinality | Value type |
|---|---|---|
| `mp-doc-title` | 1 | text |
| `mp-author` | 0..n | text |
| `mp-level` | 0..1 | enum: `college-6e`..`college-3e`, `lycee-2nde`, `lycee-1ere`, `terminale-spe`, `terminale-comp`, `bts`, `prepa`, `universite`, `autre` |
| `mp-subject` | 0..1 | enum: `mathematics`, `physics`, `chemistry`, `biology`, `cs`, `other` |
| `mp-tag` | 0..n | text (one tag per element) |
| `mp-cover-image` | 0..1 | attribute `src="…"` |
| `mp-description` | 0..1 | text (short description for SEO/listing) |

### 3.3 Formal blocks (numbered, math-style)

These are the canonical "boxed" elements of a math course. They share a common label-and-body visual pattern (see Section 5).

| Tag | Label (en/fr) | Notes |
|---|---|---|
| `mp-definition` | Definition / Définition | |
| `mp-theorem` | Theorem / Théorème | Accepts `roc` boolean |
| `mp-property` | Property / Propriété | Accepts `roc` boolean |
| `mp-proposition` | Proposition / Proposition | Accepts `roc` boolean. **Distinct from `mp-property`**: a proposition is a provable statement hierarchically between lemma and theorem. |
| `mp-lemma` | Lemma / Lemme | |
| `mp-corollary` | Corollary / Corollaire | |
| `mp-remark` | Remark / Remarque | |
| `mp-method` | Method / Méthode | Step-by-step procedure. New in v1. |
| `mp-warning` | Warning / Attention | Common pitfall. New in v1. Distinct from `mp-remark`. |

#### Attributes (formal blocks)

| Attr | Type | Notes |
|---|---|---|
| `id` | string | Optional anchor. |
| `name` | string | Optional mathematical name (e.g., "Cauchy-Schwarz", "Pythagoras"). Rendered after the label. |
| `roc` | boolean | Only on `mp-theorem`, `mp-property`, `mp-proposition`. "Restituer Organisée des Connaissances" — flags the result as required reproducible knowledge. Renders a "ROC" badge. |
| `numbering` | enum: `auto` (default), `none`, `manual` | Controls numbering. With `manual`, the number is read from a `data-num` attribute. |

#### Content model

Block-level content: paragraphs, lists, math, inline content. May contain other formal blocks only via `mp-proof` (see below).

#### Example

```html
<mp-theorem id="th-mvt" name="Mean Value Theorem" roc>
  Let $f$ be continuous on $[a,b]$ and differentiable on $(a,b)$. Then there
  exists $c \in (a,b)$ such that $f(b) - f(a) = f'(c)(b-a)$.
</mp-theorem>
```

### 3.4 Proof block

| Tag | Notes |
|---|---|
| `mp-proof` | Proof of an immediately preceding theorem/property/proposition/lemma. Renders with "Proof." prefix and ∎ at the end. |

```html
<mp-theorem id="th-1">…</mp-theorem>
<mp-proof of="th-1">
  …
</mp-proof>
```

The `of` attribute is optional but recommended (LLM should emit it). Without it, the proof binds to the immediately previous formal block.

### 3.5 Pedagogical blocks

| Tag | Label | Numbered | Notes |
|---|---|---|---|
| `mp-example` | Example | yes | |
| `mp-exercise` | Exercise | yes | May contain `mp-statement` and `mp-correction` children. |
| `mp-activity` | Activity | yes | Guided discovery activity. |
| `mp-quiz` | Quiz | yes | Single-question multiple-choice with immediate feedback. See below. |

#### `mp-exercise` attributes

| Attr | Type | Notes |
|---|---|---|
| `id` | string | |
| `difficulty` | integer 1..3 | Renders 1-3 stars. |
| `duration` | string | E.g. `"10min"`, `"30min"`. |
| `topics` | space-separated strings | E.g. `"sequences induction"`. |

#### `mp-exercise` content

Two valid forms:

**Form A (implicit):** all content is the statement; `<mp-correction>` (if present) is the correction.

```html
<mp-exercise difficulty="2" duration="15min">
  Compute $\lim_{n \to \infty} \frac{1}{n}$.
  <mp-correction>The limit is $0$ because…</mp-correction>
</mp-exercise>
```

**Form B (explicit):** statement and correction in separate children.

```html
<mp-exercise difficulty="2" duration="15min">
  <mp-statement>Compute $\lim_{n \to \infty} \frac{1}{n}$.</mp-statement>
  <mp-correction>The limit is $0$ because…</mp-correction>
</mp-exercise>
```

LLM converters should emit Form B (more explicit). Human editors may use either.

`<mp-correction>` may also appear standalone outside any `<mp-exercise>` for in-line corrections of subparts.

#### `mp-quiz`

Interactive single-question multiple-choice quiz with immediate feedback,
auto-numbered per chapter (Quiz 1, 2…). It contains exactly one `<mp-question>`
followed by two or more `<mp-answer>`; mark every correct option with the
boolean `correct` attribute. Both children are KaTeX-friendly.

| Attr | Type | Notes |
|---|---|---|
| `multiple` | boolean | Multi-select (checkbox semantics + a *Validate* button). Without it, single-select: the first click reveals the result and locks the quiz. |
| `shuffle` | boolean | Randomize answer order on each page load. |
| `numbering` | enum: `auto` (default), `none` | Opt out of numbering with `none`. |

`<mp-answer>` carries the boolean `correct` attribute on each valid option — a
single-select quiz expects exactly one, a `multiple` quiz accepts any subset.

```html
<mp-quiz>
  <mp-question>What is the sign of $-(-3)^2$ ?</mp-question>
  <mp-answer correct>Negative</mp-answer>
  <mp-answer>Positive</mp-answer>
  <mp-answer>Zero</mp-answer>
</mp-quiz>
```

### 3.6 Generic containers

| Tag | Notes |
|---|---|
| `mp-box` | Generic visual container. Replaces old `cadre` / `framed` / `gris`. |
| `mp-figure` | Wraps an image (or canvas/graph) and its caption. |
| `mp-caption` | Caption for a `mp-figure`. |

#### `mp-box` attributes

| Attr | Type | Notes |
|---|---|---|
| `style` | enum: `accent` (default), `grey`, `info`, `subtle` | Visual variant. |
| `id` | string | Optional. |

#### `mp-figure` example

```html
<mp-figure id="fig-derivative">
  <img src="derivative.svg" alt="Geometric interpretation of the derivative" />
  <mp-caption>The derivative as the slope of the tangent.</mp-caption>
</mp-figure>
```

### 3.7 Interactive elements

| Tag | Notes |
|---|---|
| `mp-blank` / `pause` | "Trou" — hidden content revealed by step-by-step navigation. Both tags supported (`<pause>` = legacy short form, kept because LLM converters don't generate these — they're added by humans in the editor). Single-click navigation buttons step ±1, fast navigation buttons step ±10. Each fill/empty action triggers a smooth scroll to the affected blank and a 1-second highlight. |
| `mp-checkbox` | Checkbox + label. The element's **inner content is the label**. State persisted via localStorage per URL. ⚠ Never use self-closing `<mp-checkbox/>` — HTML parsers will eat the surrounding text. |
| `mp-ref` | Cross-reference to another element by `id`. |

#### `mp-ref` attributes

| Attr | Type | Required | Notes |
|---|---|---|---|
| `target` | string | yes | The `id` of the referenced element. |
| `format` | enum: `number` (default), `label`, `name`, `full` | Optional | What to render: just the number ("3"), label only ("Theorem"), the mathematical name ("Cauchy-Schwarz"), or full ("Theorem 3: Cauchy-Schwarz"). |

```html
By <mp-ref target="th-mvt" format="full"/>, there exists…
```

### 3.8 Code blocks

`mp-code` runs Python via Skulpt. No other language is supported in v1.

| Attr | Type | Notes |
|---|---|---|
| `runnable` | boolean | If present, renders a "Run" button and output zone. |
| `editable` | boolean (default: true) | If `false`, code is read-only. |
| `width` | integer (px) | Optional editor width. |
| `height` | integer (px) | Optional editor height. |
| `theme` | string | CodeMirror theme. Default `neat`. |

#### Example

```html
<mp-code runnable width="500" height="300">
  for i in range(10):
      print(i)
</mp-code>
```

Skulpt supports turtle and pygame. They are auto-detected and the matching canvas appears under the editor when present in the code.

### 3.8a Aligned equation chains (`mp-align`)

For chained equations or inequalities where columns must align vertically (e.g. step-by-step proofs of inequalities). LaTeX `align`-like syntax — preferred over LaTeX environments because it permits `<pause>` inline inside cells.

| Attr | Type | Notes |
|---|---|---|
| `id` | string | Optional anchor. |

**Syntax**:
- Each line (separated by `\n`) is a row.
- Cells within a row are separated by `&`.
- First cell of each row = optional **prefix** (right-aligned, e.g. `⇒`, `\Leftrightarrow`, or empty).
- If a row has more than 3 cells, the **last cell** is rendered as a comment (italic, muted, left-aligned).
- Other cells are centered, with the 2nd cell of each row right-aligned for numeric column alignment.

**Example** (from a typical Terminale Spé proof):

```html
<mp-align>
  & $0$ & $\leq$ & $u_{n+1}$ & $\leq$ & $u_n$ & $\leq$ & $1$ & par hypothèse de récurrence
  & $f(0)$ & $\leq$ & $f(u_{n+1})$ & $\leq$ & $f(u_n)$ & $\leq$ & $f(1)$ & car $f$ est croissante sur $[0,1]$
  & $0$ & $\leq$ & $u_{n+2}$ & $\leq$ & $u_{n+1}$ & $\leq$ & $\dfrac{4}{15}$ & par définition de $(u_n)$
  $\Rightarrow$ & $0$ & $\leq$ & $u_{n+2}$ & $\leq$ & $u_{n+1}$ & $\leq$ & $1$ & car $\dfrac{4}{15} < 1$
</mp-align>
```

**With pauses** (progressive reveal of key steps):

```html
<mp-align>
  & $u_{n+1} - u_n$ & $=$ & <pause>$f(u_n) - u_n$</pause> & & par définition
  & & $=$ & <pause>$\dfrac{u_n}{1+u_n} - u_n$</pause> & & en remplaçant $f(u_n)$
  & & $=$ & <pause>$\dfrac{-u_n^2}{1+u_n}$</pause> & & en mettant au même dénominateur
</mp-align>
```

### 3.8b Spreadsheets (`mp-spreadsheet`)

Excel-like grid with formulas. State is persisted in the `data-state` attribute as JSON, so saving the cours HTML round-trips the spreadsheet content.

| Attr | Type | Default | Notes |
|---|---|---|---|
| `rows` | integer | 10 | Number of data rows. |
| `cols` | integer | 10 | Number of data columns (A, B, C…). |
| `max-height` | integer (px) | 350 | Vertical scroll threshold (container becomes scrollable beyond this). |
| `data-state` | JSON string | `{}` | Cell values and colors. Source of truth after first save. |
| `id` | string | auto | Stable anchor. |

#### Supported formulas

- Cell references: `A1`, `$A1`, `A$1`, `$A$1` (with `$` for absolute reference, preserved during drag-fill)
- Functions: `SOMME(A1:A5)`, `MOYENNE(A1:A5)`, `MIN(A1:A5)`, `MAX(A1:A5)`, `NB(A1:A5)`
- Arguments separated by `;` or `:`
- All standard arithmetic operators `+ - * / ( )`

#### Interactive features

- **Drag-fill**: small green square at the bottom-right corner of the focused cell. Drag down/right (or up/left) to copy the formula with relative reference shifting.
- **Click-to-reference**: while editing a formula starting with `=`, clicking another cell inserts its reference at the cursor.
- **Touch support**: works on mobile (touchstart / touchmove / touchend).

#### Two ways to write initial content

**Option A — JSON in `data-state` (machine-friendly, compact)**:

```html
<mp-spreadsheet rows="5" cols="3"
  data-state='{"cells":{"A1":"x","B1":"x²","A2":"2","B2":"=A2*A2"},"colors":{"A1":"#e3f2fd","B1":"#e3f2fd"}}'>
</mp-spreadsheet>
```

**Option B — Child `<mp-cell>` (LLM/human-friendly)**:

```html
<mp-spreadsheet rows="5" cols="3">
  <mp-cell at="A1" color="#e3f2fd">x</mp-cell>
  <mp-cell at="B1" color="#e3f2fd">x²</mp-cell>
  <mp-cell at="A2">2</mp-cell>
  <mp-cell at="B2">=A2*A2</mp-cell>
</mp-spreadsheet>
```

When both are present, `data-state` wins. The runtime always writes the current state back to `data-state` after any edit, so a future save persists the latest state.

#### `mp-cell` (inside `mp-spreadsheet`)

| Attr | Notes |
|---|---|
| `at` | Required. Cell reference (e.g., `A1`, `C7`). |
| `color` | Optional. CSS background color for the cell. |
| (text content) | Cell value or formula (string starting with `=`). |

### 3.9 Interactive figures (JSXGraph)

`mp-jsxgraph` renders an interactive, draggable mathematical figure powered by JSXGraph (lazy-loaded). **This is the preferred way to show curves in mathpad** — points can be dragged, sliders manipulate parameters in real time, and constructions update reactively.

| Attr | Type | Default | Notes |
|---|---|---|---|
| `width`  | integer (px) | 400 | Board width. |
| `height` | integer (px) | 400 | Board height. |
| `bounds` | comma-separated 4 floats | `-5,5,5,-5` | `xmin,ymax,xmax,ymin` (JSXGraph bounding box). |
| `axis`   | boolean | true | Show coordinate axes. |
| `grid`   | boolean | false | Show grid. |

The element's text content is JavaScript executed with two pre-bound variables: `board` (the JSXGraph board) and `JXG` (the global JSXGraph namespace).

#### Example

```html
<mp-jsxgraph width="500" height="400" bounds="-5,5,5,-5" axis grid>
  var s = board.create('slider', [[-3,4],[3,4],[0,1,3]], { name: 'a' });
  board.create('functiongraph',
    [function(x){ return s.Value()*x*x; }, -5, 5],
    { strokeColor: '#3b82f6', strokeWidth: 2 });
</mp-jsxgraph>
```

The slider can be dragged with the mouse / finger; the curve updates live.

### 3.10 Inline formatting

| Tag | Replaces | Notes |
|---|---|---|
| `mp-color` | old `rouge`/`bleu`/`vert` | Text color only. |
| `mp-highlight` | — (new) | Background color (highlighter pen). |
| `mp-underline` | old `souligne` | Underline with theme-accent color. |
| `mp-center` | old `centre` | Block-level center alignment. |
| `mp-spacer` | old `esp` | Multiple non-breaking spaces. |

For bold/italic, **use native HTML `<strong>` and `<em>`**. They are not aliased to `mp-*`.

#### `mp-color` and `mp-highlight` attributes

| Attr | Type | Required | Notes |
|---|---|---|---|
| `value` | CSS color | yes | Any valid CSS color: `red`, `crimson`, `#ff5733`, `rgb(255,0,0)`, `hsl(0,100%,50%)`. |

```html
The result is <mp-color value="crimson">always positive</mp-color>
when <mp-highlight value="#fff3a0">$x > 0$</mp-highlight>.
```

#### `mp-spacer` attribute

| Attr | Type | Required | Default |
|---|---|---|---|
| `n` | integer | optional | 1 |

### 3.11 Variation tables

The variation-table structure is unchanged in semantics but renamed for consistency.

| Tag | Old name | Notes |
|---|---|---|
| `mp-vartable` | `tabvar` | Root. |
| `mp-vartable-abscissa` | `abs` | The x-axis row. |
| `mp-vartable-sign` | `signe` | Sign row. |
| `mp-vartable-top` | `varHaut` | Top variation row. |
| `mp-vartable-middle` | `varCentre` | Middle row (arrows). |
| `mp-vartable-bottom` | `varBas` | Bottom variation row. |
| `mp-cell` | `casier` | Cell, used inside all row types. |

#### `mp-cell` special values (text content)

| Value | Renders as |
|---|---|
| `0` (in `mp-vartable-sign`) | Vertical bar with "0" |
| `forbidden` | Hatched cell (value not in domain) |
| `bar` (in `mp-vartable-sign`) | Vertical bar, no zero |
| `increasing` (in `mp-vartable-middle`) | Upward arrow |
| `decreasing` (in `mp-vartable-middle`) | Downward arrow |

### 3.12 Native HTML elements (allowed)

Mathpad does not redefine these — use them directly:

- Text: `strong`, `em`, `sub`, `sup`, `br`, `code`, `kbd`
- Lists: `ul`, `ol`, `li`
- Tables: `table`, `tr`, `td`, `th`, `thead`, `tbody`
- Media: `img`, `figure`, `figcaption`, `audio`, `video`
- Links: `a`

Math is expected via KaTeX/MathJax inline syntax: `$…$` or `$$…$$`.

### 3.13 Removed from v1

The following tags from the old grammar are **not part of v1** and have no replacement in this perimeter:

- `slide` — slide-presentation mode dropped.
- `depasse` — auto-handled at runtime (overflow detection + wrapping).
- `propN` — merged into `mp-property`.
- Bold/italic custom tags — use native `<strong>`/`<em>`.
- `centre`/`legende`/etc. native HTML aliases — `mp-center` and `<figcaption>` cover these.
- `mp-code` non-Python languages — only Python is supported. `lang` attribute removed entirely. `mp-code-style`/`mp-code-body` sub-elements (HTML-specific) also removed. sarmateScript and HTML execution removed.

---

## 4. Auto-completion rules (runtime)

When the JS engine processes the DOM, it applies these implicit-wrapping rules in order:

1. If `<body>` contains any `mp-*` block but no `mp-course` ancestor → wrap content in an implicit `<mp-course>`.
2. If `mp-course` contains block content but no `mp-chapter` → wrap content in an implicit `<mp-chapter>`.
3. If `mp-chapter` contains formal/pedagogical blocks but no `mp-section` → wrap consecutive blocks in an implicit `<mp-section>` (a new implicit section starts after each explicit sectioning sibling).
4. Any block without an `id` gets `id="mp-{tag}-{counter}"`.
5. Numbering counters are scoped to the nearest `mp-chapter` (chapter-relative: "Theorem 1" restarts in each chapter) unless `numbering="auto-global"` is set on `mp-course`.
6. Elements that visibly overflow their container (post-render, post-resize) are wrapped in an `overflow-x: auto` div.

These rules ensure that minimally-structured human-written documents render identically to fully-structured LLM-generated documents.

---

## 5. Visual rendering principles (book-style)

All formal blocks render with the same visual pattern, distinguished by color of the **left border** (not the full background):

```
┃ THEOREM 3                                 [ROC]
┃ Soit f : ℝ → ℝ une fonction dérivable…
```

- Left border: 4-6px solid, color identifies block type.
- Label: small-caps, color matches border.
- Body: standard text color (not white-on-color).
- ROC badge: top-right when `roc` attribute is present.
- Optional `name`: appended after the number (e.g., "Theorem 3 — Cauchy-Schwarz").

Color palette (CSS variables, themed):

| Block | CSS variable |
|---|---|
| `mp-definition` | `--mp-def-color` |
| `mp-theorem` | `--mp-theorem-color` |
| `mp-property` / `mp-proposition` | `--mp-prop-color` |
| `mp-lemma` / `mp-corollary` | `--mp-lemma-color` |
| `mp-remark` | `--mp-remark-color` |
| `mp-method` | `--mp-method-color` |
| `mp-warning` | `--mp-warning-color` |
| `mp-example` | `--mp-example-color` |
| `mp-exercise` | `--mp-exercise-color` |
| `mp-activity` | `--mp-activity-color` |
| `mp-box[style=accent]` | `--mp-accent-color` |

Each theme (ocean, foret, lavande, …) overrides these variables.

---

## 6. LLM-targeted notes

When prompting an LLM to convert DOCX/ODT/TeX to mathpad:

1. Always require **Form B** for exercises (explicit `mp-statement` / `mp-correction`).
2. Always require `id` on every formal/pedagogical block.
3. Always require the full sectioning hierarchy (`mp-course > mp-chapter > mp-section`).
4. Always require `name` on theorems/properties that have a known mathematical name.
5. Math content must be wrapped in `$…$` or `$$…$$` (KaTeX/MathJax-compatible).
6. The system prompt should include `mathpad-schema.json` and 10–20 canonical examples (one per tag category) as cached content.
7. Validation post-generation: parse the output, verify every `mp-ref target` resolves to an existing `id`, every required attribute is present, no unknown `mp-*` tag is used.

---

## 7. Versioning

- **v1.0.0-draft** (current) — perimeter locked 2026-05-12. Implementation in progress.
- **v1.0.0** — formal freeze 2027-03-31. No breaking changes after this date within v1.x.
- **v2.0.0** — reserved for future breaking changes. Will support coexistence via `mp-course version="…"` attribute.
