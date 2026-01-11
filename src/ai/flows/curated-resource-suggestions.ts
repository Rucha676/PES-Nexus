'use server';

/**
 * @fileOverview A flow for providing curated YouTube keywords and reference book suggestions for a given subject from the syllabus.
 *
 * - getCuratedResourceSuggestions - A function that takes syllabus subject content as input and returns curated resource suggestions.
 * - CuratedResourceSuggestionsInput - The input type for the getCuratedResourceSuggestions function.
 * - CuratedResourceSuggestionsOutput - The return type for the getCuratedResourceSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CuratedResourceSuggestionsInputSchema = z.object({
  syllabusSubject: z.string().describe('The content of the syllabus subject to get resource suggestions for, including units and topics.'),
});
export type CuratedResourceSuggestionsInput = z.infer<typeof CuratedResourceSuggestionsInputSchema>;

const CuratedResourceSuggestionsOutputSchema = z.object({
  youtubeKeywords: z.array(z.string()).describe('Curated YouTube search keywords for the syllabus subject.'),
  referenceBooks: z.array(z.string()).describe('Curated reference book suggestions (including author) for the syllabus subject.'),
});
export type CuratedResourceSuggestionsOutput = z.infer<typeof CuratedResourceSuggestionsOutputSchema>;

export async function getCuratedResourceSuggestions(
  input: CuratedResourceSuggestionsInput
): Promise<CuratedResourceSuggestionsOutput> {
  return curatedResourceSuggestionsFlow(input);
}

const curatedResourceSuggestionsPrompt = ai.definePrompt({
  name: 'curatedResourceSuggestionsPrompt',
  input: {schema: CuratedResourceSuggestionsInputSchema},
  output: {schema: CuratedResourceSuggestionsOutputSchema},
  prompt: `You are an AI assistant designed to provide curated YouTube keywords and reference book suggestions for university engineering students, given the content of a specific subject from their syllabus.

  Syllabus Subject Content: 
  {{{syllabusSubject}}}

  Based on the content of this subject, provide 3 highly relevant YouTube search keywords and 3 specific reference book recommendations (including authors if possible).
  `,
});

const curatedResourceSuggestionsFlow = ai.defineFlow(
  {
    name: 'curatedResourceSuggestionsFlow',
    inputSchema: CuratedResourceSuggestionsInputSchema,
    outputSchema: CuratedResourceSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await curatedResourceSuggestionsPrompt(input);
    return output!;
  }
);
