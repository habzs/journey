"use client";

import {
  OpportunityCard,
  OpportunityCardSkeleton,
} from "@/app/components/OpportunityCard";
import { OpportunityFilter } from "@/app/components/OpportunityFilter";
import useFetchFilteredOpportunities from "@/app/hooks/useFetchFilteredOpportunities";
import useFetchUserRecommend from "@/app/hooks/useFetchUserRecommendation";
import { Opportunity } from "@/app/models/opportunities";
import { getLabelFromValue } from "@/app/utils/utilities";
import {
  FaceFrownIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { Pagination, Tooltip, Button } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import Link from "next/link";

import { useAuth } from "@/app/context/AuthContext";
import BasicCard from "@/app/components/BasicCard";
import { SIGNIN_URL, SIGNUP_URL } from "@/app/utils/constants";

const renderOpportunities = (
  opportunities: Opportunity[],
  loading: boolean
) => {
  if (loading) {
    let skeletonCards = [];
    for (let i = 0; i < 2; i++) {
      skeletonCards.push(<OpportunityCardSkeleton key={i} />);
    }
    return skeletonCards;
  }

  return opportunities.map((opportunity) => {
    const { id, title, location, date, imageUrl, status } = opportunity;

    if (status === "completed" || status === "closed") {
      return null;
    }

    let category = "";

    if (opportunity.category === undefined) {
      category = "Other";
    } else {
      category = getLabelFromValue(opportunity.category[0]);
    }

    return (
      <OpportunityCard
        key={id}
        id={id}
        title={title}
        date={date}
        address={location}
        image={imageUrl}
        category={category}
      />
    );
  });
};

const Opportunities = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { currentUser } = useAuth();

  const { opportunities, loading, error, currentPage, totalPages, goToPage } =
    useFetchFilteredOpportunities(8);

  const {
    opportunities: recommendedOpportunities,
    loading: loadingRecommendations,
    error: errorRecommendations,
  } = useFetchUserRecommend(currentUser, 8);

  const handleClearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete("categories");
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  }, [router, searchParams]);

  const handlePageChange = useCallback(
    (page: number) => {
      goToPage(page);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    [goToPage]
  );

  const renderRecommendationsSection = () => {
    if (!currentUser) {
      return (
        <BasicCard className="shadow-none">
          <p className="text-base sm:text-xl text-center">
            Sign in to get personalized opportunity recommendations!
          </p>
          <div className="flex gap-2 mx-auto w-fit">
            <Button as={Link} href={SIGNUP_URL} color="primary">
              Sign Up
            </Button>
            <Button as={Link} href={SIGNIN_URL} color="primary" variant="flat">
              Sign In
            </Button>
          </div>
        </BasicCard>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loadingRecommendations ? (
          [...Array(4)].map((_, index) => (
            <OpportunityCardSkeleton key={index} />
          ))
        ) : errorRecommendations ? (
          <div className="text-red-500">
            Error loading recommendations: {errorRecommendations}
          </div>
        ) : recommendedOpportunities && recommendedOpportunities.length > 0 ? (
          renderOpportunities(recommendedOpportunities, false)
        ) : (
          <BasicCard className="col-span-full flex flex-col items-center text-center space-y-4 shadow-none">
            <FaceFrownIcon className="size-24 text-gray-500" />
            <p className="text-base sm:text-xl">
              We don&apos;t have any recommendations for you yet. Keep exploring
              opportunities to help us understand your interests!
            </p>
          </BasicCard>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-10 w-full">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="mr-3">Available Opportunities</h4>
          <OpportunityFilter handleClearFilters={handleClearFilters} />
        </div>

        {totalPages === 0 ? (
          <div className="flex flex-col items-center text-center space-y-4">
            <FaceFrownIcon className="size-24" />
            <h5 className="font-normal">
              There doesn&apos;t seem to be any available opportunities at the
              moment.
            </h5>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-4">
              {renderOpportunities(opportunities, loading)}
            </div>
            <div className="w-fit ml-auto">
              <Pagination
                total={totalPages}
                showControls
                page={currentPage}
                onChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <svg
            className="w-10 h-10"
            fill="none"
            stroke="url(#grad1)"
            strokeWidth={1.25}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop
                  offset="0%"
                  style={{ stopColor: "#b794f4", stopOpacity: 1 }}
                />
                <stop
                  offset="50%"
                  style={{ stopColor: "#ed64a6", stopOpacity: 1 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#f56565", stopOpacity: 1 }}
                />
              </linearGradient>
            </defs>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
            />
          </svg>

          <h4>Recommended for you</h4>
          <Tooltip showArrow={true} content="Generated by GPT-4">
            <InformationCircleIcon className="size-6 text-gray-700" />
          </Tooltip>
        </div>
        {renderRecommendationsSection()}
      </div>
    </div>
  );
};

export default Opportunities;
