/**
 * paid-module-arppu.js
 * -----------------------------------------
 * 模块 4：D0 / D7 ARPPU
 * 口径：
 * - D0 ARPPU = D0_PURCHASE_VALUE / D0_unique_purchase
 * - D7 ARPPU = D7_PURCHASE_VALUE / D7_unique_purchase
 *
 * 交互：
 * - 月份：最多选 3 个
 * - 国家 / 媒体 / 形态：多选 + 「全选但不区分」
 * - 图表：月度柱状图 / 日级折线图
 * - D0/D7：多选
 *
 * 重点：柱状图里 D7 柱子同色 + 斜线阴影（decal）区分 D0。
 */

(function () {
  const MODULE_NAME = "arppu";
  const CARD_ID = "card-paid-arppu";
  const CHART_ID = "chart-paid-arppu";

  const COUNTRY_ORDER = ["GH", "KE", "NG", "TZ"]; // 本模块固定展示顺序

  function safeDiv(a, b) {
    const x = Number(a) || 0;
    const y = Number(b) || 0;
    if (!y) return 0;
    return x / y;
  }

  function uniq(arr) {
    return Array.from(new Set(arr));
  }

  function sortMonthAsc(a, b) {
    // YYYY-MM 字符串可直接比较；但还是写清楚点
    return String(a).localeCompare(String(b));
  }

  function formatMonthLabel(month) {
    // "2025-09" -> "9月"
    const s = String(month || "");
    const m = s.match(/^(\d{4})-(\d{2})$/);
    if (!m) return s;
    return `${Number(m[2])}月`;
  }

  function formatUSD(v, decimals) {
    const n = Number(v);
    const d = typeof decimals === "number" ? decimals : 2;
    if (!isFinite(n)) return "-";
    return n.toFixed(d);
  }

  function buildMonthOptions(RAW) {
    return Object.keys(RAW || {}).sort(sortMonthAsc);
  }

  function collectDimensionOptions(RAW, monthList) {
    const countries = [];
    const medias = [];
    const productTypes = [];

    (monthList || []).forEach((m) => {
      const rows = (RAW && RAW[m]) || [];
      rows.forEach((r) => {
        if (!r) return;
        if (r.country) countries.push(String(r.country));
        if (r.media) medias.push(String(r.media));
        if (r.productType) productTypes.push(String(r.productType));
      });
    });

    return {
      countries: uniq(countries),
      medias: uniq(medias),
      productTypes: uniq(productTypes),
    };
  }

  function ensureStyleOnce() {
    if (document.getElementById("paid-module-arppu-style")) return;

    const style = document.createElement("style");
    style.id = "paid-module-arppu-style";
    style.textContent = `
      /* ============ paid-module-arppu.js 注入样式（仅本模块） ============ */
      #${CARD_ID} .paid-module-filters {
        margin: 10px 16px 0;
        padding: 10px 12px;
        border-radius: var(--radius-md, 12px);
        border: 1px solid rgba(148, 163, 184, 0.35);
        background: rgba(255, 255, 255, 0.72);
        backdrop-filter: blur(6px);
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
      }

      #${CARD_ID} .paid-filter-row {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        flex-wrap: wrap;
      }

      #${CARD_ID} .paid-filter-label {
        flex: 0 0 74px;
        font-size: 11px;
        color: var(--text-sub, #475569);
        line-height: 22px;
        padding-top: 2px;
      }

      #${CARD_ID} .paid-filter-controls {
        flex: 1 1 auto;
        min-width: 220px;
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
      }

      #${CARD_ID} .paid-filter-hint {
        font-size: 11px;
        color: var(--text-sub, #475569);
        opacity: 0.9;
        margin-left: 6px;
      }

      #${CARD_ID} .paid-module-table-wrap {
        margin: 10px 16px 0;
      }

      #${CARD_ID} .paid-module-table-title {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 10px;
        margin: 0 0 6px 2px;
      }

      #${CARD_ID} .paid-module-table-title .name {
        font-size: 12px;
        font-weight: 700;
        color: var(--text-main, #0f172a);
      }

      #${CARD_ID} .paid-module-table-title .meta {
        font-size: 11px;
        color: var(--text-sub, #475569);
        white-space: nowrap;
      }

      #${CARD_ID} .paid-module-table-scroll {
        overflow: auto;
        border-radius: var(--radius-md, 12px);
        border: 1px solid rgba(148, 163, 184, 0.35);
        background: rgba(255, 255, 255, 0.78);
      }

      #${CARD_ID} table.paid-module-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        min-width: 560px;
      }

      #${CARD_ID} table.paid-module-table th,
      #${CARD_ID} table.paid-module-table td {
        padding: 8px 10px;
        font-size: 11px;
        border-bottom: 1px solid rgba(148, 163, 184, 0.16);
      }

      #${CARD_ID} table.paid-module-table th {
        position: sticky;
        top: 0;
        background: rgba(37, 99, 235, 0.07);
        color: var(--text-sub, #475569);
        font-weight: 600;
        text-align: right;
        z-index: 1;
        white-space: nowrap;
      }

      #${CARD_ID} table.paid-module-table td {
        text-align: right;
        color: var(--text-main, #0f172a);
        white-space: nowrap;
      }

      #${CARD_ID} table.paid-module-table th:first-child,
      #${CARD_ID} table.paid-module-table td:first-child {
        text-align: left;
      }

      #${CARD_ID} table.paid-module-table tr:last-child td {
        border-bottom: none;
      }

      #${CARD_ID} .muted {
        color: var(--text-sub, #475569);
        opacity: 0.9;
      }
    `;
    document.head.appendChild(style);
  }

  function createChip({ value, label, checked, disabled, onChange, type }) {
    const isRadio = type === "radio";

    const labelEl = document.createElement("label");
    labelEl.className = "filter-chip" + (checked ? " filter-chip-active" : "");

    const input = document.createElement("input");
    input.type = isRadio ? "radio" : "checkbox";
    input.value = String(value);
    input.checked = !!checked;
    input.disabled = !!disabled;
    input.style.margin = "0 2px 0 0";

    input.addEventListener("change", () => {
      if (typeof onChange === "function") onChange(value, input.checked);
    });

    labelEl.appendChild(input);
    labelEl.appendChild(document.createTextNode(label));

    return { labelEl, input };
  }

  function createRadioName(prefix) {
    return `${prefix}-${Math.random().toString(16).slice(2)}`;
  }

  function buildARPPUSumsForMonth(rows, opts) {
    const {
      selCountries,
      selMedias,
      selProductTypes,
      byCountry,
      byMedia,
      byProductType,
    } = opts;

    const out = new Map();

    rows.forEach((r) => {
      if (!r) return;
      const c = String(r.country || "");
      const m = String(r.media || "");
      const p = String(r.productType || "");

      if (selCountries && selCountries.size && !selCountries.has(c)) return;
      if (selMedias && selMedias.size && !selMedias.has(m)) return;
      if (selProductTypes && selProductTypes.size && !selProductTypes.has(p))
        return;

      const kCountry = byCountry ? c : "ALL";
      const kMedia = byMedia ? m : "ALL";
      const kProd = byProductType ? p : "ALL";
      const key = `${kCountry}||${kMedia}||${kProd}`;

      if (!out.has(key)) {
        out.set(key, {
          country: kCountry,
          media: kMedia,
          productType: kProd,
          d0Value: 0,
          d0Users: 0,
          d7Value: 0,
          d7Users: 0,
        });
      }

      const agg = out.get(key);
      agg.d0Value += Number(r.D0_PURCHASE_VALUE) || 0;
      agg.d0Users += Number(r.D0_unique_purchase) || 0;
      agg.d7Value += Number(r.D7_PURCHASE_VALUE) || 0;
      agg.d7Users += Number(r.D7_unique_purchase) || 0;
    });

    return out;
  }

  function buildDailySums(rows, opts) {
    const {
      selCountries,
      selMedias,
      selProductTypes,
      byCountry,
      byMedia,
      byProductType,
    } = opts;

    const datesSet = new Set();
    const out = new Map(); // key(group) -> Map(date -> sums)

    rows.forEach((r) => {
      if (!r) return;

      const date = String(r.date || "");
      if (!date) return;

      const c = String(r.country || "");
      const m = String(r.media || "");
      const p = String(r.productType || "");

      if (selCountries && selCountries.size && !selCountries.has(c)) return;
      if (selMedias && selMedias.size && !selMedias.has(m)) return;
      if (selProductTypes && selProductTypes.size && !selProductTypes.has(p))
        return;

      const kCountry = byCountry ? c : "ALL";
      const kMedia = byMedia ? m : "ALL";
      const kProd = byProductType ? p : "ALL";
      const gKey = `${kCountry}||${kMedia}||${kProd}`;

      datesSet.add(date);

      if (!out.has(gKey)) out.set(gKey, new Map());
      const dateMap = out.get(gKey);

      if (!dateMap.has(date)) {
        dateMap.set(date, { d0Value: 0, d0Users: 0, d7Value: 0, d7Users: 0 });
      }

      const agg = dateMap.get(date);
      agg.d0Value += Number(r.D0_PURCHASE_VALUE) || 0;
      agg.d0Users += Number(r.D0_unique_purchase) || 0;
      agg.d7Value += Number(r.D7_PURCHASE_VALUE) || 0;
      agg.d7Users += Number(r.D7_unique_purchase) || 0;
    });

    const dates = Array.from(datesSet).sort((a, b) =>
      String(a).localeCompare(String(b))
    );
    return { dates, groups: out };
  }

  function createDecal() {
    // ECharts 5 decal：斜线阴影
    return {
      symbol: "rect",
      symbolSize: 1,
      dashArrayX: [6, 2],
      dashArrayY: [6, 2],
      rotation: Math.PI / 4,
      color: "rgba(255,255,255,0.45)",
    };
  }

  function init() {
    const RAW = window.RAW_PAID_BY_MONTH || {};
    const monthsAll = buildMonthOptions(RAW);

    const card = document.getElementById(CARD_ID);
    const chartDom = document.getElementById(CHART_ID);
    if (!card || !chartDom || !window.echarts) return;

    ensureStyleOnce();

    // ====== options（未来数据源新增媒体/形态会自动出现）======
    const dims = collectDimensionOptions(RAW, monthsAll);

    // 国家过滤：只展示本模块固定顺序里出现的国家（避免 UI 上出现顺序之外的国家）
    const countriesAll = COUNTRY_ORDER.filter((c) => dims.countries.includes(c));
    const mediasAll = dims.medias.sort((a, b) =>
      String(a).localeCompare(String(b))
    );
    const productTypesAll = dims.productTypes.sort((a, b) =>
      String(a).localeCompare(String(b))
    );

    // ====== state（模块内自洽，不依赖全局筛选）======
    const state = {
      months: monthsAll.slice(-2), // 默认最近 2 个月（不够就取全部）
      countries: countriesAll.slice(),
      medias: mediasAll.slice(),
      productTypes: productTypesAll.slice(),
      dFlags: ["D0", "D7"],
      chartType: "bar", // bar | line
      noSplitCountry: false,
      noSplitMedia: true,
      noSplitProductType: true,
    };

    if (state.months.length === 0 && monthsAll.length)
      state.months = [monthsAll[monthsAll.length - 1]];
    if (state.countries.length === 0 && countriesAll.length)
      state.countries = countriesAll.slice();
    if (state.medias.length === 0 && mediasAll.length)
      state.medias = mediasAll.slice();
    if (state.productTypes.length === 0 && productTypesAll.length)
      state.productTypes = productTypesAll.slice();

    // ====== mount UI（filters + table）======
    const header = card.querySelector(".chart-card-header");
    const summaryEl = card.querySelector(".chart-summary[data-analysis-key]");

    let filtersEl = card.querySelector(".paid-module-filters");
    if (!filtersEl) {
      filtersEl = document.createElement("div");
      filtersEl.className = "paid-module-filters";
      if (header) header.insertAdjacentElement("afterend", filtersEl);
      else card.insertBefore(filtersEl, chartDom);
    }

    let tableWrap = card.querySelector(".paid-module-table-wrap");
    if (!tableWrap) {
      tableWrap = document.createElement("div");
      tableWrap.className = "paid-module-table-wrap";
      if (summaryEl) summaryEl.insertAdjacentElement("beforebegin", tableWrap);
      else card.appendChild(tableWrap);
    }

    // ====== chart init ======
    const chart = echarts.init(chartDom);
    if (
      window.PaidDashboard &&
      typeof window.PaidDashboard.registerChart === "function"
    ) {
      window.PaidDashboard.registerChart(chart);
    }

    // ====== build filter rows ======
    const refs = {
      months: new Map(),
      countries: new Map(),
      medias: new Map(),
      productTypes: new Map(),
      dFlags: new Map(),
      chartType: new Map(),
      noSplitCountry: null,
      noSplitMedia: null,
      noSplitProductType: null,
    };

    function renderFilters() {
      filtersEl.innerHTML = "";

      function makeRow(labelText) {
        const row = document.createElement("div");
        row.className = "paid-filter-row";

        const label = document.createElement("div");
        label.className = "paid-filter-label";
        label.textContent = labelText;

        const controls = document.createElement("div");
        controls.className = "paid-filter-controls";

        row.appendChild(label);
        row.appendChild(controls);
        filtersEl.appendChild(row);

        return controls;
      }

      // 月份（最多 3）
      const monthsControls = makeRow("月份");
      refs.months.clear();
      monthsAll.forEach((m) => {
        const checked = state.months.includes(m);
        const chip = createChip({
          value: m,
          label: formatMonthLabel(m),
          checked,
          disabled: false,
          onChange: (value, isChecked) => {
            const v = String(value);
            const idx = state.months.indexOf(v);

            if (isChecked) {
              if (state.months.length >= 3 && idx === -1) {
                // 超过 3 个，直接回退
                const ref = refs.months.get(v);
                if (ref) ref.input.checked = false;
                return;
              }
              if (idx === -1) state.months.push(v);
            } else {
              if (idx !== -1) state.months.splice(idx, 1);
            }

            // 保底：至少 1 个
            if (state.months.length === 0 && monthsAll.length) {
              state.months = [monthsAll[monthsAll.length - 1]];
            }

            render();
          },
        });
        refs.months.set(m, chip);
        monthsControls.appendChild(chip.labelEl);
      });

      // 国家 + 全选但不区分
      const countriesControls = makeRow("国家");
      refs.countries.clear();

      const countryAllChip = createChip({
        value: "__NOSPLIT__",
        label: "全选但不区分",
        checked: !!state.noSplitCountry,
        disabled: false,
        onChange: (_v, isChecked) => {
          state.noSplitCountry = !!isChecked;
          if (state.noSplitCountry) {
            state.countries = countriesAll.slice();
          }
          renderFilters();
          render();
        },
      });
      refs.noSplitCountry = countryAllChip;
      countriesControls.appendChild(countryAllChip.labelEl);

      countriesAll.forEach((c) => {
        const checked = state.countries.includes(c);
        const chip = createChip({
          value: c,
          label: c,
          checked,
          disabled: !!state.noSplitCountry,
          onChange: (value, isChecked) => {
            const v = String(value);
            const idx = state.countries.indexOf(v);
            if (isChecked) {
              if (idx === -1) state.countries.push(v);
            } else {
              if (idx !== -1) state.countries.splice(idx, 1);
            }
            if (state.countries.length === 0) state.countries = countriesAll.slice();
            render();
          },
        });
        refs.countries.set(c, chip);
        countriesControls.appendChild(chip.labelEl);
      });

      // 图表类型
      const chartControls = makeRow("图表");
      refs.chartType.clear();
      const radioName = createRadioName("arppu-chart");
      const chartOptions = [
        { value: "bar", label: "月度柱状图" },
        { value: "line", label: "日级折线图" },
      ];
      chartOptions.forEach((opt) => {
        const chip = createChip({
          type: "radio",
          value: opt.value,
          label: opt.label,
          checked: state.chartType === opt.value,
          disabled: false,
          onChange: (value, isChecked) => {
            if (!isChecked) return;
            state.chartType = String(value);
            render();
          },
        });
        chip.input.name = radioName;
        refs.chartType.set(opt.value, chip);
        chartControls.appendChild(chip.labelEl);
      });

      // 媒体 + 全选但不区分
      const mediasControls = makeRow("媒体");
      refs.medias.clear();

      const mediaAllChip = createChip({
        value: "__NOSPLIT__",
        label: "全选但不区分",
        checked: !!state.noSplitMedia,
        disabled: false,
        onChange: (_v, isChecked) => {
          state.noSplitMedia = !!isChecked;
          if (state.noSplitMedia) {
            state.medias = mediasAll.slice();
          }
          renderFilters();
          render();
        },
      });
      refs.noSplitMedia = mediaAllChip;
      mediasControls.appendChild(mediaAllChip.labelEl);

      mediasAll.forEach((m) => {
        const checked = state.medias.includes(m);
        const chip = createChip({
          value: m,
          label: String(m).toLowerCase(),
          checked,
          disabled: !!state.noSplitMedia,
          onChange: (value, isChecked) => {
            const v = String(value);
            const idx = state.medias.indexOf(v);
            if (isChecked) {
              if (idx === -1) state.medias.push(v);
            } else {
              if (idx !== -1) state.medias.splice(idx, 1);
            }
            if (state.medias.length === 0) state.medias = mediasAll.slice();
            render();
          },
        });
        refs.medias.set(m, chip);
        mediasControls.appendChild(chip.labelEl);
      });

      // 形态 + 全选但不区分
      const prodControls = makeRow("形态");
      refs.productTypes.clear();

      const prodAllChip = createChip({
        value: "__NOSPLIT__",
        label: "全选但不区分",
        checked: !!state.noSplitProductType,
        disabled: false,
        onChange: (_v, isChecked) => {
          state.noSplitProductType = !!isChecked;
          if (state.noSplitProductType) {
            state.productTypes = productTypesAll.slice();
          }
          renderFilters();
          render();
        },
      });
      refs.noSplitProductType = prodAllChip;
      prodControls.appendChild(prodAllChip.labelEl);

      productTypesAll.forEach((p) => {
        const checked = state.productTypes.includes(p);
        const chip = createChip({
          value: p,
          label: String(p).toLowerCase(),
          checked,
          disabled: !!state.noSplitProductType,
          onChange: (value, isChecked) => {
            const v = String(value);
            const idx = state.productTypes.indexOf(v);
            if (isChecked) {
              if (idx === -1) state.productTypes.push(v);
            } else {
              if (idx !== -1) state.productTypes.splice(idx, 1);
            }
            if (state.productTypes.length === 0)
              state.productTypes = productTypesAll.slice();
            render();
          },
        });
        refs.productTypes.set(p, chip);
        prodControls.appendChild(chip.labelEl);
      });

      // D0 / D7
      const dFlagControls = makeRow("窗口");
      refs.dFlags.clear();
      ["D0", "D7"].forEach((d) => {
        const checked = state.dFlags.includes(d);
        const chip = createChip({
          value: d,
          label: d,
          checked,
          disabled: false,
          onChange: (value, isChecked) => {
            const v = String(value);
            const idx = state.dFlags.indexOf(v);
            if (isChecked) {
              if (idx === -1) state.dFlags.push(v);
            } else {
              if (idx !== -1) state.dFlags.splice(idx, 1);
            }
            if (state.dFlags.length === 0) state.dFlags = ["D0", "D7"];
            render();
          },
        });
        refs.dFlags.set(d, chip);
        dFlagControls.appendChild(chip.labelEl);
      });

      const hint = document.createElement("div");
      hint.className = "paid-filter-hint";
      hint.textContent = "月份最多选 3 个；折线图为日级。";
      filtersEl.appendChild(hint);
    }

    function getPalette() {
      const palette =
        window.PaidDashboard && Array.isArray(window.PaidDashboard.COLORS)
          ? window.PaidDashboard.COLORS
          : ["#2563eb", "#16a34a", "#f97316", "#7c3aed", "#ef4444", "#0f766e"];
      return palette.length ? palette : ["#2563eb"];
    }

    function buildBarOption() {
      const selMonths = state.months.slice().sort(sortMonthAsc);
      const selCountries = new Set(state.countries);
      const selMedias = new Set(state.medias);
      const selProds = new Set(state.productTypes);
      const selD = new Set(state.dFlags);

      const xCats = state.noSplitCountry
        ? ["ALL"]
        : COUNTRY_ORDER.filter((c) => selCountries.has(c));

      const palette = getPalette();
      const decal = createDecal();

      // 预聚合：month -> Map(country -> {d0,d7})
      const monthAgg = new Map();
      selMonths.forEach((m) => {
        const rows = RAW[m] || [];
        const sums = buildARPPUSumsForMonth(rows, {
          selCountries,
          selMedias,
          selProductTypes: selProds,
          byCountry: !state.noSplitCountry,
          byMedia: false,
          byProductType: false,
        });
        monthAgg.set(m, sums);
      });

      const series = [];
      selMonths.forEach((m, idx) => {
        const color = palette[idx % palette.length];
        const sums = monthAgg.get(m) || new Map();

        function getVal(country, dFlag) {
          const key = state.noSplitCountry
            ? "ALL||ALL||ALL"
            : `${country}||ALL||ALL`;
          const agg = sums.get(key);
          if (!agg) return 0;
          if (dFlag === "D0") return safeDiv(agg.d0Value, agg.d0Users);
          return safeDiv(agg.d7Value, agg.d7Users);
        }

        if (selD.has("D0")) {
          series.push({
            name: `${formatMonthLabel(m)} D0`,
            type: "bar",
            data: xCats.map((c) => getVal(c, "D0")),
            barMaxWidth: 34,
            itemStyle: { color },
          });
        }

        if (selD.has("D7")) {
          series.push({
            name: `${formatMonthLabel(m)} D7`,
            type: "bar",
            data: xCats.map((c) => getVal(c, "D7")),
            barMaxWidth: 34,
            itemStyle: { color, decal },
          });
        }
      });

      const legendData = series.map((s) => s.name);

      return {
        animationDuration: 250,
        grid: { left: 46, right: 18, top: 46, bottom: 40 },
        legend: {
          type: "scroll",
          top: 8,
          data: legendData,
          textStyle: { fontSize: 11, color: "#475569" },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
          valueFormatter: (v) => `${formatUSD(v, 2)} USD`,
        },
        xAxis: {
          type: "category",
          data: xCats,
          axisLabel: { fontSize: 11 },
        },
        yAxis: {
          type: "value",
          axisLabel: { formatter: (v) => formatUSD(v, 0) },
          splitLine: { lineStyle: { color: "rgba(148,163,184,0.22)" } },
        },
        series,
      };
    }

    function buildLineOption() {
      const selMonths = state.months.slice().sort(sortMonthAsc);
      const selCountries = new Set(state.countries);
      const selMedias = new Set(state.medias);
      const selProds = new Set(state.productTypes);
      const selD = new Set(state.dFlags);

      // 折线图：默认按「国家 +（媒体/形态是否区分）」拆线
      const byCountry = !state.noSplitCountry;
      const byMedia = !state.noSplitMedia;
      const byProductType = !state.noSplitProductType;

      const allRows = [];
      selMonths.forEach((m) => {
        const rows = RAW[m] || [];
        rows.forEach((r) => allRows.push(r));
      });

      const { dates, groups } = buildDailySums(allRows, {
        selCountries,
        selMedias,
        selProductTypes: selProds,
        byCountry,
        byMedia,
        byProductType,
      });

      const palette = getPalette();
      const series = [];

      const groupKeys = Array.from(groups.keys()).sort((a, b) =>
        String(a).localeCompare(String(b))
      );

      function formatGroupName(gKey, dFlag) {
        const parts = String(gKey).split("||");
        const c = parts[0] || "ALL";
        const m = parts[1] || "ALL";
        const p = parts[2] || "ALL";

        const chunks = [];
        if (byCountry) chunks.push(c);
        if (byMedia) chunks.push(String(m).toLowerCase());
        if (byProductType) chunks.push(String(p).toLowerCase());
        if (chunks.length === 0) chunks.push("ALL");

        chunks.push(dFlag);
        return chunks.join(" · ");
      }

      groupKeys.forEach((gKey, idx) => {
        const dateMap = groups.get(gKey) || new Map();
        const color = palette[idx % palette.length];

        function buildSeriesData(dFlag) {
          return dates.map((d) => {
            const agg = dateMap.get(d);
            if (!agg) return null;
            if (dFlag === "D0") return safeDiv(agg.d0Value, agg.d0Users);
            return safeDiv(agg.d7Value, agg.d7Users);
          });
        }

        if (selD.has("D0")) {
          series.push({
            name: formatGroupName(gKey, "D0"),
            type: "line",
            data: buildSeriesData("D0"),
            showSymbol: false,
            smooth: false,
            lineStyle: { width: 2, color },
            itemStyle: { color },
          });
        }

        if (selD.has("D7")) {
          series.push({
            name: formatGroupName(gKey, "D7"),
            type: "line",
            data: buildSeriesData("D7"),
            showSymbol: false,
            smooth: false,
            lineStyle: { width: 2, type: "dashed", color },
            itemStyle: { color },
          });
        }
      });

      return {
        animationDuration: 250,
        grid: { left: 50, right: 18, top: 46, bottom: 40 },
        legend: {
          type: "scroll",
          top: 8,
          textStyle: { fontSize: 11, color: "#475569" },
        },
        tooltip: {
          trigger: "axis",
          valueFormatter: (v) => `${formatUSD(v, 2)} USD`,
        },
        xAxis: {
          type: "category",
          data: dates,
          axisLabel: { fontSize: 10, formatter: (v) => String(v).slice(5) },
        },
        yAxis: {
          type: "value",
          axisLabel: { formatter: (v) => formatUSD(v, 0) },
          splitLine: { lineStyle: { color: "rgba(148,163,184,0.22)" } },
        },
        series,
      };
    }

    function buildTable() {
      const selMonths = state.months.slice().sort(sortMonthAsc);
      const selCountries = new Set(state.countries);
      const selMedias = new Set(state.medias);
      const selProds = new Set(state.productTypes);
      const selD = state.dFlags.slice().sort(); // D0 / D7

      // 表的拆分规则：只有在“未勾选不区分”且选择多于 1 才拆
      const byCountry = !state.noSplitCountry;
      const byMedia = !state.noSplitMedia && state.medias.length > 1;
      const byProductType =
        !state.noSplitProductType && state.productTypes.length > 1;

      // month -> Map(groupKey -> sums)
      const monthMaps = new Map();
      selMonths.forEach((m) => {
        const rows = RAW[m] || [];
        monthMaps.set(
          m,
          buildARPPUSumsForMonth(rows, {
            selCountries,
            selMedias,
            selProductTypes: selProds,
            byCountry,
            byMedia,
            byProductType,
          })
        );
      });

      // union all group keys
      const groupKeySet = new Set();
      monthMaps.forEach((mp) => {
        mp.forEach((_v, k) => groupKeySet.add(k));
      });

      // sort groups (按国家顺序，再 media/productType)
      const groupKeys = Array.from(groupKeySet).sort((a, b) => {
        const pa = String(a).split("||");
        const pb = String(b).split("||");

        const ca = pa[0] || "ALL";
        const cb = pb[0] || "ALL";
        const ia = COUNTRY_ORDER.indexOf(ca);
        const ib = COUNTRY_ORDER.indexOf(cb);
        if (ia !== ib) {
          if (ia === -1) return 1;
          if (ib === -1) return -1;
          return ia - ib;
        }

        const ma = pa[1] || "";
        const mb = pb[1] || "";
        if (ma !== mb) return String(ma).localeCompare(String(mb));

        const ta = pa[2] || "";
        const tb = pb[2] || "";
        return String(ta).localeCompare(String(tb));
      });

      function mediaTitle() {
        if (state.noSplitMedia) return "全媒体";
        if (state.medias.length === mediasAll.length) return "全媒体";
        return state.medias.map((x) => String(x).toLowerCase()).join("+");
      }

      function prodTitle() {
        if (state.noSplitProductType) return "全形态";
        if (state.productTypes.length === productTypesAll.length) return "全形态";
        return state.productTypes
          .map((x) => String(x).toLowerCase())
          .join("+");
      }

      const titleMeta = `(${mediaTitle()}，${prodTitle()})`;

      const colHeaders = [];
      selMonths.forEach((m) => {
        selD.forEach((d) => {
          colHeaders.push({
            month: m,
            dFlag: d,
            label: `${formatMonthLabel(m)} ${d} ARPPU`,
          });
        });
      });

      // build html
      const colsLeft = [];
      colsLeft.push({ key: "country", label: "国家" });
      if (byMedia) colsLeft.push({ key: "media", label: "媒体" });
      if (byProductType) colsLeft.push({ key: "productType", label: "形态" });

      let html = `
        <div class="paid-module-table-title">
          <div class="name">ARPPU 数据表</div>
          <div class="meta">${titleMeta}</div>
        </div>
        <div class="paid-module-table-scroll">
          <table class="paid-module-table">
            <thead>
              <tr>
                ${colsLeft.map((c) => `<th>${c.label}</th>`).join("")}
                ${colHeaders.map((c) => `<th>${c.label}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
      `;

      groupKeys.forEach((gKey) => {
        const parts = String(gKey).split("||");
        const c = parts[0] || "ALL";
        const m = parts[1] || "ALL";
        const p = parts[2] || "ALL";

        html += "<tr>";
        html += `<td>${c}</td>`;
        if (byMedia) html += `<td class="muted">${String(m).toLowerCase()}</td>`;
        if (byProductType)
          html += `<td class="muted">${String(p).toLowerCase()}</td>`;

        colHeaders.forEach((col) => {
          const sums = monthMaps.get(col.month);
          const agg = sums ? sums.get(gKey) : null;

          let val = 0;
          if (agg) {
            if (col.dFlag === "D0") val = safeDiv(agg.d0Value, agg.d0Users);
            else val = safeDiv(agg.d7Value, agg.d7Users);
          }

          html += `<td>${formatUSD(val, 2)}</td>`;
        });

        html += "</tr>";
      });

      html += `
            </tbody>
          </table>
        </div>
      `;

      tableWrap.innerHTML = html;
    }

    function render() {
      // 保底：months 至少 1 个
      if (!Array.isArray(state.months)) state.months = [];
      if (state.months.length === 0 && monthsAll.length) {
        state.months = [monthsAll[monthsAll.length - 1]];
      }

      // 保底：D0/D7 至少一个
      if (!Array.isArray(state.dFlags) || state.dFlags.length === 0) {
        state.dFlags = ["D0", "D7"];
      }

      // chart
      const option = state.chartType === "line" ? buildLineOption() : buildBarOption();
      chart.setOption(option, true);

      // table（不管柱状/折线，表都按月聚合展示）
      buildTable();
    }

    renderFilters();
    render();
  }

  if (window.PaidDashboard && typeof window.PaidDashboard.registerModule === "function") {
    window.PaidDashboard.registerModule(MODULE_NAME, init);
  } else {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  }
})();
