"use client";

import { DETAILED_OPPORTUNITY_URL } from "@/app/utils/constants";
import { Card, CardBody, CardHeader, Chip, Image } from "@nextui-org/react";
import { Timestamp } from "firebase/firestore";
import Link from "next/link";
import React from "react";

export interface OppCardsProps {
  id: string;
  title: string;
  date: Timestamp;
  address: string;
  image: string | undefined;
  category: string;
  className?: string;
}

const getDateString = (date: { seconds: number; nanoseconds: number }) => {
  let dateObj: Date;

  if (date instanceof Timestamp) {
    dateObj = date.toDate();
  } else if (
    typeof date === "object" &&
    "seconds" in date &&
    "nanoseconds" in date
  ) {
    dateObj = new Timestamp(date.seconds, date.nanoseconds).toDate();
  } else if (typeof date === "string") {
    dateObj = new Date(date);
  } else {
    dateObj = new Date();
    console.warn("Invalid date format provided");
  }

  // Array of month names
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Function to add ordinal suffix to day
  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const month = months[dateObj.getMonth()];
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  const formattedHours = hours % 12 || 12;

  // Pad minutes with leading zero if necessary
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${month} ${day}${getOrdinalSuffix(
    day
  )} ${year}, ${formattedHours}:${formattedMinutes} ${ampm}`;
};

export const OpportunityCard: React.FC<OppCardsProps> = ({
  id,
  title,
  date,
  address,
  image,
  category = "Other",
}) => {
  return (
    <Link
      href={`${DETAILED_OPPORTUNITY_URL}/${id}`}
      className="w-full"
      data-testid="opportunity-card"
    >
      <Card
        className="flex items-center justify-center w-full h-full"
        shadow="sm"
      >
        <CardHeader>
          <div className="relative w-full h-auto aspect-video">
            <Image
              alt="Opportunity image"
              className="object-cover rounded-xl aspect-video w-full h-full relative"
              src={
                image
                  ? image
                  : `https://nextui.org/images/hero-card-complete.jpeg`
              }
              width={0}
              height={0}
              sizes="100vw"
            />
            <Chip
              className="absolute bottom-0 right-0 m-2 z-10"
              color="primary"
            >
              {category}
            </Chip>
          </div>
        </CardHeader>
        <CardBody className="overflow-visible py-2">
          <h4 className="font-bold text-large truncate">{title}</h4>
          <div className="flex flex-col justify-end">
            <p className="text-sm uppercase font-bold">{getDateString(date)}</p>
            <p className="text-default-500 text-sm max-w-[80%] truncate">
              {address}
            </p>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
};
