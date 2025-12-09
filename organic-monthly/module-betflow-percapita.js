/**
 * organic-monthly/module-betflow-percapita.js
 * ------------------------------------------------------------
 * 模块4：D0 / D7 人均流水（总 / 体育 / 游戏）
 *
 * 交互：
 * - 月份/国家/D0-D7：多选（平铺打钩）
 * - 图形：柱状（月度）/ 折线（日级）单选
 * - 维度：总流水/体育流水/游戏流水 单选
 *
 * 图表：
 * - 柱状图：横轴国家（固定顺序 GH/KE/NG/TZ/UG），每个国家按 “月份×(D0/D7)” 出柱；
 *          同月份同色，D7 在同色基础上加斜线阴影（ECharts decal），非堆叠。
 * - 折线图：日级数据，按国家分线；同国家 D0/D7 同色，D0 虚线、D7 实线；多月拼接为同一条时间序列。
 *
 * 表格：
 * - 行：国家
 * - 列：自然量(D0/D7) + 买量(D0/D7)（是否显示 D0/D7 列取决于筛选器）
 * - 买量数据来源：全局 RAW_PAID_BY_MONTH（如未加载则显示“—”并给提示）
 *
 * 文案：
 * - 从 insights.js 读取 moduleId = 'betflow' 的文案
 * - 多选月份时：逐月展示每一个选中月份的文案
 */
