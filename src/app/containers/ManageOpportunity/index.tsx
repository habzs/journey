"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import BasicCard from "@/app/components/BasicCard";
import { SelectItem, Button, Select, Skeleton } from "@nextui-org/react";
import { toast } from "sonner";
import { firestore } from "@/app/firebase/config";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { Opportunity } from "@/app/models/opportunities/Opportunity";
import { OpportunityVolunteer } from "@/app/models/opportunities/OpportunityVolunteer";

const ManageOpportunity: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string; // Get the opportunity ID from the URL

  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [users, setUsers] = useState<OpportunityVolunteer[]>([]);
  const [statusUpdates, setStatusUpdates] = useState<{ [key: string]: string }>(
    {}
  );

  // Fetch the opportunity by ID and the registered users
  const fetchOpportunityDetails = async () => {
    try {
      // Fetch opportunity details
      const opportunityRef = doc(firestore, "opportunities", id);
      const opportunityDoc = await getDoc(opportunityRef);
      if (opportunityDoc.exists()) {
        setOpportunity(opportunityDoc.data() as Opportunity);

        // Fetch registered users from subcollection
        const usersRef = collection(opportunityRef, "users");
        const usersSnapshot = await getDocs(usersRef);
        const usersData: OpportunityVolunteer[] = usersSnapshot.docs.map(
          (doc) => ({
            ...(doc.data() as OpportunityVolunteer),
            id: doc.id,
          })
        );

        setUsers(usersData);
      } else {
        toast.error("Opportunity not found!");
      }
    } catch (error: any) {
      toast.error("Failed to fetch opportunity details: " + error.message);
    }
  };

  // Fetch opportunity and users on component mount
  useEffect(() => {
    if (id) {
      fetchOpportunityDetails();
    }
  }, [id]);

  // Handle status change for a user
  const handleStatusChange = (userId: string, newStatus: string) => {
    setStatusUpdates((prev) => ({
      ...prev,
      [userId]: newStatus,
    }));
  };

  // Update the status of users in the subcollection
  const updateStatuses = async () => {
    try {
      const opportunityRef = doc(firestore, "opportunities", id);

      // Update each user's status in the subcollection
      for (const [userId, status] of Object.entries(statusUpdates)) {
        const userRef = doc(opportunityRef, "users", userId);
        await updateDoc(userRef, { status });
      }

      toast.success("Statuses updated successfully!");
      fetchOpportunityDetails(); // Refresh users data
    } catch (error: any) {
      toast.error("Failed to update statuses: " + error.message);
    }
  };

  if (loading) {
    return (
      <BasicCard>
        <Skeleton className="w-2/6 h-[36px] rounded-lg" />
        <div className="space-y-4">
          <Skeleton className="w-full h-[56px] rounded-lg" />
          <Skeleton className="w-full h-[56px] rounded-lg" />
          <Skeleton className="w-full h-[56px] rounded-lg" />
          <Skeleton className="w-full h-[56px] rounded-lg" />
        </div>
        <Skeleton className="w-1/6 h-[40px] rounded-lg" />
      </BasicCard>
    );
  }

  if (!currentUser) {
    router.push("/login"); // Redirect to login if user is not authenticated
    return null;
  }

  return (
    <div className="w-full">
      <BasicCard className="space-y-6">
        {/* Opportunity details */}
        {opportunity ? (
          <>
            <h4 className="text-lg font-semibold">
              Manage Opportunity: {opportunity.title}
            </h4>
            <p>{opportunity.description}</p>

            <h5 className="text-md font-semibold">Registered Users</h5>
            {users.length > 0 ? (
              users.map((user) => {
                const selectedStatus = statusUpdates[user.id] || user.status;

                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between"
                  >
                    <p>{user.username}</p>{" "}
                    {/* Display user details as needed */}
                    <Select
                      label="Status"
                      selectedKeys={new Set([selectedStatus])}
                      onSelectionChange={(keys) => {
                        const newStatus = Array.from(keys)[0] as string;
                        handleStatusChange(user.id, newStatus);
                      }}
                    >
                      <SelectItem key="Accepted">Accepted</SelectItem>
                      <SelectItem key="Rejected">Rejected</SelectItem>
                      <SelectItem key="Confirmed">Confirmed</SelectItem>
                      <SelectItem key="Completed">Completed</SelectItem>
                    </Select>
                  </div>
                );
              })
            ) : (
              <p>No users have registered for this opportunity yet.</p>
            )}

            {/* Update Status Button */}
            <Button onClick={updateStatuses} color="primary">
              Update Statuses
            </Button>
          </>
        ) : (
          <Skeleton className="w-full h-[36px] rounded-lg" />
        )}
      </BasicCard>
    </div>
  );
};

export default ManageOpportunity;
