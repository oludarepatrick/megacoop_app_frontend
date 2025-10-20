// import DashboardAnalytics from "@/components/DashboardComponent/DashboardAnalytics";
import SavingGoal from "@/components/SavingGoal";
import NextAchievement from "@/components/SavingsComponent/NextAchievement";
import SavingsAnalytics from "@/components/SavingsComponent/SavingsAnalytics";
import SavingsOverview from "@/components/SavingsComponent/SavingsOverview";
import SavingsTransaction from "@/components/SavingsComponent/SavingsTransaction";

const SavingsLoan = () => {
    return (
        <div className="font-poppins">
            <SavingsOverview/>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
                {/* <div className="flex flex-col md:flex-row gap-12 pt-2 bg-green-400"> */}
                    <div className="lg:col-span-8 flex flex-col gap-5">
                        <SavingsAnalytics/>
                        <SavingsTransaction/>
                    </div>
                    <div className="lg:col-span-4 flex flex-col gap-5">
                        <NextAchievement/>
                        <SavingGoal/>
                    </div>
            </div>
        </div>
    )
}

export default SavingsLoan;