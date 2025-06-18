import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { unavailableImage } from "@/assets";

interface CarouselImage {
  src: string;
  alt: string;
}

interface ImageCarouselProps {
  images: CarouselImage[];
}

export const ImageCarousel = React.memo(({ images }: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasMultipleImages = images.length > 1;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative my-4 overflow-hidden border shadow-sm rounded-xl">
      <div className="relative flex items-center justify-center bg-gray6/20 h-96">
        <img
          key={images[currentIndex]?.src || "fallback"}
          src={images[currentIndex]?.src || unavailableImage}
          alt={images[currentIndex]?.alt || "Image"}
          className="object-contain w-full h-full max-h-[360px] max-w-[800px] transition-opacity duration-500 ease-in-out opacity-0 animate-fadeIn"
          loading="lazy"
        />
      </div>

      {hasMultipleImages && (
        <>
          <button
            type="button"
            onClick={goToPrevious}
            className="absolute z-10 p-2 transition -translate-y-1/2 rounded-full shadow-sm pointer-events-auto left-4 top-1/2 bg-white/80 hover:bg-white"
            aria-label="Previous image"
          >
            <ChevronLeft size={20} className="text-gray3" />
          </button>
          <button
            type="button"
            onClick={goToNext}
            className="absolute z-10 p-2 transition -translate-y-1/2 rounded-full shadow-sm pointer-events-auto right-4 top-1/2 bg-white/80 hover:bg-white"
            aria-label="Next image"
          >
            <ChevronRight size={20} className="text-gray3" />
          </button>

          <div className="absolute px-3 py-1 text-sm font-medium transition-opacity duration-300 -translate-x-1/2 rounded-full shadow-sm text-gray3 bottom-2 left-1/2 bg-white/80 backdrop-blur-sm hover:opacity-0 cursor-none">
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
});

ImageCarousel.displayName = "ImageCarousel";
