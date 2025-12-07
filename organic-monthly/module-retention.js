(function(){
  const moduleId = 'retention';

  OVP.registerModule({
    id: moduleId,
    title: '次留 / 七留',
    subtitle: '口径：D1_retained_users / registration；D7_retained_users / registration（单位：%）',
    span: 'full',

    render({ mountEl, latestMonth }){
      const { chartNoteEl, insightEl } = OVP.ui.mountModule(mountEl, { moduleId, chartHeight: 320 });

      // 占位：后续在这里做“按月汇总 + D1/D7 双线”并用 echarts 渲染
      if (chartNoteEl) chartNoteEl.textContent = '图表待接入：月度次留/七留趋势（单位：%）+ 绝对人数（单位：人）。';

      OVP.ui.renderInsight({ moduleId, month: latestMonth, el: insightEl });
    }
  });
})();