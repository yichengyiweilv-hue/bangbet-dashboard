/* module-ggrroi-purchase-roi-growth.js
 *
 * 模块 1：GGR ROI 与 充值 ROI 增长分析
 * - ROI 口径：ROI = 目标值 / spent
 *   - GGR ROI：D0_TOTAL_GGR_VALUE / spent（D7/D30 等以此类推）
 *   - 充值 ROI：D0_PURCHASE_VALUE / spent（D7/D30 等以此类推）
 *
 * 依赖：
 * - index.html 里已加载 echarts
 * - ggr-module-data.js 提供 RAW_GGR_BY_MONTH
 * - ggr-dashboard-core.js 提供 GGR.calc
 */

(function(){
  if (!window.OVP || typeof OVP.registerModule !== 'function') return;

  const MODULE_ID = 'm1-ggrroi-vs-purchaseroi-growth';

  const WINDOW_OPTIONS = [
    { label: 'D0',  ggr: 'D0_TOTAL_GGR_VALUE',  purchase: 'D0_PURCHASE_VALUE' },
    { label: 'D3',  ggr: 'D3_TOTAL_GGR_VALUE',  purchase: 'D3_PURCHASE_VALUE' },
    { label: 'D7',  ggr: 'D7_TOTAL_GGR_VALUE',  purchase: 'D7_PURCHASE_VALUE' },
    { label: 'D14', ggr: 'D14_TOTAL_GGR_VALUE', purchase: 'D14_PURCHASE_VALUE' },
    { label: 'D30', ggr: 'D30_TOTAL_GGR_VALUE', purchase: 'D30_PURCHASE_VALUE' },
    { label: 'D45', ggr: 'D45_TOTAL_GGR_VALUE', purchase: 'D45_PURCHASE_VALUE' },
    { label: 'D60', ggr: 'D60_TOTAL_GGR_VALUE', purchase: 'D60_PURCHASE_VALUE' },
  ];

  const VIEW_OPTIONS = [
    { label: 'ROI 走势', value: 'roi' },
    { label: 'ROI 环比增长', value: 'mom' },
  ];

  function el(tag, attrs={}, children=[]){
    const node = document.createElement(tag);
    for (const [k,v] of Object.entries(attrs || {})){
      if (k === 'class') node.className = v;
      else if (k === 'html') node.innerHTML = v;
      else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, String(v));
    }
    for (const c of (Array.isArray(children) ? children : [children])){
      if (c === null || c === undefined) continue;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    }
    return node;
  }

  function buildControls({ defaultWindow='D0', defaultView='roi', onChange }){
    const winSel = el('select', { 'data-role': 'window' }, WINDOW_OPTIONS.map(o=>{
      const opt = el('option', { value: o.label }, o.label);
      if (o.label === defaultWindow) opt.selected = true;
      return opt;
    }));

    const viewSel = el('select', { 'data-role': 'view' }, VIEW_OPTIONS.map(o=>{
      const opt = el('option', { value: o.value }, o.label);
      if (o.value === defaultView) opt.selected = true;
      return opt;
    }));

    const wrap = el('div', { class: 'ovp-controls' }, [
      el('div', { class: 'ovp-control' }, [
        '窗口：', winSel
      ]),
      el('div', { class: 'ovp-control' }, [
        '视图：', viewSel
      ]),
    ]);

    function emit(){
      const payload = {
        windowLabel: winSel.value,
        view: viewSel.value
      };
      if (typeof onChange === 'function') onChange(payload);
    }

    winSel.addEventListener('change', emit);
    viewSel.addEventListener('change', emit);

    return { wrap, winSel, viewSel, emit };
  }

  function fmtPctAxis(v){
    if (v === null || v === undefined || Number.isNaN(Number(v))) return '—';
    return (Number(v) * 100).toFixed(1) + '%';
  }

  function fmtPctTooltip(v, digits=2){
    if (v === null || v === undefined || Number.isNaN(Number(v))) return '—';
    return (Number(v) * 100).toFixed(digits) + '%';
  }

  function getOptionByLabel(label){
    return WINDOW_OPTIONS.find(x=>x.label===label) || WINDOW_OPTIONS[0];
  }

  function renderChart({ chartEl, rawByMonth, months, windowLabel, view }){
    if (!window.echarts) return null;
    if (!chartEl) return null;

    // Init / reuse instance
    const existing = echarts.getInstanceByDom(chartEl);
    const chart = existing || echarts.init(chartEl);

    const opt = getOptionByLabel(windowLabel);

    const ggrSeries = (window.GGR && GGR.calc)
      ? GGR.calc.roiSeriesByMonth(rawByMonth, { numeratorField: opt.ggr, spentField: 'spent' })
      : [];

    const purchaseSeries = (window.GGR && GGR.calc)
      ? GGR.calc.roiSeriesByMonth(rawByMonth, { numeratorField: opt.purchase, spentField: 'spent' })
      : [];

    const x = (Array.isArray(months) && months.length) ? months : ggrSeries.map(d=>d.month);

    const ggrRoi = x.map(m=>{
      const row = ggrSeries.find(d=>d.month===m);
      return row ? row.roi : null;
    });

    const purchaseRoi = x.map(m=>{
      const row = purchaseSeries.find(d=>d.month===m);
      return row ? row.roi : null;
    });

    const titleSuffix = `${windowLabel}（ROI=目标值/spent）`;

    let option;
    if (view === 'mom'){
      const ggrMoM = (window.GGR && GGR.calc) ? GGR.calc.momGrowth(ggrRoi) : x.map(()=>null);
      const purchaseMoM = (window.GGR && GGR.calc) ? GGR.calc.momGrowth(purchaseRoi) : x.map(()=>null);

      option = {
        tooltip: {
          trigger: 'axis',
          valueFormatter: (v)=>fmtPctTooltip(v, 2),
        },
        legend: { data: ['GGR ROI 环比', '充值 ROI 环比'] },
        grid: { left: 46, right: 22, top: 42, bottom: 34 },
        xAxis: { type: 'category', data: x },
        yAxis: {
          type: 'value',
          axisLabel: { formatter: (v)=>fmtPctAxis(v) }
        },
        series: [
          { name: 'GGR ROI 环比', type: 'bar', data: ggrMoM },
          { name: '充值 ROI 环比', type: 'bar', data: purchaseMoM },
        ]
      };
    } else {
      option = {
        tooltip: {
          trigger: 'axis',
          valueFormatter: (v)=>fmtPctTooltip(v, 2),
        },
        legend: { data: ['GGR ROI', '充值 ROI'] },
        grid: { left: 46, right: 22, top: 42, bottom: 34 },
        xAxis: { type: 'category', data: x },
        yAxis: {
          type: 'value',
          axisLabel: { formatter: (v)=>fmtPctAxis(v) }
        },
        series: [
          { name: 'GGR ROI', type: 'line', data: ggrRoi, smooth: true, showSymbol: false },
          { name: '充值 ROI', type: 'line', data: purchaseRoi, smooth: true, showSymbol: false },
        ]
      };
    }

    // Add a lightweight title via graphic (avoid global title style conflicts)
    option.graphic = [
      {
        type: 'text',
        left: 12,
        top: 12,
        style: {
          text: `窗口：${titleSuffix}`,
          fontSize: 12,
          fill: '#334155'
        }
      }
    ];

    chart.setOption(option, true);

    // resize handler
    if (!chart.__ovp_bound_resize){
      chart.__ovp_bound_resize = true;
      window.addEventListener('resize', ()=>chart.resize());
    }

    return chart;
  }

  OVP.registerModule({
    id: MODULE_ID,
    title: '模块 1｜GGR ROI 与充值 ROI 增长分析',
    subtitle: '支持 D0/D3/D7/D14/D30/D45/D60 窗口切换；ROI=目标值/spent；可切换“走势 / 环比”。',
    render({ mountEl, rawByMonth, months, latestMonth }){
      const ui = OVP.ui.mountModule(mountEl, { moduleId: MODULE_ID, chartHeight: 420 });

      // Controls
      const controls = buildControls({
        defaultWindow: 'D0',
        defaultView: 'roi',
        onChange: ({ windowLabel, view })=>{
          // 重新渲染
          renderChart({ chartEl: ui.chartEl, rawByMonth, months, windowLabel, view });

          ui.chartNoteEl.textContent = [
            `当前视图：${view === 'mom' ? 'ROI 环比增长（MoM）' : 'ROI 走势'}`,
            `窗口：${windowLabel}`,
            `口径：GGR ROI=${getOptionByLabel(windowLabel).ggr}/spent；充值 ROI=${getOptionByLabel(windowLabel).purchase}/spent`,
          ].join(' · ');
        }
      });

      // Insert controls to top of module stack
      const stack = mountEl.querySelector('.ovp-module-stack');
      if (stack) stack.insertBefore(controls.wrap, stack.firstChild);

      // Data ready check
      const hasAny = rawByMonth && typeof rawByMonth === 'object' && Object.keys(rawByMonth).length > 0;
      const anyRows = hasAny ? Object.values(rawByMonth).some(arr=>Array.isArray(arr) && arr.length) : false;

      if (!hasAny || !anyRows){
        ui.chartNoteEl.textContent = '未检测到数据：请先在 ggr-module-data.js 填 RAW_GGR_BY_MONTH（按 YYYY-MM 分组）。';
        // 保留 skeleton
        OVP.ui.renderInsight({ moduleId: MODULE_ID, month: latestMonth, el: ui.insightEl });
        return;
      }

      // Clear skeleton and draw once
      ui.chartEl.classList.remove('is-empty');
      ui.chartEl.innerHTML = '';

      // First render
      controls.emit();

      // Insight (optional)
      OVP.ui.renderInsight({ moduleId: MODULE_ID, month: latestMonth, el: ui.insightEl });
    }
  });
})();
