import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  User,
  Select,
  SelectItem,
  Skeleton,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { firestore } from "@/app/firebase/config";
import { OpportunityVolunteer } from "@/app/models/opportunities";
import { UserRole } from "@/app/models/users";
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  writeBatch,
  Timestamp,
  arrayUnion,
} from "firebase/firestore";
import { toast } from "sonner";
import { volunteerStatusOptions } from "@/app/utils/constants";

interface OpportunityVolunteersProps {
  opportunityId: string;
  isOpen: boolean;
  onOpenChange: () => void;
}

const OpportunityVolunteers: React.FC<OpportunityVolunteersProps> = ({
  opportunityId,
  isOpen,
  onOpenChange,
}) => {
  const title = "Manage Volunteers";
  const confirmText = "Update Status";
  const confirmColor = "primary";
  const cancelText = "Cancel";

  const [volunteers, setVolunteers] = useState<OpportunityVolunteer[] | null>(
    null
  );

  const { currentUser } = useAuth();
  const [statuses, setStatuses] = useState<{ [key: string]: string }>({});
  const [loadingFetch, setLoadingFetch] = useState<boolean>(false);
  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);

  const fetchOpportunityVolunteers = async () => {
    if (!opportunityId) return;
    setLoadingFetch(true);
    try {
      const q = collection(
        firestore,
        "opportunities",
        opportunityId,
        "signedUpVolunteers"
      );
      const querySnapshot = await getDocs(q);
      const volunteers: OpportunityVolunteer[] = querySnapshot.docs.map(
        (doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            username: data.username ?? "",
            avatarImageUrl: data.avatarImageUrl ?? "",
            status: data.status ?? "pending",
          } as OpportunityVolunteer;
        }
      );
      setVolunteers(volunteers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFetch(false);
    }
  };

  useEffect(() => {
    fetchOpportunityVolunteers();
  }, [opportunityId, isOpen]);

  useEffect(() => {
    if (volunteers && volunteers.length > 0) {
      const initialStatuses = volunteers.reduce((acc, volunteer) => {
        acc[volunteer.id] = volunteer.status;
        return acc;
      }, {} as { [key: string]: string });
      setStatuses(initialStatuses);
    }
  }, [volunteers]);

  const updateStatus = async (): Promise<void> => {
    if (
      currentUser?.role === UserRole.Admin ||
      currentUser?.role === UserRole.Agency
    ) {
      setLoadingUpdate(true);
      const batch = writeBatch(firestore);

      try {
        // Get badges associated with this opportunity
        const badgesCollectionRef = collection(
          firestore,
          "opportunities",
          opportunityId,
          "badges"
        );
        const badgesSnapshot = await getDocs(badgesCollectionRef);
        const opportunityBadges = badgesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        for (const volunteerId in statuses) {
          if (statuses.hasOwnProperty(volunteerId)) {
            const newStatus = statuses[volunteerId];
            const updatedStatus: Partial<OpportunityVolunteer> = {
              status: newStatus,
            };

            const opportunityVolunteerRef = doc(
              firestore,
              "opportunities",
              opportunityId,
              "signedUpVolunteers",
              volunteerId
            );
            batch.update(opportunityVolunteerRef, updatedStatus);

            const userRef = doc(firestore, "users", volunteerId);
            batch.update(userRef, {
              [`opportunities.${opportunityId}`]: newStatus,
            });

            // If status is completed, add badges to user's profile
            if (newStatus === "completed" && opportunityBadges.length > 0) {
              const userBadgesCollectionRef = collection(userRef, "badges");

              // Add each badge to user's collection
              opportunityBadges.forEach((badge) => {
                const userBadgeRef = doc(userBadgesCollectionRef, badge.id);
                batch.set(userBadgeRef, {
                  ...badge,
                  earnedDate: Timestamp.now(),
                  opportunityId: opportunityId,
                });
              });

              // Update user's badgesEarned array
              batch.update(userRef, {
                badgesEarned: arrayUnion(...opportunityBadges.map((b) => b.id)),
              });
            }
          }
        }

        await batch.commit();
        console.log("Statuses and badges updated successfully");
        toast.success("Update successful!");

        await fetchOpportunityVolunteers();
      } catch (error) {
        console.error("Error updating statuses:", error);
        toast.error(String(error));
        throw error;
      } finally {
        setLoadingUpdate(false);
      }
    }
  };

  const handleStatusChange = (volunteerId: string, selectedStatus?: string) => {
    if (selectedStatus) {
      setStatuses((prevStatuses) => ({
        ...prevStatuses,
        [volunteerId]: selectedStatus,
      }));
    }
  };

  const handleConfirm = async () => {
    await updateStatus();
  };

  const markAllVolunteers = (status: string) => {
    if (volunteers) {
      const updatedStatuses = volunteers.reduce((acc, volunteer) => {
        acc[volunteer.id] = status;
        return acc;
      }, {} as { [key: string]: string });
      setStatuses(updatedStatuses);
    }
  };

  return (
    <>
      <Modal
        size="xl"
        placement="center"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
              <ModalBody>
                {!volunteers || volunteers.length <= 0 ? (
                  <p className="text-center py-9 text-gray-600">
                    No volunteer has signed up yet.
                  </p>
                ) : (
                  <>
                    <Table>
                      <TableHeader>
                        <TableColumn>Name</TableColumn>
                        <TableColumn>Status</TableColumn>
                      </TableHeader>
                      {loadingFetch ? (
                        <TableBody items={volunteers}>
                          {volunteers.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>
                                <Skeleton className="h-6 w-3/5 rounded-lg" />
                              </TableCell>
                              <TableCell>
                                <Skeleton className="h-6 w-3/5 rounded-lg" />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      ) : (
                        <TableBody items={volunteers}>
                          {volunteers.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>
                                <User
                                  avatarProps={{ src: user.avatarImageUrl }}
                                  name={user.username}
                                ></User>
                              </TableCell>
                              <TableCell>
                                <Select
                                  id={`status-${user.id}`}
                                  name="status"
                                  items={volunteerStatusOptions}
                                  label="Status"
                                  selectedKeys={[statuses[user.id]]}
                                  onSelectionChange={(selectedKey) =>
                                    handleStatusChange(
                                      user.id,
                                      selectedKey.currentKey as string
                                    )
                                  }
                                >
                                  {(item) => (
                                    <SelectItem
                                      key={item.value}
                                      textValue={item.label}
                                    >
                                      {item.label}
                                    </SelectItem>
                                  )}
                                </Select>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      )}
                    </Table>
                    <div className="flex gap-2 mt-2">
                      <Button
                        color="primary"
                        variant="ghost"
                        className="border-1"
                        onPress={() => markAllVolunteers("accepted")}
                        isDisabled={!volunteers || volunteers.length === 0}
                      >
                        Mark All as Accepted
                      </Button>
                      <Button
                        color="success"
                        variant="ghost"
                        className="border-1"
                        onPress={() => markAllVolunteers("completed")}
                        isDisabled={!volunteers || volunteers.length === 0}
                      >
                        Mark All as Completed
                      </Button>
                    </div>
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                {!volunteers || volunteers.length <= 0 ? (
                  <>
                    <Button color={confirmColor} onPress={onClose}>
                      {cancelText}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button color="primary" variant="light" onPress={onClose}>
                      {cancelText}
                    </Button>

                    <Button
                      color={confirmColor}
                      onPress={handleConfirm}
                      isDisabled={loadingUpdate}
                      isLoading={loadingUpdate}
                    >
                      {confirmText}
                    </Button>
                  </>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default OpportunityVolunteers;
