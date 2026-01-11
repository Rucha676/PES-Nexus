'use server';

import { getCuratedResourceSuggestions } from '@/ai/flows/curated-resource-suggestions';
import type { CuratedResourceSuggestionsOutput } from '@/ai/flows/curated-resource-suggestions';
import { syllabusExplanation } from '@/ai/flows/syllabus-explanation';
import { syllabus } from '@/lib/syllabus';
import { z } from 'zod';
import { entc_2nd_year_3rd_sem_syllabus, entc_2nd_year_4th_sem_syllabus } from '@/lib/entc-syllabus';

const explainTopicSchema = z.object({
  topic: z.string().min(3, { message: 'Topic must be at least 3 characters long.' }),
});

type ExplainState = {
  message: string;
  explanation?: string;
  errors?: {
    topic?: string[];
  };
  error?: string | null;
}

export async function explainTopicAction(prevState: ExplainState, formData: FormData): Promise<ExplainState> {
  const validatedFields = explainTopicSchema.safeParse({
    topic: formData.get('topic'),
  });

  if (!validatedFields.success) {
    return {
      message: 'validation_error',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await syllabusExplanation({
      topic: validatedFields.data.topic,
      syllabusContent: syllabus.content,
    });
    return { message: 'success', explanation: result.explanation };
  } catch (error) {
    console.error(error);
    return { message: 'error', error: 'Failed to get explanation. Please try again.' };
  }
}


const getResourcesSchema = z.object({
  subject: z.string().min(1, { message: 'Please select a subject.' }),
});

type ResourceState = {
  message: string;
  resources?: CuratedResourceSuggestionsOutput | null;
  errors?: {
    subject?: string[];
  };
  error?: string | null;
}

const allSubjects = [
  ...entc_2nd_year_3rd_sem_syllabus.subjects,
  ...entc_2nd_year_4th_sem_syllabus.subjects
];

export async function getResourcesAction(prevState: ResourceState, formData: FormData): Promise<ResourceState> {
  const validatedFields = getResourcesSchema.safeParse({
    subject: formData.get('subject'),
  });

  if (!validatedFields.success) {
    return {
      message: 'validation_error',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const subjectCode = validatedFields.data.subject;
  const subject = allSubjects.find(s => s.code === subjectCode);

  if (!subject) {
      return { message: 'error', error: 'Could not find the selected subject.' };
  }

  // Create a string representation of the subject's units and topics
  const subjectContent = subject.units?.map(unit => 
    `Unit: ${unit.title}\nTopics:\n- ${unit.topics.join('\n- ')}`
  ).join('\n\n') || subject.name;


  try {
    const result = await getCuratedResourceSuggestions({
      syllabusSubject: subjectContent,
    });
    return { message: 'success', resources: result };
  } catch (error) {
    console.error(error);
    return { message: 'error', error: 'Failed to get resources. Please try again.' };
  }
}
