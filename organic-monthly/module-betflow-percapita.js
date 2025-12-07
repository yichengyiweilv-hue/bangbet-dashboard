(function(){
  const moduleId = 'betflow';

  OVP.registerModule({
    id: moduleId,
    title: 'D0 / D7 人均流水（总 / 体育 / 游戏）',
    subtitle: '口径：BET_FLOW / BET_PLACED_USER（按月汇总；单位：币种同 data.js）',
    span: 'full',

    render({ mountEl, latestMonth }){
      const { chartNoteEl, insightEl } = OVP.ui.mountModule(mountEl, { moduleId, chartHeight: 360 });

      // 占位：后续在这里做“按月汇总 + 6 条序列”并用 echarts 渲染
      if (chartNoteEl) chartNoteEl.textContent = '图表待接入：D0/D7 人均流水（总/体育/游戏）趋势（单位：币种同数据源）。';

      OVP.ui.renderInsight({ moduleId, month: latestMonth, el: insightEl });
    }
  });
})();