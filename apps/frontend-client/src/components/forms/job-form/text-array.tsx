import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { JobFormData } from "@/lib/types/job";

interface TextFieldProps {
  form: UseFormReturn<JobFormData>;
  name: keyof JobFormData | "company.name";
  label: string;
  placeholder: string;
  type?: "text" | "number";
  min?: number;
  onChange?: (value: string[]) => void;
}

export function TextArray({
  form,
  name,
  label,
  placeholder,
  type = "text",
  min,
  onChange,
}: TextFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              min={min}
              placeholder={placeholder}
              {...field}
              value={
                Array.isArray(field.value)
                  ? field.value.join(", ") // Join array values into a string
                  : typeof field.value === "object" && field.value !== null
                  ? field.value.name || "" // Handle object with 'name' field
                  : field.value || "" // Default to empty string if not an object
              }
              onChange={(e) => {
                const updatedValue = e.target.value.split(",").map((item) => item.trim());
                field.onChange(updatedValue);

                if (onChange) {
                  onChange(updatedValue);
                }
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
