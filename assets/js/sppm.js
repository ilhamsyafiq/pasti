// SPPM — Sistem Perkembangan Prestasi Murid (buku rekod PASTI 5 Tahun & 6 Tahun).
// Shared by the guru marking screen (guru/markah.html) and the parent report (parent/prestasi.html).
// Item p = penggal disarankan (1 / 2; 0 = kedua-dua penggal). Section `tambahan` = bacaan tambahan (tiada penggal).
(function(){
  const it = (k, t, p) => ({ k, t, p: p || 0 });
  const seq = (pre, from, to, label, cut) => { const a = []; for (let i = from; i <= to; i++) a.push(it(pre + i, label(i), i <= cut ? 1 : 2)); return a; };

  const SAHSIAH_COMMON = [
    { title:'Unit 1 · Kebersihan dan Kesihatan', items:[it('S1.1','Membasuh tangan dengan betul'),it('S1.2','Menggosok gigi dengan betul'),it('S1.3','Menggunakan tandas dengan betul'),it('S1.4','Membuang sampah dengan betul')] },
    { title:'Unit 2 · Sosio-Emosi', items:[it('S2.1','Memahami dan mengikut arahan guru'),it('S2.2','Boleh bermain dan bekerjasama dalam kumpulan'),it('S2.3','Suka membantu guru dan sahabat'),it('S2.4','Meminta maaf dan memaafkan orang lain')] },
    { title:'Unit 3 · Aqidah dan Tauhid', items:[it('S3.1','Menyebut syahadah serta makna'),it('S3.2','Dapat menyebut rukun Islam'),it('S3.3','Dapat menyebut rukun Iman')] },
    { title:'Unit 4 · Amalan Solat', items:['Mengetahui lima waktu solat','Niat solat lima waktu','Bacaan Iftitah','Bacaan Al-Fatihah','Bacaan dalam rukuk',"Bacaan I'tidal",'Bacaan dalam sujud','Bacaan antara dua sujud','Bacaan Tasyahud','Salam','Perbuatan solat mengikut tertib','Doa Qunut'].map((t,i) => it('S4.'+(i+1), t)) },
  ];
  const DOA5 = ['Doa sebelum belajar','Doa menambah ilmu','Doa masuk rumah','Doa keluar rumah','Doa sebelum makan','Doa selepas makan','Doa sebelum tidur','Doa bangun tidur','Doa masuk tandas','Doa keluar tandas','Doa memakai pakaian','Doa menanggalkan pakaian','Ayat Kursi','Ayat Seribu Dinar'];
  const DOA6 = ['Doa melihat cermin','Doa naik kenderaan darat','Doa naik kenderaan laut','Doa kepada ibubapa','Doa masuk masjid','Doa keluar masjid','Doa melawat orang sakit','Doa selamat','Doa sihat tubuh badan','Doa tasbih kafarah','Doa dunia akhirat','Doa selepas wudhu','Ayat Kursi','Ayat Seribu Dinar'];
  const HADIS5 = ['Sebaik-baik Amal','Larangan Menderhaka Ibubapa','Kebersihan','Larangan Makan dan Minum Sambil Berdiri','Sabar','Malu','Bakhil','Larangan Menghasut','Kelebihan Sabar','Elok Budi Pekerti'];
  const HADIS6 = ['Solat Tiang Agama','Pewaris Nabi','Kata-kata Yang Baik','Kewajipan Menuntut Ilmu','Sebaik-baik Manusia','Persaudaraan','Larangan Makan Dengan Tangan Kiri','Solat Yang Afdhal','Halal dan Haram','Amalan Baik Yang Berterusan'];
  const SURAH = ['Al-Fatihah','An-Nas','Al-Falaq','Al-Ikhlas','Al-Masad','An-Nasr','Al-Kafirun','Al-Kauthar',"Al-Ma'un",'Quraysh','Al-Fil','Al-Humazah',"Al-'Asr",'At-Takathur',"Al-Qari'ah","Al-'Adiyat",'Al-Zalzalah','Al-Bayyinah','Al-Qadr',"Al-'Alaq",'At-Tin','Al-Sharh','Ad-Dhuha','Al-Layl','Ash-Shams'];
  const PSIKO = [
    { title:'Unit 1 · Psikomotor Kasar — 1.1 Koordinasi kaki', items:[it('C1.11','Berjalan ke hadapan dan ke belakang'),it('C1.12','Berjalan di atas garis lurus dan meniti'),it('C1.13','Melompat dengan dua belah kaki dan melompat secara berselang seli buka dan tutup'),it('C1.14','Melompat sebelah kaki dan skip berterusan')] },
    { title:'1.2 Koordinasi tangan', items:[it('C1.21','Bergayut, membaling, melantun dan menangkap objek'),it('C1.22','Koordinasi tangan dan kaki'),it('C1.23','Merangkak, memanjat, menggelongsor dan membongkok')] },
    { title:'1.3 Koordinasi leher dan kepala', items:[it('C1.31','Menggeleng, mengangguk, mendongak dan menunduk')] },
  ];
  const AULAD_ITEMS = ['Bekerjasama','Mematuhi arahan','Kesungguhan','Berkebolehan','Penglibatan Murid'];

  function build(umur){
    const five = umur !== 6;
    return [
      { key:'sahsiah', nama:'Celik Sahsiah', color:'#0e9488', sections: SAHSIAH_COMMON.concat([
          { title:'Unit 5 · Hafalan Doa', items:(five ? DOA5 : DOA6).map((t,i) => it('S5.'+(i+1), t, i < 6 ? 1 : 2)) },
          { title:'Unit 6 · Hafalan Hadis', items:(five ? HADIS5 : HADIS6).map((t,i) => it('S6.'+(i+1), "Hadis '" + t + "'", i < 6 ? 1 : 2)) },
        ]) },
      { key:'quran', nama:'Celik Al-Quran', color:'#2fa308', sections: five ? [
          { title:'Nurul Quran (NQ) · Bacaan Wajib Buku 1', nq:true, items:[it('Q1a','Buku 1 · Unit 1 : Mukasurat 1 – 28',1),it('Q1b','Buku 1 · Unit 1 : Mukasurat 29 – 40',1),it('Q2a','Buku 1 · Unit 2 : Mukasurat 42 – 53',2),it('Q2b','Buku 1 · Unit 2 : Mukasurat 54 – 64',2)] },
          { title:'Pratahfiz · Surah Lazim', lazim:true, items: SURAH.slice(0,19).map((t,i) => it('L'+(i+1), t, i < 11 ? 1 : 2)) },
          { title:'Pratahfiz · Surah Al-Mulk', mulk:true, items: seq('M', 1, 15, i => 'Ayat ' + i, 7) },
        ] : [
          { title:'Nurul Quran (NQ) · Bacaan Wajib Buku 2', nq:true, items:[3,4,5,6].map(u => it('Q'+u, 'Buku 2 · Unit ' + u, u < 5 ? 1 : 2)) },
          { title:'Nurul Quran · Bacaan Tambahan Buku 3 & Buku 4', nq:true, tambahan:true, items: seq('Q', 7, 29, u => (u <= 13 ? 'Buku 3' : 'Buku 4') + ' · Unit ' + u, 99).map(x => (x.p = 0, x)) },
          { title:'Pratahfiz · Surah Lazim', lazim:true, items: SURAH.map((t,i) => it('L'+(i+1), t, i < 19 ? 1 : 2)) },
          { title:'Pratahfiz · Surah Al-Mulk', mulk:true, items: [it('M15','Ayat 1 – 15',1)].concat(seq('M', 16, 30, i => 'Ayat ' + i, 21)) },
        ] },
      { key:'bahasa', nama:'Celik Bahasa', color:'#8a5a3c', sections: five ? [
          { title:'Bahasa Melayu · Bacaan Wajib Buku Adikku Pandai Baca — Buku 1', siri:1, items: seq('B1.', 1, 10, i => 'Buku 1 · Unit ' + i, 5) },
          { title:'Bahasa Inggeris · Level 1 — Book 1', items: seq('E1.', 1, 7, i => 'Book 1 · Unit ' + i, 99) },
          { title:'Bahasa Inggeris · Level 1 — Book 2', items: seq('E2.', 1, 12, i => 'Book 2 · Unit ' + i, 0) },
        ] : [
          { title:'Bahasa Melayu · Bacaan Wajib Buku Adikku Pandai Baca — Buku 2', siri:2, items: seq('B2.', 1, 15, i => 'Buku 2 · Unit ' + i, 7) },
          { title:'Bahasa Melayu · Bacaan Tambahan — Buku 3 & Buku 4', tambahan:true, siri:4, items: seq('B3.', 1, 8, i => 'Buku 3 · Unit ' + i, 99).concat(seq('B4.', 1, 4, i => 'Buku 4 · Unit ' + i, 99)).map(x => (x.p = 0, x)) },
          { title:'Bahasa Inggeris · Level 2 — Book 1', items: seq('E1.', 1, 17, i => 'Book 1 · Unit ' + i, 99) },
          { title:'Bahasa Inggeris · Level 2 — Book 2', items: seq('E2.', 1, 10, i => 'Book 2 · Unit ' + i, 0) },
        ] },
      { key:'minda', nama:'Celik Minda', color:'#c9971a', type:'score', label:'Ujian Celik Minda (' + (five ? 5 : 6) + ' tahun)' },
      { key:'cerdas', nama:'Celik Cerdas', color:'#d4577a', sections: PSIKO, aktiviti:true },
      { key:'aulad', nama:'Projek Aulad', color:'#8e5bb5', type:'aulad', items: AULAD_ITEMS },
      { key:'ulasan', nama:'Ulasan Guru', color:'#5b6b62', type:'ulasan' },
    ];
  }

  const LV = { AM:1, M:2, SM:3 }, LVN = { AM:'Ansur Maju', M:'Maju', SM:'Sangat Maju' };
  const PERINGKAT = ['Cawangan','Kawasan','Negeri','Kebangsaan','Antarabangsa'];
  const tahapMinda = s => s == null || s === '' ? null : +s >= 80 ? 'Sangat Cemerlang' : +s >= 40 ? 'Cemerlang' : 'Berpotensi Cemerlang';

  // ---- store (per browser) --------------------------------------------------
  const KEY = 'pt-sppm-v1';
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch(e) { return null; } };
  const save = d => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch(e) {} };
  const blank = umur => ({ umur, p:{ 1:{}, 2:{} }, minda:{ 1:null, 2:null }, aktiviti:[], aulad:{ tema:'', tajuk:'', items:{}, skor:'' }, ulasan:{ 1:'', 2:'' }, sent:{ 1:false, 2:false }, sentAt:{} });

  // demo: Ahmad Zafran (5 tahun) — Penggal 1 already sent to the parent; a few classmates in progress
  function seed(){
    const d = {};
    const z = blank(5), tpl = build(5), rate = (k, i) => ['SM','M','SM','M','SM','AM','M'][(k.length + i) % 7];
    tpl.forEach(e => (e.sections||[]).forEach(s => s.items.forEach((x,i) => { if (x.p !== 2) z.p[1][x.k] = rate(x.k, i); })));
    z.minda[1] = 82; z.ulasan[1] = 'Ahmad Zafran seorang murid yang rajin dan mudah mengikut arahan. Bacaan Al-Quran semakin lancar; teruskan hafalan surah di rumah bersama ibu bapa.';
    z.aktiviti = [{ nama:'Pertandingan Hafazan Surah Lazim', anjuran:'PASTI Kawasan Kubang Kerian', peringkat:'Kawasan', catatan:'Johan kategori 5 tahun' },{ nama:'Hari Sukan PASTI', anjuran:"PASTI AL-TA'LIM", peringkat:'Cawangan', catatan:'Penyertaan' }];
    z.aulad = { tema:'Alam Sekitar Ciptaan Allah', tajuk:'Taman Mini Kelasku', items:{ 'Bekerjasama':'SM','Mematuhi arahan':'M','Kesungguhan':'SM','Berkebolehan':'M','Penglibatan Murid':'SM' }, skor:'SM' };
    z.sent[1] = true; z.sentAt[1] = '20/06/2026';
    d['210512100713'] = z;
    return d;
  }
  let DATA = load(); if (!DATA || /[?&]reset=1/.test(location.search)) { DATA = seed(); save(DATA); }

  const SPPM = {
    build, LV, LVN, PERINGKAT, tahapMinda,
    rec(mykid, umur){ if (!DATA[mykid]) { DATA[mykid] = blank(umur || 5); } return DATA[mykid]; },
    has: mykid => !!DATA[mykid],
    save(){ save(DATA); },
    rateItems(umur){ return build(umur).flatMap(e => (e.sections||[]).flatMap(s => s.items.map(x => Object.assign({ el:e.key, sec:s }, x)))); },
    // effective level: latest sent/visible penggal wins
    level(r, k, upTo){ return (upTo >= 2 && r.p[2][k]) || r.p[1][k] || null; },
    // target = items disarankan for this penggal (plus items for both penggal)
    progress(r, pg){ const items = this.rateItems(r.umur).filter(x => !x.sec.tambahan && (x.p === 0 || x.p === pg)); const done = items.filter(x => r.p[pg][x.k]).length; return { done, total: items.length }; },
    // Rumusan + per-element detail (read-only) — used by parent/prestasi.html and app/permarkahan.html
    report(kid, r, pg){
      const S = this, esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
      const lvl = v => v ? `<span class="lvl ${v}" title="${S.LVN[v]}">${v}</span>` : '<span class="lvl none">Belum dinilai</span>';
      const R = S.rumusan(r, pg), TPL = S.build(kid.umur), P = r.p[pg];
      const color = k => TPL.find(e => e.key === k).color;
      const rows = [
        ['CELIK SAHSIAH','sahsiah', R.sahsiah ? `${lvl(R.sahsiah)} &nbsp;${S.LVN[R.sahsiah]}` : '<small>Belum dinilai</small>'],
        ['CELIK AL-QURAN','quran', `Nurul Quran: menguasai sehingga <b>${esc(R.nq || '—')}</b><br>Pratahfiz Surah Lazim: menghafaz sehingga <b>${esc(R.surah || '—')}</b><br>Pratahfiz Surah Al-Mulk: menghafaz sehingga <b>${esc(R.mulk || '—')}</b>`],
        ['CELIK BAHASA','bahasa', R.siri ? `Boleh membaca Buku Adikku Pandai Membaca <b>Siri ${R.siri}</b>` : '<small>Belum dinilai</small>'],
        ['CELIK MINDA','minda', R.minda != null ? `Ujian Celik Minda: <b>${R.minda}/100</b> · <b>${R.mindaTahap}</b>` : '<small>Belum diuji</small>'],
        ['CELIK CERDAS','cerdas', R.cerdas ? `Terlibat dalam aktiviti di peringkat <b>${R.cerdas}</b>` : '<small>Tiada aktiviti direkod</small>'],
        ['PROJEK AULAD','aulad', R.aulad ? `${lvl(R.aulad)} &nbsp;${S.LVN[R.aulad]}${r.aulad.tajuk ? ' · <small>' + esc(r.aulad.tajuk) + '</small>' : ''}` : '<small>Belum dinilai</small>'],
        ['ULASAN GURU','ulasan', R.ulasan ? esc(R.ulasan) : '<small>Tiada ulasan</small>'],
      ];
      let h = `<div class="rum"><div class="rum-h"><b>Rumusan Prestasi Peribadi · ${kid.umur} Tahun</b><span>${esc(kid.nama)} · Penggal ${pg} · dihantar guru ${r.sentAt[pg] || ''}</span></div>
        ${rows.map(([n,k,v]) => `<div class="rum-r"><div class="e" style="background:${color(k)}">${n}</div><div class="v">${v}</div></div>`).join('')}</div>`;
      // detail per element
      TPL.filter(e => e.sections).forEach(e => {
        const items = e.sections.flatMap(s => s.items), c = { AM:0, M:0, SM:0 }; items.forEach(x => { if (P[x.k]) c[P[x.k]]++; });
        const n = items.length, mix = ['SM','M','AM'].map(l => `<i style="width:${c[l]/n*100}%;background:${l==='SM'?'var(--brand)':l==='M'?'#2563eb':'var(--accent-d)'}"></i>`).join('');
        h += `<details class="el"><summary><span class="dot" style="background:${e.color}"></span><b>${e.nama}</b><span class="muted" style="font-size:12px">${c.SM+c.M+c.AM}/${n}</span><span class="mix">${mix}</span></summary>
          ${e.sections.map(s => `<div class="sec-t">${esc(s.title)}</div>${s.items.map(x => `<div class="it"><div><em>${esc(x.k.replace(/^[A-Z]+/,''))}</em>${esc(x.t)}</div>${lvl(P[x.k])}</div>`).join('')}`).join('')}
          ${e.aktiviti ? `<div class="sec-t">Aktiviti yang disertai</div>${r.aktiviti.map(a => `<div class="it"><div><b>${esc(a.nama)}</b><br><small class="muted">Anjuran: ${esc(a.anjuran)}${a.catatan ? ' · ' + esc(a.catatan) : ''}</small></div><span class="badge b-green no-dot">${esc(a.peringkat)}</span></div>`).join('') || '<div class="it muted">Tiada aktiviti.</div>'}` : ''}</details>`;
      });
      const au = r.aulad;
      h += `<details class="el"><summary><span class="dot" style="background:${color('aulad')}"></span><b>Projek Aulad</b>${lvl(au.skor)}</summary>
        <div class="it"><div>Tema</div><b>${esc(au.tema || '—')}</b></div><div class="it"><div>Tajuk Projek</div><b>${esc(au.tajuk || '—')}</b></div>
        ${Object.keys(au.items).length ? TPL.find(e => e.key === 'aulad').items.map(x => `<div class="it"><div>${x}</div>${lvl(au.items[x])}</div>`).join('') : ''}</details>`;
      h += `<div class="muted mt no-print" style="font-size:12px">AM = Ansur Maju · M = Maju · SM = Sangat Maju. Penilaian dibuat oleh guru kelas mengikut buku rekod SPPM PASTI.</div>`;
      return h;
    },
    // Rumusan Prestasi Peribadi (last page of the book)
    rumusan(r, upTo){
      const tpl = build(r.umur), L = k => this.level(r, k, upTo), ok = k => { const v = L(k); return v === 'M' || v === 'SM'; };
      const avg = keys => { const v = keys.map(L).filter(Boolean).map(x => LV[x]); if (!v.length) return null; const a = v.reduce((p,c) => p+c, 0) / v.length; return a >= 2.5 ? 'SM' : a >= 1.5 ? 'M' : 'AM'; };
      const sah = tpl.find(e => e.key === 'sahsiah').sections.flatMap(s => s.items.map(x => x.k));
      const q = tpl.find(e => e.key === 'quran').sections, lastOk = sec => { const a = sec ? sec.items.filter(x => ok(x.k)) : []; return a.length ? a[a.length-1] : null; };
      const nq = lastOk(q.filter(s => s.nq).reduce((a,s) => ({ items: a.items.concat(s.items) }), { items:[] }));
      const lz = lastOk(q.find(s => s.lazim)), ml = lastOk(q.find(s => s.mulk));
      const bm = tpl.find(e => e.key === 'bahasa').sections.filter(s => s.siri).map(s => ({ s, last: lastOk(s) })).filter(x => x.last).pop();
      const siri = bm ? (bm.last.t.match(/Buku (\d)/) || [,bm.s.siri])[1] : null;
      const top = r.aktiviti.reduce((m,a) => Math.max(m, PERINGKAT.indexOf(a.peringkat)), -1);
      const score = upTo >= 2 && r.minda[2] != null ? r.minda[2] : r.minda[1];
      return { sahsiah: avg(sah), nq: nq && nq.t, surah: lz && lz.t, mulk: ml && ml.t, siri, minda: score, mindaTahap: tahapMinda(score),
        cerdas: top >= 0 ? PERINGKAT[top] : null, aulad: r.aulad.skor || null, ulasan: (upTo >= 2 && r.ulasan[2]) || r.ulasan[1] };
    },
  };
  window.SPPM = SPPM;
})();
