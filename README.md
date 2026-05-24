# mathpad

A tiny **JavaScript + CSS runtime** that turns semantic `<mp-*>` HTML tags into
clean, book-style math & science web pages — with KaTeX formulas, interactive
figures (JSXGraph), runnable Python (Skulpt), syntax-highlighted code
(CodeMirror), quizzes, variation tables, cross-references and automatic
numbering.

No build step, no framework. Drop in two files, write `<mp-*>` tags, open in a
browser.

```html
<mp-definition>
  <mp-statement>A sequence is arithmetic when the difference between
  consecutive terms is constant.</mp-statement>
</mp-definition>
```

mathpad is the open-source runtime behind **[sarmate.net](https://www.sarmate.net)**,
which adds `.tex` / `.docx` / `.odt` conversion, server-side LaTeX compilation, a
drive and a visual editor on top of it. The runtime here is fully usable on its
own — MIT licensed, self-hostable, no account or external service required.

## ▶ Live demo

**[See everything in action →](https://www.sarmate.net/mathpad/demo.html)**

A single page showcasing every feature in English — headings, definitions,
theorems, properties, remarks, warnings, proofs, examples, exercises with
hidden corrections, single- and multiple-choice quizzes, aligned equations, a
variation table, a figure, an **interactive JSXGraph** plot, **runnable
Python**, an editable **spreadsheet**, cross-references, footnotes and a
bibliography. Use the palette button (bottom-right) to switch themes. The page
source is [`demo.html`](demo.html) in this repository.

---

## History

mathpad began in **2016**, hand-coded by **Fabrice Frattini** — a French maths
teacher — as a JavaScript library for authoring mathematics on the web: a
formula / grid editor built on jQuery, IPGrid, CodeMirror, Skulpt and
MathJax/KaTeX. That original library powered sarmate.xyz for years. It is
preserved untouched in [`legacy/`](legacy/).

In **2024-2026** mathpad was redesigned from the ground up into a **semantic
document runtime**. Instead of wiring widgets by hand, you write
meaning-carrying tags — `<mp-course>`, `<mp-chapter>`, `<mp-definition>`,
`<mp-theorem>`, `<mp-exercise>`, `<mp-align>`, `<mp-figure>`, `<mp-quiz>`… — and
the runtime renders them book-style, numbers them, builds the table of contents,
resolves cross-references and handles theming. This new generation was developed
with AI assistance and is what lives at the repository root today.

---

## Quick start

mathpad needs **jQuery** and **KaTeX** (with its auto-render extension) on the
page. It lazy-loads CodeMirror, Skulpt and JSXGraph from public CDNs only when a
document actually uses them.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <!-- jQuery -->
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

  <!-- KaTeX + auto-render -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css">
  <script defer src="https://cdn.jsdelivr.net/npm/katex/dist/katex.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/katex/dist/contrib/auto-render.min.js"></script>

  <!-- mathpad -->
  <link rel="stylesheet" href="mathpad.css">
</head>
<body>

  <mp-course theme="ocean">
    <mp-meta><mp-doc-title>My first lesson</mp-doc-title></mp-meta>

    <mp-chapter>
      <mp-title>Sequences</mp-title>

      <mp-definition>
        <mp-statement>A sequence is arithmetic when the difference between
        consecutive terms is constant.</mp-statement>
      </mp-definition>

      <p>For example, $u_n = 3 + 2n$ defines an arithmetic sequence with
      first term $3$ and common difference $2$.</p>

      <mp-exercise>
        <mp-statement>Find the common difference of $7, 11, 15, 19$.</mp-statement>
      </mp-exercise>
    </mp-chapter>
  </mp-course>

  <!-- Render math, then start mathpad -->
  <script>
    document.addEventListener('DOMContentLoaded', function () {
      renderMathInElement(document.body, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$',  right: '$',  display: false }
        ]
      });
    });
  </script>
  <script src="mathpad.js"></script>
</body>
</html>
```

---

## LLM-friendly: convert `.tex` / `.docx` / `.odt` into a web page

mathpad's tag set is documented in an **LLM-targeted** specification:

- [`schema/mathpad-grammar.md`](schema/mathpad-grammar.md) — human-readable grammar
- [`schema/mathpad-schema.json`](schema/mathpad-schema.json) — machine-readable schema

Because that grammar is compact and self-contained, you can hand it to any
capable LLM (Claude, GPT, Gemini, Mistral…) together with a source document and
ask it to produce a ready-to-host mathpad page. Example prompt:

> You are given the mathpad grammar (attached: `mathpad-grammar.md`).
> Convert the attached LaTeX file `lesson.tex` into a single self-contained
> HTML page using mathpad `<mp-*>` tags. Preserve every definition, theorem and
> exercise. Use `$...$` / `$$...$$` for formulas. Output only the HTML.

The model returns the HTML; you save it, drop `mathpad.css` and `mathpad.js`
next to it (plus the jQuery + KaTeX `<head>` from the quick start), and open it.
The same approach works for Word / LibreOffice documents (`.docx` / `.odt`) —
either feed the file directly if your LLM can read it, or convert it to
text/markdown first.

This is exactly how [sarmate.net](https://www.sarmate.net) converts teacher
documents into interactive web lessons.

---

## Themes

Several built-in palettes (Ocean, Forest, Lavender, Coral, Slate, Sepia, Night,
Midnight…) are selectable via the floating palette button or the
`theme="…"` attribute on `<mp-course>`. A flat **"Compatibilité"** palette
(solid backgrounds, no gradients / no `color-mix()`) is included for older
institutional browsers that cannot render CSS gradients.

---

## Tags overview

See [`schema/mathpad-grammar.md`](schema/mathpad-grammar.md) for the complete
reference. In short:

- **Sectioning** — `mp-course`, `mp-chapter`, `mp-section`, `mp-subsection`
- **Formal blocks** — `mp-definition`, `mp-theorem`, `mp-property`,
  `mp-proposition`, `mp-lemma`, `mp-corollary`, `mp-remark`, `mp-method`,
  `mp-warning`, `mp-proof`
- **Pedagogical** — `mp-example`, `mp-activity`, `mp-exercise`, `mp-quiz`
- **Math & figures** — `mp-align`, `mp-vartable`, `mp-figure`, `mp-jsxgraph`
- **Code & data** — `mp-code` (CodeMirror, optional runnable Python),
  `mp-spreadsheet`
- **Interactive & references** — `mp-blank`, `mp-checkbox`, cross-references
  (`mp-ref`), table of contents, footnotes and bibliography

---

## The original library

The 2016 hand-coded version (formula / grid editor) lives in
[`legacy/`](legacy/) with its own README, for reference and history.

---

## License

[MIT](LICENSE) — © 2016-2026 Fabrice Frattini.

Built and maintained at [sarmate.net](https://www.sarmate.net).
