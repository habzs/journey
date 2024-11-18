"use client";
import { HStack, VStack } from "@/app/components/Stack";
import InfoCard from "../../components/Admin/InfoCard";
import { useRouter } from "next/navigation";
import { ADMIN_URL } from "@/app/utils/constants";
import useRoleProtection from "@/app/hooks/useRoleProtection";
import { UserRole } from "@/app/models/users";
import useGetDocumentsCount from "@/app/hooks/useGetDocumentsCount";

const Admin = () => {
  const router = useRouter();
  const { isAuthorized, isChecking } = useRoleProtection(UserRole.Admin);

  const { count: usersCount, loading: usersLoading, error: usersError } = useGetDocumentsCount('users');
  const { count: opportunitiesCount, loading: opportunitiesLoading, error: opportunitiesError } = useGetDocumentsCount('opportunities');
  const { count: badgesCount, loading: badgesLoading, error: badgesError } = useGetDocumentsCount('badges');

  if (isChecking || !isAuthorized) {
    return null;
  }

  const handleAllUsersClick = () => {
    router.push(`${ADMIN_URL}/all-users`);
  };

  const handleAllOpportunitiesClick = () => {
    router.push(`${ADMIN_URL}/all-opportunities`);
  };

  const handleAllBadgesClick = () => {
    router.push(`${ADMIN_URL}/all-badges`);
  };

  return (
    <>
      <VStack spacing={30} className="w-full">
        <h4>Admin Dashboard</h4>
        <HStack spacing={21.0} className="w-full flex-col">
          <InfoCard
            title="Total active users"
            value={usersCount.toLocaleString()}
            statistics={usersLoading ? 'Loading...' : usersError || '+2.6%'}
            buttonTitle="All users"
            action={handleAllUsersClick}
          />
          <InfoCard
            title="Total opportunities created"
            value={opportunitiesCount.toLocaleString()}
            statistics={opportunitiesLoading ? 'Loading...' : opportunitiesError || '+5.3%'}
            buttonTitle="All opportunities"
            action={handleAllOpportunitiesClick}
          />
          <InfoCard
            title="Total badges earned"
            value={badgesCount.toLocaleString()}
            statistics={badgesLoading ? 'Loading...' : badgesError || '+0.1%'}
            buttonTitle="All badges"
            action={handleAllBadgesClick}
          />
        </HStack>
      </VStack>
    </>
  );
};

export default Admin;
