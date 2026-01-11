'use client';

import { useMemo, useState, useEffect } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Medal, Trophy } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Doubt, LeaderboardEntry } from '@/lib/types';

export default function LeaderboardPage() {
  const [isClient, setIsClient] = useState(false);
  const firestore = useFirestore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const resolvedDoubtsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'doubts'), where('status', '==', 'resolved'));
  }, [firestore]);

  const { data: resolvedDoubts, isLoading } = useCollection<Doubt>(resolvedDoubtsQuery);

  const leaderboardData = useMemo(() => {
    if (!resolvedDoubts) return [];

    const seniorStats = new Map<string, { name: string; points: number; doubtsResolved: number; }>();

    resolvedDoubts.forEach(doubt => {
      if (doubt.senior) {
        const seniorName = doubt.senior; // Assuming senior's name is stored directly
        if (!seniorStats.has(seniorName)) {
          seniorStats.set(seniorName, { name: seniorName, points: 0, doubtsResolved: 0 });
        }
        const stats = seniorStats.get(seniorName)!;
        stats.points += 5;
        stats.doubtsResolved += 1;
      }
    });

    return Array.from(seniorStats.values()).sort((a, b) => b.points - a.points);
  }, [resolvedDoubts]);

  return (
    <>
      <header className="p-4 border-b border-border/40">
        <h1 className="text-2xl font-headline font-bold flex items-center gap-2">
          <Trophy className="text-primary" />
          Senior Leaderboard
        </h1>
      </header>
      <div className="flex-1 p-8 overflow-y-auto">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Top Helping Seniors</CardTitle>
            <CardDescription>Seniors earn 5 points for each doubt they resolve. Here are the top contributors!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(!isClient || isLoading) && (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              )}
              {isClient && !isLoading && leaderboardData?.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No doubts have been resolved yet. Be the first to help!</p>
                </div>
              )}
              {isClient && !isLoading && leaderboardData?.map((senior, index) => (
                <div key={senior.name} className="flex items-center justify-between p-4 rounded-lg border bg-card-foreground/5">
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold w-8 text-center text-muted-foreground">{index + 1}</span>
                    <Avatar>
                        <AvatarFallback>{senior.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{senior.name}</p>
                        <p className="text-xs text-muted-foreground">{senior.doubtsResolved} doubts resolved</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {index < 3 && (
                       <Medal className={
                         index === 0 ? 'text-yellow-400' :
                         index === 1 ? 'text-gray-400' : 'text-yellow-600'
                       } />
                    )}
                    <span className="font-bold text-lg text-primary">{senior.points} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
