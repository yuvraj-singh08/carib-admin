import React, { useState } from 'react';
import { format, addDays, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronLeft, ChevronRight, CalendarIcon } from 'lucide-react';
import { cn } from "@/lib/utils";
import { DateRange } from 'react-day-picker';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);

interface DatePickerWithRangeProps {
  onDateChange: (range: DateRange | undefined) => void;
}

const DatePickerWithRange: React.FC<DatePickerWithRangeProps> = ({ onDateChange }) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);

  const handleMonthChange = (value: string) => {
    setSelectedMonth(parseInt(value));
  };

  const handleYearChange = (value: string) => {
    setSelectedYear(parseInt(value));
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDate(range);
    onDateChange(range);
  };

  const handleShortcutSelect = (shortcut: string) => {
    const today = new Date();
    let from: Date | undefined;
    let to: Date | undefined;

    switch (shortcut) {
      case 'today':
        from = to = today;
        break;
      case 'yesterday':
        from = to = subDays(today, 1);
        break;
      case 'thisWeek':
        from = startOfWeek(today);
        to = endOfWeek(today);
        break;
      case 'lastWeek':
        from = startOfWeek(subDays(today, 7));
        to = endOfWeek(subDays(today, 7));
        break;
      case '1dayUpToToday':
        from = subDays(today, 1);
        to = today;
        break;
      case '1dayStartingToday':
        from = today;
        to = addDays(today, 1);
        break;
      default:
        break;
    }

    setDate({ from, to });
    onDateChange({ from, to });
    setIsOpen(false);
  };

  const navigateMonth = (direction: number) => {
    let newMonth = selectedMonth + direction;
    let newYear = selectedYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }

    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant={"outline"}
          className={cn(
            "w-[300px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "LLL dd, y")} -{" "}
                {format(date.to, "LLL dd, y")}
              </>
            ) : (
              format(date.from, "LLL dd, y")
            )
          ) : (
            <span>Select Date Range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] p-0" align="start">
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold">Select Date </h2>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" onClick={() => navigateMonth(-1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Select value={selectedMonth.toString()} onValueChange={handleMonthChange}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue>{monthNames[selectedMonth]}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {monthNames.map((month, index) => (
                    <SelectItem key={index} value={index.toString()}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue>{selectedYear}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="ghost" size="icon" onClick={() => navigateMonth(1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="w-1/3">
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" onClick={() => handleShortcutSelect('today')}>Today</Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => handleShortcutSelect('yesterday')}>Yesterday</Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => handleShortcutSelect('thisWeek')}>This Week</Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => handleShortcutSelect('lastWeek')}>Last Week</Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => handleShortcutSelect('1dayUpToToday')}>1 day up to today</Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => handleShortcutSelect('1dayStartingToday')}>1 day starting today</Button>
              </div>
            </div>
            <div className="w-2/3">
              <Calendar
                mode="range"
                selected={date}
                onSelect={handleDateRangeChange}
                month={new Date(selectedYear, selectedMonth)}
                className="rounded-md border"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DatePickerWithRange;