import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import CryptoJS from 'crypto-js'

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = nuxtApp.$pinia
  const config = useRuntimeConfig()
  const secretKey = config.public.encryptionKey

  if (!secretKey) {
    console.error("[PINIA-ENCRYPT] Missing public.encryptionKey")
  }

  const encrypt = (data) => {
    try {
      const json = JSON.stringify(data)
      return CryptoJS.AES.encrypt(json, secretKey).toString()
    } catch (e) {
      console.error("[PINIA-ENCRYPT] Encrypt failed:", e)
      return null
    }
  }

  const decrypt = (encrypted) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, secretKey)
      const decrypted = bytes.toString(CryptoJS.enc.Utf8)
      return JSON.parse(decrypted)
    } catch {
      console.warn("[PINIA-ENCRYPT] Decrypt failed → returning raw")
      return null
    }
  }

  pinia.use(({ store }) => {
    const key = `pinia_${store.$id}`

    // ---- LOAD ----
    const saved = localStorage.getItem(key)
    if (saved) {
      console.log("[PINIA-ENCRYPT] Loading encrypted state for:", store.$id)
      const data = decrypt(saved)
      if (data) {
        store.$patch(data)
      }
    }

    // ---- SAVE ----
    store.$subscribe((mutation, state) => {
      console.log("[PINIA-ENCRYPT] Saving encrypted state for:", store.$id)
      const encrypted = encrypt(state)
      if (encrypted) {
        localStorage.setItem(key, encrypted)
      }
    })
  })
})
