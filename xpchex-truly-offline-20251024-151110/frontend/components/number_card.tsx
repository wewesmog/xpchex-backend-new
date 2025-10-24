// General card to be used in dashboards
// Has a large Number with small text above it and a small graph (decline/grow/stable) on the bottom right

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronUp, ChevronDown, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge"

// Trend icons (Instagram style triangles)
const trendIcons = {
    grow: <ChevronUp className="w-3 h-3" />,
    decline: <ChevronDown className="w-3 h-3" />,
    stable: <Minus className="w-3 h-3" />
}

const AiRandomText: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do ."
interface NumberCardProps {
    graph: 'decline' | 'grow' | 'stable'
    number: string
    title: string
    icon?: React.ReactNode
    change_percentage?: string
    trend?: string
}

export default function NumberCard({ 
    title, 
    number, 
    graph, 
    icon, 
    change_percentage,
    trend 
}: NumberCardProps) {
    return (
        <Card className="w-full flex flex-col h-full dark:bg-card/50 hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-black/30 p-2">
            <div className="flex flex-col items-start justify-center h-full gap-2 px-4">
                <div className="text-md font-bold text-muted-foreground">
                    {title}
                </div>
                 <div className="flex flex-row justify-between items-center w-full">
                 <div className="flex flex-row gap-2 items-center min-w-[120px]">
                   <div className="p-2 rounded-full  flex-shrink-0">
                         {icon}
                     </div>  
                 <div className="text-5xl font-bold font-mono tracking-tight">{number}</div>
                 </div>
                 <div className="text-sm font-medium text-muted-foreground text-right flex-1 ml-4"> 
                     {AiRandomText}
                 </div>
                 </div>

                <Badge variant="outline" className="items-center justify-center mx-auto">
                {(change_percentage || trend) && (
                    <div className={`flex items-center gap-1 text-md font-bold ${
                        graph === 'grow' ? 'text-green-600' : 
                        graph === 'decline' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                        {trendIcons[graph]}
                        <span className="text-bold">{change_percentage || trend}</span> Month on Month
                    </div>
                )}
                </Badge>
            </div>
        </Card>
    );
}
