// General card to be used in dashboards
// Has a large Number with small text above it and a small graph (decline/grow/stable) on the bottom right

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect, useRef } from "react"





interface IssueCardProps {
    id?: string
    number: string
    title: string
    severity?: string
    snippets?: string[]
    issue_type?: string
    keywords?: string[]
}






export default function IssueCard({ 
    title, 
    number, 
    severity,
    snippets,
    issue_type,
    keywords
}: IssueCardProps) {

    //pick random (max of 2) snpets from {snippets }, use useEffect to pick random snippets
    const [randomSnippets, setRandomSnippets] = useState<string[]>([])
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
    }, [keywords])
//  const randomSnippets = snippets?.slice(0, 2)

    return (
            <Card className="w-full  flex flex-col  ">
                <CardHeader>

                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-10 h-10 text-lg font-bold bg-primary text-white rounded-full">{number}</div>
                            <p className="text-md font-bold">{title}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-muted-foreground">{issue_type}</p>
                            <Badge className={`${
                                severity === 'critical' ? 'bg-red-200 text-red-900' :
                                severity === 'medium' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                            }`}>{severity}</Badge>

                        </div>
                    </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2 h-[200px] overflow-y-auto ">
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
                                {keywords && keywords.length > 0 ? (
                                    keywords.map((keyword, index) => (
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




