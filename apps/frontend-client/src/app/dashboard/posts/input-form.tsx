import { DateInput } from "@/components/ui/dateInput";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/selete";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/utils/axios";

export type Jobs = {
  _id?: string;
  company_id?: string;
  title?: string;
  position?: string[];
  workMode?: string[];
  requirement?: string;
  location?: string;
  job_opening?: number;
  max_salary?: number;
  min_salary?: number;
  description?: string;
  address?: string;
  type?: string[];
  schedule?: string[];
  required_experience?: string[];
  benefit?: string[];
  deadline?: string;
  createdAt?: string;
  updatedAt?: string;
};

const InputForm = () => {
  const [formData, setFormData] = useState<Jobs>({
    title: "",
    position: [],
    workMode: [],
    location: "",
    requirement:" ",
    description: " ",
    address: " ",
    min_salary: 0,
    max_salary: 0,
    job_opening: 3,
    type: ["Contract"],
    schedule: ["Full-Time"],
    required_experience: [
      "Proficiency in REST API development",
      "Experience with cloud services like AWS",
      "Strong problem-solving skills",
    ],
    benefit: [
      "Health insurance",
      "401(k) matching",
      "Flexible working hours",
    ],
    deadline: "",
    createdAt: "",
    updatedAt: "2024-11-27T00:00:00.000+00:00",
  });

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { id, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]:
        id === 'min_salary' || id === 'max_salary'
          ? parseInt(value) || 0
          : value,
    }));
  };

  const handleArrayChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: keyof Jobs
  ) => {
    const { value } = e.target;
  
    setFormData((prevData) => {
      const currentArray = prevData[field] as string[] || [];
      if (!currentArray.includes(value)) {
        return {
          ...prevData,
          [field]: [...currentArray, value],
        };
      }
      return prevData; // Prevent duplicate entries
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Form submitted:", formData);

    // Prepare the payload by excluding empty fields


    try {

      const response = await axiosInstance.post(
        "http://localhost:4000/v1/corporate/job",
        formData
      );
      console.log(response.data);
    } catch (error) {
      console.log("errror connect to server", error);
    }
  };

  return (
    <div className="h-[1000px] flex bg-no-repeat bg-cover justify-center items-center bg-[url('https://images.unsplash.com/photo-1427694012323-fb5e8b0c165b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNpdHl8ZW58MHx8MHx8fDA%3D')]">
      {/* Form container */}
      <div className="w-5/6 h-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-center text-2xl text-gray-800 mb-4">
          Input Fields
        </h2>
        <hr className="my-4" />
        <form onSubmit={handleSubmit}>
          {/* Name and Title */}
          <div className="flex gap-6 mb-5">
            <div className="w-2/4">
              <Label htmlFor="name" className="block text-black text-sm mb-1">
                Name
              </Label>
              <Input
                placeholder="Name"
                id="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              />
            </div>
            <div className="w-2/4">
              <Label htmlFor="title" className="block text-black text-sm mb-1">
                Title
              </Label>
              <Input
                placeholder="Title"
                id="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              />
            </div>
          </div>

          {/* Job Category and Job Type */}
          <div className="flex gap-6 mb-5">
            <div className="w-2/4">
              <Label
                htmlFor="jobCategory"
                className="block text-black text-sm mb-1"
              >
                Job Category
              </Label>
              <select
                id="position"
                value={formData.position} // Display array as comma-separated
                onChange={(e) => handleArrayChange(e, "position")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="" disabled>
                  Select Job
                </option>
                <option value="frontend">Frontend-Developer</option>
                <option value="backend">Backend-Developer</option>
                <option value="uxui">UX/UI</option>
              </select>
            </div>
            <div className="w-2/4">
              <Label
                htmlFor="type"
                className="block text-black text-sm mb-1"
              >
                Job Type
              </Label>
              <select
                id="type"
                value={formData.workMode}
                onChange={(e) => handleArrayChange(e, "workMode")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="" disabled>
                  Select Time
                </option>
                <option value="fulltime">Full-Time</option>
                <option value="parttime">Part-Time</option>
                <option value="freelance">Freelancer</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="flex gap-6 mb-5">
            <div className="w-2/4">
              <Label
                htmlFor="createDate"
                className="block text-black text-sm mb-1"
              >
                Posted Date
              </Label>
              <DateInput
                id="createdAt"
                value={formData.createdAt}
                onChange={handleChange}
                placeholder="YYYY-MM-DD"
              />
            </div>
            <div className="w-2/4">
              <Label
                htmlFor="deadline"
                className="block text-black text-sm mb-1"
              >
                Last Date To Apply
              </Label>
              <DateInput
                id="deadline"
                value={formData.deadline}
                onChange={handleChange}
                placeholder="YYYY-MM-DD"
              />
            </div>
          </div>

          {/* Salary */}
          <div className="flex gap-6 mb-5">
            <div className="w-2/4">
              <Label
                htmlFor="SalaryFrom"
                className="block text-black text-sm mb-1"
              >
                Salary From
              </Label>
              <Input
                id="min_salary"
                type="number"
                value={formData.min_salary === 0 ? "" : formData.min_salary}
                onChange={handleChange}
                placeholder="$"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="w-2/4">
              <Label
                htmlFor="SalaryTo"
                className="block text-black text-sm mb-1"
              >
                Salary To
              </Label>
              <Input
                id="max_salary"
                type="number"
                value={formData.max_salary === 0 ? "" : formData.max_salary}
                onChange={handleChange}
                placeholder="$"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <Label
              htmlFor="description"
              className="block text-black text-sm mb-1"
            >
              Description
            </Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Type your Description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-orange-400"
              rows={4}
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 focus:outline-none"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default InputForm;
