import { useState, useEffect } from "react";
import { Opportunity } from "../models/opportunities";
import { UserRole } from "../models/users/UserRole";

const useFetchUserRecommend = (currentUser: any, limitCount?: number) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    if (currentUser && currentUser.role === UserRole.Volunteer) {
      try {
        const response = await fetch(
          `/api/getRecommend?userId=${currentUser.uid}&limit=${limitCount || 8}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch recommendations");
        }
        const data = await response.json();
        setOpportunities(data.opportunities || []);
      } catch (error) {
        if (error instanceof Error) {
          setError("Failed to fetch recommended opportunities: " + error.message);
        }
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [currentUser]);

  return {
    opportunities,
    loading,
    error,
  };
};

export default useFetchUserRecommend;
