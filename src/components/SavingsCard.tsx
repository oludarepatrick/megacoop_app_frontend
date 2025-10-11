import { UsersRound } from "lucide-react";
import { Button } from "./ui/button";
import { CardContent, CardHeader, CardTitle } from "./ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import SavingPlanModal from "./SavingsComponent/SavingPlanModal";


type StatProps = {
    firstName: string;
    amount: number | string;
}

const SavingsCard= ({firstName, amount, }:StatProps) => {
    return (
        <>
            <CardContent className="px-0 space-y-6">
                <CardHeader className="p-0 grid-cols-[2fr_auto]">
                    <div className="space-y-2">
                        <p className="text-xs font-normal"> Hi {firstName}, here is your Savings balance:</p>
                        <CardTitle className="text-2xl">₦{amount}</CardTitle>
                    </div>
                    <Button className="bg-white hover:bg-megagreen hover:text-white text-green-800 hidden sm:flex">View Loan</Button>
                </CardHeader>

                <div className="flex justify-between gap-2">
                    <PopOver/>
                    {/* <Button className="bg-megagreen hover:bg-megagreen/50 "> + Create Plan</Button> */}
                    <Button className="bg-white hover:bg-megagreen hover:text-white text-green-800 sm:hidden">View Loan</Button>
                    {/* <Button className="bg-white hover:bg-megagreen">View Loan</Button> */}
                    
                </div>
            </CardContent>

        </>
    )
}

export default SavingsCard;

const PopOver = () => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button className="bg-megagreen hover:bg-megagreen/50 "> + Create Plan</Button>
            </PopoverTrigger>
            <PopoverContent className="font-poppins flex flex-col space-y-2">
                <SavingPlanModal/>
                <Button variant="secondary" className="hover:bg-megagreen/10 text-base"> 
                    <UsersRound color="#14AB55" className="!w-6 !h-6" /> Community Savings
                </Button>
            </PopoverContent>
        </Popover>
    )
}