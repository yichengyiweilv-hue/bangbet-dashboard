/* paid-monthly/paid-module-registrations.js
 * 模块1：买量注册数
 * - 模块内筛选：月份(<=3)、国家、媒体、产品类型、柱状/折线
 * - 国家/媒体/产品类型均提供「全选但不区分」：勾选=全选且不拆该维度
 * - 柱状图：横轴国家（GH/KE/NG/TZ 固定顺序），系列：月份×(媒体可选拆)×(产品类型可选拆)
 * - 折线图：日级别，系列：国家/媒体/产品类型按需拆分；多个月份在同一条线上连贯展示
 * - 表格：行=拆分维度组合；列=每个月注册数 & 注册单价（USD 等值/注册）
 */

(function () {
  "use strict";

  const MODULE_NAME = "paid-registrations-v2";
  const CARD_ID = "card-paid-registrations";
  const CHART_ID = "chart-paid-registrations";

  const COUNTRY_ORDER = ["GH", "KE", "NG", "TZ"];
  const MERGE_LABEL = "全选但不区分";
  const ALL = "__ALL__";

  function safeNum(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  function safeDiv(a, b) {
    const na = safeNum(a);
    const nb = safeNum(b);
    if (!nb) return null;
    return na / nb;
  }

  function fmtMonthLabel(month) {
    if (window.PaidDashboard && typeof window.PaidDashboard.formatMonthLabel === "function") {
      return window.PaidDashboard.formatMonthLabel(month);
    }
    const s = String(month || "");
    const parts = s.split("-");
    const m = parseInt(parts[1], 10);
    return Number.isFinite(m) ? `${m}月` : s;
  }
  function fmtInt(n) {
    if (window.PaidDashboard && typeof window.PaidDashboard.formatInteger === "function") {
      return window.PaidDashboard.formatInteger(n);
    }
    return Math.round(safeNum(n)).toLocaleString("en-US");
  }
  function fmtUSD(n) {
    if (window.PaidDashboard && typeof window.PaidDashboard.formatUSD === "function") {
      return window.PaidDashboard.formatUSD(n);
    }
    const val = safeNum(n);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(val);
  }

  function escapeHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function ensureExtraStyles() {
    const id = "paid-reg-extensions-style";
    if (document.getElementById(id)) return;

    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      /* ========= module extensions (table + disabled chips) ========= */
      .filter-chip.is-disabled { opacity: .55; cursor: not-allowed; }
      .filter-chip.is-disabled input { cursor: not-allowed; }

      /* ========= 图下方数据表（对齐 organic-monthly 风格） ========= */
      .chart-table-section {
        margin-top: 6px;
        padding-top: 6px;
        border-top: 1px dashed rgba(148, 163, 184, 0.5);
      }
      .chart-table-title {
        font-size: 11px;
        color: var(--text-sub, #64748b);
        margin-bottom: 4px;
      }
      .chart-table-wrapper {
        max-height: 260px;
        overflow: auto;
        border-radius: 6px;
        border: 1px solid rgba(209, 213, 219, 0.9);
        background: #ffffff;
      }
      table.chart-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 11px;
      }
      .chart-table thead th,
      .chart-table tbody td {
        padding: 4px 8px;
        border-bottom: 1px solid #f3f4f6;
        white-space: nowrap;
      }
      .chart-table thead th {
        position: sticky;
        top: 0;
        z-index: 1;
        background: #f9fafb;
        text-align: center;
        font-weight: 500;
        color: var(--text-sub, #64748b);
      }
      .chart-table tbody tr:nth-child(odd) td { background: #fcfcff; }
      .chart-table tbody tr:hover td { background: #eef2ff; }
      .chart-table td.num { text-align: right; font-variant-numeric: tabular-nums; }
    `;
    document.head.appendChild(style);
  }

  function collectOptions(rawByMonth, months) {
    const countrySet = new Set();
    const mediaSet = new Set();
    const productSet = new Set();

    for (const month of months) {
      const rows = rawByMonth[month] || [];
      for (const r of rows) {
        if (!r) continue;
        if (r.country) countrySet.add(r.country);
        if (r.media) mediaSet.add(r.media);
        if (r.productType) productSet.add(r.productType);
      }
    }

    const countriesAll = Array.from(countrySet);
    let countries = COUNTRY_ORDER.filter((c) => countrySet.has(c));
    if (!countries.length) countries = countriesAll.sort();

    return {
      countries,
      medias: Array.from(mediaSet).sort(),
      productTypes: Array.from(productSet).sort(),
    };
  }

  function renderEmptyChart(chart, message) {
    chart.setOption(
      {
        title: {
          text: message || "无数据",
          left: "center",
          top: "center",
          textStyle: { color: "#94a3b8", fontSize: 12, fontWeight: 500 },
        },
        xAxis: { show: false },
        yAxis: { show: false },
        series: [],
      },
      true
    );
  }

  function axisKFormatter(v) {
    const n = safeNum(v);
    const abs = Math.abs(n);
    if (abs >= 1000000) return (n / 1000000).toFixed(1) + "M";
    if (abs >= 1000) return (n / 1000).toFixed(1) + "k";
    return String(Math.round(n));
  }

  function makeChip(labelText, checked, disabled, onChange) {
    const lab = document.createElement("label");
    lab.className =
      "filter-chip" +
      (checked ? " filter-chip-active" : "") +
      (disabled ? " is-disabled" : "");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = !!checked;
    input.disabled = !!disabled;
    input.addEventListener("change", () => onChange(input.checked));
    lab.appendChild(input);
    lab.appendChild(document.createTextNode(labelText));
    return lab;
  }

  function renderMonthsChips(container, allMonths, selectedSet, max, onChange) {
    container.innerHTML = "";
    const months = allMonths.slice(); // already sorted
    for (const m of months) {
      const checked = selectedSet.has(m);
      const chip = makeChip(fmtMonthLabel(m), checked, false, (nextChecked) => {
        if (nextChecked) {
          if (selectedSet.size >= max) {
            // 超过上限：回滚
            renderMonthsChips(container, allMonths, selectedSet, max, onChange);
            return;
          }
          selectedSet.add(m);
        } else {
          selectedSet.delete(m);
          if (selectedSet.size === 0) {
            // 保底：至少留 1 个月（默认最新月）
            const fallback = allMonths[allMonths.length - 1];
            if (fallback) selectedSet.add(fallback);
          }
        }
        onChange();
      });
      container.appendChild(chip);
    }
  }

  function renderDimChips(container, values, selectedSet, mergeFlagRef, onChange) {
    container.innerHTML = "";

    // merge chip
    const mergeChip = makeChip(MERGE_LABEL, mergeFlagRef.value, false, (checked) => {
      mergeFlagRef.value = checked;
      if (checked) {
        selectedSet.clear();
        for (const v of values) selectedSet.add(v);
      } else {
        // 取消 merge：默认保持“全选”，方便用户再手动叉掉
        if (selectedSet.size === 0) {
          for (const v of values) selectedSet.add(v);
        }
      }
      onChange();
    });
    container.appendChild(mergeChip);

    // normal chips
    const disableOthers = !!mergeFlagRef.value;
    for (const v of values) {
      const checked = disableOthers ? true : selectedSet.has(v);
      const chip = makeChip(String(v), checked, disableOthers, (nextChecked) => {
        if (mergeFlagRef.value) return;

        if (nextChecked) selectedSet.add(v);
        else selectedSet.delete(v);

        // 保底：不允许空选 -> 回到全选
        if (selectedSet.size === 0) {
          for (const vv of values) selectedSet.add(vv);
        }
        onChange();
      });
      container.appendChild(chip);
    }
  }

  function selectedOrAllInOrder(selectedSet, allValues) {
    if (!selectedSet || selectedSet.size === 0) return allValues.slice();
    return allValues.filter((v) => selectedSet.has(v));
  }

  function normalizeSelectedMonths(selectedSet, allMonths, max) {
    let picked = selectedOrAllInOrder(selectedSet, allMonths).slice().sort();
    if (!picked.length) picked = allMonths.slice(-max).sort();
    if (picked.length > max) picked = picked.slice(-max);
    return picked;
  }

  function aggregateMonthly(rawByMonth, months, selCountries, selMedias, selPT, splitCountry, splitMedia, splitPT) {
    const map = new Map();
    for (const month of months) {
      const rows = rawByMonth[month] || [];
      for (const r of rows) {
        if (!r) continue;
        const c = r.country;
        const m = r.media;
        const p = r.productType;
        if (!c || !m || !p) continue;

        if (selCountries && !selCountries.has(c)) continue;
        if (selMedias && !selMedias.has(m)) continue;
        if (selPT && !selPT.has(p)) continue;

        const key = [
          month,
          splitCountry ? c : ALL,
          splitMedia ? m : ALL,
          splitPT ? p : ALL,
        ].join("||");

        let agg = map.get(key);
        if (!agg) {
          agg = { registration: 0, spent: 0 };
          map.set(key, agg);
        }
        agg.registration += safeNum(r.registration);
        agg.spent += safeNum(r.spent);
      }
    }
    return map;
  }

  function buildDailySeries(rawByMonth, months, selCountries, selMedias, selPT, splitCountry, splitMedia, splitPT) {
    const dateSet = new Set();
    const groupMap = new Map(); // gkey -> Map(date->sum)

    for (const month of months) {
      const rows = rawByMonth[month] || [];
      for (const r of rows) {
        if (!r) continue;
        const date = r.date;
        const c = r.country;
        const m = r.media;
        const p = r.productType;
        if (!date || !c || !m || !p) continue;

        if (selCountries && !selCountries.has(c)) continue;
        if (selMedias && !selMedias.has(m)) continue;
        if (selPT && !selPT.has(p)) continue;

        dateSet.add(date);

        const parts = [];
        if (splitCountry) parts.push(`country=${c}`);
        if (splitMedia) parts.push(`media=${m}`);
        if (splitPT) parts.push(`pt=${p}`);
        const gkey = parts.length ? parts.join("|") : "ALL";

        let dateMap = groupMap.get(gkey);
        if (!dateMap) {
          dateMap = new Map();
          groupMap.set(gkey, dateMap);
        }
        dateMap.set(date, (dateMap.get(date) || 0) + safeNum(r.registration));
      }
    }

    const dates = Array.from(dateSet).sort(); // YYYY-MM-DD lex sort ok
    const keys = Array.from(groupMap.keys()).sort();

    const series = keys.map((gkey) => {
      const dateMap = groupMap.get(gkey);
      const data = dates.map((d) => (dateMap && dateMap.has(d) ? dateMap.get(d) : null));

      let name = "ALL";
      if (gkey !== "ALL") {
        name = gkey
          .split("|")
          .map((kv) => kv.split("=")[1])
          .join(" · ");
      }

      return {
        name,
        type: "line",
        data,
        showSymbol: false,
        connectNulls: true,
        emphasis: { focus: "series" },
      };
    });

    return { dates, series };
  }

  function renderBar(chart, categories, series) {
    if (!categories.length || !series.length) {
      renderEmptyChart(chart, "无数据");
      return;
    }

    chart.setOption(
      {
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
          formatter: (params) => {
            if (!params || !params.length) return "";
            const title = escapeHtml(params[0].axisValueLabel || "");
            const lines = [title];
            for (const p of params) {
              const v = safeNum(p.data);
              lines.push(`${p.marker}${escapeHtml(p.seriesName)}：${fmtInt(v)}`);
            }
            return lines.join("<br/>");
          },
        },
        legend: { type: "scroll", top: 4 },
        grid: { left: 52, right: 20, top: 56, bottom: 40 },
        xAxis: { type: "category", data: categories },
        yAxis: {
          type: "value",
          name: "注册数",
          axisLabel: { formatter: axisKFormatter },
        },
        series: series.map((s) => ({
          ...s,
          type: "bar",
          barMaxWidth: 22,
        })),
      },
      true
    );
  }

  function renderLine(chart, dates, series) {
    if (!dates.length || !series.length) {
      renderEmptyChart(chart, "无数据");
      return;
    }

    chart.setOption(
      {
        tooltip: {
          trigger: "axis",
          formatter: (params) => {
            if (!params || !params.length) return "";
            const title = escapeHtml(params[0].axisValueLabel || "");
            const lines = [title];
            for (const p of params) {
              const v = p.data == null ? null : safeNum(p.data);
              lines.push(`${p.marker}${escapeHtml(p.seriesName)}：${v == null ? "-" : fmtInt(v)}`);
            }
            return lines.join("<br/>");
          },
        },
        legend: { type: "scroll", top: 4 },
        grid: { left: 52, right: 20, top: 56, bottom: 48 },
        xAxis: {
          type: "category",
          data: dates,
          axisLabel: {
            formatter: (v) => String(v).slice(5), // MM-DD
          },
        },
        yAxis: {
          type: "value",
          name: "注册数",
          axisLabel: { formatter: axisKFormatter },
        },
        series,
      },
      true
    );
  }

  function buildTableTitle(medias, productTypes) {
    const mediaPart = medias.length ? medias.join("+") : "-";
    const ptPart = productTypes.length ? productTypes.join("+") : "-";
    return `当前筛选 · 买量注册数（月度汇总）（${mediaPart}，${ptPart}）`;
  }

  function buildTableHtml(rows, headers) {
    let html = "<thead><tr>";
    for (const h of headers) html += `<th>${escapeHtml(h)}</th>`;
    html += "</tr></thead><tbody>";

    for (const r of rows) {
      html += "<tr>";
      for (const cell of r) {
        const isNum = typeof cell === "object" && cell && cell.__num;
        const val = isNum ? cell.val : cell;
        html += `<td${isNum ? ' class="num"' : ""}>${escapeHtml(val)}</td>`;
      }
      html += "</tr>";
    }

    html += "</tbody>";
    return html;
  }

  function initModule() {
    if (!window.echarts) return;
    if (!window.PaidDashboard || typeof window.PaidDashboard.registerChart !== "function") return;

    const card = document.getElementById(CARD_ID);
    const chartDom = document.getElementById(CHART_ID);
    if (!card || !chartDom) return;

    ensureExtraStyles();

    const RAW = window.RAW_PAID_BY_MONTH || {};
    const allMonths =
      (window.PaidDashboard && typeof window.PaidDashboard.getMonths === "function"
        ? window.PaidDashboard.getMonths()
        : Object.keys(RAW).sort()) || [];

    if (!allMonths.length) {
      chartDom.innerHTML = "无数据（RAW_PAID_BY_MONTH 为空）";
      return;
    }

    const opts = collectOptions(RAW, allMonths);

    const countriesAll = opts.countries;
    const mediasAll = opts.medias;
    const productTypesAll = opts.productTypes;

    const defaultMonths = allMonths.slice(-3);
    const state = {
      view: "bar",
      months: new Set(defaultMonths),
      countries: new Set(countriesAll),
      medias: new Set(mediasAll),
      productTypes: new Set(productTypesAll),

      mergeCountries: { value: false },
      mergeMedias: { value: true },
      mergeProductTypes: { value: true },
    };

    // ---- inject filters UI into header controls ----
    const controls = card.querySelector(".chart-controls");
    let filtersWrap = card.querySelector("#paid-reg-mini-filters");
    if (!filtersWrap) {
      filtersWrap = document.createElement("div");
      filtersWrap.id = "paid-reg-mini-filters";
      filtersWrap.className = "chart-mini-filters";
      if (controls) controls.appendChild(filtersWrap);
    }

    // View
    const viewFilter = document.createElement("div");
    viewFilter.className = "chart-mini-filter";
    const viewLabel = document.createElement("span");
    viewLabel.className = "chart-mini-label";
    viewLabel.textContent = "视图：";
    const viewRadio = document.createElement("div");
    viewRadio.className = "chart-mini-radio";

    const viewName = "paid-reg-view";
    const radioBar = document.createElement("input");
    radioBar.type = "radio";
    radioBar.name = viewName;
    radioBar.value = "bar";
    radioBar.checked = state.view === "bar";

    const radioLine = document.createElement("input");
    radioLine.type = "radio";
    radioLine.name = viewName;
    radioLine.value = "line";
    radioLine.checked = state.view === "line";

    const labBar = document.createElement("label");
    labBar.appendChild(radioBar);
    labBar.appendChild(document.createTextNode("柱状（月度）"));

    const labLine = document.createElement("label");
    labLine.appendChild(radioLine);
    labLine.appendChild(document.createTextNode("折线（日度）"));

    viewRadio.appendChild(labBar);
    viewRadio.appendChild(labLine);
    viewFilter.appendChild(viewLabel);
    viewFilter.appendChild(viewRadio);

    // Months
    const monthFilter = document.createElement("div");
    monthFilter.className = "chart-mini-filter";
    const monthLabel = document.createElement("span");
    monthLabel.className = "chart-mini-label";
    monthLabel.textContent = "月份：";
    const monthChips = document.createElement("div");
    monthChips.className = "chart-mini-chips";
    monthFilter.appendChild(monthLabel);
    monthFilter.appendChild(monthChips);

    // Countries
    const countryFilter = document.createElement("div");
    countryFilter.className = "chart-mini-filter";
    const countryLabel = document.createElement("span");
    countryLabel.className = "chart-mini-label";
    countryLabel.textContent = "国家：";
    const countryChips = document.createElement("div");
    countryChips.className = "chart-mini-chips";
    countryFilter.appendChild(countryLabel);
    countryFilter.appendChild(countryChips);

    // Media
    const mediaFilter = document.createElement("div");
    mediaFilter.className = "chart-mini-filter";
    const mediaLabel = document.createElement("span");
    mediaLabel.className = "chart-mini-label";
    mediaLabel.textContent = "媒体：";
    const mediaChips = document.createElement("div");
    mediaChips.className = "chart-mini-chips";
    mediaFilter.appendChild(mediaLabel);
    mediaFilter.appendChild(mediaChips);

    // Product type
    const ptFilter = document.createElement("div");
    ptFilter.className = "chart-mini-filter";
    const ptLabel = document.createElement("span");
    ptLabel.className = "chart-mini-label";
    ptLabel.textContent = "产品：";
    const ptChips = document.createElement("div");
    ptChips.className = "chart-mini-chips";
    ptFilter.appendChild(ptLabel);
    ptFilter.appendChild(ptChips);

    // Avoid duplicate insertion if re-init
    if (!filtersWrap.dataset.built) {
      filtersWrap.innerHTML = "";
      filtersWrap.appendChild(viewFilter);
      filtersWrap.appendChild(monthFilter);
      filtersWrap.appendChild(countryFilter);
      filtersWrap.appendChild(mediaFilter);
      filtersWrap.appendChild(ptFilter);
      filtersWrap.dataset.built = "1";
    }

    // ---- insert table under chart; move summary below table ----
    let tableSection = card.querySelector('.chart-table-section[data-module="paid-reg"]');
    let tableTitleEl, tableEl;
    if (!tableSection) {
      tableSection = document.createElement("div");
      tableSection.className = "chart-table-section";
      tableSection.dataset.module = "paid-reg";

      tableTitleEl = document.createElement("div");
      tableTitleEl.className = "chart-table-title";
      tableTitleEl.id = "table-title-paid-registrations";

      const wrapper = document.createElement("div");
      wrapper.className = "chart-table-wrapper";

      tableEl = document.createElement("table");
      tableEl.className = "chart-table";
      tableEl.id = "table-paid-registrations";

      wrapper.appendChild(tableEl);
      tableSection.appendChild(tableTitleEl);
      tableSection.appendChild(wrapper);

      chartDom.insertAdjacentElement("afterend", tableSection);

      // move summary under table (保持 “图 -> 表 -> 文案” 顺序)
      const summary = card.querySelector(".chart-summary");
      if (summary) tableSection.insertAdjacentElement("afterend", summary);
    } else {
      tableTitleEl = tableSection.querySelector(".chart-table-title");
      tableEl = tableSection.querySelector("table.chart-table");
    }

    const chart = window.echarts.init(chartDom);
    window.PaidDashboard.registerChart(chart);

    function rerender() {
      // normalize selections
      const months = normalizeSelectedMonths(state.months, allMonths, 3);

      const selCountriesArr = selectedOrAllInOrder(state.countries, countriesAll);
      const selMediasArr = selectedOrAllInOrder(state.medias, mediasAll);
      const selPTArr = selectedOrAllInOrder(state.productTypes, productTypesAll);

      const selCountries = new Set(selCountriesArr);
      const selMedias = new Set(selMediasArr);
      const selPT = new Set(selPTArr);

      const splitCountry = !state.mergeCountries.value;
      const splitMedia = !state.mergeMedias.value;
      const splitPT = !state.mergeProductTypes.value;

      // monthly aggregation for bar + table
      const monthlyMap = aggregateMonthly(
        RAW,
        months,
        selCountries,
        selMedias,
        selPT,
        splitCountry,
        splitMedia,
        splitPT
      );

      // -------- table --------
      // title: 按需求拼 media + productType
      if (tableTitleEl) {
        tableTitleEl.textContent = buildTableTitle(selMediasArr, selPTArr);
      }

      const headers = [];
      if (splitCountry) headers.push("国家");
      if (splitMedia) headers.push("媒体");
      if (splitPT) headers.push("产品类型");
      for (const m of months) {
        headers.push(`${fmtMonthLabel(m)}注册数`);
        headers.push(`${fmtMonthLabel(m)}注册单价`);
      }

      // rows = cross-product of selected split dims (small & predictable)
      const rowCountries = splitCountry ? selCountriesArr : [ALL];
      const rowMedias = splitMedia ? selMediasArr : [ALL];
      const rowPTs = splitPT ? selPTArr : [ALL];

      const rows = [];
      for (const c of rowCountries) {
        for (const md of rowMedias) {
          for (const pt of rowPTs) {
            const row = [];
            if (splitCountry) row.push(c);
            if (splitMedia) row.push(md);
            if (splitPT) row.push(pt);

            for (const m of months) {
              const key = [m, splitCountry ? c : ALL, splitMedia ? md : ALL, splitPT ? pt : ALL].join("||");
              const agg = monthlyMap.get(key) || { registration: 0, spent: 0 };
              const reg = safeNum(agg.registration);
              const cpa = safeDiv(agg.spent, agg.registration);

              row.push({ __num: true, val: fmtInt(reg) });
              row.push({ __num: true, val: cpa == null ? "-" : fmtUSD(cpa) });
            }

            rows.push(row);
          }
        }
      }

      if (tableEl) {
        tableEl.innerHTML = buildTableHtml(rows, headers);
      }

      // -------- chart --------
      if (state.view === "line") {
        const { dates, series } = buildDailySeries(
          RAW,
          months,
          selCountries,
          selMedias,
          selPT,
          splitCountry,
          splitMedia,
          splitPT
        );
        renderLine(chart, dates, series);
      } else {
        // bar categories
        const categories = splitCountry ? selCountriesArr : ["ALL"];

        // bar series combos: months × (media?) × (productType?)
        const mediaSeriesVals = splitMedia ? selMediasArr : [ALL];
        const ptSeriesVals = splitPT ? selPTArr : [ALL];

        const series = [];
        for (const m of months) {
          for (const md of mediaSeriesVals) {
            for (const pt of ptSeriesVals) {
              const nameParts = [fmtMonthLabel(m)];
              if (splitMedia) nameParts.push(md);
              if (splitPT) nameParts.push(pt);
              const sName = nameParts.join(" · ");

              const data = categories.map((cat) => {
                const key = [m, splitCountry ? cat : ALL, splitMedia ? md : ALL, splitPT ? pt : ALL].join("||");
                const agg = monthlyMap.get(key);
                return agg ? safeNum(agg.registration) : 0;
              });

              series.push({ name: sName, data });
            }
          }
        }

        renderBar(chart, categories, series);
      }

      // -------- re-render chips (keep checked/disabled right) --------
      renderMonthsChips(monthChips, allMonths, state.months, 3, rerender);
      renderDimChips(countryChips, countriesAll, state.countries, state.mergeCountries, rerender);
      renderDimChips(mediaChips, mediasAll, state.medias, state.mergeMedias, rerender);
      renderDimChips(ptChips, productTypesAll, state.productTypes, state.mergeProductTypes, rerender);

      // view radios keep sync
      radioBar.checked = state.view === "bar";
      radioLine.checked = state.view === "line";
    }

    // view change
    radioBar.addEventListener("change", () => {
      if (radioBar.checked) {
        state.view = "bar";
        rerender();
      }
    });
    radioLine.addEventListener("change", () => {
      if (radioLine.checked) {
        state.view = "line";
        rerender();
      }
    });

    // initial render
    rerender();
  }

  window.PaidDashboard && typeof window.PaidDashboard.registerModule === "function"
    ? window.PaidDashboard.registerModule(MODULE_NAME, initModule)
    : initModule();
})();
