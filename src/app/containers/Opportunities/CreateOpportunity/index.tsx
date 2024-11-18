"use client";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { ADMIN_URL, AGENCY_URL, volunteerOptions } from "@/app/utils/constants"; // Import AGENCY_URL
import { useFormik, FormikProps } from "formik";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import * as Yup from "yup";
import { CalendarDateTime } from "@internationalized/date";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import OpportunityPictureCard from "@/app/components/Opportunities/OpportunityPictureCard";
import OpportunityDetailsCard from "@/app/components/Opportunities/OpportunityDetailsCard";
import { firestore } from "@/app/firebase/config";
import { Opportunity } from "@/app/models/opportunities";
import { uploadOpportunityImage } from "@/app/utils/uploadOpportunityImage";
import NavigationTitle from "@/app/components/Opportunities/NavigationTitle";
import { BasicUserDetails } from "@/app/models/users";
import { BasicBadgeDetails } from "@/app/models/badges/BasicBadgeDetails";

export interface OpportunityFormValues {
  title: string;
  description: string;
  imageUrl: string;
  date: CalendarDateTime;
  criteria: number;
  location: string;
  registrationDeadline: CalendarDateTime;
  additionalInformation: string;
  category?: string[];
  status: string;
  agency?: BasicUserDetails;
  badges?: BasicBadgeDetails[];
  duration?: number;
}

const CreateOpportunity = () => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [role, setRole] = useState<"Admin" | "Agency" | null>(null);

  // Fetch user role from Firestore
  useEffect(() => {
    const fetchUserRole = async () => {
      if (currentUser) {
        try {
          const userDocRef = doc(firestore, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setRole(userData.role as "Admin" | "Agency");
          } else {
            toast.error("User role not found.");
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          toast.error("Failed to retrieve user role.");
        }
      }
    };
    fetchUserRole();
  }, [currentUser]);

  const formik: FormikProps<OpportunityFormValues> =
    useFormik<OpportunityFormValues>({
      initialValues: {
        title: "",
        description: "",
        date: new CalendarDateTime(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          new Date().getDate()
        ),
        criteria: 0,
        location: "",
        registrationDeadline: new CalendarDateTime(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          new Date().getDate()
        ),
        additionalInformation: "",
        imageUrl: "",
        status: "upcoming",
        category: [], // Ensure this is initialized as an empty array
        duration: 0,
      },
      validationSchema: Yup.object({
        title: Yup.string().required("Title is required"),
        description: Yup.string().required("Description is required"),
        date: Yup.date().required("Date is required"),
        location: Yup.string().required("Location is required"),
        registrationDeadline: Yup.date().required(
          "Registration deadline is required"
        ),
        status: Yup.string().required("Status is required"),
        duration: Yup.number().required("Duration is required"),
      }),
      onSubmit: async (values, { setSubmitting }) => {
        try {
          const formattedCategories = values.category?.map((category) =>
            category.toString()
          );

          // Only set agency to current user if role is "Agency"
          const agencyInfo =
            role === "Agency"
              ? {
                  id: currentUser?.uid || "",
                  username: currentUser?.username || "",
                  avatarImageUrl: currentUser?.avatarImageUrl || "",
                }
              : values.agency; // Use the agency from form values if role is Admin

          await handleCreateOpportunity({
            ...values,
            category: formattedCategories,
            agency: agencyInfo,
          });
          setSubmitting(false);
        } catch (error) {
          console.error("Error creating opportunity:", error);
          toast.error("Failed to create opportunity.");
          setSubmitting(false);
        }
      },
    });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };

  const handleCreateOpportunity = async (values: OpportunityFormValues) => {
    try {
      // Set agency data based on the provided values
      const agencyData = values.agency
        ? {
            id: values.agency.id,
            username: values.agency.username,
            avatarImageUrl: values.agency.avatarImageUrl || "",
          }
        : undefined;

      const opportunity: Partial<Opportunity> = {
        title: values.title,
        description: values.description,
        date: Timestamp.fromDate(
          values.date.toDate(Intl.DateTimeFormat().resolvedOptions().timeZone)
        ),
        registrationDeadline: Timestamp.fromDate(
          values.registrationDeadline.toDate(
            Intl.DateTimeFormat().resolvedOptions().timeZone
          )
        ),
        additionalInformation: values.additionalInformation,
        category: values.category || [],
        status: values.status,
        duration: values.duration || 0,
        agency: agencyData,
        location: values.location,
        createdBy: {
          id: currentUser?.uid || "",
          username: currentUser?.username || "",
          avatarImageUrl: currentUser?.avatarImageUrl || "",
        },
        createdDate: Timestamp.now(),
      };
      console.log("Formatted opportunity object:", opportunity); // Log for verification

      const opportunitiesRef = collection(firestore, "opportunities");
      const docRef = await addDoc(opportunitiesRef, opportunity);

      if (selectedImage) {
        const imageUrl = await uploadOpportunityImage(selectedImage, docRef.id);
        await updateDoc(docRef, { imageUrl });
      }

      if (values.badges?.length) {
        const badgesRef = collection(docRef, "badges");
        for (const badge of values.badges) {
          await setDoc(doc(badgesRef, badge.id), badge);
        }
      }

      const redirectUrl = role === "Admin" ? ADMIN_URL : AGENCY_URL;
      toast.success("Opportunity created successfully.");
      router.push(`${redirectUrl}/all-opportunities`);
    } catch (error) {
      console.error("Error creating opportunity:", error);
      toast.error("Failed to create opportunity.");
    }
  };

  if (!role) {
    return <p>Loading...</p>;
  }

  return (
    <div className="w-full space-y-8">
      <NavigationTitle title="Create Opportunity" />
      <div className="w-full flex flex-col space-y-5 md:flex-row md:space-x-5 md:space-y-0">
        <OpportunityPictureCard
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          handleImageChange={handleImageChange}
          role={role} // Pass the role here
        />
        <OpportunityDetailsCard
          formik={formik}
          role={role}
          opportunityId={undefined}
        />
      </div>
    </div>
  );
};

export default CreateOpportunity;
