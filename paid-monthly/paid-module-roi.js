/**
 * paid-module-roi.js
 * ------------------------------------------------------------
 * 模块6：D0/D7 充值 ROI（单位：%）
 * 公式：
 *   - D0 ROI = D0_PURCHASE_VALUE / spent
 *   - D7 ROI = D7_PURCHASE_VALUE / spent
 *
 * 数据源：window.RAW_PAID_BY_MONTH（由 paid-data.js 注入）
 * 维度：date × country × media × productType（行级为“日”）
 *
 * 交互：
 * - 月份：最多选 3 个
 * - 国家/媒体/产品类型：支持「全选但不区分」（= 全选 + 图/表不拆维度）
 * - 图形：月度柱状图 / 日级折线图
 * - D0/D7：多选（D7 柱加阴影、折线为虚线）
 */

(function () {
  "use strict";

  const MODULE_KEY = "roi";
  const CARD_ID = "card-paid-roi";
  const CHART_ID = "chart-paid-roi";

  // ROI 模块柱状图国家顺序：GH/KE/NG/TZ
  const COUNTRY_ORDER = ["GH", "KE", "NG", "TZ"];
  const MAX_MONTHS = 3;

  const FALLBACK_COLORS = [
    "#2563eb",
    "#16a34a",
    "#f97316",
    "#7c3aed",
    "#ef4444",
    "#0f766e",
    "#0ea5e9",
    "#64748b",
  ];

  function getPalette() {
    const pd = window.PaidDashboard;
    if (pd && Array.isArray(pd.COLORS) && pd.COLORS.length) return pd.COLORS;
    return FALLBACK_COLORS;
  }

  function safeNum(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  function safeDiv(num, den) {
    const a = Number(num);
    const b = Number(den);
    if (!Number.isFinite(a) || !Number.isFinite(b) || b <= 0) return null;
    return a / b;
  }

  function uniq(arr) {
    const s = new Set();
    const out = [];
    (arr || []).forEach((v) => {
      const k = String(v);
      if (!s.has(k)) {
        s.add(k);
        out.push(k);
      }
    });
    return out;
  }

  function lowerToken(v) {
    return String(v || "").trim().toLowerCase();
  }

  function normalizeProductType(v) {
    const t = lowerToken(v);
    if (t === "h5") return "h5";
    if (t === "app") return "app";
    return t || "unknown";
  }

  function displayProductType(v) {
    // 统一展示小写
    return normalizeProductType(v);
  }

  function monthLabel(ym) {
    // "2025-09" -> "9月"
    const m = String(ym || "").split("-")[1];
    const mm = Number(m);
    if (!Number.isFinite(mm)) return String(ym || "");
    return mm + "月";
  }

  function pctLabel(ratio, digits) {
    const n = Number(ratio);
    if (!Number.isFinite(n)) return "-";
    const d = Number.isFinite(digits) ? digits : 2;
    return (n * 100).toFixed(d) + "%";
  }

  function parseYM(ym) {
    const parts = String(ym || "").split("-");
    const y = Number(parts[0]);
    const m = Number(parts[1]);
    if (!Number.isFinite(y) || !Number.isFinite(m)) return null;
    return { y, m };
  }

  function dateUTC(y, m, d) {
    return new Date(Date.UTC(y, m - 1, d));
  }

  function addDaysUTC(dt, n) {
    return new Date(dt.getTime() + n * 86400000);
  }

  function fmtDateUTC(dt) {
    const y = dt.getUTCFullYear();
    const m = String(dt.getUTCMonth() + 1).padStart(2, "0");
    const d = String(dt.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function monthRangeUTC(ym) {
    const p = parseYM(ym);
    if (!p) return null;
    const start = dateUTC(p.y, p.m, 1);
    // last day of month: Date.UTC(y, m, 0) where m is 1-based month number
    const end = new Date(Date.UTC(p.y, p.m, 0));
    return { start, end };
  }

  function buildDateAxis(months) {
    if (!months || !months.length) return [];
    const sorted = months.slice().sort();
    const first = monthRangeUTC(sorted[0]);
    const last = monthRangeUTC(sorted[sorted.length - 1]);
    if (!first || !last) return [];

    const out = [];
    let d = first.start;
    while (d.getTime() <= last.end.getTime()) {
      out.push(fmtDateUTC(d));
      d = addDaysUTC(d, 1);
    }
    return out;
  }

  function getRaw() {
    return window.RAW_PAID_BY_MONTH || {};
  }

  function getAllMonths(raw) {
    return Object.keys(raw || {}).sort();
  }

  function collectDistinct(raw) {
    const countries = new Set();
    const medias = new Set();
    const products = new Set();

    Object.keys(raw || {}).forEach((m) => {
      (raw[m] || []).forEach((r) => {
        if (!r) return;
        if (r.country) countries.add(String(r.country).trim());
        if (r.media) medias.add(String(r.media).trim());
        if (r.productType) products.add(normalizeProductType(r.productType));
      });
    });

    const countryList = Array.from(countries);
    countryList.sort((a, b) => {
      const ia = COUNTRY_ORDER.indexOf(a);
      const ib = COUNTRY_ORDER.indexOf(b);
      if (ia !== -1 || ib !== -1) {
        if (ia === -1) return 1;
        if (ib === -1) return -1;
        return ia - ib;
      }
      return a.localeCompare(b);
    });

    const mediaList = Array.from(medias).sort((a, b) => a.localeCompare(b));
    const productList = Array.from(products).sort((a, b) => a.localeCompare(b));

    return { countries: countryList, medias: mediaList, products: productList };
  }

  function ensureStylesOnce() {
    if (document.getElementById("paid-shared-table-style")) return;

    const style = document.createElement("style");
    style.id = "paid-shared-table-style";
    style.textContent = `
      /* ===== 表格（沿用 organic-monthly 风格） ===== */
      .chart-table-section{
        margin-top:6px;
        padding: 10px 16px 14px;
        border-top: 1px dashed rgba(148,163,184,0.5);
      }
      .chart-table-title{
        display:flex; align-items:center; justify-content:space-between;
        gap:10px;
        font-size:11px;
        color: rgba(71,85,105,1);
        margin-bottom:6px;
      }
      .chart-table-title strong{ color: rgba(15,23,42,1); font-weight:600; }
      .chart-table-wrap{
        width:100%;
        overflow:auto;
        border: 1px solid rgba(148,163,184,0.35);
        border-radius: 12px;
        background: rgba(255,255,255,0.92);
      }
      table.chart-table{
        width:100%;
        border-collapse:collapse;
        font-size:11px;
      }
      .chart-table thead th, .chart-table tbody td{
        padding: 6px 10px;
        border-bottom: 1px solid rgba(243,244,246,1);
        white-space:nowrap;
      }
      .chart-table thead th{
        position: sticky;
        top:0;
        background: rgba(249,250,251,0.96);
        z-index: 2;
        color: rgba(71,85,105,1);
        font-weight:600;
      }
      .chart-table tbody tr:hover td{
        background: rgba(37,99,235,0.06);
      }
      .muted{ color: rgba(100,116,139,1); }

      /* ===== 模块内筛选器面板 ===== */
      .paid-module-filter-panel{
        padding: 10px 16px 10px;
        border-bottom: 1px dashed rgba(148,163,184,0.45);
        background: rgba(255,255,255,0.65);
      }
      .paid-module-filter-grid{
        display:flex;
        flex-direction:column;
        gap:8px;
      }
      .paid-module-filter-row{
        display:flex;
        align-items:flex-start;
        justify-content:space-between;
        gap:10px;
        flex-wrap:wrap;
      }
      .paid-module-filter-row .chart-mini-label{ min-width: 78px; }
      .paid-module-filter-row .chart-mini-chips{ justify-content:flex-start; }
      .paid-module-slim-note{
        font-size: 10px;
        color: rgba(100,116,139,1);
        line-height: 1.4;
      }
      .filter-chip.filter-chip-disabled{
        opacity:0.55;
        cursor:not-allowed;
      }
      .filter-chip.filter-chip-disabled input{ cursor:not-allowed; }
    `;
    document.head.appendChild(style);
  }

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach((k) => {
        if (k === "class") node.className = attrs[k];
        else if (k === "text") node.textContent = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    }
    (children || []).forEach((c) => {
      if (c === null || c === undefined) return;
      if (typeof c === "string") node.appendChild(document.createTextNode(c));
      else node.appendChild(c);
    });
    return node;
  }

  function createChip(label, checked, disabled, onChange) {
    const labelEl = el("label", {
      class:
        "filter-chip" +
        (checked ? " filter-chip-active" : "") +
        (disabled ? " filter-chip-disabled" : ""),
    });

    const input = el("input");
    input.type = "checkbox";
    input.checked = !!checked;
    input.disabled = !!disabled;

    input.addEventListener("change", () => {
      if (typeof onChange === "function") onChange(input.checked, input);
    });

    labelEl.appendChild(input);
    labelEl.appendChild(document.createTextNode(label));
    return labelEl;
  }

  function createRadio(name, label, checked, onChange) {
    const labelEl = el("label");
    const input = el("input");
    input.type = "radio";
    input.name = name;
    input.checked = !!checked;

    input.addEventListener("change", () => {
      if (!input.checked) return;
      if (typeof onChange === "function") onChange();
    });

    labelEl.appendChild(input);
    labelEl.appendChild(document.createTextNode(label));
    return labelEl;
  }

  function formatMediaLabel(v) {
    return lowerToken(v); // FB -> fb
  }

  function makeTableTitle(selectedMedias, selectedProducts, mergeMedias, mergeProducts) {
    const mLabel = mergeMedias
      ? "媒体全选不区分"
      : (selectedMedias || []).map(formatMediaLabel).join("+");
    const pLabel = mergeProducts
      ? "产品全选不区分"
      : (selectedProducts || []).map(displayProductType).join("+");
    const parts = [];
    if (mLabel) parts.push(mLabel);
    if (pLabel) parts.push(pLabel);
    return parts.length ? `（${parts.join("，")}）` : "";
  }

  function init() {
    const chartDom = document.getElementById(CHART_ID);
    if (!chartDom || !window.echarts) return;

    const cardEl =
      document.getElementById(CARD_ID) ||
      chartDom.closest(".chart-card") ||
      chartDom.parentElement;

    if (!cardEl) return;

    ensureStylesOnce();

    // 修正 badge：ROI 单位 %
    try {
      const badge = cardEl.querySelector(".chart-controls .chart-badge");
      if (badge) badge.textContent = "单位：%";
    } catch (e) {}

    const raw = getRaw();
    const allMonths = getAllMonths(raw);
    if (!allMonths.length) return;

    const { countries, medias, products } = collectDistinct(raw);

    // ===== state（模块内独立） =====
    const state = {
      months: allMonths.slice(-1), // 默认最近 1 个月
      countries: countries.slice(),
      medias: medias.slice(),
      products: products.slice(),
      windows: ["D0", "D7"],
      chartType: "bar",

      mergeCountries: false,
      mergeMedias: false,
      mergeProducts: false,

      _bkCountries: null,
      _bkMedias: null,
      _bkProducts: null,
    };

    function normalizeState() {
      // months
      state.months = uniq(state.months).sort();
      if (state.months.length > MAX_MONTHS) state.months = state.months.slice(0, MAX_MONTHS);
      if (!state.months.length) state.months = allMonths.slice(-1);

      // dims
      state.countries = uniq(state.countries);
      if (!state.countries.length) state.countries = countries.slice();

      state.medias = uniq(state.medias);
      if (!state.medias.length) state.medias = medias.slice();

      state.products = uniq(state.products.map(normalizeProductType));
      if (!state.products.length) state.products = products.slice();

      // windows
      state.windows = uniq(state.windows);
      if (!state.windows.length) state.windows = ["D0"];
    }

    // ===== UI containers =====
    const headerEl = cardEl.querySelector(".chart-card-header") || cardEl.querySelector("header");

    let filterPanel = cardEl.querySelector("#roi-filter-panel");
    if (!filterPanel) {
      filterPanel = el("div", { id: "roi-filter-panel", class: "paid-module-filter-panel" });
      if (headerEl) headerEl.insertAdjacentElement("afterend", filterPanel);
      else cardEl.insertBefore(filterPanel, chartDom);

      const grid = el("div", { class: "paid-module-filter-grid" });
      filterPanel.appendChild(grid);

      grid.appendChild(
        el("div", { class: "paid-module-filter-row chart-mini-filter" }, [
          el("span", { class: "chart-mini-label", text: "月份" }),
          el("div", { class: "chart-mini-chips", id: "roi-filter-months" }),
        ])
      );
      grid.appendChild(
        el("div", { class: "paid-module-filter-row chart-mini-filter" }, [
          el("span", { class: "chart-mini-label", text: "国家" }),
          el("div", { class: "chart-mini-chips", id: "roi-filter-countries" }),
        ])
      );
      grid.appendChild(
        el("div", { class: "paid-module-filter-row chart-mini-filter" }, [
          el("span", { class: "chart-mini-label", text: "媒体" }),
          el("div", { class: "chart-mini-chips", id: "roi-filter-medias" }),
        ])
      );
      grid.appendChild(
        el("div", { class: "paid-module-filter-row chart-mini-filter" }, [
          el("span", { class: "chart-mini-label", text: "产品类型" }),
          el("div", { class: "chart-mini-chips", id: "roi-filter-products" }),
        ])
      );
      grid.appendChild(
        el("div", { class: "paid-module-filter-row" }, [
          el("div", { class: "chart-mini-radio", id: "roi-filter-charttype" }),
          el("div", { class: "chart-mini-chips", id: "roi-filter-windows" }),
        ])
      );
      grid.appendChild(
        el("div", {
          class: "paid-module-slim-note",
          text: "提示：切到「日级折线图」时，媒体/产品类型会按线拆分；勾选「全选但不区分」则聚合展示。",
        })
      );
    }

    let tableSection = cardEl.querySelector("#roi-table-section");
    if (!tableSection) {
      tableSection = el("div", { id: "roi-table-section", class: "chart-table-section" });
      chartDom.insertAdjacentElement("afterend", tableSection);

      tableSection.appendChild(
        el("div", { class: "chart-table-title" }, [
          el("strong", { id: "roi-table-title", text: "数据表 · 充值ROI" }),
          el("span", { class: "muted", id: "roi-table-sub", text: "" }),
        ])
      );
      tableSection.appendChild(
        el("div", { class: "chart-table-wrap" }, [
          el("table", { class: "chart-table", id: "roi-table" }),
        ])
      );
    }

    const domMonths = document.getElementById("roi-filter-months");
    const domCountries = document.getElementById("roi-filter-countries");
    const domMedias = document.getElementById("roi-filter-medias");
    const domProducts = document.getElementById("roi-filter-products");
    const domChartType = document.getElementById("roi-filter-charttype");
    const domWindows = document.getElementById("roi-filter-windows");

    // ===== chart init =====
    const chart = echarts.init(chartDom);
    if (window.PaidDashboard && typeof window.PaidDashboard.registerChart === "function") {
      window.PaidDashboard.registerChart(chart);
    }

    function renderMonthChips() {
      domMonths.innerHTML = "";
      allMonths.forEach((m) => {
        const checked = state.months.indexOf(m) !== -1;
        const chip = createChip(monthLabel(m), checked, false, (nextChecked, input) => {
          const idx = state.months.indexOf(m);

          if (nextChecked) {
            if (idx === -1) {
              if (state.months.length >= MAX_MONTHS) {
                // 超过限制：回滚 UI
                input.checked = false;
                return;
              }
              state.months.push(m);
            }
          } else {
            if (idx !== -1) state.months.splice(idx, 1);
            if (!state.months.length) {
              // 不允许清空
              state.months.push(m);
              input.checked = true;
            }
          }
          normalizeState();
          renderAll();
          renderFilters();
        });
        domMonths.appendChild(chip);
      });
    }

    function renderDimChips(container, allValues, selKey, mergeKey, bkKey, labelFn) {
      const merged = !!state[mergeKey];

      container.innerHTML = "";

      // 1) 全选但不区分
      container.appendChild(
        createChip("全选但不区分", merged, false, (checked) => {
          if (checked) {
            state[bkKey] = state[selKey].slice();
            state[mergeKey] = true;
            state[selKey] = allValues.slice();
          } else {
            state[mergeKey] = false;
            const bk = state[bkKey];
            state[selKey] = Array.isArray(bk) && bk.length ? bk.slice() : allValues.slice();
          }
          normalizeState();
          renderAll();
          renderFilters();
        })
      );

      // 2) 普通 chips
      allValues.forEach((v) => {
        const checked = state[selKey].indexOf(v) !== -1;
        const label = typeof labelFn === "function" ? labelFn(v) : String(v);

        container.appendChild(
          createChip(label, checked, merged, (nextChecked, input) => {
            if (merged) {
              // 被禁用时，回滚 UI（避免用户误点）
              input.checked = checked;
              return;
            }

            const idx = state[selKey].indexOf(v);
            if (nextChecked) {
              if (idx === -1) state[selKey].push(v);
            } else {
              if (idx !== -1) state[selKey].splice(idx, 1);
              if (state[selKey].length === 0) {
                // 至少保留 1 个
                state[selKey].push(v);
                input.checked = true;
              }
            }

            normalizeState();
            renderAll();
            renderFilters();
          })
        );
      });
    }

    function renderChartType() {
      domChartType.innerHTML = "";
      const wrap = el("div", { class: "chart-mini-radio" });
      wrap.appendChild(
        createRadio("roi-chart-type", "月度柱状图", state.chartType === "bar", () => {
          state.chartType = "bar";
          renderAll();
          renderFilters();
        })
      );
      wrap.appendChild(
        createRadio("roi-chart-type", "日级折线图", state.chartType === "line", () => {
          state.chartType = "line";
          renderAll();
          renderFilters();
        })
      );
      domChartType.appendChild(wrap);
    }

    function renderWindows() {
      domWindows.innerHTML = "";
      ["D0", "D7"].forEach((w) => {
        const checked = state.windows.indexOf(w) !== -1;
        domWindows.appendChild(
          createChip(w, checked, false, (nextChecked, input) => {
            const idx = state.windows.indexOf(w);
            if (nextChecked) {
              if (idx === -1) state.windows.push(w);
            } else {
              if (idx !== -1) state.windows.splice(idx, 1);
              if (!state.windows.length) {
                state.windows.push(w);
                input.checked = true;
              }
            }
            normalizeState();
            renderAll();
            renderFilters();
          })
        );
      });
    }

    function renderFilters() {
      renderMonthChips();
      renderDimChips(domCountries, countries, "countries", "mergeCountries", "_bkCountries", (v) => v);
      renderDimChips(domMedias, medias, "medias", "mergeMedias", "_bkMedias", formatMediaLabel);
      renderDimChips(domProducts, products, "products", "mergeProducts", "_bkProducts", displayProductType);
      renderChartType();
      renderWindows();
    }

    // ===== aggregation helpers =====
    function addAgg(agg, r) {
      agg.spent += safeNum(r.spent);
      agg.d0 += safeNum(r.D0_PURCHASE_VALUE);
      agg.d7 += safeNum(r.D7_PURCHASE_VALUE);
    }

    function buildMonthAgg(month) {
      // key: country (or ALL) -> {spent,d0,d7}
      const out = new Map();

      const cSel = new Set(state.countries);
      const mSel = new Set(state.medias);
      const pSel = new Set(state.products.map(normalizeProductType));

      (raw[month] || []).forEach((r) => {
        if (!r) return;
        const c0 = String(r.country || "").trim();
        const m0 = String(r.media || "").trim();
        const p0 = normalizeProductType(r.productType);

        if (!state.mergeCountries && cSel.size && !cSel.has(c0)) return;
        if (mSel.size && !mSel.has(m0)) return;
        if (pSel.size && !pSel.has(p0)) return;

        const key = state.mergeCountries ? "ALL" : c0;
        if (!out.has(key)) out.set(key, { spent: 0, d0: 0, d7: 0 });
        addAgg(out.get(key), r);
      });

      return out;
    }

    function buildDailyAgg(months) {
      // baseKey(country||media||product) -> date -> agg
      const store = new Map();

      const cSel = new Set(state.countries);
      const mSel = new Set(state.medias);
      const pSel = new Set(state.products.map(normalizeProductType));

      (months || []).forEach((month) => {
        (raw[month] || []).forEach((r) => {
          if (!r) return;

          const date = String(r.date || "").trim();
          if (!date) return;

          const c0 = String(r.country || "").trim();
          const m0 = String(r.media || "").trim();
          const p0 = normalizeProductType(r.productType);

          if (!state.mergeCountries && cSel.size && !cSel.has(c0)) return;
          if (mSel.size && !mSel.has(m0)) return;
          if (pSel.size && !pSel.has(p0)) return;

          const c = state.mergeCountries ? "ALL" : c0;
          const m = state.mergeMedias ? "ALL" : m0;
          const p = state.mergeProducts ? "ALL" : p0;

          const baseKey = `${c}||${m}||${p}`;

          if (!store.has(baseKey)) store.set(baseKey, new Map());
          const dateMap = store.get(baseKey);
          if (!dateMap.has(date)) dateMap.set(date, { spent: 0, d0: 0, d7: 0 });
          addAgg(dateMap.get(date), r);
        });
      });

      return store;
    }

    function buildBarOption() {
      const palette = getPalette();
      const months = state.months.slice().sort();

      const cats = state.mergeCountries
        ? ["ALL"]
        : countries.filter((c) => state.countries.indexOf(c) !== -1);

      const monthAgg = {};
      months.forEach((m) => (monthAgg[m] = buildMonthAgg(m)));

      const series = [];
      months.forEach((m, mi) => {
        const color = palette[mi % palette.length];

        state.windows.forEach((w) => {
          const isD7 = w === "D7";
          const data = cats.map((c) => {
            const agg = monthAgg[m].get(c);
            if (!agg) return 0;
            const ratio = safeDiv(isD7 ? agg.d7 : agg.d0, agg.spent);
            return ratio === null ? 0 : ratio;
          });

          series.push({
            name: `${monthLabel(m)} ${w}`,
            type: "bar",
            data,
            barMaxWidth: 26,
            itemStyle: {
              color,
              ...(isD7
                ? {
                    shadowBlur: 8,
                    shadowColor: "rgba(15, 23, 42, 0.22)",
                    shadowOffsetX: 2,
                    shadowOffsetY: 2,
                  }
                : {}),
            },
            emphasis: { focus: "series" },
          });
        });
      });

      return {
        grid: { left: 52, right: 22, top: 42, bottom: 36 },
        legend: { type: "scroll", top: 8 },
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
          formatter: (params) => {
            if (!params || !params.length) return "";
            const axis = params[0].axisValueLabel || params[0].name || "";
            let html = `${axis}<br/>`;
            params.forEach((p) => {
              html += `${p.marker}${p.seriesName}：${pctLabel(p.value, 2)}<br/>`;
            });
            return html;
          },
        },
        xAxis: {
          type: "category",
          data: cats,
          axisTick: { alignWithLabel: true },
          axisLabel: { color: "rgba(71,85,105,1)" },
        },
        yAxis: {
          type: "value",
          axisLabel: {
            color: "rgba(71,85,105,1)",
            formatter: (v) => (Number(v) * 100).toFixed(0) + "%",
          },
          splitLine: { lineStyle: { color: "rgba(148, 163, 184, 0.25)" } },
        },
        series,
      };
    }

    function buildLineOption() {
      const palette = getPalette();
      const months = state.months.slice().sort();

      const dates = buildDateAxis(months);
      const store = buildDailyAgg(months);
      const baseKeys = Array.from(store.keys());

      // sort by country order first
      baseKeys.sort((a, b) => {
        const pa = a.split("||");
        const pb = b.split("||");
        const ca = pa[0] || "";
        const cb = pb[0] || "";
        const ia = COUNTRY_ORDER.indexOf(ca);
        const ib = COUNTRY_ORDER.indexOf(cb);
        if (ia !== -1 || ib !== -1) {
          if (ia === -1) return 1;
          if (ib === -1) return -1;
          if (ia !== ib) return ia - ib;
        } else if (ca !== cb) {
          return ca.localeCompare(cb);
        }
        const ma = pa[1] || "";
        const mb = pb[1] || "";
        if (ma !== mb) return ma.localeCompare(mb);
        const ta = pa[2] || "";
        const tb = pb[2] || "";
        return ta.localeCompare(tb);
      });

      const series = [];
      let colorIdx = 0;

      baseKeys.forEach((bk) => {
        const parts = bk.split("||");
        const c = parts[0] || "ALL";
        const m = parts[1] || "ALL";
        const p = parts[2] || "ALL";

        const labelParts = [];
        if (!state.mergeCountries) labelParts.push(c);
        if (!state.mergeMedias) labelParts.push(formatMediaLabel(m));
        if (!state.mergeProducts) labelParts.push(displayProductType(p));
        const baseLabel = labelParts.length ? labelParts.join(" · ") : "ALL";

        const dateMap = store.get(bk) || new Map();
        const color = palette[colorIdx % palette.length];

        state.windows.forEach((w) => {
          const isD7 = w === "D7";
          const data = dates.map((d) => {
            const agg = dateMap.get(d);
            if (!agg) return null;
            const ratio = safeDiv(isD7 ? agg.d7 : agg.d0, agg.spent);
            return ratio === null ? null : ratio;
          });

          series.push({
            name: `${baseLabel} ${w}`,
            type: "line",
            data,
            showSymbol: false,
            connectNulls: false,
            lineStyle: { width: 2, type: isD7 ? "dashed" : "solid", color },
            itemStyle: { color },
            emphasis: { focus: "series" },
          });
        });

        colorIdx += 1;
      });

      return {
        grid: { left: 52, right: 22, top: 52, bottom: 46 },
        legend: { type: "scroll", top: 8 },
        tooltip: {
          trigger: "axis",
          formatter: (params) => {
            if (!params || !params.length) return "";
            const axis = params[0].axisValueLabel || params[0].name || "";
            let html = `${axis}<br/>`;
            params.forEach((p) => {
              html += `${p.marker}${p.seriesName}：${pctLabel(p.value, 2)}<br/>`;
            });
            return html;
          },
        },
        xAxis: {
          type: "category",
          data: dates,
          axisLabel: {
            color: "rgba(71,85,105,1)",
            formatter: (v) => String(v).slice(5), // 只展示 MM-DD
          },
        },
        yAxis: {
          type: "value",
          axisLabel: {
            color: "rgba(71,85,105,1)",
            formatter: (v) => (Number(v) * 100).toFixed(0) + "%",
          },
          splitLine: { lineStyle: { color: "rgba(148, 163, 184, 0.25)" } },
        },
        dataZoom: [{ type: "inside" }],
        series,
      };
    }

    function renderTable() {
      const table = document.getElementById("roi-table");
      if (!table) return;

      const months = state.months.slice().sort();
      const isLine = state.chartType === "line";

      // title + sub
      const titleEl = document.getElementById("roi-table-title");
      const subEl = document.getElementById("roi-table-sub");
      if (titleEl) {
        titleEl.textContent =
          "数据表 · 充值ROI" + makeTableTitle(state.medias, state.products, state.mergeMedias, state.mergeProducts);
      }
      if (subEl) {
        subEl.textContent = `月份：${months.map(monthLabel).join(" / ")}；口径：PURCHASE_VALUE/spent`;
      }

      // dim columns
      const dimCols = ["国家"];
      if (isLine && !state.mergeMedias) dimCols.push("媒体");
      if (isLine && !state.mergeProducts) dimCols.push("产品类型");

      // metric columns
      const metricCols = [];
      months.forEach((m) => {
        state.windows.forEach((w) => metricCols.push(`${monthLabel(m)} ${w} ROI`));
      });

      // month -> groupKey -> agg
      // groupKey:
      // - bar: country (or ALL)
      // - line: country||media||product (merged dims用 ALL 占位，方便索引)
      const monthGrouped = {};
      months.forEach((m) => {
        const mp = new Map();

        const cSel = new Set(state.countries);
        const mSel = new Set(state.medias);
        const pSel = new Set(state.products.map(normalizeProductType));

        (raw[m] || []).forEach((r) => {
          if (!r) return;
          const c0 = String(r.country || "").trim();
          const m0 = String(r.media || "").trim();
          const p0 = normalizeProductType(r.productType);

          if (!state.mergeCountries && cSel.size && !cSel.has(c0)) return;
          if (mSel.size && !mSel.has(m0)) return;
          if (pSel.size && !pSel.has(p0)) return;

          const c = state.mergeCountries ? "ALL" : c0;
          const mm = state.mergeMedias ? "ALL" : m0;
          const p = state.mergeProducts ? "ALL" : p0;

          const key = isLine ? `${c}||${mm}||${p}` : c;

          if (!mp.has(key)) mp.set(key, { spent: 0, d0: 0, d7: 0 });
          addAgg(mp.get(key), r);
        });

        monthGrouped[m] = mp;
      });

      // union keys
      const keys = new Set();
      months.forEach((m) => {
        monthGrouped[m].forEach((_, k) => keys.add(k));
      });

      const allKeys = Array.from(keys);
      allKeys.sort((a, b) => {
        const pa = String(a).split("||");
        const pb = String(b).split("||");
        const ca = pa[0] || "";
        const cb = pb[0] || "";

        const ia = COUNTRY_ORDER.indexOf(ca);
        const ib = COUNTRY_ORDER.indexOf(cb);
        if (ia !== -1 || ib !== -1) {
          if (ia === -1) return 1;
          if (ib === -1) return -1;
          if (ia !== ib) return ia - ib;
        } else if (ca !== cb) {
          return ca.localeCompare(cb);
        }

        const ma = pa[1] || "";
        const mb = pb[1] || "";
        if (ma !== mb) return ma.localeCompare(mb);

        const ta = pa[2] || "";
        const tb = pb[2] || "";
        return ta.localeCompare(tb);
      });

      // render HTML
      const thead = el("thead");
      const trh = el("tr");
      dimCols.forEach((c) => trh.appendChild(el("th", { text: c })));
      metricCols.forEach((c) => trh.appendChild(el("th", { text: c })));
      thead.appendChild(trh);

      const tbody = el("tbody");
      allKeys.forEach((k) => {
        const tr = el("tr");
        const parts = String(k).split("||");

        if (!isLine) {
          tr.appendChild(el("td", { text: parts[0] }));
        } else {
          tr.appendChild(el("td", { text: parts[0] }));
          if (!state.mergeMedias) tr.appendChild(el("td", { text: formatMediaLabel(parts[1] || "") }));
          if (!state.mergeProducts) tr.appendChild(el("td", { text: displayProductType(parts[2] || "") }));
        }

        months.forEach((m) => {
          const agg = monthGrouped[m].get(k);
          state.windows.forEach((w) => {
            if (!agg || !agg.spent) {
              tr.appendChild(el("td", { class: "muted", text: "-" }));
              return;
            }
            const ratio = safeDiv(w === "D7" ? agg.d7 : agg.d0, agg.spent);
            tr.appendChild(el("td", { text: pctLabel(ratio, 2) }));
          });
        });

        tbody.appendChild(tr);
      });

      table.innerHTML = "";
      table.appendChild(thead);
      table.appendChild(tbody);
    }

    function renderChart() {
      const opt = state.chartType === "line" ? buildLineOption() : buildBarOption();
      chart.setOption(opt, true);
    }

    function renderAll() {
      normalizeState();
      renderChart();
      renderTable();
    }

    // 初次渲染
    normalizeState();
    renderFilters();
    renderAll();
  }

  // 启动兼容：有 PaidDashboard 就注册模块；否则 DOM Ready 直接 init
  if (window.PaidDashboard && typeof window.PaidDashboard.registerModule === "function") {
    window.PaidDashboard.registerModule(MODULE_KEY, init);
  } else {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  }
})();
