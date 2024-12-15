import React from 'react';
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Jobs } from '@/utils/types/form-type';

interface DateSectionProps {
  formData: Jobs;
  errors: Record<string, string | null>;
  handleDateChange: (field: string, date: Date | undefined) => void;
}

const DateSection: React.FC<DateSectionProps> = ({
  formData,
  errors,
  handleDateChange,
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="createdAt">Post Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.createdAt && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.createdAt ? (
                format(new Date(formData.createdAt), "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
          <Calendar
        mode="single"
        selected={today}
        onSelect={(date) => handleDateChange('createdAt', date)}
        initialFocus
    />
          </PopoverContent>
        </Popover>
        {errors.createdAt && (
          <p className="text-sm text-red-500">{errors.createdAt}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="deadline">Deadline</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.deadline && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.deadline ? (
                format(new Date(formData.deadline), "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formData.deadline ? new Date(formData.deadline) : undefined}
              onSelect={(date) => handleDateChange('deadline', date)}
              // disabled={(date) => date < today}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.deadline && (
          <p className="text-sm text-red-500">{errors.deadline}</p>
        )}
      </div>
    </div>
  );
};

export default DateSection;