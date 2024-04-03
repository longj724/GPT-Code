import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const modelToNameMap: { [key: number]: string } = {
  1: "GPT-3.5-Turbo",
  2: "GPT-4-Turbo",
};
