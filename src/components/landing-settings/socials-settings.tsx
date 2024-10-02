import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { useDispatch, useSelector } from "react-redux";

import {
  addSocialSettings,
  updateSocialSettings,
  fetchSocialSettings,
} from "@/redux/socials";
import { AppDispatch, RootState } from "@/provider/redux-provider";
import toast from "react-hot-toast";

// Define the structure of social settings
interface SocialSettings {
  id: string;
  socialsEnable: boolean;
  platforms: {
    [key: string]: {
      url: string;
      enabled: boolean;
    };
  };
}

// Define the structure for social permission group
interface SocialPermissionGroup {
  socialsEnable: boolean;
  platforms: {
    [key: string]: {
      url: string;
      enabled: boolean;
    };
  };
}

// Switch component
const Switch: React.FC<{
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}> = ({ checked, onCheckedChange, disabled }) => (
  <button
    className={`relative h-5 w-10 cursor-pointer rounded-full duration-200`}
    onClick={() => onCheckedChange(!checked)}
    style={{
      backgroundColor: checked ? "#052E73" : "#24252d50",
    }}
    disabled={disabled}
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
] as const;


// Zod schema for form validation
const formSchema = z.object({
  socialsEnable: z.boolean(),
  platforms: z
    .record(
      z.object({
        url: z.string().url("Invalid URL").or(z.literal("")),
        enabled: z.boolean(),
      })
    )
    .refine((data) => {
      return Object.entries(data).every(([_, platform]) =>
        !platform.enabled || (platform.enabled && platform.url !== "")
      );
    }, {
      message: "URL is required when the platform is enabled",
      path: ["platforms"],
    }),
});

type FormValues = z.infer<typeof formSchema>;

const SocialProvidersForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { settings, status } = useSelector((state: RootState) => state.socials);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      socialsEnable: false,
      platforms: Object.fromEntries(
        socialMediaPlatforms.map((platform) => [
          platform.toLowerCase(),
          { url: "", enabled: false },
        ])
      ),
    },
  });

  useEffect(() => {
    dispatch(fetchSocialSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settings.length > 0) {
      const socialData = settings[0] as unknown as SocialSettings;
      form.reset({
        socialsEnable: socialData.socialsEnable,
        platforms: socialData.platforms,
      });
    }
  }, [settings, form]);

  const onSubmit = (data: FormValues) => {
    const socialData: SocialPermissionGroup = {
      socialsEnable: data.socialsEnable,
      platforms: data.platforms,
    };

    if (settings.length > 0) {
      dispatch(
        updateSocialSettings({
          id: settings[0].id,
          socialsEnable: socialData.socialsEnable,
          socialPlatforms: Object.entries(socialData.platforms).map(([key, value]) => ({
            platform: key,
            ...value,
          })),
        })
      );
      toast.success("Social settings updated successfully");
    } else {
      dispatch(
        addSocialSettings({
          socialsEnable: socialData.socialsEnable,
          socialPlatforms: Object.entries(socialData.platforms).map(([key, value]) => ({
            platform: key,
            ...value,
          })),
        })
      );
      toast.success("Social settings added successfully");
    }
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
                <div key={platform} className="flex items-end justify-between">
                  <div className="flex-grow pr-4">
                    <Controller
                      name={`platforms.${platform.toLowerCase()}.url`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium">
                            {platform}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={
                                !socialsEnabled ||
                                !form.watch(
                                  `platforms.${platform.toLowerCase()}.enabled`
                                )
                              }
                              placeholder="Enter URL"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Controller
                    name={`platforms.${platform.toLowerCase()}.enabled`}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              if (!checked) {
                                form.setValue(
                                  `platforms.${platform.toLowerCase()}.url`,
                                  ""
                                );
                              }
                            }}
                            disabled={!socialsEnabled}
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
            disabled={status === "loading"}
          >
            {settings.length > 0 ? "Update" : "Save"} Changes
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SocialProvidersForm;
