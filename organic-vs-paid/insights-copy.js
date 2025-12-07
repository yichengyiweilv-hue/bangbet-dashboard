// organic-vs-paid/insights-copy.js
// 月度“数据分析文案库”：每月每模块只维护 1 段自由文本（支持换行）。
//
// 使用：
// 1) 在 index.html 引入：<script src="./insights-copy.js"></script>
// 2) 在任一模块里：
//    const ins = OVP.insights.get('m1-registration', '2025-11');
//    OVP.insights.render(mountEl, 'm1-registration', '2025-11');
//
(function () {
  window.OVP = window.OVP || {};
  var OVP = window.OVP;

  function pad2(n) {
    var s = String(n);
    return s.length === 1 ? ("0" + s) : s;
  }

  // 把多行模板字符串的公共缩进去掉，避免显示时每行前面一堆空格
  function dedent(input) {
    var s = String(input || "");
    s = s.replace(/\r\n/g, "\n");

    // 去掉首尾空行
    s = s.replace(/^\n+/, "").replace(/\n+$/, "");

    var lines = s.split("\n");
    var minIndent = null;

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      if (!line.trim()) continue;
      var m = line.match(/^[ \t]*/);
      var ind = m ? m[0].length : 0;
      if (minIndent === null || ind < minIndent) minIndent = ind;
    }

    if (minIndent && minIndent > 0) {
      for (var j = 0; j < lines.length; j++) {
        lines[j] = lines[j].slice(minIndent);
      }
    }

    return lines.join("\n").trim();
  }

  function normalizeMonth(input) {
    if (!input) return null;

    if (input instanceof Date && !isNaN(input.getTime())) {
      return input.getFullYear() + "-" + pad2(input.getMonth() + 1);
    }

    var s = String(input).trim();
    var m;

    // YYYY-MM 或 YYYY/MM
    m = s.match(/^(\d{4})[-\/](\d{1,2})$/);
    if (m) {
      var y1 = Number(m[1]);
      var mm1 = Number(m[2]);
      if (mm1 >= 1 && mm1 <= 12) return y1 + "-" + pad2(mm1);
    }

    // YYYYMM
    m = s.match(/^(\d{4})(\d{2})$/);
    if (m) {
      var y2 = Number(m[1]);
      var mm2 = Number(m[2]);
      if (mm2 >= 1 && mm2 <= 12) return y2 + "-" + pad2(mm2);
    }

    // YYYY-M
    m = s.match(/^(\d{4})-(\d{1})$/);
    if (m) {
      var y3 = Number(m[1]);
      var mm3 = Number(m[2]);
      if (mm3 >= 1 && mm3 <= 12) return y3 + "-" + pad2(mm3);
    }

    return null;
  }

  function monthValue(key) {
    // key: YYYY-MM
    if (!key) return -1;
    var m = String(key).match(/^(\d{4})-(\d{2})$/);
    if (!m) return -1;
    return Number(m[1]) * 100 + Number(m[2]);
  }

  var MODULES = [
    { id: "m1-registration", name: "自然量 vs 买量注册量" },
    { id: "m2-payrate", name: "D0 / D7 付费率" },
    { id: "m3-arppu", name: "D0 / D7 ARPPU" },
    { id: "m4-betflow-percapita", name: "D0 / D7 人均流水（体育 / 游戏 / 总）" },
    { id: "m5-player-mix", name: "体育 vs 游戏玩家比例" },
    { id: "m6-retention", name: "次日 / 7 日留存率" }
  ];

  function getModuleMeta(moduleId) {
    for (var i = 0; i < MODULES.length; i++) {
      if (MODULES[i].id === moduleId) return MODULES[i];
    }
    return null;
  }

  // ======== 你主要维护这块：months ========
  // months[月][模块] = { text }  （text 支持多行）
  var STORE = {
    schemaVersion: 2,
    updatedAt: "2025-12-07",
    modules: MODULES,
    months: {
      '2025-09': {
        'm1-registration': { text: dedent(`
          2025-09 总注册 338,826；自然占比 33.2%，买量主力在 NG（占买量 53.3%）。
          NG的买量主要是有刷子
          买量注册 226,401：NG 120,617（占买量 53.3%）> TZ 48,247 > KE 35,215 > GH 22,322。
          `) },
        'm2-payrate': { text: dedent(`
          2025-09 付费率：自然 D0/D7=36.0%/46.6%，买量 31.0%/43.6%，买量短板在 NG。
          自然 GH 最强：D0 50.6%、D7 62.8%；整体比买量高 +5.0pp（D0）/+3.0pp（D7）。
          买量 NG 偏低：D0 25.6%、D7 41.6；主要量来自 GG-H5：D0 19.3%（注册 85,377）。
          买量 TZ 相对最好：D0 40.0%、D7 48.6，可作为当月质量标杆。
          `) },
        'm3-arppu': { text: dedent(`
          2025-09 ARPPU：自然 D0/D7=2.49/6.42 USD，买量 1.58/3.90 USD；差距主要由 NG 低客单拉开。
          自然 GH D7 ARPPU 12.25 USD/付费人（当月最高），TZ 4.40（最低）。
          买量 NG ARPPU 偏低：D0 0.96、D7 1.77 USD/付费人；同月 GH 达 11.11 USD。
          建议 ARPPU 与付费率双看：买量若只追付费人数，容易堆低客单。
          `) },
        'm4-betflow-percapita': { text: dedent(`
          2025-09 人均流水（总）：自然 D0/D7=12.0/32.2 USD/下注用户，买量 7.5/20.9；游戏人均是主要贡献。
          自然 D7：游戏人均 43.4 USD/下注用户，体育人均 6.9（差距约 6×）。
          买量 D7：NG 总人均 7.07 USD/下注用户，显著低于 KE 31.9、TZ 27.6。
          买量 “体育型大盘” 结构在 NG 放大，但人均流水偏低，建议和付费率/留存联动看质量。
          `) },
        'm5-player-mix': { text: dedent(`
          2025-09 结构：自然与买量都以“游戏+交叉”居多，但买量有明显体育型大盘。
          自然：D0 体育/游戏占比 55.8%/62.9%，交叉 18.8%；D7 交叉升到 28.0%。
          买量：D0 体育/游戏占比 51.4%/63.2%，交叉 14.6%；D7 体育占比 61.8% 高于游戏 57.5%。
          买量 NG GG-H5 体育占比 93.3%（D0），但同时付费/留存偏弱，是结构风险点。
          `) },
        'm6-retention': { text: dedent(`
          2025-09 留存：自然 次留/七留=37.8%/11.4%，买量 29.4%/6.7%；买量 NG 七留最低。
          自然 GH、UG 七留 15.9%/16.1%（2025-09），显著高于整体 11.4%。
          买量 NG 七留 4.4%；其中 GG-H5 七留 2.3%（注册 85,377）是主要拖累。
          买量要稳质量：优先收敛低留存大盘，再谈拉量；否则 D7 付费与人均一起掉。
          `) }
      },
      '2025-10': {
        'm1-registration': { text: dedent(`
          2025-10 总注册 290,534；自然 119,403（41.1%，较 2025-09 +7.9pp），买量主要在 NG 缩量。
          买量注册 171,131，较 2025-09 -24.4%（-55,270）；其中 NG -67,262（120,617 → 53,355）是核心下滑。
          自然注册 119,403，较 2025-09 +6.2%（+6,978）；增长在 TZ +3,106、KE +2,012、NG +2,013。
          国家结构更均衡：NG 占全盘 35.8%（9 月 50.0%），KE/TZ 占比抬至 25.6%/24.4%。
          `) },
        'm2-payrate': { text: dedent(`
          2025-10 付费率反转：买量 D0/D7=38.1%/46.4%，已高于自然 35.1%/45.6%。
          买量 NG 拉升明显：D0 41.7%（较 9 月 +16.2pp）、D7 50.5%（+8.9pp）。
          结构解释：NG 买量从 9 月 GG-H5（D0 19.3%）转到 app（10 月 FB app D0 42.3%）。
          自然侧短板在 TZ/UG：TZ D0 25.6%（较 9 月 -5.7pp），UG D7 37.0%。
          `) },
        'm3-arppu': { text: dedent(`
          2025-10 ARPPU：自然 D0/D7=2.23/5.85 USD，买量 1.90/4.75 USD；差距缩小，买量进步来自 NG。
          买量 NG D7 ARPPU 3.31 USD/付费人（较 9 月 +1.54）；但仍明显低于 GH/KE。
          自然侧 GH D7 ARPPU 11.53 USD/付费人（依旧最高），TZ 4.66（最低）。
          组合看法：10 月买量付费率提升 + ARPPU 变好，说明流量结构改善；继续盯住 NG 的人均与留存。
          `) },
        'm4-betflow-percapita': { text: dedent(`
          2025-10 人均流水（总）：自然 D0/D7=10.5/29.4 USD/下注用户，买量 9.0/24.8；买量追上了一些但差距仍在。
          买量 NG 人均明显改善：D7 总人均 11.8 USD/下注用户（较 9 月 7.07 上升）。
          自然 KE/TZ 仍偏稳：D7 总人均分别 33.0/28.6 USD/下注用户，是自然盘的主要支撑。
          风险点：如果买量继续放大体育型大盘，需盯“体育占比↑但人均/留存↓”的反向信号。
          `) },
        'm5-player-mix': { text: dedent(`
          2025-10 结构：买量体育占比回落、交叉上升，整体更接近自然盘；NG 改善最明显。
          买量 NG：D0 体育占比从 9 月 93.3%（GG-H5）下降，交叉与游戏占比回升，结构更健康。
          自然盘整体稳定：交叉在 D7 依旧抬升，说明“先游戏后体育/混合”的路径仍在。
          结论：10 月结构变好与付费率/ARPPU 的改善一致，优先保持结构而不是只追量。
          `) },
        'm6-retention': { text: dedent(`
          2025-10 留存：自然 次留/七留=36.1%/10.7%，买量 31.0%/7.9%；买量七留较 9 月改善。
          买量 NG 七留明显回升（与渠道结构调整一致），但仍需和付费/人均一起看，避免“短期付费↑长期留存↓”。
          自然侧 TZ/UG 仍是短板：次留偏弱会拉低 7 日留存的上限。
          结论：买量质量在修复期，先守住七留，再谈放量。
          `) }
      },


      
  //在上方新增月份分析'2025-11': {'m1-registration': { text: dedent(`....`) },....},
      
    }
  };

  function listMonths(store) {
    var months = (store && store.months) ? store.months : {};
    return Object.keys(months).sort(function (a, b) {
      return monthValue(a) - monthValue(b);
    });
  }

  function latestMonth(store) {
    var arr = listMonths(store);
    return arr.length ? arr[arr.length - 1] : null;
  }

  function normalizeEntry(raw, moduleId, monthKey) {
    var text = "";

    // 1) 新结构：string 或 {text}
    if (typeof raw === "string") {
      text = raw;
    } else if (raw && typeof raw.text === "string") {
      text = raw.text;
    }
    // 2) 兼容旧结构：{topLine, bullets, actions}
    else if (raw && (raw.topLine || raw.bullets)) {
      var parts = [];
      if (raw.topLine) parts.push(String(raw.topLine));
      if (Array.isArray(raw.bullets)) {
        for (var i = 0; i < raw.bullets.length; i++) {
          var b = raw.bullets[i];
          if (b === null || b === undefined) continue;
          var s = String(b).trim();
          if (s) parts.push(s);
        }
      }
      text = parts.join("\n");
    }

    text = String(text || "").replace(/\r\n/g, "\n").trim();

    if (!text) {
      var meta = getModuleMeta(moduleId);
      var title = meta ? meta.name : (moduleId || "unknown");
      var mk = monthKey || "—";
      text = "待更新：" + mk + " " + title + "\n（这里写几句就行，支持换行）";
    }

    // 兼容字段：避免外部模块还在读 topLine/bullets/actions 时直接挂
    var lines = text
      .split("\n")
      .map(function (l) { return String(l || "").trim(); })
      .filter(function (l) { return !!l; });
    var topLine = lines.length ? lines[0] : "";
    var bullets = lines.length > 1 ? lines.slice(1) : [];

    return {
      text: text,
      topLine: topLine,
      bullets: bullets,
      actions: []
    };
  }

  function getInsight(moduleId, month) {
    var mKey = normalizeMonth(month);
    var months = STORE.months || {};

    // 1) 取指定月
    if (mKey && months[mKey] && months[mKey][moduleId]) {
      return normalizeEntry(months[mKey][moduleId], moduleId, mKey);
    }

    // 2) 回退最新月
    var lm = latestMonth(STORE);
    if (lm && months[lm] && months[lm][moduleId]) {
      return normalizeEntry(months[lm][moduleId], moduleId, lm);
    }

    // 3) 空模板
    return normalizeEntry(null, moduleId, mKey || lm || "");
  }

  // 渲染：只输出一个可换行的“文本框”
  function ensureInsightStyles() {
    if (document.getElementById("ovp-insights-style")) return;

    var style = document.createElement("style");
    style.id = "ovp-insights-style";
    style.textContent = [
      ".ovp-analysis{margin-top:12px;padding:12px;border:1px solid var(--border, rgba(255,255,255,.12));border-radius:12px;background:rgba(255,255,255,.04)}",
      ".ovp-analysis .meta{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;font-size:12px;color:var(--muted, rgba(255,255,255,.62));margin-bottom:8px}",
      ".ovp-analysis .textbox{white-space:pre-wrap;word-break:break-word;overflow-wrap:anywhere;font-size:12px;line-height:1.65;color:var(--text, rgba(255,255,255,.92));padding:10px 12px;border-radius:10px;border:1px solid var(--border, rgba(255,255,255,.12));background:rgba(255,255,255,.22)}"
    ].join("");

    document.head.appendChild(style);
  }

  function renderInsight(mountEl, moduleId, month, options) {
    if (!mountEl) return;

    ensureInsightStyles();

    var opts = options || {};
    var mKey = normalizeMonth(month) || latestMonth(STORE) || "";
    var meta = getModuleMeta(moduleId);
    var ins = getInsight(moduleId, mKey);

    var wrapper = document.createElement("div");
    wrapper.className = "ovp-analysis";

    // meta line
    var metaRow = document.createElement("div");
    metaRow.className = "meta";

    var left = document.createElement("span");
    left.textContent = meta ? meta.name : String(moduleId || "");

    var right = document.createElement("span");
    right.textContent = opts.hideMonth ? "" : String(mKey || "");

    metaRow.appendChild(left);
    metaRow.appendChild(right);
    wrapper.appendChild(metaRow);

    // textbox (display)
    var box = document.createElement("div");
    box.className = "textbox";
    box.textContent = ins.text || "";
    wrapper.appendChild(box);

    // 清空再挂载，避免重复 append
    while (mountEl.firstChild) mountEl.removeChild(mountEl.firstChild);
    mountEl.appendChild(wrapper);
  }

  function scaffoldMonth(month, options) {
    // 快速生成某个月的模板（可选：copyFromLatest）
    var mKey = normalizeMonth(month);
    if (!mKey) return null;

    if (!STORE.months) STORE.months = {};
    if (STORE.months[mKey]) return mKey;

    var opts = options || {};
    var out = {};
    var lm = latestMonth(STORE);

    for (var i = 0; i < MODULES.length; i++) {
      var id = MODULES[i].id;
      var seed = (opts.copyFromLatest && lm && STORE.months[lm] && STORE.months[lm][id])
        ? STORE.months[lm][id]
        : null;
      var seedText = seed ? normalizeEntry(seed, id, lm).text : "";

      out[id] = {
        text: seedText || ("待更新：" + mKey + " " + MODULES[i].name + "\n（这里写几句就行，支持换行）")
      };
    }

    STORE.months[mKey] = out;
    return mKey;
  }

  // 对外暴露
  OVP.insights = {
    store: STORE,
    normalizeMonth: normalizeMonth,
    listMonths: function () { return listMonths(STORE); },
    latestMonth: function () { return latestMonth(STORE); },
    get: getInsight,
    render: renderInsight,
    scaffoldMonth: scaffoldMonth
  };
})();
