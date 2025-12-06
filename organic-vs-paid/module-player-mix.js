// 使用：
(function () {
  window.OVP = window.OVP || {};
  OVP.registerModule = OVP.registerModule || function (m) { (OVP.modules || (OVP.modules = [])).push(m); };

  OVP.registerModule({
    id: 'm5-player-mix',
    title: '体育 vs 游戏玩家比例',
    subtitle: 'SPORTS_BET_PLACED_USER / GAMES_BET_PLACED_USER（D0 与 D7）',
    span: 'half',
    render({ mountEl }) {
      mountEl.innerHTML = `
        <div class="ovp-placeholder">
          <div>预留图表：自然量 vs 买量 体育/游戏玩家比例（D0、D7，按月）</div>
          <div class="ovp-skeleton"></div>
        </div>
      `;
    }
  });
})();
