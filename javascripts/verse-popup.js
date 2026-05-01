/**
 * Bible Reference System — Popups + Blue Letter Bible Links
 *
 * - Verse references (Genesis 1:1, John 3:16) → popup + BLB link
 * - Strong's numbers (H430, G5590) → popup + BLB lexicon link
 * - Italic Hebrew/Greek words before Strong's (*nephesh* (H5315)) → BLB lexicon link
 */

(function() {
  // ── Book name normalization (input → internal 3-char code) ──
  const bookMap = {
    'genesis': 'Gen', 'gen': 'Gen',
    'exodus': 'Exo', 'exo': 'Exo', 'exod': 'Exo',
    'leviticus': 'Lev', 'lev': 'Lev',
    'numbers': 'Num', 'num': 'Num',
    'deuteronomy': 'Deu', 'deut': 'Deu', 'deu': 'Deu',
    'joshua': 'Jos', 'josh': 'Jos',
    'judges': 'Jdg', 'judg': 'Jdg',
    'ruth': 'Rth',
    '1 samuel': '1Sa', '1 sam': '1Sa',
    '2 samuel': '2Sa', '2 sam': '2Sa',
    '1 kings': '1Ki', '2 kings': '2Ki',
    '1 chronicles': '1Ch', '1 chron': '1Ch',
    '2 chronicles': '2Ch', '2 chron': '2Ch',
    'ezra': 'Ezr',
    'nehemiah': 'Neh', 'neh': 'Neh',
    'esther': 'Est', 'est': 'Est',
    'job': 'Job',
    'psalm': 'Psa', 'psalms': 'Psa', 'psa': 'Psa', 'ps': 'Psa',
    'proverbs': 'Pro', 'prov': 'Pro', 'pro': 'Pro',
    'ecclesiastes': 'Ecc', 'eccl': 'Ecc', 'ecc': 'Ecc',
    'song of solomon': 'Sng', 'song': 'Sng',
    'isaiah': 'Isa', 'isa': 'Isa',
    'jeremiah': 'Jer', 'jer': 'Jer',
    'lamentations': 'Lam', 'lam': 'Lam',
    'ezekiel': 'Ezk', 'ezek': 'Ezk', 'eze': 'Ezk',
    'daniel': 'Dan', 'dan': 'Dan',
    'hosea': 'Hos', 'hos': 'Hos',
    'joel': 'Jol',
    'amos': 'Amo',
    'obadiah': 'Oba', 'obad': 'Oba',
    'jonah': 'Jon', 'jon': 'Jon',
    'micah': 'Mic', 'mic': 'Mic',
    'nahum': 'Nah', 'nah': 'Nah',
    'habakkuk': 'Hab', 'hab': 'Hab',
    'zephaniah': 'Zep', 'zeph': 'Zep',
    'haggai': 'Hag', 'hag': 'Hag',
    'zechariah': 'Zec', 'zech': 'Zec', 'zec': 'Zec',
    'malachi': 'Mal', 'mal': 'Mal',
    'matthew': 'Mat', 'matt': 'Mat', 'mat': 'Mat',
    'mark': 'Mrk', 'mrk': 'Mrk',
    'luke': 'Luk', 'luk': 'Luk',
    'john': 'Jhn', 'jhn': 'Jhn',
    'acts': 'Act',
    'romans': 'Rom', 'rom': 'Rom',
    '1 corinthians': '1Co', '1 cor': '1Co',
    '2 corinthians': '2Co', '2 cor': '2Co',
    'galatians': 'Gal', 'gal': 'Gal',
    'ephesians': 'Eph', 'eph': 'Eph',
    'philippians': 'Php', 'phil': 'Php', 'php': 'Php',
    'colossians': 'Col', 'col': 'Col',
    '1 thessalonians': '1Th', '1 thess': '1Th', '1 th': '1Th',
    '2 thessalonians': '2Th', '2 thess': '2Th', '2 th': '2Th',
    '1 timothy': '1Ti', '1 tim': '1Ti',
    '2 timothy': '2Ti', '2 tim': '2Ti',
    'titus': 'Tit', 'tit': 'Tit',
    'philemon': 'Phm', 'phlm': 'Phm',
    'hebrews': 'Heb', 'heb': 'Heb',
    'james': 'Jas', 'jas': 'Jas',
    '1 peter': '1Pe', '1 pet': '1Pe',
    '2 peter': '2Pe', '2 pet': '2Pe',
    '1 john': '1Jn', '2 john': '2Jn', '3 john': '3Jn',
    'jude': 'Jud',
    'revelation': 'Rev', 'rev': 'Rev'
  };

  // ── Internal code → BLB URL code ──
  const blbBookCode = {
    'Gen':'gen','Exo':'exo','Lev':'lev','Num':'num','Deu':'deu',
    'Jos':'jos','Jdg':'jdg','Rth':'rth',
    '1Sa':'1sa','2Sa':'2sa','1Ki':'1ki','2Ki':'2ki',
    '1Ch':'1ch','2Ch':'2ch','Ezr':'ezr','Neh':'neh','Est':'est',
    'Job':'job','Psa':'psa','Pro':'pro','Ecc':'ecc','Sng':'sng',
    'Isa':'isa','Jer':'jer','Lam':'lam','Ezk':'eze','Dan':'dan',
    'Hos':'hos','Jol':'joe','Amo':'amo','Oba':'oba','Jon':'jon',
    'Mic':'mic','Nah':'nah','Hab':'hab','Zep':'zep','Hag':'hag',
    'Zec':'zec','Mal':'mal',
    'Mat':'mat','Mrk':'mar','Luk':'luk','Jhn':'jhn','Act':'act',
    'Rom':'rom','1Co':'1co','2Co':'2co','Gal':'gal','Eph':'eph',
    'Php':'php','Col':'col','1Th':'1th','2Th':'2th',
    '1Ti':'1ti','2Ti':'2ti','Tit':'tit','Phm':'phm',
    'Heb':'heb','Jas':'jas','1Pe':'1pe','2Pe':'2pe',
    '1Jn':'1jn','2Jn':'2jn','3Jn':'3jn','Jud':'jud','Rev':'rev'
  };

  // ── BLB URL builders ──
  function blbVerseUrl(book, chapter, verseSpec) {
    var code = blbBookCode[bookMap[book.toLowerCase()] || book];
    if (!code) return null;
    var firstVerse = String(verseSpec).replace(/\s/g,'').split(/[-,]/)[0];
    return 'https://www.blueletterbible.org/kjv/' + code + '/' + chapter + '/' + firstVerse + '/';
  }

  function blbStrongsUrl(num) {
    var lower = num.toLowerCase();
    var lang = lower.startsWith('h') ? 'wlc' : 'tr';
    return 'https://www.blueletterbible.org/lexicon/' + lower + '/kjv/' + lang + '/0-1/';
  }

  // ── Data loading ──
  var verseData = null;
  var strongsData = null;
  var dataLoaded = { verses: false, strongs: false };

  function getBaseUrl() {
    var base = document.querySelector('base');
    if (base && base.href) return base.href.replace(/\/$/, '');
    var scripts = document.querySelectorAll('script[src*="verse-popup"]');
    if (scripts.length > 0) {
      var src = scripts[0].src;
      return src.substring(0, src.lastIndexOf('/javascripts/'));
    }
    return '';
  }

  async function loadData(filename) {
    var baseUrl = getBaseUrl();
    var paths = [
      baseUrl + '/javascripts/' + filename,
      './javascripts/' + filename,
      '/javascripts/' + filename,
      '../javascripts/' + filename
    ];
    for (var i = 0; i < paths.length; i++) {
      try {
        var response = await fetch(paths[i]);
        if (response.ok) return await response.json();
      } catch (e) {}
    }
    return null;
  }

  async function loadAllData() {
    if (!dataLoaded.verses) {
      verseData = await loadData('verses.json');
      dataLoaded.verses = true;
    }
    if (!dataLoaded.strongs) {
      strongsData = await loadData('strongs.json');
      dataLoaded.strongs = true;
    }
  }

  // ── Verse text lookup ──
  function parseVerseSpec(verseSpec) {
    var targetVerses = new Set();
    var parts = String(verseSpec).split(',').map(function(p) { return p.trim(); });
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].includes('-')) {
        var range = parts[i].split('-').map(function(n) { return parseInt(n.trim()); });
        if (!isNaN(range[0]) && !isNaN(range[1])) {
          for (var v = range[0]; v <= range[1]; v++) targetVerses.add(v);
        }
      } else {
        var v2 = parseInt(parts[i]);
        if (!isNaN(v2)) targetVerses.add(v2);
      }
    }
    return targetVerses;
  }

  function getVerseText(book, chapter, verseSpec) {
    if (!verseData) return null;
    var normalizedBook = bookMap[book.toLowerCase()] || book;
    var chapterKey = normalizedBook + ' ' + chapter;
    var chapterData = verseData[chapterKey];
    if (!chapterData) return null;

    var targetVerses = parseVerseSpec(verseSpec);
    if (targetVerses.size === 0) return null;

    var minV = Math.min.apply(null, Array.from(targetVerses));
    var maxV = Math.max.apply(null, Array.from(targetVerses));
    var contextStart = Math.max(1, minV - 1);
    var contextEnd = maxV + 1;

    var verses = [];
    for (var v = contextStart; v <= contextEnd; v++) {
      var verseKey = normalizedBook + ' ' + chapter + ':' + v;
      if (chapterData[verseKey]) {
        verses.push({
          ref: chapter + ':' + v,
          text: chapterData[verseKey],
          isTarget: targetVerses.has(v)
        });
      }
    }
    return verses;
  }

  function getStrongsData(num) {
    if (!strongsData) return null;
    return strongsData[num] || null;
  }

  // ── Popup ──
  var popup = null;

  function createPopup() {
    if (popup) return popup;
    popup = document.createElement('div');
    popup.id = 'bible-popup';
    popup.innerHTML =
      '<div class="popup-header">' +
        '<span class="popup-title"></span>' +
        '<span class="popup-actions">' +
          '<a class="popup-blb-link" target="_blank" rel="noopener" title="Open in Blue Letter Bible">BLB</a>' +
          '<button class="popup-close">&times;</button>' +
        '</span>' +
      '</div>' +
      '<div class="popup-content"></div>';
    document.body.appendChild(popup);

    popup.querySelector('.popup-close').addEventListener('click', hidePopup);
    document.addEventListener('click', function(e) {
      if (popup && popup.style.display !== 'none' &&
          !popup.contains(e.target) &&
          !e.target.closest('.verse-ref') &&
          !e.target.closest('.strongs-ref') &&
          !e.target.closest('.word-ref')) {
        hidePopup();
      }
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') hidePopup();
    });
    return popup;
  }

  function showVersePopup(element, book, chapter, verseSpec) {
    var p = createPopup();
    var title = p.querySelector('.popup-title');
    var content = p.querySelector('.popup-content');
    var blbLink = p.querySelector('.popup-blb-link');

    title.textContent = book + ' ' + chapter + ':' + verseSpec;
    p.className = 'verse-popup';

    var url = blbVerseUrl(book, chapter, verseSpec);
    if (url) {
      blbLink.href = url;
      blbLink.style.display = '';
    } else {
      blbLink.style.display = 'none';
    }

    var verses = getVerseText(book, chapter, verseSpec);
    if (verses && verses.length > 0) {
      content.innerHTML = verses.map(function(v) {
        return '<div class="verse-line ' + (v.isTarget ? 'verse-target' : 'verse-context') + '">' +
          '<span class="verse-num">' + v.ref + '</span> ' + v.text +
          '</div>';
      }).join('');
    } else {
      content.innerHTML = '<p class="not-found">Verse not in local database. <a href="' +
        (url || '#') + '" target="_blank">View on Blue Letter Bible</a></p>';
    }
    positionPopup(element);
  }

  function showStrongsPopup(element, num) {
    var p = createPopup();
    var title = p.querySelector('.popup-title');
    var content = p.querySelector('.popup-content');
    var blbLink = p.querySelector('.popup-blb-link');

    var isHebrew = num.startsWith('H');
    var lang = isHebrew ? 'Hebrew' : 'Greek';

    title.textContent = num + ' (' + lang + ')';
    p.className = 'strongs-popup';

    var url = blbStrongsUrl(num);
    blbLink.href = url;
    blbLink.style.display = '';

    var data = getStrongsData(num);
    if (data) {
      content.innerHTML =
        '<div class="strongs-word">' + data.word + '</div>' +
        '<div class="strongs-translit">' + data.translit + '</div>' +
        '<div class="strongs-def">' + data.def + '</div>';
    } else {
      content.innerHTML = '<p class="not-found">Not in local database. <a href="' +
        url + '" target="_blank">View on Blue Letter Bible</a></p>';
    }
    positionPopup(element);
  }

  function positionPopup(element) {
    var rect = element.getBoundingClientRect();
    popup.style.display = 'block';

    var top = rect.bottom + window.scrollY + 10;
    var left = rect.left + window.scrollX;

    var popupRect = popup.getBoundingClientRect();
    if (left + popupRect.width > window.innerWidth) {
      left = window.innerWidth - popupRect.width - 20;
    }
    if (left < 10) left = 10;
    if (top + popupRect.height > window.scrollY + window.innerHeight) {
      top = rect.top + window.scrollY - popupRect.height - 10;
    }

    popup.style.top = top + 'px';
    popup.style.left = left + 'px';
  }

  function hidePopup() {
    if (popup) popup.style.display = 'none';
  }

  // ── Text processing ──
  function shouldSkip(node) {
    var parent = node.parentNode;
    if (!parent) return true;
    var tag = parent.tagName;
    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'CODE' || tag === 'PRE') return true;
    if (parent.classList && (
      parent.classList.contains('verse-ref') ||
      parent.classList.contains('strongs-ref') ||
      parent.classList.contains('word-ref')
    )) return true;
    if (parent.closest && (
      parent.closest('#bible-popup') ||
      parent.closest('code') ||
      parent.closest('pre')
    )) return true;
    return false;
  }

  function handleRefClick(e) {
    if (e.ctrlKey || e.metaKey || e.button === 1) return;
    e.preventDefault();
    e.stopPropagation();
    var el = e.currentTarget;
    if (el.classList.contains('verse-ref')) {
      showVersePopup(el, el.dataset.book, el.dataset.chapter, el.dataset.verseSpec);
    } else if (el.classList.contains('strongs-ref')) {
      showStrongsPopup(el, el.dataset.num);
    }
  }

  function processTextNode(node) {
    var text = node.textContent;
    if (!text || text.trim().length === 0) return;

    var versePattern = /\b(Genesis|Gen|Exodus|Exo|Exod|Leviticus|Lev|Numbers|Num|Deuteronomy|Deut|Deu|Joshua|Josh|Judges|Judg|Ruth|1 Samuel|1 Sam|2 Samuel|2 Sam|1 Kings|2 Kings|1 Chronicles|1 Chron|2 Chronicles|2 Chron|Ezra|Nehemiah|Neh|Esther|Est|Job|Psalms?|Psa?|Proverbs|Prov|Pro|Ecclesiastes|Eccl?|Ecc|Song of Solomon|Song|Isaiah|Isa|Jeremiah|Jer|Lamentations|Lam|Ezekiel|Ezek?|Daniel|Dan|Hosea|Hos|Joel|Amos|Obadiah|Obad?|Jonah|Jon|Micah|Mic|Nahum|Nah|Habakkuk|Hab|Zephaniah|Zeph|Haggai|Hag|Zechariah|Zech|Zec|Malachi|Mal|Matthew|Matt?|Mark|Mrk|Luke|Luk|John|Jhn|Acts|Romans|Rom|1 Corinthians|1 Cor|2 Corinthians|2 Cor|Galatians|Gal|Ephesians|Eph|Philippians|Phil|Php|Colossians|Col|1 Thessalonians|1 Thess?|1 Th|2 Thessalonians|2 Th|1 Timothy|1 Tim|2 Timothy|2 Tim|Titus|Tit|Philemon|Phlm|Hebrews|Heb|James|Jas|1 Peter|1 Pet|2 Peter|2 Pet|1 John|2 John|3 John|Jude|Revelation|Rev)\s+(\d+):([\d]+(?:\s*[-,]\s*\d+)*)/gi;

    var strongsPattern = /\b([HG])(\d{3,5})\b/g;

    var allMatches = [];
    var match;

    while ((match = versePattern.exec(text)) !== null) {
      allMatches.push({
        type: 'verse', index: match.index, length: match[0].length,
        text: match[0], book: match[1], chapter: match[2], verseSpec: match[3]
      });
    }
    while ((match = strongsPattern.exec(text)) !== null) {
      allMatches.push({
        type: 'strongs', index: match.index, length: match[0].length,
        text: match[0], num: match[1] + match[2]
      });
    }

    if (allMatches.length === 0) return;
    allMatches.sort(function(a, b) { return a.index - b.index; });

    // Remove overlaps
    var filtered = [];
    var lastEnd = 0;
    for (var i = 0; i < allMatches.length; i++) {
      if (allMatches[i].index >= lastEnd) {
        filtered.push(allMatches[i]);
        lastEnd = allMatches[i].index + allMatches[i].length;
      }
    }
    if (filtered.length === 0) return;

    var fragment = document.createDocumentFragment();
    var lastIndex = 0;

    for (var i = 0; i < filtered.length; i++) {
      var m = filtered[i];
      if (m.index > lastIndex) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex, m.index)));
      }

      var a = document.createElement('a');
      a.textContent = m.text;
      a.addEventListener('click', handleRefClick);

      if (m.type === 'verse') {
        a.className = 'verse-ref';
        a.dataset.book = m.book;
        a.dataset.chapter = m.chapter;
        a.dataset.verseSpec = m.verseSpec;
        var vUrl = blbVerseUrl(m.book, m.chapter, m.verseSpec);
        a.href = vUrl || '#';
        a.target = '_blank';
        a.rel = 'noopener';
      } else {
        a.className = 'strongs-ref';
        a.dataset.num = m.num;
        a.href = blbStrongsUrl(m.num);
        a.target = '_blank';
        a.rel = 'noopener';
      }

      fragment.appendChild(a);
      lastIndex = m.index + m.length;
    }

    if (lastIndex < text.length) {
      fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
    }
    node.parentNode.replaceChild(fragment, node);
  }

  function processElement(element) {
    if (!element) return;
    var textNodes = [];
    var walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
    while (walker.nextNode()) {
      var node = walker.currentNode;
      if (!shouldSkip(node) && (node.textContent.match(/\d+:\d+/) || node.textContent.match(/[HG]\d+/))) {
        textNodes.push(node);
      }
    }
    textNodes.forEach(processTextNode);
  }

  // ── Link italic Hebrew/Greek words to BLB ──
  // Two-pass approach:
  //   Pass 1: scan for <em>word</em> followed by (H/G1234) to build word→Strong's map
  //   Pass 2: link ALL <em> elements whose text matches the map

  function linkItalicWords(element) {
    if (!element) return;

    // Pass 1: build word → Strong's mapping from explicit pairings
    var wordMap = {};
    var strongsRefs = element.querySelectorAll('a.strongs-ref');

    strongsRefs.forEach(function(ref) {
      var num = ref.dataset.num;
      if (!num) return;

      // Look for pattern: <em>word</em> + text(" (") + <a.strongs-ref>
      var prev = ref.previousSibling;
      if (!prev || prev.nodeType !== 3) return;
      if (!/\(\s*$/.test(prev.textContent)) return;

      var emEl = prev.previousSibling;
      if (!emEl) return;

      // Handle <em> directly, or <strong><em>...</em></strong>
      var targetEm = null;
      if (emEl.tagName === 'EM' || emEl.tagName === 'I') {
        targetEm = emEl;
      } else if (emEl.tagName === 'STRONG' || emEl.tagName === 'B') {
        targetEm = emEl.querySelector('em, i');
      }

      if (targetEm) {
        var word = targetEm.textContent.trim().toLowerCase();
        if (word && word.length > 1) {
          wordMap[word] = num;
        }
      }
    });

    // Also build mappings from the raw HTML source text for patterns the
    // DOM walk might miss (e.g. inside already-processed nodes).
    // Scan original page text for *word* (H/G1234) patterns.
    var rawText = element.innerHTML;
    var rawPattern = /<em>([A-Za-z]+)<\/em>\s*\(([HG]\d{3,5})\)/gi;
    var rawMatch;
    while ((rawMatch = rawPattern.exec(rawText)) !== null) {
      var w = rawMatch[1].trim().toLowerCase();
      var n = rawMatch[2].toUpperCase();
      if (w.length > 1 && !wordMap[w]) {
        wordMap[w] = n;
      }
    }

    if (Object.keys(wordMap).length === 0) return;

    // Pass 2: link ALL <em> elements whose text matches the map
    var allEms = element.querySelectorAll('em, i');

    allEms.forEach(function(em) {
      // Skip if already linked
      if (em.closest('.word-ref') || em.closest('.strongs-ref') ||
          em.closest('#bible-popup') || em.closest('code') || em.closest('pre')) return;

      var text = em.textContent.trim().toLowerCase();
      var num = wordMap[text];
      if (!num) return;

      // Skip common English words that happen to be italic for emphasis
      if (/^(added|is|was|were|are|not|the|a|an|and|or|but|if|so|also|only|very|all|no|do|did|has|had|have|can|may|will|shall|would|could|should|must|been|being|become|became)$/.test(text)) return;

      var a = document.createElement('a');
      a.className = 'word-ref';
      a.href = blbStrongsUrl(num);
      a.target = '_blank';
      a.rel = 'noopener';
      a.dataset.num = num;
      a.title = num + ' on Blue Letter Bible';

      a.addEventListener('click', function(e) {
        if (e.ctrlKey || e.metaKey || e.button === 1) return;
        e.preventDefault();
        e.stopPropagation();
        showStrongsPopup(a, num);
      });

      em.parentNode.insertBefore(a, em);
      a.appendChild(em);
    });
  }

  // ── Styles ──
  function addStyles() {
    if (document.getElementById('bible-popup-styles')) return;
    var style = document.createElement('style');
    style.id = 'bible-popup-styles';
    style.textContent =
      '.verse-ref, .strongs-ref, .word-ref {' +
      '  cursor: pointer;' +
      '  text-decoration: none;' +
      '  border-bottom: 1px dotted currentColor;' +
      '  transition: color 0.2s, border-color 0.2s;' +
      '}' +
      '.verse-ref {' +
      '  color: var(--md-accent-fg-color, #7c4dff);' +
      '}' +
      '.verse-ref:hover {' +
      '  color: var(--md-primary-fg-color, #4051b5);' +
      '  border-bottom-style: solid;' +
      '}' +
      '.strongs-ref {' +
      '  color: #2e7d32;' +
      '  font-family: monospace;' +
      '  font-size: 0.9em;' +
      '}' +
      '.strongs-ref:hover {' +
      '  color: #1b5e20;' +
      '  border-bottom-style: solid;' +
      '}' +
      '.word-ref {' +
      '  color: #1565c0;' +
      '  border-bottom: 1px dotted #1565c0;' +
      '}' +
      '.word-ref:hover {' +
      '  color: #0d47a1;' +
      '  border-bottom-style: solid;' +
      '}' +
      '.word-ref em, .word-ref i {' +
      '  color: inherit;' +
      '}' +
      '#bible-popup {' +
      '  display: none;' +
      '  position: absolute;' +
      '  z-index: 9999;' +
      '  background: var(--md-default-bg-color, white);' +
      '  border: 1px solid var(--md-default-fg-color--lightest, #ddd);' +
      '  border-radius: 8px;' +
      '  box-shadow: 0 4px 20px rgba(0,0,0,0.15);' +
      '  max-width: 500px;' +
      '  min-width: 280px;' +
      '  font-size: 0.9rem;' +
      '}' +
      '.popup-header {' +
      '  display: flex;' +
      '  justify-content: space-between;' +
      '  align-items: center;' +
      '  padding: 10px 15px;' +
      '  border-bottom: 1px solid var(--md-default-fg-color--lightest, #ddd);' +
      '  border-radius: 8px 8px 0 0;' +
      '}' +
      '.verse-popup .popup-header { background: var(--md-code-bg-color, #f5f5f5); }' +
      '.strongs-popup .popup-header { background: #e8f5e9; }' +
      '.popup-title { font-weight: bold; }' +
      '.verse-popup .popup-title { color: var(--md-primary-fg-color, #4051b5); }' +
      '.strongs-popup .popup-title { color: #2e7d32; }' +
      '.popup-actions { display: flex; align-items: center; gap: 8px; }' +
      '.popup-blb-link {' +
      '  font-size: 0.75rem;' +
      '  padding: 2px 8px;' +
      '  border-radius: 4px;' +
      '  background: var(--md-accent-fg-color, #7c4dff);' +
      '  color: white !important;' +
      '  text-decoration: none;' +
      '  font-weight: bold;' +
      '  letter-spacing: 0.5px;' +
      '}' +
      '.popup-blb-link:hover { opacity: 0.85; }' +
      '.popup-close {' +
      '  background: none; border: none; font-size: 1.5rem;' +
      '  cursor: pointer; color: var(--md-default-fg-color--light, #666);' +
      '  line-height: 1; padding: 0 5px;' +
      '}' +
      '.popup-close:hover { color: var(--md-accent-fg-color, #7c4dff); }' +
      '.popup-content {' +
      '  padding: 15px; max-height: 300px; overflow-y: auto;' +
      '}' +
      '.verse-line { margin: 8px 0; line-height: 1.6; }' +
      '.verse-num {' +
      '  font-weight: bold;' +
      '  color: var(--md-default-fg-color--light, #666);' +
      '  margin-right: 5px;' +
      '}' +
      '.verse-target {' +
      '  background: var(--md-accent-fg-color--transparent, rgba(124,77,255,0.1));' +
      '  padding: 5px 8px; border-radius: 4px;' +
      '  border-left: 3px solid var(--md-accent-fg-color, #7c4dff);' +
      '}' +
      '.verse-context {' +
      '  color: var(--md-default-fg-color--light, #666);' +
      '  font-size: 0.9em;' +
      '}' +
      '.strongs-word {' +
      '  font-size: 1.8em; text-align: center; margin-bottom: 5px;' +
      '  font-family: "SBL Hebrew", "SBL Greek", "Times New Roman", serif;' +
      '}' +
      '.strongs-translit { text-align: center; font-style: italic;' +
      '  color: var(--md-default-fg-color--light, #666); margin-bottom: 10px; }' +
      '.strongs-def { line-height: 1.6; }' +
      '.not-found {' +
      '  color: var(--md-default-fg-color--light, #666); font-style: italic;' +
      '}' +
      '.not-found a { color: var(--md-accent-fg-color, #7c4dff); }' +

      /* Dark mode adjustments */
      '[data-md-color-scheme="slate"] .strongs-ref { color: #66bb6a; }' +
      '[data-md-color-scheme="slate"] .strongs-ref:hover { color: #81c784; }' +
      '[data-md-color-scheme="slate"] .strongs-popup .popup-header { background: #1b2b1b; }' +
      '[data-md-color-scheme="slate"] .word-ref { color: #64b5f6; border-bottom-color: #64b5f6; }' +
      '[data-md-color-scheme="slate"] .word-ref:hover { color: #90caf9; }';

    document.head.appendChild(style);
  }

  // ── Init ──
  async function init() {
    addStyles();
    await loadAllData();
    var content = document.querySelector('.md-content') || document.querySelector('article') || document.body;
    processElement(content);
    linkItalicWords(content);
  }

  function setupNavigation() {
    if (typeof document$ !== 'undefined') {
      document$.subscribe(function() { setTimeout(init, 100); });
    }
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1 && (node.classList && node.classList.contains('md-content') || node.querySelector && node.querySelector('.md-content'))) {
              setTimeout(init, 100);
            }
          });
        }
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setupNavigation();
      init();
    });
  } else {
    setupNavigation();
    init();
  }
})();
