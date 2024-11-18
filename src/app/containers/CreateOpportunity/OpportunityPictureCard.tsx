import BasicCard from "@/app/components/BasicCard";
import ConfirmationModal from "@/app/components/ConfirmationModal";
import PhotoUpload from "@/app/components/PhotoUpload";
import { HStack, VStack } from "@/app/components/Stack";
import { firestore } from "@/app/firebase/config";
import { ADMIN_URL } from "@/app/utils/constants";
import { Button, useDisclosure } from "@nextui-org/react";
import { deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface OpportunityPictureCardProps {
  opportunityId?: string;
  imageUrl?: string | null;
  selectedImage: File | null;
  setSelectedImage: React.Dispatch<React.SetStateAction<File | null>>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const OpportunityPictureCard: React.FC<OpportunityPictureCardProps> = ({
  opportunityId,
  imageUrl,
  selectedImage,
  setSelectedImage,
  handleImageChange,
}) => {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleDeleteOpportunity = async () => {
    if (opportunityId) {
      try {
        const oppRef = doc(firestore, "opportunities", opportunityId);
        await deleteDoc(oppRef);
        console.log("Opportunity deleted successfully");
        toast.success("Opportunity deleted successfully!");
        router.push(`${ADMIN_URL}/all-opportunities`);
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("There was an error deleting the user. Please try again.");
      }
    }
  };

  return (
    <>
      <BasicCard className="shadow-sm rounded-3xl w-full md:w-2/5">
        <VStack className="h-full md:py-8">
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
              {/* <PrimaryButton
                className="w-fit mx-auto "
                title={"Delete Opportunity"}
                role="destructive"
                action={onOpen}
              /> */}
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
    </>
  );
};

export default OpportunityPictureCard;
