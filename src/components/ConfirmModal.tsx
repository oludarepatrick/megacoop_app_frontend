import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog"
import { Button } from "./ui/button"
import warningIcon from "@/assets/Error_icon.png"
import { Loader2 } from "lucide-react"


type ConfirmModalProps ={
    onClose: () => void
    onProceed?: () => void
    isPending: boolean
    isOpen: boolean
    // text: string
}

const ConfirmModal = ({isOpen, isPending, onClose, onProceed}: ConfirmModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-sm bg-linear-to-b from-[#CAE7D6] to-[#F5FBF8] justify-center gap-10">
                <DialogHeader className="items-center text-center" >
                    <img src={warningIcon} alt="error-image" className="mx-auto h-14 w-14 mb-2"/>
                    <DialogDescription className="text-center font-semibold text-green-900">
                        Are you sure you want to <br/>Terminate this Plan
                    </DialogDescription>
                </DialogHeader>
                    <div className="flex justify-center gap-8 ">
                        <Button 
                            className="bg-[#105D38] hover:bg-[#105D38]/90 rounded-full px-6" 
                            disabled={isPending} onClick={onProceed}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin " />
                                    Processing...
                                </>
                                ): "Yes"
                            }
                                
                        </Button>
                        <Button variant="outline" className="border-[#105D38] text-green-800 rounded-full px-6" disabled={isPending} onClick={onClose}>No</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
export default ConfirmModal;