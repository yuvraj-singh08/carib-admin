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
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from "@/provider/redux-provider";
import { fetchUserById, updateUserProfile } from "@/redux/useSlice"; // Adjust the import path as needed
import { uploadImage } from "@/hooks/aws"; // Adjust the import path as needed

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const formSchema = z.object({
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

export default function ProfileForm() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);

  useEffect(() => {
    dispatch(fetchUserById());
  }, [dispatch]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user?.firstname || "",
      lastName: user?.lastname || "",
      avatarSrc: user?.avatarSrc || "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstname || "",
        lastName: user.lastname || "",
        avatarSrc: user.avatarSrc || "",
      });
    }
  }, [user, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
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
          form.setValue("avatarSrc", imageUrl);
          toast.success("Image uploaded successfully", { id: uploadToast });
          // Trigger form submission immediately after image upload
          await form.handleSubmit(onSubmit)();
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
        <Avatar className="w-24 h-24 cursor-pointer relative">
          <AvatarImage
            src={form.watch("avatarSrc") || "https://github.com/shadcn.png"}
            alt="Profile"
          />
          <AvatarFallback>{`${user?.firstname?.charAt(0) || ""}${
            user?.lastname?.charAt(0) || ""
          }`}</AvatarFallback>
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleImageChange}
            disabled={isImageUploading}
          />
        </Avatar>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col items-start gap-6"
        >
          <div className="w-full gap-4 flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 flex flex-col gap-3">
              <FormField
                control={form.control}
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
                control={form.control}
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
            {isLoading ? "Updating..." : "Update"}
            <ArrowRight className="size-4 shrink-0 text-white ml-2" />
          </Button>
        </form>
      </Form>
    </div>
  );
}
