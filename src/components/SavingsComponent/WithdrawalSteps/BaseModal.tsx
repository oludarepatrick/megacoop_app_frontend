import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import bcgImg from "@/assets/header-dot-img.png"
import walletImg from "@/assets/coin-wallet-3d.png"
import blobImg from "@/assets/ornament.png"
import { useUserWallet } from "@/hooks/useAuth"
// import { Button } from "@/components/ui/button"

type BaseModalProps ={
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
}

const BaseModal = ({isOpen, onClose, children}: BaseModalProps) => {
    const {data} = useUserWallet()
 
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md p-0 font-poppins overflow-y-auto max-h-[90vh] scrollbar-hide"
                onInteractOutside={(e) => e.preventDefault()} 
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader className="rounded-lg pt-8 sm:px-20 gap-1 items-center"
                    style={{
                        backgroundImage: `url(${bcgImg})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center top",
                        backgroundSize: "contain",
                    }}
                >
                    <DialogTitle className="text-xl font-semibold text-megagreen">Withdraw Money</DialogTitle>
                    <DialogDescription className="font-medium text-black">Your Withdrawal Limit <span className="text-megagreen">₦250,000.00</span></DialogDescription>
                </DialogHeader>
                <div className="max-w-[400px] w-full mx-auto rounded-lg bg-wallet p-10 sm:px-20 text-white flex flex-col items-center justify-center"
                    style={{
                        backgroundImage: `linear-gradient(to bottom right, #06152A, #0E5D36), url(${blobImg}), url(${walletImg})`,
                        backgroundRepeat: "no-repeat, no-repeat, no-repeat",
                        backgroundPosition: "center,  left center, top right",
                        backgroundSize: "100% 100%, 300px auto, 80px auto",
                        backgroundBlendMode: "overlay",
                    }}
                >
                    <h3>Wallet Balance</h3>
                    <p className="text-xl font-semibold ">₦{data?.balance.toLocaleString()}</p>
                </div>
                
                {children}
                <div className="text-muted-foreground font-medium text-center p-8 text-xs">Transaction Secured By {""} 
                    <span className="text-megagreen">MegaCoop</span>
                </div>
            </DialogContent>
        </Dialog>
    )
}
export default BaseModal

