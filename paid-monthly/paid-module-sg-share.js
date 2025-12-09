// paid-monthly/paid-module-sg-share.js   
(function () {
  const MODULE_KEY = 'sg_share';
  const MODULE_ID = 'paidSgShare';
  const CARD_ID = 'card-paid-sg-share';
  const ROOT_ID = `paid-sg-root-${MODULE_ID}`;
  const STYLE_ID = `paid-style-sg-share`;

  // Spec: fixed order
  const COUNTRY_ORDER = ['GH', 'KE', 'NG', 'TZ'];
  const WINDOW_ORDER = ['D0', 'D7'];
  const MONTH_MAX = 3;

  const CHART_TYPES = [
    { key: 'bar', label: '月度柱状图' },
    { key: 'line', label: '日级折线图' }
  ];

  const NOSPLIT_VALUE = '__ALL_NOSPLIT__';

  function readGlobal(name) {
    try {
      // eslint-disable-next-line no-new-func
      return Function(`return (typeof ${name} !== "undefined") ? ${name} : undefined;`)();
    } catch (_) {
      return undefined;
    }
  }

  function cssVar(name, fallback) {
    try {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name);
      return (v && v.trim()) ? v.trim() : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function clamp(n, min, max) {
    if (!Number.isFinite(n)) return min;
    return Math.min(max, Math.max(min, n));
  }

  function num(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  function escapeHtml(s) {
    return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function sortMonths(arr) {
    return (Array.isArray(arr) ? arr.slice() : []).sort((a, b) => String(a).localeCompare(String(b)));
  }

  function parseMonthKey(m) {
    const s = String(m || '');
    const y = Number(s.slice(0, 4));
    const mo = Number(s.slice(5, 7));
    return { y: Number.isFinite(y) ? y : null, mo: Number.isFinite(mo) ? mo : null };
  }

  function yearsOfMonths(months) {
    const set = new Set();
    for (const m of months || []) {
      const { y } = parseMonthKey(m);
      if (y) set.add(y);
    }
    return set;
  }

  function monthLabel(m, yearsSet) {
    const { y, mo } = parseMonthKey(m);
    if (!mo) return String(m || '');
    const onlyOneYear = yearsSet && yearsSet.size <= 1;
    return onlyOneYear ? `${mo}月` : `${y}年${mo}月`;
  }

  function fmtInt(v) {
    const n = Number(v);
    if (!Number.isFinite(n)) return '—';
    return String(Math.round(n));
  }

  function fmtPct01(v, digits = 1) {
    if (v === null || v === undefined) return '—';
    const n = Number(v);
    if (!Number.isFinite(n)) return '—';
    return `${(n * 100).toFixed(digits)}%`;
  }

  function dispMedia(v) {
    return String(v || '').toLowerCase();
  }

  function dispProduct(v) {
    return String(v || '').toLowerCase();
  }

  // Split TOTAL bet placed users into:
  // onlySports, onlyGames, both (sports & games), ensuring sum == total.
  function splitUnion(total, sports, games) {
    const t = Math.max(0, num(total));
    const s = Math.max(0, num(sports));
    const g = Math.max(0, num(games));

    const onlySports = clamp(t - g, 0, t);
    const onlyGames = clamp(t - s, 0, t);
    const both = clamp(t - onlySports - onlyGames, 0, t);

    return { total: t, sports: s, games: g, onlySports, onlyGames, both };
  }

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .paid-sg-filters{
        border:1px solid rgba(148, 163, 184, 0.60);
        border-radius:12px;
        background: rgba(249, 250, 251, 0.90);
        padding:10px 10px 8px;
        display:flex;
        flex-wrap:wrap;
        gap:12px 14px;
        margin-bottom: 10px;
      }
      .paid-sg-filter-group{
        display:flex;
        flex-direction:column;
        gap:6px;
        min-width: 200px;
      }
      .paid-sg-filter-label{
        font-size:11px;
        color: var(--muted, #64748b);
        line-height:1.2;
        display:flex;
        align-items:center;
        gap:8px;
      }
      .paid-sg-filter-label .paid-sg-badge{
        display:inline-flex;
        align-items:center;
        padding:1px 8px;
        border-radius:999px;
        border:1px solid rgba(148, 163, 184, 0.55);
        background: rgba(255,255,255,0.9);
        color: var(--muted, #64748b);
        font-size:10px;
      }
      .paid-sg-options{
        display:flex;
        flex-wrap:wrap;
        gap:6px;
      }
      .paid-sg-chip{
        display:inline-flex;
        align-items:center;
        gap:6px;
        padding:4px 10px;
        border-radius:999px;
        border:1px solid rgba(148, 163, 184, 0.55);
        background: rgba(255,255,255,0.92);
        font-size:12px;
        color: var(--text, #0f172a);
        cursor:pointer;
        user-select:none;
      }
      .paid-sg-chip input{
        margin:0;
        width:14px;
        height:14px;
        accent-color: var(--ovp-blue, #2563eb);
        cursor:pointer;
      }
      .paid-sg-chip.is-checked{
        border-color: rgba(37, 99, 235, 0.55);
        background: rgba(37, 99, 235, 0.08);
      }
      .paid-sg-chip.is-disabled{
        opacity: 0.55;
        cursor: not-allowed;
      }
      .paid-sg-hint{
        margin-top:2px;
        font-size:11px;
        color: var(--muted, #64748b);
        line-height:1.4;
        white-space: pre-wrap;
      }

      .paid-sg-chart-note,
      .paid-sg-table-note{
        margin-top: 6px;
        font-size:11px;
        color: var(--muted, #64748b);
        line-height:1.4;
        text-align:center;
      }

      .paid-sg-table-wrap{
        margin-top: 10px;
        display:flex;
        flex-direction:column;
        gap:8px;
      }
      .paid-sg-table-title{
        font-size:12px;
        color: var(--text, #0f172a);
        font-weight: 600;
      }
      .paid-sg-table-scroll{
        width:100%;
        overflow:auto;
        border:1px solid rgba(148, 163, 184, 0.60);
        border-radius:12px;
        background:#ffffff;
      }
      .paid-sg-table{
        width:100%;
        border-collapse:collapse;
        min-width: 980px;
      }
      .paid-sg-table th,
      .paid-sg-table td{
        border:1px solid rgba(148, 163, 184, 0.35);
        padding:10px 10px;
        font-size:12px;
        color: var(--text, #0f172a);
      }
      .paid-sg-table thead th{
        background: rgba(249, 250, 251, 0.95);
        font-size:11px;
        color: var(--muted, #64748b);
        text-align:center;
        position:sticky;
        top:0;
        z-index:2;
      }
      .paid-sg-table tbody th{
        background: rgba(249, 250, 251, 0.65);
        font-weight:600;
        text-align:center;
        min-width: 74px;
      }
      .paid-sg-th-sub{
        margin-top:4px;
        font-size:10px;
        color: var(--muted, #64748b);
        font-weight: 400;
      }
      .paid-sg-cell{
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        min-height: 96px;
        text-align:center;
        white-space:pre-line;
        line-height:1.5;
      }

      .paid-sg-insight-title{
        margin-top: 10px;
        font-size:11px;
        color: var(--muted, #64748b);
        margin-bottom:6px;
      }
      .paid-sg-insight-body{
        font-size:12px;
        line-height:1.65;
        white-space: pre-wrap;
        word-break: break-word;
      }
      .paid-sg-insight-body.is-empty{
        color: var(--muted, #64748b);
      }
    `;
    document.head.appendChild(style);
  }

  function ensureCard() {
    let card = document.getElementById(CARD_ID);
    if (card) return card;

    const main = document.querySelector('main.content') || document.querySelector('main') || document.body;
    card = document.createElement('section');
    card.className = 'chart-card';
    card.id = CARD_ID;

    const header = document.createElement('header');
    header.className = 'chart-card-header';
    header.innerHTML = `
      <h2>模块8：体育玩家/游戏玩家占比</h2>
      <div class="chart-controls">
        <span class="badge">独立筛选</span>
      </div>
    `;
    card.appendChild(header);

    // Insert before retention card if present
    const anchor = document.getElementById('card-paid-retention');
    if (anchor && anchor.parentNode) {
      anchor.parentNode.insertBefore(card, anchor);
    } else {
      main.appendChild(card);
    }
    return card;
  }

  function clearCardBody(card) {
    if (!card) return;
    const children = Array.from(card.children);
    for (const ch of children) {
      if (ch && ch.tagName === 'HEADER') continue;
      ch.remove();
    }
  }

  function buildLayoutHTML() {
    return `
      <div id="${ROOT_ID}">
        <div class="paid-sg-filters" id="sg-filters-${MODULE_ID}">
          <div class="paid-sg-filter-group">
            <div class="paid-sg-filter-label">月份<span class="paid-sg-badge" id="sg-badge-months-${MODULE_ID}">多选≤3</span></div>
            <div class="paid-sg-options" id="sg-months-${MODULE_ID}"></div>
          </div>

          <div class="paid-sg-filter-group">
            <div class="paid-sg-filter-label">国家<span class="paid-sg-badge" id="sg-badge-countries-${MODULE_ID}">多选</span></div>
            <div class="paid-sg-options" id="sg-countries-${MODULE_ID}"></div>
          </div>

          <div class="paid-sg-filter-group">
            <div class="paid-sg-filter-label">图表类型<span class="paid-sg-badge">单选</span></div>
            <div class="paid-sg-options" id="sg-chartType-${MODULE_ID}"></div>
          </div>

          <div class="paid-sg-filter-group">
            <div class="paid-sg-filter-label">媒体<span class="paid-sg-badge" id="sg-badge-medias-${MODULE_ID}">多选</span></div>
            <div class="paid-sg-options" id="sg-medias-${MODULE_ID}"></div>
          </div>

          <div class="paid-sg-filter-group">
            <div class="paid-sg-filter-label">产品类型<span class="paid-sg-badge" id="sg-badge-products-${MODULE_ID}">多选</span></div>
            <div class="paid-sg-options" id="sg-products-${MODULE_ID}"></div>
          </div>

          <div class="paid-sg-filter-group">
            <div class="paid-sg-filter-label">D0 / D7<span class="paid-sg-badge" id="sg-badge-windows-${MODULE_ID}">多选</span></div>
            <div class="paid-sg-options" id="sg-windows-${MODULE_ID}"></div>
          </div>

          <div class="paid-sg-filter-group" style="min-width:320px; flex: 1 1 auto;">
            <div class="paid-sg-filter-label">提示</div>
            <div class="paid-sg-hint" id="sg-hint-${MODULE_ID}"></div>
          </div>
        </div>

        <div>
          <div class="chart" id="sg-chart-${MODULE_ID}" style="height:360px;"></div>
          <div class="paid-sg-chart-note" id="sg-chart-note-${MODULE_ID}"></div>
        </div>

        <div class="paid-sg-table-wrap">
          <div class="paid-sg-table-title" id="sg-table-title-${MODULE_ID}"></div>
          <div class="paid-sg-table-scroll">
            <table class="paid-sg-table" id="sg-table-${MODULE_ID}"></table>
          </div>
          <div class="paid-sg-table-note" id="sg-table-note-${MODULE_ID}"></div>
        </div>

        <div>
          <div class="paid-sg-insight-title" id="sg-insight-title-${MODULE_ID}"></div>
          <div class="paid-sg-insight-body is-empty" id="sg-insight-${MODULE_ID}"></div>
        </div>
      </div>
    `;
  }

  function collectDistinct(rawByMonth) {
    const medias = new Set();
    const products = new Set();
    const countries = new Set();

    const months = Object.keys(rawByMonth || {});
    for (const mo of months) {
      const rows = Array.isArray(rawByMonth[mo]) ? rawByMonth[mo] : [];
      for (const r of rows) {
        if (!r) continue;
        if (r.media !== undefined && r.media !== null && String(r.media)) medias.add(String(r.media));
        if (r.productType !== undefined && r.productType !== null && String(r.productType)) products.add(String(r.productType));
        if (r.country !== undefined && r.country !== null && String(r.country)) countries.add(String(r.country));
      }
    }

    return {
      medias: Array.from(medias).sort((a, b) => String(a).localeCompare(String(b))),
      products: Array.from(products).sort((a, b) => String(a).localeCompare(String(b))),
      countries
    };
  }

  function buildChipsHtml(values, group, opts) {
    const options = opts || {};
    const labelFn = typeof options.labelFn === 'function' ? options.labelFn : (v) => String(v);
    const includeNoSplit = !!options.includeNoSplit;
    const noSplitLabel = options.noSplitLabel || '全选但不区分';

    let html = '';
    if (includeNoSplit) {
      html += `
        <label class="paid-sg-chip" data-chip="1">
          <input type="checkbox" data-group="${escapeHtml(group)}" data-value="${NOSPLIT_VALUE}" data-nosplit="1" />
          <span>${escapeHtml(noSplitLabel)}</span>
        </label>
      `;
    }

    html += (values || []).map((v) => {
      const val = String(v);
      return `
        <label class="paid-sg-chip" data-chip="1">
          <input type="checkbox" data-group="${escapeHtml(group)}" data-value="${escapeHtml(val)}" />
          <span>${escapeHtml(labelFn(val))}</span>
        </label>
      `;
    }).join('');

    return html;
  }

  function getPaidInsightText(month) {
    const all = readGlobal('PAID_ANALYSIS_TEXT') || window.PAID_ANALYSIS_TEXT || readGlobal('ANALYSIS_TEXT') || window.ANALYSIS_TEXT || {};
    const bucket = (all && all[MODULE_KEY]) ? all[MODULE_KEY] : null;
    if (!bucket || typeof bucket !== 'object') return '';
    const t = bucket[month] || bucket[String(month)] || bucket.__default__ || '';
    return String(t || '').trim();
  }

  function init() {
    ensureStyle();

    // 1) Data
    const rawByMonth =
      readGlobal('RAW_PAID_BY_MONTH') ||
      window.RAW_PAID_BY_MONTH ||
      readGlobal('RAW_PAID_MONTHLY') ||
      window.RAW_PAID_MONTHLY ||
      {};

    const allMonths = sortMonths(Object.keys(rawByMonth || {}));
    const latestMonth = allMonths.length ? allMonths[allMonths.length - 1] : null;
    const yearsSetAll = yearsOfMonths(allMonths);

    const { medias: ALL_MEDIAS, products: ALL_PRODUCTS, countries: ALL_COUNTRY_SET } = collectDistinct(rawByMonth);

    // Country options: fixed order, only show those that exist in data if data has countries
    const countryOptions = COUNTRY_ORDER.filter((c) => !ALL_COUNTRY_SET.size || ALL_COUNTRY_SET.has(c));

    // 2) Card mount
    const card = ensureCard();
    clearCardBody(card);
    card.insertAdjacentHTML('beforeend', buildLayoutHTML());

    const root = card.querySelector(`#${ROOT_ID}`);
    const filtersEl = root.querySelector(`#sg-filters-${MODULE_ID}`);

    const monthsEl = root.querySelector(`#sg-months-${MODULE_ID}`);
    const countriesEl = root.querySelector(`#sg-countries-${MODULE_ID}`);
    const chartTypeEl = root.querySelector(`#sg-chartType-${MODULE_ID}`);
    const mediasEl = root.querySelector(`#sg-medias-${MODULE_ID}`);
    const productsEl = root.querySelector(`#sg-products-${MODULE_ID}`);
    const windowsEl = root.querySelector(`#sg-windows-${MODULE_ID}`);

    const badgeMonthsEl = root.querySelector(`#sg-badge-months-${MODULE_ID}`);
    const badgeCountriesEl = root.querySelector(`#sg-badge-countries-${MODULE_ID}`);
    const badgeMediasEl = root.querySelector(`#sg-badge-medias-${MODULE_ID}`);
    const badgeProductsEl = root.querySelector(`#sg-badge-products-${MODULE_ID}`);
    const badgeWindowsEl = root.querySelector(`#sg-badge-windows-${MODULE_ID}`);
    const hintEl = root.querySelector(`#sg-hint-${MODULE_ID}`);

    const chartEl = root.querySelector(`#sg-chart-${MODULE_ID}`);
    const chartNoteEl = root.querySelector(`#sg-chart-note-${MODULE_ID}`);

    const tableTitleEl = root.querySelector(`#sg-table-title-${MODULE_ID}`);
    const tableEl = root.querySelector(`#sg-table-${MODULE_ID}`);
    const tableNoteEl = root.querySelector(`#sg-table-note-${MODULE_ID}`);

    const insightTitleEl = root.querySelector(`#sg-insight-title-${MODULE_ID}`);
    const insightEl = root.querySelector(`#sg-insight-${MODULE_ID}`);

    // 3) Build filter UI
    monthsEl.innerHTML = buildChipsHtml(allMonths, 'months', {
      labelFn: (m) => monthLabel(m, yearsSetAll)
    });

    countriesEl.innerHTML = buildChipsHtml(countryOptions, 'countries', {
      includeNoSplit: true,
      noSplitLabel: '全选但不区分'
    });

    chartTypeEl.innerHTML = buildChipsHtml(CHART_TYPES.map((x) => x.key), 'chartType', {
      labelFn: (k) => {
        const hit = CHART_TYPES.find((x) => x.key === k);
        return hit ? hit.label : k;
      }
    });

    mediasEl.innerHTML = buildChipsHtml(ALL_MEDIAS, 'medias', {
      includeNoSplit: true,
      noSplitLabel: '全选但不区分',
      labelFn: (m) => dispMedia(m)
    });

    productsEl.innerHTML = buildChipsHtml(ALL_PRODUCTS, 'products', {
      includeNoSplit: true,
      noSplitLabel: '全选但不区分',
      labelFn: (p) => dispProduct(p)
    });

    windowsEl.innerHTML = buildChipsHtml(WINDOW_ORDER, 'windows', {
      labelFn: (w) => w
    });

    // 4) State
    const state = {
      chartType: 'bar',
      months: new Set(latestMonth ? [String(latestMonth)] : []),
      countries: new Set(countryOptions.length ? countryOptions : COUNTRY_ORDER.slice(0, 1)),
      medias: new Set(ALL_MEDIAS),
      products: new Set(ALL_PRODUCTS),
      windows: new Set(WINDOW_ORDER),

      noSplitCountries: false,
      noSplitMedias: true,
      noSplitProducts: true
    };

    // default: “全选但不区分” for media/products
    if (ALL_MEDIAS.length) state.noSplitMedias = true;
    if (ALL_PRODUCTS.length) state.noSplitProducts = true;

    function selectAll(set, values) {
      set.clear();
      for (const v of values || []) set.add(String(v));
    }

    if (state.noSplitMedias) selectAll(state.medias, ALL_MEDIAS);
    if (state.noSplitProducts) selectAll(state.products, ALL_PRODUCTS);

    function ensureAtLeastOne(set, fallback) {
      if (set.size) return;
      if (fallback !== undefined && fallback !== null && String(fallback)) set.add(String(fallback));
    }

    function monthList() {
      return sortMonths(Array.from(state.months));
    }

    function countryList() {
      // keep fixed order
      const list = [];
      for (const c of countryOptions) {
        if (state.countries.has(String(c))) list.push(String(c));
      }
      return list;
    }

    function mediaList() {
      const list = [];
      for (const m of ALL_MEDIAS) {
        if (state.medias.has(String(m))) list.push(String(m));
      }
      return list;
    }

    function productList() {
      const list = [];
      for (const p of ALL_PRODUCTS) {
        if (state.products.has(String(p))) list.push(String(p));
      }
      return list;
    }

    function windowList() {
      const list = [];
      for (const w of WINDOW_ORDER) {
        if (state.windows.has(String(w))) list.push(String(w));
      }
      return list;
    }

    function enforceMonthMax() {
      const ms = monthList();
      if (ms.length <= MONTH_MAX) return null;

      const keep = ms.slice(-MONTH_MAX); // keep latest 3
      state.months.clear();
      for (const m of keep) state.months.add(m);
      return `月份最多选${MONTH_MAX}个，已自动保留最近${MONTH_MAX}个月：${keep.map((m) => monthLabel(m, yearsSetAll)).join('、')}`;
    }

    function enforceLineSingles() {
      // noSplit in line mode: disable & clear
      state.noSplitCountries = false;
      state.noSplitMedias = false;
      state.noSplitProducts = false;

      // month single: pick latest
      ensureAtLeastOne(state.months, latestMonth);
      const ms = monthList();
      state.months.clear();
      state.months.add(ms[ms.length - 1]);

      // country single: pick first in fixed order
      ensureAtLeastOne(state.countries, countryOptions[0] || COUNTRY_ORDER[0]);
      const cs = countryList();
      state.countries.clear();
      state.countries.add(cs[0]);

      // media single: pick first
      ensureAtLeastOne(state.medias, ALL_MEDIAS[0]);
      const ms2 = mediaList();
      state.medias.clear();
      state.medias.add(ms2[0]);

      // product single: pick first
      ensureAtLeastOne(state.products, ALL_PRODUCTS[0]);
      const ps = productList();
      state.products.clear();
      state.products.add(ps[0]);

      // window single: prefer D0 then D7
      ensureAtLeastOne(state.windows, 'D0');
      const ws = windowList();
      const pick = ws.includes('D0') ? 'D0' : ws[0];
      state.windows.clear();
      state.windows.add(pick);
    }

    function setChipState() {
      const inputs = filtersEl.querySelectorAll('input[data-group][data-value]');
      for (const input of inputs) {
        const group = input.getAttribute('data-group');
        const val = input.getAttribute('data-value');
        const isNoSplit = input.getAttribute('data-nosplit') === '1';

        let checked = false;
        let disabled = false;

        if (group === 'chartType') {
          checked = (state.chartType === val);
          disabled = false;
        } else if (group === 'months') {
          checked = state.months.has(val);
        } else if (group === 'countries') {
          if (isNoSplit) checked = !!state.noSplitCountries;
          else checked = state.countries.has(val);
          disabled = !isNoSplit && state.noSplitCountries;
        } else if (group === 'medias') {
          if (isNoSplit) checked = !!state.noSplitMedias;
          else checked = state.medias.has(val);
          disabled = !isNoSplit && state.noSplitMedias;
        } else if (group === 'products') {
          if (isNoSplit) checked = !!state.noSplitProducts;
          else checked = state.products.has(val);
          disabled = !isNoSplit && state.noSplitProducts;
        } else if (group === 'windows') {
          checked = state.windows.has(val);
        }

        // In line mode: disable noSplit options (per spec: single select by concrete value)
        if (state.chartType === 'line' && isNoSplit && (group === 'countries' || group === 'medias' || group === 'products')) {
          disabled = true;
          checked = false;
        }

        input.checked = checked;
        input.disabled = disabled;

        const label = input.closest('.paid-sg-chip');
        if (label) {
          label.classList.toggle('is-checked', !!checked);
          label.classList.toggle('is-disabled', !!disabled);
        }
      }

      if (badgeMonthsEl) badgeMonthsEl.textContent = (state.chartType === 'line') ? '单选' : '多选≤3';
      if (badgeCountriesEl) badgeCountriesEl.textContent = (state.chartType === 'line') ? '单选' : (state.noSplitCountries ? '全选不拆' : '多选');
      if (badgeMediasEl) badgeMediasEl.textContent = (state.chartType === 'line') ? '单选' : (state.noSplitMedias ? '全选不拆' : '多选');
      if (badgeProductsEl) badgeProductsEl.textContent = (state.chartType === 'line') ? '单选' : (state.noSplitProducts ? '全选不拆' : '多选');
      if (badgeWindowsEl) badgeWindowsEl.textContent = (state.chartType === 'line') ? '单选' : '多选';
    }

    function rowsPassBaseFilters(r) {
      if (!r) return false;
      const c = String(r.country || '');
      const m = String(r.media || '');
      const p = String(r.productType || '');

      if (state.countries.size && !state.countries.has(c)) return false;
      if (state.medias.size && !state.medias.has(m)) return false;
      if (state.products.size && !state.products.has(p)) return false;
      return true;
    }

    function getMonthlySeg(month, group, win) {
      const rows = Array.isArray(rawByMonth[month]) ? rawByMonth[month] : [];
      const fTotal = `${win}_TOTAL_BET_PLACED_USER`;
      const fSports = `${win}_SPORTS_BET_PLACED_USER`;
      const fGames = `${win}_GAMES_BET_PLACED_USER`;

      let total = 0, sports = 0, games = 0;
      for (const r of rows) {
        if (!rowsPassBaseFilters(r)) continue;

        if (group && group.country && String(r.country) !== String(group.country)) continue;
        if (group && group.media && String(r.media) !== String(group.media)) continue;
        if (group && group.productType && String(r.productType) !== String(group.productType)) continue;

        total += num(r[fTotal]);
        sports += num(r[fSports]);
        games += num(r[fGames]);
      }
      return splitUnion(total, sports, games);
    }

    function getDailySeries(month, group, win) {
      const rows = Array.isArray(rawByMonth[month]) ? rawByMonth[month] : [];
      const fTotal = `${win}_TOTAL_BET_PLACED_USER`;
      const fSports = `${win}_SPORTS_BET_PLACED_USER`;
      const fGames = `${win}_GAMES_BET_PLACED_USER`;

      const map = new Map(); // date -> sums
      for (const r of rows) {
        if (!rowsPassBaseFilters(r)) continue;

        if (group && group.country && String(r.country) !== String(group.country)) continue;
        if (group && group.media && String(r.media) !== String(group.media)) continue;
        if (group && group.productType && String(r.productType) !== String(group.productType)) continue;

        const d = String(r.date || '');
        if (!d) continue;

        if (!map.has(d)) map.set(d, { total: 0, sports: 0, games: 0 });
        const o = map.get(d);
        o.total += num(r[fTotal]);
        o.sports += num(r[fSports]);
        o.games += num(r[fGames]);
      }

      const dates = Array.from(map.keys()).sort((a, b) => String(a).localeCompare(String(b)));
      const onlySports = [];
      const onlyGames = [];
      const both = [];
      const totals = [];

      for (const d of dates) {
        const v = map.get(d);
        const seg = splitUnion(v.total, v.sports, v.games);
        totals.push(seg.total);
        onlySports.push(seg.onlySports);
        onlyGames.push(seg.onlyGames);
        both.push(seg.both);
      }

      return { dates, totals, onlySports, onlyGames, both };
    }

    // 5) Chart init
    let chart = null;
    if (window.echarts && chartEl) {
      chart = echarts.init(chartEl);
      const onResize = () => { try { chart.resize(); } catch (_) { } };
      if (typeof ResizeObserver !== 'undefined') {
        try {
          const ro = new ResizeObserver(onResize);
          ro.observe(chartEl);
        } catch (_) {
          window.addEventListener('resize', onResize);
        }
      } else {
        window.addEventListener('resize', onResize);
      }

      // If paid dashboard has registerChart, use it
      if (window.PaidDashboard && typeof window.PaidDashboard.registerChart === 'function') {
        try { window.PaidDashboard.registerChart(chart); } catch (_) { }
      }
    }

    function renderChartBar(monthsSel, countriesSel, winsSel) {
      if (!chart) return;

      const blue = cssVar('--ovp-blue', '#2563eb');
      const yellow = cssVar('--ovp-yellow', '#F6C344');
      const green = '#86efac';

      const d7Decal = {
        symbol: 'rect',
        dashArrayX: [4, 2],
        dashArrayY: [1, 0],
        rotation: Math.PI / 4
      };

      const stacks = [];
      const ms = sortMonths(monthsSel);
      const ws = WINDOW_ORDER.filter((w) => winsSel.includes(w));
      for (const m of ms) {
        for (const w of ws) {
          stacks.push({
            month: m,
            win: w,
            label: `${monthLabel(m, yearsSetAll)} ${w}`,
            key: `${m}|${w}`
          });
        }
      }

      const numStacks = stacks.length;
      const barWidth = numStacks <= 2 ? 18 : (numStacks <= 4 ? 14 : 10);

      const metaBySeriesIndex = [];
      const series = [];

      function addSegSeries(stack, segKey, name, color) {
        const isD7 = stack.win === 'D7';
        const data = (countriesSel || []).map((country) => {
          const group = {
            country: country === 'ALL' ? null : country,
            media: null,
            productType: null
          };
          const seg = getMonthlySeg(stack.month, group, stack.win);
          return seg[segKey] || 0;
        });

        const s = {
          name,
          type: 'bar',
          stack: stack.key,
          barWidth,
          emphasis: { focus: 'series' },
          itemStyle: {
            color,
            decal: isD7 ? d7Decal : null
          },
          data
        };

        metaBySeriesIndex.push({ stackKey: stack.key, stackLabel: stack.label, segKey });
        series.push(s);
      }

      // Stack order per requirement: bottom onlyGames, middle both, top onlySports
      for (const st of stacks) {
        addSegSeries(st, 'onlyGames', '仅游戏', blue);
        addSegSeries(st, 'both', '双投', green);
        addSegSeries(st, 'onlySports', '仅体育', yellow);
      }

      const option = {
        animation: false,
        grid: { left: 42, right: 18, top: 56, bottom: 52, containLabel: true },
        legend: { top: 14, left: 12, data: ['仅游戏', '双投', '仅体育'], textStyle: { fontSize: 11 } },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: function (params) {
            const items = Array.isArray(params) ? params : [];
            const axis = items.length ? items[0].axisValue : '';

            const byStack = new Map();
            for (const it of items) {
              if (!it || it.seriesIndex === undefined) continue;
              const meta = metaBySeriesIndex[it.seriesIndex];
              if (!meta) continue;

              if (!byStack.has(meta.stackKey)) {
                byStack.set(meta.stackKey, {
                  label: meta.stackLabel,
                  onlyGames: 0,
                  both: 0,
                  onlySports: 0
                });
              }
              const o = byStack.get(meta.stackKey);
              o[meta.segKey] = num(it.value);
            }

            let html = `<div style="font-weight:600;margin-bottom:4px;">${escapeHtml(axis)}</div>`;
            for (const st of stacks) {
              const o = byStack.get(st.key);
              if (!o) continue;
              const t = num(o.onlyGames) + num(o.both) + num(o.onlySports);
              const pG = t > 0 ? o.onlyGames / t : null;
              const pB = t > 0 ? o.both / t : null;
              const pS = t > 0 ? o.onlySports / t : null;

              html += `<div style="margin-top:8px;"><span style="font-weight:600;">${escapeHtml(o.label)}</span></div>`;
              html += `<div>仅游戏：${fmtInt(o.onlyGames)} (${fmtPct01(pG, 1)})</div>`;
              html += `<div>双投：${fmtInt(o.both)} (${fmtPct01(pB, 1)})</div>`;
              html += `<div>仅体育：${fmtInt(o.onlySports)} (${fmtPct01(pS, 1)})</div>`;
              html += `<div>总计：${fmtInt(t)}</div>`;
            }
            return html;
          }
        },
        xAxis: {
          type: 'category',
          data: countriesSel,
          axisLabel: { fontSize: 11 }
        },
        yAxis: {
          type: 'value',
          axisLabel: { fontSize: 11 }
        },
        series
      };

      chart.setOption(option, { notMerge: true });

      if (chartNoteEl) {
        const mediaPart = state.noSplitMedias ? '媒体：全选不拆' : `媒体：${mediaList().map(dispMedia).join('+') || '—'}`;
        const productPart = state.noSplitProducts ? '产品：全选不拆' : `产品：${productList().map(dispProduct).join('+') || '—'}`;
        const countryPart = state.noSplitCountries ? '国家：全选不拆' : `国家：${countriesSel.join('/') || '—'}`;
        chartNoteEl.textContent = `说明：每根柱子=总投注人数（人）；内部分段：仅游戏(蓝)/双投(绿)/仅体育(黄)；D7柱子带斜线阴影。当前：${ms.map((m) => monthLabel(m, yearsSetAll)).join('、')} · ${countryPart} · ${mediaPart} · ${productPart} · ${winsSel.join('+')}`;
      }
    }

    function renderChartLine(month, country, media, productType, win) {
      if (!chart) return;

      const blue = cssVar('--ovp-blue', '#2563eb');
      const yellow = cssVar('--ovp-yellow', '#F6C344');
      const green = '#86efac';

      const group = {
        country: country,
        media: media,
        productType: productType
      };

      const daily = getDailySeries(month, group, win);

      const option = {
        animation: false,
        grid: { left: 42, right: 18, top: 56, bottom: 52, containLabel: true },
        legend: { top: 14, left: 12, data: ['仅体育', '仅游戏', '双投'], textStyle: { fontSize: 11 } },
        tooltip: { trigger: 'axis', axisPointer: { type: 'line' } },
        xAxis: {
          type: 'category',
          data: daily.dates,
          axisLabel: {
            fontSize: 10,
            formatter: function (v) { return String(v || '').slice(5); } // MM-DD
          }
        },
        yAxis: { type: 'value', axisLabel: { fontSize: 11 } },
        series: [
          // order: bottom onlySports, middle onlyGames, top both
          { name: '仅体育', type: 'line', stack: 'total', symbol: 'none', data: daily.onlySports, lineStyle: { width: 2 }, areaStyle: { opacity: 0.35 }, itemStyle: { color: yellow } },
          { name: '仅游戏', type: 'line', stack: 'total', symbol: 'none', data: daily.onlyGames, lineStyle: { width: 2 }, areaStyle: { opacity: 0.35 }, itemStyle: { color: blue } },
          { name: '双投', type: 'line', stack: 'total', symbol: 'none', data: daily.both, lineStyle: { width: 2 }, areaStyle: { opacity: 0.35 }, itemStyle: { color: green } }
        ]
      };

      chart.setOption(option, { notMerge: true });

      if (chartNoteEl) {
        chartNoteEl.textContent = `说明：日级堆积面积图（底：仅体育 / 中：仅游戏 / 顶：双投）。当前选择：${monthLabel(month, yearsSetAll)} · ${country} · ${dispMedia(media)} · ${dispProduct(productType)} · ${win}`;
      }
    }

    function renderTable(monthsSel, countriesSel, winsSel) {
      if (!tableEl) return;

      const cols = [];
      for (const m of monthsSel) {
        for (const w of winsSel) {
          cols.push({ month: m, win: w, label: `${monthLabel(m, yearsSetAll)} ${w}` });
        }
      }

      const showMediaCol = !state.noSplitMedias;
      const showProductCol = !state.noSplitProducts;

      const headFixed = [
        `<th>国家</th>`,
        showMediaCol ? `<th>媒体</th>` : '',
        showProductCol ? `<th>产品类型</th>` : ''
      ].filter(Boolean).join('');

      const thead = `
        <thead>
          <tr>
            ${headFixed}
            ${cols.map((c) => `<th>${escapeHtml(c.label)}<div class="paid-sg-th-sub">仅游戏/双投/仅体育/总计</div></th>`).join('')}
          </tr>
        </thead>
      `;

      const rowCountries = state.noSplitCountries ? ['ALL'] : countriesSel;
      const rowMedias = state.noSplitMedias ? ['ALL'] : mediaList();
      const rowProducts = state.noSplitProducts ? ['ALL'] : productList();

      const tbodyRows = [];
      for (const country of rowCountries) {
        for (const media of rowMedias) {
          for (const prod of rowProducts) {
            const rowHead = [
              `<th>${escapeHtml(country)}</th>`,
              showMediaCol ? `<td style="text-align:center;">${escapeHtml(dispMedia(media))}</td>` : '',
              showProductCol ? `<td style="text-align:center;">${escapeHtml(dispProduct(prod))}</td>` : ''
            ].filter(Boolean).join('');

            const tds = cols.map((c) => {
              const group = {
                country: country === 'ALL' ? null : country,
                media: media === 'ALL' ? null : media,
                productType: prod === 'ALL' ? null : prod
              };
              const seg = getMonthlySeg(c.month, group, c.win);
              const t = seg.total;

              const pOnlyGames = t > 0 ? seg.onlyGames / t : null;
              const pBoth = t > 0 ? seg.both / t : null;
              const pOnlySports = t > 0 ? seg.onlySports / t : null;

              const cell = `
                <div class="paid-sg-cell">
                  <div>仅游戏：${fmtInt(seg.onlyGames)} (${fmtPct01(pOnlyGames, 1)})</div>
                  <div>双投：${fmtInt(seg.both)} (${fmtPct01(pBoth, 1)})</div>
                  <div>仅体育：${fmtInt(seg.onlySports)} (${fmtPct01(pOnlySports, 1)})</div>
                  <div>总计：${fmtInt(seg.total)}</div>
                </div>
              `;
              return `<td>${cell}</td>`;
            }).join('');

            tbodyRows.push(`<tr>${rowHead}${tds}</tr>`);
          }
        }
      }

      tableEl.innerHTML = `${thead}<tbody>${tbodyRows.join('')}</tbody>`;

      // Title with media/product selections
      const titleParts = [];
      if (!state.noSplitMedias) {
        const m = mediaList().map(dispMedia).join('+');
        if (m) titleParts.push(m);
      }
      if (!state.noSplitProducts) {
        const p = productList().map(dispProduct).join('+');
        if (p) titleParts.push(p);
      }

      if (tableTitleEl) {
        tableTitleEl.textContent = titleParts.length ? `数据表（${titleParts.join('，')}）` : '数据表';
      }

      if (tableNoteEl) {
        const dimNote = [
          `占比口径：分组人数 / 总投注人数`,
          `维度：${state.noSplitCountries ? '国家全选不拆' : '按国家'}${showMediaCol ? ' + 媒体' : ''}${showProductCol ? ' + 产品类型' : ''}`,
          `单位：人、%`
        ].join('；');
        tableNoteEl.textContent = dimNote;
      }
    }

    function renderInsight(monthsSel) {
      if (!insightTitleEl || !insightEl) return;

      const ys = yearsOfMonths(monthsSel);
      const blocks = [];
      let hasAny = false;

      for (const m of monthsSel) {
        const t = getPaidInsightText(m);
        const label = monthLabel(m, ys);
        if (t) hasAny = true;
        blocks.push(`${label}\n${t || '（该月暂无文案）'}`);
      }

      insightTitleEl.textContent = '解读（随所选月份展示）';
      insightEl.textContent = blocks.join('\n\n');
      insightEl.classList.toggle('is-empty', !hasAny);
    }

    function renderAll() {
      // Base: ensure at least one in each
      ensureAtLeastOne(state.months, latestMonth);
      ensureAtLeastOne(state.countries, countryOptions[0] || COUNTRY_ORDER[0]);
      ensureAtLeastOne(state.medias, ALL_MEDIAS[0]);
      ensureAtLeastOne(state.products, ALL_PRODUCTS[0]);
      ensureAtLeastOne(state.windows, 'D0');

      let note = null;

      if (state.chartType === 'line') {
        enforceLineSingles();
      } else {
        // Apply noSplit => full select
        if (state.noSplitCountries) selectAll(state.countries, countryOptions);
        if (state.noSplitMedias) selectAll(state.medias, ALL_MEDIAS);
        if (state.noSplitProducts) selectAll(state.products, ALL_PRODUCTS);

        note = enforceMonthMax();
      }

      const monthsSel = monthList();
      const winsSel = windowList();

      // Countries for chart (x-axis): fixed order + selection
      const countriesSel = state.noSplitCountries
        ? ['ALL']
        : countryOptions.filter((c) => state.countries.has(String(c)));

      // For hint
      const mediaSelDisp = state.noSplitMedias ? '全选但不区分' : (mediaList().map(dispMedia).join('+') || '—');
      const prodSelDisp = state.noSplitProducts ? '全选但不区分' : (productList().map(dispProduct).join('+') || '—');

      const hintLines = [];
      if (state.chartType === 'line') {
        hintLines.push('折线图模式：月份/国家/媒体/产品类型/D0-D7均单选；日级堆积面积图。');
      } else {
        hintLines.push(`柱状图模式：月份多选≤${MONTH_MAX}；D0/D7多选；D7柱子带斜线阴影。`);
      }
      hintLines.push(`当前筛选：${monthsSel.map((m) => monthLabel(m, yearsSetAll)).join('、')} · 国家${state.noSplitCountries ? '全选不拆' : `=${countriesSel.join('/') || '—'}`} · 媒体=${mediaSelDisp} · 产品=${prodSelDisp} · 窗口=${winsSel.join('+') || '—'}`);

      if (hintEl) hintEl.textContent = hintLines.join('\n');
      setChipState();

      // Render chart
      if (!window.echarts || !chart) {
        if (chartNoteEl) chartNoteEl.textContent = '未检测到 ECharts：请确认 echarts 已加载。';
      } else {
        if (state.chartType === 'line') {
          const m = monthsSel[monthsSel.length - 1];
          const c = countryList()[0];
          const md = mediaList()[0];
          const pr = productList()[0];
          const w = winsSel.includes('D0') ? 'D0' : (winsSel[0] || 'D0');
          renderChartLine(m, c, md, pr, w);
        } else {
          renderChartBar(monthsSel, countriesSel, winsSel);
        }
      }

      // Render table
      renderTable(monthsSel, countriesSel, winsSel);

      // Render insight
      renderInsight(monthsSel);

      // Extra note if month trimmed
      if (note && chartNoteEl && state.chartType !== 'line') {
        chartNoteEl.textContent = `${chartNoteEl.textContent}\n${note}`;
      }
    }

    // 6) Events
    filtersEl.addEventListener('change', function (e) {
      const t = e && e.target;
      if (!t || t.tagName !== 'INPUT') return;

      const group = t.getAttribute('data-group');
      const val = t.getAttribute('data-value');
      const isNoSplit = t.getAttribute('data-nosplit') === '1';
      if (!group || !val) return;

      const isLine = state.chartType === 'line';

      if (group === 'chartType') {
        if (t.checked) {
          state.chartType = val;
        } else {
          // keep as radio-like
          t.checked = true;
        }
        renderAll();
        return;
      }

      // In line mode: noSplit options disabled, but double-guard
      if (isLine && isNoSplit && (group === 'countries' || group === 'medias' || group === 'products')) {
        t.checked = false;
        renderAll();
        return;
      }

      // Toggle helpers
      function toggleSet(set, v, checked, fallback, single) {
        const s = set;
        const vv = String(v);

        if (single) {
          if (checked) {
            s.clear();
            s.add(vv);
          } else {
            // disallow uncheck in single mode
            s.add(vv);
          }
          return;
        }

        if (checked) s.add(vv);
        else s.delete(vv);

        if (!s.size) s.add(String(fallback ?? vv));
      }

      // Group actions
      if (group === 'months') {
        toggleSet(state.months, val, t.checked, latestMonth, isLine);
      } else if (group === 'countries') {
        if (isNoSplit) {
          state.noSplitCountries = !!t.checked;
          if (state.noSplitCountries) selectAll(state.countries, countryOptions);
        } else {
          if (state.noSplitCountries) return;
          toggleSet(state.countries, val, t.checked, countryOptions[0] || COUNTRY_ORDER[0], isLine);
        }
      } else if (group === 'medias') {
        if (isNoSplit) {
          state.noSplitMedias = !!t.checked;
          if (state.noSplitMedias) selectAll(state.medias, ALL_MEDIAS);
        } else {
          if (state.noSplitMedias) return;
          toggleSet(state.medias, val, t.checked, ALL_MEDIAS[0], isLine);
        }
      } else if (group === 'products') {
        if (isNoSplit) {
          state.noSplitProducts = !!t.checked;
          if (state.noSplitProducts) selectAll(state.products, ALL_PRODUCTS);
        } else {
          if (state.noSplitProducts) return;
          toggleSet(state.products, val, t.checked, ALL_PRODUCTS[0], isLine);
        }
      } else if (group === 'windows') {
        toggleSet(state.windows, val, t.checked, 'D0', isLine);
      }

      renderAll();
    });

    renderAll();
  }

  // Register to paid dashboard
  if (window.PaidDashboard && typeof window.PaidDashboard.registerModule === 'function') {
    window.PaidDashboard.registerModule('模块8：体育玩家/游戏玩家占比', init);
  } else {
    // Fallback: run on DOM ready
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
  }
})();
