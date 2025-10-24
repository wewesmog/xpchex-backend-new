"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A donut chart with text"

const chartConfig = {
  count: {
    label: "Issues",
  },
  critical: {
    label: "Critical",
    color: "#dc2626", // red-600
  },
  high: {
    label: "High", 
    color: "#ea580c", // orange-600
  },
  medium: {
    label: "Medium",
    color: "#ca8a04", // yellow-600
  },
  low: {
    label: "Low",
    color: "#16a34a", // green-600
  },
} satisfies ChartConfig

interface IssueSeverityProps {
  data?: {
    critical_count: number
    high_count: number
    medium_count: number
    low_count: number
  }
}

export default function IssueSeverity({ data }: IssueSeverityProps) {
  const chartData = React.useMemo(() => {
    if (!data) return []
    
    return [
      { severity: "critical", count: data.critical_count, fill: "var(--color-critical)" },
      { severity: "high", count: data.high_count, fill: "var(--color-high)" },
      { severity: "medium", count: data.medium_count, fill: "var(--color-medium)" },
      { severity: "low", count: data.low_count, fill: "var(--color-low)" },
    ].filter(item => item.count > 0) // Only show severities with data
  }, [data])

  const totalIssues = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0)
  }, [chartData])

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-red-600" />
            Issue Severity
          </CardTitle>
          <CardDescription>
            Distribution of issues by severity level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-red-600" />
          Issue Severity
        </CardTitle>
        <CardDescription>
          Distribution of issues by severity level
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="severity"
              innerRadius={60}
              strokeWidth={5}
            >
              {chartData.map((entry, index) => (
                <Label
                  key={`cell-${index}`}
                  content={entry.count}
                  className="text-sm font-medium"
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 pt-4">
        <div className="grid grid-cols-4 gap-4 w-full">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-600"></div>
            <span className="text-sm text-muted-foreground">Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-600"></div>
            <span className="text-sm text-muted-foreground">High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
            <span className="text-sm text-muted-foreground">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-600"></div>
            <span className="text-sm text-muted-foreground">Low</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
