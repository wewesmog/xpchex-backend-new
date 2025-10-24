// A menu that allows the user to select a time range
// Timeranges to be provided by page.tsx

import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TimerangeMenuProps {
  value: string
  onValueChange: (value: string) => void
}

export function TimerangeMenu({ value, onValueChange }: TimerangeMenuProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px] font-bold">
        <SelectValue placeholder="Select a time range" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {/* <SelectLabel>Time Ranges</SelectLabel> */}
          <SelectItem value="last_7_days">Last 7 Days</SelectItem>
            <SelectItem value="last_30_days">Last 30 Days</SelectItem>
            <SelectItem value="last_90_days">Last 90 Days</SelectItem>
            <SelectItem value="last_6_months">Last 6 Months</SelectItem>
            <SelectItem value="this_year">This Year</SelectItem>
            <SelectItem value="all_time">All Time</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
