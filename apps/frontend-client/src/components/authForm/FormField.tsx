import React from "react";
import {
  FormControl,
  FormField as UIFormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FormFieldProps {
  form: any;
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  min?: number;
  rightElement?: React.ReactNode;
  isLoading?: boolean;
}

export function FormField({
  form,
  name,
  label,
  placeholder,
  type = "text",
  min,
  rightElement,
  isLoading
}: FormFieldProps) {
  return (
    <UIFormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-4">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                {...field}
                type={type}
                min={min}
                placeholder={placeholder}
                className="w-full border-gray-300 border dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              />
              {rightElement && (
                <div className="absolute right-3 top-4 -translate-y-1/2">
                  {rightElement}
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}