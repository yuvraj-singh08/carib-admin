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
} from "@/components/ui/form"; // ShadCN form utilities
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";

const Switch = ({
  checked,
  onCheckedChange,
}: {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}) => {
  const handleToggle = () => {
    const newState = !checked;
    if (onCheckedChange) {
      onCheckedChange(newState);
    }
  };

  return (
    <button
      className={`relative h-5 w-10 cursor-pointer rounded-full duration-200`}
      onClick={handleToggle}
      style={{
        backgroundColor: checked ? "#052E73" : "#24252d50",
      }}
      type="button"
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
  strictlyCookieTitle: z.string().min(1, "Strictly Cookie Title is required"),
  strictlyCookieDescription: z
    .string()
    .min(1, "Strictly Cookie Description is required"),
  contactUsDescription: z.string().min(1, "Contact Us Description is required"),
  contactUsURL: z.string().url("Invalid URL format"),
});

const CookieSettingsForm = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cookieToggle: true,
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

  const onSubmit = (data: any) => {
    console.log(data);
  };

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
                      onCheckedChange={field.onChange}
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
        <div className="w-full flex items-center justify-end px-5">
          <Button type="submit" className="w-[120px]">
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CookieSettingsForm;
