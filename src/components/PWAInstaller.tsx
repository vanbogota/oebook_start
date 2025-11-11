"use client";
import { useEffect } from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */


export default function PWAInstaller() {
  useEffect(() => {
    // Регистрируем Service Worker только в браузере и только в production
    // => в development регистрация отключена, чтобы SW не кэшировал файлы
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      // Ждем загрузки страницы
      window.addEventListener('load', async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          
          console.log('Service Worker registered successfully:', registration);
          
          // Проверяем обновления
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // Новая версия доступна
                  console.log('New version available!');
                  // Здесь можно показать уведомление о необходимости обновления
                }
              });
            }
          });

          // Слушаем сообщения от Service Worker
          navigator.serviceWorker.addEventListener('message', (event) => {
            console.log('Message from Service Worker:', event.data);

            // Если Service Worker сообщает об обновлении, перезагружаем страницу
            if (event.data?.action === 'SW_UPDATED') {
              console.log('Service Worker updated, reloading page...');
              window.location.reload();
            }
          });

        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      });

      // Обработка события beforeinstallprompt для кастомного баннера установки
      // Сохраняем событие в глобальной переменной, чтобы хук usePWA мог его использовать
      window.addEventListener('beforeinstallprompt', (e: Event) => {
        (window as any).deferredPrompt = e;
      console.log('PWA install prompt available');
      });

      // Обработка успешной установки
      window.addEventListener('appinstalled', () => {
        console.log('PWA was installed');
        (window as any).deferredPrompt = null;
      });
    }

    // Проверяем, запущено ли приложение в standalone режиме
    if (typeof window !== 'undefined') {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          (window.navigator as any).standalone ||
                          document.referrer.includes('android-app://');
      
      if (isStandalone) {
        console.log('App is running in standalone mode');
        // Можно добавить специальную логику для standalone режима
      }
    }
  }, []);

  return null; // Этот компонент не рендерит ничего видимого
}

// Хук для управления PWA функциональностью
export function usePWA() {
  const installApp = async () => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Попытка получить событие beforeinstallprompt из глобального объекта
      const deferredPrompt = (window as any).deferredPrompt;
      
      if (deferredPrompt) {
        // Показываем prompt установки
        deferredPrompt.prompt();
        
        // Ждем выбор пользователя
        const { outcome } = await deferredPrompt.userChoice;
        
        console.log(`User response to the install prompt: ${outcome}`);
        
        // Очищаем сохраненное событие
        (window as any).deferredPrompt = null;
        
        return outcome === 'accepted';
      }
    }
    return false;
  };

  const isInstallable = () => {
    if (typeof window !== 'undefined') {
      return !!(window as any).deferredPrompt;
    }
    return false;
  };

  const isStandalone = () => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(display-mode: standalone)').matches ||
             (window.navigator as any).standalone ||
             document.referrer.includes('android-app://');
    }
    return false;
  };

  return {
    installApp,
    isInstallable,
    isStandalone,
  };
}