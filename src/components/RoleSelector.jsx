import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Box,
    Typography,
    Paper,
    Chip,
} from '@mui/material';
import {
    Code as CodeIcon,
    Analytics as AnalyticsIcon,
    Brush as BrushIcon,
    Cloud as CloudIcon,
    Security as SecurityIcon,
    SmartToy as SmartToyIcon,
    PhoneAndroid as PhoneAndroidIcon,
    Storage as StorageIcon,
} from '@mui/icons-material';

const roles = [
    { value: 'software-developer', label: 'Software Developer', icon: CodeIcon, color: '#6366f1' },
    { value: 'data-scientist', label: 'Data Scientist', icon: AnalyticsIcon, color: '#10b981' },
    { value: 'ui-ux-designer', label: 'UI/UX Designer', icon: BrushIcon, color: '#ec4899' },
    { value: 'devops-engineer', label: 'DevOps Engineer', icon: CloudIcon, color: '#3b82f6' },
    { value: 'cybersecurity', label: 'Cybersecurity Specialist', icon: SecurityIcon, color: '#ef4444' },
    { value: 'ml-engineer', label: 'ML Engineer', icon: SmartToyIcon, color: '#8b5cf6' },
    { value: 'mobile-developer', label: 'Mobile Developer', icon: PhoneAndroidIcon, color: '#f59e0b' },
    { value: 'database-admin', label: 'Database Administrator', icon: StorageIcon, color: '#14b8a6' },
];

const skillLevels = [
    { value: 'beginner', label: 'Beginner', description: 'New to this field', color: '#10b981' },
    { value: 'intermediate', label: 'Intermediate', description: '1-3 years experience', color: '#f59e0b' },
    { value: 'advanced', label: 'Advanced', description: '3+ years experience', color: '#ef4444' },
];

const RoleSelector = ({ role, skillLevel, onRoleChange, onSkillLevelChange }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Role Selection */}
            <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Choose Your Career Path
                </Typography>
                <FormControl fullWidth>
                    <InputLabel id="role-select-label">Select Role</InputLabel>
                    <Select
                        labelId="role-select-label"
                        id="role-select"
                        value={role}
                        label="Select Role"
                        onChange={(e) => onRoleChange(e.target.value)}
                        sx={{
                            '& .MuiSelect-select': {
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                            },
                        }}
                    >
                        {roles.map((r) => {
                            const IconComponent = r.icon;
                            return (
                                <MenuItem
                                    key={r.value}
                                    value={r.value}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1.5,
                                        py: 1.5,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: 1,
                                            backgroundColor: `${r.color}15`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <IconComponent sx={{ color: r.color, fontSize: 20 }} />
                                    </Box>
                                    <Typography>{r.label}</Typography>
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>

                {/* Role Tags */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                    {roles.map((r) => {
                        const IconComponent = r.icon;
                        const isSelected = role === r.value;
                        return (
                            <Chip
                                key={r.value}
                                icon={<IconComponent sx={{ color: isSelected ? 'white' : r.color }} />}
                                label={r.label}
                                onClick={() => onRoleChange(r.value)}
                                sx={{
                                    backgroundColor: isSelected ? r.color : `${r.color}10`,
                                    color: isSelected ? 'white' : r.color,
                                    border: `1px solid ${isSelected ? r.color : 'transparent'}`,
                                    fontWeight: isSelected ? 600 : 400,
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        backgroundColor: isSelected ? r.color : `${r.color}20`,
                                        transform: 'scale(1.02)',
                                    },
                                }}
                            />
                        );
                    })}
                </Box>
            </Box>

            {/* Skill Level Selection */}
            <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Your Current Skill Level
                </Typography>
                <FormControl component="fieldset">
                    <RadioGroup
                        value={skillLevel}
                        onChange={(e) => onSkillLevelChange(e.target.value)}
                        sx={{ gap: 1.5 }}
                    >
                        {skillLevels.map((level) => (
                            <Paper
                                key={level.value}
                                elevation={0}
                                onClick={() => onSkillLevelChange(level.value)}
                                sx={{
                                    p: 2,
                                    cursor: 'pointer',
                                    border: '2px solid',
                                    borderColor: skillLevel === level.value ? level.color : 'grey.200',
                                    backgroundColor: skillLevel === level.value ? `${level.color}08` : 'transparent',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        borderColor: level.color,
                                        backgroundColor: `${level.color}05`,
                                    },
                                }}
                            >
                                <FormControlLabel
                                    value={level.value}
                                    control={
                                        <Radio
                                            sx={{
                                                color: 'grey.400',
                                                '&.Mui-checked': {
                                                    color: level.color,
                                                },
                                            }}
                                        />
                                    }
                                    label={
                                        <Box>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: skillLevel === level.value ? level.color : 'text.primary',
                                                }}
                                            >
                                                {level.label}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {level.description}
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{ m: 0, width: '100%' }}
                                />
                            </Paper>
                        ))}
                    </RadioGroup>
                </FormControl>
            </Box>
        </Box>
    );
};

export default RoleSelector;
