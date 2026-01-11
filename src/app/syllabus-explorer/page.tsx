
'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { BookText, Download, Loader2, FileText } from 'lucide-react';
import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Syllabus } from '@/lib/types';
import { entc_2nd_year_4th_sem_syllabus, entc_2nd_year_3rd_sem_syllabus } from '@/lib/entc-syllabus';
import { slugify } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';


// Mock data - replace with actual data structure
const departments = [
    { id: 'cs', name: 'Computer Science', years: ['1st year', '2nd year', '3rd year', '4th year'] },
    { id: 'it', name: 'Information Technology', years: ['1st year', '2nd year', '3rd year', '4th year'] },
    { id: 'entc', name: 'Electronics and Telecommunication', years: ['1st year', '2nd year', '3rd year', '4th year'] },
    { id: 'elex', name: 'Electronics', years: ['1st year', '2nd year', '3rd year', '4th year'] },
    { id: 'mech', name: 'Mechanical Engineering', years: ['1st year', '2nd year', '3rd year', '4th year'] },
    { id: 'aids', name: 'AI & Data Science', years: ['1st year', '2nd year', '3rd year', '4th year'] },
    { id: 'aiml', name: 'AI & Machine Learning', years: ['1st year', '2nd year', '3rd year', '4th year'] },
];

const semesters = {
  '1st year': ['Semester 1', 'Semester 2'],
  '2nd year': ['Semester 3', 'Semester 4'],
  '3rd year': ['Semester 5', 'Semester 6'],
  '4th year': ['Semester 7', 'Semester 8'],
} as const;


export default function SyllabusExplorerPage() {
  const firestore = useFirestore();
  const syllabusesQuery = useMemoFirebase(() => {
      if (!firestore) return null;
      return collection(firestore, 'syllabuses');
  }, [firestore]);

  const { data: syllabuses, isLoading } = useCollection<Syllabus>(syllabusesQuery);

  const getSyllabusFor = (majorId: string, year: number) => {
    if (!syllabuses) return null;
    return syllabuses.find(s => s.major.toLowerCase() === majorId.toLowerCase() && s.year === year);
  }

  return (
    <>
      <header className="p-4 border-b border-border/40">
        <h1 className="text-2xl font-headline font-bold">Syllabus Explorer</h1>
      </header>
      <div className="flex-1 p-8 overflow-y-auto">
        <Accordion type="single" collapsible className="w-full space-y-4">
          {departments.map((dept) => (
            <AccordionItem value={dept.name} key={dept.name} className="border bg-card rounded-lg px-4">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">{dept.name}</AccordionTrigger>
              <AccordionContent>
                <Accordion type="single" collapsible className="space-y-2">
                  {dept.years.map(year => {
                    const yearNumber = parseInt(year.charAt(0));
                     
                    return (
                     <AccordionItem value={`${dept.name}-${year}`} key={year} className="border-t pt-2">
                       <AccordionTrigger>{year}</AccordionTrigger>
                       <AccordionContent>
                         <Accordion type="single" collapsible className="space-y-1">
                           {(semesters[year as keyof typeof semesters]).map(semester => {
                             const syllabusDoc = getSyllabusFor(dept.id, yearNumber);
                             
                             // Special cases for ENTC 2nd Year
                             const semesterNumber = parseInt(semester.split(' ')[1]);
                             const isEntc4thSem = dept.id === 'entc' && yearNumber === 2 && semesterNumber === 4;
                             const isEntc3rdSem = dept.id === 'entc' && yearNumber === 2 && semesterNumber === 3;
                             const syllabusData = isEntc4thSem ? entc_2nd_year_4th_sem_syllabus : isEntc3rdSem ? entc_2nd_year_3rd_sem_syllabus : null;

                             return (
                               <AccordionItem value={`${dept.name}-${year}-${semester}`} key={semester} className="border-t pt-1">
                                 <AccordionTrigger>{semester}</AccordionTrigger>
                                 <AccordionContent>
                                   {isLoading ? (
                                     <div className="flex items-center gap-2 p-4 text-sm text-muted-foreground">
                                       <Loader2 className="h-4 w-4 animate-spin" />
                                       <span>Loading syllabus...</span>
                                     </div>
                                   ) : syllabusData ? (
                                      <div className="p-4 space-y-4">
                                        <h3 className="font-headline text-lg text-primary mb-2">Subjects for {semester}</h3>
                                        <Accordion type="multiple" className="space-y-2">
                                          {syllabusData.subjects.map(subject => (
                                            <AccordionItem value={subject.code} key={subject.code} className="border-t pt-2">
                                              <AccordionTrigger className="text-base font-semibold">{subject.code}: {subject.name}</AccordionTrigger>
                                              <AccordionContent className="pl-4 pt-2">
                                                <div className="space-y-4">
                                                  <div>
                                                      <h4 className="font-semibold text-muted-foreground mb-2">Units</h4>
                                                      {subject.units ? (
                                                        <div className="space-y-2">
                                                          {subject.units.map(unit => (
                                                            <Link
                                                              key={unit.title}
                                                              href={`/syllabus-explorer/${subject.code}/${slugify(unit.title)}`}
                                                              className="block p-3 border rounded-md hover:bg-accent transition-colors"
                                                            >
                                                              <p className="font-semibold">{unit.title}</p>
                                                            </Link>
                                                          ))}
                                                        </div>
                                                      ) : (
                                                        <p className="text-sm text-muted-foreground p-2">Unit details not available for this subject.</p>
                                                      )}
                                                  </div>
                                                  <Separator />
                                                  <div>
                                                      <h4 className="font-semibold text-muted-foreground mb-2">Resources</h4>
                                                      <Button asChild>
                                                          <Link href={`/previous-papers/${subject.code}`}>
                                                              <FileText className="mr-2" />
                                                              Try Previous Year Paper
                                                          </Link>
                                                      </Button>
                                                  </div>
                                                </div>
                                              </AccordionContent>
                                            </AccordionItem>
                                          ))}
                                        </Accordion>
                                      </div>
                                   ) : syllabusDoc ? (
                                     <div className="p-4 border rounded-md bg-background/50">
                                       <h3 className="font-headline text-lg text-primary mb-2">{syllabusDoc.courseName}</h3>
                                       <p className="text-sm text-muted-foreground mb-4">
                                         Full syllabus PDF for {semester} is available for download.
                                       </p>
                                       <Button asChild>
                                         <a href={syllabusDoc.pdfStorageLocation} target="_blank" rel="noopener noreferrer">
                                           <Download className="mr-2" /> Download PDF
                                         </a>
                                       </Button>
                                     </div>
                                   ) : (
                                     <p className="text-sm text-muted-foreground p-4">Syllabus not yet available for {dept.name} - {year} - {semester}.</p>
                                   )}
                                 </AccordionContent>
                               </AccordionItem>
                             );
                           })}
                         </Accordion>
                       </AccordionContent>
                     </AccordionItem>
                    )
                  })}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="fixed bottom-10 right-10">
          <Button asChild size="lg">
            <Link href="/nexus-ai">
              <BookText className="mr-2"/>
              Ask Gemini about Syllabus
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
