/*
 * mathpad.js — v1.0.0-draft
 * Sarmate.net — new mp-* grammar.
 * See schema/mathpad-grammar.md and schema/mathpad-schema.json.
 *
 * Based on the original mathpad by F. Frattini (2016).
 * © 2016–2026 Fabrice Frattini — MIT License (see LICENSE).
 */

(function() {
  'use strict';

  // ============================================================
  // 0. External CSS (fonts, icons)
  // ============================================================
  function loadCSS(href) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }
  loadCSS('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
  loadCSS('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
  loadCSS('https://cdn.jsdelivr.net/npm/codemirror@5.58.3/theme/neat.css');

  // ============================================================
  // 0b. Scroll preservation across reloads
  // KaTeX, mp-* transformations, and JSXGraph all expand the DOM AFTER the browser
  // tries to restore scroll. Take over scroll restoration manually so the user lands
  // back where they were before the reload, regardless of dynamic content growth.
  // ============================================================
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }
  var SCROLL_KEY = 'mp-scroll-' + location.pathname + location.search;
  window.addEventListener('beforeunload', function() {
    try { sessionStorage.setItem(SCROLL_KEY, String(window.scrollY)); } catch (e) {}
  });
  function restoreScroll() {
    try {
      var saved = sessionStorage.getItem(SCROLL_KEY);
      if (saved !== null) {
        var y = parseInt(saved, 10);
        if (!isNaN(y) && y > 0) window.scrollTo(0, y);
      }
    } catch (e) {}
  }
  // Multiple attempts to handle late renders (KaTeX, JSXGraph, etc.)
  window.addEventListener('load', function() {
    restoreScroll();
    setTimeout(restoreScroll, 100);
    setTimeout(restoreScroll, 500);
    setTimeout(restoreScroll, 1500);
  });

  // ============================================================
  // 1. Global state
  // ============================================================
  var blankIdx = 0;
  var maxBlank = 0;
  var editorPython = [];
  var navigation = (typeof window.navigation === 'boolean') ? window.navigation : true;
  var docLang = 'en';

  // ============================================================
  // 2. Locale labels
  // ============================================================
  var LABELS = {
    'mp-definition':   { en: 'Definition', fr: 'Définition', de: 'Definition', es: 'Definición' },
    'mp-theorem':      { en: 'Theorem',    fr: 'Théorème',   de: 'Satz',       es: 'Teorema' },
    'mp-property':     { en: 'Property',   fr: 'Propriété',  de: 'Eigenschaft',es: 'Propiedad' },
    'mp-proposition':  { en: 'Proposition',fr: 'Proposition',de: 'Proposition',es: 'Proposición' },
    'mp-lemma':        { en: 'Lemma',      fr: 'Lemme',      de: 'Lemma',      es: 'Lema' },
    'mp-corollary':    { en: 'Corollary',  fr: 'Corollaire', de: 'Korollar',   es: 'Corolario' },
    'mp-remark':       { en: 'Remark',     fr: 'Remarque',   de: 'Bemerkung',  es: 'Observación' },
    'mp-method':       { en: 'Method',     fr: 'Méthode',    de: 'Methode',    es: 'Método' },
    'mp-warning':      { en: 'Warning',    fr: 'Attention',  de: 'Achtung',    es: 'Atención' },
    'mp-example':      { en: 'Example',    fr: 'Exemple',    de: 'Beispiel',   es: 'Ejemplo' },
    'mp-exercise':     { en: 'Exercise',   fr: 'Exercice',   de: 'Aufgabe',    es: 'Ejercicio' },
    'mp-activity':     { en: 'Activity',   fr: 'Activité',   de: 'Aktivität',  es: 'Actividad' },
    'mp-quiz':         { en: 'Quiz',       fr: 'Quiz',       de: 'Quiz',       es: 'Quiz' },
    'mp-quiz-correct': { en: 'Correct!',   fr: 'Bravo !',    de: 'Richtig!',   es: '¡Correcto!' },
    'mp-quiz-wrong':   { en: 'Not quite.', fr: 'Pas tout à fait.', de: 'Nicht ganz.', es: 'No exactamente.' },
    'mp-quiz-validate':{ en: 'Validate',   fr: 'Valider',    de: 'Bestätigen', es: 'Validar' },
    'mp-proof':        { en: 'Proof',      fr: 'Preuve',     de: 'Beweis',     es: 'Demostración' },
    'mp-chapter':      { en: 'Chapter',    fr: 'Chapitre',   de: 'Kapitel',    es: 'Capítulo' },
    'mp-section':      { en: 'Section',    fr: 'Partie',     de: 'Abschnitt',  es: 'Sección' },
    'mp-correction':   { en: 'Correction', fr: 'Correction', de: 'Lösung',     es: 'Corrección' },
    'mp-run':          { en: 'Run',        fr: 'Exécuter',   de: 'Ausführen',  es: 'Ejecutar' },
    'mp-toc':          { en: 'Contents',   fr: 'Table des matières', de: 'Inhaltsverzeichnis', es: 'Índice' },
    'mp-bibliography': { en: 'References', fr: 'Références', de: 'Literatur',  es: 'Referencias' },
    'mp-footnotes':    { en: 'Notes',      fr: 'Notes',      de: 'Anmerkungen',es: 'Notas' },
    'mp-figure':       { en: 'Figure',     fr: 'Figure',     de: 'Abbildung',  es: 'Figura' },
    'table':           { en: 'Table',      fr: 'Tableau',    de: 'Tabelle',    es: 'Tabla' },
    'mp-lof':          { en: 'List of Figures', fr: 'Table des figures', de: 'Abbildungsverzeichnis', es: 'Índice de figuras' },
    'mp-lot':          { en: 'List of Tables',  fr: 'Liste des tableaux', de: 'Tabellenverzeichnis',   es: 'Índice de tablas' },
    'credit-built-with': { en: 'Built with sarmate.net', fr: 'Créé avec sarmate.net', de: 'Erstellt mit sarmate.net', es: 'Hecho con sarmate.net' },
    'theme-compatibilite': { en: 'Compatibility', fr: 'Compatibilité', de: 'Kompatibilität', es: 'Compatibilidad' }
  };

  function label(tag) {
    var entry = LABELS[tag];
    if (!entry) return tag;
    return entry[docLang] || entry.en || tag;
  }

  // ============================================================
  // 3. Block catalogs
  // ============================================================
  var FORMAL_BLOCKS = [
    { tag: 'mp-definition',  cssVar: '--mp-def-color',       numbered: true,  acceptRoc: false },
    { tag: 'mp-theorem',     cssVar: '--mp-theorem-color',   numbered: true,  acceptRoc: true  },
    { tag: 'mp-property',    cssVar: '--mp-prop-color',      numbered: true,  acceptRoc: true  },
    { tag: 'mp-proposition', cssVar: '--mp-prop-color',      numbered: true,  acceptRoc: true  },
    { tag: 'mp-lemma',       cssVar: '--mp-lemma-color',     numbered: true,  acceptRoc: false },
    { tag: 'mp-corollary',   cssVar: '--mp-lemma-color',     numbered: true,  acceptRoc: false },
    { tag: 'mp-remark',      cssVar: '--mp-remark-color',    numbered: true,  acceptRoc: false },
    { tag: 'mp-method',      cssVar: '--mp-method-color',    numbered: true,  acceptRoc: false },
    { tag: 'mp-warning',     cssVar: '--mp-warning-color',   numbered: true,  acceptRoc: false }
  ];
  var PEDAGOGICAL_BLOCKS = [
    { tag: 'mp-example',     cssVar: '--mp-example-color',   numbered: true },
    { tag: 'mp-activity',    cssVar: '--mp-activity-color',  numbered: true },
    { tag: 'mp-exercise',    cssVar: '--mp-exercise-color',  numbered: true },
    { tag: 'mp-quiz',        cssVar: '--mp-quiz-color',      numbered: true }
  ];

  // ============================================================
  // 4. Counters (scoped per chapter)
  // ============================================================
  function makeCounter() {
    var map = new WeakMap();
    return {
      next: function(chapter, tag) {
        var key = chapter || window.document; // null chapter → global
        var bucket;
        if (!map.has(key)) {
          bucket = {};
          map.set(key, bucket);
        } else {
          bucket = map.get(key);
        }
        bucket[tag] = (bucket[tag] || 0) + 1;
        return bucket[tag];
      }
    };
  }
  var counters = makeCounter();

  // ============================================================
  // 5. Entry point
  // ============================================================
  $(document).ready(function() {
    detectLanguage();
    initTheme();

    autoWrapStructure();
    normalizeSelfClosing('mp-cite-entry');
    normalizeSelfClosing('mp-cite');
    normalizeSelfClosing('mp-toc');
    normalizeSelfClosing('mp-lof');
    normalizeSelfClosing('mp-lot');
    renderSectioning();
    renderFormalBlocks();
    renderProofs();
    renderPedagogicalBlocks();
    renderContainers();
    renderFigures();
    renderInline();
    renderVartables();

    setupCorrections();
    renderAlignChains();
    setupBlanks();
    setupQuizzes();
    setupCheckboxes();
    setupCodeBlocks();
    setupJSXGraphBlocks();
    setupSpreadsheets();
    resolveCrossReferences();
    renderFootnotes();
    renderBibliography();
    renderCitations();
    renderTableNumbers();
    renderToc();
    renderListOfFigures();
    renderListOfTables();

    autoWrapOverflow();
    addBottomBar();
    if (navigation && blankCount > 0) {
      menuNav();
      document.body.classList.add('mp-has-nav');
    }

    // Re-run overflow detection after window load (KaTeX & late renders may have
     // grown the layout after document.ready) and on resize.
    $(window).on('load', function() {
      autoWrapOverflow();
      setTimeout(autoWrapOverflow, 300);
    });
    var resizeT;
    $(window).on('resize', function() {
      clearTimeout(resizeT);
      resizeT = setTimeout(autoWrapOverflow, 150);
    });
  });

  // ============================================================
  // 6. Language detection
  // ============================================================
  function detectLanguage() {
    var root = document.querySelector('mp-course');
    var lang = root && root.getAttribute('lang');
    if (!lang && navigator.languages && navigator.languages[0]) {
      lang = navigator.languages[0];
    }
    if (!lang) lang = 'en';
    docLang = lang.toLowerCase().split('-')[0]; // "fr-FR" → "fr"
    if (!LABELS['mp-definition'][docLang]) docLang = 'en';
  }

  // ============================================================
  // 7. Phase 1 — Auto-wrap structure
  // ============================================================
  function autoWrapStructure() {
    // (a) If body has no mp-course but contains mp-* blocks, inject one
    var course = document.querySelector('mp-course');
    if (!course) {
      var hasMpContent = document.body.querySelector('[class^="mp-"], mp-chapter, mp-section, mp-definition, mp-theorem, mp-property, mp-proposition, mp-lemma, mp-corollary, mp-remark, mp-method, mp-warning, mp-example, mp-exercise, mp-activity, mp-quiz, mp-box, mp-figure, mp-code, mp-graph, mp-vartable');
      if (hasMpContent) {
        course = document.createElement('mp-course');
        while (document.body.firstChild) {
          course.appendChild(document.body.firstChild);
        }
        document.body.appendChild(course);
      }
    }
    if (!course) return;

    // (b) Ensure at least one mp-chapter inside mp-course (excluding mp-meta).
    var hasChapter = course.querySelector(':scope > mp-chapter');
    if (!hasChapter) {
      var ch = document.createElement('mp-chapter');
      ch.setAttribute('data-mp-implicit', 'true');
      var moved = [];
      Array.prototype.forEach.call(course.children, function(child) {
        if (child.tagName.toLowerCase() !== 'mp-meta') moved.push(child);
      });
      moved.forEach(function(node) { ch.appendChild(node); });
      course.appendChild(ch);
    }

    // (c) Inside each chapter: ensure mp-section wrapper around block content
    document.querySelectorAll('mp-chapter').forEach(function(chap) {
      var hasSection = chap.querySelector(':scope > mp-section');
      if (!hasSection) {
        // Look for any structural content needing a wrapping section
        var needsWrap = chap.querySelector(':scope > mp-definition, :scope > mp-theorem, :scope > mp-property, :scope > mp-proposition, :scope > mp-lemma, :scope > mp-corollary, :scope > mp-remark, :scope > mp-method, :scope > mp-warning, :scope > mp-example, :scope > mp-exercise, :scope > mp-activity, :scope > mp-quiz');
        if (!needsWrap) return;
        var sec = document.createElement('mp-section');
        sec.setAttribute('data-mp-implicit', 'true');
        var nodes = [];
        Array.prototype.forEach.call(chap.children, function(child) {
          var t = child.tagName.toLowerCase();
          if (t !== 'mp-title' && t !== 'mp-section') nodes.push(child);
        });
        nodes.forEach(function(n) { sec.appendChild(n); });
        chap.appendChild(sec);
      }
    });
  }

  // ============================================================
  // 8. Phase 2 — Render sectioning (titles, chapter/section/subsection)
  // ============================================================
  function renderSectioning() {
    // Chapters
    document.querySelectorAll('mp-chapter').forEach(function(chap) {
      if (chap.getAttribute('data-mp-implicit') === 'true') return;
      var unnumbered = chap.getAttribute('numbering') === 'none';
      var title = chap.querySelector(':scope > mp-title');
      if (!unnumbered) {
        var n = counters.next(null, 'mp-chapter'); // chapters are document-global
        var roman = toRoman(n);
        chap.setAttribute('data-mp-number', roman);
        // Arabic index too — sections/subsections prefix it (book scheme :
        // chapter.section.subsection, e.g. 1.3.2).
        chap.setAttribute('data-mp-chapnum', n);
        ensureId(chap, 'mp-chapter-' + n);
        if (title) prependLabel(title, label('mp-chapter') + ' ' + roman, 'mp-sectioning-label');
      } else {
        ensureId(chap, 'mp-chapter-anon-' + (counters._anonChap = (counters._anonChap || 0) + 1));
      }
      if (title) title.classList.add('mp-chapter-title');
    });

    // Sections (counter scoped per chapter)
    document.querySelectorAll('mp-section').forEach(function(sec) {
      if (sec.getAttribute('data-mp-implicit') === 'true') return;
      var unnumbered = sec.getAttribute('numbering') === 'none';
      var title = sec.querySelector(':scope > mp-title');
      if (!unnumbered) {
        var chap = sec.closest('mp-chapter');
        var n = counters.next(chap, 'mp-section');
        // Prefix the chapter number when inside an explicit numbered chapter
        // (book scheme : "1.3"). In an article (implicit chapter, no chapnum)
        // the section number stays bare ("3").
        var chapNum = chap ? chap.getAttribute('data-mp-chapnum') : null;
        var full = chapNum ? (chapNum + '.' + n) : String(n);
        sec.setAttribute('data-mp-number', full);
        ensureId(sec, 'mp-section-' + full);
        if (title) prependLabel(title, full, 'mp-section-number');
      } else {
        ensureId(sec, 'mp-section-anon-' + (counters._anonSec = (counters._anonSec || 0) + 1));
      }
      if (title) title.classList.add('mp-section-title');
    });

    // Subsections (scoped per section)
    document.querySelectorAll('mp-subsection').forEach(function(sub) {
      var title = sub.querySelector(':scope > mp-title');
      // Respect numbering="none" — and treat a subsection inside an unnumbered
      // section the same way (no parent number → don't fabricate "null.N").
      var sec = sub.closest('mp-section');
      var parentUnnumbered = sec && sec.getAttribute('numbering') === 'none';
      var unnumbered = sub.getAttribute('numbering') === 'none' || parentUnnumbered;
      if (unnumbered) {
        ensureId(sub, 'mp-subsection-anon-' + (counters._anonSub = (counters._anonSub || 0) + 1));
        if (title) title.classList.add('mp-subsection-title');
        return;
      }
      var secNum = sec ? sec.getAttribute('data-mp-number') : '?';
      var n = counters.next(sec, 'mp-subsection');
      var full = secNum + '.' + n;
      sub.setAttribute('data-mp-number', full);
      ensureId(sub, 'mp-subsection-' + full);
      if (title) {
        prependLabel(title, full, 'mp-subsection-number');
        title.classList.add('mp-subsection-title');
      }
    });

    // Standalone mp-doc-title (inside mp-meta) — leave alone, CSS handles it
  }

  function toRoman(num) {
    var lookup = [['M',1000],['CM',900],['D',500],['CD',400],['C',100],['XC',90],['L',50],['XL',40],['X',10],['IX',9],['V',5],['IV',4],['I',1]];
    var out = '';
    for (var i = 0; i < lookup.length; i++) {
      while (num >= lookup[i][1]) { out += lookup[i][0]; num -= lookup[i][1]; }
    }
    return out;
  }

  // ============================================================
  // 9. Phase 3 — Formal blocks (book-style, left border + label)
  // ============================================================
  function renderFormalBlocks() {
    FORMAL_BLOCKS.forEach(function(cfg) {
      document.querySelectorAll(cfg.tag).forEach(function(el) {
        var chapter = el.closest('mp-chapter');
        var num = (cfg.numbered && el.getAttribute('numbering') !== 'none')
          ? counters.next(chapter, cfg.tag) : null;
        if (num !== null) el.setAttribute('data-mp-number', num);
        ensureId(el, cfg.tag + '-' + (num || 'x'));
        applyBookBlockStyle(el, cfg, num);
      });
    });
  }

  function applyBookBlockStyle(el, cfg, num) {
    el.classList.add('mp-formal');
    el.classList.add('mp-' + cfg.tag.replace('mp-', ''));
    el.style.setProperty('--mp-block-color', 'var(' + cfg.cssVar + ')');

    var name = el.getAttribute('name');
    var roc = cfg.acceptRoc && el.hasAttribute('roc');
    var prefix = label(cfg.tag) + (num !== null && num !== undefined ? ' ' + num : '');

    // Two equivalent conventions for the block subtitle:
    //   <mp-X name="My title">...</mp-X>                — attribute
    //   <mp-X><mp-title>My title</mp-title>...</mp-X>   — child element
    // When both are present, the name attribute wins. The child <mp-title> is
    // extracted from the body and moved into the header to avoid duplication.
    var titleHtml = null;
    if (name) {
      titleHtml = name;
    } else {
      var titleChild = el.querySelector(':scope > mp-title');
      if (titleChild) {
        titleHtml = titleChild.innerHTML;
        titleChild.parentNode.removeChild(titleChild);
      }
    }

    var header = document.createElement('div');
    header.className = 'mp-formal-header';
    if (titleHtml) {
      // titleHtml may contain KaTeX ($...$) and inline HTML. innerHTML is
      // required for both; the prefix stays as textContent (safe).
      header.appendChild(document.createTextNode(prefix + ' — '));
      var nameSpan = document.createElement('span');
      nameSpan.innerHTML = titleHtml;
      header.appendChild(nameSpan);
      // Re-render KaTeX in case auto-render already ran before us.
      if (typeof window.renderMathInElement === 'function') {
        try {
          window.renderMathInElement(nameSpan, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$',  right: '$',  display: false }
            ]
          });
        } catch (e) { /* best-effort */ }
      }
    } else {
      header.textContent = prefix;
    }

    if (roc) {
      var badge = document.createElement('span');
      badge.className = 'mp-roc-badge';
      badge.textContent = 'ROC';
      header.appendChild(badge);
    }

    // Wrap existing content in a body div
    var body = document.createElement('div');
    body.className = 'mp-formal-body';
    while (el.firstChild) body.appendChild(el.firstChild);
    el.appendChild(header);
    el.appendChild(body);
  }

  // ============================================================
  // 10. Phase 4 — Proofs
  // ============================================================
  function renderProofs() {
    document.querySelectorAll('mp-proof').forEach(function(el) {
      el.classList.add('mp-proof');
      var header = document.createElement('div');
      header.className = 'mp-proof-header';
      header.textContent = label('mp-proof') + '.';

      var body = document.createElement('div');
      body.className = 'mp-proof-body';
      while (el.firstChild) body.appendChild(el.firstChild);

      var tombstone = document.createElement('span');
      tombstone.className = 'mp-proof-end';
      tombstone.innerHTML = '&#9632;'; // ∎
      body.appendChild(tombstone);

      el.appendChild(header);
      el.appendChild(body);
    });
  }

  // ============================================================
  // 11. Phase 5 — Pedagogical blocks
  // ============================================================
  function renderPedagogicalBlocks() {
    PEDAGOGICAL_BLOCKS.forEach(function(cfg) {
      document.querySelectorAll(cfg.tag).forEach(function(el) {
        var chapter = el.closest('mp-chapter');
        var num = (cfg.numbered && el.getAttribute('numbering') !== 'none')
          ? counters.next(chapter, cfg.tag) : null;
        if (num !== null) el.setAttribute('data-mp-number', num);
        ensureId(el, cfg.tag + '-' + (num || 'x'));
        applyPedagogicalStyle(el, cfg, num);
      });
    });
  }

  function applyPedagogicalStyle(el, cfg, num) {
    el.classList.add('mp-pedagogical');
    el.classList.add('mp-' + cfg.tag.replace('mp-', ''));
    el.style.setProperty('--mp-block-color', 'var(' + cfg.cssVar + ')');

    var labelText = label(cfg.tag) + (num !== null ? ' ' + num : '');

    var header = document.createElement('div');
    header.className = 'mp-pedagogical-header';

    var labelEl = document.createElement('span');
    labelEl.className = 'mp-pedagogical-label';
    labelEl.textContent = labelText;
    header.appendChild(labelEl);

    // Difficulty stars (mp-exercise only)
    if (cfg.tag === 'mp-exercise' && el.hasAttribute('difficulty')) {
      var diff = parseInt(el.getAttribute('difficulty'), 10);
      if (diff >= 1 && diff <= 3) {
        var stars = document.createElement('span');
        stars.className = 'mp-difficulty';
        for (var i = 1; i <= 3; i++) {
          var s = document.createElement('i');
          s.className = i <= diff ? 'fas fa-star' : 'far fa-star';
          stars.appendChild(s);
        }
        header.appendChild(stars);
      }
    }

    // Duration
    if (el.hasAttribute('duration')) {
      var dur = document.createElement('span');
      dur.className = 'mp-duration';
      dur.innerHTML = '<i class="far fa-clock"></i> ' + el.getAttribute('duration');
      header.appendChild(dur);
    }

    var body = document.createElement('div');
    body.className = 'mp-pedagogical-body';
    while (el.firstChild) body.appendChild(el.firstChild);

    // Heading title integration. Two modes:
    //   inline  → "Exercice 1 : <title>" via separator on the label (LaTeX-style)
    //   stacked → "Exercice 1 — <title>" appended to the label (consistent with
    //             formal blocks). Default "stacked".
    // Activated by <mp-course exercise-heading="inline">.
    var course = document.querySelector('mp-course');
    var headingMode = (course && course.getAttribute('exercise-heading')) || 'stacked';
    var titleInBody = body.querySelector(':scope > mp-title');
    if (titleInBody) {
      var sep = document.createElement('span');
      sep.className = 'mp-pedagogical-sep';
      if (headingMode === 'inline') {
        sep.textContent = ' : ';
        labelEl.appendChild(sep);
        titleInBody.classList.add('mp-pedagogical-title-inline');
        labelEl.appendChild(titleInBody);
      } else {
        sep.textContent = ' — ';
        labelEl.appendChild(sep);
        var titleSpan = document.createElement('span');
        titleSpan.className = 'mp-pedagogical-title';
        titleSpan.innerHTML = titleInBody.innerHTML;
        titleInBody.parentNode.removeChild(titleInBody);
        labelEl.appendChild(titleSpan);
        if (typeof window.renderMathInElement === 'function') {
          try {
            window.renderMathInElement(titleSpan, {
              delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$',  right: '$',  display: false }
              ]
            });
          } catch (e) { /* best-effort */ }
        }
      }
    }

    el.appendChild(header);
    el.appendChild(body);
  }

  // ============================================================
  // 12. Phase 6 — Containers (mp-box) and figures
  // ============================================================
  function renderContainers() {
    document.querySelectorAll('mp-box').forEach(function(el) {
      var style = el.getAttribute('style-name') || el.getAttribute('data-style') || (el.getAttribute('style') && el.getAttribute('style').indexOf(':') === -1 ? el.getAttribute('style') : null);
      // Default to 'style' attribute (we accept that mp-box uses 'style' for variant)
      // but we read it via getAttribute to avoid CSSStyleDeclaration confusion
      var rawStyle = el.getAttribute('style');
      if (rawStyle && /^(accent|grey|info|subtle)$/.test(rawStyle)) {
        style = rawStyle;
        el.removeAttribute('style'); // remove to avoid CSS conflict
      }
      if (!style) style = 'accent';
      el.classList.add('mp-box');
      el.classList.add('mp-box-' + style);
    });
  }

  function renderFigures() {
    var figNum = 0;
    document.querySelectorAll('mp-figure').forEach(function(el) {
      el.classList.add('mp-figure');
      var cap = el.querySelector(':scope > mp-caption');
      // Number every figure (skip an explicit numbering="none").
      if (el.getAttribute('numbering') !== 'none') {
        figNum++;
        el.setAttribute('data-mp-number', figNum);
        ensureId(el, 'mp-figure-' + figNum);
        if (cap && !cap.querySelector('.mp-fig-label')) {
          var lbl = document.createElement('span');
          lbl.className = 'mp-fig-label';
          lbl.textContent = label('mp-figure') + ' ' + figNum + ' — ';
          cap.insertBefore(lbl, cap.firstChild);
        }
      }
      if (cap) cap.classList.add('mp-caption');
    });
  }

  // ============================================================
  // 13. Phase 7 — Inline formatting
  // ============================================================
  function renderInline() {
    document.querySelectorAll('mp-color[value]').forEach(function(el) {
      el.style.color = el.getAttribute('value');
    });
    document.querySelectorAll('mp-highlight[value]').forEach(function(el) {
      el.style.backgroundColor = el.getAttribute('value');
      el.style.display = 'inline-block';
      el.style.verticalAlign = 'baseline';
      el.style.boxDecorationBreak = 'clone';
      el.style.webkitBoxDecorationBreak = 'clone';
      // Adaptive padding: if a descendant has a custom font-size, compute padding
      // in px from that effective size (otherwise em padding would be anchored to
      // the parent's font-size, making it tiny against content enlarged via
      // <span style="font-size:3em">).
      var sized = el.querySelector('[style*="font-size"]');
      var fsPx = parseFloat(window.getComputedStyle(sized || el).fontSize) || 16;
      el.style.padding       = (fsPx * 0.15).toFixed(1) + 'px ' + (fsPx * 0.4).toFixed(1) + 'px';
      el.style.borderRadius  = (fsPx * 0.25).toFixed(1) + 'px';
    });
    document.querySelectorAll('mp-underline').forEach(function(el) {
      el.classList.add('mp-underline');
    });
    document.querySelectorAll('mp-center').forEach(function(el) {
      el.classList.add('mp-center');
    });
    document.querySelectorAll('mp-spacer').forEach(function(el) {
      var n = parseInt(el.getAttribute('n'), 10) || 1;
      var s = '';
      for (var i = 0; i < n; i++) s += ' ';
      el.textContent = s;
      el.classList.add('mp-spacer');
    });
  }

  // ============================================================
  // 14. Phase 8 — Variation tables
  // ============================================================
  // Scale = multiplicative factor applied to colgroup widths and SVG arrow
  // coordinates. Accepts:
  //   - a numeric value: scale="0.75", scale="1.2" (clamped to [0.2, 3])
  //   - legacy presets: "compact" (0.75), "normal" (1), "large" (1.25)
  // Cascade: <mp-vartable scale="..."> overrides <mp-course vartable-scale="...">.
  var VARTABLE_SCALES = { compact: 0.75, normal: 1, large: 1.25 };
  function getVartableScale(mpvt) {
    var v = mpvt.getAttribute('scale');
    if (!v) {
      var course = mpvt.closest('mp-course');
      if (course) v = course.getAttribute('vartable-scale');
    }
    if (!v) return 1;
    var n = parseFloat(v);
    if (!isNaN(n) && n > 0) return Math.max(0.2, Math.min(n, 3));
    return VARTABLE_SCALES[v] || 1;
  }

  function renderVartables(root) {
    var scope = (root && root.querySelectorAll) ? root : document;
    scope.querySelectorAll('mp-vartable').forEach(function(vt, idx) {
      // Idempotent : skip if already rendered (a child <table.var> exists).
      if (vt.querySelector(':scope > table.var')) return;
      var id = vt.id || ('mp-vartable-' + (idx + 1));
      vt.id = id;
      var scale = getVartableScale(vt);
      var abs = vt.querySelector(':scope > mp-vartable-abscissa');
      if (!abs) return;
      var cells = abs.querySelectorAll(':scope > mp-cell');
      var nCols = cells.length;

      var table = document.createElement('table');
      table.className = 'var';
      table.id = id + '-table';

      // Middle row direction lookup (used by abscissa and variation rendering)
      var mid = vt.querySelector(':scope > mp-vartable-middle');
      var midDirs = [];
      if (mid) {
        mid.querySelectorAll(':scope > mp-cell').forEach(function(c) {
          midDirs.push(c.textContent.trim());
        });
      }

      // Pre-compute varTop/varBot cell references for variant detection
      var topAll = vt.querySelector(':scope > mp-vartable-top');
      var botAll = vt.querySelector(':scope > mp-vartable-bottom');
      var topCells = topAll ? topAll.querySelectorAll(':scope > mp-cell') : [];
      var botCells = botAll ? botAll.querySelectorAll(':scope > mp-cell') : [];
      function hasVal(cells, j) {
        return cells[j] && cells[j].innerHTML.trim() !== '';
      }

      // Arrow variant auto-detection.
      //   dec-interval / inc-interval: arrow is in a dedicated interval cell (abscissa empty).
      //     Arrow goes corner-to-corner of this cell; values sit in adjacent x-value cells.
      //   dec-right: origin in current col TOP, tip extends RIGHT into next col BOT
      //   dec-left:  origin extends LEFT from prev col TOP, tip in current col BOT
      //   inc-left:  origin extends LEFT from prev col BOT, tip in current col TOP
      //   inc-right: origin in current col BOT, tip extends RIGHT into next col TOP
      function arrowVariant(dir, j) {
        // Interval cell takes precedence (abscissa at this col is empty)
        if (isIntervalCol(j)) {
          if (dir === 'decreasing') return 'dec-interval';
          if (dir === 'increasing') return 'inc-interval';
        }
        if (dir === 'decreasing') {
          if (hasVal(topCells, j) && hasVal(botCells, j + 1)) return 'dec-right';
          if (hasVal(topCells, j - 1) && hasVal(botCells, j)) return 'dec-left';
          return (j === nCols - 1) ? 'dec-left' : 'dec-right';
        }
        if (dir === 'increasing') {
          if (hasVal(botCells, j) && hasVal(topCells, j + 1)) return 'inc-right';
          if (hasVal(botCells, j - 1) && hasVal(topCells, j)) return 'inc-left';
          return (j === 1) ? 'inc-right' : 'inc-left';
        }
        return '';
      }

      function arrowSvg(variant, label) {
        // Coords are authored at scale=1 (viewBox 140x90). To preserve the visual
        // tip-gap from adjacent value cells, multiply every X by `scale` AND the
        // viewBox width — Y stays unchanged because row heights are fixed.
        var s = scale;
        function mx(x) { return (x * s).toFixed(2); }
        var line, poly;
        switch (variant) {
          case 'dec-right':
            line = 'x1="' + mx(30) + '" y1="2" x2="' + mx(157) + '" y2="92"';
            poly = 'points="' + mx(157) + ',92 ' + mx(143.2) + ',87.3 ' + mx(147.8) + ',80.7"';
            break;
          case 'dec-left':
            line = 'x1="' + mx(-17) + '" y1="2" x2="' + mx(110) + '" y2="92"';
            poly = 'points="' + mx(110) + ',92 ' + mx(96.2) + ',87.3 ' + mx(100.8) + ',80.7"';
            break;
          case 'inc-left':
            line = 'x1="' + mx(-17) + '" y1="92" x2="' + mx(100) + '" y2="2"';
            poly = 'points="' + mx(100) + ',2 ' + mx(91.2) + ',13.6 ' + mx(86.4) + ',7.2"';
            break;
          case 'inc-right':
            line = 'x1="' + mx(30) + '" y1="92" x2="' + mx(157) + '" y2="2"';
            poly = 'points="' + mx(157) + ',2 ' + mx(147.8) + ',13.3 ' + mx(143.2) + ',6.7"';
            break;
          case 'dec-interval':
            // Confined to this interval cell, near corner-to-corner.
            line = 'x1="' + mx(5) + '" y1="5" x2="' + mx(135) + '" y2="85"';
            poly = 'points="' + mx(135) + ',85 ' + mx(121.0) + ',81.1 ' + mx(125.2) + ',74.3"';
            break;
          case 'inc-interval':
            line = 'x1="' + mx(5) + '" y1="85" x2="' + mx(135) + '" y2="5"';
            poly = 'points="' + mx(135) + ',5 ' + mx(125.2) + ',15.7 ' + mx(121.0) + ',8.9"';
            break;
          default: return '';
        }
        return '<svg class="mp-arrow-svg" viewBox="0 0 ' + (140 * s).toFixed(2) + ' 90" aria-label="' + label + '">' +
               '<line ' + line + ' stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>' +
               '<polygon ' + poly + ' fill="currentColor"/>' +
               '</svg>';
      }

      // Detect whether an abscissa cell at index j is an "interval cell" (empty content)
      // or an x-value cell. Used for col widths AND sign alignment.
      function isIntervalCol(j) {
        return cells[j] && cells[j].textContent.trim() === '';
      }

      // Colgroup: explicit per-column widths so signs and arrows align consistently.
      // Base widths (scale=1): arrow=140, forbidden=75, extremum=50, x-value=55, interval=70.
      // All multiplied by `scale` (compact/normal/large preset).
      var colgroup = document.createElement('colgroup');
      for (var ci = 0; ci < nCols; ci++) {
        var col = document.createElement('col');
        if (ci > 0) {
          var dci = midDirs[ci] || '';
          var baseW;
          if (dci === 'increasing' || dci === 'decreasing') baseW = 140;
          else if (dci === 'forbidden') baseW = 75;
          else {
            var prevHasDir = midDirs[ci - 1] === 'increasing' || midDirs[ci - 1] === 'decreasing';
            var nextHasDir = midDirs[ci + 1] === 'increasing' || midDirs[ci + 1] === 'decreasing';
            if (prevHasDir || nextHasDir) baseW = 50;
            else baseW = isIntervalCol(ci) ? 70 : 55;
          }
          col.style.width = (baseW * scale).toFixed(2) + 'px';
        }
        colgroup.appendChild(col);
      }
      table.appendChild(colgroup);

      // Abscissa row — align values toward the arrow corner that hits this col.
      // Fallback (no arrow context): leftmost col aligned LEFT, rightmost RIGHT.
      var tr = document.createElement('tr');
      cells.forEach(function(c, j) {
        var td = document.createElement('td');
        var cls = (j === 0) ? 'droite' : 'bas';
        if (j > 0) {
          var v = arrowVariant(midDirs[j], j);
          if (v === 'dec-right' || v === 'inc-right') cls += ' mp-abs-left';
          else if (v === 'dec-left' || v === 'inc-left') cls += ' mp-abs-right';
          else if (j === 1) cls += ' mp-abs-left';
          else if (j === nCols - 1) cls += ' mp-abs-right';
        }
        td.className = cls;
        td.innerHTML = c.innerHTML;
        tr.appendChild(td);
      });
      table.appendChild(tr);

      // Sign rows — align sign based on context:
      //   • With varMid arrows: align toward the interval boundary for ∨-shape variations
      //   • Without varMid (sign-only tables): align toward nearest zero crossing
      //   • Single sign in a row of empty cells: colspan the whole data area, centered
      // Explicit markers for mp-vartable-sign cell rendering:
      //   - "bar"       → vertical bar only (no text content)
      //   - "bar0"      → vertical bar + "0" overlaid
      //   - "forbidden" → double bar (forbidden value)
      //   - "0"         → bar + "0" (legacy, kept for backward compat)
      //   - "$0$"       → KaTeX-styled "0" only, NO bar (use "bar0" for bar+0)
      // Any other content (signs "+", "-", expressions $...$) → normal cell.
      function isBoundary(s) {
        return s === '0' || s === 'bar' || s === 'bar0' || s === 'forbidden';
      }

      vt.querySelectorAll(':scope > mp-vartable-sign').forEach(function(sign) {
        var row = document.createElement('tr');
        var signCells = sign.querySelectorAll(':scope > mp-cell');
        // Detect single sign across all empty data cells
        var nonEmptyDataIndices = [];
        for (var k = 1; k < signCells.length; k++) {
          var t = signCells[k].textContent.trim();
          if (t !== '' && !isBoundary(t)) nonEmptyDataIndices.push(k);
        }
        var anyZeroOrForbidden = false;
        for (var k = 1; k < signCells.length; k++) {
          var t = signCells[k].textContent.trim();
          if (isBoundary(t)) { anyZeroOrForbidden = true; break; }
        }
        // Single sign across the row (no zeros, no forbidden) → colspan to center it.
        // Applies whether or not there's a variation arrow below.
        var useSingleColspan = nonEmptyDataIndices.length === 1 && !anyZeroOrForbidden;

        signCells.forEach(function(c, j) {
          // Skip filler empty cells when using single-sign colspan
          if (useSingleColspan && j > 0 && j !== nonEmptyDataIndices[0]) return;

          var td = document.createElement('td');
          var text = c.textContent.trim();
          var cls = (j === 0) ? 'droite' : 'bas';
          var content = c.innerHTML;
          // Cell-type dispatch:
          //   "0"  / "bar0" → vertical bar + "0" (CSS ::before bar + centered text)
          //   "bar"         → bar only
          //   "forbidden"   → double bar (forbidden value)
          //   else (incl. "$0$") → normal cell, innerHTML preserved
          //                        (KaTeX renders $...$ normally)
          if (text === '0' || text === 'bar0') {
            cls = 'verticale';
            content = '0';
          }
          else if (text === 'bar')       { cls = 'verticale'; content = ''; }
          else if (text === 'forbidden') { cls = 'interdit'; content = ''; }
          else if (j > 0) {
            if (useSingleColspan) {
              td.colSpan = nCols - 1; // span all data cols, content stays centered
            } else if (isIntervalCol(j)) {
              // Sign sits in a dedicated interval cell — keep centered, no leaning
            } else if (mid) {
              // Variation context, x-value col: lean toward extremum below
              var vSign = arrowVariant(midDirs[j], j);
              if (vSign === 'dec-right') cls += ' mp-sign-right';
              else if (vSign === 'inc-left') cls += ' mp-sign-left';
            } else {
              // Sign-only context, x-value col without dedicated interval cell:
              // lean toward nearest zero/forbidden marker (legacy 4-cell pattern)
              var prevText = signCells[j-1] ? signCells[j-1].textContent.trim() : '';
              var nextText = signCells[j+1] ? signCells[j+1].textContent.trim() : '';
              var prevIsBoundary = isBoundary(prevText);
              var nextIsBoundary = isBoundary(nextText);
              if (nextIsBoundary && !prevIsBoundary) cls += ' mp-sign-right';
              else if (prevIsBoundary && !nextIsBoundary) cls += ' mp-sign-left';
            }
          }
          td.className = cls;
          td.innerHTML = content;
          row.appendChild(td);
        });
        table.appendChild(row);
      });

      // Variation rendering — 3 separate rows (varTop / varMid / varBot).
      // The label cell uses rowSpan to be vertically centered across all rows present.
      var top = vt.querySelector(':scope > mp-vartable-top');
      var bot = vt.querySelector(':scope > mp-vartable-bottom');
      var varRowSrcs = [];
      if (top) varRowSrcs.push({ src: top, kind: 'top' });
      if (mid) varRowSrcs.push({ src: mid, kind: 'mid' });
      if (bot) varRowSrcs.push({ src: bot, kind: 'bot' });

      if (varRowSrcs.length > 0) {
        // Find label from first non-empty col-0 cell across the rows
        var labelHtml = '';
        varRowSrcs.forEach(function(r) {
          if (!labelHtml) {
            var first = r.src.querySelector(':scope > mp-cell');
            if (first && first.innerHTML.trim() !== '') labelHtml = first.innerHTML;
          }
        });

        varRowSrcs.forEach(function(r, idx) {
          var tr = document.createElement('tr');
          var cells = r.src.querySelectorAll(':scope > mp-cell');

          // Label cell only on the first row, spanning all variation rows
          if (idx === 0) {
            var tdLabel = document.createElement('td');
            tdLabel.className = 'droite_seule mp-var-label';
            tdLabel.rowSpan = varRowSrcs.length;
            tdLabel.innerHTML = labelHtml;
            tr.appendChild(tdLabel);
          }

          for (var j = 1; j < nCols; j++) {
            var c = cells[j];
            var td = document.createElement('td');
            var text = c ? c.textContent.trim() : '';
            var content = c ? c.innerHTML : '';
            var cls = '';

            if (r.kind === 'top') {
              cls = 'vh';
              if (text === 'forbidden') { cls = 'interdit_sf'; content = ''; }
              else if (content.trim() !== '') {
                if (midDirs[j] === 'forbidden') {
                  cls += ' mp-forbidden-passthrough';
                  var pV = arrowVariant(midDirs[j-1], j-1);
                  var nV = arrowVariant(midDirs[j+1], j+1);
                  if (pV === 'inc-right') cls += ' mp-vartop-left';
                  else if (nV === 'dec-left') cls += ' mp-vartop-right';
                } else {
                  var vT = arrowVariant(midDirs[j], j);
                  if (vT === 'dec-right' || vT === 'inc-right') cls += ' mp-vartop-left';
                  else if (vT === 'dec-left' || vT === 'inc-left') cls += ' mp-vartop-right';
                  else if (!midDirs[j]) {
                    // X-value col with no direction; check adjacent interval arrows
                    // inc-interval at j-1 → tip at this col's TOP-LEFT → align left
                    // dec-interval at j+1 → origin at this col's TOP-RIGHT → align right
                    var prevIsIncInterval = midDirs[j-1] === 'increasing' && isIntervalCol(j-1);
                    var nextIsDecInterval = midDirs[j+1] === 'decreasing' && isIntervalCol(j+1);
                    if (prevIsIncInterval && !nextIsDecInterval) cls += ' mp-vartop-left';
                    else if (nextIsDecInterval && !prevIsIncInterval) cls += ' mp-vartop-right';
                  }
                }
              }
            } else if (r.kind === 'mid') {
              if (text === 'forbidden') {
                cls = 'interdit_sf'; content = '';
              } else if (text === 'increasing' || text === 'decreasing') {
                cls = (text === 'increasing') ? 'croissante' : 'decroissante';
                var v = arrowVariant(text, j);
                content = arrowSvg(v, text);
              }
            } else if (r.kind === 'bot') {
              cls = 'mp-var-bot';
              if (text === 'forbidden') { cls = 'interdit'; content = ''; }
              else if (content.trim() !== '') {
                if (midDirs[j] === 'forbidden') {
                  cls += ' mp-forbidden-passthrough';
                  var pVb = arrowVariant(midDirs[j-1], j-1);
                  var nVb = arrowVariant(midDirs[j+1], j+1);
                  if (pVb === 'dec-right') cls += ' mp-varbot-left';
                  else if (nVb === 'inc-left') cls += ' mp-varbot-right';
                } else {
                  var vB = arrowVariant(midDirs[j], j);
                  if (vB === 'inc-right') cls += ' mp-varbot-left';
                  else if (vB === 'dec-left') cls += ' mp-varbot-right';
                  else if (!midDirs[j]) {
                    // X-value col with no direction; check adjacent interval arrows
                    // dec-interval at j-1 → tip at this col's BOT-LEFT → align left
                    // inc-interval at j+1 → origin at this col's BOT-RIGHT → align right
                    var prevIsDecInterval = midDirs[j-1] === 'decreasing' && isIntervalCol(j-1);
                    var nextIsIncInterval = midDirs[j+1] === 'increasing' && isIntervalCol(j+1);
                    if (prevIsDecInterval && !nextIsIncInterval) cls += ' mp-varbot-left';
                    else if (nextIsIncInterval && !prevIsDecInterval) cls += ' mp-varbot-right';
                  }
                }
              }
            }

            td.className = cls;
            td.innerHTML = content;
            tr.appendChild(td);
          }
          table.appendChild(tr);
        });
      }

      vt.innerHTML = '';
      vt.appendChild(table);
      // Apply true visual scale (text + padding + arrows) via CSS zoom — the
      // colgroup-width scaling alone doesn't reduce font-size/padding, so a
      // scale of 0.5 would shrink columns but text would overflow. `zoom`
      // resizes everything proportionally AND adjusts the layout box (no
      // leftover whitespace below, unlike `transform: scale`).
      if (scale !== 1) {
        table.style.zoom = scale;
      }
    });
  }

  // ============================================================
  // 14b. Phase 8b — Aligned equation chains (mp-align)
  // LaTeX-align-like syntax: rows separated by \n, cells separated by &.
  // First cell = optional prefix (right-aligned). Last cell = comment (italic, muted).
  // Pauses can be placed inside any cell with <pause>...</pause>.
  // ============================================================
  function renderAlignChains() {
    document.querySelectorAll('mp-align').forEach(function(el) {
      if (el.classList.contains('mp-align-built')) return;

      // If KaTeX already rendered any $..$ inside us (race with auto-render),
      // its <span class="katex"> blocks contain "&amp;" in SVG attributes, which
      // would corrupt the column split. We replace each rendered span with its
      // original LaTeX source wrapped in $..$ before splitting, then re-run
      // KaTeX on the resulting cells.
      var hadKatex = el.querySelector('span.katex');
      if (hadKatex) {
        el.querySelectorAll('span.katex').forEach(function(k) {
          var annot = k.querySelector('annotation[encoding="application/x-tex"]');
          if (!annot) return;
          var display = k.classList.contains('katex-display');
          var src = annot.textContent;
          var delim = display ? '$$' : '$';
          k.parentNode.replaceChild(document.createTextNode(delim + src + delim), k);
        });
      }

      el.classList.add('mp-align-built');
      // Note: innerHTML serializes "&" as "&amp;" and "<" as "&lt;", so we must split
      // on the entity "&amp;" — splitting on bare "&" would break entities like &lt;.
      var html = el.innerHTML;
      var lines = html.split(/\r?\n/).map(function(l) { return l.trim(); }).filter(Boolean);
      if (!lines.length) return;

      var table = document.createElement('table');
      table.className = 'mp-align-table';
      lines.forEach(function(line) {
        // LaTeX-style line spacer: a trailing "\\[12px]" / "\\[1.5em]" sets an
        // extra padding-bottom on this row. We strip it from the line before split.
        var spacer = null;
        var spacerMatch = line.match(/\\\\\[\s*([\d.]+\s*(?:px|em|rem|pt|ex))\s*\]\s*$/);
        if (spacerMatch) {
          spacer = spacerMatch[1].replace(/\s+/g, '');
          line = line.slice(0, -spacerMatch[0].length).trim();
        }
        var cells = line.split(/&amp;/);
        var tr = document.createElement('tr');
        if (spacer) tr.style.cssText = '--mp-align-row-extra-pad: ' + spacer;
        // Detect the index of the relation cell (=, ≤, ≥, <, >, \le, \ge,
        // \leq, \geq, \neq, \approx, \equiv, \Leftrightarrow, \Rightarrow,
        // \Leftarrow, \to, \mapsto, \iff). Everything LEFT of it = LHS
        // (right-align, up against the =). Everything RIGHT = RHS (left-
        // align, up against the =). Without a detected relation: nth-child fallback.
        var relIdx = -1;
        for (var k = 0; k < cells.length; k++) {
          var raw = cells[k].trim()
            .replace(/<[^>]+>/g, '')   // strip HTML tags (e.g. <span>)
            .replace(/^\$+|\$+$/g, '') // strip math delimiters
            .replace(/\s+/g, '');
          if (/^(?:=|<|>|\\le[q]?|\\ge[q]?|\\leqslant|\\geqslant|\\neq|\\approx|\\equiv|\\sim|\\Leftrightarrow|\\Rightarrow|\\Leftarrow|\\rightarrow|\\to|\\mapsto|\\iff|≤|≥|≠|⇔|⇒|⇐|→)$/.test(raw)) {
            relIdx = k; break;
          }
        }
        cells.forEach(function(cell, j) {
          var td = document.createElement('td');
          td.className = 'mp-align-cell';
          // Last cell of a row with >3 cells → comment cell.
          var isLastComment = (j === cells.length - 1 && cells.length > 3);
          if (isLastComment) td.classList.add('mp-align-comment');
          // Positional alignment around the detected relation:
          //   j < relIdx → up against the = (right)
          //   j === relIdx → center
          //   j > relIdx (and not the comment) → up against the = (left)
          if (relIdx >= 0 && !isLastComment) {
            if (j < relIdx) td.classList.add('mp-align-lhs');
            else if (j === relIdx) td.classList.add('mp-align-rel');
            else td.classList.add('mp-align-rhs');
          }
          td.innerHTML = cell.trim();
          tr.appendChild(td);
        });
        table.appendChild(tr);
      });

      el.innerHTML = '';
      el.appendChild(table);

      // Re-render KaTeX inside the freshly built cells if it was already rendered
      // elsewhere in the document.
      if (hadKatex && typeof window.renderMathInElement === 'function') {
        try {
          window.renderMathInElement(table, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$',  right: '$',  display: false }
            ]
          });
        } catch (e) { /* swallow — best-effort re-render */ }
      }
    });
  }

  // ============================================================
  // 15. Phase 9 — Corrections (modal reveal)
  // ============================================================
  function setupCorrections() {
    document.querySelectorAll('mp-correction').forEach(function(corr, i) {
      if (corr.closest('.mp-correction-wrapped')) return; // already handled

      // Replace mp-correction with [button + hidden modal-div].
      // The wrapper is a BLOCK <div> so it always sits on its own line,
      // never inline with surrounding statement text.
      var wrapper = document.createElement('div');
      wrapper.className = 'mp-correction-wrapped';

      var btn = document.createElement('a');
      btn.className = 'btnCorr';
      btn.textContent = label('mp-correction');
      btn.setAttribute('role', 'button');
      btn.setAttribute('tabindex', '0');

      var modal = document.createElement('div');
      modal.className = 'correction';
      modal.id = 'mp-correction-' + i;

      var inner = document.createElement('div');
      inner.className = 'intCorr';
      while (corr.firstChild) inner.appendChild(corr.firstChild);
      modal.appendChild(inner);

      var close = document.createElement('a');
      close.className = 'clos';
      close.innerHTML = '<i class="fas fa-times"></i>';
      modal.appendChild(close);

      btn.addEventListener('click', function() { showCorrection(modal); });
      close.addEventListener('click', function() { hideCorrection(modal); });

      wrapper.appendChild(btn);
      wrapper.appendChild(modal);
      corr.parentNode.replaceChild(wrapper, corr);
    });
  }
  function showCorrection(modal) {
    modal.style.display = 'block';
    requestAnimationFrame(function() {
      modal.classList.add('show');
      // Refresh any CodeMirror editor inside the modal: it was instanciated while
      // the modal was display:none, so its gutter widths and char metrics are off.
      modal.querySelectorAll('.CodeMirror').forEach(function(cmEl) {
        if (cmEl.CodeMirror) cmEl.CodeMirror.refresh();
      });
    });
  }
  function hideCorrection(modal) {
    modal.classList.remove('show');
    setTimeout(function() { modal.style.display = 'none'; }, 300);
  }

  // ============================================================
  // 16. Phase 10 — Blanks (progressive reveal)
  // Supports both <pause> (legacy short name) and <mp-blank> (prefixed v1 name).
  // ============================================================
  var blankCount = 0;
  function setupBlanks() {
    // Only top-level pauses are tied to the global nav buttons.
    // Pauses inside corrections (modal) are kept as static reveals — they show in
    // full when the correction is opened, no progressive stepping inside.
    var all = document.querySelectorAll('pause, mp-blank');
    var blanks = Array.prototype.filter.call(all, function(el) {
      return !el.closest('.mp-correction-wrapped, .correction');
    });
    blankCount = blanks.length;
    blanks.forEach(function(el, i) {
      el.id = 'mp-blank-' + i;
      el.classList.add('mp-blank');
      maxBlank = i;
    });
  }

  function blankHighlight(i, on) {
    var el = document.getElementById('mp-blank-' + i);
    if (!el) return;
    if (on) { el.classList.add('mp-blank-highlight'); }
    else    { el.classList.remove('mp-blank-highlight'); }
  }

  function scrollToBlank(el) {
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  window.mpAdvance = function(skipScroll) {
    var revealedIdx = blankIdx;
    var el = document.getElementById('mp-blank-' + revealedIdx);
    if (el) {
      el.style.visibility = 'visible';
      blankHighlight(revealedIdx, true);
      setTimeout(function() { blankHighlight(revealedIdx, false); }, 1000);
      if (!skipScroll) scrollToBlank(el);
    }
    if (blankIdx < maxBlank) blankIdx++;
    return el;
  };
  window.mpRetreat = function(skipScroll) {
    if (blankIdx > 0) blankIdx--;
    var el = document.getElementById('mp-blank-' + blankIdx);
    if (el) {
      el.style.visibility = 'hidden';
      blankHighlight(blankIdx, false);
      if (!skipScroll) scrollToBlank(el);
    }
    return el;
  };
  window.mpAdvance10 = function() {
    var lastEl = null;
    for (var i = 0; i < 10; i++) lastEl = window.mpAdvance(true) || lastEl;
    if (lastEl) scrollToBlank(lastEl);
  };
  window.mpRetreat10 = function() {
    var lastEl = null;
    for (var i = 0; i < 10; i++) lastEl = window.mpRetreat(true) || lastEl;
    if (lastEl) scrollToBlank(lastEl);
  };

  // ============================================================
  // 16b. Phase 10b — Quizzes (single-question MCQ, immediate feedback)
  //
  // Markup expected (after renderPedagogicalBlocks wrapped the body):
  //   <mp-quiz>
  //     <mp-question>Question text…</mp-question>
  //     <mp-answer correct>A</mp-answer>
  //     <mp-answer>B</mp-answer>
  //     <mp-answer>C</mp-answer>
  //   </mp-quiz>
  //
  // Optional attributes on <mp-quiz>:
  //   shuffle   — randomize answer order at init
  //   multiple  — multi-select (checkbox semantics), validated by a button
  //
  // Behavior (single-select, default):
  //   - First click locks the quiz.
  //   - Clicked answer turns green (✓) if correct, red (✗) if not.
  //   - If wrong, the correct answer is also revealed in green.
  // ============================================================
  function setupQuizzes() {
    var allQuizzes = document.querySelectorAll('mp-quiz');
    if (!allQuizzes.length) return;

    // --- Analytics tracking (funnel_event.php) — non-blocking, failsafe.
    // Tracking must NEVER break the quiz: everything is wrapped in try/catch.
    function trackQuiz(eventName, quiz, qIdx, extra) {
      try {
        var qEl = quiz.querySelector('mp-question');
        var data = {
          event: eventName,
          page: (location.pathname || '').slice(0, 120),
          quiz_index: qIdx,
          q: qEl ? qEl.textContent.trim().slice(0, 80) : '',
          multiple: quiz.hasAttribute('multiple') ? 1 : 0
        };
        if (extra) { for (var k in extra) data[k] = extra[k]; }
        navigator.sendBeacon('/funnel_event.php', JSON.stringify(data));
      } catch (e) { /* silent */ }
    }
    // quiz_shown: fired once when the quiz enters the viewport.
    var quizObserver = null;
    try {
      if ('IntersectionObserver' in window) {
        quizObserver = new IntersectionObserver(function(entries) {
          entries.forEach(function(en) {
            if (!en.isIntersecting) return;
            var z = en.target;
            if (!z.__mpQuizShown) {
              z.__mpQuizShown = true;
              trackQuiz('quiz_shown', z, z.__mpQuizIdx || 0);
            }
            quizObserver.unobserve(z);
          });
        }, { threshold: 0.4 });
      }
    } catch (e) { quizObserver = null; }

    allQuizzes.forEach(function(quiz, qIdx) {
      if (quiz.classList.contains('mp-quiz-ready')) return; // idempotent
      // Container where the answers actually live: the pedagogical body if it
      // exists, otherwise the quiz element itself (e.g. nested or standalone).
      var body = quiz.querySelector('.mp-pedagogical-body') || quiz;
      var question = quiz.querySelector('mp-question');
      var answers  = quiz.querySelectorAll('mp-answer');
      if (!answers.length) return;

      quiz.classList.add('mp-quiz-ready');
      if (question) question.classList.add('mp-question');
      quiz.__mpQuizIdx = qIdx;
      if (quizObserver) { try { quizObserver.observe(quiz); } catch (e) {} }

      // Shuffle if requested
      var answerArr = Array.prototype.slice.call(answers);
      if (quiz.hasAttribute('shuffle')) {
        answerArr.sort(function() { return Math.random() - 0.5; });
        answerArr.forEach(function(a) { body.appendChild(a); });
      }

      var isMultiple = quiz.hasAttribute('multiple');
      var feedback = document.createElement('div');
      feedback.className = 'mp-quiz-feedback';
      body.appendChild(feedback);

      if (!isMultiple) {
        // ---- Single-select : click locks
        answerArr.forEach(function(ans) {
          ans.classList.add('mp-answer');
          ans.setAttribute('role', 'button');
          ans.setAttribute('tabindex', '0');
          var isCorrect = ans.hasAttribute('correct');
          var handle = function() {
            if (quiz.classList.contains('mp-quiz-locked')) return;
            quiz.classList.add('mp-quiz-locked');

            ans.classList.add(isCorrect ? 'mp-answer-correct' : 'mp-answer-wrong');
            ans.classList.add('mp-answer-picked');

            if (!isCorrect) {
              answerArr.forEach(function(a2) {
                if (a2 !== ans && a2.hasAttribute('correct')) {
                  a2.classList.add('mp-answer-correct', 'mp-answer-revealed');
                }
              });
            }
            feedback.textContent = isCorrect
              ? (label('mp-quiz-correct') || '')
              : (label('mp-quiz-wrong')   || '');
            feedback.classList.add(isCorrect ? 'mp-quiz-feedback-ok' : 'mp-quiz-feedback-ko');
            trackQuiz('quiz_answer', quiz, qIdx, { correct: isCorrect ? 1 : 0 });
          };
          ans.addEventListener('click', handle);
          ans.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handle(); }
          });
        });
      } else {
        // ---- Multi-select : checkbox-style, validated by a button
        answerArr.forEach(function(ans) {
          ans.classList.add('mp-answer', 'mp-answer-multi');
          ans.setAttribute('role', 'checkbox');
          ans.setAttribute('aria-checked', 'false');
          ans.setAttribute('tabindex', '0');
          var toggle = function() {
            if (quiz.classList.contains('mp-quiz-locked')) return;
            var on = ans.classList.toggle('mp-answer-selected');
            ans.setAttribute('aria-checked', on ? 'true' : 'false');
          };
          ans.addEventListener('click', toggle);
          ans.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
          });
        });
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'mp-quiz-validate';
        btn.textContent = label('mp-quiz-validate') || 'Valider';
        btn.addEventListener('click', function() {
          if (quiz.classList.contains('mp-quiz-locked')) return;
          quiz.classList.add('mp-quiz-locked');
          var allOk = true;
          answerArr.forEach(function(ans) {
            var isCorrect = ans.hasAttribute('correct');
            var picked    = ans.classList.contains('mp-answer-selected');
            if (isCorrect && picked) ans.classList.add('mp-answer-correct', 'mp-answer-picked');
            else if (isCorrect && !picked) { ans.classList.add('mp-answer-correct', 'mp-answer-revealed'); allOk = false; }
            else if (!isCorrect && picked) { ans.classList.add('mp-answer-wrong', 'mp-answer-picked'); allOk = false; }
          });
          feedback.textContent = allOk
            ? (label('mp-quiz-correct') || '')
            : (label('mp-quiz-wrong')   || '');
          feedback.classList.add(allOk ? 'mp-quiz-feedback-ok' : 'mp-quiz-feedback-ko');
          trackQuiz('quiz_answer', quiz, qIdx, { correct: allOk ? 1 : 0 });
          btn.disabled = true;
        });
        body.appendChild(btn);
      }
    });

    // Re-render KaTeX inside every quiz once init is done. Cheap and idempotent
    // — covers the case where KaTeX auto-render fired before mathpad.js (so
    // <mp-question>/<mp-answer> were skipped while the wrapper was being built)
    // OR where the deferred auto-render script hasn't fired yet (no-op then).
    if (typeof window.renderMathInElement === 'function') {
      allQuizzes.forEach(function(quiz) {
        try {
          window.renderMathInElement(quiz, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$',  right: '$',  display: false }
            ],
            throwOnError: false,
            ignoredTags: ['script','noscript','style','textarea','pre','code','option']
          });
        } catch (e) { /* best-effort */ }
      });
    } else {
      // KaTeX hasn't loaded yet (deferred). Hook a one-shot retry after load.
      window.addEventListener('load', function() {
        if (typeof window.renderMathInElement !== 'function') return;
        allQuizzes.forEach(function(quiz) {
          try {
            window.renderMathInElement(quiz, {
              delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$',  right: '$',  display: false }
              ],
              throwOnError: false,
              ignoredTags: ['script','noscript','style','textarea','pre','code','option']
            });
          } catch (e) { /* best-effort */ }
        });
      }, { once: true });
    }
  }

  // ============================================================
  // 17. Phase 11 — Checkboxes (label inside, localStorage-persisted)
  // ============================================================
  function setupCheckboxes() {
    var key = 'mp-checked-' + document.URL;
    var state = JSON.parse(localStorage.getItem(key) || '{}');

    document.querySelectorAll('mp-checkbox').forEach(function(el, i) {
      var id = el.id || ('mp-checkbox-' + i);
      el.id = id;
      // The element's inner HTML is the LABEL (everything inside <mp-checkbox>...</mp-checkbox>).
      var labelHTML = el.innerHTML;
      el.innerHTML = '';
      el.classList.add('mp-checkbox');

      var label = document.createElement('label');
      label.className = 'mp-checkbox-label';

      var input = document.createElement('input');
      input.type = 'checkbox';
      input.className = 'mp-checkbox-input';
      input.checked = !!state[id];
      input.addEventListener('change', function() {
        state[id] = input.checked;
        localStorage.setItem(key, JSON.stringify(state));
        el.classList.toggle('mp-checked', input.checked);
      });

      var text = document.createElement('span');
      text.className = 'mp-checkbox-text';
      text.innerHTML = labelHTML;

      label.appendChild(input);
      label.appendChild(text);
      el.appendChild(label);
      if (input.checked) el.classList.add('mp-checked');
    });
  }

  // ============================================================
  // 18. Phase 12 — Cross-references
  // ============================================================
  function resolveCrossReferences() {
    document.querySelectorAll('mp-ref[target]').forEach(function(ref) {
      var targetId = ref.getAttribute('target');
      var target = document.getElementById(targetId);
      var fmt = ref.getAttribute('format') || 'number';
      if (!target) {
        ref.classList.add('mp-ref-broken');
        ref.textContent = '[' + targetId + '?]';
        return;
      }
      var tag = target.tagName.toLowerCase();
      var num = target.getAttribute('data-mp-number') || '?';
      var name = target.getAttribute('name');
      var lab = label(tag);
      var text;
      switch (fmt) {
        case 'label':  text = lab; break;
        case 'name':   text = name || (lab + ' ' + num); break;
        case 'full':   text = lab + ' ' + num + (name ? ' — ' + name : ''); break;
        default:       text = num;
      }
      var link = document.createElement('a');
      link.href = '#' + targetId;
      link.className = 'mp-ref-link';
      link.textContent = text;
      ref.innerHTML = '';
      ref.appendChild(link);
    });
  }

  // ============================================================
  // 19. Anchor-jump flash highlight (shared by citations & footnotes)
  // ============================================================
  function flashHighlight(el) {
    if (!el) return;
    el.classList.remove('mp-flash');
    void el.offsetWidth; // force reflow so the animation restarts
    el.classList.add('mp-flash');
    setTimeout(function() { el.classList.remove('mp-flash'); }, 1200);
  }

  function supDigits(n) {
    var m = {'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};
    return String(n).split('').map(function(d) { return m[d] || d; }).join('');
  }

  // ============================================================
  // 19a. Void-tag normalization
  // HTML5 doesn't allow self-closing custom tags: `<mp-cite-entry ... />` is parsed
  // as an opening tag, and every following sibling gets nested as a child. For tags
  // that we treat as void (no author-supplied content), we move every child out to
  // become a sibling so authors can keep the cleaner self-closing style.
  // ============================================================
  function normalizeSelfClosing(tag) {
    // Lift every child out to become a sibling immediately after el. We pin the
    // anchor before the loop because el.nextSibling shifts after each insertion,
    // which would otherwise reverse the children's order.
    document.querySelectorAll(tag).forEach(function(el) {
      var anchor = el.nextSibling;
      while (el.firstChild) {
        el.parentNode.insertBefore(el.firstChild, anchor);
      }
    });
  }

  // ============================================================
  // 19b. Bibliography & citations
  // <mp-bibliography style="numeric|author-year|alpha"> wraps <mp-cite-entry id="...">.
  // <mp-cite ref="x"> in the text renders as a clickable [N] (or "Author Year"),
  // where N is the position of the matching entry inside its bibliography (1-based).
  // ============================================================
  var bibIndex = {}; // ref id -> { number, style, authorYear }

  function escAttr(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function formatBibEntry(e, style) {
    var type   = e.getAttribute('type') || 'misc';
    var author = e.getAttribute('author') || '';
    var title  = e.getAttribute('title') || '';
    var year   = e.getAttribute('year') || '';
    var journal = e.getAttribute('journal') || '';
    var publisher = e.getAttribute('publisher') || '';
    var volume = e.getAttribute('volume') || '';
    var number = e.getAttribute('number') || '';
    var pages  = e.getAttribute('pages') || '';
    var edition = e.getAttribute('edition') || '';
    var url    = e.getAttribute('url') || '';
    var doi    = e.getAttribute('doi') || '';
    var parts = [];
    if (author) parts.push(escAttr(author));
    if (type === 'article') {
      if (title) parts.push('« ' + escAttr(title) + ' »');
      if (journal) parts.push('<em>' + escAttr(journal) + '</em>');
      if (volume) parts.push('vol. ' + escAttr(volume));
      if (number) parts.push('n° ' + escAttr(number));
      if (pages) parts.push('p. ' + escAttr(pages));
    } else { // book, misc, thesis, etc.
      if (title) parts.push('<em>' + escAttr(title) + '</em>');
      if (edition) parts.push(escAttr(edition) + 'e éd.');
      if (publisher) parts.push(escAttr(publisher));
      if (pages) parts.push('p. ' + escAttr(pages));
    }
    if (year) parts.push(escAttr(year));
    var out = parts.join(', ');
    if (out && !out.match(/[.!?]\s*$/)) out += '.';
    if (doi) out += ' <a href="https://doi.org/' + escAttr(doi) + '" target="_blank" rel="noopener">doi:' + escAttr(doi) + '</a>';
    else if (url) out += ' <a href="' + escAttr(url) + '" target="_blank" rel="noopener">' + escAttr(url) + '</a>';
    return out;
  }

  function shortAuthorYear(e) {
    // "Hardy, G. H." -> "Hardy". Multiple authors -> first et al.
    var a = (e.getAttribute('author') || '').split(/\s*(?:,\s*and\s*|;|&|\sand\s)\s*/)[0];
    var surname = a.split(',')[0].trim() || a.trim() || '?';
    var year = e.getAttribute('year') || '';
    return surname + (year ? ' ' + year : '');
  }

  function renderBibliography() {
    bibIndex = {};
    var course = document.querySelector('mp-course');
    var defaultStyle = (course && course.getAttribute('citation-style')) || 'numeric';
    document.querySelectorAll('mp-bibliography').forEach(function(bib) {
      var style = bib.getAttribute('style') || defaultStyle;
      var title = bib.getAttribute('title') || label('mp-bibliography');
      var entries = bib.querySelectorAll(':scope > mp-cite-entry');
      var rows = [];
      entries.forEach(function(e, i) {
        var id = e.id || ('cite-entry-' + (i + 1));
        e.id = id;
        var n = i + 1;
        bibIndex[id] = { number: n, style: style, authorYear: shortAuthorYear(e) };
        var marker = (style === 'numeric') ? '[' + n + ']' : shortAuthorYear(e);
        rows.push(
          '<li id="bibitem-' + escAttr(id) + '" class="mp-bibitem" data-style="' + escAttr(style) + '">' +
          '<span class="mp-bibnum">' + escAttr(marker) + '</span>' +
          '<span class="mp-bibtext">' + formatBibEntry(e, style) + '</span>' +
          '</li>'
        );
      });
      bib.innerHTML = '<h2 class="mp-bibliography-title">' + escAttr(title) + '</h2>' +
                     '<ol class="mp-bibliography-list">' + rows.join('') + '</ol>';
    });
  }

  function renderCitations() {
    var firstCiteForRef = {};
    document.querySelectorAll('mp-cite[ref]').forEach(function(c, idx) {
      var ref = c.getAttribute('ref');
      var entry = bibIndex[ref];
      if (!entry) {
        c.innerHTML = '<span class="mp-cite-missing">[' + escAttr(ref) + '?]</span>';
        return;
      }
      var citeId = c.id || ('mp-cite-' + (idx + 1));
      c.id = citeId;
      if (!firstCiteForRef[ref]) firstCiteForRef[ref] = citeId;
      var marker = (entry.style === 'numeric') ? '[' + entry.number + ']' : entry.authorYear;
      c.innerHTML = '<a href="#bibitem-' + escAttr(ref) + '" class="mp-cite-link" data-ref="' + escAttr(ref) + '">' + escAttr(marker) + '</a>';
    });

    // Append a back-arrow to each bibliography entry that has at least one citation.
    // It points at the first citation initially, then updates to the most recently
    // clicked one (tracked via a delegated click handler below).
    Object.keys(firstCiteForRef).forEach(function(ref) {
      var entry = document.getElementById('bibitem-' + ref);
      if (!entry) return;
      var bibText = entry.querySelector('.mp-bibtext');
      if (!bibText || bibText.querySelector('.mp-bibback')) return;
      var back = document.createElement('a');
      back.className = 'mp-bibback';
      back.href = '#' + firstCiteForRef[ref];
      back.title = 'Retour au texte';
      back.setAttribute('aria-label', 'Retour au texte');
      back.innerHTML = ' <i class="fas fa-undo-alt"></i>';
      bibText.appendChild(back);
    });

    // Track last-clicked citation so the back-arrow returns to that exact spot,
    // and flash-highlight the destination so the eye lands on it after the scroll.
    document.addEventListener('click', function(e) {
      var citeLink = e.target.closest('.mp-cite-link');
      if (citeLink) {
        var ref = citeLink.getAttribute('data-ref');
        var origin = citeLink.closest('mp-cite');
        var entry = document.getElementById('bibitem-' + ref);
        if (entry) {
          if (origin && origin.id) {
            var back = entry.querySelector('.mp-bibback');
            if (back) back.href = '#' + origin.id;
          }
          setTimeout(function() { flashHighlight(entry); }, 400);
        }
        return;
      }
      var backLink = e.target.closest('.mp-bibback');
      if (backLink) {
        var href = backLink.getAttribute('href');
        if (href && href.charAt(0) === '#') {
          var target = document.getElementById(href.substring(1));
          setTimeout(function() { flashHighlight(target); }, 400);
        }
      }
    });
  }

  // ============================================================
  // 19d. Footnotes (<mp-footnote>content</mp-footnote>)
  // Auto-collected at end of each chapter (mode "chapter"), or end of document
  // (mode "document"), or shown inline as a popover (mode "popover"). The mode
  // is `auto` by default: chapter if <mp-chapter> exist, document otherwise.
  // ============================================================
  function renderFootnotes() {
    var course = document.querySelector('mp-course') || document.body;
    var modeAttr = (course.getAttribute && course.getAttribute('footnotes-collect')) || 'auto';
    var mode = modeAttr;
    if (mode === 'auto') {
      mode = course.querySelector && course.querySelector('mp-chapter') ? 'chapter' : 'document';
    }

    function buildSection(scope, prefix) {
      var notes = scope.querySelectorAll('mp-footnote');
      if (!notes.length) return;
      var ol = document.createElement('ol');
      ol.className = 'mp-footnote-list';
      var counter = 0;
      notes.forEach(function(fn) {
        counter++;
        var noteId = 'footnote-' + prefix + '-' + counter;
        var callId = 'fncall-' + prefix + '-' + counter;
        var contentHtml = fn.innerHTML;

        var sup = document.createElement('sup');
        sup.className = 'mp-footnote-call';
        sup.id = callId;
        sup.innerHTML = '<a href="#' + noteId + '" data-fnref="' + noteId + '">' + supDigits(counter) + '</a>';
        fn.parentNode.replaceChild(sup, fn);

        var li = document.createElement('li');
        li.id = noteId;
        li.className = 'mp-footnote-item';
        li.innerHTML = '<span class="mp-footnote-num">' + counter + '.</span> ' +
                       '<span class="mp-footnote-text">' + contentHtml + ' ' +
                       '<a class="mp-footnote-back" href="#' + callId + '" title="Retour au texte" aria-label="Retour au texte"><i class="fas fa-undo-alt"></i></a>' +
                       '</span>';
        ol.appendChild(li);
      });
      var section = document.createElement('section');
      section.className = 'mp-footnotes';
      section.innerHTML = '<h3 class="mp-footnotes-title">' + label('mp-footnotes') + '</h3>';
      section.appendChild(ol);
      scope.appendChild(section);
    }

    if (mode === 'chapter') {
      course.querySelectorAll('mp-chapter').forEach(function(ch, i) {
        buildSection(ch, 'ch' + (i + 1));
      });
    } else {
      buildSection(course, 'doc');
    }

    // Click delegation: update back-arrow and flash-highlight destination.
    document.addEventListener('click', function(e) {
      var call = e.target.closest('a[data-fnref]');
      if (call) {
        var noteId = call.getAttribute('data-fnref');
        var sup = call.closest('.mp-footnote-call');
        var note = document.getElementById(noteId);
        if (note && sup && sup.id) {
          var back = note.querySelector('.mp-footnote-back');
          if (back) back.href = '#' + sup.id;
          setTimeout(function() { flashHighlight(note); }, 400);
        }
        return;
      }
      var fnback = e.target.closest('.mp-footnote-back');
      if (fnback) {
        var href = fnback.getAttribute('href');
        if (href && href.charAt(0) === '#') {
          var target = document.getElementById(href.substring(1));
          setTimeout(function() { flashHighlight(target); }, 400);
        }
      }
    });
  }

  // ============================================================
  // 19c. Table of contents (<mp-toc depth="1|2|3" title="...">)
  // Walks <mp-chapter> (depth 1), then their <mp-section> (depth 2), then any
  // nested <mp-section> inside (depth 3). Uses the data-mp-number attribute set
  // by renderSectioning for the numbering.
  // ============================================================
  function tocItemHtml(el, depth, maxDepth) {
    if (depth > maxDepth) return '';
    var titleEl = el.querySelector(':scope > mp-title');
    // Strip the numbering prepended by renderSectioning, but keep inline HTML
    // (including <span class="katex"> if KaTeX has already rendered, and $...$
    // not yet rendered at this point — a KaTeX re-render on the toc handles those).
    var titleHtml = '';
    if (titleEl) {
      Array.from(titleEl.childNodes).forEach(function(n) {
        if (n.nodeType === 1) {
          if (n.classList.contains('mp-sectioning-label') ||
              n.classList.contains('mp-section-number') ||
              n.classList.contains('mp-subsection-number')) return;
          titleHtml += n.outerHTML;
        } else if (n.nodeType === 3) {
          titleHtml += n.textContent
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
      });
      titleHtml = titleHtml.trim();
    }
    var num = el.getAttribute('data-mp-number') || '';
    var id = el.id;
    var html = '<li class="mp-toc-item mp-toc-depth-' + depth + '">' +
               '<a href="#' + escAttr(id) + '">' +
               (num ? '<span class="mp-toc-num">' + escAttr(num) + '</span> ' : '') +
               titleHtml +
               '</a>';
    if (depth < maxDepth) {
      // Descend the right tag at each level: chapter > section > subsection.
      var childTag = (depth === 1) ? 'mp-section' : 'mp-subsection';
      var children = el.querySelectorAll(':scope > ' + childTag);
      if (children.length) {
        html += '<ul>';
        children.forEach(function(c) { html += tocItemHtml(c, depth + 1, maxDepth); });
        html += '</ul>';
      }
    }
    return html + '</li>';
  }

  function renderToc() {
    document.querySelectorAll('mp-toc').forEach(function(toc) {
      // Default depth = 3 so subsections show up too (matches LaTeX default).
      var depth = parseInt(toc.getAttribute('depth') || '3', 10);
      var title = toc.getAttribute('title') || label('mp-toc');
      var root = toc.closest('mp-course') || document;
      var chapters = root.querySelectorAll(':scope > mp-chapter, mp-course > mp-chapter');
      var items = [];
      chapters.forEach(function(ch) { items.push(tocItemHtml(ch, 1, depth)); });
      toc.innerHTML = '<h2 class="mp-toc-title">' + escAttr(title) + '</h2>' +
                     '<ul class="mp-toc-list">' + items.join('') + '</ul>';
      // Re-run KaTeX in case auto-render already ran before the TOC was built
      // — $...$ in section titles will then be rendered correctly.
      if (typeof window.renderMathInElement === 'function') {
        try {
          window.renderMathInElement(toc, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$',  right: '$',  display: false }
            ]
          });
        } catch (e) { /* best-effort */ }
      }
      if (toc.getAttribute('layout') === 'sidebar') {
        document.body.classList.add('mp-has-toc-sidebar');
        setupTocHighlight(toc);
      }
    });
  }

  // ============================================================
  // 19c-bis. List of figures / list of tables (<mp-lof> / <mp-lot>)
  // Walks every <mp-figure> / <table.tp-table> in document order and builds
  // a clickable list with its number + caption text.
  // ============================================================
  function buildEntryList(items, titleKey) {
    var lis = items.map(function(it) {
      return '<li class="mp-lof-item">' +
             '<a href="#' + escAttr(it.id) + '">' +
             '<span class="mp-lof-num">' + escAttr(it.num) + '</span> ' +
             escAttr(it.text) +
             '</a></li>';
    });
    return '<h2 class="mp-toc-title">' + escAttr(label(titleKey)) + '</h2>' +
           '<ul class="mp-toc-list mp-lof-list">' + lis.join('') + '</ul>';
  }

  function captionText(el) {
    if (!el) return '';
    var clone = el.cloneNode(true);
    // Drop the injected "Figure N — " / "Tableau N" label span.
    clone.querySelectorAll('.mp-fig-label').forEach(function(n) { n.remove(); });
    return clone.textContent.replace(/\s+/g, ' ').trim();
  }

  // Prepend "Tableau N — " to every converter table caption (mirrors the
  // "Figure N — " prefix renderFigures injects). data-mp-number is set by
  // the converter in document order.
  function renderTableNumbers() {
    document.querySelectorAll('table.tp-table[data-mp-number]').forEach(function(tbl) {
      var cap = tbl.querySelector(':scope > caption');
      if (!cap || cap.querySelector('.mp-fig-label')) return;
      if (!cap.textContent.trim()) return; // no caption text → don't number
      var lbl = document.createElement('span');
      lbl.className = 'mp-fig-label';
      lbl.textContent = label('table') + ' ' + tbl.getAttribute('data-mp-number') + ' — ';
      cap.insertBefore(lbl, cap.firstChild);
    });
  }

  function renderListOfFigures() {
    document.querySelectorAll('mp-lof').forEach(function(lof) {
      var items = [];
      document.querySelectorAll('mp-figure[data-mp-number]').forEach(function(fig) {
        var txt = captionText(fig.querySelector(':scope > mp-caption'));
        if (!txt) return; // a figure without a caption has no LOF entry
        items.push({ id: fig.id, num: fig.getAttribute('data-mp-number'), text: txt });
      });
      lof.innerHTML = buildEntryList(items, 'mp-lof');
    });
  }

  function renderListOfTables() {
    document.querySelectorAll('mp-lot').forEach(function(lot) {
      var items = [];
      document.querySelectorAll('table.tp-table[data-mp-number]').forEach(function(tbl) {
        var txt = captionText(tbl.querySelector(':scope > caption'));
        if (!txt) return; // a table without a caption has no LOT entry
        // Tables without a \label get no id from the converter — give them
        // one so the list entry can link to them.
        ensureId(tbl, 'mp-table-' + tbl.getAttribute('data-mp-number'));
        items.push({ id: tbl.id, num: tbl.getAttribute('data-mp-number'), text: txt });
      });
      lot.innerHTML = buildEntryList(items, 'mp-lot');
    });
  }

  function setupTocHighlight(toc) {
    if (!('IntersectionObserver' in window)) return;
    var idToLink = {};
    toc.querySelectorAll('.mp-toc-item > a').forEach(function(a) {
      var href = a.getAttribute('href');
      if (href && href.charAt(0) === '#') idToLink[href.substring(1)] = a;
    });
    if (!Object.keys(idToLink).length) return;
    var active = null;
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting && idToLink[e.target.id]) {
          if (active) active.classList.remove('mp-toc-active');
          active = idToLink[e.target.id];
          active.classList.add('mp-toc-active');
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    Object.keys(idToLink).forEach(function(id) {
      var el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }

  // ============================================================
  // 19. Phase 13 — Code blocks (Python only via Skulpt)
  // ============================================================
  function setupCodeBlocks() {
    var blocks = document.querySelectorAll('mp-code');
    if (blocks.length === 0) return;

    // Pre-load CSS for any non-'neat' theme referenced on the page (neat is
    // already loaded at startup). Single pass to deduplicate.
    var themesSeen = {};
    blocks.forEach(function(el) {
      var th = el.getAttribute('theme') || 'neat';
      if (th !== 'neat') themesSeen[th] = true;
    });
    Object.keys(themesSeen).forEach(function(th) {
      loadCSS('https://cdn.jsdelivr.net/npm/codemirror@5.58.3/theme/' + th + '.css');
    });

    function process() {
      blocks.forEach(function(el, i) {
        var runnable = el.hasAttribute('runnable');
        var width  = parseInt(el.getAttribute('width'),  10) || 500;
        var height = parseInt(el.getAttribute('height'), 10) || 200;
        var theme  = el.getAttribute('theme') || 'neat';
        setupPythonCode(el, i, width, height, theme, runnable);
      });
    }

    if (typeof CodeMirror === 'undefined') {
      // Lazy-load CodeMirror 5.58 (lib + python mode). Theme CSS already loaded
      // at startup. Chain lib → mode (sequential because the mode depends on
      // CodeMirror), then render.
      loadCSS('https://cdn.jsdelivr.net/npm/codemirror@5.58.3/lib/codemirror.css');
      var s1 = document.createElement('script');
      s1.src = 'https://cdn.jsdelivr.net/npm/codemirror@5.58.3/lib/codemirror.min.js';
      s1.onload = function() {
        var s2 = document.createElement('script');
        s2.src = 'https://cdn.jsdelivr.net/npm/codemirror@5.58.3/mode/python/python.min.js';
        s2.onload = process;
        document.head.appendChild(s2);
      };
      document.head.appendChild(s1);
    } else {
      process();
    }
  }

  function trim(text) {
    return text.replace(/^\n+/, '').replace(/\s+$/, '');
  }

  function setupPythonCode(el, i, width, height, theme, runnable) {
    var src = trim(el.textContent);
    el.innerHTML = '';
    el.classList.add('mp-code', 'mp-code-python');

    // Constrain the whole code unit to the given width, centered
    el.style.maxWidth = width + 'px';
    el.style.width = '100%';

    var ta = document.createElement('textarea');
    ta.id = 'mp-code-python-' + i;
    ta.value = src;
    el.appendChild(ta);

    if (runnable) {
      var btn = document.createElement('a');
      btn.className = 'btnPython';
      btn.textContent = label('mp-run');
      btn.addEventListener('click', function() { runPython(i); });
      el.appendChild(btn);

      var canvas = document.createElement('div');
      canvas.id = 'mp-pycanvas-' + i;
      canvas.className = 'tortue';
      el.appendChild(canvas);

      var pre = document.createElement('pre');
      pre.id = 'mp-pyoutput-' + i;
      pre.className = 'outputPython';
      el.appendChild(pre);

      var pgcanvas = document.createElement('div');
      pgcanvas.id = 'mp-pgcanvas-' + i;
      pgcanvas.style.display = 'none';
      el.appendChild(pgcanvas);
    }

    if (typeof CodeMirror !== 'undefined') {
      editorPython[i] = CodeMirror.fromTextArea(ta, {
        mode: { name: 'text/x-cython', version: 3, singleLineStringErrors: false },
        lineNumbers: true,
        indentUnit: 4,
        indentWithTabs: false,
        matchBrackets: true,
        theme: theme,
        extraKeys: {
          // Python is strict about mixed tabs/spaces. Force Tab to insert
          // 4 spaces instead of \t, and Shift-Tab to unindent.
          Tab: function(cm) {
            if (cm.somethingSelected()) {
              cm.indentSelection('add');
            } else {
              cm.replaceSelection(Array(cm.getOption('indentUnit') + 1).join(' '), 'end');
            }
          },
          'Shift-Tab': function(cm) { cm.indentSelection('subtract'); }
        },
        // viewportMargin:Infinity → renders all lines (no virtual scrolling).
        // Combined with the .mp-code .CodeMirror{height:auto} CSS override
        // that disables CodeMirror's internal sizing, this forces all code
        // to be visible at once.
        viewportMargin: Infinity
      });
      // setSize(null, null): delegate sizing entirely to CSS
      // (.mp-code handles overflow-x, .CodeMirror uses width:max-content +
      // height:auto). setSize(width,...) would set an inline style="width:500px"
      // that prevents content from growing beyond that width.
      editorPython[i].setSize(null, null);
      editorPython[i].refresh();
    }
  }

  function runPython(i) {
    var pre = document.getElementById('mp-pyoutput-' + i);

    // Lazy-load Skulpt (in-browser Python interpreter) + its stdlib on the first
    // Run click. Once loaded, call runPython again.
    if (typeof Sk === 'undefined') {
      if (pre) pre.innerHTML = 'Chargement de l\'interpréteur Python…';
      var s1 = document.createElement('script');
      s1.src = 'https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js';
      s1.onload = function() {
        var s2 = document.createElement('script');
        s2.src = 'https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt-stdlib.js';
        s2.onload = function() { runPython(i); };
        s2.onerror = function() { if (pre) pre.innerHTML = 'Erreur chargement Skulpt stdlib.'; };
        document.head.appendChild(s2);
      };
      s1.onerror = function() { if (pre) pre.innerHTML = 'Erreur chargement Skulpt.'; };
      document.head.appendChild(s1);
      return;
    }

    var prog = editorPython[i].getValue();
    // Normalize tabs → 4 spaces: if the user pasted code with \t characters
    // (or an old file contains them), Python/Skulpt crashes on mixed tabs +
    // spaces in the same indentation level. Safer to convert everything to
    // spaces before execution.
    prog = prog.replace(/\t/g, '    ');
    var canvas = document.getElementById('mp-pycanvas-' + i);
    var pgcanvas = document.getElementById('mp-pgcanvas-' + i);

    if (prog.indexOf('pygame') > -1) {
      pgcanvas.style.display = 'block';
    } else {
      pgcanvas.style.display = 'none';
      var hasTurtle = prog.indexOf('turtle') > -1;
      canvas.style.display = hasTurtle ? 'block' : 'none';
      pre.innerHTML = '';
      window['mpPyOut_' + i] = function(t) {
        var p = document.getElementById('mp-pyoutput-' + i);
        p.innerHTML += t;
      };
      Sk.pre = 'mp-pyoutput-' + i;
      Sk.configure({ output: window['mpPyOut_' + i], read: builtinRead, __future__: Sk.python3 });
      (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'mp-pycanvas-' + i;
      Sk.misceval.asyncToPromise(function() {
        return Sk.importMainWithBody('<stdin>', false, prog, true);
      }).then(function() {}, function(err) {
        pre.innerHTML = err.toString();
      });
    }
  }
  function builtinRead(x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles.files[x] === undefined) {
      throw "File not found: '" + x + "'";
    }
    return Sk.builtinFiles.files[x];
  }
  window.mpRunPython = runPython;

  // ============================================================
  // 20. Phase 14 — JSXGraph blocks (mp-jsxgraph) — manipulable curves
  // ============================================================
  function setupJSXGraphBlocks() {
    var blocks = document.querySelectorAll('mp-jsxgraph');
    if (blocks.length === 0) return;

    if (typeof JXG === 'undefined') {
      // Lazy-load JSXGraph
      loadCSS('https://cdn.jsdelivr.net/npm/jsxgraph/distrib/jsxgraph.css');
      var s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/jsxgraph/distrib/jsxgraphcore.js';
      s.onload = function() { renderJSXGraphBlocks(blocks); };
      document.head.appendChild(s);
    } else {
      renderJSXGraphBlocks(blocks);
    }
  }

  function renderJSXGraphBlocks(blocks) {
    // Native KaTeX rendering for JSXGraph text/label/name. Combined with
    // ignoredTags=['mp-jsxgraph'] on the file's renderMathInElement call,
    // this gives exactly one KaTeX pass per `$...$` inside a board.
    if (window.katex && typeof JXG !== 'undefined' && JXG.Options && JXG.Options.text) {
      JXG.Options.text.useKatex = true;
    }
    blocks.forEach(function(el, i) {
      var width  = parseInt(el.getAttribute('width'),  10) || 400;
      var height = parseInt(el.getAttribute('height'), 10) || 400;
      var bounds = (el.getAttribute('bounds') || '-5,5,5,-5').split(',').map(parseFloat);
      var axis = el.getAttribute('axis') !== 'false';
      var grid = el.getAttribute('grid') === 'true';
      // pan is disabled by default (figures stay fixed). Author can re-enable
      // with `pan` or `pan="true"` on <mp-jsxgraph>.
      var panAttr = el.getAttribute('pan');
      var panEnabled = panAttr !== null && panAttr !== 'false';
      // zoom follows the same rule: off by default, on if `zoom` attribute present.
      var zoomAttr = el.getAttribute('zoom');
      var zoomEnabled = zoomAttr !== null && zoomAttr !== 'false';
      // highlight (mouseover effect on points/curves) is off by default for a
      // static-figure feel. Author can re-enable with `highlight` on the block,
      // or per-element by passing `{highlight: true}` in the create() options.
      var highlightAttr = el.getAttribute('highlight');
      var highlightEnabled = highlightAttr !== null && highlightAttr !== 'false';

      var src = trim(el.textContent);
      // JSXGraph's useKatex expects raw LaTeX (no `$..$` delimiters). Strip
      // the surrounding `$` from string literals so authors can keep the
      // mathpad convention `'$D$'` and still get a correctly-rendered label.
      // Matches 'X', "X", `X` when wrapped in $..$ with no other quote/$ inside.
      src = src.replace(/(['"`])\$([^'"`$]+)\$\1/g, '$1$2$1');
      var boxId = 'mp-jsxgraph-' + i;
      el.innerHTML = '';
      el.classList.add('mp-jsxgraph');
      el.style.maxWidth = width + 'px';
      el.style.margin = '1.2em auto';
      el.style.display = 'block';

      var box = document.createElement('div');
      box.id = boxId;
      box.className = 'jxgbox';
      box.style.width = width + 'px';
      box.style.height = height + 'px';
      box.style.margin = '0 auto';
      el.appendChild(box);

      try {
        var board = JXG.JSXGraph.initBoard(boxId, {
          boundingbox: bounds,
          axis: axis,
          grid: grid,
          showCopyright: false,
          showNavigation: false,
          keepAspectRatio: false,
          pan:  { enabled: panEnabled,  needShift: false, needTwoFingers: false },
          zoom: { enabled: zoomEnabled, factorX: 1.25, factorY: 1.25, wheel: zoomEnabled, needShift: false }
        });
        // Inject highlight: false in every create() call unless the author asks otherwise.
        if (!highlightEnabled) {
          var origCreate = board.create.bind(board);
          board.create = function(type, parents, attrs) {
            attrs = attrs || {};
            if (attrs.highlight === undefined) attrs.highlight = false;
            return origCreate(type, parents, attrs);
          };
        }
        // eslint-disable-next-line no-new-func
        var fn = new Function('board', 'JXG', src);
        fn(board, JXG);
        // Mobile UX: JSXGraph sets `touch-action: none` on .jxgbox to intercept
        // drag/pinch. If both pan AND zoom are disabled on this board (the default
        // for "static" figures), restore vertical page scrolling when the finger
        // is on the SVG — otherwise the student can't scroll the course on mobile.
        if (!panEnabled && !zoomEnabled) {
          box.style.touchAction = 'pan-y';
        }
      } catch (e) {
        console.error('mp-jsxgraph error:', e);
        var err = document.createElement('div');
        err.className = 'mp-error';
        err.textContent = 'JSXGraph error: ' + e.message;
        el.appendChild(err);
      }
    });
    // JSXGraph is lazy-loaded, so autoWrapOverflow triggered in init() may have
    // run before the boards were painted. Re-trigger a pass so that any
    // mp-jsxgraph wider than its parent gets properly wrapped in a scrollable
    // .mp-overflow-wrap.
    if (typeof autoWrapOverflow === 'function') {
      autoWrapOverflow();
    }
  }

  // ============================================================
  // 20c. Phase 14c — Spreadsheet blocks (mp-spreadsheet) — Excel-like grid
  // Port of Fabrice's custom vanilla-JS spreadsheet from 1st2s_exercice_08.html.
  // State of each spreadsheet is persisted in its data-state attribute as JSON,
  // so saving the cours HTML is enough to round-trip cell values and colors.
  // ============================================================
  function setupSpreadsheets() {
    document.querySelectorAll('mp-spreadsheet').forEach(function(el, idx) {
      if (el.classList.contains('mp-spreadsheet-built')) return;
      buildSpreadsheet(el, idx);
    });
  }

  function buildSpreadsheet(el, idx) {
    var rowsAttr = parseInt(el.getAttribute('rows'), 10);
    var colsAttr = parseInt(el.getAttribute('cols'), 10);
    var rows = (rowsAttr > 0) ? rowsAttr : 10;
    var cols = (colsAttr > 0) ? colsAttr : 10;
    var maxHeight = parseInt(el.getAttribute('max-height'), 10) || 350;
    var id = el.id || ('mp-spreadsheet-' + (idx + 1));
    el.id = id;

    // Read initial state. Priority: data-state JSON > <mp-cell> children.
    var data = {};
    var colors = {};
    var stateAttr = el.getAttribute('data-state');
    if (stateAttr && stateAttr.trim() && stateAttr.trim() !== '{}') {
      try {
        var parsed = JSON.parse(stateAttr);
        data = parsed.cells || {};
        colors = parsed.colors || {};
      } catch (e) {
        console.warn('mp-spreadsheet ' + id + ': invalid data-state JSON', e);
      }
    } else {
      el.querySelectorAll(':scope > mp-cell').forEach(function(c) {
        var at = c.getAttribute('at');
        if (!at) return;
        var text = c.textContent.trim();
        if (text) data[at] = text;
        var color = c.getAttribute('color');
        if (color) colors[at] = color;
      });
    }

    // Build UI
    el.innerHTML = '';
    el.classList.add('mp-spreadsheet-built');
    var container = document.createElement('div');
    container.className = 'mp-spreadsheet-container';
    container.style.maxHeight = maxHeight + 'px';
    el.appendChild(container);
    var table = document.createElement('table');
    table.className = 'mp-spreadsheet-grid';
    table.id = id + '-grid';
    container.appendChild(table);

    // Per-instance state
    var inputs = {};
    var values = {};
    var editingInput = null;
    var isTouchingHandle = false;
    var fillHandle = null;

    // Header row
    var headerRow = document.createElement('tr');
    headerRow.appendChild(document.createElement('th'));
    for (var c = 0; c < cols; c++) {
      var th = document.createElement('th');
      th.textContent = String.fromCharCode(65 + c);
      headerRow.appendChild(th);
    }
    table.appendChild(headerRow);

    // Data rows
    for (var r = 1; r <= rows; r++) {
      var tr = document.createElement('tr');
      var rowTh = document.createElement('th');
      rowTh.textContent = r;
      tr.appendChild(rowTh);
      for (var col = 0; col < cols; col++) {
        var cellId = String.fromCharCode(65 + col) + r;
        var cell = document.createElement('td');
        var input = document.createElement('textarea');
        inputs[cellId] = input;
        input.setAttribute('data-cell', cellId);
        attachCellListeners(input, cell, cellId);
        cell.appendChild(input);
        tr.appendChild(cell);
      }
      table.appendChild(tr);
    }

    // Apply initial colors
    Object.keys(colors).forEach(function(cellId) {
      if (inputs[cellId]) inputs[cellId].style.backgroundColor = colors[cellId];
    });

    recalcAll();
    saveState(); // ensure data-state reflects the parsed state even if it came from <mp-cell> children

    // === Helpers ===
    function parseCellId(cid) {
      var c = cid.charCodeAt(0) - 65;
      var r = parseInt(cid.slice(1), 10);
      return [c, r];
    }
    function expandRange(start, end) {
      var s = parseCellId(start), e = parseCellId(end);
      var refs = [];
      for (var rr = Math.min(s[1], e[1]); rr <= Math.max(s[1], e[1]); rr++) {
        for (var cc = Math.min(s[0], e[0]); cc <= Math.max(s[0], e[0]); cc++) {
          refs.push(String.fromCharCode(65 + cc) + rr);
        }
      }
      return refs;
    }
    function expandArgs(inner) {
      var parts = inner.split(/[\s;]+/).reduce(function(acc, p) {
        if (p.indexOf(':') !== -1) {
          var ab = p.split(':');
          return acc.concat(expandRange(ab[0], ab[1]));
        }
        if (p) acc.push(p);
        return acc;
      }, []);
      return parts.map(function(ref) {
        var v = values[ref] !== undefined ? values[ref] : 0;
        var n = parseFloat(v);
        return isNaN(n) ? 0 : n;
      });
    }
    function autoResize(textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
    function safeEval(expr) {
      // After substitutions, expression should only contain numbers, operators,
      // parentheses, and whitespace. Reject anything else (= protection against
      // a student writing "=alert(1)" or similar).
      if (!/^[\d+\-*/().,\s eE]+$/.test(expr)) {
        throw new Error('Unsafe expression: ' + expr);
      }
      // eslint-disable-next-line no-eval
      return eval(expr);
    }

    function recalcAll() {
      // Reset values with raw content
      Object.keys(data).forEach(function(k) { values[k] = data[k]; });

      // Evaluate formulas
      Object.keys(data).forEach(function(k) {
        var formula = data[k];
        if (typeof formula !== 'string' || !formula.startsWith('=')) return;
        try {
          var expr = formula.slice(1);
          // SOMME
          expr = expr.replace(/SOMME\(([^)]+)\)/gi, function(_, inner) {
            return expandArgs(inner).reduce(function(s, n) { return s + n; }, 0);
          });
          // MOYENNE
          expr = expr.replace(/MOYENNE\(([^)]+)\)/gi, function(_, inner) {
            var ns = expandArgs(inner);
            return ns.length ? ns.reduce(function(s, n) { return s + n; }, 0) / ns.length : 0;
          });
          // MIN, MAX
          expr = expr.replace(/MIN\(([^)]+)\)/gi, function(_, inner) {
            return Math.min.apply(Math, expandArgs(inner));
          });
          expr = expr.replace(/MAX\(([^)]+)\)/gi, function(_, inner) {
            return Math.max.apply(Math, expandArgs(inner));
          });
          // NB (count of non-zero numbers in range)
          expr = expr.replace(/NB\(([^)]+)\)/gi, function(_, inner) {
            return expandArgs(inner).length;
          });
          // Cell refs with optional $ for absolute
          expr = expr.replace(/\$?[A-Z]\$?[0-9]+/g, function(ref) {
            var clean = ref.replace(/\$/g, '');
            var v = values[clean] !== undefined ? values[clean] : 0;
            var n = parseFloat(v);
            return isNaN(n) ? 0 : n;
          });
          values[k] = Math.round(safeEval(expr) * 10000) / 10000;
        } catch (err) {
          values[k] = '#ERR';
        }
      });

      // Update display (skip the cell currently being edited)
      Object.keys(inputs).forEach(function(cid) {
        var inp = inputs[cid];
        if (document.activeElement !== inp) {
          inp.value = values[cid] !== undefined ? values[cid] : '';
          autoResize(inp);
        }
      });
    }

    function saveState() {
      el.setAttribute('data-state', JSON.stringify({ cells: data, colors: colors }));
    }

    // === Cell listeners ===
    function attachCellListeners(input, cell, cellId) {
      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          data[cellId] = input.value;
          recalcAll();
          saveState();
          input.blur();
        } else if (e.key === 'Escape') {
          input.value = data[cellId] || '';
          input.blur();
        }
      });

      input.addEventListener('focus', function() {
        editingInput = input;
        // Show the raw formula instead of computed value when entering edit mode
        if (data[cellId] && input.value !== data[cellId]) {
          input.value = data[cellId];
        }
        addFillHandle(cell, cellId);
      });

      input.addEventListener('blur', function(e) {
        var related = e.relatedTarget;
        data[cellId] = input.value;
        if (data[cellId] === '') delete data[cellId];
        recalcAll();
        saveState();
        if (isTouchingHandle || (related && related.classList && related.classList.contains('mp-spreadsheet-fill-handle'))) {
          return;
        }
        editingInput = null;
        removeFillHandle();
        if (data[cellId] && data[cellId].toString().startsWith('=')) {
          input.value = values[cellId] !== undefined ? values[cellId] : '#ERR';
        }
      });
    }

    // === Fill handle (drag to copy formula with relative shift) ===
    function addFillHandle(cell, cellId) {
      removeFillHandle();
      fillHandle = document.createElement('div');
      fillHandle.className = 'mp-spreadsheet-fill-handle';
      fillHandle.setAttribute('tabindex', '-1');

      var hasBlurred = false;
      var previousTd = null;

      fillHandle.addEventListener('touchstart', function() {
        isTouchingHandle = true;
        setTimeout(function() { isTouchingHandle = false; }, 300);
      }, { passive: true });

      function startFill(cx, cy) {
        var originId = cellId;
        var originFormula = data[originId] || '';
        var originInput = inputs[originId];

        function moveTo(x, y) {
          var rect = container.getBoundingClientRect();
          if (y > rect.bottom - 20) container.scrollTop += 10;
          else if (y < rect.top + 20) container.scrollTop -= 10;
          if (!hasBlurred) { originInput.blur(); hasBlurred = true; }
          var t = document.elementFromPoint(x, y);
          if (!t) return;
          var td = t.closest('td');
          if (!td || !td.closest('.mp-spreadsheet-grid')) return;
          if (td.closest('.mp-spreadsheet-grid') !== table) return;
          if (previousTd && previousTd !== td) {
            previousTd.classList.remove('mp-spreadsheet-highlighted-target');
          }
          td.classList.add('mp-spreadsheet-highlighted-target');
          previousTd = td;
          var ta = td.querySelector('textarea');
          if (!ta) return;
          var targetId = ta.getAttribute('data-cell');
          if (targetId && targetId !== originId) {
            fillCells(originId, targetId, originFormula);
            recalcAll();
          }
        }
        function mm(e) { moveTo(e.clientX, e.clientY); }
        function tm(e) { if (e.touches.length) moveTo(e.touches[0].clientX, e.touches[0].clientY); }
        function stop() {
          document.removeEventListener('mousemove', mm);
          document.removeEventListener('mouseup', stop);
          document.removeEventListener('touchmove', tm);
          document.removeEventListener('touchend', stop);
          if (previousTd) { previousTd.classList.remove('mp-spreadsheet-highlighted-target'); previousTd = null; }
          saveState();
        }
        document.addEventListener('mousemove', mm);
        document.addEventListener('mouseup', stop);
        document.addEventListener('touchmove', tm, { passive: false });
        document.addEventListener('touchend', stop);
      }

      fillHandle.addEventListener('mousedown', function(e) {
        e.preventDefault();
        startFill(e.clientX, e.clientY);
      });
      fillHandle.addEventListener('touchstart', function(e) {
        e.preventDefault();
        if (e.touches.length) startFill(e.touches[0].clientX, e.touches[0].clientY);
      });

      cell.appendChild(fillHandle);
    }

    function removeFillHandle() {
      if (fillHandle && fillHandle.parentElement) {
        fillHandle.parentElement.removeChild(fillHandle);
        fillHandle = null;
      }
    }

    function fillCells(from, to, formula) {
      var f = parseCellId(from), t = parseCellId(to);
      var rowStep = t[1] - f[1], colStep = t[0] - f[0];
      var isVert = colStep === 0, isHoriz = rowStep === 0;
      if (!(isVert || isHoriz)) return;
      var count = Math.max(Math.abs(rowStep), Math.abs(colStep));
      var rSign = rowStep >= 0 ? 1 : -1;
      var cSign = colStep >= 0 ? 1 : -1;
      for (var i = 1; i <= count; i++) {
        var nc = f[0] + (isHoriz ? i * cSign : 0);
        var nr = f[1] + (isVert ? i * rSign : 0);
        if (nc < 0 || nc >= cols || nr < 1 || nr > rows) continue;
        var nid = String.fromCharCode(65 + nc) + nr;
        data[nid] = shiftFormula(formula, f[0], f[1], nc, nr);
      }
    }

    function shiftFormula(formula, c1, r1, c2, r2) {
      if (!formula || !formula.startsWith('=')) return formula;
      var dc = c2 - c1, dr = r2 - r1;
      return '=' + formula.slice(1).replace(/(\$?)([A-Z])(\$?)([0-9]+)/g, function(_, cf, cc, rf, rs) {
        var col = cc.charCodeAt(0) - 65;
        var row = parseInt(rs, 10);
        if (!cf) col += dc;
        if (!rf) row += dr;
        return (cf || '') + String.fromCharCode(65 + col) + (rf || '') + row;
      });
    }
  }

  // Click on another cell while editing a formula → insert its reference at cursor.
  // Attached once globally to avoid duplicate handlers per spreadsheet.
  document.addEventListener('mousedown', function(e) {
    var active = document.activeElement;
    if (!active || active.tagName !== 'TEXTAREA') return;
    if (!active.closest('.mp-spreadsheet-grid')) return;
    if (!active.value || !active.value.trim().startsWith('=')) return;
    var td = e.target.closest && e.target.closest('td');
    if (!td || !td.closest('.mp-spreadsheet-grid')) return;
    if (td.closest('.mp-spreadsheet-grid') !== active.closest('.mp-spreadsheet-grid')) return;
    var clicked = td.querySelector('textarea');
    if (!clicked || clicked === active) return;
    e.preventDefault();
    var ref = clicked.getAttribute('data-cell');
    if (!ref) return;
    var start = active.selectionStart, end = active.selectionEnd, v = active.value;
    active.value = v.slice(0, start) + ref + v.slice(end);
    active.selectionStart = active.selectionEnd = start + ref.length;
  });

  // ============================================================
  // 21. Phase 15 — Overflow auto-wrap
  // ============================================================
  function autoWrapOverflow() {
    var viewportWidth = document.documentElement.clientWidth || window.innerWidth;
    var candidates = document.querySelectorAll('table, svg, canvas, .katex-display, pre, .CodeMirror, mp-graph, mp-jsxgraph, .jxgbox');
    candidates.forEach(function(el) {
      if (el.closest('.mp-overflow-wrap')) return; // already wrapped
      var parent = el.parentElement;
      if (!parent) return;
      var parentWidth = parent.clientWidth;

      // A too-wide .katex-display used to be shrunk (font-size) to fit — but a
      // wide layout array could end up illegibly tiny. On the web there's no
      // page-count constraint : keep the formula at its natural size and let it
      // fall through to the horizontal-scroll wrap below, like tables/code.

      // Two overflow conditions to test:
      //   (a) INTERNAL overflow: scrollWidth - clientWidth > 4
      //       — for <pre>, .CodeMirror, .katex-display which are width-constrained
      //       but overflowed by their content.
      //   (b) EXTERNAL overflow: offsetWidth > parentWidth + 4
      //       — for <table>, <svg>, <canvas>, .jxgbox which expand to their content
      //       (scrollWidth == clientWidth) and exceed their parent.
      //       Concrete case: wide .mp-data in a mobile viewport.
      // 4 px tolerance: absorbs sub-pixels and flex rounding
      // (a \tag{N} in a katex-display can be 1-2 px without truly overflowing).
      // Reference bound: min(parent, viewport). If the parent itself expands to
      // its content (e.g. mp-pedagogical-body with no explicit width), we fall
      // back to at least the viewport to detect actual overflow.
      var refWidth = parentWidth > 0 ? Math.min(parentWidth, viewportWidth) : viewportWidth;
      var overflowsInside  = el.scrollWidth - el.clientWidth > 4;
      var overflowsOutside = el.offsetWidth > refWidth + 4;
      if (overflowsInside || overflowsOutside) {
        // If the target is inside a <p>, use an inline-block <span> —
        // a <div> would break the structure (invalid HTML). Typical case:
        // KaTeX renders $$..$$ as inline-flow inside a paragraph.
        var insideP = !!el.closest('p');
        var wrap = document.createElement(insideP ? 'span' : 'div');
        wrap.className = 'mp-overflow-wrap';
        if (insideP) wrap.classList.add('mp-overflow-wrap-inline');
        el.parentNode.insertBefore(wrap, el);
        wrap.appendChild(el);
      }
    });
  }

  // ============================================================
  // 22. Themes (preserved from original)
  // ============================================================
  var themesDisponibles = [
    { id: 'original',  nom: 'Original',  couleur: '#b8c8ec' },
    { id: 'classique', nom: 'Classique', couleur: '#60a5fa' },
    { id: 'ocean',     nom: 'Océan',     couleur: '#0891b2' },
    { id: 'foret',     nom: 'Forêt',     couleur: '#059669' },
    { id: 'lavande',   nom: 'Lavande',   couleur: '#7c3aed' },
    { id: 'corail',    nom: 'Corail',    couleur: '#ea580c' },
    { id: 'rose',      nom: 'Rose',      couleur: '#f9a8d4' },
    { id: 'ardoise',   nom: 'Ardoise',   couleur: '#475569' },
    { id: 'sepia',     nom: 'Sépia',     couleur: '#92400e' },
    { id: 'nuit',      nom: 'Nuit',      couleur: '#1e40af' },
    { id: 'minuit',    nom: 'Minuit',    couleur: '#000000' },
    // Flat palette (Ocean without gradients) for legacy browsers: name translated
    // via label() — i18n key instead of a hard-coded display name.
    { id: 'compatibilite', i18n: 'theme-compatibilite', couleur: '#0891b2' }
  ];

  function initTheme() {
    // Priority: <mp-course theme="..."> > user choice (localStorage) > "ocean" fallback.
    // If the author locks the picker (theme-picker="off"), the course attribute always wins.
    var course = document.querySelector('mp-course');
    var courseTheme = course && course.getAttribute('theme');
    var pickerLocked = course && course.getAttribute('theme-picker') === 'off';
    var saved = localStorage.getItem('mathpad-theme');
    var theme = (pickerLocked && courseTheme) || saved || courseTheme || 'ocean';
    document.documentElement.setAttribute('data-theme', theme);
  }

  window.mpSetTheme = function(themeId) {
    document.documentElement.setAttribute('data-theme', themeId);
    localStorage.setItem('mathpad-theme', themeId);
    updateThemeMenu();
    closeThemeMenu();
  };

  function updateThemeMenu() {
    var current = document.documentElement.getAttribute('data-theme') || 'classique';
    document.querySelectorAll('.theme-option').forEach(function(opt) {
      opt.classList.toggle('active', opt.getAttribute('data-theme-id') === current);
    });
  }

  window.mpToggleThemeMenu = function() {
    var m = document.getElementById('theme-menu');
    if (m) m.classList.toggle('open');
  };
  function closeThemeMenu() {
    var m = document.getElementById('theme-menu');
    if (m) m.classList.remove('open');
  }

  // ============================================================
  // 23. Bottom bar (unified): credit + nav buttons + theme selector
  // Driven by <mp-course> attributes (with safe defaults):
  //   navigation="auto|on|off"     auto = show bar if any sub-element is visible
  //   credit="visible|hidden"      visible by default
  //   theme-picker="on|off"        on by default
  //   theme="<id>"                 initial palette (applied via mpSetTheme)
  // ============================================================
  function makeCreditLink(extraClass) {
    return $('<a>')
      .attr('href', 'https://www.sarmate.net')
      .attr('target', '_blank')
      .addClass('sarmate-credit' + (extraClass ? ' ' + extraClass : ''))
      .text(label('credit-built-with'));
  }

  function makeThemeSelector(extraClass) {
    var selector = $('<div>').addClass('theme-selector' + (extraClass ? ' ' + extraClass : ''));
    var btn = $('<button>')
      .addClass('theme-btn')
      .attr('onclick', 'mpToggleThemeMenu()')
      .attr('title', 'Changer de thème')
      .html('<i class="fas fa-palette"></i>');
    selector.append(btn);
    var menu = $('<div>').attr('id', 'theme-menu').addClass('theme-menu');
    themesDisponibles.forEach(function(t) {
      var opt = $('<button>')
        .addClass('theme-option')
        // data-theme-id (NOT data-theme): a data-theme attribute on the button
        // would match [data-theme="nuit"]{…} selectors and locally apply the
        // theme's CSS variables (light text on a white menu → invisible label).
        // See incident 2026-05-24.
        .attr('data-theme-id', t.id)
        .attr('onclick', "mpSetTheme('" + t.id + "')")
        .html('<span class="theme-dot" style="background:' + t.couleur + ';"></span>' + (t.i18n ? label(t.i18n) : t.nom));
      menu.append(opt);
    });
    selector.append(menu);
    return selector;
  }

  function addBottomBar() {
    var course = document.querySelector('mp-course');
    var navAttr = (course && course.getAttribute('navigation')) || 'auto';
    var creditAttr = (course && course.getAttribute('credit')) || 'visible';
    var pickerAttr = (course && course.getAttribute('theme-picker')) || 'on';
    var hasBlanks = document.querySelector('mp-blank, pause') !== null;

    // Each control is now independent (no more "navigation=off macro"):
    // - navigation: only controls the back/forward pause buttons
    // - credit:     visible by default, hidden for paid plans / DOCX exports
    // - theme-picker: visible by default — palette helps user feel ownership
    //   of the document (acquisition lever for the SaaS).
    var showCredit  = creditAttr !== 'hidden';
    var showButtons = navAttr !== 'off' && hasBlanks;
    var showPicker  = pickerAttr !== 'off';
    // The bar (rectangle with bg + border) only appears if navigation buttons are present.
    // Without buttons, credit + picker float as standalone elements (no bar).
    var showBar = showButtons;

    if (showBar) {
      var nav = $('<nav>').attr('id', 'mp-nav');
      var inner = $('<div>').addClass('mp-nav-inner');
      if (showCredit) inner.append(makeCreditLink());
      inner.append($('<div>').attr('id', 'mp-nav-buttons').addClass('row'));
      if (showPicker) inner.append(makeThemeSelector());
      nav.append(inner);
      $('body').append(nav);
      document.body.classList.add('mp-has-nav-bar');
    } else {
      if (showCredit) {
        $('body').append(makeCreditLink('sarmate-credit-standalone'));
        document.body.classList.add('mp-has-credit-floating');
      }
      if (showPicker) $('body').append(makeThemeSelector('theme-selector-floating'));
    }

    if (showPicker) {
      updateThemeMenu();
      $(document).on('click', function(e) {
        if (!$(e.target).closest('.theme-selector').length) closeThemeMenu();
      });
    }
  }

  // ============================================================
  // 24. Navigation menu (for mp-blank stepping) — fills #mp-nav-buttons
  // ============================================================
  function menuNav() {
    var container = $('#mp-nav-buttons');
    if (!container.length) return;
    var btns = [
      { id: 'mpNavBack10', icon: 'fa fa-fast-backward',  onclick: 'mpRetreat10()', title: 'Reculer de 10' },
      { id: 'mpNavBack',   icon: 'fa fa-step-backward',  onclick: 'mpRetreat()',   title: 'Précédent' },
      { id: 'mpNavFwd',    icon: 'fa fa-step-forward',   onclick: 'mpAdvance()',   title: 'Suivant' },
      { id: 'mpNavFwd10',  icon: 'fa fa-fast-forward',   onclick: 'mpAdvance10()', title: 'Avancer de 10' }
    ];
    btns.forEach(function(b) {
      var d = $('<div>').attr('id', b.id).addClass('boutonNav');
      var btn = $('<button>')
        .attr('type', 'button')
        .addClass('btn')
        .attr('onclick', b.onclick)
        .attr('title', b.title);
      btn.append($('<i>').addClass(b.icon));
      d.append(btn);
      container.append(d);
    });
  }

  // ============================================================
  // 25. Helpers
  // ============================================================
  function ensureId(el, fallback) {
    if (!el.id) el.id = fallback;
  }
  function prependLabel(el, text, cls) {
    var span = document.createElement('span');
    span.className = cls;
    span.textContent = text + ' ';
    el.insertBefore(span, el.firstChild);
  }

  // ============================================================
  // Public API : expose useful renderers for editor previews etc.
  // ============================================================
  window.mathpad = window.mathpad || {};
  window.mathpad.renderVartables = renderVartables;

})();
