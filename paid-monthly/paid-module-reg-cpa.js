/**
 * paid-module-reg-cpa.js
 * 模块2：注册单价(CPA)
 *
 * 交互：
 * 1) 顶部筛选：月份(最多3)、国家/媒体/产品类型（含“全选但不区分”）、视图（月度柱状 / 日级折线）
 * 2) 图表：
 *    - 柱状图：X轴国家（固定顺序 GH/KE/NG/TZ），Y轴CPA=spent/registration（USD）
 *    - 折线图：日级CPA，跨月连贯；默认按 country × media × productType 拆线
 * 3) 表格：月度汇总（注册数 + 注册单价），标题自动带（媒体，产品）括号
 *
 * 依赖：
 * - window.RAW_PAID_BY_MONTH（paid-data.js）
 * - window.echarts
 * - （可选）window.PaidDashboard：复用颜色/格式化/resize管理
 */
(function () {
  const MODULE_NAME = "reg_cpa";

  // 需要和 index.html 对齐
  const CARD_ID = "card-paid-reg-cpa";
  const CHART_ID = "chart-paid-reg-cpa";

  // 本模块内部 UI 的唯一前缀（避免和其他模块冲突）
  const UI = "regcpa";
  const VIEW_CONTAINER_ID = `${UI}-view`;
  const MONTHS_CONTAINER_ID = `${UI}-months`;
  const COUNTRIES_CONTAINER_ID = `${UI}-countries`;
  const MEDIAS_CONTAINER_ID = `${UI}-medias`;
  const PTS_CONTAINER_ID = `${UI}-pts`;

  const TABLE_TITLE_ID = `${UI}-table-title`;
  const TABLE_ID = `table-paid-${UI}`;

  // 固定国家顺序（柱状图 & 筛选器展示顺序）
  const BAR_COUNTRY_ORDER = ["GH", "KE", "NG", "TZ"];

  // ========== 基础工具 ==========
  function getRaw() {
    return window.RAW_PAID_BY_MONTH || {};
  }

  function uniq(arr) {
    const out = [];
    const seen = new Set();
    (arr || []).forEach((x) => {
      if (x == null) return;
      const v = String(x);
      if (!v) return;
      if (seen.has(v)) return;
      seen.add(v);
      out.push(v);
    });
    return out;
  }

  // PaidDashboard（可选）
  const PD = window.PaidDashboard || {};
  const safeDiv =
    typeof PD.safeDiv === "function"
      ? PD.safeDiv
      : function (a, b) {
          const na = Number(a);
          const nb = Number(b);
          if (!isFinite(na) || !isFinite(nb) || nb === 0) return null;
          return na / nb;
        };

  const formatInteger =
    typeof PD.formatInteger === "function"
      ? PD.formatInteger
      : function (v) {
          if (v == null || !isFinite(v)) return "-";
          return Math.round(v).toLocaleString();
        };

  const formatUSD =
    typeof PD.formatUSD === "function"
      ? PD.formatUSD
      : function (v, digits) {
          const d = typeof digits === "number" ? digits : 2;
          if (v == null || !isFinite(v)) return "-";
          return Number(v).toLocaleString(undefined, {
            minimumFractionDigits: d,
            maximumFractionDigits: d,
          });
        };

  const formatMonthLabel =
    typeof PD.formatMonthLabel === "function"
      ? PD.formatMonthLabel
      : function (monthKey) {
          if (!monthKey || typeof monthKey !== "string") return "";
          const parts = monthKey.split("-");
          const mm = parts[1] || monthKey;
          const mNum = parseInt(mm, 10) || 0;
          return (mNum > 0 ? mNum : mm) + "月";
        };

  function mediaLabel(m) {
    return String(m || "").toLowerCase();
  }
  function ptLabel(p) {
    return String(p || "").toLowerCase();
  }

  function getPalette() {
    if (Array.isArray(PD.COLORS) && PD.COLORS.length) return PD.COLORS;
    return ["#2563eb", "#7c3aed", "#0ea5e9", "#16a34a", "#f97316", "#dc2626", "#64748b"];
  }

  function qs(root, sel) {
    return (root || document).querySelector(sel);
  }

  // ========== 从数据里推导下拉/选项 ==========
  function buildMeta() {
    const RAW = getRaw();
    const months = Object.keys(RAW || {}).sort();

    const countries = [];
    const medias = [];
    const pts = [];

    months.forEach((m) => {
      (RAW[m] || []).forEach((r) => {
        if (!r) return;
        countries.push(r.country);
        medias.push(r.media);
        pts.push(r.productType);
      });
    });

    const uniqCountries = uniq(countries).map((c) => String(c).toUpperCase());
    const uniqMedias = uniq(medias).sort((a, b) => String(a).localeCompare(String(b)));
    const uniqPts = uniq(pts).sort((a, b) => {
      const la = ptLabel(a);
      const lb = ptLabel(b);
      // app 优先
      if (la === "app" && lb !== "app") return -1;
      if (lb === "app" && la !== "app") return 1;
      return la.localeCompare(lb);
    });

    const countriesOrdered = BAR_COUNTRY_ORDER.filter((c) => uniqCountries.includes(c));
    return {
      months,
      countries: countriesOrdered.length ? countriesOrdered : uniqCountries,
      medias: uniqMedias,
      productTypes: uniqPts,
    };
  }

  // ========== 状态 ==========
  const st = {
    view: "bar", // bar | line
    months: [],
    countries: [],
    medias: [],
    productTypes: [],
    unifyCountries: false,
    unifyMedias: false,
    unifyProductTypes: false,
  };

  function setDefaultState(meta) {
    st.view = "bar";
    st.months = meta.months.slice(-3);
    st.countries = meta.countries.slice();
    st.medias = meta.medias.slice();
    st.productTypes = meta.productTypes.slice();
    st.unifyCountries = false;
    st.unifyMedias = false;
    st.unifyProductTypes = false;
    normalizeState(meta);
  }

  function normalizeState(meta) {
    // months：按 meta.months 顺序，最多3个，至少1个
    const mSet = new Set(st.months || []);
    st.months = meta.months.filter((m) => mSet.has(m));
    if (!st.months.length) st.months = meta.months.slice(-3);
    if (st.months.length > 3) st.months = st.months.slice(-3);

    // countries：固定顺序，>=1；unify 强制全选
    if (st.unifyCountries) {
      st.countries = meta.countries.slice();
    } else {
      const cSet = new Set(st.countries || []);
      const picked = meta.countries.filter((c) => cSet.has(c));
      st.countries = picked.length ? picked : meta.countries.slice();
    }

    // medias
    if (st.unifyMedias) {
      st.medias = meta.medias.slice();
    } else {
      const s = new Set(st.medias || []);
      const picked = meta.medias.filter((x) => s.has(x));
      st.medias = picked.length ? picked : meta.medias.slice();
    }

    // productTypes
    if (st.unifyProductTypes) {
      st.productTypes = meta.productTypes.slice();
    } else {
      const s = new Set(st.productTypes || []);
      const picked = meta.productTypes.filter((x) => s.has(x));
      st.productTypes = picked.length ? picked : meta.productTypes.slice();
    }

    if (st.view !== "bar" && st.view !== "line") st.view = "bar";
  }

  function getSelections(meta) {
    return {
      view: st.view,
      months: st.months.slice(),
      countries: st.countries.slice(),
      medias: st.medias.slice(),
      productTypes: st.productTypes.slice(),
      unifyCountries: !!st.unifyCountries,
      unifyMedias: !!st.unifyMedias,
      unifyProductTypes: !!st.unifyProductTypes,
    };
  }

  // ========== UI：插入筛选器与表格容器 ==========
  function ensureModuleUI(card) {
    const controls = qs(card, ".chart-controls");
    if (controls && !qs(controls, `[data-${UI}-filters="1"]`)) {
      const blocks = [];

      // 视图（radio）
      const bView = document.createElement("div");
      bView.className = "chart-mini-filter";
      bView.setAttribute(`data-${UI}-filters`, "1");
      bView.innerHTML = `
        <span class="chart-mini-label">视图：</span>
        <div class="chart-mini-radio" id="${VIEW_CONTAINER_ID}"></div>
      `;
      blocks.push(bView);

      // 月份（chips）
      const bMonths = document.createElement("div");
      bMonths.className = "chart-mini-filter";
      bMonths.setAttribute(`data-${UI}-filters`, "1");
      bMonths.innerHTML = `
        <span class="chart-mini-label">月份：</span>
        <div class="chart-mini-chips" id="${MONTHS_CONTAINER_ID}"></div>
      `;
      blocks.push(bMonths);

      // 国家
      const bCountries = document.createElement("div");
      bCountries.className = "chart-mini-filter";
      bCountries.setAttribute(`data-${UI}-filters`, "1");
      bCountries.innerHTML = `
        <span class="chart-mini-label">国家：</span>
        <div class="chart-mini-chips" id="${COUNTRIES_CONTAINER_ID}"></div>
      `;
      blocks.push(bCountries);

      // 媒体
      const bMedias = document.createElement("div");
      bMedias.className = "chart-mini-filter";
      bMedias.setAttribute(`data-${UI}-filters`, "1");
      bMedias.innerHTML = `
        <span class="chart-mini-label">媒体：</span>
        <div class="chart-mini-chips" id="${MEDIAS_CONTAINER_ID}"></div>
      `;
      blocks.push(bMedias);

      // 产品
      const bPts = document.createElement("div");
      bPts.className = "chart-mini-filter";
      bPts.setAttribute(`data-${UI}-filters`, "1");
      bPts.innerHTML = `
        <span class="chart-mini-label">产品：</span>
        <div class="chart-mini-chips" id="${PTS_CONTAINER_ID}"></div>
      `;
      blocks.push(bPts);

      blocks.forEach((b) => controls.appendChild(b));
    }

    // 表格（放在 chart-summary 之前）
    if (!qs(card, `[data-${UI}-table="1"]`)) {
      const tableWrap = document.createElement("div");
      tableWrap.className = "chart-table-section";
      tableWrap.setAttribute(`data-${UI}-table`, "1");
      tableWrap.innerHTML = `
        <div class="chart-table-header">
          <div class="chart-table-title" id="${TABLE_TITLE_ID}"></div>
        </div>
        <div class="chart-table-wrapper">
          <table class="chart-table" id="${TABLE_ID}"></table>
        </div>
      `;

      const summary = qs(card, ".chart-summary");
      if (summary && summary.parentNode) summary.parentNode.insertBefore(tableWrap, summary);
      else card.appendChild(tableWrap);
    }
  }

  // chip（checkbox）
  function createChip({ label, checked, disabled, onChange, title }) {
    const labelEl = document.createElement("label");
    labelEl.className = "filter-chip";
    if (checked) labelEl.classList.add("filter-chip-active");
    if (disabled) labelEl.classList.add("filter-chip-disabled");
    if (title) labelEl.title = title;

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = !!checked;
    if (disabled) input.disabled = true;

    input.addEventListener("change", () => {
      onChange && onChange(input.checked);
    });

    labelEl.appendChild(input);
    labelEl.appendChild(document.createTextNode(label));
    return labelEl;
  }

  // 渲染：视图 radio
  function renderView(onChange) {
    const box = document.getElementById(VIEW_CONTAINER_ID);
    if (!box) return;
    box.innerHTML = "";

    const name = `${UI}-view`;

    function addRadio(label, value, checked) {
      const l = document.createElement("label");
      const input = document.createElement("input");
      input.type = "radio";
      input.name = name;
      input.value = value;
      input.checked = checked;
      input.addEventListener("change", () => {
        if (!input.checked) return;
        st.view = value;
        onChange();
      });
      l.appendChild(input);
      l.appendChild(document.createTextNode(label));
      box.appendChild(l);
    }

    addRadio("柱状（月度）", "bar", st.view === "bar");
    addRadio("折线（日级）", "line", st.view === "line");
  }

  // 渲染：月份 chips（最多3）
  function renderMonths(meta, onChange) {
    const box = document.getElementById(MONTHS_CONTAINER_ID);
    if (!box) return;
    box.innerHTML = "";

    meta.months.forEach((m) => {
      box.appendChild(
        createChip({
          label: formatMonthLabel(m),
          checked: st.months.includes(m),
          onChange: (ck) => {
            const already = st.months.includes(m);

            if (ck && !already) {
              if (st.months.length >= 3) return onChange(); // 回滚
              st.months = st.months.concat([m]);
              return onChange();
            }

            if (!ck && already) {
              if (st.months.length <= 1) return onChange(); // 至少留1个
              st.months = st.months.filter((x) => x !== m);
              return onChange();
            }

            onChange();
          },
        })
      );
    });
  }

  // 渲染：维度 chips（含“全选但不区分”）
  function renderDim(meta, cfg) {
    const box = document.getElementById(cfg.containerId);
    if (!box) return;
    box.innerHTML = "";

    const unifyChecked = !!st[cfg.unifyFlagKey];
    const selectedSet = new Set(st[cfg.selectedKey] || []);

    // 特殊选项
    box.appendChild(
      createChip({
        label: "全选但不区分",
        checked: unifyChecked,
        onChange: (ck) => {
          st[cfg.unifyFlagKey] = ck;
          if (ck) st[cfg.selectedKey] = cfg.options.slice();
          cfg.onChange();
        },
      })
    );

    cfg.options.forEach((opt) => {
      box.appendChild(
        createChip({
          label: cfg.getLabel(opt),
          checked: selectedSet.has(opt),
          disabled: unifyChecked,
          onChange: (ck) => {
            if (st[cfg.unifyFlagKey]) return;

            const arr = (st[cfg.selectedKey] || []).slice();
            const has = arr.includes(opt);

            if (ck && !has) arr.push(opt);
            if (!ck && has) {
              if (arr.length <= 1) return cfg.onChange(); // 至少留1个
              st[cfg.selectedKey] = arr.filter((x) => x !== opt);
              return cfg.onChange();
            }

            st[cfg.selectedKey] = arr;
            cfg.onChange();
          },
        })
      );
    });
  }

  // ========== 数据计算 ==========
  function calcBarSeries(sel) {
    const RAW = getRaw();
    const categories = sel.unifyCountries ? ["ALL"] : sel.countries.slice();

    const countrySet = new Set(sel.countries);
    const mediaSet = new Set(sel.medias);
    const ptSet = new Set(sel.productTypes);

    const perMonthAgg = {}; // month -> { cat -> {spent, reg} }

    sel.months.forEach((month) => {
      const agg = {};
      categories.forEach((c) => (agg[c] = { spent: 0, reg: 0 }));

      (RAW[month] || []).forEach((r) => {
        if (!r) return;
        if (!sel.unifyCountries && !countrySet.has(r.country)) return;
        if (!mediaSet.has(r.media)) return;
        if (!ptSet.has(r.productType)) return;

        const key = sel.unifyCountries ? "ALL" : r.country;
        if (!agg[key]) agg[key] = { spent: 0, reg: 0 };

        const spent = Number(r.spent);
        const reg = Number(r.registration);
        if (isFinite(spent)) agg[key].spent += spent;
        if (isFinite(reg)) agg[key].reg += reg;
      });

      perMonthAgg[month] = agg;
    });

    const palette = getPalette();
    const series = sel.months.map((month, idx) => {
      return {
        name: formatMonthLabel(month),
        type: "bar",
        barMaxWidth: 34,
        itemStyle: { color: palette[idx % palette.length] },
        emphasis: { focus: "series" },
        data: categories.map((c) => {
          const a = (perMonthAgg[month] || {})[c] || { spent: 0, reg: 0 };
          return safeDiv(a.spent, a.reg);
        }),
      };
    });

    return { categories, series };
  }

  function calcLineSeries(sel) {
    const RAW = getRaw();

    const countrySet = new Set(sel.countries);
    const mediaSet = new Set(sel.medias);
    const ptSet = new Set(sel.productTypes);

    const dateSet = new Set();
    const seriesMap = new Map(); // key -> {c,m,p, byDate: Map(date->{spent,reg})}

    sel.months.forEach((month) => {
      (RAW[month] || []).forEach((r) => {
        if (!r) return;

        if (!sel.unifyCountries && !countrySet.has(r.country)) return;
        if (!mediaSet.has(r.media)) return;
        if (!ptSet.has(r.productType)) return;

        const date = r.date;
        if (!date) return;
        dateSet.add(date);

        const cKey = sel.unifyCountries ? "ALL" : r.country;
        const mKey = sel.unifyMedias ? "ALL" : r.media;
        const pKey = sel.unifyProductTypes ? "ALL" : r.productType;
        const key = `${cKey}|${mKey}|${pKey}`;

        let entry = seriesMap.get(key);
        if (!entry) {
          entry = { c: cKey, m: mKey, p: pKey, byDate: new Map() };
          seriesMap.set(key, entry);
        }

        const a = entry.byDate.get(date) || { spent: 0, reg: 0 };
        const spent = Number(r.spent);
        const reg = Number(r.registration);
        if (isFinite(spent)) a.spent += spent;
        if (isFinite(reg)) a.reg += reg;
        entry.byDate.set(date, a);
      });
    });

    const dates = Array.from(dateSet).sort();

    function seriesName(e) {
      const parts = [];
      if (!sel.unifyCountries) parts.push(e.c);
      if (!sel.unifyMedias) parts.push(e.m);
      if (!sel.unifyProductTypes) parts.push(ptLabel(e.p));
      return parts.length ? parts.join(" · ") : "ALL";
    }

    // 排序：国家→媒体→产品
    const countryOrder = new Map();
    BAR_COUNTRY_ORDER.forEach((c, i) => countryOrder.set(c, i));
    const mediaOrder = new Map();
    sel.medias.forEach((m, i) => mediaOrder.set(m, i));
    const ptOrder = new Map();
    sel.productTypes.forEach((p, i) => ptOrder.set(p, i));

    const entries = Array.from(seriesMap.values()).sort((a, b) => {
      const ca = countryOrder.has(a.c) ? countryOrder.get(a.c) : 1e9;
      const cb = countryOrder.has(b.c) ? countryOrder.get(b.c) : 1e9;
      if (ca !== cb) return ca - cb;

      const ma = mediaOrder.has(a.m) ? mediaOrder.get(a.m) : 1e9;
      const mb = mediaOrder.has(b.m) ? mediaOrder.get(b.m) : 1e9;
      if (ma !== mb) return ma - mb;

      const pa = ptOrder.has(a.p) ? ptOrder.get(a.p) : 1e9;
      const pb = ptOrder.has(b.p) ? ptOrder.get(b.p) : 1e9;
      return pa - pb;
    });

    const series = entries.map((e) => {
      return {
        name: seriesName(e),
        type: "line",
        showSymbol: false,
        connectNulls: true,
        lineStyle: { width: 2 },
        data: dates.map((d) => {
          const a = e.byDate.get(d);
          return a ? safeDiv(a.spent, a.reg) : null;
        }),
      };
    });

    return { dates, series };
  }

  // ========== 渲染：chart ==========
  function renderChart(chart, sel) {
    if (!chart) return;

    if (sel.view === "line") {
      const { dates, series } = calcLineSeries(sel);

      chart.setOption(
        {
          backgroundColor: "transparent",
          tooltip: {
            trigger: "axis",
            axisPointer: { type: "cross" },
            formatter: (params) => {
              if (!params || !params.length) return "";
              const x = params[0].axisValueLabel || "";
              let html = `<div style="font-weight:600;margin-bottom:6px">${x}</div>`;
              params.forEach((p) => {
                const v = p.data;
                const vTxt = v == null ? "-" : `${formatUSD(v, 2)} USD`;
                html += `<div>${p.marker}${p.seriesName}：${vTxt}</div>`;
              });
              return html;
            },
          },
          legend: { type: "scroll", top: 0 },
          grid: { left: 54, right: 22, top: 40, bottom: 58, containLabel: true },
          dataZoom: [
            { type: "inside", xAxisIndex: 0, filterMode: "filter" },
            { type: "slider", xAxisIndex: 0, height: 18, bottom: 22, filterMode: "filter" },
          ],
          xAxis: {
            type: "category",
            data: dates,
            axisLabel: { formatter: (v) => (typeof v === "string" ? v.slice(5) : v) },
          },
          yAxis: { type: "value", name: "CPA（USD）", axisLabel: { formatter: (v) => formatUSD(v, 2) } },
          series,
        },
        true
      );
      return;
    }

    const { categories, series } = calcBarSeries(sel);
    chart.setOption(
      {
        backgroundColor: "transparent",
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
          formatter: (params) => {
            if (!params || !params.length) return "";
            const cat = params[0].axisValueLabel || "";
            let html = `<div style="font-weight:600;margin-bottom:6px">${cat}</div>`;
            params.forEach((p) => {
              const v = p.data;
              const vTxt = v == null ? "-" : `${formatUSD(v, 2)} USD`;
              html += `<div>${p.marker}${p.seriesName}：${vTxt}</div>`;
            });
            return html;
          },
        },
        legend: { top: 0 },
        grid: { left: 54, right: 22, top: 40, bottom: 44, containLabel: true },
        xAxis: { type: "category", data: categories },
        yAxis: { type: "value", name: "CPA（USD）", axisLabel: { formatter: (v) => formatUSD(v, 2) } },
        series,
      },
      true
    );
  }

  // ========== 渲染：table（月度汇总） ==========
  function renderTable(meta, sel) {
    const titleEl = document.getElementById(TABLE_TITLE_ID);
    const tableEl = document.getElementById(TABLE_ID);
    if (!tableEl) return;

    const mediaPart = sel.unifyMedias ? "全媒体" : sel.medias.map(mediaLabel).join("+");
    const ptPart = sel.unifyProductTypes ? "全产品" : sel.productTypes.map(ptLabel).join("+");
    if (titleEl) titleEl.textContent = `当前筛选 · 注册数 & 注册单价（月度汇总）（${mediaPart}，${ptPart}）`;

    const RAW = getRaw();
    const countrySet = new Set(sel.countries);
    const mediaSet = new Set(sel.medias);
    const ptSet = new Set(sel.productTypes);

    const monthAgg = {}; // month -> Map(groupKey -> {spent, reg})
    const groupIndex = new Map(); // groupKey -> {c,m,p}

    sel.months.forEach((month) => {
      const map = new Map();
      (RAW[month] || []).forEach((r) => {
        if (!r) return;

        if (!sel.unifyCountries && !countrySet.has(r.country)) return;
        if (!mediaSet.has(r.media)) return;
        if (!ptSet.has(r.productType)) return;

        const cKey = sel.unifyCountries ? "ALL" : r.country;
        const mKey = sel.unifyMedias ? "ALL" : r.media;
        const pKey = sel.unifyProductTypes ? "ALL" : r.productType;
        const gKey = `${cKey}|${mKey}|${pKey}`;

        groupIndex.set(gKey, { c: cKey, m: mKey, p: pKey });

        const a = map.get(gKey) || { spent: 0, reg: 0 };
        const spent = Number(r.spent);
        const reg = Number(r.registration);
        if (isFinite(spent)) a.spent += spent;
        if (isFinite(reg)) a.reg += reg;
        map.set(gKey, a);
      });
      monthAgg[month] = map;
    });

    const countryOrder = new Map();
    BAR_COUNTRY_ORDER.forEach((c, i) => countryOrder.set(c, i));
    const mediaOrder = new Map();
    meta.medias.forEach((m, i) => mediaOrder.set(m, i));
    const ptOrder = new Map();
    meta.productTypes.forEach((p, i) => ptOrder.set(p, i));

    const groupKeys = Array.from(groupIndex.keys()).sort((ka, kb) => {
      const a = groupIndex.get(ka);
      const b = groupIndex.get(kb);
      if (!a || !b) return 0;

      const ca = countryOrder.has(a.c) ? countryOrder.get(a.c) : 1e9;
      const cb = countryOrder.has(b.c) ? countryOrder.get(b.c) : 1e9;
      if (ca !== cb) return ca - cb;

      const ma = mediaOrder.has(a.m) ? mediaOrder.get(a.m) : 1e9;
      const mb = mediaOrder.has(b.m) ? mediaOrder.get(b.m) : 1e9;
      if (ma !== mb) return ma - mb;

      const pa = ptOrder.has(a.p) ? ptOrder.get(a.p) : 1e9;
      const pb = ptOrder.has(b.p) ? ptOrder.get(b.p) : 1e9;
      return pa - pb;
    });

    // 表头
    const dimHeaders = ["国家"];
    if (!sel.unifyMedias) dimHeaders.push("媒体");
    if (!sel.unifyProductTypes) dimHeaders.push("产品类型");

    const metricHeaders = [];
    sel.months.forEach((m) => {
      const ml = formatMonthLabel(m);
      metricHeaders.push(`${ml}注册数`, `${ml}注册单价`);
    });

    let thead = "<thead><tr>";
    dimHeaders.forEach((h) => (thead += `<th>${h}</th>`));
    metricHeaders.forEach((h) => (thead += `<th class="num">${h}</th>`));
    thead += "</tr></thead>";

    // 表体
    let tbody = "<tbody>";
    if (!groupKeys.length) {
      const colspan = dimHeaders.length + metricHeaders.length;
      tbody += `<tr><td colspan="${colspan}">暂无数据</td></tr>`;
      tbody += "</tbody>";
      tableEl.innerHTML = thead + tbody;
      return;
    }

    groupKeys.forEach((gKey) => {
      const g = groupIndex.get(gKey);
      tbody += "<tr>";

      // 国家列始终保留。即使“全选但不区分国家”，这里也会显示 ALL。
      tbody += `<td>${sel.unifyCountries ? "ALL" : g.c}</td>`;
      if (!sel.unifyMedias) tbody += `<td>${g.m}</td>`;
      if (!sel.unifyProductTypes) tbody += `<td>${ptLabel(g.p)}</td>`;

      sel.months.forEach((m) => {
        const a = (monthAgg[m] && monthAgg[m].get(gKey)) || { spent: 0, reg: 0 };
        const reg = a.reg || 0;
        const cpa = safeDiv(a.spent, a.reg);
        tbody += `<td class="num">${formatInteger(reg)}</td>`;
        tbody += `<td class="num">${cpa == null ? "-" : formatUSD(cpa, 2)}</td>`;
      });

      tbody += "</tr>";
    });

    tbody += "</tbody>";
    tableEl.innerHTML = thead + tbody;
  }

  // ========== mount ==========
  function mount() {
    const dom = document.getElementById(CHART_ID);
    if (!dom || !window.echarts) return;

    const card =
      document.getElementById(CARD_ID) ||
      (dom.closest ? dom.closest(".chart-card") : null) ||
      dom.parentElement;

    if (!card) return;

    const meta = buildMeta();
    if (!meta.months.length) return;

    if (!st.months.length) setDefaultState(meta);

    ensureModuleUI(card);

    const chart = echarts.init(dom);
    if (PD && typeof PD.registerChart === "function") PD.registerChart(chart);

    function rerender() {
      const m = buildMeta(); // 未来新增媒体/月也能自动出现在筛选器里
      normalizeState(m);

      renderView(rerender);
      renderMonths(m, rerender);
      renderDim(m, {
        containerId: COUNTRIES_CONTAINER_ID,
        options: m.countries,
        selectedKey: "countries",
        unifyFlagKey: "unifyCountries",
        getLabel: (x) => String(x),
        onChange: rerender,
      });
      renderDim(m, {
        containerId: MEDIAS_CONTAINER_ID,
        options: m.medias,
        selectedKey: "medias",
        unifyFlagKey: "unifyMedias",
        getLabel: (x) => String(x),
        onChange: rerender,
      });
      renderDim(m, {
        containerId: PTS_CONTAINER_ID,
        options: m.productTypes,
        selectedKey: "productTypes",
        unifyFlagKey: "unifyProductTypes",
        getLabel: (x) => ptLabel(x),
        onChange: rerender,
      });

      const sel = getSelections(m);
      renderChart(chart, sel);
      renderTable(m, sel);
    }

    rerender();
  }

  // 与 index 的模块机制对齐（有 PaidDashboard 就 registerModule；没有也能跑）
  if (window.PaidDashboard && typeof window.PaidDashboard.registerModule === "function") {
    window.PaidDashboard.registerModule(MODULE_NAME, mount);
  } else {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
    else mount();
  }
})();
