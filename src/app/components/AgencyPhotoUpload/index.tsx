import { PlusIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";

interface AgencyPhotoUploadProps {
  selectedImage: File | null;
  setSelectedImage: React.Dispatch<React.SetStateAction<File | null>>;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  size?: "sm" | "md" | "lg";
}

const AgencyPhotoUpload: React.FC<AgencyPhotoUploadProps> = ({
  selectedImage,
  setSelectedImage,
  onImageChange,
  label = "Opportunity Picture",
  size = "md",
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleClearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="text-center space-y-4 w-fit mx-auto">
      <div className="mx-auto w-48 h-32 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center ring-2 ring-offset-2 ring-gray-200 relative transition-all">
        {selectedImage ? (
          <>
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Selected"
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              type="button"
              className="absolute hover:bg-gray-950/45 group rounded-lg w-full h-full flex items-center justify-center transition-all"
              onClick={handleClearImage}
            >
              <XMarkIcon className="text-gray-200 size-12 opacity-0 group-hover:opacity-100 transition-all" />
            </button>
          </>
        ) : (
          <label
            htmlFor="image-upload"
            className="cursor-pointer w-full h-full flex items-center justify-center"
          >
            <PlusIcon className="text-gray-400 size-12" />
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
    </div>
  );
};

export default AgencyPhotoUpload;
