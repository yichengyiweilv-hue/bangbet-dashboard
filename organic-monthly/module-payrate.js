(function(){
  const moduleId = 'payrate';

  OVP.registerModule({
    id: moduleId,
    title: 'D0 / D7 付费率',
    subtitle: '口径：D0_unique_purchase / registration；D7_unique_purchase / registration（单位：%）',
    span: 'full',

    render({ mountEl, latestMonth }){
      const { chartNoteEl, insightEl } = OVP.ui.mountModule(mountEl, { moduleId, chartHeight: 320 });

      // 占位：后续在这里做“按月汇总 + D0/D7 双线”并用 echarts 渲染
      if (chartNoteEl) chartNoteEl.textContent = '图表待接入：月度 D0/D7 付费率趋势（单位：%）+ 差值（pp）。';

      OVP.ui.renderInsight({ moduleId, month: latestMonth, el: insightEl });
    }
  });
})();