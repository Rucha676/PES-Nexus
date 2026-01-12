import React from 'react';
import { PreviousPaperClientPage } from './client-page';

export default function PreviousPaperPage({ params }: { params: Promise<{ subjectCode: string }> }) {
  const { subjectCode } = React.use(params);

  return <PreviousPaperClientPage subjectCode={subjectCode} />;
}
