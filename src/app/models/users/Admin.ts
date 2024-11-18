import { IUser } from './IUser';

export interface Admin extends IUser {
    
    id: string;

    // "createdOpportunities" subcollection of type Opportunity
    // "createdVouchers" subcollection of type Voucher
    // "createdBadges" subcollection of type Badge
}