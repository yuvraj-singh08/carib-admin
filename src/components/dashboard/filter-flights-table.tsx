import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
// import { Calendar as CalendarIcon } from "lucide-react";
import { FaCheckCircle } from "react-icons/fa";
// import { format } from "date-fns";
import { BiReset } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/provider/redux-provider";
import {
  fetchBookings,
  updateBooking,
  sendBookingEmail,
  AdminStatus,
  Booking,
} from "@/redux/booking";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "../ui/scroll-area";
import useThrottle from "@/hooks/use-throttle";
import { DateRange } from "react-day-picker";
import DatePickerWithRange from "../ui/date-range-picker";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "../ui/popover";
import toast from "react-hot-toast";
import PermissionGroup from "../permissions/PermissionGroup";

const getStatusColor = (status: AdminStatus) => {
  switch (status) {
    case AdminStatus.TICKETED:
      return "bg-green-100 text-green-600";
    case AdminStatus.PENDING_TICKET:
      return "bg-yellow-200/40 text-orange-500";
    case AdminStatus.PENDING_PAYMENT:
      return "bg-orange-200 text-orange-600";
    case AdminStatus.EXPIRED:
      return "bg-gray-200 text-gray-600";
    case AdminStatus.FAILED_BOOKING:
      return "bg-red-100 text-red-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export default function FlightBookingsTable() {
  const dispatch = useDispatch<AppDispatch>();
  const total = useSelector((state: RootState) => state.bookings.total);

  const bookings = useSelector((state: RootState) => state.bookings.bookings);
  const loading = useSelector((state: RootState) => state.bookings.loading);
  const error = useSelector((state: RootState) => state.bookings.error);
  const emailSending = useSelector(
    (state: RootState) => state.bookings.emailSending
  );
  const emailError = useSelector(
    (state: RootState) => state.bookings.emailError
  );
  const navigate = useNavigate();
  console.log("Bookings", bookings);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [, setOpen] = useState(false);
  // const [date, setDate] = useState<DateRange | undefined>({
  //   to:Date:'',
  //   from:''
  // });
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchKey, setSearchKey] = useState("");
  const [status, setStatus] = useState<string | undefined>();
  // const setSearchKeyRef = useRef(setSearchKey);
  const throttledValue = useThrottle(globalFilter, 500);

  console.log("sattus...", status);
  console.log("bookings", bookings);

  useEffect(() => {
    dispatch(
      fetchBookings({
        to: date?.to,
        from: date?.from,
        pageIndex,
        pageSize,
        searchKey,
        status,
      })
    );
  }, [dispatch, date, pageIndex, pageSize, searchKey, status]);

  useEffect(() => {
    // if (setSearchKeyRef.current) {
    setSearchKey(throttledValue);
    // }
  }, [throttledValue, setSearchKey]);

  const handleStatusChange = async (id: string, newStatus: AdminStatus) => {
    try {
      await dispatch(updateBooking({ id, adminStatus: newStatus })).unwrap();
    } catch (error) {
      console.error("Failed to update booking status:", error);
    }
  };

 
  const handleSendEmail = async (bookingId: string) => {
    setOpen(false);
    try {
      await dispatch(sendBookingEmail(bookingId)).unwrap();
      toast.success("Email sent successfully");
    } catch (error) {
      // Now we're using the error from Redux state to show in toast
      console.log(error);
      const errorMessage = emailError[bookingId] || "Failed to send email";
      toast.error(errorMessage);
    }
  };

  const LoadingSpinner = () => (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

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
      accessorKey: "id",
      header: "Internal Booking ID",
      cell: ({ row }) => (
        <div
          className="text-[#0561FC] cursor-pointer"
          onClick={() => navigate(`/flightdetails/${row.getValue("id")}`)}
        >
          {row.getValue("id")}
        </div>
      ),
    },
    // {
    //   accessorKey: "passenger",
    //   header: "Name",
    //   cell: ({ row }) => {
    //     const passenger = (row.getValue("passenger") as { firstName: string; surname: string }[])[0];
    //     return `${passenger.firstName} ${passenger.surname}`;
    //   }
    // },

    // {
    //   accessorKey: "passenger",
    //   header: "Name",
    //   cell: ({ row }) => {
    //     const passengers = row.getValue("passenger") as string[]; // Get the JSON string array
    //     if (passengers.length > 0) {
    //       const passengerData = JSON.parse(passengers[0]); // Parse the first passenger object
    //       return `${passengerData.firstName} ${passengerData.lastName}`;
    //     }
    //     return "N/A"; // Fallback in case of missing data
    //   }
    // },

    {
      accessorKey: "passenger",
      header: "Name",
      cell: ({ row }) => {
        const passengers = row.getValue("passenger") as string; // Get the JSON string
        if (passengers) {
          try {
            const passengerData = JSON.parse(passengers)[0]; // Parse the first passenger object
            return `${passengerData.firstName} ${passengerData.lastName}`;
          } catch (error) {
            console.error("Error parsing passenger data:", error);
            return "Invalid Data";
          }
        }
        return "N/A"; // Fallback in case of missing data
      },
    },

    {
      accessorKey: "contactDetail.email",
      header: "Email",
    },
    {
      accessorKey: "contactDetail.phone",
      header: "Phone Number",
    },
    {
      accessorKey: "totalAmount",
      header: "Amount",
      cell: ({ row }) => (
        <div>{`${row.getValue("totalAmount")} ${row.original.currency}`}</div>
      ),
    },
    {
      accessorKey: "adminStatus",
      header: "Booking Status (Email)",
      cell: ({ row }) => {
        const status = row.getValue("adminStatus") as AdminStatus;
        return (
          <Select
            value={status}
            onValueChange={(value) =>
              handleStatusChange(row.original.id, value as AdminStatus)
            }
          >
            <SelectTrigger className={`w-full ${getStatusColor(status)}`}>
              <SelectValue>{status}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.values(AdminStatus).map((statusOption) => (
                <SelectItem key={statusOption} value={statusOption}>
                  {statusOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
    },
    {
      accessorKey: "sendEmail",
      header: "Send Email",
      cell: ({ row }) => (
        <div className="text-center flex items-center justify-center">
          {row.getValue("sendEmail") ? (
            <FaCheckCircle className="size-4 shrink-0 fill-customGreen" />
          ) : (
            <Popover onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="secondary"
                  type="button"
                  disabled={emailSending[row.original.id]}
                >
                  {emailSending[row.original.id] ? (
                    <LoadingSpinner />
                  ) : (
                    <img
                      src="/icons/plane.png"
                      alt="icon"
                      className="w-4 h-4 shrink-0"
                    />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 shadow-lg rounded-lg border border-gray-200 p-6 bg-white mr-7">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Confirm Action</h4>
                    <p className="text-sm text-gray-500">
                      Do you want to send the email?
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setOpen(false)}
                    >
                      No
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleSendEmail(row.original.id)}
                    >
                      Yes
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: bookings,
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
        pageIndex: 0,
        pageSize,
      },
    },
    // onPaginationChange: (updater) => {
    //   if (typeof updater === "function") {
    //     const newState = updater({ pageIndex, pageSize });
    //     setPageIndex(newState.pageIndex);
    //     setPageSize(newState.pageSize);
    //   } else {
    //     setPageIndex(updater.pageIndex);
    //     setPageSize(updater.pageSize);
    //   }
    // },
  });

  const handleApplyFilters = () => {
    table
      .getColumn("id")
      ?.setFilterValue(
        (columnFilters.find((f) => f.id === "id")?.value as string) || ""
      );

    table
      .getColumn("adminStatus")
      ?.setFilterValue(
        (columnFilters.find((f) => f.id === "adminStatus")?.value as string) ||
          ""
      );

    table
      .getColumn("supplier")
      ?.setFilterValue(
        (columnFilters.find((f) => f.id === "supplier")?.value as string) || ""
      );

    // if (date) {
    //   table.getColumn("bookingDate")?.setFilterValue(format(date, "dd-MM-yyyy"));
    // }
  };

  const handleResetFilters = () => {
    setColumnFilters([]);
    setGlobalFilter("");
    setDate(undefined);
    table.resetColumnFilters();
  };

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-white rounded-xl">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4 bg-white rounded-xl text-red-600">
        Error loading bookings: {error}
      </div>
    );
  }

  return (
    <div className="w-full bg-white px-3 rounded-xl">
      <div className="flex items-center gap-2 py-4">
        {/* <Input
          placeholder="Booking ID"
          value={(columnFilters.find((f) => f.id === "id")?.value as string) || ""}
          onChange={(event) =>
            setColumnFilters((prev) => [
              ...prev.filter((f) => f.id !== "id"),
              { id: "id", value: event.target.value },
            ])
          }
          className="w-[130px] rounded-xl"
        /> */}
        <Select
          onValueChange={(value) => {
            setColumnFilters((prev) => [
              ...prev.filter((f) => f.id !== "adminStatus"),
              { id: "adminStatus", value },
            ]);
            setStatus(value);
          }}
          value={
            (columnFilters.find((f) => f.id === "adminStatus")
              ?.value as string) || ""
          }
        >
          <SelectTrigger className="w-[150px] rounded-xl">
            <SelectValue placeholder="Booking Status" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(AdminStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* <Select
          onValueChange={(value) =>
            setColumnFilters((prev) => [
              ...prev.filter((f) => f.id !== "supplier"),
              { id: "supplier", value },
            ])
          }
          value={(columnFilters.find((f) => f.id === "supplier")?.value as string) || ""}
        >
          <SelectTrigger className="w-[110px] rounded-xl">
            <SelectValue placeholder="Supplier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="amadeus">Amadeus</SelectItem>
            <SelectItem value="kiusys">Kiusys</SelectItem>
            <SelectItem value="Duffel">Duffel</SelectItem>
          </SelectContent>
        </Select> */}
        {/* <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[210px] rounded-xl justify-start text-left font-normal"
            >
              {!date && <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />}
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
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="range"
              selected={date}
              onSelect={setDate}
              initialFocus
             
            />
          </PopoverContent>
        </Popover> */}
        <DatePickerWithRange
          date={date}
          onDateChange={setDate}
          // className="w-full"
        />
        {/* <DatePickerWithRange
                value={date}
                onChange={setDate}
                className="w-full"
              /> */}

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

      <div className="rounded-md border">
        <ScrollArea className="">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="px-3 text-[#1D1F2C] sticky top-0 bg-white"
                    >
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
            <PermissionGroup resource="dashboard" action="view">
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="px-3 text-[#777980] py-3"
                        >
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
            </PermissionGroup>
          </Table>
        </ScrollArea>
      </div>

      <div className="flex items-center justify-between py-4">
        <Select
          value={pageSize.toString()}
          onValueChange={(value: any) => {
            // table.setPageSize(Number(value));
            setPageSize(Number(value));
            setPageIndex(0);
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
            // onClick={() => table.previousPage()}
            onClick={() => setPageIndex(pageIndex - 1)}
            disabled={pageIndex <= 0}
          >
            Previous
          </Button>
          {Array.from(
            { length: Math.ceil(total / pageSize) },
            (_, i) => i + 1
          ).map((page) => (
            <Button
              key={page}
              variant={page === pageIndex + 1 ? "default" : "outline"}
              size="sm"
              // onClick={() => table.setPageIndex(page - 1)}
              onClick={() => {
                setPageIndex(page - 1);
                table.setPageIndex(page - 1);
              }}
              className="px-3"
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            // onClick={() => table.nextPage()}
            onClick={() => {
              setPageIndex(pageIndex + 1);
            }}
            disabled={pageIndex >= Math.ceil(total / pageSize) - 1}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
