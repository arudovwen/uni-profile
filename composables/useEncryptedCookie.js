/**
 * @typedef {import('#app').CookieOptions} CookieOptions
 * @typedef {import('#app').CookieRef} CookieRef
 */

import CryptoJS from "crypto-js";

/** @type {CookieOptions} */
const defaultOptions = {
  sameSite: "lax",
  path: "/",
  secure: process.env.NODE_ENV === "production",
};

const ENCRYPTED_PREFIX = "ENC:";

const tryParseJson = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const encryptValue = (value, secretKey) => {
  if (value === null || value === undefined) return value;

  const stringValue =
    typeof value === "string" ? value : JSON.stringify(value);

  return `${ENCRYPTED_PREFIX}${CryptoJS.AES.encrypt(stringValue, secretKey).toString()}`;
};

const decryptValue = (value, secretKey) => {
  if (value === null || value === undefined) return value;
  if (typeof value !== "string") return value;
  if (!value.startsWith(ENCRYPTED_PREFIX)) {
    return tryParseJson(value);
  }

  try {
    const encrypted = value.slice(ENCRYPTED_PREFIX.length);
    const bytes = CryptoJS.AES.decrypt(encrypted, secretKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return tryParseJson(decrypted);
  } catch {
    return tryParseJson(value);
  }
};

/**
 * @param {string} key
 * @param {Record<string, any>} [options]
 * @returns {CookieRef<any>}
 */
export const useEncryptedCookie = (key, options = {}) => {
  const config = useRuntimeConfig();
  const secretKey = config?.public?.encryptionKey;
  const isEncryptionEnabled = typeof secretKey === "string" && secretKey.length > 0;

  if (!isEncryptionEnabled && process.client) {
    console.warn(
      `useEncryptedCookie(${key}): encryption key is missing. Cookie values will be stored without encryption.`
    );
  }

  return useCookie(key, {
    ...defaultOptions,
    ...options,
    encode: (value) => {
      if (value === null || value === undefined) return value;
      if (!isEncryptionEnabled) return typeof value === "string" ? value : JSON.stringify(value);
      return encryptValue(value, secretKey);
    },
    decode: (value) => {
      if (value === null || value === undefined) return value;
      if (!isEncryptionEnabled) return tryParseJson(value);
      return decryptValue(value, secretKey);
    },
  });
};
