// External Dependencies

// Relative Dependencies
import crypto from "crypto";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const modelDisplayNameToNameMap: Record<string, string> = {
  "GPT-3.5 Turbo": "gpt-3.5-turbo",
  "GPT-4 Turbo": "gpt-4-turbo",
  "GPT-4o": "gpt-4o",
  "LLaMA3 8b": "llama3-8b-8192",
  "LLaMA3 70b": "llama3-70b-8192",
  "Mixtral 8x7b": "mixtral-8x7b-32768",
  "Gemma 7b": "gemma-7b-it",
};

export const modelNameToDisplayNameMap: Record<string, string> = {
  "gpt-3.5-turbo": "GPT-3.5 Turbo",
  "gpt-4-turbo": "GPT-4 Turbo",
  "gpt-4o": "GPT-4o",
  "llama3-8b-8192": "LLaMA3 8b",
  "llama3-70b-8192": "LLaMA3 70b",
  "mixtral-8x7b-32768": "Mixtral 8x7b",
  "gemma-7b-it": "Gemma 7b",
};

const algorithm = "aes-256-cbc";
const key: Buffer = crypto.randomBytes(32);

export const encrypt = (text: string) => {
  const iv: Buffer = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
};

export type DecryptionInput = {
  iv: string;
  encryptedData: string;
};

export const decrypt = (text: DecryptionInput) => {
  const decryptiv = Buffer.from(text.iv, "hex");
  const encryptedText = Buffer.from(text.encryptedData, "hex");
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(key),
    decryptiv,
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

export const modelNameToChatEndpoint = (modelDisplayName: string) => {
  const modelName = modelDisplayNameToNameMap[modelDisplayName];
  switch (modelName) {
    case "gpt-3.5-turbo":
    case "gpt-4-turbo":
    case "gpt-4o":
      return "/api/openai/send-message";
    case "llama3-8b-8192":
    case "llama3-70b-8192":
    case "mixtral-8x7b-32768":
    case "gemma-7b-it":
      return "/api/groq/send-message";
    default:
      return "/api/openai/send-message";
  }
};
