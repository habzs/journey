import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../models/users";

const useRoleProtection = (requiredRole: UserRole) => {
    const { currentUser } = useAuth();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
  
    useEffect(() => {
      // Only check if the currentUser is defined
      if (currentUser) {
        if (currentUser.role === requiredRole) {
          setIsAuthorized(true);
        } else {
          router.push("/");
        }
        setIsChecking(false); // End checking once the user role has been verified
      }
    }, [currentUser, requiredRole, router]);
  
    return { isAuthorized, isChecking };
  };
  
  export default useRoleProtection;