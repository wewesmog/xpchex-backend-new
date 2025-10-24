"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import Image from "next/image"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"

export type Review = {
  id: string
  username: string
  user_image: string
  content: string
  score: number
  review_created_at: string
  reply_content: string
  reply_created_at: string
  app_version: string
  thumbs_up_count: number
  selected: boolean
}

export const columns: ColumnDef<Review>[] = [
  {
    header: "Select",
    accessorKey: "selected",
    cell: ({ row }) => {
      return (
        <div className="text-start text-red-500 px-4">
          <Checkbox className="w-4 h-4" checked={row.original.selected} onCheckedChange={(checked) => {
            console.log("checked: ", row.original.username, checked)
          }} />
        </div>
      )
    },
  },
  {    
    accessorKey: "username",
    // Format 
    header: ({ column }) => {
      return (
        <div className="text-center font-bold text-yellow-500">
          Username
        </div>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="text-start text-red-500 px-4">
          {row.original.username}
        </div>
      )
    },
  },
  {
    header: "User Image",
    accessorKey: "user_image",
    cell: ({ row }) => {
      return (
        <div className="text-start text-red-500 px-4">
          <Image src={row.original.user_image} alt={row.original.username} width={20} height={20} className="rounded-full" />
        </div>
      )
    },
  },
  {
    header: "Content",
    accessorKey: "content",
    cell: ({ row }) => {
      return (
        <div className="text-start text-xs text-green-500 px-4 max-w-40 text-ellipsis overflow-hidden">
          {row.original.content}
          <div className="flex items-center justify-end">
          
          </div>
        </div>
      )
    },
  },

  {
    header: "Score",
    accessorKey: "score",
  },
  {
    header: "Review Created At",
    accessorKey: "review_created_at",
  },
  {
    header: "Reply Content",
    accessorKey: "reply_content",
  },
  {
    header: "Reply Created At",
    accessorKey: "reply_created_at",
  },
  // {
  //   header: "App Version",
  //   accessorKey: "app_version",
  // },
  {
    header: "Thumbs Up Count",
    accessorKey: "thumbs_up_count",
  },
  {
    header: "Actions",
    accessorKey: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel className="text-xs text-cyan-500 text-lg font-bold">Run</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => {
              console.log("clicked: ", row.original.content)
            }}>Copy</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {
              console.log("Paste: ", row.original.content)
            }}>Paste</DropdownMenuItem>
            <DropdownMenuSeparator />
         
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },

  }
]

