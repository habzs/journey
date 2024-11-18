// hooks/useFetchFilteredOpportunities.ts
import { useState, useEffect, useCallback } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  startAt,
} from "firebase/firestore";
import { firestore } from "../firebase/config";
import { Opportunity } from "../models/opportunities";
import { useSearchParams } from "next/navigation";

const useFetchFilteredOpportunities = (itemsPerPage: number = 8) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const searchParams = useSearchParams();

  const fetchOpportunities = useCallback(async () => {
    setLoading(true);
    try {
      let baseQuery = query(
        collection(firestore, "opportunities"),
        orderBy("createdDate", "desc")
      );

      const categories = searchParams.get("categories")?.split(",") || [];
      if (categories.length > 0) {
        baseQuery = query(
          baseQuery,
          where("category", "array-contains-any", categories)
        );
      }

      // Get total count
      const countSnapshot = await getDocs(baseQuery);
      const totalItems = countSnapshot.size;
      setTotalPages(Math.ceil(totalItems / itemsPerPage));

      if (totalItems === 0) {
        setOpportunities([]);
        return;
      }

      // Get current page from search params
      const currentPage = parseInt(searchParams.get("page") || "1", 10);
      setCurrentPage(currentPage);

      // Paginate
      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedQuery = query(
        baseQuery,
        startAt(countSnapshot.docs[startIndex]),
        limit(itemsPerPage)
      );

      const querySnapshot = await getDocs(paginatedQuery);

      const newOpportunities: Opportunity[] = querySnapshot.docs.map((doc) => {
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
          status: data.status,
        } as Opportunity;
      });

      setOpportunities(newOpportunities);
    } catch (error) {
      if (error instanceof Error) {
        console.log("error: ", error);
        setError("Failed to fetch opportunities: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [searchParams, itemsPerPage]);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        // Update the URL with the new page number
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("page", page.toString());
        window.history.pushState(null, "", `?${newSearchParams.toString()}`);

        // The fetchOpportunities function will be called automatically
        // due to the change in searchParams
      }
    },
    [searchParams, totalPages]
  );

  return {
    opportunities,
    loading,
    error,
    currentPage,
    totalPages,
    goToPage,
  };
};

export default useFetchFilteredOpportunities;
