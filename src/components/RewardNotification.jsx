import { Box, Snackbar, Alert, Typography, Chip } from '@mui/material';
import { useGamification } from '../context/GamificationContext';

const RewardNotification = () => {
    const { recentReward, clearRecentReward } = useGamification();

    if (!recentReward) return null;

    const hasBadges = recentReward.badges && recentReward.badges.length > 0;

    return (
        <Snackbar
            open={!!recentReward}
            autoHideDuration={4000}
            onClose={clearRecentReward}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            sx={{ mt: 8 }}
        >
            <Alert
                onClose={clearRecentReward}
                severity="success"
                variant="filled"
                sx={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    minWidth: 300,
                    boxShadow: '0px 8px 24px rgba(16, 185, 129, 0.4)',
                }}
            >
                <Box>
                    <Typography variant="subtitle1" fontWeight={700}>
                        🎉 +{recentReward.points} Points!
                    </Typography>
                    {hasBadges && (
                        <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                                New Badge{recentReward.badges.length > 1 ? 's' : ''} Earned:
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                {recentReward.badges.map((badge) => (
                                    <Chip
                                        key={badge.id}
                                        label={`${badge.icon} ${badge.name}`}
                                        size="small"
                                        sx={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                            color: 'white',
                                            fontWeight: 600,
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}
                </Box>
            </Alert>
        </Snackbar>
    );
};

export default RewardNotification;
