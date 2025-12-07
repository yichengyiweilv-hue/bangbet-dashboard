(function(){
  const moduleId = 'arppu';

  OVP.registerModule({
    id: moduleId,
    title: 'D0 / D7 ARPPU',
    subtitle: '口径：PURCHASE_VALUE / unique_purchase（按月汇总；单位：币种同 data.js）',
    span: 'full',

    render({ mountEl, latestMonth }){
      const { chartNoteEl, insightEl } = OVP.ui.mountModule(mountEl, { moduleId, chartHeight: 320 });

      // 占位：后续在这里做“按月汇总 + D0/D7 双线”并用 echarts 渲染
      if (chartNoteEl) chartNoteEl.textContent = '图表待接入：月度 D0/D7 ARPPU 趋势（单位：币种同数据源）。';

      OVP.ui.renderInsight({ moduleId, month: latestMonth, el: insightEl });
    }
  });
})();