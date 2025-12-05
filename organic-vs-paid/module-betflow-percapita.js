(function () {
  window.OVP = window.OVP || {};
  OVP.registerModule = OVP.registerModule || function (m) { (OVP.modules || (OVP.modules = [])).push(m); };

  OVP.registerModule({
    id: 'm4-betflow-percapita',
    title: 'D0 / D7 人均流水（体育 / 游戏 / 总）',
    subtitle: 'TOTAL/PLACED_USER；SPORTS/SPORTS_PLACED_USER；GAMES/GAMES_PLACED_USER',
    span: 'full',
    render({ mountEl }) {
      mountEl.innerHTML = `
        <div class="ovp-placeholder">
          <div>预留图表：自然量 vs 买量 D0 人均流水（体育/游戏/总）</div>
          <div>预留图表：自然量 vs 买量 D7 人均流水（体育/游戏/总）</div>
          <div class="ovp-skeleton"></div>
        </div>
      `;
    }
  });
})();
