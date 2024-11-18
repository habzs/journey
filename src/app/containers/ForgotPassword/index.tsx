"use client";

import { FormEvent, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/app/firebase/config";
import { Button, Input } from "@nextui-org/react";
import BasicCard from "@/app/components/BasicCard";
import { SIGNIN_URL } from "@/app/utils/constants";
import { Link } from "@nextui-org/react";

const ForgotPassword = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await sendPasswordResetEmail(auth, values.email);
        toast.success("Password reset email sent! Check your inbox.");
      } catch (error) {
        toast.error("Failed to send reset email. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <BasicCard className="max-w-lg">
      <h4>Reset Password</h4>
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
            input: "text-base",
            inputWrapper: "text-base",
          }}
        />
        <div className="space-x-4">
          <Button
            type="submit"
            color="primary"
            isDisabled={formik.isSubmitting}
            isLoading={formik.isSubmitting}
          >
            Reset
          </Button>
        </div>
        <p>
          Remember your password?{" "}
          <Link className="underline" href={SIGNIN_URL}>
            Sign in
          </Link>
        </p>
      </form>
    </BasicCard>
  );
};

export default ForgotPassword;
