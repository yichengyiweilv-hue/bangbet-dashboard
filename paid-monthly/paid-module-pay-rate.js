/**
 * paid-module-pay-rate.js
 * 模块3：D0/D7 付费率
 * 重点：D7 柱子使用“斜线阴影（decal）”与 D0 区分
 */

(function () {
  function init() {
    const dom = document.getElementById("chart-paid-pay-rate");
    if (!dom || !window.echarts || !window.PaidDashboard) return;

    const chart = echarts.init(dom);
    PaidDashboard.registerChart(chart);

    function render() {
      const months = PaidDashboard.getMonths();

      // 颜色：按“月份索引”变化；同一个月 D0/D7 同色
      const palette =
        PaidDashboard.COLORS || ["#2563eb", "#16a34a", "#f97316", "#7c3aed", "#ef4444", "#0f766e"];
      const monthColor = (idx) => palette[idx % palette.length];

      // 口径：D0/D7 付费率
      const d0 = PaidDashboard.getSeries((a) =>
        PaidDashboard.safeDiv(a.D0_unique_purchase, a.registration)
      );
      const d7 = PaidDashboard.getSeries((a) =>
        PaidDashboard.safeDiv(a.D7_unique_purchase, a.registration)
      );

      const option = {
        grid: { left: 54, right: 22, top: 28, bottom: 40 },

        legend: {
          data: ["D0 付费率", "D7 付费率"],
          right: 16,
          top: 8,
          textStyle: { fontSize: 11, color: "#475569" },
        },

        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(15, 23, 42, 0.92)",
          borderWidth: 0,
          textStyle: { fontSize: 11 },
          axisPointer: { type: "shadow" },
          formatter: (params) => {
            if (!params || !params.length) return "";
            const idx = params[0].dataIndex;
            const monthRaw = months[idx] || "";
            const lines = [monthRaw];
            params.forEach((p) => {
              lines.push(
                `${p.marker}${p.seriesName}：${PaidDashboard.formatPct01(p.value, 2)}`
              );
            });
            return lines.join("<br/>");
          },
        },

        xAxis: {
          type: "category",
          data: months.map(PaidDashboard.formatMonthLabel),
          axisTick: { show: false },
          axisLine: { lineStyle: { color: "rgba(148,163,184,0.6)" } },
          axisLabel: { color: "#334155", fontSize: 11 },
        },

        yAxis: {
          type: "value",
          min: 0,
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { color: "rgba(148,163,184,0.22)" } },
          axisLabel: {
            color: "#64748b",
            fontSize: 11,
            formatter: (v) => PaidDashboard.formatPct01(v, 1),
          },
        },

        series: [
          {
            name: "D0 付费率",
            type: "bar",
            data: d0,
            barMaxWidth: 18,
            itemStyle: {
              borderRadius: [6, 6, 0, 0],
              color: (params) => monthColor(params.dataIndex),
            },
          },
          {
            name: "D7 付费率",
            type: "bar",
            data: d7,
            barMaxWidth: 18,
            itemStyle: {
              borderRadius: [6, 6, 0, 0],
              color: (params) => monthColor(params.dataIndex),

              // 关键：斜线阴影（ECharts 5 decal）
              decal: {
                symbol: "rect",
                symbolSize: 1,
                dashArrayX: [1, 0],
                dashArrayY: [4, 4],
                rotation: Math.PI / 4,
                color: "rgba(255,255,255,0.55)",
              },
            },
          },
        ],
      };

      chart.setOption(option, true);
    }

    PaidDashboard.onFiltersChange(render);
    render();
  }

  PaidDashboard.registerModule("pay_rate", init);
})();
