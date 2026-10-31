import { useCallback, useEffect, useState } from 'react';
import { getTranslation, LANGUAGE_STORAGE_KEY, SUPPORTED_LANGUAGES } from '../i18n/translations';

function getStoredLanguage() {
  try {
    const value = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return SUPPORTED_LANGUAGES.includes(value) ? value : 'en';
  } catch {
    return 'en';
  }
}

export function useTranslation() {
  const [language, setLanguageState] = useState(getStoredLanguage);

  useEffect(() => {
    const handleLanguageChange = (event) => {
      const nextLanguage = event.detail?.language || getStoredLanguage();
      if (SUPPORTED_LANGUAGES.includes(nextLanguage)) setLanguageState(nextLanguage);
    };
    window.addEventListener('grace_language_changed', handleLanguageChange);
    window.addEventListener('storage', handleLanguageChange);
    return () => {
      window.removeEventListener('grace_language_changed', handleLanguageChange);
      window.removeEventListener('storage', handleLanguageChange);
    };
  }, []);

  const setLanguage = useCallback((nextLanguage) => {
    if (!SUPPORTED_LANGUAGES.includes(nextLanguage)) return;
    setLanguageState(nextLanguage);
    try { localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage); } catch { /* storage unavailable */ }
    window.dispatchEvent(new CustomEvent('grace_language_changed', { detail: { language: nextLanguage } }));
  }, []);

  const t = useCallback((key, variables) => getTranslation(language, key, variables), [language]);
  return { language, setLanguage, t };
}