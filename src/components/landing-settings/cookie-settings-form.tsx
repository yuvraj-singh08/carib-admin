import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import toast from "react-hot-toast";
import TableLoader from "../shared/table-loader";
import PermissionButtonGroup from "../permissions/PermissionButton";

const BASE_API_URL = import.meta.env.VITE_BACKEND_URL as string;

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled: boolean;
}

const Switch: React.FC<SwitchProps> = ({
  checked,
  onCheckedChange,
  disabled,
}) => {
  const handleToggle = () => {
    if (!disabled && onCheckedChange) {
      onCheckedChange(!checked);
    }
  };

  return (
    <button
      className={`relative h-5 w-10 cursor-pointer rounded-full duration-200 ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={handleToggle}
      style={{
        backgroundColor: checked ? "#052E73" : "#24252d50",
      }}
      type="button"
      disabled={disabled}
    >
      <span
        className={cn(
          `absolute right-3 top-0 rounded-full bg-white shadow-lg transition-all duration-200`,
          checked
            ? "translate-x-full transform "
            : "translate-x-0 transform left-0",
          "size-3 m-1"
        )}
      />
    </button>
  );
};

const formSchema = z.object({
  cookieToggle: z.boolean(),
  enableLogging: z.boolean(),
  strictlyNecessaryCookies: z.boolean(),
  cookieDescription: z.string().min(1, "Cookie Description is required"),
  cookieTitle: z.string().min(1, "Cookie Title is required"),
  strictlyCookieTitle: z.string().optional(),
  strictlyCookieDescription: z.string().optional(),
  contactUsDescription: z.string().optional(),
  contactUsURL: z.string().url("Invalid URL format"),
});

const CookieSettingsForm = () => {
  const [cookieId, setCookieId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cookieToggle: false,
      enableLogging: false,
      strictlyNecessaryCookies: false,
      cookieDescription: "",
      cookieTitle: "",
      strictlyCookieTitle: "",
      strictlyCookieDescription: "",
      contactUsDescription: "",
      contactUsURL: "",
    },
  });

  useEffect(() => {
    const fetchCookies = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/admin/cookies`);
        if (response.data.cookies && response.data.cookies.length > 0) {
          const cookie = response.data.cookies[0];
          setCookieId(cookie.id);
          form.reset({
            cookieToggle: cookie.cookieToggle,
            enableLogging: cookie.enableLogging,
            strictlyNecessaryCookies: cookie.strictlyNecessaryCookies,
            cookieDescription: cookie.cookieDescription,
            cookieTitle: cookie.cookieTitle,
            strictlyCookieTitle: cookie.strictlyCookieTitle,
            strictlyCookieDescription: cookie.strictlyCookieDescription,
            contactUsDescription: cookie.contactUsDescription,
            contactUsURL: cookie.contactUsURL,
          });
        }
      } catch (error) {
        console.error("Error fetching cookies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCookies();
  }, []);
  const onSubmit = async (data: any) => {
    try {
      if (cookieId) {
        const response = await axios.post(
          `${BASE_API_URL}/admin/update-cookie`,
          {
            id: cookieId,
            ...data,
          }
        );

        if (response.data.success) {
          toast.success("Cookie settings updated successfully");
        } else {
          toast.error("Failed to update cookie");
        }
      } else {
        const response = await axios.post(
          `${BASE_API_URL}/admin/add-cookie`,
          data
        );

        if (response.data.success) {
          setCookieId(response.data.cookie.id);
          toast.success("Cookie settings saved successfully");
        } else {
          toast.error("Failed to create new cookie");
        }
      }

      console.log("Cookie settings saved successfully");
    } catch (error: any) {
      console.error("Error saving cookie settings:", error);

      if (error.response && error.response.data) {
        toast.error(`Error: ${error.response.data.error || "Unknown error"}`);
      } else {
        toast.error("Error saving cookie settings");
      }
    }
  };

  if (isLoading) {
    return <TableLoader />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full bg-white rounded-xl pb-10"
      >
        {/* Main Cookie Toggle */}
        <Card className="mt-4 shadow-none border-none">
          <CardHeader className="w-full flex flex-row items-center justify-between">
            <CardTitle className="text-blue text-lg">Cookie Settings</CardTitle>
            <FormField
              control={form.control}
              name="cookieToggle"
              render={({ field }) => (
                <FormItem className="flex justify-between items-center">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked: boolean) => {
                        field.onChange(checked);
                        // Update all other toggle fields when main toggle changes
                        form.setValue("enableLogging", checked);
                        form.setValue("strictlyNecessaryCookies", checked);
                      }}
                      disabled={false} // Add the disabled property
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardHeader>
        </Card>

        {/* Cookie Settings Form Fields */}
        <Card className="shadow-none border-none">
          <CardContent className="w-full flex gap-4">
            {/* Left Column */}
            <div className="w-1/2 flex flex-col gap-3">
              {/* Enable Logging Switch */}
              <FormField
                control={form.control}
                name="enableLogging"
                render={({ field }) => (
                  <FormItem className="flex justify-between items-center">
                    <FormLabel>Enable Logging</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!form.watch("cookieToggle")}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {/* Cookie Title */}
              <FormField
                control={form.control}
                name="cookieTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cookie Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!form.watch("cookieToggle")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Cookie Description */}
              <FormField
                control={form.control}
                name="cookieDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cookie Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="resize-none h-[100px]"
                        disabled={!form.watch("cookieToggle")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Right Column */}
            <div className="w-1/2 flex flex-col gap-3">
              {/* Strictly Necessary Cookies Switch */}
              <FormField
                control={form.control}
                name="strictlyNecessaryCookies"
                render={({ field }) => (
                  <FormItem className="flex justify-between items-center">
                    <FormLabel>Strictly Necessary Cookies</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!form.watch("cookieToggle")}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {/* Strictly Cookie Title */}
              <FormField
                control={form.control}
                name="strictlyCookieTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Strictly Cookie Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!form.watch("cookieToggle")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Strictly Cookie Description */}
              <FormField
                control={form.control}
                name="strictlyCookieDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Strictly Cookie Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="resize-none h-[100px]"
                        disabled={!form.watch("cookieToggle")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* More Information Card */}
        <Card className="w-full shadow-none border-none">
          <CardHeader>
            <CardTitle className="text-blue">More Information</CardTitle>
          </CardHeader>
          <CardContent className="w-full flex gap-4">
            {/* Contact Us Description */}
            <FormField
              control={form.control}
              name="contactUsDescription"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Contact Us Description</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!form.watch("cookieToggle")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Contact Us URL */}
            <FormField
              control={form.control}
              name="contactUsURL"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Contact Us URL</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!form.watch("cookieToggle")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Save Button */}
        <PermissionButtonGroup
          resource="landing_page"
          action={cookieId ? "update" : "create"}
        >
          <div className="w-full flex items-center justify-end px-5">
            <Button type="submit" className="w-[120px]">
              {cookieId ? "Update" : "Save"} Changes
            </Button>
          </div>
        </PermissionButtonGroup>
      </form>
    </Form>
  );
};

export default CookieSettingsForm;
