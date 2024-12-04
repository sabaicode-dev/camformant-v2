import React, { SetStateAction, useState } from "react";

const PopUpModal: React.FC<{
  closeModal: () => void;
  actionFunc?: () => void;
  bodyText: string;
  isInfoModal: boolean;
  date?: string;
  location?: string;
}> = ({ closeModal, actionFunc, bodyText, isInfoModal, date, location }) => {
  // Handle confirming the delete action
  const handleConfirmDelete = () => {
    actionFunc && actionFunc();
    closeModal();
  };

  return (
    <div>
      <div
        id="popup-modal"
        tabIndex={-1}
        className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-gray-500 bg-opacity-50"
      >
        <div className="relative w-full max-w-md max-h-full p-4">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <button
              type="button"
              onClick={closeModal}
              className="absolute inline-flex items-center justify-center w-8 h-8 text-sm text-gray-400 bg-transparent rounded-lg top-3 right-3 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <div className="p-4 text-center md:p-5">
              {!isInfoModal && (
                <svg
                  className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-200"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              )}
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                {bodyText}
              </h3>
              {location && <h2>Location: {location}</h2>}
              {date && <h2>Date: {date != "Invalid Date" ? date : "Null"}</h2>}
              {!isInfoModal && (
                <button
                  onClick={handleConfirmDelete}
                  className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                >
                  {"Yes, I'm sure"}
                </button>
              )}
              {!isInfoModal && (
                <button
                  onClick={closeModal}
                  className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  No, cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopUpModal;
