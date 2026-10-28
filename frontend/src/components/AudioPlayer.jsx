import React, { useEffect, useRef } from 'react';
import { Music, VolumeX } from 'lucide-react';

export default function AudioPlayer({ isPlaying, setIsPlaying, audioUrl }) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.log("Autoplay prevented or audio error:", error);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, setIsPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  if (!audioUrl) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <audio ref={audioRef} src={audioUrl} loop preload="auto" />
      <button
        onClick={togglePlay}
        aria-label="Toggle Audio"
        className={`relative group p-3.5 rounded-full glass-card border border-gold-500/40 text-gold-400 hover:text-gold-300 shadow-xl shadow-black/50 transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center`}
      >
        <div className={`absolute inset-0 rounded-full bg-gold-500/20 animate-ping opacity-75 ${isPlaying ? 'block' : 'hidden'}`} />
        {isPlaying ? (
          <Music className="w-6 h-6 animate-spin-slow text-gold-400" />
        ) : (
          <VolumeX className="w-6 h-6 text-neutral-400" />
        )}
      </button>
    </div>
  );
}
