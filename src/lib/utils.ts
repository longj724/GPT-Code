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
  3: "LLaMA3 8b",
  4: "LLaMA3 70b",
  5: "Mixtral 8x7b",
  6: "Gemma 7b",
};

export const modelNameToIDMap: { [key: string]: number } = {
  "GPT-3.5-Turbo": 1,
  "GPT-4-Turbo": 2,
  "LLaMA3 8b": 3,
  "LLaMA3 70b": 4,
  "Mixtral 8x7b": 5,
  "Gemma 7b": 6,
};

export const modelDisplayNameToNameMap: { [key: string]: string } = {
  "GPT-3.5-Turbo": "gpt-3.5-turbo",
  "GPT-4-Turbo": "gpt-4-turbo",
  "LLaMA3 8b": "llama3-8b-8192",
  "LLaMA3 70b": "llama3-70b-8192",
  "Mixtral 8x7b": "mixtral-8x7b-32768",
  "Gemma 7b": "gemma-7b-it",
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

export type DecryptionInput = {
  iv: string;
  encryptedData: string;
};

export const decrypt = (text: DecryptionInput) => {
  let decryptiv = Buffer.from(text.iv, "hex");
  let encryptedText = Buffer.from(text.encryptedData, "hex");
  let decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(key),
    decryptiv,
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

export const modelIDToChatEndpoint = (modelName: string) => {
  const modelID = modelNameToIDMap[modelName];
  switch (modelID) {
    case 1:
    case 2:
      return "/api/openai/send-message";
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
      return "/api/groq/send-message";
    default:
      return "/api/openai/send-message";
  }
};
