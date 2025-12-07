/* module-player-mix.js
 * 模块5：D0/D7 体育 vs 游戏玩家比例
 * - 柱状图：国家维度（GH/KE/NG/TZ/UG 固定顺序），每个“月份×D0/D7”为一根柱；柱内堆叠：仅游戏/双投/仅体育
 * - 折线图：日级堆积面积图（仅支持单选：月份/国家/D0D7），颜色规则：仅体育(黄)底部、仅游戏(蓝)中部、双投(绿)顶部
 * - 表格：国家×(月份×D0D7)；单元格纵向列出：仅游戏/双投/仅体育/总计（人数+占比）
 * - 文案：insights.js -> INSIGHTS_ORGANIC_MONTHLY[month].playerMix
 */
(function () {
  const moduleId = "playerMix";

  const COUNTRIES_ORDER = ["GH", "KE", "NG", "TZ", "UG"];
  const WINDOWS_ORDER = ["D0", "D7"];

  // 颜色（按需求固定：仅游戏蓝、仅体育黄、双投浅绿）
  const COLORS = {
    gameOnly: "#3b82f6",
    sportsOnly: "#f59e0b",
    both: "#34d399",
  };

  // D7 斜线阴影（ECharts decal）
  const D7_DECAL = {
    symbol: "rect",
    symbolSize: 1,
    dashArrayX: [6, 3],
    dashArrayY: [2, 2],
    rotation: Math.PI / 4,
    color: "rgba(255,255,255,0.45)",
    backgroundColor: "rgba(0,0,0,0)",
  };

  function ensureStyles() {
    const id = "pmx-style-v1";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      .pmx-filters{
        border:1px solid rgba(148, 163, 184, 0.60);
        border-radius:12px;
        background: rgba(249, 250, 251, 0.90);
        padding:12px 12px 10px;
      }
      .pmx-row{ display:flex; flex-wrap:wrap; gap:12px 18px; align-items:flex-start; }
      .pmx-group{ display:flex; flex-direction:column; gap:6px; min-width: 180px; }
      .pmx-label{ font-size:11px; color: var(--muted); line-height:1.2; }
      .pmx-opts{ display:flex; flex-wrap:wrap; gap:8px 12px; }
      .pmx-opt{
        display:inline-flex; align-items:center; gap:6px;
        font-size:12px; color: var(--text);
        padding:3px 8px; border-radius:10px;
        user-select:none;
      }
      .pmx-opt input{ transform: translateY(0.5px); }
      .pmx-opt.is-checked{ background: rgba(15, 23, 42, 0.06); }
      .pmx-hint{
        margin-top:8px;
        font-size:11px;
        color: var(--muted);
        line-height:1.45;
      }

      .pmx-table-scroll{
        overflow:auto;
        border:1px solid rgba(148, 163, 184, 0.60);
        border-radius:12px;
        background:#fff;
      }
      table.pmx-table{
        width:100%;
        border-collapse:separate;
        border-spacing:0;
        min-width: 860px;
      }
      .pmx-table thead th{
        position:sticky; top:0;
        background: rgba(249, 250, 251, 0.95);
        z-index:2;
        font-size:11px;
        color: var(--text);
        font-weight:600;
        text-align:center;
        padding:10px 10px;
        border-bottom:1px solid rgba(148, 163, 184, 0.45);
        border-right:1px solid rgba(148, 163, 184, 0.35);
        white-space:nowrap;
      }
      .pmx-table thead th:first-child{ text-align:left; }
      .pmx-table tbody th{
        position:sticky; left:0;
        z-index:1;
        background: rgba(249, 250, 251, 0.80);
        font-size:12px;
        font-weight:600;
        color: var(--text);
        text-align:left;
        padding:10px 10px;
        border-bottom:1px solid rgba(148, 163, 184, 0.35);
        border-right:1px solid rgba(148, 163, 184, 0.35);
        white-space:nowrap;
      }
      .pmx-table td{
        font-size:11px;
        color: var(--text);
        text-align:center;
        vertical-align:middle;
        padding:10px 10px;
        border-bottom:1px solid rgba(148, 163, 184, 0.28);
        border-right:1px solid rgba(148, 163, 184, 0.22);
      }
      .pmx-table th:last-child, .pmx-table td:last-child{ border-right:none; }
      .pmx-cell{
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        gap:2px;
        min-height: 94px;
      }
      .pmx-cell .pmx-total{
        margin-top:4px;
        padding-top:4px;
        border-top:1px dashed rgba(148, 163, 184, 0.45);
        width:100%;
        font-weight:600;
      }
      .pmx-empty{
        padding:10px 0;
        font-size:11px;
        color: var(--muted);
      }
      @media (max-width: 920px){
        table.pmx-table{ min-width: 760px; }
        .pmx-group{ min-width: 160px; }
      }
    `;
    document.head.appendChild(style);
  }

  function safeNum(utils, v) {
    const n = utils && typeof utils.safeNumber === "function" ? utils.safeNumber(v) : Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  function uniq(arr) {
    const out = [];
    const seen = new Set();
    for (const x of Array.isArray(arr) ? arr : []) {
      if (seen.has(x)) continue;
      seen.add(x);
      out.push(x);
    }
    return out;
  }

  function sortByOrder(values, orderArr) {
    const set = new Set(values);
    return orderArr.filter((x) => set.has(x));
  }

  function fmtPct(p, digits = 1) {
    if (!Number.isFinite(p)) return "—";
    return `${(p * 100).toFixed(digits)}%`;
  }

  function computeSegmentsFromTotals(total, sports, games) {
    // 交集（双投）= sports + games - total
    const bothRaw = (sports || 0) + (games || 0) - (total || 0);
    const both = Math.max(0, bothRaw);

    const gameOnly = Math.max(0, (games || 0) - both);
    const sportsOnly = Math.max(0, (sports || 0) - both);

    // 用拆分后的总计，保证非负 & 自洽
    const totalUsed = Math.max(0, gameOnly + both + sportsOnly);

    return { gameOnly, both, sportsOnly, total: totalUsed };
  }

  function monthLabel(monthKey) {
    // monthKey: YYYY-MM
    return String(monthKey || "");
  }

  OVP.registerModule({
    id: moduleId,
    title: "D0/D7 体育 vs 游戏玩家比例",
    subtitle:
      "口径：TOTAL/SPORTS/GAMES_BET_PLACED_USER 拆分为 仅游戏/双投/仅体育；单位：人（占比以总投注人数为分母）",
    span: "full",

    render({ mountEl, rawByMonth, months, latestMonth, utils }) {
      ensureStyles();

      const { chartEl, chartNoteEl, insightEl } = OVP.ui.mountModule(mountEl, {
        moduleId,
        chartHeight: 380,
      });

      const stack = mountEl.querySelector(".ovp-module-stack");
      const chartWrap = stack ? stack.firstElementChild : null;

      // filters container
      const filtersEl = document.createElement("div");
      filtersEl.className = "pmx-filters";
      filtersEl.innerHTML = `
        <div class="pmx-row">
          <div class="pmx-group">
            <div class="pmx-label">图表</div>
            <div class="pmx-opts" data-group="chartType"></div>
          </div>
          <div class="pmx-group">
            <div class="pmx-label">月份（多选）</div>
            <div class="pmx-opts" data-group="month"></div>
          </div>
          <div class="pmx-group">
            <div class="pmx-label">国家（多选）</div>
            <div class="pmx-opts" data-group="country"></div>
          </div>
          <div class="pmx-group">
            <div class="pmx-label">D0 / D7（多选）</div>
            <div class="pmx-opts" data-group="window"></div>
          </div>
        </div>
        <div class="pmx-hint" id="pmx-hint-${moduleId}"></div>
      `;

      // table container
      const tableWrap = document.createElement("div");
      tableWrap.id = `table-${moduleId}`;

      if (stack && chartWrap) {
        stack.insertBefore(filtersEl, chartWrap);
        stack.insertBefore(tableWrap, insightEl);
      }

      // default state
      const allMonths = Array.isArray(months) ? months.slice() : [];
      const defaultMonth = latestMonth || (allMonths.length ? allMonths[allMonths.length - 1] : null);

      const state = {
        chartType: "bar", // bar | line
        months: defaultMonth ? [defaultMonth] : [],
        countries: COUNTRIES_ORDER.slice(),
        windows: WINDOWS_ORDER.slice(), // D0,D7
      };

      const ui = {
        chartType: new Map(),
        month: new Map(),
        country: new Map(),
        window: new Map(),
        hintEl: filtersEl.querySelector(`#pmx-hint-${moduleId}`),
      };

      function makeOpt(group, value, label) {
        const wrap = filtersEl.querySelector(`.pmx-opts[data-group="${group}"]`);
        const lab = document.createElement("label");
        lab.className = "pmx-opt";
        const input = document.createElement("input");
        input.type = "checkbox";
        input.value = String(value);
        lab.appendChild(input);
        const span = document.createElement("span");
        span.textContent = label;
        lab.appendChild(span);
        wrap.appendChild(lab);

        ui[group].set(String(value), { input, lab });
        input.addEventListener("change", () => onToggle(group, String(value), input.checked));
      }

      function setLabelActive(group) {
        const selected = new Set(state[group]);
        for (const [val, { lab, input }] of ui[group].entries()) {
          const on = selected.has(val) && input.checked;
          lab.classList.toggle("is-checked", !!on);
        }
      }

      function syncUI() {
        // chartType
        for (const [val, o] of ui.chartType.entries()) o.input.checked = state.chartType === val;
        // month/country/window
        for (const group of ["month", "country", "window"]) {
          const selected = new Set(state[group]);
          for (const [val, o] of ui[group].entries()) {
            o.input.checked = selected.has(val);
          }
          setLabelActive(group);
        }
        setLabelActive("chartType");

        // hints
        if (ui.hintEl) {
          ui.hintEl.textContent =
            state.chartType === "line"
              ? "折线图模式：月份/国家/D0D7 仅支持单选；图为日级堆积（仅体育=黄、仅游戏=蓝、双投=绿）。"
              : "柱状图模式：按月汇总；柱内堆叠（仅游戏=蓝、双投=绿、仅体育=黄），D7 柱带斜线阴影。";
        }
      }

      function pickOne(currentArr, preferredOrder, fallback) {
        const set = new Set(currentArr);
        for (let i = preferredOrder.length - 1; i >= 0; i--) {
          const v = preferredOrder[i];
          if (set.has(v)) return v;
        }
        return currentArr[0] || fallback || preferredOrder[0] || null;
      }

      function coerceForLineMode() {
        const m = pickOne(state.months, allMonths, defaultMonth);
        const c = pickOne(state.countries, COUNTRIES_ORDER, COUNTRIES_ORDER[0]);
        const w = pickOne(state.windows, WINDOWS_ORDER, "D7");
        state.months = m ? [m] : [];
        state.countries = c ? [c] : [];
        state.windows = w ? [w] : [];
      }

      function ensureNonEmptyMulti(group, fallbackList) {
        if (state[group].length) return;
        const fb = Array.isArray(fallbackList) && fallbackList.length ? fallbackList[0] : null;
        if (fb) state[group] = [fb];
      }

      function onToggle(group, value, checked) {
        if (group === "chartType") {
          if (!checked) {
            // 不允许全关
            syncUI();
            return;
          }
          state.chartType = value === "line" ? "line" : "bar";
          if (state.chartType === "line") coerceForLineMode();
          syncUI();
          renderAll();
          return;
        }

        const singleMode = state.chartType === "line";

        if (singleMode) {
          if (!checked) {
            // 单选不允许取消到 0
            syncUI();
            return;
          }
          state[group] = [value];
        } else {
          const set = new Set(state[group]);
          if (checked) set.add(value);
          else set.delete(value);
          state[group] = uniq([...set]);

          // 多选也不允许全空
          if (group === "month") ensureNonEmptyMulti(group, defaultMonth ? [defaultMonth] : allMonths);
          if (group === "country") ensureNonEmptyMulti(group, COUNTRIES_ORDER);
          if (group === "window") ensureNonEmptyMulti(group, ["D0"]);
        }

        syncUI();
        renderAll();
      }

      // Build filter options
      makeOpt("chartType", "bar", "月度柱状图");
      makeOpt("chartType", "line", "日级折线图");

      for (const m of allMonths.length ? allMonths : state.months) makeOpt("month", m, monthLabel(m));
      for (const c of COUNTRIES_ORDER) makeOpt("country", c, c);
      makeOpt("window", "D0", "D0");
      makeOpt("window", "D7", "D7");

      // Chart instance
      let chart = null;
      const resizeHandler = () => {
        if (chart) chart.resize();
      };
      window.addEventListener("resize", resizeHandler);

      function ensureChart() {
        if (!chartEl) return null;
        if (!window.echarts) return null;

        if (!chart) {
          chartEl.classList.remove("is-empty");
          chartEl.innerHTML = "";
          chart = window.echarts.init(chartEl);
        }
        return chart;
      }

      // Monthly cache: month -> { country -> { D0:{total,sports,games}, D7:{...} } }
      const monthCache = new Map();

      function getMonthAgg(monthKey) {
        const key = String(monthKey || "");
        if (monthCache.has(key)) return monthCache.get(key);

        const rows = Array.isArray(rawByMonth && rawByMonth[key]) ? rawByMonth[key] : [];
        const agg = {};
        for (const c of COUNTRIES_ORDER) {
          agg[c] = {
            D0: { total: 0, sports: 0, games: 0 },
            D7: { total: 0, sports: 0, games: 0 },
          };
        }

        for (const r of rows) {
          const c = r && r.country;
          if (!agg[c]) continue;

          for (const w of WINDOWS_ORDER) {
            const totalF = `${w}_TOTAL_BET_PLACED_USER`;
            const sportsF = `${w}_SPORTS_BET_PLACED_USER`;
            const gamesF = `${w}_GAMES_BET_PLACED_USER`;
            agg[c][w].total += safeNum(utils, r[totalF]);
            agg[c][w].sports += safeNum(utils, r[sportsF]);
            agg[c][w].games += safeNum(utils, r[gamesF]);
          }
        }

        monthCache.set(key, agg);
        return agg;
      }

      function buildBarOption(selectedMonths, selectedCountries, selectedWindows) {
        const monthsSorted = (utils && utils.sortMonths ? utils.sortMonths(selectedMonths) : selectedMonths.slice()).slice();
        const countriesSorted = sortByOrder(selectedCountries, COUNTRIES_ORDER);
        const windowsSorted = sortByOrder(selectedWindows, WINDOWS_ORDER);

        const groups = [];
        for (const m of monthsSorted) {
          for (const w of WINDOWS_ORDER) {
            if (windowsSorted.includes(w)) groups.push({ month: m, window: w, stack: `${m} ${w}` });
          }
        }

        const series = [];
        for (const g of groups) {
          const monthAgg = getMonthAgg(g.month);

          // 堆叠顺序：底部仅游戏 -> 中部双投 -> 顶部仅体育
          const segDefs = [
            { name: "仅游戏", key: "gameOnly", color: COLORS.gameOnly },
            { name: "双投", key: "both", color: COLORS.both },
            { name: "仅体育", key: "sportsOnly", color: COLORS.sportsOnly },
          ];

          for (const seg of segDefs) {
            series.push({
              name: seg.name,
              type: "bar",
              stack: g.stack,
              barMaxWidth: 18,
              emphasis: { focus: "series" },
              itemStyle: {
                color: seg.color,
                decal: g.window === "D7" ? D7_DECAL : null,
              },
              data: countriesSorted.map((c) => {
                const t = monthAgg && monthAgg[c] && monthAgg[c][g.window] ? monthAgg[c][g.window].total : 0;
                const s = monthAgg && monthAgg[c] && monthAgg[c][g.window] ? monthAgg[c][g.window].sports : 0;
                const ga = monthAgg && monthAgg[c] && monthAgg[c][g.window] ? monthAgg[c][g.window].games : 0;
                const mix = computeSegmentsFromTotals(t, s, ga);
                return Math.round(mix[seg.key] || 0);
              }),
            });
          }
        }

        const chartInstance = chart; // used in tooltip formatter closure
        const segOrder = { "仅游戏": 1, "双投": 2, "仅体育": 3 };
        const groupOrder = new Map(groups.map((g, idx) => [g.stack, idx]));

        return {
          tooltip: {
            trigger: "axis",
            axisPointer: { type: "shadow" },
            confine: true,
            formatter(params) {
              const ps = Array.isArray(params) ? params : [params];
              const opt = chartInstance && chartInstance.getOption ? chartInstance.getOption() : null;
              const sers = opt && opt.series ? opt.series : [];

              const byGroup = new Map();
              for (const p of ps) {
                const s = sers[p.seriesIndex] || {};
                const g = s.stack || "—";
                if (!byGroup.has(g)) byGroup.set(g, []);
                byGroup.get(g).push({ seg: p.seriesName, val: Number(p.value) || 0 });
              }

              const countryName = ps[0] && ps[0].axisValue ? ps[0].axisValue : "";

              const groupsSorted = [...byGroup.entries()].sort((a, b) => {
                const ia = groupOrder.has(a[0]) ? groupOrder.get(a[0]) : 9999;
                const ib = groupOrder.has(b[0]) ? groupOrder.get(b[0]) : 9999;
                return ia - ib;
              });

              let html = `<div style="font-weight:600;margin-bottom:6px;">${countryName}</div>`;
              for (const [gk, items] of groupsSorted) {
                const itemsSorted = items.slice().sort((a, b) => (segOrder[a.seg] || 9) - (segOrder[b.seg] || 9));
                const total = itemsSorted.reduce((sum, it) => sum + (Number(it.val) || 0), 0) || 0;

                html += `<div style="margin:6px 0 2px;font-weight:600;">${gk}</div>`;
                for (const it of itemsSorted) {
                  const pct = total ? it.val / total : NaN;
                  html += `<div style="display:flex;justify-content:space-between;gap:12px;">
                    <span>${it.seg}</span>
                    <span>${(Number(it.val) || 0).toLocaleString("en-US")}${total ? ` (${fmtPct(pct, 1)})` : ""}</span>
                  </div>`;
                }
                html += `<div style="display:flex;justify-content:space-between;gap:12px;margin-top:2px;">
                  <span style="color:rgba(15,23,42,0.7);">总计</span>
                  <span style="font-weight:600;">${total.toLocaleString("en-US")}</span>
                </div>`;
              }
              return html;
            },
          },
          legend: {
            top: 6,
            left: "center",
            itemWidth: 10,
            itemHeight: 10,
            data: ["仅游戏", "双投", "仅体育"],
            textStyle: { fontSize: 11 },
          },
          grid: { top: 42, left: 46, right: 18, bottom: 26, containLabel: true },
          xAxis: {
            type: "category",
            data: countriesSorted,
            axisLabel: { fontSize: 11 },
          },
          yAxis: {
            type: "value",
            min: 0,
            axisLabel: { fontSize: 11 },
            name: "投注人数（人）",
            nameTextStyle: { fontSize: 11, color: "rgba(100,116,139,1)" },
          },
          series,
        };
      }

      function buildLineOption(monthKey, country, window) {
        const rows = Array.isArray(rawByMonth && rawByMonth[monthKey]) ? rawByMonth[monthKey] : [];
        const totalF = `${window}_TOTAL_BET_PLACED_USER`;
        const sportsF = `${window}_SPORTS_BET_PLACED_USER`;
        const gamesF = `${window}_GAMES_BET_PLACED_USER`;

        const byDate = new Map(); // date -> {total,sports,games}
        for (const r of rows) {
          if (!r || r.country !== country) continue;
          const d = String(r.date || "");
          if (!d) continue;
          if (!byDate.has(d)) byDate.set(d, { total: 0, sports: 0, games: 0 });
          const cur = byDate.get(d);
          cur.total += safeNum(utils, r[totalF]);
          cur.sports += safeNum(utils, r[sportsF]);
          cur.games += safeNum(utils, r[gamesF]);
        }

        const dates = [...byDate.keys()].sort((a, b) => String(a).localeCompare(String(b)));
        const sportsOnly = [];
        const gameOnly = [];
        const both = [];

        for (const d of dates) {
          const cur = byDate.get(d);
          const mix = computeSegmentsFromTotals(cur.total, cur.sports, cur.games);

          // 折线堆积顺序：底部仅体育 -> 中部仅游戏 -> 顶部双投
          sportsOnly.push(Math.round(mix.sportsOnly));
          gameOnly.push(Math.round(mix.gameOnly));
          both.push(Math.round(mix.both));
        }

        const xLabels = dates.map((d) => d.slice(8)); // 01/02/...，够用

        return {
          tooltip: {
            trigger: "axis",
            confine: true,
            formatter(params) {
              const ps = Array.isArray(params) ? params : [params];
              const day = ps[0] && ps[0].axisValue ? ps[0].axisValue : "";
              const total = ps.reduce((sum, p) => sum + (Number(p.value) || 0), 0) || 0;
              let html = `<div style="font-weight:600;margin-bottom:6px;">${monthKey}-${day} · ${country} · ${window}</div>`;
              for (const p of ps) {
                const pct = total ? (Number(p.value) || 0) / total : NaN;
                html += `<div style="display:flex;justify-content:space-between;gap:12px;">
                  <span>${p.seriesName}</span>
                  <span>${(Number(p.value) || 0).toLocaleString("en-US")}${total ? ` (${fmtPct(pct, 1)})` : ""}</span>
                </div>`;
              }
              html += `<div style="display:flex;justify-content:space-between;gap:12px;margin-top:2px;">
                <span style="color:rgba(15,23,42,0.7);">总计</span>
                <span style="font-weight:600;">${total.toLocaleString("en-US")}</span>
              </div>`;
              return html;
            },
          },
          legend: {
            top: 6,
            left: "center",
            itemWidth: 10,
            itemHeight: 10,
            data: ["仅体育", "仅游戏", "双投"],
            textStyle: { fontSize: 11 },
          },
          grid: { top: 42, left: 46, right: 18, bottom: 30, containLabel: true },
          xAxis: {
            type: "category",
            data: xLabels,
            axisLabel: { fontSize: 11 },
          },
          yAxis: {
            type: "value",
            min: 0,
            axisLabel: { fontSize: 11 },
            name: "投注人数（人）",
            nameTextStyle: { fontSize: 11, color: "rgba(100,116,139,1)" },
          },
          series: [
            {
              name: "仅体育",
              type: "line",
              stack: "mix",
              smooth: true,
              symbol: "none",
              lineStyle: { width: 2 },
              areaStyle: {},
              itemStyle: { color: COLORS.sportsOnly },
              data: sportsOnly,
            },
            {
              name: "仅游戏",
              type: "line",
              stack: "mix",
              smooth: true,
              symbol: "none",
              lineStyle: { width: 2 },
              areaStyle: {},
              itemStyle: { color: COLORS.gameOnly },
              data: gameOnly,
            },
            {
              name: "双投",
              type: "line",
              stack: "mix",
              smooth: true,
              symbol: "none",
              lineStyle: { width: 2 },
              areaStyle: {},
              itemStyle: { color: COLORS.both },
              data: both,
            },
          ],
        };
      }

      function renderChart() {
        const c = ensureChart();
        if (!c) {
          if (chartNoteEl) chartNoteEl.textContent = "图表渲染失败：未检测到 echarts（CDN 可能被拦）。";
          return;
        }

        const selMonths = (state.months || []).slice();
        const selCountries = (state.countries || []).slice();
        const selWindows = (state.windows || []).slice();

        // 防御：空选择兜底
        if (!selMonths.length && defaultMonth) selMonths.push(defaultMonth);
        if (!selCountries.length) selCountries.push(COUNTRIES_ORDER[0]);
        if (!selWindows.length) selWindows.push("D0");

        if (state.chartType === "line") {
          const monthKey = selMonths[0];
          const country = selCountries[0];
          const win = selWindows[0];

          const option = buildLineOption(monthKey, country, win);

          // note
          if (chartNoteEl) {
            chartNoteEl.textContent = `折线图：${monthKey} · ${country} · ${win}（日级堆积，单位：人）。`;
          }

          c.setOption(option, true);
          return;
        }

        // bar
        const option = buildBarOption(selMonths, selCountries, selWindows);

        const monthsSorted = (utils && utils.sortMonths ? utils.sortMonths(selMonths) : selMonths.slice()).slice();
        const windowsSorted = sortByOrder(selWindows, WINDOWS_ORDER);
        const orderHint = monthsSorted
          .map((m) => WINDOWS_ORDER.filter((w) => windowsSorted.includes(w)).map((w) => `${m} ${w}`))
          .flat()
          .join(" → ");

        if (chartNoteEl) {
          chartNoteEl.textContent = `柱状图：按月汇总（单位：人），柱顺序：${orderHint || "—"}；D7 柱带斜线阴影。`;
        }

        c.setOption(option, true);
      }

      function renderTable() {
        const selMonths = (state.months || []).slice();
        const selCountries = sortByOrder(state.countries || [], COUNTRIES_ORDER);
        const selWindows = sortByOrder(state.windows || [], WINDOWS_ORDER);

        // columns = (month × window)
        const monthsSorted = (utils && utils.sortMonths ? utils.sortMonths(selMonths) : selMonths.slice()).slice();
        const cols = [];
        for (const m of monthsSorted) {
          for (const w of WINDOWS_ORDER) {
            if (selWindows.includes(w)) cols.push({ month: m, window: w, key: `${m} ${w}` });
          }
        }

        if (!cols.length || !selCountries.length) {
          tableWrap.innerHTML = `<div class="pmx-empty">数据表：筛选为空。</div>`;
          return;
        }

        const headCells = cols
          .map((c) => `<th>${monthLabel(c.month)} ${c.window}</th>`)
          .join("");

        const bodyRows = selCountries
          .map((country) => {
            const tds = cols
              .map((col) => {
                const agg = getMonthAgg(col.month);
                const base = agg && agg[country] && agg[country][col.window] ? agg[country][col.window] : { total: 0, sports: 0, games: 0 };
                const mix = computeSegmentsFromTotals(base.total, base.sports, base.games);

                const total = mix.total || 0;
                const g = Math.round(mix.gameOnly || 0);
                const b = Math.round(mix.both || 0);
                const s = Math.round(mix.sportsOnly || 0);

                const pg = total ? g / total : NaN;
                const pb = total ? b / total : NaN;
                const ps = total ? s / total : NaN;

                const fmtIntLocal = (v) => (utils && utils.fmtInt ? utils.fmtInt(v) : Number(v || 0).toLocaleString("en-US"));

                return `
                  <td>
                    <div class="pmx-cell">
                      <div>仅游戏：${fmtIntLocal(g)}${total ? ` (${fmtPct(pg, 1)})` : ""}</div>
                      <div>双投：${fmtIntLocal(b)}${total ? ` (${fmtPct(pb, 1)})` : ""}</div>
                      <div>仅体育：${fmtIntLocal(s)}${total ? ` (${fmtPct(ps, 1)})` : ""}</div>
                      <div class="pmx-total">总计：${fmtIntLocal(total)}</div>
                    </div>
                  </td>
                `;
              })
              .join("");

            return `<tr><th>${country}</th>${tds}</tr>`;
          })
          .join("");

        tableWrap.innerHTML = `
          <div class="pmx-table-scroll">
            <table class="pmx-table">
              <thead>
                <tr>
                  <th>国家</th>
                  ${headCells}
                </tr>
              </thead>
              <tbody>
                ${bodyRows}
              </tbody>
            </table>
          </div>
        `;
      }

      function renderInsight() {
        // 多月时取“选中月份里最新的一个”
        const monthsSorted = (utils && utils.sortMonths ? utils.sortMonths(state.months || []) : (state.months || []).slice()).slice();
        const insightMonth = monthsSorted.length ? monthsSorted[monthsSorted.length - 1] : defaultMonth;
        OVP.ui.renderInsight({ moduleId, month: insightMonth, el: insightEl });
      }

      function renderAll() {
        // 如果切换到 line，强制单选
        if (state.chartType === "line") coerceForLineMode();
        syncUI();
        renderChart();
        renderTable();
        renderInsight();
      }

      // init
      syncUI();
      renderAll();
    },
  });
})();
