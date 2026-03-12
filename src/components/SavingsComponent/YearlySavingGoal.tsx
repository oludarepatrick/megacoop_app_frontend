import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import wallet from "../../assets/expense-icon.svg";
import { Progress } from "../ui/progress";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "../ui/chart";
import { useSavingPlans, useYearlySavingCharts } from "@/hooks/useSaving";
import { formatCurrency } from "@/common/utils";


const chartConfig = {
    month:{
        label: "month",
        color: "#14AB55"
    },

} satisfies ChartConfig

const YearlySavingGoal = ()=> {
    const {data: goals = []} = useSavingPlans();
    const {data: yearlySavings} = useYearlySavingCharts();

    const chartData = yearlySavings?.data.map(item => ({
        month: item.month,
        value: item.credit
    })) ?? []

    // get amount saved and total targeton all goals
    const totalSaved = goals.reduce((acc, goal) => acc + Number(goal.total_saved), 0);
    const totalTarget = goals.reduce((acc, goal) => acc + Number(goal.target_amount), 0);

    // calculate average saving amount and percentage of target achieved
    const averageSavingAmount = goals.length > 0 ? totalSaved / goals.length : 0;

    const percentageOfTarget = totalTarget > 0 
    ? Math.min((totalSaved / totalTarget) * 100, 100) 
    : 0;

    return (
        <Card className="flex-1 min-w-[280px] max-w-full">
            <CardHeader className="flex justify-between gap-4 items-center">
                <CardTitle className="text-xl font-medium truncate">Saving Goals</CardTitle>
                {/* <CardDescription className="uppercase text-megagreen text-xs whitespace-nowrap">View More</CardDescription> */}
            </CardHeader>
            <CardContent>
                <div className="flex gap-4 min-w-0">
                    <div className="shrink-0">
                        <img src={wallet} alt="wallet-icon" className="w-8 h-8" />
                    </div>
                    <div className="flex-1 space-y-4 min-w-0">
                        <div className="flex justify-between text-sm gap-2">
                            <span className="truncate">Average</span>
                            <span className="font-medium whitespace-nowrap">
                                {formatCurrency(averageSavingAmount)}
                            </span>
                        </div>
                        <Progress value={percentageOfTarget} className="h-2" />
                        <p className="text-xs text-muted-foreground break-words">
                            { percentageOfTarget > 0 ? 
                                "Looking good so far👌" : 
                                "Start saving to see your progress here!"}
                        </p>
                    </div>
                </div>
                <div className="overflow-x-auto green-scrollbar pt-8">
                    <ChartContainer config={chartConfig} className="h-auto md:min-h-[200px] 2xl:min-h-[200px]  min-w-full mb-4"  >
                        <LineChart accessibilityLayer data={chartData} margin={{ top: 12, right: 12, left: 20, bottom: 20 }}>
                            <CartesianGrid vertical={false} stroke="#25282c7f" opacity={0.3} />
                            <XAxis
                                dataKey="month"
                                tickLine={true}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => {
                                    return value === 'Jan' || value === 'Dec' ? value : '';
                                }}
                            />
                            <ChartTooltip content={<ChartTooltipContent cursor={false}  />} />
                            <Line dataKey="value" type="linear" stroke="var(--color-month)" strokeWidth={2} />
                        </LineChart>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
    )
}
export default YearlySavingGoal;