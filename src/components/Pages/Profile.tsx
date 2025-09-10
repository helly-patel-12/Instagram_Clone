import React, { useState, useEffect } from "react";
import {
  Settings,
  Grid,
  Bookmark,
  Tag,
  LogOut,
  Trash2,
  X,
} from "lucide-react";
import { User, Post } from "../../types";
import {
  getUserByUsername,
  getPostsByUserId,
  getUserById,
  getPosts,
} from "../../utils/storage";
import { useAuth } from "../../contexts/AuthContext";
import EditProfile from "../Profile/EditProfile";
import ViewFullPostModal from "../Post/ViewFullPostModal";
import { deleteUserById } from "../../utils/storage";

interface SettingsModalProps {
  onClose: () => void;
  onLogout: () => void;
  onDeleteUser: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  onLogout,
  onDeleteUser,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white rounded-lg shadow-lg w-80 p-6 relative">
      <button
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        onClick={onClose}
      >
        <X className="w-5 h-5" />
      </button>
      <h2 className="text-lg font-semibold mb-4 text-center">Settings</h2>
      <ul className="space-y-3">
        <li>
          <button
            className="flex items-center w-full px-3 py-2 rounded hover:bg-gray-100 text-red-600"
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure you want to delete your account? This cannot be undone."
                )
              ) {
                onDeleteUser();
              }
              onClose();
            }}
          >
            <Trash2 className="w-4 h-4 mr-2" /> Delete User
          </button>
        </li>
        <li>
          <button
            className="flex items-center w-full px-3 py-2 rounded hover:bg-gray-100"
            onClick={() => {
              onLogout();
              onClose();
            }}
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </button>
        </li>
        <li>
          <button
            className="flex items-center w-full px-3 py-2 rounded hover:bg-gray-100"
            onClick={onClose}
          >
            <X className="w-4 h-4 mr-2" /> Cancel
          </button>
        </li>
      </ul>
    </div>
  </div>
);

