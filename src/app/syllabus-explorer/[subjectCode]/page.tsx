
import React from 'react';
import { entc_2nd_year_3rd_sem_syllabus, entc_2nd_year_4th_sem_syllabus } from '@/lib/entc-syllabus';
import { SubjectClientPage } from './subject-client-page';
import { notFound } from 'next/navigation';


const allSubjects = [
  ...entc_2nd_year_3rd_sem_syllabus.subjects,
  ...entc_2nd_year_4th_sem_syllabus.subjects
];

type SubjectDetailsPageProps = {
  params: Promise<{ subjectCode: string }>;
};

export default async function SubjectDetailsPage({ params }: SubjectDetailsPageProps) {
  const { subjectCode } = await params;
  
  // Find the subject on the server
  const subject = allSubjects.find(s => s.code === subjectCode);

  if (!subject) {
    notFound();
  }

  // Render the Client Component and pass the data as props
  return <SubjectClientPage subject={subject} />;
}
