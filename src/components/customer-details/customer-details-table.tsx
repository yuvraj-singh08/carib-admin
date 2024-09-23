import { useState } from "react";
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

interface CoTraveler {
  name: string;
  dob: string;
  email: string;
  passportNo: string;
  phoneNumber: string;
}

interface User {
  id: number;
  name: string;
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
  coTraveler: CoTraveler;
}

const initialCustomers = [
  {
    id: 1,
    name: "Prof. Haskell Grimes DVM",
    mobileNumber: "+91 6263592198",
    email: "Demo@Gmail.Com",
    address: "United sted",
    dob: "20-04-1995",
    passportNo: "544894856626",
    lastBooking: "25-04-2024",
    country: "India",
    gender: "Male",
    pincode: "25026",
    avatarSrc: "/api/placeholder/80/80",
    passportImage: "/icons/passport.png",
    coTraveler: {
      name: "Animesh Sadh",
      dob: "11/07/2002",
      email: "Animesh@Gmail.Com",
      passportNo: "511566556",
      phoneNumber: "6263592187",
    },
  },
  {
    id: 2,
    name: "John Doe",
    mobileNumber: "+91 98765432",
    email: "john@example.com",
    address: "New York, USA",
    dob: "15-06-1990",
    passportNo: "A12345678",
    lastBooking: "20-04-2024",
    country: "USA",
    gender: "Male",
    pincode: "10001",
    avatarSrc: "/api/placeholder/80/80",
    passportImage: "/icons/passport.png",
    coTraveler: {
      name: "Jane Doe",
      dob: "22/08/1992",
      email: "jane@example.com",
      passportNo: "B87654321",
      phoneNumber: "9876543210",
    },
  },
  {
    id: 3,
    name: "Jane Smith",
    mobileNumber: "+44 1234567890",
    email: "jane@example.com",
    address: "London, UK",
    dob: "03-09-1985",
    passportNo: "B98765432",
    lastBooking: "18-04-2024",
    country: "UK",
    gender: "Female",
    pincode: "SW1A 1AA",
    avatarSrc: "/api/placeholder/80/80",
    passportImage: "/icons/passport.png",
    coTraveler: {
      name: "John Smith",
      dob: "14/02/1983",
      email: "john@example.com",
      passportNo: "C23456789",
      phoneNumber: "1234567890",
    },
  },
];

const UserInfoDialog = ({ user }: { user: User }) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="ghost" className="bg-orange-400/20 hover:bg-orange-400/40">
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
          <AvatarImage src={user.avatarSrc} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-md">{user.name}</h3>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>
      <Separator />

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <DialogTitle className="text-lg font-bold text-blue">
            User Info
          </DialogTitle>

          <InfoItem label="Passport Number" value={user.passportNo} />
          <InfoItem label="Mobile Number" value={user.mobileNumber} />
          <InfoItem label="Country" value={user.country} />
          <InfoItem label="DOB" value={user.dob} />
          <InfoItem label="Gender" value={user.gender} />
          <InfoItem label="Pincode" value={user.pincode} />
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
            src={user.passportImage}
            alt="Passport"
            className="w-full rounded-lg"
          />
     
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
        <div className="w-full grid grid-cols-2 gap-2">
         <div className="flex flex-col gap-3">
         
          <InfoItem label="Name" value={user.coTraveler.name} />
          <InfoItem label="DOB" value={user.coTraveler.dob} />
          <InfoItem label="Email" value={user.coTraveler.email} />
         
         </div>
         <div className="flex flex-col gap-3">
         <InfoItem
            label="Passport Number"
            value={user.coTraveler.passportNo}
          />
            <InfoItem label="Phone Number" value={user.coTraveler.phoneNumber} />
         </div>
      </div>
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
  const [customers, setCustomers] = useState(initialCustomers);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [ConfirmDialogue, confirm] = useConfirm(
    "Delete Customer Details",
    "Are you sure you want to delete this customer details? This action cannot be undone."
  );

  const paginatedCustomers = customers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(customers.length / pageSize);

  const handleDelete = async (id: number) => {
  const ok = await confirm()
  if(ok){
    setCustomers((prev) => prev.filter((customer) => customer.id !== id));
  }
  };

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
          {paginatedCustomers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage src={customer.avatarSrc} alt={customer.name} />
                    <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="truncate">{customer.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-customBlue">
                {customer.mobileNumber}
              </TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.address}</TableCell>
              <TableCell>{customer.dob}</TableCell>
              <TableCell>{customer.passportNo}</TableCell>
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
    </div></>
  );
};

export default CustomerDetailsTable;
