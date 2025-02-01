import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import PermissionButtonGroup from "../permissions/PermissionButton";

// Define the Zod schema for validation
const schema = z.object({
  environment: z.enum(["Test", "Live"]),
  publishableKey: z.string().min(1, "Publishable key is required"),
  secret: z.string().min(1, "Secret is required"),
  webhookSigningSecret: z.string().min(1, "Webhook signing secret is required"),
});

export default function ManagePaymentGateway() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      environment: "Test",
      publishableKey: "",
      secret: "",
      webhookSigningSecret: "",
    },
  });

  const onSubmit = (data: any) => {
    alert("Form submitted successfully");
    console.log(data);
    form.reset();
  };

  return (
    <div className="w-full flex flex-col gap-3 bg-white">
      <div className="w-full flex items-center justify-start px-5 pt-3">
        <img
          src="/icons/stripe.png"
          alt="icon"
          className="w-24 h-auto shrink-0"
        />
      </div>
      <img
        src="/icons/dotted.png"
        alt="icon"
        className="w-full h-auto shrink-0"
      />
      <RadioGroup defaultValue="stripe">
        <Card className="w-full border-none -mt-3">
          <CardHeader>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="stripe" id="stripe" />
              <Label htmlFor="stripe" className="text-md font-semibold">
                Stripe Status
              </Label>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="environment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Environment</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select environment" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Test">Test</SelectItem>
                          <SelectItem value="Live">Live</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <div className="flex flex-col md:flex-row w-full gap-3 md:gap-5">
                  <FormField
                    control={form.control}
                    name="publishableKey"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Test Stripe Publishable Key</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter publishable key"
                            {...field}
                          />
                        </FormControl>
                        {form.formState.errors.publishableKey && (
                          <span className="text-red-600">
                            {form.formState.errors.publishableKey.message}
                          </span>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="secret"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Test Stripe Secret</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter secret"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        {form.formState.errors.secret && (
                          <span className="text-red-600">
                            {form.formState.errors.secret.message}
                          </span>
                        )}
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="webhookSigningSecret"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Test Stripe Webhook Signing Secret</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter webhook signing secret"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      {form.formState.errors.webhookSigningSecret && (
                        <span className="text-red-600">
                          {form.formState.errors.webhookSigningSecret.message}
                        </span>
                      )}
                    </FormItem>
                  )}
                />

                <div className="flex items-center w-full justify-end">
                  <PermissionButtonGroup resource="settings" action="create">
                    <Button type="submit" className="w-[120px]">
                      Save Changes
                    </Button>
                  </PermissionButtonGroup>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </RadioGroup>
    </div>
  );
}
