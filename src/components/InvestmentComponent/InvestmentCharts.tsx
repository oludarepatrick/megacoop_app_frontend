import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"

interface ChartDataPoint {
  year: number
  investment: number
  revenue: number
}

interface InvestmentChartsProps {
  data?: ChartDataPoint[]
}

export default function InvestmentCharts({ data }: InvestmentChartsProps) {
  const defaultData = [
    { year: 2016, investment: 5000, revenue: 10000 },
    { year: 2017, investment: 23000, revenue: 15000 },
    { year: 2018, investment: 16000, revenue: 20000 },
    { year: 2019, investment: 35000, revenue: 30000 },
    { year: 2020, investment: 20000, revenue: 25000 },
    { year: 2021, investment: 28000, revenue: 35000 },
  ]

  const chartData = data || defaultData

  const formatYAxis = (value: number) => {
    return `$${value / 1000}k`
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
      {/* Yearly Total Investment Chart */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Yearly Total Investment</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="year" axisLine={true} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
                <YAxis
                  axisLine={true}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#10B981" }}
                  tickFormatter={formatYAxis}
                  domain={[0, 40000]}
                  ticks={[0, 10000, 20000, 30000, 40000]}
                />
                <Line
                  type="monotone"
                  dataKey="investment"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  dot={{ fill: "#F59E0B", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: "#F59E0B" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Revenue Chart */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Monthly Revenue</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="year" axisLine={true} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
                <YAxis
                  axisLine={true}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#10B981" }}
                  tickFormatter={formatYAxis}
                  domain={[0, 40000]}
                  ticks={[0, 10000, 20000, 30000, 40000]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: "#10B981" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
