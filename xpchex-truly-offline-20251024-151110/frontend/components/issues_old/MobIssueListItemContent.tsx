// components/MobIssueListItemContent.tsx

import React from 'react';
import { IssueAnalysis } from '@/app/(dashboard)/issues/page';
// import { TrendImpactChart } from './issueDetailsPanel/children/TrendImpactChart'
// import RelatedTermsWordCloud from './issueDetailsPanel/children/RelatedTermsWordCloud'
import KeyReviewSnippets from './issueDetailsPanel/children/KeyReviewSnippets/KeyReviewSnippets'



interface MobIssueListItemContentProps {
    issue: IssueAnalysis; // Receive the full issue object
}

export default function MobIssueListItemContent({ issue }: MobIssueListItemContentProps) {
    return (
        <div className="flex flex-col gap-4 py-4 px-4 text-gray-700 bg-white">
            {/* Dummy Content - This is where your actual detailed analysis components will go */}
            <p className="mb-2 font-medium">
                **Detailed Analysis for "{issue.title}" (ID: {issue.id})**
            </p> 
            {/* <TrendImpactChart trendData={issue.trend_data || []} title={issue.title || ""} rootCause={issue.root_cause || null} totalMentions={issue.total_mentions || 0} />   
            <RelatedTermsWordCloud relatedTerms={issue.related_terms || []} /> */}
            <KeyReviewSnippets keyReviews={issue.key_reviews || []} />
        </div>
    );
    
}