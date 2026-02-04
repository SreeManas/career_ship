import { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    CardActions,
    TextField,
    Button,
    Avatar,
    IconButton,
    Chip,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Divider,
    Fade,
    Collapse,
    Paper,
    InputAdornment,
} from '@mui/material';
import {
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon,
    ChatBubbleOutline as CommentIcon,
    Share as ShareIcon,
    Send as SendIcon,
    Add as AddIcon,
    Close as CloseIcon,
    Map as MapIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import {
    getPosts,
    createPost,
    toggleLike,
    addComment,
    getComments,
} from '../services/community';
import { useTranslations } from '../hooks/useTranslations';

const TEXTS = {
    communityFeed: 'Community Feed',
    shareJourney: 'Share your learning journey and connect with peers',
    shareRoadmap: 'Share your learning roadmap...',
    noPostsYet: 'No posts yet. Be the first to share!',
    share: 'Share',
    writeComment: 'Write a comment...',
    shareYourJourney: 'Share Your Learning Journey',
    title: 'Title',
    shareExperience: 'Share your experience',
    tagsLabel: 'Tags (comma separated)',
    cancel: 'Cancel',
    sharePost: 'Share Post',
    justNow: 'Just now',
};

const CommunityFeed = () => {
    const { user } = useAuth();
    const t = useTranslations(TEXTS);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openNewPost, setOpenNewPost] = useState(false);
    const [newPostData, setNewPostData] = useState({ title: '', content: '', tags: '' });
    const [submitting, setSubmitting] = useState(false);
    const [expandedComments, setExpandedComments] = useState({});
    const [comments, setComments] = useState({});
    const [newComment, setNewComment] = useState({});

    // Load posts
    const loadPosts = useCallback(async () => {
        try {
            setLoading(true);
            const fetchedPosts = await getPosts(30);
            setPosts(fetchedPosts);
        } catch (error) {
            console.error('Error loading posts:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadPosts();
    }, [loadPosts]);

    // Handle new post submission
    const handleSubmitPost = async () => {
        if (!newPostData.title.trim() || !newPostData.content.trim()) return;

        setSubmitting(true);
        try {
            const post = await createPost(
                user.uid,
                user.displayName,
                user.photoURL,
                {
                    title: newPostData.title,
                    content: newPostData.content,
                    tags: newPostData.tags.split(',').map(t => t.trim()).filter(Boolean),
                }
            );
            setPosts(prev => [{ ...post, createdAt: new Date() }, ...prev]);
            setOpenNewPost(false);
            setNewPostData({ title: '', content: '', tags: '' });
        } catch (error) {
            console.error('Error creating post:', error);
        } finally {
            setSubmitting(false);
        }
    };

    // Handle like
    const handleLike = async (postId) => {
        try {
            const isNowLiked = await toggleLike(postId, user.uid);
            setPosts(prev => prev.map(post => {
                if (post.id === postId) {
                    const likes = post.likes || [];
                    return {
                        ...post,
                        likes: isNowLiked
                            ? [...likes, user.uid]
                            : likes.filter(id => id !== user.uid),
                        likeCount: isNowLiked ? (post.likeCount || 0) + 1 : Math.max(0, (post.likeCount || 0) - 1),
                    };
                }
                return post;
            }));
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    // Toggle comments section
    const handleToggleComments = async (postId) => {
        const isExpanded = expandedComments[postId];

        if (!isExpanded && !comments[postId]) {
            try {
                const postComments = await getComments(postId);
                setComments(prev => ({ ...prev, [postId]: postComments }));
            } catch (error) {
                console.error('Error loading comments:', error);
            }
        }

        setExpandedComments(prev => ({ ...prev, [postId]: !isExpanded }));
    };

    // Submit comment
    const handleSubmitComment = async (postId) => {
        const commentText = newComment[postId]?.trim();
        if (!commentText) return;

        try {
            const comment = await addComment(
                postId,
                user.uid,
                user.displayName,
                user.photoURL,
                commentText
            );

            setComments(prev => ({
                ...prev,
                [postId]: [...(prev[postId] || []), { ...comment, createdAt: new Date() }],
            }));

            setPosts(prev => prev.map(post => {
                if (post.id === postId) {
                    return { ...post, commentCount: (post.commentCount || 0) + 1 };
                }
                return post;
            }));

            setNewComment(prev => ({ ...prev, [postId]: '' }));
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    // Format date
    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const now = new Date();
        const diffMs = now - d;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return d.toLocaleDateString();
    };

    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', pb: 6 }}>
            {/* Header */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
                    pt: 4,
                    pb: 8,
                    color: 'white',
                }}
            >
                <Container maxWidth="md">
                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                        {t.communityFeed}
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                        {t.shareJourney}
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="md" sx={{ mt: -4, position: 'relative', zIndex: 2 }}>
                {/* New Post Button */}
                <Fade in timeout={600}>
                    <Card sx={{ mb: 3, boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
                            <Avatar src={user?.photoURL} sx={{ bgcolor: 'primary.main' }}>
                                {user?.displayName?.charAt(0) || 'U'}
                            </Avatar>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => setOpenNewPost(true)}
                                sx={{
                                    justifyContent: 'flex-start',
                                    color: 'text.secondary',
                                    borderColor: 'grey.300',
                                    py: 1.5,
                                    '&:hover': { borderColor: 'primary.main' },
                                }}
                            >
                                {t.shareRoadmap}
                            </Button>
                            <IconButton
                                onClick={() => setOpenNewPost(true)}
                                sx={{
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    '&:hover': { bgcolor: 'primary.dark' },
                                }}
                            >
                                <AddIcon />
                            </IconButton>
                        </CardContent>
                    </Card>
                </Fade>

                {/* Posts Feed */}
                {posts.length === 0 ? (
                    <Card sx={{ textAlign: 'center', py: 6 }}>
                        <MapIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                            {t.noPostsYet}
                        </Typography>
                    </Card>
                ) : (
                    posts.map((post, index) => (
                        <Fade in timeout={800 + index * 100} key={post.id}>
                            <Card sx={{ mb: 3, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.06)' }}>
                                <CardContent>
                                    {/* Author Info */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                        <Avatar src={post.authorPhoto} sx={{ bgcolor: 'primary.main' }}>
                                            {post.authorName?.charAt(0) || 'U'}
                                        </Avatar>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                {post.authorName}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {formatDate(post.createdAt)}
                                            </Typography>
                                        </Box>
                                        {post.roadmapRole && (
                                            <Chip
                                                size="small"
                                                label={post.roadmapRole}
                                                sx={{ bgcolor: 'primary.light', color: 'white' }}
                                            />
                                        )}
                                    </Box>

                                    {/* Post Content */}
                                    <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                                        {post.title}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                                        {post.content}
                                    </Typography>

                                    {/* Tags */}
                                    {post.tags?.length > 0 && (
                                        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                                            {post.tags.map((tag, i) => (
                                                <Chip key={i} label={`#${tag}`} size="small" variant="outlined" />
                                            ))}
                                        </Box>
                                    )}
                                </CardContent>

                                <Divider />

                                {/* Actions */}
                                <CardActions sx={{ px: 2 }}>
                                    <Button
                                        size="small"
                                        startIcon={
                                            post.likes?.includes(user?.uid) ? (
                                                <FavoriteIcon sx={{ color: 'error.main' }} />
                                            ) : (
                                                <FavoriteBorderIcon />
                                            )
                                        }
                                        onClick={() => handleLike(post.id)}
                                        sx={{
                                            color: post.likes?.includes(user?.uid) ? 'error.main' : 'text.secondary',
                                        }}
                                    >
                                        {post.likeCount || 0}
                                    </Button>
                                    <Button
                                        size="small"
                                        startIcon={<CommentIcon />}
                                        onClick={() => handleToggleComments(post.id)}
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        {post.commentCount || 0}
                                    </Button>
                                    <Button
                                        size="small"
                                        startIcon={<ShareIcon />}
                                        sx={{ color: 'text.secondary', ml: 'auto' }}
                                    >
                                        Share
                                    </Button>
                                </CardActions>

                                {/* Comments Section */}
                                <Collapse in={expandedComments[post.id]}>
                                    <Divider />
                                    <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
                                        {/* Comment Input */}
                                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                            <Avatar
                                                src={user?.photoURL}
                                                sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}
                                            >
                                                {user?.displayName?.charAt(0) || 'U'}
                                            </Avatar>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                placeholder="Write a comment..."
                                                value={newComment[post.id] || ''}
                                                onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                                                onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment(post.id)}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleSubmitComment(post.id)}
                                                                disabled={!newComment[post.id]?.trim()}
                                                            >
                                                                <SendIcon fontSize="small" />
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Box>

                                        {/* Comments List */}
                                        {comments[post.id]?.map((comment) => (
                                            <Paper
                                                key={comment.id}
                                                elevation={0}
                                                sx={{ p: 1.5, mb: 1, bgcolor: 'white', borderRadius: 2 }}
                                            >
                                                <Box sx={{ display: 'flex', gap: 1.5 }}>
                                                    <Avatar
                                                        src={comment.authorPhoto}
                                                        sx={{ width: 28, height: 28, bgcolor: 'primary.main' }}
                                                    >
                                                        {comment.authorName?.charAt(0) || 'U'}
                                                    </Avatar>
                                                    <Box>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Typography variant="body2" fontWeight={600}>
                                                                {comment.authorName}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {formatDate(comment.createdAt)}
                                                            </Typography>
                                                        </Box>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {comment.text}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Paper>
                                        ))}
                                    </Box>
                                </Collapse>
                            </Card>
                        </Fade>
                    ))
                )}
            </Container>

            {/* New Post Dialog */}
            <Dialog
                open={openNewPost}
                onClose={() => setOpenNewPost(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6" fontWeight={600}>
                        Share Your Learning Journey
                    </Typography>
                    <IconButton onClick={() => setOpenNewPost(false)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Title"
                        placeholder="My journey to becoming a..."
                        value={newPostData.title}
                        onChange={(e) => setNewPostData(prev => ({ ...prev, title: e.target.value }))}
                        sx={{ mb: 2, mt: 1 }}
                    />
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Share your experience"
                        placeholder="Tell the community about your learning roadmap, what you've learned, challenges you faced..."
                        value={newPostData.content}
                        onChange={(e) => setNewPostData(prev => ({ ...prev, content: e.target.value }))}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Tags (comma separated)"
                        placeholder="javascript, learning, webdev"
                        value={newPostData.tags}
                        onChange={(e) => setNewPostData(prev => ({ ...prev, tags: e.target.value }))}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 0 }}>
                    <Button onClick={() => setOpenNewPost(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmitPost}
                        disabled={submitting || !newPostData.title.trim() || !newPostData.content.trim()}
                        sx={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        }}
                    >
                        {submitting ? <CircularProgress size={24} color="inherit" /> : 'Share Post'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CommunityFeed;
