"use client"

import { getSentimentsData, getReviews, getReviewsForTable, Review, ReviewsParams, AnalysisParams, SentimentsAnalysis, GetReviewsResponse, calculateSentimentMetrics, calculateRatingMetrics, calculateNPSFromSentiment, getSegmentsData, Segment, getEmotions, EmotionRecord, getAllSegmentsData} from './sentiments_data'

import React, { useEffect, useState } from 'react'

import NumberCard from '@/components/number_card'
import { TimerangeMenu } from '@/components/timerange-menu'
import { AppDetailsCard } from '@/components/dashboard/app-details'
import { appDetails } from '../dashboard/data'
import { ReviewsTable } from '@/components/sentiments/reviews-table'
import { X, MessageSquare, ThumbsUp, ThumbsDown, Star, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import SegmentsCarousel from '@/components/sentiments/segments-carousel'
import RatingTrends from '@/components/sentiments/rating_trends'
import SentimentTrends from '@/components/sentiments/sentiment_trends'
import EmotionsWordCloud from '@/components/sentiments/emotions-wordcloud'
import EmotionsBarChart from '@/components/sentiments/emotions-bar-chart'

// Utility function to transform sentiments data for charts
function transformSentimentsDataForCharts(data: any) {
    if (!data || !Array.isArray(data)) {
        return null
    }

    const period: { [key: string]: string } = {}
    const positive: { [key: string]: number } = {}
    const negative: { [key: string]: number } = {}
    const neutral: { [key: string]: number } = {}
    const rating_1: { [key: string]: number } = {}
    const rating_2: { [key: string]: number } = {}
    const rating_3: { [key: string]: number } = {}
    const rating_4: { [key: string]: number } = {}
    const rating_5: { [key: string]: number } = {}

    data.forEach((item, index) => {
        const periodKey = `period_${index}`
        period[periodKey] = item.sentiment_period

        // Extract sentiment counts from sentiment_breakdown
        if (item.sentiment_breakdown && Array.isArray(item.sentiment_breakdown)) {
            item.sentiment_breakdown.forEach((sentiment: any) => {
                if (sentiment.sentiment === 'positive') {
                    positive[periodKey] = sentiment.count
                } else if (sentiment.sentiment === 'negative') {
                    negative[periodKey] = sentiment.count
                } else if (sentiment.sentiment === 'neutral') {
                    neutral[periodKey] = sentiment.count
                }
            })
        }

        // Extract rating counts from rating_breakdown
        if (item.rating_breakdown && Array.isArray(item.rating_breakdown)) {
            item.rating_breakdown.forEach((rating: any) => {
                if (rating.rating === 1) {
                    rating_1[periodKey] = rating.count
                } else if (rating.rating === 2) {
                    rating_2[periodKey] = rating.count
                } else if (rating.rating === 3) {
                    rating_3[periodKey] = rating.count
                } else if (rating.rating === 4) {
                    rating_4[periodKey] = rating.count
                } else if (rating.rating === 5) {
                    rating_5[periodKey] = rating.count
                }
            })
        }
    })

    return {
        period,
        positive,
        negative,
        neutral,
        rating_1,
        rating_2,
        rating_3,
        rating_4,
        rating_5
    }
}

export default function SentimentsPage() {
    
    const summary = "test summary"
    const [dateRange, setDateRange] = useState("last_6_months")

    const [reviews,setReviews] = useState<Review[] | null>(null)
    const [sentimentsAnalysis,setSentimentsAnalysis] = useState<SentimentsAnalysis | null>(null)
    const [isLoading,setIsLoading] = useState(true)
    const [error,setError] = useState<string | null>(null)

    // Table-specific state
    const [tableData, setTableData] = useState<GetReviewsResponse | null>(null)
    const [tableLoading, setTableLoading] = useState(false)
    const [tablePagination, setTablePagination] = useState({
        pageIndex: 0,
        pageSize: 10
    })
    const [selectedSentiments, setSelectedSentiments] = useState<string[]>([])
    const [segmentsData, setSegmentsData] = useState<Segment[] | null>(null)
    const [segmentsLoading, setSegmentsLoading] = useState(false)
    const [segmentsError, setSegmentsError] = useState<string | null>(null)
    const [allSegmentsData, setAllSegmentsData] = useState<Segment[] | null>(null)
    const [allSegmentsLoading, setAllSegmentsLoading] = useState(false)
    const [allSegmentsError, setAllSegmentsError] = useState<string | null>(null)
    const [emotionsData, setEmotionsData] = useState<EmotionRecord[] | null>(null)
    const [emotionsLoading, setEmotionsLoading] = useState(false)
    const [emotionsError, setEmotionsError] = useState<string | null>(null)
    const sentimentOptions = [
        { value: 'positive', label: 'Positive', color: 'bg-green-200 text-green-900' },
        { value: 'negative', label: 'Negative', color: 'bg-red-200 text-red-900' },
        { value: 'neutral', label: 'Neutral', color: 'bg-gray-200 text-gray-900' }
    ]

    // Fetch data on mount
    useEffect(() => {
        const fetchDataProgressively = async () => {
            try {
                setSegmentsLoading(true)
                setSegmentsError(null)
                console.log("📊 Loading segments data...")
                const segmentsData = await getSegmentsData({
                    time_range: dateRange
                })
                console.log("✅ Segments loaded:", segmentsData)
                console.log("🔍 Segments data sample:", segmentsData.data?.[0])
                setSegmentsData(segmentsData.data)
                setSegmentsLoading(false)

                // Fetch all segments data for word cloud
                setAllSegmentsLoading(true)
                setAllSegmentsError(null)
                console.log("📊 Loading all segments data for word cloud...")
                try {
                    const allSegmentsData = await getAllSegmentsData({
                        time_range: dateRange
                    })
                    setAllSegmentsData(allSegmentsData.data)
                    setAllSegmentsLoading(false)
                } catch (error) {
                    setAllSegmentsError(error instanceof Error ? error.message : 'Failed to load all segments')
                    setAllSegmentsLoading(false)
                }

                // Fetch emotions data
                setEmotionsLoading(true)
                setEmotionsError(null)
                console.log("📊 Loading emotions data...")
                try {
                    const emotionsData = await getEmotions({
                        time_range: dateRange
                    })
                    console.log("✅ Emotions loaded:", emotionsData)
                    console.log("🔍 Emotions data sample:", emotionsData.data?.[0])
                    console.log("🔍 Emotions data length:", emotionsData.data?.length)
                    console.log("🔍 Full emotions response:", JSON.stringify(emotionsData, null, 2))
                    setEmotionsData(emotionsData.data)
                    setEmotionsLoading(false)
                } catch (error) {
                    console.error("❌ Error loading emotions:", error)
                    setEmotionsError(error instanceof Error ? error.message : 'Failed to load emotions')
                    setEmotionsLoading(false)
                }

                // STEP 1: Load analytics first (KPIs + Charts) - Most Important
                console.log("📊 Loading sentiments analytics data...")
                setIsLoading(true)
                const analyticsData = await getSentimentsData({
                    time_range: dateRange
                } as AnalysisParams)
                console.log("✅ Analytics loaded:", analyticsData)
                setSentimentsAnalysis(analyticsData)

                // STEP 2: Load first page for table
                console.log("📋 Loading reviews list...")
                const reviewsData = await getReviews({
                    time_range: dateRange,
                    order_by: 'thumbs_up_count',
                    limit: tablePagination.pageSize,
                    offset: tablePagination.pageIndex * tablePagination.pageSize,
                } as ReviewsParams)
                console.log("✅ Reviews list loaded:", reviewsData)
                setTableData(reviewsData)

                setIsLoading(false)
                console.log("🎉 All main data loaded!")
                
            } catch (error) {
                setError(error instanceof Error ? error.message : 'An unknown error occurred')
                setIsLoading(false)
            }
        }
        fetchDataProgressively()
    }, [dateRange])

    // Fetch table data separately
    const fetchTableData = async (limit?: number, offset?: number) => {
        try {
            setTableLoading(true)
            const actualLimit = limit || tablePagination.pageSize
            const actualOffset = offset || tablePagination.pageIndex * tablePagination.pageSize
            
            const tableReviews = await getReviewsForTable({
                time_range: dateRange,
                order_by: 'thumbs_up_count',
                limit: actualLimit,
                offset: actualOffset,
                // Include sentiment filter if any are selected
                ...(selectedSentiments.length > 0 && { sentiment: selectedSentiments.join(',') })
            })
            setTableData(tableReviews)
        } catch (error) {
            console.error('Error fetching table data:', error)
        } finally {
            setTableLoading(false)
        }
    }

    // Fetch table data when pagination, dateRange, or sentiment filters change
    useEffect(() => {
        fetchTableData()
    }, [tablePagination.pageIndex, tablePagination.pageSize, dateRange, selectedSentiments])


    // Sentiment filter functions
    const toggleSentimentFilter = (sentiment: string) => {
        setSelectedSentiments(prev => {
            const newFilters = prev.includes(sentiment)
                ? prev.filter(s => s !== sentiment)
                : [...prev, sentiment]
            
            // Reset to first page when filters change
            setTablePagination(prev => ({ ...prev, pageIndex: 0 }))
            return newFilters
        })
    }

    const handleTablePaginationChange = (limit: number, offset: number) => {
        setTablePagination({
            pageIndex: Math.floor(offset / limit),
            pageSize: limit
        })
        fetchTableData(limit, offset)
    }

    const clearAllFilters = () => {
        setSelectedSentiments([])
        setTablePagination(prev => ({ ...prev, pageIndex: 0 }))
    }

  return (
    <div className="m-8 flex flex-col gap-8 font-sentiment">
        {/* App Details */}
        {/* <div className="grid grid-cols-1 gap-6 items-stretch">
            <AppDetailsCard details={appDetails} />
        </div> */}

        {/* Header with Timerange */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold font-sentiment-heading">Customer Sentiments & NPS</h1>
                <p className="text-gray-600">
                    Real-time insights and analytics dashboard
                </p>
            </div>
            <TimerangeMenu value={dateRange} onValueChange={setDateRange} />
        </div>
                

        {/* Error handling */}
        {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="text-red-800">
                    <strong>Error:</strong> {error}
                </div>
            </div>
        )}

        {/* Loading state */}
        {isLoading ? (
            <div className="space-y-6">
                {/* Skeleton for Number Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={`skeleton-card-${index}`} className="p-6 bg-white dark:bg-card rounded-lg border">
                            <div className="flex flex-col items-start justify-center h-full gap-4">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-8 w-16" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Skeleton for Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
                    <div className="p-6 bg-card rounded-lg border">
                        <Skeleton className="h-5 w-32 mb-4" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                    <div className="p-6 bg-card rounded-lg border">
                        <Skeleton className="h-5 w-28 mb-4" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                </div>
                
                {/* Skeleton for Word Cloud */}
                <div className="p-6 bg-card rounded-lg border">
                    <Skeleton className="h-5 w-32 mb-4" />
                    <Skeleton className="h-64 w-full" />
                </div>
                
                {/* Skeleton for Table Section */}
                <div className="flex flex-col gap-1">
                    <div className="h-6 w-24 bg-muted rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-64 bg-muted rounded animate-pulse mb-4"></div>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
                    </div>
                    <div className="flex gap-2">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="h-6 w-16 bg-muted rounded animate-pulse"></div>
                        ))}
                    </div>
                </div>
                <div className="w-full bg-card rounded-lg border p-4">
                    <div className="h-64 bg-muted rounded animate-pulse"></div>
                </div>
            </div>
        ) : (
            <>
                {/* Summary Cards Segment */}
                <div className="flex flex-col gap-4 w-full">
                    {sentimentsAnalysis && sentimentsAnalysis.data && sentimentsAnalysis.data.length > 0 ? (
                        (() => {
                            const sentimentMetrics = calculateSentimentMetrics(sentimentsAnalysis)
                            const sentimentNPS = Math.round(((sentimentMetrics.positiveReviews - sentimentMetrics.negativeReviews) / sentimentMetrics.totalReviews) * 100)
                            
                            return (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">      
                                    <NumberCard 
                                        icon={<MessageSquare color="white"/>}
                                        title="Total Reviews" 
                                        number={sentimentMetrics.totalReviews.toString()} 
                                        graph="stable" 
                                        change_percentage="0%" 
                                    />
                                    <NumberCard 
                                        icon={<ThumbsUp color="white"/>}
                                        title="Positive Reviews" 
                                        number={sentimentMetrics.positiveReviews.toString()} 
                                        graph="grow" 
                                        change_percentage="0%" 
                                    />
                                    <NumberCard 
                                        icon={<TrendingUp color="white"/>}
                                        title="Sentiment NPS" 
                                        number={`${sentimentNPS >= 0 ? '+' : ''}${sentimentNPS}`} 
                                        graph="stable" 
                                        change_percentage="0%" 
                                    />
                                    <NumberCard 
                                        icon={<ThumbsDown color="white"/>}
                                        title="Negative Reviews" 
                                        number={sentimentMetrics.negativeReviews.toString()} 
                                        graph="decline" 
                                        change_percentage="0%" 
                                    />
                                </div>
                            )
                        })()
                    ) : (
                        <div className="text-center py-4 text-muted-foreground">
                            {sentimentsAnalysis ? 'No analytics data available for the selected time range' : 'Loading analytics data...'}
                        </div>
                    )}
                </div>

                {/* Charts Segment */}
                <div className="flex flex-col gap-4 w-full">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-lg font-bold font-sentiment-heading">Review Trends</h2>
                        <p className="text-sm text-muted-foreground">
                            Showing trends for {dateRange}
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">      
                        <RatingTrends data={transformSentimentsDataForCharts(sentimentsAnalysis?.data)} />
                        <SentimentTrends data={transformSentimentsDataForCharts(sentimentsAnalysis?.data)} />
                    </div>
                </div>

                {/* Word Cloud + Segments Carousel (side by side) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full items-stretch">
                    <div className="flex flex-col gap-4 w-full">
                        {allSegmentsError ? (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600">Error loading segments for word cloud: {allSegmentsError}</p>
                            </div>
                        ) : (
                            <EmotionsWordCloud segments={allSegmentsData || []} loading={allSegmentsLoading} />
                        )}
                    </div>
                    <div className="bg-card rounded-lg border h-full">
                        <SegmentsCarousel 
                            segments={segmentsData || []} 
                            loading={segmentsLoading}
                        />
                    </div>
                </div>

                {/* Emotions Bar Chart Segment */}
                <div className="flex flex-col gap-4 w-full">
                    {emotionsError ? (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600">Error loading emotions: {emotionsError}</p>
                        </div>
                    ) : (
                        <EmotionsBarChart emotions={emotionsData || []} loading={emotionsLoading} />
                    )}
                </div>

                {/* Reviews Table Segment */}
                <div className="flex flex-col gap-4 w-full">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-lg font-bold font-sentiment-heading">All Reviews</h2>
                        {tableLoading ? (
                            <div className="h-4 w-64 bg-muted rounded animate-pulse"></div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                {tableData ? `${tableData.pagination?.total || tableData.data?.length || 0} reviews found` : 'No reviews data'} for {dateRange.replaceAll('_',' ')}
                                {selectedSentiments.length > 0 && ` (filtered by ${selectedSentiments.length} sentiment level${selectedSentiments.length > 1 ? 's' : ''})`}
                            </p>
                        )}
                    </div>

                    {/* Sentiment Filter Badges */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground">Filter by Sentiment:</span>
                            {!tableLoading && selectedSentiments.length > 0 && (
                                <Badge 
                                    variant="outline" 
                                    className="cursor-pointer hover:bg-gray-200 text-xs"
                                    onClick={clearAllFilters}
                                >
                                    <X className="w-3 h-3 mr-1" />
                                    Clear All
                                </Badge>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {tableLoading ? (
                                // Skeleton badges while loading
                                Array.from({ length: 3 }).map((_, index) => (
                                    <div key={`skeleton-badge-${index}`} className="h-6 w-16 bg-muted rounded animate-pulse"></div>
                                ))
                            ) : (
                                sentimentOptions.map((sentiment) => (
                                    <Badge
                                        key={sentiment.value}
                                        className={`cursor-pointer transition-all ${
                                            selectedSentiments.includes(sentiment.value)
                                                ? 'bg-primary/70 text-white ring-2 ring-offset-2 ring-primary/30'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                        onClick={() => toggleSentimentFilter(sentiment.value)}
                                    >
                                        {sentiment.label}
                                        {selectedSentiments.includes(sentiment.value) && (
                                            <X className="w-3 h-3 ml-1" />
                                        )}
                                    </Badge>
                                ))
                            )}
                        </div>  
                    </div>

                    {/* Table Container */}
                    <ReviewsTable 
                        data={tableData?.data || []}
                        loading={tableLoading}
                        pagination={tableData?.pagination}
                        onPaginationChange={handleTablePaginationChange}
                    />
                </div>
            </>
        )}
    </div>
  )
}
