import { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translateBatch } from '../services/translate';

/**
 * Hook for translating multiple texts at once
 * @param {Object} texts - Object with key-value pairs where values are English text
 * @returns {Object} - Same object with translated values
 */
export const useTranslations = (texts) => {
    const { currentLanguage } = useLanguage();
    const [translated, setTranslated] = useState(texts);
    const prevLangRef = useRef(currentLanguage);
    const cacheRef = useRef({});

    useEffect(() => {
        if (currentLanguage === 'en') {
            setTranslated(texts);
            return;
        }

        // Check cache first
        const cacheKey = `${JSON.stringify(texts)}_${currentLanguage}`;
        if (cacheRef.current[cacheKey]) {
            setTranslated(cacheRef.current[cacheKey]);
            return;
        }

        const doTranslate = async () => {
            const keys = Object.keys(texts);
            const values = Object.values(texts);

            try {
                const translatedValues = await translateBatch(values, currentLanguage);
                const result = {};
                keys.forEach((key, i) => {
                    result[key] = translatedValues[i];
                });

                cacheRef.current[cacheKey] = result;
                setTranslated(result);
            } catch (error) {
                console.error('Translation error:', error);
                setTranslated(texts);
            }
        };

        doTranslate();
        prevLangRef.current = currentLanguage;
    }, [currentLanguage, texts]);

    return translated;
};

/**
 * Hook for translating a single text
 * @param {string} text - English text to translate
 * @returns {string} - Translated text
 */
export const useTranslation = (text) => {
    const { currentLanguage, translate } = useLanguage();
    const [translated, setTranslated] = useState(text);

    useEffect(() => {
        if (currentLanguage === 'en' || !text) {
            setTranslated(text);
            return;
        }

        let isMounted = true;
        translate(text).then(result => {
            if (isMounted) setTranslated(result);
        });

        return () => { isMounted = false; };
    }, [text, currentLanguage, translate]);

    return translated;
};

export default useTranslations;
