import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import successImg from "@/assets/success-bg.png"

type SuccessModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function InvestmentSuccessModal({
  isOpen,
  onClose,
}: SuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="font-poppins sm:max-w-md bg-no-repeat bg-center bg-cover h-[500px] flex flex-col justify items-center gap-10 pt-54"
        style={{ backgroundImage: `url(${successImg})` }}
      >
        <DialogHeader className="text-center">
            <DialogTitle className="text-2xl text-center font-medium">Congratulations</DialogTitle>
            <DialogDescription className="text-center px-10">
                You have successfully Subscribe to your preferred Investment Plan.{" "}
                <span className="text-megagreen font-semibold">ENJOY</span>
            </DialogDescription>
        </DialogHeader>
        <DialogFooter className="w-full sm:justify-center">
            <Button variant="outline" onClick={onClose} className="sm:w-3/4 bg-transparent border-black py-5">
                Close
            </Button>
        </DialogFooter>
          
      </DialogContent>
    </Dialog>
  )
}


//  const getSuccessMessage = () => {
//     if ('investmentType' in investData) {
//       // Pooled investment
//       const pooledData = investData as PooledFormData
//       const planNames = {
//         'starter-pool': 'Starter Pool',
//         'growth-pool': 'Growth Pool', 
//         'premium-pool': 'Premium Pool'
//       }
//       return `You have successfully subscribed for a ${planNames[pooledData.investmentType]} Investment Plan.`
//     } else {
//       // Housing investment
//       const housingData = investData as HousingFormData
//       const planNames = {
//         'MoFi-housing-fund': 'MoFi Housing Fund',
//         'NHF': 'National Housing Fund (NHF)'
//       }
//       return `You have successfully subscribed for a ${planNames[housingData.investmentType]} Investment Plan.`
//     }