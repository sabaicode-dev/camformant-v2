/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreHorizontal, SquarePen, Trash } from "lucide-react";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import axiosInstance from "@/utils/axios";
import { useState } from "react";
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
    accessorKey: "title", // Maps to the 'title' field in the MongoDB document
    header: () => {
      return <div>Job</div>;
    },
    cell: ({ getValue }) => {
      const title = getValue<string>();
      return <div>{title || "No Title Available"}</div>;
    },
  },
  // {
  //   accessorKey: "Position",
  //   cell: ({ row }) => {
  //     const positions = row.original.position;
  //     console.log("Row data:", positions);
  //     return (
  //       <>
  //         <div>
  //           {positions && positions.length > 0
  //             ? positions.join(", ") // Join array elements with a comma
  //             : "No positions available"}{" "}
  //           {/* Fallback text if the array is empty */}
  //         </div>
  //       </>
  //     );
  //   },
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "type",
    cell: ({ row }) => {
      const types = row.original.type;
      console.log("type", types);
      return (
        <>
          {types && types.length > 0
            ? types.join(", ") // Join array elements with a comma
            : "No types available"}{" "}
          {/* Fallback text if the array is empty */}
        </>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return <div>Posted Date</div>;
    },
    cell: ({ getValue }) => {
      const createAt = getValue<string>();
      const formatDate = (isoDataString: string) => {
        const date = new Date(isoDataString);
        return date.toISOString().slice(0, 10);
      };
      return <div>{formatDate(createAt)}</div>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return <div>Update Date</div>;
    },
    cell: ({ getValue }) => {
      const updateAt = getValue<string>();
      const formatDate = (isoDataString: string) => {
        const date = new Date(isoDataString);
        return date.toISOString().slice(0, 10);
      };
      return <div>{formatDate(updateAt)}</div>;
    },
  },

  {
    accessorKey: "deadline",
    header: ({ column }) => {
      return <div>Close Date</div>;
    },
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
        try {
          const response = await axiosInstance.delete(
            `/v1/jobs/${jobFromCol._id}`
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
