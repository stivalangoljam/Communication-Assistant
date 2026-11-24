// Offline shell + push notifications. Network first, so you always get the newest version when online.
const V = 'ca-v3';
const SHELL = ['./', 'index.html', 'firebase-config.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];
try {
  importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js', 'https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');
  firebase.initializeApp({ apiKey: "AIzaSyCn4J3-ABMwcoUX6Z3cnzPZQYpbLoIRpOA", authDomain: "comm-assistant-515112.firebaseapp.com", projectId: "comm-assistant-515112", messagingSenderId: "700853161012", appId: "1:700853161012:web:03fa2c93d13431af960e61" });
  firebase.messaging().onBackgroundMessage(p => {
    const d = p.data || {};
    return self.registration.showNotification(d.title || 'New message', { body: d.body, icon: 'icon-192.png', badge: 'icon-192.png', tag: d.tag, data: { url: d.url } });
  });
} catch (e) { /* the app still works without push */ }
// Shows every push ourselves (same tag = never shown twice, even if the Firebase helper also shows it).
self.addEventListener('push', e => {
  let p = {};
  try { p = e.data ? e.data.json() : {}; } catch (_) {}
  const d = p.data || p.notification || {};
  if (!d.title) return;
  e.waitUntil(self.registration.showNotification(d.title, { body: d.body || '', icon: 'icon-192.png', badge: 'icon-192.png', tag: d.tag || 'msg', data: { url: d.url } }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || './';
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) if ('focus' in c) return c.focus();
    return clients.openWindow(url);
  }));
});
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== V).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.pathname.startsWith('/__/')) return;
  if (u.origin !== location.origin && u.hostname !== 'www.gstatic.com') return;
  e.respondWith(fetch(r).then(res => {
    if (res.ok) { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); }
    return res;
  }).catch(() => caches.match(r).then(m => m || caches.match('index.html'))));
});
