'use client';

import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Student } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Shield, User } from 'lucide-react';
import { ADMIN_UID } from '@/lib/admin';

export default function AdminPage() {
    const { user, isLoading: isUserLoading } = useUser();
    const firestore = useFirestore();

    const usersQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'users');
    }, [firestore]);

    const { data: users, isLoading: isLoadingUsers } = useCollection<Student>(usersQuery);

    if (isUserLoading) {
        return <div className="flex-1 flex items-center justify-center">Loading...</div>;
    }

    if (user?.uid !== ADMIN_UID) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
                <Shield className="h-16 w-16 text-destructive mb-4" />
                <h1 className="text-3xl font-bold">Access Denied</h1>
                <p className="text-muted-foreground mt-2">You do not have permission to view this page.</p>
            </div>
        );
    }
    
    return (
        <>
            <header className="p-4 border-b border-border/40">
                <h1 className="text-2xl font-headline font-bold flex items-center gap-2">
                    <Shield className="text-primary"/>
                    Admin Dashboard
                </h1>
            </header>
            <div className="flex-1 p-8 overflow-y-auto space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><User /> Registered Users</CardTitle>
                        <CardDescription>A list of all users who have signed up for the application.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Major</TableHead>
                                    <TableHead>Year</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoadingUsers && <TableRow><TableCell colSpan={4}>Loading users...</TableCell></TableRow>}
                                {users?.map(student => (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-medium flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            {student.name}
                                        </TableCell>
                                        <TableCell>{student.email}</TableCell>
                                        <TableCell>{student.major.toUpperCase()}</TableCell>
                                        <TableCell>{student.year}</TableCell>
                                    </TableRow>
                                ))}
                                {users?.length === 0 && !isLoadingUsers && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">No users have signed up yet.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
