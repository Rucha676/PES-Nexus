
import { entc_2nd_year_4th_sem_syllabus, entc_2nd_year_3rd_sem_syllabus } from '@/lib/entc-syllabus';
import { slugify } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { UnitDetailsClientPage } from './client-page';
import React from 'react';
import { notFound } from 'next/navigation';

const allSubjects = [
    ...entc_2nd_year_4th_sem_syllabus.subjects,
    ...entc_2nd_year_3rd_sem_syllabus.subjects
];

// This is a Server Component, now correctly typed.
export default async function UnitDetailsPage({ params }: { params: { subjectCode: string; unitSlug: string } }) {
  const { subjectCode, unitSlug } = params;

  // Find the subject on the server
  const subject = allSubjects.find(
    s => s.code === subjectCode
  );

  if (!subject) {
    notFound();
  }

  // Find the unit WITHIN the found subject.
  const unit = subject?.units?.find(u => slugify(u.title) === unitSlug);

  if (!unit || !unit.topics) {
    notFound();
  }

  return (
    <>
      <header className="p-4 border-b border-border/40">
         <div className="flex items-center text-sm text-muted-foreground">
           <Link href="/syllabus-explorer" className="hover:underline">Syllabus Explorer</Link>
           <ChevronRight className="h-4 w-4 mx-1" />
           <Link href={`/syllabus-explorer/${subject.code}`} className="hover:underline">{subject.name}</Link>
           <ChevronRight className="h-4 w-4 mx-1" />
           <span className="text-foreground">{unit.title}</span>
         </div>
        <h1 className="text-3xl font-headline font-bold mt-2">{unit.title}</h1>
        <p className="text-lg text-muted-foreground">{subject.name} ({subject.code})</p>
      </header>
      <div className="flex-1 p-8 overflow-y-auto">
        {/* Render the client component, passing the found unit data as a prop */}
        <UnitDetailsClientPage unit={unit} />
      </div>
    </>
  );
}
