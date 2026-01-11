'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { entc_2nd_year_3rd_sem_syllabus, entc_2nd_year_4th_sem_syllabus } from '@/lib/entc-syllabus';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import React from 'react';

const allSubjects = [
  ...entc_2nd_year_3rd_sem_syllabus.subjects,
  ...entc_2nd_year_4th_sem_syllabus.subjects
];

type Question = {
  number: string;
  text: string;
  marks: string;
};

type Section = {
  title: string;
  instructions: string;
  questions: Question[];
};

type PaperContent = {
  year: number;
  college: string;
  title: string;
  courseInfo: string;
  time: string;
  totalMarks: number;
  instructions: string[];
  sections: Section[];
};

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
}

function QuestionPaper({ content }: { content: PaperContent }) {
    return (
        <div className="bg-white text-black p-8 rounded-lg shadow-lg font-serif">
            <div className="text-center border-b-2 border-black pb-4 mb-6">
                <h2 className="text-xl font-bold">{content.college}</h2>
                <h3 className="text-lg font-semibold">(An Autonomous Institute Affiliated to Savitribai Phule Pune University)</h3>
                <p className="text-md mt-2">S.Y. B.Tech (2024 Pattern) (Semester III)</p>
                <p className="text-md font-medium">Program: E&amp;TC Engineering Technology</p>
                <h3 className="text-lg font-semibold mt-4">{content.title}</h3>
                <h3 className="text-lg font-bold mt-1">{content.courseInfo}</h3>
            </div>
            <div className="flex justify-between font-semibold mb-6">
                <span>Time: {content.time}</span>
                <span>Max. Marks: {content.totalMarks}</span>
            </div>
            <div className="mb-6">
                <h4 className="font-bold mb-2">Instructions to the candidate:</h4>
                <ol className="list-decimal list-inside text-sm space-y-1">
                    {content.instructions.map((inst, idx) => (
                        <li key={idx}>{inst}</li>
                    ))}
                </ol>
            </div>

            {content.sections.map((section, idx) => (
                <div key={idx} className="mb-8">
                    <div className="flex justify-between items-baseline mb-4 border-t pt-4">
                        <h4 className="text-lg font-bold">{section.title}</h4>
                        <p className="italic text-sm">{section.instructions}</p>
                    </div>
                    {section.questions.map((q) => (
                        <div key={q.number} className="flex justify-between mb-3 items-start">
                            <p className="pr-4"><strong className="mr-2">{q.number}</strong>{q.text}</p>
                            <span className="font-bold whitespace-nowrap">{q.marks}</span>
                        </div>
                    ))}
                </div>
            ))}
             <div className="border-t-2 border-black text-center pt-2 mt-8 font-bold">
                *** END OF PAPER ***
            </div>
        </div>
    )
}

export default function PreviousPaperPage({ params }: { params: { subjectCode: string } }) {
  const resolvedParams = React.use(params);
  const { subjectCode } = resolvedParams;
  const subject = allSubjects.find(s => s.code === subjectCode);
  const subjectPapers = papers[subjectCode];

  if (!subject) {
    notFound();
  }

  return (
    <div className="flex flex-col h-screen bg-muted/20">
      <header className="p-4 border-b border-border/40 flex items-center gap-4 bg-background sticky top-0 z-10">
        <Button variant="outline" size="icon" asChild>
            <Link href="/syllabus-explorer">
                <ArrowLeft />
            </Link>
        </Button>
        <div>
            <p className="text-sm text-muted-foreground">Previous Year Paper</p>
            <h1 className="text-2xl font-headline font-bold">{subject.name} ({subject.code})</h1>
        </div>
      </header>
      <div className="flex-1 p-8 overflow-y-auto">
        <Card className="max-w-4xl mx-auto bg-background/80">
            <CardHeader>
                <CardTitle>Exam Paper ({subjectPapers?.[0].year})</CardTitle>
            </CardHeader>
            <CardContent>
                {subjectPapers ? (
                    <div className="space-y-8">
                        {subjectPapers.map((paperContent, index) => (
                           <QuestionPaper key={index} content={paperContent} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <h2 className="text-2xl font-bold">Coming Soon!</h2>
                        <p className="text-muted-foreground mt-2">Previous year papers for this subject are not yet available.</p>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
