// AI Quiz Generation Service
// Uses Cerebras API with Llama 3.3 70B model for quiz generation

const CEREBRAS_API_KEY = import.meta.env.VITE_CEREBRAS_API_KEY;
const CEREBRAS_MODEL = 'llama-3.3-70b';
const CEREBRAS_API_URL = 'https://api.cerebras.ai/v1/chat/completions';

/**
 * Generates quiz questions for a specific topic using Cerebras AI
 * @param {string} topic - The topic to generate questions for
 * @param {string} context - Additional context (step title, role)
 * @param {number} numQuestions - Number of questions to generate (default: 10)
 * @returns {Promise<Object>} - Quiz object with questions
 */
export const generateTopicQuiz = async (topic, context = '', numQuestions = 10) => {
    try {
        const prompt = `You are an expert quiz creator for tech/programming education. Create exactly ${numQuestions} multiple choice quiz questions about "${topic}" in the context of learning "${context}".

IMPORTANT REQUIREMENTS:
- Generate EXACTLY ${numQuestions} unique questions
- Questions should test practical understanding
- Each question must have exactly 4 options
- Only one correct answer per question
- Include a brief explanation for each answer
- Difficulty distribution: 3 easy, 4 medium, 3 hard

Return ONLY valid JSON (no markdown, no code blocks):
{
  "topic": "${topic}",
  "questions": [
    {
      "id": 1,
      "question": "Your question?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "Why correct",
      "difficulty": "easy"
    }
  ]
}

correctAnswer is 0-based index (0=A, 1=B, 2=C, 3=D). Generate all ${numQuestions} questions:`;

        console.log('Calling Cerebras API with model:', CEREBRAS_MODEL);

        const response = await fetch(CEREBRAS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CEREBRAS_API_KEY}`,
            },
            body: JSON.stringify({
                model: CEREBRAS_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert quiz creator. Always respond with valid JSON only, no markdown.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 8000,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Cerebras API error:', response.status, errorText);
            throw new Error(`Cerebras API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';

        console.log('Cerebras response received, length:', content.length);

        // Parse JSON from response
        let jsonStr = content.trim();

        // Remove markdown code blocks if present
        if (jsonStr.startsWith('```json')) {
            jsonStr = jsonStr.slice(7);
        } else if (jsonStr.startsWith('```')) {
            jsonStr = jsonStr.slice(3);
        }
        if (jsonStr.endsWith('```')) {
            jsonStr = jsonStr.slice(0, -3);
        }
        jsonStr = jsonStr.trim();

        const quiz = JSON.parse(jsonStr);

        console.log('Generated quiz with', quiz.questions?.length, 'questions');

        if (!quiz.questions || quiz.questions.length === 0) {
            throw new Error('No questions generated');
        }

        // Add points based on difficulty
        quiz.questions = quiz.questions.map((q, idx) => ({
            ...q,
            id: idx + 1,
            points: q.difficulty === 'easy' ? 5 : q.difficulty === 'medium' ? 10 : 15,
        }));

        return quiz;
    } catch (error) {
        console.error('Error generating quiz:', error);
        // Return fallback quiz if API fails
        return {
            topic,
            error: true,
            errorMessage: error.message,
            questions: generateFallbackQuestions(topic, numQuestions)
        };
    }
};

/**
 * Generate fallback questions when API fails
 */
const generateFallbackQuestions = (topic, count) => {
    const questions = [];
    const difficulties = ['easy', 'easy', 'easy', 'medium', 'medium', 'medium', 'medium', 'hard', 'hard', 'hard'];

    for (let i = 0; i < count; i++) {
        questions.push({
            id: i + 1,
            question: `Question ${i + 1}: What is an important concept related to ${topic}?`,
            options: [
                'Understanding the fundamentals',
                'Applying best practices',
                'Following industry standards',
                'All of the above'
            ],
            correctAnswer: 3,
            explanation: `All options are important aspects of ${topic}.`,
            difficulty: difficulties[i] || 'medium',
            points: difficulties[i] === 'easy' ? 5 : difficulties[i] === 'hard' ? 15 : 10,
        });
    }
    return questions;
};

/**
 * Calculate score from quiz answers
 * @param {Array} questions - Quiz questions
 * @param {Array} answers - User's answers (indices)
 * @returns {Object} - Score details
 */
export const calculateQuizScore = (questions, answers) => {
    let correctCount = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    questions.forEach((q, i) => {
        totalPoints += q.points || 10;
        if (answers[i] === q.correctAnswer) {
            correctCount++;
            earnedPoints += q.points || 10;
        }
    });

    return {
        correctCount,
        totalQuestions: questions.length,
        percentage: Math.round((correctCount / questions.length) * 100),
        earnedPoints,
        totalPoints,
    };
};
