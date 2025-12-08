/**
 * paid-module-cpp.js
 * ------------------------------------------------------------
 * 指标：D0/D7 充值单价（CPP）
 * - D0 CPP = spent / D0_unique_purchase
 * - D7 CPP = spent / D7_unique_purchase
 *
 * 图表：
 * - 月度柱状图：x=国家（GH/KE/NG/TZ），series=月份×(D0/D7)
 * - 日级折线图：x=日期（跨月连续），series=国家×媒体×产品类型×(D0/D7)
 *            支持「全选但不区分」合并国家/媒体/产品类型维度
 *
 * 表格：
 * - 行：国家（可选追加媒体/产品类型维度）
 * - 列：选中的月份 × (D0/D7) 充值单价
 *
 * 依赖：
 * - window.RAW_PAID_BY_MONTH（来自 paid-data.js）
 * - window.echarts
 * - （可选）window.PaidDashboard.registerModule / registerChart
 */

(function () {
  const MODULE_KEY = "cpp";
  const CARD_ID = "card-paid-cpp";
  const CHART_ID = "chart-paid-cpp";

  const COUNTRY_ORDER = ["GH", "KE", "NG", "TZ"]; // 本模块固定顺序
  const MAX_MONTHS = 3;

  const DEFAULT_PALETTE = [
    "#2563eb",
    "#16a34a",
    "#f97316",
    "#7c3aed",
    "#ef4444",
    "#0f766e",
    "#0891b2",
    "#a855f7",
    "#b45309",
    "#334155",
  ];

  function uniq(arr) {
    return Array.from(new Set(arr));
  }

  function safeDiv(a, b) {
    const na = Number(a);
    const nb = Number(b);
    if (!isFinite(na) || !isFinite(nb) || nb === 0) return null;
    return na / nb;
  }

  function formatMonthLabel(monthKey) {
    // "2025-09" => "9月"
    if (!monthKey) return "-";
    const parts = String(monthKey).split("-");
    const mm = parts[1] || monthKey;
    const mNum = parseInt(mm, 10);
    return (isFinite(mNum) ? mNum : mm) + "月";
  }

  function formatUSD(v, digits) {
    const d = typeof digits === "number" ? digits : 2;
    if (v == null || !isFinite(v)) return "-";
    return Number(v).toLocaleString(undefined, {
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    });
  }

  function byOrder(orderArr) {
    const idx = new Map();
    orderArr.forEach((v, i) => idx.set(v, i));
    return (a, b) => (idx.get(a) ?? 999) - (idx.get(b) ?? 999);
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function displayMedia(m) {
    return String(m || "").toLowerCase();
  }
  function displayProduct(p) {
    return String(p || "").toLowerCase();
  }

  function buildChip(label, checked, onChange, disabled) {
    const wrap = el(
      "label",
      "filter-chip" + (checked ? " filter-chip-active" : "")
    );
    const input = el("input");
    input.type = "checkbox";
    input.checked = !!checked;
    input.disabled = !!disabled;

    // 先执行业务 onChange，再同步 active 样式
    input.addEventListener("change", () => onChange(input.checked, input));

    wrap.appendChild(input);
    wrap.appendChild(document.createTextNode(" " + label));

    function sync() {
      if (input.checked) wrap.classList.add("filter-chip-active");
      else wrap.classList.remove("filter-chip-active");
    }
    input.addEventListener("change", sync);
    sync();
    return wrap;
  }

  function ensureNonEmpty(arr, fallbackValues) {
    if (arr.length > 0) return;
    fallbackValues.forEach((v) => arr.push(v));
  }

  function init() {
    const RAW = window.RAW_PAID_BY_MONTH || {};
    if (!RAW || typeof RAW !== "object") return;

    const card = document.getElementById(CARD_ID);
    const chartDom = document.getElementById(CHART_ID);
    if (!card || !chartDom || !window.echarts) return;

    const palette =
      (window.PaidDashboard && window.PaidDashboard.COLORS) || DEFAULT_PALETTE;

    // 1) 计算筛选项（动态：月份/media/productType；国家固定）
    const allMonths = Object.keys(RAW).sort();
    const monthIndex = new Map();
    allMonths.forEach((m, i) => monthIndex.set(m, i));

    const allMedias = [];
    const allProductTypes = [];

    allMonths.forEach((m) => {
      (RAW[m] || []).forEach((r) => {
        if (!r) return;
        if (r.media) allMedias.push(String(r.media));
        if (r.productType) allProductTypes.push(String(r.productType));
      });
    });

    // 媒体：优先 FB/GG 顺序，其余按字母
    const medias = uniq(allMedias).sort((a, b) => {
      const ord = ["FB", "GG"];
      const ia = ord.indexOf(a);
      const ib = ord.indexOf(b);
      if (ia !== -1 || ib !== -1)
        return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
      return String(a).localeCompare(String(b));
    });

    // 产品：优先 app / h5
    const productTypes = uniq(allProductTypes).sort((a, b) => {
      const norm = (x) => String(x || "").toLowerCase();
      const ord = ["app", "h5"];
      const ia = ord.indexOf(norm(a));
      const ib = ord.indexOf(norm(b));
      if (ia !== -1 || ib !== -1)
        return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
      return String(a).localeCompare(String(b));
    });

    // 国家：本模块固定展示顺序（GH/KE/NG/TZ）
    const countries = COUNTRY_ORDER.slice();

    // 2) 模块内状态（不依赖全局 filterState）
    const state = {
      view: "bar", // "bar" | "line"
      months: [],
      countries: countries.slice(),
      medias: medias.slice(),
      productTypes: productTypes.slice(),
      ds: ["D0", "D7"], // 多选：["D0","D7"]
      noSplit: {
        countries: false,
        medias: false,
        productTypes: false,
      },
      _prev: {
        countries: countries.slice(),
        medias: medias.slice(),
        productTypes: productTypes.slice(),
      },
    };

    // 默认月份：优先最新 2 个月（不足则全选），并限制 MAX_MONTHS
    const defaultMonths = allMonths.slice(Math.max(0, allMonths.length - 2));
    state.months = defaultMonths.slice(0, MAX_MONTHS);

    // 3) UI 注入：把筛选器塞到当前卡片 header 的 chart-controls 里
    const header = card.querySelector(".chart-card-header");
    const controls = header ? header.querySelector(".chart-controls") : null;
    if (!controls) return;

    let filterRoot = controls.querySelector('[data-module="cpp-filters"]');
    if (!filterRoot) {
      filterRoot = el("div");
      filterRoot.dataset.module = "cpp-filters";
      filterRoot.style.display = "flex";
      filterRoot.style.flexDirection = "column";
      filterRoot.style.alignItems = "flex-end";
      filterRoot.style.gap = "8px";
      controls.insertBefore(filterRoot, controls.firstChild);
    }

    function lineFilterRow(labelText, chipsId) {
      const row = el("div", "chart-mini-filter");
      const label = el("span", "chart-mini-label", labelText);
      const chips = el("div", "chart-mini-chips");
      chips.id = chipsId;
      row.appendChild(label);
      row.appendChild(chips);
      return { row, chips };
    }

    // 视图切换（柱状/折线）
    const viewRow = el("div", "chart-mini-radio");
    viewRow.style.justifyContent = "flex-end";
    viewRow.innerHTML =
      '<label><input type="radio" name="cpp-view" value="bar"> 月度柱状图</label>' +
      '<label><input type="radio" name="cpp-view" value="line"> 日级折线图</label>';
    filterRoot.appendChild(viewRow);

    const monthsRow = lineFilterRow("月份：", "cpp-months");
    const countriesRow = lineFilterRow("国家：", "cpp-countries");
    const mediasRow = lineFilterRow("媒体：", "cpp-medias");
    const productsRow = lineFilterRow("产品类型：", "cpp-products");
    const dRow = lineFilterRow("D0/D7：", "cpp-ds");

    filterRoot.appendChild(monthsRow.row);
    filterRoot.appendChild(countriesRow.row);
    filterRoot.appendChild(mediasRow.row);
    filterRoot.appendChild(productsRow.row);
    filterRoot.appendChild(dRow.row);

    // 4) 表格区域（插到 chart-summary 之后）
    let tableSection = card.querySelector(
      '.chart-table-section[data-module="cpp"]'
    );
    if (!tableSection) {
      tableSection = el("div", "chart-table-section");
      tableSection.dataset.module = "cpp";

      const title = el("div", "chart-table-title");
      title.id = "cpp-table-title";

      const wrap = el("div", "chart-table-wrapper");
      const table = el("table", "chart-table");
      table.id = "cpp-table";
      wrap.appendChild(table);

      tableSection.appendChild(title);
      tableSection.appendChild(wrap);

      const summary = card.querySelector(".chart-summary") || null;
      if (summary && summary.parentElement === card) {
        summary.insertAdjacentElement("afterend", tableSection);
      } else {
        card.appendChild(tableSection);
      }
    }

    const tableTitleEl = tableSection.querySelector("#cpp-table-title");
    const tableEl = tableSection.querySelector("#cpp-table");

    // 5) 图表实例
    const chart = echarts.init(chartDom);
    if (
      window.PaidDashboard &&
      typeof window.PaidDashboard.registerChart === "function"
    ) {
      window.PaidDashboard.registerChart(chart);
    }

    // ============ 数据聚合 ============
    function rowPassFilters(r) {
      if (!r) return false;

      // 国家固定：只看 GH/KE/NG/TZ
      if (r.country && COUNTRY_ORDER.indexOf(String(r.country)) === -1)
        return false;

      if (
        state.countries.length &&
        state.countries.indexOf(String(r.country)) === -1
      )
        return false;
      if (state.medias.length && state.medias.indexOf(String(r.media)) === -1)
        return false;
      if (
        state.productTypes.length &&
        state.productTypes.indexOf(String(r.productType)) === -1
      )
        return false;

      return true;
    }

    function aggKey(r) {
      const c = state.noSplit.countries ? "ALL" : String(r.country);
      const m = state.noSplit.medias ? "ALL" : String(r.media);
      const p = state.noSplit.productTypes ? "ALL" : String(r.productType);
      return c + "||" + m + "||" + p;
    }

    function aggMonth(monthKey) {
      const rows = RAW[monthKey] || [];
      const map = new Map(); // key -> { country, media, productType, spent, d0p, d7p }
      rows.forEach((r) => {
        if (!rowPassFilters(r)) return;

        const key = aggKey(r);
        const parts = key.split("||");
        const c = parts[0];
        const m = parts[1];
        const p = parts[2];

        if (!map.has(key)) {
          map.set(key, {
            country: c,
            media: m,
            productType: p,
            spent: 0,
            d0p: 0,
            d7p: 0,
          });
        }
        const acc = map.get(key);
        acc.spent += Number(r.spent) || 0;
        acc.d0p += Number(r.D0_unique_purchase) || 0;
        acc.d7p += Number(r.D7_unique_purchase) || 0;
      });
      return map;
    }

    function aggMonthByCountryOnly(monthKey) {
      const rows = RAW[monthKey] || [];
      const map = new Map(); // countryKey -> { spent, d0p, d7p }
      rows.forEach((r) => {
        if (!rowPassFilters(r)) return;
        const c = state.noSplit.countries ? "ALL" : String(r.country);

        if (!map.has(c)) map.set(c, { spent: 0, d0p: 0, d7p: 0 });
        const acc = map.get(c);
        acc.spent += Number(r.spent) || 0;
        acc.d0p += Number(r.D0_unique_purchase) || 0;
        acc.d7p += Number(r.D7_unique_purchase) || 0;
      });
      return map;
    }

    function aggDaily(monthKeys) {
      // 返回：{ dates: [...], byKey: Map(key -> {country,media,productType, byDate: Map(date -> {spent,d0p,d7p})}) }
      const byKey = new Map();
      const dates = new Set();

      monthKeys.forEach((m) => {
        (RAW[m] || []).forEach((r) => {
          if (!rowPassFilters(r)) return;
          const date = String(r.date || "");
          if (!date) return;

          dates.add(date);

          const key = aggKey(r);
          const parts = key.split("||");
          const meta = {
            country: parts[0],
            media: parts[1],
            productType: parts[2],
          };

          if (!byKey.has(key)) {
            byKey.set(key, { ...meta, byDate: new Map() });
          }
          const item = byKey.get(key);
          if (!item.byDate.has(date)) {
            item.byDate.set(date, { spent: 0, d0p: 0, d7p: 0 });
          }
          const acc = item.byDate.get(date);
          acc.spent += Number(r.spent) || 0;
          acc.d0p += Number(r.D0_unique_purchase) || 0;
          acc.d7p += Number(r.D7_unique_purchase) || 0;
        });
      });

      const dateList = Array.from(dates).sort();
      return { dates: dateList, byKey };
    }

    // ============ 渲染：筛选器 ============
    function renderViewToggle() {
      const inputs = viewRow.querySelectorAll('input[name="cpp-view"]');
      inputs.forEach((inp) => {
        inp.checked = inp.value === state.view;

        // 只绑定一次
        if (inp.dataset.bound === "1") return;
        inp.dataset.bound = "1";

        inp.addEventListener("change", () => {
          if (!inp.checked) return;
          state.view = inp.value === "line" ? "line" : "bar";
          renderAll(); // 切视图不需要全量重建 chips
        });
      });
    }

    function renderMonthsChips() {
      const container = monthsRow.chips;
      container.innerHTML = "";

      // 月份 chip：最多 MAX_MONTHS
      allMonths.forEach((m) => {
        const checked = state.months.indexOf(m) !== -1;
        const chip = buildChip(
          formatMonthLabel(m),
          checked,
          (isOn, input) => {
            if (isOn) {
              if (state.months.indexOf(m) === -1) {
                if (state.months.length >= MAX_MONTHS) {
                  input.checked = false; // 超过上限：直接反选回去
                  return;
                }
                state.months.push(m);
              }
            } else {
              state.months = state.months.filter((x) => x !== m);
            }

            ensureNonEmpty(state.months, defaultMonths.slice(0, MAX_MONTHS));

            // 按真实月份顺序排
            state.months.sort(
              (a, b) => (monthIndex.get(a) ?? 999) - (monthIndex.get(b) ?? 999)
            );

            renderAll();
            renderFilters(); // 重新刷一遍，保证 chip 状态一致
          },
          false
        );
        container.appendChild(chip);
      });
    }

    function renderDimChips(dim, container, values, selectedArr, labelFn) {
      container.innerHTML = "";

      const noSplitChecked = !!state.noSplit[dim];

      // “全选但不区分”
      container.appendChild(
        buildChip(
          "全选但不区分",
          noSplitChecked,
          (isOn) => {
            state.noSplit[dim] = isOn;

            if (isOn) {
              state._prev[dim] = selectedArr.slice();
              selectedArr.length = 0;
              values.forEach((v) => selectedArr.push(v));
            } else {
              selectedArr.length = 0;
              const prev = state._prev[dim] || [];
              if (prev.length) prev.forEach((v) => selectedArr.push(v));
              else values.forEach((v) => selectedArr.push(v));

              // 防止 restore 出来包含旧值
              for (let i = selectedArr.length - 1; i >= 0; i--) {
                if (values.indexOf(selectedArr[i]) === -1)
                  selectedArr.splice(i, 1);
              }
              ensureNonEmpty(selectedArr, values);
            }

            renderAll();
            renderFilters();
          },
          false
        )
      );

      values.forEach((v) => {
        const checked = noSplitChecked ? true : selectedArr.indexOf(v) !== -1;
        const disabled = noSplitChecked;

        const chip = buildChip(
          labelFn ? labelFn(v) : v,
          checked,
          (isOn) => {
            if (state.noSplit[dim]) return;

            if (isOn) {
              if (selectedArr.indexOf(v) === -1) selectedArr.push(v);
            } else {
              const idx = selectedArr.indexOf(v);
              if (idx !== -1) selectedArr.splice(idx, 1);
            }

            ensureNonEmpty(selectedArr, values);
            renderAll();
            renderFilters();
          },
          disabled
        );
        container.appendChild(chip);
      });
    }

    function renderDsChips() {
      const container = dRow.chips;
      container.innerHTML = "";

      const opts = ["D0", "D7"];
      opts.forEach((d) => {
        const checked = state.ds.indexOf(d) !== -1;
        const chip = buildChip(
          d,
          checked,
          (isOn) => {
            if (isOn) {
              if (state.ds.indexOf(d) === -1) state.ds.push(d);
            } else {
              state.ds = state.ds.filter((x) => x !== d);
            }
            ensureNonEmpty(state.ds, ["D0"]);
            state.ds.sort(byOrder(["D0", "D7"]));
            renderAll();
            renderFilters();
          },
          false
        );
        container.appendChild(chip);
      });
    }

    function renderFilters() {
      renderViewToggle();
      renderMonthsChips();
      renderDimChips("countries", countriesRow.chips, countries, state.countries);
      renderDimChips(
        "medias",
        mediasRow.chips,
        medias,
        state.medias,
        displayMedia
      );
      renderDimChips(
        "productTypes",
        productsRow.chips,
        productTypes,
        state.productTypes,
        displayProduct
      );
      renderDsChips();
    }

    // ============ 渲染：图表 ============
    function buildBarOption(selectedMonths) {
      const cats = state.noSplit.countries
        ? ["ALL"]
        : COUNTRY_ORDER.filter((c) => state.countries.indexOf(c) !== -1);

      // 每个月聚合一次（按国家）
      const monthAgg = {};
      selectedMonths.forEach((m) => {
        monthAgg[m] = aggMonthByCountryOnly(m);
      });

      const series = [];
      const dsOrder = state.ds.slice().sort(byOrder(["D0", "D7"]));

      // 颜色：按选中月份列表顺序
      selectedMonths.forEach((m, mi) => {
        const mColor = palette[mi % palette.length];
        const map = monthAgg[m];

        dsOrder.forEach((d) => {
          const name = formatMonthLabel(m) + " " + d;
          const data = cats.map((c) => {
            const acc = map.get(c) || { spent: 0, d0p: 0, d7p: 0 };
            const denom = d === "D0" ? acc.d0p : acc.d7p;
            return safeDiv(acc.spent, denom);
          });

          const isD7 = d === "D7";
          series.push({
            name,
            type: "bar",
            data,
            barMaxWidth: 28,
            itemStyle: Object.assign(
              { color: mColor },
              isD7
                ? {
                    decal: {
                      symbol: "rect",
                      symbolSize: 1,
                      dashArrayX: [4, 2],
                      dashArrayY: [2, 2],
                      rotation: Math.PI / 4,
                      color: 'rgba(255,255,255,0.4)',
                    },
                  }
                : null
            ),
            emphasis: { focus: "series" },
          });
        });
      });

      return {
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
          valueFormatter: (v) => (v == null ? "-" : formatUSD(v, 2) + " USD"),
        },
        legend: { type: "scroll", top: 0 },
        grid: { left: 50, right: 20, top: 40, bottom: 40 },
        xAxis: { type: "category", data: cats },
        yAxis: {
          type: "value",
          axisLabel: { formatter: (v) => formatUSD(v, 0) },
        },
        series,
      };
    }

    function buildLineOption(selectedMonths) {
      const { dates, byKey } = aggDaily(selectedMonths);
      const dsOrder = state.ds.slice().sort(byOrder(["D0", "D7"]));

      // 色彩：按“基础组合(国家+媒体+产品)”分配；D7 用虚线
      const baseKeys = Array.from(byKey.keys()).sort();
      const baseColor = new Map();
      baseKeys.forEach((k, i) => baseColor.set(k, palette[i % palette.length]));

      const series = [];
      baseKeys.forEach((k) => {
        const item = byKey.get(k);
        if (!item) return;

        // 过滤全空系列（避免 legend 爆炸）
        let hasAny = false;
        dates.forEach((dt) => {
          const a = item.byDate.get(dt);
          if (a && a.spent > 0 && (a.d0p > 0 || a.d7p > 0)) hasAny = true;
        });
        if (!hasAny) return;

        const baseNameParts = [];
        baseNameParts.push(state.noSplit.countries ? "ALL" : item.country);
        if (!state.noSplit.medias) baseNameParts.push(displayMedia(item.media));
        if (!state.noSplit.productTypes)
          baseNameParts.push(displayProduct(item.productType));
        const baseName = baseNameParts.join(" · ");

        const color = baseColor.get(k);

        dsOrder.forEach((d) => {
          const data = dates.map((dt) => {
            const a = item.byDate.get(dt);
            if (!a) return null;
            const denom = d === "D0" ? a.d0p : a.d7p;
            return safeDiv(a.spent, denom);
          });

          if (data.every((x) => x == null)) return;

          series.push({
            name: baseName + " · " + d,
            type: "line",
            showSymbol: false,
            connectNulls: false,
            data,
            lineStyle: {
              width: 2,
              type: d === "D7" ? "dashed" : "solid",
              color,
            },
            itemStyle: { color },
            emphasis: { focus: "series" },
          });
        });
      });

      return {
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "cross" },
          valueFormatter: (v) => (v == null ? "-" : formatUSD(v, 2) + " USD"),
        },
        legend: { type: "scroll", top: 0 },
        grid: { left: 50, right: 20, top: 40, bottom: 50 },
        xAxis: {
          type: "category",
          data: dates,
          axisLabel: { formatter: (v) => String(v).slice(5) }, // "MM-DD"
        },
        yAxis: {
          type: "value",
          axisLabel: { formatter: (v) => formatUSD(v, 0) },
        },
        series,
      };
    }

    // ============ 渲染：表格 ============
    function buildTable(selectedMonths) {
      if (!tableEl) return;
      const dsOrder = state.ds.slice().sort(byOrder(["D0", "D7"]));

      // 表格名（括号里的媒体/产品）
      const mediaTag = state.noSplit.medias
        ? "媒体全选不区分"
        : state.medias.map(displayMedia).join("+") || "媒体-";
      const productTag = state.noSplit.productTypes
        ? "产品全选不区分"
        : state.productTypes.map(displayProduct).join("+") || "产品-";

      if (tableTitleEl) {
        tableTitleEl.textContent =
          "充值单价数据表（" + mediaTag + "，" + productTag + "）";
      }

      // 月度聚合（表格口径：按当前 noSplit 合并）
      const monthAgg = {};
      selectedMonths.forEach((m) => (monthAgg[m] = aggMonth(m)));

      // 收集所有行 key（跨月份并集）
      const rowKeys = new Set();
      selectedMonths.forEach((m) => {
        monthAgg[m].forEach((_v, k) => rowKeys.add(k));
      });

      const rows = Array.from(rowKeys).map((k) => {
        const parts = k.split("||");
        return {
          key: k,
          country: parts[0],
          media: parts[1],
          productType: parts[2],
        };
      });

      // 排序：ALL 优先，其次国家固定顺序；再媒体、产品
      const countryRank = new Map();
      COUNTRY_ORDER.forEach((c, i) => countryRank.set(c, i + 1));
      function rankCountry(c) {
        if (c === "ALL") return 0;
        return countryRank.get(c) ?? 999;
      }
      function rankProduct(p) {
        const n = String(p || "").toLowerCase();
        if (p === "ALL") return 0;
        if (n === "app") return 1;
        if (n === "h5") return 2;
        return 99;
      }

      rows.sort((a, b) => {
        const rc = rankCountry(a.country) - rankCountry(b.country);
        if (rc !== 0) return rc;
        const rm = String(a.media).localeCompare(String(b.media));
        if (rm !== 0) return rm;
        return rankProduct(a.productType) - rankProduct(b.productType);
      });

      // 构建表格 DOM
      const thead = el("thead");
      const trh = el("tr");

      trh.appendChild(el("th", null, "国家"));
      if (!state.noSplit.medias) trh.appendChild(el("th", null, "媒体"));
      if (!state.noSplit.productTypes)
        trh.appendChild(el("th", null, "产品类型"));

      const colDefs = [];
      selectedMonths.forEach((m) => {
        const mLabel = formatMonthLabel(m);
        dsOrder.forEach((d) => {
          const label = mLabel + " " + d + " 充值单价";
          colDefs.push({ month: m, d, label });
          trh.appendChild(el("th", null, label));
        });
      });

      thead.appendChild(trh);

      const tbody = el("tbody");
      rows.forEach((r) => {
        const tr = el("tr");
        tr.appendChild(el("td", null, r.country));
        if (!state.noSplit.medias)
          tr.appendChild(el("td", null, displayMedia(r.media)));
        if (!state.noSplit.productTypes)
          tr.appendChild(el("td", null, displayProduct(r.productType)));

        colDefs.forEach((cdef) => {
          const map = monthAgg[cdef.month];
          const acc = map.get(r.key) || { spent: 0, d0p: 0, d7p: 0 };
          const denom = cdef.d === "D0" ? acc.d0p : acc.d7p;
          const val = safeDiv(acc.spent, denom);
          tr.appendChild(el("td", null, val == null ? "-" : formatUSD(val, 2)));
        });

        tbody.appendChild(tr);
      });

      tableEl.innerHTML = "";
      tableEl.appendChild(thead);
      tableEl.appendChild(tbody);
    }

    // ============ 总渲染 ============
    function renderAll() {
      ensureNonEmpty(state.months, defaultMonths.slice(0, MAX_MONTHS));
      ensureNonEmpty(state.countries, countries);
      ensureNonEmpty(state.medias, medias);
      ensureNonEmpty(state.productTypes, productTypes);
      ensureNonEmpty(state.ds, ["D0"]);

      const selectedMonths = state.months
        .slice()
        .sort((a, b) => (monthIndex.get(a) ?? 999) - (monthIndex.get(b) ?? 999))
        .slice(0, MAX_MONTHS);

      const option =
        state.view === "line"
          ? buildLineOption(selectedMonths)
          : buildBarOption(selectedMonths);

      chart.setOption(option, true);
      buildTable(selectedMonths);
    }

    renderFilters();
    renderAll();
  }

  // 注册到看板
  if (
    window.PaidDashboard &&
    typeof window.PaidDashboard.registerModule === "function"
  ) {
    window.PaidDashboard.registerModule(MODULE_KEY, init);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
