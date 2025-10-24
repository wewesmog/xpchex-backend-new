// components/ReviewSnippet.tsx
import React, { useRef, useEffect, useState } from 'react'; // <-- Import useState, useRef, useEffect

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button'; // Not used in this snippet but kept from previous
import { StarIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useReviewsStore } from '@/app/stores/reviews'; 
import { Review } from '@/app/stores/reviews'; // Import Review type
import Image from 'next/image';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type ReviewSnippetProps = {
  reviewID: string; 
}

export default function ReviewSnippet({reviewID}: ReviewSnippetProps) {
  const reviews = useReviewsStore(state => state.reviews)
  const review = reviews.find(r => r.id === reviewID);

  // State to track if the accordion is open
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  // Ref for the paragraph element to measure its height
  const textRef = useRef<HTMLParagraphElement>(null);
  // State to determine if the text actually needs truncation (i.e., if accordion is needed)
  const [needsTruncation, setNeedsTruncation] = useState(false);

  // Effect to measure text and determine if truncation is occurring
  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        const { scrollHeight, clientHeight } = textRef.current;
        setNeedsTruncation(scrollHeight > clientHeight);
      }
    };

    // Initial check
    checkTruncation();

    // Add resize listener to recheck on window resize
    window.addEventListener('resize', checkTruncation);

    // Cleanup
    return () => window.removeEventListener('resize', checkTruncation);
  }, [review?.text, reviewID]); // Re-run if review text or ID changes

  if (!review) {
    console.log("Review not found for ID:", reviewID);
    return null;
  }

  // Helper for rendering stars
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={`star-${i}`} className="w-4 h-4 text-green-500 fill-green-500" />);
    }
    for (let i = fullStars; i < 5; i++) {
        stars.push(<StarIcon key={`empty-star-${i}`} className="w-4 h-4 text-gray-300" />);
    }
    return stars;
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <Card>
        <CardHeader>
          <div className="flex flex-row gap-2 items-center">
            {review?.author_image_url && (
              <Image 
                src={review.author_image_url} 
                alt={review.author || 'Author'} 
                width={30} 
                height={30} 
                className="rounded-full object-cover" 
              />
            )}
            <CardTitle className="text-sm font-normal">{review.author}</CardTitle>
          </div>
          <CardDescription className="flex justify-between py-2">
            {/* Stars & Date */}
            <div className="flex flex-row gap-4 items-center">
              <div className="flex flex-row gap-1 items-center">
                {renderStars(review.rating)}
              </div>
              <p className="text-xs text-muted-foreground">{review.date}</p>
            </div>

            {/* Conditional badge background color */}
            <Badge variant="default" className={`text-xs ${review.sentiment === "positive" ? "bg-green-500 text-white" : review.sentiment === "negative" ? "bg-red-500 text-white" : "bg-gray-500 text-white"}`}>{review.sentiment}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Display the truncated review text ONLY if accordion is not open */}
          {!isAccordionOpen && (
            <p ref={textRef} className="line-clamp-2 text-sm text-gray-700">
              {review.text}
            </p>
          )}

          {/* Render the Accordion ONLY if the text actually needs truncation */}
          {needsTruncation && (
            <Accordion 
              type="single" 
              collapsible 
              onValueChange={(value) => setIsAccordionOpen(value.length > 0)}
            >
              <AccordionItem value="item-1" className="border-none">
                <AccordionTrigger className="text-green-600 hover:text-blue-800 text-sm py-2">
                  {isAccordionOpen ? "Show Less" : "View Full Review"}
                </AccordionTrigger>
                <AccordionContent className="pt-2 text-sm text-gray-800">
                  {review.text}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  )
}