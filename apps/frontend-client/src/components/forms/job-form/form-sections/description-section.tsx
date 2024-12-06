import { UseFormReturn } from 'react-hook-form';
import { TextareaField } from '../textarea-field';
import { JobFormData } from '@/lib/types/job';

interface DescriptionSectionProps {
  form: UseFormReturn<JobFormData>;
}

export function DescriptionSection({ form }: DescriptionSectionProps) {
  return (
    <>
      <TextareaField
        form={form}
        name="description"
        label="Job Description"
        placeholder="Enter detailed job description"
      />
      <TextareaField
        form={form}
        name="requirement"
        label="Requirements"
        placeholder="Enter job requirements"
      />
      <TextareaField
        form={form}
        name="required_experience"
        label="Required Experience"
        placeholder="Enter required experience"
      />
    </>
  );
}