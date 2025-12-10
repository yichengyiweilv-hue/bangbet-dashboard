/* paid-monthly/paid-module-reg-cpa.js
 * 模块2：注册单价（CPA）
 * 公式：CPA = spent / registration
 * 视图：
 *  - 柱状（月度）：x=国家（GH/KE/NG/TZ固定顺序），series=月份
 *  - 折线（日级）：x=日期，series=国家×媒体×产品类型（受“全选但不区分”影响会聚合）
 * 筛选：
 *  - 月份：最多选3个（多选）
 *  - 国家/媒体/产品类型：多选 + “全选但不区分”
 * 文案：
 *  - 从 window.ANALYSIS_TEXT.reg_cpa[YYYY-MM] 取；按所选月份拼接展示
 */
(function () {
  const MODULE_KEY = "reg_cpa";
  const STYLE_ID = "paid-reg-cpa-module-style";

  const FIXED_COUNTRY_ORDER = ["GH", "KE", "NG", "TZ"];
  const FALLBACK_COLORS = [
    "#3b82f6", "#22c55e", "#f97316", "#a855f7",
    "#06b6d4", "#ef4444", "#84cc16", "#eab308",
  ];

  function injectStylesOnce() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
/* ---- paid reg-cpa module scaffold ---- */
#card-paid-reg-cpa .chart-filter-panel{
  padding: 10px 14px;
  border-top: 1px solid rgba(148,163,184,.25);
  border-bottom: 1px solid rgba(148,163,184,.25);
  background: rgba(15,23,42,.10);
}
#card-paid-reg-cpa .hero-filter-row{
  display:flex; gap:10px; align-items:flex-start;
  margin: 6px 0;
}
#card-paid-reg-cpa .hero-filter-row .label{
  width: 72px; flex: 0 0 auto;
  font-size: 12px; opacity: .85;
  padding-top: 6px;
}
#card-paid-reg-cpa .chart-mini-chips{
  display:flex; flex-wrap:wrap; gap:8px;
}
#card-paid-reg-cpa .filter-chip{
  display:inline-flex; align-items:center; gap:6px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(148,163,184,.35);
  cursor:pointer; user-select:none;
  font-size: 12px;
  line-height: 1;
}
#card-paid-reg-cpa .filter-chip input{
  transform: translateY(0.5px);
}
#card-paid-reg-cpa .filter-chip.filter-chip-active{
  border-color: rgba(59,130,246,.65);
  background: rgba(59,130,246,.12);
}
#card-paid-reg-cpa .btn{
  padding: 6px 10px;
  border-radius: 10px;
  border: 1px solid rgba(148,163,184,.35);
  background: rgba(15,23,42,.05);
  cursor:pointer;
  font-size: 12px;
}
#card-paid-reg-cpa .chart-table-section{
  margin-top: 12px;
  padding: 0 14px 14px 14px;
}
#card-paid-reg-cpa .chart-table-header{
  display:flex; justify-content:space-between; align-items:flex-end;
  gap: 10px;
  margin: 8px 0;
}
#card-paid-reg-cpa .chart-table-title{
  font-weight: 600;
}
#card-paid-reg-cpa .chart-table-wrapper{
  overflow:auto;
  border: 1px solid rgba(148,163,184,.25);
  border-radius: 12px;
}
#card-paid-reg-cpa table.chart-table{
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}
#card-paid-reg-cpa table.chart-table th,
#card-paid-reg-cpa table.chart-table td{
  border-bottom: 1px solid rgba(148,163,184,.18);
  padding: 8px 10px;
  white-space: nowrap;
  text-align: center !important; /* 你要求：表头/单元格均居中 */
}
#card-paid-reg-cpa table.chart-table tr:last-child td{
  border-bottom: none;
}
#card-paid-reg-cpa table.chart-table td.num{
  font-variant-numeric: tabular-nums;
}

