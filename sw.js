// AOBA シフト管理 Service Worker
const CACHE_NAME = 'aoba-shift-v1';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim());
});

// プッシュ通知受信
self.addEventListener('push', (e) => {
  let data = { title: 'AOBAシフト管理', body: '更新があります' };
  if (e.data) {
    try { data = e.data.json(); } catch { data.body = e.data.text(); }
  }

  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/shift/icon.png',
      badge: '/shift/icon.png',
      vibrate: [200, 100, 200],
      tag: 'aoba-shift',
      renotify: true,
      data: { url: data.url || '/shift/' }
    })
  );
});

// 通知タップでアプリを開く
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then(list => {
      for (const client of list) {
        if (client.url.includes('/shift/') && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(e.notification.data.url);
    })
  );
});
