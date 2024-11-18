'use server'
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { firestore, storage } from "@/app/firebase/config";
import { adminAuth } from "@/app/firebase/firebaseAdmin";
import { deleteObject, ref } from "firebase/storage";

interface DeleteUserParams {
    userId: string
}

export const adminDeleteUser = async ({
    userId,
}: DeleteUserParams) => {
    try {
        const user = await adminAuth.getUser(userId);
        const email = user.email;

        // Delete the profile image from storage
        const profileImageRef = ref(storage, `user/${email}.png`);
        try {
            await deleteObject(profileImageRef);
        } catch (error) {
            console.warn(`Failed to delete profile image for user ${email}:`, error);
        }

        // Delete user data from Firestore
        const userRef = doc(firestore, "users", userId);
        await deleteDoc(userRef);

        // Delete user authentication
        await adminAuth.deleteUser(userId);
    } catch (error) {
        throw error;
    }
};