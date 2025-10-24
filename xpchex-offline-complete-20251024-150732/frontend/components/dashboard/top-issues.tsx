// Top Issues by Impact Score
"use client"
import { TopIssueItem } from '@/app/(dashboard)/dashboard/page'
import React from 'react'
import { TrendingUp, AlertCircle, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis, ResponsiveContainer } from "recharts"
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

// props
type TopIssuesByImpactScoreProps = {
    title: string
    subtitle: string
    sub_description: string
    description: string
    most_impactful_issues: TopIssueItem[]
}

const chartConfig = {
    impact_score: {
        label: "Impact Score",
        color: "#22c55e" // green-500
    }
} satisfies ChartConfig

// Custom label component to include icon
const CustomLabel = (props: any) => {
    const { x, y, width, value, index, data } = props;
    const Icon = data[index].icon;
    
    return (
        <g>
            <foreignObject x={x + 8} y={y + 4} width={20} height={20}>
                <div className="flex items-center justify-center">
                    <Icon className="w-4 h-4 text-white" />
                </div>
            </foreignObject>
            <text
                x={x + 32}
                y={y + 16}
                fill="white"
                fontSize={12}
                fontWeight="medium"
            >
                {value}
            </text>
        </g>
    );
};

// component
export function TopIssuesByImpactScore({ title, subtitle, sub_description, description, most_impactful_issues }: TopIssuesByImpactScoreProps) {
    // Calculate trend
    const trend = description.includes("up") ? "up" : "down";
    const trendValue = description.match(/\d+/)?.[0] || "0";
    const TrendIcon = trend === "up" ? ArrowUpRight : ArrowDownRight;
    const trendColor = trend === "up" ? "text-red-500" : "text-green-500";

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{subtitle}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <TrendIcon className={`w-4 h-4 ${trendColor}`} />
                    <span className={`text-sm font-medium ${trendColor}`}>
                        {trendValue}% {trend}
                    </span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Side - Top Issues Summary */}
                    <div className="w-full lg:w-1/3 space-y-4">
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium text-muted-foreground">Top Issues</h4>
                            {most_impactful_issues.slice(0, 3).map((issue, index) => (
                                <div key={issue.id} className="flex items-center gap-2">
                                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted">
                                        <span className="text-xs font-medium">{index + 1}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{issue.title}</p>
                                        <p className="text-xs text-muted-foreground">{issue.impact_score}% impact</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="pt-4 border-t">
                            <p className="text-sm text-muted-foreground">{sub_description}</p>
                        </div>
                    </div>

                    {/* Right Side - Bar Chart */}
                    <div className="w-full lg:w-2/3">
                        <ChartContainer config={chartConfig} className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart 
                                    data={most_impactful_issues}
                                    layout="vertical"
                                    margin={{
                                        left: 8,
                                        right: 8,
                                        top: 8,
                                        bottom: 8,
                                    }}
                                >
                                    <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                                    <XAxis 
                                        type="number" 
                                        tickLine={false} 
                                        axisLine={false}
                                        tickFormatter={(value) => `${value}%`}
                                    />
                                    <YAxis 
                                        type="category" 
                                        dataKey="title"
                                        tickLine={false} 
                                        axisLine={false}
                                        width={0} // Hide Y-axis labels
                                    />
                                    <Bar 
                                        dataKey="impact_score" 
                                        fill="#22c55e"
                                        radius={[0, 4, 4, 0]}
                                    >
                                        <LabelList 
                                            dataKey="title" 
                                            position="insideLeft" 
                                            offset={8}
                                            fill="white"
                                            fontSize={12}
                                            fontWeight="medium"
                                        />
                                        <LabelList 
                                            dataKey="impact_score" 
                                            position="right" 
                                            offset={8}
                                            formatter={(value: number) => `${value}%`}
                                            fill="#22c55e"
                                            fontSize={12}
                                            fontWeight="bold"
                                        />
                                    </Bar>
                                    <ChartTooltip
                                        content={({ active, payload, label }) => {
                                            if (!active || !payload?.length) return null;
                                            const data = payload[0].payload;
                                            const Icon = data.icon;
                                            
                                            return (
                                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <Icon className="w-4 h-4 text-amber-500" />
                                                            <span className="text-sm font-medium">
                                                                {label}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-sm text-muted-foreground">
                                                                Impact Score: {payload[0].value}%
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {data.description}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}