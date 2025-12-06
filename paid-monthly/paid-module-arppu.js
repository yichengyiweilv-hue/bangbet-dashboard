(function () {
  function init() {
    const dom = document.getElementById("chart-paid-arppu");
    if (!dom || !window.echarts || !window.PaidDashboard) return;

    const chart = echarts.init(dom);
    PaidDashboard.registerChart(chart);

    function render() {
      const months = PaidDashboard.getMonths();

      const d0 = PaidDashboard.getSeries((a) =>
        PaidDashboard.safeDiv(a.D0_PURCHASE_VALUE, a.D0_unique_purchase)
      );
      const d7 = PaidDashboard.getSeries((a) =>
        PaidDashboard.safeDiv(a.D7_PURCHASE_VALUE, a.D7_unique_purchase)
      );

      PaidDashboard.renderLineChart(chart, {
        months,
        legend: true,
        series: [
          { name: "D0 ARPPU", data: d0, color: PaidDashboard.COLORS[0] },
          { name: "D7 ARPPU", data: d7, color: PaidDashboard.COLORS[3] },
        ],
        yFormatter: (v) => PaidDashboard.formatUSD(v, 2),
        tooltipValue: (v) => PaidDashboard.formatUSD(v, 2) + " USD",
      });
    }

    PaidDashboard.onFiltersChange(render);
    render();
  }

  PaidDashboard.registerModule("arppu", init);
})();
 // 结尾
