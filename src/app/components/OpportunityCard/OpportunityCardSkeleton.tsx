import { Card, CardBody, CardHeader, Skeleton } from "@nextui-org/react";

export const OpportunityCardSkeleton = () => {
  return (
    <Card
      className="flex items-center justify-center w-full h-full"
      shadow="sm"
    >
      <CardHeader>
        <Skeleton className="relative w-full h-auto aspect-video rounded-lg" />
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <div className="flex flex-col justify-end">
          <Skeleton className="w-1/2 h-5 mb-2 rounded-lg" />
          <Skeleton className="w-1/4 h-4 mb-2 rounded-lg" />
          <Skeleton className="w-1/4 h-4 mb-2 rounded-lg" />
        </div>
      </CardBody>
    </Card>
  );
};
