"use client"
import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Badge } from "@/components/ui/badge"
import { Heart } from "lucide-react"
import Image from "next/image"

interface Segment {
  review_id: string
  review_created_at: string
  username: string
  user_image?: string
  text: string
  segment_sentiment_label: string | null
  segment_sentiment_score: number | null
}

interface SegmentsCarouselProps {
  segments?: Segment[]
  loading?: boolean
}

export default function SegmentsCarousel({ segments = [], loading = false }: SegmentsCarouselProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )
  const [hasLoadedOnce, setHasLoadedOnce] = React.useState(false)
  
  // Debug logging
  React.useEffect(() => {
    if (segments.length > 0) {
      console.log("🎠 SegmentsCarousel received segments:", segments)
      console.log("🎠 First segment username:", segments[0]?.username)
      setHasLoadedOnce(true)
    }
  }, [segments])
  return (
    <div className="w-full h-full" style={{ height: '100%' }}>
      <Carousel
        plugins={[plugin.current]}
        className="w-full h-full"
        style={{ height: '100%' }}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="h-full -ml-0" style={{ height: '100%' }}>
          {loading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <CarouselItem key={`loading-${index}`} className="h-full">
                <div className="h-full">
                  <Card className="h-full">
                    <CardContent className="flex flex-col items-center justify-center p-3 h-full">
                      <div className="w-full h-4 bg-muted rounded animate-pulse mb-2"></div>
                      <div className="w-3/4 h-3 bg-muted rounded animate-pulse"></div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))
          ) : segments.length > 0 ? (
            segments.map((segment, index) => (
            <CarouselItem key={segment.review_id} className="h-full">
              <div className="h-full">
                <Card className="h-full bg-white border-gray-200 shadow-sm">
                  <CardContent className="flex flex-col p-1 h-full">
                    {/* User Info Header */}
                    <div className="flex items-center gap-1 mb-1">
                      {/* User Avatar */}
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        {segment.user_image ? (
                          <Image
                            src={segment.user_image}
                            alt={segment.username}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-red-500 text-white font-semibold text-xs">
                            {(segment.username || 'A').charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col flex-1">
                        <span className="text-xs font-medium text-gray-800">
                          {segment.username || 'Anonymous'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(segment.review_created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {/* Sentiment Heart */}
                      <Heart 
                        className={`w-5 h-5 ${
                          segment.segment_sentiment_label === 'positive' 
                            ? 'text-green-500 fill-green-500' 
                            : segment.segment_sentiment_label === 'negative'
                            ? 'text-red-500 fill-red-500'
                            : 'text-yellow-500 fill-yellow-500'
                        }`}
                      />
                    </div>

                    {/* Testimonial Text */}
                    <div className="flex-1 flex items-center justify-center">
                      <p className="text-2xl font-bold text-gray-800 leading-tight text-center w-full">
                        "{segment.text || 'No text available'}"
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
            ))
          ) : (
            // No data state - only show when not loading and no segments
            <CarouselItem className="h-full">
              <div className="h-full">
                <Card className="h-full">
                  <CardContent className="flex items-center justify-center p-3 h-full">
                    <span className="text-sm text-gray-500">No segments available</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          )}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}