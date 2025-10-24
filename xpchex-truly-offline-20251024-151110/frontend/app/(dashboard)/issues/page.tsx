

"use client"

import { getIssuesData, getIssues, getIssuesForTable, Issues, issues_params , analysis_params , allIssuesAnalysis} from './issues_data'


import React, { useEffect, useState } from 'react'

import NumberCard from '@/components/number_card'
import { TimerangeMenu } from '@/components/timerange-menu'
import IssueSeverity from '@/components/issues/issue_severity'
import IssueTrend from '@/components/issues/issue_trend'
import IssueLogs from '@/components/issues/issue_logs'
import IssueTable from '@/components/issues/issue_table'
import { Loader2, X, List, AlertCircle , AlertTriangle, Info } from 'lucide-react'
import IssueCard from '@/components/issues/issue_card'
import issueTableData from '@/components/issues/issue_data.json'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'


export default function IssuesPage() {
    
    const summary = "test summary"
    const [dateRange, setDateRange] = useState("last_6_months")

    const [issues,setIssues] = useState<Issues | null>(null)
    const [issuesAnalysis,setIssuesAnalysis] = useState<allIssuesAnalysis | null>(null)
    const [isLoading,setIsLoading] = useState(true)
    const [error,setError] = useState<string | null>(null)

    // Table-specific state
    const [tableData, setTableData] = useState<Issues | null>(null)
    const [tableLoading, setTableLoading] = useState(false)
    const [tablePagination, setTablePagination] = useState({
        pageIndex: 0,
        pageSize: 10
    })
    const [selectedSeverities, setSelectedSeverities] = useState<string[]>([])

    const severityOptions = [
        { value: 'critical', label: 'Critical', color: 'bg-red-200 text-red-900' },
        { value: 'high', label: 'High', color: 'bg-orange-200 text-orange-900' },
        { value: 'medium', label: 'Medium', color: 'bg-yellow-200 text-yellow-900' },
        { value: 'low', label: 'Low', color: 'bg-green-200 text-green-900' }
    ]

    // Fetch data on mount
    useEffect(() => {
        const fetchDataProgressively = async () => {
            try {
                setIsLoading(true)
                setError(null)

                // STEP 1: Load analytics first (KPIs + Charts) - Most Important
                console.log("📊 Loading analytics data...")
                const analyticsData = await getIssuesData({
                    time_range: dateRange
                } as analysis_params)
                console.log("✅ Analytics loaded:", analyticsData)
                setIssuesAnalysis(analyticsData)

                // STEP 2: Load top issues (Issue Cards) - Secondary
                console.log("🔝 Loading top issues...")
                const issuesData = await getIssues({
                    time_range: dateRange,
                    order_by: 'count',
                    limit: 4,
                    offset: 0,
                } as issues_params)
                console.log("✅ Top issues loaded:", issuesData)
                setIssues(issuesData)

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
            const tableIssues = await getIssuesForTable({
                time_range: dateRange,
                order_by: 'count',
                limit: tablePagination.pageSize,
                offset: tablePagination.pageIndex * tablePagination.pageSize,
                // Include severity filter if any are selected
                ...(selectedSeverities.length > 0 && { severity: selectedSeverities.join(',') })
            })
            setTableData(tableIssues)
        } catch (error) {
            console.error('Error fetching table data:', error)
        } finally {
            setTableLoading(false)
        }
    }

    // Fetch table data when pagination, dateRange, or severity filters change
    useEffect(() => {
        fetchTableData()
    }, [tablePagination.pageIndex, tablePagination.pageSize, dateRange, selectedSeverities])

    const handleTablePaginationChange = (newPagination: { pageIndex: number; pageSize: number }) => {
        setTablePagination(newPagination)
    }

    // Severity filter functions
    const toggleSeverityFilter = (severity: string) => {
        setSelectedSeverities(prev => {
            const newFilters = prev.includes(severity)
                ? prev.filter(s => s !== severity)
                : [...prev, severity]
            
            // Reset to first page when filters change
            setTablePagination(prev => ({ ...prev, pageIndex: 0 }))
            return newFilters
        })
    }

    const clearAllFilters = () => {
        setSelectedSeverities([])
        setTablePagination(prev => ({ ...prev, pageIndex: 0 }))
    }


       

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 font-rubik">
            <div className="flex flex-col gap-6">
                <div className="p-6 mb-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">  
                        <div className="flex flex-col gap-1">
                            <h1 className="text-3xl font-bold">Customer Experience Issues</h1>
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
                        
                        {/* Skeleton for Issue Cards */}
                        <div className="flex flex-col gap-1">
                        <div className="h-6 w-24 bg-muted rounded animate-pulse mb-2"></div>
                        <div className="h-4 w-48 bg-muted rounded animate-pulse mb-4"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div key={`skeleton-issue-card-${index}`} className="p-4 bg-card rounded-lg border">
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
                        {issuesAnalysis && issuesAnalysis.data && Object.keys(issuesAnalysis.data).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">      
        <NumberCard 
            icon={<List color="white"/>}
            title="Total Issues" 
            number={Object.values(issuesAnalysis.data.total_issues || {}).reduce((sum: number, val: any) => sum + (val || 0), 0).toString()} 
            graph="stable" 
            change_percentage="0%" 
        />
        <NumberCard 
            icon={<AlertCircle color="white"/>}
            title="Critical Issues" 
            number={Object.values(issuesAnalysis.data.critical_count || {}).reduce((sum: number, val: any) => sum + (val || 0), 0).toString()} 
            graph="decline" 
            change_percentage="0%" 
        />
        <NumberCard 
            icon={<AlertTriangle color="white"/>}
            title="High Issues" 
            number={Object.values(issuesAnalysis.data.high_count || {}).reduce((sum: number, val: any) => sum + (val || 0), 0).toString()} 
            graph="stable" 
            change_percentage="0%" 
        />
        <NumberCard 
            icon={<Info color="white"/>}
            title="Medium Issues" 
            number={Object.values(issuesAnalysis.data.medium_count || {}).reduce((sum: number, val: any) => sum + (val || 0), 0).toString()} 
            graph="grow" 
            change_percentage="0%" 
        />
    </div>
) : (
    <div className="text-center py-4 text-muted-foreground">
        {issuesAnalysis ? 'No analytics data available for the selected time range' : 'Loading analytics data...'}
                </div>
)}

                <div className="flex flex-col gap-1">
                            {/* <h2 className="text-lg font-bold">Issue Trends</h2>
                    <p className="text-sm text-muted-foreground">
                                Showing trends for {dateRange}
                            </p> */}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">      
                            
                            <IssueSeverity data={issuesAnalysis?.data ? {
                                critical_count: Object.values(issuesAnalysis.data.critical_count || {}).reduce((sum: number, val: any) => sum + (val || 0), 0),
                                high_count: Object.values(issuesAnalysis.data.high_count || {}).reduce((sum: number, val: any) => sum + (val || 0), 0),
                                medium_count: Object.values(issuesAnalysis.data.medium_count || {}).reduce((sum: number, val: any) => sum + (val || 0), 0),
                                low_count: Object.values(issuesAnalysis.data.low_count || {}).reduce((sum: number, val: any) => sum + (val || 0), 0)
                            } : undefined} />
                            <IssueTrend data={issuesAnalysis?.data} />
                </div>
              
                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-bold">Top Issues</h2>
                    <p className="text-sm text-muted-foreground">
                                {issues ? `${issues.data.length} issues found` : 'No issues data'}
                    </p>
                </div>
                        
                        {/* Top Issues - Use real data from issues */}
                        {issues && issues.data.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">      
                                {issues.data.map((issue, index) => (
                                    <IssueCard 
                                        key={index}
                                        title={issue.desc}
                                        number={issue.count.toString()} 
                                        severity={issue.severity}
                                        snippets={issue.snippets}
                                        issue_type={issue.issue_type}
                                        keywords={issue.keywords}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                No issues found for the selected time range
                </div>
                        )}

                        {/* Issue Logs Section */}
                        <div className="space-y-6">
                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-bold">All Issues</h2>
                                {tableLoading ? (
                                    <div className="h-4 w-64 bg-muted rounded animate-pulse"></div>
                                ) : (
                    <p className="text-sm text-muted-foreground">
                                        {tableData ? `${tableData.pagination?.total || 0} issues found` : 'No issues data'} for {dateRange.replaceAll('_',' ')}
                                        {selectedSeverities.length > 0 && ` (filtered by ${selectedSeverities.length} severity level${selectedSeverities.length > 1 ? 's' : ''})`}
                                    </p>
                                )}
                            </div>

                            {/* Severity Filter Badges */}
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-muted-foreground">Filter by Severity:</span>
                                    {!tableLoading && selectedSeverities.length > 0 && (
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
                                        Array.from({ length: 4 }).map((_, index) => (
                                            <div key={`skeleton-badge-${index}`} className="h-6 w-16 bg-muted rounded animate-pulse"></div>
                                        ))
                                    ) : (
                                        severityOptions.map((severity) => (
                                            <Badge
                                                key={severity.value}
                                                className={`cursor-pointer transition-all ${
                                                    selectedSeverities.includes(severity.value)
                                                        ? 'bg-primary/70 text-white ring-2 ring-offset-2 ring-primary/30'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                                onClick={() => toggleSeverityFilter(severity.value)}
                                            >
                                                {severity.label}
                                                {selectedSeverities.includes(severity.value) && (
                                                    <X className="w-3 h-3 ml-1" />
                                                )}
                                            </Badge>
                                        ))
                                    )}
                  </div>  
            </div>
       
                            {/* Table Container */}
                            <div className="w-full">      
                                <IssueTable 
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