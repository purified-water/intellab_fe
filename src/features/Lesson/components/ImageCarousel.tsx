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

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="relative my-4 overflow-hidden border rounded-lg shadow-lg">
      <div className="relative bg-gray6/20 h-96">
        <img
          src={images[currentIndex].src ? images[currentIndex].src : unavailableImage}
          alt={images[currentIndex].alt}
          className="object-contain w-full h-full"
        />
      </div>
      <div className="absolute top-0 bottom-0 left-0 right-0 flex justify-between pointer-events-none">
        <button
          onClick={goToPrevious}
          className="p-2 text-gray-800 transition-transform duration-300 ease-in-out transform pointer-events-auto backdrop-blur-sm hover:bg-white hover:scale-110"
          aria-label="Previous image"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={goToNext}
          className="p-2 text-gray-800 transition-transform duration-300 ease-in-out transform pointer-events-auto backdrop-blur-sm hover:bg-white hover:scale-110"
          aria-label="Next image"
        >
          <ChevronRight size={24} />
        </button>
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex justify-center p-2 bg-white/80 backdrop-blur-sm">
        <div className="text-sm font-semibold text-gray1">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
};

export default ImageCarousel;
