// organic-vs-paid/module-registration-compare.js
(function () {
  window.OVP = window.OVP || {};
  const register =
    OVP.registerModule ||
    function (m) {
      (OVP.modules || (OVP.modules = [])).push(m);
    };

  const MODULE_ID = 'm1-registration';
  const COUNTRIES = ['GH', 'KE', 'NG', 'TZ', 'UG'];

  const ECHARTS_SRC = 'https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js';

  function injectStylesOnce() {
    const id = 'ovp-m1-reg-style';
    if (document.getElementById(id)) return;

    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      .ovp-m1{display:flex;flex-direction:column;gap:12px}
      .ovp-m1 .row{display:flex;flex-wrap:wrap;gap:12px;align-items:flex-end}
      .ovp-m1 .fg{display:flex;flex-direction:column;gap:6px;min-width:180px}
      .ovp-m1 label{font-size:12px;color:var(--muted, rgba(255,255,255,.62))}
      .ovp-m1 select{
        height:36px; padding:0 10px; border-radius:10px;
        border:1px solid var(--border, rgba(255,255,255,.12));
        background:rgba(255,255,255,.03); color:var(--text, rgba(255,255,255,.92));
        outline:none;
      }

      .ovp-m1 .chips{
        display:flex;flex-wrap:wrap;gap:6px;
        padding:6px;
        border:1px solid var(--border, rgba(255,255,255,.12));
        background:rgba(255,255,255,.03);
        border-radius:12px;
        min-height:36px;
      }
      .ovp-m1 .chip{
        display:inline-flex;align-items:center;gap:8px;
        padding:6px 10px;border-radius:999px;
        border:1px solid var(--border, rgba(255,255,255,.12));
        color:var(--muted, rgba(255,255,255,.62));
        font-size:12px;cursor:pointer;user-select:none;
        background:transparent;
      }
      .ovp-m1 .chip input{margin:0}
      .ovp-m1 .chip.on{
        color:var(--text, rgba(255,255,255,.92));
        background:rgba(255,255,255,.08);
      }

      .ovp-m1 .seg{
        display:inline-flex; gap:6px; padding:4px;
        border:1px solid var(--border, rgba(255,255,255,.12));
        background:rgba(255,255,255,.03); border-radius:12px;
      }
      .ovp-m1 .seg button{
        height:28px; padding:0 10px;
        border:0; border-radius:10px;
        background:transparent; color:var(--muted, rgba(255,255,255,.62));
        cursor:pointer;
      }
      .ovp-m1 .seg button[aria-pressed="true"]{
        background:rgba(255,255,255,.08);
        color:var(--text, rgba(255,255,255,.92));
      }

      .ovp-m1 .hint{
        margin-top:6px;
        font-size:12px; color:var(--muted, rgba(255,255,255,.62));
        line-height:1.5;
      }
      .ovp-m1 .chart{
        height:340px; width:100%;
        border:1px solid var(--border, rgba(255,255,255,.12));
        border-radius:12px;
        background:rgba(255,255,255,.02);
      }

      .ovp-m1 .table-wrap{overflow:auto}
      .ovp-m1 table{
        width:100%;
        border-collapse:separate; border-spacing:0;
        border:1px solid var(--border, rgba(255,255,255,.12));
        border-radius:12px; overflow:hidden;
        background:rgba(255,255,255,.02);
      }
      .ovp-m1 th,.ovp-m1 td{
        padding:10px 12px;
        border-bottom:1px solid var(--border, rgba(255,255,255,.12));
        font-size:12px;
        white-space:nowrap;
      }
      .ovp-m1 th{color:var(--muted, rgba(255,255,255,.62)); text-align:left}
      .ovp-m1 td{color:var(--text, rgba(255,255,255,.92)); text-align:left}
      .ovp-m1 tbody tr.dim td{opacity:.55}
      .ovp-m1 tbody tr:last-child td{border-bottom:0}

      .ovp-m1 .empty{
        padding:12px; border:1px dashed var(--border, rgba(255,255,255,.12));
        border-radius:12px; color:var(--muted, rgba(255,255,255,.62)); font-size:12px; line-height:1.6;
      }
      .ovp-m1 .subline{
        display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap;
        font-size:12px; color:var(--muted, rgba(255,255,255,.62));
        margin-top:-4px;
      }
      .ovp-m1 .subline .k{display:inline-flex; gap:6px; align-items:center}
      .ovp-m1 .dot{width:8px;height:8px;border-radius:999px;display:inline-block}
    `;
    document.head.appendChild(style);
  }

  function cssVar(name, fallback) {
    try {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name);
      if (v && String(v).trim()) return String(v).trim();
    } catch (_e) {}
    return fallback;
  }

  function toNumber(x) {
    const n = Number(x);
    return Number.isFinite(n) ? n : null;
  }

  function pickKey(obj, keys) {
    if (!obj || typeof obj !== 'object') return null;
    for (const k of keys) if (Object.prototype.hasOwnProperty.call(obj, k)) return k;
    const map = Object.create(null);
    for (const k of Object.keys(obj)) map[String(k).toLowerCase()] = k;
    for (const want of keys) {
      const hit = map[String(want).toLowerCase()];
      if (hit) return hit;
    }
    return null;
  }

  function normalizeMonth(input) {
    // Prefer shared helper from insights-copy.js (keep month formats consistent)
    if (window.OVP && OVP.insights && typeof OVP.insights.normalizeMonth === 'function') {
      const v = OVP.insights.normalizeMonth(input);
      if (v) return v;
    }
    if (!input) return null;

    const s = String(input).trim();
    let m = s.match(/^(\d{4})-(\d{1,2})$/);
    if (m) return `${m[1]}-${String(m[2]).padStart(2, '0')}`;

    m = s.match(/^(\d{4})(\d{2})$/);
    if (m) return `${m[1]}-${m[2]}`;

    m = s.match(/^(\d{4})-(\d{1,2})-\d{1,2}$/);
    if (m) return `${m[1]}-${String(m[2]).padStart(2, '0')}`;

    return null;
  }

  function monthValue(key) {
    const m = String(key || '').match(/^(\d{4})-(\d{2})$/);
    if (!m) return -1;
    return Number(m[1]) * 100 + Number(m[2]);
  }

  function resolveByMonthMap(input, globalNames) {
    const tryObj = (x) => {
      if (!x || typeof x !== 'object') return null;
      if (Array.isArray(x)) return null;

      const keys = Object.keys(x);
      if (keys.some((k) => /^\d{4}-\d{2}$/.test(k))) return x;

      // wrapper: {data:{...}} / {rows:{...}}
      const wrapKey = pickKey(x, ['data', 'rows', 'items', 'list', 'byMonth', 'by_month']);
      if (wrapKey) {
        const inner = tryObj(x[wrapKey]);
        if (inner) return inner;
      }

      // wrapper: { RAW_ORGANIC_BY_MONTH: {...} }
      for (const name of globalNames || []) {
        if (Object.prototype.hasOwnProperty.call(x, name)) {
          const inner = tryObj(x[name]);
          if (inner) return inner;
        }
      }
      return null;
    };

    const direct = tryObj(input);
    if (direct) return direct;

    for (const name of globalNames || []) {
      const g = tryObj(window[name]);
      if (g) return g;
    }
    return {};
  }

  function listMonths(oMap, pMap) {
    const set = new Set();
    for (const k of Object.keys(oMap || {})) {
      const m = normalizeMonth(k) || k;
      if (m) set.add(m);
    }
    for (const k of Object.keys(pMap || {})) {
      const m = normalizeMonth(k) || k;
      if (m) set.add(m);
    }
    const arr = Array.from(set);
    arr.sort((a, b) => monthValue(a) - monthValue(b));
    return arr;
  }

  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  function daysInMonth(monthKey) {
    const m = String(monthKey || '').match(/^(\d{4})-(\d{2})$/);
    if (!m) return [];
    const y = Number(m[1]);
    const mm = Number(m[2]);
    const last = new Date(y, mm, 0).getDate(); // mm is 1-12; use next month 0th day
    const out = [];
    for (let d = 1; d <= last; d++) out.push(`${y}-${pad2(mm)}-${pad2(d)}`);
    return out;
  }

  function monthArray(map, monthKey) {
    if (!map || typeof map !== 'object') return [];
    const norm = normalizeMonth(monthKey);
    const hit = norm && map[norm] ? map[norm] : map[monthKey];
    return Array.isArray(hit) ? hit : [];
  }

  function buildMonthCountryTotals(byMonthMap, monthKey) {
    const totals = new Map();
    for (const c of COUNTRIES) totals.set(c, 0);

    const rows = monthArray(byMonthMap, monthKey);
    if (!rows.length) return totals;

    for (const row of rows) {
      if (!row || typeof row !== 'object') continue;
      const cKey = pickKey(row, ['country', 'cc', 'market']);
      const rKey = pickKey(row, ['registration', 'registrations', 'reg', 'register']);
      if (!cKey || !rKey) continue;
      const country = String(row[cKey] || '').toUpperCase();
      if (!COUNTRIES.includes(country)) continue;
      const reg = toNumber(row[rKey]);
      if (reg === null) continue;
      totals.set(country, (totals.get(country) || 0) + reg);
    }
    return totals;
  }

  function buildDayCountryMap(byMonthMap, monthKey) {
    // key: `${date}|${country}` => sum(registration)
    const map = new Map();
    const rows = monthArray(byMonthMap, monthKey);
    if (!rows.length) return map;

    for (const row of rows) {
      if (!row || typeof row !== 'object') continue;
      const cKey = pickKey(row, ['country', 'cc', 'market']);
      const dKey = pickKey(row, ['date', 'day', 'dt']);
      const rKey = pickKey(row, ['registration', 'registrations', 'reg', 'register']);
      if (!cKey || !dKey || !rKey) continue;

      const country = String(row[cKey] || '').toUpperCase();
      if (!COUNTRIES.includes(country)) continue;

      const dateStr = String(row[dKey] || '').slice(0, 10);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) continue;

      const reg = toNumber(row[rKey]);
      if (reg === null) continue;

      const key = `${dateStr}|${country}`;
      map.set(key, (map.get(key) || 0) + reg);
    }
    return map;
  }

  function loadScriptOnce(id, src) {
    return new Promise((resolve, reject) => {
      if (document.getElementById(id)) return resolve();
      const s = document.createElement('script');
      s.id = id;
      s.src = src;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error(`load failed: ${src}`));
      document.head.appendChild(s);
    });
  }

  function loadECharts() {
    if (window.echarts) return Promise.resolve(window.echarts);
    return loadScriptOnce('ovp-echarts', ECHARTS_SRC).then(() => {
      if (!window.echarts) throw new Error('echarts not available');
      return window.echarts;
    });
  }

  register({
    id: MODULE_ID,
    title: '自然量 vs 买量注册量',
    subtitle: '注册量对比（自然量 / 买量）',
    span: 'full',

    render({ mountEl, organic, paid, utils }) {
      injectStylesOnce();

      // Accept both: ctx data OR global RAW_*_BY_MONTH
      const organicByMonth = resolveByMonthMap(organic, [
        'RAW_ORGANIC_BY_MONTH',
        'organicData',
        'ORGANIC_DATA',
        'organicMonthlyData',
        'ORGANIC_MONTHLY_DATA'
      ]);
      const paidByMonth = resolveByMonthMap(paid, [
        'RAW_PAID_BY_MONTH',
        'paidData',
        'PAID_DATA',
        'paidMonthlyData',
        'PAID_MONTHLY_DATA'
      ]);

      const months = listMonths(organicByMonth, paidByMonth);
      if (!months.length) {
        mountEl.innerHTML = `
          <div class="ovp-m1">
            <div class="empty">
              没读到月份数据：需要 organic-data.js / paid-data.js 暴露按月分包的数据对象（例如 window.RAW_ORGANIC_BY_MONTH / window.RAW_PAID_BY_MONTH）。
            </div>
          </div>
        `;
        return;
      }

      const latestMonth = months[months.length - 1];

      // caches
      const cache = {
        orgMonthTotals: new Map(), // month => Map(country => sum)
        paidMonthTotals: new Map(),
        orgDayMap: new Map(), // month => Map(date|country => sum)
        paidDayMap: new Map()
      };

      function getMonthTotals(which, monthKey) {
        const normMonth = normalizeMonth(monthKey) || monthKey;
        const store = which === 'paid' ? cache.paidMonthTotals : cache.orgMonthTotals;
        if (store.has(normMonth)) return store.get(normMonth);
        const map =
          which === 'paid'
            ? buildMonthCountryTotals(paidByMonth, normMonth)
            : buildMonthCountryTotals(organicByMonth, normMonth);
        store.set(normMonth, map);
        return map;
      }

      function getDayMap(which, monthKey) {
        const normMonth = normalizeMonth(monthKey) || monthKey;
        const store = which === 'paid' ? cache.paidDayMap : cache.orgDayMap;
        if (store.has(normMonth)) return store.get(normMonth);
        const map =
          which === 'paid'
            ? buildDayCountryMap(paidByMonth, normMonth)
            : buildDayCountryMap(organicByMonth, normMonth);
        store.set(normMonth, map);
        return map;
      }

      const uid = `ovp-${MODULE_ID}-${Math.random().toString(16).slice(2)}`;
      const monthId = `${uid}-month`;
      const countryGroup = `${uid}-country`;
      const chartId = `${uid}-chart`;
      const tableId = `${uid}-table`;
      const insightsId = `${uid}-insights`;
      const hintId = `${uid}-hint`;

      mountEl.innerHTML = `
        <div class="ovp-m1">
          <div class="row">
            <div class="fg">
              <label for="${monthId}">月份</label>
              <select id="${monthId}"></select>
            </div>

            <div class="fg" style="min-width:320px">
              <label>国家（多选）</label>
              <div class="chips" id="${countryGroup}">
                ${COUNTRIES.map((c, i) => {
                  const inputId = `${uid}-c-${c}`;
                  const checked = i === 0 ? 'checked' : '';
                  return `
                    <label class="chip ${checked ? 'on' : ''}" for="${inputId}">
                      <input id="${inputId}" type="checkbox" value="${c}" ${checked} />
                      <span>${c}</span>
                    </label>
                  `;
                }).join('')}
              </div>
            </div>

            <div class="fg" style="min-width:260px">
              <label>图表</label>
              <div class="seg" role="group" aria-label="图表类型切换">
                <button type="button" data-type="bar" aria-pressed="true">月度柱状图</button>
                <button type="button" data-type="line" aria-pressed="false">日级折线图</button>
              </div>
            </div>
          </div>

          <div class="subline">
            <div class="k"><span class="dot" style="background:${cssVar('--ovp-yellow', '#F6C344')}"></span>自然量</div>
            <div class="k"><span class="dot" style="background:${cssVar('--ovp-blue', '#3B82F6')}"></span>买量</div>
          </div>

          <div id="${chartId}" class="chart"></div>
          <div class="hint" id="${hintId}"></div>

          <div class="table-wrap">
            <table id="${tableId}">
              <thead>
                <tr>
                  <th>国家</th>
                  <th>自然量注册占比 (%)</th>
                  <th>买量注册占比 (%)</th>
                  <th>自然量注册数</th>
                  <th>买量注册数</th>
                  <th>总注册数</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>

          <div id="${insightsId}"></div>
        </div>
      `;

      const monthSel = mountEl.querySelector(`#${CSS.escape(monthId)}`);
      const chipsEl = mountEl.querySelector(`#${CSS.escape(countryGroup)}`);
      const chartEl = mountEl.querySelector(`#${CSS.escape(chartId)}`);
      const tableEl = mountEl.querySelector(`#${CSS.escape(tableId)}`);
      const hintEl = mountEl.querySelector(`#${CSS.escape(hintId)}`);
      const insightsEl = mountEl.querySelector(`#${CSS.escape(insightsId)}`);

      // Fill month options
      monthSel.innerHTML = months.map((m) => `<option value="${m}">${m}</option>`).join('');
      monthSel.value = latestMonth;

      const segBtns = Array.from(mountEl.querySelectorAll('.seg button'));
      let chartType = 'bar';
      let echartsApi = null;
      let chart = null;

      function setChartType(next) {
        chartType = next === 'line' ? 'line' : 'bar';
        for (const b of segBtns) {
          const isOn = b.getAttribute('data-type') === chartType;
          b.setAttribute('aria-pressed', isOn ? 'true' : 'false');
        }
      }

      function selectedCountries() {
        const inputs = Array.from(chipsEl.querySelectorAll('input[type="checkbox"]'));
        const selected = inputs.filter((i) => i.checked).map((i) => String(i.value || '').toUpperCase());
        const uniq = Array.from(new Set(selected)).filter((c) => COUNTRIES.includes(c));

        // Ensure at least one selection (avoid empty line chart)
        if (!uniq.length) {
          const first = chipsEl.querySelector(`input[value="${COUNTRIES[0]}"]`);
          if (first) first.checked = true;
          return [COUNTRIES[0]];
        }
        // Keep fixed order
        return COUNTRIES.filter((c) => uniq.includes(c));
      }

      function fmtPct(x) {
        if (x === null) return '—';
        if (utils && typeof utils.fmtPct === 'function') return utils.fmtPct(x, 2);
        return `${(x * 100).toFixed(2)}%`;
      }
      function fmtInt(x) {
        if (utils && typeof utils.fmtInt === 'function') return utils.fmtInt(x);
        const n = Number(x);
        return Number.isFinite(n) ? n.toLocaleString('en-US') : '—';
      }

      function updateTable(monthKey, selected) {
        const oTotals = getMonthTotals('organic', monthKey);
        const pTotals = getMonthTotals('paid', monthKey);

        const tbody = tableEl.querySelector('tbody');
        tbody.innerHTML = '';

        for (const c of COUNTRIES) {
          const o = Number(oTotals.get(c) || 0);
          const p = Number(pTotals.get(c) || 0);
          const t = o + p;

          const oShare = t > 0 ? o / t : null;
          const pShare = t > 0 ? p / t : null;

          const tr = document.createElement('tr');
          if (!selected.includes(c)) tr.classList.add('dim');

          tr.innerHTML = `
            <td>${c}</td>
            <td>${fmtPct(oShare)}</td>
            <td>${fmtPct(pShare)}</td>
            <td>${fmtInt(o)}</td>
            <td>${fmtInt(p)}</td>
            <td>${fmtInt(t)}</td>
          `;
          tbody.appendChild(tr);
        }
      }

      function updateInsights(monthKey) {
        if (window.OVP && OVP.insights && typeof OVP.insights.render === 'function') {
          OVP.insights.render(insightsEl, MODULE_ID, monthKey, { title: '数据分析' });
          return;
        }
        insightsEl.innerHTML = `
          <div class="empty">未加载 insights-copy.js：请在 index.html 里把它放到各 module-*.js 之前。</div>
        `;
      }

      function buildBarOption(monthKey, selected) {
        const text = cssVar('--text', 'rgba(255,255,255,.92)') || '#E5E7EB';
        const muted = cssVar('--muted', 'rgba(255,255,255,.62)') || '#9CA3AF';
        const border = cssVar('--border', 'rgba(255,255,255,.12)') || 'rgba(255,255,255,.12)';
        const organicColor = cssVar('--ovp-yellow', '#F6C344');
        const paidColor = cssVar('--ovp-blue', '#3B82F6');

        const oTotals = getMonthTotals('organic', monthKey);
        const pTotals = getMonthTotals('paid', monthKey);

        const oData = COUNTRIES.map((c) => ({
          value: Number(oTotals.get(c) || 0),
          itemStyle: { opacity: selected.includes(c) ? 1 : 0.28 }
        }));
        const pData = COUNTRIES.map((c) => ({
          value: Number(pTotals.get(c) || 0),
          itemStyle: { opacity: selected.includes(c) ? 1 : 0.28 }
        }));

        return {
          color: [organicColor, paidColor],
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: function (params) {
              const lines = [];
              if (params && params.length) {
                lines.push(`${params[0].axisValue}`);
                for (const it of params) {
                  const v = Number(it.value) || 0;
                  lines.push(`${it.marker}${it.seriesName}：${v.toLocaleString('en-US')}`);
                }
              }
              return lines.join('<br/>');
            }
          },
          legend: { data: ['自然量', '买量'], textStyle: { color: muted } },
          grid: { left: 24, right: 18, top: 44, bottom: 28, containLabel: true },
          xAxis: {
            type: 'category',
            data: COUNTRIES,
            axisLabel: { color: muted },
            axisLine: { lineStyle: { color: border } },
            axisTick: { lineStyle: { color: border } }
          },
          yAxis: {
            type: 'value',
            axisLabel: { color: muted },
            splitLine: { lineStyle: { color: border, opacity: 0.35 } }
          },
          series: [
            { name: '自然量', type: 'bar', barMaxWidth: 30, data: oData, emphasis: { focus: 'series' } },
            { name: '买量', type: 'bar', barMaxWidth: 30, data: pData, emphasis: { focus: 'series' } }
          ],
          title: {
            text: `按国家对比（${monthKey}）`,
            left: 0,
            textStyle: { color: text, fontSize: 12, fontWeight: 600 }
          }
        };
      }

      function buildLineOption(monthKey, selected) {
        const text = cssVar('--text', 'rgba(255,255,255,.92)') || '#E5E7EB';
        const muted = cssVar('--muted', 'rgba(255,255,255,.62)') || '#9CA3AF';
        const border = cssVar('--border', 'rgba(255,255,255,.12)') || 'rgba(255,255,255,.12)';
        const organicColor = cssVar('--ovp-yellow', '#F6C344');
        const paidColor = cssVar('--ovp-blue', '#3B82F6');

        const days = daysInMonth(monthKey);
        const oDayMap = getDayMap('organic', monthKey);
        const pDayMap = getDayMap('paid', monthKey);

        const series = [];
        const legend = [];

        // ✅ 修正点：不做“国家加总”，而是每个国家各两条线（自然量/买量）
        for (const c of selected) {
          const oName = `${c} · 自然量`;
          const pName = `${c} · 买量`;
          legend.push(oName, pName);

          series.push({
            name: oName,
            type: 'line',
            smooth: false,
            showSymbol: false,
            data: days.map((d) => Number(oDayMap.get(`${d}|${c}`) || 0)),
            lineStyle: { width: 2, color: organicColor },
            itemStyle: { color: organicColor }
          });

          series.push({
            name: pName,
            type: 'line',
            smooth: false,
            showSymbol: false,
            data: days.map((d) => Number(pDayMap.get(`${d}|${c}`) || 0)),
            lineStyle: { width: 2, color: paidColor },
            itemStyle: { color: paidColor }
          });
        }

        return {
          tooltip: {
            trigger: 'axis',
            formatter: function (params) {
              const lines = [];
              if (params && params.length) {
                lines.push(`${params[0].axisValue}`);
                const byName = new Map();
                for (const it of params) byName.set(it.seriesName, it);
                for (const name of legend) {
                  const it = byName.get(name);
                  if (!it) continue;
                  const v = Number(it.value) || 0;
                  lines.push(`${it.marker}${it.seriesName}：${v.toLocaleString('en-US')}`);
                }
              }
              return lines.join('<br/>');
            }
          },
          legend: {
            type: 'scroll',
            data: legend,
            textStyle: { color: muted }
          },
          grid: { left: 24, right: 18, top: 44, bottom: 28, containLabel: true },
          xAxis: {
            type: 'category',
            data: days,
            axisLabel: { color: muted },
            axisLine: { lineStyle: { color: border } },
            axisTick: { lineStyle: { color: border } }
          },
          yAxis: {
            type: 'value',
            axisLabel: { color: muted },
            splitLine: { lineStyle: { color: border, opacity: 0.35 } }
          },
          series,
          title: {
            text: `日级趋势（${monthKey}）`,
            left: 0,
            textStyle: { color: text, fontSize: 12, fontWeight: 600 }
          }
        };
      }

      function updateView() {
        const monthKey = monthSel.value;
        const selected = selectedCountries();

        // Sync chip state styling
        for (const lab of chipsEl.querySelectorAll('.chip')) {
          const input = lab.querySelector('input');
          if (!input) continue;
          if (input.checked) lab.classList.add('on');
          else lab.classList.remove('on');
        }

        // hint
        if (chartType === 'bar') {
          hintEl.textContent = `月度柱状图：展示 5 国当月注册量对比；国家筛选用于高亮（当前 ${selected.join(',')}）。`;
        } else {
          hintEl.textContent = `日级折线图：展示所选月份内的每日注册量；每个国家两条线（自然量/买量），不做国家加总（当前 ${selected.join(',')}）。`;
        }

        updateTable(monthKey, selected);
        updateInsights(monthKey);

        if (!chart || !echartsApi) return;

        const option = chartType === 'bar' ? buildBarOption(monthKey, selected) : buildLineOption(monthKey, selected);

        chart.setOption(option, true);
        chart.resize();
      }

      // wire events
      monthSel.addEventListener('change', updateView);
      for (const input of chipsEl.querySelectorAll('input[type="checkbox"]')) {
        input.addEventListener('change', updateView);
      }
      for (const b of segBtns) {
        b.addEventListener('click', function () {
          setChartType(b.getAttribute('data-type'));
          updateView();
        });
      }

      // init chart (lazy load echarts)
      loadECharts()
        .then((api) => {
          echartsApi = api;
          try {
            echartsApi.dispose(chartEl);
          } catch (_e) {}
          chart = echartsApi.init(chartEl, null, { renderer: 'canvas' });

          const onResize = () => {
            try {
              chart && chart.resize();
            } catch (_e) {}
          };
          window.addEventListener('resize', onResize);

          updateView();
        })
        .catch(() => {
          chartEl.innerHTML = `
            <div class="empty">
              图表库加载失败（echarts）。当前仍会展示表格与数据分析位；如需图表，请确认 GitHub Pages 可访问 ${ECHARTS_SRC}。
            </div>
          `;
          updateView();
        });

      // initial state
      setChartType('bar');
      updateView();
    }
  });
})();
