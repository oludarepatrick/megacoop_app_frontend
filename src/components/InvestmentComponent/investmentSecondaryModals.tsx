import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import errorImg from "@/assets/warning-rounded.svg"

type CancelModalProps = {
  onClose: () => void
  onCancel: () => void
}
export const CancelModal = ({onClose, onCancel}:CancelModalProps) => {
    return (
        <Dialog open={true}>
            <DialogTrigger asChild>
                <Button> Cancel </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-linear-to-b from-[#CAE7D6] to-[#F5FBF8] justify-center gap-10">
                <DialogHeader className="text-center">
                <img src={errorImg} alt="error-image" className="mx-auto h-24 w-24 mb-2"/>
                <DialogTitle className="sr-only">Error</DialogTitle>
                <DialogDescription className="text-xl text-black mt-2 font-poppins max-w-[315px] mx-auto text-center">
                    Are You sure you want to cancel this transaction?
                </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex gap-2 sm:justify-center">
                <Button onClick={onCancel} className="rounded-full bg-[#105D38] hover:bg-green-700">
                    Yes
                </Button>
                <Button variant="outline" onClick={onClose} className="rounded-full border-[#105D38]">
                    No
                </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

type FailedModalProps = {
  isOpen: boolean
  onClose: () => void
}

export const InvestPaymentFailedModal = ({isOpen, onClose}: FailedModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-linear-to-b from-[#CAE7D6] to-[#F5FBF8] justify-center gap-10">
                <DialogHeader className="text-center">
                <img src={errorImg} alt="error-image" className="mx-auto h-24 w-24 mb-2"/>
                <DialogTitle className="sr-only">Error</DialogTitle>
                <DialogDescription className="text-xl text-black mt-2 font-poppins max-w-[315px] mx-auto text-center">
                    Transaction Failed. Try again later
                </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex gap-2 sm:justify-center">
                <Button variant="destructive" onClick={onClose} className="rounded-full" >
                    Close
                </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
