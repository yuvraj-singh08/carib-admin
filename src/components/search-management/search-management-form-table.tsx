import { useState, useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  createSearchManagement,
  updateSearchManagement,
  deleteSearchManagement,
  getSearchManagement,
  SearchManagement,
} from "@/redux/search-management";
import { AppDispatch, RootState } from "@/provider/redux-provider";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ConnectingAirportsSelector } from "./connecting-airports-selector";
import { AirlinesMultiSelect } from "./airlines-multiselector";

const formSchema = z.object({
  ruleTitle: z.string().min(1, "Rule title is required"),
  gdsNdcSupplier: z.enum(["AMADEUS", "KIUSYS", "DUFFEL", "ALL", "NONE"], {
    required_error: "GDS/NDC/Supplier is required",
  }),
  ruleType: z.enum(["CREATE_COMBINATION", "COMING_SOON"], {
    required_error: "Rule type is required",
  }),
  journeyType: z.enum(["ONEWAY", "ROUNDTRIP", "MULTIWAY"], {
    required_error: "Journey type is required",
  }),
  fromOriginAirport: z.string().nonempty("From origin airport is required"),
  toDestinationsAirport: z
    .string()
    .nonempty("To destinations airport is required"),
  connectingAirports: z
    .array(z.array(z.string()))
    .nonempty("Connecting airports is required"),
  airlinesIncluded: z.array(z.string()),
  airlinesExcluded: z.array(z.string()),
  flightExcluded: z.string(),
  minConnectionTime: z.string(),
  maxConnectionTime: z.string(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  noteDescription: z.string(),
  priority: z.number().min(1, "Priority is required"),
  fareCodesExcluded: z.string(),
});

const Switch = ({
  checked,
  onCheckedChange,
}: {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}) => {
  const handleToggle = () => {
    const newState = !checked;
    if (onCheckedChange) {
      onCheckedChange(newState);
    }
  };

  return (
    <button
      className={`relative h-5 w-10 cursor-pointer rounded-full duration-200`}
      onClick={handleToggle}
      style={{
        backgroundColor: checked ? "#052E73" : "#24252d50",
      }}
      type="button"
    >
      <span
        className={cn(
          `absolute right-3 top-0 rounded-full bg-white shadow-lg transition-all duration-200`,
          checked
            ? "translate-x-full transform "
            : "translate-x-0 transform left-0",
          "size-3 m-1"
        )}
      />
    </button>
  );
};

export default function SearchManagementTable() {
  const dispatch = useDispatch<AppDispatch>();
  const searchRules = useSelector(
    (state: RootState) => state.searchManagement.entries
  );
  const [loading, setLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageSize, setPageSize] = useState(50);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ruleType: "CREATE_COMBINATION",
      gdsNdcSupplier: "AMADEUS",
      journeyType: "ONEWAY",
      fromOriginAirport: "",
      toDestinationsAirport: "",
      connectingAirports: [[]],
      airlinesIncluded: [],
      airlinesExcluded: [],
      flightExcluded: "",
      minConnectionTime: "",
      maxConnectionTime: "",
      status: "ACTIVE",
      noteDescription: "",
      priority: 1,
      fareCodesExcluded: "",
    },
  });

  useEffect(() => {
    dispatch(getSearchManagement());
  }, [dispatch]);

  const columns: ColumnDef<SearchManagement>[] = [
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
    { accessorKey: "ruleTitle", header: "Rule Title" },
    { accessorKey: "gdsNdcSupplier", header: "Supplier" },
    { accessorKey: "ruleType", header: "Rule Type" },
    { accessorKey: "journeyType", header: "Journey Type" },
    { accessorKey: "fromOriginAirport", header: "Origin" },
    { accessorKey: "toDestinationsAirport", header: "Destination" },
    { accessorKey: "connectingAirports", header: "Connections" },
    { accessorKey: "airlinesIncluded", header: "Airlines Included" },
    { accessorKey: "airlinesExcluded", header: "Airlines Excluded" },
    { accessorKey: "flightExcluded", header: "Flight #s Excluded" },
    { accessorKey: "minConnectionTime", header: "Min Time" },
    { accessorKey: "maxConnectionTime", header: "Max Time" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Switch
          checked={row.original.status === "ACTIVE"}
          onCheckedChange={(checked) =>
            handleStatusChange(row.original.id, checked)
          }
        />
      ),
    },
    {
      accessorKey: "lastUpdate",
      header: "Last Update",
      cell: ({ row }) => format(new Date(row.original.lastUpdate), "Ppp"),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => handleEdit(row.original)}
            variant="ghost"
            size="sm"
            className="bg-green-400/30 hover:bg-green-400/40"
          >
            <Pencil className="h-4 w-4 text-green-600" />
          </Button>
          <Button
            onClick={() => handleDelete(row.original.id)}
            variant="ghost"
            size="sm"
            className="bg-red-400/30 hover:bg-red-400/40"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: searchRules,
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
    try {
      if (editingRuleId) {
        await dispatch(
          updateSearchManagement({
            id: editingRuleId,
            ...values,
            lastUpdate: new Date(),
          })
        );
        toast.success("Rule updated successfully");
        setEditingRuleId(null);
      } else {
        await dispatch(createSearchManagement(values));
        toast.success("Rule created successfully");
      }

      resetForm();

      dispatch(getSearchManagement());
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id: string, checked: boolean) {
    setLoading(true);
    try {
      const existingRule = searchRules.find((rule) => rule.id === id);
      if (existingRule) {
        const updatedRule = {
          ...existingRule,
          status: checked ? "ACTIVE" : "INACTIVE",
          lastUpdate: new Date(),
        };
        await dispatch(updateSearchManagement(updatedRule));
        toast.success("Status updated successfully");
        dispatch(getSearchManagement()); // Fetch updated data
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
    setLoading(false);
  }

  function handleEdit(rule: SearchManagement) {
    setLoading(true);
    setEditingRuleId(rule.id);
    form.reset({
      ruleTitle: rule.ruleTitle,
      gdsNdcSupplier: rule.gdsNdcSupplier as
        | "AMADEUS"
        | "KIUSYS"
        | "DUFFEL"
        | "ALL"
        | "NONE",
      ruleType: rule.ruleType as "CREATE_COMBINATION" | "COMING_SOON",
      journeyType: rule.journeyType as "ONEWAY" | "ROUNDTRIP" | "MULTIWAY",
      fromOriginAirport: rule.fromOriginAirport,
      toDestinationsAirport: rule.toDestinationsAirport,
      connectingAirports: rule.connectingAirports || [[]],
      airlinesIncluded: rule.airlinesIncluded,
      airlinesExcluded: rule.airlinesExcluded,
      flightExcluded: rule.flightExcluded,
      minConnectionTime: rule.minConnectionTime,
      maxConnectionTime: rule.maxConnectionTime,
      status: rule.status as "ACTIVE" | "INACTIVE", // Ensure this line is present
      noteDescription: rule.noteDescription,
      priority: rule.priority,
      fareCodesExcluded: rule.fareCodesExcluded,
    });
    setLoading(false);
  }

  function handleCancelEdit() {
    setEditingRuleId(null);
    form.reset();
  }

  async function handleDelete(id: string) {
    setLoading(true);
    try {
      await dispatch(deleteSearchManagement(id));
      toast.success("Rule deleted successfully");
      dispatch(getSearchManagement());
    } catch (error) {
      toast.error("Failed to delete rule");
    }
    setLoading(false);
  }
  function resetForm() {
    form.reset({
      ruleTitle: "",
      gdsNdcSupplier: "AMADEUS",
      ruleType: "CREATE_COMBINATION",
      journeyType: "ONEWAY",
      fromOriginAirport: "",
      toDestinationsAirport: "",
      connectingAirports: [[]],
      airlinesIncluded: [],
      airlinesExcluded: [],
      flightExcluded: "",
      minConnectionTime: "",
      maxConnectionTime: "",
      status: "ACTIVE",
      noteDescription: "",
      priority: 1,
      fareCodesExcluded: "",
    });
  }

  return (
    <div className="w-full bg-white px-3 rounded-xl space-y-6 py-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="ruleTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rule Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Rule Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gdsNdcSupplier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GDS/NDC/Supplier</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="AMADEUS">Amadeus</SelectItem>
                      <SelectItem value="KIUSYS">Kiusys</SelectItem>
                      <SelectItem value="DUFFEL">Duffel</SelectItem>
                      <SelectItem value="ALL">All</SelectItem>
                      <SelectItem value="NONE">None</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ruleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rule Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select rule type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CREATE_COMBINATION">
                        Create Combination
                      </SelectItem>
                      <SelectItem value="COMING_SOON">Coming Soon</SelectItem>
                      {/* Add more options as needed */}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="journeyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Journey Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select journey type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ONEWAY">One Way</SelectItem>
                      <SelectItem value="ROUNDTRIP">Round Trip</SelectItem>
                      <SelectItem value="MULTIWAY">Multi City</SelectItem>
                      {/* Add more options as needed */}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fromOriginAirport"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From Origin Airport</FormLabel>
                  <FormControl>
                    <Input placeholder="From Origin Airport" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="toDestinationsAirport"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To Destinations Airport</FormLabel>
                  <FormControl>
                    <Input placeholder="To Destinations Airport" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" type="button" className="h-10 mt-7">
                  {form
                    .watch("connectingAirports")
                    ?.some((arr) => arr.length > 0)
                    ? "Edit Connecting Airports"
                    : "Add Connecting Airports"}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl min-h-[60vh]">
                <FormField
                  control={form.control}
                  name="connectingAirports"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Connecting Airport(s)</FormLabel>
                      <FormControl>
                        <ConnectingAirportsSelector field={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </DialogContent>
            </Dialog>
            <FormField
              control={form.control}
              name="airlinesIncluded"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Airlines Included (code)</FormLabel>
                  <FormControl>
                    <AirlinesMultiSelect field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="airlinesExcluded"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Airlines Excluded (code)</FormLabel>
                  <FormControl>
                    <AirlinesMultiSelect field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="flightExcluded"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Flight #s Excluded</FormLabel>
                  <FormControl>
                    <Input placeholder="Flight #s Excluded" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="minConnectionTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Min. Connection Time</FormLabel>

                  <FormControl>
                    <Input placeholder="Min Connection Time" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxConnectionTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max. Connection Time</FormLabel>

                  <FormControl>
                    <Input placeholder="Max Connection Time" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="noteDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note / Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Note / Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Priority" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fareCodesExcluded"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fare Codes Excluded</FormLabel>
                  <FormControl>
                    <Input placeholder="Fare Codes Excluded" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full flex items-center justify-end space-x-2">
            {editingRuleId && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  handleCancelEdit();
                  resetForm();
                }}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              className="bg-blue text-white"
              disabled={loading}
            >
              {editingRuleId ? "Update Rule" : "Create Rule"}
              {loading && <Loader className="size-5 animate-spin shrink-0" />}
            </Button>
          </div>
        </form>
      </Form>

      <div className="rounded-md border">
        <Table className="min-w-max">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="px-4">
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
                    <TableCell key={cell.id} className="px-4">
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
