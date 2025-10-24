// General card to be used in dashboards
// Has a large Number with small text above it and a small graph (decline/grow/stable) on the bottom right

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronUp, ChevronDown, Minus } from "lucide-react";
import * as LucideIcons from "lucide-react";

// Trend icons (Instagram style triangles)
const trendIcons = {
    grow: <ChevronUp className="w-3 h-3" />,
    decline: <ChevronDown className="w-3 h-3" />,
    stable: <Minus className="w-3 h-3" />
}

// Icon mapping with colors
const iconConfig = {
    users: { icon: 'Users', color: 'text-blue-500' },
    customers: { icon: 'Users', color: 'text-blue-500' },
    revenue: { icon: 'DollarSign', color: 'text-green-500' },
    transactions: { icon: 'Activity', color: 'text-purple-500' },
    orders: { icon: 'ShoppingCart', color: 'text-orange-500' },
    reviews: { icon: 'MessageSquare', color: 'text-pink-500' },
    response: { icon: 'Clock', color: 'text-yellow-500' },
    conversion: { icon: 'Target', color: 'text-indigo-500' },
    engagement: { icon: 'BarChart3', color: 'text-cyan-500' },
    analytics: { icon: 'PieChart', color: 'text-teal-500' },
    likes: { icon: 'Heart', color: 'text-red-500' },
    views: { icon: 'Eye', color: 'text-blue-500' },
    clicks: { icon: 'MousePointer', color: 'text-green-500' },
    performance: { icon: 'Zap', color: 'text-yellow-500' },
    security: { icon: 'Shield', color: 'text-gray-500' },
    rating: { icon: 'Star', color: 'text-yellow-500' }
}

interface NumberCardProps {
    graph: 'decline' | 'grow' | 'stable'
    number: string
    title: string
    icon?: React.ReactNode
    change_percentage?: string
    trend?: string
}



// Dynamic icon renderer
const getIcon = (title: string, customIcon?: React.ReactNode) => {
    if (customIcon) return customIcon;
    
    const titleLower = title.toLowerCase();
    const config = Object.entries(iconConfig).find(([key]) => 
        titleLower.includes(key)
    );
    
    if (config) {
        const [_, { icon, color }] = config;
        const IconComponent = (LucideIcons as any)[icon];
        return <IconComponent className={`w-5 h-5 ${color}`} />;
    }
    
    // Default fallback
    const DefaultIcon = LucideIcons.BarChart3;
    return <DefaultIcon className="w-5 h-5 text-gray-500" />;
}

export default function IssueTrend({ 
    title, 
    number, 
    graph, 
    icon, 
    change_percentage,
    trend 
}: NumberCardProps) {
    return (
        <Card className="w-full  flex flex-col h-full ">
            <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
                <div className="p-2 rounded-full bg-gray-100">
                    {getIcon(title, icon)}
                </div>
                <CardTitle className="text-sm font-medium text-muted-foreground text-center">
                    {title}
                </CardTitle>
                <div className="text-4xl font-bold text-center font-mono tracking-tight">{number}</div>
                {(change_percentage || trend) && (
                    <div className={`flex items-center justify-center gap-1 text-sm ${
                        graph === 'grow' ? 'text-green-600' : 
                        graph === 'decline' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                        {trendIcons[graph]}
                        <span className="text-bold">{change_percentage || trend}</span>
                    </div>
                )}
            </div>
        </Card>
    )
}




