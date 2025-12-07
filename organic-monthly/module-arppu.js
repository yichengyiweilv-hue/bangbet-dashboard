(function(){
  'use strict';

  if (!window.OVP || typeof window.OVP.registerModule !== 'function') return;

  const moduleId = 'arppu';
  const COUNTRY_ORDER = ['GH','KE','NG','TZ','UG'];
  const METRIC_ORDER = ['D0','D7'];

  const cssVar = (name, fallback)=>{
    try{
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v || fallback;
    }catch(_){
      return fallback;
    }
  };

  const n0 = (v)=>{
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const ratio = (num, den)=>{
    const d = n0(den);
    const x = n0(num);
    if (d <= 0) return null;
    return x / d;
  };

  const fmt2 = (v)=>{
    if (v === null || v === undefined) return '—';
    const n = Number(v);
    if (!Number.isFinite(n)) return '—';
    return n.toLocaleString('en-US',{ minimumFractionDigits:2, maximumFractionDigits:2 });
  };

  const sortMonths = (ms)=>{
    if (window.OVP && OVP.utils && typeof OVP.utils.sortMonths === 'function') return OVP.utils.sortMonths(ms);
    return (Array.isArray(ms) ? ms.slice() : []).sort((a,b)=>String(a).localeCompare(String(b)));
  };

  const safeId = (s)=>String(s).replace(/[^a-zA-Z0-9_-]/g,'_');

  function ensureCss(){
    const id = 'ovp-arppu-css';
    if (document.getElementById(id)) return;

    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      /* ============ Module ARPPU (scoped) ============ */
      .ovp-arppu .ovp-arppu-filters{
        display:flex;
        flex-wrap:wrap;
        gap:10px 12px;
        align-items:flex-start;
        padding:10px 12px;
        border:1px solid rgba(148, 163, 184, 0.60);
        border-radius:12px;
        background:#ffffff;
      }
      .ovp-arppu .ovp-arppu-fg{
        display:flex;
        flex-direction:column;
        gap:8px;
        min-width:220px;
      }
      @media (max-width: 900px){
        .ovp-arppu .ovp-arppu-fg{ min-width: 100%; }
      }
      .ovp-arppu .ovp-arppu-fg-title{
        font-size:11px;
        color:var(--muted);
        line-height:1.4;
      }
      .ovp-arppu .ovp-arppu-options{
        display:flex;
        flex-wrap:wrap;
        gap:8px;
      }
      .ovp-arppu .ovp-arppu-chip{
        position:relative;
        display:inline-flex;
        align-items:center;
        padding:6px 10px;
        border-radius:999px;
        border:1px solid rgba(148, 163, 184, 0.60);
        background: rgba(249, 250, 251, 0.90);
        color: var(--text);
        font-size:12px;
        line-height:1;
        cursor:pointer;
        user-select:none;
        transition: background .12s ease, border-color .12s ease;
      }
      .ovp-arppu .ovp-arppu-chip input{
        position:absolute;
        opacity:0;
        pointer-events:none;
      }
      .ovp-arppu .ovp-arppu-chip.is-on{
        border-color: rgba(32, 83, 164, 0.75);
        background: rgba(32, 83, 164, 0.08);
      }
      .ovp-arppu .ovp-arppu-chip:hover{
        border-color: rgba(32, 83, 164, 0.55);
      }

      .ovp-arppu .ovp-arppu-tablewrap{
        border:1px solid rgba(148, 163, 184, 0.60);
        border-radius:12px;
        background:#ffffff;
        overflow:hidden;
      }
      .ovp-arppu .ovp-arppu-tablemeta{
        padding:10px 12px;
        font-size:11px;
        color:var(--muted);
        border-bottom:1px solid rgba(148, 163, 184, 0.35);
        background: rgba(249, 250, 251, 0.90);
        line-height:1.4;
      }
      .ovp-arppu .ovp-arppu-table-scroll{
        overflow:auto;
      }
      .ovp-arppu table.ovp-arppu-table{
        width:100%;
        border-collapse:collapse;
        font-size:12px;
      }
      .ovp-arppu .ovp-arppu-table th,
      .ovp-arppu .ovp-arppu-table td{
        padding:10px 12px;
        border-bottom:1px solid rgba(148, 163, 184, 0.25);
        white-space:nowrap;
      }
      .ovp-arppu .ovp-arppu-table tbody tr:last-child td{
        border-bottom:none;
      }
      .ovp-arppu .ovp-arppu-table th{
        text-align:left;
        font-weight:600;
        color: var(--muted);
        background: rgba(249, 250, 251, 0.65);
      }
      .ovp-arppu .ovp-arppu-table td.dim{
        color: var(--text);
        font-weight:600;
      }
      .ovp-arppu .ovp-arppu-table td.num{
        text-align:right;
        font-variant-numeric: tabular-nums;
      }
    `.trim();
    document.head.appendChild(style);
  }

  function buildChip({ group, key, label, checked }){
    const id = `arppu-${group}-${safeId(key)}`;
    const lab = document.createElement('label');
    lab.className = 'ovp-arppu-chip';
    if (checked) lab.classList.add('is-on');

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = id;
    input.dataset.group = group;
    input.dataset.key = key;
    input.checked = !!checked;

    const span = document.createElement('span');
    span.textContent = label;

    lab.appendChild(input);
    lab.appendChild(span);
    return lab;
  }

  function renderGroup(panelEl, { title, group, options, selectedKeys }){
    const fg = document.createElement('div');
    fg.className = 'ovp-arppu-fg';

    const t = document.createElement('div');
    t.className = 'ovp-arppu-fg-title';
    t.textContent = title;

    const opts = document.createElement('div');
    opts.className = 'ovp-arppu-options';

    for (const o of options){
      const checked = selectedKeys.has(o.key);
      opts.appendChild(buildChip({ group, key: o.key, label: o.label, checked }));
    }

    fg.appendChild(t);
    fg.appendChild(opts);
    panelEl.appendChild(fg);
  }

  function syncChipStyles(panelEl){
    panelEl.querySelectorAll('.ovp-arppu-chip').forEach((lab)=>{
      const input = lab.querySelector('input');
      if (!input) return;
      lab.classList.toggle('is-on', input.checked);
    });
  }

  function flattenRows(rawByMonth, monthsSel){
    const rows = [];
    for (const m of monthsSel){
      const arr = rawByMonth && rawByMonth[m];
      if (Array.isArray(arr)) rows.push(...arr);
    }
    return rows;
  }

  function aggregateByCountry(rows){
    const map = new Map();
    for (const r of rows){
      if (!r) continue;
      const c = r.country;
      if (!COUNTRY_ORDER.includes(c)) continue;

      const prev = map.get(c) || { d0Value:0, d0Users:0, d7Value:0, d7Users:0 };
      prev.d0Value += n0(r.D0_PURCHASE_VALUE);
      prev.d0Users += n0(r.D0_unique_purchase);
      prev.d7Value += n0(r.D7_PURCHASE_VALUE);
      prev.d7Users += n0(r.D7_unique_purchase);
      map.set(c, prev);
    }
    return map;
  }

  function dailyByCountry(rows){
    // key: date|country => sums
    const keyMap = new Map();
    for (const r of rows){
      if (!r) continue;
      const date = r.date;
      const country = r.country;
      if (!date || !country || !COUNTRY_ORDER.includes(country)) continue;

      const k = `${date}|${country}`;
      const obj = keyMap.get(k) || { date, country, d0Value:0, d0Users:0, d7Value:0, d7Users:0 };
      obj.d0Value += n0(r.D0_PURCHASE_VALUE);
      obj.d0Users += n0(r.D0_unique_purchase);
      obj.d7Value += n0(r.D7_PURCHASE_VALUE);
      obj.d7Users += n0(r.D7_unique_purchase);
      keyMap.set(k, obj);
    }

    const byCountry = new Map();
    for (const obj of keyMap.values()){
      const arr = byCountry.get(obj.country) || [];
      arr.push({
        date: obj.date,
        d0: ratio(obj.d0Value, obj.d0Users),
        d7: ratio(obj.d7Value, obj.d7Users)
      });
      byCountry.set(obj.country, arr);
    }

    for (const arr of byCountry.values()){
      arr.sort((a,b)=>String(a.date).localeCompare(String(b.date)));
    }
    return byCountry;
  }

  function getDateRange(rows){
    let min = null;
    let max = null;
    for (const r of rows){
      const d = r && r.date ? String(r.date) : '';
      if (!d) continue;
      if (min === null || d < min) min = d;
      if (max === null || d > max) max = d;
    }
    return { min, max };
  }

  function extractPointValue(v){
    if (Array.isArray(v)) return v[1];
    return v;
  }

  function buildLineTooltipFormatter(){
    return function(params){
      const arr = Array.isArray(params) ? params : [params];
      if (!arr.length) return '';
      const axis = arr[0].axisValue;
      const axisStr = (typeof axis === 'string')
        ? axis.slice(0, 10)
        : (axis ? new Date(axis).toISOString().slice(0,10) : '');

      const lines = [axisStr];
      for (const p of arr){
        const sid = String(p.seriesId || '');
        const parts = sid.split('|');
        const country = p.seriesName || parts[0] || '';
        const metric = parts[1] || '';
        const val = extractPointValue(p.value);
        lines.push(`${p.marker}${country} ${metric}: ${fmt2(val)}`);
      }
      return lines.join('<br/>');
    };
  }

  OVP.registerModule({
    id: moduleId,
    title: 'D0 / D7 ARPPU',
    subtitle: '口径：PURCHASE_VALUE / unique_purchase（单位：币种同 data.js）',
    span: 'full',

    render({ mountEl, rawByMonth, months, latestMonth }){
      ensureCss();
      if (!mountEl) return;
      mountEl.classList.add('ovp-arppu');

      const { chartEl, chartNoteEl, insightEl } = OVP.ui.mountModule(mountEl, { moduleId, chartHeight: 360 });
      const stack = mountEl.querySelector('.ovp-module-stack');

      // Build extra blocks: filters + table
      const filterPanel = document.createElement('div');
      filterPanel.className = 'ovp-arppu-filters';

      const tableWrap = document.createElement('div');
      tableWrap.className = 'ovp-arppu-tablewrap';

      const tableMetaEl = document.createElement('div');
      tableMetaEl.className = 'ovp-arppu-tablemeta';

      const tableScrollEl = document.createElement('div');
      tableScrollEl.className = 'ovp-arppu-table-scroll';

      const tableEl = document.createElement('table');
      tableEl.className = 'ovp-arppu-table';

      tableScrollEl.appendChild(tableEl);
      tableWrap.appendChild(tableMetaEl);
      tableWrap.appendChild(tableScrollEl);

      // Insert into stack
      if (stack){
        const chartBlock = chartEl ? chartEl.parentElement : null; // <div> that wraps chart + note
        if (chartBlock) stack.insertBefore(filterPanel, chartBlock);
        if (insightEl) stack.insertBefore(tableWrap, insightEl);
      }

      const allMonths = sortMonths(Array.isArray(months) ? months : Object.keys(rawByMonth || {}));
      const initialMonth = latestMonth || (allMonths.length ? allMonths[allMonths.length - 1] : null);

      const state = {
        months: new Set(initialMonth ? [initialMonth] : []),
        countries: new Set(COUNTRY_ORDER),
        metrics: new Set(METRIC_ORDER),
        chartType: 'bar'
      };

      function selectedMonths(){
        const sel = sortMonths([...state.months]).filter(m=>allMonths.includes(m));
        if (!sel.length && initialMonth) sel.push(initialMonth);
        return sel;
      }

      function selectedCountries(){
        const set = state.countries;
        const sel = COUNTRY_ORDER.filter(c=>set.has(c));
        if (!sel.length) return COUNTRY_ORDER.slice();
        return sel;
      }

      function selectedMetrics(){
        const set = state.metrics;
        const sel = METRIC_ORDER.filter(m=>set.has(m));
        if (!sel.length) return METRIC_ORDER.slice();
        return sel;
      }

      function applyStateToInputs(){
        // month / country / metric
        filterPanel.querySelectorAll('input[type="checkbox"][data-group]').forEach((inp)=>{
          const group = inp.dataset.group;
          const key = inp.dataset.key;
          if (group === 'month') inp.checked = state.months.has(key);
          if (group === 'country') inp.checked = state.countries.has(key);
          if (group === 'metric') inp.checked = state.metrics.has(key);
          if (group === 'chart') inp.checked = (state.chartType === key);
        });
        syncChipStyles(filterPanel);
      }

      function rebuildFilters(){
        filterPanel.innerHTML = '';

        renderGroup(filterPanel, {
          title: '月份（多选）',
          group: 'month',
          options: allMonths.map(m=>({ key:m, label:m })),
          selectedKeys: state.months
        });

        renderGroup(filterPanel, {
          title: '国家（多选）',
          group: 'country',
          options: COUNTRY_ORDER.map(c=>({ key:c, label:c })),
          selectedKeys: state.countries
        });

        renderGroup(filterPanel, {
          title: '图表（单选）',
          group: 'chart',
          options: [
            { key:'bar', label:'月度柱状图' },
            { key:'line', label:'日级折线图' }
          ],
          selectedKeys: new Set([state.chartType])
        });

        renderGroup(filterPanel, {
          title: '口径（多选）',
          group: 'metric',
          options: [
            { key:'D0', label:'D0 数据' },
            { key:'D7', label:'D7 数据' }
          ],
          selectedKeys: state.metrics
        });

        applyStateToInputs();
      }

      // --------- Chart instance ----------
      let chart = null;
      const chartReady = ()=>{
        if (!chartEl) return false;
        if (!window.echarts) return false;
        if (chart) return true;

        chartEl.classList.remove('is-empty');
        chartEl.innerHTML = '';
        chart = echarts.init(chartEl);

        // Keep resize smooth
        if (window.ResizeObserver){
          const ro = new ResizeObserver(()=>{ try{ chart && chart.resize(); }catch(_){} });
          ro.observe(chartEl);
        }
        window.addEventListener('resize', ()=>{ try{ chart && chart.resize(); }catch(_){} }, { passive:true });

        return true;
      };

      function setChartOption(option){
        if (!chartReady()){
          if (chartNoteEl) chartNoteEl.textContent = 'ECharts 未加载或图表容器不可用。';
          return;
        }
        chart.setOption(option, true);
      }

      function showNoData(msg){
        const message = String(msg || '无数据');
        if (!chartReady()){
          if (chartNoteEl) chartNoteEl.textContent = message;
          return;
        }
        try{
          chart.clear();
          const textMuted = cssVar('--muted', '#475569');
          chart.setOption({
            xAxis: { show:false },
            yAxis: { show:false },
            series: [],
            grid: { top: 16, left: 16, right: 16, bottom: 16 },
            graphic: [{
              type: 'text',
              left: 'center',
              top: 'middle',
              style: { text: message, fill: textMuted, fontSize: 12 }
            }]
          }, true);
        }catch(_){}
      }

      // --------- Render table ----------
      function renderTable({ aggMap, monthsSel, countriesSel, metricsSel }){
        const metricsToShow = metricsSel.length ? metricsSel : METRIC_ORDER.slice();

        const monthText = monthsSel.length ? monthsSel.join(', ') : '—';
        tableMetaEl.textContent = `月份：${monthText} · 国家：${countriesSel.join(', ')} · 口径：ARPPU = PURCHASE_VALUE / unique_purchase`;

        const cols = [
          { key:'country', label:'国家', cls:'dim' },
          ...metricsToShow.map(m=>({
            key: m,
            label: `自然量 ${m} ARPPU`,
            cls:'num'
          }))
        ];

        const thead = `
          <thead>
            <tr>
              ${cols.map(c=>`<th class="${c.cls||''}">${c.label}</th>`).join('')}
            </tr>
          </thead>
        `.trim();

        const tbodyRows = countriesSel.map((c)=>{
          const agg = aggMap.get(c) || { d0Value:0, d0Users:0, d7Value:0, d7Users:0 };
          const d0 = ratio(agg.d0Value, agg.d0Users);
          const d7 = ratio(agg.d7Value, agg.d7Users);

          const values = {
            country: c,
            D0: d0,
            D7: d7
          };

          const tds = cols.map((col)=>{
            const v = values[col.key];
            if (col.key === 'country') return `<td class="dim">${String(v)}</td>`;
            return `<td class="num">${fmt2(v)}</td>`;
          }).join('');

          return `<tr>${tds}</tr>`;
        }).join('');

        const tbody = `<tbody>${tbodyRows}</tbody>`;
        tableEl.innerHTML = `${thead}${tbody}`;
      }

      // --------- Render charts ----------
      const palette = {
        GH: cssVar('--ovp-blue', '#2053A4'),
        KE: cssVar('--ovp-yellow', '#F2C14E'),
        NG: '#16a34a',
        TZ: '#7c3aed',
        UG: '#f97316'
      };

      function buildBarOption({ aggMap, countriesSel, metricsSel }){
        const textMuted = cssVar('--muted', '#475569');
        const barColor = cssVar('--ovp-blue', '#2053A4');
        const gridColor = 'rgba(148, 163, 184, 0.35)';

        const d0Data = countriesSel.map((c)=>{
          const a = aggMap.get(c);
          return a ? ratio(a.d0Value, a.d0Users) : null;
        });
        const d7Data = countriesSel.map((c)=>{
          const a = aggMap.get(c);
          return a ? ratio(a.d7Value, a.d7Users) : null;
        });

        const d7Decal = {
          symbol: 'rect',
          symbolSize: 1,
          rotation: Math.PI / 4,
          dashArrayX: [1, 3],
          dashArrayY: [3, 3],
          color: 'rgba(255,255,255,0.55)'
        };

        const series = [];
        if (metricsSel.includes('D0')){
          series.push({
            name: 'D0',
            type: 'bar',
            barMaxWidth: 32,
            itemStyle: { color: barColor },
            data: d0Data
          });
        }
        if (metricsSel.includes('D7')){
          series.push({
            name: 'D7',
            type: 'bar',
            barMaxWidth: 32,
            itemStyle: { color: barColor, decal: d7Decal },
            data: d7Data
          });
        }

        return {
          animationDuration: 260,
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: (params)=>{
              const arr = Array.isArray(params) ? params : [params];
              if (!arr.length) return '';
              const axis = arr[0].axisValueLabel || arr[0].name || '';
              const lines = [String(axis)];
              for (const p of arr){
                lines.push(`${p.marker}${p.seriesName}: ${fmt2(p.value)}`);
              }
              return lines.join('<br/>');
            }
          },
          legend: {
            top: 8,
            left: 12,
            textStyle: { color: textMuted, fontSize: 11 }
          },
          grid: { top: 52, left: 48, right: 18, bottom: 42, containLabel: true },
          xAxis: {
            type: 'category',
            data: countriesSel,
            axisLabel: { color: textMuted },
            axisLine: { lineStyle: { color: gridColor } },
            axisTick: { lineStyle: { color: gridColor } }
          },
          yAxis: {
            type: 'value',
            axisLabel: { color: textMuted, formatter: (v)=>fmt2(v) },
            splitLine: { lineStyle: { color: gridColor } }
          },
          series
        };
      }

      function buildLineOption({ byCountry, countriesSel, metricsSel }){
        const textMuted = cssVar('--muted', '#475569');
        const gridColor = 'rgba(148, 163, 184, 0.35)';
        const series = [];

        for (const c of countriesSel){
          const arr = byCountry.get(c) || [];
          const color = palette[c] || cssVar('--ovp-blue', '#2053A4');

          if (metricsSel.includes('D0')){
            series.push({
              id: `${c}|D0`,
              name: c, // legend by country (shared name)
              type: 'line',
              showSymbol: false,
              connectNulls: true,
              lineStyle: { type: 'dashed', width: 2, color },
              itemStyle: { color },
              data: arr.map(p=>[p.date, p.d0])
            });
          }
          if (metricsSel.includes('D7')){
            series.push({
              id: `${c}|D7`,
              name: c,
              type: 'line',
              showSymbol: false,
              connectNulls: true,
              lineStyle: { type: 'solid', width: 2, color },
              itemStyle: { color },
              data: arr.map(p=>[p.date, p.d7])
            });
          }
        }

        return {
          animationDuration: 260,
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'line' },
            formatter: buildLineTooltipFormatter()
          },
          legend: {
            data: countriesSel,
            top: 8,
            left: 12,
            textStyle: { color: textMuted, fontSize: 11 }
          },
          grid: { top: 52, left: 48, right: 18, bottom: 42, containLabel: true },
          xAxis: {
            type: 'time',
            axisLabel: { color: textMuted },
            axisLine: { lineStyle: { color: gridColor } },
            splitLine: { show: false }
          },
          yAxis: {
            type: 'value',
            axisLabel: { color: textMuted, formatter: (v)=>fmt2(v) },
            splitLine: { lineStyle: { color: gridColor } }
          },
          series
        };
      }

      // --------- Main render ----------
      function rerender(){
        const monthsSel = selectedMonths();
        const countriesSel = selectedCountries();
        const metricsSel = selectedMetrics();

        // 1) rows
        const rows = flattenRows(rawByMonth || {}, monthsSel)
          .filter(r => r && countriesSel.includes(r.country));

        // 2) table
        const aggMap = aggregateByCountry(rows);
        renderTable({ aggMap, monthsSel, countriesSel, metricsSel });

        // 3) insight (取选中月份的“最新月”)
        const monthForInsight = monthsSel.length ? sortMonths(monthsSel).slice(-1)[0] : initialMonth;
        OVP.ui.renderInsight({ moduleId, month: monthForInsight, el: insightEl });

        // 4) chart note
        const monthText = monthsSel.length ? monthsSel.join(', ') : '—';
        if (chartNoteEl){
          if (state.chartType === 'bar'){
            const metricText = metricsSel.join('/') || '—';
            const d7Hint = metricsSel.includes('D7') ? '· D7 为斜线填充。' : '';
            chartNoteEl.textContent = `柱状图：国家固定顺序（GH/KE/NG/TZ/UG）· 月份：${monthText}（多月为合并汇总）· 指标：${metricText}${d7Hint}`;
          } else {
            const { min, max } = getDateRange(rows);
            const rangeText = (min && max) ? `${min} ~ ${max}` : '—';
            const metricParts = [];
            if (metricsSel.includes('D0')) metricParts.push('D0 虚线');
            if (metricsSel.includes('D7')) metricParts.push('D7 实线');
            const metricHint = metricParts.length ? metricParts.join('、') : '—';
            chartNoteEl.textContent = `折线图：按日 · 区间：${rangeText} · 线型：${metricHint}（同国家同色）。`;
          }
        }

        // 5) chart
        if (!rows.length){
          const msg = '无数据：请检查月份/国家筛选。';
          if (chartNoteEl) chartNoteEl.textContent = msg;
          showNoData(msg);
          return;
        }

        if (state.chartType === 'bar'){
          setChartOption(buildBarOption({ aggMap, countriesSel, metricsSel }));
        } else {
          const byCountry = dailyByCountry(rows);
          setChartOption(buildLineOption({ byCountry, countriesSel, metricsSel }));
        }
      }

      // --------- Events ----------
      filterPanel.addEventListener('change', (e)=>{
        const inp = e.target;
        if (!(inp instanceof HTMLInputElement) || inp.type !== 'checkbox') return;

        const group = inp.dataset.group || '';
        const key = inp.dataset.key || '';
        if (!group || !key) return;

        if (group === 'chart'){
          if (inp.checked){
            state.chartType = key; // bar / line
          } else {
            // keep one selected
            inp.checked = true;
          }
          applyStateToInputs();
          rerender();
          return;
        }

        const set = (group === 'month') ? state.months
          : (group === 'country') ? state.countries
          : (group === 'metric') ? state.metrics
          : null;

        if (!set) return;

        if (inp.checked){
          set.add(key);
        } else {
          set.delete(key);
          // enforce min=1 per group
          if (set.size === 0){
            set.add(key);
            inp.checked = true;
          }
        }

        applyStateToInputs();
        rerender();
      });

      rebuildFilters();
      rerender();
    }
  });
})();
