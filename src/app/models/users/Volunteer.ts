import { IUser } from "./IUser";

export interface Volunteer extends IUser {

    id: string;

    // "opportunities" subcollection of type Opportunity
    // "badges" subcollection of type Badge
}