"use client";
import { HStack, VStack } from "@/app/components/Stack";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
} from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { ADMIN_URL } from "@/app/utils/constants";
import { useAuth } from "@/app/context/AuthContext";
import EditIcon from "@/app/components/Icons";
import NavigationTitle from "@/app/components/Opportunities/NavigationTitle";
import useFetchAllUsers from "@/app/hooks/useFetchAllUsers";
import { getLabelFromValue } from "@/app/utils/utilities";

// TODO: Might want to add an email field in Firestore to fetch user's email
// TODO: Might want to add a createdAt field in Firestore so we can sort users by latest created
const AllUsers = () => {
  const { currentUser } = useAuth();
  const { users, loading, error } = useFetchAllUsers(currentUser);
  const router = useRouter();

  const handleButtonClick = () => {
    router.push(`${ADMIN_URL}/create-user`);
  };

  const handleEditUserClick = (userId: string) => {
    router.push(`${ADMIN_URL}/user/${userId}`);
  };

  return (
    <div className="w-full space-y-8">
      <HStack className="justify-between">
        <NavigationTitle title="All Users" />
        <Button color="primary" onClick={handleButtonClick}>
          New User
        </Button>
      </HStack>
      <Table>
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Mobile</TableColumn>
          <TableColumn>Interests</TableColumn>
          <TableColumn>Action</TableColumn>
        </TableHeader>
        <TableBody items={users}>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="min-w-40 md:min-w-48">
                <User
                  avatarProps={{ src: user.avatarImageUrl }}
                  description={user.email}
                  name={user.username}
                >
                  {user.email}
                </User>
              </TableCell>
              <TableCell className="min-w-40 md:min-w-48">
                <div className="flex flex-col">
                  <p className="text-bold text-sm capitalize">
                    {user.mobileNumber}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                {user.interests.map((interest) => (
                  <Chip
                    className="rounded-md mr-2 mb-1"
                    size="sm"
                    variant="flat"
                    key={interest}
                  >
                    {getLabelFromValue(interest)}
                  </Chip>
                ))}
              </TableCell>
              <TableCell>
                <div className="relative flex items-center gap-2">
                  <Tooltip content="Edit user">
                    <Button
                      className="min-w-0 bg-clear rounded-full"
                      onClick={() => handleEditUserClick(user.id)}
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
    </div>
  );
};

export default AllUsers;
