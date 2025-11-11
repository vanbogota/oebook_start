/* eslint-disable */
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

const CACHE_NAME = 'oebook-v3';
const STATIC_CACHE_NAME = 'oebook-static-v3';
const DYNAMIC_CACHE_NAME = 'oebook-dynamic-v3';

// Список файлов для кэширования
const STATIC_FILES = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Добавьте другие статические ресурсы
];

// API эндпоинты для кэширования
const API_CACHE_PATTERNS = [
  /^https:\/\/api\.finna\.fi\/api\/v1\/search/,
  /^https:\/\/api\.finna\.fi\/Cover\/Show/,
];

// Установка Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Caching static files...');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        // Принудительно активировать новый SW
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Error during install:', error);
      })
  );
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    // Удаляем старые кэши
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Принимаем управление всеми клиентами
        return self.clients.claim();
      })
      .then(() => {
        // Уведомляем всех клиентов об обновлении
        return self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({ action: 'SW_UPDATED' });
          });
        });
      })
      .catch((error) => {
        console.error('Error during activate:', error);
      })
  );
});

//пример работы с firebase messaging взят из другого проекта
// Firebase configuration is loaded from environment variables
importScripts('/firebase-config.js');

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {

  // payload.fcmOptions?.link comes from our backend API route handle
  // payload.data.link comes from the Firebase Console where link is the 'key'
  const link = payload.fcmOptions?.link || payload.data?.link;

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "./logo.png",
    data: { url: link },
  };
  //self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", function (event) {

  event.notification.close();

  // This checks if the client is already open and if it is, it focuses on the tab. If it is not open, it opens a new tab with the URL passed in the notification payload
  event.waitUntil(
    clients
      // https://developer.mozilla.org/en-US/docs/Web/API/Clients/matchAll
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (clientList) {
        const url = event.notification.data.url;

        if (!url) return;

        // If relative URL is passed in firebase console or API route handler, it may open a new window as the client.url is the full URL i.e. https://example.com/ and the url is /about whereas if we passed in the full URL, it will focus on the existing tab i.e. https://example.com/about
        for (const client of clientList) {
          if (client.url === url && "focus" in client) {
            return client.focus();
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});




// Обработка запросов
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Пропускаем non-GET запросы
  if (request.method !== 'GET') {
    return;
  }

  // Обработка навигационных запросов
  if (request.mode === 'navigate') {
    event.respondWith(
      handleNavigationRequest(request)
    );
    return;
  }

  // Обработка API запросов
  if (isApiRequest(url)) {
    event.respondWith(
      handleApiRequest(request)
    );
    return;
  }

  // Обработка статических ресурсов
  if (isStaticResource(url)) {
    event.respondWith(
      handleStaticRequest(request)
    );
    return;
  }

  // Обработка изображений
  if (isImageRequest(request)) {
    event.respondWith(
      handleImageRequest(request)
    );
    return;
  }
});

// Обработка навигационных запросов (страницы)
async function handleNavigationRequest(request) {
  try {
    // Сначала пробуем загрузить с сети
    const networkResponse = await fetch(request);
    
    // Кэшируем успешный ответ
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    cache.put(request, networkResponse.clone());
    
    return networkResponse;
  } catch (error) {
    // Если сеть недоступна, ищем в кэше
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Если ничего нет, возвращаем главную страницу
    const fallbackResponse = await caches.match('/');
    if (fallbackResponse) {
      return fallbackResponse;
    }
    
    // Последний вариант - показываем offline страницу
    return new Response(
      getOfflineHTML(),
      { 
        headers: { 'Content-Type': 'text/html' },
        status: 200
      }
    );
  }
}

// Обработка API запросов
async function handleApiRequest(request) {
  try {
    // Сначала пробуем загрузить с сети
    const networkResponse = await fetch(request);
    
    // Кэшируем только успешные ответы
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Если сеть недоступна, ищем в кэше
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Возвращаем ошибку для API
    return new Response(
      JSON.stringify({ 
        error: 'Network unavailable',
        offline: true 
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 503
      }
    );
  }
}

// Обработка статических ресурсов
async function handleStaticRequest(request) {
  // Сначала проверяем кэш
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    // Если нет в кэше, загружаем с сети
    const networkResponse = await fetch(request);
    
    // Кэшируем статические файлы
    const cache = await caches.open(STATIC_CACHE_NAME);
    cache.put(request, networkResponse.clone());
    
    return networkResponse;
  } catch (error) {
    // Если статический ресурс недоступен, возвращаем ошибку
    return new Response('Resource unavailable', { status: 404 });
  }
}

// Обработка изображений
async function handleImageRequest(request) {
  // Сначала проверяем кэш
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    // Если нет в кэше, загружаем с сети
    const networkResponse = await fetch(request);
    
    // Кэшируем изображения
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Возвращаем placeholder изображение
    return getPlaceholderImage();
  }
}

// Проверка типов запросов
function isApiRequest(url) {
  return API_CACHE_PATTERNS.some(pattern => pattern.test(url.href)) ||
         url.pathname.startsWith('/api/');
}

function isStaticResource(url) {
  return url.pathname.endsWith('.css') ||
         url.pathname.endsWith('.js') ||
         url.pathname.endsWith('.json') ||
         url.pathname.includes('/_next/static/');
}

function isImageRequest(request) {
  return request.destination === 'image' ||
         request.url.includes('api.finna.fi/Cover/Show');
}

// Offline HTML страница
function getOfflineHTML() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Offline - Open Europe Books</title>
      <style>
        body {
          font-family: system-ui, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          background: #f5f5f5;
          color: #333;
        }
        .container {
          text-align: center;
          padding: 2rem;
          max-width: 400px;
        }
        .icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }
        h1 {
          margin-bottom: 0.5rem;
          color: #171717;
        }
        p {
          color: #666;
          margin-bottom: 1.5rem;
        }
        button {
          background: #171717;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 1rem;
        }
        button:hover {
          background: #333;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">📚</div>
        <h1>You're Offline</h1>
        <p>Check your internet connection and try again.</p>
        <button onclick="window.location.reload()">Try Again</button>
      </div>
    </body>
    </html>
  `;
}

// Placeholder изображение (1x1 прозрачный пиксель)
function getPlaceholderImage() {
  const svg = `
    <svg width="64" height="96" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="96" fill="#f0f0f0" stroke="#ddd" stroke-width="1"/>
      <text x="32" y="48" text-anchor="middle" font-family="system-ui" font-size="10" fill="#999">
        📚
      </text>
    </svg>
  `;
  
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400'
    }
  });
}

// Обработка синхронизации в фоне
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Здесь можно добавить логику для синхронизации данных
      console.log('Background sync triggered')
    );
  }
});

// Обработка push уведомлений (для будущего расширения)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      tag: 'oebook-notification',
      renotify: true,
      actions: [
        {
          action: 'view',
          title: 'View',
          icon: '/icons/view-action.png'
        },
        {
          action: 'dismiss',
          title: 'Dismiss',
          icon: '/icons/dismiss-action.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Обработка кликов по уведомлениям
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});