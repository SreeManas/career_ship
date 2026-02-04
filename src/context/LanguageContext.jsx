import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translateText, translateBatch, SUPPORTED_LANGUAGES } from '../services/translate';

const LanguageContext = createContext();

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export const LanguageProvider = ({ children }) => {
    const [currentLanguage, setCurrentLanguage] = useState(() => {
        const saved = localStorage.getItem('preferred_language');
        return saved || 'en';
    });
    const [translations, setTranslations] = useState({});
    const [isTranslating, setIsTranslating] = useState(false);

    // Save language preference
    useEffect(() => {
        localStorage.setItem('preferred_language', currentLanguage);
    }, [currentLanguage]);

    // Translate a single text
    const translate = useCallback(async (text, key) => {
        if (!text || currentLanguage === 'en') return text;

        const cacheKey = key || text;
        if (translations[cacheKey]) {
            return translations[cacheKey];
        }

        const translated = await translateText(text, currentLanguage);
        setTranslations(prev => ({ ...prev, [cacheKey]: translated }));
        return translated;
    }, [currentLanguage, translations]);

    // Translate multiple texts
    const translateMany = useCallback(async (texts) => {
        if (!texts?.length || currentLanguage === 'en') return texts;

        setIsTranslating(true);
        const result = await translateBatch(texts, currentLanguage);
        setIsTranslating(false);
        return result;
    }, [currentLanguage]);

    // Change language
    const changeLanguage = useCallback((langCode) => {
        if (langCode !== currentLanguage) {
            setTranslations({}); // Clear translations for new language
            setCurrentLanguage(langCode);
        }
    }, [currentLanguage]);

    // Get current language info
    const getCurrentLanguageInfo = useCallback(() => {
        return SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];
    }, [currentLanguage]);

    const value = {
        currentLanguage,
        changeLanguage,
        translate,
        translateMany,
        isTranslating,
        languages: SUPPORTED_LANGUAGES,
        getCurrentLanguageInfo,
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export default LanguageContext;
