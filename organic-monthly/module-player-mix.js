(function(){
  const moduleId = 'playerMix';

  OVP.registerModule({
    id: moduleId,
    title: '体育玩家 / 游戏玩家占比',
    subtitle: '口径：SPORTS_BET_PLACED_USER、GAMES_BET_PLACED_USER（可按 TOTAL_BET_PLACED_USER 归一为占比，单位：%）',
    span: 'full',

    render({ mountEl, latestMonth }){
      const { chartNoteEl, insightEl } = OVP.ui.mountModule(mountEl, { moduleId, chartHeight: 320 });

      // 占位：后续在这里做“按月汇总 + 堆叠占比 / 双线”并用 echarts 渲染
      if (chartNoteEl) chartNoteEl.textContent = '图表待接入：体育/游戏玩家占比（D0 或 D7；单位：%）+ 玩家量（单位：人）。';

      OVP.ui.renderInsight({ moduleId, month: latestMonth, el: insightEl });
    }
  });
})();