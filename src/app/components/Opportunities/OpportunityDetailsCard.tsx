import BasicCard from "@/app/components/BasicCard";
import { FormikProps } from "formik";
import { OpportunityFormValues } from "../../containers/Opportunities/CreateOpportunity";
import {
  Button,
  Chip,
  DatePicker,
  Input,
  Select,
  SelectedItems,
  SelectItem,
  Textarea,
  useDisclosure,
  User,
} from "@nextui-org/react";
import {
  opportunityStatusOptions,
  SelectOption,
  volunteerOptions,
} from "@/app/utils/constants";
import { UsersIcon } from "@heroicons/react/24/outline";
import OpportunityVolunteers from "@/app/components/Opportunities/OpportunityVolunteers";
import useFetchAllAgencies from "@/app/hooks/useFetchAllAgencies";
import useFetchAllBadges from "@/app/hooks/useFetchAllBadges";

interface OpportunityDetailsCardProps {
  opportunityId?: string;
  formik: FormikProps<OpportunityFormValues>;
  role: "Admin" | "Agency"; // Add the role as a prop
}

const OpportunityDetailsCard: React.FC<OpportunityDetailsCardProps> = ({
  opportunityId,
  formik,
  role, // Receive role from parent component
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { users } = useFetchAllAgencies(); // Fetch all agencies
  const { badges } = useFetchAllBadges(); // Fetch all badges

  return (
    <BasicCard className="shadow-sm rounded-3xl p-12 w-full md:w-3/5 @container">
      <form className="space-y-4" onSubmit={formik.handleSubmit}>
        <div className="flex-row space-y-4 @md:flex @md:space-x-3 @md:space-y-0">
          <Input
            id="title"
            name="title"
            type="title"
            label="Title"
            isRequired
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.title && Boolean(formik.errors.title)}
            errorMessage={formik.touched.title && formik.errors.title}
            isDisabled={formik.isSubmitting}
            classNames={{
              input: "text-base",
              inputWrapper: "text-base",
            }}
          />
          <DatePicker
            id="date"
            name="date"
            label="Date"
            showMonthAndYearPickers
            value={formik.values.date}
            onChange={(newValue) => formik.setFieldValue("date", newValue)}
            onBlur={formik.handleBlur}
            isRequired
            isInvalid={formik.touched.date && Boolean(formik.errors.date)}
            isDisabled={formik.isSubmitting}
            classNames={{
              input: "text-base",
              inputWrapper: "text-base",
              base: "text-base",
              timeInput: "text-base",
              timeInputLabel: "text-base",
            }}
          />
        </div>

        <div className="flex-row space-y-4 @md:flex @md:space-x-3 @md:space-y-0">
          <DatePicker
            id="registrationDeadline"
            name="registrationDeadline"
            label="Registration Deadline"
            hideTimeZone
            showMonthAndYearPickers
            value={formik.values.registrationDeadline}
            onChange={(newValue) =>
              formik.setFieldValue("registrationDeadline", newValue)
            }
            onBlur={formik.handleBlur}
            isRequired
            isInvalid={
              formik.touched.registrationDeadline &&
              Boolean(formik.errors.registrationDeadline)
            }
            isDisabled={formik.isSubmitting}
            classNames={{
              input: "text-base",
              inputWrapper: "text-base",
            }}
          />
        </div>

        <div className="flex-row space-y-4 @md:flex @md:space-x-3 @md:space-y-0">
          <Input
            id="duration"
            name="duration"
            type="number"
            label="Duration (hour)"
            isRequired
            value={formik.values.duration?.toString()}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={
              formik.touched.duration && Boolean(formik.errors.duration)
            }
            errorMessage={formik.touched.duration && formik.errors.duration}
            isDisabled={formik.isSubmitting}
            classNames={{
              input: "text-base",
              inputWrapper: "text-base",
            }}
          />

          <Select
            id="status"
            name="status"
            items={opportunityStatusOptions}
            label="Status"
            selectedKeys={[formik.values.status]}
            onSelectionChange={(selectedKey) =>
              formik.setFieldValue("status", selectedKey.anchorKey)
            }
            isRequired
            isInvalid={formik.touched.status && Boolean(formik.errors.status)}
            errorMessage={formik.touched.status && formik.errors.status}
            isDisabled={formik.isSubmitting}
            classNames={{
              value: "text-base",
            }}
          >
            {(item) => (
              <SelectItem key={item.value} textValue={item.label}>
                {item.label}
              </SelectItem>
            )}
          </Select>
        </div>

        {/* Render the Agency dropdown only if the role is admin */}
        {role === "Admin" && (
          <Select
            id="agency"
            name="agency"
            items={users}
            label="Agency"
            isRequired
            selectedKeys={formik.values.agency ? [formik.values.agency.id] : []}
            onSelectionChange={(keys) => {
              const selectedId = Array.from(keys)[0] as string;
              const selectedUser = users.find((user) => user.id === selectedId);

              // Ensure that only valid data is set in the form field
              if (selectedUser) {
                formik.setFieldValue("agency", {
                  id: selectedUser.id,
                  username: selectedUser.username,
                  avatarImageUrl: selectedUser.avatarImageUrl || "", // Ensure no undefined values
                });
              }
            }}
            classNames={{
              value: "text-base",
            }}
          >
            {(user) => (
              <SelectItem key={user.id} textValue={user.username}>
                <User
                  name={user.username}
                  avatarProps={{ src: `${user.avatarImageUrl}` }}
                />
              </SelectItem>
            )}
          </Select>
        )}

        <Select
          isRequired
          id="badges"
          name="badges"
          items={badges}
          label="Badges"
          selectionMode="multiple"
          selectedKeys={formik.values.badges?.map((badge) => badge.id) || []}
          onSelectionChange={(keys) => {
            const selectedIds = Array.from(keys) as string[];
            const selectedBadges = badges.filter((badge) =>
              selectedIds.includes(badge.id)
            );
            formik.setFieldValue("badges", selectedBadges);
          }}
          classNames={{ value: "text-base" }}
        >
          {(badge) => (
            <SelectItem key={badge.id} textValue={badge.name}>
              <div className="flex items-center gap-2">
                <img
                  src={badge.imageUrl}
                  alt={badge.name}
                  className="w-6 h-6"
                />
                <span>{badge.name}</span>
                <Chip
                  size="sm"
                  color="success"
                  variant="solid"
                  className="text-xs"
                >
                  {badge.achievementLevel}
                </Chip>
              </div>
            </SelectItem>
          )}
        </Select>

        <Input
          id="location"
          name="location"
          type="title"
          label="Location"
          isRequired
          value={formik.values.location}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isInvalid={formik.touched.location && Boolean(formik.errors.location)}
          errorMessage={formik.touched.location && formik.errors.location}
          isDisabled={formik.isSubmitting}
          classNames={{
            input: "text-base",
            inputWrapper: "text-base",
          }}
        />

        <Textarea
          id="description"
          name="description"
          label="Description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isRequired
          isInvalid={
            formik.touched.description && Boolean(formik.errors.description)
          }
          errorMessage={formik.touched.description && formik.errors.description}
          isDisabled={formik.isSubmitting}
          classNames={{
            input: "text-base",
            inputWrapper: "text-base",
          }}
        />

        <Select
          id="category"
          name="category"
          items={volunteerOptions}
          label="Category"
          isDisabled={formik.isSubmitting}
          isMultiline={true}
          // isRequired
          selectionMode="multiple"
          placeholder="Select the category"
          classNames={{
            trigger: "min-h-12 py-2",
          }}
          selectedKeys={formik.values.category}
          onSelectionChange={(keys) =>
            formik.setFieldValue("category", Array.from(keys))
          }
          renderValue={(items: SelectedItems<SelectOption>) => (
            <div className="flex flex-wrap gap-2">
              {items.map((item) => (
                <Chip key={item.key}>{item.data?.label}</Chip>
              ))}
            </div>
          )}
        >
          {(item) => (
            <SelectItem key={item.value} textValue={item.label}>
              {item.label}
            </SelectItem>
          )}
        </Select>

        <Textarea
          id="additionalInformation"
          name="additionalInformation"
          label="Additional Information"
          value={formik.values.additionalInformation}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isDisabled={formik.isSubmitting}
          classNames={{
            input: "text-base",
            inputWrapper: "text-base",
          }}
        />

        <div className="flex flex-wrap justify-end gap-3">
          {opportunityId && (
            <>
              <Button
                color="primary"
                variant="bordered"
                startContent={<UsersIcon className="w-4 h-4" />}
                isDisabled={formik.isSubmitting}
                onClick={onOpen}
              >
                Manage Volunteers
              </Button>
              <OpportunityVolunteers
                opportunityId={opportunityId}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
              />
            </>
          )}
          <Button
            type="submit"
            color="primary"
            isDisabled={formik.isSubmitting}
            isLoading={formik.isSubmitting}
          >
            {opportunityId ? "Update Opportunity" : "Create Opportunity"}
          </Button>
        </div>
      </form>
    </BasicCard>
  );
};

export default OpportunityDetailsCard;
