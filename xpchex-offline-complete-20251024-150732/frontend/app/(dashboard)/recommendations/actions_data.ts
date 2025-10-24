// This is the data for the actions page

export type DateRange = {
    start: string
    end: string
}

export type Pagination = {
    total: number
    limit: number
    offset: number
    has_more: boolean
}

export type Action = {
    descr: string
    number_of_actions: number
    first_date_recommended: string
    latest_date_recommended: string
    action_type: string
    estimated_effort: string
    suggested_timeline: string
    category: string
}

export type ActionTrend = {
    action_period: string
    total_actions: number
    quick_wins: number
    q1_boundary: number
    q2_boundary: number
    q3_boundary: number
    quartile_breakdown: Array<{
        quartile: number
        count: number
    }>
    category_breakdown: Array<{
        category: string
        count: number
    }>
    action_type_breakdown: Array<{
        action_type: string
        count: number
    }>
    estimated_effort_breakdown: Array<{
        estimated_effort: string
        count: number
    }>
    suggested_timeline_breakdown: Array<{
        suggested_timeline: string
        count: number
    }>
}

export type GetActionsResponse = { 
    status: string
    time_range: string
    order_by: string
    date_range: DateRange
    pagination: Pagination
    data: Action[]
}

export type ActionsAnalysis = {
    status: string
    time_range: string
    granularity: string
    date_range: DateRange
    data: ActionTrend[]
}

export type AnalysisParams = {
    time_range: string
    estimated_effort?: string
    suggested_timeline?: string
}

export type ActionsParams = {
    time_range?: string
    order_by?: string
    estimated_effort?: string
    suggested_timeline?: string
    action_type?: string
    category?: string
    limit?: number
    offset?: number
}
const API_URL = 'http://localhost:8000'

// Utility functions for calculating priority metrics
export function calculatePriorityMetrics(analyticsData: ActionsAnalysis | null) {
    if (!analyticsData || !analyticsData.data || analyticsData.data.length === 0) {
        return {
            highPriority: 0,
            lowPriority: 0,
            totalActions: 0
        }
    }

    let highPriority = 0
    let lowPriority = 0
    let totalActions = 0

    // Sum across all periods
    analyticsData.data.forEach(period => {
        totalActions += period.total_actions || 0
        
        // Find quartile 4 (high priority) and quartile 1 (low priority) counts
        if (period.quartile_breakdown && Array.isArray(period.quartile_breakdown)) {
            period.quartile_breakdown.forEach(quartile => {
                if (quartile.quartile === 4) {
                    highPriority += quartile.count || 0
                } else if (quartile.quartile === 1) {
                    lowPriority += quartile.count || 0
                }
            })
        }
    })

    return {
        highPriority,
        lowPriority,
        totalActions
    }
}

// Utility function for calculating category metrics
export function calculateCategoryMetrics(analyticsData: ActionsAnalysis | null) {
    if (!analyticsData || !analyticsData.data || analyticsData.data.length === 0) {
        return []
    }

    const categoryTotals: { [key: string]: number } = {}

    // Sum across all periods
    analyticsData.data.forEach(period => {
        if (period.category_breakdown && Array.isArray(period.category_breakdown)) {
            period.category_breakdown.forEach(category => {
                const categoryName = category.category || 'Unknown'
                categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + (category.count || 0)
            })
        }
    })

    // Convert to array and sort by count (descending)
    return Object.entries(categoryTotals)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count)
}

// Utility function for calculating effort metrics
export function calculateEffortMetrics(analyticsData: ActionsAnalysis | null) {
    if (!analyticsData || !analyticsData.data || analyticsData.data.length === 0) {
        return []
    }

    const effortTotals: { [key: string]: number } = {}

    // Sum across all periods
    analyticsData.data.forEach(period => {
        if (period.estimated_effort_breakdown && Array.isArray(period.estimated_effort_breakdown)) {
            period.estimated_effort_breakdown.forEach(effort => {
                const effortName = effort.estimated_effort || 'Unknown'
                effortTotals[effortName] = (effortTotals[effortName] || 0) + (effort.count || 0)
            })
        }
    })

    // Convert to array and sort by count (descending)
    return Object.entries(effortTotals)
        .map(([effort, count]) => ({ effort, count }))
        .sort((a, b) => b.count - a.count)
}

