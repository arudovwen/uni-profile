// composables/useEncryption.js
import CryptoJS from "crypto-js";

// Encryption function
export const useEncryption = () => {
  const encrypt = (data) => {
    const config = useRuntimeConfig();
    const secretKey = config.public.encryptionKey;
    if (!secretKey) {
      console.error("Encryption key is missing");
      return;
    }

    // Encrypt the data using AES and the provided secret key
    const encrypted = CryptoJS.AES.encrypt(data, secretKey).toString();
    return encrypted;
  };

  // Decryption function
  const decrypt = (encryptedData) => {
    const config = useRuntimeConfig();
    const secretKey = config.public.encryptionKey; // Get the secret key from environment variables
    if (!secretKey) {
      console.error("Encryption key is missing");
      return;
    }

    // Decrypt the data using AES and the provided secret key
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8); // Convert the decrypted bytes back to a string
    return decrypted;
  };

  // Return the encryption and decryption functions so that they can be used in other components
  return {
    encrypt,
    decrypt,
  };
};
