import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import wallet from "../../assets/expense-icon.svg";
import { Progress } from "../ui/progress";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "../ui/chart";
import { useUserWallet } from "@/hooks/useAuth";


const cashflowData = [
  { date: "1st Jan", debit: 0, credit: 0 },
  { date: "5th Jan", debit: 3000000, credit: 1000000 },
  { date: "10th Jan", debit: 7000000, credit: 3000000 },
  { date: "20th Jan", debit: 15000000, credit: 7000000 },
  { date: "31st Jan", debit: 20000000, credit: 10000000 },
];

const chartConfig = {
    debit: {
        label: "",
        color: "#FDA741"
    },
    credit: {
        label: "",
        color: "#14AB55"
    },
} satisfies ChartConfig

const MonthlySavingGoal = ()=> {
    const {data: totalSaving} = useUserWallet();
    return (
        <Card className="flex-1 min-w-[280px] max-w-full">
            <CardHeader className="flex justify-between gap-4 items-center">
                <CardTitle className="text-xl font-medium truncate">This Month</CardTitle>
                <CardDescription className="uppercase text-megagreen text-xs whitespace-nowrap">View More</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex gap-4 min-w-0">
                    <div className="shrink-0">
                        <img src={wallet} alt="wallet-icon" className="w-8 h-8" />
                    </div>
                    <div className="flex-1 space-y-4 min-w-0">
                        <div className="flex justify-between text-sm gap-2">
                            <span className="truncate">Cashflow</span>
                            <span className="font-medium whitespace-nowrap">₦{totalSaving?.total_savings.toLocaleString()}.00</span>
                        </div>
                        <Progress value={40} className="h-2 bg-megaorange" />
                        <p className="text-xs text-muted-foreground break-words">More money left than you made 👀</p>
                    </div>
                </div>
                <div className="overflow-x-auto green-scrollbar pt-8">
                    <ChartContainer config={chartConfig} className="h-auto md:min-h-[200px] 2xl:min-h-[200px]  min-w-full mb-4"  >
                        <LineChart accessibilityLayer data={cashflowData} margin={{ top: 12, right: 12, left: 20, bottom: 20 }}>
                            <CartesianGrid vertical={false} stroke="#25282c7f" opacity={0.3} />
                            <XAxis
                                dataKey="date"
                                tickLine={true}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => {
                                    return value === '1st Jan' || value === '31st Jan' ? value : '';
                                }}
                            />
                            <ChartTooltip content={<ChartTooltipContent cursor={false}  />} />
                            <Line dataKey="debit" type="monotone" stroke="var(--color-debit)" strokeWidth={2} />
                            <Line dataKey="credit" type="monotone" stroke="var(--color-credit)" strokeWidth={2} />
                        </LineChart>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
    )
}

export default MonthlySavingGoal;