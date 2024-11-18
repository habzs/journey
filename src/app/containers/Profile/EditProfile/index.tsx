"use client";

import { FormikProps, useFormik } from "formik";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as Yup from "yup";
import { updateProfile } from "@/app/utils/api";

import BasicCard from "@/app/components/BasicCard";
import PhotoUpload from "@/app/components/PhotoUpload";
import { useAuth } from "@/app/context/AuthContext";
import { SelectOption, volunteerOptions } from "@/app/utils/constants";
import {
  Button,
  Chip,
  Divider,
  Input,
  Select,
  SelectedItems,
  SelectItem,
  Skeleton,
  Textarea,
} from "@nextui-org/react";
import { useState } from "react";
import NavigationTitle from "@/app/components/Opportunities/NavigationTitle";

// Define the shape of your form values
interface FormValues {
  username: string;
  email: string;
  mobile: string;
  biography: string;
  interests: string[];
  selectedImage: File | null;
}

const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  mobile: Yup.string().required("Mobile number is required"),
  biography: Yup.string(),
  interests: Yup.array().of(Yup.string()),
});

const EditProfile = () => {
  const { currentUser, loading, updateCurrentUser } = useAuth();
  const [image, setImage] = useState(currentUser?.avatarImageUrl);
  const router = useRouter();

  const formik = useFormik<FormValues>({
    initialValues: {
      username: currentUser?.username || "",
      email: currentUser?.email || "",
      mobile: currentUser?.mobileNumber || "",
      biography: currentUser?.biography || "",
      interests: currentUser?.interests || [],
      selectedImage: null,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (!currentUser) {
          throw new Error("User not authenticated");
        }
        const updatedData = await updateProfile({
          userId: currentUser.uid,
          username: values.username,
          email: values.email,
          mobile: values.mobile,
          biography: values.biography,
          interests: values.interests,
          selectedImage: values.selectedImage,
        });
        // Update the current user in the AuthContext
        updateCurrentUser(updatedData);

        toast.success("Profile updated successfully!");
        router.push("/profile"); // Redirect to profile page after update
      } catch (error) {
        toast.error(String(error));
      } finally {
        setSubmitting(false);
      }
    },
  });
  if (loading) return <LoadingSkeleton />;

  return (
    <BasicCard className="max-w-lg">
      <NavigationTitle title="Edit Profile" />
      <form className="space-y-4" onSubmit={formik.handleSubmit}>
        <PhotoUpload
          selectedImage={formik.values.selectedImage}
          setSelectedImage={(file) =>
            formik.setFieldValue("selectedImage", file)
          }
          onImageChange={(event) => {
            if (event.target.files?.[0]) {
              formik.setFieldValue("selectedImage", event.target.files[0]);
            }
          }}
          imageUrl={currentUser?.avatarImageUrl}
        />
        <Divider />
        <FormInputs formik={formik} />
        <Button
          type="submit"
          color="primary"
          isDisabled={formik.isSubmitting}
          isLoading={formik.isSubmitting}
        >
          Update Profile
        </Button>
      </form>
    </BasicCard>
  );
};

const LoadingSkeleton = () => (
  <BasicCard>
    <Skeleton className="w-2/6 h-[36px] rounded-lg" />
    <div className="space-y-4">
      <Skeleton className="w-full h-[56px] rounded-lg" />
      <Skeleton className="w-full h-[56px] rounded-lg" />
      <Skeleton className="w-full h-[56px] rounded-lg" />
      <Skeleton className="w-full h-[56px] rounded-lg" />
    </div>
    <Skeleton className="w-1/6 h-[40px] rounded-lg" />
  </BasicCard>
);

const FormInputs: React.FC<{ formik: FormikProps<FormValues> }> = ({
  formik,
}) => (
  <>
    <Input
      id="email"
      type="email"
      label="Email"
      isRequired
      {...formik.getFieldProps("email")}
      isInvalid={formik.touched.email && Boolean(formik.errors.email)}
      errorMessage={formik.touched.email && formik.errors.email}
      isDisabled={formik.isSubmitting}
      classNames={{
        input: "text-base",
        inputWrapper: "text-base",
      }}
    />
    <Input
      id="username"
      type="text"
      label="Username"
      isRequired
      {...formik.getFieldProps("username")}
      isInvalid={formik.touched.username && Boolean(formik.errors.username)}
      errorMessage={formik.touched.username && formik.errors.username}
      isDisabled={formik.isSubmitting}
      classNames={{
        input: "text-base",
        inputWrapper: "text-base",
      }}
    />

    <Input
      id="mobile"
      type="tel"
      label="Mobile Number"
      isRequired
      {...formik.getFieldProps("mobile")}
      isInvalid={formik.touched.mobile && Boolean(formik.errors.mobile)}
      errorMessage={formik.touched.mobile && formik.errors.mobile}
      isDisabled={formik.isSubmitting}
      classNames={{
        input: "text-base",
        inputWrapper: "text-base",
      }}
    />
    <Textarea
      id="biography"
      label="Biography"
      {...formik.getFieldProps("biography")}
      isDisabled={formik.isSubmitting}
      classNames={{
        input: "text-base",
        inputWrapper: "text-base",
      }}
    />
    <Select
      id="interests"
      name="interests"
      items={volunteerOptions}
      label="Interests"
      isDisabled={formik.isSubmitting}
      isMultiline={true}
      selectionMode="multiple"
      placeholder="Select your interests"
      classNames={{
        trigger: "min-h-12 py-2",
        value: "text-base",
      }}
      selectedKeys={formik.values.interests}
      onSelectionChange={(keys) =>
        formik.setFieldValue("interests", Array.from(keys))
      }
      renderValue={(items: SelectedItems<SelectOption>) => (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <Chip key={item.key}>{item.data?.label}</Chip>
          ))}
        </div>
      )}
    >
      {(item) => (
        <SelectItem key={item.value} textValue={item.label}>
          {item.label}
        </SelectItem>
      )}
    </Select>
  </>
);

export default EditProfile;
