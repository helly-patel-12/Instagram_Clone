import { User, Post } from '../types';

const STORAGE_KEYS = {
  USERS: 'instagram_users',
  POSTS: 'instagram_posts',
  CURRENT_USER: 'instagram_current_user',
};

// User storage functions
export const saveUser = (user: User): void => {
  const users = getUsers();
  const existingIndex = users.findIndex(u => u.id === user.id);
  
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const getUsers = (): User[] => {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
};

export const getUserById = (id: string): User | null => {
  const users = getUsers();
  return users.find(user => user.id === id) || null;
};

export const getUserByUsername = (username: string): User | null => {
  const users = getUsers();
  return users.find(user => user.username.toLowerCase() === username.toLowerCase()) || null;
};

// Post storage functions
export const savePost = (post: Post): void => {
  const posts = getPosts();
  const existingIndex = posts.findIndex(p => p.id === post.id);
  
  if (existingIndex >= 0) {
    posts[existingIndex] = post;
  } else {
    posts.push(post);
  }
  
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
};

export const getPosts = (): Post[] => {
  const posts = localStorage.getItem(STORAGE_KEYS.POSTS);
  return posts ? JSON.parse(posts) : [];
};

export const getPostById = (id: string): Post | null => {
  const posts = getPosts();
  return posts.find(post => post.id === id) || null;
};

export const getPostsByUserId = (userId: string): Post[] => {
  const posts = getPosts();
  return posts.filter(post => post.userId === userId);
};

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
  // if (getUsers().length === 0) {
  //   const sampleUsers: User[] = [
  //     {
  //       id: '1',
  //       username: 'hellypatel',
  //       email: 'helly@example.com',
  //       bio: 'Photography enthusiast 📸\nLove capturing moments ✨',
  //       avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
  //       followers: ['2', '3'],
  //       following: ['2'],
  //       posts: ['1', '2']
  //     },
  //     {
  //       id: '2',
  //       username: 'vedantidave',
  //       email: 'vedanti@example.com',
  //       bio: 'Travel blogger 🌍\nExploring the world one city at a time',
  //       avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
  //       followers: ['1', '3'],
  //       following: ['1', '3'],
  //       posts: ['3', '4']
  //     },
  //     {
  //       id: '3',
  //       username: 'varunpatani',
  //       email: 'varun@example.com',
  //       bio: 'Fitness coach 💪\nHelping you achieve your goals',
  //       avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
  //       followers: ['1', '2'],
  //       following: ['1', '2'],
  //       posts: ['5', '6']
  //     }
  //   ];

  //   const samplePosts: Post[] = [
  //     {
  //       id: '1',
  //       userId: '1',
  //       imageUrl: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=800',
  //       caption: 'Beautiful sunset at the beach 🌅 #sunset #photography',
  //       likes: ['2', '3'],
  //       comments: [
  //         {
  //           id: '1',
  //           userId: '2',
  //           username: 'vedantidave',
  //           text: 'Stunning shot! 😍',
  //           timestamp: Date.now() - 86400000
  //         }
  //       ],
  //       timestamp: Date.now() - 172800000
  //     },
  //     {
  //       id: '2',
  //       userId: '1',
  //       imageUrl: 'https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=800',
  //       caption: 'Mountain hiking adventure 🏔️ #hiking #nature',
  //       likes: ['1'],
  //       comments: [{
  //         id: '2',
  //         userId: '1',
  //         username: 'varunpatani',
  //         text: 'Stunning view! 😍',
  //         timestamp: Date.now() - 86400000
  //       }],
  //       timestamp: Date.now() - 259200000
  //     },
  //     {
  //       id: '3',
  //       userId: '2',
  //       imageUrl: 'https://images.unsplash.com/photo-1585944285854-d06c019aaca3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGFyaXMlMjBzdHJlZXR8ZW58MHx8MHx8fDA%3D',
  //       caption: 'Exploring the streets of Paris 🇫🇷 #travel #paris',
  //       likes: ['1', '3'],
  //       comments: [
  //         {
  //           id: '3',
  //           userId: '1',
  //           username: 'hellypatel',
  //           text: 'Amazing weather!',
  //           timestamp: Date.now() - 172800000
  //         }
  //       ],
  //       timestamp: Date.now() - 345600000
  //     },
  //     {
  //       id: '4',
  //       userId: '2',
  //       imageUrl: 'https://plus.unsplash.com/premium_photo-1669406526364-3fbf4ee71283?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Q29mZmVlJTIwYW5kJTIwY3JvaXNzYW50c3xlbnwwfHwwfHx8MA%3D%3D',
  //       caption: 'Coffee and croissants ☕🥐 #foodie #breakfast',
  //       likes: ['1'],
  //       comments: [
  //         {
  //           id: '4',
  //           userId: '3',
  //           username: 'varunpatani',
  //           text: 'Delicious! 😋',
  //           timestamp: Date.now() - 86400000
  //         }
  //       ],
  //       timestamp: Date.now() - 432000000
  //     },
  //     {
  //       id: '5',
  //       userId: '3',
  //       imageUrl: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800',
  //       caption: 'Morning workout session 💪 #fitness #motivation',
  //       likes: ['1', '2'],
  //       comments: [
  //         {
  //           id: '5',
  //           userId: '2',
  //           username: 'vedantidave',
  //           text: 'Keep it up! 🔥',
  //           timestamp: Date.now() - 86400000
  //         }
  //       ],
  //       timestamp: Date.now() - 518400000
  //     },
  //     {
  //       id: '6',
  //       userId: '3',
  //       imageUrl: 'https://www.pexels.com/photo/top-view-photo-of-food-dessert-1099680/',
  //       caption: 'Healthy meal prep for the week 🥗 #mealprep #healthy',
  //       likes: ['1'],
  //       comments: [
  //         {
  //           id: '6',
  //           userId: '2',
  //           username: 'hellypatel',
  //           text: 'Looks delicious! 😋',
  //           timestamp: Date.now() - 86400000
  //         }
  //       ],
  //       timestamp: Date.now() - 604800000
  //     },
  //     {
  //       id: '7',
  //       userId: '2',
  //       imageUrl: 'https://www.pexels.com/video/majestic-waterfall-in-the-french-alps-30238362/',
  //       caption: 'Witnessing one of the greatest waterfall around the world! 🌍💦',
  //       likes: ['2'],
  //       comments: [
  //         {
  //           id: '7',
  //           userId: '1',
  //           username: 'hellypatel',
  //           text: 'Looks fantastic! 😍',
  //           timestamp: Date.now() - 86400000
  //         }
  //       ],
  //       timestamp: Date.now() - 604800000
  //     }, 
  //     {
  //       id: '8',
  //       userId: '1',
  //       imageUrl: 'https://www.pexels.com/photo/selective-focus-photography-of-pasta-with-tomato-and-basil-1279330/',
  //       caption: 'Delicious pasta dish! 😍',
  //       likes: ['2'],
  //       comments: [
  //         {
  //           id: '7',
  //           userId: '2',
  //           username: 'vedantidave',
  //           text: 'Looks delicious! 😋',
  //           timestamp: Date.now() - 86400000
  //         }
  //       ],
  //       timestamp: Date.now() - 604800000
  //     },
  //     {
  //       id: '9',
  //       userId: '3',
  //       imageUrl: 'https://www.pexels.com/photo/selective-focus-photography-of-pasta-with-tomato-and-basil-1279330/',
  //       caption: 'Delicious pasta dish! 😍',
  //       likes: ['2'],
  //       comments: [
  //         {
  //           id: '8',
  //           userId: '2',
  //           username: 'vedantidave',
  //           text: 'Looks delicious! 😋',
  //           timestamp: Date.now() - 86400000
  //         }
  //       ],
  //       timestamp: Date.now() - 604800000
  //     }
  //   ];

  //   sampleUsers.forEach(saveUser);
  //   samplePosts.forEach(savePost);
  // }
};

export const deletePost = (postId: string): void => {
  const posts = getPosts();
  const updatedPosts = posts.filter(post => post.id !== postId);
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updatedPosts));
};