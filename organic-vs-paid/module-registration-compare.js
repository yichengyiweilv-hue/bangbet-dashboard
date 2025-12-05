// organic-vs-paid/module-registration-compare.js
(function () {
  window.OVP = window.OVP || {};
  const register = OVP.registerModule || function (m) { (OVP.modules || (OVP.modules = [])).push(m); };

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
      .ovp-m1 tr:last-child td{border-bottom:0}
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

  function isFiniteNumber(x) {
    return typeof x === 'number' && Number.isFinite(x);
  }
  function toNumber(x) {
    if (isFiniteNumber(x)) return x;
    const n = Number(x);
    return Number.isFinite(n) ? n : null;
  }

  function pickKey(obj, keys) {
    if (!obj || typeof obj !== 'object') return null;

    // direct match
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (Object.prototype.hasOwnProperty.call(obj, k)) return k;
    }

    // case-insensitive match
    const map = Object.create(null);
    for (const k of Object.keys(obj)) map[String(k).toLowerCase()] = k;
    for (let i = 0; i < keys.length; i++) {
      const want = String(keys[i]).toLowerCase();
      if (map[want]) return map[want];
    }
    return null;
  }

  function normalizeMonth(input) {
    // 优先复用 insights 的 month 归一化，避免口径不一致
    if (window.OVP && OVP.insights && typeof OVP.insights.normalizeMonth === 'function') {
      return OVP.insights.normalizeMonth(input);
    }
    if (!input) return null;

    if (input instanceof Date && !isNaN(input.getTime())) {
      const y = input.getFullYear();
      const m = String(input.getMonth() + 1).padStart(2, '0');
      return `${y}-${m}`;
    }

    const s = String(input).trim();
    let m;

    m = s.match(/^(\d{4})[-\/](\d{1,2})$/);
    if (m) return `${m[1]}-${String(m[2]).padStart(2, '0')}`;

    m = s.match(/^(\d{4})(\d{2})$/);
    if (m) return `${m[1]}-${m[2]}`;

    m = s.match(/^(\d{4})[-\/](\d{1,2})[-\/]\d{1,2}$/);
    if (m) return `${m[1]}-${String(m[2]).padStart(2, '0')}`;

    return null;
  }

  function monthValue(key) {
    const m = String(key || '').match(/^(\d{4})-(\d{2})$/);
    if (!m) return -1;
    return Number(m[1]) * 100 + Number(m[2]);
  }

  function extractRegByCountry(row, country) {
    if (!row || typeof row !== 'object') return null;

    // 1) row[country] = number or object
    const direct = row[country];
    if (isFiniteNumber(direct)) return direct;
    if (direct && typeof direct === 'object') {
      const rk = pickKey(direct, ['registration', 'registrations', 'reg', 'register']);
      if (rk) return toNumber(direct[rk]);
    }

    // 2) flat keys like GH_registration / registration_GH
    const candidates = [
      `${country}_registration`,
      `${country}_registrations`,
      `${country}_reg`,
      `registration_${country}`,
      `registrations_${country}`,
      `reg_${country}`
    ];

    for (let i = 0; i < candidates.length; i++) {
      const k = pickKey(row, [candidates[i]]);
      if (!k) continue;
      const v = toNumber(row[k]);
      if (v !== null) return v;
    }

    return null;
  }

  function normalizeRegistrationRecords(raw) {
    const out = [];
    if (!raw) return out;

    const push = (month, country, reg) => {
      const m = normalizeMonth(month);
      const c = String(country || '').toUpperCase();
      const r = toNumber(reg);
      if (!m || !COUNTRIES.includes(c) || r === null) return;
      out.push({ month: m, country: c, registration: r });
    };

    // allow wrapper objects
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      const arrKey = pickKey(raw, ['data', 'rows', 'items', 'list']);
      if (arrKey && Array.isArray(raw[arrKey])) return normalizeRegistrationRecords(raw[arrKey]);
    }

    // A) array of {month,country,registration}
    if (Array.isArray(raw)) {
      const sample = raw[0] || {};
      const monthKey = pickKey(sample, ['month', 'ym', 'date', 'period']);
      const countryKey = pickKey(sample, ['country', 'geo', 'cc', 'market', 'nation']);
      const regKey = pickKey(sample, ['registration', 'registrations', 'reg', 'register']);

      const looksLikeRecord = Boolean(monthKey && countryKey && regKey);
      if (looksLikeRecord) {
        for (const row of raw) {
          push(row[monthKey], row[countryKey], row[regKey]);
        }
        return out;
      }

      // B) array of month rows: {month:'YYYY-MM', GH_registration:..., ...}
      const mk2 = monthKey || pickKey(sample, ['month', 'ym', 'date', 'period']);
      for (const row of raw) {
        const m = mk2 ? row[mk2] : row.month;
        const normM = normalizeMonth(m);
        if (!normM) continue;

        for (const c of COUNTRIES) {
          const reg = extractRegByCountry(row, c);
          if (reg === null) continue;
          out.push({ month: normM, country: c, registration: reg });
        }
      }

      return out;
    }

    // C) object keyed by month: { '2025-11': { GH: {registration:..}, ... } }
    if (raw && typeof raw === 'object') {
      for (const k of Object.keys(raw)) {
        const maybeMonth = normalizeMonth(k);
        const row = raw[k];
        if (!maybeMonth || !row || typeof row !== 'object') continue;

        for (const c of COUNTRIES) {
          const reg = extractRegByCountry(row, c);
          if (reg === null) continue;
          out.push({ month: maybeMonth, country: c, registration: reg });
        }
      }
    }

    return out;
  }

  function buildRegMap(records) {
    const map = new Map();
    for (const r of records) {
      const key = `${r.month}|${r.country}`;
      const prev = map.get(key) || 0;
      map.set(key, prev + (toNumber(r.registration) || 0));
    }
    return map;
  }

  function uniqueMonthsFrom(recordsA, recordsB) {
    const set = new Set();
    for (const r of (recordsA || [])) if (r && r.month) set.add(r.month);
    for (const r of (recordsB || [])) if (r && r.month) set.add(r.month);
    const arr = Array.from(set).filter(Boolean);
    arr.sort((a, b) => monthValue(a) - monthValue(b));
    return arr;
  }

  function loadScriptOnce(id, src) {
    return new Promise((resolve, reject) => {
      if (document.getElementById(id)) {
        resolve();
        return;
      }
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
    subtitle: 'registration 对比（自然黄 / 买量蓝）',
    span: 'full',

    render({ mountEl, organic, paid, utils }) {
      injectStylesOnce();

      const organicRecords = normalizeRegistrationRecords(organic);
      const paidRecords = normalizeRegistrationRecords(paid);

      const months = uniqueMonthsFrom(organicRecords, paidRecords);
      const organicMap = buildRegMap(organicRecords);
      const paidMap = buildRegMap(paidRecords);

      const uid = `ovp-${MODULE_ID}-${Math.random().toString(16).slice(2)}`;
      const monthId = `${uid}-month`;
      const countryId = `${uid}-country`;
      const chartId = `${uid}-chart`;
      const tableId = `${uid}-table`;
      const insightsId = `${uid}-insights`;

      if (!months.length) {
        mountEl.innerHTML = `
          <div class="ovp-m1">
            <div class="empty">没读到月份数据：请检查 organic-data.js / paid-data.js 是否包含 month + country + registration（或可被识别的等价字段）。</div>
          </div>
        `;
        return;
      }

      const latestMonth = months[months.length - 1];
      const defaultCountry = COUNTRIES[0];

      mountEl.innerHTML = `
        <div class="ovp-m1">
          <div class="row">
            <div class="fg">
              <label for="${monthId}">月份</label>
              <select id="${monthId}"></select>
            </div>

            <div class="fg">
              <label for="${countryId}">国家</label>
              <select id="${countryId}">
                ${COUNTRIES.map(c => `<option value="${c}">${c}</option>`).join('')}
              </select>
            </div>

            <div class="fg" style="min-width:220px">
              <label>图表</label>
              <div class="seg" role="group" aria-label="图表类型切换">
                <button type="button" data-type="bar" aria-pressed="true">柱状图</button>
                <button type="button" data-type="line" aria-pressed="false">折线图</button>
              </div>
            </div>
          </div>

          <div class="subline">
            <div class="k"><span class="dot" style="background:${cssVar('--ovp-yellow', '#F6C344')}"></span>自然量</div>
            <div class="k"><span class="dot" style="background:${cssVar('--ovp-blue', '#3B82F6')}"></span>买量</div>
          </div>

          <div id="${chartId}" class="chart"></div>
          <div class="hint" id="${uid}-hint"></div>

          <div class="table-wrap">
            <table id="${tableId}">
              <thead>
                <tr>
                  <th>自然量注册占比 (%)</th>
                  <th>买量注册占比 (%)</th>
                  <th>自然量注册数</th>
                  <th>买量注册数</th>
                  <th>总注册数</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>—</td><td>—</td><td>—</td><td>—</td><td>—</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div id="${insightsId}"></div>
        </div>
      `;

      const monthSel = mountEl.querySelector(`#${CSS.escape(monthId)}`);
      const countrySel = mountEl.querySelector(`#${CSS.escape(countryId)}`);
      const chartEl = mountEl.querySelector(`#${CSS.escape(chartId)}`);
      const tableEl = mountEl.querySelector(`#${CSS.escape(tableId)}`);
      const hintEl = mountEl.querySelector(`#${CSS.escape(uid)}-hint`);
      const insightsEl = mountEl.querySelector(`#${CSS.escape(insightsId)}`);

      // Fill month options
      monthSel.innerHTML = months.map(m => `<option value="${m}">${m}</option>`).join('');
      monthSel.value = latestMonth;
      countrySel.value = defaultCountry;

      const segBtns = Array.from(mountEl.querySelectorAll('.seg button'));
      let chartType = 'bar';

      function setChartType(next) {
        chartType = next === 'line' ? 'line' : 'bar';
        for (const b of segBtns) {
          const isOn = b.getAttribute('data-type') === chartType;
          b.setAttribute('aria-pressed', isOn ? 'true' : 'false');
        }
      }

      function getReg(map, month, country) {
        const v = map.get(`${month}|${country}`);
        return Number.isFinite(v) ? v : 0;
      }

      function updateTable(month, country) {
        const o = getReg(organicMap, month, country);
        const p = getReg(paidMap, month, country);
        const t = o + p;

        const oShare = t > 0 ? (o / t) : null;
        const pShare = t > 0 ? (p / t) : null;

        const fmtPct = (x) => {
          if (x === null) return '—';
          if (utils && typeof utils.fmtPct === 'function') return utils.fmtPct(x, 2);
          return `${(x * 100).toFixed(2)}%`;
        };
        const fmtInt = (x) => {
          if (utils && typeof utils.fmtInt === 'function') return utils.fmtInt(x);
          const n = Number(x);
          return Number.isFinite(n) ? n.toLocaleString('en-US') : '—';
        };

        const tr = tableEl.querySelector('tbody tr');
        const tds = tr.querySelectorAll('td');
        tds[0].textContent = fmtPct(oShare);
        tds[1].textContent = fmtPct(pShare);
        tds[2].textContent = fmtInt(o);
        tds[3].textContent = fmtInt(p);
        tds[4].textContent = fmtInt(t);
      }

      function updateInsights(month) {
        if (window.OVP && OVP.insights && typeof OVP.insights.render === 'function') {
          OVP.insights.render(insightsEl, MODULE_ID, month, { title: '数据分析' });
          return;
        }
        insightsEl.innerHTML = `
          <div class="empty">未加载 insights-copy.js：请在 index.html 里把它放到各 module-*.js 之前。</div>
        `;
      }

      function buildBarOption(month, focusCountry) {
        const text = cssVar('--text', 'rgba(255,255,255,.92)') || '#E5E7EB';
        const muted = cssVar('--muted', 'rgba(255,255,255,.62)') || '#9CA3AF';
        const border = cssVar('--border', 'rgba(255,255,255,.12)') || 'rgba(255,255,255,.12)';
        const organicColor = cssVar('--ovp-yellow', '#F6C344');
        const paidColor = cssVar('--ovp-blue', '#3B82F6');

        const oData = COUNTRIES.map(c => ({
          value: getReg(organicMap, month, c),
          itemStyle: { opacity: c === focusCountry ? 1 : 0.32 }
        }));
        const pData = COUNTRIES.map(c => ({
          value: getReg(paidMap, month, c),
          itemStyle: { opacity: c === focusCountry ? 1 : 0.32 }
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
          legend: {
            data: ['自然量', '买量'],
            textStyle: { color: muted }
          },
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
            axisLine: { lineStyle: { color: border } },
            splitLine: { lineStyle: { color: border, opacity: 0.35 } }
          },
          series: [
            {
              name: '自然量',
              type: 'bar',
              barMaxWidth: 30,
              data: oData,
              emphasis: { focus: 'series' }
            },
            {
              name: '买量',
              type: 'bar',
              barMaxWidth: 30,
              data: pData,
              emphasis: { focus: 'series' }
            }
          ],
          title: {
            text: `按国家对比（${month}）`,
            left: 0,
            textStyle: { color: text, fontSize: 12, fontWeight: 600 }
          }
        };
      }

      function buildLineOption(focusCountry, selectedMonth) {
        const text = cssVar('--text', 'rgba(255,255,255,.92)') || '#E5E7EB';
        const muted = cssVar('--muted', 'rgba(255,255,255,.62)') || '#9CA3AF';
        const border = cssVar('--border', 'rgba(255,255,255,.12)') || 'rgba(255,255,255,.12)';
        const organicColor = cssVar('--ovp-yellow', '#F6C344');
        const paidColor = cssVar('--ovp-blue', '#3B82F6');

        const x = months.slice();
        const o = x.map(m => getReg(organicMap, m, focusCountry));
        const p = x.map(m => getReg(paidMap, m, focusCountry));

        const haveSelected = selectedMonth && x.includes(selectedMonth);

        return {
          color: [organicColor, paidColor],
          tooltip: {
            trigger: 'axis',
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
            data: x,
            axisLabel: { color: muted },
            axisLine: { lineStyle: { color: border } },
            axisTick: { lineStyle: { color: border } }
          },
          yAxis: {
            type: 'value',
            axisLabel: { color: muted },
            axisLine: { lineStyle: { color: border } },
            splitLine: { lineStyle: { color: border, opacity: 0.35 } }
          },
          series: [
            {
              name: '自然量',
              type: 'line',
              data: o,
              smooth: true,
              showSymbol: false,
              lineStyle: { width: 2 },
              markLine: haveSelected ? {
                silent: true,
                symbol: 'none',
                label: { show: true, formatter: selectedMonth, color: muted },
                lineStyle: { type: 'dashed', opacity: 0.35 },
                data: [{ xAxis: selectedMonth }]
              } : undefined
            },
            {
              name: '买量',
              type: 'line',
              data: p,
              smooth: true,
              showSymbol: false,
              lineStyle: { width: 2 }
            }
          ],
          title: {
            text: `按月份趋势（${focusCountry}）`,
            left: 0,
            textStyle: { color: text, fontSize: 12, fontWeight: 600 }
          }
        };
      }

      let chart = null;
      let echartsApi = null;

      function updateView() {
        const month = monthSel.value;
        const country = countrySel.value;

        // hint
        if (chartType === 'bar') {
          hintEl.textContent = `柱状图按“月份”展示 5 国对比；“国家”用于高亮与表格取数（当前：${country}）。`;
        } else {
          hintEl.textContent = `折线图按“国家”展示多月趋势；“月份”用于标记当前月与表格取数（当前：${month}）。`;
        }

        updateTable(month, country);
        updateInsights(month);

        if (!chart || !echartsApi) return;

        const option = (chartType === 'bar')
          ? buildBarOption(month, country)
          : buildLineOption(country, month);

        chart.setOption(option, true);
        chart.resize();
      }

      // wire events
      monthSel.addEventListener('change', updateView);
      countrySel.addEventListener('change', updateView);
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
          // 防止重复 init
          try { echartsApi.dispose(chartEl); } catch (_e) {}
          chart = echartsApi.init(chartEl, null, { renderer: 'canvas' });

          const onResize = () => { try { chart && chart.resize(); } catch (_e) {} };
          window.addEventListener('resize', onResize);

          updateView();
        })
        .catch(() => {
          // no echarts -> text fallback
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
