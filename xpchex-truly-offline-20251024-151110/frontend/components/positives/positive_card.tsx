// Positive card component for displaying positive feedback
// Has a large Number with small text above it and a small graph (decline/grow/stable) on the bottom right

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect, useRef } from "react"

interface PositiveCardProps {
    id?: string
    number: string
    title: string
    severity?: string  // This will be impact_level for positives
    snippets?: string[]  // This will be quote for positives
    issue_type?: string  // This will be category for positives
    keywords?: string[]  // This will be keywords array for positives
}

export default function PositiveCard({ 
    title, 
    number, 
    severity,
    snippets,
    issue_type,
    keywords
}: PositiveCardProps) {

    // Pick random (max of 20) snippets from {snippets}, use useEffect to pick random snippets
    const [randomSnippets, setRandomSnippets] = useState<string[]>([])
    const [keywordArray, setKeywordArray] = useState<string[]>([])
    const [showRightHint, setShowRightHint] = useState(false)
    const [showLeftHint, setShowLeftHint] = useState(false)
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    
    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -100, behavior: 'smooth' })
        }
    }
    
    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 100, behavior: 'smooth' })
        }
    }
    
    useEffect(() => {
        if (!snippets?.length) {
            setRandomSnippets([])
            return
        }
        const shuffled = [...snippets].sort(() => Math.random() - 0.5)
        setRandomSnippets(shuffled.slice(0, 20))
    }, [snippets])
    
    useEffect(() => {
        if (keywords && Array.isArray(keywords)) {
            // keywords is now already an array
            setKeywordArray(keywords)
        } else {
            setKeywordArray([])
        }
    }, [keywords])
    
    // Check if content overflows and set hints accordingly
    useEffect(() => {
        const checkOverflow = () => {
            if (scrollContainerRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
                setShowLeftHint(scrollLeft > 0)
                setShowRightHint(scrollLeft < scrollWidth - clientWidth)
            }
        }
        
        checkOverflow()
        
        const container = scrollContainerRef.current
        if (container) {
            container.addEventListener('scroll', checkOverflow)
            return () => container.removeEventListener('scroll', checkOverflow)
        }
    }, [keywordArray])

    // Get impact level color scheme (positive theme)
    const getImpactLevelColor = (level: string) => {
        switch (level?.toLowerCase()) {
            case 'high':
                return 'bg-green-200 text-green-900'
            case 'medium':
                return 'bg-yellow-200 text-yellow-900'
            case 'low':
                return 'bg-blue-200 text-blue-900'
            default:
                return 'bg-gray-200 text-gray-900'
        }
    }

    return (
        <Card className="w-full flex flex-col  border-green-200 hover:border-green-300 transition-colors">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-10 h-10 text-lg font-bold bg-green-500 text-white rounded-full">
                            {number}
                        </div>
                        <p className="text-md font-bold text-green-800">{title}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">{issue_type}</p>
                        <Badge className={getImpactLevelColor(severity || '')}>
                            {severity}
                        </Badge>
                    </div>
                </CardTitle>
            </CardHeader>
            
            <CardContent className="flex flex-col gap-2 h-[200px] overflow-y-auto">
                {randomSnippets.map((snippet, index) => (
                    <p key={index} className="text-sm text-muted-foreground italic">"{snippet}"</p>
                ))}
            </CardContent>

            <CardFooter className="relative overflow-hidden">
                <div className="relative w-full flex items-center gap-2">
                    {/* Left arrow button */}
                    {showLeftHint && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={scrollLeft}
                            className="h-8 w-8 p-0 flex-shrink-0"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    )}
                    
                    <div 
                        ref={scrollContainerRef}
                        className="flex gap-1 overflow-x-auto scrollbar-hide pb-1 flex-1" 
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                            WebkitOverflowScrolling: 'touch'
                        }}
                    >
                        {keywordArray && keywordArray.length > 0 ? (
                            keywordArray.map((keyword, index) => (
                                <Badge key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 whitespace-nowrap flex-shrink-0">
                                    {keyword}
                                </Badge>
                            ))
                        ) : (
                            ""
                        )}
                    </div>
                    
                    {/* Right arrow button */}
                    {showRightHint && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={scrollRight}
                            className="h-8 w-8 p-0 flex-shrink-0"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </CardFooter>
        </Card>
    )
}