"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, Pie, PieChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Cell } from "recharts"
import { useCRM } from "./crm-provider"

const chartConfig = {
  conversions: {
    label: "Conversions",
    color: "hsl(var(--chart-1))",
  },
  leads: {
    label: "Leads",
    color: "hsl(var(--chart-2))",
  },
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-3))",
  },
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function Analytics() {
  const { contacts } = useCRM()

  // Generate conversion data over time (mock data based on contacts)
  const conversionData = [
    { month: "Jan", conversions: 12, leads: 45 },
    { month: "Feb", conversions: 19, leads: 52 },
    { month: "Mar", conversions: 15, leads: 48 },
    { month: "Apr", conversions: 22, leads: 61 },
    { month: "May", conversions: 18, leads: 55 },
    { month: "Jun", conversions: 25, leads: 67 },
  ]

  // Lead source breakdown
  const sourceData = [
    { name: "Website", value: contacts.filter((c) => c.source === "Website").length || 35 },
    { name: "Referral", value: contacts.filter((c) => c.source === "Referral").length || 25 },
    { name: "LinkedIn", value: contacts.filter((c) => c.source === "LinkedIn").length || 20 },
    { name: "Cold Email", value: 15 },
    { name: "Other", value: 5 },
  ]

  // Rep performance data
  const repData = [
    { rep: "John Doe", deals: contacts.filter((c) => c.rep === "John Doe" && c.status === "won").length || 8 },
    { rep: "Jane Smith", deals: contacts.filter((c) => c.rep === "Jane Smith" && c.status === "won").length || 12 },
    { rep: "Mike Johnson", deals: contacts.filter((c) => c.rep === "Mike Johnson" && c.status === "won").length || 6 },
    { rep: "Sarah Wilson", deals: 10 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Analytics</h2>
        <p className="text-muted-foreground">Insights into your sales performance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Conversions Over Time */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Conversions Over Time</CardTitle>
            <CardDescription>Monthly conversion trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={conversionData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="conversions"
                    stroke="var(--color-conversions)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-conversions)" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="leads"
                    stroke="var(--color-leads)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-leads)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Lead Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Sources</CardTitle>
            <CardDescription>Where your leads come from</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Rep Performance */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Sales Rep Performance</CardTitle>
            <CardDescription>Deals closed by each sales representative</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={repData}>
                  <XAxis dataKey="rep" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="deals" fill="var(--color-revenue)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contacts.length}</div>
            <p className="text-xs text-muted-foreground">All time leads</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contacts.length > 0
                ? Math.round((contacts.filter((c) => c.status === "won").length / contacts.length) * 100)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">Leads to customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Deal Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$5,000</div>
            <p className="text-xs text-muted-foreground">Average revenue per deal</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(contacts.filter((c) => ["qualified", "proposal"].includes(c.status)).length * 5000).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Potential revenue</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
