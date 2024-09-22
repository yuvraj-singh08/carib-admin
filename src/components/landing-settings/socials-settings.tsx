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

const Switch = ({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) => (
  <button
    className={`relative h-5 w-10 cursor-pointer rounded-full duration-200`}
    onClick={() => onCheckedChange(!checked)}
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

const socialMediaPlatforms = [
  "Facebook",
  "Instagram",
  "Youtube",
  "X",
  "LinkedIn",
  "Whatsapp",
  "Telegram",
  "Discord",
  "Tiktok",
  "Snapchat",
];

const formSchema = z.object({
  socialsEnable: z.boolean(),
  ...Object.fromEntries(
    socialMediaPlatforms.map((platform) => [
      platform.toLowerCase(),
      z
        .object({
          url: z
            .string()
            .url("Invalid URL")
            .optional()
            .or(z.literal("")), // Allows empty string for disabled providers
          enabled: z.boolean(),
        })
        .refine(
          (data) => !data.enabled || (data.enabled && data.url !== ""),
          {
            message: "URL is required when the provider is enabled",
            path: ["url"], // Apply the error to the URL field
          }
        ),
    ])
  ),
});

type FormValues = z.infer<typeof formSchema>;

const SocialProvidersForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      socialsEnable: true,
      ...Object.fromEntries(
        socialMediaPlatforms.map((platform) => [
          platform.toLowerCase(),
          { url: "", enabled: false },
        ])
      ),
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  const socialsEnabled = form.watch("socialsEnable");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full bg-white rounded-xl p-6"
      >
        <Card className="shadow-none border-none">
          <CardHeader className="px-0 pt-0 flex flex-row items-center justify-between">
            <CardTitle className="text-blue text-xl font-semibold">
              Social Media
            </CardTitle>
            <FormField
              control={form.control}
              name="socialsEnable"
              render={({ field }) => (
                <FormItem>
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
          <CardContent className="px-0 py-2">
            <div className="grid grid-cols-2 gap-6">
              {socialMediaPlatforms.map((platform) => (
                <div
                  key={platform}
                  className="flex items-end justify-between"
                >
                  <div className="flex-grow pr-4">
                    <FormField
                      control={form.control}
                      name={`${platform.toLowerCase()}.url` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium">
                            {platform}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={!socialsEnabled}
                              placeholder="Enter URI"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name={`${platform.toLowerCase()}.enabled` as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end mt-6">
          <Button
            type="submit"
            className="bg-blue text-white px-6 py-2 rounded"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SocialProvidersForm;
