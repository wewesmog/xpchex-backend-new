"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, ResponsiveContainer, Legend, ReferenceLine, Label } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type ReviewsOverTimeProps = {
  title: string
  description: string
  total_reviews: number
  positive_reviews: number
  negative_reviews: number
  neutral_reviews: number
  average_reviews: number
  change_in_reviews: number
  data: {
    week: number
    average: number
    positive: number
    negative: number
    neutral: number
    major_event?: {
      label: string
      description?: string
    }
  }[]
}

const chartConfig = {
  reviews: {
    label: "Reviews",
  },
  positive: {
    label: "Positive",
    color: "#22c55e", // green-500
  },
  negative: {
    label: "Negative",
    color: "#ef4444", // red-500
  },
  neutral: {
    label: "Neutral",
    color: "#6b7280", // gray-500
  },
  average: {
    label: "Average",
    color: "#3b82f6", // blue-500
  },
} satisfies ChartConfig

export function ReviewsOverTime({ 
  title, 
  description, 
  total_reviews, 
  positive_reviews, 
  negative_reviews, 
  neutral_reviews, 
  average_reviews, 
  change_in_reviews, 
  data
}: ReviewsOverTimeProps) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("positive")

  const total = (
    {
      reviews: total_reviews,
      positive: positive_reviews,
      negative: negative_reviews,
      neutral: neutral_reviews,
      average: average_reviews,
    }
  )

  return (
    <Card className="py-4 sm:py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {description}
          </CardDescription>
        </div>
        <div className="flex">
          {[ "positive", "negative", "neutral", "average"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="h-[250px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                left: 8,
                right: 8,
                top: 36,
                bottom: 8,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="week"
                tickLine={true}
                axisLine={false}
                tickMargin={4}
                minTickGap={32}
                tickFormatter={(value) => `Week ${value}`}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={4}
                width={40}
              />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  
                  const currentData = data.find(d => d.week === label);
                  const majorEvent = currentData?.major_event;
                  
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Week {label}
                          </span>
                          {payload.map((entry, index) => (
                            <span key={index} className="text-sm font-medium">
                              {chartConfig[entry.name as keyof typeof chartConfig]?.label}: {entry.value}
                            </span>
                          ))}
                          {majorEvent && (
                            <div className="mt-2 pt-2 border-t">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Major Event
                              </span>
                              <span className="text-sm font-medium text-amber-500">
                                {majorEvent.label}
                              </span>
                              {majorEvent.description && (
                                <span className="text-xs text-muted-foreground">
                                  {majorEvent.description}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
              {data.map((item, index) => {
                if (!item.major_event) return null;
                return (
                  <ReferenceLine
                    key={index}
                    x={item.week}
                    stroke="#f59e0b"
                    strokeDasharray="3 3"
                    label={
                      <Label
                        value={item.major_event.label}
                        position="top"
                        fill="#f59e0b"
                        fontSize={12}
                        fontWeight="bold"
                        offset={10}
                      />
                    }
                  />
                );
              })}
              <Line
                dataKey="positive"
                name="positive"
                type="monotone"
                stroke="#22c55e"
                strokeWidth={2}
                dot={true}
                activeDot={{ r: 4 }}
              />
              <Line
                dataKey="negative"
                name="negative"
                type="monotone"
                stroke="#ef4444"
                strokeWidth={2}
                dot={true}
                activeDot={{ r: 4 }}
              />
              <Line
                dataKey="neutral"
                name="neutral"
                type="monotone"
                stroke="#6b7280"
                strokeWidth={2}
                dot={true}
                activeDot={{ r: 4 }}
              />
              <Line
                dataKey="average"
                name="average"
                type="monotone"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={true}
                activeDot={{ r: 4 }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label || value}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
