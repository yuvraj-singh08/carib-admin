import { z } from "zod";
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";


const formSchema = z.object({
  cabinBaggage: z.string().min(1, "Cabin Baggage is required"),
  checkedBaggage: z.string().min(1, "Checked Baggage is required"),
});

const BaggageSettings = () => {





    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        cabinBaggage: "",
        checkedBaggage: "",
      },
    });

    const onSubmit = (data: any) => {
      console.log("Submitting form data:", data);
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
          <CardContent className="grid grid-cols-2 gap-40 mt-4">
            <FormField
              control={form.control}
              name="cabinBaggage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cabin Baggage</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                    <Input {...field} />
                    <span>Kg</span></div>
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
                    <Input {...field} />
                    <span>Kg</span></div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
           
          </CardContent>
        </Card>

        <div className="w-full flex items-center justify-end gap-4 mt-6 px-5">
          <Button
            type="submit"
            className="bg-blue text-white"
          >
            Update Baggage
          </Button>
        </div>
      </form>
    </Form>
      </div>
    </div>
  )
}

export default BaggageSettings