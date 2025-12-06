/**
 * ----占位------
 */

(function () {
  function init() {
    const dom = document.getElementById("chart-paid-roi");
    if (!dom || !window.echarts || !window.PaidDashboard) return;

    const chart = echarts.init(dom);
    PaidDashboard.registerChart(chart);

    function render() {
      const months = PaidDashboard.getMonths();

      const d0 = PaidDashboard.getSeries((a) =>
        PaidDashboard.safeDiv(a.D0_PURCHASE_VALUE, a.spent)
      );
      const d7 = PaidDashboard.getSeries((a) =>
        PaidDashboard.safeDiv(a.D7_PURCHASE_VALUE, a.spent)
      );

      PaidDashboard.renderLineChart(chart, {
        months,
        legend: true,
        series: [
          { name: "D0 ROI", data: d0, color: PaidDashboard.COLORS[0] },
          { name: "D7 ROI", data: d7, color: PaidDashboard.COLORS[4] },
        ],
        yFormatter: (v) => PaidDashboard.formatRatio(v, 2),
        tooltipValue: (v) => PaidDashboard.formatRatio(v, 3),
      });
    }

    PaidDashboard.onFiltersChange(render);
    render();
  }

  PaidDashboard.registerModule("roi", init);
})();
