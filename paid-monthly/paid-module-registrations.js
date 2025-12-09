/**
 * paid-module-registrations.js
 * ------------------------------------------------------------
 * 模块：买量注册数（registration）& 注册单价（CPA）
 *
 * 数据源：window.RAW_PAID_BY_MONTH
 * 粒度：date(UTC+0) × country  ×  media  ×  productType
 *
 * 指标：
 * - 注册数 = sum(registration)
 * - 注册单价（CPA）= sum(spent) / sum(registration)   (USD 等值)
 *
 * 交互：
 * - 视图：柱状（月度汇总）/ 折线（日级）
 * - 月份：最多选 3 个
 * - 国家/媒体/产品形态：多选，且支持“全选但不区分”（等价全选，但图/表聚合不拆维度）
 *
 * 容器：
 * - chart-paid-registrations（index.html 已有）
 * - reg-view / reg-months / reg-countries / reg-medias / reg-productTypes（若无，本脚本会在 card-paid-registrations 内自动创建）
 * - table-title-paid-registrations / table-paid-registrations（若无，本脚本会自动创建）
 */

(function () {
  const MODULE_KEY = "registrations";
  const FIXED_COUNTRY_ORDER = ["GH", "KE", "NG", "TZ"];

  const FALLBACK_COLORS = [
    "#2563eb",
    "#16a34a",
    "#f97316",
    "#7c3aed",
    "#ef4444",
    "#0f766e",
    "#0ea5e9",
    "#db2777",
    "#84cc16",
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
    return Array.from(
      new Set((arr || []).filter((v) => v !== undefined && v !== null))
    );
  }

  function setArray(target, values) {
    target.length = 0;
    (values || []).forEach((v) => target.push(v));
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

  function sortCountries(list) {
    const order = new Map();
    FIXED_COUNTRY_ORDER.forEach((c, i) => order.set(c, i));

    return (list || [])
      .slice()
      .sort((a, b) => {
        const aa = normalizeCountry(a);
        const bb = normalizeCountry(b);
        const ia = order.has(aa) ? order.get(aa) : 1e9;
        const ib = order.has(bb) ? order.get(bb) : 1e9;
        if (ia !== ib) return ia - ib;
        return aa.localeCompare(bb);
      });
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

    // 需求：只展示 GH/KE/NG/TZ，顺序固定
    const countries = sortCountries(Array.from(cSet)).filter(
      (c) => FIXED_COUNTRY_ORDER.indexOf(c) !== -1
    );
    const medias = Array.from(mSet).sort();
    const productTypes = Array.from(pSet).sort();

    return { months, countries, medias, productTypes };
  }

  function pickDefaultMonths(allMonths) {
    const months = (allMonths || []).slice();
    if (!months.length) return [];
    // 默认最近 2 个月（不够就取 1 个）
    return months.slice(Math.max(0, months.length - 2));
  }

  function ensureNonEmpty(state, opts) {
    if (!state.months.length) state.months = pickDefaultMonths(opts.months);
    if (!state.months.length) state.months = (opts.months || []).slice(-1);

    if (!state.countries.length) state.countries = (opts.countries || []).slice();
    if (!state.medias.length) state.medias = (opts.medias || []).slice();
    if (!state.productTypes.length)
      state.productTypes = (opts.productTypes || []).slice();
  }

  function safeDiv(a, b) {
    const na = Number(a);
    const nb = Number(b);
    if (!isFinite(na) || !isFinite(nb) || nb === 0) return null;
    return na / nb;
  }

  function formatMonthLabel(monthKey) {
    const m = String(monthKey || "");
    const mm = m.split("-")[1];
    if (!mm) return m;
    const n = parseInt(mm, 10);
    if (!isFinite(n)) return m;
    return `${n}月`;
  }

  function formatInteger(v) {
    if (v == null || !isFinite(v)) return "-";
    return Math.round(v).toLocaleString();
  }

  function formatUSD(v, digits) {
    if (v == null || !isFinite(v)) return "-";
    const d = Number.isFinite(Number(digits))
      ? Math.max(0, Math.min(6, Number(digits)))
      : 2;
    return Number(v).toLocaleString(undefined, {
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    });
  }

  function sumFields(rows, fields) {
    const out = {};
    (fields || []).forEach((f) => (out[f] = 0));

    (rows || []).forEach((r) => {
      if (!r) return;
      (fields || []).forEach((f) => {
        const v = Number(r[f]);
        if (isFinite(v)) out[f] += v;
      });
    });

    return out;
  }

  function injectStylesOnce() {
    const STYLE_ID = "paid-registrations-module-style";
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .chart-filter-panel{
        margin-top: 10px;
        padding: 10px 12px;
        border-radius: 14px;
        border: 1px solid rgba(148, 163, 184, 0.45);
        background: rgba(255, 255, 255, 0.6);
        display: grid;
        gap: 8px;
      }
      .chart-filter-panel .hero-filter-row{
        grid-template-columns: 68px minmax(0, 1fr);
      }
      .chart-filter-panel .hero-filter-row .label{
        font-size: 11px;
        color: var(--text-sub, #475569);
        line-height: 22px;
      }

      .filter-chip.filter-chip-special{ border-style: dashed; }

      .chart-table-section{
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px dashed rgba(148, 163, 184, 0.5);
      }
      .chart-table-title{
        font-size: 11px;
        color: var(--text-sub, #475569);
        margin-bottom: 6px;
      }
      .chart-table-wrapper{
        max-height: 320px;
        overflow: auto;
        border-radius: 10px;
        border: 1px solid rgba(148, 163, 184, 0.45);
        background: rgba(255,255,255,0.85);
      }
      .chart-table{
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        font-size: 11px;
      }
      .chart-table th{
        position: sticky;
        top: 0;
        z-index: 1;
        background: rgba(241, 245, 249, 0.98);
        border-bottom: 1px solid rgba(148, 163, 184, 0.45);
        padding: 8px 10px;
        text-align: left;
        white-space: nowrap;
      }
      .chart-table td{
        padding: 8px 10px;
        border-bottom: 1px solid rgba(148, 163, 184, 0.28);
        color: var(--text, #0f172a);
        white-space: nowrap;
      }
      .chart-table tbody tr:nth-child(2n) td{
        background: rgba(248, 250, 252, 0.6);
      }
      .chart-table td.num,
      .chart-table th.num{
        text-align: right;
        font-variant-numeric: tabular-nums;
      }
    `;
    document.head.appendChild(style);
  }

  function ensureContainers(sectionEl, chartEl) {
    if (!sectionEl || !chartEl) return;

    // 1) filter panel
    if (!getDom("reg-filter-panel") && !getDom("reg-view")) {
      const panel = document.createElement("div");
      panel.className = "chart-filter-panel";
      panel.id = "reg-filter-panel";
      panel.innerHTML = `
        <div class="hero-filter-row">
          <div class="label">视图</div>
          <div class="chart-mini-radio" id="reg-view"></div>
        </div>
        <div class="hero-filter-row">
          <div class="label">月份</div>
          <div class="chart-mini-chips" id="reg-months"></div>
        </div>
        <div class="hero-filter-row">
          <div class="label">国家</div>
          <div class="chart-mini-chips" id="reg-countries"></div>
        </div>
        <div class="hero-filter-row">
          <div class="label">媒体</div>
          <div class="chart-mini-chips" id="reg-medias"></div>
        </div>
        <div class="hero-filter-row">
          <div class="label">形态</div>
          <div class="chart-mini-chips" id="reg-productTypes"></div>
        </div>
        <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:4px;">
          <button class="btn" type="button" id="reg-btn-reset">全选 / 重置</button>
        </div>
      `;

      const header = sectionEl.querySelector(".chart-card-header");
      if (header && header.parentNode) {
        header.parentNode.insertBefore(panel, header.nextSibling);
      } else {
        sectionEl.insertBefore(panel, chartEl);
      }
    }

    // 2) table section
    if (!getDom("table-paid-registrations")) {
      const tableSection = document.createElement("div");
      tableSection.className = "chart-table-section";
      tableSection.id = "table-section-paid-registrations";
      tableSection.innerHTML = `
        <div class="chart-table-title" id="table-title-paid-registrations">当前筛选 · 买量注册（月度汇总）</div>
        <div class="chart-table-wrapper">
          <table id="table-paid-registrations" class="chart-table"></table>
        </div>
      `;
      if (chartEl.parentNode) {
        chartEl.parentNode.insertBefore(tableSection, chartEl.nextSibling);
      } else {
        sectionEl.appendChild(tableSection);
      }
    }
  }

  function th(text, cls) {
    const el = document.createElement("th");
    if (cls) el.className = cls;
    el.textContent = text;
    return el;
  }

  function td(text, cls) {
    const el = document.createElement("td");
    if (cls) el.className = cls;
    el.textContent = text;
    return el;
  }

  let _didInit = false;

  function initModule() {
    if (_didInit) return;
    _didInit = true;

    injectStylesOnce();

    if (!window.echarts) {
      console.warn("[paid-registrations] echarts not found");
      return;
    }

    const chartEl =
      getDom("chart-paid-registrations") || getDom("chart-registrations");
    if (!chartEl) return;

    const sectionEl =
      getDom("card-paid-registrations") ||
      chartEl.closest(".chart-card") ||
      chartEl.parentElement;

    ensureContainers(sectionEl, chartEl);

    const viewEl = getDom("reg-view");
    const monthsEl = getDom("reg-months");
    const countriesEl = getDom("reg-countries");
    const mediasEl = getDom("reg-medias");
    const productTypesEl = getDom("reg-productTypes");
    const resetBtn = getDom("reg-btn-reset");

    const tableTitleEl = getDom("table-title-paid-registrations");
    const tableEl = getDom("table-paid-registrations");

    const opts = buildOptionsFromRAW();

    const state = {
      view: "bar",
      months: pickDefaultMonths(opts.months),
      countries: (opts.countries || []).slice(),
      medias: (opts.medias || []).slice(),
      productTypes: (opts.productTypes || []).slice(),
      collapse: { countries: false, medias: false, productTypes: false },
    };

    ensureNonEmpty(state, opts);

    const chart = echarts.init(chartEl);
    const pd = window.PaidDashboard;
    if (pd && typeof pd.registerChart === "function") pd.registerChart(chart);

    function renderRadioView() {
      if (!viewEl) return;
      const radioName = "paid-reg-view-type";
      viewEl.innerHTML = `
        <label>
          <input type="radio" name="${radioName}" value="bar" ${
        state.view === "bar" ? "checked" : ""
      } />
          柱状（月度）
        </label>
        <label>
          <input type="radio" name="${radioName}" value="line" ${
        state.view === "line" ? "checked" : ""
      } />
          折线（日度）
        </label>
      `;

      viewEl.querySelectorAll('input[type="radio"]').forEach((inp) => {
        inp.addEventListener("change", (e) => {
          const v = e.target && e.target.value;
          if (v === "bar" || v === "line") {
            state.view = v;
            renderAll();
          }
        });
      });
    }

    function renderChipGroup(containerEl, values, selectedArray, cfg) {
      if (!containerEl) return;

      const max = cfg && cfg.max ? Number(cfg.max) : 0;
      const getLabel =
        cfg && typeof cfg.getLabel === "function" ? cfg.getLabel : (v) => String(v);

      const emptyFillValues =
        cfg && typeof cfg.emptyFillValues === "function"
          ? cfg.emptyFillValues
          : null;

      const specialAllNoBreakdown = !!(cfg && cfg.specialAllNoBreakdown);
      const collapseRef = cfg && cfg.collapseFlagRef;

      const allValues = (values || []).slice();
      const collapseOn =
        specialAllNoBreakdown && collapseRef && typeof collapseRef.get === "function"
          ? !!collapseRef.get()
          : false;

      const selectedSet = new Set((selectedArray || []).map((v) => String(v)));

      let html = "";
      if (specialAllNoBreakdown) {
        html += `
          <label class="filter-chip filter-chip-special">
            <input type="checkbox" data-special="collapse" ${collapseOn ? "checked" : ""} />
            <span>全选但不区分</span>
          </label>
        `;
      }

      allValues.forEach((v) => {
        const val = String(v);
        const checked = collapseOn || selectedSet.has(val);
        html += `
          <label class="filter-chip">
            <input type="checkbox" value="${val}" ${checked ? "checked" : ""} />
            <span>${getLabel(v)}</span>
          </label>
        `;
      });

      containerEl.innerHTML = html;

      containerEl.querySelectorAll('input[type="checkbox"]').forEach((el) => {
        el.addEventListener("change", (e) => {
          const target = e.target;
          if (!target) return;

          const isCollapseToggle = target.dataset && target.dataset.special === "collapse";

          if (isCollapseToggle) {
            const nowOn = !!target.checked;
            if (collapseRef && typeof collapseRef.set === "function") collapseRef.set(nowOn);

            if (nowOn) {
              setArray(selectedArray, allValues.slice());
            } else {
              if (!selectedArray.length) {
                const fill = emptyFillValues
                  ? emptyFillValues(allValues.slice())
                  : allValues.slice();
                setArray(selectedArray, max ? fill.slice(0, max) : fill);
              }
            }
            renderAll();
            return;
          }

          const val = String(target.value);
          let next = uniq(selectedArray.map((v) => String(v)));

          if (target.checked) {
            if (max && next.length >= max) {
              target.checked = false;
              return;
            }
            if (next.indexOf(val) === -1) next.push(val);
          } else {
            next = next.filter((x) => x !== val);
          }

          setArray(selectedArray, next);

          // “全选但不区分”开启时，不允许缩小范围（始终全选）
          if (specialAllNoBreakdown && collapseRef && typeof collapseRef.get === "function") {
            if (collapseRef.get()) setArray(selectedArray, allValues.slice());
          }

          // 防空：为空则回填（月份按默认回填，其它按全选回填）
          if (!selectedArray.length) {
            const fill = emptyFillValues ? emptyFillValues(allValues.slice()) : allValues.slice();
            setArray(selectedArray, max ? fill.slice(0, max) : fill);
          }

          renderAll();
        });
      });
    }

    function filteredRowsForMonth(monthKey, extraFilterFn) {
      const RAW = getRAW();
      const rows = RAW[monthKey] || [];

      const countrySet = state.collapse.countries
        ? null
        : new Set(state.countries.map((v) => normalizeCountry(v)));
      const mediaSet = state.collapse.medias
        ? null
        : new Set(state.medias.map((v) => normalizeMedia(v)));
      const typeSet = state.collapse.productTypes
        ? null
        : new Set(state.productTypes.map((v) => normalizeProductType(v)));

      return rows.filter((r) => {
        if (!r) return false;

        const c = normalizeCountry(r.country);
        const m = normalizeMedia(r.media);
        const p = normalizeProductType(r.productType);

        if (countrySet && !countrySet.has(c)) return false;
        if (mediaSet && !mediaSet.has(m)) return false;
        if (typeSet && !typeSet.has(p)) return false;

        if (typeof extraFilterFn === "function") {
          if (!extraFilterFn(r, c, m, p)) return false;
        }
        return true;
      });
    }

    function seriesNameFromBase(baseKey) {
      const parts = String(baseKey || "").split("|");
      const c = parts[0] || "ALL";
      const m = parts[1] || "ALL";
      const p = parts[2] || "all";

      const nameParts = [];
      if (!state.collapse.countries) nameParts.push(c);
      if (!state.collapse.medias) nameParts.push(m);
      if (!state.collapse.productTypes) nameParts.push(String(p).toUpperCase());

      return nameParts.length ? nameParts.join(" · ") : "ALL";
    }

    function buildTitleSuffix() {
      const allMedias = (opts.medias || []).slice().sort();
      const allTypes = (opts.productTypes || []).slice().sort();

      let mediaText = "全媒体";
      if (state.collapse.medias) {
        mediaText = "全媒体（不区分）";
      } else {
        const sel = uniq(state.medias.map(normalizeMedia)).sort();
        mediaText = sel.length === allMedias.length ? "全媒体" : sel.join("+");
      }

      let typeText = "全形态";
      if (state.collapse.productTypes) {
        typeText = "全形态（不区分）";
      } else {
        const sel = uniq(state.productTypes.map(normalizeProductType)).sort();
        const pretty = sel.map((x) => String(x).toUpperCase());
        typeText = sel.length === allTypes.length ? "全形态" : pretty.join("+");
      }

      return `（${mediaText}，${typeText}）`;
    }

    function renderBar() {
      const monthsSel = uniq(state.months).sort().slice(0, 3);
      let countriesAxis = sortCountries(uniq(state.countries.map(normalizeCountry)));
      if (state.collapse.countries) countriesAxis = ["ALL"];

      if (!monthsSel.length || !countriesAxis.length) {
        chart.clear();
        chart.setOption(
          {
            title: {
              text: "无可用数据",
              left: "center",
              top: "middle",
              textStyle: { color: "#94a3b8", fontSize: 12 },
            },
          },
          true
        );
        return;
      }

      const palette = getPalette();

      const series = monthsSel.map((monthKey, idx) => {
        const color = palette[idx % palette.length];

        const data = countriesAxis.map((countryKey) => {
          const rows = filteredRowsForMonth(monthKey, (_r, c) => {
            if (state.collapse.countries) return true;
            return c === countryKey;
          });
          const sum = sumFields(rows, ["registration"]);
          return sum.registration || 0;
        });

        return {
          name: formatMonthLabel(monthKey),
          type: "bar",
          data,
          itemStyle: { color },
          barMaxWidth: 28,
        };
      });

      const option = {
        grid: { left: 70, right: 18, top: 24, bottom: 46 },
        legend: { type: "scroll", bottom: 6 },
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
          formatter: (params) => {
            if (!params || !params.length) return "";
            const title = params[0].axisValueLabel;
            const lines = [`<strong>${title}</strong>`];
            params.forEach((p) => {
              lines.push(`${p.seriesName}：${formatInteger(p.data)}`);
            });
            return lines.join("<br/>");
          },
        },
        xAxis: {
          type: "category",
          data: countriesAxis,
          axisLabel: { color: "#475569" },
        },
        yAxis: {
          type: "value",
          axisLabel: { color: "#475569", formatter: (v) => formatInteger(Number(v)) },
          splitLine: { lineStyle: { color: "rgba(148, 163, 184, 0.28)" } },
        },
        series,
      };

      chart.setOption(option, true);
    }

    function renderLine() {
      const monthsSel = uniq(state.months).sort().slice(0, 3);
      if (!monthsSel.length) {
        chart.clear();
        return;
      }

      const byBase = {};
      const datesSet = new Set();

      monthsSel.forEach((monthKey) => {
        const rows = filteredRowsForMonth(monthKey);
        rows.forEach((r) => {
          if (!r || !r.date) return;
          const d = String(r.date);
          datesSet.add(d);

          const c0 = normalizeCountry(r.country);
          const m0 = normalizeMedia(r.media);
          const p0 = normalizeProductType(r.productType);

          const c = state.collapse.countries ? "ALL" : c0;
          const m = state.collapse.medias ? "ALL" : m0;
          const p = state.collapse.productTypes ? "ALL" : p0;

          const baseKey = `${c}|${m}|${p}`;

          if (!byBase[baseKey]) byBase[baseKey] = {};
          if (!byBase[baseKey][d]) byBase[baseKey][d] = { reg: 0 };

          const reg = Number(r.registration);
          if (isFinite(reg)) byBase[baseKey][d].reg += reg;
        });
      });

      const dates = Array.from(datesSet).sort();
      const baseKeys = Object.keys(byBase).sort();
      const palette = getPalette();

      if (!dates.length || !baseKeys.length) {
        chart.clear();
        chart.setOption(
          {
            title: {
              text: "无可用数据",
              left: "center",
              top: "middle",
              textStyle: { color: "#94a3b8", fontSize: 12 },
            },
          },
          true
        );
        return;
      }

      const series = baseKeys.map((baseKey, idx) => {
        const name = seriesNameFromBase(baseKey);
        const color = palette[idx % palette.length];

        const data = dates.map((d) => {
          const bucket = byBase[baseKey][d];
          return bucket ? bucket.reg : null;
        });

        return {
          name,
          type: "line",
          data,
          showSymbol: false,
          connectNulls: true,
          lineStyle: { width: 2, color },
          itemStyle: { color },
        };
      });

      const option = {
        grid: { left: 70, right: 18, top: 24, bottom: 46 },
        legend: { type: "scroll", bottom: 6 },
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "line" },
          formatter: (params) => {
            if (!params || !params.length) return "";
            const title = params[0].axisValueLabel;
            const lines = [`<strong>${title}</strong>`];
            params.forEach((p) => {
              lines.push(`${p.seriesName}：${formatInteger(p.data)}`);
            });
            return lines.join("<br/>");
          },
        },
        xAxis: {
          type: "category",
          data: dates,
          boundaryGap: false,
          axisLabel: {
            color: "#475569",
            formatter: (v) => {
              const s = String(v || "");
              return s.length >= 10 ? s.slice(5) : s;
            },
          },
        },
        yAxis: {
          type: "value",
          axisLabel: { color: "#475569", formatter: (v) => formatInteger(Number(v)) },
          splitLine: { lineStyle: { color: "rgba(148, 163, 184, 0.28)" } },
        },
        series,
      };

      chart.setOption(option, true);
    }

    function renderTable() {
      if (!tableEl) return;

      const monthsSel = uniq(state.months).sort().slice(0, 3);

      let rowCountries = sortCountries(uniq(state.countries.map(normalizeCountry)));
      if (state.collapse.countries) rowCountries = ["ALL"];

      const rowMedias = state.collapse.medias
        ? ["ALL"]
        : uniq(state.medias.map(normalizeMedia)).sort();
      const rowTypes = state.collapse.productTypes
        ? ["ALL"]
        : uniq(state.productTypes.map(normalizeProductType)).sort();

      const suffix = buildTitleSuffix();
      if (tableTitleEl)
        tableTitleEl.textContent = `当前筛选 · 买量注册（月度汇总）${suffix}`;

      const thead = document.createElement("thead");
      const trh = document.createElement("tr");

      trh.appendChild(th("国家"));
      if (!state.collapse.medias) trh.appendChild(th("媒体"));
      if (!state.collapse.productTypes) trh.appendChild(th("产品类型"));

      monthsSel.forEach((m) => {
        trh.appendChild(th(`${formatMonthLabel(m)} 注册数`, "num"));
        trh.appendChild(th(`${formatMonthLabel(m)} 注册单价`, "num"));
      });

      thead.appendChild(trh);

      const cellCache = {};
      function getCell(monthKey, countryKey, mediaKey, typeKey) {
        const cacheKey = `${monthKey}|${countryKey}|${mediaKey}|${typeKey}`;
        if (cacheKey in cellCache) return cellCache[cacheKey];

        const rows = filteredRowsForMonth(monthKey, (_r, c, m, p) => {
          if (countryKey !== "ALL" && c !== countryKey) return false;
          if (mediaKey !== "ALL" && m !== mediaKey) return false;
          if (typeKey !== "ALL" && p !== typeKey) return false;
          return true;
        });

        const sum = sumFields(rows, ["spent", "registration"]);
        const reg = sum.registration || 0;
        const cpa = safeDiv(sum.spent, reg);

        const out = { reg, cpa };
        cellCache[cacheKey] = out;
        return out;
      }

      const tbody = document.createElement("tbody");

      rowCountries.forEach((c) => {
        rowMedias.forEach((m) => {
          rowTypes.forEach((p) => {
            const tr = document.createElement("tr");

            tr.appendChild(td(c));
            if (!state.collapse.medias) tr.appendChild(td(m));
            if (!state.collapse.productTypes)
              tr.appendChild(td(String(p).toUpperCase()));

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
      ensureNonEmpty(state, opts);

      renderRadioView();

      renderChipGroup(monthsEl, opts.months, state.months, {
        max: 3,
        getLabel: (v) => formatMonthLabel(v),
        emptyFillValues: (allMonths) => pickDefaultMonths(allMonths),
      });

      renderChipGroup(countriesEl, opts.countries, state.countries, {
        specialAllNoBreakdown: true,
        collapseFlagRef: {
          get: () => state.collapse.countries,
          set: (v) => (state.collapse.countries = !!v),
        },
        getLabel: (v) => String(v),
      });

      renderChipGroup(mediasEl, opts.medias, state.medias, {
        specialAllNoBreakdown: true,
        collapseFlagRef: {
          get: () => state.collapse.medias,
          set: (v) => (state.collapse.medias = !!v),
        },
        getLabel: (v) => String(v),
      });

      renderChipGroup(productTypesEl, opts.productTypes, state.productTypes, {
        specialAllNoBreakdown: true,
        collapseFlagRef: {
          get: () => state.collapse.productTypes,
          set: (v) => (state.collapse.productTypes = !!v),
        },
        getLabel: (v) => String(v).toUpperCase(),
      });

      if (state.view === "line") renderLine();
      else renderBar();

      renderTable();
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        state.view = "bar";
        state.collapse.countries = false;
        state.collapse.medias = false;
        state.collapse.productTypes = false;

        state.months = pickDefaultMonths(opts.months);
        state.countries = (opts.countries || []).slice();
        state.medias = (opts.medias || []).slice();
        state.productTypes = (opts.productTypes || []).slice();

        renderAll();
      });
    }

    renderAll();
  }

  const pd = window.PaidDashboard;
  if (pd && typeof pd.registerModule === "function") {
    pd.registerModule(MODULE_KEY, initModule);
    // 动态注入场景：如果 init 已跑过，这里补一次
    if (document.readyState !== "loading") {
      try {
        initModule();
      } catch (e) {
        console.error(e);
      }
    }
  } else {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initModule);
    } else {
      initModule();
    }
  }
})();
