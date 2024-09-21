import { AdminFlightSearchSchema } from "@/schemas/admin-flight-search";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Search } from "lucide-react";
import { BiReset } from "react-icons/bi";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { useEffect } from "react";

export const FlightSearchSection = () => {
  const form = useForm<z.infer<typeof AdminFlightSearchSchema>>({
    resolver: zodResolver(AdminFlightSearchSchema),
    defaultValues: {
      type: "oneway",
      airlines: [],
      from: "",
      to: "",
      departureDate: new Date(),
      flightClass: "economy",
    },
  });

  const { control, setValue, watch } = form;

  const fromValue = watch("from");
  const toValue = watch("to");

  function swapValues() {
    setValue("from", toValue);
    setValue("to", fromValue);
  }

  function onSubmit(values: z.infer<typeof AdminFlightSearchSchema>) {
    console.log(values);
  }

  function handleReset() {
    form.reset();
  }

  return (
    <div className="w-full flex items-center gap-4 bg-white border rounded-xl my-6 py-5 px-5">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 flex flex-col w-full items-center"
        >
          <div className="w-full flex items-center gap-3">
            <div className="flex gap-1 items-center justify-center">
              <FormField
                control={control}
                name="from"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="DEL"
                        {...field}
                        className="h-[60px] w-[150px] rounded-none rounded-tl-lg rounded-bl-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <img
                src="/icons/switcher.png"
                alt="direction"
                className="w-10 pt-5 shrink-0 cursor-pointer select-none"
                onClick={swapValues}
              />
              <FormField
                control={control}
                name="to"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="DEL"
                        {...field}
                        className="h-[60px] w-[150px] rounded-none rounded-tr-lg rounded-br-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="-mt-6">
                    <FormLabel className="text-gray">Way</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-xl px-3">
                          <SelectValue placeholder="Flight Way" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="oneway">One Way</SelectItem>
                        <SelectItem value="multiway">Multi Way</SelectItem>
                        <SelectItem value="roundtrip">Round Trip</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="departureDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col -mt-4">
                    <FormLabel className="text-gray">Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[110px] md:w-[140px] pl-1.5 md:pl-3 text-left font-normal text-[0.8rem] md:text-sm rounded-xl mt-4",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="flightClass"
                render={({ field }) => (
                  <FormItem className="-mt-6">
                    <FormLabel className="text-gray">Class</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-xl px-3">
                          <SelectValue placeholder="Class" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="economy">Economy Class</SelectItem>
                        <SelectItem value="business">Business Class</SelectItem>
                        <SelectItem value="first">First Class</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" className="bg-blue rounded-lg">
              <Search className="size-4 mr-1.5 shrink-0" />
              Search
            </Button>
            <Button
              variant="ghost"
              type="button"
              className="rounded-lg"
              size="sm"
              onClick={handleReset} // Call handleReset on click
            >
              <BiReset className="size-5 fill-customBlue mr-1.5 shrink-0" />
              <span className="underline text-customBlue font-medium text-lg">
                Reset All
              </span>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
