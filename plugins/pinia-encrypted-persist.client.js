import { defineNuxtPlugin, useRuntimeConfig } from "#app";

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = nuxtApp.$pinia;
  const config = useRuntimeConfig();
  const { encrypt, decrypt } = useEncryption();
  const secretKey = config.public.encryptionKey;

  if (!secretKey) {
    console.error("[PINIA-ENCRYPT] Missing public.encryptionKey");
  }

  pinia.use(({ store }) => {
    const key = `pinia_${store.$id}`; // ✅ ONLY key
    const legacyKey = store.$id; // ❌ NEVER allowed

    /* ======================
       HARD DELETE legacy key
       ====================== */
    localStorage.removeItem(legacyKey);
    // ---- LOAD ----
    const saved = localStorage.getItem(key);
    if (saved) {
      console.log("[PINIA-ENCRYPT] Loading encrypted state for:", store.$id);
      const data = decrypt(saved);
      if (data) {
        store.$patch(data);
      }
    }

    // ---- SAVE ----
    store.$subscribe((mutation, state) => {
      console.log("[PINIA-ENCRYPT] Saving encrypted state for:", store.$id);
      const encrypted = encrypt(state);
      if (encrypted) {
        localStorage.setItem(key, encrypted);
      }
    });
  });
});
