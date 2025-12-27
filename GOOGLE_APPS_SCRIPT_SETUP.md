# Google Apps Script Setup Guide

## Проблема: 401 Unauthorized Error

Ошибка 401 возникает, когда Google Apps Script веб-приложение не настроено на публичный доступ или требует авторизации.

## Решение

### Шаг 1: Откройте ваш Google Apps Script

1. Перейдите к вашему скрипту по URL:
   - Откройте Google Sheets с таблицей
   - Выберите **Extensions** → **Apps Script**

### Шаг 2: Проверьте код скрипта

Убедитесь, что ваш скрипт правильно обрабатывает POST запросы:

```javascript
function doPost(e) {
  try {
    // Получаем данные из запроса
    const data = JSON.parse(e.postData.contents);
    
    // Открываем таблицу
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Добавляем данные
    const timestamp = new Date();
    sheet.appendRow([
      timestamp,
      data.email,
      data.zipCode,
      data.link,
      data.fileName,
      data.fileBase64 ? 'Attached' : 'No file'
    ]);
    
    // Возвращаем успешный ответ
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Data saved successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Возвращаем ошибку
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Шаг 3: Разверните веб-приложение с правильными настройками

1. Нажмите **Deploy** → **New deployment**

2. Выберите тип: **Web app**

3. **ВАЖНЫЕ НАСТРОЙКИ:**
   - **Description**: "Waiting list API" (или любое описание)
   - **Execute as**: **Me** (ваш email)
   - **Who has access**: **Anyone** ⚠️ ЭТО КРИТИЧЕСКИ ВАЖНО!

4. Нажмите **Deploy**

5. **Скопируйте новый Web app URL** - он будет отличаться от старого!

6. Возможно потребуется дать разрешения:
   - Нажмите **Authorize access**
   - Выберите ваш Google аккаунт
   - Нажмите **Advanced** → **Go to [Your Project]**
   - Нажмите **Allow**

### Шаг 4: Обновите URL в коде

Замените старый URL в файле `src/app/api/waiting-list/route.ts`:

```typescript
const res = await fetch(
  "YOUR_NEW_WEB_APP_URL_HERE",  // ⬅️ Вставьте новый URL
  {
    method: "POST",
    // ...
```

### Шаг 5: Подготовьте таблицу

Убедитесь, что первая строка содержит заголовки:

| Timestamp | Email | Zip Code | Link | Filename | File Status |
|-----------|-------|----------|------|----------|-------------|

## Альтернативное решение: Проверка доступа

Если вы не хотите делать скрипт полностью публичным, можно добавить простую авторизацию:

### Вариант 1: API ключ

В Google Apps Script:

```javascript
function doPost(e) {
  const API_KEY = "your-secret-key-here"; // Замените на свой ключ
  
  const data = JSON.parse(e.postData.contents);
  
  // Проверка API ключа
  if (data.apiKey !== API_KEY) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: 'Unauthorized'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // Остальной код...
}
```

В вашем Next.js коде:

```typescript
body: JSON.stringify({
  apiKey: process.env.GOOGLE_APPS_SCRIPT_API_KEY, // Добавьте в .env.local
  email,
  zipCode,
  link,
  fileName,
  fileBase64: base64File,
}),
```

## Проверка настроек

После deployment, проверьте:

1. **Who has access** = "Anyone" в настройках deployment
2. URL должен заканчиваться на `/exec` (не `/dev`)
3. Скрипт должен иметь функцию `doPost` (не `doGet`)

## Тестирование

Попробуйте отправить тестовый запрос через curl:

```bash
curl -X POST "YOUR_WEB_APP_URL" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","zipCode":"12345","link":"http://test.com","fileName":"test.jpg"}'
```

Должен вернуться успешный ответ, а не ошибка 401.

## Частые ошибки

- **401 Unauthorized**: "Who has access" не установлено на "Anyone"
- **405 Method Not Allowed**: Функция называется `doGet` вместо `doPost`
- **302 Redirect**: Используется `/dev` URL вместо `/exec`
- **403 Forbidden**: Нужно заново авторизовать скрипт

## Безопасность

⚠️ **Важно**: Если делаете скрипт публичным:

1. Добавьте rate limiting в скрипте
2. Валидируйте входные данные
3. Не возвращайте чувствительную информацию
4. Рассмотрите добавление API ключа
5. Мониторьте использование квот Google

## Лимиты Google Apps Script

- **Executions per day**: 20,000 (для бесплатных аккаунтов)
- **Script runtime**: 6 минут максимум
- **URL Fetch size**: 50 MB
- **Spreadsheet cells**: 10 миллионов

Если нужны большие лимиты, рассмотрите Google Cloud Platform сервисы.
