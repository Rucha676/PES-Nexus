'use client';

import { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { bulkSyllabusExplanation } from '@/ai/flows/bulk-syllabus-explanation';
import { syllabus } from '@/lib/syllabus';
import { BookText } from 'lucide-react';
import Link from 'next/link';

// Define a type for the Unit object based on entc-syllabus data structure
type SyllabusUnit = {
    title: string;
    topics: string[];
};

async function getExplanations(topics: string[]): Promise<string[]> {
    if (!topics || topics.length === 0) {
        return [];
    }
    try {
        const result = await bulkSyllabusExplanation({
            topics: topics,
            syllabusContent: syllabus.content,
        });
        if (result.explanations && result.explanations.length === topics.length) {
            return result.explanations;
        }
        throw new Error("AI response did not match the number of topics.");
    } catch (error) {
        console.error("Failed to fetch bulk explanations:", error);
        return topics.map(() => "Could not load explanation. Please try again later.");
    }
}

export function UnitDetailsClientPage({ unit }: { unit: SyllabusUnit }) {
  const [explanations, setExplanations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchExplanations() {
      if (!unit.topics || unit.topics.length === 0) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      const fetchedExplanations = await getExplanations(unit.topics);
      setExplanations(fetchedExplanations);
      setIsLoading(false);
    }
    fetchExplanations();
  }, [unit.topics]);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold font-headline mb-4 text-primary">Topics & Explanations</h2>
      <Accordion type="multiple" className="w-full space-y-2">
        {unit.topics.map((topic, index) => (
          <AccordionItem value={`item-${index}`} key={index} className="border bg-card rounded-lg px-4">
            <AccordionTrigger className="text-base font-semibold hover:no-underline text-left">{topic}</AccordionTrigger>
            <AccordionContent>
              <div className="prose prose-invert text-sm max-w-none pt-2 border-t border-border/40">
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ) : (
                  <p>{explanations[index]}</p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-12 text-center">
        <h3 className="text-xl font-headline font-semibold">Still have questions?</h3>
        <p className="text-muted-foreground mt-2 mb-4">Our AI Tutor can provide more detailed answers.</p>
        <Button asChild size="lg">
          <Link href="/nexus-ai">
            <BookText className="mr-2"/>
            Ask Nexus AI
          </Link>
        </Button>
      </div>
    </div>
  );
}
