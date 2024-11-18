// hooks/useFetchAllVolunteers.ts
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '@/app/firebase/config';
import { Agency, UserRole } from '@/app/models/users';

const useFetchAllAgencies = () => {
    const [users, setUsers] = useState<Agency[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAgencies = async () => {
        try {
            const q = query(collection(firestore, "users"), where("role", "==", UserRole.Agency));
            const querySnapshot = await getDocs(q);
            const users: Agency[] = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    username: data.username ?? "",
                    biography: data.biography ?? "",
                    avatarImageUrl: data.avatarImageUrl ?? "",
                    interests: data.interests ?? [],
                    mobileNumber: data.mobileNumber ?? "",
                } as Agency;
            });
            setUsers(users);
        } catch (error) {
            if (error instanceof Error) {
                setError("Failed to fetch users: " + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgencies();
    }, []);

    return { users, loading, error };
};

export default useFetchAllAgencies;