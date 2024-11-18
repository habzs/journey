"use client";
import { useAuth } from "@/app/context/AuthContext";
import { FormikProps, useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "@/app/firebase/config";
import { uploadOpportunityImage } from "@/app/utils/uploadOpportunityImage";
import { UserRole } from "@/app/models/users";
import NavigationTitle from "@/app/components/Opportunities/NavigationTitle";
import useFetchBadge from "@/app/hooks/useFetchBadge";
import { BadgeFormValues } from "../CreateBadge";
import { Badge } from "@/app/models/badges";
import BadgeDetailsCard from "@/app/components/Badges/BadgeDetailsCard";
import BadgePictureCard from "@/app/components/Badges/BadgePictureCard";

interface EditBadgeProps {
    params: {
        badgeId: string;
    };
}

// TODO: Add skeleton when loading
const EditBadge: React.FC<EditBadgeProps> = ({ params }) => {

    const { badgeId } = params;
    const { currentUser } = useAuth();
    const { badge, loading, error } = useFetchBadge(badgeId);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const updateBadge = async (
        values: BadgeFormValues
    ): Promise<void> => {
        if (currentUser?.role == UserRole.Admin) {
            try {
                let updatedBadge: Partial<Badge> = {
                    name: values.title,
                    description: values.description,
                    color: values.color,
                    imageUrl: values.imageUrl,
                    criteria: values.criteria || 0,
                    category: values.category,
                    achievementLevel: values.achievementLevel,
                };

                const ref = doc(firestore, "badges", badgeId);

                if (selectedImage) {
                    console.log("Uploading new image...");
                    updatedBadge.imageUrl = await uploadOpportunityImage(
                        selectedImage,
                        badgeId
                    );
                    console.log("New image uploaded successfully");
                }

                await updateDoc(ref, updatedBadge);
                console.log("Badge details updated successfully");
            } catch (error) {
                console.error("Error updating badge details:", error);
                throw error;
            }
        }
    };

    const formik: FormikProps<BadgeFormValues> =
        useFormik<BadgeFormValues>({
            initialValues: {
                title: badge?.name || "",
                description: badge?.description || "",
                color: badge?.color || "",
                imageUrl: badge?.imageUrl || "",
                criteria: badge?.criteria || 0,
                category: badge?.category,
                achievementLevel: badge?.achievementLevel || "",
            },
            enableReinitialize: true,
            validationSchema: Yup.object({
                title: Yup.string().required("Title is required"),
                description: Yup.string()
                    .required("Description is required"),
                color: Yup.string()
                    .required("Hex color is required"),
                criteria: Yup.number()
                    .required("Criteria is required"),
                achievementLevel: Yup.string()
                    .required("Achievement level is required"),
            }),
            onSubmit: async (values, { setSubmitting }) => {
                try {
                    await updateBadge(values);
                    toast.success("Update badge successful!");
                    setSubmitting(false);
                } catch (error) {
                    toast.error(String(error));
                } finally {
                    setSubmitting(false);
                }
            },
        });

    useEffect(() => {
        if (badge && badge.imageUrl) {
            console.log("Achievement:", badge.achievementLevel);
            setImageUrl(badge.imageUrl);
        }
    }, [badge]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedImage(event.target.files[0]);
        }
    };

    return (
        <>
            <div className="w-full space-y-8">
                <NavigationTitle title="Edit Badge" />
                <div className="w-full flex flex-col space-y-5 md:flex-row md:space-x-5 md:space-y-0">
                    <BadgePictureCard
                        badgeId={badgeId}
                        imageUrl={imageUrl}
                        selectedImage={selectedImage}
                        setSelectedImage={setSelectedImage}
                        handleImageChange={handleImageChange}
                    />
                    <BadgeDetailsCard
                        badgeId={badgeId}
                        formik={formik}
                    />
                </div>
            </div>
        </>
    );
};

export default EditBadge;
