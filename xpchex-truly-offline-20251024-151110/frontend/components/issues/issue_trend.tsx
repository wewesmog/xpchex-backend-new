"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

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

export const description = "A multiple line chart"

const chartConfig = {
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

interface IssueTrendProps {
  data?: {
    issue_period: { [key: string]: string }
    critical_count: { [key: string]: number }
    high_count: { [key: string]: number }
    medium_count: { [key: string]: number }
    low_count: { [key: string]: number }
  }
}

export default function IssueTrend({ data }: IssueTrendProps) {
  const chartData = React.useMemo(() => {
    if (!data || !data.issue_period) return []
    
    // Convert the object data to array format
    const periods = Object.keys(data.issue_period)
    const sortedPeriods = periods.map(key => ({
      key,
      date: new Date(data.issue_period[key]),
      dateStr: data.issue_period[key]
    })).sort((a, b) => a.date.getTime() - b.date.getTime())
    
    // Detect granularity based on data points
    const detectGranularity = () => {
      if (sortedPeriods.length < 2) return 'monthly'
      
      const first = sortedPeriods[0].date
      const second = sortedPeriods[1].date
      const diffDays = Math.abs((second.getTime() - first.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffDays <= 1) return 'daily'
      if (diffDays <= 7) return 'weekly' 
      if (diffDays <= 31) return 'monthly'
      return 'yearly'
    }
    
    const granularity = detectGranularity()
    
    // Format dates based on granularity
    const formatDate = (date: Date, granularity: string) => {
      switch (granularity) {
        case 'daily':
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        case 'weekly':
          return `Week of ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
        case 'monthly':
          return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
        case 'yearly':
          return date.getFullYear().toString()
        default:
          return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
      }
    }
    
    return sortedPeriods.map(({ key, date }) => ({
      period: formatDate(date, granularity),
      critical: data.critical_count[key] || 0,
      high: data.high_count[key] || 0,
      medium: data.medium_count[key] || 0,
      low: data.low_count[key] || 0,
      sortDate: date.getTime()
    }))
  }, [data])
  if (!data || !data.issue_period) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-red-600" />
            Issue Trends
          </CardTitle>
          <CardDescription>
            Trends of issues over time
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
          Issue Trends
        </CardTitle>
        <CardDescription>
          Trends of issues over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <LineChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                // Format the period for display
                if (typeof value === 'string') {
                  const date = new Date(value)
                  return date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })
                }
                return value
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="critical"
              type="monotone"
              stroke={chartConfig.critical.color}
              strokeWidth={2}
              dot={{
                fill: chartConfig.critical.color,
              }}
              activeDot={{
                r: 6,
              }}
            />
            <Line
              dataKey="high"
              type="monotone"
              stroke={chartConfig.high.color}
              strokeWidth={2}
              dot={{
                fill: chartConfig.high.color,
              }}
              activeDot={{
                r: 6,
              }}
            />
            <Line
              dataKey="medium"
              type="monotone"
              stroke={chartConfig.medium.color}
              strokeWidth={2}
              dot={{
                fill: chartConfig.medium.color,
              }}
              activeDot={{
                r: 6,
              }}
            />
            <Line
              dataKey="low"
              type="monotone"
              stroke={chartConfig.low.color}
              strokeWidth={2}
              dot={{
                fill: chartConfig.low.color,
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
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
