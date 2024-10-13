import { AdminStatus } from "@/redux/booking"; // Adjust the import path as needed

export const BookingStatusCountsOptions = (ticketCounts: {
  [key in AdminStatus]: number;
}) => [
  {
    icon: "/icons/ticked.png",
    count: ticketCounts[AdminStatus.TICKETED]?.toString() || "0",
    label: "Ticketed",
  },
  {
    icon: "/icons/pending.png",
    count: ticketCounts[AdminStatus.PENDING_TICKET]?.toString() || "0",
    label: "Pending Ticketing",
  },
  {
    icon: "/icons/pending-payment.png",
    count: ticketCounts[AdminStatus.PENDING_PAYMENT]?.toString() || "0",
    label: "Pending Payment",
  },
  {
    icon: "/icons/expired.png",
    count: ticketCounts[AdminStatus.EXPIRED]?.toString() || "0",
    label: "Expired",
  },
  {
    icon: "/icons/failed.png",
    count: ticketCounts[AdminStatus.FAILED_BOOKING]?.toString() || "0",
    label: "Failed Booking",
  },
];
