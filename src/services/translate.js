// Google Translate API Service
// Supports 243 languages

const TRANSLATE_API_KEY = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;
const TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2';

// Popular languages first, then alphabetically
export const SUPPORTED_LANGUAGES = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'zh', name: 'Chinese (Simplified)', nativeName: '中文' },
    { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語' },
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano' },
    { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
    { code: 'pl', name: 'Polish', nativeName: 'Polski' },
    { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
    { code: 'th', name: 'Thai', nativeName: 'ไทย' },
    { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
    { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
    { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu' },
    { code: 'uk', name: 'Ukrainian', nativeName: 'Українська' },
    { code: 'el', name: 'Greek', nativeName: 'Ελληνικά' },
    { code: 'he', name: 'Hebrew', nativeName: 'עברית' },
    { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
    { code: 'da', name: 'Danish', nativeName: 'Dansk' },
    { code: 'no', name: 'Norwegian', nativeName: 'Norsk' },
    { code: 'fi', name: 'Finnish', nativeName: 'Suomi' },
    { code: 'cs', name: 'Czech', nativeName: 'Čeština' },
    { code: 'hu', name: 'Hungarian', nativeName: 'Magyar' },
    { code: 'ro', name: 'Romanian', nativeName: 'Română' },
    { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina' },
    { code: 'bg', name: 'Bulgarian', nativeName: 'Български' },
    { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski' },
    { code: 'sr', name: 'Serbian', nativeName: 'Српски' },
    { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina' },
    { code: 'et', name: 'Estonian', nativeName: 'Eesti' },
    { code: 'lv', name: 'Latvian', nativeName: 'Latviešu' },
    { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių' },
    { code: 'fa', name: 'Persian', nativeName: 'فارسی' },
    { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
    { code: 'ne', name: 'Nepali', nativeName: 'नेपाली' },
    { code: 'si', name: 'Sinhala', nativeName: 'සිංහල' },
    { code: 'my', name: 'Myanmar (Burmese)', nativeName: 'မြန်မာ' },
    { code: 'km', name: 'Khmer', nativeName: 'ខ្មែរ' },
    { code: 'lo', name: 'Lao', nativeName: 'ລາວ' },
    { code: 'am', name: 'Amharic', nativeName: 'አማርኛ' },
    { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
    { code: 'zu', name: 'Zulu', nativeName: 'isiZulu' },
    { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans' },
    { code: 'sq', name: 'Albanian', nativeName: 'Shqip' },
    { code: 'hy', name: 'Armenian', nativeName: 'Հայերdelays' },
    { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan' },
    { code: 'eu', name: 'Basque', nativeName: 'Euskara' },
    { code: 'be', name: 'Belarusian', nativeName: 'Беларуская' },
    { code: 'bs', name: 'Bosnian', nativeName: 'Bosanski' },
    { code: 'ca', name: 'Catalan', nativeName: 'Català' },
    { code: 'ceb', name: 'Cebuano', nativeName: 'Cebuano' },
    { code: 'ny', name: 'Chichewa', nativeName: 'Chichewa' },
    { code: 'co', name: 'Corsican', nativeName: 'Corsu' },
    { code: 'eo', name: 'Esperanto', nativeName: 'Esperanto' },
    { code: 'tl', name: 'Filipino', nativeName: 'Filipino' },
    { code: 'fy', name: 'Frisian', nativeName: 'Frysk' },
    { code: 'gl', name: 'Galician', nativeName: 'Galego' },
    { code: 'ka', name: 'Georgian', nativeName: 'ქართული' },
    { code: 'ht', name: 'Haitian Creole', nativeName: 'Kreyòl Ayisyen' },
    { code: 'ha', name: 'Hausa', nativeName: 'Hausa' },
    { code: 'haw', name: 'Hawaiian', nativeName: 'ʻŌlelo Hawaiʻi' },
    { code: 'hmn', name: 'Hmong', nativeName: 'Hmong' },
    { code: 'is', name: 'Icelandic', nativeName: 'Íslenska' },
    { code: 'ig', name: 'Igbo', nativeName: 'Igbo' },
    { code: 'ga', name: 'Irish', nativeName: 'Gaeilge' },
    { code: 'jw', name: 'Javanese', nativeName: 'Basa Jawa' },
    { code: 'kk', name: 'Kazakh', nativeName: 'Қазақ' },
    { code: 'rw', name: 'Kinyarwanda', nativeName: 'Kinyarwanda' },
    { code: 'ku', name: 'Kurdish', nativeName: 'Kurdî' },
    { code: 'ky', name: 'Kyrgyz', nativeName: 'Кыргызча' },
    { code: 'la', name: 'Latin', nativeName: 'Latina' },
    { code: 'lb', name: 'Luxembourgish', nativeName: 'Lëtzebuergesch' },
    { code: 'mk', name: 'Macedonian', nativeName: 'Македонски' },
    { code: 'mg', name: 'Malagasy', nativeName: 'Malagasy' },
    { code: 'mt', name: 'Maltese', nativeName: 'Malti' },
    { code: 'mi', name: 'Maori', nativeName: 'Māori' },
    { code: 'mn', name: 'Mongolian', nativeName: 'Монгол' },
    { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
    { code: 'ps', name: 'Pashto', nativeName: 'پښتو' },
    { code: 'sm', name: 'Samoan', nativeName: 'Gagana Samoa' },
    { code: 'gd', name: 'Scots Gaelic', nativeName: 'Gàidhlig' },
    { code: 'st', name: 'Sesotho', nativeName: 'Sesotho' },
    { code: 'sn', name: 'Shona', nativeName: 'Shona' },
    { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي' },
    { code: 'so', name: 'Somali', nativeName: 'Soomaali' },
    { code: 'su', name: 'Sundanese', nativeName: 'Basa Sunda' },
    { code: 'tg', name: 'Tajik', nativeName: 'Тоҷикӣ' },
    { code: 'tt', name: 'Tatar', nativeName: 'Татар' },
    { code: 'tk', name: 'Turkmen', nativeName: 'Türkmen' },
    { code: 'ug', name: 'Uyghur', nativeName: 'ئۇيغۇرچە' },
    { code: 'uz', name: 'Uzbek', nativeName: 'Oʻzbek' },
    { code: 'cy', name: 'Welsh', nativeName: 'Cymraeg' },
    { code: 'xh', name: 'Xhosa', nativeName: 'isiXhosa' },
    { code: 'yi', name: 'Yiddish', nativeName: 'ייִדיש' },
    { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá' },
];

// Cache for translations to avoid duplicate API calls
const translationCache = new Map();

/**
 * Translate a single text to target language
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language code
 * @returns {Promise<string>} - Translated text
 */
export const translateText = async (text, targetLang) => {
    if (!text || targetLang === 'en') return text;

    const cacheKey = `${text}_${targetLang}`;
    if (translationCache.has(cacheKey)) {
        return translationCache.get(cacheKey);
    }

    try {
        const response = await fetch(`${TRANSLATE_API_URL}?key=${TRANSLATE_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                q: text,
                target: targetLang,
                source: 'en',
            }),
        });

        if (!response.ok) {
            console.error('Translation API error:', response.status);
            return text;
        }

        const data = await response.json();
        const translated = data.data?.translations?.[0]?.translatedText || text;

        translationCache.set(cacheKey, translated);
        return translated;
    } catch (error) {
        console.error('Translation error:', error);
        return text;
    }
};

/**
 * Translate multiple texts at once (batch)
 * @param {string[]} texts - Array of texts to translate
 * @param {string} targetLang - Target language code
 * @returns {Promise<string[]>} - Array of translated texts
 */
export const translateBatch = async (texts, targetLang) => {
    if (!texts?.length || targetLang === 'en') return texts;

    // Check cache first
    const results = [];
    const textsToTranslate = [];
    const indices = [];

    texts.forEach((text, i) => {
        const cacheKey = `${text}_${targetLang}`;
        if (translationCache.has(cacheKey)) {
            results[i] = translationCache.get(cacheKey);
        } else {
            textsToTranslate.push(text);
            indices.push(i);
        }
    });

    if (textsToTranslate.length === 0) return results;

    try {
        const response = await fetch(`${TRANSLATE_API_URL}?key=${TRANSLATE_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                q: textsToTranslate,
                target: targetLang,
                source: 'en',
            }),
        });

        if (!response.ok) {
            console.error('Translation API error:', response.status);
            indices.forEach((idx, i) => {
                results[idx] = textsToTranslate[i];
            });
            return results;
        }

        const data = await response.json();
        const translations = data.data?.translations || [];

        translations.forEach((t, i) => {
            const originalIndex = indices[i];
            const translated = t.translatedText || textsToTranslate[i];
            results[originalIndex] = translated;
            translationCache.set(`${textsToTranslate[i]}_${targetLang}`, translated);
        });

        return results;
    } catch (error) {
        console.error('Batch translation error:', error);
        return texts;
    }
};

/**
 * Clear translation cache
 */
export const clearTranslationCache = () => {
    translationCache.clear();
};
