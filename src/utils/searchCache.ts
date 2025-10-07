/**
 * Утилиты для работы с кешем поиска в sessionStorage
 */

export type SearchResult = {
  id: string;
  title: string;
  authors: string[];
  year: number | null;
  imageId: string | null;
  library: string | null;
  isbn: string | null;
};

const SEARCH_QUERY_KEY = 'oebook_search_query';
const SEARCH_RESULTS_KEY = 'oebook_search_results';

/**
 * Очищает кеш поиска из sessionStorage
 */
export const clearSearchCache = (): void => {
  try {
    sessionStorage.removeItem(SEARCH_QUERY_KEY);
    sessionStorage.removeItem(SEARCH_RESULTS_KEY);
  } catch (error) {
    console.warn('Could not clear search cache:', error);
  }
};

/**
 * Сохраняет результаты поиска в sessionStorage
 */
export const saveSearchResults = (query: string, results: SearchResult[]): void => {
  try {
    sessionStorage.setItem(SEARCH_QUERY_KEY, query);
    sessionStorage.setItem(SEARCH_RESULTS_KEY, JSON.stringify(results));
  } catch (error) {
    console.warn('Could not save search results to sessionStorage:', error);
  }
};

/**
 * Загружает сохраненный поисковый запрос из sessionStorage
 */
export const getSavedQuery = (): string => {
  try {
    return sessionStorage.getItem(SEARCH_QUERY_KEY) || '';
  } catch (error) {
    console.warn('Could not get saved query from sessionStorage:', error);
    return '';
  }
};

/**
 * Загружает сохраненные результаты поиска из sessionStorage
 */
export const getSavedResults = (): SearchResult[] => {
  try {
    const savedResults = sessionStorage.getItem(SEARCH_RESULTS_KEY);
    if (savedResults) {
      return JSON.parse(savedResults);
    }
    return [];
  } catch (error) {
    console.warn('Could not get saved results from sessionStorage:', error);
    // Очищаем поврежденные данные
    clearSearchCache();
    return [];
  }
};

/**
 * Проверяет, есть ли сохраненные результаты поиска
 */
export const hasSavedResults = (): boolean => {
  try {
    const savedResults = sessionStorage.getItem(SEARCH_RESULTS_KEY);
    return Boolean(savedResults);
  } catch {
    return false;
  }
};

/**
 * Восстанавливает состояние поиска из sessionStorage
 * Возвращает объект с query и results
 */
export const restoreSearchState = (): { query: string; results: SearchResult[] } => {
  const query = getSavedQuery();
  const results = getSavedResults();
  
  return { query, results };
};