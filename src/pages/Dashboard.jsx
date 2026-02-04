import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    LinearProgress,
    Chip,
    Avatar,
    Paper,
    Skeleton,
    Tooltip,
    Fade,
} from '@mui/material';
import {
    EmojiEvents as TrophyIcon,
    Star as StarIcon,
    LocalFireDepartment as FireIcon,
    TrendingUp as TrendingUpIcon,
    CheckCircle as CheckCircleIcon,
    Map as MapIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';
import { BADGES, LEVELS } from '../services/gamification';
import { useTranslations } from '../hooks/useTranslations';

const TEXTS = {
    totalPoints: 'Total Points',
    level: 'Level',
    pointsToNext: 'points to next level',
    maxLevel: 'Maximum level reached!',
    progressTo: 'Progress to',
    pointsEarned: 'Points Earned',
    stepsCompleted: 'Steps Completed',
    badgesEarned: 'Badges Earned',
    roadmapsDone: 'Roadmaps Done',
    badgesCollection: 'Badges Collection',
    learner: 'Learner',
};

const Dashboard = () => {
    const { user } = useAuth();
    const {
        points,
        earnedBadges,
        completedSteps,
        completedRoadmaps,
        level,
        levelProgress,
        loading,
    } = useGamification();
    const t = useTranslations(TEXTS);

    // Get all available badges
    const allBadges = Object.values(BADGES);
    const earnedBadgeIds = earnedBadges.map((b) => b.id);

    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', py: 4 }}>
                <Container maxWidth="lg">
                    <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3, mb: 3 }} />
                    <Grid container spacing={3}>
                        {[1, 2, 3, 4].map((i) => (
                            <Grid item xs={12} sm={6} md={3} key={i}>
                                <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 3 }} />
                            </Grid>
                        ))}
                    </Grid>
                </Container>
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
                    pb: 12,
                    color: 'white',
                }}
            >
                <Container maxWidth="lg">
                    <Fade in timeout={600}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Avatar
                                src={user?.photoURL || undefined}
                                sx={{
                                    width: 80,
                                    height: 80,
                                    fontSize: '2rem',
                                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                                    border: '3px solid rgba(255, 255, 255, 0.5)',
                                }}
                            >
                                {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                            </Avatar>
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                    {user?.displayName || t.learner}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                    <Chip
                                        label={`Level ${level.level} - ${level.name}`}
                                        sx={{
                                            backgroundColor: level.color,
                                            color: 'white',
                                            fontWeight: 600,
                                        }}
                                    />
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        {points} {t.totalPoints.toLowerCase()}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Fade>
                </Container>
            </Box>

            {/* Level Progress Card */}
            <Container maxWidth="lg" sx={{ mt: -8, position: 'relative', zIndex: 2 }}>
                <Fade in timeout={800}>
                    <Card
                        sx={{
                            mb: 4,
                            boxShadow: '0px 12px 40px rgba(0, 0, 0, 0.12)',
                        }}
                    >
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box
                                        sx={{
                                            width: 56,
                                            height: 56,
                                            borderRadius: 2,
                                            background: `linear-gradient(135deg, ${level.color} 0%, ${level.color}cc 100%)`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <TrophyIcon sx={{ color: 'white', fontSize: 28 }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                            Level {level.level}: {level.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {levelProgress.pointsToNext > 0
                                                ? `${levelProgress.pointsToNext} ${t.pointsToNext}`
                                                : t.maxLevel}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography variant="h4" sx={{ fontWeight: 700, color: level.color }}>
                                        {points}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {t.totalPoints}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ mt: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {t.progressTo} {levelProgress.nextLevel?.name || 'Max'}
                                    </Typography>
                                    <Typography variant="body2" fontWeight={600} color="primary.main">
                                        {levelProgress.percentage}%
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={levelProgress.percentage}
                                    sx={{
                                        height: 12,
                                        borderRadius: 6,
                                        backgroundColor: 'grey.200',
                                        '& .MuiLinearProgress-bar': {
                                            borderRadius: 6,
                                            background: `linear-gradient(90deg, ${level.color} 0%, ${levelProgress.nextLevel?.color || level.color} 100%)`,
                                        },
                                    }}
                                />
                            </Box>

                            {/* Level milestones */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, px: 1 }}>
                                {LEVELS.slice(0, 5).map((l) => (
                                    <Tooltip key={l.level} title={`${l.name} (${l.minPoints} pts)`}>
                                        <Box
                                            sx={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: '50%',
                                                backgroundColor: points >= l.minPoints ? l.color : 'grey.300',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                transition: 'all 0.3s ease',
                                            }}
                                        >
                                            {l.level}
                                        </Box>
                                    </Tooltip>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Fade>

                {/* Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={6} sm={3}>
                        <Fade in timeout={900}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    textAlign: 'center',
                                    backgroundColor: 'white',
                                    border: '1px solid',
                                    borderColor: 'grey.200',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 2,
                                        background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mx: 'auto',
                                        mb: 2,
                                    }}
                                >
                                    <StarIcon sx={{ color: 'white', fontSize: 24 }} />
                                </Box>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: '#6366f1' }}>
                                    {points}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {t.pointsEarned}
                                </Typography>
                            </Paper>
                        </Fade>
                    </Grid>

                    <Grid item xs={6} sm={3}>
                        <Fade in timeout={1000}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    textAlign: 'center',
                                    backgroundColor: 'white',
                                    border: '1px solid',
                                    borderColor: 'grey.200',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 2,
                                        background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mx: 'auto',
                                        mb: 2,
                                    }}
                                >
                                    <CheckCircleIcon sx={{ color: 'white', fontSize: 24 }} />
                                </Box>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981' }}>
                                    {completedSteps}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {t.stepsCompleted}
                                </Typography>
                            </Paper>
                        </Fade>
                    </Grid>

                    <Grid item xs={6} sm={3}>
                        <Fade in timeout={1100}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    textAlign: 'center',
                                    backgroundColor: 'white',
                                    border: '1px solid',
                                    borderColor: 'grey.200',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 2,
                                        background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mx: 'auto',
                                        mb: 2,
                                    }}
                                >
                                    <TrophyIcon sx={{ color: 'white', fontSize: 24 }} />
                                </Box>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                                    {earnedBadges.length}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {t.badgesEarned}
                                </Typography>
                            </Paper>
                        </Fade>
                    </Grid>

                    <Grid item xs={6} sm={3}>
                        <Fade in timeout={1200}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    textAlign: 'center',
                                    backgroundColor: 'white',
                                    border: '1px solid',
                                    borderColor: 'grey.200',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 2,
                                        background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mx: 'auto',
                                        mb: 2,
                                    }}
                                >
                                    <MapIcon sx={{ color: 'white', fontSize: 24 }} />
                                </Box>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: '#ec4899' }}>
                                    {completedRoadmaps}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {t.roadmapsDone}
                                </Typography>
                            </Paper>
                        </Fade>
                    </Grid>
                </Grid>

                {/* Badges Section */}
                <Fade in timeout={1300}>
                    <Card sx={{ boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)' }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <TrophyIcon sx={{ color: '#f59e0b', fontSize: 28 }} />
                                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                    {t.badgesCollection}
                                </Typography>
                                <Chip
                                    label={`${earnedBadges.length}/${allBadges.length}`}
                                    size="small"
                                    color="primary"
                                />
                            </Box>

                            <Grid container spacing={2}>
                                {allBadges.map((badge) => {
                                    const isEarned = earnedBadgeIds.includes(badge.id);
                                    return (
                                        <Grid item xs={6} sm={4} md={3} key={badge.id}>
                                            <Tooltip
                                                title={
                                                    <Box sx={{ textAlign: 'center', p: 1 }}>
                                                        <Typography variant="subtitle2" fontWeight={600}>
                                                            {badge.name}
                                                        </Typography>
                                                        <Typography variant="caption">{badge.description}</Typography>
                                                    </Box>
                                                }
                                            >
                                                <Paper
                                                    elevation={0}
                                                    sx={{
                                                        p: 2,
                                                        textAlign: 'center',
                                                        backgroundColor: isEarned ? `${badge.color}10` : 'grey.100',
                                                        border: '2px solid',
                                                        borderColor: isEarned ? badge.color : 'transparent',
                                                        opacity: isEarned ? 1 : 0.5,
                                                        transition: 'all 0.3s ease',
                                                        cursor: 'pointer',
                                                        '&:hover': {
                                                            transform: isEarned ? 'scale(1.05)' : 'none',
                                                            boxShadow: isEarned ? `0 4px 20px ${badge.color}30` : 'none',
                                                        },
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            width: 56,
                                                            height: 56,
                                                            borderRadius: '50%',
                                                            backgroundColor: isEarned ? badge.color : 'grey.300',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            mx: 'auto',
                                                            mb: 1,
                                                            fontSize: '1.75rem',
                                                            filter: isEarned ? 'none' : 'grayscale(100%)',
                                                        }}
                                                    >
                                                        {badge.icon}
                                                    </Box>
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight={600}
                                                        sx={{
                                                            color: isEarned ? 'text.primary' : 'text.disabled',
                                                            fontSize: '0.8rem',
                                                        }}
                                                    >
                                                        {badge.name}
                                                    </Typography>
                                                    {isEarned && (
                                                        <CheckCircleIcon
                                                            sx={{
                                                                fontSize: 16,
                                                                color: badge.color,
                                                                mt: 0.5,
                                                            }}
                                                        />
                                                    )}
                                                </Paper>
                                            </Tooltip>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </CardContent>
                    </Card>
                </Fade>
            </Container>
        </Box>
    );
};

export default Dashboard;
