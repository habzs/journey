"use client";

import { Chip } from "@nextui-org/chip";
import { Avatar, Link, Spinner, useDisclosure } from "@nextui-org/react";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

import BadgeCard from "@/app/components/Badges/BadgeCard";
import Carousel from "@/app/components/Carousel";
import { BadgeDetailModal } from "@/app/components/Modals";
import { OpportunityCard } from "@/app/components/OpportunityCard";
import { useAuth } from "@/app/context/AuthContext";
import { db } from "@/app/firebase/config";
import useFetchBadgeDetails from "@/app/hooks/useFetchBadgeDetails";
import { Badge } from "@/app/models/badges";
import { Opportunity } from "@/app/models/opportunities";
import { IUser } from "@/app/models/users";
import { OPPORTUNITIES_URL } from "@/app/utils/constants";
import { getLabelFromValue } from "@/app/utils/utilities";
import BasicCard from "@/app/components/BasicCard";

interface ProfileHeaderProps {
  currentUser: IUser;
  totalHoursVolunteered: number;
}

interface InterestsSectionProps {
  interests: string[];
}

interface BadgesSectionProps {
  badges: Badge[];
  badgesLoading: boolean;
  currentUser: IUser;
  authLoading: boolean;
  onBadgeClick: (badge: Badge) => void;
}

interface OpportunitiesSectionProps {
  type: "upcoming" | "completed";
  opportunities: Opportunity[];
  currentUser: IUser;
  loading: boolean;
}

interface LevelProgressProps {
  totalHoursVolunteered: number;
}

interface LevelInfo {
  level: number;
  progress: number;
  currentLevelHours: number;
  hoursForNextLevel: number;
}

interface Rank {
  threshold: number;
  name: string;
  color: string;
}

const calculateLevel = (hours: number): LevelInfo => {
  let level = 1;
  let remainingHours = hours;
  let hoursForNextLevel = 5;

  while (remainingHours >= hoursForNextLevel) {
    remainingHours -= hoursForNextLevel;
    level++;
    hoursForNextLevel += 5;
  }

  const totalHoursForLevel = hoursForNextLevel;
  const progress = (remainingHours / totalHoursForLevel) * 100;

  return {
    level,
    progress,
    currentLevelHours: remainingHours,
    hoursForNextLevel,
  };
};

const getRank = (level: number): Rank => {
  const ranks = [
    { threshold: 0, name: "Volunteer Initiate", color: "text-gray-600" },
    { threshold: 5, name: "Community Helper", color: "text-green-600" },
    { threshold: 10, name: "Impact Maker", color: "text-blue-600" },
    { threshold: 15, name: "Change Champion", color: "text-purple-600" },
    { threshold: 20, name: "Community Leader", color: "text-yellow-600" },
    { threshold: 25, name: "Volunteering Master", color: "text-red-600" },
  ];

  return ranks.reduce((highest, rank) =>
    level >= rank.threshold ? rank : highest
  );
};

const LevelProgress: React.FC<LevelProgressProps> = ({
  totalHoursVolunteered,
}) => {
  const { level, progress, currentLevelHours, hoursForNextLevel } =
    calculateLevel(totalHoursVolunteered);
  const rank = getRank(level);

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center">
        <span className={`font-bold ${rank.color}`}>{rank.name}</span>
        <span className="text-sm text-gray-600">Level {level}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-soft-spring"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <span>{currentLevelHours} hours</span>
        <span>{hoursForNextLevel} hours</span>
      </div>
    </div>
  );
};

