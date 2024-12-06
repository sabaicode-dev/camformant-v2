import { UseFormReturn } from 'react-hook-form';
import { FormSection } from '../form-section';
import { TextField } from '../text-field';
import { JobFormData } from '@/lib/types/job';

interface BasicInfoSectionProps {
  form: UseFormReturn<JobFormData>;
}

export function BasicInfoSection({ form }: BasicInfoSectionProps) {
  return (
    <FormSection>
      <TextField
        form={form}
        name="company.name"
        label="Company Name"
        placeholder="Enter company name"
      />
      <TextField
        form={form}
        name="title"
        label="Job Title"
        placeholder="Enter job title"
      />
    </FormSection>
  );
}