import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    Box,
    Typography,
    Button,
    IconButton,
    Chip,
    LinearProgress,
    Fade,
} from '@mui/material';
import {
    Close as CloseIcon,
    Whatshot as FireIcon,
    CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import {
    hasCheckedInToday,
    getTodayQuestion,
    saveDailyCheckIn,
    calculateStreak,
    getEncouragementMessage,
    getCheckInHistory,
} from '../services/dailyCheckIn';

const DailyCheckIn = ({ open, onClose }) => {
    const { user } = useAuth();
    const [question, setQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [streak, setStreak] = useState(0);
    const [encouragement, setEncouragement] = useState('');
    const [loading, setLoading] = useState(true);
    const [alreadyCheckedIn, setAlreadyCheckedIn] = useState(false);

    useEffect(() => {
        const initCheckIn = async () => {
            if (!user || !open) return;

            try {
                setLoading(true);

                // Check if already submitted today
                const hasChecked = await hasCheckedInToday(user.uid);
                setAlreadyCheckedIn(hasChecked);

                if (!hasChecked) {
                    const todayQuestion = getTodayQuestion();
                    setQuestion(todayQuestion);

                    const history = await getCheckInHistory(user.uid, 1);
                    const isFirstTime = history.length === 0;

                    const currentStreak = await calculateStreak(user.uid);
                    setStreak(currentStreak);

                    const message = getEncouragementMessage(currentStreak, isFirstTime);
                    setEncouragement(message);
                }
            } catch (error) {
                console.error('Error initializing check-in:', error);
            } finally {
                setLoading(false);
            }
        };

        initCheckIn();
    }, [user, open]);

    const handleSelect = (value) => {
        setSelectedAnswer(value);
    };

    const handleSubmit = async () => {
        if (!selectedAnswer || !question) return;

        try {
            await saveDailyCheckIn(user.uid, question.id, selectedAnswer);
            setSubmitted(true);

            // Update streak
            const newStreak = await calculateStreak(user.uid);
            setStreak(newStreak);
        } catch (error) {
            console.error('Error saving check-in:', error);
        }
    };

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });

    if (alreadyCheckedIn) {
        return (
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogContent sx={{ textAlign: 'center', py: 6 }}>
                    <CheckIcon sx={{ fontSize: 80, color: '#10b981', mb: 2 }} />
                    <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                        Already Checked In!
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                        You've completed your daily check-in. See you tomorrow!
                    </Typography>
                    <Button variant="contained" onClick={onClose}>
                        Continue
                    </Button>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    overflow: 'hidden',
                },
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)',
                    p: 3,
                    color: 'white',
                    position: 'relative',
                }}
            >
                <IconButton
                    onClick={onClose}
                    sx={{ position: 'absolute', top: 8, right: 8, color: 'white' }}
                >
                    <CloseIcon />
                </IconButton>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <FireIcon sx={{ fontSize: 28 }} />
                    </Box>
                    <Box>
                        <Typography variant="h5" fontWeight={700}>
                            Daily Learning Pulse
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            {today}
                        </Typography>
                    </Box>
                </Box>

                {streak > 0 && (
                    <Chip
                        icon={<FireIcon sx={{ color: '#fff !important' }} />}
                        label={`${streak} Day Streak!`}
                        sx={{
                            mt: 1,
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            fontWeight: 600,
                        }}
                    />
                )}
            </Box>

            <DialogContent sx={{ p: 4 }}>
                {loading ? (
                    <Box sx={{ py: 4 }}>
                        <LinearProgress />
                    </Box>
                ) : submitted ? (
                    <Fade in>
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Box
                                sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: '50%',
                                    bgcolor: '#d1fae5',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mx: 'auto',
                                    mb: 3,
                                }}
                            >
                                <CheckIcon sx={{ fontSize: 48, color: '#10b981' }} />
                            </Box>
                            <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                                Thanks for checking in!
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: '#f59e0b',
                                    fontWeight: 600,
                                    mb: 3,
                                }}
                            >
                                {streak > 0 ? `🔥 ${streak} day streak!` : ''}
                            </Typography>
                            <Typography color="text.secondary" sx={{ mb: 4 }}>
                                {encouragement}
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={onClose}
                                sx={{
                                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                }}
                            >
                                Start Learning
                            </Button>
                        </Box>
                    </Fade>
                ) : (
                    <Fade in>
                        <Box>
                            {encouragement && (
                                <Box
                                    sx={{
                                        p: 2,
                                        mb: 3,
                                        borderRadius: 2,
                                        bgcolor: '#fef3c7',
                                        textAlign: 'center',
                                    }}
                                >
                                    <Typography variant="body1" fontWeight={500} sx={{ color: '#92400e' }}>
                                        {encouragement}
                                    </Typography>
                                </Box>
                            )}

                            <Typography variant="h6" fontWeight={600} sx={{ mb: 3, textAlign: 'center' }}>
                                {question?.question}
                            </Typography>

                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: question?.options.length <= 4 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
                                    gap: 2,
                                    mb: 4,
                                }}
                            >
                                {question?.options.map((option) => (
                                    <Button
                                        key={option.value}
                                        variant="outlined"
                                        onClick={() => handleSelect(option.value)}
                                        sx={{
                                            flexDirection: 'column',
                                            py: 3,
                                            borderRadius: 2,
                                            borderWidth: 2,
                                            borderColor: selectedAnswer === option.value ? 'primary.main' : 'grey.300',
                                            bgcolor: selectedAnswer === option.value ? 'primary.light' : 'transparent',
                                            color: selectedAnswer === option.value ? 'white' : 'text.primary',
                                            '&:hover': {
                                                borderWidth: 2,
                                                borderColor: 'primary.main',
                                            },
                                        }}
                                    >
                                        <Typography variant="h4" sx={{ mb: 0.5 }}>
                                            {option.label}
                                        </Typography>
                                        <Typography variant="caption" fontWeight={500}>
                                            {option.description}
                                        </Typography>
                                    </Button>
                                ))}
                            </Box>

                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                onClick={handleSubmit}
                                disabled={!selectedAnswer}
                                sx={{
                                    py: 1.5,
                                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                }}
                            >
                                Submit Check-In
                            </Button>
                        </Box>
                    </Fade>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default DailyCheckIn;
