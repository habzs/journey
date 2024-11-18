import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { firestore } from "@/app/firebase/config";
import { Badge } from "@/app/models/badges";

const useFetchAllBadges = (limitCount?: number) => {
    const [badges, setBadges] = useState<Badge[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBadges = async () => {
        try {
            let q = query(
                collection(firestore, "badges"),
                orderBy("createdDate", "desc")
            );

            if (limitCount && limitCount > 0) {
                q = query(q, limit(limitCount));
            }

            const querySnapshot = await getDocs(q);
            const badges: Badge[] = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: data.name,
                    description: data.description,
                    color: data.color,
                    imageUrl: data.imageUrl,
                    criteria: data.criteria,
                    category: data.category,
                    achievementLevel: data.achievementLevel,
                    createdDate: data.createdDate,
                    createdBy: data.createdBy,
                } as Badge;
            });
            setBadges(badges);
        } catch (error) {
            if (error instanceof Error) {
                setError("Failed to fetch badges: " + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBadges();
    }, []);

    return { badges, loading, error };
};

export default useFetchAllBadges;
