/* module-ggrroi-purchase-roi-growth.js
 *
 * 模块 1：GGR ROI 和 充值 ROI 增长分析
 * - 口径（来自公式文档）：
 *   - GGR ROI（D0/D3/D7/D14/D30/D45/D60）：Dx_TOTAL_GGR_VALUE / spent
 *   - 充值 ROI（D0/D3/D7/D14/D30/D45/D60）：Dx_PURCHASE_VALUE / spent
 *
 * 依赖：
 * - window.OVP.registerModule (index.html 里注册模块机制)
 * - window.echarts (ECharts 5.x)
 * - 数据：RAW_GGR_BY_MONTH（按 YYYY-MM 分组的 rows[]）
 *
 * 数据 row 必备字段（本模块只用这些字段）：
 *   date, country, media, Product_type, spent,
 *   D0_PURCHASE_VALUE, D3_PURCHASE_VALUE, D7_PURCHASE_VALUE, D14_PURCHASE_VALUE, D30_PURCHASE_VALUE, D45_PURCHASE_VALUE, D60_PURCHASE_VALUE,
 *   D0_TOTAL_GGR_VALUE, D3_TOTAL_GGR_VALUE, D7_TOTAL_GGR_VALUE, D14_TOTAL_GGR_VALUE, D30_TOTAL_GGR_VALUE, D45_TOTAL_GGR_VALUE, D60_TOTAL_GGR_VALUE
 *
 * 新增月份怎么加（在 ggr-module-data.js）：
 *   RAW_GGR_BY_MONTH["2025-10"] = [ {date:"2025-10-01",...}, ... ];
 *   key 用 YYYY-MM；value 是行数组；字段名保持一致即可。
 */

