// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  site: {
    url: "https://matta.trade",
  },

  nitro: {
    baseURL: "/",
    prerender: {
      crawlLinks: true,
    },
  },

  image: {
    inject: true,
    cloudinary: {
      baseURL: "https://res.cloudinary.com/arudovwen-me/image/upload/",
    },
  },

  modules: [
    "@nuxtjs/tailwindcss",
    "@vee-validate/nuxt",
    "@nuxtjs/color-mode",
    "@nuxtjs/google-fonts",
    "@pinia/nuxt",
    "nuxt-vue3-google-signin",
    "nuxt-simple-sitemap",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxt/image",
    // "nuxt-security",
    "@nuxt/devtools",
    "nuxt-ssr-cache",
    "@vite-pwa/nuxt",
    "@nuxt/test-utils/module",
    "nuxt-svgo",
    "@primevue/nuxt-module",
  ],

  veeValidate: {
    autoImports: true,
    componentNames: {
      Form: "VeeForm",
      Field: "VeeField",
      FieldArray: "VeeFieldArray",
      ErrorMessage: "VeeErrorMessage",
    },
  },

  primevue: {
    options: {
      unstyled: true,
    },
  },

  security: {
    hidePoweredBy: false,
    headers: {
      crossOriginEmbedderPolicy: "unsafe-none",
      contentSecurityPolicy: {
        "img-src": [
          "'self'",
          "https:",
          "data:",
          "https://gateway.oxidefinance.com",
          "https://res.cloudinary.com",
        ],
        "script-src": [
          "'self'",
          "https:",
          "'unsafe-inline'",
          "'strict-dynamic'",
          "'nonce-{{nonce}}'",
        ],
        "upgrade-insecure-requests": true,
      },
      xFrameOptions: "deny",
    },
  },

  runtimeConfig: {
    public: {
      environment: process.env.NODE_ENV,
      API_BASE_URL: process.env.API_BASE_URL,
      SSO_BASE_URL: process.env.SSO_BASE_URL,
      APP_BASE_URL: process.env.APP_BASE_URL,
      APP_MONNIFYAPIKEY: process.env.APP_MONNIFYAPIKEY,
      APP_MONNIFYCONTRACTCODE: process.env.APP_MONNIFYCONTRACTCODE,
      APP_MONNIFYISTEST: process.env.APP_MONNIFYISTEST,
      APP_MONNIFYISTESTMODE: process.env.APP_MONNIFYISTESTMODE,
      TINY_MCE: process.env.APP_TINYMCE_KEY,
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
      encryptionKey: process.env.ENCRYPTION_KEY,
    },
  },

  ssr: false,
  spaLoadingTemplate: true,

  router: {
    options: {
      linkActiveClass: "active",
      linkExactActiveClass: "exact-active",
    },
  },

  routeRules: {
    "/finance": { redirect: "/" },
  },

  plugins: ["~/plugins/axios.js"],

  googleSignIn: {
    clientId:
      "56799988480-4d51egljupar9la4djc2tknjodn2vsj5.apps.googleusercontent.com",
  },

  colorMode: {
    classSuffix: "",
  },

  css: [
    "vue-toastification/dist/index.css",
    "vue3-carousel/dist/carousel.css",
    "@programic/vue3-tooltip/dist/index.css",
    "~/assets/css/tailwind.css",
    "~/assets/scss/_button.scss",
    "~/assets/scss/_form.scss",
    "~/assets/scss/style.scss",
  ],

  googleFonts: {
    families: {
      // Avenir is loaded locally from /public/fonts/
    },
  },

  devtools: { enabled: process.env.NODE_ENV === "development" },

  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "Matta Profile",
      short_name: "Matta Profile",
      theme_color: "#1570EF",
      display: "standalone",
      icons: [
        {
          src: "/icons/android-icon-96x96.png",
          sizes: "96x96",
          type: "image/png",
        },
        {
          src: "/icons/android-icon-144x144.png",
          sizes: "144x144",
          type: "image/png",
        },
        {
          src: "/icons/android-icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any",
        },
      ],
      screenshots: [
        {
          src: "/shot2.png",
          type: "image/png",
          sizes: "436x720",
          form_factor: "narrow",
        },
        {
          src: "/shot1.png",
          type: "image/png",
          sizes: "1280x686",
          form_factor: "wide",
        },
      ],
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,png,svg,ico,json}"],
      maximumFileSizeToCacheInBytes: 5000000,
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600,
    },
  },

  app: {
    head: {
      title: "Account | Matta",
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1 ",
      meta: [
        {
          hid: "description",
          name: "description",
          content:
            "Matta is an online B2B platform that serves as a detailed and comprehensive market place for chemicals and materials. We aggregate demand from manufacturers, and supply from producers and importers into a single market place, creating an eco-system that ensures constant supply of essential raw materials within the economy. We also provide the necessary financial incentives and vehicles to aid the processes of supplier manufacturing, Importation and procurement.",
        },
        {
          hid: "og:title",
          property: "og:title",
          content: "Matta - Africa's Leading B2B Marketplace",
        },
        {
          hid: "og:description",
          property: "og:description",
          content:
            "Matta is an online B2B platform that serves as a detailed and comprehensive market place for chemicals and materials. We aggregate demand from manufacturers, and supply from producers and importers into a single market place, creating an eco-system that ensures constant supply of essential raw materials within the economy. We also provide the necessary financial incentives and vehicles to aid the processes of supplier manufacturing, Importation and procurement.",
        },
        {
          hid: "og:image",
          property: "og:image",
          content: "https://matta.trade/img/3.png",
        }, // Add OG image URL
        // Twitter Tags
        {
          hid: "twitter:card",
          name: "twitter:card",
          content: "https://matta.trade/img/3.png",
        }, // Use 'summary_large_image' for large images
        {
          hid: "twitter:title",
          name: "twitter:title",
          content: "Matta - Africa's Leading B2B Marketplace",
        },
        {
          hid: "twitter:description",
          name: "twitter:description",
          content:
            "Matta is an online B2B platform that serves as a detailed and comprehensive market place for chemicals and materials. We aggregate demand from manufacturers, and supply from producers and importers into a single market place, creating an eco-system that ensures constant supply of essential raw materials within the economy. We also provide the necessary financial incentives and vehicles to aid the processes of supplier manufacturing, Importation and procurement.",
        },
        {
          hid: "twitter:image",
          name: "twitter:image",
          content: "URL to your Twitter image",
        }, // Add Twitter image URL
        {
          name: "keywords",
          content:
            "Matta, Chemicals, Business, materials, manufacturers, producers, importers, raw materials, supplier",
        }, // Add relevant keywords
        { name: "author", content: "Success Ahon" }, // Add author information
        { name: "robots", content: "index, follow" }, // Control search engine indexing
        { name: "theme-color", content: "#1570EF" }, // Set the theme color for mobile browsers
      ],
      script: [{ src: "https://sdk.monnify.com/plugin/monnify.js" }],
    },
  },

  compatibilityDate: "2024-10-31",
});
