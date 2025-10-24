

"use client"

import { getActionsData, getActions, getActionsForTable, Action, ActionsParams, AnalysisParams, ActionsAnalysis, GetActionsResponse, calculatePriorityMetrics, calculateCategoryMetrics, calculateEffortMetrics, calculateTimelineMetrics} from './actions_data'


import React, { useEffect, useState } from 'react'

import NumberCard from '@/components/number_card'
import { TimerangeMenu } from '@/components/timerange-menu'
import { X, List, AlertCircle , AlertTriangle, Info } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { CategoryBarChart } from '@/components/actions/category-bar-chart'
import { EffortPieChart } from '@/components/actions/effort-pie-chart'
import { TimelinePieChart } from '@/components/actions/timeline-pie-chart'
import ActionsTable from '@/components/actions/actions_table'


export default function ActionsPage() {
    
    const summary = "test summary"
    const [dateRange, setDateRange] = useState("last_6_months")

    const [actions,setActions] = useState<Action[] | null>(null)
    const [actionsAnalysis,setActionsAnalysis] = useState<ActionsAnalysis | null>(null)
    const [isLoading,setIsLoading] = useState(true)
    const [error,setError] = useState<string | null>(null)

    // Table-specific state
    const [tableData, setTableData] = useState<GetActionsResponse | null>(null)
    const [tableLoading, setTableLoading] = useState(false)
    const [tablePagination, setTablePagination] = useState({
        pageIndex: 0,
        pageSize: 10
    })
    const [selectedEfforts, setSelectedEfforts] = useState<string[]>([])

    const effortOptions = [
        { value: 'low', label: 'Low Effort', color: 'bg-green-200 text-green-900' },
        { value: 'medium', label: 'Medium Effort', color: 'bg-yellow-200 text-yellow-900' },
        { value: 'high', label: 'High Effort', color: 'bg-red-200 text-red-900' }
    ]

    // Fetch data on mount
    useEffect(() => {
        const fetchDataProgressively = async () => {
            try {
                setIsLoading(true)
                setError(null)

                // STEP 1: Load analytics first (KPIs + Charts) - Most Important
                console.log("📊 Loading analytics data...")
                const analyticsData = await getActionsData({
                    time_range: dateRange
                } as AnalysisParams)
                console.log("✅ Analytics loaded:", analyticsData)
                setActionsAnalysis(analyticsData)

                // STEP 2: Load first page for table
                console.log("📋 Loading actions list...")
                const actionsData = await getActions({
                    time_range: dateRange,
                    order_by: 'number_of_actions',
                    limit: tablePagination.pageSize,
                    offset: tablePagination.pageIndex * tablePagination.pageSize,
                } as ActionsParams)
                console.log("✅ Actions list loaded:", actionsData)
                setTableData(actionsData)

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
            const tableActions = await getActionsForTable({
                time_range: dateRange,
                order_by: 'number_of_actions',
                limit: tablePagination.pageSize,
                offset: tablePagination.pageIndex * tablePagination.pageSize,
                // Include effort filter if any are selected
                ...(selectedEfforts.length > 0 && { estimated_effort: selectedEfforts.join(',') })
            })
            setTableData(tableActions)
        } catch (error) {
            console.error('Error fetching table data:', error)
        } finally {
            setTableLoading(false)
        }
    }

    // Fetch table data when pagination, dateRange, or effort filters change
    useEffect(() => {
        fetchTableData()
    }, [tablePagination.pageIndex, tablePagination.pageSize, dateRange, selectedEfforts])

    const handleTablePaginationChange = (newPagination: { pageIndex: number; pageSize: number }) => {
        setTablePagination(newPagination)
    }

    // Effort filter functions
    const toggleEffortFilter = (effort: string) => {
        setSelectedEfforts(prev => {
            const newFilters = prev.includes(effort)
                ? prev.filter(s => s !== effort)
                : [...prev, effort]
            
            // Reset to first page when filters change
            setTablePagination(prev => ({ ...prev, pageIndex: 0 }))
            return newFilters
        })
    }

    const clearAllFilters = () => {
        setSelectedEfforts([])
        setTablePagination(prev => ({ ...prev, pageIndex: 0 }))
    }


       

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 font-rubik">
            <div className="flex flex-col gap-6">
                <div className="p-6 mb-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">  
                        <div className="flex flex-col gap-1">
                            <h1 className="text-3xl font-bold">Customer Experience Actions</h1>
                            <p className="text-gray-800 dark:text-gray-300 font-bold">
                                Real-time insights and analytics dashboard
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
                                <div key={`skeleton-card-${index}`} className="p-6 bg-white dark:bg-card/50 rounded-lg border transition-all duration-200">
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
                            <div className="p-6 bg-card rounded-lg border transition-all duration-200">
                                <Skeleton className="h-5 w-32 mb-4" />
                                <Skeleton className="h-64 w-full" />
                            </div>
                            <div className="p-6 bg-card rounded-lg border transition-all duration-200">
                                <Skeleton className="h-5 w-28 mb-4" />
                                <Skeleton className="h-64 w-full" />
                            </div>
                        </div>
                        
                        {/* Skeleton for Issue Cards */}
                        <div className="flex flex-col gap-1">
                            <div className="h-6 w-24 bg-muted rounded animate-pulse mb-2"></div>
                            <div className="h-4 w-48 bg-muted rounded animate-pulse mb-4"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div key={`skeleton-issue-card-${index}`} className="p-4 bg-card rounded-lg shadow-md border">
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
                        <div className="w-full bg-card rounded-lg shadow-md border p-4">
                            <div className="h-64 bg-muted rounded animate-pulse"></div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Summary Cards - Use real data from analytics */}
                        {actionsAnalysis && actionsAnalysis.data && actionsAnalysis.data.length > 0 ? (
                            (() => {
                                const priorityMetrics = calculatePriorityMetrics(actionsAnalysis)
                                const quickWins = actionsAnalysis.data.reduce((sum, period) => sum + (period.quick_wins || 0), 0)
                                
                                return (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">      
                                        <NumberCard 
                                            icon={<List color="white"/>}
                                            title="Total Actions" 
                                            number={priorityMetrics.totalActions.toString()} 
                                            graph="stable" 
                                            change_percentage="0%" 
                                        />
                                        <NumberCard 
                                            icon={<AlertTriangle color="white"/>}
                                            title="Quick Wins" 
                                            number={quickWins.toString()} 
                                            graph="grow" 
                                            change_percentage="0%" 
                                        />
                                        <NumberCard 
                                            icon={<AlertCircle color="white"/>}
                                            title="Must Do" 
                                            number={priorityMetrics.highPriority.toString()} 
                                            graph="decline" 
                                            change_percentage="0%" 
                                        />
                                        <NumberCard 
                                            icon={<Info color="white"/>}
                                            title="Good to Have" 
                                            number={priorityMetrics.lowPriority.toString()} 
                                            graph="stable" 
                                            change_percentage="0%" 
                                        />
                                    </div>
                                )
                            })()
                        ) : (
                            <div className="text-center py-4 text-muted-foreground">
                                {actionsAnalysis ? 'No analytics data available for the selected time range' : 'Loading analytics data...'}
                            </div>
                        )}

                        {/* Category Bar Chart */}
                        {actionsAnalysis && actionsAnalysis.data && actionsAnalysis.data.length > 0 ? (
                            <div className="w-full bg-white dark:bg-card/50 rounded-lg border p-6 transition-all duration-200">
                                <CategoryBarChart data={calculateCategoryMetrics(actionsAnalysis)} />
                            </div>
                        ) : (
                            <div className="w-full bg-white dark:bg-card/50 rounded-lg border p-6 transition-all duration-200">
                                <div className="flex items-center justify-center h-64 text-muted-foreground">
                                    No category data available for the selected time range
                                </div>
                            </div>
                        )}

                <div className="flex flex-col gap-1">
                            {/* <h2 className="text-lg font-bold">Issue Trends</h2>
                    <p className="text-sm text-muted-foreground">
                                Showing trends for {dateRange}
                            </p> */}
                </div>
                {/* Charts section - Pie charts for effort and timeline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">      
                    <div className="p-6 bg-white dark:bg-card/50 rounded-lg border transition-all duration-200">
                        <EffortPieChart data={calculateEffortMetrics(actionsAnalysis)} />
                    </div>
                    <div className="p-6 bg-white dark:bg-card/50 rounded-lg border transition-all duration-200">
                        <TimelinePieChart data={calculateTimelineMetrics(actionsAnalysis)} />
                    </div>
                </div>
              
                {/* Removed Top Actions cards */}

                        {/* Actions Table Section */}
                        <div className="space-y-6">
                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-bold">All Actions</h2>
                                {tableLoading ? (
                                    <div className="h-4 w-64 bg-muted rounded animate-pulse"></div>
                                ) : (
                    <p className="text-sm text-muted-foreground">
                                        {tableData ? `${tableData.pagination?.total || tableData.data?.length || 0} actions found` : 'No actions data'} for {dateRange.replaceAll('_',' ')}
                                        {selectedEfforts.length > 0 && ` (filtered by ${selectedEfforts.length} effort level${selectedEfforts.length > 1 ? 's' : ''})`}
                                    </p>
                                )}
                            </div>

                            {/* Effort Filter Badges */}
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-muted-foreground">Filter by Effort:</span>
                                    {!tableLoading && selectedEfforts.length > 0 && (
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
                                        effortOptions.map((effort) => (
                                            <Badge
                                                key={effort.value}
                                                className={`cursor-pointer transition-all ${
                                                    selectedEfforts.includes(effort.value)
                                                        ? 'bg-primary/70 text-white ring-2 ring-offset-2 ring-primary/30'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                                onClick={() => toggleEffortFilter(effort.value)}
                                            >
                                                {effort.label}
                                                {selectedEfforts.includes(effort.value) && (
                                                    <X className="w-3 h-3 ml-1" />
                                                )}
                                            </Badge>
                                        ))
                                    )}
                  </div>  
            </div>
       
                            {/* Table Container */}
                            <div className="w-full">
                                <ActionsTable 
                                    data={tableData?.data || []}
                                    totalCount={tableData?.pagination?.total || 0}
                                    pageSize={tablePagination.pageSize}
                                    pageIndex={tablePagination.pageIndex}
                                    onPaginationChange={handleTablePaginationChange}
                                    isLoading={tableLoading}
                                />
                            </div>
                        </div>
                        {/* <div className="grid grid-cols-1 w-full">      
                            <IssueLogs title="New Customers" number="1000" graph="grow" change_percentage="10%" />
                        </div>   */}
                    </>
                )}
            </div>
        </div>
    </div>
  )
}