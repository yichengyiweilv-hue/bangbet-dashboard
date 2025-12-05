(() => {
  "use strict";

  // =========================================================
  // Common: “全选但不区分”
  // =========================================================
  const MERGE_VALUE = "__ALL_MERGED__";
  const MERGE_LABEL = "全选但不区分";

  // =========================================================
  // Data
  // =========================================================
  const RAW = window.RAW_PAID_BY_MONTH || {};
  const ALL_MONTHS = Object.keys(RAW).sort(); // YYYY-MM 升序（老→新）

  function normStr(v) {
    return String(v == null ? "" : v).trim();
  }
  function normLower(v, fallback = "unknown") {
    const s = normStr(v);
    return s ? s.toLowerCase() : fallback;
  }
  function normMedia(v) {
    return normLower(v, "unknown");
  }
  function normProduct(v) {
    return normLower(v, "unknown");
  }

  function collectDistinct(getter) {
    const set = new Set();
    ALL_MONTHS.forEach((m) => {
      (RAW[m] || []).forEach((r) => {
        if (!r) return;
        const v = getter(r);
        if (v != null && v !== "") set.add(v);
      });
    });
    return Array.from(set);
  }

  function sortWithPreferred(list, preferred) {
    const pref = new Map((preferred || []).map((v, i) => [v, i]));
    return (list || [])
      .slice()
      .sort((a0, b0) => {
        const a = a0 === "unknown" ? "zzzz_unknown" : a0;
        const b = b0 === "unknown" ? "zzzz_unknown" : b0;
        const ia = pref.has(a) ? pref.get(a) : 999;
        const ib = pref.has(b) ? pref.get(b) : 999;
        if (ia !== ib) return ia - ib;
        return a.localeCompare(b);
      });
  }

  const ALL_COUNTRIES = collectDistinct((r) => normStr(r.country)).filter(Boolean).sort();
  const ALL_MEDIA = sortWithPreferred(collectDistinct((r) => normMedia(r.media)), ["fb", "gg"]);
  const ALL_PRODUCTS = sortWithPreferred(collectDistinct((r) => normProduct(r.productType)), ["app", "h5"]);

  // =========================================================
  // Colors
  // =========================================================
  const BASE_PALETTE = [
    "#2563eb",
    "#16a34a",
    "#f97316",
    "#7c3aed",
    "#ef4444",
    "#0f766e",
    "#0ea5e9",
    "#db2777",
    "#84cc16",
    "#f59e0b",
    "#10b981",
    "#8b5cf6",
    "#22c55e",
    "#e11d48",
    "#14b8a6",
    "#3b82f6",
    "#a855f7",
    "#f43f5e",
    "#06b6d4",
    "#65a30d",
  ];

  // 月份颜色（可手工固定；不填则用色盘）
  const MONTH_COLOR_MAP = {}; // e.g. { "2025-09":"#2563eb" }
  function getColorForMonth(month, idx) {
    return MONTH_COLOR_MAP[month] || BASE_PALETTE[idx % BASE_PALETTE.length];
  }

  // 国家固定色（跨图一致，国家维度用）
  const COUNTRY_COLOR_MAP = { GH: "#2563eb", KE: "#16a34a", NG: "#f97316", TZ: "#db2777", UG: "#7c3aed" };
  function getColorForCountry(country, idx) {
    return COUNTRY_COLOR_MAP[country] || BASE_PALETTE[idx % BASE_PALETTE.length];
  }

  function hashToIndex(str, mod) {
    let h = 0;
    const s = String(str || "");
    for (let i = 0; i < s.length; i++) {
      h = (h << 5) - h + s.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h) % mod;
  }
  function getColorForGroup(groupKey) {
    return BASE_PALETTE[hashToIndex(groupKey, BASE_PALETTE.length)];
  }

  // =========================================================
  // Formatting
  // =========================================================
  function isFiniteNumber(v) {
    return Number.isFinite(Number(v));
  }
  function safeNum(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  function fmtInt(v) {
    if (!isFiniteNumber(v)) return "-";
    return Math.round(Number(v)).toLocaleString("en-US");
  }
  function fmtUSD(v) {
    if (!isFiniteNumber(v)) return "-";
    return "$" + Number(v).toFixed(2);
  }
  function fmtPct(v) {
    if (!isFiniteNumber(v)) return "-";
    return Number(v).toFixed(2) + "%";
  }
  function fmtAxisK(v) {
    if (!isFiniteNumber(v)) return "";
    const n = Number(v);
    const a = Math.abs(n);
    if (a >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
    if (a >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "k";
    return String(Math.round(n));
  }
  function fmtMonthShort(month) {
    const s = String(month || "");
    const parts = s.split("-");
    if (parts.length === 2) {
      const mm = parseInt(parts[1], 10);
      if (!Number.isNaN(mm)) return mm + "月";
    }
    return s;
  }

  // =========================================================
  // UI helpers
  // =========================================================
  function bindRadio(name, stateObj, key, onChange) {
    document.querySelectorAll(`input[name="${name}"]`).forEach((r) => {
      if (r.checked) stateObj[key] = r.value;
      r.addEventListener("change", () => {
        if (!r.checked) return;
        stateObj[key] = r.value;
        if (typeof onChange === "function") onChange();
      });
    });
  }

  /**
   * Multi-select chips with optional MERGE option (exclusive).
   *
   * - If mergeValue is selected: stateArray becomes [mergeValue] only.
   * - Selecting any normal value will auto-unselect mergeValue.
   * - Unselect mergeValue will auto-select all normal values (to keep “全选”语义).
   */
  function createMultiSelectChips(options) {
    const {
      containerId,
      values,
      getLabel,
      stateArray,
      max,
      min = 0,
      preselect,
      preselectLastN,
      preselectValues,
      mergeValue,
      mergeLabel,
      onChange,
    } = options;

    const container = document.getElementById(containerId);
    if (!container) return;

    const vals = Array.isArray(values) ? values.slice() : [];
    const st = Array.isArray(stateArray) ? stateArray : [];

    // init selection
    if (st.length === 0) {
      if (Array.isArray(preselectValues) && preselectValues.length) {
        st.push(...preselectValues);
      } else if (preselect === "all") {
        st.push(...vals);
      } else if (typeof preselectLastN === "number") {
        const n = Math.max(0, Math.min(preselectLastN, vals.length));
        st.push(...vals.slice(vals.length - n));
      } else if (typeof preselect === "number") {
        const n = Math.max(0, Math.min(preselect, vals.length));
        st.push(...vals.slice(0, n));
      }
    }

    // normalize: merge is exclusive
    if (mergeValue && st.includes(mergeValue)) {
      st.length = 0;
      st.push(mergeValue);
    } else {
      const uniq = Array.from(new Set(st));
      st.length = 0;
      st.push(...uniq);
    }

    container.innerHTML = "";
    const itemMap = new Map();

    function setChecked(value, checked) {
      const it = itemMap.get(value);
      if (!it) return;
      it.input.checked = checked;
      it.labelEl.classList.toggle("filter-chip-active", checked);
    }

    vals.forEach((value, idx) => {
      const labelEl = document.createElement("label");
      labelEl.className = "filter-chip";

      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = value;

      const isMerge = mergeValue && value === mergeValue;
      const label = isMerge
        ? mergeLabel || MERGE_LABEL
        : typeof getLabel === "function"
          ? getLabel(value, idx)
          : String(value);

      const selected = st.includes(value);
      input.checked = selected;
      if (selected) labelEl.classList.add("filter-chip-active");

      labelEl.appendChild(input);
      labelEl.appendChild(document.createTextNode(label));

      itemMap.set(value, { input, labelEl });

      input.addEventListener("change", () => {
        const exists = st.indexOf(value);

        if (isMerge) {
          if (input.checked) {
            // switch to merge-only
            st.length = 0;
            st.push(mergeValue);
            vals.forEach((v) => {
              if (v === mergeValue) setChecked(v, true);
              else setChecked(v, false);
            });
          } else {
            // uncheck merge => select all normal values
            const normal = vals.filter((v) => v !== mergeValue);
            st.length = 0;

            // respect max if provided
            const chosen = max ? normal.slice(0, max) : normal.slice();
            st.push(...chosen);

            setChecked(mergeValue, false);
            normal.forEach((v) => setChecked(v, st.includes(v)));
          }

          if (typeof onChange === "function") onChange();
          return;
        }

        if (input.checked) {
          // remove merge if present
          if (mergeValue && st.includes(mergeValue)) {
            st.splice(st.indexOf(mergeValue), 1);
            setChecked(mergeValue, false);
          }

          if (exists === -1) {
            if (max && st.length >= max) {
              // exceed max => rollback
              setChecked(value, false);
              return;
            }
            st.push(value);
          }
          setChecked(value, true);
        } else {
          // uncheck
          if (exists !== -1) st.splice(exists, 1);

          if (min && st.length < min) {
            // below min => rollback
            st.push(value);
            setChecked(value, true);
            return;
          }
          setChecked(value, false);
        }

        if (typeof onChange === "function") onChange();
      });

      container.appendChild(labelEl);
    });

    // reflect merge-only state
    if (mergeValue && st.includes(mergeValue)) {
      vals.forEach((v) => setChecked(v, v === mergeValue));
    }

    if (typeof onChange === "function") onChange();
  }

  function selectedOrAll(selected, allValues) {
    return Array.isArray(selected) && selected.length ? selected : (Array.isArray(allValues) ? allValues : []);
  }

  // mode helper: selection + merge flag
  function getMode(selectedArr, allValues) {
    const arr = Array.isArray(selectedArr) ? selectedArr : [];
    const merge = arr.includes(MERGE_VALUE);
    const actual = arr.filter((v) => v !== MERGE_VALUE);
    if (merge) return { merge: true, values: allValues.slice() };
    if (!actual.length) return { merge: false, values: allValues.slice() };
    return { merge: false, values: actual.slice() };
  }

  // =========================================================
  // Aggregation helpers (month / daily, support grouping)
  // =========================================================
  function rowPasses(row, sets) {
    const country = normStr(row.country);
    const media = normMedia(row.media);
    const product = normProduct(row.productType);

    if (sets.countries && !sets.countries.has(country)) return false;
    if (sets.media && !sets.media.has(media)) return false;
    if (sets.product && !sets.product.has(product)) return false;
    return true;
  }

  function makeParts(row, splitFlags) {
    const rawCountry = normStr(row.country);
    const rawMedia = normMedia(row.media);
    const rawProduct = normProduct(row.productType);

    return {
      country: splitFlags.splitCountry ? rawCountry : "ALL",
      media: splitFlags.splitMedia ? rawMedia : "ALL",
      product: splitFlags.splitProduct ? rawProduct : "ALL",
    };
  }

  function makeKey(parts) {
    return `${parts.country}||${parts.media}||${parts.product}`;
  }

  function makeLabel(parts, splitFlags) {
    const segs = [];
    if (splitFlags.splitCountry) segs.push(parts.country);
    if (splitFlags.splitMedia) segs.push(parts.media.toUpperCase());
    if (splitFlags.splitProduct) segs.push(parts.product);
    return segs.length ? segs.join(" | ") : "ALL";
  }

  function initAgg() {
    return { spent: 0, registration: 0, d0_payers: 0, d7_payers: 0 };
  }

  function addAgg(agg, row) {
    agg.spent += safeNum(row.spent);
    agg.registration += safeNum(row.registration);
    agg.d0_payers += safeNum(row.D0_unique_purchase);
    agg.d7_payers += safeNum(row.D7_unique_purchase);
  }

  function aggMonthByGroup(months, sets, splitFlags) {
    const monthAgg = {};
    const meta = new Map();

    months.forEach((month) => {
      const map = {};
      (RAW[month] || []).forEach((row) => {
        if (!row) return;
        if (!rowPasses(row, sets)) return;

        const parts = makeParts(row, splitFlags);
        const key = makeKey(parts);
        if (!map[key]) map[key] = initAgg();
        addAgg(map[key], row);

        if (!meta.has(key)) {
          meta.set(key, {
            country: parts.country,
            media: parts.media,
            product: parts.product,
            label: makeLabel(parts, splitFlags),
          });
        }
      });
      monthAgg[month] = map;
    });

    return { monthAgg, meta };
  }

  function aggDailyByGroup(months, sets, splitFlags) {
    const dateSet = new Set();
    const byGroup = {};
    const meta = new Map();

    months.forEach((month) => {
      (RAW[month] || []).forEach((row) => {
        if (!row) return;
        const date = normStr(row.date);
        if (!date) return;
        if (!rowPasses(row, sets)) return;

        const parts = makeParts(row, splitFlags);
        const key = makeKey(parts);

        dateSet.add(date);
        if (!byGroup[key]) byGroup[key] = {};
        if (!byGroup[key][date]) byGroup[key][date] = initAgg();
        addAgg(byGroup[key][date], row);

        if (!meta.has(key)) {
          meta.set(key, {
            country: parts.country,
            media: parts.media,
            product: parts.product,
            label: makeLabel(parts, splitFlags),
          });
        }
      });
    });

    const dates = Array.from(dateSet).sort();
    const index = new Map(dates.map((d, i) => [d, i]));
    return { dates, index, byGroup, meta };
  }

  function sortGroupKeys(keys) {
    const rank = (x) => (x === "ALL" ? "zzzz_ALL" : x);
    return (keys || [])
      .slice()
      .sort((a, b) => {
        const [ac, am, ap] = String(a || "").split("||");
        const [bc, bm, bp] = String(b || "").split("||");
        if (rank(ac) !== rank(bc)) return rank(ac).localeCompare(rank(bc));
        if (rank(am) !== rank(bm)) return rank(am).localeCompare(rank(bm));
        return rank(ap).localeCompare(rank(bp));
      });
  }

  // =========================================================
  // Metric calculators
  // =========================================================
  function calcCPR(spent, reg) {
    const r = Number(reg);
    const s = Number(spent);
    if (!Number.isFinite(r) || r <= 0) return null;
    if (!Number.isFinite(s) || s < 0) return null;
    return s / r;
  }

  function calcRatePct(payers, reg) {
    const r = Number(reg);
    const p = Number(payers);
    if (!Number.isFinite(r) || r <= 0) return null;
    if (!Number.isFinite(p) || p < 0) return null;
    return (p / r) * 100;
  }

  // =========================================================
  // Module 01: Paid registrations & CPR
  // =========================================================
  function updateTablePaidReg(months, metrics, view, splitFlagsForTable, monthAgg, metaMap, groupKeysSorted) {
    const table = document.getElementById("table-paidreg");
    if (!table) return;

    const showReg = metrics.includes("reg");
    const showCpr = metrics.includes("cpr");

    table.innerHTML = "";

    const thead = document.createElement("thead");
    const trh = document.createElement("tr");

    const thCountry = document.createElement("th");
    thCountry.textContent = "国家";
    trh.appendChild(thCountry);

    if (view === "line") {
      const thMedia = document.createElement("th");
      thMedia.textContent = "媒体";
      trh.appendChild(thMedia);

      const thProd = document.createElement("th");
      thProd.textContent = "产品类型";
      trh.appendChild(thProd);
    }

    months.forEach((m) => {
      const ml = fmtMonthShort(m);
      if (showReg) {
        const th = document.createElement("th");
        th.textContent = `${ml} 注册数`;
        trh.appendChild(th);
      }
      if (showCpr) {
        const th = document.createElement("th");
        th.textContent = `${ml} 注册单价`;
        trh.appendChild(th);
      }
    });

    thead.appendChild(trh);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    groupKeysSorted.forEach((gkey) => {
      const meta = metaMap.get(gkey) || { country: "ALL", media: "ALL", product: "ALL" };
      const tr = document.createElement("tr");

      const tdC = document.createElement("td");
      tdC.textContent = meta.country;
      tr.appendChild(tdC);

      if (view === "line") {
        const tdM = document.createElement("td");
        tdM.textContent = splitFlagsForTable.splitMedia ? meta.media.toUpperCase() : "ALL";
        tr.appendChild(tdM);

        const tdP = document.createElement("td");
        tdP.textContent = splitFlagsForTable.splitProduct ? meta.product : "ALL";
        tr.appendChild(tdP);
      }

      months.forEach((m) => {
        const agg = (monthAgg[m] && monthAgg[m][gkey]) || null;

        if (showReg) {
          const td = document.createElement("td");
          td.className = "num";
          td.textContent = agg ? fmtInt(agg.registration) : "-";
          tr.appendChild(td);
        }

        if (showCpr) {
          const td = document.createElement("td");
          td.className = "num";
          const v = agg ? calcCPR(agg.spent, agg.registration) : null;
          td.textContent = agg ? fmtUSD(v) : "-";
          tr.appendChild(td);
        }
      });

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
  }

  function updateChartPaidReg(chart, st) {
    if (!chart) return;

    let months = selectedOrAll(st.months, ALL_MONTHS).slice(0, 3);
    months = Array.from(new Set(months)).sort();

    const metrics = selectedOrAll(st.metrics, ["reg"]);
    const showReg = metrics.includes("reg");
    const showCpr = metrics.includes("cpr");

    const countryMode = getMode(st.countries, ALL_COUNTRIES);
    const mediaMode = getMode(st.medias, ALL_MEDIA);
    const productMode = getMode(st.products, ALL_PRODUCTS);

    const sets = {
      countries: new Set(countryMode.values),
      media: new Set(mediaMode.values),
      product: new Set(productMode.values),
    };

    const splitFlagsTable =
      st.view === "line"
        ? { splitCountry: !countryMode.merge, splitMedia: !mediaMode.merge, splitProduct: !productMode.merge }
        : { splitCountry: !countryMode.merge, splitMedia: false, splitProduct: false };

    const { monthAgg, meta: metaMonth } = aggMonthByGroup(months, sets, splitFlagsTable);
    const groupKeysForTable = sortGroupKeys(Array.from(metaMonth.keys()));
    updateTablePaidReg(months, metrics, st.view, splitFlagsTable, monthAgg, metaMonth, groupKeysForTable);

    const yAxis = [];
    if (showReg && showCpr) {
      yAxis.push({
        type: "value",
        name: "注册数",
        axisLabel: { formatter: (v) => fmtAxisK(v) },
        splitLine: { lineStyle: { color: "rgba(148,163,184,0.22)" } },
      });
      yAxis.push({
        type: "value",
        name: "注册单价（USD）",
        axisLabel: { formatter: (v) => (isFiniteNumber(v) ? "$" + Number(v).toFixed(2) : "") },
        splitLine: { show: false },
      });
    } else if (showReg) {
      yAxis.push({
        type: "value",
        name: "注册数",
        axisLabel: { formatter: (v) => fmtAxisK(v) },
        splitLine: { lineStyle: { color: "rgba(148,163,184,0.22)" } },
      });
    } else {
      yAxis.push({
        type: "value",
        name: "注册单价（USD）",
        axisLabel: { formatter: (v) => (isFiniteNumber(v) ? "$" + Number(v).toFixed(2) : "") },
        splitLine: { lineStyle: { color: "rgba(148,163,184,0.22)" } },
      });
    }

    if (st.view === "line") {
      const splitFlagsLine = { splitCountry: !countryMode.merge, splitMedia: !mediaMode.merge, splitProduct: !productMode.merge };
      const { dates, index, byGroup, meta } = aggDailyByGroup(months, sets, splitFlagsLine);
      const groupKeys = sortGroupKeys(Object.keys(byGroup));
      const legendLabels = groupKeys.map((k) => (meta.get(k) ? meta.get(k).label : k));

      const series = [];
      const sMeta = []; // seriesIndex -> {metric,label}

      groupKeys.forEach((gkey, idxG) => {
        const info = meta.get(gkey) || { label: gkey, country: "ALL" };
        const label = info.label;

        const useCountryColor = splitFlagsLine.splitCountry && !splitFlagsLine.splitMedia && !splitFlagsLine.splitProduct;
        const color = useCountryColor ? getColorForCountry(info.country, idxG) : getColorForGroup(gkey);

        const map = byGroup[gkey] || {};

        if (showReg) {
          const data = new Array(dates.length).fill(null);
          Object.keys(map).forEach((d) => {
            const i = index.get(d);
            if (i == null) return;
            data[i] = map[d].registration;
          });

          series.push({
            name: label,
            type: "line",
            yAxisIndex: 0,
            smooth: true,
            showSymbol: false,
            connectNulls: true,
            lineStyle: { width: 2, color },
            itemStyle: { color },
            data,
          });
          sMeta.push({ metric: "reg", label });
        }

        if (showCpr) {
          const data = new Array(dates.length).fill(null);
          Object.keys(map).forEach((d) => {
            const i = index.get(d);
            if (i == null) return;
            data[i] = calcCPR(map[d].spent, map[d].registration);
          });

          series.push({
            name: label,
            type: "line",
            yAxisIndex: showReg ? 1 : 0,
            smooth: true,
            showSymbol: false,
            connectNulls: true,
            lineStyle: { width: 2, type: "dashed", color },
            itemStyle: { color },
            data,
          });
          sMeta.push({ metric: "cpr", label });
        }
      });

      chart.setOption(
        {
          legend: { type: "scroll", data: Array.from(new Set(legendLabels)) },
          grid: { left: 52, right: showReg && showCpr ? 60 : 22, top: 40, bottom: 42, containLabel: true },
          tooltip: {
            trigger: "axis",
            axisPointer: { type: "cross" },
            backgroundColor: "rgba(255,255,255,0.96)",
            borderColor: "rgba(148,163,184,0.35)",
            borderWidth: 1,
            textStyle: { color: "#0f172a", fontSize: 12 },
            formatter: (params) => {
              if (!params || !params.length) return "";
              const axisValue = params[0].axisValue;

              const byLabel = new Map();
              params.forEach((p) => {
                const m = sMeta[p.seriesIndex] || {};
                const label = m.label || p.seriesName || "-";
                if (!byLabel.has(label)) byLabel.set(label, { marker: p.marker, reg: null, cpr: null });
                const g = byLabel.get(label);
                if (m.metric === "reg") g.reg = p.value;
                if (m.metric === "cpr") g.cpr = p.value;
              });

              const lines = [];
              lines.push(`<div style="font-weight:700;margin-bottom:4px;">日期：${axisValue}</div>`);
              groupKeys.forEach((gkey) => {
                const info = meta.get(gkey);
                const label = info ? info.label : gkey;
                const g = byLabel.get(label);
                if (!g) return;
                const parts = [];
                if (showReg) parts.push(`注册数 ${fmtInt(g.reg)}`);
                if (showCpr) parts.push(`注册单价 ${fmtUSD(g.cpr)}`);
                lines.push(`${g.marker || ""} ${label} · ${parts.join(" / ")}`);
              });
              return lines.join("<br/>");
            },
          },
          xAxis: { type: "category", data: dates, axisLabel: { formatter: (v) => String(v).slice(5) } },
          yAxis,
          series,
        },
        true
      );
      return;
    }

    const splitFlagsBar = { splitCountry: !countryMode.merge, splitMedia: false, splitProduct: false };
    const { monthAgg: monthAggBar } = aggMonthByGroup(months, sets, splitFlagsBar);

    const xCountries = countryMode.merge ? ["ALL"] : countryMode.values.slice().sort();
    const monthLabels = months.map((m) => fmtMonthShort(m));

    const series = [];
    const sMeta = []; // seriesIndex -> {metric, monthLabel}

    months.forEach((m, idxM) => {
      const ml = fmtMonthShort(m);
      const color = getColorForMonth(m, idxM);

      const buildAgg = (country) => {
        const key = `${country}||ALL||ALL`;
        return (monthAggBar[m] && monthAggBar[m][key]) || null;
      };

      if (showReg) {
        series.push({
          name: ml,
          type: "bar",
          yAxisIndex: 0,
          barMaxWidth: 18,
          itemStyle: { color, borderRadius: [6, 6, 0, 0] },
          data: xCountries.map((c) => {
            const agg = buildAgg(c);
            return agg ? agg.registration : null;
          }),
        });
        sMeta.push({ metric: "reg", monthLabel: ml });
      }

      if (showCpr) {
        series.push({
          name: ml,
          type: showReg ? "line" : "bar",
          yAxisIndex: showReg ? 1 : 0,
          smooth: true,
          symbol: "circle",
          symbolSize: 6,
          lineStyle: showReg ? { width: 2, type: "dashed", color } : undefined,
          itemStyle: { color, borderRadius: showReg ? undefined : [6, 6, 0, 0] },
          data: xCountries.map((c) => {
            const agg = buildAgg(c);
            return agg ? calcCPR(agg.spent, agg.registration) : null;
          }),
        });
        sMeta.push({ metric: "cpr", monthLabel: ml });
      }
    });

    chart.setOption(
      {
        legend: { type: "scroll", data: monthLabels },
        grid: { left: 48, right: showReg && showCpr ? 60 : 22, top: 40, bottom: 42, containLabel: true },
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
          backgroundColor: "rgba(255,255,255,0.96)",
          borderColor: "rgba(148,163,184,0.35)",
          borderWidth: 1,
          textStyle: { color: "#0f172a", fontSize: 12 },
          formatter: (params) => {
            if (!params || !params.length) return "";
            const country = params[0].axisValue;

            const byMonth = new Map();
            params.forEach((p) => {
              const m = sMeta[p.seriesIndex] || {};
              const ml = m.monthLabel || p.seriesName || "-";
              if (!byMonth.has(ml)) byMonth.set(ml, { marker: p.marker, reg: null, cpr: null });
              const g = byMonth.get(ml);
              if (m.metric === "reg") g.reg = p.value;
              if (m.metric === "cpr") g.cpr = p.value;
            });

            const lines = [];
            lines.push(`<div style="font-weight:700;margin-bottom:4px;">国家：${country}</div>`);
            monthLabels.forEach((ml) => {
              const g = byMonth.get(ml);
              if (!g) return;
              const parts = [];
              if (showReg) parts.push(`注册数 ${fmtInt(g.reg)}`);
              if (showCpr) parts.push(`注册单价 ${fmtUSD(g.cpr)}`);
              lines.push(`${g.marker || ""} ${ml} · ${parts.join(" / ")}`);
            });
            return lines.join("<br/>");
          },
        },
        xAxis: { type: "category", data: xCountries },
        yAxis,
        series,
      },
      true
    );
  }

  function initModule01() {
    const dom = document.getElementById("chart-paidreg");
    if (!dom || !window.echarts) return;

    const chart = echarts.init(dom);

    const st = { view: "bar", months: [], countries: [], medias: [], products: [], metrics: [] };

    bindRadio("paidreg-view", st, "view", () => updateChartPaidReg(chart, st));

    createMultiSelectChips({
      containerId: "paidreg-months",
      values: ALL_MONTHS,
      getLabel: (m) => m,
      stateArray: st.months,
      max: 3,
      min: 1,
      preselectLastN: Math.min(2, ALL_MONTHS.length),
      onChange: () => updateChartPaidReg(chart, st),
    });

    createMultiSelectChips({
      containerId: "paidreg-countries",
      values: [MERGE_VALUE, ...ALL_COUNTRIES],
      getLabel: (c) => c,
      stateArray: st.countries,
      min: 1,
      preselectValues: ALL_COUNTRIES.slice(),
      mergeValue: MERGE_VALUE,
      mergeLabel: MERGE_LABEL,
      onChange: () => updateChartPaidReg(chart, st),
    });

    createMultiSelectChips({
      containerId: "paidreg-media",
      values: [MERGE_VALUE, ...ALL_MEDIA],
      getLabel: (m) => (m === "unknown" ? "UNKNOWN" : m.toUpperCase()),
      stateArray: st.medias,
      min: 1,
      preselectValues: ALL_MEDIA.slice(), // 默认拆线
      mergeValue: MERGE_VALUE,
      mergeLabel: MERGE_LABEL,
      onChange: () => updateChartPaidReg(chart, st),
    });

    createMultiSelectChips({
      containerId: "paidreg-products",
      values: [MERGE_VALUE, ...ALL_PRODUCTS],
      getLabel: (p) => (p === "unknown" ? "UNKNOWN" : p),
      stateArray: st.products,
      min: 1,
      preselectValues: ALL_PRODUCTS.slice(), // 默认拆线
      mergeValue: MERGE_VALUE,
      mergeLabel: MERGE_LABEL,
      onChange: () => updateChartPaidReg(chart, st),
    });

    createMultiSelectChips({
      containerId: "paidreg-metrics",
      values: ["reg", "cpr"],
      getLabel: (k) => (k === "reg" ? "注册数" : "注册单价"),
      stateArray: st.metrics,
      max: 2,
      min: 1,
      preselectValues: ["reg"],
      onChange: () => updateChartPaidReg(chart, st),
    });

    updateChartPaidReg(chart, st);
    window.addEventListener("resize", () => chart.resize());
  }

  // =========================================================
  // Module 02: D0/D7 Pay rate
  // =========================================================
  function updateTablePayRate(months, metrics, view, splitFlagsForTable, monthAgg, metaMap, groupKeysSorted) {
    const table = document.getElementById("table-payrate");
    if (!table) return;

    const showD0 = metrics.includes("d0");
    const showD7 = metrics.includes("d7");

    table.innerHTML = "";

    const thead = document.createElement("thead");
    const trh = document.createElement("tr");

    const thCountry = document.createElement("th");
    thCountry.textContent = "国家";
    trh.appendChild(thCountry);

    if (view === "line") {
      const thMedia = document.createElement("th");
      thMedia.textContent = "媒体";
      trh.appendChild(thMedia);

      const thProd = document.createElement("th");
      thProd.textContent = "产品类型";
      trh.appendChild(thProd);
    }

    months.forEach((m) => {
      const ml = fmtMonthShort(m);
      if (showD0) {
        const th = document.createElement("th");
        th.textContent = `${ml} D0付费率`;
        trh.appendChild(th);
      }
      if (showD7) {
        const th = document.createElement("th");
        th.textContent = `${ml} D7付费率`;
        trh.appendChild(th);
      }
    });

    thead.appendChild(trh);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    groupKeysSorted.forEach((gkey) => {
      const meta = metaMap.get(gkey) || { country: "ALL", media: "ALL", product: "ALL" };

      const tr = document.createElement("tr");

      const tdC = document.createElement("td");
      tdC.textContent = meta.country;
      tr.appendChild(tdC);

      if (view === "line") {
        const tdM = document.createElement("td");
        tdM.textContent = splitFlagsForTable.splitMedia ? meta.media.toUpperCase() : "ALL";
        tr.appendChild(tdM);

        const tdP = document.createElement("td");
        tdP.textContent = splitFlagsForTable.splitProduct ? meta.product : "ALL";
        tr.appendChild(tdP);
      }

      months.forEach((m) => {
        const agg = (monthAgg[m] && monthAgg[m][gkey]) || null;
        const reg = agg ? agg.registration : null;

        const v0 = agg ? calcRatePct(agg.d0_payers, reg) : null;
        const v7 = agg ? calcRatePct(agg.d7_payers, reg) : null;

        if (showD0) {
          const td = document.createElement("td");
          td.className = "num";
          td.textContent = agg ? fmtPct(v0) : "-";
          tr.appendChild(td);
        }
        if (showD7) {
          const td = document.createElement("td");
          td.className = "num";
          td.textContent = agg ? fmtPct(v7) : "-";
          tr.appendChild(td);
        }
      });

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
  }

  function updateChartPayRate(chart, st) {
    if (!chart) return;

    let months = selectedOrAll(st.months, ALL_MONTHS).slice(0, 3);
    months = Array.from(new Set(months)).sort();

    const metrics = selectedOrAll(st.metrics, ["d0", "d7"]);
    const showD0 = metrics.includes("d0");
    const showD7 = metrics.includes("d7");

    const countryMode = getMode(st.countries, ALL_COUNTRIES);
    const mediaMode = getMode(st.medias, ALL_MEDIA);
    const productMode = getMode(st.products, ALL_PRODUCTS);

    const sets = {
      countries: new Set(countryMode.values),
      media: new Set(mediaMode.values),
      product: new Set(productMode.values),
    };

    const splitFlagsTable =
      st.view === "line"
        ? { splitCountry: !countryMode.merge, splitMedia: !mediaMode.merge, splitProduct: !productMode.merge }
        : { splitCountry: !countryMode.merge, splitMedia: false, splitProduct: false };

    const { monthAgg, meta: metaMonth } = aggMonthByGroup(months, sets, splitFlagsTable);
    const groupKeysForTable = sortGroupKeys(Array.from(metaMonth.keys()));
    updateTablePayRate(months, metrics, st.view, splitFlagsTable, monthAgg, metaMonth, groupKeysForTable);

    const yAxis = [
      {
        type: "value",
        name: "付费率（%）",
        axisLabel: { formatter: (v) => (isFiniteNumber(v) ? Number(v).toFixed(0) + "%" : "") },
        splitLine: { lineStyle: { color: "rgba(148,163,184,0.22)" } },
      },
    ];

    if (st.view === "line") {
      const splitFlagsLine = { splitCountry: !countryMode.merge, splitMedia: !mediaMode.merge, splitProduct: !productMode.merge };
      const { dates, index, byGroup, meta } = aggDailyByGroup(months, sets, splitFlagsLine);
      const groupKeys = sortGroupKeys(Object.keys(byGroup));
      const legendLabels = groupKeys.map((k) => (meta.get(k) ? meta.get(k).label : k));

      const series = [];
      const sMeta = []; // seriesIndex -> {metric,label}

      groupKeys.forEach((gkey) => {
        const info = meta.get(gkey) || { label: gkey };
        const label = info.label;
        const color = getColorForGroup(gkey);
        const map = byGroup[gkey] || {};

        if (showD0) {
          const data = new Array(dates.length).fill(null);
          Object.keys(map).forEach((d) => {
            const i = index.get(d);
            if (i == null) return;
            data[i] = calcRatePct(map[d].d0_payers, map[d].registration);
          });

          series.push({
            name: label,
            type: "line",
            yAxisIndex: 0,
            smooth: true,
            showSymbol: false,
            connectNulls: true,
            lineStyle: { width: 2, color },
            itemStyle: { color },
            data,
          });
          sMeta.push({ metric: "d0", label });
        }

        if (showD7) {
          const data = new Array(dates.length).fill(null);
          Object.keys(map).forEach((d) => {
            const i = index.get(d);
            if (i == null) return;
            data[i] = calcRatePct(map[d].d7_payers, map[d].registration);
          });

          series.push({
            name: label,
            type: "line",
            yAxisIndex: 0,
            smooth: true,
            showSymbol: false,
            connectNulls: true,
            lineStyle: { width: 2, type: "dashed", color },
            itemStyle: { color },
            data,
          });
          sMeta.push({ metric: "d7", label });
        }
      });

      chart.setOption(
        {
          legend: { type: "scroll", data: Array.from(new Set(legendLabels)) },
          grid: { left: 52, right: 22, top: 40, bottom: 42, containLabel: true },
          tooltip: {
            trigger: "axis",
            axisPointer: { type: "cross" },
            backgroundColor: "rgba(255,255,255,0.96)",
            borderColor: "rgba(148,163,184,0.35)",
            borderWidth: 1,
            textStyle: { color: "#0f172a", fontSize: 12 },
            formatter: (params) => {
              if (!params || !params.length) return "";
              const axisValue = params[0].axisValue;

              const byLabel = new Map();
              params.forEach((p) => {
                const m = sMeta[p.seriesIndex] || {};
                const label = m.label || p.seriesName || "-";
                if (!byLabel.has(label)) byLabel.set(label, { marker: p.marker, d0: null, d7: null });
                const g = byLabel.get(label);
                if (m.metric === "d0") g.d0 = p.value;
                if (m.metric === "d7") g.d7 = p.value;
              });

              const lines = [];
              lines.push(`<div style="font-weight:700;margin-bottom:4px;">日期：${axisValue}</div>`);
              groupKeys.forEach((gkey) => {
                const info = meta.get(gkey);
                const label = info ? info.label : gkey;
                const g = byLabel.get(label);
                if (!g) return;
                const parts = [];
                if (showD0) parts.push(`D0 ${fmtPct(g.d0)}`);
                if (showD7) parts.push(`D7 ${fmtPct(g.d7)}`);
                lines.push(`${g.marker || ""} ${label} · ${parts.join(" / ")}`);
              });
              return lines.join("<br/>");
            },
          },
          xAxis: { type: "category", data: dates, axisLabel: { formatter: (v) => String(v).slice(5) } },
          yAxis,
          series,
        },
        true
      );
      return;
    }

    const splitFlagsBar = { splitCountry: !countryMode.merge, splitMedia: false, splitProduct: false };
    const { monthAgg: monthAggBar } = aggMonthByGroup(months, sets, splitFlagsBar);

    const xCountries = countryMode.merge ? ["ALL"] : countryMode.values.slice().sort();
    const monthLabels = months.map((m) => fmtMonthShort(m));

    const series = [];
    const sMeta = []; // seriesIndex -> {monthLabel, metric}

    months.forEach((m, idxM) => {
      const ml = fmtMonthShort(m);
      const color = getColorForMonth(m, idxM);

      const buildData = (metric) =>
        xCountries.map((c) => {
          const key = `${c}||ALL||ALL`;
          const agg = (monthAggBar[m] && monthAggBar[m][key]) || null;
          if (!agg) return null;
          return metric === "d0" ? calcRatePct(agg.d0_payers, agg.registration) : calcRatePct(agg.d7_payers, agg.registration);
        });

      if (showD0) {
        series.push({
          name: ml,
          type: "bar",
          yAxisIndex: 0,
          barMaxWidth: 12,
          barGap: "20%",
          itemStyle: { color, borderRadius: [6, 6, 0, 0] },
          data: buildData("d0"),
        });
        sMeta.push({ monthLabel: ml, metric: "d0" });
      }

      if (showD7) {
        series.push({
          name: ml,
          type: "bar",
          yAxisIndex: 0,
          barMaxWidth: 12,
          barGap: "20%",
          itemStyle: {
            color,
            borderRadius: [6, 6, 0, 0],
            shadowBlur: 18,
            shadowColor: "rgba(15,23,42,0.28)",
            shadowOffsetX: 2,
            shadowOffsetY: 6,
            borderWidth: 1,
            borderColor: "rgba(15,23,42,0.18)",
            decal: {
              symbol: "rect",
              symbolSize: 1,
              dashArrayX: [1, 0],
              dashArrayY: [4, 2],
              rotation: Math.PI / 4,
              color: "rgba(15,23,42,0.22)",
            },
          },
          data: buildData("d7"),
        });
        sMeta.push({ monthLabel: ml, metric: "d7" });
      }
    });

    chart.setOption(
      {
        legend: { type: "scroll", data: monthLabels },
        grid: { left: 52, right: 22, top: 40, bottom: 42, containLabel: true },
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
          backgroundColor: "rgba(255,255,255,0.96)",
          borderColor: "rgba(148,163,184,0.35)",
          borderWidth: 1,
          textStyle: { color: "#0f172a", fontSize: 12 },
          formatter: (params) => {
            if (!params || !params.length) return "";
            const country = params[0].axisValue;

            const byMonth = new Map();
            params.forEach((p) => {
              const m = sMeta[p.seriesIndex] || {};
              const ml = m.monthLabel || p.seriesName || "-";
              if (!byMonth.has(ml)) byMonth.set(ml, { marker: p.marker, d0: null, d7: null });
              const g = byMonth.get(ml);
              if (m.metric === "d0") g.d0 = p.value;
              if (m.metric === "d7") g.d7 = p.value;
            });

            const lines = [];
            lines.push(`<div style="font-weight:700;margin-bottom:4px;">国家：${country}</div>`);
            monthLabels.forEach((ml) => {
              const g = byMonth.get(ml);
              if (!g) return;
              const parts = [];
              if (showD0) parts.push(`D0 ${fmtPct(g.d0)}`);
              if (showD7) parts.push(`D7 ${fmtPct(g.d7)}`);
              lines.push(`${g.marker || ""} ${ml} · ${parts.join(" / ")}`);
            });
            return lines.join("<br/>");
          },
        },
        xAxis: { type: "category", data: xCountries },
        yAxis,
        series,
      },
      true
    );
  }

  function initModule02() {
    const dom = document.getElementById("chart-payrate");
    if (!dom || !window.echarts) return;

    const chart = echarts.init(dom);

    const st = { view: "bar", months: [], countries: [], medias: [], products: [], metrics: [] };

    bindRadio("payrate-view", st, "view", () => updateChartPayRate(chart, st));

    createMultiSelectChips({
      containerId: "payrate-months",
      values: ALL_MONTHS,
      getLabel: (m) => m,
      stateArray: st.months,
      max: 3,
      min: 1,
      preselectLastN: Math.min(2, ALL_MONTHS.length),
      onChange: () => updateChartPayRate(chart, st),
    });

    createMultiSelectChips({
      containerId: "payrate-countries",
      values: [MERGE_VALUE, ...ALL_COUNTRIES],
      getLabel: (c) => c,
      stateArray: st.countries,
      min: 1,
      preselectValues: ALL_COUNTRIES.slice(),
      mergeValue: MERGE_VALUE,
      mergeLabel: MERGE_LABEL,
      onChange: () => updateChartPayRate(chart, st),
    });

    createMultiSelectChips({
      containerId: "payrate-media",
      values: [MERGE_VALUE, ...ALL_MEDIA],
      getLabel: (m) => (m === "unknown" ? "UNKNOWN" : m.toUpperCase()),
      stateArray: st.medias,
      min: 1,
      preselectValues: [MERGE_VALUE],
      mergeValue: MERGE_VALUE,
      mergeLabel: MERGE_LABEL,
      onChange: () => updateChartPayRate(chart, st),
    });

    createMultiSelectChips({
      containerId: "payrate-products",
      values: [MERGE_VALUE, ...ALL_PRODUCTS],
      getLabel: (p) => (p === "unknown" ? "UNKNOWN" : p),
      stateArray: st.products,
      min: 1,
      preselectValues: [MERGE_VALUE],
      mergeValue: MERGE_VALUE,
      mergeLabel: MERGE_LABEL,
      onChange: () => updateChartPayRate(chart, st),
    });

    createMultiSelectChips({
      containerId: "payrate-metrics",
      values: ["d0", "d7"],
      getLabel: (k) => (k === "d0" ? "D0付费率" : "D7付费率"),
      stateArray: st.metrics,
      max: 2,
      min: 1,
      preselectValues: ["d0", "d7"],
      onChange: () => updateChartPayRate(chart, st),
    });

    updateChartPayRate(chart, st);
    window.addEventListener("resize", () => chart.resize());
  }

  // =========================================================
  // Boot
  // =========================================================
  document.addEventListener("DOMContentLoaded", () => {
    if (!ALL_MONTHS.length) return;
    initModule01();
    initModule02();
  });
})();
