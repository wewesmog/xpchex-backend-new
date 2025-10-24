// This is the data for the positives page

export type PositiveSummary = {
    sum_total_positives: number
    sum_high_impact_count: number
    sum_mid_impact_count: number
    sum_low_impact_count: number
}

export type PositiveTrend = {
    period: string
    total_positives: number
    high_impact_count: number
    mid_impact_count: number
    low_impact_count: number
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

export type Positive = {
    desc: string
    category: string
    quote: string[]
    keywords: string[]
    impact_area: string
    impact_level: string
    total_reviews: number
}

export type GetPositivesResponse = { 
    status: string
    time_range: string
    order_by: string
    pagination: Pagination
    date_range: dateRange
    data: Positive[]
}

export type positivesAnalysis = {
    status: string
    time_range: string
    granularity: string
    date_range: dateRange
    data: {
        period: { [key: string]: string }
        total_positives: { [key: string]: number }
        high_impact_count: { [key: string]: number }
        mid_impact_count: { [key: string]: number }
        low_impact_count: { [key: string]: number }
    }
}

export type positives_analysis_request_params = {
    time_range: string,
    impact_level?: string,
    category?: string,
    impact_area?: string
}

export type positives_list_request_params = {
    time_range?: string,
    order_by?: string,
    impact_level?: string,
    category?: string,
    impact_area?: string
    limit?: number,
    offset?: number,
}

const API_URL = 'http://localhost:8000'

// Fix the API functions to use the correct positives endpoints
export async function getPositivesData(
    analysis_params: positives_analysis_request_params): Promise<positivesAnalysis> {
    const response = await fetch(`${API_URL}/positives/positives_analytics?` + new URLSearchParams({
        app_id: 'com.kcb.mobilebanking.android.mbp',
        time_range: analysis_params.time_range,
        ...(analysis_params.impact_level && { impact_level: analysis_params.impact_level }),
        ...(analysis_params.category && { category: analysis_params.category }),
        ...(analysis_params.impact_area && { impact_area: analysis_params.impact_area })
    }), {
        method: 'GET',
    })
    console.log(response)
    if (!response.ok) {
        throw new Error('Failed to fetch positives data')
    }
    return response.json()
}

export async function getPositives(
    positives_params: positives_list_request_params): Promise<GetPositivesResponse> {
    const response = await fetch(`${API_URL}/positives/list?` + new URLSearchParams({
        app_id: 'com.kcb.mobilebanking.android.mbp',
        time_range: positives_params.time_range || 'last_90_days',
        order_by: positives_params.order_by || 'total_reviews',
        limit: (positives_params.limit || 5).toString(),
        offset: (positives_params.offset || 0).toString(),
        ...(positives_params.impact_level && { impact_level: positives_params.impact_level }),
        ...(positives_params.category && { category: positives_params.category }),
        ...(positives_params.impact_area && { impact_area: positives_params.impact_area })
    }), {
        method: 'GET',
    })
    console.log(response)
    if (!response.ok) {
        throw new Error('Failed to fetch positives data')
    }
    console.log(response)
    return response.json()
}

// Separate API function for table data with pagination
export async function getPositivesForTable(params: {
    limit?: number
    offset?: number
    time_range?: string
    order_by?: string
    impact_level?: string
    category?: string
    impact_area?: string
}): Promise<GetPositivesResponse> {
    const response = await fetch(`${API_URL}/positives/list?` + new URLSearchParams({
        app_id: 'com.kcb.mobilebanking.android.mbp',
        time_range: params.time_range || 'last_6_months',
        order_by: params.order_by || 'total_reviews',
        limit: (params.limit || 10).toString(),
        offset: (params.offset || 0).toString(),
        ...(params.impact_level && { impact_level: params.impact_level }),
        ...(params.impact_area && { impact_area: params.impact_area }),
        ...(params.category && { category: params.category })
    }), {
        method: 'GET',
    })
    
    if (!response.ok) {
        throw new Error('Failed to fetch table positives data')
    }
    return response.json()
}