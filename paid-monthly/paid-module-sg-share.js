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

  // --- Helpers
  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function uniq(arr) {
    return Array.from(new Set(arr));
  }

  function parseMonthKey(s) {
    if (!s || typeof s !== 'string' || s.length < 7) return { y: null, mo: null };
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
    if (!y || !mo) return m || '';
    const multiYear = yearsSet && yearsSet.size > 1;
    return multiYear ? `${y}-${String(mo).padStart(2, '0')}` : `${mo}月`;
  }

  function formatPct(v) {
    if (v === null || v === undefined || !Number.isFinite(v)) return '-';
    return (v * 100).toFixed(1) + '%';
  }

  function fmtInt(v) {
    if (v === null || v === undefined || !Number.isFinite(v)) return '-';
    return Math.round(v).toLocaleString('en-US');
  }

  function safeNum(x) {
    const v = Number(x);
    return Number.isFinite(v) ? v : 0;
  }

  function toKey(x) {
    return String(x || '').trim();
  }

  // Chips helpers
  function buildChipsHtml(options, group, cfg) {
    const labelFn = (cfg && cfg.labelFn) || ((x) => x);
    const extraClass = (cfg && cfg.className) || '';
    return options
      .map((opt) => {
        const v = toKey(opt);
        const id = `${MODULE_ID}-${group}-${v}`.replace(/[^a-zA-Z0-9_-]/g, '_');
        const label = labelFn(opt);
        return `
          <label class="paid-sg-chip ${extraClass}">
            <input type="checkbox" data-group="${group}" data-value="${v}" id="${id}" />
            <span>${label}</span>
          </label>
        `;
      })
      .join('');
  }

  function buildRadiosHtml(options, group, cfg) {
    const labelFn = (cfg && cfg.labelFn) || ((x) => x);
    const extraClass = (cfg && cfg.className) || '';
    return options
      .map((opt) => {
        const v = toKey(opt.key || opt);
        const label = labelFn(opt.label || opt);
        const id = `${MODULE_ID}-${group}-${v}`.replace(/[^a-zA-Z0-9_-]/g, '_');
        return `
          <label class="paid-sg-chip ${extraClass}">
            <input type="radio" name="${MODULE_ID}-${group}" data-group="${group}" data-value="${v}" id="${id}" />
            <span>${label}</span>
          </label>
        `;
      })
      .join('');
  }

  function setChecks(container, group, selectedSet, isRadio = false) {
    if (!container) return;
    const inputs = container.querySelectorAll(`input[data-group="${group}"]`);
    inputs.forEach((inp) => {
      const v = inp.getAttribute('data-value');
      if (isRadio) {
        inp.checked = selectedSet.has(v);
      } else {
        inp.checked = selectedSet.has(v);
      }
      const lab = inp.closest('label');
      if (lab) lab.classList.toggle('is-active', inp.checked);
    });
  }

  function syncChipActive(container) {
    if (!container) return;
    const inputs = container.querySelectorAll('input[data-group]');
    inputs.forEach((inp) => {
      const lab = inp.closest('label');
      if (lab) lab.classList.toggle('is-active', !!inp.checked);
    });
  }

  function ensureAtLeastOne(set, fallback) {
    if (set.size > 0) return;
    if (fallback !== undefined && fallback !== null) set.add(toKey(fallback));
  }

  function selectAll(set, options) {
    set.clear();
    options.forEach((o) => set.add(toKey(o)));
  }

  function toggleSet(set, val, checked, fallback, isLineMode) {
    if (checked) {
      set.add(val);
      return;
    }
    set.delete(val);
    if (isLineMode) {
      // in line mode we always keep 1
      ensureAtLeastOne(set, fallback);
    } else {
      ensureAtLeastOne(set, fallback);
    }
  }

  // Data access helpers (paid-data.js)
  function getRawPaidByMonth() {
    return window.RAW_PAID_BY_MONTH || window.RAW || {};
  }

  function getAnalysisTextRoot() {
    return window.PAID_ANALYSIS_TEXT || window.ANALYSIS_TEXT || {};
  }

  function getPaidInsightText(monthKey) {
    const root = getAnalysisTextRoot();
    const bucket = root && root[MODULE_KEY];
    const s = bucket && typeof bucket[monthKey] === 'string' ? bucket[monthKey].trim() : '';
    return s || '';
  }

  // --- Inject CSS (module-local)
  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .paid-sg-filters{
        display:flex;
        flex-wrap:wrap;
        gap:10px 14px;
        padding: 10px 12px;
        border: 1px solid rgba(226, 232, 240, 0.9);
        border-radius: 12px;
        background: rgba(248, 250, 252, 0.85);
        margin: 8px 0 10px;
      }
      .paid-sg-filter-group{
        display:flex;
        flex-direction:column;
        gap:6px;
        min-width: 220px;
      }
      .paid-sg-filter-label{
        font-size: 12px;
        color: var(--text-sub, #475569);
        display:flex;
        align-items:center;
        gap:8px;
        font-weight: 600;
      }
      .paid-sg-badge{
        font-size: 11px;
        padding: 2px 8px;
        border-radius: 999px;
        border: 1px solid rgba(148,163,184,0.5);
        color: var(--text-sub, #475569);
        background: rgba(255,255,255,0.7);
        font-weight: 500;
      }
      .paid-sg-options{
        display:flex;
        flex-wrap:wrap;
        gap:8px;
      }
      .paid-sg-chip{
        display:inline-flex;
        align-items:center;
        gap:6px;
        font-size: 12px;
        padding: 4px 10px;
        border-radius: 999px;
        border: 1px solid rgba(148,163,184,0.55);
        background: rgba(255,255,255,0.9);
        cursor:pointer;
        user-select:none;
        white-space:nowrap;
      }
      .paid-sg-chip input{
        cursor:pointer;
        accent-color: rgba(37, 99, 235, 0.95);
      }
      .paid-sg-chip.is-active{
        border-color: rgba(37,99,235,0.9);
        background: rgba(37,99,235,0.08);
        color: rgba(37,99,235,0.95);
        font-weight: 600;
      }
      .paid-sg-hint{
        font-size: 12px;
        color: var(--text-sub, #475569);
        line-height: 1.55;
        white-space: pre-wrap;
        word-break: break-word;
        min-height: 22px;
      }
      .paid-sg-chart-note{
        margin-top: 6px;
        font-size: 12px;
        color: var(--text-sub, #475569);
        line-height: 1.55;
        white-space: pre-wrap;
      }
      .paid-sg-table-wrap{
        margin-top: 10px;
        border: 1px solid rgba(226, 232, 240, 0.9);
        border-radius: 12px;
        background: rgba(255,255,255,0.9);
        overflow:hidden;
      }
      .paid-sg-table-title{
        padding: 10px 12px;
        border-bottom: 1px dashed rgba(148,163,184,0.6);
        font-size: 12px;
        font-weight: 700;
        color: var(--text-main, #0f172a);
        background: rgba(248, 250, 252, 0.9);
      }
      .paid-sg-table-scroll{
        overflow:auto;
        max-height: 340px;
      }
      .paid-sg-table{
        width:100%;
        border-collapse: collapse;
        font-size: 12px;
      }
      .paid-sg-table th, .paid-sg-table td{
        border-bottom: 1px solid rgba(226,232,240,0.9);
        padding: 7px 8px;
        text-align: center;
        vertical-align: middle;
      }
      .paid-sg-table thead th{
        position: sticky;
        top: 0;
        background: rgba(248, 250, 252, 0.98);
        z-index: 2;
        font-weight: 700;
        color: var(--text-main, #0f172a);
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
        gap:2px;
      }
      .paid-sg-cell .n{
        font-variant-numeric: tabular-nums;
        font-weight: 700;
        color: var(--text-main, #0f172a);
      }
      .paid-sg-cell .p{
        font-size: 11px;
        color: var(--text-sub, #475569);
      }
      .paid-sg-table-note{
        padding: 8px 12px;
        border-top: 1px dashed rgba(148,163,184,0.6);
        font-size: 12px;
        color: var(--text-sub, #475569);
        background: rgba(248, 250, 252, 0.9);
        white-space: pre-wrap;
        word-break: break-word;
      }
      .paid-sg-insight-title{
        margin-top: 10px;
        font-size: 12px;
        font-weight: 700;
        color: var(--text-main, #0f172a);
      }
      .paid-sg-insight-body{
        margin-top: 6px;
        border: 1px solid rgba(226,232,240,0.9);
        border-radius: 12px;
        padding: 10px 12px;
        background: rgba(248, 250, 252, 0.85);
        font-size: 12px;
        line-height: 1.6;
        color: var(--text-main, #0f172a);
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

    const main = document.querySelector('main') || document.body;
    const retention = document.getElementById('card-paid-retention');
    card = document.createElement('section');
    card.className = 'chart-card';
    card.id = CARD_ID;

    card.innerHTML = `
      <header class="chart-card-header">
        <div class="chart-title-block">
          <div class="chart-kicker">Mix</div>
          <div class="chart-title">体育玩家 / 游戏玩家占比</div>
          <div class="chart-sub">口径：总投注人数拆为「仅游戏」「双投」「仅体育」；支持 D0 / D7。</div>
        </div>
        <div class="chart-controls">
          <span class="chart-badge">单位：人</span>
        </div>
      </header>
      <div class="chart" style="display:none"></div>
    `;

    // Insert before retention card if exists; else append
    if (retention && retention.parentNode) retention.parentNode.insertBefore(card, retention);
    else main.appendChild(card);

    return card;
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

        <div class="chart-summary">
          <div class="chart-analysis-box">
            <div class="chart-analysis-months" id="sg-analysis-months-${MODULE_ID}"></div>
            <div class="chart-analysis-body">
              <div class="chart-analysis-title">数据分析</div>
              <textarea class="chart-analysis-textarea" id="sg-analysis-text-${MODULE_ID}" readonly placeholder="暂未填写该月份的数据分析文案。"></textarea>
            </div>
          </div>
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
      months: months.sort(),
      medias: Array.from(medias).sort(),
      products: Array.from(products).sort(),
      countries: Array.from(countries).sort()
    };
  }

  function getAllMonthKeys(rawByMonth) {
    const months = Object.keys(rawByMonth || {}).filter(Boolean).sort();
    return months;
  }

  // =============== Aggregation for bar chart ===============
  // We build counts by (month, country, media?, product?, window)
  // For bar chart, stack composition within each (month,country,window,media?,product?) group:
  // - onlyGame
  // - both (sport + game - total, floored to >=0)
  // - onlySport
  function aggMonthly(rawByMonth, state, dims) {
    const out = [];
    const monthsSel = Array.from(state.months);
    const countriesSel = Array.from(state.countries);
    const mediasSel = Array.from(state.medias);
    const productsSel = Array.from(state.products);
    const windowsSel = Array.from(state.windows);

    const splitCountry = !state.noSplitCountries;
    const splitMedia = !state.noSplitMedias;
    const splitProduct = !state.noSplitProducts;

    for (const mo of monthsSel) {
      const rows = Array.isArray(rawByMonth[mo]) ? rawByMonth[mo] : [];

      const filtered = rows.filter((r) => {
        if (!r) return false;
        const c = toKey(r.country);
        const media = toKey(r.media);
        const p = toKey(r.productType);
        const w = toKey(r.dayType || r.window || r.day || r.d || r.windowType);

        // Month already by key
        if (countriesSel.length && countriesSel.indexOf(c) === -1) return false;
        if (mediasSel.length && mediasSel.indexOf(media) === -1) return false;
        if (productsSel.length && productsSel.indexOf(p) === -1) return false;
        if (windowsSel.length && windowsSel.indexOf(w) === -1) return false;
        return true;
      });

      // Group
      const map = new Map();
      for (const r of filtered) {
        const c = toKey(r.country);
        const media = toKey(r.media);
        const p = toKey(r.productType);
        const w = toKey(r.dayType || r.window || r.day || r.d || r.windowType);

        const keyParts = [
          mo,
          splitCountry ? c : 'ALL_COUNTRY',
          splitMedia ? media : 'ALL_MEDIA',
          splitProduct ? p : 'ALL_PRODUCT',
          w
        ];
        const key = keyParts.join('|');
        const prev = map.get(key) || {
          month: mo,
          country: splitCountry ? c : 'ALL',
          media: splitMedia ? media : 'ALL',
          productType: splitProduct ? p : 'ALL',
          window: w,
          total: 0,
          sport: 0,
          game: 0
        };

        // Try known fields; fallback
        prev.total += safeNum(r.total_bet_users || r.totalBetUsers || r.totalUsers || r.total);
        prev.sport += safeNum(r.sport_bet_users || r.sportBetUsers || r.sportUsers || r.sport);
        prev.game += safeNum(r.game_bet_users || r.gameBetUsers || r.gameUsers || r.game);

        map.set(key, prev);
      }

      for (const v of map.values()) {
        const both = Math.max(0, v.sport + v.game - v.total);
        const onlySport = Math.max(0, v.sport - both);
        const onlyGame = Math.max(0, v.game - both);
        out.push({
          ...v,
          both,
          onlySport,
          onlyGame
        });
      }
    }

    // Sort by month, then country fixed order
    const countryRank = (c) => {
      const idx = COUNTRY_ORDER.indexOf(c);
      return idx >= 0 ? idx : 999;
    };

    out.sort((a, b) => {
      if (a.month !== b.month) return a.month < b.month ? -1 : 1;
      if (a.country !== b.country) return countryRank(a.country) - countryRank(b.country);
      if (a.window !== b.window) return WINDOW_ORDER.indexOf(a.window) - WINDOW_ORDER.indexOf(b.window);
      if (a.media !== b.media) return a.media < b.media ? -1 : 1;
      if (a.productType !== b.productType) return a.productType < b.productType ? -1 : 1;
      return 0;
    });

    return out;
  }

  // =============== Daily for line (stacked area) ===============
  // Line mode forbids multi-select; we render stacked area with:
  // - onlySport (bottom)
  // - onlyGame (middle)
  // - both (top)
  function buildDailySeries(rawByMonth, state) {
    const monthKey = Array.from(state.months)[0];
    const country = Array.from(state.countries)[0];
    const media = Array.from(state.medias)[0];
    const product = Array.from(state.products)[0];
    const windowKey = Array.from(state.windows)[0];

    const rows = Array.isArray(rawByMonth[monthKey]) ? rawByMonth[monthKey] : [];
    const filtered = rows
      .filter((r) => {
        if (!r) return false;
        if (toKey(r.country) !== toKey(country)) return false;
        if (toKey(r.media) !== toKey(media)) return false;
        if (toKey(r.productType) !== toKey(product)) return false;
        if (toKey(r.dayType || r.window || r.day || r.d || r.windowType) !== toKey(windowKey)) return false;
        return true;
      })
      .map((r) => {
        const d = r.date || r.day || r.dt;
        const total = safeNum(r.total_bet_users || r.totalBetUsers || r.totalUsers || r.total);
        const sport = safeNum(r.sport_bet_users || r.sportBetUsers || r.sportUsers || r.sport);
        const game = safeNum(r.game_bet_users || r.gameBetUsers || r.gameUsers || r.game);
        const both = Math.max(0, sport + game - total);
        const onlySport = Math.max(0, sport - both);
        const onlyGame = Math.max(0, game - both);
        return { date: d, total, sport, game, both, onlySport, onlyGame };
      })
      .filter((x) => x.date);

    // Sort date asc
    filtered.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

    const x = filtered.map((r) => r.date);
    const s1 = filtered.map((r) => r.onlySport);
    const s2 = filtered.map((r) => r.onlyGame);
    const s3 = filtered.map((r) => r.both);

    return { x, s1, s2, s3 };
  }

  // =============== ECharts configs ===============
  function makeBaseOption() {
    return {
      grid: { left: 58, right: 20, top: 18, bottom: 42 },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        borderWidth: 0,
        textStyle: { fontSize: 11 },
        axisPointer: { type: 'shadow' }
      },
      legend: {
        top: 4,
        right: 6,
        textStyle: { fontSize: 11, color: '#475569' }
      },
      xAxis: {
        type: 'category',
        axisTick: { show: false },
        axisLine: { lineStyle: { color: 'rgba(148,163,184,0.6)' } },
        axisLabel: { color: '#334155', fontSize: 11 }
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: 'rgba(226,232,240,0.9)' } },
        axisLabel: { color: '#64748b', fontSize: 11 }
      }
    };
  }

  function buildBarOption(monthsSel, rows, state, yearsSet) {
    // rows: aggregated objects for selected months
    // Bar axis is country; for each month and window create bars (D0/D7 not stacked, but each bar itself is stacked composition by sport/game/both)
    // We need per (month, window) series, each series is stacked with three segments:
    // - onlyGame (blue), both (green), onlySport (yellow)
    const countries = state.noSplitCountries ? ['ALL'] : COUNTRY_ORDER.filter((c) => state.countries.has(c));
    const xAxis = countries;

    // Colors fixed
    const COLOR_GAME = '#3b82f6';
    const COLOR_BOTH = '#22c55e';
    const COLOR_SPORT = '#f59e0b';

    // Ensure stable order: monthsSel sorted asc, windows order D0 then D7 within month
    const monthsSorted = monthsSel.slice().sort();
    const windowsSorted = Array.from(state.windows).sort((a, b) => WINDOW_ORDER.indexOf(a) - WINDOW_ORDER.indexOf(b));

    const series = [];

    // Helper to get group record
    function findRec(month, country, windowKey) {
      // If noSplit for media/product, row uses 'ALL'
      const cKey = state.noSplitCountries ? 'ALL' : country;
      const wKey = windowKey;
      // We already applied noSplit selections by selecting all; group may be split or not, but for bar we always aggregate within selected medias/products unless splits disabled? Here spec says: bar mode allows multi and "全选不区分" merges.
      // We will aggregate across all media/product in chosen set, so we need to sum them for this (month,country,window) regardless of media/product.
      let total = 0, sport = 0, game = 0, both = 0, onlySport = 0, onlyGame = 0;
      for (const r of rows) {
        if (r.month !== month) continue;
        if (toKey(r.window) !== toKey(wKey)) continue;
        if (state.noSplitCountries) {
          if (r.country !== 'ALL') continue;
        } else {
          if (toKey(r.country) !== toKey(cKey)) continue;
        }
        // aggregate across dims
        total += safeNum(r.total);
        sport += safeNum(r.sport);
        game += safeNum(r.game);
        both += safeNum(r.both);
        onlySport += safeNum(r.onlySport);
        onlyGame += safeNum(r.onlyGame);
      }
      return { total, sport, game, both, onlySport, onlyGame };
    }

    // Build stacked series: For each month+window, create three series segments with same stack id per month+window, but we want them grouped per country.
    // Also need visual: D7 should have hatch. In ECharts, use decal in itemStyle for each series (applies to segments).
    const monthColorMap = {};
    const palette = ['#60a5fa', '#34d399', '#fbbf24']; // month distinct colors for border? We'll instead use opacity? Spec doesn't require month color here; the stacked colors are fixed (game/sport/both). We'll use month color for border maybe.
    monthsSorted.forEach((m, i) => { monthColorMap[m] = palette[i % palette.length]; });

    const groupLabels = [];
    for (const m of monthsSorted) {
      for (const w of windowsSorted) {
        groupLabels.push({ m, w, label: `${monthLabel(m, yearsSet)} ${w}` });
      }
    }

    // For grouped bars, we can create multiple stacks; ECharts will render each stack as separate bar per category per series index.
    // We'll add series in order: for each group, add onlyGame, both, onlySport.
    groupLabels.forEach(({ m, w, label }, gi) => {
      const stack = `${m}-${w}`;
      const isD7 = String(w).toUpperCase() === 'D7';
      const decal = isD7 ? { symbol: 'rect', dashArrayX: [4, 2], dashArrayY: [4, 2], rotation: Math.PI / 4, color: 'rgba(15,23,42,0.12)' } : null;

      const borderColor = monthColorMap[m];

      series.push({
        name: `${label}·仅游戏`,
        type: 'bar',
        stack,
        barGap: '20%',
        barCategoryGap: '40%',
        emphasis: { focus: 'series' },
        itemStyle: {
          color: COLOR_GAME,
          borderColor,
          borderWidth: 0.5,
          decal
        },
        data: xAxis.map((c) => findRec(m, c, w).onlyGame)
      });
      series.push({
        name: `${label}·双投`,
        type: 'bar',
        stack,
        emphasis: { focus: 'series' },
        itemStyle: {
          color: COLOR_BOTH,
          borderColor,
          borderWidth: 0.5,
          decal
        },
        data: xAxis.map((c) => findRec(m, c, w).both)
      });
      series.push({
        name: `${label}·仅体育`,
        type: 'bar',
        stack,
        emphasis: { focus: 'series' },
        itemStyle: {
          color: COLOR_SPORT,
          borderColor,
          borderWidth: 0.5,
          decal
        },
        data: xAxis.map((c) => findRec(m, c, w).onlySport)
      });
    });

    const opt = makeBaseOption();
    opt.tooltip.axisPointer.type = 'shadow';
    opt.xAxis.data = xAxis;
    opt.legend = { show: false };
    opt.yAxis.name = '人数';
    opt.series = series;

    // Provide custom tooltip
    opt.tooltip.formatter = function (params) {
      // params is array of segments at that axis category
      if (!Array.isArray(params) || !params.length) return '';
      const c = params[0].axisValueLabel || params[0].name || '';
      // Group by month+window
      const groupMap = new Map();
      params.forEach((p) => {
        const name = p.seriesName || '';
        const m = name.split(' ')[0] || '';
        const w = (name.split(' ')[1] || '').split('·')[0] || '';
        const key = `${m} ${w}`;
        const g = groupMap.get(key) || { m, w, onlyGame: 0, both: 0, onlySport: 0 };
        if (name.indexOf('仅游戏') !== -1) g.onlyGame += safeNum(p.value);
        if (name.indexOf('双投') !== -1) g.both += safeNum(p.value);
        if (name.indexOf('仅体育') !== -1) g.onlySport += safeNum(p.value);
        groupMap.set(key, g);
      });

      const lines = [`<div style="font-weight:700;margin-bottom:4px;">${c}</div>`];
      Array.from(groupMap.values()).forEach((g) => {
        const total = g.onlyGame + g.both + g.onlySport;
        lines.push(`<div style="margin:4px 0 2px;opacity:.9;">${g.m} ${g.w} · 总计 ${fmtInt(total)}</div>`);
        lines.push(`<div>仅游戏：${fmtInt(g.onlyGame)}；双投：${fmtInt(g.both)}；仅体育：${fmtInt(g.onlySport)}</div>`);
      });
      return lines.join('');
    };

    return opt;
  }

  function buildLineOption(daily, meta) {
    const opt = makeBaseOption();
    opt.grid = { left: 58, right: 20, top: 26, bottom: 52 };
    opt.xAxis = {
      type: 'category',
      data: daily.x,
      axisTick: { show: false },
      axisLine: { lineStyle: { color: 'rgba(148,163,184,0.6)' } },
      axisLabel: {
        color: '#334155',
        fontSize: 11,
        formatter: (v) => {
          // show day part if YYYY-MM-DD
          const s = String(v);
          return s.length >= 10 ? s.slice(8, 10) : s;
        }
      }
    };
    opt.yAxis = {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: 'rgba(226,232,240,0.9)' } },
      axisLabel: { color: '#64748b', fontSize: 11 },
      name: '人数'
    };
    opt.legend = {
      top: 2,
      left: 58,
      textStyle: { fontSize: 11, color: '#475569' }
    };

    // Colors fixed: sport yellow bottom, game blue middle, both green top
    opt.series = [
      {
        name: '仅体育',
        type: 'line',
        stack: 'stack',
        areaStyle: {},
        emphasis: { focus: 'series' },
        symbol: 'none',
        lineStyle: { width: 1.5 },
        itemStyle: { color: '#f59e0b' },
        data: daily.s1
      },
      {
        name: '仅游戏',
        type: 'line',
        stack: 'stack',
        areaStyle: {},
        emphasis: { focus: 'series' },
        symbol: 'none',
        lineStyle: { width: 1.5 },
        itemStyle: { color: '#3b82f6' },
        data: daily.s2
      },
      {
        name: '双投',
        type: 'line',
        stack: 'stack',
        areaStyle: {},
        emphasis: { focus: 'series' },
        symbol: 'none',
        lineStyle: { width: 1.5 },
        itemStyle: { color: '#22c55e' },
        data: daily.s3
      }
    ];

    opt.tooltip = {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.92)',
      borderWidth: 0,
      textStyle: { fontSize: 11 },
      axisPointer: { type: 'line' },
      formatter: function (params) {
        if (!Array.isArray(params) || !params.length) return '';
        const d = params[0].axisValueLabel || params[0].name || '';
        let onlySport = 0, onlyGame = 0, both = 0;
        params.forEach((p) => {
          if (p.seriesName === '仅体育') onlySport = safeNum(p.value);
          if (p.seriesName === '仅游戏') onlyGame = safeNum(p.value);
          if (p.seriesName === '双投') both = safeNum(p.value);
        });
        const total = onlySport + onlyGame + both;
        return [
          `<div style="font-weight:700;margin-bottom:4px;">${d}</div>`,
          `<div style="opacity:.9;">总计：${fmtInt(total)}</div>`,
          `<div>仅体育：${fmtInt(onlySport)}；仅游戏：${fmtInt(onlyGame)}；双投：${fmtInt(both)}</div>`
        ].join('');
      }
    };

    return opt;
  }

  // =============== Table building ===============
  function buildTableTitle(state, medias, products) {
    const mediaPart = state.noSplitMedias ? '' : medias.join('+');
    const prodPart = state.noSplitProducts ? '' : products.join('+');
    const inside = [mediaPart, prodPart].filter(Boolean).join('，');
    return inside ? `数据表（${inside}）` : `数据表`;
  }

  function buildTable(rows, state, monthsSel, yearsSet, dims) {
    // Rows are aggregated per month, country, window, media, product (depending on noSplit flags)
    const monthsSorted = monthsSel.slice().sort();
    const windowsSorted = Array.from(state.windows).sort((a, b) => WINDOW_ORDER.indexOf(a) - WINDOW_ORDER.indexOf(b));

    const showMediaCol = !state.noSplitMedias;
    const showProductCol = !state.noSplitProducts;

    const countries = state.noSplitCountries ? ['ALL'] : COUNTRY_ORDER.filter((c) => state.countries.has(c));

    // Build row keys
    const keyMap = new Map();

    function rowKey(country, media, product) {
      return [country, showMediaCol ? media : '', showProductCol ? product : ''].join('|');
    }

    function ensureRow(country, media, product) {
      const k = rowKey(country, media, product);
      if (keyMap.has(k)) return keyMap.get(k);
      const obj = { country };
      if (showMediaCol) obj.media = media;
      if (showProductCol) obj.productType = product;
      keyMap.set(k, obj);
      return obj;
    }

    // Get unique combos from rows
    const combos = new Set();
    if (showMediaCol || showProductCol) {
      rows.forEach((r) => {
        combos.add(rowKey(r.country, r.media, r.productType));
      });
    } else {
      countries.forEach((c) => combos.add(rowKey(c, '', '')));
    }

    // Fill
    rows.forEach((r) => {
      const country = r.country;
      const media = r.media;
      const product = r.productType;
      const row = ensureRow(country, media, product);
      const m = r.month;
      const w = r.window;
      const both = safeNum(r.both);
      const onlySport = safeNum(r.onlySport);
      const onlyGame = safeNum(r.onlyGame);
      const total = onlySport + onlyGame + both;

      const suffix = `${m}_${w}`;
      row[`onlyGame_${suffix}`] = (row[`onlyGame_${suffix}`] || 0) + onlyGame;
      row[`both_${suffix}`] = (row[`both_${suffix}`] || 0) + both;
      row[`onlySport_${suffix}`] = (row[`onlySport_${suffix}`] || 0) + onlySport;
      row[`total_${suffix}`] = (row[`total_${suffix}`] || 0) + total;
    });

    // Build headers
    const headers = [];
    headers.push({ key: 'country', label: '国家' });
    if (showMediaCol) headers.push({ key: 'media', label: '媒体' });
    if (showProductCol) headers.push({ key: 'productType', label: '产品类型' });

    monthsSorted.forEach((m) => {
      windowsSorted.forEach((w) => {
        const top = `${monthLabel(m, yearsSet)} ${w}`;
        headers.push({ key: `onlyGame_${m}_${w}`, label: `${top} 仅游戏：人数 (占比)` });
        headers.push({ key: `both_${m}_${w}`, label: `${top} 双投：人数 (占比)` });
        headers.push({ key: `onlySport_${m}_${w}`, label: `${top} 仅体育：人数 (占比)` });
        headers.push({ key: `total_${m}_${w}`, label: `${top} 总计：人数` });
      });
    });

    // Build rows list
    const list = Array.from(keyMap.values());

    // Sort
    const countryRank = (c) => {
      const idx = COUNTRY_ORDER.indexOf(c);
      return idx >= 0 ? idx : 999;
    };
    list.sort((a, b) => {
      if (a.country !== b.country) return countryRank(a.country) - countryRank(b.country);
      if (showMediaCol && a.media !== b.media) return a.media < b.media ? -1 : 1;
      if (showProductCol && a.productType !== b.productType) return a.productType < b.productType ? -1 : 1;
      return 0;
    });

    // Render HTML table
    const thead = `
      <thead>
        <tr>
          ${headers
            .map((h) => {
              // Wrap long header: make second line small
              if (h.label.indexOf('：') !== -1) {
                const parts = h.label.split('：');
                const main = parts[0];
                const sub = parts.slice(1).join('：');
                return `<th><div>${main}</div><div class="paid-sg-th-sub">${sub}</div></th>`;
              }
              return `<th>${h.label}</th>`;
            })
            .join('')}
        </tr>
      </thead>
    `;

    function cellHtml(n, p) {
      return `<div class="paid-sg-cell"><div class="n">${fmtInt(n)}</div><div class="p">${formatPct(p)}</div></div>`;
    }

    const tbody = `
      <tbody>
        ${list
          .map((r) => {
            const cells = headers.map((h, idx) => {
              const k = h.key;
              if (k === 'country') return `<th>${r.country}</th>`;
              if (k === 'media') return `<td>${r.media || '-'}</td>`;
              if (k === 'productType') return `<td>${r.productType || '-'}</td>`;

              // data cell
              const val = safeNum(r[k]);
              if (k.startsWith('total_')) {
                return `<td><div class="paid-sg-cell"><div class="n">${fmtInt(val)}</div></div></td>`;
              }
              // ratio uses same total in same suffix
              const suffix = k.replace(/^(onlyGame_|both_|onlySport_)/, '');
              const totalKey = `total_${suffix}`;
              const total = safeNum(r[totalKey]);
              const pct = total > 0 ? val / total : 0;
              return `<td>${cellHtml(val, pct)}</td>`;
            });

            return `<tr>${cells.join('')}</tr>`;
          })
          .join('')}
      </tbody>
    `;

    return `<table class="paid-sg-table">${thead}${tbody}</table>`;
  }

  // =============== Filters / State ===============
  function init() {
    ensureStyle();
    const card = ensureCard();

    // Replace placeholder chart div with module layout
    const chartHolder = card.querySelector('.chart');
    if (chartHolder) chartHolder.style.display = 'none';
    // Clear old body
    const existedRoot = card.querySelector(`#${ROOT_ID}`);
    if (existedRoot) existedRoot.remove();

    // Append layout
    const body = document.createElement('div');
    body.innerHTML = buildLayoutHTML();
    card.appendChild(body);

    const root = card.querySelector(`#${ROOT_ID}`);
    if (!root) return;

    // Data
    const RAW = getRawPaidByMonth();
    const distinct = collectDistinct(RAW);
    const allMonths = getAllMonthKeys(RAW);

    // Month options
    const yearsSetAll = yearsOfMonths(allMonths);
    const latestMonth = allMonths[allMonths.length - 1] || null;

    // Derive media/product options from data; if empty, fallback expected defaults
    const ALL_MEDIAS = distinct.medias.length ? distinct.medias : ['fb', 'gg'];
    const ALL_PRODUCTS = distinct.products.length ? distinct.products : ['app', 'h5'];
    const countryOptions = distinct.countries.length ? distinct.countries : COUNTRY_ORDER.slice();

    // Add "全选但不区分" option for country/media/product
    const NOSPLIT_COUNTRY = '__ALL_NOSPLIT_COUNTRY__';
    const NOSPLIT_MEDIA = '__ALL_NOSPLIT_MEDIA__';
    const NOSPLIT_PRODUCT = '__ALL_NOSPLIT_PRODUCT__';

    // State
    const state = {
      chartType: 'bar',
      months: new Set([latestMonth].filter(Boolean)),
      countries: new Set([countryOptions[0] || COUNTRY_ORDER[0]]),
      medias: new Set([ALL_MEDIAS[0]]),
      products: new Set([ALL_PRODUCTS[0]]),
      windows: new Set(['D0']),
      noSplitCountries: false,
      noSplitMedias: false,
      noSplitProducts: false
    };

    // Elements
    const monthsEl = root.querySelector(`#sg-months-${MODULE_ID}`);
    const countriesEl = root.querySelector(`#sg-countries-${MODULE_ID}`);
    const chartTypeEl = root.querySelector(`#sg-chartType-${MODULE_ID}`);
    const mediasEl = root.querySelector(`#sg-medias-${MODULE_ID}`);
    const productsEl = root.querySelector(`#sg-products-${MODULE_ID}`);
    const windowsEl = root.querySelector(`#sg-windows-${MODULE_ID}`);

    const badgeMonths = root.querySelector(`#sg-badge-months-${MODULE_ID}`);
    const badgeCountries = root.querySelector(`#sg-badge-countries-${MODULE_ID}`);
    const badgeMedias = root.querySelector(`#sg-badge-medias-${MODULE_ID}`);
    const badgeProducts = root.querySelector(`#sg-badge-products-${MODULE_ID}`);
    const badgeWindows = root.querySelector(`#sg-badge-windows-${MODULE_ID}`);

    const hintEl = root.querySelector(`#sg-hint-${MODULE_ID}`);
    const chartEl = root.querySelector(`#sg-chart-${MODULE_ID}`);
    const chartNoteEl = root.querySelector(`#sg-chart-note-${MODULE_ID}`);

    const tableTitleEl = root.querySelector(`#sg-table-title-${MODULE_ID}`);
    const tableEl = root.querySelector(`#sg-table-${MODULE_ID}`);
    const tableNoteEl = root.querySelector(`#sg-table-note-${MODULE_ID}`);

    const analysisMonthsEl = root.querySelector(`#sg-analysis-months-${MODULE_ID}`);
    const analysisTextareaEl = root.querySelector(`#sg-analysis-text-${MODULE_ID}`);

    // 3) Build filter UI
    monthsEl.innerHTML = buildChipsHtml(allMonths, 'months', {
      labelFn: (m) => monthLabel(m, yearsSetAll)
    });

    // Countries: inject extra "全选但不区分"
    countriesEl.innerHTML =
      `
      <label class="paid-sg-chip">
        <input type="checkbox" data-group="countries" data-value="${NOSPLIT_COUNTRY}" />
        <span>全选但不区分</span>
      </label>
    ` + buildChipsHtml(countryOptions, 'countries');

    chartTypeEl.innerHTML = buildRadiosHtml(CHART_TYPES, 'chartType');

    mediasEl.innerHTML =
      `
      <label class="paid-sg-chip">
        <input type="checkbox" data-group="medias" data-value="${NOSPLIT_MEDIA}" />
        <span>全选但不区分</span>
      </label>
    ` + buildChipsHtml(ALL_MEDIAS, 'medias');

    productsEl.innerHTML =
      `
      <label class="paid-sg-chip">
        <input type="checkbox" data-group="products" data-value="${NOSPLIT_PRODUCT}" />
        <span>全选但不区分</span>
      </label>
    ` + buildChipsHtml(ALL_PRODUCTS, 'products');

    windowsEl.innerHTML = buildChipsHtml(WINDOW_ORDER, 'windows', { labelFn: (w) => w });

    // Initialize radio
    const ctRadio = chartTypeEl.querySelector(`input[data-group="chartType"][data-value="${state.chartType}"]`);
    if (ctRadio) ctRadio.checked = true;
    syncChipActive(chartTypeEl);

    // Initialize checks
    setChecks(monthsEl, 'months', state.months);
    setChecks(countriesEl, 'countries', state.countries);
    setChecks(mediasEl, 'medias', state.medias);
    setChecks(productsEl, 'products', state.products);
    setChecks(windowsEl, 'windows', state.windows);

    // Default badges
    function setBadge(el, txt) {
      if (!el) return;
      el.textContent = txt;
    }

    // ECharts
    let chart = null;
    if (chartEl && window.echarts) {
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
        try {
          window.PaidDashboard.registerChart(chart);
        } catch (_) { }
      }
    }

    // ========= Enforce line singles =========
    function enforceLineSingles() {
      // line mode forbids multi select for: month/country/media/product/window
      // and also forbids "noSplit" toggles; force them off
      state.noSplitCountries = false;
      state.noSplitMedias = false;
      state.noSplitProducts = false;

      const keepOne = (set, fallback) => {
        if (set.size === 1) return;
        const arr = Array.from(set);
        set.clear();
        // Keep last selected if any; else fallback
        set.add(arr[arr.length - 1] || fallback);
      };

      keepOne(state.months, latestMonth);
      keepOne(state.countries, countryOptions[0] || COUNTRY_ORDER[0]);
      keepOne(state.medias, ALL_MEDIAS[0]);
      keepOne(state.products, ALL_PRODUCTS[0]);
      keepOne(state.windows, 'D0');

      // Update UI checkboxes: disable multi? We'll keep enabled but state enforces single
      // Also uncheck "全选但不区分"
      const noSplitInputs = [
        countriesEl.querySelector(`input[data-value="${NOSPLIT_COUNTRY}"]`),
        mediasEl.querySelector(`input[data-value="${NOSPLIT_MEDIA}"]`),
        productsEl.querySelector(`input[data-value="${NOSPLIT_PRODUCT}"]`)
      ];
      noSplitInputs.forEach((inp) => { if (inp) inp.checked = false; });

      // Set radio active highlight
      syncChipActive(countriesEl);
      syncChipActive(mediasEl);
      syncChipActive(productsEl);
      syncChipActive(monthsEl);
      syncChipActive(windowsEl);
    }

    function enforceMonthMax() {
      const arr = Array.from(state.months).sort();
      if (arr.length <= MONTH_MAX) return null;
      // Keep last MONTH_MAX (most recent)
      const keep = arr.slice(-MONTH_MAX);
      state.months.clear();
      keep.forEach((m) => state.months.add(m));
      return `月份最多选 ${MONTH_MAX} 个，已自动保留最近 ${MONTH_MAX} 个：${keep.join(', ')}`;
    }

    // ========= Render =========
    function renderHint(note) {
      const parts = [];
      if (state.chartType === 'line') {
        parts.push('折线图模式：月份/国家/媒体/产品类型/D0-D7 均为单选；图为日级堆积面积图。');
      } else {
        if (state.noSplitCountries) parts.push('国家：全选但不区分（图/表聚合）。');
        if (state.noSplitMedias) parts.push('媒体：全选但不区分（图/表聚合）。');
        if (state.noSplitProducts) parts.push('产品类型：全选但不区分（图/表聚合）。');
        parts.push('柱状图：每根柱子内部堆叠为「仅游戏/双投/仅体育」，同一月份 D0/D7 用相同颜色；D7 使用斜线阴影。');
      }
      if (note) parts.push(note);
      if (hintEl) hintEl.textContent = parts.join('\n');
    }

    function renderChart(monthsSel, rows, yearsSet) {
      if (!chart || !chartEl) return;
      if (state.chartType === 'bar') {
        const opt = buildBarOption(monthsSel, rows, state, yearsSet);
        chart.setOption(opt, true);
        if (chartNoteEl) {
          chartNoteEl.textContent =
            `纵轴：人数；每根柱子为总投注人数拆分（仅游戏/双投/仅体育）。\n双投人数 = 体育人数 + 游戏人数 - 总投注人数（若小于 0 则置 0）。`;
        }
      } else {
        const daily = buildDailySeries(RAW, state);
        const opt = buildLineOption(daily);
        chart.setOption(opt, true);
        if (chartNoteEl) {
          chartNoteEl.textContent =
            `折线：日级堆积面积图（仅体育/仅游戏/双投）。\n双投人数 = 体育人数 + 游戏人数 - 总投注人数（若小于 0 则置 0）。`;
        }
      }
    }

    function renderTable(rows, monthsSel, yearsSet) {
      if (!tableEl) return;

      const mediasSel = Array.from(state.medias);
      const productsSel = Array.from(state.products);

      const title = buildTableTitle(state, mediasSel, productsSel);
      if (tableTitleEl) tableTitleEl.textContent = title;

      // Build table from rows
      const html = buildTable(rows, state, monthsSel, yearsSet);
      tableEl.outerHTML = html;

      // Re-select after outerHTML replacement
      const tableNew = root.querySelector('.paid-sg-table');
      if (tableNew) {
        // no-op
      }

      if (tableNoteEl) {
        const showMediaCol = !state.noSplitMedias;
        const showProductCol = !state.noSplitProducts;
        const dimNote = [
          `占比口径：分组人数 / 总投注人数`,
          `维度：${state.noSplitCountries ? '国家全选不拆' : '按国家'}${showMediaCol ? ' + 媒体' : ''}${showProductCol ? ' + 产品类型' : ''}`,
          `单位：人、%`
        ].join('；');
        tableNoteEl.textContent = dimNote;
      }
    }

    function renderInsight(monthsSel) {
      if (!analysisMonthsEl || !analysisTextareaEl) return;

      const ys = yearsOfMonths(monthsSel);
      const blocks = [];

      // 左侧月份（随筛选变化；多选时全部高亮）
      analysisMonthsEl.innerHTML = '';
      for (const m of monthsSel) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'chart-analysis-month-btn active';
        btn.dataset.month = m;
        btn.textContent = monthLabel(m, ys);
        btn.title = m;
        analysisMonthsEl.appendChild(btn);
      }

      for (const m of monthsSel) {
        const t = getPaidInsightText(m);
        const label = monthLabel(m, ys);
        blocks.push(`${label}\n${t || '（该月暂无文案）'}`);
      }

      analysisTextareaEl.value = blocks.join('\n\n');

      // 自动撑高：跟 paid-module-retention 同款“数据分析”一致
      analysisTextareaEl.style.height = 'auto';
      analysisTextareaEl.style.height = analysisTextareaEl.scrollHeight + 'px';
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

      const monthsSel = Array.from(state.months).sort();
      const yearsSet = yearsOfMonths(monthsSel);

      // Update badges
      setBadge(badgeMonths, state.chartType === 'line' ? '单选' : `多选≤${MONTH_MAX}`);
      setBadge(badgeCountries, state.chartType === 'line' ? '单选' : '多选');
      setBadge(badgeMedias, state.chartType === 'line' ? '单选' : '多选');
      setBadge(badgeProducts, state.chartType === 'line' ? '单选' : '多选');
      setBadge(badgeWindows, state.chartType === 'line' ? '单选' : '多选');

      // Sync UI selections
      setChecks(monthsEl, 'months', state.months);
      setChecks(countriesEl, 'countries', state.countries);
      setChecks(mediasEl, 'medias', state.medias);
      setChecks(productsEl, 'products', state.products);
      setChecks(windowsEl, 'windows', state.windows);

      // active highlight
      syncChipActive(monthsEl);
      syncChipActive(countriesEl);
      syncChipActive(mediasEl);
      syncChipActive(productsEl);
      syncChipActive(windowsEl);
      syncChipActive(chartTypeEl);

      renderHint(note);

      if (state.chartType === 'bar') {
        // Aggregate monthly
        const rows = aggMonthly(RAW, state, distinct);
        renderChart(monthsSel, rows, yearsSet);
        renderTable(rows, monthsSel, yearsSet);
      } else {
        renderChart(monthsSel, [], yearsSet);
        // For line mode, table still shows monthly aggregated for chosen single month? Spec says table should still be interactive; we can show monthly aggregated within that month only.
        const rows = aggMonthly(RAW, state, distinct);
        renderTable(rows, monthsSel, yearsSet);
      }

      renderInsight(monthsSel);
    }

    // ========= Bind events =========
    root.addEventListener('change', (e) => {
      const t = e.target;
      if (!t || !t.matches || !t.matches('input[data-group]')) return;

      const group = t.getAttribute('data-group');
      const val = t.getAttribute('data-value');
      const isLine = state.chartType === 'line';

      if (group === 'chartType') {
        // Radio
        state.chartType = val;
        renderAll();
        return;
      }

      if (group === 'countries') {
        if (val === NOSPLIT_COUNTRY) {
          state.noSplitCountries = !!t.checked;
          if (state.noSplitCountries) selectAll(state.countries, countryOptions);
        } else {
          if (state.noSplitCountries) return;
          toggleSet(state.countries, val, t.checked, countryOptions[0] || COUNTRY_ORDER[0], isLine);
        }
      } else if (group === 'months') {
        toggleSet(state.months, val, t.checked, latestMonth, isLine);
      } else if (group === 'medias') {
        if (val === NOSPLIT_MEDIA) {
          state.noSplitMedias = !!t.checked;
          if (state.noSplitMedias) selectAll(state.medias, ALL_MEDIAS);
        } else {
          if (state.noSplitMedias) return;
          toggleSet(state.medias, val, t.checked, ALL_MEDIAS[0], isLine);
        }
      } else if (group === 'products') {
        if (val === NOSPLIT_PRODUCT) {
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
