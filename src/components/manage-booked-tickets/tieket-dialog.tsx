import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import ImageDialog from "./ticket-image-dialog";
import { ArrowLeft, Image } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusOptions = [
  { value: "OPEN", label: "Open Tickets", color: "bg-blue" },
  { value: "PENDING", label: "Pending Tickets", color: "bg-[#9A37CC]" },
  { value: "RESOLVE", label: "Resolve Tickets", color: "bg-[#EB3D4D]" },
];

interface TicketDetailsProps {
  ticket: {
    title: string;
    subject: string;
    requesterName: string;
    email: string;
    status: string;
    images: string[];
    description: string;
  };
  onBack: () => void;
  handleTicketStatusChange: (newStatus: string) => void;
}

const TicketDetails = ({
  ticket,
  onBack,
  handleTicketStatusChange,
}: TicketDetailsProps) => {
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(ticket.status);

  useEffect(() => {
    setCurrentStatus(ticket.status);
  }, [ticket.status]);

  const onStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus);
    handleTicketStatusChange(newStatus);
  };

  return (
    <div className="w-full bg-white px-6 py-4 rounded-xl">
      <div className="w-full flex items-center gap-4 mb-6 justify-between">
        <h2 className="text-xl font-semibold text-blue">Ticket Details</h2>
        <Button variant="ghost" className="gap-2" onClick={onBack}>
          <ArrowLeft size={16} />
          Back to List
        </Button>
      </div>

      <ScrollArea className="h-full max-h-[calc(100vh-200px)] pr-4">
        <div className="grid gap-6">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="font-medium">
              Title
            </Label>
            <div id="title" className="col-span-3">
              {ticket.title}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject" className="font-medium">
              Subject
            </Label>
            <div id="subject" className="col-span-3 capitalize">
              {ticket.subject}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="font-medium">
              Name
            </Label>
            <div id="name" className="col-span-3">
              {ticket.requesterName}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="font-medium">
              Email
            </Label>
            <div id="email" className="col-span-3 text-blue-500">
              {ticket.email}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="font-medium">
              Ticket Status
            </Label>
            <div id="status" className="col-span-3">
              <Select value={currentStatus} onValueChange={onStatusChange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue>
                    <div className="flex items-center gap-1">
                      <span
                        className={`w-3 h-3 shrink-0 rounded-full mr-1 ${
                          statusOptions.find(
                            (option) => option.value === currentStatus
                          )?.color
                        }`}
                      />
                      {currentStatus}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center">
                        <div
                          className={`w-3 h-3 rounded-full mr-2 ${option.color}`}
                        />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="font-medium">
              Image
            </Label>
            <div id="image" className="col-span-3">
              <Button
                variant="outline"
                onClick={() => setIsImageDialogOpen(true)}
                className="flex items-center gap-2"
              >
                Show {ticket.images.length} Images
                <Image className="size-5 shrink-0 text-blue" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="font-medium">
              Description
            </Label>
            <div id="description" className="col-span-3">
              {ticket.description}
            </div>
          </div>
        </div>
      </ScrollArea>

      <ImageDialog
        isOpen={isImageDialogOpen}
        onClose={() => setIsImageDialogOpen(false)}
        ticket={ticket}
      />
    </div>
  );
};

export default TicketDetails;
