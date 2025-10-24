// This is the data for the sentiments page

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

export type Review = {
    app_id?: string
    review_id: string
    username?: string // mapped from backend 'Reviewer'
    user_image?: string
    review_text: string
    rating: number
    sentiment: string | null
    thumbs_up_count: number
    reply_content?: string // mapped from backend 'Reply'
    reply_created_at?: string // mapped from backend 'Reply_Date'
    review_created_at: string
    recommended_response_text?: string
    all_emotion_scores?: { [key: string]: number }
}

export type SentimentTrend = {
    sentiment_period: string
    total_reviews: number
    total_thumbs_up: number
    total_thumbs_down: number
    average_rating: number
    // Rating-based NPS
    promoters: number
    detractors: number
    nps_total: number
    nps_score: number
    // Sentiment-based NPS
    sentiment_promoters: number
    sentiment_detractors: number
    sentiment_neutrals: number
    sentiment_nps_score: number
    sentiment_breakdown: Array<{
        sentiment: string
        count: number
    }>
    rating_breakdown: Array<{
        rating: number
        count: number
    }>
    emotion_breakdown: Array<{
        emotion: string
        count: number
    }>
}

export type GetReviewsResponse = { 
    status: string
    time_range: string
    order_by: string
    date_range: DateRange
    pagination: Pagination
    data: Review[]
}

// New: Segments and Emotions endpoints
export type Segment = {
    text: string
    segment_sentiment_label: string | null
    segment_sentiment_score: number | null
    review_id: string
    review_created_at: string
    username: string
    user_image?: string
}

export type EmotionRecord = {
    review_id: string
    review_created_at: string
    overall_sentiment: string | null
    emotion: string
    emotion_score: number
}

export type SentimentsAnalysis = {
    status: string
    time_range: string
    granularity: string
    date_range: DateRange
    data: SentimentTrend[]
}

export type AnalysisParams = {
    time_range: string
    sentiment?: string
    rating?: string
}

export type ReviewsParams = {
    time_range?: string
    order_by?: string
    sentiment?: string
    rating?: string
    limit?: number
    offset?: number
}

const API_URL = 'http://localhost:8000'

// Utility functions for calculating sentiment metrics
export function calculateSentimentMetrics(analyticsData: SentimentsAnalysis | null) {
    if (!analyticsData || !analyticsData.data || analyticsData.data.length === 0) {
        return {
            totalReviews: 0,
            positiveReviews: 0,
            negativeReviews: 0,
            neutralReviews: 0,
            averageNPS: 0,
            averageSentimentNPS: 0
        }
    }

    let totalReviews = 0
    let positiveReviews = 0
    let negativeReviews = 0
    let neutralReviews = 0
    let totalNPS = 0
    let npsCount = 0
    let totalSentimentNPS = 0
    let sentimentNpsCount = 0

    // Sum across all periods
    analyticsData.data.forEach(period => {
        totalReviews += period.total_reviews || 0
        
        // Find sentiment counts
        if (period.sentiment_breakdown && Array.isArray(period.sentiment_breakdown)) {
            period.sentiment_breakdown.forEach(sentiment => {
                const sentimentType = sentiment.sentiment || 'unknown'
                const count = sentiment.count || 0
                
                if (sentimentType === 'positive') {
                    positiveReviews += count
                } else if (sentimentType === 'negative') {
                    negativeReviews += count
                } else if (sentimentType === 'neutral') {
                    neutralReviews += count
                }
            })
        }
        
        // Calculate average NPS (rating-based)
        if (period.nps_score !== undefined && period.nps_score !== null) {
            totalNPS += period.nps_score
            npsCount++
        }
        
        // Calculate average NPS (sentiment-based)
        if (period.sentiment_nps_score !== undefined && period.sentiment_nps_score !== null) {
            totalSentimentNPS += period.sentiment_nps_score
            sentimentNpsCount++
        }
    })

    return {
        totalReviews,
        positiveReviews,
        negativeReviews,
        neutralReviews,
        averageNPS: npsCount > 0 ? Math.round((totalNPS / npsCount) * 10) / 10 : 0,
        averageSentimentNPS: sentimentNpsCount > 0 ? Math.round((totalSentimentNPS / sentimentNpsCount) * 10) / 10 : 0
    }
}

