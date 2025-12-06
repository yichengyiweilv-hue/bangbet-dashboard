(function () {
  function init() {
    const dom = document.getElementById("chart-paid-cpp");
    if (!dom || !window.echarts || !window.PaidDashboard) return;

    const chart = echarts.init(dom);
    PaidDashboard.registerChart(chart);

    function render() {
      const months = PaidDashboard.getMonths();

      const d0 = PaidDashboard.getSeries((a) =>
        PaidDashboard.safeDiv(a.spent, a.D0_unique_purchase)
      );
      const d7 = PaidDashboard.getSeries((a) =>
        PaidDashboard.safeDiv(a.spent, a.D7_unique_purchase)
      );

      PaidDashboard.renderLineChart(chart, {
        months,
        legend: true,
        series: [
          { name: "D0 充值单价", data: d0, color: PaidDashboard.COLORS[1] },
          { name: "D7 充值单价", data: d7, color: PaidDashboard.COLORS[2] },
        ],
        yFormatter: (v) => PaidDashboard.formatUSD(v, 2),
        tooltipValue: (v) => PaidDashboard.formatUSD(v, 2) + " USD",
      });
    }

    PaidDashboard.onFiltersChange(render);
    render();
  }

  PaidDashboard.registerModule("cpp", init);
})();
