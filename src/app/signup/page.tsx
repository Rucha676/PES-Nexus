'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/icons';

const departments = [
    { id: 'cs', name: 'Computer Science' },
    { id: 'it', name: 'Information Technology' },
    { id: 'entc', name: 'Electronics and Telecommunication' },
    { id: 'elex', name: 'Electronics' },
    { id: 'mech', name: 'Mechanical Engineering' },
    { id: 'aids', name: 'AI & Data Science' },
    { id: 'aiml', name: 'AI & Machine Learning' },
];

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [expertise, setExpertise] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const { user, isLoading: isUserLoading } = useUser();
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!auth || !firestore) return;

    setIsLoading(true);
    
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;

        // Update the user's profile with their name
        await updateProfile(user, { displayName: name });

        const userProfile = {
          id: user.uid,
          name,
          email,
          major: department,
          year: parseInt(year, 10),
          expertise: expertise || null,
        };

        const userDocRef = doc(firestore, 'users', user.uid);
        await setDoc(userDocRef, userProfile);

        toast({
          title: 'Account Created',
          description: 'You have been successfully signed up!',
        });
        
        router.push('/');
      })
      .catch((error: any) => {
        toast({
          variant: 'destructive',
          title: 'Sign-up Failed',
          description: error.message || 'An unexpected error occurred.',
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Render nothing or a loader until auth state is known
  if (isUserLoading || user) {
     return <div className="flex h-screen w-screen items-center justify-center"><p>Loading...</p></div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-3 mb-4">
               <Logo className="h-8 w-8 text-primary" />
               <h1 className="text-3xl font-headline font-bold">PES-Nexus</h1>
            </div>
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription>Join our academic community.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select onValueChange={setDepartment} required value={department} disabled={isLoading}>
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select your department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Select onValueChange={setYear} required value={year} disabled={isLoading}>
                  <SelectTrigger id="year">
                    <SelectValue placeholder="Select your academic year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1st Year</SelectItem>
                    <SelectItem value="2">2nd Year</SelectItem>
                    <SelectItem value="3">3rd Year</SelectItem>
                    <SelectItem value="4">4th Year</SelectItem>
                  </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expertise">Expertise (Optional)</Label>
              <Input id="expertise" placeholder="e.g., React, Python, Control Systems" value={expertise} onChange={(e) => setExpertise(e.target.value)} disabled={isLoading} />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline text-primary">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
