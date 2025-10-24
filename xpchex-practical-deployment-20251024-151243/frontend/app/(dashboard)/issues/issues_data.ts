// This is the data for the issues page

import { Type } from "lucide-react"

export type IssueSummary = {
    total_issues: number
    critical_issues: number
    high_issues: number
    medium_issues: number
    low_issues: number
}

export type IssueTrend = {
    issue_period: string
    total_issues: number
    critical_count: number  // Changed from critical_issues
    high_count: number      // Changed from high_issues  
    medium_count: number    // Changed from medium_issues
    low_count: number       // Changed from low_issues
    bug_count: number
}

export type dateRange = {
    start: string
    end: string
}

export type Pagination = {
    total: number
    limit: number
    offset: number
    has_more: boolean

}

export type Issue = {
    count: number
    desc: string
    issue_type: string
    severity: string
    category: string
    snippets: string[]
    keywords: string[]
}

export type GetIssuesResponse = { 
    status: string
    time_range: string
    order_by: string
    granularity: string
    pagination: Pagination
    date_range: dateRange
    data: Issue[]
}

export type issuesAnalysis = {
    status: string
    time_range: string
    granularity: string
    date_range: dateRange
    data: IssueTrend[]
}

export type analysis_params = {
    time_range: string,
    severity?:string,
    category?:string,
}

export type issues_params = {
    time_range?: string,
    order_by?: string,
    severity?:string,
    category?:string,
    limit?: number,
    offset?: number,
}
const summary = "test summary"
// const API_URL = process.env.NEXT_PUBLIC_API_URL

const API_URL = 'http://localhost:8000'

// Fix the API functions in your issues_data.ts
export async function getIssuesData(
    analysis_params: analysis_params): Promise<issuesAnalysis> {
    const response = await fetch(`${API_URL}/issues/issues_analytics?` + new URLSearchParams({
        app_id: 'com.kcb.mobilebanking.android.mbp',
        time_range: analysis_params.time_range,
        ...(analysis_params.severity && { severity: analysis_params.severity }),
        ...(analysis_params.category && { category: analysis_params.category })
    }), {
        method: 'GET',
    })
    console.log(response)
    if (!response.ok) {
        throw new Error('Failed to fetch issues data')
    }
    return response.json()
}

export async function getIssues(
    issues_params: issues_params): Promise<GetIssuesResponse> {
    const response = await fetch(`${API_URL}/issues/list?` + new URLSearchParams({
        app_id: 'com.kcb.mobilebanking.android.mbp',
        time_range: issues_params.time_range || 'last_90_days',
        order_by: issues_params.order_by || 'count',
        limit: (issues_params.limit || 5).toString(),
        offset: (issues_params.offset || 0).toString(),
        ...(issues_params.severity && { severity: issues_params.severity }),
        ...(issues_params.category && { category: issues_params.category })
    }), {
        method: 'GET',
    })
    console.log(response)
    if (!response.ok) {
        throw new Error('Failed to fetch issues data')
    }
    console.log(response)
    return response.json()
}

// Separate API function for table data with pagination
export async function getIssuesForTable(params: {
    limit?: number
    offset?: number
    time_range?: string
    order_by?: string
    severity?: string
    category?: string
}): Promise<GetIssuesResponse> {
    const response = await fetch(`${API_URL}/issues/list?` + new URLSearchParams({
        app_id: 'com.kcb.mobilebanking.android.mbp',
        time_range: params.time_range || 'last_6_months',
        order_by: params.order_by || 'count',
        limit: (params.limit || 10).toString(),
        offset: (params.offset || 0).toString(),
        ...(params.severity && { severity: params.severity }),
        ...(params.category && { category: params.category })
    }), {
        method: 'GET',
    })
    
    if (!response.ok) {
        throw new Error('Failed to fetch table issues data')
    }
    return response.json()
}