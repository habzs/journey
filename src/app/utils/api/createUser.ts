'use server'
import { IUserDetails } from "@/app/models/users";
import { FirebaseError } from "firebase/app";
import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";
import { firestore } from "@/app/firebase/config";
import { adminAuth } from "@/app/firebase/firebaseAdmin";

interface CreateUserParams {
    email: string,
    password: string,
    username: string,
    mobile: string,
    biography: string | null,
    interests: string[] | null,
    imageUrl: string | null,
    role: string,
  }

export const adminCreateUser = async ({
    email,
    password,
    username,
    mobile,
    biography,
    interests,
    imageUrl,
    role,
  }: CreateUserParams)  => {
    try {
      // Check if username already exists
      const usersCollection = collection(firestore, "users");
      const usernameQuery = query(
        usersCollection,
        where("username", "==", username)
      );

      const usernameQuerySnapshot = await getDocs(usernameQuery);

      if (!usernameQuerySnapshot.empty) {
        throw "Username already exists";
      }

      // Create user with Admin SDK
      const userRecord = await adminAuth.createUser({
        email: email,
        password: password,
        disabled: false
      });

      const user: IUserDetails = {
        username: username,
        biography: biography || "",
        avatarImageUrl: imageUrl || "",
        interests: interests || [],
        mobileNumber: mobile,
        role: role,
        badgesEarned: [],
        opportunities: {},
      };

      await setDoc(doc(firestore, "users", userRecord.uid), user);
    } catch (error) {
      console.error("Error creating user:", error);
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
            throw "An error occurred during user creation";
        }
      }
      throw error;
    }
  };