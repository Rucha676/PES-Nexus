'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Send, CheckCircle, Clock, MessageSquareWarning, CircleHelp, User, MessageSquarePlus } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, serverTimestamp, query, where, doc, updateDoc, writeBatch, addDoc } from 'firebase/firestore';
import type { Doubt, Student, LeaderboardEntry } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';

type RequestStatus = 'idle' | 'sent';

export default function SeniorBridgePage() {
  const [status, setStatus] = useState<RequestStatus>('idle');
  const [requestId, setRequestId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const { user, isLoading: isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);
  const [resolvingDoubt, setResolvingDoubt] = useState<Doubt | null>(null);
  const [solution, setSolution] = useState('');

  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<Student>(userProfileRef);

  const doubtsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'doubts'), where('status', '==', 'pending'));
  }, [firestore, user]);
  
  const myDoubtsQuery = useMemoFirebase(() => {
      if(!firestore || !user) return null;
      return query(
          collection(firestore, 'doubts'),
          where('studentId', '==', user.uid)
      );
  }, [firestore, user]);

  const { data: allPendingDoubts, isLoading: isLoadingOpenDoubts } = useCollection<Doubt>(doubtsQuery);
  const { data: myDoubts, isLoading: isLoadingMyDoubts } = useCollection<Doubt>(myDoubtsQuery);
  
  const openDoubts = useMemo(() => {
    if (!allPendingDoubts || !userProfile || userProfile.year <= 1) return [];
    return allPendingDoubts.filter(doubt => 
        doubt.major === userProfile.major && doubt.studentYear < userProfile.year
    );
  }, [allPendingDoubts, userProfile]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title || !description || !user || !firestore || !userProfile) return;
    
    const newDoubt: Omit<Doubt, 'id' | 'timestamp'> = {
      title,
      description,
      studentId: user.uid,
      studentName: userProfile.name,
      studentYear: userProfile.year,
      major: userProfile.major,
      status: 'pending',
      senior: null,
      solution: null,
      syllabusId: 'general',
    };
    
    const newDoubtWithTimestamp = {
        ...newDoubt,
        timestamp: serverTimestamp()
    }
    
    const doubtsCollection = collection(firestore, 'doubts');
    
    try {
        const docRef = await addDoc(doubtsCollection, newDoubtWithTimestamp);
        if (docRef) {
            setRequestId(docRef.id);
        }
        setStatus('sent');
        setTitle('');
        setDescription('');
    } catch (error) {
        console.error("Error adding document: ", error);
        toast({
            variant: "destructive",
            title: "Error Sending Doubt",
            description: "Could not send your doubt. Please try again later.",
        });
    }

  };

  const openResolveDialog = (doubt: Doubt) => {
    setResolvingDoubt(doubt);
    setSolution('');
    setIsResolveDialogOpen(true);
  }

  const handleResolveDoubt = async () => {
    if (!firestore || !userProfile || !resolvingDoubt || !solution || !user) return;

    try {
      const doubtRef = doc(firestore, 'doubts', resolvingDoubt.id);
      await updateDoc(doubtRef, {
        status: 'resolved',
        senior: userProfile.name,
        solution: solution,
      });

      toast({
        title: 'Doubt Resolved!',
        description: "You've helped a fellow student and earned 5 points!",
      });
      setIsResolveDialogOpen(false);
      setResolvingDoubt(null);

    } catch (error) {
      console.error("Error resolving doubt: ", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not resolve the doubt. Please try again.',
      });
    }
  }


  const handleReset = () => {
    setStatus('idle');
    setRequestId(null);
  }
  
  const isLoading = isUserLoading || isProfileLoading;
  
  if (isLoading) {
     return (
        <>
            <header className="p-4 border-b border-border/40">
                <h1 className="text-2xl font-headline font-bold">Senior Bridge</h1>
            </header>
            <div className="flex-1 flex items-center justify-center">
                <p>Loading your profile...</p>
            </div>
        </>
     )
  }


  return (
    <>
      <header className="p-4 border-b border-border/40">
        <h1 className="text-2xl font-headline font-bold">Senior Bridge</h1>
      </header>
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          <div className="space-y-8">
            <Card className="w-full">
                <CardHeader>
                <CardTitle>Ask a Doubt</CardTitle>
                <CardDescription>
                    {status === 'idle'
                    ? "Stuck? Post your question and seniors from your department will help."
                    : "Your request has been sent. You will be notified when a senior accepts it."
                    }
                </CardDescription>
                </CardHeader>
                <CardContent>
                {status === 'idle' && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="doubt-title">Doubt Title</Label>
                        <Input id="doubt-title" placeholder="e.g., 'Help with PID Controllers'" required value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="doubt-description">Describe your doubt</Label>
                        <Textarea id="doubt-description" placeholder="Provide as much detail as possible, including what you've already tried." required rows={4} value={description} onChange={(e) => setDescription(e.target.value)}/>
                    </div>
                    <Button type="submit" className="w-full" disabled={!user}>
                        <Send className="mr-2"/>
                        Send Request to Seniors
                    </Button>
                    </form>
                )}

                {status === 'sent' && (
                    <div className="text-center space-y-4 p-8 bg-accent/30 rounded-lg">
                    <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
                    <h3 className="text-2xl font-bold">Request Sent!</h3>
                    <p className="text-muted-foreground">
                        Your doubt has been broadcasted to available seniors.
                    </p>
                    <div className="border border-border rounded-md p-3 text-sm">
                        <p className="flex items-center justify-center gap-2">
                        <Clock className="h-4 w-4" />
                        Status: <span className="font-semibold text-yellow-400">Waiting for a senior to accept</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Request ID: {requestId}</p>

                    </div>
                    <Button onClick={handleReset} variant="outline">Ask Another Question</Button>
                    </div>
                )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                <CardTitle>My Doubt History</CardTitle>
                <CardDescription>Review your previously asked questions and their status.</CardDescription>
                </CardHeader>
                <CardContent>
                {isLoadingMyDoubts ? (
                    <div className="space-y-2">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                ) : (
                    <Accordion type="single" collapsible className="w-full space-y-2">
                    {myDoubts && myDoubts.map(doubt => (
                        <AccordionItem value={doubt.id} key={doubt.id} className="border bg-card-foreground/5 rounded-lg px-4">
                           <AccordionTrigger className="hover:no-underline w-full">
                                <div className="flex items-center justify-between w-full">
                                    <div>
                                        <p className="font-semibold text-left">{doubt.title}</p>
                                        <p className="text-xs text-muted-foreground text-left">
                                        {doubt.status === 'resolved' && `Resolved by ${doubt.senior}`}
                                        {doubt.status === 'pending' && 'Waiting for a senior'}
                                        {doubt.status === 'rejected' && 'Not picked up by any senior'}
                                        </p>
                                    </div>
                                    <Badge variant={
                                        doubt.status === 'resolved' ? 'default' :
                                        doubt.status === 'pending' ? 'secondary' : 'destructive'
                                    } className="capitalize flex items-center gap-1.5">
                                        {doubt.status === 'resolved' && <CheckCircle />}
                                        {doubt.status === 'pending' && <CircleHelp />}
                                        {doubt.status === 'rejected' && <MessageSquareWarning />}
                                        {doubt.status}
                                    </Badge>
                                </div>
                            </AccordionTrigger>
                             <AccordionContent>
                                <div className="prose prose-invert text-sm max-w-none pt-2 border-t border-border/40">
                                    <h5 className="font-semibold">Your Question:</h5>
                                    <p>{doubt.description}</p>
                                    {doubt.status === 'resolved' && doubt.solution && (
                                        <>
                                            <h5 className="font-semibold mt-4">Senior's Solution:</h5>
                                            <p>{doubt.solution}</p>
                                        </>
                                    )}
                                </div>
                             </AccordionContent>
                        </AccordionItem>
                    ))}
                    {myDoubts?.length === 0 && !isLoadingMyDoubts && <p className="text-sm text-muted-foreground text-center py-4">You haven't asked any questions yet.</p>}
                    </Accordion>
                )}
                </CardContent>
            </Card>
          </div>

          <Card className="w-full">
            <CardHeader>
                <CardTitle>Open Doubts Feed</CardTitle>
                <CardDescription>Help others by resolving doubts from students in your department.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoadingOpenDoubts ? (
                     <div className="space-y-4">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                     </div>
                ) : (
                    <div className="space-y-4">
                        {userProfile && userProfile.year > 1 ? (
                            openDoubts && openDoubts.length > 0 ? openDoubts.map(doubt => (
                                <div key={doubt.id} className="p-4 border rounded-lg bg-card-foreground/5">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>
                                                    {doubt.studentName ? doubt.studentName.charAt(0) : <User />}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold text-sm">{doubt.studentName || 'Student'}</p>
                                                <p className="text-xs text-muted-foreground">{doubt.major?.toUpperCase()} - {doubt.studentYear} Year</p>
                                            </div>
                                        </div>
                                        <Badge variant="secondary">Pending</Badge>
                                    </div>
                                    <h4 className="font-bold mt-2">{doubt.title}</h4>
                                    <p className="text-sm text-muted-foreground mt-1 mb-4">{doubt.description}</p>
                                    <Button size="sm" className="w-full" onClick={() => openResolveDialog(doubt)}>
                                    <MessageSquarePlus /> Resolve Doubt
                                    </Button>
                                </div>
                            )) : <p className="text-sm text-center text-muted-foreground p-4">No open doubts for you to resolve right now.</p>
                        ) : (
                            <p className="text-sm text-center text-muted-foreground p-4">Only students in their 2nd year or higher can resolve doubts.</p>
                        )}
                    </div>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Dialog open={isResolveDialogOpen} onOpenChange={setIsResolveDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Resolve Doubt: "{resolvingDoubt?.title}"</DialogTitle>
                <DialogDescription>
                    Please provide a clear and helpful solution to the student's question.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-2">
                <Label htmlFor="solution">Your Solution</Label>
                <Textarea 
                    id="solution"
                    rows={8}
                    placeholder="Explain the concept, provide steps, or share a link to a resource..."
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                />
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsResolveDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleResolveDoubt} disabled={!solution.trim()}>Submit Solution & Resolve</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
