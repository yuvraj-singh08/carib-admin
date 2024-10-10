import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/provider/redux-provider";
import { fetchUsers, deleteUser } from "@/redux/users";
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
import TableLoader from "../shared/table-loader";

// Define the User type based on the structure you're expecting from the API
interface User {
  id: string;
  firstname: string;
  lastname: string;
  mobileNumber: string;
  email: string;
  address: string;
  dob: string;
  passportNo: string;
  lastBooking: string;
  country: string;
  gender: string;
  pincode: string;
  avatarSrc: string;
  passportImage: string;
  cotraveler: Array<{
    name: string;
    dob: string;
    email: string;
    passportNo: string;
    phoneNumber: string;
  }>;
}

const UserInfoDialog = ({ userId }: { userId: string }) => {
  const user = useSelector((state: RootState) =>
    state.users.users.find((u) => u.id === userId)
  ) as User | undefined;

  if (!user) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="bg-orange-400/20 hover:bg-orange-400/40"
        >
          <Eye size={16} className="text-orange-500" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-blue">
            Customer Details
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={user.avatarSrc} alt={user.firstname} />
            <AvatarFallback>{user.firstname.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-md">{`${user.firstname} ${user.lastname}`}</h3>
            <p className="text-gray-500">{user.email}</p>
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
              value={user.passportNo || "N/A"}
            />
            <InfoItem
              label="Mobile Number"
              value={user.mobileNumber || "N/A"}
            />
            <InfoItem label="Country" value={user.country || "N/A"} />
            <InfoItem label="DOB" value={user.dob || "N/A"} />
            <InfoItem label="Gender" value={user.gender || "N/A"} />
            <InfoItem label="Pincode" value={user.pincode || "N/A"} />
            <InfoItem
              label="Document"
              value={
                <Button variant="link" className="p-0">
                  Show
                </Button>
              }
            />
          </div>
          <div className="space-y-4">
            <DialogTitle className="text-lg font-bold text-blue">
              Passport Image
            </DialogTitle>
            <img
              src={user.passportImage || "/icons/passport.png"}
              alt="Passport"
              className="w-full rounded-lg"
            />
          </div>
        </div>
        <DialogTitle className="text-lg font-bold text-blue">
          Additional Details (Co traveler)
        </DialogTitle>
        <div className="w-full grid grid-cols-2 gap-2">
          {user.cotraveler && user.cotraveler.length > 0 ? (
            <>
              <div className="flex flex-col gap-3">
                <InfoItem label="Name" value={user.cotraveler[0].name} />
                <InfoItem label="DOB" value={user.cotraveler[0].dob} />
                <InfoItem label="Email" value={user.cotraveler[0].email} />
              </div>
              <div className="flex flex-col gap-3">
                <InfoItem
                  label="Passport Number"
                  value={user.cotraveler[0].passportNo}
                />
                <InfoItem
                  label="Phone Number"
                  value={user.cotraveler[0].phoneNumber}
                />
              </div>
            </>
          ) : (
            <p>No co-traveler information available.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

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
  const users = useSelector((state: RootState) => state.customers.users);
  const status = useSelector((state: RootState) => state.users.status);
  const error = useSelector((state: RootState) => state.users.error);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ConfirmDialogue, confirm] = useConfirm(
    "Delete Customer Details",
    "Are you sure you want to delete this customer details? This action cannot be undone."
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUsers());
    }
  }, [status, dispatch]);

  const paginatedUsers = users.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(users.length / pageSize);

  const handleDelete = async (id: string) => {
    const ok = await confirm();
    if (ok) {
      dispatch(deleteUser(id));
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
            {paginatedUsers.map((user) => (
              <TableRow key={user?.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    {/* <Avatar>
                      <AvatarImage
                        src={user?.avatarSrc}
                        alt={`${user.firstname} ${user.lastname}`}
                      />
                      <AvatarFallback>
                        {user.firstname.charAt(0)}
                      </AvatarFallback>
                    </Avatar> */}
                    <span className="truncate">{`${user.firstname} ${user.lastname}`}</span>
                  </div>
                </TableCell>
                <TableCell className="text-customBlue">
                  {user?.mobileNumber}
                </TableCell>
                <TableCell>{user?.email}</TableCell>
                <TableCell>{user?.address}</TableCell>
                <TableCell>{user?.dob}</TableCell>
                <TableCell>{user?.passportNo}</TableCell>
                <TableCell>{user?.lastBooking}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <UserInfoDialog userId={user?.id} />
                    <Button
                      variant="ghost"
                      className="bg-red-200/40 hover:bg-red-200/60"
                      onClick={() => handleDelete(user?.id)}
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
