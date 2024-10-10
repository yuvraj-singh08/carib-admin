import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  FormMessage,
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
import { CirclePlus, Eye, Pencil, Search, Trash2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Separator } from "../ui/separator";
import { CoupnViewDialog } from "./coupon-view-dialog";
import { useConfirm } from "@/hooks/use-confirm";
import { HiOutlineRefresh } from "react-icons/hi";
import { generateRandomCouponCode } from "@/lib/utils";
import {
  createDeal,
  updateDeal,
  deleteDeal,
  getDeals,
  Deal,
} from "@/redux/deals";
import { AppDispatch, RootState } from "@/provider/redux-provider";
import { uploadImage } from "@/hooks/aws";
import toast from "react-hot-toast";
import TableLoader from "../shared/table-loader";

const dealFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  way: z.string(),
  code: z.string().min(1, "Code is required"),
  origin: z.string().nullable(),
  discount: z.string().min(0, "Discount is required"),
  discountType: z.string(),
  airlineCode: z.string().nullable(),
  userLimit: z.number().int().positive(),
  flightCode: z.string().nullable(),
  expiryDate: z.date(),
  description: z.string(),
});

const CouponManagementSystemTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const deals = useSelector((state: RootState) => state.deals.deals);
  const status = useSelector((state: RootState) => state.deals.status);
  // const error = useSelector((state: RootState) => state.deals.error);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | undefined>();
  const used = 0;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const [ConfirmDialogue, confirm] = useConfirm(
    "Delete Deal",
    "Are you sure you want to delete this deal? This action cannot be undone."
  );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const img = e.target.files?.[0];

    if (!img) {
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (img.size > maxSize) {
      toast.error("Image size exceeds the maximum limit of 5MB.");
      return;
    }

    setLoading(true);

    toast.loading("Uploading image...");

    try {
      const url = await uploadImage(img);
      if (url) {
        setImage(url);
        toast.dismiss();
        toast.success("Image uploaded successfully!");
      } else {
        throw new Error("Image upload failed");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(getDeals());
  }, [dispatch]);

  const handleGenerateCode = () => {
    const newCode = generateRandomCouponCode();
    form.setValue("code", newCode);
  };

  const form = useForm<z.infer<typeof dealFormSchema>>({
    resolver: zodResolver(dealFormSchema),
    defaultValues: {
      title: "",
      way: "One way",
      code: "",
      origin: "",
      discount: "",
      discountType: "percentage",
      airlineCode: "",
      userLimit: 0,
      flightCode: "",
      expiryDate: new Date(),
      description: "",
    },
  });

  const totalPages = Math.ceil(deals.length / pageSize);
  const paginatedDeals = deals.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const onSubmit: SubmitHandler<z.infer<typeof dealFormSchema>> = (values) => {
    if (editingDeal) {
      dispatch(
        updateDeal({
          ...editingDeal,
          ...values,
          imageUrl: image || editingDeal.imageUrl,
        })
      );
    } else {
      dispatch(createDeal({ ...values, imageUrl: image || "", used: used }));
    }
    setIsDialogOpen(false);
    setEditingDeal(null);
    form.reset();
    setImage(undefined);
  };

  const handleEdit = (deal: Deal) => {
    setEditingDeal(deal);
    form.reset({
      ...deal,
      expiryDate: new Date(deal.expiryDate),
    });
    setImage(deal.imageUrl);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm();
    if (ok) {
      dispatch(deleteDeal(id));
    }
  };

  const handleView = (deal: Deal) => {
    setSelectedDeal(deal);
  };

  if (status === "loading") {
    return <TableLoader />;
  }


  return (
    <>
      <ConfirmDialogue />
      <div className="p-4 bg-white rounded-xl">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold text-blue">Special Deals</h1>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                setEditingDeal(null);
                form.reset({
                  title: "",
                  way: "oneway",
                  code: "",
                  origin: null,
                  discount: "",
                  discountType: "percentage",
                  airlineCode: null,
                  userLimit: 0,
                  flightCode: null,
                  expiryDate: new Date(),
                  description: "",
                });
                setIsDialogOpen(true);
              }}
            >
              <CirclePlus size={16} className="mr-2 fill-white text-blue" />
              Add Special Deal
            </Button>
            <div className="relative hidden md:block">
              <Input
                placeholder="Search..."
                className="w-[180px] rounded-xl h-10 pl-9"
              />
              <Search className="size-5 shrink-0 text-gray absolute top-2.5 left-2" />
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>User Limit</TableHead>
              <TableHead>Used</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead className="flex items-center justify-center">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedDeals.map((deal: Deal) => (
              <TableRow key={deal.id}>
                <TableCell>{deal.title}</TableCell>
                <TableCell className="text-customBlue">{deal.code}</TableCell>
                <TableCell>{deal.userLimit}</TableCell>
                <TableCell>{deal.used}</TableCell>
                <TableCell>
                  {format(new Date(deal.expiryDate), "dd-MM-yyyy")}
                </TableCell>
                <TableCell className="flex items-center justify-center">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      className="bg-orange-400/20 hover:bg-orange-400/40"
                      onClick={() => handleView(deal)}
                    >
                      <Eye size={16} className="text-orange-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      className="bg-green-400/20 hover:bg-green-400/40"
                      onClick={() => handleEdit(deal)}
                    >
                      <Pencil size={16} className="text-green-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => handleDelete(deal.id)}
                      className="bg-red-400/20 hover:bg-red-400/40"
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

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>
                {editingDeal ? "Edit" : "Create"} Coupon
              </DialogTitle>
              <Separator />
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col items-start gap-3"
              >
                <div className="w-full flex items-start gap-3">
                  <div className="w-1/2 flex flex-col gap-3">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter coupon title"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="way"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Way</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select way" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="oneway">One way</SelectItem>
                              <SelectItem value="roundtrip">
                                Round trip
                              </SelectItem>
                              <SelectItem value="multicity">
                                Multi city
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Coupon Code</FormLabel>
                          <div className="flex">
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter coupon code"
                              />
                            </FormControl>
                            <Button
                              type="button"
                              onClick={handleGenerateCode}
                              className="ml-2"
                              disabled={loading}
                            >
                              <HiOutlineRefresh className="h-4 w-4" />
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="origin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Origin</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value ?? ""}
                              placeholder="Enter origin"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex space-x-4">
                      <FormField
                        control={form.control}
                        name="discount"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Discount</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                placeholder="Enter discount"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="discountType"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Discount Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="percentage">
                                  Percentage
                                </SelectItem>
                                <SelectItem value="fixed">Fixed</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="w-1/2 flex flex-col gap-3">
                    <FormField
                      control={form.control}
                      name="airlineCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Airline Code</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value ?? ""}
                              placeholder="Enter airline code"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="userLimit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>User Limit</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              placeholder="Enter user limit"
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value, 10))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="flightCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Flight Code</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value ?? ""}
                              placeholder="Enter flight code"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="expiryDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Expiry Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button variant="outline">
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={
                                  field.value
                                    ? new Date(field.value)
                                    : undefined
                                }
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter description" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div>
                      <FormLabel>Image</FormLabel>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={loading}>
                  {editingDeal ? "Update" : "Create"} Coupon
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {selectedDeal && (
          <CoupnViewDialog
            selectedCoupon={selectedDeal}
            setSelectedCoupon={setSelectedDeal}
          />
        )}
      </div>
    </>
  );
};

export default CouponManagementSystemTable;
