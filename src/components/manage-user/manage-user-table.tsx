import { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { fetchRoles } from "@/redux/user-role-permission";
import toast from "react-hot-toast";
import {
  addUser,
  deleteUser,
  fetchUsers,
  updateUser,
  User,
} from "@/redux/manage-user";
import { AppDispatch, RootState } from "@/provider/redux-provider";

const userFormSchema = z
  .object({
    uniqueId: z.string().min(1, "Unique ID is required"),
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    role: z.string().min(1, "Role is required"),
    address: z.string().min(1, "Address is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm Password is required"),
    status: z.enum(["ACTIVE", "INACTIVE"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof userFormSchema>;

export default function UserManagementPage() {
  const dispatch = useDispatch<AppDispatch>();
  const roles = useSelector(
    (state: RootState) => (state.roles as { roles: any[] }).roles
  );
  const rolesStatus = useSelector((state: RootState) => state.roles.status);
  const users = useSelector((state: RootState) => state.users.users);
  const usersStatus = useSelector((state: RootState) => state.users.status);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [ConfirmDialogue, confirm] = useConfirm(
    "Delete User",
    "Are you sure you want to delete this user? This action cannot be undone."
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      uniqueId: "",
      name: "",
      email: "",
      role: "",
      address: "",
      password: "",
      confirmPassword: "",
      status: "ACTIVE",
    },
  });

  // Fetch roles and users on component mount
  useEffect(() => {
    if (rolesStatus === "idle") {
      dispatch(fetchRoles());
    }
    if (usersStatus === "idle") {
      dispatch(fetchUsers());
    }
  }, [rolesStatus, usersStatus, dispatch]);

  // Handle toast notifications based on user actions
  useEffect(() => {
    if (usersStatus === "failed") {
      toast.error("Failed to fetch users");
    }
  }, [usersStatus]);

  const onSubmit = async (values: FormValues) => {
    const userData = {
      uniqueId: values.uniqueId,
      name: values.name,
      address: values.address,
      email: values.email,
      password: values.password, // Send password (hashing will happen on the backend)
      role: values.role, // Send the role ID
      status: values.status,
    };

    try {
      if (editingUser) {
        // Update user logic
        await dispatch(updateUser({ ...userData, id: editingUser.id })).unwrap();
        toast.success("User updated successfully");
      } else {
        // Add new user logic
        await dispatch(addUser(userData)).unwrap();
        toast.success("User added successfully");
      }
      setIsDialogOpen(false);
      setEditingUser(null);
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.reset({
      uniqueId: user.uniqueId,
      name: user.name,
      email: user.email,
      role: user.role, 
      address: user.address,
      password: "", 
      confirmPassword: "",
      status: user.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm();
    if (ok) {
      try {
        await dispatch(deleteUser(id)).unwrap();
        toast.success("User deleted successfully");
      } catch (error: any) {
        toast.error(error.message || "Failed to delete user");
      }
    }
  };

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const totalPages = Math.ceil(users.length / pageSize);
  const paginatedUsers = users.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const [checkedRows, setCheckedRows] = useState<boolean[]>(
    Array(paginatedUsers.length).fill(false)
  );

  const handleHeaderCheckboxChange = (checked: boolean) => {
    setCheckedRows(checkedRows.map(() => checked));
  };

  const handleRowCheckboxChange = (index: number) => {
    const newCheckedRows = [...checkedRows];
    newCheckedRows[index] = !newCheckedRows[index];
    setCheckedRows(newCheckedRows);
  };

  const isAllChecked =
    checkedRows.length > 0 && checkedRows.every((checked) => checked);

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
                    email: "",
                    role: "",
                    address: "",
                    password: "",
                    confirmPassword: "",
                    status: "ACTIVE",
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
                      {/* Unique ID */}
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
                      {/* Name */}
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
                      {/* Contact */}
                      {/* <FormField
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
                      /> */}
                      {/* Email */}
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
                      {/* Status */}
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <div className="flex space-x-4">
                              {["ACTIVE", "INACTIVE"].map((status) => (
                                <label
                                  key={status}
                                  className="flex items-center space-x-2"
                                >
                                  <input
                                    type="radio"
                                    {...field}
                                    value={status}
                                    checked={field.value === status}
                                  />
                                  <span>
                                    {status.charAt(0).toUpperCase() +
                                      status.slice(1)}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex flex-col gap-4">
                      {/* Role */}
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {roles.map((role: any) => (
                                  <SelectItem key={role.id} value={role.id}>
                                    {role.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      {/* Address */}
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
                      {/* Password */}
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
                      {/* Confirm Password */}
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
                  {/* Form Actions */}
                  <div className="flex justify-center space-x-2">
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

        {/* Users Table */}
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
              <TableHead>Unique ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((user: any, index: number) => {
              const roleName =
                roles.find((role: any) => role.id === user.roleId)?.name ||
                "N/A";
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={checkedRows[index] || false}
                      onChange={() => handleRowCheckboxChange(index)}
                    />
                  </TableCell>
                  <TableCell>{user.uniqueId}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.contact}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{roleName}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-block w-2 h-2 rounded-full mr-2 ${
                        user.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"
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
              );
            })}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-4">
          <div>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPageSize(Number(value));
                setCurrentPage(1); // Reset to first page when page size changes
              }}
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
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
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
}
