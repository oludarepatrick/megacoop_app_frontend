import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import kycIcon from "@/assets/kyc-icon.svg"

type KYCRequiredModalProps = {
    isOpen: boolean
    onClose: () => void
    onProceed: () => void
}

const KYCRequiredModal = ({isOpen, onClose, onProceed}: KYCRequiredModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent 
                className="kycDialog text-center flex flex-col items-center font-poppins"
                onInteractOutside={(e) => e.preventDefault()} 
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle className="sr-only">Complete KYC</DialogTitle>
                </DialogHeader>
                
                <div>
                    <img src={kycIcon} alt="kyc-icon" />
                </div>
                <p className="text-lg font-medium text-center max-w-[315px]">
                    Welcome! Please complete your KYC verification to continue
                </p>
                <DialogFooter className="gap-2 sm:gap-10 sm:justify-between font-poppins">
                    <Button
                        onClick={onProceed}
                        className="bg-megagreen hover:bg-megagreen/90 text-white w-full sm:w-auto"
                    >
                        Proceed
                    </Button>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="border-icon"
                    >
                        Cancel
                    </Button>
          
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
export default KYCRequiredModal;

