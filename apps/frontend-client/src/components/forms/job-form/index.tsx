// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Button } from "@/components/ui/button";
// import { Form } from "@/components/ui/form";
// import { jobFormSchema } from "@/lib/validations/job";
// import { JobFormProps, JobFormData, Job } from "@/lib/types/job";
// import { BasicInfoSection } from "./form-sections/basic-info-section";
// import { JobDetailsSection } from "./form-sections/job-details-section";
// import { SalarySection } from "./form-sections/salary-section";
// import { DescriptionSection } from "./form-sections/description-section";
// import { BenefitsField } from "./benefits-field";
// import { DateField } from "./date-field";
// import Map from "@/components/map";

// export function JobForm({
//   initialData,
//   onSubmit,
//   isLoading,
// }: JobFormProps) {
//   const form = useForm<JobFormData>({
//     resolver: zodResolver(jobFormSchema),
//     defaultValues: initialData || {
//       title: existingData?.title || "",
//       position: existingData?.position || [],
//       workMode: existingData?.workMode || [],
//       location: existingData?.location || "",
//       requirement: existingData?.requirement || "",
//       description: existingData?.description || "",
//       address: existingData?.address || "",
//       min_salary: existingData?.min_salary || 0,
//       max_salary: existingData?.max_salary || 0,
//       job_opening: existingData?.job_opening || 0,
//       type: existingData?.type || [],
//       schedule: existingData?.schedule || [],
//       required_experience: existingData?.required_experience || [],
//       benefit: existingData?.benefit || [],
//       deadline: existingData?.deadline
//         ? new Date(existingData.deadline).toISOString().split("T")[0]
//         : "",
//       createdAt: existingData?.createdAt
//         ? new Date(existingData.createdAt).toISOString().split("T")[0]
//         : "",
//     },
//   });

//   const handleSubmit = async (data: JobFormData) => {
//     try {
//       console.log("Submitted data:", data); // Debugging
//       await onSubmit(data); // Submit the form data to the parent component
//     } catch (error) {
//       console.error("Error submitting form:", error);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       {/* title in form */}
//       <h1 className="text-3xl font-bold text-center bg-yellow-300 mb-8">
//         {initialData ? "Edit Job" : "Post a Job"}
//       </h1>

//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit(handleSubmit)}
//           className="space-y-6"
//         >
//           <BasicInfoSection form={form} />
//           <JobDetailsSection form={form} />
//           <SalarySection form={form} />
//           <DescriptionSection form={form} />
//           <BenefitsField form={form} />
//           <DateField form={form} name="deadline" label="Application Deadline" />
//           <Map
//             //@ts-ignore
//             setFormData={(data: Job) =>
//               form.setValue("location", data.location)
//             }
//             existingMap={initialData?.address || ""}
//           />
//           <Button type="submit" className="w-full" disabled={isLoading}>
//             {isLoading ? "Saving..." : initialData ? "Update Job" : "Post Job"}
//           </Button>
//         </form>
//       </Form>
//     </div>
//   );
// }
