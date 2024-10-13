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
import { useState } from "react";
import { Image } from "lucide-react";

const TicketDetailsDialog = ({
  ticket,
  isOpen,
  onClose,
}: {
  ticket: any;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

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
                <Label htmlFor="title">Subject</Label>
                <div id="title" className="col-span-3 capitalize">
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
              {/* <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact">Contact Details</Label>
                <div id="contact" className="col-span-3">
                  {ticket.requesterName}
                </div>
              </div> */}
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
