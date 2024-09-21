import { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Calendar as CalendarIcon } from "lucide-react";
import { FaCheckCircle } from "react-icons/fa";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "../ui/scroll-area";
import { BiReset } from "react-icons/bi";

type Booking = {
  serviceType: string;
  internalBookingId: string;
  pnrNumber: string;
  bookingDate: string;
  supplier: string;
  departureTime: string;
  arrivalTime: string;
  amount: string;
  autoCancel: string;
  bookingStatus: string;
  sendEmail: boolean;
};

const data: Booking[] = [
  {
    serviceType: "Flight",
    internalBookingId: "58632553",
    pnrNumber: "15234759",
    bookingDate: "21-04-2024",
    supplier: "Amadeus",
    departureTime: "11/07/2024-11:30PM",
    arrivalTime: "11/07/2024-11:30PM",
    amount: "$24,000",
    autoCancel: "15-july-24 11:30PM",
    bookingStatus: "Pending Ticketing",
    sendEmail: false,
  },
  {
    serviceType: "Flight",
    internalBookingId: "58632553",
    pnrNumber: "15234758",
    bookingDate: "21-04-2024",
    supplier: "Amadeus",
    departureTime: "11/07/2024-11:30PM",
    arrivalTime: "11/07/2024-11:30PM",
    amount: "$24,000",
    autoCancel: "15-july-24 11:30PM",
    bookingStatus: "Ticketed",
    sendEmail: true,
  },
];

const columns: ColumnDef<Booking>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <input
      className="cursor-pointer"
        type="checkbox"
        checked={table.getIsAllPageRowsSelected()}
        onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <input
       className="cursor-pointer"
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={(e) => row.toggleSelected(!!e.target.checked)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "serviceType",
    header: "Service type",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("serviceType")}</div>
    ),
  },
  {
    accessorKey: "internalBookingId",
    header: "Internal Booking ID",
    cell: ({ row }) => (
      <div className="text-[#0561FC]">{row.getValue("internalBookingId")}</div>
    ),
  },
  {
    accessorKey: "pnrNumber",
    header: "PNR Number",
  },
  {
    accessorKey: "bookingDate",
    header: "Booking Date",
  },
  {
    accessorKey: "supplier",
    header: "Supplier",
  },
  {
    accessorKey: "departureTime",
    header: "Departure Time",
  },
  {
    accessorKey: "arrivalTime",
    header: "Arrival Time",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "autoCancel",
    header: "Auto Cancel",
  },
  {
    accessorKey: "bookingStatus",
    header: "Booking Status",
    cell: ({ row }) => (
      <div
        className={`capitalize bg-lightGray/30 p-0.5 px-2 rounded-lg ${getStatusColor(
          row.getValue("bookingStatus")
        )} `}
      >
        {row.getValue("bookingStatus")}
      </div>
    ),
  },
  {
    accessorKey: "sendEmail",
    header: "Send Email",
    cell: ({ row }) => (
      <div className="text-center flex items-center justify-center">
        {row.getValue("sendEmail") ? (
          <FaCheckCircle className="size-4 shrink-0 fill-customGreen" />
        ) : (
          <Button size="icon" variant="secondary">
            <img
              src="/icons/plane.png"
              alt="icon"
              className="size-4 shrink-0"
            />
          </Button>
        )}
      </div>
    ),
  },
];

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "ticketed":
      return "text-green-600";
    case "pending ticketing":
    case "pending payments":
      return "text-orange-600";
    case "failed booking":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
}

