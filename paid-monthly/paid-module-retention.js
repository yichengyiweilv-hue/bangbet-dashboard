/**
 * paid-module-retention.js
 * 次留 / 七留（D1 / D7）模块
 *
 * 指标口径：
 * - 次留（D1）= D1_retained_users / registration
 * - 七留（D7）= D7_retained_users / registration
 *
 * 数据源：window.RAW_PAID_BY_MONTH（paid-data.js）
 * 依赖：ECharts 5.x
 *
 * DOM 依赖（若不存在会自动创建）：
 * - #card-paid-retention（模块卡片容器）
 * - #chart-paid-retention（图表容器）
 */
(function () {
  function init() {
    const RAW = window.RAW_PAID_BY_MONTH || {};
    const Paid = window.PaidDashboard || {};
    const hasEcharts = typeof window.echarts !== "undefined";
    const card = document.getElementById("card-paid-retention");
    const chartDom = document.getElementById("chart-paid-retention");
    if (!hasEcharts || !card || !chartDom) return;

    const chart = echarts.init(chartDom);
    if (Paid.registerChart) Paid.registerChart(chart);

    // ============ 基础工具 ============
    const COLORS = (Paid && Paid.COLORS) || [
      "#2563eb",
      "#16a34a",
      "#f97316",
      "#7c3aed",
      "#ef4444",
      "#0f766e",
    ];

    const safeDiv =
      (Paid && Paid.safeDiv) ||
      function (a, b) {
        const na = Number(a);
        const nb = Number(b);
        if (!isFinite(na) || !isFinite(nb) || nb === 0) return null;
        return na / nb;
      };

    const formatMonthLabel =
      (Paid && Paid.formatMonthLabel) ||
      function (monthKey) {
        if (!monthKey || typeof monthKey !== "string") return "";
        const mm = (monthKey.split("-")[1] || monthKey).trim();
        const mNum = parseInt(mm, 10) || 0;
        return (mNum > 0 ? mNum : mm) + "月";
      };

    const formatPct01 =
      (Paid && Paid.formatPct01) ||
      function (v, digits) {
        if (v === null || v === undefined || !isFinite(Number(v))) return "-";
        const d = typeof digits === "number" ? digits : 1;
        return (Number(v) * 100).toFixed(d) + "%";
      };

    function n(x) {
      const v = Number(x);
      return isFinite(v) ? v : 0;
    }

    function normCountry(v) {
      return String(v || "").trim().toUpperCase();
    }
    function normMedia(v) {
      return String(v || "").trim().toUpperCase();
    }
    function normProduct(v) {
      const t = String(v || "").trim();
      // 兼容 app / APP / h5 / H5
      if (!t) return "";
      if (t.toLowerCase() === "app") return "APP";
      if (t.toLowerCase() === "h5") return "H5";
      return t.toUpperCase();
    }

    function sortDates(a, b) {
      // date 格式：YYYY-MM-DD
      return String(a).localeCompare(String(b));
    }

    // ============ 扫描可选项（从数据源动态提取） ============
    const ALL_MONTHS = Object.keys(RAW).sort();
    const scan = (function scanOptions() {
      const c = new Set();
      const m = new Set();
      const p = new Set();
      ALL_MONTHS.forEach((month) => {
        (RAW[month] || []).forEach((r) => {
          if (!r) return;
          if (r.country) c.add(normCountry(r.country));
          if (r.media) m.add(normMedia(r.media));
          if (r.productType) p.add(normProduct(r.productType));
        });
      });
      return {
        countries: Array.from(c).sort(),
        medias: Array.from(m).sort(),
        productTypes: Array.from(p).sort(),
      };
    })();

    const FIXED_COUNTRY_ORDER = ["GH", "KE", "NG", "TZ"];

    const MODULE_COUNTRIES = FIXED_COUNTRY_ORDER.filter(
      (c) => scan.countries.indexOf(c) !== -1
    );

    function orderedCountries(selected) {
      const sel = new Set((selected || []).map(normCountry));
      const base =
        MODULE_COUNTRIES && MODULE_COUNTRIES.length
          ? MODULE_COUNTRIES
          : FIXED_COUNTRY_ORDER;
      return base.filter((c) => !sel.size || sel.has(c));
    }

    function getMonthColor(monthKey) {
      const idx = ALL_MONTHS.indexOf(monthKey);
      const i = idx >= 0 ? idx : 0;
      return COLORS[i % COLORS.length];
    }

    function buildDecalForSecondaryMetric() {
      // ECharts v5 的 decal：斜线纹理（用于“D7/七留”等第二口径）
      return {
        symbol: "rect",
        symbolSize: 1,
        dashArrayX: [2, 2],
        dashArrayY: [6, 0],
        rotation: Math.PI / 4,
      };
    }

    // ============ 状态（本模块私有） ============
    const state = {
      view: "bar", // bar | line
      months: [],
      countries: [],
      medias: [],
      productTypes: [],
      metrics: ["D1", "D7"], // D1=次留, D7=七留

      // “全选但不区分”
      countryMerge: false,
      mediaMerge: true,
      productMerge: true,
    };

    // 默认：预选最近 2 个月 + 全国家/全媒体/全形态
    if (!state.months.length && ALL_MONTHS.length) {
      state.months = ALL_MONTHS.slice(-2);
    }
    if (!state.countries.length)
      state.countries = (MODULE_COUNTRIES.length ? MODULE_COUNTRIES : scan.countries).slice();
    if (!state.medias.length) state.medias = scan.medias.slice();
    if (!state.productTypes.length) state.productTypes = scan.productTypes.slice();

    // ============ 组装筛选器 UI（若 index.html 已写好容器，也兼容） ============
    const ui = ensureModuleUI(card);

    // 绑定 chips
    createMultiSelectChips({
      container: ui.monthsEl,
      values: ALL_MONTHS,
      stateArray: state.months,
      max: 3,
      preselect: 2,
      getLabel: (m) => m,
      onChange: render,
    });

    createMultiSelectChipsWithMerge({
      container: ui.countriesEl,
      values: MODULE_COUNTRIES.length ? MODULE_COUNTRIES : scan.countries,
      stateArray: state.countries,
      mergeGetter: () => state.countryMerge,
      mergeSetter: (v) => (state.countryMerge = v),
      getLabel: (c) => c,
      onChange: render,
    });

    createMultiSelectChipsWithMerge({
      container: ui.mediasEl,
      values: scan.medias,
      stateArray: state.medias,
      mergeGetter: () => state.mediaMerge,
      mergeSetter: (v) => (state.mediaMerge = v),
      getLabel: (m) => m,
      onChange: render,
    });

    createMultiSelectChipsWithMerge({
      container: ui.productTypesEl,
      values: scan.productTypes,
      stateArray: state.productTypes,
      mergeGetter: () => state.productMerge,
      mergeSetter: (v) => (state.productMerge = v),
      getLabel: (p) => (p === "APP" ? "APP" : p),
      onChange: render,
    });

    createMultiSelectChips({
      container: ui.metricsEl,
      values: ["D1", "D7"],
      stateArray: state.metrics,
      preselect: "all",
      getLabel: (v) => (v === "D1" ? "次留" : "七留"),
      onChange: render,
    });

    bindViewToggle(ui.viewEl, state, "view", render);

    ensureTableSection(card);
    injectTableStylesOnce();

    render();

    // ============ 渲染主函数 ============
    function render() {
      const months = (state.months || [])
        .slice(0, 3)
        .filter((m) => ALL_MONTHS.indexOf(m) !== -1);
      if (!months.length) {
        // 没选就兜底最近 2 个月
        state.months = ALL_MONTHS.slice(-2);
        return render();
      }

      const metrics = (state.metrics || []).filter(
        (x) => x === "D1" || x === "D7"
      );
      if (!metrics.length) {
        state.metrics = ["D1"];
        return render();
      }

      const baseCountries = MODULE_COUNTRIES.length ? MODULE_COUNTRIES : scan.countries;
      const countriesSelSetRaw = new Set((state.countries || []).map(normCountry));
      const mediasSelSetRaw = new Set((state.medias || []).map(normMedia));
      const productSelSetRaw = new Set((state.productTypes || []).map(normProduct));

      // 约定：不选(空) = 全选（避免“全不选却等于不过滤”的歧义）
      const countriesSelSet = countriesSelSetRaw.size ? countriesSelSetRaw : new Set(baseCountries);
      const mediasSelSet = mediasSelSetRaw.size ? mediasSelSetRaw : new Set(scan.medias);
      const productSelSet = productSelSetRaw.size ? productSelSetRaw : new Set(scan.productTypes);

      // merge=全选不区分：过滤上相当于全量，但后续 groupBy 不再拆维度
      const useCountriesForFilter = state.countryMerge ? new Set(baseCountries) : countriesSelSet;
      const useMediasForFilter = state.mediaMerge ? new Set(scan.medias) : mediasSelSet;
      const useProductsForFilter = state.productMerge ? new Set(scan.productTypes) : productSelSet;

      // ============ 图 ============
      if (state.view === "line") {
        renderLineChart(
          months,
          metrics,
          useCountriesForFilter,
          useMediasForFilter,
          useProductsForFilter
        );
      } else {
        renderBarChart(
          months,
          metrics,
          useCountriesForFilter,
          useMediasForFilter,
          useProductsForFilter
        );
      }

      // ============ 表 ============
      renderTable(
        months,
        metrics,
        useCountriesForFilter,
        useMediasForFilter,
        useProductsForFilter
      );
    }

    // ============ 图表：柱状图 ============
    function renderBarChart(months, metrics, countriesSet, mediasSet, productsSet) {
      // x 轴：国家（固定顺序）
      const categories = state.countryMerge
        ? ["ALL"]
        : orderedCountries(Array.from(countriesSet));

      const series = [];
      const decal = buildDecalForSecondaryMetric();

      // month 保持选择顺序（但最好按时间）
      const sortedMonths = months.slice().sort();

      sortedMonths.forEach((monthKey) => {
        const monthAgg = aggregateMonthByCountry(
          monthKey,
          countriesSet,
          mediasSet,
          productsSet
        );

        metrics.forEach((metric) => {
          const isSecondary = metric === "D7"; // 七留做“阴影/纹理”
          const baseColor = getMonthColor(monthKey);

          const data = categories.map((cat) => {
            if (cat === "ALL") {
              const a = aggregateMonthAll(
                monthKey,
                countriesSet,
                mediasSet,
                productsSet
              );
              return metric === "D1"
                ? safeDiv(a.d1, a.reg)
                : safeDiv(a.d7, a.reg);
            }
            const a = monthAgg[cat] || { reg: 0, d1: 0, d7: 0 };
            return metric === "D1" ? safeDiv(a.d1, a.reg) : safeDiv(a.d7, a.reg);
          });

          series.push({
            name: `${formatMonthLabel(monthKey)}${
              metric === "D1" ? "次留" : "七留"
            }`,
            type: "bar",
            data,
            barMaxWidth: 22,
            itemStyle: isSecondary
              ? {
                  color: baseColor,
                  decal,
                  opacity: 0.98,
                }
              : { color: baseColor },
            emphasis: { focus: "series" },
          });
        });
      });

      chart.setOption(
        {
          tooltip: {
            trigger: "axis",
            axisPointer: { type: "shadow" },
            valueFormatter: (v) => formatPct01(v, 2),
          },
          legend: { type: "scroll" },
          grid: { left: 48, right: 18, top: 44, bottom: 44 },
          xAxis: {
            type: "category",
            data: categories,
            axisLabel: { interval: 0 },
          },
          yAxis: {
            type: "value",
            name: "%",
            axisLabel: { formatter: (v) => formatPct01(v, 0) },
          },
          series,
        },
        true
      );
    }

    // ============ 图表：折线图（日级） ============
    function renderLineChart(months, metrics, countriesSet, mediasSet, productsSet) {
      const includeCountry = !state.countryMerge;
      const includeMedia = !state.mediaMerge;
      const includeProduct = !state.productMerge;

      const dateSet = new Set();
      const bucket = {}; // groupKey -> date -> agg

      const sortedMonths = months.slice().sort();

      sortedMonths.forEach((monthKey) => {
        const rows = RAW[monthKey] || [];
        rows.forEach((r) => {
          if (!r || !r.date) return;

          const c = normCountry(r.country);
          const m = normMedia(r.media);
          const p = normProduct(r.productType);

          if (countriesSet.size && !countriesSet.has(c)) return;
          if (mediasSet.size && !mediasSet.has(m)) return;
          if (productsSet.size && !productsSet.has(p)) return;

          dateSet.add(r.date);

          const parts = [];
          if (includeCountry) parts.push(c);
          if (includeMedia) parts.push(m);
          if (includeProduct) parts.push(p);

          const key = parts.length ? parts.join(" | ") : "ALL";

          if (!bucket[key]) bucket[key] = {};
          if (!bucket[key][r.date])
            bucket[key][r.date] = { reg: 0, d1: 0, d7: 0 };

          bucket[key][r.date].reg += n(r.registration);
          bucket[key][r.date].d1 += n(r.D1_retained_users);
          bucket[key][r.date].d7 += n(r.D7_retained_users);
        });
      });

      const dates = Array.from(dateSet).sort(sortDates);

      // series：按 groupKey × metric
      const groupKeys = Object.keys(bucket).sort();
      const series = [];
      groupKeys.forEach((gKey) => {
        const byDate = bucket[gKey] || {};
        metrics.forEach((metric) => {
          const isSecondary = metric === "D7";
          const lineStyle = isSecondary ? { type: "solid" } : { type: "dashed" };

          const data = dates.map((d) => {
            const a = byDate[d];
            if (!a) return null;
            return metric === "D1" ? safeDiv(a.d1, a.reg) : safeDiv(a.d7, a.reg);
          });

          series.push({
            name: `${gKey} · ${metric === "D1" ? "次留" : "七留"}`,
            type: "line",
            symbolSize: 3,
            connectNulls: true,
            lineStyle,
            data,
          });
        });
      });

      chart.setOption(
        {
          tooltip: {
            trigger: "axis",
            valueFormatter: (v) => formatPct01(v, 2),
          },
          legend: { type: "scroll" },
          grid: { left: 48, right: 18, top: 44, bottom: 44 },
          xAxis: {
            type: "category",
            data: dates,
            axisLabel: { formatter: (v) => String(v).slice(5) },
          },
          yAxis: {
            type: "value",
            name: "%",
            axisLabel: { formatter: (v) => formatPct01(v, 0) },
          },
          series,
        },
        true
      );
    }

    // ============ 表格 ============
    function renderTable(months, metrics, countriesSet, mediasSet, productsSet) {
      const titleEl = document.getElementById("title-paid-retention-table");
      const tableEl = document.getElementById("table-paid-retention");
      if (!tableEl) return;

      const titleSuffix = buildTitleSuffix();
      if (titleEl) {
        titleEl.textContent = `当前筛选 · 次留 / 七留（月度）${titleSuffix}`;
      }

      // 表：bar 模式=按国家；line 模式=按折线的分组维度
      const isLine = state.view === "line";
      const includeCountry = isLine ? !state.countryMerge : true;
      const includeMedia = isLine ? !state.mediaMerge : false;
      const includeProduct = isLine ? !state.productMerge : false;

      const leftCols = [];
      if (includeCountry) leftCols.push({ key: "country", label: "国家" });
      if (includeMedia) leftCols.push({ key: "media", label: "媒体" });
      if (includeProduct) leftCols.push({ key: "product", label: "形态" });

      // 计算：groupKey(without metric) -> month -> {d1Rate,d7Rate}
      const agg = aggregateTable(months, countriesSet, mediasSet, productsSet, {
        includeCountry,
        includeMedia,
        includeProduct,
      });

      const groupKeys = Object.keys(agg).sort();
      const header1 = leftCols
        .map((c) => `<th>${escapeHtml(c.label)}</th>`)
        .join("");
      const monthHeaders = months
        .slice()
        .sort()
        .map((m) => {
          return metrics
            .map(
              (metric) =>
                `<th>${escapeHtml(
                  formatMonthLabel(m) + (metric === "D1" ? "次留" : "七留")
                )}</th>`
            )
            .join("");
        })
        .join("");

      let thead = `<thead><tr>${header1}${monthHeaders}</tr></thead>`;

      let tbodyRows = "";
      groupKeys.forEach((gKey) => {
        const info = decodeGroupKey(gKey, {
          includeCountry,
          includeMedia,
          includeProduct,
        });

        const leftTds = leftCols
          .map((c) => {
            const v = info[c.key] || "ALL";
            return `<td>${escapeHtml(v)}</td>`;
          })
          .join("");

        const cells = months
          .slice()
          .sort()
          .map((m) => {
            const cell =
              agg[gKey] && agg[gKey][m]
                ? agg[gKey][m]
                : { D1: null, D7: null };
            return metrics
              .map((metric) => {
                const v = cell[metric];
                return `<td class="num">${escapeHtml(
                  formatPct01(v, 2)
                )}</td>`;
              })
              .join("");
          })
          .join("");

        tbodyRows += `<tr>${leftTds}${cells}</tr>`;
      });

      const tbody = `<tbody>${
        tbodyRows ||
        `<tr><td colspan="${
          leftCols.length + months.length * metrics.length
        }">暂无数据</td></tr>`
      }</tbody>`;

      tableEl.innerHTML = thead + tbody;
    }

    function buildTitleSuffix() {
      // 按你的要求：表名后括号里拼媒体+形态
      const parts = [];
      parts.push(
        state.mediaMerge
          ? "媒体：全选不区分"
          : (state.medias || []).map(normMedia).join("+") || "媒体：全部"
      );
      parts.push(
        state.productMerge
          ? "形态：全选不区分"
          : (state.productTypes || [])
              .map(normProduct)
              .map((p) => (p === "APP" ? "APP" : p))
              .join("+") || "形态：全部"
      );
      return parts.length ? `（${parts.join("，")}）` : "";
    }

    function aggregateTable(months, countriesSet, mediasSet, productsSet, opt) {
      const includeCountry = !!opt.includeCountry;
      const includeMedia = !!opt.includeMedia;
      const includeProduct = !!opt.includeProduct;

      const res = {}; // gKey -> month -> {reg,d1,d7} then -> rate
      months.forEach((monthKey) => {
        const rows = RAW[monthKey] || [];
        rows.forEach((r) => {
          if (!r) return;
          const c = normCountry(r.country);
          const m = normMedia(r.media);
          const p = normProduct(r.productType);

          if (countriesSet.size && !countriesSet.has(c)) return;
          if (mediasSet.size && !mediasSet.has(m)) return;
          if (productsSet.size && !productsSet.has(p)) return;

          const parts = [];
          if (includeCountry) parts.push(c);
          if (includeMedia) parts.push(m);
          if (includeProduct) parts.push(p);
          const gKey = parts.length ? parts.join(" | ") : "ALL";

          if (!res[gKey]) res[gKey] = {};
          if (!res[gKey][monthKey])
            res[gKey][monthKey] = { reg: 0, d1: 0, d7: 0 };

          res[gKey][monthKey].reg += n(r.registration);
          res[gKey][monthKey].d1 += n(r.D1_retained_users);
          res[gKey][monthKey].d7 += n(r.D7_retained_users);
        });
      });

      // 转成 rate
      Object.keys(res).forEach((gKey) => {
        Object.keys(res[gKey]).forEach((monthKey) => {
          const a = res[gKey][monthKey];
          res[gKey][monthKey] = {
            D1: safeDiv(a.d1, a.reg),
            D7: safeDiv(a.d7, a.reg),
          };
        });
      });

      return res;
    }

    function decodeGroupKey(groupKey, opt) {
      const includeCountry = !!opt.includeCountry;
      const includeMedia = !!opt.includeMedia;
      const includeProduct = !!opt.includeProduct;

      if (groupKey === "ALL") return {};

      const parts = String(groupKey).split(" | ");
      const out = {};
      let i = 0;
      if (includeCountry) out.country = parts[i++] || "";
      if (includeMedia) out.media = parts[i++] || "";
      if (includeProduct) out.product = parts[i++] || "";
      return out;
    }

    // 汇总：单月 × 国家
    function aggregateMonthByCountry(monthKey, countriesSet, mediasSet, productsSet) {
      const out = {};
      (RAW[monthKey] || []).forEach((r) => {
        if (!r) return;
        const c = normCountry(r.country);
        const m = normMedia(r.media);
        const p = normProduct(r.productType);

        if (countriesSet.size && !countriesSet.has(c)) return;
        if (mediasSet.size && !mediasSet.has(m)) return;
        if (productsSet.size && !productsSet.has(p)) return;

        if (!out[c]) out[c] = { reg: 0, d1: 0, d7: 0 };
        out[c].reg += n(r.registration);
        out[c].d1 += n(r.D1_retained_users);
        out[c].d7 += n(r.D7_retained_users);
      });
      return out;
    }

    function aggregateMonthAll(monthKey, countriesSet, mediasSet, productsSet) {
      let reg = 0,
        d1 = 0,
        d7 = 0;
      (RAW[monthKey] || []).forEach((r) => {
        if (!r) return;
        const c = normCountry(r.country);
        const m = normMedia(r.media);
        const p = normProduct(r.productType);

        if (countriesSet.size && !countriesSet.has(c)) return;
        if (mediasSet.size && !mediasSet.has(m)) return;
        if (productsSet.size && !productsSet.has(p)) return;

        reg += n(r.registration);
        d1 += n(r.D1_retained_users);
        d7 += n(r.D7_retained_users);
      });
      return { reg, d1, d7 };
    }

    // ============ UI helpers ============
    function ensureModuleUI(cardEl) {
      const controls = cardEl.querySelector(".chart-controls");
      if (!controls) return {};

      // 如果你 index.html 已经写了这些容器，就不重复注入
      let monthsEl = document.getElementById("retention-months");
      let countriesEl = document.getElementById("retention-countries");
      let mediasEl = document.getElementById("retention-medias");
      let productTypesEl = document.getElementById("retention-productTypes");
      let metricsEl = document.getElementById("retention-metrics");
      let viewEl = document.getElementById("retention-view");

      if (monthsEl && countriesEl && mediasEl && productTypesEl && metricsEl && viewEl) {
        return { monthsEl, countriesEl, mediasEl, productTypesEl, metricsEl, viewEl };
      }

      // 兜底：用 JS 生成筛选器（与 organic-monthly 的 chip 风格一致）
      controls.innerHTML = `
        <div class="chart-mini-filter">
          <span class="chart-mini-label">月份：</span>
          <div class="chart-mini-chips" id="retention-months"></div>
        </div>
        <div class="chart-mini-filter">
          <span class="chart-mini-label">国家：</span>
          <div class="chart-mini-chips" id="retention-countries"></div>
        </div>
        <div class="chart-mini-filter">
          <span class="chart-mini-label">媒体：</span>
          <div class="chart-mini-chips" id="retention-medias"></div>
        </div>
        <div class="chart-mini-filter">
          <span class="chart-mini-label">形态：</span>
          <div class="chart-mini-chips" id="retention-productTypes"></div>
        </div>
        <div class="chart-mini-filter">
          <span class="chart-mini-label">留存：</span>
          <div class="chart-mini-chips" id="retention-metrics"></div>
        </div>
        <div class="chart-mini-radio" id="retention-view">
          <label><input type="radio" name="retention-view" value="bar">月度柱状图</label>
          <label><input type="radio" name="retention-view" value="line">日级折线图</label>
        </div>
        <span class="chart-badge">单位：%</span>
      `;

      monthsEl = document.getElementById("retention-months");
      countriesEl = document.getElementById("retention-countries");
      mediasEl = document.getElementById("retention-medias");
      productTypesEl = document.getElementById("retention-productTypes");
      metricsEl = document.getElementById("retention-metrics");
      viewEl = document.getElementById("retention-view");

      // 默认选中 bar
      const barRadio = viewEl && viewEl.querySelector('input[value="bar"]');
      if (barRadio) barRadio.checked = true;

      return { monthsEl, countriesEl, mediasEl, productTypesEl, metricsEl, viewEl };
    }

    function createMultiSelectChips(opts) {
      const container = opts.container;
      const values = Array.isArray(opts.values) ? opts.values : [];
      const stateArray = Array.isArray(opts.stateArray) ? opts.stateArray : [];
      const max = typeof opts.max === "number" ? opts.max : null;
      const getLabel = typeof opts.getLabel === "function" ? opts.getLabel : (v) => v;
      const onChange = typeof opts.onChange === "function" ? opts.onChange : function () {};
      const preselect = opts.preselect;

      if (!container) return;

      // 初始化 stateArray
      if (stateArray.length === 0) {
        if (preselect === "all") {
          stateArray.push.apply(stateArray, values);
        } else if (typeof preselect === "number" && preselect > 0) {
          const slice = values.slice(-preselect);
          stateArray.push.apply(stateArray, slice);
        } else if (values.length) {
          stateArray.push(values[values.length - 1]);
        }
      }

      container.innerHTML = "";
      values.forEach((value) => {
        const labelEl = document.createElement("label");
        labelEl.className = "filter-chip";

        const input = document.createElement("input");
        input.type = "checkbox";
        input.value = value;

        const selected = stateArray.indexOf(value) !== -1;
        input.checked = selected;
        if (selected) labelEl.classList.add("filter-chip-active");

        labelEl.appendChild(input);
        labelEl.appendChild(document.createTextNode(getLabel(value)));

        input.addEventListener("change", () => {
          const existsIndex = stateArray.indexOf(value);

          if (input.checked) {
            if (max && stateArray.length >= max && existsIndex === -1) {
              input.checked = false;
              return;
            }
            if (existsIndex === -1) stateArray.push(value);
          } else {
            if (existsIndex !== -1) stateArray.splice(existsIndex, 1);
          }

          labelEl.classList.toggle("filter-chip-active", input.checked);
          onChange();
        });

        container.appendChild(labelEl);
      });

      onChange();
    }

    function createMultiSelectChipsWithMerge(opts) {
      const container = opts.container;
      const values = Array.isArray(opts.values) ? opts.values : [];
      const stateArray = Array.isArray(opts.stateArray) ? opts.stateArray : [];
      const getLabel = typeof opts.getLabel === "function" ? opts.getLabel : (v) => v;
      const onChange = typeof opts.onChange === "function" ? opts.onChange : function () {};
      const mergeGetter = typeof opts.mergeGetter === "function" ? opts.mergeGetter : () => false;
      const mergeSetter = typeof opts.mergeSetter === "function" ? opts.mergeSetter : function () {};

      if (!container) return;

      // merge 默认打开时，stateArray 强制全选
      if (mergeGetter() && stateArray.length !== values.length) {
        stateArray.length = 0;
        stateArray.push.apply(stateArray, values);
      }
      // stateArray 为空时默认全选
      if (stateArray.length === 0) {
        stateArray.push.apply(stateArray, values);
      }

      container.innerHTML = "";

      // 1) merge chip
      const mergeLabel = document.createElement("label");
      mergeLabel.className = "filter-chip";

      const mergeInput = document.createElement("input");
      mergeInput.type = "checkbox";
      mergeInput.value = "__MERGE__";
      mergeInput.checked = !!mergeGetter();

      if (mergeInput.checked) mergeLabel.classList.add("filter-chip-active");

      mergeLabel.appendChild(mergeInput);
      mergeLabel.appendChild(document.createTextNode("全选但不区分"));

      mergeInput.addEventListener("change", () => {
        const on = !!mergeInput.checked;
        mergeSetter(on);

        if (on) {
          // 强制全选并禁用其它项
          stateArray.length = 0;
          stateArray.push.apply(stateArray, values);
        }

        // 重新渲染一遍，确保禁用/选中态一致
        createMultiSelectChipsWithMerge(opts);
        onChange();
      });

      container.appendChild(mergeLabel);

      // 2) normal chips
      values.forEach((value) => {
        const labelEl = document.createElement("label");
        labelEl.className = "filter-chip";

        const input = document.createElement("input");
        input.type = "checkbox";
        input.value = value;

        const selected = stateArray.indexOf(value) !== -1;
        input.checked = selected;
        if (selected) labelEl.classList.add("filter-chip-active");

        // merge 开启：禁用其它项，减少误操作
        input.disabled = !!mergeGetter();

        labelEl.appendChild(input);
        labelEl.appendChild(document.createTextNode(getLabel(value)));

        input.addEventListener("change", () => {
          const existsIndex = stateArray.indexOf(value);

          if (input.checked) {
            if (existsIndex === -1) stateArray.push(value);
          } else {
            if (existsIndex !== -1) stateArray.splice(existsIndex, 1);
          }

          labelEl.classList.toggle("filter-chip-active", input.checked);

          // 如果用户手动改了选择，merge 自动关闭（更符合直觉）
          if (mergeGetter()) {
            mergeSetter(false);
            // 重新 render，恢复禁用状态
            createMultiSelectChipsWithMerge(opts);
          }

          onChange();
        });

        container.appendChild(labelEl);
      });

      onChange();
    }

    function bindViewToggle(viewEl, st, key, onChange) {
      if (!viewEl) return;
      const inputs = Array.from(viewEl.querySelectorAll("input[type=radio]"));
      if (!inputs.length) return;

      // init
      inputs.forEach((i) => {
        if (i.value === st[key]) i.checked = true;
      });

      inputs.forEach((input) => {
        input.addEventListener("change", () => {
          if (!input.checked) return;
          st[key] = input.value;
          if (typeof onChange === "function") onChange();
        });
      });
    }

    // ============ Table section (optional) ============
    function ensureTableSection(cardEl) {
      let section = cardEl.querySelector(".chart-table-section");
      if (section) return;

      section = document.createElement("div");
      section.className = "chart-table-section";
      section.innerHTML = `
        <div class="chart-table-title" id="title-paid-retention-table">当前筛选 · 次留 / 七留（月度）</div>
        <div class="chart-table-wrapper">
          <table id="table-paid-retention" class="chart-table"></table>
        </div>
      `;
      cardEl.appendChild(section);
    }

    function injectTableStylesOnce() {
      if (document.getElementById("paid-table-styles")) return;
      const style = document.createElement("style");
      style.id = "paid-table-styles";
      style.textContent = `
        .chart-table-section{margin-top:10px;border-top:1px dashed rgba(148,163,184,.5);padding-top:10px}
        .chart-table-title{font-size:12px;color:rgba(15,23,42,.86);font-weight:600;margin-bottom:8px}
        .chart-table-wrapper{overflow:auto;border:1px solid rgba(148,163,184,.35);border-radius:12px;background:rgba(255,255,255,.7)}
        .chart-table{width:100%;border-collapse:collapse;min-width:680px}
        .chart-table th,.chart-table td{padding:8px 10px;border-bottom:1px solid rgba(148,163,184,.18);font-size:11px;white-space:nowrap}
        .chart-table th{position:sticky;top:0;background:rgba(249,250,251,.95);z-index:1;color:rgba(15,23,42,.78);text-align:left}
        .chart-table td.num{text-align:right;font-variant-numeric:tabular-nums}
        .chart-table tr:hover td{background:rgba(37,99,235,.04)}
      `;
      document.head.appendChild(style);
    }

    function escapeHtml(s) {
      const str = String(s === null || s === undefined ? "" : s);
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }
  }

  // 注册到看板
  if (
    window.PaidDashboard &&
    typeof window.PaidDashboard.registerModule === "function"
  ) {
    window.PaidDashboard.registerModule("retention", init);
  } else {
    // 没有 core 的情况下也能跑
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  }
})();
