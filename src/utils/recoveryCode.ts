/**
 * Генерирует уникальный код восстановления для пользователя
 * Формат: XXXX-XXXX-XXXX-XXXX (16 символов + дефисы)
 * Использует криптографически безопасный генератор случайных чисел
 */
export function generateRecoveryCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Исключены похожие символы (I, O, 0, 1)
  const segments = 4;
  const segmentLength = 4;
  
  const code: string[] = [];
  
  for (let i = 0; i < segments; i++) {
    let segment = '';
    for (let j = 0; j < segmentLength; j++) {
      // Используем crypto.getRandomValues для безопасной генерации
      const randomArray = new Uint32Array(1);
      crypto.getRandomValues(randomArray);
      const randomIndex = randomArray[0] % chars.length;
      segment += chars[randomIndex];
    }
    code.push(segment);
  }
  
  return code.join('-');
}

/**
 * Валидация формата кода восстановления
 */
export function isValidRecoveryCode(code: string): boolean {
  const pattern = /^[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/;
  return pattern.test(code);
}

/**
 * Форматирует введенный код (удаляет пробелы, приводит к верхнему регистру, добавляет дефисы)
 */
export function formatRecoveryCode(input: string): string {
  // Удаляем все символы кроме букв и цифр
  const cleaned = input.toUpperCase().replace(/[^A-Z0-9]/g, '');
  
  // Разбиваем на сегменты по 4 символа
  const segments: string[] = [];
  for (let i = 0; i < cleaned.length && i < 16; i += 4) {
    segments.push(cleaned.slice(i, i + 4));
  }
  
  return segments.join('-');
}
