"use client";

import BasicCard from "@/app/components/BasicCard";
import { useAuth } from "@/app/context/AuthContext";
import useFetchOpportunity from "@/app/hooks/useFetchOpportunity";
import { IUser } from "@/app/models/users";
import { OPPORTUNITIES_URL } from "@/app/utils/constants";
import { getLabelFromValue } from "@/app/utils/utilities";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import {
  Button,
  Chip,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import {
  arrayUnion,
  collection,
  doc,
  getFirestore,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import moment from "moment";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

interface InfoPageProps {
  params: {
    id: string;
  };
}

interface ITime {
  seconds: number;
  nanoseconds: number;
}

const convertDateToString = (timestamp: ITime) => {
  const date = new Date(timestamp.seconds * 1000);
  return moment(date).format("MMMM Do, YYYY");
};

const convertToTime = (timestamp: ITime) => {
  const date = new Date(timestamp.seconds * 1000);
  return moment(date).format("h:mm a");
};

const handleApply = async (
  opportunityID: string,
  currentUser: any,
  refreshUserData: () => Promise<void>
) => {
  const db = getFirestore();

  if (!currentUser || !opportunityID) {
    throw new Error("User not logged in or opportunity not found");
  }

  // Update user document
  const userDocRef = doc(db, "users", currentUser.uid);
  await updateDoc(userDocRef, {
    [`opportunities.${opportunityID}`]: "pending",
  });

  // Update opportunity document
  const signedUpVolunteersCollectionRef = collection(
    db,
    "opportunities",
    opportunityID,
    "signedUpVolunteers"
  );
  await setDoc(doc(signedUpVolunteersCollectionRef, currentUser.uid), {
    avatarImageUrl: currentUser.avatarImageUrl,
    username: currentUser.username,
    status: "pending",
  });

  // Refresh user data
  await refreshUserData();
};

const ApplyButton: React.FC<{
  currentUser: IUser | null;
  opportunityId: string;
  onOpen: () => void;
}> = ({ currentUser, opportunityId, onOpen }) => {
  const getButtonState = () => {
    if (!currentUser) {
      return {
        text: "Login to register",
        disabled: true,
      };
    }

    const opportunityStatus = currentUser.opportunities[opportunityId];

    switch (opportunityStatus) {
      case "pending":
      case "accepted":
        return {
          text: "Registered",
          disabled: true,
          color: "primary" as const,
        };
      case "rejected":
        return { text: "Rejected", disabled: true, color: "primary" as const };
      case "completed":
        return { text: "Completed", disabled: true, color: "success" as const };
      case "cancelled":
        return { text: "Cancelled", disabled: true, color: "primary" as const };
      default:
        return { text: "Register", disabled: false, color: "primary" as const };
    }
  };

  const { text, disabled, color } = getButtonState();

  return (
    <Button
      color={color}
      className="w-fit"
      isDisabled={disabled}
      onClick={disabled ? undefined : onOpen}
    >
      {text}
    </Button>
  );
};

const ConfrimationModal: React.FC<{
  isOpen: boolean;
  dateTime: Timestamp;
  location: string;
  opportunityID: string;
  onOpenChange: () => void;
  currentUser: any;
  refreshUserData: () => Promise<void>;
}> = ({
  isOpen,
  onOpenChange,
  dateTime,
  location,
  opportunityID,
  currentUser,
  refreshUserData,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmation = async () => {
    setIsLoading(true);
    try {
      await handleApply(opportunityID, currentUser, refreshUserData);
      toast.success("You have successfully registered for this opportunity.");
      onOpenChange();
    } catch (error) {
      console.error("Error applying for opportunity:", error);
      toast.error("Failed to register for the opportunity. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Confirm registration
            </ModalHeader>
            <ModalBody>
              <p>
                <b>Date: </b>
                {convertDateToString(dateTime)}
              </p>
              <p>
                <b>Time: </b>
                {convertToTime(dateTime)}
              </p>
              <p>
                <b>Location: </b>
                {location}
              </p>
              <p>Please confirm your registration to proceed.</p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button
                color="primary"
                onPress={handleConfirmation}
                isLoading={isLoading}
              >
                Confirm
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

const DetailedOpportunity: React.FC<InfoPageProps> = ({ params }) => {
  const router = useRouter();
  const { opportunity, loading, error } = useFetchOpportunity(params.id);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { currentUser, refreshUserData } = useAuth();

  const opportunityId = params.id;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner color="primary" />
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>{error}</p>
      </div>
    );
  }

  const handleBackNavigation = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      window.close();
    }
  };

  return (
    <div className="space-y-9 flex flex-col justify-center w-full">
      <div className="flex justify-between">
        <Button
          color="primary"
          variant="light"
          startContent={<ArrowLeftIcon className="size-6" />}
          className="w-fit"
          onClick={handleBackNavigation}
        >
          Back
        </Button>
        <ApplyButton
          currentUser={currentUser}
          opportunityId={opportunityId}
          onOpen={onOpen}
        />
      </div>

      <div className="relative w-full lg:max-w-[60%] h-full aspect-video mx-auto flex">
        <Image
          alt="Opportunity image"
          className="object-cover rounded-xl aspect-video w-full h-full"
          src={opportunity.imageUrl}
          width={0}
          height={0}
          sizes="100vw"
          isBlurred
        />
      </div>

      <div className="flex flex-wrap justify-between items-center sticky top-[64px] z-10 py-3 gap-x-10">
        <div className="absolute bg-white bg-opacity-75 backdrop-blur-lg w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-full -z-10 opportunity-header-mask" />
        <div>
          <p className="md:text-4xl text-3xl font-bold">{opportunity.title}</p>
          <p className="text-slate-500 font-mono">
            {opportunity.agency.username}
          </p>
        </div>
        <p className="uppercase text-slate-700 font-semibold">
          {`${convertDateToString(opportunity.date)}`}
        </p>
      </div>

      <div className="!mt-3">
        <p className="text-2xl font-bold pb-2">Category</p>
        <div className="flex flex-wrap gap-3">
          {opportunity.category.map((category) => {
            return (
              <Link
                target="_blank"
                href={`${OPPORTUNITIES_URL}?page=1&categories=${category}`}
                key={category}
              >
                <Chip color="primary">{getLabelFromValue(category)}</Chip>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="gap-9 flex lg:flex-row flex-col justify-center w-full">
        <div className="basis-3/4">
          <p className="text-2xl font-bold pb-2">About</p>
          <div className="space-y-2">
            <p className="ml-1 border-l-3 outline-offset-3 px-4 border-slate-700">
              {opportunity.description}
            </p>
            <p className="ml-1 border-l-3 outline-offset-3 px-4 border-slate-700">
              {opportunity.additionalInformation}
            </p>
          </div>
        </div>

        <BasicCard className="basis-1/4 shadow-none">
          <p className="text-2xl font-bold pb-2">Additional Information</p>
          <div className="flex flex-wrap justify-between gap-6 max-w-[80%] md:max-w-full">
            <div>
              <p className="text-xl font-bold pb-2">Date</p>
              <p className=" border-slate-700">
                {convertDateToString(opportunity.date)}
              </p>
            </div>

            <div>
              <p className="text-xl font-bold pb-2">Time</p>
              <p className=" border-slate-700">
                {convertToTime(opportunity.date)}
              </p>
            </div>

            <div>
              <p className="text-xl font-bold pb-2">Duration</p>
              <p className=" border-slate-700">{opportunity.duration} hours</p>
            </div>

            <div>
              <p className="text-xl font-bold pb-2">Location</p>
              <p className=" border-slate-700">{opportunity.location}</p>
            </div>

            <div>
              <p className="text-xl font-bold pb-2">Registration deadline</p>
              <p className=" border-slate-700">
                {convertDateToString(opportunity.registrationDeadline)}
              </p>
            </div>
          </div>
        </BasicCard>
      </div>

      <ApplyButton
        currentUser={currentUser}
        opportunityId={opportunityId}
        onOpen={onOpen}
      />
      <ConfrimationModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        dateTime={opportunity.date}
        location={opportunity.location}
        opportunityID={params.id}
        currentUser={currentUser}
        refreshUserData={refreshUserData}
      />
    </div>
  );
};

export default DetailedOpportunity;
