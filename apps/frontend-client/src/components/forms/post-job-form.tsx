// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { CalendarIcon, Plus, X } from "lucide-react";
// import { format } from "date-fns";

// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { Badge } from "@/components/ui/badge";
// import { cn } from "@/lib/utils";
// import { jobFormSchema } from "@/lib/validations/job";
// import { JOB_TYPES, WORK_MODES, SCHEDULES } from "@/lib/constants";

// export function PostJobForm() {
//   const [benefits, setBenefits] = useState<string[]>([]);
//   const [newBenefit, setNewBenefit] = useState("");
//   const forms = useForm<{ benefit: string[] }>(); // Ensure form types match the structure

//   const form = useForm({
//     resolver: zodResolver(jobFormSchema),
//     defaultValues: {
//       title: "",
//       company: {
//         _id: "1", // This would come from your auth context
//         name: "",
//       },
//       type: [],
//       workMode: [],
//       schedule: [],
//       requirement: "",
//       location: "",
//       job_opening: 1,
//       min_salary: 0,
//       max_salary: 0,
//       description: "",
//       address: "",
//       required_experience: "",
//       benefit: [],
//       deadline: "",
//     },
//   });

//   function onSubmit(values: any) {
//     console.log("value",values);
//   }

//   const addBenefit = () => {
//     if (newBenefit.trim() && !benefits.includes(newBenefit.trim())) {
//       const updatedBenefits = [...benefits, newBenefit.trim()];
//       setBenefits(updatedBenefits);
//       forms.setValue("benefit", updatedBenefits);
//       setNewBenefit("");
//     }
//   };

//   const removeBenefit = (benefit: string) => {
//     const updatedBenefits = benefits.filter((b) => b !== benefit);
//     setBenefits(updatedBenefits);
//     forms.setValue("benefit", updatedBenefits);
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       <h1 className="text-3xl font-bold text-center mb-8 bg-red-600">Post a New Job</h1>
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//           <div className="grid grid-cols-2 gap-6">
//             <FormField
//               control={form.control}
//               name="company.name"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Company Name</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter company name" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="title"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Job Title</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter job title" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// }
