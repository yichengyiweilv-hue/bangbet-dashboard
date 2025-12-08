// ===========================
// 模块 2：D0 / D7 付费率
// 文件：organic-monthly/module-payrate.js
// 口径：D0_unique_purchase/registration、D7_unique_purchase/registration
// ===========================

(function () {
  'use strict';

  var MODULE_ID = 'payrate';
  var COUNTRY_ORDER = ['GH', 'KE', 'NG', 'TZ', 'UG'];
  var METRIC_KEYS = ['D0', 'D7'];

  function $(root, sel) { return root.querySelector(sel); }
  function $all(root, sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }

  function toNum(v) {
    var n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  function toSafeId(str) {
    return String(str).replace(/[^a-zA-Z0-9_-]/g, '_');
  }

  function getCssVar(name, fallback) {
    try {
      var v = getComputedStyle(document.documentElement).getPropertyValue(name);
      v = (v || '').trim();
      return v || fallback;
    } catch (_e) {
      return fallback;
    }
  }

  function injectStylesOnce() {
    var STYLE_ID = 'ovp-style-' + MODULE_ID;
    if (document.getElementById(STYLE_ID)) return;

    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      '/* payrate module only */',
      '.ovp-pr-filters{',
      '  border:1px solid rgba(148, 163, 184, 0.60);',
      '  border-radius:12px;',
      '  padding:10px 12px;',
      '  background: rgba(255,255,255,0.70);',
      '  display:flex;',
      '  flex-wrap:wrap;',
      '  gap:12px;',
      '}',
      '.ovp-pr-group{ min-width: 220px; flex: 1 1 240px; }',
      '.ovp-pr-label{ font-size:11px; color:var(--muted); margin-bottom:6px; }',
      '.ovp-pr-options{ display:flex; flex-wrap:wrap; gap:8px; }',
      '.ovp-pr-opt{',
      '  display:inline-flex;',
      '  align-items:center;',
      '  gap:6px;',
      '  padding:4px 10px;',
      '  border:1px solid rgba(148, 163, 184, 0.55);',
      '  border-radius:999px;',
      '  background: rgba(249, 250, 251, 0.95);',
      '  color:var(--text);',
      '  font-size:12px;',
      '  line-height:1.4;',
      '  cursor:pointer;',
      '  user-select:none;',
      '}',
      '.ovp-pr-opt input{ margin:0; accent-color: ' + getCssVar('--ovp-blue', '#2563eb') + '; }',
      '.ovp-pr-opt.is-disabled{ opacity:0.55; cursor:not-allowed; }',
      '',
      '.ovp-pr-table-wrap{',
      '  border:1px solid rgba(148, 163, 184, 0.60);',
      '  border-radius:12px;',
      '  overflow:auto;',
      '  background:#ffffff;',
      '}',
      '.ovp-pr-table{ width:100%; border-collapse:separate; border-spacing:0; min-width: 720px; }',
      '.ovp-pr-table thead th{',
      '  position:sticky;',
      '  top:0;',
      '  background: rgba(249, 250, 251, 0.98);',
      '  border-bottom:1px solid rgba(148, 163, 184, 0.60);',
      '  padding:10px 10px;',
      '  font-size:11px;',
      '  color:var(--muted);',
      '  text-align:right;',
      '  white-space:nowrap;',
      '}',
      '.ovp-pr-table thead th:first-child{ text-align:left; }',
      '.ovp-pr-table tbody td{',
      '  padding:10px 10px;',
      '  border-bottom:1px solid rgba(148, 163, 184, 0.30);',
      '  font-size:12px;',
      '  text-align:right;',
      '  white-space:nowrap;',
      '}',
      '.ovp-pr-table tbody td:first-child{ text-align:left; color:var(--text); font-weight:600; }',
      '.ovp-pr-table tbody tr:nth-child(even) td{ background: rgba(249, 250, 251, 0.55); }',
      '.ovp-pr-kpi{ display:flex; align-items:center; gap:10px; flex-wrap:wrap; }',
      '.ovp-pr-kpi .tag{',
      '  font-size:11px;',
      '  color:var(--muted);',
      '  padding:3px 8px;',
      '  border:1px solid rgba(148, 163, 184, 0.55);',
      '  border-radius:999px;',
      '  background: rgba(249, 250, 251, 0.95);',
      '}',
      ''
    ].join('\n');

    document.head.appendChild(style);
  }

  function getMonthRows(rawByMonth, month) {
    if (!rawByMonth || !month) return [];
    var rows = rawByMonth[month];
    return Array.isArray(rows) ? rows : [];
  }

  function getRowsByMonths(rawByMonth, months) {
    var out = [];
    (months || []).forEach(function (m) {
      var rows = getMonthRows(rawByMonth, m);
      for (var i = 0; i < rows.length; i++) out.push(rows[i]);
    });
    return out;
  }

  function aggregateByCountry(rows, countryAllowSet) {
    var agg = {};
    COUNTRY_ORDER.forEach(function (c) {
      if (!countryAllowSet || countryAllowSet.has(c)) {
        agg[c] = { reg: 0, d0: 0, d7: 0, d1ret: 0, d7ret: 0 };
      }
    });

    for (var i = 0; i < rows.length; i++) {
      var r = rows[i] || {};
      var ctry = String(r.country || '');
      if (!agg[ctry]) continue;

      agg[ctry].reg += toNum(r.registration);
      agg[ctry].d0 += toNum(r.D0_unique_purchase);
      agg[ctry].d7 += toNum(r.D7_unique_purchase);
      agg[ctry].d1ret += toNum(r.D1_retained_users);
      agg[ctry].d7ret += toNum(r.D7_retained_users);
    }
    return agg;
  }

  function buildDailySeries(rows, country) {
    var map = new Map(); // ts -> {reg,d0,d7}

    for (var i = 0; i < rows.length; i++) {
      var r = rows[i] || {};
      if (String(r.country || '') !== country) continue;
      var dateStr = String(r.date || '').trim();
      if (!dateStr) continue;

      var ts = Date.parse(dateStr + 'T00:00:00Z');
      if (!Number.isFinite(ts)) continue;

      var cur = map.get(ts);
      if (!cur) cur = { reg: 0, d0: 0, d7: 0 };

      cur.reg += toNum(r.registration);
      cur.d0 += toNum(r.D0_unique_purchase);
      cur.d7 += toNum(r.D7_unique_purchase);

      map.set(ts, cur);
    }

    var tss = Array.from(map.keys()).sort(function (a, b) { return a - b; });
    var d0Points = [];
    var d7Points = [];

    for (var j = 0; j < tss.length; j++) {
      var ts2 = tss[j];
      var v = map.get(ts2) || { reg: 0, d0: 0, d7: 0 };
      var reg = v.reg;

      var d0Rate = reg > 0 ? (v.d0 / reg) : null;
      var d7Rate = reg > 0 ? (v.d7 / reg) : null;

      d0Points.push([ts2, d0Rate]);
      d7Points.push([ts2, d7Rate]);
    }

    return { d0Points: d0Points, d7Points: d7Points, days: tss.length };
  }

  function fmtMonthLabel(m) {
    return String(m || '').trim();
  }

  function computeScopeLabel(monthsSel) {
    var ms = (monthsSel || []).slice().sort();
    if (!ms.length) return '—';
    if (ms.length === 1) return ms[0];
    return ms[0] + ' ~ ' + ms[ms.length - 1];
  }

  function renderTable(tableWrapEl, ctx, state) {
    var rawByMonth = ctx.rawByMonth || {};
    var utils = ctx.utils || (window.OVP && window.OVP.utils) || {};

    var monthsSel = (state.months || []).slice();
    monthsSel = (utils.sortMonths ? utils.sortMonths(monthsSel) : monthsSel.sort());

    var countriesSel = (state.countries || []).slice();
    var countryAllowSet = new Set(countriesSel);
    var countriesOrdered = COUNTRY_ORDER.filter(function (c) { return countryAllowSet.has(c); });

    // columns: for each month -> D1 & D7 retention
    var cols = [];
    for (var i = 0; i < monthsSel.length; i++) {
      var m = monthsSel[i];
      cols.push({ month: m, k: 'd1', label: fmtMonthLabel(m) + ' 自然量次留' });
      cols.push({ month: m, k: 'd7', label: fmtMonthLabel(m) + ' 自然量七留' });
    }

    var thead = '<thead><tr><th>国家</th>' +
      cols.map(function (c) { return '<th>' + c.label + '</th>'; }).join('') +
      '</tr></thead>';

    var tbodyRows = [];

    for (var r = 0; r < countriesOrdered.length; r++) {
      var ctry = countriesOrdered[r];
      var tds = ['<td>' + ctry + '</td>'];

      for (var ci = 0; ci < cols.length; ci++) {
        var col = cols[ci];
        var rows = getMonthRows(rawByMonth, col.month);
        var agg = aggregateByCountry(rows, new Set([ctry]));
        var s = agg[ctry] || { reg: 0, d1ret: 0, d7ret: 0 };

        var val = null;
        if (s.reg > 0) {
          if (col.k === 'd1') val = s.d1ret / s.reg;
          if (col.k === 'd7') val = s.d7ret / s.reg;
        }

        var cell = (utils.fmtPct ? utils.fmtPct(val, 2) : (val === null ? '—' : (val * 100).toFixed(2) + '%'));
        tds.push('<td>' + cell + '</td>');
      }

      tbodyRows.push('<tr>' + tds.join('') + '</tr>');
    }

    var tbody = '<tbody>' + tbodyRows.join('') + '</tbody>';
    tableWrapEl.innerHTML = '' +
      '<div class="ovp-pr-table-wrap">' +
      '<table class="ovp-pr-table">' + thead + tbody + '</table>' +
      '</div>';
  }

  function makeBarOption(ctx, state) {
    var rawByMonth = ctx.rawByMonth || {};
    var utils = ctx.utils || (window.OVP && window.OVP.utils) || {};

    var monthsSel = (state.months || []).slice();
    monthsSel = (utils.sortMonths ? utils.sortMonths(monthsSel) : monthsSel.sort());
    var rows = getRowsByMonths(rawByMonth, monthsSel);

    var countriesSel = (state.countries || []).slice();
    var countryAllowSet = new Set(countriesSel);
    var countries = COUNTRY_ORDER.filter(function (c) { return countryAllowSet.has(c); });

    var agg = aggregateByCountry(rows, countryAllowSet);

    var baseColor = getCssVar('--ovp-blue', '#2563eb');
    var series = [];
    var metricSel = (state.metrics || []).slice();

    function rateFor(ctry, key) {
      var s = agg[ctry] || { reg: 0, d0: 0, d7: 0 };
      if (s.reg <= 0) return null;
      return key === 'D0' ? (s.d0 / s.reg) : (s.d7 / s.reg);
    }

    function countsFor(ctry) {
      var s = agg[ctry] || { reg: 0, d0: 0, d7: 0 };
      return { reg: s.reg, d0: s.d0, d7: s.d7 };
    }

    var seriesOrder = [];
    METRIC_KEYS.forEach(function (k) { if (metricSel.indexOf(k) >= 0) seriesOrder.push(k); });

    for (var si = 0; si < seriesOrder.length; si++) {
      var k = seriesOrder[si];
      var data = countries.map(function (ctry) { return rateFor(ctry, k); });

      var sOpt = {
        name: k,
        type: 'bar',
        data: data,
        barMaxWidth: 34,
        itemStyle: { color: baseColor }
      };

      if (k === 'D7') {
        sOpt.decal = {
          symbol: 'rect',
          symbolSize: 1,
          rotation: Math.PI / 4,
          dashArrayX: [2, 1],
          dashArrayY: [2, 1],
          color: 'rgba(255,255,255,0.45)'
        };
      }

      series.push(sOpt);
    }

    return {
      grid: { left: 56, right: 22, top: 40, bottom: 52 },
      legend: { top: 6, left: 10, icon: 'roundRect' },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: function (params) {
          if (!params || !params.length) return '';
          var ctry = params[0].axisValue || '';
          var cnt = countsFor(ctry);

          var lines = [];
          lines.push('<div style="font-weight:600;margin-bottom:4px;">' + ctry + '</div>');
          lines.push('<div style="color:#6b7280;font-size:11px;margin-bottom:6px;">注册数：' + (utils.fmtInt ? utils.fmtInt(cnt.reg) : String(cnt.reg)) + '</div>');

          for (var i = 0; i < params.length; i++) {
            var p = params[i];
            var k = p.seriesName;
            var rate = p.data;
            var payers = (k === 'D0') ? cnt.d0 : cnt.d7;

            var rateTxt = (utils.fmtPct ? utils.fmtPct(rate, 2) : (rate === null ? '—' : (rate * 100).toFixed(2) + '%'));
            lines.push(
              '<div style="display:flex;justify-content:space-between;gap:10px;">' +
                '<span>' + k + ' 付费率</span>' +
                '<span>' + rateTxt + '</span>' +
              '</div>' +
              '<div style="color:#6b7280;font-size:11px;margin-bottom:4px;">付费人数：' + (utils.fmtInt ? utils.fmtInt(payers) : String(payers)) + '</div>'
            );
          }
          return lines.join('');
        }
      },
      xAxis: {
        type: 'category',
        data: countries,
        axisTick: { alignWithLabel: true }
      },
      yAxis: {
        type: 'value',
        min: 0,
        axisLabel: {
          formatter: function (v) { return (Number(v) * 100).toFixed(0) + '%'; }
        },
        splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.25)' } }
      },
      series: series
    };
  }

  function makeLineOption(ctx, state) {
    var rawByMonth = ctx.rawByMonth || {};
    var utils = ctx.utils || (window.OVP && window.OVP.utils) || {};

    var monthsSel = (state.months || []).slice();
    monthsSel = (utils.sortMonths ? utils.sortMonths(monthsSel) : monthsSel.sort());
    var rows = getRowsByMonths(rawByMonth, monthsSel);

    var countriesSel = (state.countries || []).slice();
    var countryAllowSet = new Set(countriesSel);
    var countries = COUNTRY_ORDER.filter(function (c) { return countryAllowSet.has(c); });

    var metricSel = (state.metrics || []).slice();
    var wantD0 = metricSel.indexOf('D0') >= 0;
    var wantD7 = metricSel.indexOf('D7') >= 0;

    var colors = [
      getCssVar('--ovp-blue', '#2563eb'),
      getCssVar('--ovp-yellow', '#F6C344'),
      '#10b981',
      '#f97316',
      '#a855f7'
    ];
    var colorByCountry = {};
    for (var i = 0; i < COUNTRY_ORDER.length; i++) {
      colorByCountry[COUNTRY_ORDER[i]] = colors[i % colors.length];
    }

    var series = [];
    var legendData = countries.slice();

    for (var ci = 0; ci < countries.length; ci++) {
      var ctry = countries[ci];
      var ds = buildDailySeries(rows, ctry);

      if (wantD0) {
        series.push({
          id: ctry + '-D0',
          name: ctry,
          type: 'line',
          showSymbol: false,
          connectNulls: true,
          smooth: false,
          data: ds.d0Points,
          itemStyle: { color: colorByCountry[ctry] },
          lineStyle: { width: 2, type: 'dashed' }
        });
      }

      if (wantD7) {
        series.push({
          id: ctry + '-D7',
          name: ctry,
          type: 'line',
          showSymbol: false,
          connectNulls: true,
          smooth: false,
          data: ds.d7Points,
          itemStyle: { color: colorByCountry[ctry] },
          lineStyle: { width: 2, type: 'solid' }
        });
      }
    }

    return {
      grid: { left: 56, right: 22, top: 44, bottom: 52 },
      legend: { top: 6, left: 10, data: legendData, type: 'scroll' },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'line' },
        formatter: function (params) {
          if (!params || !params.length) return '';
          var ts = params[0].value ? params[0].value[0] : params[0].axisValue;
          var d = new Date(ts);
          var yyyy = d.getUTCFullYear();
          var mm = String(d.getUTCMonth() + 1).padStart(2, '0');
          var dd = String(d.getUTCDate()).padStart(2, '0');
          var dateLabel = yyyy + '-' + mm + '-' + dd;

          var bucket = {};
          for (var i = 0; i < params.length; i++) {
            var p = params[i];
            var c = p.seriesName;
            if (!bucket[c]) bucket[c] = {};
            var id = String(p.seriesId || '');
            var k = id.indexOf('-D0') >= 0 ? 'D0' : (id.indexOf('-D7') >= 0 ? 'D7' : '');
            var v = p.value && p.value.length ? p.value[1] : p.data;
            bucket[c][k] = v;
          }

          var lines = [];
          lines.push('<div style="font-weight:600;margin-bottom:4px;">' + dateLabel + '</div>');
          lines.push('<div style="color:#6b7280;font-size:11px;margin-bottom:6px;">虚线=D0，实线=D7</div>');

          for (var j = 0; j < COUNTRY_ORDER.length; j++) {
            var ctry = COUNTRY_ORDER[j];
            if (!bucket[ctry]) continue;

            var d0 = bucket[ctry].D0;
            var d7 = bucket[ctry].D7;
            var parts = [];
            if (wantD0) parts.push('D0 ' + (utils.fmtPct ? utils.fmtPct(d0, 2) : (d0 === null ? '—' : (d0 * 100).toFixed(2) + '%')));
            if (wantD7) parts.push('D7 ' + (utils.fmtPct ? utils.fmtPct(d7, 2) : (d7 === null ? '—' : (d7 * 100).toFixed(2) + '%')));

            lines.push(
              '<div style="display:flex;justify-content:space-between;gap:10px;">' +
                '<span style="font-weight:600;color:' + colorByCountry[ctry] + ';">' + ctry + '</span>' +
                '<span>' + parts.join(' · ') + '</span>' +
              '</div>'
            );
          }

          return lines.join('');
        }
      },
      xAxis: {
        type: 'time',
        axisLabel: {
          formatter: function (v) {
            var d = new Date(v);
            var mm = String(d.getUTCMonth() + 1).padStart(2, '0');
            var dd = String(d.getUTCDate()).padStart(2, '0');
            return mm + '-' + dd;
          }
        }
      },
      yAxis: {
        type: 'value',
        min: 0,
        axisLabel: {
          formatter: function (v) { return (Number(v) * 100).toFixed(0) + '%'; }
        },
        splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.25)' } }
      },
      series: series
    };
  }

  function renderModule(ctx) {
    var mountEl = ctx.mountEl;
    var utils = ctx.utils || (window.OVP && window.OVP.utils) || {};
    var monthsAll = Array.isArray(ctx.months) ? ctx.months.slice() : [];
    monthsAll = (utils.sortMonths ? utils.sortMonths(monthsAll) : monthsAll.sort());
    var latestMonth = ctx.latestMonth || (monthsAll.length ? monthsAll[monthsAll.length - 1] : null);

    injectStylesOnce();

    if (!mountEl) return;
    if (!window.echarts) {
      mountEl.innerHTML = '<div class="ovp-alert">ECharts 未加载：请检查 index.html 是否正确引入。</div>';
      return;
    }

    var state = {
      months: latestMonth ? [latestMonth] : (monthsAll.length ? [monthsAll[monthsAll.length - 1]] : []),
      countries: COUNTRY_ORDER.slice(),
      metrics: METRIC_KEYS.slice(),
      chartType: 'bar'
    };

    var chartId = 'chart-' + MODULE_ID + '-' + Math.random().toString(16).slice(2);
    var noteId = 'chart-note-' + MODULE_ID + '-' + Math.random().toString(16).slice(2);
    var insightId = 'insight-' + MODULE_ID + '-' + Math.random().toString(16).slice(2);
    var tableId = 'table-' + MODULE_ID + '-' + Math.random().toString(16).slice(2);
    var filtersId = 'filters-' + MODULE_ID + '-' + Math.random().toString(16).slice(2);

    mountEl.innerHTML = '' +
      '<div class="ovp-module-stack">' +
        '<div class="ovp-pr-filters" id="' + filtersId + '"></div>' +
        '<div>' +
          '<div class="ovp-chart" id="' + chartId + '" style="height:360px;"></div>' +
          '<div class="ovp-chart-note" id="' + noteId + '"></div>' +
        '</div>' +
        '<div id="' + tableId + '"></div>' +
        '<div class="ovp-insight" id="' + insightId + '">文案待填写：./insights.js</div>' +
      '</div>';

    var filtersEl = $(mountEl, '#' + filtersId);
    var chartEl = $(mountEl, '#' + chartId);
    var noteEl = $(mountEl, '#' + noteId);
    var tableWrapEl = $(mountEl, '#' + tableId);
    var insightEl = $(mountEl, '#' + insightId);

    function groupHtml(label, groupKey, options, selected, single) {
      var selectedSet = new Set(Array.isArray(selected) ? selected : [selected]);
      var opts = options.map(function (opt) {
        var val = String(opt.value);
        var id = 'ovp-' + MODULE_ID + '-' + groupKey + '-' + toSafeId(val);
        var checked = selectedSet.has(val);
        var dataSingleAttr = single ? ' data-single="1"' : '';
        return '' +
          '<label class="ovp-pr-opt" for="' + id + '">' +
            '<input type="checkbox" id="' + id + '" data-group="' + groupKey + '" value="' + val + '"' + (checked ? ' checked' : '') + dataSingleAttr + ' />' +
            '<span>' + opt.label + '</span>' +
          '</label>';
      }).join('');

      return '' +
        '<div class="ovp-pr-group">' +
          '<div class="ovp-pr-label">' + label + '</div>' +
          '<div class="ovp-pr-options">' + opts + '</div>' +
        '</div>';
    }

    function renderFilters() {
      var monthOpts = monthsAll.map(function (m) { return { value: m, label: m }; });
      var countryOpts = COUNTRY_ORDER.map(function (c) { return { value: c, label: c }; });
      var chartTypeOpts = [
        { value: 'bar', label: '月度柱状图' },
        { value: 'line', label: '日级折线图' }
      ];
      var metricOpts = [
        { value: 'D0', label: 'D0' },
        { value: 'D7', label: 'D7' }
      ];

      filtersEl.innerHTML = '' +
        groupHtml('月份', 'months', monthOpts, state.months, false) +
        groupHtml('国家', 'countries', countryOpts, state.countries, false) +
        groupHtml('图形', 'chartType', chartTypeOpts, [state.chartType], true) +
        groupHtml('数据', 'metrics', metricOpts, state.metrics, false);
    }

    function getCheckedValues(groupKey) {
      return $all(filtersEl, 'input[data-group="' + groupKey + '"]').filter(function (i) { return i.checked; }).map(function (i) { return i.value; });
    }

    function syncGroup(groupKey, selectedValues) {
      var selectedSet = new Set(Array.isArray(selectedValues) ? selectedValues : [selectedValues]);
      $all(filtersEl, 'input[data-group="' + groupKey + '"]').forEach(function (i) {
        i.checked = selectedSet.has(i.value);
      });
    }

    function ensureAtLeastOne(groupKey, fallbackValues) {
      var cur = getCheckedValues(groupKey);
      if (cur.length) return cur;
      var fb = Array.isArray(fallbackValues) ? fallbackValues.slice() : [fallbackValues];
      syncGroup(groupKey, fb);
      return fb;
    }

    renderFilters();

    var chart = window.echarts.init(chartEl, null, { renderer: 'canvas' });

    var ro = null;
    if (window.ResizeObserver) {
      ro = new ResizeObserver(function () { chart.resize(); });
      ro.observe(chartEl);
    } else {
      window.addEventListener('resize', function () { chart.resize(); });
    }

    function update() {
      var monthsSel = ensureAtLeastOne('months', state.months.length ? state.months : (latestMonth ? [latestMonth] : monthsAll.slice(0, 1)));
      var countriesSel = ensureAtLeastOne('countries', state.countries.length ? state.countries : COUNTRY_ORDER.slice());
      var metricsSel = ensureAtLeastOne('metrics', state.metrics.length ? state.metrics : METRIC_KEYS.slice());

      var ct = getCheckedValues('chartType');
      if (!ct.length) {
        syncGroup('chartType', [state.chartType]);
        ct = [state.chartType];
      } else if (ct.length > 1) {
        ct = [ct[ct.length - 1]];
        syncGroup('chartType', ct);
      }
      var chartType = ct[0];

      state.months = monthsSel;
      state.countries = countriesSel;
      state.metrics = metricsSel;
      state.chartType = chartType;

      var scope = computeScopeLabel(monthsSel);
      var noteParts = [
        '<div class="ovp-pr-kpi">',
        '<span class="tag">月份：' + scope + '</span>',
        '<span class="tag">国家：' + COUNTRY_ORDER.filter(function (c) { return countriesSel.indexOf(c) >= 0; }).join(',') + '</span>',
        '<span class="tag">数据：' + metricsSel.join('/') + '</span>',
        '<span class="tag">口径：付费率=D0/D7 unique_purchase ÷ registration</span>',
        '</div>'
      ];
      noteEl.innerHTML = noteParts.join('');

      var option = (chartType === 'line')
        ? makeLineOption(ctx, state)
        : makeBarOption(ctx, state);

      chart.setOption(option, true);

      renderTable(tableWrapEl, ctx, state);

      var monthsSorted = (utils.sortMonths ? utils.sortMonths(monthsSel.slice()) : monthsSel.slice().sort());
      var anchorMonth = monthsSorted.length ? monthsSorted[monthsSorted.length - 1] : latestMonth;

      if (window.OVP && window.OVP.ui && typeof window.OVP.ui.renderInsight === 'function') {
        window.OVP.ui.renderInsight({ moduleId: MODULE_ID, month: anchorMonth, el: insightEl });
      } else {
        try {
          var t = (window.OVP && typeof window.OVP.getInsight === 'function') ? window.OVP.getInsight(MODULE_ID, anchorMonth) : '';
          insightEl.textContent = (t || '').trim() || '文案待填写：./insights.js';
        } catch (_e) {
          insightEl.textContent = '文案待填写：./insights.js';
        }
      }
    }

    filtersEl.addEventListener('change', function (e) {
      var t = e.target;
      if (!t || t.tagName !== 'INPUT') return;

      var groupKey = t.getAttribute('data-group');
      if (!groupKey) return;

      if (t.getAttribute('data-single') === '1') {
        $all(filtersEl, 'input[data-group="' + groupKey + '"]').forEach(function (i) {
          i.checked = (i === t);
        });
      }

      update();
    });

    update();
  }

  if (!window.OVP || typeof window.OVP.registerModule !== 'function') {
    window.OVP = window.OVP || {};
    window.OVP.modules = window.OVP.modules || [];
    window.OVP.registerModule = window.OVP.registerModule || function (m) { window.OVP.modules.push(m); };
  }

  window.OVP.registerModule({
    id: MODULE_ID,
    title: 'D0 / D7 付费率',
    subtitle: '支持按月汇总柱状 / 按日折线；筛选器为勾选方式（非下拉）。',
    render: renderModule
  });
})();
