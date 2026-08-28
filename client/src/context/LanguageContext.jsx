import React, { createContext, useContext, useState, useEffect } from 'react';
import translations from '../i18n/translations.json';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('sahakari_app_language') || 'en';
  });

  const setLanguage = (langCode) => {
    if (translations[langCode]) {
      setLanguageState(langCode);
      localStorage.setItem('sahakari_app_language', langCode);
    }
  };

  const t = (key, fallback = '') => {
    if (translations[language] && translations[language][key]) {
      return translations[language][key];
    }
    if (translations['en'] && translations['en'][key]) {
      return translations['en'][key];
    }
    return fallback || key;
  };

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ta', label: 'தமிழ் (Tamil)', flag: '🇮🇳' },
    { code: 'hi', label: 'हिन्दी (Hindi)', flag: '🇮🇳' },
    { code: 'te', label: 'తెలుగు (Telugu)', flag: '🇮🇳' },
    { code: 'mr', label: 'मराठी (Marathi)', flag: '🇮🇳' }
  ];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
