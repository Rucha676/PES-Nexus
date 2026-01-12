
'use client';

import { BookText, ChevronRight, FileText, Home } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { slugify } from '@/lib/utils';
import type { entc_2nd_year_3rd_sem_syllabus } from '@/lib/entc-syllabus';

type Subject = (typeof entc_2nd_year_3rd_sem_syllabus.subjects)[0];

interface SubjectClientPageProps {
    subject: Subject;
}

export function SubjectClientPage({ subject }: SubjectClientPageProps) {
    return (
    <>
      <header className="p-4 border-b border-border/40">
         <div className="flex items-center text-sm text-muted-foreground">
           <Link href="/syllabus-explorer" className="hover:underline">Syllabus Explorer</Link>
           <ChevronRight className="h-4 w-4 mx-1" />
           <span className="text-foreground">{subject.name}</span>
         </div>
        <h1 className="text-3xl font-headline font-bold mt-2">{subject.name}</h1>
        <p className="text-lg text-muted-foreground">Course Code: {subject.code}</p>
      </header>
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Syllabus Units</CardTitle>
                    <CardDescription>Select a unit to view its topics and AI-powered explanations.</CardDescription>
                </CardHeader>
                <CardContent>
                     {subject.units && subject.units.length > 0 ? (
                        <div className="space-y-2">
                          {subject.units.map(unit => (
                            <Link
                              key={unit.title}
                              href={`/syllabus-explorer/${subject.code}/${slugify(unit.title)}`}
                              className="block p-4 border rounded-md hover:bg-accent transition-colors"
                            >
                              <p className="font-semibold">{unit.title}</p>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground p-4 text-center">Unit details are not available for this subject.</p>
                      )}
                </CardContent>
            </Card>

            <div className="space-y-8">
                 <Card>
                    <CardHeader>
                        <CardTitle>Previous Year Papers</CardTitle>
                        <CardDescription>Test your knowledge by attempting previous exam papers for this subject.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Button asChild className="w-full">
                            <Link href={`/previous-papers/${subject.code}`}>
                                <FileText className="mr-2" />
                                View Question Papers
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Ask Nexus AI</CardTitle>
                        <CardDescription>Have a specific question about {subject.name}? Get instant help from our AI tutor.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Button asChild className="w-full" variant="outline">
                            <Link href="/nexus-ai">
                                <BookText className="mr-2" />
                                Go to AI Tutor
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </>
    )
}
