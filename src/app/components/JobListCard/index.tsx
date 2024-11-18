"use client";

import React from "react";
import { Link } from "@nextui-org/react";
import BasicCard from "@/app/components/BasicCard";
import { Opportunity } from "@/app/models/opportunities/Opportunity";
import { MANAGE_OPPORTUNITY_URL } from "@/app/utils/constants";

// Define the props type
type JobListCardProps = {
  opportunities: Opportunity[];
};

// JobListCard Component to display the list of opportunities
const JobListCard: React.FC<JobListCardProps> = ({ opportunities }) => {
  return (
    <BasicCard className="w-full">
      <h4 className="text-lg font-semibold">Current Opportunities</h4>
      <ul className="@container">
        {/* <ul className="space-y-4 @container"> */}
        {opportunities.map((opportunity) => (
          <li key={opportunity.id}>
            <Link
              href={`${MANAGE_OPPORTUNITY_URL}/${opportunity.id}`}
              className="p-3"
              // disableAnimation={true}
              isBlock={true}
            >
              <div className="@md:flex @md:justify-between @md:space-x-3 hidden">
                <span className="basis-1/5">{opportunity.title}</span>
                <span className="basis-4/5 text-sm text-gray-500">
                  {opportunity.description}
                </span>
              </div>

              <div className="@md:hidden block">
                <p>{opportunity.title}</p>
                <span className="text-sm text-gray-500">
                  {opportunity.description}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </BasicCard>
  );
};

export default JobListCard;
