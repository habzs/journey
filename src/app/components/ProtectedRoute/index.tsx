"use client";

import { useAuth } from "@/app/context/AuthContext";
import {
  ADMIN_URL,
  PROFILE_URL,
  SIGNIN_URL,
  AGENCY_URL,
} from "@/app/utils/constants";
import { Spinner } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const protectedRoutesArray = [PROFILE_URL, ADMIN_URL, AGENCY_URL];

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, loading } = useAuth();

  const isRouteProtected = () => {
    return protectedRoutesArray.some((route) => {
      const pattern = new RegExp("^" + route + ".*");
      return pattern.test(pathname);
    });
  };

  useEffect(() => {
    if (!loading && isRouteProtected() && !currentUser) {
      const returnUrl = encodeURIComponent(pathname);
      router.push(`${SIGNIN_URL}?returnUrl=${returnUrl}`);
    }
  }, [currentUser, pathname, loading]);

  if (loading) {
    return (
      <>
        <Spinner />
      </>
    );
  }

  return isRouteProtected() && !currentUser ? null : children;
};

export default ProtectedRoute;
