import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase/config";

export const uploadOpportunityImage = async (
  file: File,
  opportunityId: string
): Promise<string> => {
  const storageRef = ref(storage, `opportunity/${opportunityId}.png`);
  const snapshot = await uploadBytes(storageRef, file);
  const photoUrl = await getDownloadURL(storageRef);

  return photoUrl;
};
