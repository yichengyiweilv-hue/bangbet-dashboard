// organic-vs-paid/module-registration-compare.js
(function () {
  window.OVP = window.OVP || {};
  const register =
    OVP.registerModule ||
    function (m) {
      (OVP.modules || (OVP.modules = [])).push(m);
    };

  const MODULE_ID = "m1-registration";
  const COUNTRIES = ["GH", "KE", "NG", "TZ", "UG"];

  const ECHARTS_SRC =
    "https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js";

  function injectStylesOnce() {
    const id = "ovp-m1-reg-style";
    if (document.getElementById(id)) return;

    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      .ovp-m1 .row{
        display:flex; gap:14px; flex-wrap:wrap; align-items:flex-end;
        margin-bottom:12px;
      }
      .ovp-m1 .fg{
        display:flex; flex-direction:column; gap:6px;
        min-width:180px;
      }
      .ovp-m1 label{
        font-size:12px;
        color: var(--text-sub, var(--muted, #6b7280));
      }
      .ovp-m1 select{
        height:36px;
        border-radius:10px;
        padding:0 10px;
        border:1px solid var(--border, rgba(148,163,184,.55));
        background: var(--bg-card, rgba(249,250,251,.9));
        color: var(--text-main, var(--text, #0f172a));
        outline:none;
      }
      .ovp-m1 .seg{
        display:flex; gap:6px; flex-wrap:wrap;
        padding:4px;
        border:1px solid var(--border, rgba(148,163,184,.55));
        border-radius:12px;
        background: rgba(255,255,255,.5);
      }
      .ovp-m1 .seg button{
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
      .ovp-m1 .seg button[aria-pressed="true"]{
        background: var(--accent-soft, rgba(37,99,235,.10));
        border-color: rgba(37,99,235,.35);
        color: var(--accent-strong, #2563eb);
        font-weight:600;
      }

      .ovp-m1 .chips{
        display:flex; flex-wrap:wrap; gap:8px;
        padding:2px 0;
      }
      .ovp-m1 .chips .filter-chip{
        font-size:11px;
        padding:3px 8px;
        border-radius: 999px;
        border: 1px solid rgba(148, 163, 184, 0.6);
        background: rgba(249, 250, 251, 0.9);
        display: inline-flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        user-select: none;
        white-space: nowrap;
        color: var(--text-sub, var(--muted, #6b7280));
      }
      .ovp-m1 .chips .filter-chip input{
        accent-color: var(--accent-strong, #2563eb);
        cursor:pointer;
      }
      .ovp-m1 .chips .filter-chip.filter-chip-active{
        border-color: rgba(37, 99, 235, 0.9);
        background: var(--accent-soft, rgba(37,99,235,.10));
        color: var(--accent-strong, #2563eb);
      }

      .ovp-m1 .subline{
        display:flex; gap:16px; align-items:center;
        font-size:12px;
        color: var(--text-sub, var(--muted, #6b7280));
        margin: 2px 0 8px;
      }
      .ovp-m1 .subline .k{ display:flex; align-items:center; gap:8px; }
      .ovp-m1 .dot{ width:10px; height:10px; border-radius:999px; display:inline-block; }

      .ovp-m1 .chart{
        height:340px; width:100%;
        border:1px solid var(--border, rgba(148,163,184,.55));
        border-radius:12px;
        background: rgba(255,255,255,.55);
      }
      .ovp-m1 .hint{
        margin-top:8px;
        font-size:12px;
        color: var(--text-sub, var(--muted, #6b7280));
        line-height:1.55;
      }

      .ovp-m1 .table-wrap{
        margin-top:12px;
        border:1px solid var(--border, rgba(148,163,184,.55));
        border-radius:12px;
        overflow:auto;
        background: rgba(255,255,255,.55);
      }
      .ovp-m1 table{
        width:100%;
        border-collapse:collapse;
        min-width: 680px;
      }
      .ovp-m1 th, .ovp-m1 td{
        padding:10px 12px;
        border-bottom:1px solid rgba(148,163,184,.35);
        text-align:right;
        font-size:12px;
        color: var(--text-main, var(--text, #0f172a));
      }
      .ovp-m1 th{
        position:sticky; top:0;
        background: rgba(248,250,252,.95);
        text-align:right;
        font-weight:600;
        color: var(--text-sub, var(--muted, #6b7280));
      }
      .ovp-m1 th:first-child, .ovp-m1 td:first-child{
        text-align:left;
        min-width: 70px;
      }
      .ovp-m1 tbody tr:hover td{
        background: rgba(37,99,235,.06);
      }
      .ovp-m1 .empty{
        padding:12px 12px;
        color: var(--text-sub, var(--muted, #6b7280));
        font-size:12px;
      }
    `;
    document.head.appendChild(style);
  }

  function cssVar(name, fallback) {
    try {
      const v = getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim();
      return v ? v : fallback;
    } catch (_e) {
      return fallback;
    }
  }

  function readGlobal(name) {
    try {
      return Function(
        "return (typeof " +
          name +
          " !== 'undefined') ? " +
          name +
          " : undefined;"
      )();
    } catch (_e) {
      return undefined;
    }
  }

  function pad2(n) {
    const s = String(n);
    return s.length === 1 ? "0" + s : s;
  }

  function normalizeMonth(input) {
    if (
      window.OVP &&
      OVP.insights &&
      typeof OVP.insights.normalizeMonth === "function"
    ) {
      return OVP.insights.normalizeMonth(input);
    }
    if (input == null) return null;
    const s = String(input).trim();
    if (!s) return null;

    // YYYY-MM
    let m = s.match(/^(\d{4})-(\d{1,2})$/);
    if (m) {
      const y = Number(m[1]);
      const mm = Number(m[2]);
      if (mm >= 1 && mm <= 12) return y + "-" + pad2(mm);
    }
    // YYYYMM
    m = s.match(/^(\d{4})(\d{2})$/);
    if (m) {
      const y = Number(m[1]);
      const mm = Number(m[2]);
      if (mm >= 1 && mm <= 12) return y + "-" + pad2(mm);
    }
    // YYYY-MM-DD / YYYY/MM/DD
    m = s.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$/);
    if (m) {
      const y = Number(m[1]);
      const mm = Number(m[2]);
      if (mm >= 1 && mm <= 12) return y + "-" + pad2(mm);
    }
    return null;
  }

  function monthValue(k) {
    const m = normalizeMonth(k);
    if (!m) return -Infinity;
    const parts = m.split("-");
    const y = Number(parts[0]);
    const mm = Number(parts[1]);
    return y * 12 + (mm - 1);
  }

  function sortMonthsAsc(arr) {
    return arr
      .slice()
      .sort(function (a, b) {
        return monthValue(a) - monthValue(b);
      });
  }

  function pickKey(obj, keys) {
    if (!obj || typeof obj !== "object") return null;
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (Object.prototype.hasOwnProperty.call(obj, k)) return k;
      const lk = k.toLowerCase();
      for (const kk in obj) {
        if (kk && typeof kk === "string" && kk.toLowerCase() === lk) return kk;
      }
    }
    return null;
  }

  function toNumber(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }

  function normalizeToByMonth(raw, globalNames) {
    let src = raw;
    if (!src) {
      for (let i = 0; i < globalNames.length; i++) {
        const v = readGlobal(globalNames[i]);
        if (v) {
          src = v;
          break;
        }
      }
    }
    if (!src) return {};

    if (src && typeof src === "object" && !Array.isArray(src)) {
      const monthsKey = pickKey(src, ["months", "byMonth", "by_month"]);
      if (monthsKey && src[monthsKey] && typeof src[monthsKey] === "object")
        src = src[monthsKey];
    }

    const out = {};

    // A) by-month object
    if (src && typeof src === "object" && !Array.isArray(src)) {
      for (const k in src) {
        const mk = normalizeMonth(k);
        if (!mk) continue;
        const v = src[k];
        if (Array.isArray(v)) {
          out[mk] = (out[mk] || []).concat(v);
        } else if (v && typeof v === "object") {
          const arrKey = pickKey(v, ["data", "rows", "items", "list"]);
          if (arrKey && Array.isArray(v[arrKey]))
            out[mk] = (out[mk] || []).concat(v[arrKey]);
        }
      }
      if (Object.keys(out).length) return out;
    }

    // B) array rows -> derive month from date
    if (Array.isArray(src)) {
      for (let i = 0; i < src.length; i++) {
        const row = src[i];
        if (!row || typeof row !== "object") continue;
        const dk = pickKey(row, ["date", "day", "ds", "stat_date"]);
        const mk = normalizeMonth(dk ? row[dk] : null);
        if (!mk) continue;
        (out[mk] || (out[mk] = [])).push(row);
      }
    }

    return out;
  }

  function getMonthRecords(byMonth, monthKey) {
    const mk = normalizeMonth(monthKey);
    if (!mk || !byMonth) return [];
    if (Array.isArray(byMonth[mk])) return byMonth[mk];
    for (const k in byMonth) {
      if (normalizeMonth(k) === mk && Array.isArray(byMonth[k])) return byMonth[k];
    }
    return [];
  }

  function detectKeys(records) {
    const sample = records && records.length ? records[0] : null;
    const dateKey = pickKey(sample, ["date", "day", "ds", "stat_date"]);
    const countryKey = pickKey(sample, ["country", "geo", "cc"]);
    const regKey = pickKey(sample, ["registration", "registrations", "reg", "register"]);
    return { dateKey, countryKey, regKey };
  }

  function sumMonthlyByCountry(records) {
    const map = new Map();
    if (!Array.isArray(records) || !records.length) return map;
    const keys = detectKeys(records);

    for (let i = 0; i < records.length; i++) {
      const r = records[i];
      if (!r || typeof r !== "object") continue;

      const c = String((keys.countryKey ? r[keys.countryKey] : r.country) || "")
        .toUpperCase();
      if (!COUNTRIES.includes(c)) continue;

      const reg = toNumber(keys.regKey ? r[keys.regKey] : r.registration);
      if (reg === null) continue;

      map.set(c, (map.get(c) || 0) + reg);
    }
    return map;
  }

  function sumDailyTotal(records, countries) {
    const map = new Map(); // date -> sum(reg) across selected countries
    if (!Array.isArray(records) || !records.length) return map;

    const cSet = new Set(countries);
    const keys = detectKeys(records);

    for (let i = 0; i < records.length; i++) {
      const r = records[i];
      if (!r || typeof r !== "object") continue;

      const c = String((keys.countryKey ? r[keys.countryKey] : r.country) || "")
        .toUpperCase();
      if (!cSet.has(c)) continue;

      const dRaw = keys.dateKey ? r[keys.dateKey] : r.date;
      const d =
        typeof dRaw === "string" ? dRaw.trim() : String(dRaw || "").trim();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) continue;

      const reg = toNumber(keys.regKey ? r[keys.regKey] : r.registration);
      if (reg === null) continue;

      map.set(d, (map.get(d) || 0) + reg);
    }
    return map;
  }

  function buildDateList(monthKey) {
    const mk = normalizeMonth(monthKey);
    if (!mk) return [];
    const parts = mk.split("-");
    const y = Number(parts[0]);
    const m = Number(parts[1]);
    if (!Number.isFinite(y) || !Number.isFinite(m)) return [];
    const days = new Date(y, m, 0).getDate();
    const out = [];
    for (let d = 1; d <= days; d++)
      out.push(`${parts[0]}-${pad2(m)}-${pad2(d)}`);
    return out;
  }

  function loadScriptOnce(id, src) {
    return new Promise(function (resolve, reject) {
      const existing = document.getElementById(id);
      if (existing) {
        if (existing.getAttribute("data-loaded") === "1") return resolve();
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });
        return;
      }
      const s = document.createElement("script");
      s.id = id;
      s.src = src;
      s.async = true;
      s.onload = function () {
        s.setAttribute("data-loaded", "1");
        resolve();
      };
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function loadECharts() {
    if (window.echarts) return Promise.resolve(window.echarts);
    return loadScriptOnce("ovp-echarts", ECHARTS_SRC).then(function () {
      return window.echarts;
    });
  }

  function buildBarOption(params) {
    const text = cssVar("--text-main", cssVar("--text", "#0f172a"));
    const muted = cssVar("--text-sub", cssVar("--muted", "#6b7280"));
    const axisLine = cssVar("--border", "rgba(148,163,184,.55)");
    const organicColor = cssVar("--ovp-yellow", "#F6C344");
    const paidColor = cssVar("--ovp-blue", "#3B82F6");

    return {
      backgroundColor: "transparent",
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      legend: { top: 6, textStyle: { color: muted } },
      grid: { left: 40, right: 16, top: 44, bottom: 36 },
      xAxis: {
        type: "category",
        data: params.countries,
        axisLabel: { color: muted },
        axisLine: { lineStyle: { color: axisLine } },
      },
      yAxis: {
        type: "value",
        axisLabel: { color: muted },
        splitLine: { lineStyle: { color: "rgba(148,163,184,.25)" } },
        axisLine: { lineStyle: { color: axisLine } },
      },
      series: [
        {
          name: "自然量注册",
          type: "bar",
          data: params.organicVals,
          itemStyle: { color: organicColor },
          barMaxWidth: 32,
        },
        {
          name: "买量注册",
          type: "bar",
          data: params.paidVals,
          itemStyle: { color: paidColor },
          barMaxWidth: 32,
        },
      ],
      textStyle: { color: text },
    };
  }

  function buildLineOption(params) {
    const text = cssVar("--text-main", cssVar("--text", "#0f172a"));
    const muted = cssVar("--text-sub", cssVar("--muted", "#6b7280"));
    const axisLine = cssVar("--border", "rgba(148,163,184,.55)");
    const organicColor = cssVar("--ovp-yellow", "#F6C344");
    const paidColor = cssVar("--ovp-blue", "#3B82F6");

    return {
      backgroundColor: "transparent",
      tooltip: { trigger: "axis", axisPointer: { type: "line" } },
      legend: { top: 6, textStyle: { color: muted } },
      grid: { left: 44, right: 16, top: 44, bottom: 44 },
      xAxis: {
        type: "category",
        data: params.dates,
        boundaryGap: false,
        axisLabel: {
          color: muted,
          formatter: function (v) {
            return String(v).slice(-2); // 日
          },
        },
        axisLine: { lineStyle: { color: axisLine } },
      },
      yAxis: {
        type: "value",
        axisLabel: { color: muted },
        splitLine: { lineStyle: { color: "rgba(148,163,184,.25)" } },
        axisLine: { lineStyle: { color: axisLine } },
      },
      series: [
        {
          name: "自然量注册（日合计）",
          type: "line",
          data: params.organicDaily,
          showSymbol: false,
          smooth: false,
          lineStyle: { width: 2, color: organicColor },
          itemStyle: { color: organicColor },
        },
        {
          name: "买量注册（日合计）",
          type: "line",
          data: params.paidDaily,
          showSymbol: false,
          smooth: false,
          lineStyle: { width: 2, color: paidColor },
          itemStyle: { color: paidColor },
        },
      ],
      textStyle: { color: text },
    };
  }

  register({
    id: MODULE_ID,
    title: "自然量 vs 买量注册量",
    subtitle: "柱状：国家拆分（月汇总） · 折线：日级趋势（国家合计）",
    span: "full",
    render: function (ctx) {
      const mountEl = ctx && ctx.mountEl;
      const utils =
        (ctx && ctx.utils) ||
        (window.OVP && OVP.utils) || {
          fmtInt: function (v) {
            return v == null ? "—" : String(v);
          },
          fmtPct: function (v) {
            return v == null ? "—" : String(v);
          },
        };

      if (!mountEl) return;
      injectStylesOnce();

      const organicByMonth = normalizeToByMonth(ctx.organic, [
        "RAW_ORGANIC_BY_MONTH",
        "ORGANIC_BY_MONTH",
        "organicByMonth",
        "organic_by_month",
      ]);
      const paidByMonth = normalizeToByMonth(ctx.paid, [
        "RAW_PAID_BY_MONTH",
        "PAID_BY_MONTH",
        "paidByMonth",
        "paid_by_month",
      ]);

      const monthSet = new Set();
      Object.keys(organicByMonth || {}).forEach(function (k) {
        const mk = normalizeMonth(k);
        if (mk) monthSet.add(mk);
      });
      Object.keys(paidByMonth || {}).forEach(function (k) {
        const mk = normalizeMonth(k);
        if (mk) monthSet.add(mk);
      });
      const monthsAsc = sortMonthsAsc(Array.from(monthSet));
      if (!monthsAsc.length) {
        mountEl.innerHTML = `
          <div class="ovp-m1">
            <div class="empty">没读到月份数据：请检查 organic-data.js / paid-data.js 是否包含 RAW_*_BY_MONTH（月 -> 日明细数组，字段至少要有 date / country / registration）。</div>
          </div>
        `;
        return;
      }

      const latestMonth = monthsAsc[monthsAsc.length - 1];
      const monthsDesc = monthsAsc.slice().reverse();

      const uid = "m1-reg-" + Math.random().toString(16).slice(2);
      const monthId = uid + "-month";
      const countriesId = uid + "-countries";
      const chartId = uid + "-chart";
      const tableId = uid + "-table";
      const insightsId = uid + "-insights";
      const hintId = uid + "-hint";

      mountEl.innerHTML = `
        <div class="ovp-m1">
          <div class="row">
            <div class="fg">
              <label for="${monthId}">月份</label>
              <select id="${monthId}">
                ${monthsDesc
                  .map(function (m) {
                    return `<option value="${m}">${m}</option>`;
                  })
                  .join("")}
              </select>
            </div>

            <div class="fg" style="min-width:320px">
              <label>国家（多选）</label>
              <div class="chips" id="${countriesId}">
                ${COUNTRIES.map(function (c) {
                  return `
                    <label class="filter-chip filter-chip-active" data-country="${c}">
                      <input type="checkbox" value="${c}" checked />
                      <span>${c}</span>
                    </label>
                  `;
                }).join("")}
              </div>
            </div>

            <div class="fg" style="min-width:260px">
              <label>图表</label>
              <div class="seg" role="group" aria-label="图表类型切换">
                <button type="button" data-type="bar" aria-pressed="true">月度柱状图</button>
                <button type="button" data-type="line" aria-pressed="false">日级折线图</button>
              </div>
            </div>
          </div>

          <div class="subline">
            <div class="k"><span class="dot" style="background:${cssVar(
              "--ovp-yellow",
              "#F6C344"
            )}"></span>自然量</div>
            <div class="k"><span class="dot" style="background:${cssVar(
              "--ovp-blue",
              "#3B82F6"
            )}"></span>买量</div>
          </div>

          <div id="${chartId}" class="chart"></div>
          <div class="hint" id="${hintId}"></div>

          <div class="table-wrap">
            <table id="${tableId}">
              <thead>
                <tr>
                  <th>国家</th>
                  <th>自然量注册占比 (%)</th>
                  <th>买量注册占比 (%)</th>
                  <th>自然量注册数</th>
                  <th>买量注册数</th>
                  <th>总注册数</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>

          <div id="${insightsId}"></div>
        </div>
      `;

      const monthSel = mountEl.querySelector("#" + CSS.escape(monthId));
      const countriesWrap = mountEl.querySelector("#" + CSS.escape(countriesId));
      const chartEl = mountEl.querySelector("#" + CSS.escape(chartId));
      const tableEl = mountEl.querySelector("#" + CSS.escape(tableId));
      const insightsEl = mountEl.querySelector("#" + CSS.escape(insightsId));
      const hintEl = mountEl.querySelector("#" + CSS.escape(hintId));
      const segBtns = Array.from(mountEl.querySelectorAll(".seg button"));

      const state = {
        month: latestMonth,
        countries: COUNTRIES.slice(),
        chartType: "bar",
      };

      if (monthSel) monthSel.value = state.month;

      function getSelectedCountries() {
        const checked = Array.from(
          countriesWrap.querySelectorAll('input[type="checkbox"]:checked')
        ).map(function (el) {
          return String(el.value || "").toUpperCase();
        });
        const out = COUNTRIES.filter(function (c) {
          return checked.indexOf(c) !== -1;
        });
        return out.length ? out : COUNTRIES.slice();
      }

      function updateHint() {
        const cs = state.countries.length ? state.countries : COUNTRIES;
        if (state.chartType === "bar") {
          hintEl.textContent = `口径：${state.month} 月汇总 · 国家：${cs.join("/")}`;
        } else {
          hintEl.textContent = `口径：${state.month} 日级折线 · 国家合计：${cs.join(
            "/"
          )} · 指标：注册量`;
        }
      }

      function updateTable() {
        const cs = state.countries.length ? state.countries : COUNTRIES;

        const orgRecords = getMonthRecords(organicByMonth, state.month);
        const paidRecords = getMonthRecords(paidByMonth, state.month);
        const orgMap = sumMonthlyByCountry(orgRecords);
        const paidMap = sumMonthlyByCountry(paidRecords);

        const tbody = tableEl.querySelector("tbody");
        if (!tbody) return;

        const rows = cs
          .map(function (c) {
            const o = orgMap.get(c) || 0;
            const p = paidMap.get(c) || 0;
            const t = o + p;

            // 注意：fmtPct(null) 会被 Number(null)=0 影响，所以这里用 undefined 代表缺失
            const oShare = t > 0 ? o / t : undefined;
            const pShare = t > 0 ? p / t : undefined;

            return `
              <tr>
                <td>${c}</td>
                <td>${utils.fmtPct(oShare)}</td>
                <td>${utils.fmtPct(pShare)}</td>
                <td>${utils.fmtInt(o)}</td>
                <td>${utils.fmtInt(p)}</td>
                <td>${utils.fmtInt(t)}</td>
              </tr>
            `;
          })
          .join("");

        tbody.innerHTML =
          rows || `<tr><td colspan="6" class="empty">该筛选条件下无数据</td></tr>`;
      }

      function updateInsights() {
        if (window.OVP && OVP.insights && typeof OVP.insights.render === "function") {
          OVP.insights.render(insightsEl, MODULE_ID, state.month, { title: "数据分析" });
          return;
        }
        insightsEl.innerHTML = `<div class="empty">insights-copy.js 未加载：无法渲染数据分析文案。</div>`;
      }

      let chart = null;

      function updateChart() {
        if (!chart) return;

        const cs = state.countries.length ? state.countries : COUNTRIES;
        const ordered = COUNTRIES.filter(function (c) {
          return cs.indexOf(c) !== -1;
        });

        if (state.chartType === "bar") {
          const orgMap = sumMonthlyByCountry(getMonthRecords(organicByMonth, state.month));
          const paidMap = sumMonthlyByCountry(getMonthRecords(paidByMonth, state.month));

          const organicVals = ordered.map(function (c) {
            return orgMap.get(c) || 0;
          });
          const paidVals = ordered.map(function (c) {
            return paidMap.get(c) || 0;
          });

          chart.setOption(
            buildBarOption({
              month: state.month,
              countries: ordered,
              organicVals,
              paidVals,
            }),
            true
          );
          return;
        }

        // line：按日级，国家合计（两根线）
        const dates = buildDateList(state.month);
        const orgDailyMap = sumDailyTotal(getMonthRecords(organicByMonth, state.month), cs);
        const paidDailyMap = sumDailyTotal(getMonthRecords(paidByMonth, state.month), cs);

        const organicDaily = dates.map(function (d) {
          return orgDailyMap.get(d) || 0;
        });
        const paidDaily = dates.map(function (d) {
          return paidDailyMap.get(d) || 0;
        });

        chart.setOption(
          buildLineOption({
            month: state.month,
            dates,
            organicDaily,
            paidDaily,
          }),
          true
        );
      }

      function updateAll() {
        updateHint();
        updateTable();
        updateInsights();
        updateChart();
      }

      monthSel.addEventListener("change", function () {
        state.month = normalizeMonth(monthSel.value) || latestMonth;
        updateAll();
      });

      countriesWrap.addEventListener("change", function (e) {
        const t = e && e.target;
        if (!t || t.tagName !== "INPUT") return;

        const label = t.closest("label");
        if (label) label.classList.toggle("filter-chip-active", !!t.checked);

        state.countries = getSelectedCountries();
        updateAll();
      });

      segBtns.forEach(function (btn) {
        btn.addEventListener("click", function () {
          const type = btn.getAttribute("data-type") || "bar";
          state.chartType = type === "line" ? "line" : "bar";
          segBtns.forEach(function (b) {
            b.setAttribute("aria-pressed", b === btn ? "true" : "false");
          });
          updateAll();
        });
      });

      loadECharts()
        .then(function (echarts) {
          if (!chartEl) return;
          chart = echarts.init(chartEl);
          updateAll();
          window.addEventListener("resize", function () {
            if (chart) chart.resize();
          });
        })
        .catch(function () {
          chartEl.innerHTML = `<div class="empty">ECharts 加载失败：请检查网络或 CDN 可用性。</div>`;
          updateAll();
        });
    },
  });
})();
