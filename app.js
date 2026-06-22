/* ============================================================
   每周轧制论文更新 - 交互逻辑
   功能：方向筛选 / 来源筛选 / 关键词搜索 / 排序 / 渲染
   ============================================================ */

(function () {
  "use strict";

  // ---- 状态 ----
  const state = {
    activeDir: "all",          // 当前方向
    activeSources: new Set(),  // 来源筛选（空集合=全部）
    keyword: "",               // 搜索关键词
    sortBy: "innovation"       // 排序方式
  };

  const SOURCE_TYPES = ["SCI", "EI", "核心", "预印本", "CSCD"];
  const MONTHS = ["", "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

  // ---- 工具函数 ----
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function dirById(id) {
    return DIRECTIONS.find(function (d) { return d.id === id; }) || null;
  }

  function sourceClass(st) {
    return "source-badge " + st;
  }

  // 计算本周更新周次
  function getWeekInfo() {
    const now = new Date();
    const y = now.getFullYear();
    const start = new Date(y, 0, 1);
    const days = Math.floor((now - start) / 86400000);
    const week = Math.ceil((days + start.getDay() + 1) / 7);
    return { year: y, week: week };
  }

  // ---- 统计 ----
  function computeStats() {
    const total = PAPERS.length;
    const bySource = {};
    SOURCE_TYPES.forEach(function (s) { bySource[s] = 0; });
    PAPERS.forEach(function (p) {
      if (bySource[p.sourceType] !== undefined) bySource[p.sourceType]++;
    });
    const avgScore = total ? (PAPERS.reduce(function (a, p) { return a + (p.innovationScore || 0); }, 0) / total).toFixed(1) : "0";
    return { total: total, bySource: bySource, avgScore: avgScore, dirs: DIRECTIONS.length };
  }

  // ---- 渲染顶部统计 ----
  function renderStats() {
    const s = computeStats();
    const wk = getWeekInfo();
    const el = document.getElementById("statsRow");
    if (!el) return;
    const pills = [
      { emoji: "📄", label: "收录论文", value: s.total },
      { emoji: "🗂️", label: "研究方向", value: s.dirs },
      { emoji: "⭐", label: "平均创新分", value: s.avgScore },
      { emoji: "🔬", label: "SCI 论文", value: s.bySource.SCI || 0 },
      { emoji: "📰", label: "核心期刊", value: s.bySource["核心"] || 0 },
      { emoji: "📥", label: "预印本", value: s.bySource["预印本"] || 0 }
    ];
    el.innerHTML = pills.map(function (p) {
      return '<div class="stat-pill"><span class="emoji">' + p.emoji + '</span>' +
        '<span>' + escapeHtml(p.label) + '</span><b>' + p.value + '</b></div>';
    }).join("");

    // 更新周次
    const wkEl = document.getElementById("weekInfo");
    if (wkEl) wkEl.textContent = wk.year + " 年 第 " + wk.week + " 周";
  }

  // ---- 渲染方向导航 ----
  function renderDirectionNav() {
    const wrap = document.getElementById("directionNav");
    if (!wrap) return;
    let html = '<button class="dir-btn ' + (state.activeDir === "all" ? "active" : "") + '" data-dir="all" style="background:linear-gradient(90deg,#475569,#334155);">' +
      '<span>📚</span> 全部方向 <span class="count">' + PAPERS.length + '</span></button>';
    DIRECTIONS.forEach(function (d) {
      const count = PAPERS.filter(function (p) { return p.field === d.id; }).length;
      const active = state.activeDir === d.id ? " active" : "";
      html += '<button class="dir-btn' + active + '" data-dir="' + d.id + '" style="' +
        (active ? "background:linear-gradient(90deg," + d.color + "," + d.color + "cc);" : "") + '">' +
        '<span>' + d.icon + '</span> ' + escapeHtml(d.name) +
        ' <span class="count">' + count + '</span></button>';
    });
    wrap.innerHTML = html;
    // 绑定点击
    wrap.querySelectorAll(".dir-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.activeDir = btn.getAttribute("data-dir");
        renderDirectionNav();
        renderPapers();
        // 滚动到内容区
        const main = document.getElementById("mainContent");
        if (main) main.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  // ---- 渲染来源筛选条 ----
  function renderSourceFilter() {
    const wrap = document.getElementById("sourceFilter");
    if (!wrap) return;
    let html = "";
    SOURCE_TYPES.forEach(function (s) {
      const active = state.activeSources.has(s);
      html += '<span class="source-chip ' + (active ? "active" : "") + '" data-src="' + s + '">' + s + '</span>';
    });
    wrap.innerHTML = html;
    wrap.querySelectorAll(".source-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        const s = chip.getAttribute("data-src");
        if (state.activeSources.has(s)) state.activeSources.delete(s);
        else state.activeSources.add(s);
        renderSourceFilter();
        renderPapers();
      });
    });
  }

  // ---- 过滤 + 排序 ----
  function getFilteredPapers() {
    let list = PAPERS.slice();
    // 方向过滤
    if (state.activeDir !== "all") {
      list = list.filter(function (p) { return p.field === state.activeDir; });
    }
    // 来源过滤
    if (state.activeSources.size > 0) {
      list = list.filter(function (p) { return state.activeSources.has(p.sourceType); });
    }
    // 关键词搜索
    if (state.keyword.trim()) {
      const kw = state.keyword.trim().toLowerCase();
      list = list.filter(function (p) {
        return (p.title && p.title.toLowerCase().indexOf(kw) >= 0) ||
               (p.titleCn && p.titleCn.toLowerCase().indexOf(kw) >= 0) ||
               (p.authors && p.authors.toLowerCase().indexOf(kw) >= 0) ||
               (p.journal && p.journal.toLowerCase().indexOf(kw) >= 0) ||
               (p.abstract && p.abstract.toLowerCase().indexOf(kw) >= 0) ||
               (p.innovationCn && p.innovationCn.indexOf(kw) >= 0) ||
               (p.innovationFormula && p.innovationFormula.indexOf(kw) >= 0) ||
               (p.innovationTags && p.innovationTags.some(function (t) { return t.toLowerCase().indexOf(kw) >= 0; }));
      });
    }
    // 排序
    if (state.sortBy === "innovation") {
      list.sort(function (a, b) { return (b.innovationScore || 0) - (a.innovationScore || 0); });
    } else if (state.sortBy === "date") {
      list.sort(function (a, b) {
        if (b.year !== a.year) return b.year - a.year;
        return b.month - a.month;
      });
    } else if (state.sortBy === "source") {
      const order = { "SCI": 0, "EI": 1, "核心": 2, "CSCD": 3, "预印本": 4 };
      list.sort(function (a, b) { return (order[a.sourceType] || 9) - (order[b.sourceType] || 9); });
    }
    return list;
  }

  // ---- 渲染创新公式 (A + B + C = Result) ----
  function renderFormula(p) {
    var f = p.innovationFormula || "";
    if (!f) return "";
    // Split by " = " to separate inputs and result
    var parts = f.split(" = ");
    var inputs = parts[0] || "";
    var result = parts[1] || "";
    // Split inputs by " + "
    var tokens = inputs.split(" + ");

    var html = '<div class="formula-box">';
    html += '<span class="formula-label">🔑 创新公式</span>';
    html += '<span class="formula-body">';
    tokens.forEach(function (tok, i) {
      if (i > 0) html += ' <span class="op">+</span> ';
      html += '<span class="token">' + escapeHtml(tok) + '</span>';
    });
    html += ' <span class="op">=</span> ';
    html += '<span class="result">' + escapeHtml(result) + '</span>';
    html += '</span>';
    html += '</div>';
    return html;
  }

  // ---- 渲染创新点摘要框（带展开/收起） ----
  function renderAbstractBox(p) {
    var cn = p.innovationCn || p.abstract || "";
    var en = p.abstract || "";
    var hasEn = en && en !== "（摘要待补充）" && en.length > 20;
    var isLong = cn.length > 80;
    var id = (p.id || "p").replace(/[^a-zA-Z0-9]/g, "");

    var html = '<div class="abstract-box" id="abs-' + id + '">';
    html += '<span class="abs-label">💡 创新点</span>';
    if (isLong) {
      // 短版（截断到80字+……）
      var short = cn.substring(0, 80);
      // 尽量在句号处截断
      var lastPeriod = short.lastIndexOf("。");
      if (lastPeriod > 30) short = short.substring(0, lastPeriod + 1);
      else short = short + "……";
      html += '<span class="abs-short">' + escapeHtml(short) + '</span>';
      html += '<span class="abs-full" style="display:none;">' + escapeHtml(cn) + '</span>';
      html += ' <a class="abs-toggle" onclick="toggleAbstract(\'' + id + '\')" data-state="short">展开全部 ▼</a>';
    } else {
      html += escapeHtml(cn);
    }
    html += '</div>';

    // 英文原文（默认隐藏）
    if (hasEn && hasEn) {
      html += '<div class="abstract-en" id="en-' + id + '" style="display:none;">';
      html += '<span class="abs-label-en">📄 English Abstract</span>';
      html += escapeHtml(en);
      html += '</div>';
      if (isLong) {
        // 已经有展开按钮了，英文在展开时一起显示
      }
    }
    return html;
  }

  // ---- 渲染单张卡片 ----
  function renderCard(p, index) {
    const d = dirById(p.field) || { icon: "📄", color: "#38bdf8", name: "" };
    const score = p.innovationScore || 0;
    const stars = "★".repeat(score) + "☆".repeat(10 - score);
    const tags = (p.innovationTags || []).map(function (t) {
      return '<span class="tag">#' + escapeHtml(t) + '</span>';
    }).join("");
    const doiUrl = (p.doi || "").indexOf("arXiv") === 0
      ? "https://arxiv.org/abs/" + p.doi.replace("arXiv:", "")
      : "https://doi.org/" + (p.doi || "");
    return '<article class="paper-card" style="--dir-color:' + d.color + '">' +
      '<div class="card-top">' +
        '<span class="rank-badge"><span class="star">★</span>#' + (index + 1) + ' ' + escapeHtml(d.name) + '</span>' +
        '<span class="' + sourceClass(p.sourceType) + '">' + escapeHtml(p.sourceType) + '</span>' +
      '</div>' +
      '<h3>' + escapeHtml(p.title) + '</h3>' +
      '<div class="title-cn">' + escapeHtml(p.titleCn || "") + '</div>' +
      '<div class="authors">👤 ' + escapeHtml(p.authors) + '</div>' +
      '<div class="journal-line">📖 ' + escapeHtml(p.journal) +
        ' <span class="year">' + p.year + ' · ' + MONTHS[p.month] + '</span></div>' +
      renderFormula(p) +
      renderAbstractBox(p) +
      (tags ? '<div class="tags">' + tags + '</div>' : '') +
      '<div class="card-bottom">' +
        '<div class="innovation-meter" title="创新评分 ' + score + '/10">⭐ ' + score +
          '<div class="meter-bar"><div class="meter-fill" style="width:' + (score * 10) + '%"></div></div></div>' +
        '<a class="doi-link" href="' + escapeHtml(doiUrl) + '" target="_blank" rel="noopener">DOI ↗</a>' +
      '</div>' +
    '</article>';
  }

  // ---- 渲染论文列表 ----
  function renderPapers() {
    const root = document.getElementById("paperContainer");
    if (!root) return;
    const list = getFilteredPapers();

    // 按方向分组渲染
    let html = "";
    if (state.activeDir === "all") {
      // 全部方向：按方向分 section
      DIRECTIONS.forEach(function (d) {
        const sub = list.filter(function (p) { return p.field === d.id; });
        if (sub.length === 0) return;
        html += renderSectionHeader(d, sub.length);
        html += '<div class="paper-grid">' +
          sub.map(function (p, i) { return renderCard(p, i); }).join("") +
        '</div>';
      });
    } else {
      const d = dirById(state.activeDir);
      if (d) {
        html += renderSectionHeader(d, list.length);
      }
      html += '<div class="paper-grid">' +
        list.map(function (p, i) { return renderCard(p, i); }).join("") +
      '</div>';
    }

    if (list.length === 0) {
      html = '<div class="empty-state"><div class="emoji">🔍</div>' +
        '<div>没有找到匹配的论文</div>' +
        '<div style="margin-top:8px;font-size:13px;">试试调整筛选条件或关键词</div></div>';
    }

    root.innerHTML = html;
  }

  function renderSectionHeader(d, count) {
    return '<div class="section-header" id="sec-' + d.id + '">' +
      '<div class="ico" style="border-color:' + d.color + '55;background:' + d.color + "22" + ';">' + d.icon + '</div>' +
      '<h2>' + escapeHtml(d.name) + '</h2>' +
      '<span class="meta">Top ' + count + ' 篇 · 按创新性排序</span>' +
    '</div>';
  }

  // ---- 绑定事件 ----
  function bindEvents() {
    // 搜索
    const search = document.getElementById("searchInput");
    if (search) {
      let timer = null;
      search.addEventListener("input", function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
          state.keyword = search.value;
          renderPapers();
        }, 200);
      });
    }
    // 排序
    const sortSel = document.getElementById("sortSelect");
    if (sortSel) {
      sortSel.addEventListener("change", function () {
        state.sortBy = sortSel.value;
        renderPapers();
      });
    }
  }

  // ---- 图表渲染 ----

  // 1. 各方向论文数 - 水平柱状图
  function renderChartDirection() {
    var el = document.getElementById("chartDirection");
    if (!el) return;
    var data = DIRECTIONS.map(function(d) {
      return { dir: d, count: PAPERS.filter(function(p) { return p.field === d.id; }).length };
    }).sort(function(a, b) { return b.count - a.count; });
    var maxVal = Math.max.apply(null, data.map(function(d) { return d.count; })) || 1;
    var html = '<div class="bar-chart">';
    data.forEach(function(item) {
      var pct = (item.count / maxVal * 100).toFixed(0);
      html += '<div class="bar-row">' +
        '<span class="bar-label">' + item.dir.icon + " " + escapeHtml(item.dir.name) + '</span>' +
        '<div class="bar-track"><div class="bar-fill" style="width:' + pct + '%;background:linear-gradient(90deg,' + item.dir.color + ',' + item.dir.color + 'aa);">' + '</div></div>' +
        '<span class="bar-value">' + item.count + '</span>' +
      '</div>';
    });
    html += '</div>';
    el.innerHTML = html;
  }

  // 2. 来源分布 - SVG 环形图
  function renderChartSource() {
    var el = document.getElementById("chartSource");
    if (!el) return;
    var counts = {};
    SOURCE_TYPES.forEach(function(s) { counts[s] = 0; });
    PAPERS.forEach(function(p) { if (counts[p.sourceType] !== undefined) counts[p.sourceType]++; });
    var total = PAPERS.length || 1;
    var colors = { SCI: "#38bdf8", EI: "#fbbf24", "核心": "#34d399", "预印本": "#f472b6", CSCD: "#818cf8" };
    var active = SOURCE_TYPES.filter(function(s) { return counts[s] > 0; });

    // SVG donut
    var R = 60, r = 38, cx = 70, cy = 70;
    var html = '<div class="donut-wrap"><div style="position:relative;">';
    html += '<svg class="donut-svg" width="140" height="140" viewBox="0 0 140 140">';
    var offset = 0;
    active.forEach(function(s) {
      var val = counts[s];
      var pct = val / total;
      var circ = 2 * Math.PI * R;
      var dash = pct * circ;
      html += '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="none" stroke="' + colors[s] + '" stroke-width="' + (R - r) + '" stroke-dasharray="' + dash + ' ' + (circ - dash) + '" stroke-dashoffset="' + (-offset) + '" />';
      offset += dash;
    });
    html += '</svg>';
    html += '<div class="donut-center" style="top:50%;left:50%;transform:translate(-50%,-50%);"><b>' + total + '</b><span>篇论文</span></div>';
    html += '</div>';
    html += '<div class="donut-legend">';
    active.forEach(function(s) {
      html += '<div class="legend-item"><span class="legend-dot" style="background:' + colors[s] + ';"></span>' + escapeHtml(s) +
        '<span class="legend-val">' + counts[s] + ' (' + (counts[s] / total * 100).toFixed(0) + '%)</span></div>';
    });
    html += '</div></div>';
    el.innerHTML = html;
  }

  // 3. 年份趋势 - 垂直柱状图
  function renderChartYear() {
    var el = document.getElementById("chartYear");
    if (!el) return;
    var yearCounts = {};
    PAPERS.forEach(function(p) {
      var y = p.year;
      yearCounts[y] = (yearCounts[y] || 0) + 1;
    });
    var years = Object.keys(yearCounts).sort();
    var maxVal = Math.max.apply(null, Object.values(yearCounts)) || 1;
    var colors = ["#6366f1", "#818cf8", "#38bdf8", "#34d399", "#fbbf24", "#fb923c"];
    var html = '<div class="year-chart">';
    years.forEach(function(y, i) {
      var pct = (yearCounts[y] / maxVal * 100).toFixed(0);
      html += '<div class="year-bar-col">' +
        '<div class="year-bar" style="height:' + pct + '%;background:linear-gradient(180deg,' + colors[i % colors.length] + ',' + colors[i % colors.length] + '88);">' +
          '<span class="count">' + yearCounts[y] + '</span></div>' +
        '<span class="year-label">' + y + '</span>' +
      '</div>';
    });
    html += '</div>';
    el.innerHTML = html;
  }

  // 4. 各方向平均创新分 - 水平条
  function renderChartInnovation() {
    var el = document.getElementById("chartInnovation");
    if (!el) return;
    var data = DIRECTIONS.map(function(d) {
      var list = PAPERS.filter(function(p) { return p.field === d.id; });
      var avg = list.length ? (list.reduce(function(a, p) { return a + (p.innovationScore || 0); }, 0) / list.length) : 0;
      return { dir: d, avg: avg };
    }).sort(function(a, b) { return b.avg - a.avg; });
    var html = '<div class="score-chart">';
    data.forEach(function(item) {
      var pct = (item.avg / 10 * 100).toFixed(0);
      html += '<div class="score-row">' +
        '<span class="bar-label" style="flex:0 0 110px;font-size:12px;color:var(--text-secondary);text-align:right;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + item.dir.icon + " " + escapeHtml(item.dir.name) + '</span>' +
        '<div class="score-track"><div class="score-fill" style="width:' + pct + '%;background:linear-gradient(90deg,' + item.dir.color + ',' + item.dir.color + 'aa);"></div></div>' +
        '<span class="bar-value">' + item.avg.toFixed(1) + '</span>' +
      '</div>';
    });
    html += '</div>';
    el.innerHTML = html;
  }

  // 5. 研究方法 x 工艺类型 交叉热力图
  function renderChartMatrix() {
    var el = document.getElementById("chartMatrix");
    if (!el) return;
    // PROCESS_TYPES 由 papers.js 提供，若不存在则用默认
    var ptypes = typeof PROCESS_TYPES !== "undefined" ? PROCESS_TYPES : [
      {id:"hot",name:"热轧"},{id:"cold",name:"冷轧"},{id:"warm",name:"温轧/深冷"},
      {id:"asym",name:"异步/特种"},{id:"tube",name:"管材"},{id:"section",name:"型线棒材"},
      {id:"clad",name:"复合板"},{id:"general",name:"通用/其他"}
    ];

    // 构建交叉矩阵 [method][process] = count
    var matrix = {};
    var maxVal = 0;
    DIRECTIONS.forEach(function(d) {
      matrix[d.id] = {};
      ptypes.forEach(function(pt) { matrix[d.id][pt.id] = 0; });
    });
    PAPERS.forEach(function(p) {
      var mid = p.field;
      var pid = p.processType || "general";
      if (!matrix[mid]) matrix[mid] = {};
      if (matrix[mid][pid] === undefined) matrix[mid][pid] = 0;
      matrix[mid][pid]++;
      if (matrix[mid][pid] > maxVal) maxVal = matrix[mid][pid];
    });

    function cellColor(val, max) {
      if (val === 0) return "rgba(255,255,255,0.02)";
      var intensity = 0.2 + (val / max) * 0.8;
      // 蓝色渐变
      var r = Math.round(56 * intensity + 15 * (1-intensity));
      var g = Math.round(189 * intensity + 23 * (1-intensity));
      var b = Math.round(248 * intensity + 42 * (1-intensity));
      return "rgba(" + r + "," + g + "," + b + "," + (0.3 + intensity * 0.7) + ")";
    }

    var html = '<div class="matrix-wrap"><table class="matrix-table"><thead><tr>';
    html += '<th class="row-h">研究方法 \\ 工艺类型</th>';
    ptypes.forEach(function(pt) { html += '<th>' + escapeHtml(pt.name) + '</th>'; });
    html += '<th>合计</th></tr></thead><tbody>';

    // 行合计
    var colTotals = {};
    ptypes.forEach(function(pt) { colTotals[pt.id] = 0; });

    DIRECTIONS.forEach(function(d) {
      var rowTotal = 0;
      html += '<tr><th class="row-h">' + d.icon + " " + escapeHtml(d.name) + '</th>';
      ptypes.forEach(function(pt) {
        var val = matrix[d.id][pt.id] || 0;
        rowTotal += val;
        colTotals[pt.id] += val;
        var bg = cellColor(val, maxVal);
        html += '<td><div class="matrix-cell ' + (val === 0 ? "zero" : "") + '" style="background:' + bg + ';" title="' + escapeHtml(d.name) + ' × ' + escapeHtml(pt.name) + ': ' + val + ' 篇">';
        if (val > 0) html += '<span class="num">' + val + '</span>';
        else html += '<span style="opacity:0.3;">·</span>';
        html += '</div></td>';
      });
      html += '<td><b style="color:' + d.color + ';">' + rowTotal + '</b></td></tr>';
    });

    // 合计行
    html += '<tr><th class="row-h">合计</th>';
    var grandTotal = 0;
    ptypes.forEach(function(pt) {
      html += '<td><b style="color:var(--text-primary);">' + colTotals[pt.id] + '</b></td>';
      grandTotal += colTotals[pt.id];
    });
    html += '<td><b style="color:var(--accent);font-size:15px;">' + grandTotal + '</b></td></tr>';

    html += '</tbody></table></div>';
    html += '<div class="matrix-legend"><span>少</span><div class="scale"></div><span>多</span><span style="margin-left:auto;">💡 悬停查看详情 · 颜色越深论文越多</span></div>';
    el.innerHTML = html;
  }

  // 6. 各方向研究趋势与总结
  function renderTrendSummaries() {
    var el = document.getElementById("trendSummaries");
    if (!el) return;
    var summaries = typeof DIRECTION_SUMMARIES !== "undefined" ? DIRECTION_SUMMARIES : {};
    var html = '<div class="trend-list">';
    DIRECTIONS.forEach(function(d) {
      var s = summaries[d.id];
      if (!s) return;
      var count = PAPERS.filter(function(p) { return p.field === d.id; }).length;
      html += '<div class="trend-item" style="--dir-color:' + d.color + ';">' +
        '<div class="trend-head">' +
          '<span class="ico">' + d.icon + '</span>' +
          '<span class="name">' + escapeHtml(d.name) + '</span>' +
          '<span class="badge-trend" style="background:' + d.color + ';">' + escapeHtml(s.trend) + '</span>' +
        '</div>' +
        '<div class="trend-summary">' + escapeHtml(s.summary) + '</div>';
      if (s.hotspots && s.hotspots.length) {
        html += '<div class="trend-hotspots">';
        s.hotspots.forEach(function(h) {
          html += '<span class="hotspot-tag">' + escapeHtml(h) + '</span>';
        });
        html += '</div>';
      }
      html += '</div>';
    });
    html += '</div>';
    el.innerHTML = html;
  }

  function renderDashboard() {
    renderChartDirection();
    renderChartSource();
    renderChartYear();
    renderChartInnovation();
    renderChartMatrix();
    renderTrendSummaries();
    var sub = document.getElementById("dashSub");
    if (sub) sub.textContent = "共 " + PAPERS.length + " 篇 · " + DIRECTIONS.length + " 个方法方向 · " +
      (typeof PROCESS_TYPES !== "undefined" ? PROCESS_TYPES.length : 8) + " 个工艺类型 · 2021-2026";
  }

  // ---- 初始化 ----
  function init() {
    renderStats();
    renderDashboard();
    renderDirectionNav();
    renderSourceFilter();
    bindEvents();
    renderPapers();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

// ---- 全局：展开/收起创新点摘要 ----
function toggleAbstract(id) {
  var box = document.getElementById("abs-" + id);
  if (!box) return;
  var shortEl = box.querySelector(".abs-short");
  var fullEl = box.querySelector(".abs-full");
  var toggle = box.querySelector(".abs-toggle");
  var enEl = document.getElementById("en-" + id);
  if (!shortEl || !fullEl || !toggle) return;
  if (toggle.getAttribute("data-state") === "short") {
    shortEl.style.display = "none";
    fullEl.style.display = "inline";
    toggle.textContent = "收起 ▲";
    toggle.setAttribute("data-state", "full");
    if (enEl) enEl.style.display = "block";
  } else {
    shortEl.style.display = "inline";
    fullEl.style.display = "none";
    toggle.textContent = "展开全部 ▼";
    toggle.setAttribute("data-state", "short");
    if (enEl) enEl.style.display = "none";
  }
}
