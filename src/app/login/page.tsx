'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, useUser } from '@/firebase';
import { Logo } from '@/components/icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const auth = useAuth();
  const { user, isLoading: isUserLoading } = useUser();
  const { toast } = useToast();
  const router = useRouter();

  // Redirect if user is already logged in
  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!auth) return;
    setIsLoading(true);

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        // On success, the main layout's useEffect will handle the redirect.
        // We can optionally push here for faster perceived navigation.
        router.push('/');
      })
      .catch((error: any) => {
        toast({
          variant: "destructive",
          title: "Sign In Failed",
          description: error.message || "An unexpected error occurred.",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Render a loader while checking auth state or if user is already logged in.
  if (isUserLoading || user) {
    return <div className="flex h-screen w-screen items-center justify-center"><p>Loading...</p></div>;
  }

  // Once we know there is no user, render the login form.
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-3 mb-4">
               <Logo className="h-8 w-8 text-primary" />
               <h1 className="text-3xl font-headline font-bold">PES-Nexus</h1>
            </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to access your academic dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline text-primary">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
