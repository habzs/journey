import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

interface NavigationTitleProps {
    title: string;
}

const NavigationTitle: React.FC<NavigationTitleProps> = ({ title }) => {

    const router = useRouter();

    const handleBackButtonClick = () => {
        router.back()
    };

    return (
        <>
            <div className="flex items-center space-x-3">
                <Button
                    isIconOnly
                    className="bg-clear rounded-full"
                    onClick={handleBackButtonClick}
                >
                    <ChevronLeftIcon className="w-5 h-5 stroke-2" />
                </Button>
                <h4>{title}</h4>
            </div>
        </>
    );
};

export default NavigationTitle;