/**
 * paid-module-betflow.js
 * ------------------------------------------------------------
 * 模块：D0/D7 人均流水（总/体育/游戏）
 *
 * 数据源：window.RAW_PAID_BY_MONTH
 * 粒度：date(UTC+0) × country × media × productType
 *
 * 公式：
 * - 人均流水 = BET_FLOW / BET_PLACED_USER
 *
 * 交互：
 * - 视图：柱状（月度汇总）/ 折线（日级）
 * - 月份：最多选 3 个
 * - 国家/媒体/产品类型：多选，且支持“全选但不区分”（等价全选，但图/表聚合不拆维度）
 * - 人均口径：总流水 / 体育流水 / 游戏流水（单选）
 * - D0/D7：多选
 *
 * 需要 index.html 提供这些容器 id（如果没有，本脚本会自动在 card-paid-betflow 区块内创建）：
 * - betflow-view / betflow-months / betflow-countries / betflow-medias / betflow-productTypes / betflow-metric / betflow-windows
 * - chart-paid-betflow / table-title-betflow / table-betflow
 */

(function () {
  const MODULE_KEY = "betflow";

  // 国家固定顺序（数据里如果出现其他国家，会排在后面）
  const FIXED_COUNTRY_ORDER = ["GH", "KE", "NG", "TZ"];

  // D7 斜线阴影（ECharts 5 的 decal）
  const D7_DECAL = {
    symbol: "rect",
    symbolSize: 1,
    dashArrayX: [6, 3],
    dashArrayY: [1, 0],
    rotation: Math.PI / 4,
    color: "rgba(255,255,255,0.35)",
  };

  const FALLBACK_COLORS = [
    "#2563eb",
    "#7c3aed",
    "#f97316",
    "#16a34a",
    "#0ea5e9",
    "#db2777",
    "#84cc16",
    "#f43f5e",
    "#14b8a6",
    "#f59e0b",
  ];

  const METRIC_OPTIONS = [
    { key: "total", label: "总流水" },
    { key: "sports", label: "体育流水" },
    { key: "games", label: "游戏流水" },
  ];

  function getMetricConfig(metricKey) {
    const k = String(metricKey || "total");
    if (k === "sports") {
      return {
        key: "sports",
        label: "体育流水",
        d0Flow: "D0_SPORTS_BET_FLOW",
        d0User: "D0_SPORTS_BET_PLACED_USER",
        d7Flow: "D7_SPORTS_BET_FLOW",
        d7User: "D7_SPORTS_BET_PLACED_USER",
      };
    }
    if (k === "games") {
      return {
        key: "games",
        label: "游戏流水",
        d0Flow: "D0_GAMES_BET_FLOW",
        d0User: "D0_GAMES_BET_PLACED_USER",
        d7Flow: "D7_GAMES_BET_FLOW",
        d7User: "D7_GAMES_BET_PLACED_USER",
      };
    }
    return {
      key: "total",
      label: "总流水",
      d0Flow: "D0_TOTAL_BET_FLOW",
      d0User: "D0_TOTAL_BET_PLACED_USER",
      d7Flow: "D7_TOTAL_BET_FLOW",
      d7User: "D7_TOTAL_BET_PLACED_USER",
    };
  }

  function getPalette() {
    const pd = window.PaidDashboard;
    if (pd && Array.isArray(pd.COLORS) && pd.COLORS.length) return pd.COLORS;
    return FALLBACK_COLORS;
  }

  function getRAW() {
    return window.RAW_PAID_BY_MONTH || {};
  }

  function getDom(id) {
    return document.getElementById(id);
  }

  function uniq(arr) {
    return Array.from(new Set((arr || []).filter((v) => v !== undefined && v !== null)));
  }

  function setArray(target, values) {
    target.length = 0;
    (values || []).forEach((v) => target.push(v));
  }

  function normalizeCountry(v) {
    return String(v || "").toUpperCase();
  }
  function normalizeMedia(v) {
    return String(v || "").toUpperCase();
  }
  function normalizeProductType(v) {
    return String(v || "").toLowerCase();
  }

  function sortCountries(list) {
    const order = new Map();
    FIXED_COUNTRY_ORDER.forEach((c, i) => order.set(c, i));

    return (list || [])
      .slice()
      .sort((a, b) => {
        const aa = normalizeCountry(a);
        const bb = normalizeCountry(b);
        const ia = order.has(aa) ? order.get(aa) : 999;
        const ib = order.has(bb) ? order.get(bb) : 999;
        if (ia !== ib) return ia - ib;
        return aa.localeCompare(bb);
      })
      .map((x) => normalizeCountry(x));
  }

  function pickDefaultMonths(allMonths) {
    const ms = (allMonths || []).slice().sort();
    if (ms.length <= 2) return ms;
    return ms.slice(-2);
  }

  function buildOptionsFromRAW() {
    const RAW = getRAW();
    const months = Object.keys(RAW || {}).sort();

    const cSet = new Set();
    const mSet = new Set();
    const pSet = new Set();

    months.forEach((monthKey) => {
      (RAW[monthKey] || []).forEach((r) => {
        if (!r) return;
        if (r.country) cSet.add(normalizeCountry(r.country));
        if (r.media) mSet.add(normalizeMedia(r.media));
        if (r.productType) pSet.add(normalizeProductType(r.productType));
      });
    });

    const countries = sortCountries(Array.from(cSet));
    const medias = Array.from(mSet).sort();
    const productTypes = Array.from(pSet).sort();

    return { months, countries, medias, productTypes };
  }

  function ensureNonEmpty(state, opts) {
    if (!state.months.length) state.months = pickDefaultMonths(opts.months);
    if (!state.months.length) state.months = (opts.months || []).slice(-1);

    if (!state.countries.length) state.countries = (opts.countries || []).slice();
    if (!state.medias.length) state.medias = (opts.medias || []).slice();
    if (!state.productTypes.length) state.productTypes = (opts.productTypes || []).slice();

    if (!state.metric.length) state.metric = ["total"];

    if (!state.windows.length) state.windows = ["D0", "D7"];
  }

  function safeDiv(a, b) {
    const na = Number(a);
    const nb = Number(b);
    if (!isFinite(na) || !isFinite(nb) || nb === 0) return null;
    return na / nb;
  }

  function formatMonthLabel(monthKey) {
    const m = String(monthKey || "");
    const mm = m.split("-")[1];
    if (!mm) return m;
    const n = parseInt(mm, 10);
    if (!isFinite(n)) return m;
    return `${n}月`;
  }

  function formatUSD(v, digits) {
    const d = typeof digits === "number" ? digits : 2;
    if (v == null || !isFinite(v)) return "-";
    return Number(v).toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });
  }

  function sumFields(rows, fields) {
    const out = {};
    (fields || []).forEach((f) => (out[f] = 0));

    (rows || []).forEach((r) => {
      if (!r) return;
      (fields || []).forEach((f) => {
        const v = Number(r[f]);
        if (isFinite(v)) out[f] += v;
      });
    });

    return out;
  }

  function injectStylesOnce() {
    const STYLE_ID = "paid-betflow-module-style";
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      /* betflow：用模块级筛选器，隐藏旧的 header 口径 radio */
      #card-paid-betflow .chart-mini-filter{ display:none; }

      .chart-filter-panel{
        margin-top: 10px;
        padding: 10px 12px;
        border-radius: 14px;
        border: 1px solid rgba(148, 163, 184, 0.45);
        background: rgba(255, 255, 255, 0.6);
        display: grid;
        gap: 8px;
      }
      .chart-filter-panel .hero-filter-row{
        display: grid;
        grid-template-columns: 70px 1fr;
        align-items: start;
        gap: 10px;
      }
      .chart-filter-panel .hero-filter-row .label{
        font-size: 12px;
        color: var(--text-sub, #475569);
        padding-top: 6px;
      }
      .chart-filter-panel .chart-mini-chips{
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .chart-filter-panel .chart-mini-chips label{
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 10px;
        border-radius: 999px;
        border: 1px solid rgba(148, 163, 184, 0.5);
        background: rgba(255,255,255,0.75);
        font-size: 12px;
        color: var(--text-main, #0f172a);
        cursor: pointer;
        user-select: none;
      }
      .chart-filter-panel .chart-mini-chips label input{
        accent-color: #2563eb;
      }
      .chart-filter-panel .chart-mini-chips label.chip-active{
        border-color: rgba(37, 99, 235, 0.8);
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14);
      }
      .chart-filter-panel .chart-mini-radio{
        display: inline-flex;
        gap: 10px;
        flex-wrap: wrap;
      }
      .chart-filter-panel .chart-mini-radio label{
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        color: var(--text-main, #0f172a);
        cursor: pointer;
        user-select: none;
      }

      .chart-table-section{ margin-top: 10px; }
      .chart-table-title{
        font-size: 12px;
        font-weight: 600;
        color: var(--text-sub, #475569);
        margin-bottom: 6px;
      }
      .chart-table-wrapper{
        max-height: 320px;
        overflow: auto;
        border-radius: 10px;
        border: 1px solid rgba(148, 163, 184, 0.45);
        background: rgba(255,255,255,0.85);
      }
      .chart-table{
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        font-size: 11px;
      }
      .chart-table th{
        position: sticky;
        top: 0;
        z-index: 1;
        background: rgba(241, 245, 249, 0.98);
        border-bottom: 1px solid rgba(148, 163, 184, 0.45);
        padding: 8px 10px;
        text-align: left;
        font-weight: 600;
        color: var(--text-sub, #475569);
        white-space: nowrap;
      }
      .chart-table td{
        padding: 7px 10px;
        border-bottom: 1px solid rgba(226, 232, 240, 0.8);
        color: var(--text-main, #0f172a);
        white-space: nowrap;
      }
      .chart-table td.num{
        text-align: right;
        font-variant-numeric: tabular-nums;
      }
      .chart-table tbody tr:nth-child(odd) td{ background: rgba(249, 250, 251, 0.8); }
      .chart-table tbody tr:hover td{ background: rgba(224, 231, 255, 0.65); }
    `;
    document.head.appendChild(style);
  }

  function createFilterPanelFallback(sectionEl) {
    if (!sectionEl) return;

    const any =
      getDom("betflow-view") ||
      getDom("betflow-months") ||
      getDom("betflow-countries") ||
      getDom("betflow-medias") ||
      getDom("betflow-productTypes") ||
      getDom("betflow-metric") ||
      getDom("betflow-windows");
    if (any) return;

    const header = sectionEl.querySelector(".chart-card-header");

    const panel = document.createElement("div");
    panel.className = "chart-filter-panel";
    panel.id = "betflow-filter-panel";
    panel.innerHTML = `
      <div class="hero-filter-row">
        <div class="label">视图</div>
        <div class="chart-mini-radio" id="betflow-view"></div>
      </div>

      <div class="hero-filter-row">
        <div class="label">月份</div>
        <div class="chart-mini-chips" id="betflow-months"></div>
      </div>

      <div class="hero-filter-row">
        <div class="label">国家</div>
        <div class="chart-mini-chips" id="betflow-countries"></div>
      </div>

      <div class="hero-filter-row">
        <div class="label">媒体</div>
        <div class="chart-mini-chips" id="betflow-medias"></div>
      </div>

      <div class="hero-filter-row">
        <div class="label">产品类型</div>
        <div class="chart-mini-chips" id="betflow-productTypes"></div>
      </div>

      <div class="hero-filter-row">
        <div class="label">人均</div>
        <div class="chart-mini-chips" id="betflow-metric"></div>
      </div>

      <div class="hero-filter-row">
        <div class="label">口径</div>
        <div class="chart-mini-chips" id="betflow-windows"></div>
      </div>

      <div style="display:flex;justify-content:flex-end;gap:8px;">
        <button type="button" class="btn" id="betflow-btn-reset">全选 / 重置</button>
      </div>
    `;

    if (header && header.parentNode) header.parentNode.insertBefore(panel, header.nextSibling);
  }

  function createTableFallbackAfter(chartEl) {
    const section = document.createElement("div");
    section.className = "chart-table-section";
    section.id = "table-section-betflow";
    section.innerHTML = `
      <div class="chart-table-title" id="table-title-betflow"></div>
      <div class="chart-table-wrapper">
        <table id="table-betflow" class="chart-table"></table>
      </div>
    `;

    if (chartEl && chartEl.parentNode) {
      chartEl.parentNode.insertBefore(section, chartEl.nextSibling);
    }
  }

  function init() {
    injectStylesOnce();

    const chartEl = getDom("chart-paid-betflow") || getDom("chart-betflow");
    if (!chartEl || !window.echarts) return;

    const sectionEl =
      (chartEl.closest && chartEl.closest(".chart-card")) || getDom("card-paid-betflow") || chartEl.parentNode;

    createFilterPanelFallback(sectionEl);

    let tableTitleEl = getDom("table-title-betflow");
    let tableEl = getDom("table-betflow");
    if (!tableEl) {
      createTableFallbackAfter(chartEl);
      tableTitleEl = getDom("table-title-betflow");
      tableEl = getDom("table-betflow");
    }

    const chart = echarts.init(chartEl);

    // 可选：接入统一 resize
    if (window.PaidDashboard && typeof window.PaidDashboard.registerChart === "function") {
      window.PaidDashboard.registerChart(chart);
    } else {
      window.addEventListener("resize", () => {
        try {
          chart.resize();
        } catch (e) {}
      });
    }

    const opts = buildOptionsFromRAW();
    const state = {
      view: "bar",
      months: [],
      countries: [],
      medias: [],
      productTypes: [],
      metric: ["total"], // 单选：total/sports/games
      windows: ["D0", "D7"],
      collapse: { countries: false, medias: false, productTypes: false },
    };

    function resetState() {
      state.view = "bar";
      state.months = pickDefaultMonths(opts.months);
      state.countries = (opts.countries || []).slice();
      state.medias = (opts.medias || []).slice();
      state.productTypes = (opts.productTypes || []).slice();
      state.metric = ["total"];
      state.windows = ["D0", "D7"];
      state.collapse = { countries: false, medias: false, productTypes: false };
    }

    function buildTitleSuffix() {
      const allMedias = opts.medias || [];
      const allTypes = opts.productTypes || [];

      const mediaText = state.collapse.medias
        ? "全部媒体"
        : state.medias.length === allMedias.length
        ? "全部媒体"
        : state.medias.join("+");

      const typeText = state.collapse.productTypes
        ? "全部形态"
        : state.productTypes.length === allTypes.length
        ? "全部形态"
        : state.productTypes.map((v) => String(v).toUpperCase()).join("+");

      return `（${mediaText}，${typeText}）`;
    }

    function renderRadioView() {
      const container = getDom("betflow-view");
      if (!container) return;
      container.innerHTML = "";

      const makeRadio = (label, value, checked) => {
        const labelEl = document.createElement("label");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "betflow-view-radio";
        input.value = value;
        input.checked = checked;
        labelEl.appendChild(input);
        labelEl.appendChild(document.createTextNode(label));
        input.addEventListener("change", () => {
          if (input.checked) {
            state.view = value;
            renderAll();
          }
        });
        return labelEl;
      };

      container.appendChild(makeRadio("柱状（月度）", "bar", state.view === "bar"));
      container.appendChild(makeRadio("折线（日级）", "line", state.view === "line"));
    }

    function renderChipGroup(cfg) {
      const {
        containerId,
        values,
        stateArray,
        max,
        getLabel,
        allowEmpty,
        specialAllNoBreakdown,
        collapseKey,
      } = cfg;

      const container = getDom(containerId);
      if (!container) return;

      const _values = (values || []).slice();
      container.innerHTML = "";

      // 1) “全选但不区分”
      if (specialAllNoBreakdown) {
        const labelEl = document.createElement("label");
        labelEl.className = "chip-special";

        const input = document.createElement("input");
        input.type = "checkbox";
        input.checked = !!state.collapse[collapseKey];

        labelEl.appendChild(input);
        labelEl.appendChild(document.createTextNode("全选但不区分"));

        if (input.checked) labelEl.classList.add("chip-active");

        input.addEventListener("change", () => {
          state.collapse[collapseKey] = !!input.checked;
          if (state.collapse[collapseKey]) {
            setArray(stateArray, _values);
          }
          renderAll();
        });

        container.appendChild(labelEl);
      }

      // 2) 普通 chips
      _values.forEach((v) => {
        const vv = v;
        const checked = stateArray.includes(vv);

        const labelEl = document.createElement("label");
        if (checked) labelEl.classList.add("chip-active");

        const input = document.createElement("input");
        input.type = "checkbox";
        input.checked = checked;

        labelEl.appendChild(input);
        labelEl.appendChild(document.createTextNode(getLabel ? getLabel(vv) : vv));

        input.addEventListener("change", () => {
          const exists = stateArray.includes(vv);

          if (input.checked && !exists) {
            // max===1 -> 单选
            if (max === 1) {
              setArray(stateArray, [vv]);
            } else if (max && max > 0 && stateArray.length >= max) {
              // 超过 max：不允许
              input.checked = false;
              return;
            } else {
              stateArray.push(vv);
            }
          }

          if (!input.checked && exists) {
            if (!allowEmpty && stateArray.length <= 1) {
              // 不允许清空
              input.checked = true;
              return;
            }
            const idx = stateArray.indexOf(vv);
            if (idx >= 0) stateArray.splice(idx, 1);
          }

          if (specialAllNoBreakdown && state.collapse[collapseKey]) {
            // 处于“不区分”时，强制全选
            setArray(stateArray, _values);
          }

          renderAll();
        });

        container.appendChild(labelEl);
      });
    }

    function filteredRowsForMonth(monthKey, extraFilterFn) {
      const RAW = getRAW();
      const rows = RAW[monthKey] || [];

      const countrySet = state.collapse.countries ? null : new Set(uniq(state.countries.map(normalizeCountry)));
      const mediaSet = state.collapse.medias ? null : new Set(uniq(state.medias.map(normalizeMedia)));
      const typeSet = state.collapse.productTypes
        ? null
        : new Set(uniq(state.productTypes.map(normalizeProductType)));

      return rows.filter((r) => {
        if (!r) return false;
        const c = normalizeCountry(r.country);
        const m = normalizeMedia(r.media);
        const p = normalizeProductType(r.productType);

        if (countrySet && !countrySet.has(c)) return false;
        if (mediaSet && !mediaSet.has(m)) return false;
        if (typeSet && !typeSet.has(p)) return false;

        if (extraFilterFn && !extraFilterFn(r)) return false;
        return true;
      });
    }

    function renderBar() {
      const palette = getPalette();
      const monthsSel = uniq(state.months).sort().slice(0, 3);
      const windowsSel = uniq(state.windows)
        .filter((w) => w === "D0" || w === "D7")
        .sort((a, b) => (a === "D0" ? -1 : 1));

      const metricCfg = getMetricConfig(state.metric[0]);
      let countriesAxis = sortCountries(uniq(state.countries.map(normalizeCountry)));
      if (state.collapse.countries) countriesAxis = ["ALL"];

      const series = [];
      monthsSel.forEach((monthKey, mi) => {
        const color = palette[mi % palette.length];
        const mLabel = formatMonthLabel(monthKey);

        windowsSel.forEach((win) => {
          const flowField = win === "D7" ? metricCfg.d7Flow : metricCfg.d0Flow;
          const userField = win === "D7" ? metricCfg.d7User : metricCfg.d0User;

          const seriesName = `${mLabel} ${win}`;
          const data = countriesAxis.map((countryKey) => {
            const rows = filteredRowsForMonth(monthKey, (r) => {
              if (state.collapse.countries) return true;
              return normalizeCountry(r.country) === countryKey;
            });
            const sums = sumFields(rows, [flowField, userField]);
            return safeDiv(sums[flowField], sums[userField]);
          });

          series.push({
            name: seriesName,
            type: "bar",
            data,
            barMaxWidth: 26,
            itemStyle: {
              color,
              decal: win === "D7" ? D7_DECAL : null,
            },
            emphasis: { focus: "series" },
          });
        });
      });

      const option = {
        grid: { left: 54, right: 22, top: 28, bottom: 48 },
        legend: { top: 0, type: "scroll" },
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
          backgroundColor: "rgba(15, 23, 42, 0.92)",
          borderWidth: 0,
          textStyle: { fontSize: 11 },
          formatter: (params) => {
            if (!params || !params.length) return "";
            const title = params[0].axisValueLabel;
            const lines = [`<strong>${title}</strong>`];
            params.forEach((p) => {
              lines.push(`${p.seriesName}：${formatUSD(p.data, 2)}`);
            });
            return lines.join("<br/>");
          },
        },
        xAxis: {
          type: "category",
          data: countriesAxis,
          axisLabel: { color: "#475569" },
          axisTick: { alignWithLabel: true },
        },
        yAxis: {
          type: "value",
          axisLabel: {
            color: "#475569",
            formatter: (v) => formatUSD(Number(v), 2),
          },
          splitLine: { lineStyle: { color: "rgba(148, 163, 184, 0.28)" } },
        },
        series,
      };

      chart.setOption(option, true);
    }

    function renderLine() {
      const RAW = getRAW();
      const palette = getPalette();

      const monthsSel = uniq(state.months).sort().slice(0, 3);
      const windowsSel = uniq(state.windows)
        .filter((w) => w === "D0" || w === "D7")
        .sort((a, b) => (a === "D0" ? -1 : 1));

      const metricCfg = getMetricConfig(state.metric[0]);

      const countrySet = state.collapse.countries ? null : new Set(uniq(state.countries.map(normalizeCountry)));
      const mediaSet = state.collapse.medias ? null : new Set(uniq(state.medias.map(normalizeMedia)));
      const typeSet = state.collapse.productTypes ? null : new Set(uniq(state.productTypes.map(normalizeProductType)));

      const byBase = {};
      const datesSet = new Set();

      monthsSel.forEach((monthKey) => {
        (RAW[monthKey] || []).forEach((r) => {
          if (!r) return;

          const c0 = normalizeCountry(r.country);
          const m0 = normalizeMedia(r.media);
          const p0 = normalizeProductType(r.productType);

          if (countrySet && !countrySet.has(c0)) return;
          if (mediaSet && !mediaSet.has(m0)) return;
          if (typeSet && !typeSet.has(p0)) return;

          const d = r.date;
          if (!d) return;

          const c = state.collapse.countries ? "ALL" : c0;
          const m = state.collapse.medias ? "ALL" : m0;
          const p = state.collapse.productTypes ? "ALL" : p0;

          const baseKey = `${c}|${m}|${p}`;
          if (!byBase[baseKey]) byBase[baseKey] = {};
          if (!byBase[baseKey][d]) byBase[baseKey][d] = { d0Flow: 0, d0User: 0, d7Flow: 0, d7User: 0 };

          const bucket = byBase[baseKey][d];

          const d0f = Number(r[metricCfg.d0Flow]);
          if (isFinite(d0f)) bucket.d0Flow += d0f;

          const d0u = Number(r[metricCfg.d0User]);
          if (isFinite(d0u)) bucket.d0User += d0u;

          const d7f = Number(r[metricCfg.d7Flow]);
          if (isFinite(d7f)) bucket.d7Flow += d7f;

          const d7u = Number(r[metricCfg.d7User]);
          if (isFinite(d7u)) bucket.d7User += d7u;

          datesSet.add(d);
        });
      });

      const dates = Array.from(datesSet).sort();
      const baseKeys = Object.keys(byBase).sort();
      const series = [];

      function seriesNameFromBase(baseKey, win) {
        const parts = baseKey.split("|");
        const c = parts[0] || "ALL";
        const m = parts[1] || "ALL";
        const p = parts[2] || "all";

        const nameParts = [];
        if (!state.collapse.countries) nameParts.push(c);
        if (!state.collapse.medias) nameParts.push(m);
        if (!state.collapse.productTypes) nameParts.push(String(p).toUpperCase());
        nameParts.push(win);

        return nameParts.join(" · ");
      }

      baseKeys.forEach((baseKey, idx) => {
        const color = palette[idx % palette.length];

        windowsSel.forEach((win) => {
          const data = dates.map((d) => {
            const bucket = byBase[baseKey][d];
            if (!bucket) return null;
            return win === "D7" ? safeDiv(bucket.d7Flow, bucket.d7User) : safeDiv(bucket.d0Flow, bucket.d0User);
          });

          series.push({
            name: seriesNameFromBase(baseKey, win),
            type: "line",
            smooth: false,
            symbol: "circle",
            symbolSize: 5,
            showSymbol: false,
            data,
            connectNulls: true,
            lineStyle: { width: 2, type: win === "D7" ? "dashed" : "solid", color },
            itemStyle: { color },
            emphasis: { focus: "series" },
          });
        });
      });

      const option = {
        grid: { left: 54, right: 22, top: 28, bottom: 58 },
        legend: { top: 0, type: "scroll" },
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(15, 23, 42, 0.92)",
          borderWidth: 0,
          textStyle: { fontSize: 11 },
          axisPointer: { type: "line" },
          formatter: (params) => {
            if (!params || !params.length) return "";
            const title = params[0].axisValueLabel;
            const lines = [`<strong>${title}</strong>`];
            params.forEach((p) => {
              lines.push(`${p.seriesName}：${formatUSD(p.data, 2)}`);
            });
            return lines.join("<br/>");
          },
        },
        xAxis: {
          type: "category",
          data: dates,
          boundaryGap: false,
          axisLabel: {
            color: "#475569",
            formatter: (v) => {
              // YYYY-MM-DD -> MM-DD
              const s = String(v || "");
              const parts = s.split("-");
              if (parts.length >= 3) return `${parts[1]}-${parts[2]}`;
              return s;
            },
          },
        },
        yAxis: {
          type: "value",
          axisLabel: {
            color: "#475569",
            formatter: (v) => formatUSD(Number(v), 2),
          },
          splitLine: { lineStyle: { color: "rgba(148, 163, 184, 0.28)" } },
        },
        series,
      };

      chart.setOption(option, true);
    }

    function renderTable() {
      if (!tableEl) return;

      const monthsSel = uniq(state.months).sort().slice(0, 3);
      const windowsSel = uniq(state.windows)
        .filter((w) => w === "D0" || w === "D7")
        .sort((a, b) => (a === "D0" ? -1 : 1));

      const metricCfg = getMetricConfig(state.metric[0]);

      let rowCountries = sortCountries(uniq(state.countries.map(normalizeCountry)));
      if (state.collapse.countries) rowCountries = ["ALL"];

      const rowMedias = state.collapse.medias ? ["ALL"] : uniq(state.medias.map(normalizeMedia)).sort();
      const rowTypes = state.collapse.productTypes ? ["ALL"] : uniq(state.productTypes.map(normalizeProductType)).sort();

      const suffix = buildTitleSuffix();
      if (tableTitleEl) tableTitleEl.textContent = `当前筛选 · D0/D7 人均${metricCfg.label}${suffix}`;

      const thead = document.createElement("thead");
      const trh = document.createElement("tr");

      trh.appendChild(th("国家"));
      if (!state.collapse.medias) trh.appendChild(th("媒体"));
      if (!state.collapse.productTypes) trh.appendChild(th("产品类型"));

      const colKeys = [];
      monthsSel.forEach((m) => {
        windowsSel.forEach((w) => {
          colKeys.push({ m, w });
          trh.appendChild(th(`${formatMonthLabel(m)} ${w} 人均${metricCfg.label}`));
        });
      });

      thead.appendChild(trh);

      const cellCache = {};
      function getCell(monthKey, win, countryKey, mediaKey, typeKey) {
        const cacheKey = `${monthKey}|${win}|${countryKey}|${mediaKey}|${typeKey}|${metricCfg.key}`;
        if (cellCache[cacheKey] !== undefined) return cellCache[cacheKey];

        const flowField = win === "D7" ? metricCfg.d7Flow : metricCfg.d0Flow;
        const userField = win === "D7" ? metricCfg.d7User : metricCfg.d0User;

        const rows = filteredRowsForMonth(monthKey, (r) => {
          if (!state.collapse.countries && countryKey !== "ALL") {
            if (normalizeCountry(r.country) !== countryKey) return false;
          }
          if (!state.collapse.medias && mediaKey !== "ALL") {
            if (normalizeMedia(r.media) !== mediaKey) return false;
          }
          if (!state.collapse.productTypes && typeKey !== "ALL") {
            if (normalizeProductType(r.productType) !== typeKey) return false;
          }
          return true;
        });

        const sums = sumFields(rows, [flowField, userField]);
        const ratio = safeDiv(sums[flowField], sums[userField]);

        cellCache[cacheKey] = ratio;
        return ratio;
      }

      const tbody = document.createElement("tbody");

      rowCountries.forEach((c) => {
        rowMedias.forEach((m) => {
          rowTypes.forEach((p) => {
            const tr = document.createElement("tr");

            tr.appendChild(td(c));
            if (!state.collapse.medias) tr.appendChild(td(m));
            if (!state.collapse.productTypes) tr.appendChild(td(String(p).toUpperCase()));

            colKeys.forEach((ck) => {
              const val = getCell(ck.m, ck.w, c, m, p);
              const cell = td(formatUSD(val, 2));
              cell.className = "num";
              tr.appendChild(cell);
            });

            tbody.appendChild(tr);
          });
        });
      });

      tableEl.innerHTML = "";
      tableEl.appendChild(thead);
      tableEl.appendChild(tbody);
    }

    function th(text) {
      const el = document.createElement("th");
      el.textContent = text;
      return el;
    }

    function td(text) {
      const el = document.createElement("td");
      el.textContent = text;
      return el;
    }

    function renderAll() {
      ensureNonEmpty(state, opts);

      state.months = uniq(state.months).sort().slice(0, 3);
      state.countries = sortCountries(uniq(state.countries.map(normalizeCountry)));
      state.medias = uniq(state.medias.map(normalizeMedia)).sort();
      state.productTypes = uniq(state.productTypes.map(normalizeProductType)).sort();
      state.metric = uniq(state.metric).filter((k) => METRIC_OPTIONS.some((x) => x.key === k)).slice(0, 1);
      state.windows = uniq(state.windows)
        .filter((w) => w === "D0" || w === "D7")
        .sort((a, b) => (a === "D0" ? -1 : 1));

      // “全选但不区分” -> 选择强制全选（并在图/表里聚合）
      if (state.collapse.countries) state.countries = (opts.countries || []).slice();
      if (state.collapse.medias) state.medias = (opts.medias || []).slice();
      if (state.collapse.productTypes) state.productTypes = (opts.productTypes || []).slice();

      if (!state.metric.length) state.metric = ["total"];
      if (!state.windows.length) state.windows = ["D0", "D7"];

      renderRadioView();

      renderChipGroup({
        containerId: "betflow-months",
        values: opts.months,
        stateArray: state.months,
        max: 3,
        getLabel: (v) => formatMonthLabel(v),
        allowEmpty: false,
        specialAllNoBreakdown: false,
      });

      renderChipGroup({
        containerId: "betflow-countries",
        values: opts.countries,
        stateArray: state.countries,
        max: 0,
        getLabel: (v) => v,
        allowEmpty: false,
        specialAllNoBreakdown: true,
        collapseKey: "countries",
      });

      renderChipGroup({
        containerId: "betflow-medias",
        values: opts.medias,
        stateArray: state.medias,
        max: 0,
        getLabel: (v) => v,
        allowEmpty: false,
        specialAllNoBreakdown: true,
        collapseKey: "medias",
      });

      renderChipGroup({
        containerId: "betflow-productTypes",
        values: opts.productTypes,
        stateArray: state.productTypes,
        max: 0,
        getLabel: (v) => String(v).toUpperCase(),
        allowEmpty: false,
        specialAllNoBreakdown: true,
        collapseKey: "productTypes",
      });

      renderChipGroup({
        containerId: "betflow-metric",
        values: METRIC_OPTIONS.map((x) => x.key),
        stateArray: state.metric,
        max: 1,
        getLabel: (v) => (METRIC_OPTIONS.find((x) => x.key === v) || {}).label || v,
        allowEmpty: false,
        specialAllNoBreakdown: false,
      });

      renderChipGroup({
        containerId: "betflow-windows",
        values: ["D0", "D7"],
        stateArray: state.windows,
        max: 0,
        getLabel: (v) => v,
        allowEmpty: false,
        specialAllNoBreakdown: false,
      });

      const resetBtn = getDom("betflow-btn-reset");
      if (resetBtn && !resetBtn.__bound) {
        resetBtn.__bound = true;
        resetBtn.addEventListener("click", () => {
          resetState();
          renderAll();
        });
      }

      if (state.view === "bar") renderBar();
      else renderLine();

      renderTable();
    }

    renderAll();
  }

  if (window.PaidDashboard && typeof window.PaidDashboard.registerModule === "function") {
    window.PaidDashboard.registerModule(MODULE_KEY, init);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
