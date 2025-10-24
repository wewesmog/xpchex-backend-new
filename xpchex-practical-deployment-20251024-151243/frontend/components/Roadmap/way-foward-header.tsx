// way-foward-header.tsx

import React from 'react'
import Calendar29 from './date-picker'



// Clearly states "Way Forward: AI-Powered Recommendations" with general date range options
export default function WayForwardHeader() {
    return (
        <div className="flex flex-row gap-4">
            <h1>Way Forward: AI-Powered Recommendations</h1>
            <Calendar29 />
            <Calendar29 />
        </div>
    )
}


