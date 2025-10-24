// This component will manage the overall two-column structure. It will likely use CSS Grid or Flexbox to create the left and right panels.
"use client "
import React from 'react'

export default function MobileIssuesLayout({mobileIssueListPanel}: {mobileIssueListPanel: React.ReactNode}) {
    return (

        <div className="flex flex-col gap-4 font-rubik w-full">
       
        {mobileIssueListPanel}
        
      </div>
    )
}