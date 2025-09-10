import React, { useState } from "react";
import { X, Upload } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { savePost } from "../../utils/storage";
import { Post } from "../../types";

interface CreatePostProps {
  onClose: () => void;
  onPostCreated: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onClose, onPostCreated }) => {
  const { currentUser, updateCurrentUser } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [caption, setCaption] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<"upload" | "sample" | "url">(
    "upload"
  );
  const [urlInput, setUrlInput] = useState("");

  const sampleImages = [
    "https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/3621960/pexels-photo-3621960.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2101187/pexels-photo-2101187.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1729931/pexels-photo-1729931.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&w=800",
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSelectedImage(result);
        setUrlInput(""); // clear URL when uploading
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrlInput(value);
    setSelectedImage(value); // update preview directly
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedImage) return;

    setIsLoading(true);

    try {
      const newPost: Post = {
        id: Date.now().toString(),
        userId: currentUser.id,
        imageUrl: selectedImage,
        caption: caption.trim(),
        likes: [],
        comments: [],
        timestamp: Date.now(),
      };

      savePost(newPost);

      const updatedUser = {
        ...currentUser,
        posts: [...currentUser.posts, newPost.id],
      };
      updateCurrentUser(updatedUser);

      window.dispatchEvent(new CustomEvent("postsUpdated"));

      onPostCreated();
      onClose();
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-medium">Create new post</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Tabs */}
          <div className="flex space-x-2 mb-4">
            {["upload", "sample", "url"].map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => {
                  setUploadMethod(method as "upload" | "sample" | "url");
                  if (method !== "url") setUrlInput(""); // clear URL only when leaving URL tab
                }}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  uploadMethod === method
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {method === "upload"
                  ? "Upload Image"
                  : method === "sample"
                  ? "Sample Images"
                  : "Paste URL"}
              </button>
            ))}
          </div>

          {/* Image Preview */}
          {selectedImage && (
            <div className="relative">
              <img
                src={selectedImage}
                alt="Selected"
                className="w-full aspect-square object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => {
                  setSelectedImage("");
                  setUrlInput("");
                }}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Upload Method Content */}
          {uploadMethod === "upload" && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <Upload className="w-12 h-12 text-gray-400" />
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-blue-500 hover:text-blue-600">
                    Click to upload
                  </span>
                  <span> or drag and drop</span>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </label>
            </div>
          )}

          {uploadMethod === "sample" && (
            <div className="grid grid-cols-2 gap-2">
              {sampleImages.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className="aspect-square bg-gray-100 rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                >
                  <img
                    src={image}
                    alt={`Option ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {uploadMethod === "url" && (
            <div>
              <label
                htmlFor="image-url"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Paste Image URL
              </label>
              <input
                id="image-url"
                type="url"
                value={urlInput}
                onChange={handleUrlChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Caption */}
          <div>
            <label
              htmlFor="caption"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Caption
            </label>
            <textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!selectedImage || isLoading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Sharing..." : "Share"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
