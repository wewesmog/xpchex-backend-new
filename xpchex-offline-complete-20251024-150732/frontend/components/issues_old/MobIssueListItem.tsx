// components/MobIssueListItem.tsx

import React from 'react';
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from 'lucide-react';

import {
    AccordionContent,
    AccordionItem,   // Import AccordionItem here
    AccordionTrigger,
} from "@/components/ui/accordion";

import MobIssueListItemContent from './MobIssueListItemContent'; // Import the grandchild component
import { IssueAnalysis } from '@/app/(dashboard)/issues/page';
// Assuming this interface is consistent across your application


interface MobIssueListItemProps {
    issue: IssueAnalysis;
    isSelected: boolean; // For highlighting (controlled by the grandparent)
    index: number;
}

export default function MobIssueListItem({ issue, isSelected, index }: MobIssueListItemProps) {
    const trendIcon = (trend: "up" | "down" | "stable") => {
        if (trend === "up") return <ArrowUpIcon strokeWidth={3} className="w-4 h-4 text-green-500" />;
        if (trend === "down") return <ArrowDownIcon strokeWidth={3} className="w-4 h-4 text-red-500" />;
        return <ArrowRightIcon strokeWidth={3} className="w-4 h-4 text-gray-500" />;
    };

   

    return (
        <AccordionItem
            value={issue.id} // This value identifies this AccordionItem to its parent <Accordion>
            className={`border border-gray-200 rounded-md shadow-md overflow-hidden 
                        ${isSelected ? "" : "hover:bg-gray-50"}`} // Visual highlight
        >
            <AccordionTrigger
                // This entire area serves as the clickable trigger for the accordion
                className="flex items-center justify-between p-4 text-left font-semibold border-b border-gray-200"
            >
                {/* Content of the collapsed view (Issue Number, Title, Impact Score, Trend Icon) */}
                <div className="flex flex-col items-start flex-grow">
                    <h3 className={`${isSelected ? "text-xl font-bold" : "text-lg font-medium"} mb-1`}>
                        {/* {issue.id}. {issue.title} */}
                        {index+1}. {issue.title.length > 40 ? issue.title.slice(0, 37) + '...' : issue.title}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center">
                        Impact Score: <span className="font-bold text-blue-700 ml-1">{issue.impact_score} %</span>
                        <span className="ml-2">{trendIcon(issue.trend)}</span>
                    </p>
                </div>
                {/* The `AccordionTrigger` automatically adds and rotates the chevron arrow */}
            </AccordionTrigger>

            <AccordionContent>
                {/* Delegate rendering of the detailed content to the grandchild component */}
                <MobIssueListItemContent issue={issue} />
            </AccordionContent>
        </AccordionItem>
    );
}