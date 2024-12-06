import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { jobFormSchema } from "@/lib/validations/job";
import { JobFormProps, JobFormData, Job } from "@/lib/types/job";
import { BasicInfoSection } from "./form-sections/basic-info-section";
import { JobDetailsSection } from "./form-sections/job-details-section";
import { SalarySection } from "./form-sections/salary-section";
import { DescriptionSection } from "./form-sections/description-section";
import { BenefitsField } from "./benefits-field";
import { DateField } from "./date-field";
import Map from "@/components/map";

export function JobForm({ initialData, onSubmit, isLoading }: JobFormProps) {
  const form = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: initialData || {
      title: "",
      company: {
        _id: "1", // This would come from your auth context
        name: "",
      },
      type: [],
      workMode: [],
      schedule: [],
      requirement: "",
      location: "",
      job_opening: 1,
      min_salary: 0,
      max_salary: 0,
      description: "",
      address: "",
      required_experience: "",
      benefit: [],
      deadline: "",
    },
  });

  const handleSubmit = (data: JobFormData) => {
    console.log("Submitted data:", data); // Debugging
    try {
      onSubmit(data); // Submit the form data to the parent component
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* title in form */}
      <h1 className="text-3xl font-bold text-center bg-yellow-300 mb-8">
        {initialData ? "Edit Job" : "Post a Job"}
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <BasicInfoSection form={form} />
          <JobDetailsSection form={form} />
          <SalarySection form={form} />
          <DescriptionSection form={form} />
          <BenefitsField form={form} />
          <DateField form={form} name="deadline" label="Application Deadline" />
          <Map
            //@ts-ignore
            setFormData={(data: Job) =>
              form.setValue("location", data.location)
            }
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : initialData ? "Update Job" : "Post Job"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
