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
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { CSS } from "@dnd-kit/utilities"
import { z } from "zod"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const schema = z.object({
  count: z.number(),
  desc: z.string(),
  issue_type: z.string(),
  severity: z.string(),
  category: z.string(),
  snippets: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
})

const columns: ColumnDef<z.infer<typeof schema>>[] = [
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
    accessorKey: "desc",
    header: "Issue Description",
    cell: ({ row }) => (
      <div className="max-w-96 truncate">
        {row.original.desc}
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "count",
    header: "Count",
    cell: ({ row }) => (
      <div className="font-bold text-lg">
        {row.original.count}
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "issue_type",
    header: "Issue Type",
    cell: ({ row }) => (
      <div className="w-32">
        {row.original.issue_type}
      </div>
    ),
  },
  {
    accessorKey: "severity",
    header: "Severity",
    cell: ({ row }) => (
      <Badge className={`${
        row.original.severity === 'critical' ? 'bg-red-200 text-red-900' :
        row.original.severity === 'high' ? 'bg-orange-200 text-orange-900' :
        row.original.severity === 'medium' ? 'bg-yellow-200 text-yellow-900' :
        'bg-green-200 text-green-900'
      }`}>
        {row.original.severity}
      </Badge>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <div className="w-32">
        {row.original.category}
      </div>
    ),
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => (
  //     <div className="flex items-center justify-end gap-2">
  //       <Button variant="ghost" size="icon">
  //         <span className="sr-only">Actions</span>
  //         ⋮
  //       </Button>
  //     </div>
  //   ),
  // },
]

function DraggableRow({ row }: { row: any }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: row.index,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell: any) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

interface IssueTableProps {
  data?: z.infer<typeof schema>[]
  totalCount?: number
  pageSize?: number
  pageIndex?: number
  onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void
  isLoading?: boolean
}

export default function IssueTable({
  data: initialData = [],
  totalCount = 0,
  pageSize = 10,
  pageIndex = 0,
  onPaginationChange,
  isLoading = false
}: IssueTableProps) {
  const data = initialData || []
  
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex,
    pageSize,
  })

  // Update pagination when props change (avoid infinite loops)
  React.useEffect(() => {
    if (pageIndex !== pagination.pageIndex || pageSize !== pagination.pageSize) {
      setPagination({ pageIndex, pageSize })
    }
  }, [pageIndex, pageSize]) // Only depend on props, not state

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
  const dataIds = data.map((_, index) => index)
  const sortableId = React.useId()

  function handleDragEnd(event: DragEndEvent) {
    // Drag & drop disabled for server-side pagination
    console.log('Drag & drop disabled for server-side pagination')
  }

  return (
    <div className="w-full space-y-4">
      <div className="relative flex flex-col gap-4">
        <div className="overflow-hidden rounded-lg border ">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
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
                  // Skeleton loading rows
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
                    </TableRow>
                  ))
                ) : table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
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