// module-registration.js
(function () {
  const moduleId = 'registration';
  const COUNTRY_ORDER = ['GH', 'KE', 'NG', 'TZ', 'UG'];
  const MONTH_LIMIT = 3;

  function readCssVar(name, fallback = '') {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name);
    return (v && String(v).trim()) ? String(v).trim() : fallback;
  }

  function fmtInt(n) {
    const v = Number(n);
    if (!Number.isFinite(v)) return '—';
    return v.toLocaleString('en-US');
  }

  function ensureArr(v) {
    return Array.isArray(v) ? v : [];
  }

  function uniqSorted(arr) {
    return Array.from(new Set(arr)).sort((a, b) => String(a).localeCompare(String(b)));
  }

  function sortMonthsAsc(months) {
    const ms = ensureArr(months).map(String);
    if (window.OVP && OVP.utils && typeof OVP.utils.sortMonths === 'function') return OVP.utils.sortMonths(ms);
    return ms.sort((a, b) => a.localeCompare(b));
  }

  function injectStylesOnce() {
    const id = 'ovp-style-registration';
    if (document.getElementById(id)) return;

    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      .ovp-reg { display:flex; flex-direction:column; gap:12px; }

      .ovp-reg-filters{
        display:flex;
        flex-wrap:wrap;
        gap:10px 12px;
        align-items:flex-end;
      }

      .ovp-reg-filter{
        display:flex;
        flex-direction:column;
        gap:6px;
        min-width: 220px;
      }
      .ovp-reg-filter .ovp-reg-label{
        font-size:11px;
        color: var(--muted);
      }

      /* details multi-select */
      .ovp-reg-select{
        position:relative;
        border:1px solid rgba(148, 163, 184, 0.60);
        border-radius:12px;
        background:#fff;
        box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
      }
      .ovp-reg-select > summary{
        list-style:none;
        cursor:pointer;
        padding:9px 10px;
        font-size:12px;
        color: var(--text);
        user-select:none;
        outline:none;
      }
      .ovp-reg-select > summary::-webkit-details-marker{ display:none; }
      .ovp-reg-select > summary:after{
        content:"▾";
        float:right;
        color: var(--muted);
        font-size:12px;
      }
      .ovp-reg-select[open] > summary:after{ content:"▴"; }

      .ovp-reg-panel{
        position:absolute;
        z-index:20;
        left:0;
        right:0;
        top:calc(100% + 6px);
        background:#fff;
        border:1px solid rgba(148, 163, 184, 0.60);
        border-radius:12px;
        box-shadow: 0 18px 40px rgba(15, 23, 42, 0.10);
        padding:8px;
        max-height: 260px;
        overflow:auto;
      }

      .ovp-reg-option{
        display:flex;
        align-items:center;
        gap:8px;
        padding:6px 8px;
        border-radius:10px;
        font-size:12px;
        color: var(--text);
      }
      .ovp-reg-option:hover{
        background: rgba(249, 250, 251, 0.90);
      }
      .ovp-reg-option input{
        width:14px;
        height:14px;
        accent-color: var(--ovp-blue, #2563eb);
      }
      .ovp-reg-option input:disabled{
        opacity:0.45;
        cursor:not-allowed;
      }

      .ovp-reg-actions{
        display:flex;
        gap:8px;
        padding:6px 8px 8px;
        border-bottom:1px dashed rgba(148, 163, 184, 0.45);
        margin-bottom:6px;
      }
      .ovp-reg-mini-btn{
        border:1px solid rgba(148, 163, 184, 0.60);
        background: rgba(249, 250, 251, 0.90);
        color: var(--text);
        font-size:11px;
        padding:5px 8px;
        border-radius:999px;
        cursor:pointer;
      }
      .ovp-reg-mini-btn:hover{
        background: rgba(243, 244, 246, 0.95);
      }

      /* chart type radios */
      .ovp-reg-radio{
        display:flex;
        align-items:center;
        gap:10px;
        padding:9px 10px;
        border:1px solid rgba(148, 163, 184, 0.60);
        border-radius:12px;
        background:#fff;
        box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
      }
      .ovp-reg-radio label{
        display:flex;
        align-items:center;
        gap:6px;
        font-size:12px;
        color: var(--text);
        cursor:pointer;
        user-select:none;
      }
      .ovp-reg-radio input{
        accent-color: var(--ovp-blue, #2563eb);
      }

      .ovp-reg-hint{
        font-size:11px;
        color: var(--muted);
        line-height:1.4;
        margin-left:auto;
      }
      .ovp-reg-hint.is-warn{ color: #b45309; }

      /* table */
      .ovp-reg-table-wrap{
        border:1px solid rgba(148, 163, 184, 0.60);
        border-radius:12px;
        background:#fff;
        overflow:hidden;
      }
      table.ovp-reg-table{
        width:100%;
        border-collapse:collapse;
        table-layout:fixed;
      }
      .ovp-reg-table thead th{
        font-size:11px;
        color: var(--muted);
        text-align:left;
        padding:10px 10px;
        background: rgba(249, 250, 251, 0.90);
        border-bottom:1px solid rgba(148, 163, 184, 0.40);
        white-space:nowrap;
      }
      .ovp-reg-table tbody td{
        font-size:12px;
        color: var(--text);
        padding:10px 10px;
        border-bottom:1px solid rgba(148, 163, 184, 0.24);
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
      }
      .ovp-reg-table tbody tr:last-child td{ border-bottom:none; }

      .ovp-reg-kpi-note{
        font-size:11px;
        color: var(--muted);
        line-height:1.5;
      }
    `;
    document.head.appendChild(style);
  }

  function sumMonthlyByCountry(rawByMonth, month) {
    const rows = ensureArr(rawByMonth && rawByMonth[month]);
    const out = {};
    for (const c of COUNTRY_ORDER) out[c] = { sum: 0, count: 0 };

    for (const r of rows) {
      const c = r && r.country;
      if (!c || !out[c]) continue;
      const v = Number(r.registration);
      if (Number.isFinite(v)) out[c].sum += v;
      out[c].count += 1;
    }
    return out;
  }

  function buildMonthlyMatrix(rawByMonth, monthsAsc) {
    const matrix = {};
    for (const m of monthsAsc) matrix[m] = sumMonthlyByCountry(rawByMonth, m);
    return matrix;
  }

  function buildDailySeries(rawByMonth, monthsAsc, countries) {
    const dateSet = new Set();
    const byCountryDate = {};
    for (const c of countries) byCountryDate[c] = new Map();

    for (const m of monthsAsc) {
      const rows = ensureArr(rawByMonth && rawByMonth[m]);
      for (const r of rows) {
        const c = r && r.country;
        if (!c || !byCountryDate[c]) continue;
        const d = r && r.date;
        if (!d) continue;
        dateSet.add(d);

        const v = Number(r.registration);
        const prev = byCountryDate[c].get(d) || 0;
        byCountryDate[c].set(d, prev + (Number.isFinite(v) ? v : 0));
      }
    }

    const dates = Array.from(dateSet).sort((a, b) => String(a).localeCompare(String(b)));
    const series = countries.map((c) => {
      const m = byCountryDate[c] || new Map();
      return {
        name: c,
        type: 'line',
        data: dates.map((d) => (m.has(d) ? m.get(d) : null)),
        showSymbol: false,
        smooth: false,
        connectNulls: false,
        lineStyle: { width: 2 },
        emphasis: { focus: 'series' }
      };
    });

    return { dates, series };
  }

  function buildInsightText(monthsAsc, latestMonth) {
    const monthsToShow = monthsAsc.length ? monthsAsc : (latestMonth ? [latestMonth] : []);
    if (!monthsToShow.length) return { text: '文案待填写：./insights.js', empty: true };

    const parts = [];
    let hasReal = false;

    for (const m of monthsToShow) {
      let t = '';
      try {
        if (window.OVP && typeof OVP.getInsight === 'function') t = OVP.getInsight(moduleId, m) || '';
        else if (window.OVP && OVP.insights && OVP.insights[m] && OVP.insights[m][moduleId]) t = OVP.insights[m][moduleId] || '';
        else if (window.INSIGHTS_ORGANIC_MONTHLY && INSIGHTS_ORGANIC_MONTHLY[m] && INSIGHTS_ORGANIC_MONTHLY[m][moduleId]) t = INSIGHTS_ORGANIC_MONTHLY[m][moduleId] || '';
      } catch (_e) {
        t = '';
      }

      const cleaned = String(t || '').trim();
      if (cleaned) {
        hasReal = true;
        parts.push(`【${m}】\n${cleaned}`);
      } else {
        parts.push(`【${m}】\n（文案待填写：insights.js -> INSIGHTS_ORGANIC_MONTHLY["${m}"].${moduleId}）`);
      }
    }

    return { text: parts.join('\n\n'), empty: !hasReal };
  }

  function createMultiSelect({ label, options, selected, max, withActions, onChange }) {
    const wrap = document.createElement('div');
    wrap.className = 'ovp-reg-filter';

    const lab = document.createElement('div');
    lab.className = 'ovp-reg-label';
    lab.textContent = label;

    const details = document.createElement('details');
    details.className = 'ovp-reg-select';

    const summary = document.createElement('summary');
    summary.textContent = '选择';

    const panel = document.createElement('div');
    panel.className = 'ovp-reg-panel';

    const checkboxes = [];

    function updateSummary() {
      const picks = options.filter((o) => selected.has(o));
      summary.textContent = picks.length ? picks.join(', ') : '未选择';
    }

    function syncDisabled() {
      if (!max) return;
      const reached = selected.size >= max;
      for (const cb of checkboxes) {
        if (!cb.checked) cb.disabled = reached;
      }
    }

    if (withActions) {
      const actions = document.createElement('div');
      actions.className = 'ovp-reg-actions';

      const btnAll = document.createElement('button');
      btnAll.type = 'button';
      btnAll.className = 'ovp-reg-mini-btn';
      btnAll.textContent = '全选';
      btnAll.addEventListener('click', (e) => {
        e.preventDefault();
        for (const o of options) selected.add(o);
        for (const cb of checkboxes) cb.checked = true;
        syncDisabled();
        updateSummary();
        onChange(Array.from(selected));
      });

      const btnClear = document.createElement('button');
      btnClear.type = 'button';
      btnClear.className = 'ovp-reg-mini-btn';
      btnClear.textContent = '清空';
      btnClear.addEventListener('click', (e) => {
        e.preventDefault();
        selected.clear();
        for (const cb of checkboxes) cb.checked = false;
        syncDisabled();
        updateSummary();
        onChange(Array.from(selected));
      });

      actions.appendChild(btnAll);
      actions.appendChild(btnClear);
      panel.appendChild(actions);
    }

    for (const opt of options) {
      const row = document.createElement('label');
      row.className = 'ovp-reg-option';

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.value = opt;
      cb.checked = selected.has(opt);

      const txt = document.createElement('span');
      txt.textContent = opt;

      cb.addEventListener('change', () => {
        if (cb.checked) {
          if (max && !selected.has(opt) && selected.size >= max) {
            cb.checked = false;
            onChange(Array.from(selected), { rejected: true, reason: `最多选择 ${max} 个` });
            return;
          }
          selected.add(opt);
        } else {
          selected.delete(opt);
        }
        syncDisabled();
        updateSummary();
        onChange(Array.from(selected));
      });

      checkboxes.push(cb);
      row.appendChild(cb);
      row.appendChild(txt);
      panel.appendChild(row);
    }

    updateSummary();
    syncDisabled();

    details.appendChild(summary);
    details.appendChild(panel);

    wrap.appendChild(lab);
    wrap.appendChild(details);

    return { el: wrap, updateSummary, syncDisabled, checkboxes, details };
  }

  function createChartTypeToggle({ value, onChange }) {
    const wrap = document.createElement('div');
    wrap.className = 'ovp-reg-filter';

    const lab = document.createElement('div');
    lab.className = 'ovp-reg-label';
    lab.textContent = '图表类型';

    const box = document.createElement('div');
    box.className = 'ovp-reg-radio';

    const idBar = `ovp-reg-${moduleId}-bar`;
    const idLine = `ovp-reg-${moduleId}-line`;

    const lb1 = document.createElement('label');
    const r1 = document.createElement('input');
    r1.type = 'radio';
    r1.name = `ovp-reg-type-${moduleId}`;
    r1.id = idBar;
    r1.value = 'bar';
    r1.checked = value === 'bar';
    lb1.appendChild(r1);
    lb1.appendChild(document.createTextNode('月度柱状图'));

    const lb2 = document.createElement('label');
    const r2 = document.createElement('input');
    r2.type = 'radio';
    r2.name = `ovp-reg-type-${moduleId}`;
    r2.id = idLine;
    r2.value = 'line';
    r2.checked = value === 'line';
    lb2.appendChild(r2);
    lb2.appendChild(document.createTextNode('日级折线图'));

    function handler() {
      const v = r2.checked ? 'line' : 'bar';
      onChange(v);
    }
    r1.addEventListener('change', handler);
    r2.addEventListener('change', handler);

    box.appendChild(lb1);
    box.appendChild(lb2);

    wrap.appendChild(lab);
    wrap.appendChild(box);
    return { el: wrap };
  }

  OVP.registerModule({
    id: moduleId,
    title: '自然量注册数',
    subtitle: '口径：registration（月内按日×国家求和）；单位：人；数据源：RAW_ORGANIC_BY_MONTH',
    span: 'full',

    render({ mountEl, rawByMonth, months, latestMonth }) {
      injectStylesOnce();

      const raw = rawByMonth
        || (typeof RAW_ORGANIC_BY_MONTH !== 'undefined' ? RAW_ORGANIC_BY_MONTH : {});

      const availableMonthsAsc = sortMonthsAsc((months && months.length) ? months : Object.keys(raw || {}));
      const availableMonthsDesc = availableMonthsAsc.slice().reverse();

      // state
      const state = {
        chartType: 'bar',
        months: new Set(),
        countries: new Set(COUNTRY_ORDER)
      };

      // default month = latestMonth 或数据里最后一个
      const defaultMonth = latestMonth || (availableMonthsAsc.length ? availableMonthsAsc[availableMonthsAsc.length - 1] : null);
      if (defaultMonth) state.months.add(String(defaultMonth));

      // layout
      const root = document.createElement('div');
      root.className = 'ovp-reg';
      mountEl.innerHTML = '';
      mountEl.appendChild(root);

      // filters
      const filters = document.createElement('div');
      filters.className = 'ovp-reg-filters';
      root.appendChild(filters);

      const hint = document.createElement('div');
      hint.className = 'ovp-reg-hint';
      hint.textContent = `单位：人 · 月份最多选 ${MONTH_LIMIT} 个`;
      filters.appendChild(hint);

      function flashWarn(msg) {
        hint.textContent = msg;
        hint.classList.add('is-warn');
        clearTimeout(flashWarn._t);
        flashWarn._t = setTimeout(() => {
          hint.textContent = `单位：人 · 月份最多选 ${MONTH_LIMIT} 个`;
          hint.classList.remove('is-warn');
        }, 1800);
      }

      const monthSelect = createMultiSelect({
        label: '月份（多选，最多 3）',
        options: availableMonthsDesc,
        selected: state.months,
        max: MONTH_LIMIT,
        withActions: false,
        onChange(_vals, meta) {
          if (meta && meta.rejected) flashWarn(`月份最多选 ${MONTH_LIMIT} 个`);
          renderAll();
        }
      });

      const countrySelect = createMultiSelect({
        label: '国家（多选）',
        options: COUNTRY_ORDER,
        selected: state.countries,
        max: null,
        withActions: true,
        onChange() {
          renderAll();
        }
      });

      const typeToggle = createChartTypeToggle({
        value: state.chartType,
        onChange(v) {
          state.chartType = v;
          renderAll();
        }
      });

      // put controls before hint (hint stays right with margin-left:auto)
      filters.insertBefore(monthSelect.el, hint);
      filters.insertBefore(countrySelect.el, hint);
      filters.insertBefore(typeToggle.el, hint);

      // chart
      const chartWrap = document.createElement('div');
      chartWrap.className = 'ovp-module-stack';
      root.appendChild(chartWrap);

      const chartEl = document.createElement('div');
      chartEl.className = 'ovp-chart';
      chartEl.style.height = '360px';
      chartWrap.appendChild(chartEl);

      const chartNote = document.createElement('div');
      chartNote.className = 'ovp-chart-note';
      chartNote.textContent = '单位：人';
      chartWrap.appendChild(chartNote);

      // table
      const tableWrap = document.createElement('div');
      tableWrap.className = 'ovp-reg-table-wrap';
      root.appendChild(tableWrap);

      // insights
      const insightEl = document.createElement('div');
      insightEl.className = 'ovp-insight is-empty';
      insightEl.textContent = '文案待填写：./insights.js';
      root.appendChild(insightEl);

      // echarts init
      let chart = null;
      function ensureChart() {
        if (chart) return chart;
        if (!window.echarts) return null;
        chart = echarts.init(chartEl);
        return chart;
      }

      const ro = new ResizeObserver(() => {
        if (chart) chart.resize();
      });
      ro.observe(chartEl);

      window.addEventListener('resize', () => {
        if (chart) chart.resize();
      });

      function renderChart() {
        const monthsAsc = sortMonthsAsc(Array.from(state.months));
        const countries = COUNTRY_ORDER.filter((c) => state.countries.has(c));

        const textMuted = readCssVar('--muted', '#6b7280');
        const textMain = readCssVar('--text', '#0f172a');
        const border = readCssVar('--border', 'rgba(148,163,184,0.60)');
        const blue = readCssVar('--ovp-blue', '#2563eb');
        const yellow = readCssVar('--ovp-yellow', '#F6C344');

        const ins = ensureChart();
        if (!ins) {
          chartEl.innerHTML = `<div class="ovp-alert">未检测到 echarts：请确认 index.html 已加载 echarts。</div>`;
          return;
        }

        // empty state
        if (!monthsAsc.length || !countries.length) {
          ins.clear();
          ins.setOption({
            title: {
              text: !monthsAsc.length ? '请选择月份' : '请选择国家',
              left: 'center',
              top: 'center',
              textStyle: { color: textMuted, fontSize: 12, fontWeight: 'normal' }
            }
          }, true);
          chartNote.textContent = '单位：人';
          return;
        }

        if (state.chartType === 'bar') {
          const matrix = buildMonthlyMatrix(raw, monthsAsc);
          const series = monthsAsc.map((m, idx) => {
            const mMap = matrix[m] || {};
            return {
              name: m,
              type: 'bar',
              barMaxWidth: 28,
              data: countries.map((c) => {
                const cell = mMap[c];
                if (!cell || !cell.count) return 0;
                return cell.sum;
              }),
              emphasis: { focus: 'series' }
            };
          });

          ins.setOption({
            color: [blue, yellow, '#10b981', '#ef4444', '#8b5cf6'],
            tooltip: {
              trigger: 'axis',
              axisPointer: { type: 'shadow' },
              valueFormatter: (v) => fmtInt(v)
            },
            legend: {
              top: 6,
              textStyle: { color: textMuted, fontSize: 11 },
              data: monthsAsc
            },
            grid: { left: 16, right: 16, top: 40, bottom: 24, containLabel: true },
            xAxis: {
              type: 'category',
              data: countries,
              axisLine: { lineStyle: { color: border } },
              axisTick: { alignWithLabel: true },
              axisLabel: { color: textMuted, fontSize: 11 }
            },
            yAxis: {
              type: 'value',
              axisLine: { show: false },
              splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.25)' } },
              axisLabel: { color: textMuted, fontSize: 11 }
            },
            series
          }, true);

          chartNote.textContent = `月度柱状图：所选月份对比 · 单位：人（registration 月内求和）`;
        } else {
          const { dates, series } = buildDailySeries(raw, monthsAsc, countries);

          ins.setOption({
            color: [blue, yellow, '#10b981', '#ef4444', '#8b5cf6'],
            tooltip: {
              trigger: 'axis',
              axisPointer: { type: 'line' },
              valueFormatter: (v) => fmtInt(v)
            },
            legend: {
              top: 6,
              textStyle: { color: textMuted, fontSize: 11 },
              data: countries
            },
            grid: { left: 16, right: 16, top: 40, bottom: 24, containLabel: true },
            xAxis: {
              type: 'category',
              data: dates,
              axisLine: { lineStyle: { color: border } },
              axisLabel: {
                color: textMuted,
                fontSize: 11,
                formatter: (v) => {
                  const s = String(v || '');
                  return s.length >= 10 ? s.slice(5) : s; // MM-DD
                }
              }
            },
            yAxis: {
              type: 'value',
              axisLine: { show: false },
              splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.25)' } },
              axisLabel: { color: textMuted, fontSize: 11 }
            },
            dataZoom: [{ type: 'inside' }],
            series
          }, true);

          chartNote.textContent = `日级折线图：按国家分线 · 单位：人（registration）`;
        }
      }

      function renderTable() {
        const monthsAsc = sortMonthsAsc(Array.from(state.months));
        const countries = COUNTRY_ORDER.filter((c) => state.countries.has(c));

        if (!monthsAsc.length || !countries.length) {
          tableWrap.innerHTML = `
            <div class="ovp-alert" style="border:none;border-radius:0;">
              表格待展示：先选择月份/国家。
            </div>
          `;
          return;
        }

        const matrix = buildMonthlyMatrix(raw, monthsAsc);

        const thead = `
          <thead>
            <tr>
              <th style="width:110px;">国家</th>
              ${monthsAsc.map((m) => `<th>${m} 自然量注册数</th>`).join('')}
            </tr>
          </thead>
        `;

        const tbodyRows = countries.map((c) => {
          const tds = monthsAsc.map((m) => {
            const cell = (matrix[m] && matrix[m][c]) ? matrix[m][c] : null;
            if (!cell || !cell.count) return `<td>—</td>`;
            return `<td>${fmtInt(cell.sum)}</td>`;
          }).join('');

          return `<tr><td>${c}</td>${tds}</tr>`;
        }).join('');

        tableWrap.innerHTML = `
          <table class="ovp-reg-table">
            ${thead}
            <tbody>
              ${tbodyRows}
            </tbody>
          </table>
        `;
      }

      function renderInsights() {
        const monthsAsc = sortMonthsAsc(Array.from(state.months));
        const { text, empty } = buildInsightText(monthsAsc, latestMonth);
        insightEl.textContent = text;
        if (empty) insightEl.classList.add('is-empty');
        else insightEl.classList.remove('is-empty');
      }

      function renderAll() {
        // enforce month limit (disable extra)
        monthSelect.syncDisabled();

        renderChart();
        renderTable();
        renderInsights();
      }

      renderAll();
    }
  });
})();
