import { useState, useCallback, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  { value: "BOG", label: "Bogota" },
];

type ConnectingAirportsField = {
  onChange: (value: string[][]) => void;
  value: string[][];
};

export function ConnectingAirportsSelector({
  field,
}: {
  field: ConnectingAirportsField;
}) {
  const [selectors, setSelectors] = useState<number[]>([]);
  const [openStates, setOpenStates] = useState<{ [key: number]: boolean }>({});
  const [inputValues, setInputValues] = useState<{ [key: number]: string }>({});
  const [localValue, setLocalValue] = useState<string[][]>([]);

  useEffect(() => {
    if (field.value && field.value.length > 0) {
      setLocalValue(field.value);
      setSelectors(field.value.map((_, index) => index));
    } else {
      setLocalValue([[]]);
      setSelectors([0]);
    }
  }, [field.value]);

  useEffect(() => {
    field.onChange(localValue);
  }, [localValue, field]);

  const handleUnselect = useCallback((index: number, cityValue: string) => {
    setLocalValue((prev) => {
      const newValue = [...prev];
      newValue[index] = newValue[index].filter((value) => value !== cityValue);
      return newValue;
    });
  }, []);

  const handleSelect = useCallback((index: number, city: City) => {
    setLocalValue((prev) => {
      const newValue = [...prev];
      if (!newValue[index]) {
        newValue[index] = [];
      }
      if (!newValue[index].includes(city.value)) {
        newValue[index] = [...newValue[index], city.value];
      }
      return newValue;
    });
    setInputValues((prev) => ({ ...prev, [index]: "" }));
  }, []);

  const addNewSelector = useCallback(() => {
    const newIndex = selectors.length;
    setSelectors((prev) => [...prev, newIndex]);
    setLocalValue((prev) => [...prev, []]);
  }, [selectors]);

  const removeSelector = useCallback((index: number) => {
    setSelectors((prev) => prev.filter((i) => i !== index));
    setLocalValue((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <div className="space-y-4">
      {selectors.map((index) => (
        <div key={index} className="relative w-[90%]">
          <Command className="overflow-visible bg-transparent">
            <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
              <div className="flex flex-wrap gap-1">
                {localValue[index]?.map((cityValue) => {
                  const city = CITIES.find((c) => c.value === cityValue);
                  return city ? (
                    <Badge key={city.value} variant="secondary">
                      {city.label}
                      <button
                        className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onClick={() => handleUnselect(index, city.value)}
                      >
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </button>
                    </Badge>
                  ) : null;
                })}
                <CommandPrimitive.Input
                  value={inputValues[index] || ""}
                  onValueChange={(value) =>
                    setInputValues((prev) => ({ ...prev, [index]: value }))
                  }
                  onBlur={() =>
                    setOpenStates((prev) => ({ ...prev, [index]: false }))
                  }
                  onFocus={() =>
                    setOpenStates((prev) => ({ ...prev, [index]: true }))
                  }
                  placeholder="Select cities..."
                  className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>
            {openStates[index] && (
              <div className="relative mt-2">
                <CommandList>
                  <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                    <CommandGroup className="h-full overflow-auto">
                      {CITIES.filter(
                        (city) => !localValue[index]?.includes(city.value)
                      ).map((city) => (
                        <CommandItem
                          key={city.value}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleSelect(index, city);
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
          {index !== 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute -right-12 top-0"
              onClick={() => removeSelector(index)}
            >
              <X className="size-5 shrink-0" />
            </Button>
          )}
        </div>
      ))}
      <Button onClick={addNewSelector} variant="outline" className="w-full">
        <Plus className="mr-2 h-4 w-4" /> Add Another Connection
      </Button>
    </div>
  );
}
