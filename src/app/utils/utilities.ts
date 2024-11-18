import { volunteerOptions } from "./constants";

export function getLabelFromValue(value: string): string {
  const option = volunteerOptions.find((opt) => opt.value === value);
  return option ? option.label : value; // Return the value itself if no match is found
}
