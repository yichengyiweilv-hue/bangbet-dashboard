(function(){
  const moduleId = 'registration';

  OVP.registerModule({
    id: moduleId,
    title: '自然量注册数',
    subtitle: '口径：registration（按月汇总；源数据来自 RAW_ORGANIC_BY_MONTH）',
    span: 'full',

    render({ mountEl, latestMonth }){
      const { chartEl, chartNoteEl, insightEl } = OVP.ui.mountModule(mountEl, { moduleId, chartHeight: 320 });

      // 占位：后续在这里做“按月汇总 + 趋势/环比”并用 echarts 渲染
      if (chartNoteEl) chartNoteEl.textContent = '图表待接入：月度注册数趋势（单位：人）+ 环比（%）。';

      // 文案：来自 insights.js（支持按月份覆盖）
      OVP.ui.renderInsight({ moduleId, month: latestMonth, el: insightEl });
    }
  });
})();