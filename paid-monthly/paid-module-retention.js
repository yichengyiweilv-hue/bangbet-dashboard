(function () {
  function init() {
    const dom = document.getElementById("chart-paid-retention");
    if (!dom || !window.echarts || !window.PaidDashboard) return;

    const chart = echarts.init(dom);
    PaidDashboard.registerChart(chart);

    function render() {
      const months = PaidDashboard.getMonths();

      const d1 = PaidDashboard.getSeries((a) =>
        PaidDashboard.safeDiv(a.D1_retained_users, a.registration)
      );
      const d7 = PaidDashboard.getSeries((a) =>
        PaidDashboard.safeDiv(a.D7_retained_users, a.registration)
      );

      PaidDashboard.renderLineChart(chart, {
        months,
        legend: true,
        series: [
          { name: "次留（D1）", data: d1, color: PaidDashboard.COLORS[1] },
          { name: "七留（D7）", data: d7, color: PaidDashboard.COLORS[4] },
        ],
        yFormatter: (v) => PaidDashboard.formatPct01(v, 1),
        tooltipValue: (v) => PaidDashboard.formatPct01(v, 2),
      });
    }

    PaidDashboard.onFiltersChange(render);
    render();
  }

  PaidDashboard.registerModule("retention", init);
})();
