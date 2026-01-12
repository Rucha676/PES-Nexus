
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import React from 'react';
import type { entc_2nd_year_3rd_sem_syllabus } from '@/lib/entc-syllabus';
import type { PaperContent } from '@/lib/types';

// This is the correct way to derive the Subject type
type Subject = (typeof entc_2nd_year_3rd_sem_syllabus.subjects)[0];

function QuestionPaper({ content }: { content: PaperContent }) {
    return (
        <div className="bg-white text-black p-8 rounded-lg shadow-lg font-serif">
            <div className="text-center border-b-2 border-black pb-4 mb-6">
                <h2 className="text-xl font-bold">{content.college}</h2>
                <h3 className="text-lg font-semibold">(An Autonomous Institute Affiliated to Savitribai Phule Pune University)</h3>
                <p className="text-md mt-2">S.Y. B.Tech (2024 Pattern) (Semester III)</p>
                <p className="text-md font-medium">Program: E&amp;TC Engineering Technology</p>
                <h3 className="text-lg font-semibold mt-4">{content.title}</h3>
                <h3 className="text-lg font-bold mt-1">{content.courseInfo}</h3>
            </div>
            <div className="flex justify-between font-semibold mb-6">
                <span>Time: {content.time}</span>
                <span>Max. Marks: {content.totalMarks}</span>
            </div>
            <div className="mb-6">
                <h4 className="font-bold mb-2">Instructions to the candidate:</h4>
                <ol className="list-decimal list-inside text-sm space-y-1">
                    {content.instructions.map((inst, idx) => (
                        <li key={idx}>{inst}</li>
                    ))}
                </ol>
            </div>

            {content.sections.map((section, idx) => (
                <div key={idx} className="mb-8">
                    <div className="flex justify-between items-baseline mb-4 border-t pt-4">
                        <h4 className="text-lg font-bold">{section.title}</h4>
                        <p className="italic text-sm">{section.instructions}</p>
                    </div>
                    {section.questions.map((q) => (
                        <div key={q.number} className="flex justify-between mb-3 items-start">
                            <p className="pr-4"><strong className="mr-2">{q.number}</strong>{q.text}</p>
                            <span className="font-bold whitespace-nowrap">{q.marks}</span>
                        </div>
                    ))}
                </div>
            ))}
             <div className="border-t-2 border-black text-center pt-2 mt-8 font-bold">
                *** END OF PAPER ***
            </div>
        </div>
    )
}

// Props are now correctly defined to accept data from the server
interface PreviousPaperClientPageProps {
  subjectCode: string;
  subject?: Subject;
  subjectPapers: PaperContent[];
}

export function PreviousPaperClientPage({ subjectCode, subject, subjectPapers }: PreviousPaperClientPageProps) {
  if (!subject) {
      return (
          <div className="flex-1 p-8">
              <h1 className="text-2xl font-bold">Subject Not Found</h1>
              <p>The subject with code {subjectCode} does not exist.</p>
          </div>
      )
  }

  return (
    <div className="flex flex-col h-screen bg-muted/20">
      <header className="p-4 border-b border-border/40 flex items-center gap-4 bg-background sticky top-0 z-10">
        <Button variant="outline" size="icon" asChild>
            <Link href="/syllabus-explorer">
                <ArrowLeft />
            </Link>
        </Button>
        <div>
            <p className="text-sm text-muted-foreground">Previous Year Paper</p>
            <h1 className="text-2xl font-headline font-bold">{subject.name} ({subject.code})</h1>
        </div>
      </header>
      <div className="flex-1 p-8 overflow-y-auto">
        <Card className="max-w-4xl mx-auto bg-background/80">
            <CardHeader>
                <CardTitle>Exam Paper ({subjectPapers?.[0]?.year || 'N/A'})</CardTitle>
            </CardHeader>
            <CardContent>
                {subjectPapers && subjectPapers.length > 0 ? (
                    <div className="space-y-8">
                        {subjectPapers.map((paperContent, index) => (
                           <QuestionPaper key={index} content={paperContent} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <h2 className="text-2xl font-bold">Coming Soon!</h2>
                        <p className="text-muted-foreground mt-2">Previous year papers for this subject are not yet available.</p>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
