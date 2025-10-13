import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import pendingIcon from "@/assets/pending-icon.svg"

type KYCContinueModalProps = {
    isOpen: boolean
    onClose: () => void
    onContinue: () => void
    nextStepName?: string
    completedSteps?: string[]
}

const KYCContinueModal = ({isOpen, onClose, onContinue, nextStepName = "Next Step", completedSteps = []}: KYCContinueModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent 
                className="kycDialog text-center flex flex-col items-center font-poppins"
                onInteractOutside={(e) => e.preventDefault()} 
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle className="sr-only">Continue KYC</DialogTitle>
                </DialogHeader>
                
                <div>
                    <img src={pendingIcon} alt="kyc-continue-icon" />
                </div>
                
                <div className="space-y-3 text-center">
                    <p className="text-lg font-medium max-w-[315px]">
                        Welcome back! Continue your KYC verification from where you left off
                    </p>
                    
                    {completedSteps.length > 0 && (
                        <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-xs font-medium text-green-800">
                                ✅ Completed: {completedSteps.join(", ")}
                            </p>
                        </div>
                    )}
                    
                    <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-orange-800">
                            📋 Next: {nextStepName} Verification
                        </p>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-10 sm:justify-between font-poppins">
                    <Button
                        onClick={onContinue}
                        className="bg-megagreen hover:bg-megagreen/90 text-white w-full sm:w-auto"
                    >
                        Continue
                    </Button>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="border-icon"
                    >
                        Later
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
export default KYCContinueModal;