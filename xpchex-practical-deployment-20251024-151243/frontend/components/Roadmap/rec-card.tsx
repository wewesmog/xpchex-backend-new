// rec-card.tsx

// Displays an individual AI recommendation card

import React from 'react'
import { Recommendation } from '@/app/(dashboard)/roadmap/data'

import ReviewSnippet from '@/components/issues/issueDetailsPanel/children/KeyReviewSnippets/children/ReviewSnippet'
import { Button } from '../ui/button'

// Import the UI components
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card" 
import { Badge } from "@/components/ui/badge"
import { Separator } from '../ui/separator'

// import icons
import { CalendarDays, Shirt } from 'lucide-react';

// Accordion for related issues links
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

// Priority Badge Component
const PriorityBadge = ({ priority }: { priority: "high" | "medium" | "low" }) => {
  const variants = {
    high: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
    medium: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
    low: "bg-green-500/10 text-green-500 hover:bg-green-500/20"
  };
  
  return (
    <Badge variant="outline" className={`text-xs ${variants[priority]}`}>
      {priority}
    </Badge>
  );
};


const EffortBadge = ({ effortLevel }: { effortLevel: "low" | "medium" | "high" }) => {
    let sizeText = '';
    let iconSize = 24; // Default size for 'S' - might need to be slightly larger to fit text
    let bgColor = '';   // For the overall badge background color
    let textColor = ''; // For the overall badge text/icon color
    let innerTextColor = ''; // Color specifically for the 'S', 'M', 'L' text inside the icon

    switch (effortLevel) {
        case 'low':
            sizeText = 'S';
            iconSize = 24; // Base icon size
            bgColor = 'bg-green-100';
            textColor = 'text-green-800';
            innerTextColor = 'text-green-800'; // Match badge text color
            break;
        case 'medium':
            sizeText = 'M';
            iconSize = 28; // Slightly larger icon for 'M'
            bgColor = 'bg-yellow-100';
            textColor = 'text-yellow-800';
            innerTextColor = 'text-yellow-800';
            break;
        case 'high':
            sizeText = 'L';
            iconSize = 32; // Even larger icon for 'L'
            bgColor = 'bg-red-100';
            textColor = 'text-red-800';
            innerTextColor = 'text-red-800';
            break;
        default:
            return null;
    }

    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${bgColor} ${textColor}`}
            title={`Effort: ${effortLevel.charAt(0).toUpperCase() + effortLevel.slice(1)}`}
        >
            {/* Relative container for the icon and overlaid text */}
            <div className="relative flex items-center justify-center" style={{ width: iconSize, height: iconSize }}>
                {/* The Shirt icon */}
                <Shirt className="absolute" size={iconSize} strokeWidth={2} />
                
                {/* The overlaid text */}
                <span 
                    className={`absolute text-center font-bold ${innerTextColor}`}
                    style={{ 
                        fontSize: `${iconSize * 0.5}px`, // Adjust font size relative to icon size
                        lineHeight: 1, // Prevent extra line height
                    }}
                >
                    {sizeText}
                </span>
            </div>
        </span>
    );
};

const EffortDaysDisplay = ({ days }: { days: number }) => {
    if (typeof days !== 'number' || days <= 0) return null;

    return (
        <span className="inline-flex items-center text-sm text-gray-600">
            <CalendarDays className="h-4 w-4 mr-1" /> {/* Adjust size as needed */}
            {days} Day{days !== 1 ? 's' : ''}
        </span>
    );
};

// Metadata Item Component
const MetadataItem = ({ label, value }: { label?: string; value: string | number | React.ReactNode }) => (
  <div className="flex flex-row gap-4  p-2 items-center">
    <span className="text-xs text-muted-foreground ">{label}</span>
    <span className="text-sm font-medium">{value}</span>
  </div>
);

// RecCard props
type RecCardProps = {
    rec: Recommendation
}

export default function RecCard({ rec }: RecCardProps) {
    return (
        <Card className="w-full hover:shadow-lg transition-shadow">
            <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-muted-foreground">{rec.issue_icon}</span>
                        <div>
                            <h3 className="text-lg font-semibold leading-none">{rec.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{rec.type}</p>
                        </div>
                    </div>
                    <PriorityBadge priority={rec.priority} />
                </div>
                <CardDescription className="text-sm">
                    {rec.ai_rationale}
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Expected Outcome */}
                <div className=" bg-card p-4 space-y-4">
                    <div className="border-b pb-3">
                        <h4 className="text-sm font-medium">Expected Outcome</h4>
                        <p className="text-sm text-muted-foreground mt-1">{rec.expected_outcome}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <MetadataItem label="Total Estimated Effort :" value={<EffortBadge effortLevel={rec.estimated_effort || "low"} />} />
                        <MetadataItem label="Total Estimated Timeline :" value={<EffortDaysDisplay days={rec.estimated_effort_days || 0} />} />
                    </div>
                </div>
                
                {/* Recommended Actions */}
                <div className="space-y-3">
                    <h4 className="text-sm font-medium">Recommended Actions</h4>
                    <ol className="ml-4 space-y-2 list-decimal">
                        {rec.recommended_actions.map((action, index) => (
                            <li key={index} className="text-sm text-muted-foreground pl-2">
                                <span className="font-medium">{action.action_title}</span>
                                <p className="text-xs text-muted-foreground">{action.action_description}</p> 
                                <div className="flex flex-row gap-4">
                                    <MetadataItem  value={<EffortBadge effortLevel={action.estimated_effort || "low"} />} />
                                    <MetadataItem  value={<EffortDaysDisplay days={action.estimated_effort_days || 0} />} />
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
                        
                {/* Related Issues */}
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="related-issues">
                        <AccordionTrigger className="text-sm font-medium">
                            Related Issues
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-2 pt-2">
                                {rec.linked_analysis_ids.map((id) => (
                                    <div key={id} className="text-sm text-muted-foreground p-2 rounded-md bg-muted/40">
                                        {id}
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
                <div className="w-full">
                    <ReviewSnippet reviewID={rec.representative_review_id || ""} />
                </div>
                <Button 
                    variant="outline" 
                    className="self-end hover:bg-muted"
                >
                    View All Reviews
                </Button>
            </CardFooter>
        </Card>
    )
}