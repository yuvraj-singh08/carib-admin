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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ArrowLeft, Eye, Image, Trash2 } from "lucide-react";
import { Separator } from "../ui/separator";
import { useConfirm } from "@/hooks/use-confirm";
import { AppDispatch } from "@/provider/redux-provider";
import toast from "react-hot-toast";
import TableLoader from "../shared/table-loader";
import { format } from "date-fns";

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

const UserDetails = ({
  user,
  onBack,
}: {
  user: Customer;
  onBack: () => void;
}) => (
  <div className="w-full bg-white rounded-xl p-6">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-lg font-bold text-blue">Customer Details</h2>
      <Button
        onClick={onBack}
        variant="outline"
        className="flex items-center gap-2"
      >
        <ArrowLeft size={16} />
        Back to List
      </Button>
    </div>

    <div className="flex items-center space-x-4 mb-6">
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
    <Separator className="mb-6" />

    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-blue mb-4">User Info</h3>

        <InfoItem
          label="Passport Number"
          value={user?.passportDetails?.passportNumber || "N/A"}
        />
        <InfoItem label="Mobile Number" value={user.mobileNumber || "N/A"} />
        <InfoItem
          label="DOB"
          value={user.dob ? format(new Date(user.dob), "dd MMM, yyyy") : "N/A"}
        />
        <InfoItem label="Gender" value={user.gender || "N/A"} />
        <InfoItem label="Address" value={user.address || "N/A"} />
        <InfoItem label="Pincode" value={user.pincode || "N/A"} />
      </div>
      <div className="space-y-4">
        {user?.passportDetails?.passportImg && (
          <h3 className="text-lg font-bold text-blue mb-4">Passport Image</h3>
        )}
        {(user?.passportDetails?.passportImg?.length ?? 0) > 0 && (
          <Dialog>
            <DialogTrigger>
              <Button className="w-60" variant="outline" type="button">
                <Image className="size-5 mr-2" />
                View Images (
                {user?.passportDetails?.passportImg?.length ?? 0 > 0
                  ? user?.passportDetails?.passportImg?.length
                  : 1}
                )
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl w-full flex items-center">
              {user?.passportDetails?.passportImg?.map((img, index) => (
                <Dialog key={index}>
                  <DialogTrigger className="relative">
                    <img
                      src={img}
                      alt={`uploaded-image-${index}`}
                      className="w-40 h-auto aspect-square rounded-xl border border-black object-cover"
                    />
                  </DialogTrigger>
                  <DialogContent className="w-full h-auto overflow-hidden">
                    <div className="object-contain">
                      <img
                        src={img}
                        alt={`uploaded-image-${index}`}
                        className="w-full h-[60%] aspect-square rounded-xl object-cover"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>

    <h3 className="text-lg font-bold text-blue mt-8 mb-4">
      Additional Details (Co traveler)
    </h3>
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
                {new Date(coTraveler.dateOfBirth).toLocaleDateString()}
              </TableCell>
              <TableCell>{coTraveler.email}</TableCell>
              <TableCell>{coTraveler.passportNumber}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              No Co-Travellers Found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
);

const CustomerDetailsTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { customers, status, error } = useSelector(
    (state: any) => state.customers
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedUser, setSelectedUser] = useState<Customer | null>(null);
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

  if (selectedUser) {
    return (
      <UserDetails user={selectedUser} onBack={() => setSelectedUser(null)} />
    );
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
                    <Button
                      variant="ghost"
                      className="bg-orange-400/20 hover:bg-orange-400/40"
                      onClick={() => {
                        window.scrollTo(0, 0);
                        setSelectedUser(customer);
                      }}
                    >
                      <Eye size={16} className="text-orange-500" />
                    </Button>
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
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
    </>
  );
};

export default CustomerDetailsTable;
