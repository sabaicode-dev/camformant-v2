import { UseFormReturn } from 'react-hook-form';
import { FormSection } from '../form-section';
import { TextField } from '../text-field';
import { JobFormData } from '@/lib/types/job';

interface SalarySectionProps {
  form: UseFormReturn<JobFormData>;
}

export function SalarySection({ form }: SalarySectionProps) {
  return (
    <FormSection>
      <TextField
        form={form}
        name="min_salary"
        label="Minimum Salary"
        placeholder="Enter minimum salary"
        type="number"
        min={0}
      />
      <TextField
        form={form}
        name="max_salary"
        label="Maximum Salary"
        placeholder="Enter maximum salary"
        type="number"
        min={0}
      />
    </FormSection>
  );
}