import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const KEY = Buffer.from(process.env.ENCRYPTION_KEY || "", "hex");

export function encrypt(text: string): string {
  if (KEY.length !== 32) {
    throw new Error("ENCRYPTION_KEY must be 32 bytes (64 hex characters)");
  }

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decrypt(encryptedText: string): string {
  if (KEY.length !== 32) {
    throw new Error("ENCRYPTION_KEY must be 32 bytes (64 hex characters)");
  }

  const [ivHex, tagHex, dataHex] = encryptedText.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");
  const data = Buffer.from(dataHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  decipher.setAuthTag(tag);

  return decipher.update(data) + decipher.final("utf8");
}

export function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString("hex");
}
