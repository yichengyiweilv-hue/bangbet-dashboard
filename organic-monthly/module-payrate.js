(function () {
  const moduleId = 'payrate';

  const COUNTRY_ORDER = ['GH', 'KE', 'NG', 'TZ', 'UG'];

  // 折线图：按国家固定配色（同国家 D0/D7 共用一个颜色）
  const COUNTRY_COLOR = {
    GH: '#2563eb',
    KE: '#f59e0b',
    NG: '#10b981',
    TZ: '#ef4444',
    UG: '#8b5cf6',
  };

  // 柱状图：按月份配色（同月份 D0/D7 共用一个颜色；D7 叠加斜线 decal）
  const MONTH_PALETTE = [
    '#2563eb', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6',
    '#0ea5e9', '#f97316', '#14b8a6', '#64748b', '#d946ef',
  ];

  function safeNum(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  function safeDiv(num, den) {
    const n = Number(num);
    const d = Number(den);
    if (!Number.isFinite(n) || !Number.isFinite(d) || d <= 0) return null;
    return n / d;
  }
  function fmtPct(v, digits = 2) {
    const n = Number(v);
    return Number.isFinite(n) ? `${(n * 100).toFixed(digits)}%` : '—';
  }
  function sortMonthsFallback(ms) {
    return (Array.isArray(ms) ? ms.slice() : []).sort((a, b) => String(a).localeCompare(String(b)));
  }
  function normalizeId(s) {
    return String(s).replace(/[^a-z0-9\-_]/gi, '_');
  }
  function monthColor(month, allMonths) {
    const idx = Math.max(0, (allMonths || []).indexOf(month));
    return MONTH_PALETTE[idx % MONTH_PALETTE.length];
  }
  function makeD7Decal() {
    return {
      symbol: 'rect',
      symbolSize: 2,
      dashArrayX: [4, 2],
      dashArrayY: [6, 2],
      rotation: Math.PI / 4,
      color: 'rgba(255,255,255,0.60)',
    };
  }

  function sumMonthCountry(rows, country) {
    let reg = 0;
    let d0 = 0;
    let d7 = 0;

    for (const r of (Array.isArray(rows) ? rows : [])) {
      if (!r || r.country !== country) continue;
      reg += safeNum(r.registration);
      d0 += safeNum(r.D0_unique_purchase);
      d7 += safeNum(r.D7_unique_purchase);
    }

    return {
      reg,
      d0,
      d7,
      d0Rate: safeDiv(d0, reg),
      d7Rate: safeDiv(d7, reg),
    };
  }

  function sumMonthsCountry(rawByMonth, monthsSel, country) {
    let reg = 0;
    let d0 = 0;
    let d7 = 0;

    for (const m of (Array.isArray(monthsSel) ? monthsSel : [])) {
      const rows = rawByMonth && rawByMonth[m];
      const s = sumMonthCountry(rows, country);
      reg += safeNum(s.reg);
      d0 += safeNum(s.d0);
      d7 += safeNum(s.d7);
    }

    return {
      reg,
      d0,
      d7,
      d0Rate: safeDiv(d0, reg),
      d7Rate: safeDiv(d7, reg),
    };
  }

  function buildDailyMap(rawByMonth, monthsSel, countriesSet) {
    const byCountry = new Map(); // country -> { D0:[[date,rate]], D7:[[date,rate]] }

    for (const c of COUNTRY_ORDER) {
      if (countriesSet && !countriesSet.has(c)) continue;
      byCountry.set(c, { D0: [], D7: [] });
    }

    for (const m of (Array.isArray(monthsSel) ? monthsSel : [])) {
      const rows = rawByMonth && rawByMonth[m];
      if (!Array.isArray(rows)) continue;

      for (const r of rows) {
        if (!r || !r.country || !r.date) continue;
        if (countriesSet && !countriesSet.has(r.country)) continue;
        if (!byCountry.has(r.country)) continue;

        const reg = safeNum(r.registration);
        const d0 = safeNum(r.D0_unique_purchase);
        const d7 = safeNum(r.D7_unique_purchase);
        const d0Rate = safeDiv(d0, reg);
        const d7Rate = safeDiv(d7, reg);

        const bucket = byCountry.get(r.country);
        bucket.D0.push([r.date, d0Rate]);
        bucket.D7.push([r.date, d7Rate]);
      }
    }

    // sort by date (YYYY-MM-DD lex order == chrono order)
    for (const [c, bucket] of byCountry.entries()) {
      bucket.D0.sort((a, b) => String(a[0]).localeCompare(String(b[0])));
      bucket.D7.sort((a, b) => String(a[0]).localeCompare(String(b[0])));
      byCountry.set(c, bucket);
    }

    return byCountry;
  }

  OVP.registerModule({
    id: moduleId,
    title: 'D0 / D7 付费率',
    subtitle: '口径：D0_unique_purchase / registration；D7_unique_purchase / registration（单位：%）',
    span: 'full',

    render({ mountEl, rawByMonth, months, latestMonth, utils }) {
      const sortMonths = (utils && typeof utils.sortMonths === 'function') ? utils.sortMonths.bind(utils) : sortMonthsFallback;

      const { chartEl, chartNoteEl, insightEl } = OVP.ui.mountModule(mountEl, { moduleId, chartHeight: 380 });
      const stackEl = mountEl.querySelector('.ovp-module-stack');
      if (!stackEl || !chartEl) return;

      // ---- styles (module-scoped) ----
      const styleEl = document.createElement('style');
      styleEl.textContent = `
        /* payrate module */
        .ovp-pr-filters{
          display:flex;
          flex-wrap:wrap;
          gap:10px 14px;
          padding:10px 12px;
          border:1px solid rgba(148, 163, 184, 0.60);
          border-radius:12px;
          background: rgba(249, 250, 251, 0.90);
        }
        .ovp-pr-group{
          min-width: 240px;
          flex: 1 1 240px;
        }
        .ovp-pr-title{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:10px;
          margin:0 0 6px;
          color: var(--muted);
          font-size: 11px;
          line-height: 1.2;
        }
        .ovp-pr-options{
          display:flex;
          flex-wrap:wrap;
          gap:6px;
        }
        .ovp-pr-chip{
          display:inline-flex;
          align-items:center;
          gap:6px;
          padding:6px 10px;
          border:1px solid rgba(148, 163, 184, 0.60);
          border-radius: 999px;
          background: rgba(255,255,255,0.96);
          color: var(--text);
          font-size: 11px;
          user-select:none;
          cursor:pointer;
          white-space:nowrap;
        }
        .ovp-pr-chip input{
          margin:0;
          transform: translateY(0.5px);
        }

        .ovp-pr-tableWrap{
          border:1px solid rgba(148, 163, 184, 0.60);
          border-radius:12px;
          background: rgba(249, 250, 251, 0.90);
          overflow:hidden;
        }
        .ovp-pr-tableHead{
          display:flex;
          align-items:flex-end;
          justify-content:space-between;
          gap:12px;
          padding:10px 12px 8px;
          border-bottom:1px solid rgba(148, 163, 184, 0.45);
          background: rgba(255,255,255,0.75);
        }
        .ovp-pr-tableHead .t{
          font-size:12px;
          color: var(--text);
          letter-spacing:.1px;
        }
        .ovp-pr-tableHead .m{
          font-size:11px;
          color: var(--muted);
        }
        .ovp-pr-tableScroll{
          overflow:auto;
          max-height: 260px;
        }
        table.ovp-pr-table{
          width:100%;
          border-collapse:separate;
          border-spacing:0;
          font-size:11px;
        }
        table.ovp-pr-table thead th{
          position: sticky;
          top:0;
          z-index:2;
          background: rgba(249, 250, 251, 0.96);
          color: var(--muted);
          text-align:right;
          padding:8px 10px;
          border-bottom:1px solid rgba(148, 163, 184, 0.45);
          font-weight:600;
          white-space:nowrap;
        }
        table.ovp-pr-table thead th:first-child{ text-align:left; }
        table.ovp-pr-table tbody td{
          padding:8px 10px;
          border-bottom:1px solid rgba(148, 163, 184, 0.25);
          text-align:right;
          color: var(--text);
          white-space:nowrap;
        }
        table.ovp-pr-table tbody td:first-child{ text-align:left; font-weight:600; }
        table.ovp-pr-table tbody tr:hover td{
          background: rgba(15, 23, 42, 0.03);
        }
        .ovp-pr-muted{
          color: var(--muted) !important;
        }
        .ovp-pr-emptyRow td{
          text-align:center !important;
          color: var(--muted) !important;
          padding:12px 10px !important;
        }
        .ovp-pr-foot{
          padding:8px 12px 10px;
          font-size:11px;
          color: var(--muted);
          line-height:1.45;
          background: rgba(255,255,255,0.75);
        }
      `;
      mountEl.prepend(styleEl);

      // ---- insert: filters (top) ----
      const filtersEl = document.createElement('div');
      filtersEl.className = 'ovp-pr-filters';
      filtersEl.id = `filters-${moduleId}`;

      // chart block is chartEl.parentElement (wrapper containing chart + note)
      const chartBlockEl = chartEl.parentElement;
      if (chartBlockEl) stackEl.insertBefore(filtersEl, chartBlockEl);

      // ---- insert: table (below chart) ----
      const tableWrapEl = document.createElement('div');
      tableWrapEl.className = 'ovp-pr-tableWrap';
      tableWrapEl.innerHTML = `
        <div class="ovp-pr-tableHead">
          <div class="t">数据表</div>
          <div class="m" id="table-meta-${moduleId}"></div>
        </div>
        <div class="ovp-pr-tableScroll">
          <table class="ovp-pr-table">
            <thead>
              <tr>
                <th>国家</th>
                <th>自然量D0付费率</th>
                <th>自然量D7付费率</th>
              </tr>
            </thead>
            <tbody id="table-tbody-${moduleId}"></tbody>
          </table>
        </div>
        <div class="ovp-pr-foot">口径：∑D0_unique_purchase/∑registration；∑D7_unique_purchase/∑registration（单位：%）。</div>
      `;
      const tableMetaEl = tableWrapEl.querySelector(`#table-meta-${moduleId}`);
      const tableTbodyEl = tableWrapEl.querySelector(`#table-tbody-${moduleId}`);
      stackEl.insertBefore(tableWrapEl, insightEl);

      // ---- state ----
      const allMonths = sortMonths(Array.isArray(months) ? months : []);
      const defaultMonth = (latestMonth && allMonths.includes(latestMonth))
        ? latestMonth
        : (allMonths.length ? allMonths[allMonths.length - 1] : null);

      const state = {
        months: new Set(defaultMonth ? [defaultMonth] : []),
        countries: new Set(COUNTRY_ORDER),
        view: 'bar', // 'bar' | 'line'
        metrics: new Set(['D0', 'D7']),
      };

      // ---- filters UI ----
      function chip(group, value, label, checked) {
        const id = normalizeId(`${moduleId}-${group}-${value}`);
        return `
          <label class="ovp-pr-chip" for="${id}">
            <input id="${id}" type="checkbox" data-group="${group}" value="${String(value)}" ${checked ? 'checked' : ''}/>
            <span>${label}</span>
          </label>
        `;
      }

      function renderFilters() {
        const monthHtml = allMonths.map(m => chip('month', m, m, state.months.has(m))).join('');
        const countryHtml = COUNTRY_ORDER.map(c => chip('country', c, c, state.countries.has(c))).join('');
        const viewHtml = [
          chip('view', 'bar', '月度柱状图', state.view === 'bar'),
          chip('view', 'line', '日级折线图', state.view === 'line'),
        ].join('');
        const metricHtml = [
          chip('metric', 'D0', 'D0数据', state.metrics.has('D0')),
          chip('metric', 'D7', 'D7数据', state.metrics.has('D7')),
        ].join('');

        filtersEl.innerHTML = `
          <div class="ovp-pr-group">
            <div class="ovp-pr-title"><span>月份</span><span>${Array.from(state.months).length} / ${allMonths.length}</span></div>
            <div class="ovp-pr-options">${monthHtml || '<span class="ovp-pr-muted">未检测到月份</span>'}</div>
          </div>
          <div class="ovp-pr-group">
            <div class="ovp-pr-title"><span>国家</span><span>${Array.from(state.countries).length} / ${COUNTRY_ORDER.length}</span></div>
            <div class="ovp-pr-options">${countryHtml}</div>
          </div>
          <div class="ovp-pr-group">
            <div class="ovp-pr-title"><span>图形</span><span>单选</span></div>
            <div class="ovp-pr-options">${viewHtml}</div>
          </div>
          <div class="ovp-pr-group">
            <div class="ovp-pr-title"><span>数据</span><span>${Array.from(state.metrics).length} / 2</span></div>
            <div class="ovp-pr-options">${metricHtml}</div>
          </div>
        `;
      }

      function enforceNonEmpty(set, fallbackValue) {
        if (set && set.size) return;
        if (fallbackValue !== undefined && fallbackValue !== null) set.add(fallbackValue);
      }

      function getSelectedMonths() {
        const ms = sortMonths(Array.from(state.months));
        const valid = ms.filter(m => allMonths.includes(m));
        if (!valid.length && allMonths.length) valid.push(allMonths[allMonths.length - 1]);
        return valid;
      }
      function getSelectedCountries() {
        return COUNTRY_ORDER.filter(c => state.countries.has(c));
      }
      function getSelectedMetrics() {
        return ['D0', 'D7'].filter(x => state.metrics.has(x));
      }
      function getInsightMonth(selMonths) {
        const ms = Array.isArray(selMonths) ? selMonths : [];
        if (ms.length) return ms[ms.length - 1];
        return defaultMonth;
      }

      filtersEl.addEventListener('change', (e) => {
        const input = e.target;
        if (!(input instanceof HTMLInputElement)) return;
        const group = input.dataset.group;
        if (!group) return;

        const v = input.value;
        const checked = input.checked;

        if (group === 'view') {
          // 用 checkbox 呈现，但逻辑单选：永远保持一个选中
          if (checked) state.view = v;
          // 如果用户试图把当前 view 取消（变成全不选），直接回滚
          if (!checked && state.view === v) state.view = v;
        }

        if (group === 'month') {
          if (checked) state.months.add(v);
          else state.months.delete(v);
          enforceNonEmpty(state.months, defaultMonth || v);
        }

        if (group === 'country') {
          if (checked) state.countries.add(v);
          else state.countries.delete(v);
          enforceNonEmpty(state.countries, COUNTRY_ORDER[0] || v);
        }

        if (group === 'metric') {
          if (checked) state.metrics.add(v);
          else state.metrics.delete(v);
          enforceNonEmpty(state.metrics, 'D0');
        }

        renderFilters();
        renderAll();
      });

      renderFilters();

      // ---- echarts init ----
      if (!window.echarts) {
        chartEl.classList.remove('is-empty');
        chartEl.innerHTML = `<div class="ovp-alert">ECharts 未加载：请检查 echarts CDN 是否可用。</div>`;
        if (chartNoteEl) chartNoteEl.textContent = '图表不可用（ECharts 未加载）。';
        return;
      }

      chartEl.classList.remove('is-empty');
      chartEl.innerHTML = '';
      const chart = echarts.init(chartEl);

      let resizeTimer = null;
      function onResize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          try { chart.resize(); } catch (_) {}
        }, 80);
      }
      window.addEventListener('resize', onResize);

      function setEmptyChart(msg) {
        chart.setOption({
          title: {
            text: msg,
            left: 'center',
            top: 'middle',
            textStyle: { color: '#6b7280', fontSize: 12, fontWeight: 400 },
          },
          tooltip: { show: false },
          xAxis: { show: false },
          yAxis: { show: false },
          series: [],
        }, { notMerge: true, lazyUpdate: false });
      }

      function renderBar(selMonths, selCountries, selMetrics) {
        const series = [];

        // 预聚合：month -> country -> rates
        const monthCountryRate = new Map(); // key `${m}|${c}` -> {d0Rate,d7Rate}
        for (const m of selMonths) {
          const rows = rawByMonth && rawByMonth[m];
          for (const c of selCountries) {
            const s = sumMonthCountry(rows, c);
            monthCountryRate.set(`${m}|${c}`, s);
          }
        }

        for (const m of selMonths) {
          const color = monthColor(m, allMonths);
          for (const metric of selMetrics) {
            const isD7 = metric === 'D7';
            const data = selCountries.map(c => {
              const s = monthCountryRate.get(`${m}|${c}`);
              const v = isD7 ? (s ? s.d7Rate : null) : (s ? s.d0Rate : null);
              return (v === null ? null : v);
            });

            series.push({
              name: `${m} ${metric}`,
              type: 'bar',
              barMaxWidth: 18,
              emphasis: { focus: 'series' },
              itemStyle: isD7
                ? { color, decal: makeD7Decal(), borderColor: color, borderWidth: 1 }
                : { color },
              data,
            });
          }
        }

        if (!selCountries.length || !series.length) {
          setEmptyChart('暂无数据：请检查筛选条件');
          return;
        }

        chart.setOption({
          legend: { top: 8, left: 8, type: 'scroll' },
          grid: { left: 46, right: 18, top: 56, bottom: 42, containLabel: true },
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: (params) => {
              if (!Array.isArray(params) || !params.length) return '';
              const country = params[0].axisValue;
              const orderC = (x) => COUNTRY_ORDER.indexOf(x);
              const orderM = (name) => {
                const parts = String(name || '').split(/\s+/);
                const m = parts[0] || '';
                const idx = selMonths.indexOf(m);
                return idx >= 0 ? idx : 9999;
              };
              const orderMetric = (name) => (String(name).includes(' D0') ? 0 : 1);
              params.sort((a, b) => (orderM(a.seriesName) - orderM(b.seriesName)) || (orderMetric(a.seriesName) - orderMetric(b.seriesName)));

              const lines = [`${country}`];
              for (const p of params) {
                lines.push(`${p.seriesName}: ${fmtPct(p.data, 2)}`);
              }
              return lines.join('<br/>');
            },
          },
          xAxis: {
            type: 'category',
            data: selCountries,
            axisTick: { alignWithLabel: true },
          },
          yAxis: {
            type: 'value',
            axisLabel: { formatter: (v) => fmtPct(v, 1) },
            splitLine: { lineStyle: { color: 'rgba(148,163,184,0.25)' } },
          },
          series,
          animationDuration: 220,
        }, { notMerge: true, lazyUpdate: false });
      }

      function renderLine(selMonths, selCountries, selMetrics) {
        const countriesSet = new Set(selCountries);
        const dailyMap = buildDailyMap(rawByMonth, selMonths, countriesSet);

        const series = [];
        for (const c of selCountries) {
          const bucket = dailyMap.get(c) || { D0: [], D7: [] };
          for (const metric of selMetrics) {
            const data = bucket[metric] || [];
            if (!data.length) continue;

            series.push({
              id: `${c}-${metric}`,
              name: c, // legend 以国家维度控制（同名 -> 一起开关）
              type: 'line',
              showSymbol: false,
              connectNulls: false,
              emphasis: { focus: 'series' },
              lineStyle: { width: 2, type: metric === 'D0' ? 'dashed' : 'solid', color: COUNTRY_COLOR[c] || '#2563eb' },
              itemStyle: { color: COUNTRY_COLOR[c] || '#2563eb' },
              data, // [date, rate]
            });
          }
        }

        if (!selCountries.length || !series.length) {
          setEmptyChart('暂无数据：请检查筛选条件');
          return;
        }

        const metricOfSeriesId = (id) => (String(id).endsWith('-D0') ? 'D0' : 'D7');

        chart.setOption({
          legend: { top: 8, left: 8, type: 'scroll', data: selCountries },
          grid: { left: 46, right: 18, top: 56, bottom: 42, containLabel: true },
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'line' },
            formatter: (params) => {
              if (!Array.isArray(params) || !params.length) return '';
              const dateVal = params[0].axisValue;
              const dateStr = (typeof dateVal === 'string')
                ? dateVal
                : (window.echarts && echarts.format ? echarts.format.formatTime('yyyy-MM-dd', dateVal) : String(dateVal));

              const orderC = (x) => COUNTRY_ORDER.indexOf(x);
              const orderMetric = (p) => (metricOfSeriesId(p.seriesId) === 'D0' ? 0 : 1);
              params.sort((a, b) => (orderC(a.seriesName) - orderC(b.seriesName)) || (orderMetric(a) - orderMetric(b)));

              const lines = [dateStr];
              for (const p of params) {
                const metric = metricOfSeriesId(p.seriesId);
                const v = Array.isArray(p.data) ? p.data[1] : (Array.isArray(p.value) ? p.value[1] : p.value);
                lines.push(`${p.seriesName} ${metric}: ${fmtPct(v, 2)}`);
              }
              return lines.join('<br/>');
            },
          },
          xAxis: {
            type: 'time',
            axisLabel: {
              formatter: (v) => (window.echarts && echarts.format ? echarts.format.formatTime('MM-dd', v) : String(v)),
            },
            splitLine: { show: false },
          },
          yAxis: {
            type: 'value',
            axisLabel: { formatter: (v) => fmtPct(v, 1) },
            splitLine: { lineStyle: { color: 'rgba(148,163,184,0.25)' } },
          },
          series,
          animationDuration: 220,
        }, { notMerge: true, lazyUpdate: false });
      }

      function renderTable(selMonths, selCountries, selMetrics) {
        if (!tableTbodyEl) return;

        const showD0 = selMetrics.includes('D0');
        const showD7 = selMetrics.includes('D7');

        const rowsHtml = selCountries.map((c) => {
          const agg = sumMonthsCountry(rawByMonth, selMonths, c);
          const d0Text = showD0 ? fmtPct(agg.d0Rate, 2) : '—';
          const d7Text = showD7 ? fmtPct(agg.d7Rate, 2) : '—';

          return `
            <tr>
              <td>${c}</td>
              <td class="${showD0 ? '' : 'ovp-pr-muted'}">${d0Text}</td>
              <td class="${showD7 ? '' : 'ovp-pr-muted'}">${d7Text}</td>
            </tr>
          `;
        }).join('');

        tableTbodyEl.innerHTML = rowsHtml || `
          <tr class="ovp-pr-emptyRow"><td colspan="3">暂无数据</td></tr>
        `;

        if (tableMetaEl) {
          tableMetaEl.textContent = selMonths.length
            ? `月份：${selMonths.join(', ')} · 国家：${selCountries.join(', ')}`
            : `国家：${selCountries.join(', ')}`;
        }
      }

      function renderInsight(month) {
        if (!insightEl) return;
        const m = month || defaultMonth || '';
        const text = (typeof OVP !== 'undefined' && typeof OVP.getInsight === 'function')
          ? String(OVP.getInsight(moduleId, m) || '').trim()
          : '';

        if (!text) {
          insightEl.textContent = `数据分析（${m || '—'}）\n文案待填写：./insights.js`;
          insightEl.classList.add('is-empty');
          return;
        }

        insightEl.textContent = `数据分析（${m}）\n${text}`;
        insightEl.classList.remove('is-empty');
      }

      function renderAll() {
        const selMonths = getSelectedMonths();
        const selCountries = getSelectedCountries();
        const selMetrics = getSelectedMetrics();
        const insightMonth = getInsightMonth(selMonths);

        // chart note
        if (chartNoteEl) {
          const viewText = state.view === 'bar'
            ? '月度柱状图（颜色=月份；斜线=D7）'
            : '日级折线图（同色=同国家；虚线=D0、实线=D7）';

          chartNoteEl.textContent = `口径：D0_unique_purchase/registration、D7_unique_purchase/registration（单位：%）。视图：${viewText}。`;
        }

        // chart
        if (state.view === 'bar') renderBar(selMonths, selCountries, selMetrics);
        else renderLine(selMonths, selCountries, selMetrics);

        // table
        renderTable(selMonths, selCountries, selMetrics);

        // insight
        renderInsight(insightMonth);
      }

      renderAll();
    },
  });
})();
