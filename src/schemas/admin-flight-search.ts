import z from "zod";

export const AdminFlightSearchSchema = z.object({
  type: z.enum(["oneway", "roundtrip", "multiway"], {
    message: "You need to select a flight way type.",
  }),
  airlines: z.array(z.string(), { message: "Select at least one airline." }),
  from: z.string().min(2, { message: "Enter departure location" }),
  to: z.string().min(2, { message: "Enter arrival location" }),
  departureDate: z.date({
    message: "Enter Departure Date",
  }),
  flightClass: z.enum(["economy", "business", "first"], {
    message: "Select a flight class.",
  }),
});
