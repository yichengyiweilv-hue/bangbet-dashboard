(function () {
  window.OVP = window.OVP || {};
  OVP.registerModule = OVP.registerModule || function (m) { (OVP.modules || (OVP.modules = [])).push(m); };

  OVP.registerModule({
    id: 'm3-arppu',
    title: 'D0 / D7 ARPPU',
    subtitle: 'D0_PURCHASE_VALUE/D0_unique_purchase；（D7 同理，后续按字段落）',
    span: 'half',
    render({ mountEl }) {
      mountEl.innerHTML = `
        <div class="ovp-placeholder">
          <div>预留图表：自然量 vs 买量 D0 ARPPU、D7 ARPPU（按月）</div>
          <div class="ovp-skeleton"></div>
        </div>
      `;
    }
  });
})();
