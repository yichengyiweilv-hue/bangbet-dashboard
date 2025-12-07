/**
 * paid-module-pay-rate.js
 * ------------------------------------------------------------
 * 模块3：D0/D7 付费率
 *  - 月度柱状图 / 日级折线图
 *  - 月份最多选 3 个
 *  - D0/D7 多选
 *  - D7 柱子使用“斜线阴影（hatch）”与 D0 区分（ECharts decal）
 *  - 自动生成明细表（随筛选联动）
 *
 * 依赖：
 *  - window.RAW_PAID_BY_MONTH（来自 paid-data.js）
 *  - window.echarts
 *  - （可选）window.PaidDashboard（用于 registerModule / registerChart / 格式化）
 *
 * 约定 DOM：
 *  - 图表容器：#chart-paid-pay-rate
 *  - 卡片容器：#card-paid-pay-rate
 */

(function () {
  "use strict";

  const MODULE_KEY = "pay_rate";
  const CARD_ID = "card-paid-pay-rate";
  const CHART_ID = "chart-paid-pay-rate";

  // 本模块柱状图国家固定顺序
  const COUNTRY_ORDER = ["GH", "KE", "NG", "TZ"];

  // ---- utils ----
  const isFiniteNumber = (v) => typeof v === "number" && isFinite(v);

  function safeDiv(a, b) {
    const na = Number(a);
    const nb = Number(b);
    if (!isFinite(na) || !isFinite(nb) || nb === 0) return null;
    return na / nb;
  }

  function uniq(arr) {
    const out = [];
    const seen = new Set();
    (arr || []).forEach((v) => {
      const k = String(v);
      if (seen.has(k)) return;
      seen.add(k);
      out.push(v);
    });
    return out;
  }

  function sortByOrder(list, orderArr) {
    const idx = new Map(orderArr.map((k, i) => [k, i]));
    return (list || []).slice().sort((a, b) => {
      const ia = idx.has(a) ? idx.get(a) : 999;
      const ib = idx.has(b) ? idx.get(b) : 999;
      if (ia !== ib) return ia - ib;
      return String(a).localeCompare(String(b));
    });
  }

  function formatMonthLabel(monthKey) {
    if (window.PaidDashboard && typeof window.PaidDashboard.formatMonthLabel === "function") {
      return window.PaidDashboard.formatMonthLabel(monthKey);
    }
    if (!monthKey || typeof monthKey !== "string") return "";
    const parts = monthKey.split("-");
    const mm = parts[1] || monthKey;
    const mNum = parseInt(mm, 10) || 0;
    return (mNum > 0 ? mNum : mm) + "月";
  }

  function formatPct01(v, digits) {
    if (window.PaidDashboard && typeof window.PaidDashboard.formatPct01 === "function") {
      return window.PaidDashboard.formatPct01(v, digits);
    }
    const d = typeof digits === "number" ? digits : 1;
    if (v == null || !isFinite(v)) return "-";
    return (Number(v) * 100).toFixed(d) + "%";
  }

  function ensureOnceStyle() {
    const STYLE_ID = "paid-module-pay-rate-style";
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      /* 模块内筛选区（尽量复用现有 class，这里只补少量间距/表格样式） */
      #${CARD_ID} .module-local-filters{
        padding: 10px 16px 12px;
        border-top: 1px dashed rgba(148, 163, 184, 0.45);
        border-bottom: 1px dashed rgba(148, 163, 184, 0.35);
        margin: 0 0 10px;
      }
      #${CARD_ID} .module-local-filters .hero-filter-row{
        margin: 6px 0;
      }
      #${CARD_ID} .paid-table-wrap{
        padding: 10px 16px 14px;
        border-top: 1px dashed rgba(148, 163, 184, 0.35);
      }
      #${CARD_ID} .paid-table-title{
        font-size: 12px;
        font-weight: 600;
        color: var(--text-main);
        display:flex;
        align-items:center;
        gap: 8px;
        margin: 2px 0 8px;
      }
      #${CARD_ID} .paid-table-subtitle{
        font-size: 10px;
        color: var(--text-sub);
        margin-left: auto;
        font-weight: 500;
      }
      #${CARD_ID} .paid-table-scroll{
        overflow: auto;
        border-radius: 12px;
        border: 1px solid rgba(148, 163, 184, 0.35);
        background: rgba(255,255,255,0.82);
      }
      #${CARD_ID} table.paid-table{
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        font-size: 11px;
      }
      #${CARD_ID} table.paid-table thead th{
        position: sticky;
        top: 0;
        background: rgba(255,255,255,0.92);
        backdrop-filter: blur(10px);
        font-weight: 600;
        color: #334155;
        text-align: right;
        padding: 8px 10px;
        border-bottom: 1px solid rgba(148, 163, 184, 0.45);
        white-space: nowrap;
      }
      #${CARD_ID} table.paid-table tbody td{
        padding: 8px 10px;
        border-bottom: 1px solid rgba(148, 163, 184, 0.28);
        text-align: right;
        white-space: nowrap;
        color: #0f172a;
      }
      #${CARD_ID} table.paid-table thead th:first-child,
      #${CARD_ID} table.paid-table tbody td:first-child{
        text-align: left;
      }
      #${CARD_ID} table.paid-table tbody tr:hover td{
        background: rgba(37, 99, 235, 0.06);
      }
      #${CARD_ID} .muted{
        color: var(--text-sub);
      }
    `;
    document.head.appendChild(style);
  }

  function getRaw() {
    return window.RAW_PAID_BY_MONTH || {};
  }

  function getAllMonths(raw) {
    return Object.keys(raw || {}).sort();
  }

  function getDistinct(raw, key) {
    const s = new Set();
    Object.keys(raw || {}).forEach((m) => {
      (raw[m] || []).forEach((r) => {
        if (!r) return;
        const v = r[key];
        if (v == null) return;
        s.add(String(v));
      });
    });
    return Array.from(s);
  }

  function normalizeSelection(state, opts) {
    // months：最多 3
    const allMonths = opts.allMonths;
    state.months = (state.months || []).filter((m) => allMonths.includes(m));
    if (!state.months.length && allMonths.length) {
      state.months = [allMonths[allMonths.length - 1]];
    }
    if (state.months.length > 3) state.months = state.months.slice(-3);

    // country/media/productType：空则全选
    if (!Array.isArray(state.countries) || !state.countries.length) {
      state.countries = opts.countries.slice();
    }
    if (!Array.isArray(state.medias) || !state.medias.length) {
      state.medias = opts.medias.slice();
    }
    if (!Array.isArray(state.productTypes) || !state.productTypes.length) {
      state.productTypes = opts.productTypes.slice();
    }

    // noSplit：勾上时强制全选
    if (state.countryNoSplit) state.countries = opts.countries.slice();
    if (state.mediaNoSplit) state.medias = opts.medias.slice();
    if (state.productNoSplit) state.productTypes = opts.productTypes.slice();

    // windows
    const allowedW = ["D0", "D7"];
    state.windows = uniq((state.windows || []).filter((w) => allowedW.includes(w)));
    if (!state.windows.length) state.windows = ["D0", "D7"];

    // chartType
    if (state.chartType !== "bar" && state.chartType !== "line") state.chartType = "bar";
  }

  function createChip(labelText, checked, onChange, disabled) {
    const label = document.createElement("label");
    label.className = "filter-chip" + (checked ? " filter-chip-active" : "");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = !!checked;
    input.disabled = !!disabled;

    const span = document.createElement("span");
    span.textContent = labelText;

    input.addEventListener("change", () => {
      if (typeof onChange === "function") onChange(input.checked, input);
      label.classList.toggle("filter-chip-active", input.checked);
    });

    label.appendChild(input);
    label.appendChild(span);
    return label;
  }

  function createRadio(name, labelText, value, checked, onChange) {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "radio";
    input.name = name;
    input.value = value;
    input.checked = !!checked;
    input.addEventListener("change", () => {
      if (input.checked && typeof onChange === "function") onChange(value);
    });
    const span = document.createElement("span");
    span.textContent = labelText;
    label.appendChild(input);
    label.appendChild(span);
    return label;
  }

  function buildUI(cardEl) {
    const header = cardEl.querySelector(".chart-card-header");
    const chartDom = cardEl.querySelector(`#${CHART_ID}`);
    const summaryEl =
      cardEl.querySelector('.chart-summary[data-analysis-key="pay_rate"]') || cardEl.querySelector(".chart-summary");

    // 本模块：在 header 下面插入筛选区
    let filtersWrap = cardEl.querySelector(".module-local-filters");
    if (!filtersWrap) {
      filtersWrap = document.createElement("div");
      filtersWrap.className = "module-local-filters";
      if (header && header.parentNode) {
        header.insertAdjacentElement("afterend", filtersWrap);
      } else {
        cardEl.insertBefore(filtersWrap, chartDom || null);
      }
    }

    // 表格区：插在 summary 前面
    let tableWrap = cardEl.querySelector(".paid-table-wrap");
    if (!tableWrap) {
      tableWrap = document.createElement("div");
      tableWrap.className = "paid-table-wrap";
      if (summaryEl && summaryEl.parentNode) {
        summaryEl.insertAdjacentElement("beforebegin", tableWrap);
      } else {
        cardEl.appendChild(tableWrap);
      }
    }

    // ---- filters DOM ----
    filtersWrap.innerHTML = `
      <div class="hero-filter-row">
        <div class="label">月份</div>
        <div class="chart-mini-chips" data-k="months"></div>
      </div>

      <div class="hero-filter-row">
        <div class="label">国家</div>
        <div class="chart-mini-chips" data-k="countries"></div>
      </div>

      <div class="hero-filter-row">
        <div class="label">媒体</div>
        <div class="chart-mini-chips" data-k="medias"></div>
      </div>

      <div class="hero-filter-row">
        <div class="label">形态</div>
        <div class="chart-mini-chips" data-k="productTypes"></div>
      </div>

      <div class="hero-filter-row">
        <div class="label">图形</div>
        <div class="chart-mini-radio" data-k="chartType"></div>
      </div>

      <div class="hero-filter-row">
        <div class="label">窗口</div>
        <div class="chart-mini-chips" data-k="windows"></div>
      </div>
    `;

    const elMonths = filtersWrap.querySelector('[data-k="months"]');
    const elCountries = filtersWrap.querySelector('[data-k="countries"]');
    const elMedias = filtersWrap.querySelector('[data-k="medias"]');
    const elProducts = filtersWrap.querySelector('[data-k="productTypes"]');
    const elChartType = filtersWrap.querySelector('[data-k="chartType"]');
    const elWindows = filtersWrap.querySelector('[data-k="windows"]');

    // ---- table DOM ----
    tableWrap.innerHTML = `
      <div class="paid-table-title">
        <span>付费率明细</span>
        <span class="paid-table-subtitle muted" data-k="tableMeta"></span>
      </div>
      <div class="paid-table-scroll">
        <table class="paid-table">
          <thead data-k="thead"></thead>
          <tbody data-k="tbody"></tbody>
        </table>
      </div>
    `;

    return {
      chartDom,
      elMonths,
      elCountries,
      elMedias,
      elProducts,
      elChartType,
      elWindows,
      tableMeta: tableWrap.querySelector('[data-k="tableMeta"]'),
      thead: tableWrap.querySelector('[data-k="thead"]'),
      tbody: tableWrap.querySelector('[data-k="tbody"]'),
    };
  }

  function renderFilters(ui, state, opts, rerender) {
    // months chips (max 3)
    ui.elMonths.innerHTML = "";
    opts.allMonths.forEach((m) => {
      const chip = createChip(formatMonthLabel(m), state.months.includes(m), (checked) => {
        const exists = state.months.includes(m);
        if (checked && !exists) {
          if (state.months.length >= 3) {
            chip.querySelector("input").checked = false;
            chip.classList.remove("filter-chip-active");
            return;
          }
          state.months.push(m);
        }
        if (!checked && exists) {
          state.months = state.months.filter((x) => x !== m);
        }
        rerender();
      });
      ui.elMonths.appendChild(chip);
    });

    // chartType radios
    ui.elChartType.innerHTML = "";
    const radioName = "payRateChartType_" + Math.random().toString(16).slice(2);
    ui.elChartType.appendChild(
      createRadio(radioName, "月度柱状图", "bar", state.chartType === "bar", (v) => {
        state.chartType = v;
        rerender();
      })
    );
    ui.elChartType.appendChild(
      createRadio(radioName, "日级折线图", "line", state.chartType === "line", (v) => {
        state.chartType = v;
        rerender();
      })
    );

    // windows chips
    ui.elWindows.innerHTML = "";
    ["D0", "D7"].forEach((w) => {
      const chip = createChip(w, state.windows.includes(w), (checked) => {
        const exists = state.windows.includes(w);
        if (checked && !exists) state.windows.push(w);
        if (!checked && exists) state.windows = state.windows.filter((x) => x !== w);
        rerender();
      });
      ui.elWindows.appendChild(chip);
    });

    // countries chips + noSplit
    ui.elCountries.innerHTML = "";
    ui.elCountries.appendChild(
      createChip("全选但不区分", !!state.countryNoSplit, (checked) => {
        state.countryNoSplit = checked;
        rerender();
      })
    );
    sortByOrder(opts.countries, COUNTRY_ORDER).forEach((c) => {
      const disabled = !!state.countryNoSplit;
      const chip = createChip(
        c,
        state.countries.includes(c),
        (checked, input) => {
          if (disabled) {
            input.checked = true;
            return;
          }
          const exists = state.countries.includes(c);
          if (checked && !exists) state.countries.push(c);
          if (!checked && exists) state.countries = state.countries.filter((x) => x !== c);
          rerender();
        },
        disabled
      );
      ui.elCountries.appendChild(chip);
    });

    // medias chips + noSplit
    ui.elMedias.innerHTML = "";
    ui.elMedias.appendChild(
      createChip("全选但不区分", !!state.mediaNoSplit, (checked) => {
        state.mediaNoSplit = checked;
        rerender();
      })
    );
    opts.medias
      .slice()
      .sort()
      .forEach((m) => {
        const disabled = !!state.mediaNoSplit;
        const chip = createChip(
          m,
          state.medias.includes(m),
          (checked, input) => {
            if (disabled) {
              input.checked = true;
              return;
            }
            const exists = state.medias.includes(m);
            if (checked && !exists) state.medias.push(m);
            if (!checked && exists) state.medias = state.medias.filter((x) => x !== m);
            rerender();
          },
          disabled
        );
        ui.elMedias.appendChild(chip);
      });

    // productTypes chips + noSplit
    ui.elProducts.innerHTML = "";
    ui.elProducts.appendChild(
      createChip("全选但不区分", !!state.productNoSplit, (checked) => {
        state.productNoSplit = checked;
        rerender();
      })
    );

    const productSorted = opts.productTypes.slice().sort((a, b) => {
      const la = String(a).toLowerCase();
      const lb = String(b).toLowerCase();
      if (la === "app" && lb !== "app") return -1;
      if (lb === "app" && la !== "app") return 1;
      return la.localeCompare(lb);
    });

    productSorted.forEach((p) => {
      const disabled = !!state.productNoSplit;
      const chip = createChip(
        p,
        state.productTypes.includes(p),
        (checked, input) => {
          if (disabled) {
            input.checked = true;
            return;
          }
          const exists = state.productTypes.includes(p);
          if (checked && !exists) state.productTypes.push(p);
          if (!checked && exists) state.productTypes = state.productTypes.filter((x) => x !== p);
          rerender();
        },
        disabled
      );
      ui.elProducts.appendChild(chip);
    });
  }

  // ---- data compute ----
  function calcMonthlyPayRate(raw, monthKey, filters, countryOrAll, windowKey) {
    const rows = raw[monthKey] || [];
    const cSel = new Set(filters.countries);
    const mSel = new Set(filters.medias);
    const pSel = new Set(filters.productTypes);

    const numField = windowKey === "D7" ? "D7_unique_purchase" : "D0_unique_purchase";
    let num = 0;
    let den = 0;

    rows.forEach((r) => {
      if (!r) return;

      const rc = String(r.country);
      const rm = String(r.media);
      const rp = String(r.productType);

      if (countryOrAll !== "ALL" && rc !== countryOrAll) return;
      if (!cSel.has(rc)) return;
      if (!mSel.has(rm)) return;
      if (!pSel.has(rp)) return;

      const reg = Number(r.registration);
      const n = Number(r[numField]);

      if (isFinite(reg)) den += reg;
      if (isFinite(n)) num += n;
    });

    return safeDiv(num, den);
  }

  function buildMonthlyTable(raw, state, opts) {
    const months = state.months.slice().sort();
    const windows = state.windows.slice();

    const countries = state.countryNoSplit ? ["ALL"] : sortByOrder(state.countries, COUNTRY_ORDER);
    const medias = state.mediaNoSplit ? ["ALL"] : state.medias.slice().sort();
    const products = state.productNoSplit ? ["ALL"] : state.productTypes.slice().sort((a, b) => String(a).toLowerCase().localeCompare(String(b).toLowerCase()));

    const rows = [];
    countries.forEach((c) => {
      medias.forEach((m) => {
        products.forEach((p) => {
          rows.push({ country: c, media: m, productType: p });
        });
      });
    });

    const tableRows = rows
      .map((rk) => {
        const row = { ...rk, cells: {}, hasAny: false };

        months.forEach((monthKey) => {
          windows.forEach((w) => {
            const f = {
              countries: state.countries.slice(),
              medias: state.medias.slice(),
              productTypes: state.productTypes.slice(),
            };

            const countryKey = rk.country === "ALL" ? "ALL" : rk.country;
            if (!state.mediaNoSplit && rk.media !== "ALL") f.medias = [rk.media];
            if (!state.productNoSplit && rk.productType !== "ALL") f.productTypes = [rk.productType];
            if (!state.countryNoSplit && rk.country !== "ALL") f.countries = [rk.country];

            const v = calcMonthlyPayRate(raw, monthKey, f, countryKey, w);
            row.cells[`${monthKey}_${w}`] = v;
            if (v != null) row.hasAny = true;
          });
        });

        return row;
      })
      .filter((r) => r.hasAny);

    tableRows.sort((a, b) => {
      const cidx = (x) => {
        if (x.country === "ALL") return -1;
        const i = COUNTRY_ORDER.indexOf(x.country);
        return i === -1 ? 999 : i;
      };
      const da = cidx(a);
      const db = cidx(b);
      if (da !== db) return da - db;
      if (a.media !== b.media) return String(a.media).localeCompare(String(b.media));
      return String(a.productType).localeCompare(String(b.productType));
    });

    return { months, windows, tableRows };
  }

  function buildDailySeries(raw, state) {
    const months = state.months.slice().sort();
    const cSel = new Set(state.countries);
    const mSel = new Set(state.medias);
    const pSel = new Set(state.productTypes);

    const dateSet = new Set();
    months.forEach((m) => {
      (raw[m] || []).forEach((r) => {
        if (r && r.date) dateSet.add(String(r.date));
      });
    });
    const dates = Array.from(dateSet).sort();

    const acc = new Map();

    function baseKeyFromRow(r) {
      const parts = [];
      if (!state.countryNoSplit) parts.push(String(r.country));
      if (!state.mediaNoSplit) parts.push(String(r.media));
      if (!state.productNoSplit) parts.push(String(r.productType));
      return parts.join("||") || "ALL";
    }

    months.forEach((m) => {
      (raw[m] || []).forEach((r) => {
        if (!r) return;
        const rc = String(r.country);
        const rm = String(r.media);
        const rp = String(r.productType);

        if (!cSel.has(rc)) return;
        if (!mSel.has(rm)) return;
        if (!pSel.has(rp)) return;

        const date = String(r.date || "");
        if (!date) return;

        const k = baseKeyFromRow(r);

        if (!acc.has(k)) acc.set(k, new Map());
        const byDate = acc.get(k);
        if (!byDate.has(date)) byDate.set(date, { reg: 0, d0: 0, d7: 0 });

        const bucket = byDate.get(date);
        const reg = Number(r.registration);
        const d0 = Number(r.D0_unique_purchase);
        const d7 = Number(r.D7_unique_purchase);

        if (isFinite(reg)) bucket.reg += reg;
        if (isFinite(d0)) bucket.d0 += d0;
        if (isFinite(d7)) bucket.d7 += d7;
      });
    });

    const palette =
      (window.PaidDashboard && window.PaidDashboard.COLORS) ||
      ["#2563eb", "#16a34a", "#f97316", "#7c3aed", "#ef4444", "#0f766e"];

    const keys = Array.from(acc.keys()).sort((ka, kb) => {
      if (!state.countryNoSplit) {
        const ca = ka.split("||")[0] || "";
        const cb = kb.split("||")[0] || "";
        const ia = COUNTRY_ORDER.indexOf(ca);
        const ib = COUNTRY_ORDER.indexOf(cb);
        if (ia !== ib) return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
      }
      return String(ka).localeCompare(String(kb));
    });

    const series = [];
    keys.forEach((k, idx) => {
      const color = palette[idx % palette.length];
      const byDate = acc.get(k);

      const parts = k === "ALL" ? [] : k.split("||");
      const baseName = parts.join(" · ");

      state.windows.forEach((w) => {
        const isD7 = w === "D7";
        const data = dates.map((d) => {
          const b = byDate && byDate.get(d);
          if (!b) return null;
          return safeDiv(isD7 ? b.d7 : b.d0, b.reg);
        });

        const name = (baseName ? baseName + " · " : "") + w + " 付费率";

        series.push({
          name,
          type: "line",
          data,
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 2, color, type: isD7 ? "dashed" : "solid" },
          itemStyle: { color },
        });
      });
    });

    return { dates, series };
  }

  // ---- chart render ----
  function buildBarOption(raw, state) {
    const months = state.months.slice().sort();
    const windows = state.windows.slice();

    const palette =
      (window.PaidDashboard && window.PaidDashboard.COLORS) ||
      ["#2563eb", "#16a34a", "#f97316", "#7c3aed", "#ef4444", "#0f766e"];

    const categories = state.countryNoSplit ? ["ALL"] : sortByOrder(state.countries, COUNTRY_ORDER);
    const xLabels = categories.map((c) => (c === "ALL" ? "ALL" : c));

    // D7 斜线阴影 decal（关键）
    const D7_DECAL = {
      symbol: "rect",
      symbolSize: 2,
      dashArrayX: [4, 2],
      dashArrayY: [6, 2],
      rotation: Math.PI / 4,
      color: "rgba(255,255,255,0.45)",
    };

    const series = [];
    months.forEach((m, mi) => {
      const monthColor = palette[mi % palette.length];
      windows.forEach((w) => {
        const isD7 = w === "D7";
        const name = `${formatMonthLabel(m)} ${w}`;

        const data = categories.map((c) => {
          const f = {
            countries: state.countries.slice(),
            medias: state.medias.slice(),
            productTypes: state.productTypes.slice(),
          };
          const countryKey = c === "ALL" ? "ALL" : c;
          return calcMonthlyPayRate(raw, m, f, countryKey, w);
        });

        series.push({
          name,
          type: "bar",
          data,
          barMaxWidth: 18,
          itemStyle: isD7 ? { color: monthColor, decal: D7_DECAL } : { color: monthColor },
        });
      });
    });

    return {
      grid: { left: 54, right: 22, top: 36, bottom: 44 },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        backgroundColor: "rgba(15, 23, 42, 0.92)",
        borderWidth: 0,
        textStyle: { fontSize: 11 },
        formatter: function (params) {
          const ps = Array.isArray(params) ? params : [params];
          const axisLabel = ps[0] ? ps[0].axisValue : "";
          const lines = [`<div style="font-weight:600;margin-bottom:6px;">${axisLabel}</div>`];
          ps.forEach((p) => {
            const v = p && p.data != null ? formatPct01(p.data, 2) : "-";
            lines.push(
              `<div style="display:flex;gap:8px;align-items:center;justify-content:space-between;">` +
                `<span>${p.marker || ""}${p.seriesName}</span>` +
                `<span style="font-weight:600;">${v}</span>` +
              `</div>`
            );
          });
          return lines.join("");
        },
      },
      legend: { type: "scroll", top: 6, textStyle: { fontSize: 11, color: "#475569" } },
      xAxis: {
        type: "category",
        data: xLabels,
        axisTick: { show: false },
        axisLine: { lineStyle: { color: "rgba(148,163,184,0.6)" } },
        axisLabel: { color: "#334155", fontSize: 11 },
      },
      yAxis: {
        type: "value",
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: "rgba(148,163,184,0.22)" } },
        axisLabel: { color: "#64748b", fontSize: 11, formatter: (v) => formatPct01(v, 1) },
      },
      series,
    };
  }

  function buildLineOption(raw, state) {
    const { dates, series } = buildDailySeries(raw, state);
    const xLabels = dates.map((d) => String(d).slice(5));

    return {
      grid: { left: 54, right: 22, top: 36, bottom: 44 },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "line" },
        backgroundColor: "rgba(15, 23, 42, 0.92)",
        borderWidth: 0,
        textStyle: { fontSize: 11 },
        formatter: function (params) {
          const ps = Array.isArray(params) ? params : [params];
          const idx = ps[0] ? ps[0].dataIndex : 0;
          const fullDate = dates[idx] || "";
          const lines = [`<div style="font-weight:600;margin-bottom:6px;">${fullDate}</div>`];
          ps.forEach((p) => {
            const v = p && p.data != null ? formatPct01(p.data, 2) : "-";
            lines.push(
              `<div style="display:flex;gap:8px;align-items:center;justify-content:space-between;">` +
                `<span>${p.marker || ""}${p.seriesName}</span>` +
                `<span style="font-weight:600;">${v}</span>` +
              `</div>`
            );
          });
          return lines.join("");
        },
      },
      legend: { type: "scroll", top: 6, textStyle: { fontSize: 11, color: "#475569" } },
      xAxis: {
        type: "category",
        data: xLabels,
        axisTick: { show: false },
        axisLine: { lineStyle: { color: "rgba(148,163,184,0.6)" } },
        axisLabel: { color: "#334155", fontSize: 11 },
      },
      yAxis: {
        type: "value",
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: "rgba(148,163,184,0.22)" } },
        axisLabel: { color: "#64748b", fontSize: 11, formatter: (v) => formatPct01(v, 1) },
      },
      series,
    };
  }

  function renderTable(ui, raw, state, opts) {
    const { months, windows, tableRows } = buildMonthlyTable(raw, state, opts);

    const mediaText = state.mediaNoSplit ? "媒体：全选但不区分" : "媒体：" + state.medias.join("+");
    const prodText = state.productNoSplit ? "形态：全选但不区分" : "形态：" + state.productTypes.join("+");
    const monthText = "月份：" + months.map(formatMonthLabel).join("+");
    ui.tableMeta.textContent = `${monthText}｜${mediaText}｜${prodText}`;

    const dimCols = ["国家"];
    if (!state.mediaNoSplit) dimCols.push("媒体");
    if (!state.productNoSplit) dimCols.push("形态");

    const ths = [];
    dimCols.forEach((c) => ths.push(`<th>${c}</th>`));
    months.forEach((m) => {
      windows.forEach((w) => ths.push(`<th>${formatMonthLabel(m)} ${w}付费率</th>`));
    });
    ui.thead.innerHTML = `<tr>${ths.join("")}</tr>`;

    if (!tableRows.length) {
      ui.tbody.innerHTML = `<tr><td class="muted" colspan="${ths.length}">没有匹配到数据（检查月份/国家/媒体/形态筛选）</td></tr>`;
      return;
    }

    ui.tbody.innerHTML = tableRows
      .map((r) => {
        const tds = [];
        tds.push(`<td>${r.country}</td>`);
        if (!state.mediaNoSplit) tds.push(`<td>${r.media}</td>`);
        if (!state.productNoSplit) tds.push(`<td>${r.productType}</td>`);
        months.forEach((m) => {
          windows.forEach((w) => {
            const v = r.cells[`${m}_${w}`];
            tds.push(`<td>${v == null ? "-" : formatPct01(v, 2)}</td>`);
          });
        });
        return `<tr>${tds.join("")}</tr>`;
      })
      .join("");
  }

  function init() {
    const raw = getRaw();
    const allMonths = getAllMonths(raw);

    const cardEl = document.getElementById(CARD_ID);
    const chartDom = document.getElementById(CHART_ID);
    if (!cardEl || !chartDom || !window.echarts) return;

    ensureOnceStyle();

    const countriesAll = sortByOrder(
      uniq(getDistinct(raw, "country")).filter((c) => COUNTRY_ORDER.includes(c)),
      COUNTRY_ORDER
    );
    const mediasAll = uniq(getDistinct(raw, "media")).sort();
    const productsAll = uniq(getDistinct(raw, "productType"));

    const opts = {
      allMonths,
      countries: countriesAll.length ? countriesAll : COUNTRY_ORDER.slice(),
      medias: mediasAll.length ? mediasAll : ["FB", "GG"],
      productTypes: productsAll.length ? productsAll : ["app", "H5"],
    };

    const state = {
      chartType: "bar",
      months: allMonths.slice(-2),
      countries: opts.countries.slice(),
      medias: opts.medias.slice(),
      productTypes: opts.productTypes.slice(),
      windows: ["D0", "D7"],
      countryNoSplit: false,
      mediaNoSplit: false,
      productNoSplit: false,
    };
    normalizeSelection(state, opts);

    const ui = buildUI(cardEl);
    const chart = echarts.init(chartDom);

    if (window.PaidDashboard && typeof window.PaidDashboard.registerChart === "function") {
      window.PaidDashboard.registerChart(chart);
    }

    function rerender() {
      normalizeSelection(state, opts);
      renderFilters(ui, state, opts, rerender);

      const option = state.chartType === "line" ? buildLineOption(raw, state) : buildBarOption(raw, state);
      chart.setOption(option, true);

      renderTable(ui, raw, state, opts);
    }

    rerender();
  }

  if (window.PaidDashboard && typeof window.PaidDashboard.registerModule === "function") {
    window.PaidDashboard.registerModule(MODULE_KEY, init);
  } else {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
  }
})();
