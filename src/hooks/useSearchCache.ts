import { useState, useEffect } from 'react';
import { 
  clearSearchCache, 
  saveSearchResults, 
  restoreSearchState,
  type SearchResult 
} from '@/utils/searchCache';

/**
 * Хук для работы с кешем поиска
 * Предоставляет состояние поиска и функции для его управления
 */
export const useSearchCache = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<SearchResult[]>([]);

  // Восстанавливаем состояние при загрузке
  useEffect(() => {
    const { query: savedQuery, results: savedResults } = restoreSearchState();
    
    if (savedQuery) {
      setQuery(savedQuery);
    }
    
    if (savedResults.length > 0) {
      setResults(savedResults);
    }
  }, []);

  /**
   * Обновляет результаты поиска и сохраняет их в кеш
   */
  const updateSearchResults = (newQuery: string, newResults: SearchResult[]) => {
    setQuery(newQuery);
    setResults(newResults);
    saveSearchResults(newQuery, newResults);
  };

  /**
   * Очищает результаты поиска и кеш
   */
  const clearSearch = () => {
    setQuery('');
    setResults([]);
    clearSearchCache();
  };

  /**
   * Устанавливает только запрос без сохранения в кеш
   */
  const setQueryOnly = (newQuery: string) => {
    console.log('setQueryOnly called with:', newQuery);
    setQuery(newQuery);
  };

  /**
   * Устанавливает только результаты без сохранения в кеш
   */
  const setResultsOnly = (newResults: SearchResult[]) => {
    setResults(newResults);
  };

  return {
    // Состояние
    query,
    results,
    hasResults: results.length > 0,
    
    // Действия
    updateSearchResults,
    clearSearch,
    setQueryOnly,
    setResultsOnly,
    
    // Прямой доступ к утилитам
    clearSearchCache,
    saveSearchResults,
  };
};