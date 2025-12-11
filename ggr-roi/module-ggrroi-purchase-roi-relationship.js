/* module-ggrroi-purchase-roi-relationship.js
 * 模块2：GGR ROI 和 充值ROI 关系分析
 *
 * 交互说明（按你的需求做的默认值）：
 * - 月份：默认最近 8 个月（不足 8 个月则全选），最多选 8 个月
 * - 国家 / 媒体 / 产品类型：默认勾选「全选但不区分」（= 全选但图表/表格不拆分该维度）
 * - GGR ROI：默认勾选 D60
 * - 充值ROI：默认勾选 D7
 *
 * 口径：
 * - Dx GGR ROI = Dx_TOTAL_GGR_VALUE / spent
 * - Dx 充值ROI = Dx_PURCHASE_VALUE / spent
 * - 聚合：先按选中维度汇总 sum(value) / sum(spent)，避免直接平均 ROI 造成偏差
 */
(function(){
  const MOD_ID = 'ggrroi-purchase-roi-relationship';
  const MOD_TITLE = '二、GGR ROI 和充值ROI 关系分析';
  const DAYS = ['D0','D3','D7','D14','D30','D45','D60'];

  function ensureStyle(){
    const id = 'ovp-style-' + MOD_ID;
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      /* Filter panel */
      .ovp-filter-panel{
        border:1px solid rgba(148,163,184,.60);
        border-radius:12px;
        background: rgba(249,250,251,.92);
        padding:12px 12px 10px;
      }
      .ovp-filter-row{
        display:flex;
        flex-wrap:wrap;
        gap:12px 14px;
        align-items:flex-start;
      }
      .ovp-filter-group{ min-width: 210px; flex: 1 1 240px; }
      .ovp-filter-group.is-wide{ flex: 2 1 380px; min-width: 320px; }
      .ovp-filter-label{
        font-size:11px;
        color: var(--muted);
        margin: 0 0 6px;
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:10px;
      }
      .ovp-filter-label .ovp-limit{
        font-size:11px;
        color: var(--muted);
      }
      .ovp-chipset{
        display:flex;
        flex-wrap:wrap;
        gap:8px;
      }
      .ovp-chip{
        display:inline-flex;
        align-items:center;
        gap:8px;
        border: 1px solid rgba(148,163,184,.60);
        background: rgba(255,255,255,.98);
        border-radius: 999px;
        padding: 6px 10px;
        cursor:pointer;
        user-select:none;
        line-height:1;
      }
      .ovp-chip input{ position:absolute; opacity:0; pointer-events:none; }
      .ovp-chip span{
        font-size:12px;
        color: var(--text);
        white-space:nowrap;
      }
      .ovp-chip.is-special span{
        color: var(--text);
      }
      .ovp-chip.is-checked{
        border-color: rgba(37,99,235,.55);
        box-shadow: 0 6px 16px rgba(37,99,235,.10);
      }
      .ovp-chip.is-checked span{
        color: rgba(37,99,235,1);
      }
      .ovp-chip.is-disabled{
        opacity:.45;
        cursor:not-allowed;
      }
      .ovp-filter-hint{
        margin-top:8px;
        font-size:11px;
        color: var(--muted);
        line-height:1.45;
      }
      /* Table */
      .ovp-table-wrap{
        border:1px solid rgba(148,163,184,.60);
        border-radius:12px;
        overflow:auto;
        background: rgba(255,255,255,.98);
      }
      table.ovp-table{
        border-collapse:separate;
        border-spacing:0;
        width:max-content;
        min-width:100%;
        font-size:12px;
      }
      .ovp-table th,.ovp-table td{
        padding:10px 10px;
        border-bottom:1px solid rgba(148,163,184,.35);
        vertical-align:middle;
        white-space:nowrap;
      }
      .ovp-table thead th{
        position:sticky;
        top:0;
        background: rgba(249,250,251,.98);
        z-index:1;
        font-size:11px;
        color: var(--muted);
        text-align:left;
      }
      .ovp-table tbody tr:hover td{
        background: rgba(249,250,251,.65);
      }
      .ovp-badge{
        display:inline-flex;
        align-items:center;
        border:1px solid rgba(148,163,184,.50);
        border-radius:999px;
        padding: 2px 8px;
        font-size:11px;
        color: var(--muted);
        background: rgba(249,250,251,.90);
      }
    `;
    document.head.appendChild(style);
  }

  function uniqSorted(arr){
    return Array.from(new Set(arr.filter(v=>v!==null && v!==undefined && String(v).trim()!=='')))
      .map(v=>String(v))
      .sort((a,b)=>a.localeCompare(b));
  }

  function normLabel(v){
    if (v===null || v===undefined) return '—';
    const s = String(v);
    // 国家：两位码常用大写展示；其他保持原样（FB/GG 也保留）
    if (/^[a-z]{2}$/i.test(s)) return s.toUpperCase();
    if (s.toLowerCase()==='app') return 'APP';
    if (s.toLowerCase()==='h5') return 'H5';
    return s;
  }

  function safeArr(v){ return Array.isArray(v) ? v : []; }

  function pearsonCorr(xs, ys){
    const n = Math.min(xs.length, ys.length);
    if (n < 3) return null;
    let sx=0, sy=0;
    for (let i=0;i<n;i++){ sx+=xs[i]; sy+=ys[i]; }
    const mx = sx/n, my = sy/n;
    let sxx=0, syy=0, sxy=0;
    for (let i=0;i<n;i++){
      const dx = xs[i]-mx;
      const dy = ys[i]-my;
      sxx += dx*dx;
      syy += dy*dy;
      sxy += dx*dy;
    }
    if (sxx===0 || syy===0) return null;
    return sxy / Math.sqrt(sxx*syy);
  }

  function clampMonths(allMonths, picked, max){
    const m = safeArr(picked);
    if (m.length <= max) return m;
    return m.slice(-max);
  }

  function buildChip({group, role, value, label, checked, disabled=false, special=false}){
    const cls = ['ovp-chip'];
    if (checked) cls.push('is-checked');
    if (disabled) cls.push('is-disabled');
    if (special) cls.push('is-special');
    const safeValue = String(value).replace(/"/g,'&quot;');
    return `
      <label class="${cls.join(' ')}" title="${label}">
        <input type="checkbox" data-group="${group}" data-role="${role}" data-value="${safeValue}" ${checked?'checked':''} ${disabled?'disabled':''} />
        <span>${label}</span>
      </label>
    `;
  }

  function renderFilterPanel({el, state, opts}){
    const { months, countries, medias, products } = opts;

    const monthChips = months.map(m=>buildChip({
      group:'month', role:'value', value:m, label:m, checked:state.months.has(m), disabled:false
    })).join('');

    const dayChipsGgr = DAYS.map(d=>buildChip({
      group:'ggrDay', role:'value', value:d, label:d, checked:state.ggrDays.has(d)
    })).join('');

    const dayChipsPur = DAYS.map(d=>buildChip({
      group:'purDay', role:'value', value:d, label:d, checked:state.purDays.has(d)
    })).join('');

    function dimGroupHTML(dimKey, items){
      const mergeChecked = !!state.merge[dimKey];
      const mergeChip = buildChip({
        group: dimKey, role:'merge', value:'__MERGE__', label:'全选但不区分', checked:mergeChecked, disabled:false, special:true
      });

      const valueChips = items.map(v=>buildChip({
        group: dimKey, role:'value', value:v, label:normLabel(v),
        checked: state[dimKey].has(v),
        disabled: mergeChecked
      })).join('');

      return mergeChip + valueChips;
    }

    el.innerHTML = `
      <div class="ovp-filter-panel">
        <div class="ovp-filter-row">
          <div class="ovp-filter-group is-wide">
            <div class="ovp-filter-label">
              <span>月份</span>
              <span class="ovp-limit">最多 8 个月</span>
            </div>
            <div class="ovp-chipset" data-wrap="month">${monthChips}</div>
          </div>

          <div class="ovp-filter-group">
            <div class="ovp-filter-label"><span>国家</span><span class="ovp-badge">${countries.length} 个</span></div>
            <div class="ovp-chipset" data-wrap="country">${dimGroupHTML('country', countries)}</div>
          </div>

          <div class="ovp-filter-group">
            <div class="ovp-filter-label"><span>媒体</span><span class="ovp-badge">${medias.length} 个</span></div>
            <div class="ovp-chipset" data-wrap="media">${dimGroupHTML('media', medias)}</div>
          </div>

          <div class="ovp-filter-group">
            <div class="ovp-filter-label"><span>产品类型</span><span class="ovp-badge">${products.length} 个</span></div>
            <div class="ovp-chipset" data-wrap="product">${dimGroupHTML('product', products)}</div>
          </div>

          <div class="ovp-filter-group">
            <div class="ovp-filter-label"><span>GGR ROI（多选）</span></div>
            <div class="ovp-chipset" data-wrap="ggrDay">${dayChipsGgr}</div>
          </div>

          <div class="ovp-filter-group">
            <div class="ovp-filter-label"><span>充值ROI（多选）</span></div>
            <div class="ovp-chipset" data-wrap="purDay">${dayChipsPur}</div>
          </div>
        </div>

        <div class="ovp-filter-hint" id="${MOD_ID}-hint"></div>
      </div>
    `;
  }

  function collectDimValues(rawByMonth, months){
    const c = [];
    const m = [];
    const p = [];
    for (const mo of months){
      const rows = safeArr(rawByMonth && rawByMonth[mo]);
      for (const r of rows){
        if (r && r.country!=null) c.push(String(r.country));
        if (r && r.media!=null) m.push(String(r.media));
        if (r && r.Product_type!=null) p.push(String(r.Product_type));
      }
    }
    return {
      countries: uniqSorted(c),
      medias: uniqSorted(m),
      products: uniqSorted(p)
    };
  }

  function computeAgg({rawByMonth, monthsSel, state, utils}){
    // spendAgg: groupKey -> month -> spendSum
    const spendAgg = new Map();
    // numAgg: seriesKey -> month -> numSum
    const numAgg = new Map();

    function ensure2(map, k1, k2){
      let m1 = map.get(k1);
      if (!m1){ m1 = new Map(); map.set(k1, m1); }
      const v = m1.get(k2) || 0;
      return {m1, v};
    }

    function rowPass(r){
      if (!r) return false;
      if (!state.merge.country && !state.country.has(String(r.country))) return false;
      if (!state.merge.media && !state.media.has(String(r.media))) return false;
      if (!state.merge.product && !state.product.has(String(r.Product_type))) return false;
      return true;
    }

    function groupKeyOf(r){
      const c = state.merge.country ? 'ALL' : String(r.country);
      const m = state.merge.media ? 'ALL' : String(r.media);
      const p = state.merge.product ? 'ALL' : String(r.Product_type);
      return `${c}|${m}|${p}`;
    }

    for (const mo of monthsSel){
      const rows = safeArr(rawByMonth && rawByMonth[mo]);
      for (const r of rows){
        if (!rowPass(r)) continue;

        const gk = groupKeyOf(r);
        const spend = utils.safeNumber(r.spent);
        if (spend!==null){
          const {m1, v} = ensure2(spendAgg, gk, mo);
          m1.set(mo, v + spend);
        }

        // 先累 numerator，不在这里重复累 spend（避免被天数/指标数重复加）
        for (const d of state.ggrDays){
          const f = `${d}_TOTAL_GGR_VALUE`;
          const n = utils.safeNumber(r[f]);
          if (n===null) continue;
          const sk = `GGR|||${d}|||${gk}`;
          const {m1, v} = ensure2(numAgg, sk, mo);
          m1.set(mo, v + n);
        }

        for (const d of state.purDays){
          const f = `${d}_PURCHASE_VALUE`;
          const n = utils.safeNumber(r[f]);
          if (n===null) continue;
          const sk = `PURCHASE|||${d}|||${gk}`;
          const {m1, v} = ensure2(numAgg, sk, mo);
          m1.set(mo, v + n);
        }
      }
    }

    function groupLabel(gk){
      const [c,m,p] = String(gk).split('|');
      const parts = [];
      if (!state.merge.country) parts.push(normLabel(c));
      if (!state.merge.media) parts.push(normLabel(m));
      if (!state.merge.product) parts.push(normLabel(p));
      return parts.length ? parts.join(' · ') : '总体';
    }

    const series = [];
    for (const [sk, byMonthNum] of numAgg.entries()){
      const [kind, day, gk] = sk.split('|||');
      const byMonthSpend = spendAgg.get(gk) || new Map();

      const data = monthsSel.map(mo=>{
        const den = byMonthSpend.get(mo);
        const num = byMonthNum.get(mo);
        if (den===undefined || num===undefined) return null;
        const roi = utils.safeDiv(num, den);
        return roi===null ? null : roi;
      });

      const metricName = (kind==='GGR') ? 'GGR ROI' : '充值ROI';
      const label = groupLabel(gk);
      const name = (label==='总体') ? `${metricName} ${day}` : `${metricName} ${day} | ${label}`;

      series.push({ name, kind, day, gk, label, data });
    }

    series.sort((a,b)=>a.name.localeCompare(b.name));

    return { monthsSel, series };
  }

  function renderChart({chartEl, chart, monthsSel, series, utils}){
    if (!chartEl || !window.echarts) return;

    if (!chart){
      chart = echarts.init(chartEl, null, { renderer:'canvas' });
    }

    const option = {
      animation: false,
      tooltip: {
        trigger: 'axis',
        axisPointer: { type:'line' },
        valueFormatter: (v)=>{
          if (v===null || v===undefined || Number.isNaN(Number(v))) return '—';
          return utils.fmtPct(v, 2);
        }
      },
      legend: {
        type: 'scroll',
        top: 6,
        left: 10,
        right: 10,
        textStyle: { fontSize: 11 }
      },
      grid: { top: 56, left: 56, right: 18, bottom: 52 },
      xAxis: {
        type: 'category',
        data: monthsSel,
        axisTick: { alignWithLabel: true },
        axisLabel: { color: 'rgba(107,114,128,1)', fontSize: 11 }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: 'rgba(107,114,128,1)',
          fontSize: 11,
          formatter: (v)=> `${(Number(v)*100).toFixed(0)}%`
        },
        splitLine: { lineStyle: { color:'rgba(148,163,184,.25)' } }
      },
      series: series.map(s=>({
        name: s.name,
        type: 'line',
        data: s.data,
        showSymbol: false,
        connectNulls: true,
        emphasis: { focus:'series' },
        lineStyle: { width: 2 }
      }))
    };

    chart.setOption(option, true);
    return chart;
  }

  function renderTable({tableEl, monthsSel, series, utils}){
    if (!tableEl) return;

    if (!series.length){
      tableEl.innerHTML = `
        <thead><tr><th>Series</th></tr></thead>
        <tbody><tr><td style="color:var(--muted);">无数据：检查筛选条件或月份范围</td></tr></tbody>
      `;
      return;
    }

    const thead = `
      <thead>
        <tr>
          <th>Series</th>
          ${monthsSel.map(m=>`<th>${m}</th>`).join('')}
        </tr>
      </thead>
    `;

    const rows = series.map(s=>{
      const tds = s.data.map(v=>`<td>${utils.fmtPct(v, 2)}</td>`).join('');
      return `<tr><td>${s.name}</td>${tds}</tr>`;
    }).join('');

    tableEl.innerHTML = thead + `<tbody>${rows}</tbody>`;
  }

  function renderInsight({el, agg, state, utils}){
    if (!el) return;

    // 只在 “各选一个 Dx” 的情况下，给一个按月相关性（Pearson r）概览；多选就不硬算
    const ggrOne = Array.from(state.ggrDays);
    const purOne = Array.from(state.purDays);
    if (ggrOne.length!==1 || purOne.length!==1){
      el.textContent = '关系提示：当 GGR ROI 与 充值ROI 各只选 1 个 Dx 时，这里会给出按月 Pearson 相关系数（r）概览。';
      el.classList.add('is-empty');
      return;
    }

    const gDay = ggrOne[0];
    const pDay = purOne[0];

    // 找每个 groupKey 的两条序列
    const byKey = new Map(); // gk -> {ggr:[], pur:[]}
    for (const s of agg.series){
      if (s.kind==='GGR' && s.day===gDay){
        byKey.set(s.gk, byKey.get(s.gk) || {});
        byKey.get(s.gk).ggr = s.data;
        byKey.get(s.gk).label = s.label;
      }
      if (s.kind==='PURCHASE' && s.day===pDay){
        byKey.set(s.gk, byKey.get(s.gk) || {});
        byKey.get(s.gk).pur = s.data;
        byKey.get(s.gk).label = s.label;
      }
    }

    const rows = [];
    for (const [gk, v] of byKey.entries()){
      const a = safeArr(v.ggr);
      const b = safeArr(v.pur);
      const xs = [], ys = [];
      for (let i=0;i<Math.min(a.length, b.length);i++){
        const x = utils.safeNumber(a[i]);
        const y = utils.safeNumber(b[i]);
        if (x===null || y===null) continue;
        xs.push(x); ys.push(y);
      }
      const r = pearsonCorr(xs, ys);
      if (r===null) continue;
      rows.push({ label: v.label || '总体', r, n: xs.length });
    }

    if (!rows.length){
      el.textContent = '关系提示：当前筛选下，无法形成足够的按月配对数据（n<3 或缺失）。';
      el.classList.add('is-empty');
      return;
    }

    rows.sort((a,b)=>Math.abs(b.r)-Math.abs(a.r));
    const top = rows.slice(0, 3);

    const lines = [];
    lines.push(`Pearson 相关（按月）：GGR ${gDay} vs 充值 ${pDay}`);
    for (const t of top){
      lines.push(`- ${t.label}：r=${t.r.toFixed(2)}（n=${t.n}）`);
    }
    lines.push('注：相关性只反映同向/反向程度，不等于因果。');

    el.textContent = lines.join('\n');
    el.classList.remove('is-empty');
  }

  function summaryLine(state, monthsSel){
    const dimText = (dimKey)=>{
      if (state.merge[dimKey]) return '全选但不区分';
      return `${Array.from(state[dimKey]).length} 个`;
    };
    return `月份：${monthsSel.join(', ')}；国家：${dimText('country')}；媒体：${dimText('media')}；产品：${dimText('product')}；GGR：${Array.from(state.ggrDays).join(', ')}；充值：${Array.from(state.purDays).join(', ')}`;
  }

  function asSetAll(arr){ return new Set(arr.map(v=>String(v))); }

  function enforceAtLeastOne(setObj, fallbackValue){
    if (setObj.size>0) return true;
    setObj.add(fallbackValue);
    return false;
  }

  function handleToggle({state, group, role, value, checked, opts, hintEl}){
    const v = String(value);

    const setHint = (msg)=>{ if (hintEl) hintEl.textContent = msg || ''; };

    // Month
    if (group==='month' && role==='value'){
      if (checked){
        if (state.months.size >= 8){
          setHint('月份最多选 8 个：已经到上限了。');
          return { reject:true };
        }
        state.months.add(v);
      }else{
        state.months.delete(v);
        // 不强制至少 1 个月；但如果 0，就给提示
        if (state.months.size===0) setHint('没选月份：图表会为空。');
      }
      return { reject:false };
    }

    // Merge dims
    if ((group==='country' || group==='media' || group==='product') && role==='merge'){
      state.merge[group] = checked;
      setHint('');
      // 勾上 merge：逻辑全选
      if (checked){
        state[group] = asSetAll(((group==='country') ? (opts.countries||[]) : (group==='media') ? (opts.medias||[]) : (opts.products||[])));
      }else{
        // 取消 merge：如果之前没有任何 selection，就默认全选
        if (!state[group] || state[group].size===0){
          state[group] = asSetAll(((group==='country') ? (opts.countries||[]) : (group==='media') ? (opts.medias||[]) : (opts.products||[])));
        }
      }
      return { reject:false };
    }

    // Dim value selection
    if ((group==='country' || group==='media' || group==='product') && role==='value'){
      if (state.merge[group]){
        // merge 打开时，这些 input 本应 disabled；这里兜底直接拒绝
        return { reject:true };
      }
      if (checked) state[group].add(v);
      else state[group].delete(v);

      // 至少保留 1 个
      if (state[group].size===0){
        state[group].add(v);
        setHint('至少保留 1 个选项。');
        return { reject:true };
      }
      setHint('');
      return { reject:false };
    }

    // ROI day selection
    if ((group==='ggrDay' || group==='purDay') && role==='value'){
      const targetSet = (group==='ggrDay') ? state.ggrDays : state.purDays;
      if (checked) targetSet.add(v);
      else targetSet.delete(v);

      // 至少保留 1 个
      const ok = (targetSet.size>0);
      if (!ok){
        targetSet.add(v);
        setHint('GGR ROI / 充值ROI 至少各选 1 个 Dx。');
        return { reject:true };
      }
      setHint('');
      return { reject:false };
    }

    return { reject:false };
  }

  function syncChipClasses(root){
    if (!root) return;
    const labels = root.querySelectorAll('.ovp-chip');
    labels.forEach(lb=>{
      const input = lb.querySelector('input');
      if (!input) return;
      lb.classList.toggle('is-checked', !!input.checked);
      lb.classList.toggle('is-disabled', !!input.disabled);
    });
  }

  function setDimDisabled(root, dimKey, disabled){
    if (!root) return;
    const inputs = root.querySelectorAll(`input[data-group="${dimKey}"][data-role="value"]`);
    inputs.forEach(i=>{ i.disabled = !!disabled; });
  }

  // Register
  if (!window.OVP || typeof window.OVP.registerModule !== 'function'){
    console.warn('[OVP] registerModule not found; module skipped:', MOD_ID);
    return;
  }

  OVP.registerModule({
    id: MOD_ID,
    title: MOD_TITLE,
    subtitle: '横轴月份，纵轴ROI%；对比所选 Dx 的 GGR ROI 与 充值ROI（支持国家/媒体/产品类型拆分或合并）',
    render({ mountEl, rawByMonth, months, utils }){
      ensureStyle();
      if (!mountEl) return;

      const allMonths = safeArr(months && months.length ? months : (rawByMonth ? Object.keys(rawByMonth) : []))
        .slice()
        .sort((a,b)=>String(a).localeCompare(String(b)));

      const dim = collectDimValues(rawByMonth || {}, allMonths);

      // 默认：最近 8 个月（不足则全选）
      const defaultMonths = (allMonths.length <= 8) ? allMonths : allMonths.slice(-8);

      const state = {
        months: new Set(defaultMonths),
        country: asSetAll(dim.countries),
        media: asSetAll(dim.medias),
        product: asSetAll(dim.products),
        merge: { country:true, media:true, product:true },
        ggrDays: new Set(['D60']),
        purDays: new Set(['D7'])
      };

      // Layout
      mountEl.innerHTML = `
        <div class="ovp-module-stack">
          <div id="${MOD_ID}-filters"></div>

          <div>
            <div class="ovp-chart" id="${MOD_ID}-chart" style="height:420px;"></div>
            <div class="ovp-chart-note" id="${MOD_ID}-note"></div>
          </div>

          <div class="ovp-table-wrap">
            <table class="ovp-table" id="${MOD_ID}-table"></table>
          </div>

          <div class="ovp-insight is-empty" id="${MOD_ID}-insight">关系分析结果区</div>
        </div>
      `;

      const filtersWrap = mountEl.querySelector(`#${MOD_ID}-filters`);
      const chartEl = mountEl.querySelector(`#${MOD_ID}-chart`);
      const noteEl = mountEl.querySelector(`#${MOD_ID}-note`);
      const tableEl = mountEl.querySelector(`#${MOD_ID}-table`);
      const insightEl = mountEl.querySelector(`#${MOD_ID}-insight`);
      const hintEl = mountEl.querySelector(`#${MOD_ID}-hint`); // will exist after filter render

      const opts = { months: allMonths, countries: dim.countries, medias: dim.medias, products: dim.products };

      // Chart instance
      let chart = null;
      let ro = null;

      function rerender(reason){
        const monthsSel = Array.from(state.months)
          .sort((a,b)=>String(a).localeCompare(String(b)));

        // 月份最多 8 个：这里再兜底裁一下
        const monthsFixed = clampMonths(allMonths, monthsSel, 8);
        state.months = new Set(monthsFixed);

        // sync disabled state for dims
        setDimDisabled(mountEl, 'country', state.merge.country);
        setDimDisabled(mountEl, 'media', state.merge.media);
        setDimDisabled(mountEl, 'product', state.merge.product);
        syncChipClasses(mountEl);

        const agg = computeAgg({ rawByMonth: rawByMonth||{}, monthsSel: monthsFixed, state, utils });

        // Note
        if (noteEl){
          noteEl.textContent = `口径：ROI = sum(value) / sum(spent)；ROI 单位：%（展示为百分比）。${summaryLine(state, monthsFixed)}`;
        }

        // Chart
        chart = renderChart({ chartEl, chart, monthsSel: monthsFixed, series: agg.series, utils }) || chart;

        // Table
        renderTable({ tableEl, monthsSel: monthsFixed, series: agg.series, utils });

        // Insight
        renderInsight({ el: insightEl, agg, state, utils });

        // Resize observe once
        if (chartEl && chart && !ro && 'ResizeObserver' in window){
          ro = new ResizeObserver(()=>{ try{ chart.resize(); }catch(_e){} });
          ro.observe(chartEl);
        }
      }

      // Initial render filters
      renderFilterPanel({ el: filtersWrap, state, opts });

      // After panel inserted, we can fetch hintEl
      const _hintEl = mountEl.querySelector(`#${MOD_ID}-hint`);

      // Event delegation for filter inputs
      filtersWrap.addEventListener('change', (evt)=>{
        const t = evt.target;
        if (!t || t.tagName!=='INPUT') return;
        const group = t.dataset.group;
        const role = t.dataset.role;
        const value = t.dataset.value;
        const checked = !!t.checked;

        const res = handleToggle({ state, group, role, value, checked, opts, hintEl:_hintEl });
        if (res && res.reject){
          // revert UI
          t.checked = !checked;
        }

        // merge toggles might have changed disabled status; update classes
        rerender('filter-change');
      });

      // First paint
      rerender('init');
    }
  });
})();