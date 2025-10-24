"use client"

import * as React from "react"
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
} from "@tanstack/react-table"
import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type ActionRow = {
  descr: string
  number_of_actions: number
  first_date_recommended: string
  latest_date_recommended: string
  action_type: string
  estimated_effort: string
  suggested_timeline: string
  category: string
}

const columns: ColumnDef<ActionRow>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "index",
    header: "#",
    cell: ({ row, table }) => (
      <div className="font-medium text-muted-foreground">
        {(table.getState().pagination.pageIndex * table.getState().pagination.pageSize) + row.index + 1}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "descr",
    header: "Action",
    cell: ({ row }) => (
      <div className="max-w-96 truncate">
        {row.original.descr}
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "number_of_actions",
    header: "Count",
    cell: ({ row }) => (
      <div className="font-bold text-lg">
        {row.original.number_of_actions}
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "action_type",
    header: "Type",
    cell: ({ row }) => (
      <div className="w-32">
        {row.original.action_type}
      </div>
    ),
  },
  {
    accessorKey: "estimated_effort",
    header: "Effort",
    cell: ({ row }) => (
      <Badge className="bg-gray-100 text-gray-700">
        {row.original.estimated_effort}
      </Badge>
    ),
  },
  {
    accessorKey: "suggested_timeline",
    header: "Timeline",
    cell: ({ row }) => (
      <div className="w-32">
        {row.original.suggested_timeline}
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.original.category}
      </Badge>
    ),
  },
  {
    accessorKey: "first_date_recommended",
    header: "First Seen",
    cell: ({ row }) => (
      <div className="w-28">
        {new Date(row.original.first_date_recommended).toISOString().slice(0,10)}
      </div>
    ),
  },
  {
    accessorKey: "latest_date_recommended",
    header: "Latest Seen",
    cell: ({ row }) => (
      <div className="w-28">
        {new Date(row.original.latest_date_recommended).toISOString().slice(0,10)}
      </div>
    ),
  },
]

interface ActionsTableProps {
  data?: ActionRow[]
  totalCount?: number
  pageSize?: number
  pageIndex?: number
  onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void
  isLoading?: boolean
}

export default function ActionsTable({
  data: initialData = [],
  totalCount = 0,
  pageSize = 10,
  pageIndex = 0,
  onPaginationChange,
  isLoading = false
}: ActionsTableProps) {
  const data = initialData || []

  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex,
    pageSize,
  })

  React.useEffect(() => {
    if (pageIndex !== pagination.pageIndex || pageSize !== pagination.pageSize) {
      setPagination({ pageIndex, pageSize })
    }
  }, [pageIndex, pageSize])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === 'function' ? updater(pagination) : updater
      setPagination(newPagination)
      onPaginationChange?.(newPagination)
    },
    pageCount: Math.ceil(totalCount / pageSize),
    manualPagination: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    getRowId: (row, index) => index.toString(),
  })

  const sensors = useSensors(useSensor(PointerSensor))

  return (
    <div className="w-full space-y-4">
      <div className="relative flex flex-col gap-4">
        <div className="overflow-hidden rounded-lg border ">
          <DndContext
            modifiers={[restrictToVerticalAxis]}
            sensors={sensors}
          >
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: pageSize }).map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      <TableCell className="text-center">
                        <div className="h-4 w-4 bg-muted rounded animate-pulse mx-auto"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-8 bg-muted rounded animate-pulse"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-64 bg-muted rounded animate-pulse"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-12 bg-muted rounded animate-pulse"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-6 w-16 bg-muted rounded animate-pulse"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-6 w-20 bg-muted rounded animate-pulse"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-4 w-16 bg-muted rounded animate-pulse"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-8 w-8 bg-muted rounded animate-pulse"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-8 w-8 bg-muted rounded animate-pulse"></div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {isLoading ? (
              <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
            ) : (
              `${table.getFilteredSelectedRowModel().rows.length} of ${table.getFilteredRowModel().rows.length} row(s) selected.`
            )}
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              {isLoading ? (
                <div className="h-8 w-20 bg-muted rounded animate-pulse"></div>
              ) : (
                <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={(value) => {
                    onPaginationChange?.({ pageIndex: 0, pageSize: Number(value) })
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={table.getState().pagination.pageSize} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="flex items-center gap-6 lg:gap-8">
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                {isLoading ? (
                  <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                ) : (
                  `Page ${pageIndex + 1} of ${Math.ceil(totalCount / pageSize)}`
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="hidden size-8 lg:flex"
                  size="icon"
                  onClick={() => onPaginationChange?.({ pageIndex: 0, pageSize })}
                  disabled={isLoading || pageIndex === 0}
                >
                  <span className="sr-only">Go to first page</span>
                  ⟪
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  onClick={() => onPaginationChange?.({ pageIndex: pageIndex - 1, pageSize })}
                  disabled={isLoading || pageIndex === 0}
                >
                  <span className="sr-only">Go to previous page</span>
                  ⟨
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  onClick={() => onPaginationChange?.({ pageIndex: pageIndex + 1, pageSize })}
                  disabled={isLoading || pageIndex >= Math.ceil(totalCount / pageSize) - 1}
                >
                  <span className="sr-only">Go to next page</span>
                  ⟩
                </Button>
                <Button
                  variant="outline"
                  className="hidden size-8 lg:flex"
                  size="icon"
                  onClick={() => onPaginationChange?.({ pageIndex: Math.ceil(totalCount / pageSize) - 1, pageSize })}
                  disabled={isLoading || pageIndex >= Math.ceil(totalCount / pageSize) - 1}
                >
                  <span className="sr-only">Go to last page</span>
                  ⟫
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


