// way-foward-header.tsx

import React from 'react'
import Calendar29 from './date-picker'



// Clearly states "Way Forward: AI-Powered Recommendations" with general date range options
export default function ReviewsHeader() {
    return (
        <div className="flex flex-row gap-4">
            <h1>Reviews</h1>
            <Calendar29 />
            <Calendar29 />
        </div>
    )
}


