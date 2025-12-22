// services/main/src/components/molecules/Carousel/Carousel.tsx

import React, { useState, Children } from 'react';
import type { ReactElement } from 'react';
import styles from './Carousel.module.css';

interface CarouselProps {
  children: ReactElement[] | ReactElement;
  className?: string;
  // --- NEW PROPS FOR SIZING ---
  width?: string;
  maxWidth?: string;
  height?: string;
  // --- END NEW PROPS ---
}

/**
 * A simple, controlled Carousel/Slider component.
 */
export const Carousel = ({ children, className, width, maxWidth, height }: CarouselProps) => {
  // Normalize children to an array if a single element is passed
  const childrenArray = Children.toArray(children) as ReactElement[];
  
  const [activeIndex, setActiveIndex] = useState(0);
  const totalSlides = Children.count(childrenArray);

  const goToPrev = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? totalSlides - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setActiveIndex((prevIndex) => (prevIndex === totalSlides - 1 ? 0 : prevIndex + 1));
  };
  
  const renderIndicators = () => {
    return Array.from({ length: totalSlides }).map((_, index) => (
      <button
        key={index}
        className={`${styles.dot} ${index === activeIndex ? styles.active : ''}`}
        onClick={() => setActiveIndex(index)}
        aria-label={`Go to slide ${index + 1}`}
        type="button"
      />
    ));
  };

  const slides = Children.map(childrenArray, (child) => {
    // Heuristic: If the child is an <img>, don't wrap it with padding. Otherwise, wrap it.
    const isImageElement = child && typeof child.type === 'string' && child.type === 'img';

    return (
      <div className={styles.slide}>
        {/* If it's text/card content, wrap it to apply padding and centering */}
        {!isImageElement ? (
            <div className={styles.slideContent}>
                {child}
            </div>
        ) : (
            // If it's an image, let it fill the slide area without extra padding
            child
        )}
      </div>
    );
  });

  // Inject custom width/height props as CSS variables
  const customStyles = {
    '--carousel-width': width,
    '--carousel-max-width': maxWidth,
    '--carousel-height': height,
  } as React.CSSProperties;

  return (
    <div 
      className={`${styles.carouselContainer} ${className || ''}`} 
      aria-live="polite"
      style={customStyles} // Apply custom styles
    >
      {/* Slide Track */}
      <div 
        className={styles.track}
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {slides}
      </div>

      {/* Navigation Buttons */}
      <button 
        className={`${styles.navButton} ${styles.prev}`}
        onClick={goToPrev}
        aria-label="Previous slide"
        type="button"
      >
        &#10094; {/* Left arrow */}
      </button>

      <button 
        className={`${styles.navButton} ${styles.next}`}
        onClick={goToNext}
        aria-label="Next slide"
        type="button"
      >
        &#10095; {/* Right arrow */}
      </button>

      {/* Indicators */}
      <div className={styles.indicators}>
        {renderIndicators()}
      </div>
    </div>
  );
};