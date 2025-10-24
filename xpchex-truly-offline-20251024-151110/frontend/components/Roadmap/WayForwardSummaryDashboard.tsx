// WayForwardSummaryDashboard.tsx
// Displays the AI executive summary and key metrics (total recs, priority breakdown)

import React from 'react'
import { RecSummary } from '@/app/(dashboard)/roadmap/data'
import {
    Card,
    CardContent, 
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

// Recsummary props
type RecSummaryProps = {
    recSummary: RecSummary
}

export default function WayForwardSummaryDashboard({ recSummary }: RecSummaryProps) {
    return (
        <div className="flex flex-col gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>{recSummary.summary}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-row gap-2 flex-wrap">
                    <p>Total Recommendations: {recSummary.count}</p>
                    <p>High Priority: {recSummary.highPriorityCount}</p>
                    <p>Medium Priority: {recSummary.mediumPriorityCount}</p>
                    <p>Low Priority: {recSummary.lowPriorityCount}</p>
                    <p>High Effort: {recSummary.highEffortCount}</p>
                    <p>Medium Effort: {recSummary.mediumEffortCount}</p>
                    <p>Low Effort: {recSummary.lowEffortCount}</p>
                </CardContent>
            </Card>
        </div>
    )
}