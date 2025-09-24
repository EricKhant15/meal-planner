import { useState } from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';

export default function RecipeImage({ src, alt, className = '' }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  if (imageError || !src) {
    return (
      <div className={`bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center ${className}`}>
        <PhotoIcon className="w-12 h-12 text-white/40" />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
          <PhotoIcon className="w-12 h-12 text-white/40 animate-pulse" />
        </div>
      )}
    </div>
  );
}
