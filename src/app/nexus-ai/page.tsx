'use client';
import { useState, useRef, useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Send, User, Sparkles, AlertTriangle, Book, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { explainTopicAction, getResourcesAction } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { entc_2nd_year_3rd_sem_syllabus, entc_2nd_year_4th_sem_syllabus } from '@/lib/entc-syllabus';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { CuratedResourceSuggestionsOutput } from '@/ai/flows/curated-resource-suggestions';

type Message = {
  id: string;
  sender: 'user' | 'ai';
  content: string | React.ReactNode;
};

const initialExplainState = { message: '', explanation: '' };
const initialResourceState: { message: string, resources?: CuratedResourceSuggestionsOutput | null } = { message: '' };

let messageIdCounter = 0;
const getUniqueMessageId = () => `msg-${messageIdCounter++}`;

const allSubjects = [
  ...entc_2nd_year_3rd_sem_syllabus.subjects,
  ...entc_2nd_year_4th_sem_syllabus.subjects
].filter(subject => subject.units); // Only include subjects with units

export default function NexusAiPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [explainState, explainFormAction] = useActionState(explainTopicAction, initialExplainState);
  const [resourceState, resourceFormAction] = useActionState(getResourcesAction, initialResourceState);
  const [isClient, setIsClient] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const resourceFormRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (explainState.message === 'success' && explainState.explanation) {
      setMessages(prev => [...prev, { id: getUniqueMessageId(), sender: 'ai', content: explainState.explanation }]);
      formRef.current?.reset();
    } else if (explainState.message === 'error') {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: explainState.error,
      });
    }
  }, [explainState, toast]);

    useEffect(() => {
    if (resourceState.message === 'success' && resourceState.resources) {
      const resourceContent = (
        <div className="space-y-4">
          <h3 className="font-bold">Here are some resources for you:</h3>
          <div>
            <h4 className="flex items-center gap-2 font-semibold"><Youtube /> YouTube Keywords:</h4>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              {resourceState.resources.youtubeKeywords.map(keyword => (
                <li key={keyword}>
                  <Link href={`https://www.youtube.com/results?search_query=${encodeURIComponent(keyword)}`} target="_blank" className="text-primary hover:underline">
                    {keyword}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="flex items-center gap-2 font-semibold"><Book /> Reference Books:</h4>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              {resourceState.resources.referenceBooks.map(book => <li key={book}>{book}</li>)}
            </ul>
          </div>
        </div>
      );
      setMessages(prev => [...prev, { id: getUniqueMessageId(), sender: 'ai', content: resourceContent }]);
      resourceFormRef.current?.reset();
    } else if (resourceState.message === 'error') {
       toast({
        variant: 'destructive',
        title: 'Error',
        description: resourceState.error,
      });
    }
  }, [resourceState, toast]);


  const handleFormSubmit = (formData: FormData) => {
    const topic = formData.get('topic') as string;
    if (topic) {
      setMessages(prev => [...prev, { id: getUniqueMessageId(), sender: 'user', content: topic }]);
      explainFormAction(formData);
    }
  };
  
  const handleResourceRequest = (formData: FormData) => {
     const subject = formData.get('subject') as string;
     if (subject) {
       const subjectName = allSubjects.find(s => s.code === subject)?.name || subject;
       setMessages(prev => [...prev, { id: getUniqueMessageId(), sender: 'user', content: `Find resources for: ${subjectName}` }]);
       resourceFormAction(formData);
     }
  }
  
  if (!isClient) {
    return null;
  }

  return (
    <>
      <header className="flex items-center justify-between p-4 border-b border-border/40">
        <h1 className="text-2xl font-headline font-bold">Nexus AI</h1>
        <Button variant="outline" asChild>
          <Link href="/senior-bridge">
            <AlertTriangle className="mr-2" />
            Doubt not cleared? Ask a Senior.
          </Link>
        </Button>
      </header>
      <div className="flex-1 flex flex-col p-4 gap-4">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex items-start gap-3 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                {message.sender === 'ai' && <div className="p-2 bg-primary/20 rounded-full"><Sparkles className="text-primary" /></div>}
                <div className={`rounded-lg p-3 max-w-2xl ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border'
                }`}>
                  <div className="prose prose-invert text-sm">{typeof message.content === 'string' ? <p>{message.content}</p> : message.content}</div>
                </div>
                {message.sender === 'user' && <div className="p-2 bg-accent rounded-full"><User /></div>}
              </div>
            ))}
             {messages.length === 0 && <WelcomeContent onRequestResource={handleResourceRequest} formRef={resourceFormRef} />}
          </div>
        </ScrollArea>
        <footer className="mt-auto">
          <form
            ref={formRef}
            action={handleFormSubmit}
            className="relative"
          >
            <Input
              name="topic"
              placeholder="Ask a syllabus-related question..."
              className="pr-12 h-12 text-base"
              required
            />
            <SubmitButton />
          </form>
        </footer>
      </div>
    </>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="icon"
      className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9"
      disabled={pending}
    >
      {pending ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-background"></div> : <Send />}
      <span className="sr-only">Send</span>
    </Button>
  );
}

function WelcomeContent({onRequestResource, formRef}: {onRequestResource: (formData: FormData) => void, formRef: React.RefObject<HTMLFormElement>}) {

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const subject = formData.get('subject');
    if (subject) {
      onRequestResource(formData);
    }
  }

  return (
    <div className="text-center mt-16">
       <Sparkles className="h-16 w-16 mx-auto mb-4 text-primary" />
       <h2 className="text-4xl font-headline font-bold">Nexus AI Tutor</h2>
       <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
         Your personal AI assistant for the PESMCOE syllabus. Ask complex questions, get step-by-step explanations, or find curated resources.
       </p>
       <div className="w-full max-w-md mx-auto border-t border-border/40 my-8"></div>
       <Card className="max-w-md mx-auto text-left">
        <CardHeader>
          <CardTitle>Find Learning Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={handleSubmit} className="flex gap-2">
            <Select name="subject" required>
              <SelectTrigger>
                <SelectValue placeholder="Select a Subject" />
              </SelectTrigger>
              <SelectContent>
                {allSubjects.map(subject => (
                  <SelectItem key={subject.code} value={subject.code}>
                    {subject.name} ({subject.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit">Get Resources</Button>
          </form>
        </CardContent>
       </Card>
    </div>
  )
}
