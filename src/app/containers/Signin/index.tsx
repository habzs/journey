"use client";

import BasicCard from "@/app/components/BasicCard";
import { useAuth } from "@/app/context/AuthContext";
import { UserRole } from "@/app/models/users";
import {
  ADMIN_URL,
  AGENCY_URL,
  HOME_URL,
  SIGNUP_URL,
} from "@/app/utils/constants";
import { Button, Checkbox, Input, Link, Skeleton } from "@nextui-org/react";
import { useFormik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import * as Yup from "yup";

const Signin = () => {
  const { signin, currentUser, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (currentUser && !loading) {
      const returnUrl = searchParams.get("returnUrl");
      if (returnUrl) {
        router.push(decodeURIComponent(returnUrl));
      } else {
        if (currentUser.role == UserRole.Volunteer) {
          router.push(HOME_URL);
        } else if (currentUser.role == UserRole.Agency) {
          router.push(AGENCY_URL);
        } else if (currentUser.role == UserRole.Admin) {
          router.push(ADMIN_URL);
        }
      }
    }
  }, [currentUser, loading, router, searchParams]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
      rememberMe: Yup.boolean(),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await signin(values.email, values.password, values.rememberMe);
        toast.success("Sign in successful!");
      } catch (error) {
        toast.error(String(error));
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (loading || currentUser) {
    return (
      <BasicCard>
        <Skeleton className="w-2/6 h-[36px] rounded-lg" />
        <div className="space-y-4">
          <Skeleton className="w-full h-[56px] rounded-lg" />
          <Skeleton className="w-full h-[56px] rounded-lg" />
        </div>
        <Skeleton className="w-1/6 h-[40px] rounded-lg" />
      </BasicCard>
    );
  }

  return (
    <BasicCard className="max-w-lg">
      <h4>Sign In</h4>
      <form className="space-y-4" onSubmit={formik.handleSubmit}>
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isInvalid={formik.touched.email && Boolean(formik.errors.email)}
          errorMessage={formik.touched.email && formik.errors.email}
          isDisabled={formik.isSubmitting}
          classNames={{
            input: "text-base", // This sets font-size to 16px (1rem)
            inputWrapper: "text-base", // This ensures the wrapper also has the correct font size
          }}
        />

        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isInvalid={formik.touched.password && Boolean(formik.errors.password)}
          errorMessage={formik.touched.password && formik.errors.password}
          isDisabled={formik.isSubmitting}
          classNames={{
            input: "text-base", // This sets font-size to 16px (1rem)
            inputWrapper: "text-base", // This ensures the wrapper also has the correct font size
          }}
        />

        <div className="space-x-4">
          <Button
            type="submit"
            color="primary"
            isDisabled={formik.isSubmitting}
            isLoading={formik.isSubmitting}
          >
            Sign In
          </Button>
          <Checkbox
            id="rememberMe"
            name="rememberMe"
            isSelected={formik.values.rememberMe}
            onValueChange={(isSelected) =>
              formik.setFieldValue("rememberMe", isSelected)
            }
          >
            Remember me
          </Checkbox>
        </div>
        <p>
          Don&apos;t have an account?{" "}
          <Link className="underline" href={SIGNUP_URL}>
            Sign up.
          </Link>
        </p>
        <p>
          Forgot password?{" "}
          <Link className="underline" href="/forgot-password">
            Reset it here.
          </Link>
        </p>
      </form>
    </BasicCard>
  );
};

export default Signin;
