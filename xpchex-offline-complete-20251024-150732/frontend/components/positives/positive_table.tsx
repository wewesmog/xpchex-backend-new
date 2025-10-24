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
import { ArrowUpDown, ChevronDown, MoreHorizontal, ChevronRight } from "lucide-react"
import { z } from "zod"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
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
  total_reviews: z.number(),
  desc: z.string(),
  category: z.string(),
  impact_level: z.string(),
  impact_area: z.string(),
  quote: z.string().optional(),
  keywords: z.string().optional(),
})

// Expandable description component
const ExpandableDescription = ({ 
  description, 
  rowId, 
  isExpanded, 
  onToggle 
}: { 
  description: string
  rowId: string
  isExpanded: boolean
  onToggle: () => void
}) => {
  return (
    <div 
      className="max-w-[300px] cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-1 rounded transition-colors"
      onClick={onToggle}
    >
      <div
        className={`font-medium transition-all duration-200 ${
          isExpanded 
            ? 'whitespace-normal' 
            : 'overflow-hidden whitespace-nowrap text-ellipsis'
        }`}
      >
        {description}
      </div>
    </div>
  )
}

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
    cell: ({ row }) => <div className="font-medium">{row.index + 1}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "desc",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Description
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row, table }) => {
      const rowId = row.id
      const isExpanded = (table.options.meta as any)?.expandedRows?.has(rowId) || false
      const onToggle = () => {
        const meta = table.options.meta as any
        if (meta?.setExpandedRows) {
          const newExpanded = new Set(meta.expandedRows || new Set())
          if (newExpanded.has(rowId)) {
            newExpanded.delete(rowId)
          } else {
            newExpanded.add(rowId)
          }
          meta.setExpandedRows(newExpanded)
        }
      }
      
      return (
        <ExpandableDescription 
          description={row.getValue("desc")} 
          rowId={rowId}
          isExpanded={isExpanded}
          onToggle={onToggle}
        />
      )
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <div className="flex items-center">
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700/50">
          {row.getValue("category")}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "impact_level",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Impact Level
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const impactLevel = row.getValue("impact_level") as string
      const getImpactColor = (level: string) => {
        switch (level?.toLowerCase()) {
          case 'high':
            return 'bg-green-200 text-green-900 dark:bg-green-900/30 dark:text-green-300'
          case 'medium':
            return 'bg-yellow-200 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-300'
          case 'low':
            return 'bg-blue-200 text-blue-900 dark:bg-blue-900/30 dark:text-blue-300'
          default:
            return 'bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-300'
        }
      }
      return (
        <div className="flex items-center">
          <Badge className={getImpactColor(impactLevel)}>
            {impactLevel}
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: "impact_area",
    header: "Impact Area",
    cell: ({ row }) => (
      <div className="max-w-[150px] truncate flex items-center">
        {row.getValue("impact_area")}
      </div>
    ),
  },
  {
    accessorKey: "total_reviews",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="w-full justify-center"
      >
        Reviews
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const count = row.getValue("total_reviews") as number
      return (
        <div className="font-medium flex items-center justify-center">
          {count}
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const positive = row.original

      return (
        <div className="flex items-center justify-center">
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
                onClick={() => navigator.clipboard.writeText(positive.desc)}
              >
                Copy description
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>Export data</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]

interface PositiveTableProps {
  data: z.infer<typeof schema>[]
  totalCount: number
  pageSize: number
  pageIndex: number
  onPaginationChange: (pagination: { pageIndex: number; pageSize: number }) => void
  isLoading?: boolean
}

export default function PositiveTable({
  data,
  totalCount,
  pageSize,
  pageIndex,
  onPaginationChange,
  isLoading = false,
}: PositiveTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [expandedRows, setExpandedRows] = React.useState<Set<string>>(new Set())

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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    pageCount: Math.ceil(totalCount / pageSize),
    manualPagination: true,
    meta: {
      expandedRows,
      setExpandedRows,
    },
  })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      // Handle reordering logic here if needed
    }
  }

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="rounded-md border bg-white dark:bg-card">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading positive feedback...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter descriptions..."
          value={(table.getColumn("desc")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("desc")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border bg-white dark:bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const isExpanded = expandedRows.has(row.id)
                const handleRowClick = (e: React.MouseEvent) => {
                  // Don't trigger if clicking on checkboxes or action buttons
                  if ((e.target as HTMLElement).closest('input[type="checkbox"]') || 
                      (e.target as HTMLElement).closest('button')) {
                    return
                  }
                  
                  const newExpanded = new Set(expandedRows)
                  if (newExpanded.has(row.id)) {
                    newExpanded.delete(row.id)
                  } else {
                    newExpanded.add(row.id)
                  }
                  setExpandedRows(newExpanded)
                }

                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={handleRowClick}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No positive feedback found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground dark:text-gray-400">
          Showing {pageIndex * pageSize + 1} to{" "}
          {Math.min((pageIndex + 1) * pageSize, totalCount)} of {totalCount} positive feedback entries
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPaginationChange({ pageIndex: 0, pageSize })}
            disabled={pageIndex === 0}
          >
            First
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPaginationChange({ pageIndex: pageIndex - 1, pageSize })}
            disabled={pageIndex === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPaginationChange({ pageIndex: pageIndex + 1, pageSize })}
            disabled={(pageIndex + 1) * pageSize >= totalCount}
          >
            Next
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPaginationChange({ pageIndex: Math.ceil(totalCount / pageSize) - 1, pageSize })}
            disabled={(pageIndex + 1) * pageSize >= totalCount}
          >
            Last
          </Button>
        </div>
      </div>
    </div>
  )
}