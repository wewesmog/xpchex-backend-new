"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Segment } from '@/app/(dashboard)/sentiments/sentiments_data'

interface EmotionsWordCloudProps {
  segments?: Segment[]
  loading?: boolean
}

export default function EmotionsWordCloud({ segments = [], loading = false }: EmotionsWordCloudProps) {

  // Transform segments data for word cloud
  const wordCloudData = React.useMemo(() => {
    if (!segments || segments.length === 0) {
      return []
    }
    
    // Common filler/stop words to remove
    const stopWords = new Set([
      'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among', 'under', 'over', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'a', 'an', 'the', 'some', 'any', 'all', 'both', 'each', 'every', 'other', 'another', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'now', 'then', 'here', 'there', 'when', 'where', 'why', 'how', 'what', 'who', 'which', 'whom', 'whose', 'if', 'because', 'as', 'until', 'while', 'dont', 'doesnt', 'cant', 'wont', 'shouldnt', 'wouldnt', 'couldnt', 'havent', 'hasnt', 'hadnt', 'didnt', 'isnt', 'arent', 'wasnt', 'werent'
    ])

    // Extract all words from segment texts
    const wordCounts: { [key: string]: number } = {}
    
    segments.forEach(segment => {
      const text = segment.text
      if (text && typeof text === 'string') {
        // Split text into words, remove punctuation, and filter out short words and stop words
        const words = text
          .toLowerCase()
          .replace(/[^\w\s]/g, '') // Remove punctuation
          .split(/\s+/)
          .filter(word => 
            word.length > 2 && // Only words longer than 2 characters
            !stopWords.has(word) && // Remove stop words
            !/^\d+$/.test(word) // Remove pure numbers
          )
        
        words.forEach(word => {
          if (wordCounts[word]) {
            wordCounts[word] += 1
          } else {
            wordCounts[word] = 1
          }
        })
      }
    })
    
    // Convert to word cloud format: [{ text: string, value: number }]
    const result = Object.entries(wordCounts)
      .map(([text, value]) => ({ text, value }))
      .filter(item => item.value > 0) // Only include words that appear
      .sort((a, b) => b.value - a.value) // Sort by frequency
      .slice(0, 50) // Limit to top 50 words
    
    return result
  }, [segments])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Review Text Word Cloud</CardTitle>
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

  if (wordCloudData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Review Text Word Cloud</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500">
            No emotion data available
          </div>
        </CardContent>
      </Card>
    )
  }

  // Color palette for emotions
  const colors = [
    '#ef4444', // red-500
    '#f97316', // orange-500
    '#eab308', // yellow-600
    '#22c55e', // green-500
    '#3b82f6', // blue-500
    '#8b5cf6', // violet-500
    '#ec4899', // pink-500
    '#6b7280', // gray-500
    '#14b8a6', // teal-500
    '#f59e0b', // amber-500
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Text Word Cloud</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full relative overflow-hidden">
          {wordCloudData.length > 0 ? (
            <div className="word-cloud-container relative h-full w-full">
              {wordCloudData.map((word, index) => {
                // Calculate size based on frequency with better scaling
                const minSize = 14
                const maxSize = 48
                const maxValue = Math.max(...wordCloudData.map(w => w.value))
                const minValue = Math.min(...wordCloudData.map(w => w.value))
                
                // Use logarithmic scaling for better size distribution
                const normalizedValue = maxValue > minValue 
                  ? (Math.log(word.value) - Math.log(minValue)) / (Math.log(maxValue) - Math.log(minValue))
                  : 0
                const fontSize = minSize + (maxSize - minSize) * normalizedValue

                // Random position for cloud effect
                const top = Math.random() * 80 + 10 // 10% to 90%
                const left = Math.random() * 80 + 10
                const color = colors[index % colors.length]
                const rotation = Math.random() * 60 - 30 // -30 to 30 degrees

                return (
                  <span
                    key={`${word.text}-${index}`}
                    className="absolute inline-block font-medium hover:scale-110 cursor-pointer transition-transform duration-200"
                    style={{
                      fontSize: `${fontSize}px`,
                      left: `${left}%`,
                      top: `${top}%`,
                      color: color,
                      transform: `rotate(${rotation}deg)`,
                    }}
                    title={`${word.text}: ${word.value.toFixed(2)}`}
                  >
                    {word.text}
                  </span>
                )
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No emotion data available for visualization
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
