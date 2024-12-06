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
}

export function TextField({
  form,
  name,
  label,
  placeholder,
  type = "text",
  min,
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
                typeof field.value === "string" ||
                typeof field.value === "number" ||
                Array.isArray(field.value)
                  ? field.value
                  : ""
              }
              onChange={(e) =>
                field.onChange(
                  type === "number" ? Number(e.target.value) : e.target.value
                )
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
