    import React, { useState, useEffect } from 'react';

    const SplashVideo = () => {
      const [showSplash, setShowSplash] = useState(true);

      const handleVideoEnd = () => {
        setShowSplash(false);
      };

      useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => document.body.style.overflow = 'unset';
      }, []);

      return showSplash ? (
        <div className="splash-container">
          <video autoPlay muted onEnded={handleVideoEnd} className="splash-video">
            <source src="/SplashScreen.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          
</video>
        </div>
      ) : null;
    };

    export default SplashVideo;