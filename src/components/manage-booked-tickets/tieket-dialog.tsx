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
import { ScrollArea } from "@/components/ui/scroll-area";

const TicketDetailsDialog = ({
  ticket,
  isOpen,
  onClose,
}: {
  ticket: any;
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle className="text-blue">Ticket Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-4 h-[70vh] pr-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title">Title</Label>
              <div id="title" className="col-span-3">
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
                Demo@gmail.com
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contact">Contact Details</Label>
              <div id="contact" className="col-span-3">
                +91 6589235687
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image">Image</Label>
              <div id="image" className="col-span-3">
                <Button variant="outline" size="sm">
                  Show
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" >
                Status
              </Label>
              <div id="status" className="col-span-3">
                <Select defaultValue={ticket.status}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open Tickets">
                      <span className="flex items-center">
                        <span className="h-2 w-2 rounded-full bg-blue mr-2"></span>
                        Open Tickets
                      </span>
                    </SelectItem>
                    <SelectItem value="Pending Tickets">
                      <span className="flex items-center">
                        <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
                        Pending Tickets
                      </span>
                    </SelectItem>
                    <SelectItem value="Resolve Tickets">
                      <span className="flex items-center">
                        <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                        Resolve Tickets
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" >
                Description
              </Label>
              <div id="description" className="col-span-3">
                Please enter the details of your request. Remember: Never share
                passwords and don't provide personal, sensitive or confidential
                information to anyone you don't know or who doesn't have a
                legitimate need for it. Please enter the details of your
                request. Remember: Never share passwords and don't provide
                personal, sensitive or confidential information to anyone you
                don't know or who doesn't have a legitimate need for it.Please
                enter the details of your request. Remember: Never share
                passwords and don't provide personal, sensitive or confidential
                information to anyone you don't know or who doesn't have a
                legitimate need for it.Please enter the details of your request.
                Remember: Never share passwords and don't provide personal,
                sensitive or confidential information to anyone you don't know
                or who doesn't have a legitimate need for it.
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TicketDetailsDialog;
