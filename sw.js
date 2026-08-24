const C='kino-v18';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-180.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(ASSETS).catch(()=>{})));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const isPage=e.request.mode==='navigate'||(e.request.headers.get('accept')||'').includes('text/html');
  if(isPage){
    e.respondWith(fetch(e.request).then(res=>{const cl=res.clone();caches.open(C).then(c=>c.put(e.request,cl)).catch(()=>{});return res;}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(res=>{const cl=res.clone();caches.open(C).then(c=>c.put(e.request,cl)).catch(()=>{});return res;})));
});