// Utility function to calculate NPS from sentiment data
export function calculateNPSFromSentiment(positive: number, negative: number, neutral: number): number {
    const total = positive + negative + neutral
    if (total === 0) return 0
    
    // NPS = (Total Positives - Total Negatives) / Total * 100
    // Using raw counts from segments to calculate percentage
    return Math.round(((positive - negative) / total) * 100)
}

// Utility function for calculating emotion distribution
export function calculateEmotionMetrics(analyticsData: SentimentsAnalysis | null) {
    if (!analyticsData || !analyticsData.data || analyticsData.data.length === 0) {
        return []
    }

    const emotionTotals: { [key: string]: number } = {}

    // Sum across all periods
    analyticsData.data.forEach(period => {
        if (period.emotion_breakdown && Array.isArray(period.emotion_breakdown)) {
            period.emotion_breakdown.forEach(emotion => {
                const emotionName = emotion.emotion || 'unknown'
                emotionTotals[emotionName] = (emotionTotals[emotionName] || 0) + (emotion.count || 0)
            })
        }
    })

    return Object.entries(emotionTotals)
        .map(([emotion, count]) => ({ emotion, count }))
        .sort((a, b) => b.count - a.count)
}

// Utility function for calculating rating distribution
export function calculateRatingMetrics(analyticsData: SentimentsAnalysis | null) {
    if (!analyticsData || !analyticsData.data || analyticsData.data.length === 0) {
        return []
    }

    const ratingTotals: { [key: number]: number } = {}

    // Sum across all periods
    analyticsData.data.forEach(period => {
        if (period.rating_breakdown && Array.isArray(period.rating_breakdown)) {
            period.rating_breakdown.forEach(rating => {
                const ratingValue = rating.rating || 0
                ratingTotals[ratingValue] = (ratingTotals[ratingValue] || 0) + (rating.count || 0)
            })
        }
    })

    // Convert to array and sort by rating (ascending)
    return Object.entries(ratingTotals)
        .map(([rating, count]) => ({ rating: parseInt(rating), count }))
        .sort((a, b) => a.rating - b.rating)
}
// Get segments data
export async function getSegmentsData(params: { time_range?: string }): Promise<{ status: string, time_range: string, date_range: DateRange, data: Segment[] }>{
    const apiParams = {
        app_id: 'com.kcb.mobilebanking.android.mbp',
        time_range: params.time_range || 'this_year',
    }
    const res = await fetch(`${API_URL}/sentiments/list_segments?` + new URLSearchParams(apiParams), { method: 'GET' })
    if (!res.ok) throw new Error('Failed to fetch segments data')
    const json = await res.json()
    const data: Segment[] = Array.isArray(json.data) ? json.data : []
    return { ...json, data }

}

export async function getAllSegmentsData(params: { time_range?: string }): Promise<{ status: string, time_range: string, date_range: DateRange, data: Segment[] }>{
    const apiParams = {
        app_id: 'com.kcb.mobilebanking.android.mbp',
        time_range: params.time_range || 'this_year',
    }
    const res = await fetch(`${API_URL}/sentiments/list_all_segments?` + new URLSearchParams(apiParams), { method: 'GET' })
    if (!res.ok) throw new Error('Failed to fetch all segments data')
    const json = await res.json()
    const data: Segment[] = Array.isArray(json.data) ? json.data : []
    return { ...json, data }
}
// Get sentiments analytics data for charts and trends
export async function getSentimentsData(
    analysis_params: AnalysisParams): Promise<SentimentsAnalysis> {
    const response = await fetch(`${API_URL}/sentiments/sentiments_analytics?` + new URLSearchParams({
        app_id: 'com.kcb.mobilebanking.android.mbp',
        time_range: analysis_params.time_range,
        ...(analysis_params.sentiment && { sentiment: analysis_params.sentiment }),
        ...(analysis_params.rating && { rating: analysis_params.rating })
    }), {
        method: 'GET',
    })
    
    if (!response.ok) {
        throw new Error('Failed to fetch sentiments analytics data')
    }
    return response.json()
}

