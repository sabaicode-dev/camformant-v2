import { DateInput } from "@/components/ui/dateInput";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/selete";
import React from "react";
import { Label } from "@/components/ui/label";

const InputForm = () => {
  return (
    <div className=" h-[1000px] flex bg-no-repeat bg-cover justify-center items-center  bg-[url('https://images.unsplash.com/photo-1427694012323-fb5e8b0c165b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNpdHl8ZW58MHx8MHx8fDA%3D')] ">
      {/* Form container */}
      <div className=" w-5/6 h-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-center text-2xl  text-gray-800 mb-4">
          Input Fields
        </h2>
        <hr className="my-4" />
        <form>
          <div className=" flex gap-6 mb-5">
            <div className="w-2/4">
              <Label htmlFor="name" className="block text-black text-sm  mb-1">
                Name
              </Label>
              <Input
                placeholder="title"
                id="title"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              />
            </div>
            <div className="w-2/4">
              <Label className="block text-black text-sm  mb-1" htmlFor="title">
                Title
              </Label>
              <Input
                placeholder="title"
                id="title"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-6 mb-5">
            <div className="w-2/4">
              <Label
                className="block text-black text-sm  mb-1"
                htmlFor="position"
              >
                Job Cagtegory
              </Label>
              <Select className="w-full px-3 py-2 border border-gray-300 rounded-md ">
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </Select>
            </div>
            <div className="w-2/4">
              <Label
                className="block text-black text-sm  mb-1"
                htmlFor="position"
              >
                Job Type
              </Label>
              <Select className="w-full px-3 py-2 border border-gray-300 rounded-md ">
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </Select>
            </div>
          </div>

          <div className=" flex gap-6 mb-5">
            <div className="w-2/4">
              <Label className="block text-black text-sm  mb-1" htmlFor="date">
                Posted Date
              </Label>
              <DateInput id="date" placeholder="YYYY-MM-DD" />
            </div>
            <div className="w-2/4">
              <Label className="block text-black text-sm  mb-1" htmlFor="date">
                Last Date To Apply
              </Label>
              <DateInput id="date" placeholder="YYYY-MM-DD" />
            </div>
          </div>

          <div className=" flex gap-6 mb-5">
            <div className="w-2/4">
              <label className="block text-black text-sm  mb-1" htmlFor="date">
                Close Date
              </label>
              <DateInput id="date" placeholder="YYYY-MM-DD" />
            </div>
            <div className="w-2/4">
              <label
                className="block text-black text-sm  mb-1"
                htmlFor="gender"
              >
                Select Gender:
              </label>
              <Select className="w-full px-3 py-2 border border-gray-300 rounded-md ">
                <option value="option1">Choose</option>
                <option value="option2">Female</option>
                <option value="option3">Male</option>
              </Select>
            </div>
          </div>

          <div className="flex gap-6 mb-5">
            <div className="w-2/4">
              <Label
                className="block text-black text-sm  mb-1"
                htmlFor="salary"
              >
                Salary
              </Label>
              <Input
                id="salary"
                type="text"
                placeholder="$"
                className="w-full px-3 py-2 border border-gray-300 rounded-md "
              />
            </div>
            <div className="w-2/4">
              <Label
                className="block text-black text-sm  mb-1"
                htmlFor="salary"
              >
                Salary
              </Label>
              <Input
                id="salary"
                type="text"
                placeholder="$"
                className="w-full px-3 py-2 border border-gray-300 rounded-md "
              />
            </div>
          </div>

          <div className="flex gap-6 mb-5">
            <div className="w-2/4">
              <Label
                className="block text-black text-sm  mb-1"
                htmlFor="salary"
              >
                Enter Counter
              </Label>
              <Input
                id="salary"
                type="text"
                placeholder="State"
                className="w-full px-3 py-2 border border-gray-300 rounded-md "
              />
            </div>
            <div className="w-2/4">
              <Label
                className="block text-black text-sm  mb-1"
                htmlFor="salary"
              >
                Enter State
              </Label>
              <Input
                id="salary"
                type="text"
                placeholder="State"
                className="w-full px-3 py-2 border border-gray-300 rounded-md "
              />
            </div>
          </div>

          <div className="mb-6">
            <Label
              className="block text-black text-sm  mb-1"
              htmlFor="description"
            >
              Description
            </Label>
            <textarea
              id="description"
              placeholder="Type your Description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-orange-400"
              rows={4}
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white  py-2 rounded-md hover:bg-orange-600 focus:outline-none"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default InputForm;
