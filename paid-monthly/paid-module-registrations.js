/**
 * ----占位------
 */

(function () {
  function init() {
    const dom = document.getElementById("chart-paid-registrations");
    if (!dom || !window.echarts || !window.PaidDashboard) return;

    const chart = echarts.init(dom);
    PaidDashboard.registerChart(chart);

    function render() {
      const months = PaidDashboard.getMonths();
      const data = PaidDashboard.getSeries((a) => a.registration);

      PaidDashboard.renderBarChart(chart, {
        months,
        name: "注册数",
        data,
        color: PaidDashboard.COLORS[0],
        yFormatter: PaidDashboard.formatInteger,
        tooltipValue: (v) => PaidDashboard.formatInteger(v) + " 人",
      });
    }

    PaidDashboard.onFiltersChange(render);
    render();
  }

  PaidDashboard.registerModule("reg", init);
})();
