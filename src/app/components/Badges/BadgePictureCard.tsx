import BasicCard from "@/app/components/BasicCard";
import ConfirmationModal from "@/app/components/ConfirmationModal";
import PhotoUpload from "@/app/components/PhotoUpload";
import { HStack, VStack } from "@/app/components/Stack";
import { firestore } from "@/app/firebase/config";
import { ADMIN_URL } from "@/app/utils/constants";
import { Button, useDisclosure } from "@nextui-org/react";
import { doc, deleteDoc } from "firebase/firestore";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface BadgePictureCardProps {
    badgeId?: string;
    imageUrl?: string | null;
    selectedImage: File | null;
    setSelectedImage: React.Dispatch<React.SetStateAction<File | null>>;
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BadgePictureCard: React.FC<BadgePictureCardProps> = ({
    badgeId,
    imageUrl,
    selectedImage,
    setSelectedImage,
    handleImageChange,
}) => {
    const router = useRouter();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const handleDeleteBadge = async () => {
        if (
            badgeId &&
            confirm("Are you sure you want to delete this badge?")
        ) {
            try {
                const oppRef = doc(firestore, "badges", badgeId);
                await deleteDoc(oppRef);

                // Delete the image from Firebase Storage
                if (imageUrl) {
                    const storage = getStorage();
                    const imageRef = ref(storage, imageUrl);
                    await deleteObject(imageRef);
                    console.log("Image deleted successfully");
                }

                console.log("Badge deleted successfully");
                toast.success("Badge deleted successfully!");
                router.push(`${ADMIN_URL}/all-badges`);
            } catch (error) {
                console.error("Error deleting badge:", error);
                alert("There was an error deleting the badge. Please try again.");
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
                    type="badge"
                />
                {badgeId && (
                    <HStack className="w-full mt-auto">
                        <Button
                            color="danger"
                            onClick={onOpen}
                            className="mx-auto"
                        >
                            Delete Badge
                        </Button>
                        <ConfirmationModal
                            isOpen={isOpen}
                            onOpenChange={onOpenChange}
                            title="Confirm Delete Badge"
                            confirmColor="danger"
                            onConfirm={handleDeleteBadge}
                        />
                    </HStack>
                )}
            </VStack>
        </BasicCard>
    );
};

export default BadgePictureCard;
