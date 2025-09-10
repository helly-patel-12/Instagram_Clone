import React from 'react';
import { Post } from '../../types';

interface PostModalProps {
  post: Post | null;
  onClose: () => void;
  onSave: (updatedPost: Post) => void; 
}

const PostModal: React.FC<PostModalProps> = ({ post, onClose, onSave }) => {
  const [caption, setCaption] = React.useState(post?.caption || '');
  const [image, setImage] = React.useState<File | null>(null); 
  const [imageUrl, setImageUrl] = React.useState(post?.imageUrl || ""); // <-- new state

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setImageUrl(""); // reset manual URL if uploading a file
    }
  };

  const handleSave = () => {
    if (post) {
      const updatedPost: Post = { 
        ...post, 
        caption, 
        imageUrl: image 
          ? URL.createObjectURL(image) // uploaded file
          : imageUrl || post.imageUrl  // typed URL or old one
      };
      onSave(updatedPost);
      onClose();
    }
  };

  if (!post) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-5 w-96 mt-10">
        <h2 className="text-lg font-bold mb-3">Edit Post</h2>

        {/* Preview image */}
        {(image || imageUrl || post.imageUrl) && (
          <img 
            src={image ? URL.createObjectURL(image) : imageUrl || post.imageUrl} 
            alt="Post" 
            className="h-[300px] w-[200px] mb-2 object-cover ml-auto mr-auto" 
          />
        )}

        {/* File upload */}
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageChange} 
          className="mb-3"
        />

        {/* Image URL input */}
        <input
          type="text"
          placeholder="Or paste image URL here"
          value={imageUrl}
          onChange={(e) => {
            setImageUrl(e.target.value);
            setImage(null); // reset file if typing a URL
          }}
          className="w-full border border-gray-300 p-2 mb-3"
        />

        {/* Caption */}
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full h-24 border border-gray-300 p-2"
        />

        {/* Buttons */}
        <div className="flex justify-between mt-3">
          <button onClick={onClose} className="text-gray-500">Cancel</button>
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
