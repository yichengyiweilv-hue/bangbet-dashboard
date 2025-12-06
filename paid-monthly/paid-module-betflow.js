(function () {
  function init() {
    const dom = document.getElementById("chart-paid-betflow");
    if (!dom || !window.echarts || !window.PaidDashboard) return;

    const chart = echarts.init(dom);
    PaidDashboard.registerChart(chart);

    function getDayType() {
      const checked = document.querySelector(
        'input[name="flowDayType"]:checked'
      );
      return checked ? checked.value : "D0";
    }

    function render() {
      const months = PaidDashboard.getMonths();
      const dayType = getDayType();

      const total = PaidDashboard.getSeries((a) =>
        PaidDashboard.safeDiv(
          a[dayType + "_TOTAL_BET_FLOW"],
          a[dayType + "_TOTAL_BET_PLACED_USER"]
        )
      );
      const sports = PaidDashboard.getSeries((a) =>
        PaidDashboard.safeDiv(
          a[dayType + "_SPORTS_BET_FLOW"],
          a[dayType + "_SPORTS_BET_PLACED_USER"]
        )
      );
      const games = PaidDashboard.getSeries((a) =>
        PaidDashboard.safeDiv(
          a[dayType + "_GAMES_BET_FLOW"],
          a[dayType + "_GAMES_BET_PLACED_USER"]
        )
      );

      PaidDashboard.renderLineChart(chart, {
        months,
        legend: true,
        series: [
          { name: dayType + " 总流水/人", data: total, color: PaidDashboard.COLORS[0] },
          { name: dayType + " 体育流水/人", data: sports, color: PaidDashboard.COLORS[2] },
          { name: dayType + " 游戏流水/人", data: games, color: PaidDashboard.COLORS[3] },
        ],
        yFormatter: (v) => PaidDashboard.formatUSD(v, 2),
        tooltipValue: (v) => PaidDashboard.formatUSD(v, 2) + " USD",
      });
    }

    // 绑定 D0/D7 切换
    const radios = document.querySelectorAll('input[name="flowDayType"]');
    radios.forEach((r) => r.addEventListener("change", render));

    PaidDashboard.onFiltersChange(render);
    render();
  }

  PaidDashboard.registerModule("flow", init);
})();
//结尾
