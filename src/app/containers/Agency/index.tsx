"use client";
import { HStack, VStack } from "@/app/components/Stack";
import InfoCard from "@/app/components/Admin/InfoCard";
import { useRouter } from "next/navigation";
import { AGENCY_URL } from "@/app/utils/constants";
import useRoleProtection from "@/app/hooks/useRoleProtection";
import { UserRole } from "@/app/models/users";
import useGetDocumentsCount from "@/app/hooks/useGetDocumentsCount";
import { useAuth } from "@/app/context/AuthContext";

const Agency = () => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const { isAuthorized, isChecking } = useRoleProtection(UserRole.Agency);
  const { count, loading, error } = useGetDocumentsCount('opportunities', currentUser?.uid);

  if (isChecking || !isAuthorized) {
    return null;
  }

  const handleAgencyUsersClick = () => {
    router.push(`${AGENCY_URL}/agency-users`);
  };

  const handleAgencyOpportunitiesClick = () => {
    router.push(`${AGENCY_URL}/all-opportunities`);
  };

  return (
    <>
      <VStack spacing={30} className="w-full">
        <h4>Agency Dashboard</h4>
        <HStack spacing={21.0} className="w-full flex-col">
          <InfoCard
            title="Total opportunities created"
            value={count.toLocaleString()}
            statistics={loading ? 'Loading...' : error || '+5.3%'}
            buttonTitle="All opportunities"
            action={handleAgencyOpportunitiesClick}
          />
        </HStack>
      </VStack>
    </>
  );
};

export default Agency;
