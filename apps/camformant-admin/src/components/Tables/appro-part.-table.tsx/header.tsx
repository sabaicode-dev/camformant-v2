const TableHeader = () => {
  return (
    <div className="grid grid-cols-[1fr,1fr,2fr,1fr,1fr,1fr] rounded-sm bg-gray-2 dark:bg-meta-4">
      <div className="p-2.5 xl:p-5 flex items-center justify-center">
        <h5 className="text-sm font-medium uppercase text-center">Profile</h5>
      </div>
      <div className="p-2.5 xl:p-5 flex items-center justify-start">
        <h5 className="text-sm font-medium uppercase">Name</h5>
      </div>
      <div className="p-2.5 xl:p-5 flex items-center justify-center">
        <h5 className="text-sm font-medium uppercase text-center">Email</h5>
      </div>
      <div className="p-2.5 xl:p-5 flex items-center justify-center">
        <h5 className="text-sm font-medium uppercase text-center">
          Created At
        </h5>
      </div>
      <div className="p-2.5 xl:p-5 flex items-center justify-center sm:block">
        <h5 className="text-sm font-medium uppercase text-center">Employees</h5>
      </div>
      <div className="p-2.5 xl:p-5 flex items-center justify-center sm:block">
        <h5 className="text-sm font-medium uppercase text-center">Actions</h5>
      </div>
    </div>
  );
};

export default TableHeader;
