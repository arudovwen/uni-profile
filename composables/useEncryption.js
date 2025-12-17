// composables/useEncryption.js
import CryptoJS from "crypto-js";

export const useEncryption = () => {
  const encrypt = (data) => {
    const config = useRuntimeConfig();
    const secretKey = config.public.encryptionKey;

    if (!secretKey) {
      console.error("Encryption key is missing");
      return;
    }

    try {
      // Convert objects or arrays to JSON
      const value =
        typeof data === "object" ? JSON.stringify(data) : String(data);

      const encrypted = CryptoJS.AES.encrypt(value, secretKey).toString();
      return encrypted;
    } catch (error) {
      console.error("Encryption failed:", error);
      return null;
    }
  };

  const decrypt = (encryptedData) => {
    try {
      const config = useRuntimeConfig();
      const secretKey = config.public.encryptionKey;

      if (!secretKey) {
        console.error("Encryption key is missing");
        return;
      }

      const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);

      // If it’s not valid UTF-8, return original encrypted value
      if (!decrypted) return encryptedData;

      // Try converting JSON back to object
      try {
        return JSON.parse(decrypted);
      } catch {
        // If not JSON, return as plain string
        return decrypted;
      }
    } catch (error) {
      // Return original encrypted string on failure
      return encryptedData;
    }
  };

  return {
    encrypt,
    decrypt,
  };
};
