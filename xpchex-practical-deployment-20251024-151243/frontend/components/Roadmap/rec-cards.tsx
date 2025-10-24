// rec-cards.tsx
// To display rec cards in a grid, 1 column on mobile, 2 columns on tablet & above
// Pass rec-id to the rec-card component

import React from 'react'

import RecCard from './rec-card'
import { Recommendation } from '@/app/(dashboard)/roadmap/data'

type RecCardProps = {
    rec: Recommendation[]
}

export default function RecCards({ rec }: RecCardProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Map through the recs and pass the rec to the rec-card component */}
            {rec.map((rec) => (
                <RecCard key={rec.id} rec={rec} />
            ))}
        </div>
    )
}