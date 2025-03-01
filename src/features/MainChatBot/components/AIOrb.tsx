import { useState, useRef } from "react";
import { ChatbotModal } from "./MainChatModal";
import { aiOrbLogo, lightAiOrbAnimation } from "@/assets";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";

export const AIOrb = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [, setIsHovered] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play();
      videoRef.current.playbackRate = 2.5;
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    }
  };

  const handleVideoError = () => {
    setVideoError(true);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <div
        className="fixed flex items-center justify-center w-16 h-16 overflow-hidden transition-transform duration-300 bg-white rounded-full shadow-lg cursor-pointer backdrop-blur-lg bottom-10 right-10 hover:scale-125"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsChatOpen(true)}
      >
        {videoError ? (
          <img src={aiOrbLogo} alt="AI Orb Logo" className="object-cover w-full h-full scale-150" />
        ) : (
          <video ref={videoRef} loop muted className="object-cover w-full h-full scale-150" onError={handleVideoError}>
            <source src={lightAiOrbAnimation} type="video/mp4" />
          </video>
        )}
      </div>
      <ChatbotModal isOpen={isChatOpen} onClose={() => setIsChatOpen(!isChatOpen)} />
    </>
  );
};
