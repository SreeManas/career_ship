// Learning Resources Service
// Uses YouTube Data API for video recommendations
// Uses Gemini API for website recommendations AND to generate better search queries

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.0-flash';

/**
 * Use Gemini to generate an optimized YouTube search query
 * @param {string} topic - The learning topic
 * @param {string} context - Additional context like role/step name
 * @param {string} language - Language code (en, hi, es, etc.)
 * @returns {Promise<string>} - Optimized search query
 */
const generateSearchQuery = async (topic, context, language = 'en') => {
    try {
        // Language-specific instructions
        const languageNames = {
            en: 'English',
            hi: 'Hindi',
            es: 'Spanish',
            fr: 'French',
            de: 'German',
            zh: 'Chinese',
            ja: 'Japanese',
            ko: 'Korean',
            pt: 'Portuguese',
            ru: 'Russian',
            ar: 'Arabic',
            ta: 'Tamil',
            te: 'Telugu',
            kn: 'Kannada',
            ml: 'Malayalam',
            bn: 'Bengali',
            mr: 'Marathi',
            gu: 'Gujarati',
            pa: 'Punjabi'
        };
        const languageName = languageNames[language] || 'English';
        const isNonEnglish = language !== 'en';

        const prompt = `You are a search query optimizer. Generate the BEST YouTube search query to find an educational tutorial video about:

Topic: "${topic}"
Context: "${context}" (this is a learning roadmap step for this career path)
${isNonEnglish ? `IMPORTANT: The user wants to learn in ${languageName}. Include "${languageName}" or "in ${languageName}" in the query to find ${languageName} language tutorials.` : ''}

Requirements:
- The query should find PROGRAMMING/TECH educational content
${isNonEnglish ? `- MUST find ${languageName} language tutorials/videos` : ''}
- NOT music, gaming, or entertainment
- Should find tutorials, courses, or educational explanations
- Be specific enough to get relevant results

Return ONLY the search query text, nothing else. No quotes, no explanation.
${isNonEnglish ? `Example output: javascript tutorial in ${languageName} beginners` : 'Example output: kubernetes pods tutorial for beginners devops'}`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.2, maxOutputTokens: 100 }
            }),
        });

        if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);

        const data = await response.json();
        const query = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
        return query || `${topic} ${context} programming tutorial ${language !== 'en' ? languageNames[language] : ''}`;
    } catch (error) {
        console.error('Error generating search query:', error);
        const languageNames = { en: '', hi: 'Hindi', es: 'Spanish', fr: 'French', de: 'German' };
        return `${topic} ${context} programming tutorial ${languageNames[language] || ''}`;
    }
};

/**
 * Fetches the top YouTube video for a given topic using AI-generated query
 * @param {string} topic - The learning topic to search for
 * @param {string} context - Additional context like role/step name for better relevance
 * @param {string} language - Language code for getting videos in user's preferred language
 * @returns {Promise<Object>} - Video details with title, url, thumbnail, etc.
 */
