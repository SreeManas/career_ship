import { useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    useTheme,
    useMediaQuery,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    Chip,
    Badge,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Home as HomeIcon,
    Map as MapIcon,
    Dashboard as DashboardIcon,
    Groups as CommunityIcon,
    Quiz as QuizIcon,
    Login as LoginIcon,
    Logout as LogoutIcon,
    Person as PersonIcon,
    School as SchoolIcon,
    Star as StarIcon,
    Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';
import LanguageSelector from './LanguageSelector';
import { useTranslations } from '../hooks/useTranslations';

const TEXTS = {
    home: 'Home',
    roadmap: 'Roadmap',
    community: 'Community',
    dashboard: 'Dashboard',
    login: 'Login',
    logout: 'Logout',
    profileSettings: 'Profile Settings',
    pts: 'pts',
    level: 'Level',
};

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { user, logout } = useAuth();
    const { points, level } = useGamification();
    const t = useTranslations(TEXTS);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        handleMenuClose();
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const navItems = useMemo(() => [
        { text: t.home, path: '/home', icon: <HomeIcon /> },
        { text: t.roadmap, path: '/roadmap', icon: <MapIcon /> },
        { text: t.community, path: '/community', icon: <CommunityIcon /> },
        { text: t.dashboard, path: '/dashboard', icon: <DashboardIcon /> },
    ], [t]);

    // Get user display name or email initial
    const getUserInitial = () => {
        if (user?.displayName) {
            return user.displayName.charAt(0).toUpperCase();
        }
        if (user?.email) {
            return user.email.charAt(0).toUpperCase();
        }
        return 'U';
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', py: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <SchoolIcon sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    LearnPath
                </Typography>
            </Box>
            <Divider />

            {/* Points display in drawer */}
            <Box sx={{ py: 2, px: 2 }}>
                <Chip
                    icon={<StarIcon sx={{ color: '#f59e0b !important' }} />}
                    label={`${points} Points`}
                    sx={{
                        backgroundColor: '#fef3c7',
                        color: '#92400e',
                        fontWeight: 600,
                    }}
                />
            </Box>

            <List>
                {navItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            component={Link}
                            to={item.path}
                            selected={location.pathname === item.path}
                            sx={{
                                '&.Mui-selected': {
                                    backgroundColor: 'primary.light',
                                    color: 'white',
                                    '& .MuiListItemIcon-root': {
                                        color: 'white',
                                    },
                                },
                            }}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid',
                    borderColor: 'grey.200',
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {isMobile && user && (
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{ mr: 2, color: 'grey.700' }}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}
                        <Box
                            component={Link}
                            to={user ? '/home' : '/login'}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                textDecoration: 'none',
                            }}
                        >
                            <SchoolIcon sx={{ mr: 1, color: 'primary.main', fontSize: 32 }} />
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                LearnPath
                            </Typography>
                        </Box>
                    </Box>

                    {user && (
                        <>
                            {!isMobile && (
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                    {navItems.map((item) => (
                                        <Button
                                            key={item.text}
                                            component={Link}
                                            to={item.path}
                                            startIcon={item.icon}
                                            sx={{
                                                color: location.pathname === item.path ? 'primary.main' : 'grey.600',
                                                backgroundColor:
                                                    location.pathname === item.path ? 'primary.light' : 'transparent',
                                                '&:hover': {
                                                    backgroundColor:
                                                        location.pathname === item.path ? 'primary.light' : 'grey.100',
                                                },
                                                px: 2,
                                            }}
                                        >
                                            {item.text}
                                        </Button>
                                    ))}
                                </Box>
                            )}

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {/* Points chip */}
                                {!isMobile && (
                                    <Chip
                                        icon={<StarIcon sx={{ color: '#f59e0b !important' }} />}
                                        label={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Typography variant="body2" fontWeight={600}>
                                                    {points}
                                                </Typography>
                                                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                                    pts
                                                </Typography>
                                            </Box>
                                        }
                                        sx={{
                                            backgroundColor: '#fef3c7',
                                            color: '#92400e',
                                            fontWeight: 600,
                                            '&:hover': {
                                                backgroundColor: '#fde68a',
                                            },
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => navigate('/dashboard')}
                                    />
                                )}

                                {/* Language Selector */}
                                <LanguageSelector />

                                <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                                    <Avatar
                                        src={user.photoURL || undefined}
                                        sx={{
                                            bgcolor: level?.color || 'primary.main',
                                            width: 40,
                                            height: 40,
                                            border: '2px solid',
                                            borderColor: level?.color || 'primary.main',
                                        }}
                                    >
                                        {!user.photoURL && getUserInitial()}
                                    </Avatar>
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                    PaperProps={{
                                        sx: {
                                            mt: 1.5,
                                            minWidth: 220,
                                            boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)',
                                        },
                                    }}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                >
                                    <Box sx={{ px: 2, py: 1.5 }}>
                                        <Typography variant="subtitle2" fontWeight={600}>
                                            {user.displayName || 'User'}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            {user.email}
                                        </Typography>
                                        <Chip
                                            size="small"
                                            label={`Level ${level?.level} - ${level?.name}`}
                                            sx={{
                                                mt: 1,
                                                backgroundColor: level?.color,
                                                color: 'white',
                                                fontSize: '0.7rem',
                                            }}
                                        />
                                    </Box>
                                    <Divider />
                                    <MenuItem onClick={() => { handleMenuClose(); navigate('/dashboard'); }}>
                                        <DashboardIcon sx={{ mr: 1.5, color: 'grey.500' }} />
                                        <Typography>Dashboard</Typography>
                                    </MenuItem>
                                    <MenuItem onClick={() => { handleMenuClose(); navigate('/community'); }}>
                                        <CommunityIcon sx={{ mr: 1.5, color: 'grey.500' }} />
                                        <Typography>Community</Typography>
                                    </MenuItem>
                                    <MenuItem disabled>
                                        <PersonIcon sx={{ mr: 1.5, color: 'grey.500' }} />
                                        <Typography>Profile Settings</Typography>
                                    </MenuItem>
                                    <Divider />
                                    <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                                        <LogoutIcon sx={{ mr: 1.5 }} />
                                        <Typography>Logout</Typography>
                                    </MenuItem>
                                </Menu>
                            </Box>
                        </>
                    )}

                    {!user && location.pathname !== '/login' && (
                        <Button
                            component={Link}
                            to="/login"
                            variant="contained"
                            startIcon={<LoginIcon />}
                            sx={{
                                background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
                            }}
                        >
                            Login
                        </Button>
                    )}
                </Toolbar>
            </AppBar>

            {user && (
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
                    }}
                >
                    {drawer}
                </Drawer>
            )}

            {/* Toolbar spacer */}
            <Toolbar />
        </>
    );
};

export default Navbar;
