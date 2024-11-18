import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../firebase/config";
import { uploadProfileImage } from "../uploadProfileImage";
import { IUser } from "../../models/users";

interface UpdateProfileParams {
  userId: string;
  username?: string;
  email?: string;
  mobile?: string;
  biography?: string;
  interests?: string[];
  selectedImage?: File | null;
}

export const updateProfile = async ({
  userId,
  username,
  email,
  mobile,
  biography,
  interests,
  selectedImage,
}: UpdateProfileParams): Promise<Partial<IUser>> => {
  try {
    console.log("Updating profile");
    const userDocRef = doc(firestore, "users", userId);
    const updateData: Partial<IUser> = {};

    if (username) updateData.username = username;
    if (mobile) updateData.mobileNumber = mobile;
    if (biography) updateData.biography = biography;
    if (interests) updateData.interests = interests;

    if (selectedImage) {
      const imageUrl = await uploadProfileImage(selectedImage, email || userId);
      updateData.avatarImageUrl = imageUrl;
    }

    await updateDoc(userDocRef, updateData);
    console.log("Profile updated successfully");

    return updateData; // Return the updated data
  } catch (error) {
    console.error("Error updating profile:", error);
    throw new Error("Failed to update profile");
  }
};
