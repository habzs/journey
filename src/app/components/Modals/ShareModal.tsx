import React from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  ModalFooter,
} from "@nextui-org/react";

import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";

interface ShareModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
  shareMessage: string;
  url?: string;
}

interface ShareIconProps {
  href: string;
  src: string;
  alt: string;
}

const ShareIcon: React.FC<ShareIconProps> = ({ href, src, alt }) => (
  <Link
    href={href}
    passHref
    target="_blank"
    className="no-underline border-3 border-primary rounded-2xl sm:p-5 p-4"
  >
    <Image
      src={src}
      alt={alt}
      width={0}
      height={0}
      sizes="100vw"
      style={{ width: "100%", height: "auto" }}
    />
  </Link>
);

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onOpen,
  onOpenChange,
  shareMessage = "Default",
  url = process.env.NEXT_PUBLIC_BASE_URL || "",
}) => {
  const handleCopy = (onClose: () => void) => {
    toast.success("Copied to clipboard");
    navigator.clipboard.writeText(shareMessage + " " + url);
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Share</ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-4 gap-4">
                  <ShareIcon
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      shareMessage + " " + url
                    )}`}
                    src="/images/social-icons/whatsapp.svg"
                    alt="whatsapp"
                  />
                  <ShareIcon
                    href={`https://t.me/share/url?url=${encodeURIComponent(
                      url
                    )}&text=${encodeURIComponent(shareMessage)}`}
                    src="/images/social-icons/telegram.svg"
                    alt="telegram"
                  />
                  <ShareIcon
                    href={`https://www.facebook.com/sharer.php?u=${encodeURIComponent(
                      url
                    )}`}
                    src="/images/social-icons/facebook.svg"
                    alt="facebook"
                  />
                  <ShareIcon
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                      url
                    )}&text=${encodeURIComponent(shareMessage)}`}
                    src="/images/social-icons/x.svg"
                    alt="x"
                  />

                  <div
                    onClick={() => handleCopy(onClose)}
                    className="cursor-pointer border-3 border-primary sm:p-5 p-4 rounded-2xl"
                  >
                    <DocumentDuplicateIcon className="" />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
