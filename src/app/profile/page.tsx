'use client';

import { useState } from 'react';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User as UserIcon, Edit, Save } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import type { Student } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const departments = [
    { id: 'cs', name: 'Computer Science' },
    { id: 'it', name: 'Information Technology' },
    { id: 'entc', name: 'Electronics and Telecommunication' },
    { id: 'elex', name: 'Electronics' },
    { id: 'mech', name: 'Mechanical Engineering' },
    { id: 'aids', name: 'AI & Data Science' },
    { id: 'aiml', name: 'AI & Machine Learning' },
];

export default function ProfilePage() {
  const { user, isLoading: isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<Student>(userProfileRef);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<Student>>({});

  const handleEditToggle = () => {
    if (!isEditing) {
      setEditedProfile({
        major: userProfile?.major,
        year: userProfile?.year,
        expertise: userProfile?.expertise || '',
      });
    }
    setIsEditing(!isEditing);
  };
  
  const handleFieldChange = (field: keyof Student, value: string | number) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!userProfileRef) return;
    try {
        await updateDoc(userProfileRef, editedProfile);
        toast({
            title: 'Profile Updated',
            description: 'Your profile has been successfully updated.',
        });
        setIsEditing(false);
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Update Failed',
            description: 'Could not update your profile. Please try again.',
        });
    }
  }


  if (isUserLoading || isProfileLoading) {
    return <div className="flex-1 flex items-center justify-center"><p>Loading profile...</p></div>;
  }

  if (!user || !userProfile) {
    return <div className="flex-1 flex items-center justify-center"><p>Could not load profile.</p></div>;
  }

  return (
    <>
      <header className="p-4 border-b border-border/40 flex justify-between items-center">
        <h1 className="text-2xl font-headline font-bold">My Profile</h1>
        <Button variant="outline" size="sm" onClick={handleEditToggle}>
          {isEditing ? 'Cancel' : <><Edit className="mr-2 h-4 w-4" /> Edit Profile</>}
        </Button>
      </header>
      <div className="flex-1 p-8 overflow-y-auto">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.photoURL ?? ''} />
                <AvatarFallback className="text-3xl">
                  <UserIcon />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-3xl">{userProfile.name}</CardTitle>
                <CardDescription>{userProfile.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {!isEditing ? (
                 <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 bg-card-foreground/5 rounded-md">
                            <p className="font-semibold text-muted-foreground">Major</p>
                            <p className="font-bold text-lg">{departments.find(d => d.id === userProfile.major)?.name || userProfile.major}</p>
                        </div>
                        <div className="p-3 bg-card-foreground/5 rounded-md">
                            <p className="font-semibold text-muted-foreground">Year</p>
                            <p className="font-bold text-lg">{userProfile.year}</p>
                        </div>
                    </div>
                    {userProfile.expertise && (
                        <div className="p-3 bg-card-foreground/5 rounded-md">
                            <p className="font-semibold text-muted-foreground">Expertise</p>
                            <p className="font-bold text-lg">{userProfile.expertise}</p>
                        </div>
                    )}
                 </div>
            ) : (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="department">Department</Label>
                          <Select 
                            value={editedProfile.major}
                            onValueChange={(value) => handleFieldChange('major', value)}
                          >
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
                           <Select 
                             value={editedProfile.year?.toString()}
                             onValueChange={(value) => handleFieldChange('year', parseInt(value, 10))}
                           >
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
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="expertise">Expertise</Label>
                        <Input 
                            id="expertise" 
                            placeholder="e.g., React, Python, Control Systems" 
                            value={editedProfile.expertise || ''}
                            onChange={(e) => handleFieldChange('expertise', e.target.value)}
                         />
                    </div>
                    <Button onClick={handleSave}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                    </Button>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