(function(){
  if (!window.OVP || typeof window.OVP.registerModule !== 'function') return;

  const MODULE_ID = 'm1-ggrroi-purchase-roi-growth';

  const WINDOWS = ['D0','D3','D7','D14','D30','D45','D60'];

  const METRICS = [
    { value: 'ggr', label: 'GGR ROI', fields: {
      D0:'D0_TOTAL_GGR_VALUE', D3:'D3_TOTAL_GGR_VALUE', D7:'D7_TOTAL_GGR_VALUE',
      D14:'D14_TOTAL_GGR_VALUE', D30:'D30_TOTAL_GGR_VALUE', D45:'D45_TOTAL_GGR_VALUE', D60:'D60_TOTAL_GGR_VALUE'
    }},
    { value: 'purchase', label: '充值 ROI', fields: {
      D0:'D0_PURCHASE_VALUE', D3:'D3_PURCHASE_VALUE', D7:'D7_PURCHASE_VALUE',
      D14:'D14_PURCHASE_VALUE', D30:'D30_PURCHASE_VALUE', D45:'D45_PURCHASE_VALUE', D60:'D60_PURCHASE_VALUE'
    }},
  ];

  const SPECIAL_AGG_VALUE = '__ALL_AGG__'; // “全选但不区分”的内部 value

  // ---------- Style (inject once) ----------
  const STYLE_ID = 'ovp-m1-filter-style';
  function injectStyleOnce(){
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      /* 模块1：筛选器（尽量贴近 organic-monthly 的卡片/控件语言） */
      .ovp-m1-stack{ display:flex; flex-direction:column; gap:12px; }
      .ovp-m1-filterbar{
        display:flex; flex-wrap:wrap; align-items:center; gap:10px;
        padding:10px 12px;
        border:1px solid rgba(148,163,184,0.60);
        border-radius:12px;
        background: rgba(255,255,255,0.85);
      }
      .ovp-m1-filterbar .ovp-m1-filter-icon{
        width:16px; height:16px; flex:0 0 auto;
        opacity:.75;
      }
      .ovp-m1-filterbar .ovp-m1-filter-title{
        font-size:11px; color:var(--muted);
        margin-right:2px;
        display:flex; align-items:center; gap:6px;
      }

      /* 多选下拉：用 details/summary，少依赖 */
      details.ovp-ms{ position:relative; }
      details.ovp-ms > summary{
        list-style:none;
        cursor:pointer;
        user-select:none;
        display:flex; align-items:center; gap:6px;
        padding:6px 10px;
        border:1px solid rgba(148,163,184,0.60);
        border-radius:10px;
        background:#fff;
        color:var(--text);
        font-size:12px;
        min-height:30px;
      }
      details.ovp-ms > summary::-webkit-details-marker{ display:none; }
      .ovp-ms-label{ font-size:11px; color:var(--muted); }
      .ovp-ms-value{ font-size:12px; color:var(--text); white-space:nowrap; }
      .ovp-ms-caret{ margin-left:2px; opacity:.65; }

      details.ovp-ms[open] > summary{
        box-shadow: 0 10px 24px rgba(15,23,42,0.10);
      }

      .ovp-ms-menu{
        position:absolute;
        top:calc(100% + 8px);
        left:0;
        z-index:50;
        min-width: 240px;
        max-width: 340px;
        max-height: 320px;
        overflow:auto;
        padding:10px 10px 8px;
        border:1px solid rgba(148,163,184,0.60);
        border-radius:12px;
        background:#fff;
        box-shadow: 0 18px 40px rgba(15,23,42,0.12);
      }

      .ovp-ms-group-title{
        font-size:11px;
        color:var(--muted);
        margin: 0 0 8px;
      }

      .ovp-ms-item{
        display:flex; align-items:center; gap:8px;
        padding:6px 6px;
        border-radius:10px;
        font-size:12px;
        color:var(--text);
      }
      .ovp-ms-item:hover{ background: rgba(15,23,42,0.04); }
      .ovp-ms-item input{ transform: translateY(1px); }

      .ovp-ms-special{
        border:1px solid rgba(148,163,184,0.40);
        background: rgba(249,250,251,0.80);
      }
      .ovp-ms-divider{
        height:1px;
        background: rgba(148,163,184,0.35);
        margin: 8px 0;
      }

      .ovp-m1-hint{
        font-size:11px;
        color: var(--muted);
        line-height:1.5;
        padding: 0 2px;
      }
      .ovp-m1-hint .ovp-m1-warn{ color:#b45309; } /* amber-ish */

      /* Table */
      .ovp-m1-table-wrap{
        border:1px solid rgba(148,163,184,0.60);
        border-radius:12px;
        background:#fff;
        overflow:hidden;
      }
      .ovp-m1-table-scroll{
        overflow:auto;
        max-height: 360px;
      }
      table.ovp-m1-table{
        width:100%;
        border-collapse:separate;
        border-spacing:0;
        font-size:12px;
      }
      .ovp-m1-table thead th{
        position:sticky;
        top:0;
        background: rgba(249,250,251,0.96);
        color: var(--muted);
        text-align:left;
        padding:10px 10px;
        border-bottom:1px solid rgba(148,163,184,0.45);
        white-space:nowrap;
        z-index:1;
      }
      .ovp-m1-table tbody td{
        padding:9px 10px;
        border-bottom:1px solid rgba(148,163,184,0.25);
        white-space:nowrap;
        color: var(--text);
      }
      .ovp-m1-table tbody tr:hover td{
        background: rgba(15,23,42,0.03);
      }
      .ovp-m1-num{ text-align:right; font-variant-numeric: tabular-nums; }
      .ovp-m1-dim{ color: var(--text); }
      .ovp-m1-empty{
        padding: 12px;
        color: var(--muted);
        font-size:11px;
        line-height:1.5;
      }
    `;
    document.head.appendChild(style);
  }

  // ---------- Utils ----------
  function safeStr(v){
    if (v === null || v === undefined) return '';
    return String(v);
  }
  function safeNum(v){
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  function uniqSorted(arr){
    const s = new Set();
    for (const x of arr) {
      const v = safeStr(x).trim();
      if (v) s.add(v);
    }
    return Array.from(s).sort((a,b)=>a.localeCompare(b));
  }
  function collectUnique(rawByMonth, monthsSel, field){
    const out = [];
    const monthsList = Array.isArray(monthsSel) && monthsSel.length ? monthsSel : Object.keys(rawByMonth || {});
    for (const m of monthsList){
      const rows = Array.isArray(rawByMonth && rawByMonth[m]) ? rawByMonth[m] : [];
      for (const r of rows){
        out.push(r && r[field]);
      }
    }
    return uniqSorted(out);
  }
  function intersectSet(setA, values){
    const keep = new Set(values);
    const out = new Set();
    for (const v of (setA || [])){
      if (keep.has(v)) out.add(v);
    }
    return out;
  }
  function fmtPct(v, digits=2){
    if (v === null || v === undefined || !Number.isFinite(v)) return '—';
    return (v * 100).toFixed(digits) + '%';
  }
  function fmtNum(v, digits=2){
    if (v === null || v === undefined || !Number.isFinite(v)) return '—';
    return v.toLocaleString('en-US', { maximumFractionDigits: digits, minimumFractionDigits: digits });
  }
  function parseMonthKey(m){ return safeStr(m); }
  function sortMonths(ms){ return (ms||[]).slice().sort((a,b)=>String(a).localeCompare(String(b))); }

  function closeDetailsOnOutsideClick(root){
    // 点击外面时收起所有 open 的 details（更像下拉）
    function handler(e){
      const openOnes = root.querySelectorAll('details.ovp-ms[open]');
      for (const d of openOnes){
        if (!d.contains(e.target)) d.removeAttribute('open');
      }
    }
    document.addEventListener('click', handler);
    return ()=>document.removeEventListener('click', handler);
  }

  // ---------- MultiSelect builder ----------
  function buildMultiSelect({
    id,
    label,
    options,
    allowSpecialAgg,
    specialAggChecked,
    maxSelect, // optional
    initialSelectedValues,
    onChange
  }){
    const details = document.createElement('details');
    details.className = 'ovp-ms';
    details.dataset.msId = id;

    const summary = document.createElement('summary');
    const summaryLabel = document.createElement('span');
    summaryLabel.className = 'ovp-ms-label';
    summaryLabel.textContent = label;

    const summaryValue = document.createElement('span');
    summaryValue.className = 'ovp-ms-value';
    summaryValue.textContent = '—';

    const caret = document.createElement('span');
    caret.className = 'ovp-ms-caret';
    caret.textContent = '▾';

    summary.appendChild(summaryLabel);
    summary.appendChild(summaryValue);
    summary.appendChild(caret);

    const menu = document.createElement('div');
    menu.className = 'ovp-ms-menu';

    const title = document.createElement('div');
    title.className = 'ovp-ms-group-title';
    title.textContent = label + '（多选）';
    menu.appendChild(title);

    // state
    const selected = new Set(Array.isArray(initialSelectedValues) ? initialSelectedValues : []);
    let specialAgg = !!allowSpecialAgg && !!specialAggChecked;

    const itemsWrap = document.createElement('div');
    menu.appendChild(itemsWrap);

    let specialInput = null;
    let optionInputs = new Map(); // value -> input

    function rebuildOptions(newOptions){
      optionInputs.clear();
      itemsWrap.innerHTML = '';

      // 1) special
      if (allowSpecialAgg){
        const row = document.createElement('label');
        row.className = 'ovp-ms-item ovp-ms-special';
        specialInput = document.createElement('input');
        specialInput.type = 'checkbox';
        specialInput.value = SPECIAL_AGG_VALUE;
        specialInput.checked = specialAgg;

        const span = document.createElement('span');
        span.textContent = '全选但不区分';

        row.appendChild(specialInput);
        row.appendChild(span);
        itemsWrap.appendChild(row);

        const divider = document.createElement('div');
        divider.className = 'ovp-ms-divider';
        itemsWrap.appendChild(divider);

        specialInput.addEventListener('change', ()=>{
          specialAgg = !!specialInput.checked;
          // specialAgg=true：禁用其他
          for (const inp of optionInputs.values()){
            inp.disabled = specialAgg;
          }
          if (typeof onChange === 'function') onChange(getSnapshot(), { reason:'specialToggle' });
          updateSummary();
        });
      }

      // 2) options
      const list = Array.isArray(newOptions) ? newOptions : [];
      for (const opt of list){
        const v = safeStr(opt && opt.value !== undefined ? opt.value : opt);
        const t = safeStr(opt && opt.label !== undefined ? opt.label : opt);
        if (!v) continue;

        const row = document.createElement('label');
        row.className = 'ovp-ms-item';

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.value = v;
        input.checked = selected.has(v);
        input.disabled = !!specialAgg;

        const span = document.createElement('span');
        span.textContent = t;

        row.appendChild(input);
        row.appendChild(span);
        itemsWrap.appendChild(row);

        optionInputs.set(v, input);

        input.addEventListener('change', ()=>{
          const checked = !!input.checked;
          if (checked){
            // maxSelect
            if (maxSelect && selected.size >= maxSelect){
              input.checked = false;
              if (typeof onChange === 'function') onChange(getSnapshot(), { reason:'maxSelect', maxSelect });
              updateSummary();
              return;
            }
            selected.add(v);
          } else {
            selected.delete(v);
          }
          if (typeof onChange === 'function') onChange(getSnapshot(), { reason:'valueToggle', value:v });
          updateSummary();
        });
      }

      // 清理 selected 中已不存在的 value
      const keep = new Set(optionInputs.keys());
      for (const v of Array.from(selected)){
        if (!keep.has(v)) selected.delete(v);
      }

      updateSummary();
    }

    function getSnapshot(){
      return {
        id,
        label,
        specialAgg: !!specialAgg,
        selected: new Set(selected) // copy
      };
    }

    function setSelectedValues(values){
      selected.clear();
      for (const v of (values || [])){
        const s = safeStr(v);
        if (!s) continue;
        selected.add(s);
      }
      for (const [v, inp] of optionInputs.entries()){
        inp.checked = selected.has(v);
      }
      updateSummary();
    }

    function setSpecialAgg(flag){
      if (!allowSpecialAgg) return;
      specialAgg = !!flag;
      if (specialInput) specialInput.checked = specialAgg;
      for (const inp of optionInputs.values()){
        inp.disabled = specialAgg;
      }
      updateSummary();
    }

    function updateSummary(){
      if (allowSpecialAgg && specialAgg){
        summaryValue.textContent = '全选但不区分';
        return;
      }
      const count = selected.size;
      if (count === 0){
        summaryValue.textContent = '未选';
        return;
      }
      if (count <= 2){
        summaryValue.textContent = Array.from(selected).join(', ');
        return;
      }
      summaryValue.textContent = `${count} 项`;
    }

    rebuildOptions(options);

    details.appendChild(summary);
    details.appendChild(menu);

    return {
      el: details,
      rebuildOptions,
      setSelectedValues,
      setSpecialAgg,
      getSnapshot,
      updateSummary
    };
  }

  // ---------- Data compute ----------
  function buildLineLabel({ month, metricLabel, country, media, productType, split }){
    const parts = [];
    if (month) parts.push(month);
    if (metricLabel) parts.push(metricLabel);
    if (split.country && country) parts.push(country);
    if (split.media && media) parts.push(media);
    if (split.productType && productType) parts.push(productType);
    return parts.join(' · ');
  }

  function filterRows(rows, { country, media, productType, split }){
    if (!Array.isArray(rows) || rows.length === 0) return [];
    const out = [];
    for (const r of rows){
      if (!r) continue;
      if (split.country && country && safeStr(r.country) !== country) continue;
      if (split.media && media && safeStr(r.media) !== media) continue;
      if (split.productType && productType && safeStr(r.Product_type) !== productType) continue;
      out.push(r);
    }
    return out;
  }

  function aggregateRoiCurve(rows, metric){
    // returns {spent, roiByWin:{D0:..., ...}}
    const spent = rows.reduce((s,r)=>s + safeNum(r && r.spent), 0);
    const roiByWin = {};
    for (const w of WINDOWS){
      const f = metric.fields[w];
      const num = rows.reduce((s,r)=>s + safeNum(r && r[f]), 0);
      roiByWin[w] = spent > 0 ? (num / spent) : null;
    }
    return { spent, roiByWin };
  }

  function computeSeries(rawByMonth, state){
    const errs = [];
    const monthsSel = sortMonths(Array.from(state.months || []));
    const metricsSel = Array.from(state.metrics || []);

    if (!monthsSel.length) errs.push('月份未选（最多 6 个）');
    if (!metricsSel.length) errs.push('ROI 类型未选');

    // split flags
    const split = {
      country: !state.country.specialAgg,
      media: !state.media.specialAgg,
      productType: !state.productType.specialAgg
    };

    // validate selections when split=true
    if (split.country && state.country.selected.size === 0) errs.push('国家未选（或勾选“全选但不区分”）');
    if (split.media && state.media.selected.size === 0) errs.push('媒体未选（或勾选“全选但不区分”）');
    if (split.productType && state.productType.selected.size === 0) errs.push('产品类型未选（或勾选“全选但不区分”）');

    if (errs.length) return { errors: errs, lines: [] };

    const countries = split.country ? Array.from(state.country.selected) : [null];
    const medias = split.media ? Array.from(state.media.selected) : [null];
    const products = split.productType ? Array.from(state.productType.selected) : [null];

    const metricObjs = metricsSel.map(v=>METRICS.find(m=>m.value===v)).filter(Boolean);

    const lines = [];

    for (const month of monthsSel){
      const monthRows = Array.isArray(rawByMonth && rawByMonth[month]) ? rawByMonth[month] : [];

      for (const metric of metricObjs){
        for (const c of countries){
          for (const m of medias){
            for (const p of products){
              const rows = filterRows(monthRows, { country:c, media:m, productType:p, split });
              // 即使 rows 为空，也让它出一条线（值全 null），避免用户以为筛选器没生效
              const agg = aggregateRoiCurve(rows, metric);
              const label = buildLineLabel({
                month,
                metricLabel: metric.label,
                country: c,
                media: m,
                productType: p,
                split
              });
              lines.push({
                key: [month, metric.value, split.country ? c : 'ALL', split.media ? m : 'ALL', split.productType ? p : 'ALL'].join('|'),
                name: label,
                month,
                metric: metric.value,
                metricLabel: metric.label,
                country: split.country ? c : null,
                media: split.media ? m : null,
                productType: split.productType ? p : null,
                spent: agg.spent,
                roiByWin: agg.roiByWin
              });
            }
          }
        }
      }
    }

    return { errors: [], split, monthsSel, lines };
  }

  // ---------- Render chart & table ----------
  function renderChart(chart, lines){
    if (!chart) return;
    const series = lines.map(line=>{
      return {
        name: line.name,
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: WINDOWS.map(w => (line.roiByWin ? line.roiByWin[w] : null))
      };
    });

    const option = {
      tooltip: {
        trigger: 'axis',
        valueFormatter: (v)=>{
          const n = Number(v);
          if (!Number.isFinite(n)) return '—';
          return fmtPct(n, 2);
        }
      },
      legend: {
        type: 'scroll',
        top: 24,
        left: 10,
        right: 10
      },
      grid: { left: 54, right: 22, top: 70, bottom: 44 },
      xAxis: { type: 'category', data: WINDOWS },
      yAxis: {
        type: 'value',
        axisLabel: { formatter: (v)=> (Number(v)*100).toFixed(0) + '%' }
      },
      series
    };

    chart.setOption(option, true);
  }

  function buildTableHtml({ lines, split }){
    if (!lines.length){
      return `<div class="ovp-m1-empty">无可展示数据：检查筛选条件。</div>`;
    }

    const cols = [];
    cols.push({ key:'month', label:'月份' });
    cols.push({ key:'metricLabel', label:'ROI 类型' });
    if (split.country) cols.push({ key:'country', label:'国家' });
    if (split.media) cols.push({ key:'media', label:'媒体' });
    if (split.productType) cols.push({ key:'productType', label:'产品类型' });
    cols.push({ key:'spent', label:'Spend' });
    for (const w of WINDOWS){
      cols.push({ key:w, label:w });
    }

    const thead = `
      <thead>
        <tr>
          ${cols.map(c=>`<th>${c.label}</th>`).join('')}
        </tr>
      </thead>
    `;

    const tbodyRows = lines.map(line=>{
      const cells = [];
      cells.push(`<td class="ovp-m1-dim">${line.month || ''}</td>`);
      cells.push(`<td class="ovp-m1-dim">${line.metricLabel || ''}</td>`);
      if (split.country) cells.push(`<td class="ovp-m1-dim">${line.country || ''}</td>`);
      if (split.media) cells.push(`<td class="ovp-m1-dim">${line.media || ''}</td>`);
      if (split.productType) cells.push(`<td class="ovp-m1-dim">${line.productType || ''}</td>`);
      cells.push(`<td class="ovp-m1-num">${fmtNum(line.spent || 0, 2)}</td>`);
      for (const w of WINDOWS){
        const v = line.roiByWin ? line.roiByWin[w] : null;
        cells.push(`<td class="ovp-m1-num">${fmtPct(v, 2)}</td>`);
      }
      return `<tr>${cells.join('')}</tr>`;
    }).join('');

    const tbody = `<tbody>${tbodyRows}</tbody>`;

    return `
      <div class="ovp-m1-table-scroll">
        <table class="ovp-m1-table">
          ${thead}
          ${tbody}
        </table>
      </div>
    `;
  }

  // ---------- Module ----------
  OVP.registerModule({
    id: MODULE_ID,
    title: '模块 1｜GGR ROI 与充值 ROI 增长分析',
    subtitle: '筛选：月份（最多 6）、国家/媒体/产品类型（支持“全选但不区分”）、ROI 类型（GGR/充值）；图表横轴 D0~D60，纵轴 ROI%。',
    render({ mountEl, rawByMonth, months }){
      injectStyleOnce();

      const data = rawByMonth || window.RAW_GGR_BY_MONTH || {};
      const monthsAll = sortMonths((Array.isArray(months) && months.length) ? months : Object.keys(data || {}));
      const hasEcharts = !!window.echarts;

      // Layout
      mountEl.innerHTML = `
        <div class="ovp-m1-stack">
          <div class="ovp-m1-filterbar" id="m1-filterbar-${MODULE_ID}">
            <div class="ovp-m1-filter-title">
              <svg class="ovp-m1-filter-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 5h18l-7 8v5l-4 2v-7L3 5z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
              </svg>
              筛选器
            </div>
          </div>

          <div class="ovp-m1-hint" id="m1-hint-${MODULE_ID}"></div>

          <div>
            <div class="ovp-chart" id="m1-chart-${MODULE_ID}" style="height:460px;"></div>
            <div class="ovp-chart-note" id="m1-note-${MODULE_ID}">
              口径：ROI=目标值/spent；目标值为 Dx_TOTAL_GGR_VALUE 或 Dx_PURCHASE_VALUE。
            </div>
          </div>

          <div class="ovp-m1-table-wrap" id="m1-tablewrap-${MODULE_ID}">
            <div class="ovp-m1-empty">数据表加载中…</div>
          </div>
        </div>
      `;

      const filterbar = mountEl.querySelector(`#m1-filterbar-${MODULE_ID}`);
      const hintEl = mountEl.querySelector(`#m1-hint-${MODULE_ID}`);
      const chartDom = mountEl.querySelector(`#m1-chart-${MODULE_ID}`);
      const noteEl = mountEl.querySelector(`#m1-note-${MODULE_ID}`);
      const tableWrap = mountEl.querySelector(`#m1-tablewrap-${MODULE_ID}`);

      // Chart init
      let chart = null;
      if (hasEcharts && chartDom){
        chart = echarts.getInstanceByDom(chartDom) || echarts.init(chartDom);
        window.addEventListener('resize', ()=>{ try{ chart.resize(); }catch(_e){} });
      } else if (chartDom){
        chartDom.innerHTML = `<div class="ovp-m1-empty">未加载 ECharts：请检查 index.html 是否先引入 echarts。</div>`;
      }

      // Initial state
      const defaultMonths = monthsAll.slice(Math.max(0, monthsAll.length - 3)); // 最近 3 个月（不超过 6）
      const state = {
        months: new Set(defaultMonths),
        metrics: new Set(METRICS.map(m=>m.value)), // 默认全选：GGR ROI + 充值 ROI
        country: { specialAgg: true, selected: new Set() },       // 默认：全选但不区分
        media: { specialAgg: true, selected: new Set() },         // 默认：全选但不区分
        productType: { specialAgg: true, selected: new Set() }    // 默认：全选但不区分
      };

      // Build filters (options will be (re)computed)
      const msMonths = buildMultiSelect({
        id: 'months',
        label: '月份',
        options: monthsAll.map(m=>({ value:m, label:m })),
        allowSpecialAgg: false,
        specialAggChecked: false,
        maxSelect: 6,
        initialSelectedValues: Array.from(state.months),
        onChange: (snap, meta)=>{
          // sync state
          state.months = snap.selected;
          if (meta && meta.reason === 'maxSelect'){
            hintEl.innerHTML = `<span class="ovp-m1-warn">月份最多选 ${meta.maxSelect} 个。</span>`;
          } else {
            hintEl.textContent = '';
          }
          // 月份变化后，更新其他维度 options（仅按月份收敛）
          updateDimOptions();
          renderAll();
        }
      });

      const msMetric = buildMultiSelect({
        id: 'metric',
        label: 'ROI',
        options: METRICS.map(m=>({ value:m.value, label:m.label })),
        allowSpecialAgg: false,
        specialAggChecked: false,
        initialSelectedValues: Array.from(state.metrics),
        onChange: (snap)=>{
          state.metrics = snap.selected;
          hintEl.textContent = '';
          renderAll();
        }
      });

      // country / media / productType options will be set by updateDimOptions()
      const msCountry = buildMultiSelect({
        id: 'country',
        label: '国家',
        options: [],
        allowSpecialAgg: true,
        specialAggChecked: true,
        initialSelectedValues: [],
        onChange: (snap)=>{
          state.country.specialAgg = snap.specialAgg;
          state.country.selected = snap.selected;
          hintEl.textContent = '';
          renderAll();
        }
      });

      const msMedia = buildMultiSelect({
        id: 'media',
        label: '媒体',
        options: [],
        allowSpecialAgg: true,
        specialAggChecked: true,
        initialSelectedValues: [],
        onChange: (snap)=>{
          state.media.specialAgg = snap.specialAgg;
          state.media.selected = snap.selected;
          hintEl.textContent = '';
          renderAll();
        }
      });

      const msProduct = buildMultiSelect({
        id: 'productType',
        label: '产品',
        options: [],
        allowSpecialAgg: true,
        specialAggChecked: true,
        initialSelectedValues: [],
        onChange: (snap)=>{
          state.productType.specialAgg = snap.specialAgg;
          state.productType.selected = snap.selected;
          hintEl.textContent = '';
          renderAll();
        }
      });

      filterbar.appendChild(msMonths.el);
      filterbar.appendChild(msCountry.el);
      filterbar.appendChild(msMedia.el);
      filterbar.appendChild(msProduct.el);
      filterbar.appendChild(msMetric.el);

      // Close dropdowns when clicking outside the module
      closeDetailsOnOutsideClick(mountEl);

      function updateDimOptions(){
        const monthsSel = sortMonths(Array.from(state.months));
        const baseMonths = monthsSel.length ? monthsSel : monthsAll;

        const countries = collectUnique(data, baseMonths, 'country');
        const medias = collectUnique(data, baseMonths, 'media');
        const products = collectUnique(data, baseMonths, 'Product_type');

        // Rebuild menus
        msCountry.rebuildOptions(countries.map(v=>({ value:v, label:v })));
        msMedia.rebuildOptions(medias.map(v=>({ value:v, label:v })));
        msProduct.rebuildOptions(products.map(v=>({ value:v, label:v })));

        // Re-sync state with rebuilt (keep intersection)
        const cSnap = msCountry.getSnapshot();
        const mSnap = msMedia.getSnapshot();
        const pSnap = msProduct.getSnapshot();

        state.country.specialAgg = cSnap.specialAgg;
        state.media.specialAgg = mSnap.specialAgg;
        state.productType.specialAgg = pSnap.specialAgg;

        state.country.selected = cSnap.selected;
        state.media.selected = mSnap.selected;
        state.productType.selected = pSnap.selected;
      }

      function renderAll(){
        const res = computeSeries(data, state);

        // note
        const monthsSel = sortMonths(Array.from(state.months));
        const dimsAgg = [
          state.country.specialAgg ? '国家=全选不区分' : `国家=${state.country.selected.size}项`,
          state.media.specialAgg ? '媒体=全选不区分' : `媒体=${state.media.selected.size}项`,
          state.productType.specialAgg ? '产品=全选不区分' : `产品=${state.productType.selected.size}项`,
          `ROI类型=${state.metrics.size}项`,
        ].join(' · ');

        const lineCount = (res && res.lines) ? res.lines.length : 0;
        noteEl.textContent = `口径：ROI=目标值/spent；横轴 D0~D60。当前：月份=${monthsSel.length}个（最多6） · ${dimsAgg} · 线条=${lineCount}。`;

        if (res.errors && res.errors.length){
          const msg = res.errors.join('；');
          hintEl.innerHTML = `<span class="ovp-m1-warn">${msg}</span>`;

          // clear chart/table
          if (chart){
            chart.clear();
            chart.setOption({
              graphic: [{
                type: 'text',
                left: 'center',
                top: 'middle',
                style: {
                  text: msg,
                  fill: '#64748b',
                  fontSize: 12
                }
              }]
            });
          }
          tableWrap.innerHTML = `<div class="ovp-m1-empty">${msg}</div>`;
          return;
        }

        hintEl.textContent = '';

        // chart
        renderChart(chart, res.lines);

        // table (sort: month asc, metric, then dims)
        const linesSorted = res.lines.slice().sort((a,b)=>{
          const ak = [a.month, a.metricLabel, a.country||'', a.media||'', a.productType||''].join('|');
          const bk = [b.month, b.metricLabel, b.country||'', b.media||'', b.productType||''].join('|');
          return ak.localeCompare(bk);
        });

        tableWrap.innerHTML = buildTableHtml({ lines: linesSorted, split: res.split });
      }

      // First compute options based on default months
      updateDimOptions();
      renderAll();
    }
  });
})();
