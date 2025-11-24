import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import successCoffetti from "@/assets/coffetti-img.png"
import successImg from "@/assets/paper-cash-bundle-img.png"



type WithdrawalSuccessModalProps ={
    onClose: () => void
    isOpen: boolean
}

const WithdrawalSuccessModal = ({isOpen,  onClose}: WithdrawalSuccessModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-linear-to-b from-[#E6FFE3] via-[#F3FFF1] to-[#FFFFFF] gap-6 pt-0 ">
                <DialogHeader className="items-center text-center relative">
                    <img src={successCoffetti} alt="error-image" className="fixed top-0 left-0 right-0"/>
                </DialogHeader>
                <div className="space-y-6">
                    <div className="">
                        <img src={successImg} alt="error-image" className="mx-auto w-60 mb-2"/>

                    </div>
                    <h2 className="text-center font-semibold text-lg">
                        You have successfully made a withdrawal request!
                        <span className="text-megagreen block">you will receive your money Within 24hrs.</span>

                    </h2>

                </div>
                <div className="w-full text-center pb-6">
                    <Button variant="outline" onClick={onClose} className="w-full sm:w-3/4 bg-transparent border-black py-5">
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
export default WithdrawalSuccessModal;