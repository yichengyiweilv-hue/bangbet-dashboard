/**
 * paid-module-pay-rate.js
 * 模块3：D0/D7 付费率
 * 口径：
 * - D0付费率 = D0_unique_purchase / registration
 * - D7付费率 = D7_unique_purchase / registration
 *
 * 图表：
 * - 月度柱状图：按国家分组；每个国家内按（月份×D0/D7）展示柱子
 * - 日级折线图：按（国家×媒体×产品类型×D0/D7）拆分折线（可通过“全选但不区分”合并维度）
 *
 * 依赖：
 * - window.RAW_PAID_BY_MONTH （来自 paid-data.js）
 * - window.echarts
 * - window.PaidDashboard（用于模块注册、配色、resize）
 */
(function () {
  const MODULE_ID = "pay_rate";

  const COUNTRY_ORDER = ["GH", "KE", "NG", "TZ"];
  const DAY_TYPES = ["D0", "D7"];

  function uniq(arr) {
    return Array.from(new Set(arr.filter(Boolean)));
  }

  function safeDiv(a, b) {
    const na = Number(a);
    const nb = Number(b);
    if (!isFinite(na) || !isFinite(nb) || nb === 0) return null;
    return na / nb;
  }

  function formatMonthLabel(monthKey) {
    if (
      window.PaidDashboard &&
      typeof PaidDashboard.formatMonthLabel === "function"
    ) {
      return PaidDashboard.formatMonthLabel(monthKey);
    }
    return monthKey || "";
  }

  function fmtPct(v, digits) {
    if (v == null || !isFinite(Number(v))) return "-";
    const d = typeof digits === "number" ? digits : 1;
    return Number(v).toFixed(d) + "%";
  }

  function ensureTableStyles() {
    const STYLE_ID = "paid-dashboard-table-style";
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .chart-table-section{
        margin-top:6px;
        padding-top:6px;
        border-top:1px dashed rgba(148,163,184,.5);
      }
      .chart-table-title{
        font-size:11px;
        color:var(--text-sub);
        margin-bottom:6px;
      }
      .chart-table-wrapper{
        max-height:260px;
        overflow:auto;
        border-radius:10px;
        border:1px solid rgba(148,163,184,.35);
        background:#fff;
      }
      table.chart-table{
        width:100%;
        border-collapse:separate;
        border-spacing:0;
        font-size:12px;
      }
      .chart-table thead th{
        position:sticky;
        top:0;
        z-index:1;
        background:rgba(241,245,249,.95);
        color:var(--text-sub);
        font-weight:600;
        text-align:left;
        padding:10px 10px;
        border-bottom:1px solid rgba(148,163,184,.35);
        white-space:nowrap;
      }
      .chart-table tbody td{
        padding:9px 10px;
        border-bottom:1px solid rgba(226,232,240,.9);
        white-space:nowrap;
      }
      .chart-table tbody tr:nth-child(odd) td{
        background:#fcfcff;
      }
      .chart-table tbody tr:hover td{
        background:#eef2ff;
      }
      .chart-table td.num{
        text-align:right;
        font-variant-numeric:tabular-nums;
      }
      .chart-table td.sub{
        color:var(--text-sub);
      }
    `;
    document.head.appendChild(style);
  }

  function buildChip(label, checked, onChange, disabled) {
    const el = document.createElement("label");
    el.className = "filter-chip";
    if (checked) el.classList.add("filter-chip-active");

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = !!checked;
    input.disabled = !!disabled;

    const span = document.createElement("span");
    span.textContent = label;

    input.addEventListener("change", () => onChange(input.checked, input));

    el.appendChild(input);
    el.appendChild(span);
    return el;
  }

  function buildRadio(name, items, value, onChange) {
    const wrap = document.createElement("div");
    wrap.className = "chart-mini-radio";
    items.forEach((it) => {
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "radio";
      input.name = name;
      input.value = it.value;
      input.checked = it.value === value;
      input.addEventListener("change", () => {
        if (input.checked) onChange(it.value);
      });
      label.appendChild(input);
      const span = document.createElement("span");
      span.textContent = it.label;
      label.appendChild(span);
      wrap.appendChild(label);
    });
    return wrap;
  }

  function renderCheckboxChips(container, values, stateArr, options) {
    if (!container) return;
    const max = options && options.max ? options.max : null;
    const labelFn =
      options && options.getLabel ? options.getLabel : (v) => v;

    container.innerHTML = "";

    // 默认全选
    if (Array.isArray(stateArr) && stateArr.length === 0) {
      values.forEach((v) => stateArr.push(v));
    }

    values.forEach((v) => {
      const checked = stateArr.includes(v);
      const chip = buildChip(
        labelFn(v),
        checked,
        (isChecked, input) => {
          const idx = stateArr.indexOf(v);

          if (isChecked) {
            if (max && stateArr.length >= max && idx === -1) {
              // 到上限了，禁止再选
              input.checked = false;
              return;
            }
            if (idx === -1) stateArr.push(v);
          } else {
            if (idx !== -1) stateArr.splice(idx, 1);
            // 至少保留一个
            if (stateArr.length === 0) {
              stateArr.push(v);
              input.checked = true;
              return;
            }
          }

          if (typeof options.onChange === "function") options.onChange();
        },
        false
      );
      container.appendChild(chip);
    });
  }

  function renderDimChipsWithMerge(
    container,
    values,
    stateArr,
    mergeObj,
    mergeKey,
    options
  ) {
    if (!container) return;
    const labelFn =
      options && options.getLabel ? options.getLabel : (v) => v;
    const onChange = options && options.onChange ? options.onChange : null;

    container.innerHTML = "";

    // 默认全选
    if (Array.isArray(stateArr) && stateArr.length === 0) {
      values.forEach((v) => stateArr.push(v));
    }

    // merge chip
    const mergeChecked = !!mergeObj[mergeKey];
    const mergeChip = buildChip(
      "全选但不区分",
      mergeChecked,
      (isChecked) => {
        mergeObj[mergeKey] = isChecked;

        if (isChecked) {
          // 逻辑为全选
          stateArr.length = 0;
          values.forEach((v) => stateArr.push(v));
        } else {
          // 取消 merge 后仍保持全选（用户可再手动勾选/取消）
          if (stateArr.length === 0) values.forEach((v) => stateArr.push(v));
        }
        if (typeof onChange === "function") onChange();
        // 重新渲染，更新 disabled 状态
        renderDimChipsWithMerge(
          container,
          values,
          stateArr,
          mergeObj,
          mergeKey,
          options
        );
      },
      false
    );
    container.appendChild(mergeChip);

    // value chips
    values.forEach((v) => {
      const checked = stateArr.includes(v);
      const chip = buildChip(
        labelFn(v),
        mergeChecked ? true : checked,
        (isChecked, input) => {
          // merge 模式下不允许改动
          if (mergeObj[mergeKey]) {
            input.checked = true;
            return;
          }

          const idx = stateArr.indexOf(v);
          if (isChecked) {
            if (idx === -1) stateArr.push(v);
          } else {
            if (idx !== -1) stateArr.splice(idx, 1);
            if (stateArr.length === 0) {
              stateArr.push(v);
              input.checked = true;
              return;
            }
          }
          if (typeof onChange === "function") onChange();
        },
        mergeChecked // disabled when mergeChecked
      );
      container.appendChild(chip);
    });
  }

  function collectUniqueDims(RAW) {
    const months = Object.keys(RAW || {}).sort();
    const countries = [];
    const medias = [];
    const productTypes = [];
    months.forEach((m) => {
      const rows = RAW[m] || [];
      rows.forEach((r) => {
        if (r && r.country) countries.push(r.country);
        if (r && r.media) medias.push(r.media);
        if (r && r.productType) productTypes.push(r.productType);
      });
    });

    const countryU = uniq(countries);
    const mediaU = uniq(medias).sort();
    const ptU = uniq(productTypes).sort();

    const orderedCountries = [];
    COUNTRY_ORDER.forEach((c) => {
      if (countryU.includes(c)) orderedCountries.push(c);
    });
    countryU
      .filter((c) => !COUNTRY_ORDER.includes(c))
      .sort()
      .forEach((c) => orderedCountries.push(c));

    return {
      months,
      countries: orderedCountries,
      medias: mediaU,
      productTypes: ptU,
    };
  }

  function filterRowsForMonths(RAW, months) {
    const out = [];
    months.forEach((m) => {
      const rows = RAW[m] || [];
      rows.forEach((r) => out.push(r));
    });
    return out;
  }

  function matchSelection(val, selectedArr) {
    if (!selectedArr || selectedArr.length === 0) return true;
    return selectedArr.includes(val);
  }

  function aggregateMonthlyPayRate(RAW, months, dims, selected, dayType) {
    // dims: ["country", "media", "productType"] subset
    const result = new Map(); // key -> {reg, pay}
    months.forEach((m) => {
      const rows = RAW[m] || [];
      rows.forEach((r) => {
        if (!r) return;
        if (!matchSelection(r.country, selected.countries)) return;
        if (!matchSelection(r.media, selected.medias)) return;
        if (!matchSelection(r.productType, selected.productTypes)) return;

        const keyParts = [m];
        dims.forEach((d) => keyParts.push(r[d] || ""));
        const key = keyParts.join("|");

        const reg = Number(r.registration) || 0;
        const pay =
          dayType === "D0"
            ? Number(r.D0_unique_purchase) || 0
            : Number(r.D7_unique_purchase) || 0;

        const cur = result.get(key) || { reg: 0, pay: 0 };
        cur.reg += reg;
        cur.pay += pay;
        result.set(key, cur);
      });
    });
    return result; // month|dim1|dim2...
  }

  function buildBarOption(RAW, st, allDims) {
    const months = (st.months && st.months.length
      ? st.months
      : allDims.months.slice(-3)
    ).slice(0, 3);
    const dayTypes =
      st.dayTypes && st.dayTypes.length ? st.dayTypes.slice() : DAY_TYPES.slice();

    // 维度合并：如果国家 merge，则只显示 ALL
    const xCountries = st.merge.countries
      ? ["ALL"]
      : st.countries && st.countries.length
      ? st.countries
      : allDims.countries;

    const palette =
      window.PaidDashboard && PaidDashboard.COLORS
        ? PaidDashboard.COLORS
        : ["#2563eb", "#16a34a", "#f97316", "#7c3aed", "#ef4444", "#0f766e"];

    // 预聚合：month|country -> {reg, d0, d7}
    const monthCountryAgg = new Map();
    months.forEach((m) => {
      const rows = RAW[m] || [];
      rows.forEach((r) => {
        if (!r) return;

        if (!st.merge.countries) {
          if (!matchSelection(r.country, st.countries)) return;
        }
        if (!matchSelection(r.media, st.medias)) return;
        if (!matchSelection(r.productType, st.productTypes)) return;

        const cKey = st.merge.countries ? "ALL" : r.country || "";
        const key = m + "|" + cKey;
        const cur = monthCountryAgg.get(key) || { reg: 0, d0: 0, d7: 0 };
        cur.reg += Number(r.registration) || 0;
        cur.d0 += Number(r.D0_unique_purchase) || 0;
        cur.d7 += Number(r.D7_unique_purchase) || 0;
        monthCountryAgg.set(key, cur);
      });
    });

    const series = [];
    months.forEach((m, mi) => {
      const baseColor = palette[mi % palette.length];
      dayTypes.forEach((dt) => {
        const data = xCountries.map((c) => {
          const agg = monthCountryAgg.get(m + "|" + c) || {
            reg: 0,
            d0: 0,
            d7: 0,
          };
          const pay = dt === "D0" ? agg.d0 : agg.d7;
          const v = safeDiv(pay, agg.reg);
          return v == null ? null : v * 100;
        });

        const itemStyle = { color: baseColor };
        if (dt === "D7") {
          itemStyle.shadowBlur = 10;
          itemStyle.shadowOffsetX = 2;
          itemStyle.shadowOffsetY = 2;
          itemStyle.shadowColor = "rgba(15, 23, 42, 0.18)";
        }

        series.push({
          name: formatMonthLabel(m) + " · " + dt,
          type: "bar",
          data,
          itemStyle,
          emphasis: { focus: "series" },
        });
      });
    });

    return {
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        valueFormatter: (val) => (val == null ? "" : Number(val).toFixed(1) + "%"),
      },
      legend: { type: "scroll" },
      grid: { left: 40, right: 20, top: 40, bottom: 40 },
      xAxis: { type: "category", data: xCountries },
      yAxis: {
        type: "value",
        name: "付费率 %",
        axisLabel: { formatter: (v) => Number(v).toFixed(0) + "%" },
      },
      series,
    };
  }

  function buildLineOption(RAW, st, allDims) {
    const months = (st.months && st.months.length
      ? st.months
      : allDims.months.slice(-3)
    ).slice(0, 3);
    const dayTypes =
      st.dayTypes && st.dayTypes.length ? st.dayTypes.slice() : DAY_TYPES.slice();

    const useCountry = !st.merge.countries;
    const useMedia = !st.merge.medias;
    const useProduct = !st.merge.productTypes;

    const selectedCountries = useCountry
      ? st.countries && st.countries.length
        ? st.countries
        : allDims.countries
      : allDims.countries;
    const selectedMedias =
      st.medias && st.medias.length ? st.medias : allDims.medias;
    const selectedPT =
      st.productTypes && st.productTypes.length
        ? st.productTypes
        : allDims.productTypes;

    const rows = filterRowsForMonths(RAW, months);

    // date|key -> sums
    const acc = new Map();
    rows.forEach((r) => {
      if (!r) return;

      if (useCountry && !matchSelection(r.country, selectedCountries)) return;
      if (!matchSelection(r.media, selectedMedias)) return;
      if (!matchSelection(r.productType, selectedPT)) return;

      const date = r.date;
      if (!date) return;

      const keyParts = [];
      if (useCountry) keyParts.push(r.country || "");
      if (useMedia) keyParts.push(r.media || "");
      if (useProduct) keyParts.push(r.productType || "");

      const key = keyParts.join(" · ") || "ALL";

      const mapKey = date + "|" + key;
      const cur = acc.get(mapKey) || { reg: 0, d0: 0, d7: 0 };
      cur.reg += Number(r.registration) || 0;
      cur.d0 += Number(r.D0_unique_purchase) || 0;
      cur.d7 += Number(r.D7_unique_purchase) || 0;
      acc.set(mapKey, cur);
    });

    // collect dates & keys
    const dateSet = new Set();
    const keySet = new Set();
    acc.forEach((_v, k) => {
      const idx = k.indexOf("|");
      if (idx === -1) return;
      dateSet.add(k.slice(0, idx));
      keySet.add(k.slice(idx + 1));
    });

    const dates = Array.from(dateSet).sort(); // YYYY-MM-DD 字符串可直接排序
    const keys = Array.from(keySet).sort();

    const series = [];
    keys.forEach((k) => {
      dayTypes.forEach((dt) => {
        const data = [];
        dates.forEach((d) => {
          const v = acc.get(d + "|" + k);
          if (!v) return;
          const pay = dt === "D0" ? v.d0 : v.d7;
          const r01 = safeDiv(pay, v.reg);
          const pct = r01 == null ? null : r01 * 100;
          if (pct == null) return;
          data.push([d, pct]);
        });

        series.push({
          name: k + " · " + dt,
          type: "line",
          data,
          showSymbol: false,
          smooth: 0.15,
          lineStyle: { type: dt === "D0" ? "dashed" : "solid" },
          emphasis: { focus: "series" },
        });
      });
    });

    return {
      tooltip: {
        trigger: "axis",
        valueFormatter: (val) => (val == null ? "" : Number(val).toFixed(1) + "%"),
      },
      legend: { type: "scroll" },
      grid: { left: 40, right: 20, top: 40, bottom: 40 },
      xAxis: { type: "time" },
      yAxis: {
        type: "value",
        name: "付费率 %",
        axisLabel: { formatter: (v) => Number(v).toFixed(0) + "%" },
      },
      series,
    };
  }

  function buildTable(cardEl, RAW, st, allDims) {
    const months = (st.months && st.months.length
      ? st.months
      : allDims.months.slice(-3)
    ).slice(0, 3);
    const dayTypes =
      st.dayTypes && st.dayTypes.length ? st.dayTypes.slice() : DAY_TYPES.slice();

    const selectedMedias =
      st.medias && st.medias.length ? st.medias : allDims.medias;
    const selectedPT =
      st.productTypes && st.productTypes.length
        ? st.productTypes
        : allDims.productTypes;

    // 只有折线图时才“按 media / productType 拆表”，柱状图默认按国家汇总
    const showMediaCol =
      st.view === "line" && !st.merge.medias && selectedMedias.length > 1;
    const showPTCol =
      st.view === "line" &&
      !st.merge.productTypes &&
      selectedPT.length > 1;

    const dims = [];
    const showCountryCol = !st.merge.countries;
    if (showCountryCol) dims.push("country");
    if (showMediaCol) dims.push("media");
    if (showPTCol) dims.push("productType");

    const aggD0 = aggregateMonthlyPayRate(RAW, months, dims, st, "D0");
    const aggD7 = aggregateMonthlyPayRate(RAW, months, dims, st, "D7");

    // 汇总所有 row keys（去掉月份前缀）
    const rowKeySet = new Set();
    function pushKeys(map) {
      map.forEach((_v, k) => {
        const parts = k.split("|");
        parts.shift();
        rowKeySet.add(parts.join("|"));
      });
    }
    pushKeys(aggD0);
    pushKeys(aggD7);

    const rowKeys = Array.from(rowKeySet);

    // 排序：优先国家顺序，其余自然排序
    const countryRank = new Map();
    allDims.countries.forEach((c, i) => countryRank.set(c, i));

    rowKeys.sort((a, b) => {
      const pa = a.split("|");
      const pb = b.split("|");
      const ca = showCountryCol ? pa[0] || "ALL" : "ALL";
      const cb = showCountryCol ? pb[0] || "ALL" : "ALL";
      const ra = countryRank.has(ca) ? countryRank.get(ca) : 999;
      const rb = countryRank.has(cb) ? countryRank.get(cb) : 999;
      if (ra !== rb) return ra - rb;
      return a.localeCompare(b);
    });

    // table title
    const titleEl = cardEl.querySelector('[data-role="table-title"]');
    if (titleEl) {
      const mediaPart = selectedMedias.length ? selectedMedias.join("+") : "";
      const ptPart = selectedPT.length ? selectedPT.join("+") : "";
      const suffix = [mediaPart, ptPart].filter(Boolean).join("，");
      titleEl.textContent = suffix ? `数据表（${suffix}）` : "数据表";
    }

    const tableEl = cardEl.querySelector('[data-role="table"]');
    if (!tableEl) return;

    const ths = [];
    if (showCountryCol) ths.push("国家");
    if (showMediaCol) ths.push("媒体");
    if (showPTCol) ths.push("产品类型");

    months.forEach((m) => {
      dayTypes.forEach((dt) => {
        ths.push(`${formatMonthLabel(m)} ${dt}付费率`);
      });
    });

    let html = "";
    html += '<table class="chart-table">';
    html += "<thead><tr>";
    ths.forEach((h) => (html += "<th>" + h + "</th>"));
    html += "</tr></thead><tbody>";

    function getRate(month, rowKey, dt) {
      const map = dt === "D0" ? aggD0 : aggD7;
      const key = month + "|" + rowKey;
      const agg = map.get(key);
      if (!agg) return null;
      const v = safeDiv(agg.pay, agg.reg);
      return v == null ? null : v * 100;
    }

    rowKeys.forEach((rk) => {
      const parts = rk ? rk.split("|") : [];
      let pIdx = 0;

      html += "<tr>";

      if (showCountryCol) {
        const c = parts[pIdx] || "ALL";
        html += `<td><strong>${c}</strong></td>`;
        pIdx += 1;
      }
      if (showMediaCol) {
        const md = parts[pIdx] || "-";
        html += `<td class="sub">${md}</td>`;
        pIdx += 1;
      }
      if (showPTCol) {
        const pt = parts[pIdx] || "-";
        html += `<td class="sub">${pt}</td>`;
        pIdx += 1;
      }

      months.forEach((m) => {
        dayTypes.forEach((dt) => {
          const val = getRate(m, rk, dt);
          html += `<td class="num">${fmtPct(val, 1)}</td>`;
        });
      });

      html += "</tr>";
    });

    html += "</tbody></table>";
    tableEl.innerHTML = html;
  }

  function ensureTableArea(cardEl) {
    const summary = cardEl.querySelector(".chart-summary");
    if (!summary) return;

    let section = cardEl.querySelector('[data-role="table-section"]');
    if (section) return;

    ensureTableStyles();

    section = document.createElement("div");
    section.className = "chart-table-section";
    section.setAttribute("data-role", "table-section");

    const title = document.createElement("div");
    title.className = "chart-table-title";
    title.setAttribute("data-role", "table-title");
    title.textContent = "数据表";

    const wrapper = document.createElement("div");
    wrapper.className = "chart-table-wrapper";

    const tableHost = document.createElement("div");
    tableHost.setAttribute("data-role", "table");

    wrapper.appendChild(tableHost);
    section.appendChild(title);
    section.appendChild(wrapper);

    summary.parentNode.insertBefore(section, summary);
  }

  function init() {
    const RAW = window.RAW_PAID_BY_MONTH || {};
    const allDims = collectUniqueDims(RAW);

    const dom = document.getElementById("chart-paid-pay-rate");
    if (!dom || !window.echarts) return;

    const cardEl =
      document.getElementById("card-paid-pay-rate") || dom.closest(".chart-card");
    if (!cardEl) return;

    ensureTableArea(cardEl);

    const chart = echarts.init(dom);
    if (window.PaidDashboard && typeof PaidDashboard.registerChart === "function") {
      PaidDashboard.registerChart(chart);
    }

    const st = {
      view: "bar",
      months: allDims.months.slice(-3),
      countries: allDims.countries.slice(),
      medias: allDims.medias.slice(),
      productTypes: allDims.productTypes.slice(),
      dayTypes: DAY_TYPES.slice(),
      merge: { countries: false, medias: false, productTypes: false },
    };

    const controls = cardEl.querySelector(".chart-controls");
    if (controls) {
      const old = controls.querySelector('[data-role="module-filters"]');
      if (old) old.remove();

      const filtersWrap = document.createElement("div");
      filtersWrap.setAttribute("data-role", "module-filters");

      const fView = document.createElement("div");
      fView.className = "chart-mini-filter";
      const viewLabel = document.createElement("span");
      viewLabel.className = "chart-mini-label";
      viewLabel.textContent = "视图：";
      const radios = buildRadio(
        "paid-pay-rate-view",
        [
          { value: "bar", label: "月度柱状图" },
          { value: "line", label: "日级折线图" },
        ],
        st.view,
        (v) => {
          st.view = v;
          render();
        }
      );
      fView.appendChild(viewLabel);
      fView.appendChild(radios);

      const fMonths = document.createElement("div");
      fMonths.className = "chart-mini-filter";
      const monthsLabel = document.createElement("span");
      monthsLabel.className = "chart-mini-label";
      monthsLabel.textContent = "月份（最多3个）：";
      const monthsChips = document.createElement("div");
      monthsChips.className = "chart-mini-chips";
      fMonths.appendChild(monthsLabel);
      fMonths.appendChild(monthsChips);

      const fCountries = document.createElement("div");
      fCountries.className = "chart-mini-filter";
      const cLabel = document.createElement("span");
      cLabel.className = "chart-mini-label";
      cLabel.textContent = "国家：";
      const cChips = document.createElement("div");
      cChips.className = "chart-mini-chips";
      fCountries.appendChild(cLabel);
      fCountries.appendChild(cChips);

      const fMedias = document.createElement("div");
      fMedias.className = "chart-mini-filter";
      const mLabel = document.createElement("span");
      mLabel.className = "chart-mini-label";
      mLabel.textContent = "媒体：";
      const mChips = document.createElement("div");
      mChips.className = "chart-mini-chips";
      fMedias.appendChild(mLabel);
      fMedias.appendChild(mChips);

      const fPT = document.createElement("div");
      fPT.className = "chart-mini-filter";
      const pLabel = document.createElement("span");
      pLabel.className = "chart-mini-label";
      pLabel.textContent = "产品类型：";
      const pChips = document.createElement("div");
      pChips.className = "chart-mini-chips";
      fPT.appendChild(pLabel);
      fPT.appendChild(pChips);

      const fDay = document.createElement("div");
      fDay.className = "chart-mini-filter";
      const dLabel = document.createElement("span");
      dLabel.className = "chart-mini-label";
      dLabel.textContent = "数据：";
      const dChips = document.createElement("div");
      dChips.className = "chart-mini-chips";
      fDay.appendChild(dLabel);
      fDay.appendChild(dChips);

      filtersWrap.appendChild(fView);
      filtersWrap.appendChild(fMonths);
      filtersWrap.appendChild(fCountries);
      filtersWrap.appendChild(fMedias);
      filtersWrap.appendChild(fPT);
      filtersWrap.appendChild(fDay);

      controls.appendChild(filtersWrap);

      renderCheckboxChips(monthsChips, allDims.months, st.months, {
        max: 3,
        getLabel: (m) => formatMonthLabel(m),
        onChange: render,
      });

      renderDimChipsWithMerge(
        cChips,
        allDims.countries,
        st.countries,
        st.merge,
        "countries",
        { onChange: render }
      );
      renderDimChipsWithMerge(
        mChips,
        allDims.medias,
        st.medias,
        st.merge,
        "medias",
        { onChange: render }
      );
      renderDimChipsWithMerge(
        pChips,
        allDims.productTypes,
        st.productTypes,
        st.merge,
        "productTypes",
        { onChange: render }
      );

      renderCheckboxChips(dChips, DAY_TYPES, st.dayTypes, {
        max: 2,
        getLabel: (d) => d,
        onChange: render,
      });
    }

    function render() {
      if (!allDims.months.length) {
        chart.clear();
        buildTable(cardEl, RAW, st, allDims);
        return;
      }
      const option =
        st.view === "line"
          ? buildLineOption(RAW, st, allDims)
          : buildBarOption(RAW, st, allDims);
      chart.setOption(option, true);
      buildTable(cardEl, RAW, st, allDims);
    }

    render();
  }

  if (window.PaidDashboard && typeof PaidDashboard.registerModule === "function") {
    PaidDashboard.registerModule(MODULE_ID, init);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
