import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/app/firebase/config";
import { Badge } from "@/app/models/badges";

const useFetchBadge = (badgeId: string) => {
    const [badge, setBadge] = useState<Badge | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBadge = async () => {
        if (badgeId) {
            try {
                const badgeRef = doc(firestore, "badges", badgeId);
                const badgeDoc = await getDoc(badgeRef);

                if (badgeDoc.exists()) {
                    setBadge(badgeDoc.data() as Badge);
                } else {
                    setError("Badge not found");
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

    useEffect(() => {
        fetchBadge();
    }, [badgeId]);

    return { badge, loading, error };
};

export default useFetchBadge;
