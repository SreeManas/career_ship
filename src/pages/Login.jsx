import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Container,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    IconButton,
    InputAdornment,
    Divider,
    Link,
    Alert,
    CircularProgress,
    Tabs,
    Tab,
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Email as EmailIcon,
    Lock as LockIcon,
    Google as GoogleIcon,
    GitHub as GitHubIcon,
    School as SchoolIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useTranslations } from '../hooks/useTranslations';

const TEXTS = {
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signInDesc: 'Sign in to continue your learning journey',
    signUpDesc: 'Create an account to get started',
    fullName: 'Full Name',
    emailAddress: 'Email Address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot password?',
    createAccount: 'Create Account',
    orContinueWith: 'or continue with',
    dontHaveAccount: "Don't have an account?",
    signUpFree: 'Sign up for free',
    alreadyHaveAccount: 'Already have an account?',
    fillRequired: 'Please fill in all required fields',
    enterFullName: 'Please enter your full name',
    passwordLength: 'Password must be at least 6 characters',
    passwordsNoMatch: 'Passwords do not match',
};

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, signIn, signUp, signInWithGoogle, error, clearError, loading } = useAuth();
    const t = useTranslations(TEXTS);

    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tabValue, setTabValue] = useState(0); // 0 = Login, 1 = Sign Up
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        displayName: '',
        confirmPassword: '',
    });
    const [formError, setFormError] = useState('');

    // Get the redirect path from location state
    const from = location.state?.from?.pathname || '/home';

    // Redirect if already logged in
    useEffect(() => {
        if (user && !loading) {
            navigate(from, { replace: true });
        }
    }, [user, loading, navigate, from]);

    // Clear errors when switching tabs
    useEffect(() => {
        clearError();
        setFormError('');
    }, [tabValue, clearError]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setFormError('');
        clearError();
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setFormData({
            email: '',
            password: '',
            displayName: '',
            confirmPassword: '',
        });
    };

    const validateForm = () => {
        if (!formData.email || !formData.password) {
            setFormError(t.fillRequired);
            return false;
        }

        if (tabValue === 1) {
            // Sign Up validation
            if (!formData.displayName) {
                setFormError(t.enterFullName);
                return false;
            }
            if (formData.password.length < 6) {
                setFormError(t.passwordLength);
                return false;
            }
            if (formData.password !== formData.confirmPassword) {
                setFormError(t.passwordsNoMatch);
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        setFormError('');

        try {
            if (tabValue === 0) {
                // Login
                await signIn(formData.email, formData.password);
            } else {
                // Sign Up
                await signUp(formData.email, formData.password, formData.displayName);
            }
            navigate(from, { replace: true });
        } catch (err) {
            // Error is handled by AuthContext
            console.error('Auth error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsSubmitting(true);
        setFormError('');
        try {
            await signInWithGoogle();
            navigate(from, { replace: true });
        } catch (err) {
            console.error('Google sign-in error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show loading if checking auth state
    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #ec4899 100%)',
                }}
            >
                <CircularProgress sx={{ color: 'white' }} />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #ec4899 100%)',
                py: 4,
            }}
        >
            {/* Background decorations */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '10%',
                    left: '10%',
                    width: 300,
                    height: 300,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    filter: 'blur(60px)',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '10%',
                    right: '10%',
                    width: 400,
                    height: 400,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.08)',
                    filter: 'blur(80px)',
                }}
            />

            <Container maxWidth="sm">
                <Card
                    sx={{
                        backdropFilter: 'blur(20px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        boxShadow: '0px 24px 64px rgba(0, 0, 0, 0.2)',
                        overflow: 'visible',
                    }}
                >
                    <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
                        {/* Logo */}
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <Box
                                sx={{
                                    width: 72,
                                    height: 72,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 16px',
                                    boxShadow: '0px 8px 24px rgba(99, 102, 241, 0.3)',
                                }}
                            >
                                <SchoolIcon sx={{ fontSize: 36, color: 'white' }} />
                            </Box>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    mb: 1,
                                }}
                            >
                                LearnPath
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {tabValue === 0
                                    ? t.signInDesc
                                    : t.signUpDesc
                                }
                            </Typography>
                        </Box>

                        {/* Tabs */}
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            variant="fullWidth"
                            sx={{
                                mb: 3,
                                '& .MuiTab-root': {
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                },
                                '& .Mui-selected': {
                                    color: 'primary.main',
                                },
                                '& .MuiTabs-indicator': {
                                    height: 3,
                                    borderRadius: 1.5,
                                    background: 'linear-gradient(90deg, #6366f1 0%, #ec4899 100%)',
                                },
                            }}
                        >
                            <Tab label={t.signIn} />
                            <Tab label={t.signUp} />
                        </Tabs>

                        {/* Error Alert */}
                        {(error || formError) && (
                            <Alert
                                severity="error"
                                sx={{ mb: 3 }}
                                onClose={() => {
                                    clearError();
                                    setFormError('');
                                }}
                            >
                                {formError || error}
                            </Alert>
                        )}

                        {/* Login/SignUp Form */}
                        <form onSubmit={handleSubmit}>
                            {tabValue === 1 && (
                                <TextField
                                    fullWidth
                                    name="displayName"
                                    label="Full Name"
                                    type="text"
                                    value={formData.displayName}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonIcon color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 2 }}
                                />
                            )}

                            <TextField
                                fullWidth
                                name="email"
                                label="Email Address"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ mb: 2 }}
                            />

                            <TextField
                                fullWidth
                                name="password"
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon color="action" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ mb: tabValue === 1 ? 2 : 1 }}
                            />

                            {tabValue === 1 && (
                                <TextField
                                    fullWidth
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ mb: 2 }}
                                />
                            )}

                            {tabValue === 0 && (
                                <Box sx={{ textAlign: 'right', mb: 3 }}>
                                    <Link
                                        component={RouterLink}
                                        to="/forgot-password"
                                        underline="hover"
                                        sx={{ color: 'primary.main', fontSize: '0.875rem' }}
                                    >
                                        {t.forgotPassword}
                                    </Link>
                                </Box>
                            )}

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={isSubmitting}
                                sx={{
                                    py: 1.5,
                                    mt: tabValue === 1 ? 1 : 0,
                                    background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
                                    boxShadow: '0px 8px 24px rgba(99, 102, 241, 0.3)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                                        boxShadow: '0px 12px 32px rgba(99, 102, 241, 0.4)',
                                    },
                                    '&:disabled': {
                                        background: 'grey.300',
                                    },
                                }}
                            >
                                {isSubmitting ? (
                                    <CircularProgress size={24} sx={{ color: 'white' }} />
                                ) : (
                                    tabValue === 0 ? t.signIn : t.createAccount
                                )}
                            </Button>
                        </form>

                        {/* Divider */}
                        <Divider sx={{ my: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                                {t.orContinueWith}
                            </Typography>
                        </Divider>

                        {/* Social Login */}
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<GoogleIcon />}
                                onClick={handleGoogleSignIn}
                                disabled={isSubmitting}
                                sx={{
                                    py: 1.2,
                                    borderColor: 'grey.300',
                                    color: 'text.primary',
                                    '&:hover': {
                                        borderColor: '#db4437',
                                        backgroundColor: 'rgba(219, 68, 55, 0.04)',
                                        color: '#db4437',
                                    },
                                }}
                            >
                                Google
                            </Button>
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<GitHubIcon />}
                                disabled
                                sx={{
                                    py: 1.2,
                                    borderColor: 'grey.300',
                                    color: 'text.secondary',
                                    '&:disabled': {
                                        borderColor: 'grey.200',
                                        color: 'grey.400',
                                    },
                                }}
                            >
                                GitHub
                            </Button>
                        </Box>

                        {/* Switch between Login/SignUp */}
                        <Box sx={{ textAlign: 'center', mt: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                                {tabValue === 0 ? (
                                    <>
                                        {t.dontHaveAccount}{' '}
                                        <Link
                                            component="button"
                                            variant="body2"
                                            onClick={() => setTabValue(1)}
                                            sx={{ color: 'primary.main', fontWeight: 600 }}
                                        >
                                            {t.signUpFree}
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        {t.alreadyHaveAccount}{' '}
                                        <Link
                                            component="button"
                                            variant="body2"
                                            onClick={() => setTabValue(0)}
                                            sx={{ color: 'primary.main', fontWeight: 600 }}
                                        >
                                            {t.signIn}
                                        </Link>
                                    </>
                                )}
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default Login;
