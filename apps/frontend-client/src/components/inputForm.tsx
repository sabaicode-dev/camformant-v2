import { useState } from 'react';
import { JobForm } from '@/components/forms/job-form';
import { createJob, updateJob } from '@/lib/api/jobs';
import type { JobFormData } from '@/lib/types/job';

function InputForms() {
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (data: JobFormData) => {
    setIsLoading(true);
    try {
      await createJob(data);
      // You can add a toast notification here
      console.log('Job created successfully');
    } catch (error) {
      console.error('Error creating job:', error);
      // You can add error handling here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <JobForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}

export default InputForms;