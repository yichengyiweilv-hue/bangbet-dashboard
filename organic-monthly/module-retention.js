/* organic-monthly/module-retention.js
 * 模块6：次留 / 七留留存率
 * 口径：次留 = D1_retained_users / registration；七留 = D7_retained_users / registration
 */
(function () {
  if (!window.OVP || typeof OVP.registerModule !== "function") return;

  const MODULE_ID = "retention";
  const COUNTRY_ORDER = ["GH", "KE", "NG", "TZ", "UG"];
  const METRICS = [
    { key: "D1", label: "次留", field: "D1_retained_users" },
    { key: "D7", label: "七留", field: "D7_retained_users" },
  ];

  const STYLE_ID = "ovp-retention-style-v1";
  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .ovp-retention{
        display:flex;
        flex-direction:column;
        gap:12px;
      }

      .ovp-retention-filters{
        display:flex;
        flex-wrap:wrap;
        gap:10px 14px;
        padding:10px 12px;
        border:1px solid rgba(148, 163, 184, 0.60);
        border-radius:12px;
        background: rgba(249, 250, 251, 0.92);
      }

      .ovp-retention-filter-block{
        display:flex;
        flex-direction:column;
        gap:6px;
        min-width: 190px;
      }

      .ovp-retention-filter-title{
        font-size:11px;
        line-height:1.2;
        color: var(--muted, #6b7280);
        user-select:none;
      }

      .ovp-retention-filter-options{
        display:flex;
        flex-wrap:wrap;
        gap:6px;
      }

      .ovp-retention-chip{
        display:inline-flex;
        align-items:center;
        gap:6px;
        padding:6px 10px;
        border:1px solid rgba(148, 163, 184, 0.55);
        border-radius:999px;
        background:#fff;
        cursor:pointer;
        user-select:none;
        white-space:nowrap;
      }
      .ovp-retention-chip input{
        margin:0;
        transform: translateY(0.5px);
      }
      .ovp-retention-chip span{
        font-size:12px;
        color: var(--text, #0f172a);
      }
      .ovp-retention-chip:hover{
        border-color: rgba(37, 99, 235, 0.45);
      }

      .ovp-retention-table-wrap{
        overflow:auto;
        border:1px solid rgba(148, 163, 184, 0.60);
        border-radius:12px;
        background:#fff;
      }
      .ovp-retention-table{
        width:100%;
        border-collapse:separate;
        border-spacing:0;
        min-width: 760px;
      }
      .ovp-retention-table thead th{
        position:sticky;
        top:0;
        z-index:1;
        background: rgba(249, 250, 251, 0.96);
        color: var(--muted, #6b7280);
        font-weight:600;
        font-size:11px;
        text-align:left;
        border-bottom:1px solid rgba(148, 163, 184, 0.45);
        padding:10px 10px;
        white-space:nowrap;
      }
      .ovp-retention-table tbody td{
        font-size:12px;
        color: var(--text, #0f172a);
        border-bottom:1px solid rgba(148, 163, 184, 0.25);
        padding:10px 10px;
        white-space:nowrap;
      }
      .ovp-retention-table tbody tr:last-child td{
        border-bottom:none;
      }
      .ovp-retention-table td.num{
        text-align:right;
        font-variant-numeric: tabular-nums;
      }

      .ovp-retention-insight-head{
        display:flex;
        justify-content:space-between;
        align-items:flex-end;
        gap:10px;
        margin-top: 2px;
      }
      .ovp-retention-insight-title{
        font-size:12px;
        font-weight:600;
        color: var(--text, #0f172a);
      }
      .ovp-retention-insight-meta{
        font-size:11px;
        color: var(--muted, #6b7280);
      }

      .ovp-retention-empty{
        padding:10px 12px;
        border:1px dashed rgba(148, 163, 184, 0.60);
        border-radius:12px;
        background: rgba(249, 250, 251, 0.92);
        color: var(--muted, #6b7280);
        font-size:11px;
        line-height:1.6;
      }
    `;
    document.head.appendChild(style);
  }

  function monthShort(m) {
    const parts = String(m || "").split("-");
    if (parts.length !== 2) return String(m || "");
    const mm = parseInt(parts[1], 10);
    if (!Number.isFinite(mm)) return String(m || "");
    return `${mm}月`;
  }

  function sortMonths(ms, utils) {
    if (utils && typeof utils.sortMonths === "function") return utils.sortMonths(ms);
    return (Array.isArray(ms) ? ms.slice() : []).sort((a, b) => String(a).localeCompare(String(b)));
  }

  function uniq(arr) {
    const out = [];
    const seen = new Set();
    for (const v of arr || []) {
      const k = String(v);
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(v);
    }
    return out;
  }

  function clamp01(v) {
    const n = Number(v);
    if (!Number.isFinite(n)) return null;
    if (n < 0) return 0;
    if (n > 1) return 1;
    return n;
  }

  function safeNum(utils, v) {
    if (utils && typeof utils.safeNumber === "function") return utils.safeNumber(v);
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }

  function fmtPct(utils, v, digits) {
    if (utils && typeof utils.fmtPct === "function") return utils.fmtPct(v, digits);
    const n = Number(v);
    if (!Number.isFinite(n)) return "—";
    return `${(n * 100).toFixed(Number.isFinite(digits) ? digits : 2)}%`;
  }

  function pickLatestMonth(selectedMonths, utils, fallback) {
    const ms = sortMonths(uniq(selectedMonths), utils);
    if (!ms.length) return fallback || null;
    return ms[ms.length - 1];
  }

  function buildMonthlyAgg({ rawByMonth, months, countries, utils }) {
    const out = {}; // out[month][country] = { regSum, d1Sum, d7Sum, d1Rate, d7Rate }
    for (const m of months) {
      const rows = Array.isArray(rawByMonth && rawByMonth[m]) ? rawByMonth[m] : [];
      const byC = {};
      for (const c of countries) byC[c] = { reg: 0, d1: 0, d7: 0, has: false };

      for (const r of rows) {
        if (!r) continue;
        const c = String(r.country || "");
        if (!byC[c]) continue;

        const reg = safeNum(utils, r.registration);
        const d1 = safeNum(utils, r.D1_retained_users);
        const d7 = safeNum(utils, r.D7_retained_users);

        if (reg !== null) byC[c].reg += reg;
        if (d1 !== null) byC[c].d1 += d1;
        if (d7 !== null) byC[c].d7 += d7;
        if (reg !== null || d1 !== null || d7 !== null) byC[c].has = true;
      }

      out[m] = {};
      for (const c of countries) {
        const regSum = byC[c].reg;
        const d1Sum = byC[c].d1;
        const d7Sum = byC[c].d7;

        const d1Rate = regSum > 0 ? clamp01(d1Sum / regSum) : null;
        const d7Rate = regSum > 0 ? clamp01(d7Sum / regSum) : null;

        out[m][c] = { regSum, d1Sum, d7Sum, d1Rate, d7Rate, has: byC[c].has };
      }
    }
    return out;
  }

  function buildDailyAgg({ rawByMonth, months, countries, utils }) {
    const key = (date, country) => `${date}__${country}`;
    const bucket = new Map();
    const dateSet = new Set();

    for (const m of months) {
      const rows = Array.isArray(rawByMonth && rawByMonth[m]) ? rawByMonth[m] : [];
      for (const r of rows) {
        if (!r) continue;
        const c = String(r.country || "");
        if (!countries.includes(c)) continue;

        const date = String(r.date || "");
        if (!date) continue;

        dateSet.add(date);

        const k = key(date, c);
        const cur = bucket.get(k) || { reg: 0, d1: 0, d7: 0, has: false };

        const reg = safeNum(utils, r.registration);
        const d1 = safeNum(utils, r.D1_retained_users);
        const d7 = safeNum(utils, r.D7_retained_users);

        if (reg !== null) cur.reg += reg;
        if (d1 !== null) cur.d1 += d1;
        if (d7 !== null) cur.d7 += d7;
        if (reg !== null || d1 !== null || d7 !== null) cur.has = true;

        bucket.set(k, cur);
      }
    }

    const dates = Array.from(dateSet).sort((a, b) => String(a).localeCompare(String(b)));

    const out = { dates, byCountry: {} };
    for (const c of countries) {
      out.byCountry[c] = { D1: new Array(dates.length).fill(null), D7: new Array(dates.length).fill(null) };
    }

    for (let i = 0; i < dates.length; i++) {
      const d = dates[i];
      for (const c of countries) {
        const cur = bucket.get(key(d, c));
        if (!cur || !cur.has || !(cur.reg > 0)) continue;
        out.byCountry[c].D1[i] = clamp01(cur.d1 / cur.reg);
        out.byCountry[c].D7[i] = clamp01(cur.d7 / cur.reg);
      }
    }

    return out;
  }

  function colorPalette(n) {
    const out = [];
    for (let i = 0; i < n; i++) {
      const hue = (i * 47) % 360; // 稍微拉开
      out.push(`hsl(${hue} 72% 46%)`);
    }
    return out;
  }

  function setEmptyChart(chart, text) {
    if (!chart) return;
    chart.clear();
    chart.setOption({
      animation: false,
      title: {
        text: text || "暂无数据",
        left: "center",
        top: "middle",
        textStyle: { fontSize: 12, fontWeight: 500, color: "#6b7280" },
      },
    });
  }

  OVP.registerModule({
    id: MODULE_ID,
    title: "次留 / 七留留存率",
    subtitle: "口径：次留 = D1_retained_users/registration；七留 = D7_retained_users/registration（单位：%）",
    render({ mountEl, rawByMonth, months, latestMonth, utils }) {
      ensureStyle();

      if (!mountEl) return;
      const allMonths = Array.isArray(months) ? months.slice() : [];
      const monthList = sortMonths(allMonths, utils);
      const allCountries = COUNTRY_ORDER.slice();

      if (!rawByMonth || !monthList.length) {
        mountEl.innerHTML = `<div class="ovp-retention-empty">未检测到数据：请确认 data.js 暴露 RAW_ORGANIC_BY_MONTH 且存在月份 key。</div>`;
        return;
      }

      const defaultMonth = latestMonth || monthList[monthList.length - 1];
      const state = {
        chartType: "bar", // bar | line
        months: [defaultMonth],
        countries: allCountries.slice(),
        metrics: ["D1", "D7"],
      };

      const moduleUid = `ret-${Math.random().toString(16).slice(2)}`;
      mountEl.innerHTML = `
        <div class="ovp-retention" id="${moduleUid}">
          <div class="ovp-retention-filters">
            <div class="ovp-retention-filter-block">
              <div class="ovp-retention-filter-title">月份（多选）</div>
              <div class="ovp-retention-filter-options" data-role="months"></div>
            </div>

            <div class="ovp-retention-filter-block">
              <div class="ovp-retention-filter-title">国家（多选）</div>
              <div class="ovp-retention-filter-options" data-role="countries"></div>
            </div>

            <div class="ovp-retention-filter-block">
              <div class="ovp-retention-filter-title">图表</div>
              <div class="ovp-retention-filter-options" data-role="chartType"></div>
            </div>

            <div class="ovp-retention-filter-block">
              <div class="ovp-retention-filter-title">数据（多选）</div>
              <div class="ovp-retention-filter-options" data-role="metrics"></div>
            </div>
          </div>

          <div class="ovp-chart" style="height:360px;" data-role="chart"></div>

          <div class="ovp-retention-table-wrap">
            <table class="ovp-retention-table" data-role="table"></table>
          </div>

          <div class="ovp-retention-insight-head">
            <div class="ovp-retention-insight-title">数据分析</div>
            <div class="ovp-retention-insight-meta" data-role="insightMeta"></div>
          </div>
          <div class="ovp-insight" data-role="insight"></div>
        </div>
      `;

      const root = mountEl.querySelector(`#${moduleUid}`);
      const monthsEl = root.querySelector('[data-role="months"]');
      const countriesEl = root.querySelector('[data-role="countries"]');
      const chartTypeEl = root.querySelector('[data-role="chartType"]');
      const metricsEl = root.querySelector('[data-role="metrics"]');
      const chartDom = root.querySelector('[data-role="chart"]');
      const tableEl = root.querySelector('[data-role="table"]');
      const insightEl = root.querySelector('[data-role="insight"]');
      const insightMetaEl = root.querySelector('[data-role="insightMeta"]');

      // --- Render filter chips (一次渲染，后续靠 input 状态驱动) ---
      function renderMultiChips(container, opts) {
        const { values, selectedSet, name, labelOf } = opts;
        container.innerHTML = (values || [])
          .map((v, idx) => {
            const id = `${moduleUid}-${name}-${idx}`;
            const checked = selectedSet.has(String(v)) ? "checked" : "";
            return `
              <label class="ovp-retention-chip" for="${id}">
                <input id="${id}" type="checkbox" value="${String(v)}" ${checked} />
                <span>${labelOf ? labelOf(v) : String(v)}</span>
              </label>
            `;
          })
          .join("");
      }

      function renderRadioChips(container, opts) {
        const { values, selectedValue, name, labelOf } = opts;
        container.innerHTML = (values || [])
          .map((v, idx) => {
            const id = `${moduleUid}-${name}-${idx}`;
            const checked = String(v) === String(selectedValue) ? "checked" : "";
            return `
              <label class="ovp-retention-chip" for="${id}">
                <input id="${id}" type="radio" name="${moduleUid}-${name}" value="${String(v)}" ${checked} />
                <span>${labelOf ? labelOf(v) : String(v)}</span>
              </label>
            `;
          })
          .join("");
      }

      renderMultiChips(monthsEl, {
        values: monthList,
        selectedSet: new Set(state.months.map(String)),
        name: "month",
        labelOf: (m) => `${m}（${monthShort(m)}）`,
      });

      renderMultiChips(countriesEl, {
        values: allCountries,
        selectedSet: new Set(state.countries.map(String)),
        name: "country",
        labelOf: (c) => c,
      });

      renderRadioChips(chartTypeEl, {
        values: ["bar", "line"],
        selectedValue: state.chartType,
        name: "chartType",
        labelOf: (t) => (t === "bar" ? "月度柱状图" : "日级折线图"),
      });

      renderMultiChips(metricsEl, {
        values: METRICS.map((m) => m.key),
        selectedSet: new Set(state.metrics.map(String)),
        name: "metric",
        labelOf: (k) => (k === "D1" ? "次留（D1）" : "七留（D7）"),
      });

      // --- ECharts init ---
      let chart = null;
      if (window.echarts && chartDom) {
        chart = echarts.init(chartDom);
      } else {
        chartDom.innerHTML = `<div class="ovp-retention-empty">ECharts 未加载，图表无法渲染。</div>`;
      }

      // Resize handling
      try {
        if (chart && window.ResizeObserver) {
          const ro = new ResizeObserver(() => chart.resize());
          ro.observe(chartDom);
        } else if (chart) {
          window.addEventListener("resize", () => chart.resize(), { passive: true });
        }
      } catch (_e) {
        // ignore
      }

      // --- Read selections from DOM ---
      function readChecked(container) {
        return Array.from(container.querySelectorAll('input[type="checkbox"]:checked')).map((i) => i.value);
      }
      function readRadio(container) {
        const el = container.querySelector('input[type="radio"]:checked');
        return el ? el.value : null;
      }

      function enforceNotEmpty(next, prev) {
        const arr = Array.isArray(next) ? next : [];
        if (arr.length) return arr;
        return Array.isArray(prev) && prev.length ? prev : [];
      }

      // --- Render table ---
      function renderTable({ monthSel, countrySel, metricSel }) {
        const monthsSorted = sortMonths(monthSel, utils);
        const countriesOrdered = COUNTRY_ORDER.filter((c) => countrySel.includes(c));
        const metricsOrdered = ["D1", "D7"].filter((k) => metricSel.includes(k)); // 表格也随“数据”筛选联动

        const agg = buildMonthlyAgg({
          rawByMonth,
          months: monthsSorted,
          countries: countriesOrdered,
          utils,
        });

        const ths = [];
        ths.push(`<th style="min-width:70px;">国家</th>`);
        for (const m of monthsSorted) {
          for (const k of metricsOrdered) {
            const label = k === "D1" ? "自然量次留" : "自然量七留";
            ths.push(`<th class="num" style="min-width:140px;">${monthShort(m)}${label}</th>`);
          }
        }

        const trs = [];
        for (const c of countriesOrdered) {
          const tds = [];
          tds.push(`<td>${c}</td>`);
          for (const m of monthsSorted) {
            const cell = (agg[m] && agg[m][c]) ? agg[m][c] : null;
            for (const k of metricsOrdered) {
              const v = !cell ? null : (k === "D1" ? cell.d1Rate : cell.d7Rate);
              tds.push(`<td class="num">${fmtPct(utils, v, 2)}</td>`);
            }
          }
          trs.push(`<tr>${tds.join("")}</tr>`);
        }

        tableEl.innerHTML = `
          <thead><tr>${ths.join("")}</tr></thead>
          <tbody>${trs.join("")}</tbody>
        `;
      }

      // --- Render chart ---
      function renderChart({ chartType, monthSel, countrySel, metricSel }) {
        if (!chart) return;

        const monthsSorted = sortMonths(monthSel, utils);
        const countriesOrdered = COUNTRY_ORDER.filter((c) => countrySel.includes(c));
        const metricsOrdered = ["D1", "D7"].filter((k) => metricSel.includes(k));

        if (!monthsSorted.length || !countriesOrdered.length || !metricsOrdered.length) {
          setEmptyChart(chart, "筛选为空");
          return;
        }

        if (chartType === "bar") {
          const monthColors = {};
          const palette = colorPalette(monthsSorted.length);
          for (let i = 0; i < monthsSorted.length; i++) monthColors[monthsSorted[i]] = palette[i];

          const agg = buildMonthlyAgg({
            rawByMonth,
            months: monthsSorted,
            countries: countriesOrdered,
            utils,
          });

          const series = [];
          for (const m of monthsSorted) {
            const baseColor = monthColors[m];
            for (const k of metricsOrdered) {
              const isD7 = k === "D7";
              const name = `${monthShort(m)} ${isD7 ? "七留" : "次留"}`;

              series.push({
                name,
                type: "bar",
                barMaxWidth: 22,
                emphasis: { focus: "series" },
                itemStyle: {
                  color: baseColor,
                  decal: isD7
                    ? {
                        symbol: "rect",
                        symbolSize: 1,
                        dashArrayX: [6, 2],
                        dashArrayY: [2, 6],
                        rotation: Math.PI / 4,
                      }
                    : null,
                  borderRadius: [4, 4, 0, 0],
                },
                data: countriesOrdered.map((c) => {
                  const cell = (agg[m] && agg[m][c]) ? agg[m][c] : null;
                  return cell ? (isD7 ? cell.d7Rate : cell.d1Rate) : null;
                }),
              });
            }
          }

          const option = {
            animationDuration: 260,
            legend: {
              top: 6,
              left: 8,
              type: "scroll",
              textStyle: { fontSize: 11 },
            },
            grid: { left: 46, right: 18, top: 46, bottom: 40, containLabel: true },
            tooltip: {
              trigger: "axis",
              axisPointer: { type: "shadow" },
              formatter: function (params) {
                const ps = Array.isArray(params) ? params : [];
                if (!ps.length) return "";
                const head = ps[0].axisValue;
                const lines = ps.map((p) => {
                  const v = p && p.value;
                  const txt = (v === null || v === undefined || !Number.isFinite(Number(v))) ? "—" : `${(Number(v) * 100).toFixed(2)}%`;
                  return `${p.marker}${p.seriesName}：${txt}`;
                });
                return `${head}<br/>${lines.join("<br/>")}`;
              },
            },
            xAxis: {
              type: "category",
              data: countriesOrdered,
              axisTick: { alignWithLabel: true },
              axisLabel: { interval: 0 },
            },
            yAxis: {
              type: "value",
              min: 0,
              max: function (v) {
                const mx = v && Number.isFinite(v.max) ? v.max : 0;
                if (!(mx > 0)) return 1;
                const padded = Math.min(1, mx * 1.2);
                return Math.ceil(padded * 100) / 100;
              },
              axisLabel: {
                formatter: function (v) {
                  const n = Number(v);
                  if (!Number.isFinite(n)) return "";
                  return `${Math.round(n * 100)}%`;
                },
              },
              splitLine: { lineStyle: { color: "rgba(148, 163, 184, 0.25)" } },
            },
            series,
          };

          chart.setOption(option, true);
          return;
        }

        // line
        const daily = buildDailyAgg({
          rawByMonth,
          months: monthsSorted,
          countries: countriesOrdered,
          utils,
        });

        const dates = daily.dates || [];
        if (!dates.length) {
          setEmptyChart(chart, "所选月份无日级数据");
          return;
        }

        const countryColors = {};
        const palette = colorPalette(countriesOrdered.length);
        for (let i = 0; i < countriesOrdered.length; i++) countryColors[countriesOrdered[i]] = palette[i];

        const series = [];
        for (const c of countriesOrdered) {
          const baseColor = countryColors[c];
          for (const k of metricsOrdered) {
            const isD1 = k === "D1";
            const name = `${c} ${isD1 ? "次留" : "七留"}`;
            const arr = (daily.byCountry && daily.byCountry[c]) ? daily.byCountry[c][k] : [];

            series.push({
              name,
              type: "line",
              showSymbol: false,
              smooth: false,
              emphasis: { focus: "series" },
              lineStyle: {
                width: 2,
                type: isD1 ? "dashed" : "solid",
                color: baseColor,
              },
              itemStyle: { color: baseColor },
              data: Array.isArray(arr) ? arr : [],
            });
          }
        }

        const option = {
          animationDuration: 260,
          legend: {
            top: 6,
            left: 8,
            type: "scroll",
            textStyle: { fontSize: 11 },
          },
          grid: { left: 46, right: 18, top: 46, bottom: 78, containLabel: true },
          tooltip: {
            trigger: "axis",
            axisPointer: { type: "line" },
            formatter: function (params) {
              const ps = Array.isArray(params) ? params : [];
              if (!ps.length) return "";
              const head = ps[0].axisValue;
              const lines = ps.map((p) => {
                const v = p && p.value;
                const txt = (v === null || v === undefined || !Number.isFinite(Number(v))) ? "—" : `${(Number(v) * 100).toFixed(2)}%`;
                return `${p.marker}${p.seriesName}：${txt}`;
              });
              return `${head}<br/>${lines.join("<br/>")}`;
            },
          },
          dataZoom: [
            { type: "inside", xAxisIndex: 0, filterMode: "none" },
            { type: "slider", xAxisIndex: 0, height: 18, bottom: 10 },
          ],
          xAxis: {
            type: "category",
            data: dates,
            boundaryGap: false,
            axisLabel: {
              formatter: function (v) {
                const s = String(v || "");
                return s.length >= 10 ? s.slice(5) : s;
              },
            },
          },
          yAxis: {
            type: "value",
            min: 0,
            max: function (v) {
              const mx = v && Number.isFinite(v.max) ? v.max : 0;
              if (!(mx > 0)) return 1;
              const padded = Math.min(1, mx * 1.2);
              return Math.ceil(padded * 100) / 100;
            },
            axisLabel: {
              formatter: function (v) {
                const n = Number(v);
                if (!Number.isFinite(n)) return "";
                return `${Math.round(n * 100)}%`;
              },
            },
            splitLine: { lineStyle: { color: "rgba(148, 163, 184, 0.25)" } },
          },
          series,
        };

        chart.setOption(option, true);
      }

      // --- Insight ---
      function renderInsight(monthForInsight) {
        const m = monthForInsight || null;
        const meta = m ? `${m}（${monthShort(m)}）` : "—";
        insightMetaEl.textContent = `解读月份：${meta}`;

        if (OVP.ui && typeof OVP.ui.renderInsight === "function") {
          OVP.ui.renderInsight({ moduleId: MODULE_ID, month: m, el: insightEl });
          return;
        }
        // fallback
        const text = (typeof OVP.getInsight === "function" ? OVP.getInsight(MODULE_ID, m) : "") || "";
        insightEl.textContent = (text || "").trim() ? text : "文案待填写：./insights.js";
        if (!text.trim()) insightEl.classList.add("is-empty");
        else insightEl.classList.remove("is-empty");
      }

      // --- Unified update ---
      function updateAll() {
        const prevMonths = state.months.slice();
        const prevCountries = state.countries.slice();
        const prevMetrics = state.metrics.slice();

        const nextMonths = enforceNotEmpty(readChecked(monthsEl), prevMonths);
        const nextCountries = enforceNotEmpty(readChecked(countriesEl), prevCountries);
        const nextMetrics = enforceNotEmpty(readChecked(metricsEl), prevMetrics);

        // 如果用户把最后一个取消了，就把它勾回去（保持不空）
        if (!nextMonths.length) {
          const inputs = monthsEl.querySelectorAll('input[type="checkbox"]');
          if (inputs[0]) inputs[0].checked = true;
        }
        if (!nextCountries.length) {
          const inputs = countriesEl.querySelectorAll('input[type="checkbox"]');
          if (inputs[0]) inputs[0].checked = true;
        }
        if (!nextMetrics.length) {
          const inputs = metricsEl.querySelectorAll('input[type="checkbox"]');
          if (inputs[0]) inputs[0].checked = true;
        }

        state.months = nextMonths;
        state.countries = nextCountries;
        state.metrics = nextMetrics;

        const nextChartType = readRadio(chartTypeEl) || state.chartType;
        state.chartType = nextChartType;

        renderChart({
          chartType: state.chartType,
          monthSel: state.months,
          countrySel: state.countries,
          metricSel: state.metrics,
        });

        renderTable({
          monthSel: state.months,
          countrySel: state.countries,
          metricSel: state.metrics,
        });

        const insightMonth = pickLatestMonth(state.months, utils, defaultMonth);
        renderInsight(insightMonth);
      }

      // --- Bind events ---
      function bindNotEmpty(container, keyName) {
        container.addEventListener("change", function (e) {
          const t = e && e.target;
          if (!t || t.tagName !== "INPUT") return;

          if (t.type === "checkbox") {
            const checked = readChecked(container);
            if (!checked.length) {
              // 不能清空
              t.checked = true;
              return;
            }
          }
          updateAll();
        });
      }

      bindNotEmpty(monthsEl, "months");
      bindNotEmpty(countriesEl, "countries");
      bindNotEmpty(metricsEl, "metrics");

      chartTypeEl.addEventListener("change", function (e) {
        const t = e && e.target;
        if (!t || t.tagName !== "INPUT") return;
        updateAll();
      });

      // initial
      updateAll();
    },
  });
})();
