// organic-vs-paid/module-payrate.js
(function () {
  window.OVP = window.OVP || {};
  const register =
    OVP.registerModule ||
    function (m) {
      (OVP.modules || (OVP.modules = [])).push(m);
    };

  const MODULE_ID = "m2-payrate";
  const COUNTRIES = ["GH", "KE", "NG", "TZ", "UG"];
  const ECHARTS_SRC =
    "https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js";

  function injectStylesOnce() {
    const id = "ovp-m2-payrate-style";
    if (document.getElementById(id)) return;

    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      .ovp-m2{display:flex;flex-direction:column;gap:12px}
      .ovp-m2 .row{display:flex;flex-wrap:wrap;gap:12px;align-items:flex-end}
      .ovp-m2 .fg{display:flex;flex-direction:column;gap:6px;min-width:180px}
      .ovp-m2 label{font-size:12px;color:var(--muted, #6b7280)}
      .ovp-m2 select{
        height:36px; padding:0 10px; border-radius:10px;
        border:1px solid var(--border, rgba(148,163,184,.6));
        background:rgba(255,255,255,.65);
        color:var(--text, #0f172a);
        outline:none;
      }

      .ovp-m2 .chips{display:flex;flex-wrap:wrap;gap:8px}
      .ovp-m2 .chip{
        display:inline-flex;align-items:center;gap:6px;
        padding:6px 10px;border-radius:999px;
        border:1px solid var(--border, rgba(148,163,184,.6));
        background:rgba(255,255,255,.55);
        color:var(--muted, #6b7280);
        font-size:12px;
        user-select:none;
        cursor:pointer;
      }
      .ovp-m2 .chip input{margin:0; accent-color: var(--accent-strong, #1d4ed8); cursor:pointer}
      .ovp-m2 .chip.active{
        background:rgba(37,99,235,.10);
        border-color:rgba(37,99,235,.35);
        color:var(--text, #0f172a);
      }

      .ovp-m2 .seg{
        display:inline-flex; gap:6px; padding:4px;
        border:1px solid var(--border, rgba(148,163,184,.6));
        background:rgba(255,255,255,.55);
        border-radius:12px;
      }
      .ovp-m2 .seg button{
        height:28px; padding:0 10px;
        border:0; border-radius:10px;
        background:transparent; color:var(--muted, #6b7280);
        cursor:pointer;
        font-size:12px;
      }
      .ovp-m2 .seg button[aria-pressed="true"]{
        background:rgba(37,99,235,.12);
        color:var(--text, #0f172a);
        font-weight:600;
      }

      .ovp-m2 .hint{
        margin-top:2px;
        font-size:12px; color:var(--muted, #6b7280);
        line-height:1.55;
      }
      .ovp-m2 .chart{
        height:340px; width:100%;
        border:1px solid var(--border, rgba(148,163,184,.6));
        border-radius:12px;
        background:rgba(255,255,255,.65);
      }
      .ovp-m2 .table-wrap{overflow:auto}
      .ovp-m2 table{
        width:100%;
        border-collapse:separate; border-spacing:0;
        border:1px solid var(--border, rgba(148,163,184,.6));
        border-radius:12px; overflow:hidden;
        background:rgba(255,255,255,.65);
      }
      .ovp-m2 th,.ovp-m2 td{
        padding:10px 12px;
        border-bottom:1px solid var(--border, rgba(148,163,184,.5));
        font-size:12px;
        white-space:nowrap;
      }
      .ovp-m2 th{color:var(--muted, #6b7280); text-align:left; background:rgba(249,250,251,.7)}
      .ovp-m2 td{color:var(--text, #0f172a); text-align:left}
      .ovp-m2 tr:last-child td{border-bottom:0}
      .ovp-m2 .empty{
        padding:12px; border:1px dashed var(--border, rgba(148,163,184,.6));
        border-radius:12px; color:var(--muted, #6b7280); font-size:12px; line-height:1.6;
        background:rgba(255,255,255,.5)
      }
      .ovp-m2 .subline{
        display:flex; gap:10px; flex-wrap:wrap;
        font-size:12px; color:var(--muted, #6b7280);
        margin-top:-4px;
      }
      .ovp-m2 .dot{width:8px;height:8px;border-radius:999px;display:inline-block}
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
    return typeof x === "number" && Number.isFinite(x);
  }
  function toNumber(x) {
    if (isFiniteNumber(x)) return x;
    const n = Number(x);
    return Number.isFinite(n) ? n : null;
  }

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  // 支持：'YYYY-MM-DD' / 'YYYY/MM/DD' / Date
  function normalizeDate(input) {
    if (!input) return null;

    if (input instanceof Date && !isNaN(input.getTime())) {
      return (
        input.getFullYear() +
        "-" +
        pad2(input.getMonth() + 1) +
        "-" +
        pad2(input.getDate())
      );
    }

    const s = String(input).trim();
    let m = s.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$/);
    if (m) return `${m[1]}-${pad2(m[2])}-${pad2(m[3])}`;

    // 可能是时间戳字符串
    const ts = Number(s);
    if (Number.isFinite(ts) && ts > 0) {
      const d = new Date(ts);
      if (!isNaN(d.getTime())) return normalizeDate(d);
    }
    return null;
  }

  // 支持：'YYYY-MM' / 'YYYY/MM' / 'YYYYMM' / 'YYYY-MM-DD' / Date
  function normalizeMonth(input) {
    if (
      window.OVP &&
      OVP.insights &&
      typeof OVP.insights.normalizeMonth === "function"
    ) {
      return OVP.insights.normalizeMonth(input);
    }
    if (!input) return null;

    if (input instanceof Date && !isNaN(input.getTime())) {
      return input.getFullYear() + "-" + pad2(input.getMonth() + 1);
    }

    const s = String(input).trim();
    let m;

    m = s.match(/^(\d{4})[-\/](\d{1,2})$/);
    if (m) return `${m[1]}-${pad2(m[2])}`;

    m = s.match(/^(\d{4})(\d{2})$/);
    if (m) return `${m[1]}-${m[2]}`;

    m = s.match(/^(\d{4})[-\/](\d{1,2})[-\/]\d{1,2}$/);
    if (m) return `${m[1]}-${pad2(m[2])}`;

    return null;
  }

  function monthValue(key) {
    const m = String(key || "").match(/^(\d{4})-(\d{2})$/);
    if (!m) return -1;
    return Number(m[1]) * 100 + Number(m[2]);
  }

  function pickKey(obj, keys) {
    if (!obj || typeof obj !== "object") return null;

    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (Object.prototype.hasOwnProperty.call(obj, k)) return k;
    }

    const map = Object.create(null);
    for (const k of Object.keys(obj)) map[String(k).toLowerCase()] = k;

    for (let i = 0; i < keys.length; i++) {
      const want = String(keys[i]).toLowerCase();
      if (map[want]) return map[want];
    }
    return null;
  }

  function normalizePayrateDailyRecords(raw) {
    const out = [];
    if (!raw) return out;

    const pushRow = (row, monthFromKey) => {
      if (!row || typeof row !== "object") return;

      const dateKey = pickKey(row, ["date", "day", "dt"]);
      const countryKey = pickKey(row, ["country", "geo", "cc", "market", "nation"]);
      const regKey = pickKey(row, ["registration", "registrations", "reg", "register"]);
      const d0Key = pickKey(row, ["D0_unique_purchase", "d0_unique_purchase", "d0_payer", "d0_payers"]);
      const d7Key = pickKey(row, ["D7_unique_purchase", "d7_unique_purchase", "d7_payer", "d7_payers"]);

      const d = normalizeDate(dateKey ? row[dateKey] : null);
      const m = normalizeMonth(d || monthFromKey);
      const c = String(countryKey ? row[countryKey] : "").toUpperCase();

      const reg = toNumber(regKey ? row[regKey] : null);
      const d0 = toNumber(d0Key ? row[d0Key] : null);
      const d7 = toNumber(d7Key ? row[d7Key] : null);

      if (!m || !d || !COUNTRIES.includes(c)) return;

      out.push({
        month: m,
        date: d,
        country: c,
        registration: reg || 0,
        D0_unique_purchase: d0 || 0,
        D7_unique_purchase: d7 || 0
      });
    };

    // wrapper with array
    if (raw && typeof raw === "object" && !Array.isArray(raw)) {
      const arrKey = pickKey(raw, ["data", "rows", "items", "list"]);
      if (arrKey && Array.isArray(raw[arrKey])) return normalizePayrateDailyRecords(raw[arrKey]);
    }

    if (Array.isArray(raw)) {
      for (const row of raw) pushRow(row, null);
      return out;
    }

    // Object keyed by month (RAW_*_BY_MONTH style)
    if (raw && typeof raw === "object") {
      for (const k of Object.keys(raw)) {
        const mk = normalizeMonth(k);
        const v = raw[k];
        if (!mk) continue;

        if (Array.isArray(v)) {
          for (const row of v) pushRow(row, mk);
        } else if (v && typeof v === "object") {
          // in case someone stores a flat object, still try once
          pushRow(v, mk);
        }
      }
    }

    return out;
  }

  function buildAggMaps(records, source) {
    const monthCountry = new Map(); // key: source|month|country => {reg,d0,d7}
    const monthCountryDate = new Map(); // key: source|month|country|date => {reg,d0,d7}
    const months = new Set();

    for (const r of records) {
      const m = r.month;
      const c = r.country;
      const d = r.date;

      if (!m || !c || !d) continue;
      months.add(m);

      const reg = toNumber(r.registration) || 0;
      const d0 = toNumber(r.D0_unique_purchase) || 0;
      const d7 = toNumber(r.D7_unique_purchase) || 0;

      const k1 = `${source}|${m}|${c}`;
      const prev1 = monthCountry.get(k1) || { reg: 0, d0: 0, d7: 0 };
      prev1.reg += reg;
      prev1.d0 += d0;
      prev1.d7 += d7;
      monthCountry.set(k1, prev1);

      const k2 = `${source}|${m}|${c}|${d}`;
      const prev2 = monthCountryDate.get(k2) || { reg: 0, d0: 0, d7: 0 };
      prev2.reg += reg;
      prev2.d0 += d0;
      prev2.d7 += d7;
      monthCountryDate.set(k2, prev2);
    }

    const monthArr = Array.from(months);
    monthArr.sort((a, b) => monthValue(a) - monthValue(b));

    return { monthCountry, monthCountryDate, months: monthArr };
  }

  function safeDiv(n, d) {
    const nn = toNumber(n);
    const dd = toNumber(d);
    if (nn === null || dd === null || dd <= 0) return null;
    const v = nn / dd;
    return Number.isFinite(v) ? v : null;
  }

  function daysOfMonth(monthKey) {
    const m = String(monthKey || "").match(/^(\d{4})-(\d{2})$/);
    if (!m) return [];
    const y = Number(m[1]);
    const mo = Number(m[2]); // 1-12
    const last = new Date(y, mo, 0).getDate();
    const out = [];
    for (let i = 1; i <= last; i++) {
      out.push(`${m[1]}-${m[2]}-${pad2(i)}`);
    }
    return out;
  }

  function loadScriptOnce(id, src) {
    return new Promise((resolve, reject) => {
      if (document.getElementById(id)) return resolve();
      const s = document.createElement("script");
      s.id = id;
      s.src = src;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("Failed to load: " + src));
      document.head.appendChild(s);
    });
  }

  function ensureEcharts() {
    if (window.echarts) return Promise.resolve(window.echarts);
    return loadScriptOnce("ovp-echarts", ECHARTS_SRC).then(() => {
      if (!window.echarts) throw new Error("echarts not available");
      return window.echarts;
    });
  }

  function readFallbackData(which) {
    // 兼容：index 没把 raw 透传，模块自己兜底
    if (which === "organic") {
      return (
        (typeof window.organicData !== "undefined" && window.organicData) ||
        (typeof window.organicMonthlyData !== "undefined" && window.organicMonthlyData) ||
        (typeof window.ORGANIC_DATA !== "undefined" && window.ORGANIC_DATA) ||
        (typeof window.ORGANIC_MONTHLY_DATA !== "undefined" && window.ORGANIC_MONTHLY_DATA) ||
        (typeof window.RAW_ORGANIC_BY_MONTH !== "undefined" && window.RAW_ORGANIC_BY_MONTH) ||
        null
      );
    }
    return (
      (typeof window.paidData !== "undefined" && window.paidData) ||
      (typeof window.paidMonthlyData !== "undefined" && window.paidMonthlyData) ||
      (typeof window.PAID_DATA !== "undefined" && window.PAID_DATA) ||
      (typeof window.PAID_MONTHLY_DATA !== "undefined" && window.PAID_MONTHLY_DATA) ||
      (typeof window.RAW_PAID_BY_MONTH !== "undefined" && window.RAW_PAID_BY_MONTH) ||
      null
    );
  }

  function countryPalette() {
    // 稳定映射：同国家同色
    return {
      GH: "#2563eb",
      KE: "#16a34a",
      NG: "#f97316",
      TZ: "#7c3aed",
      UG: "#0f766e"
    };
  }

  register({
    id: MODULE_ID,
    title: "D0 / D7 付费率",
    subtitle: "D0_unique_purchase/registration；D7_unique_purchase/registration",
    span: "half",

    render({ mountEl, organic, paid, utils }) {
      injectStylesOnce();

      const organicRaw = organic || readFallbackData("organic");
      const paidRaw = paid || readFallbackData("paid");

      const organicRecords = normalizePayrateDailyRecords(organicRaw);
      const paidRecords = normalizePayrateDailyRecords(paidRaw);

      const orgAgg = buildAggMaps(organicRecords, "organic");
      const paidAgg = buildAggMaps(paidRecords, "paid");

      const monthsSet = new Set([...(orgAgg.months || []), ...(paidAgg.months || [])]);
      const months = Array.from(monthsSet).filter(Boolean);
      months.sort((a, b) => monthValue(a) - monthValue(b));

      const uid = `ovp-m2-${Math.random().toString(16).slice(2)}`;
      const monthId = `${uid}-month`;
      const countryWrapId = `${uid}-countries`;
      const typeSegId = `${uid}-type`;
      const metricSegId = `${uid}-metric`;
      const chartId = `${uid}-chart`;
      const hintId = `${uid}-hint`;
      const tableId = `${uid}-table`;
      const insightsId = `${uid}-insights`;

      if (!months.length) {
        mountEl.innerHTML = `
          <div class="ovp-m2">
            <div class="empty">没读到月份数据：请检查 organic-data.js / paid-data.js 是否包含 date + country + registration + D0_unique_purchase + D7_unique_purchase。</div>
          </div>
        `;
        return;
      }

      const latestMonth = months[months.length - 1];

      // 默认：国家全选；图表默认柱状；默认展示 D0+D7
      const state = {
        month: latestMonth,
        countries: COUNTRIES.slice(),
        chartType: "bar", // bar | line
        metricMode: "both" // d0 | d7 | both
      };

      mountEl.innerHTML = `
        <div class="ovp-m2">
          <div class="row">
            <div class="fg">
              <label for="${monthId}">月份</label>
              <select id="${monthId}"></select>
            </div>

            <div class="fg" style="min-width:260px">
              <label>国家（多选）</label>
              <div class="chips" id="${countryWrapId}"></div>
            </div>

            <div class="fg" style="min-width:220px">
              <label>图表</label>
              <div class="seg" id="${typeSegId}">
                <button type="button" data-type="bar" aria-pressed="true">月度柱状图</button>
                <button type="button" data-type="line" aria-pressed="false">日级折线图</button>
              </div>
            </div>

            <div class="fg" style="min-width:240px">
              <label>D0 / D7</label>
              <div class="seg" id="${metricSegId}">
                <button type="button" data-metric="d0" aria-pressed="false">D0</button>
                <button type="button" data-metric="d7" aria-pressed="false">D7</button>
                <button type="button" data-metric="both" aria-pressed="true">D0 + D7</button>
              </div>
            </div>
          </div>

          <div class="subline" id="${uid}-legend-line" style="display:none">
            <div><span class="dot" style="background:${cssVar("--muted", "#6b7280")}"></span> 同色 = 同国家</div>
            <div>自然量：虚线；买量：实线</div>
            <div>D7：带点（点位）</div>
          </div>

          <div class="subline" id="${uid}-legend-bar">
            <div><span class="dot" style="background:${cssVar("--ovp-yellow", "#F6C344")}"></span> 自然量</div>
            <div><span class="dot" style="background:${cssVar("--ovp-blue", "#3B82F6")}"></span> 买量</div>
            <div>D7 柱子：斜线阴影</div>
          </div>

          <div id="${chartId}" class="chart"></div>
          <div class="hint" id="${hintId}"></div>

          <div class="table-wrap" id="${tableId}"></div>

          <div id="${insightsId}"></div>
        </div>
      `;

      const monthEl = document.getElementById(monthId);
      const countriesEl = document.getElementById(countryWrapId);
      const typeSegEl = document.getElementById(typeSegId);
      const metricSegEl = document.getElementById(metricSegId);
      const chartEl = document.getElementById(chartId);
      const hintEl = document.getElementById(hintId);
      const tableWrap = document.getElementById(tableId);
      const insightsEl = document.getElementById(insightsId);

      // Fill month select
      monthEl.innerHTML = months
        .slice()
        .reverse()
        .map((m) => `<option value="${m}">${m}</option>`)
        .join("");
      monthEl.value = state.month;

      // Fill country chips
      countriesEl.innerHTML = COUNTRIES.map((c) => {
        const checked = state.countries.includes(c) ? "checked" : "";
        return `<label class="chip ${checked ? "active" : ""}">
          <input type="checkbox" value="${c}" ${checked}/>
          <span>${c}</span>
        </label>`;
      }).join("");

      function setSegPressed(container, attr, value) {
        const btns = Array.from(container.querySelectorAll("button"));
        for (const b of btns) {
          const v = b.getAttribute(attr);
          b.setAttribute("aria-pressed", v === value ? "true" : "false");
        }
      }

      function getSelectedCountries() {
        const selected = [];
        for (const input of countriesEl.querySelectorAll('input[type="checkbox"]')) {
          if (input.checked) selected.push(String(input.value).toUpperCase());
        }
        // keep fixed order
        return COUNTRIES.filter((c) => selected.includes(c));
      }

      function refreshChipActive() {
        for (const label of countriesEl.querySelectorAll(".chip")) {
          const input = label.querySelector('input[type="checkbox"]');
          if (!input) continue;
          if (input.checked) label.classList.add("active");
          else label.classList.remove("active");
        }
      }

      function getMonthCountryAgg(source, month, country) {
        const map = source === "organic" ? orgAgg.monthCountry : paidAgg.monthCountry;
        const key = `${source}|${month}|${country}`;
        return map.get(key) || { reg: 0, d0: 0, d7: 0 };
      }

      function getDayAgg(source, month, country, date) {
        const map = source === "organic" ? orgAgg.monthCountryDate : paidAgg.monthCountryDate;
        const key = `${source}|${month}|${country}|${date}`;
        return map.get(key) || { reg: 0, d0: 0, d7: 0 };
      }

      function buildBarOption() {
        const text = cssVar("--text", "#0f172a");
        const muted = cssVar("--muted", "#6b7280");
        const border = cssVar("--border", "rgba(148,163,184,.6)");
        const organicColor = cssVar("--ovp-yellow", "#F6C344");
        const paidColor = cssVar("--ovp-blue", "#3B82F6");

        const cats = state.countries.length ? state.countries : COUNTRIES.slice();

        const wantD0 = state.metricMode === "d0" || state.metricMode === "both";
        const wantD7 = state.metricMode === "d7" || state.metricMode === "both";

        const decalD7 = {
          symbol: "rect",
          symbolSize: 2,
          dashArrayX: [1, 0],
          dashArrayY: [4, 3],
          rotation: Math.PI / 4,
          color: "rgba(15, 23, 42, 0.22)"
        };

        const series = [];

        if (wantD0) {
          series.push({
            name: "自然量 D0",
            type: "bar",
            barMaxWidth: 26,
            itemStyle: { color: organicColor },
            data: cats.map((c) => {
              const a = getMonthCountryAgg("organic", state.month, c);
              return safeDiv(a.d0, a.reg);
            })
          });
        }

        if (wantD7) {
          series.push({
            name: "自然量 D7",
            type: "bar",
            barMaxWidth: 26,
            itemStyle: { color: organicColor, decal: decalD7 },
            data: cats.map((c) => {
              const a = getMonthCountryAgg("organic", state.month, c);
              return safeDiv(a.d7, a.reg);
            })
          });
        }

        if (wantD0) {
          series.push({
            name: "买量 D0",
            type: "bar",
            barMaxWidth: 26,
            itemStyle: { color: paidColor },
            data: cats.map((c) => {
              const a = getMonthCountryAgg("paid", state.month, c);
              return safeDiv(a.d0, a.reg);
            })
          });
        }

        if (wantD7) {
          series.push({
            name: "买量 D7",
            type: "bar",
            barMaxWidth: 26,
            itemStyle: { color: paidColor, decal: decalD7 },
            data: cats.map((c) => {
              const a = getMonthCountryAgg("paid", state.month, c);
              return safeDiv(a.d7, a.reg);
            })
          });
        }

        return {
          tooltip: {
            trigger: "axis",
            axisPointer: { type: "shadow" },
            formatter: function (params) {
              if (!params || !params.length) return "";
              const lines = [];
              lines.push(`<div style="font-weight:600;margin-bottom:4px">${params[0].axisValue}</div>`);
              for (const p of params) {
                const v = typeof p.data === "number" ? p.data : null;
                const txt = v === null ? "—" : `${(v * 100).toFixed(2)}%`;
                lines.push(
                  `<div style="display:flex;justify-content:space-between;gap:10px;">
                    <span>${p.marker}${p.seriesName}</span><span>${txt}</span>
                  </div>`
                );
              }
              return lines.join("");
            }
          },
          legend: { type: "scroll", textStyle: { color: muted } },
          grid: { left: 24, right: 18, top: 44, bottom: 28, containLabel: true },
          xAxis: {
            type: "category",
            data: cats,
            axisLabel: { color: muted },
            axisLine: { lineStyle: { color: border } },
            axisTick: { lineStyle: { color: border } }
          },
          yAxis: {
            type: "value",
            axisLabel: { color: muted, formatter: (v) => `${(v * 100).toFixed(0)}%` },
            axisLine: { lineStyle: { color: border } },
            splitLine: { lineStyle: { color: border, opacity: 0.35 } },
            min: 0
          },
          series: series,
          title: {
            text: `付费率（${state.month}）`,
            left: 0,
            textStyle: { color: text, fontSize: 12, fontWeight: 600 }
          }
        };
      }

      function buildLineOption() {
        const text = cssVar("--text", "#0f172a");
        const muted = cssVar("--muted", "#6b7280");
        const border = cssVar("--border", "rgba(148,163,184,.6)");
        const palette = countryPalette();

        const cats = daysOfMonth(state.month);
        const selected = state.countries.length ? state.countries : COUNTRIES.slice();

        const wantD0 = state.metricMode === "d0" || state.metricMode === "both";
        const wantD7 = state.metricMode === "d7" || state.metricMode === "both";

        const series = [];

        for (const c of selected) {
          const color = palette[c] || cssVar("--accent-strong", "#1d4ed8");

          if (wantD0) {
            series.push({
              name: `${c} 自然 D0`,
              type: "line",
              showSymbol: false,
              connectNulls: false,
              itemStyle: { color },
              lineStyle: { color, type: "dashed", width: 2 },
              data: cats.map((d) => {
                const a = getDayAgg("organic", state.month, c, d);
                return safeDiv(a.d0, a.reg);
              })
            });

            series.push({
              name: `${c} 买量 D0`,
              type: "line",
              showSymbol: false,
              connectNulls: false,
              itemStyle: { color },
              lineStyle: { color, type: "solid", width: 2 },
              data: cats.map((d) => {
                const a = getDayAgg("paid", state.month, c, d);
                return safeDiv(a.d0, a.reg);
              })
            });
          }

          if (wantD7) {
            series.push({
              name: `${c} 自然 D7`,
              type: "line",
              showSymbol: true,
              symbol: "circle",
              symbolSize: 6,
              connectNulls: false,
              itemStyle: { color },
              lineStyle: { color, type: "dashed", width: 1.8, opacity: 0.85 },
              data: cats.map((d) => {
                const a = getDayAgg("organic", state.month, c, d);
                return safeDiv(a.d7, a.reg);
              })
            });

            series.push({
              name: `${c} 买量 D7`,
              type: "line",
              showSymbol: true,
              symbol: "circle",
              symbolSize: 6,
              connectNulls: false,
              itemStyle: { color },
              lineStyle: { color, type: "solid", width: 1.8, opacity: 0.85 },
              data: cats.map((d) => {
                const a = getDayAgg("paid", state.month, c, d);
                return safeDiv(a.d7, a.reg);
              })
            });
          }
        }

        return {
          tooltip: {
            trigger: "axis",
            formatter: function (params) {
              if (!params || !params.length) return "";
              const date = params[0].axisValue;
              const lines = [];
              lines.push(`<div style="font-weight:600;margin-bottom:4px">${date}</div>`);
              for (const p of params) {
                const v = typeof p.data === "number" ? p.data : null;
                const txt = v === null ? "—" : `${(v * 100).toFixed(2)}%`;
                lines.push(
                  `<div style="display:flex;justify-content:space-between;gap:10px;">
                    <span>${p.marker}${p.seriesName}</span><span>${txt}</span>
                  </div>`
                );
              }
              return lines.join("");
            }
          },
          legend: { type: "scroll", textStyle: { color: muted } },
          grid: { left: 24, right: 18, top: 44, bottom: 34, containLabel: true },
          xAxis: {
            type: "category",
            data: cats,
            axisLabel: {
              color: muted,
              formatter: (v) => String(v).slice(8) // 只显示日
            },
            axisLine: { lineStyle: { color: border } },
            axisTick: { lineStyle: { color: border } }
          },
          yAxis: {
            type: "value",
            axisLabel: { color: muted, formatter: (v) => `${(v * 100).toFixed(0)}%` },
            axisLine: { lineStyle: { color: border } },
            splitLine: { lineStyle: { color: border, opacity: 0.35 } },
            min: 0
          },
          series: series,
          title: {
            text: `付费率（日级，${state.month}）`,
            left: 0,
            textStyle: { color: text, fontSize: 12, fontWeight: 600 }
          }
        };
      }

      function renderTable() {
        const fmtPct =
          utils && typeof utils.fmtPct === "function"
            ? (v) => utils.fmtPct(v, 2)
            : (v) => (v === null || v === undefined ? "—" : `${(v * 100).toFixed(2)}%`);

        const selected = state.countries.length ? state.countries : COUNTRIES.slice();

        const wantD0 = state.metricMode === "d0" || state.metricMode === "both";
        const wantD7 = state.metricMode === "d7" || state.metricMode === "both";

        const cols = [];
        if (wantD0) cols.push({ key: "o_d0", name: "自然量 D0付费率" });
        if (wantD7) cols.push({ key: "o_d7", name: "自然量 D7付费率" });
        if (wantD0) cols.push({ key: "p_d0", name: "买量 D0付费率" });
        if (wantD7) cols.push({ key: "p_d7", name: "买量 D7付费率" });

        const thead = `
          <thead>
            <tr>
              <th>国家</th>
              ${cols.map((c) => `<th>${c.name}</th>`).join("")}
            </tr>
          </thead>
        `;

        const rows = selected.map((country) => {
          const o = getMonthCountryAgg("organic", state.month, country);
          const p = getMonthCountryAgg("paid", state.month, country);

          const o_d0 = safeDiv(o.d0, o.reg);
          const o_d7 = safeDiv(o.d7, o.reg);
          const p_d0 = safeDiv(p.d0, p.reg);
          const p_d7 = safeDiv(p.d7, p.reg);

          const values = {
            o_d0: fmtPct(o_d0),
            o_d7: fmtPct(o_d7),
            p_d0: fmtPct(p_d0),
            p_d7: fmtPct(p_d7)
          };

          return `
            <tr>
              <td>${country}</td>
              ${cols.map((c) => `<td>${values[c.key]}</td>`).join("")}
            </tr>
          `;
        });

        tableWrap.innerHTML = `
          <table>
            ${thead}
            <tbody>
              ${rows.join("")}
            </tbody>
          </table>
        `;
      }

      function renderInsights() {
        if (window.OVP && OVP.insights && typeof OVP.insights.render === "function") {
          OVP.insights.render(insightsEl, MODULE_ID, state.month, { title: "数据分析" });
          return;
        }
        insightsEl.innerHTML = `
          <div class="empty">insights-copy.js 未加载或未初始化（OVP.insights.render 不存在）。</div>
        `;
      }

      let chart = null;

      function update() {
        const barLegend = document.getElementById(`${uid}-legend-bar`);
        const lineLegend = document.getElementById(`${uid}-legend-line`);
        if (barLegend) barLegend.style.display = state.chartType === "bar" ? "" : "none";
        if (lineLegend) lineLegend.style.display = state.chartType === "line" ? "" : "none";

        const selCountries = state.countries.length ? state.countries.join(",") : "全部";
        const metricText =
          state.metricMode === "d0" ? "D0" : state.metricMode === "d7" ? "D7" : "D0 + D7";
        hintEl.textContent = `口径：付费率 = unique_purchase / registration。当前：${state.month}，国家：${selCountries}，展示：${metricText}。`;

        renderTable();
        renderInsights();

        if (!chart) return;
        const option = state.chartType === "bar" ? buildBarOption() : buildLineOption();
        chart.setOption(option, true);
      }

      monthEl.addEventListener("change", () => {
        state.month = monthEl.value;
        update();
      });

      countriesEl.addEventListener("change", (e) => {
        const t = e.target;
        if (t && t.matches && t.matches('input[type="checkbox"]')) {
          state.countries = getSelectedCountries();
          refreshChipActive();
          update();
        }
      });

      typeSegEl.addEventListener("click", (e) => {
        const btn = e.target && e.target.closest ? e.target.closest("button") : null;
        if (!btn) return;
        const type = btn.getAttribute("data-type");
        if (!type || (type !== "bar" && type !== "line")) return;
        state.chartType = type;
        setSegPressed(typeSegEl, "data-type", type);
        update();
      });

      metricSegEl.addEventListener("click", (e) => {
        const btn = e.target && e.target.closest ? e.target.closest("button") : null;
        if (!btn) return;
        const metric = btn.getAttribute("data-metric");
        if (!metric || !["d0", "d7", "both"].includes(metric)) return;
        state.metricMode = metric;
        setSegPressed(metricSegEl, "data-metric", metric);
        update();
      });

      ensureEcharts()
        .then((echarts) => {
          chart = echarts.init(chartEl);
          update();
          window.addEventListener("resize", () => chart && chart.resize());
        })
        .catch((e) => {
          chartEl.innerHTML = `<div class="empty">图表库加载失败：${e && e.message ? e.message : "unknown error"}</div>`;
        });
    }
  });
})();
