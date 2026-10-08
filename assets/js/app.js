/* ==========================================================================
   ePASTI 2.0 — shell renderer & interaction engine
   Each app page: <div class="pt-app" data-module="warga" data-page="warga-guru"
                       data-title="…" data-subtitle="…"> … <main class="pt-main">
   app.js injects the green header + icon rail and wires all interactions.
   ========================================================================== */
(function () {
  // Data version: when it changes, every ePASTI key kept in this browser (DB, saved tables, SPPM,
  // kehadiran, sign-in) is cleared so old sample data can never come back from cache.
  const DATA_VER = '2026-10-08-nodaftar';
  try { if (localStorage.getItem('pt-data-ver') !== DATA_VER) {
    Object.keys(localStorage).filter(k => /^pt[-:]|^pt_/.test(k)).forEach(k => localStorage.removeItem(k));
    Object.keys(sessionStorage).filter(k => /^pt[-:]/.test(k)).forEach(k => sessionStorage.removeItem(k));
    localStorage.setItem('pt-data-ver', DATA_VER);
  } } catch(e){}
  // "?reset=1" restores the demo data (before any page script reads it). The signed-in user stays signed in.
  const RESET = /[?&]reset=1/.test(location.search);
  if (RESET) try {
    Object.keys(localStorage).filter(k => /^pt-(tbl|apps|markah|kehadiran|queue|kempen|events|notis|cuti|payments|clock-guru|autodebit|pemakluman-read)/.test(k)).forEach(k => localStorage.removeItem(k));
    localStorage.removeItem('pt-log');                // access / audit log (PT.logAccess)
  } catch(e){}
  const I = {
    home:'M3 11l9-8 9 8M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10',
    users:'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
    user:'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8',
    folder:'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z',
    card:'M2 5h20v14H2zM2 10h20',
    chart:'M3 3v18h18M18 17V9M13 17V5M8 17v-3',
    cog:'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.82 1.17V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15H4.5a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 6 9.4l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 11 6.6V4.5a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 2.82 1.17l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 21 11h.09a2 2 0 1 1 0 4H21',
    logout:'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
    search:'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
    money:'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
    chevron:'M6 9l6 6 6-6',
    shield:'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    file:'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6',
    bell:'M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0',
    clock:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20M12 6v6l4 2',
    more:'M4 6h16M4 12h16M4 18h16',
    check:'M20 6L9 17l-5-5',
    cal:'M3 4h18v18H3zM16 2v4M8 2v4M3 10h18',
    wifi:'M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 19.5h.01',
    download:'M12 3v12M7 10l5 5 5-5M5 21h14',
    heart:'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.5 1-1a5.5 5.5 0 0 0 0-7.8z',
    // Navigation set (Lucide-style, ISC) — raw SVG markup
    nHome:'<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    nDash:'<rect width="7" height="9" x="3" y="3" rx="1.5"/><rect width="7" height="5" x="14" y="3" rx="1.5"/><rect width="7" height="9" x="14" y="12" rx="1.5"/><rect width="7" height="5" x="3" y="16" rx="1.5"/>',
    nUsers:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    nSchool:'<path d="M14 22v-4a2 2 0 1 0-4 0v4"/><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/><path d="M18 5v17"/><path d="m4 6 8-4 8 4"/><path d="M6 5v17"/><circle cx="12" cy="9" r="2"/>',
    nCoins:'<rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>',
    nChart:'<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
    nCalClock:'<path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h5"/><path d="M17.5 17.5 16 16.3V14"/><circle cx="16" cy="16" r="6"/>',
    nHandHeart:'<path d="M11 14h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16"/><path d="m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"/><path d="m2 15 6 6"/><path d="M19.5 8.5c.7-.7 1.5-1.6 1.5-2.7A2.73 2.73 0 0 0 16 4a2.78 2.78 0 0 0-5 1.8c0 1.2.8 2 1.5 2.8L16 12Z"/>',
    nSettings:'<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    nBaby:'<path d="M9 12h.01"/><path d="M15 12h.01"/><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"/>',
    nAward:'<path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/>',
    nWallet:'<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
    nReceipt:'<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/>',
    nBell:'<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>',
    nUserCircle:'<path d="M18 20a6 6 0 0 0-12 0"/><circle cx="12" cy="10" r="4"/><circle cx="12" cy="12" r="10"/>',
    nTimer:'<line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/>',
    nUserCheck:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/>',
    nClipboard:'<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
    nCalendar:'<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/>',
    nGrid:'<rect width="7" height="7" x="3" y="3" rx="1.5"/><rect width="7" height="7" x="14" y="3" rx="1.5"/><rect width="7" height="7" x="14" y="14" rx="1.5"/><rect width="7" height="7" x="3" y="14" rx="1.5"/>',
    nLogout:'<path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>',
  };
  const svg = (d) => { const raw = d.charAt(0) === '<'; return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${raw ? 1.75 : 1.9}" stroke-linecap="round" stroke-linejoin="round">${raw ? d : d.split('M').filter(Boolean).map(s=>'<path d="M'+s+'"/>').join('')}</svg>`; };

  const MODULES = [
    { key:'dashboard', label:'Utama', icon:'nDash', href:'dashboard.html' },
    { key:'warga', label:'Warga PASTI', icon:'nUsers', children:[
      { cap:'Jawatankuasa PASTI' },
      { label:'Ahli Jawatankuasa Kawasan', file:'warga-jawatankuasa', tab:'ajk', tiers:'negeri kawasan' },
      { label:'Jemaah Pengurus Cawangan', file:'warga-jawatankuasa', tab:'jemaah' },
      { cap:'Petugas PASTI' },
      { label:'Petugas PASTI Kawasan', file:'warga-petugas', tab:'kawasan' },
      { label:'Petugas PASTI Cawangan', file:'warga-petugas', tab:'cawangan' },
      { cap:'Guru & Pembantu' },
      { label:'Senarai Guru PASTI', file:'warga-guru', tab:'guru' },
      { label:'Senarai Pembantu Guru', file:'warga-guru', tab:'pembantu' },
    ]},
    { key:'pengurusan', label:'Pengurusan & Murid', icon:'nSchool', children:[
      { cap:'Pengurusan PASTI' },
      { label:'Pengurusan PASTI', file:'pasti-pengurusan' },
      { cap:'Murid & Ibu Bapa' },
      { label:'Permohonan Murid', file:'murid-permohonan' },
      { label:'Senarai Murid', file:'murid-senarai' },
      { label:'Cetak Sijil Murid', file:'murid-sijil' },
      { label:'Ibu Bapa / Penjaga', file:'ibubapa-senarai' },
      { cap:'Akademik' },
      { label:'Permarkahan Murid', file:'permarkahan' },
    ]},
    { key:'caruman', label:'Caruman & Yuran', icon:'nCoins', children:[
      { label:'Caruman Skim PASTI', file:'caruman' },
      { label:'Pengurusan Yuran', file:'yuran' },
      { label:'Payment Gateway', file:'payment-gateway' },
    ]},
    { key:'pelaporan', label:'Pelaporan', icon:'nChart', children:[
      { label:'Papan Pemuka', file:'laporan-papan-pemuka' },
      { label:'Laporan Guru PASTI', file:'laporan-guru' },
      { label:'Laporan Murid PASTI', file:'laporan-murid' },
      { label:'Laporan Warga PASTI', file:'laporan-warga' },
    ]},
    { key:'operasi', label:'Operasi', icon:'nCalClock', children:[
      { label:'Kehadiran (Check-in/out)', file:'kehadiran' },
      { label:'Cuti Guru', file:'cuti-guru' },
      { label:'Takwim & Program', file:'calendar' },
      { label:'Notifikasi & Notis', file:'notifikasi' },
      { label:'Log Akses (Audit)', file:'log-akses' },
    ]},
    { key:'kempen', label:'Kempen & Derma', icon:'nHandHeart', children:[
      { label:'Kempen PASTI', file:'kempen' },
      { label:'Derma / Donation', file:'derma' },
    ]},
    { key:'tetapan', label:'Tetapan', icon:'nSettings', href:'tetapan.html' },
  ];

  // Parent portal (data-portal="parent") — its own rail, no tier/scope.
  const PARENT_MODULES = [
    { key:'dashboard',  label:'Utama',       icon:'nHome',  href:'dashboard.html' },
    { key:'anak',       label:'Anak Saya',   icon:'nBaby', href:'anak.html' },
    { key:'prestasi',   label:'Prestasi Anak', icon:'nAward', href:'prestasi.html' },
    { key:'yuran',      label:'Yuran',       icon:'nWallet', href:'yuran.html' },
    { key:'resit',      label:'Resit',       icon:'nReceipt',  href:'resit.html' },
    { key:'pemakluman', label:'Makluman',    icon:'nBell',  href:'pemakluman.html' },
    { key:'profil',     label:'Profil',      icon:'nUserCircle',  href:'profil.html' },
  ];
  const PARENT_USER = { name:'PUAN NURUL NABIHAH BINTI HAFIZUDDIN', role:'Ibu Bapa / Penjaga' };

  // Teacher/guru portal (data-portal="guru")
  const GURU_MODULES = [
    { key:'dashboard', label:'Utama',            icon:'nHome',  href:'dashboard.html' },
    { key:'clock',     label:'Clock In / Out',   icon:'nTimer', href:'clock.html' },
    { key:'murid',     label:'Kehadiran Murid',  icon:'nUserCheck', href:'murid.html' },
    { key:'markah',    label:'Permarkahan',      icon:'nClipboard',  href:'markah.html' },
    { key:'takwim',    label:'Takwim & Program', icon:'nCalendar',  href:'takwim.html' },
    { key:'profil',    label:'Profil',           icon:'nUserCircle',  href:'profil.html' },
  ];
  const GURU_USER = { name:'USTAZAH SITI IFFAH BINTI RIZQI', role:"Guru PASTI · AR-RAIHAN" };

  // Portal registry — non-admin portals (own rail, no tier/scope).
  const PORTALS = {
    parent: { tabs:['dashboard','anak','prestasi','yuran'], modules: PARENT_MODULES, user: PARENT_USER, sys:'Portal Ibu Bapa PASTI', sub:'Portal Ibu Bapa' },
    guru:   { tabs:['dashboard','clock','murid','markah'], modules: GURU_MODULES,   user: GURU_USER,   sys:'Portal Guru PASTI',      sub:'Portal Guru' },
  };

  const USER = { name:'MUHAMAD RAZLAN BIN KAMIL', role:'PENTADBIR P.25 KOTA BHARU' };

  // ===========================================================================
  //  Mock database (per browser) — shared by every page so a record created on
  //  one page shows up on the next: PASTI applications, student applications,
  //  user accounts. Seeded once; "?reset=1" on any page restores the seed.
  // ===========================================================================
  const DBKEY = 'pt-db-v2';
  const HIER = { pusat:'negeri', negeri:'kawasan', kawasan:'dun', dun:'cawangan', cawangan:'guru' };   // who each tier creates
  const ROLE_LABEL = { pusat:'Pentadbir Pusat', negeri:'Pentadbir Negeri', kawasan:'Pentadbir Kawasan', dun:'Pentadbir DUN', cawangan:'Pentadbir Cawangan', guru:'Guru PASTI', pembantu:'Pembantu Guru', ibubapa:'Ibu Bapa / Penjaga' };
  function seedDB(){
    const P = (no,t,nama,alamat,tel,kaw,dun,status,extra) => Object.assign({ no, tarikh:t, nama, alamat, tel, negeri:'KELANTAN', kawasan:kaw, dun, status, sejarah:[] }, extra||{});
    const KK = 'P021 KOTA BHARU';
    const pasti = [
      P('D/140/2021','12/01/2021',"PASTI AR-RAIHAN",'No 3, Jalan Masjid, Kota Bharu','09-1450 0734',KK,'N09 KOTA LAMA','Lulus',{kod:'D030108',guru:9,murid:54,daftar:'BUKA'}),
      P('D/141/2021','14/01/2021','PASTI AN-NAJAH','Lorong Kurnia, Kota Bharu','09-3130 9765',KK,'N09 KOTA LAMA','Lulus',{kod:'D030109',guru:13,murid:78,daftar:'BUKA'}),
      P('D/142/2021','20/01/2021','PASTI AL-QAYYUM','Lot 224, Kota Lama, Kota Bharu','09-3140 1571',KK,'N09 KOTA LAMA','Lulus',{kod:'D030110',guru:7,murid:41,daftar:'BUKA'}),
      P('D/143/2021','02/02/2021','PASTI AL-MUNAWWARAH','No 8, Taman Bunut Payong Indah','09-2352 3542',KK,'N10 BUNUT PAYONG','Lulus',{kod:'D030111',guru:8,murid:49,daftar:'BUKA'}),
      P('D/144/2021','09/02/2021','PASTI AZ-ZAHRA','Kg Kubang Pasu, Kota Bharu','09-3153 2187',KK,'N09 KOTA LAMA','Lulus',{kod:'D030112',guru:10,murid:62,daftar:'BUKA'}),
      P('D/145/2021','15/02/2021','PASTI AL-IKHLAS','Jalan Bunut Payong Baru','09-3410 6010',KK,'N09 KOTA LAMA','Lulus',{kod:'D030113',guru:6,murid:38,daftar:'TUTUP'}),
      P('D/146/2021','01/03/2021','PASTI BAITUL ILMI','No 12, Jalan Besar, Kota Bharu','09-2904 3422',KK,'N09 KOTA LAMA','Lulus',{kod:'D030114',guru:11,murid:67,daftar:'BUKA'}),
      P('D/147/2021','08/03/2021','PASTI AL-HUDA','Lorong Hidayah, Kota Bharu','09-7014 7455',KK,'N09 KOTA LAMA','Lulus',{kod:'D030115',guru:8,murid:44,daftar:'BUKA'}),
      P('D/148/2021','15/03/2021','PASTI AL-MIZAN','Kg Kota Bharu Darat','09-1413 5212',KK,'N09 KOTA LAMA','Lulus',{kod:'D030116',guru:9,murid:51,daftar:'BUKA'}),
      // other Kelantan kawasan (P025 Bachok)
      P('D/131/2020','06/07/2020','PASTI AN-NUR HASANAH','Kg Tawang, Bachok','09-778 2140','P025 BACHOK','N20 TAWANG','Lulus',{kod:'D030101',guru:7,murid:42,daftar:'BUKA'}),
      P('D/132/2020','14/07/2020','PASTI DARUL NAIM','Jalan Pantai Irama, Bachok','09-778 5516','P025 BACHOK','N21 PANTAI IRAMA','Lulus',{kod:'D030102',guru:6,murid:35,daftar:'BUKA'}),
      // a few other states (light seed)
      Object.assign(P('C/210/2022','10/03/2022','PASTI BUKIT BESAR','Jalan Sultan Omar, Kuala Terengganu','09-622 4410','P036 KUALA TERENGGANU','N15 BANDAR','Lulus',{kod:'T040201',guru:8,murid:46,daftar:'BUKA'}),{negeri:'TERENGGANU'}),
      Object.assign(P('C/211/2022','22/03/2022','PASTI SERI LADANG','Kg Ladang, Kuala Terengganu','09-622 7781','P036 KUALA TERENGGANU','N16 LADANG','Lulus',{kod:'T040202',guru:6,murid:33,daftar:'BUKA'}),{negeri:'TERENGGANU'}),
      Object.assign(P('K/305/2023','05/05/2023','PASTI DERGA JAYA','Taman Derga Jaya, Alor Setar','04-731 2250','P009 ALOR SETAR','N13 DERGA','Lulus',{kod:'K020301',guru:5,murid:28,daftar:'TUTUP'}),{negeri:'KEDAH'}),
    ];
    const PIDX = ["PASTI AR-RAIHAN","PASTI AR-RAIHAN","PASTI AL-QAYYUM","PASTI AR-RAIHAN","PASTI AL-MUNAWWARAH","PASTI BAITUL ILMI","PASTI AR-RAIHAN","PASTI AZ-ZAHRA"];
    const M = (r,st,i,extra) => Object.assign({ tarikh:r[0], ref:r[1], nama:r[2], mykid:r[3], umur:r[4], bapa:r[5], kpBapa:r[6], telBapa:r[7], tarikhDaftar:r[8], status:st, pasti:PIDX[i%PIDX.length], kelas:'Tahun '+(10-+r[4]) }, extra||{});
    const MB = (r,st,pasti,emel,extra) => Object.assign(M(r,st,0,{ pasti, emel }), extra||{});
    const murid = [
      MB(['24/09/2026','B124782','NUR QAISARA ALIYA BINTI HAMDAN','220305038216','4','HAMDAN BIN YUSOF','880719035524','012-9087713','—'],'Baharu',"PASTI AR-RAIHAN",'hamdan.yusof@gmail.com',{ ibu:'NORHAYATI BINTI SALLEH' }),
      MB(['21/09/2026','B124783','MUHAMMAD HAFIY ISKANDAR BIN RIDZUAN','210829031947','5','RIDZUAN BIN ABDULLAH','850506033318','017-2231649','—'],'Baharu',"PASTI AR-RAIHAN",'ridzuan.abdullah@gmail.com'),
      ...[['20/09/2026','B124781','ROZITA ASMA BINTI IZZUDDIN','210817032711','5','IZZUDDIN BIN LUTFI','840203035402','013-7012324','—'],
      ['19/09/2026','B124780','MUHAMMAD ZAKWAN IQMAL BIN RAFIE','200629031454','6','RAFIE BIN MUSTAQIM','821014031401','019-6770250','—'],
      ['18/09/2026','B124779','RAIHANA FAUZIAH BINTI WAFIY','211105035584','4','WAFIY BIN AFIQ','850926030942','012-5740515','—'],
      ['17/09/2026','B124778','ZAIM TAQIUDDIN BIN MARWAN','200418037706','6','MARWAN BIN MAZLAN','830705035231','017-5922027','—'],
      ['16/09/2026','B124777','IFFAH MAWADDAH BINTI HUZAIFAH','210312033105','5','HUZAIFAH BIN RASYDAN','860128034046','011-71636246','—'],
      ['15/09/2026','B124776','MUHAMMAD OMAR BIN MUAZ','201002038396','6','MUAZ BIN IKHWAN','800917037010','013-7420130','—']].map((r,i)=>M(r,'Baharu',i,{emel:r[5].split(' ')[0].toLowerCase()+'@gmail.com'})),
      ...[['10/09/2026','B124770','SURAYA ROSMANIZA BINTI UMAIR','200811032159','6','UMAIR BIN FIRDAUS','810319033033','013-1525455','12/09/2026'],
      ['09/09/2026','B124769','MUHAMMAD GHAZI BIN NUAIM','201118034346','6','NUAIM BIN ZIKRI','831207031303','019-4215743','11/09/2026'],
      ['08/09/2026','B124768','ZAHRA QISTINA BINTI ASRI','210206035117','5','ASRI BIN YAZID','840716032115','012-0412598','10/09/2026'],
      ['07/09/2026','B124767','MUHAMMAD ANAS BIN FADHIL','200924034237','6','FADHIL BIN WAJDI','801003037283','017-1096460','09/09/2026']].map((r,i)=>M(r,'Diterima',i+1)),
      MB(['05/01/2026','B124701','MUHAMMAD NAZMI BIN CHE FARHAN','150507034460','5','CHE FARHAN BIN CHE MAT','830411035217','013-9021478','07/01/2026'],'Diterima',"PASTI AR-RAIHAN",'chefarhan.chemat@gmail.com',{ kelas:'Tahun 5' }),
      MB(['06/01/2026','B124702','NUR AISYAH HUMAIRA BINTI ZULHILMI','210414036128','5','ZULHILMI BIN AZHAR','860302035119','019-3348120','08/01/2026'],'Diterima',"PASTI AR-RAIHAN",'zulhilmi.azhar@gmail.com'),
      MB(['07/01/2026','B124703','MUHAMMAD ARIF HAZIQ BIN ROSDI','200923031875','6','ROSDI BIN HASHIM','820917035561','013-4470215','09/01/2026'],'Diterima','PASTI BAITUL ILMI','rosdi.hashim@gmail.com'),
      MB(['07/01/2026','B124704','NUR IMAN SAFIYYA BINTI KHAIRUL','210628034402','5','KHAIRUL BIN NASIR','870212034487','019-5582031','09/01/2026'],'Diterima','PASTI BAITUL ILMI','khairul.nasir@gmail.com'),
      MB(['08/01/2026','B124705','AHMAD DANISH ZAFRAN BIN MOKHTAR','200315037731','6','MOKHTAR BIN ISMAIL','810624035306','017-9013542','10/01/2026'],'Diterima','PASTI AL-MUNAWWARAH','mokhtar.ismail@gmail.com'),
      MB(['09/01/2026','B124706','MUHAMMAD RAYYAN FIKRI BIN SAHARUDDIN','210117030559','5','SAHARUDDIN BIN OMAR','840830036621','012-6614370','12/01/2026'],'Diterima','PASTI AN-NUR HASANAH','saharuddin.omar@gmail.com'),
      ...[['02/09/2026','B124760','MUHAMMAD AMSYAR BIN KHALISH','210903032801','5','KHALISH BIN JAMIL','850812035520','013-1101154','—'],
      ['01/09/2026','B124759','KHALISAH SYAKIRAH BINTI MUSTAQIM','211008034955','4','MUSTAQIM BIN SAIFULLAH','870627034933','017-5435253','—']].map((r,i)=>M(r,'Ditolak',i,{sebab:'Kuota kelas telah penuh.'})),
    ];
    const U = (nama,emel,peranan,skop,oleh,tarikh) => ({ nama, emel, peranan, skop, oleh, tarikh, status:'Aktif' });
    const users = [
      U("Dato' Hj Kamaruddin Yaakub",'pusat@pasti.org','pusat','Jabatan PASTI Malaysia','Sistem','01/01/2025'),
      U('Ustaz Asri Zamri','negeri@pasti.org','negeri','KELANTAN','Pentadbir Pusat','05/01/2025'),
      U('Ustaz Rafie Sufyan','terengganu@pasti.org','negeri','TERENGGANU','Pentadbir Pusat','05/01/2025'),
      U('Muhamad Razlan bin Kamil','kawasan@pasti.org','kawasan','P021 KOTA BHARU','Pentadbir Negeri','10/01/2025'),
      U('Ustaz Aizat Rizqi','bachok@pasti.org','kawasan','P025 BACHOK','Pentadbir Negeri','10/01/2025'),
      U('Ustaz Darwisy Yusri','dun@pasti.org','dun','N09 KOTA LAMA','Pentadbir Kawasan','14/01/2025'),
      U('Ustaz Fauzi Jamil','n10@pasti.org','dun','N10 BUNUT PAYONG','Pentadbir Kawasan','14/01/2025'),
      U('Ustazah Husna Mardhiah','cawangan@pasti.org','cawangan',"PASTI AR-RAIHAN",'Pentadbir DUN','20/01/2025'),
      U('Ustaz Fahmi Taqiuddin','qayyum@pasti.org','cawangan','PASTI AL-QAYYUM','Pentadbir DUN','20/01/2025'),
      U('Ustazah Siti Iffah binti Rizqi','guru@pasti.org','guru',"PASTI AR-RAIHAN",'Pentadbir Cawangan','02/01/2026'),
      U('Ustazah Siti Nabila Taqiuddin','nabila@pasti.org','guru',"PASTI AR-RAIHAN",'Pentadbir Cawangan','02/01/2026'),
      U('Puan Nur Aina binti Zulkifli','pembantu@pasti.org','pembantu',"PASTI AR-RAIHAN",'Pentadbir Cawangan','06/01/2026'),
      U('Puan Nurul Nabihah binti Hafizuddin','ibubapa@pasti.org','ibubapa',"PASTI AR-RAIHAN",'Automatik (murid diterima)','05/01/2026'),
    ];
    return { pasti, murid, users };
  }
  function loadDB(){
    try { if (/[?&]reset=1/.test(location.search)) localStorage.removeItem(DBKEY);
      const s = localStorage.getItem(DBKEY);
      if (s) { const d = JSON.parse(s); return d; } } catch(e){}
    const d = seedDB(); try { localStorage.setItem(DBKEY, JSON.stringify(d)); } catch(e){} return d;
  }
  // ---- geography (mockup): negeri → kawasan → dun. PASTI rows carry their own negeri/kawasan/dun.
  const NEGERI = ['JOHOR','KEDAH','KELANTAN','MELAKA','NEGERI SEMBILAN','PAHANG','PERAK','PERLIS','PULAU PINANG','SABAH','SARAWAK','SELANGOR','TERENGGANU','WP KUALA LUMPUR & PUTRAJAYA'];
  // Kelantan: 14 Parlimen / 45 DUN. Other states: a few sample kawasan only.
  const GEO = {
    KELANTAN: {
      'P019 TUMPAT':['N01 PENGKALAN KUBOR','N02 KELABORAN','N03 PASIR PEKAN','N04 WAKAF BHARU'],
      'P020 PENGKALAN CHEPA':['N05 KIJANG','N06 CHEMPAKA','N07 PANCHOR'],
      'P021 KOTA BHARU':['N08 TANJONG MAS','N09 KOTA LAMA','N10 BUNUT PAYONG'],
      'P022 PASIR MAS':['N11 TENDONG','N12 PENGKALAN PASIR','N13 MERANTI'],
      'P023 RANTAU PANJANG':['N14 CHETOK','N15 GUAL PERIOK','N16 APAM PUTRA'],
      'P024 KUBANG KERIAN':['N17 SALOR','N18 PASIR TUMBOH','N19 DEMIT'],
      'P025 BACHOK':['N20 TAWANG','N21 PANTAI IRAMA','N22 JELAWAT'],
      'P026 KETEREH':['N23 MELOR','N24 KADOK','N25 KOK LANAS'],
      'P027 TANAH MERAH':['N26 BUKIT PANAU','N27 GUAL IPOH','N28 KEMAHANG'],
      'P028 PASIR PUTEH':['N29 SELISING','N30 LIMBONGAN','N31 SEMERAK','N32 GAAL'],
      'P029 MACHANG':['N33 PULAI CHONDONG','N34 TEMANGAN','N35 KEMUNING'],
      'P030 JELI':['N36 BUKIT BUNGA','N37 AIR LANAS','N38 KUALA BALAH'],
      'P031 KUALA KRAI':['N39 MENGKEBANG','N40 GUCHIL','N41 MANEK URAI','N42 DABONG'],
      'P032 GUA MUSANG':['N43 NENGGIRI','N44 PALOH','N45 GALAS'],
    },
    TERENGGANU: { 'P036 KUALA TERENGGANU':['N15 BANDAR','N16 LADANG'], 'P038 HULU TERENGGANU':['N19 TELEMONG','N20 MANIR'] },
    KEDAH: { 'P009 ALOR SETAR':['N13 DERGA','N14 BAKAR BATA'] },
  };
  const findKaw = k => { for (const n in GEO) if (GEO[n][k]) return n; return null; };
  const findDun = d => { for (const n in GEO) for (const k in GEO[n]) if (GEO[n][k].includes(d)) return { negeri:n, kawasan:k }; return null; };
  const normPasti = s => String(s || '').toUpperCase().replace(/^PASTI\s+/,'').replace(/[^A-Z0-9]/g,'');
  const ADMIN_ROLES = ['pusat','negeri','kawasan','dun','cawangan'];
  const PASTI_ROLES = ['cawangan','guru','pembantu','ibubapa'];            // accounts that sit at one PASTI
  // where an account sits: { negeri, kawasan, dun, pasti }
  function chainOf(u){
    u = u || {};
    const c = { negeri:u.negeri || null, kawasan:u.kawasan || null, dun:u.dun || null, pasti:null };
    if (u.peranan === 'negeri') c.negeri = u.skop;
    if (u.peranan === 'kawasan') { c.kawasan = u.skop; c.negeri = c.negeri || findKaw(u.skop); }
    if (u.peranan === 'dun') { c.dun = u.skop; const f = findDun(u.skop); if (f) { c.kawasan = c.kawasan || f.kawasan; c.negeri = c.negeri || f.negeri; } }
    if (PASTI_ROLES.includes(u.peranan)) { c.pasti = u.skop; const p = DB.find('pasti', x => normPasti(x.nama) === normPasti(u.skop)); if (p) { c.pasti = p.nama; c.dun = p.dun; c.kawasan = p.kawasan; c.negeri = p.negeri; } }
    return c;
  }
  // predicate: is PASTI record p inside the scope of account u?
  function scopePred(u){
    if (!u || u.peranan === 'pusat') return () => true;
    const c = chainOf(u);
    if (u.peranan === 'negeri')  return p => p.negeri === c.negeri;
    if (u.peranan === 'kawasan') return p => p.kawasan === c.kawasan;
    if (u.peranan === 'dun')     return p => p.dun === c.dun;
    return p => normPasti(p.nama) === normPasti(c.pasti);
  }

  const DB = {
    data: loadDB(),
    save(){ try { localStorage.setItem(DBKEY, JSON.stringify(this.data)); } catch(e){} },
    all(col){ return this.data[col] || []; },
    add(col, obj){ (this.data[col] = this.data[col] || []).unshift(obj); this.save(); return obj; },
    find(col, fn){ return this.all(col).find(fn); },
    user(){ let e = null; try { e = localStorage.getItem('pt-user'); } catch(x){} return e ? this.find('users', u => u.emel.toLowerCase() === e.toLowerCase()) : null; },
    nextNo(){ const n = Math.max(...this.all('pasti').filter(p => /^D\//.test(p.no)).map(p => +String(p.no).split('/')[1] || 0)) + 1; return 'D/' + n + '/2026'; },
    nextKod(){ const n = Math.max(...this.all('pasti').filter(p => p.kod && p.kod[0] === 'D').map(p => +p.kod.slice(1))) + 1; return 'D' + String(n).padStart(6,'0'); },
    nextRef(){ const n = Math.max(...this.all('murid').map(m => +m.ref.slice(1))) + 1; return 'B' + n; },
    HIER, ROLE_LABEL, GEO, NEGERI,
    chainOf,
    // active PASTI (status Lulus with kod) inside the signed-in account's scope (pusat = all)
    pastiInScope(){ const f = scopePred(this.user()); return this.all('pasti').filter(p => p.status === 'Lulus' && p.kod && f(p)); },
    // PASTI record from a record / nama / kod
    pastiOf(x){ if (x && typeof x === 'object') return x; const n = normPasti(x), k = String(x || '').trim().toUpperCase();
      return DB.find('pasti', p => (p.kod && p.kod.toUpperCase() === k) || normPasti(p.nama) === n) || null; },
  };
  window.DB = DB;

  // Each tier has a different role → sees only the modules/pages it may use.
  // Name & scope always come from the signed-in account (DB user) — see scopeInfo().
  const TIERS = {
    pusat: { label:'Pentadbir Pusat (HQ)',
      allow:['dashboard','caruman','payment-gateway','laporan-papan-pemuka','laporan-guru','laporan-murid','laporan-warga','calendar','notifikasi','log-akses','kempen','derma','tetapan'] },
    negeri: { label:'Pentadbir Negeri',
      allow:['dashboard','warga-jawatankuasa','pasti-pengurusan','caruman','payment-gateway','laporan-papan-pemuka','laporan-guru','laporan-murid','laporan-warga','calendar','notifikasi','log-akses','kempen','derma','tetapan'] },
    kawasan: { label:'Pentadbir Kawasan',
      allow:['dashboard','warga-jawatankuasa','warga-petugas','warga-guru','pasti-pengurusan','murid-permohonan','murid-senarai','murid-sijil','ibubapa-senarai','permarkahan','caruman','yuran','payment-gateway','kehadiran','cuti-guru','calendar','notifikasi','log-akses','kempen','derma','laporan-papan-pemuka','laporan-guru','laporan-murid','laporan-warga','tetapan'] },
    dun: { label:'Pentadbir DUN',
      allow:['dashboard','warga-petugas','warga-guru','pasti-pengurusan','murid-permohonan','murid-senarai','murid-sijil','ibubapa-senarai','permarkahan','caruman','yuran','payment-gateway','kehadiran','cuti-guru','calendar','notifikasi','log-akses','tetapan','kempen','derma','laporan-papan-pemuka','laporan-guru','laporan-murid'] },
    cawangan: { label:'Pentadbir Cawangan',
      allow:['dashboard','warga-jawatankuasa','warga-guru','murid-permohonan','murid-senarai','murid-sijil','ibubapa-senarai','permarkahan','caruman','yuran','payment-gateway','kehadiran','cuti-guru','calendar','notifikasi','log-akses','tetapan','kempen','derma','laporan-papan-pemuka','laporan-guru','laporan-murid'] },
  };
  // Role/tier is decided by the signed-in account (index.html); NOT switchable inside the app.
  // 'kawasan' is only a harmless fallback — every app page redirects to login without a user.
  const getTier = () => { const u = DB.user(); if (u) return u.peranan; try { return localStorage.getItem('pt-tier') || 'kawasan'; } catch(e){ return 'kawasan'; } };

  // Scope of the signed-in account: where it sits + every PASTI (any status) inside it.
  function scopeInfo(){
    const u = DB.user(), tier = getTier();
    if (!u) return { tier, skop:null, label: tier === 'pusat' ? 'Semua Negeri PASTI' : '', negeri:null, kawasan:null, dun:null, pasti:null, pastiNames:null, nama:'', tierLabel:(TIERS[tier] || {}).label || '' };
    const c = chainOf(u), f = scopePred(u);
    return { tier, skop:u.skop, label: tier === 'pusat' ? 'Semua Negeri PASTI' : u.skop, negeri:c.negeri, kawasan:c.kawasan, dun:c.dun, pasti:c.pasti,
      pastiNames: tier === 'pusat' ? null : DB.all('pasti').filter(f).map(p => p.nama),
      nama:u.nama, tierLabel:(TIERS[tier] || {}).label || ROLE_LABEL[tier] || '' };
  }
  const inScope = name => { const s = scopeInfo(); if (!s.pastiNames) return true; const n = normPasti(name); return s.pastiNames.some(p => normPasti(p) === n); };
  // Broadcast target levels: own level and below
  const LEVEL_NAMES = ['Malaysia','Negeri','Kawasan','DUN','Cawangan'];
  const levels = () => { const i = { pusat:0, negeri:1, kawasan:2, dun:3 }[getTier()]; return LEVEL_NAMES.slice(i == null ? 4 : i); };
  // <select data-levels>: drop level options above the signed-in tier (options naming no level stay)
  function trimLevels(root){
    const ok = levels().map(x => x.toUpperCase());
    (root || document).querySelectorAll('select[data-levels]').forEach(sel => {
      [...sel.options].forEach(o => {
        const m = /\b(MALAYSIA|NEGERI|KAWASAN|DUN|CAWANGAN)\b/.exec((o.text || '').toUpperCase());
        if (m && !ok.includes(m[1])) o.remove();
      });
      if (sel.selectedIndex < 0 && sel.options.length) sel.selectedIndex = 0;
    });
  }

  // Locality filters — a tier can't filter above its own level.
  // Levels are locked from the top: Negeri locks Negeri, Kawasan locks Negeri+Kawasan, …,
  // Cawangan locks all four (it only ever sees its own PASTI).
  const LOC_LEVELS = ['NEGERI','KAWASAN','DUN','PASTI'];
  const LOCKED = { pusat:0, negeri:1, kawasan:2, dun:3, cawangan:4 };
  const ALL_KAW = () => { const a = []; for (const n in GEO) for (const k in GEO[n]) a.push({ n, k }); return a; };
  const ALL_DUN = () => { const a = []; for (const n in GEO) for (const k in GEO[n]) GEO[n][k].forEach(d => a.push({ n, k, d })); return a; };
  // is a negeri / kawasan / dun ({n,k,d}) compatible with the scope chain?
  const locOk = (S, lvl, x) => {
    if (S.tier === 'pusat') return true;
    if (lvl === 'NEGERI')  return x.n === S.negeri;
    if (lvl === 'KAWASAN') return S.kawasan ? x.k === S.kawasan : x.n === S.negeri;
    if (lvl === 'DUN')     return S.dun ? x.d === S.dun : S.kawasan ? x.k === S.kawasan : x.n === S.negeri;
    return true;
  };
  function scopeFilters(){
    const tier = getTier(), t = TIERS[tier]; if(!t) return;
    const S = scopeInfo(), locked = LOCKED[tier] || 0;
    const known = DB.all('pasti').map(p => normPasti(p.nama)), allowed = S.pastiNames ? S.pastiNames.map(normPasti) : null;
    const U = s => String(s || '').toUpperCase().trim();
    const badged = new Set();
    document.querySelectorAll('select').forEach(sel=>{
      const m = /^Semua (Negeri|Kawasan|DUN|PASTI)$/i.exec((sel.options[0]||{}).text||'');
      if(!m) return;
      const L = m[1].toUpperCase(), lvl = LOC_LEVELS.indexOf(L);
      if(lvl < locked){
        const field = sel.closest('.field');
        const box = (field && field.querySelectorAll('select,input,textarea').length===1) ? field : sel;
        box.style.display='none';
        const bar = sel.closest('.filter-bar');
        if(bar && !badged.has(bar)){
          badged.add(bar);
          bar.insertAdjacentHTML('afterbegin', `<span class="badge no-dot" style="align-self:center;background:var(--brand-l);color:var(--brand-d);padding:8px 12px">Skop: ${esc(S.label || t.label)}</span>`);
        }
        return;
      }
      if(tier === 'pusat') return;
      // below the locked levels: drop options known to lie outside the scope (unknown options stay)
      [...sel.options].slice(1).forEach(o=>{
        const tx = U(o.text);
        if(L === 'PASTI'){ const n = normPasti(o.text); if(allowed && known.includes(n) && !allowed.includes(n)) o.remove(); return; }
        const list = L === 'NEGERI' ? NEGERI.map(n => ({ n, v:n })) : L === 'KAWASAN' ? ALL_KAW().map(x => Object.assign(x, { v:x.k })) : ALL_DUN().map(x => Object.assign(x, { v:x.d }));
        const hit = list.filter(x => x.v === tx || x.v.replace(/^[PN]\d+\s+/,'') === tx);
        if(hit.length && !hit.some(x => locOk(S, L, x))) o.remove();
      });
    });
  }

  // Tier-specific blocks: <div data-tiers="cawangan dun"> shows only for those tiers.
  function tierBlocks(){
    const tier = getTier();
    document.querySelectorAll('[data-tiers]').forEach(el=>{
      if(!el.dataset.tiers.split(' ').includes(tier)) el.remove();
    });
  }

  // Data scoping — every tier except Pusat sees only rows inside its scope.
  // A row naming a PASTI (any DB PASTI) is kept only if one named PASTI is in scope; a row naming no
  // PASTI but a DUN / kawasan / negeri is decided by the most specific locality it names.
  // Tables with data-noscope are left alone.
  const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  function scopeRows(root){
    if (getTier() === 'pusat') return;
    const S = scopeInfo(); if (!S.pastiNames) return;
    const strip = s => String(s).toUpperCase().replace(/^PASTI\s+/,'').trim();
    const inS = new Set(S.pastiNames.map(strip));
    const names = [...new Set(DB.all('pasti').map(p => strip(p.nama)))];
    const wb = (txt, w) => new RegExp('(^|[^A-Z0-9])' + reEsc(w) + '($|[^A-Z0-9])').test(txt);
    const duns = ALL_DUN(), kaws = ALL_KAW();
    (root || document).querySelectorAll('table.pt tbody tr').forEach(tr=>{
      const tb = tr.closest('table'); if (tb && tb.hasAttribute('data-noscope')) return;
      const txt = tr.textContent.toUpperCase();
      let keep = true;
      const mentioned = names.filter(p => txt.includes(p));
      if (mentioned.length) keep = mentioned.some(p => inS.has(p));
      else {
        const d = duns.filter(x => txt.includes(x.d)), k = kaws.filter(x => txt.includes(x.k)), n = NEGERI.filter(x => wb(txt, x)).map(x => ({ n:x }));
        if (d.length) keep = d.some(x => locOk(S, 'DUN', x));
        else if (k.length) keep = k.some(x => locOk(S, 'KAWASAN', x));
        else if (n.length) keep = n.some(x => locOk(S, 'NEGERI', x));
      }
      if (!keep) { tr.style.display='none'; tr.dataset.scopeHidden='1'; }
    });
  }
  function applyScope(){
    tierBlocks();
    scopeFilters();
    scopeRows();
  }

  const MONTHS = ['Januari','Februari','Mac','April','Mei','Jun','Julai','Ogos','September','Oktober','November','Disember'];
  function fmtNow(){
    const d = new Date();
    let h = d.getHours(); const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12;
    const p = (n)=>String(n).padStart(2,'0');
    return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${h}:${p(d.getMinutes())}:${p(d.getSeconds())} ${ap}`;
  }

  // Notifications & reminders (per portal) — shown in the topbar bell.
  function notifsFor(portal){
    if(portal==='parent') return [
      { c:'#d93025', t:'Peringatan Yuran', s:'Yuran Ogos 2026 (Ahmad Umair) belum dijelaskan — RM 60.', time:'2 jam lalu', pay:true },
      { c:'#f9ab00', t:'Peringatan Yuran', s:'Yuran September akan tamat tempoh 30 Sep 2026.', time:'Semalam', pay:true },
      { c:'#1a73e8', t:'Makluman Sekolah', s:"Mesyuarat Agung PASTI Ar-Raihan — 5 Okt 2026.", time:'2 hari lalu' },
      { c:'#2fa308', t:'Prestasi Anak (SPPM)', s:'Guru telah menghantar penilaian Penggal 1 Ahmad Umair.', time:'3 hari lalu', go:'prestasi.html' },
    ];
    if(portal==='guru') return [
      { c:'#f9ab00', t:'Peringatan Tugasan', s:'Serahan markah penggal sebelum 30 Sep 2026.', time:'1 jam lalu' },
      { c:'#8430ce', t:'Mesyuarat Guru', s:'Mesyuarat guru malam ini · 8:30 malam.', time:'5 jam lalu' },
      { c:'#1a73e8', t:'Program', s:'Bengkel e-PASTI Kawasan — 24 Sep 2026.', time:'Semalam' },
    ];
    return adminNotifs().concat([
      { c:'#f9ab00', t:'Yuran Tertunggak', s:'27 bil yuran tertunggak — RM 6,300.', time:'1 jam lalu', go: canPage('yuran') ? 'yuran.html' : null },
      { c:'#d93025', t:'Kehadiran Guru', s:'3 guru belum clock-in hari ini.', time:'Hari ini', go: canPage('kehadiran') ? 'kehadiran.html' : null },
    ]);
  }
  // Live admin items from the DB: new student applications & pending teacher leave for Cawangan.
  function adminNotifs(){
    const u = DB.user(); if (!u) return [];
    const tier = u.peranan, S = scopeInfo(), mine = DB.all('pasti').filter(scopePred(u)), out = [];
        if (tier === 'cawangan') {
      const l = DB.all('murid').filter(m => m.status === 'Baharu' && normPasti(m.pasti) === normPasti(S.pasti));
      if (l.length) out.push({ c:'#1a73e8', t:'Permohonan Murid Baharu', s:l.length + ' permohonan murid baharu menunggu keputusan.', time:'Terkini', go:'murid-permohonan.html?t=baharu' });
      let cuti = []; try { cuti = JSON.parse(localStorage.getItem('pt-cuti') || '[]'); } catch(e){}
      const c = (Array.isArray(cuti) ? cuti : []).filter(x => x && x.status === 'Menunggu' && normPasti(x.pasti) === normPasti(S.pasti));
      if (c.length) out.push({ c:'#8430ce', t:'Permohonan Cuti Guru', s:c.length + ' permohonan cuti menunggu kelulusan' + (c.length <= 2 ? ' — ' + c.map(x => x.nama).join(', ') : '') + '.', time:'Terkini', go:'cuti-guru.html' });
    }
    return out.filter(n => !n.go || canPage(n.go.split(/[.?]/)[0]));
  }
  const canPage = k => { const t = TIERS[getTier()]; return !t || !t.allow || t.allow.includes(k); };

  // Read state for the bell — persisted per portal/tier so a notification opened once stays read across pages & visits.
  const notifKey = (portal) => 'pt-notif-read-' + portal + (portal === 'admin' ? '-' + getTier() : '');
  const notifId = n => (n.t + '|' + n.s).replace(/\s+/g, ' ');
  function notifRead(portal){ try { return JSON.parse(localStorage.getItem(notifKey(portal)) || '[]'); } catch(e){ return []; } }
  function markNotifsRead(portal){
    const ids = notifsFor(portal).map(notifId);
    try { localStorage.setItem(notifKey(portal), JSON.stringify(ids)); } catch(e){}
    const dot = document.querySelector('.notif-dot'); if (dot) dot.style.display = 'none';
    const hd = document.querySelector('.np-head span'); if (hd) hd.textContent = 'Semua telah dibaca';
    document.querySelectorAll('.notif-item.unread').forEach(x => x.classList.remove('unread'));
  }

  // activate a tab/segment by key (used when a sub-nav link carries ?t=)
  function activateTab(key){
    const tab = document.querySelector(`.tabs [data-tab="${key}"], .seg [data-tab="${key}"]`);
    if(!tab) return;
    const bar = tab.closest('.tabs, .seg');
    bar && bar.querySelectorAll('[data-tab]').forEach(a=>a.classList.remove('active'));
    tab.classList.add('active');
    const scope = tab.closest('.card, .pt-wrap') || document;
    scope.querySelectorAll('[data-panel]').forEach(p=>p.style.display=(p.dataset.panel===key?'':'none'));
  }

  // ---- session guard: every portal page needs an active account whose role belongs to that portal.
  // No user / inactive → login. Wrong portal → the user's own dashboard. Admin: pt-tier = role.
  const HOME = { admin:'../app/dashboard.html', guru:'../guru/dashboard.html', parent:'../parent/dashboard.html' };
  const portalOf = r => ADMIN_ROLES.includes(r) ? 'admin' : (r === 'guru' || r === 'pembantu') ? 'guru' : r === 'ibubapa' ? 'parent' : null;
  function guard(app){
    const portal = app.dataset.portal || 'admin', u = DB.user();
    const go = url => { try { document.documentElement.style.visibility = 'hidden'; location.replace(url); } catch(e){} return false; };
    const want = u && portalOf(u.peranan);
    if (!u || u.status !== 'Aktif' || !want) {
      try { localStorage.removeItem('pt-user'); localStorage.removeItem('pt-tier');
        sessionStorage.setItem('pt-login-msg', u && u.status !== 'Aktif' ? 'Akaun ini telah dinyahaktifkan. Hubungi pentadbir anda.' : 'Sila log masuk untuk meneruskan.'); } catch(e){}
      return go('../index.html');
    }
    if (want !== portal) return go(HOME[want]);
    if (want === 'admin') try { localStorage.setItem('pt-tier', u.peranan); } catch(e){}
    return true;
  }
  const APP0 = document.querySelector('.pt-app');
  const BLOCKED = APP0 ? !guard(APP0) : false;

  // MODULES children may carry tiers:'negeri kawasan' → that tab link exists only for those tiers
  const tabOk = c => !c || !c.tiers || c.tiers.split(' ').includes(getTier());
  const childOf = (file, tab) => { for (const m of MODULES) if (m.children) { const c = m.children.find(x => x.file === file && x.tab === tab); if (c) return c; } return null; };
  const firstTab = file => { for (const m of MODULES) if (m.children) { const c = m.children.find(x => x.file === file && x.tab && tabOk(x)); if (c) return c.tab; } return null; };
  const KNOWN_PAGES = MODULES.flatMap(m => m.children ? m.children.filter(c => c.file).map(c => c.file) : [m.key]);
  // hide the tabs of this page that the tier may not open; returns the tab to show (or null)
  function tierTabs(page, want){
    MODULES.forEach(m => (m.children || []).forEach(c => {
      if (c.file !== page || !c.tab || tabOk(c)) return;
      document.querySelectorAll(`.tabs [data-tab="${c.tab}"], .seg [data-tab="${c.tab}"]`).forEach(x => x.style.display = 'none');
      document.querySelectorAll(`[data-panel="${c.tab}"]`).forEach(x => x.style.display = 'none');
    }));
    const c = want ? childOf(page, want) : null;
    if (want && tabOk(c)) return want;
    // no/blocked ?t= and the page's default tab is blocked → first allowed tab
    const first = MODULES.flatMap(m => m.children || []).find(x => x.file === page && x.tab);
    if (want || (first && !tabOk(first))) return firstTab(page);
    return null;
  }
  // links / hub tiles inside .pt-main pointing at pages this tier can't open are hidden;
  // a link to a blocked tab of an allowed page is pointed at the first allowed tab instead
  function hideForbidden(){
    document.querySelectorAll('.pt-main a[href]').forEach(a => {
      const m = /^(?:\.\/)?([\w-]+)\.html(?:\?([^#]*))?/.exec(a.getAttribute('href') || ''); if (!m) return;
      const key = m[1];
      if (KNOWN_PAGES.includes(key) && !canPage(key)) { a.style.display = 'none'; a.dataset.tierHidden = '1'; return; }
      const t = m[2] && new URLSearchParams(m[2]).get('t'), c = t && childOf(key, t);
      if (c && !tabOk(c)) { const f = firstTab(key); a.setAttribute('href', key + '.html' + (f ? '?t=' + f : '')); }
    });
    const secs = [...document.querySelectorAll('.pt-main .hub-sec')];
    secs.forEach(sec => { if (sec.querySelector('.hub') && ![...sec.querySelectorAll('.hub')].some(h => h.style.display !== 'none')) sec.style.display = 'none'; });
    if (secs.length && secs.every(sec => sec.style.display === 'none')) secs[secs.length - 1].insertAdjacentHTML('afterend', '<div class="card" style="padding:18px"><span class="muted">Tiada modul dalam bahagian ini untuk peranan anda.</span></div>');
  }

  document.addEventListener('DOMContentLoaded', () => {
    const app = document.querySelector('.pt-app');
    if (app && (BLOCKED || !guard(app))) return;
    restoreTables();
    if (app) renderShell(app);
    initInteractions();
    const admin = app && (!app.dataset.portal || app.dataset.portal === 'admin');
    let t = new URLSearchParams(location.search).get('t');
    if (admin) t = tierTabs(app.dataset.page || 'dashboard', t);
    if (t) activateTab(t);
    if (admin) { applyScope(); trimLevels(); hideForbidden(); scopeLabels(); }
  });
  // <span data-scope-label></span> → the signed-in account's scope (e.g. "P021 KOTA BHARU")
  function scopeLabels(){ const S = scopeInfo(); document.querySelectorAll('[data-scope-label]').forEach(el => { if (S.label) el.textContent = S.label; }); }

  function renderShell(app){
    const portal = app.dataset.portal || 'admin';
    const P = PORTALS[portal];        // set for parent/guru; undefined for admin
    const isSub = !!P;                 // any non-admin portal
    const mod  = app.dataset.module || 'dashboard';
    const title = app.dataset.title || 'ePASTI';
    const subtitle = app.dataset.subtitle || 'Sistem Pengurusan PASTI';
    const tier = getTier(), TI = TIERS[tier] || TIERS.kawasan;
    const modules = P ? P.modules : MODULES;
    const sysLabel = P ? P.sys : 'Sistem Pengurusan PASTI (ePASTI)';
    const DU = DB.user(), mine = DU && (P ? (portal === 'guru' ? /guru|pembantu/.test(DU.peranan) : DU.peranan === 'ibubapa') : DU.peranan === tier);
    const uName = mine ? DU.nama.toUpperCase() : (P ? P.user.name : USER.name);
    const uRole = mine ? (P ? (portal === 'guru' ? DB.ROLE_LABEL[DU.peranan] + ' · ' + DU.skop.replace('PASTI ','') : P.user.role) : TI.label + ' · ' + DU.skop) : (P ? P.user.role : TI.label);
    const logo = `<img src="../assets/img/pasti-logo.png" alt="PASTI" onerror="this.onerror=null;this.src='../assets/img/pasti-logo.svg'">`;

    // sub-navigation tree (expandable groups)
    const page = app.dataset.page || 'dashboard';
    const param = new URLSearchParams(location.search).get('t');
    let activeTab = param;
    if (!activeTab || (!isSub && !tabOk(childOf(page, activeTab)))) activeTab = null;
    if (!activeTab) for (const m of modules) if (m.children) { const c = m.children.find(x => x.file === page && x.tab && (isSub || tabOk(x))); if (c) { activeTab = c.tab; break; } }
    const chev = `<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>`;
    // per-tier permissions — each tier sees only what its role can do
    const allow = (!isSub && TI && TI.allow) ? TI.allow : null;
    const ok = (k) => !allow || allow.includes(k);
    const KNOWN = MODULES.flatMap(m => m.children ? m.children.filter(c => c.file).map(c => c.file) : [m.key]);
    if (!isSub && allow && page !== 'dashboard' && KNOWN.includes(page) && !ok(page)) {
      try { sessionStorage.setItem('pt-denied', title); } catch(e){}
      location.replace('dashboard.html'); return;
    }
    const dropCaps = (list) => list.filter((c,i) => {
      if (!c.cap) return true;
      for (let j=i+1; j<list.length; j++){ if (list[j].cap) return false; return true; }
      return false;
    });
    const navModules = modules.map(m => {
      if (!m.children) return ok(m.key) ? m : null;
      const kids = m.children.filter(c => c.cap || (ok(c.file) && (isSub || tabOk(c))));
      if (!kids.some(c => !c.cap)) return null;
      return Object.assign({}, m, { children: dropCaps(kids) });
    }).filter(Boolean);
    const navHtml = navModules.map(m => {
      if (!m.children) return `<a href="${m.href}" class="nav-link ${m.key===mod?'active':''}">${svg(I[m.icon])}<span>${m.label}</span></a>`;
      const kids = m.children.map(c => {
        if (c.cap) return `<div class="nav-cap">${c.cap}</div>`;
        const href = c.file + '.html' + (c.tab ? `?t=${c.tab}` : '');
        const active = c.file === page && (!c.tab || c.tab === activeTab);
        return `<a href="${href}" class="nav-child ${active?'active':''}">${c.label}</a>`;
      }).join('');
      return `<div class="nav-group ${m.key===mod?'open':''}">
          <button class="nav-parent">${svg(I[m.icon])}<span>${m.label}</span>${chev}</button>
          <div class="nav-children">${kids}</div>
        </div>`;
    }).join('');

    // sidebar
    const rail = document.createElement('aside');
    rail.className = 'pt-side';
    rail.innerHTML = `
      <div class="side-brand">
        <div class="mark">${logo}</div>
        <div class="bt"><b>ePASTI</b><span>${P ? P.sub : 'Konsol Pentadbir'}</span></div>
      </div>
      <nav class="side-nav">${navHtml}</nav>
      <div class="side-foot">Jabatan PASTI Malaysia<br><span>Sistem Pengurusan PASTI</span></div>`;

    // topbar (with notification bell)
    const notifs = notifsFor(portal);
    const notifHref = portal==='parent' ? 'pemakluman.html' : (portal==='guru' ? '#' : 'notifikasi.html');
    const readIds = notifRead(portal), unread = notifs.filter(n => !readIds.includes(notifId(n))).length;
    const notifItems = notifs.map(n => `
      <div class="notif-item${readIds.includes(notifId(n)) ? '' : ' unread'}"><span class="ni-bar" style="background:${n.c}"></span>
        <div class="ni-tx"><b>${n.t}</b><span>${n.s}</span><i>${n.time}</i></div>
        ${n.pay ? `<a class="g-add ni-pay" href="yuran.html">Bayar</a>` : n.go ? `<a class="g-add ni-pay" href="${n.go}">Lihat</a>` : ''}
      </div>`).join('');
    const header = document.createElement('header');
    header.className = 'pt-top';
    header.innerHTML = `
      <div class="tt"><b>${title}</b><span>${subtitle}</span></div>
      <div class="tr">
        <span class="dt" id="ptClock">${fmtNow()}</span>
        <div class="notif-wrap">
          <button class="notif-btn" id="notifBtn" title="Notifikasi & Peringatan">${svg(I.nBell)}<span class="notif-dot"${unread ? '' : ' style="display:none"'}>${unread}</span></button>
          <div class="notif-panel" id="notifPanel">
            <div class="np-head">Notifikasi <span>${unread ? unread + ' baharu' : 'Semua telah dibaca'}</span></div>
            <div class="np-body">${notifItems}</div>
            <div class="np-foot"><a href="${notifHref}">Lihat semua notifikasi</a></div>
          </div>
        </div>
        <div class="uchip">${svg(I.nUserCircle)}<div class="ut"><b>${uName}</b><span>${uRole}</span></div></div>
        <a class="logout" href="../index.html?logout=1" title="Log Keluar">${svg(I.nLogout)}</a>
      </div>`;

    const main = app.querySelector('.pt-main');
    let wrap = main ? main.querySelector(':scope > .pt-wrap') : null;
    if (main && !wrap) {
      wrap = document.createElement('div'); wrap.className = 'pt-wrap';
      while (main.firstChild) wrap.appendChild(main.firstChild);
      main.appendChild(wrap);
    }
    app.insertBefore(header, app.firstChild);
    app.insertBefore(rail, main);

    // ---- Guru & parent portals: phone layout (bottom tabs + "Lagi" sheet), install, offline
    if (isSub) mountPortalMobile(app, P, mod, uName, uRole);

    try { const fl = sessionStorage.getItem('pt-flash'); if (fl) { sessionStorage.removeItem('pt-flash'); setTimeout(() => toast(fl), 400); } } catch(e){}
    // came here from a page this role may not open
    try { const dn = sessionStorage.getItem('pt-denied'); if (dn) { sessionStorage.removeItem('pt-denied'); setTimeout(() => toast('"' + dn + '" bukan untuk peranan ' + (TI ? TI.label : 'anda'), 'red'), 400); } } catch(e){}

    // live clock
    setInterval(() => { const c = document.getElementById('ptClock'); if (c) c.textContent = fmtNow(); }, 1000);
    document.title = title + ' · ePASTI';

    // sidebar: fade hints at the scroll edges + keep the active item in view
    const sn = document.querySelector('.side-nav');
    if (sn) {
      const edge = () => { sn.classList.toggle('fade-t', sn.scrollTop > 4); sn.classList.toggle('fade-b', sn.scrollTop + sn.clientHeight < sn.scrollHeight - 4); };
      sn.addEventListener('scroll', edge, { passive:true }); window.addEventListener('resize', edge);
      sn.addEventListener('click', () => setTimeout(edge, 30));
      const act = sn.querySelector('.nav-children a.active, a.nav-link.active');
      requestAnimationFrame(() => {
        if (act) { const r = act.getBoundingClientRect(), b = sn.getBoundingClientRect();
          if (r.bottom > b.bottom - 24) { sn.style.scrollBehavior = 'auto'; sn.scrollTop += r.top - b.top - sn.clientHeight / 2 + r.height / 2; sn.style.scrollBehavior = ''; } }
        edge();
      });
    }

    // Nudge the payment reminder on the parent's first dashboard view this session.
    // Only while something is still unread — once opened it counts as read and never pops up again.
    if (portal === 'parent' && mod === 'dashboard' && unread) {
      setTimeout(() => { document.getElementById('notifPanel')?.classList.add('open'); markNotifsRead(portal); }, 700);
    }
  }

  // ===========================================================================
  //  Guru & parent portals on a phone — bottom tab bar, "Lagi" sheet,
  //  tables → cards, home-screen install (PWA) and an offline send queue.
  // ===========================================================================
  const TAB_SHORT = { dashboard:'Utama', clock:'Clock In', murid:'Kehadiran', markah:'Markah', anak:'Anak', yuran:'Yuran', resit:'Resit', prestasi:'Prestasi' };
  let installEvt = null;
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; document.body.classList.add('pt-can-install'); });

  function mountPortalMobile(app, P, mod, uName, uRole){
    document.body.classList.add('pt-portal');
    const tabs = P.tabs.map(k => P.modules.find(m => m.key === k)).filter(Boolean);
    const rest = P.modules.filter(m => !P.tabs.includes(m.key));
    const moreActive = rest.some(m => m.key === mod);

    const bar = document.createElement('nav');
    bar.className = 'pt-tabbar';
    bar.innerHTML = tabs.map(m => `<a href="${m.href}" class="${m.key===mod?'active':''}">${svg(I[m.icon])}<span>${TAB_SHORT[m.key]||m.label}</span></a>`).join('')
      + `<button type="button" id="ptMoreBtn" class="${moreActive?'active':''}" data-own>${svg(I.nGrid)}<span>Lagi</span></button>`;
    document.body.appendChild(bar);

    const sheet = document.createElement('div');
    sheet.className = 'pt-sheet'; sheet.id = 'ptSheet';
    sheet.innerHTML = `
      <div class="ps-card" role="dialog" aria-label="Menu">
        <div class="ps-grip"></div>
        <div class="ps-user">${svg(I.nUserCircle)}<div><b>${uName}</b><span>${uRole}</span></div></div>
        <div class="ps-links">
          ${rest.map(m => `<a href="${m.href}" class="${m.key===mod?'active':''}">${svg(I[m.icon])}<span>${m.label}</span></a>`).join('')}
          <button type="button" class="ps-install" id="ptInstall">${svg(I.download)}<span>Pasang ePASTI di skrin utama</span></button>
          <a href="../index.html?logout=1" class="ps-out">${svg(I.nLogout)}<span>Log Keluar</span></a>
        </div>
      </div>`;
    document.body.appendChild(sheet);

    const open = v => sheet.classList.toggle('open', v);
    bar.querySelector('#ptMoreBtn').addEventListener('click', () => open(true));
    sheet.addEventListener('click', e => { if (e.target === sheet) open(false); });
    sheet.querySelector('#ptInstall').addEventListener('click', async () => {
      open(false);
      if (installEvt) { installEvt.prompt(); const r = await installEvt.userChoice; if (r.outcome === 'accepted') toast('ePASTI dipasang di skrin utama'); installEvt = null; return; }
      const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
      toast(ios ? 'iPhone: tekan butang Kongsi ⎋ → "Add to Home Screen"' : 'Buka menu pelayar ⋮ → "Tambah ke skrin utama"', 'green');
    });

    // offline pill + pending count in the topbar
    const pill = document.createElement('span');
    pill.className = 'pt-sync'; pill.id = 'ptSync';
    document.querySelector('.pt-top .tr')?.prepend(pill);
    window.addEventListener('online',  () => { renderSync(); flushQueue(); });
    window.addEventListener('offline', renderSync);
    renderSync();

    // tables → labelled cards (CSS does the layout below 760px)
    labelTables(document);
    new MutationObserver(() => labelTables(document)).observe(app, { childList:true, subtree:true });

    // service worker (home-screen app + offline pages)
    if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('../sw.js').catch(()=>{});
  }

  function labelTables(root){
    root.querySelectorAll('table.pt').forEach(tb => {
      const heads = [...tb.querySelectorAll('thead th')].map(th => th.textContent.trim());
      tb.querySelectorAll('tbody tr').forEach(tr => {
        if (tr.dataset.lbl) return; tr.dataset.lbl = '1';
        [...tr.children].forEach((td, i) => {
          const h = heads[i] || '';
          td.setAttribute('data-label', h);
          if (/^(bil|no\.?|#)$/i.test(h)) td.classList.add('m-hide');
        });
      });
    });
  }

  // Offline queue — records saved while offline are sent when the signal returns.
  const QKEY = 'pt-queue';
  const readQ = () => { try { return JSON.parse(localStorage.getItem(QKEY) || '[]'); } catch(e){ return []; } };
  const writeQ = q => { try { localStorage.setItem(QKEY, JSON.stringify(q)); } catch(e){} renderSync(); };
  function renderSync(){
    const el = document.getElementById('ptSync'); if (!el) return;
    const n = readQ().length, off = !navigator.onLine;
    el.className = 'pt-sync' + (off ? ' off' : n ? ' wait' : '');
    el.innerHTML = off ? `${svg(I.wifi)}<span>Luar talian${n ? ' · '+n+' belum dihantar' : ''}</span>`
                 : n   ? `${svg(I.clock)}<span>${n} menghantar…</span>` : '';
  }
  function queueSave(kind, label){
    if (navigator.onLine) { toast(label + ' — dihantar'); return true; }
    const q = readQ(); q.push({ kind, label, at: Date.now() }); writeQ(q);
    toast(label + ' — disimpan dalam telefon, akan dihantar bila ada talian', 'green');
    return false;
  }
  function flushQueue(){
    const q = readQ(); if (!q.length) return;
    renderSync();
    setTimeout(() => { writeQ([]); toast(q.length + ' rekod luar talian berjaya dihantar'); }, 1200);
  }

  // ===========================================================================
  //  Interaction engine — delegated, generic. Pages opt in via data-attributes.
  // ===========================================================================
  function labelOf(el){ return (el.getAttribute && el.getAttribute('title')) || (el.textContent||'').trim().replace(/\s+/g,' ').slice(0,40) || 'Tindakan'; }
  function smartMsg(l){
    l = l.toLowerCase();
    if(/export|excel|muat turun|csv|pdf/.test(l)) return 'Menyediakan ' + l + '…';
    if(/cetak|print|slip|sijil|resit/.test(l)) return 'Menyediakan cetakan…';
    if(/simpan|save|kemas kini|update/.test(l)) return 'Maklumat berjaya disimpan';
    if(/bayar|pay/.test(l)) return 'Membuka pintu bayaran…';
    if(/tambah|baharu|daftar|add|new|lantik/.test(l)) return labelOf({textContent:l}) ? 'Membuka borang…' : 'Membuka borang…';
    if(/lulus|approve|terima/.test(l)) return 'Permohonan diluluskan';
    if(/tolak|reject/.test(l)) return 'Permohonan ditolak';
    if(/jana|generate/.test(l)) return 'Menjana laporan…';
    return 'Tindakan direkod';
  }
  function toast(msg,type){
    let host = document.querySelector('.pt-toasts');
    if(!host){ host=document.createElement('div'); host.className='pt-toasts'; document.body.appendChild(host); }
    const el=document.createElement('div'); el.className='pt-toast '+(type||'green');
    el.innerHTML=`<span class="i"></span><span>${msg}</span>`; host.appendChild(el);
    requestAnimationFrame(()=>el.classList.add('show'));
    setTimeout(()=>{ el.classList.remove('show'); setTimeout(()=>el.remove(),260); }, 2600);
  }
  function setRowStatus(row,text,cls){ if(!row) return; const b=row.querySelector('.badge'); if(b){ b.className='badge '+cls; b.textContent=text; } }
  function moveStep(scope,dir){
    if(!scope) return;
    const steps=[...scope.querySelectorAll('.steps .step')];
    const panels=[...scope.querySelectorAll('[data-step-panel]')];
    if(!steps.length) return;
    let cur=steps.findIndex(s=>s.classList.contains('active')); if(cur<0) cur=0;
    const next=Math.min(Math.max(cur+dir,0),steps.length-1);
    steps.forEach((s,i)=>{ s.classList.toggle('active',i===next); s.classList.toggle('done',i<next); });
    if(panels.length){ const key=steps[next].dataset.step||String(next+1); panels.forEach(p=>p.style.display=(p.dataset.stepPanel===key?'':'none')); }
    try{ window.scrollTo({top:0,behavior:'smooth'}); }catch(e){}
  }
  function applyFilter(control){
    // which table: the toolbar's own panel → a table in the toolbar's card (outside any panel)
    // → the table in the currently visible [data-panel] → the nearest table (old behaviour)
    let table = null;
    const panel = control.closest('[data-panel]');
    if (panel) table = panel.querySelector('table.pt');
    const card = control.closest('.card');
    if (!table && card) table = [...card.querySelectorAll('table.pt')].find(t => !t.closest('[data-panel]')) || null;
    if (!table) {
      const box = card || control.closest('.pt-wrap') || document;
      const vis = p => p.style.display !== 'none' && p.offsetParent !== null;
      let panels = [...box.querySelectorAll('[data-panel]')].filter(p => vis(p) && p.querySelector('table.pt'));
      if (!panels.length) panels = [...document.querySelectorAll('[data-panel]')].filter(p => vis(p) && p.querySelector('table.pt'));
      if (panels.length) table = panels[0].querySelector('table.pt');
    }
    if (!table) { const scope = control.closest('.card') || control.closest('.pt-wrap') || document; table = scope.querySelector('table.pt'); }
    if (!table) { const tb = control.closest('.toolbar'); if (tb && tb.parentElement) table = tb.parentElement.querySelector('table.pt'); }
    if (!table) return;
    const cont = control.closest('.toolbar, .filter-bar') || panel || card || document;
    const rows = [...table.querySelectorAll('tbody tr')];
    const lc = s => String(s || '').replace(/\s+/g, ' ').trim().toLowerCase();
    const badgeTexts = new Set(rows.flatMap(tr => [...tr.querySelectorAll('.badge')].map(b => lc(b.textContent))));
    const tests = [];
    cont.querySelectorAll('input').forEach(i => {
      if (i.hasAttribute('data-nofilter') || i.readOnly || /^(date|datetime-local|month|time|week|checkbox|radio|hidden|file|button|submit)$/i.test(i.type)) return;
      const v = lc(i.value); if (v) tests.push(tr => lc(tr.textContent).includes(v));
    });
    cont.querySelectorAll('select').forEach(s => {
      if (s.hasAttribute('data-nofilter')) return;
      const v = lc(s.value);
      if (!v || /^(semua|all|status|--|- |pilih|negeri|kawasan|dun|jantina|bidang|method|role|penggal)/i.test(v)) return;
      // badge column: exact badge text ("Aktif" must not match "Tidak Aktif")
      if (badgeTexts.has(v)) { tests.push(tr => [...tr.querySelectorAll('.badge')].some(b => lc(b.textContent) === v)); return; }
      // locality select whose value appears in no row → ignore (data carries no such column)
      const loc = /^semua (negeri|kawasan|dun|pasti|cawangan)/i.test(((s.options[0] || {}).text || '').trim());
      if (loc && !rows.some(tr => lc(tr.textContent).includes(v))) return;
      tests.push(tr => lc(tr.textContent).includes(v));
    });
    rows.forEach(tr => { const vis = tr.dataset.scopeHidden !== '1' && tests.every(f => f(tr)); tr.style.display = vis ? '' : 'none'; });
  }

  // ===========================================================================
  //  Action kit — makes every standard button do its real job in the mockup:
  //  view / edit / add rows, CSV export, printable documents, BayarCash
  //  checkout, decisions, reminders. Table changes persist per browser.
  // ===========================================================================
  const norm = s => (s||'').toLowerCase().replace(/[*:]/g,'').replace(/\s+/g,' ').trim();
  const esc = s => String(s==null?'':s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const nowTime = () => { const d=new Date(); return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'); };
  const today = () => { const d=new Date(); return String(d.getDate()).padStart(2,'0')+'/'+String(d.getMonth()+1).padStart(2,'0')+'/'+d.getFullYear(); };
  const ref = (p) => p + '-2026-' + String(Math.floor(100000 + (Date.now() % 900000))).slice(0,6);
  const SKIP_H = /^(tindakan|action|)$/i;

  function tableNear(el){
    const dt = el && el.closest && el.closest('[data-table]');
    if (dt) { const t = document.querySelector(dt.dataset.table); if (t) return t; }
    const scope = el.closest('[data-panel]') || el.closest('.card') || null;
    let tb = scope && scope.querySelector('table.pt');
    if (!tb && el.closest('.page-head, .toolbar')) {
      const panels = [...document.querySelectorAll('[data-panel]')].filter(p => p.style.display !== 'none');
      tb = (panels[0] || document).querySelector('table.pt');
    }
    return tb || [...document.querySelectorAll('table.pt')].find(t => t.offsetParent !== null) || document.querySelector('table.pt');
  }
  const headsOf = tb => [...tb.querySelectorAll('thead th')].map(th => th.textContent.trim());
  function cellsOf(tr){
    const H = headsOf(tr.closest('table'));
    return [...tr.children].map((td,i) => ({ h: H[i]||'', td, i })).filter(c => !SKIP_H.test(c.h) && !c.td.querySelector('input[type=checkbox]'));
  }
  const cellText = td => { const nm = td.querySelector('.nm'); return (nm ? nm.textContent : td.textContent).replace(/\s+/g,' ').trim(); };
  const rowTitle = tr => { const nm = tr.querySelector('.nm'); if (nm) return nm.textContent.trim();
    const byName = cellsOf(tr).find(c => /nama|pengguna|penderma|pembayar/i.test(c.h)); if (byName) return cellText(byName.td);
    const c = cellsOf(tr).find(c => !/^(bil|no\.?|#)$/i.test(c.h)); return c ? cellText(c.td) : 'Butiran'; };

  // negative / pending patterns first, so "Tidak Aktif" / "Tidak Hadir" are red and "Menunggu Kelulusan" amber
  const BADGE = [[/tolak|gagal|tidak|tutup|batal/i,'b-red'],[/menunggu|belum|lewat|tertunggak|draf|semakan|dijadual|penilaian/i,'b-amber'],
                 [/aktif|lulus|berjaya|sudah|hadir|diterima|dijelaskan|siap|buka|disokong|connected|dibayar/i,'b-green'],[/baharu|baru|new/i,'b-blue']];
  const badgeCls = txt => { for (const [re,c] of BADGE) if (re.test(txt)) return c; return 'b-slate'; };
  function setBadge(b, txt){ const nodot = b.classList.contains('no-dot'); b.className = 'badge ' + badgeCls(txt) + (nodot?' no-dot':''); b.textContent = txt; }

  // ---- persistence of table rows (per page, per browser)
  const TKEY = (i) => 'pt-tbl:' + location.pathname.split('/').slice(-2).join('/') + ':' + i;
  const saveable = () => [...document.querySelectorAll('table.pt')].filter(t => !t.closest('[data-own]') && !t.hasAttribute('data-nosave'));
  function persistTables(){
    saveable().forEach((t,i) => { const tb = t.tBodies[0]; if (!tb) return;
      const c = tb.cloneNode(true); c.querySelectorAll('tr').forEach(r => { r.style.display=''; r.removeAttribute('data-scope-hidden'); r.style.opacity=''; });
      try { localStorage.setItem(TKEY(i), c.innerHTML); } catch(e){} });
  }
  function restoreTables(){
    if (RESET) setTimeout(() => toast('Data demo diset semula kepada asal'), 300);
    saveable().forEach((t,i) => { try { const s = localStorage.getItem(TKEY(i)); if (s != null && t.tBodies[0]) t.tBodies[0].innerHTML = s; } catch(e){} });
  }

  // ---- one reusable dynamic modal
  function dyn(title, body, foot, cls){
    let ov = document.getElementById('ptDyn');
    if (!ov) { ov = document.createElement('div'); ov.className = 'modal-overlay'; ov.id = 'ptDyn'; document.body.appendChild(ov); }
    ov.innerHTML = `<div class="modal ${cls||''}"><div class="m-head"><h3>${title}</h3><button class="btn btn-ghost btn-sm" data-close>✕</button></div>
      <div class="m-body">${body}</div><div class="m-foot">${foot||'<button class="btn btn-ghost" data-close>Tutup</button>'}</div></div>`;
    ov.classList.add('open'); return ov;
  }
  const kv = pairs => `<div class="kv">${pairs.map(([k,v]) => `<div class="k">${esc(k)}</div><div class="v">${v}</div>`).join('')}</div>`;

  function viewRow(tr){
    const pairs = cellsOf(tr).filter(c => !/^(bil|no\.?|#)$/i.test(c.h)).map(c => [c.h, c.td.querySelector('.badge') ? c.td.querySelector('.badge').outerHTML : esc(cellText(c.td))]);
    dyn(esc(rowTitle(tr)), kv(pairs), '<button class="btn btn-ghost" data-close>Tutup</button>');
  }

  let EDIT_ROW = null;
  function editRow(tr){
    EDIT_ROW = tr; const tb = tr.closest('table');
    const f = cellsOf(tr).filter(c => !/^(bil|no\.?|#)$/i.test(c.h)).map(c => {
      const b = c.td.querySelector('.badge');
      if (b) { const opts = [...new Set([...tb.querySelectorAll(`tbody tr td:nth-child(${c.i+1}) .badge`)].map(x => x.textContent.trim()))];
        return `<div class="field"><span class="label">${esc(c.h)}</span><select class="select" data-col="${c.i}">${opts.map(o => `<option ${o===b.textContent.trim()?'selected':''}>${esc(o)}</option>`).join('')}</select></div>`; }
      return `<div class="field"><span class="label">${esc(c.h)}</span><input class="input" data-col="${c.i}" value="${esc(cellText(c.td))}"></div>`;
    }).join('');
    dyn('Kemas Kini — ' + esc(rowTitle(tr)), `<div class="form-grid">${f}</div>`, '<button class="btn btn-ghost" data-close>Batal</button><button class="btn btn-primary" data-kit="save-edit">Simpan</button>');
  }
  function saveEdit(ov){
    const tr = EDIT_ROW; if (!tr) return;
    ov.querySelectorAll('[data-col]').forEach(inp => { const td = tr.children[+inp.dataset.col]; if (!td) return;
      const b = td.querySelector('.badge'), nm = td.querySelector('.nm');
      if (b) setBadge(b, inp.value); else if (nm) nm.textContent = inp.value; else td.textContent = inp.value; });
    ov.classList.remove('open'); flash(tr); persistTables(); toast('Maklumat dikemas kini');
  }
  const flash = tr => { tr.style.transition = 'background .6s'; tr.style.background = 'var(--brand-l)'; setTimeout(() => tr.style.background = '', 900); };

  // modal fields ↔ table headers
  const fieldsOf = m => [...m.querySelectorAll('.field')].map(f => {
    const lab = f.querySelector('.label'), inp = f.querySelector('input:not([type=checkbox]):not([type=file]), select, textarea');
    return lab && inp ? { f, label: norm(lab.textContent), req: !!lab.querySelector('.req'), inp } : null; }).filter(Boolean);
  const match = (h, fields) => { const H = norm(h); if (!H) return null;
    return fields.find(x => x.label === H) || fields.find(x => x.label && (H.includes(x.label) || x.label.includes(H)))
      || fields.find(x => x.label.split(' ')[0] === H.split(' ')[0]); };
  function validate(m){
    let bad = 0; fieldsOf(m).forEach(x => { const miss = x.req && !String(x.inp.value).trim(); x.inp.classList.toggle('pt-err', miss); if (miss) bad++; });
    if (bad) toast(bad + ' ruangan wajib belum diisi', 'red'); return !bad;
  }
  function prefill(m, tr){
    const fields = fieldsOf(m); if (!fields.length) return;
    cellsOf(tr).forEach(c => { const x = match(c.h, fields); if (!x) return; const v = cellText(c.td);
      if (x.inp.tagName === 'SELECT') { const o = [...x.inp.options].find(o => norm(o.text) === norm(v) || norm(v).includes(norm(o.text))); if (o) x.inp.value = o.value || o.text; }
      else x.inp.value = v.replace(/^RM\s*/,''); });
  }
  function writeRow(m, tr, isNew){
    const fields = fieldsOf(m), tb = tr.closest('table'), H = headsOf(tb);
    [...tr.children].forEach((td,i) => {
      const h = H[i]||''; if (SKIP_H.test(h) || td.querySelector('input[type=checkbox]')) return;
      if (/^(bil|no\.?|#)$/i.test(h)) { if (isNew) td.textContent = tb.tBodies[0].rows.length; return; }
      const x = match(h, fields), b = td.querySelector('.badge'), nm = td.querySelector('.nm');
      const v = x ? (x.inp.tagName === 'SELECT' ? x.inp.options[x.inp.selectedIndex].text : x.inp.value) : null;
      if (b) { if (v) setBadge(b, v); else if (isNew) setBadge(b, /status/i.test(h) ? (/bayar|bil|invois/i.test(tb.textContent) ? 'Belum' : 'Baharu') : b.textContent); return; }
      if (nm) { if (v) { nm.textContent = v; const av = td.querySelector('.avatar'); if (av) av.textContent = v.split(' ').filter(w => !/^(bin|binti|b\.|bt\.)$/i.test(w)).slice(0,2).map(w => w[0]).join('').toUpperCase(); } return; }
      if (v != null && v !== '') td.textContent = /jumlah|amaun|\(rm\)|yuran/i.test(h) && /^\d/.test(v) ? Number(v).toFixed(2) : v;
      else if (isNew) td.textContent = /tarikh/i.test(h) ? today() : /ref|no\.? ?(bil|rujukan|pendaftaran)|^id/i.test(h) ? ref(h.slice(0,3).toUpperCase()) : '—';
    });
  }
  function addRowFrom(m, opener){
    const tb = opener ? tableNear(opener) : null;
    if (!tb || !tb.tBodies[0] || !tb.tBodies[0].rows.length) return false;
    const tpl = [...tb.tBodies[0].rows].find(r => r.cells.length > 1) || tb.tBodies[0].rows[0];
    const tr = tpl.cloneNode(true); tr.style.display = ''; tr.removeAttribute('data-scope-hidden'); tr.removeAttribute('data-lbl');
    tr.querySelectorAll('[disabled]').forEach(b => b.disabled = false);
    tb.tBodies[0].prepend(tr); writeRow(m, tr, true);
    [...tb.tBodies[0].rows].forEach((r,i) => { const c = r.children[0]; if (c && /^\d+$/.test(c.textContent.trim())) c.textContent = i+1; });
    flash(tr); persistTables(); return true;
  }

  // ---- printable documents (resit, slip, sijil, surat)
  // One printable document (resit / slip / surat / sijil / borang) built from a table row.
  function docHtml(kind, tr, opt){
    opt = opt || {};
    const cells = tr ? cellsOf(tr) : [], get = re => { const c = cells.find(c => re.test(c.h)); return c ? cellText(c.td) : ''; };
    const logo = document.querySelector('.side-brand img') ? document.querySelector('.side-brand img').src : '';
    if (kind === 'sijil') {
      const nama = get(/nama murid \(rumi\)|nama murid|^nama/i) || '—', jawi = get(/jawi/i), mykid = (get(/mykid/i).match(/\d{6,}/) || [''])[0];
      const pasti = get(/^pasti/i) || '', no = ref('SJL');
      if (opt.jawi) return `<div class="pt-doc pt-cert jawi" dir="rtl">${logo?`<img class="cert-logo" src="${logo}" alt="">`:''}
        <div class="cert-org">جابتن ڤستي مليسيا</div><div class="cert-t">سيجيل تامت ڤڠاجين</div>
        <p class="cert-l">دڠن اين دصحکن بهاوا</p><div class="cert-name">${esc(jawi || nama)}</div><div class="cert-sub" dir="ltr">${esc(nama)} · MyKid ${esc(mykid)}</div>
        <p class="cert-l">تله منمتکن ڤڠاجين دڤوست اسوهن تونس اسلام (ڤستي)</p><div class="cert-p" dir="ltr">${esc(pasti)}</div><p class="cert-l">بݢي سيسي ٢٠٢٦</p>
        <div class="cert-sign"><div><i></i>ڤنتدبير چاواڠن</div><div><i></i>ڤڠروسي ڤستي کاوسن</div></div>
        <div class="cert-no" dir="ltr">No. Sijil: ${no} · Tarikh: ${today()}</div></div>`;
      return `<div class="pt-doc pt-cert">${logo?`<img class="cert-logo" src="${logo}" alt="">`:''}
        <div class="cert-org">JABATAN PASTI MALAYSIA</div><div class="cert-t">SIJIL TAMAT PENGAJIAN</div>
        <p class="cert-l">Dengan ini disahkan bahawa</p><div class="cert-name">${esc(nama)}</div><div class="cert-sub">MyKid ${esc(mykid)}</div>
        <p class="cert-l">telah menamatkan pengajian di Pusat Asuhan Tunas Islam (PASTI)</p><div class="cert-p">${esc(pasti)}</div><p class="cert-l">bagi Sesi 2026</p>
        <div class="cert-sign"><div><i></i>Pentadbir Cawangan</div><div><i></i>Pengerusi PASTI Kawasan</div></div>
        <div class="cert-no">No. Sijil: ${no} · Tarikh: ${today()}</div></div>`;
    }
    const pairs = cells.filter(c => !/^(bil|no\.?|#|tindakan|muat turun|cetak.*|)$/i.test(c.h) && !c.td.querySelector('input[type=checkbox]'))
      .map(c => [c.h, esc(c.td.querySelector('.badge') ? c.td.querySelector('.badge').textContent : cellText(c.td))]);
    const T = { borang:'SALINAN BORANG PERMOHONAN', resit:'RESIT RASMI PEMBAYARAN', slip:'SLIP KEPUTUSAN PEPERIKSAAN', surat:'SURAT PELANTIKAN' }[kind];
    const intro = { borang:'Salinan rasmi permohonan seperti yang direkodkan dalam sistem ePASTI.', resit:'Terima kasih. Pembayaran berikut telah diterima melalui BayarCash.', slip:'Keputusan penilaian murid bagi penggal semasa.',
      surat:'Dengan segala hormatnya, tuan/puan dilantik ke jawatan berikut bagi penggal semasa.' }[kind];
    return `<div class="pt-doc"><div class="pd-head">${logo?`<img src="${logo}" alt="">`:''}<div><b>JABATAN PASTI MALAYSIA</b><span>Sistem Pengurusan PASTI (ePASTI)</span></div></div>
      <h2>${T}</h2><div class="pd-meta">No. Dokumen: <b>${ref(kind.slice(0,3).toUpperCase())}</b> · Tarikh: <b>${today()}</b></div>
      <p>${intro}</p>${kv(pairs.length ? pairs : [['Rujukan', esc(document.title)]])}
      ${kind === 'surat' ? '<div class="pd-sign"><div><i></i>Pengerusi PASTI Kawasan</div><div><i></i>Setiausaha</div></div>' : ''}
      <div class="pd-foot">Dokumen ini dijana oleh komputer dan tidak memerlukan tandatangan.</div></div>`;
  }
  const DOC_TITLE = { sijil:'Sijil Tamat Pengajian', surat:'Surat Pelantikan', slip:'Slip Peperiksaan', borang:'Borang Permohonan', resit:'Resit Pembayaran' };
  function docFor(kind, tr, opt){
    dyn(DOC_TITLE[kind] + (opt && opt.jawi ? ' (Jawi)' : ''), docHtml(kind, tr, opt),
      '<button class="btn btn-ghost" data-close>Tutup</button><button class="btn btn-primary" data-kit="print-doc">Cetak / Simpan PDF</button>', 'lg');
  }
  // Bulk: one document per selected row (or every visible row), one per page.
  function bulkDocs(kind, btn, opt){
    const tb = tableNear(btn) || document.querySelector('table.pt');
    let rows = tb ? [...tb.tBodies[0].rows].filter(r => r.style.display !== 'none' && r.cells.length > 1) : [];
    const picked = rows.filter(r => r.querySelector('input[type=checkbox]:checked'));
    if (picked.length) rows = picked;
    if (!rows.length) { toast('Tiada rekod untuk dicetak', 'red'); return; }
    dyn(DOC_TITLE[kind] + (opt && opt.jawi ? ' (Jawi)' : '') + ' — ' + rows.length + ' dokumen', `<div class="pt-docs">${rows.map(r => docHtml(kind, r, opt)).join('')}</div>`,
      `<span class="muted" style="font-size:12px;margin-right:auto">${picked.length ? 'Baris yang ditanda' : 'Semua baris dipaparkan'} · satu dokumen setiap muka surat</span><button class="btn btn-ghost" data-close>Tutup</button><button class="btn btn-primary" data-kit="print-doc">Cetak / Simpan PDF (${rows.length})</button>`, 'lg');
  }
  function preparePagePrint(){
    if (document.body.classList.contains('pt-printing') || document.body.classList.contains('pm-printing')) return;
    const main = document.querySelector('.pt-main'); if (!main) return;
    document.body.classList.add('pt-has-printhead');
    let hd = document.getElementById('ptPrintHead');
    if (!hd) { hd = document.createElement('div'); hd.id = 'ptPrintHead'; hd.className = 'pt-print-head'; main.prepend(hd); }
    const logo = document.querySelector('.side-brand img'), u = DB.user(), T = TIERS[getTier()];
    const h1 = document.querySelector('.pt-main .page-head h1, .pt-main .pp-hero h1, .pt-main h1'), lead = document.querySelector('.pt-main .page-head .lead, .pt-main .pp-hero .lead');
    const tab = document.querySelector('.tabs .active, .tabs [aria-selected=true]');
    hd.innerHTML = `${logo ? `<img src="${logo.src}" alt="">` : ''}<div class="t"><b>JABATAN PASTI MALAYSIA · ePASTI</b><h1>${esc(h1 ? h1.textContent : document.title)}${tab ? ' — ' + esc(tab.textContent.trim()) : ''}</h1>
      ${lead ? `<span>${esc(lead.textContent)}</span>` : ''}</div><div class="m">Dicetak: ${today()} ${nowTime()}<br>${u ? esc(u.nama) + '<br>' : ''}${esc(u ? (ROLE_LABEL[u.peranan] || '') + ' · ' + u.skop : (T ? T.label : ''))}</div>`;
    // hide action / checkbox columns
    document.querySelectorAll('.pt-print-np').forEach(x => x.classList.remove('pt-print-np'));
    let wide = false;
    document.querySelectorAll('table.pt').forEach(tb => {
      if (!tb.offsetParent) return;
      const hr = tb.tHead && tb.tHead.rows[tb.tHead.rows.length - 1]; if (!hr) return;
      const cols = [...hr.cells].map((c,i) => /^(tindakan|muat turun|cetak sijil (jawi|rumi)|)$/i.test(c.textContent.trim()) || c.querySelector('input[type=checkbox]') ? i : -1).filter(i => i >= 0);
      if (hr.cells.length - cols.length >= 8) wide = true;
      [...tb.rows].forEach(r => { if (r.cells.length !== hr.cells.length) return; cols.forEach(i => r.cells[i] && r.cells[i].classList.add('pt-print-np')); });
      if (tb.tHead.rows.length > 1) [...tb.tHead.rows[0].cells].forEach(c => { if (/^(tindakan|)$/i.test(c.textContent.trim()) || c.querySelector('input[type=checkbox]')) c.classList.add('pt-print-np'); });
    });
    let pg = document.getElementById('ptPageSize'); if (!pg) { pg = document.createElement('style'); pg.id = 'ptPageSize'; document.head.appendChild(pg); }
    pg.textContent = '@page{size:A4 ' + (wide ? 'landscape' : 'portrait') + ';margin:12mm}';
  }
  window.addEventListener('beforeprint', preparePagePrint);
  // PDF view: the document opens in its own tab (only the document, never the page behind it) and the
  // print dialog — "Save as PDF" — opens automatically. Works the same on desktop and phones.
  function printHtml(title, html, opt){
    opt = opt || {};
    // print.html sits at the project root; find it from the stylesheet path so it works from any folder
    const css = document.querySelector('link[rel="stylesheet"][href*="assets/css/app.css"]');
    const url = css ? css.href.replace(/assets\/css\/app\.css.*$/, 'print.html') : 'print.html';
    try { localStorage.setItem('pt-print-job', JSON.stringify({ title, html, landscape: !!opt.landscape, t: Date.now() })); } catch(e){}
    let w = null; try { w = window.open(url, '_blank'); } catch(e){}
    if (w) return;
    // pop-up blocked → print in place; keep the document-only view until printing has really finished
    document.body.classList.add('pt-printing');
    const done = () => { document.body.classList.remove('pt-printing'); window.removeEventListener('afterprint', done); };
    window.addEventListener('afterprint', done);
    window.print();
  }
  function printDoc(){
    const ov = document.getElementById('ptDyn'); if (!ov) return;
    const body = ov.querySelector('.m-body'), t = ov.querySelector('.m-head h3');
    printHtml(t ? t.textContent : 'Dokumen', body ? body.innerHTML : '');
  }
  function printDocLegacy(){ document.body.classList.add('pt-printing'); const pg = document.getElementById('ptPageSize'); if (pg) pg.textContent = '@page{size:A4 portrait;margin:12mm}'; window.print(); setTimeout(() => document.body.classList.remove('pt-printing'), 500); }

  // ---- BayarCash checkout
  const money = s => { const m = String(s).replace(/,/g,'').match(/(\d+(\.\d+)?)/); return m ? +m[1] : 0; };
  function amountOf(tr){ if (!tr) return 0; const c = cellsOf(tr).find(c => /jumlah|amaun|\(rm\)|yuran|caruman/i.test(c.h) && /\d/.test(c.td.textContent)); return c ? money(c.td.textContent) : 0; }
  let PAY = null;
  function checkout(rows, amount, what){
    document.querySelectorAll('.modal-overlay.open').forEach(m => { if (m.id !== 'ptDyn') m.classList.remove('open'); });
    PAY = { rows, amount, what };
    const banks = ['Maybank2u','CIMB Clicks','Bank Islam','Bank Rakyat','RHB Now','Public Bank','BSN','Affin'];
    dyn('BayarCash — Pembayaran Selamat', `
      <div class="pay-sum"><span>${esc(what)}</span><b>RM ${amount.toFixed(2)}</b></div>
      <div class="pay-methods" data-own-pay>
        <label class="pay-m on"><input type="radio" name="pm" value="FPX" checked><b>FPX Online Banking</b><span>Semua bank utama</span></label>
        <label class="pay-m"><input type="radio" name="pm" value="Kad"><b>Kad Kredit / Debit</b><span>Visa · Mastercard</span></label>
        <label class="pay-m"><input type="radio" name="pm" value="DuitNow QR"><b>DuitNow QR</b><span>Imbas dengan aplikasi bank</span></label>
      </div>
      <div class="pay-pane" data-pm="FPX"><div class="field"><span class="label">Pilih bank</span><select class="select">${banks.map(b => `<option>${b}</option>`).join('')}</select></div></div>
      <div class="pay-pane" data-pm="Kad" hidden><div class="form-grid"><div class="field full"><span class="label">No. Kad</span><input class="input" inputmode="numeric" value="4111 1111 1111 1111"></div>
        <div class="field"><span class="label">Tamat</span><input class="input" value="12/28"></div><div class="field"><span class="label">CVV</span><input class="input" value="123"></div></div></div>
      <div class="pay-pane" data-pm="DuitNow QR" hidden><div class="pay-qr"></div><div class="muted center" style="font-size:12.5px">Imbas kod QR ini dengan aplikasi bank anda</div></div>
      <div class="muted mt" style="font-size:12px">Diproses oleh BayarCash · akaun penerima mengikut cawangan PASTI</div>`,
      `<button class="btn btn-ghost" data-close>Batal</button><button class="btn btn-primary" data-kit="pay-now">Bayar RM ${amount.toFixed(2)}</button>`);
  }
  function payNow(ov){
    const pm = (ov.querySelector('input[name=pm]:checked')||{}).value || 'FPX';
    ov.querySelector('.m-body').innerHTML = '<div class="pay-wait"><div class="spin"></div><b>Memproses pembayaran…</b><span>Jangan tutup tetingkap ini</span></div>';
    ov.querySelector('.m-foot').innerHTML = '';
    setTimeout(() => {
      const r = ref('BC'); const P = PAY;
      (P.rows||[]).forEach(tr => {
        const b = [...tr.querySelectorAll('.badge')].find(x => /belum|tertunggak|menunggu|baharu/i.test(x.textContent));
        if (b) setBadge(b, /tertunggak/i.test(b.textContent) ? 'Sudah Bayar' : /belum/i.test(b.textContent) ? 'Sudah' : 'Berjaya');
        tr.querySelectorAll('button').forEach(bt => { if (/^bayar/i.test(bt.textContent.trim())) { bt.textContent = 'Resit'; bt.className = 'btn btn-soft btn-sm'; bt.removeAttribute('data-toast'); bt.removeAttribute('data-tiers'); } });
        flash(tr);
      });
      persistTables();
      ov.querySelector('.m-body').innerHTML = `<div class="pay-ok"><div class="tick">✓</div><b>Pembayaran Berjaya</b><span>RM ${P.amount.toFixed(2)} · ${esc(pm)}</span>
        ${kv([['Rujukan BayarCash', r],['Tarikh', today() + ' ' + nowTime()],['Untuk', esc(P.what)],['Status','<span class="badge b-green">Berjaya</span>']])}</div>`;
      ov.querySelector('.m-foot').innerHTML = '<button class="btn btn-ghost" data-close>Tutup</button><button class="btn btn-primary" data-kit="pay-receipt">Lihat Resit</button>';
      PAY.ref = r; PAY.pm = pm;
      // payment log (pt-payments): who paid, for which child / PASTI
      const col = re => [...new Set((P.rows || []).map(tr => { const c = cellsOf(tr).find(c => re.test(c.h)); return c ? cellText(c.td) : ''; }).filter(Boolean))].join(', ');
      const u = DB.user(), S = scopeInfo(), portalName = (document.querySelector('.pt-app') || {dataset:{}}).dataset.portal;
      logPayment({ ref:r, jumlah:P.amount, kaedah:'BayarCash · ' + pm, untuk:P.what, pembayar: u ? u.nama : '',
        murid: col(/^(anak|nama murid|murid|nama anak)/i) || (P.murid || ''), pasti: col(/^pasti/i) || P.pasti || S.pasti || '',
        portal: portalName === 'parent' ? 'parent' : 'admin' });
      toast('Pembayaran RM ' + P.amount.toFixed(2) + ' berjaya');
    }, 1300);
  }
  // ---- payment log shared by every portal: localStorage['pt-payments'], newest first
  const PAYKEY = 'pt-payments';
  function payments(){ try { const a = JSON.parse(localStorage.getItem(PAYKEY) || '[]'); return Array.isArray(a) ? a : []; } catch(e){ return []; } }
  function logPayment(o){
    o = Object.assign({}, o || {});
    if (!o.ref) o.ref = ref('PAY'); if (!o.tarikh) o.tarikh = today(); if (!o.masa) o.masa = nowTime();
    o.jumlah = Number(o.jumlah) || 0;
    const a = payments(); a.unshift(o); try { localStorage.setItem(PAYKEY, JSON.stringify(a)); } catch(e){}
    return o;
  }
  function payReceipt(){ const P = PAY; if (!P) return;
    const pairs = [['Rujukan BayarCash', P.ref],['Kaedah', esc(P.pm)],['Untuk', esc(P.what)],['Jumlah', 'RM ' + P.amount.toFixed(2)],['Status','Berjaya']];
    const tr = document.createElement('tr'); docFor('resit', null);
    document.querySelector('#ptDyn .pt-doc .kv').outerHTML = kv(pairs);
  }

  // ---- Jana Bil (Pukal): next month's bill for every child in the bill table
  function janaBil(btn){
    const tb = [...document.querySelectorAll('table.pt')].find(x => headsOf(x).some(h => /no\.? ?bil/i.test(h))); if (!tb) { toast('Tiada jadual bil'); return; }
    const H = headsOf(tb), iNo = H.findIndex(h => /no\.? ?bil/i.test(h)), iAnak = H.findIndex(h => /anak|murid|nama/i.test(h)), iBln = H.findIndex(h => /bulan|tempoh/i.test(h));
    const seen = new Set(), src = [...tb.tBodies[0].rows].filter(r => { const k = r.children[iAnak] ? cellText(r.children[iAnak]) : ''; if (!k || seen.has(k) || r.dataset.scopeHidden === '1' || r.style.display === 'none') return false; seen.add(k); return true; });
    const d = new Date(); d.setMonth(d.getMonth() + 1); const MON = ['Januari','Februari','Mac','April','Mei','Jun','Julai','Ogos','September','Oktober','November','Disember'], bln = MON[d.getMonth()] + ' ' + d.getFullYear();
    if ([...tb.tBodies[0].rows].some(r => iBln >= 0 && r.children[iBln] && r.children[iBln].textContent.includes(bln))) { toast('Bil ' + bln + ' sudah dijana'); return; }
    let n = 0; src.reverse().forEach(r => { const c = r.cloneNode(true); c.removeAttribute('data-lbl'); c.style.display = '';
      if (c.children[iNo]) c.children[iNo].textContent = 'BIL-' + d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + String(++n).padStart(2,'0');
      if (iBln >= 0 && c.children[iBln]) c.children[iBln].textContent = bln;
      c.querySelectorAll('.badge').forEach(b => { if (/sudah|belum|berjaya|dijelaskan/i.test(b.textContent)) setBadge(b, 'Belum'); });
      c.querySelectorAll('button').forEach(bt => { if (/^resit$/i.test(bt.textContent.trim())) { bt.textContent = 'Bayar'; bt.className = 'btn btn-primary btn-sm'; } });
      tb.tBodies[0].prepend(c); flash(c); });
    persistTables(); toast(n + ' bil yuran ' + bln + ' dijana & dihantar kepada ibu bapa');
  }

  // ---- CSV export
  function exportCsv(tb){
    if (!tb) { toast('Tiada jadual untuk dieksport', 'red'); return; }
    const H = headsOf(tb), keep = H.map((h,i) => SKIP_H.test(h) ? -1 : i).filter(i => i >= 0);
    const rows = [...tb.tBodies[0].rows].filter(r => r.style.display !== 'none');
    const q = v => '"' + String(v).replace(/"/g,'""') + '"';
    const csv = [keep.map(i => q(H[i])).join(',')].concat(rows.map(r => keep.map(i => q(r.children[i] ? cellText(r.children[i]) : '')).join(','))).join('\r\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type:'text/csv' }));
    a.download = (document.title.split('·')[0].trim() || 'ePASTI').replace(/[^\w\- ]+/g,'').replace(/\s+/g,'_') + '_' + today().replace(/\//g,'-') + '.csv';
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    toast(rows.length + ' rekod dieksport ke Excel (CSV)');
  }

  // ---- decisions
  let DECIDE = null;
  function decide(tr, ok, label, btn){
    if (!ok) { DECIDE = { tr, btn };
      dyn('Tolak — ' + esc(tr ? rowTitle(tr) : 'Permohonan'), '<div class="field"><span class="label">Sebab penolakan <span class="req">*</span></span><textarea class="input" rows="3" id="ptReason" placeholder="Nyatakan sebab untuk rekod & makluman pemohon"></textarea></div>',
        '<button class="btn btn-ghost" data-close>Batal</button><button class="btn btn-red" data-kit="reject-now">Sahkan Tolak</button>'); return; }
    finishDecision(tr, label, true);
  }
  function finishDecision(tr, label, ok){
    if (tr) { const b = [...tr.querySelectorAll('.badge')].pop(); if (b) setBadge(b, label);
      const cell = [...tr.querySelectorAll('button')].find(x => /^(lulus|sokong|tolak|approve|reject|terima)$/i.test(x.textContent.trim()));
      if (cell) { const td = cell.closest('td'); td.querySelectorAll('button').forEach(x => { if (/^(lulus|sokong|tolak|approve|reject|terima)$/i.test(x.textContent.trim())) x.remove(); });
        const span = td.querySelector('span[data-tiers]'); if (span && !span.textContent.trim()) span.remove();
        td.insertAdjacentHTML('beforeend', `<span class="muted" style="font-size:12px;font-weight:600">✓ ${esc(label)} · ${today()}</span>`); }
      flash(tr); persistTables(); }
    toast(ok ? 'Status: ' + label : 'Permohonan ditolak', ok ? 'green' : 'red');
  }

  // ---- main dispatcher: returns true when handled
  let OPENER = null;
  function kit(t, e){
    const btn = t.closest('button, a.btn'); if (!btn || btn.disabled) return false;
    const L = (btn.textContent||'').replace(/\s+/g,' ').trim(), l = L.toLowerCase(), tr = btn.closest('table.pt tbody tr'), ov = btn.closest('.modal-overlay');
    const k = btn.dataset.kit;
    const stop = () => { e.preventDefault(); return true; };

    if (k === 'save-edit') { saveEdit(ov); return stop(); }
    if (k === 'print-doc') { printDoc(); return stop(); }
    if (k === 'pay-now')   { payNow(ov); return stop(); }
    if (k === 'pay-receipt') { payReceipt(); return stop(); }
    if (k === 'reject-now') { const r = ov.querySelector('#ptReason'); if (!r.value.trim()) { r.classList.add('pt-err'); toast('Sila nyatakan sebab penolakan','red'); return stop(); }
      ov.classList.remove('open'); finishDecision(DECIDE && DECIDE.tr, 'Ditolak', false); return stop(); }
    if (k === 'confirm-del') { ov.classList.remove('open'); const r = DECIDE && DECIDE.tr; if (r) { r.style.transition='opacity .2s'; r.style.opacity='0'; setTimeout(() => { r.remove(); persistTables(); }, 220); } toast('Rekod dipadam','red'); return stop(); }
    if (btn.getAttribute('href') && btn.getAttribute('href') !== '#') return false;       // real links navigate
    if (btn.hasAttribute('data-close') || btn.hasAttribute('data-modal') && !tr) return false;
    if (!ov && /excel|eksport|export|muat turun/.test(l)) { exportCsv(tableNear(btn)); return stop(); }
    if (/^\+ google$/.test(l)) { const ev = btn.closest('.gcal-ev'), nm = ev && ev.querySelector('.nm'); window.open('https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(nm ? nm.textContent : document.title) + '&details=' + encodeURIComponent('Program PASTI — ePASTI'), '_blank'); toast('Dibuka di Google Calendar untuk disimpan'); return stop(); }
    if (/^buka di google calendar$/.test(l)) { window.open('https://calendar.google.com/calendar/', '_blank'); toast('Google Calendar dibuka di tab baharu'); return stop(); }
    if (/^jana bil/.test(l)) { janaBil(btn); return stop(); }

    // modal submit buttons (page modals)
    if (ov && ov.id !== 'ptDyn' && /^(simpan|tambah|hantar|cipta|daftar|sahkan|mohon|sumbang|simpan .*|hantar .*)/i.test(l) && !btn.hasAttribute('data-close')) {
      const m = ov.querySelector('.modal'); if (!validate(m)) return stop();
      if (/^sumbang/i.test(l)) { const amt = money((fieldsOf(m).find(x => /jumlah/.test(x.label))||{inp:{value:'0'}}).inp.value) || 50;
        ov.classList.remove('open'); const opener = OPENER; addRowFrom(m, opener);
        const first = opener && tableNear(opener) && tableNear(opener).tBodies[0].rows[0];
        checkout(first ? [first] : [], amt, 'Derma — ' + ((fieldsOf(m).find(x => /kempen/.test(x.label))||{inp:{value:'Tabung Am'}}).inp.value)); return stop(); }
      const opRow = OPENER && OPENER.closest && OPENER.closest('table.pt tbody tr');
      if (opRow) { writeRow(m, opRow, false); flash(opRow); persistTables(); toast('Maklumat dikemas kini'); }
      else if (addRowFrom(m, OPENER)) toast('Rekod baharu ditambah');
      else toast(btn.dataset.toast || (/hantar/i.test(l) ? 'Berjaya dihantar' : 'Berjaya disimpan'));
      ov.classList.remove('open'); m.querySelectorAll('input:not([type=checkbox]):not([readonly]), textarea').forEach(i => { if (!opRow) i.value = ''; });
      return stop();
    }
    if (tr && btn.dataset.action === 'approve') { decide(tr, true, btn.dataset.status || 'Diterima', btn); return stop(); }
    if (tr && btn.dataset.action === 'reject')  { decide(tr, false, 'Ditolak', btn); return stop(); }
    if (tr && btn.dataset.action === 'print')   { docFor(/slip/i.test(l) ? 'slip' : /sijil/i.test(l) ? 'sijil' : /surat/i.test(l) ? 'surat' : /bayar|resit|bil|rcp|inv/i.test(tr.textContent) ? 'resit' : 'borang', tr, { jawi: /jawi/i.test(l) }); return stop(); }
    // bulk documents (page-level buttons)
    if (/^(cetak sijil tamat sekolah (jawi|rumi)|cetak sijil( tamat)?|jana slip peperiksaan \(pukal\)|cetak surat pelantikan \(pukal\))/.test(l)) {
      bulkDocs(/sijil/.test(l) ? 'sijil' : /slip/.test(l) ? 'slip' : 'surat', btn, { jawi: /jawi/.test(l) }); return stop(); }
    if (btn.dataset.action) return false;                                                   // explicit engine actions

    // row-level actions
    if (tr) {
      if (/^(lihat|view|lihat butiran|profil|butiran)$/.test(l)) { viewRow(tr); return stop(); }
      if (/^(edit|kemas kini|kemaskini|set akaun|ubah)$/.test(l)) { if (btn.dataset.modal) return false; editRow(tr); return stop(); }
      if (/^padam|^hapus/.test(l)) { DECIDE = { tr }; dyn('Padam rekod?', `<p>Rekod <b>${esc(rowTitle(tr))}</b> akan dipadam.</p>`, '<button class="btn btn-ghost" data-close>Batal</button><button class="btn btn-red" data-kit="confirm-del">Padam</button>'); return stop(); }
      if (/^resit$/.test(l)) { docFor('resit', tr); return stop(); }
      if (/^(jana slip|slip)$/.test(l)) { docFor('slip', tr); return stop(); }
      if (/^sijil/.test(l)) { docFor('sijil', tr); return stop(); }
      if (/^surat/.test(l)) { docFor('surat', tr); return stop(); }
      if (/^cetak$/.test(l)) { docFor(/bayar|resit|bil|rcp|inv/i.test(tr.textContent) ? 'resit' : /jawatan|pelantikan|ajk/i.test(tr.textContent) ? 'surat' : 'borang', tr); return stop(); }
      if (/^bayar/.test(l)) { checkout([tr], amountOf(tr) || 60, rowTitle(tr)); return stop(); }
      if (/^(lulus|sokong|terima)$/.test(l)) { decide(tr, true, btn.dataset.status || (l === 'sokong' ? 'Disokong' : 'Lulus'), btn); return stop(); }
      if (/^tolak$/.test(l)) { decide(tr, false, 'Ditolak', btn); return stop(); }
      if (/^check-in$/.test(l) || /^check-out$/.test(l)) {
        const H = headsOf(tr.closest('table')), ci = H.findIndex(h => /masa (masuk|keluar)/i.test(h) && (l === 'check-in' ? /masuk/i : /keluar/i).test(h));
        if (ci >= 0) tr.children[ci].textContent = nowTime();
        const b = tr.querySelector('.badge'); if (b && l === 'check-in') setBadge(b, new Date().getHours()*60+new Date().getMinutes() > 8*60+15 ? 'Lewat' : 'Hadir');
        flash(tr); persistTables(); toast((l === 'check-in' ? 'Waktu masuk ' : 'Waktu keluar ') + nowTime() + ' direkod'); return stop(); }
      if (/^(ingatkan|hantar peringatan|semak|mohon)$/.test(l)) {
        if (l === 'mohon') { const b = tr.querySelector('.badge'); if (b) setBadge(b, 'Menunggu'); btn.textContent = 'Semak'; persistTables(); toast('Permohonan akaun BayarCash dihantar'); return stop(); }
        if (l === 'semak') { toast(btn.dataset.toast || 'Status: menunggu pengesahan BayarCash'); return stop(); }
        btn.textContent = '✓ Dihantar'; btn.disabled = true; toast(btn.dataset.toast || 'Peringatan dihantar'); return stop(); }
      if (/^masukkan markah$/.test(l)) return false;
    }

    // page-level actions
    if (/excel|eksport|export|muat turun/.test(l)) { exportCsv(tableNear(btn)); return stop(); }
    if (/^bayar semua$/.test(l)) { const tb = tableNear(btn), rows = tb ? [...tb.tBodies[0].rows].filter(r => /belum|tertunggak/i.test(r.textContent) && r.style.display !== 'none') : [];
      if (!rows.length) { toast('Tiada bil tertunggak'); return stop(); }
      checkout(rows, rows.reduce((a,r) => a + (amountOf(r)||0), 0), rows.length + ' bil yuran'); return stop(); }
    if (/^(bayar sekarang|bayar)$/.test(l)) { const box = btn.closest('.modal, .card, .notif-item, .news-item'), hit = !btn.dataset.amount && box && box.textContent.match(/RM\s?[\d,.]+/);
      checkout([], money(btn.dataset.amount || (hit ? hit[0] : '60')) || 60, btn.dataset.what || 'Yuran PASTI'); return stop(); }
    if (/^(ingatkan|hantar peringatan)$/.test(l)) { btn.textContent = '✓ Dihantar'; btn.disabled = true; toast(btn.dataset.toast || 'Peringatan dihantar'); return stop(); }
    if (/^(buka pendaftaran|tutup pendaftaran)$/.test(l)) { const tb = tableNear(btn), open = /buka/.test(l);
      const chosen = tb ? [...tb.querySelectorAll('tbody tr')].filter(r => r.querySelector('input[type=checkbox]:checked')) : [];
      (chosen.length ? chosen : tb ? [...tb.tBodies[0].rows] : []).forEach(r => { const b = [...r.querySelectorAll('.badge')].find(x => /buka|tutup/i.test(x.textContent)); if (b) setBadge(b, open ? 'BUKA' : 'TUTUP'); });
      persistTables(); toast('Pendaftaran murid ' + (open ? 'dibuka' : 'ditutup') + (chosen.length ? ' (' + chosen.length + ' cawangan)' : ' untuk semua cawangan'), open ? 'green' : 'red'); return stop(); }
    if (/^tandakan semua dibaca$/.test(l)) { document.querySelectorAll('.tag-dot, .unread-dot').forEach(d => d.style.visibility = 'hidden'); markNotifsRead(document.querySelector('.pt-app')?.dataset.portal || 'admin'); toast('Semua makluman ditanda sebagai dibaca'); return stop(); }
    if (/^(uji sambungan|segerak sekarang|semak id)$/.test(l)) { const old = btn.textContent; btn.disabled = true; btn.textContent = 'Menyemak…';
      setTimeout(() => { btn.disabled = false; btn.textContent = old; toast(btn.dataset.toast || (l === 'semak id' ? 'ID tersedia untuk digunakan' : l === 'segerak sekarang' ? 'Disegerakkan · ' + nowTime() : 'Sambungan berjaya')); }, 900); return stop(); }
    if (/^kongsi$/.test(l)) { const u = location.href; (navigator.clipboard ? navigator.clipboard.writeText(u) : Promise.reject()).then(() => toast('Pautan kempen disalin')).catch(() => toast('Pautan: ' + u)); return stop(); }
    return false;
  }

  let WIRED=false;
  function initInteractions(){
    if(WIRED) return; WIRED=true;
    document.addEventListener('click',(e)=>{
      const t=e.target; if(!t.closest) return;
      if(t.closest('[data-own]') && !t.closest('[data-close]')) return;   // widget handles its own clicks (close buttons still close)
      if(kit(t, e)) return;                           // standard buttons do their real job

      // expandable sub-navigation
      const navp=t.closest('.nav-parent');
      if(navp){ e.preventDefault(); navp.closest('.nav-group').classList.toggle('open'); return; }

      // notification bell
      const nb=t.closest('#notifBtn');
      if(nb){ e.preventDefault(); const np=document.getElementById('notifPanel'); if(np && np.classList.toggle('open')) markNotifsRead(document.querySelector('.pt-app')?.dataset.portal || 'admin'); return; }
      if(!t.closest('.notif-panel') && !t.closest('#notifBtn')) document.getElementById('notifPanel')?.classList.remove('open');

      const mo=t.closest('[data-modal]');
      if(mo){ e.preventDefault(); const m=document.getElementById(mo.dataset.modal); OPENER=mo; if(m){ m.querySelectorAll('.pt-err').forEach(x=>x.classList.remove('pt-err')); const r=mo.closest('table.pt tbody tr'); if(r) prefill(m, r); trimLevels(m); m.classList.add('open'); } return; }
      const mc=t.closest('[data-close]');
      if(mc){ mc.closest('.modal-overlay')?.classList.remove('open'); return; }
      if(t.classList && t.classList.contains('modal-overlay')){ t.classList.remove('open'); return; }

      const tab=t.closest('.tabs a, .tabs button');
      if(tab && tab.closest('.tabs')){
        e.preventDefault();
        tab.closest('.tabs').querySelectorAll('a,button').forEach(a=>a.classList.remove('active'));
        tab.classList.add('active');
        const key=tab.dataset.tab;
        if(key){ const scope=tab.closest('.card,.pt-wrap')||document; scope.querySelectorAll('[data-panel]').forEach(p=>p.style.display=(p.dataset.panel===key?'':'none')); }
        return;
      }
      const seg=t.closest('.seg button');
      if(seg){
        seg.parentElement.querySelectorAll('button').forEach(b=>b.classList.remove('active'));
        seg.classList.add('active');
        const key=seg.dataset.tab;
        if(key){ const scope=seg.closest('.card,.pt-wrap')||document; scope.querySelectorAll('[data-panel]').forEach(p=>p.style.display=(p.dataset.panel===key?'':'none')); }
        return;
      }

      const stepBtn=t.closest('[data-step-next],[data-step-prev]');
      if(stepBtn){ e.preventDefault(); moveStep(stepBtn.closest('.modal, .pt-wrap')||document.body, stepBtn.hasAttribute('data-step-next')?1:-1); return; }

      const pg=t.closest('.pager .pages button');
      if(pg){ pg.parentElement.querySelectorAll('button').forEach(b=>b.classList.remove('active')); pg.classList.add('active'); return; }

      const act=t.closest('[data-action]');
      if(act){
        e.preventDefault(); const a=act.dataset.action, row=act.closest('tr');
        if(a==='delete'){ if(row){ row.style.transition='opacity .2s'; row.style.opacity='0'; setTimeout(()=>row.remove(),200);} toast('Rekod dipadam','red'); }
        else if(a==='approve'){ setRowStatus(row,act.dataset.status||'Diterima','b-green'); toast('Permohonan diluluskan','green'); }
        else if(a==='reject'){ setRowStatus(row,'Ditolak','b-red'); toast('Permohonan ditolak','red'); }
        else if(a==='print'){ window.print(); }
        else if(a==='goto'){ location.href=act.dataset.goto; }
        else toast(act.dataset.toast||smartMsg(labelOf(act)), act.dataset.type||'green');
        return;
      }
      const toaster=t.closest('[data-toast]');
      if(toaster){ e.preventDefault(); toast(toaster.dataset.toast, toaster.dataset.type||'green'); return; }

      const btn=t.closest('.btn');
      if(btn){
        const href=btn.getAttribute&&btn.getAttribute('href');
        if(href && href!=='#' && !href.startsWith('javascript')) return;
        if(btn.type==='submit' && btn.closest('form')) return;
        if(btn.type==='reset') return;
        e.preventDefault();
        toast(smartMsg(labelOf(btn)), btn.dataset.type||'green');
        const ov=btn.closest('.modal-overlay');
        if(ov && /simpan|hantar|tambah|daftar|lulus|bayar|create|save|confirm|lantik/i.test(labelOf(btn))) ov.classList.remove('open');
        return;
      }
    });

    document.addEventListener('change',(e)=>{
      const cb=e.target;
      if(cb.matches && cb.matches('table.pt thead input[type=checkbox]')) cb.closest('table').querySelectorAll('tbody input[type=checkbox]').forEach(x=>x.checked=cb.checked);
      if(cb.matches && cb.matches('.toolbar select, .filter-bar select')) applyFilter(cb);
      if(cb.name === 'pm'){ const ov=cb.closest('.modal'); ov.querySelectorAll('.pay-m').forEach(x=>x.classList.toggle('on', x.contains(cb))); ov.querySelectorAll('.pay-pane').forEach(p=>p.hidden = p.dataset.pm !== cb.value); }
    });
    document.addEventListener('input',(e)=>{ const i=e.target; if(i.matches && i.matches('.toolbar input, .filter-bar input')) applyFilter(i); });
    document.addEventListener('submit',(e)=>{ e.preventDefault(); if(e.target.closest('[data-own]')) return; toast('Berjaya disimpan','green'); const ov=e.target.closest('.modal-overlay'); ov&&ov.classList.remove('open'); });
  }

  // ---- access / audit log: localStorage['pt-log'], newest first (cap 1000)
  const LOGKEY = 'pt-log';
  function accessLog(){ try { const a = JSON.parse(localStorage.getItem(LOGKEY) || '[]'); return Array.isArray(a) ? a : []; } catch(e){ return []; } }
  function logAccess(tindakan, modul, detail, pasti){
    const u = DB.user(), c = u ? chainOf(u) : {}, d = new Date(), p2 = n => String(n).padStart(2,'0');
    let h = 0; String(u ? u.emel : 'awam').split('').forEach(ch => h = (h * 31 + ch.charCodeAt(0)) >>> 0);
    const o = { tarikh: today(), masa: p2(d.getHours()) + ':' + p2(d.getMinutes()) + ':' + p2(d.getSeconds()),
      pengguna: u ? u.nama : 'Pengunjung Awam', emel: u ? u.emel : '', peranan: u ? (ROLE_LABEL[u.peranan] || u.peranan) : 'Awam', lokasi: u ? u.skop : '—',
      pasti: pasti || c.pasti || '', tindakan: String(tindakan || ''), modul: String(modul || ''), detail: detail == null ? '' : String(detail),
      ip: '10.12.' + (h % 250 + 1) + '.' + ((h >>> 8) % 250 + 1), status: 'Berjaya' };
    const a = accessLog(); a.unshift(o); try { localStorage.setItem(LOGKEY, JSON.stringify(a.slice(0, 1000))); } catch(e){}
    return o;
  }

  window.PT = { svg, I, toast, queueSave, printHtml,
    logAccess, accessLog,
    get user(){ return DB.user(); },
    get role(){ const u = DB.user(); return u ? u.peranan : null; },
    get tier(){ return getTier(); },
    get scope(){ return scopeInfo(); },
    inScope, levels, trimLevels, logPayment, payments,
    scopeRows,                                    // re-apply row scoping after a page redraws a table: PT.scopeRows(rootEl?)
    can: canPage };
})();
