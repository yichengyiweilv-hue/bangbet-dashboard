(function(){
  'use strict';

  const moduleId = 'payrate';
  const COUNTRY_ORDER = ['GH','KE','NG','TZ','UG'];
  const METRIC_ORDER = ['D0','D7'];

  function injectStyle(){
    const styleId = 'ovp-style-payrate';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* ===========================
         Payrate module (D0/D7 付费率)
         =========================== */
      .ovp-pr-filters{
        display:flex;
        flex-wrap:wrap;
        gap:10px 14px;
        padding:10px 12px;
        border:1px solid rgba(148, 163, 184, 0.60);
        border-radius:12px;
        background: rgba(255,255,255,0.72);
      }
      .ovp-pr-group{
        display:flex;
        flex-direction:column;
        gap:6px;
        min-width: 220px;
      }
      .ovp-pr-label{
        font-size:11px;
        color: var(--muted);
        line-height:1;
        margin-top:2px;
      }
      .ovp-pr-options{
        display:flex;
        flex-wrap:wrap;
        gap:8px 10px;
      }
      .ovp-pr-option{
        display:inline-flex;
        align-items:center;
        gap:6px;
        padding:4px 8px;
        border:1px solid rgba(148, 163, 184, 0.45);
        border-radius:999px;
        background: rgba(249, 250, 251, 0.92);
        color: var(--text);
        font-size:12px;
        cursor:pointer;
        user-select:none;
      }
      .ovp-pr-option input{
        margin:0;
        width:14px;
        height:14px;
        accent-color: #2563eb;
      }

      .ovp-pr-table-wrap{
        border:1px solid rgba(148, 163, 184, 0.60);
        border-radius:12px;
        background: rgba(249, 250, 251, 0.90);
        overflow:hidden;
      }
      .ovp-pr-table-scroll{
        overflow:auto;
      }
      .ovp-pr-table{
        width:100%;
        border-collapse:separate;
        border-spacing:0;
        min-width: 520px;
      }
      .ovp-pr-table thead th{
        position:sticky;
        top:0;
        background: rgba(255,255,255,0.96);
        z-index:1;
      }
      .ovp-pr-table th,
      .ovp-pr-table td{
        padding:10px 10px;
        border-bottom:1px solid rgba(148, 163, 184, 0.30);
        text-align:right;
        font-size:12px;
        white-space:nowrap;
      }
      .ovp-pr-table th:first-child,
      .ovp-pr-table td:first-child{
        text-align:left;
        padding-left:12px;
      }
      .ovp-pr-table tbody tr:last-child td{
        border-bottom:none;
      }
      .ovp-pr-table .ovp-pr-country{
        font-weight:600;
      }

      .ovp-pr-insight-head{
        display:flex;
        align-items:baseline;
        justify-content:space-between;
        gap:12px;
        padding: 4px 2px 0;
      }
      .ovp-pr-insight-title{
        font-size:12px;
        color: var(--text);
        font-weight:600;
      }
      .ovp-pr-insight-month{
        font-size:11px;
        color: var(--muted);
      }
    `;
    document.head.appendChild(style);
  }

  function cssVar(name, fallback){
    try{
      const v = getComputedStyle(document.documentElement).getPropertyValue(name);
      const s = (v || '').trim();
      return s || fallback;
    }catch(_){
      return fallback;
    }
  }

  function num(v){
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  function dateToUTCms(dateStr){
    const s = String(dateStr || '');
    const parts = s.split('-').map(x=>Number(x));
    if (parts.length !== 3) return null;
    const [y,m,d] = parts;
    if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return null;
    return Date.UTC(y, m-1, d);
  }

  function fmtDateUTC(ms){
    if (!Number.isFinite(ms)) return '';
    const dt = new Date(ms);
    const y = dt.getUTCFullYear();
    const m = String(dt.getUTCMonth() + 1).padStart(2,'0');
    const d = String(dt.getUTCDate()).padStart(2,'0');
    return `${y}-${m}-${d}`;
  }

  function fmtMDUTC(ms){
    if (!Number.isFinite(ms)) return '';
    const dt = new Date(ms);
    const m = String(dt.getUTCMonth() + 1).padStart(2,'0');
    const d = String(dt.getUTCDate()).padStart(2,'0');
    return `${m}-${d}`;
  }

  function formatMonthSummary(ms){
    const arr = Array.isArray(ms) ? ms.filter(Boolean) : [];
    if (!arr.length) return '—';
    if (arr.length <= 3) return arr.join('、');
    const first = arr[0];
    const last = arr[arr.length - 1];
    return `${first} ~ ${last}（${arr.length}个月）`;
  }

  function computeCountryAgg(rawByMonth, months, countries){
    const byCountry = {};
    for (const c of countries){
      byCountry[c] = { registration: 0, d0Payers: 0, d7Payers: 0, d0Rate: null, d7Rate: null };
    }

    for (const m of months){
      const rows = (rawByMonth && Array.isArray(rawByMonth[m])) ? rawByMonth[m] : [];
      for (const r of rows){
        const c = r && r.country;
        if (!byCountry[c]) continue;
        byCountry[c].registration += num(r.registration);
        byCountry[c].d0Payers += num(r.D0_unique_purchase);
        byCountry[c].d7Payers += num(r.D7_unique_purchase);
      }
    }

    for (const c of Object.keys(byCountry)){
      const row = byCountry[c];
      const reg = row.registration;
      row.d0Rate = reg > 0 ? (row.d0Payers / reg) : null;
      row.d7Rate = reg > 0 ? (row.d7Payers / reg) : null;
    }

    return byCountry;
  }

  function computeDailyByCountry(rawByMonth, months, countries){
    const wanted = new Set(countries);
    const bucket = new Map(); // key: country|date(utc ms)

    for (const m of months){
      const rows = (rawByMonth && Array.isArray(rawByMonth[m])) ? rawByMonth[m] : [];
      for (const r of rows){
        const c = r && r.country;
        if (!wanted.has(c)) continue;

        const t = dateToUTCms(r.date);
        if (!Number.isFinite(t)) continue;

        const key = `${c}|${t}`;
        let o = bucket.get(key);
        if (!o){
          o = { country: c, t, registration: 0, d0Payers: 0, d7Payers: 0 };
          bucket.set(key, o);
        }
        o.registration += num(r.registration);
        o.d0Payers += num(r.D0_unique_purchase);
        o.d7Payers += num(r.D7_unique_purchase);
      }
    }

    const out = {};
    for (const c of countries){
      out[c] = { D0: [], D7: [] };
    }

    for (const o of bucket.values()){
      const reg = o.registration;
      const d0 = reg > 0 ? (o.d0Payers / reg) : null;
      const d7 = reg > 0 ? (o.d7Payers / reg) : null;
      if (!out[o.country]) continue;
      out[o.country].D0.push([o.t, d0]);
      out[o.country].D7.push([o.t, d7]);
    }

    for (const c of Object.keys(out)){
      out[c].D0.sort((a,b)=>a[0]-b[0]);
      out[c].D7.sort((a,b)=>a[0]-b[0]);
    }

    return out;
  }

  function renderTable(tableEl, aggByCountry, countries, metrics, utils){
    if (!tableEl) return;

    const showD0 = metrics.includes('D0');
    const showD7 = metrics.includes('D7');

    const headCells = [
      '<th>国家</th>',
      showD0 ? '<th>自然量D0付费率</th>' : '',
      showD7 ? '<th>自然量D7付费率</th>' : '',
    ].join('');

    const bodyRows = countries.map(c=>{
      const r = aggByCountry[c] || {};
      const cells = [
        `<td class="ovp-pr-country">${c}</td>`,
        showD0 ? `<td>${utils.fmtPct(r.d0Rate, 2)}</td>` : '',
        showD7 ? `<td>${utils.fmtPct(r.d7Rate, 2)}</td>` : '',
      ].join('');
      return `<tr>${cells}</tr>`;
    }).join('');

    tableEl.innerHTML = `
      <thead><tr>${headCells}</tr></thead>
      <tbody>${bodyRows}</tbody>
    `;
  }

  function buildBarOption({ aggByCountry, countries, metrics, theme, utils }){
    const baseColor = theme.blue;

    const series = [];
    if (metrics.includes('D0')){
      series.push({
        name: 'D0',
        type: 'bar',
        data: countries.map(c => (aggByCountry[c] ? aggByCountry[c].d0Rate : null)),
        barMaxWidth: 34,
        itemStyle: { color: baseColor },
      });
    }
    if (metrics.includes('D7')){
      series.push({
        name: 'D7',
        type: 'bar',
        data: countries.map(c => (aggByCountry[c] ? aggByCountry[c].d7Rate : null)),
        barMaxWidth: 34,
        itemStyle: {
          color: baseColor,
          decal: {
            symbol: 'rect',
            dashArrayX: [1, 0],
            dashArrayY: [3, 6],
            rotation: Math.PI / 4,
            color: 'rgba(255,255,255,0.45)',
          }
        },
      });
    }

    return {
      animationDuration: 350,
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params)=>{
          if (!Array.isArray(params) || !params.length) return '';
          const c = params[0].axisValue;
          const row = aggByCountry[c] || {};
          const reg = row.registration;
          const lines = [
            `<div style="margin-bottom:4px;"><strong>${c}</strong></div>`,
            `<div style="color:${theme.muted};margin-bottom:6px;">registration: ${utils.fmtInt(reg)}</div>`,
          ];
          for (const p of params){
            const v = (p.data === null || p.data === undefined) ? null : Number(p.data);
            const pct = Number.isFinite(v) ? `${(v*100).toFixed(2)}%` : '—';
            const nume = (p.seriesName === 'D0') ? row.d0Payers : row.d7Payers;
            lines.push(
              `<div>${p.marker}${p.seriesName}: ${pct} <span style="color:${theme.muted};">(${utils.fmtInt(nume)} / ${utils.fmtInt(reg)})</span></div>`
            );
          }
          return lines.join('');
        }
      },
      legend: {
        top: 0,
        textStyle: { color: theme.muted, fontSize: 11 },
      },
      grid: { left: 44, right: 22, top: 34, bottom: 30, containLabel: true },
      xAxis: {
        type: 'category',
        data: countries,
        axisLine: { lineStyle: { color: theme.border } },
        axisTick: { alignWithLabel: true },
        axisLabel: { color: theme.muted, fontSize: 11 },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: theme.muted, fontSize: 11, formatter: (v)=>`${(Number(v)*100).toFixed(0)}%` },
        splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.25)' } },
      },
      series,
    };
  }

  function buildLineOption({ dailyByCountry, countries, metrics, theme, countryColors }){
    const legendData = [];
    const series = [];

    for (const c of countries){
      const color = countryColors[c] || theme.blue;
      const src = dailyByCountry[c] || { D0: [], D7: [] };

      if (metrics.includes('D0')){
        legendData.push(`${c} D0`);
        series.push({
          name: `${c} D0`,
          type: 'line',
          data: src.D0,
          showSymbol: false,
          connectNulls: true,
          lineStyle: { type: 'dashed', width: 2, color },
          itemStyle: { color },
          emphasis: { focus: 'series' },
        });
      }
      if (metrics.includes('D7')){
        legendData.push(`${c} D7`);
        series.push({
          name: `${c} D7`,
          type: 'line',
          data: src.D7,
          showSymbol: false,
          connectNulls: true,
          lineStyle: { type: 'solid', width: 2, color },
          itemStyle: { color },
          emphasis: { focus: 'series' },
        });
      }
    }

    return {
      animationDuration: 350,
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'line' },
        formatter: (params)=>{
          if (!Array.isArray(params) || !params.length) return '';
          const ts = Number(params[0].axisValue);
          const date = fmtDateUTC(ts);
          const lines = [`<div style="margin-bottom:4px;"><strong>${date}</strong></div>`];
          for (const p of params){
            const v = Array.isArray(p.data) ? p.data[1]
              : (Array.isArray(p.value) ? p.value[1] : null);
            const pct = Number.isFinite(v) ? `${(v*100).toFixed(2)}%` : '—';
            lines.push(`<div>${p.marker}${p.seriesName}: ${pct}</div>`);
          }
          return lines.join('');
        }
      },
      legend: {
        type: 'scroll',
        top: 0,
        data: legendData,
        textStyle: { color: theme.muted, fontSize: 11 },
      },
      grid: { left: 48, right: 22, top: 44, bottom: 32, containLabel: true },
      xAxis: {
        type: 'time',
        axisLine: { lineStyle: { color: theme.border } },
        axisTick: { show: false },
        axisLabel: { color: theme.muted, fontSize: 11, formatter: (v)=>fmtMDUTC(Number(v)) },
        splitLine: { show: false },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: theme.muted, fontSize: 11, formatter: (v)=>`${(Number(v)*100).toFixed(0)}%` },
        splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.25)' } },
      },
      series,
    };
  }

  function checkboxHtml(group, value, checked, label){
    const id = `${moduleId}-${group}-${String(value).replace(/[^a-zA-Z0-9_-]/g,'_')}`;
    return `
      <label class="ovp-pr-option" for="${id}">
        <input id="${id}" type="checkbox" data-group="${group}" value="${value}" ${checked ? 'checked' : ''} />
        <span>${label}</span>
      </label>
    `;
  }

  OVP.registerModule({
    id: moduleId,
    title: 'D0 / D7 付费率',
    subtitle: '口径：D0_unique_purchase / registration；D7_unique_purchase / registration（单位：%）',
    span: 'full',

    render({ mountEl, rawByMonth, months, latestMonth, utils }){
      injectStyle();

      const safeMonths = Array.isArray(months) ? months.slice() : [];
      const monthsSorted = (utils && typeof utils.sortMonths === 'function')
        ? utils.sortMonths(safeMonths)
        : safeMonths.sort((a,b)=>String(a).localeCompare(String(b)));

      const defaultMonth = latestMonth || (monthsSorted.length ? monthsSorted[monthsSorted.length - 1] : null);

      const state = {
        months: new Set(defaultMonth ? [defaultMonth] : monthsSorted),
        countries: new Set(COUNTRY_ORDER),
        chartType: 'bar', // 'bar' | 'line'
        metrics: new Set(['D0','D7']),
      };

      const monthOptionsHtml = monthsSorted.map(m => checkboxHtml('months', m, state.months.has(m), m)).join('');
      const countryOptionsHtml = COUNTRY_ORDER.map(c => checkboxHtml('countries', c, state.countries.has(c), c)).join('');
      const chartTypeOptionsHtml = [
        checkboxHtml('chartType', 'bar', state.chartType === 'bar', '月度柱状图'),
        checkboxHtml('chartType', 'line', state.chartType === 'line', '日级折线图'),
      ].join('');
      const metricOptionsHtml = [
        checkboxHtml('metrics', 'D0', state.metrics.has('D0'), 'D0'),
        checkboxHtml('metrics', 'D7', state.metrics.has('D7'), 'D7'),
      ].join('');

      mountEl.innerHTML = `
        <div class="ovp-module-stack">
          <div class="ovp-pr-filters" id="filters-${moduleId}">
            <div class="ovp-pr-group">
              <div class="ovp-pr-label">月份（多选）</div>
              <div class="ovp-pr-options">${monthOptionsHtml || '<span style="color:var(--muted);font-size:12px;">无月份</span>'}</div>
            </div>

            <div class="ovp-pr-group">
              <div class="ovp-pr-label">国家（多选）</div>
              <div class="ovp-pr-options">${countryOptionsHtml}</div>
            </div>

            <div class="ovp-pr-group">
              <div class="ovp-pr-label">图表（单选）</div>
              <div class="ovp-pr-options">${chartTypeOptionsHtml}</div>
            </div>

            <div class="ovp-pr-group">
              <div class="ovp-pr-label">数据（多选）</div>
              <div class="ovp-pr-options">${metricOptionsHtml}</div>
            </div>
          </div>

          <div>
            <div class="ovp-chart" id="chart-${moduleId}" style="height:360px;"></div>
            <div class="ovp-chart-note" id="chart-note-${moduleId}"></div>
          </div>

          <div class="ovp-pr-table-wrap">
            <div class="ovp-pr-table-scroll">
              <table class="ovp-pr-table" id="table-${moduleId}"></table>
            </div>
          </div>

          <div class="ovp-pr-insight-head">
            <div class="ovp-pr-insight-title">数据分析</div>
            <div class="ovp-pr-insight-month" id="insight-month-${moduleId}">—</div>
          </div>
          <div class="ovp-insight is-empty" id="insight-${moduleId}">文案待填写：./insights.js</div>
        </div>
      `;

      const filtersEl = mountEl.querySelector(`#filters-${moduleId}`);
      const chartEl = mountEl.querySelector(`#chart-${moduleId}`);
      const chartNoteEl = mountEl.querySelector(`#chart-note-${moduleId}`);
      const tableEl = mountEl.querySelector(`#table-${moduleId}`);
      const insightEl = mountEl.querySelector(`#insight-${moduleId}`);
      const insightMonthEl = mountEl.querySelector(`#insight-month-${moduleId}`);

      if (!utils){
        utils = {
          sortMonths: (ms)=> (Array.isArray(ms) ? ms.slice().sort((a,b)=>String(a).localeCompare(String(b))) : []),
          fmtInt: (v)=> (Number.isFinite(Number(v)) ? Number(v).toLocaleString('en-US') : '—'),
          fmtPct: (v,d=2)=> (Number.isFinite(Number(v)) ? `${(Number(v)*100).toFixed(d)}%` : '—'),
        };
      }

      const theme = {
        text: cssVar('--text', '#0f172a'),
        muted: cssVar('--muted', '#6b7280'),
        border: cssVar('--border', 'rgba(148, 163, 184, 0.60)'),
        blue: cssVar('--ovp-blue', '#2563eb'),
      };

      const countryColors = {
        GH: theme.blue,
        KE: '#16a34a',
        NG: '#f97316',
        TZ: '#7c3aed',
        UG: '#0ea5e9',
      };

      let chart = null;
      function ensureChart(){
        if (chart) return chart;
        if (!chartEl) return null;
        if (!window.echarts) return null;
        chart = echarts.init(chartEl);
        return chart;
      }

      // Resize handling
      (function bindResize(){
        const c = ensureChart();
        if (!c) return;

        if (typeof ResizeObserver !== 'undefined'){
          const ro = new ResizeObserver(()=>{ try{ c.resize(); }catch(_){ } });
          ro.observe(chartEl);
        }else{
          window.addEventListener('resize', ()=>{ try{ c.resize(); }catch(_){ } });
        }
      })();

      function orderedMetrics(){
        return METRIC_ORDER.filter(m=>state.metrics.has(m));
      }
      function orderedCountries(){
        return COUNTRY_ORDER.filter(c=>state.countries.has(c));
      }

      function pickInsightMonth(selMonths){
        const arr = utils.sortMonths(selMonths);
        if (!arr.length) return latestMonth || defaultMonth || null;
        return (arr.length === 1) ? arr[0] : arr[arr.length - 1];
      }

      function update(){
        const monthsSel = utils.sortMonths([...state.months]);
        const countriesSel = orderedCountries();
        const metricsSel = orderedMetrics();

        const aggByCountry = computeCountryAgg(rawByMonth, monthsSel, countriesSel);
        const dailyByCountry = (state.chartType === 'line')
          ? computeDailyByCountry(rawByMonth, monthsSel, countriesSel)
          : null;

        const c = ensureChart();
        if (!c){
          if (chartEl){
            chartEl.innerHTML = `<div class="ovp-alert" style="margin:12px;">ECharts 未加载，图表不可用。</div>`;
          }
        } else {
          const opt = (state.chartType === 'line')
            ? buildLineOption({ dailyByCountry, countries: countriesSel, metrics: metricsSel, theme, countryColors })
            : buildBarOption({ aggByCountry, countries: countriesSel, metrics: metricsSel, theme, utils });

          c.setOption(opt, true);
        }

        if (chartNoteEl){
          const chartName = (state.chartType === 'line') ? '日级折线图' : '月度柱状图';
          chartNoteEl.textContent =
            `${chartName} · 月份：${formatMonthSummary(monthsSel)} · 国家：${countriesSel.join('/')} · 数据：${metricsSel.join('/')} · 口径：D0_unique_purchase/registration；D7_unique_purchase/registration（单位：%）`;
        }

        renderTable(tableEl, aggByCountry, countriesSel, metricsSel, utils);

        const insightMonth = pickInsightMonth(monthsSel);
        if (insightMonthEl) insightMonthEl.textContent = insightMonth ? `解读月份：${insightMonth}` : '解读月份：—';
        if (OVP && OVP.ui && typeof OVP.ui.renderInsight === 'function'){
          OVP.ui.renderInsight({ moduleId, month: insightMonth, el: insightEl });
        }
      }

      if (filtersEl){
        filtersEl.addEventListener('change', (e)=>{
          const t = e.target;
          if (!t || t.tagName !== 'INPUT' || t.type !== 'checkbox') return;
          const group = t.getAttribute('data-group');
          const value = t.value;
          const checked = !!t.checked;

          if (group === 'chartType'){
            if (!checked){
              t.checked = true;
              return;
            }
            state.chartType = value;
            for (const el of filtersEl.querySelectorAll('input[type="checkbox"][data-group="chartType"]')){
              if (el !== t) el.checked = false;
            }
            update();
            return;
          }

          if (group === 'metrics'){
            if (checked) state.metrics.add(value);
            else state.metrics.delete(value);

            if (state.metrics.size === 0){
              state.metrics.add(value);
              t.checked = true;
              return;
            }
            update();
            return;
          }

          if (group === 'months'){
            if (checked) state.months.add(value);
            else state.months.delete(value);

            if (state.months.size === 0){
              state.months.add(value);
              t.checked = true;
              return;
            }
            update();
            return;
          }

          if (group === 'countries'){
            if (checked) state.countries.add(value);
            else state.countries.delete(value);

            if (state.countries.size === 0){
              state.countries.add(value);
              t.checked = true;
              return;
            }
            update();
            return;
          }
        });
      }

      update();
    }
  });
})();
