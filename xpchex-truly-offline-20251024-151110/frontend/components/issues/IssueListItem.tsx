// Purpose: Displays a single issue item in the list.

import React from 'react'
import { IssueAnalysis } from '@/app/(dashboard)/issues/page'
import { ArrowDownIcon, ArrowRightIcon, ArrowUpDownIcon, ArrowUpIcon } from 'lucide-react'

interface IssueListItemProps {
    issueNumber: number
    issueTitle: string
    issueID: string
    issueImpactScore: number
    issueTrend: "up" | "down" | "stable"
    onSelectIssue: (issueID: string) => void
    isSelected: boolean
}

export default function IssueListItem( {issueNumber, issueTitle, issueID, issueImpactScore, issueTrend, onSelectIssue, isSelected}: IssueListItemProps ) {
    const trendIcon = (trend: "up" | "down" | "stable") => {
        if (trend === "up") return <ArrowUpIcon strokeWidth={4} className="w-4 h-4 text-green-500" />
        if (trend === "down") return <ArrowDownIcon strokeWidth={4} className="w-4 h-4 text-red-500" />
        return <ArrowRightIcon strokeWidth={4} className="w-4 h-4 text-gray-500" />
    }
    return (
        <div className={`flex gap-2 items-center justify-between border border-gray-200 rounded-md shadow-md p-4 cursor-pointer hover:bg-gray-100 ${isSelected ? "bg-green-100" : ""}`} onClick={() => {onSelectIssue(issueID)}}>
            <div className="flex flex-col gap-2">
            <h1 className={`${isSelected ? "text-2xl font-bold" : "text-md font-medium"}`}>{issueNumber}. {issueTitle.slice(0, 40)}</h1>
            <p className="text-sm text-gray-500"> Impact Score: <span className="font-bold">{issueImpactScore} %</span></p>
            </div>
            <p className="text-sm text-gray-500">  {trendIcon(issueTrend)}</p>
        </div>
    )
}