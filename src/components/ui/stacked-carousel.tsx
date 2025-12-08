import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type StackedCarouselItem = {
  id: string;
  content: React.ReactNode;
};

type StackedCarouselProps = {
  items: StackedCarouselItem[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showControls?: boolean;
  showIndicators?: boolean;
  className?: string;
  cardClassName?: string;
  onSlideChange?: (currentIndex: number) => void;
};

function StackedCarousel({
  items,
  autoPlay = false,
  autoPlayInterval = 3000,
  showControls = true,
  showIndicators = true,
  className,
  cardClassName,
  onSlideChange,
}: StackedCarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [direction, setDirection] = React.useState<'next' | 'prev'>('next');

  const nextIndex = (currentIndex + 1) % items.length;

  // Handle next slide
  const handleNext = React.useCallback(() => {
    if (isAnimating) return;
    setDirection('next');
    setIsAnimating(true);
    const newIndex = (currentIndex + 1) % items.length;
    setCurrentIndex(newIndex);
    onSlideChange?.(newIndex);
    setTimeout(() => setIsAnimating(false), 500);
  }, [currentIndex, items.length, isAnimating, onSlideChange]);

  // Handle previous slide
  const handlePrev = React.useCallback(() => {
    if (isAnimating) return;
    setDirection('prev');
    setIsAnimating(true);
    const newIndex = (currentIndex - 1 + items.length) % items.length;
    setCurrentIndex(newIndex);
    onSlideChange?.(newIndex);
    setTimeout(() => setIsAnimating(false), 500);
  }, [currentIndex, items.length, isAnimating, onSlideChange]);

  // Go to specific slide
  const goToSlide = React.useCallback(
    (index: number) => {
      if (isAnimating || index === currentIndex) return;
      setDirection(index > currentIndex ? 'next' : 'prev');
      setIsAnimating(true);
      setCurrentIndex(index);
      onSlideChange?.(index);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [currentIndex, isAnimating, onSlideChange]
  );

  // Auto-play effect - FIXED
  React.useEffect(() => {
    if (!autoPlay || items.length <= 1) return;

    const interval = setInterval(() => {
      handleNext();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, handleNext, items.length]); // Added handleNext to dependencies

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-muted-foreground">
        No items to display
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* Carousel Container */}
      <div className="relative max-w-[400px] w-full max-h-[400px] aspect-square mb-6 overflow-hidden ">
        {/* Next Card (Behind) - Peeking from right */}
        <StackedCarouselCard
          className={cn(
            "top-0 left-7 z-10 opacity-80 scale-95",
            cardClassName
          )}
        >
          {items[nextIndex].content}
        </StackedCarouselCard>

        {/* Current Card (Front) - Slides out */}
        <StackedCarouselCard
          key={`current-${currentIndex}`}
          className={cn(
            "top-0 left-0 z-200",
            isAnimating && direction === 'next' && "animate-fadeIn",
            isAnimating && direction === 'prev' && "animate-slideOutRight",
            cardClassName
          )}
        >
          {items[currentIndex].content}
        </StackedCarouselCard>

        {/* Navigation Controls */}
        {showControls && items.length > 1 && (
          <>
            <StackedCarouselPrevious
              onClick={handlePrev}
              disabled={isAnimating}
            />
            <StackedCarouselNext onClick={handleNext} disabled={isAnimating} />
          </>
        )}
      </div>

      {/* Indicators */}
      {showIndicators && items.length > 1 && (
        <StackedCarouselIndicators
          count={items.length}
          activeIndex={currentIndex}
          onIndicatorClick={goToSlide}
          disabled={isAnimating}
        />
      )}
    </div>
  );
}

interface StackedCarouselCardProps {
  children: React.ReactNode;
  className?: string;
}

function StackedCarouselCard({ children, className }: StackedCarouselCardProps) {
  return (
    <div
      className={cn(
        "absolute w-full h-full transition-all duration-500 ease-out",
        className
      )}
    >
      {children}
    </div>
  );
}

interface NavigationButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

function StackedCarouselPrevious({ onClick, disabled }: NavigationButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "absolute left-2 top-1/2 -translate-y-1/2 z-30",
        "w-10 h-10 rounded-full bg-white/90 shadow-lg",
        "flex items-center justify-center",
        "hover:bg-white hover:scale-110 transition-all",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      )}
      aria-label="Previous slide"
    >
      <ChevronLeft className="w-5 h-5 text-gray-700" />
    </button>
  );
}

