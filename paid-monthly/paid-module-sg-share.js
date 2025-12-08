/**
 * paid-module-sg-share.js
 * ------------------------------------------------------------
 * 模块：体育玩家 / 游戏玩家占比（按日/按月）
 *
 * 数据源：window.RAW_PAID_BY_MONTH
 * 粒度：date(UTC+0) × country × media × productType
 *
 * 字段依赖：
 * - D0_TOTAL_BET_PLACED_USER / D7_TOTAL_BET_PLACED_USER
 * - D0_SPORTS_BET_PLACED_USER / D7_SPORTS_BET_PLACED_USER
 * - D0_GAMES_BET_PLACED_USER / D7_GAMES_BET_PLACED_USER
 *
 * 说明：
 * - 双投人数 = 体育投注人数 + 游戏投注人数 - 总投注人数
 * - 仅体育 = 体育投注人数 - 双投人数
 * - 仅游戏 = 游戏投注人数 - 双投人数
 *
 * 交互：
 * - 视图：柱状（月度汇总） / 折线（单月日级堆积）
 * - 月份：最多选 3 个（折线强制单选）
 * - 国家/媒体/产品形态：多选（折线强制单选）
 * - D0/D7：多选（折线强制单选）
 * - “全选但不区分”：等价全选，但图/表聚合、不拆线/不拆维度
 *
 * 需要 index.html 提供这些容器 id：
 * - sg-share-view / sg-share-months / sg-share-windows / sg-share-countries / sg-share-medias / sg-share-productTypes
 * - chart-paid-sg-share / table-title-sg-share / table-sg-share
 */

