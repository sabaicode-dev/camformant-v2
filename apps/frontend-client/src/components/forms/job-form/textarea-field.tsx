import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { JobFormData } from '@/lib/types/job';

interface TextareaFieldProps {
  form: UseFormReturn<JobFormData>;
  name: keyof JobFormData;
  label: string;
  placeholder: string;
}

export function TextareaField({
  form,
  name,
  label,
  placeholder,
}: TextareaFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              className="min-h-[100px]"
              {...field}
              value={typeof field.value === 'string' ? field.value : ''}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
