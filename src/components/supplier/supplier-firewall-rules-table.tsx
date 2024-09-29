import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { BiReset } from "react-icons/bi";
import { format } from "date-fns";
import axios from "axios";
import toast from "react-hot-toast";
import { useTableLoader } from "@/hooks/loader";

const formSchema = z.object({
  rulesTitle: z.string().min(1, "Rules title is required"),
  supplierName: z.string().min(1, "Flight supplier is required"),
  airlinesCode: z.string().min(1, "Airlines code is required"),
  flightNumber: z.string().min(1, "Flight number is required"),
  fromAirport: z.string().min(1, "Origin airport is required"),
  toAirport: z.string().min(1, "Destination airport is required"),
});

type FlightRule = {
  id: string;
  title: string;
  supplier: string;
  code: string;
  flightNumber: string;
  from: string;
  to: string;
  updateTime: Date;
};

const columns: ColumnDef<FlightRule>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllPageRowsSelected()}
        onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <input
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
    accessorKey: "title",
    header: "Rules title",
  },
  {
    accessorKey: "supplier",
    header: "Supplier name",
  },
  {
    accessorKey: "code",
    header: "Airlines Code",
  },
  {
    accessorKey: "flightNumber",
    header: "Flight number",
  },
  {
    accessorKey: "from",
    header: "From Airport",
  },
  {
    accessorKey: "to",
    header: "To Airport",
  },
  {
    accessorKey: "updateTime",
    header: "Last Update",
    cell: ({ getValue }) => {
      const value = getValue() as string;
      const formattedDate = format(new Date(value), "dd-MMM-yy hh:mm a");
      return formattedDate;
    },
  },
];

export default function FlightRulesManager() {
  const [flightRules, setFlightRules] = useState<FlightRule[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const { loading, setLoading } = useTableLoader();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rulesTitle: "",
      supplierName: "",
      airlinesCode: "",
      flightNumber: "",
      fromAirport: "",
      toAirport: "",
    },
  });

  const table = useReactTable({
    data: flightRules,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 50,
      },
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const apiUrl = import.meta.env.VITE_BACKEND_URL as string;
    toast.loading("Creating new firewall rule...");

    const data = {
      title: values.rulesTitle,
      supplier: values.supplierName,
      code: values.airlinesCode,
      flightNumber: values.flightNumber,
      from: values.fromAirport,
      to: values.toAirport,
    };
    try {
      await axios.post(`${apiUrl}/admin/add-firewall`, data).then((res) => {
        console.log(res.data);
        toast.success("Firewall rule created successfully");
      });
    } catch (error: any) {
      console.error(error.message);
      toast.error("Failed to create firewall rule");
    } finally {
      setLoading(false);
      toast.dismiss();
    }
    form.reset();
  }

  function handleResetAll() {
    form.reset();
    setGlobalFilter("");
  }

  useEffect(() => {
    setLoading(true);
    async function fetchFlightRules() {
      const apiUrl = import.meta.env.VITE_BACKEND_URL as string;
      try {
        const response = await axios.get(`${apiUrl}/admin/firewall`);
        setFlightRules(response.data.firewall);
      } catch (error: any) {
        console.error(error.message);
      }
    }
    fetchFlightRules();
    setLoading(false);
  }, [flightRules]);

  return (
    <div className="w-full bg-white px-3 rounded-xl space-y-6 py-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="rulesTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rules Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Rules title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supplierName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Flight Supplier</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Flight supplier" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="AMADEUS">Amadeus</SelectItem>
                      <SelectItem value="KIUSYS">Kiusys</SelectItem>
                      <SelectItem value="DUFFEL">Duffel</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="airlinesCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Airlines Code</FormLabel>
                  <FormControl>
                    <Input placeholder="2540" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="flightNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Flight Number</FormLabel>
                  <FormControl>
                    <Input placeholder="551655223" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fromAirport"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From Origin Airport</FormLabel>
                  <FormControl>
                    <Input placeholder="Any origin Airport" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="toAirport"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To Destination Airport</FormLabel>
                  <FormControl>
                    <Input placeholder="Destination Airport" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end gap-4 items-center">
            <Button
              disabled={loading}
              type="submit"
              className="bg-blue text-white"
              size={"sm"}
            >
              Create Rules
            </Button>

            <Button
              type="button"
              onClick={handleResetAll}
              variant="ghost"
              className="h-8 text-customBlue hover:text-customBlue"
            >
              <BiReset className="mr-2" />
              <span className="underline text-md"> Reset</span>
            </Button>
          </div>
        </form>
      </Form>

      <div className="flex items-center justify-end py-4">
        <Input
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm rounded-xl"
        />
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-max">
          <ScrollArea className="max-w-full overflow-x-auto">
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
          </ScrollArea>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
              setPageSize(Number(value));
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
        </div>
        <div className="space-x-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-2 py-1 border rounded"
          >
            Previous
          </button>
          {Array.from({ length: table.getPageCount() }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => table.setPageIndex(page - 1)}
                className={`px-2 py-1 border rounded ${
                  table.getState().pagination.pageIndex === page - 1
                    ? "bg-blue px-3 text-white"
                    : ""
                }`}
              >
                {page}
              </button>
            )
          )}
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-2 py-1 border rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
