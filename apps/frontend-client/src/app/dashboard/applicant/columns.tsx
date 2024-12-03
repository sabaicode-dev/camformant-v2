"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
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
import { Avatar } from "@/components/ui/avatar";


export interface UserInfo {
  profile: string; // URL to profile picture
  name: string;    // Applicant's name
  status: string;  // Application status (e.g., 'Apply')
  cv: string;      // URL to the applicant's CV
}

export interface JobApplication {
  _id: string;         // Job application ID
  userId: string;      // User ID who applied
  jobId: string;       // Job ID being applied for
  userInfo: UserInfo;  // Information about the applicant
  appliedAt: string;   // Timestamp of application submission (ISO 8601)
  updatedAt: string;   // Timestamp of last update to the application (ISO 8601)
}

export const columns: ColumnDef<JobApplication>[] = [
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
        className="border-white"
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
    accessorKey: "profile",
    cell: ({ row }) => {
      const profileImage = row.getValue("profile") as string;
      return(
        <img
        src={profileImage}
        alt="Profile"
        className="w-10 h-10 rounded-full object-cover"
      />
      )
    }
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <div className="">Name</div>;
    },
  },
  {
    accessorKey: "jobId",
    header: ({ column }) => {
      return <div className="">job</div>;
    },
  },
  {
    accessorKey: "mobile",
    header: ({ column }) => {
      return <div className="">mobile</div>;
    },
  },
  {
    accessorKey: "appliedAt",
    header: ({ column }) => {
      return <div className=" ">email</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment._id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
