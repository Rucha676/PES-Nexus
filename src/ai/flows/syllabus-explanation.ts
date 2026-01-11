'use server';
/**
 * @fileOverview A syllabus explanation AI agent.
 *
 * - syllabusExplanation - A function that handles the syllabus explanation process.
 * - SyllabusExplanationInput - The input type for the syllabusExplanation function.
 * - SyllabusExplanationOutput - The return type for the syllabusExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SyllabusExplanationInputSchema = z.object({
  topic: z.string().describe('The specific autonomous topic to explain.'),
  syllabusContent: z.string().describe('The content of the PESMCOE syllabus to ground the explanation.'),
});
export type SyllabusExplanationInput = z.infer<typeof SyllabusExplanationInputSchema>;

const SyllabusExplanationOutputSchema = z.object({
  explanation: z.string().describe('The explanation of the topic grounded in the syllabus.'),
});
export type SyllabusExplanationOutput = z.infer<typeof SyllabusExplanationOutputSchema>;

export async function syllabusExplanation(input: SyllabusExplanationInput): Promise<SyllabusExplanationOutput> {
  return syllabusExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'syllabusExplanationPrompt',
  input: {schema: SyllabusExplanationInputSchema},
  output: {schema: SyllabusExplanationOutputSchema},
  prompt: `You are an AI assistant helping students understand autonomous topics based on the PESMCOE syllabus.\n\nProvide a clear and concise explanation of the following topic, grounded in the provided syllabus content.\n\nTopic: {{{topic}}}\nSyllabus Content: {{{syllabusContent}}}`,
});

const syllabusExplanationFlow = ai.defineFlow(
  {
    name: 'syllabusExplanationFlow',
    inputSchema: SyllabusExplanationInputSchema,
    outputSchema: SyllabusExplanationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
