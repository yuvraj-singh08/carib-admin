import React from "react";
import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { ArrowRightLeft, CalendarIcon, LucideIcon, Search } from "lucide-react";
import { BiReset } from "react-icons/bi";
import { User, Baby, Luggage, Briefcase } from "lucide-react";
import { AdminFlightSearchSchema } from "@/schemas/admin-flight-search";

export const FlightSearchSection = () => {
  const form = useForm({
    resolver: zodResolver(AdminFlightSearchSchema),
    defaultValues: {
      type: "oneway",
      from: "",
      to: "",
      airline: "Amadeus",
      departureDate: new Date(),
      flightClass: "first",
      passengers: {
        adults: 1,
        children: 0,
        infants: 0,
      },
      bags: {
        cabinBaggage: 1,
        checkedBaggage: 0,
      },
    },
  });

  const { control, setValue, watch, handleSubmit } = form;

  const fromValue = watch("from");
  const toValue = watch("to");

  function swapValues() {
    setValue("from", toValue);
    setValue("to", fromValue);
  }

  function onSubmit(values: any) {
    console.log(values);
    // Further submission logic can go here
  }

  function handleReset() {
    form.reset({
      type: "oneway",
      from: "",
      to: "",
      airline: "",
      flightClass: "first",
      passengers: {
        adults: 1,
        children: 0,
        infants: 0,
      },
      bags: {
        cabinBaggage: 1,
        checkedBaggage: 0,
      },
    });
  }

  interface PassengerSelectorProps {
    label: string;
    icon: LucideIcon; // Specify that icon is a LucideIcon
    field: string; // The name of the field for passengers
    minValue?: number; // Optional minimum value
  }

  const PassengerSelector: React.FC<PassengerSelectorProps> = ({
    label,
    icon: Icon,
    field,
    minValue = 0,
  }) => {
    const { setValue, watch } = useFormContext();
    const currentValue = watch(field);

    return (
      <div className="flex justify-between items-center py-1">
        <div className="flex items-center gap-2">
          <Icon size={20} />
          <span>{label}</span>
        </div>
        <div className="flex items-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setValue(field, Math.max(minValue, currentValue - 1))
            }
            disabled={currentValue <= minValue}
          >
            -
          </Button>
          <span className="mx-2 w-6 text-center">{currentValue}</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setValue(field, currentValue + 1)}
          >
            +
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-white border rounded-xl mt-3 py-5 pl-3">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 md:gap-2 items-start md:items-center">
            <div className="flex items-center">
              <FormField
                control={control}
                name="from"
                render={({ field }) => (
                  <FormItem className="w-[130px]">
                    <FormLabel>From</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="From"
                        className="h-12 pl-3 pr-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="outline"
                onClick={swapValues}
                className="mx-2 my-1 rounded-full size-8 mt-8"
              >
                <ArrowRightLeft className="size-4 shrink-0" />
              </Button>
              <FormField
                control={control}
                name="to"
                render={({ field }) => (
                  <FormItem className="w-[130px]">
                    <FormLabel>To</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="To"
                        className="h-12 pl-3 pr-10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={control}
              name="type"
              render={({ field }) => (
                <FormItem className="-mt-2.5">
                  <FormLabel>Way</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-9 w-[130px] rounded-xl">
                        <SelectValue placeholder="Flight Way" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="oneway">One Way</SelectItem>
                      <SelectItem value="roundtrip">Round Trip</SelectItem>
                      <SelectItem value="multiway">Multi-way</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="airline"
              render={({ field }) => (
                <FormItem className="-mt-2.5">
                  <FormLabel>Airline's</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[130px] rounded-xl">
                        <SelectValue placeholder="Supplier" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="amadeus">Amadeus</SelectItem>
                      <SelectItem value="kiusys">Kiusys</SelectItem>
                      <SelectItem value="duffel">Duffel</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="departureDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "h-9 rounded-xl w-[120px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          {!field.value && (
                            <CalendarIcon className="size-4 shrink-0 ml-2" />
                          )}
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
              control={control}
              name="flightClass"
              render={({ field }) => (
                <FormItem className="-mt-2">
                  <FormLabel>Class</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-9 rounded-xl max-w-[130px]">
                        <SelectValue placeholder="Flight Class" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="economy">Economy</SelectItem>
                      <SelectItem value="premium_economy">
                        Premium Economy
                      </SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="first">First Class</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="passengers"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Passengers</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="h-9 rounded-xl">
                          {field.value.adults +
                            field.value.children +
                            field.value.infants}{" "}
                          Guest
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-4">
                          <h4 className="font-semibold mb-2">Passenger</h4>
                          <PassengerSelector
                            label="Adult (Over 11)"
                            icon={User}
                            field="passengers.adults"
                            minValue={1}
                          />
                          <PassengerSelector
                            label="Child (2-11)"
                            icon={Baby}
                            field="passengers.children"
                          />
                          <PassengerSelector
                            label="Infant (Under 2)"
                            icon={Luggage}
                            field="passengers.infants"
                          />
                          <h4 className="font-semibold mb-2">Baggage</h4>
                          <PassengerSelector
                            label="Cabin Baggage"
                            icon={Luggage}
                            field="bags.cabinBaggage"
                          />
                          <PassengerSelector
                            label="Checked Baggage"
                            icon={Briefcase}
                            field="bags.checkedBaggage"
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full flex items-center justify-center gap-2">
            <Button type="submit" variant="default" className="h-8">
              <Search className="mr-2" />
              Search
            </Button>
            <Button
              type="button"
              onClick={handleReset}
              variant="outline"
              className="h-8"
            >
              <BiReset className="mr-2" />
              Reset
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
