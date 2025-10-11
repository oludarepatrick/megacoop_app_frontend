import { UserRound } from "lucide-react"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"

const SavingPlanModal = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary" className="hover:bg-megagreen/10 text-left text-base">
                    <UserRound color="#14AB55" className="!w-6 !h-6"/>  Personal Savings
                </Button>
            </DialogTrigger>
            <DialogContent>
                <h1>Create Savings Plan</h1>
            </DialogContent>
        </Dialog>
    )
}
export default SavingPlanModal