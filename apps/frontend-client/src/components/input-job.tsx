import { DateInput } from "@/components/ui/dateInput";
import { Input } from "@/components/ui/input";
import Map from "@/components/map";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import SeleteCheckBox from "@/components/seleteCheckBox";
import axiosInstance from "@/utils/axios";
import { Jobs } from "@/utils/types/form-type";
import { API_ENDPOINTS } from "@/utils/const/api-endpoints";
import { jobFormSchema } from "@/schema/auth/formSchema";
import { format } from "date-fns/format";

const InputForm: React.FC<{
  formTitle: string;
  existingData?: Jobs;
  typeOfForm?: string;
}> = ({ formTitle, existingData, typeOfForm = "POST" }) => {
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
      : "", // Default to an empty string if no value
    // updatedAt: existingData?.updatedAt
    //   ? new Date(existingData.updatedAt).toISOString().split("T")[0]
    //   : "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (Array.isArray(formData[name as keyof Jobs])) {
      console.log("value split", value.split(","));
      setFormData({
        ...formData,
        [name]: value.split(","),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleArrayChange = (name: keyof Jobs, value: string[]) => {
    console.log("name:::", name, "values:::", value);
    setFormData((prevState) => ({
      ...prevState,
      [name]: value, // Directly assign the array of strings
    }));
  };

  const handleChangeNum = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value === "" ? null : Number(value),
    });
  };

  const workTypeOptions = [
    { name: "Remote" },
    { name: "On-Site" },
    { name: "Hybrid" },
  ];
  const [workTypeSelected, setWorkTypeSelected] = useState<string[]>([]);

  const typeJobOptions = [{ name: "Contract" }, { name: "Internship" }];
  const [typeJobSelected, setTypeJobSelected] = useState<string[]>([]);

  const scheduleOption = [
    { name: "Full-Time" },
    { name: "Part-Time" },
    { name: "Flexible-Hours" },
    { name: "Project-Based" },
  ];
  const [scheduleSelected, setscheduleSelected] = useState<string[]>([]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // Validate the form data using zod
    const result = jobFormSchema.safeParse({
      ...formData,
      min_salary: Number(formData.min_salary), // Ensure numeric input
      max_salary: Number(formData.max_salary),
    });

    if (!result.success) {
      event.preventDefault();
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

    try {
      let response: any;

      if (typeOfForm === "POST") {
        response = await axiosInstance.post(
          "http://localhost:4000/v1/jobs/job",
          formData
        );
        console.log("post job", formData);
      } else {
        response = await axiosInstance.put(
          `${API_ENDPOINTS.JOBS}/${existingData!._id}`,
          { ...formData, companyId: existingData?.company?._id || "" }
        );
      }
      console.log("Response:", response?.data);
    } catch (error) {
      console.error("Error connecting to server:", error);
    }
  };

  return (
    <div className=" flex bg-no-repeat w-full font-roboto  bg-cover justify-center items-center bg-[url('https://images.unsplash.com/photo-1427694012323-fb5e8b0c165b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNpdHl8ZW58MHx8MHx8fDA%3D')]">
      {/* Form container */}
      <form onSubmit={handleSubmit} className="p-[20px] w-5/6 ">
        <div className="w-full h-auto bg-white p-8 rounded-lg shadow-xl border ">
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
                Company Name
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
                Job Category
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
                onSelect={(selected) => handleArrayChange("type", selected)}
                onRemove={setTypeJobSelected}
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
                onSelect={(selected) => handleArrayChange("schedule", selected)}
                onRemove={setscheduleSelected}
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
                onSelect={(selected) => handleArrayChange("workMode", selected)}
                onRemove={setWorkTypeSelected}
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

          {/* Update Date */}
          {/* <div className="mb-6">
            <Label
              htmlFor="updatedAt"
              className="block text-black text-[16px] mb-1"
            >
              Update Date
            </Label>
            <DateInput
              name="updatedAt"
              type="date"
              value={formData.updatedAt} 
              onChange={handleChange}
              placeholder="YYYY-MM-DD"
            />
            {errors.updatedAt && (
              <p className="text-red-500 text-sm">{errors.updatedAt}</p>
            )}
          </div> */}

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
                formData.required_experience
                  ? (formData.required_experience as string[]).join(",")
                  : ""
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
                formData.benefit ? (formData.benefit as string[]).join(",") : ""
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
