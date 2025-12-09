/* paid-monthly/paid-module-roi.js
 * 6) D0/D7 充值 ROI
 * - ROI = D0_PURCHASE_VALUE / spent ; D7_PURCHASE_VALUE / spent
 * - 展示单位：%
 * - 视图：月度柱状图 / 日级折线图
 * - 筛选：月份(最多3) / 国家 / 媒体 / 产品类型 / 口径(D0/D7，多选)
 * - “全选但不区分”：逻辑全选，但图与表不再按该维度拆分
 *
 * 数据源：
 * - window.RAW_PAID_BY_MONTH（paid-data.js）
 * - window.PAID_ANALYSIS_TEXT（paid-analytics.js）
 */
(function () {
  const MODULE_KEY = "roi";
  const STYLE_ID = "paid-roi-module-style";

  const FIXED_COUNTRY_ORDER = ["GH", "KE", "NG", "TZ"];
  const ALL_VALUE = "ALL";
  const ALL_NO_SPLIT_VALUE = "__ALL_NO_SPLIT__";

  // ECharts decal（用于 D7 阴影区分）
  const D7_DECAL = {
    symbol: "rect",
    symbolSize: 2,
    dashArrayX: [1, 0],
    dashArrayY: [2, 2],
    rotation: 0,
  };

  const FALLBACK_COLORS = [
    "#3b82f6",
    "#22c55e",
    "#f97316",
    "#a855f7",
    "#06b6d4",
    "#ef4444",
    "#84cc16",
    "#eab308",
  ];

  function getDom(id) {
    return document.getElementById(id);
  }

  function uniq(arr) {
    return Array.from(new Set((arr || []).filter(Boolean)));
  }

  function normalizeCountry(v) {
    return String(v || "")
      .trim()
      .toUpperCase();
  }

  function normalizeMedia(v) {
    return String(v || "")
      .trim()
      .toUpperCase();
  }

  function normalizeProductType(v) {
    return String(v || "")
      .trim()
      .toLowerCase();
  }

  function safeNum(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  function safeDiv(num, den) {
    const a = Number(num);
    const b = Number(den);
    if (!Number.isFinite(a) || !Number.isFinite(b) || b === 0) return null;
    return a / b;
  }

  function getRAW() {
    return window.RAW_PAID_BY_MONTH || {};
  }

  function getPalette() {
    const pd = window.PaidDashboard;
    const colors = pd && Array.isArray(pd.COLORS) && pd.COLORS.length ? pd.COLORS : FALLBACK_COLORS;
    return colors;
  }

  function sortCountries(countries) {
    const order = new Map(FIXED_COUNTRY_ORDER.map((c, i) => [c, i]));
    return (countries || []).slice().sort((a, b) => {
      const ia = order.has(a) ? order.get(a) : 999;
      const ib = order.has(b) ? order.get(b) : 999;
      if (ia !== ib) return ia - ib;
      return String(a).localeCompare(String(b));
    });
  }

  function sortProductTypes(types) {
    return (types || []).slice().sort((a, b) => {
      if (a === b) return 0;
      if (a === "app") return -1;
      if (b === "app") return 1;
      return String(a).localeCompare(String(b));
    });
  }

  function buildOptionsFromRAW(raw) {
    const months = Object.keys(raw || {}).sort();
    const cSet = new Set();
    const mSet = new Set();
    const pSet = new Set();

    months.forEach((mk) => {
      const rows = raw[mk] || [];
      rows.forEach((r) => {
        const c = normalizeCountry(r.country);
        if (FIXED_COUNTRY_ORDER.includes(c)) cSet.add(c);

        const m = normalizeMedia(r.media);
        if (m) mSet.add(m);

        const p = normalizeProductType(r.productType);
        if (p) pSet.add(p);
      });
    });

    return {
      months,
      countries: sortCountries(Array.from(cSet)),
      medias: Array.from(mSet).sort((a, b) => String(a).localeCompare(String(b))),
      productTypes: sortProductTypes(Array.from(pSet)),
    };
  }

  function pickDefaultMonths(allMonths) {
    const ms = (allMonths || []).slice().sort();
    if (ms.length <= 2) return ms;
    return ms.slice(-2);
  }

  function monthLabel(monthKey, yearsSet) {
    if (!monthKey) return "";
    const parts = String(monthKey).split("-");
    if (parts.length !== 2) return monthKey;
    const y = parts[0];
    const m = parts[1];
    const mNum = Number(m);
    if (yearsSet && yearsSet.size > 1) return `${y}-${m}`;
    if (Number.isFinite(mNum)) return `${mNum}月`;
    return `${m}月`;
  }

  function formatPct01(v, digits = 1) {
    if (v === null || v === undefined) return "-";
    const n = Number(v);
    if (!Number.isFinite(n)) return "-";
    return `${(n * 100).toFixed(digits)}%`;
  }

  function injectStylesOnce() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      /* 通用：模块内筛选器（参考 organic-monthly 风格） */
      .chart-filter-panel{
        padding: 10px 14px 12px;
        border-top: 1px solid rgba(148,163,184,.18);
        border-bottom: 1px solid rgba(148,163,184,.12);
        background: rgba(248,250,252,.65);
      }
      .chart-filter-panel .hero-filter-row{
        display:flex;
        flex-wrap:wrap;
        gap:12px 14px;
        align-items:flex-start;
      }
      .chart-filter-panel .filter-group{
        min-width: 180px;
      }
      .chart-filter-panel .filter-title{
        font-size: 11px;
        color: var(--text-sub, #64748b);
        letter-spacing:.2px;
        margin-bottom:6px;
        display:flex;
        align-items:center;
        gap:6px;
      }
      .chart-filter-panel .chart-mini-chips{
        display:flex;
        flex-wrap:wrap;
        gap:8px;
      }
      .filter-chip{
        border: 1px solid rgba(148,163,184,.35);
        color: var(--text-main, #0f172a);
        background: rgba(255,255,255,.65);
        padding: 6px 10px;
        border-radius: 999px;
        font-size: 11px;
        cursor: pointer;
        user-select:none;
        transition: all .15s ease;
        display:inline-flex;
        align-items:center;
        gap:6px;
      }
      .filter-chip input{
        display:none;
      }
      .filter-chip span{
        display:inline-block;
        line-height: 1;
      }
      .filter-chip:hover{
        transform: translateY(-1px);
        border-color: rgba(59,130,246,.45);
      }
      .filter-chip.filter-chip-active{
        background: linear-gradient(135deg, rgba(59,130,246,.95), rgba(37,99,235,.95));
        border-color: rgba(37,99,235,.9);
        color:#fff;
      }
      .filter-chip.filter-chip-disabled{
        opacity:.45;
        cursor:not-allowed;
        transform:none;
      }
      .chart-filter-panel .filter-actions{
        margin-left:auto;
        min-width: auto;
        display:flex;
        align-items:flex-end;
      }
      .chart-filter-panel .btn{
        border: 1px solid rgba(148,163,184,.35);
        background: rgba(255,255,255,.75);
        color: var(--text-main, #0f172a);
        padding: 7px 12px;
        border-radius: 10px;
        font-size: 11px;
        cursor: pointer;
      }
      .chart-filter-panel .btn:hover{
        border-color: rgba(59,130,246,.5);
      }
      .chart-filter-panel .filter-hint{
        margin-top:8px;
        font-size: 11px;
        color: var(--text-sub, #64748b);
      }

      /* 表格 */
      .chart-table-section{
        padding: 10px 14px 14px;
      }
      .chart-table-title{
        font-size: 12px;
        color: var(--text-main, #0f172a);
        font-weight: 600;
        margin-bottom: 8px;
      }
      .chart-table{
        width:100%;
        border-collapse: separate;
        border-spacing: 0;
        overflow:hidden;
        border-radius: 12px;
        border: 1px solid rgba(148,163,184,.25);
        background: rgba(255,255,255,.65);
      }
      .chart-table th{
        font-size: 11px;
        text-align: center;
        padding: 9px 10px;
        background: rgba(241,245,249,.9);
        border-bottom: 1px solid rgba(148,163,184,.18);
        color: var(--text-sub, #64748b);
        font-weight: 600;
      }
      .chart-table td{
        font-size: 11px;
        text-align: center;
        padding: 9px 10px;
        border-bottom: 1px solid rgba(148,163,184,.12);
        color: var(--text-main, #0f172a);
      }
      .chart-table tbody tr:nth-child(odd) td{
        background: rgba(248,250,252,.55);
      }
      .chart-table td.num{
        text-align: center;
        font-variant-numeric: tabular-nums;
      }

      /* ROI卡片：隐藏旧 header 小筛选（如果未来加了） */
      #card-paid-roi .chart-mini-filter{ display:none; }

      /* ROI分析块（多月同时展示） */
      #card-paid-roi .roi-insights{
        padding: 10px 14px 14px;
        border-top: 1px solid rgba(148,163,184,.12);
      }
      #card-paid-roi .roi-insights-title{
        font-size: 12px;
        font-weight: 600;
        color: var(--text-main, #0f172a);
        margin-bottom: 8px;
      }
      #card-paid-roi .roi-insights-item{
        padding: 10px 12px;
        border: 1px solid rgba(148,163,184,.22);
        background: rgba(255,255,255,.65);
        border-radius: 12px;
        margin-top: 10px;
      }
      #card-paid-roi .roi-insights-month{
        font-size: 11px;
        font-weight: 600;
        color: var(--text-sub, #64748b);
        margin-bottom: 6px;
      }
      #card-paid-roi .roi-insights-text{
        font-size: 11px;
        color: var(--text-main, #0f172a);
        line-height: 1.65;
        white-space: pre-wrap;
      }
    `;
    document.head.appendChild(style);
  }

  function createFilterPanelFallback(cardEl) {
    if (!cardEl) return null;
    const existed = cardEl.querySelector("#roi-filter-panel");
    if (existed) return existed;

    const header = cardEl.querySelector(".chart-card-header");
    const panel = document.createElement("div");
    panel.className = "chart-filter-panel";
    panel.id = "roi-filter-panel";
    panel.innerHTML = `
      <div class="hero-filter-row">
        <div class="filter-group">
          <div class="filter-title">图表</div>
          <div class="chart-mini-chips" id="roi-view"></div>
        </div>
        <div class="filter-group">
          <div class="filter-title">月份（最多选3）</div>
          <div class="chart-mini-chips" id="roi-months"></div>
        </div>
        <div class="filter-group">
          <div class="filter-title">国家</div>
          <div class="chart-mini-chips" id="roi-countries"></div>
        </div>
        <div class="filter-group">
          <div class="filter-title">媒体</div>
          <div class="chart-mini-chips" id="roi-medias"></div>
        </div>
        <div class="filter-group">
          <div class="filter-title">产品类型</div>
          <div class="chart-mini-chips" id="roi-productTypes"></div>
        </div>
        <div class="filter-group">
          <div class="filter-title">口径</div>
          <div class="chart-mini-chips" id="roi-windows"></div>
        </div>
        <div class="filter-group filter-actions">
          <button class="btn" id="roi-reset">重置</button>
        </div>
      </div>
      <div class="filter-hint" id="roi-hint"></div>
    `;

    if (header && header.parentNode) {
      header.parentNode.insertBefore(panel, header.nextSibling);
    } else {
      cardEl.insertBefore(panel, cardEl.firstChild);
    }
    return panel;
  }

  function createTableFallbackAfter(chartEl) {
    if (!chartEl) return null;
    const cardEl = chartEl.closest(".chart-card");
    if (!cardEl) return null;

    const existed = cardEl.querySelector("#roi-table-section");
    if (existed) return existed;

    const section = document.createElement("div");
    section.className = "chart-table-section";
    section.id = "roi-table-section";
    section.innerHTML = `
      <div class="chart-table-title" id="table-title-roi"></div>
      <table class="chart-table" id="table-roi"></table>
    `;

    const parent = chartEl.parentNode;
    if (parent) parent.insertBefore(section, chartEl.nextSibling);
    return section;
  }

  function initModule() {
    injectStylesOnce();

    const chartEl = getDom("chart-paid-roi");
    if (!chartEl || !window.echarts) return;

    const cardEl = chartEl.closest(".chart-card");
    if (!cardEl) return;

    // badge 改成 %
    const badgeEl = cardEl.querySelector(".chart-badge");
    if (badgeEl) badgeEl.textContent = "单位：%";

    const panelEl = createFilterPanelFallback(cardEl);
    createTableFallbackAfter(chartEl);

    const raw = getRAW();
    const opts = buildOptionsFromRAW(raw);

    const state = {
      view: "bar", // bar | line
      months: pickDefaultMonths(opts.months),
      countries: opts.countries.slice(),
      medias: opts.medias.slice(),
      productTypes: opts.productTypes.slice(),
      windows: ["D0", "D7"],
      collapse: {
        countries: false,
        medias: false,
        productTypes: false,
      },
    };

    const chart = window.echarts.init(chartEl);
    const pd = window.PaidDashboard;
    if (pd && typeof pd.registerChart === "function") pd.registerChart(chart);

    function enforceMonthLimit() {
      const hintEl = getDom("roi-hint");
      const before = (state.months || []).slice();
      const after = uniq(state.months).sort();
      if (after.length > 3) {
        state.months = after.slice(-3);
        if (hintEl) {
          hintEl.textContent = `月份最多选3个，已自动保留最近3个：${state.months.join(", ")}`;
        }
        return;
      }
      state.months = after;
      if (hintEl) hintEl.textContent = "";
      // 如果用户刚好选满 3 个，禁用其它月份（由渲染层处理）
      if (before.join("|") !== state.months.join("|") && hintEl) hintEl.textContent = "";
    }

    function ensureNonEmpty() {
      // 月份
      if (!state.months || state.months.length === 0) state.months = pickDefaultMonths(opts.months);
      enforceMonthLimit();

      // 口径
      state.windows = uniq(state.windows);
      if (state.windows.length === 0) state.windows = ["D0", "D7"];

      // 维度
      state.countries = uniq(state.countries);
      state.medias = uniq(state.medias);
      state.productTypes = uniq(state.productTypes);

      if (state.collapse.countries) state.countries = opts.countries.slice();
      if (state.collapse.medias) state.medias = opts.medias.slice();
      if (state.collapse.productTypes) state.productTypes = opts.productTypes.slice();

      if (!state.countries.length) state.countries = opts.countries.slice();
      if (!state.medias.length) state.medias = opts.medias.slice();
      if (!state.productTypes.length) state.productTypes = opts.productTypes.slice();
    }

    function renderRadioView() {
      const el = getDom("roi-view");
      if (!el) return;

      const items = [
        { key: "bar", label: "月度柱状图" },
        { key: "line", label: "日级折线图" },
      ];

      el.innerHTML = items
        .map((it) => {
          const checked = state.view === it.key;
          return `
            <label class="filter-chip ${checked ? "filter-chip-active" : ""}">
              <input type="radio" name="roi-view-radio" value="${it.key}" ${checked ? "checked" : ""} />
              <span>${it.label}</span>
            </label>
          `;
        })
        .join("");
    }

    function renderChipGroup(cfg) {
      const el = getDom(cfg.containerId);
      if (!el) return;

      const values = cfg.values || [];
      const selected = new Set(cfg.selected || []);
      const max = cfg.maxSelect || null;

      const collapseKey = cfg.collapseKey || null;
      const hasNoSplit = !!cfg.specialAllNoBreakdown && !!collapseKey;
      const isCollapsed = collapseKey ? !!state.collapse[collapseKey] : false;

      const selectedCount = (cfg.selected || []).length;

      const html = [];

      if (hasNoSplit) {
        const checked = isCollapsed;
        html.push(`
          <label class="filter-chip ${checked ? "filter-chip-active" : ""}">
            <input
              type="checkbox"
              data-group="${cfg.groupKey}"
              data-special="nosplit"
              data-collapse="${collapseKey}"
              value="${ALL_NO_SPLIT_VALUE}"
              ${checked ? "checked" : ""}
            />
            <span>全选但不区分</span>
          </label>
        `);
      }

      values.forEach((v) => {
        const checked = selected.has(v);

        // 月份：选满 max 后禁用其它未选
        let disabled = false;
        if (max && !checked && selectedCount >= max) disabled = true;

        // no-split：开启时禁用其它项
        if (hasNoSplit && isCollapsed) disabled = true;

        const label = cfg.getLabel ? cfg.getLabel(v) : String(v);
        html.push(`
          <label class="filter-chip ${checked ? "filter-chip-active" : ""} ${disabled ? "filter-chip-disabled" : ""}">
            <input
              type="checkbox"
              data-group="${cfg.groupKey}"
              value="${String(v)}"
              ${checked ? "checked" : ""}
              ${disabled ? "disabled" : ""}
            />
            <span>${label}</span>
          </label>
        `);
      });

      el.innerHTML = html.join("");
    }

    function baseRowPass(r) {
      const c = normalizeCountry(r.country);
      if (!FIXED_COUNTRY_ORDER.includes(c)) return false;

      if (!state.collapse.countries && !state.countries.includes(c)) return false;

      const m = normalizeMedia(r.media);
      if (!state.collapse.medias && !state.medias.includes(m)) return false;

      const p = normalizeProductType(r.productType);
      if (!state.collapse.productTypes && !state.productTypes.includes(p)) return false;

      return true;
    }

    function renderBar() {
      const palette = getPalette();
      const monthsSel = uniq(state.months).sort();
      const windowsSel = uniq(state.windows);

      const yearsSet = new Set(monthsSel.map((m) => String(m).slice(0, 4)));

      const xCats = state.collapse.countries
        ? [ALL_VALUE]
        : FIXED_COUNTRY_ORDER.filter((c) => state.countries.includes(c));

      // 预聚合：month -> country -> sums
      const agg = {};
      monthsSel.forEach((mk) => {
        agg[mk] = {};
        const rows = raw[mk] || [];
        rows.forEach((r) => {
          if (!r || !r.date) return;
          if (!baseRowPass(r)) return;

          const c = normalizeCountry(r.country);
          const cKey = state.collapse.countries ? ALL_VALUE : c;
          if (!agg[mk][cKey]) agg[mk][cKey] = { spent: 0, d0: 0, d7: 0 };

          const b = agg[mk][cKey];
          b.spent += safeNum(r.spent);
          b.d0 += safeNum(r.D0_PURCHASE_VALUE);
          b.d7 += safeNum(r.D7_PURCHASE_VALUE);
        });
      });

      const series = [];
      monthsSel.forEach((mk, mi) => {
        const color = palette[mi % palette.length];
        windowsSel.forEach((win) => {
          const isD7 = win === "D7";
          const name = `${monthLabel(mk, yearsSet)} ${win}`;

          const data = xCats.map((c) => {
            const bucket = (agg[mk] && agg[mk][c]) || null;
            if (!bucket) return null;
            const num = isD7 ? bucket.d7 : bucket.d0;
            return safeDiv(num, bucket.spent);
          });

          const itemStyle = isD7
            ? { color, decal: D7_DECAL }
            : { color };

          series.push({
            name,
            type: "bar",
            data,
            itemStyle,
            emphasis: { focus: "series" },
            barMaxWidth: 22,
          });
        });
      });

      const option = {
        grid: { left: 56, right: 18, top: 44, bottom: 48, containLabel: true },
        legend: { top: 6, type: "scroll" },
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
          formatter: function (params) {
            if (!params || !params.length) return "";
            const axis = params[0].axisValueLabel || params[0].axisValue || "";
            const lines = [axis];
            params.forEach((p) => {
              lines.push(`${p.marker}${p.seriesName}：${formatPct01(p.data, 1)}`);
            });
            return lines.join("<br/>");
          },
        },
        xAxis: {
          type: "category",
          data: xCats,
          axisTick: { alignWithLabel: true },
          axisLabel: { fontSize: 11 },
        },
        yAxis: {
          type: "value",
          axisLabel: { formatter: (v) => formatPct01(v, 0) },
          splitLine: { lineStyle: { color: "rgba(148,163,184,.18)" } },
        },
        series,
      };

      chart.setOption(option, true);
    }

    function renderLine() {
      const palette = getPalette();
      const monthsSel = uniq(state.months).sort();
      const windowsSel = uniq(state.windows);

      const dateSet = new Set();
      const byBase = {}; // baseKey -> date -> {spent,d0,d7}

      monthsSel.forEach((mk) => {
        const rows = raw[mk] || [];
        rows.forEach((r) => {
          if (!r || !r.date) return;
          if (!baseRowPass(r)) return;

          const c0 = normalizeCountry(r.country);
          const m0 = normalizeMedia(r.media);
          const p0 = normalizeProductType(r.productType);

          const c = state.collapse.countries ? ALL_VALUE : c0;
          const m = state.collapse.medias ? ALL_VALUE : m0;
          const p = state.collapse.productTypes ? ALL_VALUE : p0;

          const baseKey = `${c}|${m}|${p}`;
          const d = String(r.date);

          dateSet.add(d);
          if (!byBase[baseKey]) byBase[baseKey] = {};
          if (!byBase[baseKey][d]) byBase[baseKey][d] = { spent: 0, d0: 0, d7: 0 };

          const b = byBase[baseKey][d];
          b.spent += safeNum(r.spent);
          b.d0 += safeNum(r.D0_PURCHASE_VALUE);
          b.d7 += safeNum(r.D7_PURCHASE_VALUE);
        });
      });

      const dates = Array.from(dateSet).sort();
      const baseKeys = Object.keys(byBase).sort();

      function seriesBaseName(baseKey) {
        const [c, m, p] = String(baseKey).split("|");
        const parts = [];
        if (!state.collapse.countries) parts.push(c);
        if (!state.collapse.medias) parts.push(m);
        if (!state.collapse.productTypes) parts.push(String(p).toUpperCase());
        return parts.length ? parts.join(" / ") : ALL_VALUE;
      }

      const series = [];
      baseKeys.forEach((bk, i) => {
        const color = palette[i % palette.length];
        windowsSel.forEach((win) => {
          const isD7 = win === "D7";
          const data = dates.map((d) => {
            const b = byBase[bk][d];
            if (!b) return null;
            return safeDiv(isD7 ? b.d7 : b.d0, b.spent);
          });

          series.push({
            name: `${seriesBaseName(bk)} · ${win}`,
            type: "line",
            data,
            showSymbol: false,
            connectNulls: false,
            lineStyle: { width: 2, type: isD7 ? "dashed" : "solid" },
            itemStyle: { color },
          });
        });
      });

      const option = {
        grid: { left: 56, right: 18, top: 44, bottom: 58, containLabel: true },
        legend: { top: 6, type: "scroll" },
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            if (!params || !params.length) return "";
            const axis = params[0].axisValueLabel || params[0].axisValue || "";
            const lines = [axis];
            params.forEach((p) => {
              lines.push(`${p.marker}${p.seriesName}：${formatPct01(p.data, 1)}`);
            });
            return lines.join("<br/>");
          },
        },
        xAxis: {
          type: "category",
          data: dates,
          axisLabel: {
            formatter: (v) => String(v).slice(5), // MM-DD
            fontSize: 11,
          },
        },
        yAxis: {
          type: "value",
          axisLabel: { formatter: (v) => formatPct01(v, 0) },
          splitLine: { lineStyle: { color: "rgba(148,163,184,.18)" } },
        },
        series,
      };

      chart.setOption(option, true);
    }

    function buildTableTitleSuffix() {
      const mediasText = state.collapse.medias
        ? "全部媒体"
        : uniq(state.medias).join("+") || "全部媒体";

      const typesText = state.collapse.productTypes
        ? "全部类型"
        : uniq(state.productTypes).map((t) => String(t).toUpperCase()).join("+") || "全部类型";

      return `（${mediasText}，${typesText}）`;
    }

    function renderTable() {
      const tableTitleEl = getDom("table-title-roi");
      const tableEl = getDom("table-roi");
      if (!tableEl) return;

      const monthsSel = uniq(state.months).sort();
      const windowsSel = uniq(state.windows);

      const yearsSet = new Set(monthsSel.map((m) => String(m).slice(0, 4)));

      const rowCountries = state.collapse.countries
        ? [ALL_VALUE]
        : FIXED_COUNTRY_ORDER.filter((c) => state.countries.includes(c));

      const rowMedias = state.collapse.medias ? [ALL_VALUE] : uniq(state.medias);
      const rowTypes = state.collapse.productTypes ? [ALL_VALUE] : uniq(state.productTypes);

      const addMedia = !state.collapse.medias;
      const addType = !state.collapse.productTypes;

      const headers = ["国家"];
      if (addMedia) headers.push("媒体");
      if (addType) headers.push("产品类型");
      monthsSel.forEach((mk) => {
        windowsSel.forEach((win) => {
          headers.push(`${monthLabel(mk, yearsSet)}${win}充值ROI`);
        });
      });

      if (tableTitleEl) tableTitleEl.textContent = `当前筛选 · 充值ROI（%）${buildTableTitleSuffix()}`;

      // cache：month|win|c|m|p -> ratio
      const cache = {};
      function getCell(monthKey, win, c, m, p) {
        const k = `${monthKey}|${win}|${c}|${m}|${p}`;
        if (cache.hasOwnProperty(k)) return cache[k];

        const rows = raw[monthKey] || [];
        let spentSum = 0;
        let purchaseSum = 0;

        rows.forEach((r) => {
          if (!r || !r.date) return;

          const rc = normalizeCountry(r.country);
          if (!FIXED_COUNTRY_ORDER.includes(rc)) return;

          // 国家筛选
          if (!state.collapse.countries) {
            if (rc !== c) return;
          } else {
            // collapse 时依然只统计 FIXED_COUNTRY_ORDER
            if (!state.countries.includes(rc)) return;
          }

          // 媒体筛选
          const rm = normalizeMedia(r.media);
          if (!state.collapse.medias) {
            if (rm !== m) return;
          } else {
            if (!state.medias.includes(rm)) return;
          }

          // 产品类型筛选
          const rp = normalizeProductType(r.productType);
          if (!state.collapse.productTypes) {
            if (rp !== p) return;
          } else {
            if (!state.productTypes.includes(rp)) return;
          }

          spentSum += safeNum(r.spent);
          purchaseSum += safeNum(win === "D7" ? r.D7_PURCHASE_VALUE : r.D0_PURCHASE_VALUE);
        });

        const ratio = safeDiv(purchaseSum, spentSum);
        cache[k] = ratio;
        return ratio;
      }

      // build table DOM
      tableEl.innerHTML = "";
      const thead = document.createElement("thead");
      const trh = document.createElement("tr");
      headers.forEach((h) => {
        const th = document.createElement("th");
        th.textContent = h;
        trh.appendChild(th);
      });
      thead.appendChild(trh);
      tableEl.appendChild(thead);

      const tbody = document.createElement("tbody");

      rowCountries.forEach((c) => {
        rowMedias.forEach((m) => {
          rowTypes.forEach((p) => {
            const tr = document.createElement("tr");

            const tdC = document.createElement("td");
            tdC.textContent = c;
            tr.appendChild(tdC);

            if (addMedia) {
              const tdM = document.createElement("td");
              tdM.textContent = m;
              tr.appendChild(tdM);
            }

            if (addType) {
              const tdP = document.createElement("td");
              tdP.textContent = String(p).toUpperCase();
              tr.appendChild(tdP);
            }

            monthsSel.forEach((mk) => {
              windowsSel.forEach((win) => {
                const val = getCell(mk, win, c, m, p);
                const td = document.createElement("td");
                td.className = "num";
                td.textContent = formatPct01(val, 1);
                tr.appendChild(td);
              });
            });

            tbody.appendChild(tr);
          });
        });
      });

      tableEl.appendChild(tbody);
    }

    function renderInsights() {
      const summaryEl = cardEl.querySelector('.chart-summary[data-analysis-key="roi"]');
      if (!summaryEl) return;

      const monthsSel = uniq(state.months).sort();
      const yearsSet = new Set(monthsSel.map((m) => String(m).slice(0, 4)));

      const db = window.PAID_ANALYSIS_TEXT || {};
      const bucket = db[MODULE_KEY] || {};

      summaryEl.innerHTML = "";

      const wrap = document.createElement("div");
      wrap.className = "roi-insights";

      const title = document.createElement("div");
      title.className = "roi-insights-title";
      title.textContent = "数据分析";
      wrap.appendChild(title);

      monthsSel.forEach((mk) => {
        const item = document.createElement("div");
        item.className = "roi-insights-item";

        const m = document.createElement("div");
        m.className = "roi-insights-month";
        m.textContent = `${monthLabel(mk, yearsSet)}（${mk}）`;
        item.appendChild(m);

        const t = document.createElement("div");
        t.className = "roi-insights-text";
        t.textContent = bucket[mk] || "（该月暂无文案）";
        item.appendChild(t);

        wrap.appendChild(item);
      });

      summaryEl.appendChild(wrap);
    }

    function renderAll() {
      ensureNonEmpty();

      renderRadioView();

      renderChipGroup({
        containerId: "roi-months",
        groupKey: "months",
        values: opts.months,
        selected: state.months,
        maxSelect: 3,
        getLabel: (v) => monthLabel(v, new Set(opts.months.map((m) => String(m).slice(0, 4)))),
      });

      renderChipGroup({
        containerId: "roi-countries",
        groupKey: "countries",
        values: sortCountries(opts.countries),
        selected: state.countries,
        specialAllNoBreakdown: true,
        collapseKey: "countries",
        getLabel: (v) => v,
      });

      renderChipGroup({
        containerId: "roi-medias",
        groupKey: "medias",
        values: opts.medias,
        selected: state.medias,
        specialAllNoBreakdown: true,
        collapseKey: "medias",
        getLabel: (v) => v,
      });

      renderChipGroup({
        containerId: "roi-productTypes",
        groupKey: "productTypes",
        values: opts.productTypes,
        selected: state.productTypes,
        specialAllNoBreakdown: true,
        collapseKey: "productTypes",
        getLabel: (v) => String(v).toUpperCase(),
      });

      renderChipGroup({
        containerId: "roi-windows",
        groupKey: "windows",
        values: ["D0", "D7"],
        selected: state.windows,
        getLabel: (v) => v,
      });

      if (state.view === "line") renderLine();
      else renderBar();

      renderTable();
      renderInsights();
    }

    function resetState() {
      state.view = "bar";
      state.months = pickDefaultMonths(opts.months);
      state.countries = opts.countries.slice();
      state.medias = opts.medias.slice();
      state.productTypes = opts.productTypes.slice();
      state.windows = ["D0", "D7"];
      state.collapse = { countries: false, medias: false, productTypes: false };

      const hintEl = getDom("roi-hint");
      if (hintEl) hintEl.textContent = "";
    }

    function bindPanelEvents() {
      if (!panelEl) return;

      panelEl.addEventListener("change", (e) => {
        const t = e.target;
        if (!(t instanceof HTMLInputElement)) return;

        // view radio
        if (t.type === "radio" && t.name === "roi-view-radio") {
          state.view = t.value;
          renderAll();
          return;
        }

        if (t.type !== "checkbox") return;

        const group = t.dataset.group;
        const val = t.value;

        if (!group) return;

        // special no-split
        if (t.dataset.special === "nosplit") {
          const ck = !!t.checked;
          const collapseKey = t.dataset.collapse;
          if (collapseKey) state.collapse[collapseKey] = ck;
          if (ck && opts[group]) state[group] = opts[group].slice();
          renderAll();
          return;
        }

        // ignore clicks on disabled
        if (t.disabled) return;

        // normal checkbox
        const arr = state[group] ? state[group].slice() : [];
        const idx = arr.indexOf(val);

        if (t.checked) {
          if (idx < 0) arr.push(val);
        } else {
          if (idx >= 0) arr.splice(idx, 1);
        }

        state[group] = arr;

        if (group === "months") enforceMonthLimit();
        ensureNonEmpty();
        renderAll();
      });

      panelEl.addEventListener("click", (e) => {
        const target = e.target;
        if (!(target instanceof Element)) return;
        const btn = target.closest("button");
        if (!btn) return;

        if (btn.id === "roi-reset") {
          resetState();
          renderAll();
        }
      });
    }

    bindPanelEvents();
    renderAll();
  }

  // register
  const pd = window.PaidDashboard;
  if (pd && typeof pd.registerModule === "function") {
    pd.registerModule(MODULE_KEY, initModule);
  } else {
    // fallback（一般不会走到）
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initModule);
    } else {
      initModule();
    }
  }
})();
