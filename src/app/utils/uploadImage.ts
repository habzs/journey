import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/app/firebase/config";

export const uploadImage = async (
  file: File,
  path: string,
  id: string,
): Promise<string> => {
  const storageRef = ref(storage, `${path}/${id}.png`);
  const snapshot = await uploadBytes(storageRef, file);
  const photoUrl = await getDownloadURL(storageRef);

  return photoUrl;
};