(function () {
  const moduleId = "betflow";

  const COUNTRY_ORDER = ["GH", "KE", "NG", "TZ", "UG"];
  const WINDOW_ORDER = ["D0", "D7"];
  const CHART_TYPES = [
    { key: "bar", label: "月度柱状图" },
    { key: "line", label: "日级折线图" },
  ];

  const METRICS = [
    { key: "total", label: "人均总流水" },
    { key: "sports", label: "人均体育流水" },
    { key: "games", label: "人均游戏流水" },
  ];

  // D7 斜线阴影（ECharts 5 decal）
  const D7_DECAL = {
    symbol: "rect",
    rotation: Math.PI / 4,
    color: "rgba(0,0,0,0.18)",
    dashArrayX: [1, 0],
    dashArrayY: [4, 4],
    symbolSize: 6,
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

  function cssVar(name, fallback) {
    try {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name);
      return v && v.trim() ? v.trim() : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function ensureStyle() {
    if (document.getElementById("ovp-style-betflow")) return;
    const style = document.createElement("style");
    style.id = "ovp-style-betflow";
    style.textContent = `
      .ovp-bf-filters{
        border:1px solid rgba(148, 163, 184, 0.60);
        border-radius:12px;
        background: rgba(249, 250, 251, 0.90);
        padding:10px 10px 8px;
        display:flex;
        flex-wrap:wrap;
        gap:12px 14px;
      }
      .ovp-bf-filter-group{
        display:flex;
        flex-direction:column;
        gap:6px;
        min-width: 200px;
      }
      .ovp-bf-filter-label{
        font-size:11px;
        color: var(--muted);
        line-height:1.2;
        display:flex;
        align-items:center;
        gap:8px;
      }
      .ovp-bf-badge{
        display:inline-flex;
        align-items:center;
        padding:1px 8px;
        border-radius:999px;
        border:1px solid rgba(148, 163, 184, 0.55);
        background: rgba(255,255,255,0.9);
        color: var(--muted);
        font-size:10px;
      }
      .ovp-bf-options{
        display:flex;
        flex-wrap:wrap;
        gap:6px;
      }
      .ovp-bf-chip{
        display:inline-flex;
        align-items:center;
        gap:6px;
        padding:4px 10px;
        border-radius:999px;
        border:1px solid rgba(148, 163, 184, 0.55);
        background: rgba(255,255,255,0.85);
        cursor:pointer;
        user-select:none;
        transition: transform 0.06s ease, background 0.12s ease, border-color 0.12s ease;
        font-size:12px;
        color: var(--text);
      }
      .ovp-bf-chip:hover{ transform: translateY(-1px); }
      .ovp-bf-chip input{ display:none; }
      .ovp-bf-chip.is-checked{
        border-color: rgba(37, 99, 235, 0.55);
        background: rgba(219, 234, 254, 0.85);
      }
      .ovp-bf-hint{
        margin-top: 2px;
        font-size: 11px;
        color: var(--muted);
        line-height: 1.45;
      }

      .ovp-bf-table-scroll{
        border:1px solid rgba(148, 163, 184, 0.60);
        border-radius:12px;
        background:#fff;
        overflow:auto;
      }
      .ovp-bf-table{
        width:100%;
        border-collapse:separate;
        border-spacing:0;
        min-width: 720px;
        font-size:12px;
      }
      .ovp-bf-table th, .ovp-bf-table td{
        border-bottom:1px solid rgba(226, 232, 240, 1);
        padding:10px 10px;
        text-align:center; /* 需求：表格文字居中 */
        white-space:nowrap;
      }
      .ovp-bf-table thead th{
        position:sticky;
        top:0;
        background:#f8fafc;
        z-index:1;
        font-weight:600;
        color:#0f172a;
      }
      .ovp-bf-table tbody tr:hover td{
        background: rgba(248, 250, 252, 0.7);
      }

      .ovp-bf-insight-title{
        font-weight:600;
        margin-bottom:8px;
        color: var(--text);
      }
      .ovp-bf-insight-body{
        color: var(--text);
        font-size:12px;
        line-height:1.65;
        white-space: pre-wrap;
        word-break: break-word;
      }
      .ovp-bf-insight-body.is-empty{
        color: var(--muted);
      }
      .ovp-bf-insight-block{
        padding:10px 10px;
        border:1px solid rgba(148, 163, 184, 0.40);
        border-radius:10px;
        background: rgba(249, 250, 251, 0.70);
        margin-bottom:10px;
      }
      .ovp-bf-insight-month{
        font-weight:600;
        margin-bottom:6px;
        color:#0f172a;
      }
    `;
    document.head.appendChild(style);
  }

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function num(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  function safeDiv(a, b) {
    const aa = num(a);
    const bb = num(b);
    return bb > 0 ? aa / bb : null;
  }

  function monthLabel(m) {
    const s = String(m || "");
    if (/^\d{4}-\d{2}$/.test(s)) {
      const mm = Number(s.slice(5, 7));
      return `${mm}月`;
    }
    return s;
  }

  function readGlobal(name) {
    try {
      return Function(
        `return (typeof ${name} !== "undefined") ? ${name} : undefined;`
      )();
    } catch (_) {
      return undefined;
    }
  }

  function getPalette() {
    // 优先用主题变量
    const blue = cssVar("--ovp-blue", "");
    const yellow = cssVar("--ovp-yellow", "");
    const out = [];
    if (blue) out.push(blue);
    if (yellow) out.push(yellow);
    return out.length ? out.concat(FALLBACK_COLORS) : FALLBACK_COLORS;
  }

  function metricLabel(metricKey) {
    const hit = METRICS.find((m) => m.key === metricKey);
    return hit ? hit.label.replace("人均", "") : String(metricKey || "");
  }

  function metricFields(win, metricKey) {
    const w = String(win || "").toUpperCase();
    const k = String(metricKey || "sports").toLowerCase();

    if (k === "total") {
      return {
        flowField: `${w}_TOTAL_BET_FLOW`,
        userField: `${w}_TOTAL_BET_PLACED_USER`,
      };
    }
    if (k === "games" || k === "game") {
      return {
        flowField: `${w}_GAMES_BET_FLOW`,
        userField: `${w}_GAMES_BET_PLACED_USER`,
      };
    }
    // default sports
    return {
      flowField: `${w}_SPORTS_BET_FLOW`,
      userField: `${w}_SPORTS_BET_PLACED_USER`,
    };
  }

  const SUM_FIELDS = [
    "D0_TOTAL_BET_FLOW",
    "D0_TOTAL_BET_PLACED_USER",
    "D0_SPORTS_BET_FLOW",
    "D0_SPORTS_BET_PLACED_USER",
    "D0_GAMES_BET_FLOW",
    "D0_GAMES_BET_PLACED_USER",
    "D7_TOTAL_BET_FLOW",
    "D7_TOTAL_BET_PLACED_USER",
    "D7_SPORTS_BET_FLOW",
    "D7_SPORTS_BET_PLACED_USER",
    "D7_GAMES_BET_FLOW",
    "D7_GAMES_BET_PLACED_USER",
  ];

  function emptyAggObj() {
    const o = {};
    for (const f of SUM_FIELDS) o[f] = 0;
    return o;
  }

  function getMonthAgg(rawByMonth, month, cache) {
    const key = String(month || "");
    if (cache.has(key)) return cache.get(key);

    const rows = rawByMonth && Array.isArray(rawByMonth[key]) ? rawByMonth[key] : [];
    const map = new Map();

    for (const row of rows) {
      const c = String(row && row.country ? row.country : "").toUpperCase();
      if (!c) continue;

      let agg = map.get(c);
      if (!agg) {
        agg = emptyAggObj();
        map.set(c, agg);
      }
      for (const f of SUM_FIELDS) {
        agg[f] += num(row && row[f]);
      }
    }

    cache.set(key, map);
    return map;
  }

  function buildLayoutHTML(moduleId) {
    return `
      <div class="ovp-module-stack">
        <div class="ovp-bf-filters" id="bf-filters-${moduleId}">
          <div class="ovp-bf-filter-group">
            <div class="ovp-bf-filter-label">月份 <span class="ovp-bf-badge">多选</span></div>
            <div class="ovp-bf-options" id="bf-months-${moduleId}"></div>
          </div>

          <div class="ovp-bf-filter-group">
            <div class="ovp-bf-filter-label">国家 <span class="ovp-bf-badge">多选</span></div>
            <div class="ovp-bf-options" id="bf-countries-${moduleId}"></div>
          </div>

          <div class="ovp-bf-filter-group">
            <div class="ovp-bf-filter-label">图形 <span class="ovp-bf-badge">单选</span></div>
            <div class="ovp-bf-options" id="bf-chartType-${moduleId}"></div>
          </div>

          <div class="ovp-bf-filter-group">
            <div class="ovp-bf-filter-label">D0 / D7 <span class="ovp-bf-badge">多选</span></div>
            <div class="ovp-bf-options" id="bf-windows-${moduleId}"></div>
          </div>

          <div class="ovp-bf-filter-group">
            <div class="ovp-bf-filter-label">维度 <span class="ovp-bf-badge">单选</span></div>
            <div class="ovp-bf-options" id="bf-metric-${moduleId}"></div>
            <div class="ovp-bf-hint">折线：日级；D0 虚线、D7 实线。柱状：同月同色，D7 斜线阴影。</div>
          </div>
        </div>

        <div>
          <div class="ovp-chart is-empty" id="chart-${moduleId}" style="height:380px;">
            <div class="ovp-skeleton" aria-hidden="true"></div>
          </div>
          <div class="ovp-chart-note" id="chart-note-${moduleId}"></div>
        </div>

        <div>
          <div class="ovp-bf-table-scroll">
            <table class="ovp-bf-table" id="table-${moduleId}"></table>
          </div>
          <div class="ovp-chart-note" id="table-note-${moduleId}"></div>
        </div>

        <div class="ovp-insight" id="insight-wrap-${moduleId}">
          <div class="ovp-bf-insight-title" id="insight-title-${moduleId}">数据分析</div>
          <div class="ovp-bf-insight-body is-empty" id="insight-${moduleId}">文案待填写：./insights.js</div>
        </div>
      </div>
    `;
  }

  function buildChipsHtml(options, group, labelFn) {
    const fmt = typeof labelFn === "function" ? labelFn : (v) => String(v);
    return (Array.isArray(options) ? options : [])
      .map((v) => {
        const val = String(v);
        const label = fmt(val);
        return `
          <label class="ovp-bf-chip">
            <input type="checkbox" data-group="${group}" data-value="${val}" />
            <span>${escapeHtml(label)}</span>
          </label>
        `;
      })
      .join("");
  }

  function ensureAtLeastOne(set, fallbackVal) {
    if (set && set.size) return;
    if (fallbackVal !== undefined && fallbackVal !== null) set.add(String(fallbackVal));
  }

  OVP.registerModule({
    id: moduleId,
    title: "D0 / D7 人均流水（体育 / 游戏 / 总）",
    subtitle: "口径：BET_FLOW / BET_PLACED_USER（单位：USD / 下注用户）",
    span: "full",

    render({ mountEl, rawByMonth, months, latestMonth, utils }) {
      ensureStyle();

      if (!mountEl) return;
      if (!rawByMonth || typeof rawByMonth !== "object") {
        mountEl.innerHTML = `<div class="ovp-alert">未检测到源数据 rawByMonth（RAW_ORGANIC_BY_MONTH）。</div>`;
        return;
      }
      if (!window.echarts) {
        mountEl.innerHTML = `<div class="ovp-alert">未检测到 ECharts：请检查 echarts 是否已在页面加载。</div>`;
        return;
      }

      const allMonths =
        utils && typeof utils.sortMonths === "function"
          ? utils.sortMonths(
              Array.isArray(months) && months.length
                ? months
                : Object.keys(rawByMonth || {})
            )
          : (Array.isArray(months) ? months.slice() : Object.keys(rawByMonth || {}));

      if (!allMonths.length) {
        mountEl.innerHTML = `<div class="ovp-alert">数据已加载，但未检测到月份 key（rawByMonth 为空）。</div>`;
        return;
      }

      const lm = latestMonth || allMonths[allMonths.length - 1];

      // paid 数据（可选）：RAW_PAID_BY_MONTH 若未加载，表内买量列显示 “—”
      const rawPaidByMonth = readGlobal("RAW_PAID_BY_MONTH") || (window && window.RAW_PAID_BY_MONTH);

      const palette = getPalette();
      const monthIndex = new Map();
      allMonths.forEach((m, i) => monthIndex.set(String(m), i));

      const countryIndex = new Map();
      COUNTRY_ORDER.forEach((c, i) => countryIndex.set(String(c), i));

      const cacheOrganic = new Map();
      const cachePaid = new Map();

      const state = {
        chartType: "bar",
        metric: "sports",
        months: new Set(lm ? [String(lm)] : []),
        countries: new Set(COUNTRY_ORDER),
        windows: new Set(WINDOW_ORDER),
      };

      function monthList() {
        const list = [...state.months];
        return utils && typeof utils.sortMonths === "function"
          ? utils.sortMonths(list)
          : list.sort((a, b) => String(a).localeCompare(String(b)));
      }
      function countryList() {
        return COUNTRY_ORDER.filter((c) => state.countries.has(c));
      }
      function windowList() {
        return WINDOW_ORDER.filter((w) => state.windows.has(w));
      }

      function getMonthColor(month) {
        const idx = monthIndex.has(String(month)) ? monthIndex.get(String(month)) : 0;
        return palette[idx % palette.length];
      }
      function getCountryColor(country) {
        // 用国家固定顺序映射颜色，保证同国家稳定
        const idx = countryIndex.has(String(country)) ? countryIndex.get(String(country)) : 0;
        return palette[idx % palette.length];
      }

      function fmtUsd(v, digits = 2) {
        const n =
          utils && typeof utils.safeNumber === "function"
            ? utils.safeNumber(v)
            : (Number.isFinite(Number(v)) ? Number(v) : null);

        if (n === null) return "—";
        if (utils && typeof utils.fmtMoney === "function") return utils.fmtMoney(n, "USD", digits);
        return "$" + n.toFixed(digits);
      }

      function setChipState(filtersEl) {
        const inputs = filtersEl.querySelectorAll("input[data-group][data-value]");
        for (const input of inputs) {
          const group = input.getAttribute("data-group");
          const val = input.getAttribute("data-value");
          let checked = false;

          if (group === "chartType") checked = state.chartType === val;
          else if (group === "metric") checked = state.metric === val;
          else if (group === "months") checked = state.months.has(val);
          else if (group === "countries") checked = state.countries.has(val);
          else if (group === "windows") checked = state.windows.has(val);

          input.checked = !!checked;
          const label = input.closest(".ovp-bf-chip");
          if (label) label.classList.toggle("is-checked", !!checked);
        }
      }

      function renderInsights(monthsSel, insightTitleEl, insightEl) {
        if (!insightTitleEl || !insightEl) return;

        const ms = Array.isArray(monthsSel) ? monthsSel : [];
        insightTitleEl.textContent = ms.length ? `数据分析（${ms.join(" / ")}）` : "数据分析";

        const blocks = [];
        for (const m of ms) {
          const t = (OVP.getInsight(moduleId, m) || "").trim();
          if (!t) continue;
          blocks.push(`
            <div class="ovp-bf-insight-block">
              <div class="ovp-bf-insight-month">${escapeHtml(m)}</div>
              <div style="white-space:pre-wrap;">${escapeHtml(t)}</div>
            </div>
          `);
        }

        if (!blocks.length) {
          insightEl.textContent = "文案待填写：./insights.js";
          insightEl.classList.add("is-empty");
          return;
        }

        insightEl.innerHTML = blocks.join("");
        insightEl.classList.remove("is-empty");
      }

      function renderTable(tableEl, tableNoteEl, monthsSel, countriesSel, winsSel, metricKey) {
        if (!tableEl) return;

        const dimLabel = metricLabel(metricKey);

        // 聚合口径：所选月份内所有日数据求和后，再算人均
        const organicTotalByCountry = new Map();
        const paidTotalByCountry = new Map();

        for (const c of countriesSel) {
          organicTotalByCountry.set(c, emptyAggObj());
          paidTotalByCountry.set(c, emptyAggObj());
        }

        for (const m of monthsSel) {
          const organicAgg = getMonthAgg(rawByMonth, m, cacheOrganic);
          for (const c of countriesSel) {
            const tgt = organicTotalByCountry.get(c);
            const src = organicAgg.get(c);
            if (!tgt || !src) continue;
            for (const f of SUM_FIELDS) tgt[f] += num(src[f]);
          }

          if (rawPaidByMonth) {
            const paidAgg = getMonthAgg(rawPaidByMonth, m, cachePaid);
            for (const c of countriesSel) {
              const tgt = paidTotalByCountry.get(c);
              const src = paidAgg.get(c);
              if (!tgt || !src) continue;
              for (const f of SUM_FIELDS) tgt[f] += num(src[f]);
            }
          }
        }

        const colsNatural = winsSel.map((w) => ({
          key: `org_${w}`,
          label: `自然量${w} ${dimLabel}`,
          win: w,
          src: "organic",
        }));
        const colsPaid = winsSel.map((w) => ({
          key: `paid_${w}`,
          label: `买量${w} ${dimLabel}`,
          win: w,
          src: "paid",
        }));

        const cols = [...colsNatural, ...colsPaid];

        const thead = `
          <thead>
            <tr>
              <th>国家</th>
              ${cols.map((c) => `<th>${escapeHtml(c.label)}</th>`).join("")}
            </tr>
          </thead>
        `;

        const tbodyRows = countriesSel
          .map((country) => {
            const tdList = cols.map((col) => {
              const fields = metricFields(col.win, metricKey);

              let agg = null;
              if (col.src === "organic") agg = organicTotalByCountry.get(country);
              else agg = rawPaidByMonth ? paidTotalByCountry.get(country) : null;

              const val = agg ? safeDiv(agg[fields.flowField], agg[fields.userField]) : null;
              return `<td>${val === null ? "—" : escapeHtml(fmtUsd(val, 2))}</td>`;
            });

            return `<tr><td style="font-weight:600;">${escapeHtml(country)}</td>${tdList.join("")}</tr>`;
          })
          .join("");

        const tbody = `<tbody>${tbodyRows}</tbody>`;

        tableEl.innerHTML = thead + tbody;

        if (tableNoteEl) {
          const mText = monthsSel.length ? monthsSel.join(", ") : "—";
          const wText = winsSel.length ? winsSel.join("/") : "—";
          const paidText = rawPaidByMonth
            ? "买量口径：RAW_PAID_BY_MONTH（已加载）"
            : "买量口径：RAW_PAID_BY_MONTH（未加载，买量列显示为“—”）";

          tableNoteEl.textContent = `表格口径：所选月份汇总后计算人均（sum(BET_FLOW)/sum(BET_PLACED_USER)）。当前筛选：月份=${mText}；国家=${countriesSel.join("/") || "—"}；窗口=${wText}；维度=${dimLabel}。${paidText}`;
        }
      }

      function renderChart(chart, chartEl, chartNoteEl, monthsSel, countriesSel, winsSel, metricKey) {
        if (!chart) return;
        const dimLabel = metricLabel(metricKey);

        // 如果无选择，直接给空态
        if (!countriesSel.length || !monthsSel.length || !winsSel.length) {
          chart.setOption(
            {
              title: {
                text: "无可用数据",
                left: "center",
                top: "middle",
                textStyle: { color: "#94a3b8", fontSize: 12 },
              },
              xAxis: { show: false },
              yAxis: { show: false },
              series: [],
            },
            { notMerge: true }
          );
          if (chartNoteEl) {
            chartNoteEl.textContent = "当前筛选无数据：请至少选择 1 个国家 / 月份 / D0/D7。";
          }
          return;
        }

        if (state.chartType === "bar") {
          const barCount = monthsSel.length * winsSel.length;
          const barWidth =
            barCount <= 4 ? 14 : barCount <= 6 ? 12 : barCount <= 10 ? 10 : 8;

          const series = [];
          for (const m of monthsSel) {
            const color = getMonthColor(m);
            const monthAgg = getMonthAgg(rawByMonth, m, cacheOrganic);

            for (const w of winsSel) {
              const fields = metricFields(w, metricKey);
              const name = `${monthLabel(m)} ${w}`;
              const data = countriesSel.map((c) => {
                const agg = monthAgg.get(c);
                return agg ? safeDiv(agg[fields.flowField], agg[fields.userField]) : null;
              });

              const s = {
                name,
                type: "bar",
                barWidth,
                data,
                itemStyle:
                  w === "D7"
                    ? { color, decal: D7_DECAL, opacity: 0.9 }
                    : { color, opacity: 0.9 },
                emphasis: { focus: "series" },
              };
              series.push(s);
            }
          }

          chart.setOption(
            {
              tooltip: {
                trigger: "axis",
                axisPointer: { type: "shadow" },
                formatter: (params) => {
                  const list = Array.isArray(params) ? params : [params];
                  if (!list.length) return "";
                  const country = list[0].axisValueLabel || list[0].axisValue || "";
                  const lines = [`<strong>${escapeHtml(country)}</strong>`];
                  for (const p of list) {
                    if (!p) continue;
                    const v = p.data;
                    lines.push(
                      `${p.marker}${escapeHtml(p.seriesName)}：${
                        v == null ? "—" : escapeHtml(fmtUsd(v, 2))
                      }`
                    );
                  }
                  return lines.join("<br/>");
                },
              },
              legend: { type: "scroll", top: 10, left: 10 },
              grid: { left: 50, right: 18, top: 48, bottom: 44, containLabel: true },
              xAxis: { type: "category", data: countriesSel, axisTick: { alignWithLabel: true } },
              yAxis: {
                type: "value",
                name: `${dimLabel}人均流水（USD/下注用户）`,
                axisLabel: { formatter: (v) => "$" + Number(v).toFixed(1) },
              },
              series,
            },
            { notMerge: true }
          );

          if (chartNoteEl) {
            chartNoteEl.textContent = `柱状图口径：月度汇总后的人均流水（sum(BET_FLOW)/sum(BET_PLACED_USER)）。同月份同色，D7 斜线阴影。当前选择：${monthsSel.join(
              ", "
            )} · ${countriesSel.join("/")} · ${winsSel.join("/") } · ${dimLabel}`;
          }
          return;
        }

        // line（日级）：按国家分线；同国家 D0/D7 同色；D0 虚线、D7 实线
        const countriesSet = new Set(countriesSel);
        const datesSet = new Set();
        const dailyAgg = new Map(); // key: date|country -> { D0:{flow,user}, D7:{flow,user} }

        for (const m of monthsSel) {
          const rows = Array.isArray(rawByMonth[m]) ? rawByMonth[m] : [];
          for (const row of rows) {
            const c = String(row && row.country ? row.country : "").toUpperCase();
            if (!countriesSet.has(c)) continue;
            const date = row && row.date ? String(row.date) : "";
            if (!date) continue;

            datesSet.add(date);
            const key = `${date}|${c}`;
            let cell = dailyAgg.get(key);
            if (!cell) {
              cell = { D0: { flow: 0, user: 0 }, D7: { flow: 0, user: 0 } };
              dailyAgg.set(key, cell);
            }

            for (const w of winsSel) {
              const f = metricFields(w, metricKey);
              cell[w].flow += num(row && row[f.flowField]);
              cell[w].user += num(row && row[f.userField]);
            }
          }
        }

        const dates = [...datesSet].sort();
        const series = [];
        const metaBySeriesIndex = new Map();

        for (const c of countriesSel) {
          const color = getCountryColor(c);
          for (const w of winsSel) {
            const data = dates.map((d) => {
              const cell = dailyAgg.get(`${d}|${c}`);
              if (!cell) return null;
              return safeDiv(cell[w].flow, cell[w].user);
            });

            series.push({
              name: c, // 同名：legend 切换会同时影响 D0/D7 两条
              type: "line",
              symbol: "none",
              data,
              itemStyle: { color },
              lineStyle: { width: 2, type: w === "D0" ? "dashed" : "solid" },
            });

            metaBySeriesIndex.set(series.length - 1, { country: c, win: w });
          }
        }

        chart.setOption(
          {
            tooltip: {
              trigger: "axis",
              axisPointer: { type: "line" },
              formatter: (params) => {
                const list = Array.isArray(params) ? params : [params];
                if (!list.length) return "";
                const date = list[0].axisValueLabel || list[0].axisValue || "";
                const lines = [`<strong>${escapeHtml(date)}</strong>`];

                for (const p of list) {
                  if (!p) continue;
                  const meta = metaBySeriesIndex.get(p.seriesIndex) || {};
                  const label = `${meta.country || p.seriesName || ""} ${meta.win || ""}`.trim();
                  const v = p.data;
                  lines.push(
                    `${p.marker}${escapeHtml(label)}：${
                      v == null ? "—" : escapeHtml(fmtUsd(v, 2))
                    }`
                  );
                }
                return lines.join("<br/>");
              },
            },
            legend: { type: "scroll", top: 10, left: 10, data: countriesSel },
            grid: { left: 50, right: 18, top: 48, bottom: 44, containLabel: true },
            xAxis: {
              type: "category",
              data: dates,
              boundaryGap: false,
              axisLabel: { formatter: (v) => String(v).slice(5) }, // MM-DD
            },
            yAxis: {
              type: "value",
              name: `${dimLabel}人均流水（USD/下注用户）`,
              axisLabel: { formatter: (v) => "$" + Number(v).toFixed(1) },
            },
            series,
          },
          { notMerge: true }
        );

        if (chartNoteEl) {
          chartNoteEl.textContent = `折线图口径：日级人均流水；D0 虚线、D7 实线；同国家同色。当前选择：${monthsSel.join(
            ", "
          )} · ${countriesSel.join("/")} · ${winsSel.join("/") } · ${dimLabel}`;
        }
      }

      // Mount
      mountEl.innerHTML = buildLayoutHTML(moduleId);

      const filtersEl = mountEl.querySelector(`#bf-filters-${moduleId}`);
      const monthsEl = mountEl.querySelector(`#bf-months-${moduleId}`);
      const countriesEl = mountEl.querySelector(`#bf-countries-${moduleId}`);
      const chartTypeEl = mountEl.querySelector(`#bf-chartType-${moduleId}`);
      const windowsEl = mountEl.querySelector(`#bf-windows-${moduleId}`);
      const metricEl = mountEl.querySelector(`#bf-metric-${moduleId}`);

      const chartEl = mountEl.querySelector(`#chart-${moduleId}`);
      const chartNoteEl = mountEl.querySelector(`#chart-note-${moduleId}`);
      const tableEl = mountEl.querySelector(`#table-${moduleId}`);
      const tableNoteEl = mountEl.querySelector(`#table-note-${moduleId}`);
      const insightTitleEl = mountEl.querySelector(`#insight-title-${moduleId}`);
      const insightEl = mountEl.querySelector(`#insight-${moduleId}`);

      monthsEl.innerHTML = buildChipsHtml(allMonths, "months", monthLabel);
      countriesEl.innerHTML = buildChipsHtml(COUNTRY_ORDER, "countries", (c) => c);
      chartTypeEl.innerHTML = buildChipsHtml(
        CHART_TYPES.map((x) => x.key),
        "chartType",
        (k) => {
          const hit = CHART_TYPES.find((x) => x.key === k);
          return hit ? hit.label : k;
        }
      );
      windowsEl.innerHTML = buildChipsHtml(WINDOW_ORDER, "windows", (w) => w);
      metricEl.innerHTML = buildChipsHtml(
        METRICS.map((m) => m.key),
        "metric",
        (k) => {
          const hit = METRICS.find((m) => m.key === k);
          return hit ? hit.label : k;
        }
      );

      // Init chart instance
      const chart = echarts.init(chartEl);
      const onResize = () => {
        try {
          chart.resize();
        } catch (_) {}
      };
      if (typeof ResizeObserver !== "undefined") {
        try {
          const ro = new ResizeObserver(onResize);
          ro.observe(chartEl);
        } catch (_) {
          window.addEventListener("resize", onResize);
        }
      } else {
        window.addEventListener("resize", onResize);
      }

      function renderAll() {
        ensureAtLeastOne(state.months, lm);
        ensureAtLeastOne(state.countries, COUNTRY_ORDER[0]);
        ensureAtLeastOne(state.windows, "D0");

        setChipState(filtersEl);

        const monthsSel = monthList();
        const countriesSel = countryList();
        const winsSel = windowList();
        const metricKey = state.metric;

        renderChart(chart, chartEl, chartNoteEl, monthsSel, countriesSel, winsSel, metricKey);
        renderTable(tableEl, tableNoteEl, monthsSel, countriesSel, winsSel, metricKey);
        renderInsights(monthsSel, insightTitleEl, insightEl);
      }

      // Event binding
      filtersEl.addEventListener("change", (e) => {
        const input = e.target;
        if (!input || input.tagName !== "INPUT") return;
        const group = input.getAttribute("data-group");
        const val = input.getAttribute("data-value");
        if (!group || val == null) return;

        // 单选组（用 checkbox 外观实现 radio）
        if (group === "chartType") {
          if (!input.checked) {
            input.checked = true;
            return;
          }
          state.chartType = val;
          filtersEl
            .querySelectorAll(`input[data-group="chartType"]`)
            .forEach((el) => {
              if (el !== input) el.checked = false;
            });
          renderAll();
          return;
        }

        if (group === "metric") {
          if (!input.checked) {
            input.checked = true;
            return;
          }
          state.metric = val;
          filtersEl.querySelectorAll(`input[data-group="metric"]`).forEach((el) => {
            if (el !== input) el.checked = false;
          });
          renderAll();
          return;
        }

        // 多选组
        const set =
          group === "months"
            ? state.months
            : group === "countries"
            ? state.countries
            : group === "windows"
            ? state.windows
            : null;

        if (!set) return;

        if (input.checked) {
          set.add(val);
        } else {
          // 至少保留 1 个
          if (set.size <= 1) {
            input.checked = true;
            return;
          }
          set.delete(val);
        }

        renderAll();
      });

      // initial
      renderAll();
    },
  });
})();
