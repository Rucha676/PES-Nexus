
import React from 'react';
import { PreviousPaperClientPage, papers } from './client-page';
import { entc_2nd_year_3rd_sem_syllabus, entc_2nd_year_4th_sem_syllabus } from '@/lib/entc-syllabus';

const allSubjects = [
  ...entc_2nd_year_3rd_sem_syllabus.subjects,
  ...entc_2nd_year_4th_sem_syllabus.subjects
];

export default function PreviousPaperPage({ params }: { params: Promise<{ subjectCode: string }> }) {
  const { subjectCode } = React.use(params);
  const subject = allSubjects.find(s => s.code === subjectCode);
  const subjectPapers = papers[subjectCode] || [];

  return <PreviousPaperClientPage subjectCode={subjectCode} subject={subject} subjectPapers={subjectPapers} />;
}