function StackedCarouselNext({ onClick, disabled }: NavigationButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "absolute right-2 top-1/2 -translate-y-1/2 z-30",
        "w-10 h-10 rounded-full bg-white/90 shadow-lg",
        "flex items-center justify-center",
        "hover:bg-white hover:scale-110 transition-all",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      )}
      aria-label="Next slide"
    >
      <ChevronRight className="w-5 h-5 text-gray-700" />
    </button>
  );
}

interface IndicatorsProps {
  count: number;
  activeIndex: number;
  onIndicatorClick: (index: number) => void;
  disabled?: boolean;
}

function StackedCarouselIndicators({
  count,
  activeIndex,
  onIndicatorClick,
  disabled,
}: IndicatorsProps) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          onClick={() => onIndicatorClick(index)}
          disabled={disabled}
          className={cn(
            "h-2 rounded-full transition-all duration-300",
            index === activeIndex
              ? "w-7 bg-megaPrimary"
              : "w-2 bg-muted-foreground/30",
            "hover:bg-muted-foreground/50",
            "disabled:cursor-not-allowed"
          )}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
}

export { StackedCarousel };




// import * as React from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { cn } from "@/lib/utils";

// type StackedCarouselItem = {
//   id: string;
//   content: React.ReactNode;
// };

// type StackedCarouselProps = {
//   items: StackedCarouselItem[];
//   autoPlay?: boolean;
//   autoPlayInterval?: number;
//   showControls?: boolean;
//   showIndicators?: boolean;
//   className?: string;
//   cardClassName?: string;
//   onSlideChange?: (currentIndex: number) => void;
// };

// function StackedCarousel({
//   items,
//   autoPlay = false,
//   autoPlayInterval = 3000,
//   showControls = true,
//   showIndicators = true,
//   className,
//   cardClassName,
//   onSlideChange,
// }: StackedCarouselProps) {
//   const [currentIndex, setCurrentIndex] = React.useState(0);
//   const [isAnimating, setIsAnimating] = React.useState(false);
//   const autoPlayRef = React.useRef<NodeJS.Timeout | null>(null);

//   const nextIndex = (currentIndex + 1) % items.length;
//   //   const prevIndex = (currentIndex - 1 + items.length) % items.length;

//   // Auto-play functionality
//   React.useEffect(() => {
//     if (!autoPlay || items.length <= 1) return;

//     autoPlayRef.current = setInterval(() => {
//       handleNext();
//     }, autoPlayInterval);

//     return () => {
//       if (autoPlayRef.current) {
//         clearInterval(autoPlayRef.current);
//       }
//     };
//   }, [autoPlay, autoPlayInterval, currentIndex, items.length]);

//   // Reset auto-play timer when user interacts
//   const resetAutoPlay = React.useCallback(() => {
//     if (autoPlayRef.current) {
//       clearInterval(autoPlayRef.current);
//     }
//     if (autoPlay) {
//       autoPlayRef.current = setInterval(() => {
//         handleNext();
//       }, autoPlayInterval);
//     }
//   }, [autoPlay, autoPlayInterval]);

//   const handleNext = React.useCallback(() => {
//     if (isAnimating) return;
//     setIsAnimating(true);
//     const newIndex = (currentIndex + 1) % items.length;
//     setCurrentIndex(newIndex);
//     onSlideChange?.(newIndex);
//     setTimeout(() => setIsAnimating(false), 500);
//     resetAutoPlay();
//   }, [currentIndex, items.length, isAnimating, onSlideChange, resetAutoPlay]);

//   const handlePrev = React.useCallback(() => {
//     if (isAnimating) return;
//     setIsAnimating(true);
//     const newIndex = (currentIndex - 1 + items.length) % items.length;
//     setCurrentIndex(newIndex);
//     onSlideChange?.(newIndex);
//     setTimeout(() => setIsAnimating(false), 500);
//     resetAutoPlay();
//   }, [currentIndex, items.length, isAnimating, onSlideChange, resetAutoPlay]);

//   const goToSlide = React.useCallback(
//     (index: number) => {
//       if (isAnimating || index === currentIndex) return;
//       setIsAnimating(true);
//       setCurrentIndex(index);
//       onSlideChange?.(index);
//       setTimeout(() => setIsAnimating(false), 500);
//       resetAutoPlay();
//     },
//     [currentIndex, isAnimating, onSlideChange, resetAutoPlay]
//   );

