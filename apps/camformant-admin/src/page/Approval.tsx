import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import ApprovalTable from "../components/Tables/Approval-Table";
import DefaultLayout from "../Layout/DefaultLayout";

const Approval = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="User Approval" />

      <div className="flex flex-col gap-10">
        <ApprovalTable />
      </div>
    </DefaultLayout>
  );
};

export default Approval;
