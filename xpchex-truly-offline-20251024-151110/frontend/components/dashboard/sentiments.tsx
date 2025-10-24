"use client";

import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'





export function SentimentsCard() {
    return (
        // flex container with responsive behavior
        <div className="flex flex-col md:flex-row gap-8 items-stretch"> 
            
            {/* First Card - takes full width on small screens, half on medium screens and up */}
            <div className="flex-1 w-full md:w-1/3"> 
                <Card className="h-full bg-green-500">
                    <CardContent className="p-6">
                      <p>positive</p>
                    </CardContent>
                </Card>
            </div>

            {/* Second Card - takes full width on small screens, half on medium screens and up */}
            <div className="flex-1 w-full md:w-1/3">
                <Card className="h-full bg-red-200">
                    <CardContent className="p-6">
                        <p>negative</p>
                    </CardContent>
                </Card>
            </div>

            
        </div>
    )
}