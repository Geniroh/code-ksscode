"use client";

import { useFetchData } from "@/hooks/use-query";
import React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Check, X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import MarkdownTruncate from "@/components/MarkdownTruncate";
import TagCard from "@/components/card/TagCard";
import Link from "next/link";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";

interface Suggestion {
  id: string;
  title: string;
  description: string;
  suggestedUsers: string[];
  tags: string[];
  taken: boolean;
}

const SuggestionPage = () => {
  const {
    data: suggestions,
    isLoading,
    refetch,
  } = useFetchData("/suggestion", "get-suggestions");

  const handleSuggestionDelete = async (id: string) => {
    try {
      const { data } = await axiosInstance.delete(`/suggestion/${id}`);

      if (data) {
        refetch();
        toast.success("Deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting suggestion:", error);
    }
  };

  const columns: ColumnDef<Suggestion>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <MarkdownTruncate
          data={row.getValue("description") || ""}
          max={15}
          className="text-sm"
        />
      ),
    },
    {
      accessorKey: "tags",
      header: "Tags",
      cell: ({ row }) => {
        const tags = row.getValue("tags") as string[];
        return (
          <div className="flex flex-wrap gap-1 max-w-[200px]">
            {tags.map((tag, index) => (
              <TagCard
                key={index}
                _id={index.toString()}
                name={tag}
                compact
                isButton
              />
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "taken",
      header: "Status",
      cell: ({ row }) => {
        const taken = row.getValue("taken") as boolean;
        return (
          <div className="flex items-center">
            {taken ? (
              <div className="flex items-center gap-1 text-white bg-red-400 px-2 py-1 text-xs rounded-sm">
                <X className="h-3 w-3" /> Taken
              </div>
            ) : (
              <div className="flex items-center gap-1 text-white bg-green-400 px-2 py-1 rounded-sm text-xs">
                <Check className="h-3 w-3" /> Available
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const suggestion = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {/* <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(suggestion.id)}
              >
                Copy suggestion ID
              </DropdownMenuItem> */}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href={`/dashboard/suggestion/${suggestion?.id}`}>
                  View
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="bg-red-600 text-white mt-1 cursor-pointer"
                onClick={() => handleSuggestionDelete(suggestion?.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: suggestions ?? [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (isLoading) {
    return (
      <div className="flex gap-2 items-center justify-center leading-6 py-2 text-sm mt-4 min-h-[100px]">
        <RefreshCw size={12} className="text-heading animate-spin" /> Loading
        suggestions...
      </div>
    );
  }

  return (
    <div className="w-full p-4 mt-4">
      <h1 className="text-xl font-bold text-heading2 border-b pb-2">
        Suggested Topics
      </h1>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups()?.map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers?.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows?.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells()?.map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No suggestions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuggestionPage;
