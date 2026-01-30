import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

const BackgroundVideo = ({ 
  src, 
  youtubeId, 
  poster,
  overlay = true,
  overlayOpacity = 0.4,
  overlayColor = 'black',
  showControls = false,
  autoPlay = true,
  muted = true,
  className = '',
  children 
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video && autoPlay) {
      video.play().catch(console.error);
    }
  }, [autoPlay]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const extractYouTubeId = (url) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return match ? match[1] : url;
  };

  const getYouTubeEmbedUrl = (id) => {
    const videoId = extractYouTubeId(id);
    return `https://www.youtube.com/embed/${videoId}?autoplay=${autoPlay ? 1 : 0}&mute=${muted ? 1 : 0}&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`;
  };

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Video Element */}
      {youtubeId ? (
        <iframe
          src={getYouTubeEmbedUrl(youtubeId)}
          className="absolute top-0 left-0 w-full h-full object-cover scale-150 -translate-y-12"
          style={{ minWidth: '100%', minHeight: '100%' }}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setIsLoaded(true)}
        />
      ) : (
        <video
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay={autoPlay}
          muted={muted}
          loop
          playsInline
          poster={poster}
          onLoadedData={() => setIsLoaded(true)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Overlay */}
      {overlay && (
        <div 
          className="absolute inset-0 z-10"
          style={{ 
            backgroundColor: overlayColor,
            opacity: overlayOpacity 
          }}
        />
      )}

      {/* Controls */}
      {showControls && !youtubeId && (
        <div className="absolute bottom-4 right-4 z-30 flex space-x-2">
          <button
            onClick={togglePlay}
            className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-3 hover:bg-opacity-30 transition-all duration-200"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-white" />
            ) : (
              <Play className="w-5 h-5 text-white ml-1" />
            )}
          </button>
          <button
            onClick={toggleMute}
            className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-3 hover:bg-opacity-30 transition-all duration-200"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-white" />
            ) : (
              <Volume2 className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      )}

      {/* Content */}
      <div className="relative z-20 h-full flex items-center justify-center">
        {children}
      </div>

      {/* Loading indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-gray-900">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

// Example usage component
const VideoDemo = () => {
  return (
    <div className="min-h-screen">
      {/* YouTube Background Example */}
      <div className="h-screen relative">
        <BackgroundVideo
          youtubeId="Zz_arM1tmFM" // Your requested video
          overlay={true}
          overlayOpacity={0.5}
          showControls={false}
          className="h-full"
        >
          <div className="text-center text-white px-8">
            <h1 className="text-6xl font-bold mb-4 animate-fade-in">
              YouTube Background
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Seamless YouTube video integration with custom overlays and content positioning
            </p>
          </div>
        </BackgroundVideo>
      </div>

      {/* Local Video Example */}
      <div className="h-screen relative">
        <BackgroundVideo
          src="/path/to/your/video.mp4"
          poster="/path/to/poster.jpg"
          overlay={true}
          overlayOpacity={0.3}
          overlayColor="navy"
          showControls={true}
          className="h-full"
        >
          <div className="text-center text-white px-8">
            <h1 className="text-6xl font-bold mb-4">
              Local Video Background
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Full control over local video files with custom controls and styling
            </p>
            <button className="mt-8 px-8 py-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-white font-semibold hover:bg-opacity-30 transition-all duration-200">
              Get Started
            </button>
          </div>
        </BackgroundVideo>
      </div>

      {/* Multiple sections example */}
      <div className="h-96 relative">
        <BackgroundVideo
          youtubeId="Zz_arM1tmFM" // Same video for consistency
          overlay={true}
          overlayOpacity={0.6}
          overlayColor="crimson"
          className="h-full"
        >
          <div className="text-center text-white px-8">
            <h2 className="text-4xl font-bold mb-4">
              Flexible & Responsive
            </h2>
            <p className="text-lg opacity-90">
              Works perfectly in any container size
            </p>
          </div>
        </BackgroundVideo>
      </div>
    </div>
  );
};

export default VideoDemo;