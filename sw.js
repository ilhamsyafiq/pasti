// ePASTI service worker — lets the guru & parent portals open from the home screen
// and keep working on weak signal. Network first; falls back to the cached copy.
const CACHE = 'epasti-v3';
const CORE = [
  'assets/css/app.css', 'assets/js/app.js', 'assets/img/pasti-logo.png', 'assets/img/icons/icon-192.png',
  'guru/dashboard.html', 'guru/clock.html', 'guru/murid.html', 'guru/markah.html', 'guru/takwim.html', 'guru/profil.html',
  'assets/js/sppm.js', 'assets/js/parent-kids.js', 'assets/js/guru-kelas.js', 'parent/prestasi.html', 'parent/dashboard.html', 'parent/anak.html', 'parent/yuran.html', 'parent/resit.html', 'parent/pemakluman.html', 'parent/profil.html',
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res; })
      .catch(() => caches.match(req, { ignoreSearch: true }))
  );
});
