"use client";
import { useEffect } from 'react';

export default function PWAInstaller() {
  useEffect(() => {
    // Регистрируем Service Worker только в браузере
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
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
          });

        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      });

      // Обработка события beforeinstallprompt для кастомного баннера установки
      let deferredPrompt: any = null;
      
      window.addEventListener('beforeinstallprompt', (e) => {
        // Предотвращаем показ стандартного баннера
        e.preventDefault();
        // Сохраняем событие для дальнейшего использования
        deferredPrompt = e;
        
        console.log('PWA install prompt available');
        // Здесь можно показать кастомную кнопку "Установить приложение"
      });

      // Обработка успешной установки
      window.addEventListener('appinstalled', () => {
        console.log('PWA was installed');
        deferredPrompt = null;
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