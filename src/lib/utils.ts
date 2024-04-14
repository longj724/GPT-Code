import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const modelToNameMap: { [key: number]: string } = {
  1: "GPT-3.5-Turbo",
  2: "GPT-4-Turbo",
};

export const modelNameToIDMap: { [key: string]: number } = {
  "GPT-3.5-Turbo": 1,
  "GPT-4-Turbo": 2,
};

export const modelDisplayNameToNameMap: { [key: string]: string } = {
  "GPT-3.5-Turbo": "gpt-3.5-turbo",
  "GPT-4-Turbo": "gpt-4-turbo",
};
