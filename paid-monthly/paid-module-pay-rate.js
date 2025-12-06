/**
 * ----占位------
 */

(function () {
  function init() {
    const dom = document.getElementById("chart-paid-pay-rate");
    if (!dom || !window.echarts || !window.PaidDashboard) return;

    const chart = echarts.init(dom);
    PaidDashboard.registerChart(chart);

    function render() {
      const months = PaidDashboard.getMonths();

      const d0 = PaidDashboard.getSeries((a) =>
        PaidDashboard.safeDiv(a.D0_unique_purchase, a.registration)
      );
      const d7 = PaidDashboard.getSeries((a) =>
        PaidDashboard.safeDiv(a.D7_unique_purchase, a.registration)
      );

      PaidDashboard.renderLineChart(chart, {
        months,
        legend: true,
        series: [
          { name: "D0 付费率", data: d0, color: PaidDashboard.COLORS[0] },
          { name: "D7 付费率", data: d7, color: PaidDashboard.COLORS[2] },
        ],
        yFormatter: (v) => PaidDashboard.formatPct01(v, 1),
        tooltipValue: (v) => PaidDashboard.formatPct01(v, 2),
      });
    }

    PaidDashboard.onFiltersChange(render);
    render();
  }

  PaidDashboard.registerModule("pay_rate", init);
})();