export const getTopYouTubeVideo = async (topic, context = '', language = 'en') => {
    try {
        // Use Gemini to generate an optimized search query with language
        const searchQuery = await generateSearchQuery(topic, context, language);
        console.log('YouTube search query:', searchQuery, 'Language:', language);

        // Map language codes to YouTube relevance language parameter
        const youtubeLanguageMap = {
            en: 'en', hi: 'hi', es: 'es', fr: 'fr', de: 'de',
            zh: 'zh', ja: 'ja', ko: 'ko', pt: 'pt', ru: 'ru',
            ar: 'ar', ta: 'ta', te: 'te', kn: 'kn', ml: 'ml',
            bn: 'bn', mr: 'mr', gu: 'gu', pa: 'pa'
        };
        const ytLang = youtubeLanguageMap[language] || 'en';

        // Search YouTube with language preference
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&order=relevance&maxResults=5&relevanceLanguage=${ytLang}&key=${YOUTUBE_API_KEY}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`YouTube API error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            return null;
        }

        // Filter and rank videos by educational keywords
        const educationalKeywords = ['tutorial', 'learn', 'course', 'guide', 'how to', 'explained', 'introduction', 'beginner', 'basics', 'crash course', 'programming', 'coding', 'development'];
        const badKeywords = ['music', 'song', 'beat', 'remix', 'gameplay', 'gaming', 'movie', 'trailer', 'vlog'];

        let bestVideo = null;
        let bestScore = -1;

        for (const video of data.items) {
            const title = video.snippet.title.toLowerCase();
            const desc = video.snippet.description.toLowerCase();
            const channel = video.snippet.channelTitle.toLowerCase();
            const combined = title + ' ' + desc + ' ' + channel;

            // Skip videos with bad keywords
            if (badKeywords.some(kw => combined.includes(kw))) {
                continue;
            }

            // Score based on educational keywords
            let score = 0;
            for (const kw of educationalKeywords) {
                if (combined.includes(kw)) score += 2;
                if (title.includes(kw)) score += 3; // Title match is worth more
            }

            // Bonus for matching the topic in title
            if (title.includes(topic.toLowerCase().split(' ')[0])) {
                score += 5;
            }

            if (score > bestScore) {
                bestScore = score;
                bestVideo = video;
            }
        }

        // Fallback to first result if no good match found
        if (!bestVideo) {
            bestVideo = data.items[0];
        }

        return {
            title: bestVideo.snippet.title,
            videoId: bestVideo.id.videoId,
            url: `https://www.youtube.com/watch?v=${bestVideo.id.videoId}`,
            thumbnail: bestVideo.snippet.thumbnails.high?.url || bestVideo.snippet.thumbnails.medium?.url,
            channelTitle: bestVideo.snippet.channelTitle,
            description: bestVideo.snippet.description.slice(0, 150) + '...',
        };
    } catch (error) {
        console.error('Error fetching YouTube video:', error);
        return null;
    }
};

/**
 * Gets recommended learning websites from Gemini AI
 * @param {string} topic - The learning topic
 * @param {string} context - Additional context like role for better recommendations
 * @returns {Promise<Array>} - Array of recommended websites
 */
export const getRecommendedWebsites = async (topic, context = '') => {
    try {
        const prompt = `You are a learning resource expert. I need the 3 BEST free online resources to learn about "${topic}" in the context of "${context}" (a tech/programming career path).

Return ONLY a valid JSON array with this exact format, no markdown, no explanation:
[
  {"name": "Resource Name", "url": "https://actual-url.com/specific-page", "description": "Why this is great for learning this topic"},
  {"name": "Resource Name", "url": "https://actual-url.com/specific-page", "description": "Why this is great for learning this topic"},
  {"name": "Resource Name", "url": "https://actual-url.com/specific-page", "description": "Why this is great for learning this topic"}
]

Requirements:
- MUST be programming/tech related resources
- Use REAL, working URLs (not generic homepages when possible)
- Include official documentation, MDN, freeCodeCamp, DigitalOcean, dev.to, Coursera, or other reputable tech sites
- Be SPECIFIC to the topic, not just general learning platforms`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.3, maxOutputTokens: 600 }
            }),
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        // Parse JSON from response (handle potential markdown wrapping)
        let jsonStr = text.trim();
        if (jsonStr.startsWith('```')) {
            jsonStr = jsonStr.replace(/```json?\n?/g, '').replace(/```/g, '');
        }

        const websites = JSON.parse(jsonStr);
        return websites;
    } catch (error) {
        console.error('Error fetching Gemini recommendations:', error);
        // Return fallback resources with topic-specific searches
        const searchTopic = `${topic} ${context}`.trim();
        return [
            { name: 'Google Search', url: `https://www.google.com/search?q=learn+${encodeURIComponent(searchTopic)}+programming+tutorial`, description: 'Search for programming tutorials' },
            { name: 'YouTube', url: `https://www.youtube.com/results?search_query=${encodeURIComponent(searchTopic)}+programming+tutorial`, description: 'Video tutorials and courses' },
            { name: 'Stack Overflow', url: `https://stackoverflow.com/search?q=${encodeURIComponent(searchTopic)}`, description: 'Q&A for developers' },
        ];
    }
};

/**
 * Fetches all learning resources for a topic (video + websites)
 * @param {string} topic - The learning topic
 * @param {string} context - Additional context (role, step title) for better relevance
 * @param {string} language - Language code for getting videos in user's preferred language
 * @returns {Promise<Object>} - Combined resources object
 */
export const getLearningResources = async (topic, context = '', language = 'en') => {
    const [video, websites] = await Promise.all([
        getTopYouTubeVideo(topic, context, language),
        getRecommendedWebsites(topic, context),
    ]);

    return {
        video,
        websites,
        topic,
        context,
        language,
        fetchedAt: new Date().toISOString(),
    };
};
