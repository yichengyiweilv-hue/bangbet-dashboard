(function(){
  const moduleId = 'retention';

  const COUNTRY_ORDER = ['GH','KE','NG','TZ','UG'];
  const METRIC_ORDER = ['d1','d7'];

  const METRICS = {
    d1: { key:'d1', label:'次留', short:'D1', field:'D1_retained_users' },
    d7: { key:'d7', label:'七留', short:'D7', field:'D7_retained_users', hatch:true },
  };

  const CHART_TYPES = {
    bar: '月度柱状图',
    line: '日级折线图',
  };

  const STYLE_ID = 'ovp-style-retention';

  function injectStyle(){
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      /* ============= Module: retention ============= */
      .ovp-ret-filters{
        border:1px solid rgba(148, 163, 184, 0.60);
        border-radius:12px;
        background: rgba(249, 250, 251, 0.90);
        padding:10px 12px;
      }
      .ovp-ret-row{
        display:flex;
        flex-wrap:wrap;
        gap:10px 14px;
        align-items:flex-start;
      }
      .ovp-ret-group{
        display:flex;
        flex-wrap:wrap;
        gap:6px 8px;
        align-items:center;
        min-width: 260px;
      }
      .ovp-ret-label{
        font-size:11px;
        color:var(--muted);
        margin-right:2px;
        white-space:nowrap;
      }
      .ovp-ret-chip{
        display:inline-flex;
        align-items:center;
        gap:6px;
        border:1px solid rgba(148, 163, 184, 0.55);
        border-radius:999px;
        padding:3px 9px;
        font-size:11px;
        color:var(--text);
        cursor:pointer;
        user-select:none;
        background: rgba(255,255,255,0.80);
      }
      .ovp-ret-chip input{
        width:12px;
        height:12px;
        margin:0;
        accent-color: var(--ovp-blue);
      }
      .ovp-ret-chip.is-checked{
        border-color: rgba(37, 99, 235, 0.55);
        background: rgba(37, 99, 235, 0.10);
      }
      .ovp-ret-chip-text{
        line-height:1.15;
      }

      .ovp-ret-tablewrap{
        border:1px solid rgba(148, 163, 184, 0.60);
        border-radius:12px;
        overflow:hidden;
        background: rgba(255,255,255,0.92);
      }
      .ovp-ret-table{
        width:100%;
        border-collapse:collapse;
        font-size:11px;
      }
      .ovp-ret-table th{
        text-align:left;
        font-weight:600;
        color:var(--muted);
        background: rgba(249, 250, 251, 0.90);
        border-bottom:1px solid rgba(148, 163, 184, 0.35);
        padding:8px 10px;
        white-space:nowrap;
      }
      .ovp-ret-table td{
        padding:8px 10px;
        border-bottom:1px solid rgba(148, 163, 184, 0.18);
        color:var(--text);
        white-space:nowrap;
      }
      .ovp-ret-table td.num,
      .ovp-ret-table th.num{
        text-align:right;
      }
      .ovp-ret-table tr:last-child td{
        border-bottom:0;
      }

      .ovp-ret-insight-head{
        font-size:11px;
        color:var(--muted);
        margin: 2px 0 -6px;
      }
      /* ============= /Module: retention ============= */
    `;
    document.head.appendChild(style);
  }

  function safeNum(v, utils){
    if (utils && typeof utils.safeNumber === 'function'){
      return utils.safeNumber(v);
    }
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }

  function add(sum, v, utils){
    const n = safeNum(v, utils);
    return sum + (n === null ? 0 : n);
  }

  function ratio(num, den){
    if (!Number.isFinite(num) || !Number.isFinite(den) || den <= 0) return null;
    return num / den;
  }

  function sortMonths(ms){
    return (Array.isArray(ms) ? ms.slice() : []).sort((a,b)=>String(a).localeCompare(String(b)));
  }

  function sortByOrder(list, order){
    const want = Array.isArray(order) ? order : [];
    const set = new Set(list);
    const inOrder = want.filter(x => set.has(x));
    const rest = list.filter(x => !want.includes(x)).sort((a,b)=>String(a).localeCompare(String(b)));
    return inOrder.concat(rest);
  }

  function pickColorByIndex(idx){
    const palette = [
      '#2563eb', '#16a34a', '#f59e0b', '#ef4444', '#8b5cf6',
      '#14b8a6', '#0ea5e9', '#f97316', '#22c55e', '#64748b'
    ];
    return palette[Math.abs(idx) % palette.length];
  }

  function monthLabel(month, { short=false, multiYear=false } = {}){
    if (typeof month !== 'string') return String(month || '');
    if (!/^\d{4}-\d{2}$/.test(month)) return month;
    if (multiYear) return month;
    const mm = String(parseInt(month.slice(5), 10));
    return short ? `${mm}月` : month;
  }

  function buildChipHTML({ value, label, checked, name, type='checkbox', group }){
    const safeVal = String(value).replace(/"/g,'&quot;');
    const safeLab = String(label).replace(/</g,'&lt;').replace(/>/g,'&gt;');
    const safeName = name ? String(name).replace(/"/g,'&quot;') : '';
    return `
      <label class="ovp-ret-chip ${checked ? 'is-checked' : ''}" data-group="${group}">
        <input type="${type}" ${name ? `name="${safeName}"` : ''} value="${safeVal}" ${checked ? 'checked' : ''} />
        <span class="ovp-ret-chip-text">${safeLab}</span>
      </label>
    `;
  }

  function syncChipClass(chipEl){
    const input = chipEl ? chipEl.querySelector('input') : null;
    if (!input) return;
    chipEl.classList.toggle('is-checked', !!input.checked);
  }

  function computeMonthlyAgg({ rawByMonth, months, countries, utils }){
    const monthAgg = {}; // month -> country -> { reg, d1, d7 }
    const cSet = new Set(countries);

    for (const m of months){
      const rows = Array.isArray(rawByMonth && rawByMonth[m]) ? rawByMonth[m] : [];
      const byC = {};
      for (const c of countries){
        byC[c] = { reg: 0, d1: 0, d7: 0 };
      }

      for (const r of rows){
        if (!r) continue;
        const c = r.country;
        if (!c || !cSet.has(c)) continue;

        const bucket = byC[c] || (byC[c] = { reg:0, d1:0, d7:0 });
        bucket.reg = add(bucket.reg, r.registration, utils);
        bucket.d1  = add(bucket.d1,  r.D1_retained_users, utils);
        bucket.d7  = add(bucket.d7,  r.D7_retained_users, utils);
      }

      monthAgg[m] = byC;
    }

    return monthAgg;
  }

  function computeDailyAgg({ rawByMonth, months, countries, utils }){
    const cSet = new Set(countries);
    const datesSet = new Set();
    const byKey = new Map(); // country|date -> {reg,d1,d7}

    for (const m of months){
      const rows = Array.isArray(rawByMonth && rawByMonth[m]) ? rawByMonth[m] : [];
      for (const r of rows){
        if (!r) continue;
        const c = r.country;
        const d = r.date;
        if (!c || !d || !cSet.has(c)) continue;

        const key = `${c}|${d}`;
        let bucket = byKey.get(key);
        if (!bucket){
          bucket = { reg:0, d1:0, d7:0 };
          byKey.set(key, bucket);
        }
        bucket.reg = add(bucket.reg, r.registration, utils);
        bucket.d1  = add(bucket.d1,  r.D1_retained_users, utils);
        bucket.d7  = add(bucket.d7,  r.D7_retained_users, utils);
        datesSet.add(d);
      }
    }

    const dates = Array.from(datesSet).sort((a,b)=>String(a).localeCompare(String(b)));
    const idx = new Map(dates.map((d,i)=>[d,i]));
    const series = {};
    for (const c of countries){
      series[c] = {
        d1: new Array(dates.length).fill(null),
        d7: new Array(dates.length).fill(null),
      };
    }

    for (const [key, bucket] of byKey.entries()){
      const [c, d] = key.split('|');
      const i = idx.get(d);
      if (i === undefined || !series[c]) continue;

      series[c].d1[i] = ratio(bucket.d1, bucket.reg);
      series[c].d7[i] = ratio(bucket.d7, bucket.reg);
    }

    return { dates, series };
  }

  function computeCountryTotals({ monthAgg, months, countries }){
    const totals = {};
    for (const c of countries){
      totals[c] = { reg:0, d1:0, d7:0 };
    }
    for (const m of months){
      const byC = monthAgg[m] || {};
      for (const c of countries){
        const b = byC[c];
        if (!b) continue;
        totals[c].reg += b.reg || 0;
        totals[c].d1  += b.d1  || 0;
        totals[c].d7  += b.d7  || 0;
      }
    }
    return totals;
  }

  function buildEmptyOption(message){
    return {
      grid: { left: 40, right: 18, top: 20, bottom: 30 },
      xAxis: { type: 'category', data: [] },
      yAxis: { type: 'value' },
      series: [],
      graphic: [{
        type: 'text',
        left: 'center',
        top: 'middle',
        style: {
          text: message || '暂无数据',
          fill: '#6b7280',
          fontSize: 12,
          fontWeight: 500
        }
      }]
    };
  }

  function buildBarOption({ months, countries, metrics, monthAgg }){
    const monthColors = {};
    months.forEach((m, i)=>{ monthColors[m] = pickColorByIndex(i); });

    const series = [];
    for (const m of months){
      const color = monthColors[m];
      const byC = monthAgg[m] || {};
      const baseName = m;

      if (metrics.includes('d1')){
        series.push({
          name: `${baseName} 次留`,
          type: 'bar',
          emphasis: { focus: 'series' },
          barMaxWidth: 22,
          itemStyle: { color },
          data: countries.map(c => {
            const b = byC[c];
            return b ? ratio(b.d1, b.reg) : null;
          })
        });
      }
      if (metrics.includes('d7')){
        series.push({
          name: `${baseName} 七留`,
          type: 'bar',
          emphasis: { focus: 'series' },
          barMaxWidth: 22,
          itemStyle: {
            color,
            decal: {
              symbol: 'rect',
              symbolSize: 1,
              dashArrayX: [6, 4],
              dashArrayY: [1, 0],
              rotation: Math.PI / 4,
              color: 'rgba(255,255,255,0.55)'
            }
          },
          data: countries.map(c => {
            const b = byC[c];
            return b ? ratio(b.d7, b.reg) : null;
          })
        });
      }
    }

    const hasData = series.some(s => (s.data || []).some(v => v !== null && Number.isFinite(v)));
    if (!hasData) return buildEmptyOption('筛选条件下无可用数据');

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        valueFormatter: (v)=> (v == null || !Number.isFinite(v)) ? '—' : `${(v*100).toFixed(2)}%`
      },
      legend: {
        type: 'scroll',
        top: 6,
        left: 6,
        right: 6,
        itemWidth: 10,
        itemHeight: 10
      },
      grid: { left: 46, right: 18, top: 44, bottom: 36, containLabel: true },
      xAxis: {
        type: 'category',
        data: countries,
        axisTick: { alignWithLabel: true },
        axisLabel: { color: '#475569' }
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 1,
        axisLabel: { formatter: (v)=> `${(Number(v)*100).toFixed(0)}%` },
        splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.20)' } }
      },
      series
    };
  }

  function buildLineOption({ dates, countries, metrics, daily }){
    const colorByCountry = {};
    countries.forEach((c, i)=>{ colorByCountry[c] = pickColorByIndex(i); });

    const series = [];
    for (const c of countries){
      const color = colorByCountry[c];
      const payload = daily.series[c] || {};
      if (metrics.includes('d1')){
        series.push({
          name: `${c} 次留`,
          type: 'line',
          showSymbol: false,
          smooth: false,
          connectNulls: false,
          emphasis: { focus: 'series' },
          lineStyle: { width: 2, type: 'dashed', color },
          itemStyle: { color },
          data: payload.d1 || []
        });
      }
      if (metrics.includes('d7')){
        series.push({
          name: `${c} 七留`,
          type: 'line',
          showSymbol: false,
          smooth: false,
          connectNulls: false,
          emphasis: { focus: 'series' },
          lineStyle: { width: 2, type: 'solid', color },
          itemStyle: { color },
          data: payload.d7 || []
        });
      }
    }

    const hasData = series.some(s => (s.data || []).some(v => v !== null && Number.isFinite(v)));
    if (!hasData) return buildEmptyOption('筛选条件下无可用数据');

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        valueFormatter: (v)=> (v == null || !Number.isFinite(v)) ? '—' : `${(v*100).toFixed(2)}%`
      },
      legend: {
        type: 'scroll',
        top: 6,
        left: 6,
        right: 6,
        itemWidth: 10,
        itemHeight: 10
      },
      grid: { left: 46, right: 18, top: 44, bottom: 46, containLabel: true },
      xAxis: {
        type: 'category',
        data: dates,
        boundaryGap: false,
        axisLabel: {
          formatter: (v)=> (typeof v === 'string' && v.length >= 10) ? v.slice(5) : v,
          color: '#475569'
        }
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 1,
        axisLabel: { formatter: (v)=> `${(Number(v)*100).toFixed(0)}%` },
        splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.20)' } }
      },
      series
    };
  }

  function renderTable({ tableWrapEl, totals, countries, metrics, utils }){
    if (!tableWrapEl) return;

    const cols = METRIC_ORDER.filter(k => metrics.includes(k));
    const headCells = [
      `<th>国家</th>`,
      ...cols.map(k => `<th class="num">自然量${METRICS[k].label}</th>`)
    ].join('');

    const bodyRows = countries.map(c => {
      const t = totals[c] || { reg:0, d1:0, d7:0 };
      const d1 = ratio(t.d1, t.reg);
      const d7 = ratio(t.d7, t.reg);
      const cells = [
        `<td>${c}</td>`,
        ...cols.map(k => {
          const v = (k === 'd1') ? d1 : d7;
          const txt = utils && utils.fmtPct ? utils.fmtPct(v, 2) : (v == null ? '—' : `${(v*100).toFixed(2)}%`);
          return `<td class="num">${txt}</td>`;
        })
      ].join('');
      return `<tr>${cells}</tr>`;
    }).join('');

    tableWrapEl.innerHTML = `
      <div class="ovp-ret-tablewrap">
        <table class="ovp-ret-table">
          <thead><tr>${headCells}</tr></thead>
          <tbody>${bodyRows || ''}</tbody>
        </table>
      </div>
    `;
  }

  OVP.registerModule({
    id: moduleId,
    title: '次留 / 七留',
    subtitle: '口径：D1_retained_users / registration；D7_retained_users / registration（单位：%）',
    span: 'full',

    render({ mountEl, rawByMonth, months, latestMonth, utils }){
      injectStyle();

      const { chartEl, chartNoteEl, insightEl } = OVP.ui.mountModule(mountEl, { moduleId, chartHeight: 340 });
      const stack = mountEl.querySelector('.ovp-module-stack');
      const chartBlock = stack ? stack.firstElementChild : null;

      // State (defaults)
      const allMonths = sortMonths(months || []);
      const allCountries = COUNTRY_ORDER.slice();

      const yearSet = new Set(allMonths.map(m => (typeof m === 'string' ? m.slice(0,4) : '')));
      const multiYear = yearSet.size > 1;

      const state = {
        months: new Set([latestMonth || allMonths[allMonths.length - 1]].filter(Boolean)),
        countries: new Set(allCountries),
        chartType: 'bar',
        metrics: new Set(['d1','d7'])
      };

      // Build filters
      const filterEl = document.createElement('div');
      filterEl.className = 'ovp-ret-filters';
      filterEl.innerHTML = `
        <div class="ovp-ret-row">
          <div class="ovp-ret-group" data-group="months">
            <div class="ovp-ret-label">月份</div>
            ${allMonths.map(m => buildChipHTML({
              group: 'months',
              value: m,
              label: monthLabel(m, { short:true, multiYear }),
              checked: state.months.has(m),
              type: 'checkbox'
            })).join('')}
          </div>

          <div class="ovp-ret-group" data-group="countries">
            <div class="ovp-ret-label">国家</div>
            ${allCountries.map(c => buildChipHTML({
              group: 'countries',
              value: c,
              label: c,
              checked: state.countries.has(c),
              type: 'checkbox'
            })).join('')}
          </div>

          <div class="ovp-ret-group" data-group="chartType">
            <div class="ovp-ret-label">图形</div>
            ${Object.entries(CHART_TYPES).map(([k, lab]) => buildChipHTML({
              group: 'chartType',
              value: k,
              label: lab,
              checked: state.chartType === k,
              type: 'radio',
              name: `chartType-${moduleId}`
            })).join('')}
          </div>

          <div class="ovp-ret-group" data-group="metrics">
            <div class="ovp-ret-label">指标</div>
            ${METRIC_ORDER.map(k => buildChipHTML({
              group: 'metrics',
              value: k,
              label: METRICS[k].label,
              checked: state.metrics.has(k),
              type: 'checkbox'
            })).join('')}
          </div>
        </div>
      `;

      if (stack && chartBlock){
        stack.insertBefore(filterEl, chartBlock);
      }

      // Table + Insight head (place between chart and insight)
      const tableWrapEl = document.createElement('div');
      const insightHeadEl = document.createElement('div');
      insightHeadEl.className = 'ovp-ret-insight-head';
      insightHeadEl.textContent = '';

      if (stack && insightEl){
        stack.insertBefore(tableWrapEl, insightEl);
        stack.insertBefore(insightHeadEl, insightEl);
      }

      // Chart init
      let chart = null;
      const hasEcharts = !!(window.echarts && chartEl);

      if (hasEcharts){
        const skeleton = chartEl.querySelector('.ovp-skeleton');
        if (skeleton) skeleton.remove();
        chartEl.classList.remove('is-empty');

        chart = window.echarts.init(chartEl);

        const onResize = ()=>{ try{ chart && chart.resize(); }catch(_){} };
        window.addEventListener('resize', onResize);
      } else {
        if (chartNoteEl) chartNoteEl.textContent = 'ECharts 未加载：图表区仅显示表格与文案。';
      }

      function selectedInsightMonth(selMonths){
        const sorted = sortMonths(selMonths);
        return sorted.length ? sorted[sorted.length - 1] : (latestMonth || null);
      }

      function updateInsight(month){
        const m = month || latestMonth || '';
        insightHeadEl.textContent = m ? `解读月份：${m}` : '解读月份：—';
        OVP.ui.renderInsight({ moduleId, month: m, el: insightEl });
      }

      function refresh(){
        const selMonths = sortMonths(Array.from(state.months));
        const selCountries = sortByOrder(Array.from(state.countries), COUNTRY_ORDER);
        const selMetrics = METRIC_ORDER.filter(k => state.metrics.has(k));
        const chartType = state.chartType;

        // Table + bar chart share "monthly totals"口径（按注册加权）
        const monthAgg = computeMonthlyAgg({ rawByMonth, months: selMonths, countries: selCountries, utils });
        const totals = computeCountryTotals({ monthAgg, months: selMonths, countries: selCountries });

        renderTable({ tableWrapEl, totals, countries: selCountries, metrics: selMetrics, utils });

        // Insight month uses latest selected month
        updateInsight(selectedInsightMonth(selMonths));

        // Note
        if (chartNoteEl){
          const typeTxt = chartType === 'bar' ? '月度汇总（国家为横轴）' : '日级折线（国家分线）';
          chartNoteEl.textContent = `口径：D1_retained_users/registration；D7_retained_users/registration（单位：%）。展示：${typeTxt}。筛选：月份 ${selMonths.join(', ') || '—'}；国家 ${selCountries.join('/') || '—'}。`;
        }

        // Chart
        if (!chart) return;

        if (chartType === 'bar'){
          const option = buildBarOption({
            months: selMonths,
            countries: selCountries,
            metrics: selMetrics,
            monthAgg
          });
          chart.setOption(option, true);
          return;
        }

        // line
        const daily = computeDailyAgg({ rawByMonth, months: selMonths, countries: selCountries, utils });
        const option = buildLineOption({
          dates: daily.dates,
          countries: selCountries,
          metrics: selMetrics,
          daily
        });
        chart.setOption(option, true);
      }

      function bindFilters(){
        const chips = Array.from(filterEl.querySelectorAll('.ovp-ret-chip'));
        for (const chip of chips){
          const input = chip.querySelector('input');
          if (!input) continue;

          input.addEventListener('change', ()=>{
            const group = chip.getAttribute('data-group');
            const val = input.value;

            if (group === 'chartType'){
              if (!input.checked) return;
              state.chartType = val;
              for (const el of filterEl.querySelectorAll('.ovp-ret-chip[data-group="chartType"]')){
                syncChipClass(el);
              }
              refresh();
              return;
            }

            if (group === 'months'){
              if (input.checked) state.months.add(val);
              else state.months.delete(val);

              if (state.months.size === 0){
                state.months.add(val);
                input.checked = true;
              }
              syncChipClass(chip);
              refresh();
              return;
            }

            if (group === 'countries'){
              if (input.checked) state.countries.add(val);
              else state.countries.delete(val);

              if (state.countries.size === 0){
                state.countries.add(val);
                input.checked = true;
              }
              syncChipClass(chip);
              refresh();
              return;
            }

            if (group === 'metrics'){
              if (input.checked) state.metrics.add(val);
              else state.metrics.delete(val);

              if (state.metrics.size === 0){
                state.metrics.add(val);
                input.checked = true;
              }
              syncChipClass(chip);
              refresh();
              return;
            }

            syncChipClass(chip);
          });
        }
      }

      bindFilters();
      refresh();
    }
  });
})();
