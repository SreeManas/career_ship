import { useState, useMemo } from 'react';
import {
    Box,
    Button,
    Menu,
    MenuItem,
    TextField,
    Typography,
    InputAdornment,
    ListSubheader,
} from '@mui/material';
import {
    Language as LanguageIcon,
    Search as SearchIcon,
    Check as CheckIcon,
    KeyboardArrowDown as ArrowDownIcon,
} from '@mui/icons-material';
import { useLanguage } from '../context/LanguageContext';

const LanguageSelector = () => {
    const { currentLanguage, changeLanguage, languages, isTranslating } = useLanguage();
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const currentLangInfo = languages.find(l => l.code === currentLanguage) || languages[0];

    const filteredLanguages = useMemo(() => {
        if (!searchQuery) return languages;
        const query = searchQuery.toLowerCase();
        return languages.filter(
            lang =>
                lang.name.toLowerCase().includes(query) ||
                lang.nativeName.toLowerCase().includes(query) ||
                lang.code.toLowerCase().includes(query)
        );
    }, [languages, searchQuery]);

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSearchQuery('');
    };

    const handleSelectLanguage = (langCode) => {
        changeLanguage(langCode);
        handleClose();
    };

    return (
        <>
            <Button
                onClick={handleOpen}
                disabled={isTranslating}
                sx={{
                    color: 'text.primary',
                    textTransform: 'none',
                    minWidth: 'auto',
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 2,
                    bgcolor: 'grey.100',
                    '&:hover': {
                        bgcolor: 'grey.200',
                    },
                }}
            >
                <LanguageIcon sx={{ fontSize: 20, mr: 0.5 }} />
                <Typography variant="body2" fontWeight={500} sx={{ mr: 0.5 }}>
                    {currentLangInfo.nativeName}
                </Typography>
                <ArrowDownIcon sx={{ fontSize: 18 }} />
            </Button>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        sx: {
                            width: 320,
                            maxHeight: 450,
                            display: 'flex',
                            flexDirection: 'column',
                        },
                    },
                }}
            >
                {/* Search Box - Fixed at top */}
                <Box sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider', flexShrink: 0 }}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Search languages..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ fontSize: 20, color: 'grey.500' }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                            },
                        }}
                        onClick={(e) => e.stopPropagation()}
                    />
                </Box>

                {/* Language count */}
                <ListSubheader sx={{ bgcolor: 'grey.50', lineHeight: '32px', flexShrink: 0 }}>
                    {filteredLanguages.length} languages
                </ListSubheader>

                {/* Scrollable Language List */}
                <Box sx={{
                    overflowY: 'auto',
                    flex: 1,
                    maxHeight: 300,
                }}>
                    {filteredLanguages.map((lang) => (
                        <MenuItem
                            key={lang.code}
                            onClick={() => handleSelectLanguage(lang.code)}
                            selected={lang.code === currentLanguage}
                            sx={{
                                py: 1,
                                '&.Mui-selected': {
                                    bgcolor: 'primary.lighter',
                                    '&:hover': {
                                        bgcolor: 'primary.light',
                                    },
                                },
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="body2" fontWeight={500}>
                                        {lang.nativeName}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {lang.name}
                                    </Typography>
                                </Box>
                                {lang.code === currentLanguage && (
                                    <CheckIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                                )}
                            </Box>
                        </MenuItem>
                    ))}

                    {filteredLanguages.length === 0 && (
                        <Box sx={{ p: 2, textAlign: 'center' }}>
                            <Typography color="text.secondary" variant="body2">
                                No languages found
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Menu>
        </>
    );
};

export default LanguageSelector;
