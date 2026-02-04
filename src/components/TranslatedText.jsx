import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

/**
 * Component that automatically translates its children text
 * @param {string} children - Text to translate
 * @param {string} component - Optional wrapper component (default: span)
 */
const TranslatedText = ({ children, component: Component = 'span', ...props }) => {
    const { currentLanguage, translate } = useLanguage();
    const [translatedText, setTranslatedText] = useState(children);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (currentLanguage === 'en') {
            setTranslatedText(children);
            return;
        }

        let isMounted = true;
        setIsLoading(true);

        const doTranslate = async () => {
            try {
                const result = await translate(children);
                if (isMounted) {
                    setTranslatedText(result);
                }
            } catch (error) {
                console.error('Translation error:', error);
                if (isMounted) {
                    setTranslatedText(children);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        doTranslate();

        return () => {
            isMounted = false;
        };
    }, [children, currentLanguage, translate]);

    return (
        <Component {...props} style={{ opacity: isLoading ? 0.7 : 1, transition: 'opacity 0.2s' }}>
            {translatedText}
        </Component>
    );
};

export default TranslatedText;
