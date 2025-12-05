(function () {
  window.OVP = window.OVP || {};
  OVP.registerModule = OVP.registerModule || function (m) { (OVP.modules || (OVP.modules = [])).push(m); };

  OVP.registerModule({
    id: 'm6-retention',
    title: '次日 / 7 日留存率',
    subtitle: 'D1_retained_users/registration；D7_retained_users/registration',
    span: 'half',
    render({ mountEl }) {
      mountEl.innerHTML = `
        <div class="ovp-placeholder">
          <div>预留图表：自然量 vs 买量 次留（D1）与 七留（D7，留存）按月</div>
          <div class="ovp-skeleton"></div>
        </div>
      `;
    }
  });
})();
