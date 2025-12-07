(function () {
  const moduleId = "playerMix";

  const COUNTRY_ORDER = ["GH", "KE", "NG", "TZ", "UG"];
  const WINDOW_ORDER = ["D0", "D7"];
  const CHART_TYPES = [
    { key: "bar", label: "月度柱状图" },
    { key: "line", label: "日级折线图" },
  ];

  // 月份配色：同月同色；不同月不同色（稳定映射：按全局月份顺序分配）
  const MONTH_PALETTE = ["#2563eb", "#F6C344", "#7c3aed", "#06b6d4", "#f97316", "#10b981", "#ef4444"];
  const MIX_BOTH_COLOR = "#bbf7d0"; // 双投：浅绿（固定）

  // 折线（堆积）固定色：仅体育黄、仅游戏蓝、双投绿
  const LINE_COLORS = {
    onlySports: "#F6C344",
    onlyGames: "#2563eb",
    both: "#22c55e",
  };

  let styleInjected = false;

  function injectStylesOnce() {
    if (styleInjected) return;
    styleInjected = true;

    const style = document.createElement("style");
    style.setAttribute("data-ovp-module", moduleId);
    style.textContent = `
      .ovp-module-${moduleId} .ovp-filter-panel{
        border: 1px solid rgba(148, 163, 184, .55);
        background: rgba(248, 250, 252, .65);
        border-radius: 14px;
        padding: 12px 12px 10px;
        margin-bottom: 10px;
      }
      .ovp-module-${moduleId} .ovp-filter-row{
        display:flex;
        gap:10px;
        align-items:flex-start;
        flex-wrap:wrap;
        padding: 6px 0;
      }
      .ovp-module-${moduleId} .ovp-filter-label{
        min-width: 84px;
        font-size: 12px;
        font-weight: 600;
        color: var(--muted, #64748b);
        padding-top: 2px;
      }
      .ovp-module-${moduleId} .ovp-filter-options{
        display:flex;
        flex-wrap:wrap;
        gap: 10px 14px;
      }
      .ovp-module-${moduleId} .ovp-opt{
        display:inline-flex;
        align-items:center;
        gap: 6px;
        font-size: 12px;
        color: var(--text, #0f172a);
        user-select:none;
        white-space:nowrap;
      }
      .ovp-module-${moduleId} .ovp-opt input{
        width: 14px;
        height: 14px;
        transform: translateY(1px);
      }
      .ovp-module-${moduleId} .ovp-filter-hint{
        font-size: 11px;
        color: var(--muted, #64748b);
        margin-top: 6px;
        line-height: 1.45;
      }

      .ovp-module-${moduleId} .ovp-table-wrap{
        border: 1px solid rgba(148, 163, 184, .55);
        border-radius: 14px;
        overflow: hidden;
        margin-top: 10px;
        background: rgba(255,255,255,.85);
      }
      .ovp-module-${moduleId} .ovp-table-title{
        display:flex;
        align-items:center;
        justify-content:space-between;
        padding: 10px 12px;
        border-bottom: 1px solid rgba(148, 163, 184, .35);
        background: rgba(248, 250, 252, .85);
        font-size: 12px;
        font-weight: 700;
        color: var(--text, #0f172a);
      }
      .ovp-module-${moduleId} .ovp-table-scroll{
        overflow:auto;
      }
      .ovp-module-${moduleId} table.ovp-table{
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        font-size: 12px;
      }
      .ovp-module-${moduleId} table.ovp-table th,
      .ovp-module-${moduleId} table.ovp-table td{
        padding: 10px 10px;
        border-bottom: 1px solid rgba(148, 163, 184, .25);
        border-right: 1px solid rgba(148, 163, 184, .18);
        vertical-align: top;
        background: rgba(255,255,255,.92);
      }
      .ovp-module-${moduleId} table.ovp-table th:last-child,
      .ovp-module-${moduleId} table.ovp-table td:last-child{
        border-right: none;
      }
      .ovp-module-${moduleId} table.ovp-table thead th{
        position: sticky;
        top: 0;
        z-index: 3;
        background: rgba(255,255,255,.98);
        font-weight: 800;
      }
      .ovp-module-${moduleId} .ovp-sticky-col{
        position: sticky;
        left: 0;
        z-index: 4;
        background: rgba(248, 250, 252, .98);
        font-weight: 800;
      }
      .ovp-module-${moduleId} tbody td.ovp-sticky-col{
        z-index: 2;
        font-weight: 800;
      }
      .ovp-module-${moduleId} .ovp-cell{
        display:flex;
        flex-direction:column;
        gap: 6px;
        min-width: 180px;
      }
      .ovp-module-${moduleId} .ovp-cell-line{
        display:flex;
        justify-content:space-between;
        gap: 8px;
        line-height: 1.25;
      }
      .ovp-module-${moduleId} .ovp-cell-line .k{
        color: var(--muted, #64748b);
        white-space:nowrap;
      }
      .ovp-module-${moduleId} .ovp-cell-line .v{
        color: var(--text, #0f172a);
        font-variant-numeric: tabular-nums;
        white-space:nowrap;
      }
    `;
    document.head.appendChild(style);
  }

  function safeNum(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  function clamp0(n) {
    return n < 0 ? 0 : n;
  }

  function hexToRgb(hex) {
    const h = String(hex || "").replace("#", "").trim();
    if (h.length === 3) {
      const r = parseInt(h[0] + h[0], 16);
      const g = parseInt(h[1] + h[1], 16);
      const b = parseInt(h[2] + h[2], 16);
      return { r, g, b };
    }
    if (h.length === 6) {
      const r = parseInt(h.slice(0, 2), 16);
      const g = parseInt(h.slice(2, 4), 16);
      const b = parseInt(h.slice(4, 6), 16);
      return { r, g, b };
    }
    return { r: 0, g: 0, b: 0 };
  }

  function rgbToHex({ r, g, b }) {
    const toHex = (x) => String(Math.max(0, Math.min(255, Math.round(x))).toString(16)).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  function mixColor(hexA, hexB, t) {
    const a = hexToRgb(hexA);
    const b = hexToRgb(hexB);
    return rgbToHex({
      r: a.r + (b.r - a.r) * t,
      g: a.g + (b.g - a.g) * t,
      b: a.b + (b.b - a.b) * t,
    });
  }

  function lighten(hex, t = 0.55) {
    return mixColor(hex, "#ffffff", t);
  }

  function darken(hex, t = 0.2) {
    return mixColor(hex, "#000000", t);
  }

  function buildMonthLabeler(allMonthsSorted) {
    const years = new Set((allMonthsSorted || []).map((m) => String(m).slice(0, 4)));
    const multiYear = years.size > 1;
    return function fmtMonth(m) {
      const s = String(m);
      if (!/^\d{4}-\d{2}$/.test(s)) return s;
      const yyyy = s.slice(0, 4);
      const mm = s.slice(5, 7);
      return multiYear ? `${yyyy}年${mm}月` : `${mm}月`;
    };
  }

  function buildMonthColorMap(allMonthsSorted) {
    const map = {};
    const ms = Array.isArray(allMonthsSorted) ? allMonthsSorted : [];
    ms.forEach((m, i) => {
      map[String(m)] = MONTH_PALETTE[i % MONTH_PALETTE.length];
    });
    return map;
  }

  function computeAggByCountry(rawByMonth, month, windowKey) {
    const rows = Array.isArray(rawByMonth && rawByMonth[month]) ? rawByMonth[month] : [];
    const totalKey = `${windowKey}_TOTAL_BET_PLACED_USER`;
    const sportsKey = `${windowKey}_SPORTS_BET_PLACED_USER`;
    const gamesKey = `${windowKey}_GAMES_BET_PLACED_USER`;

    const acc = {};
    for (const c of COUNTRY_ORDER) acc[c] = { total: 0, sports: 0, games: 0 };

    for (const r of rows) {
      if (!r || !r.country) continue;
      const c = String(r.country);
      if (!acc[c]) acc[c] = { total: 0, sports: 0, games: 0 };
      acc[c].total += safeNum(r[totalKey]);
      acc[c].sports += safeNum(r[sportsKey]);
      acc[c].games += safeNum(r[gamesKey]);
    }

    const out = {};
    for (const c of Object.keys(acc)) {
      const total = acc[c].total;
      const sports = acc[c].sports;
      const games = acc[c].games;

      // 按你给的口径：both = sports + games - total
      const both = clamp0(sports + games - total);
      const onlyGames = clamp0(games - both);
      const onlySports = clamp0(sports - both);

      out[c] = { total, sports, games, both, onlyGames, onlySports };
    }
    return out;
  }

  function computeDaily(rawByMonth, month, country, windowKey) {
    const rows = Array.isArray(rawByMonth && rawByMonth[month]) ? rawByMonth[month] : [];
    const totalKey = `${windowKey}_TOTAL_BET_PLACED_USER`;
    const sportsKey = `${windowKey}_SPORTS_BET_PLACED_USER`;
    const gamesKey = `${windowKey}_GAMES_BET_PLACED_USER`;

    const daily = rows
      .filter((r) => r && String(r.country) === String(country))
      .slice()
      .sort((a, b) => String(a.date).localeCompare(String(b.date)));

    const dates = [];
    const onlySportsArr = [];
    const onlyGamesArr = [];
    const bothArr = [];

    for (const r of daily) {
      const total = safeNum(r[totalKey]);
      const sports = safeNum(r[sportsKey]);
      const games = safeNum(r[gamesKey]);

      const both = clamp0(sports + games - total);
      const onlyGames = clamp0(games - both);
      const onlySports = clamp0(sports - both);

      dates.push(String(r.date || ""));
      onlySportsArr.push(onlySports);
      onlyGamesArr.push(onlyGames);
      bothArr.push(both);
    }

    return { dates, onlySportsArr, onlyGamesArr, bothArr };
  }

  function enforceConstraints(state, latestMonth) {
    // 至少选 1 个
    if (!state.months.length && latestMonth) state.months = [latestMonth];
    if (!state.countries.length) state.countries = COUNTRY_ORDER.slice();
    if (!state.windows.length) state.windows = ["D0"];

    // 折线图：月份/国家/D0D7 单选
    if (state.chartType === "line") {
      if (state.months.length > 1) {
        const sorted = OVP.utils.sortMonths(state.months);
        state.months = [sorted[sorted.length - 1]];
      }
      if (state.countries.length > 1) {
        const keep = COUNTRY_ORDER.find((c) => state.countries.includes(c)) || state.countries[0];
        state.countries = [keep];
      }
      if (state.windows.length > 1) {
        const keep = state.windows.includes("D7") ? "D7" : "D0";
        state.windows = [keep];
      }
    }
  }

  function renderFilters({ panelEl, state, allMonths, fmtMonth }) {
    const monthsHtml = (allMonths || [])
      .map((m) => {
        const checked = state.months.includes(m) ? "checked" : "";
        return `<label class="ovp-opt"><input type="checkbox" data-group="months" value="${m}" ${checked}/> ${fmtMonth(m)}</label>`;
      })
      .join("");

    const countriesHtml = COUNTRY_ORDER.map((c) => {
      const checked = state.countries.includes(c) ? "checked" : "";
      return `<label class="ovp-opt"><input type="checkbox" data-group="countries" value="${c}" ${checked}/> ${c}</label>`;
    }).join("");

    const windowsHtml = WINDOW_ORDER.map((w) => {
      const checked = state.windows.includes(w) ? "checked" : "";
      return `<label class="ovp-opt"><input type="checkbox" data-group="windows" value="${w}" ${checked}/> ${w}</label>`;
    }).join("");

    const chartTypeHtml = CHART_TYPES.map((t) => {
      const checked = state.chartType === t.key ? "checked" : "";
      return `<label class="ovp-opt"><input type="radio" name="${moduleId}-chartType" data-group="chartType" value="${t.key}" ${checked}/> ${t.label}</label>`;
    }).join("");

    const hint =
      state.chartType === "line"
        ? `折线图视图：月份 / 国家 / D口径均为单选；图为日级堆积（仅体育黄、仅游戏蓝、双投绿）。`
        : `柱状图视图：同月同色；D7 用斜线阴影；堆叠为仅游戏（浅色）/ 双投（浅绿）/ 仅体育（深色）。`;

    panelEl.innerHTML = `
      <div class="ovp-filter-row">
        <div class="ovp-filter-label">图表类型</div>
        <div class="ovp-filter-options">${chartTypeHtml}</div>
      </div>

      <div class="ovp-filter-row">
        <div class="ovp-filter-label">月份</div>
        <div class="ovp-filter-options">${monthsHtml}</div>
      </div>

      <div class="ovp-filter-row">
        <div class="ovp-filter-label">国家</div>
        <div class="ovp-filter-options">${countriesHtml}</div>
      </div>

      <div class="ovp-filter-row">
        <div class="ovp-filter-label">D口径</div>
        <div class="ovp-filter-options">${windowsHtml}</div>
      </div>

      <div class="ovp-filter-hint">${hint}</div>
    `;
  }

  function syncFiltersChecked(panelEl, state) {
    const inputs = panelEl.querySelectorAll("input[data-group], input[name]");
    inputs.forEach((inp) => {
      const group = inp.getAttribute("data-group");
      const val = inp.value;
      if (group === "months") inp.checked = state.months.includes(val);
      if (group === "countries") inp.checked = state.countries.includes(val);
      if (group === "windows") inp.checked = state.windows.includes(val);
      if (group === "chartType") inp.checked = state.chartType === val;
    });
  }

  function buildCombos(state, utils) {
    const monthsSorted = utils.sortMonths(state.months);
    const windowsSorted = WINDOW_ORDER.filter((w) => state.windows.includes(w));
    const combos = [];
    for (const m of monthsSorted) {
      for (const w of windowsSorted) {
        combos.push({ month: m, window: w });
      }
    }
    return combos;
  }

  function ensureChart(chartEl, chartRef) {
    if (!window.echarts) return null;
    if (!chartRef.current) {
      chartEl.innerHTML = "";
      chartEl.classList.remove("is-empty");
      chartRef.current = echarts.init(chartEl);
    }
    return chartRef.current;
  }

  function renderBarChart({ chart, countries, combos, aggCache, monthColorMap, fmtMonth, utils }) {
    const stackMeta = {};
    const stackOrder = {};

    combos.forEach((c, idx) => {
      const stack = `pm_${c.month}_${c.window}`;
      stackMeta[stack] = `${fmtMonth(c.month)} ${c.window}`;
      stackOrder[stack] = idx;
    });

    const decalD7 = {
      symbol: "rect",
      symbolSize: 2,
      rotation: Math.PI / 4,
      dashArrayX: [1, 0],
      dashArrayY: [6, 3],
      color: "rgba(15, 23, 42, 0.28)",
    };

    const series = [];
    for (const combo of combos) {
      const stack = `pm_${combo.month}_${combo.window}`;
      const base = monthColorMap[String(combo.month)] || MONTH_PALETTE[0];

      const cOnlyGames = lighten(base, 0.62);
      const cOnlySports = darken(base, 0.22);
      const needsDecal = combo.window === "D7";

      const agg = aggCache[combo.month] && aggCache[combo.month][combo.window] ? aggCache[combo.month][combo.window] : {};

      const onlyGamesData = countries.map((ct) => safeNum(agg[ct]?.onlyGames));
      const bothData = countries.map((ct) => safeNum(agg[ct]?.both));
      const onlySportsData = countries.map((ct) => safeNum(agg[ct]?.onlySports));

      series.push({
        id: `${stack}::onlyGames`,
        name: "仅游戏",
        type: "bar",
        stack,
        barMaxWidth: 18,
        itemStyle: { color: cOnlyGames, decal: needsDecal ? decalD7 : undefined },
        emphasis: { focus: "series" },
        data: onlyGamesData,
      });

      series.push({
        id: `${stack}::both`,
        name: "双投",
        type: "bar",
        stack,
        barMaxWidth: 18,
        itemStyle: { color: MIX_BOTH_COLOR, decal: needsDecal ? decalD7 : undefined },
        emphasis: { focus: "series" },
        data: bothData,
      });

      series.push({
        id: `${stack}::onlySports`,
        name: "仅体育",
        type: "bar",
        stack,
        barMaxWidth: 18,
        itemStyle: { color: cOnlySports, decal: needsDecal ? decalD7 : undefined },
        emphasis: { focus: "series" },
        data: onlySportsData,
      });
    }

    const tooltipFormatter = (params) => {
      if (!params || !params.length) return "";
      const country = params[0].axisValue;

      const group = {};
      for (const p of params) {
        const sid = String(p.seriesId || "");
        const stack = sid.split("::")[0];
        if (!group[stack]) group[stack] = { label: stackMeta[stack] || stack, v: {} };
        group[stack].v[p.seriesName] = Number(p.value || 0);
      }

      const stacks = Object.keys(group).sort((a, b) => (stackOrder[a] ?? 0) - (stackOrder[b] ?? 0));

      let html = `<div style="font-weight:800;margin-bottom:6px;">${country}</div>`;
      for (const st of stacks) {
        const g = group[st];
        const og = Number(g.v["仅游戏"] || 0);
        const bt = Number(g.v["双投"] || 0);
        const os = Number(g.v["仅体育"] || 0);
        const total = og + bt + os;

        const fmtInt = (n) => (utils ? utils.fmtInt(n) : String(Math.round(n)));
        const fmtPct = (n) => (total ? `${((n / total) * 100).toFixed(1)}%` : "—");

        html += `<div style="margin-top:8px;"><span style="font-weight:800;">${g.label}</span> <span style="color:#64748b;">(总计 ${fmtInt(total)})</span></div>`;
        html += `<div style="display:flex;gap:10px;flex-wrap:wrap;color:#0f172a;">
          <span>仅游戏：${fmtInt(og)} (${fmtPct(og)})</span>
          <span>双投：${fmtInt(bt)} (${fmtPct(bt)})</span>
          <span>仅体育：${fmtInt(os)} (${fmtPct(os)})</span>
        </div>`;
      }

      return html;
    };

    const option = {
      grid: { left: 56, right: 20, top: 48, bottom: 54, containLabel: true },
      legend: {
        top: 8,
        textStyle: { fontSize: 12, color: "#334155" },
        data: ["仅游戏", "双投", "仅体育"],
      },
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" }, formatter: tooltipFormatter },
      xAxis: {
        type: "category",
        data: countries,
        axisTick: { alignWithLabel: true },
        axisLabel: { color: "#334155", fontSize: 12 },
      },
      yAxis: {
        type: "value",
        name: "总投注人数（人）",
        nameTextStyle: { color: "#64748b", fontSize: 12 },
        axisLabel: { color: "#334155", fontSize: 12 },
        splitLine: { lineStyle: { color: "rgba(148,163,184,.25)" } },
      },
      series,
    };

    chart.setOption(option, { notMerge: true, lazyUpdate: true });
  }

  function renderLineChart({ chart, rawByMonth, month, country, windowKey }) {
    const { dates, onlySportsArr, onlyGamesArr, bothArr } = computeDaily(rawByMonth, month, country, windowKey);
    const x = dates.map((d) => (String(d).length >= 10 ? String(d).slice(5, 10) : String(d)));

    const option = {
      grid: { left: 56, right: 20, top: 48, bottom: 48, containLabel: true },
      legend: {
        top: 8,
        textStyle: { fontSize: 12, color: "#334155" },
        data: ["仅体育", "仅游戏", "双投"],
      },
      tooltip: {
        trigger: "axis",
        formatter: (params) => {
          if (!params || !params.length) return "";
          const idx = params[0].dataIndex;
          const dateFull = dates[idx] || "";
          const map = {};
          params.forEach((p) => (map[p.seriesName] = Number(p.value || 0)));
          const total = (map["仅体育"] || 0) + (map["仅游戏"] || 0) + (map["双投"] || 0);
          return `
            <div style="font-weight:800;margin-bottom:6px;">${dateFull}</div>
            <div style="color:#0f172a;display:flex;gap:10px;flex-wrap:wrap;">
              <span>仅体育：${map["仅体育"] ?? 0}</span>
              <span>仅游戏：${map["仅游戏"] ?? 0}</span>
              <span>双投：${map["双投"] ?? 0}</span>
              <span style="color:#64748b;">总计：${total}</span>
            </div>
          `;
        },
      },
      xAxis: {
        type: "category",
        data: x,
        boundaryGap: false,
        axisLabel: { color: "#334155", fontSize: 12 },
      },
      yAxis: {
        type: "value",
        name: "投注人数（人）",
        nameTextStyle: { color: "#64748b", fontSize: 12 },
        axisLabel: { color: "#334155", fontSize: 12 },
        splitLine: { lineStyle: { color: "rgba(148,163,184,.25)" } },
      },
      series: [
        {
          name: "仅体育",
          type: "line",
          stack: "total",
          symbol: "none",
          areaStyle: {},
          itemStyle: { color: LINE_COLORS.onlySports },
          lineStyle: { width: 2 },
          data: onlySportsArr,
        },
        {
          name: "仅游戏",
          type: "line",
          stack: "total",
          symbol: "none",
          areaStyle: {},
          itemStyle: { color: LINE_COLORS.onlyGames },
          lineStyle: { width: 2 },
          data: onlyGamesArr,
        },
        {
          name: "双投",
          type: "line",
          stack: "total",
          symbol: "none",
          areaStyle: {},
          itemStyle: { color: LINE_COLORS.both },
          lineStyle: { width: 2 },
          data: bothArr,
        },
      ],
    };

    chart.setOption(option, { notMerge: true, lazyUpdate: true });
  }

  function renderTable({ tableEl, countries, combos, aggCache, fmtMonth, utils }) {
    const ths = combos
      .map((c) => `<th>${fmtMonth(c.month)} ${c.window}</th>`)
      .join("");

    const fmtInt = (n) => (utils ? utils.fmtInt(n) : String(Math.round(n)));
    const fmtPct = (v, total) => (total > 0 ? (utils ? utils.fmtPct(v / total, 1) : `${((v / total) * 100).toFixed(1)}%`) : "—");

    const rows = countries
      .map((ct) => {
        const tds = combos
          .map((combo) => {
            const agg = aggCache[combo.month] && aggCache[combo.month][combo.window] ? aggCache[combo.month][combo.window][ct] : null;
            if (!agg) {
              return `<td><div class="ovp-cell"><div class="ovp-cell-line"><span class="k">—</span><span class="v">—</span></div></div></td>`;
            }

            const total = safeNum(agg.total);
            const onlyGames = safeNum(agg.onlyGames);
            const both = safeNum(agg.both);
            const onlySports = safeNum(agg.onlySports);

            return `
              <td>
                <div class="ovp-cell">
                  <div class="ovp-cell-line"><span class="k">仅游戏</span><span class="v">${fmtInt(onlyGames)} (${fmtPct(onlyGames, total)})</span></div>
                  <div class="ovp-cell-line"><span class="k">双投</span><span class="v">${fmtInt(both)} (${fmtPct(both, total)})</span></div>
                  <div class="ovp-cell-line"><span class="k">仅体育</span><span class="v">${fmtInt(onlySports)} (${fmtPct(onlySports, total)})</span></div>
                  <div class="ovp-cell-line"><span class="k">总计</span><span class="v">${fmtInt(total)}</span></div>
                </div>
              </td>
            `;
          })
          .join("");

        return `<tr><td class="ovp-sticky-col">${ct}</td>${tds}</tr>`;
      })
      .join("");

    tableEl.innerHTML = `
      <thead>
        <tr>
          <th class="ovp-sticky-col">国家</th>
          ${ths}
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    `;
  }

  OVP.registerModule({
    id: moduleId,
    title: "D0/D7 体育 vs 游戏玩家比例",
    subtitle: "柱状：各国月度总投注人数（人）按 仅游戏/双投/仅体育 堆叠；折线：单国家单月份日级堆积（人）。",
    span: "full",

    render({ mountEl, rawByMonth, months, latestMonth, utils }) {
      injectStylesOnce();

      const { chartEl, chartNoteEl, insightEl } = OVP.ui.mountModule(mountEl, { moduleId, chartHeight: 360 });
      const stackEl = mountEl.querySelector(".ovp-module-stack");
      if (stackEl) stackEl.classList.add(`ovp-module-${moduleId}`);

      // 结构：筛选器（上）- 图 - 表 - 文案
      const filterPanel = document.createElement("div");
      filterPanel.className = "ovp-filter-panel";

      const tableWrap = document.createElement("div");
      tableWrap.className = "ovp-table-wrap";
      tableWrap.innerHTML = `
        <div class="ovp-table-title">明细表</div>
        <div class="ovp-table-scroll">
          <table class="ovp-table" id="table-${moduleId}"></table>
        </div>
      `;
      const tableEl = tableWrap.querySelector(`#table-${moduleId}`);

      // 插入位置：filterPanel 放最顶；tableWrap 放 insight 之前
      if (stackEl) {
        stackEl.insertBefore(filterPanel, stackEl.firstChild);
        stackEl.insertBefore(tableWrap, insightEl);
      }

      // 初始状态
      const allMonthsSorted = utils.sortMonths(Array.isArray(months) ? months : Object.keys(rawByMonth || {}));
      const fmtMonth = buildMonthLabeler(allMonthsSorted);
      const monthColorMap = buildMonthColorMap(allMonthsSorted);

      const state = {
        chartType: "bar",
        months: latestMonth ? [latestMonth] : (allMonthsSorted.length ? [allMonthsSorted[allMonthsSorted.length - 1]] : []),
        countries: COUNTRY_ORDER.slice(),
        windows: ["D0", "D7"],
      };

      // 图表实例
      const chartRef = { current: null };
      const chart = ensureChart(chartEl, chartRef);

      function recomputeAndRender() {
        enforceConstraints(state, latestMonth);

        // 重绘筛选器（保证“折线图单选”提示及时刷新）
        renderFilters({ panelEl: filterPanel, state, allMonths: allMonthsSorted, fmtMonth });
        syncFiltersChecked(filterPanel, state);

        const selectedCountries = COUNTRY_ORDER.filter((c) => state.countries.includes(c));
        const combos = buildCombos(state, utils);

        // 聚合缓存：aggCache[month][window] = { country: {...} }
        const aggCache = {};
        for (const combo of combos) {
          if (!aggCache[combo.month]) aggCache[combo.month] = {};
          aggCache[combo.month][combo.window] = computeAggByCountry(rawByMonth, combo.month, combo.window);
        }

        // Chart note
        if (chartNoteEl) {
          chartNoteEl.textContent =
            state.chartType === "line"
              ? `折线图（日级堆积）：仅体育=黄，仅游戏=蓝，双投=绿；该视图下月份/国家/D口径均为单选。`
              : `柱状图（月度）：同月同色；D7 为斜线阴影；堆叠为仅游戏（浅色）/ 双投（浅绿）/ 仅体育（深色）。`;
        }

        // 图表渲染
        if (!chart) {
          if (chartNoteEl) chartNoteEl.textContent = "ECharts 未加载，图表无法渲染（请检查网络/脚本引用）。";
        } else {
          if (state.chartType === "bar") {
            renderBarChart({
              chart,
              countries: selectedCountries,
              combos,
              aggCache,
              monthColorMap,
              fmtMonth,
              utils,
            });
          } else {
            const month = state.months[0];
            const country = state.countries[0];
            const windowKey = state.windows[0];
            renderLineChart({ chart, rawByMonth, month, country, windowKey });
          }
        }

        // 表格渲染
        renderTable({
          tableEl,
          countries: selectedCountries,
          combos,
          aggCache,
          fmtMonth,
          utils,
        });

        // 文案：多月时取最新月份
        const insightMonth = (() => {
          const ms = utils.sortMonths(state.months);
          return ms.length ? ms[ms.length - 1] : latestMonth;
        })();
        OVP.ui.renderInsight({ moduleId, month: insightMonth, el: insightEl });
      }

      // 监听筛选器变化
      function onFilterChange(e) {
        const t = e.target;
        if (!t || !t.getAttribute) return;

        const group = t.getAttribute("data-group");
        const val = t.value;

        if (group === "chartType") {
          state.chartType = val;
          // 切到折线图时：强制单选（enforceConstraints 会处理）
          recomputeAndRender();
          return;
        }

        if (group === "months") {
          const next = new Set(state.months);
          if (t.checked) next.add(val);
          else next.delete(val);
          state.months = Array.from(next);
          recomputeAndRender();
          return;
        }

        if (group === "countries") {
          const next = new Set(state.countries);
          if (t.checked) next.add(val);
          else next.delete(val);
          state.countries = Array.from(next);
          recomputeAndRender();
          return;
        }

        if (group === "windows") {
          const next = new Set(state.windows);
          if (t.checked) next.add(val);
          else next.delete(val);
          state.windows = Array.from(next);
          recomputeAndRender();
          return;
        }
      }

      filterPanel.addEventListener("change", onFilterChange);

      // Resize
      const onResize = () => {
        if (chartRef.current) chartRef.current.resize();
      };
      window.addEventListener("resize", onResize);

      // 首次渲染
      recomputeAndRender();
    },
  });
})();
