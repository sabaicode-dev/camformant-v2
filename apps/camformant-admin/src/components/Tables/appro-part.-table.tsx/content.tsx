import React, { useState } from "react";
import { FaCheck, FaRegEye, FaRegTrashAlt } from "react-icons/fa";
import { convertDate } from "../../../utils/functions/approval-func";
import { CorporatorParams } from "../../../utils/types/corporator";
import PopUpModal from "../../popup-modal";


const TableContent: React.FC<{
  data: CorporatorParams[];
  deleteUser: (sub: string) => Promise<void>;
  verifyUser: (email: string, sub: string, id: string) => Promise<void>;
}> = ({ data, deleteUser, verifyUser }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<() => Promise<void>>(() => Promise.resolve);
  const [modalBodyText, setModalBodyText] = useState("");
  const [isWarningModal, setWarningModal] = useState(false);

  const handleDeleteClick = (corData: CorporatorParams) => {
    setModalAction(() => () => deleteUser(corData.sub!));
    setModalBodyText(`Are you sure you want to delete ${corData.name}? This action cannot be undone.`);
    setWarningModal(true); // Set as a warning modal
    setModalOpen(true);
  };

  const handleVerifyClick = (corData: CorporatorParams) => {
    setModalAction(() => () =>
      verifyUser(corData.email!, corData.sub!, corData._id!)
    );
    setModalBodyText(`Are you sure you want to verify ${corData.name}?`);
    setWarningModal(false); // Informational modal
    setModalOpen(true);
  };

  const totalRows = 5; // Fixed number of rows to display
  const emptyRows = totalRows - data.length; // Calculate empty rows to pad

  return (
    <div>
      {data.map((corData: CorporatorParams, key: number) => (
        <div
          className="grid grid-cols-[1fr,1fr,2fr,1fr,1fr,1fr] border-b border-stroke dark:border-strokedark"
          key={key}
        >
          {/* Profile Column */}
          <div className="flex items-center justify-center p-2.5 xl:p-5">
            <div className="h-12 w-12 rounded-full overflow-hidden">
              <img
                src={corData.profile}
                alt={`${corData.name} Logo`}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
          {/* Name Column */}
          <div className="flex items-center justify-start p-2.5 xl:p-5">
            <p className="text-black dark:text-white truncate whitespace-nowrap overflow-hidden w-[120px]">
              {corData.name}
            </p>
          </div>
          {/* Email Column */}
          <div className="flex items-center justify-center p-2.5 xl:p-5">
            <p className="text-black dark:text-white truncate whitespace-nowrap overflow-hidden text-center w-[180px]">
              {corData.email}
            </p>
          </div>
          {/* Created At Column */}
          <div className="flex items-center justify-center p-2.5 xl:p-5">
            <p className="text-black dark:text-white truncate whitespace-nowrap text-center">
              {convertDate(corData.createdAt!)}
            </p>
          </div>
          {/* Employees Column */}
          <div className="hidden sm:flex items-center justify-center p-2.5 xl:p-5">
            <p className="text-black dark:text-white">
              {corData.employee_count}
            </p>
          </div>
          {/* Actions Column */}
          <div className="hidden sm:flex items-center justify-center p-2.5 xl:p-5">
            <div className="flex items-center space-x-3.5">
              <button className="hover:text-primary">
                <FaRegEye />
              </button>
              <button
                className="hover:text-red-700 text-red-500"
                onClick={() => handleDeleteClick(corData)}
              >
                <FaRegTrashAlt />
              </button>
              <button
                className="hover:text-green-700 text-green-500"
                onClick={() => handleVerifyClick(corData)}
              >
                <FaCheck />
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Add empty rows to maintain table height */}
      {Array.from({ length: emptyRows }).map((_, index) => (
        <div
          className="grid h-[89px] grid-cols-[1fr,1fr,2fr,1fr,1fr,1fr] border-b border-stroke dark:border-strokedark"
          key={`empty-${index}`}
        ></div>
      ))}

      {/* PopUpModal */}
      {isModalOpen && (
        <PopUpModal
          closeModal={() => setModalOpen(false)}
          actionFunc={modalAction}
          bodyText={modalBodyText}
          isWarningModal={isWarningModal}
        />
      )}
    </div>
  );
};

export default TableContent;
