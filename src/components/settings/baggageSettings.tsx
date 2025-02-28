import { z } from "zod";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { axiosInstance } from "@/provider/axios";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { Loader } from "lucide-react";

const formSchema = z.object({
  cabinBaggage: z.string().optional(),
  checkedBaggage: z.string().optional(),
});

const BaggageSettings = () => {
  const [loading, setLoading] = useState(false);
  const [baggageData, setBaggageData] = useState<any[]>([]);

  const apiUrl = import.meta.env.VITE_BACKEND_URL as string;

  // Fetch baggage data when component mounts
  useEffect(() => {
    const fetchBaggageData = async () => {
      try {
        const response = await axiosInstance.get(`${apiUrl}/admin/baggage`);
        console.log("Baggage settings:", response.data);
        setBaggageData(response.data || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBaggageData();
  }, [apiUrl]);

  // Initialize form after data is loaded
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cabinBaggage: baggageData?.[0]?.weight || "",
      checkedBaggage: baggageData?.[1]?.weight || "",
    },
  });

  // Update form values when baggageData changes
  useEffect(() => {
    if (baggageData && baggageData.length > 0) {
      form.reset({
        cabinBaggage: baggageData[0]?.weight || "",
        checkedBaggage: baggageData[1]?.weight || "",
      });
    }
  }, [baggageData, form]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    console.log("Submitting form data:", data);
    try {
      if (data.cabinBaggage) {
        await axiosInstance.put(
          `${apiUrl}/admin/baggage/452ea6a5-eb79-41cf-af56-e323f55cac1f`,
          { weight: data.cabinBaggage, type: "CABIN" }
        );
      }
      if (data.checkedBaggage) {
        await axiosInstance.put(
          `${apiUrl}/admin/baggage/c9a36f06-7fbd-4041-8421-9648acbeb65c`,
          { weight: data.checkedBaggage, type: "CHECKED" }
        );
      }
      if (data.cabinBaggage && data.checkedBaggage) {
        toast.success("Baggage settings updated successfully");
      } else if (data.checkedBaggage) {
        toast.success("Checked Baggage updated successfully");
      } else if (data.cabinBaggage) {
        toast.success("Cabin Baggage updated successfully");
      }
    } catch (error) {
      toast.error("Error updating baggage settings");
      console.log("Error updating baggage settings:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-md">
      <div className="w-full">
        <h1>Baggage Settings</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full bg-white rounded-xl pb-10 pt-6"
          >
            <Card className="shadow-none border-none">
              <CardContent className="grid grid-cols-2 gap-20 mt-4">
                <FormField
                  control={form.control}
                  name="cabinBaggage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cabin Baggage</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input type="number" {...field} />
                          <span>Kg</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="checkedBaggage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Checked Baggage</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input type="number" {...field} />
                          <span>Kg</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="w-full flex items-center justify-end gap-4 mt-6 px-5">
              <Button type="submit" className="bg-blue text-white">
                {loading ? (
                  <>
                    Updating...
                    <Loader className="ml-2 size-5 shrink-0 animate-spin" />
                  </>
                ) : (
                  "Update Baggage"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default BaggageSettings;
