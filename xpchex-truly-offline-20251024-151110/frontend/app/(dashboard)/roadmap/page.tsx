// roadmap page

"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { SlidersHorizontal } from 'lucide-react'

import WayForwardHeader from '@/components/Roadmap/way-foward-header'
import WayForwardSummaryDashboard from '@/components/Roadmap/WayForwardSummaryDashboard'
import RecCard from '@/components/Roadmap/rec-card'

import { RecSummary, recommendationsData, Recommendation, AllRecommendationsData } from './data'
import RecCards from '@/components/Roadmap/rec-cards'

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
    const recSummary: RecSummary = recommendationsData.recSummary
    const recommendations: Recommendation[] = recommendationsData.recommendations
    const recs = recommendations.slice(0, 4)

    return (
      <div className="h-screen flex flex-col">
        {/* Fixed Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-24 items-center px-4 w-full justify-between">
            <WayForwardHeader />
            {/* Filter button for small screens */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
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
              <WayForwardSummaryDashboard recSummary={recSummary} />

              {/* Recommendations List */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Strategic AI Recommendations</h2>
                {/* Pass recs to the rec-cards component */}
               <RecCards rec={recs} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}