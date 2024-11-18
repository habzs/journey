"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormik, FormikProps } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";

import BasicCard from "@/app/components/BasicCard";
import PhotoUpload from "@/app/components/PhotoUpload";
import { useAuth } from "@/app/context/AuthContext";
import { UserRole } from "@/app/models/users";
import {
  ADMIN_URL,
  AGENCY_URL,
  HOME_URL,
  SelectOption,
  SIGNIN_URL,
  volunteerOptions,
} from "@/app/utils/constants";
import {
  Button,
  Chip,
  Divider,
  Input,
  Link,
  Select,
  SelectedItems,
  SelectItem,
  Skeleton,
  Textarea,
} from "@nextui-org/react";

// Define the shape of your form values
interface FormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
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
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
  mobile: Yup.string().required("Mobile number is required"),
  biography: Yup.string(),
  interests: Yup.array().of(Yup.string()),
});

const Signup = () => {
  const { signup, currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (currentUser && !loading) {
      const routes = {
        [UserRole.Volunteer]: HOME_URL,
        [UserRole.Agency]: AGENCY_URL,
        [UserRole.Admin]: ADMIN_URL,
      };
      router.push(routes[currentUser.role as UserRole] || HOME_URL);
    }
  }, [currentUser, loading, router]);

  const formik = useFormik<FormValues>({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      mobile: "",
      biography: "",
      interests: [],
      selectedImage: null,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await signup(
          values.email,
          values.password,
          values.username,
          values.mobile,
          values.biography,
          values.interests,
          values.selectedImage
        );
        toast.success("Signup successful!");
      } catch (error) {
        toast.error(String(error));
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (loading || currentUser) {
    return <LoadingSkeleton />;
  }

  return (
    <BasicCard className="max-w-lg">
      <h4>Sign Up</h4>
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
        />
        <Divider />
        <FormInputs formik={formik} />
        <Button
          type="submit"
          color="primary"
          isDisabled={formik.isSubmitting}
          isLoading={formik.isSubmitting}
        >
          Sign Up
        </Button>
        <p>
          Already have an account?{" "}
          <Link className="underline" href={SIGNIN_URL}>
            Sign in.
          </Link>
        </p>
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
    <div className="flex md:flex-row flex-col gap-4">
      <Input
        id="password"
        type="password"
        label="Password"
        isRequired
        {...formik.getFieldProps("password")}
        isInvalid={formik.touched.password && Boolean(formik.errors.password)}
        errorMessage={formik.touched.password && formik.errors.password}
        isDisabled={formik.isSubmitting}
        classNames={{
          input: "text-base",
          inputWrapper: "text-base",
        }}
      />
      <Input
        id="confirmPassword"
        type="password"
        label="Confirm Password"
        isRequired
        {...formik.getFieldProps("confirmPassword")}
        isInvalid={
          formik.touched.confirmPassword &&
          Boolean(formik.errors.confirmPassword)
        }
        errorMessage={
          formik.touched.confirmPassword && formik.errors.confirmPassword
        }
        isDisabled={formik.isSubmitting}
        classNames={{
          input: "text-base",
          inputWrapper: "text-base",
        }}
      />
    </div>
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

export default Signup;
