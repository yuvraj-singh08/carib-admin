import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Pencil, Trash2 } from "lucide-react";
import { useConfirm } from "@/hooks/use-confirm";

const userFormSchema = z
  .object({
    uniqueId: z.string().min(1, "Unique ID is required"),
    name: z.string().min(1, "Name is required"),
    contact: z.string().min(1, "Contact is required"),
    email: z.string().email("Invalid email address"),
    role: z.string().min(1, "Role is required"),
    address: z.string().min(1, "Address is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm Password is required"),
    status: z.enum(["active", "inactive"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type User = {
  id: number;
  uniqueId: string;
  name: string;
  contact: string;
  email: string;
  role: string;
  status: "active" | "inactive";
};

const defaultUsers: User[] = [
  {
    id: 1,
    uniqueId: "58632553",
    name: "Animesh Sadh",
    contact: "6263584921",
    email: "animeshsadh@gmail.com",
    role: "Manager",
    status: "active",
  },
  // Add more default users as needed
];

export default function UserManagementPage() {
  const [users, setUsers] = useState(defaultUsers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [checkedRows, setCheckedRows] = useState<boolean[]>(
    Array(defaultUsers.length).fill(false)
  );

  const [ConfirmDialogue, confirm] = useConfirm(
    "Delete User",
    "Are you sure you want to delete this user? This action cannot be undone."
  );

  const form = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      uniqueId: "",
      name: "",
      contact: "",
      email: "",
      role: "",
      address: "",
      password: "",
      confirmPassword: "",
      status: "active",
    },
  });

  const onSubmit = (values: any) => {
    if (editingUser) {
      setUsers(
        users.map((user) =>
          user.id === editingUser.id ? { ...user, ...values } : user
        )
      );
    } else {
      setUsers([...users, { id: Date.now(), ...values }]);
    }
    setIsDialogOpen(false);
    setEditingUser(null);
    form.reset();
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    form.reset(user);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    const ok = await confirm();
    if (ok) {
      setUsers(users.filter((user) => user.id !== id));
      setCheckedRows(checkedRows.filter((_, index) => users[index].id !== id));
    }
  };

  const totalPages = Math.ceil(users.length / pageSize);
  const paginatedUsers = users.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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
    <>
    <ConfirmDialogue />
    <div className="w-full bg-white px-3 rounded-lg space-y-6 py-5">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-blue">User Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingUser(null);
                form.reset({
                  uniqueId: "",
                  name: "",
                  contact: "",
                  email: "",
                  role: "",
                  address: "",
                  password: "",
                  confirmPassword: "",
                  status: "active",
                });
                setIsDialogOpen(true);
              }}
            >
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-blue">
                {editingUser ? "Edit User" : "Add User"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <div className="flex w-full items-start gap-6">
                  <div className="flex flex-col gap-3">
                    <FormField
                      control={form.control}
                      name="uniqueId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unique ID</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="mt-2">
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <div className="flex space-x-4">
                            <label className="flex items-center space-x-2">
                              <input
                                type="radio"
                                {...field}
                                value="active"
                                checked={field.value === "active"}
                              />
                              <span>Active</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input
                                type="radio"
                                {...field}
                                value="inactive"
                                checked={field.value === "inactive"}
                              />
                              <span>Inactive</span>
                            </label>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="manager">Manager</SelectItem>
                              <SelectItem value="employee">Employee</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem className="-mt-1">
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="flex justify-center  space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingUser ? "Update" : "Save"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
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
            <TableHead>User ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedUsers.map((user, index) => (
            <TableRow key={user.id}>
              <TableCell>
                <input
                  type="checkbox"
                  checked={
                    checkedRows[(currentPage - 1) * pageSize + index] || false
                  }
                  onChange={() =>
                    handleRowCheckboxChange(
                      (currentPage - 1) * pageSize + index
                    )
                  }
                />
              </TableCell>
              <TableCell>{user.uniqueId}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.contact}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <span
                  className={`inline-block w-2 h-2 rounded-full mr-2 ${
                    user.status === "active" ? "bg-green-500" : "bg-red-500"
                  }`}
                ></span>
                {user.status}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    onClick={() => handleEdit(user)}
                    className="bg-green-400/20 hover:bg-green-400/40"
                  >
                    <Pencil size={16} className="text-green-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    className="bg-red-400/20 hover:bg-red-400/40"
                    onClick={() => handleDelete(user.id)}
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </Button>
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
            className="px-2 py-1 border rounded bg-transparent hover:text-white text-black"
          >
            Next
          </Button>
        </div>
      </div>
    </div></>
  );
}
