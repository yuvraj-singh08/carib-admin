export enum TicketStatus {
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
    label: "Resolved Tickets",
  },
  {
    icon: "/icons/pending.png",
    count: ticketCounts[TicketStatus.OPEN]?.toString() || "0", // Pending Ticketing
    label: "Open Tickets",
  },
  {
    icon: "/icons/pending-payment.png",
    count: ticketCounts[TicketStatus.PENDING]?.toString() || "0", // Pending Ticketing
    label: "Pending Tickets",
  },
];


