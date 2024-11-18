import BasicCard from "@/app/components/BasicCard";
import PhotoUpload from "@/app/components/PhotoUpload";
import { VStack } from "@/app/components/Stack";

interface ProfilePictureCardProps {
    selectedImage: File | null;
    setSelectedImage: React.Dispatch<React.SetStateAction<File | null>>;
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfilePictureCard: React.FC<ProfilePictureCardProps> = ({
    selectedImage,
    setSelectedImage,
    handleImageChange,
}) => {
    return (
        <>
            <BasicCard
                className="shadow-sm rounded-3xl w-full md:w-2/5"
            >
                <VStack className="h-full md:py-8">
                    <PhotoUpload
                        selectedImage={selectedImage}
                        setSelectedImage={setSelectedImage}
                        onImageChange={handleImageChange}
                        label=""
                    />
                </VStack>
            </BasicCard>
        </>
    );
};

export default ProfilePictureCard;