


import  { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CirclePlus, Pencil, Trash2 } from "lucide-react";
import { useConfirm } from "@/hooks/use-confirm";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/provider/redux-provider";
import {
  fetchCommissions,
  addCommission,
  updateCommission,
  deleteCommission,
  addType,
  updateType,
  deleteType,
  CommissionType,
} from "@/redux/fees-commison";
import TableLoader from "../shared/table-loader";
import { format } from "date-fns";

const formSchema = z.object({
  type: z.string().min(1, "Type is required"),
  commissionTitle: z.string().min(1, "Commission title is required"),
  supplier: z.string().min(1, "Supplier is required"),
  commissionFees: z.string().min(1, "Commission/Fees is required"),
  feeType: z.enum(["PERCENT", "FIXED"]),
});

export default function FeesCommissionManagerTable() {
  const dispatch = useDispatch<AppDispatch>();
  const { commissions, types, status, error } = useSelector(
    (state: RootState) => state.feesCommission
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false);
  const [newType, setNewType] = useState("");
  const [editingType, setEditingType] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingCommission, setEditingCommission] = useState<CommissionType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [ConfirmDialogue, confirm] = useConfirm(
    "Delete Commission",
    "Are you sure you want to delete this commission? This action cannot be undone."
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      commissionTitle: "",
      supplier: "",
      commissionFees: "",
      feeType: "PERCENT" as "PERCENT" | "FIXED",
    },
  });

  useEffect(() => {
    dispatch(fetchCommissions());
  }, [dispatch]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (editingCommission) {
        await dispatch(updateCommission({ ...editingCommission, ...values })).unwrap();
        toast.success("Commission updated successfully");
      } else {
        await dispatch(addCommission(values)).unwrap();
        toast.success("Commission created successfully");
      }
      setIsDialogOpen(false);
      setEditingCommission(null);
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    }
  };

  const handleAddType = () => {
    if (newType && !types.includes(newType)) {
      dispatch(addType(newType));
      setNewType("");
      setIsTypeDialogOpen(false);
    }
  };

  const handleUpdateType = () => {
    if (editingType && newType && !types.includes(newType)) {
      dispatch(updateType({ oldType: editingType, newType }));
      setNewType("");
      setEditingType(null);
      setIsTypeDialogOpen(false);
    }
  };

  const handleDeleteType = (typeToDelete: string) => {
    dispatch(deleteType(typeToDelete));
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm();
    if (ok) {
      try {
        await dispatch(deleteCommission(id)).unwrap();
        toast.success("Commission deleted successfully");
      } catch (error: any) {
        toast.error(error.message || "An error occurred while deleting");
      }
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
    );
  };

  const isSelected = (id: string) => selectedIds.includes(id);

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedCommissions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedCommissions.map((commission) => commission.id));
    }
  };

  const handleEdit = (commission: CommissionType) => {
    setEditingCommission(commission);
    form.reset(commission);
    setIsDialogOpen(true);
  };

  const totalPages = Math.ceil((commissions?.length ?? 0) / pageSize);
  const paginatedCommissions = (commissions ?? []).slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  
  if (status === "loading") {
    return <TableLoader />;
  }

  // if (status === "failed") {
  //   return <div>Error: {error}</div>;
  // }

  return (
    <>
      <ConfirmDialogue />
      <div className="w-full bg-white px-3 rounded-lg space-y-6 py-5">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-blue">Manage Commission</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingCommission(null);
                  form.reset({
                    type: "",
                    commissionTitle: "",
                    supplier: "",
                    commissionFees: "",
                    feeType: "PERCENT",
                  });
                  setIsDialogOpen(true);
                }}
              >
                <CirclePlus size={16} className="mr-2 fill-white text-blue" />
                Add Fees & Commission
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingCommission ? "Edit" : "Add"} Fees & Commission
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <div className="flex items-center space-x-2">
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {types.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            type="button"
                            onClick={() => setIsTypeDialogOpen(true)}
                          >
                            Manage Types
                          </Button>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="commissionTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Commission Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter title" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="supplier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supplier</FormLabel>
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
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="commissionFees"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Commission/Fees</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="feeType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fee Type</FormLabel>
                        <div className="flex space-x-4">
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              {...field}
                              value="PERCENT"
                              checked={field.value === "PERCENT"}
                              onChange={() => field.onChange("PERCENT")}
                            />
                            <span>Percentage</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              {...field}
                              value="FIXED"
                              checked={field.value === "FIXED"}
                              onChange={() => field.onChange("FIXED")}
                            />
                            <span>Fixed</span>
                          </label>
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button  type="submit">
                      {editingCommission ? "Update" : "Create"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Dialog open={isTypeDialogOpen} onOpenChange={setIsTypeDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Manage Types</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="New type name"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="flex-grow"
                />
                <Button onClick={editingType ? handleUpdateType : handleAddType}>
                  {editingType ? "Update Type" : "Add Type"}
                </Button>
              </div>
              <div className="space-y-2">
                {types.map((type) => (
                  <div key={type} className="flex items-center justify-between">
                    <span>{type}</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setEditingType(type);
                          setNewType(type);
                        }}
                        className="bg-green-200/50"
                      >
                        <Pencil size={16} className="text-gray-500 cursor-pointer text-[#1AB69D]" />
                      </Button>
                      <Button
                        className="bg-red-200/50"
                        variant="ghost"
                        onClick={() => handleDeleteType(type)}
                      >
                        <Trash2 size={16} className="text-gray-500 cursor-pointer text-[#EB3D4D]" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Table>
          <TableHeader className="bg-[#EFEFFF]">
            <TableRow>
              <TableHead>
                <input
                  type="checkbox"
                  checked={selectedIds.length === paginatedCommissions.length}
                  onChange={toggleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Commission Title</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Commission/Fees</TableHead>
              <TableHead>Fee Type</TableHead>
              <TableHead>Last Update</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {status === "loading" ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                </TableCell>
              </TableRow>
            ) : status === "failed" ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-red-500 py-4">
                  Error: {error || "Failed to load data"}
                </TableCell>
              </TableRow>
            ) : paginatedCommissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No commissions found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedCommissions.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={isSelected(fee.id)}
                      onChange={() => toggleSelectRow(fee.id)}
                      aria-label="Select row"
                    />
                  </TableCell>
                  <TableCell>{fee.type}</TableCell>
                  <TableCell>{fee.commissionTitle}</TableCell>
                  <TableCell>{fee.supplier}</TableCell>
                  <TableCell>
                    {fee.commissionFees} {fee.feeType === "PERCENT" ? "%" : "$"}
                  </TableCell>
                  <TableCell>
                    {fee.feeType === "PERCENT" ? "Percentage" : "Fixed Amount"}
                  </TableCell>
                  <TableCell>
                    {format(fee.updateTime, "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-4">
                      <div className="size-7 rounded-md bg-green-200/50 flex items-center justify-center">
                        <Pencil
                          size={16}
                          className="text-gray-500 cursor-pointer text-[#1AB69D]"
                          onClick={() => handleEdit(fee)}
                        />
                      </div>
                      <div className="size-7 rounded-md bg-red-200/50 flex items-center justify-center">
                        <Trash2
                          size={16}
                          className="text-gray-500 cursor-pointer text-[#EB3D4D]"
                          onClick={() => handleDelete(fee.id)}
                        />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between mt-4">
          <div>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => setPageSize(Number(value))}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue />
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
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="px-2 py-1 border rounded bg-transparent text-black"
            >
              Previous
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                onClick={() => setCurrentPage(page)}
                variant={currentPage === page ? "default" : "outline"}
              >
                {page}
              </Button>
            ))}
            <Button
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={currentPage === totalPages}
              className="px-2 py-1 border rounded bg-transparent text-black"
            >
              Next
            </Button>
          </div>
        </div>
      
      </div>
    </>
  );
}