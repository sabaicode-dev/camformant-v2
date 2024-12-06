import { UseFormReturn } from 'react-hook-form';
import { FormSection } from '../form-section';
import { TextField } from '../text-field';
import { JobFormData } from '@/lib/types/job';

interface LocationSectionProps {
  form: UseFormReturn<JobFormData>;
}

export function LocationSection({ form }: LocationSectionProps) {
  return (
    <FormSection>
      <TextField
        form={form}
        name="job_opening"
        label="Number of Openings"
        placeholder="Enter number of openings"
        type="number"
        min={1}
      />
      <TextField
        form={form}
        name="location"
        label="Location"
        placeholder="Enter job location"
      />
    </FormSection>
  );
}