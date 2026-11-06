/* ULD Check — service worker. O app abre sem internet; fotos e dados ficam no celular até serem enviados. */
const VERSION = 'uldcheck-1.2.0';
const CORE = ['./', './index.html', './manifest.webmanifest', './config.js', './lib/msal-browser.min.js',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png', './icons/apple-touch-icon.png',
  './fonts/fonts.css', './fonts/lexend-400.woff2', './fonts/lexend-500.woff2', './fonts/lexend-600.woff2', './fonts/lexend-700.woff2',
  './fonts/b612-mono-400.woff2', './fonts/b612-mono-700.woff2'];
/* leitura de tickets: baixada em segundo plano depois da instalação, para funcionar sem internet */
const OCR = ['./ocr/tesseract.min.js', './ocr/worker.min.js', './ocr/core/tesseract-core-lstm.wasm.js', './ocr/core/tesseract-core-simd-lstm.wasm.js', './ocr/lang/eng.traineddata.gz'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== VERSION) await caches.delete(k);
    await self.clients.claim();
    const c = await caches.open(VERSION);
    for (const u of OCR){ try { if (!(await c.match(u))) await c.add(u); } catch (err) { /* tenta de novo no próximo uso */ } }
  })());
});
const timeout = (p, ms) => Promise.race([p, new Promise((_, ko) => setTimeout(() => ko(new Error('timeout')), ms))]);
async function networkFirst(req, key){
  const c = await caches.open(VERSION);
  try {
    const r = await timeout(fetch(req), 4000);
    if (r && r.ok) c.put(key, r.clone());
    return r;
  } catch (e) {
    const hit = await c.match(key, {ignoreSearch:true});
    if (hit) return hit;
    throw e;
  }
}
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;   /* Microsoft login e Graph vão direto para a rede */
  if (req.mode === 'navigate'){ e.respondWith(networkFirst(req, './index.html')); return; }
  if (url.pathname.endsWith('/config.js')){ e.respondWith(networkFirst(req, './config.js')); return; }
  e.respondWith(caches.match(req, {ignoreSearch:true}).then(hit => hit || fetch(req).then(r => {
    if (r && r.ok){ const cp = r.clone(); caches.open(VERSION).then(c => c.put(req, cp)); }
    return r;
  })));
});
