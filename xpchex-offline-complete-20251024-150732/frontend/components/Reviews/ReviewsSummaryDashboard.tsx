// WayForwardSummaryDashboard.tsx
// Displays the AI executive summary and key metrics (total recs, priority breakdown)

import React from 'react'
import { ReviewsSummary } from '@/app/stores/reviews'
import {
    Card,
    CardContent, 
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

// Recsummary props
type ReviewsSummaryProps = {
    reviewsSummary: ReviewsSummary
}

export default function ReviewsSummaryDashboard({ reviewsSummary }: ReviewsSummaryProps) {
    return (
        <div className="flex flex-col gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>{reviewsSummary.review_ai_summary}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-row gap-2 flex-wrap">
                    <p>Total Reviews: {reviewsSummary.total_reviews}</p>
                    <p>Total Positive Reviews: {reviewsSummary.total_positive_reviews}</p>
                    <p>Total Negative Reviews: {reviewsSummary.total_negative_reviews}</p>
                    <p>Total Neutral Reviews: {reviewsSummary.total_neutral_reviews}</p>
                    <p>Total Positive Reviews Percentage: {reviewsSummary.total_positive_reviews_percentage}</p>
                    <p>Total Negative Reviews Percentage: {reviewsSummary.total_negative_reviews_percentage}</p>
                    <p>Total Neutral Reviews Percentage: {reviewsSummary.total_neutral_reviews_percentage}</p>
                </CardContent>
            </Card>
        </div>
    )
}