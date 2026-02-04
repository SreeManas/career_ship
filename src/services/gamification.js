import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    arrayUnion,
    increment,
} from 'firebase/firestore';
import { db } from './firebase';

// Points configuration
export const POINTS_CONFIG = {
    COMPLETE_STEP: 10,
    COMPLETE_ROADMAP: 50,
    FIRST_STEP: 5,
    STREAK_BONUS: 15,
};

// Badge definitions
export const BADGES = {
    FIRST_STEP: {
        id: 'first_step',
        name: 'First Step',
        description: 'Completed your first learning step',
        icon: '🎯',
        color: '#10b981',
        requirement: { type: 'steps', count: 1 },
    },
    STARTER: {
        id: 'starter',
        name: 'Getting Started',
        description: 'Completed 5 learning steps',
        icon: '🌱',
        color: '#34d399',
        requirement: { type: 'steps', count: 5 },
    },
    DEDICATED: {
        id: 'dedicated',
        name: 'Dedicated Learner',
        description: 'Completed 10 learning steps',
        icon: '📚',
        color: '#6366f1',
        requirement: { type: 'steps', count: 10 },
    },
    ACHIEVER: {
        id: 'achiever',
        name: 'High Achiever',
        description: 'Completed 25 learning steps',
        icon: '🏆',
        color: '#f59e0b',
        requirement: { type: 'steps', count: 25 },
    },
    MASTER: {
        id: 'master',
        name: 'Learning Master',
        description: 'Completed 50 learning steps',
        icon: '👑',
        color: '#ec4899',
        requirement: { type: 'steps', count: 50 },
    },
    POINTS_50: {
        id: 'points_50',
        name: 'Point Collector',
        description: 'Earned 50 points',
        icon: '⭐',
        color: '#fbbf24',
        requirement: { type: 'points', count: 50 },
    },
    POINTS_100: {
        id: 'points_100',
        name: 'Century Club',
        description: 'Earned 100 points',
        icon: '💯',
        color: '#f472b6',
        requirement: { type: 'points', count: 100 },
    },
    POINTS_250: {
        id: 'points_250',
        name: 'Point Champion',
        description: 'Earned 250 points',
        icon: '🌟',
        color: '#8b5cf6',
        requirement: { type: 'points', count: 250 },
    },
    POINTS_500: {
        id: 'points_500',
        name: 'Point Legend',
        description: 'Earned 500 points',
        icon: '💎',
        color: '#06b6d4',
        requirement: { type: 'points', count: 500 },
    },
    ROADMAP_COMPLETE: {
        id: 'roadmap_complete',
        name: 'Roadmap Champion',
        description: 'Completed an entire learning roadmap',
        icon: '🗺️',
        color: '#14b8a6',
        requirement: { type: 'roadmap', count: 1 },
    },
};

// Level configuration
export const LEVELS = [
    { level: 1, name: 'Beginner', minPoints: 0, maxPoints: 49, color: '#94a3b8' },
    { level: 2, name: 'Learner', minPoints: 50, maxPoints: 99, color: '#10b981' },
    { level: 3, name: 'Student', minPoints: 100, maxPoints: 199, color: '#3b82f6' },
    { level: 4, name: 'Scholar', minPoints: 200, maxPoints: 349, color: '#8b5cf6' },
    { level: 5, name: 'Expert', minPoints: 350, maxPoints: 499, color: '#f59e0b' },
    { level: 6, name: 'Master', minPoints: 500, maxPoints: 749, color: '#ec4899' },
    { level: 7, name: 'Grandmaster', minPoints: 750, maxPoints: 999, color: '#ef4444' },
    { level: 8, name: 'Legend', minPoints: 1000, maxPoints: Infinity, color: '#fbbf24' },
];

// Get user level based on points
export const getUserLevel = (points) => {
    return LEVELS.find((l) => points >= l.minPoints && points <= l.maxPoints) || LEVELS[0];
};

// Get progress to next level
export const getLevelProgress = (points) => {
    const currentLevel = getUserLevel(points);
    const nextLevel = LEVELS.find((l) => l.level === currentLevel.level + 1);

    if (!nextLevel) {
        return { percentage: 100, pointsToNext: 0 };
    }

    const pointsInLevel = points - currentLevel.minPoints;
    const levelRange = nextLevel.minPoints - currentLevel.minPoints;
    const percentage = Math.round((pointsInLevel / levelRange) * 100);
    const pointsToNext = nextLevel.minPoints - points;

    return { percentage, pointsToNext, nextLevel };
};

