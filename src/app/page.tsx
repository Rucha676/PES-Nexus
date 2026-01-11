'use client';
import { GraduationCap, BookOpen, Sparkles, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <>
      <header className="flex justify-end p-4 border-b border-border/40">
        {/* Potentially user profile or settings */}
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-8 text-center">
        <GraduationCap className="h-20 w-20 mx-auto mb-4 text-primary" />
        <h2 className="text-5xl font-headline font-bold">Welcome to PES-Nexus</h2>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Your all-in-one AI-powered academic assistant for the PESMCOE autonomous syllabus. Explore the syllabus, get instant answers from our AI tutor, and connect with seniors when you need a human touch.
        </p>
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            <Card className="text-left">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>Syllabus Explorer</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">
                        Navigate through departments, years, and subjects to view the complete syllabus.
                    </p>
                    <Button asChild variant="outline">
                        <Link href="/syllabus-explorer">Explore</Link>
                    </Button>
                </CardContent>
            </Card>
            <Card className="text-left">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <Sparkles className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>Nexus AI</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">
                        Ask syllabus-related questions and get instant, grounded explanations from our AI tutor.
                    </p>
                    <Button asChild variant="outline">
                        <Link href="/nexus-ai">Start Chatting</Link>
                    </Button>
                </CardContent>
            </Card>
            <Card className="text-left">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <Users className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>Senior Bridge</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">
                        Stuck on a tough concept? Send a request to experienced seniors for guidance.
                    </p>
                     <Button asChild variant="outline">
                        <Link href="/senior-bridge">Ask a Senior</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </>
  );
}
