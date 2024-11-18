import BasicCard from "@/app/components/BasicCard";
import { FormikProps } from "formik";
import {
  Button,
  Chip,
  Input,
  Select,
  SelectedItems,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import {
  badgeAchievementLevelOptions,
  badgeCategoryOptions,
  SelectOption,
} from "@/app/utils/constants";
import { BadgeFormValues } from "@/app/containers/Badges/CreateBadge";
import { HexColorPicker } from "react-colorful";
import { useState } from "react";

interface BadgeDetailsCardProps {
  badgeId?: string;
  formik: FormikProps<BadgeFormValues>;
}

const BadgeDetailsCard: React.FC<BadgeDetailsCardProps> = ({
  badgeId,
  formik,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  return (
    <BasicCard className="shadow-sm rounded-3xl p-12 w-full md:w-3/5">
      <form className="space-y-4" onSubmit={formik.handleSubmit}>
        <div className="flex-row space-y-4 md:flex md:space-x-3 md:space-y-0">
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
          />
          <Input
            id="criteria"
            name="criteria"
            type="number"
            label="Criteria"
            isRequired
            value={formik.values.criteria?.toString()}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={
              formik.touched.criteria && Boolean(formik.errors.criteria)
            }
            errorMessage={formik.touched.criteria && formik.errors.criteria}
            isDisabled={formik.isSubmitting}
          />
        </div>

        <div className="flex-row space-y-4 md:flex md:space-x-3 md:space-y-0">
          <div className="relative">
            <Input
              id="color"
              name="color"
              type="text"
              label="Hex Color"
              isRequired
              value={formik.values.color}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.color && Boolean(formik.errors.color)}
              errorMessage={formik.touched.color && formik.errors.color}
              isDisabled={formik.isSubmitting}
              onClick={() => setShowColorPicker(true)}
            />
            {showColorPicker && (
              <div className="absolute z-50 mt-2">
                <HexColorPicker
                  color={formik.values.color}
                  onChange={(color) => {
                    formik.setFieldValue("color", color);
                  }}
                />
                <Button
                  onClick={() => setShowColorPicker(false)}
                  color="danger"
                  className="mt-2"
                >
                  Close
                </Button>
              </div>
            )}
          </div>
          <Select
            id="achievementLevel"
            name="achievementLevel"
            items={badgeAchievementLevelOptions}
            label="Achievement Level"
            isRequired
            isDisabled={formik.isSubmitting}
            selectedKeys={[formik.values.achievementLevel]}
            isInvalid={
              formik.touched.achievementLevel &&
              Boolean(formik.errors.achievementLevel)
            }
            errorMessage={
              formik.touched.achievementLevel && formik.errors.achievementLevel
            }
            onSelectionChange={(selectedKey) =>
              formik.setFieldValue("achievementLevel", selectedKey.anchorKey)
            }
          >
            {(item) => (
              <SelectItem key={item.value} textValue={item.label}>
                {item.label}
              </SelectItem>
            )}
          </Select>
        </div>

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
        />

        <Select
          id="category"
          name="category"
          items={badgeCategoryOptions}
          label="Category"
          isMultiline={true}
          selectionMode="multiple"
          placeholder="Select the category"
          isRequired
          isDisabled={formik.isSubmitting}
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

        <div className="flex justify-normal flex-col space-x-0 space-y-3 md:flex-row md:justify-end md:space-x-3 md:space-y-0">
          <Button
            type="submit"
            color="primary"
            isDisabled={formik.isSubmitting}
            isLoading={formik.isSubmitting}
          >
            {badgeId ? "Update Badge" : "Create Badge"}
          </Button>
        </div>
      </form>
    </BasicCard>
  );
};

export default BadgeDetailsCard;
