//Purpose: Displays the detailed analysis for the currently selected issue. This component will receive the selected issue's data as a prop.

import React from 'react'
// import AIRootCauseAnalysis from './children/AIRootCauseAnalysis'
// import { TrendImpactChart } from './children/TrendImpactChart'
// import RelatedTermsWordCloud from './children/RelatedTermsWordCloud'
import KeyReviewSnippets from './children/KeyReviewSnippets/KeyReviewSnippets'
import { IssueAnalysis } from '@/app/(dashboard)/issues/page'

interface IssueDetailsPanelProps {
    issueID: string
    issueData: IssueAnalysis | null
    onSelectReview: (reviewID: string) => void
}

export default function IssueDetailsPanel({issueID, issueData}: IssueDetailsPanelProps) {

    return (
        <div>
            {/* <h1>Issue Details Panel for Issue ID: {issueID}</h1> */}
         
           <div className="flex flex-col gap-4 p-4">
            <div className="flex flex-col gap-4 p-4">
            {/* <AIRootCauseAnalysis rootCause={issueData?.root_cause || null} /> */}
            {/* <TrendImpactChart trendData={issueData?.trend_data || []} title={issueData?.title || ""} rootCause={issueData?.root_cause || null} totalMentions={issueData?.total_mentions || 0} /> */}
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 w-full p-4">
            {/* <RelatedTermsWordCloud relatedTerms={issueData?.related_terms || []} /> */}     
            </div>
            <div className="flex flex-col gap-4 w-full">
            <KeyReviewSnippets keyReviews={issueData?.key_reviews || []} />   
            </div>
            </div>
            </div>
           
        </div>
    )
}