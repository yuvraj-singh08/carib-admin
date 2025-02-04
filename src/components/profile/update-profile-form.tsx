import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from "@/provider/redux-provider";
import {
  fetchUserById,
  updateUserProfile,
  updateUserPassword,
} from "@/redux/useSlice";
import { uploadImage } from "@/hooks/aws";
import { PasswordInput } from "../ui/password-input";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const profileFormSchema = z.object({
  firstName: z
    .string()
    .min(2, {
      message: "First name must be at least 2 characters.",
    })
    .optional(),
  lastName: z
    .string()
    .min(2, {
      message: "Last name must be at least 2 characters.",
    })
    .optional(),
  avatarSrc: z.string().optional(),
});

const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export default function ProfileForm() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const updatePasswordStatus = useSelector(
    (state: RootState) => state.user.updatePasswordStatus
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);

  useEffect(() => {
    dispatch(fetchUserById());
  }, [dispatch]);

  const profileForm = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user?.firstname || "",
      lastName: user?.lastname || "",
      avatarSrc: user?.avatarSrc || "",
    },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        firstName: user.firstname || "",
        lastName: user.lastname || "",
        avatarSrc: user.avatarSrc || "",
      });
    }
  }, [user, profileForm]);

  async function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    setIsLoading(true);
    try {
      const updateData: any = {};
      if (values.firstName !== user?.firstname)
        updateData.firstName = values.firstName;
      if (values.lastName !== user?.lastname)
        updateData.lastName = values.lastName;
      if (values.avatarSrc !== user?.avatarSrc)
        updateData.avatarSrc = values.avatarSrc;

      if (Object.keys(updateData).length > 0) {
        await dispatch(updateUserProfile(updateData));
        toast.success("Profile updated successfully");
      } else {
        toast.success("No changes to update");
      }
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Failed to update profile:", error);
    }
    setIsLoading(false);
  }

  async function onPasswordSubmit(values: z.infer<typeof passwordFormSchema>) {
    const updatePasswordToast = toast.loading("Updating password...");
    try {
      await dispatch(updateUserPassword(values.newPassword)).unwrap();
      toast.success("Password updated successfully", {
        id: updatePasswordToast,
      });
      passwordForm.reset();
    } catch (error) {
      toast.error(
        "Failed to update password. Please check your current password and try again.",
        { id: updatePasswordToast }
      );
      console.error("Failed to update password:", error);
    }
  }

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast.error("Invalid file type. Please upload a PNG or JPG image.");
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error("File is too large. Maximum size is 5MB.");
        return;
      }

      setIsImageUploading(true);
      const uploadToast = toast.loading("Uploading image...");

      try {
        const imageUrl = await uploadImage(file);
        if (imageUrl) {
          profileForm.setValue("avatarSrc", imageUrl);
          toast.success("Image uploaded successfully", { id: uploadToast });
          await profileForm.handleSubmit(onProfileSubmit)();
        }
      } catch (error) {
        console.error("Failed to upload image:", error);
        toast.error("Failed to upload image", { id: uploadToast });
      } finally {
        setIsImageUploading(false);
      }
    }
  };

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg shadow min-h-[80vh]">
      <div className="w-full flex items-center justify-between">
        <h2 className="text-xl font-semibold text-blue mb-6">
          Profile details
        </h2>
        <Link to="/">
          <Button variant="outline" className="text-blue">
            Back
          </Button>
        </Link>
      </div>

      <div className="mb-6 flex justify-start">
        <Avatar className="w-24 h-24 cursor-pointer relative group border border-black/50">
          <AvatarImage src={profileForm.watch("avatarSrc")} alt="Profile" />
          <AvatarFallback>{`${user?.firstname?.charAt(0) || ""}${
            user?.lastname?.charAt(0) || ""
          }`}</AvatarFallback>

          {/* Overlay with message, initially hidden and shown on hover */}
          <div className="absolute top-0 left-0 w-24 h-24 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 flex text-center items-center justify-center transition-opacity duration-300 cursor-pointer">
            <span className="text-white text-[12px] mt-2">
              click to change
            </span>
          </div>

          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleImageChange}
            disabled={isImageUploading}
          />
        </Avatar>
      </div>

      <Form {...profileForm}>
        <form
          onSubmit={profileForm.handleSubmit(onProfileSubmit)}
          className="w-full flex flex-col items-start gap-6"
        >
          <div className="w-full gap-4 flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 flex flex-col gap-3">
              <FormField
                control={profileForm.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full md:w-1/2 flex flex-col gap-3">
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input value={user?.email || ""} disabled />
                </FormControl>
              </FormItem>
            </div>
          </div>
          <Button type="submit" disabled={isLoading || isImageUploading}>
            {isLoading ? "Updating" : "Update Profile"}
            {isLoading ? (
              <Loader2 className="size-4 shrink-0 text-white ml-2 animate-spin" />
            ) : (
              <ArrowRight className="size-4 shrink-0 text-white ml-2" />
            )}
          </Button>
        </form>
      </Form>

      {/* <div className="mt-12">
        <h2 className="text-xl font-semibold text-blue mb-6">
          Change Password
        </h2>
        <Form {...passwordForm}>
          <form
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            className="w-full flex flex-col items-start gap-6"
          >
            <div className="w-full gap-4 flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 flex flex-col gap-3">
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="Enter current password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full md:w-1/2 flex flex-col gap-3">
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="Enter new password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button type="submit" disabled={updatePasswordStatus === "loading"}>
              {updatePasswordStatus === "loading"
                ? "Updating"
                : "Change Password"}
              {updatePasswordStatus === "loading" ? (
                <Loader2 className="size-4 shrink-0 text-white ml-2 animate-spin" />
              ) : (
                <ArrowRight className="size-4 shrink-0 text-white ml-2" />
              )}
            </Button>
          </form>
        </Form>
      </div> */}
    </div>
  );
}
