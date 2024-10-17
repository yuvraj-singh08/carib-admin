import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

type City = {
  value: string;
  label: string;
};

const CITIES: City[] = [
  { value: "CCS", label: "Caracas" },
  { value: "SDQ", label: "Santo Domingo" },
  { value: "MIA", label: "Miami" },
  { value: "VLN", label: "Valencia, Venezuela" },
  { value: "JFK", label: "New York (JFK)" },
  { value: "LAX", label: "Los Angeles" },
];

export function CityAirportsMultiSelect({ field }: { field: any }) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  // Use a ref to store the previous value of field.value
  const prevFieldValueRef = React.useRef(field.value);

  React.useEffect(() => {
    // Only update if the field value has actually changed
    if (
      JSON.stringify(prevFieldValueRef.current) !== JSON.stringify(field.value)
    ) {
      prevFieldValueRef.current = field.value;
    }
  }, [field.value]);

  const selected = React.useMemo(() => {
    return CITIES.filter((city) => field.value.includes(city.value));
  }, [field.value]);

  const handleUnselect = React.useCallback(
    (city: City) => {
      const newValue = field.value.filter(
        (value: string) => value !== city.value
      );
      field.onChange(newValue);
    },
    [field]
  );

  const handleSelect = React.useCallback(
    (city: City) => {
      const newValue = [...field.value, city.value];
      field.onChange(newValue);
      setInputValue("");
    },
    [field]
  );

  const selectables = React.useMemo(() => {
    return CITIES.filter((city) => !field.value.includes(city.value));
  }, [field.value]);

  return (
    <Command className="overflow-visible bg-transparent">
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selected.map((city) => (
            <Badge key={city.value} variant="secondary">
              {city.label}
              <button
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={() => handleUnselect(city)}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
          <CommandPrimitive.Input
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder="Select cities..."
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      {open && selectables.length > 0 && (
        <div className="relative mt-2">
          <CommandList>
            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="h-full overflow-auto">
                {selectables.map((city) => (
                  <CommandItem
                    key={city.value}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect(city);
                    }}
                    className="cursor-pointer"
                  >
                    {city.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          </CommandList>
        </div>
      )}
    </Command>
  );
}
