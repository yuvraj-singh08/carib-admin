import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import ImageDialog from "./ticket-image-dialog";
import { Image } from "lucide-react";
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

const TicketDetailsDialog = ({
  ticket,
  isOpen,
  onClose,
  handleTicketStatusChange,
}: {
  ticket: any;
  isOpen: boolean;
  onClose: () => void;
  handleTicketStatusChange: (newStatus: string) => void;
}) => {
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
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-blue">Ticket Details</DialogTitle>
          </DialogHeader>
          <ScrollArea className="mt-4 h-full max-h-[50vh] pr-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title">Title</Label>
                <div id="title" className="col-span-3">
                  {ticket.title}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject">Subject</Label>
                <div id="subject" className="col-span-3 capitalize">
                  {ticket.subject}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name">Name</Label>
                <div id="name" className="col-span-3">
                  {ticket.requesterName}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email">Email</Label>
                <div id="email" className="col-span-3 text-blue-500">
                  {ticket.email}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status">Ticket Status</Label>
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
                <Label htmlFor="image">Image</Label>
                <div id="image" className="col-span-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsImageDialogOpen(true)}
                  >
                    Show {ticket.images.length}{" "}
                    <Image className="size-5 shrink-0 text-blue ml-2" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description">Description</Label>
                <div id="description" className="col-span-3">
                  {ticket.description}
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      <ImageDialog
        isOpen={isImageDialogOpen}
        onClose={() => setIsImageDialogOpen(false)}
        ticket={ticket}
      />
    </>
  );
};

export default TicketDetailsDialog;
