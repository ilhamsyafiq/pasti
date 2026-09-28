// Laporan charts — small Chart.js wrapper so every report chart looks the same.
// Usage: PTChart.bar(el, { labels, series:[{ name, data }], horizontal, stacked, unit })
// Data is read from the page's own tables so chart and table always agree.
(function(){
  const SERIES = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#4a3aa7'];   // fixed categorical order (validated palette)
  const SINGLE = '#2fa308';                                                          // one series → brand green
  const INK = '#39463f', MUTED = '#77857c', GRID = 'rgba(18,32,25,.07)';
  const num = t => +String(t).replace(/[^\d.-]/g, '') || 0;

  // Read a table: rows (skipping the JUMLAH row) → { labels, cols:{ header: [values] } }
  function readTable(table, { skipZeroRows, labelCol = 0 } = {}){
    const heads = [...table.tHead.rows[table.tHead.rows.length - 1].cells].map(c => c.textContent.trim());
    const rows = [...table.tBodies[0].rows].filter(r => !/jumlah/i.test(r.textContent) && r.cells.length > 1);
    const out = { labels: [], rows: [] };
    rows.forEach(r => { const cells = [...r.cells].map(c => c.textContent.trim()); const vals = cells.slice(labelCol + 1).map(num);
      if (skipZeroRows && vals.every(v => !v)) return; out.labels.push(cells[labelCol]); out.rows.push(vals); });
    out.heads = heads.slice(labelCol); return out;
  }

  if (window.Chart) { Chart.defaults.font.family = "'Poppins', system-ui, sans-serif"; }
  function bar(el, o){
    if (!window.Chart) { el.innerHTML = '<div class="muted" style="padding:20px;text-align:center">Carta tidak dapat dimuatkan</div>'; return; }
    const one = o.series.length === 1, H = !!o.horizontal;
    const ds = o.series.map((s,i) => ({ label: s.name, data: s.data, backgroundColor: one ? SINGLE : SERIES[i % SERIES.length],
      borderRadius: 4, borderSkipped: 'start', borderWidth: o.stacked ? { top:0, right:0, bottom:0, left:0 } : 0,
      borderColor: '#fff', maxBarThickness: 34, categoryPercentage: .7, barPercentage: .9 }));
    if (o.stacked) ds.forEach(d => { d.borderWidth = H ? { right:2 } : { top:2 }; d.borderRadius = 3; });
    const canvas = document.createElement('canvas'); el.innerHTML = ''; el.appendChild(canvas);
    const valAxis = { beginAtZero:true, stacked:!!o.stacked, grid:{ color:GRID, drawTicks:false }, border:{ display:false },
      ticks:{ color:MUTED, font:{ size:11 }, padding:6, precision:0, callback: v => (o.unit === 'RM' ? 'RM ' : '') + v } };
    const catAxis = { stacked:!!o.stacked, grid:{ display:false }, border:{ color:'rgba(18,32,25,.18)' }, ticks:{ color:INK, font:{ size:11.5, weight:'600' } } };
    return new Chart(canvas, {
      type: 'bar',
      data: { labels: o.labels, datasets: ds },
      options: {
        indexAxis: H ? 'y' : 'x', layout:{ padding:{ left:6, right:6 } }, responsive:true, maintainAspectRatio:false, animation:{ duration:500 },
        interaction:{ mode:'index', intersect:false },
        scales: H ? { x: valAxis, y: catAxis } : { x: catAxis, y: valAxis },
        plugins: {
          legend: { display: !one, position:'top', align:'end', labels:{ boxWidth:10, boxHeight:10, useBorderRadius:true, borderRadius:3, color:INK, font:{ size:12 } } },
          tooltip: { backgroundColor:'#122019', padding:10, cornerRadius:8, titleFont:{ weight:'700' }, boxPadding:4,
            callbacks: { label: c => ` ${c.dataset.label}: ${(H ? c.parsed.x : c.parsed.y).toLocaleString('ms-MY')}${o.suffix || ''}` } },
        },
      },
    });
  }

  window.PTChart = { bar, readTable, SERIES };
})();
