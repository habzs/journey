// hooks/useFetchAllOpportunities.ts
import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { firestore } from "../firebase/config";
import { Opportunity } from "../models/opportunities";

const useFetchAllOpportunities = (currentUser: any, limitCount?: number) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOpportunities = async () => {
    //if (currentUser.role === UserRole.Admin) {
    try {
      let q = query(
        collection(firestore, "opportunities"),
        orderBy("createdDate", "desc")
      );

      if (limitCount && limitCount > 0) {
        q = query(q, limit(limitCount));
      }

      const querySnapshot = await getDocs(q);
      const opportunities: Opportunity[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          description: data.description,
          imageUrl: data.imageUrl,
          date: data.date,
          criteria: data.criteria,
          location: data.location,
          registrationDeadline: data.registrationDeadline,
          createdDate: data.createdDate,
          createdBy: data.createdBy,
          lastEditedDate: data.lastEditedDate,
          lastEditedBy: data.lastEditedBy,
          category: data.category,
          agency: data.agency,
        } as Opportunity;
      });
      setOpportunities(opportunities);
    } catch (error) {
      if (error instanceof Error) {
        setError("Failed to fetch opportunities: " + error.message);
      }
    } finally {
      setLoading(false);
    }
    // }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [currentUser]);

  return { opportunities, loading, error };
};

export default useFetchAllOpportunities;
