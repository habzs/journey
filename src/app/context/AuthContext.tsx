"use client";

import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  indexedDBLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, firestore } from "../firebase/config";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { toast } from "sonner";
import {
  Admin,
  Agency,
  IUser,
  IUserDetails,
  UserRole,
  Volunteer,
} from "../models/users";
import { useRouter } from "next/navigation";
import { uploadProfileImage } from "../utils/uploadProfileImage";

interface AuthContextProps {
  currentUser: IUser | null;
  loading: boolean;
  signup: (
    email: string,
    password: string,
    username: string,
    mobile: string,
    biography: string | null,
    interests: string[] | null,
    selectedImage: File | null
  ) => Promise<void>;
  signin: (
    email: string,
    password: string,
    rememberMe: boolean
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateCurrentUser: (updatedData: Partial<IUser>) => void;
  refreshUserData: () => Promise<void>;
}

interface AuthContextProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const signup = async (
    email: string,
    password: string,
    username: string,
    mobile: string,
    biography: string | null,
    interests: string[] | null,
    selectedImage: File | null
  ): Promise<void> => {
    try {
      // Check if username already exists
      const usersCollection = collection(firestore, "users");
      const usernameQuery = query(
        usersCollection,
        where("username", "==", username)
      );

      let imageUrl = "";

      const usernameQuerySnapshot = await getDocs(usernameQuery);

      if (!usernameQuerySnapshot.empty) {
        throw "Username already exists";
      }

      if (selectedImage) {
        // Upload image to storage
        console.log("Uploading user avatar");
        imageUrl = await uploadProfileImage(selectedImage, email);
        console.log("Avatar uploaded successfully");
        // Update user document with image URL
      }

      const newUserCreds = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const userCreds = newUserCreds.user;

      if (!userCreds || !userCreds.email) {
        throw "An error occurred during signup";
      }

      const user: IUserDetails = {
        username: username,
        biography: biography || "",
        avatarImageUrl: imageUrl || "",
        interests: interests || [],
        mobileNumber: mobile,
        role: UserRole.Volunteer,
        badgesEarned: [],
        opportunities: {},
      };

      console.log(`Creating user with role: ${user.role}`);
      console.log("Creating user document in Firestore");
      await setDoc(doc(firestore, "users", userCreds.uid), user);
      console.log(`User document created for UID: ${userCreds.uid}`);

      // Upload user avatar image
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/email-already-in-use":
            throw "Email is already in use";
          case "auth/invalid-email":
            throw "Invalid email address";
          case "auth/operation-not-allowed":
            throw "Email/password accounts are not enabled";
          case "auth/weak-password":
            throw "Password is too weak";
          default:
            console.error("Firebase Error:", error.code, error.message);
            throw "An error occurred during signup";
        }
      }
      // Handle other errors
      console.error("Unexpected Error:", error);
      throw error;
    }
  };

  const signin = async (
    email: string,
    password: string,
    rememberMe: boolean = false
  ) => {
    try {
      // Set the persistence based on the rememberMe flag
      const persistenceType = rememberMe
        ? browserLocalPersistence
        : browserSessionPersistence;

      // TODO: temp fix for when user opens a new tab for the first time in this session the first/initial tab loses his auth state SEE: https://stackoverflow.com/questions/75399124/firebase-losing-auth-state-on-new-tab
      await setPersistence(auth, indexedDBLocalPersistence);

      // Sign in user
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/invalid-credential":
            throw "Incorrect credentials, please try again";
          default:
            console.error("Firebase Error:", error.code, error.message);
            throw "An error occurred during sign in";
        }
      }

      console.error("Unexpected Error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      router.push("/");
      toast.success("Sign out successful!");
    } catch (error) {
      console.error("An error occurred during signout:", error);
      throw error;
    }
  };

  const updateCurrentUser = (updatedData: Partial<IUser>) => {
    setCurrentUser((prevUser) => {
      if (prevUser) {
        return { ...prevUser, ...updatedData };
      }
      return prevUser;
    });
  };

  const refreshUserData = async () => {
    if (auth.currentUser) {
      try {
        const userDocRef = doc(firestore, "users", auth.currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data() as IUserDetails;
          setCurrentUser({ ...auth.currentUser, ...userData } as IUser);
        }
      } catch (error) {
        console.error("Error refreshing user data:", error);
      }
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await setPersistence(auth, indexedDBLocalPersistence);
      } catch (error) {
        console.error("Error setting persistence:", error);
      }

      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        // get user information from firestore
        if (user) {
          try {
            const userDocRef = doc(firestore, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
              const userData = userDocSnap.data() as IUserDetails;
              console.error(`Getting user data: ${userData.role}`);

              // Check the role and cast user accordingly
              switch (userData.role) {
                case UserRole.Volunteer:
                  setCurrentUser({ ...user, ...userData } as Volunteer);
                  console.error(`Volunteer: ${user.uid}`);
                  break;
                case UserRole.Agency:
                  setCurrentUser({ ...user, ...userData } as Agency);
                  console.error(`Agency: ${user.uid}`);
                  break;
                case UserRole.Admin:
                  setCurrentUser({ ...user, ...userData } as Admin);
                  console.error(`Admin: ${user.uid}`);
                  break;
                default:
                  console.error(`Invalid user role: ${userData.role}`);
                  setCurrentUser({ ...user, ...userData });
              }
            } else {
              console.error(`User document not found for UID: ${user.uid}`);
            }
          } catch (error) {
            console.error("An error occurred during user fetch:", error);
            toast.error("An error occurred during user fetch");
          }
        } else {
          setCurrentUser(null);
        }
        setLoading(false);
      });

      return unsubscribe;
    };
    initializeAuth();
  }, []);

  const value = {
    currentUser,
    loading,
    signup,
    signin,
    logout,
    updateCurrentUser,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
