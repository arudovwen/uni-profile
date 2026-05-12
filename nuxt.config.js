// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  site: {
    url: "https://matta.trade",
  },

  nitro: {
    baseURL: "/",
    prerender: {
      crawlLinks: false,
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
    "nuxt-security",
    "@nuxt/devtools",
    "@vite-pwa/nuxt",
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
    ssg: false,
    hidePoweredBy: true,
    // Disable server-side middleware (not applicable in SPA mode with ssr: false)
    rateLimiter: false,
    requestSizeLimiter: false,
    xssValidator: false,
    corsHandler: false,
    allowedMethodsRestricter: false,
    removeLoggers: false,
    headers: {
      crossOriginEmbedderPolicy: "unsafe-none",
      contentSecurityPolicy: {
        // Form submissions
        "form-action": [
          "'self'",
          "https://www.facebook.com",
          "https://www.google.com",
          "https://*.matta.trade",
        ],

        // Scripts — self, Facebook, and all Google services
        "script-src": [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "https://*.matta.trade",
          // Google Tag Manager
          "https://www.googletagmanager.com",
          // Google Analytics / gtag.js
          "https://www.google-analytics.com",
          "https://ssl.google-analytics.com",
          // Google Ads & Conversion tracking
          "https://www.googleadservices.com",
          "https://googleads.g.doubleclick.net",
          // Google APIs (Maps, etc.)
          "https://maps.googleapis.com",
          // Facebook Pixel
          "https://connect.facebook.net",
          // IP Geolocation (already in head)
          "https://cdn.jsdelivr.net",
          // Microsoft Clarity
          "https://www.clarity.ms",
        ],

        // XHR / fetch / WebSocket connections
        "connect-src": [
          "'self'",
          // Matta APIs
          "https://*.matta.trade",
          // Google Analytics & GTM
          "https://www.google-analytics.com",
          "https://analytics.google.com",
          "https://stats.g.doubleclick.net",
          "https://www.googletagmanager.com",
          // Google Ads
          "https://www.googleadservices.com",
          "https://googleads.g.doubleclick.net",
          // Facebook
          "https://www.facebook.com",
          "https://mpc-prod-25-s6uit34pua-wl.a.run.app", // Facebook/Google event processing
          // Microsoft Clarity
          "https://www.clarity.ms",
          // Iconify API fallback (icons not found in local @iconify-json bundles)
          "https://api.iconify.design",
          "https://api.simplesvg.com",
          "https://api.unisvg.com",
        ],

        // Images (pixel tracking beacons etc.)
        "img-src": [
          "'self'",
          "data:",
          "https:",
          // Matta
          "https://*.matta.trade",
          "https://res.cloudinary.com",
          "https://matta.s3.us-east-1.amazonaws.com",
          // Google tracking pixels
          "https://www.google-analytics.com",
          "https://www.googletagmanager.com",
          "https://www.google.com",
          "https://googleads.g.doubleclick.net",
          "https://www.googleadservices.com",
          // Facebook pixel
          "https://www.facebook.com",
          "https://mpc-prod-25-s6uit34pua-wl.a.run.app",
          "https://demo-1.conversionsapigateway.com",
        ],

        // iFrames (GTM tag preview, Google Ads conversion, reCAPTCHA)
        "frame-src": [
          "'self'",
          "https://*.matta.trade",
          "https://www.googletagmanager.com",
          "https://td.doubleclick.net",
          "https://www.google.com",
          "https://www.youtube.com",
          "https://www.facebook.com",
          "https://*.facebook.net",
          "https://*.facebook.com",
        ],

        // Web fonts
        "font-src": [
          "'self'",
          "data:",
          "https://fonts.gstatic.com",
          "https://unicons.iconscout.com",
        ],

        // Stylesheets
        "style-src": [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
          "https://unicons.iconscout.com",
        ],

        "upgrade-insecure-requests": true,
      },
      xFrameOptions: "DENY",
    },
  },

  runtimeConfig: {
    public: {
      environment: process.env.NODE_ENV,
      API_BASE_URL: process.env.API_BASE_URL,
      SSO_BASE_URL: process.env.SSO_BASE_URL,
      APP_BASE_URL: process.env.APP_BASE_URL,
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
    clientId: process.env.GOOGLE_CLIENT_ID || "",
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
    },
  },

  compatibilityDate: "2024-10-31",
  experimental: {
    appManifest: false,
  },
});
