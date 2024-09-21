import z from "zod";

export const AdminFlightSearchSchema = z.object({
  type: z.enum(["oneway", "roundtrip", "multiway"]),
  from: z.string().min(2, { message: "Enter departure location" }),
  to: z.string().min(2, { message: "Enter arrival location" }),
  airline: z.string().optional(),
  departureDate: z.date(),
  flightClass: z.enum(["economy", "premium_economy", "business", "first"]),
  passengers: z.object({
    adults: z.number().min(1),
    children: z.number().min(0),
    infants: z.number().min(0),
  }),
});