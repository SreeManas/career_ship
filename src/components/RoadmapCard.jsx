import { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    LinearProgress,
    IconButton,
    Collapse,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Button,
    CircularProgress,
    Divider,
    Link,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Fade,
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    CheckCircle as CheckCircleIcon,
    RadioButtonUnchecked as RadioButtonUncheckedIcon,
    AccessTime as AccessTimeIcon,
    TrendingUp as TrendingUpIcon,
    PlayCircle as PlayCircleIcon,
    MenuBook as MenuBookIcon,
    OpenInNew as OpenInNewIcon,
    YouTube as YouTubeIcon,
    Quiz as QuizIcon,
    Close as CloseIcon,
    EmojiEvents as TrophyIcon,
    Lightbulb as LightbulbIcon,
} from '@mui/icons-material';
import { getLearningResources } from '../services/learningResources';
import { generateTopicQuiz, calculateQuizScore } from '../services/topicQuiz';
import { useGamification } from '../context/GamificationContext';
import { useLanguage } from '../context/LanguageContext';

const RoadmapCard = ({ step, index, isCompleted, onToggleComplete }) => {
    const { currentLanguage } = useLanguage();
    const [expanded, setExpanded] = useState(false);
    const [topicResources, setTopicResources] = useState({});
    const [loadingTopics, setLoadingTopics] = useState({});
    const [expandedTopics, setExpandedTopics] = useState({});

    // Quiz state
    const [quizDialogOpen, setQuizDialogOpen] = useState(false);
    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [loadingQuiz, setLoadingQuiz] = useState(false);
    const [quizTopic, setQuizTopic] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [answers, setAnswers] = useState([]);
    const [quizComplete, setQuizComplete] = useState(false);
    const [quizScore, setQuizScore] = useState(null);

    const { addPoints } = useGamification();

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Easy':
            case 'easy':
                return 'success';
            case 'Medium':
            case 'medium':
                return 'warning';
            case 'Hard':
            case 'hard':
                return 'error';
            default:
                return 'default';
        }
    };

    const getStepColor = (index) => {
        const colors = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        ];
        return colors[index % colors.length];
    };

    const handleLoadTopicResources = async (topic, topicIndex) => {
        if (topicResources[topicIndex]) {
            setExpandedTopics(prev => ({ ...prev, [topicIndex]: !prev[topicIndex] }));
            return;
        }

        setLoadingTopics(prev => ({ ...prev, [topicIndex]: true }));
        setExpandedTopics(prev => ({ ...prev, [topicIndex]: true }));

        try {
            // Pass currentLanguage to get videos in user's preferred language
            const data = await getLearningResources(topic, step.title, currentLanguage);
            setTopicResources(prev => ({ ...prev, [topicIndex]: data }));
        } catch (error) {
            console.error('Error loading resources for topic:', error);
        } finally {
            setLoadingTopics(prev => ({ ...prev, [topicIndex]: false }));
        }
    };

    const handleStartQuiz = async (topic) => {
        setQuizTopic(topic);
        setQuizDialogOpen(true);
        setLoadingQuiz(true);
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setQuizComplete(false);
        setQuizScore(null);
        setAnswers([]);

        try {
            const quiz = await generateTopicQuiz(topic, step.title, 10);
            setCurrentQuiz(quiz);
            setAnswers(new Array(quiz.questions.length).fill(null));
        } catch (error) {
            console.error('Error generating quiz:', error);
        } finally {
            setLoadingQuiz(false);
        }
    };

    const handleSelectAnswer = (answerIndex) => {
        if (showResult) return;
        setSelectedAnswer(answerIndex);
    };

    const handleSubmitAnswer = () => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = selectedAnswer;
        setAnswers(newAnswers);
        setShowResult(true);
    };

    const handleNextQuestion = async () => {
        setShowResult(false);
        setSelectedAnswer(null);

        if (currentQuestion < currentQuiz.questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            const finalAnswers = [...answers];
            finalAnswers[currentQuestion] = selectedAnswer;
            const score = calculateQuizScore(currentQuiz.questions, finalAnswers);
            setQuizScore(score);
            setQuizComplete(true);

            if (score.earnedPoints > 0 && addPoints) {
                await addPoints(score.earnedPoints);
            }
        }
    };

    const handleCloseQuiz = () => {
        setQuizDialogOpen(false);
        setCurrentQuiz(null);
    };

    const question = currentQuiz?.questions?.[currentQuestion];
    const isCorrect = question && selectedAnswer === question.correctAnswer;

    return (
        <>
            <Card
                sx={{
                    position: 'relative',
                    overflow: 'visible',
                    transition: 'all 0.3s ease',
                    opacity: isCompleted ? 0.8 : 1,
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0px 12px 32px rgba(0, 0, 0, 0.12)',
                    },
                }}
            >
                {/* Step number indicator */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: -16,
                        left: 24,
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: getStepColor(index),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                        zIndex: 1,
                    }}
                >
                    {index + 1}
                </Box>

                <CardContent sx={{ pt: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ flex: 1 }}>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 600,
                                    mb: 1,
                                    textDecoration: isCompleted ? 'line-through' : 'none',
                                    color: isCompleted ? 'grey.500' : 'text.primary',
                                }}
                            >
                                {step.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {step.description}
                            </Typography>
                        </Box>
                        <IconButton
                            onClick={() => onToggleComplete(index)}
                            sx={{
                                color: isCompleted ? 'success.main' : 'grey.400',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    color: 'success.main',
                                    transform: 'scale(1.1)',
                                },
                            }}
                        >
                            {isCompleted ? (
                                <CheckCircleIcon sx={{ fontSize: 28 }} />
                            ) : (
                                <RadioButtonUncheckedIcon sx={{ fontSize: 28 }} />
                            )}
                        </IconButton>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        <Chip
                            icon={<AccessTimeIcon />}
                            label={step.duration}
                            size="small"
                            variant="outlined"
                            sx={{ borderRadius: 2 }}
                        />
                        <Chip
                            icon={<TrendingUpIcon />}
                            label={step.difficulty}
                            size="small"
                            color={getDifficultyColor(step.difficulty)}
                            sx={{ borderRadius: 2 }}
                        />
                        {step.tags?.map((tag, i) => (
                            <Chip
                                key={i}
                                label={tag}
                                size="small"
                                sx={{
                                    borderRadius: 2,
                                    backgroundColor: 'grey.100',
                                    color: 'grey.700',
                                }}
                            />
                        ))}
                    </Box>

                    {step.topics && step.topics.length > 0 && (
                        <>
                            <Box
                                onClick={() => setExpanded(!expanded)}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    color: 'primary.main',
                                    mb: 1,
                                    '&:hover': { textDecoration: 'underline' },
                                }}
                            >
                                <Typography variant="body2" fontWeight={600}>
                                    {expanded ? 'Hide' : 'Show'} Topics ({step.topics.length})
                                </Typography>
                                <ExpandMoreIcon
                                    sx={{
                                        transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                        transition: 'transform 0.3s',
                                        ml: 0.5,
                                    }}
                                />
                            </Box>
                            <Collapse in={expanded}>
                                <Box sx={{
                                    mt: 1,
                                    p: 2,
                                    bgcolor: '#f8fafc',
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: 'grey.200',
                                }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                                        Click any topic for resources or take a quiz to test your knowledge
                                    </Typography>
                                    {step.topics.map((topic, i) => (
                                        <Box key={i} sx={{ mb: 2 }}>
                                            {/* Topic Header */}
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    p: 1.5,
                                                    borderRadius: 2,
                                                    bgcolor: expandedTopics[i] ? '#e0e7ff' : 'white',
                                                    border: '1px solid',
                                                    borderColor: expandedTopics[i] ? '#6366f1' : 'grey.200',
                                                    transition: 'all 0.2s ease',
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 28,
                                                        height: 28,
                                                        borderRadius: '50%',
                                                        background: getStepColor(index),
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: 'white',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    {i + 1}
                                                </Box>
                                                <Typography
                                                    variant="body2"
                                                    fontWeight={500}
                                                    sx={{ flex: 1, color: 'text.primary' }}
                                                >
                                                    {topic}
                                                </Typography>

                                                {/* Resources Button */}
                                                <Tooltip title="Get learning resources">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleLoadTopicResources(topic, i)}
                                                        disabled={loadingTopics[i]}
                                                        sx={{
                                                            bgcolor: '#fef2f2',
                                                            '&:hover': { bgcolor: '#fee2e2' },
                                                        }}
                                                    >
                                                        {loadingTopics[i] ? (
                                                            <CircularProgress size={16} />
                                                        ) : (
                                                            <YouTubeIcon sx={{ fontSize: 18, color: '#ef4444' }} />
                                                        )}
                                                    </IconButton>
                                                </Tooltip>

                                                {/* Quiz Button */}
                                                <Tooltip title="Take a quiz">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleStartQuiz(topic)}
                                                        sx={{
                                                            bgcolor: '#f0fdf4',
                                                            '&:hover': { bgcolor: '#dcfce7' },
                                                        }}
                                                    >
                                                        <QuizIcon sx={{ fontSize: 18, color: '#10b981' }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>

                                            {/* Topic Resources */}
                                            <Collapse in={expandedTopics[i] && topicResources[i]}>
                                                <Box sx={{
                                                    ml: 4,
                                                    mt: 1,
                                                    p: 2,
                                                    bgcolor: 'white',
                                                    borderRadius: 2,
                                                    border: '1px solid',
                                                    borderColor: 'grey.200',
                                                }}>
                                                    {/* YouTube Video */}
                                                    {topicResources[i]?.video && (
                                                        <Box sx={{ mb: 2 }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                                <YouTubeIcon sx={{ color: '#ef4444', fontSize: 18 }} />
                                                                <Typography variant="caption" fontWeight={600}>
                                                                    Top Video
                                                                </Typography>
                                                            </Box>
                                                            <Link
                                                                href={topicResources[i].video.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                underline="none"
                                                            >
                                                                <Box
                                                                    sx={{
                                                                        display: 'flex',
                                                                        gap: 1.5,
                                                                        p: 1,
                                                                        borderRadius: 1,
                                                                        bgcolor: '#fef2f2',
                                                                        border: '1px solid #fecaca',
                                                                        transition: 'all 0.2s ease',
                                                                        '&:hover': {
                                                                            borderColor: '#ef4444',
                                                                            boxShadow: '0 2px 8px rgba(239,68,68,0.2)',
                                                                        },
                                                                    }}
                                                                >
                                                                    <Box
                                                                        component="img"
                                                                        src={topicResources[i].video.thumbnail}
                                                                        alt={topicResources[i].video.title}
                                                                        sx={{
                                                                            width: 80,
                                                                            height: 45,
                                                                            borderRadius: 0.5,
                                                                            objectFit: 'cover',
                                                                        }}
                                                                    />
                                                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                                                        <Typography
                                                                            variant="caption"
                                                                            fontWeight={600}
                                                                            sx={{
                                                                                color: 'text.primary',
                                                                                overflow: 'hidden',
                                                                                textOverflow: 'ellipsis',
                                                                                display: '-webkit-box',
                                                                                WebkitLineClamp: 2,
                                                                                WebkitBoxOrient: 'vertical',
                                                                            }}
                                                                        >
                                                                            {topicResources[i].video.title}
                                                                        </Typography>
                                                                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                                                                            {topicResources[i].video.channelTitle}
                                                                        </Typography>
                                                                    </Box>
                                                                    <PlayCircleIcon sx={{ color: '#ef4444', fontSize: 24 }} />
                                                                </Box>
                                                            </Link>
                                                        </Box>
                                                    )}

                                                    {/* Learning Websites */}
                                                    <Box>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                            <MenuBookIcon sx={{ color: '#10b981', fontSize: 18 }} />
                                                            <Typography variant="caption" fontWeight={600}>
                                                                Resources
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                            {topicResources[i]?.websites?.map((site, j) => (
                                                                <Link
                                                                    key={j}
                                                                    href={site.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    underline="none"
                                                                    sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: 1,
                                                                        p: 1,
                                                                        borderRadius: 1,
                                                                        bgcolor: '#f0fdf4',
                                                                        border: '1px solid #bbf7d0',
                                                                        transition: 'all 0.2s ease',
                                                                        '&:hover': {
                                                                            borderColor: '#10b981',
                                                                            bgcolor: '#dcfce7',
                                                                        },
                                                                    }}
                                                                >
                                                                    <Typography variant="caption" fontWeight={600} color="text.primary">
                                                                        {site.name}
                                                                    </Typography>
                                                                    <Typography
                                                                        variant="caption"
                                                                        color="text.secondary"
                                                                        sx={{ flex: 1, fontSize: '0.65rem' }}
                                                                    >
                                                                        {site.description}
                                                                    </Typography>
                                                                    <OpenInNewIcon sx={{ color: 'grey.400', fontSize: 14 }} />
                                                                </Link>
                                                            ))}
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Collapse>
                                        </Box>
                                    ))}
                                </Box>
                            </Collapse>
                        </>
                    )}

                    {step.progress !== undefined && (
                        <Box sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">
                                    Progress
                                </Typography>
                                <Typography variant="caption" fontWeight={600} color="primary.main">
                                    {step.progress}%
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={step.progress}
                                sx={{
                                    height: 6,
                                    borderRadius: 3,
                                    backgroundColor: 'grey.200',
                                    '& .MuiLinearProgress-bar': {
                                        borderRadius: 3,
                                        background: getStepColor(index),
                                    },
                                }}
                            />
                        </Box>
                    )}
                </CardContent>
            </Card>

            {/* Quiz Dialog */}
            <Dialog
                open={quizDialogOpen}
                onClose={handleCloseQuiz}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 3, overflow: 'hidden' }
                }}
            >
                {/* Quiz Header */}
                <Box sx={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    p: 2,
                    color: 'white',
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <QuizIcon />
                            <Typography variant="h6" fontWeight={600}>
                                Quiz: {quizTopic}
                            </Typography>
                        </Box>
                        <IconButton onClick={handleCloseQuiz} sx={{ color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Box>

                <DialogContent sx={{ p: 3 }}>
                    {loadingQuiz ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6 }}>
                            <CircularProgress size={48} sx={{ color: '#10b981', mb: 2 }} />
                            <Typography color="text.secondary">
                                AI is generating quiz questions...
                            </Typography>
                        </Box>
                    ) : quizComplete ? (
                        /* Quiz Complete Screen */
                        <Box sx={{ textAlign: 'center', py: 3 }}>
                            <TrophyIcon sx={{ fontSize: 64, color: '#f59e0b', mb: 2 }} />
                            <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                                Quiz Complete!
                            </Typography>
                            <Typography
                                variant="h2"
                                sx={{
                                    fontWeight: 800,
                                    background: quizScore?.percentage >= 70
                                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                        : quizScore?.percentage >= 50
                                            ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                                            : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    mb: 1,
                                }}
                            >
                                {quizScore?.percentage}%
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                                {quizScore?.correctCount} of {quizScore?.totalQuestions} correct
                            </Typography>
                            <Chip
                                label={`+${quizScore?.earnedPoints} Points Earned!`}
                                sx={{
                                    bgcolor: '#fef3c7',
                                    color: '#92400e',
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    py: 2,
                                    px: 1,
                                }}
                            />
                        </Box>
                    ) : question ? (
                        /* Quiz Question */
                        <Fade in timeout={300}>
                            <Box>
                                {/* Progress */}
                                <Box sx={{ mb: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Question {currentQuestion + 1} of {currentQuiz.questions.length}
                                        </Typography>
                                        <Chip
                                            size="small"
                                            label={`+${question.points} pts`}
                                            color={getDifficultyColor(question.difficulty)}
                                            sx={{ height: 24 }}
                                        />
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={((currentQuestion + 1) / currentQuiz.questions.length) * 100}
                                        sx={{
                                            height: 6,
                                            borderRadius: 3,
                                            bgcolor: 'grey.200',
                                            '& .MuiLinearProgress-bar': {
                                                borderRadius: 3,
                                                background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                                            },
                                        }}
                                    />
                                </Box>

                                {/* Question */}
                                <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                                    {question.question}
                                </Typography>

                                {/* Options */}
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                    {question.options.map((option, idx) => {
                                        let bgColor = 'grey.50';
                                        let borderColor = 'grey.200';
                                        let textColor = 'text.primary';

                                        if (showResult) {
                                            if (idx === question.correctAnswer) {
                                                bgColor = '#d1fae5';
                                                borderColor = '#10b981';
                                                textColor = '#065f46';
                                            } else if (idx === selectedAnswer && !isCorrect) {
                                                bgColor = '#fee2e2';
                                                borderColor = '#ef4444';
                                                textColor = '#991b1b';
                                            }
                                        } else if (selectedAnswer === idx) {
                                            bgColor = '#e0e7ff';
                                            borderColor = '#6366f1';
                                        }

                                        return (
                                            <Button
                                                key={idx}
                                                variant="outlined"
                                                onClick={() => handleSelectAnswer(idx)}
                                                disabled={showResult}
                                                sx={{
                                                    justifyContent: 'flex-start',
                                                    textAlign: 'left',
                                                    py: 1.5,
                                                    px: 2,
                                                    bgcolor: bgColor,
                                                    borderColor: borderColor,
                                                    color: textColor,
                                                    borderWidth: 2,
                                                    textTransform: 'none',
                                                    '&:hover': {
                                                        bgcolor: showResult ? bgColor : '#e0e7ff',
                                                        borderColor: showResult ? borderColor : '#6366f1',
                                                        borderWidth: 2,
                                                    },
                                                    '&.Mui-disabled': {
                                                        bgcolor: bgColor,
                                                        borderColor: borderColor,
                                                        color: textColor,
                                                    },
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 28,
                                                        height: 28,
                                                        borderRadius: '50%',
                                                        bgcolor: showResult && idx === question.correctAnswer
                                                            ? '#10b981'
                                                            : showResult && idx === selectedAnswer && !isCorrect
                                                                ? '#ef4444'
                                                                : selectedAnswer === idx
                                                                    ? '#6366f1'
                                                                    : 'grey.300',
                                                        color: 'white',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontWeight: 600,
                                                        fontSize: '0.85rem',
                                                        mr: 2,
                                                    }}
                                                >
                                                    {showResult && idx === question.correctAnswer ? (
                                                        <CheckCircleIcon sx={{ fontSize: 18 }} />
                                                    ) : showResult && idx === selectedAnswer && !isCorrect ? (
                                                        <CloseIcon sx={{ fontSize: 18 }} />
                                                    ) : (
                                                        String.fromCharCode(65 + idx)
                                                    )}
                                                </Box>
                                                {option}
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
                                                gap: 1.5,
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
                            </Box>
                        </Fade>
                    ) : null}
                </DialogContent>

                {!loadingQuiz && !quizComplete && question && (
                    <DialogActions sx={{ p: 2, pt: 0 }}>
                        {!showResult ? (
                            <Button
                                variant="contained"
                                onClick={handleSubmitAnswer}
                                disabled={selectedAnswer === null}
                                sx={{
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    px: 4,
                                }}
                            >
                                {currentQuestion < currentQuiz.questions.length - 1 ? 'Next Question' : 'See Results'}
                            </Button>
                        )}
                    </DialogActions>
                )}

                {quizComplete && (
                    <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            onClick={handleCloseQuiz}
                            sx={{
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                px: 4,
                            }}
                        >
                            Continue Learning
                        </Button>
                    </DialogActions>
                )}
            </Dialog>
        </>
    );
};

export default RoadmapCard;
