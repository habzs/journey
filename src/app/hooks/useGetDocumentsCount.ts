import { useState, useEffect } from 'react';
import { firestore } from "@/app/firebase/config";
import { collection, getCountFromServer, Firestore, getDocs, orderBy, Query, query, where } from 'firebase/firestore';

const useGetDocumentsCount = (
    collectionName: string,
    filter?: string,
) => {
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                let q: Query = collection(firestore, collectionName);

                if (filter) {
                    q = query(q, where("agency.id", '==', filter));
                }

                const snapshot = await getDocs(q);
                setCount(snapshot.size);
            } catch (error) {
                if (error instanceof Error) {
                    setError('Failed to fetch document count: ' + error.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCount();
    }, [firestore, collectionName]);

    return { count, loading, error };
};

export default useGetDocumentsCount;