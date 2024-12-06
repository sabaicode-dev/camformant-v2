import { z } from 'zod';
import { jobFormSchema } from '../validations/job';

export type JobFormData = z.infer<typeof jobFormSchema>;

export interface Job extends JobFormData {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export type JobFormProps = {
  initialData?: Job;
  onSubmit: (data: JobFormData) => Promise<void>;
  isLoading?: boolean;
};