export default function FlightBookingsTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater({ pageIndex, pageSize });
        setPageIndex(newState.pageIndex);
        setPageSize(newState.pageSize);
      } else {
        setPageIndex(updater.pageIndex);
        setPageSize(updater.pageSize);
      }
    },
  });

  const handleApplyFilters = () => {
    // Apply the filters
    table
      .getColumn("pnrNumber")
      ?.setFilterValue(
        (columnFilters.find((f) => f.id === "pnrNumber")?.value as string) || ""
      );
    table
      .getColumn("internalBookingId")
      ?.setFilterValue(
        (columnFilters.find((f) => f.id === "internalBookingId")
          ?.value as string) || ""
      );
    table
      .getColumn("supplier")
      ?.setFilterValue(
        (columnFilters.find((f) => f.id === "supplier")?.value as string) || ""
      );
    table
      .getColumn("bookingStatus")
      ?.setFilterValue(
        (columnFilters.find((f) => f.id === "bookingStatus")
          ?.value as string) || ""
      );
    if (date) {
      table
        .getColumn("bookingDate")
        ?.setFilterValue(format(date, "dd-MM-yyyy"));
    }
  };

  const handleResetFilters = () => {
    setColumnFilters([]);
    setGlobalFilter("");
    setDate(undefined);
    table.resetColumnFilters();
  };

  return (
    <div className="w-full bg-white px-3 rounded-xl">
      <div className="flex items-center gap-2 py-4">
        <Input
          placeholder="PNR"
          value={
            (columnFilters.find((f) => f.id === "pnrNumber")
              ?.value as string) || ""
          }
          onChange={(event) =>
            setColumnFilters((prev) => [
              ...prev.filter((f) => f.id !== "pnrNumber"),
              { id: "pnrNumber", value: event.target.value },
            ])
          }
          className="w-[120px] rounded-xl"
        />
        <Input
          placeholder="Internal Booking ID"
          value={
            (columnFilters.find((f) => f.id === "internalBookingId")
              ?.value as string) || ""
          }
          onChange={(event) =>
            setColumnFilters((prev) => [
              ...prev.filter((f) => f.id !== "internalBookingId"),
              { id: "internalBookingId", value: event.target.value },
            ])
          }
          className="w-[130px] rounded-xl"
        />
        <Select
          onValueChange={(value) =>
            setColumnFilters((prev) => [
              ...prev.filter((f) => f.id !== "bookingStatus"),
              { id: "bookingStatus", value },
            ])
          }
          value={
            (columnFilters.find((f) => f.id === "bookingStatus")
              ?.value as string) || ""
          }
        >
          <SelectTrigger className="w-[110px] rounded-xl">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Ticketed">Ticketed</SelectItem>
            <SelectItem value="Pending Ticketing">Pending Ticketing</SelectItem>
            <SelectItem value="Failed Booking">Failed Booking</SelectItem>
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) =>
            setColumnFilters((prev) => [
              ...prev.filter((f) => f.id !== "supplier"),
              { id: "supplier", value },
            ])
          }
          value={
            (columnFilters.find((f) => f.id === "supplier")?.value as string) ||
            ""
          }
        >
          <SelectTrigger className="w-[110px] rounded-xl">
            <SelectValue placeholder="Supplier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="amadeus">Amadeus</SelectItem>
            <SelectItem value="kiusys">Kiusys</SelectItem>
            <SelectItem value="Duffel">Duffel</SelectItem>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[110px] rounded-xl justify-start text-left font-normal"
            >
              {!date && <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />}
              {date ? format(date, "dd/MM/yyyy") : <span>Month</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Button className="bg-blue rounded-lg" onClick={handleApplyFilters}>
          Apply
        </Button>
        <Button
          variant="ghost"
          type="button"
          className="rounded-lg -ml-2"
          size="sm"
          onClick={handleResetFilters}
        >
          <BiReset className="size-5 fill-customBlue mr-1 shrink-0" />
          <span className="underline text-customBlue font-medium text-sm">
            Reset All
          </span>
        </Button>
        <Input
          placeholder="Search..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm ml-auto rounded-xl"
        />
      </div>
      <div className="rounded-md border overflow-x-auto ">
        <Table className="min-w-max scroll-visible">
          <ScrollArea className="max-w-full overflow-x-auto ">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="px-3 text-[#1D1F2C]">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-3 text-[#777980] py-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </ScrollArea>
        </Table>
      </div>
      <div className="flex items-center justify-between py-4">
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="w-[80px]">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 30, 40, 50].map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          {Array.from({ length: table.getPageCount() }, (_, i) => i + 1).map(
            (page) => (
              <Button
                key={page}
                variant={page === pageIndex + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => table.setPageIndex(page - 1)}
                className="px-3"
              >
                {page}
              </Button>
            )
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
