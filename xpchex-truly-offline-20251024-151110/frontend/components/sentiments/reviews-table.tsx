"use client"

import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, Eye, EyeOff, ChevronRight, ChevronDown as ChevronDownIcon } from "lucide-react"
import { Review } from '@/app/(dashboard)/sentiments/sentiments_data'

interface ReviewsTableProps {
  data: Review[]
  loading?: boolean
  pagination?: {
    total: number
    limit: number
    offset: number
  }
  onPaginationChange?: (limit: number, offset: number) => void
}

const columnDefinitions = [
  { key: 'username', label: 'Reviewer', defaultVisible: true },
  { key: 'review_text', label: 'Review Text', defaultVisible: true },
  { key: 'rating', label: 'Rating', defaultVisible: true },
  { key: 'sentiment', label: 'Sentiment', defaultVisible: true },
  { key: 'thumbs_up', label: 'Thumbs Up', defaultVisible: true },
  { key: 'thumbs_down', label: 'Thumbs Down', defaultVisible: false },
  { key: 'review_created_at', label: 'Date', defaultVisible: true },
  { key: 'recommended_response_text', label: 'Response', defaultVisible: false },
  { key: 'app_version', label: 'App Version', defaultVisible: false },
  { key: 'device_info', label: 'Device', defaultVisible: false },
  { key: 'emotions', label: 'Emotions', defaultVisible: true },
]

