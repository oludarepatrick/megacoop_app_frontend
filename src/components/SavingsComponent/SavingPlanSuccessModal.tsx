import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import successImg from "@/assets/success-bg.png"

type SuccessModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  description: string
}

export function SavingPlanSuccessModal({
  isOpen,
  onClose,
  onConfirm,
  description
}: SuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="font-poppins sm:max-w-md bg-no-repeat bg-center bg-cover h-[500px] flex flex-col justify items-center gap-10 pt-54"
        style={{ backgroundImage: `url(${successImg})` }}
      >
        <DialogHeader className="text-center">
            <DialogTitle className="text-2xl text-center font-medium">Congratulations</DialogTitle>
            <DialogDescription className="text-center text-megagreen">
                {description}
            </DialogDescription>
        </DialogHeader>
        <div className="w-full space-y-4 text-center">
            <Button onClick={onClose} className="w-full sm:w-3/4 bg-gradient-to-t from-[#105D38] to-[#1BE572]">
                Back to Dashboard
            </Button>
            <Button variant="outline" onClick={onConfirm} className="w-full sm:w-3/4 bg-transparent border-black py-5">
                Close
            </Button>
        </div>
          
      </DialogContent>
    </Dialog>
  )
}