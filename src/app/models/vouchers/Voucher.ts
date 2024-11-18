import { Timestamp } from "firebase/firestore";
import { BasicUserDetails } from "../users";
import { VoucherStatus } from "./VoucherStatus";

// A normal user can only redeem a voucher
// An admin can create, edit and delete a voucher
// An agency does not have anything to do with voucher
// One voucher is tied to one QR code for receiving reward
// Vouchers will not even appear for users who do not meet the criteria - validate on server

export type Voucher = {
    
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;
    qrCodeUrl: string;
    status: VoucherStatus;  // Not sure how exactly we gon implement the entire voucher thing, this might not be necessary
    minimumCriteria: number;
    expiratedDate: Timestamp;

    createdDate: Timestamp;
    createdBy: BasicUserDetails;

    // We first get "vouchers/{voucherId}", which we won't be able to get the subcollection
    // Then we fetch from "vouchers/{voucherId}/redeemedUsers" to get the subcollection and populate this field
    // Optional, this will be useful if we want to display all users who have redeemed this voucher
    redeemedUsers?: BasicUserDetails[];

    // "redeemedUsers" subcollection of type BasicUserDetails
};