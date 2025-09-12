import { User } from '../types';

const STORAGE_KEYS = {
  USERS: 'instagram_users',
  POSTS: 'instagram_posts',
  CURRENT_USER: 'instagram_current_user',
};

// User storage functions
// Deprecated: Use Firestore for user data
// export const saveUser = ...


// Post storage functions
// Deprecated: Use Firestore for post data
// export const savePost = ...


// Current user session
export const setCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
};

export const deleteUserById = (id: string) => {
  const users = JSON.parse(localStorage.getItem("users") || "[]") as User[];
  const updatedUsers = users.filter((u) => u.id !== id);
  localStorage.setItem("users", JSON.stringify(updatedUsers));
};

// Initialize sample data
export const initializeSampleData = (): void => {
};

// Get posts from localStorage
export const getPosts = (): any[] => {
  const posts = localStorage.getItem(STORAGE_KEYS.POSTS);
  return posts ? JSON.parse(posts) : [];
};

export const deletePost = (postId: string): void => {
  const posts = getPosts();
  const updatedPosts = posts.filter(post => post.id !== postId);
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updatedPosts));
};