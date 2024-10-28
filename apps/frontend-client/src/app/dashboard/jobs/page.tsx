import DynamicBreadcrumb from "@/components/DynamicBreadcrumb";
import { Payment, columns } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<Payment[]> {
    // Fetch data from your API here.
    return [
        {
            id: "728asdasded52f",
            amount: 100,
            status: "pending",
            email: "m@example.com",
        },
        {
            id: "728ed52f",
            amount: 200,
            status: "processing",
            email: " example.com",
        },
        {
            id: "728ed52f",
            amount: 300,
            status: "success",
            email: " example.com",
        },
        {
            id: "728ed52f",
            amount: 400,
            status: "failed",
            email: " example.com",
        },

        {
            id: "728ed52f",
            amount: 500,
            status: "pending",
            email: " example.com",
        },

        {
            id: "728ed52f",
            amount: 600,
            status: "processing",
            email: " example.com",
        },

        {
            id: "728ed52f",
            amount: 700,
            status: "success",
            email: " example.com",
        },

        {
            id: "728ed52f",
            amount: 800,
            status: "failed",
            email: " example.com",
        },
        {
            id: "728ed52f",
            amount: 800,
            status: "failed",
            email: " example.com",
        },
        {
            id: "728ed52f",
            amount: 800,
            status: "failed",
            email: " example.com",
        },
        {
            id: "728ed52f",
            amount: 800,
            status: "failed",
            email: " example.com",
        },
        {
            id: "728ed52f",
            amount: 800,
            status: "failed",
            email: " example.com",
        },
        {
            id: "728ed52f",
            amount: 800,
            status: "failed",
            email: " example.com",
        },
        {
            id: "728ed52f",
            amount: 800,
            status: "failed",
            email: " example.com",
        },
        {
            id: "728ed52f",
            amount: 800,
            status: "failed",
            email: " example.com",
        },
        {
            id: "728ed52f",
            amount: 800,
            status: "failed",
            email: " example.com",
        },
        {
            id: "728ed52f",
            amount: 800,
            status: "failed",
            email: " example.com",
        },
        {
            id: "728ed52f",
            amount: 800,
            status: "failed",
            email: " example.com",
        },
        {
            id: "728ed52f",
            amount: 800,
            status: "failed",
            email: " example.com",
        },
        {
            id: "728ed52f",
            amount: 800,
            status: "failed",
            email: " example.com",
        },
    ];
}

const Jobs = async () => {
    const data = await getData();
    return (
        <>
            <DynamicBreadcrumb />
            Jobs
            <DataTable data={data} columns={columns} />
        </>
    );
};

export default Jobs;
