import { UseFormReturn } from 'react-hook-form';
import { FormSection } from '../form-section';
import { TextField } from '../text-field';
import { JobFormData } from '@/lib/types/job';
import { TextArray } from '../text-array';

interface BasicInfoSectionProps {
  form: UseFormReturn<JobFormData>;
}

export function BasicInfoSection({ form }: BasicInfoSectionProps) {
  return (
    <FormSection>
      <TextField
        form={form}
        name="title"
        label="Company Name"
        placeholder="Enter company name"
      />
      <TextArray
        form={form}
        name="position"
        label="Job Title"
        placeholder="Enter job title"
        onChange={(value) => {
          console.log("Updated positions:", value);
          // Perform any custom logic you need with the array value
        }}
      />
    </FormSection>
  );
}