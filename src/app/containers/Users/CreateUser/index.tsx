"use client";
import ProfilePictureCard from "./ProfilePictureCard";
import { useRouter } from "next/navigation";
import { ADMIN_URL } from "@/app/utils/constants";
import { FormikProps, useFormik } from "formik";
import { useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";
import UserDetailsCard from "./UserDetailsCard";
import NavigationTitle from "@/app/components/Opportunities/NavigationTitle";
import { adminCreateUser } from "@/app/utils/api/createUser";
import { useAuth } from "@/app/context/AuthContext";
import { UserRole } from "@/app/models/users";
import { uploadProfileImage } from "@/app/utils/uploadProfileImage";

export interface UserFormValues {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    mobile: string;
    biography: string;
    interests: string[];
    role: string;
}

const CreateUser = () => {

    const { currentUser } = useAuth();
    const router = useRouter();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const formik: FormikProps<UserFormValues> = useFormik<UserFormValues>({
        initialValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            mobile: "",
            biography: "",
            interests: [],
            role: "",
        },
        validationSchema: Yup.object({
            username: Yup.string().required("Username is required"),
            email: Yup.string()
                .email("Invalid email address")
                .required("Email is required"),
            password: Yup.string()
                .min(8, "Password must be at least 8 characters")
                .required("Password is required"),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("password")], "Passwords must match")
                .required("Confirm Password is required"),
            mobile: Yup.string().required("Mobile number is required"),
            biography: Yup.string(),
            interests: Yup.array().of(Yup.string()),
            role: Yup.string().required("Role is required"),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                if (currentUser?.role === UserRole.Admin) {

                    let imageUrl = "";
                    
                    if (selectedImage) {
                        imageUrl = await uploadProfileImage(selectedImage, values.email);
                    }

                    await adminCreateUser({
                        email: values.email,
                        password: values.password,
                        username: values.username,
                        mobile: values.mobile,
                        biography: values.biography,
                        interests: values.interests,
                        imageUrl: imageUrl,
                        role: values.role,
                    });
                    toast.success("Create user successful!");
                    router.push(`${ADMIN_URL}/all-users`);
                }
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
                <NavigationTitle title="Create User" />
                <div className="w-full flex flex-col space-y-5 md:flex-row md:space-x-5 md:space-y-0">
                    <ProfilePictureCard
                        selectedImage={selectedImage}
                        setSelectedImage={setSelectedImage}
                        handleImageChange={handleImageChange}
                    />
                    <UserDetailsCard
                        formik={formik}
                    />
                </div>
            </div >
        </>
    );
};

export default CreateUser;
