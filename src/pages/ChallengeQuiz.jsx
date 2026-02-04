import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    LinearProgress,
    Fade,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
} from '@mui/material';
import {
    CheckCircle as CheckIcon,
    Cancel as WrongIcon,
    EmojiEvents as TrophyIcon,
    ArrowBack as ArrowBackIcon,
    Lightbulb as LightbulbIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import { useGamification } from '../context/GamificationContext';
import { getQuizByRole, calculateScore } from '../services/quizzes';

const ChallengeQuiz = ({ onComplete, embedded = false }) => {
    const navigate = useNavigate();
    const { role: urlRole } = useParams();
    const role = urlRole || 'software_developer';
    const { completeStep } = useGamification();

    const [quiz, setQuiz] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);
    const [quizComplete, setQuizComplete] = useState(false);
    const [score, setScore] = useState(null);

    useEffect(() => {
        const quizData = getQuizByRole(role);
        setQuiz(quizData);
        setAnswers(new Array(quizData.questions.length).fill(null));
    }, [role]);

    if (!quiz) return null;

    const question = quiz.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

    const handleSelectAnswer = (index) => {
        if (showResult) return;
        setSelectedAnswer(index);
    };

    const handleSubmitAnswer = () => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = selectedAnswer;
        setAnswers(newAnswers);
        setShowResult(true);
    };

    const handleNextQuestion = async () => {
        setShowResult(false);
        setShowExplanation(false);
        setSelectedAnswer(null);

        if (currentQuestion < quiz.questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            // Quiz complete
            const finalScore = calculateScore(quiz.questions, answers);
            setScore(finalScore);
            setQuizComplete(true);

            // Award points based on score
            if (finalScore.percentage >= 50) {
                await completeStep(false);
            }

            if (onComplete) {
                onComplete(finalScore);
            }
        }
    };

    const isCorrect = selectedAnswer === question?.correctAnswer;

    const QuizContent = () => (
        <Box sx={{ minHeight: embedded ? 'auto' : '100vh', backgroundColor: 'background.default', pb: embedded ? 0 : 6 }}>
            {/* Header */}
            {!embedded && (
                <Box
                    sx={{
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #ec4899 100%)',
                        pt: 4,
                        pb: 8,
                        color: 'white',
                    }}
                >
                    <Container maxWidth="md">
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate(-1)}
                            sx={{ color: 'white', mb: 2 }}
                        >
                            Back
                        </Button>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="h4" sx={{ fontSize: 48 }}>
                                {quiz.icon}
                            </Typography>
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                                    {quiz.role} Challenge
                                </Typography>
                                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                    Test your knowledge and earn bonus points!
                                </Typography>
                            </Box>
                        </Box>
                    </Container>
                </Box>
            )}

            <Container maxWidth="md" sx={{ mt: embedded ? 0 : -4, position: 'relative', zIndex: 2 }}>
                {/* Progress */}
                <Fade in timeout={600}>
                    <Card sx={{ mb: 3, boxShadow: embedded ? 'none' : '0px 8px 32px rgba(0, 0, 0, 0.08)' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Question {currentQuestion + 1} of {quiz.questions.length}
                                </Typography>
                                <Chip
                                    size="small"
                                    label={`+${question.points} pts`}
                                    sx={{ bgcolor: '#fef3c7', color: '#92400e' }}
                                />
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={progress}
                                sx={{
                                    height: 8,
                                    borderRadius: 4,
                                    bgcolor: 'grey.200',
                                    '& .MuiLinearProgress-bar': {
                                        borderRadius: 4,
                                        background: 'linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%)',
                                    },
                                }}
                            />
                        </CardContent>
                    </Card>
                </Fade>

                {/* Question */}
                <Fade in timeout={800}>
                    <Card sx={{ mb: 3, boxShadow: embedded ? 'none' : '0px 4px 20px rgba(0, 0, 0, 0.06)' }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h5" sx={{ fontWeight: 600, mb: 4 }}>
                                {question.question}
                            </Typography>

                            {/* Options */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {question.options.map((option, index) => {
                                    let bgColor = 'grey.100';
                                    let borderColor = 'transparent';
                                    let textColor = 'text.primary';

                                    if (showResult) {
                                        if (index === question.correctAnswer) {
                                            bgColor = '#d1fae5';
                                            borderColor = '#10b981';
                                            textColor = '#065f46';
                                        } else if (index === selectedAnswer && !isCorrect) {
                                            bgColor = '#fee2e2';
                                            borderColor = '#ef4444';
                                            textColor = '#991b1b';
                                        }
                                    } else if (selectedAnswer === index) {
                                        bgColor = '#e0e7ff';
                                        borderColor = '#6366f1';
                                    }

                                    return (
                                        <Button
                                            key={index}
                                            variant="outlined"
                                            onClick={() => handleSelectAnswer(index)}
                                            disabled={showResult}
                                            sx={{
                                                justifyContent: 'flex-start',
                                                textAlign: 'left',
                                                py: 2,
                                                px: 3,
                                                bgcolor: bgColor,
                                                borderColor: borderColor,
                                                color: textColor,
                                                borderWidth: 2,
                                                '&:hover': {
                                                    bgcolor: showResult ? bgColor : 'primary.light',
                                                    borderColor: showResult ? borderColor : 'primary.main',
                                                    borderWidth: 2,
                                                },
                                                '&.Mui-disabled': {
                                                    bgcolor: bgColor,
                                                    borderColor: borderColor,
                                                    color: textColor,
                                                },
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                                                <Box
                                                    sx={{
                                                        width: 32,
                                                        height: 32,
                                                        borderRadius: '50%',
                                                        bgcolor: showResult && index === question.correctAnswer
                                                            ? '#10b981'
                                                            : showResult && index === selectedAnswer && !isCorrect
                                                                ? '#ef4444'
                                                                : selectedAnswer === index
                                                                    ? '#6366f1'
                                                                    : 'grey.300',
                                                        color: 'white',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {showResult && index === question.correctAnswer ? (
                                                        <CheckIcon sx={{ fontSize: 20 }} />
                                                    ) : showResult && index === selectedAnswer && !isCorrect ? (
                                                        <WrongIcon sx={{ fontSize: 20 }} />
                                                    ) : (
                                                        String.fromCharCode(65 + index)
                                                    )}
                                                </Box>
                                                <Typography>{option}</Typography>
                                            </Box>
                                        </Button>
                                    );
                                })}
                            </Box>

                            {/* Explanation */}
                            {showResult && (
                                <Fade in>
                                    <Box
                                        sx={{
                                            mt: 3,
                                            p: 2,
                                            borderRadius: 2,
                                            bgcolor: isCorrect ? '#d1fae5' : '#fef3c7',
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: 2,
                                        }}
                                    >
                                        <LightbulbIcon sx={{ color: isCorrect ? '#10b981' : '#f59e0b' }} />
                                        <Box>
                                            <Typography
                                                variant="subtitle2"
                                                fontWeight={700}
                                                sx={{ color: isCorrect ? '#065f46' : '#92400e' }}
                                            >
                                                {isCorrect ? '🎉 Correct!' : '💡 Learn from this:'}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: isCorrect ? '#047857' : '#78350f' }}>
                                                {question.explanation}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Fade>
                            )}

                            {/* Actions */}
                            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                {!showResult ? (
                                    <Button
                                        variant="contained"
                                        onClick={handleSubmitAnswer}
                                        disabled={selectedAnswer === null}
                                        sx={{
                                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                            px: 4,
                                        }}
                                    >
                                        Submit Answer
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        onClick={handleNextQuestion}
                                        sx={{
                                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                            px: 4,
                                        }}
                                    >
                                        {currentQuestion < quiz.questions.length - 1 ? 'Next Question' : 'See Results'}
                                    </Button>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Fade>
            </Container>

            {/* Results Dialog */}
            <Dialog open={quizComplete} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
                    <TrophyIcon sx={{ fontSize: 64, color: '#f59e0b', mb: 2 }} />
                    <Typography variant="h4" fontWeight={700}>
                        Challenge Complete!
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ textAlign: 'center', pb: 0 }}>
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 800,
                            background: score?.percentage >= 70
                                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                : score?.percentage >= 50
                                    ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                                    : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 2,
                        }}
                    >
                        {score?.percentage}%
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                        You got {score?.correctCount} out of {score?.totalQuestions} correct
                    </Typography>
                    <Chip
                        label={`+${score?.totalPoints} Points Earned!`}
                        sx={{
                            bgcolor: '#fef3c7',
                            color: '#92400e',
                            fontWeight: 600,
                            fontSize: '1rem',
                            py: 2,
                            px: 1,
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', p: 3 }}>
                    <Button
                        variant="contained"
                        onClick={() => {
                            setQuizComplete(false);
                            navigate(-1);
                        }}
                        sx={{
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            px: 4,
                        }}
                    >
                        Continue Learning
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );

    return <QuizContent />;
};

export default ChallengeQuiz;
