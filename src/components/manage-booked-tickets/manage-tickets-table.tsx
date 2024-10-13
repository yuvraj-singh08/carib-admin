import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, Search, Trash2 } from "lucide-react";
import DatePickerWithRange from "../ui/date-range-picker";
import { Input } from "../ui/input";
import TicketDetailsDialog from "./tieket-dialog";
import { useConfirm } from "@/hooks/use-confirm";
import {
  fetchTickets,
  updateTicket,
  deleteTicket,
  TicketStatus,
} from "@/redux/tickets";

import { Ticket } from "@/redux/tickets";
import { AppDispatch, RootState } from "@/provider/redux-provider";
import toast from "react-hot-toast";

const statusOptions = [
  { value: "OPEN", label: "Open Tickets", color: "bg-blue" },
  { value: "PENDING", label: "Pending Tickets", color: "bg-[#9A37CC]" },
  { value: "RESOLVE", label: "Resolve Tickets", color: "bg-[#EB3D4D]" },
];

const BookingTicketsTableWithDateFilter = () => {
  const dispatch: AppDispatch = useDispatch();
  const tickets = useSelector((state: RootState) => state.tickets.tickets);
  const ticketStatus = useSelector((state: RootState) => state.tickets.status);

  const [filteredData, setFilteredData] = useState(tickets);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const [ConfirmDialogue, confirm] = useConfirm(
    "Delete Ticket",
    "Are you sure you want to delete this ticket? This action cannot be undone."
  );

  useEffect(() => {
    if (ticketStatus === "idle") {
      dispatch(fetchTickets());
    }
  }, [ticketStatus, dispatch]);

  useEffect(() => {
    filterTickets(searchTerm, statusFilter, dateRange);
  }, [tickets, searchTerm, statusFilter, dateRange]);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const filterTickets = (
    searchTerm: string,
    status: string,
    range: DateRange | undefined
  ) => {
    const filtered = tickets.filter((ticket) => {
      const matchesSearch = Object.values(ticket).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesStatus = status === "all" || ticket.status === status;
      const matchesDate =
        !range?.from ||
        !range?.to ||
        (new Date(ticket.requestedOn) >= range.from &&
          new Date(ticket.requestedOn) <= range.to);

      return matchesSearch && matchesStatus && matchesDate;
    });
    setFilteredData(filtered);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    filterTickets(event.target.value, statusFilter, dateRange);
  };

  const handleStatusChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    filterTickets(searchTerm, newStatus, dateRange);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    filterTickets(searchTerm, statusFilter, range);
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm();
    if (ok) {
      dispatch(deleteTicket(id));
      toast.success("Ticket deleted successfully!");
    }
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleTicketStatusChange = async (
    id: string,
    newStatus: TicketStatus
  ) => {
    try {
      await dispatch(updateTicket({ id, status: newStatus })).unwrap();

      toast.success("Ticket status updated successfully!");
    } catch (error) {
      toast.error("Failed to update ticket status.");
    }
  };

  React.useEffect(() => {
    filterTickets(searchTerm, statusFilter, dateRange);
  }, [tickets, searchTerm, statusFilter, dateRange]);

  return (
    <>
      <ConfirmDialogue />
      <div className="w-full bg-white px-3 rounded-xl">
        <div className="flex items-center justify-between py-4">
          <div className="flex space-x-2">
            <DatePickerWithRange onDateChange={handleDateRangeChange} />
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2 bg-[#348E4D]" />
                    Total Tickets
                  </div>
                </SelectItem>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full mr-2 ${option.color}`}
                      />
                      {option.value}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Input
            placeholder="Search product..."
            className="w-[210px] rounded-lg h-9 pl-9"
            onChange={handleSearch}
          />
          <Search className="size-5 shrink-0 text-gray absolute top-2 left-2" />
        </div>

        <ScrollArea className="h-[300px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedItems.length === filteredData.length}
                    onCheckedChange={(checked) =>
                      checked
                        ? setSelectedItems(filteredData.map((item) => item.id))
                        : setSelectedItems([])
                    }
                  />
                </TableHead>
                <TableHead>Reference ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Requester Name</TableHead>
                <TableHead>Requested on</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => handleCheckboxChange(item.id)}
                    />
                  </TableCell>
                  <TableCell className="text-[13px]">{item.id}</TableCell>
                  <TableCell className="capitalize">{item.subject}</TableCell>
                  <TableCell>{item.requesterName}</TableCell>
                  <TableCell>
                    {format(new Date(item.requestedOn), "dd-MM-yyyy HH:mm")}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={item.status}
                      onValueChange={(value) =>
                        handleTicketStatusChange(item.id, value as TicketStatus)
                      }
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue>
                          <div className="flex items-center gap-1">
                            <span
                              className={`w-3 h-3 shrink-0 rounded-full mr-1 ${
                                statusOptions.find(
                                  (option) => option.value === item.status
                                )?.color
                              }`}
                            />
                            {item.status}
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
                              {option.value}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        className="bg-orange-400/20 hover:bg-orange-400/40"
                        onClick={() => setSelectedTicket(item)}
                      >
                        <Eye size={16} className="text-orange-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        className="bg-red-400/20 hover:bg-red-400/40"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>

        {selectedTicket && (
          <TicketDetailsDialog
            ticket={selectedTicket}
            isOpen={!!selectedTicket}
            onClose={() => setSelectedTicket(null)}
            handleTicketStatusChange={(newStatus) =>
              handleTicketStatusChange(
                selectedTicket!.id,
                newStatus as TicketStatus
              )
            }
          />
        )}

        <div className="flex items-center justify-between space-x-2 py-4">
          <div>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => setItemsPerPage(Number(value))}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder={itemsPerPage} />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {[
              ...Array(Math.ceil(filteredData.length / itemsPerPage)).keys(),
            ].map((number) => (
              <Button
                key={number + 1}
                variant={currentPage === number + 1 ? "default" : "outline"}
                onClick={() => paginate(number + 1)}
              >
                {number + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => paginate(currentPage + 1)}
              disabled={
                currentPage === Math.ceil(filteredData.length / itemsPerPage)
              }
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingTicketsTableWithDateFilter;
