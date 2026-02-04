import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Button,
    Card,
    CardContent,
    Grid,
    Fade,
    Paper,
    Chip,
} from '@mui/material';
import {
    ArrowForward as ArrowForwardIcon,
    AutoAwesome as AutoAwesomeIcon,
    Timeline as TimelineIcon,
    TrendingUp as TrendingUpIcon,
    Quiz as QuizIcon,
    PlayArrow as PlayIcon,
} from '@mui/icons-material';
import RoleSelector from '../components/RoleSelector';
import { ROLE_QUIZZES } from '../services/quizzes';
import { useTranslations } from '../hooks/useTranslations';

// Static text to translate
const TEXTS = {
    heroTitle: 'Design Your Learning Journey',
    heroSubtitle: 'Select your career goal and current skill level to get a personalized roadmap that will guide you to success.',
    startJourney: 'Start Your Journey',
    tellUs: 'Tell us about yourself to get a personalized learning roadmap',
    generateRoadmap: 'Generate My Roadmap',
    selectBoth: 'Please select both a role and skill level to continue',
    testKnowledge: 'Test Your Knowledge',
    takeChallenge: 'Take role-specific challenges to earn bonus points and badges',
    challenge: 'Challenge',
    startChallenge: 'Start Challenge',
    questions: 'Questions',
    pts: 'pts',
    personalizedPath: 'Personalized Path',
    personalizedPathDesc: 'Get a learning roadmap tailored to your goals and experience level.',
    stepByStep: 'Step-by-Step Progress',
    stepByStepDesc: 'Track your journey with clear milestones and achievements.',
    continuousGrowth: 'Continuous Growth',
    continuousGrowthDesc: 'Build skills progressively from beginner to expert.',
};

// Get challenges from quiz data
const challenges = Object.entries(ROLE_QUIZZES).map(([key, quiz]) => ({
    id: key,
    role: quiz.role,
    icon: quiz.icon,
    questionCount: quiz.questions.length,
    totalPoints: quiz.questions.reduce((sum, q) => sum + q.points, 0),
}));

const Home = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('');
    const [skillLevel, setSkillLevel] = useState('');
    const t = useTranslations(TEXTS);

    const features = useMemo(() => [
        {
            icon: AutoAwesomeIcon,
            title: t.personalizedPath,
            description: t.personalizedPathDesc,
            color: '#6366f1',
        },
        {
            icon: TimelineIcon,
            title: t.stepByStep,
            description: t.stepByStepDesc,
            color: '#ec4899',
        },
        {
            icon: TrendingUpIcon,
            title: t.continuousGrowth,
            description: t.continuousGrowthDesc,
            color: '#10b981',
        },
    ], [t]);

    const handleGenerateRoadmap = () => {
        if (role && skillLevel) {
            navigate('/roadmap', { state: { role, skillLevel } });
        }
    };

    const isFormValid = role && skillLevel;

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', pb: 6 }}>
            {/* Hero Section */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #fafafc 0%, #f0f4ff 30%, #faf5ff 70%, #ecfeff 100%)',
                    pt: { xs: 6, md: 10 },
                    pb: { xs: 10, md: 14 },
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Animated Decorative Orbs */}
                <Box
                    className="float"
                    sx={{
                        position: 'absolute',
                        top: -120,
                        right: -80,
                        width: 500,
                        height: 500,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.25) 0%, rgba(168, 85, 247, 0.15) 50%, transparent 70%)',
                        filter: 'blur(60px)',
                    }}
                />
                <Box
                    className="float"
                    sx={{
                        position: 'absolute',
                        bottom: -80,
                        left: -60,
                        width: 400,
                        height: 400,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, rgba(34, 211, 238, 0.15) 50%, transparent 70%)',
                        filter: 'blur(50px)',
                        animationDelay: '2s',
                    }}
                />
                <Box
                    className="float"
                    sx={{
                        position: 'absolute',
                        top: '40%',
                        left: '20%',
                        width: 250,
                        height: 250,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, transparent 60%)',
                        filter: 'blur(40px)',
                        animationDelay: '4s',
                    }}
                />

                <Container maxWidth="lg">
                    <Fade in timeout={800}>
                        <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                            <Typography
                                variant="h1"
                                className="gradient-text"
                                sx={{
                                    fontWeight: 800,
                                    mb: 3,
                                    fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' },
                                    letterSpacing: '-0.02em',
                                    lineHeight: 1.1,
                                }}
                            >
                                {t.heroTitle}
                            </Typography>
                            <Typography
                                variant="h5"
                                sx={{
                                    mb: 5,
                                    maxWidth: 650,
                                    mx: 'auto',
                                    fontWeight: 400,
                                    fontSize: { xs: '1.1rem', md: '1.35rem' },
                                    color: '#6366f1',
                                    opacity: 0.9,
                                }}
                            >
                                {t.heroSubtitle}
                            </Typography>
                        </Box>
                    </Fade>

                    {/* Feature Cards */}
                    <Fade in timeout={1000}>
                        <Grid container spacing={3} sx={{ mt: 2, mb: 6 }}>
                            {features.map((feature, index) => {
                                const IconComponent = feature.icon;
                                return (
                                    <Grid item xs={12} md={4} key={index}>
                                        <Paper
                                            elevation={0}
                                            className="hover-lift"
                                            sx={{
                                                p: 4,
                                                textAlign: 'center',
                                                background: 'rgba(255, 255, 255, 0.7)',
                                                backdropFilter: 'blur(24px)',
                                                border: '1px solid rgba(124, 58, 237, 0.12)',
                                                borderRadius: 6,
                                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                '&:hover': {
                                                    background: 'rgba(255, 255, 255, 0.9)',
                                                    border: '1px solid rgba(124, 58, 237, 0.25)',
                                                    boxShadow: '0 24px 48px rgba(124, 58, 237, 0.15)',
                                                    '& .feature-icon': {
                                                        transform: 'scale(1.1) rotate(5deg)',
                                                        boxShadow: `0 12px 24px ${feature.color}40`,
                                                    },
                                                },
                                            }}
                                        >
                                            <Box
                                                className="feature-icon"
                                                sx={{
                                                    width: 72,
                                                    height: 72,
                                                    borderRadius: 4,
                                                    background: `linear-gradient(135deg, ${feature.color} 0%, ${feature.color}cc 100%)`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mx: 'auto',
                                                    mb: 3,
                                                    boxShadow: `0 8px 20px ${feature.color}30`,
                                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                }}
                                            >
                                                <IconComponent sx={{ fontSize: 36, color: 'white' }} />
                                            </Box>
                                            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5, color: '#1e1b4b' }}>
                                                {feature.title}
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: '#6366f1', opacity: 0.85 }}>
                                                {feature.description}
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Fade>
                </Container>
            </Box>

            {/* Selection Form */}
            <Container maxWidth="md" sx={{ mt: -6, position: 'relative', zIndex: 2 }}>
                <Fade in timeout={1200}>
                    <Card
                        sx={{
                            boxShadow: '0px 16px 48px rgba(0, 0, 0, 0.1)',
                            border: '1px solid',
                            borderColor: 'grey.100',
                        }}
                    >
                        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                            <Box sx={{ textAlign: 'center', mb: 4 }}>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 700,
                                        mb: 1,
                                        background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    {t.startJourney}
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    {t.tellUs}
                                </Typography>
                            </Box>

                            <RoleSelector
                                role={role}
                                skillLevel={skillLevel}
                                onRoleChange={setRole}
                                onSkillLevelChange={setSkillLevel}
                            />

                            <Box sx={{ mt: 4, textAlign: 'center' }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    disabled={!isFormValid}
                                    onClick={handleGenerateRoadmap}
                                    endIcon={<ArrowForwardIcon />}
                                    sx={{
                                        px: 6,
                                        py: 1.5,
                                        fontSize: '1.1rem',
                                        background: isFormValid
                                            ? 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)'
                                            : undefined,
                                        boxShadow: isFormValid
                                            ? '0px 8px 24px rgba(99, 102, 241, 0.3)'
                                            : undefined,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: isFormValid ? 'translateY(-2px)' : undefined,
                                            boxShadow: isFormValid
                                                ? '0px 12px 32px rgba(99, 102, 241, 0.4)'
                                                : undefined,
                                        },
                                        '&:disabled': {
                                            backgroundColor: 'grey.300',
                                            color: 'grey.500',
                                        },
                                    }}
                                >
                                    {t.generateRoadmap}
                                </Button>
                                {!isFormValid && (
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ display: 'block', mt: 2 }}
                                    >
                                        {t.selectBoth}
                                    </Typography>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Fade>
            </Container>

            {/* Challenges Section */}
            <Container maxWidth="lg" sx={{ mt: 8 }}>
                <Fade in timeout={1400}>
                    <Box>
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                                <QuizIcon sx={{ fontSize: 32, color: '#8b5cf6' }} />
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 700,
                                        background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    {t.testKnowledge}
                                </Typography>
                            </Box>
                            <Typography variant="body1" color="text.secondary">
                                {t.takeChallenge}
                            </Typography>
                        </Box>

                        <Grid container spacing={3}>
                            {challenges.map((challenge) => (
                                <Grid item xs={12} sm={6} md={4} key={challenge.id}>
                                    <Card
                                        sx={{
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            border: '1px solid',
                                            borderColor: 'grey.200',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: '0px 12px 32px rgba(139, 92, 246, 0.15)',
                                                borderColor: '#8b5cf6',
                                            },
                                        }}
                                        onClick={() => navigate(`/challenge/${challenge.id}`)}
                                    >
                                        <CardContent sx={{ p: 3 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                <Box
                                                    sx={{
                                                        width: 48,
                                                        height: 48,
                                                        borderRadius: 2,
                                                        background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '1.5rem',
                                                    }}
                                                >
                                                    {challenge.icon}
                                                </Box>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                                                        {challenge.role}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {t.challenge}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                                <Chip
                                                    size="small"
                                                    label={`${challenge.questionCount} ${t.questions}`}
                                                    sx={{ bgcolor: 'grey.100' }}
                                                />
                                                <Chip
                                                    size="small"
                                                    label={`+${challenge.totalPoints} ${t.pts}`}
                                                    sx={{ bgcolor: '#fef3c7', color: '#92400e' }}
                                                />
                                            </Box>

                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                startIcon={<PlayIcon />}
                                                sx={{
                                                    borderColor: '#8b5cf6',
                                                    color: '#8b5cf6',
                                                    '&:hover': {
                                                        borderColor: '#7c3aed',
                                                        backgroundColor: 'rgba(139, 92, 246, 0.05)',
                                                    },
                                                }}
                                            >
                                                {t.startChallenge}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Fade>
            </Container>
        </Box>
    );
};

export default Home;
