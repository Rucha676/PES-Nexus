'use client';

import { usePathname, useRouter } from 'next/navigation';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Logo } from '@/components/icons';
import { BookOpen, HomeIcon, Users, Sparkles, Trophy, LogOut, UserCircle, Shield } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider, useAuth, useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ADMIN_UID } from '@/lib/admin';
import { useEffect } from 'react';

function MainApp({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const auth = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    if (auth) {
      await auth.signOut();
      // After signing out, Firebase state will change, and AppLayout will handle the redirect.
      // Forcing a push can be good for instant feedback.
      router.push('/login');
    }
  };
  
  return (
     <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <Logo className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-headline font-bold">PES-Nexus</h1>
          </div>

          {user && (
            <Link href="/profile">
              <div className="p-3 mb-6 rounded-lg bg-accent/50 hover:bg-accent transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.photoURL ?? ''} />
                        <AvatarFallback>
                            {user.displayName?.charAt(0) || <UserCircle />}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                          <p className="font-semibold text-sm">Hello, {user.displayName || 'User'}</p>
                      </div>
                  </div>
              </div>
            </Link>
          )}

          <nav>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-lg text-sm hover:bg-accent/50 transition-colors",
                    pathname === '/' && 'bg-accent text-accent-foreground'
                  )}
                >
                  <HomeIcon />
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/syllabus-explorer"
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-lg text-sm hover:bg-accent/50 transition-colors",
                    pathname === '/syllabus-explorer' && 'bg-accent text-accent-foreground'
                  )}
                >
                  <BookOpen />
                  Syllabus Explorer
                </Link>
              </li>
              <li>
                <Link
                  href="/nexus-ai"
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-lg text-sm hover:bg-accent/50 transition-colors",
                    pathname === '/nexus-ai' && 'bg-accent text-accent-foreground'
                  )}
                >
                  <Sparkles />
                  Nexus AI
                </Link>
              </li>
              <li>
                <Link
                  href="/senior-bridge"
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-lg text-sm hover:bg-accent/50 transition-colors",
                    pathname === '/senior-bridge' && 'bg-accent text-accent-foreground'
                  )}
                >
                  <Users />
                  Senior Bridge
                </Link>
              </li>
              <li>
                <Link
                  href="/leaderboard"
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-lg text-sm hover:bg-accent/50 transition-colors",
                    pathname === '/leaderboard' && 'bg-accent text-accent-foreground'
                  )}
                >
                  <Trophy />
                  Leaderboard
                </Link>
              </li>
               {user?.uid === ADMIN_UID && (
                 <li>
                    <Link
                    href="/admin"
                    className={cn(
                        "flex items-center gap-3 p-2 rounded-lg text-sm hover:bg-accent/50 transition-colors",
                        pathname === '/admin' && 'bg-accent text-accent-foreground'
                    )}
                    >
                    <Shield />
                    Admin
                    </Link>
                </li>
               )}
            </ul>
          </nav>
        </div>
        <div className="space-y-4">
          <Button variant="outline" size="sm" className="w-full" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4"/>
            Sign Out
          </Button>
          <div className="text-xs text-sidebar-foreground/60">
            Powered by Google Gemini
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  )
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useUser();
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  useEffect(() => {
    // If loading is finished, and there's no user, and we're not on an auth page, redirect to login.
    if (!isLoading && !user && !isAuthPage) {
      router.push('/login');
    }
    // If loading is finished, and there IS a user, and we ARE on an auth page, redirect to home.
    if (!isLoading && user && isAuthPage) {
      router.push('/');
    }
  }, [user, isLoading, isAuthPage, router]);


  if (isLoading) {
    return <div className="flex h-screen w-screen items-center justify-center"><p>Loading...</p></div>;
  }

  if (user && !isAuthPage) {
    return <MainApp>{children}</MainApp>;
  }

  if (!user && isAuthPage) {
    return <>{children}</>;
  }

  // This state covers two cases:
  // 1. User is logged in but on an auth page (will be redirected by useEffect).
  // 2. User is not logged in and not on an auth page (will be redirected by useEffect).
  // In both cases, we show a loading screen to prevent content flashes.
  return <div className="flex h-screen w-screen items-center justify-center"><p>Redirecting...</p></div>;
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@400;500;700&family=Source+Code+Pro&display=swap" rel="stylesheet" />
        <title>PES Nexus</title>
      </head>
      <body className="font-body antialiased text-foreground">
        <FirebaseClientProvider>
          <AppLayout>{children}</AppLayout>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