const Profile = () => {
  const [badgeIds, setBadgeIds] = useState<string[]>([]);
  const [badgeDetails, setBadgeDetails] = useState<Badge>();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [opportunitiesLoading, setOpportunitiesLoading] = useState(true);

  const { currentUser, loading: authLoading } = useAuth();
  const { badges, loading: badgesLoading } = useFetchBadgeDetails(badgeIds);
  const {
    isOpen: isBadgeModalOpen,
    onOpen: badgeModalOnOpen,
    onOpenChange: badgeModalOnOpenChange,
  } = useDisclosure();

  useEffect(() => {
    if (currentUser?.badgesEarned) {
      setBadgeIds(currentUser.badgesEarned);
    }
  }, [currentUser]);

  useEffect(() => {
    const loadOpportunities = async () => {
      if (currentUser) {
        try {
          const opportunitiesRef = collection(db, "opportunities");
          const querySnapshot = await getDocs(opportunitiesRef);
          const fetchedOpportunities = querySnapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() } as Opportunity)
          );
          setOpportunities(fetchedOpportunities);
        } catch (error) {
          console.error("Error fetching opportunities:", error);
        } finally {
          setOpportunitiesLoading(false);
        }
      }
    };

    loadOpportunities();
  }, [currentUser]);

  if (authLoading) return <div>Loading...</div>;
  if (!currentUser) return <div>No user found.</div>;

  const totalHoursVolunteered = opportunities
    .filter((opp) => currentUser.opportunities[opp.id] === "completed")
    .reduce((total, opp) => total + (opp.duration || 0), 0);

  const handleModalOpen = (badge: Badge) => {
    setBadgeDetails(badge);
    badgeModalOnOpen();
  };

  return (
    <div className="flex flex-col space-y-8 mr-auto w-full">
      <ProfileHeader
        currentUser={currentUser}
        totalHoursVolunteered={totalHoursVolunteered}
      />
      <BadgesSection
        badges={badges}
        badgesLoading={badgesLoading}
        currentUser={currentUser}
        authLoading={authLoading}
        onBadgeClick={handleModalOpen}
      />
      <OpportunitiesSection
        type="upcoming"
        opportunities={opportunities}
        currentUser={currentUser}
        loading={opportunitiesLoading}
      />
      <OpportunitiesSection
        type="completed"
        opportunities={opportunities}
        currentUser={currentUser}
        loading={opportunitiesLoading}
      />
      {badgeDetails && (
        <BadgeDetailModal
          isOpen={isBadgeModalOpen}
          onOpen={badgeModalOnOpen}
          onOpenChange={badgeModalOnOpenChange}
          badge={badgeDetails}
        />
      )}
    </div>
  );
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  currentUser,
  totalHoursVolunteered,
}) => (
  <div className="flex gap-y-5 gap-x-9 flex-col md:flex-row items-center md:items-start">
    <div className="space-y-3">
      <Avatar
        src={currentUser.avatarImageUrl}
        className="w-32 h-32 text-large shrink-0"
        isBordered={true}
      />
      <Link
        className="text-sm text-gray-500 m-auto block w-fit"
        href="/profile/edit"
      >
        Edit Profile
      </Link>
    </div>
    <div className="flex flex-col justify-center w-full">
      <div className="text-center md:text-start space-y-2">
        <div className="flex flex-col md:flex-row items-center md:justify-start space-x-2">
          <p className="text-2xl font-bold">{currentUser.username}</p>
          <div className="hidden md:block border h-6 border-slate-300"></div>
          <p className="text-base font-mono">
            <b>{totalHoursVolunteered}</b> hours volunteered
          </p>
        </div>
        <p>{currentUser.biography}</p>
        <LevelProgress totalHoursVolunteered={totalHoursVolunteered} />
      </div>
      <div className="border-t-2 my-2 border-slate-300 w-full" />
      <InterestsSection interests={currentUser.interests} />
    </div>
  </div>
);

