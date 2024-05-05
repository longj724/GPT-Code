import { randomBytes, createCipheriv, createDecipheriv } from "crypto";

// Encryption and decryption setup
const algorithm = "aes-256-cbc"; // AES 256 CBC mode
const key = randomBytes(32); // Key should be 256 bits (32 bytes)
const iv = randomBytes(16); // IV should be 128 bits (16 bytes)

export type EncryptionData = {
  iv: Buffer;
  encryptedData: string;
};

// Function to encrypt text
export const encrypt = (text: string): EncryptionData => {
  const cipher = createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return {
    iv,
    encryptedData: encrypted,
  };
};

// Function to decrypt text
export const decrypt = (encryptionData: EncryptionData): string => {
  const decipher = createDecipheriv(algorithm, key, encryptionData.iv);
  let decrypted = decipher.update(encryptionData.encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};
