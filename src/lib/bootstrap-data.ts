'use client';
import type { Firestore } from 'firebase/firestore';
import { collection, getDocs, setDoc, doc, writeBatch } from 'firebase/firestore';

const SYLLABUS_BOOTSTRAP_KEY = 'syllabus_bootstrapped_v2'; // Increment version to force re-bootstrap

const departments = [
    { id: 'cs', name: 'Computer Science' },
    { id: 'it', name: 'Information Technology' },
    { id: 'entc', name: 'Electronics and Telecommunication' },
    { id: 'elex', name: 'Electronics' },
    { id: 'mech', name: 'Mechanical Engineering' },
    { id: 'aids', name: 'AI & Data Science' },
    { id: 'aiml', name: 'AI & Machine Learning' },
];

const years = [1, 2, 3, 4];

/**
 * Checks if syllabus data has been bootstrapped and adds it if not.
 * This prevents re-adding data on every app load.
 * @param firestore The Firestore instance.
 */
export async function bootstrapSyllabusData(firestore: Firestore) {
  // Check if we've already bootstrapped with the current version
  if (sessionStorage.getItem(SYLLABUS_BOOTSTRAP_KEY)) {
    return;
  }

  try {
    const syllabusesCollection = collection(firestore, 'syllabuses');
    const snapshot = await getDocs(syllabusesCollection);

    // If the collection is empty, add the sample data for all departments and years.
    if (snapshot.empty) {
      console.log('Bootstrapping syllabus data for all departments...');
      
      const batch = writeBatch(firestore);

      for (const dept of departments) {
        for (const year of years) {
          const syllabusData = {
            courseName: `${dept.name} - ${year}${year === 1 ? 'st' : year === 2 ? 'nd' : year === 3 ? 'rd' : 'th'} Year`,
            year: year,
            major: dept.id,
            pdfStorageLocation: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', // Dummy PDF link
            uploadDate: new Date().toISOString(),
          };

          // Use a predictable ID to prevent duplicates
          const docId = `${dept.id}_${year}`;
          const docRef = doc(firestore, 'syllabuses', docId);
          batch.set(docRef, syllabusData);
        }
      }

      await batch.commit();

      console.log('Syllabus data for all departments bootstrapped successfully.');
    }
    
    // Mark as bootstrapped in session storage to avoid re-checking Firestore on every load.
    sessionStorage.setItem(SYLLABUS_BOOTSTRAP_KEY, 'true');

  } catch (error) {
    console.error('Error bootstrapping syllabus data:', error);
  }
}
