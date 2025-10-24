"use client";

import { AppDetails } from '@/app/(dashboard)/dashboard/page'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { Star } from 'lucide-react'

interface AppDetailsCardProps {
    details: AppDetails
}

export function AppDetailsCard({ details }: AppDetailsCardProps) {

    return (
        <div className="w-full"> 
            <Card className="h-fit">
                <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* App Icon and Basic Info */}
                            <div className="flex flex-col items-center md:items-start gap-4">
                                <div className="relative w-24 h-24 rounded-2xl overflow-hidden">
                                    <Image
                                        src={details.icon_url}
                                        alt={details.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                    <span className="text-lg font-semibold">{details.rating}</span>
                                    <span className="text-sm text-muted-foreground">
                                        ({details.total_ratings.toLocaleString()} ratings)
                                    </span>
                                </div>
                            </div>

                            {/* App Details */}
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-bold">{details.name}</h3>
                                    <p className="text-sm text-muted-foreground">{details.developer}</p>
                                </div>
                                
                                <div className="space-y-1">
                                    <p className="text-sm">
                                        <span className="text-muted-foreground">Category:</span> {details.category}
                                    </p>
                                    <p className="text-sm">
                                        <span className="text-muted-foreground">Content Rating:</span> {details.content_rating}
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm">
                                        <span className="text-muted-foreground">Version:</span> {details.version}
                                    </p>
                                    <p className="text-sm">
                                        <span className="text-muted-foreground">Size:</span> {details.size}
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm">
                                        <span className="text-muted-foreground">Installs:</span> {details.installs}
                                    </p>
                                    <p className="text-sm">
                                        <span className="text-muted-foreground">Last Updated:</span> {details.last_updated}
                                    </p>
                                </div>
                            </div>
                        </div>
                </CardContent>
            </Card>
        </div>
    )
}