import { flightDetailsBlocks } from "@/constants/flight-city-details-sheet";
import { clsx, type ClassValue } from "clsx";
import moment from "moment";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const seasons = ["SPRING", "SUMMER", "WINTER"];

export function generateRandomCouponCode(): string {
  // Get a random season
  const randomSeason = seasons[Math.floor(Math.random() * seasons.length)];

  // Generate a secure random number between 0 and 65535
  const randomValue = window.crypto.getRandomValues(new Uint16Array(1))[0];

  // Convert the random value to a hexadecimal string and take the first 4 chars
  const randomHex = randomValue.toString(16).toUpperCase().padStart(4, "0");

  // Combine the season with the random hex code
  const couponCode = `${randomSeason}${randomHex}`;

  // Return the first 8 characters
  return couponCode.slice(0, 8);
}

export const getCityByCode = (cityCode: string) => {
  for (const block of flightDetailsBlocks) {
    if (block.code === cityCode) {
      return block.city;
    }
  }
  return undefined;
};

export const flightDuration = (departing_at: string, arriving_at: string) => {
  const departingDate = new Date(departing_at);
  const arrivingDate = new Date(arriving_at);
  const diff = arrivingDate.getTime() - departingDate.getTime();
  const hours = Math.floor(diff / 1000 / 60 / 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  return `${hours}h ${minutes}m`;
};
export const LayoverTime = (departing_at: string, arriving_at: string) => {
  const lastFlightArrivalTime = moment(departing_at);
  const nextFlightDepartureTime = moment(arriving_at);

  let mins = Math.abs(
    lastFlightArrivalTime.diff(nextFlightDepartureTime, "minutes")
  );
  const hours = Math.floor(mins / 60);
  mins = mins % 60;

  return mins === 0 ? `${hours}hr` : `${hours}hr ${mins}min`;
};
