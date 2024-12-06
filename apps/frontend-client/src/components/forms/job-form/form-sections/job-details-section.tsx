import { UseFormReturn } from 'react-hook-form';
import { FormSection } from '../form-section';
import { SelectField } from '../select-field';
import { JobFormData } from '@/lib/types/job';
import { JOB_TYPES, WORK_MODES, SCHEDULES } from '@/lib/constants';

interface JobDetailsSectionProps {
  form: UseFormReturn<JobFormData>;
}

export function JobDetailsSection({ form }: JobDetailsSectionProps) {
  return (
    <FormSection columns={3}>
      <SelectField
        form={form}
        name="type"
        label="Job Type"
        options={JOB_TYPES}
        placeholder="Select job type"
      />
      <SelectField
        form={form}
        name="workMode"
        label="Work Mode"
        options={WORK_MODES}
        placeholder="Select work mode"
      />
      <SelectField
        form={form}
        name="schedule"
        label="Schedule"
        options={SCHEDULES}
        placeholder="Select schedule"
      />
    </FormSection>
  );
}