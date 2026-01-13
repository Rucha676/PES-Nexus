
import React from 'react';
import { PreviousPaperClientPage } from './client-page';
import { entc_2nd_year_3rd_sem_syllabus, entc_2nd_year_4th_sem_syllabus } from '@/lib/entc-syllabus';
import { notFound } from 'next/navigation';
import type { PaperContent } from '@/lib/types';

const allSubjects = [
  ...entc_2nd_year_3rd_sem_syllabus.subjects,
  ...entc_2nd_year_4th_sem_syllabus.subjects
];

const papers: Record<string, PaperContent[]> = {
    'ETE01203': [ // Digital Systems
        {
            year: 2025,
            college: "Progressive Education's Society's Modern College of Engineering",
            title: 'Semester End Examination (SEE)',
            courseInfo: 'Digital Systems (Course Code: ETE01203)',
            time: '2 hrs 30 Min',
            totalMarks: 60,
            instructions: [
                'All Questions are compulsory',
                'Neat diagrams must be drawn wherever necessary.',
                'Figures to the right side indicate full marks.',
                'Assume suitable data if necessary.',
                'Justify your answer with an example wherever necessary.'
            ],
            sections: [
                {
                    title: 'Q.1.',
                    instructions: 'Attempt Any One of the following',
                    questions: [
                        { number: 'A)', text: 'Distinguish between combinational and Sequential Circuits', marks: '[5]' },
                        { number: 'B)', text: "Solve the following examples with 1's complement method. 1. (1011100),(1011110), 2. (1111100)-(1011111)", marks: '[5]' },
                        { number: 'C)', text: 'Design 3 bit Binary code to Grey converter and realize the converter using gates', marks: '[5]' },
                    ]
                },
                {
                    title: 'Q.2.',
                    instructions: 'Attempt Any One of the following',
                    questions: [
                        { number: 'A)', text: 'State the rules for simplifying 4 variable logic function using K map', marks: '[5]' },
                        { number: 'B)', text: 'Solve the given function to minimized form of expression and realize using NAND gate. F(A, B,C,D) = Σm (0,2,5,8,11,15)+ d(1,7,14)', marks: '[5]' },
                        { number: 'C)', text: 'Solve the given function to minimized form of expression using Quine Mccluskey method. F(A,B,C,D)= Σm (2,4,5,9,12,13)', marks: '[5]' },
                    ]
                },
                {
                    title: 'Q.3.',
                    instructions: 'Attempt Any One of the following',
                    questions: [
                        { number: 'A)', text: 'List the difference between Demultiplexer and Decoder', marks: '[5]' },
                        { number: 'B)', text: 'Solve the given expression using 8:1 Multiplexer F(A,B,C.D)= Σm(0,2,3,6,8,9,12)', marks: '[5]' },
                        { number: 'C)', text: 'Design 1 bit BCD adder circuit using IC 7483.', marks: '[5]' },
                    ]
                },
                {
                    title: 'Q.4.',
                    instructions: 'Attempt Any One of the following',
                    questions: [
                        { number: 'A)', text: 'Explain working of 2 bit ripple up counter', marks: '[5]' },
                        { number: 'B)', text: 'Design JK flip flop to T flip flop', marks: '[5]' },
                        { number: 'C)', text: 'Design MOD 48 up counter Using IC7490', marks: '[5]' },
                    ]
                },
                {
                    title: 'Q.5.',
                    instructions: 'Attempt Any One of the following',
                    questions: [
                        { number: 'A)', text: 'List types of logic families and compare CMOS and TTL', marks: '[5]' },
                        { number: 'B)', text: 'Draw and explain CMOS inverter, NAND, NOR gate', marks: '[5]' },
                        { number: 'C)', text: 'Draw and explain open collector TTL NAND gate and tri state logic', marks: '[5]' },
                    ]
                },
                {
                    title: 'Q.6.',
                    instructions: 'Attempt Any One of the following',
                    questions: [
                        { number: 'A)', text: 'Write short notes on Mealy and Moore machine', marks: '[5]' },
                        { number: 'B)', text: 'Design a sequence detector to detect 110 sequence using Mealy machine.', marks: '[5]' },
                        { number: 'C)', text: 'Design a sequence detector to detect 101 sequence using Moore machine.', marks: '[5]' },
                    ]
                }
            ]
        }
    ],
    'ETE01201': [ // Engineering Mathematics III
       {
            year: 2025,
            college: "Progressive Education's Society's Modern College of Engineering",
            title: 'End Semester Examination: Engineering Mathematics III',
            courseInfo: 'Engineering Mathematics III (ETE01201)',
            time: '3 Hours',
            totalMarks: 70,
            instructions: [
                'All questions are compulsory.',
                'Neat diagrams must be drawn wherever necessary.'
            ],
            sections: [
                {
                    title: 'Section A',
                    instructions: 'Attempt all questions. Each question carries 2 marks.',
                    questions: [
                        { number: '1.a', text: 'Find the Laplace Transform of f(t) = t³e⁻³ᵗ.', marks: '[2]' },
                        { number: '1.b', text: 'Define a periodic function and give an example.', marks: '[2]' },
                        { number: '1.c', text: 'State the Cauchy-Riemann equations in polar form.', marks: '[2]' },
                    ]
                },
                {
                    title: 'Section B',
                    instructions: 'Attempt any two questions. Each question carries 10 marks.',
                    questions: [
                        { number: '2', text: "Solve the differential equation (D² + 4D + 4)y = e⁻²ᵗ, with y(0)=1 and y'(0)=-2.", marks: '[10]' },
                        { number: '3', text: 'Find the Fourier series expansion of f(x) = x² in the interval (-π, π).', marks: '[10]' },
                    ]
                }
            ]
       }
    ]
};


export default async function PreviousPaperPage({ params }: { params: { subjectCode: string } }) {
  const { subjectCode } = params;
  
  const subject = allSubjects.find(s => s.code === subjectCode);
  
  if (!subject) {
    notFound();
  }

  // Find the papers for the subject. If none exist, default to an empty array.
  const subjectPapers = papers[subjectCode] || [];

  // Render the Client Component and pass the data as props
  return <PreviousPaperClientPage subjectCode={subjectCode} subject={subject} subjectPapers={subjectPapers} />;
}
