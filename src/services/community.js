import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    limit,
    where,
    arrayUnion,
    arrayRemove,
    increment,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// ==================== POSTS ====================

// Create a new post (share roadmap)
export const createPost = async (userId, userDisplayName, userPhotoURL, postData) => {
    const postsRef = collection(db, 'posts');

    const post = {
        userId,
        authorName: userDisplayName || 'Anonymous',
        authorPhoto: userPhotoURL || null,
        title: postData.title,
        content: postData.content,
        roadmapRole: postData.role || null,
        roadmapLevel: postData.level || null,
        tags: postData.tags || [],
        likes: [],
        likeCount: 0,
        commentCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(postsRef, post);
    return { id: docRef.id, ...post };
};

// Get all posts (community feed)
export const getPosts = async (limitCount = 20) => {
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, orderBy('createdAt', 'desc'), limit(limitCount));

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
    }));
};

// Get posts by user
export const getUserPosts = async (userId) => {
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
    }));
};

// Get single post
export const getPost = async (postId) => {
    const postRef = doc(db, 'posts', postId);
    const postDoc = await getDoc(postRef);

    if (!postDoc.exists()) return null;

    return {
        id: postDoc.id,
        ...postDoc.data(),
        createdAt: postDoc.data().createdAt?.toDate?.() || new Date(),
    };
};

// Like/unlike a post
export const toggleLike = async (postId, userId) => {
    const postRef = doc(db, 'posts', postId);
    const postDoc = await getDoc(postRef);

    if (!postDoc.exists()) return null;

    const likes = postDoc.data().likes || [];
    const isLiked = likes.includes(userId);

    if (isLiked) {
        await updateDoc(postRef, {
            likes: arrayRemove(userId),
            likeCount: increment(-1),
        });
    } else {
        await updateDoc(postRef, {
            likes: arrayUnion(userId),
            likeCount: increment(1),
        });
    }

    return !isLiked;
};

// Delete a post
export const deletePost = async (postId) => {
    const postRef = doc(db, 'posts', postId);
    await deleteDoc(postRef);
};

// ==================== COMMENTS ====================

// Add a comment to a post
export const addComment = async (postId, userId, userDisplayName, userPhotoURL, text) => {
    const commentsRef = collection(db, 'posts', postId, 'comments');
    const postRef = doc(db, 'posts', postId);

    const comment = {
        userId,
        authorName: userDisplayName || 'Anonymous',
        authorPhoto: userPhotoURL || null,
        text,
        createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(commentsRef, comment);

    // Increment comment count on post
    await updateDoc(postRef, {
        commentCount: increment(1),
    });

    return { id: docRef.id, ...comment };
};

// Get comments for a post
export const getComments = async (postId) => {
    const commentsRef = collection(db, 'posts', postId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'asc'));

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
    }));
};

// Delete a comment
export const deleteComment = async (postId, commentId) => {
    const commentRef = doc(db, 'posts', postId, 'comments', commentId);
    const postRef = doc(db, 'posts', postId);

    await deleteDoc(commentRef);

    await updateDoc(postRef, {
        commentCount: increment(-1),
    });
};

// ==================== NOTIFICATIONS ====================

// Create a notification
export const createNotification = async (userId, notification) => {
    const notificationsRef = collection(db, 'users', userId, 'notifications');

    const notif = {
        ...notification,
        read: false,
        createdAt: serverTimestamp(),
    };

    await addDoc(notificationsRef, notif);
};

// Get user notifications
export const getNotifications = async (userId, limitCount = 20) => {
    const notificationsRef = collection(db, 'users', userId, 'notifications');
    const q = query(notificationsRef, orderBy('createdAt', 'desc'), limit(limitCount));

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
    }));
};

// Mark notification as read
export const markNotificationRead = async (userId, notificationId) => {
    const notifRef = doc(db, 'users', userId, 'notifications', notificationId);
    await updateDoc(notifRef, { read: true });
};
