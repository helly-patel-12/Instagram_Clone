import React from 'react';
import { Post } from '../../types';

interface FullscreenModalProps {
  post: Post | null;
  onClose: () => void;
}

const FullscreenModal: React.FC<FullscreenModalProps> = ({ post, onClose }) => {
  if (!post) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center  bg-zinc-400 bg-opacity-80">
      <div className="relative">
        <img src={post.imageUrl} alt="Post" className="min-w-[300px] min-h-[600px] max-h-[650px] max-w-[350px] object-cover ml-auto mr-auto" />
        <button
          onClick={onClose}
          className="absolute top-5 right-2 text-white text-2xl"
        >
          X {/* Close button */}
        </button>
        <div className="absolute bottom-5 left-6 transform bg-white bg-opacity-90 text-blue-700 text-center w-[300px]">
          <p>{post.caption}</p>
        </div>
      </div>
    </div>
  );
};

export default FullscreenModal;
