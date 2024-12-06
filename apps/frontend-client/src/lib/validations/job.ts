import * as z from 'zod';
import { JOB_TYPES, WORK_MODES, SCHEDULES } from '../constants';

export const jobFormSchema = z.object({
  title: z.string().min(1, 'Job title is required'),
  company: z.object({
    _id: z.string(),
    name: z.string().min(1, 'Company name is required'),
  }),
  type: z.array(z.enum(JOB_TYPES)).min(1, 'Select at least one job type'),
  workMode: z.array(z.enum(WORK_MODES)).min(1, 'Select at least one work mode'),
  schedule: z.array(z.enum(SCHEDULES)).min(1, 'Select at least one schedule'),
  requirement: z.string().min(1, 'Requirements are required'),
  location: z.string().min(1, 'Location is required'),
  job_opening: z.number().min(1, 'Must have at least one job opening'),
  min_salary: z.number().min(0, 'Minimum salary must be at least 0'),
  max_salary: z.number().min(0, 'Maximum salary must be at least 0'),
  description: z.string().min(1, 'Job description is required'),
  address: z.string().min(1, 'Address is required'),
  required_experience: z.string().min(1, 'Required experience is required'),
  benefit: z.array(z.string()).min(1, 'At least one benefit is required'),
  deadline: z.string().refine((date) => new Date(date) > new Date(), {
    message: 'Deadline must be in the future',
  }),
});