(function () {
  const MODULE_KEY = "sg_share";

  // 国家固定顺序（数据里如果出现其他国家，会排在后面）
  const FIXED_COUNTRY_ORDER = ["GH", "KE", "NG", "TZ", "UG"];

  // 颜色规则：仅游戏=蓝，仅体育=黄，双投=绿
  const COLOR_ONLY_GAMES = "#2563eb";
  const COLOR_ONLY_SPORTS = "#f59e0b";
  const COLOR_BOTH = "#16a34a";

  // D7 斜线阴影（ECharts 5 的 decal）
  const D7_DECAL = {
    symbol: "rect",
    symbolSize: 0.6,
    dashArrayX: [4, 2],
    dashArrayY: [1, 0],
    rotation: Math.PI / 4,
    color: "rgba(255,255,255,0.35)",
  };

  function getRAW() {
    return window.RAW_PAID_BY_MONTH || {};
  }

  function uniq(arr) {
    const out = [];
    const seen = new Set();
    (arr || []).forEach((v) => {
      const k = String(v);
      if (!seen.has(k)) {
        seen.add(k);
        out.push(v);
      }
    });
    return out;
  }

  function formatMonthLabel(monthKey) {
    if (!monthKey || typeof monthKey !== "string") return String(monthKey || "");
    const parts = monthKey.split("-");
    const mm = parts[1] || monthKey;
    const mNum = parseInt(mm, 10);
    return (isFinite(mNum) && mNum > 0 ? mNum : mm) + "月";
  }

  function formatInt(v) {
    const n = Number(v);
    if (!isFinite(n)) return "-";
    return Math.round(n).toLocaleString();
  }

  function formatPct01(v, digits) {
    const n = Number(v);
    if (!isFinite(n)) return "-";
    const d = typeof digits === "number" ? digits : 1;
    return (n * 100).toFixed(d) + "%";
  }

  function clamp(n, min, max) {
    const x = Number(n);
    if (!isFinite(x)) return min;
    return Math.min(max, Math.max(min, x));
  }

  function sortCountries(list) {
    const order = new Map(FIXED_COUNTRY_ORDER.map((c, i) => [c, i]));
    return (list || [])
      .slice()
      .sort((a, b) => {
        const ia = order.has(a) ? order.get(a) : 999;
        const ib = order.has(b) ? order.get(b) : 999;
        if (ia !== ib) return ia - ib;
        return String(a).localeCompare(String(b));
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
        if (r.country) cSet.add(String(r.country).toUpperCase());
        if (r.media) mSet.add(String(r.media).toUpperCase());
        if (r.productType) pSet.add(String(r.productType).toLowerCase());
      });
    });

    const countries = sortCountries(Array.from(cSet));
    const medias = Array.from(mSet).sort();
    const productTypes = Array.from(pSet).sort();

    return { months, countries, medias, productTypes };
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

  function pickDefaultMonths(allMonths) {
    const months = (allMonths || []).slice();
    if (!months.length) return [];
    // 默认取最近 2 个月（不够就取 1 个）
    return months.slice(Math.max(0, months.length - 2));
  }

  function computeSegments(total, sports, games) {
    const t = Math.max(0, Number(total) || 0);
    const s = Math.max(0, Number(sports) || 0);
    const g = Math.max(0, Number(games) || 0);

    // 双投 = S + G - T
    let both = s + g - t;
    // 数据噪声兜底：夹到 [0, min(S,G)]
    both = clamp(both, 0, Math.min(s, g));

    let onlySports = s - both;
    let onlyGames = g - both;

    onlySports = Math.max(0, onlySports);
    onlyGames = Math.max(0, onlyGames);

    // 让三段之和尽量回到 total（避免因为 clamp 导致明显偏差）
    const sum = onlySports + onlyGames + both;
    if (sum > 0 && t > 0) {
      const diff = t - sum;
      const nextBoth = both + diff;
      if (nextBoth >= 0) both = nextBoth;
    }

    return { total: t, sports: s, games: g, both, onlySports, onlyGames };
  }

  function sumFields(rows, fields) {
    const out = {};
    (fields || []).forEach((k) => (out[k] = 0));
    (rows || []).forEach((r) => {
      if (!r) return;
      (fields || []).forEach((k) => {
        const v = Number(r[k]);
        if (isFinite(v)) out[k] += v;
      });
    });
    return out;
  }

  function ensureNonEmpty(state, opts) {
    if (!state.months.length) state.months = pickDefaultMonths(opts.months);
    if (!state.months.length) state.months = (opts.months || []).slice(-1);

    if (!state.countries.length) state.countries = (opts.countries || []).slice();
    if (!state.medias.length) state.medias = (opts.medias || []).slice();
    if (!state.productTypes.length) state.productTypes = (opts.productTypes || []).slice();

    if (!state.windows.length) state.windows = ["D0", "D7"];
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
      : state.productTypes.join("+");

    return `（${mediaText}，${typeText}）`;
  }

  function getDom(id) {
    return document.getElementById(id);
  }

  function createTableFallbackAfter(chartEl) {
    const section = document.createElement("div");
    section.className = "chart-table-section";
    section.id = "table-section-sg-share";
    section.innerHTML = `
      <div class="chart-table-title" id="table-title-sg-share"></div>
      <div class="chart-table-wrapper">
        <table id="table-sg-share" class="chart-table"></table>
      </div>`;
    if (chartEl && chartEl.parentNode) {
      chartEl.parentNode.insertBefore(section, chartEl.nextSibling);
    }
  }

  function init() {
    const chartEl = getDom("chart-paid-sg-share") || getDom("chart-sg-share");
    if (!chartEl || !window.echarts) return;

    const opts = buildOptionsFromRAW();

    const state = {
      view: "bar",
      months: [],
      countries: [],
      medias: [],
      productTypes: [],
      windows: ["D0", "D7"],
      collapse: { countries: false, medias: false, productTypes: false },
      _savedMulti: null,
    };

    ensureNonEmpty(state, opts);

    const chart = echarts.init(chartEl);
    window.addEventListener("resize", () => chart.resize());

    if (!getDom("table-sg-share")) createTableFallbackAfter(chartEl);

    const tableTitleEl = getDom("table-title-sg-share");
    const tableEl = getDom("table-sg-share");

    function setArray(arr, next) {
      arr.length = 0;
      (next || []).forEach((x) => arr.push(x));
    }

    function switchView(nextView) {
      if (nextView === state.view) return;

      if (nextView === "line") {
        state._savedMulti = {
          months: state.months.slice(),
          countries: state.countries.slice(),
          medias: state.medias.slice(),
          productTypes: state.productTypes.slice(),
          windows: state.windows.slice(),
          collapse: { ...state.collapse },
        };

        ensureNonEmpty(state, opts);

        state.view = "line";
        setArray(state.months, [state.months[0]]);
        setArray(state.countries, [state.countries[0]]);
        setArray(state.medias, [state.medias[0]]);
        setArray(state.productTypes, [state.productTypes[0]]);
        setArray(state.windows, [state.windows[0] || "D0"]);

        state.collapse.countries = false;
        state.collapse.medias = false;
        state.collapse.productTypes = false;
      } else {
        state.view = "bar";
        if (state._savedMulti) {
          setArray(state.months, state._savedMulti.months);
          setArray(state.countries, state._savedMulti.countries);
          setArray(state.medias, state._savedMulti.medias);
          setArray(state.productTypes, state._savedMulti.productTypes);
          setArray(state.windows, state._savedMulti.windows);
          state.collapse = { ...state._savedMulti.collapse };
        } else {
          ensureNonEmpty(state, opts);
        }
      }

      renderAll();
    }

    function renderRadioView() {
      const container = getDom("sg-share-view");
      if (!container) return;
      container.innerHTML = "";

      const makeRadio = (label, value, checked) => {
        const labelEl = document.createElement("label");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "sg-share-view-radio";
        input.value = value;
        input.checked = checked;
        labelEl.appendChild(input);
        labelEl.appendChild(document.createTextNode(label));
        input.addEventListener("change", () => {
          if (input.checked) switchView(value);
        });
        return labelEl;
      };

      container.appendChild(makeRadio("柱状（月度）", "bar", state.view === "bar"));
      container.appendChild(makeRadio("折线（日度）", "line", state.view === "line"));
    }

    function renderChipGroup(cfg) {
      const {
        containerId,
        values,
        stateArray,
        max,
        getLabel,
        allowEmpty,
        specialAllNoBreakdown,
        collapseKey,
      } = cfg;

      const container = getDom(containerId);
      if (!container) return;

      const _values = (values || []).slice();
      container.innerHTML = "";

      if (specialAllNoBreakdown) {
        const disabledInSingle = max === 1;
        const labelEl = document.createElement("label");
        labelEl.className = "filter-chip";
        const input = document.createElement("input");
        input.type = "checkbox";
        input.checked = !!state.collapse[collapseKey];
        input.disabled = disabledInSingle;
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
        labelEl.appendChild(
          document.createTextNode(typeof getLabel === "function" ? getLabel(value, idx) : value)
        );

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

          if (specialAllNoBreakdown && state.collapse[collapseKey]) {
            setArray(stateArray, _values);
          }

          renderAll();
        });

        container.appendChild(labelEl);
      });
    }

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

    function renderBar() {
      const monthsSel = uniq(state.months).sort();
      const windowsSel = uniq(state.windows).sort((a, b) => (a === "D0" ? -1 : 1));

      let countriesAxis = sortCountries(uniq(state.countries.map(normalizeCountry)));
      if (state.collapse.countries) countriesAxis = ["ALL"];

      const segCache = {};
      function getSeg(monthKey, win, country) {
        const k = `${monthKey}|${win}|${country}`;
        if (segCache[k]) return segCache[k];

        const rows = filteredRowsForMonth(monthKey, (r) => {
          if (country === "ALL") return true;
          return normalizeCountry(r.country) === country;
        });

        const prefix = win === "D7" ? "D7" : "D0";
        const totalField = `${prefix}_TOTAL_BET_PLACED_USER`;
        const sportsField = `${prefix}_SPORTS_BET_PLACED_USER`;
        const gamesField = `${prefix}_GAMES_BET_PLACED_USER`;

        const sums = sumFields(rows, [totalField, sportsField, gamesField]);
        const seg = computeSegments(sums[totalField], sums[sportsField], sums[gamesField]);
        segCache[k] = seg;
        return seg;
      }

      const series = [];
      monthsSel.forEach((monthKey) => {
        const mLabel = formatMonthLabel(monthKey);
        windowsSel.forEach((win) => {
          const groupLabel = `${mLabel} ${win}`;
          const stackKey = `${monthKey}-${win}`;
          const decal = win === "D7" ? D7_DECAL : null;

          const onlyGamesArr = [];
          const bothArr = [];
          const onlySportsArr = [];

          countriesAxis.forEach((c) => {
            const seg = getSeg(monthKey, win, c);
            onlyGamesArr.push(Math.round(seg.onlyGames || 0));
            bothArr.push(Math.round(seg.both || 0));
            onlySportsArr.push(Math.round(seg.onlySports || 0));
          });

          series.push({
            name: `${groupLabel} · 仅游戏`,
            type: "bar",
            stack: stackKey,
            barMaxWidth: 18,
            itemStyle: { color: COLOR_ONLY_GAMES, decal: decal },
            emphasis: { focus: "series" },
            data: onlyGamesArr,
          });
          series.push({
            name: `${groupLabel} · 双投`,
            type: "bar",
            stack: stackKey,
            barMaxWidth: 18,
            itemStyle: { color: COLOR_BOTH, decal: decal },
            emphasis: { focus: "series" },
            data: bothArr,
          });
          series.push({
            name: `${groupLabel} · 仅体育`,
            type: "bar",
            stack: stackKey,
            barMaxWidth: 18,
            itemStyle: { color: COLOR_ONLY_SPORTS, decal: decal },
            emphasis: { focus: "series" },
            data: onlySportsArr,
          });
        });
      });

      const option = {
        grid: { left: 54, right: 22, top: 24, bottom: 46 },
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
          backgroundColor: "rgba(15, 23, 42, 0.92)",
          borderWidth: 0,
          textStyle: { fontSize: 11 },
          formatter: (params) => {
            if (!Array.isArray(params) || !params.length) return "";
            const axisName = params[0].axisValueLabel || params[0].axisValue || "";

            const groups = {};
            params.forEach((p) => {
              const parts = String(p.seriesName || "").split("·").map((s) => s.trim());
              const gLabel = parts[0] || "";
              const segLabel = parts[1] || "";
              if (!groups[gLabel]) groups[gLabel] = {};
              groups[gLabel][segLabel] = Number(p.value) || 0;
            });

            const lines = [`<strong>${axisName}</strong>`];

            Object.keys(groups).forEach((gLabel) => {
              const g = groups[gLabel];
              const og = g["仅游戏"] || 0;
              const both = g["双投"] || 0;
              const os = g["仅体育"] || 0;
              const total = og + both + os;

              lines.push(`<div style="margin-top:6px;"><strong>${gLabel}</strong></div>`);
              lines.push(`${mk(COLOR_ONLY_GAMES)}仅游戏：${formatInt(og)}`);
              lines.push(`${mk(COLOR_BOTH)}双投：${formatInt(both)}`);
              lines.push(`${mk(COLOR_ONLY_SPORTS)}仅体育：${formatInt(os)}`);
              lines.push(`<span style="color:#cbd5e1;">总计：${formatInt(total)}</span>`);
              if (gLabel.includes("D7")) {
                lines.push(`<span style="color:#94a3b8;">D7 为斜线填充；D0 为纯色。</span>`);
              }
            });

            return lines.join("<br/>");
          },
        },
        legend: { show: false },
        xAxis: {
          type: "category",
          data: countriesAxis,
          axisTick: { show: false },
          axisLine: { lineStyle: { color: "rgba(148,163,184,0.6)" } },
          axisLabel: { color: "#334155", fontSize: 11 },
        },
        yAxis: {
          type: "value",
          name: "投注人数",
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: "rgba(148,163,184,0.22)" } },
          axisLabel: { color: "#64748b", fontSize: 11 },
        },
        series,
      };

      chart.setOption(option, true);
    }

    function renderLine() {
      const monthKey = state.months[0];
      const win = state.windows[0] || "D0";
      const prefix = win === "D7" ? "D7" : "D0";

      const country = normalizeCountry(state.countries[0]);
      const media = normalizeMedia(state.medias[0]);
      const pType = normalizeProductType(state.productTypes[0]);

      const RAW = getRAW();
      const rows = (RAW[monthKey] || []).filter((r) => {
        if (!r) return false;
        return (
          normalizeCountry(r.country) === country &&
          normalizeMedia(r.media) === media &&
          normalizeProductType(r.productType) === pType
        );
      });

      const totalField = `${prefix}_TOTAL_BET_PLACED_USER`;
      const sportsField = `${prefix}_SPORTS_BET_PLACED_USER`;
      const gamesField = `${prefix}_GAMES_BET_PLACED_USER`;

      const byDate = {};
      rows.forEach((r) => {
        const d = String(r.date || "");
        if (!d) return;
        if (!byDate[d]) byDate[d] = { total: 0, sports: 0, games: 0 };
        const t = Number(r[totalField]);
        const s = Number(r[sportsField]);
        const g = Number(r[gamesField]);
        if (isFinite(t)) byDate[d].total += t;
        if (isFinite(s)) byDate[d].sports += s;
        if (isFinite(g)) byDate[d].games += g;
      });

      const dates = Object.keys(byDate).sort();
      const onlySportsArr = [];
      const onlyGamesArr = [];
      const bothArr = [];

      dates.forEach((d) => {
        const seg = computeSegments(byDate[d].total, byDate[d].sports, byDate[d].games);
        // 折线堆积顺序要求：底=仅体育，中=仅游戏，上=双投
        onlySportsArr.push(Math.round(seg.onlySports || 0));
        onlyGamesArr.push(Math.round(seg.onlyGames || 0));
        bothArr.push(Math.round(seg.both || 0));
      });

      const option = {
        grid: { left: 54, right: 22, top: 26, bottom: 46 },
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(15, 23, 42, 0.92)",
          borderWidth: 0,
          textStyle: { fontSize: 11 },
          axisPointer: { type: "line" },
          formatter: (params) => {
            if (!Array.isArray(params) || !params.length) return "";
            const dateRaw = params[0].axisValue;
            const title = `${dateRaw}（${formatMonthLabel(monthKey)}，${country}，${media}，${pType}，${win}）`;

            const parts = {};
            params.forEach((p) => (parts[p.seriesName] = Number(p.value) || 0));

            const os = parts["仅体育"] || 0;
            const og = parts["仅游戏"] || 0;
            const both = parts["双投"] || 0;
            const total = os + og + both;

            return [
              `<strong>${title}</strong>`,
              `${mk(COLOR_ONLY_SPORTS)}仅体育：${formatInt(os)}`,
              `${mk(COLOR_ONLY_GAMES)}仅游戏：${formatInt(og)}`,
              `${mk(COLOR_BOTH)}双投：${formatInt(both)}`,
              `<span style="color:#cbd5e1;">总计：${formatInt(total)}</span>`,
            ].join("<br/>");
          },
        },
        legend: {
          data: ["仅体育", "仅游戏", "双投"],
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
            fontSize: 11,
            formatter: (v) => String(v).slice(5),
          },
        },
        yAxis: {
          type: "value",
          name: "投注人数",
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: "rgba(148,163,184,0.22)" } },
          axisLabel: { color: "#64748b", fontSize: 11 },
        },
        series: [
          {
            name: "仅体育",
            type: "line",
            stack: "total",
            smooth: true,
            symbol: "none",
            lineStyle: { width: 1.5 },
            areaStyle: { opacity: 0.22 },
            itemStyle: { color: COLOR_ONLY_SPORTS },
            data: onlySportsArr,
          },
          {
            name: "仅游戏",
            type: "line",
            stack: "total",
            smooth: true,
            symbol: "none",
            lineStyle: { width: 1.5 },
            areaStyle: { opacity: 0.22 },
            itemStyle: { color: COLOR_ONLY_GAMES },
            data: onlyGamesArr,
          },
          {
            name: "双投",
            type: "line",
            stack: "total",
            smooth: true,
            symbol: "none",
            lineStyle: { width: 1.5 },
            areaStyle: { opacity: 0.22 },
            itemStyle: { color: COLOR_BOTH },
            data: bothArr,
          },
        ],
      };

      chart.setOption(option, true);
    }

    function renderTable() {
      if (!tableEl) return;

      const monthsSel = uniq(state.months).sort();
      const windowsSel = uniq(state.windows).sort((a, b) => (a === "D0" ? -1 : 1));

      let rowCountries = sortCountries(uniq(state.countries.map(normalizeCountry)));
      if (state.collapse.countries) rowCountries = ["ALL"];

      const suffix = buildTitleSuffix(state, opts);
      if (tableTitleEl) {
        tableTitleEl.textContent = `当前筛选 · 体育/游戏玩家构成（人数&占比）${suffix}`;
      }

      const thead = document.createElement("thead");
      const trh = document.createElement("tr");
      trh.appendChild(th("国家"));

      const colKeys = [];
      monthsSel.forEach((m) => {
        windowsSel.forEach((w) => {
          trh.appendChild(th(`${formatMonthLabel(m)} ${w}`));
          colKeys.push({ month: m, win: w });
        });
      });
      thead.appendChild(trh);

      const tbody = document.createElement("tbody");

      function getSegForCell(monthKey, win, country) {
        const rows = filteredRowsForMonth(monthKey, (r) => {
          if (country === "ALL") return true;
          return normalizeCountry(r.country) === country;
        });

        const prefix = win === "D7" ? "D7" : "D0";
        const totalField = `${prefix}_TOTAL_BET_PLACED_USER`;
        const sportsField = `${prefix}_SPORTS_BET_PLACED_USER`;
        const gamesField = `${prefix}_GAMES_BET_PLACED_USER`;

        const sums = sumFields(rows, [totalField, sportsField, gamesField]);
        return computeSegments(sums[totalField], sums[sportsField], sums[gamesField]);
      }

      rowCountries.forEach((country) => {
        const tr = document.createElement("tr");
        tr.appendChild(td(country));

        colKeys.forEach((ck) => {
          const seg = getSegForCell(ck.month, ck.win, country);
          const total = seg.total || 0;

          const og = seg.onlyGames || 0;
          const both = seg.both || 0;
          const os = seg.onlySports || 0;

          const cell = document.createElement("td");
          cell.innerHTML = `
            <div style="display:flex;flex-direction:column;gap:2px;line-height:1.15;">
              <span>仅游戏：${formatInt(og)} <span style="color:#94a3b8;">(${formatPct01(total ? og / total : 0)})</span></span>
              <span>双投：${formatInt(both)} <span style="color:#94a3b8;">(${formatPct01(total ? both / total : 0)})</span></span>
              <span>仅体育：${formatInt(os)} <span style="color:#94a3b8;">(${formatPct01(total ? os / total : 0)})</span></span>
              <span style="color:#64748b;">总计：${formatInt(total)}</span>
            </div>
          `;
          tr.appendChild(cell);
        });

        tbody.appendChild(tr);
      });

      tableEl.innerHTML = "";
      tableEl.appendChild(thead);
      tableEl.appendChild(tbody);
    }

    function renderAll() {
      ensureNonEmpty(state, opts);

      const monthMax = state.view === "line" ? 1 : 3;
      const otherMax = state.view === "line" ? 1 : 0;

      if (state.view === "line") {
        setArray(state.months, [state.months[0]]);
        setArray(state.countries, [state.countries[0]]);
        setArray(state.medias, [state.medias[0]]);
        setArray(state.productTypes, [state.productTypes[0]]);
        setArray(state.windows, [state.windows[0] || "D0"]);
      }

      renderRadioView();

      renderChipGroup({
        containerId: "sg-share-months",
        values: opts.months,
        stateArray: state.months,
        max: monthMax,
        getLabel: formatMonthLabel,
        allowEmpty: false,
      });

      renderChipGroup({
        containerId: "sg-share-windows",
        values: ["D0", "D7"],
        stateArray: state.windows,
        max: otherMax === 1 ? 1 : 0,
        getLabel: (v) => v,
        allowEmpty: false,
      });

      renderChipGroup({
        containerId: "sg-share-countries",
        values: opts.countries,
        stateArray: state.countries,
        max: otherMax,
        getLabel: (v) => v,
        allowEmpty: false,
        specialAllNoBreakdown: true,
        collapseKey: "countries",
      });

      renderChipGroup({
        containerId: "sg-share-medias",
        values: opts.medias,
        stateArray: state.medias,
        max: otherMax,
        getLabel: (v) => v,
        allowEmpty: false,
        specialAllNoBreakdown: true,
        collapseKey: "medias",
      });

      renderChipGroup({
        containerId: "sg-share-productTypes",
        values: opts.productTypes,
        stateArray: state.productTypes,
        max: otherMax,
        getLabel: (v) => v,
        allowEmpty: false,
        specialAllNoBreakdown: true,
        collapseKey: "productTypes",
      });

      if (state.view === "bar") renderBar();
      else renderLine();

      renderTable();
    }

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
    function mk(color) {
      return `<span style="display:inline-block;margin-right:6px;width:10px;height:10px;border-radius:3px;background:${color};"></span>`;
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
