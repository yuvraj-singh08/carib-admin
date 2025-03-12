import React, { useState } from "react";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {  Pencil, Trash2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  // SelectOption,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

import { Save, Search } from "lucide-react";
import { InputTags } from "../ui/multitagInput";
import PermissionButtonGroup from "../permissions/PermissionButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@radix-ui/react-select";
import { useForm } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import { useConfirm } from "@/hooks/use-confirm";

type Fare = {
  id: number;
  fareClass: string;
  airlines: string;
  checkedBagsIncluded: number;
  refundableStatus: string;
  changeableStatus: string;
  lastUpdateTime: string;
};

const FareTable = () => {
  const dummyFares: Fare[] = [
    {
      id: 1,
      fareClass: "Economy",
      airlines: "American Airlines",
      checkedBagsIncluded: 1,
      refundableStatus: "No",
      changeableStatus: "No",
      lastUpdateTime: "2025-03-11T12:30:00Z",
    },
    {
      id: 2,
      fareClass: "Business",
      airlines: "Delta Airlines",
      checkedBagsIncluded: 2,
      refundableStatus: "Yes",
      changeableStatus: "Yes",
      lastUpdateTime: "2025-03-10T15:45:00Z",
    },
    {
      id: 3,
      fareClass: "First Class",
      airlines: "United Airlines",
      checkedBagsIncluded: 3,
      refundableStatus: "Yes",
      changeableStatus: "Yes",
      lastUpdateTime: "2025-03-09T10:15:00Z",
    },
    {
      id: 4,
      fareClass: "Economy",
      airlines: "American Airlines",
      checkedBagsIncluded: 1,
      refundableStatus: "No",
      changeableStatus: "No",
      lastUpdateTime: "2025-03-11T12:30:00Z",
    },
    {
      id: 5,
      fareClass: "Business",
      airlines: "Delta Airlines",
      checkedBagsIncluded: 2,
      refundableStatus: "Yes",
      changeableStatus: "Yes",
      lastUpdateTime: "2025-03-10T15:45:00Z",
    },
    {
      id: 6,
      fareClass: "First Class",
      airlines: "United Airlines",
      checkedBagsIncluded: 3,
      refundableStatus: "Yes",
      changeableStatus: "Yes",
      lastUpdateTime: "2025-03-09T10:15:00Z",
    },

    {
      id: 7,
      fareClass: "Economy",
      airlines: "American Airlines",
      checkedBagsIncluded: 1,
      refundableStatus: "No",
      changeableStatus: "No",
      lastUpdateTime: "2025-03-11T12:30:00Z",
    },
    {
      id: 8,
      fareClass: "Business",
      airlines: "Delta Airlines",
      checkedBagsIncluded: 2,
      refundableStatus: "Yes",
      changeableStatus: "Yes",
      lastUpdateTime: "2025-03-10T15:45:00Z",
    },
    {
      id: 9,
      fareClass: "First Class",
      airlines: "United Airlines",
      checkedBagsIncluded: 3,
      refundableStatus: "Yes",
      changeableStatus: "Yes",
      lastUpdateTime: "2025-03-09T10:15:00Z",
    },
    {
      id: 10,
      fareClass: "Economy",
      airlines: "American Airlines",
      checkedBagsIncluded: 1,
      refundableStatus: "No",
      changeableStatus: "No",
      lastUpdateTime: "2025-03-11T12:30:00Z",
    },
    {
      id: 11,
      fareClass: "Business",
      airlines: "Delta Airlines",
      checkedBagsIncluded: 2,
      refundableStatus: "Yes",
      changeableStatus: "Yes",
      lastUpdateTime: "2025-03-10T15:45:00Z",
    },
    {
      id: 12,
      fareClass: "First Class",
      airlines: "United Airlines",
      checkedBagsIncluded: 3,
      refundableStatus: "Yes",
      changeableStatus: "Yes",
      lastUpdateTime: "2025-03-09T10:15:00Z",
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [ConfirmDialogue, confirm] = useConfirm(
      "Delete Fare Rule",
      "Are you sure you want to delete this fare rule? This action cannot be undone."
    );
  //   const [sortConfig, setSortConfig] = useState<{
  //     key: keyof (typeof dummyFares)[0] | null;
  //     direction: "asc" | "desc";
  //   }>({ key: null, direction: "asc" });

  // const [newEntry, setNewEntry] = useState({
  //   fareClass: "",
  //   airline: "",
  //   checkedBags: "",
  //   refundable: "",
  //   changeable: "",
  // });

  const [newEntry, setNewEntry] = useState({
    fareClass: [], // Array to store multiple fare classes
    airline: [], // Array to store multiple airlines
    checkedBags: "",
    refundable: "",
    changeable: "",
  });
  const form = useForm({
    defaultValues: {
      airline: [],
      fareClass: [],
      refundable: "",
      changeable: "",
    },
  });

  // Handle input change for other fields
  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewEntry((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    console.log("Saving new entry:", newEntry);
    setNewEntry({
      fareClass: [],
      airline: [],
      checkedBags: "",
      refundable: "",
      changeable: "",
    });
  };

  // Filter data based on search term
  const filteredData = dummyFares.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

 

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);


  const handleEdit = (id:number) => {
    const selectedFare = dummyFares.find((fare) => fare.id === id);
    if (selectedFare) {
      form.reset({
        airline: [], // Convert to array for InputTags
        fareClass: [], // Convert to array for InputTags
        refundable: selectedFare.refundableStatus,
        changeable: selectedFare.changeableStatus,
      });
      // setEditingDeal(true);
      setIsDialogOpen(true);
    }
  };

  const handleDelete = async (id: number) => {
    console.log("Delete deal", id);
     await confirm();
  };

  


  const onSubmit = async (data: any) => {
    try {
      console.log("Form Data Submitted:", data);

      // API request logic (modify as needed)
      const response = await fetch("/api/coupons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save coupon");
      }

      const result = await response.json();
      console.log("Coupon Saved:", result);

      // Close the dialog and reset the form
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error saving coupon:", error);
    }
  };

  console.log("pageSize", pageSize);
  console.log("totalPages", totalPages);

  return (
    <>
    <ConfirmDialogue />
      <div className="p-4 bg-white rounded-xl">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold text-blue">Fare Settings</h1>
        </div>

       

        <div className="border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Fare Class */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Airlines
              </label>

              <InputTags
                value={newEntry.airline}
                onChange={(newValues: any) => {
                  setNewEntry((prev) => ({
                    ...prev,
                    airline: newValues,
                  }));
                }}
              />
            </div>

            {/* Airline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fare Rules
              </label>

              <InputTags
                value={newEntry.fareClass}
                onChange={(newValues: any) => {
                  setNewEntry((prev) => ({
                    ...prev,
                    fareClass: newValues,
                  }));
                }}
              />
            </div>

            {/* Checked Bags */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Checked Bags
              </label>
              <textarea
                name="checkedBags"
                value={newEntry.checkedBags}
                onChange={handleInputChange}
                className="w-full placeholder:text-sm min-h-10 max-h-[5rem]   px-3 py-2 h-10 no-scrollbar border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter bags included"
              />
            </div> */}

            {/* Refundable Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Refundable Status
              </label>
              <textarea
                name="refundable"
                value={newEntry.refundable}
                onChange={handleInputChange}
                className="w-full placeholder:text-[0.8rem] min-h-10 max-h-[5rem]   px-3 py-2 h-10 no-scrollbar border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter Refundable Status"
              />
            </div>

            {/* Changeable Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Changeable Status
              </label>
              <textarea
                name="changeable"
                value={newEntry.changeable}
                onChange={handleInputChange}
                className="w-full placeholder:text-[0.8rem] min-h-10 max-h-[5rem]   px-3 py-2 h-10 no-scrollbar border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter Changeable Status"
              />
            </div>
          </div>

          <div className="w-full mb-3 flex justify-between mt-4">
            <div className="flex border rounded items-center gap-2">
              <div className="relative hidden md:block">
                <input
                  placeholder="Search..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-[180px] rounded h-10 pl-9"
                />
                <span className="size-5 shrink-0 text-gray absolute top-2.5 left-2">
                  <Search />
                </span>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="flex items-center py-2 px-2 bg-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fare Class</TableHead>
              <TableHead>Airlines</TableHead>
              <TableHead>Checked Bags Included</TableHead>
              <TableHead>Refundable Status</TableHead>
              <TableHead>Changeable Status</TableHead>
              <TableHead>Last Update Time</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((fare) => (
              <TableRow className="h-[3.5rem]" key={fare.id}>
                <TableCell>{fare.fareClass}</TableCell>
                <TableCell>{fare.airlines}</TableCell>
                <TableCell className="flex w-full h-[3.5rem] justify-center items-center ">
                  {fare.checkedBagsIncluded}
                </TableCell>
                <TableCell>{fare.refundableStatus}</TableCell>
                <TableCell>{fare.changeableStatus}</TableCell>
                <TableCell>
                  {format(new Date(fare.lastUpdateTime), "dd-MM-yyyy HH:mm:ss")}
                </TableCell>
                <TableCell className="flex items-center justify-center">
                  <div className="flex items-center space-x-2">
                   
                    <PermissionButtonGroup resource="settings" action="update">
                      <Button
                        variant="ghost"
                        className="bg-green-400/20 hover:bg-green-400/40"
                        onClick={() => handleEdit(fare.id)}
                      >
                        <Pencil size={16} className="text-green-500" />
                      </Button>
                    </PermissionButtonGroup>
                    <PermissionButtonGroup resource="settings" action="delete">
                      <Button
                        variant="ghost"
                        onClick={() => handleDelete(fare.id)}
                        className="bg-red-400/20 hover:bg-red-400/40"
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </Button>
                    </PermissionButtonGroup>
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

        <Dialog  open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Edit Fare Rules</DialogTitle>
              <Separator />
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col items-start gap-3"
              >
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Airlines */}
                  <FormField
                    control={form.control}
                    name="airline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Airlines</FormLabel>
                        <FormControl>
                          <InputTags className="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Fare Rules */}
                  <FormField
                    control={form.control}
                    name="fareClass"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fare Rules</FormLabel>
                        <FormControl>
                          <InputTags {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Refundable Status */}
                  <FormField
                    control={form.control}
                    name="refundable"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Refundable Status</FormLabel>
                        <FormControl>
                          <Textarea
                          className=""
                            {...field}
                            placeholder="Enter Refundable Status"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Changeable Status */}
                  <FormField
                    control={form.control}
                    name="changeable"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Changeable Status</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Enter Changeable Status"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="w-full mb-3 flex justify-end mt-4">
                  

                  <Button
                    type="submit"
                    className="flex items-center py-2 px-2 bg-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Update 
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default FareTable;