// Get reviews list for tables and detailed views
export async function getReviews(
    reviews_params: ReviewsParams): Promise<GetReviewsResponse> {
    const params = {
        app_id: 'com.kcb.mobilebanking.android.mbp',
        time_range: reviews_params.time_range || 'last_30_days',
        order_by: reviews_params.order_by || 'thumbs_up_count',
        limit: (reviews_params.limit || 5).toString(),
        offset: (reviews_params.offset || 0).toString(),
        ...(reviews_params.sentiment && { sentiment: reviews_params.sentiment }),
        ...(reviews_params.rating && { rating: reviews_params.rating })
    }
    const res = await fetch(`${API_URL}/sentiments/list_reviews?` + new URLSearchParams(params), {
        method: 'GET',
    })
    
    if (!res.ok) {
        throw new Error('Failed to fetch reviews data')
    }
    const json = await res.json()
    // Normalize backend keys to our Review type
    const data = (json.data || []).map((r: any): Review => ({
        app_id: r.app_id,
        review_id: r.review_id,
        username: r.Reviewer ?? r.reviewer ?? r.username,
        user_image: r.user_image,
        review_text: r.review_text,
        rating: r.rating,
        sentiment: r.sentiment ?? null,
        thumbs_up_count: r.thumbs_up_count,
        reply_content: r.Reply ?? r.reply_content,
        reply_created_at: r.Reply_Date ?? r.reply_created_at,
        review_created_at: r.review_created_at,
        recommended_response_text: r.recommended_response_text,
        all_emotion_scores: r.all_emotion_scores ?? undefined,
    }))
    return { ...json, data }
}

// Separate API function for table data with pagination
export async function getReviewsForTable(params: {
    limit?: number
    offset?: number
    time_range?: string
    order_by?: string
    sentiment?: string
    rating?: string
}): Promise<GetReviewsResponse> {
    const apiParams = {
        app_id: 'com.kcb.mobilebanking.android.mbp',
        time_range: params.time_range || 'last_6_months',
        order_by: params.order_by || 'thumbs_up_count',
        limit: (params.limit || 10).toString(),
        offset: (params.offset || 0).toString(),
        ...(params.sentiment && { sentiment: params.sentiment }),
        ...(params.rating && { rating: params.rating })
    }
    const res = await fetch(`${API_URL}/sentiments/list_reviews?` + new URLSearchParams(apiParams), {
        method: 'GET',
    })
    
    if (!res.ok) {
        throw new Error('Failed to fetch table reviews data')
    }
    const json = await res.json()
    const data = (json.data || []).map((r: any): Review => ({
        app_id: r.app_id,
        review_id: r.review_id,
        username: r.Reviewer ?? r.reviewer ?? r.username,
        user_image: r.user_image,
        review_text: r.review_text,
        rating: r.rating,
        sentiment: r.sentiment ?? null,
        thumbs_up_count: r.thumbs_up_count,
        reply_content: r.Reply ?? r.reply_content,
        reply_created_at: r.Reply_Date ?? r.reply_created_at,
        review_created_at: r.review_created_at,
        recommended_response_text: r.recommended_response_text,
        all_emotion_scores: r.all_emotion_scores ?? undefined,
    }))
    return { ...json, data }
}

// New: API to fetch segments
export async function getSegments(params: { time_range?: string }): Promise<{ status: string, time_range: string, date_range: DateRange, data: Segment[] }>{
    const apiParams = {
        app_id: 'com.kcb.mobilebanking.android.mbp',
        time_range: params.time_range || 'this_year',
    }
    const res = await fetch(`${API_URL}/sentiments/list_segments?` + new URLSearchParams(apiParams), { method: 'GET' })
    if (!res.ok) throw new Error('Failed to fetch segments data')
    const json = await res.json()
    // Ensure array of records
    const data: Segment[] = Array.isArray(json.data) ? json.data : []
    return { ...json, data }
}

// New: API to fetch emotions
export async function getEmotions(params: { time_range?: string }): Promise<{ status: string, time_range: string, date_range: DateRange, data: EmotionRecord[] }>{
    const apiParams = {
        app_id: 'com.kcb.mobilebanking.android.mbp',
        time_range: params.time_range || 'this_year',
    }
    const res = await fetch(`${API_URL}/sentiments/list_emotions?` + new URLSearchParams(apiParams), { method: 'GET' })
    if (!res.ok) throw new Error('Failed to fetch emotions data')
    const json = await res.json()
    const data: EmotionRecord[] = Array.isArray(json.data) ? json.data : []
    return { ...json, data }
}
