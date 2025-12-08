(function(){
  const moduleId = 'playerMix';

  const COUNTRY_ORDER = ['GH','KE','NG','TZ','UG'];
  const WINDOW_ORDER = ['D0','D7'];
  const CHART_TYPES = [
    { key:'bar',  label:'月度柱状图' },
    { key:'line', label:'日级折线图' }
  ];

  function cssVar(name, fallback){
    try{
      const v = getComputedStyle(document.documentElement).getPropertyValue(name);
      return (v && v.trim()) ? v.trim() : fallback;
    }catch(_){
      return fallback;
    }
  }
  function clamp(n, min, max){
    if (!Number.isFinite(n)) return min;
    return Math.min(max, Math.max(min, n));
  }
  function num(v){
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  // Split TOTAL bet placed users into:
  // onlySports, onlyGames, both (sports & games), ensuring sum == total.
  function splitUnion(total, sports, games){
    const t = Math.max(0, num(total));
    const s = Math.max(0, num(sports));
    const g = Math.max(0, num(games));

    const onlySports = clamp(t - g, 0, t);
    const onlyGames  = clamp(t - s, 0, t);
    const both       = clamp(t - onlySports - onlyGames, 0, t);

    return { total: t, sports: s, games: g, onlySports, onlyGames, both };
  }

  function ensureStyle(){
    if (document.getElementById('ovp-style-playerMix')) return;
    const style = document.createElement('style');
    style.id = 'ovp-style-playerMix';
    style.textContent = `
      .ovp-pm-filters{
        border:1px solid rgba(148, 163, 184, 0.60);
        border-radius:12px;
        background: rgba(249, 250, 251, 0.90);
        padding:10px 10px 8px;
        display:flex;
        flex-wrap:wrap;
        gap:12px 14px;
      }
      .ovp-pm-filter-group{
        display:flex;
        flex-direction:column;
        gap:6px;
        min-width: 180px;
      }
      .ovp-pm-filter-label{
        font-size:11px;
        color: var(--muted);
        line-height:1.2;
        display:flex;
        align-items:center;
        gap:8px;
      }
      .ovp-pm-filter-label .ovp-pm-badge{
        display:inline-flex;
        align-items:center;
        padding:1px 8px;
        border-radius:999px;
        border:1px solid rgba(148, 163, 184, 0.55);
        background: rgba(255,255,255,0.9);
        color: var(--muted);
        font-size:10px;
      }
      .ovp-pm-options{
        display:flex;
        flex-wrap:wrap;
        gap:6px;
      }
      .ovp-pm-chip{
        display:inline-flex;
        align-items:center;
        gap:6px;
        padding:4px 10px;
        border-radius:999px;
        border:1px solid rgba(148, 163, 184, 0.55);
        background: rgba(255,255,255,0.88);
        font-size:12px;
        color: var(--text);
        cursor:pointer;
        user-select:none;
      }
      .ovp-pm-chip input{
        margin:0;
        width:14px;
        height:14px;
        accent-color: var(--ovp-blue);
        cursor:pointer;
      }
      .ovp-pm-chip.is-checked{
        border-color: rgba(37, 99, 235, 0.55);
        background: rgba(37, 99, 235, 0.08);
      }
      .ovp-pm-hint{
        margin-top:2px;
        font-size:11px;
        color: var(--muted);
        line-height:1.4;
      }

      .ovp-pm-table-scroll{
        width:100%;
        overflow:auto;
        border:1px solid rgba(148, 163, 184, 0.60);
        border-radius:12px;
        background:#ffffff;
      }
      .ovp-pm-table{
        width:100%;
        border-collapse:collapse;
        min-width: 760px;
      }
      .ovp-pm-table th,
      .ovp-pm-table td{
        border:1px solid rgba(148, 163, 184, 0.35);
        padding:10px 10px;
        font-size:12px;
        color: var(--text);
      }
      .ovp-pm-table thead th{
        background: rgba(249, 250, 251, 0.95);
        font-size:11px;
        color: var(--muted);
        text-align:center;
        position:sticky;
        top:0;
        z-index:2;
      }
      .ovp-pm-table tbody th{
        background: rgba(249, 250, 251, 0.65);
        font-weight:600;
        text-align:center;
        min-width: 74px;
      }
      .ovp-pm-cell{
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        min-height: 96px;
        text-align:center;
        white-space:pre-line;
        line-height:1.5;
      }

      .ovp-pm-insight-title{
        font-size:11px;
        color: var(--muted);
        margin-bottom:6px;
      }
      .ovp-pm-insight-body{
        font-size:12px;
        line-height:1.65;
        white-space: pre-wrap;
        word-break: break-word;
      }
      .ovp-pm-insight-body.is-empty{
        color: var(--muted);
      }
    `;
    document.head.appendChild(style);
  }

  function buildLayoutHTML(moduleId){
    return `
      <div class="ovp-module-stack">
        <div class="ovp-pm-filters" id="pm-filters-${moduleId}">
          <div class="ovp-pm-filter-group">
            <div class="ovp-pm-filter-label">月份<span class="ovp-pm-badge" id="pm-badge-months-${moduleId}">多选</span></div>
            <div class="ovp-pm-options" id="pm-months-${moduleId}"></div>
          </div>

          <div class="ovp-pm-filter-group">
            <div class="ovp-pm-filter-label">国家<span class="ovp-pm-badge" id="pm-badge-countries-${moduleId}">多选</span></div>
            <div class="ovp-pm-options" id="pm-countries-${moduleId}"></div>
          </div>

          <div class="ovp-pm-filter-group">
            <div class="ovp-pm-filter-label">图表类型<span class="ovp-pm-badge">单选</span></div>
            <div class="ovp-pm-options" id="pm-chartType-${moduleId}"></div>
          </div>

          <div class="ovp-pm-filter-group">
            <div class="ovp-pm-filter-label">D0 / D7<span class="ovp-pm-badge" id="pm-badge-windows-${moduleId}">多选</span></div>
            <div class="ovp-pm-options" id="pm-windows-${moduleId}"></div>
          </div>

          <div class="ovp-pm-filter-group" style="min-width:260px; flex: 1 1 auto;">
            <div class="ovp-pm-filter-label">提示</div>
            <div class="ovp-pm-hint" id="pm-hint-${moduleId}"></div>
          </div>
        </div>

        <div>
          <div class="ovp-chart" id="chart-${moduleId}" style="height:360px;"></div>
          <div class="ovp-chart-note" id="chart-note-${moduleId}"></div>
        </div>

        <div>
          <div class="ovp-pm-table-scroll">
            <table class="ovp-pm-table" id="table-${moduleId}"></table>
          </div>
          <div class="ovp-chart-note" id="table-note-${moduleId}"></div>
        </div>

        <div class="ovp-insight" id="insight-wrap-${moduleId}">
          <div class="ovp-pm-insight-title" id="insight-title-${moduleId}"></div>
          <div class="ovp-pm-insight-body is-empty" id="insight-${moduleId}">文案待填写：./insights.js</div>
        </div>
      </div>
    `;
  }

  function buildChipsHtml(options, group, labelFn){
    const fmt = (typeof labelFn === 'function') ? labelFn : (v)=>String(v);
    return (Array.isArray(options) ? options : []).map(v=>{
      const val = String(v);
      const label = fmt(val);
      return `
        <label class="ovp-pm-chip">
          <input type="checkbox" data-group="${group}" data-value="${val}" />
          <span>${label}</span>
        </label>
      `;
    }).join('');
  }

  OVP.registerModule({
    id: moduleId,
    title: 'D0/D7 体育 vs 游戏玩家比例',
    subtitle: '口径：D0/D7_TOTAL_BET_PLACED_USER 拆分为 仅游戏/双投/仅体育（单位：人、%）',
    span: 'full',

    render({ mountEl, rawByMonth, months, latestMonth, utils }){
      ensureStyle();

      if (!mountEl) return;
      if (!rawByMonth || typeof rawByMonth !== 'object'){
        mountEl.innerHTML = `<div class="ovp-alert">未检测到源数据 rawByMonth（RAW_ORGANIC_BY_MONTH）。</div>`;
        return;
      }
      if (!window.echarts){
        mountEl.innerHTML = `<div class="ovp-alert">未检测到 ECharts：请检查 echarts 是否已在页面加载。</div>`;
        return;
      }

      const allMonths = (utils && typeof utils.sortMonths === 'function')
        ? utils.sortMonths(Array.isArray(months) && months.length ? months : Object.keys(rawByMonth || {}))
        : (Array.isArray(months) ? months.slice() : Object.keys(rawByMonth || {}));

      if (!allMonths.length){
        mountEl.innerHTML = `<div class="ovp-alert">数据已加载，但未检测到月份 key（rawByMonth 为空）。</div>`;
        return;
      }

      const lm = latestMonth || allMonths[allMonths.length - 1];

      const state = {
        chartType: 'bar',
        months: new Set(lm ? [lm] : []),
        countries: new Set(COUNTRY_ORDER),
        windows: new Set(WINDOW_ORDER)
      };

      const cacheMonthly = new Map();

      function monthList(){
        return (utils && typeof utils.sortMonths === 'function')
          ? utils.sortMonths([...state.months])
          : [...state.months].sort((a,b)=>String(a).localeCompare(String(b)));
      }
      function countryList(){
        return COUNTRY_ORDER.filter(c=>state.countries.has(c));
      }
      function windowList(){
        return WINDOW_ORDER.filter(w=>state.windows.has(w));
      }

      function ensureAtLeastOne(set, fallback){
        if (set.size) return;
        if (fallback !== undefined && fallback !== null) set.add(String(fallback));
      }

      function enforceSingles(){
        // Ensure month single: pick latest selected
        ensureAtLeastOne(state.months, lm);
        const ms = monthList();
        state.months.clear();
        state.months.add(ms[ms.length - 1]);

        // Ensure country single: pick first by fixed order
        ensureAtLeastOne(state.countries, COUNTRY_ORDER[0]);
        const cs = countryList();
        state.countries.clear();
        state.countries.add(cs[0]);

        // Ensure window single: prefer D0 then D7
        ensureAtLeastOne(state.windows, 'D0');
        const ws = windowList();
        const pick = ws.includes('D0') ? 'D0' : ws[0];
        state.windows.clear();
        state.windows.add(pick);
      }

      function getMonthlySeg(month, country, win){
        const key = `${month}|${country}|${win}`;
        if (cacheMonthly.has(key)) return cacheMonthly.get(key);

        const rows = Array.isArray(rawByMonth[month]) ? rawByMonth[month] : [];
        const fTotal  = `${win}_TOTAL_BET_PLACED_USER`;
        const fSports = `${win}_SPORTS_BET_PLACED_USER`;
        const fGames  = `${win}_GAMES_BET_PLACED_USER`;

        let total = 0, sports = 0, games = 0;
        for (const r of rows){
          if (!r || String(r.country) !== String(country)) continue;
          total  += num(r[fTotal]);
          sports += num(r[fSports]);
          games  += num(r[fGames]);
        }

        const seg = splitUnion(total, sports, games);
        cacheMonthly.set(key, seg);
        return seg;
      }

      function getDailySeries(month, country, win){
        const rows = Array.isArray(rawByMonth[month]) ? rawByMonth[month] : [];
        const fTotal  = `${win}_TOTAL_BET_PLACED_USER`;
        const fSports = `${win}_SPORTS_BET_PLACED_USER`;
        const fGames  = `${win}_GAMES_BET_PLACED_USER`;

        const map = new Map(); // date -> sums
        for (const r of rows){
          if (!r || String(r.country) !== String(country)) continue;
          const d = String(r.date || '');
          if (!d) continue;
          if (!map.has(d)) map.set(d, { total:0, sports:0, games:0 });
          const o = map.get(d);
          o.total  += num(r[fTotal]);
          o.sports += num(r[fSports]);
          o.games  += num(r[fGames]);
        }

        const dates = [...map.keys()].sort((a,b)=>String(a).localeCompare(String(b)));
        const onlySports = [];
        const onlyGames  = [];
        const both       = [];
        const totals      = [];

        for (const d of dates){
          const v = map.get(d);
          const seg = splitUnion(v.total, v.sports, v.games);
          totals.push(seg.total);
          onlySports.push(seg.onlySports);
          onlyGames.push(seg.onlyGames);
          both.push(seg.both);
        }

        return { dates, totals, onlySports, onlyGames, both };
      }

      // Mount
      mountEl.innerHTML = buildLayoutHTML(moduleId);

      const filtersEl = mountEl.querySelector(`#pm-filters-${moduleId}`);
      const monthsEl = mountEl.querySelector(`#pm-months-${moduleId}`);
      const countriesEl = mountEl.querySelector(`#pm-countries-${moduleId}`);
      const chartTypeEl = mountEl.querySelector(`#pm-chartType-${moduleId}`);
      const windowsEl = mountEl.querySelector(`#pm-windows-${moduleId}`);

      const badgeMonthsEl = mountEl.querySelector(`#pm-badge-months-${moduleId}`);
      const badgeCountriesEl = mountEl.querySelector(`#pm-badge-countries-${moduleId}`);
      const badgeWindowsEl = mountEl.querySelector(`#pm-badge-windows-${moduleId}`);
      const hintEl = mountEl.querySelector(`#pm-hint-${moduleId}`);

      const chartEl = mountEl.querySelector(`#chart-${moduleId}`);
      const chartNoteEl = mountEl.querySelector(`#chart-note-${moduleId}`);
      const tableEl = mountEl.querySelector(`#table-${moduleId}`);
      const tableNoteEl = mountEl.querySelector(`#table-note-${moduleId}`);
      const insightTitleEl = mountEl.querySelector(`#insight-title-${moduleId}`);
      const insightEl = mountEl.querySelector(`#insight-${moduleId}`);

      monthsEl.innerHTML = buildChipsHtml(allMonths, 'months');
      countriesEl.innerHTML = buildChipsHtml(COUNTRY_ORDER, 'countries');
      chartTypeEl.innerHTML = buildChipsHtml(CHART_TYPES.map(x=>x.key), 'chartType', (k)=>{
        const hit = CHART_TYPES.find(x=>x.key===k);
        return hit ? hit.label : k;
      });
      windowsEl.innerHTML = buildChipsHtml(WINDOW_ORDER, 'windows');

      // Init chart
      const chart = echarts.init(chartEl);
      const onResize = ()=>{ try{ chart.resize(); }catch(_){ /* noop */ } };
      if (typeof ResizeObserver !== 'undefined'){
        try{
          const ro = new ResizeObserver(onResize);
          ro.observe(chartEl);
        }catch(_){
          window.addEventListener('resize', onResize);
        }
      } else {
        window.addEventListener('resize', onResize);
      }

      function setChipState(){
        const inputs = filtersEl.querySelectorAll('input[data-group][data-value]');
        for (const input of inputs){
          const group = input.getAttribute('data-group');
          const val = input.getAttribute('data-value');
          let checked = false;

          if (group === 'chartType'){
            checked = (state.chartType === val);
          } else if (group === 'months'){
            checked = state.months.has(val);
          } else if (group === 'countries'){
            checked = state.countries.has(val);
          } else if (group === 'windows'){
            checked = state.windows.has(val);
          }

          input.checked = checked;
          const label = input.closest('.ovp-pm-chip');
          if (label){
            label.classList.toggle('is-checked', !!checked);
          }
        }

        const isLine = state.chartType === 'line';
        if (badgeMonthsEl) badgeMonthsEl.textContent = isLine ? '单选' : '多选';
        if (badgeCountriesEl) badgeCountriesEl.textContent = isLine ? '单选' : '多选';
        if (badgeWindowsEl) badgeWindowsEl.textContent = isLine ? '单选' : '多选';

        if (hintEl){
          hintEl.textContent = isLine
            ? '日级折线图：月份/国家/D0D7 为单选；图为日级堆积面积。'
            : '月度柱状图：月份/国家/D0D7 可多选；柱内为人数组成，D7 带斜线阴影。';
        }
      }

      function updateInsight(month){
        const m = month || lm;
        if (insightTitleEl) insightTitleEl.textContent = `数据分析（${m}）`;
        OVP.ui.renderInsight({ moduleId, month: m, el: insightEl });
      }

      function renderTable(monthsSel, countriesSel, winsSel){
        const cols = [];
        for (const m of monthsSel){
          for (const w of winsSel){
            cols.push({ month:m, win:w, label:`${m} ${w}` });
          }
        }

        const thead = `
          <thead>
            <tr>
              <th>国家</th>
              ${cols.map(c=>`<th>${c.label}</th>`).join('')}
            </tr>
          </thead>
        `;

        const fmtInt = (utils && utils.fmtInt) ? (v)=>utils.fmtInt(v) : (v)=>String(Math.round(v));
        const fmtPct = (utils && utils.fmtPct) ? (v,d)=>utils.fmtPct(v,d) : (v)=> (v===null ? '—' : `${(v*100).toFixed(1)}%`);

        const tbodyRows = countriesSel.map(country=>{
          const tds = cols.map(c=>{
            const seg = getMonthlySeg(c.month, country, c.win);
            const t = seg.total;

            const pOnlyGames  = t > 0 ? seg.onlyGames / t : null;
            const pBoth       = t > 0 ? seg.both / t : null;
            const pOnlySports = t > 0 ? seg.onlySports / t : null;

            const cell = `
              <div class="ovp-pm-cell">
                <div>仅游戏：${fmtInt(seg.onlyGames)} (${fmtPct(pOnlyGames, 1)})</div>
                <div>双投：${fmtInt(seg.both)} (${fmtPct(pBoth, 1)})</div>
                <div>仅体育：${fmtInt(seg.onlySports)} (${fmtPct(pOnlySports, 1)})</div>
                <div>总计：${fmtInt(seg.total)}</div>
              </div>
            `;
            return `<td>${cell}</td>`;
          }).join('');

          return `<tr><th>${country}</th>${tds}</tr>`;
        }).join('');

        const tbody = `<tbody>${tbodyRows}</tbody>`;
        tableEl.innerHTML = `${thead}${tbody}`;

        if (tableNoteEl){
          tableNoteEl.textContent = '表内占比口径：该月该国该窗口（D0/D7）内，各分组投注人数 / 总投注人数。单位：人、%。';
        }
      }

      function renderChartBar(monthsSel, countriesSel, winsSel){
        const blue = cssVar('--ovp-blue', '#2563eb');
        const yellow = cssVar('--ovp-yellow', '#F6C344');
        const green = '#86efac';

        const stacks = [];
        for (const m of monthsSel){
          for (const w of winsSel){
            stacks.push({ month:m, win:w, label:`${m} ${w}`, key:`${m}|${w}` });
          }
        }

        if (!stacks.length || !countriesSel.length){
          chart.setOption({
            title: { text:'无可用数据', left:'center', top:'middle', textStyle:{ color:'#94a3b8', fontSize:12 } },
            xAxis: { show:false }, yAxis: { show:false }, series: []
          }, { notMerge:true });
          if (chartNoteEl) chartNoteEl.textContent = '当前筛选无数据：请至少选择 1 个国家 / 月份 / D0/D7。';
          return;
        }

        const stackCount = stacks.length;
        const barWidth = (stackCount <= 4) ? 14 : (stackCount <= 6) ? 12 : (stackCount <= 10) ? 10 : 8;

        const series = [];
        const metaBySeriesIndex = [];

        const d7Decal = {
          symbol: 'rect',
          rotation: Math.PI / 4,
          color: 'rgba(0,0,0,0.18)',
          dashArrayX: [1, 0],
          dashArrayY: [4, 4],
          symbolSize: 6
        };

        function pushSeries(segName, segKey, color, stackObj){
          const data = countriesSel.map(country=>{
            const seg = getMonthlySeg(stackObj.month, country, stackObj.win);
            return seg[segKey] || 0;
          });

          const isD7 = stackObj.win === 'D7';
          const s = {
            name: segName,
            type: 'bar',
            stack: stackObj.key,
            barWidth,
            data,
            itemStyle: isD7 ? { color, decal: d7Decal } : { color },
            emphasis: { focus: 'series' }
          };

          metaBySeriesIndex.push({
            stackLabel: stackObj.label,
            segKey,
            segName,
            win: stackObj.win,
            month: stackObj.month
          });
          series.push(s);
        }

        // For each bar (month x window), stack order: onlyGames (bottom) -> both -> onlySports (top)
        for (const st of stacks){
          pushSeries('仅游戏', 'onlyGames', blue, st);
          pushSeries('双投', 'both', green, st);
          pushSeries('仅体育', 'onlySports', yellow, st);
        }

        const fmtInt = (utils && utils.fmtInt) ? (v)=>utils.fmtInt(v) : (v)=>String(Math.round(v));
        const fmtPct = (utils && utils.fmtPct) ? (v,d)=>utils.fmtPct(v,d) : (v)=> (v===null ? '—' : `${(v*100).toFixed(1)}%`);

        const stackOrder = stacks.map(s=>s.label);

        const option = {
          grid: { left: 56, right: 18, top: 42, bottom: 34, containLabel: true },
          legend: {
            top: 10,
            left: 10,
            data: ['仅游戏','双投','仅体育']
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: (params)=>{
              const list = Array.isArray(params) ? params : [params];
              const country = (list[0] && list[0].axisValue) ? String(list[0].axisValue) : '';

              const group = new Map(); // stackLabel -> segs
              for (const p of list){
                if (!p) continue;
                const meta = metaBySeriesIndex[p.seriesIndex];
                if (!meta) continue;
                if (!group.has(meta.stackLabel)){
                  group.set(meta.stackLabel, { onlyGames:0, both:0, onlySports:0 });
                }
                const g = group.get(meta.stackLabel);
                const v = num(p.value);
                g[meta.segKey] = v;
              }

              let html = `<div style="font-weight:600;margin-bottom:6px;">${country}</div>`;
              for (const label of stackOrder){
                if (!group.has(label)) continue;
                const g = group.get(label);
                const total = g.onlyGames + g.both + g.onlySports;
                const pOnlyGames = total>0 ? g.onlyGames/total : null;
                const pBoth = total>0 ? g.both/total : null;
                const pOnlySports = total>0 ? g.onlySports/total : null;

                html += `<div style="margin:6px 0 4px;font-weight:600;">${label}</div>`;
                html += `<div>仅游戏：${fmtInt(g.onlyGames)} (${fmtPct(pOnlyGames, 1)})</div>`;
                html += `<div>双投：${fmtInt(g.both)} (${fmtPct(pBoth, 1)})</div>`;
                html += `<div>仅体育：${fmtInt(g.onlySports)} (${fmtPct(pOnlySports, 1)})</div>`;
                html += `<div>总计：${fmtInt(total)}</div>`;
              }
              return html;
            }
          },
          xAxis: {
            type: 'category',
            data: countriesSel,
            axisTick: { alignWithLabel: true }
          },
          yAxis: {
            type: 'value',
            name: '投注人数（人）'
          },
          series
        };

        chart.setOption(option, { notMerge:true });

        if (chartNoteEl){
          chartNoteEl.textContent = `说明：柱内堆叠 = 仅游戏(蓝) + 双投(浅绿) + 仅体育(黄)；D7 用斜线阴影区分。柱子顺序：${stackOrder.join(' → ')}`;
        }
      }

      function renderChartLine(month, country, win){
        const blue = cssVar('--ovp-blue', '#2563eb');
        const yellow = cssVar('--ovp-yellow', '#F6C344');
        const green = '#34d399';

        const daily = getDailySeries(month, country, win);
        if (!daily.dates.length){
          chart.setOption({
            title: { text:'无可用数据', left:'center', top:'middle', textStyle:{ color:'#94a3b8', fontSize:12 } },
            xAxis: { show:false }, yAxis: { show:false }, series: []
          }, { notMerge:true });

          if (chartNoteEl) chartNoteEl.textContent = `当前筛选无数据：${month} · ${country} · ${win}`;
          return;
        }

        const fmtInt = (utils && utils.fmtInt) ? (v)=>utils.fmtInt(v) : (v)=>String(Math.round(v));
        const fmtPct = (utils && utils.fmtPct) ? (v,d)=>utils.fmtPct(v,d) : (v)=> (v===null ? '—' : `${(v*100).toFixed(1)}%`);

        const option = {
          grid: { left: 56, right: 18, top: 42, bottom: 34, containLabel: true },
          legend: {
            top: 10,
            left: 10,
            data: ['仅体育','仅游戏','双投']
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'line' },
            formatter: (params)=>{
              const list = Array.isArray(params) ? params : [params];
              const date = (list[0] && list[0].axisValue) ? String(list[0].axisValue) : '';
              const m = { onlySports:0, onlyGames:0, both:0 };
              for (const p of list){
                if (!p) continue;
                if (p.seriesName === '仅体育') m.onlySports = num(p.value);
                if (p.seriesName === '仅游戏') m.onlyGames = num(p.value);
                if (p.seriesName === '双投') m.both = num(p.value);
              }
              const total = m.onlySports + m.onlyGames + m.both;
              const pOnlySports = total>0 ? m.onlySports/total : null;
              const pOnlyGames = total>0 ? m.onlyGames/total : null;
              const pBoth = total>0 ? m.both/total : null;

              let html = `<div style="font-weight:600;margin-bottom:6px;">${date}</div>`;
              html += `<div>仅体育：${fmtInt(m.onlySports)} (${fmtPct(pOnlySports,1)})</div>`;
              html += `<div>仅游戏：${fmtInt(m.onlyGames)} (${fmtPct(pOnlyGames,1)})</div>`;
              html += `<div>双投：${fmtInt(m.both)} (${fmtPct(pBoth,1)})</div>`;
              html += `<div>总计：${fmtInt(total)}</div>`;
              return html;
            }
          },
          xAxis: {
            type: 'category',
            data: daily.dates,
            axisLabel: { formatter: (v)=>String(v).slice(5) } // MM-DD
          },
          yAxis: {
            type: 'value',
            name: '投注人数（人）'
          },
          series: [
            // Stack order per requirement: bottom onlySports, middle onlyGames, top both
            {
              name: '仅体育',
              type: 'line',
              stack: 'total',
              symbol: 'none',
              data: daily.onlySports,
              lineStyle: { width: 2 },
              areaStyle: { opacity: 0.35 },
              itemStyle: { color: yellow }
            },
            {
              name: '仅游戏',
              type: 'line',
              stack: 'total',
              symbol: 'none',
              data: daily.onlyGames,
              lineStyle: { width: 2 },
              areaStyle: { opacity: 0.35 },
              itemStyle: { color: blue }
            },
            {
              name: '双投',
              type: 'line',
              stack: 'total',
              symbol: 'none',
              data: daily.both,
              lineStyle: { width: 2 },
              areaStyle: { opacity: 0.35 },
              itemStyle: { color: green }
            }
          ]
        };

        chart.setOption(option, { notMerge:true });

        if (chartNoteEl){
          chartNoteEl.textContent = `说明：日级堆积面积图（底：仅体育 / 中：仅游戏 / 顶：双投）。当前选择：${month} · ${country} · ${win}`;
        }
      }

      function renderAll(){
        ensureAtLeastOne(state.months, lm);
        ensureAtLeastOne(state.countries, COUNTRY_ORDER[0]);
        ensureAtLeastOne(state.windows, 'D0');

        if (state.chartType === 'line'){
          enforceSingles();
        }

        const monthsSel = monthList();
        const countriesSel = countryList();
        const winsSel = windowList();

        setChipState();

        // Chart
        if (state.chartType === 'bar'){
          renderChartBar(monthsSel, countriesSel, winsSel);
        } else {
          renderChartLine(monthsSel[0], countriesSel[0], winsSel[0]);
        }

        // Table: always follows filter selections (line mode will be single column)
        renderTable(monthsSel, countriesSel, winsSel);

        // Insight: show latest selected month
        updateInsight(monthsSel[monthsSel.length - 1]);
      }

      function onFilterChange(e){
        const input = e.target;
        if (!input || input.tagName !== 'INPUT') return;

        const group = input.getAttribute('data-group');
        const val = input.getAttribute('data-value');
        if (!group || val === null) return;

        const isLine = state.chartType === 'line';

        if (group === 'chartType'){
          if (!input.checked){
            input.checked = true;
            return;
          }
          state.chartType = val;

          if (state.chartType === 'line'){
            enforceSingles();
          }
          renderAll();
          return;
        }

        const singleMode = (state.chartType === 'line') && (group === 'months' || group === 'countries' || group === 'windows');

        const set =
          (group === 'months') ? state.months :
          (group === 'countries') ? state.countries :
          (group === 'windows') ? state.windows : null;

        if (!set) return;

        if (singleMode){
          if (input.checked){
            set.clear();
            set.add(val);
          } else {
            // disallow empty
            input.checked = true;
            return;
          }
        } else {
          if (input.checked){
            set.add(val);
          } else {
            set.delete(val);
            if (!set.size){
              set.add(val);
              input.checked = true;
              return;
            }
          }
        }

        if (isLine){
          enforceSingles();
        }

        renderAll();
      }

      if (filtersEl) filtersEl.addEventListener('change', onFilterChange);

      // Defaults
      renderAll();
    }
  });
})();
