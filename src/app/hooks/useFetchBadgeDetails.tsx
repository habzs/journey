import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/app/firebase/config";
import { Badge } from "@/app/models/badges";

const useFetchBadgeDetails = (badgeIds: string[]) => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBadges = async () => {
    if (badgeIds.length > 0) {
      try {
        const badgePromises = badgeIds.map(async (id) => {
          const badgeRef = doc(firestore, "badges", id);
          const badgeDoc = await getDoc(badgeRef);

          if (badgeDoc.exists()) {
            return { id: badgeDoc.id, ...badgeDoc.data() } as Badge;
          } else {
            console.warn(`Badge with ID ${id} not found`);
            return null;
          }
        });

        const fetchedBadges = await Promise.all(badgePromises);
        setBadges(
          fetchedBadges.filter((badge): badge is Badge => badge !== null)
        );
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    } else {
      setBadges([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, [badgeIds]);

  return { badges, loading, error };
};

export default useFetchBadgeDetails;
