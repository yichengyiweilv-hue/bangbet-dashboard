// ===========================
// 模块 7：D0 / D7 人均流水（买量）
// 文件：paid-monthly/paid-module-betflow.js
// ===========================
//
// 需求要点（简版）：
// - 顶部筛选器：月份(最多3)、国家、图表类型(柱/折)、媒体、产品类型、人均类型(总/体育/游戏-单选)、D0/D7(多选)
// - 媒体/产品类型/国家支持「全选但不区分」：勾选=全选；折线与表格不按该维度拆分
// - 柱状图：x=国家（GH/KE/NG/TZ 固定顺序）；每国最多 月份×(D0/D7) 6 根；同月同色，D7 加斜线阴影
// - 折线图：日级；按(国家×媒体×产品类型)拆分（受「全选但不区分」影响）；同组跨多月连贯；D0 虚线 / D7 实线
// - 表格：行=国家（必要时加媒体/产品类型列）；列=选中月份×(D0/D7) 的「X月Dx 人均XX流水」；表名附带(媒体,产品类型)
// - 取数：来自 RAW_PAID_BY_MONTH（paid-data.js）；口径：BET_FLOW / BET_PLACED_USER

(function () {
  'use strict';

  // ---- Guard ----
  window.OVP = window.OVP || {};
  const MODULE_ID = 'flow'; // ⚠️ 对应 paid-analytics.js 里的文案 key：flow

  const COUNTRIES_ORDER = ['GH', 'KE', 'NG', 'TZ'];
  const PRODUCT_ORDER = ['app', 'h5'];

  const MONTH_PALETTE = [
    '#2563eb', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444',
    '#0ea5e9', '#22c55e', '#f97316', '#6366f1', '#14b8a6',
    '#e11d48', '#64748b'
  ];

  const SERIES_PALETTE = [
    '#2563eb', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444',
    '#0ea5e9', '#22c55e', '#f97316', '#6366f1', '#14b8a6',
    '#e11d48', '#64748b', '#7c3aed', '#059669', '#ea580c'
  ];

  const METRICS = {
    D0: { key: 'D0', label: 'D0', lineStyle: 'dashed' },
    D7: { key: 'D7', label: 'D7', lineStyle: 'solid' }
  };

  const PER_CAPITA = {
    total: {
      key: 'total',
      label: '总',
      num: { D0: 'D0_TOTAL_BET_FLOW',   D7: 'D7_TOTAL_BET_FLOW'   },
      den: { D0: 'D0_TOTAL_BET_PLACED_USER', D7: 'D7_TOTAL_BET_PLACED_USER' }
    },
    sports: {
      key: 'sports',
      label: '体育',
      num: { D0: 'D0_SPORTS_BET_FLOW', D7: 'D7_SPORTS_BET_FLOW' },
      den: { D0: 'D0_SPORTS_BET_PLACED_USER', D7: 'D7_SPORTS_BET_PLACED_USER' }
    },
    games: {
      key: 'games',
      label: '游戏',
      num: { D0: 'D0_GAMES_BET_FLOW',  D7: 'D7_GAMES_BET_FLOW'  },
      den: { D0: 'D0_GAMES_BET_PLACED_USER',  D7: 'D7_GAMES_BET_PLACED_USER'  }
    }
  };

  const STYLE_ID = 'ovp-style-paid-betflow';

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      /* paid-betflow: filters */
      .ovp-pbf-filters{
        display:flex;
        flex-wrap:wrap;
        gap:10px;
        align-items:flex-start;
        margin: 0 0 10px;
      }
      .ovp-pbf-group{
        display:flex;
        flex-wrap:wrap;
        align-items:center;
        gap:8px;
        padding:8px 10px;
        border:1px solid rgba(148,163,184,.60);
        border-radius:12px;
        background: rgba(255,255,255,.72);
      }
      .ovp-pbf-group-title{
        font-size:11px;
        color: var(--muted);
        margin-right:2px;
        white-space:nowrap;
      }
      .ovp-pbf-option{
        display:inline-flex;
        align-items:center;
        gap:6px;
        padding:4px 8px;
        border:1px solid rgba(148,163,184,.55);
        border-radius:999px;
        background:#fff;
        cursor:pointer;
        user-select:none;
        font-size:11px;
        color: var(--text);
        line-height:1;
      }
      .ovp-pbf-option input{
        margin:0;
        accent-color: var(--ovp-blue, #2563eb);
      }
      .ovp-pbf-option:hover{
        border-color: rgba(37,99,235,.55);
      }
      .ovp-pbf-hint{
        font-size:11px;
        color: var(--muted);
        margin-left: 2px;
        white-space:nowrap;
      }

      /* paid-betflow: table */
      .ovp-pbf-tablewrap{
        border:1px solid rgba(148,163,184,.60);
        border-radius:12px;
        background: rgba(255,255,255,.92);
        overflow:auto;
      }
      .ovp-pbf-tablehead{
        display:flex;
        align-items:baseline;
        justify-content:space-between;
        gap:10px;
        padding:10px 12px;
        border-bottom:1px solid rgba(148,163,184,.35);
        background: rgba(249,250,251,.98);
      }
      .ovp-pbf-tabletitle{
        font-size:12px;
        font-weight:600;
        color: var(--text);
      }
      .ovp-pbf-tablemeta{
        font-size:11px;
        color: var(--muted);
        white-space:nowrap;
      }
      .ovp-pbf-table{
        width:100%;
        border-collapse:separate;
        border-spacing:0;
        min-width: 860px;
        font-size:12px;
      }
      .ovp-pbf-table thead th{
        position:sticky;
        top:0;
        background: rgba(249,250,251,.98);
        color: var(--muted);
        font-weight:600;
        text-align:right;
        padding:10px 10px;
        border-bottom:1px solid rgba(148,163,184,.45);
        white-space:nowrap;
      }
      .ovp-pbf-table thead th:first-child{
        text-align:left;
        left:0;
        z-index:2;
      }
      .ovp-pbf-table tbody td{
        padding:9px 10px;
        border-bottom:1px solid rgba(148,163,184,.22);
        text-align:right;
        white-space:nowrap;
      }
      .ovp-pbf-table tbody tr:last-child td{
        border-bottom:none;
      }
      .ovp-pbf-table tbody td:first-child{
        text-align:left;
        position:sticky;
        left:0;
        background: rgba(255,255,255,.98);
        z-index:1;
        color: var(--text);
        font-weight:600;
      }

      /* paid-betflow: insight header */
      .ovp-pbf-insight-head{
        display:flex;
        align-items:baseline;
        justify-content:space-between;
        gap:10px;
        margin-top: 4px;
      }
      .ovp-pbf-insight-title{
        font-size:12px;
        font-weight:600;
        color: var(--text);
      }
      .ovp-pbf-insight-meta{
        font-size:11px;
        color: var(--muted);
        white-space:nowrap;
      }
    `;
    document.head.appendChild(style);
  }

  function uniq(arr) {
    const out = [];
    const seen = new Set();
    for (const v of (Array.isArray(arr) ? arr : [])) {
      const k = String(v);
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(v);
    }
    return out;
  }

  function safeNum(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  function sortMonthsSafe(utils, ms) {
    if (utils && typeof utils.sortMonths === 'function') return utils.sortMonths(ms);
    return (Array.isArray(ms) ? ms.slice() : []).sort((a, b) => String(a).localeCompare(String(b)));
  }

  function monthToShortLabel(ym) {
    // "2025-09" -> "9月"
    if (!ym || typeof ym !== 'string' || ym.length < 7) return String(ym || '');
    const m = Number(ym.slice(5, 7));
    if (!Number.isFinite(m) || m <= 0) return ym;
    return `${m}月`;
  }

  function fmtMoney(utils, v, digits = 2, currency = 'USD') {
    if (v === null || v === undefined) return '—';
    const n = Number(v);
    if (!Number.isFinite(n)) return '—';
    if (utils && typeof utils.fmtMoney === 'function') return utils.fmtMoney(n, currency, digits);
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: digits }).format(n);
    } catch (_) {
      return `${n.toFixed(digits)} ${currency}`;
    }
  }

  function createDecal() {
    return {
      symbol: 'rect',
      symbolSize: 2,
      dashArrayX: [1, 0],
      dashArrayY: [6, 6],
      rotation: Math.PI / 4,
      color: 'rgba(255,255,255,0.40)'
    };
  }

  function getAllValues(rawByMonth, allMonths) {
    const medias = new Set();
    const productTypes = new Set();

    try {
      for (const m of allMonths) {
        const rows = Array.isArray(rawByMonth && rawByMonth[m]) ? rawByMonth[m] : [];
        for (const r of rows) {
          if (r && r.media) medias.add(String(r.media));
          if (r && r.productType) productTypes.add(String(r.productType));
        }
      }
    } catch (_) { /* ignore */ }

    return {
      medias: Array.from(medias).sort((a, b) => String(a).localeCompare(String(b))),
      productTypes: Array.from(productTypes).sort((a, b) => {
        const ia = PRODUCT_ORDER.indexOf(a);
        const ib = PRODUCT_ORDER.indexOf(b);
        if (ia >= 0 && ib >= 0) return ia - ib;
        if (ia >= 0) return -1;
        if (ib >= 0) return 1;
        return String(a).localeCompare(String(b));
      })
    };
  }

  function ensureNonEmpty(nextArr, fallbackArr) {
    const a = Array.isArray(nextArr) ? nextArr : [];
    if (a.length) return a;
    return Array.isArray(fallbackArr) && fallbackArr.length ? fallbackArr.slice() : [];
  }

  function enforceMaxMonths(utils, arr, max, noteFn) {
    const ms = sortMonthsSafe(utils, uniq(arr));
    if (ms.length <= max) return ms;
    const kept = ms.slice(-max);
    if (typeof noteFn === 'function') noteFn(`月份最多选${max}个，已自动保留最近${max}个月：${kept.join(', ')}`);
    return kept;
  }

  function buildBarAgg({ rawByMonth, months, countries, medias, productTypes, metrics, perDef, countryNoSplit }) {
    const countriesSet = new Set(countries);
    const mediasSet = new Set(medias);
    const prodSet = new Set(productTypes);

    const out = {};
    for (const month of months) {
      const rows = Array.isArray(rawByMonth && rawByMonth[month]) ? rawByMonth[month] : [];
      const acc = {}; // key -> {D0:{num,den}, D7:{num,den}}
      const keys = countryNoSplit ? ['ALL'] : countries;
      for (const k of keys) {
        acc[k] = {};
        for (const metric of metrics) acc[k][metric] = { num: 0, den: 0 };
      }

      for (const r of rows) {
        if (!r) continue;
        const c = String(r.country || '');
        if (!c) continue;
        if (!countriesSet.has(c)) continue;
        if (!mediasSet.has(String(r.media || ''))) continue;
        if (!prodSet.has(String(r.productType || ''))) continue;

        const targetKey = countryNoSplit ? 'ALL' : c;
        const slot = acc[targetKey];
        if (!slot) continue;

        for (const metric of metrics) {
          const numField = perDef.num[metric];
          const denField = perDef.den[metric];
          slot[metric].num += safeNum(r[numField]);
          slot[metric].den += safeNum(r[denField]);
        }
      }

      out[month] = {};
      for (const k of keys) {
        out[month][k] = {};
        for (const metric of metrics) {
          const den = acc[k][metric].den;
          out[month][k][metric] = den > 0 ? (acc[k][metric].num / den) : null;
        }
      }
    }

    return out;
  }

  function buildBarOption({ utils, perLabel, months, categories, metrics, monthAgg, monthColorMap }) {
    const series = [];
    const legend = [];

    for (let i = 0; i < months.length; i++) {
      const m = months[i];
      const mLabel = monthToShortLabel(m);
      const color = monthColorMap[m] || MONTH_PALETTE[i % MONTH_PALETTE.length];

      for (const metric of metrics) {
        const name = `${mLabel} ${metric}`;
        legend.push(name);

        series.push({
          name,
          type: 'bar',
          data: categories.map((cat) => {
            const v = (monthAgg && monthAgg[m] && monthAgg[m][cat]) ? monthAgg[m][cat][metric] : null;
            return (v === null || v === undefined) ? null : v;
          }),
          itemStyle: metric === 'D7'
            ? { color, decal: createDecal() }
            : { color },
          emphasis: { focus: 'series' }
        });
      }
    }

    return {
      animationDuration: 300,
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: function (params) {
          if (!Array.isArray(params) || !params.length) return '';
          const axis = params[0].axisValueLabel || params[0].axisValue || '';
          let html = `<div style="font-weight:600;margin-bottom:6px;">${axis}</div>`;
          html += `<div style="color:#6b7280;margin-bottom:6px;">人均${perLabel}流水 · 单位：USD/人</div>`;
          for (const p of params) {
            const val = (p.data === null || p.data === undefined) ? null : Number(p.data);
            const dot = `<span style="display:inline-block;width:8px;height:8px;border-radius:10px;background:${p.color};margin-right:6px;vertical-align:middle;"></span>`;
            html += `<div style="margin:4px 0;">${dot}<span style="color:#111827;">${p.seriesName}</span>：<span style="font-weight:600;color:#111827;">${fmtMoney(utils, val, 2)}</span></div>`;
          }
          return html;
        }
      },
      legend: {
        data: legend,
        top: 8,
        left: 8,
        textStyle: { color: '#6b7280', fontSize: 11 },
        type: 'scroll'
      },
      grid: { top: 56, left: 52, right: 18, bottom: 36, containLabel: true },
      xAxis: {
        type: 'category',
        data: categories,
        axisTick: { alignWithLabel: true },
        axisLabel: { color: '#6b7280' }
      },
      yAxis: {
        type: 'value',
        min: 0,
        axisLabel: {
          color: '#6b7280',
          formatter: function (val) {
            const n = Number(val);
            if (!Number.isFinite(n)) return '';
            return n >= 1000 ? `${Math.round(n / 100) / 10}k` : String(Math.round(n));
          }
        },
        splitLine: { lineStyle: { color: 'rgba(148,163,184,0.25)' } }
      },
      series
    };
  }

  function buildDailySeries({ rawByMonth, months, countries, medias, productTypes, metrics, perDef, groupBy }) {
    const countriesSet = new Set(countries);
    const mediasSet = new Set(medias);
    const prodSet = new Set(productTypes);

    const dateSet = new Set();
    const acc = new Map(); // key: date \u0001 groupKey -> {D0:{num,den}, D7:{num,den}}
    const meta = new Map(); // groupKey -> {country, media, productType, label}

    function groupKeyOf(r) {
      const parts = [];
      if (groupBy.country) parts.push(String(r.country || ''));
      if (groupBy.media) parts.push(String(r.media || ''));
      if (groupBy.productType) parts.push(String(r.productType || ''));
      return parts.length ? parts.join('|') : 'ALL';
    }

    function metaOfKey(key) {
      if (key === 'ALL') return { country: 'ALL', media: 'ALL', productType: 'ALL' };
      const parts = String(key).split('|');
      const out = { country: 'ALL', media: 'ALL', productType: 'ALL' };
      let i = 0;
      if (groupBy.country) out.country = parts[i++] || '—';
      if (groupBy.media) out.media = parts[i++] || '—';
      if (groupBy.productType) out.productType = parts[i++] || '—';
      return out;
    }

    for (const m of months) {
      const rows = Array.isArray(rawByMonth && rawByMonth[m]) ? rawByMonth[m] : [];
      for (const r of rows) {
        if (!r || !r.date) continue;
        const c = String(r.country || '');
        if (!c) continue;
        if (!countriesSet.has(c)) continue;
        if (!mediasSet.has(String(r.media || ''))) continue;
        if (!prodSet.has(String(r.productType || ''))) continue;

        const d = String(r.date);
        dateSet.add(d);

        const gk = groupKeyOf(r);
        if (!meta.has(gk)) {
          const mm = metaOfKey(gk);
          const parts = [];
          if (groupBy.country) parts.push(mm.country);
          if (groupBy.media) parts.push(mm.media);
          if (groupBy.productType) parts.push(mm.productType);
          meta.set(gk, {
            ...mm,
            label: parts.length ? parts.join('·') : 'ALL'
          });
        }

        const k = `${d}\u0001${gk}`;
        if (!acc.has(k)) {
          const init = {};
          for (const metric of metrics) init[metric] = { num: 0, den: 0 };
          acc.set(k, init);
        }
        const slot = acc.get(k);

        for (const metric of metrics) {
          const numField = perDef.num[metric];
          const denField = perDef.den[metric];
          slot[metric].num += safeNum(r[numField]);
          slot[metric].den += safeNum(r[denField]);
        }
      }
    }

    const dates = Array.from(dateSet).sort((a, b) => String(a).localeCompare(String(b)));

    const groups = Array.from(meta.entries()).map(([key, m]) => ({ key, ...m }));

    function countryIdx(c) {
      const i = COUNTRIES_ORDER.indexOf(c);
      return i >= 0 ? i : 999;
    }
    function productIdx(p) {
      const i = PRODUCT_ORDER.indexOf(p);
      return i >= 0 ? i : 999;
    }

    groups.sort((a, b) => {
      if (groupBy.country) {
        const da = countryIdx(a.country);
        const db = countryIdx(b.country);
        if (da !== db) return da - db;
      }
      if (groupBy.media) {
        const ma = String(a.media).localeCompare(String(b.media));
        if (ma !== 0) return ma;
      }
      if (groupBy.productType) {
        const pa = productIdx(a.productType);
        const pb = productIdx(b.productType);
        if (pa !== pb) return pa - pb;
      }
      return String(a.label).localeCompare(String(b.label));
    });

    groups.forEach((g, idx) => { g.color = SERIES_PALETTE[idx % SERIES_PALETTE.length]; });

    for (const g of groups) {
      g.data = {};
      for (const metric of metrics) {
        g.data[metric] = dates.map((d) => {
          const slot = acc.get(`${d}\u0001${g.key}`);
          if (!slot) return null;
          const den = slot[metric].den;
          return den > 0 ? (slot[metric].num / den) : null;
        });
      }
    }

    return { dates, groups };
  }

  function buildLineOption({ utils, perLabel, dates, groups, metrics }) {
    const series = [];
    const legendData = [];

    for (const g of groups) {
      legendData.push(g.label);

      for (const metric of metrics) {
        const def = METRICS[metric];
        if (!def) continue;

        series.push({
          id: `${g.key}__${metric}`,
          name: g.label, // 同名：legend 里只显示一次，切换时 D0/D7 一起隐藏
          type: 'line',
          data: g.data[metric],
          showSymbol: false,
          connectNulls: true,
          smooth: false,
          lineStyle: { width: 2, type: def.lineStyle, color: g.color },
          itemStyle: { color: g.color },
          emphasis: { focus: 'series' }
        });
      }
    }

    return {
      animationDuration: 300,
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'line' },
        formatter: function (params) {
          if (!Array.isArray(params) || !params.length) return '';
          const date = params[0].axisValueLabel || params[0].axisValue || '';
          const byName = {};

          for (const p of params) {
            const sid = String(p.seriesId || '');
            const metric = sid.endsWith('__D7') ? 'D7' : (sid.endsWith('__D0') ? 'D0' : '');
            if (!byName[p.seriesName]) byName[p.seriesName] = {};
            byName[p.seriesName][metric] = (p.data === null || p.data === undefined) ? null : Number(p.data);
          }

          const names = Object.keys(byName).sort((a, b) => String(a).localeCompare(String(b)));

          let html = `<div style="font-weight:600;margin-bottom:6px;">${date}</div>`;
          html += `<div style="color:#6b7280;margin-bottom:6px;">人均${perLabel}流水 · 单位：USD/人</div>`;

          for (const name of names) {
            const d0 = ('D0' in byName[name]) ? byName[name].D0 : null;
            const d7 = ('D7' in byName[name]) ? byName[name].D7 : null;
            const d0s = fmtMoney(utils, d0, 2);
            const d7s = fmtMoney(utils, d7, 2);
            html += `<div style="margin:4px 0;"><span style="color:#111827;font-weight:600;">${name}</span>：<span style="color:#111827;">D0 ${d0s}</span><span style="color:#6b7280;"> / </span><span style="color:#111827;">D7 ${d7s}</span></div>`;
          }
          return html;
        }
      },
      legend: {
        data: legendData,
        top: 8,
        left: 8,
        textStyle: { color: '#6b7280', fontSize: 11 },
        type: 'scroll'
      },
      grid: { top: 56, left: 52, right: 18, bottom: 44, containLabel: true },
      xAxis: {
        type: 'category',
        data: dates,
        axisLabel: {
          color: '#6b7280',
          formatter: function (v) {
            const s = String(v || '');
            return s.length >= 10 ? s.slice(5) : s;
          }
        },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'value',
        min: 0,
        axisLabel: {
          color: '#6b7280',
          formatter: function (val) {
            const n = Number(val);
            if (!Number.isFinite(n)) return '';
            return n >= 1000 ? `${Math.round(n / 100) / 10}k` : String(Math.round(n));
          }
        },
        splitLine: { lineStyle: { color: 'rgba(148,163,184,0.25)' } }
      },
      series
    };
  }

  function buildTableGroups({ rawByMonth, months, countries, medias, productTypes, metrics, perDef, groupBy }) {
    const countriesSet = new Set(countries);
    const mediasSet = new Set(medias);
    const prodSet = new Set(productTypes);

    const groups = new Map(); // gk -> { country, media, productType, byMonth: { [m]: {D0:{num,den}, D7...} } }

    function keyOf(r) {
      const parts = [];
      if (groupBy.country) parts.push(String(r.country || ''));
      if (groupBy.media) parts.push(String(r.media || ''));
      if (groupBy.productType) parts.push(String(r.productType || ''));
      return parts.length ? parts.join('|') : 'ALL';
    }
    function metaFromKey(key) {
      if (key === 'ALL') return { country: 'ALL', media: 'ALL', productType: 'ALL' };
      const parts = String(key).split('|');
      const out = { country: 'ALL', media: 'ALL', productType: 'ALL' };
      let i = 0;
      if (groupBy.country) out.country = parts[i++] || '—';
      if (groupBy.media) out.media = parts[i++] || '—';
      if (groupBy.productType) out.productType = parts[i++] || '—';
      return out;
    }

    for (const m of months) {
      const rows = Array.isArray(rawByMonth && rawByMonth[m]) ? rawByMonth[m] : [];
      for (const r of rows) {
        if (!r) continue;
        const c = String(r.country || '');
        if (!c) continue;
        if (!countriesSet.has(c)) continue;
        if (!mediasSet.has(String(r.media || ''))) continue;
        if (!prodSet.has(String(r.productType || ''))) continue;

        const gk = keyOf(r);
        if (!groups.has(gk)) {
          const meta = metaFromKey(gk);
          groups.set(gk, { key: gk, ...meta, byMonth: {} });
        }
        const g = groups.get(gk);

        if (!g.byMonth[m]) {
          const init = {};
          for (const metric of metrics) init[metric] = { num: 0, den: 0 };
          g.byMonth[m] = init;
        }

        for (const metric of metrics) {
          const numField = perDef.num[metric];
          const denField = perDef.den[metric];
          g.byMonth[m][metric].num += safeNum(r[numField]);
          g.byMonth[m][metric].den += safeNum(r[denField]);
        }
      }
    }

    const list = Array.from(groups.values());

    function countryIdx(c) {
      const i = COUNTRIES_ORDER.indexOf(c);
      return i >= 0 ? i : 999;
    }
    function productIdx(p) {
      const i = PRODUCT_ORDER.indexOf(p);
      return i >= 0 ? i : 999;
    }

    list.sort((a, b) => {
      const da = countryIdx(a.country);
      const db = countryIdx(b.country);
      if (da !== db) return da - db;

      if (groupBy.media) {
        const ma = String(a.media).localeCompare(String(b.media));
        if (ma !== 0) return ma;
      }
      if (groupBy.productType) {
        const pa = productIdx(a.productType);
        const pb = productIdx(b.productType);
        if (pa !== pb) return pa - pb;
      }
      return 0;
    });

    return list;
  }

  function buildTableHtml({ utils, months, metrics, perLabel, groups, showMediaCol, showProductCol, titleSuffix }) {
    const cols = [];

    cols.push({ key: 'country', label: '国家', align: 'left' });
    if (showMediaCol) cols.push({ key: 'media', label: '媒体', align: 'left' });
    if (showProductCol) cols.push({ key: 'productType', label: '产品类型', align: 'left' });

    for (const m of months) {
      const mLabel = monthToShortLabel(m);
      for (const metric of metrics) {
        cols.push({
          key: `${m}__${metric}`,
          label: `${mLabel} ${metric} 人均${perLabel}流水`,
          align: 'right'
        });
      }
    }

    const headTh = cols.map((c, idx) => {
      const align = (idx === 0 || c.align === 'left') ? 'left' : 'right';
      return `<th style="text-align:${align};">${c.label}</th>`;
    }).join('');

    const bodyTr = groups.map((g) => {
      const tds = [];

      tds.push(`<td>${g.country}</td>`);
      if (showMediaCol) tds.push(`<td>${g.media}</td>`);
      if (showProductCol) tds.push(`<td>${g.productType}</td>`);

      for (const m of months) {
        for (const metric of metrics) {
          const cell = g.byMonth && g.byMonth[m] && g.byMonth[m][metric] ? g.byMonth[m][metric] : null;
          const val = cell && cell.den > 0 ? (cell.num / cell.den) : null;
          tds.push(`<td>${fmtMoney(utils, val, 2)}</td>`);
        }
      }

      return `<tr>${tds.join('')}</tr>`;
    }).join('');

    const meta = `列：${months.length}个月 × ${metrics.length}个口径 · 单位：USD/人`;

    return `
      <div class="ovp-pbf-tablehead">
        <div class="ovp-pbf-tabletitle">数据表${titleSuffix ? `（${titleSuffix}）` : ''}</div>
        <div class="ovp-pbf-tablemeta">${meta}</div>
      </div>
      <table class="ovp-pbf-table">
        <thead><tr>${headTh}</tr></thead>
        <tbody>${bodyTr || `<tr><td colspan="${cols.length}" style="text-align:left;color:#6b7280;">无数据</td></tr>`}</tbody>
      </table>
    `;
  }

  function buildTitleSuffix({ medias, productTypes, mediaNoSplit, productNoSplit }) {
    // 表名括号：示例要求「fb+gg，app」
    const mediaText = mediaNoSplit ? '全选但不区分' : (medias && medias.length ? medias.join('+') : '—');
    const prodText = productNoSplit ? '全选但不区分' : (productTypes && productTypes.length ? productTypes.join('+') : '—');
    return `${mediaText}，${prodText}`;
  }

  function getAnalysisText(moduleKey, month) {
    try {
      const a = (window.ANALYSIS_TEXT && window.ANALYSIS_TEXT[moduleKey]) ? window.ANALYSIS_TEXT[moduleKey] : null;
      if (a && month && typeof a[month] === 'string') return a[month];
    } catch (_) { /* ignore */ }

    try {
      if (window.OVP && typeof window.OVP.getInsight === 'function') {
        return window.OVP.getInsight(moduleKey, month) || '';
      }
    } catch (_) { /* ignore */ }

    return '';
  }

  // ---------- Main render ----------
  function render({ mountEl, rawByMonth, months, latestMonth, utils }) {
    injectStyles();

    const allMonths = sortMonthsSafe(utils, months || []);
    const hasData = rawByMonth && typeof rawByMonth === 'object' && allMonths.length;

    const ui = (OVP.ui && typeof OVP.ui.mountModule === 'function')
      ? OVP.ui.mountModule(mountEl, { moduleId: MODULE_ID, chartHeight: 380 })
      : null;

    if (!ui || !ui.chartEl || !ui.insightEl) {
      mountEl.innerHTML = `<div class="ovp-alert">flow 模块挂载失败：缺少 OVP.ui.mountModule。</div>`;
      return;
    }

    const chartEl = ui.chartEl;
    const chartNoteEl = ui.chartNoteEl;
    const insightEl = ui.insightEl;

    const stackEl = mountEl.querySelector('.ovp-module-stack');
    const chartBlockEl = chartEl.parentElement;

    if (!hasData) {
      chartEl.classList.add('is-empty');
      chartEl.innerHTML = `<div class="ovp-skeleton"></div>`;
      if (chartNoteEl) chartNoteEl.textContent = '未检测到 RAW_PAID_BY_MONTH：请确认 paid-data.js 正常加载。';
      insightEl.textContent = '—';
      insightEl.classList.add('is-empty');
      return;
    }

    const vals = getAllValues(rawByMonth, allMonths);
    const allMedias = vals.medias.length ? vals.medias : ['FB', 'GG'];
    const allProductTypes = vals.productTypes.length ? vals.productTypes : ['app', 'h5'];
    const allCountries = COUNTRIES_ORDER.slice();

    const defaultMonths = (function () {
      if (!allMonths.length) return [];
      if (allMonths.length <= 2) return allMonths.slice();
      return allMonths.slice(-2);
    })();

    const state = {
      months: defaultMonths,
      view: 'bar', // bar | line
      countries: allCountries.slice(),
      medias: allMedias.slice(),
      productTypes: allProductTypes.slice(),
      countryNoSplit: false,
      mediaNoSplit: true,
      productNoSplit: true,
      perKey: 'total',
      metrics: ['D0', 'D7']
    };

    const filtersEl = document.createElement('div');
    filtersEl.className = 'ovp-pbf-filters';

    function buildGroup(title, options, hint) {
      const g = document.createElement('div');
      g.className = 'ovp-pbf-group';
      const t = document.createElement('span');
      t.className = 'ovp-pbf-group-title';
      t.textContent = title;
      g.appendChild(t);

      for (const opt of options) {
        const label = document.createElement('label');
        label.className = 'ovp-pbf-option';
        const input = document.createElement('input');
        input.type = opt.type || 'checkbox';
        input.name = opt.name || '';
        input.value = opt.value;
        input.dataset.group = opt.group;
        if (opt.special) input.dataset.special = opt.special;
        if (opt.checked) input.checked = true;

        label.appendChild(input);
        label.appendChild(document.createTextNode(opt.label));
        g.appendChild(label);
      }

      if (hint) {
        const h = document.createElement('span');
        h.className = 'ovp-pbf-hint';
        h.textContent = hint;
        g.appendChild(h);
      }

      return g;
    }

    function renderFilterUI() {
      filtersEl.innerHTML = '';

      const monthOpts = allMonths.map((m) => ({
        group: 'month',
        type: 'checkbox',
        value: m,
        label: monthToShortLabel(m),
        checked: state.months.includes(m)
      }));

      const countryOpts = [
        { group: 'country', type: 'checkbox', value: '__nosplit__', label: '全选但不区分', checked: !!state.countryNoSplit, special: 'nosplit' },
        ...allCountries.map((c) => ({ group: 'country', type: 'checkbox', value: c, label: c, checked: state.countryNoSplit ? true : state.countries.includes(c) }))
      ];

      const viewName = `${MODULE_ID}-view`;
      const viewOpts = [
        { group: 'view', type: 'radio', name: viewName, value: 'bar', label: '月度柱状图', checked: state.view === 'bar' },
        { group: 'view', type: 'radio', name: viewName, value: 'line', label: '日级折线图', checked: state.view === 'line' }
      ];

      const mediaOpts = [
        { group: 'media', type: 'checkbox', value: '__nosplit__', label: '全选但不区分', checked: !!state.mediaNoSplit, special: 'nosplit' },
        ...allMedias.map((m) => ({ group: 'media', type: 'checkbox', value: m, label: m, checked: state.mediaNoSplit ? true : state.medias.includes(m) }))
      ];

      const prodOpts = [
        { group: 'product', type: 'checkbox', value: '__nosplit__', label: '全选但不区分', checked: !!state.productNoSplit, special: 'nosplit' },
        ...allProductTypes.map((p) => ({ group: 'product', type: 'checkbox', value: p, label: p, checked: state.productNoSplit ? true : state.productTypes.includes(p) }))
      ];

      const perName = `${MODULE_ID}-per`;
      const perOpts = [
        { group: 'per', type: 'radio', name: perName, value: 'total', label: '人均总流水', checked: state.perKey === 'total' },
        { group: 'per', type: 'radio', name: perName, value: 'sports', label: '人均体育流水', checked: state.perKey === 'sports' },
        { group: 'per', type: 'radio', name: perName, value: 'games', label: '人均游戏流水', checked: state.perKey === 'games' }
      ];

      const metricOpts = ['D0', 'D7'].map((k) => ({ group: 'metric', type: 'checkbox', value: k, label: k, checked: state.metrics.includes(k) }));

      filtersEl.appendChild(buildGroup('月份', monthOpts, '最多选3个'));
      filtersEl.appendChild(buildGroup('国家', countryOpts));
      filtersEl.appendChild(buildGroup('图表', viewOpts));
      filtersEl.appendChild(buildGroup('媒体', mediaOpts));
      filtersEl.appendChild(buildGroup('产品类型', prodOpts));
      filtersEl.appendChild(buildGroup('人均', perOpts));
      filtersEl.appendChild(buildGroup('数据', metricOpts));
    }

    renderFilterUI();

    if (stackEl && chartBlockEl) stackEl.insertBefore(filtersEl, chartBlockEl);
    else mountEl.insertBefore(filtersEl, mountEl.firstChild);

    const tableWrap = document.createElement('div');
    tableWrap.className = 'ovp-pbf-tablewrap';
    tableWrap.innerHTML = `<div class="ovp-alert">数据表加载中…</div>`;
    if (stackEl) stackEl.insertBefore(tableWrap, insightEl);

    const insightHead = document.createElement('div');
    insightHead.className = 'ovp-pbf-insight-head';
    insightHead.innerHTML = `
      <div class="ovp-pbf-insight-title">数据解读</div>
      <div class="ovp-pbf-insight-meta" id="${MODULE_ID}-insight-meta">—</div>
    `;
    if (stackEl) stackEl.insertBefore(insightHead, insightEl);
    const insightMetaEl = insightHead.querySelector(`#${MODULE_ID}-insight-meta`);

    let chart = null;
    function ensureChart() {
      if (chart) return chart;
      if (!window.echarts || !chartEl) return null;

      chartEl.classList.remove('is-empty');
      chartEl.innerHTML = '';
      chart = window.echarts.init(chartEl);

      try {
        if (window.ResizeObserver) {
          const ro = new ResizeObserver(() => { try { chart.resize(); } catch (_) {} });
          ro.observe(chartEl);
        }
      } catch (_) {}

      return chart;
    }

    function setNote(msg) {
      if (!chartNoteEl) return;
      chartNoteEl.textContent = msg || '';
      chartNoteEl.classList.toggle('is-empty', !String(msg || '').trim());
    }

    function resolveSelected() {
      const selectedMonths = enforceMaxMonths(utils, state.months, 3, setNote);
      state.months = ensureNonEmpty(selectedMonths, defaultMonths);

      state.metrics = ensureNonEmpty(uniq(state.metrics), ['D0', 'D7']);

      if (state.countryNoSplit) state.countries = allCountries.slice();
      state.countries = ensureNonEmpty(uniq(state.countries), allCountries);

      if (state.mediaNoSplit) state.medias = allMedias.slice();
      state.medias = ensureNonEmpty(uniq(state.medias), allMedias);

      if (state.productNoSplit) state.productTypes = allProductTypes.slice();
      state.productTypes = ensureNonEmpty(uniq(state.productTypes), allProductTypes);

      const monthsOrdered = sortMonthsSafe(utils, state.months);
      const countriesOrdered = state.countryNoSplit
        ? ['ALL']
        : COUNTRIES_ORDER.filter((c) => state.countries.includes(c));

      const metricsOrdered = ['D0', 'D7'].filter((m) => state.metrics.includes(m));

      return {
        months: monthsOrdered,
        countriesForBar: countriesOrdered.length ? countriesOrdered : (state.countryNoSplit ? ['ALL'] : []),
        countriesForFilter: state.countryNoSplit ? allCountries.slice() : COUNTRIES_ORDER.filter((c) => state.countries.includes(c)),
        medias: state.mediaNoSplit ? allMedias.slice() : state.medias.slice(),
        productTypes: state.productNoSplit ? allProductTypes.slice() : state.productTypes.slice(),
        metrics: metricsOrdered,
        perDef: PER_CAPITA[state.perKey] || PER_CAPITA.total
      };
    }

    function updateInsights(selectedMonths) {
      const ms = sortMonthsSafe(utils, selectedMonths);
      if (insightMetaEl) insightMetaEl.textContent = ms.length ? `月份：${ms.join(', ')}` : '月份：—';

      const blocks = ms.map((m) => {
        const text = String(getAnalysisText(MODULE_ID, m) || '').trim();
        return `${monthToShortLabel(m)}（${m}）\n${text ? text : '（该月暂无文案）'}`;
      });

      const out = blocks.join('\n\n--------------------------------\n\n');
      insightEl.textContent = out || '（暂无文案）';
      insightEl.classList.toggle('is-empty', !String(out || '').trim());
    }

    function updateAll() {
      setNote('');

      const sel = resolveSelected();
      const { months: monthsSel, countriesForBar, countriesForFilter, medias, productTypes, metrics, perDef } = sel;

      renderFilterUI();

      const perLabel = perDef.label;
      const monthColorMap = {};
      allMonths.forEach((m, idx) => { monthColorMap[m] = MONTH_PALETTE[idx % MONTH_PALETTE.length]; });

      const ec = ensureChart();
      if (ec) {
        let option;

        if (state.view === 'bar') {
          const agg = buildBarAgg({
            rawByMonth,
            months: monthsSel,
            countries: countriesForFilter,
            medias,
            productTypes,
            metrics,
            perDef,
            countryNoSplit: state.countryNoSplit
          });

          option = buildBarOption({
            utils,
            perLabel,
            months: monthsSel,
            categories: countriesForBar,
            metrics,
            monthAgg: agg,
            monthColorMap
          });

          const mediaNote = state.mediaNoSplit ? '媒体=全选不区分' : `媒体=${medias.join('+')}`;
          const prodNote = state.productNoSplit ? '产品=全选不区分' : `产品=${productTypes.join('+')}`;
          setNote(`口径：人均${perLabel}流水 = ${perDef.num.D0} / ${perDef.den.D0}（按 D0/D7 切换）· ${mediaNote} · ${prodNote} · 单位：USD/人`);
        } else {
          const groupBy = {
            country: !state.countryNoSplit,
            media: !state.mediaNoSplit,
            productType: !state.productNoSplit
          };

          const daily = buildDailySeries({
            rawByMonth,
            months: monthsSel,
            countries: countriesForFilter,
            medias,
            productTypes,
            metrics,
            perDef,
            groupBy
          });

          option = buildLineOption({
            utils,
            perLabel,
            dates: daily.dates,
            groups: daily.groups,
            metrics
          });

          const mediaNote = state.mediaNoSplit ? '媒体=全选不区分' : `媒体=${medias.join('+')}`;
          const prodNote = state.productNoSplit ? '产品=全选不区分' : `产品=${productTypes.join('+')}`;
          const splitNote = `拆分维度：${[
            groupBy.country ? '国家' : null,
            groupBy.media ? '媒体' : null,
            groupBy.productType ? '产品类型' : null
          ].filter(Boolean).join('·') || '不拆分'}`;

          setNote(`日级折线：${splitNote} · ${mediaNote} · ${prodNote} · D0 虚线 / D7 实线 · 单位：USD/人`);
        }

        ec.setOption(option, true);
      }

      const tableGroupBy = {
        country: !state.countryNoSplit,
        media: !state.mediaNoSplit,
        productType: !state.productNoSplit
      };

      const tableGroups = buildTableGroups({
        rawByMonth,
        months: monthsSel,
        countries: countriesForFilter,
        medias,
        productTypes,
        metrics,
        perDef,
        groupBy: tableGroupBy
      });

      const titleSuffix = buildTitleSuffix({
        medias,
        productTypes,
        mediaNoSplit: state.mediaNoSplit,
        productNoSplit: state.productNoSplit
      });

      tableWrap.innerHTML = buildTableHtml({
        utils,
        months: monthsSel,
        metrics,
        perLabel,
        groups: tableGroups,
        showMediaCol: !state.mediaNoSplit,
        showProductCol: !state.productNoSplit,
        titleSuffix
      });

      updateInsights(monthsSel);
    }

    filtersEl.addEventListener('change', function (e) {
      const t = e.target;
      if (!t || t.tagName !== 'INPUT') return;

      const group = t.dataset.group;
      const value = t.value;
      const special = t.dataset.special || '';

      if (group === 'view') { state.view = value; updateAll(); return; }
      if (group === 'per') { state.perKey = value; updateAll(); return; }

      if (group === 'month') {
        const next = state.months.slice();
        const i = next.indexOf(value);
        if (i >= 0) next.splice(i, 1);
        else next.push(value);

        state.months = ensureNonEmpty(enforceMaxMonths(utils, next, 3, setNote), state.months);
        updateAll();
        return;
      }

      if (group === 'metric') {
        const next = state.metrics.slice();
        const i = next.indexOf(value);
        if (i >= 0) next.splice(i, 1);
        else next.push(value);
        state.metrics = ensureNonEmpty(next, state.metrics);
        updateAll();
        return;
      }

      if (group === 'country' || group === 'media' || group === 'product') {
        if (special === 'nosplit') {
          const checked = !!t.checked;
          if (group === 'country') state.countryNoSplit = checked;
          if (group === 'media') state.mediaNoSplit = checked;
          if (group === 'product') state.productNoSplit = checked;
          updateAll();
          return;
        }

        if (group === 'country') {
          if (state.countryNoSplit) { updateAll(); return; }
          const next = state.countries.slice();
          const i = next.indexOf(value);
          if (i >= 0) next.splice(i, 1);
          else next.push(value);
          state.countries = ensureNonEmpty(next, state.countries);
          updateAll();
          return;
        }

        if (group === 'media') {
          if (state.mediaNoSplit) { updateAll(); return; }
          const next = state.medias.slice();
          const i = next.indexOf(value);
          if (i >= 0) next.splice(i, 1);
          else next.push(value);
          state.medias = ensureNonEmpty(next, state.medias);
          updateAll();
          return;
        }

        if (group === 'product') {
          if (state.productNoSplit) { updateAll(); return; }
          const next = state.productTypes.slice();
          const i = next.indexOf(value);
          if (i >= 0) next.splice(i, 1);
          else next.push(value);
          state.productTypes = ensureNonEmpty(next, state.productTypes);
          updateAll();
          return;
        }
      }
    });

    updateAll();
  }

  if (window.OVP && typeof window.OVP.registerModule === 'function') {
    window.OVP.registerModule({
      id: MODULE_ID,
      title: 'D0 / D7 人均流水',
      subtitle: '买量口径：人均流水 = BET_FLOW / BET_PLACED_USER（支持媒体、产品类型拆分；柱状=月度，折线=日级）',
      render
    });
  }
})();
