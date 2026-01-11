'use server';
/**
 * @fileOverview A flow for generating explanations for multiple syllabus topics at once.
 *
 * - bulkSyllabusExplanation - A function that handles the bulk syllabus explanation process.
 * - BulkSyllabusExplanationInput - The input type for the function.
 * - BulkSyllabusExplanationOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BulkSyllabusExplanationInputSchema = z.object({
  topics: z.array(z.string()).describe('The list of autonomous topics to explain.'),
  syllabusContent: z.string().describe('The content of the PESMCOE syllabus to ground the explanations.'),
});
export type BulkSyllabusExplanationInput = z.infer<typeof BulkSyllabusExplanationInputSchema>;

const BulkSyllabusExplanationOutputSchema = z.object({
  explanations: z.array(z.string()).describe('An array of explanations, one for each topic, in the same order as the input topics.'),
});
export type BulkSyllabusExplanationOutput = z.infer<typeof BulkSyllabusExplanationOutputSchema>;

export async function bulkSyllabusExplanation(input: BulkSyllabusExplanationInput): Promise<BulkSyllabusExplanationOutput> {
  return bulkSyllabusExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'bulkSyllabusExplanationPrompt',
  input: {schema: BulkSyllabusExplanationInputSchema},
  output: {schema: BulkSyllabusExplanationOutputSchema},
  prompt: `You are an expert AI tutor for university engineering students. Your task is to explain complex technical topics in a clear, easy-to-understand way.

A student has asked for explanations for several topics from their syllabus. For each topic provided below, generate a concise but thorough explanation suitable for a second-year engineering student. Do not just rephrase the syllabus content. Explain the concept in your own words, covering the 'what', 'why', and 'how'. Use the provided syllabus content for context only.

Return the explanations as an array of strings in the 'explanations' field, in the exact same order as the input topics.

Syllabus Content for Context:
{{{syllabusContent}}}

Topics to Explain:
{{#each topics}}
- {{{this}}}
{{/each}}
`,
});

const bulkSyllabusExplanationFlow = ai.defineFlow(
  {
    name: 'bulkSyllabusExplanationFlow',
    inputSchema: BulkSyllabusExplanationInputSchema,
    outputSchema: BulkSyllabusExplanationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
