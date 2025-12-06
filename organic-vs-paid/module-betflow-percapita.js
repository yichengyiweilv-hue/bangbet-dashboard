(function () {
  window.OVP = window.OVP || {};
  const register =
    OVP.registerModule ||
    function (m) {
      (OVP.modules || (OVP.modules = [])).push(m);
    };

  const MODULE_ID = "m4-betflow-percapita";
  const COUNTRIES = ["GH", "KE", "NG", "TZ", "UG"]; // 本模块固定 4 国
  const WINDOWS = ["D0", "D7"];

  const ECHARTS_SRC =
    "https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js";

  const METRICS = {
    total: {
      key: "total",
      label: "总流水",
      d0Flow: "D0_TOTAL_BET_FLOW",
      d0User: "D0_TOTAL_BET_PLACED_USER",
      d7Flow: "D7_TOTAL_BET_FLOW",
      d7User: "D7_TOTAL_BET_PLACED_USER",
    },
    sports: {
      key: "sports",
      label: "体育流水",
      d0Flow: "D0_SPORTS_BET_FLOW",
      d0User: "D0_SPORTS_BET_PLACED_USER",
      d7Flow: "D7_SPORTS_BET_FLOW",
      d7User: "D7_SPORTS_BET_PLACED_USER",
    },
    games: {
      key: "games",
      label: "游戏流水",
      d0Flow: "D0_GAMES_BET_FLOW",
      d0User: "D0_GAMES_BET_PLACED_USER",
      d7Flow: "D7_GAMES_BET_FLOW",
      d7User: "D7_GAMES_BET_PLACED_USER",
    },
  };

  // 折线图：按国家上色（自然虚线、买量实线）
  const COUNTRY_COLORS = {
    GH: "#2563eb",
    KE: "#16a34a",
    NG: "#f97316",
    TZ: "#9333ea",
    UG: "#0ea5e9",
  };

  function injectStylesOnce() {
    const id = "ovp-m4-betflow-style";
    if (document.getElementById(id)) return;

    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      .ovp-m4{display:flex;flex-direction:column;gap:12px}
      .ovp-m4 .row{display:flex;flex-wrap:wrap;gap:12px;align-items:flex-end}
      .ovp-m4 .fg{display:flex;flex-direction:column;gap:6px;min-width:180px}
      .ovp-m4 label{font-size:12px;color:var(--text-sub, var(--muted, #6b7280))}
      .ovp-m4 select{
        height:36px; padding:0 10px; border-radius:10px;
        border:1px solid var(--border-subtle, var(--border, rgba(148, 163, 184, .60)));
        background:rgba(255,255,255,.92);
        color:var(--text-main, var(--text, #0f172a));
        outline:none;
      }
      .ovp-m4 .seg{
        display:inline-flex; gap:6px; padding:4px;
        border:1px solid var(--border-subtle, var(--border, rgba(148, 163, 184, .60)));
        background:rgba(255,255,255,.85); border-radius:12px;
      }
      .ovp-m4 .seg button{
        height:28px; padding:0 10px;
        border:0; border-radius:10px;
        background:transparent; color:var(--text-sub, var(--muted, #6b7280));
        cursor:pointer; font-size:12px;
      }
      .ovp-m4 .seg button[aria-pressed="true"]{
        background:rgba(37,99,235,.10);
        color:var(--text-main, var(--text, #0f172a));
      }
      .ovp-m4 .chips{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
      .ovp-m4 .chip{
        height:30px; padding:0 10px;
        border-radius:999px;
        border:1px solid var(--border-subtle, var(--border, rgba(148, 163, 184, .60)));
        background:rgba(15,23,42,.03);
        color:var(--text-main, var(--text, #0f172a));
        cursor:pointer; font-size:12px;
      }
      .ovp-m4 .chip[aria-pressed="true"]{
        background:var(--accent-soft, rgba(37,99,235,.12));
        border-color:rgba(37,99,235,.30);
      }
      .ovp-m4 .subline{
        display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap;
        font-size:12px; color:var(--text-sub, var(--muted, #6b7280));
        margin-top:-4px;
      }
      .ovp-m4 .subline .k{display:inline-flex; gap:6px; align-items:center}
      .ovp-m4 .dot{width:8px;height:8px;border-radius:999px;display:inline-block}
      .ovp-m4 .chart{
        height:340px; width:100%;
        border:1px solid var(--border-subtle, var(--border, rgba(148, 163, 184, .60)));
        border-radius:12px;
        background:rgba(255,255,255,.75);
      }
      .ovp-m4 .table-wrap{overflow:auto}
      .ovp-m4 table{
        width:100%;
        border-collapse:separate; border-spacing:0;
        border:1px solid var(--border-subtle, var(--border, rgba(148, 163, 184, .60)));
        border-radius:12px; overflow:hidden;
        background:rgba(255,255,255,.92);
      }
      .ovp-m4 th,.ovp-m4 td{
        padding:10px 12px;
        border-bottom:1px solid var(--border-subtle, var(--border, rgba(148, 163, 184, .60)));
        font-size:12px;
        white-space:nowrap;
      }
      .ovp-m4 th{color:var(--text-sub, var(--muted, #6b7280)); text-align:left}
      .ovp-m4 td{color:var(--text-main, var(--text, #0f172a)); text-align:left}
      .ovp-m4 tr:last-child td{border-bottom:0}
      .ovp-m4 .empty{
        padding:12px; border:1px dashed var(--border-subtle, var(--border, rgba(148, 163, 184, .60)));
        border-radius:12px; color:var(--text-sub, var(--muted, #6b7280)); font-size:12px; line-height:1.6;
        background:rgba(255,255,255,.70);
      }
      .ovp-m4 .hint{
        margin-top:6px;
        font-size:12px; color:var(--text-sub, var(--muted, #6b7280));
        line-height:1.5;
      }
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
    if (typeof x === "number" && Number.isFinite(x)) return x;
    const n = Number(x);
    return Number.isFinite(n) ? n : null;
  }

  function pad2(n) {
    const s = String(n);
    return s.length === 1 ? "0" + s : s;
  }

  function normalizeMonth(input) {
    // 优先复用 insights 的 month 归一化，避免口径不一致
    if (window.OVP && OVP.insights && typeof OVP.insights.normalizeMonth === "function") {
      return OVP.insights.normalizeMonth(input);
    }
    if (!input) return null;

    if (input instanceof Date && !isNaN(input.getTime())) {
      return input.getFullYear() + "-" + pad2(input.getMonth() + 1);
    }

    const s = String(input).trim();
    let m;

    m = s.match(/^(\d{4})[-\/](\d{1,2})$/);
    if (m) return m[1] + "-" + pad2(m[2]);

    m = s.match(/^(\d{4})(\d{2})$/);
    if (m) return m[1] + "-" + m[2];

    m = s.match(/^(\d{4})[-\/](\d{1,2})[-\/]\d{1,2}$/);
    if (m) return m[1] + "-" + pad2(m[2]);

    return null;
  }

  function monthValue(key) {
    const m = String(key || "").match(/^(\d{4})-(\d{2})$/);
    if (!m) return -1;
    return Number(m[1]) * 100 + Number(m[2]);
  }

  function normalizeToByMonth(input) {
    if (!input) return null;

    // { months: { "YYYY-MM": [...] } }
    if (input && typeof input === "object" && input.months && typeof input.months === "object") {
      return input.months;
    }

    // {"YYYY-MM": [...]}
    if (input && typeof input === "object" && !Array.isArray(input)) {
      const keys = Object.keys(input);
      const monthKeys = keys.filter((k) => /^\d{4}-\d{2}$/.test(k));
      if (monthKeys.length) return input;
    }

    // Array -> group by month (from month/date)
    if (Array.isArray(input)) {
      const out = Object.create(null);
      for (const r of input) {
        if (!r) continue;
        const m = normalizeMonth(r.month || r.date);
        if (!m) continue;
        (out[m] || (out[m] = [])).push(r);
      }
      return out;
    }

    // { data: ... }
    if (input && typeof input === "object" && input.data) {
      return normalizeToByMonth(input.data);
    }

    return null;
  }

  function resolveByMonth(kind, provided) {
    const cands = [];
    if (provided !== undefined) cands.push(provided);

    if (kind === "organic") {
      cands.push(window.RAW_ORGANIC_BY_MONTH);
      cands.push(window.organicData);
      cands.push(window.organicMonthlyData);
      cands.push(window.ORGANIC_DATA);
      cands.push(window.ORGANIC_MONTHLY_DATA);
      cands.push(window.organic_data);
    } else {
      cands.push(window.RAW_PAID_BY_MONTH);
      cands.push(window.paidData);
      cands.push(window.paidMonthlyData);
      cands.push(window.PAID_DATA);
      cands.push(window.PAID_MONTHLY_DATA);
      cands.push(window.paid_data);
    }

    for (const v of cands) {
      const byMonth = normalizeToByMonth(v);
      if (byMonth) return byMonth;
    }
    return Object.create(null);
  }

  function listMonths(a, b) {
    const set = new Set();
    for (const k of Object.keys(a || {})) if (/^\d{4}-\d{2}$/.test(k)) set.add(k);
    for (const k of Object.keys(b || {})) if (/^\d{4}-\d{2}$/.test(k)) set.add(k);
    const arr = Array.from(set);
    arr.sort((x, y) => monthValue(x) - monthValue(y));
    return arr;
  }

  function safeDiv(num, den) {
    const n = toNumber(num);
    const d = toNumber(den);
    if (n === null || d === null || d <= 0) return null;
    return n / d;
  }

  function shortDate(dateStr) {
    const s = String(dateStr || "");
    // YYYY-MM-DD -> MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s.slice(5);
    return s;
  }

  function buildAggByCountry(rows, metric) {
    const map = Object.create(null); // country -> {d0_flow, d0_user, d7_flow, d7_user}
    for (const r of rows || []) {
      if (!r) continue;
      const c = r.country;
      if (!c) continue;

      const cell = map[c] || (map[c] = { d0_flow: 0, d0_user: 0, d7_flow: 0, d7_user: 0 });
      cell.d0_flow += toNumber(r[metric.d0Flow]) || 0;
      cell.d0_user += toNumber(r[metric.d0User]) || 0;
      cell.d7_flow += toNumber(r[metric.d7Flow]) || 0;
      cell.d7_user += toNumber(r[metric.d7User]) || 0;
    }
    return map;
  }

  function buildAggByDate(rows, metric) {
    const map = Object.create(null); // date -> country -> {d0_flow, d0_user, d7_flow, d7_user}
    for (const r of rows || []) {
      if (!r) continue;
      const date = r.date;
      const c = r.country;
      if (!date || !c) continue;

      const byC = map[date] || (map[date] = Object.create(null));
      const cell = byC[c] || (byC[c] = { d0_flow: 0, d0_user: 0, d7_flow: 0, d7_user: 0 });

      cell.d0_flow += toNumber(r[metric.d0Flow]) || 0;
      cell.d0_user += toNumber(r[metric.d0User]) || 0;
      cell.d7_flow += toNumber(r[metric.d7Flow]) || 0;
      cell.d7_user += toNumber(r[metric.d7User]) || 0;
    }
    return map;
  }

  function fmtUsdPerCap(v) {
    const n = toNumber(v);
    if (n === null) return "—";
    // USD/人：保留 2 位小数
    return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function loadScriptOnce(id, src) {
    return new Promise((resolve, reject) => {
      if (document.getElementById(id)) {
        resolve();
        return;
      }
      const s = document.createElement("script");
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
    return loadScriptOnce("ovp-echarts", ECHARTS_SRC).then(() => {
      if (!window.echarts) throw new Error("echarts not available");
      return window.echarts;
    });
  }

  function buildBarOption({ countries, windows, metricLabel, monthlyOrg, monthlyPaid, monthLabel }) {
    const organicColor = cssVar("--ovp-yellow", "#F6C344");
    const paidColor = cssVar("--ovp-blue", "#2563eb");

    const hasD0 = windows.includes("D0");
    const hasD7 = windows.includes("D7");

    const combos = [
      { source: "organic", win: "D0", name: "自然 D0", color: organicColor, decal: false },
      { source: "organic", win: "D7", name: "自然 D7", color: organicColor, decal: true },
      { source: "paid", win: "D0", name: "买量 D0", color: paidColor, decal: false },
      { source: "paid", win: "D7", name: "买量 D7", color: paidColor, decal: true },
    ].filter((x) => (x.win === "D0" ? hasD0 : hasD7));

    const series = combos.map((c) => {
      const srcMap = c.source === "organic" ? monthlyOrg : monthlyPaid;
      const data = countries.map((cty) => {
        const cell = srcMap[cty];
        if (!cell) return null;
        const v = c.win === "D0" ? safeDiv(cell.d0_flow, cell.d0_user) : safeDiv(cell.d7_flow, cell.d7_user);
        return v;
      });

      const itemStyle = { color: c.color };
      if (c.decal) {
        itemStyle.decal = {
          symbol: "rect",
          dashArrayX: [1, 0],
          dashArrayY: [6, 3],
          rotation: Math.PI / 4,
          color: "rgba(255,255,255,.35)",
        };
      }

      return {
        name: c.name,
        type: "bar",
        barMaxWidth: 16,
        itemStyle,
        data,
      };
    });

    return {
      title: {
        text: `${monthLabel} · ${metricLabel}（USD/人）`,
        left: 0,
        top: 0,
        textStyle: { fontSize: 12, fontWeight: 600, color: cssVar("--text-main", cssVar("--text", "#0f172a")) },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        valueFormatter: (v) => (v == null ? "—" : `${fmtUsdPerCap(v)} USD/人`),
      },
      legend: { type: "scroll", top: 26, left: 0 },
      grid: { left: 18, right: 18, top: 62, bottom: 26, containLabel: true },
      xAxis: {
        type: "category",
        data: countries,
        axisLabel: { color: cssVar("--text-sub", cssVar("--muted", "#6b7280")) },
        axisLine: { lineStyle: { color: cssVar("--border-subtle", cssVar("--border", "rgba(148,163,184,.60)")) } },
      },
      yAxis: {
        type: "value",
        axisLabel: { color: cssVar("--text-sub", cssVar("--muted", "#6b7280")) },
        splitLine: { lineStyle: { color: "rgba(148,163,184,.25)" } },
      },
      series,
    };
  }

  function buildLineOption({ countries, windows, metricLabel, dailyOrg, dailyPaid, dates, monthLabel }) {
    const hasD0 = windows.includes("D0");
    const hasD7 = windows.includes("D7");

    const series = [];
    for (const c of countries) {
      const color = COUNTRY_COLORS[c] || "#2563eb";

      if (hasD0) {
        series.push({
          name: `${c} D0 自然`,
          type: "line",
          showSymbol: false,
          symbol: "circle",
          lineStyle: { type: "dashed", width: 2, color },
          itemStyle: { color },
          data: dates.map((d) => {
            const cell = dailyOrg[d] && dailyOrg[d][c];
            return cell ? safeDiv(cell.d0_flow, cell.d0_user) : null;
          }),
        });
        series.push({
          name: `${c} D0 买量`,
          type: "line",
          showSymbol: false,
          symbol: "circle",
          lineStyle: { type: "solid", width: 2, color },
          itemStyle: { color },
          data: dates.map((d) => {
            const cell = dailyPaid[d] && dailyPaid[d][c];
            return cell ? safeDiv(cell.d0_flow, cell.d0_user) : null;
          }),
        });
      }

      if (hasD7) {
        series.push({
          name: `${c} D7 自然`,
          type: "line",
          showSymbol: false,
          symbol: "diamond",
          lineStyle: { type: "dashed", width: 3, color },
          itemStyle: { color },
          data: dates.map((d) => {
            const cell = dailyOrg[d] && dailyOrg[d][c];
            return cell ? safeDiv(cell.d7_flow, cell.d7_user) : null;
          }),
        });
        series.push({
          name: `${c} D7 买量`,
          type: "line",
          showSymbol: false,
          symbol: "diamond",
          lineStyle: { type: "solid", width: 3, color },
          itemStyle: { color },
          data: dates.map((d) => {
            const cell = dailyPaid[d] && dailyPaid[d][c];
            return cell ? safeDiv(cell.d7_flow, cell.d7_user) : null;
          }),
        });
      }
    }

    return {
      title: {
        text: `${monthLabel} · ${metricLabel}（日级，USD/人）`,
        left: 0,
        top: 0,
        textStyle: { fontSize: 12, fontWeight: 600, color: cssVar("--text-main", cssVar("--text", "#0f172a")) },
      },
      tooltip: {
        trigger: "axis",
        valueFormatter: (v) => (v == null ? "—" : `${fmtUsdPerCap(v)} USD/人`),
      },
      legend: { type: "scroll", top: 26, left: 0 },
      grid: { left: 18, right: 18, top: 62, bottom: 30, containLabel: true },
      xAxis: {
        type: "category",
        data: dates.map(shortDate),
        axisLabel: { color: cssVar("--text-sub", cssVar("--muted", "#6b7280")) },
        axisLine: { lineStyle: { color: cssVar("--border-subtle", cssVar("--border", "rgba(148,163,184,.60)")) } },
      },
      yAxis: {
        type: "value",
        axisLabel: { color: cssVar("--text-sub", cssVar("--muted", "#6b7280")) },
        splitLine: { lineStyle: { color: "rgba(148,163,184,.25)" } },
      },
      series,
    };
  }

  register({
    id: MODULE_ID,
    title: "D0 / D7 人均流水（体育 / 游戏 / 总）",
    subtitle: "D0/D7_*_BET_FLOW ÷ D0/D7_*_BET_PLACED_USER（单位：USD/人）",
    span: "full",

    render({ mountEl, organic, paid }) {
      injectStylesOnce();

      const organicByMonth = resolveByMonth("organic", organic);
      const paidByMonth = resolveByMonth("paid", paid);

      const months = listMonths(organicByMonth, paidByMonth);
      const defaultMonth =
        (window.OVP && OVP.insights && typeof OVP.insights.latestMonth === "function"
          ? OVP.insights.latestMonth()
          : null) || (months.length ? months[months.length - 1] : null);

      // ====== DOM ======
      mountEl.innerHTML = `
        <div class="ovp-m4">
          <div class="row">
            <div class="fg" style="min-width:160px">
              <label>月份</label>
              <select data-el="month"></select>
            </div>

            <div class="fg" style="min-width:240px">
              <label>国家（多选）</label>
              <div class="chips" data-el="countries"></div>
            </div>

            <div class="fg" style="min-width:220px">
              <label>图类型</label>
              <div class="seg" data-el="chartType">
                <button type="button" data-v="bar" aria-pressed="true">月度柱状图</button>
                <button type="button" data-v="line" aria-pressed="false">日级折线图</button>
              </div>
            </div>

            <div class="fg" style="min-width:200px">
              <label>D0 / D7（多选）</label>
              <div class="chips" data-el="windows"></div>
            </div>

            <div class="fg" style="min-width:200px">
              <label>人均口径</label>
              <select data-el="metric"></select>
            </div>
          </div>

          <div class="subline">
            <div class="k">
              <span class="dot" style="background:${cssVar("--ovp-yellow", "#F6C344")}"></span>自然量
              <span style="margin-left:10px" class="k"><span class="dot" style="background:${cssVar("--ovp-blue", "#2563eb")}"></span>买量</span>
            </div>
            <div class="k">单位：USD/人（分母=下注用户数）</div>
          </div>

          <div class="chart" data-el="chart"></div>

          <div class="table-wrap" data-el="tableWrap"></div>

          <div data-el="analysis"></div>
        </div>
      `;

      const $ = (sel) => mountEl.querySelector(sel);

      const monthSel = $('[data-el="month"]');
      const countriesEl = $('[data-el="countries"]');
      const chartTypeEl = $('[data-el="chartType"]');
      const windowsEl = $('[data-el="windows"]');
      const metricSel = $('[data-el="metric"]');
      const chartEl = $('[data-el="chart"]');
      const tableWrap = $('[data-el="tableWrap"]');
      const analysisEl = $('[data-el="analysis"]');

      // ====== State ======
      const state = {
        month: defaultMonth,
        chartType: "bar",
        countries: new Set(COUNTRIES),
        windows: new Set(WINDOWS),
        metric: "total",
      };

      // Month options
      monthSel.innerHTML = months.map((m) => `<option value="${m}">${m}</option>`).join("");
      if (state.month && months.includes(state.month)) monthSel.value = state.month;
      else if (months.length) {
        state.month = months[months.length - 1];
        monthSel.value = state.month;
      }

      // Metric options
      metricSel.innerHTML = Object.keys(METRICS)
        .map((k) => `<option value="${k}">${METRICS[k].label}</option>`)
        .join("");
      metricSel.value = state.metric;

      function renderChipGroup(container, items, selectedSet) {
        container.innerHTML = items
          .map(
            (v) =>
              `<button type="button" class="chip" data-v="${v}" aria-pressed="${
                selectedSet.has(v) ? "true" : "false"
              }">${v}</button>`
          )
          .join("");
      }

      renderChipGroup(countriesEl, COUNTRIES, state.countries);
      renderChipGroup(windowsEl, WINDOWS, state.windows);

      function toggleChip(container, set, v) {
        if (set.has(v)) set.delete(v);
        else set.add(v);

        // 强制至少选 1 个
        if (set.size === 0) set.add(v);

        renderChipGroup(container, set === state.countries ? COUNTRIES : WINDOWS, set);
      }

      countriesEl.addEventListener("click", (e) => {
        const btn = e.target.closest('button[data-v]');
        if (!btn) return;
        const v = btn.getAttribute("data-v");
        toggleChip(countriesEl, state.countries, v);
        refresh();
      });

      windowsEl.addEventListener("click", (e) => {
        const btn = e.target.closest('button[data-v]');
        if (!btn) return;
        const v = btn.getAttribute("data-v");
        toggleChip(windowsEl, state.windows, v);
        refresh();
      });

      chartTypeEl.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-v]");
        if (!btn) return;
        const v = btn.getAttribute("data-v");
        state.chartType = v;
        for (const b of chartTypeEl.querySelectorAll("button[data-v]")) {
          b.setAttribute("aria-pressed", b.getAttribute("data-v") === v ? "true" : "false");
        }
        refresh();
      });

      monthSel.addEventListener("change", () => {
        state.month = monthSel.value;
        refresh();
      });

      metricSel.addEventListener("change", () => {
        state.metric = metricSel.value;
        refresh();
      });

      // ====== Chart init ======
      let chart = null;
      let echartsRef = null;
      let chartError = null;

      function renderTable({ countries, windows, metricLabel, monthlyOrg, monthlyPaid }) {
        const hasD0 = windows.includes("D0");
        const hasD7 = windows.includes("D7");

        const cols = [];
        if (hasD0) cols.push({ k: "orgD0", name: `自然量 D0 ${metricLabel}` });
        if (hasD7) cols.push({ k: "orgD7", name: `自然量 D7 ${metricLabel}` });
        if (hasD0) cols.push({ k: "paidD0", name: `买量 D0 ${metricLabel}` });
        if (hasD7) cols.push({ k: "paidD7", name: `买量 D7 ${metricLabel}` });

        const th = ["<th>国家</th>", ...cols.map((c) => `<th>${c.name}</th>`)].join("");

        const rowsHtml = countries
          .map((c) => {
            const o = monthlyOrg[c] || null;
            const p = monthlyPaid[c] || null;

            const orgD0 = o ? safeDiv(o.d0_flow, o.d0_user) : null;
            const orgD7 = o ? safeDiv(o.d7_flow, o.d7_user) : null;
            const paidD0 = p ? safeDiv(p.d0_flow, p.d0_user) : null;
            const paidD7 = p ? safeDiv(p.d7_flow, p.d7_user) : null;

            const values = { orgD0, orgD7, paidD0, paidD7 };
            const tds = cols.map((col) => `<td>${fmtUsdPerCap(values[col.k])}</td>`).join("");
            return `<tr><td>${c}</td>${tds}</tr>`;
          })
          .join("");

        tableWrap.innerHTML = `
          <table>
            <thead><tr>${th}</tr></thead>
            <tbody>${rowsHtml || `<tr><td colspan="${1 + cols.length}">—</td></tr>`}</tbody>
          </table>
          <div class="hint">口径：${metricLabel} / 下注用户数 · 单位：USD/人 · 月份：${state.month || "—"}</div>
        `;
      }

      function refresh() {
        const month = state.month;
        const metric = METRICS[state.metric] || METRICS.total;
        const metricLabel = metric.label;

        const selectedCountries = Array.from(state.countries).filter((c) => COUNTRIES.includes(c));
        selectedCountries.sort((a, b) => COUNTRIES.indexOf(a) - COUNTRIES.indexOf(b));
        const countries = selectedCountries.length ? selectedCountries : COUNTRIES.slice();

        const windows = Array.from(state.windows).filter((w) => WINDOWS.includes(w));
        windows.sort((a, b) => WINDOWS.indexOf(a) - WINDOWS.indexOf(b));
        const winArr = windows.length ? windows : WINDOWS.slice();

        const oRows = month && organicByMonth[month] ? organicByMonth[month] : [];
        const pRows = month && paidByMonth[month] ? paidByMonth[month] : [];

        const monthlyOrg = buildAggByCountry(oRows, metric);
        const monthlyPaid = buildAggByCountry(pRows, metric);

        // 表格先渲染（即使图表库没加载也能看到）
        renderTable({ countries, windows: winArr, metricLabel, monthlyOrg, monthlyPaid });

        // 文案区
        if (window.OVP && OVP.insights && typeof OVP.insights.render === "function") {
          OVP.insights.render(analysisEl, MODULE_ID, month);
        } else {
          analysisEl.innerHTML = `<div class="empty">未检测到 insights-copy.js；请确认已在 index.html 引入。</div>`;
        }

        // 图表
        if (!chart) {
          if (chartError) {
            chartEl.innerHTML = `<div class="empty">图表库加载失败：${chartError}</div>`;
          } else {
            chartEl.innerHTML = `<div class="empty">图表初始化中…</div>`;
          }
          return;
        }

        const monthLabel = month || "—";

        try {
          if (state.chartType === "bar") {
            const opt = buildBarOption({
              countries,
              windows: winArr,
              metricLabel,
              monthlyOrg,
              monthlyPaid,
              monthLabel,
            });
            chart.setOption(opt, true);
          } else {
            const dailyOrg = buildAggByDate(oRows, metric);
            const dailyPaid = buildAggByDate(pRows, metric);
            const dates = Array.from(new Set([].concat(Object.keys(dailyOrg), Object.keys(dailyPaid))))
              .filter(Boolean)
              .sort();

            const opt = buildLineOption({
              countries,
              windows: winArr,
              metricLabel,
              dailyOrg,
              dailyPaid,
              dates,
              monthLabel,
            });
            chart.setOption(opt, true);
          }
          chart.resize();
        } catch (e) {
          chartEl.innerHTML = `<div class="empty">图表渲染失败：${e && e.message ? e.message : "unknown error"}</div>`;
        }
      }

      // ECharts load
      loadECharts()
        .then((ech) => {
          chartError = null;
          echartsRef = ech;
          chart = echartsRef.init(chartEl);
          window.addEventListener("resize", () => {
            try {
              chart && chart.resize();
            } catch (_e) {}
          });
          refresh();
        })
        .catch((e) => {
          chartError = e && e.message ? e.message : "echarts not available";
          chartEl.innerHTML = `<div class="empty">图表库加载失败：${chartError}</div>`;
          // 依旧让表格/文案生效（refresh 不会覆盖 chartError）
          refresh();
        });

      // 立即渲染一次（先出表格/文案）
      refresh();
    },
  });
})();
