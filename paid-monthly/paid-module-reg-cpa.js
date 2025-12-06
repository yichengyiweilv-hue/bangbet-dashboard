(function () {
  function init() {
    const dom = document.getElementById("chart-paid-reg-cpa");
    if (!dom || !window.echarts || !window.PaidDashboard) return;

    const chart = echarts.init(dom);
    PaidDashboard.registerChart(chart);

    function render() {
      const months = PaidDashboard.getMonths();
      const data = PaidDashboard.getSeries((a) =>
        PaidDashboard.safeDiv(a.spent, a.registration)
      );

      PaidDashboard.renderLineChart(chart, {
        months,
        legend: false,
        series: [
          {
            name: "注册单价",
            data,
            color: PaidDashboard.COLORS[0],
          },
        ],
        yFormatter: (v) => PaidDashboard.formatUSD(v, 2),
        tooltipValue: (v) => PaidDashboard.formatUSD(v, 2) + " USD",
      });
    }

    PaidDashboard.onFiltersChange(render);
    render();
  }

  PaidDashboard.registerModule("reg_cpa", init);
})();
