/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, SquarePen, Trash } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import axiosInstance from "@/utils/axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Jobs } from "@/utils/types/form-type";

export const columns: ColumnDef<Jobs>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: any) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Job Title",
    cell: ({ row }) => {
      return <div>{row.original.title || "No Title Available"}</div>;
    },
  },
  {
    accessorKey: "position",
    header: "position",
    cell: ({ row }) => {
      const positions = row.original.position;
      return (
        <>
          {positions && positions.length > 0 ? positions.join(", ") : "No types available"}{" "}
        </>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "createdAt",
    header: "Posted Date",
    cell: ({ row }) => {
      return (
        <div>
          {row.original.createdAt
            ? new Date(row.original.createdAt).toLocaleDateString()
            : "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return <div>Job Type</div>;
    },
    cell: ({ getValue }) => {
      const jobTypes = getValue<string[]>();
  
      return (
        <div>
          {jobTypes?.map((type, index) => (
            <div key={index}>{type}</div>
          ))}
        </div>
      );
    },
  }
,  

  {
    accessorKey: "deadline",
    header: "Deadline",
    cell: ({ getValue }) => {
      const deadlineAt = getValue<string>();
      const formatDate = (isoDataString: string) => {
        const date = new Date(isoDataString);
        return date.toISOString().slice(0, 10);
      };
      return <div>{formatDate(deadlineAt)}</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <div>status</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const jobFromCol = row.original;

      interface Job {
        _id: string;
        title: string;
      }

      const [jobs, setJobs] = useState<Job[]>([]); // Define state for jobs

      const handleDelete = async () => {
        if (!jobFromCol._id) {
          alert("Invalid job ID.");
          return;
        }
        const isConfirmed = window.confirm(
          "Are you sure you want to delete this job?"
        );
        if (!isConfirmed) return;
        try {
          const response = await axiosInstance.delete(
            `http://localhost:4000/v1/jobs/${jobFromCol._id}`
          );
          console.log("Delete Response:", response.data);
          // Assuming setJobs is a state updater for the list of jobs
          setJobs((prevJobs) =>
            prevJobs.filter((job) => job._id !== jobFromCol._id)
          );
          alert("Job deleted successfully!");
        } catch (error) {
          console.error("Error deleting job:", error);
          alert("Failed to delete the job. Please try again.");
        }
      };
      const router = useRouter();
      return (
        <>
          <div className="flex gap-2 ">
            <Eye className=" h-[35px] w-[35px] p-2 bg-green-100 hover:bg-green-200 text-green-500 rounded-full " />
            <SquarePen
              className=" h-[35px] w-[35px] p-2 bg-green-100 hover:bg-green-200 text-green-900 rounded-full"
              onClick={() => {
                router.push(`/dashboard/update/${jobFromCol._id}`);
              }}
            />
            <Trash
              onClick={handleDelete}
              className=" h-[35px] w-[35px] p-2 bg-red-100 hover:bg-green-200 text-red-500 rounded-full "
            />
          </div>
        </>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
