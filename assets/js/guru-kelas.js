// Kelas guru (mockup data) — shared by guru/murid.html (kehadiran) and guru/markah.html.
window.KELAS = {
  nama: 'Tahun 5 — Al-Farabi',
  umur: 5,                                   // buku rekod SPPM 5 Tahun
  pasti: "PASTI AL-TA'LIM",
  murid: [
    { nama:'Ahmad Zafran bin Mohd Idris',         mykid:'210512100713' },
    { nama:'Nur Aisyah Sofea binti Che Mat',      mykid:'150618290022' },
    { nama:'Muhammad Danish Haikal bin Wan Ali',  mykid:'150204290033' },
    { nama:'Nurul Izzati binti Mohd Nasir',       mykid:'150725290044' },
    { nama:'Ahmad Zahin bin Ismail',              mykid:'150109290055' },
    { nama:'Siti Nur Balqis binti Abdullah',      mykid:'150830290066' },
    { nama:'Muhammad Aiman Firdaus bin Zulkifli', mykid:'150415290077' },
    { nama:'Nur Alya Damia binti Harun',          mykid:'150922290088' },
    { nama:'Muhammad Irfan bin Che Soh',          mykid:'150507290099' },
    { nama:'Nur Insyirah binti Mohd Rani',        mykid:'150611290110' },
    { nama:'Ahmad Syafiq bin Mat Jusoh',          mykid:'150318290121' },
    { nama:'Nur Qaisara binti Wan Ismail',        mykid:'150803290132' },
    { nama:'Muhammad Haziq bin Abdul Rahman',     mykid:'150126290143' },
    { nama:'Nur Sofhah binti Mohd Zaki',          mykid:'150719290154' },
    { nama:'Muhammad Nabil Aiman bin Yaakob',     mykid:'150430290165' },
  ],
  initials(nama){
    const p = nama.split(' ').filter(w => !/^(bin|binti)$/i.test(w));
    return (p[0][0] + (p[1] ? p[1][0] : '')).toUpperCase();
  },
  // Per-device store (mockup stand-in for the server); wrapped so private mode still works.
  load(key, fallback){ try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch(e){ return fallback; } },
  save(key, val){ try { localStorage.setItem(key, JSON.stringify(val)); } catch(e){} },
};
