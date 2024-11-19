import { Input } from "@/components/ui/input";
import React from "react";

const InputForm = () => {
  return (
    <div className="relative z-0 flex justify-center items-center h-screen bg-pink-200">
      {/* Background image */}
      <img
        src="https://images.unsplash.com/photo-1427694012323-fb5e8b0c165b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNpdHl8ZW58MHx8MHx8fDA%3D"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      />

      {/* Form container */}
      <div className="relative z-10 w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-center text-2xl font-semibold text-gray-800 mb-4">
          Input Fields
        </h2>
        <hr className="my-4" />

        <form>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="title"
            >
              Title
            </label>
            <input
              placeholder="title"
              id="title"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="position"
            >
              Position
            </label>
            <input
              id="position"
              type="text"
              placeholder="Input"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="salary"
            >
              Salary
            </label>
            <select
              id="salary"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            >
              <option>Input</option>
              <option>Option 1</option>
              <option>Option 2</option>
            </select>
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              placeholder="Type your Description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              rows={4}
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white font-bold py-2 rounded-md hover:bg-orange-600 focus:outline-none"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default InputForm;
