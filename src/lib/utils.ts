// External Dependencies

// Relative Dependencies
import crypto from "crypto";
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

const algorithm = "aes-256-cbc";
const key: Buffer = crypto.randomBytes(32);
const iv: Buffer = crypto.randomBytes(16);

export const encrypt = (text: string) => {
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
};

interface DecryptionInput {
  iv: string;
  encryptedData: string;
}

export const decrypt = (text: DecryptionInput) => {
  let iv = Buffer.from(text.iv, "hex");
  let encryptedText = Buffer.from(text.encryptedData, "hex");
  let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};
