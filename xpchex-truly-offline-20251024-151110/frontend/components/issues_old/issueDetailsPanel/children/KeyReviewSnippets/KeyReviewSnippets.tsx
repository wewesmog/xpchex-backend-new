// KeyReviewSnippets: Shows the 2-3 most descriptive user reviews.

import React from 'react'
import ReviewSnippet from './children/ReviewSnippet'
import { IssueAnalysis } from '@/app/(dashboard)/issues/page'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type KeyReviewSnippetsProps = {
    keyReviews: IssueAnalysis["key_reviews"]
}

export default function KeyReviewSnippets({keyReviews}: KeyReviewSnippetsProps) {
    return (
        <div className=" p-4">
            <p className="text-muted-foreground text-xs pb-2">Sample {keyReviews.length} reviews</p>
            {/* <p>Key Reviews: {keyReviews[2]}</p> */}
            <div className="flex flex-col gap-4">
                {keyReviews.length === 0 ? (
                    <p>No reviews found</p>
                ) : (
                    keyReviews.map((reviewID) => {
                        return (
                            <ReviewSnippet  key={reviewID} reviewID={reviewID} />
                        )
                    })
                )}
            </div>
          
      
        </div>
    )
}