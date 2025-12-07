// organic-vs-paid/module-player-mix.js
// 模块5：D0/D7 体育 vs 游戏玩家比例（玩家结构：仅游戏/双投/仅体育）
//
// 依赖：
// - 数据：organic-data.js / paid-data.js（按月日维度明细）
// - 文案：insights-copy.js（可选）
// - 图表：ECharts（本文件会按需加载）
//
// 说明：
// - 柱状图：按国家（月度聚合），每个国家按【来源(自然/买量) × D0/D7】分组；每根柱子内部为堆叠：仅游戏 / 双投 / 仅体育（合计=总投注人数）
// - 折线图：日级堆积面积图；进入折线图后，国家/来源/D0-D7 自动收敛为单选（避免多选导致信息过载）
//
// 数据字段口径：D0/D7_*_BET_PLACED_USER, D0/D7_TOTAL_BET_PLACED_USER
(function () {
  window.OVP = window.OVP || {};
  const register =
    OVP.registerModule ||
    function (m) {
      (OVP.modules || (OVP.modules = [])).push(m);
    };

  const MODULE_ID = "m5-player-mix";
  const COUNTRY_ORDER = ["GH", "KE", "NG", "TZ"];
  const SOURCE_OPTIONS = [
    { key: "organic", label: "自然量" },
    { key: "paid", label: "买量" },
  ];
  const WINDOW_OPTIONS = [
    { key: "D0", label: "D0" },
    { key: "D7", label: "D7" },
  ];
  const ECHARTS_SRC =
    "https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js";

  function injectStylesOnce() {
    const id = "ovp-m5-player-mix-style";
    if (document.getElementById(id)) return;

    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      .ovp-m5{display:flex;flex-direction:column;gap:12px}
      .ovp-m5 .row{display:flex;gap:14px;flex-wrap:wrap;align-items:flex-end}
      .ovp-m5 .fg{display:flex;flex-direction:column;gap:6px;min-width:180px}
      .ovp-m5 label{font-size:12px;color:var(--text-sub, var(--muted, #6b7280))}
      .ovp-m5 select{
        height:36px;
        border-radius:10px;
        padding:0 10px;
        border:1px solid var(--border, rgba(148,163,184,.55));
        background: var(--bg-card, rgba(249,250,251,.9));
        color: var(--text-main, var(--text, #0f172a));
        outline:none;
      }

      .ovp-m5 .seg{
        display:flex; gap:6px; flex-wrap:wrap;
        padding:4px;
        border:1px solid var(--border, rgba(148,163,184,.55));
        border-radius:12px;
        background: rgba(255,255,255,.5);
      }
      .ovp-m5 .seg button{
        height:28px;
        padding:0 10px;
        border-radius:10px;
        border:1px solid transparent;
        background:transparent;
        color: var(--text-sub, var(--muted, #6b7280));
        cursor:pointer;
        font-size:12px;
        white-space:nowrap;
      }
      .ovp-m5 .seg button[aria-pressed="true"]{
        background: var(--accent-soft, rgba(37,99,235,.10));
        border-color: rgba(37,99,235,.35);
        color: var(--accent-strong, #2563eb);
        font-weight:600;
      }

      .ovp-m5 .chips{
        display:flex; flex-wrap:wrap; gap:8px;
        padding:2px 0;
      }
      .ovp-m5 .filter-chip{
        font-size:11px;
        padding:3px 8px;
        border-radius:999px;
        border:1px solid rgba(148, 163, 184, 0.6);
        background: rgba(249, 250, 251, 0.9);
        display:inline-flex;
        align-items:center;
        gap:6px;
        cursor:pointer;
        user-select:none;
        white-space:nowrap;
        color: var(--text-sub, var(--muted, #6b7280));
      }
      .ovp-m5 .filter-chip input{ accent-color: var(--accent-strong, #2563eb); cursor:pointer; }
      .ovp-m5 .filter-chip.filter-chip-active{
        border-color: rgba(37, 99, 235, 0.9);
        background: var(--accent-soft, rgba(37,99,235,.10));
        color: var(--accent-strong, #2563eb);
      }

      .ovp-m5 .hint{
        font-size:12px;
        color: var(--text-sub, var(--muted, #6b7280));
        line-height:1.5;
      }

      .ovp-m5 .chart{
        height:360px; width:100%;
        border:1px solid var(--border, rgba(148,163,184,.55));
        border-radius:12px;
        background: rgba(255,255,255,.02);
      }

      .ovp-m5 .table-wrap{overflow:auto; border-radius:12px}
      .ovp-m5 .table-title{
        display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap;
        margin: 2px 0 8px;
        font-size:12px;
        color: var(--text-sub, var(--muted, #6b7280));
      }

      .ovp-m5 table{
        width:100%;
        border-collapse:separate; border-spacing:0;
        border:1px solid var(--border, rgba(148,163,184,.55));
        border-radius:12px;
        overflow:hidden;
        background: rgba(255,255,255,.02);
      }
      .ovp-m5 th,.ovp-m5 td{
        padding:10px 12px;
        border-bottom:1px solid var(--border, rgba(148,163,184,.35));
        font-size:12px;
        vertical-align:top;
      }
      .ovp-m5 th{
        color: var(--text-sub, var(--muted, #6b7280));
        text-align:left;
        background: rgba(148,163,184,.10);
        white-space:nowrap;
      }
      .ovp-m5 td{ color: var(--text-main, var(--text, #0f172a)); }
      .ovp-m5 tr:last-child td{border-bottom:0}
      .ovp-m5 th:first-child, .ovp-m5 td:first-child{position:sticky; left:0; background: rgba(255,255,255,.90); z-index:1;}
      .ovp-m5 th:first-child{z-index:2;}

      .ovp-m5 .mix-cell{
        font-size:13px;
        line-height:1.65;
        white-space:nowrap;
      }
      .ovp-m5 .mix-cell .line{
        display:flex;
        gap:10px;
        align-items:baseline;
      }
      .ovp-m5 .mix-cell .k{
        min-width:58px;
        font-weight:600;
        color: var(--text-main, var(--text, #0f172a));
      }
      .ovp-m5 .mix-cell .v{
        font-weight:700;
        color: var(--text-main, var(--text, #0f172a));
      }
      .ovp-m5 .mix-cell .p{
        font-weight:600;
        color: var(--text-sub, var(--muted, #6b7280));
      }
      .ovp-m5 .mix-cell .total{
        margin-top:2px;
        color: var(--text-sub, var(--muted, #6b7280));
      }
      .ovp-m5 .mix-cell .total .k,
      .ovp-m5 .mix-cell .total .v{
        color: inherit;
        font-weight:600;
      }

      .ovp-m5 .empty{
        padding:12px;
        border:1px dashed var(--border, rgba(148,163,184,.55));
        border-radius:12px;
        color: var(--text-sub, var(--muted, #6b7280));
        font-size:12px;
        line-height:1.6;
      }
    `;
    document.head.appendChild(style);
  }

  function cssVar(name, fallback) {
    try {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name);
      const s = (v || "").trim();
      return s || fallback;
    } catch (_e) {
      return fallback;
    }
  }

  function safeNumber(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  function fmtInt(utils, v) {
    if (utils && typeof utils.fmtInt === "function") return utils.fmtInt(v);
    const n = Number(v);
    if (!Number.isFinite(n)) return "—";
    return Math.round(n).toLocaleString("en-US");
  }

  function fmtPct(utils, v, digits) {
    if (utils && typeof utils.fmtPct === "function") return utils.fmtPct(v, digits);
    const n = Number(v);
    if (!Number.isFinite(n)) return "—";
    return `${(n * 100).toFixed(digits == null ? 1 : digits)}%`;
  }

  function readGlobal(name) {
    try {
      return Function(
        `return (typeof ${name} !== "undefined") ? ${name} : undefined;`
      )();
    } catch (_e) {
      return undefined;
    }
  }

  function resolveDataset(passed, which) {
    if (passed !== undefined && passed !== null) return passed;

    const keys =
      which === "organic"
        ? ["organicData", "organicMonthlyData", "ORGANIC_DATA", "RAW_ORGANIC_BY_MONTH"]
        : ["paidData", "paidMonthlyData", "PAID_DATA", "RAW_PAID_BY_MONTH"];

    for (const k of keys) {
      const v = readGlobal(k);
      if (v !== undefined) return v;
      if (typeof window !== "undefined" && window[k] !== undefined) return window[k];
    }
    return undefined;
  }

  function normalizeMonth(input) {
    if (window.OVP && OVP.insights && typeof OVP.insights.normalizeMonth === "function") {
      return OVP.insights.normalizeMonth(input);
    }
    if (!input) return null;

    if (input instanceof Date && !isNaN(input.getTime())) {
      const y = input.getFullYear();
      const m = String(input.getMonth() + 1).padStart(2, "0");
      return `${y}-${m}`;
    }

    const s = String(input).trim();
    let m = s.match(/^(\d{4})[-\/](\d{1,2})$/);
    if (m) {
      const y = Number(m[1]);
      const mm = Number(m[2]);
      if (mm >= 1 && mm <= 12) return `${y}-${String(mm).padStart(2, "0")}`;
    }
    m = s.match(/^(\d{4})(\d{2})$/);
    if (m) {
      const y = Number(m[1]);
      const mm = Number(m[2]);
      if (mm >= 1 && mm <= 12) return `${y}-${String(mm).padStart(2, "0")}`;
    }
    m = s.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$/);
    if (m) {
      const y = Number(m[1]);
      const mm = Number(m[2]);
      if (mm >= 1 && mm <= 12) return `${y}-${String(mm).padStart(2, "0")}`;
    }
    return null;
  }

  function monthValue(key) {
    if (!key) return -1;
    const m = String(key).match(/^(\d{4})-(\d{2})$/);
    if (!m) return -1;
    return Number(m[1]) * 100 + Number(m[2]);
  }

  function extractRows(raw) {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;

    if (raw && typeof raw === "object") {
      for (const k of ["data", "rows", "items", "list"]) {
        if (Array.isArray(raw[k])) return raw[k];
      }

      const monthsBag =
        (raw.months && typeof raw.months === "object" && raw.months) ||
        (raw.byMonth && typeof raw.byMonth === "object" && raw.byMonth) ||
        (raw.dataByMonth && typeof raw.dataByMonth === "object" && raw.dataByMonth) ||
        raw;

      const out = [];
      for (const k of Object.keys(monthsBag || {})) {
        const v = monthsBag[k];
        if (!Array.isArray(v)) continue;
        for (const row of v) out.push(row);
      }
      return out;
    }
    return [];
  }

  function listMonthsFrom(raw) {
    const set = new Set();

    if (raw && typeof raw === "object" && !Array.isArray(raw)) {
      for (const k of Object.keys(raw)) {
        const mk = normalizeMonth(k);
        if (mk && Array.isArray(raw[k])) set.add(mk);
      }
      for (const key of ["months", "byMonth", "dataByMonth"]) {
        if (raw[key] && typeof raw[key] === "object") {
          for (const k2 of Object.keys(raw[key])) {
            const mk2 = normalizeMonth(k2);
            if (mk2 && Array.isArray(raw[key][k2])) set.add(mk2);
          }
        }
      }
    }

    const arr = extractRows(raw);
    for (const r of arr) {
      const mk = normalizeMonth(r.month || r.ym || r.date || r.day || r.dt);
      if (mk) set.add(mk);
    }

    const months = Array.from(set).filter(Boolean);
    months.sort((a, b) => monthValue(a) - monthValue(b));
    return months;
  }

  function getMonthRows(raw, monthKey) {
    if (!raw || !monthKey) return [];

    if (raw && typeof raw === "object" && !Array.isArray(raw)) {
      if (Array.isArray(raw[monthKey])) return raw[monthKey];
      for (const key of ["months", "byMonth", "dataByMonth"]) {
        if (raw[key] && typeof raw[key] === "object" && Array.isArray(raw[key][monthKey])) {
          return raw[key][monthKey];
        }
      }
    }

    const rows = extractRows(raw);
    return rows.filter((r) => normalizeMonth(r.month || r.ym || r.date || r.day || r.dt) === monthKey);
  }

  function pickCountry(row) {
    const c = row && (row.country || row.Country || row.geo || row.cc || row.market || row.nation);
    return c ? String(c).toUpperCase().trim() : null;
  }

  function pickDate(row) {
    const d = row && (row.date || row.day || row.dt || row.Date);
    if (!d) return null;
    const s = String(d).trim();
    return s.length >= 10 ? s.slice(0, 10) : s;
  }

  function splitCounts(sports, games, total) {
    let both = sports + games - total;

    if (!Number.isFinite(both)) both = 0;
    if (both < 0) both = 0;

    const cap = Math.min(sports, games);
    if (both > cap) both = cap;

    let onlySports = sports - both;
    let onlyGames = games - both;

    if (onlySports < 0) onlySports = 0;
    if (onlyGames < 0) onlyGames = 0;

    const fixedTotal = onlySports + onlyGames + both;

    return {
      onlyGames,
      both,
      onlySports,
      total: fixedTotal,
    };
  }

  function aggMonthByCountry(raw, monthKey) {
    const rows = getMonthRows(raw, monthKey);
    const out = {};

    for (const r of rows) {
      const c = pickCountry(r);
      if (!c) continue;

      const slot =
        out[c] ||
        (out[c] = {
          D0: { sports: 0, games: 0, total: 0 },
          D7: { sports: 0, games: 0, total: 0 },
        });

      for (const w of ["D0", "D7"]) {
        slot[w].sports += safeNumber(r[`${w}_SPORTS_BET_PLACED_USER`]);
        slot[w].games += safeNumber(r[`${w}_GAMES_BET_PLACED_USER`]);
        slot[w].total += safeNumber(r[`${w}_TOTAL_BET_PLACED_USER`]);
      }
    }

    const finalOut = {};
    for (const c of Object.keys(out)) {
      finalOut[c] = {
        D0: splitCounts(out[c].D0.sports, out[c].D0.games, out[c].D0.total),
        D7: splitCounts(out[c].D7.sports, out[c].D7.games, out[c].D7.total),
      };
    }
    return finalOut;
  }

  function aggDaily(raw, monthKey, country) {
    const rows = getMonthRows(raw, monthKey);
    const target = String(country || "").toUpperCase();

    const byDate = {};
    for (const r of rows) {
      const c = pickCountry(r);
      if (!c || c !== target) continue;

      const d = pickDate(r);
      if (!d) continue;

      const slot =
        byDate[d] ||
        (byDate[d] = {
          D0: { sports: 0, games: 0, total: 0 },
          D7: { sports: 0, games: 0, total: 0 },
        });

      for (const w of ["D0", "D7"]) {
        slot[w].sports += safeNumber(r[`${w}_SPORTS_BET_PLACED_USER`]);
        slot[w].games += safeNumber(r[`${w}_GAMES_BET_PLACED_USER`]);
        slot[w].total += safeNumber(r[`${w}_TOTAL_BET_PLACED_USER`]);
      }
    }

    const dates = Object.keys(byDate).sort();
    const out = {
      dates,
      D0: { onlySports: [], onlyGames: [], both: [], total: [] },
      D7: { onlySports: [], onlyGames: [], both: [], total: [] },
    };

    for (const d of dates) {
      for (const w of ["D0", "D7"]) {
        const s = byDate[d][w].sports;
        const g = byDate[d][w].games;
        const t = byDate[d][w].total;
        const split = splitCounts(s, g, t);
        out[w].onlySports.push(split.onlySports);
        out[w].onlyGames.push(split.onlyGames);
        out[w].both.push(split.both);
        out[w].total.push(split.total);
      }
    }

    return out;
  }

  function loadScriptOnce(id, src) {
    return new Promise((resolve, reject) => {
      if (document.getElementById(id)) {
        const tick = () => {
          if (window.echarts) resolve();
          else setTimeout(tick, 40);
        };
        tick();
        return;
      }

      const s = document.createElement("script");
      s.id = id;
      s.src = src;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error(`failed to load script: ${src}`));
      document.head.appendChild(s);
    });
  }

  function loadECharts() {
    if (window.echarts) return Promise.resolve(window.echarts);
    return loadScriptOnce("ovp-echarts", ECHARTS_SRC).then(() => {
      if (!window.echarts) throw new Error("echarts not available");
      return window.echarts;
    });
  }

  function hatchDecal() {
    return {
      symbol: "rect",
      rotation: Math.PI / 4,
      dashArrayX: [1, 0],
      dashArrayY: [4, 2],
      color: "rgba(15, 23, 42, 0.22)",
    };
  }

  function monthShort(ym) {
    const m = String(ym || "").match(/-(\d{2})$/);
    if (!m) return String(ym || "");
    return String(Number(m[1])) + "月";
  }

  function uniqOrdered(arr) {
    const set = new Set();
    const out = [];
    for (const v of arr || []) {
      if (v == null) continue;
      const s = String(v);
      if (set.has(s)) continue;
      set.add(s);
      out.push(s);
    }
    return out;
  }

  function orderCountries(selected) {
    const want = new Set((selected || []).map((x) => String(x).toUpperCase()));
    const ordered = [];
    for (const c of COUNTRY_ORDER) if (want.has(c)) ordered.push(c);

    for (const c of (selected || []).map((x) => String(x).toUpperCase())) {
      if (!ordered.includes(c)) ordered.push(c);
    }
    return ordered;
  }

  function renderChipGroup(container, options, selectedKeys, onToggle, singleMode) {
    container.innerHTML = "";
    const selected = new Set((selectedKeys || []).map(String));

    for (const opt of options) {
      const val = String(opt.key);
      const isOn = selected.has(val);

      const lab = document.createElement("label");
      lab.className = "filter-chip" + (isOn ? " filter-chip-active" : "");

      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = val;
      input.checked = isOn;

      input.addEventListener("change", (e) => {
        const checked = Boolean(e.target.checked);

        if (singleMode) {
          onToggle([val]);
          return;
        }

        const next = new Set(selectedKeys || []);
        if (checked) next.add(val);
        else next.delete(val);

        onToggle(Array.from(next));
      });

      lab.appendChild(input);
      lab.appendChild(document.createTextNode(opt.label));
      container.appendChild(lab);
    }
  }

  function renderCountryChips(container, countries, selected, onToggle, singleMode) {
    container.innerHTML = "";
    const selectedSet = new Set((selected || []).map((x) => String(x).toUpperCase()));

    for (const c of countries) {
      const isOn = selectedSet.has(c);

      const lab = document.createElement("label");
      lab.className = "filter-chip" + (isOn ? " filter-chip-active" : "");

      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = c;
      input.checked = isOn;

      input.addEventListener("change", (e) => {
        const checked = Boolean(e.target.checked);

        if (singleMode) {
          onToggle([c]);
          return;
        }

        const next = new Set(selected || []);
        if (checked) next.add(c);
        else next.delete(c);

        onToggle(Array.from(next));
      });

      lab.appendChild(input);
      lab.appendChild(document.createTextNode(c));
      container.appendChild(lab);
    }
  }

  register({
    id: MODULE_ID,
    title: "D0/D7 体育 vs 游戏玩家比例",
    subtitle: "玩家结构：仅游戏 / 双投 / 仅体育（柱状=月度，折线=日级堆积）",
    span: "full",

    render({ mountEl, organic, paid, utils }) {
      injectStylesOnce();

      const organicRaw = resolveDataset(organic, "organic");
      const paidRaw = resolveDataset(paid, "paid");

      const months = uniqOrdered([
        ...listMonthsFrom(organicRaw),
        ...listMonthsFrom(paidRaw),
      ]).sort((a, b) => monthValue(a) - monthValue(b));

      if (!months.length) {
        mountEl.innerHTML = `
          <div class="ovp-m5">
            <div class="empty">
              没读到月份数据：请检查 organic-data.js / paid-data.js 是否包含 date + country + D0/D7_*_BET_PLACED_USER 字段。
            </div>
          </div>
        `;
        return;
      }

      let state = {
        month: months[months.length - 1],
        countries: COUNTRY_ORDER.filter(Boolean),
        sources: ["organic", "paid"],
        windows: ["D0", "D7"],
        chartType: "bar",
      };

      const uid = `ovp-${MODULE_ID}-${Math.random().toString(16).slice(2)}`;
      const monthId = `${uid}-month`;
      const countriesId = `${uid}-countries`;
      const sourcesId = `${uid}-sources`;
      const windowsId = `${uid}-windows`;
      const chartTypeId = `${uid}-chartType`;
      const hintId = `${uid}-hint`;
      const chartId = `${uid}-chart`;
      const tableTitleId = `${uid}-tableTitle`;
      const tableId = `${uid}-table`;
      const insightsId = `${uid}-insights`;

      mountEl.innerHTML = `
        <div class="ovp-m5">
          <div class="row">
            <div class="fg">
              <label for="${monthId}">月份</label>
              <select id="${monthId}"></select>
            </div>

            <div class="fg" style="min-width:240px">
              <label>国家（多选）</label>
              <div class="chips" id="${countriesId}"></div>
            </div>

            <div class="fg" style="min-width:210px">
              <label>买量 / 自然量（多选）</label>
              <div class="chips" id="${sourcesId}"></div>
            </div>

            <div class="fg">
              <label>图表</label>
              <div class="seg" id="${chartTypeId}">
                <button type="button" data-v="bar" aria-pressed="true">月度柱状图</button>
                <button type="button" data-v="line" aria-pressed="false">日级折线图</button>
              </div>
              <div class="hint" id="${hintId}" style="display:none">
                折线图模式：国家/来源/D0-D7 自动切为单选（堆积：仅体育=黄、仅游戏=蓝、双投=绿）。
              </div>
            </div>

            <div class="fg" style="min-width:200px">
              <label>D0 / D7（多选）</label>
              <div class="chips" id="${windowsId}"></div>
            </div>
          </div>

          <div class="hint" style="margin-top:-4px;">
            柱状图：自然量为黄色，买量为蓝色。每根柱子内部为堆叠（仅游戏=浅色、仅体育=深色、双投=浅绿）；斜纹= D7。
          </div>

          <div class="chart" id="${chartId}"></div>

          <div class="table-title" id="${tableTitleId}"></div>
          <div class="table-wrap">
            <table id="${tableId}"></table>
          </div>

          <div id="${insightsId}"></div>
        </div>
      `;

      const monthSel = mountEl.querySelector(`#${monthId}`);
      const countriesWrap = mountEl.querySelector(`#${countriesId}`);
      const sourcesWrap = mountEl.querySelector(`#${sourcesId}`);
      const windowsWrap = mountEl.querySelector(`#${windowsId}`);
      const chartTypeWrap = mountEl.querySelector(`#${chartTypeId}`);
      const hintEl = mountEl.querySelector(`#${hintId}`);
      const chartEl = mountEl.querySelector(`#${chartId}`);
      const tableTitleEl = mountEl.querySelector(`#${tableTitleId}`);
      const tableEl = mountEl.querySelector(`#${tableId}`);
      const insightsEl = mountEl.querySelector(`#${insightsId}`);

      monthSel.innerHTML = months
        .map((m) => `<option value="${m}">${m}</option>`)
        .join("");
      monthSel.value = state.month;

      let chart = null;

      function setChartType(nextType) {
        state.chartType = nextType;

        for (const btn of chartTypeWrap.querySelectorAll("button[data-v]")) {
          const on = btn.getAttribute("data-v") === nextType;
          btn.setAttribute("aria-pressed", on ? "true" : "false");
        }

        if (state.chartType === "line") {
          hintEl.style.display = "";

          const oneCountry =
            orderCountries(state.countries)[0] || COUNTRY_ORDER[0] || "GH";
          const oneSource = state.sources[0] || "organic";
          const oneWindow = state.windows[0] || "D0";

          state.countries = [oneCountry];
          state.sources = [oneSource];
          state.windows = [oneWindow];
        } else {
          hintEl.style.display = "none";
          if (!state.countries.length) state.countries = COUNTRY_ORDER.filter(Boolean);
          if (!state.sources.length) state.sources = ["organic", "paid"];
          if (!state.windows.length) state.windows = ["D0", "D7"];
        }

        renderAll();
      }

      chartTypeWrap.addEventListener("click", (e) => {
        const btn = e.target && e.target.closest ? e.target.closest("button[data-v]") : null;
        if (!btn) return;
        const v = btn.getAttribute("data-v");
        if (!v || v === state.chartType) return;
        setChartType(v);
      });

      monthSel.addEventListener("change", () => {
        state.month = monthSel.value;
        renderAll();
      });

      function enforceNonEmptyMulti() {
        if (state.chartType === "line") return;
        if (!state.countries.length) state.countries = COUNTRY_ORDER.filter(Boolean);
        if (!state.sources.length) state.sources = ["organic", "paid"];
        if (!state.windows.length) state.windows = ["D0", "D7"];
      }

      function renderControls() {
        const isLine = state.chartType === "line";

        renderCountryChips(
          countriesWrap,
          COUNTRY_ORDER,
          state.countries,
          (next) => {
            state.countries = orderCountries(next);
            if (isLine) state.countries = [state.countries[0]];
            enforceNonEmptyMulti();
            renderAll();
          },
          isLine
        );

        renderChipGroup(
          sourcesWrap,
          SOURCE_OPTIONS,
          state.sources,
          (next) => {
            state.sources = Array.isArray(next) ? next : [next];
            if (isLine) state.sources = [state.sources[0]];
            enforceNonEmptyMulti();
            renderAll();
          },
          isLine
        );

        renderChipGroup(
          windowsWrap,
          WINDOW_OPTIONS,
          state.windows,
          (next) => {
            state.windows = Array.isArray(next) ? next : [next];
            if (isLine) state.windows = [state.windows[0]];
            enforceNonEmptyMulti();
            renderAll();
          },
          isLine
        );
      }

      function renderTable() {
        const monthKey = state.month;
        const monthText = monthShort(monthKey);

        const selectedCountries = orderCountries(state.countries);
        const selectedSources = uniqOrdered(state.sources.length ? state.sources : ["organic", "paid"]);
        const selectedWindows = uniqOrdered(state.windows.length ? state.windows : ["D0", "D7"]);

        const countryListText = selectedCountries.length ? selectedCountries.join(", ") : "—";
        const sourceText =
          selectedSources
            .map((k) => (k === "organic" ? "自然量" : "买量"))
            .join(" + ") || "—";
        const windowText = selectedWindows.join(" + ") || "—";

        tableTitleEl.textContent = `数据表（${monthKey} · 国家 ${countryListText} · ${sourceText} · ${windowText}）`;

        const orgAgg = aggMonthByCountry(organicRaw, monthKey);
        const paidAgg = aggMonthByCountry(paidRaw, monthKey);

        const columns = [];
        for (const src of ["organic", "paid"]) {
          if (!selectedSources.includes(src)) continue;
          for (const w of ["D0", "D7"]) {
            if (!selectedWindows.includes(w)) continue;
            columns.push({ src, w, label: `${monthText}${src === "organic" ? "自然量" : "买量"}${w}` });
          }
        }

        // 根据列数动态给 table 一个最小宽度，便于横向滚动
        tableEl.style.minWidth = `${86 + columns.length * 220}px`;

        const thead = `
          <thead>
            <tr>
              <th style="min-width:86px">国家</th>
              ${columns.map((c) => `<th style="min-width:210px">${c.label}</th>`).join("")}
            </tr>
          </thead>
        `;

        const rowsHtml = selectedCountries
          .map((cc) => {
            const cells = columns
              .map((col) => {
                const base = col.src === "organic" ? orgAgg : paidAgg;
                const data =
                  base[cc] && base[cc][col.w]
                    ? base[cc][col.w]
                    : { onlyGames: 0, both: 0, onlySports: 0, total: 0 };

                const total = data.total || 0;
                const g = data.onlyGames || 0;
                const b = data.both || 0;
                const s = data.onlySports || 0;

                const pg = total > 0 ? g / total : 0;
                const pb = total > 0 ? b / total : 0;
                const ps = total > 0 ? s / total : 0;

                return `
                  <td>
                    <div class="mix-cell">
                      <div class="line"><span class="k">仅游戏：</span><span class="v">${fmtInt(utils, g)}</span><span class="p">(${fmtPct(utils, pg, 1)})</span></div>
                      <div class="line"><span class="k">双投：</span><span class="v">${fmtInt(utils, b)}</span><span class="p">(${fmtPct(utils, pb, 1)})</span></div>
                      <div class="line"><span class="k">仅体育：</span><span class="v">${fmtInt(utils, s)}</span><span class="p">(${fmtPct(utils, ps, 1)})</span></div>
                      <div class="line total"><span class="k">总计：</span><span class="v">${fmtInt(utils, total)}</span></div>
                    </div>
                  </td>
                `;
              })
              .join("");

            return `<tr><td><b>${cc}</b></td>${cells}</tr>`;
          })
          .join("");

        tableEl.innerHTML = `${thead}<tbody>${rowsHtml}</tbody>`;
      }

      function renderInsights() {
        if (window.OVP && OVP.insights && typeof OVP.insights.render === "function") {
          OVP.insights.render(insightsEl, MODULE_ID, state.month, { title: "数据分析" });
        } else {
          insightsEl.innerHTML = `
            <div class="ovp-alert" style="margin-top:10px;">
              insights-copy.js 未加载或未初始化（OVP.insights.render 不存在）。
            </div>
          `;
        }
      }

      function renderChart() {
        if (!chartEl) return;

        const monthKey = state.month;
        const selectedCountries = orderCountries(state.countries);
        if (!selectedCountries.length) {
          chartEl.innerHTML = `<div class="empty">未选择国家。</div>`;
          return;
        }

        return loadECharts()
          .then((echarts) => {
            if (!chart) {
              chart = echarts.init(chartEl);
              window.addEventListener("resize", () => {
                try { chart && chart.resize(); } catch(_e) {}
              });
            }

            const textSub = cssVar("--text-sub", cssVar("--muted", "#6b7280"));
            const border = cssVar("--border", "rgba(148,163,184,.35)");
            const yellow = cssVar("--ovp-yellow", "#F6C344");
            const blue = cssVar("--ovp-blue", "#2563eb");
            const green = cssVar("--accent-green", "#22c55e");

            const lightYellow = "#FBE7B0";
            const lightBlue = "#93c5fd";
            const bothGreen = "#86efac";

            if (state.chartType === "line") {
              const country = selectedCountries[0];
              const source = state.sources && state.sources[0] ? state.sources[0] : "organic";
              const w = state.windows && state.windows[0] ? state.windows[0] : "D0";

              const raw = source === "organic" ? organicRaw : paidRaw;
              const daily = aggDaily(raw, monthKey, country);

              const x = daily.dates.map((d) => d.slice(8, 10));

              const series = [
                {
                  name: "仅体育",
                  type: "line",
                  stack: "total",
                  areaStyle: { opacity: 0.28 },
                  symbol: "none",
                  emphasis: { focus: "series" },
                  lineStyle: { width: 2 },
                  itemStyle: { color: yellow },
                  data: daily[w].onlySports,
                },
                {
                  name: "仅游戏",
                  type: "line",
                  stack: "total",
                  areaStyle: { opacity: 0.28 },
                  symbol: "none",
                  emphasis: { focus: "series" },
                  lineStyle: { width: 2 },
                  itemStyle: { color: blue },
                  data: daily[w].onlyGames,
                },
                {
                  name: "双投",
                  type: "line",
                  stack: "total",
                  areaStyle: { opacity: 0.28 },
                  symbol: "none",
                  emphasis: { focus: "series" },
                  lineStyle: { width: 2 },
                  itemStyle: { color: green },
                  data: daily[w].both,
                },
              ];

              const option = {
                animationDuration: 300,
                tooltip: { trigger: "axis" },
                legend: { top: 6, textStyle: { color: textSub } },
                grid: { left: 46, right: 20, top: 42, bottom: 34, containLabel: true },
                xAxis: {
                  type: "category",
                  boundaryGap: false,
                  data: x,
                  axisLabel: { color: textSub },
                  axisLine: { lineStyle: { color: border } },
                },
                yAxis: {
                  type: "value",
                  axisLabel: { color: textSub },
                  axisLine: { lineStyle: { color: border } },
                  splitLine: { lineStyle: { color: border } },
                },
                title: {
                  text: `${monthKey} · ${country} · ${source === "organic" ? "自然量" : "买量"} · ${w}（日级玩家结构）`,
                  left: 10,
                  top: 6,
                  textStyle: { fontSize: 12, fontWeight: 600, color: textSub },
                },
                series,
              };

              chart.clear();
              chart.setOption(option, true);
              return;
            }

            const selectedSources = uniqOrdered(state.sources.length ? state.sources : ["organic", "paid"]);
            const selectedWindows = uniqOrdered(state.windows.length ? state.windows : ["D0", "D7"]);

            const orgAgg = aggMonthByCountry(organicRaw, monthKey);
            const paidAgg = aggMonthByCountry(paidRaw, monthKey);

            const series = [];
            const barWidth = 14;

            function pushStack(srcKey, wKey, partKey, name, color, useDecal) {
              const base = srcKey === "organic" ? orgAgg : paidAgg;
              const data = selectedCountries.map((cc) => {
                const d = base[cc] && base[cc][wKey] ? base[cc][wKey] : null;
                if (!d) return 0;
                return safeNumber(d[partKey]);
              });

              series.push({
                name,
                type: "bar",
                stack: `${srcKey}-${wKey}`,
                barWidth,
                emphasis: { focus: "series" },
                itemStyle: {
                  color,
                  decal: useDecal ? hatchDecal() : null,
                },
                data,
              });
            }

            for (const srcKey of ["organic", "paid"]) {
              if (!selectedSources.includes(srcKey)) continue;

              for (const wKey of ["D0", "D7"]) {
                if (!selectedWindows.includes(wKey)) continue;

                const useDecal = wKey === "D7";
                const isOrganic = srcKey === "organic";
                const cLight = isOrganic ? lightYellow : lightBlue;
                const cDeep = isOrganic ? yellow : blue;

                pushStack(srcKey, wKey, "onlyGames", `${srcKey}-${wKey}-仅游戏`, cLight, useDecal);
                pushStack(srcKey, wKey, "both", `${srcKey}-${wKey}-双投`, bothGreen, useDecal);
                pushStack(srcKey, wKey, "onlySports", `${srcKey}-${wKey}-仅体育`, cDeep, useDecal);
              }
            }

            const option = {
              animationDuration: 300,
              tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
              grid: { left: 46, right: 18, top: 38, bottom: 34, containLabel: true },
              xAxis: {
                type: "category",
                data: selectedCountries,
                axisLabel: { color: textSub },
                axisLine: { lineStyle: { color: border } },
              },
              yAxis: {
                type: "value",
                axisLabel: { color: textSub },
                axisLine: { lineStyle: { color: border } },
                splitLine: { lineStyle: { color: border } },
              },
              title: {
                text: `${monthKey} · 月度总投注人数结构（仅游戏/双投/仅体育；斜纹=D7）`,
                left: 10,
                top: 6,
                textStyle: { fontSize: 12, fontWeight: 600, color: textSub },
              },
              series,
            };

            chart.clear();
            chart.setOption(option, true);
          })
          .catch((e) => {
            chartEl.innerHTML = `<div class="empty">图表库加载失败：${(e && e.message) ? e.message : "echarts not available"}</div>`;
          });
      }

      function renderAll() {
        renderControls();
        renderChart();
        renderTable();
        renderInsights();
      }

      renderAll();
    },
  });
})();
