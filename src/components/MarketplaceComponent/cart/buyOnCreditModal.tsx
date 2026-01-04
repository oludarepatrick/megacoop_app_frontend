import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ShoppingCart,  X } from "lucide-react"


interface ProductDetailModalProps {
  isOpen: boolean
    onClose: () => void
  onProceed: () => void
}

export function BuyOnCreditModal({ isOpen, onClose, onProceed }: ProductDetailModalProps) {
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className=" max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-megagreen items-center sr-only"> Buy on Credit
            </DialogTitle>
            <DialogClose asChild>
              <button className="absolute right-4 top-4">
                <X className="w-4 h-4" />
              </button>
            </DialogClose>
          </DialogHeader>

          <div className="flex flex-col gap-6 items-center">
            <div>
                <ShoppingCart className="text-megagreen w-10 h-10"/>
            </div>

            <p className="text-center font-medium sm:w-[90%]">
                Interest rate of 10% is attach to buying this product on credit 
                and repayment cannot exceed 6 months, Click on <span className="text-green-800">proceed to 
                continue if you agree with our terms</span>
            </p>
            {/* Add to Cart Button */}
            <Button className="w-1/2 bg-green-600 hover:bg-green-700 text-white py-6 text-lg" onClick={onProceed}>
                <ShoppingCart className="w-5 h-5 mr-2" />
                Proceed
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
