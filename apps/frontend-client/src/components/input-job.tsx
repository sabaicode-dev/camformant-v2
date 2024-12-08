import { DateInput } from "@/components/ui/dateInput";
import { Input } from "@/components/ui/input";
import Map from "@/components/map";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/utils/axios";
import { Jobs } from "@/utils/types/form-type";
import { jobFormSchema } from "@/schema/auth/formSchema";
import SeleteCheckBox from "./selectBox";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
import { useRouter } from "next/navigation";
import { useJob } from "@/context/JobContext";


const InputForm: React.FC<{
  formTitle: string;
  existingData?: Jobs;
  typeOfForm?: string;
}> = ({ formTitle, existingData, typeOfForm = "POST" }) => {
  const {fetchJobs} = useJob()
  const [formData, setFormData] = useState<Jobs>({
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
      : "",
  });
  const router = useRouter();
  const workTypeOptions = [
    { name: "Remote" },
    { name: "On-Site" },
    { name: "Hybrid" },
  ];

  const typeJobOptions = [{ name: "Contract" }, { name: "Internship" }];

  const scheduleOption = [
    { name: "Full-Time" },
    { name: "Part-Time" },
    { name: "Flexible-Hours" },
    { name: "Project-Based" },
  ];

  const [errors, setErrors] = useState<Record<string, string | null>>({});

  // Handle changes for array-type fields
  const handleArrayChange = (
    selected: string[],
    fieldName: string // Added fieldName parameter for flexibility
  ) => {
    // Update the form data and validate
    setFormData((prevFormData) => {
      const updatedFormData = {
        ...prevFormData,
        [fieldName]: selected, // Dynamically assign the array to the given field
      };

      // Validate the array and set errors if needed
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: selected.length === 0 ? "This field is required" : null, // Show error if array is empty
      }));

      return updatedFormData;
    });
  };

  const handleChangeNum = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => {
      const numericValue =
        value === "" || isNaN(Number(value)) ? value : Number(value);

      const updatedFormData = {
        ...prevFormData,
        [name]: numericValue,
      };

      setErrors((prevErrors) => {
        let error = null;

        if (value === "") {
          error = "This field is required";
        } else if (isNaN(Number(value))) {
          error = "This field must be a number";
        } else if (Number(value) < 0) {
          error = "This field cannot be a negative number";
        } else if (
          name === "max_salary" &&
          Number(value) <= Number(prevFormData.min_salary)
        ) {
          error = "Max salary must be larger than Min salary";
        }
        return {
          ...prevErrors,
          [name]: error,
        };
      });

      return updatedFormData;
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
  
    // Check if the field should be treated as an array or string
    const isArrayField = Array.isArray(formData[name as keyof Jobs]);
  
    setFormData((prevFormData) => {
      const updatedFormData = {
        ...prevFormData,
        [name]: isArrayField
          ? value.split(",").map((item) => item.trim()) // Split string into an array if it's an array field
          : value, // Else treat as a normal string
      };
  
      // Real-time validation for deadline date field
      setErrors((prevErrors) => {
        let error: string | null = null;
  
        if (name === "deadline") {
          const currentDate = new Date();
          const inputDate = new Date(value);
  
          if (!value.trim()) {
            error = "Deadline is required";
          } else if (isNaN(inputDate.getTime())) {
            error = "Invalid date format";
          } else if (inputDate < currentDate) {
            error = "Deadline cannot be in the past";
          }
        } else if (isArrayField) {
          // Real-time validation for array fields
          error =
            (updatedFormData[name as keyof Jobs] as string[]).length === 0 ||
            (updatedFormData[name as keyof Jobs] as string[]).some(
              (item) => item === ""
            )
              ? "This field is required and cannot be empty"
              : null;
        } else {
          // Real-time validation for other fields
          error = value.trim() === "" ? "This field is required" : null;
        }
  
        return {
          ...prevErrors,
          [name]: error,
        };
      });
  
      return updatedFormData;
    });
  };
  

  const setErrorWithZod = (event?: React.FormEvent<HTMLFormElement>) => {
    const result = jobFormSchema.safeParse({
      ...formData,
      min_salary: Number(formData.min_salary), // Ensure numeric input
      max_salary: Number(formData.max_salary),
    });

    if (!result.success) {
      event && event.preventDefault();
      const newErrors: { [key: string]: string } = {};
      result.error.errors.forEach((error) => {
        if (error.path && error.path[0]) {
          newErrors[error.path[0]] = error.message;
        }
      });
      setErrors(newErrors); // Update the errors state
      console.log("Parsed errors:", newErrors); // Debugging output
      return;
    } else {
      setErrors({});
      console.log("Form data is valid:", formData);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // Validate the form data using zod
    setErrorWithZod(event);
    try {
      let response: any;
      if (typeOfForm === "POST") {
        event.preventDefault();
        response = await axiosInstance.post(
          `${API_ENDPOINTS.JOB}`,
          formData
        );
        await fetchJobs()
      router.push("/dashboard/jobs");
        console.log("post job", formData);
      } else {
        event.preventDefault();
        response = await axiosInstance.put(
          `${API_ENDPOINTS.JOB_ENDPOINT}/${existingData!._id}`,
          { ...formData, companyId: existingData?.company?._id || "" }
        );
        await fetchJobs()
      router.push("/dashboard/jobs");
      }
      console.log("Response:", response?.data);
    } catch (error) {
      console.error("Error connecting to server:", error);
    }
  };

  return (
    <div className=" flex bg-no-repeat w-full font-roboto  bg-cover justify-center items-center">
      {/* Form container */}
      <form onSubmit={handleSubmit} className="p-[20px] w-full ">
        <div className="w-full h-auto bg-white p-8 rounded-lg  ">
          <h2 className="text-center text-2xl font-bold font-roboto text-gray-800 mb-4">
            {formTitle}
          </h2>
          <hr className="my-4" />

          {/* company name and jobCategory */}
          <div className="flex w-full gap-4 mb-5 justify-center ">
            <div className="w-2/4">
              <Label
                htmlFor="title"
                className="block text-black text-[16px] mb-1"
              >
                Title Job
              </Label>
              <Input
                placeholder="name"
                value={formData.title}
                name="title"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title}</p>
              )}
            </div>
            <div className="w-2/4">
              <Label
                htmlFor="jobCategory"
                className="block text-black text-[16px] mb-1"
              >
                Job Position
              </Label>
              <Input
                placeholder="job"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              />
              {errors.position && (
                <p className="text-red-500 text-sm">{errors.position}</p>
              )}
            </div>
          </div>

          {/*Job Type and schedule */}
          <div className="flex gap-4  mb-5 ">
            <div className="w-2/4">
              <Label
                htmlFor="type"
                className="block text-black text-[16px] rounded-lg mb-1"
              >
                Job Type
              </Label>
              <SeleteCheckBox
                options={typeJobOptions}
                selectedValue={formData.type ? formData.type : []}
                onSelect={(selected) => handleArrayChange(selected, "type")}
                onRemove={(selected) => handleArrayChange(selected, "type")}
              />
              {errors.type && (
                <p className="text-red-500 text-sm">{errors.type}</p>
              )}
            </div>
            <div className="w-2/4">
              <Label
                htmlFor="type"
                className="block text-black text-[16px] mb-1"
              >
                schedule
              </Label>
              <SeleteCheckBox
                options={scheduleOption}
                selectedValue={formData.schedule ? formData.schedule : []}
                onSelect={(selected) => handleArrayChange(selected, "schedule")}
                onRemove={(selected) => handleArrayChange(selected, "schedule")}
              />
              {errors.schedule && (
                <p className="text-red-500 text-sm">{errors.schedule}</p>
              )}
            </div>
          </div>

          {/* job_opening and workmode */}
          <div className="flex gap-4 mb-5">
            <div className="w-2/4">
              <Label
                htmlFor="type"
                className="block text-black text-[16px] mb-1"
              >
                workMode
              </Label>
              <SeleteCheckBox
                options={workTypeOptions}
                selectedValue={formData.workMode ? formData.workMode : []}
                onSelect={(selected) => handleArrayChange(selected, "workMode")}
                onRemove={(selected) => handleArrayChange(selected, "workMode")}
              />
              {errors.workMode && (
                <p className="text-red-500 text-sm">{errors.workMode}</p>
              )}
            </div>
            <div className="w-2/4">
              <Label
                htmlFor="job_opening"
                className="block text-black text-[16px] mb-1"
              >
                job_opening
              </Label>
              <Input
                type="number"
                name="job_opening"
                value={formData.job_opening || ""} // Ensure controlled input
                onChange={handleChangeNum}
                placeholder="Number"
                className="h-[38px]"
              />
              {errors.job_opening && (
                <p className="text-red-500 text-sm">{errors.job_opening}</p>
              )}
            </div>
          </div>
          {/*  Post Date and Last Date */}
          <div className="flex gap-4 mb-5">
            <div className="w-2/4">
              <Label
                htmlFor="createdAt"
                className="block text-black text-[16px] mb-1"
              >
                Post Date
              </Label>
              <DateInput
                name="createdAt"
                type="date"
                value={formData.createdAt || ""} // Ensure controlled input
                onChange={handleChange}
                placeholder="YYYY-MM-DD"
              />
              {errors.createdAt && (
                <p className="text-red-500 text-sm">{errors.createdAt}</p>
              )}
            </div>
            <div className="w-2/4">
              <Label
                htmlFor="deadline"
                className="block text-black text-[16px] mb-1"
              >
                Last Date
              </Label>
              <DateInput
                name="deadline"
                type="date"
                value={formData.deadline || ""} // Ensure controlled input
                onChange={handleChange}
                placeholder="YYYY-MM-DD"
              />
              {errors.deadline && (
                <p className="text-red-500 text-sm">{errors.deadline}</p>
              )}
            </div>
          </div>

          {/* Salary and Salary To */}
          <div className="flex gap-4 mb-5">
            <div className="w-2/4">
              <Label
                htmlFor="SalaryFrom"
                className="block text-black text-[16px] mb-1"
              >
                Salary From
              </Label>
              <Input
                name="min_salary"
                type="number"
                value={formData.min_salary || ""}
                onChange={handleChangeNum}
                placeholder="$"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.min_salary && (
                <p className="text-red-500 text-sm">{errors.min_salary}</p>
              )}
            </div>
            <div className="w-2/4">
              <Label
                htmlFor="SalaryTo"
                className="block text-black text-[16px] mb-1"
              >
                Salary To
              </Label>
              <Input
                name="max_salary"
                type="number"
                value={formData.max_salary || ""}
                onChange={handleChangeNum}
                placeholder="$"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.max_salary && (
                <p className="text-red-500 text-sm">{errors.max_salary}</p>
              )}
            </div>
          </div>

          {/* required_experience */}
          <div className="mb-2">
            <Label
              htmlFor="required_experience"
              className="block text-black text-[16px] mb-1"
            >
              required_experience
            </Label>
            <textarea
              name="required_experience"
              onChange={handleChange}
              value={
                Array.isArray(formData.required_experience)
                  ? (formData.required_experience as string[]).join(",") // If it's an array, join the values with commas
                  : formData.required_experience || "" // Otherwise, return the string value or an empty string
              }
              placeholder="Type your Description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-orange-400"
              rows={4}
            ></textarea>
            {errors.required_experience && (
              <p className="text-red-500 text-sm">
                {errors.required_experience}
              </p>
            )}
          </div>

          {/* requirement */}
          <div className="mb-2">
            <Label
              htmlFor="SalaryFrom"
              className="block text-black text-[16px] mb-1"
            >
              requirement
            </Label>
            <textarea
              name="requirement"
              onChange={handleChange}
              value={formData.requirement}
              placeholder="Type your Description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-orange-400"
              rows={4}
            ></textarea>
            {errors.requirement && (
              <p className="text-red-500 text-sm">{errors.requirement}</p>
            )}
          </div>

          {/* benefit */}
          <div className="mb-2">
            <Label
              htmlFor="benefit"
              className="block text-black text-[16px] mb-1"
            >
              benefit
            </Label>
            <textarea
              name="benefit"
              value={
                Array.isArray(formData.benefit)
                  ? (formData.benefit as string[]).join(",") // If it's an array, join the values with commas
                  : formData.benefit || "" // Otherwise, return the string value or an empty string
              }
              onChange={handleChange}
              placeholder="Type your Description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-orange-400"
              rows={4}
            ></textarea>
            {errors.benefit && (
              <p className="text-red-500 text-sm">{errors.benefit}</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <Label
              htmlFor="description"
              className="block text-black text-[16px] mb-1"
            >
              Description
            </Label>
            <textarea
              name="description"
              onChange={handleChange}
              value={formData.description}
              placeholder="Type your Description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-orange-400"
              rows={4}
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          {/* map */}
          <Map setFormData={setFormData} existingMap={formData.address} />
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 focus:outline-none"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;
