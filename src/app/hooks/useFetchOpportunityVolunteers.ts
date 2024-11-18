import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "@/app/firebase/config";
import { OpportunityVolunteer } from "@/app/models/opportunities";

const useFetchOpportunityVolunteers = (opportunityId: string) => {
    const [volunteers, setVolunteers] = useState<OpportunityVolunteer[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOpportunityVolunteers = async () => {
        if (!opportunityId) return;

        setLoading(true);
        setError(null);

        try {
            const q = collection(firestore, "opportunities", opportunityId, "signedUpVolunteers");
            const querySnapshot = await getDocs(q);
            const volunteers: OpportunityVolunteer[] = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    username: data.username ?? "",
                    avatarImageUrl: data.avatarImageUrl ?? "",
                    status: data.status ?? "pending",
                } as OpportunityVolunteer;
            });
            setVolunteers(volunteers);
        } catch (err) {
            setError('Failed to fetch volunteers');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOpportunityVolunteers();
    }, [opportunityId]);

    return { volunteers, loading, error };
};

export default useFetchOpportunityVolunteers;
