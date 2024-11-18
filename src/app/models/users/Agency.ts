import { IUser } from "./IUser";

export interface Agency extends IUser {

    id: string;

    // "opportunities" subcollection of type Opportunity
    // "badges" subcollection of type BadgeRequest
}