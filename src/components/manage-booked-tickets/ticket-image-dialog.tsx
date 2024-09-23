import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Separator } from "../ui/separator";

const data = [
  { name: "08:00", value: 0 },
  { name: "09:00", value: 0 },
  { name: "10:00", value: 1 },
  { name: "11:00", value: 1 },
  { name: "12:00", value: 1 },
  { name: "13:00", value: 0 },
  { name: "14:00", value: 0 },
  { name: "15:00", value: 1 },
  { name: "16:00", value: 1 },
  { name: "17:00", value: 0 },
];

const ImageDialog = ({
  isOpen,
  onClose,
  ticket,
}: {
  isOpen: boolean;
  onClose: () => void;
  ticket: any;
}) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
setDate;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl flex flex-col gap-3 *:">
      <DialogHeader>
          <DialogTitle className="text-blue">New availability</DialogTitle>
          
        </DialogHeader>
        <Separator />
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="appointment" >
              Appointment
            </Label>
            <Select defaultValue="appointment">
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="appointment">Appointment</SelectItem>
                <SelectItem value="availability">Availability</SelectItem>
                <SelectItem value="out-of-office">Out of office</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" >
              Location
            </Label>
            <div className="col-span-3">
              {ticket.location || "BPC & DMC - Mr Mohalkar"}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="practitioner" >
              Practitioner
            </Label>
            <div className="col-span-3">{ticket.practitioner || "General"}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" >
              Date and time
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Button
                variant={"outline"}
                className="w-[280px] justify-start text-left font-normal"
                onClick={() => {
                  // Add date picker logic here
                }}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
              <Select defaultValue="19:00">
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="19:00">19:00</SelectItem>
                  <SelectItem value="20:00">20:00</SelectItem>
                  <SelectItem value="21:00">21:00</SelectItem>
                </SelectContent>
              </Select>
              <span>-</span>
              <Select defaultValue="20:00">
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20:00">20:00</SelectItem>
                  <SelectItem value="21:00">21:00</SelectItem>
                  <SelectItem value="22:00">22:00</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        
        </div>
        <div className="col-span-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis ticks={[0, 1]} domain={[0, 1]} />
                <Tooltip />
                <Line type="stepAfter" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageDialog;