/* organic-monthly/module-arppu.js
 * 模块 3：D0 / D7 ARPPU
 * 口径：ARPPU = PURCHASE_VALUE / unique_purchase
 *
 * 交互：
 * - 顶部筛选器：月份 / 国家 / 图表类型（柱状 or 折线）/ D0 & D7（均多选，图表类型做互斥）
 * - 中间图表：
 *    - 柱状：x=国家（固定顺序 GH/KE/NG/TZ/UG），series=月份×(D0/D7)，D7 加斜线阴影，不堆叠
 *    - 折线：日级数据，按国家区分；同国家多月连成一条；D0 虚线、D7 实线，同国同色
 * - 图下表格：行=国家，列=所选月份×(D0/D7) ARPPU
 * - 文案：从 insights.js 读取 arppu，对应月份随筛选变化（多月时取最新月份）
 */
(function(){
  const OVP = window.OVP || {};
  const MODULE_ID = 'arppu';

  const COUNTRY_ORDER = ['GH','KE','NG','TZ','UG'];
  const METRIC_ORDER = ['D0','D7'];

  const PALETTE_MONTH = [
    '#2563eb', '#f59e0b', '#16a34a', '#ef4444', '#8b5cf6', '#06b6d4',
    '#f97316', '#64748b', '#0ea5e9', '#84cc16', '#a855f7', '#14b8a6'
  ];
  const PALETTE_COUNTRY = [
    '#2563eb', '#16a34a', '#f59e0b', '#8b5cf6', '#ef4444'
  ];

  function uniq(arr){
    const out = [];
    const seen = new Set();
    for(const v of (Array.isArray(arr) ? arr : [])){
      const k = String(v);
      if(seen.has(k)) continue;
      seen.add(k);
      out.push(v);
    }
    return out;
  }

  function sumNums(xs){
    let s = 0;
    for(const v of xs){
      const n = Number(v);
      if(Number.isFinite(n)) s += n;
    }
    return s;
  }

  function getMonthLabel(month, allSelectedMonths){
    const ms = Array.isArray(allSelectedMonths) ? allSelectedMonths : [];
    const years = new Set(ms.map(m=>String(m).slice(0,4)));
    if (years.size <= 1){
      const mm = String(month).slice(5,7);
      const mNum = String(Number(mm)); // remove leading zero
      return `${mNum}月`;
    }
    return String(month);
  }

  function clampSelection(list, allowed){
    const allow = new Set(allowed.map(String));
    return uniq(list).map(String).filter(v=>allow.has(v));
  }

  function makeHatchDecal(){
    return {
      symbol: 'rect',
      symbolSize: 2,
      dashArrayX: [1, 0],
      dashArrayY: [4, 3],
      rotation: Math.PI / 4,
      color: 'rgba(255,255,255,0.45)'
    };
  }

  function fmtArppu(utils, v){
    if (!utils || typeof utils.fmtMoney !== 'function') return (v==null ? '—' : String(v));
    return utils.fmtMoney(v, 'USD', 2);
  }

  function safeInitECharts(el){
    if (!window.echarts || !el) return null;
    try{
      return window.echarts.init(el);
    }catch(_e){
      return null;
    }
  }

  function computeDailyArppu(row, metric){
    if (!row) return null;
    const payersKey = metric === 'D7' ? 'D7_unique_purchase' : 'D0_unique_purchase';
    const valueKey = metric === 'D7' ? 'D7_PURCHASE_VALUE' : 'D0_PURCHASE_VALUE';
    const payers = Number(row[payersKey]);
    const value = Number(row[valueKey]);
    if (!Number.isFinite(payers) || payers <= 0) return null;
    if (!Number.isFinite(value)) return null;
    return value / payers;
  }

  function aggregateMonthlyArppu(rows, metric){
    const payersKey = metric === 'D7' ? 'D7_unique_purchase' : 'D0_unique_purchase';
    const valueKey = metric === 'D7' ? 'D7_PURCHASE_VALUE' : 'D0_PURCHASE_VALUE';
    const payers = sumNums(rows.map(r=>r && r[payersKey]));
    const value = sumNums(rows.map(r=>r && r[valueKey]));
    if (!Number.isFinite(payers) || payers <= 0) return null;
    return value / payers;
  }

  function render({ mountEl, rawByMonth, months, latestMonth, utils }){
    if (!mountEl) return;

    const allMonths = Array.isArray(months) && months.length
      ? months.map(String)
      : Object.keys(rawByMonth || {}).map(String).sort((a,b)=>a.localeCompare(b));

    const defaultMonth = (latestMonth && String(latestMonth)) || (allMonths.length ? allMonths[allMonths.length - 1] : null);

    const state = {
      months: defaultMonth ? [defaultMonth] : [],
      countries: COUNTRY_ORDER.slice(),
      chartType: 'bar', // 'bar' | 'line'
      metrics: METRIC_ORDER.slice(), // ['D0','D7']
    };

    mountEl.innerHTML = `
      <style>
        .om-arppu{ display:flex; flex-direction:column; gap:12px; }
        .om-arppu .om-filters{
          display:flex;
          flex-direction:column;
          gap:10px;
          padding:12px;
          border:1px solid rgba(148, 163, 184, 0.60);
          border-radius:12px;
          background: rgba(249, 250, 251, 0.90);
        }
        .om-arppu .om-filter-block{ display:flex; flex-direction:column; gap:6px; }
        .om-arppu .om-filter-row{ display:flex; flex-wrap:wrap; gap:12px; }
        .om-arppu .om-filter-inline{ flex: 1 1 240px; display:flex; flex-direction:column; gap:6px; }
        .om-arppu .om-filter-title{
          font-size:11px;
          color: var(--muted);
          letter-spacing: .2px;
        }
        .om-arppu .om-options{
          display:flex;
          flex-wrap:wrap;
          gap:8px;
        }
        .om-arppu .om-check{
          display:inline-flex;
          align-items:center;
          gap:8px;
          padding:6px 10px;
          border:1px solid rgba(148, 163, 184, 0.55);
          border-radius:999px;
          background:#ffffff;
          cursor:pointer;
          user-select:none;
          font-size:12px;
          color: var(--text);
        }
        .om-arppu .om-check input{ transform: translateY(0.5px); }
        .om-arppu .om-check.is-active{
          border-color: rgba(37, 99, 235, 0.55);
          box-shadow: 0 8px 18px rgba(37, 99, 235, 0.10);
        }
        .om-arppu .om-chart-wrap{ display:flex; flex-direction:column; gap:8px; }
        .om-arppu .om-table-wrap{
          border:1px solid rgba(148, 163, 184, 0.60);
          border-radius:12px;
          background:#ffffff;
          overflow:auto;
        }
        .om-arppu table.om-table{
          width:100%;
          border-collapse:separate;
          border-spacing:0;
          min-width: 620px;
        }
        .om-arppu table.om-table th,
        .om-arppu table.om-table td{
          padding:10px 10px;
          font-size:12px;
          border-bottom:1px solid rgba(148, 163, 184, 0.35);
          white-space:nowrap;
        }
        .om-arppu table.om-table thead th{
          position:sticky;
          top:0;
          background: rgba(249, 250, 251, 0.95);
          z-index:2;
          color: var(--text);
          font-weight: 600;
        }
        .om-arppu table.om-table tbody tr:hover td{
          background: rgba(37, 99, 235, 0.04);
        }
        .om-arppu table.om-table th:first-child,
        .om-arppu table.om-table td:first-child{
          position:sticky;
          left:0;
          background:#ffffff;
          z-index:1;
          font-weight:600;
        }
        .om-arppu table.om-table thead th:first-child{
          background: rgba(249, 250, 251, 0.95);
          z-index:3;
        }
        .om-arppu .om-insight-head{
          display:flex;
          align-items:flex-end;
          justify-content:space-between;
          gap:10px;
          margin-bottom:6px;
        }
        .om-arppu .om-insight-title{
          font-size:12px;
          font-weight:600;
          color: var(--text);
        }
        .om-arppu .om-insight-meta{
          font-size:11px;
          color: var(--muted);
        }
      </style>

      <div class="om-arppu">
        <div class="om-filters">
          <div class="om-filter-block">
            <div class="om-filter-title">月份（多选）</div>
            <div class="om-options" id="om-arppu-months"></div>
          </div>

          <div class="om-filter-block">
            <div class="om-filter-title">国家（多选）</div>
            <div class="om-options" id="om-arppu-countries"></div>
          </div>

          <div class="om-filter-row">
            <div class="om-filter-inline">
              <div class="om-filter-title">图表（互斥）</div>
              <div class="om-options" id="om-arppu-chartType"></div>
            </div>

            <div class="om-filter-inline">
              <div class="om-filter-title">口径（多选）</div>
              <div class="om-options" id="om-arppu-metrics"></div>
            </div>
          </div>
        </div>

        <div class="om-chart-wrap">
          <div class="ovp-chart" id="om-arppu-chart" style="height:420px;"></div>
          <div class="ovp-chart-note" id="om-arppu-note"></div>
        </div>

        <div class="om-table-wrap">
          <table class="om-table" id="om-arppu-table"></table>
        </div>

        <div>
          <div class="om-insight-head">
            <div class="om-insight-title">数据解读</div>
            <div class="om-insight-meta" id="om-arppu-insight-meta"></div>
          </div>
          <div class="ovp-insight is-empty" id="om-arppu-insight">文案待填写：./insights.js</div>
        </div>
      </div>
    `;

    const elMonths = mountEl.querySelector('#om-arppu-months');
    const elCountries = mountEl.querySelector('#om-arppu-countries');
    const elChartType = mountEl.querySelector('#om-arppu-chartType');
    const elMetrics = mountEl.querySelector('#om-arppu-metrics');
    const elChart = mountEl.querySelector('#om-arppu-chart');
    const elNote = mountEl.querySelector('#om-arppu-note');
    const elTable = mountEl.querySelector('#om-arppu-table');
    const elInsight = mountEl.querySelector('#om-arppu-insight');
    const elInsightMeta = mountEl.querySelector('#om-arppu-insight-meta');

    const chart = safeInitECharts(elChart);

    const monthColor = {};
    allMonths.forEach((m, idx)=>{
      monthColor[String(m)] = PALETTE_MONTH[idx % PALETTE_MONTH.length];
    });

    const countryColor = {};
    COUNTRY_ORDER.forEach((c, idx)=>{
      countryColor[String(c)] = PALETTE_COUNTRY[idx % PALETTE_COUNTRY.length];
    });

    function setActiveClass(labelEl, checked){
      if (!labelEl) return;
      if (checked) labelEl.classList.add('is-active');
      else labelEl.classList.remove('is-active');
    }

    function mountChecks(container, items, isChecked, onToggle){
      if (!container) return;
      container.innerHTML = '';
      for (const it of items){
        const label = document.createElement('label');
        label.className = 'om-check';
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.value = String(it.value);
        input.checked = !!isChecked(it.value);

        const span = document.createElement('span');
        span.textContent = String(it.label);

        label.appendChild(input);
        label.appendChild(span);
        setActiveClass(label, input.checked);

        input.addEventListener('change', ()=>{
          setActiveClass(label, input.checked);
          onToggle(input.value, input.checked);
        });

        container.appendChild(label);
      }
    }

    function syncChecks(container, selectedValues){
      if (!container) return;
      const set = new Set((selectedValues || []).map(String));
      for (const label of container.querySelectorAll('label.om-check')){
        const input = label.querySelector('input[type="checkbox"]');
        if (!input) continue;
        const checked = set.has(String(input.value));
        input.checked = checked;
        setActiveClass(label, checked);
      }
    }

    function normalizeState(){
      // months
      state.months = clampSelection(state.months, allMonths);
      if (!state.months.length && defaultMonth) state.months = [defaultMonth];

      // countries
      state.countries = clampSelection(state.countries, COUNTRY_ORDER);
      if (!state.countries.length) state.countries = COUNTRY_ORDER.slice();

      // chartType
      if (state.chartType !== 'bar' && state.chartType !== 'line') state.chartType = 'bar';

      // metrics
      state.metrics = clampSelection(state.metrics, METRIC_ORDER);
      if (!state.metrics.length) state.metrics = ['D0'];
    }

    function getSelectedMonthsSorted(){
      const ms = utils && typeof utils.sortMonths === 'function'
        ? utils.sortMonths(state.months)
        : state.months.slice().sort((a,b)=>String(a).localeCompare(String(b)));
      return ms.map(String);
    }

    function getSelectedCountriesOrdered(){
      const set = new Set(state.countries.map(String));
      return COUNTRY_ORDER.filter(c=>set.has(c));
    }

    function getSelectedMetricsOrdered(){
      const set = new Set(state.metrics.map(String));
      return METRIC_ORDER.filter(m=>set.has(m));
    }

    function pickInsightMonth(){
      const ms = getSelectedMonthsSorted();
      if (!ms.length) return defaultMonth;
      return ms[ms.length - 1];
    }

    function rowsForMonthCountry(month, country){
      const rows = (rawByMonth && rawByMonth[month]) ? rawByMonth[month] : [];
      if (!Array.isArray(rows) || !rows.length) return [];
      return rows.filter(r => r && String(r.country) === String(country));
    }

    function buildBarOption(){
      const ms = getSelectedMonthsSorted();
      const cs = getSelectedCountriesOrdered();
      const metrics = getSelectedMetricsOrdered();

      const series = [];
      const hatch = makeHatchDecal();

      for (const month of ms){
        for (const metric of metrics){
          const isD7 = metric === 'D7';
          const data = cs.map(country=>{
            const rows = rowsForMonthCountry(month, country);
            return aggregateMonthlyArppu(rows, metric);
          });

          series.push({
            name: `${getMonthLabel(month, ms)} ${metric}`,
            type: 'bar',
            data,
            barMaxWidth: 18,
            emphasis: { focus: 'series' },
            itemStyle: {
              color: monthColor[month],
              decal: isD7 ? hatch : null
            }
          });
        }
      }

      const option = {
        grid: { left: 46, right: 18, top: 48, bottom: 52, containLabel: true },
        legend: {
          top: 8,
          left: 0,
          textStyle: { color: '#475569', fontSize: 11 }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: (params)=>{
            const ps = Array.isArray(params) ? params : [params];
            const axis = (ps[0] && ps[0].axisValueLabel) ? ps[0].axisValueLabel : '';
            const lines = ps.map(p=>{
              const v = p && (p.data == null ? null : p.data);
              return `${p.marker}${p.seriesName}：${fmtArppu(utils, v)}`;
            });
            return [axis, ...lines].join('<br/>');
          }
        },
        xAxis: {
          type: 'category',
          data: cs,
          axisTick: { alignWithLabel: true },
          axisLabel: { color: '#64748b' },
          axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.55)' } }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#64748b',
            formatter: (v)=>{
              const n = Number(v);
              return Number.isFinite(n) ? n.toFixed(2) : '';
            }
          },
          splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.22)' } }
        },
        series
      };

      return option;
    }

    function buildLineOption(){
      const ms = getSelectedMonthsSorted();
      const cs = getSelectedCountriesOrdered();
      const metrics = getSelectedMetricsOrdered();

      const series = [];

      for (const country of cs){
        for (const metric of metrics){
          const points = [];
          for (const month of ms){
            const rows = rowsForMonthCountry(month, country);
            for (const r of rows){
              const date = r && r.date ? String(r.date) : null;
              if (!date) continue;
              const v = computeDailyArppu(r, metric);
              points.push([date, v]);
            }
          }
          points.sort((a,b)=>String(a[0]).localeCompare(String(b[0])));

          series.push({
            name: `${country} ${metric}`,
            type: 'line',
            showSymbol: false,
            connectNulls: false,
            data: points,
            lineStyle: {
              width: 2,
              type: metric === 'D0' ? 'dashed' : 'solid',
              color: countryColor[country]
            },
            itemStyle: { color: countryColor[country] }
          });
        }
      }

      const option = {
        grid: { left: 46, right: 18, top: 48, bottom: 52, containLabel: true },
        legend: {
          top: 8,
          left: 0,
          textStyle: { color: '#475569', fontSize: 11 }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'line' },
          formatter: (params)=>{
            const ps = Array.isArray(params) ? params : [params];
            const axis = (ps[0] && ps[0].axisValueLabel) ? ps[0].axisValueLabel : '';
            const lines = ps.map(p=>{
              const v = (p && p.data && Array.isArray(p.data)) ? p.data[1] : null;
              return `${p.marker}${p.seriesName}：${fmtArppu(utils, v)}`;
            });
            return [axis, ...lines].join('<br/>');
          }
        },
        xAxis: {
          type: 'time',
          axisLabel: { color: '#64748b' },
          axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.55)' } },
          splitLine: { show: false }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#64748b',
            formatter: (v)=>{
              const n = Number(v);
              return Number.isFinite(n) ? n.toFixed(2) : '';
            }
          },
          splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.22)' } }
        },
        series
      };

      return option;
    }

    function renderChart(){
      if (!chart){
        if (elNote) elNote.textContent = '图表未初始化：请确认 echarts 已加载。';
        return;
      }

      normalizeState();

      const ms = getSelectedMonthsSorted();
      const cs = getSelectedCountriesOrdered();
      const metrics = getSelectedMetricsOrdered();
      const insightMonth = pickInsightMonth();

      // note
      if (elNote){
        const rangeText = ms.length ? `${ms[0]} ~ ${ms[ms.length - 1]}` : '—';
        elNote.textContent = `口径：ARPPU = PURCHASE_VALUE / unique_purchase；汇总：sum(value)/sum(payers)。币种/单位按 data.js 的 PURCHASE_VALUE。区间：${rangeText}；国家：${cs.join('/') || '—'}；数据：${metrics.join('/') || '—'}；图：${state.chartType === 'bar' ? '月度柱状图' : '日级折线图'}`;
      }

      const option = state.chartType === 'line' ? buildLineOption() : buildBarOption();
      chart.setOption(option, true);

      // insight
      if (elInsightMeta){
        elInsightMeta.textContent = insightMonth ? `对应月份：${insightMonth}` : '';
      }
      if (OVP.ui && typeof OVP.ui.renderInsight === 'function'){
        OVP.ui.renderInsight({ moduleId: MODULE_ID, month: insightMonth, el: elInsight });
      } else if (elInsight){
        elInsight.textContent = '文案系统未就绪：请确认 insights.js 已加载且 OVP.ui.renderInsight 可用。';
        elInsight.classList.add('is-empty');
      }
    }

    function renderTable(){
      normalizeState();
      const ms = getSelectedMonthsSorted();
      const cs = getSelectedCountriesOrdered();
      const metrics = getSelectedMetricsOrdered();

      const ths = [];
      ths.push('<th>国家</th>');
      for (const month of ms){
        const mLabel = getMonthLabel(month, ms);
        for (const metric of metrics){
          ths.push(`<th>${mLabel} ${metric} ARPPU</th>`);
        }
      }

      const rowsHtml = [];
      for (const country of cs){
        const tds = [];
        tds.push(`<td>${country}</td>`);
        for (const month of ms){
          for (const metric of metrics){
            const rows = rowsForMonthCountry(month, country);
            const v = aggregateMonthlyArppu(rows, metric);
            tds.push(`<td>${fmtArppu(utils, v)}</td>`);
          }
        }
        rowsHtml.push(`<tr>${tds.join('')}</tr>`);
      }

      elTable.innerHTML = `
        <thead><tr>${ths.join('')}</tr></thead>
        <tbody>${rowsHtml.join('')}</tbody>
      `;
    }

    function rerenderAll(){
      renderChart();
      renderTable();
    }

    // Mount filter controls
    mountChecks(
      elMonths,
      allMonths.map(m=>({ value:m, label:m })),
      (v)=>state.months.includes(String(v)),
      (v, checked)=>{
        const vv = String(v);
        const next = new Set(state.months.map(String));
        if (checked) next.add(vv);
        else next.delete(vv);
        state.months = [...next];
        normalizeState();
        syncChecks(elMonths, state.months);
        rerenderAll();
      }
    );

    mountChecks(
      elCountries,
      COUNTRY_ORDER.map(c=>({ value:c, label:c })),
      (v)=>state.countries.includes(String(v)),
      (v, checked)=>{
        const vv = String(v);
        const next = new Set(state.countries.map(String));
        if (checked) next.add(vv);
        else next.delete(vv);
        state.countries = [...next];
        normalizeState();
        syncChecks(elCountries, state.countries);
        rerenderAll();
      }
    );

    mountChecks(
      elChartType,
      [
        { value:'bar', label:'月度柱状图' },
        { value:'line', label:'日级折线图' }
      ],
      (v)=>state.chartType === String(v),
      (v, checked)=>{
        const vv = String(v);
        if (!checked){
          // 不允许两者都取消，保持当前
          syncChecks(elChartType, [state.chartType]);
          return;
        }
        state.chartType = (vv === 'line') ? 'line' : 'bar';
        // 互斥：只保留一个选中
        syncChecks(elChartType, [state.chartType]);
        rerenderAll();
      }
    );

    mountChecks(
      elMetrics,
      [
        { value:'D0', label:'D0' },
        { value:'D7', label:'D7' }
      ],
      (v)=>state.metrics.includes(String(v)),
      (v, checked)=>{
        const vv = String(v);
        const next = new Set(state.metrics.map(String));
        if (checked) next.add(vv);
        else next.delete(vv);
        state.metrics = [...next];
        normalizeState();
        syncChecks(elMetrics, state.metrics);
        rerenderAll();
      }
    );

    // initial
    normalizeState();
    syncChecks(elMonths, state.months);
    syncChecks(elCountries, state.countries);
    syncChecks(elChartType, [state.chartType]);
    syncChecks(elMetrics, state.metrics);

    rerenderAll();

    // resize
    try{
      if (chart && typeof ResizeObserver !== 'undefined'){
        const ro = new ResizeObserver(()=>chart.resize());
        ro.observe(elChart);
      } else if (chart){
        window.addEventListener('resize', ()=>chart.resize());
      }
    }catch(_e){
      // ignore
    }
  }

  if (typeof OVP.registerModule === 'function'){
    OVP.registerModule({
      id: MODULE_ID,
      title: 'D0 / D7 ARPPU',
      subtitle: 'ARPPU = PURCHASE_VALUE / unique_purchase · 柱状（月度汇总）/ 折线（日级）可切换',
      render
    });
  }
})();
