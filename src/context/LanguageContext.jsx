import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  AVAILABLE_LANGUAGES,
  getTranslation,
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGES
} from '../utils/translations';

const LanguageContext = createContext(null);

function readStoredLanguage() {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return SUPPORTED_LANGUAGES.includes(stored) ? stored : 'en';
  } catch (error) {
    console.warn('[Language] Unable to read saved language:', error);
    return 'en';
  }
}

export function LanguageProvider({ children }) {
  const [currentLang, setCurrentLang] = useState(readStoredLanguage);

  const changeLanguage = useCallback(language => {
    if (!SUPPORTED_LANGUAGES.includes(language)) return;
    setCurrentLang(language);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (error) {
      console.warn('[Language] Unable to save selected language:', error);
    }
  }, []);

  const t = useCallback((key, variables) => getTranslation(currentLang, key, variables), [currentLang]);
  const value = useMemo(() => ({
    t,
    currentLang,
    changeLanguage,
    availableLanguages: AVAILABLE_LANGUAGES,
    language: currentLang,
    setLanguage: changeLanguage
  }), [changeLanguage, currentLang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useTranslation must be used within a LanguageProvider.');
  return context;
}
