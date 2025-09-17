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
import waterflow from "../Images/waterflow.mp4"
import goodvibes from "../Images/goodvibes.mp4"
import travel from "../Images/travel.mp4"
import food from "../Images/food.mp4"
import dog from "../Images/dog.mp4"
import plane from "../Images/plane.mp4"
import forest from "../Images/forest.mp4"

const reelsData = [
  {
    id: 1,
    video: waterflow,
    user: {
      username: "manavpatel",
      avatar:
        "https://i.pravatar.cc/150?img=3",
    },
    caption: "This place is heaven 😍",
    music: "Original Audio - hellypatel",
    likes: "33.5K",
    comments: "42",
  },
  {
    id: 2,
    video: goodvibes,
    user: {
      username: "rohan",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    caption: "Good vibes only ✨",
    music: "Chill Beats",
    likes: "12.1K",
    comments: "89",
  },
  {
    id: 3,
    video: travel,
    user: {
      username: "travelguru",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    caption: "Exploring the world, one step at a time.",
    music: "Wanderlust",
    likes: "8.7K",
    comments: "45",
  },
  {
    id: 4,
    video: food,
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
    video: dog,
    user: {
      username: "petlover",
      avatar: "https://i.pravatar.cc/150?img=9",
    },
    caption: "Love pets!",
    music: "I Love My Dog",
    likes: "20.4K",
    comments: "200",
  },
  {
    id: 6,
    video: plane,
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
    video: forest,
    user: {
      username: "naturelover",
      avatar: "https://i.pravatar.cc/150?img=7",
    },
    caption: "Nature's beauty is unmatched. 🌿",
    music: "Nature Sounds",
    likes: "14.6K",
    comments: "95",
  },
];

const ReelsPage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [showVolumeBtn, setShowVolumeBtn] = useState(false);
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
  const prevReelData = currentIndex === 0 ? null : reelsData[currentIndex - 1];
  const nextReelData =
    currentIndex === reelsData.length - 1 ? null : reelsData[currentIndex + 1];

  return (
    <div className="flex justify-center items-center bg-white h-[95vh] sm:h-[90vh] md:h-[90vh] w-full my-2 px-0 sm:px-4">
      <div className="flex flex-col w-full max-w-2xl items-center h-full relative bottom-0">
        {/* Previous reel preview */}
        <div className="w-0 h-0 sm:w-[50%] sm:h-[2%] rounded-none overflow-hidden opacity-60 scale-100 pointer-events-none mb-2">
          {prevReelData ? (
            <video
              src={prevReelData.video}
              className="h-full w-full object-cover"
              muted
              playsInline
              autoPlay={false}
              style={{ maxHeight: "100%", maxWidth: "100%" }}
              onPlay={(e) => e.currentTarget.pause()}
            />
          ) : (
            <div className="h-full w-full bg-white" /> // 👈 blank white block
          )}
        </div>
        {/* Current Reel */}
        <div className="w-[90%] sm:w-[50%] h-[90%] sm:h-[96%] rounded-none overflow-hidden relative bg-white flex items-center justify-center">
          {/* Error Overlay */}
          {videoError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-40 pointer-events-none">
              <span className="text-white mb-4">Failed to load video.</span>
              <button
                className="bg-white text-black px-4 py-2 rounded"
                onClick={() => {
                  setVideoError(false);
                  setCurrentIndex((prev) => prev);
                }}
              >
                Retry
              </button>
            </div>
          )}
          {/* Video Element */}
          <video
            key={reel.id}
            ref={videoRef}
            src={reel.video}
            className="absolute w-full h-full object-cover"
            muted
            playsInline
            autoPlay
            loop={false}
            controls={false}
            onEnded={nextReel}
            onError={() => {
              setVideoError(true);
            }}
            style={{ maxHeight: "100%", maxWidth: "100%" }}
            preload="auto"
          />

          {/* Center Volume Button */}
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
          {/* Invisible click area for toggling mute and volume */}
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
            <div className="absolute right-2 sm:right-3 bottom-3 sm:bottom-5 flex flex-col items-center gap-4 sm:gap-5 text-white z-20">
              <div className="flex flex-col items-center">
                <Heart className="w-6 h-6 sm:w-5 sm:h-5 cursor-pointer" />
                <span className="text-[6px] sm:text-sm">{reel.likes}</span>
              </div>
              <div className="flex flex-col items-center">
                <MessageCircle className="w-6 h-6 sm:w-5 sm:h-5 cursor-pointer" />
                <span className="text-[6px] sm:text-sm">{reel.comments}</span>
              </div>
              <Share2 className="w-6 h-6 sm:w-5 sm:h-5 cursor-pointer" />
              <Bookmark className="w-6 h-6 sm:w-5 sm:h-5 cursor-pointer" />
              <MoreVertical className="w-6 h-6 sm:w-5 sm:h-5 cursor-pointer" />
              <div className="bg-white rounded-lg w-6 h-6 sm:w-6 sm:h-6 items-center flex justify-center">
                <Music className="w-4 h-4 sm:w-4 sm:h-4 text-black relative" />
              </div>
            </div>
          )}

          {/* Bottom Info */}
          {!videoError && (
            <div className="absolute bottom-3 sm:bottom-2 left-2 sm:left-2 text-white w-[90%] sm:w-[90%] pr-8 sm:pr-14 z-20">
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
              <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm text-white bg-[rgba(219,219,219,0.2)] px-2 py-1 rounded-xl w-max max-w-auto">
                <Music className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="">{reel.music}</span>
              </div>
            </div>
          )}
        </div>
        {/* Next Reel (10% visible, bottom) */}
        <div className="w-0 h-0 sm:w-[50%] sm:h-[2%] rounded-NONE overflow-hidden opacity-60 scale-100 pointer-events-none mt-2">
          <video
            src={nextReelData?.video}
            className="h-full w-full object-cover"
            muted
            playsInline
            autoPlay={false}
            controls={false}
            style={{ maxHeight: "100%", maxWidth: "100%" }}
            onPlay={(e) => e.currentTarget.pause()}
          />
        </div>
      </div>
    </div>
  );
};

export default ReelsPage;