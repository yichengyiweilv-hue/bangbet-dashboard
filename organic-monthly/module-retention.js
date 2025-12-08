/* module-retention.js
 * 模块6：次留 / 七留
 * 依赖：
 * - data.js: RAW_ORGANIC_BY_MONTH[month] => [{date,country,registration,D1_retained_users,D7_retained_users,...}]
 * - insights.js: INSIGHTS_ORGANIC_MONTHLY[month].retention
 * - index.html: 已加载 echarts，并把 rawByMonth/months/latestMonth 传入 render(ctx)
 */
(function () {
  const moduleId = "retention";

  const COUNTRY_ORDER = ["GH", "KE", "NG", "TZ", "UG"];
  const METRICS = [
    { key: "d1", label: "次留", numerator: "D1_retained_users", lineType: "dashed" },
    { key: "d7", label: "七留", numerator: "D7_retained_users", lineType: "solid", hatched: true },
  ];

  const SHARED_STYLE_ID = "ovp-shared-ui-styles-v1";

  function cssVar(name, fallback) {
    try {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v || fallback;
    } catch (_e) {
      return fallback;
    }
  }

  function ensureSharedStyles() {
    if (document.getElementById(SHARED_STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = SHARED_STYLE_ID;
    style.textContent = `
      .ovp-filters{
        display:grid;
        grid-template-columns: 1fr 1fr;
        gap:12px;
        padding:12px;
        border:1px solid rgba(148, 163, 184, 0.45);
        border-radius:12px;
        background: rgba(249, 250, 251, 0.70);
      }
      @media (max-width: 860px){
        .ovp-filters{ grid-template-columns: 1fr; }
      }
      .ovp-filter-group{ min-width: 0; }
      .ovp-filter-title{
        font-size:12px;
        color: var(--muted);
        margin-bottom:8px;
        font-weight:600;
        letter-spacing: .2px;
      }
      .ovp-filter-options{
        display:flex;
        flex-wrap:wrap;
        gap:8px 10px;
        align-items:center;
      }
      .ovp-check{
        display:inline-flex;
        align-items:center;
        gap:6px;
        padding:6px 10px;
        border:1px solid rgba(148, 163, 184, 0.55);
        border-radius:999px;
        background:#fff;
        cursor:pointer;
        user-select:none;
        font-size:12px;
        color: var(--text);
        line-height: 1;
      }
      .ovp-check input{ cursor:pointer; accent-color: ${cssVar("--ovp-blue", "#2563eb")}; }
      .ovp-check.is-on{
        border-color: rgba(37, 99, 235, 0.55);
        background: rgba(37, 99, 235, 0.06);
      }
      .ovp-check.is-disabled{
        opacity:.55;
        cursor:not-allowed;
      }
      .ovp-check.is-disabled input{ cursor:not-allowed; }

      .ovp-table-wrap{
        overflow:auto;
        border:1px solid rgba(148, 163, 184, 0.45);
        border-radius:12px;
        background:#fff;
      }
      .ovp-table{
        width:100%;
        border-collapse:separate;
        border-spacing:0;
        min-width: 520px;
      }
      .ovp-table th,
      .ovp-table td{
        font-size:12px;
        padding:10px 12px;
        border-bottom:1px solid rgba(148, 163, 184, 0.25);
        text-align:center;
        vertical-align:middle;
        white-space:nowrap;
      }
      .ovp-table th{
        position:sticky;
        top:0;
        z-index:1;
        background: rgba(249, 250, 251, 0.96);
        color: var(--muted);
        font-weight:700;
      }
      .ovp-table td:first-child,
      .ovp-table th:first-child{
        text-align:left;
        font-weight:700;
        color: var(--text);
        background: rgba(249, 250, 251, 0.55);
        position:sticky;
        left:0;
        z-index:2;
      }
      .ovp-table tr:last-child td{ border-bottom:none; }
      .ovp-muted{
        color: var(--muted);
        font-size: 12px;
      }
    `;
    document.head.appendChild(style);
  }

  function toNumber(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  function sortMonths(ms) {
    const arr = Array.isArray(ms) ? ms.slice() : [];
    return arr.sort((a, b) => String(a).localeCompare(String(b)));
  }

  function monthShort(m) {
    const s = String(m || "");
    const m2 = s.match(/^(\d{4})-(\d{2})$/);
    return m2 ? `${m2[2]}月` : s;
  }

  function getCheckedValues(root, role) {
    return Array.from(root.querySelectorAll(`input[data-role="${role}"]:checked`)).map((i) => i.value);
  }

  function getRadioValue(root, name, fallback) {
    const el = root.querySelector(`input[type="radio"][name="${name}"]:checked`);
    return el ? el.value : fallback;
  }

  function syncPills(root) {
    for (const lab of root.querySelectorAll("label.ovp-check")) {
      const input = lab.querySelector("input");
      if (!input) continue;
      lab.classList.toggle("is-on", !!input.checked);
      lab.classList.toggle("is-disabled", !!input.disabled);
    }
  }

  function computeMonthlyRetention(rawByMonth, months, countries) {
    const out = {};
    for (const m of months) {
      const rows = Array.isArray(rawByMonth[m]) ? rawByMonth[m] : [];
      const bucket = {};
      for (const c of countries) bucket[c] = { reg: 0, d1: 0, d7: 0 };

      for (const row of rows) {
        const c = row && row.country;
        if (!bucket[c]) continue;
        bucket[c].reg += toNumber(row.registration);
        bucket[c].d1 += toNumber(row.D1_retained_users);
        bucket[c].d7 += toNumber(row.D7_retained_users);
      }

      out[m] = {};
      for (const c of countries) {
        const b = bucket[c] || { reg: 0, d1: 0, d7: 0 };
        out[m][c] = {
          d1: b.reg > 0 ? b.d1 / b.reg : null,
          d7: b.reg > 0 ? b.d7 / b.reg : null,
          reg: b.reg,
          d1Users: b.d1,
          d7Users: b.d7,
        };
      }
    }
    return out;
  }

  function computeDailyRetention(rawByMonth, months, countries) {
    const byCountry = {};
    for (const c of countries) byCountry[c] = {}; // date -> {reg,d1,d7}

    const datesSet = new Set();

    for (const m of months) {
      const rows = Array.isArray(rawByMonth[m]) ? rawByMonth[m] : [];
      for (const row of rows) {
        const c = row && row.country;
        if (!byCountry[c]) continue;
        const date = String(row.date || "").slice(0, 10);
        if (!date) continue;

        datesSet.add(date);
        const rec = byCountry[c][date] || (byCountry[c][date] = { reg: 0, d1: 0, d7: 0 });
        rec.reg += toNumber(row.registration);
        rec.d1 += toNumber(row.D1_retained_users);
        rec.d7 += toNumber(row.D7_retained_users);
      }
    }

    const dates = Array.from(datesSet).sort((a, b) => String(a).localeCompare(String(b)));
    const series = {};
    for (const c of countries) {
      const map = byCountry[c] || {};
      series[c] = {
        d1: dates.map((d) => {
          const rec = map[d];
          if (!rec || rec.reg <= 0) return null;
          return rec.d1 / rec.reg;
        }),
        d7: dates.map((d) => {
          const rec = map[d];
          if (!rec || rec.reg <= 0) return null;
          return rec.d7 / rec.reg;
        }),
      };
    }

    return { dates, series };
  }

  function buildMonthColorMap(months) {
    const palette = [
      cssVar("--ovp-blue", "#2563eb"),
      cssVar("--ovp-yellow", "#f59e0b"),
      "#10b981",
      "#a855f7",
      "#ef4444",
      "#14b8a6",
      "#64748b",
    ];
    const map = {};
    months.forEach((m, idx) => {
      map[m] = palette[idx % palette.length];
    });
    return map;
  }

  function buildCountryColorMap(countries) {
    const palette = [
      cssVar("--ovp-blue", "#2563eb"),
      cssVar("--ovp-yellow", "#f59e0b"),
      "#10b981",
      "#a855f7",
      "#ef4444",
    ];
    const map = {};
    countries.forEach((c, idx) => {
      map[c] = palette[idx % palette.length];
    });
    return map;
  }

  function hatchedDecal() {
    // 斜线阴影（ECharts decal）
    return {
      symbol: "rect",
      symbolSize: 2,
      rotation: Math.PI / 4,
      color: "rgba(255,255,255,0.55)",
      dashArrayX: [1, 0],
      dashArrayY: [6, 2],
    };
  }

  OVP.registerModule({
    id: moduleId,
    title: "6. 次留 / 七留留存率（自然量）",
    subtitle: "筛选月份/国家/指标；支持月度柱状图与日级折线图；表格与文案联动",
    render({ mountEl, rawByMonth, months, latestMonth, utils }) {
      ensureSharedStyles();

      const allMonths = Array.isArray(months) ? months.slice() : [];
      const defaultMonth = latestMonth || (allMonths.length ? allMonths[allMonths.length - 1] : null);

      const state = {
        months: defaultMonth ? [defaultMonth] : [],
        countries: COUNTRY_ORDER.slice(),
        chartType: "bar",
        metrics: ["d1", "d7"],
      };

      mountEl.innerHTML = `
        <div class="ovp-module-stack">
          <div class="ovp-filters" id="filters-${moduleId}">
            <div class="ovp-filter-group">
              <div class="ovp-filter-title">月份（多选）</div>
              <div class="ovp-filter-options" id="${moduleId}-months"></div>
            </div>

            <div class="ovp-filter-group">
              <div class="ovp-filter-title">国家（多选）</div>
              <div class="ovp-filter-options" id="${moduleId}-countries"></div>
            </div>

            <div class="ovp-filter-group">
              <div class="ovp-filter-title">图表</div>
              <div class="ovp-filter-options" id="${moduleId}-charttype"></div>
            </div>

            <div class="ovp-filter-group">
              <div class="ovp-filter-title">指标（多选）</div>
              <div class="ovp-filter-options" id="${moduleId}-metrics"></div>
            </div>
          </div>

          <div>
            <div class="ovp-chart" id="chart-${moduleId}" style="height:360px;"></div>
            <div class="ovp-chart-note" id="chart-note-${moduleId}"></div>
          </div>

          <div class="ovp-table-wrap">
            <table class="ovp-table" id="table-${moduleId}"></table>
          </div>

          <div class="ovp-insight is-empty" id="insight-${moduleId}">文案待填写：./insights.js</div>
        </div>
      `;

      const monthsWrap = mountEl.querySelector(`#${moduleId}-months`);
      const countriesWrap = mountEl.querySelector(`#${moduleId}-countries`);
      const chartTypeWrap = mountEl.querySelector(`#${moduleId}-charttype`);
      const metricsWrap = mountEl.querySelector(`#${moduleId}-metrics`);

      const chartEl = mountEl.querySelector(`#chart-${moduleId}`);
      const chartNoteEl = mountEl.querySelector(`#chart-note-${moduleId}`);
      const tableEl = mountEl.querySelector(`#table-${moduleId}`);
      const insightEl = mountEl.querySelector(`#insight-${moduleId}`);

      // --- build filter UI ---
      function makePill({ type = "checkbox", role, name, value, label, checked }) {
        const lab = document.createElement("label");
        lab.className = "ovp-check";
        const input = document.createElement("input");
        input.type = type;
        if (name) input.name = name;
        input.value = value;
        input.checked = !!checked;
        input.setAttribute("data-role", role);
        const span = document.createElement("span");
        span.textContent = label;

        lab.appendChild(input);
        lab.appendChild(span);
        return lab;
      }

      // months
      monthsWrap.innerHTML = "";
      if (!allMonths.length) {
        const tip = document.createElement("div");
        tip.className = "ovp-muted";
        tip.textContent = "未检测到月份 key（data.js）";
        monthsWrap.appendChild(tip);
      } else {
        for (const m of allMonths) {
          monthsWrap.appendChild(
            makePill({
              type: "checkbox",
              role: "month",
              value: m,
              label: m,
              checked: state.months.includes(m),
            })
          );
        }
      }

      // countries
      countriesWrap.innerHTML = "";
      for (const c of COUNTRY_ORDER) {
        countriesWrap.appendChild(
          makePill({
            type: "checkbox",
            role: "country",
            value: c,
            label: c,
            checked: state.countries.includes(c),
          })
        );
      }

      // chart type radios
      chartTypeWrap.innerHTML = "";
      chartTypeWrap.appendChild(
        makePill({
          type: "radio",
          role: "chartType",
          name: `${moduleId}-charttype`,
          value: "bar",
          label: "月度柱状图",
          checked: state.chartType === "bar",
        })
      );
      chartTypeWrap.appendChild(
        makePill({
          type: "radio",
          role: "chartType",
          name: `${moduleId}-charttype`,
          value: "line",
          label: "日级折线图",
          checked: state.chartType === "line",
        })
      );

      // metrics
      metricsWrap.innerHTML = "";
      for (const m of METRICS) {
        metricsWrap.appendChild(
          makePill({
            type: "checkbox",
            role: "metric",
            value: m.key,
            label: m.label,
            checked: state.metrics.includes(m.key),
          })
        );
      }

      syncPills(mountEl);

      // --- echarts instance ---
      let chart = null;
      function getChart() {
        if (!window.echarts) return null;
        if (chart && !chart.isDisposed()) return chart;
        chart = echarts.init(chartEl, null, { renderer: "canvas" });
        return chart;
      }

      function renderInsight() {
        const picked = sortMonths(state.months);
        const targets = picked.length ? picked : (defaultMonth ? [defaultMonth] : []);
        const blocks = [];
        let hasAny = false;

        for (const m of targets) {
          const text = (OVP.getInsight(moduleId, m) || "").trim();
          if (text) hasAny = true;
          blocks.push(text ? `【${m}】\n${text}` : `【${m}】\n（文案待填写：./insights.js）`);
        }

        if (!blocks.length) {
          insightEl.textContent = "文案待填写：./insights.js";
          insightEl.classList.add("is-empty");
          return;
        }

        insightEl.textContent = blocks.join("\n\n");
        insightEl.classList.toggle("is-empty", !hasAny);
      }

      function renderTable() {
        const pickedMonths = sortMonths(state.months);
        const pickedCountries = COUNTRY_ORDER.filter((c) => state.countries.includes(c));
        const pickedMetrics = METRICS.map((m) => m.key).filter((k) => state.metrics.includes(k)); // keep order d1->d7

        if (!pickedMonths.length || !pickedCountries.length || !pickedMetrics.length) {
          tableEl.innerHTML = `
            <thead><tr><th>国家</th><th>—</th></tr></thead>
            <tbody><tr><td>—</td><td class="ovp-muted">请至少选择 1 个月份 / 国家 / 指标</td></tr></tbody>
          `;
          return;
        }

        const monthly = computeMonthlyRetention(rawByMonth || {}, pickedMonths, pickedCountries);

        const cols = [];
        for (const mo of pickedMonths) {
          for (const mk of pickedMetrics) cols.push({ month: mo, metric: mk });
        }

        const thead = document.createElement("thead");
        const hr = document.createElement("tr");
        const th0 = document.createElement("th");
        th0.textContent = "国家";
        hr.appendChild(th0);

        for (const col of cols) {
          const th = document.createElement("th");
          const metricLabel = (METRICS.find((x) => x.key === col.metric) || {}).label || col.metric;
          th.textContent = `${monthShort(col.month)}自然量${metricLabel}`;
          hr.appendChild(th);
        }
        thead.appendChild(hr);

        const tbody = document.createElement("tbody");
        for (const c of pickedCountries) {
          const tr = document.createElement("tr");
          const tdC = document.createElement("td");
          tdC.textContent = c;
          tr.appendChild(tdC);

          for (const col of cols) {
            const v = monthly[col.month] && monthly[col.month][c] ? monthly[col.month][c][col.metric] : null;
            const td = document.createElement("td");
            td.textContent = utils && utils.fmtPct ? utils.fmtPct(v, 2) : (v == null ? "—" : `${(v * 100).toFixed(2)}%`);
            tr.appendChild(td);
          }

          tbody.appendChild(tr);
        }

        tableEl.innerHTML = "";
        tableEl.appendChild(thead);
        tableEl.appendChild(tbody);
      }

      function renderBarChart() {
        const pickedMonths = sortMonths(state.months);
        const pickedCountries = COUNTRY_ORDER.filter((c) => state.countries.includes(c));
        const pickedMetrics = METRICS.map((m) => m.key).filter((k) => state.metrics.includes(k)); // d1->d7

        const c = getChart();
        if (!c) {
          chartEl.innerHTML = `<div class="ovp-muted" style="padding:12px;">ECharts 未加载</div>`;
          return;
        }
        if (!pickedMonths.length || !pickedCountries.length || !pickedMetrics.length) {
          c.clear();
          chartNoteEl.textContent = "请至少选择 1 个月份 / 国家 / 指标";
          return;
        }

        const monthly = computeMonthlyRetention(rawByMonth || {}, pickedMonths, pickedCountries);
        const monthColors = buildMonthColorMap(pickedMonths);

        const series = [];
        for (const mo of pickedMonths) {
          for (const mk of pickedMetrics) {
            const metric = METRICS.find((x) => x.key === mk);
            const baseColor = monthColors[mo];

            series.push({
              name: `${mo} ${metric.label}`,
              type: "bar",
              barMaxWidth: 18,
              emphasis: { focus: "series" },
              itemStyle: metric.hatched
                ? { color: baseColor, decal: hatchedDecal() }
                : { color: baseColor },
              data: pickedCountries.map((cc) => {
                const v = monthly[mo] && monthly[mo][cc] ? monthly[mo][cc][mk] : null;
                return v == null ? null : v;
              }),
            });
          }
        }

        const option = {
          grid: { left: 52, right: 18, top: 56, bottom: 42 },
          legend: {
            type: "scroll",
            top: 12,
            left: 12,
            right: 12,
            selectedMode: false,
          },
          tooltip: {
            trigger: "axis",
            axisPointer: { type: "shadow" },
            valueFormatter: (v) => (v == null ? "—" : `${(Number(v) * 100).toFixed(2)}%`),
          },
          xAxis: {
            type: "category",
            data: pickedCountries,
            axisTick: { alignWithLabel: true },
            axisLabel: { interval: 0 },
          },
          yAxis: {
            type: "value",
            min: 0,
            axisLabel: {
              formatter: (v) => `${(Number(v) * 100).toFixed(0)}%`,
            },
            splitLine: { lineStyle: { color: "rgba(148,163,184,0.25)" } },
          },
          series,
        };

        c.setOption(option, { notMerge: true, lazyUpdate: false });

        chartNoteEl.textContent =
          `口径：次留=ΣD1_retained_users/Σregistration；七留=ΣD7_retained_users/Σregistration。` +
          ` 单位：%  ｜ 月份：${pickedMonths.join(", ")} ｜ 国家：${pickedCountries.join(", ")}`;
      }

      function renderLineChart() {
        const pickedMonths = sortMonths(state.months);
        const pickedCountries = COUNTRY_ORDER.filter((c) => state.countries.includes(c));
        const pickedMetrics = METRICS.map((m) => m.key).filter((k) => state.metrics.includes(k)); // d1->d7

        const c = getChart();
        if (!c) {
          chartEl.innerHTML = `<div class="ovp-muted" style="padding:12px;">ECharts 未加载</div>`;
          return;
        }
        if (!pickedMonths.length || !pickedCountries.length || !pickedMetrics.length) {
          c.clear();
          chartNoteEl.textContent = "请至少选择 1 个月份 / 国家 / 指标";
          return;
        }

        const { dates, series: daily } = computeDailyRetention(rawByMonth || {}, pickedMonths, pickedCountries);
        const countryColors = buildCountryColorMap(pickedCountries);

        const series = [];
        for (const cc of pickedCountries) {
          for (const mk of pickedMetrics) {
            const metric = METRICS.find((x) => x.key === mk);
            const color = countryColors[cc];

            series.push({
              name: `${cc} ${metric.label}`,
              type: "line",
              showSymbol: false,
              connectNulls: false,
              itemStyle: { color },
              lineStyle: { type: metric.lineType, width: 2, color },
              emphasis: { focus: "series" },
              data: (daily[cc] && daily[cc][mk]) ? daily[cc][mk] : dates.map(() => null),
            });
          }
        }

        const option = {
          grid: { left: 52, right: 18, top: 56, bottom: 58 },
          legend: {
            type: "scroll",
            top: 12,
            left: 12,
            right: 12,
            selectedMode: false,
          },
          tooltip: {
            trigger: "axis",
            valueFormatter: (v) => (v == null ? "—" : `${(Number(v) * 100).toFixed(2)}%`),
          },
          xAxis: {
            type: "category",
            data: dates,
            axisLabel: { hideOverlap: true },
          },
          yAxis: {
            type: "value",
            min: 0,
            axisLabel: { formatter: (v) => `${(Number(v) * 100).toFixed(0)}%` },
            splitLine: { lineStyle: { color: "rgba(148,163,184,0.25)" } },
          },
          dataZoom: [
            { type: "inside", throttle: 60 },
            { type: "slider", height: 14, bottom: 12, brushSelect: false },
          ],
          series,
        };

        c.setOption(option, { notMerge: true, lazyUpdate: false });

        chartNoteEl.textContent =
          `口径：日级（按 date×country 先汇总 numerator/registration 再求比）。` +
          ` 次留= D1_retained_users/registration（虚线）；七留= D7_retained_users/registration（实线）。` +
          ` 单位：%  ｜ 月份：${pickedMonths.join(", ")} ｜ 国家：${pickedCountries.join(", ")}`;
      }

      function renderAll() {
        syncPills(mountEl);
        if (state.chartType === "line") renderLineChart();
        else renderBarChart();
        renderTable();
        renderInsight();
      }

      // --- handle filter changes (delegation) ---
      mountEl.addEventListener("change", (e) => {
        const t = e.target;
        if (!(t instanceof HTMLInputElement)) return;

        // months
        if (t.dataset.role === "month") {
          const picked = getCheckedValues(mountEl, "month");
          if (!picked.length) {
            t.checked = true; // keep at least one
          }
          state.months = sortMonths(getCheckedValues(mountEl, "month"));
          renderAll();
          return;
        }

        // countries
        if (t.dataset.role === "country") {
          const picked = getCheckedValues(mountEl, "country");
          if (!picked.length) {
            t.checked = true;
          }
          state.countries = COUNTRY_ORDER.filter((c) => getCheckedValues(mountEl, "country").includes(c));
          renderAll();
          return;
        }

        // metrics
        if (t.dataset.role === "metric") {
          const picked = getCheckedValues(mountEl, "metric");
          if (!picked.length) {
            t.checked = true;
          }
          state.metrics = METRICS.map((m) => m.key).filter((k) => getCheckedValues(mountEl, "metric").includes(k));
          renderAll();
          return;
        }

        // chart type
        if (t.dataset.role === "chartType") {
          state.chartType = getRadioValue(mountEl, `${moduleId}-charttype`, "bar");
          renderAll();
          return;
        }
      });

      // resize
      window.addEventListener("resize", () => {
        if (chart && !chart.isDisposed()) chart.resize();
      });

      // first paint
      renderAll();
    },
  });
})();
