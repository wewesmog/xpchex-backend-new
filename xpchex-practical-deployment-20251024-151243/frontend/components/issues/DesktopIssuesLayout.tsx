// This component will manage the overall two-column structure. It will likely use CSS Grid or Flexbox to create the left and right panels.
"use client "
import React from 'react'

export default function DesktopIssuesLayout({issueListPanel, issueDetailsPanel}: {issueListPanel: React.ReactNode, issueDetailsPanel: React.ReactNode}) {
    return (

        <div className="flex flex-col gap-4 font-rubik w-full">
       
      {/* 2 Panels Layout Desktop */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Panel */}
        <div className="w-full lg:w-1/3 min-h-screen">
          {/* <h2 className="text-lg font-bold">Issues</h2> */}
          {issueListPanel}
        </div>
        {/* Right Panel */}
        <div className="w-full lg:w-2/3 min-h-screen">
          {/* <h2 className="text-lg font-bold">Issue Details</h2> */}
         {issueDetailsPanel}
        </div>
      </div>
      </div>
    )
}
