import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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

const formSchema = z
  .object({
    fullName: z.string().min(2, {
      message: "Full name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string(),
    profileImage: z.string().optional(), // Optional profile image
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function ProfileForm() {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      profileImage: null as string | null,
    },
  });

  function onSubmit(values: any) {
    console.log("Form Data:", values);
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);

      form.setValue("profileImage", imageUrl);
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

      {/* Avatar section with image upload */}
      <div className="mb-6 flex justify-start">
        <Avatar className="w-24 h-24 cursor-pointer relative">
          <AvatarImage
            src={profileImage || "https://github.com/shadcn.png"}
            alt="Profile"
          />
          <AvatarFallback>JD</AvatarFallback>

          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleImageChange}
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
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your full name*</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your email*</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full md:w-1/2 flex flex-col gap-3">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password*</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password*</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Submit Button */}
          <Button type="submit">
            Update
            <ArrowRight className="size-4 shrink-0 text-white ml-2" />
          </Button>
        </form>
      </Form>
    </div>
  );
}
