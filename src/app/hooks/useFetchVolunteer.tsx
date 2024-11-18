// hooks/useFetchVolunteer.ts
import { useState, useEffect } from 'react';
import { collection, doc, getDoc, getDocs, query } from 'firebase/firestore';
import { firestore } from '../firebase/config';
import { Volunteer } from '../models/users';

const useFetchVolunteer = (userId: string | undefined) => {
    const [user, setUser] = useState<Volunteer | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (userId) {
                try {
                    const userRef = doc(firestore, 'users', userId);
                    const userDoc = await getDoc(userRef);

                    if (userDoc.exists()) {
                        setUser(userDoc.data() as Volunteer);
                    } else {
                        setError("User not found");
                    }
                } catch (error) {
                    if (error instanceof Error) {
                        setError(error.message);
                    }
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUser();
    }, [userId]);

    return { user, loading, error };
};

export default useFetchVolunteer;