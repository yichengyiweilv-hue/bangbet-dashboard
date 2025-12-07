/* module-payrate.js
 * 模块2：D0 / D7 付费率（自然量）
 * - 柱状图：国家固定顺序 GH/KE/NG/TZ/UG；D0/D7 两根柱（非堆叠），D7 同色+斜线纹理
 * - 折线图：日级；同国家同色；D0 虚线、D7 实线；按国家勾选增删整条线
 * - 表格：纵向国家；横向：自然量D0付费率 / 自然量D7付费率
 * - 文案：insights.js -> INSIGHTS_ORGANIC_MONTHLY[month].payrate 或 __default__.payrate
 */
(function () {
  const moduleId = "payrate";

  const COUNTRIES_ORDER = ["GH", "KE", "NG", "TZ", "UG"];
  const METRIC_DEFS = [
    { key: "D0", label: "D0数据", payerField: "D0_unique_purchase" },
    { key: "D7", label: "D7数据", payerField: "D7_unique_purchase" },
  ];

  function ensureStyleOnce() {
    if (document.getElementById("ovp-style-payrate")) return;
    const style = document.createElement("style");
    style.id = "ovp-style-payrate";
    style.textContent = `
      .ovp-payrate{ display:flex; flex-direction:column; gap:12px; }

      .ovp-payrate-filters{
        display:flex; flex-wrap:wrap; gap:10px;
        align-items:flex-start;
      }
      .ovp-payrate-group{
        flex: 0 1 auto;
        min-width: 220px;
        border:1px solid rgba(148, 163, 184, 0.60);
        border-radius:12px;
        background: rgba(249, 250, 251, 0.90);
        padding:10px 10px 8px;
      }
      .ovp-payrate-group.wide{ min-width: 320px; }
      .ovp-payrate-title{
        font-size:11px;
        color: var(--muted);
        margin:0 0 8px;
        line-height:1.4;
        display:flex;
        justify-content:space-between;
        gap:10px;
      }
      .ovp-payrate-title .ovp-payrate-hint{ color: var(--muted); opacity:.9; }
      .ovp-payrate-opts{
        display:flex; flex-wrap:wrap; gap:6px;
        align-items:center;
      }
      .ovp-payrate-opt{
        position:relative;
        display:inline-flex;
      }
      .ovp-payrate-opt input{
        position:absolute;
        opacity:0;
        pointer-events:none;
      }
      .ovp-payrate-opt span{
        display:inline-flex;
        align-items:center;
        justify-content:center;
        padding:6px 10px;
        border-radius:999px;
        border:1px solid rgba(148, 163, 184, 0.60);
        background:#fff;
        color: var(--text);
        font-size:12px;
        line-height:1;
        cursor:pointer;
        user-select:none;
        white-space:nowrap;
      }
      .ovp-payrate-opt input:checked + span{
        background: rgba(37, 99, 235, 0.10);
        border-color: rgba(37, 99, 235, 0.45);
      }
      .ovp-payrate-opt input:focus-visible + span{
        outline:2px solid rgba(37, 99, 235, 0.35);
        outline-offset:2px;
      }

      .ovp-payrate-table-wrap{
        border:1px solid rgba(148, 163, 184, 0.60);
        border-radius:12px;
        background:#fff;
        overflow:hidden;
      }
      .ovp-payrate-table{
        width:100%;
        border-collapse:separate;
        border-spacing:0;
      }
      .ovp-payrate-table thead th{
        text-align:left;
        font-size:11px;
        color: var(--muted);
        background: rgba(249, 250, 251, 0.90);
        padding:10px 12px;
        border-bottom:1px solid rgba(148, 163, 184, 0.35);
        white-space:nowrap;
      }
      .ovp-payrate-table tbody td{
        padding:10px 12px;
        font-size:12px;
        color: var(--text);
        border-bottom:1px solid rgba(148, 163, 184, 0.22);
        vertical-align:middle;
      }
      .ovp-payrate-table tbody tr:last-child td{ border-bottom:none; }
      .ovp-payrate-table .num{
        text-align:right;
        font-variant-numeric: tabular-nums;
      }
      .ovp-payrate-table .muted{
        color: var(--muted);
      }

      .ovp-payrate-inline-note{
        margin-top:8px;
        font-size:11px;
        color: var(--muted);
        line-height:1.5;
      }

      .ovp-payrate-alert{
        padding:10px 12px;
        border:1px solid rgba(148, 163, 184, 0.60);
        border-radius:12px;
        background: rgba(249, 250, 251, 0.90);
        color: var(--muted);
        font-size:11px;
        line-height:1.5;
      }
    `;
    document.head.appendChild(style);
  }

  function cssVar(name, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  function safeNum(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }

  function monthToLabel(ym) {
    const parts = String(ym || "").split("-");
    if (parts.length < 2) return String(ym || "");
    const m = Number(parts[1]);
    return Number.isFinite(m) ? `${m}月` : String(ym || "");
  }

  function daysOfMonth(ym) {
    // ym: "YYYY-MM"
    const [yStr, mStr] = String(ym).split("-");
    const y = Number(yStr);
    const m = Number(mStr);
    if (!Number.isFinite(y) || !Number.isFinite(m)) return [];
    // use UTC to avoid DST issues
    const start = new Date(Date.UTC(y, m - 1, 1));
    const end = new Date(Date.UTC(y, m, 1));
    const days = [];
    for (let d = new Date(start); d < end; d.setUTCDate(d.getUTCDate() + 1)) {
      const yyyy = d.getUTCFullYear();
      const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
      const dd = String(d.getUTCDate()).padStart(2, "0");
      days.push(`${yyyy}-${mm}-${dd}`);
    }
    return days;
  }

  function dayLabel(dateStr) {
    // "YYYY-MM-DD" -> "MM-DD"
    const s = String(dateStr || "");
    return s.length >= 10 ? s.slice(5, 10) : s;
  }

  function sumField(rows, field) {
    let s = 0;
    for (const r of rows) {
      const n = safeNum(r && r[field]);
      if (n !== null) s += n;
    }
    return s;
  }

  function pickMonthRows(rawByMonth, ym) {
    const rows = rawByMonth && rawByMonth[ym];
    return Array.isArray(rows) ? rows : [];
  }

  function calcMonthlyByCountry(rows) {
    // returns map country -> { reg, d0p, d7p, d0Rate, d7Rate }
    const out = {};
    for (const c of COUNTRIES_ORDER) out[c] = { reg: 0, d0p: 0, d7p: 0, d0Rate: null, d7Rate: null };

    for (const r of rows) {
      const c = r && r.country;
      if (!out[c]) continue;
      const reg = safeNum(r.registration);
      const d0p = safeNum(r.D0_unique_purchase);
      const d7p = safeNum(r.D7_unique_purchase);
      if (reg !== null) out[c].reg += reg;
      if (d0p !== null) out[c].d0p += d0p;
      if (d7p !== null) out[c].d7p += d7p;
    }

    for (const c of Object.keys(out)) {
      const reg = out[c].reg;
      out[c].d0Rate = reg > 0 ? out[c].d0p / reg : null;
      out[c].d7Rate = reg > 0 ? out[c].d7p / reg : null;
    }

    return out;
  }

  function indexRowsByCountryDate(rows) {
    // map: country -> date -> row (if multiple, will aggregate)
    const map = {};
    for (const c of COUNTRIES_ORDER) map[c] = {};
    for (const r of rows) {
      const c = r && r.country;
      const d = r && r.date;
      if (!map[c] || !d) continue;

      if (!map[c][d]) {
        map[c][d] = {
          registration: 0,
          D0_unique_purchase: 0,
          D7_unique_purchase: 0,
        };
      }
      const reg = safeNum(r.registration);
      const d0p = safeNum(r.D0_unique_purchase);
      const d7p = safeNum(r.D7_unique_purchase);
      if (reg !== null) map[c][d].registration += reg;
      if (d0p !== null) map[c][d].D0_unique_purchase += d0p;
      if (d7p !== null) map[c][d].D7_unique_purchase += d7p;
    }
    return map;
  }

  function buildBarOption({ month, countries, metrics, monthlyMap, utils }) {
    const textColor = cssVar("--text", "#0f172a");
    const muted = cssVar("--muted", "#6b7280");
    const baseColor = cssVar("--ovp-blue", "#2563eb");

    const xCats = COUNTRIES_ORDER.filter((c) => countries.includes(c));
    const series = [];

    const d0Data = xCats.map((c) => monthlyMap[c]?.d0Rate ?? null);
    const d7Data = xCats.map((c) => monthlyMap[c]?.d7Rate ?? null);

    if (metrics.includes("D0")) {
      series.push({
        name: "D0",
        type: "bar",
        data: d0Data,
        barMaxWidth: 42,
        itemStyle: { color: baseColor },
      });
    }
    if (metrics.includes("D7")) {
      series.push({
        name: "D7",
        type: "bar",
        data: d7Data,
        barMaxWidth: 42,
        itemStyle: {
          color: baseColor,
          // 斜线填充：ECharts decal
          decal: {
            symbol: "rect",
            rotation: Math.PI / 4,
            dashArrayX: [2, 2],
            dashArrayY: [4, 2],
            color: "rgba(255,255,255,0.55)",
          },
        },
      });
    }

    const legendData = series.map((s) => s.name);

    return {
      animationDuration: 300,
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: (params) => {
          const title = `${monthToLabel(month)} · ${params?.[0]?.axisValue ?? ""}`;
          const lines = [title];
          for (const p of params || []) {
            const v = p?.data;
            lines.push(`${p.marker}${p.seriesName}: ${utils.fmtPct(v, 2)}`);
          }
          return lines.join("<br/>");
        },
      },
      legend: {
        data: legendData,
        top: 8,
        right: 10,
        textStyle: { color: muted },
      },
      grid: { left: 46, right: 18, top: 46, bottom: 34, containLabel: true },
      xAxis: {
        type: "category",
        data: xCats,
        axisLine: { lineStyle: { color: "rgba(148, 163, 184, 0.60)" } },
        axisTick: { alignWithLabel: true },
        axisLabel: { color: muted },
      },
      yAxis: {
        type: "value",
        min: 0,
        axisLine: { show: false },
        splitLine: { lineStyle: { color: "rgba(148, 163, 184, 0.22)" } },
        axisLabel: {
          color: muted,
          formatter: (v) => `${(Number(v) * 100).toFixed(0)}%`,
        },
      },
      series,
    };
  }

  function buildLineOption({ month, countries, metrics, rows, utils }) {
    const muted = cssVar("--muted", "#6b7280");

    const days = daysOfMonth(month);
    const xCats = days.map(dayLabel);

    const byCD = indexRowsByCountryDate(rows);

    const colorMap = {
      GH: cssVar("--ovp-blue", "#2563eb"),
      KE: cssVar("--ovp-yellow", "#F6C344"),
      NG: "#10b981",
      TZ: "#ef4444",
      UG: "#8b5cf6",
    };

    const selectedCountries = COUNTRIES_ORDER.filter((c) => countries.includes(c));
    const selectedMetrics = metrics.slice(); // ["D0","D7"]

    const series = [];

    for (const c of selectedCountries) {
      const color = colorMap[c] || "#2563eb";
      const dayRows = byCD[c] || {};

      // build data arrays
      const d0Arr = [];
      const d7Arr = [];

      for (const d of days) {
        const agg = dayRows[d];
        if (!agg) {
          d0Arr.push(null);
          d7Arr.push(null);
          continue;
        }
        const reg = safeNum(agg.registration) ?? 0;
        const d0p = safeNum(agg.D0_unique_purchase) ?? 0;
        const d7p = safeNum(agg.D7_unique_purchase) ?? 0;
        d0Arr.push(reg > 0 ? d0p / reg : null);
        d7Arr.push(reg > 0 ? d7p / reg : null);
      }

      if (selectedMetrics.includes("D0")) {
        series.push({
          id: `${c}|D0`,
          name: c, // legend 只按国家
          type: "line",
          data: d0Arr,
          showSymbol: false,
          connectNulls: true,
          lineStyle: { width: 2, type: "dashed", color },
          itemStyle: { color },
          emphasis: { focus: "series" },
        });
      }
      if (selectedMetrics.includes("D7")) {
        series.push({
          id: `${c}|D7`,
          name: c, // legend 只按国家
          type: "line",
          data: d7Arr,
          showSymbol: false,
          connectNulls: true,
          lineStyle: { width: 2, type: "solid", color },
          itemStyle: { color },
          emphasis: { focus: "series" },
        });
      }
    }

    return {
      animationDuration: 300,
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "line" },
        formatter: (params) => {
          const axis = params?.[0]?.axisValue ?? "";
          const title = `${monthToLabel(month)} · ${axis}`;
          const byCountry = {};
          for (const p of params || []) {
            const id = String(p?.seriesId || "");
            const [cc, mm] = id.split("|");
            if (!cc || !mm) continue;
            if (!byCountry[cc]) byCountry[cc] = {};
            byCountry[cc][mm] = p?.data;
          }

          const lines = [title];
          // 固定顺序输出
          for (const cc of COUNTRIES_ORDER) {
            if (!countries.includes(cc)) continue;
            const hit = byCountry[cc];
            if (!hit) continue;

            const d0 = hit.D0;
            const d7 = hit.D7;

            if (metrics.includes("D0")) lines.push(`${cc} D0（虚线）: ${utils.fmtPct(d0, 2)}`);
            if (metrics.includes("D7")) lines.push(`${cc} D7（实线）: ${utils.fmtPct(d7, 2)}`);
          }
          return lines.join("<br/>");
        },
      },
      legend: {
        data: COUNTRIES_ORDER.filter((c) => countries.includes(c)),
        top: 8,
        right: 10,
        textStyle: { color: muted },
      },
      grid: { left: 46, right: 18, top: 46, bottom: 34, containLabel: true },
      xAxis: {
        type: "category",
        data: xCats,
        boundaryGap: false,
        axisLine: { lineStyle: { color: "rgba(148, 163, 184, 0.60)" } },
        axisLabel: { color: muted },
      },
      yAxis: {
        type: "value",
        min: 0,
        axisLine: { show: false },
        splitLine: { lineStyle: { color: "rgba(148, 163, 184, 0.22)" } },
        axisLabel: {
          color: muted,
          formatter: (v) => `${(Number(v) * 100).toFixed(0)}%`,
        },
      },
      series,
    };
  }

  function buildTableHTML({ month, countries, metrics, monthlyMap, utils }) {
    const showD0 = metrics.includes("D0");
    const showD7 = metrics.includes("D7");

    const rows = COUNTRIES_ORDER.filter((c) => countries.includes(c)).map((c) => {
      const d0 = monthlyMap[c]?.d0Rate ?? null;
      const d7 = monthlyMap[c]?.d7Rate ?? null;
      return `
        <tr>
          <td><strong>${c}</strong></td>
          <td class="num ${showD0 ? "" : "muted"}">${showD0 ? utils.fmtPct(d0, 2) : "—"}</td>
          <td class="num ${showD7 ? "" : "muted"}">${showD7 ? utils.fmtPct(d7, 2) : "—"}</td>
        </tr>
      `;
    });

    return `
      <div class="ovp-payrate-table-wrap" role="region" aria-label="自然量付费率数据表">
        <table class="ovp-payrate-table">
          <thead>
            <tr>
              <th style="width:120px;">国家</th>
              <th class="num">自然量D0付费率</th>
              <th class="num">自然量D7付费率</th>
            </tr>
          </thead>
          <tbody>
            ${rows.join("")}
          </tbody>
        </table>
      </div>
      <div class="ovp-payrate-inline-note">
        口径：D0_unique_purchase/registration；D7_unique_purchase/registration（单位：%）。D0 虚线 / D7 实线。
      </div>
    `;
  }

  OVP.registerModule({
    id: moduleId,
    title: "D0 / D7 付费率",
    subtitle: "口径：D0_unique_purchase/registration；D7_unique_purchase/registration（自然量；按月汇总 + 日级趋势）",
    span: "full",

    render({ mountEl, rawByMonth, months, latestMonth, utils }) {
      ensureStyleOnce();

      const { chartEl, chartNoteEl, insightEl } = OVP.ui.mountModule(mountEl, { moduleId, chartHeight: 360 });
      const stackEl = mountEl.querySelector(".ovp-module-stack");
      if (!stackEl) return;

      const sortedMonths = Array.isArray(months) ? months.slice() : [];
      const defaultMonth = latestMonth || sortedMonths[sortedMonths.length - 1] || (sortedMonths[0] || null);

      const state = {
        month: defaultMonth,
        chartMode: "bar", // 'bar' | 'line'
        countries: COUNTRIES_ORDER.slice(), // multi
        metrics: ["D0", "D7"], // multi
      };

      // ---------- UI: Filters ----------
      const filtersEl = document.createElement("div");
      filtersEl.className = "ovp-payrate-filters";
      filtersEl.innerHTML = `
        <div class="ovp-payrate-group wide">
          <div class="ovp-payrate-title">
            <span>月份（单选）</span>
            <span class="ovp-payrate-hint">当前：${state.month || "—"}</span>
          </div>
          <div class="ovp-payrate-opts" id="payrate-month-opts">
            ${sortedMonths
              .map((m) => {
                const checked = m === state.month ? "checked" : "";
                return `<label class="ovp-payrate-opt">
                  <input type="radio" name="payrate-month" value="${m}" ${checked} />
                  <span>${m}（${monthToLabel(m)}）</span>
                </label>`;
              })
              .join("")}
          </div>
        </div>

        <div class="ovp-payrate-group">
          <div class="ovp-payrate-title">
            <span>国家（多选）</span>
            <span class="ovp-payrate-hint">顺序固定</span>
          </div>
          <div class="ovp-payrate-opts" id="payrate-country-opts">
            ${COUNTRIES_ORDER.map((c) => {
              return `<label class="ovp-payrate-opt">
                <input type="checkbox" name="payrate-country" value="${c}" checked />
                <span>${c}</span>
              </label>`;
            }).join("")}
          </div>
        </div>

        <div class="ovp-payrate-group">
          <div class="ovp-payrate-title">
            <span>图表</span>
            <span class="ovp-payrate-hint">单选</span>
          </div>
          <div class="ovp-payrate-opts" id="payrate-mode-opts">
            <label class="ovp-payrate-opt">
              <input type="radio" name="payrate-mode" value="bar" checked />
              <span>月度柱状图</span>
            </label>
            <label class="ovp-payrate-opt">
              <input type="radio" name="payrate-mode" value="line" />
              <span>日级折线图</span>
            </label>
          </div>
        </div>

        <div class="ovp-payrate-group">
          <div class="ovp-payrate-title">
            <span>D0 / D7（多选）</span>
            <span class="ovp-payrate-hint">同国家同色</span>
          </div>
          <div class="ovp-payrate-opts" id="payrate-metric-opts">
            ${METRIC_DEFS.map((m) => {
              const checked = state.metrics.includes(m.key) ? "checked" : "";
              return `<label class="ovp-payrate-opt">
                <input type="checkbox" name="payrate-metric" value="${m.key}" ${checked} />
                <span>${m.label}</span>
              </label>`;
            }).join("")}
          </div>
        </div>
      `;

      // Insert filters at top of stack
      stackEl.insertBefore(filtersEl, stackEl.firstChild);

      // ---------- UI: Table ----------
      const tableHost = document.createElement("div");
      tableHost.id = "payrate-table-host";
      stackEl.insertBefore(tableHost, insightEl);

      // ---------- Chart init ----------
      if (!window.echarts) {
        chartEl.classList.remove("is-empty");
        chartEl.innerHTML = `<div class="ovp-payrate-alert">未检测到 echarts：请确认 index.html 已加载 ECharts CDN。</div>`;
        if (chartNoteEl) chartNoteEl.textContent = "图表未渲染：ECharts 未加载。";
        // insights still render
        OVP.ui.renderInsight({ moduleId, month: state.month, el: insightEl });
        return;
      }

      chartEl.classList.remove("is-empty");
      chartEl.innerHTML = `<div id="payrate-echarts" style="width:100%;height:100%;"></div>`;
      const echartsEl = chartEl.querySelector("#payrate-echarts");
      const chart = echarts.init(echartsEl);

      let resizeTimer = null;
      function onResize() {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => chart.resize(), 60);
      }
      window.addEventListener("resize", onResize);

      function readStateFromUI() {
        const monthInput = mountEl.querySelector('input[name="payrate-month"]:checked');
        state.month = monthInput ? monthInput.value : state.month;

        const modeInput = mountEl.querySelector('input[name="payrate-mode"]:checked');
        state.chartMode = modeInput ? modeInput.value : state.chartMode;

        const countryInputs = Array.from(mountEl.querySelectorAll('input[name="payrate-country"]'));
        state.countries = countryInputs.filter((x) => x.checked).map((x) => x.value);

        const metricInputs = Array.from(mountEl.querySelectorAll('input[name="payrate-metric"]'));
        state.metrics = metricInputs.filter((x) => x.checked).map((x) => x.value);
      }

      function renderAll() {
        readStateFromUI();

        // update month hint
        const hint = filtersEl.querySelector(".ovp-payrate-hint");
        if (hint) hint.textContent = `当前：${state.month || "—"}`;

        // basic guards
        if (!state.month) {
          chart.clear();
          tableHost.innerHTML = `<div class="ovp-payrate-alert">未检测到月份：请先在 data.js 里补齐月份 key。</div>`;
          if (chartNoteEl) chartNoteEl.textContent = "无月份可选：检查 RAW_ORGANIC_BY_MONTH 的 key。";
          OVP.ui.renderInsight({ moduleId, month: null, el: insightEl });
          return;
        }
        if (!state.countries.length) {
          chart.clear();
          tableHost.innerHTML = `<div class="ovp-payrate-alert">国家未选择：至少勾选 1 个国家。</div>`;
          if (chartNoteEl) chartNoteEl.textContent = "请先勾选国家。";
          OVP.ui.renderInsight({ moduleId, month: state.month, el: insightEl });
          return;
        }
        if (!state.metrics.length) {
          chart.clear();
          tableHost.innerHTML = `<div class="ovp-payrate-alert">D0/D7 未选择：至少勾选 1 个。</div>`;
          if (chartNoteEl) chartNoteEl.textContent = "请先勾选 D0 或 D7。";
          OVP.ui.renderInsight({ moduleId, month: state.month, el: insightEl });
          return;
        }

        const monthRows = pickMonthRows(rawByMonth || {}, state.month);
        const monthlyMap = calcMonthlyByCountry(monthRows);

        // chart
        if (state.chartMode === "bar") {
          const option = buildBarOption({
            month: state.month,
            countries: state.countries,
            metrics: state.metrics,
            monthlyMap,
            utils,
          });
          chart.setOption(option, true);
          if (chartNoteEl) chartNoteEl.textContent = "柱状图：当月按国家展示付费率（D0/D7 两根柱）；D7 柱为斜线填充。";
        } else {
          const option = buildLineOption({
            month: state.month,
            countries: state.countries,
            metrics: state.metrics,
            rows: monthRows,
            utils,
          });
          chart.setOption(option, true);
          if (chartNoteEl) chartNoteEl.textContent = "折线图：当月日级付费率趋势；D0 虚线、D7 实线；同国家同色。";
        }

        // table (按月汇总)
        tableHost.innerHTML = buildTableHTML({
          month: state.month,
          countries: state.countries,
          metrics: state.metrics,
          monthlyMap,
          utils,
        });

        // insight
        OVP.ui.renderInsight({ moduleId, month: state.month, el: insightEl });
      }

      // event binding
      mountEl.addEventListener("change", (e) => {
        const t = e.target;
        if (!t || !t.name) return;

        // 保底：不允许 D0/D7 全取消（用户真取消了就让 UI 保持，但会提示）
        renderAll();
      });

      // First render
      renderAll();
    },
  });
})();
