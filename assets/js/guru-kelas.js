// Kelas guru (mockup data) — shared by guru/murid.html (kehadiran) and guru/markah.html.
window.KELAS = {
  nama: 'Tahun 5 — Al-Farabi',
  umur: 5,                                   // buku rekod SPPM 5 Tahun
  // PASTI of the signed-in teacher (DB user skop); the 15-pupil roster below is the demo class.
  pasti: (function(){ try { const u = (window.PT && PT.user) || (window.DB && DB.user && DB.user());
    return (u && /guru|pembantu/.test(u.peranan) && u.skop) ? u.skop : 'PASTI AR-RAIHAN'; } catch(e){ return 'PASTI AR-RAIHAN'; } })(),
  murid: [
    { nama:'Ahmad Umair bin Mohd Safwan',         mykid:'210512035411' },
    { nama:'Nur Solehah Suraya binti Che Mat',      mykid:'150618038729' },
    { nama:'Muhammad Hazwan Iqmal bin Wan Faqih',  mykid:'150204031321' },
    { nama:'Nurul Farhana binti Mohd Marwan',       mykid:'150725031926' },
    { nama:'Ahmad Nazmi bin Darwisy',              mykid:'150109034082' },
    { nama:'Siti Nur Raihana binti Baihaqi',      mykid:'150830035833' },
    { nama:'Muhammad Farhan Qayyum bin Aizat', mykid:'150415035143' },
    { nama:'Nur Afiqah Zawani binti Rafie',          mykid:'150922034133' },
    { nama:'Muhammad Nazmi bin Che Farhan',          mykid:'150507034460' },
    { nama:'Nur Adlina binti Mohd Hazwan',        mykid:'150611037564' },
    { nama:'Ahmad Faqih bin Mat Ezani',          mykid:'150318035465' },
    { nama:'Nur Radhiah binti Wan Darwisy',        mykid:'150803037980' },
    { nama:'Muhammad Khalish bin Abdul Zamri',     mykid:'150126034253' },
    { nama:'Nur Lubna binti Mohd Zaki',          mykid:'150719034889' },
    { nama:'Muhammad Bukhari Farhan bin Hisyam',     mykid:'150430034512' },
  ],
  // Fill any [data-kelas] / [data-kelas-pasti] placeholder with the class name / PASTI.
  label(){ document.querySelectorAll('[data-kelas]').forEach(el => el.textContent = 'Kelas ' + this.nama);
    document.querySelectorAll('[data-kelas-pasti]').forEach(el => el.textContent = this.pasti); },
  initials(nama){
    const p = nama.split(' ').filter(w => !/^(bin|binti)$/i.test(w));
    return (p[0][0] + (p[1] ? p[1][0] : '')).toUpperCase();
  },
  // Per-device store (mockup stand-in for the server); wrapped so private mode still works.
  load(key, fallback){ try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch(e){ return fallback; } },
  save(key, val){ try { localStorage.setItem(key, JSON.stringify(val)); } catch(e){} },
};
