import BasicCard from "@/app/components/BasicCard";
import ConfirmationModal from "@/app/components/ConfirmationModal";
import { Button, useDisclosure } from "@nextui-org/react";
import { HStack, VStack } from "@/app/components/Stack";
import PhotoUpload from "@/app/components/PhotoUpload";
import { firestore } from "@/app/firebase/config";
import { ADMIN_URL, AGENCY_URL } from "@/app/utils/constants"; // Import AGENCY_URL
import { useRouter } from "next/navigation";
import {
  doc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { toast } from "sonner";

interface OpportunityPictureCardProps {
  opportunityId?: string;
  imageUrl?: string | null;
  selectedImage: File | null;
  setSelectedImage: React.Dispatch<React.SetStateAction<File | null>>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  role: "Admin" | "Agency"; // Accept role as a prop
}

const OpportunityPictureCard: React.FC<OpportunityPictureCardProps> = ({
  opportunityId,
  imageUrl,
  selectedImage,
  setSelectedImage,
  handleImageChange,
  role, // Use role here
}) => {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleDeleteOpportunity = async () => {
    if (opportunityId) {
      try {
        const oppRef = doc(firestore, "opportunities", opportunityId);

        // Delete documents in the "signedUpVolunteers" subcollection
        const volunteersCollectionRef = collection(
          oppRef,
          "signedUpVolunteers"
        );
        const volunteersSnapshot = await getDocs(volunteersCollectionRef);
        const volunteerDeletions = volunteersSnapshot.docs.map((volunteerDoc) =>
          deleteDoc(volunteerDoc.ref)
        );
        await Promise.all(volunteerDeletions);

        // Delete documents in the "badges" subcollection
        const badgesCollectionRef = collection(oppRef, "badges");
        const badgesSnapshot = await getDocs(badgesCollectionRef);
        const badgesDeletions = badgesSnapshot.docs.map((badgeDoc) =>
          deleteDoc(badgeDoc.ref)
        );
        await Promise.all(badgesDeletions);

        // Delete the opportunity from each user's "opportunities" subcollection
        const usersCollectionRef = collection(firestore, "users");
        const usersSnapshot = await getDocs(usersCollectionRef);

        const opportunityDeletionsFromUsers = usersSnapshot.docs.map(
          async (userDoc) => {
            const userOpportunitiesRef = collection(
              userDoc.ref,
              "opportunities"
            );
            const opportunityQuery = query(
              userOpportunitiesRef,
              where("id", "==", opportunityId)
            );
            const userOpportunitySnapshot = await getDocs(opportunityQuery);
            const userOpportunityDeletions = userOpportunitySnapshot.docs.map(
              (userOppDoc) => deleteDoc(userOppDoc.ref)
            );
            return Promise.all(userOpportunityDeletions);
          }
        );

        await Promise.all(opportunityDeletionsFromUsers);

        // Delete the main opportunity document
        await deleteDoc(oppRef);

        // Delete the image from Firebase Storage
        if (imageUrl) {
          const storage = getStorage();
          const imageRef = ref(storage, imageUrl);
          await deleteObject(imageRef);
          console.log("Image deleted successfully");
        }

        console.log("Opportunity deleted successfully");
        toast.success("Opportunity deleted successfully!");

        // Redirect based on the user's role
        const redirectUrl =
          role === "Admin"
            ? `${ADMIN_URL}/all-opportunities`
            : `${AGENCY_URL}/agency-opportunities`;
        router.push(redirectUrl);
      } catch (error) {
        console.error("Error deleting opportunity:", error);
        alert("There was an error deleting the opportunity. Please try again.");
      }
    }
  };

  return (
    <BasicCard className="shadow-sm rounded-3xl w-full md:w-2/5">
      <VStack className="h-full pt-6 md:py-8">
        <PhotoUpload
          imageUrl={imageUrl}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          onImageChange={handleImageChange}
          label=""
          type="opportunity"
        />
        {opportunityId && (
          <HStack className="w-full mt-auto">
            <Button color="danger" onClick={onOpen} className="mx-auto">
              Delete Opportunity
            </Button>
            <ConfirmationModal
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              title="Confirm Delete Opportunity"
              confirmColor="danger"
              onConfirm={handleDeleteOpportunity}
            />
          </HStack>
        )}
      </VStack>
    </BasicCard>
  );
};

export default OpportunityPictureCard;
