import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { 
    ChartContainer, 
    ChartLegend, 
    ChartLegendContent, 
    ChartTooltip, 
    ChartTooltipContent, 
    type ChartConfig 
} from "../ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const userAnalytics= [
    { month: "Jan", income: 40000, outcome: 30000 },
    { month: "Feb", income: 32000, outcome: 35000 },
    { month: "Mar", income: 35000, outcome: 28000 },
    { month: "Apr", income: 30000, outcome: 48000 },
    { month: "May", income: 45000, outcome: 37000 },
    { month: "Jun", income: 31000, outcome: 22000 },
    { month: "Jul", income: 50000, outcome: 34000 },
    { month: "Aug", income: 30000, outcome: 32000 },
    { month: "Sept", income: 31000, outcome: 22000 },
    { month: "Oct", income: 50000, outcome: 34000 },
    { month: "Nov", income: 30000, outcome: 32000 },
    { month: "Dec", income: 30000, outcome: 32000 },
]

const chartConfig = {
    income:{
        label: "Income",
        color: "#14AB55"
    },
    outcome: {
        label: "Outcome",
        color: "#CCFFE2",
    }

} satisfies ChartConfig

type LegendProps ={
    config: ChartConfig;
    className: string
}


const DashboardAnalytics = () => {
    const CustomLegend = ({config, className}:LegendProps) => {
        return (
            <div className={`flex items-center gap-4 ${className}`}>
                {Object.entries(config).map(([key, item]) => (
                    <div key={key} className="flex items-center gap-2">
                        <div 
                            className="w-2 h-2 rounded-sm" 
                            style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-muted-foreground">{item.label}</span>
                    </div>
                ))}
            </div>
        );
    };
    return (
        // <section className="">
        <Card className="px-2 pb-2 ">
            <CardHeader className="flex justify-between px-2">
                <CardTitle className="text-[28px] font-medium">Analytics</CardTitle>
                <div className="flex gap-4">
                    <CustomLegend config={chartConfig} className="hidden md:flex"/>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="2025" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2025">2025</SelectItem>
                            <SelectItem value="2024">2024</SelectItem>
                            <SelectItem value="2023">2023</SelectItem>
                            <SelectItem value="2021">2021</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <div className="overflow-x-auto green-scrollbar">
                <ChartContainer config={chartConfig} className="h-[300px] md:h-auto lg:h-[300px] 2xl:h-auto md:min-h-[200px] 2xl:min-h-[200px]  min-w-[800px] mb-4"  >
                    <BarChart accessibilityLayer data={userAnalytics} barGap={0} className="p-0">
                        <CartesianGrid vertical={false} strokeDasharray="3" stroke="#25282c7f" opacity={0.3} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            // tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                        />
                        <ChartTooltip content={<ChartTooltipContent/>} />
                        <ChartLegend content={<ChartLegendContent />} className="md:hidden justify-start" />
                        <Bar dataKey={"outcome"} fill="var(--color-outcome)" />
                        <Bar dataKey={"income"} fill="var(--color-income)" />
                    </BarChart>

                </ChartContainer>
            </div>
        </Card>
        // </section>
    )
}

export default DashboardAnalytics ;