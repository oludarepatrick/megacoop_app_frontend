import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import wallet from "../../assets/expense-icon.svg";
import { Progress } from "../ui/progress";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "../ui/chart";

const savingData = [
    { month: "Jan", value: 2000000 },
    { month: "Feb", value: 10000000 },
    { month: "Mar", value: 5000000 },
    { month: "Apr", value: 20000000 },
    { month: "May", value: 12000000 },
    { month: "Jun", value: 15000000 },
    { month: "Jul", value: 13000000 },
    { month: "Aug", value: 14000000 },
    { month: "Sep", value: 20000000 },
    { month: "Oct", value: 12000000 },
    { month: "Nov", value: 15000000 },
    { month: "Dec", value: 15000000 },
]

const chartConfig = {
    month:{
        label: savingData.map(month => month.month),
        color: "#14AB55"
    },

} satisfies ChartConfig

const YearlySavingGoal = ()=> {
    return (
        <Card className="flex-1 min-w-[280px] max-w-full">
            <CardHeader className="flex justify-between gap-4 items-center">
                <CardTitle className="text-xl font-medium truncate">Saving Goals</CardTitle>
                <CardDescription className="uppercase text-megagreen text-xs whitespace-nowrap">View More</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex gap-4 min-w-0">
                    <div className="shrink-0">
                        <img src={wallet} alt="wallet-icon" className="w-8 h-8" />
                    </div>
                    <div className="flex-1 space-y-4 min-w-0">
                        <div className="flex justify-between text-sm gap-2">
                            <span className="truncate">Average</span>
                            <span className="font-medium whitespace-nowrap">₦500,000.00</span>
                        </div>
                        <Progress value={30} className="h-2" />
                        <p className="text-xs text-muted-foreground break-words">Looking good so far👌</p>
                    </div>
                </div>
                <div className="overflow-x-auto green-scrollbar pt-8">
                    <ChartContainer config={chartConfig} className="h-auto md:min-h-[200px] 2xl:min-h-[200px]  min-w-full mb-4"  >
                        <LineChart accessibilityLayer data={savingData} margin={{ top: 12, right: 12, left: 20, bottom: 20 }}>
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