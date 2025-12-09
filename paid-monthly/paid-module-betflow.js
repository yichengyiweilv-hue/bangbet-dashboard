/**
 * paid-module-betflow.js
 * ------------------------------------------------------------
 * 模块：D0/D7 人均流水（总流水/体育流水/游戏流水）
 *
 * 数据源：window.RAW_PAID_BY_MONTH
 * 粒度：date(UTC+0) × country × media × productType
 *
 * 公式：
 * 人均流水 = BET_FLOW / BET_PLACED_USER
 *
 * 交互：
 * - 视图：柱状（月度汇总）/ 折线（日级）
 * - 月份：最多选 3 个
 * - 国家/媒体/产品类型：多选，且支持“全选但不区分”（等价全选，但图/表聚合不拆维度）
 * - 人均口径：总/体育/游戏（单选）
 * - D0/D7：多选
 *
 * 需要 index.html 提供：
 * - card-paid-betflow / chart-paid-betflow / (chart-summary data-analysis-key="flow")
 * 过滤器和表格容器如不存在，本脚本会自动注入：
 * - betflow-view / betflow-kind / betflow-months / betflow-countries / betflow-medias / betflow-productTypes / betflow-windows
 * - table-title-betflow / table-betflow
 */

(function () {
  "use strict";

  const MODULE_KEY = "flow";

  const CARD_ID = "card-paid-betflow";
  const CHART_ID = "chart-paid-betflow";

  const FIXED_COUNTRY_ORDER = ["GH", "KE", "NG", "TZ"];

  // D7 斜线阴影（ECharts 5 decal）
  const D7_DECAL = {
    symbol: "rect",
    symbolSize: 1,
    dashArrayX: [6, 3],
    dashArrayY: [1, 0],
    rotation: Math.PI / 4,
    color: "rgba(255,255,255,0.35)",
  };

  const FALLBACK_COLORS = [
    "#2563eb",
    "#7c3aed",
    "#f97316",
    "#16a34a",
    "#0ea5e9",
    "#db2777",
    "#84cc16",
    "#f43f5e",
    "#14b8a6",
    "#f59e0b",
  ];

  function getPalette() {
    const pd = window.PaidDashboard;
    if (pd && Array.isArray(pd.COLORS) && pd.COLORS.length) return pd.COLORS;
    return FALLBACK_COLORS;
  }

  function getRAW() {
    return window.RAW_PAID_BY_MONTH || {};
  }

  function getDom(id) {
    return document.getElementById(id);
  }

  function uniq(arr) {
    return Array.from(new Set((arr || []).filter((v) => v !== undefined && v !== null)));
  }

  function setArray(target, values) {
    target.length = 0;
    (values || []).forEach((v) => target.push(v));
  }

  function normalizeCountry(v) {
    return String(v || "").trim().toUpperCase();
  }
  function normalizeMedia(v) {
    return String(v || "").trim().toUpperCase();
  }
  function normalizeProductType(v) {
    return String(v || "").trim().toLowerCase();
  }

  function sortCountries(list) {
    const order = new Map();
    FIXED_COUNTRY_ORDER.forEach((c, i) => order.set(c, i));

    return (list || []).slice().sort((a, b) => {
      const aa = normalizeCountry(a);
      const bb = normalizeCountry(b);

      const ra = aa === "ALL" ? -1 : order.has(aa) ? order.get(aa) : 999;
      const rb = bb === "ALL" ? -1 : order.has(bb) ? order.get(bb) : 999;

      if (ra !== rb) return ra - rb;
      return aa.localeCompare(bb);
    });
  }

  function toNum(v) {
    const n = Number(v);
    return isFinite(n) ? n : 0;
  }

  function safeDiv(a, b) {
    const pd = window.PaidDashboard;
    if (pd && typeof pd.safeDiv === "function") return pd.safeDiv(a, b);

    const na = Number(a);
    const nb = Number(b);
    if (!isFinite(na) || !isFinite(nb) || nb === 0) return null;
    return na / nb;
  }

  function formatMonthLabel(monthKey) {
    const pd = window.PaidDashboard;
    if (pd && typeof pd.formatMonthLabel === "function") return pd.formatMonthLabel(monthKey);

    const m = String(monthKey || "");
    const mm = m.split("-")[1];
    if (!mm) return m;
    const n = parseInt(mm, 10);
    if (!isFinite(n)) return m;
    return n + "月";
  }

  function formatNumber(v, digits) {
    const n = Number(v);
    if (v === null || v === undefined || !isFinite(n)) return "-";
    const d = typeof digits === "number" ? digits : 2;
    return n.toLocaleString(undefined, {
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    });
  }

  function formatUSD(v, digits) {
    const pd = window.PaidDashboard;
    if (pd && typeof pd.formatUSD === "function") return pd.formatUSD(v, digits);
    return formatNumber(v, digits);
  }

  function pickDefaultMonths(months) {
    const ms = (months || []).slice().sort();
    if (ms.length <= 2) return ms;
    return ms.slice(-2);
  }

  function sortWindows(wins) {
    const order = { D0: 0, D7: 1 };
    return uniq(wins || [])
      .filter((w) => order[w] !== undefined)
      .sort((a, b) => order[a] - order[b]);
  }

  function kindLabelCN(kind) {
    if (kind === "sports") return "体育";
    if (kind === "game") return "游戏";
    return "总";
  }

  function fieldsFor(win, kind) {
    const day = win === "D7" ? "D7" : "D0";
    const dim = kind === "sports" ? "SPORTS" : kind === "game" ? "GAMES" : "TOTAL";
    return {
      flowField: `${day}_${dim}_BET_FLOW`,
      userField: `${day}_${dim}_BET_PLACED_USER`,
    };
  }

  function buildOptionsFromRAW() {
    const RAW = getRAW();
    const months = Object.keys(RAW).sort();
    const countries = [];
    const medias = [];
    const productTypes = [];

    months.forEach((m) => {
      (RAW[m] || []).forEach((r) => {
        if (!r) return;
        const c = normalizeCountry(r.country);
        const md = normalizeMedia(r.media);
        const pt = normalizeProductType(r.productType);
        if (c) countries.push(c);
        if (md) medias.push(md);
        if (pt) productTypes.push(pt);
      });
    });

    return {
      months,
      countries: sortCountries(uniq(countries)),
      medias: uniq(medias).sort(),
      productTypes: uniq(productTypes).sort(),
    };
  }

  // --- DOM 注入：筛选器（参考 organic-monthly header mini filter） + 表格 ---
  function makeMiniFilter(labelText, innerHtml) {
    const wrap = document.createElement("div");
    wrap.className = "chart-mini-filter";
    wrap.innerHTML = `<span class="chart-mini-label">${labelText}</span>${innerHtml}`;
    return wrap;
  }

  function ensureHeaderFilters(cardEl) {
    const controls = cardEl.querySelector(".chart-controls");
    if (!controls) return;

    // badge 文案补全
    const badge = controls.querySelector(".chart-badge");
    if (badge) badge.textContent = "单位：USD / 下注用户";

    // 清理旧的（index.html 里只有 flow-daytype 那一组）
    Array.from(controls.querySelectorAll(".chart-mini-filter")).forEach((el) => el.remove());
    const oldReset = controls.querySelector(".betflow-reset-row");
    if (oldReset) oldReset.remove();

    // 已注入则跳过
    if (controls.querySelector("#betflow-view")) return;

    controls.appendChild(
      makeMiniFilter("视图：", `<div class="chart-mini-radio" id="betflow-view"></div>`)
    );
    controls.appendChild(
      makeMiniFilter("月份：", `<div class="chart-mini-chips" id="betflow-months"></div>`)
    );
    controls.appendChild(
      makeMiniFilter("国家：", `<div class="chart-mini-chips" id="betflow-countries"></div>`)
    );
    controls.appendChild(
      makeMiniFilter("媒体：", `<div class="chart-mini-chips" id="betflow-medias"></div>`)
    );
    controls.appendChild(
      makeMiniFilter("产品：", `<div class="chart-mini-chips" id="betflow-productTypes"></div>`)
    );
    controls.appendChild(
      makeMiniFilter("人均：", `<div class="chart-mini-radio" id="betflow-kind"></div>`)
    );
    controls.appendChild(
      makeMiniFilter("口径：", `<div class="chart-mini-chips" id="betflow-windows"></div>`)
    );

    const resetRow = document.createElement("div");
    resetRow.className = "betflow-reset-row";
    resetRow.style.display = "flex";
    resetRow.style.gap = "8px";
    resetRow.style.justifyContent = "flex-end";
    resetRow.style.marginTop = "6px";
    resetRow.style.flexWrap = "wrap";
    resetRow.innerHTML = `<button class="btn" type="button" id="betflow-btn-reset">全选 / 重置</button>`;
    controls.appendChild(resetRow);
  }

  function ensureTableSection(cardEl) {
    if (cardEl.querySelector("#table-betflow")) return;

    const summary = cardEl.querySelector(".chart-summary");
    const sec = document.createElement("div");
    sec.className = "chart-table-section";
    sec.id = "table-section-betflow";
    sec.innerHTML = `
      <div class="chart-table-title" id="table-title-betflow"></div>
      <div class="chart-table-wrapper">
        <table id="table-betflow" class="chart-table"></table>
      </div>
    `;

    if (summary) summary.insertAdjacentElement("afterend", sec);
    else cardEl.appendChild(sec);
  }

  function injectStylesOnce() {
    const STYLE_ID = "paid-betflow-module-style";
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      /* 表格：单元格统一居中（仅作用于 betflow） */
      #table-section-betflow{
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px dashed rgba(148, 163, 184, 0.5);
      }
      #table-section-betflow .chart-table-title{
        font-size: 11px;
        color: var(--text-sub, #475569);
        margin-bottom: 6px;
      }
      #table-section-betflow .chart-table-wrapper{
        max-height: 320px;
        overflow: auto;
        border-radius: 10px;
        border: 1px solid rgba(148, 163, 184, 0.45);
        background: rgba(255,255,255,0.55);
      }
      #table-section-betflow .chart-table{
        width: 100%;
        border-collapse: collapse;
        font-size: 12px;
      }
      #table-section-betflow .chart-table th,
      #table-section-betflow .chart-table td{
        padding: 8px 10px;
        border-bottom: 1px solid rgba(148, 163, 184, 0.35);
        white-space: nowrap;
        text-align: center !important;
      }
      #table-section-betflow .chart-table th{
        position: sticky;
        top: 0;
        z-index: 1;
        background: rgba(241, 245, 249, 0.95);
        color: #0f172a;
        font-weight: 600;
      }
      #table-section-betflow .chart-table tr:hover td{
        background: rgba(226, 232, 240, 0.35);
      }
      #table-section-betflow .chart-table td.num{
        text-align: center !important;
        font-variant-numeric: tabular-nums;
        color: #0f172a;
      }
    `;
    document.head.appendChild(style);
  }

  // --- 控件渲染 ---
  function renderRadioGroup(containerId, name, options, value, onChange) {
    const el = getDom(containerId);
    if (!el) return;

    el.innerHTML = "";
    options.forEach((opt) => {
      const label = document.createElement("label");
      label.innerHTML = `<input type="radio" name="${name}" value="${opt.value}"> ${opt.label}`;
      const input = label.querySelector("input");
      input.checked = opt.value === value;
      input.addEventListener("change", () => {
        if (input.checked) onChange(opt.value);
      });
      el.appendChild(label);
    });
  }

  function renderChipGroup(cfg) {
    const {
      containerId,
      values,
      stateArray,
      max = 0,
      getLabel = (v) => String(v),
      allowEmpty = true,
      specialAllNoBreakdown = false,
      collapseKey = null,
      labelAllNoBreakdown = "全选但不区分",
    } = cfg;

    const el = getDom(containerId);
    if (!el) return;

    el.innerHTML = "";

    const collapseOn =
      specialAllNoBreakdown && collapseKey ? !!state.collapse[collapseKey] : false;

    // collapse 开启：等价全选
    if (collapseOn) setArray(stateArray, values);

    // 特殊 chip：全选但不区分
    if (specialAllNoBreakdown && collapseKey) {
      const chip = document.createElement("label");
      chip.className = "filter-chip" + (collapseOn ? " filter-chip-active" : "");
      chip.textContent = labelAllNoBreakdown;

      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = collapseOn;
      input.style.display = "none";
      chip.appendChild(input);

      chip.addEventListener("click", (e) => {
        e.preventDefault();
        const next = !state.collapse[collapseKey];
        state.collapse[collapseKey] = next;
        if (next) setArray(stateArray, values);
        renderAll();
      });

      el.appendChild(chip);
    }

    // 常规 chips
    values.forEach((v) => {
      const selected = stateArray.includes(v);

      const chip = document.createElement("label");
      chip.className = "filter-chip" + (selected ? " filter-chip-active" : "");
      chip.textContent = getLabel(v);

      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = selected;
      input.style.display = "none";
      chip.appendChild(input);

      chip.addEventListener("click", (e) => {
        e.preventDefault();

        const checked = !stateArray.includes(v);

        if (checked) {
          if (max === 1) {
            setArray(stateArray, [v]);
          } else {
            stateArray.push(v);
            if (max > 0 && stateArray.length > max) stateArray.shift();
          }
        } else {
          const idx = stateArray.indexOf(v);
          if (idx >= 0) stateArray.splice(idx, 1);
        }

        if (!allowEmpty && stateArray.length === 0) {
          stateArray.push(values[0]);
        }

        // collapse 开启：强制全选
        if (specialAllNoBreakdown && collapseKey && state.collapse[collapseKey]) {
          setArray(stateArray, values);
        }

        renderAll();
      });

      el.appendChild(chip);
    });
  }

  // --- 渲染数据：chart + table ---
  function buildTitleSuffix() {
    const mediaLabel = state.collapse.medias
      ? "全部媒体"
      : uniq(state.medias.map(normalizeMedia)).join("+") || "全部媒体";

    const typeLabel = state.collapse.productTypes
      ? "全部产品"
      : uniq(state.productTypes.map(normalizeProductType))
          .map((t) => String(t).toUpperCase())
          .join("+") || "全部产品";

    return `（${mediaLabel}，${typeLabel}）`;
  }

  function seriesNameFrom(baseKey, win) {
    const parts = [];
    const seg = String(baseKey || "").split("|");
    const c = seg[0] || "";
    const m = seg[1] || "";
    const t = seg[2] || "";

    if (!state.collapse.countries) parts.push(c);
    if (!state.collapse.medias) parts.push(m);
    if (!state.collapse.productTypes) parts.push(String(t).toUpperCase());
    parts.push(win);

    return parts.filter(Boolean).join(" · ");
  }

  function filteredRowsForMonth(monthKey, extraPredicate) {
    const RAW = getRAW();
    const rows = RAW[monthKey] || [];

    const countrySet = state.collapse.countries
      ? null
      : new Set(state.countries.map(normalizeCountry));
    const mediaSet = state.collapse.medias ? null : new Set(state.medias.map(normalizeMedia));
    const typeSet = state.collapse.productTypes
      ? null
      : new Set(state.productTypes.map(normalizeProductType));

    const out = [];
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (!r) continue;

      const c = normalizeCountry(r.country);
      const m = normalizeMedia(r.media);
      const t = normalizeProductType(r.productType);

      if (countrySet && !countrySet.has(c)) continue;
      if (mediaSet && !mediaSet.has(m)) continue;
      if (typeSet && !typeSet.has(t)) continue;

      if (extraPredicate && !extraPredicate(r)) continue;

      out.push(r);
    }
    return out;
  }

  function renderBar() {
    if (!chart) return;

    const monthsSel = uniq(state.months).sort().slice(0, 3);
    const windowsSel = sortWindows(state.windows);
    const kind = state.kind;

    let xCountries = sortCountries(uniq(state.countries.map(normalizeCountry)));
    if (state.collapse.countries) xCountries = ["ALL"];

    const palette = getPalette();
    const series = [];

    function getValueFor(monthKey, countryKey, win) {
      const { flowField, userField } = fieldsFor(win, kind);

      const rows = filteredRowsForMonth(monthKey, (r) => {
        if (countryKey === "ALL") return true;
        return normalizeCountry(r.country) === countryKey;
      });

      let flow = 0;
      let users = 0;
      rows.forEach((r) => {
        flow += toNum(r[flowField]);
        users += toNum(r[userField]);
      });

      return safeDiv(flow, users);
    }

    monthsSel.forEach((m, mi) => {
      const color = palette[mi % palette.length];

      windowsSel.forEach((w) => {
        const isD7 = w === "D7";
        const data = xCountries.map((c) => getValueFor(m, c, w));

        series.push({
          name: `${formatMonthLabel(m)} ${w}`,
          type: "bar",
          barGap: 0,
          barMaxWidth: 14,
          emphasis: { focus: "series" },
          itemStyle: isD7 ? { color, decal: D7_DECAL } : { color },
          data,
        });
      });
    });

    const yName = `人均${kindLabelCN(kind)}流水（USD）`;

    chart.setOption(
      {
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
          backgroundColor: "rgba(15, 23, 42, 0.92)",
          borderWidth: 0,
          textStyle: { fontSize: 11 },
          formatter: (params) => {
            if (!params || !params.length) return "";
            const title = params[0].axisValueLabel;
            const lines = [`<strong>${title}</strong>`];
            params.forEach((p) => {
              lines.push(`${p.marker}${p.seriesName}：${formatUSD(p.data, 2)}`);
            });
            return lines.join("<br/>");
          },
        },
        legend: {
          type: "scroll",
          top: 4,
          left: 6,
          right: 6,
          textStyle: { fontSize: 11, color: "#475569" },
        },
        grid: { left: 54, right: 22, top: 36, bottom: 44, containLabel: false },
        xAxis: {
          type: "category",
          data: xCountries,
          axisTick: { show: false },
          axisLine: { lineStyle: { color: "rgba(148,163,184,0.6)" } },
          axisLabel: { color: "#334155", fontSize: 11 },
        },
        yAxis: {
          type: "value",
          name: yName,
          nameTextStyle: { color: "#64748b", fontSize: 11 },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: "rgba(148,163,184,0.22)" } },
          axisLabel: { color: "#64748b", fontSize: 11, formatter: (v) => formatUSD(v, 0) },
        },
        series,
      },
      true
    );
  }

  function renderLine() {
    if (!chart) return;

    const RAW = getRAW();
    const monthsSel = uniq(state.months).sort().slice(0, 3);
    const windowsSel = sortWindows(state.windows);
    const kind = state.kind;

    const countrySet = state.collapse.countries
      ? null
      : new Set(state.countries.map(normalizeCountry));
    const mediaSet = state.collapse.medias ? null : new Set(state.medias.map(normalizeMedia));
    const typeSet = state.collapse.productTypes
      ? null
      : new Set(state.productTypes.map(normalizeProductType));

    const fD0 = fieldsFor("D0", kind);
    const fD7 = fieldsFor("D7", kind);

    const datesSet = new Set();
    const buckets = new Map(); // key: date||baseKey -> {d0Flow,d0Users,d7Flow,d7Users}

    monthsSel.forEach((m) => {
      (RAW[m] || []).forEach((r) => {
        if (!r) return;

        const c0 = normalizeCountry(r.country);
        const m0 = normalizeMedia(r.media);
        const t0 = normalizeProductType(r.productType);

        if (countrySet && !countrySet.has(c0)) return;
        if (mediaSet && !mediaSet.has(m0)) return;
        if (typeSet && !typeSet.has(t0)) return;

        const date = String(r.date || "");
        if (!date) return;

        datesSet.add(date);

        const c = state.collapse.countries ? "ALL" : c0;
        const md = state.collapse.medias ? "ALL" : m0;
        const pt = state.collapse.productTypes ? "ALL" : t0;

        const baseKey = `${c}|${md}|${pt}`;
        const key = `${date}||${baseKey}`;

        let b = buckets.get(key);
        if (!b) {
          b = { d0Flow: 0, d0Users: 0, d7Flow: 0, d7Users: 0 };
          buckets.set(key, b);
        }

        b.d0Flow += toNum(r[fD0.flowField]);
        b.d0Users += toNum(r[fD0.userField]);
        b.d7Flow += toNum(r[fD7.flowField]);
        b.d7Users += toNum(r[fD7.userField]);
      });
    });

    const dates = Array.from(datesSet).sort();

    // baseKey 列表
    const baseKeysSet = new Set();
    buckets.forEach((_v, k) => {
      const parts = String(k).split("||");
      const baseKey = parts[1] || "";
      if (baseKey) baseKeysSet.add(baseKey);
    });
    const baseKeys = Array.from(baseKeysSet);

    function baseKeyRankCountry(c) {
      if (c === "ALL") return -1;
      const idx = FIXED_COUNTRY_ORDER.indexOf(c);
      return idx >= 0 ? idx : 999;
    }

    baseKeys.sort((a, b) => {
      const aa = a.split("|");
      const bb = b.split("|");

      const ca = aa[0] || "";
      const cb = bb[0] || "";
      const ra = baseKeyRankCountry(ca);
      const rb = baseKeyRankCountry(cb);
      if (ra !== rb) return ra - rb;
      if (ca !== cb) return ca.localeCompare(cb);

      const ma = aa[1] || "";
      const mb = bb[1] || "";
      if (ma !== mb) return ma.localeCompare(mb);

      const ta = aa[2] || "";
      const tb = bb[2] || "";
      return ta.localeCompare(tb);
    });

    const palette = getPalette();
    const series = [];

    // 同一 baseKey：D0/D7 同色，靠虚/实线区分
    baseKeys.forEach((bk, idx) => {
      const color = palette[idx % palette.length];

      windowsSel.forEach((w) => {
        const data = dates.map((d) => {
          const b = buckets.get(`${d}||${bk}`);
          if (!b) return null;
          return w === "D0" ? safeDiv(b.d0Flow, b.d0Users) : safeDiv(b.d7Flow, b.d7Users);
        });

        series.push({
          name: seriesNameFrom(bk, w),
          type: "line",
          data,
          smooth: false,
          showSymbol: false,
          connectNulls: true,
          emphasis: { focus: "series" },
          itemStyle: { color },
          lineStyle: { width: 2, type: w === "D0" ? "dashed" : "solid", color },
        });
      });
    });

    const yName = `人均${kindLabelCN(kind)}流水（USD）`;

    chart.setOption(
      {
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(15, 23, 42, 0.92)",
          borderWidth: 0,
          textStyle: { fontSize: 11 },
          axisPointer: { type: "line" },
          formatter: (params) => {
            if (!params || !params.length) return "";
            const title = params[0].axisValueLabel;
            const lines = [`<strong>${title}</strong>`];
            params.forEach((p) => {
              lines.push(`${p.marker}${p.seriesName}：${formatUSD(p.data, 2)}`);
            });
            return lines.join("<br/>");
          },
        },
        legend: {
          type: "scroll",
          bottom: 0,
          left: 6,
          right: 6,
          textStyle: { fontSize: 11, color: "#475569" },
        },
        grid: { left: 54, right: 22, top: 18, bottom: 56, containLabel: false },
        xAxis: {
          type: "category",
          data: dates,
          boundaryGap: false,
          axisTick: { show: false },
          axisLine: { lineStyle: { color: "rgba(148,163,184,0.6)" } },
          axisLabel: {
            color: "#334155",
            fontSize: 11,
            formatter: (v) => {
              const s = String(v || "");
              return s.length >= 10 ? s.slice(5) : s;
            },
          },
        },
        yAxis: {
          type: "value",
          name: yName,
          nameTextStyle: { color: "#64748b", fontSize: 11 },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: "rgba(148,163,184,0.22)" } },
          axisLabel: { color: "#64748b", fontSize: 11, formatter: (v) => formatUSD(v, 0) },
        },
        series,
      },
      true
    );
  }

  function th(text) {
    const el = document.createElement("th");
    el.textContent = text;
    return el;
  }

  function td(text, className) {
    const el = document.createElement("td");
    if (className) el.className = className;
    el.textContent = text;
    return el;
  }

  function renderTable() {
    if (!tableEl) return;

    const monthsSel = uniq(state.months).sort().slice(0, 3);
    const windowsSel = sortWindows(state.windows);
    const kind = state.kind;

    let rowCountries = sortCountries(uniq(state.countries.map(normalizeCountry)));
    if (state.collapse.countries) rowCountries = ["ALL"];

    const rowMedias = state.collapse.medias ? ["ALL"] : uniq(state.medias.map(normalizeMedia)).sort();
    const rowTypes = state.collapse.productTypes
      ? ["ALL"]
      : uniq(state.productTypes.map(normalizeProductType)).sort();

    const suffix = buildTitleSuffix();
    if (tableTitleEl)
      tableTitleEl.textContent = `当前筛选 · 人均${kindLabelCN(kind)}流水（月度汇总）${suffix}`;

    if (!monthsSel.length || !rowCountries.length) {
      tableEl.innerHTML = "<tbody><tr><td>无数据：请先在上方选择月份和国家</td></tr></tbody>";
      return;
    }

    const thead = document.createElement("thead");
    const trh = document.createElement("tr");

    trh.appendChild(th("国家"));
    if (!state.collapse.medias) trh.appendChild(th("媒体"));
    if (!state.collapse.productTypes) trh.appendChild(th("产品类型"));

    const colKeys = [];
    monthsSel.forEach((m) => {
      windowsSel.forEach((w) => {
        colKeys.push({ m, w });
        trh.appendChild(th(`${formatMonthLabel(m)} ${w} 人均${kindLabelCN(kind)}流水`));
      });
    });

    thead.appendChild(trh);

    const tbody = document.createElement("tbody");

    const cellCache = new Map();
    function getCell(monthKey, win, countryKey, mediaKey, typeKey) {
      const cacheKey = `${monthKey}|${win}|${countryKey}|${mediaKey}|${typeKey}`;
      if (cellCache.has(cacheKey)) return cellCache.get(cacheKey);

      const { flowField, userField } = fieldsFor(win, kind);

      const rows = filteredRowsForMonth(monthKey, (r) => {
        if (countryKey !== "ALL" && normalizeCountry(r.country) !== countryKey) return false;
        if (mediaKey !== "ALL" && normalizeMedia(r.media) !== mediaKey) return false;
        if (typeKey !== "ALL" && normalizeProductType(r.productType) !== typeKey) return false;
        return true;
      });

      let flow = 0;
      let users = 0;
      rows.forEach((r) => {
        flow += toNum(r[flowField]);
        users += toNum(r[userField]);
      });

      const v = safeDiv(flow, users);
      cellCache.set(cacheKey, v);
      return v;
    }

    rowCountries.forEach((c) => {
      rowMedias.forEach((m) => {
        rowTypes.forEach((t) => {
          const tr = document.createElement("tr");

          tr.appendChild(td(c));
          if (!state.collapse.medias) tr.appendChild(td(m));
          if (!state.collapse.productTypes) tr.appendChild(td(String(t).toUpperCase()));

          colKeys.forEach(({ m: monthKey, w }) => {
            const v = getCell(monthKey, w, c, m, t);
            tr.appendChild(td(v == null ? "-" : formatUSD(v, 2), "num"));
          });

          tbody.appendChild(tr);
        });
      });
    });

    tableEl.innerHTML = "";
    tableEl.appendChild(thead);
    tableEl.appendChild(tbody);
  }

  // --- state & init ---
  let opts = null;
  let state = null;
  let chart = null;

  let tableEl = null;
  let tableTitleEl = null;

  function resetState() {
    state = {
      view: "bar",
      months: pickDefaultMonths(opts.months),
      countries: (opts.countries || []).slice(),
      medias: (opts.medias || []).slice(),
      productTypes: (opts.productTypes || []).slice(),
      kind: "total", // total / sports / game
      windows: ["D0", "D7"],
      collapse: { countries: false, medias: false, productTypes: false },
    };
  }

  function ensureNonEmpty() {
    if (!state.months.length) state.months = pickDefaultMonths(opts.months);
    if (!state.countries.length) state.countries = (opts.countries || []).slice();
    if (!state.medias.length) state.medias = (opts.medias || []).slice();
    if (!state.productTypes.length) state.productTypes = (opts.productTypes || []).slice();
    if (!state.windows.length) state.windows = ["D0"];
    if (!state.kind) state.kind = "total";
  }

  function renderAll() {
    ensureNonEmpty();

    renderRadioGroup(
      "betflow-view",
      "betflowView",
      [
        { value: "bar", label: "柱状（月度）" },
        { value: "line", label: "折线（日级）" },
      ],
      state.view,
      (v) => {
        state.view = v;
        renderAll();
      }
    );

    renderRadioGroup(
      "betflow-kind",
      "betflowKind",
      [
        { value: "total", label: "总流水" },
        { value: "sports", label: "体育流水" },
        { value: "game", label: "游戏流水" },
      ],
      state.kind,
      (v) => {
        state.kind = v;
        renderAll();
      }
    );

    renderChipGroup({
      containerId: "betflow-months",
      values: (opts.months || []).slice().sort(),
      stateArray: state.months,
      max: 3,
      getLabel: (m) => formatMonthLabel(m),
      allowEmpty: false,
    });

    renderChipGroup({
      containerId: "betflow-countries",
      values: sortCountries((opts.countries || []).map(normalizeCountry)),
      stateArray: state.countries,
      getLabel: (c) => String(c).toUpperCase(),
      allowEmpty: false,
      specialAllNoBreakdown: true,
      collapseKey: "countries",
    });

    renderChipGroup({
      containerId: "betflow-medias",
      values: (opts.medias || []).map(normalizeMedia).sort(),
      stateArray: state.medias,
      getLabel: (m) => String(m).toUpperCase(),
      allowEmpty: false,
      specialAllNoBreakdown: true,
      collapseKey: "medias",
    });

    renderChipGroup({
      containerId: "betflow-productTypes",
      values: (opts.productTypes || []).map(normalizeProductType).sort(),
      stateArray: state.productTypes,
      getLabel: (p) => String(p).toUpperCase(),
      allowEmpty: false,
      specialAllNoBreakdown: true,
      collapseKey: "productTypes",
    });

    renderChipGroup({
      containerId: "betflow-windows",
      values: ["D0", "D7"],
      stateArray: state.windows,
      getLabel: (w) => w,
      allowEmpty: false,
    });

    if (state.view === "line") renderLine();
    else renderBar();

    renderTable();
  }

  function init() {
    injectStylesOnce();

    const card = getDom(CARD_ID);
    if (!card) return;

    opts = buildOptionsFromRAW();

    ensureHeaderFilters(card);
    ensureTableSection(card);

    tableEl = getDom("table-betflow");
    tableTitleEl = getDom("table-title-betflow");

    const chartEl = getDom(CHART_ID);
    if (!chartEl || !window.echarts) return;

    chart = window.echarts.getInstanceByDom(chartEl) || window.echarts.init(chartEl);

    const pd = window.PaidDashboard;
    if (pd && typeof pd.registerChart === "function") pd.registerChart(chart);

    resetState();

    const btn = getDom("betflow-btn-reset");
    if (btn && !btn.dataset.bound) {
      btn.dataset.bound = "1";
      btn.addEventListener("click", () => {
        resetState();
        renderAll();
      });
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
