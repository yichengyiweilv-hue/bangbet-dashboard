// paid-monthly/paid-module-registrations.js
(function(){
  // ---- Safe namespace bootstrap (in case paid-monthly index.html differs) ----
  window.OVP = window.OVP || {};
  OVP.modules = OVP.modules || [];
  OVP.registerModule = OVP.registerModule || function registerModule(mod){
    if (!mod || !mod.id) return;
    OVP.modules.push(mod);
  };

  const moduleId = 'paidRegistrations';
  const MAX_MONTHS = 3;
  const ALL_NO_SPLIT = '__ALL_NO_SPLIT__';

  // Required fixed display order (others appended if appear in data)
  const COUNTRY_ORDER = ['GH','KE','NG','TZ'];

  const CHART_TYPES = [
    { key:'bar',  label:'月度柱状图' },
    { key:'line', label:'日级折线图' }
  ];

  // Field candidates (be tolerant to upstream schema)
  const MEDIA_KEYS   = ['media','channel','media_source','source','ad_network','network','adNetwork'];
  const PRODUCT_KEYS = ['productType','product_type','product','platformType','client','appType'];
  const REG_KEYS     = ['registration','registrations','reg','regs','register'];
  const SPEND_KEYS   = ['spent','spend','cost','adSpend','ad_spend','expense','total_spend'];

  function cssVar(name, fallback){
    try{
      const v = getComputedStyle(document.documentElement).getPropertyValue(name);
      return (v && v.trim()) ? v.trim() : fallback;
    }catch(_){
      return fallback;
    }
  }
  function str(v){ return (v === null || v === undefined) ? '' : String(v).trim(); }
  function normUpper(v){ return str(v).toUpperCase(); }
  function normLower(v){ return str(v).toLowerCase(); }
  function num(v){
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  function pickFirstNonEmpty(obj, keys){
    if (!obj) return '';
    for (const k of keys){
      const v = obj[k];
      if (v === null || v === undefined) continue;
      const s = String(v).trim();
      if (s) return s;
    }
    return '';
  }
  function pickFirstNumber(obj, keys){
    if (!obj) return null;
    for (const k of keys){
      if (!(k in obj)) continue;
      const n = Number(obj[k]);
      if (Number.isFinite(n)) return n;
    }
    return null;
  }
  function hasAnyNumberField(obj, keys){
    return pickFirstNumber(obj, keys) !== null;
  }

  function getCountry(r){ return normUpper(r && r.country); }
  function getDate(r){ return str(r && (r.date || r.day || r.ds || r.dt)); }
  function getMediaRaw(r){ return pickFirstNonEmpty(r, MEDIA_KEYS); }
  function getProductRaw(r){ return pickFirstNonEmpty(r, PRODUCT_KEYS); }
  function getMediaKey(r){ return normLower(getMediaRaw(r)); }
  function getProductKey(r){ return normLower(getProductRaw(r)); }
  function getReg(r){
    const n = pickFirstNumber(r, REG_KEYS);
    return Number.isFinite(n) ? n : 0;
  }
  function getSpend(r){
    const n = pickFirstNumber(r, SPEND_KEYS);
    return Number.isFinite(n) ? n : 0;
  }

  function ensureStyle(){
    const sid = 'ovp-style-paidRegistrations';
    if (document.getElementById(sid)) return;
    const style = document.createElement('style');
    style.id = sid;
    style.textContent = `
      .ovp-pr-filters{
        border:1px solid rgba(148, 163, 184, 0.60);
        border-radius:12px;
        background: rgba(249, 250, 251, 0.90);
        padding:10px 10px 8px;
        display:flex;
        flex-wrap:wrap;
        gap:12px 14px;
      }
      .ovp-pr-filter-group{
        display:flex;
        flex-direction:column;
        gap:6px;
        min-width: 180px;
      }
      .ovp-pr-filter-label{
        font-size:11px;
        color: var(--muted);
        line-height:1.2;
        display:flex;
        align-items:center;
        gap:8px;
      }
      .ovp-pr-filter-label .ovp-pr-badge{
        display:inline-flex;
        align-items:center;
        padding:1px 8px;
        border-radius:999px;
        border:1px solid rgba(148, 163, 184, 0.55);
        background: rgba(255,255,255,0.9);
        color: var(--muted);
        font-size:10px;
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
        padding:4px 10px;
        border-radius:999px;
        border:1px solid rgba(148, 163, 184, 0.55);
        background: rgba(255,255,255,0.88);
        font-size:12px;
        color: var(--text);
        cursor:pointer;
        user-select:none;
      }
      .ovp-pr-chip input{
        margin:0;
        width:14px;
        height:14px;
        accent-color: var(--ovp-blue);
        cursor:pointer;
      }
      .ovp-pr-chip.is-checked{
        border-color: rgba(37, 99, 235, 0.55);
        background: rgba(37, 99, 235, 0.08);
      }
      .ovp-pr-chip.is-disabled{
        opacity: 0.55;
        cursor: not-allowed;
      }
      .ovp-pr-chip.is-disabled input{
        cursor: not-allowed;
      }
      .ovp-pr-hint{
        margin-top:2px;
        font-size:11px;
        color: var(--muted);
        line-height:1.4;
      }

      .ovp-pr-table-head{
        display:flex;
        align-items:center;
        justify-content:space-between;
        margin: 2px 2px 8px;
      }
      .ovp-pr-table-title{
        font-size:12px;
        color: var(--text);
        font-weight:600;
      }

      .ovp-pr-table-scroll{
        width:100%;
        overflow:auto;
        border:1px solid rgba(148, 163, 184, 0.60);
        border-radius:12px;
        background:#ffffff;
      }
      .ovp-pr-table{
        width:100%;
        border-collapse:collapse;
        min-width: 980px;
      }
      .ovp-pr-table th,
      .ovp-pr-table td{
        border:1px solid rgba(148, 163, 184, 0.35);
        padding:10px 10px;
        font-size:12px;
        color: var(--text);
        white-space: nowrap;
      }
      .ovp-pr-table thead th{
        background: rgba(249, 250, 251, 0.95);
        font-size:11px;
        color: var(--muted);
        text-align:center;
        position:sticky;
        top:0;
        z-index:2;
      }
      .ovp-pr-table tbody th{
        background: rgba(249, 250, 251, 0.65);
        font-weight:600;
        text-align:center;
        min-width: 74px;
      }
      .ovp-pr-td-num{
        text-align:right;
        font-variant-numeric: tabular-nums;
      }
      .ovp-pr-td-center{
        text-align:center;
      }
    `;
    document.head.appendChild(style);
  }

  function buildLayoutHTML(moduleId){
    return `
      <div class="ovp-module-stack">
        <div class="ovp-pr-filters" id="pr-filters-${moduleId}">
          <div class="ovp-pr-filter-group">
            <div class="ovp-pr-filter-label">月份<span class="ovp-pr-badge" id="pr-badge-months-${moduleId}">最多${MAX_MONTHS}个</span></div>
            <div class="ovp-pr-options" id="pr-months-${moduleId}"></div>
          </div>

          <div class="ovp-pr-filter-group">
            <div class="ovp-pr-filter-label">国家<span class="ovp-pr-badge">多选</span></div>
            <div class="ovp-pr-options" id="pr-countries-${moduleId}"></div>
          </div>

          <div class="ovp-pr-filter-group">
            <div class="ovp-pr-filter-label">图表类型<span class="ovp-pr-badge">单选</span></div>
            <div class="ovp-pr-options" id="pr-chartType-${moduleId}"></div>
          </div>

          <div class="ovp-pr-filter-group">
            <div class="ovp-pr-filter-label">媒体<span class="ovp-pr-badge">多选</span></div>
            <div class="ovp-pr-options" id="pr-medias-${moduleId}"></div>
          </div>

          <div class="ovp-pr-filter-group">
            <div class="ovp-pr-filter-label">产品类型<span class="ovp-pr-badge">多选</span></div>
            <div class="ovp-pr-options" id="pr-products-${moduleId}"></div>
          </div>

          <div class="ovp-pr-filter-group" style="min-width:260px; flex: 1 1 auto;">
            <div class="ovp-pr-filter-label">提示</div>
            <div class="ovp-pr-hint" id="pr-hint-${moduleId}"></div>
          </div>
        </div>

        <div>
          <div class="ovp-chart" id="chart-${moduleId}" style="height:360px;"></div>
          <div class="ovp-chart-note" id="chart-note-${moduleId}"></div>
        </div>

        <div>
          <div class="ovp-pr-table-head">
            <div class="ovp-pr-table-title" id="table-title-${moduleId}">数据表</div>
          </div>
          <div class="ovp-pr-table-scroll">
            <table class="ovp-pr-table" id="table-${moduleId}"></table>
          </div>
          <div class="ovp-chart-note" id="table-note-${moduleId}"></div>
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
        <label class="ovp-pr-chip">
          <input type="checkbox" data-group="${group}" data-value="${val}" />
          <span>${label}</span>
        </label>
      `;
    }).join('');
  }

  function dedupeKeepOrder(list){
    const seen = new Set();
    const out = [];
    for (const x of (Array.isArray(list) ? list : [])){
      const k = String(x);
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(x);
    }
    return out;
  }

  OVP.registerModule({
    id: moduleId,
    title: '买量注册数',
    subtitle: '口径：registration；注册单价=spent/registration（单位：人、币/人）',
    span: 'full',

    render({ mountEl, rawByMonth, months, latestMonth, utils }){
      ensureStyle();

      if (!mountEl) return;
      const rbm = rawByMonth
        || (typeof RAW_PAID_BY_MONTH !== 'undefined' ? RAW_PAID_BY_MONTH : undefined)
        || (typeof RAW_PAID_MONTHLY !== 'undefined' ? RAW_PAID_MONTHLY : undefined);

      if (!rbm || typeof rbm !== 'object'){
        mountEl.innerHTML = `<div class="ovp-alert">未检测到源数据 rawByMonth（建议在 paid-monthly/data.js 暴露 RAW_PAID_BY_MONTH，并由 index 注入 render 参数）。</div>`;
        return;
      }
      if (!window.echarts){
        mountEl.innerHTML = `<div class="ovp-alert">未检测到 ECharts：请检查 echarts 是否已在页面加载。</div>`;
        return;
      }

      const sortMonths = (ms)=>{
        if (utils && typeof utils.sortMonths === 'function') return utils.sortMonths(ms);
        return (Array.isArray(ms) ? ms.slice() : []).sort((a,b)=>String(a).localeCompare(String(b)));
      };

      const allMonths = sortMonths(
        Array.isArray(months) && months.length ? months : Object.keys(rbm || {})
      );

      if (!allMonths.length){
        mountEl.innerHTML = `<div class="ovp-alert">数据已加载，但未检测到月份 key（rawByMonth 为空）。</div>`;
        return;
      }

      const lm = latestMonth || allMonths[allMonths.length - 1];

      // ---- Scan data for options + field availability ----
      const foundCountries = new Set();
      const mediaMap = new Map();   // mediaKey -> display
      const productMap = new Map(); // productKey -> display
      let hasMedia = false;
      let hasProduct = false;
      let hasSpend = false;
      let hasReg = false;
      let currency = 'USD';

      for (const m of allMonths){
        const rows = Array.isArray(rbm[m]) ? rbm[m] : [];
        for (const r of rows){
          if (!r) continue;
          const c = getCountry(r);
          if (c) foundCountries.add(c);

          if (!hasReg) hasReg = hasAnyNumberField(r, REG_KEYS);
          if (!hasSpend) hasSpend = hasAnyNumberField(r, SPEND_KEYS);

          const mk = getMediaKey(r);
          if (mk){
            hasMedia = true;
            if (!mediaMap.has(mk)) mediaMap.set(mk, str(getMediaRaw(r)) || mk);
          }

          const pk = getProductKey(r);
          if (pk){
            hasProduct = true;
            if (!productMap.has(pk)) productMap.set(pk, str(getProductRaw(r)) || pk);
          }

          const cur = str(r.currency || r.ccy);
          if (cur && /^[A-Za-z]{3}$/.test(cur)){
            currency = cur.toUpperCase();
          }
        }
      }

      const extraCountries = [...foundCountries].filter(c=>!COUNTRY_ORDER.includes(c)).sort((a,b)=>String(a).localeCompare(String(b)));
      const baseCountries = foundCountries.size
        ? COUNTRY_ORDER.filter(c=>foundCountries.has(c))
        : COUNTRY_ORDER.slice();
      const allCountries = dedupeKeepOrder(baseCountries.concat(extraCountries));
      if (!allCountries.length) allCountries.push(...COUNTRY_ORDER);

      const allMediaKeys = [...mediaMap.keys()].sort((a,b)=>{
        const da = String(mediaMap.get(a) || a);
        const db = String(mediaMap.get(b) || b);
        return da.localeCompare(db);
      });
      const allProductKeys = [...productMap.keys()].sort((a,b)=>{
        const da = String(productMap.get(a) || a);
        const db = String(productMap.get(b) || b);
        return da.localeCompare(db);
      });

      const mediaLabel = (k)=>{
        const d = String(mediaMap.get(k) || k);
        return d;
      };
      const productLabel = (k)=>{
        const d = String(productMap.get(k) || k);
        return d;
      };

      // ---- Mount ----
      mountEl.innerHTML = buildLayoutHTML(moduleId);

      const filtersEl   = mountEl.querySelector(`#pr-filters-${moduleId}`);
      const monthsEl    = mountEl.querySelector(`#pr-months-${moduleId}`);
      const countriesEl = mountEl.querySelector(`#pr-countries-${moduleId}`);
      const chartTypeEl = mountEl.querySelector(`#pr-chartType-${moduleId}`);
      const mediasEl    = mountEl.querySelector(`#pr-medias-${moduleId}`);
      const productsEl  = mountEl.querySelector(`#pr-products-${moduleId}`);
      const hintEl      = mountEl.querySelector(`#pr-hint-${moduleId}`);

      const chartEl     = mountEl.querySelector(`#chart-${moduleId}`);
      const chartNoteEl = mountEl.querySelector(`#chart-note-${moduleId}`);

      const tableTitleEl= mountEl.querySelector(`#table-title-${moduleId}`);
      const tableEl     = mountEl.querySelector(`#table-${moduleId}`);
      const tableNoteEl = mountEl.querySelector(`#table-note-${moduleId}`);

      // options
      monthsEl.innerHTML = buildChipsHtml(allMonths, 'months');

      countriesEl.innerHTML = buildChipsHtml(
        [ALL_NO_SPLIT].concat(allCountries),
        'countries',
        (v)=> v === ALL_NO_SPLIT ? '全选但不区分' : v
      );

      mediasEl.innerHTML = buildChipsHtml(
        [ALL_NO_SPLIT].concat(hasMedia ? allMediaKeys : []),
        'medias',
        (v)=> v === ALL_NO_SPLIT ? '全选但不区分' : (mediaLabel(v).toUpperCase())
      );

      productsEl.innerHTML = buildChipsHtml(
        [ALL_NO_SPLIT].concat(hasProduct ? allProductKeys : []),
        'products',
        (v)=> v === ALL_NO_SPLIT ? '全选但不区分' : (productLabel(v).toUpperCase())
      );

      chartTypeEl.innerHTML = buildChipsHtml(
        CHART_TYPES.map(x=>x.key),
        'chartType',
        (k)=>{
          const hit = CHART_TYPES.find(x=>x.key===k);
          return hit ? hit.label : k;
        }
      );

      // chart init + resize
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

      // fmt helpers
      const fmtInt = (utils && typeof utils.fmtInt === 'function')
        ? (v)=>utils.fmtInt(v)
        : (v)=> (v === null || v === undefined) ? '—' : String(Math.round(Number(v)));
      const fmtMoney = (utils && typeof utils.fmtMoney === 'function')
        ? (v, ccy, digits)=>utils.fmtMoney(v, ccy, digits)
        : (v, ccy, digits)=>{
            const n = Number(v);
            if (!Number.isFinite(n)) return '—';
            const d = Number.isFinite(Number(digits)) ? Number(digits) : 2;
            return `${n.toFixed(d)} ${ccy || ''}`.trim();
          };

      // state
      const state = {
        chartType: 'bar',
        months: new Set(lm ? [lm] : []),                    // up to MAX_MONTHS
        countries: new Set(allCountries),                   // default all
        medias: new Set(allMediaKeys),                      // default all
        products: new Set(allProductKeys),                  // default all
        agg: {
          countries: false,
          medias: !hasMedia,    // if no field, force "no split"
          products: !hasProduct
        }
      };

      const backup = {
        countries: new Set(),
        medias: new Set(),
        products: new Set()
      };

      let flashHint = '';

      const cacheMonthly = new Map(); // key -> { reg, spent }

      function monthList(){
        return sortMonths([...state.months]);
      }
      function countryList(){
        // keep fixed order (plus extra if exists)
        return allCountries.filter(c=>state.countries.has(c));
      }
      function mediaList(){
        return allMediaKeys.filter(k=>state.medias.has(k));
      }
      function productList(){
        return allProductKeys.filter(k=>state.products.has(k));
      }
      function ensureAtLeastOne(set, fallback){
        if (set.size) return;
        if (fallback !== undefined && fallback !== null) set.add(String(fallback));
      }

      function setAgg(group, on){
        const isOn = !!on;
        if (group === 'countries'){
          state.agg.countries = isOn;
          if (isOn){
            backup.countries = new Set(state.countries);
            state.countries = new Set(allCountries);
          } else {
            const restore = backup.countries && backup.countries.size ? [...backup.countries] : allCountries;
            state.countries = new Set(restore);
            ensureAtLeastOne(state.countries, allCountries[0]);
          }
        }
        if (group === 'medias'){
          state.agg.medias = isOn;
          if (isOn){
            backup.medias = new Set(state.medias);
            state.medias = new Set(allMediaKeys);
          } else {
            const restore = backup.medias && backup.medias.size ? [...backup.medias] : allMediaKeys;
            state.medias = new Set(restore);
            ensureAtLeastOne(state.medias, allMediaKeys[0]);
          }
        }
        if (group === 'products'){
          state.agg.products = isOn;
          if (isOn){
            backup.products = new Set(state.products);
            state.products = new Set(allProductKeys);
          } else {
            const restore = backup.products && backup.products.size ? [...backup.products] : allProductKeys;
            state.products = new Set(restore);
            ensureAtLeastOne(state.products, allProductKeys[0]);
          }
        }
      }

      function buildHintText(){
        const ms = monthList();
        const cs = state.agg.countries ? '全选但不区分' : countryList().join('+');
        const md = hasMedia ? (state.agg.medias ? '全选但不区分' : mediaList().map(k=>mediaLabel(k).toUpperCase()).join('+')) : '缺少字段';
        const pd = hasProduct ? (state.agg.products ? '全选但不区分' : productList().map(k=>productLabel(k).toUpperCase()).join('+')) : '缺少字段';

        const parts = [
          `月份最多选${MAX_MONTHS}个：${ms.join(' + ') || '—'}`,
          `国家：${cs || '—'}`,
          `媒体：${md || '—'}`,
          `产品：${pd || '—'}`
        ];

        if (flashHint) parts.push(flashHint);
        if (!hasSpend) parts.push('未检测到 spent/spend/cost 字段：注册单价会显示为 —。');
        if (!hasReg) parts.push('未检测到 registration 字段：请检查数据源字段名。');

        return parts.join('；');
      }

      function setChipState(){
        const inputs = filtersEl.querySelectorAll('input[data-group][data-value]');
        for (const input of inputs){
          const group = input.getAttribute('data-group');
          const val = input.getAttribute('data-value');
          let checked = false;
          let disabled = false;

          if (group === 'chartType'){
            checked = (state.chartType === val);
          } else if (group === 'months'){
            checked = state.months.has(val);
          } else if (group === 'countries'){
            if (val === ALL_NO_SPLIT) checked = state.agg.countries;
            else checked = state.countries.has(val);
            disabled = state.agg.countries && val !== ALL_NO_SPLIT;
          } else if (group === 'medias'){
            if (val === ALL_NO_SPLIT) checked = state.agg.medias;
            else checked = state.medias.has(val);
            disabled = (!hasMedia) || (state.agg.medias && val !== ALL_NO_SPLIT) || (!hasMedia && val === ALL_NO_SPLIT);
          } else if (group === 'products'){
            if (val === ALL_NO_SPLIT) checked = state.agg.products;
            else checked = state.products.has(val);
            disabled = (!hasProduct) || (state.agg.products && val !== ALL_NO_SPLIT) || (!hasProduct && val === ALL_NO_SPLIT);
          }

          input.checked = !!checked;
          input.disabled = !!disabled;

          const labelEl = input.closest('.ovp-pr-chip');
          if (labelEl){
            labelEl.classList.toggle('is-checked', !!checked);
            labelEl.classList.toggle('is-disabled', !!disabled);
          }
        }

        if (hintEl) hintEl.textContent = buildHintText();
        flashHint = ''; // consume
      }

      function getMonthlyAgg(month, countryOrNull, mediaOrNull, productOrNull){
        const cKey = countryOrNull ? String(countryOrNull) : '*';
        const mKey = mediaOrNull ? String(mediaOrNull) : '*';
        const pKey = productOrNull ? String(productOrNull) : '*';
        const key = `${month}|${cKey}|${mKey}|${pKey}`;
        if (cacheMonthly.has(key)) return cacheMonthly.get(key);

        const rows = Array.isArray(rbm[month]) ? rbm[month] : [];
        let reg = 0;
        let spent = 0;

        for (const r of rows){
          if (!r) continue;

          if (countryOrNull && getCountry(r) !== String(countryOrNull)) continue;
          if (mediaOrNull && getMediaKey(r) !== String(mediaOrNull)) continue;
          if (productOrNull && getProductKey(r) !== String(productOrNull)) continue;

          reg += getReg(r);
          spent += getSpend(r);
        }

        const out = { reg, spent };
        cacheMonthly.set(key, out);
        return out;
      }

      function renderChartBar(monthsSel, countriesSel, mediasSel, productsSel){
        const xCats = state.agg.countries ? ['ALL'] : (countriesSel.length ? countriesSel : []);
        if (!monthsSel.length || !xCats.length){
          chart.setOption({
            title: { text:'无可用数据', left:'center', top:'middle', textStyle:{ color:'#94a3b8', fontSize:12 } },
            xAxis: { show:false }, yAxis: { show:false }, series: []
          }, { notMerge:true });
          if (chartNoteEl) chartNoteEl.textContent = '当前筛选无数据：请至少选择 1 个国家/月份。';
          return;
        }

        const mDim = (hasMedia && !state.agg.medias) ? mediasSel : [null];
        const pDim = (hasProduct && !state.agg.products) ? productsSel : [null];

        const metas = [];
        for (const m of monthsSel){
          for (const mk of mDim){
            for (const pk of pDim){
              const parts = [m];
              if (mk) parts.push(mediaLabel(mk).toUpperCase());
              if (pk) parts.push(productLabel(pk).toUpperCase());
              metas.push({ month:m, media:mk, product:pk, label: parts.join(' · ') });
            }
          }
        }

        if (!metas.length){
          chart.setOption({
            title: { text:'无可用数据', left:'center', top:'middle', textStyle:{ color:'#94a3b8', fontSize:12 } },
            xAxis: { show:false }, yAxis: { show:false }, series: []
          }, { notMerge:true });
          if (chartNoteEl) chartNoteEl.textContent = '当前筛选无数据：请检查媒体/产品类型选择。';
          return;
        }

        const barWidth = (metas.length <= 4) ? 14 : (metas.length <= 8) ? 12 : (metas.length <= 12) ? 10 : 8;

        const metaBySeriesIndex = [];
        const series = metas.map((meta, idx)=>{
          const data = xCats.map(x=>{
            const c = (x === 'ALL') ? null : x;
            const agg = getMonthlyAgg(meta.month, c, meta.media, meta.product);
            return agg.reg || 0;
          });
          metaBySeriesIndex[idx] = meta;
          return {
            name: meta.label,
            type: 'bar',
            barWidth,
            data,
            emphasis: { focus: 'series' }
          };
        });

        const option = {
          grid: { left: 56, right: 18, top: 50, bottom: 34, containLabel: true },
          legend: {
            type: 'scroll',
            top: 10,
            left: 10,
            right: 10
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: (params)=>{
              const list = Array.isArray(params) ? params : [params];
              const axisVal = (list[0] && list[0].axisValue) ? String(list[0].axisValue) : '';
              let html = `<div style="font-weight:600;margin-bottom:6px;">${axisVal}</div>`;
              for (const p of list){
                const meta = metaBySeriesIndex[p.seriesIndex];
                if (!meta) continue;
                const regVal = num(p.value);
                let cpaText = '';
                if (hasSpend){
                  const c = (axisVal === 'ALL') ? null : axisVal;
                  const agg = getMonthlyAgg(meta.month, c, meta.media, meta.product);
                  const cpa = (agg.reg > 0) ? (agg.spent / agg.reg) : null;
                  cpaText = `；注册单价 ${fmtMoney(cpa, currency, 2)}`;
                }
                // p.color may be object; fallback to css blue
                const color = (typeof p.color === 'string') ? p.color : cssVar('--ovp-blue', '#2563eb');
                html += `<div>
                  <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${color};margin-right:6px;"></span>
                  ${meta.label}：注册数 ${fmtInt(regVal)}${cpaText}
                </div>`;
              }
              return html;
            }
          },
          xAxis: {
            type: 'category',
            data: xCats,
            axisTick: { alignWithLabel: true }
          },
          yAxis: {
            type: 'value',
            name: '注册数（人）'
          },
          series
        };

        chart.setOption(option, { notMerge:true });

        if (chartNoteEl){
          const cs = state.agg.countries ? '全选但不区分' : countryList().join('+');
          const md = hasMedia ? (state.agg.medias ? '全选但不区分' : mediaList().map(k=>mediaLabel(k).toUpperCase()).join('+')) : '缺少字段';
          const pd = hasProduct ? (state.agg.products ? '全选但不区分' : productList().map(k=>productLabel(k).toUpperCase()).join('+')) : '缺少字段';
          chartNoteEl.textContent = `说明：月度柱状图（注册数）。当前：月份 ${monthsSel.join(' + ')}；国家 ${cs}；媒体 ${md}；产品 ${pd}。`;
        }
      }

      function renderChartLine(monthsSel, countriesSel, mediasSel, productsSel){
        if (!monthsSel.length){
          chart.setOption({
            title: { text:'无可用数据', left:'center', top:'middle', textStyle:{ color:'#94a3b8', fontSize:12 } },
            xAxis: { show:false }, yAxis: { show:false }, series: []
          }, { notMerge:true });
          if (chartNoteEl) chartNoteEl.textContent = '当前筛选无数据：请至少选择 1 个月份。';
          return;
        }

        const cDim = state.agg.countries ? [null] : (countriesSel.length ? countriesSel : []);
        const mDim = (hasMedia && !state.agg.medias) ? mediasSel : [null];
        const pDim = (hasProduct && !state.agg.products) ? productsSel : [null];

        if (!cDim.length){
          chart.setOption({
            title: { text:'无可用数据', left:'center', top:'middle', textStyle:{ color:'#94a3b8', fontSize:12 } },
            xAxis: { show:false }, yAxis: { show:false }, series: []
          }, { notMerge:true });
          if (chartNoteEl) chartNoteEl.textContent = '当前筛选无数据：请至少选择 1 个国家。';
          return;
        }

        // Collect all dates across selected months
        const dateSet = new Set();
        for (const m of monthsSel){
          const rows = Array.isArray(rbm[m]) ? rbm[m] : [];
          for (const r of rows){
            const d = getDate(r);
            if (d) dateSet.add(d);
          }
        }
        const dates = [...dateSet].sort((a,b)=>String(a).localeCompare(String(b)));

        if (!dates.length){
          chart.setOption({
            title: { text:'无可用数据', left:'center', top:'middle', textStyle:{ color:'#94a3b8', fontSize:12 } },
            xAxis: { show:false }, yAxis: { show:false }, series: []
          }, { notMerge:true });
          if (chartNoteEl) chartNoteEl.textContent = '当前筛选无日级数据：请检查 date 字段。';
          return;
        }

        function seriesLabel(meta){
          const parts = [];
          if (meta.country) parts.push(meta.country);
          if (meta.media) parts.push(mediaLabel(meta.media).toUpperCase());
          if (meta.product) parts.push(productLabel(meta.product).toUpperCase());
          if (!parts.length) parts.push('ALL');
          return parts.join(' · ');
        }

        const metas = [];
        for (const c of cDim){
          for (const mk of mDim){
            for (const pk of pDim){
              metas.push({ country:c, media:mk, product:pk });
            }
          }
        }

        const series = metas.map(meta=>{
          const map = new Map(); // date -> reg
          for (const m of monthsSel){
            const rows = Array.isArray(rbm[m]) ? rbm[m] : [];
            for (const r of rows){
              if (!r) continue;
              if (meta.country && getCountry(r) !== meta.country) continue;
              if (meta.media && getMediaKey(r) !== meta.media) continue;
              if (meta.product && getProductKey(r) !== meta.product) continue;

              const d = getDate(r);
              if (!d) continue;
              map.set(d, (map.get(d) || 0) + getReg(r));
            }
          }
          const data = dates.map(d=> map.has(d) ? map.get(d) : 0);
          return {
            name: seriesLabel(meta),
            type: 'line',
            symbol: 'none',
            data,
            connectNulls: true,
            lineStyle: { width: 2 },
            emphasis: { focus: 'series' }
          };
        });

        const option = {
          grid: { left: 56, right: 18, top: 50, bottom: 34, containLabel: true },
          legend: { type:'scroll', top: 10, left: 10, right: 10 },
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'line' },
            formatter: (params)=>{
              const list = Array.isArray(params) ? params : [params];
              const d = (list[0] && list[0].axisValue) ? String(list[0].axisValue) : '';
              let html = `<div style="font-weight:600;margin-bottom:6px;">${d}</div>`;
              for (const p of list){
                const color = (typeof p.color === 'string') ? p.color : cssVar('--ovp-blue', '#2563eb');
                html += `<div>
                  <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${color};margin-right:6px;"></span>
                  ${p.seriesName}：${fmtInt(p.value)}
                </div>`;
              }
              return html;
            }
          },
          xAxis: {
            type: 'category',
            data: dates,
            axisLabel: { formatter: (v)=>String(v).slice(5) } // MM-DD
          },
          yAxis: {
            type: 'value',
            name: '注册数（人）'
          },
          series
        };

        chart.setOption(option, { notMerge:true });

        if (chartNoteEl){
          const cs = state.agg.countries ? '全选但不区分' : countryList().join('+');
          const md = hasMedia ? (state.agg.medias ? '全选但不区分' : mediaList().map(k=>mediaLabel(k).toUpperCase()).join('+')) : '缺少字段';
          const pd = hasProduct ? (state.agg.products ? '全选但不区分' : productList().map(k=>productLabel(k).toUpperCase()).join('+')) : '缺少字段';
          chartNoteEl.textContent = `说明：日级折线图（注册数）。当前：月份 ${monthsSel.join(' + ')}；国家 ${cs}；媒体 ${md}；产品 ${pd}。`;
        }
      }

      function renderTable(monthsSel, countriesSel, mediasSel, productsSel){
        // Always keep "国家" column for spec consistency, even when aggregated (will show ALL)
        const showMediaCol = hasMedia && !state.agg.medias;
        const showProdCol = hasProduct && !state.agg.products;

        // Title: append (media，product) like spec
        const mediaTitle = hasMedia
          ? (state.agg.medias ? '全媒体' : mediaList().map(k=>mediaLabel(k)).join('+'))
          : '';
        const prodTitle = hasProduct
          ? (state.agg.products ? '全产品' : productList().map(k=>productLabel(k)).join('+'))
          : '';

        const suffix = (mediaTitle || prodTitle)
          ? `（${[mediaTitle, prodTitle].filter(Boolean).join('，')}）`
          : '';

        if (tableTitleEl) tableTitleEl.textContent = `数据表${suffix}`;

        // Columns per month
        const cols = [];
        for (const m of monthsSel){
          cols.push({ month:m, type:'reg', label:`${m} 注册数` });
          cols.push({ month:m, type:'cpa', label:`${m} 注册单价` });
        }

        const thead = `
          <thead>
            <tr>
              <th>国家</th>
              ${showMediaCol ? '<th>媒体</th>' : ''}
              ${showProdCol ? '<th>产品类型</th>' : ''}
              ${cols.map(c=>`<th>${c.label}</th>`).join('')}
            </tr>
          </thead>
        `;

        // Build row combos
        const cDim = state.agg.countries ? [null] : countriesSel;
        const mDim = showMediaCol ? mediasSel : [null];
        const pDim = showProdCol ? productsSel : [null];

        const rowsMeta = [];
        for (const c of cDim){
          for (const mk of mDim){
            for (const pk of pDim){
              rowsMeta.push({ country:c, media:mk, product:pk });
            }
          }
        }

        // Sort rows: country order -> media -> product
        const countryRank = new Map(allCountries.map((c,i)=>[c, i]));
        rowsMeta.sort((a,b)=>{
          const ra = a.country ? (countryRank.get(a.country) ?? 999) : -1;
          const rb = b.country ? (countryRank.get(b.country) ?? 999) : -1;
          if (ra !== rb) return ra - rb;
          const ma = a.media ? mediaLabel(a.media) : '';
          const mb = b.media ? mediaLabel(b.media) : '';
          const mc = ma.localeCompare(mb);
          if (mc) return mc;
          const pa = a.product ? productLabel(a.product) : '';
          const pb = b.product ? productLabel(b.product) : '';
          return pa.localeCompare(pb);
        });

        const tbodyRows = rowsMeta.map(rm=>{
          const dimTds = [
            `<th class="ovp-pr-td-center">${rm.country ? rm.country : 'ALL'}</th>`,
            showMediaCol ? `<td class="ovp-pr-td-center">${rm.media ? mediaLabel(rm.media).toUpperCase() : 'ALL'}</td>` : '',
            showProdCol ? `<td class="ovp-pr-td-center">${rm.product ? productLabel(rm.product).toUpperCase() : 'ALL'}</td>` : ''
          ].join('');

          const metricTds = cols.map(c=>{
            const agg = getMonthlyAgg(c.month, rm.country, rm.media, rm.product);
            const reg = agg.reg || 0;
            if (c.type === 'reg'){
              return `<td class="ovp-pr-td-num">${fmtInt(reg)}</td>`;
            }
            // cpa
            if (!hasSpend || reg <= 0) return `<td class="ovp-pr-td-num">—</td>`;
            const cpa = agg.spent / reg;
            return `<td class="ovp-pr-td-num">${fmtMoney(cpa, currency, 2)}</td>`;
          }).join('');

          return `<tr>${dimTds}${metricTds}</tr>`;
        }).join('');

        const tbody = `<tbody>${tbodyRows}</tbody>`;
        tableEl.innerHTML = `${thead}${tbody}`;

        if (tableNoteEl){
          const noteParts = [
            '单位：注册数=人',
            hasSpend ? `注册单价=${currency}/人（口径：Spend/Registration）` : '注册单价：未检测到 Spend 字段（显示为 —）'
          ];
          tableNoteEl.textContent = noteParts.join('；');
        }
      }

      function renderAll(){
        // guard: ensure months not empty
        ensureAtLeastOne(state.months, lm);

        // if agg is on, force select all
        if (state.agg.countries) state.countries = new Set(allCountries);
        if (state.agg.medias) state.medias = new Set(allMediaKeys);
        if (state.agg.products) state.products = new Set(allProductKeys);

        // ensure not empty (when not agg)
        if (!state.agg.countries) ensureAtLeastOne(state.countries, allCountries[0]);
        if (hasMedia && !state.agg.medias) ensureAtLeastOne(state.medias, allMediaKeys[0]);
        if (hasProduct && !state.agg.products) ensureAtLeastOne(state.products, allProductKeys[0]);

        const monthsSel = monthList();
        const countriesSel = countryList();
        const mediasSel = mediaList();
        const productsSel = productList();

        setChipState();

        if (state.chartType === 'bar'){
          renderChartBar(monthsSel, countriesSel, mediasSel, productsSel);
        } else {
          renderChartLine(monthsSel, countriesSel, mediasSel, productsSel);
        }

        renderTable(monthsSel, countriesSel, mediasSel, productsSel);
      }

      function onFilterChange(e){
        const input = e.target;
        if (!input || input.tagName !== 'INPUT') return;

        const group = input.getAttribute('data-group');
        const val = input.getAttribute('data-value');
        if (!group || val === null) return;

        // chartType behaves like radio
        if (group === 'chartType'){
          if (!input.checked){
            input.checked = true;
            return;
          }
          state.chartType = val;
          renderAll();
          return;
        }

        if (group === 'months'){
          if (input.checked){
            if (!state.months.has(val) && state.months.size >= MAX_MONTHS){
              input.checked = false;
              flashHint = `月份最多选 ${MAX_MONTHS} 个，已拦截本次选择。`;
              renderAll();
              return;
            }
            state.months.add(val);
          } else {
            state.months.delete(val);
            if (!state.months.size){
              state.months.add(val);
              input.checked = true;
              return;
            }
          }
          renderAll();
          return;
        }

        if (group === 'countries'){
          if (val === ALL_NO_SPLIT){
            setAgg('countries', input.checked);
            renderAll();
            return;
          }
          if (state.agg.countries){
            input.checked = true;
            return;
          }
          if (input.checked){
            state.countries.add(val);
          } else {
            state.countries.delete(val);
            if (!state.countries.size){
              state.countries.add(val);
              input.checked = true;
              return;
            }
          }
          renderAll();
          return;
        }

        if (group === 'medias'){
          if (val === ALL_NO_SPLIT){
            // if no field, keep it locked
            if (!hasMedia){
              input.checked = true;
              return;
            }
            setAgg('medias', input.checked);
            renderAll();
            return;
          }
          if (!hasMedia || state.agg.medias){
            input.checked = true;
            return;
          }
          if (input.checked){
            state.medias.add(val);
          } else {
            state.medias.delete(val);
            if (!state.medias.size){
              state.medias.add(val);
              input.checked = true;
              return;
            }
          }
          renderAll();
          return;
        }

        if (group === 'products'){
          if (val === ALL_NO_SPLIT){
            if (!hasProduct){
              input.checked = true;
              return;
            }
            setAgg('products', input.checked);
            renderAll();
            return;
          }
          if (!hasProduct || state.agg.products){
            input.checked = true;
            return;
          }
          if (input.checked){
            state.products.add(val);
          } else {
            state.products.delete(val);
            if (!state.products.size){
              state.products.add(val);
              input.checked = true;
              return;
            }
          }
          renderAll();
          return;
        }
      }

      if (filtersEl) filtersEl.addEventListener('change', onFilterChange);

      // Defaults: if media/product missing, lock agg on
      if (!hasMedia) setAgg('medias', true);
      if (!hasProduct) setAgg('products', true);

      renderAll();
    }
  });
})();
