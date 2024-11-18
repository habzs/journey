import { PlusIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";
import { VStack } from "../Stack";

interface PhotoUploadProps {
  imageUrl?: string | null;
  selectedImage: File | null;
  setSelectedImage: React.Dispatch<React.SetStateAction<File | null>>;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  size?: "sm" | "md" | "lg";
  type?: "profile" | "opportunity" | "badge";
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  imageUrl,
  selectedImage,
  setSelectedImage,
  onImageChange,
  label = "Profile picture",
  size = "md",
  type = "profile",
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  let photoSize = "max-w-96 max-h-60";
  let roundedRadius = "rounded-3xl";

  const handleClearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  switch (type) {
    case "profile":
      photoSize = "w-28 h-28";
      roundedRadius = "rounded-full";
      break;
    case "opportunity":
      photoSize = "w-full h-full max-w-96 max-h-60";
      roundedRadius = "rounded-3xl";
      break;
    case "badge":
      photoSize = "w-full h-full max-w-60 max-h-60";
      roundedRadius = "rounded-3xl";
      break;
    default:
      photoSize = "w-full h-full max-w-24 max-h-24";
      roundedRadius = "rounded-full";
      break;
  }

  return (
    <div className="text-center space-y-4 w-full mx-auto">
      <div
        className={`relative mx-auto bg-gray-200 hover:bg-gray-300 flex items-center justify-center ring-2 ring-offset-2 ring-gray-200 transition-all ${roundedRadius} ${photoSize}`}
      >
        {selectedImage ? (
          <>
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Selected"
              className={`${roundedRadius} aspect-video object-cover ${photoSize} ${roundedRadius}`}
            />
            <button
              type="button"
              className={`absolute hover:bg-gray-950/45 group ${photoSize} ${roundedRadius} flex items-center justify-center transition-all`}
              onClick={handleClearImage}
            >
              <XMarkIcon className="text-gray-200 size-12 opacity-0 group-hover:opacity-100 transition-all" />
            </button>
          </>
        ) : (
          <label
            htmlFor="image-upload"
            className={`cursor-pointer ${photoSize} ${roundedRadius} flex items-center justify-center aspect-video`}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Selected"
                className={`object-cover ${photoSize} ${roundedRadius}`}
              />
            ) : (
              <PlusIcon className="text-gray-400 size-12" />
            )}
          </label>
        )}
      </div>
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onImageChange}
        ref={fileInputRef}
      />
      <p className="text-foreground-500">{label}</p>

      <div className="text-xs items-center text-gray-400">
        <p>Allowed .jpeg, .jpg, .png, .gif</p>
        <p>Max size of 3MB</p>
      </div>
    </div>
  );
};

export default PhotoUpload;
