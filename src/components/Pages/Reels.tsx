import React, { useRef, useEffect, useState } from "react";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  MoreVertical,
  Volume2,
  VolumeX,
  Music,
} from "lucide-react";


const reelsData = [
  {
    id: 1,
    video: "https://www.pexels.com/download/video/2797545/",
    user: {
      username: "manavpatel",
      avatar:
        "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150",
    },
    caption: "Cartoon animation is awesome! 😍",
    music: "Original Audio - hellypatel",
    likes: "33.5K",
    comments: "42",
  },
  {
    id: 2,
    video: "https://www.pexels.com/video/854101/",
    user: {
      username: "rohan",
      avatar:
        "data:image/jpeg;base64,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",
    },
    caption: "Good vibes only ✨",
    music: "Chill Beats",
    likes: "12.1K",
    comments: "89",
  },
  {
    id: 3,
    video: "https://www.pexels.com/video/3326930/",
    user: {
      username: "travelguru",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    caption: "Exploring the world, one step at a time.",
    music: "Wanderlust",
    likes: "8.7K",
    comments: "45",
  },
  {
    id: 4,
    video: "https://www.pexels.com/video/2620043/",
    user: {
      username: "foodie",
      avatar: "https://i.pravatar.cc/150?img=4",
    },
    caption: "Delicious recipes coming your way! 🍲",
    music: "Yummy Tunes",
    likes: "15.3K",
    comments: "120",
  },
  {
    id: 5,
    video: "https://www.pexels.com/video/5534310/",
    user: {
      username: "fitnessfreak",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    caption: "Push your limits! 💪",
    music: "Workout Mix",
    likes: "20.4K",
    comments: "200",
  },
  {
    id: 6,
    video: "https://www.pexels.com/video/2023708/",
    user: {
      username: "traveller",
      avatar: "https://i.pravatar.cc/150?img=6",
    },
    caption: "Travelling and Exlopring new places",
    music: "Travel Vibes",
    likes: "18.9K",
    comments: "150",
  },
  {
    id: 7,
    video: "https://www.pexels.com/video/4420919/",
    user: {
      username: "naturelover",
      avatar: "https://i.pravatar.cc/150?img=7",
    },
    caption: "Nature's beauty is unmatched. 🌿",
    music: "Nature Sounds",
    likes: "14.6K",
    comments: "95",
  }
];

const ReelsPage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [showVolumeBtn, setShowVolumeBtn] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // handle wheel scroll (desktop)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 50) {
        nextReel();
      } else if (e.deltaY < -50) {
        prevReel();
      }
    };
    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, [currentIndex]);

  // handle swipe scroll (mobile)
  useEffect(() => {
    let startY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const endY = e.changedTouches[0].clientY;
      if (startY - endY > 50) {
        nextReel();
      } else if (endY - startY > 50) {
        prevReel();
      }
    };
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentIndex]);

  const nextReel = () => {
    setCurrentIndex((prev) => (prev + 1) % reelsData.length);
  };

  const prevReel = () => {
    setCurrentIndex((prev) => (prev === 0 ? reelsData.length - 1 : prev - 1));
  };

  // Reset loading and error state on reel change
  useEffect(() => {
    setVideoLoading(true);
    setVideoError(false);
  }, [currentIndex]);

  const toggleMute = () => {
    setMuted((prev) => !prev);
    if (videoRef.current) {
      videoRef.current.muted = muted;
    }
    setShowVolumeBtn(true);
    setTimeout(() => setShowVolumeBtn(false), 1200); // Hide after 1.2s
  };

  const reel = reelsData[currentIndex];
  const prevReelData = reelsData[(currentIndex === 0 ? reelsData.length - 1 : currentIndex - 1)];
  const nextReelData = reelsData[(currentIndex + 1) % reelsData.length];

  return (
    <div className="flex justify-center items-center bg-white h-[70vh] sm:h-[75vh] md:h-[90vh] w-full my-2 px-0 sm:px-4 md:px-0">
      <div className="flex flex-col w-full max-w-2xl items-center justify-center h-full relative">
        {/* Previous Reel (10% visible, top) */}
        <div className="w-full h-[10%] rounded-xl overflow-hidden opacity-60 scale-90 pointer-events-none mb-2">
          <video
            src={prevReelData.video}
            className="h-full w-full object-cover"
            muted
            playsInline
            autoPlay
            loop
            style={{ maxHeight: "100%", maxWidth: "100%" }}
          />
        </div>
        {/* Current Reel (center, 80% height) */}
  <div className="w-full h-[80%] rounded-xl overflow-hidden relative bg-black">
          {/* Loader Overlay (pointer-events-none so it never blocks video) */}
          {videoLoading && !videoError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-30 pointer-events-none">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
            </div>
          )}
          {/* Error Overlay (pointer-events-none so it never blocks video) */}
          {videoError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-40 pointer-events-none">
              <span className="text-white mb-4">Failed to load video.</span>
              <button
                className="bg-white text-black px-4 py-2 rounded"
                onClick={() => {
                  setVideoError(false);
                  setVideoLoading(true);
                  setCurrentIndex((prev) => prev);
                }}
              >
                Retry
              </button>
            </div>
          )}
          {/* Absolutely position video, highest z-index, always visible */}
          <video
            key={reel.id}
            ref={videoRef}
            src={reel.video}
            className="absolute top-0 left-0 w-full h-full object-cover z-50"
            loop={false}
            muted={muted}
            playsInline
            autoPlay
            poster="https://dummyimage.com/600x800/000/fff&text=Video+Not+Found"
            onEnded={nextReel}
            onLoadedData={() => setVideoLoading(false)}
            onLoadStart={() => setVideoLoading(true)}
            onError={() => {
              setVideoLoading(false);
              setVideoError(true);
            }}
            style={{ maxHeight: "100%", maxWidth: "100%" }}
          />

          {/* Center Volume Button (Instagram style) */}
          {showVolumeBtn && !videoError && (
            <button
              onClick={toggleMute}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-4 rounded-full z-20 transition-opacity duration-300"
            >
              {muted ? (
                <VolumeX className="text-white w-8 h-8" />
              ) : (
                <Volume2 className="text-white w-8 h-8" />
              )}
            </button>
          )}
          {/* Invisible click area for toggling mute */}
          {!videoError && (
            <button
              onClick={toggleMute}
              className="absolute left-0 top-0 w-full h-full z-10 cursor-pointer bg-transparent"
              style={{ outline: "none", border: "none" }}
              aria-label="Toggle volume"
            />
          )}

          {/* Right Sidebar */}
          {!videoError && (
            <div className="absolute right-2 sm:right-3 bottom-3 sm:bottom-5 flex flex-col items-center gap-4 sm:gap-6 text-white z-20">
              <div className="flex flex-col items-center">
                <Heart className="w-6 h-6 sm:w-7 sm:h-7 cursor-pointer" />
                <span className="text-xs sm:text-sm">{reel.likes}</span>
              </div>
              <div className="flex flex-col items-center">
                <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 cursor-pointer" />
                <span className="text-xs sm:text-sm">{reel.comments}</span>
              </div>
              <Share2 className="w-6 h-6 sm:w-7 sm:h-7 cursor-pointer" />
              <Bookmark className="w-6 h-6 sm:w-7 sm:h-7 cursor-pointer" />
              <MoreVertical className="w-6 h-6 sm:w-7 sm:h-7 cursor-pointer" />
              <div className="bg-white rounded-lg w-6 h-6 sm:w-7 sm:h-7 items-center flex justify-center">
                <Music className="w-4 h-4 sm:w-5 sm:h-5 text-black relative" />
              </div>
            </div>
          )}

          {/* Bottom Info */}
          {!videoError && (
            <div className="absolute bottom-3 sm:bottom-5 left-2 sm:left-4 text-white w-[90%] sm:w-[80%] pr-8 sm:pr-14 z-20">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <img
                  src={reel.user.avatar}
                  alt={reel.user.username}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white"
                />
                <span className="font-semibold text-xs sm:text-sm">
                  {reel.user.username}
                </span>
                <button className="ml-2 sm:ml-3 text-[10px] sm:text-xs bg-white text-black px-2 sm:px-3 py-1 rounded">
                  Follow
                </button>
              </div>
              <p className="text-xs sm:text-sm mb-1">{reel.caption}</p>
              <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm text-gray-200">
                <Music className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{reel.music}</span>
              </div>
            </div>
          )}
        </div>
        {/* Next Reel (10% visible, bottom) */}
        <div className="w-full h-[10%] rounded-xl overflow-hidden opacity-60 scale-90 pointer-events-none mt-2">
          <video
            src={nextReelData.video}
            className="h-full w-full object-cover"
            muted
            playsInline
            autoPlay
            loop
            style={{ maxHeight: "100%", maxWidth: "100%" }}
          />
        </div>
      </div>
    </div>
  );
};

export default ReelsPage;
