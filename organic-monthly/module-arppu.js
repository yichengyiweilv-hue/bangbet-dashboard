(function(){
  const moduleId = 'arppu';

  const COUNTRY_ORDER = ['GH','KE','NG','TZ','UG'];
  const CHART_TYPES = [
    { key:'bar',  label:'月度柱状图' },
    { key:'line', label:'日级折线图' },
  ];
  const DAY_TYPES = [
    { key:'D0', label:'D0 数据' },
    { key:'D7', label:'D7 数据' },
  ];

  const STYLE_ID = 'ovp-style-arppu';

  function injectStyleOnce(){
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      /* module-arppu */
      .ovp-arppu .ovp-filters{
        display:flex;
        flex-wrap:wrap;
        gap:10px;
        padding:12px;
        border:1px solid rgba(148, 163, 184, 0.60);
        border-radius:12px;
        background: rgba(249, 250, 251, 0.90);
      }
      .ovp-arppu .ovp-filter-group{
        flex: 1 1 240px;
        min-width: 240px;
      }
      .ovp-arppu .ovp-filter-label{
        font-size:11px;
        color: var(--muted);
        margin:0 0 8px;
      }
      .ovp-arppu .ovp-filter-options{
        display:flex;
        flex-wrap:wrap;
        gap:8px;
        align-items:center;
      }
      .ovp-arppu .ovp-check{
        display:inline-flex;
        align-items:center;
        gap:6px;
        padding:6px 8px;
        border:1px solid rgba(148, 163, 184, 0.60);
        border-radius:999px;
        background: rgba(255,255,255,0.95);
        cursor:pointer;
        user-select:none;
        font-size:11px;
        color: var(--text);
      }
      .ovp-arppu .ovp-check input{
        margin:0;
        transform: translateY(0.5px);
        accent-color: var(--ovp-blue, #2563eb);
      }
      .ovp-arppu .ovp-check span{
        white-space:nowrap;
      }

      .ovp-arppu .ovp-table-meta{
        margin: 0 0 8px;
        font-size:11px;
        color: var(--muted);
        line-height:1.45;
      }
      .ovp-arppu .ovp-table-wrap{
        border:1px solid rgba(148, 163, 184, 0.60);
        border-radius:12px;
        overflow:hidden;
        background: rgba(249, 250, 251, 0.90);
      }
      .ovp-arppu table.ovp-table{
        width:100%;
        border-collapse:collapse;
        font-size:11px;
      }
      .ovp-arppu .ovp-table th,
      .ovp-arppu .ovp-table td{
        padding:10px 10px;
        border-bottom:1px solid rgba(148, 163, 184, 0.35);
        vertical-align:middle;
      }
      .ovp-arppu .ovp-table thead th{
        color: var(--text);
        font-weight:600;
        background: rgba(255,255,255,0.92);
      }
      .ovp-arppu .ovp-table tbody tr:last-child td{
        border-bottom:none;
      }
      .ovp-arppu .ovp-table td.num{
        text-align:right;
        font-variant-numeric: tabular-nums;
      }
      .ovp-arppu .ovp-table td.country,
      .ovp-arppu .ovp-table th.country{
        text-align:left;
        font-weight:600;
      }

      .ovp-arppu .ovp-insight-head{
        display:flex;
        justify-content:space-between;
        align-items:flex-end;
        gap:12px;
        margin: 0 0 8px;
      }
      .ovp-arppu .ovp-insight-title{
        font-size:12px;
        font-weight:600;
        color: var(--text);
      }
      .ovp-arppu .ovp-insight-sub{
        font-size:11px;
        color: var(--muted);
        line-height:1.3;
      }
    `;
    document.head.appendChild(style);
  }

  function safeNumber(v){
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }

  function sumAdd(acc, v){
    const n = safeNumber(v);
    if (n === null) return acc;
    return acc + n;
  }

  function arppu(valueSum, payerSum){
    const v = safeNumber(valueSum);
    const p = safeNumber(payerSum);
    if (v === null || p === null || p <= 0) return null;
    return v / p;
  }

  function fmtArppu(v){
    const n = safeNumber(v);
    if (n === null) return '—';
    return n.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  }

  function monthParts(m){
    const s = String(m || '');
    const parts = s.split('-');
    return { y: parts[0] || '', m: parts[1] || '' };
  }

  function monthLabel(m, showYear){
    const { y, m: mm } = monthParts(m);
    if (!mm) return String(m);
    const mNum = Number(mm);
    if (!Number.isFinite(mNum)) return String(m);
    return showYear ? `${y}-${mm}` : `${mNum}月`;
  }

  function sortIsoDates(arr){
    return (Array.isArray(arr) ? arr.slice() : []).sort((a,b)=>String(a).localeCompare(String(b)));
  }

  function sortMonths(arr, utils){
    if (utils && typeof utils.sortMonths === 'function') return utils.sortMonths(arr);
    return (Array.isArray(arr) ? arr.slice() : []).sort((a,b)=>String(a).localeCompare(String(b)));
  }

  function uniq(arr){
    const out = [];
    const seen = new Set();
    for (const x of (Array.isArray(arr) ? arr : [])){
      const k = String(x);
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(x);
    }
    return out;
  }

  function hslColor(seed){
    const hue = ((seed * 57) % 360 + 360) % 360;
    return `hsl(${hue} 68% 44%)`;
  }

  function buildMonthlyAgg({ rawByMonth, months, countries }){
    const out = {};
    for (const month of months){
      const rows = rawByMonth && rawByMonth[month];
      if (!Array.isArray(rows)) continue;

      out[month] = out[month] || {};
      for (const c of countries){
        out[month][c] = out[month][c] || {
          D0_value: 0, D0_payers: 0,
          D7_value: 0, D7_payers: 0,
        };
      }

      for (const r of rows){
        if (!r) continue;
        const c = String(r.country || '');
        if (!countries.includes(c)) continue;
        out[month][c] = out[month][c] || { D0_value:0, D0_payers:0, D7_value:0, D7_payers:0 };

        out[month][c].D0_value  = sumAdd(out[month][c].D0_value,  r.D0_PURCHASE_VALUE);
        out[month][c].D0_payers = sumAdd(out[month][c].D0_payers, r.D0_unique_purchase);

        out[month][c].D7_value  = sumAdd(out[month][c].D7_value,  r.D7_PURCHASE_VALUE);
        out[month][c].D7_payers = sumAdd(out[month][c].D7_payers, r.D7_unique_purchase);
      }
    }

    // calc arppu
    const outFinal = {};
    for (const m of Object.keys(out)){
      outFinal[m] = {};
      for (const c of Object.keys(out[m] || {})){
        const cell = out[m][c];
        outFinal[m][c] = {
          D0: arppu(cell.D0_value, cell.D0_payers),
          D7: arppu(cell.D7_value, cell.D7_payers),
          __sum: cell
        };
      }
    }
    return outFinal;
  }

  function buildTotalsAgg({ rawByMonth, months, countries }){
    const totals = {};
    for (const c of countries){
      totals[c] = { D0_value:0, D0_payers:0, D7_value:0, D7_payers:0 };
    }

    for (const month of months){
      const rows = rawByMonth && rawByMonth[month];
      if (!Array.isArray(rows)) continue;
      for (const r of rows){
        if (!r) continue;
        const c = String(r.country || '');
        if (!countries.includes(c)) continue;

        totals[c].D0_value  = sumAdd(totals[c].D0_value,  r.D0_PURCHASE_VALUE);
        totals[c].D0_payers = sumAdd(totals[c].D0_payers, r.D0_unique_purchase);

        totals[c].D7_value  = sumAdd(totals[c].D7_value,  r.D7_PURCHASE_VALUE);
        totals[c].D7_payers = sumAdd(totals[c].D7_payers, r.D7_unique_purchase);
      }
    }

    const out = {};
    for (const c of countries){
      out[c] = {
        D0: arppu(totals[c].D0_value, totals[c].D0_payers),
        D7: arppu(totals[c].D7_value, totals[c].D7_payers),
        __sum: totals[c]
      };
    }
    return out;
  }

  function buildDailyAgg({ rawByMonth, months, countries }){
    const acc = {};  // acc[country][date] = sums
    const dateSet = new Set();

    for (const c of countries) acc[c] = {};

    for (const month of months){
      const rows = rawByMonth && rawByMonth[month];
      if (!Array.isArray(rows)) continue;

      for (const r of rows){
        if (!r) continue;
        const c = String(r.country || '');
        const d = String(r.date || '');
        if (!countries.includes(c) || !d) continue;

        dateSet.add(d);
        acc[c][d] = acc[c][d] || { D0_value:0, D0_payers:0, D7_value:0, D7_payers:0 };

        acc[c][d].D0_value  = sumAdd(acc[c][d].D0_value,  r.D0_PURCHASE_VALUE);
        acc[c][d].D0_payers = sumAdd(acc[c][d].D0_payers, r.D0_unique_purchase);

        acc[c][d].D7_value  = sumAdd(acc[c][d].D7_value,  r.D7_PURCHASE_VALUE);
        acc[c][d].D7_payers = sumAdd(acc[c][d].D7_payers, r.D7_unique_purchase);
      }
    }

    const dates = sortIsoDates([...dateSet]);
    const byCountry = {};
    for (const c of countries){
      byCountry[c] = {};
      for (const d of dates){
        const cell = acc[c][d];
        if (!cell){
          byCountry[c][d] = { D0:null, D7:null };
          continue;
        }
        byCountry[c][d] = {
          D0: arppu(cell.D0_value, cell.D0_payers),
          D7: arppu(cell.D7_value, cell.D7_payers),
        };
      }
    }

    return { dates, byCountry };
  }

  function buildBarOption({ selectedMonths, selectedCountries, selectedDayTypes, monthlyAgg, showYear }){
    const months = selectedMonths;
    const countries = selectedCountries;
    const dayTypes = selectedDayTypes;

    const series = [];
    const legend = [];

    const decalForD7 = {
      symbol: 'rect',
      symbolSize: 1,
      dashArrayX: [4, 2],
      dashArrayY: [2, 6],
      rotation: Math.PI / 4,
      color: 'rgba(255,255,255,0.55)'
    };

    months.forEach((m, idxM)=>{
      const baseColor = hslColor(idxM + 1);
      dayTypes.forEach((dt)=>{
        const name = `${monthLabel(m, showYear)} ${dt}`;
        legend.push(name);

        const data = countries.map((c)=>{
          const v = monthlyAgg && monthlyAgg[m] && monthlyAgg[m][c] ? monthlyAgg[m][c][dt] : null;
          return (safeNumber(v) === null) ? null : v;
        });

        series.push({
          name,
          type: 'bar',
          data,
          barMaxWidth: 26,
          itemStyle: {
            color: baseColor,
            decal: (dt === 'D7') ? decalForD7 : null,
          },
          emphasis: { focus: 'series' }
        });
      });
    });

    return {
      animationDuration: 300,
      grid: { left: 48, right: 18, top: 34, bottom: 36, containLabel: true },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        valueFormatter: (v)=> fmtArppu(v)
      },
      legend: {
        top: 0,
        left: 0,
        data: legend,
        textStyle: { color: '#64748b', fontSize: 11 }
      },
      xAxis: {
        type: 'category',
        data: countries,
        axisTick: { alignWithLabel: true },
        axisLabel: { color: '#334155', fontSize: 11 }
      },
      yAxis: {
        type: 'value',
        name: 'ARPPU',
        nameTextStyle: { color: '#64748b', fontSize: 11 },
        axisLabel: {
          color: '#64748b',
          fontSize: 11,
          formatter: (v)=> fmtArppu(v)
        },
        splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.25)' } }
      },
      series
    };
  }

  function buildLineOption({ selectedCountries, selectedDayTypes, dailyAgg }){
    const countries = selectedCountries;
    const dayTypes = selectedDayTypes;
    const dates = (dailyAgg && Array.isArray(dailyAgg.dates)) ? dailyAgg.dates : [];
    const byCountry = (dailyAgg && dailyAgg.byCountry) ? dailyAgg.byCountry : {};

    const series = [];
    const legend = [];

    countries.forEach((c, idxC)=>{
      const color = hslColor(20 + idxC * 3);

      if (dayTypes.includes('D0')){
        legend.push(`${c} D0`);
        series.push({
          name: `${c} D0`,
          type: 'line',
          showSymbol: false,
          connectNulls: false,
          data: dates.map(d=> (byCountry[c] && byCountry[c][d]) ? byCountry[c][d].D0 : null),
          lineStyle: { width: 2, type: 'dashed', color },
          itemStyle: { color },
          emphasis: { focus: 'series' }
        });
      }

      if (dayTypes.includes('D7')){
        legend.push(`${c} D7`);
        series.push({
          name: `${c} D7`,
          type: 'line',
          showSymbol: false,
          connectNulls: false,
          data: dates.map(d=> (byCountry[c] && byCountry[c][d]) ? byCountry[c][d].D7 : null),
          lineStyle: { width: 2, type: 'solid', color },
          itemStyle: { color },
          emphasis: { focus: 'series' }
        });
      }
    });

    const needZoom = dates.length > 45;

    return {
      animationDuration: 300,
      grid: { left: 48, right: 18, top: 34, bottom: needZoom ? 62 : 36, containLabel: true },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'line' },
        valueFormatter: (v)=> fmtArppu(v)
      },
      legend: {
        top: 0,
        left: 0,
        data: legend,
        textStyle: { color: '#64748b', fontSize: 11 }
      },
      xAxis: {
        type: 'category',
        data: dates,
        boundaryGap: false,
        axisLabel: {
          color: '#334155',
          fontSize: 10,
          formatter: (v)=>{
            const s = String(v || '');
            // YYYY-MM-DD -> MM-DD
            return s.length >= 10 ? s.slice(5) : s;
          }
        }
      },
      yAxis: {
        type: 'value',
        name: 'ARPPU',
        nameTextStyle: { color: '#64748b', fontSize: 11 },
        axisLabel: {
          color: '#64748b',
          fontSize: 11,
          formatter: (v)=> fmtArppu(v)
        },
        splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.25)' } }
      },
      dataZoom: needZoom ? [
        { type:'inside', xAxisIndex:0, filterMode:'none' },
        { type:'slider', xAxisIndex:0, height:18, bottom:10, filterMode:'none' }
      ] : [],
      series
    };
  }

  function renderTable({ tableEl, tableMetaEl, selectedMonths, selectedCountries, selectedDayTypes, totalsAgg, showYear }){
    if (!tableEl) return;

    const cols = ['country'];
    if (selectedDayTypes.includes('D0')) cols.push('D0');
    if (selectedDayTypes.includes('D7')) cols.push('D7');

    const monthText = selectedMonths.length
      ? selectedMonths.map(m=>monthLabel(m, showYear)).join('、')
      : '—';

    if (tableMetaEl){
      tableMetaEl.textContent = `时间：${monthText}（按筛选月份汇总）｜口径：∑PURCHASE_VALUE / ∑unique_purchase｜币种：同 data.js`;
    }

    const headCells = [];
    headCells.push(`<th class="country">国家</th>`);
    if (cols.includes('D0')) headCells.push(`<th>自然量D0 ARPPU</th>`);
    if (cols.includes('D7')) headCells.push(`<th>自然量D7 ARPPU</th>`);

    const bodyRows = selectedCountries.map((c)=>{
      const cell = totalsAgg && totalsAgg[c] ? totalsAgg[c] : { D0:null, D7:null };
      const tds = [];
      tds.push(`<td class="country">${c}</td>`);
      if (cols.includes('D0')) tds.push(`<td class="num">${fmtArppu(cell.D0)}</td>`);
      if (cols.includes('D7')) tds.push(`<td class="num">${fmtArppu(cell.D7)}</td>`);
      return `<tr>${tds.join('')}</tr>`;
    }).join('');

    tableEl.innerHTML = `
      <thead><tr>${headCells.join('')}</tr></thead>
      <tbody>${bodyRows || ''}</tbody>
    `;
  }

  function getCheckedValues(root, selector){
    if (!root) return [];
    return [...root.querySelectorAll(selector)]
      .filter(el=>el && el.checked)
      .map(el=>String(el.value || ''));
  }

  function setCheckboxes(root, selector, values){
    const set = new Set((Array.isArray(values) ? values : []).map(v=>String(v)));
    if (!root) return;
    for (const el of root.querySelectorAll(selector)){
      const v = String(el.value || '');
      el.checked = set.has(v);
    }
  }

  OVP.registerModule({
    id: moduleId,
    title: 'D0 / D7 ARPPU',
    subtitle: '口径：∑PURCHASE_VALUE / ∑unique_purchase（按筛选月份汇总；币种同 data.js）',
    span: 'full',

    render({ mountEl, rawByMonth, months, latestMonth, utils }){
      injectStyleOnce();

      const allMonths = sortMonths(Array.isArray(months) ? months : Object.keys(rawByMonth || {}), utils);
      const years = uniq(allMonths.map(m=>monthParts(m).y).filter(Boolean));
      const showYear = years.length > 1;

      const detectedCountries = (function(){
        const set = new Set();
        for (const m of allMonths){
          const rows = rawByMonth && rawByMonth[m];
          if (!Array.isArray(rows)) continue;
          for (const r of rows){
            const c = r && r.country ? String(r.country) : '';
            if (c) set.add(c);
          }
        }
        const preferred = COUNTRY_ORDER.filter(c=>set.has(c));
        const others = [...set].filter(c=>!preferred.includes(c)).sort();
        return preferred.concat(others);
      })();

      // Defaults
      const state = {
        months: [latestMonth].filter(Boolean),
        countries: detectedCountries.slice(),
        chartType: 'bar',
        dayTypes: ['D0','D7']
      };
      if (!state.months.length && allMonths.length) state.months = [allMonths[allMonths.length - 1]];
      if (!state.countries.length) state.countries = COUNTRY_ORDER.slice();
      state.months = sortMonths(state.months, utils);

      mountEl.innerHTML = `
        <div class="ovp-module-stack ovp-arppu" id="wrap-${moduleId}">
          <div class="ovp-filters" id="filters-${moduleId}">
            <div class="ovp-filter-group">
              <div class="ovp-filter-label">月份（多选）</div>
              <div class="ovp-filter-options" id="opt-month-${moduleId}">
                ${allMonths.map(m=>{
                  const checked = state.months.includes(m) ? 'checked' : '';
                  return `<label class="ovp-check"><input ${checked} type="checkbox" name="month" value="${m}"><span>${monthLabel(m, showYear)}</span></label>`;
                }).join('')}
              </div>
            </div>

            <div class="ovp-filter-group">
              <div class="ovp-filter-label">国家（多选）</div>
              <div class="ovp-filter-options" id="opt-country-${moduleId}">
                ${detectedCountries.map(c=>{
                  const checked = state.countries.includes(c) ? 'checked' : '';
                  return `<label class="ovp-check"><input ${checked} type="checkbox" name="country" value="${c}"><span>${c}</span></label>`;
                }).join('')}
              </div>
            </div>

            <div class="ovp-filter-group">
              <div class="ovp-filter-label">图表（单选）</div>
              <div class="ovp-filter-options" id="opt-chart-${moduleId}">
                ${CHART_TYPES.map(t=>{
                  const checked = (state.chartType === t.key) ? 'checked' : '';
                  return `<label class="ovp-check"><input ${checked} type="checkbox" name="chartType" value="${t.key}"><span>${t.label}</span></label>`;
                }).join('')}
              </div>
            </div>

            <div class="ovp-filter-group">
              <div class="ovp-filter-label">口径（多选）</div>
              <div class="ovp-filter-options" id="opt-day-${moduleId}">
                ${DAY_TYPES.map(t=>{
                  const checked = state.dayTypes.includes(t.key) ? 'checked' : '';
                  return `<label class="ovp-check"><input ${checked} type="checkbox" name="dayType" value="${t.key}"><span>${t.label}</span></label>`;
                }).join('')}
              </div>
            </div>
          </div>

          <div>
            <div class="ovp-chart" id="chart-${moduleId}" style="height:360px;"></div>
            <div class="ovp-chart-note" id="chart-note-${moduleId}"></div>
          </div>

          <div>
            <div class="ovp-table-meta" id="table-meta-${moduleId}"></div>
            <div class="ovp-table-wrap">
              <table class="ovp-table" id="table-${moduleId}"></table>
            </div>
          </div>

          <div>
            <div class="ovp-insight-head">
              <div class="ovp-insight-title" id="insight-title-${moduleId}">数据分析</div>
              <div class="ovp-insight-sub" id="insight-sub-${moduleId}"></div>
            </div>
            <div class="ovp-insight is-empty" id="insight-${moduleId}">文案待填写：./insights.js</div>
          </div>
        </div>
      `;

      const wrap = mountEl.querySelector(`#wrap-${moduleId}`);
      const monthOpt = wrap.querySelector(`#opt-month-${moduleId}`);
      const countryOpt = wrap.querySelector(`#opt-country-${moduleId}`);
      const chartOpt = wrap.querySelector(`#opt-chart-${moduleId}`);
      const dayOpt = wrap.querySelector(`#opt-day-${moduleId}`);

      const chartDom = wrap.querySelector(`#chart-${moduleId}`);
      const chartNoteEl = wrap.querySelector(`#chart-note-${moduleId}`);

      const tableMetaEl = wrap.querySelector(`#table-meta-${moduleId}`);
      const tableEl = wrap.querySelector(`#table-${moduleId}`);

      const insightEl = wrap.querySelector(`#insight-${moduleId}`);
      const insightSubEl = wrap.querySelector(`#insight-sub-${moduleId}`);

      // ECharts init
      let chart = null;

      function ensureAtLeastOneChecked(container, selector, fallbackValue){
        if (!container) return;
        const checked = container.querySelectorAll(selector + ':checked');
        if (checked.length) return;
        const fallback = container.querySelector(`${selector}[value="${fallbackValue}"]`) || container.querySelector(selector);
        if (fallback) fallback.checked = true;
      }

      function enforceSingleCheckbox(container, selector, keepValue){
        if (!container) return;
        const checked = [...container.querySelectorAll(selector + ':checked')].map(el=>String(el.value||''));
        if (checked.length === 1) return;
        // keep last known
        const keep = keepValue || checked[0] || null;
        for (const el of container.querySelectorAll(selector)){
          el.checked = (String(el.value||'') === String(keep));
        }
      }

      function readStateFromDom(){
        const monthsSel = getCheckedValues(monthOpt, 'input[name="month"]');
        const countriesSel = getCheckedValues(countryOpt, 'input[name="country"]');
        const chartSel = getCheckedValues(chartOpt, 'input[name="chartType"]');
        const daySel = getCheckedValues(dayOpt, 'input[name="dayType"]');

        state.months = sortMonths(monthsSel.length ? monthsSel : state.months, utils);
        state.countries = countriesSel.length ? countriesSel : state.countries;
        state.dayTypes = daySel.length ? daySel : state.dayTypes;

        // chart type: enforce single (keep previous if ambiguous)
        if (chartSel.length === 1){
          state.chartType = chartSel[0];
        } else if (chartSel.length === 0){
          state.chartType = state.chartType || 'bar';
        } else {
          state.chartType = state.chartType || chartSel[chartSel.length - 1];
        }

        // Keep fixed country ordering (plus any extra countries at the end)
        const ordered = [];
        for (const c of detectedCountries){
          if (state.countries.includes(c)) ordered.push(c);
        }
        state.countries = ordered.length ? ordered : state.countries;

        // dayTypes order
        const dtOrdered = [];
        for (const dt of ['D0','D7']){
          if (state.dayTypes.includes(dt)) dtOrdered.push(dt);
        }
        state.dayTypes = dtOrdered.length ? dtOrdered : ['D0','D7'];
      }

      function render(){
        // 1) Read + guard selections
        readStateFromDom();

        // Hard guards: avoid empty
        ensureAtLeastOneChecked(monthOpt, 'input[name="month"]', state.months[0] || (allMonths[allMonths.length - 1] || ''));
        ensureAtLeastOneChecked(countryOpt, 'input[name="country"]', state.countries[0] || (detectedCountries[0] || ''));
        ensureAtLeastOneChecked(dayOpt, 'input[name="dayType"]', state.dayTypes[0] || 'D0');

        enforceSingleCheckbox(chartOpt, 'input[name="chartType"]', state.chartType);

        // Sync DOM in case we auto-adjusted
        setCheckboxes(monthOpt, 'input[name="month"]', state.months);
        setCheckboxes(countryOpt, 'input[name="country"]', state.countries);
        setCheckboxes(dayOpt, 'input[name="dayType"]', state.dayTypes);
        setCheckboxes(chartOpt, 'input[name="chartType"]', [state.chartType]);

        const selectedMonths = sortMonths(state.months, utils);
        const selectedCountries = state.countries.slice();
        const selectedDayTypes = state.dayTypes.slice();

        // 2) Data
        const monthlyAgg = buildMonthlyAgg({ rawByMonth, months: selectedMonths, countries: selectedCountries });
        const totalsAgg = buildTotalsAgg({ rawByMonth, months: selectedMonths, countries: selectedCountries });

        // 3) Table
        renderTable({
          tableEl,
          tableMetaEl,
          selectedMonths,
          selectedCountries,
          selectedDayTypes,
          totalsAgg,
          showYear
        });

        // 4) Insight (multi-month -> 取最新月)
        const insightMonth = selectedMonths.length ? selectedMonths[selectedMonths.length - 1] : (latestMonth || null);
        if (insightSubEl){
          const monthText = insightMonth ? monthLabel(insightMonth, showYear) : '—';
          const suffix = selectedMonths.length > 1 ? '（多选取最新）' : '';
          insightSubEl.textContent = `解读月份：${monthText}${suffix}`;
        }
        if (OVP && OVP.ui && typeof OVP.ui.renderInsight === 'function'){
          OVP.ui.renderInsight({ moduleId, month: insightMonth, el: insightEl });
        }

        // 5) Chart
        if (!window.echarts){
          if (chartNoteEl) chartNoteEl.textContent = 'ECharts 未加载，图表不可用。';
          if (chartDom) chartDom.innerHTML = '<div class="ovp-placeholder">ECharts 未加载。</div>';
          return;
        }

        if (!chart){
          chart = window.echarts.init(chartDom);
          // avoid multiple listeners per hot reload
          if (mountEl.__ovp_arppu_resize_handler){
            window.removeEventListener('resize', mountEl.__ovp_arppu_resize_handler);
          }
          mountEl.__ovp_arppu_resize_handler = ()=>{ try{ chart && chart.resize(); }catch(_e){} };
          window.addEventListener('resize', mountEl.__ovp_arppu_resize_handler);
        }

        let option;
        if (state.chartType === 'line'){
          const dailyAgg = buildDailyAgg({ rawByMonth, months: selectedMonths, countries: selectedCountries });
          option = buildLineOption({
            selectedCountries,
            selectedDayTypes,
            dailyAgg
          });

          if (chartNoteEl){
            const monthText = selectedMonths.map(m=>monthLabel(m, showYear)).join('、');
            chartNoteEl.textContent = `折线图：日级 ARPPU（同国家 D0=虚线 / D7=实线；同色）。时间：${monthText || '—'}；币种同 data.js。`;
          }
        } else {
          option = buildBarOption({
            selectedMonths,
            selectedCountries,
            selectedDayTypes,
            monthlyAgg,
            showYear
          });

          if (chartNoteEl){
            const monthText = selectedMonths.map(m=>monthLabel(m, showYear)).join('、');
            chartNoteEl.textContent = `柱状图：月度 ARPPU（同月份同色；D7 加斜线阴影）。时间：${monthText || '—'}；币种同 data.js。`;
          }
        }

        chart.setOption(option, true);
      }

      // Bind events
      const onChange = (e)=>{
        const t = e && e.target ? e.target : null;
        if (!t || t.tagName !== 'INPUT') return;

        if (t.name === 'chartType'){
          // single-select guard
          for (const el of chartOpt.querySelectorAll('input[name="chartType"]')){
            if (el !== t) el.checked = false;
          }
          t.checked = true;
        }

        // prevent empty selection (months/countries/dayTypes)
        if (t.name === 'month'){
          ensureAtLeastOneChecked(monthOpt, 'input[name="month"]', t.value);
        } else if (t.name === 'country'){
          ensureAtLeastOneChecked(countryOpt, 'input[name="country"]', t.value);
        } else if (t.name === 'dayType'){
          ensureAtLeastOneChecked(dayOpt, 'input[name="dayType"]', t.value);
        }

        render();
      };

      wrap.querySelector(`#filters-${moduleId}`).addEventListener('change', onChange);

      // First render
      render();
    }
  });
})();
