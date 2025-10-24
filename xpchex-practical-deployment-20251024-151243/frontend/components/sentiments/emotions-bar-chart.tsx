"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { EmotionRecord } from '@/app/(dashboard)/sentiments/sentiments_data'

interface EmotionsBarChartProps {
  emotions?: EmotionRecord[]
  loading?: boolean
}

export default function EmotionsBarChart({ emotions = [], loading = false }: EmotionsBarChartProps) {
  // Process emotions data for bar chart
  const chartData = React.useMemo(() => {
    if (!emotions || emotions.length === 0) {
      return []
    }

    // Group emotions by name and sum their scores
    const emotionCounts: { [key: string]: number } = {}
    
    emotions.forEach(emotion => {
      const emotionName = emotion.emotion
      const score = emotion.emotion_score || 0
      
      if (emotionName && typeof emotionName === 'string') {
        if (emotionCounts[emotionName]) {
          emotionCounts[emotionName] += score
        } else {
          emotionCounts[emotionName] = score
        }
      }
    })

    // Convert to array and sort by frequency
    const sortedEmotions = Object.entries(emotionCounts)
      .map(([emotion, count]) => ({ emotion, count }))
      .sort((a, b) => b.count - a.count)

    // Take top 10 and group the rest as "Others"
    const top10 = sortedEmotions.slice(0, 10)
    const others = sortedEmotions.slice(10)
    const othersCount = others.reduce((sum, item) => sum + item.count, 0)

    // Create chart data
    const chartDataRaw = top10.map(item => ({
      emotion: item.emotion,
      count: item.count
    }))

    // Add "Others" if there are any
    if (othersCount > 0) {
      chartDataRaw.push({
        emotion: "Others",
        count: othersCount
      })
    }

    // Keep raw counts; scaling handled by Y-axis domain
    return chartDataRaw.filter(d => d.count > 0)
  }, [emotions])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Emotions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Emotions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No emotion data available
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Emotions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 50,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="emotion" 
                angle={-45}
                textAnchor="end"
                height={70}
                interval={0}
                fontSize={12}
              />
              <YAxis 
                domain={[0, 'dataMax + 5']} 
                allowDecimals={false}
              />
              <Bar 
                dataKey="count" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                barSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
