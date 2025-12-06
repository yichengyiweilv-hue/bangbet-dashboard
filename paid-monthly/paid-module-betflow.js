/**
 * paid-module-betflow.js
 * ------------------------------------------------------------
 * 模块 7：D0/D7 人均流水（总流水 / 体育流水 / 游戏流水）
 * - 支持：月份（最多3个月）、国家/媒体/产品形态多选 +「全选但不区分」、视图（柱状/月度 vs 折线/日度）
 * - 支持：人均维度（总/体育/游戏，单选）、D0/D7（多选）
 * - 图表：柱状图按国家聚合；折线图按国家×媒体×形态拆线（可用「全选但不区分」收敛维度）
 * - 表格：月度汇总表，维度随筛选变化
 */

(function () {
  "use strict";

  var MODULE_KEY = "flow";
  var CARD_ID = "card-paid-betflow";
  var CHART_ID = "chart-paid-betflow";
  var TABLE_ID = "table-paid-betflow";

  function init() {
    var chartDom = document.getElementById(CHART_ID);
    if (!chartDom || !window.echarts) return;

    var card =
      document.getElementById(CARD_ID) ||
      (chartDom.closest ? chartDom.closest("section") : null);
    if (!card) return;

    var chart = echarts.init(chartDom);
    if (
      window.PaidDashboard &&
      typeof PaidDashboard.registerChart === "function"
    ) {
      PaidDashboard.registerChart(chart);
    }

    var RAW = window.RAW_PAID_BY_MONTH || {};
    var ALL_MONTHS = Object.keys(RAW || {}).sort();
    if (!ALL_MONTHS.length) {
      renderEmpty(chart);
      return;
    }

    var COLORS =
      (window.PaidDashboard && PaidDashboard.COLORS) || [
        "#2563eb",
        "#16a34a",
        "#f97316",
        "#7c3aed",
        "#ef4444",
        "#0f766e",
      ];

    var COUNTRY_ORDER = ["GH", "KE", "NG", "TZ"];

    var meta = collectMeta(RAW, COUNTRY_ORDER);

    // 默认：最近2个月；D0；总流水
    var state = {
      view: "bar", // bar | line
      months: ALL_MONTHS.slice(Math.max(0, ALL_MONTHS.length - 2)),
      countries: meta.countriesOrdered.slice(),
      countriesAllNoSplit: false,
      medias: meta.mediasOrdered.slice(),
      mediasAllNoSplit: false,
      productTypes: meta.productTypesOrdered.slice(),
      productTypesAllNoSplit: false,
      flowDim: "total", // total | sports | games
      dayTypes: ["D0"], // ["D0","D7"]
    };

    var ui = ensureUI(card);

    function render() {
      // 1) 容错：空选=全选；月份最多3个
      state.months = normalizeMonths(state.months, ALL_MONTHS);
      state.countries = normalizeSelection(state.countries, meta.countriesOrdered);
      state.medias = normalizeSelection(state.medias, meta.mediasOrdered);
      state.productTypes = normalizeSelection(
        state.productTypes,
        meta.productTypesOrdered
      );
      state.dayTypes = normalizeDayTypes(state.dayTypes);

      // 2) 更新卡片标题（人均维度）
      updateTitles(ui, state);

      // 3) 重建筛选器（保证禁用/高亮状态正确）
      renderFilters(ui, state, meta, ALL_MONTHS, function () {
        render();
      });

      // 4) 月度聚合（表格 + 柱状图复用）
      var monthsSel = state.months.slice(0, 3);
      var dayTypesSel = state.dayTypes.slice();
      var monthlyAgg = computeMonthlyAgg(RAW, monthsSel, dayTypesSel, state, meta);

      renderTable(ui, monthlyAgg, monthsSel, dayTypesSel, state);

      // 5) 图表渲染
      if (state.view === "line") {
        var daily = computeDailySeries(
          RAW,
          monthsSel,
          dayTypesSel,
          state,
          meta,
          COLORS
        );
        renderLineChart(chart, daily);
      } else {
        renderBarChart(
          chart,
          monthlyAgg,
          monthsSel,
          dayTypesSel,
          state,
          COLORS
        );
      }
    }

    render();
  }

  // ---------------------------
  // UI 组装
  // ---------------------------

  function ensureUI(card) {
    var titleEl = card.querySelector(".chart-title");
    var subEl = card.querySelector(".chart-sub");
    var controlsEl = card.querySelector(".chart-controls");

    // 保证 controls 存在
    if (!controlsEl) {
      var header = card.querySelector(".chart-card-header");
      controlsEl = document.createElement("div");
      controlsEl.className = "chart-controls";
      if (header) header.appendChild(controlsEl);
    }

    // 表格容器（不存在就补）
    var summaryEl = card.querySelector(".chart-summary");
    var tableSection = card.querySelector(".chart-table-section");
    var tableTitle;
    var tableEl;

    if (!tableSection) {
      tableSection = document.createElement("div");
      tableSection.className = "chart-table-section";

      tableTitle = document.createElement("div");
      tableTitle.className = "chart-table-title";
      tableTitle.textContent = "当前筛选 · 人均流水（月度汇总）";

      var wrapper = document.createElement("div");
      wrapper.className = "chart-table-wrapper";

      tableEl = document.createElement("table");
      tableEl.id = TABLE_ID;
      tableEl.className = "chart-table";

      wrapper.appendChild(tableEl);
      tableSection.appendChild(tableTitle);
      tableSection.appendChild(wrapper);

      if (summaryEl && summaryEl.parentNode) {
        summaryEl.parentNode.insertBefore(tableSection, summaryEl.nextSibling);
      } else {
        card.appendChild(tableSection);
      }
    } else {
      tableTitle = tableSection.querySelector(".chart-table-title");
      tableEl =
        tableSection.querySelector("table#" + TABLE_ID) ||
        tableSection.querySelector("table");
      if (tableEl && !tableEl.id) tableEl.id = TABLE_ID;
    }

    return {
      titleEl: titleEl,
      subEl: subEl,
      controlsEl: controlsEl,
      tableTitleEl: tableTitle,
      tableEl: tableEl,
    };
  }

  function updateTitles(ui, state) {
    var dimLabel = flowDimLabel(state.flowDim);
    if (ui && ui.titleEl) {
      ui.titleEl.textContent = dimLabel + "流水 · 月度趋势";
    }
    if (ui && ui.subEl) {
      ui.subEl.textContent =
        "公式：BET_FLOW / BET_PLACED_USER；口径可选 D0/D7；支持切到日级折线。";
    }
  }

  function renderFilters(ui, state, meta, allMonths, rerender) {
    var controls = ui.controlsEl;
    if (!controls) return;

    controls.innerHTML = "";

    // badge
    var badge = document.createElement("span");
    badge.className = "chart-badge";
    badge.textContent = "单位：USD";
    controls.appendChild(badge);

    // 视图：bar / line
    controls.appendChild(
      makeRadioFilter(
        "视图：",
        "flow-view",
        [
          { value: "bar", label: "柱状（月度）" },
          { value: "line", label: "折线（日度）" },
        ],
        state.view,
        function (val) {
          state.view = val;
          rerender();
        }
      )
    );

    // 月份（最多3个）
    controls.appendChild(
      makeMultiChipFilter(
        "月份：",
        "flow-months",
        allMonths,
        state.months,
        {
          max: 3,
          getLabel: formatMonthLabel,
        },
        function (next) {
          state.months = next;
          rerender();
        }
      )
    );

    // 国家 + 全选但不区分
    controls.appendChild(
      makeDimFilterWithNoSplit(
        "国家：",
        "flow-countries",
        meta.countriesOrdered,
        state.countries,
        state.countriesAllNoSplit,
        function (nextSelected, nextNoSplit) {
          state.countries = nextSelected;
          state.countriesAllNoSplit = nextNoSplit;
          rerender();
        }
      )
    );

    // 媒体 + 全选但不区分
    controls.appendChild(
      makeDimFilterWithNoSplit(
        "媒体：",
        "flow-medias",
        meta.mediasOrdered,
        state.medias,
        state.mediasAllNoSplit,
        function (nextSelected, nextNoSplit) {
          state.medias = nextSelected;
          state.mediasAllNoSplit = nextNoSplit;
          rerender();
        }
      )
    );

    // 形态 + 全选但不区分
    controls.appendChild(
      makeDimFilterWithNoSplit(
        "形态：",
        "flow-productTypes",
        meta.productTypesOrdered,
        state.productTypes,
        state.productTypesAllNoSplit,
        function (nextSelected, nextNoSplit) {
          state.productTypes = nextSelected;
          state.productTypesAllNoSplit = nextNoSplit;
          rerender();
        }
      )
    );

    // 人均维度（单选）
    controls.appendChild(
      makeRadioFilter(
        "人均：",
        "flow-dim",
        [
          { value: "total", label: "总流水" },
          { value: "sports", label: "体育流水" },
          { value: "games", label: "游戏流水" },
        ],
        state.flowDim,
        function (val) {
          state.flowDim = val;
          rerender();
        }
      )
    );

    // D0/D7（多选）
    controls.appendChild(
      makeMultiChipFilter(
        "口径：",
        "flow-dayTypes",
        ["D0", "D7"],
        state.dayTypes,
        { max: null, getLabel: function (v) { return v; } },
        function (next) {
          state.dayTypes = next;
          rerender();
        }
      )
    );
  }

  function makeRadioFilter(labelText, groupId, options, value, onChange) {
    var wrap = document.createElement("div");
    wrap.className = "chart-mini-filter";

    var label = document.createElement("span");
    label.className = "chart-mini-label";
    label.textContent = labelText;
    wrap.appendChild(label);

    var radioWrap = document.createElement("div");
    radioWrap.className = "chart-mini-radio";
    radioWrap.id = groupId;

    options.forEach(function (opt) {
      var lab = document.createElement("label");

      var input = document.createElement("input");
      input.type = "radio";
      input.name = groupId;
      input.value = opt.value;
      input.checked = String(opt.value) === String(value);

      input.addEventListener("change", function () {
        if (input.checked) onChange(opt.value);
      });

      lab.appendChild(input);
      lab.appendChild(document.createTextNode(opt.label));
      radioWrap.appendChild(lab);
    });

    wrap.appendChild(radioWrap);
    return wrap;
  }

  function makeMultiChipFilter(labelText, containerId, values, selected, options, onChange) {
    var wrap = document.createElement("div");
    wrap.className = "chart-mini-filter";

    var label = document.createElement("span");
    label.className = "chart-mini-label";
    label.textContent = labelText;
    wrap.appendChild(label);

    var chips = document.createElement("div");
    chips.className = "chart-mini-chips";
    chips.id = containerId;

    var max = options && typeof options.max === "number" ? options.max : null;
    var getLabel =
      options && typeof options.getLabel === "function"
        ? options.getLabel
        : function (v) { return String(v); };

    if (!Array.isArray(selected) || selected.length === 0) selected = values.slice();

    values.forEach(function (value) {
      var lab = document.createElement("label");
      lab.className = "filter-chip";

      var input = document.createElement("input");
      input.type = "checkbox";
      input.value = String(value);
      input.checked = selected.indexOf(value) !== -1;

      lab.classList.toggle("filter-chip-active", input.checked);

      input.addEventListener("change", function () {
        var next = selected.slice();
        var idx = next.indexOf(value);

        if (input.checked) {
          if (max && next.length >= max) {
            input.checked = false;
            return;
          }
          if (idx === -1) next.push(value);
        } else {
          if (idx !== -1) next.splice(idx, 1);
        }

        if (next.length === 0) next = values.slice();
        onChange(next);
      });

      lab.appendChild(input);
      lab.appendChild(document.createTextNode(getLabel(value)));
      chips.appendChild(lab);
    });

    wrap.appendChild(chips);
    return wrap;
  }

  function makeDimFilterWithNoSplit(labelText, containerId, values, selected, noSplit, onChange) {
    var wrap = document.createElement("div");
    wrap.className = "chart-mini-filter";

    var label = document.createElement("span");
    label.className = "chart-mini-label";
    label.textContent = labelText;
    wrap.appendChild(label);

    var chips = document.createElement("div");
    chips.className = "chart-mini-chips";
    chips.id = containerId;

    // 1) 全选但不区分（勾选后禁用其他值）
    var allLab = document.createElement("label");
    allLab.className = "filter-chip";

    var allInput = document.createElement("input");
    allInput.type = "checkbox";
    allInput.checked = !!noSplit;

    allLab.classList.toggle("filter-chip-active", allInput.checked);

    allInput.addEventListener("change", function () {
      var nextNoSplit = allInput.checked;
      var nextSelected = values.slice();
      onChange(nextSelected, nextNoSplit);
    });

    allLab.appendChild(allInput);
    allLab.appendChild(document.createTextNode("全选但不区分"));
    chips.appendChild(allLab);

    // 2) 具体值
    if (!Array.isArray(selected) || selected.length === 0) selected = values.slice();

    values.forEach(function (value) {
      var lab = document.createElement("label");
      lab.className = "filter-chip";

      var input = document.createElement("input");
      input.type = "checkbox";
      input.value = String(value);
      input.checked = selected.indexOf(value) !== -1;
      input.disabled = !!noSplit;

      lab.classList.toggle("filter-chip-active", input.checked);

      input.addEventListener("change", function () {
        var next = selected.slice();
        var idx = next.indexOf(value);

        if (input.checked) {
          if (idx === -1) next.push(value);
        } else {
          if (idx !== -1) next.splice(idx, 1);
        }

        if (next.length === 0) next = values.slice();
        onChange(next, false);
      });

      lab.appendChild(input);
      lab.appendChild(document.createTextNode(String(value)));
      chips.appendChild(lab);
    });

    wrap.appendChild(chips);
    return wrap;
  }

  // ---------------------------
  // 数据计算
  // ---------------------------

  function computeMonthlyAgg(RAW, months, dayTypes, state, meta) {
    var rowsMap = {}; // rowKey -> rowObj
    var barMap = {};  // country|month|dayType -> {flow,users}

    var effCountries = state.countriesAllNoSplit ? meta.countriesOrdered : state.countries;
    var effMedias = state.mediasAllNoSplit ? meta.mediasOrdered : state.medias;
    var effProducts = state.productTypesAllNoSplit ? meta.productTypesOrdered : state.productTypes;

    months.forEach(function (month) {
      var rows = RAW[month] || [];
      rows.forEach(function (r) {
        if (!r) return;

        var c = normalizeCountry(r.country);
        var m = normalizeMedia(r.media);
        var p = normalizeProductType(r.productType);

        if (effCountries.indexOf(c) === -1) return;
        if (effMedias.indexOf(m) === -1) return;
        if (effProducts.indexOf(p) === -1) return;

        var cKey = state.countriesAllNoSplit ? "ALL" : c;
        var mKey = state.mediasAllNoSplit ? "ALL" : m;
        var pKey = state.productTypesAllNoSplit ? "ALL" : p;

        var rowKey = cKey + "|" + mKey + "|" + pKey;
        if (!rowsMap[rowKey]) {
          rowsMap[rowKey] = {
            country: cKey,
            media: mKey,
            productType: pKey,
            sums: {}, // month -> dayType -> {flow,users}
          };
        }

        dayTypes.forEach(function (dayType) {
          var fields = betFlowFields(dayType, state.flowDim);
          var flow = toNumber(r[fields.flow]);
          var users = toNumber(r[fields.users]);

          if (!rowsMap[rowKey].sums[month]) rowsMap[rowKey].sums[month] = {};
          if (!rowsMap[rowKey].sums[month][dayType]) {
            rowsMap[rowKey].sums[month][dayType] = { flow: 0, users: 0 };
          }
          rowsMap[rowKey].sums[month][dayType].flow += flow;
          rowsMap[rowKey].sums[month][dayType].users += users;

          var barKey = cKey + "|" + month + "|" + dayType;
          if (!barMap[barKey]) barMap[barKey] = { flow: 0, users: 0 };
          barMap[barKey].flow += flow;
          barMap[barKey].users += users;
        });
      });
    });

    var rowsArr = Object.keys(rowsMap).map(function (k) { return rowsMap[k]; });

    // 排序：国家 > 媒体 > 形态
    rowsArr.sort(function (a, b) {
      var ia = meta.countrySortIndex[a.country] != null ? meta.countrySortIndex[a.country] : 999;
      var ib = meta.countrySortIndex[b.country] != null ? meta.countrySortIndex[b.country] : 999;
      if (ia !== ib) return ia - ib;

      if (a.media !== b.media) return String(a.media).localeCompare(String(b.media));
      if (a.productType !== b.productType) return String(a.productType).localeCompare(String(b.productType));
      return 0;
    });

    // bar categories（固定顺序）
    var categories = state.countriesAllNoSplit
      ? ["ALL"]
      : meta.countriesOrdered.filter(function (c) { return state.countries.indexOf(c) !== -1; });

    return { categories: categories, barMap: barMap, rows: rowsArr };
  }

  function computeDailySeries(RAW, months, dayTypes, state, meta, colors) {
    var dateSet = {};
    var baseColorMap = {};
    var nextColorIdx = 0;
    var seriesMap = {}; // varKey -> { baseKey, dayType, dataMap: {date:{flow,users}} }

    var effCountries = state.countriesAllNoSplit ? meta.countriesOrdered : state.countries;
    var effMedias = state.mediasAllNoSplit ? meta.mediasOrdered : state.medias;
    var effProducts = state.productTypesAllNoSplit ? meta.productTypesOrdered : state.productTypes;

    months.forEach(function (month) {
      var rows = RAW[month] || [];
      rows.forEach(function (r) {
        if (!r || !r.date) return;

        var date = String(r.date);
        var c = normalizeCountry(r.country);
        var m = normalizeMedia(r.media);
        var p = normalizeProductType(r.productType);

        if (effCountries.indexOf(c) === -1) return;
        if (effMedias.indexOf(m) === -1) return;
        if (effProducts.indexOf(p) === -1) return;

        dateSet[date] = true;

        var cKey = state.countriesAllNoSplit ? "ALL" : c;
        var mKey = state.mediasAllNoSplit ? "ALL" : m;
        var pKey = state.productTypesAllNoSplit ? "ALL" : p;

        var baseKey = cKey + "|" + mKey + "|" + pKey;

        if (!baseColorMap[baseKey]) {
          baseColorMap[baseKey] = colors[nextColorIdx % colors.length];
          nextColorIdx += 1;
        }

        dayTypes.forEach(function (dayType) {
          var varKey = baseKey + "|" + dayType;
          if (!seriesMap[varKey]) {
            seriesMap[varKey] = {
              baseKey: baseKey,
              dayType: dayType,
              country: cKey,
              media: mKey,
              productType: pKey,
              dataMap: {},
            };
          }

          var fields = betFlowFields(dayType, state.flowDim);
          var flow = toNumber(r[fields.flow]);
          var users = toNumber(r[fields.users]);

          if (!seriesMap[varKey].dataMap[date]) {
            seriesMap[varKey].dataMap[date] = { flow: 0, users: 0 };
          }
          seriesMap[varKey].dataMap[date].flow += flow;
          seriesMap[varKey].dataMap[date].users += users;
        });
      });
    });

    var dates = Object.keys(dateSet).sort();

    var seriesArr = Object.keys(seriesMap).map(function (key) {
      var s = seriesMap[key];

      var data = dates.map(function (d) {
        var cell = s.dataMap[d];
        if (!cell) return null;
        return safeDiv(cell.flow, cell.users);
      });

      var name = buildSeriesName(s, state, dayTypes);

      return {
        name: name,
        type: "line",
        data: data,
        showSymbol: false,
        connectNulls: false,
        lineStyle: { width: 2, type: s.dayType === "D7" ? "dashed" : "solid" },
        itemStyle: { color: baseColorMap[s.baseKey] },
        emphasis: { focus: "series" },
      };
    });

    seriesArr.sort(function (a, b) { return String(a.name).localeCompare(String(b.name)); });

    return { dates: dates, series: seriesArr };
  }

  function renderTable(ui, monthlyAgg, months, dayTypes, state) {
    if (!ui || !ui.tableEl) return;

    var dimLabel = flowDimLabel(state.flowDim);
    var mediaLabel = state.mediasAllNoSplit ? "全媒体不区分" : state.medias.join("+");
    var prodLabel = state.productTypesAllNoSplit ? "全形态不区分" : state.productTypes.join("+");

    var titleSuffix = "（" + [mediaLabel, prodLabel].filter(Boolean).join("，") + "）";

    if (ui.tableTitleEl) {
      ui.tableTitleEl.textContent =
        "当前筛选 · " + dimLabel + "流水（月度汇总）" + titleSuffix;
    }

    var showMedia = !state.mediasAllNoSplit;
    var showProd = !state.productTypesAllNoSplit;

    var th = ["国家"];
    if (showMedia) th.push("媒体");
    if (showProd) th.push("形态");

    months.forEach(function (m) {
      dayTypes.forEach(function (d) {
        th.push(formatMonthLabel(m) + " " + d + " " + dimLabel + "流水");
      });
    });

    var html = [];
    html.push("<thead><tr>");
    th.forEach(function (h) { html.push("<th>" + escapeHtml(h) + "</th>"); });
    html.push("</tr></thead><tbody>");

    monthlyAgg.rows.forEach(function (row) {
      html.push("<tr>");
      html.push("<td>" + escapeHtml(row.country) + "</td>");
      if (showMedia) html.push("<td>" + escapeHtml(row.media) + "</td>");
      if (showProd) html.push("<td>" + escapeHtml(row.productType) + "</td>");

      months.forEach(function (m) {
        dayTypes.forEach(function (d) {
          var cell = row.sums && row.sums[m] && row.sums[m][d] ? row.sums[m][d] : null;
          var val = cell ? safeDiv(cell.flow, cell.users) : null;
          html.push("<td style=\"text-align:right\">" + formatUSD(val, 2) + "</td>");
        });
      });

      html.push("</tr>");
    });

    html.push("</tbody>");
    ui.tableEl.innerHTML = html.join("");
  }

  // ---------------------------
  // 图表渲染
  // ---------------------------

  function renderBarChart(chart, monthlyAgg, months, dayTypes, state, colors) {
    var categories = monthlyAgg.categories.slice();
    var series = [];

    months.forEach(function (m, mi) {
      var color = colors[mi % colors.length];

      dayTypes.forEach(function (d) {
        var data = categories.map(function (c) {
          var key = c + "|" + m + "|" + d;
          var cell = monthlyAgg.barMap[key];
          if (!cell) return null;
          return safeDiv(cell.flow, cell.users);
        });

        series.push({
          name: formatMonthLabel(m) + " " + d,
          type: "bar",
          data: data,
          barMaxWidth: 26,
          itemStyle:
            d === "D7"
              ? {
                  color: color,
                  shadowBlur: 10,
                  shadowColor: "rgba(15, 23, 42, 0.25)",
                  shadowOffsetY: 2,
                }
              : { color: color },
          emphasis: { focus: "series" },
        });
      });
    });

    chart.setOption(
      {
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
          valueFormatter: function (v) {
            return v == null ? "-" : formatUSD(v, 2) + " USD";
          },
        },
        legend: { type: "scroll" },
        grid: { left: 46, right: 18, top: 46, bottom: 38 },
        xAxis: { type: "category", data: categories },
        yAxis: { type: "value", axisLabel: { formatter: function (v) { return formatUSD(v, 2); } } },
        series: series,
      },
      true
    );
  }

  function renderLineChart(chart, daily) {
    chart.setOption(
      {
        tooltip: {
          trigger: "axis",
          valueFormatter: function (v) {
            return v == null ? "-" : formatUSD(v, 2) + " USD";
          },
        },
        legend: { type: "scroll" },
        grid: { left: 46, right: 18, top: 46, bottom: 38 },
        xAxis: {
          type: "category",
          data: daily.dates,
          axisLabel: {
            interval: Math.max(0, Math.floor(daily.dates.length / 12)),
            formatter: function (v) { return String(v).slice(5); }, // 2025-09-01 -> 09-01
          },
        },
        yAxis: { type: "value", axisLabel: { formatter: function (v) { return formatUSD(v, 2); } } },
        series: daily.series,
      },
      true
    );
  }

  function renderEmpty(chart) {
    chart.clear();
    chart.setOption(
      {
        title: { text: "暂无数据", left: "center", top: "center" },
        xAxis: { show: false },
        yAxis: { show: false },
        series: [],
      },
      true
    );
  }

  // ---------------------------
  // Meta / helpers
  // ---------------------------

  function collectMeta(RAW, countryOrder) {
    var cSet = {};
    var mSet = {};
    var pSet = {};

    Object.keys(RAW || {}).forEach(function (month) {
      (RAW[month] || []).forEach(function (r) {
        if (!r) return;
        var c = normalizeCountry(r.country);
        var m = normalizeMedia(r.media);
        var p = normalizeProductType(r.productType);
        if (c) cSet[c] = true;
        if (m) mSet[m] = true;
        if (p) pSet[p] = true;
      });
    });

    var countries = Object.keys(cSet);
    var medias = Object.keys(mSet);
    var products = Object.keys(pSet);

    var countriesOrdered = uniqOrdered(countries, countryOrder);
    var mediasOrdered = uniqOrdered(medias, ["FB", "GG"]);
    var productTypesOrdered = uniqOrdered(products, ["app", "H5"]);

    var sortIndex = {};
    countriesOrdered.forEach(function (c, idx) { sortIndex[c] = idx; });
    sortIndex["ALL"] = -1;

    return {
      countriesOrdered: countriesOrdered,
      mediasOrdered: mediasOrdered,
      productTypesOrdered: productTypesOrdered,
      countrySortIndex: sortIndex,
    };
  }

  function uniqOrdered(values, preferredOrder) {
    var seen = {};
    var res = [];

    (preferredOrder || []).forEach(function (v) {
      if (values.indexOf(v) !== -1 && !seen[v]) {
        seen[v] = true;
        res.push(v);
      }
    });

    values.slice().sort().forEach(function (v) {
      if (!seen[v]) {
        seen[v] = true;
        res.push(v);
      }
    });

    return res;
  }

  function normalizeMonths(months, allMonths) {
    var list = Array.isArray(months) ? months.slice() : [];
    list = list.filter(function (m) { return allMonths.indexOf(m) !== -1; });

    if (list.length === 0) list = allMonths.slice(Math.max(0, allMonths.length - 2));
    list.sort(function (a, b) { return allMonths.indexOf(a) - allMonths.indexOf(b); });
    if (list.length > 3) list = list.slice(0, 3);
    return list;
  }

  function normalizeSelection(selected, allValues) {
    var list = Array.isArray(selected) ? selected.slice() : [];
    list = list.filter(function (v) { return allValues.indexOf(v) !== -1; });
    if (list.length === 0) return allValues.slice();
    return list;
  }

  function normalizeDayTypes(dayTypes) {
    var list = Array.isArray(dayTypes) ? dayTypes.slice() : [];
    list = list.filter(function (d) { return d === "D0" || d === "D7"; });
    if (list.length === 0) list = ["D0"];
    if (list.indexOf("D0") !== -1 && list.indexOf("D7") !== -1) return ["D0", "D7"];
    return list;
  }

  function betFlowFields(dayType, flowDim) {
    var prefix = dayType === "D7" ? "D7_" : "D0_";
    if (flowDim === "sports") {
      return { flow: prefix + "SPORTS_BET_FLOW", users: prefix + "SPORTS_BET_PLACED_USER" };
    }
    if (flowDim === "games") {
      return { flow: prefix + "GAMES_BET_FLOW", users: prefix + "GAMES_BET_PLACED_USER" };
    }
    return { flow: prefix + "TOTAL_BET_FLOW", users: prefix + "TOTAL_BET_PLACED_USER" };
  }

  function flowDimLabel(dim) {
    if (dim === "sports") return "人均体育";
    if (dim === "games") return "人均游戏";
    return "人均总";
  }

  function buildSeriesName(s, state, dayTypes) {
    var parts = [];
    if (!state.countriesAllNoSplit) parts.push(s.country);
    if (!state.mediasAllNoSplit) parts.push(s.media);
    if (!state.productTypesAllNoSplit) parts.push(s.productType);
    if (dayTypes.length > 1) parts.push(s.dayType);
    return parts.length ? parts.join(" | ") : "ALL";
  }

  function normalizeCountry(v) { return v == null ? "" : String(v).trim().toUpperCase(); }
  function normalizeMedia(v) { return v == null ? "" : String(v).trim().toUpperCase(); }
  function normalizeProductType(v) {
    if (v == null) return "";
    var t = String(v).trim();
    if (!t) return "";
    if (t.toLowerCase() === "h5") return "H5";
    if (t.toLowerCase() === "app") return "app";
    return t;
  }

  function toNumber(v) { var n = Number(v); return isFinite(n) ? n : 0; }
  function safeDiv(a, b) { var na = Number(a), nb = Number(b); if (!isFinite(na) || !isFinite(nb) || nb === 0) return null; return na / nb; }

  function formatMonthLabel(monthKey) {
    if (!monthKey || typeof monthKey !== "string") return "";
    var parts = monthKey.split("-");
    var mm = parts[1] || monthKey;
    var mNum = parseInt(mm, 10) || 0;
    return (mNum > 0 ? mNum : mm) + "月";
  }

  function formatUSD(v, decimals) {
    if (v == null || !isFinite(Number(v))) return "-";
    var n = Number(v);
    var d = typeof decimals === "number" ? decimals : 2;
    return n.toFixed(d);
  }

  function escapeHtml(s) {
    var str = String(s == null ? "" : s);
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // 注册模块
  if (window.PaidDashboard && typeof PaidDashboard.registerModule === "function") {
    PaidDashboard.registerModule(MODULE_KEY, init);
  } else {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  }
})();
