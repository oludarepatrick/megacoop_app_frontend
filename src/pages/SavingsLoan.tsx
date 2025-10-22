import { lazy, Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import SavingGoal from "@/components/SavingGoal";
import NextAchievement from "@/components/SavingsComponent/NextAchievement";
import SavingsAnalytics from "@/components/SavingsComponent/SavingsAnalytics";
import SavingsOverview from "@/components/SavingsComponent/SavingsOverview";
import SavingsTransaction from "@/components/SavingsComponent/SavingsTransaction";
import PageLoader from "@/components/PageLoader";

const LoanDashboard = lazy(() => import("./loans/LoansDashboard"));

const SavingsLoan = () => {
    const [searchParams] = useSearchParams();
    const currentView = searchParams.get('view') || 'savings';

    if (currentView === 'loan') {
        return (
            <div className="font-poppins">
                <Suspense fallback={<PageLoader />}>
                    <LoanDashboard />
                </Suspense>
            </div>
        );
    }
    return (
        <div className="font-poppins">
            <SavingsOverview/>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
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