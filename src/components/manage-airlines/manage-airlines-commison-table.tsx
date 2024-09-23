import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
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

const formSchema = z.object({
  type: z.string().min(1, "Type is required"),
  commissionTitle: z.string().min(1, "Commission title is required"),
  supplier: z.string().min(1, "Supplier is required"),
  commissionFees: z.string().min(1, "Commission/Fees is required"),
  feeType: z.enum(["percent", "fixed"]),
});

const initialTypes = ["Airline", "Hotel", "Car Rental"];

const defaultFees = [
  {
    id: 1,
    type: "Airline",
    commissionTitle: "Standard Flight Commission",
    supplier: "Amadeus",
    commissionFees: "10",
    feeType: "percent",
    lastUpdate: new Date().toISOString(),
  },
  {
    id: 2,
    type: "Hotel",
    commissionTitle: "Luxury Hotel Booking Fee",
    supplier: "Kiusys",
    commissionFees: "25",
    feeType: "fixed",
    lastUpdate: new Date().toISOString(),
  },
  {
    id: 3,
    type: "Car Rental",
    commissionTitle: "Economy Car Commission",
    supplier: "Duffel",
    commissionFees: "5",
    feeType: "percent",
    lastUpdate: new Date().toISOString(),
  },
];

export default function FeesCommissionManagerTable() {
  const [fees, setFees] = useState(defaultFees);
  const [types, setTypes] = useState(initialTypes);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false);
  const [newType, setNewType] = useState("");
  const [editingType, setEditingType] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [editingFee, setEditingFee] = useState<any>(null);
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
      feeType: "percent",
    },
  });

  const onSubmit = (values: any) => {
    if (editingFee) {
      setFees(
        fees.map((fee) =>
          fee.id === editingFee.id
            ? { ...fee, ...values, lastUpdate: new Date().toISOString() }
            : fee
        )
      );
    } else {
      setFees([
        ...fees,
        { id: Date.now(), ...values, lastUpdate: new Date().toISOString() },
      ]);
    }
    setIsDialogOpen(false);
    setEditingFee(null);
    form.reset();
  };

  const addType = () => {
    if (newType && !types.includes(newType)) {
      setTypes([...types, newType]);
      setNewType("");
      setIsTypeDialogOpen(false);
    }
  };

  const updateType = () => {
    if (editingType && newType && !types.includes(newType)) {
      setTypes(types.map((type) => (type === editingType ? newType : type)));
      setNewType("");
      setEditingType(null);
      setIsTypeDialogOpen(false);
    }
  };

  const deleteType = (typeToDelete: string) => {
    setTypes(types.filter((type) => type !== typeToDelete));
  };

  const handleDelete = async (id: number) => {
    const ok = await confirm();
    if (ok) {
      setFees(fees.filter((fee) => fee.id !== id));
    }
  };

  const toggleSelectRow = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  const isSelected = (id: number) => selectedIds.includes(id);

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedFees.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedFees.map((fee) => fee.id));
    }
  };

  const handleEdit = (fee: any) => {
    setEditingFee(fee);
    form.reset(fee);
    setIsDialogOpen(true);
  };

  const totalPages = Math.ceil(fees.length / pageSize);
  const paginatedFees = fees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <>
      <ConfirmDialogue />
      <div className="w-full bg-white px-3 rounded-lg space-y-6 py-5">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-blue">
            Manage Commission
          </h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingFee(null);
                  form.reset({
                    type: "",
                    commissionTitle: "",
                    supplier: "",
                    commissionFees: "",
                    feeType: "percent",
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
                  {editingFee ? "Edit" : "Add"} Fees & Commission
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
                            <SelectItem value="amadeus">Amadeus</SelectItem>
                            <SelectItem value="kiusys">Kiusys</SelectItem>
                            <SelectItem value="duffel">Duffel</SelectItem>
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
                              value="percent"
                              checked={field.value === "percent"}
                            />
                            <span>%</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              {...field}
                              value="fixed"
                              checked={field.value === "fixed"}
                            />
                            <span>$</span>
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
                    <Button type="submit">
                      {editingFee ? "Update" : "Apply"}
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
                <Button onClick={editingType ? updateType : addType}>
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
                        <Pencil
                          size={16}
                          className="text-gray-500 cursor-pointer text-[#1AB69D]"
                        />
                      </Button>
                      <Button
                        className="bg-red-200/50"
                        variant="ghost"
                        onClick={() => deleteType(type)}
                      >
                        <Trash2
                          size={16}
                          className="text-gray-500 cursor-pointer text-[#EB3D4D]"
                        />
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
                  checked={selectedIds.length === paginatedFees.length}
                  onChange={toggleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Commission Title</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Commission/Fees</TableHead>
              <TableHead>Last Update</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedFees.map((fee) => (
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
                  {fee.commissionFees} {fee.feeType === "percent" ? "%" : "$"}
                </TableCell>
                <TableCell>
                  {format(new Date(fee.lastUpdate), "dd-MM-yyyy")}
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
            ))}
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
