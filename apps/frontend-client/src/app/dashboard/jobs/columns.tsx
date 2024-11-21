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

export type Jobs = {
  _id?: string;
  company_id?: string;
  title?: string;
  position?: string[];
  workMode?: string[];
  requirement?: string;
  location?: string;
  job_opening?: number;
  max_salary?: number;
  min_salary?: number;
  description?: string;
  address?: string;
  type?: string[];
  schedule?: string[];
  required_experience?: string[];
  benefit?: string[];
  deadline?: string;
  createdAt?: string;
  updatedAt?: string;
};

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
    accessorKey: "position",
    cell: ({ column }) => {
      return <div className="">heloo</div>;
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "Type",
    cell: ({ column }) => {
      return <div className=""></div>;

    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "Posted Date",
    header: ({ column }) => {
      return <div>Posted Date</div>;
    },
  },
  {
    accessorKey: "Last Date to Apply",
    header: ({ column }) => {
      return <div>Last Date to Apply</div>;
    },
  },
  {
    accessorKey: "Close Date",
    header: ({ column }) => {
      return <div>Close Date</div>;
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
      const payment = row.original;

      return (
        <>
          <div className="flex gap-2 ">
            <Eye className=" h-[35px] w-[35px] p-2 bg-green-100 text-green-500 rounded-full " />
            <SquarePen className=" h-[35px] w-[35px] p-2 bg-green-100 text-green-900 rounded-full" />
            <Trash className=" h-[35px] w-[35px] p-2 bg-red-100 text-red-500 rounded-full "  />
          </div>
        </>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];