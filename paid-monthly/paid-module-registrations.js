/**
 * paid-module-registrations.js
 * 模块1：买量注册数（柱状/月度 vs 折线/日度）+ 月度数据表（注册数、注册单价）
 *
 * 依赖：
 * - window.echarts
 * - window.RAW_PAID_BY_MONTH（来自 paid-data.js）
 * - （可选）window.PaidDashboard（用于 registerChart / 复用格式化）
 */
(function () {
  "use strict";

  const MODULE_KEY = "reg";
  const CARD_ID = "card-paid-registrations";
  const CHART_ID = "chart-paid-registrations";

  // 国家显示固定顺序（缺国家也保留占位）
  const COUNTRY_ORDER = ["GH", "KE", "NG", "TZ"];
  const NO_SPLIT_TOKEN = "__ALL_NO_SPLIT__";

  function getRaw() {
    return window.RAW_PAID_BY_MONTH || {};
  }

  function isMonthKey(k) {
    return /^\d{4}-\d{2}$/.test(String(k || ""));
  }

  function safeNumber(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  function safeDiv(a, b) {
    const na = Number(a);
    const nb = Number(b);
    if (!Number.isFinite(na) || !Number.isFinite(nb) || nb === 0) return null;
    return na / nb;
  }

  function formatInteger(v) {
    if (v == null || !Number.isFinite(Number(v))) return "-";
    return Math.round(Number(v)).toLocaleString();
  }

  function formatUSD(v, digits) {
    const d = typeof digits === "number" ? digits : 2;
    if (v == null || !Number.isFinite(Number(v))) return "-";
    return Number(v).toLocaleString(undefined, {
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    });
  }

  function formatAxisK(v) {
    const n = Number(v);
    if (!Number.isFinite(n)) return "-";
    return n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(n);
  }

  function formatMonthShort(month) {
    if (!month) return "";
    const parts = String(month).split("-");
    if (parts.length === 2) {
      const m = parseInt(parts[1], 10);
      if (!Number.isNaN(m)) return m + "月";
    }
    return String(month);
  }

  function normCountry(v) {
    return String(v || "").toUpperCase().trim();
  }

  function normMedia(v) {
    return String(v || "").toUpperCase().trim();
  }

  function normProductType(v) {
    const t = String(v || "").trim();
    if (!t) return "";
    if (t.toUpperCase() === "H5") return "H5";
    if (t.toLowerCase() === "app") return "APP";
    return t.toUpperCase();
  }

  function sortCountriesForDisplay(countries) {
    const input = new Set((countries || []).map(normCountry).filter(Boolean));
    const res = [];
    COUNTRY_ORDER.forEach((c) => {
      if (input.has(c)) res.push(c);
    });
    // 其他国家：按字母排序补在后面
    Array.from(input)
      .filter((c) => COUNTRY_ORDER.indexOf(c) === -1)
      .sort()
      .forEach((c) => res.push(c));
    return res;
  }

  function gatherOptions() {
    const raw = getRaw();
    const months = Object.keys(raw).filter(isMonthKey).sort();

    const cSet = new Set();
    const mSet = new Set();
    const pSet = new Set();

    months.forEach((month) => {
      const rows = raw[month] || [];
      rows.forEach((r) => {
        if (!r) return;
        const c = normCountry(r.country);
        const m = normMedia(r.media);
        const p = normProductType(r.productType);
        if (c) cSet.add(c);
        if (m) mSet.add(m);
        if (p) pSet.add(p);
      });
    });

    // 固定国家顺序：即使暂无数据也给用户选项
    COUNTRY_ORDER.forEach((c) => cSet.add(c));

    return {
      months,
      countries: sortCountriesForDisplay(Array.from(cSet)),
      medias: Array.from(mSet).sort(),
      productTypes: Array.from(pSet).sort(),
    };
  }

  function ensureTableStylesOnce() {
    if (document.getElementById("paid-table-styles")) return;
    const style = document.createElement("style");
    style.id = "paid-table-styles";
    style.textContent = `
      .chart-table-section{margin-top:6px;padding-top:6px;border-top:1px dashed rgba(148,163,184,.5)}
      .chart-table-title{font-size:11px;color:var(--text-sub);margin-bottom:4px}
      .chart-table-wrapper{max-height:260px;overflow:auto;border-radius:6px;border:1px solid rgba(209,213,219,.9);background:#ffffff}
      table.chart-table{width:100%;border-collapse:collapse;font-size:11px}
      .chart-table thead th,.chart-table tbody td{padding:4px 8px;border-bottom:1px solid #f3f4f6;white-space:nowrap}
      .chart-table thead th{position:sticky;top:0;z-index:1;background:#f9fafb;text-align:center;font-weight:500;color:var(--text-sub)}
      .chart-table tbody tr:nth-child(odd) td{background:#fcfcff}
      .chart-table tbody tr:hover td{background:#eef2ff}
      .chart-table td.num{text-align:right;font-variant-numeric:tabular-nums}
      .chart-table td.dim{text-align:left}
    `;
    document.head.appendChild(style);
  }

  function ensureLayout() {
    const card = document.getElementById(CARD_ID);
    const chartEl = document.getElementById(CHART_ID);
    if (!card || !chartEl) return null;

    // 1) 控制区：如果 index 里没写筛选器，就由本模块补齐
    const controls = card.querySelector(".chart-controls");
    if (controls && !controls.querySelector("[data-paid-reg-controls]")) {
      const name = "paid-reg-view";
      controls.innerHTML = `
        <span class="chart-badge">单位：人</span>
        <div class="chart-mini-filter" data-paid-reg-controls>
          <span class="chart-mini-label">视图：</span>
          <div class="chart-mini-radio">
            <label><input type="radio" name="${name}" value="bar" checked /> 柱状（月度）</label>
            <label><input type="radio" name="${name}" value="line" /> 折线（日度）</label>
          </div>
        </div>
        <div class="chart-mini-filter">
          <span class="chart-mini-label">月份：</span>
          <div class="chart-mini-chips" id="paid-reg-months"></div>
        </div>
        <div class="chart-mini-filter">
          <span class="chart-mini-label">国家：</span>
          <div class="chart-mini-chips" id="paid-reg-countries"></div>
        </div>
        <div class="chart-mini-filter">
          <span class="chart-mini-label">媒体：</span>
          <div class="chart-mini-chips" id="paid-reg-medias"></div>
        </div>
        <div class="chart-mini-filter">
          <span class="chart-mini-label">形态：</span>
          <div class="chart-mini-chips" id="paid-reg-productTypes"></div>
        </div>
      `;
    }

    // 2) 表格区：如果 index 里没写表格，就补齐（插在 analysis 下方）
    ensureTableStylesOnce();

    let titleEl = card.querySelector("#paid-reg-table-title");
    let tableEl = card.querySelector("#table-paid-registrations");
    if (!titleEl || !tableEl) {
      const summary =
        card.querySelector('.chart-summary[data-analysis-key="reg"]') ||
        card.querySelector(".chart");
      const section = document.createElement("div");
      section.className = "chart-table-section";
      section.innerHTML = `
        <div class="chart-table-title" id="paid-reg-table-title"></div>
        <div class="chart-table-wrapper">
          <table id="table-paid-registrations" class="chart-table"></table>
        </div>
      `;
      if (summary && summary.parentNode)
        summary.parentNode.insertBefore(section, summary.nextSibling);
      else card.appendChild(section);

      titleEl = card.querySelector("#paid-reg-table-title");
      tableEl = card.querySelector("#table-paid-registrations");
    }

    return {
      card,
      chartEl,
      viewName: "paid-reg-view",
      monthsEl: card.querySelector("#paid-reg-months"),
      countriesEl: card.querySelector("#paid-reg-countries"),
      mediasEl: card.querySelector("#paid-reg-medias"),
      productTypesEl: card.querySelector("#paid-reg-productTypes"),
      tableTitleEl: titleEl,
      tableEl: tableEl,
    };
  }

  // 基础 chips（多选，支持 max）
  function renderChips(container, values, selectedArray, opts) {
    if (!container) return;
    const max = opts && opts.max ? opts.max : null;
    const getLabel = opts && opts.getLabel ? opts.getLabel : null;
    const onChange = opts && opts.onChange ? opts.onChange : null;

    if (!Array.isArray(selectedArray)) return;

    // 默认全选
    if (selectedArray.length === 0) {
      values.forEach((v) => selectedArray.push(v));
    }

    container.innerHTML = "";
    values.forEach((value, idx) => {
      const labelEl = document.createElement("label");
      labelEl.className = "filter-chip";

      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = value;

      const selected = selectedArray.indexOf(value) !== -1;
      input.checked = selected;
      if (selected) labelEl.classList.add("filter-chip-active");

      labelEl.appendChild(input);
      labelEl.appendChild(
        document.createTextNode(
          typeof getLabel === "function" ? getLabel(value, idx) : value
        )
      );

      input.addEventListener("change", () => {
        const existsIndex = selectedArray.indexOf(value);

        if (input.checked) {
          if (max && selectedArray.length >= max && existsIndex === -1) {
            // 超出上限，回滚勾选
            input.checked = false;
            return;
          }
          if (existsIndex === -1) selectedArray.push(value);
        } else {
          if (existsIndex !== -1) selectedArray.splice(existsIndex, 1);
          // 保底：至少选 1 个
          if (selectedArray.length === 0) selectedArray.push(value);
        }

        if (typeof onChange === "function") onChange();
      });

      container.appendChild(labelEl);
    });
  }

  // chips（多选 + “全选但不区分”）
  function renderChipsWithNoSplit(container, values, state, key, opts) {
    if (!container) return;
    const getLabel = opts && opts.getLabel ? opts.getLabel : null;
    const onChange = opts && opts.onChange ? opts.onChange : null;

    const selectedArray = state[key];
    if (!Array.isArray(selectedArray)) return;
    if (!state.noSplit) state.noSplit = {};
    const ns = !!state.noSplit[key];

    // 默认全选
    if (selectedArray.length === 0) values.forEach((v) => selectedArray.push(v));

    const allValues = [NO_SPLIT_TOKEN].concat(values);

    container.innerHTML = "";
    allValues.forEach((value, idx) => {
      const labelEl = document.createElement("label");
      labelEl.className = "filter-chip";

      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = value;

      const isNoSplit = value === NO_SPLIT_TOKEN;
      const checked = isNoSplit ? ns : selectedArray.indexOf(value) !== -1;
      input.checked = checked;
      if (checked) labelEl.classList.add("filter-chip-active");

      labelEl.appendChild(input);
      labelEl.appendChild(
        document.createTextNode(
          isNoSplit
            ? "全选但不区分"
            : typeof getLabel === "function"
            ? getLabel(value, idx)
            : value
        )
      );

      input.addEventListener("change", () => {
        if (isNoSplit) {
          if (input.checked) {
            state.noSplit[key] = true;
            // 勾上即全选
            selectedArray.length = 0;
            values.forEach((v) => selectedArray.push(v));
          } else {
            state.noSplit[key] = false;
            // 取消不区分：保留全选
            if (selectedArray.length === 0)
              values.forEach((v) => selectedArray.push(v));
          }
        } else {
          // 点击具体项：一旦做“筛选”，就退出不区分
          if (state.noSplit[key]) state.noSplit[key] = false;

          const existsIndex = selectedArray.indexOf(value);
          if (input.checked) {
            if (existsIndex === -1) selectedArray.push(value);
          } else {
            if (existsIndex !== -1) selectedArray.splice(existsIndex, 1);
            if (selectedArray.length === 0) selectedArray.push(value);
          }
        }

        if (typeof onChange === "function") onChange();
      });

      container.appendChild(labelEl);
    });
  }

  function setChartNoData(chart, msg) {
    try {
      chart.clear();
      chart.setOption(
        {
          title: {
            text: msg || "暂无数据",
            left: "center",
            top: "middle",
            textStyle: { color: "#94a3b8", fontSize: 12, fontWeight: 500 },
          },
          xAxis: { show: false },
          yAxis: { show: false },
          series: [],
        },
        true
      );
    } catch (e) {}
  }

  function renderEmptyTable(table) {
    table.innerHTML = "";
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");
    tr.innerHTML = '<th style="text-align:left">暂无数据</th>';
    thead.appendChild(tr);
    table.appendChild(thead);
  }

  function makeTableTitle(state) {
    const mediaPart = state.noSplit.medias
      ? "全媒体不区分"
      : (state.medias || []).map((m) => normMedia(m)).join("+") || "媒体-";
    const ptPart = state.noSplit.productTypes
      ? "全形态不区分"
      : (state.productTypes || []).map((p) => normProductType(p)).join("+") || "形态-";
    return `当前筛选 · 买量注册数 & 注册单价（月度汇总）（${mediaPart}，${ptPart}）`;
  }

  // 月度聚合（注册数+spent）
  function aggMonth(month, state, mode) {
    const raw = getRaw();
    const rows = raw[month] || [];

    const wantCountries = (state.countries || []).map(normCountry);
    const wantMedias = (state.medias || []).map(normMedia);
    const wantPT = (state.productTypes || []).map(normProductType);

    const noSplitCountry = !!state.noSplit.countries;
    const noSplitMedia = mode === "line" ? !!state.noSplit.medias : true; // bar 模式不拆媒体
    const noSplitPT = mode === "line" ? !!state.noSplit.productTypes : true; // bar 模式不拆形态

    // key -> { dims, registration, spent }
    const map = new Map();

    rows.forEach((r) => {
      if (!r) return;

      const c0 = normCountry(r.country);
      const m0 = normMedia(r.media);
      const p0 = normProductType(r.productType);

      if (!c0 || !m0 || !p0) return;

      // 过滤（注意：noSplit 只是“不区分”，过滤仍基于当前选择）
      if (!wantMedias.includes(m0) || !wantPT.includes(p0)) return;
      if (!noSplitCountry && !wantCountries.includes(c0)) return;

      const c = noSplitCountry ? "ALL" : c0;
      const m = noSplitMedia ? "ALL" : m0;
      const p = noSplitPT ? "ALL" : p0;

      const key = [c, m, p].join("|");
      if (!map.has(key)) {
        map.set(key, {
          dims: { country: c, media: m, productType: p },
          registration: 0,
          spent: 0,
        });
      }
      const obj = map.get(key);
      obj.registration += safeNumber(r.registration);
      obj.spent += safeNumber(r.spent);
    });

    return map;
  }

  // 日度聚合（注册数）
  function aggDaily(months, state) {
    const raw = getRaw();

    const wantCountries = (state.countries || []).map(normCountry);
    const wantMedias = (state.medias || []).map(normMedia);
    const wantPT = (state.productTypes || []).map(normProductType);

    const noSplitCountry = !!state.noSplit.countries;
    const noSplitMedia = !!state.noSplit.medias;
    const noSplitPT = !!state.noSplit.productTypes;

    const dateSet = new Set();
    const seriesMap = new Map(); // key -> {dims, byDate: Map(date->sum)}

    (months || []).forEach((month) => {
      const rows = raw[month] || [];
      rows.forEach((r) => {
        if (!r || !r.date) return;
        const date = String(r.date);
        const c0 = normCountry(r.country);
        const m0 = normMedia(r.media);
        const p0 = normProductType(r.productType);
        if (!c0 || !m0 || !p0) return;

        if (!wantMedias.includes(m0) || !wantPT.includes(p0)) return;
        if (!noSplitCountry && !wantCountries.includes(c0)) return;

        dateSet.add(date);

        const c = noSplitCountry ? "ALL" : c0;
        const m = noSplitMedia ? "ALL" : m0;
        const p = noSplitPT ? "ALL" : p0;

        const key = [c, m, p].join("|");
        if (!seriesMap.has(key)) {
          seriesMap.set(key, {
            dims: { country: c, media: m, productType: p },
            byDate: new Map(),
          });
        }
        const obj = seriesMap.get(key);
        const prev = obj.byDate.get(date) || 0;
        obj.byDate.set(date, prev + safeNumber(r.registration));
      });
    });

    const dates = Array.from(dateSet).sort(); // YYYY-MM-DD 直接字典序即可
    const seriesRecords = Array.from(seriesMap.values());

    // 排序：国家优先按固定顺序，其次媒体、形态
    seriesRecords.sort((a, b) => {
      const ca = a.dims.country;
      const cb = b.dims.country;
      const ia = COUNTRY_ORDER.indexOf(ca);
      const ib = COUNTRY_ORDER.indexOf(cb);
      const oa = ia === -1 ? 999 : ia;
      const ob = ib === -1 ? 999 : ib;
      if (oa !== ob) return oa - ob;
      if (a.dims.media !== b.dims.media)
        return String(a.dims.media).localeCompare(String(b.dims.media));
      return String(a.dims.productType).localeCompare(String(b.dims.productType));
    });

    return { dates, seriesRecords };
  }

  function buildLineSeriesName(dims, state) {
    const parts = [];
    if (!state.noSplit.countries) parts.push(dims.country);
    if (!state.noSplit.medias) parts.push(dims.media);
    if (!state.noSplit.productTypes) parts.push(normProductType(dims.productType));
    return parts.length ? parts.join(" · ") : "ALL";
  }

  function init() {
    const refs = ensureLayout();
    if (!refs || !refs.chartEl || !window.echarts) return;

    const options = gatherOptions();

    const state = {
      view: "bar",
      months: [],
      countries: [],
      medias: [],
      productTypes: [],
      noSplit: { countries: false, medias: false, productTypes: false },
    };

    // 默认：最近 3 个月（不足 3 就全选）
    state.months = options.months.slice(-3);

    // 初始化 view radio
    const viewRadios = refs.card.querySelectorAll(`input[name="${refs.viewName}"]`);
    viewRadios.forEach((r) => {
      r.addEventListener("change", () => {
        if (r.checked) {
          state.view = r.value;
          renderAll();
        }
      });
    });

    const chart = echarts.init(refs.chartEl);
    if (window.PaidDashboard && typeof window.PaidDashboard.registerChart === "function") {
      window.PaidDashboard.registerChart(chart);
    } else {
      window.addEventListener("resize", () => {
        try {
          chart.resize();
        } catch (e) {}
      });
    }

    function renderTableBar(months, countries) {
      if (!refs.tableEl) return;

      const ms = (months || []).slice().sort();
      const cs = countries || [];
      if (!ms.length || !cs.length) {
        renderEmptyTable(refs.tableEl);
        return;
      }

      // 预先算每个月的聚合
      const byMonth = {};
      ms.forEach((m) => {
        byMonth[m] = aggMonth(m, state, "bar"); // bar 模式：媒体/形态不拆
      });

      const thead = document.createElement("thead");
      const headRow = document.createElement("tr");

      let headHtml = '<th class="dim">国家</th>';
      ms.forEach((m) => {
        headHtml += "<th>" + formatMonthShort(m) + " 注册数</th>";
        headHtml += "<th>" + formatMonthShort(m) + " 注册单价</th>";
      });
      headRow.innerHTML = headHtml;
      thead.appendChild(headRow);

      const tbody = document.createElement("tbody");

      cs.forEach((c) => {
        const tr = document.createElement("tr");

        const tdC = document.createElement("td");
        tdC.className = "dim";
        tdC.textContent = c === "ALL" ? "ALL" : c;
        tr.appendChild(tdC);

        ms.forEach((m) => {
          const map = byMonth[m];
          // key: country|ALL|ALL
          const key = [c, "ALL", "ALL"].join("|");
          const agg = map.get(key);

          const reg = agg ? agg.registration : null;
          const cpa = agg ? safeDiv(agg.spent, agg.registration) : null;

          const tdReg = document.createElement("td");
          tdReg.className = "num";
          tdReg.textContent = reg == null ? "-" : formatInteger(reg);
          tr.appendChild(tdReg);

          const tdCpa = document.createElement("td");
          tdCpa.className = "num";
          tdCpa.textContent = cpa == null ? "-" : formatUSD(cpa, 2);
          tr.appendChild(tdCpa);
        });

        tbody.appendChild(tr);
      });

      refs.tableEl.innerHTML = "";
      refs.tableEl.appendChild(thead);
      refs.tableEl.appendChild(tbody);
    }

    function renderTableLine(months) {
      if (!refs.tableEl) return;

      const ms = (months || []).slice().sort();
      if (!ms.length) {
        renderEmptyTable(refs.tableEl);
        return;
      }

      const byMonth = {};
      const rowMap = new Map(); // key -> dims
      ms.forEach((m) => {
        const map = aggMonth(m, state, "line");
        byMonth[m] = map;
        map.forEach((v, k) => {
          if (!rowMap.has(k)) rowMap.set(k, v.dims);
        });
      });

      const rows = Array.from(rowMap.entries()).map(([k, dims]) => ({ key: k, dims }));
      if (!rows.length) {
        renderEmptyTable(refs.tableEl);
        return;
      }

      // 排序：国家->媒体->形态
      rows.sort((a, b) => {
        const ca = a.dims.country;
        const cb = b.dims.country;
        const ia = COUNTRY_ORDER.indexOf(ca);
        const ib = COUNTRY_ORDER.indexOf(cb);
        const oa = ia === -1 ? 999 : ia;
        const ob = ib === -1 ? 999 : ib;
        if (oa !== ob) return oa - ob;
        if (a.dims.media !== b.dims.media)
          return String(a.dims.media).localeCompare(String(b.dims.media));
        return String(a.dims.productType).localeCompare(String(b.dims.productType));
      });

      const thead = document.createElement("thead");
      const headRow = document.createElement("tr");

      let headHtml = '<th class="dim">国家</th>';
      if (!state.noSplit.medias) headHtml += '<th class="dim">媒体</th>';
      if (!state.noSplit.productTypes) headHtml += '<th class="dim">形态</th>';
      ms.forEach((m) => {
        headHtml += "<th>" + formatMonthShort(m) + " 注册数</th>";
        headHtml += "<th>" + formatMonthShort(m) + " 注册单价</th>";
      });
      headRow.innerHTML = headHtml;
      thead.appendChild(headRow);

      const tbody = document.createElement("tbody");

      rows.forEach((row) => {
        const tr = document.createElement("tr");

        const tdC = document.createElement("td");
        tdC.className = "dim";
        tdC.textContent = row.dims.country === "ALL" ? "ALL" : row.dims.country;
        tr.appendChild(tdC);

        if (!state.noSplit.medias) {
          const tdM = document.createElement("td");
          tdM.className = "dim";
          tdM.textContent = row.dims.media;
          tr.appendChild(tdM);
        }

        if (!state.noSplit.productTypes) {
          const tdP = document.createElement("td");
          tdP.className = "dim";
          tdP.textContent = normProductType(row.dims.productType);
          tr.appendChild(tdP);
        }

        ms.forEach((m) => {
          const map = byMonth[m];
          const agg = map.get(row.key);

          const reg = agg ? agg.registration : null;
          const cpa = agg ? safeDiv(agg.spent, agg.registration) : null;

          const tdReg = document.createElement("td");
          tdReg.className = "num";
          tdReg.textContent = reg == null ? "-" : formatInteger(reg);
          tr.appendChild(tdReg);

          const tdCpa = document.createElement("td");
          tdCpa.className = "num";
          tdCpa.textContent = cpa == null ? "-" : formatUSD(cpa, 2);
          tr.appendChild(tdCpa);
        });

        tbody.appendChild(tr);
      });

      refs.tableEl.innerHTML = "";
      refs.tableEl.appendChild(thead);
      refs.tableEl.appendChild(tbody);
    }

    function renderBarChart(months, countries) {
      const ms = (months || []).slice().sort();
      const cs = countries || [];
      if (!ms.length || !cs.length) {
        setChartNoData(chart, "请先选择月份/国家");
        return;
      }

      const byMonth = {};
      ms.forEach((m) => {
        byMonth[m] = aggMonth(m, state, "bar");
      });

      const series = ms.map((m) => {
        const map = byMonth[m];
        const data = cs.map((c) => {
          const key = [c, "ALL", "ALL"].join("|");
          const agg = map.get(key);
          return agg ? Math.round(agg.registration) : 0;
        });
        return {
          name: formatMonthShort(m),
          type: "bar",
          barMaxWidth: 22,
          emphasis: { focus: "series" },
          data,
        };
      });

      chart.setOption(
        {
          tooltip: {
            trigger: "axis",
            axisPointer: { type: "shadow" },
            valueFormatter: (v) => (v == null ? "-" : formatInteger(v) + " 人"),
          },
          legend: { type: "scroll" },
          grid: { left: 40, right: 18, top: 42, bottom: 40, containLabel: true },
          xAxis: { type: "category", data: cs },
          yAxis: { type: "value", name: "注册数", axisLabel: { formatter: formatAxisK } },
          series,
        },
        true
      );
    }

    function renderLineChart(months) {
      const ms = (months || []).slice().sort();
      if (!ms.length) {
        setChartNoData(chart, "请先选择月份");
        return;
      }

      const { dates, seriesRecords } = aggDaily(ms, state);
      if (!dates.length || !seriesRecords.length) {
        setChartNoData(chart, "暂无匹配数据");
        return;
      }

      const series = seriesRecords.map((rec) => {
        const data = dates.map((d) => {
          const v = rec.byDate.get(d);
          return v == null ? null : Math.round(v);
        });

        return {
          name: buildLineSeriesName(rec.dims, state),
          type: "line",
          showSymbol: false,
          smooth: false,
          emphasis: { focus: "series" },
          data,
        };
      });

      chart.setOption(
        {
          tooltip: {
            trigger: "axis",
            valueFormatter: (v) => (v == null ? "-" : formatInteger(v) + " 人"),
          },
          legend: { type: "scroll" },
          grid: { left: 40, right: 18, top: 42, bottom: 52, containLabel: true },
          xAxis: {
            type: "category",
            data: dates,
            axisLabel: { formatter: (v) => String(v).slice(5) },
          },
          yAxis: { type: "value", name: "注册数", axisLabel: { formatter: formatAxisK } },
          series,
        },
        true
      );
    }

    function currentCountriesForBar() {
      if (state.noSplit.countries) return ["ALL"];
      const selected = (state.countries || []).map(normCountry).filter(Boolean);
      const ordered = sortCountriesForDisplay(selected);
      return ordered.length ? ordered : sortCountriesForDisplay(options.countries);
    }

    function renderAll() {
      // 1) chips
      renderChips(refs.monthsEl, options.months, state.months, {
        max: 3,
        getLabel: formatMonthShort,
        onChange: renderAll,
      });

      renderChipsWithNoSplit(refs.countriesEl, options.countries, state, "countries", {
        getLabel: (v) => v,
        onChange: renderAll,
      });

      renderChipsWithNoSplit(refs.mediasEl, options.medias, state, "medias", {
        getLabel: (v) => normMedia(v),
        onChange: renderAll,
      });

      renderChipsWithNoSplit(refs.productTypesEl, options.productTypes, state, "productTypes", {
        getLabel: (v) => normProductType(v),
        onChange: renderAll,
      });

      // 2) table title
      if (refs.tableTitleEl) refs.tableTitleEl.textContent = makeTableTitle(state);

      // 3) chart + table
      const selMonths = (state.months || []).slice();
      const view = state.view || "bar";

      if (view === "line") {
        renderLineChart(selMonths);
        renderTableLine(selMonths);
      } else {
        const barCountries = currentCountriesForBar();
        renderBarChart(selMonths, barCountries);
        renderTableBar(selMonths, barCountries);
      }
    }

    // 首次渲染
    renderAll();
  }

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
