// organic-vs-paid/module-registration-compare.js
(function () {
  window.OVP = window.OVP || {};
  const register =
    OVP.registerModule ||
    function (m) {
      (OVP.modules || (OVP.modules = [])).push(m);
    };

  const MODULE_ID = "m1-registration";
  // 固定顺序（与页面展示顺序一致）
  const COUNTRIES = ["GH", "KE", "NG", "TZ"];

  const ECHARTS_SRC =
    "https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js";

  // 折线图：每个国家一个底色；自然=虚线，买量=实线
  const COUNTRY_COLORS = {
    GH: "#2563eb",
    KE: "#7c3aed",
    NG: "#16a34a",
    TZ: "#f97316",
    UG: "#0ea5e9",
  };

  function injectStylesOnce() {
    const id = "ovp-m1-reg-style";
    if (document.getElementById(id)) return;

    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      .ovp-m1{display:flex;flex-direction:column;gap:12px}
      .ovp-m1 .row{
        display:flex; gap:14px; flex-wrap:wrap; align-items:flex-end;
        margin-bottom:6px;
      }
      .ovp-m1 .fg{
        display:flex; flex-direction:column; gap:6px;
        min-width:180px;
      }
      .ovp-m1 label{
        font-size:12px;
        color: var(--text-sub, var(--muted, #6b7280));
      }
      .ovp-m1 select{
        height:36px;
        border-radius:10px;
        padding:0 10px;
        border:1px solid var(--border, rgba(148,163,184,.55));
        background: var(--bg-card, rgba(249,250,251,.9));
        color: var(--text-main, var(--text, #0f172a));
        outline:none;
      }
      .ovp-m1 .seg{
        display:flex; gap:6px; flex-wrap:wrap;
        padding:4px;
        border:1px solid var(--border, rgba(148,163,184,.55));
        border-radius:12px;
        background: rgba(255,255,255,.5);
      }
      .ovp-m1 .seg button{
        height:28px;
        padding:0 10px;
        border-radius:10px;
        border:1px solid transparent;
        background:transparent;
        color: var(--text-sub, var(--muted, #6b7280));
        cursor:pointer;
        font-size:12px;
        white-space:nowrap;
      }
      .ovp-m1 .seg button[aria-pressed="true"]{
        background: var(--accent-soft, rgba(37,99,235,.10));
        border-color: rgba(37,99,235,.35);
        color: var(--accent-strong, #2563eb);
        font-weight:600;
      }

      .ovp-m1 .chips{
        display:flex; flex-wrap:wrap; gap:8px;
        padding:2px 0;
        max-width: 520px;
      }
      .ovp-m1 .chips .filter-chip{
        font-size:11px;
        padding:3px 8px;
        border-radius: 999px;
        border: 1px solid rgba(148, 163, 184, 0.6);
        background: rgba(249, 250, 251, 0.9);
        display: inline-flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        user-select: none;
        white-space: nowrap;
        color: var(--text-sub, var(--muted, #6b7280));
      }
      .ovp-m1 .chips .filter-chip input{
        accent-color: var(--accent-strong, #2563eb);
        cursor:pointer;
      }
      .ovp-m1 .chips .filter-chip.filter-chip-active{
        border-color: rgba(37, 99, 235, 0.9);
        background: var(--accent-soft, rgba(37,99,235,.10));
        color: var(--accent-strong, #2563eb);
      }

      .ovp-m1 .subline{
        display:flex; gap:16px; align-items:center; flex-wrap:wrap;
        font-size:12px;
        color: var(--text-sub, var(--muted, #6b7280));
        margin: 2px 0 8px;
      }
      .ovp-m1 .subline .k{ display:flex; align-items:center; gap:8px; }
      .ovp-m1 .dot{ width:10px; height:10px; border-radius:999px; display:inline-block; }

      .ovp-m1 .chart{
        height:340px; width:100%;
        border:1px solid var(--border, rgba(148,163,184,.55));
        border-radius:12px;
        background: rgba(255,255,255,.55);
      }

      .ovp-m1 .table-wrap{ overflow:auto; }
      .ovp-m1 table{
        width:100%;
        border-collapse:separate; border-spacing:0;
        border:1px solid var(--border, rgba(148,163,184,.55));
        border-radius:12px; overflow:hidden;
        background: rgba(255,255,255,.55);
        margin-top: 6px;
      }
      .ovp-m1 th,.ovp-m1 td{
        padding:10px 12px;
        border-bottom:1px solid var(--border, rgba(148,163,184,.40));
        font-size:12px;
        white-space:nowrap;
      }
      .ovp-m1 th{
        background: rgba(255,255,255,.75);
        color: var(--text-sub, var(--muted, #6b7280));
        text-align:left;
      }
      .ovp-m1 td{
        color: var(--text-main, var(--text, #0f172a));
        text-align:left;
      }
      .ovp-m1 tr:last-child td{ border-bottom:0; }

      .ovp-m1 .empty{
        padding:12px;
        border:1px dashed rgba(148,163,184,.55);
        border-radius:12px;
        color: var(--text-sub, var(--muted, #6b7280));
        font-size:12px;
        line-height:1.6;
        background: rgba(255,255,255,.45);
      }
    `;
    document.head.appendChild(style);
  }

  function cssVar(name, fallback) {
    try {
      const v = getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim();
      return v || fallback;
    } catch (_e) {
      return fallback;
    }
  }

  function pad2(n) {
    const s = String(n);
    return s.length === 1 ? "0" + s : s;
  }

  function normalizeMonth(input) {
    if (!input) return null;
    if (input instanceof Date && !isNaN(input.getTime())) {
      return input.getFullYear() + "-" + pad2(input.getMonth() + 1);
    }
    const s = String(input).trim();
    let m;

    m = s.match(/^(\d{4})-(\d{1,2})$/);
    if (m) return m[1] + "-" + pad2(m[2]);

    m = s.match(/^(\d{4})\/(\d{1,2})$/);
    if (m) return m[1] + "-" + pad2(m[2]);

    m = s.match(/^(\d{4})(\d{2})$/);
    if (m) return m[1] + "-" + pad2(m[2]);

    m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (m) return m[1] + "-" + pad2(m[2]);

    m = s.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
    if (m) return m[1] + "-" + pad2(m[2]);

    return null;
  }

  function monthValue(ym) {
    const m = String(ym || "").match(/^(\d{4})-(\d{2})$/);
    if (!m) return -1;
    return Number(m[1]) * 100 + Number(m[2]);
  }

  function toNumber(v, fallback = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }

  function readGlobal(name) {
    try {
      // Works for global var/let/const in non-module scripts
      return Function(
        `return (typeof ${name} !== "undefined") ? ${name} : undefined;`
      )();
    } catch (_e) {
      return undefined;
    }
  }

  function resolveRawByMonth(which, passedMaybe) {
    const tryObj = (obj) => {
      if (!obj || typeof obj !== "object") return null;

      // { '2025-09': [ ... ] }
      const keys = Object.keys(obj);
      if (
        keys.some((k) => /^\d{4}-\d{2}$/.test(k) && Array.isArray(obj[k]))
      ) {
        return obj;
      }

      // { months: { '2025-09': [ ... ] } }
      if (obj.months && typeof obj.months === "object") {
        const mk = Object.keys(obj.months);
        if (
          mk.some((k) => /^\d{4}-\d{2}$/.test(k) && Array.isArray(obj.months[k]))
        ) {
          return obj.months;
        }
      }

      return null;
    };

    const hit = tryObj(passedMaybe);
    if (hit) return hit;

    const candidates =
      which === "organic"
        ? [
            "RAW_ORGANIC_BY_MONTH",
            "organicData",
            "organicMonthlyData",
            "ORGANIC_DATA",
            "ORGANIC_MONTHLY_DATA",
          ]
        : [
            "RAW_PAID_BY_MONTH",
            "paidData",
            "paidMonthlyData",
            "PAID_DATA",
            "PAID_MONTHLY_DATA",
          ];

    for (const k of candidates) {
      const v = readGlobal(k);
      const v2 = tryObj(v);
      if (v2) return v2;
    }
    return null;
  }

  function listMonths(organicByMonth, paidByMonth) {
    const set = new Set();
    if (organicByMonth) Object.keys(organicByMonth).forEach((k) => set.add(k));
    if (paidByMonth) Object.keys(paidByMonth).forEach((k) => set.add(k));
    const arr = Array.from(set).filter((k) => /^\d{4}-\d{2}$/.test(k));
    arr.sort((a, b) => monthValue(a) - monthValue(b));
    return arr;
  }

  function latestMonth(months) {
    if (!months || !months.length) return null;
    return months[months.length - 1];
  }

  function listDatesOfMonth(ym) {
    const m = String(ym || "").match(/^(\d{4})-(\d{2})$/);
    if (!m) return [];
    const y = Number(m[1]);
    const mo = Number(m[2]); // 1-12
    const last = new Date(y, mo, 0).getDate(); // last day of month
    const out = [];
    for (let d = 1; d <= last; d++) out.push(`${y}-${pad2(mo)}-${pad2(d)}`);
    return out;
  }

  function getMonthRows(byMonth, ym) {
    if (!byMonth || !ym) return [];
    const key = normalizeMonth(ym);
    if (!key) return [];
    const rows = byMonth[key];
    return Array.isArray(rows) ? rows : [];
  }

  function buildMonthlyTotals(rows) {
    const out = {};
    for (const c of COUNTRIES) out[c] = 0;

    for (const r of rows || []) {
      const c = String(r && r.country ? r.country : "").toUpperCase();
      if (!out.hasOwnProperty(c)) continue;
      out[c] += toNumber(r.registration, 0);
    }
    return out;
  }

  function buildDailySeries(rows, ym, countries) {
    const dates = listDatesOfMonth(ym);
    const idx = Object.create(null);
    for (let i = 0; i < dates.length; i++) idx[dates[i]] = i;

    const out = {};
    for (const c of countries) out[c] = new Array(dates.length).fill(0);

    for (const r of rows || []) {
      const c = String(r && r.country ? r.country : "").toUpperCase();
      if (!out[c]) continue;
      const d = String(r && r.date ? r.date : "");
      const i = idx[d];
      if (i === undefined) continue;
      out[c][i] += toNumber(r.registration, 0);
    }

    return { dates, seriesByCountry: out };
  }

  function formatInt(n) {
    const v = Math.round(toNumber(n, 0));
    try {
      return v.toLocaleString("en-US");
    } catch (_e) {
      return String(v);
    }
  }

  function formatPct(p) {
    if (!Number.isFinite(p)) return "-";
    return p.toFixed(1);
  }

  function loadScriptOnce(url, testFn) {
    if (typeof testFn === "function" && testFn()) return Promise.resolve(true);

    window.__ovp_script_promises = window.__ovp_script_promises || {};
    if (window.__ovp_script_promises[url]) return window.__ovp_script_promises[url];

    window.__ovp_script_promises[url] = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = url;
      s.async = true;

      const done = (ok, err) => {
        try {
          s.onload = null;
          s.onerror = null;
        } catch (_e) {}
        ok ? resolve(true) : reject(err || new Error("script load failed"));
      };

      s.onload = () => {
        if (typeof testFn === "function") {
          if (testFn()) done(true);
          else done(false, new Error("script loaded but echarts not available"));
        } else {
          done(true);
        }
      };
      s.onerror = () => done(false, new Error("script load error"));

      document.head.appendChild(s);

      setTimeout(() => {
        if (typeof testFn === "function" && testFn()) return;
        reject(new Error("script load timeout"));
      }, 15000);
    });

    return window.__ovp_script_promises[url];
  }

  function loadECharts() {
    return loadScriptOnce(ECHARTS_SRC, () => typeof window.echarts !== "undefined")
      .then(() => window.echarts);
  }

  function buildBarOption(xCats, orgMap, paidMap) {
    const textSub = cssVar("--text-sub", cssVar("--muted", "#6b7280"));
    const border = cssVar("--border", "rgba(148,163,184,.55)");

    const colorOrg = cssVar("--ovp-yellow", "#F6C344");
    const colorPaid = cssVar("--ovp-blue", "#2563eb");

    const orgData = xCats.map((c) => toNumber(orgMap[c], 0));
    const paidData = xCats.map((c) => toNumber(paidMap[c], 0));

    return {
      grid: { left: 8, right: 12, top: 22, bottom: 38, containLabel: true },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        valueFormatter: (v) => formatInt(v),
        backgroundColor: "rgba(15,23,42,.92)",
        borderColor: "rgba(15,23,42,.92)",
        textStyle: { color: "#fff" },
      },
      legend: {
        top: 0,
        left: 0,
        textStyle: { color: textSub, fontSize: 12 },
        itemWidth: 12,
        itemHeight: 8,
      },
      xAxis: {
        type: "category",
        data: xCats,
        axisLine: { lineStyle: { color: border } },
        axisTick: { show: false },
        axisLabel: { color: textSub, fontSize: 12 },
      },
      yAxis: {
        type: "value",
        axisLine: { show: false },
        splitLine: { lineStyle: { color: "rgba(148,163,184,.25)" } },
        axisLabel: { color: textSub, fontSize: 12 },
        name: "注册数",
        nameTextStyle: { color: textSub, fontSize: 12 },
      },
      series: [
        {
          name: "自然量",
          type: "bar",
          data: orgData,
          barMaxWidth: 34,
          itemStyle: { color: colorOrg },
        },
        {
          name: "买量",
          type: "bar",
          data: paidData,
          barMaxWidth: 34,
          itemStyle: { color: colorPaid },
        },
      ],
    };
  }

  function buildLineOption(dateCats, countries, orgDaily, paidDaily) {
    const textSub = cssVar("--text-sub", cssVar("--muted", "#6b7280"));
    const border = cssVar("--border", "rgba(148,163,184,.55)");

    const series = [];
    for (const c of countries) {
      const base = COUNTRY_COLORS[c] || "#2563eb";
      series.push({
        name: `${c} 自然`,
        type: "line",
        data: orgDaily[c] || [],
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 2, type: "dashed", color: base },
        itemStyle: { color: base },
      });
      series.push({
        name: `${c} 买量`,
        type: "line",
        data: paidDaily[c] || [],
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 2, type: "solid", color: base },
        itemStyle: { color: base },
      });
    }

    const dateShort = dateCats.map((d) => String(d).slice(5)); // MM-DD

    return {
      grid: { left: 8, right: 16, top: 42, bottom: 38, containLabel: true },
      tooltip: {
        trigger: "axis",
        valueFormatter: (v) => formatInt(v),
        backgroundColor: "rgba(15,23,42,.92)",
        borderColor: "rgba(15,23,42,.92)",
        textStyle: { color: "#fff" },
      },
      legend: {
        type: "scroll",
        top: 0,
        left: 0,
        textStyle: { color: textSub, fontSize: 12 },
        pageIconColor: textSub,
        pageTextStyle: { color: textSub },
      },
      xAxis: {
        type: "category",
        data: dateShort,
        axisLine: { lineStyle: { color: border } },
        axisTick: { show: false },
        axisLabel: {
          color: textSub,
          fontSize: 11,
          interval: 1, // 每隔 1 个显示一次（约每 2 天一个刻度）
        },
      },
      yAxis: {
        type: "value",
        axisLine: { show: false },
        splitLine: { lineStyle: { color: "rgba(148,163,184,.25)" } },
        axisLabel: { color: textSub, fontSize: 12 },
        name: "注册数",
        nameTextStyle: { color: textSub, fontSize: 12 },
      },
      series,
    };
  }

  register({
    id: MODULE_ID,
    title: "自然量 vs 买量注册量",
    subtitle: "柱状图：月度国家对比；折线图：日级趋势（按国家拆分）。",
    span: "full",
    render: function ({ mountEl, organic, paid }) {
      injectStylesOnce();

      const organicByMonth = resolveRawByMonth("organic", organic);
      const paidByMonth = resolveRawByMonth("paid", paid);

      const months = listMonths(organicByMonth, paidByMonth);
      const monthDefault = latestMonth(months);
      const initMonth = monthDefault || normalizeMonth(new Date()) || null;

      const state = {
        month: initMonth,
        chartType: "bar",
        countries: COUNTRIES.slice(), // 默认全选
      };

      mountEl.innerHTML = `
        <div class="ovp-m1">
          <div class="row">
            <div class="fg">
              <label>月份</label>
              <select data-role="month"></select>
            </div>

            <div class="fg" style="min-width:260px">
              <label>国家（多选）</label>
              <div class="chips" data-role="countries"></div>
            </div>

            <div class="fg" style="min-width:220px">
              <label>图表</label>
              <div class="seg" data-role="chartType">
                <button type="button" data-value="bar" aria-pressed="true">月度柱状图</button>
                <button type="button" data-value="line" aria-pressed="false">日级折线图</button>
              </div>
            </div>
          </div>

          <div class="subline" data-role="subline"></div>
          <div class="chart" data-role="chart"></div>
          <div class="table-wrap" data-role="table"></div>

          <div data-role="insights"></div>
        </div>
      `;

      const root = mountEl.querySelector(".ovp-m1");
      const monthSel = root.querySelector('[data-role="month"]');
      const chipsEl = root.querySelector('[data-role="countries"]');
      const segEl = root.querySelector('[data-role="chartType"]');
      const sublineEl = root.querySelector('[data-role="subline"]');
      const chartBox = root.querySelector('[data-role="chart"]');
      const tableWrap = root.querySelector('[data-role="table"]');
      const insightsEl = root.querySelector('[data-role="insights"]');

      function renderMonthOptions() {
        const opts = months.length ? months.slice().reverse() : [state.month].filter(Boolean); // 最新在前
        monthSel.innerHTML = opts.map((m) => `<option value="${m}">${m}</option>`).join("");
        if (state.month && opts.includes(state.month)) monthSel.value = state.month;
      }

      function renderCountryChips() {
        chipsEl.innerHTML = COUNTRIES.map((c) => {
          const checked = state.countries.includes(c);
          const activeCls = checked ? "filter-chip-active" : "";
          return `
            <label class="filter-chip ${activeCls}">
              <input type="checkbox" value="${c}" ${checked ? "checked" : ""} />
              ${c}
            </label>
          `;
        }).join("");

        chipsEl.querySelectorAll("input[type=checkbox]").forEach((inp) => {
          inp.addEventListener("change", () => {
            const v = String(inp.value || "").toUpperCase();
            const next = new Set(state.countries);
            if (inp.checked) next.add(v);
            else next.delete(v);

            // 至少保留 1 个
            if (next.size === 0) {
              next.add(v);
              inp.checked = true;
            }

            state.countries = COUNTRIES.filter((x) => next.has(x));
            renderCountryChips();
            updateView();
          });
        });
      }

      function setChartType(type) {
        state.chartType = type === "line" ? "line" : "bar";
        segEl.querySelectorAll("button[data-value]").forEach((b) => {
          const on = b.getAttribute("data-value") === state.chartType;
          b.setAttribute("aria-pressed", on ? "true" : "false");
        });
        updateView();
      }

      segEl.querySelectorAll("button[data-value]").forEach((b) => {
        b.addEventListener("click", () => setChartType(b.getAttribute("data-value")));
      });

      monthSel.addEventListener("change", () => {
        state.month = normalizeMonth(monthSel.value) || state.month;
        updateView();
      });

      function renderSubline() {
        const colorOrg = cssVar("--ovp-yellow", "#F6C344");
        const colorPaid = cssVar("--ovp-blue", "#2563eb");

        if (state.chartType === "bar") {
          sublineEl.innerHTML = `
            <div class="k"><span class="dot" style="background:${colorOrg}"></span>自然量</div>
            <div class="k"><span class="dot" style="background:${colorPaid}"></span>买量</div>
          `;
        } else {
          sublineEl.innerHTML = `
            <div class="k">颜色 = 国家</div>
            <div class="k">虚线 = 自然量</div>
            <div class="k">实线 = 买量</div>
          `;
        }
      }

      function updateTable(monthKey, displayCountries, orgMap, paidMap) {
        if (!monthKey) {
          tableWrap.innerHTML = `<div class="empty">未选择月份。</div>`;
          return;
        }

        const rows = displayCountries.map((c) => {
          const org = toNumber(orgMap[c], 0);
          const pd = toNumber(paidMap[c], 0);
          const total = org + pd;
          const orgPct = total > 0 ? (org / total) * 100 : NaN;
          const pdPct = total > 0 ? (pd / total) * 100 : NaN;

          return `
            <tr>
              <td><strong>${c}</strong></td>
              <td>${formatPct(orgPct)}</td>
              <td>${formatPct(pdPct)}</td>
              <td>${formatInt(org)}</td>
              <td>${formatInt(pd)}</td>
              <td>${formatInt(total)}</td>
            </tr>
          `;
        }).join("");

        tableWrap.innerHTML = `
          <table>
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
            <tbody>${rows}</tbody>
          </table>
        `;
      }

      function updateInsights(monthKey) {
        if (window.OVP && OVP.insights && typeof OVP.insights.render === "function") {
          OVP.insights.render(insightsEl, MODULE_ID, monthKey);
        } else {
          insightsEl.innerHTML = `<div class="empty">insights-copy.js 未加载或未初始化（OVP.insights.render 不存在）。</div>`;
        }
      }

      // ---- ECharts ----
      let chart = null;
      let ec = null;
      let disposed = false;

      function ensureChart() {
        if (ec && chart) return;

        loadECharts()
          .then((echarts) => {
            if (disposed) return;
            ec = echarts;
            chart = ec.init(chartBox);
            window.addEventListener("resize", () => {
              try { chart && chart.resize(); } catch (_e) {}
            });
            updateView();
          })
          .catch((err) => {
            chartBox.innerHTML = `<div class="empty">图表库加载失败：${String(
              err && err.message ? err.message : err
            )}</div>`;
          });
      }

      function updateView() {
        const monthKey = normalizeMonth(state.month);
        const displayCountries =
          state.countries && state.countries.length ? state.countries : COUNTRIES.slice();

        renderSubline();

        const orgRows = getMonthRows(organicByMonth, monthKey);
        const paidRows = getMonthRows(paidByMonth, monthKey);

        const orgMonthly = buildMonthlyTotals(orgRows);
        const paidMonthly = buildMonthlyTotals(paidRows);

        updateTable(monthKey, displayCountries, orgMonthly, paidMonthly);
        updateInsights(monthKey);

        if (!chart || !ec) return;

        if (state.chartType === "bar") {
          const xCats = COUNTRIES.filter((c) => displayCountries.includes(c));
          chart.setOption(buildBarOption(xCats, orgMonthly, paidMonthly), true);
        } else {
          // 日级折线图：按国家拆分，不做加总
          const orgDaily = buildDailySeries(orgRows, monthKey, displayCountries);
          const paidDaily = buildDailySeries(paidRows, monthKey, displayCountries);
          chart.setOption(
            buildLineOption(
              orgDaily.dates,
              displayCountries,
              orgDaily.seriesByCountry,
              paidDaily.seriesByCountry
            ),
            true
          );
        }
      }

      // init
      renderMonthOptions();
      renderCountryChips();
      ensureChart();
      updateView();

      mountEl.__ovpDispose = function () {
        disposed = true;
        try { chart && chart.dispose(); } catch (_e) {}
        chart = null;
      };
    },
  });
})();
