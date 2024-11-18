"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Tooltip,
} from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { AGENCY_URL } from "@/app/utils/constants";
import { useAuth } from "@/app/context/AuthContext";
import EditIcon from "@/app/components/Icons";
import useFetchAgencyOpportunities from "@/app/hooks/useFetchAgencyOpportunities";
import NavigationTitle from "@/app/components/Opportunities/NavigationTitle";

const AgencyOpportunities = () => {
  const { currentUser } = useAuth();
  const { opportunities, loading, error } =
    useFetchAgencyOpportunities(currentUser);
  const router = useRouter();

  const handleCreateOpportunityClick = () => {
    router.push(`${AGENCY_URL}/create-opportunity`);
  };

  const handleEditOppotunitiyClick = (opportunityId: string) => {
    router.push(`${AGENCY_URL}/opportunity/${opportunityId}`);
  };

  return (
    <div className="w-full space-y-8">
      <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 justify-between">
        <NavigationTitle title="Agency Opportunities" />
        <Button color="primary" onClick={handleCreateOpportunityClick}>
          New Opportunity
        </Button>
      </div>
      {opportunities.length <= 0 && !loading ? (
        <p className="text-center pt-9">No opportunity is created yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableColumn>Title</TableColumn>
            <TableColumn>Description</TableColumn>
            <TableColumn>Location</TableColumn>
            <TableColumn>Event Date</TableColumn>
            <TableColumn>Registration Deadline</TableColumn>
            <TableColumn>Action</TableColumn>
          </TableHeader>
          <TableBody items={opportunities}>
            {opportunities.map((opportunity) => (
              <TableRow key={opportunity.id}>
                <TableCell>
                  <User
                    avatarProps={{ radius: "lg", src: opportunity.imageUrl }}
                    description={opportunity.agency.username}
                    name={opportunity.title}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <p className="text-bold text-sm capitalize line-clamp-2 max-w-xl">
                      {opportunity.description}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <p className="text-bold text-sm capitalize">
                      {opportunity.location}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <p className="text-bold text-sm capitalize">
                      {opportunity.date.toDate().toLocaleDateString()}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <p className="text-bold text-sm capitalize">
                      {opportunity.registrationDeadline
                        .toDate()
                        .toLocaleDateString()}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="relative flex items-center gap-2">
                    <Tooltip content="Edit opportunity">
                      <Button
                        className="min-w-0 bg-clear rounded-full"
                        onClick={() =>
                          handleEditOppotunitiyClick(opportunity.id || "")
                        }
                      >
                        <EditIcon />
                      </Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default AgencyOpportunities;