/* 文案区：隐藏 index.html 自带的月份按钮，避免跟筛选器冲突 */
#card-paid-reg-cpa .chart-summary[data-analysis-key="reg_cpa"] .chart-analysis-months{
  display:none !important;
}
#card-paid-reg-cpa .chart-summary[data-analysis-key="reg_cpa"] .chart-analysis-body{
  width: 100%;
}
`;
    document.head.appendChild(style);
  }

  function getDom(id) {
    return document.getElementById(id);
  }

  function getRAW() {
    return window.RAW_PAID_BY_MONTH || {};
  }

  function getPalette() {
    return (window.PaidDashboard && window.PaidDashboard.COLORS) || FALLBACK_COLORS;
  }

  function safeDiv(a, b) {
    if (window.PaidDashboard && typeof window.PaidDashboard.safeDiv === "function") {
      return window.PaidDashboard.safeDiv(a, b);
    }
    const x = Number(a), y = Number(b);
    if (!Number.isFinite(x) || !Number.isFinite(y) || y <= 0) return 0;
    return x / y;
  }

  function formatMonthLabel(m) {
    if (window.PaidDashboard && typeof window.PaidDashboard.formatMonthLabel === "function") {
      return window.PaidDashboard.formatMonthLabel(m);
    }
    const s = String(m || "");
    const mm = s.slice(5, 7);
    return mm ? `${Number(mm)}月` : s;
  }

  function formatInteger(v) {
    if (window.PaidDashboard && typeof window.PaidDashboard.formatInteger === "function") {
      return window.PaidDashboard.formatInteger(v);
    }
    const n = Number(v);
    return Number.isFinite(n) ? Math.round(n).toLocaleString("en-US") : "—";
  }

  function formatUSD(v, digits = 2) {
    if (window.PaidDashboard && typeof window.PaidDashboard.formatUSD === "function") {
      return window.PaidDashboard.formatUSD(v, digits);
    }
    const n = Number(v);
    return Number.isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: digits }) : "—";
  }

  function uniq(arr) {
    const out = [];
    const seen = new Set();
    (Array.isArray(arr) ? arr : []).forEach((x) => {
      const k = String(x);
      if (!seen.has(k)) {
        seen.add(k);
        out.push(x);
      }
    });
    return out;
  }

  function setArray(dst, src) {
    dst.length = 0;
    (Array.isArray(src) ? src : []).forEach((x) => dst.push(x));
  }

  function normalizeCountry(v) {
    return String(v == null ? "" : v).trim().toUpperCase();
  }
  function normalizeMedia(v) {
    // 内部用小写，方便你示例 fb/gg；过滤时也统一小写
    return String(v == null ? "" : v).trim().toLowerCase();
  }
  function normalizeProductType(v) {
    return String(v == null ? "" : v).trim().toLowerCase();
  }

  function sortCountries(list) {
    const arr = uniq(list.map(normalizeCountry));
    const fixed = [];
    const rest = [];
    const set = new Set(arr);
    FIXED_COUNTRY_ORDER.forEach((c) => {
      if (set.has(c)) fixed.push(c);
    });
    arr.forEach((c) => {
      if (!FIXED_COUNTRY_ORDER.includes(c)) rest.push(c);
    });
    rest.sort((a, b) => a.localeCompare(b));
    return fixed.concat(rest);
  }

  function pickDefaultMonths(allMonths) {
    const ms = (Array.isArray(allMonths) ? allMonths.slice() : []).sort((a, b) =>
      String(a).localeCompare(String(b))
    );
    if (!ms.length) return [];
    return [ms[ms.length - 1]];
  }

  function sumFields(rows, fields) {
    const out = {};
    fields.forEach((f) => (out[f] = 0));
    for (const r of rows) {
      if (!r) continue;
      for (const f of fields) {
        const v = Number(r[f]);
        if (Number.isFinite(v)) out[f] += v;
      }
    }
    return out;
  }

  function buildOptionsFromRAW() {
    const RAW = getRAW();
    const months = Object.keys(RAW || {}).sort((a, b) => String(a).localeCompare(String(b)));

    const countries = new Set();
    const medias = new Set();
    const productTypes = new Set();

    months.forEach((m) => {
      const rows = RAW[m] || [];
      rows.forEach((r) => {
        if (!r) return;
        countries.add(normalizeCountry(r.country));
        medias.add(normalizeMedia(r.media));
        productTypes.add(normalizeProductType(r.productType));
      });
    });

    return {
      months,
      countries: sortCountries(Array.from(countries)),
      medias: Array.from(medias).sort((a, b) => a.localeCompare(b)),
      productTypes: Array.from(productTypes).sort((a, b) => a.localeCompare(b)),
    };
  }

  function ensureScaffold(cardEl, chartEl) {
    if (!cardEl) return;

    // 1) filter panel
    if (!getDom("reg-cpa-filter-panel")) {
      const headerEl = cardEl.querySelector(".chart-card-header") || cardEl.querySelector("header");
      const panel = document.createElement("div");
      panel.className = "chart-filter-panel";
      panel.id = "reg-cpa-filter-panel";
      panel.innerHTML = `
        <div class="hero-filter-row">
          <div class="label">图表</div>
          <div class="chart-mini-chips" id="reg-cpa-view"></div>
        </div>
        <div class="hero-filter-row">
          <div class="label">月份</div>
          <div class="chart-mini-chips" id="reg-cpa-months"></div>
        </div>
        <div class="hero-filter-row">
          <div class="label">国家</div>
          <div class="chart-mini-chips" id="reg-cpa-countries"></div>
        </div>
        <div class="hero-filter-row">
          <div class="label">媒体</div>
          <div class="chart-mini-chips" id="reg-cpa-medias"></div>
        </div>
        <div class="hero-filter-row">
          <div class="label">产品</div>
          <div class="chart-mini-chips" id="reg-cpa-productTypes"></div>
          <div style="flex:1"></div>
          <button class="btn" type="button" id="reg-cpa-btn-reset">全选 / 重置</button>
        </div>
      `;
      if (headerEl && headerEl.parentNode) {
        headerEl.insertAdjacentElement("afterend", panel);
      } else {
        cardEl.insertAdjacentElement("afterbegin", panel);
      }
    }

    // 2) table section (insert between chart and summary)
    if (!getDom("table-reg-cpa")) {
      const tableSection = document.createElement("div");
      tableSection.className = "chart-table-section";
      tableSection.id = "table-section-reg-cpa";
      tableSection.innerHTML = `
        <div class="chart-table-header">
          <div class="chart-table-title" id="table-title-reg-cpa">注册单价明细</div>
          <div class="chart-table-sub"></div>
        </div>
        <div class="chart-table-wrapper">
          <table class="chart-table" id="table-reg-cpa"></table>
        </div>
      `;
      if (chartEl && chartEl.parentNode) {
        chartEl.insertAdjacentElement("afterend", tableSection);
      } else {
        cardEl.appendChild(tableSection);
      }
    }
  }

  function setAnalysisTextForSelectedMonths(monthKeys) {
    const cardEl = getDom("card-paid-reg-cpa") || document.querySelector("#card-paid-reg-cpa");
    if (!cardEl) return;

    const summaryEl = cardEl.querySelector('.chart-summary[data-analysis-key="reg_cpa"]');
    if (!summaryEl) return;

    // index.html 会先创建 textarea，这里复用它；没有就自己补一个
    let textarea = summaryEl.querySelector("textarea.chart-analysis-textarea");
    if (!textarea) {
      // 兼容：如果页面没跑 initAnalysisBlocks，就简单造一个
      summaryEl.innerHTML = `
        <div class="chart-analysis-box">
          <div class="chart-analysis-body">
            <div class="chart-analysis-title">数据分析</div>
            <textarea class="chart-analysis-textarea" readonly></textarea>
          </div>
        </div>`;
      textarea = summaryEl.querySelector("textarea.chart-analysis-textarea");
    }

    const src = window.ANALYSIS_TEXT && window.ANALYSIS_TEXT[MODULE_KEY] ? window.ANALYSIS_TEXT[MODULE_KEY] : {};
    const months = (Array.isArray(monthKeys) ? monthKeys.slice() : []).sort((a, b) =>
      String(a).localeCompare(String(b))
    );

    if (!months.length) {
      textarea.value = "暂未选择月份。";
    } else {
      const blocks = months.map((m) => {
        const t = (src && typeof src[m] === "string") ? src[m] : "";
        const body = t && t.trim() ? t.trim() : "暂未填写该月份的数据分析文案。";
        return `【${formatMonthLabel(m)}】\n${body}`;
      });
      textarea.value = blocks.join("\n\n");
    }

    // autosize（不依赖 index.html 的闭包）
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight + 2, 480) + "px";
  }

  function init() {
    injectStylesOnce();

    const chartEl = getDom("chart-paid-reg-cpa");
    if (!chartEl) return;
    if (!window.echarts) {
      console.warn("[reg_cpa] echarts not found");
      return;
    }

    const cardEl = chartEl.closest(".chart-card") || getDom("card-paid-reg-cpa");
    ensureScaffold(cardEl, chartEl);

    const tableTitleEl = getDom("table-title-reg-cpa");
    const tableEl = getDom("table-reg-cpa");

    const opts = buildOptionsFromRAW();
    const state = {
      view: "bar",
      months: [],
      countries: [],
      medias: [],
      productTypes: [],
      collapse: { countries: false, medias: false, productTypes: false },
    };

    function resetState() {
      state.view = "bar";
      setArray(state.months, pickDefaultMonths(opts.months));
      setArray(state.countries, opts.countries);
      setArray(state.medias, opts.medias);
      setArray(state.productTypes, opts.productTypes);
      state.collapse.countries = false;
      state.collapse.medias = false;
      state.collapse.productTypes = false;
    }

    resetState();

    const chart = window.echarts.init(chartEl);
    if (window.PaidDashboard && typeof window.PaidDashboard.registerChart === "function") {
      window.PaidDashboard.registerChart(chart);
    } else {
      window.addEventListener("resize", () => {
        try { chart.resize(); } catch (e) {}
      });
    }

    function buildTitleSuffix() {
      const mAll = opts.medias || [];
      const pAll = opts.productTypes || [];

      const mediaLabel =
        state.collapse.medias || state.medias.length === mAll.length
          ? "全部媒体"
          : uniq(state.medias).join("+");

      const typeLabel =
        state.collapse.productTypes || state.productTypes.length === pAll.length
          ? "全部形态"
          : uniq(state.productTypes).join("+");

      // 你示例里是：fb+gg，app
      return `（${mediaLabel}，${typeLabel}）`;
    }

    function renderRadioView() {
      const viewEl = getDom("reg-cpa-view");
      if (!viewEl) return;

      const mk = (value, text) => {
        const checked = state.view === value;
        return `
          <label class="filter-chip ${checked ? "filter-chip-active" : ""}">
            <input type="radio" name="reg-cpa-view-radio" value="${value}" ${checked ? "checked" : ""}/>
            ${text}
          </label>`;
      };

      viewEl.innerHTML = mk("bar", "柱状（月度）") + mk("line", "折线（日度）");

      viewEl.querySelectorAll('input[type="radio"]').forEach((input) => {
        input.addEventListener("change", () => {
          state.view = input.value;
          renderAll();
        });
      });
    }

    function renderChipGroup({
      containerId,
      values,
      stateArray,
      max,
      getLabel,
      allowEmpty,
      specialAllNoBreakdown,
      collapseKey,
    }) {
      const el = getDom(containerId);
      if (!el) return;

      const _values = (Array.isArray(values) ? values.slice() : []).filter((v) => v != null);
      const labelOf = typeof getLabel === "function" ? getLabel : (v) => String(v);

      function ensureNonEmpty() {
        if (!allowEmpty && stateArray.length === 0) {
          stateArray.push(_values[0]);
        }
      }

      // collapse=true 时强制全选
      if (specialAllNoBreakdown && collapseKey && state.collapse[collapseKey]) {
        setArray(stateArray, _values);
      }
      ensureNonEmpty();

      let html = "";

      if (specialAllNoBreakdown && collapseKey) {
        const checked = !!state.collapse[collapseKey];
        html += `
          <label class="filter-chip ${checked ? "filter-chip-active" : ""}">
            <input type="checkbox" data-special="1" ${checked ? "checked" : ""}/>
            全选但不区分
          </label>`;
      }

      _values.forEach((v) => {
        const key = String(v);
        const checked = stateArray.some((x) => String(x) === key);
        html += `
          <label class="filter-chip ${checked ? "filter-chip-active" : ""}">
            <input type="checkbox" data-value="${key}" ${checked ? "checked" : ""}/>
            ${labelOf(v)}
          </label>`;
      });

      el.innerHTML = html;

      el.querySelectorAll('input[type="checkbox"]').forEach((input) => {
        input.addEventListener("change", () => {
          const isSpecial = input.getAttribute("data-special") === "1";
          if (isSpecial && specialAllNoBreakdown && collapseKey) {
            state.collapse[collapseKey] = input.checked;
            if (state.collapse[collapseKey]) {
              setArray(stateArray, _values);
            }
            renderAll();
            return;
          }

          const key = input.getAttribute("data-value");
          if (key == null) return;
          const idx = stateArray.findIndex((x) => String(x) === key);
          const already = idx >= 0;

          if (input.checked && !already) {
            if (max && stateArray.length >= max) {
              input.checked = false;
              return;
            }
            const found = _values.find((x) => String(x) === key);
            stateArray.push(found);
          } else if (!input.checked && already) {
            stateArray.splice(idx, 1);
            if (!allowEmpty && stateArray.length === 0) {
              stateArray.push(_values[0]);
            }
          }

          // collapse=true 时保持全选
          if (specialAllNoBreakdown && collapseKey && state.collapse[collapseKey]) {
            setArray(stateArray, _values);
          }

          renderAll();
        });
      });
    }

    function filteredRowsForMonth(monthKey, extraFilter) {
      const RAW = getRAW();
      const rows = RAW && RAW[monthKey] ? RAW[monthKey] : [];
      if (!rows || !rows.length) return [];

      const countrySet = !state.collapse.countries
        ? new Set(state.countries.map(normalizeCountry))
        : null;
      const mediaSet = !state.collapse.medias
        ? new Set(state.medias.map(normalizeMedia))
        : null;
      const typeSet = !state.collapse.productTypes
        ? new Set(state.productTypes.map(normalizeProductType))
        : null;

      const out = [];
      for (const r of rows) {
        if (!r) continue;
        const c0 = normalizeCountry(r.country);
        const m0 = normalizeMedia(r.media);
        const p0 = normalizeProductType(r.productType);

        if (countrySet && !countrySet.has(c0)) continue;
        if (mediaSet && !mediaSet.has(m0)) continue;
        if (typeSet && !typeSet.has(p0)) continue;

        if (extraFilter && !extraFilter(r, { c0, m0, p0 })) continue;
        out.push(r);
      }
      return out;
    }

    function renderBar() {
      const palette = getPalette();

      const monthsSel = uniq(state.months)
        .sort((a, b) => String(a).localeCompare(String(b)))
        .slice(0, 3);

      const axisCountries = state.collapse.countries
        ? ["ALL"]
        : sortCountries(state.countries);

      const series = monthsSel.map((monthKey, mi) => {
        const color = palette[mi % palette.length];
        const data = axisCountries.map((ck) => {
          const rows = filteredRowsForMonth(monthKey, (_r, norm) => {
            if (state.collapse.countries) return true;
            return norm.c0 === ck;
          });
          const sums = sumFields(rows, ["spent", "registration"]);
          return safeDiv(sums.spent, sums.registration);
        });

        return {
          name: formatMonthLabel(monthKey),
          type: "bar",
          data,
          barMaxWidth: 26,
          itemStyle: { color },
        };
      });

      const option = {
        grid: { top: 40, left: 56, right: 18, bottom: 42 },
        legend: { top: 8, type: "scroll" },
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
          formatter: (params) => {
            const title = params && params[0] ? params[0].axisValueLabel : "";
            const lines = [`<div style="margin-bottom:6px;"><strong>${title}</strong></div>`];
            (params || []).forEach((p) => {
              lines.push(
                `<div>${p.marker}${p.seriesName}：<strong>${formatUSD(p.data, 2)}</strong></div>`
              );
            });
            return lines.join("");
          },
        },
        xAxis: {
          type: "category",
          data: axisCountries,
          axisLabel: { interval: 0 },
        },
        yAxis: {
          type: "value",
          axisLabel: { formatter: (v) => formatUSD(v, 2) },
          splitLine: { lineStyle: { opacity: 0.2 } },
        },
        series,
      };

      chart.setOption(option, true);
    }

    function renderLine() {
      const palette = getPalette();
      const RAW = getRAW();

      const monthsSel = uniq(state.months)
        .sort((a, b) => String(a).localeCompare(String(b)))
        .slice(0, 3);

      const byBase = {}; // baseKey -> date -> { spent, reg }
      const datesSet = new Set();

      const countrySet = !state.collapse.countries
        ? new Set(state.countries.map(normalizeCountry))
        : null;
      const mediaSet = !state.collapse.medias
        ? new Set(state.medias.map(normalizeMedia))
        : null;
      const typeSet = !state.collapse.productTypes
        ? new Set(state.productTypes.map(normalizeProductType))
        : null;

      monthsSel.forEach((monthKey) => {
        const rows = RAW[monthKey] || [];
        rows.forEach((r) => {
          if (!r) return;

          const date = String(r.date || "").trim();
          if (!date) return;

          const c0 = normalizeCountry(r.country);
          const m0 = normalizeMedia(r.media);
          const p0 = normalizeProductType(r.productType);

          if (countrySet && !countrySet.has(c0)) return;
          if (mediaSet && !mediaSet.has(m0)) return;
          if (typeSet && !typeSet.has(p0)) return;

          const c = state.collapse.countries ? "ALL" : c0;
          const m = state.collapse.medias ? "ALL" : m0;
          const p = state.collapse.productTypes ? "ALL" : p0;

          const baseKey = `${c}|${m}|${p}`;
          if (!byBase[baseKey]) byBase[baseKey] = {};
          if (!byBase[baseKey][date]) byBase[baseKey][date] = { spent: 0, reg: 0 };

          const spent = Number(r.spent);
          const reg = Number(r.registration);

          if (Number.isFinite(spent)) byBase[baseKey][date].spent += spent;
          if (Number.isFinite(reg)) byBase[baseKey][date].reg += reg;

          datesSet.add(date);
        });
      });

      const dates = Array.from(datesSet).sort((a, b) => String(a).localeCompare(String(b)));
      const baseKeys = Object.keys(byBase).sort((a, b) => String(a).localeCompare(String(b)));

      function baseLabel(baseKey) {
        const [c, m, p] = String(baseKey).split("|");
        const parts = [];
        if (!state.collapse.countries) parts.push(c);
        if (!state.collapse.medias) parts.push(m);
        if (!state.collapse.productTypes) parts.push(p);
        return parts.join(" · ") || "ALL";
      }

      const series = baseKeys.map((baseKey, i) => {
        const color = palette[i % palette.length];
        const data = dates.map((d) => {
          const bucket = byBase[baseKey] && byBase[baseKey][d];
          if (!bucket) return null;
          return safeDiv(bucket.spent, bucket.reg);
        });

        return {
          name: baseLabel(baseKey),
          type: "line",
          data,
          showSymbol: false,
          connectNulls: true,
          lineStyle: { width: 2, color },
          itemStyle: { color },
          emphasis: { focus: "series" },
        };
      });

      const option = {
        grid: { top: 40, left: 56, right: 18, bottom: 42 },
        legend: { top: 8, type: "scroll" },
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "line" },
          formatter: (params) => {
            const date = params && params[0] ? params[0].axisValue : "";
            const lines = [`<div style="margin-bottom:6px;"><strong>${date}</strong></div>`];
            (params || []).forEach((p) => {
              lines.push(
                `<div>${p.marker}${p.seriesName}：<strong>${formatUSD(p.data, 2)}</strong></div>`
              );
            });
            return lines.join("");
          },
        },
        xAxis: {
          type: "category",
          data: dates,
          axisLabel: {
            hideOverlap: true,
            formatter: (v) => {
              const s = String(v);
              return s.length >= 10 ? s.slice(5) : s;
            },
          },
        },
        yAxis: {
          type: "value",
          axisLabel: { formatter: (v) => formatUSD(v, 2) },
          splitLine: { lineStyle: { opacity: 0.2 } },
        },
        series,
      };

      chart.setOption(option, true);
    }

    function renderTable() {
      if (!tableEl) return;

      const monthsSel = uniq(state.months)
        .sort((a, b) => String(a).localeCompare(String(b)))
        .slice(0, 3);

      const rowCountries = state.collapse.countries ? ["ALL"] : sortCountries(state.countries);
      const rowMedias = state.collapse.medias ? ["ALL"] : uniq(state.medias).sort((a, b) => a.localeCompare(b));
      const rowTypes = state.collapse.productTypes ? ["ALL"] : uniq(state.productTypes).sort((a, b) => a.localeCompare(b));

      if (tableTitleEl) {
        tableTitleEl.textContent = `注册单价明细 ${buildTitleSuffix()}`;
      }

      const cellCache = new Map();
      function getCell(monthKey, countryKey, mediaKey, typeKey) {
        const k = `${monthKey}|${countryKey}|${mediaKey}|${typeKey}`;
        if (cellCache.has(k)) return cellCache.get(k);

        const rows = filteredRowsForMonth(monthKey, (_r, norm) => {
          if (!state.collapse.countries && countryKey !== "ALL" && norm.c0 !== countryKey) return false;
          if (!state.collapse.medias && mediaKey !== "ALL" && norm.m0 !== mediaKey) return false;
          if (!state.collapse.productTypes && typeKey !== "ALL" && norm.p0 !== typeKey) return false;
          return true;
        });

        const sums = sumFields(rows, ["spent", "registration"]);
        const out = { reg: sums.registration, cpa: safeDiv(sums.spent, sums.registration) };
        cellCache.set(k, out);
        return out;
      }

      const thead = document.createElement("thead");
      const trh = document.createElement("tr");

      function th(text) {
        const el = document.createElement("th");
        el.textContent = text;
        return el;
      }
      function td(text, cls) {
        const el = document.createElement("td");
        if (cls) el.className = cls;
        el.textContent = text;
        return el;
      }

      trh.appendChild(th("国家"));
      if (!state.collapse.medias) trh.appendChild(th("媒体"));
      if (!state.collapse.productTypes) trh.appendChild(th("产品类型"));

      monthsSel.forEach((m) => {
        trh.appendChild(th(`${formatMonthLabel(m)} 注册数`));
        trh.appendChild(th(`${formatMonthLabel(m)} 注册单价`));
      });

      thead.appendChild(trh);

      const tbody = document.createElement("tbody");

      rowCountries.forEach((c) => {
        rowMedias.forEach((m) => {
          rowTypes.forEach((p) => {
            const tr = document.createElement("tr");
            tr.appendChild(td(c));
            if (!state.collapse.medias) tr.appendChild(td(m));
            if (!state.collapse.productTypes) tr.appendChild(td(p));

            monthsSel.forEach((monthKey) => {
              const cell = getCell(monthKey, c, m, p);
              tr.appendChild(td(formatInteger(cell.reg), "num"));
              tr.appendChild(td(formatUSD(cell.cpa, 2), "num"));
            });

            tbody.appendChild(tr);
          });
        });
      });

      tableEl.innerHTML = "";
      tableEl.appendChild(thead);
      tableEl.appendChild(tbody);
    }

    function renderAll() {
      if (!state.months.length) setArray(state.months, pickDefaultMonths(opts.months));
      if (!state.countries.length) setArray(state.countries, opts.countries);
      if (!state.medias.length) setArray(state.medias, opts.medias);
      if (!state.productTypes.length) setArray(state.productTypes, opts.productTypes);

      renderRadioView();

      renderChipGroup({
        containerId: "reg-cpa-months",
        values: opts.months,
        stateArray: state.months,
        max: 3,
        getLabel: (v) => formatMonthLabel(v),
        allowEmpty: false,
        specialAllNoBreakdown: false,
      });

      renderChipGroup({
        containerId: "reg-cpa-countries",
        values: opts.countries,
        stateArray: state.countries,
        max: 0,
        getLabel: (v) => v,
        allowEmpty: false,
        specialAllNoBreakdown: true,
        collapseKey: "countries",
      });

      renderChipGroup({
        containerId: "reg-cpa-medias",
        values: opts.medias,
        stateArray: state.medias,
        max: 0,
        getLabel: (v) => String(v), // 内部已是小写 fb/gg
        allowEmpty: false,
        specialAllNoBreakdown: true,
        collapseKey: "medias",
      });

      renderChipGroup({
        containerId: "reg-cpa-productTypes",
        values: opts.productTypes,
        stateArray: state.productTypes,
        max: 0,
        getLabel: (v) => String(v), // app/h5
        allowEmpty: false,
        specialAllNoBreakdown: true,
        collapseKey: "productTypes",
      });

      const resetBtn = getDom("reg-cpa-btn-reset");
      if (resetBtn && !resetBtn.__bound) {
        resetBtn.__bound = true;
        resetBtn.addEventListener("click", () => {
          resetState();
          renderAll();
        });
      }

      if (state.view === "bar") renderBar();
      else renderLine();

      renderTable();

      // 文案：跟随月份筛选（多选就拼接展示）
      setAnalysisTextForSelectedMonths(uniq(state.months).slice(0, 3));
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
