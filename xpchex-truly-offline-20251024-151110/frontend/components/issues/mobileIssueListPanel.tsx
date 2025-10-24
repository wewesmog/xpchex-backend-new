// components/MobileIssueListPanel.tsx

import React, { useState } from 'react';
import { Accordion } from "@/components/ui/accordion"; // Only Accordion is needed here

import MobIssueListItem from './MobIssueListItem'; // Import the parent component (MobIssueListItem)
import { IssueAnalysis } from '@/app/(dashboard)/issues/page';
// Define a consistent Issue interface (should match what your data source provides)


interface MobileIssueListPanelProps {
    issues: IssueAnalysis[]; // The list of all detected problems to display
}

export default function MobileIssueListPanel({ issues }: MobileIssueListPanelProps) {
    // This state controls which single AccordionItem is currently open.
    // It will be updated by the Accordion's onValueChange prop.
    const [openAccordionItemId, setOpenAccordionItemId] = useState<string | undefined>(undefined);

    // This state determines which item is "selected" for visual highlighting.
    // In the mobile view, we typically want the currently open accordion item to be highlighted.
    const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

    // This handler is called by the <Accordion> component whenever an item is opened or closed.
    const handleAccordionChange = (value: string) => {
        // 'value' will be the 'value' prop of the AccordionItem that just became open,
        // or an empty string if the currently open item was closed.
        setOpenAccordionItemId(value); // Update the state that controls the Accordion's 'value'
        setSelectedIssueId(value || null); // Keep selectedIssueId in sync for highlighting
    };

    return (
        // This container div can be used for responsive display (e.g., hidden on desktop)
        <div className=" w-full px-4 py-2">
            {/* <h1 className="text-2xl font-bold">first issue title: {issues[0].title}</h1> */}
            <Accordion
                type="single" // Ensures only one accordion item is open at a time
                collapsible // Allows the currently open item to be closed by clicking its trigger again
                value={openAccordionItemId} // Controls which AccordionItem is open
                onValueChange={handleAccordionChange} // Callback when an item opens/closes
                className="w-full space-y-4" // Adds vertical spacing between the individual accordion cards
            >
                {issues.map((issue, index) => (
                    <MobIssueListItem
                        key={issue.id}
                        issue={issue}
                        index={index}
                        isSelected={selectedIssueId === issue.id}
                    />
                ))}
            </Accordion>
        </div>
    );
}