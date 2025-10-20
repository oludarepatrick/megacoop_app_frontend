import { Button } from "./ui/button";
import { CardContent, CardHeader, CardTitle } from "./ui/card";
import SavingPlanModal from "./SavingsComponent/SavingPlanModal";
import { useNavigate } from "react-router-dom";


type StatProps = {
    firstName: string;
    amount: number | string;
}

const SavingsCard= ({firstName, amount, }:StatProps) => {
    const navigate = useNavigate();
    
    const handleViewLoan = () => {
        navigate('/user/savings-loan?view=loan');
    };
    
    return (
        <>
            <CardContent className="px-0 space-y-6">
                <CardHeader className="p-0 grid-cols-[2fr_auto]">
                    <div className="space-y-2">
                        <p className="text-xs font-normal"> Hi {firstName}, here is your Savings balance:</p>
                        <CardTitle className="text-2xl">₦{amount}</CardTitle>
                    </div>
                    <Button 
                        onClick={handleViewLoan}
                        className="bg-white hover:bg-megagreen hover:text-white text-green-800 hidden sm:flex"
                    >
                        View Loan
                    </Button>
                </CardHeader>

                <div className="flex justify-between gap-2">
                    <SavingPlanModal/>
                    <Button 
                        onClick={handleViewLoan}
                        className="bg-white hover:bg-megagreen hover:text-white text-green-800 sm:hidden"
                    >
                        View Loan
                    </Button>                    
                </div>
            </CardContent>

        </>
    )
}

export default SavingsCard;
