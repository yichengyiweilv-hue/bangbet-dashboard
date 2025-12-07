/**
 * paid-global-filter-sync.js
 * ------------------------------------------------------------
 * 目标：
 * 1) 全局筛选（国家/媒体/产品类型）变动 => 同步到所有模块的子筛选器
 * 2) 模块内子筛选变动不回写全局、不影响其他模块
 *
 * 适配你这套模块的筛选器结构：
 * - 每个模块卡片 id 通常是 card-paid-*
 * - 筛选器行通常是 .chart-mini-filter，里边有 .chart-mini-label + .chart-mini-chips
 * - chip 通常是 label.filter-chip > input[type=checkbox] + 文本
 *
 * 使用方式（放到 paid-monthly 那个主 index.html 里）：
 * 1) 放 3 个容器（可按你现有布局调整位置）：
 *    <div class="chart-mini-chips" id="paid-global-countries"></div>
 *    <div class="chart-mini-chips" id="paid-global-medias"></div>
 *    <div class="chart-mini-chips" id="paid-global-products"></div>
 * 2) 在所有模块脚本之后引入本文件：
 *    <script src="paid-global-filter-sync.js"></script>
 */
(function () {
  "use strict";

  // ===== 1) 你要的全局筛选选项（按需扩展） =====
  const GLOBAL_OPTIONS = {
    countries: ["GH", "KE", "NG", "TZ"],
    medias: ["FB", "GG"], // 兼容 Meta/Google 的别名映射见 canonMedia()
    products: ["H5", "APP"],
  };

  // ===== 2) 你页面里“全局筛选器”3 个 chips 容器 id（按你页面实际改） =====
  const GLOBAL_CONTAINER_IDS = {
    countries: "paid-global-countries",
    medias: "paid-global-medias",
    products: "paid-global-products",
  };

  // ===== 3) 模块卡片选择器：默认同步所有 id 以 card-paid- 开头的卡片 =====
  const MODULE_CARD_SELECTOR = '[id^="card-paid-"]';

  // ===== 4) 归一化（保证大小写/别名都能对齐） =====
  function norm(v) {
    return String(v == null ? "" : v).trim();
  }
  function canonCountry(v) {
    return norm(v).toUpperCase();
  }
  function canonMedia(v) {
    const x = norm(v).toUpperCase();
    if (!x) return "";
    if (x === "FB" || x === "META" || x === "FACEBOOK") return "FB";
    if (x === "GG" || x === "GOOGLE" || x === "ADWORDS") return "GG";
    return x;
  }
  function canonProduct(v) {
    const x = norm(v).toUpperCase();
    if (!x) return "";
    if (x.indexOf("H5") !== -1 || x === "WEB") return "H5";
    if (x.indexOf("APP") !== -1) return "APP";
    return x;
  }

  function $(id) {
    return document.getElementById(id);
  }

  function hasCheckbox(container) {
    return !!(container && container.querySelector('input[type="checkbox"]'));
  }

  function setChipActiveClasses(container) {
    if (!container) return;
    const labels = container.querySelectorAll("label.filter-chip");
    labels.forEach((lab) => {
      const input = lab.querySelector('input[type="checkbox"]');
      if (!input) return;
      lab.classList.toggle("filter-chip-active", !!input.checked);
    });
  }

  function createChip(labelText, value, checked) {
    const lab = document.createElement("label");
    lab.className = "filter-chip" + (checked ? " filter-chip-active" : "");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = value;
    input.checked = !!checked;
    lab.appendChild(input);
    lab.appendChild(document.createTextNode(labelText));
    return lab;
  }

  function renderGlobalGroup(container, values, defaultSelected) {
    if (!container) return;
    // 如果你自己在 HTML 写了 chips，这里就不覆盖
    if (hasCheckbox(container)) {
      setChipActiveClasses(container);
      return;
    }
    const selectedSet = new Set((defaultSelected || []).map((x) => norm(x)));
    container.innerHTML = "";
    (values || []).forEach((v) => {
      container.appendChild(createChip(String(v), String(v), selectedSet.has(String(v))));
    });
  }

  function readSelected(container, allValues) {
    if (!container) return (allValues || []).slice();

    const inputs = Array.from(container.querySelectorAll('input[type="checkbox"]'));
    const selected = inputs
      .filter((i) => !!i.checked)
      .map((i) => norm(i.value || ""));

    // 空选：按“全选”处理
    if (!selected.length) {
      inputs.forEach((i) => (i.checked = true));
      setChipActiveClasses(container);
      return (allValues || []).slice();
    }

    return selected;
  }

  // ===== 5) chips 容器匹配/操作 =====
  function normalizeLabelText(s) {
    return norm(s).replace(/[：:]/g, "");
  }

  function chipTextOf(labelEl) {
    return normalizeLabelText(labelEl ? labelEl.textContent : "");
  }

  function chipKeyOf(labelEl, inputEl) {
    const v = norm(inputEl && inputEl.value);
    if (v && v !== "on" && v !== "1") return normalizeLabelText(v);
    return chipTextOf(labelEl);
  }

  function dispatchChange(input) {
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function toggleInput(input, checked) {
    if (!input) return;
    const prev = !!input.checked;
    input.checked = !!checked;
    if (prev !== !!checked) dispatchChange(input);
  }

  function findFilterRowChips(cardEl, labelKeywords, fallbackSelector) {
    if (!cardEl) return null;

    // 1) 先按 label 找
    const rows = Array.from(cardEl.querySelectorAll(".chart-mini-filter"));
    for (const row of rows) {
      const labelEl = row.querySelector(".chart-mini-label");
      const labelText = normalizeLabelText(labelEl ? labelEl.textContent : "");
      if (!labelText) continue;

      const hit = (labelKeywords || []).some((k) => labelText.indexOf(k) !== -1);
      if (!hit) continue;

      const chips = row.querySelector(".chart-mini-chips");
      if (chips) return chips;
    }

    // 2) 再按已知 id 兜底
    if (fallbackSelector) {
      const el = cardEl.querySelector(fallbackSelector);
      if (el) return el;
    }

    return null;
  }

  function collectChips(container, canonFn) {
    const out = [];
    if (!container) return out;

    const labels = Array.from(container.querySelectorAll("label"));
    labels.forEach((lab) => {
      const input = lab.querySelector('input[type="checkbox"]');
      if (!input) return;

      const text = chipTextOf(lab);
      const keyRaw = chipKeyOf(lab, input);
      const keyCanon = canonFn ? canonFn(keyRaw) : keyRaw;

      out.push({
        input,
        text,
        keyCanon,
        isMerge: text.indexOf("全选但不区分") !== -1,
        checked: !!input.checked,
      });
    });
    return out;
  }

  function applySelectionToOneGroup(containerFinder, targetCanonSet, canonFn) {
    const container = containerFinder();
    if (!container) return;

    const chips = collectChips(container, canonFn);
    if (!chips.length) return;

    const mergeChip = chips.find((c) => c.isMerge) || null;
    const optionChips = chips.filter((c) => !c.isMerge);

    const matchCount = optionChips.filter((c) => targetCanonSet.has(c.keyCanon)).length;
    if (!matchCount) return;

    const allOptionKeys = new Set(optionChips.map((c) => c.keyCanon));
    const isTargetAll = allOptionKeys.size
      ? Array.from(allOptionKeys).every((k) => targetCanonSet.has(k))
      : false;

    // 1) 目标不是全量时，先把“全选但不区分”关掉
    if (mergeChip && mergeChip.input && mergeChip.input.checked && !isTargetAll) {
      toggleInput(mergeChip.input, false);
      setTimeout(() => applySelectionToOneGroup(containerFinder, targetCanonSet, canonFn), 0);
      return;
    }

    const toCheck = [];
    const toUncheck = [];

    optionChips.forEach((c) => {
      const should = targetCanonSet.has(c.keyCanon);
      if (should && !c.checked) toCheck.push(c.keyCanon);
      if (!should && c.checked) toUncheck.push(c.keyCanon);
    });

    const seq = toCheck.map((k) => ({ k, on: true })).concat(toUncheck.map((k) => ({ k, on: false })));

    // 逐个执行：每步都重新找 DOM，兼容“整行重绘”
    seq.forEach((step) => {
      const curContainer = containerFinder();
      if (!curContainer) return;

      const curChips = collectChips(curContainer, canonFn).filter((c) => !c.isMerge && c.keyCanon === step.k);
      curChips.forEach((c) => toggleInput(c.input, step.on));
    });
  }

  function syncAllModules(globalState) {
    const cards = Array.from(document.querySelectorAll(MODULE_CARD_SELECTOR));
    if (!cards.length) return;

    const countriesSet = new Set((globalState.countries || []).map(canonCountry));
    const mediasSet = new Set((globalState.medias || []).map(canonMedia));
    const productsSet = new Set((globalState.products || []).map(canonProduct));

    cards.forEach((card) => {
      applySelectionToOneGroup(
        () =>
          findFilterRowChips(
            card,
            ["国家"],
            "#roi-filter-countries,#cpp-countries,#paid-reg-countries,#regcpa-countries,#retention-countries,#flow-countries,#sg-share-countries"
          ),
        countriesSet,
        canonCountry
      );

      applySelectionToOneGroup(
        () =>
          findFilterRowChips(
            card,
            ["媒体"],
            "#roi-filter-medias,#cpp-medias,#paid-reg-medias,#regcpa-medias,#retention-medias,#flow-medias,#sg-share-medias"
          ),
        mediasSet,
        canonMedia
      );

      applySelectionToOneGroup(
        () =>
          findFilterRowChips(
            card,
            ["形态", "产品类型"],
            "#roi-filter-products,#cpp-products,#paid-reg-productTypes,#regcpa-pts,#retention-productTypes,#flow-productTypes,#sg-share-productTypes"
          ),
        productsSet,
        canonProduct
      );
    });
  }

  // ===== 6) 初始化：渲染/绑定全局筛选器，触发同步 =====
  function init() {
    const elCountries = $(GLOBAL_CONTAINER_IDS.countries);
    const elMedias = $(GLOBAL_CONTAINER_IDS.medias);
    const elProducts = $(GLOBAL_CONTAINER_IDS.products);

    // 暴露一个手动调用口
    window.PaidGlobalFilterSync = window.PaidGlobalFilterSync || {};
    window.PaidGlobalFilterSync.syncAllModules = syncAllModules;

    // 没找到全局容器：不强行注入 UI，只提供 sync 方法
    if (!elCountries || !elMedias || !elProducts) return;

    renderGlobalGroup(elCountries, GLOBAL_OPTIONS.countries, GLOBAL_OPTIONS.countries);
    renderGlobalGroup(elMedias, GLOBAL_OPTIONS.medias, GLOBAL_OPTIONS.medias);
    renderGlobalGroup(elProducts, GLOBAL_OPTIONS.products, GLOBAL_OPTIONS.products);

    function readStateFromUI() {
      return {
        countries: readSelected(elCountries, GLOBAL_OPTIONS.countries),
        medias: readSelected(elMedias, GLOBAL_OPTIONS.medias),
        products: readSelected(elProducts, GLOBAL_OPTIONS.products),
      };
    }

    function onGlobalChange() {
      const state = readStateFromUI();
      setChipActiveClasses(elCountries);
      setChipActiveClasses(elMedias);
      setChipActiveClasses(elProducts);

      syncAllModules(state);

      // 轻量重试：处理“模块稍后才注入筛选器”的情况
      let n = 0;
      const timer = setInterval(() => {
        n += 1;
        syncAllModules(state);
        if (n >= 4) clearInterval(timer);
      }, 250);
    }

    [elCountries, elMedias, elProducts].forEach((el) => {
      el.addEventListener("change", onGlobalChange);
    });

    onGlobalChange();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
