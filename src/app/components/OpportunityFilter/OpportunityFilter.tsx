import { SelectOption, volunteerOptions } from "@/app/utils/constants";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Chip,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectedItems,
  SelectItem,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../../../tailwind.config";
import { useMediaQuery } from "@/app/hooks/useMediaQuery";

interface OpportunityFilterProps {
  handleClearFilters: () => void;
}

const fullConfig = resolveConfig(tailwindConfig);
const smBreakpoint = fullConfig.theme.screens.sm;

export const OpportunityFilter: React.FC<OpportunityFilterProps> = ({
  handleClearFilters,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tempSelectedFilters, setTempSelectedFilters] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const currentFilters = searchParams.get("categories")?.split(",") || [];
    setTempSelectedFilters(currentFilters);
  }, [searchParams]);

  const handleCategoryChange = (categories: string[]) => {
    setTempSelectedFilters(categories);
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams);
    if (tempSelectedFilters.length > 0) {
      params.set("page", "1");
      params.set("categories", tempSelectedFilters.join(","));
    } else {
      params.delete("categories");
    }
    router.push(`?${params.toString()}`);
    setIsOpen(false);
  };

  const handleClear = () => {
    setTempSelectedFilters([]);
    handleClearFilters();
    setIsOpen(false);
  };

  const isAboveSmBreakpoint = useMediaQuery(`(min-width: ${smBreakpoint})`);

  return (
    <Popover placement="bottom-end" isOpen={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Button
          isIconOnly={!isAboveSmBreakpoint}
          color="primary"
          variant={tempSelectedFilters.length >= 1 ? "solid" : "light"}
          // variant="ghost"
          startContent={<AdjustmentsHorizontalIcon className="size-5" />}
        >
          <span className="hidden sm:inline">Filter</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        {(titleProps) => (
          <div className="px-1 py-2 w-full space-y-3">
            <p className="text-small font-bold text-foreground" {...titleProps}>
              Filters
            </p>
            <div className="mt-2 flex flex-col gap-2 w-full">
              <Select
                id="category"
                name="category"
                items={volunteerOptions}
                label="Category"
                isMultiline={true}
                selectionMode="multiple"
                placeholder="Select categories"
                classNames={{
                  trigger: "min-h-12 py-2",
                }}
                selectedKeys={tempSelectedFilters}
                onSelectionChange={(keys) =>
                  handleCategoryChange(Array.from(keys).map(String))
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
            </div>
            <div className="flex justify-between gap-x-3">
              <Button
                color="primary"
                className="grow"
                variant="bordered"
                onClick={handleClear}
              >
                Clear
              </Button>
              <Button color="primary" className="grow" onClick={applyFilters}>
                Apply
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