interface ProfileProps {
  selectedUser: string | null;
  onUserClick: (username: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ selectedUser }) => {
  const { currentUser, logout, updateCurrentUser } = useAuth();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [isLoading, setIsLoading] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [selectedUser, currentUser]);

  const loadProfile = React.useCallback(() => {
    setIsLoading(true);

    let user: User | null = null;

    if (selectedUser) {
      user = getUserByUsername(selectedUser);
    } else if (currentUser) {
      user = getUserById(currentUser.id) || currentUser;
    }

    if (user) {
      setProfileUser(user);
      const posts = getPostsByUserId(user.id);
      const sortedPosts = posts.sort((a, b) => b.timestamp - a.timestamp);
      setUserPosts(sortedPosts);
    }

    setIsLoading(false);
  }, [selectedUser, currentUser]);

  const isOwnProfile =
    !selectedUser || (currentUser && profileUser?.id === currentUser.id);

  const handleFollowToggle = () => {
    if (!currentUser || !profileUser || isOwnProfile) return;

    const isFollowing = currentUser.following.includes(profileUser.id);

    // This would typically update the backend, but for demo purposes we'll just show the UI change
    // In a real app, you'd update both users' follower/following arrays
    console.log(
      isFollowing ? "Unfollowing" : "Following",
      profileUser.username
    );
  };

  const handleProfileSave = (updatedUser: User) => {
    updateCurrentUser(updatedUser);
    setProfileUser(updatedUser);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="text-center py-20">
        <h3 className="text-lg font-medium text-gray-800 mb-2">
          User not found
        </h3>
        <p className="text-gray-600">
          The user you're looking for doesn't exist.
        </p>
      </div>
    );
  }

  const isFollowing = currentUser?.following.includes(profileUser.id) || false;

  return (
    <div className="max-w-4xl mx-auto py-8 md:pl-6 pl-60">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 mb-8">
        <div className="p-1 ml-0 md:ml-10 sm:ml-0 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
          <img
            src={profileUser.avatar}
            alt={profileUser.username}
            className="w-40 h-40 md:w-32 md:h-32 rounded-full object-cover border-2 border-spacing-1 border-white"
          />
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4 mb-4">
            <h1 className="text-2xl font-light">{profileUser.username}</h1>

            <div className="flex space-x-2">
              {isOwnProfile ? (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowEditProfile(true)}
                    className="px-4 py-1 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Edit profile
                  </button>
                  <button
                    onClick={() => setShowSettingsModal(true)}
                    className="px-4 py-1 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleFollowToggle}
                  className={`px-6 py-1 rounded-md text-sm font-medium transition-colors ${
                    isFollowing
                      ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-center md:justify-start space-x-8 mb-4">
            <div className="text-center">
              <span className="font-semibold">{userPosts.length}</span>
              <span className="text-gray-600 ml-1">posts</span>
            </div>
            <div className="text-center">
              <span className="font-semibold">
                {profileUser.followers.length}
              </span>
              <span className="text-gray-600 ml-1">followers</span>
            </div>
            <div className="text-center">
              <span className="font-semibold">
                {profileUser.following.length}
              </span>
              <span className="text-gray-600 ml-1">following</span>
            </div>
          </div>

          {profileUser.bio && (
            <div className="text-sm whitespace-pre-line">{profileUser.bio}</div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-200">
        <div className="flex justify-center space-x-16">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex items-center space-x-1 py-3 text-xs font-medium uppercase tracking-wide border-t-2 transition-colors ${
              activeTab === "posts"
                ? "border-gray-800 text-gray-800"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Posts</span>
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`flex items-center space-x-1 py-3 text-xs font-medium uppercase tracking-wide border-t-2 transition-colors ${
              activeTab === "saved"
                ? "border-gray-800 text-gray-800"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved</span>
          </button>
          <button
            onClick={() => setActiveTab("tagged")}
            className={`flex items-center space-x-1 py-3 text-xs font-medium uppercase tracking-wide border-t-2 transition-colors ${
              activeTab === "tagged"
                ? "border-gray-800 text-gray-800"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Tagged</span>
          </button>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="mt-6">
        {activeTab === "posts" && (
          <div>
            {userPosts.length > 0 ? (
              <div className="grid grid-cols-3 gap-1 md:gap-4">
                {userPosts.map((post) => (
                  <div
                    key={post.id}
                    className="aspect-square bg-gray-100 overflow-hidden group cursor-pointer"
                    onClick={() => setSelectedPost(post)}
                  >
                    <img
                      src={post.imageUrl}
                      alt="Post"
                      className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Grid className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  No posts yet
                </h3>
                <p className="text-gray-600">
                  {isOwnProfile
                    ? "When you share photos, they'll appear here."
                    : "No posts to show."}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "saved" && (
          <div>
            {currentUser?.savedPosts && currentUser.savedPosts.length > 0 ? (
              <div className="grid grid-cols-3 gap-1 md:gap-4">
                {getPosts()
                  .filter((post: Post) =>
                    currentUser.savedPosts?.includes(post.id)
                  )
                  .map((post: Post) => (
                    <div
                      key={post.id}
                      className="aspect-square bg-gray-100 overflow-hidden group cursor-pointer"
                      onClick={() => setSelectedPost(post)}
                    >
                      <img
                        src={post.imageUrl}
                        alt="Post"
                        className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                      />
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Bookmark className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  No saved posts
                </h3>
                <p className="text-gray-600">Save posts to see them here.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "tagged" && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Tag className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              No tagged posts
            </h3>
            <p className="text-gray-600">
              Posts where you're tagged will appear here.
            </p>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <EditProfile
          onClose={() => setShowEditProfile(false)}
          onSave={handleProfileSave}
        />
      )}

      {/* View Full Post Modal */}
      {selectedPost && (
        <ViewFullPostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal
          onClose={() => setShowSettingsModal(false)}
          onLogout={logout}
          onDeleteUser={() => {
            if (currentUser) {
              deleteUserById(currentUser.id);
              logout();
            }
          }}
        />
      )}
    </div>
  );
};

export default Profile;
