import DynamicBreadcrumb from "@/components/DynamicBreadcrumb";
import { columns } from "./columns";
import { DataTable } from "./data-table";

async function getData() {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_JOB_ENDPOINT}`,
            { method: "GET" }
        );

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || "Failed to fetch data");
        }

        const jobs = responseData.data.jobs;

        return jobs.map((job: { companyId: string }) => job.companyId);
    } catch (error) {
        console.error("Error fetching data:", error);
        throw new Error("Failed to fetch data");
    }
}
const Jobs = async () => {
    const data = await getData();
    return (
        <>
            <DynamicBreadcrumb />
            Jobs
            <div className="">
              <DataTable data={data} columns={columns} />
            </div>
        </>
    );
};

export default Jobs;
