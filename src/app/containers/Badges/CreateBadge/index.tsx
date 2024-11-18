"use client";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { ADMIN_URL } from "@/app/utils/constants";
import { FormikProps, useFormik } from "formik";
import { useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";
import { addDoc, collection, Timestamp, updateDoc } from "firebase/firestore";
import { firestore } from "@/app/firebase/config";
import NavigationTitle from "@/app/components/Opportunities/NavigationTitle";
import { Badge } from "@/app/models/badges";
import BadgeDetailsCard from "@/app/components/Badges/BadgeDetailsCard";
import BadgePictureCard from "@/app/components/Badges/BadgePictureCard";
import { uploadImage } from "@/app/utils/uploadImage";
import { UserRole } from "@/app/models/users/UserRole";

export interface BadgeFormValues {
    title: string;
    description: string;
    color: string;
    imageUrl?: string;
    criteria: number;
    category?: string[];
    achievementLevel: string;
};

const CreateBadge = () => {

    const { currentUser } = useAuth();
    const router = useRouter();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const createBadge = async (values: BadgeFormValues): Promise<void> => {
        if (currentUser?.role == UserRole.Admin) {
            try {
                let badge: Partial<Badge> = {
                    name: values.title,
                    description: values.description,
                    color: values.color,
                    imageUrl: "",
                    criteria: values.criteria,
                    category: values.category || [],
                    achievementLevel: values.achievementLevel,
                    createdDate: Timestamp.now(),
                    createdBy: {
                        id: currentUser?.uid || "",
                        username: currentUser?.username || "",
                        avatarImageUrl: currentUser?.avatarImageUrl || "",
                    },
                };

                const ref = collection(firestore, "badges");
                const docRef = await addDoc(ref, badge);
                const badgeId = docRef.id;

                if (selectedImage) {
                    console.log("Uploading badge image");
                    const imageUrl = await uploadImage(selectedImage, "badge", badgeId);
                    console.log("Image uploaded successfully");
                    await updateDoc(docRef, { imageUrl: imageUrl });
                }
                console.log("New badge created successfully!");
                router.push(`${ADMIN_URL}/all-badges`);
            } catch (error) {
                console.error("Error creating badge:", error);
                throw error;
            }
        }
    };

    const formik: FormikProps<BadgeFormValues> = useFormik<BadgeFormValues>({
        initialValues: {
            title: "",
            description: "",
            color: "",
            criteria: 0,
            achievementLevel: "",
        },
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
                if (!selectedImage) {
                    toast.error("Image is required");
                    return;
                }
                await createBadge(values);
            } catch (error) {
                toast.error(String(error));
            } finally {
                setSubmitting(false);
            }
        },
    });

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedImage(event.target.files[0]);
        }
    };

    return (
        <>
            <div className="w-full space-y-8">
                <NavigationTitle title="Create Badge" />
                <div className="w-full flex flex-col space-y-5 md:flex-row md:space-x-5 md:space-y-0">
                    <BadgePictureCard
                        selectedImage={selectedImage}
                        setSelectedImage={setSelectedImage}
                        handleImageChange={handleImageChange}
                    />
                    <BadgeDetailsCard formik={formik} />
                </div>
            </div>
        </>
    );
};

export default CreateBadge;
