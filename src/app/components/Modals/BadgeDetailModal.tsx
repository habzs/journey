import { Badge } from "@/app/models/badges";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
  Image,
} from "@nextui-org/react";

import { ShareModal } from "./ShareModal";
import { ShareIcon } from "@heroicons/react/24/outline";

interface BadgeDetailModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
  badge: Badge;
}

export const BadgeDetailModal: React.FC<BadgeDetailModalProps> = ({
  isOpen,
  onOpen,
  onOpenChange,
  badge,
}) => {
  const {
    isOpen: isShareModalOpen,
    onOpen: onShareModalOpen,
    onOpenChange: onShareModalOpenChange,
  } = useDisclosure();

  const { color, name, imageUrl, description, achievementLevel } = badge;

  const handleShareModalOpen = () => {
    onOpenChange();
    onShareModalOpen();
  };

  const shareMessage =
    "I just earned the " + name + " badge! Join me on my journey!";

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        style={{ backgroundColor: color }}
        data-testid="badge-detail-modal"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1"></ModalHeader>
              <ModalBody className="text-contrast">
                <div>
                  <div className="w-full aspect-square relative p-6">
                    <Image
                      alt={name}
                      src={imageUrl}
                      isBlurred
                      classNames={{
                        img: "object-cover w-full",
                        wrapper: "w-full",
                      }}
                    />
                  </div>
                  <Chip color="success" variant="solid" className="uppercase">
                    <b>{achievementLevel}</b>
                  </Chip>
                </div>
                <h3>{name}</h3>
                <p>{description}</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onPress={handleShareModalOpen}
                  startContent={<ShareIcon className="size-5" />}
                >
                  Share
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <ShareModal
        shareMessage={shareMessage}
        isOpen={isShareModalOpen}
        onOpen={onShareModalOpen}
        onOpenChange={onShareModalOpenChange}
      />
    </>
  );
};
