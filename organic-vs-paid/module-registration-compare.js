(function () {
  window.OVP = window.OVP || {};
  OVP.registerModule = OVP.registerModule || function (m) { (OVP.modules || (OVP.modules = [])).push(m); };

  OVP.registerModule({
    id: 'm1-registration',
    title: '自然量 vs 买量注册量',
    subtitle: '按月 registration 对比 + 自然量占比',
    span: 'full',
    render({ mountEl }) {
      mountEl.innerHTML = `
        <div class="ovp-placeholder">
          <div>预留图表：自然量 registration vs 买量 registration（按月）</div>
          <div>预留指标：自然量占比 = organic_registration / (organic_registration + paid_registration)</div>
          <div class="ovp-skeleton"></div>
        </div>
      `;
    }
  });
})();
