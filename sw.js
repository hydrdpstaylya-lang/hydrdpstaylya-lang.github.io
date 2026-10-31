const CACHE='smartclass-app-v3';
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(['/','/favicon.svg','/fonts/vazirmatn.woff2','/manifest.webmanifest'])))});
self.addEventListener('activate',event=>{event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('smartclass-app-')&&k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()]))});
self.addEventListener('fetch',event=>{const req=event.request,url=new URL(req.url);if(req.method!=='GET'||url.origin!==self.location.origin||url.pathname.startsWith('/api/'))return;
 if(req.mode==='navigate'){event.respondWith(fetch(req).then(async r=>{if(r.ok){const c=await caches.open(CACHE);await c.put('/',r.clone())}return r}).catch(()=>caches.match('/')));return}
 if(!/\.(js|css|woff2|webp|png|svg|pdf|webmanifest)$/.test(url.pathname))return;
 event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(async r=>{if(r.ok){const c=await caches.open(CACHE);await c.put(req,r.clone());const keys=await c.keys();if(keys.length>180)await c.delete(keys[4])}return r})))
});
