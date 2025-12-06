/**
 * paid-module-arppu.js
 * 模块：D0/D7 ARPPU
 * 口径：
 * - D0_ARPPU = D0_PURCHASE_VALUE / D0_unique_purchase
 * - D7_ARPPU = D7_PURCHASE_VALUE / D7_unique_purchase
 *
 * 数据源：window.RAW_PAID_BY_MONTH（paid-data.js）
 * 粒度：date(UTC+0日切) × country × media × productType
 */

(function () {
  const MODULE_NAME = "arppu";

  // ====== 如果你的 index.html 里 ARPPU 模块 DOM id 不同，只改这里 ======
  const DOM_IDS = {
    cardId: "card-paid-arppu",
    chartId: "chart-paid-arppu",
  };

  // ====== 柱状图国家固定顺序（按你要求） ======
  const COUNTRY_ORDER = ["GH", "KE", "NG", "TZ"];

  // ====== 常量 ======
  const MAX_MONTHS = 3;
  const DAY_TYPES = ["D0", "D7"];
  const NO_SPLIT_LABEL = "全选但不区分";
  const ALL_KEY = "ALL";

  // 取色：优先用 PaidDashboard 的色板（如果你项目里有），否则给个兜底
  const DEFAULT_COLORS = [
    "#2563eb",
    "#22c55e",
    "#f97316",
    "#7c3aed",
    "#06b6d4",
    "#ef4444",
    "#f59e0b",
    "#14b8a6",
  ];

  function getPalette() {
    const p =
      window.PaidDashboard &&
      Array.isArray(window.PaidDashboard.COLORS) &&
      window.PaidDashboard.COLORS.length
        ? window.PaidDashboard.COLORS
        : DEFAULT_COLORS;
    return p;
  }

  // ====== 工具函数 ======
  function safeNumber(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  function safeDiv(num, den) {
    const d = Number(den);
    if (!Number.isFinite(d) || d === 0) return null;
    const n = Number(num);
    if (!Number.isFinite(n)) return null;
    return n / d;
  }

  function uniqSorted(arr) {
    return Array.from(new Set(arr)).sort();
  }

  function formatMonthLabel(monthKey) {
    // "2025-09" -> "9月"
    if (!monthKey || typeof monthKey !== "string") return String(monthKey || "");
    const parts = monthKey.split("-");
    if (parts.length !== 2) return monthKey;
    const m = Number(parts[1]);
    return Number.isFinite(m) ? `${m}月` : monthKey;
  }

  function formatUSD(v, digits) {
    const d = Number.isFinite(digits) ? digits : 2;
    if (v === null || v === undefined || !Number.isFinite(Number(v))) return "-";
    const n = Number(v);
    try {
      return n.toLocaleString(undefined, {
        minimumFractionDigits: d,
        maximumFractionDigits: d,
      });
    } catch (e) {
      return n.toFixed(d);
    }
  }

  function toLowerLabel(v) {
    return (v == null ? "" : String(v)).trim().toLowerCase();
  }

  function ensureStyleOnce() {
    const styleId = "paid-arppu-injected-style";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      /* 仅补齐 ARPPU 模块表格/筛选器的必要样式（不改你全局主题色） */
      .chart-mini-filter.paid-module-filter { margin-left: 10px; }
      .paid-module-filters {
        display: flex;
        flex-direction: column;
        gap: 8px;
        align-items: flex-end;
        margin-top: 6px;
      }
      .paid-module-filters .chart-mini-filter {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        justify-content: flex-end;
      }

      .chart-table-section {
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px dashed rgba(148, 163, 184, 0.55);
      }
      .chart-table-title {
        font-size: 12px;
        color: rgba(71, 85, 105, 1);
        margin-bottom: 8px;
      }
      .chart-table-wrapper {
        overflow: auto;
        border: 1px solid rgba(148, 163, 184, 0.35);
        border-radius: 10px;
        background: rgba(255,255,255,0.7);
      }
      .chart-table {
        width: 100%;
        border-collapse: collapse;
        min-width: 820px;
      }
      .chart-table th, .chart-table td {
        font-size: 12px;
        padding: 10px 12px;
        border-bottom: 1px solid rgba(148, 163, 184, 0.22);
        white-space: nowrap;
        text-align: right;
      }
      .chart-table th:first-child, .chart-table td:first-child { text-align: left; }
      .chart-table th:nth-child(2), .chart-table td:nth-child(2) { text-align: left; }
      .chart-table th:nth-child(3), .chart-table td:nth-child(3) { text-align: left; }
      .chart-table thead th {
        position: sticky;
        top: 0;
        background: rgba(248, 250, 252, 0.95);
        z-index: 1;
        font-weight: 600;
        color: rgba(30, 41, 59, 1);
      }
      .chart-table tbody tr:hover td {
        background: rgba(241, 245, 249, 0.55);
      }
      .chart-table .muted {
        color: rgba(100, 116, 139, 1);
      }
    `;
    document.head.appendChild(style);
  }

  function buildOptionsFromRaw(raw) {
    const months = Object.keys(raw || {}).filter(Boolean).sort();
    const countries = [];
    const medias = [];
    const productTypes = [];

    months.forEach((m) => {
      const rows = raw[m] || [];
      rows.forEach((r) => {
        if (!r) return;
        if (r.country) countries.push(r.country);
        if (r.media) medias.push(r.media);
        if (r.productType) productTypes.push(r.productType);
      });
    });

    return {
      months,
      countries: uniqSorted(countries),
      medias: uniqSorted(medias),
      productTypes: uniqSorted(productTypes),
    };
  }

  function buildDefaultState(options) {
    const months = options.months.slice(-2);
    return {
      view: "bar", // "bar" | "line"
      months: months.length ? months : options.months.slice(0, 1),
      countries: options.countries.slice(),
      medias: options.medias.slice(),
      productTypes: options.productTypes.slice(),
      dayTypes: ["D0", "D7"],

      noSplitCountries: false,
      noSplitMedias: false,
      noSplitProductTypes: false,
    };
  }

  function setArrayToAll(target, values) {
    target.length = 0;
    values.forEach((v) => target.push(v));
  }

  function toggleInArray(arr, value, checked) {
    const idx = arr.indexOf(value);
    if (checked) {
      if (idx === -1) arr.push(value);
    } else {
      if (idx !== -1) arr.splice(idx, 1);
    }
  }

  function countryCategoriesFromState(state) {
    if (state.noSplitCountries) return [ALL_KEY];

    const set = new Set(state.countries);
    const inOrder = COUNTRY_ORDER.filter((c) => set.has(c));
    const rest = state.countries.filter((c) => !COUNTRY_ORDER.includes(c)).sort();
    return inOrder.concat(rest);
  }

  function ensureModuleUI(cardEl, state, options) {
    // 找到 chart-controls，把筛选器塞进去（不影响原有 badge）
    const controlsEl = cardEl.querySelector(".chart-controls");
    if (!controlsEl) return null;

    // 避免重复注入
    let wrap = controlsEl.querySelector(
      `.paid-module-filters[data-module="${MODULE_NAME}"]`
    );
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "paid-module-filters";
      wrap.setAttribute("data-module", MODULE_NAME);
      controlsEl.appendChild(wrap);
    }

    // 提供容器（用 data-slot 标识，方便重绘）
    function ensureSlot(slot) {
      let el = wrap.querySelector(`[data-slot="${slot}"]`);
      if (!el) {
        el = document.createElement("div");
        el.className = "chart-mini-filter paid-module-filter";
        el.setAttribute("data-slot", slot);
        wrap.appendChild(el);
      }
      return el;
    }

    const slotMonths = ensureSlot("months");
    const slotCountries = ensureSlot("countries");
    const slotView = ensureSlot("view");
    const slotMedias = ensureSlot("medias");
    const slotProducts = ensureSlot("products");
    const slotDayTypes = ensureSlot("daytypes");
    const slotActions = ensureSlot("actions");

    function renderChips(slotEl, cfg) {
      const {
        label,
        values,
        selected,
        roleValue,
        maxSelect,
        noSplitRole,
        noSplitChecked,
        noSplitEnabled,
      } = cfg;

      slotEl.innerHTML = "";

      const labelEl = document.createElement("span");
      labelEl.className = "chart-mini-label";
      labelEl.textContent = label;
      slotEl.appendChild(labelEl);

      const chips = document.createElement("div");
      chips.className = "chart-mini-chips";
      slotEl.appendChild(chips);

      // 特殊：全选但不区分
      if (noSplitEnabled) {
        const nsLabel = document.createElement("label");
        nsLabel.className =
          "filter-chip" + (noSplitChecked ? " filter-chip-active" : "");
        const nsInput = document.createElement("input");
        nsInput.type = "checkbox";
        nsInput.checked = !!noSplitChecked;
        nsInput.setAttribute("data-role", noSplitRole);
        nsInput.value = "1";
        const nsSpan = document.createElement("span");
        nsSpan.textContent = NO_SPLIT_LABEL;
        nsLabel.appendChild(nsInput);
        nsLabel.appendChild(nsSpan);
        chips.appendChild(nsLabel);
      }

      values.forEach((v) => {
        const checked = selected.indexOf(v) !== -1;

        const chip = document.createElement("label");
        chip.className = "filter-chip" + (checked ? " filter-chip-active" : "");

        const input = document.createElement("input");
        input.type = "checkbox";
        input.value = v;
        input.checked = checked;
        input.setAttribute("data-role", roleValue);

        // 当“全选但不区分”开启时，把普通项禁用，避免用户误以为拆分还生效
        if (noSplitEnabled && noSplitChecked) input.disabled = true;

        const span = document.createElement("span");
        span.textContent =
          roleValue === "month" ? formatMonthLabel(v) : String(v);

        chip.appendChild(input);
        chip.appendChild(span);

        chips.appendChild(chip);
      });

      // 小提示（仅月份）
      if (roleValue === "month" && maxSelect) {
        const hint = document.createElement("span");
        hint.className = "chart-badge";
        hint.style.marginLeft = "6px";
        hint.textContent = `最多选${maxSelect}个月`;
        slotEl.appendChild(hint);
      }
    }

    function renderViewRadios(slotEl) {
      slotEl.innerHTML = "";

      const labelEl = document.createElement("span");
      labelEl.className = "chart-mini-label";
      labelEl.textContent = "图表：";
      slotEl.appendChild(labelEl);

      const radioWrap = document.createElement("div");
      radioWrap.className = "chart-mini-radio";
      slotEl.appendChild(radioWrap);

      const name = `${MODULE_NAME}-view`;

      const optBar = document.createElement("label");
      optBar.innerHTML = `<input type="radio" name="${name}" value="bar" ${
        state.view === "bar" ? "checked" : ""
      } data-role="view" />月度柱状图`;

      const optLine = document.createElement("label");
      optLine.innerHTML = `<input type="radio" name="${name}" value="line" ${
        state.view === "line" ? "checked" : ""
      } data-role="view" />日级折线图`;

      radioWrap.appendChild(optBar);
      radioWrap.appendChild(optLine);
    }

    function renderDayTypeChips(slotEl) {
      slotEl.innerHTML = "";

      const labelEl = document.createElement("span");
      labelEl.className = "chart-mini-label";
      labelEl.textContent = "口径：";
      slotEl.appendChild(labelEl);

      const chips = document.createElement("div");
      chips.className = "chart-mini-chips";
      slotEl.appendChild(chips);

      DAY_TYPES.forEach((dt) => {
        const checked = state.dayTypes.indexOf(dt) !== -1;

        const chip = document.createElement("label");
        chip.className = "filter-chip" + (checked ? " filter-chip-active" : "");

        const input = document.createElement("input");
        input.type = "checkbox";
        input.value = dt;
        input.checked = checked;
        input.setAttribute("data-role", "dayType");

        const span = document.createElement("span");
        span.textContent = dt;

        chip.appendChild(input);
        chip.appendChild(span);

        chips.appendChild(chip);
      });
    }

    function renderActions(slotEl) {
      slotEl.innerHTML = "";
      const btn = document.createElement("button");
      btn.className = "btn";
      btn.type = "button";
      btn.textContent = "全选 / 重置";
      btn.setAttribute("data-role", "reset");
      slotEl.appendChild(btn);
    }

    function rerender() {
      renderChips(slotMonths, {
        label: "月份：",
        values: options.months,
        selected: state.months,
        roleValue: "month",
        maxSelect: MAX_MONTHS,
        noSplitEnabled: false,
      });

      renderChips(slotCountries, {
        label: "国家：",
        values: options.countries,
        selected: state.countries,
        roleValue: "country",
        noSplitRole: "countryNoSplit",
        noSplitChecked: state.noSplitCountries,
        noSplitEnabled: true,
      });

      renderViewRadios(slotView);

      renderChips(slotMedias, {
        label: "媒体：",
        values: options.medias,
        selected: state.medias,
        roleValue: "media",
        noSplitRole: "mediaNoSplit",
        noSplitChecked: state.noSplitMedias,
        noSplitEnabled: true,
      });

      renderChips(slotProducts, {
        label: "形态：",
        values: options.productTypes,
        selected: state.productTypes,
        roleValue: "productType",
        noSplitRole: "productTypeNoSplit",
        noSplitChecked: state.noSplitProductTypes,
        noSplitEnabled: true,
      });

      renderDayTypeChips(slotDayTypes);
      renderActions(slotActions);
    }

    // 事件委托：所有 input/button 都往 wrapper 冒泡，在这里统一处理
    function bind(onChange) {
      wrap.addEventListener("change", function (e) {
        const t = e.target;
        if (!t || !t.getAttribute) return;

        const role = t.getAttribute("data-role");
        if (!role) return;

        // ===== view 切换 =====
        if (role === "view") {
          state.view = t.value === "line" ? "line" : "bar";
          rerender();
          if (typeof onChange === "function") onChange();
          return;
        }

        // ===== reset =====
        // reset 是 click，不走 change

        // ===== 月份 =====
        if (role === "month") {
          const val = t.value;
          toggleInArray(state.months, val, t.checked);

          // 至少保留1个月
          if (state.months.length === 0) {
            t.checked = true;
            toggleInArray(state.months, val, true);
            rerender();
            if (typeof onChange === "function") onChange();
            return;
          }

          // 最多3个月
          if (state.months.length > MAX_MONTHS) {
            // 超出就撤回本次选择
            t.checked = false;
            toggleInArray(state.months, val, false);
            alert(`月份最多选择 ${MAX_MONTHS} 个。`);
          }

          rerender();
          if (typeof onChange === "function") onChange();
          return;
        }

        // ===== 国家 / 媒体 / 形态（普通选项） =====
        if (role === "country") {
          if (state.noSplitCountries) {
            // 若正在“不区分”，先退出再处理
            state.noSplitCountries = false;
          }
          toggleInArray(state.countries, t.value, t.checked);
          if (state.countries.length === 0) {
            setArrayToAll(state.countries, options.countries);
          }
          rerender();
          if (typeof onChange === "function") onChange();
          return;
        }

        if (role === "media") {
          if (state.noSplitMedias) state.noSplitMedias = false;
          toggleInArray(state.medias, t.value, t.checked);
          if (state.medias.length === 0) {
            setArrayToAll(state.medias, options.medias);
          }
          rerender();
          if (typeof onChange === "function") onChange();
          return;
        }

        if (role === "productType") {
          if (state.noSplitProductTypes) state.noSplitProductTypes = false;
          toggleInArray(state.productTypes, t.value, t.checked);
          if (state.productTypes.length === 0) {
            setArrayToAll(state.productTypes, options.productTypes);
          }
          rerender();
          if (typeof onChange === "function") onChange();
          return;
        }

        // ===== 全选但不区分 =====
        if (role === "countryNoSplit") {
          state.noSplitCountries = !!t.checked;
          if (state.noSplitCountries) {
            setArrayToAll(state.countries, options.countries);
          }
          rerender();
          if (typeof onChange === "function") onChange();
          return;
        }

        if (role === "mediaNoSplit") {
          state.noSplitMedias = !!t.checked;
          if (state.noSplitMedias) {
            setArrayToAll(state.medias, options.medias);
          }
          rerender();
          if (typeof onChange === "function") onChange();
          return;
        }

        if (role === "productTypeNoSplit") {
          state.noSplitProductTypes = !!t.checked;
          if (state.noSplitProductTypes) {
            setArrayToAll(state.productTypes, options.productTypes);
          }
          rerender();
          if (typeof onChange === "function") onChange();
          return;
        }

        // ===== D0/D7 多选 =====
        if (role === "dayType") {
          toggleInArray(state.dayTypes, t.value, t.checked);
          if (state.dayTypes.length === 0) {
            // 至少保留一个
            t.checked = true;
            toggleInArray(state.dayTypes, t.value, true);
          }
          rerender();
          if (typeof onChange === "function") onChange();
          return;
        }
      });

      wrap.addEventListener("click", function (e) {
        const t = e.target;
        if (!t || !t.getAttribute) return;
        const role = t.getAttribute("data-role");
        if (role !== "reset") return;

        // reset：全选 + 取消“不区分”
        state.noSplitCountries = false;
        state.noSplitMedias = false;
        state.noSplitProductTypes = false;

        setArrayToAll(state.countries, options.countries);
        setArrayToAll(state.medias, options.medias);
        setArrayToAll(state.productTypes, options.productTypes);
        state.dayTypes = ["D0", "D7"];

        // 月份保留当前（不动）
        if (!state.months.length && options.months.length) {
          state.months = options.months.slice(-1);
        }

        rerender();
        if (typeof onChange === "function") onChange();
      });
    }

    rerender();

    return { rerender, bind };
  }

  function ensureTableSection(cardEl) {
    let section = cardEl.querySelector(
      `.chart-table-section[data-module="${MODULE_NAME}"]`
    );
    if (section) return section;

    section = document.createElement("div");
    section.className = "chart-table-section";
    section.setAttribute("data-module", MODULE_NAME);

    const title = document.createElement("div");
    title.className = "chart-table-title";
    title.setAttribute("data-role", "table-title");
    section.appendChild(title);

    const wrapper = document.createElement("div");
    wrapper.className = "chart-table-wrapper";
    section.appendChild(wrapper);

    const table = document.createElement("table");
    table.className = "chart-table";
    table.setAttribute("data-role", "table");
    wrapper.appendChild(table);

    // 插入位置：chart 后面、analysis(summary) 前面
    const chartEl = cardEl.querySelector(`#${DOM_IDS.chartId}`);
    const summaryEl = cardEl.querySelector(".chart-summary");
    if (summaryEl && summaryEl.parentNode) {
      summaryEl.parentNode.insertBefore(section, summaryEl);
    } else if (chartEl && chartEl.parentNode) {
      chartEl.parentNode.insertBefore(section, chartEl.nextSibling);
    } else {
      cardEl.appendChild(section);
    }

    return section;
  }

  // ====== 数据聚合：月 ======
  function buildMonthlyAgg(raw, months, state) {
    const cSel = new Set(state.countries);
    const mSel = new Set(state.medias);
    const pSel = new Set(state.productTypes);

    // 结构：agg[groupKey][month][dayType] = { num, den }
    const agg = Object.create(null);

    function groupKeyForRow(r) {
      const c = state.noSplitCountries ? ALL_KEY : r.country;
      const m = state.noSplitMedias ? ALL_KEY : r.media;
      const p = state.noSplitProductTypes ? ALL_KEY : r.productType;
      return `${c}||${m}||${p}`;
    }

    function ensureCell(gKey, monthKey, dt) {
      if (!agg[gKey]) agg[gKey] = Object.create(null);
      if (!agg[gKey][monthKey]) agg[gKey][monthKey] = Object.create(null);
      if (!agg[gKey][monthKey][dt])
        agg[gKey][monthKey][dt] = { num: 0, den: 0 };
      return agg[gKey][monthKey][dt];
    }

    months.forEach((monthKey) => {
      const rows = (raw && raw[monthKey]) || [];
      rows.forEach((r) => {
        if (!r) return;
        if (cSel.size && !cSel.has(r.country)) return;
        if (mSel.size && !mSel.has(r.media)) return;
        if (pSel.size && !pSel.has(r.productType)) return;

        const gKey = groupKeyForRow(r);

        state.dayTypes.forEach((dt) => {
          const numField = dt === "D0" ? "D0_PURCHASE_VALUE" : "D7_PURCHASE_VALUE";
          const denField = dt === "D0" ? "D0_unique_purchase" : "D7_unique_purchase";

          const cell = ensureCell(gKey, monthKey, dt);
          cell.num += safeNumber(r[numField]);
          cell.den += safeNumber(r[denField]);
        });
      });
    });

    return agg;
  }

  // ====== 数据聚合：日（折线图） ======
  function buildDailySeries(raw, months, state) {
    const cSel = new Set(state.countries);
    const mSel = new Set(state.medias);
    const pSel = new Set(state.productTypes);

    const dateSet = new Set();
    const groupMap = new Map(); // seriesId -> group

    function groupPartsForRow(r) {
      const c = state.noSplitCountries ? ALL_KEY : r.country;
      const m = state.noSplitMedias ? ALL_KEY : r.media;
      const p = state.noSplitProductTypes ? ALL_KEY : r.productType;
      return { c, m, p };
    }

    months.forEach((monthKey) => {
      const rows = (raw && raw[monthKey]) || [];
      rows.forEach((r) => {
        if (!r) return;
        if (cSel.size && !cSel.has(r.country)) return;
        if (mSel.size && !mSel.has(r.media)) return;
        if (pSel.size && !pSel.has(r.productType)) return;

        const date = r.date;
        if (!date) return;
        dateSet.add(date);

        const gp = groupPartsForRow(r);

        state.dayTypes.forEach((dt) => {
          const id = `${gp.c}||${gp.m}||${gp.p}||${dt}`;
          let g = groupMap.get(id);
          if (!g) {
            g = {
              id,
              country: gp.c,
              media: gp.m,
              productType: gp.p,
              dayType: dt,
              numByDate: Object.create(null),
              denByDate: Object.create(null),
            };
            groupMap.set(id, g);
          }

          const numField = dt === "D0" ? "D0_PURCHASE_VALUE" : "D7_PURCHASE_VALUE";
          const denField = dt === "D0" ? "D0_unique_purchase" : "D7_unique_purchase";

          const n = safeNumber(r[numField]);
          const d = safeNumber(r[denField]);

          g.numByDate[date] = (g.numByDate[date] || 0) + n;
          g.denByDate[date] = (g.denByDate[date] || 0) + d;
        });
      });
    });

    const dates = Array.from(dateSet).sort();
    const groups = Array.from(groupMap.values());

    return { dates, groups };
  }

  // ====== 渲染：柱状图 ======
  function renderBarChart(chart, raw, state, options) {
    const months = state.months.slice();
    const categories = countryCategoriesFromState(state);
    const palette = getPalette();

    // 先按月份+国家聚合一次，避免重复扫数据
    const monthAgg = Object.create(null);
    const cSel = new Set(state.countries);
    const mSel = new Set(state.medias);
    const pSel = new Set(state.productTypes);

    months.forEach((monthKey) => {
      monthAgg[monthKey] = Object.create(null);
      const rows = (raw && raw[monthKey]) || [];

      rows.forEach((r) => {
        if (!r) return;
        if (cSel.size && !cSel.has(r.country)) return;
        if (mSel.size && !mSel.has(r.media)) return;
        if (pSel.size && !pSel.has(r.productType)) return;

        const ck = state.noSplitCountries ? ALL_KEY : r.country;
        if (!monthAgg[monthKey][ck]) {
          monthAgg[monthKey][ck] = {
            D0: { num: 0, den: 0 },
            D7: { num: 0, den: 0 },
          };
        }

        state.dayTypes.forEach((dt) => {
          const numField =
            dt === "D0" ? "D0_PURCHASE_VALUE" : "D7_PURCHASE_VALUE";
          const denField = dt === "D0" ? "D0_unique_purchase" : "D7_unique_purchase";
          monthAgg[monthKey][ck][dt].num += safeNumber(r[numField]);
          monthAgg[monthKey][ck][dt].den += safeNumber(r[denField]);
        });
      });
    });

    // series 顺序：按“月份从左到右” + “同月 D0 再 D7”
    const dayTypesOrdered = DAY_TYPES.filter((d) => state.dayTypes.includes(d));
    const series = [];
    const legend = [];

    months.forEach((monthKey, mi) => {
      const baseColor = palette[mi % palette.length];

      dayTypesOrdered.forEach((dt) => {
        const name = `${formatMonthLabel(monthKey)} ${dt}`;
        legend.push(name);

        const data = categories.map((c) => {
          const cell = monthAgg[monthKey] && monthAgg[monthKey][c] ? monthAgg[monthKey][c][dt] : null;
          const v = cell ? safeDiv(cell.num, cell.den) : null;
          return v;
        });

        series.push({
          name,
          type: "bar",
          data,
          barMaxWidth: 24,
          itemStyle: {
            color: baseColor,
            borderRadius: [6, 6, 0, 0],
            shadowBlur: dt === "D7" ? 10 : 0,
            shadowColor: dt === "D7" ? "rgba(15, 23, 42, 0.20)" : "transparent",
          },
          emphasis: { focus: "series" },
        });
      });
    });

    const optionE = {
      grid: { left: 60, right: 30, top: 50, bottom: 45, containLabel: true },
      legend: { type: "scroll", top: 10, data: legend },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: function (params) {
          if (!params || !params.length) return "";
          const title = params[0].axisValue;
          const lines = [`<div style="font-weight:600;margin-bottom:4px;">${title}</div>`];
          params.forEach((p) => {
            const v = p.data;
            const show = v === null ? "-" : `${formatUSD(v, 2)} USD`;
            lines.push(
              `<div>
                <span style="display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:6px;background:${p.color};"></span>
                ${p.seriesName}：${show}
              </div>`
            );
          });
          return lines.join("");
        },
      },
      xAxis: {
        type: "category",
        data: categories,
        axisTick: { alignWithLabel: true },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          formatter: function (v) {
            // 轴上不带 USD，tooltip 带
            return formatUSD(v, 2);
          },
        },
        splitLine: { lineStyle: { color: "rgba(148,163,184,0.25)" } },
      },
      series,
    };

    chart.setOption(optionE, true);
  }

  // ====== 渲染：折线图 ======
  function renderLineChart(chart, raw, state) {
    const months = state.months.slice();

    const daily = buildDailySeries(raw, months, state);
    const dates = daily.dates;
    const groups = daily.groups;

    const legendCountries = state.noSplitCountries
      ? [ALL_KEY]
      : countryCategoriesFromState(state);

    // seriesId -> tooltip label
    const labelById = Object.create(null);

    const series = groups.map((g) => {
      const data = dates.map((d) => {
        const num = g.numByDate[d] || 0;
        const den = g.denByDate[d] || 0;
        const v = safeDiv(num, den);
        return v;
      });

      // tooltip label（更详细）
      const mediaLabel = g.media === ALL_KEY ? "all" : toLowerLabel(g.media);
      const prodLabel =
        g.productType === ALL_KEY ? "all" : toLowerLabel(g.productType);
      labelById[g.id] = `${g.country} | ${mediaLabel} | ${prodLabel} | ${g.dayType}`;

      return {
        id: g.id,
        name: g.country, // 关键：同国家同名，legend 点一下能让该国家所有线一起消失
        type: "line",
        showSymbol: false,
        data,
        lineStyle: {
          width: 2,
          type: g.dayType === "D7" ? "dashed" : "solid",
        },
        emphasis: { focus: "series" },
      };
    });

    const optionE = {
      grid: { left: 60, right: 30, top: 50, bottom: 55, containLabel: true },
      legend: { type: "scroll", top: 10, data: legendCountries },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "line" },
        formatter: function (params) {
          if (!params || !params.length) return "";
          const title = params[0].axisValue;
          const lines = [`<div style="font-weight:600;margin-bottom:4px;">${title}</div>`];
          params.forEach((p) => {
            const id = p.seriesId || p.seriesName;
            const label = labelById[id] || p.seriesName;
            const v = p.data;
            const show = v === null ? "-" : `${formatUSD(v, 2)} USD`;
            lines.push(
              `<div>
                <span style="display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:6px;background:${p.color};"></span>
                ${label}：${show}
              </div>`
            );
          });
          return lines.join("");
        },
      },
      xAxis: {
        type: "category",
        data: dates,
        axisLabel: {
          formatter: function (v) {
            // "2025-09-01" -> "09-01"
            return typeof v === "string" && v.length >= 10 ? v.slice(5) : v;
          },
        },
      },
      yAxis: {
        type: "value",
        axisLabel: { formatter: (v) => formatUSD(v, 2) },
        splitLine: { lineStyle: { color: "rgba(148,163,184,0.25)" } },
      },
      series,
    };

    chart.setOption(optionE, true);

    // 兜底：某些情况下 legend 对同名多 series 的联动不稳定，这里强制联动一次
    chart.off("legendselectchanged");
    chart.on("legendselectchanged", function (evt) {
      // evt.selected 形如：{ GH: true, KE: false, ... }
      // 对每个 country(=series.name)，用 selected 控制对应 series 的显示
      const selected = evt && evt.selected ? evt.selected : null;
      if (!selected) return;

      chart.setOption(
        {
          series: series.map((s) => ({
            id: s.id,
            // selected[name] === false -> hide
            // 通过 opacity 也行，但这里直接用 "silent" + "lineStyle.opacity" 更麻烦
            // 用 "visible" 在 echarts 不通用，所以保持 legend 机制为主
            // 这里不额外改 option，避免闪动
          })),
        },
        false
      );
    });
  }

  // ====== 渲染：表格 ======
  function renderTable(cardEl, raw, state, options) {
    const section = ensureTableSection(cardEl);
    const titleEl = section.querySelector('[data-role="table-title"]');
    const tableEl = section.querySelector('[data-role="table"]');
    if (!titleEl || !tableEl) return;

    const months = state.months.slice();
    const dayTypesOrdered = DAY_TYPES.filter((d) => state.dayTypes.includes(d));

    // 表名括号：媒体 + 形态（用筛选器选项拼）
    const mediaTag = state.medias.length
      ? state.medias.map(toLowerLabel).join("+")
      : "all";
    const prodTag = state.productTypes.length
      ? state.productTypes.map(toLowerLabel).join("+")
      : "all";
    titleEl.textContent = `数据表（${mediaTag}，${prodTag}）`;

    // 月聚合：按是否“不区分”来决定 group key
    const agg = buildMonthlyAgg(raw, months, state);

    // groupKey -> { country, media, productType }
    const groupMetas = Object.keys(agg).map((gk) => {
      const parts = gk.split("||");
      return {
        key: gk,
        country: parts[0] || ALL_KEY,
        media: parts[1] || ALL_KEY,
        productType: parts[2] || ALL_KEY,
      };
    });

    // 排序：先 country（按固定顺序），再 media/productType
    const orderIndex = Object.create(null);
    COUNTRY_ORDER.forEach((c, i) => (orderIndex[c] = i + 1));
    orderIndex[ALL_KEY] = 0;

    groupMetas.sort((a, b) => {
      const ai = orderIndex[a.country] != null ? orderIndex[a.country] : 999;
      const bi = orderIndex[b.country] != null ? orderIndex[b.country] : 999;
      if (ai !== bi) return ai - bi;

      if (a.country !== b.country) return String(a.country).localeCompare(String(b.country));
      if (a.media !== b.media) return String(a.media).localeCompare(String(b.media));
      return String(a.productType).localeCompare(String(b.productType));
    });

    // 表头：Country + (Media?) + (ProductType?) + month×dayType
    const showMediaCol = !state.noSplitMedias;
    const showProdCol = !state.noSplitProductTypes;

    const ths = [];
    ths.push(`<th>Country</th>`);
    if (showMediaCol) ths.push(`<th>Media</th>`);
    if (showProdCol) ths.push(`<th>Product</th>`);

    months.forEach((m) => {
      dayTypesOrdered.forEach((dt) => {
        ths.push(`<th>${formatMonthLabel(m)} ${dt} ARPPU</th>`);
      });
    });

    const thead = `<thead><tr>${ths.join("")}</tr></thead>`;

    // tbody
    const rowsHtml = groupMetas.map((gm) => {
      const tds = [];
      tds.push(`<td>${gm.country}</td>`);
      if (showMediaCol)
        tds.push(
          `<td class="muted">${gm.media === ALL_KEY ? "ALL" : gm.media}</td>`
        );
      if (showProdCol)
        tds.push(
          `<td class="muted">${
            gm.productType === ALL_KEY ? "ALL" : gm.productType
          }</td>`
        );

      months.forEach((m) => {
        dayTypesOrdered.forEach((dt) => {
          const cell =
            agg[gm.key] && agg[gm.key][m] && agg[gm.key][m][dt]
              ? agg[gm.key][m][dt]
              : null;

          const v = cell ? safeDiv(cell.num, cell.den) : null;
          const text = v === null ? "-" : formatUSD(v, 2);
          tds.push(`<td>${text}</td>`);
        });
      });

      return `<tr>${tds.join("")}</tr>`;
    });

    const tbody =
      rowsHtml.length > 0
        ? `<tbody>${rowsHtml.join("")}</tbody>`
        : `<tbody><tr><td colspan="${
            1 + (showMediaCol ? 1 : 0) + (showProdCol ? 1 : 0) + months.length * dayTypesOrdered.length
          }" class="muted" style="text-align:left;">当前筛选条件下暂无数据</td></tr></tbody>`;

    tableEl.innerHTML = thead + tbody;
  }

  function init() {
    if (!window.echarts) return;
    if (!window.RAW_PAID_BY_MONTH) return;

    const raw = window.RAW_PAID_BY_MONTH;

    const chartEl = document.getElementById(DOM_IDS.chartId);
    if (!chartEl) return;

    const cardEl =
      document.getElementById(DOM_IDS.cardId) ||
      (chartEl.closest ? chartEl.closest(".chart-card") : null);
    if (!cardEl) return;

    ensureStyleOnce();

    const options = buildOptionsFromRaw(raw);
    const state = buildDefaultState(options);

    // 初始化 UI
    const ui = ensureModuleUI(cardEl, state, options);
    if (!ui) return;

    // 初始化图表
    const chart = echarts.init(chartEl);

    function render() {
      // 月份按数据顺序排序，但保持“最多3个月”
      state.months = state.months
        .filter((m) => options.months.indexOf(m) !== -1)
        .slice(0, MAX_MONTHS);

      if (state.months.length === 0 && options.months.length) {
        state.months = options.months.slice(-1);
      }

      // 空选兜底
      if (!state.countries.length) setArrayToAll(state.countries, options.countries);
      if (!state.medias.length) setArrayToAll(state.medias, options.medias);
      if (!state.productTypes.length) setArrayToAll(state.productTypes, options.productTypes);
      if (!state.dayTypes.length) state.dayTypes = ["D0", "D7"];

      if (state.view === "line") {
        renderLineChart(chart, raw, state);
      } else {
        renderBarChart(chart, raw, state, options);
      }

      renderTable(cardEl, raw, state, options);
    }

    ui.bind(render);
    render();

    // resize
    window.addEventListener("resize", () => {
      try {
        chart.resize();
      } catch (e) {}
    });
  }

  // ====== 挂载：优先走 PaidDashboard 的模块生命周期（如果存在） ======
  if (window.PaidDashboard && typeof window.PaidDashboard.registerModule === "function") {
    window.PaidDashboard.registerModule(MODULE_NAME, init);
  } else {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  }
})();
