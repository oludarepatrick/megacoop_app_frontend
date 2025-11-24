import { Button } from "../ui/button"
import type { SavingPlan } from "@/types/savingType"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import bcgImg from "@/assets/coin-wallet-3d.png"


type SavingGoalDetailModalProps ={
    onClose: () => void
    onConfirm: () => void
    onProceed: () => void
    isOpen: boolean
    savings: SavingPlan
}

const SavingGoalDetailModal = ({isOpen, onClose, onConfirm, onProceed, savings}:SavingGoalDetailModalProps) => {
    return(
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="gap-6 pb-10"
                style={{
                        backgroundImage: `url(${bcgImg})`,
                        backgroundPosition: "right",
                        backgroundRepeat: " no-repeat",
                        backgroundSize: "120px",
                    }}
            >
                <DialogHeader className="items-center text-center border-b border-icon/30 py-4" aria-describedby={undefined}>
                    <DialogTitle className="text-megagreen">Saving Goal Detail</DialogTitle>
                </DialogHeader>
                <div className="px-8 space-y-3">
                    <div>
                        <p className="text-muted-foreground">Goal Name</p>
                        <p className="font-medium">{} {savings.goal_name}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Purpose</p>
                        <p className="font-medium">{savings.purpose}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Target Amount</p>
                        <p className="font-medium text-megagreen">₦{savings.target_amount}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Total Saved</p>
                        <p className="font-medium text-megagreen">₦{savings.total_saved}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Frequency</p>
                        <p className="font-medium capitalize">{savings.frequency}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Status</p>
                        <p className="font-medium capitalize">{savings.saving_status}</p>
                    </div>
                    
                </div>
                <div className="flex gap-8 px-8 ">
                    <Button
                        className="bg-red-600 hover:bg-red-600/90 px-6" 
                        onClick={onProceed}
                    >
                        Partial Withdrawal
                    </Button>
                    <Button variant="outline" className="border-red-600 text-red-800 px-6 hover:bg-transparent" 
                        onClick={onConfirm}
                    >
                        Terminate
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
export default SavingGoalDetailModal;