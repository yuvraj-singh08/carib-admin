import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  { value: "L5", label: "Aerosur Airlines" },
];

interface AirlinesMultiSelectProps {
  field: {
    value: string[];
    onChange: (value: string[]) => void;
  };
}

export function AirlinesMultiSelect({ field }: AirlinesMultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [customAirlines, setCustomAirlines] = React.useState<Airline[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Ensure field.value is always an array
  const selectedValues = Array.isArray(field.value) ? field.value : [];

  // Combine default and custom airlines
  const allAirlines = React.useMemo(() => {
    return [...AIRLINES, ...customAirlines];
  }, [customAirlines]);

  // Get selected airlines
  const selected = React.useMemo(() => {
    return allAirlines.filter((airline) =>
      selectedValues.includes(airline.value)
    );
  }, [selectedValues, allAirlines]);

  // Get filtered airlines for dropdown
  const filteredAirlines = React.useMemo(() => {
    const filtered = allAirlines.filter(
      (airline) => !selectedValues.includes(airline.value)
    );

    if (!inputValue) return filtered;

    return filtered.filter(
      (airline) =>
        airline.label.toLowerCase().includes(inputValue.toLowerCase()) ||
        airline.value.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [selectedValues, inputValue, allAirlines]);

  const handleUnselect = React.useCallback(
    (airline: Airline) => {
      const newValue = selectedValues.filter(
        (value) => value !== airline.value
      );
      field.onChange(newValue);
    },
    [field, selectedValues]
  );

  const handleSelect = React.useCallback(
    (airline: Airline) => {
      const newValue = [...selectedValues, airline.value];
      field.onChange(newValue);
      setInputValue("");
      if (inputRef.current) {
        inputRef.current.focus();
      }
    },
    [field, selectedValues]
  );

  const createNewAirline = React.useCallback(
    (label: string) => {
      const newValue = label;
      const newAirline: Airline = {
        value: newValue,
        label: label.trim(),
      };

      setCustomAirlines((prev) => [...prev, newAirline]);
      handleSelect(newAirline);
    },
    [handleSelect]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && inputValue.trim()) {
        e.preventDefault();
        e.stopPropagation();

        // Check if input matches any existing airline
        const existingAirline = allAirlines.find(
          (airline) =>
            airline.label.toLowerCase() === inputValue.toLowerCase() ||
            airline.value.toLowerCase() === inputValue.toLowerCase()
        );

        if (existingAirline) {
          handleSelect(existingAirline);
        } else {
          createNewAirline(inputValue);
        }
      }
    },
    [inputValue, allAirlines, handleSelect, createNewAirline]
  );

  // Handle click outside to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full">
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selected.map((airline) => (
            <Badge key={airline.value} variant="secondary">
              {airline.label}
              <button
                type="button"
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={(e) => {
                  e.preventDefault();
                  handleUnselect(airline);
                }}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setOpen(true)}
            placeholder="Select or type new airline..."
            className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground min-w-[120px]"
          />
        </div>
      </div>

      {open && filteredAirlines.length > 0 && (
        <div className="absolute mt-2 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in z-50">
          <div className="overflow-auto max-h-[200px] no-scrollbar">
            {filteredAirlines.map((airline) => (
              <button
                key={airline.value}
                className="w-full px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground flex items-center justify-between"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(airline);
                }}
              >
                <span>{airline.label}</span>
                <span className="text-xs text-muted-foreground">
                  ({airline.value})
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AirlinesMultiSelect;
