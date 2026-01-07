// ===========================
// 模块 2：D0 / D7 付费率（自然量）
// 文件：organic-monthly/module-payrate.js
// ===========================
//
// 需求要点：
// - 顶部筛选器：月份（多选）、国家（多选）、月度柱状图/日级折线图（单选）、D0/D7（多选）
// - 柱状图：x 轴国家（固定顺序 GH/KE/NG/TZ/UG），每国展示 选中月份×(D0/D7) 多根柱；不堆叠；同月 D0/D7 同色，D7 加斜线阴影
// - 折线图：日级别；按国家分线（不加总）；同国跨多月连成一条；D0 虚线、D7 实线；同国 D0/D7 同色
// - 图下表格：行=国家；列=选中月份×(D0/D7) 的「X月自然量Dx 付费率」
// - 表格下方：引用 insights.js 的文案；显示月份跟随筛选（多月取最新月）

(function(){
  'use strict';

  // ---- Guard ----
  window.OVP = window.OVP || {};
  const MODULE_ID = 'payrate';

  const COUNTRIES_ORDER = ['GH','KE','NG','TZ','UG'];
  const METRIC_DEFS = {
    D0: { key:'D0', label:'D0', field:'D0_unique_purchase', lineStyle:'dashed' },
    D7: { key:'D7', label:'D7', field:'D7_unique_purchase', lineStyle:'solid' }
  };

  // 月份配色：同月 D0/D7 用同一底色；D7 叠加斜线 decal
  const MONTH_PALETTE = [
    '#2563eb', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444',
    '#0ea5e9', '#22c55e', '#f97316', '#6366f1', '#14b8a6',
    '#e11d48', '#64748b'
  ];

  // 折线图：同国家用同色（D0/D7 同色）
  const COUNTRY_COLOR = {
    GH: '#2563eb',
    KE: '#f59e0b',
    NG: '#10b981',
    TZ: '#8b5cf6',
    UG: '#ef4444'
  };

  const STYLE_ID = 'ovp-style-payrate';

  function injectStyles(){
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      /* payrate: filters */
      .ovp-pr-filters{
        display:flex;
        flex-wrap:wrap;
        gap:10px;
        align-items:flex-start;
        margin: 0 0 10px;
      }
      .ovp-pr-group{
        display:flex;
        flex-wrap:wrap;
        align-items:center;
        gap:8px;
        padding:8px 10px;
        border:1px solid rgba(148,163,184,.60);
        border-radius:12px;
        background: rgba(255,255,255,.72);
      }
      .ovp-pr-group-title{
        font-size:11px;
        color: var(--muted);
        margin-right:2px;
        white-space:nowrap;
      }
      .ovp-pr-option{
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
      .ovp-pr-option input{
        margin:0;
        accent-color: var(--ovp-blue, #2563eb);
      }
      .ovp-pr-option.is-radio input{
        accent-color: var(--ovp-blue, #2563eb);
      }
      .ovp-pr-option:hover{
        border-color: rgba(37,99,235,.55);
      }

      /* payrate: table */
      .ovp-pr-tablewrap{
        border:1px solid rgba(148,163,184,.60);
        border-radius:12px;
        background: rgba(255,255,255,.92);
        overflow:auto;
      }
      .ovp-pr-table{
        width:100%;
        border-collapse:separate;
        border-spacing:0;
        min-width: 720px;
        font-size:12px;
      }
      .ovp-pr-table thead th{
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
      .ovp-pr-table thead th:first-child{
        text-align:left;
        left:0;
        z-index:2;
      }
      .ovp-pr-table tbody td{
        padding:9px 10px;
        border-bottom:1px solid rgba(148,163,184,.22);
        text-align:right;
        white-space:nowrap;
      }
      .ovp-pr-table tbody tr:last-child td{
        border-bottom:none;
      }
      .ovp-pr-table tbody td:first-child{
        text-align:left;
        position:sticky;
        left:0;
        background: rgba(255,255,255,.98);
        z-index:1;
        color: var(--text);
        font-weight:600;
      }

      /* payrate: insight header */
      .ovp-pr-insight-head{
        display:flex;
        align-items:baseline;
        justify-content:space-between;
        gap:10px;
        margin-top: 4px;
      }
      .ovp-pr-insight-title{
        font-size:12px;
        font-weight:600;
        color: var(--text);
      }
      .ovp-pr-insight-meta{
        font-size:11px;
        color: var(--muted);
        white-space:nowrap;
      }
    `;
    document.head.appendChild(style);
  }

  function monthToShortLabel(ym){
    // "2025-09" -> "9月"
    if (!ym || typeof ym !== 'string' || ym.length < 7) return String(ym || '');
    const m = ym.slice(5,7);
    const n = Number(m);
    if (!Number.isFinite(n) || n <= 0) return ym;
    return `${n}月`;
  }
function monthToYMLabel(ym){
  // 用于筛选器显示：统一输出 YYYY-MM（如 2025-09）
  const s = String(ym == null ? '' : ym).trim();
  if (!s) return '';

  // 2025-09 / 2025-9 / 2025/09 / 2025/9
  const m1 = s.match(/^(\d{4})[-\/](\d{1,2})$/);
  if (m1){
    const y = m1[1];
    const mm = String(m1[2]).padStart(2, '0');
    return `${y}-${mm}`;
  }

  // 2025-09-xx / 2025/09/xx -> 2025-09
  const m2 = s.match(/^(\d{4})[-\/](\d{1,2})[-\/]/);
  if (m2){
    const y = m2[1];
    const mm = String(m2[2]).padStart(2, '0');
    return `${y}-${mm}`;
  }

  // 202509 -> 2025-09
  const m3 = s.match(/^(\d{4})(\d{2})$/);
  if (m3) return `${m3[1]}-${m3[2]}`;

  return s;
}

  function uniq(arr){
    const out = [];
    const seen = new Set();
    for (const v of (Array.isArray(arr) ? arr : [])){
      const k = String(v);
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(v);
    }
    return out;
  }

  function sortMonthsSafe(utils, ms){
    if (utils && typeof utils.sortMonths === 'function') return utils.sortMonths(ms);
    return (Array.isArray(ms) ? ms.slice() : []).sort((a,b)=>String(a).localeCompare(String(b)));
  }

  function safeNum(v){
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  function fmtPct(utils, v, digits=2){
    if (!utils || typeof utils.fmtPct !== 'function'){
      if (v === null || v === undefined || !Number.isFinite(v)) return '—';
      return `${(v*100).toFixed(digits)}%`;
    }
    return utils.fmtPct(v, digits);
  }

  function buildMonthlyAgg(rawByMonth, months){
    // output: { [month]: { [country]: { reg, d0, d7, d0rate, d7rate } } }
    const out = {};
    for (const month of months){
      const rows = Array.isArray(rawByMonth && rawByMonth[month]) ? rawByMonth[month] : [];
      const agg = {};
      for (const r of rows){
        const c = r && r.country;
        if (!c) continue;
        if (!agg[c]) agg[c] = { reg:0, d0:0, d7:0 };
        const a = agg[c];
        a.reg += safeNum(r.registration);
        a.d0  += safeNum(r.D0_unique_purchase);
        a.d7  += safeNum(r.D7_unique_purchase);
      }
      out[month] = {};
      for (const c of COUNTRIES_ORDER){
        const a = agg[c] || { reg:0, d0:0, d7:0 };
        out[month][c] = {
          reg: a.reg,
          d0: a.d0,
          d7: a.d7,
          d0rate: a.reg > 0 ? (a.d0 / a.reg) : null,
          d7rate: a.reg > 0 ? (a.d7 / a.reg) : null
        };
      }
    }
    return out;
  }

  function buildDailyIndex(rawByMonth, months, countries){
    // output: { dates: [YYYY-MM-DD...], rowByDateCountry: { [date]: { [country]: row } } }
    const rowByDateCountry = {};
    const dates = [];
    const dateSet = new Set();

    const countrySet = new Set(countries);

    for (const month of months){
      const rows = Array.isArray(rawByMonth && rawByMonth[month]) ? rawByMonth[month] : [];
      for (const r of rows){
        const c = r && r.country;
        const d = r && r.date;
        if (!c || !d) continue;
        if (!countrySet.has(c)) continue;

        if (!rowByDateCountry[d]) rowByDateCountry[d] = {};
        rowByDateCountry[d][c] = r;

        if (!dateSet.has(d)){
          dateSet.add(d);
          dates.push(d);
        }
      }
    }
    dates.sort((a,b)=>String(a).localeCompare(String(b)));
    return { dates, rowByDateCountry };
  }

  function getSelectedCountriesOrdered(selected){
    const set = new Set(selected);
    return COUNTRIES_ORDER.filter(c=>set.has(c));
  }

  function getDefaultSelectedMonths(allMonths, latestMonth){
    const ms = sortMonthsSafe(null, allMonths);
    if (!ms.length) return [];
    if (ms.length === 1) return [ms[0]];
    // 默认取最近 2 个月，便于对比
    const last2 = ms.slice(-2);
    // 有 latestMonth 且不在 last2 里时，兜底加上
    if (latestMonth && !last2.includes(latestMonth)){
      return sortMonthsSafe(null, uniq([...last2, latestMonth]));
    }
    return last2;
  }

  function ensureNonEmptyMulti(nextArr, fallbackArr){
    const a = Array.isArray(nextArr) ? nextArr : [];
    if (a.length) return a;
    return Array.isArray(fallbackArr) && fallbackArr.length ? fallbackArr.slice() : [];
  }

  function createDecal(){
    // 斜线阴影：白色半透明条纹
    return {
      symbol: 'rect',
      symbolSize: 2,
      dashArrayX: [1, 0],
      dashArrayY: [6, 6],
      rotation: Math.PI / 4,
      color: 'rgba(255,255,255,0.40)'
    };
  }

  function buildBarOption({ utils, countries, months, metrics, monthAgg, monthColorMap }){
    const categories = countries;
    const series = [];
    const legend = [];
    const seriesMetaByName = {};

    for (let i=0; i<months.length; i++){
      const m = months[i];
      const mLabel = monthToShortLabel(m);
      const color = monthColorMap[m] || MONTH_PALETTE[i % MONTH_PALETTE.length];

      if (metrics.includes('D0')){
        const name = `${mLabel} D0`;
        legend.push(name);
        seriesMetaByName[name] = { month: m, metric: 'D0' };
        series.push({
          name,
          type: 'bar',
          data: categories.map(c=>{
            const v = monthAgg && monthAgg[m] && monthAgg[m][c] ? monthAgg[m][c].d0rate : null;
            return (v===null || v===undefined) ? null : v;
          }),
          itemStyle: { color },
          emphasis: { focus: 'series' }
        });
      }

      if (metrics.includes('D7')){
        const name = `${mLabel} D7`;
        legend.push(name);
        seriesMetaByName[name] = { month: m, metric: 'D7' };
        series.push({
          name,
          type: 'bar',
          data: categories.map(c=>{
            const v = monthAgg && monthAgg[m] && monthAgg[m][c] ? monthAgg[m][c].d7rate : null;
            return (v===null || v===undefined) ? null : v;
          }),
          itemStyle: { color, decal: createDecal() },
          emphasis: { focus: 'series' }
        });
      }
    }

    const option = {
      animationDuration: 300,
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: function(params){
          if (!Array.isArray(params) || !params.length) return '';
          const country = params[0].axisValueLabel || params[0].axisValue || '';
          let html = `<div style="font-weight:600;margin-bottom:6px;">${country}</div>`;
          for (const p of params){
            const name = p.seriesName;
            const meta = seriesMetaByName[name] || {};
            const month = meta.month;
            const metric = meta.metric;
            const cell = (monthAgg && monthAgg[month] && monthAgg[month][country]) ? monthAgg[month][country] : null;

            const rate = (metric === 'D7') ? (cell ? cell.d7rate : null) : (cell ? cell.d0rate : null);
            const pay  = (metric === 'D7') ? (cell ? cell.d7 : null) : (cell ? cell.d0 : null);
            const reg  = cell ? cell.reg : null;

            const dot = `<span style="display:inline-block;width:8px;height:8px;border-radius:10px;background:${p.color};margin-right:6px;vertical-align:middle;"></span>`;
            const left = `<span style="color:#111827;">${name}</span>`;
            const right = `<span style="color:#111827;font-weight:600;">${fmtPct(utils, rate, 2)}</span>`;
            const sub = (reg && Number.isFinite(reg))
              ? `<span style="color:#6b7280;margin-left:8px;">(${Math.round(pay||0).toLocaleString('en-US')}/${Math.round(reg||0).toLocaleString('en-US')})</span>`
              : `<span style="color:#6b7280;margin-left:8px;">(—)</span>`;

            html += `<div style="margin:4px 0;">${dot}${left}：${right}${sub}</div>`;
          }
          return html;
        }
      },
      legend: {
        data: legend,
        top: 8,
        left: 8,
        textStyle: { color: '#6b7280', fontSize: 11 }
      },
      grid: { top: 48, left: 50, right: 18, bottom: 36, containLabel: true },
      xAxis: {
        type: 'category',
        data: categories,
        axisTick: { alignWithLabel: true },
        axisLabel: { color: '#6b7280' }
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: function(v){
          const m = (v && Number.isFinite(v.max)) ? v.max : 1;
          const out = m * 1.2;
          return out <= 0 ? 0.1 : out;
        },
        axisLabel: {
          color: '#6b7280',
          formatter: function(val){ return `${Math.round(val * 100)}%`; }
        },
        splitLine: { lineStyle: { color: 'rgba(148,163,184,0.25)' } }
      },
      series
    };

    return option;
  }

  function buildLineOption({ utils, countries, months, metrics, dailyIndex }){
    const dates = dailyIndex && Array.isArray(dailyIndex.dates) ? dailyIndex.dates : [];
    const rowByDateCountry = dailyIndex && dailyIndex.rowByDateCountry ? dailyIndex.rowByDateCountry : {};

    const series = [];
    const legendData = [];
    const seriesMetaById = {};

    for (const c of countries){
      legendData.push(c);
      const color = COUNTRY_COLOR[c] || '#2563eb';

      for (const metric of metrics){
        const def = METRIC_DEFS[metric];
        if (!def) continue;

        const id = `${c}_${metric}`;
        seriesMetaById[id] = { country: c, metric };

        series.push({
          id,
          name: c, // 同名：legend 里只显示一次，切换国家时一起隐藏 D0/D7
          type: 'line',
          data: dates.map(d=>{
            const r = rowByDateCountry[d] ? rowByDateCountry[d][c] : null;
            if (!r) return null;
            const reg = safeNum(r.registration);
            if (reg <= 0) return null;
            const pay = safeNum(r[def.field]);
            return pay / reg;
          }),
          showSymbol: false,
          connectNulls: false,
          smooth: false,
          lineStyle: { width: 2, type: def.lineStyle, color },
          itemStyle: { color },
          emphasis: { focus: 'series' }
        });
      }
    }

    const option = {
      animationDuration: 300,
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'line' },
        formatter: function(params){
          if (!Array.isArray(params) || !params.length) return '';
          const date = params[0].axisValueLabel || params[0].axisValue || '';
          let html = `<div style="font-weight:600;margin-bottom:6px;">${date}</div>`;

          // 同国家两条（D0/D7）一起展示；按国家排序
          const sorted = params.slice().sort((a,b)=>{
            const ca = (a.seriesId || '').split('_')[0];
            const cb = (b.seriesId || '').split('_')[0];
            return String(ca).localeCompare(String(cb));
          });

          for (const p of sorted){
            const id = p.seriesId || p.seriesId === 0 ? String(p.seriesId) : '';
            const meta = seriesMetaById[id] || {};
            const metric = meta.metric || '';
            const labelMetric = metric ? ` ${metric}` : '';
            const val = (p.data === null || p.data === undefined) ? null : Number(p.data);
            const dot = `<span style="display:inline-block;width:8px;height:8px;border-radius:10px;background:${p.color};margin-right:6px;vertical-align:middle;"></span>`;
            const left = `<span style="color:#111827;">${meta.country || p.seriesName}${labelMetric}</span>`;
            const right = `<span style="color:#111827;font-weight:600;">${fmtPct(utils, Number.isFinite(val) ? val : null, 2)}</span>`;
            html += `<div style="margin:4px 0;">${dot}${left}：${right}</div>`;
          }
          return html;
        }
      },
      legend: {
        data: legendData,
        top: 8,
        left: 8,
        textStyle: { color: '#6b7280', fontSize: 11 }
      },
      grid: { top: 52, left: 50, right: 18, bottom: 52, containLabel: true },
      xAxis: {
        type: 'category',
        data: dates,
        axisLabel: {
          color: '#6b7280',
          formatter: function(val){
            // "2025-10-07" -> "10-07"
            const s = String(val || '');
            return (s.length >= 10) ? s.slice(5,10) : s;
          }
        }
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: function(v){
          const m = (v && Number.isFinite(v.max)) ? v.max : 1;
          const out = m * 1.2;
          return out <= 0 ? 0.1 : out;
        },
        axisLabel: {
          color: '#6b7280',
          formatter: function(val){ return `${Math.round(val * 100)}%`; }
        },
        splitLine: { lineStyle: { color: 'rgba(148,163,184,0.25)' } }
      },
      dataZoom: [
        { type:'inside', throttle: 60 },
        { type:'slider', height: 20, bottom: 14 }
      ],
      series
    };

    return option;
  }

  function buildTableHTML({ utils, countries, months, metrics, monthAgg }){
    const cols = [];
    for (const m of months){
      const mLabel = monthToShortLabel(m);
      if (metrics.includes('D0')) cols.push({ month: m, metric:'D0', label: `${mLabel}自然量D0 付费率` });
      if (metrics.includes('D7')) cols.push({ month: m, metric:'D7', label: `${mLabel}自然量D7 付费率` });
    }

    const thead = `
      <thead>
        <tr>
          <th>国家</th>
          ${cols.map(c=>`<th>${c.label}</th>`).join('')}
        </tr>
      </thead>
    `;

    const tbodyRows = countries.map(country=>{
      const tds = cols.map(c=>{
        const cell = (monthAgg && monthAgg[c.month] && monthAgg[c.month][country]) ? monthAgg[c.month][country] : null;
        const v = c.metric === 'D7' ? (cell ? cell.d7rate : null) : (cell ? cell.d0rate : null);
        return `<td>${fmtPct(utils, v, 2)}</td>`;
      }).join('');
      return `<tr><td>${country}</td>${tds}</tr>`;
    }).join('');

    const tbody = `<tbody>${tbodyRows}</tbody>`;
    return `<table class="ovp-pr-table">${thead}${tbody}</table>`;
  }

  function renderModule({ mountEl, rawByMonth, months, latestMonth, utils }){
    injectStyles();

    // --- Basic guards ---
    const allMonths = sortMonthsSafe(utils, months || []);
    const hasData = rawByMonth && typeof rawByMonth === 'object' && allMonths.length;

    // Mount base UI (reuse global helpers)
    const ui = (OVP.ui && typeof OVP.ui.mountModule === 'function')
      ? OVP.ui.mountModule(mountEl, { moduleId: MODULE_ID, chartHeight: 380 })
      : null;

    if (!ui || !ui.chartEl || !ui.insightEl){
      mountEl.innerHTML = `
        <div class="ovp-alert">payrate 模块挂载失败：缺少 OVP.ui.mountModule。</div>
      `;
      return;
    }

    const chartEl = ui.chartEl;
    const chartNoteEl = ui.chartNoteEl;
    const insightEl = ui.insightEl;

    const stackEl = mountEl.querySelector('.ovp-module-stack');
    const chartBlockEl = chartEl.parentElement; // chart + note wrapper

    // Insert filters
    const filtersEl = document.createElement('div');
    filtersEl.className = 'ovp-pr-filters';

    const defaultMonths = getDefaultSelectedMonths(allMonths, latestMonth);
    const state = {
      months: defaultMonths.length ? defaultMonths.slice() : (latestMonth ? [latestMonth] : allMonths.slice(0,1)),
      countries: COUNTRIES_ORDER.slice(),
      view: 'bar', // 'bar' | 'line'
      metrics: ['D0','D7']
    };

    function buildFilterGroup(title, optionsHtml){
      const el = document.createElement('div');
      el.className = 'ovp-pr-group';
      el.innerHTML = `<div class="ovp-pr-group-title">${title}</div>${optionsHtml}`;
      return el;
    }

    function optionHTML({ group, type, name, value, label, checked }){
      const safeVal = String(value).replace(/[^a-zA-Z0-9_-]/g,'_');
      const id = `${MODULE_ID}-${group}-${safeVal}`;
      const cls = type === 'radio' ? 'ovp-pr-option is-radio' : 'ovp-pr-option';
      const inputName = `${MODULE_ID}-${name}`;
      const checkedAttr = checked ? 'checked' : '';
      return `
        <label class="${cls}" for="${id}">
          <input id="${id}" data-group="${group}" type="${type}" name="${inputName}" value="${String(value)}" ${checkedAttr}/>
          <span>${label}</span>
        </label>
      `;
    }

    function renderFilters(){
      // Months
      const monthOpts = allMonths.map(m=>optionHTML({
        group: 'month',
        type: 'checkbox',
        name: 'month',
        value: m,
        label: monthToYMLabel(m),
        checked: state.months.includes(m)
      })).join('');

      // Countries
      const countryOpts = COUNTRIES_ORDER.map(c=>optionHTML({
        group: 'country',
        type: 'checkbox',
        name: 'country',
        value: c,
        label: c,
        checked: state.countries.includes(c)
      })).join('');

      // View (single)
      const viewOpts = [
        optionHTML({ group:'view', type:'radio', name:'view', value:'bar', label:'月度柱状图', checked: state.view === 'bar' }),
        optionHTML({ group:'view', type:'radio', name:'view', value:'line', label:'日级折线图', checked: state.view === 'line' })
      ].join('');

      // Metrics
      const metricOpts = ['D0','D7'].map(k=>optionHTML({
        group:'metric',
        type:'checkbox',
        name:'metric',
        value:k,
        label:k,
        checked: state.metrics.includes(k)
      })).join('');

      filtersEl.innerHTML = '';
      filtersEl.appendChild(buildFilterGroup('月份', monthOpts));
      filtersEl.appendChild(buildFilterGroup('国家', countryOpts));
      filtersEl.appendChild(buildFilterGroup('图表', viewOpts));
      filtersEl.appendChild(buildFilterGroup('数据', metricOpts));
    }

    if (stackEl && chartBlockEl){
      stackEl.insertBefore(filtersEl, chartBlockEl);
    } else {
      mountEl.insertBefore(filtersEl, mountEl.firstChild);
    }

    // Insert table
    const tableWrap = document.createElement('div');
    tableWrap.className = 'ovp-pr-tablewrap';
    tableWrap.innerHTML = `<div class="ovp-alert">数据表加载中…</div>`;
    if (stackEl){
      stackEl.insertBefore(tableWrap, insightEl);
    }

    // Insight header (month indicator)
    const insightHead = document.createElement('div');
    insightHead.className = 'ovp-pr-insight-head';
    insightHead.innerHTML = `
      <div class="ovp-pr-insight-title">数据解读</div>
      <div class="ovp-pr-insight-meta" id="${MODULE_ID}-insight-meta">—</div>
    `;
    if (stackEl){
      stackEl.insertBefore(insightHead, insightEl);
    }
    const insightMetaEl = insightHead.querySelector(`#${MODULE_ID}-insight-meta`);

    // Prepare chart
    let chart = null;
    function ensureChart(){
      if (chart) return chart;
      if (!window.echarts || !chartEl) return null;

      chartEl.classList.remove('is-empty');
      chartEl.innerHTML = '';
      chart = window.echarts.init(chartEl);

      // Resize: observe element if available
      try{
        const ro = new ResizeObserver(()=>{ if(chart) chart.resize(); });
        ro.observe(chartEl);
      }catch(_){
        window.addEventListener('resize', ()=>{ if(chart) chart.resize(); });
      }
      return chart;
    }

    // Month color stable mapping (based on global months order)
    const monthColorMap = {};
    allMonths.forEach((m, idx)=>{ monthColorMap[m] = MONTH_PALETTE[idx % MONTH_PALETTE.length]; });

    // --- Sync + update ---
    function syncInputs(){
      for (const input of filtersEl.querySelectorAll('input[data-group]')){
        const g = input.getAttribute('data-group');
        const v = input.value;

        if (g === 'month') input.checked = state.months.includes(v);
        if (g === 'country') input.checked = state.countries.includes(v);
        if (g === 'metric') input.checked = state.metrics.includes(v);
        if (g === 'view') input.checked = (state.view === v);
      }
    }

    function chooseInsightMonth(selectedMonths){
      const ms = sortMonthsSafe(utils, selectedMonths);
      return ms.length ? ms[ms.length - 1] : (latestMonth || null);
    }

    function updateAll(){
      if (!hasData){
        if (chartNoteEl) chartNoteEl.textContent = '未检测到数据：请检查 data.js 是否暴露 RAW_ORGANIC_BY_MONTH。';
        if (tableWrap) tableWrap.innerHTML = `<div class="ovp-alert">未检测到数据</div>`;
        if (insightMetaEl) insightMetaEl.textContent = '—';
        if (insightEl){
          insightEl.textContent = '文案待填写：./insights.js';
          insightEl.classList.add('is-empty');
        }
        return;
      }

      const selMonths = sortMonthsSafe(utils, ensureNonEmptyMulti(state.months, defaultMonths.length ? defaultMonths : allMonths.slice(0,1)));
      const selCountries = getSelectedCountriesOrdered(ensureNonEmptyMulti(state.countries, COUNTRIES_ORDER.slice()));
      const selMetrics = ensureNonEmptyMulti(state.metrics, ['D0','D7']).filter(m=>m==='D0' || m==='D7');

      state.months = selMonths;
      state.countries = selCountries;
      state.metrics = selMetrics;

      syncInputs();

      const monthAgg = buildMonthlyAgg(rawByMonth, selMonths);

      // Table
      if (tableWrap){
        tableWrap.innerHTML = buildTableHTML({
          utils,
          countries: selCountries,
          months: selMonths,
          metrics: selMetrics,
          monthAgg
        });
      }

      // Chart note
      const metricLabel = selMetrics.join('/');
      const monthLabel = selMonths.map(monthToShortLabel).join('、');
      const countryLabel = selCountries.join('/');
      const note = state.view === 'bar'
        ? `口径：${metricLabel} 付费率 = unique_purchase / registration（按月合计后计算）。当前：${monthLabel}｜${countryLabel}`
        : `口径：${metricLabel} 付费率 = unique_purchase / registration（按日计算，不做国家加总）。当前：${monthLabel}｜${countryLabel}`;
      if (chartNoteEl) chartNoteEl.textContent = note;

      // Chart
      const c = ensureChart();
      if (!c){
        if (chartEl){
          chartEl.classList.remove('is-empty');
          chartEl.innerHTML = `<div class="ovp-alert" style="margin:12px;">图表库未就绪：请检查 echarts 是否加载成功。</div>`;
        }
      } else {
        const option = state.view === 'bar'
          ? buildBarOption({
              utils,
              countries: selCountries,
              months: selMonths,
              metrics: selMetrics,
              monthAgg,
              monthColorMap
            })
          : buildLineOption({
              utils,
              countries: selCountries,
              months: selMonths,
              metrics: selMetrics,
              dailyIndex: buildDailyIndex(rawByMonth, selMonths, selCountries)
            });

        c.setOption(option, true);
      }

            // Insight：展示每一个所选月份的文案（多月拼接）
      if (insightMetaEl){
        insightMetaEl.textContent = selMonths.length
          ? `月份：${selMonths.map(monthToShortLabel).join('、')}`
          : '月份：—';
      }

      if (insightEl){
        const getter = (OVP.getInsight && typeof OVP.getInsight === 'function') ? OVP.getInsight : null;

        if (!getter || !selMonths.length){
          insightEl.textContent = '文案待填写：./insights.js';
          insightEl.classList.add('is-empty');
        } else {
          // selMonths 在上面已通过 sortMonthsSafe 排序过，这里直接用
          const items = selMonths.map(m=>{
            const raw = getter(MODULE_ID, m) || '';
            const text = String(raw || '').trim();
            return { month: m, text };
          });

          const hasAny = items.some(x => x.text);
          const blocks = items.map(({ month, text })=>{
            const title = `${monthToShortLabel(month)}（${month}）`;
            return text ? `${title}\n${text}` : `${title}\n（该月暂无文案）`;
          });

          insightEl.textContent = blocks.join('\n\n--------------------------------\n\n');
          insightEl.classList.toggle('is-empty', !hasAny);
        }
      }

    }

    // --- Event handling ---
    filtersEl.addEventListener('change', function(e){
      const t = e.target;
      if (!t || t.tagName !== 'INPUT') return;

      const group = t.getAttribute('data-group');
      const value = t.value;

      if (group === 'view'){
        state.view = value === 'line' ? 'line' : 'bar';
        updateAll();
        return;
      }

      if (group === 'month'){
        const next = state.months.slice();
        const idx = next.indexOf(value);
        if (idx >= 0) next.splice(idx,1);
        else next.push(value);

        // 不允许清空
        state.months = ensureNonEmptyMulti(sortMonthsSafe(utils, next), state.months);
        updateAll();
        return;
      }

      if (group === 'country'){
        const next = state.countries.slice();
        const idx = next.indexOf(value);
        if (idx >= 0) next.splice(idx,1);
        else next.push(value);

        state.countries = ensureNonEmptyMulti(next, state.countries);
        updateAll();
        return;
      }

      if (group === 'metric'){
        const next = state.metrics.slice();
        const idx = next.indexOf(value);
        if (idx >= 0) next.splice(idx,1);
        else next.push(value);

        state.metrics = ensureNonEmptyMulti(next, state.metrics);
        updateAll();
        return;
      }
    });

    renderFilters();
    updateAll();
  }

  // Register module
  if (typeof OVP.registerModule === 'function'){
    OVP.registerModule({
      id: MODULE_ID,
      title: 'D0 / D7 付费率',
      subtitle: '自然量口径：付费率 = unique_purchase / registration（支持月度对比 + 日级折线）',
      render: renderModule
    });
  }
})();
