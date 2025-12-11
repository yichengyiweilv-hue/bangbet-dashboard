/**
 * 模块1：买量注册数
 * 文件：paid-monthly/paid-module-registrations.js
 *
 * 功能：
 * - 模块内筛选器：月份（最多3）、国家、媒体、产品类型、视图（柱状/月度 or 折线/日度）
 * - 国家/媒体/产品类型均提供“全选但不区分”：选中后默认全选，但图与表不再按该维度拆分
 * - 图下方数据表：按筛选月份输出 X月花费 / X月注册数 / X月注册单价（注册单价=花费/注册数）
 * - 表下方数据分析：从 paid-analytics.js 读取 key=reg 的多月份文案
 */
(function () {
  if (!window.PaidDashboard || !window.echarts) {
    console.warn("[paid-module-registrations] Missing PaidDashboard or echarts");
    return;
  }

  const RAW = window.RAW_PAID_BY_MONTH || {};
  const ALL_MONTHS =
    (window.PaidDashboard.getMonths && window.PaidDashboard.getMonths()) || Object.keys(RAW).sort();

  // ===== Utils =====
  const PD = window.PaidDashboard;

  const COLORS = PD.COLORS || ["#2563eb", "#16a34a", "#f97316", "#7c3aed", "#ef4444", "#0f766e"];
  const COUNTRY_ORDER = ["GH", "KE", "NG", "TZ"];

  const fmtInt = PD.formatInteger || ((v) => (v == null ? "-" : String(v)));
  const fmtUSD = PD.formatUSD || ((v) => (v == null ? "-" : String(v)));
  const safeDiv = PD.safeDiv || ((a, b) => (b ? a / b : null));
  const monthLabel = PD.formatMonthLabel || ((m) => m);

  function uniq(arr) {
    return Array.from(new Set((arr || []).filter((x) => x != null && x !== "")));
  }

  function asNumber(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  function ensureStyleOnce() {
    const id = "paid-reg-table-style";
    if (document.getElementById(id)) return;

    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      /* ===== paid-registrations: table (module injected) ===== */
      .chart-table-section{ margin-top:6px; padding-top:6px; border-top:1px dashed rgba(148,163,184,0.5); }
      .chart-table-title{ font-size:11px; color: var(--text-sub); margin-bottom:4px; }
      .chart-table-wrapper{ max-height:260px; overflow:auto; border-radius:6px; border:1px solid rgba(209,213,219,0.9); background:#fff; }
      table.chart-table{ width:100%; border-collapse:collapse; font-size:11px; }
      .chart-table thead th, .chart-table tbody td{
        padding:4px 8px; border-bottom:1px solid #f3f4f6; white-space:nowrap;
        text-align:center; font-variant-numeric: tabular-nums;
      }
      .chart-table thead th{
        position:sticky; top:0; z-index:1; background:#f9fafb; font-weight:500; color: var(--text-sub);
      }
      .chart-table tbody tr:nth-child(odd) td{ background:#fcfcff; }
      .chart-table tbody tr:hover td{ background:#eef2ff; }
    `;
    document.head.appendChild(style);
  }

  function collectDimensionOptions() {
    const countries = new Set();
    const medias = new Set();
    const productTypes = new Set();

    ALL_MONTHS.forEach((m) => {
      const rows = Array.isArray(RAW[m]) ? RAW[m] : [];
      rows.forEach((r) => {
        if (r && r.country) countries.add(r.country);
        if (r && r.media) medias.add(r.media);
        if (r && r.productType) productTypes.add(r.productType);
      });
    });

    function sortCountries(list) {
      const arr = list.slice();
      arr.sort((a, b) => {
        const ia = COUNTRY_ORDER.indexOf(a);
        const ib = COUNTRY_ORDER.indexOf(b);
        const ra = ia === -1 ? 999 : ia;
        const rb = ib === -1 ? 999 : ib;
        if (ra !== rb) return ra - rb;
        return String(a).localeCompare(String(b));
      });
      return arr;
    }

    function sortProductTypes(list) {
      const rank = { app: 0, APP: 0, h5: 1, H5: 1 };
      const arr = list.slice();
      arr.sort((a, b) => {
        const ra = rank[a] != null ? rank[a] : 99;
        const rb = rank[b] != null ? rank[b] : 99;
        if (ra !== rb) return ra - rb;
        return String(a).localeCompare(String(b));
      });
      return arr;
    }

    return {
      countries: sortCountries(Array.from(countries)),
      medias: Array.from(medias).sort((a, b) => String(a).localeCompare(String(b))),
      productTypes: sortProductTypes(Array.from(productTypes)),
    };
  }

  function hashString(str) {
    const s = String(str || "");
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h >>> 0;
  }

  function getColorForMonth(monthKey) {
    const idx = ALL_MONTHS.indexOf(monthKey);
    if (idx >= 0) return COLORS[idx % COLORS.length];
    return COLORS[hashString(monthKey) % COLORS.length];
  }

    // 新增：折线图专用颜色生成（保证一张图内不重复）
  function getLineColorByIndex(index, totalCount) {
    const t = totalCount && totalCount > 0 ? totalCount : 1;
    // 0 ~ 330 度之间均匀分布色相，避免完全重合
    const hue = Math.round((index / t) * 330);
    const saturation = 70;
    const lightness = 50;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }
  function getColorForSeriesKey(key) {
    return COLORS[hashString(key) % COLORS.length];
  }

  function yFormatter(v) {
    if (v == null || !isFinite(v)) return "-";
    return v >= 1000 ? (v / 1000).toFixed(1) + "k" : String(Math.round(v));
  }

  function toggleInArray(arr, value) {
    const i = arr.indexOf(value);
    if (i === -1) arr.push(value);
    else arr.splice(i, 1);
  }

  function normalizeSelected(arr, all) {
    const sel = uniq(arr);
    if (!sel.length) return all.slice();
    const setAll = new Set(all);
    return sel.filter((x) => setAll.has(x));
  }

  function sortedMonths(selMonths) {
    return selMonths.slice().sort((a, b) => String(a).localeCompare(String(b)));
  }

  function createChip(labelText, checked, disabled, onChange) {
    const label = document.createElement("label");
    label.className = "filter-chip" + (checked ? " filter-chip-active" : "");

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = !!checked;
    input.disabled = !!disabled;

    input.addEventListener("change", (e) => {
      onChange && onChange(e.target.checked);
    });

    label.appendChild(input);
    label.appendChild(document.createTextNode(labelText));
    return label;
  }

  function renderMonthChips(container, months, state, onUpdate) {
    container.innerHTML = "";
    months.forEach((m) => {
      const checked = state.months.includes(m);
      const chip = createChip(m, checked, false, () => {
        toggleInArray(state.months, m);

        // enforce: 至少 1 个月；最多 3 个月
        if (state.months.length === 0) state.months.push(m);
        if (state.months.length > 3) toggleInArray(state.months, m);

        renderMonthChips(container, months, state, onUpdate);
        onUpdate();
      });
      container.appendChild(chip);
    });
  }

  function renderDimChips(container, opts) {
    const { allValues, stateArray, getNoSplitFlag, setNoSplit, labelFn, onUpdate } = opts;

    const noSplitFlag =
      typeof getNoSplitFlag === "function" ? !!getNoSplitFlag() : !!opts.noSplitFlag;

    container.innerHTML = "";

    // Special option: 全选但不区分
    const specialChip = createChip("全选但不区分", !!noSplitFlag, false, (checked) => {
      setNoSplit(checked);
      renderDimChips(container, opts);
      onUpdate();
    });
    container.appendChild(specialChip);

    // Value chips
    allValues.forEach((v) => {
      const checked = noSplitFlag ? true : stateArray.includes(v);
      const disabled = !!noSplitFlag;

      const chip = createChip(labelFn(v), checked, disabled, () => {
        toggleInArray(stateArray, v);

        // enforce: 至少 1 个（非 no-split 情况下）
        if (!stateArray.length) stateArray.push(v);

        renderDimChips(container, opts);
        onUpdate();
      });

      container.appendChild(chip);
    });
  }

  function buildMonthlyAgg(params) {
    const {
      months,
      countryFilterSet,
      mediaFilterSet,
      typeFilterSet,
      noSplitCountry,
      noSplitMedia,
      noSplitType,
    } = params;

    const map = new Map(); // key -> {country, media, productType, byMonth:{month:{spent, reg}}}

    months.forEach((m) => {
      const rows = Array.isArray(RAW[m]) ? RAW[m] : [];
      rows.forEach((r) => {
        if (!r) return;

        const cRaw = r.country;
        const mRaw = r.media;
        const pRaw = r.productType;

        if (cRaw && !countryFilterSet.has(cRaw)) return;
        if (mRaw && !mediaFilterSet.has(mRaw)) return;
        if (pRaw && !typeFilterSet.has(pRaw)) return;

        const cKey = noSplitCountry ? "ALL" : cRaw || "UNKNOWN";
        const mKey = noSplitMedia ? "ALL" : mRaw || "UNKNOWN";
        const pKey = noSplitType ? "ALL" : pRaw || "UNKNOWN";

        const key = cKey + "||" + mKey + "||" + pKey;
        if (!map.has(key)) map.set(key, { country: cKey, media: mKey, productType: pKey, byMonth: {} });

        const entry = map.get(key);
        if (!entry.byMonth[m]) entry.byMonth[m] = { spent: 0, reg: 0 };

        entry.byMonth[m].spent += asNumber(r.spent);
        entry.byMonth[m].reg += asNumber(r.registration);
      });
    });

    return map;
  }

  function buildDailySeries(params) {
    const {
      months,
      countryFilterSet,
      mediaFilterSet,
      typeFilterSet,
      noSplitCountry,
      noSplitMedia,
      noSplitType,
    } = params;

    const dateSet = new Set();
    const map = new Map(); // key -> {country, media, productType, dateMap: Map(date->reg)}

    months.forEach((m) => {
      const rows = Array.isArray(RAW[m]) ? RAW[m] : [];
      rows.forEach((r) => {
        if (!r) return;

        const cRaw = r.country;
        const mRaw = r.media;
        const pRaw = r.productType;

        if (cRaw && !countryFilterSet.has(cRaw)) return;
        if (mRaw && !mediaFilterSet.has(mRaw)) return;
        if (pRaw && !typeFilterSet.has(pRaw)) return;

        const date = r.date;
        if (!date) return;

        const cKey = noSplitCountry ? "ALL" : cRaw || "UNKNOWN";
        const mKey = noSplitMedia ? "ALL" : mRaw || "UNKNOWN";
        const pKey = noSplitType ? "ALL" : pRaw || "UNKNOWN";

        const key = cKey + "||" + mKey + "||" + pKey;
        if (!map.has(key)) map.set(key, { country: cKey, media: mKey, productType: pKey, dateMap: new Map() });

        const entry = map.get(key);
        entry.dateMap.set(date, (entry.dateMap.get(date) || 0) + asNumber(r.registration));
        dateSet.add(date);
      });
    });

    const dates = Array.from(dateSet).sort((a, b) => String(a).localeCompare(String(b)));
    const dateIndex = new Map();
    dates.forEach((d, i) => dateIndex.set(d, i));

    const entries = Array.from(map.entries()).sort((a, b) => {
      const aa = a[1];
      const bb = b[1];

      const ca = aa.country;
      const cb = bb.country;
      const ia = ca === "ALL" ? -1 : COUNTRY_ORDER.indexOf(ca);
      const ib = cb === "ALL" ? -1 : COUNTRY_ORDER.indexOf(cb);
      const ra = ia === -1 ? 999 : ia;
      const rb = ib === -1 ? 999 : ib;
      if (ra !== rb) return ra - rb;

      const ma = String(aa.media || "");
      const mb = String(bb.media || "");
      if (ma !== mb) return ma.localeCompare(mb);

      const pa = String(aa.productType || "");
      const pb = String(bb.productType || "");
      return pa.localeCompare(pb);
    });

       const totalSeries = entries.length;

    const series = entries.map(([key, entry], index) => {
      const data = new Array(dates.length).fill(null);
      entry.dateMap.forEach((v, d) => {
        const idx = dates.indexOf(d);
        if (idx !== -1 && v != null) data[idx] = v;
      });

      const nameParts = [];
      nameParts.push(noSplitCountry ? "ALL" : entry.country);
      if (!noSplitMedia) nameParts.push(entry.media);
      if (!noSplitType) nameParts.push(entry.productType);

      const name = nameParts.join(" · ");
      // 关键修改：按系列索引生成颜色，而不是按 key hash
      const color = getLineColorByIndex(index, totalSeries);

      return {
        name,
        type: "line",
        data,
        showSymbol: false,
        smooth: false,
        connectNulls: true,
        lineStyle: { width: 2, color },
        itemStyle: { color },
      };
    });

    return { dates, series };
  }

  function renderBar(chart, categories, months, aggByMonth) {
    const series = months.map((m) => {
      const color = getColorForMonth(m);
      const data = categories.map((c) => (aggByMonth[m] && aggByMonth[m][c] ? aggByMonth[m][c] : 0));
      return { name: m, type: "bar", data, barMaxWidth: 22, itemStyle: { color, borderRadius: [6, 6, 0, 0] } };
    });

    chart.setOption(
      {
        tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, valueFormatter: (val) => (val == null ? "" : fmtInt(val) + "人") },
        legend: { type: "scroll" },
        grid: { left: 40, right: 20, top: 40, bottom: 40 },
        xAxis: { type: "category", data: categories },
        yAxis: { type: "value", name: "注册数", axisLabel: { formatter: (v) => yFormatter(v) } },
        series,
      },
      true
    );
  }

  function renderLine(chart, dates, series) {
    chart.setOption(
      {
        tooltip: { trigger: "axis", valueFormatter: (val) => (val == null ? "" : fmtInt(val) + "人") },
        legend: { type: "scroll" },
        grid: { left: 40, right: 20, top: 40, bottom: 40 },
        xAxis: { type: "category", data: dates, axisLabel: { formatter: (v) => String(v).slice(5) } },
        yAxis: { type: "value", name: "注册数", axisLabel: { formatter: (v) => yFormatter(v) } },
        series,
      },
      true
    );
  }

  function createTableSection(cardEl) {
    const existing = cardEl.querySelector("#paid-reg-table-section");
    if (existing) return existing;

    const section = document.createElement("div");
    section.className = "chart-table-section";
    section.id = "paid-reg-table-section";

    const title = document.createElement("div");
    title.className = "chart-table-title";
    title.id = "paid-reg-table-title";
    title.textContent = "当前筛选 · 买量注册数（月度汇总）";

    const wrapper = document.createElement("div");
    wrapper.className = "chart-table-wrapper";

    const table = document.createElement("table");
    table.className = "chart-table";
    table.id = "table-paid-registrations";

    wrapper.appendChild(table);
    section.appendChild(title);
    section.appendChild(wrapper);

    return section;
  }

  function renderTable(tableEl, params) {
    const { months, rows, showMedia, showType } = params;

    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");

    const headers = ["国家"];
    if (showMedia) headers.push("媒体");
    if (showType) headers.push("产品类型");

    months.forEach((m) => {
      const ml = monthLabel(m);
      headers.push(ml + "花费");
      headers.push(ml + "注册数");
      headers.push(ml + "注册单价");
    });

    headers.forEach((h) => {
      const th = document.createElement("th");
      th.textContent = h;
      th.style.textAlign = "center";
      trHead.appendChild(th);
    });

    thead.appendChild(trHead);

    const tbody = document.createElement("tbody");

    rows.forEach((r) => {
      const tr = document.createElement("tr");

      const dimCells = [r.country];
      if (showMedia) dimCells.push(r.media);
      if (showType) dimCells.push(r.productType);

      dimCells.forEach((v) => {
        const td = document.createElement("td");
        td.textContent = v;
        td.style.textAlign = "center";
        tr.appendChild(td);
      });

      months.forEach((m) => {
        const agg = (r.byMonth && r.byMonth[m]) || { spent: 0, reg: 0 };
        const spent = asNumber(agg.spent);
        const reg = asNumber(agg.reg);
        const cpa = safeDiv(spent, reg);

        const tdSpent = document.createElement("td");
        tdSpent.textContent = fmtUSD(spent);
        tdSpent.style.textAlign = "center";
        tr.appendChild(tdSpent);

        const tdReg = document.createElement("td");
        tdReg.textContent = fmtInt(reg);
        tdReg.style.textAlign = "center";
        tr.appendChild(tdReg);

        const tdCpa = document.createElement("td");
        tdCpa.textContent = cpa == null ? "-" : fmtUSD(cpa);
        tdCpa.style.textAlign = "center";
        tr.appendChild(tdCpa);
      });

      tbody.appendChild(tr);
    });

    tableEl.innerHTML = "";
    tableEl.appendChild(thead);
    tableEl.appendChild(tbody);
  }

  function renderInsights(summaryEl, months) {
    const TEXT = window.PAID_ANALYSIS_TEXT || window.ANALYSIS_TEXT || {};
    const key = "reg";

    // 清空 core 自动插入的按钮/textarea
    summaryEl.innerHTML = "";

    // 收一收 padding，避免展示位太空
    summaryEl.style.paddingTop = "6px";
    summaryEl.style.paddingBottom = "10px";

    const wrap = document.createElement("div");
    wrap.style.display = "grid";
    wrap.style.gap = "6px";

    months.forEach((m) => {
      const item = document.createElement("div");
      item.style.border = "1px solid rgba(148, 163, 184, 0.35)";
      item.style.borderRadius = "12px";
      item.style.background = "rgba(249,250,251,0.9)";
      item.style.padding = "6px 10px";

      const title = document.createElement("div");
      title.style.fontSize = "11px";
      title.style.fontWeight = "600";
      title.textContent = monthLabel(m) + " 数据分析";

      const body = document.createElement("div");
      body.style.fontSize = "11px";
      body.style.lineHeight = "1.6";
      body.style.marginTop = "4px";
      body.style.whiteSpace = "pre-wrap";
      body.style.color = "var(--text-sub)";

      const content =
        TEXT && TEXT[key] && typeof TEXT[key][m] === "string" && TEXT[key][m].trim()
          ? TEXT[key][m].trim()
          : "暂未填写该月份的数据分析文案。";

      body.textContent = content;

      item.appendChild(title);
      item.appendChild(body);
      wrap.appendChild(item);
    });

    if (!months.length) {
      const empty = document.createElement("div");
      empty.style.fontSize = "11px";
      empty.style.color = "var(--text-sub)";
      empty.textContent = "当前未选择月份；请在上方筛选器勾选月份。";
      wrap.appendChild(empty);
    }

    summaryEl.appendChild(wrap);
  }

  function makeTableTitle(state, mediasSel, typesSel) {
    function labelFor(list, noSplit, allLabel) {
      if (noSplit) return allLabel + "（不区分）";
      return (list && list.length ? list : []).join("+") || allLabel;
    }
    const mediaText = labelFor(mediasSel, state.noSplit.media, "全部媒体");
    const typeText = labelFor(typesSel, state.noSplit.productType, "全部类型");
    return "当前筛选 · 买量注册数（月度汇总）" + "（" + mediaText + "，" + typeText + "）";
  }

  // ===== Module init =====
  PD.registerModule("paid-registrations", function initPaidRegistrations() {
    ensureStyleOnce();

    const card = document.getElementById("card-paid-registrations");
    const chartDom = document.getElementById("chart-paid-registrations");
    if (!card || !chartDom) return;

    const controls = card.querySelector(".chart-controls");
    const summaryEl = card.querySelector('.chart-summary[data-analysis-key="reg"]');

    const { countries: ALL_COUNTRIES, medias: ALL_MEDIAS, productTypes: ALL_TYPES } = collectDimensionOptions();

    // default state
    const state = {
      view: "bar",
      months: ALL_MONTHS.slice(-2),
      countries: ALL_COUNTRIES.slice(),
      medias: ALL_MEDIAS.slice(),
      productTypes: ALL_TYPES.slice(),
      noSplit: { country: false, media: false, productType: false },
      _prev: { country: null, media: null, productType: null },
    };

    function setNoSplit(dim, on) {
      const allByDim = dim === "country" ? ALL_COUNTRIES : dim === "media" ? ALL_MEDIAS : ALL_TYPES;
      const arrKey = dim === "country" ? "countries" : dim === "media" ? "medias" : "productTypes";
      const arrRef = state[arrKey]; // keep reference

      if (on) {
        state._prev[dim] = arrRef.slice();
        state.noSplit[dim] = true;
        arrRef.splice(0, arrRef.length, ...allByDim);
      } else {
        state.noSplit[dim] = false;
        const prev = Array.isArray(state._prev[dim]) ? state._prev[dim] : null;
        const next = prev && prev.length ? prev.slice() : allByDim.slice();
        arrRef.splice(0, arrRef.length, ...next);
      }
    }

    // ===== UI mount =====
    if (controls && !document.getElementById("paid-reg-months")) {
      const ui = document.createElement("div");
      ui.innerHTML = `
        <div class="chart-mini-filter">
          <span class="chart-mini-label">视图：</span>
          <div class="chart-mini-radio">
            <label><input type="radio" name="paid-reg-view" value="bar" checked />柱状（月度）</label>
            <label><input type="radio" name="paid-reg-view" value="line" />折线（日度）</label>
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
          <span class="chart-mini-label">产品类型：</span>
          <div class="chart-mini-chips" id="paid-reg-types"></div>
        </div>
      `;
      controls.appendChild(ui);
    }

    const monthsEl = document.getElementById("paid-reg-months");
    const countriesEl = document.getElementById("paid-reg-countries");
    const mediasEl = document.getElementById("paid-reg-medias");
    const typesEl = document.getElementById("paid-reg-types");

    const viewRadios = card.querySelectorAll('input[name="paid-reg-view"]');
    viewRadios.forEach((r) => {
      r.addEventListener("change", () => {
        if (!r.checked) return;
        state.view = r.value === "line" ? "line" : "bar";
        update();
      });
    });

    // ===== Chart init =====
    const chart = window.echarts.init(chartDom);
    PD.registerChart(chart);

    // ===== Table mount (insert between chart and summary) =====
    const tableSection = createTableSection(card);
    if (summaryEl && summaryEl.parentElement) {
      if (!tableSection.parentElement) summaryEl.parentElement.insertBefore(tableSection, summaryEl);
    } else {
      card.appendChild(tableSection);
    }

    const tableTitleEl = document.getElementById("paid-reg-table-title");
    const tableEl = document.getElementById("table-paid-registrations");

    function update() {
      const monthsSel = normalizeSelected(state.months, ALL_MONTHS).slice(0, 3);
      const months = sortedMonths(monthsSel);

      const countriesSel = normalizeSelected(state.countries, ALL_COUNTRIES);
      const mediasSel = normalizeSelected(state.medias, ALL_MEDIAS);
      const typesSel = normalizeSelected(state.productTypes, ALL_TYPES);

      const countryFilterSet = new Set(state.noSplit.country ? ALL_COUNTRIES : countriesSel);
      const mediaFilterSet = new Set(state.noSplit.media ? ALL_MEDIAS : mediasSel);
      const typeFilterSet = new Set(state.noSplit.productType ? ALL_TYPES : typesSel);

      // ===== Chart =====
      if (state.view === "line") {
        const { dates, series } = buildDailySeries({
          months,
          countryFilterSet,
          mediaFilterSet,
          typeFilterSet,
          noSplitCountry: state.noSplit.country,
          noSplitMedia: state.noSplit.media,
          noSplitType: state.noSplit.productType,
        });
        renderLine(chart, dates, series);
      } else {
        const categories = state.noSplit.country ? ["ALL"] : countriesSel.slice();
        categories.sort((a, b) => {
          const ia = COUNTRY_ORDER.indexOf(a);
          const ib = COUNTRY_ORDER.indexOf(b);
          const ra = ia === -1 ? 999 : ia;
          const rb = ib === -1 ? 999 : ib;
          if (ra !== rb) return ra - rb;
          return String(a).localeCompare(String(b));
        });

        const aggByMonth = {};
        months.forEach((m) => {
          const sums = {};
          const rows = Array.isArray(RAW[m]) ? RAW[m] : [];
          rows.forEach((r) => {
            if (!r) return;
            const cRaw = r.country;
            const mRaw = r.media;
            const pRaw = r.productType;

            if (cRaw && !countryFilterSet.has(cRaw)) return;
            if (mRaw && !mediaFilterSet.has(mRaw)) return;
            if (pRaw && !typeFilterSet.has(pRaw)) return;

            const cat = state.noSplit.country ? "ALL" : cRaw || "UNKNOWN";
            sums[cat] = (sums[cat] || 0) + asNumber(r.registration);
          });
          aggByMonth[m] = sums;
        });

        renderBar(chart, categories, months, aggByMonth);
      }

      // ===== Table =====
      const monthlyMap = buildMonthlyAgg({
        months,
        countryFilterSet,
        mediaFilterSet,
        typeFilterSet,
        noSplitCountry: state.noSplit.country,
        noSplitMedia: state.noSplit.media,
        noSplitType: state.noSplit.productType,
      });

      const rows = Array.from(monthlyMap.values());
      rows.sort((a, b) => {
        const ca = a.country;
        const cb = b.country;

        const ia = ca === "ALL" ? -1 : COUNTRY_ORDER.indexOf(ca);
        const ib = cb === "ALL" ? -1 : COUNTRY_ORDER.indexOf(cb);
        const ra = ia === -1 ? 999 : ia;
        const rb = ib === -1 ? 999 : ib;
        if (ra !== rb) return ra - rb;

        const ma = String(a.media || "");
        const mb = String(b.media || "");
        if (ma !== mb) return ma.localeCompare(mb);

        const pa = String(a.productType || "");
        const pb = String(b.productType || "");
        return pa.localeCompare(pb);
      });

      const showMedia = !state.noSplit.media;
      const showType = !state.noSplit.productType;

      if (tableTitleEl) tableTitleEl.textContent = makeTableTitle(state, mediasSel, typesSel);
      if (tableEl) renderTable(tableEl, { months, rows, showMedia, showType });

      // ===== Insights =====
      if (summaryEl) renderInsights(summaryEl, months);
    }

    // render filters
    if (monthsEl) renderMonthChips(monthsEl, ALL_MONTHS, state, update);

    if (countriesEl)
      renderDimChips(countriesEl, {
        allValues: ALL_COUNTRIES,
        stateArray: state.countries,
        getNoSplitFlag: () => state.noSplit.country,
        setNoSplit: (on) => setNoSplit("country", on),
        labelFn: (v) => v,
        onUpdate: update,
      });

    if (mediasEl)
      renderDimChips(mediasEl, {
        allValues: ALL_MEDIAS,
        stateArray: state.medias,
        getNoSplitFlag: () => state.noSplit.media,
        setNoSplit: (on) => setNoSplit("media", on),
        labelFn: (v) => v,
        onUpdate: update,
      });

    if (typesEl)
      renderDimChips(typesEl, {
        allValues: ALL_TYPES,
        stateArray: state.productTypes,
        getNoSplitFlag: () => state.noSplit.productType,
        setNoSplit: (on) => setNoSplit("productType", on),
        labelFn: (v) => v,
        onUpdate: update,
      });

    // initial paint
    update();
  });
})();
