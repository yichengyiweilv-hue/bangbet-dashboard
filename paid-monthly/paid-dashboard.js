/* paid-monthly/paid-dashboard.js
 * Module-01: Paid Registrations & CPR（注册单价=Spend/Registration，USD/人）
 * Module-02: D0/D7 Pay Rate（付费率=Purchasers/Registration，%）
 */

(() => {
  "use strict";

  // ===========================
  // 0) 读数据 + 维度字典
  // ===========================
  const RAW = window.RAW_PAID_BY_MONTH || {};
  const ALL_MONTHS = Object.keys(RAW).sort(); // YYYY-MM 升序（老→新）

  function normStr(v) {
    return String(v == null ? "" : v).trim();
  }
  function normLower(v, fallback = "unknown") {
    const s = normStr(v);
    return s ? s.toLowerCase() : fallback;
  }
  function normMedia(v) {
    return normLower(v, "unknown");
  }
  function normProduct(v) {
    return normLower(v, "unknown");
  }

  function collectDistinct(getter) {
    const set = new Set();
    ALL_MONTHS.forEach((m) => {
      (RAW[m] || []).forEach((r) => {
        if (!r) return;
        const v = getter(r);
        if (v != null && v !== "") set.add(v);
      });
    });
    return Array.from(set);
  }

  const ALL_COUNTRIES = collectDistinct((r) => normStr(r.country)).filter(Boolean).sort();

  function sortWithPreferred(list, preferred) {
    const pref = new Map(preferred.map((v, i) => [v, i]));
    return list.slice().sort((a, b) => {
      const aa = a === "unknown" ? "zzzz_unknown" : a;
      const bb = b === "unknown" ? "zzzz_unknown" : b;
      const ia = pref.has(aa) ? pref.get(aa) : 999;
      const ib = pref.has(bb) ? pref.get(bb) : 999;
      if (ia !== ib) return ia - ib;
      return aa.localeCompare(bb);
    });
  }

  const ALL_MEDIA = sortWithPreferred(
    collectDistinct((r) => normMedia(r.media)),
    ["fb", "gg"]
  );

  const ALL_PRODUCTS = sortWithPreferred(
    collectDistinct((r) => normProduct(r.productType)),
    ["app", "h5"]
  );

  // ===========================
  // 1) 配色（保持视觉稳）
  // ===========================
  const DEFAULT_COLOR_PALETTE = ["#2563eb", "#16a34a", "#f97316", "#7c3aed", "#ef4444", "#0f766e"];

  // 月份色（可手工固定某几个月；不填就走色盘）
  const MONTH_COLOR_MAP = {}; // e.g. { "2025-10":"#2563eb" }
  function getColorForMonth(month, idx) {
    return MONTH_COLOR_MAP[month] || DEFAULT_COLOR_PALETTE[idx % DEFAULT_COLOR_PALETTE.length];
  }

  // 国家色（跨月/跨视图一致）
  const COUNTRY_COLOR_MAP = { GH: "#2563eb", KE: "#16a34a", NG: "#f97316", TZ: "#db2777", UG: "#7c3aed" };
  function getColorForCountry(country, idx) {
    return COUNTRY_COLOR_MAP[country] || DEFAULT_COLOR_PALETTE[idx % DEFAULT_COLOR_PALETTE.length];
  }

  // ===========================
  // 2) 格式化
  // ===========================
  function isFiniteNumber(v) {
    return Number.isFinite(Number(v));
  }
  function safeNum(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  function fmtInt(v) {
    if (!isFiniteNumber(v)) return "-";
    return Math.round(Number(v)).toLocaleString("en-US");
  }
  function fmtUSD(v) {
    if (!isFiniteNumber(v)) return "-";
    return "$" + Number(v).toFixed(2);
  }
  function fmtPct(v) {
    if (!isFiniteNumber(v)) return "-";
    return Number(v).toFixed(2) + "%";
  }
  function fmtAxisK(v) {
    if (!isFiniteNumber(v)) return "";
    const n = Number(v);
    const a = Math.abs(n);
    if (a >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
    if (a >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "k";
    return String(Math.round(n));
  }
  function fmtMonthShort(month) {
    const s = String(month || "");
    const parts = s.split("-");
    if (parts.length === 2) {
      const mm = parseInt(parts[1], 10);
      if (!Number.isNaN(mm)) return mm + "月";
    }
    return s;
  }

  // ===========================
  // 3) UI：多选 chips + radio
  // ===========================
  function createMultiSelectChips(options) {
    const {
      containerId,
      values,
      getLabel,
      stateArray,
      max,
      min = 0,
      preselect,
      preselectLastN,
      onChange,
    } = options;

    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";
    const vals = Array.isArray(values) ? values : [];
    const st = Array.isArray(stateArray) ? stateArray : [];

    // 初始化默认选中
    if (st.length === 0) {
      if (preselect === "all") {
        vals.forEach((v) => st.push(v));
      } else if (typeof preselectLastN === "number") {
        const n = Math.max(0, Math.min(preselectLastN, vals.length));
        vals.slice(vals.length - n).forEach((v) => st.push(v));
      } else if (typeof preselect === "number") {
        const n = Math.max(0, Math.min(preselect, vals.length));
        vals.slice(0, n).forEach((v) => st.push(v));
      }
    }

    vals.forEach((value, idx) => {
      const labelEl = document.createElement("label");
      labelEl.className = "filter-chip";

      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = value;

      const selected = st.indexOf(value) !== -1;
      input.checked = selected;
      if (selected) labelEl.classList.add("filter-chip-active");

      labelEl.appendChild(input);
      labelEl.appendChild(document.createTextNode(typeof getLabel === "function" ? getLabel(value, idx) : String(value)));

      input.addEventListener("change", () => {
        const existsIndex = st.indexOf(value);

        if (input.checked) {
          if (max && st.length >= max && existsIndex === -1) {
            input.checked = false; // 超上限回滚
            return;
          }
          if (existsIndex === -1) st.push(value);
        } else {
          if (min && st.length <= min && existsIndex !== -1) {
            input.checked = true; // 低于下限回滚
            return;
          }
          if (existsIndex !== -1) st.splice(existsIndex, 1);
        }

        labelEl.classList.toggle("filter-chip-active", input.checked);
        if (typeof onChange === "function") onChange();
      });

      container.appendChild(labelEl);
    });

    if (typeof onChange === "function") onChange();
  }

  function bindRadio(name, stateObj, key, onChange) {
    document.querySelectorAll(`input[name="${name}"]`).forEach((r) => {
      if (r.checked) stateObj[key] = r.value;
      r.addEventListener("change", () => {
        if (!r.checked) return;
        stateObj[key] = r.value;
        if (typeof onChange === "function") onChange();
      });
    });
  }

  function selectedOrAll(selected, allValues) {
    return Array.isArray(selected) && selected.length ? selected : (Array.isArray(allValues) ? allValues : []);
  }

  // ===========================
  // 4) 聚合（按筛选条件）
  // ===========================
  function buildAggMonthCountry(months, filter) {
    const out = {};
    months.forEach((month) => {
      const map = {};
      (RAW[month] || []).forEach((row) => {
        if (!row) return;
        const country = normStr(row.country);
        if (!country) return;

        if (filter.countriesSet && !filter.countriesSet.has(country)) return;

        const media = normMedia(row.media);
        if (filter.mediaSet && !filter.mediaSet.has(media)) return;

        const prod = normProduct(row.productType);
        if (filter.productSet && !filter.productSet.has(prod)) return;

        if (!map[country]) {
          map[country] = {
            spent: 0,
            registration: 0,
            d0_payers: 0,
            d7_payers: 0,
          };
        }
        map[country].spent += safeNum(row.spent);
        map[country].registration += safeNum(row.registration);
        map[country].d0_payers += safeNum(row.D0_unique_purchase);
        map[country].d7_payers += safeNum(row.D7_unique_purchase);
      });
      out[month] = map;
    });
    return out;
  }

  function buildAggDailyCountry(months, filter) {
    const dateSet = new Set();
    const byCountry = {}; // country -> date -> agg

    months.forEach((month) => {
      (RAW[month] || []).forEach((row) => {
        if (!row) return;
        const country = normStr(row.country);
        const date = normStr(row.date);
        if (!country || !date) return;

        if (filter.countriesSet && !filter.countriesSet.has(country)) return;

        const media = normMedia(row.media);
        if (filter.mediaSet && !filter.mediaSet.has(media)) return;

        const prod = normProduct(row.productType);
        if (filter.productSet && !filter.productSet.has(prod)) return;

        dateSet.add(date);
        if (!byCountry[country]) byCountry[country] = {};
        if (!byCountry[country][date]) {
          byCountry[country][date] = { spent: 0, registration: 0, d0_payers: 0, d7_payers: 0 };
        }
        byCountry[country][date].spent += safeNum(row.spent);
        byCountry[country][date].registration += safeNum(row.registration);
        byCountry[country][date].d0_payers += safeNum(row.D0_unique_purchase);
        byCountry[country][date].d7_payers += safeNum(row.D7_unique_purchase);
      });
    });

    const dates = Array.from(dateSet).sort(); // YYYY-MM-DD 字符串可排序
    const index = new Map(dates.map((d, i) => [d, i]));
    return { dates, index, byCountry };
  }

  // ===========================
  // 5) 工具：计算指标
  // ===========================
  function calcCPR(spent, reg) {
    const r = Number(reg);
    const s = Number(spent);
    if (!Number.isFinite(r) || r <= 0) return null;
    if (!Number.isFinite(s) || s < 0) return null;
    return s / r;
  }
  function calcRatePct(payers, reg) {
    const r = Number(reg);
    const p = Number(payers);
    if (!Number.isFinite(r) || r <= 0) return null;
    if (!Number.isFinite(p) || p < 0) return null;
    return (p / r) * 100;
  }

  // ===========================
  // 6) MODULE-01：注册数 & 注册单价（含媒体/产品过滤）
  // ===========================
  function updateTablePaidReg(months, countries, metrics, aggMonth) {
    const table = document.getElementById("table-paidreg");
    if (!table) return;

    const showReg = metrics.includes("reg");
    const showCpr = metrics.includes("cpr");

    table.innerHTML = "";

    const thead = document.createElement("thead");
    const trh = document.createElement("tr");

    const th0 = document.createElement("th");
    th0.textContent = "国家";
    trh.appendChild(th0);

    months.forEach((m) => {
      const ml = fmtMonthShort(m);
      if (showReg) {
        const th = document.createElement("th");
        th.textContent = `${ml} 注册数`;
        trh.appendChild(th);
      }
      if (showCpr) {
        const th = document.createElement("th");
        th.textContent = `${ml} 注册单价`;
        trh.appendChild(th);
      }
    });

    thead.appendChild(trh);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    countries.forEach((c) => {
      const tr = document.createElement("tr");
      const tdC = document.createElement("td");
      tdC.textContent = c;
      tr.appendChild(tdC);

      months.forEach((m) => {
        const agg = (aggMonth[m] && aggMonth[m][c]) || null;

        if (showReg) {
          const td = document.createElement("td");
          td.className = "num";
          td.textContent = agg ? fmtInt(agg.registration) : "-";
          tr.appendChild(td);
        }

        if (showCpr) {
          const td = document.createElement("td");
          td.className = "num";
          const v = agg ? calcCPR(agg.spent, agg.registration) : null;
          td.textContent = agg ? fmtUSD(v) : "-";
          tr.appendChild(td);
        }
      });

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
  }

  function updateChartPaidReg(chart, st) {
    if (!chart) return;

    let months = selectedOrAll(st.months, ALL_MONTHS).slice(0, 3);
    months = Array.from(new Set(months)).sort(); // 保证跨月顺序
    const countries = selectedOrAll(st.countries, ALL_COUNTRIES).slice().sort();

    const medias = selectedOrAll(st.medias, ALL_MEDIA);
    const products = selectedOrAll(st.products, ALL_PRODUCTS);

    const metrics = selectedOrAll(st.metrics, ["reg"]);
    const showReg = metrics.includes("reg");
    const showCpr = metrics.includes("cpr");

    const filter = {
      countriesSet: new Set(countries),
      mediaSet: new Set(medias),
      productSet: new Set(products),
    };

    const aggMonth = buildAggMonthCountry(months, filter);
    updateTablePaidReg(months, countries, metrics, aggMonth);

    // 双轴：注册数（左）+ 注册单价（右）
    const yAxis = [];
    if (showReg && showCpr) {
      yAxis.push({
        type: "value",
        name: "注册数",
        axisLabel: { formatter: (v) => fmtAxisK(v) },
        splitLine: { lineStyle: { color: "rgba(148,163,184,0.22)" } },
      });
      yAxis.push({
        type: "value",
        name: "注册单价（USD）",
        axisLabel: { formatter: (v) => (v == null || !isFiniteNumber(v) ? "" : "$" + Number(v).toFixed(2)) },
        splitLine: { show: false },
      });
    } else if (showReg) {
      yAxis.push({
        type: "value",
        name: "注册数",
        axisLabel: { formatter: (v) => fmtAxisK(v) },
        splitLine: { lineStyle: { color: "rgba(148,163,184,0.22)" } },
      });
    } else {
      yAxis.push({
        type: "value",
        name: "注册单价（USD）",
        axisLabel: { formatter: (v) => (v == null || !isFiniteNumber(v) ? "" : "$" + Number(v).toFixed(2)) },
        splitLine: { lineStyle: { color: "rgba(148,163,184,0.22)" } },
      });
    }

    // 日级折线：legend=国家（同名合并，取消国家=整条消失）
    if (st.view === "line") {
      const { dates, index, byCountry } = buildAggDailyCountry(months, filter);

      const series = [];
      const meta = []; // seriesIndex -> {metric,country}

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
            name: c,
            type: "line",
            yAxisIndex: 0,
            smooth: true,
            showSymbol: false,
            connectNulls: true,
            lineStyle: { width: 2, color },
            itemStyle: { color },
            data,
          });
          meta.push({ metric: "reg", country: c });
        }

        if (showCpr) {
          const data = new Array(dates.length).fill(null);
          Object.keys(map).forEach((d) => {
            const i = index.get(d);
            if (i == null) return;
            data[i] = calcCPR(map[d].spent, map[d].registration);
          });
          series.push({
            name: c,
            type: "line",
            yAxisIndex: showReg ? 1 : 0,
            smooth: true,
            showSymbol: false,
            connectNulls: true,
            lineStyle: { width: 2, type: "dashed", color },
            itemStyle: { color },
            data,
          });
          meta.push({ metric: "cpr", country: c });
        }
      });

      chart.setOption(
        {
          legend: { type: "scroll", data: countries },
          grid: { left: 52, right: showReg && showCpr ? 60 : 22, top: 40, bottom: 42, containLabel: true },
          tooltip: {
            trigger: "axis",
            axisPointer: { type: "cross" },
            backgroundColor: "rgba(255,255,255,0.96)",
            borderColor: "rgba(148,163,184,0.35)",
            borderWidth: 1,
            textStyle: { color: "#0f172a", fontSize: 12 },
            formatter: (params) => {
              if (!params || !params.length) return "";
              const axisValue = params[0].axisValue;

              const byC = new Map();
              params.forEach((p) => {
                const m = meta[p.seriesIndex] || {};
                const c = m.country || p.seriesName || "-";
                if (!byC.has(c)) byC.set(c, { marker: p.marker, reg: null, cpr: null });
                const g = byC.get(c);
                if (m.metric === "reg") g.reg = p.value;
                if (m.metric === "cpr") g.cpr = p.value;
              });

              const lines = [];
              lines.push(`<div style="font-weight:700;margin-bottom:4px;">日期：${axisValue}</div>`);
              countries.forEach((c) => {
                const g = byC.get(c);
                if (!g) return;
                const parts = [];
                if (showReg) parts.push(`注册数 ${fmtInt(g.reg)}`);
                if (showCpr) parts.push(`注册单价 ${fmtUSD(g.cpr)}`);
                lines.push(`${g.marker || ""} ${c} · ${parts.join(" / ")}`);
              });
              return lines.join("<br/>");
            },
          },
          xAxis: { type: "category", data: dates, axisLabel: { formatter: (v) => String(v).slice(5) } },
          yAxis,
          series,
        },
        true
      );
      return;
    }

    // 月度柱状：X=国家，legend=月份（同名合并：同一个月的柱+线一起隐藏）
    const monthLabels = months.map((m) => fmtMonthShort(m));
    const xCountries = countries;

    const series = [];
    const meta = []; // seriesIndex -> {metric, monthLabel}

    // 注册数
    if (showReg) {
      months.forEach((m, idxM) => {
        const ml = fmtMonthShort(m);
        const color = getColorForMonth(m, idxM);
        const data = xCountries.map((c) => ((aggMonth[m] && aggMonth[m][c]) ? aggMonth[m][c].registration : null));
        series.push({
          name: ml,
          type: "bar",
          yAxisIndex: 0,
          barMaxWidth: 18,
          itemStyle: { color, borderRadius: [6, 6, 0, 0] },
          data,
        });
        meta.push({ metric: "reg", monthLabel: ml });
      });
    }

    // 注册单价
    if (showCpr) {
      months.forEach((m, idxM) => {
        const ml = fmtMonthShort(m);
        const color = getColorForMonth(m, idxM);
        const data = xCountries.map((c) => {
          const a = (aggMonth[m] && aggMonth[m][c]) || null;
          return a ? calcCPR(a.spent, a.registration) : null;
        });

        // 同显：单价用虚线（右轴）；只看单价：用柱状
        series.push({
          name: ml,
          type: showReg ? "line" : "bar",
          yAxisIndex: showReg ? 1 : 0,
          smooth: true,
          symbol: "circle",
          symbolSize: 6,
          lineStyle: showReg ? { width: 2, type: "dashed", color } : undefined,
          itemStyle: { color, borderRadius: showReg ? undefined : [6, 6, 0, 0] },
          data,
        });
        meta.push({ metric: "cpr", monthLabel: ml });
      });
    }

    chart.setOption(
      {
        legend: { type: "scroll", data: monthLabels },
        grid: { left: 48, right: showReg && showCpr ? 60 : 22, top: 40, bottom: 42, containLabel: true },
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
          backgroundColor: "rgba(255,255,255,0.96)",
          borderColor: "rgba(148,163,184,0.35)",
          borderWidth: 1,
          textStyle: { color: "#0f172a", fontSize: 12 },
          formatter: (params) => {
            if (!params || !params.length) return "";
            const country = params[0].axisValue;

            const byM = new Map(); // monthLabel -> {reg,cpr,marker}
            params.forEach((p) => {
              const m = meta[p.seriesIndex] || {};
              const ml = m.monthLabel || p.seriesName || "-";
              if (!byM.has(ml)) byM.set(ml, { marker: p.marker, reg: null, cpr: null });
              const g = byM.get(ml);
              if (m.metric === "reg") g.reg = p.value;
              if (m.metric === "cpr") g.cpr = p.value;
            });

            const lines = [];
            lines.push(`<div style="font-weight:700;margin-bottom:4px;">国家：${country}</div>`);
            monthLabels.forEach((ml) => {
              const g = byM.get(ml);
              if (!g) return;
              const parts = [];
              if (showReg) parts.push(`注册数 ${fmtInt(g.reg)}`);
              if (showCpr) parts.push(`注册单价 ${fmtUSD(g.cpr)}`);
              lines.push(`${g.marker || ""} ${ml} · ${parts.join(" / ")}`);
            });
            return lines.join("<br/>");
          },
        },
        xAxis: { type: "category", data: xCountries },
        yAxis,
        series,
      },
      true
    );
  }

  function initModule01() {
    const dom = document.getElementById("chart-paidreg");
    if (!dom || !window.echarts) return;

    const chart = echarts.init(dom);

    const st = {
      view: "bar",
      months: [],
      countries: [],
      medias: [],
      products: [],
      metrics: [], // reg | cpr
    };

    bindRadio("paidreg-view", st, "view", () => updateChartPaidReg(chart, st));

    createMultiSelectChips({
      containerId: "paidreg-months",
      values: ALL_MONTHS,
      getLabel: (m) => m,
      stateArray: st.months,
      max: 3,
      min: 1,
      preselectLastN: Math.min(2, ALL_MONTHS.length),
      onChange: () => updateChartPaidReg(chart, st),
    });

    createMultiSelectChips({
      containerId: "paidreg-countries",
      values: ALL_COUNTRIES,
      getLabel: (c) => c,
      stateArray: st.countries,
      min: 1,
      preselect: "all",
      onChange: () => updateChartPaidReg(chart, st),
    });

    createMultiSelectChips({
      containerId: "paidreg-media",
      values: ALL_MEDIA,
      getLabel: (m) => (m === "unknown" ? "UNKNOWN" : m.toUpperCase()),
      stateArray: st.medias,
      min: 1,
      preselect: "all",
      onChange: () => updateChartPaidReg(chart, st),
    });

    createMultiSelectChips({
      containerId: "paidreg-products",
      values: ALL_PRODUCTS,
      getLabel: (p) => (p === "unknown" ? "UNKNOWN" : p),
      stateArray: st.products,
      min: 1,
      preselect: "all",
      onChange: () => updateChartPaidReg(chart, st),
    });

    createMultiSelectChips({
      containerId: "paidreg-metrics",
      values: ["reg", "cpr"],
      getLabel: (k) => (k === "reg" ? "注册数" : "注册单价"),
      stateArray: st.metrics,
      max: 2,
      min: 1,
      preselect: 1,
      onChange: () => updateChartPaidReg(chart, st),
    });

    updateChartPaidReg(chart, st);
    window.addEventListener("resize", () => chart.resize());
  }

  // ===========================
  // 7) MODULE-02：D0/D7 付费率（含媒体/产品过滤）
  // ===========================
  function updateTablePayRate(months, countries, metrics, aggMonth) {
    const table = document.getElementById("table-payrate");
    if (!table) return;

    const showD0 = metrics.includes("d0");
    const showD7 = metrics.includes("d7");

    table.innerHTML = "";

    const thead = document.createElement("thead");
    const trh = document.createElement("tr");

    const th0 = document.createElement("th");
    th0.textContent = "国家";
    trh.appendChild(th0);

    months.forEach((m) => {
      const ml = fmtMonthShort(m);
      if (showD0) {
        const th = document.createElement("th");
        th.textContent = `${ml} D0付费率`;
        trh.appendChild(th);
      }
      if (showD7) {
        const th = document.createElement("th");
        th.textContent = `${ml} D7付费率`;
        trh.appendChild(th);
      }
    });

    thead.appendChild(trh);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    countries.forEach((c) => {
      const tr = document.createElement("tr");
      const tdC = document.createElement("td");
      tdC.textContent = c;
      tr.appendChild(tdC);

      months.forEach((m) => {
        const agg = (aggMonth[m] && aggMonth[m][c]) || null;

        const reg = agg ? agg.registration : null;
        const d0 = agg ? calcRatePct(agg.d0_payers, reg) : null;
        const d7 = agg ? calcRatePct(agg.d7_payers, reg) : null;

        if (showD0) {
          const td = document.createElement("td");
          td.className = "num";
          td.textContent = agg ? fmtPct(d0) : "-";
          tr.appendChild(td);
        }
        if (showD7) {
          const td = document.createElement("td");
          td.className = "num";
          td.textContent = agg ? fmtPct(d7) : "-";
          tr.appendChild(td);
        }
      });

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
  }

  function updateChartPayRate(chart, st) {
    if (!chart) return;

    let months = selectedOrAll(st.months, ALL_MONTHS).slice(0, 3);
    months = Array.from(new Set(months)).sort();

    const countries = selectedOrAll(st.countries, ALL_COUNTRIES).slice().sort();
    const medias = selectedOrAll(st.medias, ALL_MEDIA);
    const products = selectedOrAll(st.products, ALL_PRODUCTS);

    const metrics = selectedOrAll(st.metrics, ["d0"]);
    const showD0 = metrics.includes("d0");
    const showD7 = metrics.includes("d7");

    const filter = {
      countriesSet: new Set(countries),
      mediaSet: new Set(medias),
      productSet: new Set(products),
    };

    const aggMonth = buildAggMonthCountry(months, filter);
    updateTablePayRate(months, countries, metrics, aggMonth);

    const yAxis = [
      {
        type: "value",
        name: "付费率（%）",
        axisLabel: { formatter: (v) => (isFiniteNumber(v) ? Number(v).toFixed(0) + "%" : "") },
        splitLine: { lineStyle: { color: "rgba(148,163,184,0.22)" } },
      },
    ];

    // 日级折线：legend=国家（同名合并，取消国家=整条消失）
    if (st.view === "line") {
      const { dates, index, byCountry } = buildAggDailyCountry(months, filter);

      const series = [];
      const meta = []; // seriesIndex -> {metric,country}

      countries.forEach((c, idxC) => {
        const color = getColorForCountry(c, idxC);
        const map = byCountry[c] || {};

        if (showD0) {
          const data = new Array(dates.length).fill(null);
          Object.keys(map).forEach((d) => {
            const i = index.get(d);
            if (i == null) return;
            data[i] = calcRatePct(map[d].d0_payers, map[d].registration);
          });
          series.push({
            name: c,
            type: "line",
            yAxisIndex: 0,
            smooth: true,
            showSymbol: false,
            connectNulls: true,
            lineStyle: { width: 2, color },
            itemStyle: { color },
            data,
          });
          meta.push({ metric: "d0", country: c });
        }

        if (showD7) {
          const data = new Array(dates.length).fill(null);
          Object.keys(map).forEach((d) => {
            const i = index.get(d);
            if (i == null) return;
            data[i] = calcRatePct(map[d].d7_payers, map[d].registration);
          });
          series.push({
            name: c, // 同名：legend 一键控制 D0+D7
            type: "line",
            yAxisIndex: 0,
            smooth: true,
            showSymbol: false,
            connectNulls: true,
            lineStyle: { width: 2, type: "dashed", color },
            itemStyle: { color },
            data,
          });
          meta.push({ metric: "d7", country: c });
        }
      });

      chart.setOption(
        {
          legend: { type: "scroll", data: countries },
          grid: { left: 52, right: 22, top: 40, bottom: 42, containLabel: true },
          tooltip: {
            trigger: "axis",
            axisPointer: { type: "cross" },
            backgroundColor: "rgba(255,255,255,0.96)",
            borderColor: "rgba(148,163,184,0.35)",
            borderWidth: 1,
            textStyle: { color: "#0f172a", fontSize: 12 },
            formatter: (params) => {
              if (!params || !params.length) return "";
              const axisValue = params[0].axisValue;

              const byC = new Map();
              params.forEach((p) => {
                const m = meta[p.seriesIndex] || {};
                const c = m.country || p.seriesName || "-";
                if (!byC.has(c)) byC.set(c, { marker: p.marker, d0: null, d7: null });
                const g = byC.get(c);
                if (m.metric === "d0") g.d0 = p.value;
                if (m.metric === "d7") g.d7 = p.value;
              });

              const lines = [];
              lines.push(`<div style="font-weight:700;margin-bottom:4px;">日期：${axisValue}</div>`);
              countries.forEach((c) => {
                const g = byC.get(c);
                if (!g) return;
                const parts = [];
                if (showD0) parts.push(`D0 ${fmtPct(g.d0)}`);
                if (showD7) parts.push(`D7 ${fmtPct(g.d7)}`);
                lines.push(`${g.marker || ""} ${c} · ${parts.join(" / ")}`);
              });
              return lines.join("<br/>");
            },
          },
          xAxis: { type: "category", data: dates, axisLabel: { formatter: (v) => String(v).slice(5) } },
          yAxis,
          series,
        },
        true
      );
      return;
    }

    // 月度柱状：X=国家，legend=月份（同名合并：同一个月的柱+线一起隐藏）
    const monthLabels = months.map((m) => fmtMonthShort(m));
    const xCountries = countries;

    const series = [];
    const meta = []; // seriesIndex -> {metric, monthLabel}

    // D0（bar）
    if (showD0) {
      months.forEach((m, idxM) => {
        const ml = fmtMonthShort(m);
        const color = getColorForMonth(m, idxM);
        const data = xCountries.map((c) => {
          const a = (aggMonth[m] && aggMonth[m][c]) || null;
          return a ? calcRatePct(a.d0_payers, a.registration) : null;
        });

        series.push({
          name: ml,
          type: "bar",
          yAxisIndex: 0,
          barMaxWidth: 18,
          itemStyle: { color, borderRadius: [6, 6, 0, 0] },
          data,
        });
        meta.push({ metric: "d0", monthLabel: ml });
      });
    }

    // D7（同显时走虚线；只看D7时走柱状）
    if (showD7) {
      months.forEach((m, idxM) => {
        const ml = fmtMonthShort(m);
        const color = getColorForMonth(m, idxM);
        const data = xCountries.map((c) => {
          const a = (aggMonth[m] && aggMonth[m][c]) || null;
          return a ? calcRatePct(a.d7_payers, a.registration) : null;
        });

        series.push({
          name: ml,
          type: showD0 ? "line" : "bar",
          yAxisIndex: 0,
          smooth: true,
          symbol: "circle",
          symbolSize: 6,
          lineStyle: showD0 ? { width: 2, type: "dashed", color } : undefined,
          itemStyle: { color, borderRadius: showD0 ? undefined : [6, 6, 0, 0] },
          data,
        });
        meta.push({ metric: "d7", monthLabel: ml });
      });
    }

    chart.setOption(
      {
        legend: { type: "scroll", data: monthLabels },
        grid: { left: 48, right: 22, top: 40, bottom: 42, containLabel: true },
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
          backgroundColor: "rgba(255,255,255,0.96)",
          borderColor: "rgba(148,163,184,0.35)",
          borderWidth: 1,
          textStyle: { color: "#0f172a", fontSize: 12 },
          formatter: (params) => {
            if (!params || !params.length) return "";
            const country = params[0].axisValue;

            const byM = new Map(); // monthLabel -> {d0,d7,marker}
            params.forEach((p) => {
              const m = meta[p.seriesIndex] || {};
              const ml = m.monthLabel || p.seriesName || "-";
              if (!byM.has(ml)) byM.set(ml, { marker: p.marker, d0: null, d7: null });
              const g = byM.get(ml);
              if (m.metric === "d0") g.d0 = p.value;
              if (m.metric === "d7") g.d7 = p.value;
            });

            const lines = [];
            lines.push(`<div style="font-weight:700;margin-bottom:4px;">国家：${country}</div>`);
            monthLabels.forEach((ml) => {
              const g = byM.get(ml);
              if (!g) return;
              const parts = [];
              if (showD0) parts.push(`D0 ${fmtPct(g.d0)}`);
              if (showD7) parts.push(`D7 ${fmtPct(g.d7)}`);
              lines.push(`${g.marker || ""} ${ml} · ${parts.join(" / ")}`);
            });
            return lines.join("<br/>");
          },
        },
        xAxis: { type: "category", data: xCountries },
        yAxis,
        series,
      },
      true
    );
  }

  function initModule02() {
    const dom = document.getElementById("chart-payrate");
    if (!dom || !window.echarts) return;

    const chart = echarts.init(dom);

    const st = {
      view: "bar",
      months: [],
      countries: [],
      medias: [],
      products: [],
      metrics: [], // d0 | d7
    };

    bindRadio("payrate-view", st, "view", () => updateChartPayRate(chart, st));

    createMultiSelectChips({
      containerId: "payrate-months",
      values: ALL_MONTHS,
      getLabel: (m) => m,
      stateArray: st.months,
      max: 3,
      min: 1,
      preselectLastN: Math.min(2, ALL_MONTHS.length),
      onChange: () => updateChartPayRate(chart, st),
    });

    createMultiSelectChips({
      containerId: "payrate-countries",
      values: ALL_COUNTRIES,
      getLabel: (c) => c,
      stateArray: st.countries,
      min: 1,
      preselect: "all",
      onChange: () => updateChartPayRate(chart, st),
    });

    createMultiSelectChips({
      containerId: "payrate-media",
      values: ALL_MEDIA,
      getLabel: (m) => (m === "unknown" ? "UNKNOWN" : m.toUpperCase()),
      stateArray: st.medias,
      min: 1,
      preselect: "all",
      onChange: () => updateChartPayRate(chart, st),
    });

    createMultiSelectChips({
      containerId: "payrate-products",
      values: ALL_PRODUCTS,
      getLabel: (p) => (p === "unknown" ? "UNKNOWN" : p),
      stateArray: st.products,
      min: 1,
      preselect: "all",
      onChange: () => updateChartPayRate(chart, st),
    });

    createMultiSelectChips({
      containerId: "payrate-metrics",
      values: ["d0", "d7"],
      getLabel: (k) => (k === "d0" ? "D0付费率" : "D7付费率"),
      stateArray: st.metrics,
      max: 2,
      min: 1,
      preselect: 2, // 默认 D0+D7 同显
      onChange: () => updateChartPayRate(chart, st),
    });

    updateChartPayRate(chart, st);
    window.addEventListener("resize", () => chart.resize());
  }

  // ===========================
  // 8) Boot
  // ===========================
  document.addEventListener("DOMContentLoaded", () => {
    // 模块1 + 模块2：HTML 不在就自动跳过，不影响其它模块
    if (!ALL_MONTHS.length) return;

    initModule01();
    initModule02();
  });
})();
