// ===========================
// 模块 3：D0 / D7 ARPPU
// 文件：organic-monthly/module-arppu.js
// 口径：ARPPU = PURCHASE_VALUE / unique_purchase
// - D0 ARPPU = D0_PURCHASE_VALUE / D0_unique_purchase
// - D7 ARPPU = D7_PURCHASE_VALUE / D7_unique_purchase
// ===========================

(function(){
  const MODULE_ID = 'arppu';
  const TITLE = 'D0 / D7 ARPPU';
  const SUBTITLE = '自然量注册用户的 D0 / D7 ARPPU（ARPPU = PURCHASE_VALUE / unique_purchase）';

  const COUNTRY_ORDER = ['GH','KE','NG','TZ','UG'];

  const METRICS = [
    { key: 'D0', label: 'D0', payKey: 'D0_unique_purchase', valueKey: 'D0_PURCHASE_VALUE', lineType: 'dashed', hatch: false },
    { key: 'D7', label: 'D7', payKey: 'D7_unique_purchase', valueKey: 'D7_PURCHASE_VALUE', lineType: 'solid',  hatch: true  }
  ];

  const MONTH_COLORS = [
    '#2563eb', '#f59e0b', '#10b981', '#ef4444',
    '#8b5cf6', '#14b8a6', '#e11d48', '#0ea5e9',
    '#f97316', '#22c55e', '#3b82f6', '#a855f7'
  ];

  const COUNTRY_COLORS = {
    GH: '#2563eb',
    KE: '#f59e0b',
    NG: '#10b981',
    TZ: '#ef4444',
    UG: '#8b5cf6'
  };

  function injectStyleOnce(){
    const id = 'ovp-style-arppu';
    if (document.getElementById(id)) return;

    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      .ovp-arppu{ display:block; }
      .ovp-arppu .ovp-arppu-panel{
        border:1px solid rgba(148, 163, 184, 0.60);
        border-radius:12px;
        background: rgba(249, 250, 251, 0.90);
        padding:12px;
      }

      .ovp-arppu .ovp-arppu-filters{
        display:flex;
        flex-wrap:wrap;
        gap:10px 14px;
        align-items:flex-start;
      }

      .ovp-arppu .ovp-arppu-group{
        display:flex;
        flex-wrap:wrap;
        gap:8px;
        align-items:center;
        min-width: 220px;
      }

      .ovp-arppu .ovp-arppu-label{
        font-size:11px;
        color: var(--muted);
        white-space:nowrap;
        margin-right:2px;
      }

      .ovp-arppu .ovp-arppu-items{
        display:flex;
        flex-wrap:wrap;
        gap:8px;
        align-items:center;
      }

      .ovp-arppu label.ovp-arppu-check{
        display:inline-flex;
        align-items:center;
        gap:6px;
        padding:4px 9px;
        border:1px solid rgba(148, 163, 184, 0.60);
        border-radius:999px;
        background:#fff;
        cursor:pointer;
        user-select:none;
        font-size:11px;
        color: var(--text);
        line-height:1.2;
      }

      .ovp-arppu label.ovp-arppu-check:hover{
        background: rgba(249, 250, 251, 0.95);
      }

      .ovp-arppu label.ovp-arppu-check input{
        width:12px;
        height:12px;
        margin:0;
        accent-color: var(--ovp-blue, #2563eb);
      }

      .ovp-arppu .ovp-arppu-table-wrap{
        border:1px solid rgba(148, 163, 184, 0.60);
        border-radius:12px;
        background:#fff;
        overflow:auto;
      }

      .ovp-arppu table.ovp-arppu-table{
        width:100%;
        border-collapse:separate;
        border-spacing:0;
        font-size:11px;
        color: var(--text);
        min-width: 720px;
      }

      .ovp-arppu table.ovp-arppu-table thead th{
        position:sticky;
        top:0;
        z-index:2;
        background: rgba(249, 250, 251, 0.98);
        text-align:left;
        font-weight:600;
        padding:8px 10px;
        border-bottom:1px solid rgba(148, 163, 184, 0.60);
        border-right:1px solid rgba(148, 163, 184, 0.30);
        white-space:nowrap;
      }

      .ovp-arppu table.ovp-arppu-table tbody td{
        padding:8px 10px;
        border-bottom:1px solid rgba(148, 163, 184, 0.30);
        border-right:1px solid rgba(148, 163, 184, 0.18);
        white-space:nowrap;
      }

      .ovp-arppu table.ovp-arppu-table th:first-child,
      .ovp-arppu table.ovp-arppu-table td:first-child{
        position:sticky;
        left:0;
        z-index:3;
        background:#fff;
        font-weight:600;
        border-right:1px solid rgba(148, 163, 184, 0.60);
      }

      .ovp-arppu table.ovp-arppu-table tbody tr:nth-child(2n) td{
        background: rgba(249, 250, 251, 0.55);
      }
      .ovp-arppu table.ovp-arppu-table tbody tr:nth-child(2n) td:first-child{
        background: rgba(249, 250, 251, 0.75);
      }

      .ovp-arppu .ovp-arppu-empty{
        padding:10px 12px;
        color: var(--muted);
        font-size:11px;
        line-height:1.5;
      }
    `;
    document.head.appendChild(style);
  }

  function safeNum(v){
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }

  function sortDates(ds){
    return (Array.isArray(ds) ? ds.slice() : []).sort((a,b)=>String(a).localeCompare(String(b)));
  }

  function parseMonth(m){
    const s = String(m || '');
    const parts = s.split('-');
    if (parts.length !== 2) return { y:'', m:'' };
    return { y: parts[0], m: parts[1] };
  }

  function monthLabel(m, yearsSet){
    const p = parseMonth(m);
    const mm = Number(p.m);
    const mon = Number.isFinite(mm) ? `${mm}月` : String(m);
    if (yearsSet && yearsSet.size > 1 && p.y) return `${p.y}年${mon}`;
    return mon;
  }
  // 月份筛选器专用：固定显示 YYYY-MM（例如 2025-09），避免仅显示“9月”造成歧义
  function monthFilterLabel(m){
    const p = parseMonth(m);
    if (!p.y || !p.m) return String(m || '');
    const mm = String(p.m).padStart(2, '0');
    return `${p.y}-${mm}`;
  }

  function yearsOfMonths(ms){
    const ys = new Set();
    for (const m of (Array.isArray(ms) ? ms : [])){
      const p = parseMonth(m);
      if (p.y) ys.add(p.y);
    }
    return ys;
  }

  function ensureAtLeastOneChecked({ inputs, fallbackValue }){
    const checked = Array.from(inputs).filter(i => i && i.checked);
    if (checked.length) return;

    const fb = Array.from(inputs).find(i => String(i.value) === String(fallbackValue));
    if (fb) fb.checked = true;
  }

  function computeMonthlyAgg(rawByMonth, month, countries){
    const rows = Array.isArray(rawByMonth && rawByMonth[month]) ? rawByMonth[month] : [];
    const countriesSet = new Set(countries);

    const acc = {};
    for (const c of countries){
      acc[c] = {
        D0: { pay: 0, value: 0 },
        D7: { pay: 0, value: 0 }
      };
    }

    for (const r of rows){
      const c = r && r.country;
      if (!countriesSet.has(c)) continue;

      for (const m of METRICS){
        const pay = safeNum(r[m.payKey]) || 0;
        const val = safeNum(r[m.valueKey]) || 0;
        acc[c][m.key].pay += pay;
        acc[c][m.key].value += val;
      }
    }

    const out = {};
    for (const c of countries){
      out[c] = {};
      for (const m of METRICS){
        const p = acc[c][m.key].pay;
        const v = acc[c][m.key].value;
        out[c][m.key] = (p && p > 0) ? (v / p) : null;
      }
    }
    return out;
  }

  function buildDateIndex(rawByMonth, months){
    const rows = [];
    const dateSet = new Set();

    for (const mo of months){
      const arr = Array.isArray(rawByMonth && rawByMonth[mo]) ? rawByMonth[mo] : [];
      for (const r of arr){
        if (r && r.date) dateSet.add(String(r.date));
        rows.push(r);
      }
    }

    const byKey = new Map();
    for (const r of rows){
      if (!r || !r.date || !r.country) continue;
      byKey.set(`${r.date}|${r.country}`, r);
    }

    const dates = sortDates(Array.from(dateSet));
    return { dates, byKey };
  }

  function calcDailyArppuSeries({ rawByMonth, months, countries, metricsSelected }){
    const { dates, byKey } = buildDateIndex(rawByMonth, months);
    const out = { dates, seriesByCountry: {} };

    for (const c of countries){
      out.seriesByCountry[c] = {};
      for (const mk of metricsSelected){
        const m = METRICS.find(x => x.key === mk);
        if (!m) continue;

        const arr = dates.map(d=>{
          const row = byKey.get(`${d}|${c}`);
          if (!row) return null;
          const pay = safeNum(row[m.payKey]) || 0;
          const val = safeNum(row[m.valueKey]) || 0;
          if (!pay) return null;
          return val / pay;
        });

        out.seriesByCountry[c][mk] = arr;
      }
    }
    return out;
  }

  function makeBarOption({ months, countries, metricsSelected, monthlyAggByMonth, utils }){
    const yearsSet = yearsOfMonths(months);
    const colorByMonth = {};
    months.forEach((m, idx)=>{ colorByMonth[m] = MONTH_COLORS[idx % MONTH_COLORS.length]; });

    const series = [];
    for (const mo of months){
      const color = colorByMonth[mo];

      for (const mk of metricsSelected){
        const meta = METRICS.find(x => x.key === mk);
        if (!meta) continue;

        const data = countries.map(c=>{
          const v = monthlyAggByMonth[mo] && monthlyAggByMonth[mo][c] ? monthlyAggByMonth[mo][c][mk] : null;
          return (v === null || v === undefined) ? null : Number(v);
        });

        const s = {
          name: `${monthLabel(mo, yearsSet)} ${mk}`,
          type: 'bar',
          data,
          barMaxWidth: 18,
          itemStyle: { color }
        };

        if (meta.hatch){
          s.itemStyle.decal = {
            symbol: 'rect',
            rotation: Math.PI / 4,
            dashArrayX: [1, 0],
            dashArrayY: [6, 3],
            color: 'rgba(255,255,255,0.42)',
            maxTileWidth: 256,
            maxTileHeight: 256
          };
        }

        series.push(s);
      }
    }

    return {
      animation: false,
      grid: { left: 38, right: 18, top: 56, bottom: 42, containLabel: true },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: function(params){
          const items = Array.isArray(params) ? params : [];
          const axis = items.length ? items[0].axisValue : '';
          const rows = items
            .filter(p => p && p.seriesName)
            .map(p=>{
              const v = (p.data === null || p.data === undefined) ? null : Number(p.data);
              const vFmt = (v === null || !Number.isFinite(v)) ? '—' : utils.fmtMoney(v, 'USD', 2);
              return `${p.marker}${p.seriesName}: ${vFmt}`;
            })
            .join('<br/>');
          return `${axis}<br/>${rows}`;
        }
      },
      legend: { top: 14, left: 12, itemWidth: 12, itemHeight: 8, textStyle: { fontSize: 11 } },
      xAxis: {
        type: 'category',
        data: countries,
        axisTick: { alignWithLabel: true },
        axisLabel: { fontSize: 11 }
      },
      yAxis: {
        type: 'value',
        axisLabel: { fontSize: 11 }
      },
      series
    };
  }

  function makeLineOption({ dates, countries, metricsSelected, daily, utils }){
    const legendData = countries.slice(); // 仅展示国家，D0/D7 用线型区分
    const series = [];

    for (const c of countries){
      const color = COUNTRY_COLORS[c] || '#2563eb';

      for (const mk of metricsSelected){
        const meta = METRICS.find(x => x.key === mk);
        if (!meta) continue;

        const arr = daily.seriesByCountry[c] && daily.seriesByCountry[c][mk] ? daily.seriesByCountry[c][mk] : [];
        series.push({
          id: `${c}|${mk}`,
          name: c, // legend 合并
          type: 'line',
          data: arr,
          showSymbol: false,
          connectNulls: true,
          lineStyle: { type: meta.lineType, width: 2, color },
          itemStyle: { color }
        });
      }
    }

    return {
      animation: false,
      grid: { left: 42, right: 18, top: 56, bottom: 52, containLabel: true },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'line' },
        formatter: function(params){
          const items = Array.isArray(params) ? params : [];
          const axis = items.length ? items[0].axisValue : '';
          const byCountry = {};

          for (const it of items){
            if (!it || !it.seriesId) continue;
            const parts = String(it.seriesId).split('|');
            const c = parts[0] || it.seriesName || '';
            const mk = parts[1] || '';
            if (!byCountry[c]) byCountry[c] = {};
            const v = (it.data === null || it.data === undefined) ? null : Number(it.data);
            byCountry[c][mk] = (v === null || !Number.isFinite(v)) ? '—' : utils.fmtMoney(v, 'USD', 2);
          }

          const lines = Object.keys(byCountry).map(c=>{
            const d0 = byCountry[c].D0 || '—';
            const d7 = byCountry[c].D7 || '—';
            return `${c}: D0 ${d0} / D7 ${d7}`;
          });

          return `${axis}<br/>${lines.join('<br/>')}`;
        }
      },
      legend: { top: 14, left: 12, data: legendData, textStyle: { fontSize: 11 } },
      xAxis: {
        type: 'category',
        data: dates,
        axisLabel: {
          fontSize: 10,
          formatter: function(v){ return String(v || '').slice(5); } // MM-DD
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: { fontSize: 11 }
      },
      series
    };
  }

  function renderTable({ el, months, countries, metricsSelected, monthlyAggByMonth, utils }){
    if (!el) return;

    if (!months.length || !countries.length || !metricsSelected.length){
      el.innerHTML = `<div class="ovp-arppu-empty">筛选条件为空：至少选 1 个月份、1 个国家、1 个口径（D0/D7）。</div>`;
      return;
    }

    const yearsSet = yearsOfMonths(months);

    const thead = `
      <thead>
        <tr>
          <th>国家</th>
          ${months.map(mo => metricsSelected.map(mk=>{
            return `<th>${monthLabel(mo, yearsSet)}自然量${mk} ARPPU</th>`;
          }).join('')).join('')}
        </tr>
      </thead>
    `;

    const tbodyRows = countries.map(c=>{
      const tds = months.map(mo=>{
        const cell = monthlyAggByMonth[mo] && monthlyAggByMonth[mo][c] ? monthlyAggByMonth[mo][c] : {};
        return metricsSelected.map(mk=>{
          const v = cell[mk];
          const fmt = (v === null || v === undefined || !Number.isFinite(Number(v)))
            ? '—'
            : utils.fmtMoney(Number(v), 'USD', 2);
          return `<td>${fmt}</td>`;
        }).join('');
      }).join('');

      return `<tr><td>${c}</td>${tds}</tr>`;
    }).join('');

    el.innerHTML = `
      <div class="ovp-arppu-table-wrap">
        <table class="ovp-arppu-table">
          ${thead}
          <tbody>${tbodyRows}</tbody>
        </table>
      </div>
    `;
  }

  function render({ mountEl, rawByMonth, months, latestMonth, utils }){
    if (!mountEl) return;
    injectStyleOnce();

    const allMonths = (Array.isArray(months) && months.length)
      ? months.slice()
      : (rawByMonth ? Object.keys(rawByMonth) : []).sort((a,b)=>String(a).localeCompare(String(b)));

    const defaultMonth = latestMonth || (allMonths.length ? allMonths[allMonths.length - 1] : null);
    

    const defaultMetrics = ['D0', 'D7'];

    const html = `
      <div class="ovp-arppu">
        <div class="ovp-module-stack">
          <div class="ovp-arppu-panel">
            <div class="ovp-arppu-filters" id="filters-${MODULE_ID}">
              <div class="ovp-arppu-group">
                <div class="ovp-arppu-label">月份</div>
                <div class="ovp-arppu-items">
                  ${allMonths.map(m=>{
                    const checked = (m === defaultMonth) ? 'checked' : '';
                    return `<label class="ovp-arppu-check"><input type="checkbox" data-role="month" value="${m}" ${checked} /><span>${monthFilterLabel(m)}</span></label>`;
                  }).join('')}
                </div>
              </div>

              <div class="ovp-arppu-group">
                <div class="ovp-arppu-label">国家</div>
                <div class="ovp-arppu-items">
                  ${COUNTRY_ORDER.map(c=>{
                    return `<label class="ovp-arppu-check"><input type="checkbox" data-role="country" value="${c}" checked /><span>${c}</span></label>`;
                  }).join('')}
                </div>
              </div>

              <div class="ovp-arppu-group">
                <div class="ovp-arppu-label">图表</div>
                <div class="ovp-arppu-items">
                  <label class="ovp-arppu-check"><input type="radio" name="chartType-${MODULE_ID}" data-role="chartType" value="bar" checked /><span>月度柱状图</span></label>
                  <label class="ovp-arppu-check"><input type="radio" name="chartType-${MODULE_ID}" data-role="chartType" value="line" /><span>日级折线图</span></label>
                </div>
              </div>

              <div class="ovp-arppu-group">
                <div class="ovp-arppu-label">口径</div>
                <div class="ovp-arppu-items">
                  ${defaultMetrics.map(mk=>{
                    return `<label class="ovp-arppu-check"><input type="checkbox" data-role="metric" value="${mk}" checked /><span>${mk}</span></label>`;
                  }).join('')}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div class="ovp-chart" id="chart-${MODULE_ID}" style="height:360px;"></div>
            <div class="ovp-chart-note" id="note-${MODULE_ID}"></div>
          </div>

          <div id="table-${MODULE_ID}"></div>

          <div class="ovp-chart-note" id="insight-note-${MODULE_ID}"></div>
          <div class="ovp-insight is-empty" id="insight-${MODULE_ID}">文案待填写：./insights.js</div>
        </div>
      </div>
    `;
    mountEl.innerHTML = html;

    const filtersEl = mountEl.querySelector(`#filters-${MODULE_ID}`);
    const chartEl = mountEl.querySelector(`#chart-${MODULE_ID}`);
    const noteEl = mountEl.querySelector(`#note-${MODULE_ID}`);
    const tableEl = mountEl.querySelector(`#table-${MODULE_ID}`);
    const insightNoteEl = mountEl.querySelector(`#insight-note-${MODULE_ID}`);
    const insightEl = mountEl.querySelector(`#insight-${MODULE_ID}`);

    if (!rawByMonth || !allMonths.length){
      noteEl.textContent = '未检测到可用月份数据：请检查 data.js 是否暴露 RAW_ORGANIC_BY_MONTH。';
      if (chartEl) chartEl.classList.add('is-empty');
      return;
    }

    const chart = (window.echarts && chartEl) ? window.echarts.init(chartEl) : null;
    if (!chart){
      noteEl.textContent = '未检测到 echarts：请确认图表库是否加载成功。';
      return;
    }

    function getSelections(){
      const monthInputs = filtersEl.querySelectorAll('input[data-role="month"]');
      const countryInputs = filtersEl.querySelectorAll('input[data-role="country"]');
      const metricInputs = filtersEl.querySelectorAll('input[data-role="metric"]');

      ensureAtLeastOneChecked({ inputs: monthInputs, fallbackValue: defaultMonth });
      ensureAtLeastOneChecked({ inputs: countryInputs, fallbackValue: COUNTRY_ORDER[0] });
      ensureAtLeastOneChecked({ inputs: metricInputs, fallbackValue: 'D0' });

      const selMonths = Array.from(monthInputs).filter(i=>i.checked).map(i=>i.value);
      const selCountries = COUNTRY_ORDER.filter(c => Array.from(countryInputs).some(i=>i.checked && i.value === c));
      const selMetrics = ['D0','D7'].filter(mk => Array.from(metricInputs).some(i=>i.checked && i.value === mk));

      const chartTypeEl = filtersEl.querySelector(`input[name="chartType-${MODULE_ID}"]:checked`);
      const chartType = chartTypeEl ? chartTypeEl.value : 'bar';

      return {
        months: (utils && utils.sortMonths) ? utils.sortMonths(selMonths) : selMonths.sort(),
        countries: selCountries,
        metrics: selMetrics,
        chartType
      };
    }

    function renderInsightFor(month){
      if (!insightEl) return;
      if (window.OVP && OVP.ui && typeof OVP.ui.renderInsight === 'function'){
        OVP.ui.renderInsight({ moduleId: MODULE_ID, month, el: insightEl });
      } else if (window.OVP && typeof OVP.getInsight === 'function'){
        const text = String(OVP.getInsight(MODULE_ID, month) || '').trim();
        insightEl.textContent = text || '文案待填写：./insights.js';
        if (text) insightEl.classList.remove('is-empty');
        else insightEl.classList.add('is-empty');
      }
    }

        // 多选月份：把每个月的文案拼接展示
    function renderInsightsForMonths(monthsArr, yearsSet){
      if (!insightEl) return;

      const getter = (window.OVP && typeof OVP.getInsight === 'function') ? OVP.getInsight : null;
      const ms = Array.isArray(monthsArr) ? monthsArr : [];

      if (!getter || !ms.length){
        insightEl.textContent = '文案待填写：./insights.js';
        insightEl.classList.add('is-empty');
        return;
      }

      const blocks = [];
      let hasAny = false;

      for (const m of ms){
        const raw = getter(MODULE_ID, m) || '';
        const text = String(raw || '').trim();
        if (text) hasAny = true;

        const title = `${monthLabel(m, yearsSet)}（${m}）`;
        blocks.push(text ? `${title}\n${text}` : `${title}\n（该月暂无文案）`);
      }

      insightEl.textContent = blocks.join('\n\n--------------------------------\n\n');
      insightEl.classList.toggle('is-empty', !hasAny);
    }

    function update(){
      const sel = getSelections();
      const yearsSetSel = yearsOfMonths(sel.months);
      const lastMonth = sel.months.length ? sel.months[sel.months.length - 1] : defaultMonth;

      // 1) 月度汇总（用于柱图 & 表格）
      const monthlyAggByMonth = {};
      for (const mo of sel.months){
        monthlyAggByMonth[mo] = computeMonthlyAgg(rawByMonth, mo, sel.countries);
      }

      // 2) Chart
      if (!sel.months.length || !sel.countries.length || !sel.metrics.length){
        chart.clear();
        noteEl.textContent = '筛选条件为空：至少选 1 个月份、1 个国家、1 个口径（D0/D7）。';
        renderTable({ el: tableEl, months: sel.months, countries: sel.countries, metricsSelected: sel.metrics, monthlyAggByMonth, utils });
        insightNoteEl.textContent = '';
         renderInsightsForMonths(sel.months.length ? sel.months : [lastMonth], yearsSetSel);
        return;
      }

      if (sel.chartType === 'line'){
        const daily = calcDailyArppuSeries({
          rawByMonth,
          months: sel.months,
          countries: sel.countries,
          metricsSelected: sel.metrics
        });

        const opt = makeLineOption({
          dates: daily.dates,
          countries: sel.countries,
          metricsSelected: sel.metrics,
          daily,
          utils
        });

        chart.setOption(opt, true);

        noteEl.textContent = `口径：ARPPU = PURCHASE_VALUE / unique_purchase；折线图为日级（当日 PURCHASE_VALUE / 当日 unique_purchase），单位：USD/付费用户。月份：${sel.months.map(m=>monthLabel(m, yearsSetSel)).join('、')}。`;
      } else {
        const opt = makeBarOption({
          months: sel.months,
          countries: sel.countries,
          metricsSelected: sel.metrics,
          monthlyAggByMonth,
          utils
        });

        chart.setOption(opt, true);

        noteEl.textContent = `口径：ARPPU = PURCHASE_VALUE / unique_purchase；柱状图为月度汇总（∑PURCHASE_VALUE / ∑unique_purchase），单位：USD/付费用户。月份：${sel.months.map(m=>monthLabel(m, yearsSetSel)).join('、')}。`;
      }

      // 3) Table
      renderTable({ el: tableEl, months: sel.months, countries: sel.countries, metricsSelected: sel.metrics, monthlyAggByMonth, utils });

            // 4) Insight：展示每一个所选月份的文案（多月拼接）
      insightNoteEl.textContent = sel.months.length
        ? `数据解读月份：${sel.months.map(m=>monthLabel(m, yearsSetSel)).join('、')}`
        : '';
      renderInsightsForMonths(sel.months, yearsSetSel);

    }

    filtersEl.addEventListener('change', function(){
      update();
    });

    window.addEventListener('resize', function(){
      try{ chart.resize(); }catch(_e){}
    });

    update();
  }

  if (window.OVP && typeof window.OVP.registerModule === 'function'){
    window.OVP.registerModule({
      id: MODULE_ID,
      title: TITLE,
      subtitle: SUBTITLE,
      render
    });
  }
})();
