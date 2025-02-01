<template>
  <!-- <NuxtLayout> -->
  <NuxtPwaManifest />
  <NuxtPage />
  <!-- </NuxtLayout> -->
</template>
<script setup>
useHead(
  {
    script: [
      {
        src: "https://sdk.monnify.com/plugin/monnify.js",

        defer: true,
      },
      {
        src: "https://kit.fontawesome.com/c1a534ffdb.js",
        crossorigin: "anonymous",
        defer: true,
      },
    ],
    link: [
      {
        rel: "stylesheet",
        href: "https://unicons.iconscout.com/release/v4.0.0/css/line.css",
      },
    ],
  },
  {
    mode: "client", // Load the script 'strict-dynamically' on client-side only
  }
);

onMounted(() => {
  const mattaProfiles = useCookie('mattaProfiles')
  console.log("🚀 ~ onMounted ~ mattaProfiles:", mattaProfiles.value)
  useAuthStore();
});
</script>

<style>
html {
  scroll-behavior: smooth;
  box-sizing: border-box;
}
body {
  font-family: "Rubik", sans-serif;
  color: #475467;
}

.dark-mode {
  @apply text-white bg-gray-800;
}

.light-mode {
  @apply text-[#475467] bg-white;
}

.recommended .carousel__viewport .carousel__track {
  column-gap: 24px;
  @media (max-width: 768px) {
    column-gap: 16px;
  }
  @media (max-width: 465px) {
    column-gap: 10px;
  }
  .carousel__prev {
    left: -26px !important;
  }
  .carousel__next {
    right: -26px !important;
  }
}
.carousel__viewport .carousel__track {
  column-gap: 34px;
  @media (max-width: 768px) {
    column-gap: 16px;
  }
  @media (max-width: 465px) {
    column-gap: 10px;
  }
}
.carousel__prev {
  left: -26px !important;
}
.carousel__next {
  right: -26px !important;
}
body::-webkit-scrollbar,
body {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

/* width */
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #ffffff;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #ececec;
  border-radius: 8px;
  height: 100px;
}

::-webkit-scrollbar:horizontal {
  width: 5px;
  height: 5px;
}

/* Track */
::-webkit-scrollbar-track:horizontal {
  background: #ffffff;
}

/* Handle */
::-webkit-scrollbar-thumb:horizontal {
  background: #ececec;
  width: 50px;
  border-radius: 8px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  opacity: 0.9;
}
label,
.input-label {
  color: #344054 !important;
  font-size: 14px;
}
</style>
