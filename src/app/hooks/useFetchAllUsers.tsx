// hooks/useFetchAllVolunteers.ts
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../firebase/config';
import { UserRole, Volunteer } from '../models/users';

const useFetchAllUsers = (currentUser: any) => {
    const [users, setUsers] = useState<Volunteer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        if (currentUser) {
            try {
                const q = query(collection(firestore, "users"));
                const querySnapshot = await getDocs(q);
                const users: Volunteer[] = querySnapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        username: data.username ?? "",
                        biography: data.biography ?? "",
                        avatarImageUrl: data.avatarImageUrl ?? "",
                        interests: data.interests ?? [],
                        mobileNumber: data.mobileNumber ?? "",
                    } as Volunteer;
                });
                setUsers(users);
            } catch (error) {
                if (error instanceof Error) {
                    setError("Failed to fetch users: " + error.message);
                }
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [currentUser]);

    return { users, loading, error };
};

export default useFetchAllUsers;