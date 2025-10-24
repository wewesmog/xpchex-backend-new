"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface CategoryData {
  category: string
  count: number
}

interface ProcessedCategoryData extends CategoryData {
  others?: string[]
}

interface CategoryBarChartProps {
  data: CategoryData[]
}

const chartConfig = {
  count: {
    label: "Actions",
  },
}

// Color palette for categories
const CATEGORY_COLORS = [
  "#dc2626", // red-600
  "#ea580c", // orange-600
  "#ca8a04", // yellow-600
  "#16a34a", // green-600
  "#2563eb", // blue-600
  "#7c3aed", // violet-600
  "#db2777", // pink-600
  "#0891b2", // cyan-600
  "#65a30d", // lime-600
  "#dc2626", // red-600
]

const getColorForCategory = (index: number) => {
  return CATEGORY_COLORS[index % CATEGORY_COLORS.length]
}

export function CategoryBarChart({ data }: CategoryBarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No category data available
      </div>
    )
  }

  // Process data to show top 10 categories and group others
  const processData = (data: CategoryData[]): ProcessedCategoryData[] => {
    if (data.length <= 10) {
      return data
    }

    // Sort by count descending
    const sortedData = [...data].sort((a, b) => b.count - a.count)
    
    // Take top 10
    const top10 = sortedData.slice(0, 10)
    
    // Group remaining categories
    const others = sortedData.slice(10)
    const othersCount = others.reduce((sum, item) => sum + item.count, 0)
    const othersCategories = others.map(item => item.category)
    
    // Add "Others" bar if there are remaining categories
    if (othersCount > 0) {
      return [
        ...top10,
        {
          category: "Others",
          count: othersCount,
          others: othersCategories
        }
      ]
    }
    
    return top10
  }

  const processedData = processData(data)

  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Actions by Category</h3>
        <p className="text-sm text-gray-600 mt-1">
          Distribution of actions across different categories
        </p>
      </div>
      
      <ChartContainer config={chartConfig} className="h-80 w-full">
        <BarChart
          data={processedData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#e5e7eb" 
            strokeOpacity={0.5}
            vertical={false}
          />
          <XAxis 
            dataKey="category" 
            tick={{ 
              fontSize: 11, 
              fontWeight: 500,
              fill: '#374151',
              textAnchor: 'end'
            }}
            angle={-45}
            textAnchor="end"
            height={100}
            interval={0}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            tick={{ 
              fontSize: 12, 
              fontWeight: 500,
              fill: '#6b7280'
            }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload as ProcessedCategoryData
                return (
                  <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-w-xs">
                    <p className="font-semibold text-gray-900 capitalize">{label}</p>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">{payload[0].value}</span> actions
                    </p>
                    {data.others && data.others.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="text-xs font-medium text-gray-700 mb-1">Includes:</p>
                        <div className="max-h-32 overflow-y-auto">
                          <ul className="text-xs text-gray-600 space-y-1">
                            {data.others.map((category, index) => (
                              <li key={index} className="capitalize">• {category}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                )
              }
              return null
            }}
          />
          <Bar 
            dataKey="count" 
            radius={[4, 4, 0, 0]}
          >
            {processedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColorForCategory(index)} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  )
}
