import { Timestamp } from "firebase/firestore";
import { BasicUserDetails } from "@/app/models/users";

export type Opportunity = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: Timestamp;
  criteria: number;
  location: string;
  registrationDeadline: Timestamp;
  additionalInformation: string;
  category: string[];
  status: string;
  agency: BasicUserDetails;
  duration: number;

  createdDate: Timestamp;
  createdBy: BasicUserDetails;
  lastEditedDate?: Timestamp;
  lastEditedBy?: BasicUserDetails;

  // "signedUpVolunteers" subcollection of type OpportunityVolunteer
  // "badges" subcollection of type BasicBadgeDetails
};
