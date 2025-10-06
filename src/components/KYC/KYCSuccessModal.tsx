import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import piggySuccess from "@/assets/piggy-success.png"

type KYCSuccessModalProps = {
    isOpen: boolean
    onClose: () => void
    // onProceed: () => void
}

const KYCSuccessModal = ({isOpen, onClose}: KYCSuccessModalProps) => {

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent 
                className="kycDialog text-center flex flex-col items-center font-poppins"
                onInteractOutside={(e) => e.preventDefault()} 
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle className="sr-only">KYC Verification successfull</DialogTitle>
                </DialogHeader>
                
                <div>
                    <img src={piggySuccess} alt="kyc-icon" />
                </div>
                <p className="text-lg font-medium text-center text-megagreen max-w-[315px]">
                    Thank you for Completing your KYC. Your Account will be active in 24hrs After Review.
                </p>
                <DialogFooter className="font-poppins">
                    <Button
                        onClick={onClose}
                        className="bg-megagreen hover:bg-megagreen/90 text-white w-full sm:w-auto"
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
export default KYCSuccessModal;
