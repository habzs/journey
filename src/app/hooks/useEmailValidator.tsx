import { useState, useEffect } from "react";

const useEmailValidator = (email: string) => {
  const [isValid, setIsValid] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Basic email regex pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setIsValid(false);
      setError("Email is required");
    } else if (!emailPattern.test(email)) {
      setIsValid(false);
      setError("Invalid email format");
    } else {
      setIsValid(true);
      setError(null);
    }
  }, [email]);

  return { isValid, error };
};

export default useEmailValidator;
