import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type KYCPendingModalProps = {
    isOpen: boolean
    onClose: () => void
}

const KYCPendingModal = ({isOpen, onClose}: KYCPendingModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent 
                className="kycDialog text-center flex flex-col items-center font-poppins"
                onInteractOutside={(e) => e.preventDefault()} 
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader className="sr-only">
                    <DialogTitle className="sr-only">KYC Under Review</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-3 text-center">
                    <p className="text-xl font-medium text-center max-w-[315px]">
                        Your KYC is under review
                    </p>
                    <p className="text-sm text-gray-600 max-w-[280px]">
                        We are currently reviewing your documents. You will be notified when your account is ready.
                    </p>
                </div>

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
export default KYCPendingModal;