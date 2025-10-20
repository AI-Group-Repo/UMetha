"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  Row,
  RowSelectionState,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";

interface Column {
  accessorKey?: string;
  id?: string;
  header: string;
  cell?: ({ row }: { row: any }) => React.ReactNode;
}

interface DataTableProps<TData> {
  columns: Column[];
  data: TData[];
  onRowSelection?: (selectedRows: string[]) => void;
}

export function DataTable<TData>({
  columns,
  data,
  onRowSelection,
}: DataTableProps<TData>) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  useEffect(() => {
    if (onRowSelection) {
      const selectedRows = table
        .getFilteredSelectedRowModel()
        .rows.map((row: Row<TData>) => (row.original as any).id);
      onRowSelection(selectedRows);
    }
  }, [rowSelection, onRowSelection, table]);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow key="header">
            {onRowSelection && (
              <TableHead className="w-12">
                <Checkbox
                  checked={table.getIsAllRowsSelected()}
                  indeterminate={table.getIsSomeRowsSelected()}
                  onCheckedChange={(value) =>
                    table.toggleAllRowsSelected(!!value)
                  }
                />
              </TableHead>
            )}
            {columns.map((column) => (
              <TableHead key={column.accessorKey || column.id}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {onRowSelection && (
                <TableCell className="w-12">
                  <Checkbox
                    checked={row.getIsSelected()}
                    indeterminate={row.getIsSomeSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                  />
                </TableCell>
              )}
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
