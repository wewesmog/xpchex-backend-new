// roadmap page

"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { SlidersHorizontal } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import ReviewsHeader from '@/components/Reviews/reviews-header'

import { useReviewsStore } from '@/app/stores/reviews'
import KeyReviewSnippets from '@/components/issues/issueDetailsPanel/children/KeyReviewSnippets/KeyReviewSnippets'
import ReviewsSummaryDashboard from '@/components/Reviews/ReviewsSummaryDashboard'


// Filter content component to avoid duplication
const FilterContent = () => (
  <div className="space-y-4">
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Status</h3>
      {/* Status filters */}
    </div>
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Priority</h3>
      {/* Priority filters */}
    </div>
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Category</h3>
      {/* Category filters */}
    </div>
  </div>
)

export default function WayForward() {
    const { reviewsSummary, reviews } = useReviewsStore()
    const keyReviews = reviews.slice(0, 3).map((review) => review.id)

    return (
      <div className="h-screen flex flex-col">
        {/* Fixed Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-24 items-center px-4 w-full justify-between">
            <ReviewsHeader />
            {/* Filter button for small screens */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    {/* <p>Filters</p> */}
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] sm:w-[340px]">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <FilterContent />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Main Content Area with Sidebar */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar Filter - Hidden on mobile */}
          <div className="hidden md:block w-64 border-r bg-muted/40 p-4">
            <FilterContent />
          </div>

          {/* Main Content - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Summary Dashboard */}
              <ReviewsSummaryDashboard reviewsSummary={reviewsSummary} />

              {/* Recommendations List */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Key Review Snippets</h2>
                <div className="flex flex-col gap-4">
                  <KeyReviewSnippets keyReviews={keyReviews} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}