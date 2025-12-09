/**
 * paid-module-betflow.js
 *
 * 模块 7：D0 / D7 人均流水（总流水 / 体育流水 / 游戏流水）
 * - 顶部筛选：月份（≤3）、国家、多媒体、多产品形态、人均流水类型、D0/D7、图表类型（月度柱状 / 日级折线）
 * - 柱状图：x 轴为国家，series 为「月份 × D0/D7」，D7 用斜线阴影区分
 * - 折线图：日级，维度是否拆开由“全选但不区分”控制
 * - 下方表格：按国家（可拆媒体、产品）维度，列为「月份 × D0/D7 人均 XX 流水」
 */

(function () {
  function init() {
    var chartDom = document.getElementById("chart-paid-betflow");
    if (!chartDom || !window.echarts || !window.RAW_PAID_BY_MONTH) return;

    var chart = echarts.init(chartDom);
    if (window.PaidDashboard && typeof window.PaidDashboard.registerChart === "function") {
      window.PaidDashboard.registerChart(chart);
    }

    var container = chartDom.parentElement;
    if (!container) return;

    var moduleRoot = container;
    moduleRoot.classList.add("paid-module-betflow");

    // 顶部筛选容器
    var filtersWrapper = document.createElement("div");
    filtersWrapper.className = "paid-filters";
    moduleRoot.insertBefore(filtersWrapper, chartDom);

    // 下方表格容器
    var tableWrapper = document.createElement("div");
    tableWrapper.className = "paid-table-wrapper";
    moduleRoot.appendChild(tableWrapper);

    // ---------------- 数据 & 状态 ----------------
    var ALL_ROWS = collectAllRows();
    if (!ALL_ROWS.length) {
      chart.clear();
      return;
    }

    var ALL_MONTHS = getAllMonths(ALL_ROWS);
    var ALL_COUNTRIES = ["GH", "KE", "NG", "TZ"];

    var allMedia = getDistinct(ALL_ROWS, "media");
    var allProductTypes = getDistinct(ALL_ROWS, "productType");

    // 初始状态
    var state = {
      selectedMonths: ALL_MONTHS.slice(-1), // 默认选最新 1 个月
      selectedCountries: ALL_COUNTRIES.slice(),
      mergeCountries: false,
      selectedMedia: allMedia.slice(),
      mergeMedia: false,
      selectedProductTypes: allProductTypes.slice(),
      mergeProductTypes: false,
      flowType: "TOTAL", // TOTAL | SPORTS | GAMES
      dayTypes: ["D0", "D7"], // 多选
      chartMode: "month-bar" // "month-bar" | "day-line"
    };

    // 工具函数：安全除法 & 格式化
    var safeDiv =
      (window.PaidDashboard && window.PaidDashboard.safeDiv) ||
      function (a, b) {
        return !b ? 0 : a / b;
      };

    var fmtUSD =
      (window.PaidDashboard && window.PaidDashboard.formatUSD) ||
      function (v, digits) {
        if (v == null || isNaN(v)) return "-";
        var d = typeof digits === "number" ? digits : 2;
        return Number(v).toFixed(d);
      };

    var fmtInt =
      (window.PaidDashboard && window.PaidDashboard.formatInteger) ||
      function (v) {
        if (v == null || isNaN(v)) return "-";
        return Math.round(v).toLocaleString("en-US");
      };

    var COLORS =
      (window.PaidDashboard && window.PaidDashboard.COLORS) || [
        "#2563eb",
        "#10b981",
        "#f97316",
        "#8b5cf6",
        "#06b6d4",
        "#f59e0b"
      ];

    // 人均流水三种口径的字段映射
    var FLOW_META = {
      TOTAL: {
        key: "TOTAL",
        label: "总流水/人",
        shortLabel: "总",
        flowSuffix: "TOTAL_BET_FLOW",
        userSuffix: "TOTAL_BET_PLACED_USER"
      },
      SPORTS: {
        key: "SPORTS",
        label: "体育流水/人",
        shortLabel: "体育",
        flowSuffix: "SPORTS_BET_FLOW",
        userSuffix: "SPORTS_BET_PLACED_USER"
      },
      GAMES: {
        key: "GAMES",
        label: "游戏流水/人",
        shortLabel: "游戏",
        flowSuffix: "GAMES_BET_FLOW",
        userSuffix: "GAMES_BET_PLACED_USER"
      }
    };

    // ---------------- 构建筛选器 UI ----------------
    buildFiltersUI();

    // 首次渲染
    renderAll();

    // ================= 函数定义 =================

    // 把 RAW_PAID_BY_MONTH 展开成一维数组，并打上 month 字段
    function collectAllRows() {
      var src = window.RAW_PAID_BY_MONTH || {};
      var rows = [];
      for (var month in src) {
        if (!src.hasOwnProperty(month)) continue;
        var arr = src[month];
        if (!Array.isArray(arr)) continue;
        for (var i = 0; i < arr.length; i++) {
          var row = arr[i];
          var copy = {};
          for (var k in row) {
            if (row.hasOwnProperty(k)) copy[k] = row[k];
          }
          copy.month = month;
          rows.push(copy);
        }
      }
      return rows;
    }

    function getAllMonths(rows) {
      var set = {};
      for (var i = 0; i < rows.length; i++) {
        set[rows[i].month] = true;
      }
      var list = Object.keys(set);
      list.sort();
      return list;
    }

    function getDistinct(rows, field) {
      var set = {};
      for (var i = 0; i < rows.length; i++) {
        var v = rows[i][field];
        if (v != null && v !== "") set[v] = true;
      }
      var list = Object.keys(set);
      list.sort();
      return list;
    }

    function hasCountry(rows, country) {
      for (var i = 0; i < rows.length; i++) {
        if (rows[i].country === country) return true;
      }
      return false;
    }

    // ---------- 构建筛选 UI ----------
    function buildFiltersUI() {
      filtersWrapper.innerHTML = "";

      // 第一行：月份 + 图表类型
      var row1 = document.createElement("div");
      row1.className = "filters-row";
      filtersWrapper.appendChild(row1);

      var monthGroup = document.createElement("div");
      monthGroup.className = "filter-group";
      monthGroup.innerHTML =
        '<div class="filter-label">月份（最多 3 个）</div>' +
        '<div class="filter-options" data-role="months"></div>';
      row1.appendChild(monthGroup);

      var viewGroup = document.createElement("div");
      viewGroup.className = "filter-group";
      viewGroup.innerHTML =
        '<div class="filter-label">图表类型</div>' +
        '<div class="filter-options" data-role="view">' +
        '<label class="filter-chip"><input type="radio" name="betflow-view" value="month-bar" checked> 月度柱状图</label>' +
        '<label class="filter-chip"><input type="radio" name="betflow-view" value="day-line"> 日级折线图</label>' +
        "</div>";
      row1.appendChild(viewGroup);

      // 第二行：国家 + 媒体 + 产品类型
      var row2 = document.createElement("div");
      row2.className = "filters-row";
      filtersWrapper.appendChild(row2);

      var countryGroup = document.createElement("div");
      countryGroup.className = "filter-group";
      countryGroup.innerHTML =
        '<div class="filter-label">国家</div>' +
        '<div class="filter-options" data-role="countries"></div>' +
        '<label class="filter-chip filter-chip-merge">' +
        '<input type="checkbox" data-role="country-merge"> 全选但不区分' +
        "</label>";
      row2.appendChild(countryGroup);

      var mediaGroup = document.createElement("div");
      mediaGroup.className = "filter-group";
      mediaGroup.innerHTML =
        '<div class="filter-label">媒体</div>' +
        '<div class="filter-options" data-role="media"></div>' +
        '<label class="filter-chip filter-chip-merge">' +
        '<input type="checkbox" data-role="media-merge"> 全选但不区分' +
        "</label>";
      row2.appendChild(mediaGroup);

      var productGroup = document.createElement("div");
      productGroup.className = "filter-group";
      productGroup.innerHTML =
        '<div class="filter-label">产品类型</div>' +
        '<div class="filter-options" data-role="product"></div>' +
        '<label class="filter-chip filter-chip-merge">' +
        '<input type="checkbox" data-role="product-merge"> 全选但不区分' +
        "</label>";
      row2.appendChild(productGroup);

      // 第三行：人均流水类型 + D0 / D7
      var row3 = document.createElement("div");
      row3.className = "filters-row";
      filtersWrapper.appendChild(row3);

      var flowTypeGroup = document.createElement("div");
      flowTypeGroup.className = "filter-group";
      flowTypeGroup.innerHTML =
        '<div class="filter-label">人均流水口径</div>' +
        '<div class="filter-options" data-role="flow-type">' +
        '<label class="filter-chip"><input type="radio" name="betflow-type" value="TOTAL" checked> 总流水/人</label>' +
        '<label class="filter-chip"><input type="radio" name="betflow-type" value="SPORTS"> 体育流水/人</label>' +
        '<label class="filter-chip"><input type="radio" name="betflow-type" value="GAMES"> 游戏流水/人</label>' +
        "</div>";
      row3.appendChild(flowTypeGroup);

      var dayTypeGroup = document.createElement("div");
      dayTypeGroup.className = "filter-group";
      dayTypeGroup.innerHTML =
        '<div class="filter-label">D0 / D7</div>' +
        '<div class="filter-options" data-role="day-type">' +
        '<label class="filter-chip"><input type="checkbox" value="D0" checked> D0</label>' +
        '<label class="filter-chip"><input type="checkbox" value="D7" checked> D7</label>' +
        "</div>";
      row3.appendChild(dayTypeGroup);

      // 填充月份选项
      var monthsBox = monthGroup.querySelector('[data-role="months"]');
      for (var i = 0; i < ALL_MONTHS.length; i++) {
        var m = ALL_MONTHS[i];
        var label = document.createElement("label");
        label.className = "filter-chip";
        var checked = state.selectedMonths.indexOf(m) !== -1;
        label.innerHTML =
          '<input type="checkbox" data-role="month" value="' +
          m +
          '" ' +
          (checked ? "checked" : "") +
          "> " +
          m;
        monthsBox.appendChild(label);
      }

      // 国家按固定顺序，只展示有数据的
      var countryBox = countryGroup.querySelector('[data-role="countries"]');
      var availableCountries = [];
      for (var cIndex = 0; cIndex < ALL_COUNTRIES.length; cIndex++) {
        if (hasCountry(ALL_ROWS, ALL_COUNTRIES[cIndex])) {
          availableCountries.push(ALL_COUNTRIES[cIndex]);
        }
      }
      if (!availableCountries.length) {
        availableCountries = ALL_COUNTRIES.slice();
      }
      for (var j = 0; j < availableCountries.length; j++) {
        var c = availableCountries[j];
        var labelC = document.createElement("label");
        labelC.className = "filter-chip";
        labelC.innerHTML =
          '<input type="checkbox" data-role="country" value="' +
          c +
          '" checked> ' +
          c;
        countryBox.appendChild(labelC);
      }

      // 媒体选项
      var mediaBox = mediaGroup.querySelector('[data-role="media"]');
      for (var k = 0; k < allMedia.length; k++) {
        var md = allMedia[k];
        var labelM = document.createElement("label");
        labelM.className = "filter-chip";
        labelM.innerHTML =
          '<input type="checkbox" data-role="media" value="' +
          md +
          '" checked> ' +
          md;
        mediaBox.appendChild(labelM);
      }

      // 产品类型选项
      var productBox = productGroup.querySelector('[data-role="product"]');
      for (var p = 0; p < allProductTypes.length; p++) {
        var pt = allProductTypes[p];
        var labelP = document.createElement("label");
        labelP.className = "filter-chip";
        var ptLabel = pt && pt.toUpperCase ? pt.toUpperCase() : pt;
        labelP.innerHTML =
          '<input type="checkbox" data-role="product" value="' +
          pt +
          '" checked> ' +
          ptLabel;
        productBox.appendChild(labelP);
      }

      // 绑定事件
      bindFilterEvents(filtersWrapper, availableCountries);
    }

    // ---------- 筛选事件逻辑 ----------
    function bindFilterEvents(root, availableCountries) {
      // 统一 change 事件代理
      root.addEventListener("change", function (e) {
        var target = e.target;
        if (!target || target.tagName !== "INPUT") return;

        var role = target.getAttribute("data-role");
        var name = target.getAttribute("name");
        var value = target.value;

        // 图表类型
        if (name === "betflow-view") {
          state.chartMode = value; // month-bar / day-line
          renderAll();
          return;
        }

        // 人均流水类型
        if (name === "betflow-type") {
          state.flowType = value; // TOTAL / SPORTS / GAMES
          renderAll();
          return;
        }

        // 月份多选
        if (role === "month") {
          handleMonthChange(target);
          return;
        }

        // 国家 / 媒体 / 产品多选
        if (role === "country") {
          handleMultiCheckboxChange(
            "selectedCountries",
            target,
            availableCountries,
            "country-merge"
          );
          return;
        }
        if (role === "media") {
          handleMultiCheckboxChange(
            "selectedMedia",
            target,
            allMedia,
            "media-merge"
          );
          return;
        }
        if (role === "product") {
          handleMultiCheckboxChange(
            "selectedProductTypes",
            target,
            allProductTypes,
            "product-merge"
          );
          return;
        }

        // “全选但不区分”
        if (role === "country-merge") {
          handleMergeToggle(
            "mergeCountries",
            "selectedCountries",
            availableCountries,
            target,
            "country"
          );
          return;
        }
        if (role === "media-merge") {
          handleMergeToggle(
            "mergeMedia",
            "selectedMedia",
            allMedia,
            target,
            "media"
          );
          return;
        }
        if (role === "product-merge") {
          handleMergeToggle(
            "mergeProductTypes",
            "selectedProductTypes",
            allProductTypes,
            target,
            "product"
          );
          return;
        }
      });

      // D0 / D7 多选
      var dayBox = root.querySelector('[data-role="day-type"]');
      if (dayBox) {
        dayBox.addEventListener("change", function (e) {
          var t = e.target;
          if (!t || t.tagName !== "INPUT") return;
          var val = t.value;
          var idx = state.dayTypes.indexOf(val);

          if (t.checked) {
            if (idx === -1) state.dayTypes.push(val);
          } else {
            if (state.dayTypes.length === 1) {
              // 不允许全取消
              t.checked = true;
              return;
            }
            if (idx !== -1) state.dayTypes.splice(idx, 1);
          }
          state.dayTypes.sort();
          renderAll();
        });
      }

      // 月份多选控制（≤3）
      function handleMonthChange(input) {
        var val = input.value;
        var idx = state.selectedMonths.indexOf(val);

        if (input.checked) {
          if (idx === -1) {
            if (state.selectedMonths.length >= 3) {
              input.checked = false;
              alert("月份最多选择 3 个");
              return;
            }
            state.selectedMonths.push(val);
          }
        } else {
          if (state.selectedMonths.length === 1) {
            input.checked = true;
            return;
          }
          if (idx !== -1) state.selectedMonths.splice(idx, 1);
        }
        state.selectedMonths.sort();
        renderAll();
      }

      // 通用：某维度多选
      function handleMultiCheckboxChange(stateKey, input, fullList, mergeRole) {
        var val = input.value;
        var arr = state[stateKey].slice();
        var idx = arr.indexOf(val);

        if (input.checked) {
          if (idx === -1) arr.push(val);
        } else {
          if (arr.length === 1) {
            input.checked = true;
            return;
          }
          if (idx !== -1) arr.splice(idx, 1);
        }
        state[stateKey] = arr;

        // 如果不再全选，则自动取消“全选但不区分”
        if (arr.length !== fullList.length) {
          var mergeInput = filtersWrapper.querySelector(
            'input[data-role="' + mergeRole + '"]'
          );
          if (mergeInput) mergeInput.checked = false;

          if (mergeRole === "country-merge") state.mergeCountries = false;
          if (mergeRole === "media-merge") state.mergeMedia = false;
          if (mergeRole === "product-merge") state.mergeProductTypes = false;
        }

        renderAll();
      }

      // “全选但不区分”切换：选中 = 全选 + 合并，不选 = 只取消合并
      function handleMergeToggle(
        mergeKey,
        listKey,
        fullList,
        input,
        itemRoleName
      ) {
        if (input.checked) {
          state[mergeKey] = true;
          state[listKey] = fullList.slice();
          // 勾选所有子项
          var selector = 'input[data-role="' + itemRoleName + '"]';
          var boxes = filtersWrapper.querySelectorAll(selector);
          for (var i = 0; i < boxes.length; i++) {
            boxes[i].checked = true;
          }
        } else {
          state[mergeKey] = false;
        }
        renderAll();
      }
    }

    // ---------- 根据当前 state 过滤数据 ----------
    function filterRowsForState() {
      var rows = [];
      var monthsSet = arrToSet(state.selectedMonths);
      var countrySet = arrToSet(state.selectedCountries);
      var mediaSet = arrToSet(state.selectedMedia);
      var productSet = arrToSet(state.selectedProductTypes);

      for (var i = 0; i < ALL_ROWS.length; i++) {
        var r = ALL_ROWS[i];
        if (!monthsSet[r.month]) continue;
        if (!countrySet[r.country]) continue;
        if (!mediaSet[r.media]) continue;
        if (!productSet[r.productType]) continue;
        rows.push(r);
      }
      return rows;
    }

    function arrToSet(arr) {
      var map = {};
      for (var i = 0; i < arr.length; i++) map[arr[i]] = true;
      return map;
    }

    // ---------- 总渲染入口 ----------
    function renderAll() {
      var rows = filterRowsForState();
      var meta = FLOW_META[state.flowType] || FLOW_META.TOTAL;

      if (!rows.length) {
        chart.clear();
        tableWrapper.innerHTML = "";
        return;
      }

      if (state.chartMode === "month-bar") {
        renderBarChart(rows, meta);
      } else {
        renderLineChart(rows, meta);
      }
      renderTable(rows, meta);
    }

    // ---------- 柱状图：x 轴国家，series = 月份 × D0/D7 ----------
    function renderBarChart(rows, meta) {
      var xCountries = [];
      var selectedSet = arrToSet(state.selectedCountries);
      for (var i = 0; i < ALL_COUNTRIES.length; i++) {
        var c = ALL_COUNTRIES[i];
        if (selectedSet[c]) xCountries.push(c);
      }
      if (!xCountries.length) {
        xCountries = state.selectedCountries.slice();
      }

      // month -> country -> dayType -> {flow,user}
      var map = {};
      for (var rIndex = 0; rIndex < rows.length; rIndex++) {
        var r = rows[rIndex];
        if (!selectedSet[r.country]) continue;
        if (state.selectedMonths.indexOf(r.month) === -1) continue;

        var month = r.month;
        if (!map[month]) map[month] = {};
        var countryMap = map[month];
        var cKey = r.country;
        if (!countryMap[cKey]) countryMap[cKey] = {};
        var dayMap = countryMap[cKey];

        for (var d = 0; d < state.dayTypes.length; d++) {
          var dayType = state.dayTypes[d];
          var flowField = dayType + "_" + meta.flowSuffix;
          var userField = dayType + "_" + meta.userSuffix;
          var flow = Number(r[flowField] || 0);
          var user = Number(r[userField] || 0);
          if (!dayMap[dayType]) dayMap[dayType] = { flow: 0, user: 0 };
          dayMap[dayType].flow += flow;
          dayMap[dayType].user += user;
        }
      }

      var series = [];
      for (var mIndex = 0; mIndex < state.selectedMonths.length; mIndex++) {
        var monthKey = state.selectedMonths[mIndex];
        var monthColor = COLORS[mIndex % COLORS.length];

        for (var dIndex = 0; dIndex < state.dayTypes.length; dIndex++) {
          var dayTypeKey = state.dayTypes[dIndex];
          var isD7 = dayTypeKey === "D7";

          var data = [];
          for (var cIndex = 0; cIndex < xCountries.length; cIndex++) {
            var cName = xCountries[cIndex];
            var monthData = map[monthKey] && map[monthKey][cName];
            var bucket = monthData && monthData[dayTypeKey];
            if (!bucket || !bucket.user) {
              data.push(null);
            } else {
              data.push(safeDiv(bucket.flow, bucket.user));
            }
          }

          var itemStyle = { color: monthColor };
          // D7 柱子加斜线阴影
          if (isD7) {
            itemStyle.decal = {
              symbol: "line",
              dashArrayX: [1, 0],
              dashArrayY: [2, 3],
              rotation: Math.PI / 4
            };
          }

          series.push({
            name: monthKey + " " + dayTypeKey,
            type: "bar",
            data: data,
            barGap: 0,
            barCategoryGap: "45%",
            itemStyle: itemStyle
          });
        }
      }

      var option = {
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
          formatter: function (params) {
            if (!params || !params.length) return "";
            var lines = [];
            var country = params[0].name;
            lines.push(country);
            for (var i = 0; i < params.length; i++) {
              var p = params[i];
              var v = p.value;
              var vText = v == null ? "-" : fmtUSD(v, 2) + " USD/人";
              lines.push(p.marker + p.seriesName + "： " + vText);
            }
            return lines.join("<br>");
          }
        },
        legend: {
          top: 0
        },
        grid: {
          left: 40,
          right: 16,
          top: 48,
          bottom: 32
        },
        xAxis: {
          type: "category",
          data: xCountries
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: function (v) {
              return fmtUSD(v, 2);
            }
          }
        },
        series: series
      };

      chart.setOption(option, true);
    }

    // ---------- 折线图：日级，是否拆国家/媒体/产品由 merge 开关决定 ----------
    function renderLineChart(rows, meta) {
      var dateSet = {};
      for (var i = 0; i < rows.length; i++) {
        dateSet[rows[i].date] = true;
      }
      var dates = Object.keys(dateSet);
      dates.sort();

      // key -> { name, sums: {date: {flow,user}} }
      var seriesMap = {};
      for (var rIndex = 0; rIndex < rows.length; rIndex++) {
        var r = rows[rIndex];
        for (var d = 0; d < state.dayTypes.length; d++) {
          var dayType = state.dayTypes[d];

          var groupInfo = buildGroupInfo(r, dayType);
          var key = groupInfo.key;
          var name = groupInfo.name;

          if (!seriesMap[key]) {
            seriesMap[key] = { name: name, sums: {} };
          }
          var sums = seriesMap[key].sums;
          var dateKey = r.date;
          if (!sums[dateKey]) {
            sums[dateKey] = { flow: 0, user: 0 };
          }

          var flowField = dayType + "_" + meta.flowSuffix;
          var userField = dayType + "_" + meta.userSuffix;
          sums[dateKey].flow += Number(r[flowField] || 0);
          sums[dateKey].user += Number(r[userField] || 0);
        }
      }

      var seriesList = [];
      var colorIndex = 0;
      for (var key in seriesMap) {
        if (!seriesMap.hasOwnProperty(key)) continue;
        var entry = seriesMap[key];
        var data = [];

        for (var i = 0; i < dates.length; i++) {
          var dt = dates[i];
          var bucket = entry.sums[dt];
          if (!bucket || !bucket.user) data.push(null);
          else data.push(safeDiv(bucket.flow, bucket.user));
        }

        seriesList.push({
          name: entry.name,
          type: "line",
          smooth: true,
          data: data,
          showSymbol: false,
          symbol: "circle",
          symbolSize: 4,
          lineStyle: { width: 2 },
          itemStyle: { color: COLORS[colorIndex % COLORS.length] }
        });
        colorIndex++;
      }

      var option = {
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "line" },
          formatter: function (params) {
            if (!params || !params.length) return "";
            var date = params[0].axisValue;
            var lines = [date];
            for (var i = 0; i < params.length; i++) {
              var p = params[i];
              var v = p.value;
              var vText = v == null ? "-" : fmtUSD(v, 2) + " USD/人";
              lines.push(p.marker + p.seriesName + "： " + vText);
            }
            return lines.join("<br>");
          }
        },
        legend: {
          top: 0,
          type: "scroll"
        },
        grid: {
          left: 40,
          right: 16,
          top: 48,
          bottom: 40
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: dates
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: function (v) {
              return fmtUSD(v, 2);
            }
          }
        },
        series: seriesList
      };

      chart.setOption(option, true);
    }

    // 构建折线图分组 key & 展示名称
    function buildGroupInfo(row, dayType) {
      var partsKey = [];
      var partsName = [];

      if (state.mergeCountries) {
        partsKey.push("ALL_COUNTRIES");
      } else {
        partsKey.push("C:" + row.country);
        partsName.push(row.country);
      }

      if (state.mergeMedia) {
        partsKey.push("ALL_MEDIA");
      } else {
        partsKey.push("M:" + row.media);
        partsName.push(row.media);
      }

      if (state.mergeProductTypes) {
        partsKey.push("ALL_PRODUCT");
      } else {
        partsKey.push("P:" + row.productType);
        var ptLabel =
          row.productType && row.productType.toUpperCase
            ? row.productType.toUpperCase()
            : row.productType;
        partsName.push(ptLabel);
      }

      partsKey.push("D:" + dayType);

      var name;
      if (partsName.length) {
        name = partsName.join(" · ") + " · " + dayType;
      } else {
        name = "汇总 · " + dayType;
      }

      return {
        key: partsKey.join("|"),
        name: name
      };
    }

    // ---------- 下方表格渲染 ----------
    function renderTable(rows, meta) {
      var months = state.selectedMonths.slice();

      // key -> { country, media, productType, values: {month: {dayType:{flow,user}}} }
      var groups = {};

      for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        if (months.indexOf(r.month) === -1) continue;

        var countryKey = state.mergeCountries ? "ALL" : r.country;
        var mediaKey = state.mergeMedia ? "ALL" : r.media;
        var productKey = state.mergeProductTypes ? "ALL" : r.productType;

        var key = countryKey + "|" + mediaKey + "|" + productKey;

        if (!groups[key]) {
          groups[key] = {
            country: state.mergeCountries ? "合计" : r.country,
            media: state.mergeMedia ? "合并" : r.media,
            productType: state.mergeProductTypes
              ? "合并"
              : (r.productType && r.productType.toUpperCase
                  ? r.productType.toUpperCase()
                  : r.productType),
            values: {}
          };
        }

        var group = groups[key];
        if (!group.values[r.month]) group.values[r.month] = {};

        for (var d = 0; d < state.dayTypes.length; d++) {
          var dayType = state.dayTypes[d];
          var flowField = dayType + "_" + meta.flowSuffix;
          var userField = dayType + "_" + meta.userSuffix;
          var flow = Number(r[flowField] || 0);
          var user = Number(r[userField] || 0);

          if (!group.values[r.month][dayType]) {
            group.values[r.month][dayType] = { flow: 0, user: 0 };
          }
          group.values[r.month][dayType].flow += flow;
          group.values[r.month][dayType].user += user;
        }
      }

      var rowsList = Object.keys(groups).map(function (k) {
        return groups[k];
      });

      // 国家顺序：GH/KE/NG/TZ，然后按媒体、产品排序
      rowsList.sort(function (a, b) {
        var idxA = ALL_COUNTRIES.indexOf(a.country);
        var idxB = ALL_COUNTRIES.indexOf(b.country);
        if (idxA === -1) idxA = 999;
        if (idxB === -1) idxB = 999;
        if (idxA !== idxB) return idxA - idxB;
        if (a.media !== b.media) return (a.media || "").localeCompare(b.media || "");
        return (a.productType || "").localeCompare(b.productType || "");
      });

      var showMediaCol = !state.mergeMedia && state.selectedMedia.length > 1;
      var showProductCol =
        !state.mergeProductTypes && state.selectedProductTypes.length > 1;

      // 表头标题中带上媒体、产品筛选信息
      var mediaLabel;
      if (state.mergeMedia) {
        mediaLabel = "媒体：合并";
      } else if (
        state.selectedMedia.length === 0 ||
        state.selectedMedia.length === allMedia.length
      ) {
        mediaLabel = "媒体：全部";
      } else {
        mediaLabel = "媒体：" + state.selectedMedia.join("+");
      }

      var productLabel;
      if (state.mergeProductTypes) {
        productLabel = "产品：合并";
      } else if (
        state.selectedProductTypes.length === 0 ||
        state.selectedProductTypes.length === allProductTypes.length
      ) {
        productLabel = "产品：全部";
      } else {
        productLabel = "产品：" + state.selectedProductTypes.join("+");
      }

      var title =
        "D0 / D7 人均" +
        meta.shortLabel +
        "流水表（" +
        mediaLabel +
        "；" +
        productLabel +
        "）";

      var html = "";
      html += '<div class="table-title">' + title + "</div>";
      html += '<div class="table-scroll">';
      html += "<table>";
      html += "<thead><tr>";
      html += "<th>国家</th>";
      if (showMediaCol) html += "<th>媒体</th>";
      if (showProductCol) html += "<th>产品类型</th>";
      for (var mIndex = 0; mIndex < months.length; mIndex++) {
        var mKey = months[mIndex];
        for (var dIndex = 0; dIndex < state.dayTypes.length; dIndex++) {
          var dType = state.dayTypes[dIndex];
          html +=
            "<th>" +
            mKey +
            " " +
            dType +
            " 人均" +
            meta.shortLabel +
            "流水</th>";
        }
      }
      html += "</tr></thead><tbody>";

      if (!rowsList.length) {
        html += '<tr><td colspan="10">当前筛选下暂无数据</td></tr>';
      } else {
        for (var rIndex = 0; rIndex < rowsList.length; rIndex++) {
          var row = rowsList[rIndex];
          html += "<tr>";
          html += "<td>" + row.country + "</td>";
          if (showMediaCol) html += "<td>" + row.media + "</td>";
          if (showProductCol) html += "<td>" + row.productType + "</td>";

          for (var mIndex2 = 0; mIndex2 < months.length; mIndex2++) {
            var monthKey2 = months[mIndex2];
            var monthValues = row.values[monthKey2] || {};
            for (var dIndex2 = 0; dIndex2 < state.dayTypes.length; dIndex2++) {
              var dType2 = state.dayTypes[dIndex2];
              var bucket = monthValues[dType2];
              var val =
                bucket && bucket.user
                  ? safeDiv(bucket.flow, bucket.user)
                  : null;
              html += "<td>" + (val == null ? "-" : fmtUSD(val, 2)) + "</td>";
            }
          }

          html += "</tr>";
        }
      }

      html += "</tbody></table></div>";

      tableWrapper.innerHTML = html;
    }
  }

  // 注册到 PaidDashboard，如果没有就用 DOMContentLoaded 兜底
  if (window.PaidDashboard && typeof window.PaidDashboard.registerModule === "function") {
    window.PaidDashboard.registerModule("flow", init);
  } else if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  }
})();
