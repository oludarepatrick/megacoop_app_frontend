import { useState } from "react"
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageCarouselModalProps {
  images: string[]
  initialIndex: number
  isOpen: boolean
  onClose: () => void
}

export function ImageCarouselModal({ images, initialIndex, isOpen, onClose }: ImageCarouselModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-screen max-h-screen p-0 bg-black border-0">
        <DialogClose asChild>
                <Button
                  variant="ghost"
                  className="absolute right-3 top-4 z-50 h-8 w-8 p-0 rounded-full bg-green-600 hover:bg-white text-gray-600 hover:text-gray-800 shadow-sm"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </DialogClose>
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Main Image */}
          <img
            src={images[currentIndex] || "/placeholder.svg"}
            alt={`Product image ${currentIndex + 1}`}
            className="w-full h-full object-contain"
          />

          {/* Previous Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-green-600/20 hover:bg-white/40 text-white rounded-full"
            onClick={handlePrevious}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          {/* Next Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-green-600/20 hover:bg-white/40 text-white rounded-full"
            onClick={handleNext}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
