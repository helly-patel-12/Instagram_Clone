import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Post, User } from "../../types";
import { getPosts, getUsers } from "../../utils/storage";
import { useAuth } from "../../contexts/AuthContext";
import ViewFullPostModal from "../Post/ViewFullPostModal";

interface ExploreProps {
  onUserClick: (username: string) => void;
}

const Explore: React.FC<ExploreProps> = () => {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    loadExploreData();
  }, [currentUser]);

  const loadExploreData = () => {
    setIsLoading(true);

    const allPosts = getPosts();
    const allUsers = getUsers();

    // Filter out current user's posts and user
    const otherPosts = allPosts.filter(
      (post) => post.userId !== currentUser?.id
    );
    const otherUsers = allUsers.filter((user) => user.id !== currentUser?.id);

    // Shuffle posts for explore feel
    const shuffledPosts = otherPosts.sort(() => Math.random() - 0.5);

    setPosts(shuffledPosts);
    setUsers(otherUsers);
    setIsLoading(false);
  };

  // const filteredUsers = users.filter((user) =>
  //   user.username.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  const filteredPosts = posts.filter((post) => {
    const postUser = users.find((user) => user.id === post.userId);
    return (
      postUser?.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.caption.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="pl-0 md:pl-20 lg:pl-60 py-4">
      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search users or posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {searchQuery ? (
        <div>
          {/* User Results */}
          {/* {filteredUsers.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4">People</h3>
              <div className="space-y-3">
                {filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => onUserClick(user.username)}
                    className="flex items-center space-x-3 p-2 w-full hover:bg-gray-50 rounded-lg transition-colors text-left"
                  >
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-800">
                        {user.username}
                      </p>
                      <p className="text-sm text-gray-600">
                        {user.followers.length} followers
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )} */}

          {/* Post Results */}
          {filteredPosts.length > 0 && (
            <div>
              {/* <h3 className="text-lg font-medium text-gray-800 mb-4">Posts</h3> */}
              <div className="grid grid-cols-3 gap-1 md:gap-4">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className="aspect-square bg-gray-100 overflow-hidden group cursor-pointer"
                  >
                    <img
                      src={post.imageUrl}
                      alt="Post"
                      className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                    />
                  </div>
                ))}
              </div>
              {/* View Full Post Modal */}
              {selectedPost && (
                <ViewFullPostModal
                  post={selectedPost}
                  onClose={() => setSelectedPost(null)}
                />
              )}
            </div>
          )}

          {/* {filteredUsers.length === 0 && filteredPosts.length === 0 && ( */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-20">
              <div className="text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  No results found
                </h3>
                <p className="text-gray-600">
                  Try searching for something else.
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          {/* Suggested Users */}
          {/* {users.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Suggested for you
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {users.slice(0, 6).map((user) => (
                  <button
                    key={user.id}
                    onClick={() => onUserClick(user.username)}
                    className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow"
                  >
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-16 h-16 rounded-full object-cover mx-auto mb-3"
                    />
                    <p className="font-medium text-gray-800 truncate">
                      {user.username}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      {user.followers.length} followers
                    </p>
                    <div className="text-xs text-blue-500 font-medium">
                      View Profile
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )} */}

          {/* Explore Grid */}
          {posts.length > 0 ? (
            <div>
              {/* <h3 className="text-lg font-medium text-gray-800 mb-4">
                Explore
              </h3> */}
              <div className="grid grid-cols-3 gap-1 md:gap-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className="aspect-square bg-gray-100 overflow-hidden group cursor-pointer"
                  >
                    <img
                      src={post.imageUrl}
                      alt="Post"
                      className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                    />
                  </div>
                ))}
              </div>
              {/* View Full Post Modal */}
              {selectedPost && (
                <ViewFullPostModal
                  post={selectedPost}
                  onClose={() => setSelectedPost(null)}
                />
              )}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-gray-500">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Nothing to explore yet
                </h3>
                <p className="text-gray-600">
                  When people share posts, you'll see them here.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Explore;