// Utility function for calculating timeline metrics
export function calculateTimelineMetrics(analyticsData: ActionsAnalysis | null) {
    if (!analyticsData || !analyticsData.data || analyticsData.data.length === 0) {
        return []
    }

    const timelineTotals: { [key: string]: number } = {}

    // Sum across all periods
    analyticsData.data.forEach(period => {
        if (period.suggested_timeline_breakdown && Array.isArray(period.suggested_timeline_breakdown)) {
            period.suggested_timeline_breakdown.forEach(timeline => {
                const timelineName = timeline.suggested_timeline || 'Unknown'
                timelineTotals[timelineName] = (timelineTotals[timelineName] || 0) + (timeline.count || 0)
            })
        }
    })

    // Convert to array and sort by count (descending)
    return Object.entries(timelineTotals)
        .map(([timeline, count]) => ({ timeline, count }))
        .sort((a, b) => b.count - a.count)
}

// Get actions analytics data for charts and trends
export async function getActionsData(
    analysis_params: AnalysisParams): Promise<ActionsAnalysis> {
    const response = await fetch(`${API_URL}/actions/actions_analytics?` + new URLSearchParams({
        app_id: 'com.kcb.mobilebanking.android.mbp',
        time_range: analysis_params.time_range,
        ...(analysis_params.estimated_effort && { estimated_effort: analysis_params.estimated_effort }),
        ...(analysis_params.suggested_timeline && { suggested_timeline: analysis_params.suggested_timeline })
    }), {
        method: 'GET',
    })
    
    if (!response.ok) {
        throw new Error('Failed to fetch actions analytics data')
    }
    return response.json()
}

// Get actions list for tables and detailed views
export async function getActions(
    actions_params: ActionsParams): Promise<GetActionsResponse> {
    const response = await fetch(`${API_URL}/actions/list_actions?` + new URLSearchParams({
        app_id: 'com.kcb.mobilebanking.android.mbp',
        time_range: actions_params.time_range || 'last_30_days',
        order_by: actions_params.order_by || 'number_of_actions',
        limit: (actions_params.limit || 5).toString(),
        offset: (actions_params.offset || 0).toString(),
        ...(actions_params.estimated_effort && { estimated_effort: actions_params.estimated_effort }),
        ...(actions_params.suggested_timeline && { suggested_timeline: actions_params.suggested_timeline }),
        ...(actions_params.action_type && { action_type: actions_params.action_type }),
        ...(actions_params.category && { category: actions_params.category })
    }), {
        method: 'GET',
    })
    
    if (!response.ok) {
        throw new Error('Failed to fetch actions data')
    }
    return response.json()
}

// Separate API function for table data with pagination
export async function getActionsForTable(params: {
    limit?: number
    offset?: number
    time_range?: string
    order_by?: string
    estimated_effort?: string
    suggested_timeline?: string
    action_type?: string
    category?: string
}): Promise<GetActionsResponse> {
    const response = await fetch(`${API_URL}/actions/list_actions?` + new URLSearchParams({
        app_id: 'com.kcb.mobilebanking.android.mbp',
        time_range: params.time_range || 'last_6_months',
        order_by: params.order_by || 'number_of_actions',
        limit: (params.limit || 10).toString(),
        offset: (params.offset || 0).toString(),
        ...(params.estimated_effort && { estimated_effort: params.estimated_effort }),
        ...(params.suggested_timeline && { suggested_timeline: params.suggested_timeline }),
        ...(params.action_type && { action_type: params.action_type }),
        ...(params.category && { category: params.category })
    }), {
        method: 'GET',
    })
    
    if (!response.ok) {
        throw new Error('Failed to fetch table actions data')
    }
    return response.json()
}