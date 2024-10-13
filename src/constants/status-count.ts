export enum TicketStatus {
  OPEN = "OPEN",
  PENDING = "PENDING",
  RESOLVE = "RESOLVE",
}


export enum BookingStatus {
  OPEN = "OPEN",
  PENDING = "PENDING",
  RESOLVE = "RESOLVE",
}

// Define TicketStatusCountsOptions outside of the component
export const TicketStatusCountsOptions = (ticketCounts: {
  [key in TicketStatus]: number;
}) => [
  {
    icon: "/icons/ticked.png",
    count: ticketCounts[TicketStatus.RESOLVE]?.toString() || "0", // Ticketed
    label: "Ticketed",
  },
  {
    icon: "/icons/pending.png",
    count: ticketCounts[TicketStatus.OPEN]?.toString() || "0", // Pending Ticketing
    label: "Pending Ticketing",
  },
  {
    icon: "/icons/pending-payment.png",
    count: ticketCounts[TicketStatus.PENDING]?.toString() || "0", // Pending Ticketing
    label: "Pending Payment",
  },
  {
    icon: "/icons/expired.png",
    count: "0", // Assuming you need a different logic for expired
    label: "Expired",
  },
  {
    icon: "/icons/failed.png",
    count: "0", // Assuming you need a different logic for failed bookings
    label: "Failed Booking",
  },
];



export const BookingStatusCountsOptions = (ticketCounts: {
  [key in BookingStatus]: number;
}) => [
  {
    icon: "/icons/ticked.png",
    count: ticketCounts[BookingStatus.RESOLVE]?.toString() || "0", // Ticketed
    label: "Ticketed",
  },
  {
    icon: "/icons/pending.png",
    count: ticketCounts[BookingStatus.OPEN]?.toString() || "0", // Pending Ticketing
    label: "Pending Ticketing",
  },
  {
    icon: "/icons/pending-payment.png",
    count: ticketCounts[BookingStatus.PENDING]?.toString() || "0", // Pending Ticketing
    label: "Pending Payment",
  },
  {
    icon: "/icons/expired.png",
    count: "0", // Assuming you need a different logic for expired
    label: "Expired",
  },
  {
    icon: "/icons/failed.png",
    count: "0", // Assuming you need a different logic for failed bookings
    label: "Failed Booking",
  },
];


