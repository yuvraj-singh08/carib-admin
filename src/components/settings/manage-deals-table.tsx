import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CirclePlus, Eye, Pencil, Trash2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Separator } from "../ui/separator";

// Define the schema for the coupon form
const couponFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  image: z.string(),
  description: z.string().optional(),
  discount: z.number().min(0).optional(),
  discountType: z.enum(["percentage", "fixed"]),
  limit: z.number().int().min(0),
  code: z.string().min(1, "Coupon code is required"),
  way: z.string(),
  origin: z.string().optional(),
  destination: z.string().optional(),
  airlineCode: z.string().optional(),
  flightCode: z.string().optional(),
  expiryDate: z.date(),
  status: z.enum(["active", "inactive"]).default("active"), // Added status field
});

type Coupon = z.infer<typeof couponFormSchema> & {
  id: number;
  userLimit: number;
  used: number;
};
const initialCoupons: Coupon[] = [
  {
    id: 1,
    title: "Spring Sale",
    description: "Get 20% off your next purchase",
    code: "SPRING20",
    discountType: "percentage",
    discount: 20,
    limit: 100,
    used: 50,
    expiryDate: new Date("2024-09-30"),
    status: "active",
    userLimit: 100,
    image: "https://via.placeholder.com/150",
    way: "One way",
  },
];

const CouponManagementSystemTable = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [checkedRows, setCheckedRows] = useState<boolean[]>(
    Array(coupons.length).fill(false)
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const form = useForm<z.infer<typeof couponFormSchema>>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      title: "",
      description: "",
      discount: 0,
      discountType: "percentage",
      limit: 0,
      code: "",
      way: "One way",
      origin: "",
      destination: "",
      airlineCode: "",
      flightCode: "",
      expiryDate: new Date(),
      status: "active",
    },
  });

  const totalPages = Math.ceil(coupons.length / pageSize);
  const paginatedCoupons = coupons.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const onSubmit: SubmitHandler<z.infer<typeof couponFormSchema>> = (
    values
  ) => {
    if (editingCoupon) {
      setCoupons(
        coupons.map((coupon) =>
          coupon.id === editingCoupon.id ? { ...coupon, ...values } : coupon
        )
      );
    } else {
      setCoupons([
        ...coupons,
        { id: Date.now(), ...values, used: 0, userLimit: values.limit },
      ]);
    }
    setIsDialogOpen(false);
    setEditingCoupon(null);
    form.reset();
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    form.reset({
      ...coupon,
      expiryDate: new Date(coupon.expiryDate),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setCoupons(coupons.filter((coupon) => coupon.id !== id));
  };

  const handleView = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  const handleHeaderCheckboxChange = (checked: boolean) => {
    setCheckedRows(checkedRows.map(() => checked));
  };

  const handleRowCheckboxChange = (index: number) => {
    const newCheckedRows = [...checkedRows];
    newCheckedRows[index] = !newCheckedRows[index];
    setCheckedRows(newCheckedRows);
  };

  const isAllChecked = checkedRows.every((checked) => checked);

  return (
    <div className="p-4 bg-white rounded-xl">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Special Deals</h1>
        <Button
          onClick={() => {
            setEditingCoupon(null);
            form.reset({
              title: "",
              description: "",
              discount: 0,
              discountType: "percentage",
              limit: 0,
              code: "",
              way: "One way",
              origin: "",
              destination: "",
              airlineCode: "",
              flightCode: "",
              expiryDate: new Date(),
              status: "active",
            });
            setIsDialogOpen(true);
          }}
        >
          {" "}
          <CirclePlus size={16} className="mr-2 fill-white text-blue" />
          Add Special Deal
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <input
                type="checkbox"
                checked={isAllChecked}
                onChange={(e) => handleHeaderCheckboxChange(e.target.checked)}
              />
            </TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>User Limit</TableHead>
            <TableHead>Used</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedCoupons.map((coupon, index) => (
            <TableRow key={coupon.id}>
              <TableCell>
                <input
                  type="checkbox"
                  checked={checkedRows[index] || false}
                  onChange={() => handleRowCheckboxChange(index)}
                />
              </TableCell>
              <TableCell>{coupon.title}</TableCell>
              <TableCell className="text-customBlue">{coupon.code}</TableCell>
              <TableCell>{coupon.userLimit}</TableCell>
              <TableCell>{coupon.used}</TableCell>
              <TableCell>{format(coupon.expiryDate, "dd-MM-yyyy")}</TableCell>
              <TableCell>
                <span
                  className={`inline-block w-2 h-2 rounded-full mr-2 ${
                    coupon.status === "active" ? "bg-green-500" : "bg-red-500"
                  }`}
                ></span>
                {coupon.status}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" onClick={() => handleView(coupon)}>
                    <Eye size={16} className="text-blue-500" />
                  </Button>
                  <Button variant="ghost" onClick={() => handleEdit(coupon)}>
                    <Pencil size={16} className="text-green-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleDelete(coupon.id)}
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
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
            className="px-2 py-1 border rounded bg-transparent hover:text-white text-black"
          >
            Next
          </Button>
        </div>
      </div>

      {/* Create / Edit Coupon Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[800px] max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-blue">
              {editingCoupon ? "Edit" : "Create"} Coupon
            </DialogTitle>
            <Separator />
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full flex flex-col gap-4"
            >
              {/* Title Field */}
              <div className="flex items-start gap-4 w-full">
                <div className="flex flex-col gap-3">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Coupon Title" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Code Field */}
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Coupon Code</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Coupon Code" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Discount Type Field */}
                  <div className="flex space-x-4">
                    <FormField
                      control={form.control}
                      name="discount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter discount"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="discountType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select discount type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="percentage">
                                Percentage
                              </SelectItem>
                              <SelectItem value="fixed">Fixed</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Limit Field */}
                  <FormField
                    control={form.control}
                    name="limit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>User Limit</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="User Limit"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Expiry Date Field */}
                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date</FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={`w-full justify-start ${
                                  field.value ? "" : "text-muted-foreground"
                                }`}
                              >
                                {field.value
                                  ? format(field.value, "PPP")
                                  : "Pick a date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date()
                                } /* Optional to disable past dates */
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Status Field */}
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Coupon Description" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {/* Way */}
                  <FormField
                    control={form.control}
                    name="way"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Way</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter way" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Origin */}
                  <FormField
                    control={form.control}
                    name="origin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Origin</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter origin" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Airline Code */}
                  <FormField
                    control={form.control}
                    name="airlineCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Airline Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter airline code" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Flight Code */}
                  <FormField
                    control={form.control}
                    name="flightCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Flight Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter flight code" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                // Handle file upload logic here
                                // For now, we'll just set the filename
                                field.onChange(file.name);
                              }
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full">
                {editingCoupon ? "Update" : "Create"} Coupon
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Coupon View Dialog */}
      {selectedCoupon && (
        <Dialog
          open={Boolean(selectedCoupon)}
          onOpenChange={() => setSelectedCoupon(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Coupon Details</DialogTitle>
            </DialogHeader>
            <div>
              <p>
                <strong>Title:</strong> {selectedCoupon.title}
              </p>
              <p>
                <strong>Code:</strong> {selectedCoupon.code}
              </p>
              <p>
                <strong>User Limit:</strong> {selectedCoupon.userLimit}
              </p>
              <p>
                <strong>Used:</strong> {selectedCoupon.used}
              </p>
              <p>
                <strong>Expiry Date:</strong>{" "}
                {format(selectedCoupon.expiryDate, "PPP")}
              </p>
              <p>
                <strong>Status:</strong> {selectedCoupon.status}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CouponManagementSystemTable;
