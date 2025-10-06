import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Link } from "react-router-dom";
import { Cell, Pie, PieChart } from "recharts";


const goals = [
  { title: "Sales of Goods", percent: 60, color: "#037BCB" },
  { title: "Property Rentals", percent: 70, color: "#03CBB3" },
  { title: "New Phone", percent: 43, color: "#FB18BB" },
  { title: "Service", percent: 10, color: "#037BCB" },
  { title: "Sales of Goods", percent: 60, color: "#037BCB" },
]



const SavingGoal= () => {
    return (
        // <section className="">
        <Card className="px-4 py-4 ">
            <CardHeader className="flex justify-between items px-2">
                <CardTitle className="text-xl font-semibold">Saving Goals</CardTitle>
                <Link to="" className="text-footertext text-sm ">See All</Link>
            </CardHeader>
            <CardContent className="p-0 flex flex-col gap-4">
                {goals.map((goal, index) => {
                    const data = [
                        { value: goal.percent},
                        {value: 100 -goal.percent},
                    ]
                    return (
                        <div key={index} className="flex items-center justify-between  gap-4 rounded-lg bg-card border shadow-sm p-2">
                            <div className="flex items-center gap-4">
                                <div className="relative w-12 h-12">
                                    <PieChart width={48} height={48}>
                                        <Pie
                                            data={data}
                                            dataKey="value"
                                            innerRadius={16}
                                            outerRadius={24}
                                            startAngle={90}
                                            endAngle={-270}
                                        >
                                            <Cell key="progress" fill={goal.color}  />
                                            <Cell key="rest" fill={goal.color} fillOpacity={0.4}/>
                                        </Pie>
                                    </PieChart>
                                    <div className="text-xs absolute inset-0 flex items-center justify-center font-bold ">
                                        {goal.percent}%
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium text-main text-sm">{goal.title}</h4>
                                    <p className="text-xs text-muted-foreground">1 month left</p>
                                </div>
                            </div>
                            <ChevronRight className="text-muted-foreground w-4 h-4" />
                        </div>
                        
                    )
                })}
            </CardContent>
        </Card>
        // </section>
    )
}

export default SavingGoal;

