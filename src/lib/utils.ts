import { flightDetailsBlocks } from "@/constants/flight-city-details-sheet";
import { clsx, type ClassValue } from "clsx";
import moment from "moment";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const seasons = ["SPRING", "SUMMER", "WINTER"];

export function  generateRandomCouponCode(): string {
  const randomSeason = seasons[Math.floor(Math.random() * seasons.length)];
  const randomNumber = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  const couponCode = `${randomSeason}${randomNumber}`;
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
