export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  password: string;
  bio: string;
  avatar: string;
  followers: string[];
  following: string[];
  posts: string[];
  savedPosts: string[];
}

export interface Post {
  id: string;
  userId: string;
  imageUrl: string;
  caption: string;
  likes: string[];
  comments: Comment[];
  timestamp: number;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
}