import BasicCard from "@/app/components/BasicCard";
import { volunteerOptions, SelectOption, userRoleOptions } from "@/app/utils/constants";
import { FormikProps } from "formik";
import { UserFormValues } from ".";
import {
    Button,
    Chip,
    Input,
    Select,
    SelectedItems,
    SelectItem,
    Textarea,
} from "@nextui-org/react";
import { HStack } from "@/app/components/Stack";

interface UserDetailsCardProps {
    formik: FormikProps<UserFormValues>;
}

const UserDetailsCard: React.FC<UserDetailsCardProps> = ({ formik }) => {
    return (
        <BasicCard
            className="shadow-sm rounded-3xl p-12 w-full md:w-3/5"
        >
            <form
                className="space-y-4"
                onSubmit={formik.handleSubmit}>
                <HStack>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        label="Email"
                        isRequired
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.email && Boolean(formik.errors.email)}
                        errorMessage={formik.touched.email && formik.errors.email}
                        isDisabled={formik.isSubmitting}
                    />
                    <Input
                        id="username"
                        name="username"
                        type="text"
                        label="Username"
                        isRequired
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.username && Boolean(formik.errors.username)}
                        errorMessage={formik.touched.username && formik.errors.username}
                        isDisabled={formik.isSubmitting}
                    />
                </HStack>

                <div className="flex md:flex-row flex-col gap-4">
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        label="Password"
                        isRequired
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={
                            formik.touched.password && Boolean(formik.errors.password)
                        }
                        errorMessage={formik.touched.password && formik.errors.password}
                        isDisabled={formik.isSubmitting}
                    />

                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        label="Confirm Password"
                        isRequired
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={
                            formik.touched.confirmPassword &&
                            Boolean(formik.errors.confirmPassword)
                        }
                        errorMessage={
                            formik.touched.confirmPassword && formik.errors.confirmPassword
                        }
                        isDisabled={formik.isSubmitting}
                    />
                </div>

                <div className="flex md:flex-row flex-col gap-4">
                    <Input
                        id="mobile"
                        name="mobile"
                        type="tel"
                        label="Mobile Number"
                        isRequired
                        value={formik.values.mobile}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.mobile && Boolean(formik.errors.mobile)}
                        errorMessage={formik.touched.mobile && formik.errors.mobile}
                        isDisabled={formik.isSubmitting}
                    />

                    <Select
                        id="role"
                        name="role"
                        items={userRoleOptions}
                        label="Role"
                        selectedKeys={[formik.values.role]}
                        onSelectionChange={(selectedKey) =>
                            formik.setFieldValue("role", selectedKey.anchorKey)
                        }
                        isRequired
                        isInvalid={
                            formik.touched.role && Boolean(formik.errors.role)
                        }
                        errorMessage={formik.touched.role && formik.errors.role}
                        isDisabled={formik.isSubmitting}
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
                </div>

                <Textarea
                    id="biography"
                    name="biography"
                    label="Biography"
                    value={formik.values.biography}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isDisabled={formik.isSubmitting}
                />

                <Select
                    id="interests"
                    name="interests"
                    items={volunteerOptions}
                    label="Interests"
                    isDisabled={formik.isSubmitting}
                    isMultiline={true}
                    selectionMode="multiple"
                    placeholder="Select your interests"
                    classNames={{
                        trigger: "min-h-12 py-2",
                    }}
                    selectedKeys={formik.values.interests}
                    onSelectionChange={(keys) =>
                        formik.setFieldValue("interests", Array.from(keys))
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

                <div className="flex">
                    <Button
                        type="submit"
                        color="primary"
                        isDisabled={formik.isSubmitting}
                        isLoading={formik.isSubmitting}
                        className="mx-auto md:mr-0 ml-auto"
                    >
                        Create User
                    </Button>
                </div>
            </form>
        </BasicCard>
    );
}

export default UserDetailsCard;