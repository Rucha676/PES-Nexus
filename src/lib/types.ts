

export type Syllabus = {
    id: string;
    courseName: string;
    year: number;
    major: string;
    pdfStorageLocation: string;
    uploadDate: string;
};

export type Doubt = {
    id: string;
    studentId: string;
    studentName: string;
    studentYear: number;
    major: string;
    title: string;
    description: string;
    timestamp: any;
    status: 'pending' | 'resolved' | 'rejected';
    senior: string | null;
    solution: string | null;
    syllabusId: string;
};

export type History = {
    id: string;
    studentId: string;
    query: string;
    timestamp: any;
    resultType: string;
    resultId?: string;
};

export type Student = {
    id: string;
    name: string;
    email: string;
    major: string;
    year: number;
    expertise?: string | null;
};

export type LeaderboardEntry = {
    id: string; // Corresponds to the senior's user ID
    name: string;
    points: number;
    doubtsResolved: number;
}
