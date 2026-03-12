import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import wallet from "../../assets/expense-icon.svg";
import { Progress } from "../ui/progress";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "../ui/chart";
// import { useUserWallet } from "@/hooks/useAuth";
import { useMonthlySavingStats } from "@/hooks/useSaving";


// const cashflowData = [
//   { date: "1st Jan", debit: 0, credit: 0 },
//   { date: "5th Jan", debit: 3000000, credit: 1000000 },
//   { date: "10th Jan", debit: 7000000, credit: 3000000 },
//   { date: "20th Jan", debit: 15000000, credit: 7000000 },
//   { date: "31st Jan", debit: 20000000, credit: 10000000 },
// ];

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
    //    const { data: totalSaving } = useUserWallet()
    const { data: monthlySavings } = useMonthlySavingStats()

    // Get current month name and total days e.g. "Jan", 31
    const now = new Date()
    const currentMonthAbbr = now.toLocaleString("default", { month: "short" }) // "Jan"
    const totalDaysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()

    // Helper: 1 → "1st", 2 → "2nd", 3 → "3rd", 5 → "5th"
    const ordinal = (n: number) => {
        const s = ["th", "st", "nd", "rd"]
        const v = n % 100
        return n + (s[(v - 20) % 10] ?? s[v] ?? s[0])
    }

    // Map API data — use "day" not "date" to match the API shape
    const chartData = monthlySavings?.data.map(item => ({
        day: item.day,
        label: `${ordinal(item.day)} ${currentMonthAbbr}`, 
        credit: item.credit,
        debit: item.debit,
    })) ?? []

    // ── Cashflow calculation ───────────────────────────────────────────
    // Sum all credits and debits for the month
    const totalCredit = chartData.reduce((acc, item) => acc + item.credit, 0)
    const totalDebit  = chartData.reduce((acc, item) => acc + item.debit, 0)
    const totalFlow   = totalCredit + totalDebit

    // Progress bar fill = credit %, background = debit %
    const creditPercentage = totalFlow > 0 ? Math.min((totalCredit / totalFlow) * 100, 100) : 0

    const cashflowMessage =
        creditPercentage >= 70 ? "Great cashflow this month 👌" :
        creditPercentage >= 40 ? "Balanced cashflow this month" :
        "More going out than coming in ⚠️"


    return (
        <Card className="flex-1 min-w-[280px] max-w-full">
            <CardHeader className="flex justify-between gap-4 items-center">
                <CardTitle className="text-xl font-medium truncate">This Month</CardTitle>
                {/* <CardDescription className="uppercase text-megagreen text-xs whitespace-nowrap">View More</CardDescription> */}
            </CardHeader>
            <CardContent>
                <div className="flex gap-4 min-w-0">
                    <div className="shrink-0">
                        <img src={wallet} alt="wallet-icon" className="w-8 h-8" />
                    </div>
                    <div className="flex-1 space-y-4 min-w-0">
                        <div className="flex justify-between text-sm gap-2">
                            <span className="truncate">Cashflow</span>
                            <span className="font-medium whitespace-nowrap">₦{totalFlow.toLocaleString()}.00</span>
                        </div>
                        <Progress value={creditPercentage} className="h-2 bg-megaorange [&>[data-slot=progress-indicator]]:bg-megagreen" />
                        <p className="text-xs text-muted-foreground break-words">{cashflowMessage}</p>
                    </div>
                </div>
                <div className="overflow-x-auto green-scrollbar pt-8">
                    <ChartContainer config={chartConfig} className="h-auto md:min-h-[200px] 2xl:min-h-[200px]  min-w-full mb-4"  >
                        <LineChart accessibilityLayer data={chartData} margin={{ top: 12, right: 12, left: 20, bottom: 20 }}>
                            <CartesianGrid vertical={false} stroke="#25282c7f" opacity={0.3} />
                            <XAxis
                                dataKey="label"
                                tickLine={true}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => {
                                    const firstDay = `${ordinal(1)} ${currentMonthAbbr}`
                                    const lastDay  = `${ordinal(totalDaysInMonth)} ${currentMonthAbbr}`
                                    return value === firstDay || value === lastDay ? value : ""
                                }}                                
                            />
                            <ChartTooltip content={<ChartTooltipContent cursor={false}  />} />
                            <Line dataKey="debit" type="monotone" stroke="var(--color-debit)" strokeWidth={2} dot={false} />
                            <Line dataKey="credit" type="monotone" stroke="var(--color-credit)" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
    )
}

export default MonthlySavingGoal;