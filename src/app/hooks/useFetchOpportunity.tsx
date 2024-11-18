import { useState, useEffect } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { firestore } from "../firebase/config";
import { Opportunity } from "../models/opportunities";
import { BasicBadgeDetails } from "../models/badges/BasicBadgeDetails";

const useFetchOpportunity = (opportunityId: string) => {
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [badges, setBadges] = useState<BasicBadgeDetails[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOpportunity = async () => {
    if (opportunityId) {
      try {
        const oppRef = doc(firestore, "opportunities", opportunityId);
        const oppDoc = await getDoc(oppRef);

        if (oppDoc.exists()) {
          setOpportunity(oppDoc.data() as Opportunity);

          // Fetch badges from subcollection
          const badgesCollectionRef = collection(oppRef, "badges");
          const badgesSnapshot = await getDocs(badgesCollectionRef);

          const fetchedBadges: BasicBadgeDetails[] = badgesSnapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name,
            imageUrl: doc.data().imageUrl,
            achievementLevel: doc.data().achievementLevel,
          }));

          setBadges(fetchedBadges);
        } else {
          setError("Opportunity not found");
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
    fetchOpportunity();
  }, [opportunityId]);

  return { opportunity, badges, loading, error };
};

export default useFetchOpportunity;