//   if (items.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-96 text-muted-foreground">
//         No items to display
//       </div>
//     );
//   }

//   return (
//     <div className={cn("flex flex-col items-center", className)}>
//       {/* Carousel Container */}
//       <div className="relative w-full h-[320px] mb-6">
//         {/* Next Card (Behind) */}
//         <StackedCarouselCard
//           className={cn(
//             "top-0 left-10 z-10 opacity-80 scale-95",
//             cardClassName
//           )}
//           isNext
//         >
//           {items[nextIndex].content}
//         </StackedCarouselCard>

//         {/* Current Card (Front) */}
//         <StackedCarouselCard
//           key={currentIndex}
//           className={cn("top-0 left-0 z-20", cardClassName)}
//           isCurrent
//         >
//           {items[currentIndex].content}
//         </StackedCarouselCard>

//         {/* Navigation Controls */}
//         {showControls && items.length > 1 && (
//           <>
//             <StackedCarouselPrevious
//               onClick={handlePrev}
//               disabled={isAnimating}
//             />
//             <StackedCarouselNext onClick={handleNext} disabled={isAnimating} />
//           </>
//         )}
//       </div>

//       {/* Indicators */}
//       {showIndicators && items.length > 1 && (
//         <StackedCarouselIndicators
//           count={items.length}
//           activeIndex={currentIndex}
//           onIndicatorClick={goToSlide}
//           disabled={isAnimating}
//         />
//       )}
//     </div>
//   );
// }

// interface StackedCarouselCardProps {
//   children: React.ReactNode;
//   className?: string;
//   isCurrent?: boolean;
//   isNext?: boolean;
// }

// function StackedCarouselCard({
//   children,
//   className,
//   isCurrent,
// }: //   isNext,
// StackedCarouselCardProps) {
//   return (
//     <div
//       className={cn(
//         "absolute w-full h-full transition-all duration-500 ease-out",
//         isCurrent && "animate-fadeIn",
//         className
//       )}
//     >
//       {children}
//     </div>
//   );
// }

// interface NavigationButtonProps {
//   onClick: () => void;
//   disabled?: boolean;
// }

// function StackedCarouselPrevious({ onClick, disabled }: NavigationButtonProps) {
//   return (
//     <button
//       onClick={onClick}
//       disabled={disabled}
//       className={cn(
//         "absolute left-2 top-1/2 -translate-y-1/2 z-30",
//         "w-10 h-10 rounded-full bg-white/90 shadow-lg",
//         "flex items-center justify-center",
//         "hover:bg-white hover:scale-110 transition-all",
//         "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
//       )}
//       aria-label="Previous slide"
//     >
//       <ChevronLeft className="w-5 h-5 text-gray-700" />
//     </button>
//   );
// }

// function StackedCarouselNext({ onClick, disabled }: NavigationButtonProps) {
//   return (
//     <button
//       onClick={onClick}
//       disabled={disabled}
//       className={cn(
//         "absolute right-2 top-1/2 -translate-y-1/2 z-30",
//         "w-10 h-10 rounded-full bg-white/90 shadow-lg",
//         "flex items-center justify-center",
//         "hover:bg-white hover:scale-110 transition-all",
//         "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
//       )}
//       aria-label="Next slide"
//     >
//       <ChevronRight className="w-5 h-5 text-gray-700" />
//     </button>
//   );
// }

// interface IndicatorsProps {
//   count: number;
//   activeIndex: number;
//   onIndicatorClick: (index: number) => void;
//   disabled?: boolean;
// }

// function StackedCarouselIndicators({
//   count,
//   activeIndex,
//   onIndicatorClick,
//   disabled,
// }: IndicatorsProps) {
//   return (
//     <div className="flex gap-2">
//       {Array.from({ length: count }).map((_, index) => (
//         <button
//           key={index}
//           onClick={() => onIndicatorClick(index)}
//           disabled={disabled}
//           className={cn(
//             "h-2 rounded-full transition-all duration-300",
//             index === activeIndex
//               ? "w-8 bg-primary"
//               : "w-2 bg-muted-foreground/30",
//             "hover:bg-muted-foreground/50",
//             "disabled:cursor-not-allowed"
//           )}
//           aria-label={`Go to slide ${index + 1}`}
//         />
//       ))}
//     </div>
//   );
// }

// export { StackedCarousel };