const InterestsSection: React.FC<InterestsSectionProps> = ({ interests }) => {
  const [showAll, setShowAll] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-slate-800 font-semibold">Interests:</p>
      <div className="hidden md:flex gap-2 flex-wrap">
        {interests.map((interest) => {
          const label = getLabelFromValue(interest);
          return label ? (
            <Link
              target="_blank"
              href={`${OPPORTUNITIES_URL}?page=1&categories=${interest}`}
              key={interest}
            >
              <Chip color="primary">{label}</Chip>
            </Link>
          ) : null;
        })}
      </div>

      <div className="flex md:hidden gap-2 flex-wrap">
        {(showAll ? interests : interests.slice(0, 3)).map((interest) => {
          const label = getLabelFromValue(interest);
          return label ? (
            <Link
              target="_blank"
              href={`${OPPORTUNITIES_URL}?page=1&categories=${interest}`}
              key={interest}
            >
              <Chip color="primary">{label}</Chip>
            </Link>
          ) : null;
        })}
        {!showAll && interests.length > 3 && (
          <Chip
            className="hover:cursor-pointer"
            color="primary"
            variant="bordered"
            onClick={() => setShowAll(true)}
          >
            + {interests.length - 3} more
          </Chip>
        )}
      </div>
    </div>
  );
};

const BadgesSection: React.FC<BadgesSectionProps> = ({
  badges,
  badgesLoading,
  currentUser,
  authLoading,
  onBadgeClick,
}) => {
  if (badgesLoading || authLoading) {
    return (
      <div className="text-center">
        <Spinner />
      </div>
    );
  }

  if (!badges || badges.length === 0) {
    return currentUser.badgesEarned.length > 0 ? (
      <div className="text-center">
        <Spinner />
      </div>
    ) : (
      <div className="space-y-3">
        <p className="text-2xl font-bold">Badges</p>
        <BasicCard className="shadow-none text-center">
          <p className="text-gray-600">Volunteer to earn your first badge!</p>
        </BasicCard>
      </div>
    );
  }

  const badgeSlides = badges.map((badge) => (
    <BadgeCard
      badge={badge}
      truncated
      key={badge.id}
      onClick={() => onBadgeClick(badge)}
    />
  ));

  return (
    <div>
      <p className="text-2xl font-bold">Badges</p>
      <Carousel
        slides={badgeSlides}
        arrows={true}
        carouselOptions={{
          align: "start",
          slidesToScroll: "auto",
        }}
      />
    </div>
  );
};

const OpportunitiesSection: React.FC<OpportunitiesSectionProps> = ({
  type,
  opportunities,
  currentUser,
  loading,
}) => {
  const filteredOpportunities = opportunities.filter((opp) => {
    const status = currentUser.opportunities[opp.id];
    if (type === "upcoming") {
      return status === "pending" || status === "accepted";
    } else if (type === "completed") {
      return status === "completed" || status === "cancelled";
    }
    return false;
  });

  const renderContent = () => {
    if (loading) return <Spinner />;
    if (filteredOpportunities.length === 0) {
      return type === "upcoming" ? (
        <BasicCard className="shadow-none text-center">
          <p className="text-gray-600">
            You don&apos;t have any upcoming opportunities.
          </p>
          <Link
            href={OPPORTUNITIES_URL}
            className="text-blue-500 hover:underline"
          >
            Explore and register for new opportunities!
          </Link>
        </BasicCard>
      ) : (
        <BasicCard className="shadow-none text-center text-gray-600">
          <p>You haven&apos;t completed any opportunities yet.</p>
          <p> Start volunteering to see your impact grow!</p>
        </BasicCard>
      );
    }

    const opportunitySlides = filteredOpportunities.map((opp) => (
      <OpportunityCard
        key={opp.id}
        id={opp.id}
        title={opp.title}
        date={opp.date}
        address={opp.location}
        image={opp.imageUrl}
        category={getLabelFromValue(opp.category[0])}
      />
    ));

    return (
      <Carousel
        slides={opportunitySlides}
        arrows={true}
        carouselOptions={{
          align: "start",
          slidesToScroll: 1,
        }}
      />
    );
  };

  return (
    <div className="space-y-4">
      <p className="text-2xl font-bold">
        {type === "upcoming" ? "Upcoming" : "Completed"} Opportunities (
        {filteredOpportunities.length})
      </p>
      {renderContent()}
    </div>
  );
};

export default Profile;
