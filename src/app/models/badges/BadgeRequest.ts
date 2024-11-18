import { Timestamp } from "firebase/firestore";
import { BadgeRequestStatus } from ".";
import { BasicUserDetails } from "../users";
import { SelectOption } from "@/app/utils/constants";

export type BadgeRequest = {

    id: string;
    name: string;
    description: string;
    criteria: number;
    category: SelectOption;
    achievementLevel: SelectOption;
    status: BadgeRequestStatus;

    createdDate: Timestamp;
    createdBy: BasicUserDetails;

};