/* paid-monthly/paid-dashboard.js
 * Module-01: Paid Registrations & CPR
 * CPR = Σspent / Σregistration (USD/人)
 */

(() => {
  "use strict";

  // ===========================
  // 0) 数据与维度
  // ===========================
  const RAW = window.RAW_PAID_BY_MONTH || {};
  const ALL_MONTHS = Object.keys(RAW).sort(); // YYYY-MM 升序（老→新）
  const ALL_COUNTRIES = (() => {
    const set = new Set();
    ALL_MONTHS.forEach((m) => (RAW[m] || []).forEach((r) => r && r.country && set.add(r.country)));
    return Array.from(set).sort();
  })();

  // ===========================
  // 1) 配色（跟自然量看板同路数：月用月色，日线用国家色）
  // ===========================
  const DEFAULT_COLOR_PALETTE = ["#2563eb", "#16a34a", "#f97316", "#7c3aed", "#ef4444", "#0f766e"];

  // 月份颜色：你想固定哪几个月就往里加，不加就走默认色盘
  const MONTH_COLOR_MAP = {}; // e.g. { "2025-10":"#2563eb", "2025-11":"#16a34a" }
  function getColorForMonth(month, idx) {
    if (MONTH_COLOR_MAP[month]) return MONTH_COLOR_MAP[month];
    return DEFAULT_COLOR_PALETTE[idx % DEFAULT_COLOR_PALETTE.length];
  }

  // 国家固定色（保证跨月/跨图一致）
  const COUNTRY_COLOR_MAP = { GH: "#2563eb", KE: "#16a34a", NG: "#f97316", TZ: "#db2777", UG: "#7c3aed" };
  function getColorForCountry(country, idx) {
    return COUNTRY_COLOR_MAP[country] || DEFAULT_COLOR_PALETTE[idx % DEFAULT_COLOR_PALETTE.length];
  }

  // ===========================
  // 2) 格式化
  // ===========================
  function formatInteger(v) {
    if (v == null || !isFinite(v)) return "-";
    return Math.round(v).toLocaleString();
  }
  function formatUSD(v) {
    if (v == null || !isFinite(v)) return "-";
    return "$" + Number(v).toFixed(2);
  }
  function formatAxisK(v) {
    if (v == null || !isFinite(v)) return "";
    const av = Math.abs(v);
    if (av >= 1000000) return (v / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    if (av >= 1000) return (v / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    return String(Math.round(v));
  }
  function formatMonthShort(month) {
    if (!month) return "";
    const parts = String(month).split("-");
    if (parts.length === 2) {
      const mm = parseInt(parts[1], 10);
      if (!Number.isNaN(mm)) return mm + "月";
    }
    return String(month);
  }

  // ===========================
  // 3) UI：chips（带 max/min 约束）
  // ===========================
  function createMultiSelectChips_v2(options) {
    const { containerId, values, getLabel, stateArray, max, min = 0, preselectLastN, preselect, onChange } = options;
    const container = document.getElementById(containerId);
    if (!container || !Array.isArray(values) || !Array.isArray(stateArray)) return;

    container.innerHTML = "";

    // 默认选中：优先 preselectLastN（更符合“默认选最近”）
    if (stateArray.length === 0) {
      if (preselect === "all") {
        values.forEach((v) => stateArray.push(v));
      } else if (typeof preselectLastN === "number") {
        const n = Math.max(0, Math.min(preselectLastN, values.length));
        values.slice(values.length - n).forEach((v) => stateArray.push(v));
      } else if (typeof preselect === "number") {
        const n = Math.max(0, Math.min(preselect, values.length));
        values.slice(0, n).forEach((v) => stateArray.push(v));
      }
    }

    values.forEach((value, idx) => {
      const labelEl = document.createElement("label");
      labelEl.className = "filter-chip";

      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = value;

      const selected = stateArray.indexOf(value) !== -1;
      if (selected) {
        input.checked = true;
        labelEl.classList.add("filter-chip-active");
      }

      labelEl.appendChild(input);
      labelEl.appendChild(document.createTextNode(typeof getLabel === "function" ? getLabel(value, idx) : String(value)));

      input.addEventListener("change", () => {
        const existsIndex = stateArray.indexOf(value);

        if (input.checked) {
          if (max && stateArray.length >= max && existsIndex === -1) {
            input.checked = false; // 超上限回滚
            return;
          }
          if (existsIndex === -1) stateArray.push(value);
        } else {
          if (min && stateArray.length <= min && existsIndex !== -1) {
            input.checked = true; // 低于下限回滚
            return;
          }
          if (existsIndex !== -1) stateArray.splice(existsIndex, 1);
        }

        labelEl.classList.toggle("filter-chip-active", input.checked);
        if (typeof onChange === "function") onChange();
      });

      container.appendChild(labelEl);
    });

    if (typeof onChange === "function") onChange();
  }

  function bindRadioGroup(name, stateObj, key, onChange) {
    const radios = document.querySelectorAll(`input[name="${name}"]`);
    radios.forEach((r) => {
      if (r.checked) stateObj[key] = r.value;
      r.addEventListener("change", () => {
        if (!r.checked) return;
        stateObj[key] = r.value;
        if (typeof onChange === "function") onChange();
      });
    });
  }

  function renderEmptyTable(tableEl, msg) {
    if (!tableEl) return;
    tableEl.innerHTML = `<tbody><tr><td>${msg || "无数据：请先选择国家和月份"}</td></tr></tbody>`;
  }

  // ===========================
  // 4) 聚合：月 × 国家（模块 1 用）
  // ===========================
  function safeNum(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  function calcCPR(spent, reg) {
    const r = Number(reg);
    const s = Number(spent);
    if (!Number.isFinite(r) || r <= 0) return null;
    if (!Number.isFinite(s) || s < 0) return null;
    return s / r;
  }

  const AGG_MONTH = (() => {
    const out = {};
    ALL_MONTHS.forEach((month) => {
      const m = {};
      (RAW[month] || []).forEach((row) => {
        if (!row || !row.country) return;
        const c = row.country;
        if (!m[c]) m[c] = { month, country: c, spent: 0, registration: 0 };
        m[c].spent += safeNum(row.spent);
        m[c].registration += safeNum(row.registration);
      });
      out[month] = m;
    });
    return out;
  })();

  function getAgg(month, country) {
    return (AGG_MONTH[month] && AGG_MONTH[month][country]) || null;
  }

  // ===========================
  // 5) 表格：国家（行）× 月份展开（列）
  // ===========================
  function updatePaidRegTable(months, countries, metrics) {
    const table = document.getElementById("table-paidreg");
    if (!table) return;

    const ms = Array.isArray(months) ? months : [];
    const cs = Array.isArray(countries) ? countries : [];
    if (!ms.length || !cs.length) {
      renderEmptyTable(table, "无数据：请先选择国家和月份");
      return;
    }

    const showReg = metrics.includes("reg");
    const showCpr = metrics.includes("cpr");

    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");

    const th0 = document.createElement("th");
    th0.textContent = "国家";
    headRow.appendChild(th0);

    ms.forEach((m) => {
      const label = formatMonthShort(m);
      if (showReg) {
        const th = document.createElement("th");
        th.textContent = `${label} 注册数`;
        headRow.appendChild(th);
      }
      if (showCpr) {
        const th = document.createElement("th");
        th.textContent = `${label} 注册单价`;
        headRow.appendChild(th);
      }
    });

    thead.appendChild(headRow);

    const tbody = document.createElement("tbody");
    const sortedCountries = Array.from(cs).sort();

    sortedCountries.forEach((c) => {
      const tr = document.createElement("tr");
      const tdC = document.createElement("td");
      tdC.textContent = c;
      tr.appendChild(tdC);

      ms.forEach((m) => {
        const agg = getAgg(m, c);

        if (showReg) {
          const td = document.createElement("td");
          td.className = "num";
          const reg = agg ? agg.registration : null;
          td.textContent = agg ? formatInteger(reg) : "-";
          tr.appendChild(td);
        }
        if (showCpr) {
          const td = document.createElement("td");
          td.className = "num";
          const cpr = agg ? calcCPR(agg.spent, agg.registration) : null;
          td.textContent = agg ? formatUSD(cpr) : "-";
          tr.appendChild(td);
        }
      });

      tbody.appendChild(tr);
    });

    table.innerHTML = "";
    table.appendChild(thead);
    table.appendChild(tbody);
  }

  // ===========================
  // 6) 日级聚合：date × country（跨月拼接）
  // ===========================
  function buildDailyAgg(months, countriesSet) {
    const dateSet = new Set();
    const byCountry = {}; // country -> date -> {spent, registration}

    months.forEach((month) => {
      (RAW[month] || []).forEach((row) => {
        if (!row || !row.country || !row.date) return;
        const c = row.country;
        if (countriesSet && !countriesSet.has(c)) return;

        const d = row.date;
        dateSet.add(d);

        if (!byCountry[c]) byCountry[c] = {};
        if (!byCountry[c][d]) byCountry[c][d] = { spent: 0, registration: 0 };

        byCountry[c][d].spent += safeNum(row.spent);
        byCountry[c][d].registration += safeNum(row.registration);
      });
    });

    const dates = Array.from(dateSet).sort(); // YYYY-MM-DD 字符串排序可用
    const index = new Map(dates.map((d, i) => [d, i]));
    return { dates, index, byCountry };
  }

  // ===========================
  // 7) 图表渲染
  // ===========================
  function uniq(arr) {
    return Array.from(new Set(arr));
  }

  function updatePaidRegChart(chart, st) {
    if (!chart) return;

    // months：最多 3 个，且保持时间顺序（老→新）便于日折线连续
    let months = (st.months && st.months.length ? st.months.slice(0, 3) : ALL_MONTHS.slice(-2)).slice(0, 3);
    months = Array.from(new Set(months)).sort();

    // countries：默认全选
    const countries = st.countries && st.countries.length ? Array.from(new Set(st.countries)).sort() : ALL_COUNTRIES.slice();

    // metrics：至少 1 个
    const metrics = st.metrics && st.metrics.length ? uniq(st.metrics) : ["reg"];
    const showReg = metrics.includes("reg");
    const showCpr = metrics.includes("cpr");

    // 表格永远按“月度汇总”
    updatePaidRegTable(months, countries, metrics);

    // Y轴配置
    const yAxis = [];
    if (showReg && showCpr) {
      yAxis.push({
        type: "value",
        name: "注册数",
        axisLabel: { formatter: (v) => formatAxisK(v) },
        splitLine: { lineStyle: { color: "rgba(148,163,184,0.22)" } },
      });
      yAxis.push({
        type: "value",
        name: "注册单价（USD）",
        axisLabel: { formatter: (v) => (v == null || !isFinite(v) ? "" : "$" + Number(v).toFixed(2)) },
        splitLine: { show: false },
      });
    } else if (showReg) {
      yAxis.push({
        type: "value",
        name: "注册数",
        axisLabel: { formatter: (v) => formatAxisK(v) },
        splitLine: { lineStyle: { color: "rgba(148,163,184,0.22)" } },
      });
    } else {
      yAxis.push({
        type: "value",
        name: "注册单价（USD）",
        axisLabel: { formatter: (v) => (v == null || !isFinite(v) ? "" : "$" + Number(v).toFixed(2)) },
        splitLine: { lineStyle: { color: "rgba(148,163,184,0.22)" } },
      });
    }

    // ---------------------------
    // A) 日级折线：legend=国家
    // ---------------------------
    if (st.view === "line") {
      const countriesSet = new Set(countries);
      const { dates, index, byCountry } = buildDailyAgg(months, countriesSet);

      const series = [];
      const seriesMeta = []; // 用于 tooltip 分组：seriesIndex -> {metric,country}

      countries.forEach((c, idxC) => {
        const color = getColorForCountry(c, idxC);
        const map = byCountry[c] || {};

        if (showReg) {
          const data = new Array(dates.length).fill(null);
          Object.keys(map).forEach((d) => {
            const i = index.get(d);
            if (i == null) return;
            data[i] = map[d].registration;
          });

          series.push({
            name: c, // 两条线共用同名，legend 勾选能同时控制
            type: "line",
            yAxisIndex: 0,
            smooth: true,
            showSymbol: false,
            connectNulls: true,
            lineStyle: { width: 2, color },
            itemStyle: { color },
            data,
          });
          seriesMeta.push({ metric: "reg", country: c });
        }

        if (showCpr) {
          const data = new Array(dates.length).fill(null);
          Object.keys(map).forEach((d) => {
            const i = index.get(d);
            if (i == null) return;
            data[i] = calcCPR(map[d].spent, map[d].registration);
          });

          series.push({
            name: c, // 同名：legend 一键控制整条（符合“叉掉国家整条线消失”）
            type: "line",
            yAxisIndex: showReg ? 1 : 0,
            smooth: true,
            showSymbol: false,
            connectNulls: true,
            lineStyle: { width: 2, type: "dashed", color },
            itemStyle: { color },
            data,
          });
          seriesMeta.push({ metric: "cpr", country: c });
        }
      });

      const tooltipFormatter = (params) => {
        if (!params || !params.length) return "";
        const axisValue = params[0].axisValue;

        const byC = new Map();
        params.forEach((p) => {
          const meta = seriesMeta[p.seriesIndex] || {};
          const c = meta.country || p.seriesName || "-";
          if (!byC.has(c)) byC.set(c, { marker: p.marker, reg: null, cpr: null });
          const g = byC.get(c);
          if (meta.metric === "reg") g.reg = p.value;
          if (meta.metric === "cpr") g.cpr = p.value;
        });

        const lines = [];
        lines.push(`<div style="font-weight:700;margin-bottom:4px;">日期：${axisValue}</div>`);
        countries.forEach((c) => {
          const g = byC.get(c);
          if (!g) return;
          const parts = [];
          if (showReg) parts.push(`注册数 ${formatInteger(g.reg)}`);
          if (showCpr) parts.push(`注册单价 ${formatUSD(g.cpr)}`);
          lines.push(`${g.marker || ""} ${c} · ${parts.join(" / ")}`);
        });
        return lines.join("<br/>");
      };

      chart.setOption(
        {
          tooltip: {
            trigger: "axis",
            axisPointer: { type: "cross" },
            formatter: tooltipFormatter,
            backgroundColor: "rgba(255,255,255,0.96)",
            borderColor: "rgba(148,163,184,0.35)",
            borderWidth: 1,
            textStyle: { color: "#0f172a", fontSize: 12 },
          },
          legend: { type: "scroll" }, // 同名会合并成一个图例项
          grid: { left: 52, right: showReg && showCpr ? 58 : 22, top: 40, bottom: 42, containLabel: true },
          xAxis: {
            type: "category",
            data: dates,
            axisLabel: { formatter: (v) => String(v).slice(5) }, // MM-DD
          },
          yAxis,
          series,
        },
        true
      );

      return;
    }

    // ---------------------------
    // B) 月度柱状：X=国家，legend=月份
    // ---------------------------
    const xCountries = countries.slice(); // 已排序
    const monthLabels = months.map((m) => formatMonthShort(m));
    const legendData = monthLabels; // 强制 legend 只显示月份（避免双指标重复项）

    const series = [];
    const seriesMeta = []; // seriesIndex -> {metric, monthLabel}

    // 1) 注册数（bars）
    if (showReg) {
      months.forEach((m, idxM) => {
        const label = formatMonthShort(m);
        const color = getColorForMonth(m, idxM);
        const data = xCountries.map((c) => {
          const agg = getAgg(m, c);
          return agg ? agg.registration : null;
        });

        series.push({
          name: label,
          type: "bar",
          yAxisIndex: 0,
          barMaxWidth: 18,
          itemStyle: { color, borderRadius: [6, 6, 0, 0] },
          data,
        });
        seriesMeta.push({ metric: "reg", monthLabel: label });
      });
    }

    // 2) 注册单价（bars 或 line：双指标时用 line 更清楚）
    if (showCpr) {
      months.forEach((m, idxM) => {
        const label = formatMonthShort(m);
        const color = getColorForMonth(m, idxM);
        const data = xCountries.map((c) => {
          const agg = getAgg(m, c);
          return agg ? calcCPR(agg.spent, agg.registration) : null;
        });

        // 双指标：CPR 走右轴折线；单指标：CPR 走柱状
        series.push({
          name: label,
          type: showReg ? "line" : "bar",
          yAxisIndex: showReg ? 1 : 0,
          smooth: true,
          symbol: "circle",
          symbolSize: 6,
          lineStyle: showReg ? { width: 2, type: "dashed", color } : undefined,
          itemStyle: { color, borderRadius: showReg ? undefined : [6, 6, 0, 0] },
          data,
        });
        seriesMeta.push({ metric: "cpr", monthLabel: label });
      });
    }

    const tooltipFormatter = (params) => {
      if (!params || !params.length) return "";
      const axisValue = params[0].axisValue; // 国家

      const byM = new Map(); // monthLabel -> {reg,cpr,marker}
      params.forEach((p) => {
        const meta = seriesMeta[p.seriesIndex] || {};
        const ml = meta.monthLabel || p.seriesName || "-";
        if (!byM.has(ml)) byM.set(ml, { marker: p.marker, reg: null, cpr: null });
        const g = byM.get(ml);
        if (meta.metric === "reg") g.reg = p.value;
        if (meta.metric === "cpr") g.cpr = p.value;
      });

      const lines = [];
      lines.push(`<div style="font-weight:700;margin-bottom:4px;">国家：${axisValue}</div>`);
      monthLabels.forEach((ml) => {
        const g = byM.get(ml);
        if (!g) return;
        const parts = [];
        if (showReg) parts.push(`注册数 ${formatInteger(g.reg)}`);
        if (showCpr) parts.push(`注册单价 ${formatUSD(g.cpr)}`);
        lines.push(`${g.marker || ""} ${ml} · ${parts.join(" / ")}`);
      });
      return lines.join("<br/>");
    };

    chart.setOption(
      {
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
          formatter: tooltipFormatter,
          backgroundColor: "rgba(255,255,255,0.96)",
          borderColor: "rgba(148,163,184,0.35)",
          borderWidth: 1,
          textStyle: { color: "#0f172a", fontSize: 12 },
        },
        legend: { type: "scroll", data: legendData },
        grid: { left: 48, right: showReg && showCpr ? 60 : 22, top: 40, bottom: 42, containLabel: true },
        xAxis: { type: "category", data: xCountries },
        yAxis,
        series,
      },
      true
    );
  }

  // ===========================
  // 8) 初始化模块 1
  // ===========================
  function initModule01_PaidReg() {
    const dom = document.getElementById("chart-paidreg");
    if (!dom) return;
    if (!window.echarts) return;

    const chart = echarts.init(dom);

    const st = {
      view: "bar",
      months: [],
      countries: [],
      metrics: [], // "reg" | "cpr"
    };

    // 视图：bar / line
    bindRadioGroup("paidreg-view", st, "view", () => updatePaidRegChart(chart, st));

    // 月份：最多 3，至少 1，默认选最近 2（有几个月就选几个）
    createMultiSelectChips_v2({
      containerId: "paidreg-months",
      values: ALL_MONTHS,
      getLabel: (m) => m,
      stateArray: st.months,
      max: 3,
      min: 1,
      preselectLastN: Math.min(2, ALL_MONTHS.length),
      onChange: () => updatePaidRegChart(chart, st),
    });

    // 国家：多选，至少 1，默认全选
    createMultiSelectChips_v2({
      containerId: "paidreg-countries",
      values: ALL_COUNTRIES,
      getLabel: (c) => c,
      stateArray: st.countries,
      min: 1,
      preselect: "all",
      onChange: () => updatePaidRegChart(chart, st),
    });

    // 指标：至少 1，最多 2，默认“注册数”
    createMultiSelectChips_v2({
      containerId: "paidreg-metrics",
      values: ["reg", "cpr"],
      getLabel: (k) => (k === "reg" ? "注册数" : "注册单价"),
      stateArray: st.metrics,
      max: 2,
      min: 1,
      preselect: 1,
      onChange: () => updatePaidRegChart(chart, st),
    });

    // 首次渲染
    updatePaidRegChart(chart, st);

    // 自适应
    window.addEventListener("resize", () => chart.resize());
  }

  // ===========================
  // 9) Boot
  // ===========================
  document.addEventListener("DOMContentLoaded", () => {
    // 没数据也要把表渲染出来，避免白屏
    if (!ALL_MONTHS.length) {
      const table = document.getElementById("table-paidreg");
      renderEmptyTable(table, "无数据：paid-data.js 里还没写任何月份");
      return;
    }
    initModule01_PaidReg();
  });
})();
