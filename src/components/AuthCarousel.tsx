import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CarouselImage from '../assets/signup_carousel_image.jpg';

const carouselItems = [
  {
    title: "Seamless Transactions",
    desc: "Secure your future with fast loans, easy savings, and exclusive deals",
  },
  {
    title: "Smart Savings",
    desc: "Grow your wealth with automated contributions and flexible withdrawals",
  },
  {
    title: "Community Support",
    desc: "Join a network of like-minded individuals achieving financial freedom",
  },
  {
    title: "Trusted Security",
    desc: "Your data and funds are protected with top-tier security measures",
  },
];

interface AuthCarouselProps {
  imgHeight?: number;
  onImgHeightChange?: (height: number) => void;
}


const AuthCarousel = ({ onImgHeightChange }: AuthCarouselProps) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [current, setCurrent] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto change carouse
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % carouselItems.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!imgRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        onImgHeightChange?.(entry.contentRect.height);
      }
    });

    resizeObserver.observe(imgRef.current);

    return () => resizeObserver.disconnect();
  }, [onImgHeightChange]);

  return (
    <div className="rounded-[16px] relative hidden lg:flex p-0  overflow-hidden">
      <img
        ref={imgRef}
        src={CarouselImage}
        alt="Sign Up"
        className="inset-0 max-w-[800px] max-h-[95vh] object-contain object-left filter sepia saturate-0 hue-rotate-120"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#14AB55]/70 to-[#14AB55]/70">
        <div className="relative z-10 w-full h-full flex flex-col justify-between mix-blend-normal">
          {/* Top Text */}
          <div className="text-center mt-12 px-4">
            <h4 className="text-3xl md:text-3xl font-extrabold text-white">
              Welcome to Megacoop
            </h4>
            <p className="mt-2 text-white/90">
              Your Gateway to Financial Freedom.
            </p>
          </div>

          {/* Carousel */}
          <div className="text-center mb-12 px-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                onAnimationComplete={() => setActiveIndex(current)}
                className="w-full"
              >
                <h2 className="text-2xl font-bold text-white">
                  {carouselItems[current].title}
                </h2>
                <p className="text-white/80 mt-2 max-w-lg mx-auto">
                  {carouselItems[current].desc}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="flex justify-center mt-4 space-x-2 relative">
              {carouselItems.map((_, index) => (
                <span
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === activeIndex ? "bg-green-400" : "bg-white/50 hover:bg-white"
                  }`}
                ></span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthCarousel;