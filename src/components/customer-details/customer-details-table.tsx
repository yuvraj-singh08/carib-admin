import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Customer,
  deleteCustomer,
  fetchCustomers,
} from "@/redux/registered-customers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Eye, Trash2 } from "lucide-react";
import { Separator } from "../ui/separator";
import { useConfirm } from "@/hooks/use-confirm";
import { AppDispatch } from "@/provider/redux-provider";
import toast from "react-hot-toast";
import TableLoader from "../shared/table-loader";
import { format } from "date-fns";

const UserInfoDialog = ({ user }: { user: Customer }) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button
        variant="ghost"
        className="bg-orange-400/20 hover:bg-orange-400/40"
      >
        <Eye size={16} className="text-orange-500" />
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-hidden p-4 overflow-y-scroll">
      <DialogHeader>
        <DialogTitle className="text-lg font-bold text-blue">
          Customer Details
        </DialogTitle>
      </DialogHeader>
      <div className="flex items-center space-x-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src={user?.avatarSrc} alt={user?.firstname} />
          <AvatarFallback>{user?.firstname.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-md">
            {user?.firstname} {user?.lastname}
          </h3>
          <p className="text-gray-500">{user?.email}</p>
        </div>
      </div>
      <Separator />

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <DialogTitle className="text-lg font-bold text-blue">
            User Info
          </DialogTitle>

          <InfoItem
            label="Passport Number"
            value={user?.passportDetails?.passportNumber || "N/A"}
          />
          <InfoItem label="Mobile Number" value={user.mobileNumber || "N/A"} />
          <InfoItem label="DOB" value={user.dob ? format(new Date(user.dob), "dd MMM, yyyy") : "N/A"} />
          <InfoItem label="Gender" value={user.gender || "N/A"} />
          <InfoItem label="Address" value={user.address || "N/A"} />
          <InfoItem label="Pincode" value={user.pincode || "N/A"} />
          {/* <InfoItem
            label="Document"
            value={
              <Button variant="link" className="p-0">
                Show
              </Button>
            }
          /> */}
        </div>
        <div className="space-y-4">
          {user?.passportDetails?.passportImg && (
            <DialogTitle className="text-lg font-bold text-blue">
            Passport Image
          </DialogTitle>
          )}
          {user?.passportDetails?.passportImg &&  (
            <img
              src={user.passportDetails.passportImg}
              alt="Passport"
              className="w-full rounded-lg"
            />
          )}

          {/* <InfoItem label="Email" value={user.coTraveler.email} />
          <InfoItem
            label="Passport Number"
            value={user.coTraveler.passportNo}
          />
          <InfoItem label="Phone Number" value={user.coTraveler.phoneNumber} /> */}
        </div>
      </div>
      <DialogTitle className="text-lg font-bold text-blue">
        Additional Details (Co traveler)
      </DialogTitle>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>DOB</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Passport No.</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {user.coTraveler && user.coTraveler.length > 0 ? (
            user.coTraveler.map((coTraveler, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{coTraveler.name}</TableCell>
                <TableCell>
                  {new Date(coTraveler.dateOfBirth).toLocaleDateString()}{" "}
                  {/* Correcting date format */}
                </TableCell>
                <TableCell>{coTraveler.email}</TableCell>
                <TableCell>{coTraveler.passportNumber}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No Co-Travellers Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </DialogContent>
  </Dialog>
);

const InfoItem = ({
  label,
  value,
}: {
  label: string;
  value: string | JSX.Element;
}) => (
  <div className="grid grid-cols-2 items-center gap-2">
    <span className="font-medium text-gray-600">{label}</span>
    <span className="text-black">{value}</span>
  </div>
);

const CustomerDetailsTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { customers, status, error } = useSelector(
    (state: any) => state.customers
  ); // Adjust the state structure accordingly
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ConfirmDialogue, confirm] = useConfirm(
    "Delete Customer Details",
    "Are you sure you want to delete this customer details? This action cannot be undone."
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCustomers());
    }
  }, [status, dispatch]);

  const paginatedCustomers = customers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.ceil(customers.length / pageSize);

  const handleDelete = async (id: string) => {
    const ok = await confirm();
    if (ok) {
      try {
        await dispatch(deleteCustomer(id)).unwrap();
        toast.success("User Deleted Successfully");
      } catch (error) {
        toast.error(`Failed to delete user: ${error}`);
      }
    }
  };

  if (status === "loading") {
    return <TableLoader />;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <ConfirmDialogue />
      <div className="w-full bg-white rounded-xl pt-6">
        <h2 className="text-lg font-semibold text-blue mb-3 pl-6">
          Customer details
        </h2>

        <Table className="px-2 min-w-max">
          <TableHeader className="bg-[#EFEFFF]">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Mobile number</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>DOB</TableHead>
              <TableHead>Passport No.</TableHead>
              <TableHead>Last Booking</TableHead>
              <TableHead className="flex items-center justify-center">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCustomers.map((customer: Customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarImage
                        src={customer.avatarSrc}
                        alt={customer.firstname}
                      />
                      <AvatarFallback>
                        {customer.firstname.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate">
                      {customer.firstname} {customer.lastname}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-customBlue">
                  {customer.mobileNumber}
                </TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell className="truncate max-w-[100px]">
                  {customer.address}
                </TableCell>
                <TableCell>{customer.dob}</TableCell>
                <TableCell>
                  {customer.passportDetails?.passportNumber}
                </TableCell>
                <TableCell>{customer.lastBooking}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <UserInfoDialog user={customer} />
                    <Button
                      variant="ghost"
                      className="bg-red-200/40 hover:bg-red-200/60"
                      onClick={() => handleDelete(customer.id)}
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between py-4 px-4">
          <div>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => setPageSize(Number(value))}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between py-4 px-4">
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
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerDetailsTable;
