"use client";
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type HorizontalScrollProps = {
  children: React.ReactNode;
  title?: string;
  scrollAmount?: number;
  className?: string;
  contentClassName?: string;
  showTitle?: boolean;
  enableArrowButtons?: boolean;
};

export default function HorizontalScroll({
  children,
  title,
  scrollAmount = 300,
  className = "",
  contentClassName = "",
  showTitle = true,
  enableArrowButtons = true
}: HorizontalScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener('scroll', handleScroll);
      handleScroll();
      return () => ref.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className={`relative ${className}`}>
      {showTitle && title && (
        <h3 className="text-2xl  mb-6">{title}</h3>
      )}

      <div className="relative">
        {enableArrowButtons && showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full hover:bg-black/70"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
        )}

        <div
          ref={scrollRef}
          className={`flex overflow-x-auto no-scrollbar gap-6 py-4 px-2 ${contentClassName}`}
          onScroll={handleScroll}
        >
          {children}
        </div>

        {enableArrowButtons && showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full hover:bg-black/70"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        )}
      </div>
    </div>
  );
}
