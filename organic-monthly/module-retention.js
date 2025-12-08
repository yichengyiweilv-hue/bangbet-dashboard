// organic-monthly/module-retention.js
(function () {
  const moduleId = "retention";

  const COUNTRY_ORDER = ["GH", "KE", "NG", "TZ", "UG"];
  const METRICS = [
    { key: "D1", label: "次留", field: "D1_retained_users", lineType: "dashed", isHatched: false },
    { key: "D7", label: "七留", field: "D7_retained_users", lineType: "solid", isHatched: true },
  ];

  // 固定国家配色（折线图：同国家次留/七留共用一个颜色）
  function getCssVar(name, fallback = "") {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }
  const COUNTRY_COLOR = {
    GH: getCssVar("--ovp-blue", "#2563eb"),
    KE: getCssVar("--ovp-yellow", "#F6C344"),
    NG: "#22c55e",
    TZ: "#a855f7",
    UG: "#ef4444",
  };

  let chart = null;
  let resizeObs = null;
  let state = null;
  let els = null;

  function ensureStyleOnce() {
    const id = "ovp-style-retention";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      .ovp-filter-panel{
        border:1px solid rgba(148, 163, 184, 0.60);
        border-radius:12px;
        background: rgba(249, 250, 251, 0.90);
        padding:10px 12px;
        display:flex;
        flex-wrap:wrap;
        gap:12px 14px;
        align-items:flex-start;
      }
      .ovp-filter-group{ display:flex; flex-direction:column; gap:6px; }
      .ovp-filter-title{ font-size:11px; color:var(--muted); line-height:1.3; }
      .ovp-filter-options{ display:flex; flex-wrap:wrap; gap:8px; }
      .ovp-chip{
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
        color:var(--text);
        line-height:1;
        white-space:nowrap;
      }
      .ovp-chip:hover{ border-color: rgba(148, 163, 184, 0.85); }
      .ovp-chip input{ margin:0; }

      .ovp-table-wrap{
        border:1px solid rgba(148, 163, 184, 0.60);
        border-radius:12px;
        background:#fff;
        overflow:hidden;
      }
      .ovp-table-scroll{ overflow:auto; max-width:100%; }
      table.ovp-table{
        width:100%;
        border-collapse:collapse;
        font-size:12px;
      }
      table.ovp-table th, table.ovp-table td{
        padding:8px 10px;
        text-align:center;
        vertical-align:middle;
        border-bottom:1px solid rgba(148, 163, 184, 0.25);
        border-right:1px solid rgba(148, 163, 184, 0.18);
        white-space:nowrap;
      }
      table.ovp-table th{
        position:sticky;
        top:0;
        z-index:2;
        background: rgba(249, 250, 251, 0.98);
        color:var(--muted);
        font-size:11px;
        font-weight:600;
      }
      table.ovp-table th.sticky-col, table.ovp-table td.sticky-col{
        position:sticky;
        left:0;
        z-index:3;
        background: rgba(249, 250, 251, 0.98);
        color:var(--text);
        font-weight:600;
      }
      table.ovp-table td{
        background:#fff;
        font-weight:500;
      }
      table.ovp-table tr:last-child td{ border-bottom:none; }
      table.ovp-table th:last-child, table.ovp-table td:last-child{ border-right:none; }

      .ovp-mini-hint{ font-size:11px; color:var(--muted); line-height:1.4; }
    `;
    document.head.appendChild(style);
  }

  function uniq(arr) {
    return Array.from(new Set((arr || []).filter(Boolean)));
  }

  function safeNum(v, fallback = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }

  function ensureAtLeastOne(selected, fallbackOne) {
    if (selected.length > 0) return selected;
    return fallbackOne ? [fallbackOne] : [];
  }

  function sortedMonths(ms) {
    return (window.OVP?.utils?.sortMonths ? OVP.utils.sortMonths(ms) : (ms || []).slice().sort());
  }

  function getMonthPalette(monthsSortedAsc) {
    const baseBlue = getCssVar("--ovp-blue", "#2563eb");
    const baseYellow = getCssVar("--ovp-yellow", "#F6C344");
    const palette = [baseBlue, baseYellow, "#22c55e", "#a855f7", "#ef4444", "#0ea5e9", "#14b8a6", "#f97316"];
    const map = {};
    monthsSortedAsc.forEach((m, i) => (map[m] = palette[i % palette.length]));
    return map;
  }

  function makeHatch(ec, baseColor) {
    if (!ec || !ec.graphic || !ec.graphic.Pattern) return baseColor;

    const size = 12;
    const c = document.createElement("canvas");
    c.width = size;
    c.height = size;
    const g = c.getContext("2d");
    if (!g) return baseColor;

    g.fillStyle = baseColor;
    g.fillRect(0, 0, size, size);

    g.strokeStyle = "rgba(255,255,255,0.55)";
    g.lineWidth = 2;

    // 三条斜线，保证视觉稳定
    g.beginPath();
    g.moveTo(-2, size - 2);
    g.lineTo(size - 2, -2);
    g.stroke();

    g.beginPath();
    g.moveTo(0, size);
    g.lineTo(size, 0);
    g.stroke();

    g.beginPath();
    g.moveTo(2, size + 2);
    g.lineTo(size + 2, 2);
    g.stroke();

    return new ec.graphic.Pattern(c, "repeat");
  }

  function computeMonthlyAgg(rawByMonth, months, countries) {
    const out = {};
    (months || []).forEach((m) => {
      const rows = Array.isArray(rawByMonth?.[m]) ? rawByMonth[m] : [];
      const byCountry = {};
      countries.forEach((c) => (byCountry[c] = { reg: 0, D1: 0, D7: 0 }));
      rows.forEach((r) => {
        const c = String(r?.country || "");
        if (!countries.includes(c)) return;
        const reg = safeNum(r?.registration, 0);
        const d1 = safeNum(r?.D1_retained_users, 0);
        const d7 = safeNum(r?.D7_retained_users, 0);
        if (!byCountry[c]) byCountry[c] = { reg: 0, D1: 0, D7: 0 };
        byCountry[c].reg += reg;
        byCountry[c].D1 += d1;
        byCountry[c].D7 += d7;
      });

      const rates = {};
      countries.forEach((c) => {
        const reg = byCountry[c]?.reg || 0;
        rates[c] = {
          reg,
          D1: reg > 0 ? (byCountry[c].D1 || 0) / reg : null,
          D7: reg > 0 ? (byCountry[c].D7 || 0) / reg : null,
        };
      });

      out[m] = rates;
    });
    return out;
  }

  function computeDailyRates(rawByMonth, months, countries) {
    const rows = [];
    (months || []).forEach((m) => {
      const arr = Array.isArray(rawByMonth?.[m]) ? rawByMonth[m] : [];
      arr.forEach((r) => {
        const c = String(r?.country || "");
        if (!countries.includes(c)) return;
        const date = String(r?.date || "");
        if (!date) return;
        rows.push({
          date,
          country: c,
          reg: safeNum(r?.registration, 0),
          D1: safeNum(r?.D1_retained_users, 0),
          D7: safeNum(r?.D7_retained_users, 0),
        });
      });
    });

    const dates = uniq(rows.map((r) => r.date)).sort((a, b) => String(a).localeCompare(String(b)));
    const map = new Map(); // key: date|country
    rows.forEach((r) => {
      map.set(`${r.date}|${r.country}`, r);
    });

    // seriesData[country][metricKey] = number[] (aligned to dates)
    const seriesData = {};
    countries.forEach((c) => {
      seriesData[c] = { D1: [], D7: [] };
      dates.forEach((d) => {
        const row = map.get(`${d}|${c}`);
        if (!row || row.reg <= 0) {
          seriesData[c].D1.push(null);
          seriesData[c].D7.push(null);
          return;
        }
        seriesData[c].D1.push(row.D1 / row.reg);
        seriesData[c].D7.push(row.D7 / row.reg);
      });
    });

    return { dates, seriesData };
  }

  function buildBarOption(ctx, monthsAsc, countries, metricKeys, monthlyAgg) {
    const ec = window.echarts;
    const monthColors = getMonthPalette(monthsAsc);

    const series = [];
    monthsAsc.forEach((m) => {
      const baseColor = monthColors[m];
      metricKeys.forEach((mk) => {
        const metric = METRICS.find((x) => x.key === mk);
        if (!metric) return;

        const isD7 = metric.key === "D7";
        const color = isD7 ? makeHatch(ec, baseColor) : baseColor;

        series.push({
          name: `${m} ${metric.label}`,
          type: "bar",
          barMaxWidth: 22,
          itemStyle: { color },
          emphasis: { focus: "series" },
          data: countries.map((c) => monthlyAgg?.[m]?.[c]?.[metric.key] ?? null),
        });
      });
    });

    return {
      animationDuration: 250,
      grid: { left: 50, right: 18, top: 40, bottom: 46, containLabel: true },
      legend: {
        type: "scroll",
        top: 6,
        left: 6,
        right: 6,
        itemHeight: 10,
        textStyle: { fontSize: 11 },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        valueFormatter: (v) => (v == null ? "—" : `${(Number(v) * 100).toFixed(2)}%`),
      },
      xAxis: {
        type: "category",
        data: countries,
        axisTick: { alignWithLabel: true },
        axisLabel: { fontSize: 11 },
      },
      yAxis: {
        type: "value",
        min: 0,
        max: (v) => {
          const m = v.max;
          if (!Number.isFinite(m)) return 1;
          if (m <= 1) return 1;
          return m;
        },
        axisLabel: { formatter: (v) => `${(Number(v) * 100).toFixed(0)}%`, fontSize: 11 },
        splitLine: { lineStyle: { color: "rgba(148,163,184,0.22)" } },
      },
      series,
    };
  }

  function buildLineOption(ctx, dates, countries, metricKeys, daily) {
    const series = [];
    countries.forEach((c) => {
      const baseColor = COUNTRY_COLOR[c] || getCssVar("--ovp-blue", "#2563eb");
      metricKeys.forEach((mk) => {
        const metric = METRICS.find((x) => x.key === mk);
        if (!metric) return;

        series.push({
          name: `${c} ${metric.label}`,
          type: "line",
          showSymbol: false,
          connectNulls: false,
          emphasis: { focus: "series" },
          lineStyle: { type: metric.lineType, width: 2, color: baseColor },
          itemStyle: { color: baseColor },
          data: daily?.seriesData?.[c]?.[metric.key] || [],
        });
      });
    });

    return {
      animationDuration: 250,
      grid: { left: 50, right: 18, top: 40, bottom: 54, containLabel: true },
      legend: {
        type: "scroll",
        top: 6,
        left: 6,
        right: 6,
        itemHeight: 10,
        textStyle: { fontSize: 11 },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "line" },
        valueFormatter: (v) => (v == null ? "—" : `${(Number(v) * 100).toFixed(2)}%`),
      },
      xAxis: {
        type: "category",
        data: dates,
        axisLabel: {
          fontSize: 10,
          formatter: (v) => {
            const s = String(v);
            return s.length >= 10 ? s.slice(5) : s;
          },
        },
      },
      yAxis: {
        type: "value",
        min: 0,
        max: (v) => {
          const m = v.max;
          if (!Number.isFinite(m)) return 1;
          if (m <= 1) return 1;
          return m;
        },
        axisLabel: { formatter: (v) => `${(Number(v) * 100).toFixed(0)}%`, fontSize: 11 },
        splitLine: { lineStyle: { color: "rgba(148,163,184,0.22)" } },
      },
      series,
    };
  }

  function renderTable(monthsAsc, countries, metricKeys, monthlyAgg) {
    const fmtPct = (v) => (window.OVP?.utils?.fmtPct ? OVP.utils.fmtPct(v, 2) : (v == null ? "—" : `${(v * 100).toFixed(2)}%`));

    const headCols = [];
    monthsAsc.forEach((m) => {
      metricKeys.forEach((mk) => {
        const metric = METRICS.find((x) => x.key === mk);
        if (!metric) return;
        headCols.push({ key: `${m}_${mk}`, label: `${m} 自然量${metric.label}` });
      });
    });

    const thead = `
      <thead>
        <tr>
          <th class="sticky-col">国家</th>
          ${headCols.map((c) => `<th>${c.label}</th>`).join("")}
        </tr>
      </thead>
    `;

    const tbodyRows = countries
      .map((country) => {
        const tds = headCols
          .map((hc) => {
            const [m, mk] = hc.key.split("_");
            const val = monthlyAgg?.[m]?.[country]?.[mk] ?? null;
            return `<td>${fmtPct(val)}</td>`;
          })
          .join("");
        return `<tr><td class="sticky-col">${country}</td>${tds}</tr>`;
      })
      .join("");

    const tbody = `<tbody>${tbodyRows}</tbody>`;
    return `<table class="ovp-table">${thead}${tbody}</table>`;
  }

  function renderInsightBox(moduleId, monthsAsc, insightEl) {
    if (!insightEl) return;
    const pickMonths = monthsAsc.length ? monthsAsc : [];
    const parts = pickMonths
      .map((m) => {
        const t = (window.OVP?.getInsight ? OVP.getInsight(moduleId, m) : "").trim();
        return t ? `${m}\n${t}` : "";
      })
      .filter(Boolean);

    const fallbackMonth = pickMonths[pickMonths.length - 1];
    const fallbackText = (window.OVP?.getInsight ? OVP.getInsight(moduleId, fallbackMonth) : "").trim();

    const text = (parts.length ? parts.join("\n\n") : fallbackText).trim();
    if (!text) {
      insightEl.textContent = "文案待填写：./insights.js";
      insightEl.classList.add("is-empty");
      return;
    }
    insightEl.textContent = text;
    insightEl.classList.remove("is-empty");
  }

  function mountLayout(mountEl, chartHeight = 340) {
    mountEl.innerHTML = `
      <div class="ovp-module-stack">
        <div class="ovp-filter-panel" id="filters-${moduleId}"></div>

        <div>
          <div class="ovp-chart is-empty" id="chart-${moduleId}" style="height:${chartHeight}px;">
            <div class="ovp-skeleton" aria-hidden="true"></div>
          </div>
          <div class="ovp-chart-note" id="chart-note-${moduleId}"></div>
        </div>

        <div class="ovp-table-wrap">
          <div class="ovp-table-scroll" id="table-wrap-${moduleId}"></div>
        </div>

        <div class="ovp-insight is-empty" id="insight-${moduleId}">文案待填写：./insights.js</div>
      </div>
    `;

    return {
      filtersEl: mountEl.querySelector(`#filters-${moduleId}`),
      chartEl: mountEl.querySelector(`#chart-${moduleId}`),
      chartNoteEl: mountEl.querySelector(`#chart-note-${moduleId}`),
      tableWrapEl: mountEl.querySelector(`#table-wrap-${moduleId}`),
      insightEl: mountEl.querySelector(`#insight-${moduleId}`),
    };
  }

  function buildFiltersHTML(ctx) {
    const monthsAll = Array.isArray(ctx?.months) ? ctx.months.slice() : [];
    const monthsDesc = monthsAll.sort((a, b) => String(b).localeCompare(String(a)));
    const countriesAll = COUNTRY_ORDER.slice();
    const metricAll = METRICS.map((m) => m.key);

    const isChecked = (group, v) => {
      const arr = state?.[group] || [];
      return arr.includes(v) ? "checked" : "";
    };
    const isRadio = (v) => (state?.chartType === v ? "checked" : "");

    const monthChips = monthsDesc
      .map(
        (m) => `
        <label class="ovp-chip">
          <input type="checkbox" data-filter="months" value="${m}" ${isChecked("months", m)} />
          <span>${m}</span>
        </label>
      `
      )
      .join("");

    const countryChips = countriesAll
      .map(
        (c) => `
        <label class="ovp-chip">
          <input type="checkbox" data-filter="countries" value="${c}" ${isChecked("countries", c)} />
          <span>${c}</span>
        </label>
      `
      )
      .join("");

    const metricChips = metricAll
      .map((mk) => {
        const m = METRICS.find((x) => x.key === mk);
        return `
        <label class="ovp-chip">
          <input type="checkbox" data-filter="metrics" value="${mk}" ${isChecked("metrics", mk)} />
          <span>${m ? m.label : mk}</span>
        </label>
      `;
      })
      .join("");

    const chartTypeChips = `
      <label class="ovp-chip">
        <input type="radio" name="chartType-${moduleId}" data-filter="chartType" value="bar" ${isRadio("bar")} />
        <span>月度柱状图</span>
      </label>
      <label class="ovp-chip">
        <input type="radio" name="chartType-${moduleId}" data-filter="chartType" value="line" ${isRadio("line")} />
        <span>日级折线图</span>
      </label>
    `;

    return `
      <div class="ovp-filter-group" style="min-width: 300px;">
        <div class="ovp-filter-title">月份（多选）</div>
        <div class="ovp-filter-options">${monthChips || `<span class="ovp-mini-hint">无可选月份</span>`}</div>
      </div>

      <div class="ovp-filter-group" style="min-width: 220px;">
        <div class="ovp-filter-title">国家（多选）</div>
        <div class="ovp-filter-options">${countryChips}</div>
      </div>

      <div class="ovp-filter-group" style="min-width: 200px;">
        <div class="ovp-filter-title">图表（单选）</div>
        <div class="ovp-filter-options">${chartTypeChips}</div>
      </div>

      <div class="ovp-filter-group" style="min-width: 220px;">
        <div class="ovp-filter-title">指标（多选）</div>
        <div class="ovp-filter-options">${metricChips}</div>
      </div>
    `;
  }

  function ensureChartInstance(chartEl) {
    const ec = window.echarts;
    if (!ec) return null;

    // 清理骨架
    if (chartEl.classList.contains("is-empty")) {
      chartEl.classList.remove("is-empty");
      chartEl.innerHTML = "";
    } else {
      const sk = chartEl.querySelector(".ovp-skeleton");
      if (sk) chartEl.innerHTML = "";
    }

    if (chart && chart.getDom && chart.getDom() === chartEl) return chart;
    if (chart) {
      try {
        chart.dispose();
      } catch (_) {}
      chart = null;
    }
    chart = ec.init(chartEl);

    // 自适应
    try {
      if (resizeObs) resizeObs.disconnect();
    } catch (_) {}
    resizeObs = null;

    if (window.ResizeObserver) {
      resizeObs = new ResizeObserver(() => {
        try {
          chart && chart.resize();
        } catch (_) {}
      });
      resizeObs.observe(chartEl);
    } else {
      // 兜底：窗口 resize
      if (!window.__ovp_retention_resize_bound) {
        window.__ovp_retention_resize_bound = true;
        window.addEventListener(
          "resize",
          () => {
            try {
              chart && chart.resize();
            } catch (_) {}
          },
          { passive: true }
        );
      }
    }

    return chart;
  }

  function update(ctx) {
    if (!els) return;
    const rawByMonth = ctx?.rawByMonth || {};
    const monthsAsc = sortedMonths(state.months);
    const countries = COUNTRY_ORDER.filter((c) => state.countries.includes(c));
    const metricKeys = METRICS.map((m) => m.key).filter((k) => state.metrics.includes(k));

    // 计算
    const monthlyAgg = computeMonthlyAgg(rawByMonth, monthsAsc, countries);

    // 表
    els.tableWrapEl.innerHTML =
      monthsAsc.length && countries.length && metricKeys.length
        ? renderTable(monthsAsc, countries, metricKeys, monthlyAgg)
        : `<div class="ovp-alert" style="margin:10px 12px;">无可展示数据：请至少选择 1 个国家、1 个月份、1 个指标。</div>`;

    // 文案
    renderInsightBox(moduleId, monthsAsc, els.insightEl);

    // 图 + note
    if (!window.echarts) {
      els.chartEl.classList.remove("is-empty");
      els.chartEl.innerHTML = `<div class="ovp-alert" style="margin:10px 12px;">ECharts 未加载：请检查网络/CDN。</div>`;
      els.chartNoteEl.textContent = "口径：次留=D1_retained_users/registration；七留=D7_retained_users/registration（单位：%）。";
      return;
    }

    const ch = ensureChartInstance(els.chartEl);
    if (!ch) return;

    let option = null;
    if (state.chartType === "line") {
      const daily = computeDailyRates(rawByMonth, monthsAsc, countries);
      option = buildLineOption(ctx, daily.dates, countries, metricKeys, daily);
      els.chartNoteEl.textContent = `口径：次留=D1_retained_users/registration；七留=D7_retained_users/registration（单位：%）。日级：按注册日 cohort 计算；次留=虚线，七留=实线。`;
    } else {
      option = buildBarOption(ctx, monthsAsc, countries, metricKeys, monthlyAgg);
      els.chartNoteEl.textContent = `口径：次留=D1_retained_users/registration；七留=D7_retained_users/registration（单位：%）。柱状：同月同色，七留加斜线阴影。`;
    }

    ch.setOption(option, true);
  }

  function bindFilterEvents(ctx) {
    if (!els?.filtersEl) return;

    els.filtersEl.addEventListener("change", (e) => {
      const t = e.target;
      if (!t || t.tagName !== "INPUT") return;

      const filter = t.getAttribute("data-filter");
      const value = t.value;

      if (filter === "chartType") {
        state.chartType = value === "line" ? "line" : "bar";
        update(ctx);
        return;
      }

      const group = filter; // months / countries / metrics
      if (!["months", "countries", "metrics"].includes(group)) return;

      const next = new Set(state[group] || []);
      if (t.checked) next.add(value);
      else next.delete(value);

      let nextArr = Array.from(next);

      // 至少保留一个选项，避免空画板
      if (group === "months") {
        nextArr = ensureAtLeastOne(nextArr, ctx.latestMonth);
      } else if (group === "countries") {
        nextArr = ensureAtLeastOne(nextArr, COUNTRY_ORDER[0]);
      } else if (group === "metrics") {
        nextArr = ensureAtLeastOne(nextArr, "D1");
      }

      // 如果这次是“把最后一个取消”，需要把 UI 勾回去
      if ((state[group] || []).length === 1 && nextArr.length === 1 && !t.checked) {
        t.checked = true;
        return;
      }

      state[group] = nextArr;

      // 让 filter UI 同步一次（主要是“最后一个不可取消”的回滚场景）
      els.filtersEl.innerHTML = buildFiltersHTML(ctx);

      update(ctx);
    });
  }

  function initState(ctx) {
    const monthsAll = Array.isArray(ctx?.months) ? ctx.months : [];
    const latest = ctx?.latestMonth || monthsAll[monthsAll.length - 1];

    return {
      chartType: "bar",
      months: latest ? [latest] : monthsAll.slice(-1),
      countries: COUNTRY_ORDER.slice(),
      metrics: ["D1", "D7"],
    };
  }

  OVP.registerModule({
    id: moduleId,
    title: "次日 / 7 日留存率",
    subtitle: "口径：次留=D1_retained_users/registration；七留=D7_retained_users/registration（单位：%）",
    span: "full",

    render(ctx) {
      ensureStyleOnce();
      state = initState(ctx);
      els = mountLayout(ctx.mountEl, 360);

      els.filtersEl.innerHTML = buildFiltersHTML(ctx);
      bindFilterEvents(ctx);

      update(ctx);
    },
  });
})();
