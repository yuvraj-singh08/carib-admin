import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "../ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { format } from "date-fns";
import { Separator } from "../ui/separator";
// import { useState } from "react";

interface CouponViewDialogProps {
  selectedCoupon: any;
  setSelectedCoupon: (coupon: any) => void;
  children?: React.ReactNode;
}

export const CoupnViewDialog = ({
  selectedCoupon,
  setSelectedCoupon,
  children,
}: CouponViewDialogProps) => {
  // const [currentPage, setCurrentPage] = useState(1);
  // const [pageSize, setPageSize] = useState(50);
  // const totalPages = Math.ceil(selectedCoupon.length / pageSize);

  return (
    <Dialog
      open={Boolean(selectedCoupon)}
      onOpenChange={() => setSelectedCoupon(null)}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      {selectedCoupon && (
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle className="text-blue">Coupon Details</DialogTitle>
          </DialogHeader>
          <div className="w-full flex items-start gap-4 mt-3">
            {/* Coupon Details Section */}
            <div className="w-1/2 flex flex-col gap-4">
              <div className="w-full grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-3 ">
                  <h1 className="text-[15px] font-medium text-blue">Title</h1>
                  <h1 className="text-[15px] font-medium text-blue">
                    Discount
                  </h1>
                  <h1 className="text-[15px] font-medium text-blue">
                    Coupon Code
                  </h1>
                  <h1 className="text-[15px] font-medium text-blue">Origin</h1>
                  <h1 className="text-[15px] font-medium text-blue">
                    Airline Code
                  </h1>
                  <h1 className="text-[15px] font-medium text-blue">
                    Expiry Date
                  </h1>
                </div>
                <div className="flex flex-col gap-[13px]">
                  <h1 className="text-[14px] text-[#777980]">
                    {selectedCoupon.title}
                  </h1>
                  <h1 className="text-[14px] text-[#777980]">
                    {selectedCoupon.discount}
                  </h1>
                  <h1 className="text-[14px] text-customBlue">
                    {selectedCoupon.code}
                  </h1>
                  <h1 className="text-[14px] text-[#777980]">
                    {selectedCoupon.origin}
                  </h1>
                  <h1 className="text-[14px] text-[#777980]">
                    {selectedCoupon.airlineCode}
                  </h1>
                  <h1 className="text-[14px] text-[#777980]">
                    {format(selectedCoupon.expiryDate, "dd-MM-yyyy")}
                  </h1>
                </div>
              </div>
            </div>
            <Separator orientation="vertical" className="h-[220px] -mt-3" />
            <div className="w-1/2 flex flex-col gap-4">
              <div className="w-full grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-3 ">
                  <h1 className="text-[15px] font-medium text-blue">
                    Description
                  </h1>
                  <h1 className="text-[15px] font-medium text-blue">Limit</h1>
                  <h1 className="text-[15px] font-medium text-blue">Way</h1>
                  <h1 className="text-[15px] font-medium text-blue">
                    Destination
                  </h1>
                  <h1 className="text-[15px] font-medium text-blue">
                    Flight Code
                  </h1>
                  <h1 className="text-[15px] font-medium text-blue">Image</h1>
                </div>
                <div className="flex flex-col gap-[13px]">
                  <h1 className="text-[14px] text-[#777980]">
                    {selectedCoupon.description}
                  </h1>
                  <h1 className="text-[14px] text-[#777980]">
                    {selectedCoupon.limit}
                  </h1>
                  <h1 className="text-[14px] text-[#777980]">
                    {selectedCoupon.way}
                  </h1>
                  <h1 className="text-[14px] text-[#777980]">
                    {selectedCoupon.destination}
                  </h1>
                  <h1 className="text-[14px] text-[#777980]">
                    {selectedCoupon.flightCode}
                  </h1>
                  <div className="w-16 h-auto object-contain rounded-md">
                    <img
                      src={selectedCoupon.imageUrl}
                      alt="coupon"
                      className="w-24 h-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Usage Details Table Section */}
          {/* <div className="mt-6">
            <h2 className="text-lg font-medium text-blue">Usage Details</h2>
            <Table>
              <TableHeader className="bg-[#EFEFFF]">
                <TableRow>
                  <TableHead>User </TableHead>
                  <TableHead>Uses</TableHead>
                  <TableHead>Used Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedCoupon.usageDetails.map(
                  (
                    usage: {
                      username:string
                      userId: string;
                      usedCount: number;
                      usedDate: Date;
                    },
                    index: number
                  ) => (
                    <TableRow key={index}>
                      <TableCell>{usage.username}</TableCell>
                      <TableCell>{usage.usedCount}</TableCell>
                      <TableCell>
                        {format(usage.usedDate, "dd-MM-yyyy")}
                      </TableCell>
                    </TableRow>
                  )
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
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                  disabled={currentPage === 1}
                  className="px-2 py-1 border rounded bg-transparent text-black"
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      variant={currentPage === page ? "default" : "outline"}
                    >
                      {page}
                    </Button>
                  )
                )}
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
          </div> */}
        </DialogContent>
      )}
    </Dialog>
  );
};
