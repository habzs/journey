"use client";
import { useAuth } from "@/app/context/AuthContext";
import { FormikProps, useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";
import { CalendarDateTime } from "@internationalized/date";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  Timestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { firestore } from "@/app/firebase/config";
import { Opportunity } from "@/app/models/opportunities";
import { uploadOpportunityImage } from "@/app/utils/uploadOpportunityImage";
import OpportunityDetailsCard from "@/app/components/Opportunities/OpportunityDetailsCard";
import OpportunityPictureCard from "@/app/components/Opportunities/OpportunityPictureCard";
import useFetchOpportunity from "@/app/hooks/useFetchOpportunity";
import { OpportunityFormValues } from "@/app/containers/Opportunities/CreateOpportunity";
import { UserRole } from "@/app/models/users";
import NavigationTitle from "@/app/components/Opportunities/NavigationTitle";

interface EditOpportunityProps {
  params: {
    opportunityId: string;
  };
}

// TODO: Add skeleton when loading
const AgencyEditOpportunity: React.FC<EditOpportunityProps> = ({ params }) => {
  const { opportunityId } = params;
  const { currentUser } = useAuth();
  const { opportunity, badges } = useFetchOpportunity(opportunityId);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
  const [role, setRole] = useState<"Admin" | "Agency" | null>(null); // Track the role

  // Fetch user role on mount
  useEffect(() => {
    if (currentUser) {
      setRole(currentUser.role as "Admin" | "Agency");
    }
  }, [currentUser]);

  const updateOpportunity = async (
    values: OpportunityFormValues
  ): Promise<void> => {
    if (role === "Admin" || role === "Agency") {
      try {
        let updatedOpportunity: Partial<Opportunity> = {
          title: values.title,
          description: values.description,
          imageUrl: values.imageUrl,
          date: Timestamp.fromDate(values.date.toDate(timeZone)),
          criteria: values.criteria || 0,
          location: values.location,
          registrationDeadline: Timestamp.fromDate(
            values.registrationDeadline.toDate(timeZone)
          ),
          additionalInformation: values.additionalInformation,
          category: values.category,
          status: values.status,
          agency: {
            id: values.agency?.id || "",
            username: values.agency?.username || "",
            avatarImageUrl: values.agency?.avatarImageUrl || "",
          },
        };

        const oppRef = doc(firestore, "opportunities", opportunityId);

        if (selectedImage) {
          console.log("Uploading new image...");
          updatedOpportunity.imageUrl = await uploadOpportunityImage(
            selectedImage,
            opportunityId
          );
          console.log("New image uploaded successfully");
        }

        // Update the badges in subcollection
        const badgesCollectionRef = collection(oppRef, "badges");
        const existingBadgesSnapshot = await getDocs(badgesCollectionRef);
        const batch = writeBatch(firestore);
        existingBadgesSnapshot.docs.forEach((doc) => batch.delete(doc.ref));
        values.badges?.forEach((badge) =>
          batch.set(doc(badgesCollectionRef, badge.id), badge)
        );
        await batch.commit();
        console.log("Badges updated successfully");

        // Assign badges to volunteers if status is "completed"
        if (values.status === "completed") {
          const volunteersCollectionRef = collection(
            oppRef,
            "signedUpVolunteers"
          );
          const volunteersSnapshot = await getDocs(volunteersCollectionRef);

          const userBadgeUpdates = volunteersSnapshot.docs.map(
            async (volunteerDoc) => {
              const userId = volunteerDoc.id;
              const userRef = doc(firestore, "users", userId);
              const userBadgesCollectionRef = collection(userRef, "badges");

              const badgeUpdates = values.badges?.map(async (badge) => {
                const userBadgeRef = doc(userBadgesCollectionRef, badge.id);
                await setDoc(userBadgeRef, {
                  ...badge,
                  earnedDate: Timestamp.now(),
                  opportunityId: opportunityId,
                });
              });

              await Promise.all(badgeUpdates || []);
            }
          );

          await Promise.all(userBadgeUpdates);
          console.log("Badges assigned to volunteers successfully");
        }

        await updateDoc(oppRef, updatedOpportunity);
        console.log("Opportunity details updated successfully");
      } catch (error) {
        console.error("Error updating opportunity details:", error);
        throw error;
      }
    }
  };

  const formik: FormikProps<OpportunityFormValues> =
    useFormik<OpportunityFormValues>({
      initialValues: {
        title: opportunity?.title || "",
        description: opportunity?.description || "",
        imageUrl: opportunity?.imageUrl || "",
        date: opportunity?.date
          ? new CalendarDateTime(
              opportunity.date.toDate().getFullYear(),
              opportunity.date.toDate().getMonth() + 1,
              opportunity.date.toDate().getDate(),
              opportunity.date.toDate().getHours(),
              opportunity.date.toDate().getMinutes()
            )
          : new CalendarDateTime(
              new Date().getFullYear(),
              new Date().getMonth() + 1,
              new Date().getDate(),
              new Date().getHours(),
              new Date().getMinutes()
            ),
        criteria: opportunity?.criteria || 0,
        location: opportunity?.location || "",
        registrationDeadline: opportunity?.registrationDeadline
          ? new CalendarDateTime(
              opportunity.registrationDeadline.toDate().getFullYear(),
              opportunity.registrationDeadline.toDate().getMonth() + 1,
              opportunity.registrationDeadline.toDate().getDate(),
              opportunity.registrationDeadline.toDate().getHours(),
              opportunity.registrationDeadline.toDate().getMinutes()
            )
          : new CalendarDateTime(
              new Date().getFullYear(),
              new Date().getMonth() + 1,
              new Date().getDate(),
              new Date().getHours(),
              new Date().getMinutes()
            ),
        additionalInformation: opportunity?.additionalInformation || "",
        category: opportunity?.category,
        status: opportunity?.status || "",
        agency: opportunity?.agency,
        badges: badges || undefined,
        duration: opportunity?.duration,
      },
      enableReinitialize: true,
      validationSchema: Yup.object({
        title: Yup.string().required("Title is required"),
        description: Yup.string().required("Description is required"),
        date: Yup.date().required("Date is required"),
        criteria: Yup.number().required("Criteria is required"),
        location: Yup.string().required("Location is required"),
        registrationDeadline: Yup.date().required(
          "Registration deadline is required"
        ),
        status: Yup.string().required("Status is required"),
      }),
      onSubmit: async (values, { setSubmitting }) => {
        try {
          await updateOpportunity(values);
          toast.success("Update opportunity successful!");
        } catch (error) {
          toast.error(String(error));
        } finally {
          setSubmitting(false);
        }
      },
    });

  useEffect(() => {
    if (opportunity?.imageUrl) {
      setImageUrl(opportunity.imageUrl);
    }
  }, [opportunity]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };

  if (!role) {
    return <p>Loading...</p>; // Show loading until role is resolved
  }

  return (
    <div className="w-full space-y-8">
      <NavigationTitle title="Edit Opportunity" />
      <div className="w-full flex flex-col space-y-5 md:flex-row md:space-x-5 md:space-y-0">
        <OpportunityPictureCard
          opportunityId={opportunityId}
          imageUrl={imageUrl}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          handleImageChange={handleImageChange}
          role={role} // Pass the role here
        />
        <OpportunityDetailsCard
          opportunityId={opportunityId}
          formik={formik}
          role={role} // Pass role as prop
        />
      </div>
    </div>
  );
};

export default AgencyEditOpportunity;
