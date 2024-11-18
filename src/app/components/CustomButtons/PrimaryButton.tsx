import { Button } from "@nextui-org/react";
import React from "react";

interface PrimaryButtonProps {
    title: string;
    action?: () => void;
    className?: string;
    type?: "button" | "submit" | "reset";
    isDisabled?: boolean;
    isLoading?: boolean;
    role?: "default" | "destructive";
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = (
    {
        title,
        action,
        className = "",
        type = "button",
        isDisabled = false,
        isLoading = false,
        role = "default",
    }
) => {

    const buttonColor =
        role === "destructive"
            ? "bg-red-600 hover:bg-red-700 focus-visible:ring-red-600"
            : "bg-gray-900 hover:bg-gray-900/90 focus-visible:ring-gray-950";

    return (
        <Button
            onClick={action}
            className={`inline-flex h-8 px-3 items-center justify-center rounded-lg text-xs font-medium text-gray-50 shadow transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 ${buttonColor} ${className}`}
            type={type}
            isDisabled={isDisabled}
            isLoading={isLoading}
        >
            {title}
        </Button>
    );
};
