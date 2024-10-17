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
import { useController } from "react-hook-form";

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
  const { field: formField, fieldState } = useController({
    name: field.name,
    control: field.control,
  });

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<City[]>([]);
  const [inputValue, setInputValue] = React.useState("");

  // Update selected cities when formField.value changes (e.g., when editing or resetting)
  React.useEffect(() => {
    if (formField.value && Array.isArray(formField.value)) {
      const initialSelected = CITIES.filter((city) =>
        formField.value.includes(city.value)
      );
      setSelected(initialSelected);
    } else {
      setSelected([]);
    }
  }, [formField.value]);

  // Sync selected cities with the form state
  React.useEffect(() => {
    const selectedValues = selected.map((city) => city.value);
    formField.onChange(selectedValues);
  }, [selected, formField]);

  // Handle unselecting a city
  const handleUnselect = (city: City) => {
    setSelected((prev) => prev.filter((s) => s.value !== city.value));
  };

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "" && selected.length > 0) {
          setSelected((prev) => {
            const newSelected = [...prev];
            newSelected.pop();
            return newSelected;
          });
        }
      }
      if (e.key === "Escape") {
        input.blur();
      }
    }
  };

  // Filter out already selected cities
  const selectables = CITIES.filter(
    (city) => !selected.find((s) => s.value === city.value)
  );

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
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
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder="Select cities..."
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      {fieldState.error && (
        <div className="text-red-500 text-sm mt-1">
          {fieldState.error.message}
        </div>
      )}
      {open && selectables.length > 0 && (
        <div className="relative mt-2">
          <CommandList>
            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="h-full overflow-auto">
                {selectables.map((city) => (
                  <CommandItem
                    key={city.value}
                    onMouseDown={(e) => e.preventDefault()}
                    onSelect={() => {
                      setInputValue("");
                      setSelected((prev) => [...prev, city]);
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