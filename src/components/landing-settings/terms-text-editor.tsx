import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/provider/redux-provider";
import {
  addPrivacyPolicy,
  updatePrivacyPolicy,
  getPrivacyPolicies,
} from "@/redux/privacy-settings"; 
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  isEnabled: z.boolean().default(false),
  content: z
    .string()
    .optional()
    .refine((val) => !val || val.trim().length > 0, {
      message: "Content cannot be empty when enabled",
    }),
});

const TermsConditionsForm: React.FC = () => {
  const dispatch = useDispatch();
  const privacyPolicies = useSelector(
    (state: RootState) => state.privacy.privacyPolicies
  );
  const status = useSelector((state: RootState) => state.privacy.status);

  const [ConfirmDialogue, confirm] = useConfirm(
    "Reset Terms & Conditions",
    "Are you sure you want to delete this content? This action cannot be undone."
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isEnabled: false,
      content: "",
    },
  });

  const { isEnabled } = form.watch();

  useEffect(() => {
    dispatch(getPrivacyPolicies() as any);
  }, [dispatch]);

  useEffect(() => {
    if (privacyPolicies.length > 0) {
      const latestPolicy = privacyPolicies[0];
      form.reset({
        isEnabled: latestPolicy.isEnabled,
        content: latestPolicy.content[0]?.value || "",
      });
    }
  }, [privacyPolicies, form]);

  const modules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      [{ align: [] }],
    ],
  };

  const formats = [
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
    "link",
    "image",
    "align",
  ];

  const formatContent = (content: string): string => {
    // This function ensures proper HTML formatting
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    return doc.body.innerHTML;
  };

  const onSubmit = async (data: any) => {
    const formattedContent = formatContent(data.content);
    const formData = {
      isEnabled: data.isEnabled,
      content: data.isEnabled
        ? [{ type: "privacy-policies", value: formattedContent }]
        : [],
    };

    try {
      if (privacyPolicies.length > 0) {
        await dispatch(
          updatePrivacyPolicy({ ...formData, id: privacyPolicies[0].id }) as any
        );
        toast.success("Privacy policy updated successfully.");
      } else {
        await dispatch(addPrivacyPolicy(formData) as any);
        toast.success("Privacy policy added successfully.");
      }
    } catch (error) {
      toast.error("Failed to save privacy policy. Please try again.");
    }
  };

  const handleReset = async () => {
    const ok = await confirm();
    if (ok) {
      const resetData = {
        isEnabled: false,
        content: "",
      };

      form.reset(resetData);

      try {
        if (privacyPolicies.length > 0) {
          await dispatch(
            updatePrivacyPolicy({
              ...resetData,
              content: [],
              id: privacyPolicies[0].id,
            }) as any
          );
          toast.success(
            "Privacy policy has been reset and updated in the database."
          );
        } else {
          toast.success("Privacy policy form has been reset.");
        }
      } catch (error) {
        toast.error("Failed to reset privacy policy. Please try again.");
      }
    }
  };

  return (
    <>
      <ConfirmDialogue />
      <div className="w-full h-full bg-white rounded-xl min-h-screen">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full mx-auto p-6"
          >
            <FormField
              control={form.control}
              name="isEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Terms & Conditions</FormLabel>
                    <FormDescription>
                      Enable or disable the terms & conditions on the frontend
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <ReactQuill
                      theme="snow"
                      value={field.value}
                      onChange={field.onChange}
                      modules={modules}
                      formats={formats}
                      className="h-80"
                      readOnly={!isEnabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full flex items-center justify-end pt-14 gap-5">
              <Button
                type="button"
                onClick={handleReset}
                variant="outline"
                className="bg-gray-200"
              >
                Reset
              </Button>
              <Button type="submit" disabled={status === "loading"}>
                {privacyPolicies.length > 0
                  ? status === "loading"
                    ? "Updating"
                    : "Update Changes"
                  : "Save Changes"}
                {status === "loading" && (
                  <Loader2 className="size-5 shrink-0 animate-spin text-white ml-1" />
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default TermsConditionsForm;
