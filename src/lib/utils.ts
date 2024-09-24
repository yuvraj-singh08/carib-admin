import { clsx, type ClassValue } from "clsx";
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
