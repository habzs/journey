import BasicCard from "@/app/components/BasicCard";
import ConfirmationModal from "@/app/components/ConfirmationModal";
import PhotoUpload from "@/app/components/PhotoUpload";
import { HStack, VStack } from "@/app/components/Stack";
import { useAuth } from "@/app/context/AuthContext";
import { UserRole } from "@/app/models/users";
import { adminDeleteUser } from "@/app/utils/api/deleteUser";
import { ADMIN_URL } from "@/app/utils/constants";
import { Button, useDisclosure } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ProfilePictureCardProps {
    userId: string;
    avatarUrl: string | null;
    selectedImage: File | null;
    setSelectedImage: React.Dispatch<React.SetStateAction<File | null>>;
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfilePictureCard: React.FC<ProfilePictureCardProps> = ({
    userId,
    avatarUrl,
    selectedImage,
    setSelectedImage,
    handleImageChange,
}) => {

    const { currentUser } = useAuth();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const router = useRouter();

    const deleteUser = async (userId: string) => {
        if (currentUser?.role === UserRole.Admin) {
            try {
                await adminDeleteUser({ userId });
                toast.success("User deleted successfully!");
            } catch (error) {
                console.error("Error deleting user:", error);
                toast.error("Failed to delete user.");
            }
        } else {
            console.error("Role: ", currentUser?.role);
        }
    };

    // TODO: Add delete image from storage, but can't get access to user email
    // Can use id instead of email
    // Or store email in firestore
    const handleDeleteUser = async () => {
        if (confirm("Are you sure you want to delete this user?")) {
            await deleteUser(userId);
            router.push(`${ADMIN_URL}/all-users`);
        }
    };

    return (
        <>
            <BasicCard
                className="shadow-sm rounded-3xl w-full md:w-2/5"
            >
                <VStack className="h-full md:py-8">
                    <PhotoUpload
                        imageUrl={avatarUrl}
                        selectedImage={selectedImage}
                        setSelectedImage={setSelectedImage}
                        onImageChange={handleImageChange}
                        label=""
                    />
                    <HStack className="w-full mt-auto">
                        <Button
                            color="danger"
                            onClick={onOpen}
                            className="mx-auto"
                        >
                            Delete User
                        </Button>
                        <ConfirmationModal
                            isOpen={isOpen}
                            onOpenChange={onOpenChange}
                            title="Confirm Delete User"
                            confirmColor="danger"
                            onConfirm={handleDeleteUser}
                        />
                    </HStack>
                </VStack>
            </BasicCard>
        </>
    );
};

export default ProfilePictureCard;