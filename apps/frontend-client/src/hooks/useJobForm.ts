import { useState } from 'react';
import { Jobs } from '@/utils/types/form-type';
import { jobFormSchema } from '@/schema/auth/formSchema';
import { useRouter } from 'next/navigation';
import { useJob } from '@/context/JobContext';
import { API_ENDPOINTS } from '@/utils/const/api-endpoints';
import axiosInstance from '@/utils/axios';
import { validateField, validateNumericField } from '@/utils/validation/JobForm';
import { format } from 'date-fns';
interface UseJobFormProps {
  existingData?: Jobs;
  typeOfForm: "POST" | "PUT";
}

const initializeFormData = (existingData?: Jobs): Jobs => {
  return {
    title: existingData?.title || "",
    position: existingData?.position || [],
    workMode: existingData?.workMode || [],
    location: existingData?.location || "",
    requirement: existingData?.requirement || "",
    description: existingData?.description || "",
    address: existingData?.address || "",
    min_salary: existingData?.min_salary || 0,
    max_salary: existingData?.max_salary || 0,
    job_opening: existingData?.job_opening || 0,
    type: existingData?.type || [],
    schedule: existingData?.schedule || [],
    required_experience: existingData?.required_experience || [],
    benefit: existingData?.benefit || [],
    deadline: existingData?.deadline
      ? new Date(existingData.deadline).toISOString().split("T")[0]
      : "",
    createdAt: existingData?.createdAt
      ? new Date(existingData.createdAt).toISOString().split("T")[0]
      : "", // Set today as default for createdAt
  };
};

export const useJobForm = ({ existingData, typeOfForm }: UseJobFormProps) => {
  const router = useRouter();
  const { fetchJobs, isLoading } = useJob();
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [formData, setFormData] = useState<Jobs>(initializeFormData(existingData));

  const [createdAtDate, setCreatedAtDate] = useState<Date | undefined>(
    formData.createdAt ? new Date(formData.createdAt) : undefined
  );
  const [deadlineDate, setDeadlineDate] = useState<Date | undefined>(
    formData.deadline ? new Date(formData.deadline) : undefined
  );

  const handleDateChange = (field: string, date: Date | undefined) => {
    if (field === 'createdAt') {
      setCreatedAtDate(date);
      setFormData((prev) => ({
        ...prev,
        createdAt: date ? format(date, 'yyyy-MM-dd') : '',
      }));
      setErrors((prev) => ({
        ...prev,
        createdAt: validateField('createdAt', date?.toISOString() || ''),
      }));
    } else if (field === 'deadline') {
      setDeadlineDate(date);
      setFormData((prev) => ({
        ...prev,
        deadline: date ? format(date, 'yyyy-MM-dd') : '',
      }));
      setErrors((prev) => ({
        ...prev,
        deadline: validateField('deadline', date?.toISOString() || ''),
      }));
    }
  };

  const handleArrayChange = (selected: string[], fieldName: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [fieldName]: selected,
    }));

    setErrors((prev) => ({
      ...prev,
      [fieldName]: selected.length === 0 ? "This field is required" : null,
    }));
  };

  const handleChangeNum = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev: any) => {
      const updatedData = {
        ...prev,
        [name]: value === "" || isNaN(Number(value)) ? value : Number(value),
      };

      setErrors((prev) => ({
        ...prev,
        [name]: validateNumericField(name, value, updatedData),
      }));

      return updatedData;
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev: any) => {
      const updatedData = {
        ...prev,
        [name]: value,
      };

      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));

      return updatedData;
    });
  };

  const validateForm = () => {
    const result = jobFormSchema.safeParse({
      ...formData,
      min_salary: Number(formData.min_salary),
      max_salary: Number(formData.max_salary),
    });

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((error) => {
        if (error.path[0]) {
          newErrors[error.path[0].toString()] = error.message;
        }
      });
      setErrors(newErrors);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (typeOfForm === "POST") {
        await axiosInstance.post(API_ENDPOINTS.JOB, formData);
        // console.log("formData", formData);
      } else {
        await axiosInstance.put(
          `${API_ENDPOINTS.JOB_ENDPOINT}/${existingData!._id}`,
          { ...formData, companyId: existingData?.company?._id || "" }
        );
      }

      await fetchJobs();
      router.push("/dashboard/jobs");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return {
    formData,
    errors,
    isLoading,
    createdAtDate,
    deadlineDate,
    handleSubmit,
    handleChange,
    handleArrayChange,
    handleChangeNum,
    handleDateChange,
    setFormData
  };
};
