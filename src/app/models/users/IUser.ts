import { User } from "firebase/auth";

export type IUserDetails = {
  username: string;
  biography: string;
  avatarImageUrl: string;
  interests: string[];
  mobileNumber: string;
  role: string;
  badgesEarned: string[];
  opportunities: {
    [key: string]: IOpportunityStatus;
  };
};

export type IOpportunityStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "completed"
  | "cancelled";

export type IUser = User & IUserDetails;
