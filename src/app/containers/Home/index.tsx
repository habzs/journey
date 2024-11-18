"use client";

import Carousel from "@/app/components/Carousel";
import { FlipWords } from "@/app/components/Flipwords";
import { OpportunityCard } from "@/app/components/OpportunityCard";
import { useAuth } from "@/app/context/AuthContext";
import useFetchAllOpportunities from "@/app/hooks/useFetchAllOpportunities";
import { Opportunity } from "@/app/models/opportunities";
import { OPPORTUNITIES_URL } from "@/app/utils/constants";
import { getLabelFromValue } from "@/app/utils/utilities";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Button, Image, Link } from "@nextui-org/react";


let oppSlides: React.JSX.Element[] = [];
const heroWords = ["Volunteering,", "Aiding,", "Supporting,"];

export default function Home() {
  const { currentUser } = useAuth();
  
  // Fetch all opportunities (from the general pool)
  const { opportunities, loading, error } = useFetchAllOpportunities(
    currentUser,
    7
  );

  let oppSlides: React.JSX.Element[] = [];
  

  if (!loading && !error && opportunities) {
    oppSlides = opportunities.map((opp: Opportunity) => {
      const { title, date, location, imageUrl, id } = opp;
      let category = "";

      if (opp.category === undefined) {
        category = "Other";
      } else {
        category = getLabelFromValue(opp.category[0]);
      }

      return (
        <OpportunityCard
          key={id}
          title={title}
          date={date}
          address={location}
          image={imageUrl}
          id={id}
          category={category}
        />
      );
    });

    oppSlides.push(
      <Link
        className="w-full h-full rounded-2xl border-2 border-primary flex flex-col items-center justify-center group space-y-2"
        href={OPPORTUNITIES_URL}
      >
        <p>View more</p>
        <ArrowRightIcon className="size-6 group-hover:translate-x-2 transition-transform stroke-[3]" />
      </Link>
    );
  }

  

  return (
    <div className="space-y-16 w-full">
      <div className="flex items-center justify-between gap-6 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
            <FlipWords words={heroWords} />
            <br /> gamified.
          </h1>
          <p className="max-w-[600px] text-gray-500 md:text-xl lg:text-base xl:text-xl">
            Discover how you can make a difference in your community by
            volunteering with Journey.
          </p>

          <Button as={Link} href={OPPORTUNITIES_URL} color="primary">
            Get Started
          </Button>
        </div>

        <Image
          alt="Hero"
          className="hidden lg:flex mx-auto aspect-video overflow-hidden rounded-xl object-bottom"
          src="https://images.unsplash.com/photo-1628717341663-0007b0ee2597?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          width="650"
          isBlurred
        />
      </div>

      <div className="pb-[100px] w-full">
        <h1 className="text-2xl font-bold tracking-tighter md:text-3xl/tight pb-3">
          Available Opportunities
        </h1>

        <Carousel
          slides={oppSlides}
          arrows
          carouselOptions={{
            // align: "start",
            slidesToScroll: "auto",
          }}
        />
      </div>
    </div>
  );
}
