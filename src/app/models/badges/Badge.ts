import { Timestamp } from "firebase/firestore";
import { BasicUserDetails } from "../users";

// A normal user can only earn a badge
// An admin can create, edit and delete a badge
// An agency can request for a custom badge
// A badge belongs to a cateogory and an achievement level
// A badge can belong to a specific agency, optional, if requested by an agency

export type Badge = {
    
    id: string;
    name: string;
    description: string;
    color: string;
    imageUrl: string;
    criteria: number;
    agency?: BasicUserDetails;
    category: string[];
    achievementLevel: string;

    createdDate: Timestamp;
    createdBy: BasicUserDetails;
    
    // "earnedUsers" subcollection of type BasicUserDetails
};