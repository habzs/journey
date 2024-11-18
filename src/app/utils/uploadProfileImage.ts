import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase/config";

export const uploadProfileImage = async (
  file: File,
  email: string
): Promise<string> => {
  const storageRef = ref(storage, `user/${email}.png`);
  const snapshot = await uploadBytes(storageRef, file);
  const photoUrl = await getDownloadURL(storageRef);

  return photoUrl;
};
