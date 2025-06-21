import { useCallback, useEffect, useRef, useState } from 'react';
import { SupportedLanguages } from '@/features/Problem/constants/SupportedLanguages';

interface CodeStorageData {
  code: string;
  timestamp: number;
}

const STORAGE_KEY_PREFIX = 'problem_code_';
const DEBOUNCE_DELAY = 4000;

/**
 * Custom hook for managing user code storage with debouncing
 * Stores code by problemId and language combination
 */
export const useCodeStorage = (problemId: string | undefined, language: SupportedLanguages) => {
  const debounceTimerRef = useRef<NodeJS.Timeout>();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Generate storage key based on problemId and language
  const getStorageKey = useCallback((id: string, lang: SupportedLanguages) => {
    return `${STORAGE_KEY_PREFIX}${id}_${lang.toLowerCase()}`;
  }, []);

  // Save code to localStorage with debouncing
  const saveCode = useCallback((code: string) => {
    if (!problemId) return;

    // Set saving status to true when user starts typing
    setIsSaving(true);

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      try {
        const storageKey = getStorageKey(problemId, language);
        const data: CodeStorageData = {
          code,
          timestamp: Date.now()
        };
        localStorage.setItem(storageKey, JSON.stringify(data));
        setIsSaving(false);
        setLastSaved(new Date());
      } catch (error) {
        console.warn('Failed to save code to localStorage:', error);
        setIsSaving(false);
      }
    }, DEBOUNCE_DELAY);
  }, [problemId, language, getStorageKey]);

  // Load code from localStorage
  const loadCode = useCallback((): string | null => {
    if (!problemId) return null;

    try {
      const storageKey = getStorageKey(problemId, language);
      const storedData = localStorage.getItem(storageKey);
      
      if (storedData) {
        const data: CodeStorageData = JSON.parse(storedData);
        return data.code;
      }
    } catch (error) {
      console.warn('Failed to load code from localStorage:', error);
    }
    
    return null;
  }, [problemId, language, getStorageKey]);

  // Clear stored code for current problem and language
  const clearCode = useCallback(() => {
    if (!problemId) return;

    try {
      const storageKey = getStorageKey(problemId, language);
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.warn('Failed to clear code from localStorage:', error);
    }
  }, [problemId, language, getStorageKey]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    saveCode,
    loadCode,
    clearCode,
    isSaving,
    lastSaved
  };
};
