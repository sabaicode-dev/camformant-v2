import { useState } from 'react';
import { Jobs } from '@/utils/types/form-type';
import { jobFormSchema } from '@/schema/auth/formSchema';
import { useRouter } from 'next/navigation';
import { useJob } from '@/context/JobContext';
import { API_ENDPOINTS } from '@/utils/const/api-endpoints';
import axiosInstance from '@/utils/axios';
import { validateField, validateNumericField } from '@/utils/validation/JobForm';

interface UseJobFormProps {
    existingData?: Jobs;
    typeOfForm: "POST" | "PUT";
}

export const useJobForm = ({ existingData, typeOfForm }: UseJobFormProps) => {
    const router = useRouter();
    const { fetchJobs, isLoading } = useJob();
    const [errors, setErrors] = useState<Record<string, string | null>>({});
    const [formData, setFormData] = useState<Jobs>(initializeFormData(existingData));

    const handleDateChange = (field: string, date: Date | undefined) => {
        setFormData((prev) => {
            const updatedData = {
                ...prev,
                [field]: date
                    ? new Date(date.setHours(0, 0, 0, 0)).toISOString().split('T')[0]
                    : formData,
            };
            console.log(updatedData);
            setErrors((prev) => ({
                ...prev,
                [field]: validateField(field, date ? date.toISOString() : ''),
            }));

            return updatedData;
        });
    };


    const handleArrayChange = (selected: string[], fieldName: string) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: selected,
        }));

        setErrors(prev => ({
            ...prev,
            [fieldName]: selected.length === 0 ? "This field is required" : null,
        }));
    };

    const handleChangeNum = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData(prev => {
            const updatedData = {
                ...prev,
                [name]: value === "" || isNaN(Number(value)) ? value : Number(value),
            };

            setErrors(prev => ({
                ...prev,
                [name]: validateNumericField(name, value, updatedData),
            }));

            return updatedData;
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData(prev => {
            const updatedData = {
                ...prev,
                [name]: Array.isArray(prev[name as keyof Jobs])
                    ? value.split(",").map(item => item.trim())
                    : value,
            };

            setErrors(prev => ({
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
        handleSubmit,
        handleChange,
        handleArrayChange,
        handleChangeNum,
        handleDateChange,
        setFormData
    };
};

const initializeFormData = (existingData?: Jobs): Jobs => {
    const today = new Date().toISOString().split("T")[0];

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