// organic-monthly/module-betflow-percapita.js
(function () {
  const moduleId = "betflow";
  const STYLE_ID = "ovp-style-betflow-percapita";

  const COUNTRY_ORDER = ["GH", "KE", "NG", "TZ", "UG"];
  const WINDOW_ORDER = ["D0", "D7"];

  const CHART_TYPE_OPTIONS = [
    { key: "bar", label: "月度柱状图" },
    { key: "line", label: "日级折线图" },
  ];

  const DIMENSIONS = [
    {
      key: "total",
      label: "人均总流水",
      header: "总流水",
      dimShort: "总",
      flowSuffix: "TOTAL_BET_FLOW",
      userSuffix: "TOTAL_BET_PLACED_USER",
    },
    {
      key: "sports",
      label: "人均体育流水",
      header: "体育流水",
      dimShort: "体育",
      flowSuffix: "SPORTS_BET_FLOW",
      userSuffix: "SPORTS_BET_PLACED_USER",
    },
    {
      key: "games",
      label: "人均游戏流水",
      header: "游戏流水",
      dimShort: "游戏",
      flowSuffix: "GAMES_BET_FLOW",
      userSuffix: "GAMES_BET_PLACED_USER",
    },
  ];

  const DIM_BY_KEY = DIMENSIONS.reduce((acc, d) => {
    acc[d.key] = d;
    return acc;
  }, {});

  function cssVar(name, fallback) {
    try {
      const v = getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim();
      return v || fallback;
    } catch (_) {
      return fallback;
    }
  }

  function num(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  function safeDiv(n, d) {
    const dn = Number(d);
    if (!Number.isFinite(dn) || dn <= 0) return null;
    const nn = Number(n);
    if (!Number.isFinite(nn)) return null;
    return nn / dn;
  }

  function monthShort(monthKey) {
    // "2025-09" -> "9月"
    const m = String(monthKey || "").slice(5, 7);
    const mm = parseInt(m, 10);
    return Number.isFinite(mm) ? `${mm}月` : String(monthKey || "");
  }

  function fmtUsd2(v) {
    const n = Number(v);
    if (!Number.isFinite(n)) return "—";
    return `$${n.toFixed(2)}`;
  }

  function fmtUsdAxis(v) {
    const n = Number(v);
    if (!Number.isFinite(n)) return "";
    return `$${n.toFixed(1)}`;
  }

  const MONTH_PALETTE = [
    cssVar("--ovp-blue", "#2563eb"),
    "#16a34a",
    "#f97316",
    "#7c3aed",
    "#ef4444",
    "#0ea5e9",
    "#0f766e",
    "#f59e0b",
  ];

  const COUNTRY_COLOR_MAP = {
    GH: "#2563eb",
    KE: "#16a34a",
    NG: "#f97316",
    TZ: "#7c3aed",
    UG: "#ef4444",
  };

  function getColorForMonth(allMonthsSorted, monthKey) {
    const idx = Math.max(0, allMonthsSorted.indexOf(monthKey));
    return MONTH_PALETTE[idx % MONTH_PALETTE.length];
  }

  function getColorForCountry(country) {
    return COUNTRY_COLOR_MAP[country] || "#2563eb";
  }

  const d7Decal = {
    symbol: "rect",
    rotation: Math.PI / 4,
    color: "rgba(255,255,255,0.35)",
    dashArrayX: [6, 3],
    dashArrayY: [1, 0],
    symbolSize: 1,
  };

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .ovp-bfpc-filters{
        display:flex;
        flex-wrap:wrap;
        gap:10px 12px;
        padding:10px 12px;
        border:1px solid rgba(148, 163, 184, 0.60);
        border-radius:12px;
        background: rgba(249, 250, 251, 0.90);
      }
      .ovp-bfpc-filter-group{
        display:flex;
        flex-direction:column;
        gap:6px;
        min-width: 220px;
      }
      .ovp-bfpc-filter-label{
        display:flex;
        align-items:center;
        gap:6px;
        font-size:11px;
        color: var(--muted);
        line-height:1.2;
      }
      .ovp-bfpc-badge{
        font-size:10px;
        padding:2px 6px;
        border-radius:999px;
        border:1px solid rgba(148, 163, 184, 0.60);
        background:#fff;
        color: var(--muted);
      }
      .ovp-bfpc-options{
        display:flex;
        flex-wrap:wrap;
        gap:8px;
      }
      .ovp-bfpc-chip{
        display:inline-flex;
        align-items:center;
        gap:6px;
        padding:6px 10px;
        border-radius:999px;
        border:1px solid rgba(148, 163, 184, 0.55);
        background:#fff;
        cursor:pointer;
        user-select:none;
        transition: background .15s ease, border-color .15s ease, transform .05s ease;
      }
      .ovp-bfpc-chip:active{ transform: translateY(1px); }
      .ovp-bfpc-chip input{ display:none; }
      .ovp-bfpc-chip span{
        font-size:11px;
        color: var(--text);
        line-height:1.1;
        white-space:nowrap;
      }
      .ovp-bfpc-chip.is-checked{
        border-color: rgba(37, 99, 235, 0.75);
        background: rgba(37, 99, 235, 0.08);
      }

      .ovp-bfpc-hint{
        font-size:11px;
        color: var(--muted);
        line-height:1.45;
        border:1px solid rgba(148, 163, 184, 0.55);
        background:#fff;
        border-radius:10px;
        padding:8px 10px;
        min-height: 34px;
      }

      .ovp-bfpc-table-scroll{
        border:1px solid rgba(148, 163, 184, 0.60);
        border-radius:12px;
        background:#fff;
        overflow:auto;
      }
      .ovp-bfpc-table{
        width:100%;
        border-collapse:separate;
        border-spacing:0;
        min-width: 760px;
      }
      .ovp-bfpc-table thead th{
        position: sticky;
        top: 0;
        z-index: 1;
        background:#fff;
      }
      .ovp-bfpc-table th,
      .ovp-bfpc-table td{
        text-align:center;
        padding:10px 8px;
        font-size:11px;
        border-bottom:1px solid rgba(148, 163, 184, 0.30);
        color: var(--text);
        white-space:nowrap;
      }
      .ovp-bfpc-table tbody tr:last-child th,
      .ovp-bfpc-table tbody tr:last-child td{
        border-bottom:none;
      }

      .ovp-bfpc-insight-title{
        font-size:11px;
        color: var(--muted);
        margin-bottom:6px;
      }
      .ovp-bfpc-insight-item{
        padding:6px 0;
      }
      .ovp-bfpc-insight-item + .ovp-bfpc-insight-item{
        border-top:1px dashed rgba(148, 163, 184, 0.55);
        margin-top:6px;
        padding-top:10px;
      }
      .ovp-bfpc-insight-month{
        font-size:12px;
        font-weight:600;
        margin-bottom:4px;
        color: var(--text);
      }
      .ovp-bfpc-insight-text{
        white-space: pre-wrap;
        word-break: break-word;
      }
      .ovp-bfpc-insight-text.is-empty{
        color: var(--muted);
      }
    `;
    document.head.appendChild(style);
  }

  function buildLayoutHTML(id) {
    return `
      <div class="ovp-module-stack">
        <div class="ovp-bfpc-filters" id="bfpc-filters-${id}">
          <div class="ovp-bfpc-filter-group">
            <div class="ovp-bfpc-filter-label">月份 <span class="ovp-bfpc-badge">多选</span></div>
            <div class="ovp-bfpc-options" id="bfpc-months-${id}"></div>
          </div>

          <div class="ovp-bfpc-filter-group">
            <div class="ovp-bfpc-filter-label">国家 <span class="ovp-bfpc-badge">多选</span></div>
            <div class="ovp-bfpc-options" id="bfpc-countries-${id}"></div>
          </div>

          <div class="ovp-bfpc-filter-group">
            <div class="ovp-bfpc-filter-label">图表 <span class="ovp-bfpc-badge">单选</span></div>
            <div class="ovp-bfpc-options" id="bfpc-chartType-${id}"></div>
          </div>

          <div class="ovp-bfpc-filter-group">
            <div class="ovp-bfpc-filter-label">D0 / D7 <span class="ovp-bfpc-badge">多选</span></div>
            <div class="ovp-bfpc-options" id="bfpc-windows-${id}"></div>
          </div>

          <div class="ovp-bfpc-filter-group" style="min-width:260px;">
            <div class="ovp-bfpc-filter-label">指标 <span class="ovp-bfpc-badge">单选</span></div>
            <div class="ovp-bfpc-options" id="bfpc-metric-${id}"></div>
          </div>

          <div class="ovp-bfpc-filter-group" style="flex:1 1 320px; min-width:320px;">
            <div class="ovp-bfpc-filter-label">提示</div>
            <div class="ovp-bfpc-hint" id="bfpc-hint-${id}"></div>
          </div>
        </div>

        <div>
          <div class="ovp-chart" id="bfpc-chart-${id}" style="height:360px;"></div>
          <div class="ovp-chart-note" id="bfpc-chart-note-${id}"></div>
        </div>

        <div>
          <div class="ovp-bfpc-table-scroll">
            <table class="ovp-bfpc-table" id="bfpc-table-${id}"></table>
          </div>
          <div class="ovp-chart-note" id="bfpc-table-note-${id}"></div>
        </div>

        <div class="ovp-insight" id="bfpc-insight-wrap-${id}">
          <div class="ovp-bfpc-insight-title" id="bfpc-insight-title-${id}"></div>
          <div id="bfpc-insight-${id}"></div>
        </div>
      </div>
    `;
  }

  function buildChipsHtml(values, group, labelFn) {
    return (Array.isArray(values) ? values : [])
      .map((v) => {
        const label = labelFn ? labelFn(v) : String(v);
        return `
          <label class="ovp-bfpc-chip" data-chip>
            <input type="checkbox" data-group="${group}" data-value="${String(v)}" />
            <span>${label}</span>
          </label>
        `;
      })
      .join("");
  }

  OVP.registerModule({
    id: moduleId,
    title: "4) D0 / D7 人均流水（体育 / 游戏 / 总）",
    subtitle:
      "口径：D0/D7_{TOTAL|SPORTS|GAMES}_BET_FLOW / D0/D7_{TOTAL|SPORTS|GAMES}_BET_PLACED_USER（单位：USD 等值 / 下注用户）",
    render({ mountEl, rawByMonth, months, latestMonth, utils }) {
      ensureStyle();

      const RAW = rawByMonth || {};
      const allMonths = (utils && utils.sortMonths ? utils.sortMonths(months) : [])
        .filter((m) => String(m || "").trim());

      const lm = latestMonth || (allMonths.length ? allMonths[allMonths.length - 1] : null);

      if (!mountEl) return;
      if (!allMonths.length) {
        mountEl.innerHTML = `<div class="ovp-placeholder">未检测到月份 key：请检查 data.js 是否暴露 RAW_ORGANIC_BY_MONTH</div>`;
        return;
      }

      mountEl.innerHTML = buildLayoutHTML(moduleId);

      const filtersEl = mountEl.querySelector(`#bfpc-filters-${moduleId}`);
      const monthsEl = mountEl.querySelector(`#bfpc-months-${moduleId}`);
      const countriesEl = mountEl.querySelector(`#bfpc-countries-${moduleId}`);
      const chartTypeEl = mountEl.querySelector(`#bfpc-chartType-${moduleId}`);
      const windowsEl = mountEl.querySelector(`#bfpc-windows-${moduleId}`);
      const metricEl = mountEl.querySelector(`#bfpc-metric-${moduleId}`);
      const hintEl = mountEl.querySelector(`#bfpc-hint-${moduleId}`);

      const chartDom = mountEl.querySelector(`#bfpc-chart-${moduleId}`);
      const chartNoteEl = mountEl.querySelector(`#bfpc-chart-note-${moduleId}`);

      const tableEl = mountEl.querySelector(`#bfpc-table-${moduleId}`);
      const tableNoteEl = mountEl.querySelector(`#bfpc-table-note-${moduleId}`);

      const insightTitleEl = mountEl.querySelector(`#bfpc-insight-title-${moduleId}`);
      const insightBodyEl = mountEl.querySelector(`#bfpc-insight-${moduleId}`);
      const insightWrapEl = mountEl.querySelector(`#bfpc-insight-wrap-${moduleId}`);

      // --- Default selections: last 2 months if possible
      const defaultMonths = allMonths.length >= 2 ? allMonths.slice(-2) : allMonths.slice(-1);

      const state = {
        chartType: "bar",
        months: new Set(defaultMonths),
        countries: new Set(COUNTRY_ORDER),
        windows: new Set(WINDOW_ORDER),
        metric: "total",
      };

      monthsEl.innerHTML = buildChipsHtml(allMonths, "months", (m) => m);
      countriesEl.innerHTML = buildChipsHtml(COUNTRY_ORDER, "countries", (c) => c);
      chartTypeEl.innerHTML = buildChipsHtml(
        CHART_TYPE_OPTIONS.map((o) => o.key),
        "chartType",
        (k) => (CHART_TYPE_OPTIONS.find((o) => o.key === k) || { label: k }).label
      );
      windowsEl.innerHTML = buildChipsHtml(WINDOW_ORDER, "windows", (w) => w);
      metricEl.innerHTML = buildChipsHtml(
        DIMENSIONS.map((d) => d.key),
        "metric",
        (k) => (DIM_BY_KEY[k] ? DIM_BY_KEY[k].label : k)
      );

      // --- Chart init
      let chart = null;
      if (!window.echarts) {
        chartDom.classList.add("is-empty");
        chartDom.innerHTML = `<div class="ovp-skeleton" aria-hidden="true"></div>`;
      } else {
        chart = window.echarts.init(chartDom);
        // Resize: window + observer
        const onResize = () => {
          try {
            chart && chart.resize();
          } catch (_) {}
        };
        window.addEventListener("resize", onResize);
        if (window.ResizeObserver) {
          const ro = new ResizeObserver(() => onResize());
          ro.observe(chartDom);
        }
      }

      // --- Aggregation cache (monthly)
      const AGG_FIELDS = [];
      for (const w of WINDOW_ORDER) {
        for (const d of DIMENSIONS) {
          AGG_FIELDS.push(`${w}_${d.flowSuffix}`);
          AGG_FIELDS.push(`${w}_${d.userSuffix}`);
        }
      }

      const monthlyAggCache = new Map(); // month -> { [country]: sumsObj }

      function emptySums() {
        const o = {};
        for (const f of AGG_FIELDS) o[f] = 0;
        return o;
      }

      function getMonthlyAgg(month) {
        const key = String(month || "");
        if (monthlyAggCache.has(key)) return monthlyAggCache.get(key);

        const rows = Array.isArray(RAW[key]) ? RAW[key] : [];
        const agg = {};
        for (const r of rows) {
          const c = String(r && r.country ? r.country : "").trim();
          if (!c) continue;
          if (!agg[c]) agg[c] = emptySums();
          const a = agg[c];
          for (const f of AGG_FIELDS) a[f] += num(r[f]);
        }
        monthlyAggCache.set(key, agg);
        return agg;
      }

      function monthList() {
        const arr = Array.from(state.months);
        return utils && utils.sortMonths ? utils.sortMonths(arr) : arr.sort();
      }

      function countryList() {
        return COUNTRY_ORDER.filter((c) => state.countries.has(c));
      }

      function windowList() {
        return WINDOW_ORDER.filter((w) => state.windows.has(w));
      }

      function currentDim() {
        return DIM_BY_KEY[state.metric] || DIMENSIONS[0];
      }

      function getMonthlyValue(month, country, win, dim) {
        const a = getMonthlyAgg(month);
        const cAgg = (a && a[country]) ? a[country] : null;
        if (!cAgg) return null;
        const flow = cAgg[`${win}_${dim.flowSuffix}`];
        const users = cAgg[`${win}_${dim.userSuffix}`];
        return safeDiv(flow, users);
      }

      function buildDailySeries(monthsSel, countriesSel, winsSel, dim) {
        const datesSet = new Set();
        const acc = new Map(); // key = `${country}|${win}` -> Map(date -> {flow,user})

        const countriesSet = new Set(countriesSel);

        for (const m of monthsSel) {
          const rows = Array.isArray(RAW[m]) ? RAW[m] : [];
          for (const r of rows) {
            const c = String(r && r.country ? r.country : "").trim();
            if (!countriesSet.has(c)) continue;

            const date = String(r && r.date ? r.date : "").trim();
            if (!date) continue;
            datesSet.add(date);

            for (const w of winsSel) {
              const k = `${c}|${w}`;
              let map = acc.get(k);
              if (!map) {
                map = new Map();
                acc.set(k, map);
              }
              let rec = map.get(date);
              if (!rec) {
                rec = { flow: 0, user: 0 };
                map.set(date, rec);
              }
              rec.flow += num(r[`${w}_${dim.flowSuffix}`]);
              rec.user += num(r[`${w}_${dim.userSuffix}`]);
            }
          }
        }

        const dates = Array.from(datesSet).sort();
        const series = [];

        for (const c of countriesSel) {
          const color = getColorForCountry(c);
          for (const w of winsSel) {
            const k = `${c}|${w}`;
            const map = acc.get(k) || new Map();
            const data = dates.map((dt) => {
              const rec = map.get(dt);
              if (!rec) return null;
              return safeDiv(rec.flow, rec.user);
            });

            series.push({
              name: `${c} · ${w}`,
              type: "line",
              data,
              showSymbol: false,
              connectNulls: false,
              emphasis: { focus: "series" },
              itemStyle: { color },
              lineStyle: { color, width: 2, type: w === "D0" ? "dashed" : "solid" },
            });
          }
        }

        return { dates, series };
      }

      function setChipState() {
        const inputs = mountEl.querySelectorAll("input[data-group][data-value]");
        inputs.forEach((inp) => {
          const group = inp.getAttribute("data-group");
          const val = inp.getAttribute("data-value");
          let checked = false;

          if (group === "chartType") checked = state.chartType === val;
          else if (group === "metric") checked = state.metric === val;
          else if (group === "months") checked = state.months.has(val);
          else if (group === "countries") checked = state.countries.has(val);
          else if (group === "windows") checked = state.windows.has(val);

          inp.checked = checked;
          const label = inp.closest("label");
          if (label) label.classList.toggle("is-checked", checked);
        });
      }

      function renderHintAndNotes(monthsSel, countriesSel, winsSel, dim) {
        const winTxt = winsSel.length ? winsSel.join("/") : "—";
        const mTxt = monthsSel.length ? monthsSel.map((m) => monthShort(m)).join("、") : "—";
        const cTxt = countriesSel.length ? countriesSel.join("/") : "—";

        hintEl.textContent =
          state.chartType === "bar"
            ? `柱状：颜色=月份；D7=同色+斜线；当前=${dim.label}；月份=${mTxt}；国家=${cTxt}；口径=${winTxt}。`
            : `折线：颜色=国家；D0=虚线，D7=实线；跨月日期轴连续；当前=${dim.label}；国家=${cTxt}；口径=${winTxt}。`;

        chartNoteEl.textContent =
          "单位：USD 等值 / 下注用户。柱状：颜色=月份、斜线=D7；折线：颜色=国家、虚线=D0、实线=D7。";

        tableNoteEl.textContent =
          "表格口径：按月汇总后计算（∑BET_FLOW / ∑BET_PLACED_USER）。";
      }

      function renderChartBar(monthsSel, countriesSel, winsSel, dim) {
        if (!chart) return;

        const categories = countriesSel;
        const metaBySeriesIndex = [];
        const series = [];

        for (const m of monthsSel) {
          const baseColor = getColorForMonth(allMonths, m);
          for (const w of winsSel) {
            const name = `${monthShort(m)}${w}`;
            const data = categories.map((c) => getMonthlyValue(m, c, w, dim));

            const itemStyle = { color: baseColor };
            if (w === "D7") itemStyle.decal = d7Decal;

            metaBySeriesIndex.push({ m, w });

            series.push({
              name,
              type: "bar",
              data,
              emphasis: { focus: "series" },
              itemStyle,
              barMaxWidth: 16,
            });
          }
        }

        const option = {
          animationDuration: 220,
          grid: { top: 50, left: 40, right: 16, bottom: 48, containLabel: true },
          legend: {
            type: "scroll",
            top: 8,
            left: 8,
            right: 8,
            textStyle: { fontSize: 11 },
          },
          tooltip: {
            trigger: "axis",
            axisPointer: { type: "shadow" },
            confine: true,
            formatter: (params) => {
              const header = `${params[0] ? params[0].axisValue : ""}<br/>`;
              const lines = params
                .map((p) => {
                  const val = p && p.value;
                  return `${p.marker} ${p.seriesName}: ${fmtUsd2(val)}`;
                })
                .join("<br/>");
              return header + lines;
            },
          },
          xAxis: {
            type: "category",
            data: categories,
            axisTick: { alignWithLabel: true },
            axisLabel: { fontSize: 11 },
          },
          yAxis: {
            type: "value",
            axisLabel: { formatter: fmtUsdAxis, fontSize: 11 },
            splitLine: { lineStyle: { color: "rgba(148,163,184,0.25)" } },
            name: `${dim.dimShort}人均流水`,
            nameTextStyle: { fontSize: 11, color: "rgba(71,85,105,0.9)" },
          },
          series,
        };

        chart.clear();
        chart.setOption(option, true);
      }

      function renderChartLine(monthsSel, countriesSel, winsSel, dim) {
        if (!chart) return;

        const { dates, series } = buildDailySeries(monthsSel, countriesSel, winsSel, dim);

        const option = {
          animationDuration: 220,
          grid: { top: 50, left: 40, right: 16, bottom: 56, containLabel: true },
          legend: {
            type: "scroll",
            top: 8,
            left: 8,
            right: 8,
            textStyle: { fontSize: 11 },
          },
          tooltip: {
            trigger: "axis",
            confine: true,
            valueFormatter: (v) => fmtUsd2(v),
          },
          xAxis: {
            type: "category",
            data: dates,
            axisLabel: {
              fontSize: 11,
              hideOverlap: true,
              formatter: (v) => String(v).slice(5), // MM-DD
            },
          },
          yAxis: {
            type: "value",
            axisLabel: { formatter: fmtUsdAxis, fontSize: 11 },
            splitLine: { lineStyle: { color: "rgba(148,163,184,0.25)" } },
            name: `${dim.dimShort}人均流水`,
            nameTextStyle: { fontSize: 11, color: "rgba(71,85,105,0.9)" },
          },
          series,
        };

        chart.clear();
        chart.setOption(option, true);
      }

      function renderTable(monthsSel, countriesSel, winsSel, dim) {
        const cols = [];
        for (const m of monthsSel) {
          for (const w of winsSel) {
            cols.push({
              m,
              w,
              label: `${monthShort(m)}自然量${w} ${dim.header}`,
            });
          }
        }

        const thead =
          `<thead><tr>` +
          `<th>国家</th>` +
          cols.map((c) => `<th>${c.label}</th>`).join("") +
          `</tr></thead>`;

        const tbody =
          `<tbody>` +
          countriesSel
            .map((country) => {
              const tds = cols
                .map((c) => {
                  const val = getMonthlyValue(c.m, country, c.w, dim);
                  return `<td>${fmtUsd2(val)}</td>`;
                })
                .join("");
              return `<tr><th>${country}</th>${tds}</tr>`;
            })
            .join("") +
          `</tbody>`;

        tableEl.innerHTML = thead + tbody;
      }

      function renderInsights(monthsSel) {
        const list = monthsSel.slice().reverse(); // 最新月在上
        insightTitleEl.textContent =
          list.length > 1 ? `数据分析（已选 ${list.length} 个月）` : `数据分析（${list[0] || "—"}）`;

        insightBodyEl.innerHTML = "";
        insightWrapEl.classList.remove("is-empty");

        if (!list.length) {
          insightBodyEl.textContent = "文案待填写：./insights.js";
          insightWrapEl.classList.add("is-empty");
          return;
        }

        let anyText = false;

        for (const m of list) {
          const item = document.createElement("div");
          item.className = "ovp-bfpc-insight-item";

          const monthEl = document.createElement("div");
          monthEl.className = "ovp-bfpc-insight-month";
          monthEl.textContent = m;

          const textEl = document.createElement("div");
          textEl.className = "ovp-bfpc-insight-text";

          const txt = String(OVP.getInsight(moduleId, m) || "").trim();
          if (txt) {
            textEl.textContent = txt;
            anyText = true;
          } else {
            textEl.textContent = "文案待填写：./insights.js";
            textEl.classList.add("is-empty");
          }

          item.appendChild(monthEl);
          item.appendChild(textEl);
          insightBodyEl.appendChild(item);
        }

        if (!anyText) insightWrapEl.classList.add("is-empty");
      }

      function updateAll() {
        const monthsSel = monthList();
        const countriesSel = countryList();
        const winsSel = windowList();
        const dim = currentDim();

        setChipState();
        renderHintAndNotes(monthsSel, countriesSel, winsSel, dim);

        if (state.chartType === "line") {
          renderChartLine(monthsSel, countriesSel, winsSel, dim);
        } else {
          renderChartBar(monthsSel, countriesSel, winsSel, dim);
        }

        renderTable(monthsSel, countriesSel, winsSel, dim);
        renderInsights(monthsSel);
      }

      function onFilterChange(e) {
        const inp = e && e.target ? e.target : null;
        if (!inp || inp.tagName !== "INPUT") return;

        const group = inp.getAttribute("data-group");
        const val = inp.getAttribute("data-value");
        if (!group || val == null) return;

        if (group === "chartType") {
          state.chartType = val;
        } else if (group === "metric") {
          state.metric = val;
        } else if (group === "months") {
          if (inp.checked) state.months.add(val);
          else state.months.delete(val);
          if (state.months.size === 0) state.months.add(lm || val);
        } else if (group === "countries") {
          if (inp.checked) state.countries.add(val);
          else state.countries.delete(val);
          if (state.countries.size === 0) state.countries.add(val);
        } else if (group === "windows") {
          if (inp.checked) state.windows.add(val);
          else state.windows.delete(val);
          if (state.windows.size === 0) state.windows.add(val);
        }

        updateAll();
      }

      filtersEl.addEventListener("change", onFilterChange);
      updateAll();
    },
  });
})();
