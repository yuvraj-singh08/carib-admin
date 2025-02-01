import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  getEmailSMTPs,
  addEmailSMTP,
  updateEmailSMTP,
} from "@/redux/email-smtp";
import { AppDispatch, RootState } from "@/provider/redux-provider"; // Update this path
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import PermissionButtonGroup from "../permissions/PermissionButton";

const formSchema = z.object({
  mailDriver: z.string().min(1, "Mail Driver is required"),
  mailDriverHost: z.string().min(1, "Mail Driver Host is required"),
  mailPort: z.string().regex(/^\d+$/, "Mail Port must be a number"),
  mailUsername: z.string().email("Invalid email format"),
  mailPassword: z.string().min(1, "Mail Password is required"),
  mailEncryption: z.string().min(1, "Mail Encryption is required"),
  mailFromAddress: z.string().email("Invalid email format"),
  mailFromName: z.string().min(1, "Mail From Name is required"),
});

const EMailSettingsForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { emailSMTPs, status } = useSelector(
    (state: RootState) => state.emailSmtp
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mailDriver: "",
      mailDriverHost: "",
      mailPort: "",
      mailUsername: "",
      mailPassword: "",
      mailEncryption: "",
      mailFromAddress: "",
      mailFromName: "",
    },
  });

  useEffect(() => {
    dispatch(getEmailSMTPs());
  }, [dispatch]);

  useEffect(() => {
    if (emailSMTPs.length > 0) {
      const existingSettings = emailSMTPs[0];
      form.reset(existingSettings);
    }
  }, [emailSMTPs, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const isValid = await form.trigger();
    if (isValid) {
      if (emailSMTPs.length > 0) {
        dispatch(updateEmailSMTP({ ...data, id: emailSMTPs[0].id }))
          .then(() => toast.success("SMTP settings updated successfully!"))
          .catch(() => toast.error("Failed to update SMTP settings"));
      } else {
        dispatch(addEmailSMTP(data))
          .then(() => toast.success("SMTP settings saved successfully!"))
          .catch(() => toast.error("Failed to save SMTP settings"));
      }
    }
  };

  const handleSendTestMail = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      const formData = form.getValues();
      console.log("Send Test Mail:", formData);

      toast.success("Test mail sent successfully!");
    } else {
      toast.error("Please fill the form correctly before sending a test mail.");
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full bg-white rounded-xl pb-10 pt-6"
      >
        <Card className="shadow-none border-none">
          <CardContent className="grid grid-cols-3 gap-4 mt-4">
            <FormField
              control={form.control}
              name="mailDriver"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mail Driver</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mailDriverHost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mail Driver Host</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mailPort"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mail Port</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mailUsername"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mail Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mailPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mail Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mailEncryption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mail Encryption</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mailFromAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mail From Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mailFromName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mail From Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="w-full flex items-center justify-end gap-4 mt-6 px-5">
          <Button
            type="button"
            onClick={handleSendTestMail}
            className="bg-blue text-white"
          >
            Send test mail
          </Button>
          <PermissionButtonGroup resource="settings" action="create|update">
            <Button type="submit" className="bg-blue text-white">
              {emailSMTPs.length > 0
                ? status === "loading"
                  ? "Updating"
                  : "Update Changes"
                : status === "loading"
                ? "Saving"
                : "Save Changes"}
              {status === "loading" && (
                <Loader2 className="size-5 shrink-0 animate-spin text-white ml-1" />
              )}
            </Button>
          </PermissionButtonGroup>
        </div>
      </form>
    </Form>
  );
};

export default EMailSettingsForm;
