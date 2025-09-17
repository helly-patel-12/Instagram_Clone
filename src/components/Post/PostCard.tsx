import React, { useEffect, useState } from "react";
import {
  Heart,
  // MessageCircle,
  // Share,
  // Bookmark,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { Post, Comment, User } from "../../types";
import { db } from "../../utils/firebase";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useAuth } from "../../contexts/useAuth";

interface PostCardProps {
  post: Post;
  onUserClick: (username: string) => void;
  onDeletePost: (postId: string) => void;
  onEditPost: (post: Post) => void;
  onViewPostFullscreen: (post: Post) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onUserClick,
  onDeletePost,
  onEditPost,
  onViewPostFullscreen,
}) => {
  const { currentUser, updateCurrentUser } = useAuth();
  const [isLiked, setIsLiked] = useState(
    post.likes.includes(currentUser?.id || "")
  );
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(post.comments);
  const [showDropdown, setShowDropdown] = useState(false); // State for dropdown visibility
  const [sharePost, setSharePost] = useState<string | null>(null);

  const [isSaved, setIsSaved] = useState(
    currentUser?.savedPosts?.includes(post.id) || false
  );
  const [postUser, setPostUser] = useState<User | null>(null);
  useEffect(() => {
    const fetchUser = async () => {
      const userDoc = await getDoc(doc(db, "users", post.userId));
      if (userDoc.exists()) {
        setPostUser({ id: userDoc.id, ...userDoc.data() } as User);
      } else {
        setPostUser(null);
      }
    };
    fetchUser();
  }, [post.userId]);

  const handleSave = () => {
    if (!currentUser) return;
    const newSaved = !isSaved;
    setIsSaved(newSaved);
    const userRef = doc(db, "users", currentUser.id);
    updateDoc(userRef, {
      savedPosts: newSaved ? arrayUnion(post.id) : arrayRemove(post.id)
    }).then(async () => {
      // Fetch latest user data from Firestore for robust context update
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        updateCurrentUser({
          ...currentUser,
          savedPosts: data.savedPosts || [],
        });
        console.log('Updated savedPosts:', data.savedPosts);
      }
    });
  };

  const handleLike = () => {
    if (!currentUser) return;
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    const postRef = doc(db, "posts", post.id);
    updateDoc(postRef, {
      likes: isLiked ? arrayRemove(currentUser.id) : arrayUnion(currentUser.id)
    });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newComment.trim()) return;
    const comment: Comment = {
      id: Date.now().toString(),
      userId: currentUser.id,
      username: currentUser.username,
      text: newComment.trim(),
      timestamp: Date.now(),
    };
    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    setNewComment("");
    const postRef = doc(db, "posts", post.id);
    updateDoc(postRef, {
      comments: updatedComments
    });
  };

  const handleDeleteComment = (commentId: string) => {
    if (!currentUser) return;
    const updatedComments = comments.filter(
      (comment) => comment.id !== commentId
    );
    setComments(updatedComments);
    const postRef = doc(db, "posts", post.id);
    updateDoc(postRef, {
      comments: updatedComments
    });
  };

  const handleDeletePost = () => {
    if (currentUser && post.userId === currentUser.id) {
      setShowDropdown(false);
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this post?"
      );
      if (confirmDelete) {
        onDeletePost(post.id); // Call the delete function passed from the parent
      }
    }
  };

  const handleEditPost = () => {
    setShowDropdown(false);
    onEditPost(post);
  };

  const handleViewPostFullscreen = () => {
    setShowDropdown(false);
    onViewPostFullscreen(post);
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return "now";
  };

  if (!postUser) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg mb-6 my-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onUserClick(postUser.username)}
            className="flex items-center space-x-3"
          >
            <div className="p-1 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
              <img
                src={postUser.avatar}
                alt={postUser.username}
                className="w-8 h-8 rounded-full object-cover border-2 border-spacing-1 border-white"
              />
            </div>
            <span className="font-medium text-gray-800">
              {postUser.username}
            </span>
          </button>
          {/* Timestamp */}
          <ul className="text-gray-500 text-xs uppercase tracking-wide list-disc pl-4">
            <li className="m-0 p-0">{formatTimestamp(post.timestamp)}</li>
          </ul>
        </div>
        {/* More Options Button */}
        <button
          className="text-gray-600 hover:text-gray-800"
          onClick={() => setShowDropdown(true)} // Show overlay & menu
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>

        {/* Overlay + Dialog (only when dropdown is true) */}
        {showDropdown && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            {/* Click outside to close */}
            <div
              className="absolute inset-0"
              onClick={() => setShowDropdown(false)}
            ></div>

            {/* Dropdown menu */}
            <div className="relative w-72 bg-white rounded-lg shadow-lg z-50">
              <button
                onClick={() => {
                  handleViewPostFullscreen();
                  setShowDropdown(false);
                }}
                className="block w-full text-center px-4 py-2 text-gray-800 hover:bg-gray-100 border-b border-gray-200 hover:rounded-lg"
              >
                View Post in Fullscreen
              </button>
              {/* Owner-only options */}
              {currentUser && post.userId === currentUser.id && (
                <>
                  <button
                    onClick={() => setShowDropdown(false)}
                    className="block w-full text-center px-4 py-2 text-gray-800 hover:bg-gray-100 border-b border-gray-200"
                  >
                    Add to favourites
                  </button>
                  <button
                    onClick={() => {
                      handleEditPost();
                      setShowDropdown(false);
                    }}
                    className="block w-full text-center px-4 py-2 text-gray-800 hover:bg-gray-100 border-b border-gray-200"
                  >
                    Edit Post
                  </button>
                  <button
                    onClick={() => {
                      handleDeletePost();
                      setShowDropdown(false);
                    }}
                    className="block w-full text-center px-4 py-2 text-red-600 hover:bg-red-100 border-b border-gray-200"
                  >
                    Delete Post
                  </button>
                </>
              )}
              {currentUser && post.userId !== currentUser.id && (
                <>
                  <button
                    onClick={() => onUserClick(postUser.username)}
                    className="block w-full text-center px-4 py-2 text-gray-800 hover:bg-gray-100 border-b border-gray-200"
                  >
                    About this account
                  </button>
                  <button
                    onClick={() => setShowDropdown(false)}
                    className="block w-full text-center px-4 py-2 text-red-600 hover:bg-red-100 border-b border-gray-200"
                  >
                    Report
                  </button>
                  <button
                    onClick={() => setShowDropdown(false)}
                    className="block w-full text-center px-4 py-2 text-red-600 hover:bg-red-100 border-b border-gray-200"
                  >
                    Block
                  </button>
                </>
              )}

              {/* Cancel */}
              <button
                onClick={() => setShowDropdown(false)}
                className="block w-full text-center px-4 py-2 text-gray-800 hover:bg-gray-100 hover:rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Image */}
      <div className="aspect-square bg-gray-100 max-w-[800px]">
        <img
          src={post.imageUrl}
          alt="Post"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`transition-colors ${
                isLiked ? "text-red-500" : "text-gray-700 hover:text-gray-900"
              }`}
            >
              <Heart
                className="w-6 h-6"
                fill={isLiked ? "currentColor" : "none"}
              />
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="text-gray-700 hover:text-gray-900"
            >
              {/* <MessageCircle className="w-6 h-6" /> */}
              <svg
                aria-label="Comment"
                className="x1lliihq x1n2onr6 x5n08af"
                fill="currentColor"
                height="24"
                role="img"
                viewBox="0 0 24 24"
                width="24"
              >
                <title>Comment</title>
                <path
                  d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
                  fill="none"
                  stroke="currentColor"
                  stroke-linejoin="round"
                  stroke-width="2"
                ></path>
              </svg>
            </button>
            <button
              className="text-gray-700 hover:text-gray-900"
              onClick={() => setSharePost(post.id)}
            >
              {/* <Share className="w-6 h-6" /> */}
              <svg
                aria-label="Share"
                className="x1lliihq x1n2onr6 xyb1xck"
                fill="currentColor"
                height="24"
                role="img"
                viewBox="0 0 24 24"
                width="24"
              >
                <title>Share</title>
                <line
                  fill="none"
                  stroke="currentColor"
                  stroke-linejoin="round"
                  stroke-width="2"
                  x1="22"
                  x2="9.218"
                  y1="3"
                  y2="10.083"
                ></line>
                <polygon
                  fill="none"
                  points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
                  stroke="currentColor"
                  stroke-linejoin="round"
                  stroke-width="2"
                ></polygon>
              </svg>
            </button>
          </div>
          <button
            className={`text-gray-700 hover:text-gray-900 ${
              isSaved ? "font-bold text-blue-500" : ""
            }`}
            onClick={handleSave}
            aria-label={isSaved ? "Unsave" : "Save"}
            title={isSaved ? "Unsave" : "Save"}
          >
            {/* <Bookmark className="w-6 h-6" /> */}
            <svg
              aria-label="Save"
              className="x1lliihq x1n2onr6 xyb1xck"
              fill="currentColor"
              height="24"
              role="img"
              viewBox="0 0 24 24"
              width="24"
            >
              <title>Save</title>
              <polygon
                fill={isSaved ? "currentColor" : "none"}
                points="20 21 12 13.44 4 21 4 3 20 3 20 21"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              ></polygon>
            </svg>
          </button>
        </div>

        {/* Likes */}
        {likesCount > 0 && (
          <p className="font-medium text-gray-800 mb-2">
            {likesCount} {likesCount === 1 ? "like" : "likes"}
          </p>
        )}

        {/* Caption */}
        <div className="mb-2">
          <span className="font-medium text-gray-800 mr-2">
            {postUser.username}
          </span>
          <span className="text-gray-800">{post.caption}</span>
        </div>

        {/* Comments */}
        {comments.length > 0 && (
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-gray-500 text-sm mb-2 hover:text-gray-700"
          >
            {showComments ? "Hide" : "View"} all {comments.length} comments
          </button>
        )}

        {showComments && (
          <div className="space-y-1 mb-3">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="text-sm flex justify-between items-center"
              >
                <div>
                  <span className="font-medium text-gray-800 mr-2">
                    {comment.username}
                  </span>
                  <span className="text-gray-800">{comment.text}</span>
                </div>
                {currentUser && comment.userId === currentUser.id && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-gray-400 hover:text-red-500 ml-2 p-1 rounded-full transition-colors"
                    title="Delete comment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Comment */}
      <div className="border-t border-gray-200 p-2">
        <form
          onSubmit={handleAddComment}
          className="flex items-center space-x-3 p-2 rounded-lg bg-gray-100"
        >
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 text-sm focus:outline-none bg-gray-100"
          />
          <svg
            aria-label="Emoji"
            className="x1lliihq x1n2onr6 x1roi4f4 cursor-pointer"
            fill="currentColor"
            height="13"
            role="img"
            viewBox="0 0 24 24"
            width="13"
          >
            <title>Emoji</title>
            <path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z"></path>
          </svg>
          {newComment.trim() && (
            <button
              type="submit"
              className="text-blue-500 font-medium text-sm hover:text-blue-600"
            >
              Post
            </button>
          )}
        </form>
      </div>

      {sharePost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-80 text-center shadow-lg">
            <h2 className="text-lg font-semibold mb-3">Share this Post</h2>
            <div className="flex flex-col space-y-3">
              <button
                className="border p-2 rounded hover:bg-gray-100"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `https://instagram-clone-iota-silk.vercel.app/`
                  );
                  alert("Link copied!");
                  setSharePost(null);
                }}
              >
                Copy Link
              </button>
              <button
                className="border p-2 rounded hover:bg-gray-100"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: "Check this post",
                      url: `https://instagram-clone-iota-silk.vercel.app/`,
                    });
                  } else {
                    alert("Sharing not supported on this device");
                  }
                  setSharePost(null);
                }}
              >
                Share via Apps
              </button>
            </div>
            <button
              className="mt-4 text-red-500 hover:underline"
              onClick={() => setSharePost(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
