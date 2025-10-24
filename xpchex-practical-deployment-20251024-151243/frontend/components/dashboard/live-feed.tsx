"use client"

// component to show the live feed

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface LiveFeedItem {
  id: string
  title: string
  description: string
  type: 'new' | 'up' | 'down' | 'neutral' | 'info' | 'warning'
  icon: LucideIcon
}

interface LiveFeedProps {
  title: string
  items: LiveFeedItem[]
}

export function LiveFeedCard({ title, items }: LiveFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <span className="text-sm flex items-center">
                
                <item.icon className="w-4 h-4" />
                
              </span>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}