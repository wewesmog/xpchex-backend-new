"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StrategicBriefingProps {
  title: string
  timestamp: string
  brief: string
}

export function StrategicBriefing({ title, timestamp, brief }: StrategicBriefingProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-gray-500">{timestamp}</p>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{brief}</p>
      </CardContent>
    </Card>
  )
} 