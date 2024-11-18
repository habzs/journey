import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, where, limit } from "firebase/firestore";
import { firestore } from "../firebase/config";
import { Opportunity } from "../models/opportunities";
import { UserRole } from '@/app/models/users';

const useFetchAgencyOpportunities = (currentUser: any, limitCount?: number) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOpportunities = async () => {

    if (!currentUser) {
      console.warn("No current user found.");
      setLoading(false);
      return;
    }

    if (currentUser.role !== UserRole.Agency) {
      console.warn("Current user is not an agency.");
      setLoading(false);
      return;
    }

    try {

      // Query for opportunities where agency.id matches the current user's UID
      let q = query(
        collection(firestore, "opportunities"),
        where("agency.id", "==", currentUser.uid), // Ensure "agency.id" matches currentUser.uid
        orderBy("createdDate", "desc")
      );

      if (limitCount && limitCount > 0) {
        q = query(q, limit(limitCount)); // Limit the number of opportunities if limitCount is provided
      }

      console.log("Executing Firestore query...");
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.warn("No matching opportunities found.");
      }

      const fetchedOpportunities: Opportunity[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        console.log("Fetched data for opportunity:", data); // Log each document's data

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
          agency: data.agency, // Include the agency field if you need it
        } as Opportunity;
      });

      setOpportunities(fetchedOpportunities);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching opportunities:", error);
        setError("Failed to fetch opportunities: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("useEffect triggered"); // Check if useEffect is running
    fetchOpportunities();
  }, [currentUser]);

  return { opportunities, loading, error };
};

export default useFetchAgencyOpportunities;