// Initialize user gamification data
export const initializeUserGamification = async (userId) => {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
        await setDoc(userRef, {
            points: 0,
            badges: [],
            completedSteps: 0,
            completedRoadmaps: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
        return {
            points: 0,
            badges: [],
            completedSteps: 0,
            completedRoadmaps: 0,
        };
    }

    return userDoc.data();
};

// Get user gamification data
export const getUserGamification = async (userId) => {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
        return initializeUserGamification(userId);
    }

    return userDoc.data();
};

// Check and award badges based on current stats
const checkAndAwardBadges = (currentData, newPoints, newSteps, newRoadmaps) => {
    const currentBadges = currentData.badges || [];
    const newBadges = [];

    Object.values(BADGES).forEach((badge) => {
        // Skip if already earned
        if (currentBadges.includes(badge.id)) return;

        let earned = false;

        switch (badge.requirement.type) {
            case 'steps':
                earned = newSteps >= badge.requirement.count;
                break;
            case 'points':
                earned = newPoints >= badge.requirement.count;
                break;
            case 'roadmap':
                earned = newRoadmaps >= badge.requirement.count;
                break;
        }

        if (earned) {
            newBadges.push(badge.id);
        }
    });

    return newBadges;
};

// Award points for completing a step
export const awardStepCompletion = async (userId, isFirstStep = false) => {
    const userRef = doc(db, 'users', userId);

    // Get current data first
    const userDoc = await getDoc(userRef);
    const currentData = userDoc.exists() ? userDoc.data() : await initializeUserGamification(userId);

    // Calculate new values
    const pointsToAdd = POINTS_CONFIG.COMPLETE_STEP + (isFirstStep ? POINTS_CONFIG.FIRST_STEP : 0);
    const newPoints = (currentData.points || 0) + pointsToAdd;
    const newSteps = (currentData.completedSteps || 0) + 1;
    const newRoadmaps = currentData.completedRoadmaps || 0;

    // Check for new badges
    const newBadges = checkAndAwardBadges(currentData, newPoints, newSteps, newRoadmaps);

    // Update Firestore
    const updateData = {
        points: increment(pointsToAdd),
        completedSteps: increment(1),
        updatedAt: new Date().toISOString(),
    };

    if (newBadges.length > 0) {
        updateData.badges = arrayUnion(...newBadges);
    }

    await updateDoc(userRef, updateData);

    return {
        pointsAwarded: pointsToAdd,
        newBadges: newBadges.map((id) => BADGES[id.toUpperCase()] || Object.values(BADGES).find(b => b.id === id)),
        totalPoints: newPoints,
        totalSteps: newSteps,
    };
};

// Remove points when unmarking a step
export const removeStepCompletion = async (userId) => {
    const userRef = doc(db, 'users', userId);

    await updateDoc(userRef, {
        points: increment(-POINTS_CONFIG.COMPLETE_STEP),
        completedSteps: increment(-1),
        updatedAt: new Date().toISOString(),
    });
};

// Award points for completing entire roadmap
export const awardRoadmapCompletion = async (userId) => {
    const userRef = doc(db, 'users', userId);

    // Get current data first
    const userDoc = await getDoc(userRef);
    const currentData = userDoc.exists() ? userDoc.data() : await initializeUserGamification(userId);

    // Calculate new values
    const newPoints = (currentData.points || 0) + POINTS_CONFIG.COMPLETE_ROADMAP;
    const newSteps = currentData.completedSteps || 0;
    const newRoadmaps = (currentData.completedRoadmaps || 0) + 1;

    // Check for new badges
    const newBadges = checkAndAwardBadges(currentData, newPoints, newSteps, newRoadmaps);

    // Update Firestore
    const updateData = {
        points: increment(POINTS_CONFIG.COMPLETE_ROADMAP),
        completedRoadmaps: increment(1),
        updatedAt: new Date().toISOString(),
    };

    if (newBadges.length > 0) {
        updateData.badges = arrayUnion(...newBadges);
    }

    await updateDoc(userRef, updateData);

    return {
        pointsAwarded: POINTS_CONFIG.COMPLETE_ROADMAP,
        newBadges: newBadges.map((id) => BADGES[id.toUpperCase()] || Object.values(BADGES).find(b => b.id === id)),
        totalPoints: newPoints,
    };
};
