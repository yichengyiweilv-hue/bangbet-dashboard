(function () {
  window.OVP = window.OVP || {};
  OVP.registerModule = OVP.registerModule || function (m) { (OVP.modules || (OVP.modules = [])).push(m); };

  OVP.registerModule({
    id: 'm2-payrate',
    title: 'D0 / D7 付费率',
    subtitle: 'D0_unique_purchase/registration；D7_unique_purchase/registration',
    span: 'half',
    render({ mountEl }) {
      mountEl.innerHTML = `
        <div class="ovp-placeholder">
          <div>预留图表：自然量 vs 买量 D0 付费率、D7 付费率（按月）</div>
          <div class="ovp-skeleton"></div>
        </div>
      `;
    }
  });
})();
