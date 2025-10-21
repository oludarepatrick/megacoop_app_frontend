import DashboardAnalytics from "@/components/DashboardComponent/DashboardAnalytics";
import DashboardOverview from "@/components/DashboardComponent/DashboardOverview";
import DashboardTransation from "@/components/DashboardComponent/DashboardTransaction";
import MarketView from "@/components/DashboardComponent/MarketView";
import SavingGoal from "@/components/SavingGoal";

const Dashboard = () => {
    
    return (
        <div className="font-poppins">
            <DashboardOverview/>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
            {/* <div className="flex flex-col md:flex-row gap-12 pt-2 bg-green-400"> */}
                <div className="lg:col-span-8 flex flex-col gap-5">
                    <DashboardAnalytics/>
                    <DashboardTransation/>
                </div>
                <div className="lg:col-span-4 flex flex-col gap-5">
                    <MarketView/>
                    <SavingGoal/>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;