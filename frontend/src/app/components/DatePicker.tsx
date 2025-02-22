"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SelectSingleEventHandler } from "react-day-picker";

type Props = {
  value: Date | undefined;
  onValueChange: SelectSingleEventHandler | undefined;
};

const DatePicker: React.FC<Props> = ({ value, onValueChange }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-[240px] justify-start text-left font-normal", !value && "text-muted-foreground")}
        >
          <CalendarIcon />
          {value ? format(value, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={value} onSelect={onValueChange} initialFocus />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
