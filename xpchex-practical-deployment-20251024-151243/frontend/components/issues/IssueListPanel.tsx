// Purpose: Displays the prioritized list of issues.

import React from 'react'

import IssueListItem from './IssueListItem'
import { IssueAnalysis } from '@/app/(dashboard)/issues/page'

// Define the props interface
interface IssueListPanelProps {
    issues: IssueAnalysis[]
    selectedIssue: string | null
    onSelectIssue: (issueID: string) => void
   
}

export default function IssueListPanel( {issues, onSelectIssue, selectedIssue}: IssueListPanelProps ) {
    // const isSelected = (issueID: string) => {
    //     // return issueID === selectedIssue?.id
    // }
    return (
        <div className="border border-gray-200 rounded-md p-4 h-full flex flex-col gap-12 overflow-y-auto">
            <h1 className="text-2xl font-bold">Top 10 Issues</h1>
            {/* <p> Selected Issue: {selectedIssue}</p> */}
            
            {issues.map((issue, index) => (
                <IssueListItem
                    issueNumber={index + 1}
                    key={issue.id}
                    issueTitle={issue.title}
                    issueID={issue.id}
                    issueImpactScore={issue.impact_score}
                    issueTrend={issue.trend}
                    onSelectIssue={onSelectIssue}
                    isSelected={selectedIssue === issue.id}
                />
            ))}
        </div>
    )
}
