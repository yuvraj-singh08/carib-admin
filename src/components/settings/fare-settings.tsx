import React, { useState } from "react";
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
import { format } from "date-fns";
import TableLoader from "../shared/table-loader";

import { Save, Search } from "lucide-react";

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
      refundableStatus: "Non-refundable",
      changeableStatus: "Changeable with fee",
      lastUpdateTime: "2025-03-11T12:30:00Z",
    },
    {
      id: 2,
      fareClass: "Business",
      airlines: "Delta Airlines",
      checkedBagsIncluded: 2,
      refundableStatus: "Fully refundable",
      changeableStatus: "Free changes",
      lastUpdateTime: "2025-03-10T15:45:00Z",
    },
    {
      id: 3,
      fareClass: "First Class",
      airlines: "United Airlines",
      checkedBagsIncluded: 3,
      refundableStatus: "Fully refundable",
      changeableStatus: "Free changes",
      lastUpdateTime: "2025-03-09T10:15:00Z",
    },
    {
      id: 4,
      fareClass: "Economy",
      airlines: "American Airlines",
      checkedBagsIncluded: 1,
      refundableStatus: "Non-refundable",
      changeableStatus: "Changeable with fee",
      lastUpdateTime: "2025-03-11T12:30:00Z",
    },
    {
      id: 5,
      fareClass: "Business",
      airlines: "Delta Airlines",
      checkedBagsIncluded: 2,
      refundableStatus: "Fully refundable",
      changeableStatus: "Free changes",
      lastUpdateTime: "2025-03-10T15:45:00Z",
    },
    {
      id: 6,
      fareClass: "First Class",
      airlines: "United Airlines",
      checkedBagsIncluded: 3,
      refundableStatus: "Fully refundable",
      changeableStatus: "Free changes",
      lastUpdateTime: "2025-03-09T10:15:00Z",
    },

    {
      id: 7,
      fareClass: "Economy",
      airlines: "American Airlines",
      checkedBagsIncluded: 1,
      refundableStatus: "Non-refundable",
      changeableStatus: "Changeable with fee",
      lastUpdateTime: "2025-03-11T12:30:00Z",
    },
    {
      id: 8,
      fareClass: "Business",
      airlines: "Delta Airlines",
      checkedBagsIncluded: 2,
      refundableStatus: "Fully refundable",
      changeableStatus: "Free changes",
      lastUpdateTime: "2025-03-10T15:45:00Z",
    },
    {
      id: 9,
      fareClass: "First Class",
      airlines: "United Airlines",
      checkedBagsIncluded: 3,
      refundableStatus: "Fully refundable",
      changeableStatus: "Free changes",
      lastUpdateTime: "2025-03-09T10:15:00Z",
    },
    {
      id: 10,
      fareClass: "Economy",
      airlines: "American Airlines",
      checkedBagsIncluded: 1,
      refundableStatus: "Non-refundable",
      changeableStatus: "Changeable with fee",
      lastUpdateTime: "2025-03-11T12:30:00Z",
    },
    {
      id: 11,
      fareClass: "Business",
      airlines: "Delta Airlines",
      checkedBagsIncluded: 2,
      refundableStatus: "Fully refundable",
      changeableStatus: "Free changes",
      lastUpdateTime: "2025-03-10T15:45:00Z",
    },
    {
      id: 12,
      fareClass: "First Class",
      airlines: "United Airlines",
      checkedBagsIncluded: 3,
      refundableStatus: "Fully refundable",
      changeableStatus: "Free changes",
      lastUpdateTime: "2025-03-09T10:15:00Z",
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  //   const [sortConfig, setSortConfig] = useState<{
  //     key: keyof (typeof dummyFares)[0] | null;
  //     direction: "asc" | "desc";
  //   }>({ key: null, direction: "asc" });

  const [newEntry, setNewEntry] = useState({
    fareClass: "",
    airline: "",
    checkedBags: "",
    refundable: "Yes",
    changeable: "Yes",
  });

  // Filter data based on search term
  const filteredData = dummyFares.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Sort data
  //   const sortedData = [...filteredData].sort((a, b) => {
  //     if (!sortConfig.key) return 0;
  //     if (a[sortConfig.key] < b[sortConfig.key]) {
  //       return sortConfig.direction === 'asc' ? -1 : 1;
  //     }
  //     if (a[sortConfig.key] > b[sortConfig.key]) {
  //       return sortConfig.direction === 'asc' ? 1 : -1;
  //     }
  //     return 0;
  //   });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  //   const handleSort = (key: keyof typeof dummyFares[0]) => {
  //     setSortConfig({
  //       key,
  //       direction:
  //         sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
  //     });
  //   };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewEntry((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // In a real app, this would be an API call
    console.log("Saving new entry:", newEntry);
    // Reset form
    setNewEntry({
      fareClass: "",
      airline: "",
      checkedBags: "",
      refundable: "Yes",
      changeable: "Yes",
    });
  };

  if (status === "loading") {
    return <TableLoader />;
  }

  console.log("pageSize", pageSize);
  console.log("totalPages", totalPages);

  return (
    <>
      <div className="p-4 bg-white rounded-xl">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold text-blue">Fare Settings</h1>
        </div>

        {/* <div>kejf</div> */}

        <div className="   border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fare Class
              </label>
              <input
                type="text"
                name="fareClass"
                value={newEntry.fareClass}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter fare class"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Airlines
              </label>
              <input
                type="text"
                name="airline"
                value={newEntry.airline}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter airline"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Checked Bags
              </label>
              <input
                type="text"
                name="checkedBags"
                value={newEntry.checkedBags}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter bags included "
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Refundable Status
              </label>
              <Select
                name="refundable"
                defaultValue={newEntry.refundable}
                onValueChange={(value) => {
                  setNewEntry((prev) => ({
                    ...prev,
                    refundable: value,
                  }));
                }}
              >
                <SelectTrigger className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <SelectValue placeholder=" Changeable Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Changeable Status
              </label>
              <Select
                name="changeable"
                onValueChange={(value) => {
                  setNewEntry((prev) => ({
                    ...prev,
                    changeable: value,
                  }));
                }}
                defaultValue={newEntry.changeable}
              >
                <SelectTrigger className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <SelectValue placeholder=" Changeable Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="w-full flex justify-between mt-4">
            <div className="flex items-center gap-2">
              <div className="relative hidden md:block">
                <Input
                  placeholder="Search..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-[180px] rounded-xl h-10 pl-9"
                />
                <Search className="size-5 shrink-0 text-gray absolute top-2.5 left-2" />
              </div>
            </div>

            <Button
              onClick={handleSave}
              className="flex items-center  py-2 bg-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
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
      </div>
    </>
  );
};

export default FareTable;
