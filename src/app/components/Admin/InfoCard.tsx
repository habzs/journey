import BasicCard from "@/app/components/BasicCard";
import { PrimaryButton } from "@/app/components/CustomButtons";
import { VStack, HStack } from "@/app/components/Stack";
import { ChevronDoubleUpIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";

interface InfoCardProps {
    title: string;
    value: string;
    statistics: string;
    buttonTitle: string;
    action: () => void;
}

const InfoCard: React.FC<InfoCardProps> = (
    {
        title,
        value,
        statistics,
        buttonTitle,
        action,
    }
) => {
    return (
        <BasicCard
            className="flex-1 shadow-sm"
        >
            <VStack spacing={12.0}>
                <HStack>
                    <p className="text-gray-500 text-sm font-semibold">
                        {title}
                    </p>
                </HStack>
                <HStack>
                    <p className="text-3xl font-bold">
                        {value}
                    </p>
                </HStack>
                {/* <div
                    className="flex flex-row flex-wrap"
                    style={{ gap: 5.0 }}
                >
                    <ChevronDoubleUpIcon className="h-5 w-5 text-green-500" />
                    <p className="text-sm font-semibold">
                        {statistics}
                    </p>
                    <p className="text-sm text-gray-500">
                        last 7 days
                    </p>
                </div> */}
                <Button
                    color="primary"
                    onClick={action}
                    className="w-full md:w-fit"
                >
                    {buttonTitle}
                </Button>
            </VStack>
        </BasicCard>
    );
}

export default InfoCard;