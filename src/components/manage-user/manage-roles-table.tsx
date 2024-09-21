import React, { useState } from "react";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Switch from "./switch";
import { Separator } from "../ui/separator";

const roleFormSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  description: z.string().min(1, "Description is required"),
});

type PermissionGroup = {
  name: string;
  active: boolean; // Added active status
  permissions: { [key: string]: { view: boolean; update: boolean } };
};

type Role = {
  id: number;
  name: string;
  description: string;
  permissionGroups: PermissionGroup[];
};

const defaultRoles: Role[] = [
  {
    id: 1,
    name: "Super Admin",
    description: "Has full access to the system",
    permissionGroups: [
      {
        name: "View & Manage User Accounts",
        active: true, // Set active status
        permissions: {
          View: { view: true, update: true },
          Create: { view: true, update: true },
          Delete: { view: true, update: true },
          Update: { view: true, update: true },
          "View All Records": { view: true, update: true },
        },
      },
      {
        name: "Access Booking Management",
        active: false, // Set active status
        permissions: {
          View: { view: true, update: false },
          Create: { view: false, update: false },
          Delete: { view: false, update: false },
          Update: { view: false, update: false },
          "View All Records": { view: false, update: false },
        },
      },
      {
        name: "Manage Support Tickets",
        active: true, // Set active status
        permissions: {
          View: { view: true, update: true },
          Create: { view: true, update: true },
          Delete: { view: true, update: true },
          Update: { view: true, update: true },
          "View All Records": { view: true, update: true },
        },
      },
      {
        name: "View Financial Reports",
        active: false, // Set active status
        permissions: {
          View: { view: true, update: false },
          Create: { view: false, update: false },
          Delete: { view: false, update: false },
          Update: { view: false, update: false },
          "View All Records": { view: false, update: false },
        },
      },
      {
        name: "Process Refunds",
        active: true, // Set active status
        permissions: {
          View: { view: true, update: true },
          Create: { view: true, update: true },
          Delete: { view: true, update: true },
          Update: { view: true, update: true },
          "View All Records": { view: true, update: true },
        },
      },
      {
        name: "Generate Reports & Analytics",
        active: false, // Set active status
        permissions: {
          View: { view: true, update: false },
          Create: { view: false, update: false },
          Delete: { view: false, update: false },
          Update: { view: false, update: false },
          "View All Records": { view: false, update: false },
        },
      },
      {
        name: "Create & Manage Discount Codes",
        active: true, // Set active status
        permissions: {
          View: { view: true, update: true },
          Create: { view: true, update: true },
          Delete: { view: true, update: true },
          Update: { view: true, update: true },
          "View All Records": { view: true, update: true },
        },
      },
      {
        name: "Configure System Settings",
        active: false, // Set active status
        permissions: {
          View: { view: true, update: false },
          Create: { view: false, update: false },
          Delete: { view: false, update: false },
          Update: { view: false, update: false },
          "View All Records": { view: false, update: false },
        },
      },
    ],
  },
];

const permissionGroups = [
  "View & Manage User Accounts",
  "Access Booking Management",
  "Manage Support Tickets",
  "View Financial Reports",
  "Process Refunds",
  "Generate Reports & Analytics",
  "Create & Manage Discount Codes",
  "Configure System Settings",
];

const permissions = ["View", "Create", "Delete", "Update", "View All Records"];

