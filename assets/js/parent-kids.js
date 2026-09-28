// Portal Ibu Bapa — children of the signed-in parent + shared icons/helpers for the parent pages.
// Demo parent (ibubapa@pasti.org) sees the sample children; any other parent sees their own
// applications from the shared DB (murid.emel === parent's email).
(function(){
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const ini = n => String(n).split(' ').filter(w => w && !/^(bin|binti|bt|bn)$/i.test(w)).slice(0,2).map(w => w[0]).join('');
  const COLORS = ['pp-c1','pp-c2','pp-c3','pp-c4','pp-c5','pp-c6'];

  const SAMPLE = [
    { nama:'AHMAD UMAIR BIN MOHD SAFWAN', pendek:'Ahmad Umair', mykid:'210512035411', pasti:"PASTI AR-RAIHAN", kelas:'Tahun 5 · Kelas Amanah', guru:'Ustazah Husna Mardhiah',
      ref:'PST-2024-0187', daftar:'05 Januari 2024', status:'Diterima', hadir:94, tertunggak:120, bil:2, prestasi:'Penggal 1' },
    { nama:'NUR SURAYA BINTI MOHD SAFWAN', pendek:'Nur Suraya', mykid:'220814030432', pasti:"PASTI AR-RAIHAN", kelas:'Tahun 4 · Kelas Ikhlas', guru:'Ustazah Siti Nabila Taqiuddin',
      ref:'PST-2024-0188', daftar:'05 Januari 2024', status:'Diterima', hadir:98, tertunggak:0, bil:0, prestasi:'Belum' },
  ];

  function load(){
    const me = window.DB && DB.user();
    const demo = !me || me.peranan !== 'ibubapa' || me.emel === 'ibubapa@pasti.org';
    if (demo) return { me: me || { nama:'Puan Nurul Nabihah binti Hafizuddin', emel:'ibubapa@pasti.org' }, demo:true, kids: SAMPLE };
    const kids = DB.all('murid').filter(m => (m.emel||'').toLowerCase() === me.emel.toLowerCase() && m.status !== 'Ditolak').map(m => {
      const ok = m.status === 'Diterima';
      return { nama:m.nama, pendek:m.nama.split(' ').filter(w => !/^(bin|binti)$/i.test(w)).slice(0,2).join(' ').replace(/\b\w+/g, w => w[0] + w.slice(1).toLowerCase()),
        mykid:m.mykid, pasti:m.pasti, kelas:m.kelas, guru:'—', ref:m.ref, daftar:m.tarikhDaftar || m.tarikh || '—', status:m.status,
        hadir:null, tertunggak: ok ? 60 : 0, bil: ok ? 1 : 0, prestasi:'Belum' };
    });
    return { me, demo:false, kids };
  }

  const I = {
    anak:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12h.01"/><path d="M15 12h.01"/><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"/></svg>',
    prestasi:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/></svg>',
    yuran:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>',
    resit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/></svg>',
    makluman:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/></svg>',
    daftar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>',
    program:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>',
    info:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
    ok:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
    auto:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/></svg>',
    shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  };

  const hari = () => { const d = new Date(), H = ['Ahad','Isnin','Selasa','Rabu','Khamis','Jumaat','Sabtu'], B = ['Januari','Februari','Mac','April','Mei','Jun','Julai','Ogos','September','Oktober','November','Disember'];
    return H[d.getDay()] + ', ' + d.getDate() + ' ' + B[d.getMonth()] + ' ' + d.getFullYear(); };
  const salam = () => { const h = new Date().getHours(); return h < 12 ? 'Selamat pagi' : h < 15 ? 'Selamat tengah hari' : h < 19 ? 'Selamat petang' : 'Selamat malam'; };
  const title = n => String(n).toLowerCase().replace(/\b\w/g, c => c.toUpperCase()).replace(/\bBinti\b/g,'binti').replace(/\bBin\b/g,'bin');

  window.PK = { load, esc, ini, COLORS, I, hari, salam, title };
})();
