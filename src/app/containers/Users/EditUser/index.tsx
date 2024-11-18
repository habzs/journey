"use client";
import { useEffect, useState } from "react";
import useFetchVolunteer from "@/app/hooks/useFetchVolunteer";
import { FormikProps, useFormik } from "formik";
import * as Yup from "yup";
import UserDetailsCard from "./UserDetailsCard";
import ProfilePictureCard from "./ProfilePictureCard";
import { toast } from "sonner";
import { firestore } from "@/app/firebase/config";
import { IUserDetails, UserRole } from "@/app/models/users";
import { doc, updateDoc } from "firebase/firestore";
import { uploadProfileImage } from "@/app/utils/uploadProfileImage";
import { useAuth } from "@/app/context/AuthContext";
import NavigationTitle from "@/app/components/Opportunities/NavigationTitle";

interface EditUserProps {
  params: {
    userId: string;
  };
}

export interface EditUserFormValues {
  username: string;
  mobileNumber: string;
  biography: string;
  interests: string[];
  role: string;
}

const EditUser: React.FC<EditUserProps> = ({ params }) => {
  const { userId } = params;
  const { currentUser } = useAuth();
  const { user, loading, error } = useFetchVolunteer(userId);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const updateUser = async (
    newDetails: Partial<IUserDetails>
  ): Promise<void> => {
    if (currentUser?.role == UserRole.Admin) {
      try {
        const userRef = doc(firestore, "users", userId);

        let imageUrl = newDetails.avatarImageUrl || user?.avatarImageUrl || "";

        if (selectedImage) {
          console.log("Uploading new avatar...");
          imageUrl = await uploadProfileImage(selectedImage, userId);
          console.log("New avatar uploaded successfully");
        }

        const updatedUser: Partial<IUserDetails> = {
          ...newDetails,
          avatarImageUrl: imageUrl,
        };

        await updateDoc(userRef, updatedUser);
        console.log("User details updated successfully");
      } catch (error) {
        console.error("Error updating user details:", error);
        throw error;
      }
    }
  };

  const formik: FormikProps<EditUserFormValues> = useFormik<EditUserFormValues>(
    {
      initialValues: {
        username: user?.username || "",
        biography: user?.biography || "",
        mobileNumber: user?.mobileNumber || "",
        interests: user?.interests || [],
        role: user?.role|| "",
      },
      enableReinitialize: true,
      validationSchema: Yup.object({
        username: Yup.string().required("Username is required"),
        mobileNumber: Yup.string().required("Mobile number is required"),
        biography: Yup.string(),
        interests: Yup.array().of(Yup.string()),
        role: Yup.string().required("Role is required"),
      }),
      onSubmit: async (values, { setSubmitting }) => {
        try {
          await updateUser(values);
          toast.success("Update user successful!");
          setSubmitting(false);
        } catch (error) {
          console.error("Error updating user details:", error);
          setSubmitting(false);
        } finally {
          setSubmitting(false);
        }
      },
    }
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  useEffect(() => {
    if (user && user.avatarImageUrl) {
      setAvatarUrl(user.avatarImageUrl);
    }
  }, [user]);

  // TODO: User proper skeleton and alert for error handling
  if (loading) return <p>Loading...</p>;

  return (
    <>
      <div className="w-full space-y-8">
        <NavigationTitle title="Edit User" />
        <div className="w-full flex flex-col space-y-5 md:flex-row md:space-x-5 md:space-y-0">
          <ProfilePictureCard
            userId={userId}
            avatarUrl={avatarUrl}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            handleImageChange={handleImageChange}
          />
          <UserDetailsCard formik={formik} />
        </div>
      </div >
    </>
  );
};

export default EditUser;
