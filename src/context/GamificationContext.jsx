import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
    getUserGamification,
    initializeUserGamification,
    awardStepCompletion,
    removeStepCompletion,
    awardRoadmapCompletion,
    getUserLevel,
    getLevelProgress,
    BADGES,
} from '../services/gamification';

// Create Gamification Context
const GamificationContext = createContext(null);

// Custom hook to use gamification context
export const useGamification = () => {
    const context = useContext(GamificationContext);
    if (!context) {
        throw new Error('useGamification must be used within a GamificationProvider');
    }
    return context;
};

// Gamification Provider Component
export const GamificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [points, setPoints] = useState(0);
    const [badges, setBadges] = useState([]);
    const [completedSteps, setCompletedSteps] = useState(0);
    const [completedRoadmaps, setCompletedRoadmaps] = useState(0);
    const [loading, setLoading] = useState(true);
    const [recentReward, setRecentReward] = useState(null);

    // Get current level
    const level = getUserLevel(points);
    const levelProgress = getLevelProgress(points);

    // Get full badge objects from IDs
    const earnedBadges = badges.map((badgeId) => {
        return BADGES[badgeId.toUpperCase()] || Object.values(BADGES).find(b => b.id === badgeId);
    }).filter(Boolean);

    // Load user gamification data
    const loadGamificationData = useCallback(async () => {
        if (!user) {
            setPoints(0);
            setBadges([]);
            setCompletedSteps(0);
            setCompletedRoadmaps(0);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = await getUserGamification(user.uid);
            setPoints(data.points || 0);
            setBadges(data.badges || []);
            setCompletedSteps(data.completedSteps || 0);
            setCompletedRoadmaps(data.completedRoadmaps || 0);
        } catch (error) {
            console.error('Error loading gamification data:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Initialize gamification data when user logs in
    useEffect(() => {
        if (user) {
            initializeUserGamification(user.uid).then(() => {
                loadGamificationData();
            });
        } else {
            setLoading(false);
        }
    }, [user, loadGamificationData]);

    // Complete a step and award points
    const completeStep = async (isFirstStep = false) => {
        if (!user) return null;

        try {
            const result = await awardStepCompletion(user.uid, isFirstStep);

            // Update local state
            setPoints(result.totalPoints);
            setCompletedSteps(result.totalSteps);

            if (result.newBadges.length > 0) {
                setBadges((prev) => [...prev, ...result.newBadges.map(b => b.id)]);
                setRecentReward({
                    points: result.pointsAwarded,
                    badges: result.newBadges,
                });
            } else {
                setRecentReward({
                    points: result.pointsAwarded,
                    badges: [],
                });
            }

            // Clear recent reward after 3 seconds
            setTimeout(() => setRecentReward(null), 3000);

            return result;
        } catch (error) {
            console.error('Error completing step:', error);
            return null;
        }
    };

    // Uncomplete a step and remove points
    const uncompleteStep = async () => {
        if (!user) return;

        try {
            await removeStepCompletion(user.uid);
            setPoints((prev) => Math.max(0, prev - 10));
            setCompletedSteps((prev) => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error uncompleting step:', error);
        }
    };

    // Complete a roadmap
    const completeRoadmap = async () => {
        if (!user) return null;

        try {
            const result = await awardRoadmapCompletion(user.uid);

            setPoints(result.totalPoints);
            setCompletedRoadmaps((prev) => prev + 1);

            if (result.newBadges.length > 0) {
                setBadges((prev) => [...prev, ...result.newBadges.map(b => b.id)]);
            }

            setRecentReward({
                points: result.pointsAwarded,
                badges: result.newBadges,
            });

            setTimeout(() => setRecentReward(null), 3000);

            return result;
        } catch (error) {
            console.error('Error completing roadmap:', error);
            return null;
        }
    };

    // Clear recent reward notification
    const clearRecentReward = () => {
        setRecentReward(null);
    };

    const value = {
        points,
        badges,
        earnedBadges,
        completedSteps,
        completedRoadmaps,
        level,
        levelProgress,
        loading,
        recentReward,
        completeStep,
        uncompleteStep,
        completeRoadmap,
        clearRecentReward,
        refreshData: loadGamificationData,
    };

    return (
        <GamificationContext.Provider value={value}>
            {children}
        </GamificationContext.Provider>
    );
};

export default GamificationContext;
