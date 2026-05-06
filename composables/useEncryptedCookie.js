import CryptoJS from "crypto-js";

export const useEncryptedCookie = (key, options = {}) => {
  const config = useRuntimeConfig();
  const secretKey = config.public.encryptionKey;

  if (!secretKey) {
    console.error("Encryption key is missing");
  }

  const cookie = useCookie(key, {
    encode: (value) => value, // We'll handle manually
    decode: (value) => value,
    ...options,
  });

  // Encrypt any value (string, number, object, array)
  const encryptValue = (value) => {
    if (!secretKey || value == null) return value;

    const stringValue =
      typeof value === "string" ? value : JSON.stringify(value);

    return CryptoJS.AES.encrypt(stringValue, secretKey).toString();
  };

  // Decrypt — return parsed object if valid JSON
  const decryptValue = (encrypted) => {
    if (!secretKey || !encrypted) return encrypted;

    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, secretKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);

      // Check if decrypted is JSON
      try {
        return JSON.parse(decrypted);
      } catch {
        return decrypted; // plain string
      }
    } catch {
      return encrypted; // fallback if data wasn't encrypted
    }
  };

  return {
    // Returns decrypted value
    get value() {
      return decryptValue(cookie.value);
    },

    // Encrypts and sets value
    set value(val) {
      cookie.value = encryptValue(val);
    },

    // For explicit clearing
    clear() {
      cookie.value = null;
    },
  };
};
