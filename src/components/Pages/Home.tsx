import React, { useState, useEffect } from "react";
import PostCard from "../Post/PostCard";
import PostModal from "../Post/EditPostModal";
import FullscreenModal from "../Post/ViewFullPostModal";
import { Post, User } from "../../types";
import { db } from "../../utils/firebase";
import { collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { arrayUnion } from "firebase/firestore";
import { useAuth } from "../../contexts/useAuth";

interface HomeProps {
  onUserClick: (username: string) => void;
}

const Home: React.FC<HomeProps> = ({ onUserClick }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null); // State for the selected post
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const { currentUser, logout } = useAuth();
    useEffect(() => {
      // Real-time posts listener
      const postsQuery = query(collection(db, "posts"), orderBy("timestamp", "desc"));
      const unsubscribePosts = onSnapshot(postsQuery, (postsSnapshot) => {
        const allPosts: Post[] = postsSnapshot.docs.map(doc => {
          const data = doc.data();
          let timestamp = data.timestamp;
          if (timestamp && typeof timestamp === "object" && typeof timestamp.toDate === "function") {
            timestamp = timestamp.toDate().getTime();
          }
          return { id: doc.id, ...data, timestamp } as Post;
        });
        setPosts(allPosts);
        setIsLoading(false);
      });

      // Load users (not real-time)
      const loadUsers = async () => {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const allUsers: User[] = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
        if (allUsers && allUsers.length > 0) {
          const filteredUsers = currentUser
            ? allUsers.filter((u) => u.id !== currentUser.id)
            : allUsers;
          setUsers(filteredUsers);
        } else if (currentUser) {
          setUsers([currentUser]);
        } else {
          setUsers([]);
        }
      };
      loadUsers();

      return () => {
        unsubscribePosts();
      };
    }, [currentUser]);

  const handleDeletePost = async (postId: string) => {
    await deleteDoc(doc(db, "posts", postId));
    setPosts(posts.filter((post) => post.id !== postId));
  };
  const handleEditPost = (post: Post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleSavePost = async (updatedPost: Post) => {
    const postData = { ...updatedPost };
    delete (postData as { id?: string }).id;
    await updateDoc(doc(db, "posts", updatedPost.id), postData);
    setPosts(posts.map((post) =>
      post.id === updatedPost.id ? updatedPost : post
    ));
    // Add post to current user's savedPosts in Firestore
    if (currentUser) {
      await updateDoc(doc(db, "users", currentUser.id), {
        savedPosts: arrayUnion(updatedPost.id)
      });
    }
  };

  const handleViewPostFullscreen = (post: Post) => {
    setSelectedPost(post); // Set the selected post for viewing
    setIsFullscreenOpen(true); // Open the fullscreen modal
  };

  // Listen for storage changes to refresh posts when new ones are created
  // Real-time updates now handled by onSnapshot above

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <>
        <div className="text-center pl-0 md:pl-20 lg:pl-60 lg:pr-80 py-20">
          <div className="text-gray-500">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              No posts yet
            </h3>
            <p className="text-gray-600">
              When you share photos, they'll appear on your feed.
            </p>
          </div>
        </div>
        <div></div>
      </>
    );
  }

  return (
    <div className="flex justify-between gap-10 pl-0 md:pl-20 lg:pl-60">
      <div
        className={`${isModalOpen || isFullscreenOpen ? "blur-sm" : ""}, py-4`}
      >
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onUserClick={onUserClick}
            onDeletePost={handleDeletePost}
            onEditPost={handleEditPost}
            onViewPostFullscreen={handleViewPostFullscreen}
          />
        ))}
        {isModalOpen && (
          <PostModal
            post={selectedPost}
            onClose={() => setIsModalOpen(false)} // Close the modal
            onSave={handleSavePost} // Save the edited post
          />
        )}
        {isFullscreenOpen && (
          <FullscreenModal
            post={selectedPost}
            onClose={() => setIsFullscreenOpen(false)} // Close the fullscreen modal
          />
        )}
      </div>
      <div
        className={`hidden lg:block w-96 h-fit sticky top-20 self-start mt-4 ml-4 p-4 bg-white border border-gray-200 rounded-lg `}
      >
        {/* Current User Section */}
        {currentUser && (
          <div
            className="flex w-full justify-between items-center mb-6 cursor-pointer"
            onClick={() => onUserClick(currentUser.username)}
          >
            <div className="flex items-center">
              <img
                src={currentUser.avatar}
                alt={currentUser.username}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-800">
                  {currentUser.username}
                </h3>
                <p className="text-xs text-gray-500">{currentUser.name}</p>
              </div>
            </div>
            <button className="text-blue-500 hover:underline" onClick={logout}>
              Switch
            </button>
          </div>
        )}

        {/* Suggested Users */}
        <div className="flex">
          <h3 className="text-lg font-medium text-gray-800">
            Suggested for You
          </h3>
          <button className="ml-auto text-gray-500 hover:text-gray-800">
            See All
          </button>
        </div>

        {/* Users list */}
        <div className="mt-6 space-y-5">
          {users.slice(0, 5).map((user) => (
            <div
              key={user.id}
              className="flex w-full justify-between items-center"
            >
              <div
                className="flex items-center cursor-pointer"
                onClick={() => onUserClick(user.username)}
              >
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-800">
                    {user.username}
                  </h3>
                  <p className="text-xs text-gray-500">{user.name}</p>
                </div>
              </div>
              <div>
                <button className="text-blue-500 hover:underline">
                  Follow
                </button>
              </div>
            </div>
          ))}

          {/* If no users found */}
          {users.length === 0 && (
            <p className="text-gray-500 text-sm text-center">
              No suggestions available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