export function ReviewsTable({ data, loading, pagination, onPaginationChange }: ReviewsTableProps) {
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(columnDefinitions.filter(col => col.defaultVisible).map(col => col.key))
  )
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const toggleColumn = (columnKey: string) => {
    const newVisibleColumns = new Set(visibleColumns)
    if (newVisibleColumns.has(columnKey)) {
      newVisibleColumns.delete(columnKey)
    } else {
      newVisibleColumns.add(columnKey)
    }
    setVisibleColumns(newVisibleColumns)
  }

  const toggleRowExpansion = (reviewId: string) => {
    const newExpandedRows = new Set(expandedRows)
    if (newExpandedRows.has(reviewId)) {
      newExpandedRows.delete(reviewId)
    } else {
      newExpandedRows.add(reviewId)
    }
    setExpandedRows(newExpandedRows)
  }

  const getSentimentBadgeColor = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'negative':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      case 'neutral':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  const getRatingStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  const truncateText = (text: string | null | undefined, maxLength: number = 100) => {
    if (!text) return 'N/A'
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const getFirstLine = (text: string | null | undefined) => {
    if (!text) return 'N/A'
    const firstLine = text.split('\n')[0]
    return firstLine.length > 80 ? firstLine.substring(0, 80) + '...' : firstLine
  }

  const getExpandedText = (text: string | null | undefined) => {
    if (!text) return 'N/A'
    return text
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return 'Invalid Date'
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getEmotionsList = (allEmotionScores: { [key: string]: number } | undefined) => {
    if (!allEmotionScores || typeof allEmotionScores !== 'object') return []
    
    // Get all emotion names from the emotion scores object
    return Object.keys(allEmotionScores)
  }

  if (loading) {
    return (
      <div className="w-full">
        <div className="bg-white dark:bg-card rounded-lg border">
          <div className="p-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="bg-white dark:bg-card rounded-lg border">
        <div className="p-4">
          {/* Column Visibility Controls */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Columns:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    <Eye className="h-4 w-4 mr-2" />
                    Show/Hide
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {columnDefinitions.map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.key}
                      checked={visibleColumns.has(column.key)}
                      onCheckedChange={() => toggleColumn(column.key)}
                    >
                      {column.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Pagination Info */}
            {pagination && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {pagination.offset + 1}-{Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total} reviews
              </div>
            )}
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  {columnDefinitions
                    .filter(col => visibleColumns.has(col.key))
                    .map((column) => (
                      <TableHead key={column.key} className="font-semibold">
                        {column.label}
                      </TableHead>
                    ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((review) => {
                  const isExpanded = expandedRows.has(review.review_id)
                  
                  return (
                    <React.Fragment key={review.review_id}>
                      {/* Main Row */}
                      <TableRow 
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                        onClick={() => toggleRowExpansion(review.review_id)}
                      >
                        <TableCell className="w-8">
                          {isExpanded ? (
                            <ChevronDownIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                          )}
                        </TableCell>
                        
                        {visibleColumns.has('username') && (
                          <TableCell>
                            <div className="font-medium text-sm">
                              {review.username || 'Anonymous'}
                            </div>
                          </TableCell>
                        )}
                        
                        {visibleColumns.has('review_text') && (
                          <TableCell className="max-w-xs">
                            <div className={`text-sm ${isExpanded ? 'whitespace-pre-wrap' : 'truncate'}`}>
                              {isExpanded ? getExpandedText(review.review_text) : getFirstLine(review.review_text)}
                            </div>
                          </TableCell>
                        )}
                        
                        {visibleColumns.has('rating') && (
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="text-yellow-500 text-sm">
                                {getRatingStars(review.rating)}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                ({review.rating}/5)
                              </span>
                            </div>
                          </TableCell>
                        )}
                        
                        {visibleColumns.has('sentiment') && (
                          <TableCell>
                            <Badge className={getSentimentBadgeColor(review.sentiment)}>
                              {review.sentiment}
                            </Badge>
                          </TableCell>
                        )}
                        
                        {visibleColumns.has('thumbs_up') && (
                          <TableCell>
                            <div className="flex items-center gap-1 text-green-600">
                              <span className="text-sm">👍</span>
                              <span className="text-sm font-medium">{review.thumbs_up}</span>
                            </div>
                          </TableCell>
                        )}
                        
                        {visibleColumns.has('thumbs_down') && (
                          <TableCell>
                            <div className="flex items-center gap-1 text-red-600">
                              <span className="text-sm">👎</span>
                              <span className="text-sm font-medium">{review.thumbs_down}</span>
                            </div>
                          </TableCell>
                        )}
                        
                        {visibleColumns.has('review_created_at') && (
                          <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                            {formatDate(review.review_created_at)}
                          </TableCell>
                        )}
                        
                        {visibleColumns.has('recommended_response_text') && (
                          <TableCell className="max-w-xs">
                            <div className={`text-sm text-gray-600 dark:text-gray-400 ${isExpanded ? 'whitespace-pre-wrap' : 'truncate'}`}>
                              {isExpanded ? getExpandedText(review.recommended_response_text) : getFirstLine(review.recommended_response_text)}
                            </div>
                          </TableCell>
                        )}
                        
                        {visibleColumns.has('app_version') && (
                          <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                            {review.app_version}
                          </TableCell>
                        )}
                        
                        {visibleColumns.has('device_info') && (
                          <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                            {review.device_info}
                          </TableCell>
                        )}
                        
                        {visibleColumns.has('emotions') && (
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {getEmotionsList(review.all_emotion_scores).length > 0 ? (
                                getEmotionsList(review.all_emotion_scores).slice(0, 3).map((emotion, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {emotion}
                                  </Badge>
                                ))
                              ) : (
                                <Badge variant="outline" className="text-xs text-gray-500 dark:text-gray-400">
                                  N/A
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                      
                    </React.Fragment>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {pagination && onPaginationChange && (
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Rows per page:</span>
                <select
                  value={pagination.limit}
                  onChange={(e) => onPaginationChange(Number(e.target.value), 0)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPaginationChange(pagination.limit, Math.max(0, pagination.offset - pagination.limit))}
                  disabled={pagination.offset === 0}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Page {Math.floor(pagination.offset / pagination.limit) + 1} of {Math.ceil(pagination.total / pagination.limit)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPaginationChange(pagination.limit, pagination.offset + pagination.limit)}
                  disabled={pagination.offset + pagination.limit >= pagination.total}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
