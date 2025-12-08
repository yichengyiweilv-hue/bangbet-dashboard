// organic-vs-paid/module-arppu.js
(function () {
  window.OVP = window.OVP || {};
  const register =
    OVP.registerModule ||
    function (m) {
      (OVP.modules || (OVP.modules = [])).push(m);
    };

  const MODULE_ID = "m3-arppu";
  const COUNTRIES = ["GH", "KE", "NG", "TZ", "UG"];

  const ECHARTS_SRC =
    "https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js";

  function injectStylesOnce() {
    const id = "ovp-m3-arppu-style";
    if (document.getElementById(id)) return;

    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      .ovp-m3{display:flex;flex-direction:column;gap:12px}
      .ovp-m3 .row{display:flex;flex-wrap:wrap;gap:12px;align-items:flex-end}
      .ovp-m3 .fg{display:flex;flex-direction:column;gap:6px;min-width:160px}
      .ovp-m3 label{font-size:12px;color:var(--text-sub, var(--muted, #6b7280))}
      .ovp-m3 select{
        height:36px; padding:0 10px; border-radius:12px;
        border:1px solid var(--border-subtle, var(--border, rgba(148,163,184,.60)));
        background: rgba(255,255,255,.92);
        color: var(--text-main, var(--text, #0f172a));
        outline:none;
      }
      .ovp-m3 .chips{display:flex;flex-wrap:wrap;gap:6px}
      .ovp-m3 .chip{
        display:inline-flex;align-items:center;gap:6px;
        padding:6px 10px;border-radius:999px;
        border:1px solid var(--border-subtle, var(--border, rgba(148,163,184,.55)));
        background: rgba(15,23,42,0.03);
        color: var(--text-main, var(--text, #0f172a));
        cursor:pointer; user-select:none;
        font-size:12px; line-height:1;
      }
      .ovp-m3 .chip input{
        width:14px;height:14px;margin:0;
        accent-color: var(--accent-strong, #1d4ed8);
      }
      .ovp-m3 .chip:not(.is-on){
        opacity:.55;
        background: rgba(15,23,42,0.02);
      }
      .ovp-m3 .chip.is-on{
        background: var(--accent-soft, rgba(37,99,235,0.12));
        border-color: rgba(37,99,235,0.26);
      }

      .ovp-m3 .seg{
        display:inline-flex; gap:6px; padding:4px;
        border:1px solid var(--border-subtle, var(--border, rgba(148,163,184,.55)));
        background: rgba(15,23,42,0.03);
        border-radius:12px;
      }
      .ovp-m3 .seg button{
        height:28px; padding:0 10px;
        border:0; border-radius:10px;
        background:transparent; color:var(--text-sub, var(--muted, #6b7280));
        cursor:pointer;
        font-size:12px;
      }
      .ovp-m3 .seg button[aria-pressed="true"]{
        background: rgba(37,99,235,0.12);
        color: var(--text-main, var(--text, #0f172a));
      }

      .ovp-m3 .hint{
        margin-top:2px;
        font-size:12px;color:var(--text-sub, var(--muted, #6b7280));
        line-height:1.5;
      }

      .ovp-m3 .chart{
        height:340px; width:100%;
        border:1px solid var(--border-subtle, var(--border, rgba(148,163,184,.55)));
        border-radius:12px;
        background: rgba(255,255,255,.65);
      }

      .ovp-m3 .table-wrap{overflow:auto}
      .ovp-m3 table{
        width:100%;
        border-collapse:separate; border-spacing:0;
        border:1px solid var(--border-subtle, var(--border, rgba(148,163,184,.55)));
        border-radius:12px; overflow:hidden;
        background: rgba(255,255,255,.65);
      }
      .ovp-m3 th,.ovp-m3 td{
        padding:10px 12px;
        border-bottom:1px solid var(--border-subtle, var(--border, rgba(148,163,184,.45)));
        font-size:12px;
        white-space:nowrap;
      }
      .ovp-m3 th{color:var(--text-sub, var(--muted, #6b7280)); text-align:left}
      .ovp-m3 td{color:var(--text-main, var(--text, #0f172a)); text-align:left}
      .ovp-m3 tr:last-child td{border-bottom:0}
      .ovp-m3 .empty{
        padding:12px;
        border:1px dashed var(--border-subtle, var(--border, rgba(148,163,184,.55)));
        border-radius:12px;
        color:var(--text-sub, var(--muted, #6b7280));
        font-size:12px; line-height:1.6;
        background: rgba(255,255,255,.55);
      }
      .ovp-m3 .subline{
        display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap;
        font-size:12px; color:var(--text-sub, var(--muted, #6b7280));
        margin-top:-4px;
      }
      .ovp-m3 .subline .k{display:inline-flex; gap:6px; align-items:center}
      .ovp-m3 .dot{width:8px;height:8px;border-radius:999px;display:inline-block}
      .ovp-m3 .stripe{
        width:18px;height:10px;border-radius:4px;display:inline-block;
        border:1px solid var(--border-subtle, var(--border, rgba(148,163,184,.55)));
        background:
          repeating-linear-gradient(135deg,
            rgba(15,23,42,0.20),
            rgba(15,23,42,0.20) 2px,
            transparent 2px,
            transparent 5px
          );
      }
    `;
    document.head.appendChild(style);
  }

  function cssVar(name, fallback) {
    try {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name);
      if (v && String(v).trim()) return String(v).trim();
    } catch (_e) {}
    return fallback;
  }

  function isFiniteNumber(x) {
    return typeof x === "number" && Number.isFinite(x);
  }
  function toNumber(x) {
    if (isFiniteNumber(x)) return x;
    const n = Number(x);
    return Number.isFinite(n) ? n : null;
  }

  function pad2(n) {
    const s = String(n);
    return s.length === 1 ? "0" + s : s;
  }

  function readGlobal(name) {
    try {
      return Function(`return (typeof ${name} !== "undefined") ? ${name} : undefined;`)();
    } catch (_e) {
      return undefined;
    }
  }

  function pickKey(obj, keys) {
    if (!obj || typeof obj !== "object") return null;

    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (Object.prototype.hasOwnProperty.call(obj, k)) return k;
    }

    const map = Object.create(null);
    for (const k of Object.keys(obj)) map[String(k).toLowerCase()] = k;

    for (let i = 0; i < keys.length; i++) {
      const want = String(keys[i]).toLowerCase();
      if (map[want]) return map[want];
    }
    return null;
  }

  function normalizeMonth(input) {
    if (window.OVP && OVP.insights && typeof OVP.insights.normalizeMonth === "function") {
      return OVP.insights.normalizeMonth(input);
    }
    if (!input) return null;

    if (input instanceof Date && !isNaN(input.getTime())) {
      return input.getFullYear() + "-" + pad2(input.getMonth() + 1);
    }

    const s = String(input).trim();
    let m = s.match(/^(\d{4})[-\/](\d{1,2})$/);
    if (m) return m[1] + "-" + pad2(m[2]);

    m = s.match(/^(\d{4})(\d{2})$/);
    if (m) return m[1] + "-" + m[2];

    m = s.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$/);
    if (m) return m[1] + "-" + pad2(m[2]);

    return null;
  }

  function normalizeDate(input) {
    if (!input) return null;

    if (input instanceof Date && !isNaN(input.getTime())) {
      return input.getFullYear() + "-" + pad2(input.getMonth() + 1) + "-" + pad2(input.getDate());
    }

    const s = String(input).trim();
    const m = s.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$/);
    if (m) return m[1] + "-" + pad2(m[2]) + "-" + pad2(m[3]);
    return null;
  }

  function monthValue(key) {
    const m = String(key || "").match(/^(\d{4})-(\d{2})$/);
    if (!m) return -1;
    return Number(m[1]) * 100 + Number(m[2]);
  }

  function uniqueMonthsFrom(recordsA, recordsB) {
    const set = new Set();
    for (const r of recordsA || []) if (r && r.month) set.add(r.month);
    for (const r of recordsB || []) if (r && r.month) set.add(r.month);
    const arr = Array.from(set).filter(Boolean);
    arr.sort((a, b) => monthValue(a) - monthValue(b));
    return arr;
  }

  // 输出日维记录（供月汇总 / 日折线）
  function normalizeDailyArppuRecords(raw) {
    const out = [];
    if (!raw) return out;

    const push = (date, country, d0Up, d7Up, d0Val, d7Val, fallbackMonth) => {
      const d = normalizeDate(date);
      const m = normalizeMonth(d || fallbackMonth);
      const c = String(country || "").toUpperCase();
      if (!m || !COUNTRIES.includes(c)) return;

      const dateFixed = d || (m + "-01");

      out.push({
        date: dateFixed,
        month: m,
        country: c,
        d0_up: toNumber(d0Up) || 0,
        d7_up: toNumber(d7Up) || 0,
        d0_val: toNumber(d0Val) || 0,
        d7_val: toNumber(d7Val) || 0
      });
    };

    // unwrap wrappers
    if (raw && typeof raw === "object" && !Array.isArray(raw)) {
      const maybeByMonth = pickKey(raw, ["byMonth", "months", "monthMap", "dataByMonth"]);
      if (maybeByMonth && raw[maybeByMonth] && typeof raw[maybeByMonth] === "object") {
        return normalizeDailyArppuRecords(raw[maybeByMonth]);
      }

      const arrKey = pickKey(raw, ["data", "rows", "items", "list"]);
      if (arrKey && Array.isArray(raw[arrKey])) return normalizeDailyArppuRecords(raw[arrKey]);
    }

    // A) array of rows
    if (Array.isArray(raw)) {
      if (!raw.length) return out;
      const sample = raw[0] || {};
      const dateKey = pickKey(sample, ["date", "day", "dt"]);
      const monthKey = pickKey(sample, ["month", "ym", "period"]);
      const countryKey = pickKey(sample, ["country", "geo", "cc", "market", "nation"]);

      const d0UpKey = pickKey(sample, ["D0_unique_purchase", "d0_unique_purchase"]);
      const d7UpKey = pickKey(sample, ["D7_unique_purchase", "d7_unique_purchase"]);
      const d0ValKey = pickKey(sample, ["D0_PURCHASE_VALUE", "d0_purchase_value"]);
      const d7ValKey = pickKey(sample, ["D7_PURCHASE_VALUE", "d7_purchase_value"]);

      for (const row of raw) {
        if (!row || typeof row !== "object") continue;
        push(
          dateKey ? row[dateKey] : null,
          countryKey ? row[countryKey] : null,
          d0UpKey ? row[d0UpKey] : null,
          d7UpKey ? row[d7UpKey] : null,
          d0ValKey ? row[d0ValKey] : null,
          d7ValKey ? row[d7ValKey] : null,
          monthKey ? row[monthKey] : null
        );
      }
      return out;
    }

    // B) object keyed by month: { '2025-09': [ ... ] }
    if (raw && typeof raw === "object") {
      for (const k of Object.keys(raw)) {
        const maybeMonth = normalizeMonth(k);
        const val = raw[k];
        if (!maybeMonth) continue;

        if (Array.isArray(val)) {
          if (!val.length) continue;
          const sample = val[0] || {};
          const dateKey = pickKey(sample, ["date", "day", "dt"]);
          const countryKey = pickKey(sample, ["country", "geo", "cc", "market", "nation"]);
          const d0UpKey = pickKey(sample, ["D0_unique_purchase", "d0_unique_purchase"]);
          const d7UpKey = pickKey(sample, ["D7_unique_purchase", "d7_unique_purchase"]);
          const d0ValKey = pickKey(sample, ["D0_PURCHASE_VALUE", "d0_purchase_value"]);
          const d7ValKey = pickKey(sample, ["D7_PURCHASE_VALUE", "d7_purchase_value"]);

          for (const row of val) {
            if (!row || typeof row !== "object") continue;
            push(
              dateKey ? row[dateKey] : (row.date || row.day || row.dt),
              countryKey ? row[countryKey] : row.country,
              d0UpKey ? row[d0UpKey] : row.D0_unique_purchase,
              d7UpKey ? row[d7UpKey] : row.D7_unique_purchase,
              d0ValKey ? row[d0ValKey] : row.D0_PURCHASE_VALUE,
              d7ValKey ? row[d7ValKey] : row.D7_PURCHASE_VALUE,
              maybeMonth
            );
          }
        }
      }
    }

    return out;
  }

  function emptyAgg() {
    return { d0_up: 0, d7_up: 0, d0_val: 0, d7_val: 0 };
  }

  function buildDailyAggMap(records) {
    const map = new Map();
    for (const r of records || []) {
      if (!r || !r.date || !r.country) continue;
      const key = `${r.date}|${r.country}`;
      const prev = map.get(key) || emptyAgg();
      prev.d0_up += toNumber(r.d0_up) || 0;
      prev.d7_up += toNumber(r.d7_up) || 0;
      prev.d0_val += toNumber(r.d0_val) || 0;
      prev.d7_val += toNumber(r.d7_val) || 0;
      map.set(key, prev);
    }
    return map;
  }

  function buildMonthlyAggMap(records) {
    const map = new Map();
    for (const r of records || []) {
      if (!r || !r.month || !r.country) continue;
      const key = `${r.month}|${r.country}`;
      const prev = map.get(key) || emptyAgg();
      prev.d0_up += toNumber(r.d0_up) || 0;
      prev.d7_up += toNumber(r.d7_up) || 0;
      prev.d0_val += toNumber(r.d0_val) || 0;
      prev.d7_val += toNumber(r.d7_val) || 0;
      map.set(key, prev);
    }
    return map;
  }

  function daysInMonth(monthKey) {
    const m = String(monthKey || "").match(/^(\d{4})-(\d{2})$/);
    if (!m) return 30;
    const y = Number(m[1]);
    const mm = Number(m[2]);
    return new Date(y, mm, 0).getDate();
  }

  function buildMonthDates(monthKey) {
    const m = String(monthKey || "").match(/^(\d{4})-(\d{2})$/);
    if (!m) return [];
    const y = Number(m[1]);
    const mm = Number(m[2]);
    const n = daysInMonth(monthKey);

    const out = [];
    for (let d = 1; d <= n; d++) out.push(`${y}-${pad2(mm)}-${pad2(d)}`);
    return out;
  }

  function calcArppu(agg, horizon) {
    if (!agg) return null;
    const isD7 = String(horizon).toUpperCase() === "D7";
    const up = isD7 ? (toNumber(agg.d7_up) || 0) : (toNumber(agg.d0_up) || 0);
    const val = isD7 ? (toNumber(agg.d7_val) || 0) : (toNumber(agg.d0_val) || 0);
    if (!up || up <= 0) return null;
    return val / up;
  }

  function loadScriptOnce(id, src) {
    return new Promise((resolve, reject) => {
      if (document.getElementById(id)) return resolve();
      const s = document.createElement("script");
      s.id = id;
      s.src = src;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error(`load failed: ${src}`));
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

  register({
    id: MODULE_ID,
    title: "D0 / D7 ARPPU",
    subtitle: "ARPPU = PURCHASE_VALUE / unique_purchase（D0/D7）",
    span: "half",

    render({ mountEl, organic, paid, utils }) {
      injectStylesOnce();

      const organicRaw =
        organic ??
        readGlobal("organicData") ??
        readGlobal("organicMonthlyData") ??
        readGlobal("ORGANIC_DATA") ??
        readGlobal("RAW_ORGANIC_BY_MONTH") ??
        readGlobal("RAW_ORGANIC") ??
        readGlobal("ORGANIC");

      const paidRaw =
        paid ??
        readGlobal("paidData") ??
        readGlobal("paidMonthlyData") ??
        readGlobal("PAID_DATA") ??
        readGlobal("RAW_PAID_BY_MONTH") ??
        readGlobal("RAW_PAID") ??
        readGlobal("PAID");

      const organicRecords = normalizeDailyArppuRecords(organicRaw);
      const paidRecords = normalizeDailyArppuRecords(paidRaw);

      const months = uniqueMonthsFrom(organicRecords, paidRecords);
      if (!months.length) {
        mountEl.innerHTML = `
          <div class="ovp-m3">
            <div class="empty">
              没读到 ARPPU 所需字段：请检查数据源是否包含 date / country / D0_unique_purchase / D0_PURCHASE_VALUE / D7_unique_purchase / D7_PURCHASE_VALUE。
            </div>
          </div>
        `;
        return;
      }

      const latestMonth = months[months.length - 1];

      const orgDailyMap = buildDailyAggMap(organicRecords);
      const paidDailyMap = buildDailyAggMap(paidRecords);
      const orgMonthMap = buildMonthlyAggMap(organicRecords);
      const paidMonthMap = buildMonthlyAggMap(paidRecords);

      const uid = `ovp-${MODULE_ID}-${Math.random().toString(16).slice(2)}`;
      const monthId = `${uid}-month`;
      const chartId = `${uid}-chart`;
      const tableId = `${uid}-table`;
      const hintId = `${uid}-hint`;
      const insightsId = `${uid}-insights`;

      const organicColor = cssVar("--ovp-yellow", "#F6C344");
      const paidColor = cssVar("--ovp-blue", "#2563eb");

      mountEl.innerHTML = `
        <div class="ovp-m3">
          <div class="row">
            <div class="fg">
              <label for="${monthId}">月份</label>
              <select id="${monthId}"></select>
            </div>

            <div class="fg" style="min-width:320px">
              <label>国家（多选）</label>
              <div class="chips" data-role="countries">
                ${COUNTRIES.map(
                  (c) => `
                    <label class="chip is-on">
                      <input type="checkbox" name="${uid}-country" value="${c}" checked />
                      <span>${c}</span>
                    </label>
                  `
                ).join("")}
              </div>
            </div>

            <div class="fg" style="min-width:220px">
              <label>图表</label>
              <div class="seg" role="group" aria-label="图表类型切换">
                <button type="button" data-type="bar" aria-pressed="true">月度柱状图</button>
                <button type="button" data-type="line" aria-pressed="false">日级折线图</button>
              </div>
            </div>

            <div class="fg" style="min-width:220px">
              <label>D0 / D7（多选）</label>
              <div class="chips" data-role="horizons">
                <label class="chip is-on">
                  <input type="checkbox" name="${uid}-horizon" value="D0" checked />
                  <span>D0</span>
                </label>
                <label class="chip is-on">
                  <input type="checkbox" name="${uid}-horizon" value="D7" checked />
                  <span>D7</span>
                </label>
              </div>
            </div>
          </div>

          <div class="subline">
            <div class="k"><span class="dot" style="background:${organicColor}"></span>自然量</div>
            <div class="k"><span class="dot" style="background:${paidColor}"></span>买量</div>
            <div class="k"><span class="stripe"></span>D7 斜线（柱状图）</div>
          </div>

          <div id="${chartId}" class="chart"></div>
          <div class="hint" id="${hintId}"></div>

          <div class="table-wrap">
            <table id="${tableId}">
              <thead>
                <tr>
                  <th>国家</th>
                  <th>自然量 D0 ARPPU</th>
                  <th>自然量 D7 ARPPU</th>
                  <th>买量 D0 ARPPU</th>
                  <th>买量 D7 ARPPU</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>

          <div id="${insightsId}"></div>
        </div>
      `;

      const monthSel = mountEl.querySelector(`#${CSS.escape(monthId)}`);
      const chartEl = mountEl.querySelector(`#${CSS.escape(chartId)}`);
      const tableEl = mountEl.querySelector(`#${CSS.escape(tableId)}`);
      const hintEl = mountEl.querySelector(`#${CSS.escape(hintId)}`);
      const insightsEl = mountEl.querySelector(`#${CSS.escape(insightsId)}`);

      monthSel.innerHTML = months.map((m) => `<option value="${m}">${m}</option>`).join("");
      monthSel.value = latestMonth;

      const segBtns = Array.from(mountEl.querySelectorAll(".seg button"));
      let chartType = "bar";

      function setChartType(next) {
        chartType = next === "line" ? "line" : "bar";
        for (const b of segBtns) {
          const isOn = b.getAttribute("data-type") === chartType;
          b.setAttribute("aria-pressed", isOn ? "true" : "false");
        }
      }

      const countryInputs = Array.from(
        mountEl.querySelectorAll(`input[name="${CSS.escape(uid)}-country"]`)
      );
      const horizonInputs = Array.from(
        mountEl.querySelectorAll(`input[name="${CSS.escape(uid)}-horizon"]`)
      );

      function syncChipClasses() {
        for (const el of countryInputs) {
          const label = el.closest("label.chip");
          if (label) label.classList.toggle("is-on", !!el.checked);
        }
        for (const el of horizonInputs) {
          const label = el.closest("label.chip");
          if (label) label.classList.toggle("is-on", !!el.checked);
        }
      }

      function getSelectedCountries() {
        const chosen = countryInputs.filter((i) => i.checked).map((i) => String(i.value || "").toUpperCase());
        const set = new Set(chosen);
        const list = COUNTRIES.filter((c) => set.has(c));
        return list.length ? list : COUNTRIES.slice();
      }

      function getSelectedHorizons() {
        const chosen = horizonInputs.filter((i) => i.checked).map((i) => String(i.value || "").toUpperCase());
        const out = [];
        if (chosen.includes("D0")) out.push("D0");
        if (chosen.includes("D7")) out.push("D7");
        return out.length ? out : ["D0"];
      }

      function fmtMoney(v, digits) {
        const n = toNumber(v);
        if (n === null) return "—";
        const d = typeof digits === "number" ? digits : 2;
        if (utils && typeof utils.fmtMoney === "function") return utils.fmtMoney(n, "USD", d);
        return `$${n.toFixed(d)}`;
      }

      function updateInsights(month) {
        if (window.OVP && OVP.insights && typeof OVP.insights.render === "function") {
          OVP.insights.render(insightsEl, MODULE_ID, month, { title: "数据分析" });
          return;
        }
        insightsEl.innerHTML = `<div class="empty">未加载 insights-copy.js：请在 index.html 里把它放到各 module-*.js 之前。</div>`;
      }

      function updateTable(month, countries) {
        const tbody = tableEl.querySelector("tbody");
        if (!tbody) return;

        const rows = [];
        for (const c of countries) {
          const oAgg = orgMonthMap.get(`${month}|${c}`) || emptyAgg();
          const pAgg = paidMonthMap.get(`${month}|${c}`) || emptyAgg();

          rows.push(`
            <tr>
              <td>${c}</td>
              <td>${fmtMoney(calcArppu(oAgg, "D0"), 2)}</td>
              <td>${fmtMoney(calcArppu(oAgg, "D7"), 2)}</td>
              <td>${fmtMoney(calcArppu(pAgg, "D0"), 2)}</td>
              <td>${fmtMoney(calcArppu(pAgg, "D7"), 2)}</td>
            </tr>
          `);
        }
        tbody.innerHTML = rows.join("") || `<tr><td colspan="5">—</td></tr>`;
      }

      function buildBarOption(month, countries, horizons) {
        const text = cssVar("--text", "#0f172a") || "#0f172a";
        const muted = cssVar("--muted", "#6b7280") || "#6b7280";
        const border = cssVar("--border", "rgba(148,163,184,.55)") || "rgba(148,163,184,.55)";

        const decal = {
          symbol: "rect",
          rotation: Math.PI / 4,
          dashArrayX: [1, 0],
          dashArrayY: [6, 4],
          color: "rgba(15,23,42,0.22)"
        };

        const series = [];
        const pushSeries = (name, color, isD7, getter) => {
          series.push({
            name,
            type: "bar",
            barMaxWidth: 18,
            itemStyle: { color, decal: isD7 ? decal : undefined },
            data: countries.map((c) => getter(c)),
            emphasis: { focus: "series" }
          });
        };

        if (horizons.includes("D0")) {
          pushSeries("自然量 D0", organicColor, false, (c) => calcArppu(orgMonthMap.get(`${month}|${c}`) || emptyAgg(), "D0"));
        }
        if (horizons.includes("D7")) {
          pushSeries("自然量 D7", organicColor, true, (c) => calcArppu(orgMonthMap.get(`${month}|${c}`) || emptyAgg(), "D7"));
        }
        if (horizons.includes("D0")) {
          pushSeries("买量 D0", paidColor, false, (c) => calcArppu(paidMonthMap.get(`${month}|${c}`) || emptyAgg(), "D0"));
        }
        if (horizons.includes("D7")) {
          pushSeries("买量 D7", paidColor, true, (c) => calcArppu(paidMonthMap.get(`${month}|${c}`) || emptyAgg(), "D7"));
        }

        return {
          tooltip: {
            trigger: "axis",
            axisPointer: { type: "shadow" },
            formatter: function (params) {
              const lines = [];
              if (params && params.length) {
                lines.push(`${params[0].axisValue}`);
                for (const it of params) {
                  const v = it.value;
                  lines.push(`${it.marker}${it.seriesName}：${v === null ? "—" : fmtMoney(v, 2)}`);
                }
              }
              return lines.join("<br/>");
            }
          },
          legend: {
            type: "scroll",
            data: series.map((s) => s.name),
            textStyle: { color: muted }
          },
          grid: { left: 24, right: 18, top: 52, bottom: 28, containLabel: true },
          xAxis: {
            type: "category",
            data: countries,
            axisLabel: { color: muted },
            axisLine: { lineStyle: { color: border } },
            axisTick: { lineStyle: { color: border } }
          },
          yAxis: {
            type: "value",
            axisLabel: {
              color: muted,
              formatter: function (v) {
                const n = toNumber(v);
                if (n === null) return "";
                return n.toFixed(2);
              }
            },
            axisLine: { lineStyle: { color: border } },
            splitLine: { lineStyle: { color: border, opacity: 0.35 } }
          },
          series,
          title: {
            text: `按国家对比（${month}）`,
            left: 0,
            textStyle: { color: text, fontSize: 12, fontWeight: 600 }
          }
        };
      }

      function buildLineOption(month, countries, horizons) {
        const text = cssVar("--text", "#0f172a") || "#0f172a";
        const muted = cssVar("--muted", "#6b7280") || "#6b7280";
        const border = cssVar("--border", "rgba(148,163,184,.55)") || "rgba(148,163,184,.55)";

        const dates = buildMonthDates(month);
        const palette = [
          cssVar("--accent-strong", "#1d4ed8"),
          cssVar("--accent-green", "#16a34a"),
          "#f59e0b",
          "#7c3aed",
          "#0ea5e9"
        ];

        const colorByCountry = Object.create(null);
        countries.forEach((c, idx) => (colorByCountry[c] = palette[idx % palette.length]));

        const series = [];
        for (const c of countries) {
          const baseColor = colorByCountry[c] || "#2563eb";

          for (const h of horizons) {
            const isD7 = h === "D7";
            const oData = dates.map((d) => calcArppu(orgDailyMap.get(`${d}|${c}`) || emptyAgg(), h));
            const pData = dates.map((d) => calcArppu(paidDailyMap.get(`${d}|${c}`) || emptyAgg(), h));

            series.push({
              name: `${c} 自然 ${h}`,
              type: "line",
              data: oData,
              smooth: true,
              showSymbol: false,
              lineStyle: {
                color: baseColor,
                width: 2,
                type: isD7 ? "dotted" : "dashed",
                opacity: isD7 ? 0.55 : 1
              },
              itemStyle: { color: baseColor }
            });

            series.push({
              name: `${c} 买量 ${h}`,
              type: "line",
              data: pData,
              smooth: true,
              showSymbol: false,
              lineStyle: {
                color: baseColor,
                width: isD7 ? 1.6 : 2.2,
                type: "solid",
                opacity: isD7 ? 0.55 : 1
              },
              itemStyle: { color: baseColor }
            });
          }
        }

        return {
          tooltip: {
            trigger: "axis",
            formatter: function (params) {
              const lines = [];
              if (params && params.length) {
                lines.push(params[0].axisValue);
                for (const it of params) {
                  const v = it.value;
                  lines.push(`${it.marker}${it.seriesName}：${v === null ? "—" : fmtMoney(v, 2)}`);
                }
              }
              return lines.join("<br/>");
            }
          },
          legend: {
            type: "scroll",
            data: series.map((s) => s.name),
            textStyle: { color: muted }
          },
          grid: { left: 24, right: 18, top: 52, bottom: 28, containLabel: true },
          xAxis: {
            type: "category",
            data: dates,
            boundaryGap: false,
            axisLabel: { color: muted, formatter: (v) => String(v || "").slice(-2) },
            axisLine: { lineStyle: { color: border } },
            axisTick: { lineStyle: { color: border } }
          },
          yAxis: {
            type: "value",
            axisLabel: {
              color: muted,
              formatter: function (v) {
                const n = toNumber(v);
                if (n === null) return "";
                return n.toFixed(2);
              }
            },
            axisLine: { lineStyle: { color: border } },
            splitLine: { lineStyle: { color: border, opacity: 0.35 } }
          },
          series,
          title: {
            text: `按日趋势（${month}）`,
            left: 0,
            textStyle: { color: text, fontSize: 12, fontWeight: 600 }
          }
        };
      }

      let chart = null;
      let echartsApi = null;

      function update() {
        syncChipClasses();

        const month = monthSel.value;
        const countries = getSelectedCountries();
        const horizons = getSelectedHorizons();

        if (chartType === "bar") {
          hintEl.textContent = `柱状图：${month}（ARPPU）按国家对比；D7 用斜线填充。`;
        } else {
          const lineCount = countries.length * horizons.length * 2;
          hintEl.textContent = `折线图：${month} 日级 ARPPU；当前 ${countries.length} 国 × ${horizons.join("+")} × 2（自然/买量）= ${lineCount} 条线。`;
        }

        updateTable(month, countries);
        updateInsights(month);

        if (!chart || !echartsApi) return;

        const option =
          chartType === "bar"
            ? buildBarOption(month, countries, horizons)
            : buildLineOption(month, countries, horizons);

        chart.setOption(option, true);
      }

      monthSel.addEventListener("change", update);
      for (const b of segBtns) {
        b.addEventListener("click", () => {
          setChartType(b.getAttribute("data-type"));
          update();
        });
      }
      for (const i of countryInputs) i.addEventListener("change", update);
      for (const i of horizonInputs) i.addEventListener("change", update);

      setChartType("bar");
      syncChipClasses();
      update();

      loadECharts()
        .then((api) => {
          echartsApi = api;
          chart = api.init(chartEl);
          update();
          window.addEventListener("resize", () => {
            try { chart && chart.resize(); } catch (_e) {}
          });
        })
        .catch((e) => {
          chartEl.innerHTML = `<div class="empty">图表库加载失败：${(e && e.message) ? e.message : "echarts not available"}</div>`;
          update();
        });
    }
  });
})();
