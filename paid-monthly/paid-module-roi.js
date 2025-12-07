/**
 * paid-module-roi.js
 * ------------------------------------------------------------
 * 模块：D0/D7 充值 ROI（%）
 *
 * 数据源：window.RAW_PAID_BY_MONTH
 * 粒度：date(UTC+0) × country × media × productType
 *
 * 公式：
 * - D0 ROI = D0_PURCHASE_VALUE / spent
 * - D7 ROI = D7_PURCHASE_VALUE / spent
 *
 * 交互：
 * - 视图：柱状（月度汇总）/ 折线（日级）
 * - 月份：最多选 3 个
 * - 国家/媒体/产品形态：多选，且支持“全选但不区分”（等价全选，但图/表聚合不拆维度）
 * - D0/D7：多选
 *
 * 需要 index.html 提供这些容器 id（如果没有，本脚本会自动在 card-paid-roi 区块内创建）：
 * - roi-view / roi-months / roi-windows / roi-countries / roi-medias / roi-productTypes
 * - chart-paid-roi / table-title-roi / table-roi
 */

(function () {
  const MODULE_KEY = "roi";

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
        return String(aa).localeCompare(String(bb));
      });
  }

  function buildOptionsFromRAW() {
    const RAW = getRAW();
    const months = Object.keys(RAW).sort();

    const cSet = new Set();
    const mSet = new Set();
    const pSet = new Set();

    months.forEach((month) => {
      (RAW[month] || []).forEach((r) => {
        if (!r) return;
        if (r.country) cSet.add(normalizeCountry(r.country));
        if (r.media) mSet.add(normalizeMedia(r.media));
        if (r.productType) pSet.add(normalizeProductType(r.productType));
      });
    });

    // 只保留 GH/KE/NG/TZ（按需求）
    const countries = sortCountries(Array.from(cSet)).filter(
      (c) => FIXED_COUNTRY_ORDER.indexOf(c) !== -1
    );
    const medias = Array.from(mSet).sort();
    const productTypes = Array.from(pSet).sort();

    return { months, countries, medias, productTypes };
  }

  function pickDefaultMonths(allMonths) {
    const months = (allMonths || []).slice();
    if (!months.length) return [];
    // 默认取最近 2 个月（不够就取 1 个）
    return months.slice(Math.max(0, months.length - 2));
  }

  function ensureNonEmpty(state, opts) {
    if (!state.months.length) state.months = pickDefaultMonths(opts.months);
    if (!state.months.length) state.months = (opts.months || []).slice(-1);

    if (!state.countries.length) state.countries = (opts.countries || []).slice();
    if (!state.medias.length) state.medias = (opts.medias || []).slice();
    if (!state.productTypes.length) state.productTypes = (opts.productTypes || []).slice();

    if (!state.windows.length) state.windows = ["D0", "D7"];
  }

  function safeDiv(a, b) {
    const na = Number(a);
    const nb = Number(b);
    if (!isFinite(na) || !isFinite(nb) || nb === 0) return null;
    return na / nb;
  }

  function formatPct01(ratio, digits) {
    if (ratio === null || ratio === undefined || !isFinite(Number(ratio))) return "-";
    return (Number(ratio) * 100).toFixed(digits) + "%";
  }

  function formatMonthLabel(monthKey) {
    const m = String(monthKey || "");
    const mm = m.split("-")[1];
    if (!mm) return m;
    const n = parseInt(mm, 10);
    if (!isFinite(n)) return m;
    return `${n}月`;
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
    const STYLE_ID = "paid-roi-module-style";
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
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
        grid-template-columns: 68px minmax(0, 1fr);
      }

      .chart-table-section{
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px dashed rgba(148, 163, 184, 0.5);
      }
      .chart-table-title{
        font-size: 11px;
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
      getDom("roi-view") ||
      getDom("roi-months") ||
      getDom("roi-countries") ||
      getDom("roi-medias") ||
      getDom("roi-productTypes") ||
      getDom("roi-windows");
    if (any) return;

    const header = sectionEl.querySelector(".chart-card-header");

    const panel = document.createElement("div");
    panel.className = "chart-filter-panel";
    panel.id = "roi-filter-panel";
    panel.innerHTML = `
      <div class="hero-filter-row">
        <div class="label">视图</div>
        <div class="chart-mini-radio" id="roi-view"></div>
      </div>

      <div class="hero-filter-row">
        <div class="label">月份</div>
        <div class="chart-mini-chips" id="roi-months"></div>
      </div>

      <div class="hero-filter-row">
        <div class="label">国家</div>
        <div class="chart-mini-chips" id="roi-countries"></div>
      </div>

      <div class="hero-filter-row">
        <div class="label">媒体</div>
        <div class="chart-mini-chips" id="roi-medias"></div>
      </div>

      <div class="hero-filter-row">
        <div class="label">产品</div>
        <div class="chart-mini-chips" id="roi-productTypes"></div>
      </div>

      <div class="hero-filter-row">
        <div class="label">口径</div>
        <div class="chart-mini-chips" id="roi-windows"></div>
      </div>

      <div style="display:flex;justify-content:flex-end;gap:8px;">
        <button type="button" class="btn" id="roi-btn-reset">全选 / 重置</button>
      </div>
    `;

    if (header && header.parentNode) header.parentNode.insertBefore(panel, header.nextSibling);
  }

  function createTableFallbackAfter(chartEl) {
    const section = document.createElement("div");
    section.className = "chart-table-section";
    section.id = "table-section-roi";
    section.innerHTML = `
      <div class="chart-table-title" id="table-title-roi"></div>
      <div class="chart-table-wrapper">
        <table id="table-roi" class="chart-table"></table>
      </div>
    `;

    if (chartEl && chartEl.parentNode) {
      chartEl.parentNode.insertBefore(section, chartEl.nextSibling);
    }
  }

  function init() {
    injectStylesOnce();

    const chartEl = getDom("chart-paid-roi") || getDom("chart-roi");
    if (!chartEl || !window.echarts) return;

    const sectionEl =
      (chartEl.closest && chartEl.closest(".chart-card")) ||
      getDom("card-paid-roi") ||
      chartEl.parentNode;

    createFilterPanelFallback(sectionEl);

    let tableTitleEl = getDom("table-title-roi");
    let tableEl = getDom("table-roi");
    if (!tableEl) {
      createTableFallbackAfter(chartEl);
      tableTitleEl = getDom("table-title-roi");
      tableEl = getDom("table-roi");
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
      windows: ["D0", "D7"],
      collapse: { countries: false, medias: false, productTypes: false },
    };

    function resetState() {
      state.view = "bar";
      state.months = pickDefaultMonths(opts.months);
      state.countries = (opts.countries || []).slice();
      state.medias = (opts.medias || []).slice();
      state.productTypes = (opts.productTypes || []).slice();
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
      const container = getDom("roi-view");
      if (!container) return;
      container.innerHTML = "";

      const makeRadio = (label, value, checked) => {
        const labelEl = document.createElement("label");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "roi-view-radio";
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

      if (specialAllNoBreakdown) {
        const labelEl = document.createElement("label");
        labelEl.className = "filter-chip";

        const input = document.createElement("input");
        input.type = "checkbox";
        input.checked = !!state.collapse[collapseKey];

        labelEl.appendChild(input);
        labelEl.appendChild(document.createTextNode("全选但不区分"));
        labelEl.classList.toggle("filter-chip-active", input.checked);

        input.addEventListener("change", () => {
          state.collapse[collapseKey] = input.checked;
          if (input.checked) setArray(stateArray, _values);
          if (!stateArray.length) setArray(stateArray, _values);
          renderAll();
        });

        container.appendChild(labelEl);
      }

      _values.forEach((value, idx) => {
        const labelEl = document.createElement("label");
        labelEl.className = "filter-chip";

        const input = document.createElement("input");
        input.type = "checkbox";
        input.value = value;

        const selected = stateArray.indexOf(value) !== -1;
        input.checked = selected;
        labelEl.classList.toggle("filter-chip-active", selected);

        labelEl.appendChild(input);
        labelEl.appendChild(
          document.createTextNode(typeof getLabel === "function" ? getLabel(value, idx) : value)
        );

        input.addEventListener("change", () => {
          const existsIndex = stateArray.indexOf(value);

          if (input.checked) {
            if (max === 1) {
              setArray(stateArray, [value]);
            } else if (max && stateArray.length >= max && existsIndex === -1) {
              input.checked = false;
              return;
            } else {
              if (existsIndex === -1) stateArray.push(value);
            }
          } else {
            if (existsIndex !== -1) stateArray.splice(existsIndex, 1);
            if (!allowEmpty && stateArray.length === 0) {
              stateArray.push(value);
              input.checked = true;
            }
          }

          if (specialAllNoBreakdown && state.collapse[collapseKey]) {
            setArray(stateArray, _values);
          }

          renderAll();
        });

        container.appendChild(labelEl);
      });
    }

    function filteredRowsForMonth(monthKey, extra) {
      const RAW = getRAW();
      const rows = (RAW[monthKey] || []).slice();

      const countrySet = state.collapse.countries
        ? null
        : new Set(uniq(state.countries.map(normalizeCountry)));
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

        if (extra && typeof extra === "function") return !!extra(r);
        return true;
      });
    }

    function renderBar() {
      const palette = getPalette();

      const monthsSel = uniq(state.months).sort().slice(0, 3);
      const windowsSel = uniq(state.windows)
        .filter((w) => w === "D0" || w === "D7")
        .sort((a, b) => (a === "D0" ? -1 : 1));

      let countriesAxis = sortCountries(uniq(state.countries.map(normalizeCountry)));
      if (state.collapse.countries) countriesAxis = ["ALL"];

      const series = [];
      monthsSel.forEach((monthKey, mi) => {
        const color = palette[mi % palette.length];
        const mLabel = formatMonthLabel(monthKey);

        windowsSel.forEach((win) => {
          const purchaseField = win === "D7" ? "D7_PURCHASE_VALUE" : "D0_PURCHASE_VALUE";
          const seriesName = `${mLabel} ${win}`;

          const data = countriesAxis.map((countryKey) => {
            const rows = filteredRowsForMonth(monthKey, (r) => {
              if (state.collapse.countries) return true;
              return normalizeCountry(r.country) === countryKey;
            });
            const sums = sumFields(rows, ["spent", purchaseField]);
            return safeDiv(sums[purchaseField], sums.spent);
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
              lines.push(`${p.seriesName}：${formatPct01(p.data, 1)}`);
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
            formatter: (v) => formatPct01(Number(v), 0),
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

      const countrySet = state.collapse.countries
        ? null
        : new Set(uniq(state.countries.map(normalizeCountry)));
      const mediaSet = state.collapse.medias ? null : new Set(uniq(state.medias.map(normalizeMedia)));
      const typeSet = state.collapse.productTypes
        ? null
        : new Set(uniq(state.productTypes.map(normalizeProductType)));

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
          if (!byBase[baseKey][d]) byBase[baseKey][d] = { spent: 0, d0: 0, d7: 0 };

          const bucket = byBase[baseKey][d];

          const spent = Number(r.spent);
          if (isFinite(spent)) bucket.spent += spent;

          const d0v = Number(r.D0_PURCHASE_VALUE);
          if (isFinite(d0v)) bucket.d0 += d0v;

          const d7v = Number(r.D7_PURCHASE_VALUE);
          if (isFinite(d7v)) bucket.d7 += d7v;

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
            const pv = win === "D7" ? bucket.d7 : bucket.d0;
            return safeDiv(pv, bucket.spent);
          });

          series.push({
            name: seriesNameFromBase(baseKey, win),
            type: "line",
            data,
            showSymbol: false,
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
              lines.push(`${p.seriesName}：${formatPct01(p.data, 2)}`);
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
              const s = String(v || "");
              return s.length >= 10 ? s.slice(5) : s;
            },
          },
        },
        yAxis: {
          type: "value",
          axisLabel: {
            color: "#475569",
            formatter: (v) => formatPct01(Number(v), 0),
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

      let rowCountries = sortCountries(uniq(state.countries.map(normalizeCountry)));
      if (state.collapse.countries) rowCountries = ["ALL"];

      const rowMedias = state.collapse.medias ? ["ALL"] : uniq(state.medias.map(normalizeMedia)).sort();
      const rowTypes = state.collapse.productTypes ? ["ALL"] : uniq(state.productTypes.map(normalizeProductType)).sort();

      const suffix = buildTitleSuffix();
      if (tableTitleEl) tableTitleEl.textContent = `当前筛选 · D0/D7 充值 ROI（%）${suffix}`;

      const thead = document.createElement("thead");
      const trh = document.createElement("tr");

      trh.appendChild(th("国家"));
      if (!state.collapse.medias) trh.appendChild(th("媒体"));
      if (!state.collapse.productTypes) trh.appendChild(th("产品"));

      const colKeys = [];
      monthsSel.forEach((m) => {
        windowsSel.forEach((w) => {
          colKeys.push({ m, w });
          trh.appendChild(th(`${formatMonthLabel(m)} ${w} ROI`));
        });
      });

      thead.appendChild(trh);

      const cellCache = {};
      function getCell(monthKey, win, countryKey, mediaKey, typeKey) {
        const cacheKey = `${monthKey}|${win}|${countryKey}|${mediaKey}|${typeKey}`;
        if (cellCache[cacheKey] !== undefined) return cellCache[cacheKey];

        const purchaseField = win === "D7" ? "D7_PURCHASE_VALUE" : "D0_PURCHASE_VALUE";

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

        const sums = sumFields(rows, ["spent", purchaseField]);
        const ratio = safeDiv(sums[purchaseField], sums.spent);

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
              const ratio = getCell(ck.m, ck.w, c, m, p);
              const cell = td(formatPct01(ratio, 1));
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
      state.windows = uniq(state.windows)
        .filter((w) => w === "D0" || w === "D7")
        .sort((a, b) => (a === "D0" ? -1 : 1));

      if (!state.months.length) state.months = pickDefaultMonths(opts.months);
      if (!state.windows.length) state.windows = ["D0"];

      renderRadioView();

      renderChipGroup({
        containerId: "roi-months",
        values: opts.months,
        stateArray: state.months,
        max: 3,
        getLabel: (v) => formatMonthLabel(v),
        allowEmpty: false,
        specialAllNoBreakdown: false,
      });

      renderChipGroup({
        containerId: "roi-windows",
        values: ["D0", "D7"],
        stateArray: state.windows,
        max: 0,
        getLabel: (v) => v,
        allowEmpty: false,
        specialAllNoBreakdown: false,
      });

      renderChipGroup({
        containerId: "roi-countries",
        values: opts.countries,
        stateArray: state.countries,
        max: 0,
        getLabel: (v) => v,
        allowEmpty: false,
        specialAllNoBreakdown: true,
        collapseKey: "countries",
      });

      renderChipGroup({
        containerId: "roi-medias",
        values: opts.medias,
        stateArray: state.medias,
        max: 0,
        getLabel: (v) => v,
        allowEmpty: false,
        specialAllNoBreakdown: true,
        collapseKey: "medias",
      });

      renderChipGroup({
        containerId: "roi-productTypes",
        values: opts.productTypes,
        stateArray: state.productTypes,
        max: 0,
        getLabel: (v) => String(v).toUpperCase(),
        allowEmpty: false,
        specialAllNoBreakdown: true,
        collapseKey: "productTypes",
      });

      const resetBtn = getDom("roi-btn-reset");
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
