import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    setDoc,
    query,
    orderBy,
    limit,
    where,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// Daily check-in questions pool
export const DAILY_QUESTIONS = [
    {
        id: 'mood_1',
        type: 'mood',
        question: 'How confident do you feel about your learning progress?',
        options: [
            { value: 1, label: '😔', description: 'Struggling' },
            { value: 2, label: '😐', description: 'Neutral' },
            { value: 3, label: '🙂', description: 'Good' },
            { value: 4, label: '😊', description: 'Confident' },
            { value: 5, label: '🚀', description: 'Excellent' },
        ],
    },
    {
        id: 'goal_1',
        type: 'goal',
        question: 'What\'s your main learning goal for today?',
        options: [
            { value: 'review', label: '📖', description: 'Review previous material' },
            { value: 'new', label: '🆕', description: 'Learn something new' },
            { value: 'practice', label: '💪', description: 'Practice skills' },
            { value: 'project', label: '🏗️', description: 'Work on a project' },
        ],
    },
    {
        id: 'time_1',
        type: 'time',
        question: 'How much time can you dedicate to learning today?',
        options: [
            { value: 15, label: '⏱️', description: '15 minutes' },
            { value: 30, label: '⏰', description: '30 minutes' },
            { value: 60, label: '🕐', description: '1 hour' },
            { value: 120, label: '🕑', description: '2+ hours' },
        ],
    },
    {
        id: 'challenge_1',
        type: 'challenge',
        question: 'What\'s been your biggest learning challenge this week?',
        options: [
            { value: 'motivation', label: '💭', description: 'Staying motivated' },
            { value: 'time', label: '⏳', description: 'Finding time' },
            { value: 'difficulty', label: '🧩', description: 'Material is difficult' },
            { value: 'resources', label: '📚', description: 'Finding good resources' },
        ],
    },
];

// Encouraging messages based on check-in history
export const ENCOURAGEMENT_MESSAGES = {
    streak: [
        '🔥 You\'re on fire! Keep up the great work!',
        '⚡ Amazing consistency! You\'re building great habits!',
        '🌟 Your dedication is inspiring!',
    ],
    improvement: [
        '📈 Your confidence is growing! Keep pushing!',
        '💪 You\'re getting stronger every day!',
        '🎯 Progress is progress, no matter how small!',
    ],
    comeback: [
        '👋 Welcome back! Every day is a new opportunity!',
        '🌅 Great to see you again! Let\'s make today count!',
        '💫 You\'re back on track! That takes courage!',
    ],
    firstTime: [
        '🎉 Welcome to your learning journey!',
        '🚀 Excited to have you here! Let\'s grow together!',
        '✨ The first step is always the most important!',
    ],
};

// Get today's date string (YYYY-MM-DD)
export const getTodayString = () => {
    return new Date().toISOString().split('T')[0];
};

// Check if user has checked in today
export const hasCheckedInToday = async (userId) => {
    const today = getTodayString();
    const checkInRef = doc(db, 'users', userId, 'dailyChecks', today);
    const checkInDoc = await getDoc(checkInRef);
    return checkInDoc.exists();
};

// Get today's question (rotates based on day of week)
export const getTodayQuestion = () => {
    const dayOfWeek = new Date().getDay();
    return DAILY_QUESTIONS[dayOfWeek % DAILY_QUESTIONS.length];
};

// Save daily check-in
export const saveDailyCheckIn = async (userId, questionId, answer) => {
    const today = getTodayString();
    const checkInRef = doc(db, 'users', userId, 'dailyChecks', today);

    await setDoc(checkInRef, {
        date: today,
        questionId,
        answer,
        createdAt: serverTimestamp(),
    });

    return { date: today, questionId, answer };
};

// Get check-in history
export const getCheckInHistory = async (userId, days = 7) => {
    const checkInsRef = collection(db, 'users', userId, 'dailyChecks');
    const q = query(checkInsRef, orderBy('date', 'desc'), limit(days));

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
};

// Calculate check-in streak
export const calculateStreak = async (userId) => {
    const history = await getCheckInHistory(userId, 30);

    if (history.length === 0) return 0;

    let streak = 0;
    const today = new Date();

    for (let i = 0; i < history.length; i++) {
        const checkDate = new Date(history[i].date);
        const expectedDate = new Date(today);
        expectedDate.setDate(expectedDate.getDate() - i);

        if (checkDate.toISOString().split('T')[0] === expectedDate.toISOString().split('T')[0]) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
};

// Get personalized encouragement message
export const getEncouragementMessage = (streak, isFirstTime) => {
    if (isFirstTime) {
        const messages = ENCOURAGEMENT_MESSAGES.firstTime;
        return messages[Math.floor(Math.random() * messages.length)];
    }

    if (streak >= 3) {
        const messages = ENCOURAGEMENT_MESSAGES.streak;
        return messages[Math.floor(Math.random() * messages.length)];
    }

    if (streak === 0) {
        const messages = ENCOURAGEMENT_MESSAGES.comeback;
        return messages[Math.floor(Math.random() * messages.length)];
    }

    const messages = ENCOURAGEMENT_MESSAGES.improvement;
    return messages[Math.floor(Math.random() * messages.length)];
};