export default function CompleteRoleManagementComponent() {
  const [roles, setRoles] = useState(defaultRoles);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [permissionStates, setPermissionStates] = useState<{
    [key: string]: boolean;
  }>({});
  const [checkedRows, setCheckedRows] = useState<boolean[]>(
    Array(defaultRoles.length).fill(false)
  );

  const handleHeaderCheckboxChange = (checked: boolean) => {
    setCheckedRows(checkedRows.map(() => checked)); // Set all checkboxes to the same state
  };

  const handleRowCheckboxChange = (index: number) => {
    const newCheckedRows = [...checkedRows];
    newCheckedRows[index] = !newCheckedRows[index]; // Toggle the clicked row checkbox
    setCheckedRows(newCheckedRows);
  };

  const isAllChecked = checkedRows.every((checked) => checked);

  const form = useForm({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const permissionForm = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleDelete = (id: number) => {
    setRoles(roles.filter((role) => role.id !== id));
  };

  const openPermissionDialog = (role: Role) => {
    setSelectedRole(role);
    permissionForm.reset({
      name: role.name,
      description: role.description,
    });
    setIsPermissionDialogOpen(true);

    // Initialize permission states based on active status
    const initialPermissionStates: { [key: string]: boolean } = {};
    role.permissionGroups.forEach((group) => {
      initialPermissionStates[group.name] = group.active;
    });
    setPermissionStates(initialPermissionStates);
  };

  const handlePermissionUpdate = (values: any) => {
    if (selectedRole) {
      setRoles(
        roles.map((role) =>
          role.id === selectedRole.id
            ? {
                ...role,
                name: values.name,
                description: values.description,
                permissionGroups: selectedRole.permissionGroups,
              }
            : role
        )
      );
    }
    setIsPermissionDialogOpen(true);
  };

  const onSubmit = (values: any) => {
    setRoles([
      ...roles,
      {
        id: Date.now(),
        ...values,
        permissionGroups: permissionGroups.map((group) => ({
          name: group,
          active: true, // Set active status
          permissions: permissions.reduce((acc, permission) => {
            acc[permission] = { view: false, update: false }; // No permissions checked
            return acc;
          }, {} as { [key: string]: { view: boolean; update: boolean } }),
        })),
      },
    ]);
    setIsCreateDialogOpen(false);
    form.reset();
  };

  const togglePermissionGroup = (group: string) => {
    setPermissionStates((prev) => {
      const updatedState = !prev[group];
      if (selectedRole) {
        const updatedRole = { ...selectedRole };
        const groupIndex = updatedRole.permissionGroups.findIndex(
          (g) => g.name === group
        );
        if (groupIndex !== -1) {
          updatedRole.permissionGroups[groupIndex].active = updatedState; // Update active status
          setSelectedRole(updatedRole);
        }
      }
      return {
        ...prev,
        [group]: updatedState,
      };
    });
    // Prevent closing the dialog on switch toggle
    setIsPermissionDialogOpen(true);
  };

  const handlePermissionChange = (
    group: string,
    permission: string,
    type: "view" | "update",
    value: boolean
  ) => {
    if (selectedRole) {
      const updatedRole = { ...selectedRole };
      const groupIndex = updatedRole.permissionGroups.findIndex(
        (g) => g.name === group
      );

      if (groupIndex === -1) {
        // If the group doesn't exist, create it
        updatedRole.permissionGroups.push({
          name: group,
          active: false, // Set default active status
          permissions: {
            [permission]: { view: false, update: false },
          },
        });
      }

      // Update the permission
      updatedRole.permissionGroups[groupIndex].permissions[permission][type] =
        value;

      setSelectedRole(updatedRole);
    }
  };

  return (
    <div className="w-full bg-white px-3 rounded-lg space-y-6 py-5">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-blue">Role Management</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create Role</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Role</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
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
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit">Create</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={isAllChecked}
                onCheckedChange={handleHeaderCheckboxChange}
              />
            </TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Descriptions</TableHead>
            <TableHead>Permission</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role, index) => (
            <TableRow key={role.id}>
              <TableCell>
                <Checkbox
                  checked={checkedRows[index]}
                  onCheckedChange={() => handleRowCheckboxChange(index)}
                />
              </TableCell>
              <TableCell>{role.name}</TableCell>
              <TableCell>{role.description}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  onClick={() => openPermissionDialog(role)}
                >
                  Permissions
                </Button>
              </TableCell>
              <TableCell>
                <Button variant="ghost" onClick={() => handleDelete(role.id)}>
                  <Trash2 size={16} className="text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog
        open={isPermissionDialogOpen}
        onOpenChange={(open) => {
          // Only close if the user clicks outside or the close button
          if (!open) {
            setIsPermissionDialogOpen(false);
          }
        }}
      >
        <DialogContent
          className="max-w-6xl"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onClick={(e) => e.stopPropagation()} // Prevent propagation on click
        >
          <DialogHeader>
            <DialogTitle>Group permission</DialogTitle>
          </DialogHeader>
          <Form {...permissionForm}>
            <form
              onSubmit={permissionForm.handleSubmit(handlePermissionUpdate)}
              className="space-y-4 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the form
            >
              <div className="flex justify-between items-center">
                <FormField
                  control={permissionForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-1/3">
                      <FormControl>
                        <Input placeholder="Role" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={permissionForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="w-1/3">
                      <FormControl>
                        <Input placeholder="Description" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit">Update</Button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {permissionGroups.map((group) => (
                  <Card key={group} className="p-2">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{group}</h3>
                      <Switch
                        checked={permissionStates[group]}
                        onCheckedChange={() => togglePermissionGroup(group)}
                      />
                    </div>
                    <CardContent className="p-0">
                      <div className="grid grid-cols-4 gap-2">
                        <div className="col-span-2">Name</div>
                        <div className="col-span-1 pl-4">View</div>
                        <div className="col-span-1 pl-3">Update</div>
                        <Separator
                          orientation="horizontal"
                          className="col-span-4"
                        />
                        {permissions.map((permission) => (
                          <React.Fragment key={permission}>
                            <div className="col-span-2">{permission}</div>
                            <div className="col-span-1 flex items-center justify-center">
                              <Checkbox
                                checked={
                                  selectedRole?.permissionGroups.find(
                                    (g) => g.name === group
                                  )?.permissions[permission]?.view || false
                                }
                                onCheckedChange={(checked) =>
                                  handlePermissionChange(
                                    group,
                                    permission,
                                    "view",
                                    checked as boolean
                                  )
                                }
                                disabled={!permissionStates[group]}
                              />
                            </div>
                            <div className="col-span-1 flex items-center justify-center">
                              <Checkbox
                                checked={
                                  selectedRole?.permissionGroups.find(
                                    (g) => g.name === group
                                  )?.permissions[permission]?.update || false
                                }
                                onCheckedChange={(checked) =>
                                  handlePermissionChange(
                                    group,
                                    permission,
                                    "update",
                                    checked as boolean
                                  )
                                }
                                disabled={!permissionStates[group]}
                              />
                            </div>
                          </React.Fragment>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
