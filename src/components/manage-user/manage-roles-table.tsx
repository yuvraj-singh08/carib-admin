import React, { useEffect, useState } from "react";
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
import { useConfirm } from "@/hooks/use-confirm";
import { AppDispatch, RootState } from "@/provider/redux-provider";
import { useDispatch, useSelector } from "react-redux";
import { addRole, deleteRole, fetchRoles, updateRole, RoleType} from "@/redux/user-role-permission";
import toast from "react-hot-toast";

const roleFormSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  description: z.string().min(1, "Description is required"),
});

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
  const dispatch = useDispatch<AppDispatch>();
  const { roles } = useSelector((state: RootState) => state.roles);
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);
  const [permissionStates, setPermissionStates] = useState<{ [key: string]: boolean }>({});
  
  const [ConfirmDialogue, confirm] = useConfirm(
    "Delete Role",
    "Are you sure you want to delete this role? This action cannot be undone."
  );

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

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

  const openPermissionDialog = (role: RoleType) => {
    setSelectedRole(role);
    permissionForm.reset({
      name: role.name,
      description: role.description,
    });
    setIsPermissionDialogOpen(true);

    const initialPermissionStates: { [key: string]: boolean } = {};
    role.permissionGroups.forEach((group) => {
      initialPermissionStates[group.name] = group.active;
    });
    setPermissionStates(initialPermissionStates);
  };

  const handlePermissionUpdate = (values: any) => {
    if (selectedRole) {
      const updatedRole: RoleType = {
        ...selectedRole,
        name: values.name,
        description: values.description,
        permissionGroups: selectedRole.permissionGroups.map((group) => ({
          ...group,
          active: permissionStates[group.name],
        })),
      };
      dispatch(updateRole(updatedRole));
      setIsPermissionDialogOpen(false);
      toast.success("Role updated successfully.");
    }
  };

  const onSubmit = (values: any) => {
    const newRole: Omit<RoleType, "id"> = {
      name: values.name,
      description: values.description,
      permissionGroups: permissionGroups.map((group) => ({
        name: group,
        active: false,
        permissions: permissions.reduce((acc, permission) => {
          acc[permission] = { view: false, update: false };
          return acc;
        }, {} as { [key: string]: { view: boolean; update: boolean } }),
      })),
    };
  
    dispatch(addRole(newRole));
    toast.success("Role created successfully.");
    setIsCreateDialogOpen(false);
    form.reset();
  };

  const togglePermissionGroup = (group: string) => {
    const isGroupActive = !permissionStates[group]; 
    setPermissionStates((prev) => ({
      ...prev,
      [group]: isGroupActive,
    }));
  
    if (selectedRole) {
      const updatedRole = { ...selectedRole };
      const groupIndex = updatedRole.permissionGroups.findIndex(
        (g) => g.name === group
      );
  
      if (groupIndex !== -1) {
        // Update group active state
        updatedRole.permissionGroups[groupIndex].active = isGroupActive;
  
        Object.keys(updatedRole.permissionGroups[groupIndex].permissions).forEach(
          (permission) => {
            updatedRole.permissionGroups[groupIndex].permissions[permission].view = isGroupActive;
            updatedRole.permissionGroups[groupIndex].permissions[permission].update = isGroupActive;
          }
        );
  
        setSelectedRole(updatedRole);
      }
    }
  };
  
  const handlePermissionChange = (
    group: string,
    permission: string,
    type: "view",
    value: boolean
  ) => {
    if (selectedRole && permissionStates[group]) {
      // Clone the selectedRole object to avoid mutating the original state
      const updatedRole = { 
        ...selectedRole, 
        permissionGroups: selectedRole.permissionGroups.map((g) => {
          if (g.name === group) {
            return {
              ...g,
              permissions: {
                ...g.permissions,
                [permission]: { 
                  ...g.permissions[permission], 
                  [type]: value, // Update the specific permission
                }
              }
            };
          }
          return g;
        })
      };
  
      // Check if any permission is active to determine the group state
      const groupIndex = updatedRole.permissionGroups.findIndex((g) => g.name === group);
      if (groupIndex !== -1) {
        const isAnyPermissionActive = Object.values(updatedRole.permissionGroups[groupIndex].permissions).some(
          (perm) => perm.view || perm.update
        );
        updatedRole.permissionGroups[groupIndex].active = isAnyPermissionActive;
      }
  
      setSelectedRole(updatedRole);
  
      // Also update permissionStates
      setPermissionStates((prev) => ({
        ...prev,
        [group]: updatedRole.permissionGroups[groupIndex].active,
      }));
    }
  };
  

  const handleDelete = async (id: string) => {
    const ok = await confirm();
    if (ok) {
      try {
        await dispatch(deleteRole(id)).unwrap();
        toast.success("Role deleted successfully.");
      } catch (error) {
        console.error("Failed to delete role:", error);
        toast.error("Failed to delete role. Please try again later.");
      }
    }
  };

  return (
    <>
      <ConfirmDialogue />
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
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <TableHead>Role</TableHead>
              <TableHead>Descriptions</TableHead>
              <TableHead>Permission</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>{role.name}</TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell>
                  <Button variant="outline" onClick={() => openPermissionDialog(role)}>
                    Permissions
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    onClick={() => handleDelete(role.id)}
                    className="bg-red-400/20 hover:bg-red-400/40"
                  >
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
            if (!open) {
              setIsPermissionDialogOpen(false);
            }
          }}
        >
          <DialogContent
            className="max-w-6xl"
            onOpenAutoFocus={(e) => e.preventDefault()}
            onClick={(e) => e.stopPropagation()}
          >
            <DialogHeader>
              <DialogTitle>Group permission</DialogTitle>
            </DialogHeader>
            <Form {...permissionForm}>
              <form
                onSubmit={permissionForm.handleSubmit(handlePermissionUpdate)}
                className="space-y-4 max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
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
                          <div className="col-span-1 pl-4">Permissions</div>
                          {/* <div className="col-span-1 pl-3">Update</div> */}
                          <Separator orientation="horizontal" className="col-span-4" />
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
                              {/* <div className="col-span-1 flex items-center justify-center">
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
                              </div> */}
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
    </>
  );
}