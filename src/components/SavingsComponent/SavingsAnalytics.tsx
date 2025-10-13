import MonthlySavingGoal from "./MonthlySavingGoal";
import YearlySavingGoal from "./YearlySavingGoal";

const SavingAnalytics = ()=> {
    return (
        <div className="flex flex-wrap gap-4">
            <YearlySavingGoal/>
            <MonthlySavingGoal/>
        </div>
    )
}

export default SavingAnalytics;