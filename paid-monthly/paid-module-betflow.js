/**
 * paid-module-betflow.js
 * --------------------------
 * 模块：D0/D7 人均流水（总流水 / 体育流水 / 游戏流水）
 *
 * 需求要点：
 * - 独立筛选：月份(最多3)、国家、图形(月度柱状图/日级折线图)、媒体、产品类型、人均类型(总/体育/游戏)、D0/D7(多选)
 * - “全选但不区分”：等价全选，但图/表聚合，不拆线、不拆维度
 * - 柱状图：X轴国家固定顺序 GH/KE/NG/TZ；同月 D0/D7 同色；D7 斜线阴影(decal)区分
 * - 折线图：日级，跨月连续；媒体/产品类型拆线（若选择“全选但不区分”则聚合）
 * - 表格：与筛选联动；标题附带 (媒体, 产品类型)
 *
 * 数据源：window.RAW_PAID_BY_MONTH（见 paid-data.js）
 */

(function () {
  const MODULE_KEY = "betflow";
  const FIXED_COUNTRY_ORDER = ["GH", "KE", "NG", "TZ"];

  const DEFAULT_COLORS = ["#2563eb", "#16a34a", "#f97316", "#7c3aed", "#ef4444", "#0f766e"];

  // D7 斜线阴影（ECharts 5 的 decal）
  const D7_DECAL = {
    symbol: "rect",
    symbolSize: 1,
    dashArrayX: [2, 2],
    dashArrayY: [6, 0],
    rotation: Math.PI / 4,
    color: "rgba(255,255,255,0.35)",
  };

  function getRAW() {
    return window.RAW_PAID_BY_MONTH || {};
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

  function formatProductTypeLabel(v) {
    const t = normalizeProductType(v);
    if (t === "app") return "APP";
    if (t === "h5") return "H5";
    return String(v || "");
  }

  function formatMonthLabel(monthKey) {
    if (window.PaidDashboard && typeof window.PaidDashboard.formatMonthLabel === "function") {
      return window.PaidDashboard.formatMonthLabel(monthKey);
    }
    if (!monthKey || typeof monthKey !== "string") return "";
    const parts = monthKey.split("-");
    const mm = parts[1] || monthKey;
    const mNum = parseInt(mm, 10) || 0;
    return (mNum > 0 ? mNum : mm) + "月";
  }

  function formatUSD(v, digits) {
    const d = typeof digits === "number" ? digits : 2;
    if (v == null || !isFinite(v)) return "-";
    return Number(v).toLocaleString(undefined, {
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    });
  }

  function safeDiv(a, b) {
    const na = Number(a);
    const nb = Number(b);
    if (!isFinite(na) || !isFinite(nb) || nb === 0) return null;
    return na / nb;
  }

  function uniq(arr) {
    return Array.from(new Set((arr || []).filter((v) => v != null)));
  }

  function setArray(target, values) {
    target.length = 0;
    (values || []).forEach((v) => target.push(v));
  }

  function sortCountries(list) {
    const arr = (list || []).slice();
    arr.sort((a, b) => {
      const ia = FIXED_COUNTRY_ORDER.indexOf(a);
      const ib = FIXED_COUNTRY_ORDER.indexOf(b);
      const ha = ia !== -1;
      const hb = ib !== -1;
      if (ha && hb) return ia - ib;
      if (ha) return -1;
      if (hb) return 1;
      return String(a).localeCompare(String(b));
    });
    return arr;
  }

  function pickDefaultMonths(allMonths) {
    const months = (allMonths || []).slice();
    if (!months.length) return [];
    // 默认取最近 2 个月（不够就取 1 个）
    return months.slice(Math.max(0, months.length - 2));
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

    return {
      months,
      countries: sortCountries(Array.from(cSet)),
      medias: Array.from(mSet).sort(),
      productTypes: Array.from(pSet).sort(),
    };
  }

  function ensureNonEmpty(state, opts) {
    if (!state.months.length) state.months = pickDefaultMonths(opts.months);
    if (!state.months.length) state.months = (opts.months || []).slice(-1);

    if (!state.countries.length) state.countries = (opts.countries || []).slice();
    if (!state.medias.length) state.medias = (opts.medias || []).slice();
    if (!state.productTypes.length) state.productTypes = (opts.productTypes || []).slice();

    if (!state.windows.length) state.windows = ["D0", "D7"];
    if (!state.kind) state.kind = "total";
    if (!state.view) state.view = "bar";
  }

  function injectTableStylesOnce() {
    if (document.getElementById("paid-data-table-style")) return;
    const style = document.createElement("style");
    style.id = "paid-data-table-style";
    style.textContent = `
      .data-table-wrap{width:100%;overflow:auto;border-radius:12px;border:1px solid rgba(148,163,184,0.35);background:rgba(255,255,255,0.85);}
      table.data-table{width:100%;border-collapse:collapse;font-size:11px;}
      table.data-table thead th{position:sticky;top:0;background:rgba(37,99,235,0.06);color:#475569;font-weight:600;z-index:1;}
      table.data-table th,table.data-table td{padding:6px 8px;border-bottom:1px solid rgba(148,163,184,0.28);white-space:nowrap;}
      table.data-table tbody tr:hover td{background:rgba(37,99,235,0.04);}
      table.data-table th{text-align:right;}
      table.data-table td{text-align:right;}
      table.data-table th:first-child,table.data-table td:first-child{text-align:left;}
      .table-block{margin-top:10px;}
      .table-title{font-size:12px;font-weight:600;color:#0f172a;margin:6px 0 8px;display:flex;gap:10px;align-items:center;}
      .table-sub{font-size:11px;font-weight:500;color:#475569;}
    `;
    document.head.appendChild(style);
  }

  function kindLabel(kind) {
    if (kind === "sports") return "体育";
    if (kind === "games") return "游戏";
    return "总";
  }

  function fieldsFor(win, kind) {
    const prefix = win === "D7" ? "D7" : "D0";
    if (kind === "sports") {
      return {
        flowField: `${prefix}_SPORTS_BET_FLOW`,
        userField: `${prefix}_SPORTS_BET_PLACED_USER`,
      };
    }
    if (kind === "games") {
      return {
        flowField: `${prefix}_GAMES_BET_FLOW`,
        userField: `${prefix}_GAMES_BET_PLACED_USER`,
      };
    }
    return {
      flowField: `${prefix}_TOTAL_BET_FLOW`,
      userField: `${prefix}_TOTAL_BET_PLACED_USER`,
    };
  }

  function buildTitleSuffix(state, opts) {
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
      : state.productTypes.map(formatProductTypeLabel).join("+");

    return `（${mediaText}, ${typeText}）`;
  }

  function init() {
    const chartEl = document.getElementById("chart-paid-betflow");
    if (!chartEl || !window.echarts) return;

    injectTableStylesOnce();

    const card = chartEl.closest(".chart-card") || document.getElementById("card-paid-betflow") || chartEl.parentElement;
    if (!card) return;

    // 如果旧版 index.html 还保留了 flow-daytype / flow-type，先隐藏掉，避免和本模块的多选冲突
    ["flow-daytype", "flow-type"].forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const wrap = el.closest(".chart-mini-filter");
      if (wrap) wrap.style.display = "none";
    });

    const opts = buildOptionsFromRAW();

    const state = {
      view: "bar", // bar | line
      months: [],
      countries: [],
      medias: [],
      productTypes: [],
      kind: "total", // total | sports | games
      windows: ["D0", "D7"], // 多选
      collapse: { countries: false, medias: false, productTypes: false },
    };

    ensureNonEmpty(state, opts);

    // -----------------------------
    // DOM: 筛选区 + 表格区（没有就自动补）
    // -----------------------------
    const headerEl = card.querySelector("header");

    const PANEL_ID = "betflow-filters";
    let panel = card.querySelector(`#${PANEL_ID}`);
    if (!panel) {
      panel = document.createElement("div");
      panel.id = PANEL_ID;
      panel.style.padding = "10px 16px 12px";
      panel.style.borderBottom = "1px solid rgba(148,163,184,0.25)";
      panel.style.background = "linear-gradient(to right, rgba(37,99,235,0.04), rgba(255,255,255,0.75))";

      function makeRow(labelText, rightEl) {
        const row = document.createElement("div");
        row.className = "hero-filter-row";
        const label = document.createElement("div");
        label.className = "label";
        label.textContent = labelText;
        row.appendChild(label);
        row.appendChild(rightEl);
        return row;
      }

      const viewWrap = document.createElement("div");
      viewWrap.className = "chart-mini-radio";
      viewWrap.id = "betflow-view";

      const monthsWrap = document.createElement("div");
      monthsWrap.className = "chart-mini-chips";
      monthsWrap.id = "betflow-months";

      const countriesWrap = document.createElement("div");
      countriesWrap.className = "chart-mini-chips";
      countriesWrap.id = "betflow-countries";

      const mediasWrap = document.createElement("div");
      mediasWrap.className = "chart-mini-chips";
      mediasWrap.id = "betflow-medias";

      const typesWrap = document.createElement("div");
      typesWrap.className = "chart-mini-chips";
      typesWrap.id = "betflow-productTypes";

      const kindWrap = document.createElement("div");
      kindWrap.className = "chart-mini-radio";
      kindWrap.id = "betflow-kind";

      const windowsWrap = document.createElement("div");
      windowsWrap.className = "chart-mini-chips";
      windowsWrap.id = "betflow-windows";

      panel.appendChild(makeRow("图形", viewWrap));
      panel.appendChild(makeRow("月份", monthsWrap));
      panel.appendChild(makeRow("国家", countriesWrap));
      panel.appendChild(makeRow("媒体", mediasWrap));
      panel.appendChild(makeRow("形态", typesWrap));
      panel.appendChild(makeRow("人均", kindWrap));
      panel.appendChild(makeRow("D0/D7", windowsWrap));

      if (headerEl) headerEl.insertAdjacentElement("afterend", panel);
      else card.insertAdjacentElement("afterbegin", panel);
    }

    // 表格块：插在 chart 与 analysis 之间（如果 analysis 存在）
    const summaryEl =
      card.querySelector('.chart-summary[data-analysis-key="flow"]') || card.querySelector(".chart-summary");
    let tableBlock = card.querySelector("#betflow-table-block");
    if (!tableBlock) {
      tableBlock = document.createElement("div");
      tableBlock.id = "betflow-table-block";
      tableBlock.className = "table-block";
      tableBlock.style.padding = "0 16px 14px";

      const titleRow = document.createElement("div");
      titleRow.className = "table-title";

      const titleText = document.createElement("span");
      titleText.id = "table-title-betflow";

      const subText = document.createElement("span");
      subText.id = "table-sub-betflow";
      subText.className = "table-sub";
      subText.style.marginLeft = "auto";

      titleRow.appendChild(titleText);
      titleRow.appendChild(subText);

      const wrap = document.createElement("div");
      wrap.className = "data-table-wrap";

      const table = document.createElement("table");
      table.id = "table-betflow";
      table.className = "data-table";

      wrap.appendChild(table);

      tableBlock.appendChild(titleRow);
      tableBlock.appendChild(wrap);

      if (summaryEl) summaryEl.insertAdjacentElement("beforebegin", tableBlock);
      else chartEl.insertAdjacentElement("afterend", tableBlock);
    }

    const viewWrap = document.getElementById("betflow-view");
    const monthsWrap = document.getElementById("betflow-months");
    const countriesWrap = document.getElementById("betflow-countries");
    const mediasWrap = document.getElementById("betflow-medias");
    const typesWrap = document.getElementById("betflow-productTypes");
    const kindWrap = document.getElementById("betflow-kind");
    const windowsWrap = document.getElementById("betflow-windows");

    const tableTitleEl = document.getElementById("table-title-betflow");
    const tableSubEl = document.getElementById("table-sub-betflow");
    const tableEl = document.getElementById("table-betflow");

    const colors =
      window.PaidDashboard && Array.isArray(window.PaidDashboard.COLORS) && window.PaidDashboard.COLORS.length
        ? window.PaidDashboard.COLORS
        : DEFAULT_COLORS;

    const chart = echarts.init(chartEl);
    if (window.PaidDashboard && typeof window.PaidDashboard.registerChart === "function") {
      window.PaidDashboard.registerChart(chart);
    } else {
      window.addEventListener("resize", () => {
        try {
          chart.resize();
        } catch (e) {}
      });
    }

    // -----------------------------
    // UI 渲染：radio / chips
    // -----------------------------
    function renderRadio(container, groupName, items, currentValue, onPick) {
      if (!container) return;
      container.innerHTML = "";
      items.forEach((it) => {
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = groupName;
        input.value = it.value;
        input.checked = it.value === currentValue;
        input.addEventListener("change", () => {
          if (!input.checked) return;
          onPick(it.value);
        });
        label.appendChild(input);
        label.appendChild(document.createTextNode(it.label));
        container.appendChild(label);
      });
    }

    function renderChips(container, values, stateArray, options) {
      if (!container) return;
      const max = options && options.max ? options.max : null;
      const allowEmpty = options && options.allowEmpty ? true : false;
      const getLabel = options && options.getLabel ? options.getLabel : null;

      container.innerHTML = "";

      if (Array.isArray(stateArray) && stateArray.length === 0) {
        setArray(stateArray, values);
      }

      values.forEach((value, idx) => {
        const labelEl = document.createElement("label");
        labelEl.className = "filter-chip";

        const input = document.createElement("input");
        input.type = "checkbox";
        input.value = value;

        const selected = stateArray.indexOf(value) !== -1;
        input.checked = selected;
        labelEl.classList.toggle("filter-chip-active", selected);

        labelEl.appendChild(input);
        labelEl.appendChild(document.createTextNode(typeof getLabel === "function" ? getLabel(value, idx) : value));

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

          renderAll();
        });

        container.appendChild(labelEl);
      });
    }

    // 带“全选但不区分”的 chips（勾上后强制全选，图/表不拆维度）
    function renderChipsWithCollapse(container, values, stateArray, collapseKey, options) {
      if (!container) return;
      const max = options && options.max ? options.max : null;
      const allowEmpty = options && options.allowEmpty ? true : false;
      const getLabel = options && options.getLabel ? options.getLabel : null;

      const _values = (values || []).slice();
      container.innerHTML = "";

      // 先插入“全选但不区分”
      {
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

      // 默认全选
      if (Array.isArray(stateArray) && stateArray.length === 0) {
        setArray(stateArray, _values);
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
        labelEl.appendChild(document.createTextNode(typeof getLabel === "function" ? getLabel(value, idx) : value));

        input.addEventListener("change", () => {
          // “全选但不区分”模式下：强制全选；想排除某些值就先取消该模式
          if (state.collapse[collapseKey]) {
            setArray(stateArray, _values);
            renderAll();
            return;
          }

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

          renderAll();
        });

        container.appendChild(labelEl);
      });
    }

    // -----------------------------
    // 数据过滤
    // -----------------------------
    function filteredRowsForMonth(monthKey, extra) {
      const RAW = getRAW();
      const rows = (RAW[monthKey] || []).slice();

      const cSet = new Set(state.countries.map(normalizeCountry));
      const mSet = new Set(state.medias.map(normalizeMedia));
      const pSet = new Set(state.productTypes.map(normalizeProductType));

      return rows.filter((r) => {
        if (!r) return false;
        const c = normalizeCountry(r.country);
        const m = normalizeMedia(r.media);
        const p = normalizeProductType(r.productType);

        if (cSet.size && !cSet.has(c)) return false;
        if (mSet.size && !mSet.has(m)) return false;
        if (pSet.size && !pSet.has(p)) return false;

        if (extra && typeof extra === "function") return !!extra(r);
        return true;
      });
    }

    function computePerCapitaForRows(rows, win) {
      const f = fieldsFor(win, state.kind);
      let num = 0;
      let den = 0;
      rows.forEach((r) => {
        const a = Number(r[f.flowField]);
        const b = Number(r[f.userField]);
        if (isFinite(a)) num += a;
        if (isFinite(b)) den += b;
      });
      return safeDiv(num, den);
    }

    function computeMonthlyCell(monthKey, win, countryGroup, mediaGroup, typeGroup) {
      const rows = filteredRowsForMonth(monthKey, (r) => {
        if (countryGroup !== "ALL" && normalizeCountry(r.country) !== countryGroup) return false;
        if (mediaGroup !== "ALL" && normalizeMedia(r.media) !== mediaGroup) return false;
        if (typeGroup !== "ALL" && normalizeProductType(r.productType) !== typeGroup) return false;
        return true;
      });
      return computePerCapitaForRows(rows, win);
    }

    // -----------------------------
    // 图表渲染
    // -----------------------------
    function renderBar() {
      const monthsSel = uniq(state.months).sort();
      const winsSel = uniq(state.windows).sort((a, b) => (a === "D0" ? -1 : 1));

      let countriesAxis = sortCountries(uniq(state.countries.map(normalizeCountry)));
      if (state.collapse.countries) countriesAxis = ["ALL"];

      const series = [];

      monthsSel.forEach((monthKey, mi) => {
        const mLabel = formatMonthLabel(monthKey);
        const color = colors[mi % colors.length];

        winsSel.forEach((win) => {
          const name = `${mLabel} ${win}`;
          const decal = win === "D7" ? D7_DECAL : null;

          const data = countriesAxis.map((c) => {
            const rows = filteredRowsForMonth(monthKey, (r) => {
              if (c === "ALL") return true;
              return normalizeCountry(r.country) === c;
            });
            return computePerCapitaForRows(rows, win);
          });

          series.push({
            name,
            type: "bar",
            barMaxWidth: 18,
            itemStyle: { color, decal },
            emphasis: { focus: "series" },
            data,
          });
        });
      });

      const option = {
        grid: { left: 54, right: 22, top: 28, bottom: 48 },
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(15, 23, 42, 0.92)",
          borderWidth: 0,
          textStyle: { fontSize: 11 },
          axisPointer: { type: "shadow" },
          formatter: (params) => {
            const lines = [];
            if (params && params.length) {
              lines.push(params[0].axisValue);
              params.forEach((p) => {
                const v = p && p.value != null ? formatUSD(p.value, 2) : "-";
                lines.push(`${p.marker}${p.seriesName}：${v}`);
              });
            }
            return lines.join("<br/>");
          },
        },
        legend: {
          type: "scroll",
          right: 16,
          top: 8,
          textStyle: { fontSize: 11, color: "#475569" },
        },
        xAxis: {
          type: "category",
          data: countriesAxis,
          axisTick: { show: false },
          axisLine: { lineStyle: { color: "rgba(148,163,184,0.6)" } },
          axisLabel: { color: "#334155", fontSize: 11 },
        },
        yAxis: {
          type: "value",
          splitLine: { lineStyle: { color: "rgba(148,163,184,0.22)" } },
          axisLabel: {
            color: "#64748b",
            fontSize: 11,
            formatter: (v) => formatUSD(v, 2),
          },
        },
        series,
      };

      chart.setOption(option, true);
    }

    function buildSeriesName(c, m, p, win) {
      const parts = [];
      parts.push(c);
      if (!state.collapse.medias) parts.push(m);
      if (!state.collapse.productTypes) parts.push(formatProductTypeLabel(p));
      parts.push(win);
      return parts.join(" ");
    }

    function renderLine() {
      const monthsSel = uniq(state.months).sort();
      const winsSel = uniq(state.windows).sort((a, b) => (a === "D0" ? -1 : 1));

      // 先把所有满足筛选的行拉出来（跨月）
      const dateSet = new Set();
      const agg = new Map(); // key -> Map(date -> {num, den})

      monthsSel.forEach((monthKey) => {
        const rows = filteredRowsForMonth(monthKey);
        rows.forEach((r) => {
          const date = r.date;
          if (!date) return;

          dateSet.add(date);

          const c = state.collapse.countries ? "ALL" : normalizeCountry(r.country);
          const m = state.collapse.medias ? "ALL" : normalizeMedia(r.media);
          const p = state.collapse.productTypes ? "ALL" : normalizeProductType(r.productType);

          winsSel.forEach((win) => {
            const f = fieldsFor(win, state.kind);
            const num = Number(r[f.flowField]);
            const den = Number(r[f.userField]);

            const key = [c, m, p, win].join("||");
            let dateMap = agg.get(key);
            if (!dateMap) {
              dateMap = new Map();
              agg.set(key, dateMap);
            }

            let cell = dateMap.get(date);
            if (!cell) {
              cell = { num: 0, den: 0 };
              dateMap.set(date, cell);
            }

            if (isFinite(num)) cell.num += num;
            if (isFinite(den)) cell.den += den;
          });
        });
      });

      const dates = Array.from(dateSet).sort();

      const series = [];
      agg.forEach((dateMap, key) => {
        const parts = key.split("||");
        const c = parts[0];
        const m = parts[1];
        const p = parts[2];
        const win = parts[3];

        const data = dates.map((d) => {
          const cell = dateMap.get(d);
          return cell ? safeDiv(cell.num, cell.den) : null;
        });

        series.push({
          c,
          m,
          p,
          win,
          name: buildSeriesName(c, m, p, win),
          data,
        });
      });

      // 排序：国家固定顺序 -> media -> type -> win
      series.sort((a, b) => {
        const ia = FIXED_COUNTRY_ORDER.indexOf(a.c);
        const ib = FIXED_COUNTRY_ORDER.indexOf(b.c);
        const ha = ia !== -1;
        const hb = ib !== -1;
        if (ha && hb && ia !== ib) return ia - ib;
        if (ha !== hb) return ha ? -1 : 1;
        if (a.c !== b.c) return String(a.c).localeCompare(String(b.c));

        if (a.m !== b.m) return String(a.m).localeCompare(String(b.m));
        if (a.p !== b.p) return String(a.p).localeCompare(String(b.p));

        if (a.win !== b.win) return a.win === "D0" ? -1 : 1;
        return 0;
      });

      const option = {
        grid: { left: 54, right: 22, top: 28, bottom: 58 },
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(15, 23, 42, 0.92)",
          borderWidth: 0,
          textStyle: { fontSize: 11 },
          axisPointer: { type: "line" },
          formatter: (params) => {
            const lines = [];
            if (params && params.length) {
              lines.push(params[0].axisValue);
              params.forEach((p) => {
                const v = p && p.value != null ? formatUSD(p.value, 2) : "-";
                lines.push(`${p.marker}${p.seriesName}：${v}`);
              });
            }
            return lines.join("<br/>");
          },
        },
        legend: {
          type: "scroll",
          right: 16,
          top: 8,
          textStyle: { fontSize: 11, color: "#475569" },
        },
        xAxis: {
          type: "category",
          data: dates,
          axisTick: { show: false },
          axisLine: { lineStyle: { color: "rgba(148,163,184,0.6)" } },
          axisLabel: {
            color: "#334155",
            fontSize: 10,
            formatter: (v) => {
              // 2025-09-01 -> 09-01（跨月更清楚）
              if (typeof v === "string" && v.length >= 10) return v.slice(5);
              return v;
            },
          },
        },
        yAxis: {
          type: "value",
          splitLine: { lineStyle: { color: "rgba(148,163,184,0.22)" } },
          axisLabel: {
            color: "#64748b",
            fontSize: 11,
            formatter: (v) => formatUSD(v, 2),
          },
        },
        series: series.map((s) => ({
          name: s.name,
          type: "line",
          data: s.data,
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 2, type: s.win === "D7" ? "dashed" : "solid" },
          emphasis: { focus: "series" },
        })),
      };

      chart.setOption(option, true);
    }

    // -----------------------------
    // 表格渲染
    // -----------------------------
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

    function renderTable() {
      if (!tableEl) return;

      const monthsSel = uniq(state.months).sort();
      const winsSel = uniq(state.windows).sort((a, b) => (a === "D0" ? -1 : 1));

      const metricName = `人均${kindLabel(state.kind)}流水`;
      const suffix = buildTitleSuffix(state, opts);

      if (tableTitleEl) tableTitleEl.textContent = `当前筛选 · ${metricName}${suffix}`;
      if (tableSubEl) tableSubEl.textContent = `单位：USD；月份最多 3；D7 用斜线阴影区分（柱状图）`;

      const thead = document.createElement("thead");
      const trh = document.createElement("tr");

      trh.appendChild(th("国家"));

      const breakdown = state.view === "line";
      if (breakdown) {
        trh.appendChild(th("媒体"));
        trh.appendChild(th("形态"));
      }

      monthsSel.forEach((m) => {
        winsSel.forEach((w) => {
          trh.appendChild(th(`${formatMonthLabel(m)} ${w}`));
        });
      });

      thead.appendChild(trh);

      const tbody = document.createElement("tbody");

      let rowCountries = sortCountries(uniq(state.countries.map(normalizeCountry)));
      if (state.collapse.countries) rowCountries = ["ALL"];

      let rowMedias = ["ALL"];
      let rowTypes = ["ALL"];
      if (breakdown) {
        if (!state.collapse.medias) rowMedias = uniq(state.medias.map(normalizeMedia));
        if (!state.collapse.productTypes) rowTypes = uniq(state.productTypes.map(normalizeProductType));
      }

      rowCountries.forEach((c) => {
        rowMedias.forEach((m) => {
          rowTypes.forEach((p) => {
            const tr = document.createElement("tr");

            tr.appendChild(td(c));

            if (breakdown) {
              tr.appendChild(td(m === "ALL" ? "—" : m));
              tr.appendChild(td(p === "ALL" ? "—" : formatProductTypeLabel(p)));
            }

            monthsSel.forEach((monthKey) => {
              winsSel.forEach((win) => {
                const v = computeMonthlyCell(monthKey, win, c, m, p);
                tr.appendChild(td(v == null ? "-" : formatUSD(v, 2)));
              });
            });

            tbody.appendChild(tr);
          });
        });
      });

      tableEl.innerHTML = "";
      tableEl.appendChild(thead);
      tableEl.appendChild(tbody);
    }

    // -----------------------------
    // 总渲染
    // -----------------------------
    function sanitizeSelections() {
      // 数据更新后，剔除无效选项；再确保不为空
      state.months = state.months.filter((m) => (opts.months || []).indexOf(m) !== -1);
      state.countries = state.countries.filter((c) => (opts.countries || []).indexOf(c) !== -1);
      state.medias = state.medias.filter((m) => (opts.medias || []).indexOf(m) !== -1);
      state.productTypes = state.productTypes.filter((p) => (opts.productTypes || []).indexOf(p) !== -1);

      ensureNonEmpty(state, opts);

      // months 约束：最多 3
      if (state.months.length > 3) state.months = state.months.slice(0, 3);
    }

    function renderFilters() {
      renderRadio(
        viewWrap,
        "betflowView",
        [
          { value: "bar", label: "月度柱状图" },
          { value: "line", label: "日级折线图" },
        ],
        state.view,
        (v) => {
          state.view = v;
          renderAll();
        }
      );

      renderChips(monthsWrap, opts.months || [], state.months, {
        max: 3,
        allowEmpty: false,
        getLabel: (v) => formatMonthLabel(v),
      });

      renderChipsWithCollapse(countriesWrap, opts.countries || [], state.countries, "countries", {
        allowEmpty: false,
        getLabel: (v) => v,
      });

      renderChipsWithCollapse(mediasWrap, opts.medias || [], state.medias, "medias", {
        allowEmpty: false,
        getLabel: (v) => v,
      });

      renderChipsWithCollapse(typesWrap, opts.productTypes || [], state.productTypes, "productTypes", {
        allowEmpty: false,
        getLabel: (v) => formatProductTypeLabel(v),
      });

      renderRadio(
        kindWrap,
        "betflowKind",
        [
          { value: "total", label: "总流水" },
          { value: "sports", label: "体育流水" },
          { value: "games", label: "游戏流水" },
        ],
        state.kind,
        (v) => {
          state.kind = v;
          renderAll();
        }
      );

      renderChips(windowsWrap, ["D0", "D7"], state.windows, {
        max: 2,
        allowEmpty: false,
        getLabel: (v) => v,
      });
    }

    function renderAll() {
      sanitizeSelections();
      renderFilters();

      // 动态更新卡片标题（如果存在）
      const titleEl = card.querySelector(".chart-title");
      if (titleEl) {
        const metricName = `人均${kindLabel(state.kind)}流水`;
        titleEl.textContent = `${metricName} · ${state.view === "bar" ? "月度柱状图" : "日级折线图"}`;
      }

      if (!opts.months || !opts.months.length) {
        chart.clear();
        chart.setOption(
          {
            graphic: [
              {
                type: "text",
                left: "center",
                top: "middle",
                style: {
                  text: "暂无数据：请先在 paid-data.js 填写 RAW_PAID_BY_MONTH",
                  fill: "#475569",
                  fontSize: 12,
                },
              },
            ],
          },
          true
        );
        if (tableEl) tableEl.innerHTML = "";
        return;
      }

      if (state.view === "line") renderLine();
      else renderBar();

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
