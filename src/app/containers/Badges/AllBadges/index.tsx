"use client";
import { useRouter } from "next/navigation";
import NavigationTitle from "@/app/components/Opportunities/NavigationTitle";
import BadgeCard from "@/app/components/Badges/BadgeCard";
import { Button } from "@nextui-org/react";
import { ADMIN_URL } from "@/app/utils/constants";
import useFetchAllBadges from "@/app/hooks/useFetchAllBadges";

const AllBadges = () => {
  const { badges } = useFetchAllBadges();
  const router = useRouter();

  const handleCreateBadgeClick = () => {
    router.push(`${ADMIN_URL}/create-badge`);
  };

  const handleEditBadgeClick = (badgeId: string) => {
    router.push(`${ADMIN_URL}/badge/${badgeId}`);
  };

  return (
    <div className="w-full space-y-8">
      <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 justify-between">
        <NavigationTitle title="All Badges" />
        <Button color="primary" onClick={handleCreateBadgeClick}>
          New Badge
        </Button>
      </div>
      {badges.length <= 0 ? (
        <p className="text-center pt-9">No badge is created yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-9">
          {badges.map((badge) => (
            <BadgeCard
              key={badge.id}
              badge={badge}
              onClick={() => handleEditBadgeClick(badge.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllBadges;
