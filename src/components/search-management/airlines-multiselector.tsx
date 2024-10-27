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

type Airline = {
  value: string;
  label: string;
};

const AIRLINES: Airline[] = [
  { value: "DO", label: "Sky High Airlines" },
  { value: "9V", label: "Avior Airlines" },
  { value: "CM", label: "Copa Airlines" },
  { value: "IB", label: "Iberia" },
  { value: "UX", label: "Air Europa" },
  { value: "QL", label: "Laser Airlines" },
  { value: "L5", label: "Aerosur Airlines" }
];

export function AirlinesMultiSelect({ field }: { field: any }) {
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
    return AIRLINES.filter((airline) => field.value.includes(airline.value));
  }, [field.value]);

  const handleUnselect = React.useCallback(
    (airline: Airline) => {
      const newValue = field.value.filter(
        (value: string) => value !== airline.value
      );
      field.onChange(newValue);
    },
    [field]
  );

  const handleSelect = React.useCallback(
    (airline: Airline) => {
      const newValue = [...field.value, airline.value];
      field.onChange(newValue);
      setInputValue("");
    },
    [field]
  );

  const selectables = React.useMemo(() => {
    const filtered = AIRLINES.filter((airline) => !field.value.includes(airline.value));
    if (!inputValue) return filtered;
    return filtered.filter(
      airline => airline.label.toLowerCase().includes(inputValue.toLowerCase()) ||
                airline.value.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [field.value, inputValue]);

  return (
    <Command className="overflow-visible bg-transparent">
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selected.map((airline) => (
            <Badge key={airline.value} variant="secondary">
              {airline.label}
              <button
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={() => handleUnselect(airline)}
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
            placeholder="Select airlines..."
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      {open && selectables.length > 0 && (
        <div className="relative mt-2">
          <CommandList>
            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="h-full overflow-auto">
                {selectables.map((airline) => (
                  <CommandItem
                    key={airline.value}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect(airline);
                    }}
                    className="cursor-pointer"
                  >
                    {airline.label} ({airline.value})
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