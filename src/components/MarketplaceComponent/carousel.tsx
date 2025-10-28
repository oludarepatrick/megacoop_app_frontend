import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { CarouselItem } from "@/types/marketplaceTypes"
import floatingImg from "@/assets/marketplace/carousel-bg-mask-group.png"


interface CarouselProps {
  items: CarouselItem[]
}

export function Carousel({ items }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    if (!autoPlay) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [autoPlay, items.length])

  const goToPrevious = () => {
    setAutoPlay(false)
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }

  const goToNext = () => {
    setAutoPlay(false)
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }

  const goToSlide = (index: number) => {
    setAutoPlay(false)
    setCurrentIndex(index)
  }

  if (items.length === 0) return null

  const current = items[currentIndex]
  console.log("current.image", current.image)

  return (
    <div className="relative w-full h-full md:h-80 lg:h-96 rounded-lg  shadow-md">
      {/* Carousel Content */}
      <div
        className={`${current.backgroundColor} w-full h-full flex flex-col-reverse md:flex-row items-center rounded-lg justify-between px-8 py-4 gap-4 text-white relative`}
      >
        {/* Floating Image */}
        <div className="absolute top-0 left-[40%] inset-0 overflow-hidden z-0 pointer-events-none">
          <img
            src={floatingImg}
            alt={current.subtitle}
            className=" md:h-full object-cover z-0"
          />
        </div>
        {/* Left Content */}
        <div className="flex-1 z-10 bg-transparent">
          <p className="text-sm md:text-base text-gray-300 mb-2">{current.title}</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-2">{current.subtitle}</h2>
          <p className="text-lg md:text-2xl font-semibold mb-4">{current.description}</p>

          {/* Dots Indicator */}
          <div className="flex gap-2">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? "bg-green-500 w-6" : "bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Image */}
        <div className="flex-1 flex justify-center ">
          <img src={current.image || "@/assets/facial-img.png"} alt={current.subtitle} className="h-full object-contain rounded-lg z-10" />
        </div>

        {/* Navigation Buttons */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-[-14px] top-1/2 -translate-y-1/2 bg-green-500/20 hover:bg-white/30 text-white rounded-full z-10"
          onClick={goToPrevious}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-[-14px] top-1/2 -translate-y-1/2 bg-green-500/20 hover:bg-white/30 text-white rounded-full z-10"
          onClick={goToNext}
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>
    </div>
  )
}
