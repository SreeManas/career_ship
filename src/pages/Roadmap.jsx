import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Fade,
    LinearProgress,
    Chip,
    Paper,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Refresh as RefreshIcon,
    Download as DownloadIcon,
    Share as ShareIcon,
    EmojiEvents as TrophyIcon,
    LocalFireDepartment as FireIcon,
    Quiz as QuizIcon,
} from '@mui/icons-material';
import RoadmapCard from '../components/RoadmapCard';
import { getRoadmap, getRoleName, getSkillLevelName } from '../services/roadmapData';
import { useGamification } from '../context/GamificationContext';
import { useTranslations } from '../hooks/useTranslations';

const TEXTS = {
    generatingRoadmap: 'Generating Your Roadmap',
    craftingPath: 'Crafting a personalized learning path just for you...',
    yourRoadmap: 'Your Learning Roadmap',
    level: 'Level',
    back: 'Back',
    complete: 'Complete',
    progress: 'Progress',
    stepsCompleted: 'steps completed',
    takeQuiz: 'Take Quiz',
    testYourKnowledge: 'Test your knowledge',
    congratulations: 'Congratulations!',
    completedRoadmap: "You've completed all steps in your roadmap!",
};

const Roadmap = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { role, skillLevel } = location.state || {};
    const { completeStep, uncompleteStep, completeRoadmap, completedSteps } = useGamification();
    const t = useTranslations(TEXTS);

    const [roadmapSteps, setRoadmapSteps] = useState([]);
    const [completedStepsLocal, setCompletedStepsLocal] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasAwardedCompletion, setHasAwardedCompletion] = useState(false);
    const previousCompletedRef = useRef([]);

    useEffect(() => {
        if (!role || !skillLevel) {
            navigate('/home');
            return;
        }

        // Simulate loading
        setIsLoading(true);
        const timer = setTimeout(() => {
            const steps = getRoadmap(role, skillLevel);
            setRoadmapSteps(steps);
            setCompletedStepsLocal(new Array(steps.length).fill(false));
            previousCompletedRef.current = new Array(steps.length).fill(false);
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [role, skillLevel, navigate]);

    // Check for roadmap completion
    useEffect(() => {
        const allCompleted = completedStepsLocal.length > 0 && completedStepsLocal.every(Boolean);
        if (allCompleted && !hasAwardedCompletion) {
            setHasAwardedCompletion(true);
            completeRoadmap();
        }
    }, [completedStepsLocal, hasAwardedCompletion, completeRoadmap]);

    const handleToggleComplete = async (index) => {
        const wasCompleted = completedStepsLocal[index];
        const isFirstEverStep = completedSteps === 0 && !wasCompleted;

        setCompletedStepsLocal((prev) => {
            const newCompleted = [...prev];
            newCompleted[index] = !newCompleted[index];
            return newCompleted;
        });

        // Award or remove points
        if (!wasCompleted) {
            // Marking as complete - award points
            await completeStep(isFirstEverStep);
        } else {
            // Unmarking - remove points
            await uncompleteStep();
        }
    };

    const handleReset = () => {
        // Reset local state only - don't affect Firestore points
        setCompletedStepsLocal(new Array(roadmapSteps.length).fill(false));
        setHasAwardedCompletion(false);
    };

    const completedCount = completedStepsLocal.filter(Boolean).length;
    const progressPercentage = roadmapSteps.length > 0
        ? Math.round((completedCount / roadmapSteps.length) * 100)
        : 0;

    if (isLoading) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    backgroundColor: 'background.default',
                }}
            >
                <Box
                    sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                        animation: 'pulse 1.5s infinite',
                        '@keyframes pulse': {
                            '0%': { transform: 'scale(1)', opacity: 1 },
                            '50%': { transform: 'scale(1.1)', opacity: 0.7 },
                            '100%': { transform: 'scale(1)', opacity: 1 },
                        },
                    }}
                >
                    <FireIcon sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                    {t.generatingRoadmap}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    {t.craftingPath}
                </Typography>
                <Box sx={{ width: 200 }}>
                    <LinearProgress
                        sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                                borderRadius: 3,
                                background: 'linear-gradient(90deg, #6366f1 0%, #ec4899 100%)',
                            },
                        }}
                    />
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', pb: 6 }}>
            {/* Header Section */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
                    pt: 4,
                    pb: 8,
                    color: 'white',
                }}
            >
                <Container maxWidth="lg">
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/home')}
                        sx={{
                            color: 'white',
                            mb: 3,
                            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                        }}
                    >
                        Back to Home
                    </Button>

                    <Fade in timeout={600}>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Chip
                                    label={getSkillLevelName(skillLevel)}
                                    size="small"
                                    sx={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                        color: 'white',
                                        fontWeight: 600,
                                    }}
                                />
                                <Chip
                                    label={`${roadmapSteps.length} Steps`}
                                    size="small"
                                    sx={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                        color: 'white',
                                        fontWeight: 600,
                                    }}
                                />
                                <Chip
                                    label={`+${roadmapSteps.length * 10} Points Available`}
                                    size="small"
                                    sx={{
                                        backgroundColor: 'rgba(251, 191, 36, 0.3)',
                                        color: 'white',
                                        fontWeight: 600,
                                    }}
                                />
                            </Box>

                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 800,
                                    mb: 1,
                                    fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
                                }}
                            >
                                {getRoleName(role)} Roadmap
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{ opacity: 0.9, fontWeight: 400, maxWidth: 600 }}
                            >
                                Your personalized learning path from {getSkillLevelName(skillLevel).toLowerCase()} to mastery
                            </Typography>
                        </Box>
                    </Fade>
                </Container>
            </Box>

            {/* Progress Card */}
            <Container maxWidth="lg" sx={{ mt: -4, position: 'relative', zIndex: 2 }}>
                <Fade in timeout={800}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            mb: 4,
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'stretch', sm: 'center' },
                            gap: 3,
                            backgroundColor: 'white',
                            boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
                            border: '1px solid',
                            borderColor: 'grey.100',
                        }}
                    >
                        {/* Progress Info */}
                        <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 2,
                                        background: progressPercentage === 100
                                            ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'
                                            : 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {progressPercentage === 100 ? (
                                        <TrophyIcon sx={{ color: 'white', fontSize: 24 }} />
                                    ) : (
                                        <FireIcon sx={{ color: 'white', fontSize: 24 }} />
                                    )}
                                </Box>
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                        {progressPercentage}% Complete
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {completedCount} of {roadmapSteps.length} steps •
                                        <Typography component="span" sx={{ color: '#f59e0b', fontWeight: 600, ml: 0.5 }}>
                                            +{completedCount * 10} points earned
                                        </Typography>
                                    </Typography>
                                </Box>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={progressPercentage}
                                sx={{
                                    height: 10,
                                    borderRadius: 5,
                                    backgroundColor: 'grey.200',
                                    '& .MuiLinearProgress-bar': {
                                        borderRadius: 5,
                                        background: progressPercentage === 100
                                            ? 'linear-gradient(90deg, #10b981 0%, #34d399 100%)'
                                            : 'linear-gradient(90deg, #6366f1 0%, #ec4899 100%)',
                                    },
                                }}
                            />
                        </Box>

                        {/* Action Buttons */}
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Reset Progress">
                                <IconButton
                                    onClick={handleReset}
                                    sx={{
                                        border: '1px solid',
                                        borderColor: 'grey.300',
                                        '&:hover': { backgroundColor: 'grey.100' },
                                    }}
                                >
                                    <RefreshIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Download Roadmap">
                                <IconButton
                                    sx={{
                                        border: '1px solid',
                                        borderColor: 'grey.300',
                                        '&:hover': { backgroundColor: 'grey.100' },
                                    }}
                                >
                                    <DownloadIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Share Roadmap">
                                <IconButton
                                    sx={{
                                        border: '1px solid',
                                        borderColor: 'grey.300',
                                        '&:hover': { backgroundColor: 'grey.100' },
                                    }}
                                >
                                    <ShareIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Paper>
                </Fade>

                {/* Roadmap Steps */}
                <Grid container spacing={3}>
                    {roadmapSteps.map((step, index) => (
                        <Grid item xs={12} key={index}>
                            <Fade in timeout={1000 + index * 100}>
                                <Box>
                                    <RoadmapCard
                                        step={step}
                                        index={index}
                                        isCompleted={completedStepsLocal[index]}
                                        onToggleComplete={handleToggleComplete}
                                    />
                                </Box>
                            </Fade>
                        </Grid>
                    ))}
                </Grid>

                {/* Completion Message */}
                {progressPercentage === 100 && (
                    <Fade in timeout={1500}>
                        <Paper
                            elevation={0}
                            sx={{
                                mt: 4,
                                p: 4,
                                textAlign: 'center',
                                background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                                color: 'white',
                            }}
                        >
                            <TrophyIcon sx={{ fontSize: 64, mb: 2 }} />
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                Congratulations! 🎉
                            </Typography>
                            <Typography variant="body1" sx={{ opacity: 0.9, mb: 1 }}>
                                You've completed all steps in your learning roadmap!
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                +50 Bonus Points for completing the roadmap!
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={() => navigate('/dashboard')}
                                sx={{
                                    backgroundColor: 'white',
                                    color: '#10b981',
                                    mr: 2,
                                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
                                }}
                            >
                                View Dashboard
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<QuizIcon />}
                                onClick={() => navigate(`/challenge/${role}`)}
                                sx={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    color: 'white',
                                    mr: 2,
                                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
                                }}
                            >
                                Take Challenge
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/home')}
                                sx={{
                                    borderColor: 'white',
                                    color: 'white',
                                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                                }}
                            >
                                Start New Journey
                            </Button>
                        </Paper>
                    </Fade>
                )}
            </Container>
        </Box>
    );
};

export default Roadmap;
