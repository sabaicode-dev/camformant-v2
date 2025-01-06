"use client";

import { Listbox, Transition } from "@headlessui/react";
import React, { Dispatch, Fragment, SetStateAction } from "react";
import { AiFillCaretDown } from "react-icons/ai";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { FilterValueParams } from "@/components/in-search/search-home-page";

const WORK_SCHEDULE = [
  { id: 1, name: "Full-Time" },
  { id: 2, name: "Part-Time" },
  { id: 3, name: "Flexible-Hours" },
  { id: 4, name: "Project-Based" },
];

const EMPLOYMENT_TYPE = [
  { id: 1, name: "Internship" },
  { id: 2, name: "Contract" },
];

const WORK_LOCATION = [
  { id: 1, name: "On-Site" },
  { id: 2, name: "Remote" },
];

const experience = [
  { text: "No" },
  { text: "Less Than 1 year" },
  { text: "1-3 year" },
  { text: "3-5 year" },
  { text: "5 year up" },
];

interface FilterProps {
  setIsopen: (value: boolean) => void;
  filterValues: FilterValueParams;
  setFilterValues: Dispatch<SetStateAction<FilterValueParams>>;
  handleCompleteFilter: () => void;
}

interface SelectProps {
  label: string;
  values: { id: number; name: string }[];
  selected: any;
  setSelected: (value: any) => void;
}

interface ExperienceProps {
  text: string;
  isSelected: boolean;
  onClick: (text: string) => void;
}

const Experience: React.FC<ExperienceProps> = ({
  text,
  isSelected,
  onClick,
}) => {
  return (
    <div
      className={`bg-gray-200 rounded-full px-4 py-2 w-full cursor-pointer ${
        isSelected ? "bg-primaryCam text-white" : "bg-gray-200 text-black"
      }`}
      onClick={() => onClick(text)}
    >
      {text}
    </div>
  );
};

const Select: React.FC<SelectProps> = ({
  label,
  values,
  selected,
  setSelected,
}) => {
  const handleSelection = (value: string) => {
    setSelected(value);
  };

  return (
    <div className="mt-6 ">
      <span className="text-sm font-semibold">{label}</span>
      <Listbox value={selected} onChange={handleSelection}>
        <div className="relative mt-5">
          <Listbox.Button className="flex items-center justify-between w-full px-4 py-2 space-x-3 text-gray-500 border border-gray-300 rounded-lg">
            <span className="block truncate">{selected.name}</span>
            <AiFillCaretDown
              className="w-4 h-4 text-gray-500"
              aria-hidden="true"
            />
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-50 w-full mt-1 overflow-auto bg-white rounded-lg shadow-lg">
              {values.map((item, itemIdx) => (
                <Listbox.Option
                  key={itemIdx}
                  className={({ active }) =>
                    ` py-2 px-2 ${
                      active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                    }`
                  }
                  value={item}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {item.name}
                      </span>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export const Filter: React.FC<FilterProps> = ({
  setIsopen,
  filterValues,
  setFilterValues,
  handleCompleteFilter,
}) => {
  const handleScheduleChange = (newSchedule: any) => {
    setFilterValues((prevValues) => ({
      ...prevValues,
      schedule: newSchedule.name,
    }));
  };

  const handleTypeChange = (newType: any) => {
    setFilterValues((prevValues) => ({
      ...prevValues,
      type: newType.name,
    }));
  };

  const handleWorkModeChange = (newWorkMode: any) => {
    setFilterValues((prevValues) => ({
      ...prevValues,
      workMode: newWorkMode.name,
    }));
  };

  const handleExperienceChange = (newExperience: string) => {
    setFilterValues((prevValues) => ({
      ...prevValues,
      required_experience: newExperience,
    }));
  };

  const handleSalaryChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      const [minSalary, maxSalary] = value;
      setFilterValues((prevValues) => ({
        ...prevValues,
        minSalary,
        maxSalary,
      }));
    }
  };

  return (
    <div className="flex flex-col justify-between w-full h-full ">
      <div className="container flex flex-col justify-center w-full overflow-y-scroll pt-7 h-3/4 ">
        <div className="mt-24" />
        <Select
          values={WORK_SCHEDULE}
          label="Work Schedule"
          selected={
            WORK_SCHEDULE.find(
              (item) => item.name === filterValues.schedule
            ) || { name: "default" }
          }
          setSelected={handleScheduleChange}
        />
        <Select
          values={EMPLOYMENT_TYPE}
          label="Employment Type"
          selected={
            EMPLOYMENT_TYPE.find((item) => item.name === filterValues.type) || {
              name: "default",
            }
          }
          setSelected={handleTypeChange}
        />
        <Select
          values={WORK_LOCATION}
          label="Work Location"
          selected={
            WORK_LOCATION.find(
              (item) => item.name === filterValues.workMode
            ) || { name: "default" }
          }
          setSelected={handleWorkModeChange}
        />

        <div className="mt-7">
          <label className="text-sm font-semibold">Experience</label>
          <div className="flex flex-wrap gap-4 mt-4">
            {experience.map((x) => {
              const isSelected: boolean =
                filterValues.required_experience === x.text;
              return (
                <div key={x.text}>
                  <Experience
                    text={x.text}
                    isSelected={isSelected}
                    onClick={handleExperienceChange}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="my-7">
          <label className="text-sm font-semibold"> Salary</label>
          <div className="pt-5">
            <div className="w-full pb-2">
              {filterValues.minSalary}$ - {filterValues.maxSalary}$
            </div>

            <div className="w-full">
              <Slider
                range
                min={0}
                max={5000}
                defaultValue={[filterValues.minSalary, filterValues.maxSalary]}
                value={[filterValues.minSalary, filterValues.maxSalary]}
                onChange={handleSalaryChange}
                styles={{
                  track: { backgroundColor: "#FF7300", height: "8px" },
                  rail: { height: "8px" },
                  handle: {
                    borderWidth: "2px",
                    borderColor: "#FF7300",
                    height: "16px",
                    width: "16px",
                    backgroundColor: "white",
                  },
                }}
                step={20}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-4 border-t-2 border-gray-300 ">
        <button
          onClick={handleCompleteFilter}
          className="w-full p-5 text-white bg-primaryCam rounded-2xl"
        >
          Done
        </button>
      </div>
    </div>
  );
};
