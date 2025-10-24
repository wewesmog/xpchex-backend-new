"use client"

import { getPositivesData, getPositives, getPositivesForTable, Positive, positivesAnalysis, positives_list_request_params} from './positive_data'

import React, { useEffect, useState } from 'react'

import NumberCard from '@/components/number_card'
import { TimerangeMenu } from '@/components/timerange-menu'
import PositiveSeverity from '@/components/positives/positive_severity'
import PositiveTrend from '@/components/positives/positive_trend'
import PositiveTable from '@/components/positives/positive_table'
import {  X, List, AlertCircle , AlertTriangle, Info, Heart, Star, ThumbsUp, TrendingUp } from 'lucide-react'
import PositiveCard from '@/components/positives/positive_card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

export default function PositivesPage() {
    
    const [dateRange, setDateRange] = useState("last_6_months")

    const [positives, setPositives] = useState<GetPositivesResponse | null>(null)
    const [positivesAnalysis, setPositivesAnalysis] = useState<positivesAnalysis | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Table-specific state
    const [tableData, setTableData] = useState<GetPositivesResponse | null>(null)
    const [tableLoading, setTableLoading] = useState(false)
    const [tablePagination, setTablePagination] = useState({
        pageIndex: 0,
        pageSize: 10
    })
    const [selectedImpactLevels, setSelectedImpactLevels] = useState<string[]>([])

    const impactLevelOptions = [
        { value: 'High', label: 'High Impact', color: 'bg-green-200 text-green-900' },
        { value: 'Medium', label: 'Medium Impact', color: 'bg-yellow-200 text-yellow-900' },
        { value: 'Low', label: 'Low Impact', color: 'bg-blue-200 text-blue-900' }
    ]

    // Fetch data on mount
    useEffect(() => {
        const fetchDataProgressively = async () => {
            try {
                setIsLoading(true)
                setError(null)

                // STEP 1: Load analytics first (KPIs + Charts) - Most Important
                console.log("📊 Loading analytics data...")
                const analyticsData = await getPositivesData({
                    time_range: dateRange
                })
                console.log("✅ Analytics loaded:", analyticsData)
                setPositivesAnalysis(analyticsData)

                // STEP 2: Load top positives (Positive Cards) - Secondary
                console.log("🔝 Loading top positives...")
                const positivesData = await getPositives({
                    time_range: dateRange,
                    order_by: 'total_reviews',
                    limit: 4,
                    offset: 0,
                } as positives_list_request_params)
                console.log("✅ Top positives loaded:", positivesData)
                setPositives(positivesData)

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
    const fetchTableData = async () => {
        try {
            setTableLoading(true)
            console.log("🔄 Fetching table data with filters:", {
                time_range: dateRange,
                impact_level: selectedImpactLevels.length > 0 ? selectedImpactLevels.join(',') : undefined,
                pageIndex: tablePagination.pageIndex,
                pageSize: tablePagination.pageSize
            })
            
            const tablePositives = await getPositivesForTable({
                time_range: dateRange,
                order_by: 'total_reviews',
                limit: tablePagination.pageSize,
                offset: tablePagination.pageIndex * tablePagination.pageSize,
                // Include impact level filter if any are selected
                ...(selectedImpactLevels.length > 0 && { impact_level: selectedImpactLevels.join(',') })
            })
            
            console.log("✅ Table data loaded:", tablePositives)
            setTableData(tablePositives)
        } catch (error) {   
            console.error('Error fetching table data:', error)
        } finally {
            setTableLoading(false)
        }
    }

    // Fetch table data when pagination, dateRange, or impact level filters change
    useEffect(() => {
        console.log("🔄 Table data dependencies changed:", {
            pageIndex: tablePagination.pageIndex,
            pageSize: tablePagination.pageSize,
            dateRange,
            selectedImpactLevels
        })
        fetchTableData()
    }, [tablePagination.pageIndex, tablePagination.pageSize, dateRange, selectedImpactLevels])

    const handleTablePaginationChange = (newPagination: { pageIndex: number; pageSize: number }) => {
        console.log("📄 Pagination changed:", newPagination)
        setTablePagination(newPagination)
    }

    // Impact level filter functions
    const toggleImpactLevelFilter = (impactLevel: string) => {
        console.log("🔍 Toggling impact level filter:", impactLevel)
        setSelectedImpactLevels(prev => {
            const newFilters = prev.includes(impactLevel)
                ? prev.filter(s => s !== impactLevel)
                : [...prev, impactLevel]
            
            console.log("🔍 New impact level filters:", newFilters)
            // Reset to first page when filters change
            setTablePagination(prev => ({ ...prev, pageIndex: 0 }))
            return newFilters
        })
    }

    const clearAllFilters = () => {
        console.log("🧹 Clearing all filters")
        setSelectedImpactLevels([])
        setTablePagination(prev => ({ ...prev, pageIndex: 0 }))
    }

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 font-rubik">
                <div className="flex flex-col gap-6">
                    <div className="p-6 mb-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">  
                            <div className="flex flex-col gap-1">
                                <h1 className="text-3xl font-bold">Customer Experience Delights</h1>
                                <p className="text-gray-800 dark:text-gray-300 font-bold">
                                    Real-time positive feedback and customer satisfaction insights
                                </p>
                            </div>
                            <TimerangeMenu value={dateRange} onValueChange={setDateRange} />
                        </div>
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
                            
                            {/* Skeleton for Positive Cards */}
                            <div className="flex flex-col gap-1">
                                <div className="h-6 w-24 bg-muted rounded animate-pulse mb-2"></div>
                                <div className="h-4 w-48 bg-muted rounded animate-pulse mb-4"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <div key={`skeleton-positive-card-${index}`} className="p-4 bg-card rounded-lg border">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div>
                                                <div className="h-5 w-40 bg-muted rounded animate-pulse"></div>
                                            </div>
                                            <div className="h-6 w-16 bg-muted rounded animate-pulse"></div>
                                        </div>
                                        <div className="space-y-2 mb-4">
                                            <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
                                            <div className="h-4 w-3/4 bg-muted rounded animate-pulse"></div>
                                            <div className="h-4 w-5/6 bg-muted rounded animate-pulse"></div>
                                        </div>
                                        <div className="flex gap-1">
                                            {Array.from({ length: 3 }).map((_, badgeIndex) => (
                                                <div key={badgeIndex} className="h-5 w-12 bg-muted rounded animate-pulse"></div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
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
                                    {Array.from({ length: 4 }).map((_, index) => (
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
                            {/* Summary Cards - Use real data from analytics */}
                            {positivesAnalysis && positivesAnalysis.data && Object.keys(positivesAnalysis.data).length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">      
                                    <NumberCard 
                                        icon={<List color="white"/>}
                                        title="Total Positives" 
                                        number={Object.values(positivesAnalysis.data.total_positives || {}).reduce((sum: number, val: any) => sum + (val || 0), 0).toString()} 
                                        graph="stable" 
                                        change_percentage="0%" 
                                    />
                                    <NumberCard 
                                        icon={<Heart color="white"/>}
                                        title="High Impact" 
                                        number={Object.values(positivesAnalysis.data.high_impact_count || {}).reduce((sum: number, val: any) => sum + (val || 0), 0).toString()} 
                                        graph="grow" 
                                        change_percentage="0%" 
                                    />
                                    <NumberCard 
                                        icon={<Star color="white"/>}
                                        title="Medium Impact" 
                                        number={Object.values(positivesAnalysis.data.mid_impact_count || {}).reduce((sum: number, val: any) => sum + (val || 0), 0).toString()} 
                                        graph="stable" 
                                        change_percentage="0%" 
                                    />
                                    <NumberCard 
                                        icon={<ThumbsUp color="white"/>}
                                        title="Low Impact" 
                                        number={Object.values(positivesAnalysis.data.low_impact_count || {}).reduce((sum: number, val: any) => sum + (val || 0), 0).toString()} 
                                        graph="stable" 
                                        change_percentage="0%" 
                                    />
                                </div>
                            ) : (
                                <div className="text-center py-4 text-muted-foreground">
                                    {positivesAnalysis ? 'No analytics data available for the selected time range' : 'Loading analytics data...'}
                                </div>
                            )}

                            <div className="flex flex-col gap-1">
                                <h2 className="text-lg font-bold">Positive Feedback Trends</h2>
                                <p className="text-sm text-muted-foreground">
                                    Showing trends for {dateRange}
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">      
                                <PositiveSeverity data={positivesAnalysis?.data ? {
                                    high_impact_count: Object.values(positivesAnalysis.data.high_impact_count || {}).reduce((sum: number, val: any) => sum + (val || 0), 0),
                                    mid_impact_count: Object.values(positivesAnalysis.data.mid_impact_count || {}).reduce((sum: number, val: any) => sum + (val || 0), 0),
                                    low_impact_count: Object.values(positivesAnalysis.data.low_impact_count || {}).reduce((sum: number, val: any) => sum + (val || 0), 0)
                                } : undefined} />
                                <PositiveTrend data={positivesAnalysis?.data} />
                            </div>
                          
                            <div className="flex flex-col gap-1">
                                <h2 className="text-lg font-bold">Top Positive Feedback</h2>
                                <p className="text-sm text-muted-foreground">
                                    {positives ? `${positives.data.length} positive mentions found` : 'No positive data'}
                                </p>
                            </div>
                                    
                            {/* Top Positives - Use real data from positives */}
                            {positives && positives.data.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">      
                                    {positives.data.map((positive, index) => (
                                        <PositiveCard 
                                            key={index}
                                            title={positive.desc}
                                            number={positive.total_reviews.toString()} 
                                            severity={positive.impact_level}
                                            snippets={positive.quote}
                                            issue_type={positive.category}
                                            keywords={positive.keywords}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    No positive feedback found for the selected time range
                                </div>
                            )}

                            {/* Positive Feedback Logs Section */}
                            <div className="space-y-6">
                                <div className="flex flex-col gap-1">
                                    <h2 className="text-lg font-bold">All Positive Feedback</h2>
                                    {tableLoading ? (
                                        <div className="h-4 w-64 bg-muted rounded animate-pulse"></div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            {tableData ? `${tableData.pagination?.total || 0} positive mentions found` : 'No positive data'} for {dateRange.replaceAll('_',' ')}
                                            {selectedImpactLevels.length > 0 && ` (filtered by ${selectedImpactLevels.length} impact level${selectedImpactLevels.length > 1 ? 's' : ''})`}
                                        </p>
                                    )}
                                </div>

                                {/* Impact Level Filter Badges */}
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-muted-foreground">Filter by Impact Level:</span>
                                        {!tableLoading && selectedImpactLevels.length > 0 && (
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
                                            impactLevelOptions.map((impactLevel) => (
                                                <Badge
                                                    key={impactLevel.value}
                                                    className={`cursor-pointer transition-all ${
                                                        selectedImpactLevels.includes(impactLevel.value)
                                                            ? 'bg-primary/70 text-white ring-2 ring-offset-2 ring-primary/30'
                                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }`}
                                                    onClick={() => toggleImpactLevelFilter(impactLevel.value)}
                                                >
                                                    {impactLevel.label}
                                                    {selectedImpactLevels.includes(impactLevel.value) && (
                                                        <X className="w-3 h-3 ml-1" />
                                                    )}
                                                </Badge>
                                            ))
                                        )}
                                    </div>  
                                </div>
           
                                {/* Table Container */}
                                <div className="w-full">      
                                    <PositiveTable 
                                        data={tableData?.data || []} 
                                        totalCount={tableData?.pagination?.total || 0}
                                        pageSize={tablePagination.pageSize}
                                        pageIndex={tablePagination.pageIndex}
                                        onPaginationChange={handleTablePaginationChange}
                                        isLoading={tableLoading}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}